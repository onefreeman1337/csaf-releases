# Bone & Socket Rename Surgeon — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Bone & Socket Rename Surgeon  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-10-21


---

# Bone & Socket Rename Surgeon

**Unreal Engine 5.8 · editor plugin · Win64 · by Core Systems Asset Factory**

Rename a socket in the Skeleton Tree and Unreal renames the socket object and its preview attachments. It does not
touch the Blueprint component that was attached to it, the Blueprint variable that names it, the node pin that spawns
an effect on it, or the animation notify that plays a sound there. Every one of them keeps the old name and resolves
to nothing, silently: the sword spawns at the character's origin and nothing in the Output Log says why. Bones have
the same problem after a re-import or a Skeleton Editing rename (a physics asset built for `Hips` on a skeleton whose
root is `pelvis`).

This plugin does two things:

1. **Audit.** For one skeleton, it finds every stored bone and socket name in the assets that reference that skeleton
   or its skeletal meshes, and lists each one that resolves to no bone and no socket, with every place that holds it.
2. **Rename.** It carries a rename through every one of those places at once, journals the original bytes first,
   compiles each touched Blueprint once, saves, then re-scans to prove nothing still holds the old name.

## Install

1. Close the editor.
2. Copy the `BoneSocketRenameSurgeon` folder into your project's `Plugins` folder (create `Plugins` if it does not
   exist), so you have `<YourProject>/Plugins/BoneSocketRenameSurgeon/BoneSocketRenameSurgeon.uplugin`.
3. Open the project. Unreal offers to build the module; accept. The plugin is enabled once it is in `Plugins`.

Built and tested against **Unreal Engine 5.8** on Windows. No other engine version has been run.

## Run it

Everything is one commandlet. Run it from a terminal, with the editor closed:

```
"C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" "C:\Path\To\YourProject.uproject" -run=BoneSocketRename -Skeleton=+Game/Characters/Mannequins/Meshes/SK_Mannequin -Scope=+Game/Characters -unattended -nopause
```

Content paths are written with a leading `+` instead of `/` (`+Game/Characters`). That keeps shells such as Git Bash
from rewriting `/Game` into a Windows path. List several scope folders by joining them: `-Scope=+Game/Characters+Game/Weapons`.

| Switch | What it does |
| --- | --- |
| `-Skeleton=+Game/...` | The skeleton whose bones and sockets are judged. Required. |
| `-Scope=+Game/...` | The content folders read and, with `-Apply`, rewritten (the skeleton and its meshes are always read). Required: it never reads a whole project by default. |
| `-FailOnDangling` | Audit only: exit 5 while any stored name in scope resolves to nothing. For CI. |
| `-Rename=Old:New` | Preview a rename. Several at once: `-Rename=Old:New,Old2:New2`. Writes nothing. |
| `-Apply` | With `-Rename`: write it. Refuses, writing nothing, on any doubt (below). |
| `-Undo=<journal stamp>` | Put back every package a run wrote, byte for byte. The stamp is printed by `-Apply`. |
| `-Help` | Print the switches and the exit codes. |
| `-ExitOnFinish` | Request engine exit when the run ends (for use inside an editor session). |

Every run writes a report to `Saved/BoneSocketRenameSurgeon/Reports/BSR_<time>.html`: the names that resolve to
nothing, every place each one is held, the closest existing name, and for a rename every place it will touch.

### The two kinds of rename

* **Old is a live socket** (it still exists): the socket itself is renamed on the skeleton or mesh that owns it,
  together with every place that holds the name.
* **Old no longer exists** (it was renamed elsewhere, in the Skeleton Tree or by a re-import): every place that still
  holds it is moved to New. New must be a bone or socket that exists.

This tool never edits a bone hierarchy. To rename a bone, rename it first (Skeleton Editing, or a re-import), then run
the second kind to move everything that still holds the old name.

## What it reads

The asset registry is asked which packages reference the skeleton or one of its skeletal meshes (plus each mesh's
physics asset). The ones inside `-Scope` are opened, together with the skeleton and its meshes (always, wherever they
live: a socket rename starts on them), and every field whose name says bone, socket, attach or joint is read, in
objects, structs and arrays:

* Blueprint components attached to a socket, Blueprint variables (class defaults) that hold a socket or bone name,
  and unconnected Name pins on Blueprint nodes (`Spawn Emitter Attached`, for example).
* Anim Blueprint graph nodes (bone references such as `Modify Bone`) and Anim Blueprint event graph pins.
* Animation notifies: Play Particle Effect, Play Sound, and any notify class with such a field.
* Physics asset bodies and constraints. A constraint's own name follows a bone rename when it is named after that bone,
  and is never reported as dangling: the Physics Asset editor names a constraint you add by hand `UserConstraint`,
  which is not a bone and is not meant to be.
* The skeleton and its meshes: the sockets themselves, which is where a socket rename starts.

A name is judged against the skeleton's bones, every mesh's bones, and every socket on the skeleton and its meshes.
When an asset also references another skeleton, skeletal mesh or static mesh, that asset's bones and sockets count
too: a component attached to a socket on a prop's static mesh is not reported as dangling. A Blueprint component is
also judged against the component it is attached to, so a camera on a spring arm's built-in `SpringEndpoint` socket
(Epic's Third Person character has one) is not reported either.

### What 1.0 does not read

These are listed by name in the report, never skipped silently:

* **Maps** and **World Partition actor packages** that reference the skeleton, its meshes, or a Blueprint that does.
  An actor placed in a level and attached to a socket keeps the old name.
* **Control Rig** assets. Their hierarchy keys are not read.
* Packages outside `-Scope`.
* A bone or socket pin wired to another node: its value is computed while the game runs, so it is counted, never judged.
* A name held inside a map or set field, or built from a string at runtime.

## When `-Apply` refuses

`-Apply` writes nothing and exits 4 when any of these hold. The report and the log name each reason:

* Old is a socket and New already names a bone or socket on the skeleton or its meshes.
* Old is still a bone on a skeletal mesh of the skeleton (rename the bone first).
* Old no longer exists and New names no bone and no socket either.
* An asset that holds Old also references another skeleton or mesh that has its own Old: the tool cannot tell which
  one each place means.
* A Blueprint component holding Old is attached to another component that has its own Old socket.
* A package it would write is read-only on disk (check it out of source control first).
* A socket rename while packages outside `-Scope` reference the skeleton (widen `-Scope`).
* Nothing read holds Old.

## After `-Apply`

The packages it will change are copied into `Saved/BoneSocketRenameSurgeon/Journal/<stamp>/` before the first write.
Each touched Blueprint is compiled once after every rewrite, physics assets are re-indexed, and every package is
saved. Then the whole scan runs again from scratch: if any place still holds an old name, or a save failed, or a
Blueprint that compiled before no longer compiles, the run exits 6 and prints the `-Undo` command.

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Done. |
| 2 | Bad arguments (unknown skeleton, empty scope, a malformed rename list). |
| 4 | Refused. Nothing was written. |
| 5 | `-FailOnDangling`: stored names resolve to nothing. |
| 6 | Written but not confirmed. Run the printed `-Undo`. |
| 7 | Undo failed. |

Codes 1 and 3 are never used by this tool: Unreal itself returns 3 when the process crashes and 1 when anything
logged an error, so neither can mean "refused, nothing changed".

## Support

<https://csaf.itch.io> · Documentation: <https://github.com/onefreeman1337/csaf-releases/blob/main/docs/bone-socket-rename-surgeon/README.md>

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
