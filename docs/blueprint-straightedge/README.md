# Blueprint Straightedge — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Blueprint Straightedge  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-08-30


---

# Blueprint Straightedge

**Lay out every Blueprint graph in your project in one pass, and review the whole thing as a
before-and-after diagram before a single asset is written.**

Blueprint Straightedge is an editor plugin for Unreal Engine 5.8. It moves node positions and
resizes comment boxes so they still fit their contents. It changes nothing else.

---

## 1. What it is for

Graph readability tools format **the graph you have open**, one at a time, when you press a key.
That is fine for the graph you are working in and useless for the four hundred you are not. Nobody
opens every Blueprint in a project to tidy it, so projects drift: inherited code, a contractor's
graphs, a merge that dragged nodes on top of each other, a refactor that left a spine running
right to left.

Blueprint Straightedge runs over the whole project at once, unattended, and produces a sheet you
can review the way you would review a code diff.

---

## 2. Install

1. Copy the `BlueprintStraightedge` folder into your project's `Plugins` folder.
2. Open the project. If it offers to rebuild, accept.
3. Confirm it loaded: **Edit → Plugins → Editor**, search for *Blueprint Straightedge*.

Requires **Unreal Engine 5.8**, Windows, and a C++ or Blueprint project (a Blueprint-only project
will be asked to generate project files the first time, which the editor does for you).

> **Only 5.8 is claimed, because only 5.8 was built and run.** Every version listed on the store
> page has its own verified build behind it.

---

## 3. First run — two minutes, and it writes nothing

Nothing is written unless you pass `-Apply`. Start with a preview.

**From the editor** (this is the mode that measures node sizes exactly):

1. Open the console with `` ` `` (backtick).
2. Type:

   ```
   BPStraightedge.Run
   ```

3. Open the HTML sheet it names in the log. It lives under
   `<YourProject>/Saved/BlueprintStraightedge/`.

**From the command line, headless**, which is the same thing without opening the editor window:

```
"C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" ^
  "C:\Path\To\YourProject.uproject" -nullrhi -unattended -nosplash ^
  -ExecCmds="BPStraightedge.Run,Quit"
```

**As a commandlet**, the simplest thing to wire into a build step:

```
"C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" ^
  "C:\Path\To\YourProject.uproject" -run=BlueprintStraightedge
```

---

## 4. Why there are two headless modes, and which to use

An ordinary Blueprint node's on-screen size is produced by Slate when the node is drawn. It is
**not stored on the asset** — `NodeWidth` and `NodeHeight` exist but the engine only uses them for
nodes that can be resized, which in practice means comment boxes.

- **`BPStraightedge.Run` inside an editor session** builds the same widget the editor would draw
  and asks Slate for its exact size. The layout is exact. This works perfectly well headless with
  `-nullrhi -unattended` on a build machine with no display.
- **`-run=BlueprintStraightedge`** is a commandlet, and the engine does not create a Slate
  application for a commandlet. Node sizes are computed from each node's title, its visible pin
  rows and its class, and the layout is spaced more conservatively.

Both are safe to apply. **The report always states which one produced it**, and marks any graph
laid out from estimates. If you want exact spacing, use the editor form.

---

## 5. Applying it

```
BPStraightedge.Run -Apply
```

Before anything is saved, in this order, one asset at a time:

1. the previous positions are appended to an **undo journal** and flushed to disk;
2. the asset is **checked out of revision control**, if revision control is running;
3. the asset is saved.

If the run dies half way through — a disconnected depot, a full disk, a rebooted agent — the
journal on disk still describes everything that was written up to that point.

To put it all back:

```
BPStraightedge.Run -Revert=Saved/BlueprintStraightedge/undo_20260830_141500.jsonl
```

> **Run it on a clean source-control working tree and look at the diff.** That is the one check
> that does not depend on this plugin being right about itself.

---

## 6. Switches

| Switch | Meaning |
| --- | --- |
| `-Paths=/Game/A,/Game/B` | Content roots to scan. Default `/Game`. |
| `-Name=Weapon,Enemy` | Only Blueprints whose path contains one of these. |
| `-Apply` | Write the layout. Without it nothing is written at all. |
| `-Revert=<file.jsonl>` | Put every node back the way an undo journal says it was. |
| `-Report=<file.html>` | Where the sheet goes. |
| `-Journal=<file.jsonl>` | Where the undo journal goes. |
| `-ColumnGap=<n>` | Gap between columns of nodes. Default 120, range 16–800. |
| `-RowGap=<n>` | Gap between nodes in a column. Default 48, range 8–400. |
| `-CommentPad=<n>` | Padding inside a comment box. Default 36, range 8–200. |
| `-Grid=<n>` | Snap positions to this grid. Default 16, `0` disables. |
| `-Sweeps=<n>` | Crossing-reduction sweeps. Default 4, range 0–32. |
| `-Align=<n>` | Vertical alignment passes. Default 6, range 0–32. |
| `-MaxPlates=<n>` | How many graphs get a before/after diagram. Default 60. |
| `-ExitOnFinish` | Editor form only: quit with the exit code below. |
| `-Help` | The switch list. |

A number outside its range is **refused, not clamped** — `-RowGap=4800` tells you so instead of
quietly becoming 400.

---

## 7. Exit codes, for a build step

| Code | Meaning |
| --- | --- |
| `0` | Everything asked for was planned, or applied. |
| `1` | Bad or missing arguments. Nothing was scanned. |
| `2` | No Blueprint was found under the paths given. **An empty scan is an error, not a pass.** |
| `3` | One or more graphs were refused, with a reason, and left untouched. |
| `4` | An asset could not be checked out or saved. |

---

## 8. What the layout does

1. **Rank.** Nodes are ranked left to right along execution flow by longest path. Execution flow is
   the spine, so a graph reads the way it runs.
2. **Break cycles.** Blueprint graphs are not acyclic — a loop wires its body back into itself. A
   deterministic depth-first pass excludes back edges from the ranking so a looping graph still
   ranks, and ranks the same way every time.
3. **Pull pure nodes in.** A pure data node has no execution pins, so nothing stops it drifting to
   the far left of the graph. Each one is moved right to sit immediately beside the node that
   consumes it.
4. **Reduce crossings.** Median sweeps within each column, seeded from where you already had things
   vertically, so a graph that was already tidy comes back looking much as it did.
5. **Place.** Columns are spaced by the widest node in the previous column; within a column, each
   node is pulled level with the nodes it connects to and then separated. Execution wires pull three
   times as hard as data wires.
6. **Snap** to the same 16-unit grid the graph editor uses.

### Comment boxes are handled first, not last

A comment box contains nodes **by geometry alone** — there is no parent pointer to follow, and the
list the editor keeps while you drag one is not saved with the asset. So membership is computed from
the original geometry *before anything moves*, each comment is laid out as a self-contained group,
the group is placed as a single block, and only then is the box refitted around it. Nested comments
are handled innermost first.

Laying a graph out flat and refitting the boxes afterwards is the obvious approach and it scatters
hand-authored comments across the graph. This does not do that, and there is a test that would fail
if it started to.

---

## 9. What it will not do

- **It will not guess which comment box owns a node.** If a node sits fully inside two boxes of
  identical size and neither contains the other, the graph is refused and named in the report.
- **It will not write a layout it knows is wrong.** If its own result would overlap two nodes, that
  result is discarded and the graph is left exactly as it was.
- **It will not treat an empty scan as a tidy project.** No Blueprints found is exit code 2.
- **It will not clear a read-only flag.** If revision control is not running and the file is locked,
  the asset is left alone and the report says so.
- **It will not touch anything but positions.** No pin, no default value, no variable, no function,
  no comment text, no compilation setting.

---

## 10. Reading the report

The sheet is a drawing board. Each changed graph appears as two panels: what it is now, and what it
would become. The diagram is drawn from the same data the layout ran on, so it cannot drift from
what will actually be written.

- **Bright, heavy wires** are execution. **Thin, cool wires** are data.
- **Blue-headed nodes** have execution pins. **Green-headed nodes** are pure data nodes.
- **Amber outlines** are comment boxes, drawn at the size they will be refitted to.
- Every graph read appears in the full list at the bottom, including the ones that did not change,
  so the counts at the top can be checked against something.

Paths in the sheet are relative to your project, so the sheet is safe to commit and to attach to a
review.

---

## 11. Frequently hit things

**"It moved a graph I liked."** Run `-Revert` with the journal path from the report, then use
`-Name=` to exclude that asset from future runs. There is no partial undo by design: a journal
entry describes a whole graph.

**"The result is not how I would have drawn it."** It will not be, always. It is a heuristic with a
stated shape (section 8). It is deterministic and idempotent, which is what makes it safe to run
from a build step: the same graph always gives the same answer, and running it twice changes
nothing the second time.

**"Nothing happened."** Check the exit code and the log. Exit 2 means the scan found no Blueprints
under the path you gave — usually a typo in `-Paths`.

**"It says my sizes were estimated."** You ran the commandlet. Use the editor form
(`-ExecCmds="BPStraightedge.Run,Quit"`), which measures.

---

## 12. Support

Questions, bugs and feature requests through the marketplace support channel on the product page.

Documentation: <https://github.com/onefreeman1337/csaf-releases/blob/main/docs/blueprint-straightedge/README.md>

---

*Blueprint Straightedge · Core Systems Asset Factory · Unreal Engine 5.8*
*Unreal® and Unreal Engine® are trademarks of Epic Games, Inc. This product is not affiliated with
or endorsed by Epic Games, Inc.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
