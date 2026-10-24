# String Table Extractor — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** String Table Extractor  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-10-24


---

# String Table Extractor

Moves the text typed straight into your assets into a String Table, in one pass, and keeps the translations you already
paid for.

Unreal links ONE text property at a time to a String Table entry (the flag beside a text field in the Details panel). A
project with three hundred labels, buttons and tooltips typed inline is three hundred clicks, three hundred keys typed by
hand, and every existing translation orphaned: the next localization gather files the moved text under a new namespace
and key, seeds that key from the source string, and deletes the old key once nothing gathers it.

String Table Extractor does the whole move as one command:

- **Finds** inline text in Widget Blueprint widgets, Blueprint class defaults and component templates, Blueprint graph
  Text pin defaults (Make Literal Text, Format Text, any function input), Data Table rows and Data Assets: properties,
  nested structs, arrays and Map values.
- **Opens only what it needs.** The asset registry already records which packages carry localizable text
  (`PKG_RequiresLocalizationGather`); packages without it are never loaded. `-LoadAll` turns that off.
- **Proposes one entry per distinct text**, keys named by a rule you choose, identical texts folded into one entry, and
  writes the Extraction Sheet before anything changes.
- **Never merges two texts whose translations differ.** "Close" on a door and "Close" on a menu stay two entries when
  your French archive already says "Fermer la porte" for one and "Fermer" for the other.
- **Applies** with `-Apply`: creates the entries, re-links each text to its entry, checks each one reads exactly as
  before, recompiles each touched Blueprint once, and saves.
- **Carries every existing translation** to the new namespace and key in each culture archive, verbatim (a stale
  translation stays marked stale), so the next gather keeps it.
- **Keeps Format Text nodes wired.** The node rebuilds its argument pins from its pattern and drops the ones it no
  longer finds without breaking their links, so a Format pattern is re-linked only to an entry that reads as the same
  pattern with the same arguments (checked before the node is touched), and the node's pin count is checked after.
- **Journals and undoes**: every file is backed up first; `-Undo=<run id>` restores them.
- **Fails CI** with `-Verify` while any inline text remains in scope, and refuses a `-Paths` folder that holds no asset,
  so a typo cannot turn the check green.

## Install

Copy the `StringTableExtractor` folder into your project's `Plugins/` folder and open the project (or build it). It is an
editor plugin: nothing ships in your game.

Tested on Unreal Engine 5.8 (Win64). Earlier engine versions have not been run.

## Use

Preview (writes nothing but the report):

```
UnrealEditor-Cmd.exe <Project>.uproject -run=StringTableExtractor -Paths=/Game/UI -Table=/Game/Text/ST_UI
```

Apply:

```
UnrealEditor-Cmd.exe <Project>.uproject -run=StringTableExtractor -Paths=/Game/UI -Table=/Game/Text/ST_UI -Apply
```

Undo a run (the run id is printed and is the report folder's name):

```
UnrealEditor-Cmd.exe <Project>.uproject -run=StringTableExtractor -Undo=20261024-101500
```

CI gate (exit 2 while inline text remains):

```
UnrealEditor-Cmd.exe <Project>.uproject -run=StringTableExtractor -Paths=/Game/UI -Verify
```

Close the editor before `-Apply` or `-Undo`: they rewrite asset files.

## Switches

| Switch | Meaning |
| --- | --- |
| `-Paths=/Game/UI,/Game/Data` | Content folders to scan, recursively. Default `/Game`. `+Game/UI` is the shell-safe spelling (Git Bash rewrites a leading `/`). |
| `-Table=/Game/Text/ST_UI` | The String Table to fill. Created if it does not exist. Default `/Game/Text/ST_Extracted`. |
| `-Namespace=UI` | Namespace for a NEW table. Default: the table's name. An existing table keeps its own namespace. |
| `-Keys=Path` | Key names. `Path` (default): `Asset.Owner.Field`, e.g. `WBP_MainMenu.PlayLabel.Text`, or `Asset.Field` for a Data Asset's own fields, e.g. `DA_KeepersLog.Title`. `Source`: a slug of the text, e.g. `PLAY_GAME`. `Original`: the key the text already has. |
| `-Dedupe=Exact` | Identical texts share one entry (default). `None`: one entry per text. |
| `-LocTarget=Game` | Localization target whose translations are carried (`Content/Localization/<Target>/`). `None` skips it. |
| `-Apply` | Write. |
| `-Verify` | Check only; exit 2 while inline text remains. |
| `-Undo=<run id>` | Restore a run. Refuses if a file changed since the run, unless `-Force`. |
| `-LoadAll` | Open every asset in scope, not only the packages flagged as carrying localizable text. |
| `-Report=<dir>` | Report folder root. Default `Saved/StringTableExtractor`; each run writes `<root>/<run id>/`. |
| `-Help` | Print the switches and exit codes. |

## What a run writes

In `Saved/StringTableExtractor/<run id>/`:

- `ExtractionSheet.html`: every text found, grouped by asset, with its proposed table key, the texts sharing an entry,
  the translations found for it, and every text kept out with its reason. After `-Apply`, a proof strip: texts linked,
  texts reading exactly as before, translations carried, inline texts left in scope, Blueprints recompiled clean.
- `report.json`: the same, for scripts.
- `<Table>_entries.csv`: the entries as `Key,SourceString`, the format the String Table editor imports.
- `journal.json` and `backup/` (only after `-Apply`): what the run changed, for `-Undo`.

## What is kept out, and why

Every text the walk reaches that does not move is listed by name in the sheet:

- already reads from a String Table;
- culture-invariant (its author marked it never to be translated);
- generated, transient or keyless, such as a computed number or a text set from code with `FText::FromString` (it has
  no namespace and key for a culture archive to file it under);
- the same value as the parent class or the class default (extract it in the asset that declares it);
- a Format Text pattern whose argument pins would change (refused, the node untouched);
- a Set element, a Map key, or a Composite Data Table row (not rewritten by this version).

Empty texts are counted, not listed. Maps (levels) are not opened: level actors are not walked by this version.

## Translations

If `Content/Localization/<Target>/` has a gathered manifest and culture archives, each text's entry in each culture
archive is copied, as it is, to the table namespace and the new key. Gather the target again afterwards (Localization
Dashboard, Gather Text): the gather keeps an archive entry whose namespace and key already match, then compile as usual.
An entry whose translation equals its source (the native culture, or never translated) carries nothing and is skipped;
the gather seeds those again by itself.

**Where the table goes matters.** A String Table's entries are gathered only if the table asset sits inside the
target's asset gather. The Localization Dashboard's default Game target EXCLUDES `Content/Localization/*`, so a table
placed there is never gathered, and the next gather trims every translation carried to it. Before `-Apply` writes
anything, String Table Extractor reads `Config/Localization/<Target>_Gather.ini` (the Gather Text From Assets step's
include and exclude paths) and refuses, exit 4, when the table would sit outside the gather. The default table is
`/Game/Text/ST_Extracted` for this reason.

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Nothing inline in scope (preview / verify), or `-Apply` linked every text it found. |
| 2 | Inline text remains in scope (preview / verify). |
| 4 | A switch could not be understood, a `-Paths` folder holds no asset at all (so a mistyped folder cannot pass `-Verify` on nothing), or `-Apply` refused a table the localization gather would not reach. Nothing was written. |
| 5 | `-Apply` finished, but not clean: a text was left unlinked, or a touched Blueprint does not compile after re-linking (one that already failed before the run fails the same way). Each is named in the sheet; `-Undo` restores the run. |
| 6 | A file could not be written (read-only, not checked out). |
| 7 | `-Undo` refused: a file changed since that run. Nothing was restored. |

## Support

<https://csaf.itch.io>

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
