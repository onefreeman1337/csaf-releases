# Override Rebinder — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Override Rebinder  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-01


---

# Override Rebinder

**Put per-actor material overrides back on the slot they were set on, after art redelivers the mesh.**

Unreal Engine 5.8 · Editor plugin · C++ source included · Windows

---

## 1. The problem, in one paragraph

A material override on a placed actor is stored in `UMeshComponent::OverrideMaterials`, **an array
indexed by material slot number**. Nothing in that array records which slot the artist actually
meant. When the mesh a component points at changes, the engine runs one thing:

```
StaticMeshComponent.cpp:1986   // Static mesh was switched so we should clean up the override materials
StaticMeshComponent.cpp:1987   CleanUpOverrideMaterials();
```

and `CleanUpOverrideMaterials()` truncates the array to the new material count. `SkeletalMeshComponent.cpp`
does the same, so character content has the identical defect. Two things fall out of that:

| what changed | what happens | what you see |
| --- | --- | --- |
| the slot **count shrank** | entries past the new end are destroyed | the override is simply gone |
| the slot **order changed**, count did not | **nothing is removed and nothing is logged** | **the wrong material renders**, on actors in maps nobody had open |

The second one is why this plugin exists. It is silent, it survives a save, and you find it in a
playtest.

---

## 2. Install

1. Copy the `OverrideRebinder` folder into your project's `Plugins` directory.
2. Restart the editor. **Edit → Plugins → Editor → Override Rebinder** should be enabled.
3. The plugin is editor-only and adds nothing to a packaged build.

---

## 3. Use it — the two-phase shape

**The snapshot must be taken BEFORE the mesh changes.** That is not a limitation that could be
engineered away: at snapshot time nobody knows which mesh art is about to redeliver, and after the
mesh has changed the information the snapshot records has already been destroyed by the engine.

```
                take this first
  orb -Snapshot  ─────────────────►  Saved/OverrideRebinder/snapshot.json
        │
        │   art redelivers the mesh; the engine truncates by index
        ▼
  orb -Rebind    ─────────────────►  preview: what it would put back, and what it refuses
  orb -Rebind -Apply  ────────────►  writes, verifies, saves, and journals the undo
  orb -Revert=<journal>  ─────────►  puts it all back
```

### From a build agent (the commandlet)

```
UnrealEditor-Cmd.exe "C:\Path\YourProject.uproject" -run=OverrideRebinder ^
    -Snapshot -Paths=/Game/Maps,/Game/Cinematics -unattended -nosplash

UnrealEditor-Cmd.exe "C:\Path\YourProject.uproject" -run=OverrideRebinder ^
    -Rebind -unattended -nosplash

UnrealEditor-Cmd.exe "C:\Path\YourProject.uproject" -run=OverrideRebinder ^
    -Rebind -Apply -unattended -nosplash
```

### From the editor console

```
OverrideRebinder.Run -Snapshot -Paths=/Game/Maps
OverrideRebinder.Run -Rebind
OverrideRebinder.Run -Rebind -Apply
OverrideRebinder.Run -Revert=D:/Project/Saved/OverrideRebinder/journal.json
```

Both entry points call the same implementation, so they cannot answer differently.

---

## 4. Switches

| switch | meaning |
| --- | --- |
| `-Snapshot` | Read the levels under `-Paths` and record every override against its slot NAME. |
| `-Snapshot=<file>` | The same, writing the manifest to `<file>`. |
| `-Rebind` | Read the manifest and report what would be put back. **Writes nothing.** |
| `-Rebind=<file>` | The same, reading the manifest from `<file>`. |
| `-Revert=<file>` | Replay an undo journal, putting every binding back as it was. |
| `-Paths=/A,/B` | Content paths. **Required for `-Snapshot`**; narrows a `-Rebind`. Comma or `+` separated. |
| `-Manifest=<file>` | Explicit manifest path. Default `Saved/OverrideRebinder/snapshot.json`. |
| `-Journal=<file>` | Explicit journal path. Default `Saved/OverrideRebinder/journal.json`. |
| `-Report=<file>` | Explicit HTML report path. Default `Saved/OverrideRebinder/OverrideRebinder_<mode>.html`. |
| `-Apply` | **The only switch that writes to your project.** Off by default. |
| `-Strict` | With `-Rebind -Apply`, also **clear** an override sitting on a slot the snapshot recorded as empty. Off by default. See §6a. |

`-Paths=/Game/A,/Game/B` really does scan both. It is asserted by an automation test, because the
obvious implementation of that switch silently drops everything after the first comma.

---

## 5. Exit codes — the CI contract

| code | meaning | what a build agent should do |
| --- | --- | --- |
| `0` | Clean. Nothing needed rebinding, or an apply rebound everything it found. | pass |
| `1` | Bad arguments. The message names the switch. | fix the invocation |
| `2` | **Nothing was scanned.** No levels opened, no mesh components seen, or no rows in scope. | **fail** — this is never a clean project |
| `3` | Preview found work: rows to rebind, or rows that had to be refused. | fail a gate, or run `-Apply` |
| `4` | Applied, and some rows were refused **or reported and left alone**. Every one is named in the report. See §6a. | review the report |
| `5` | A write did not read back as written. That map was rolled back whole and nothing from it was saved. | **fail** — investigate before retrying |
| `6` | The run could not start: unreadable manifest, unwritable journal. | fix and re-run |

Code `2` deserves a note. Most audit tools report an empty scan as success. This one treats it as a
failure, because "I examined nothing" and "I examined everything and it was fine" are different
answers and only one of them is good news.

---

## 6. What it refuses to do

This is the part worth reading before you let anything write to every level in your project.

- **A slot name that is gone from the mesh** is reported and left exactly as it was. It is not
  clamped to the last valid index, and it is not moved to a neighbour. A slot genuinely vanishing
  from source is information for the artist, not a problem for a tool to paper over.
- **A slot name that appears twice on the mesh** is reported and left exactly as it was. "By name"
  no longer identifies one target, and guessing would produce the exact corruption this tool cures.
- **A material asset that will not load** is reported. The only thing the tool ever assigns is the
  exact asset the snapshot recorded.
- **Every write is read back before anything is saved.** If a read-back disagrees, the whole map is
  rolled back and nothing from it is saved. A half-rebound map is worse than an untouched one.
- **Nothing is written without `-Apply`.**

---

## 6a. `-Strict`, and why a plain `-Apply` returns 4 instead of 0

Re-binding by name is only **half** of a reorder, and this is worth understanding before you gate a
build on the exit code.

Say the slots were `[Body, Trim]` and an actor overrides `Trim` — index 1 — with `M_Gold`. Art
redelivers with `[Trim, Body]`. The component's override array is **not touched** by that: the
engine's clean-up runs when a mesh is *switched*, not when the mesh asset's own slots are reordered
underneath it. So `M_Gold` is still sitting at index 1, which is now the slot called `Body`.

A rebind puts `M_Gold` back on `Trim`, correctly. **And `M_Gold` is still on `Body`.**

Your snapshot proves `Body` had no override, so clearing it is justified. But it is not
distinguishable from an override somebody added deliberately last week, and this tool does not
delete work it cannot account for. So:

| | plain `-Apply` | `-Apply -Strict` |
| --- | --- | --- |
| the slot that moved | rebound | rebound |
| the slot left holding the displaced material | **reported, untouched** | **cleared**, and journalled |
| exit code | `4` | `0` |

A plain `-Apply` returns **4**, not 0, precisely because the project is not yet back to what the
snapshot recorded. An exit code that said "clean" while an actor still rendered the wrong material
would be worse than useless. Every such slot is named in the report with the material bound to it,
so you can look before you decide.

`-Strict` is journalled like everything else, so `-Revert` puts the cleared overrides back.

---

## 7. What it does not cover, stated plainly

- **Overrides created after the snapshot** are not in the manifest and cannot be put back from it.
  Every rebind report prints how many packages reference the snapshot's meshes against how many the
  snapshot has rows for, so that gap is a number on the page rather than an assumption.
- **Overrides on unnamed slots** cannot be keyed by name. They are counted and reported by the
  snapshot, not recorded — recording the index alone would reproduce the engine behaviour this tool
  replaces.
- **Component classes other than static and skinned mesh components** are detected, named in the
  report, and left alone. They reach their mesh asset by a route this version has not proven.
- **A World Partition map whose partition is not initialised** in the running process contributes
  only its already-loaded actors, and the report counts those maps separately and says so.
- **Only Unreal Engine 5.8 is supported**, because 5.8 is the only version this plugin has been
  built and run against. Every claimed version needs its own verified build.

---

## 8. The report

Every run writes a standalone HTML sheet — no server, no dependencies, openable from a build
artefact. It carries:

- the mode, stated as a badge: **preview - nothing written**, **applied**, **snapshot taken**,
  **reverted** or **rolled back**;
- a stat strip whose numbers change with the mode, so a revert never prints scan counts it did not
  measure;
- a plain sentence saying **what the numbers rest on** — levels offered against levels opened,
  packages referencing the mesh against packages the snapshot covers;
- one row per override, grouped by map, showing the slot name, the component, **the index then
  against the index now**, the material, and the outcome;
- the refusals, with the reason written out, beside everything that succeeded.

---

## 9. Where things are written

| what | where |
| --- | --- |
| the snapshot manifest | `<Project>/Saved/OverrideRebinder/snapshot.json` |
| the undo journal | `<Project>/Saved/OverrideRebinder/journal.json` |
| the HTML report | `<Project>/Saved/OverrideRebinder/OverrideRebinder_<mode>.html` |

Nothing is written anywhere else, and nothing outside `Saved` is touched unless `-Apply` is given.

---

## 10. Recommended workflow

1. Wire `-Snapshot` into whatever runs when art is accepted into the project — a nightly job, a
   pre-delivery step, or a manual habit. It is the cheap half of the insurance.
2. When a mesh is redelivered, run `-Rebind` (no `-Apply`) and read the sheet.
3. On a clean source-control working tree, run `-Rebind -Apply`.
4. **Review the diff.** A version-control diff is the one check that does not depend on this tool
   being correct about itself.
5. If anything looks wrong, `-Revert=<journal>`.

---

## 11. Support

Support and updates through the marketplace you purchased from. Full terms in `LICENSE.txt`.

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved.
Unreal® and Unreal Engine® are trademarks of Epic Games, Inc. This product is not affiliated with
or endorsed by Epic Games, Inc.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
