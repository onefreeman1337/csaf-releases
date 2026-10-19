# AnimNotify Event Rebinder — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** AnimNotify Event Rebinder  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-10-19


---

# AnimNotify Event Rebinder

Unreal Engine 5.8 editor plugin (Win64). Copyright (c) 2026 Core Systems Asset Factory.

## The problem

An Anim Blueprint receives a skeleton notify through an event node named `AnimNotify_<Name>`. The engine finds that event
**by name** when the animation plays, and when no function of that name exists it does nothing: no error, no warning.

Unreal's own notify rename never touches those events:

- **Find and Replace** (notifies) renames the notify in your animations and on the skeleton list. Every
  `AnimNotify_<OldName>` event in every Anim Blueprint keeps the old name and never fires again.
- **The Animation Notifies window** renames the skeleton list only. The animations keep playing the old name, and an
  event you add from the menu under the new name never fires.
- **Mirror data tables** keep pairing the old name.

Epic closed this as Won't Fix. This plugin finds the damage and carries a rename everywhere the name lives.

## What it does

`-run=AnimNotifyRebind` is a commandlet, so it runs headless and in CI.

**Audit** (writes nothing):

```
UnrealEditor-Cmd.exe YourProject.uproject -run=AnimNotifyRebind -Scope=+Game/Characters
```

For every Anim Blueprint in scope it lists each `AnimNotify_` receiver and judges it against what its target skeleton
really carries:

- **fires**: an animation of that skeleton carries the notify.
- **never fires**: the skeleton lists the name but no animation carries it, or nothing on the skeleton has that name.
- the number of nodes wired off each event (what silently stops running).

It also prints a table of every notify name per skeleton (listed on the skeleton, carried by how many animations,
received by how many events, named by how many mirror rows) and the mirror table notify rows that name a notify the
skeleton no longer has.

**Proposals.** When a name with dead events and a carried name no event receives share words (`Footstep_L` and
`FS_Foot_L`), or when a name the animations carry is missing from the skeleton list and the list holds a similar name no
animation carries, the audit proposes that rename and prints the exact command. A proposal is only made when each side is
the other's single best match by shared words: `AttackHit` beside both `Attack_Impact` and `SaveAttack` is a tie, and
nothing is proposed. A proposal is never applied by itself.

**Rename** (preview, writes nothing):

```
-run=AnimNotifyRebind -Skeleton=+Game/Characters/Mannequins/Meshes/SK_Mannequin -Rename=Footstep_L:FS_Foot_L,AttackHit:Attack_Impact -Scope=+Game/Characters
```

The preview lists every place the rename touches: the skeleton list entry, every animation that carries the old name,
every Anim Blueprint event, every mirror table row.

**Apply**: add `-Apply`. In this order:

1. Everything that would block it is found first, before anything is written (see Refusals).
2. Every package to be changed is copied byte for byte into a journal under
   `Saved/AnimNotifyEventRebinder/Journal/<stamp>/`.
3. The skeleton list entry is renamed, each animation's notifies are renamed, each mirror row is renamed, and each
   `AnimNotify_<Old>` event node is renamed to `AnimNotify_<New>`. The event keeps its wiring; the tool counts the nodes
   it drives before and after and refuses to call the run confirmed if the count changes.
4. Each touched Anim Blueprint is compiled once, and its compiled class is checked for the new `AnimNotify_<New>` function
   (the function the engine looks up) and for the absence of the old one.
5. Everything is saved, then a fresh scan must find no place still carrying the old name.

**Undo**: `-run=AnimNotifyRebind -Undo=<stamp>` puts every journalled package back byte for byte.

**CI**: `-FailOnStale` exits 5 while any notify event in scope never fires.

Every run writes an HTML report to `Saved/AnimNotifyEventRebinder/Reports/`.

## Refusals (Apply writes nothing)

- An animation outside `-Scope` carries the old name (renaming only some animations would split the notify in two).
- An Anim Blueprint for this skeleton sits outside `-Scope` (its events were not read).
- An Anim Blueprint already receives both the old and the new name (merge those two events by hand first).
- The old name is received by a Custom Event or a function named `AnimNotify_<Old>`, or declared in the Anim Blueprint's
  C++ parent class (those have callers or code the tool does not rewrite).
- A template Anim Blueprint receives the old name (it serves every skeleton).
- A file to be written is read-only on disk (check it out of source control first).
- Nothing on the skeleton names the old notify.

## Arguments

| Argument | Meaning |
| --- | --- |
| `-Scope=+Game/A[+Game/B]` | Required. Content folders whose Anim Blueprints and mirror tables are read and may be written. `+` stands for a leading `/`. |
| `-Skeleton=+Game/Path/SK_Name` | The skeleton whose notify is renamed. Required with `-Rename`. |
| `-Rename=Old:New[,Old2:New2]` | One or more renames on that skeleton. A chain (`A:B,B:C`) or two names onto one is refused: run them separately. |
| `-Apply` | Write the rename. |
| `-FailOnStale` | Exit 5 while any event in scope never fires. |
| `-Undo=<stamp>` | Restore a journal. |
| `-Help` | Print the arguments and exit codes. |
| `-ExitOnFinish` | Request engine exit at the end of the run (for editor sessions). |

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Done. |
| 2 | Bad arguments, an empty scope, or no animation in the asset registry. |
| 4 | `-Apply` refused; nothing was written. |
| 5 | `-FailOnStale`: at least one event never fires. |
| 6 | Written but not confirmed (a save failed, a compile broke, the wiring changed, or an old name survived); the journal can undo it. |
| 7 | `-Undo` failed. |

## How it reads your project

- Skeleton notify lists and every animation's notify names are read from **asset registry tags**: no animation is loaded
  to be judged. Animations are read project-wide, because an animation outside the scope still fires into an Anim
  Blueprint inside it.
- Anim Blueprints and mirror data tables inside `-Scope` are opened, because events live in graphs.
- Only skeleton notifies (named notifies) are in scope. Notify classes (`UAnimNotify` and `UAnimNotifyState`
  Blueprints), Montage Notify names and sync markers are not read or rewritten.

## Install

Copy the `AnimNotifyEventRebinder` folder into your project's `Plugins` folder and enable it. Unreal Engine 5.8, Win64,
editor only. Nothing ships in a packaged game.

## AI disclosure

This plugin's code and its store images were produced with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
