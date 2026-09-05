# Material Instance Sheet — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Material Instance Sheet  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-05


---

# Material Instance Sheet

**Every Material Instance parameter override in a folder, in one spreadsheet, and back again.**

Unreal Engine 5.8 · Editor plugin · Windows 64-bit

---

## Why this exists

Unreal has one generic bulk editor, the Property Matrix, and it is switched off for Material
Instances on purpose. In UE 5.8 the Content Browser builds its "Edit Selection in Property Matrix"
entry behind a flag, then clears that flag if any selected asset is a `UMaterialInstanceConstant`,
`UMaterialFunction` or `UMaterialFunctionInstance`, under this comment:

> *"Materials can't be bulk edited currently as they require very special handling because of their
> dependencies with the rendering thread, and we'd have to hack the property matrix too much."*
>
> — `ContentBrowserAssetDataSource/Private/AssetFileContextMenu.cpp`, UE 5.8

There is a second reason it could not work anyway. A Material Instance does not store `Roughness`
as a property. It stores `ScalarParameterValues`, an array of structs, and the parameter's NAME is
a field *inside* an element. A property grid keys array elements by index, so a column could only
ever be `ScalarParameterValues[0]` — and index 0 is a different parameter on different instances.

So retuning a family of forty material instances means opening forty assets.

This plugin makes that one CSV.

---

## The round trip

**Export.** One row per Material Instance, one column per parameter.

```
UnrealEditor-Cmd.exe MyProject.uproject -run=MaterialInstanceSheet -Export
    -Paths=/Game/Materials -Sheet=D:/sheets/props.csv
```

```
Asset,Parent,Kind,Scalar:Roughness,Vector.R:Tint,Vector.G:Tint,...,Switch:UseDetail
/Game/M/M_Prop.M_Prop,,PARENT_DEFAULTS,0.5,1,1,...,false
/Game/M/MI_Crate.MI_Crate,/Game/M/M_Prop.M_Prop,INSTANCE,0.4,,,...,true
/Game/M/MI_Barrel.MI_Barrel,/Game/M/M_Prop.M_Prop,INSTANCE,,,,...,
```

**A blank cell means the instance inherits that value from its parent.** A filled cell is an
override. The `PARENT_DEFAULTS` rows show you what the blanks resolve to; they are reference only
and the import ignores them.

**Edit it.** Drag a column across forty rows in Excel, Google Sheets or LibreOffice. Delete a cell
to remove an override and go back to inheriting.

**Import.** Without `-Apply` this writes nothing and tells you exactly what would change:

```
UnrealEditor-Cmd.exe MyProject.uproject -run=MaterialInstanceSheet -Import
    -Sheet=D:/sheets/props.csv
UnrealEditor-Cmd.exe MyProject.uproject -run=MaterialInstanceSheet -Import
    -Sheet=D:/sheets/props.csv -Apply
```

**Undo.** `-Apply` writes a JSON journal *before* the first package is touched.

```
UnrealEditor-Cmd.exe MyProject.uproject -run=MaterialInstanceSheet -Revert
    -Journal=.../MaterialInstanceSheet_20260902_211500.journal.json -Apply
```

From inside the editor, the same switches on a console command:

```
MaterialSheet.Run -Export -Paths=/Game/Materials
```

---

## What it will not do

This is the part worth reading, because it is where a bulk tool either protects you or ruins an
afternoon. **Every one of these refuses the whole run. Nothing is written, including the rows that
were fine.**

| It refuses | Because |
| --- | --- |
| A column header it cannot parse | An ignored column is a parameter silently left out of a write you believe you made |
| A value that is not a number, or a switch that is not `true`/`false` | Writing 0 for `abc` is inventing an intention |
| A value for a parameter the material does not have | Usually a row pasted under the wrong parent |
| An edited `ro.` column (font, parameter collection) | A font parameter is an asset *and* a page; one cell cannot carry both safely |
| A vector with some channels filled and some blank | An instance stores one colour per vector parameter, not four independently overridable floats |
| A row with the wrong number of fields | A deleted comma would otherwise shift every cell left and clear every override to its right |
| Two columns for the same parameter | They cannot both be right, so neither is used |

And after writing, every value is **read back out of the asset**. Anything that does not read back
is reported as a failure, not counted as a success.

### What the sheet does not carry, said out loud

A Material Instance can also override **static component mask** parameters and **terrain layer
weight** parameters. This sheet models neither, and rather than leave that to be discovered, an
**export** refuses (exit 3, "the sheet was written and is incomplete") and the report names the
instance and the count. Edit those two in the Material Instance editor.

An **import** does not refuse over them, because it never claimed to carry them and it does not
disturb them — it writes the parameters the sheet names and leaves everything else exactly as it
was. Refusing a whole import because the project contains a mask this tool never touches would be a
false alarm, and a tool that cries wolf is a tool whose refusals stop being read.

Everything else a Material Instance can override — scalar, vector, double vector, texture, texture
collection, runtime virtual texture, sparse volume texture and static switch — is in the sheet.

---

## Switches

| | |
| --- | --- |
| `-Export` / `-Import` / `-Revert` | The mode. `-Export` is the default. |
| `-Paths=/Game/A,/Game/B` | Content roots to export. Default `/Game`. |
| `-Parent=/Game/M/M_Prop` | Only instances whose parent path contains this. Use it to get a sheet where every row shares one parameter set and no cell is structurally blank. |
| `-Sheet=<file>` | The CSV. Required for `-Import`. |
| `-Journal=<file>` | The undo journal. Written by `-Import`, read by `-Revert`. |
| `-Report=<file>` | The HTML report. Defaults to `<YourProject>/Saved/MaterialInstanceSheet/`, and the absolute path is printed in the run summary. |
| `-Apply` | Actually write. **Nothing is written without it.** |
| `-FailOnDrift` | Exit 4 when an import dry run finds the project and the sheet disagree. This is the CI gate. |
| `-OverriddenOnly` | Export only columns at least one instance overrides. |
| `-NoDefaults` | Leave out the `PARENT_DEFAULTS` reference rows. |
| `-ExitOnFinish` | Console command only: exit the editor when the run finishes, so a headless editor does not sit there holding the plugin. `-Help` honours it too. ⛔ It does **not** deliver the exit code to your shell — gate CI on the commandlet, see below. |
| `-Help` | The switch list. |

## Exit codes

| | |
| --- | --- |
| 0 | Success |
| 2 | Bad arguments |
| 3 | Refused. On an import **nothing was written**. On an export the sheet was written but is incomplete, and the report names what is missing |
| 4 | Drift: `-FailOnDrift`, and the project does not match the sheet |
| 5 | Something was written and did not read back. The undo journal is on disk |
| 6 | Could not read or write a file. This covers **three** distinct cases and all three mean the run did not do what it was asked: the sheet or journal could not be read; the undo journal could not be written, so not a single package was touched; or a package could not be saved, so the edits exist only in memory. None of them is a success and none of them returns 0 |

The distinction in row 6 is deliberate and it is the one worth checking if you are wiring this into
a build. A run whose journal could not be created has changed **nothing** — that is the tool
refusing to write without a way back, not a partial failure — and it is reported as a failure rather
than narrated in a log line above a green exit code.

### Using it as a build gate

**Rows come out sorted by parent, then by asset path, every time.** That is a deliberate promise
rather than an accident of how the assets happen to be indexed: a sheet that lives in source control
has to produce a diff a human can read, and a sheet ordered by the asset registry reshuffles itself
whenever packages are re-saved, so a one-value change would arrive as forty moved lines.

Commit the sheet next to your content. Then a CI step that runs the import with `-FailOnDrift` and
no `-Apply` fails the build the moment somebody hand-edits a material instance away from the
agreed values, and the HTML report names the asset, the parameter and both values.

⛔ **Gate CI on the COMMANDLET, not on the editor console command.**

```
UnrealEditor-Cmd.exe YourProject.uproject -run=MaterialInstanceSheet -Import
  -Sheet=Sheets/materials.csv -FailOnDrift -unattended -nosplash
```

The commandlet returns the code from the table above as the process exit code, so a build agent can
branch on it directly.

**The editor-console form is for running this inside an editor session, and it cannot fail a build.**

```
UnrealEditor-Cmd.exe YourProject.uproject -unattended -nosplash
  -ExecCmds="MaterialSheet.Run -Import -Sheet=Sheets/materials.csv -FailOnDrift -ExitOnFinish"
```

That works and does the same job, but a headless editor **always exits 0** from it whatever the run
decided. This is engine behaviour rather than a limitation here: a non-forced exit request becomes a
`PostQuitMessage` on Windows and a headless editor does not surface that value as the process code.
The tool still logs its own code as `exit code : N` on the last line of its summary, so a CI step
that must use the console form has to read the log rather than the process code.

**Without `-ExitOnFinish` the editor does the work, writes the sheet, and then keeps running** — on
a build agent that is a hung job, not a failed one. `-Help` honours it too, so a help invocation on
a build agent exits instead of sitting there.

⛔ **Do not reach for a trailing `,Quit` instead.** `Quit` is not an editor console command (the
editor's is `QUIT_EDITOR`), so it does nothing and you get the same wedged agent.

---

## The column grammar

```
[ro.]<Type>[.<Channel>][@L<n>|@B<n>]:<ParameterName>
```

| Example | Means |
| --- | --- |
| `Scalar:Roughness` | A global scalar |
| `Vector.G:Tint` | The green channel of a global vector. A vector is four columns |
| `DoubleVector.X:Origin` | The X channel of a double vector |
| `Texture:Albedo` | A texture. The cell is an object path, or `None` for an explicit null override |
| `Switch:UseDetail` | A static switch |
| `Scalar@L1:Roughness` | The same scalar inside material layer 1. `@B` is a blend parameter |
| `ro.Font:LabelFont` | Read-only. Exported so the sheet is complete, refused on import |

The parameter name is everything after the **first** colon, so a name may contain dots, spaces and
`@`. A parameter whose name contains a colon is refused by name at export rather than written as a
header that could not be read back.

**Types carried:** scalar, vector, double vector, texture, texture collection, runtime virtual
texture, sparse volume texture, static switch — all writable. Font and material parameter
collection are exported read-only. Static component masks are not carried.

**Numbers** are written in the shortest form that reads back as the same value, so `0.4` stays
`0.4` and a value of `1e-8` does not export as `0`. Typing `0.40` where the sheet said `0.4` is not
an edit: both sides of the comparison are normalised before anything is called a change.

---

## What it touches

- It reads asset **paths** through the asset registry and then loads only the Material Instances in
  the set you named. Parameter overrides are not registry tags, so the values genuinely have to be
  read from the assets; the report prints how many were found against how many were read.
- On `-Apply` it writes only the parameters that differ, then runs the engine's own post-edit
  sequence (`PreEditChange` / `PostEditChange` / `UpdateStaticPermutation`) so the change propagates
  down the instance chain, and saves the packages.
- It never edits a parent Material, never creates or deletes an asset, and never touches an
  instance that is not named in the sheet.

## Source control

Packages are saved through the editor's own save path, which checks out under your source control
provider the same way saving in the editor does. Run the dry run first, read the report, then
`-Apply`.

## Known behaviour worth stating plainly

- **The commandlet's process exit code is this tool's own, in every project.** Earlier builds
  inherited an engine behaviour where a successful run returned 1 if anything anywhere in the
  session had logged an error — including engine-side asset load errors that had nothing to do with
  this tool. That is fixed: the commandlet sets `UseCommandletResultAsExitCode`, so the code you
  gate CI on is the one in the table above. The tool still logs its code as `exit code : N` on the
  last line of its summary, so the two can be compared.
- **The editor-console path is different, and this is engine behaviour rather than a choice here.**
  A headless editor does not surface a console command's requested code as the process exit code, so
  `-ExecCmds=` always exits 0. Gate CI on the commandlet, not on the console command.
- Verified on Unreal Engine 5.8 on Windows 64-bit. No other engine version has been tested, so no
  other version is claimed.

---

Made by **Core Systems Asset Factory**. Support: <https://csaf.itch.io>

*AI disclosure: the code and the artwork in this product's store listing were produced with AI
assistance. Every claim in this document was checked against the Unreal Engine 5.8 source tree or
against a run of the tool.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
