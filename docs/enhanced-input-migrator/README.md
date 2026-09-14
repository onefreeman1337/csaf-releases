# Enhanced Input Migrator — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Enhanced Input Migrator  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-14


---

# Enhanced Input Migrator

Converts a legacy Action/Axis input project to Enhanced Input. It generates the `InputAction` assets
and the mapping context from the mappings you already have, rewires the legacy Blueprint event
nodes, recompiles every Blueprint it touched to prove the result builds, and writes nothing at all if
any of those compiles fails.

Everything it will not touch is listed and counted rather than silently skipped.

---

## Why this exists

Unreal 5.8 ships the warning and not the fix. In Project Settings the legacy Action and Axis mapping
groups each carry a "deprecated" checkbox; ticking it makes every legacy `InputAction` and
`InputAxis` event node in your Blueprints raise a compile warning, and removes that node from the
palette so nobody can add another one. The engine therefore tells you precisely which nodes are
wrong and stops you making more, and then leaves every rewire to you.

This tool does the rewire.

## Requirements

- **Unreal Engine 5.8.** That is the only version this plugin has been built and run against, so it
  is the only version it claims. It is an editor plugin and ships no runtime module.
- The **Enhanced Input** plugin enabled, which it is by default in 5.8.

## Install

1. Copy the `EnhancedInputMigrator` folder into your project's `Plugins` folder.
2. Restart the editor. The plugin loads at the default phase and registers three console commands.

## Use it from the editor

```
EnhancedInputMigrator.Preview
EnhancedInputMigrator.Apply
EnhancedInputMigrator.Undo
```

`Preview` changes nothing at all. Start there and read the report.

All three accept the same switches as the commandlet, so
`EnhancedInputMigrator.Apply -Dest=/Game/Input -NoCompositeKeys` works from the console too.

> **A preview in the editor reads; a preview in the commandlet also compiles.** Inside a running
> editor the preview inspects your graphs and changes nothing, because the editor would otherwise
> keep every change a preview made after telling you it made none. The commandlet's `-Preview` does
> the full rewire in memory and recompiles before throwing it all away, which is safe there because
> the process exits. So the one thing the editor preview cannot tell you in advance is whether a
> Blueprint will fail to recompile; it names how many would be compiled, and
> `-run=EIM -Preview` answers it properly.

> The console cannot set a process exit code. On Windows the engine's exit request becomes a quit
> message, so an `-ExecCmds` run always returns 0 whatever happened. The result code is written to
> the log instead, and **`-run=EIM` is the only entry point with a usable exit code.** Use it for CI.

## Use it from the command line

```
UnrealEditor-Cmd.exe <YourProject.uproject> -run=EIM -Preview
UnrealEditor-Cmd.exe <YourProject.uproject> -run=EIM -Apply
UnrealEditor-Cmd.exe <YourProject.uproject> -run=EIM -Undo
```

| Switch | Effect |
| --- | --- |
| `-Preview` | Read, plan and report. Writes nothing. **This is the default.** |
| `-Apply` | Generate the assets, rewire the Blueprint events, recompile. |
| `-Undo` | Undo the most recent apply using its journal. |
| `-Undo=<path>` | Undo a specific journal file. |
| `-Dest=<path>` | Content path for the generated assets. Default `/Game/Input`. |
| `-Context=<name>` | Name of the generated mapping context. Default `IMC_Default`. |
| `-Prefix=<text>` | Prefix for every generated action. Default `IA_`. |
| `-NoPairing` | Do not fold two 1D axes into one Axis2D action. |
| `-NoCompositeKeys` | Do not collapse a stick's X and Y rows onto its 2D key. |
| `-NoRewire` | Generate the assets but leave every Blueprint graph alone. |
| `-FailOnRefusal` | All or nothing: if anything would be refused, write nothing at all. |
| `-Report=<path>` | Where to write the HTML report. |
| `-Help` | Print the switch list. |

### Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Clean. Everything asked for was done and nothing was refused. |
| 1 | The command line could not be understood. Nothing was read and nothing was written. |
| 2 | The project has no legacy Action or Axis mappings, so there was nothing to migrate. |
| 3 | Completed, and at least one thing was refused and listed. Read the report. |
| 4 | A Blueprint failed to compile, so the whole run was rolled back and nothing was written. |
| 5 | Something could not be read or written. |

An unrecognised switch is a hard error rather than a silent default, because a typo in a CI script
that quietly previews instead of applying is the worst outcome available.

---

## What it does

**Generates one `InputAction` per legacy action**, as `Digital (bool)`.

**Folds axes into families.** Two legacy 1D axes that are really one 2D control become a single
`Axis2D` action. Three rules decide that, in strict precedence, and the report names the one that
fired for every family:

1. **Shared stick.** Read off the keys, not the names: if one axis is bound to a key the engine
   reports as the X half of a paired key and the other to the Y half of the same pair, they are one
   control. This is derived from the engine's own paired-key table, so it keeps working for paired
   keys that did not exist when this plugin was built.
2. **Known template pair.** The stock Unreal template names, for keyboard-only projects where there
   is no stick to read.
3. **Morphology.** A shared stem with opposing axis suffixes, such as `Aim_X` and `Aim_Y`.

**Writes the mapping context** with every key, and the modifiers the conversion requires: `Negate`
where the legacy scale was negative, `Swizzle Input Axis Values (YXZ)` where a 1D key supplies the Y
component. Where both halves of a stick are present and neither is inverted, the two rows collapse
onto the single composite key (`Gamepad_Left2D`, `Mouse2D`) and need no modifiers at all, which is
what Epic's own template does by hand.

**Rewires the Blueprint event nodes.** `Pressed` becomes `Started` and `Released` becomes
`Completed`. A legacy axis event's exec flow becomes `Triggered`.

**Recompiles everything it touched**, and if any compile reports an error **nothing is written at
all**. The rollback is structural rather than transactional: assets are built in memory, every graph
is rewired and recompiled, and only a completely clean result reaches disk. A rollback is therefore
the absence of a write, which is the one kind of rollback that cannot itself fail halfway.

**Journals every apply** to `Saved/EnhancedInputMigrator/Journal/<stamp>/`, including a byte-for-byte
backup of every package it is about to modify, taken before it modifies anything. If a backup cannot
be taken the run refuses to write, because an unbacked modification is one you cannot take back.
`-Undo` restores those backups and deletes the generated assets.

> **Restart the editor after an in-editor `EnhancedInputMigrator.Undo`.** The undo restores the
> package FILES on disk, and we have verified it does so byte for byte. What it cannot do is reach
> into an already running editor and swap out the Blueprint objects it has loaded: those are still
> the migrated ones until they are loaded again. So a `EnhancedInputMigrator.Preview` issued straight
> after an undo in the same session reports finding no legacy nodes, and saving one of those
> Blueprints would write the migrated version back over the file the undo just restored. Restarting
> the editor resolves it completely. `-run=EIM -Undo` from the command line is not affected, because
> that process exits when the run ends.

**Writes an HTML report and a JSON twin** to `Saved/EnhancedInputMigrator/`, from the same run
record, so the two can never disagree.

## What it does not do, by design

- **It does not edit C++.** Native `BindAction` / `BindAxis` call sites are found by a text scan of
  your project's `Source` folder and listed by file and line for you to port. Nothing is rewritten.
- **It does not rewrite `Get Input Axis Value` nodes.** Those read a value directly, usually from
  Tick. Enhanced Input's equivalent takes the generated action, but whether that is the right change
  depends on how the value is consumed, so each one is listed instead of guessed at.
- **It does not carry a legacy action node's `Key` output.** The Enhanced Input event node does not
  expose which key caused the event. If that pin was connected the node is left alone and listed.
- **It does not convert a modifier-key chord.** A legacy mapping that required Shift, Ctrl, Alt or
  Cmd is mapped without the chord, and the chord is listed for you to add as a Chord trigger.
- **It does not guess an ambiguous pairing.** If an axis could pair with two different partners under
  the same rule, neither pairing is made, both are reported, and both axes stay 1D.
- **It does not overwrite.** An asset already at the destination path is left exactly as it is and
  reported.

## Two behaviour differences a migration cannot remove

Read these before you apply. Both are stated in the report as well.

1. **A legacy axis event fired every tick, including ticks where the value was 0.0.** Enhanced Input
   does not raise `Triggered` at rest. Any graph that relied on a zero tick to reset state must
   handle `Completed` instead. Every rewired axis node is listed so you can check each one.
2. **A legacy axis value was a float; a folded 2D action delivers a Vector2D.** Where the legacy
   node's `AxisValue` pin was connected, the exec flow is carried across and the value pin is left
   for you, because which component you want is a decision and not a conversion. `-NoPairing` keeps
   one float action per legacy axis if you would rather migrate mechanically.

## Why the Blueprint scan loads assets

Legacy input is bound **by name**: the node stores an `FName`, not an asset reference. A legacy input
binding therefore creates no dependency for the asset registry to index, and no registry tag can
answer "which Blueprints bind `MoveForward`". The registry is still used to enumerate candidates so
nothing outside the scanned root is touched, and the walk runs under a cancellable progress task.

## Support

Documentation: <https://github.com/onefreeman1337/csaf-releases/blob/main/docs/enhanced-input-migrator/README.md>

## AI disclosure

This product was built with AI assistance. Code: yes. Graphics: yes. Sounds: no. Text and dialog: no.

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
