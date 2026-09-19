# Blueprint Clone Extractor — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Blueprint Clone Extractor  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-19


---

# Blueprint Clone Extractor

Finds the node clusters that were copy-pasted across your Blueprints, and turns every copy of one into
a single call to a shared function. Each copy keeps its own values: whatever differs between the copies
becomes a parameter of the new function. Every Blueprint it touches is recompiled, nothing is saved
unless all of them compile clean, and every change can be undone.

Unreal Engine 5.8, Windows editor. Only 5.8 has been built and run.

## Why this exists

The same handful of nodes (play a sound here, spawn an effect there, apply some damage) ends up pasted
into a dozen Blueprints, or twice into the same one. When one copy needs a fix, you have to find all of
them. The editor's Collapse to Function works on one selection, in one Blueprint, by hand, and nothing
in the engine finds the copies.

## Requirements

- Unreal Engine 5.8, Win64 editor.
- A C++ or Blueprint-only project. The plugin is editor-only and adds nothing to a packaged game.
- Installed from Fab, the plugin arrives built. Copied in as source (the itch.io download), the editor
  compiles it the first time the project opens, which needs Visual Studio 2022 with the C++ workload.

## Install

1. Install Blueprint Clone Extractor to **Unreal Engine 5.8** from your Fab library, or copy the
   `BlueprintCloneExtractor` folder into `<YourProject>/Plugins/`.
2. Open your project, go to **Edit > Plugins**, search for **Blueprint Clone Extractor**, tick
   **Enabled**, and restart the editor when asked.

## Step by step: reproduce the documented result on a blank project (about 10 minutes)

Epic's own **Top Down** template has one copy-pasted cluster in it, so it is the sample. Every command
below runs in **PowerShell**. The project path used throughout is `D:\BCETrial`; if you use another path,
change it in every command.

**Step 1. Make the project.** In the Unreal Project Browser choose **Games > Top Down**, **Blueprint**, no
variant, no Starter Content, and create it at `D:\BCETrial`. Enable the plugin (see Install).

**Step 2. Scan it in the editor.** Choose **Tools > Scan Blueprints for Copy-Pasted Code**.
Expected: a notification reading `Blueprint Clone Extractor: 1 repeated cluster(s) across 3 Blueprint(s).`
and the report opens in your browser. It shows one cluster, **5 nodes × 2 copies**, marked **FUNCTION**
with "One member function of BP_TopDownController, every copy becomes a call": both copies are in
`BP_TopDownController` (the click and the touch handlers: a `<` compare against `PressedThreshold`, a
`Branch`, and `Move To` with `CachedDestination`). The same scan runs from the console as `BCE.Scan`. The report is saved as
`D:\BCETrial\Saved\BlueprintCloneExtractor\Report.html`. Then **close the editor**.

**Step 3. The same scan from the command line, keeping the machine-readable report.**

```powershell
& "C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" `
  "D:\BCETrial\BCETrial.uproject" -run=BCE -Scan -Paths=/Game `
  -ReportFile="D:\BCETrial\Saved\clusters.json" -unattended -nopause -nosplash
echo $LASTEXITCODE
```

Expected: a line `BCE scan: blueprints=3 graphs=10 nodes=68 ... clusters=1` and exit code **0**.
Run it again with `-FailOnClones=5` added: `BCE gate: 1 cluster(s) of 5 or more nodes -> FAIL`, exit
code **5**. That is the CI gate.

**Step 4. Preview the extraction. Nothing is written.**

```powershell
& "C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" `
  "D:\BCETrial\BCETrial.uproject" -run=BCE -Extract -ClustersFile="D:\BCETrial\Saved\clusters.json" `
  -Cluster=0 -Function=MoveIfShortPress -Preview -unattended -nopause -nosplash
```

Expected: `BCE extract: complete=true preview=true mode=member params=1 sites=0 ...`. Both copies are in
one Blueprint and read that Blueprint's own variables, so the function becomes a member of
`BP_TopDownController` (no `-Library` given). Its one parameter is the value each copy compares against
`PressedThreshold`, named after whatever feeds it in the first copy (a variable's name, or the pin it
comes from).

Had you passed `-Library=/Game/Shared/BFL_TopDown`, the plugin would refuse with exit code **6**, naming
`PressedThreshold` and `CachedDestination` as variables a library function cannot see, before building
anything.

**Step 5. Extract.** Run the Step 4 command again without `-Preview`. Expected:
`Extracted 2 copies into /Game/TopDown/Blueprints/BP_TopDownController::MoveIfShortPress (member function, 1 parameters).`,
then `BCE extract: complete=true preview=false mode=member params=1 sites=2 ... status=BS_UpToDate journal=<stamp>`,
exit code **0**. Note the stamp. Only `BP_TopDownController.uasset` changed on disk.

**Step 6. Look at it.** Open the project and `BP_TopDownController`: the new function `MoveIfShortPress`
holds the five nodes, and each of the two input handlers calls it once. The scan in Step 7 reads the
change back from disk: `graphs=11 nodes=66`, up one graph and down two nodes from Step 3.

**Step 7. Confirm the gate now passes.** Close the editor and run the Step 3 command with
`-FailOnClones=5`: `BCE scan: blueprints=3 graphs=11 nodes=66 ... clusters=0`, then
`BCE gate: 0 cluster(s) of 5 or more nodes -> PASS`, exit code **0**.

**Step 8 (optional). Put it all back.**

```powershell
& "C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" `
  "D:\BCETrial\BCETrial.uproject" -run=BCE -Undo=<the stamp from Step 5> -unattended -nopause -nosplash
```

Expected: `BCE undo: stamp=<stamp> restored=1 deleted=0 complete=true`, exit code **0**.
`BP_TopDownController.uasset` is back byte for byte.

## Use it on your own project

**In the editor** (read-only; nothing is changed):

- **Tools > Scan Blueprints for Copy-Pasted Code** scans everything under `/Game`.
- In the Content Browser, right-click one or more folders and choose **Scan Folder for Copy-Pasted
  Blueprint Code** to scan only those.
- Or from the console (press the backtick key): `BCE.Scan -Paths=/Game/Gameplay -HtmlFile=C:/Temp/clusters.html`

Each writes the report to `Saved/BlueprintCloneExtractor/Report.html` unless given `-HtmlFile`. The menu
entries also open it and show a notification with the count. A long scan shows a progress bar with a
**Cancel** button; a cancelled scan writes no report.

**Extraction runs from the command line, with the editor closed**, on purpose: there, a rewrite that
fails to compile is discarded with the process. In a running editor it would stay in memory.

## Command line reference

Everything runs headless through the `BCE` commandlet, so it works in CI as well as on a desk.

**Scan** (read-only):

```
UnrealEditor-Cmd.exe YourProject.uproject -run=BCE -Scan -Paths=/Game/Gameplay -ReportFile=clusters.json -HtmlFile=clusters.html
```

| switch | meaning |
| --- | --- |
| `-Paths=/Game/A,/Game/B` | content folders to scan, recursive |
| `-ReportFile=<file>` | machine-readable report: every cluster, every copy, node by node |
| `-HtmlFile=<file>` | the report you read: each cluster drawn as a graph, every copy listed, and the table of what differs between the copies |
| `-Label=<text>` | the project name printed on the HTML report |
| `-MinNodes=<n>` | the smallest cluster reported, default 4 |
| `-FailOnClones=<n>` | CI gate: exit 5 when any repeated cluster has `n` or more nodes |

**Extract** (writes):

```
UnrealEditor-Cmd.exe YourProject.uproject -run=BCE -Extract -ClustersFile=clusters.json -Cluster=0 -Function=PlayHitFeedback [-Library=/Game/Shared/BFL_Gameplay] -ReceiptFile=receipt.json
```

| switch | meaning |
| --- | --- |
| `-ClustersFile=<file>` / `-Cluster=<index>` | which cluster, from a `-ReportFile` scan |
| `-Function=<Name>` | the new function's name; refused if the target already has a graph of that name |
| `-Library=/Game/...` | put the function in this Blueprint Function Library (created if it does not exist). Leave it out to add the function to the one Blueprint that holds every copy |
| `-Preview` | derive the parameters and the boundary, write nothing |
| `-ReceiptFile=<file>` | what was done, counted, including the journal stamp |

**Which target to use.** Copies spread over several Blueprints need `-Library`: the function becomes a
static library function, and a node that acted on its own Blueprint (for example Get Actor Location on
self) gets a `Target` parameter, fed by a Self node at each call. Copies that all sit in one Blueprint
can leave `-Library` out, and must when they use that Blueprint's own variables: the function is added
to that Blueprint, where those variables and functions are in reach.

**Undo:**

```
UnrealEditor-Cmd.exe YourProject.uproject -run=BCE -Undo=<journal stamp>
```

The stamp is printed at the end of every extraction and written in the receipt. Undo restores every
Blueprint the extraction changed, then deletes the library if the extraction created it. It refuses a
journal written in a different project folder.

### Exit codes

| code | meaning |
| --- | --- |
| 0 | scanned, extracted, previewed or undone cleanly |
| 2 | bad arguments |
| 4 | a rewritten Blueprint did not compile clean; nothing was saved |
| 5 | `-FailOnClones` found a cluster at or above the given size |
| 6 | refused before changing anything, or an empty scan (zero graphs under the given paths), or an undo that could not complete. Every refusal prints a `REFUSED:` line saying why |

The plugin never returns 1 or 3. Unreal itself exits 3 when the editor process crashes, so a 3 in your
build log is a crash, never a refusal.

## What it does

1. **Scan.** Every graph of every Blueprint under the given folders is read. Reroute nodes count as
   wires, not code. Literals and node positions are ignored. A cluster is reported when the same nodes,
   wired the same way, appear at least twice and cannot be grown any further. A copy with one extra or
   one missing wire is a different cluster.
2. **Classify.** A cluster with one exec entry, at most one exec exit and no latent node (Delay,
   Timeline and the like) is marked **FUNCTION** and can be extracted. One holding a latent node is
   marked **MACRO** and reported. One spanning more than one exec region is marked **REPORT** and
   listed but never rewritten.
3. **Extract.** The boundary is worked out from every copy, not just one:
   - an input wired from outside in any copy becomes a parameter, and the wire moves to the call;
   - a literal that differs between copies becomes a parameter set to that copy's own value;
   - in a library function, a node that acted on its own Blueprint gets a `Target` parameter, fed by a
     Self node at each call;
   - literals that are the same in every copy stay inside the function.

   The nodes are copied into the new function with the engine's own copy and paste. Each copy is then
   replaced by one call to it, and the function's Blueprint and every changed Blueprint are compiled.
   **Nothing is saved unless every one of them compiles with no errors and no warnings.**
4. **Journal.** Before the first save, every file about to be overwritten is copied to
   `Saved/BlueprintCloneExtractor/Journal/<stamp>/`, and every file about to be created is listed.
   Without a journal, nothing is saved.

## What it does not do, by design

- It refuses a cluster whose data output is used outside it. Output parameters are not in this version.
- It refuses a cluster with more than one exec entry or exit.
- It does not extract clusters holding latent nodes into functions, because a function cannot hold a
  latent node. They are reported as MACRO. Macro extraction is not in this version.
- With `-Library`, it refuses a cluster that uses its own Blueprint's member variables, because a library
  function cannot see them, and says so before touching anything. If every copy is in one Blueprint, leave
  out `-Library`; if the copies are in several Blueprints, this version does not turn member variables into
  parameters.
- It never rewrites the library it is writing into.

## Why the scan loads Blueprints

A Blueprint's graphs are inside its package, and the asset registry holds no tag that describes them.
So the scan has to load each Blueprint under the folders you name. The registry is still used to pick
out the Blueprints, and nothing outside those folders is loaded. Blueprints nothing else holds are
released every 64 loads, so memory does not grow with the size of the project.

## AI disclosure

This product was built with AI assistance. Code: yes. Graphics: yes. Sounds: no. Text and dialog: no.

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
