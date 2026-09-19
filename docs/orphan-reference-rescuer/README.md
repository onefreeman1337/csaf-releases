# Orphan Reference Rescuer — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Orphan Reference Rescuer  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-19


---

# Orphan Reference Rescuer

**For Unreal Engine 5.8. Editor-only. Windows (Win64).**

---

## 1. The problem: a reference to an asset that moved without a redirector

When you move an asset inside the Unreal Editor, it leaves a **redirector** at the old path, and
Epic's *Fix Up Redirectors* (and the `ResavePackages -fixupredirects` commandlet) later rewrite every
reference to the new path.

That only works while the redirector exists. It does not exist when:

- the file was moved in Explorer, Finder, a Git client or Perforce instead of the editor;
- a branch that still uses the old path was merged after the redirectors were fixed up and deleted on
  the main branch;
- redirectors were cleaned up before every branch had picked up the move.

Now the referencing package still names a path that nothing lives at. Open it and the reference
loads as **nothing** (a material instance with no parent, a mesh slot with no material, a Blueprint
variable set to None). **Save it in that state and the reference is erased for good**: the one thing
that recorded what it pointed at is the file you just overwrote.

Epic's tools cannot help, because they fix up *redirectors*, and there is no redirector left.

## 2. What it does

1. **Finds every broken reference.** It reads the Asset Registry's dependency edges for every
   package under the folders you choose and keeps the edges whose target package does not exist on
   disk. Nothing is loaded to find them.
2. **Learns what each missing asset was.** For every hard reference it reads the referencing
   package's own **import table** (without loading the package's objects) to get the missing
   asset's name and its **class** - Material, StaticMesh, Blueprint and so on.
3. **Finds where it lives now.** It looks for an asset with the same name **and** the same class, in
   this project's own content and project plugins only. Engine content is never offered as a new
   home.
4. **Refuses anything it cannot prove.** Two possible homes, a same-named asset of the wrong class,
   a missing package under a plugin that is not enabled, and a reference held only as a soft path
   (which records no class) are each reported with the reason and left alone.
5. **Relinks, reversibly, and proves it.** With `-Apply` it copies every file it may write into a
   journal first, relinks through a temporary package redirect, loads every referencer and checks
   that each rescued reference now holds a live object in the new location, and **only then**
   saves. It then removes the redirect, rereads the saved files from disk, and counts every edge:
   the run succeeds only if every one points at the new location. `-Undo=<journal>` puts every file
   back byte for byte.

## 3. Install

1. Close the editor.
2. Copy the `OrphanReferenceRescuer` folder into your project's `Plugins/` folder, so that you have
   `YourProject/Plugins/OrphanReferenceRescuer/OrphanReferenceRescuer.uplugin`. Create `Plugins/` if
   it does not exist.
3. Open the project. Unreal offers to build the plugin the first time; choose **Yes**.
4. Confirm it loaded: **Edit > Plugins**, search for *Orphan Reference Rescuer*; it is listed and
   enabled. The **Tools** menu now has a *Find Orphaned References* entry.

## 4. Step by step: reproduce the documented result on a blank project (about 10 minutes)

This walkthrough breaks one reference on purpose and repairs it. Every expected result below is what
the tool printed when this walkthrough was run on UE 5.8.

**Step 1. Make a blank project.** In the Epic Games Launcher, create a UE 5.8 project from the
**Blank** template (Blueprint, no Starter Content), for example `D:\ORRTrial`. Install the plugin as
in section 3 and confirm it loaded.

**Step 2. Make an asset and something that references it.** In the Content Browser, create a folder
`Materials`. Inside it, **Add > Material**, name it `M_Base`. Right-click `M_Base` >
**Create Material Instance**, and name the new instance `M_Base_Inst`. **File > Save All**, then close
the editor.

**Step 3. Break the reference the way a merge or an Explorer move does.** In Windows Explorer, create
the folder `D:\ORRTrial\Content\Moved` and **move** `D:\ORRTrial\Content\Materials\M_Base.uasset`
into it. Do not open the editor yet: opening `M_Base_Inst` now would show it with no parent, and
saving it would erase the reference.

**Step 4. Scan (read-only).** Open a Command Prompt and run (one line):

```
"C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" "D:\ORRTrial\ORRTrial.uproject" -run=ORR -HtmlFile="D:\ORRTrial\Saved\ORR_scan.html" -unattended -nosplash -NullRHI
```

Expected: the log contains a line

```
LogORR: Display:   Rescuable      /Game/Materials/M_Base -> /Game/Moved/M_Base  (Material, 1 referencer(s)) Exactly one Material named M_Base exists: /Game/Moved/M_Base.
```

and the process exits with code 0. Open `D:\ORRTrial\Saved\ORR_scan.html`: one green *Rescuable*
card shows `/Game/Materials/M_Base` struck through, an arrow, and `/Game/Moved/M_Base`, referenced by
`/Game/Materials/M_Base_Inst`.

**Step 5. Relink.** Run the same line with `-Apply` added (and a new report name):

```
"C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" "D:\ORRTrial\ORRTrial.uproject" -run=ORR -Apply -HtmlFile="D:\ORRTrial\Saved\ORR_apply.html" -unattended -nosplash -NullRHI
```

Expected: `ORR apply: relinked=1 saved=1 failed=0 edgesVerified=1 edgesStillMissing=0` and a
`Journal:` line ending in `Undo with: -run=ORR -Undo=<stamp>`. Exit code 0. The report's banner
reads *Relinked and proven from disk*.

**Step 6. Look.** Open the project and open `M_Base_Inst`. Its **Parent** is `M_Base`, and hovering
the parent shows `/Game/Moved/M_Base`.

**Step 7 (optional). Put it back.** Close the editor and run
`... -run=ORR -Undo=<stamp from Step 5> -unattended -nosplash -NullRHI`. Expected:
`Restored 1 file(s), refused 0.` `M_Base_Inst` is back exactly as it was before Step 5, pointing at
the missing path again.

## 5. Quick start on your own project

1. Commit or check in first. Close the editor.
2. Scan: `UnrealEditor-Cmd.exe <YourProject.uproject> -run=ORR -HtmlFile=<report.html>` and read the report.
3. If it lists rescuable references, check out the referencing packages it names, then run the same
   line with `-Apply`.
4. Keep the journal stamp it prints until you have opened the project and are happy.

Inside a running editor, **Tools > Find Orphaned References** (or the console command `ORR.Scan`)
runs the same read-only scan and opens the report. Relinking runs only from the command line: inside
a running editor a referencer that is already loaded holds nothing where the reference was, and
saving it would erase the reference.

## 6. Switches

| Switch | Meaning |
| --- | --- |
| `-run=ORR` | Run the tool. Alone, it scans (read-only). |
| `-Apply` | Relink every *Rescuable* reference, resave the referencers, prove it from disk. |
| `-Undo=<stamp>` | Restore every file the apply run with that journal stamp wrote. |
| `-Paths=<a,b>` | Content folders whose packages are read as referencers. Default `/Game`. In Git Bash write `+Game/Folder` for `/Game/Folder`. |
| `-HtmlFile=<file>` | Write the HTML report there. |
| `-ReportFile=<file>` | Write the machine-readable JSON report there. |
| `-FailOnOrphans` | For CI: exit 5 if any missing package is found. |
| `-Help` | Print the switches and exit codes. |

`-Report=` is refused on purpose: the engine reads anything ending in `Port=` on its command line as
a network port.

## 7. Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Scan finished; or `-Apply` relinked and proved every edge from disk; or `-Undo` restored every file. |
| 2 | Bad arguments. |
| 4 | Refused before any change: nothing rescuable, a read-only referencer, a live-import check failed, or zero packages under `-Paths`. |
| 5 | `-FailOnOrphans` and at least one missing package was found. |
| 6 | `-Apply` saved, but a save failed or an edge still points at a missing package. Use `-Undo`. |
| 7 | `-Undo` could not restore every file. |

Codes 1 and 3 are never used by the tool: Unreal itself exits 3 when the process crashes, and a crash
must never read as a refusal.

## 8. What it will and will not do

- **A match needs the same name AND the class the referencer recorded.** A material and a mesh both
  called `Rock` are told apart by the referencer's own import table.
- **Two possible homes is a refusal, never a guess.** Add a `[CoreRedirects]` package redirect for
  the right one, or rename the other.
- **A missing package under a plugin that is not enabled is never relinked** to a same-named project
  asset. Enable the plugin.
- **Soft references (soft object paths) record no class**, so a missing package referenced only
  softly is reported, not relinked. When a rescued package also has soft referencers, they are
  resaved with it and counted in the proof.
- **Nothing is saved unless every hard reference resolved live** after the relink.
- **Every file it may write is copied first**, and `-Undo` restores those copies. A journal written
  in another project folder is refused.
- It never moves, renames or deletes an asset, and never edits your config files.

## 9. What it does not claim

- **Verified on UE 5.8 only**, because 5.8 is the only version it has been built and run against.
- It repairs references to assets that still exist somewhere in the project. An asset that was
  deleted is reported as *No match*; restore it from version control.
- Class names in C++ (`/Script/...`) are not assets; a renamed C++ class needs a `[CoreRedirects]`
  class redirect, not this tool.

## 10. The report's typeface

The HTML report is set in the fonts your system already has (Segoe UI and Cascadia Mono on Windows).
The plugin ships no font files and no third-party code of any kind.

## 11. AI disclosure

Code: generated with AI assistance. Graphics: generated with AI assistance. Sounds: none.
Text and dialog: none.

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
