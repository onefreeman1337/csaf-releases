# Cogwheel: Push Blocks and Light Beams for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Cogwheel: Push Blocks and Light Beams for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/cogwheel  
**Docs published:** 2026-11-05


---

# Cogwheel — Dungeon Objects, Light Beams & Push Puzzles

**For RPG Maker MZ.** Build Zelda-style dungeon rooms out of pushable blocks, mirrors, light beams,
pressure plates and hazards — authored with notetags and regions instead of eventing every block by
hand. Every shove is previewed before you commit, on the map and in words — and since v1.1.0 the
dungeon **draws itself**: 46 procedural marks, blocks in six materials, and a Blueprint Lens that
redraws the whole room as the machine reads it. No image files anywhere in the product.

---

## The problem this removes

A single pushable block, done properly with events, is a page of eventing: check the tile ahead,
check what is on it, check the terrain, move the event, update a self-switch, handle the case where
it lands on a hole, handle the case where the player pushes it into a corner and the room becomes
unsolvable. Then you copy that page for every block in the dungeon, and when you change the rule you
change it everywhere.

**Cogwheel makes the object a property of the event, not a program inside it.** You put
`<cog:block>` in an event's note box and it is a block, with the whole interaction matrix behind it.

---

## What ships

Four plugins of raw, readable JavaScript with full JSDoc. **No minification** — you can read,
debug and extend every line. **No image files** — every piece of art in the product is a drawing
routine.

| File | What it is |
| --- | --- |
| `CogwheelCore.js` | The rules engine: the interaction matrix, the beam tracer, the save schema. Pure logic, no engine dependency. |
| `CogwheelAtlas.js` | The artwork, as code: 46 procedural marks — bodies, aftermath faces, lens terrain and icons — in one visual language, rendered at your tile size. |
| `CogwheelMap.js` | The RPG Maker bridge: notetags, regions, events, movement, persistence. |
| `CogwheelInspector.js` | The visible layer: atlas-drawn bodies, the Blueprint Lens, the schematic wiring, the additive beam, the push readout. |

Plus four worked rooms, drawn out tile by tile near the end of this guide with the shortest solution
to each. They are plans to build, not map files: there is no sample project in the download.

---

## Installation

1. Copy the contents of `js/plugins/` into your project's `js/plugins/` folder.
2. In the Plugin Manager, add them **in this order**:
   1. `CogwheelCore` — the rules engine (required)
   2. `CogwheelAtlas` — the drawn artwork (required by the inspector)
   3. `CogwheelMap` — the RPG Maker bridge (required)
   4. `CogwheelInspector` — the bodies, lens, overlay and readout (optional, but it is most of the look)
3. Set the three region ids (`holeRegion`, `iceRegion`, `waterRegion`) to region numbers you are not
   already using. The defaults are 1, 2 and 3. Set one to 0 to turn that terrain off; a blank box reads
   as the default.
4. Press Play.

---

## Building a room in two steps

### 1. Paint the terrain with regions

Use the region tool for the floor you want to behave differently:

* **hole region** — things fall in. A block pushed in **fills it permanently** and becomes a floor.
* **ice region** — things slide until the ice ends. They stop where the ice stops, not where you
  wanted them to.
* **water region** — things sink, and become a crossing.

Walls need no region at all: Cogwheel asks the tileset the same passability question the engine
asks, so a wall you already drew is already a wall.

### 2. Put a notetag on an event

| Notetag | What the event becomes |
| --- | --- |
| `<cog:block>` | A pushable block. Moves one tile per push. |
| `<cog:boulder>` | Rolls until something stops it, and **shatters** against a wall. |
| `<cog:mirror />` | A mirror facing `/`. Pushable like a block. |
| `<cog:mirror \>` | A mirror facing `\`. |
| `<cog:plate>` | A pressure plate. Flush with the floor. A block or boulder on it presses it. You can stand on it too, but that does not press it. |
| `<cog:receiver>` | Lit when a beam reaches it. |
| `<cog:emitter 2>` | Emits a beam. `2` down, `4` left, `6` right, `8` up. |

**Leave the event's graphic BLANK and Cogwheel draws the object from the atlas.** Give it a
graphic and yours is respected — the atlas never overrides your art.

Blocks and boulders take a **material** word, which changes the drawn body *and* the face it
leaves behind when it is spent — a timber block bridges a hole as planks, a gilded one as an
inlaid deck:

```
<cog:block wood>           stone (default), wood, ice, iron, gild, rune
<cog:boulder amber>        granite (default), amber, obsidian
```

Wire them to your game with switches:

```
<cog:plate switch=5>       switch 5 is ON while the plate is pressed
<cog:receiver switch=6>    switch 6 is ON while the receiver is lit
```

Give each plate and receiver its own switch. Two on one switch overwrite each other, and the last one
read wins, so a lit receiver can read as off.

That is the whole authoring surface. Everything else — what happens when a boulder rolls onto ice
toward a hole with a plate under it — is the matrix's problem, not yours.

---

## The two plugin commands

| Command | What it does |
| --- | --- |
| **Reset Room** | Restores the room to its authored state and un-fills every bridge. A player the reset would strand, on a hole it re-opened or where a block came home, goes to the room's entrance, or to the nearest safe tile if no entrance was set. |
| **Set Room Entrance** | Marks the player's current tile as where Reset Room returns them. It is kept in the save. |

---

## What the player sees

* **Atlas-drawn objects.** Blocks in six materials, boulders in three, mirrors with silvered
  faces, plates that sink and light, receivers whose iris floods open — drawn by the plugin, at
  your tile size, animated by MZ's own movement. A spent block is redrawn as the bridge, ford or
  shards it became.
* **A push preview.** Face an object and the readout names what the shove will do — *moves*,
  *slides N tiles*, *falls and bridges*, *sinks*, *shatters*, *blocked* — with the reason
  underneath **and the outcome's own drawn icon**. It is computed by running the **real** resolver
  and restoring the state, so the preview and the push can never disagree.
* **The Blueprint Lens.** Press the toggle (TAB by default) and the whole room is redrawn as
  Cogwheel's own instrument: surveyed floor, hatched matter, open pits with depth rings, water and
  faceted sheet ice as drafting marks, you as a surveyor's reticle, foreign events as mechanism
  cogs. The puzzle exactly as the machine reads it — and a room readability tool your players will
  keep on. (On maps past ~2,400 cells the lens politely declines rather than building a hundred
  thousand sprites.)
* **A light beam** drawn additively with a bloom at the emitter and a flooded iris at the receiver
  — a PIXI layer, not a windowskin. Cogwheel draws **no RPG Maker windows at all**.

---

## Compatibility — read this before you buy

* ⚠️ **Cogwheel is grid-native.** It resolves pushes in whole tiles against the tile grid. It is
  **not compatible with pixel-movement plugins or action-battle systems** that move the player off
  the tile grid. This is stated up front rather than discovered later.
* **No core method is replaced.** Every engine method Cogwheel extends saves the original and calls
  it, so other plugins touching the same methods keep working. That is enforced by a test that reads
  the shipped source against the real MZ source.
* **Saves are lossless and versioned.** A room stores a small mutation record, and everything else —
  beams, links, bridge state — is recomputed on load. The live runtime object is never serialised.
* **Nothing is allocated in the per-frame path**, enforced by a static scan that is itself proven to
  fire against a deliberately sabotaged copy.

### Not in this version

Stated plainly so nothing here is a surprise:

* **Cranks** and **lift / carry / throw** are not implemented. The kit is push-based.

---

## Verification

* **221/221 checks green** across five suites — the interaction matrix cell by cell, the atlas
  (46 marks proven distinct, deterministic and non-trivial), the notetag parser, the
  zero-allocation scan, and the patch-discipline guard.
* **In-engine verified**, not just unit-tested: 47/47 checks in a real running MZ engine — the
  bodies tracking their events to the pixel, the lens building one cell per tile, zero RPG Maker
  windowskins in every view — with 0 page errors.
* **All four worked rooms, in the next section, proven solvable by exhaustive search**, with room
  reset proven to recover every reachable dead-end state.
* **A fresh install, from the same zip you download**: a blank MZ project, the plugins in the order
  above, every room built from this guide and every solution played through the engine's own movement.
* **Frame cost measured in the real engine**, on the room with the most drawn objects, 600 frames, three
  runs: 15 draw calls per frame against a ceiling of 60, and **zero** texture uploads, bitmap redraws
  or window refreshes. The plugin's own update stayed inside its 2 ms budget. That figure is given as a
  budget because timing on the test machine is too noisy to quote to two places.
* **Run headless in a browser, not in the desktop editor's Playtest window**, and on its own in a blank
  project, not alongside other plugins.

---

## Four worked rooms

These are the rooms the exhaustive search ran on, so you can build them and see the whole product working before you design your own. There are no map files to import: each one takes a few minutes in the editor.

Make a 17 x 13 map on the stock Dungeon tileset and fill it with a wall tile. Draw the plan anywhere on it, then paint the regions and add one event per mark. Leave every event's graphic blank and its priority alone. Positions count from the plan's top left corner, which is 0,0.

| Mark | What to place |
| --- | --- |
| `#` | A wall: any tile the player cannot walk onto. |
| `.` | Any floor tile. |
| `@` | Floor. Start the player here. |
| `O` | Floor painted with the hole region. |
| `I` | Floor painted with the ice region. |
| `~` | Floor painted with the water region. |
| `E` | An event on floor, with the note `<cog:emitter 2>` |
| `X` | An event on floor, with the note `<cog:receiver switch=1>` |
| `P` | An event on floor, with the note `<cog:plate switch=2>` |
| `\` | An event on floor, with the note `<cog:mirror \>` |
| `B` | An event on floor, with the note `<cog:block>` |
| `W` | An event on floor, with the note `<cog:block wood>` |
| `N` | An event on floor, with the note `<cog:block iron>` |
| `G` | An event on floor, with the note `<cog:block gild>` |
| `U` | An event on floor, with the note `<cog:block rune>` |
| `A` | An event on floor, with the note `<cog:boulder amber>` |

A room is solved when the beam reaches the receiver: switch 1 turns on.

### First Light

One push, and nothing else in the room matters. Start here.

```text
#########
#E......#
#.......#
#.\....X#
#.......#
#......@#
#########
```

Shortest solution, 1 push:

1. Mirror at 2,3: left

### The Bridge

A hole sits between the mirror and the beam. Walking the mirror round it takes six pushes; spending the block to fill the hole and pushing the mirror straight across takes seven. Push the mirror into the hole and the room is lost, which is what Reset Room is for.

```text
##########
#E.......#
#........#
#..B.....#
#........#
#.O..\..X#
#.......@#
##########
```

Shortest solution, 6 pushes:

1. Mirror at 5,5: left
2. Mirror at 4,5: left
3. Mirror at 3,5: up
4. Mirror at 3,4: left
5. Mirror at 2,4: left
6. Mirror at 1,4: down

### Glass Floor

One shove sends the mirror the whole length of the ice. The puzzle is choosing the shove.

```text
#########
#E......#
#.......#
#.IIII\X#
#.......#
#......@#
#########
```

Shortest solution, 1 push:

1. Mirror at 6,3: left

### The Foundry

Everything the atlas draws on one floor. The mirror still wins it. The iron block is a separate job: it is two pushes right from the plate, and the plate drives switch 2. The wood block sinks in the water and leaves a plank ford. The amber boulder rolls and shatters.

```text
###############
#E............#
#.......A.....#
#.~~~~........#
#..#W#........#
#.......#.....#
#...N.P#..#...#
#...###..#G#..#
#..#..@...#U#.#
#..\.........X#
###############
```

Shortest solution, 2 pushes:

1. Mirror at 3,9: left
2. Mirror at 2,9: left

---
## Support

Questions, bugs and compatibility reports are welcome on the itch.io project page.

*Cogwheel is made by CSAF — Core Systems Asset Factory.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
