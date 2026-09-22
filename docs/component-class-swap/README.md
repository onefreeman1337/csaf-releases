# Component Class Swap — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Component Class Swap  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-22


---

# Component Class Swap

**For Unreal Engine 5.8. Windows (Win64). Editor plugin.**

A Blueprint-added component cannot change class. Unreal's own `ChangeSubobjectClass` refuses unless
the component is **native**, the target is a **subclass**, and an off-by-default console variable is
set, so the workaround every forum thread lands on is *delete the component and add a new one*.

That deletion is the damage. It:

- orphans every graph node bound to the component variable,
- drops whatever was attached beneath it,
- throws away what child Blueprints customised on it,
- and resets per-instance edits on placed actors.

This plugin swaps the class **in place**, across the whole project. It keeps the first three. For the
fourth, it lists every level that places an affected Blueprint; in our test the editor carried a
placed instance's own edit across, and you re-save those levels (see *Placed actors* below).

---

## What it actually does

For every Blueprint-added component of a class you name, it:

1. **Keeps the variable identity.** The SCS node's `VariableGuid` and variable name are not touched,
   so graph nodes that referenced the component still reference it.
2. **Keeps the attachment hierarchy.** Children, the attach socket and the parent link survive.
3. **Carries every property that still exists on the new class**, using the engine's own
   `CopyPropertiesForUnrelatedObjects`, the same routine Unreal uses to carry values across a
   Blueprint recompile.
4. **Names every property that does not survive and holds a value you set.** Dropped properties that
   were still at the old class's default are counted, not listed, so the two values you configured
   are not buried under forty you never touched. A property whose name exists on the new class with a
   *different type* is marked separately, because that is the case you are most likely to assume
   worked.
5. **Rebuilds every descendant Blueprint's override record at the new class**, children and
   grandchildren alike, shallowest first, re-applying the values each one customised. This is the
   part the free forum snippets do not do.

Everything above is decided before anything is written, and the plan is shown to you first.

### Why the descendants matter

A child Blueprint's customisation of an inherited component is not stored on the parent. It is a
separate *override record* in the child, and that record carries its own class. Change the parent's
class and leave the record alone, and the record no longer matches the component it overrides.

We measured what Unreal 5.8 does with that record: a child left on the old class, loaded in a fresh
editor process, came up on the new class **with its customisation gone** (a shadow setting it had
turned off was back on), and nothing was logged. Its grandchild lost the value it inherited too. The
record is discarded as the child loads, so after the fact no tool can find it, this one included.

That is why this plugin rebuilds every descendant's record **in the same run as the swap**, and why
its own test spawns the child and grandchild afterwards and reads their values back.

## What it refuses to do

Refusals are decided **before anything is written**, and every one is named in the report.

| Refusal | Why |
| --- | --- |
| would orphan attachments | The component is a scene component that is the root or has children, and the target class is not a scene component. A non-scene component has no transform and cannot own an attachment, so the swap would silently detach everything below it. |
| target class is not an actor component | You named something that is not a component. |
| target class is abstract | No template can be constructed from it. |
| no component template | The node has nothing to copy from. |
| blueprint could not be loaded | Named in the report, per asset. |

**If anything in scope is refused, `-Apply` writes nothing at all**, and exits 4. A project-wide
migration that quietly finishes 190 of 200 swaps leaves the project in a state nobody chose. Narrow
the run with `-Paths` or `-Var`, or resolve the refusals the report names, then apply.

---

## Getting started

1. Copy the `ComponentClassSwap` folder into your project's `Plugins` folder.
2. Open the project once and confirm the plugin is enabled (Edit > Plugins > Editor).
3. Close the editor before running any commandlet below.

Every command is run from your engine's `Binaries/Win64` directory, against your `.uproject`.

### 1. Survey, read-only

```
UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=CCS -From=StaticMeshComponent -Audit
```

Lists every Blueprint holding that component class. Writes nothing.

### 2. Preview a swap

```
UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=CCS -From=StaticMeshComponent -To=MyStaticMeshComponent
```

Reports what would be swapped, what each swap carries, what it drops, which child Blueprints
override it, and which components are refused and why. **Writes nothing.**

### 3. Perform the swap

```
UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=CCS -From=StaticMeshComponent -To=MyStaticMeshComponent -Apply
```

Journals every package first, swaps, compiles each touched Blueprint once, rebuilds descendant
override records shallowest first, saves, then re-checks every swapped component for three things:
the class really changed, the variable name really survived, and no descendant's record is left on
another class. Checking only the class would pass over a swap that renamed the component, which
would orphan every graph node while reporting success.

That re-check runs in the same process that did the writing, so it is a check on the objects in
memory. **For proof from disk, run step 5 afterwards in a fresh process**: a new process loads every
package off disk with nothing left in memory, so `-FailOnMismatch` exiting 0 is evidence about the
bytes rather than about the editor that wrote them.

Running `-Apply` again over a finished migration is a no-op that exits 0, so it is safe in a script.

### 4. Undo

```
UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=CCS -Undo=20260922-141500
```

The stamp is printed at the end of an `-Apply` run and in its report. Undo restores the original
bytes of every package the run wrote.

### 5. Gate it in CI

```
UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=CCS -From=StaticMeshComponent -To=MyStaticMeshComponent -FailOnMismatch
```

Exits **5** while any component in scope is still on the old class, or would be refused. Use it to
keep a migration from regressing after you have finished it, for example when someone adds a new
Blueprint with the old component class.

---

## All switches

| Switch | Meaning |
| --- | --- |
| `-From=<Class>` | Component class to swap away from. Required. |
| `-To=<Class>` | Component class to swap to. Required unless `-Audit`. |
| `-Audit` | Read-only survey. No `-To` needed. |
| `-Apply` | Perform the swap. Without it, every run is a preview. |
| `-Paths=+Game/Characters` | Limit to content paths. Repeat with `+`. Default is all of `/Game`. |
| `-Var=<Name>` | Only the component with this variable name. |
| `-IncludeSubclasses` | Match subclasses of `-From` as well as the exact class. |
| `-FailOnMismatch` | Exit 5 if any component is still the source class, or would be refused. |
| `-Undo=<stamp>` | Restore every package the run with that journal stamp wrote. |
| `-Report=<file.html>` | Where to write the report. Default `Saved/ComponentClassSwap/Reports`. |
| `-NoReport` | Skip the report. |
| `-FullPaths` | Print absolute paths in the report instead of content-relative ones. |
| `-ExitOnFinish` | Request process exit when the run ends. |
| `-Help` | Print the switch list and exit 0. |

Native class names are accepted three ways: the full path (`/Script/Engine.StaticMeshComponent`),
the reflected short name (`StaticMeshComponent`), or the C++ spelling (`UStaticMeshComponent`).

**A Blueprint component class takes its full path**, for example
`-To=/Game/Components/BPC_SmartMesh.BPC_SmartMesh_C`. A short name only resolves a class that is
already loaded, and a Blueprint class is not loaded when a commandlet starts, so its short name is
refused with exit 2 rather than guessed at.

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Everything asked for was done (after `-Apply`, re-checked in this process), or there was nothing to do. |
| 2 | The arguments could not be understood. Nothing was read or written. |
| 4 | A precondition failed, or a component in scope was refused, so nothing was written. |
| 5 | `-FailOnMismatch`, and something still needs work. |
| 6 | Work was written but could not be confirmed: a save failed, or a re-check or rebuild did not hold. Undo it with the printed stamp. |
| 7 | `-Undo` could not restore every package it recorded. |

**1 and 3 are deliberately never used.** Unreal itself exits 3 when the process crashes and rewrites
a clean 0 to 1 when anything logged an error, so giving either a product meaning would let a crash
read as "refused, nothing changed".

---

## Where things are written

| Path | What |
| --- | --- |
| `Saved/ComponentClassSwap/Journal/<stamp>/` | A byte-for-byte copy of every package before it was written, plus `manifest.json`. |
| `Saved/ComponentClassSwap/Reports/` | The HTML report for each run. |

The journal is a **file-level backup**, not an inverse operation, so an undo is correct by
construction rather than correct only for the cases the author thought of. `-Undo` resolves each
package against the project it is run in, so a project that has been moved or checked out elsewhere
restores into itself, never into the folder the journal was written from.

## Placed actors

This tool does not load or write levels. Every report lists the levels that reference an affected
Blueprint, read from the asset registry without loading a map.

What we measured on UE 5.8.1, with a level holding a placed instance whose swapped component had a
per-instance location of its own: after `-Apply`, the level file on disk still named the old class
(it was not rewritten), and opening the level in a fresh editor process showed the placed component
**on the new class with its per-instance location intact**, and the level not marked dirty.

So the editor upgrades placed instances when it loads them. **Open each listed level and save it**
so the level file itself stores the new class. We have not measured a cooked build that skips that
step, so do not rely on one.

## Scope and honest limits

- **Blueprint-added (SCS) components only.** Components declared in C++ are not part of a Blueprint's
  construction script, so this tool does not see them: they are neither listed nor changed. Unreal's
  own `ChangeSubobjectClass` handles those, within its limits.
- **UE 5.8 only.** That is the only engine version this was built and tested against, and the
  plugin's `EngineVersion` says so rather than implying broader support.
- **Windows (Win64) only.**
- A swap to an unrelated class is allowed where it is safe, and this is deliberate — Unreal's own
  path allows subclasses only. The refusal that protects you is the attachment check, not a
  subclass rule. Read the dropped-property list before applying a swap between unrelated classes.
- Work on a version-controlled project, and read the preview before using `-Apply`. The journal is a
  safety net, not a substitute for source control.

## Support

Questions and issues: <https://csaf.itch.io>

---

*Built by Core Systems Asset Factory. AI disclosure: code and graphics AI-generated; no audio;
no authored narrative text.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
