# Threads - Story Flowchart, Ending Gallery & Branch Jump for RPG Maker MV & MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Threads - Story Flowchart, Ending Gallery & Branch Jump for RPG Maker MV & MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/threads  
**Docs published:** 2026-11-05


---

# Threads — a player-facing story flowchart for RPG Maker MZ and MV

**Version 1.1.** New: RPG Maker MV 1.6, touch, and any screen size including portrait. Fixed: a branch
jump no longer forgets the endings collected since the jump point (see Branch jump).

**Your game has multiple endings. Your players cannot see them.**

Threads gives them a chart: every scene they reached, every branch they took, every branch
they can see exists but have not opened, and every ending they have collected. From that
chart they can jump straight back to any decision they have already reached and take the
other road.

And **every ending generates its own emblem from the path that reached it** — the
decisions taken and the order they were taken in. Two players who reach the same ending by
different routes get visibly different marks. There are no image files in this plugin;
every mark is drawn from a corpus of 48 motifs.

---

## Install

1. Copy the three files from `js/plugins/` into your project's `js/plugins/` folder.
2. Add them in the Plugin Manager **in this order**:

   ```
   ThreadsMotifs.js     the motif corpus (data only)
   Threads.js           the model, the save record, the emblems
   ThreadsUI.js         the chart scene, the gallery, the renderer
   ```

   Threads resolves its dependencies lazily, so a wrong order will not silently break it —
   but this order is the one to use.

   **In RPG Maker MV 1.6:** also copy `CSAF_MVBridge.js` and put it **at the top of the list**, above
   `ThreadsMotifs.js`. It supplies the few parts of MZ's scripting these files use and MV lacks, changes
   no window of yours or of any other plugin, and does nothing at all in MZ (you can leave it out there).

3. Open **Threads.js** in the Plugin Manager and fill in the **Nodes** parameter.

That is the whole install. Nothing else needs configuring to see it work.

---

## Declaring your story

A **node** is any point you want the player to see on the chart. You do **not** have to
declare every event — declare the *shape* of the story you want them to see.

| Field | What it does |
| --- | --- |
| **Id** | A short unique key you use in plugin commands, e.g. `ch2_gate`. No spaces. |
| **Label** | What the player sees on the chart. |
| **Act / Column** | Horizontal position. Lower numbers sit further left. Use it for chapters. |
| **Kind** | `decision` · `event` · `ending`. Decisions can be jumped back to; endings appear in the gallery. |
| **Leads From** | Comma-separated ids of the nodes that can lead here. This is what draws the lines. Blank for a starting node. |
| **Ending Tone** | Endings only. Picks the emblem's visual family. Leave blank to derive one from the path. |
| **Secret** | Hides the label until the node is reached — the player sees that *something* is there. |

Nodes with the same **Act** stack vertically in the order you list them, so you control the
vertical arrangement by ordering your list.

### A worked example

```
id: wake        label: The Waking          act: 0   kind: event      from:
id: letter      label: The Sealed Letter   act: 1   kind: decision   from: wake
id: read        label: You Read It         act: 2   kind: event      from: letter
id: burn        label: You Burn It         act: 2   kind: event      from: letter
id: harbour     label: The Harbour         act: 3   kind: decision   from: read,burn
id: e_severed   label: Severed             act: 4   kind: ending     from: harbour   tone: severance
id: e_together  label: Together            act: 4   kind: ending     from: harbour   tone: union
```

`harbour` lists **two** parents, so the chart draws both roads into it and marks it as a
convergence — the point where two different routes meet again.

---

## Plugin commands

| Command | When to call it |
| --- | --- |
| **Reach Node** | At the point in your events where the player arrives there. |
| **Reach Ending** | When the player hits an ending. Generates and stores that ending's emblem. |
| **Open Chart** | Opens the flowchart. Put it on your menu, an item, or a save point. |
| **Open Gallery** | Opens the endings collected. |
| **Set Jump Point** | **Just before a decision.** Stores the snapshot the chart jumps back to. |
| **Reset Path** | Clears the current run's path for New Game+. Endings and reached nodes are kept. |

Calling **Reach Node** twice for the same node the player is already standing on does
nothing — events fire more than once in real projects, and that is not an error.

**In RPG Maker MV** each command is a Plugin Command line:

```
Threads reachNode id=ch2_gate
Threads reachEnding id=e_severed
Threads openChart
Threads openGallery
Threads setJumpPoint id=ch2_gate
Threads resetPath
```

A misspelt command name is reported in the console.

### Branch jump, and the one thing to remember

The chart can only return a player to a decision **if you stored a snapshot there**. Call
**Set Jump Point** immediately before the choice, with the same id as the decision node.
Decisions with a snapshot show an open lock on the chart; those without simply cannot be
returned to.

Snapshots use save slots starting at **900** by default, deliberately far above the
player's own files. Change **Jump Save Slot Base** if that clashes with something.

**A jump returns the player to the decision and keeps what they have learned.** The game state
(switches, variables, position) is the snapshot's; the endings collected and the nodes reached since
it stay collected and reached, the same rule as **Reset Path**. (1.0 restored the whole chart from
the snapshot, so an ending earned after a jump point disappeared from the gallery on the jump back.)

---

## Script calls

Use these in a Conditional Branch's script field:

```js
CSAF.Threads.hasReached('ch2_gate')   // boolean
CSAF.Threads.hasEnding('e_severed')   // boolean
CSAF.Threads.endingCount()            // how many collected
CSAF.Threads.endingTotal()            // how many declared
CSAF.Threads.currentPath()            // array of node ids, in order
```

The usual reason to want these is gating a true ending on having collected the others:

```js
CSAF.Threads.endingCount() >= 4
```

---

## The emblems

Every ending you declare generates its own mark, and the mark is **computed, not chosen**:

- **Family** comes from the ending's declared **Tone**, so you keep authorial control of
  what an ending *feels* like. Leave Tone blank and it is derived from the route instead.
- **The motif** is picked within that family by the route — tone fixes the language, the
  route picks the word.
- **The binding ring** encodes the *journey*: how long it was and how much it branched.
  This is why two players reaching one ending can get different marks.
- **The orbital marks** are one per decision taken on the route, in order. The emblem
  literally counts the choices.
- **The palette** is derived from the route as well.

It is fully deterministic. The same route always produces the same emblem — no
`Math.random()` is called anywhere in a visual decision, so a player can recognise their
own ending and two players comparing screenshots are looking at the same thing.

The corpus is **48 motifs in six families of eight**: `severance`, `union`, `ascent`,
`descent`, `ret` (return), `stasis`. Each family is a visual language, not a label — the
marks in one share stroke behaviour, symmetry and weight.

### Adding your own motifs

`ThreadsMotifs.js` is data, not behaviour. A motif is authored in a unit box (`-1..1`,
negative Y upward) as a list of subpaths:

```js
{
  id: 'blade',
  name: 'Blade',
  paths: [
    { mode: 'stroke', w: 1.0, d: [['M', -0.08, -0.92], ['Q', 0.34, -0.10, 0.16, 0.62]] }
  ]
}
```

Append an entry to a family array and Threads picks it up with no other change.
Ops are `M` `L` `Q` `C` `A` `Z`; `w` multiplies the base stroke width.

---

## Compatibility

Threads patches by **prototype extension with saved originals** and never replaces a core
method. It adds **one non-enumerable property** to `$gameSystem`, so it is invisible to
`JsonEx` — including `JsonEx.makeDeepCopy`, which other plugins call freely.

It does not touch the map, the battle system, the message window or the default menu.
It runs in RPG Maker **MZ**, and in **MV 1.6** with `CSAF_MVBridge.js` at the top of the Plugin
Manager; every command, parameter and script call in this guide was run on both engines from the
shipped download.
**Adding it to a finished project cannot change how that project plays.**

Save data is versioned and migrates forward. A save made before Threads was installed loads
normally and simply starts with an empty chart.

---

## Touch and screen size

The whole chart is laid out on one screen, so there is nothing to drag or zoom. **Tap a node** to
select it and **tap it again** to jump (or confirm the jump); a cancel touch (right click, or a
two-finger tap) is Cancel. In the gallery, tap a plate to select it and tap off the plates to close.

Both scenes read your project's resolution when they open, landscape or portrait, and the type
scales with the short side of the screen, so a 1080 x 1920 portrait game gets the same layout at
readable size. When columns stand close together, alternate columns print their labels above the
node. Measured at 816 x 624, 1280 x 720 and 1080 x 1920 on both engines.

---

## Colours

Set **Accent**, **Ink** and **Ground** in the Plugin Manager as `#rrggbb`. The emblem
palettes are a fixed set of eight designed to sit against a dark ground; the chart, the
panels and the typography follow your three colours.

Both scenes are drawn from scratch into Bitmaps. There is no windowskin, no stock frame, no
stock cursor and no engine font anywhere in either screen, and nothing is loaded from
`img/`.

---

## Support

Questions, bugs and feature requests: reply on the store page.

---

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
