# Parameter Identity Repair — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Parameter Identity Repair  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-08-31


---

# Parameter Identity Repair

**Finds and fixes material parameters that share one hidden identity.**
Unreal Engine 5.8 · Windows · Editor plugin, C++ source included.

---

## 1. What is actually wrong with your project

Every material parameter carries an `ExpressionGUID`. It is not the parameter's name and you never
see it. Material instances bind their overrides to that GUID, and the engine uses it to migrate an
override when the parameter is renamed.

**Duplicate a material function and the copy keeps the original's GUIDs.** That is not a bug in your
workflow, it is the engine behaving as designed. `UMaterialExpression::PostDuplicate` carries this
comment, verbatim, in UE 5.8:

> `We do not force a guid regen here because this function is used when the Material Editor makes a`
> `copy of a material to edit. If we forced a GUID regen, it would cause all of the guids for a`
> `material to change everytime a material was edited.`

So the moment you build a material family the ordinary way — duplicate `MF_Rough`, edit it, rename
its parameter to something else — you have two different parameters wearing one identity. From then
on:

- one of them can shadow the other wherever both are reachable from the same material;
- renaming either one migrates the *other's* instance overrides;
- and instance values disappear with no error, no warning, and nothing in the log.

**Nothing in the editor repairs this.** Across the whole engine, the only places that force a fresh
parameter identity are node creation and paste. There is no command, no menu item and no scripting
function that re-mints a collision that already exists.

> **One thing this plugin will not claim:** copy-pasting a parameter node does *not* cause this in
> 5.8. `PostEditImport` forces a regeneration, so pasted nodes get their own identity. The cause is
> asset duplication, and assets inherited from older engine versions. We measured it rather than
> repeating the folklore.

---

## 2. Install

1. Copy the `ParameterIdentityRepair` folder into your project's `Plugins/` directory.
2. Restart the editor. It will offer to build the module; accept.
3. Confirm it loaded: the console command `MaterialParams.Repair -Help` prints the switch list.

Built and verified against **UE 5.8 on Windows**. That is the only configuration claimed, because
that is the only one it was built and run on.

---

## 3. First run — two minutes, writes nothing

Open the editor console (`~`) and run:

```
MaterialParams.Repair
```

Nothing is modified. An HTML sheet lands in
`<YourProject>/Saved/ParameterIdentityRepair/ParameterIdentityRepair.html`. Open it.

Every shared identity is listed with a grade:

| Grade | What it means |
| --- | --- |
| **Critical** | The holders have different names **and** at least one material reaches more than one of them. One parameter is shadowing another right now. |
| **Serious** | Different names, but no single material reaches two of them yet. It breaks the day you use both together, and renames already migrate wrongly. |
| **Latent** | Every holder has the same name. Harmless today; rename one and the others' instances follow a rename nobody asked for. |

The sheet names the owning assets, the expression inside each, the parameter name and type, and
every material instance override bound to that identity.

---

## 4. Repairing

Take a source-control snapshot first. Then:

```
MaterialParams.Repair -Apply
```

By default this repairs **Serious and Critical** groups and leaves Latent ones listed but untouched
— repairing every same-name group on a first run would rewrite thousands of packages for a defect
you have not hit.

Cautious first pass:

```
MaterialParams.Repair -Apply -Severity=Critical -Limit=10
```

To undo:

```
MaterialParams.Repair -Revert=<the journal path printed in the log>
```

The undo journal is written **in full, to disk, before the first package is saved.** If the journal
cannot be written the run stops and nothing is saved.

A revert prints its own summary — it is not a scan, so it reports what it restored rather than what
it examined:

```
  mode                  : REVERT (assets restored from a journal)
  groups in journal     : 40
  identities restored   : 43
  overrides restored    : 6
  overrides already ok  : 6
  packages saved        : 49
```

**`overrides already ok` is a success, not a warning.** A revert restores each group's parameter
identities before its instance overrides, and the engine re-resolves an instance's override rows
from its parent by name when the instance loads. So a row can already be carrying the original
identity by the time the journal reaches it. It is counted separately rather than silently, because
the honest statement is *"this row is correct and I did not have to move it"* — not *"this row moved"*
and not *"this row is missing"*.

**Exit 0 from a revert means every row in the journal is back.** Anything it genuinely could not
find is listed by asset and parameter name, and the run exits 4.

---

## 5. What the repair does, exactly

For each group:

1. **Picks a keeper.** The holder whose parameter name carries the *most* instance overrides keeps
   the shared identity. This is not arbitrary: re-minting an expression is provably safe, while
   re-binding an override is the step that could touch your authored data, so the keeper rule
   minimises how many overrides need to move at all. Ties break lexically, so two runs over an
   unchanged project reach the same answer.
2. **Re-mints every other holder** through the engine's own `UpdateParameterGuid(true, ...)`, which
   derives the new GUID from the expression's path via `CookDeterminism::NewGuid`. A randomly
   generated GUID would look identical in the editor and quietly make your package
   non-deterministic between cooks.
3. **Verifies each re-mint** actually changed the value, and that the new value is not already in
   use anywhere else in the scan. Either failure rolls the whole group back.
4. **Re-binds instance overrides by NAME** to the holder that name identifies.
5. **Refuses, and says so, whenever the answer is not exact** — see below.

### What it refuses to do

- An override whose parameter name matches **no** holder: left alone, reported.
- An override whose name matches **two or more** holders: genuinely ambiguous, left alone, reported.
- A re-mint that returns the same GUID, or one already in use: **whole group rolled back**, reported.
- A scan that examines zero parameter expressions: reported as a **failed scan**, exit code 2 — not
  as a clean project.

### What it never touches

No parameter is renamed. No default value is changed. **No override value is read or written** — the
only field the repair assigns to is `ExpressionGUID`, which is why your authored values survive by
construction rather than by a comparison that could itself be wrong.

### Known limit in 1.0.0

**Static switch and static component mask overrides are reported but not re-bound.** In UE 5.8 those
rows are not on a plain property array and are reached through a different update path; this plugin
does not write through a path it has not proven. If a repaired parameter is a static switch, check
those instances by hand — the report names them.

---

## 6. Running it in CI

```
UnrealEditor-Cmd.exe YourProject.uproject -run=ParameterIdentityRepair -Paths=/Game
```

Exit codes are stable and safe to gate on:

| Code | Meaning |
| --- | --- |
| 0 | Clean at the requested severity, applied with nothing refused, or a revert that restored every row |
| 1 | A switch was malformed. Nothing scanned, nothing written |
| 2 | **Nothing was scanned.** A failure, not a pass — usually a wrong `-Paths=` |
| 3 | Preview found collisions at or above the threshold |
| 4 | Apply finished with at least one group refused or rolled back, or a revert could not find a row |

`-nullrhi` is safe for this plugin: it reads editor-only asset data and renders nothing.

---

## 7. Every switch

```
-Paths=/Game[,/More]  Content roots to audit. Default /Game.
-Severity=<grade>     Critical | Serious | Latent | All. Default Serious.
-Apply                Write the repair. WITHOUT THIS NOTHING IS EVER MODIFIED.
-Limit=<n>            Repair at most n groups. Good for a first cautious pass.
-NoSave               Do the whole repair in memory and report it, but save nothing.
-Revert=<journal>     Replay an undo journal written by an earlier -Apply run.
-Report=<file.html>   Where the sheet goes. Default Saved/ParameterIdentityRepair/.
-Journal=<file.json>  Where the undo journal goes.
-ExitOnFinish         Quit the host process with the exit code (build agents).
-Help                 The switch list.
```

---

## 8. Speed, honestly

`ExpressionGUID` is **not** an Asset Registry tag in UE 5.8, so the identities cannot be read
without opening the packages that hold them. The registry is used to find the candidate set for
free; the parameters themselves need a load.

On a large project the audit takes minutes, not seconds. Garbage is collected periodically so memory
stays flat, progress is logged every 500 assets, and every report prints how many assets the
registry offered against how many this run actually opened — so you can see the basis of the numbers
rather than taking them on trust. Material instances are only opened at all when a collision exists.

---

## 9. Source, support, licence

Full C++ source is included and is meant to be read. Start at `PIRClassify.cpp` — the grading rule
and the keeper rule are the two places this tool could be wrong in a way that matters, so both are
kept free of engine types and are covered by automation tests, including a deliberate sabotage case.

Run the tests from the Session Frontend, or:

```
UnrealEditor-Cmd.exe YourProject.uproject -ExecCmds="Automation RunTests CSAF.ParameterIdentityRepair" -unattended -nullrhi -ExitOnFinish
```

Support: <https://csaf.itch.io> · Licence: see `LICENSE.txt`.

**AI disclosure:** this plugin's code and its store graphics were produced with AI assistance, and
that is declared on every storefront it is sold through.

Copyright (c) 2026 Core Systems Asset Factory. All Rights Reserved.
Unreal® and Unreal Engine® are trademarks of Epic Games, Inc. Not affiliated with or endorsed by
Epic Games, Inc.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
