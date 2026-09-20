# Row Rename Surgeon — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Row Rename Surgeon  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-20


---

# Row Rename Surgeon

**Rename a DataTable or CurveTable row and keep every reference to it.**

Unreal renames a row by re-keying the table and doing nothing else. Every `FDataTableRowHandle`,
every `FCurveTableRowHandle` and every Blueprint row-name pin literal keeps the old name, and from
that moment resolves to nothing. Nothing warns you. The engine's own response to a row
disappearing from under a Blueprint node is to mark that Blueprint dirty and leave the dead name in
place.

Row Rename Surgeon renames the row *and* rewrites every reference to it, refuses when the rename
would be undone by a reimport, journals every file it writes, and then re-reads those files from
disk to prove no old name survived.

It also audits a project for row references that are **already** dead, with a CI exit code.

- UE 5.8, Windows, editor-only.
- Requires C++ compilation only in the sense that the plugin itself is C++; your project does not
  need to be a C++ project.

---

## Getting Started

### 1. Install

Copy the `RowRenameSurgeon` folder into your project's `Plugins` folder, so that you have:

```
<YourProject>/Plugins/RowRenameSurgeon/RowRenameSurgeon.uplugin
```

Launch the editor. The plugin is enabled by default and loads at the `Default` loading phase.

### 2. See what the project already has, from inside the editor

Either use the menu:

> **Tools → Row Rename Surgeon → Audit Data Table Row References**

or open the console (`` ` ``) and run:

```
RRS.Audit
```

Both are **read-only**. They read every DataTable and CurveTable under `/Game`, find every
reference to their rows, and write an HTML report to:

```
<YourProject>/Saved/RowRenameSurgeon/Report.html
```

The report opens automatically, and a notification tells you how many references name a row that no
longer exists.

To limit the audit to part of the project, or to put the report somewhere else:

```
RRS.Audit -Paths=/Game/Data -HtmlFile=D:/reports/rows.html
```

### 3. Audit from the command line, for CI

```
"C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" ^
  "C:\Path\To\YourProject.uproject" -run=RRS -Audit -unattended -nopause ^
  -ReportFile="C:\reports\rows.json" -FailOnBroken
```

`-FailOnBroken` returns exit code **5** when any reference names a row that does not exist, so a
build job can fail on it. Without it the audit always returns **0**.

### 4. Preview a rename

Read-only. Nothing is written.

```
UnrealEditor-Cmd.exe "YourProject.uproject" -run=RRS -unattended -nopause ^
  -Table=/Game/Data/DT_Items -Row=Bronze -To=Copper ^
  -HtmlFile="C:\reports\rename.html"
```

The log and the report list every reference that would be rewritten, what kind of reference it is,
and which package it lives in.

### 5. Do the rename

```
UnrealEditor-Cmd.exe "YourProject.uproject" -run=RRS -unattended -nopause ^
  -Table=/Game/Data/DT_Items -Row=Bronze -To=Copper -Apply ^
  -HtmlFile="C:\reports\rename.html"
```

In order, the run:

1. refuses if anything is wrong, **before writing a single byte** (see *Refusals* below);
2. copies every file it could write into
   `<YourProject>/Saved/RowRenameSurgeon/Journal/<stamp>/backup/`, and writes a `journal.json`
   naming them;
3. rewrites every reference, compiles each touched Blueprint once, then renames the row;
4. saves;
5. re-reads every saved package **from disk** and reports any that still names an old row.

Exit code **0** means the last step proved it. Exit code **6** means it saved but could not prove
it, and names what is wrong.

### 6. Rename many rows at once

Write a CSV, one `OldName,NewName` per line. Blank lines and lines starting with `#` are ignored.

```
# renames.csv
Bronze,Copper
Iron,Steel
```

```
UnrealEditor-Cmd.exe "YourProject.uproject" -run=RRS -unattended -nopause ^
  -Table=/Game/Data/DT_Items -Renames="C:\renames.csv" -Apply
```

A list may rename `A` to `B` and `B` to `C` in the same run. It may not rename two rows to the same
name.

### 7. Undo

```
UnrealEditor-Cmd.exe "YourProject.uproject" -run=RRS -unattended -nopause -Undo=20260919-214530-118
```

The stamp is printed by the apply run and is the folder name under
`Saved/RowRenameSurgeon/Journal/`. Undo restores every backed-up file byte for byte. It refuses if
the journal was written in a different project.

---

## Every switch

| Switch | Meaning |
| --- | --- |
| `-Audit` | Survey every DataTable and CurveTable in scope. Read-only. Cannot be combined with `-Table`. |
| `-Table=<content path>` | The one table to work on, e.g. `/Game/Data/DT_Items`. |
| `-Row=<name>` | The row to rename. Needs `-To`. |
| `-To=<name>` | The new name. Needs `-Row`. |
| `-Renames=<file.csv>` | Many renames at once. Cannot be combined with `-Row`/`-To`. |
| `-Apply` | Actually rename and rewrite. Without it, every run is read-only. |
| `-AllowImported` | Accept a table that still remembers a CSV or JSON import source. |
| `-Paths=<a>,<b>` | Limit `-Audit` to these content paths. Defaults to `/Game`. |
| `-HtmlFile=<file>` | Write the HTML report here. |
| `-ReportFile=<file>` | Write the JSON report here. |
| `-FailOnBroken` | With `-Audit`, exit 5 when any reference names a row that does not exist. |
| `-Undo=<stamp>` | Restore every file the apply run with that stamp wrote. |
| `-Help` | Print the above and exit 0. |

⚠️ `-Report=` is **refused by name**, because the engine reads any command-line key ending in
`Port=` as a network port. Use `-ReportFile=` or `-HtmlFile=`.

⚠️ If you run from Git Bash, a leading `/` in a content path is rewritten into a disk path by the
shell before Unreal ever sees it. Write `+Game/Data/DT_Items` instead of `/Game/Data/DT_Items`; the
plugin converts a leading `+` back to `/`.

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Audit clean, preview written, apply proved from disk, or undo restored everything. |
| 2 | Bad arguments. |
| 4 | Refused before anything was changed. |
| 5 | `-FailOnBroken` and at least one reference names a row that does not exist. |
| 6 | Applied and saved, but a save failed or a reference still names an old row after the re-read. |
| 7 | Undo could not restore every file. |

1 and 3 are never used: Unreal itself exits 3 when the process crashes, and a crash must never read
as a clean refusal.

## Refusals

Every one of these is decided **before** the first byte is written, and every one says so:

- the table still remembers a CSV or JSON import source, so the next reimport would undo the rename
  and silently re-break every reference (pass `-AllowImported` to accept that);
- a referencing package could not be loaded, so its row references could not be read;
- the row named by `-Row` does not exist in the table;
- the new name already exists in the table and is not itself being renamed away, so the rename
  would merge two rows into one;
- two rows are being renamed to the same name;
- a file that would be written is read-only, or has no file on disk;
- a backup could not be taken;
- the table already holds a row named `__RRS_<row>`, which is the scratch name the rename needs.

## What the scan can see

Row names are found in three places:

- **row handle properties** (`FDataTableRowHandle` and `FCurveTableRowHandle`) at any depth,
  including inside arrays, sets, maps and nested structs;
- **Blueprint pins whose default is a row-handle literal**;
- **the `RowName` pin of any Blueprint node that also points at the same table** — which covers the
  Get Data Table Row node and every function call taking a table and a row name.

Only packages the asset registry lists as referencing the table are loaded, so the scan does not
blanket-load your project.

A row name that is assembled at runtime, stored in a plain `FName` or `FString` outside a row
handle, or read from a file the editor never sees, cannot be found by any static scan and is not
counted. The report says so on every page.

## Notes

- The in-editor menu and `RRS.Audit` are read-only by design. Renaming runs from `-run=RRS -Apply`
  only, because rewriting a Blueprint pin in a live editor would leave you holding modified assets
  the report called untouched.
- A pin that has a wire into it is left alone: its literal default is dead text.
- Row name matching is case-insensitive, because `FName` comparison is and the engine's own row
  lookup is.
- AI disclosure: the code and the store graphics for this plugin were produced with AI assistance.

Support: https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
