# UMG Style Migrator — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** UMG Style Migrator  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-05


---

# UMG Style Migrator

**UE 5.8 · Editor plugin · Windows (Win64)**

UMG has no style sheet. Every font, colour and brush tint you set on a widget is stored on that
widget, by value, and there is nothing to point at. A colour used by 34 widgets is 34 separate
copies of that colour, and changing it means finding all 34 first.

This plugin finds them, shares them from one asset you own, and then tells you when one of them
drifts back.

---

## What it actually does

1. **Finds** every hardcoded font, colour and brush tint in your Widget Blueprints. It reads them
   through Unreal's reflection system rather than through a list of known widget types, so it sees
   values on stock widgets, on plugin widgets, and on your own `UUserWidget` subclasses alike.
2. **Groups** the values. By default it groups only values that are already **identical**, so a
   default run cannot change how a single pixel looks. Pass a tolerance and it will group values
   that merely look alike, and it will make you confirm that separately.
3. **Writes** a Style Set asset holding one entry per group, then pushes each entry's value into
   every widget in it, recompiles those Blueprints and saves them.
4. **Holds the line.** Run it again with `-Audit` in CI. It writes nothing and exits non-zero if any
   widget has been edited back to a hardcoded value.

Afterwards, a designer changes one colour in the Style Set, you re-run with `-Apply`, and all 34
widgets follow.

---

## Honest limits — read this before you buy

**This plugin does not add a style *reference* to your widgets, because UMG does not have one.**
`UButton::WidgetStyle` is an `FButtonStyle` held inline; `UTextBlock`'s `Font` and
`ColorAndOpacity` are inline properties; no UMG widget in 5.8 carries a style asset pointer. The
link between the Style Set and your widgets is therefore **maintained by this tool**, not by the
engine.

That has one consequence you should decide about up front: **if you stop running the tool, your
project will drift.** That is exactly why `-Audit` exists and why it is designed to run in CI. If
you will not run it in CI, you are buying half the product.

Two more things it will not do:

- It will not convert your widgets to **CommonUI**. If your project already uses CommonUI widgets,
  those *do* have a real `TSubclassOf<UCommonTextStyle>` reference and you should use it — this tool
  leaves them alone rather than fighting it.
- It will not touch a colour that is **already shared**. An `FSlateColor` bound to the style's
  colour table, or inheriting from the foreground, is left exactly as it is and counted separately
  in the report. Those are already doing the right thing.

---

## Install

1. Copy the `UMGStyleMigrator` folder into your project's `Plugins/` folder.
2. Restart the editor. Enable it under **Edit → Plugins → Editor** if it is not on already.

Source is included and unobfuscated. Built and verified against **UE 5.8 only** — no other engine
version has been tested, and the descriptor is marked accordingly.

---

## The three runs

### 1. Look. Nothing is written.

```
UnrealEditor-Cmd.exe "C:\Path\YourProject.uproject" -run=UMGStyleMigrator ^
    -Path=/Game/UI -Report="C:\Out\styles.html" -unattended -nosplash -ExitOnFinish
```

Open the report. Every group shows a swatch, how many widgets use it, and — for anything
approximate — every member with its own swatch so you can see what would merge.

### 2. Adopt.

```
UnrealEditor-Cmd.exe "C:\Path\YourProject.uproject" -run=UMGStyleMigrator ^
    -Path=/Game/UI -StyleSet=/Game/UI/Styles/ProjectStyles -Apply ^
    -unattended -nosplash -ExitOnFinish
```

Creates `ProjectStyles`, pushes the values, recompiles and saves. **Commit before you do this** —
see Safety below.

### 3. Hold the line. Put this one in CI.

```
UnrealEditor-Cmd.exe "C:\Path\YourProject.uproject" -run=UMGStyleMigrator ^
    -Path=/Game/UI -StyleSet=/Game/UI/Styles/ProjectStyles -Audit ^
    -unattended -nosplash -ExitOnFinish
```

Writes nothing. Exits **4** if anything drifted, and names each one.

It also exits **2** — not 0 — if every binding in the Style Set has gone stale, because a run that
managed to check nothing has not demonstrated that nothing drifted. Gate CI on `== 0` and both cases
correctly fail.

You can also run it from the editor console as `UMGStyle.Migrate Path=/Game/UI` — but see the exit
code note below, and **gate CI on the commandlet, never on the console command**.

---

## Switches

| Switch | Meaning |
| --- | --- |
| `-Path=<pkg>` | Content root to search. Default `/Game`. |
| `-Kind=<k>` | `Colour`, `Font` or `All`. Default `All`. |
| `-Tolerance=<n>` | OKLab distance below which two colours may share an entry. **Default 0.** |
| `-AllowApproximate` | Required before any non-identical group is written. |
| `-StyleSet=<pkg>` | The Style Set asset to create or read. |
| `-Apply` | Write. Without it nothing is created, changed or saved. |
| `-Audit` | Read-only drift check. |
| `-Report=<file>` | Write the HTML report. |
| `-ExitOnFinish` | Ask the editor to quit when the run finishes. **Use this on a build agent.** Honoured by `-run=UMGStyleMigrator` only, on every outcome including a command line it refused; the editor console command does not quit the editor. |
| `-IgnoreUnknownSwitches` | Do not refuse a switch this build does not recognise. |
| `-Help` | Print the switch table and the exit codes. |

### About `-Tolerance`

It is a distance in **OKLab**, a perceptually near-uniform colour space, so one number means roughly
the same visible amount of difference in the darks as in the lights. Plain RGB distance does not,
which is why it is not used here: it is loosest exactly where UI greys live.

- `0` (default) — identical values only. Cannot change any pixel.
- `0.02` — about a just-noticeable difference.
- above `0.1` — you are merging colours a person can tell apart.
- above `0.5` — refused.

**Fonts ignore the tolerance entirely and are always matched exactly.** There is no meaningful
continuous distance between two fonts, and inventing one would silently retype your UI.

### Grouping is bounded, not chained

Every member of a group is within the tolerance of **every other member**, not merely of its nearest
neighbour. That matters: the naive approach chains, so on a ramp of greys where each is close to the
next, the whole ramp collapses into one colour. Here each group's width is capped by the tolerance
you set, and the report prints the widest gap that was actually reached in each group.

---

## Safety

- **Nothing is written without `-Apply`.** The default run is a preview.
- **Commit or check in before your first `-Apply`.** This modifies `.uasset` files.
- **Every touched Blueprint is recompiled before any of them is saved.** If one fails to compile,
  every change from that run is undone in memory and nothing reaches disk.
- **A value that cannot be captured for undo is not written at all.**
- **Alpha is always exact**, at every tolerance. A half-transparent white and an opaque white are
  never merged.
- **Approximate merges need `-AllowApproximate`.** Without it a tolerant run reports what it would
  do and exits 3, having written nothing.

---

## Exit codes

Gate CI on these, from the **commandlet**.

| Code | Name | Meaning |
| --- | --- | --- |
| 0 | Ok | Done. If `-Audit` was asked for, no drift. |
| 1 | BadArguments | A switch was malformed or contradictory. Nothing ran. |
| 2 | NothingFound | No Widget Blueprints, or no style values in them. Also returned by `-Audit` when **every** binding is stale — a run that checked nothing has not shown you that you have no drift, so it is deliberately not a pass. |
| 3 | ApproximateMergeRefused | A tolerance would merge non-identical values and `-AllowApproximate` was not given. Nothing written. |
| 4 | DriftDetected | `-Audit` found a widget that no longer matches its entry. |
| 5 | IoError | A file or asset could not be read or written. |
| 6 | WriteFailed | A Blueprint failed to compile or save after a push. Everything that run touched was rolled back. |

> **Use the commandlet for CI, not the console command.** On the console path the process exit code
> is not the plugin's to set — a headless editor does not surface it — so the console command logs
> its result instead of returning it. The commandlet returns the codes above properly.

---

## What the Style Set holds

- **Entries** — the shared values. This is what a designer edits.
- **Bindings** — which widget property belongs to which entry. Written by `-Apply`, read by
  `-Audit`. This is the tool's memory of what it adopted, and it is why the drift check can tell
  "adopted and then edited" apart from "never adopted". Do not hand-edit it; `-Apply` rewrites it.
- **Provenance** — the tolerance the groups were adopted at, and whether any group was approximate.

A widget that has been **deleted or renamed** since adoption is reported as a stale binding, not as
drift, and does not fail an audit. Re-run with `-Apply` to refresh.

---

## AI disclosure

This product was created with AI assistance. Code: yes. Graphics: yes. Sounds: no (it produces no
audio). Text and dialog: no (it has no narrative content).

---

## Support

<https://csaf.itch.io>

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
