# DataTable Merge — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** DataTable Merge  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-08-29


---

# DataTable Merge

**Three-way merges an incoming CSV into a DataTable instead of overwriting everything you edited in
the editor.**

Unreal's CSV re-import is a total overwrite. Every edit made in the editor since the last export is
destroyed, with no warning and no diff — and if two people edited the same table, the second import
wins outright. The usual advice is to give up and pick one side.

DataTable Merge treats a re-import the way source control treats a pull: it reconciles the
**last-imported CSV**, the **incoming CSV** and the **current asset**, applies every change that only
one side made, and stops only where both sides genuinely collided.

**Comparison is per cell, not per row.** If the spreadsheet owner rebalanced `Damage` while a
designer retuned `Cost` on the same row, both land.

---

## First-time test (2 minutes)

**This plugin has no editor panel.** It is a headless commandlet: you run one command and it writes a
self-contained HTML page you open in a browser. The screenshots on the store page are that written
page — the proof sheet the tool produces — not a window inside the editor. There is nothing to dock
and no menu item to find.

Copy the plugin folder into `YourProject/Plugins/`, restart the editor once so it builds, then record
a merge base for a table you already have:

```
UnrealEditor-Cmd.exe "C:\path\to\YourProject.uproject" -run=DataTableMerge -Table=/Game/Data/YourTable -EstablishBase
```

That writes `YourProject/DataTableMerge/Base/…csv` and changes nothing else. **Commit that folder** —
it is the record of what was last imported, and it is what makes a real merge possible.

Now export the table to CSV, change one cell in the spreadsheet, change a *different* cell in the
editor, and run:

```
UnrealEditor-Cmd.exe "C:\path\to\YourProject.uproject" -run=DataTableMerge -Table=/Game/Data/YourTable -Csv="C:\path\to\incoming.csv"
```

That is a preview. It decides everything and writes **nothing**. It leaves one file in
`YourProject/Saved/DataTableMerge/`:

`DataTableMerge-<timestamp>.html` — open it in any browser. Every row that changed, the
last-imported / incoming / current value for each field, which one won and why, and every conflict
named at the top.

When you agree with the sheet, add one switch:

```
UnrealEditor-Cmd.exe "C:\path\to\YourProject.uproject" -run=DataTableMerge -Table=/Game/Data/YourTable -Csv="C:\path\to\incoming.csv" -Execute
```

`-Execute` is a separate switch deliberately, so no single mistyped flag can change your data. An
executed run also writes a JSON journal beside the report, and that journal is the undo:

```
UnrealEditor-Cmd.exe "C:\path\to\YourProject.uproject" -run=DataTableMerge -Table=/Game/Data/YourTable -Rollback="…\DataTableMerge-<timestamp>.json" -Execute
```

Run `-Help` for the full switch list.

---

## Switches

| switch | meaning |
| --- | --- |
| `-Table=/Game/Path/Table` | the DataTable asset. Required. |
| `-Csv=<file>` | the incoming CSV. Required, except with `-EstablishBase` or `-Rollback`. |
| `-Execute` | actually write. Without it the run is a preview. |
| `-OnConflict=refuse\|theirs\|ours` | default `refuse`: change nothing, report, exit 4. |
| `-EstablishBase` | record the asset's current contents as the merge base and stop. |
| `-Rollback=<plan.json>` | undo a previous `-Execute` run. Needs `-Execute` as well. |
| `-BaseDir=<dir>` | where merge bases live. Default `<Project>/DataTableMerge/Base`. |
| `-Out=<dir>` | where reports and plans go. Default `<Project>/Saved/DataTableMerge`. |
| `-Help` | the switch list. |

## Exit codes — a CI gate

| code | meaning |
| --- | --- |
| `0` | nothing to merge — the asset already agrees with the CSV |
| `1` | changes found (preview) or applied (`-Execute`) |
| `2` | the run failed |
| `3` | the arguments could not be used |
| `4` | **conflicts present and unresolved — a human must look** |

A preview run that must exit `0` is a "nobody has drifted from the sheet" check on a pull request.
Exit `4` is the one worth wiring up: it fails the build instead of silently picking a winner.

## How it decides

Per field, over every row in all three sides:

| last import | incoming | current | result |
| --- | --- | --- | --- |
| ✓ | unchanged | unchanged | left alone |
| ✓ | changed | unchanged | **take incoming** |
| ✓ | unchanged | changed | **keep current** |
| ✓ | changed | changed to the same value | converged — not a conflict |
| ✓ | changed | changed differently | ⛔ **conflict** |
| ✓ | row removed | row unchanged | row deleted |
| ✓ | row removed | row edited | ⛔ **conflict** |
| ✗ | row added | — | row added |
| ✗ | — | row added locally | row kept |

A column that exists on one side and not the other is treated as a **column-set change**, never as
"that side cleared the field" — so adding a column to the spreadsheet does not wipe anything.

## What it does not do

- **It does not migrate row structs.** This merges row *data* against a fixed struct. Changing the
  struct itself is a different problem and this tool stays out of it.
- **It does not need a database, a service or an account.** It reads a CSV and an asset, and writes a
  CSV and an asset.

## Without a merge base

The first run on a table has no base. The tool says so, in the log and at the top of the report, and
treats every difference as a conflict rather than guessing — without a record of the last import it
is genuinely impossible to tell an incoming edit from a local one, and guessing is exactly how data
gets destroyed. `-EstablishBase` fixes it in one run.

## Safety

- The preview is not a simulation. `-Execute` is read at exactly one place, the statement before the
  asset is written; everything above it runs identically in both modes.
- The undo journal is written **before** the package is saved, so a run that dies during the save is
  still reversible.
- The package is checked out of revision control before it is written, and the report names anything
  that would not check out.
- A rollback refuses a plan from a preview run, and refuses a plan written for a different table.
- If nothing was examined, no verdict is printed — never a reassuring zero.

## Requirements

- Unreal Engine **5.8**, Windows. That is the only engine this build has been compiled and run on,
  and it is the only version claimed.
- Editor-only. The module is an Editor-type module with a Win64 platform allow list, so nothing is
  included in a packaged game.

## Support

<https://csaf.itch.io>


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
