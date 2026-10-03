# MetaSound Parameter Surgeon — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** MetaSound Parameter Surgeon  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-10-03


---

# MetaSound Parameter Surgeon

**For Unreal Engine 5.8. Windows (Win64). Editor plugin, run as a commandlet.**

You renamed one input on a MetaSound, `Cutoff` to `CutoffHz`. The MetaSound editor did exactly that.
Nothing else followed. Every Blueprint *Set Float Parameter* (and its siblings), every *Spawn Sound* chain
and every audio component's *Default Parameters* entry still sets `Cutoff`. Nothing errors, nothing
warns, and the sound simply stops responding to them.

The parameter name is a plain `FName` on a pin. No reference connects it to the MetaSound, so neither
*Find in Blueprints* nor the reference viewer can tell which of the `Cutoff` nodes in your project
belong to **this** MetaSound and which drive another sound that also has a `Cutoff`.

MetaSound Parameter Surgeon decides that from the assets, carries the ones that belong to it, leaves
the others alone **by name**, and refuses anything it cannot decide.

---

## What it does

1. **Finds every place a Blueprint in your `-Scope` sets an audio parameter by name**: the `InName`
   pin of every setter the engine exposes (found by walking the engine's reflection data, not a
   list: 15 in 5.8, including the four `UAudioComponent` declares on its own), and every entry in the
   *Default Parameters* of the audio components your Blueprints own.
2. **Decides which sound each one drives, from the asset alone.** It follows the node's target to:
   - a component the Blueprint's construction script creates, including one **inherited** from a
     parent Blueprint, and a parent's component **overridden** in this Blueprint (the override wins);
   - a component declared in C++;
   - the return value of *Spawn Sound 2D*, *Spawn Sound Attached*, *Create Sound 2D* and any other node
     that returns an audio component from a *Sound* pin, set to an asset or to a class-default variable;
   - a member variable that this Blueprint (and its parents) only ever assigns from one of those;
   - through reroute nodes, and through **MetaSound presets**: a preset mirrors its parent's inputs,
     so a node driving a preset of your MetaSound is bound to your MetaSound's names.
   Anything else is **not judged**, and the report says why: a reference read from another object, a
   function input, a variable assigned two different sounds, a component with no Sound in its defaults,
   a name wired from another pin.
3. **Judges every bound name against the MetaSound's inputs as they are now.** Interface inputs
   (`UE.Source.OnPlay` and friends) count as inputs and are never renamed.
4. **Knows which side of the rename you are on**, from the MetaSound itself:
   - **not renamed yet** (`-From` is still an input): the preview is the blast radius, every row that
     the rename *would* leave behind. `-Apply` refuses.
   - **renamed** (`-To` is an input and `-From` is not): the preview lists every row still on the old
     name, and `-Apply` carries them.
5. **Applies all or nothing.** `-Apply` writes nothing and exits 4 while any of these holds:
   - a Blueprint in scope could not be opened;
   - a node sets the **old name** on a target it cannot decide (pass `-AcceptUnresolved` to rewrite
     those as well, after reading them in the report, or narrow `-Scope`);
   - a package it would write is **read-only**, the normal state of a file you have not checked out of
     Perforce.
   Otherwise it copies every package it will change into a journal, rewrites the names, compiles each
   touched Blueprint **once**, saves, and **re-scans** to confirm nothing in scope still sets the old name.
6. **Gives CI an exit code.** `-FailOnMismatch` exits 5 while any Blueprint in scope sets, on this
   MetaSound, a name it does not have, whatever the reason. It needs no `-From` or `-To`.
7. **Undoes byte for byte.** `-Undo=<stamp>` copies every journalled package back.

Every run writes an HTML report to `Saved/MetaSoundParameterSurgeon/Reports/`: the MetaSound's inputs,
every row bound to it with how it was bound and its verdict, every row not judged with its reason, and
every row left alone because it drives another sound.

## Install

1. Copy the `MetaSoundParameterSurgeon` folder into your project's `Plugins` folder
   (`<YourProject>/Plugins/MetaSoundParameterSurgeon/MetaSoundParameterSurgeon.uplugin`).
2. Open the project once. The editor offers to build the new module; accept (or build the project from
   your IDE). It is an **Editor** module: it never ships in a packaged game. It enables Epic's
   **MetaSound** plugin, which it reads.
3. Close the editor before running `-Apply` or `-Undo`.

## Quick start

The commandlet is `MPS`. Content paths may be written `/Game/...` or `+Game/...` (the `+` form survives
shells that rewrite a leading slash, such as Git Bash).

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=MPS -Help
```

**1. Audit. Writes nothing.** Every name a Blueprint in scope sets on the MetaSound, judged.

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=MPS ^
  -MetaSound=+Game/Audio/MS_Radio -Scope=+Game/Vehicles
```

**2. Before you rename: the blast radius.**

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=MPS ^
  -MetaSound=+Game/Audio/MS_Radio -Scope=+Game/Vehicles -From=Cutoff -To=CutoffHz
```

**3. Rename the input in the MetaSound editor and save. Then preview again, and apply.**

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=MPS ^
  -MetaSound=+Game/Audio/MS_Radio -Scope=+Game/Vehicles -From=Cutoff -To=CutoffHz -Apply
```

It prints `Journal <stamp>`. Keep it.

**4. Prove it in a fresh process, and keep proving it in CI.**

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=MPS ^
  -MetaSound=+Game/Audio/MS_Radio -Scope=+Game/Vehicles -FailOnMismatch
```

**5. Changed your mind?**

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=MPS -Undo=<stamp>
```

## Switches

| Switch | Meaning |
| --- | --- |
| `-MetaSound=<path>` | The MetaSound Source whose input was renamed. Required. A MetaSound Patch is refused: no audio component plays one. |
| `-Scope=<folder>[+<folder>...]` | The only folders whose Blueprints are opened or written. Required: this tool never rewrites a whole project. A folder boundary, not a prefix: `/Game/Audio` does not include `/Game/AudioOld`. |
| `-From=<old>` `-To=<new>` | The rename, as a pair. Without them a run is an audit. Names compare without case, as the audio engine does. |
| `-Apply` | Rewrite every row on `-From` to `-To`. Writes nothing while anything is refused. |
| `-AcceptUnresolved` | With `-Apply`: also rewrite setter nodes on `-From` whose target sound cannot be decided. |
| `-FailOnMismatch` | Exit 5 while any row bound to the MetaSound sets a name it does not have. |
| `-Undo=<stamp>` | Restore every package a run wrote from its journal. |
| `-Census` | List every audio-parameter setter the tool recognises. |
| `-ExitOnFinish` | Ask the engine to exit when the run ends. Only needed when the run is started inside an editor session; a commandlet exits by itself. |
| `-Help` | Print the switches and exit codes. |

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Done: audit or preview printed, rename confirmed, nothing to do, or undo complete. |
| 2 | Bad arguments: a missing switch, a MetaSound that is not one, or a pair that is not a rename of this MetaSound's input (both names are inputs, neither is, an interface name, or the same name). Nothing was written. |
| 4 | Refused. Nothing was written. |
| 5 | `-FailOnMismatch`: a row bound to the MetaSound sets a name it does not have. |
| 6 | Written but not confirmed: a save failed, a row could not be found again, a Blueprint failed to compile, or the re-scan still found the old name. `-Undo` restores every byte. |
| 7 | Undo failed. |

Codes 1 and 3 are never used by this tool: the engine uses them for its own failures and a crash.

## Limits, stated plainly

- **It does not rename the MetaSound's input.** Do that in the MetaSound editor, where it belongs. This
  tool carries what the rename leaves behind, and tells you beforehand what that will be.
- **A name built at runtime is not judged.** If the `InName` pin is wired (a *Make Literal Name*, a
  variable, a string conversion), the row is listed and counted, never rewritten.
- **Names inside an `FAudioParameter` struct built in a graph** (for *Set Parameters*) are not read.
  *Default Parameters* on component templates are.
- **A variable assigned outside the Blueprint** (by another Blueprint or C++) is not visible to it. The
  report says "assigned in this Blueprint", never "always".
- **Sequencer, Level Blueprints and data assets are not in scope unless they are Blueprints in your
  `-Scope`**; Level Blueprints are not read in this version.
- Verified on **Unreal Engine 5.8, Win64** only. No other engine version has been run.

## Support

<https://csaf.itch.io>

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
