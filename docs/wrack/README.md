# Wrack - Burned, Ruined, Overgrown and Abandoned Towns From Your Own Tileset (RPG Maker MZ) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Wrack - Burned, Ruined, Overgrown and Abandoned Towns From Your Own Tileset (RPG Maker MZ)  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/wrack  
**Docs published:** 2026-11-05


---

# Wrack — Burned, Ruined, Overgrown and Abandoned Towns From Your Own Tileset

**For RPG Maker MZ.** Version 1.0.0 · Core Systems Asset Factory

Every story with a war, a dragon or a time skip needs the same town twice: before and after. Wrack
makes the after from the before. When a map loads, it reads the tileset images your project already
uses and derives four states from those pixels. Then it switches the whole map, a region, or a single
building into one of them, and can play the change on screen.

Your map file is never touched. Events, cutscenes and passability stay exactly as you made them.
No image files ship with Wrack, and nothing is drawn by hand: every changed tile is made from your own art.

---

## The four states

| State | What happens to your town |
| --- | --- |
| `burned` | Each roof keeps its own tiles, thatch or slate, blackened by the fire, with ragged holes burnt through it, their rims still glowing and the charred beams standing inside, and ash lying in drifts across the roofs and the ground with embers still glowing in it. Soot climbs the walls. Window panes go dark with the fire still glowing low inside. The ground burns black, and trees burn back to bare, forked branches. Smoke columns rise from the burned roofs and embers drift. |
| `ruined` | Roofs fall in: a dark void down into the house, grey weathered rafters still standing where they have not come down, heaps of the fallen roof inside, the house's own roof colour left in a torn frame, and rubble cut from the building's own wall stone heaped against the walls. Walls break down to jagged courses and crack. Boards are stove in, windows are smashed to jagged shards, lamps go dark, and the grass dries out in straw-coloured patches. |
| `overgrown` | Ivy climbs every wall face from the ground. Moss fills the roof grooves and saplings root in the roofs. Grass creeps over paths and paving in drifts, and lily pads cover the water. Everything green is painted in your tileset's own greens. |
| `abandoned` | Colour fades under dust. Roof tiles slip, and windows are boarded up. Damp stains run down the walls, weeds grow at every door, grit settles on paths and paving, the lawns brown in patches, and lamps go cold. |

Winter and snow are not a state.

---

## Install

1. Copy **both** files from `js/plugins/` into your project's `js/plugins/` folder:
   - `WrackCore.js`
   - `Wrack.js`
2. In the Plugin Manager, add them **in this order** and turn both ON:
   1. `WrackCore.js`
   2. `Wrack.js`
3. Put a map into a state with a notetag or a plugin command (below).

> Nothing breaks if the two are listed the other way round: `Wrack.js` looks for `WrackCore.js` the
> first time it needs it, not when it loads.

---

## Map notetags

Write these in **Map Properties → Note**:

| Notetag | Effect |
| --- | --- |
| `<Wrack: burned>` | The whole map starts in that state. |
| `<Wrack region 5: ruined>` | Every cell painted with region 5 starts in that state. Repeat the tag for more regions. |
| `<Wrack preload: overgrown>` | Derive this state while the map loads too, so a later switch to it is instant. Separate several with commas. |

The state names are `burned`, `ruined`, `overgrown` and `abandoned`.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Set State** | Target `map`, `region` (a region id) or `rect` (x, y, width, height in tiles). State: one of the four, or `none` to restore that target. Transition: `none`, `fire`, `years` or `fade`, with a duration in frames. With **Wait for completion** on, the event pauses until the change has finished playing. |
| **Restore the map** | Removes everything Set State wrote on this map. |
| **Preload States** | Derive states now, for example during a fade, so a later Set State is instant. |

The transitions:

- `fire`: a burning line sweeps across the map from left to right, wandering across tile borders, with
  flames standing on it, a glowing edge behind it and the ground browning just ahead of it; the
  burned state is left smoking behind it. Water never burns: a pond changes once the fire has passed
  all of it, and no flame stands on it.
- `years`: the change creeps in through ragged patches that grow across tile borders, edged in
  pixel steps, until the whole target has changed.
- `fade`: the whole change cross-fades at once.

Only the cells that change take part in a transition: everything else on the map stays live, water
still moving, while the change plays.

To show your own "TEN YEARS LATER" card, use Show Picture or Show Text around the command.

What you set is **saved with the game**, separately for each map.

**Order of priority, lowest first:** map notetags, then switch bindings whose switch is ON, then what
Set State commands wrote. Within each of those, a rectangle wins over a region, and a region wins
over the whole map.

---

## Parameters

| Parameter | Default | Meaning |
| --- | --- | --- |
| Variants per state | 3 | How many differently-marked copies of each changed tile Wrack makes. Each map cell picks one, so holes, cracks and vines do not repeat on every tile. Use 1 to save memory. |
| Seed | 0 | Change it for a different (still repeatable) set of holes, cracks and vines. |
| Smoke over burned roofs | ON | Smoke columns rise from some burned roof cells. |
| Drifting embers | ON | Sparks drift up from the burned roofs. |
| Smoke density | 0.18 | The share of burned roof cells that send up smoke (0 to 1). |
| Switch bindings | none | A list of (switch, map, target, state) rows. While a switch is ON, its target is in that state. Map 0 means every map. |

---

## Script calls

```js
Wrack.set('map', 'burned');
Wrack.set('region', 'ruined', { regionId: 5, transition: 'years', duration: 180 });
Wrack.set('rect', 'burned', { x: 4, y: 3, width: 5, height: 4 });
Wrack.set('map', 'none');           // restore the whole map
Wrack.clear();                      // remove everything set on this map
Wrack.stateAt(x, y);                // 'burned' | 'ruined' | 'overgrown' | 'abandoned' | null
Wrack.isBusy();                     // true while deriving or mid-transition
```

---

## How Wrack reads your tileset

Wrack never guesses what a sheet is for, because MZ already declares it:

| Sheet | Read as |
| --- | --- |
| A1 | water |
| A2 | ground: grass, earth or paving, judged by each block's own colours |
| A3, rows 1 and 3 | building roofs |
| A3, rows 2 and 4 | building walls |
| A4 | wall tops and wall faces |
| A5 | floor tiles, judged like ground |
| B to E | objects: each 48×48 cell is judged by its own pixels as foliage, glass, wood, stone, a small scatter (three or more separate pieces, such as a flower clump), or other |

Two rules make the result tile cleanly:

- **Autotiles stay seamless.** Every mark Wrack draws on an A1 to A4 sheet stays inside one quarter
  tile (24×24), with a margin. Every colour change is made pixel by pixel. So however MZ assembles
  quarters into a tile, they meet as they did before.
- **No repeating pattern on every tile.** Each changed tile is made in several variants (3 by
  default). Each map cell picks a variant by its position, so a big roof or field does not stamp the
  same hole or tuft on every tile. Drifts of ash, straw, dust and creeping grass are not in the tiles
  at all: they are painted across the map itself, between the ground and the objects standing on it,
  so they cross tile borders and never line up on the tile grid. Each ground cell is read as grass,
  earth or paving from its own tile, so straw lands on lawns and grit on cobbles.

Green growth, rubble and planks are painted in colours taken from your own tileset: its greens, its
stones and its woods. Char, ash, embers and smoke use their own colours.

---

## Good to know

- **Deriving takes a moment each time a map that uses a state loads** (Wrack keeps nothing between
  maps, so memory is freed when you leave). A map that starts in a state waits for it behind the
  fade-in, so it never flashes the intact town. A state first used in the middle of a scene
  causes a short stall unless you preload it (with the notetag or the command).
- **Memory.** Each state keeps one changed copy of each tileset image per variant. With 3 variants
  that is three copies per state; set Variants to 1 or 2 on very large tilesets.
- **The derived tiles use texture slots MZ already has.** MZ's tile renderer keeps room for twelve
  tileset images and uses nine. Wrack packs the changed tiles a map needs into the three spare slots.
  If a single map needs more changed tiles than fit, Wrack first uses fewer variants on that map.
  If they still don't fit, it leaves the overflow intact and says so in the browser console. It never
  draws a wrong tile.
- **Water and waterfalls keep animating** in every state.
- **Rubble does not block movement.** Passability is exactly what you set in the editor.
- **A tileset served from another website without CORS** cannot be read by any plugin. Wrack leaves
  it intact and says so in the console.
- **Tile size** must be even. MZ assembles autotiles from half-tiles; 48×48 is the default.

### What Wrack changes in the engine

Every change wraps the original method and calls it. Nothing is replaced.

- `Tilemap.prototype._addSpot` and `Tilemap.CombinedLayer.prototype.addRect`: while a cell that is
  in a state is drawn, each tile rect is redirected to the changed copy in a spare texture slot.
  Cells that are not in a state draw exactly as before.
- `Tilemap.prototype._addAllSpots`, `Tilemap.prototype._addSpotTile` and
  `Tilemap.prototype.updateTransform`: on a map Wrack runs on,
  the objects on tile layers 3 and 4 (barrels, fences, crates) are drawn on a layer of their own
  just above the ground, so Wrack's changes can lie between the ground and the objects. Measured
  in the engine: the picture is pixel for pixel the same with this on and off.
- `Spriteset_Map.prototype.loadTileset`, `update` and `destroy`: attach, run and remove Wrack's
  layer for the map.
- `Scene_Map.prototype.isReady`: wait for a starting state to be derived.
- `Game_Switches.prototype.onChange`: re-read switch bindings.
- `Game_Interpreter.prototype.updateWaitMode`: the **Wait for completion** option.

Its record is saved in `$gameSystem._wrack`, with a schema version.

---

## AI disclosure

The code was written with AI assistance. Wrack's output is graphics, derived from your own tileset
by that code. No sounds and no authored narrative text ship with it.

## Licence

See `LICENSE.txt`. In short: use it in as many games as you like, commercial or free, with no
royalties. Do not resell or redistribute the plugin files.

Core Systems Asset Factory · https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
