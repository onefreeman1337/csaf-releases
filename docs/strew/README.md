# Strew - Automatic Map Dressing for RPG Maker MZ (flower drifts, rocks, floor variants) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Strew - Automatic Map Dressing for RPG Maker MZ (flower drifts, rocks, floor variants)  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/strew  
**Docs published:** 2026-11-05


---

# Strew for RPG Maker MZ

Strew dresses the maps you made by hand, from your own tileset, in one keypress. Flowers gather in
drifts, one kind of flower to a drift. Bushes, rocks and stumps settle against trees, walls and
water. Repeated floor tiles are broken up by their own variants. Nothing lands on a path, on or
beside an event, on a region you keep clear, or on a square that already has an upper tile, and a
blocking tile is only placed where Strew has proved the squares around it stay connected.

Every pass is seeded: the same seed gives the same map every time, a new seed gives a new
arrangement, and undo removes exactly what Strew placed.

## What you get

- `js/plugins/StrewCore.js`: the dressing engine (no commands, no parameters).
- `js/plugins/Strew.js`: the part you use: playtest bake, reroll and undo, Live mode, the result
  card and the plan view.
- This guide and `LICENSE.txt`.

## Installing

1. Copy both files into your project's `js/plugins/` folder.
2. In the Plugin Manager, add `StrewCore.js`, then `Strew.js` below it, and turn both ON.
3. Playtest any outdoor map and press **F7**.

Strew finds its core when it is first used, so a different order still works, but the order above
is the one the Plugin Manager's dependency warning expects.

## Two ways to use it

### Bake (playtest)

Walk onto a map in playtest and press **F7**. The map is dressed on screen and written to
`data/MapXXX.json`. The file it replaced is kept in `data/Strew/` (the last five per map), next to
a small record of exactly what was placed.

- **F7 again** rerolls: the previous bake is taken back and the map is dressed fresh with a new seed.
  Bakes never stack.
- **Shift+F7** undoes the last bake. Only tiles Strew placed are removed. A tile you painted over a
  Strew tile after the bake is kept.
- **F6** shows or hides the plan view (below).

**Important, because the editor keeps its own copy of an open map:** save in the editor before you
bake, and after baking reopen the project (File > Open Project) before you edit that map again.
Otherwise the editor saves its older copy over the bake.

Bake and undo need the desktop playtest (they write files). They do nothing in a deployed or web
game.

### Live

Put `<Strew Live>` in a map's note, or turn on **Live on every map**. The map is dressed in memory
each time it loads, with the same seed every time, and no file is written. Live mode works in
deployed desktop and web games. Save files are unaffected in either mode: Strew changes map data,
which RPG Maker never stores in a save.

## Where things go

- **Flowers** gather in drifts. A slow field decides where drifts are and which flower each drift
  is, so a patch reads as one flower. Flowered grass fills (if your tileset has them) appear only
  around the drifts.
- **Tufts** thicken where open ground meets something that blocks it, and along the edge where one
  ground meets another.
- **Bushes** stand against trees, walls and water, away from paths.
- **Rocks** sit against what blocks, most often in corners.
- **Pebbles** and cracks gather in corners, along ground edges and on open earth.
- **Wood** (stumps, logs, dead branches) is rare, and more likely beside trees.
- **Floor variants**: inside a field of one repeated floor tile, some squares take a variant of
  that tile, chosen so neighbours do not repeat.

Never: on a path (a long, narrow run of walkable non-grass ground such as a road; a square plaza is
not a path), on or directly beside an event, on a kept-clear region, on a square that already holds
an upper-layer tile, or on a square you cannot walk on.

## What Strew places, and how it knows

- On RPG Maker MZ's stock **Outside** sheet, Strew uses a palette picked by hand (bushes, a rock
  pile, stumps, logs, dead branches, cracks, stones, tufts and six kinds of flower), so it never
  scatters barrels, signposts, pots or snowmen. The stock **Inside**, **Dungeon**, **SF** and
  **World** sheets get no scatter (their small objects are furniture, props and landmarks you place
  yourself); floor variants still apply.
- On any other sheet, Strew reads the art: small objects that sit inside their square, sorted by
  colour into flowers, tufts, bushes, rocks, pebbles and wood; and opaque floor tiles that match
  each other in every quadrant, edge and corner become variant groups.

Press **F6** to see the reading: the plan view lists every tile Strew will place, by kind, with its
tile ID. If it has misread something, correct it with a tileset note:

| Tileset note | Effect |
| --- | --- |
| `<Strew Flower: 101,102>` | these tile IDs are flowers (likewise `Tuft`, `Bush`, `Pebble`, `Rock`, `Wood`) |
| `<Strew Exclude: 140,141>` | never place these tiles |
| `<Strew Variants: 1,2,3>` | these floor tiles are interchangeable (replaces the read groups) |

Tile IDs: B sheet 0 to 255, C 256 to 511, D 512 to 767, E 768 to 1023, A5 1536 to 1663. The plan
view prints each one under its tile.

Passage settings come from your tileset as you set them in the Database: a tile you marked
impassable blocks, a tile you marked passable or star does not.

## Map notes

| Map note | Effect |
| --- | --- |
| `<Strew Live>` | dress this map as it loads |
| `<Strew Off>` | never dress this map (bake refuses too) |
| `<Strew Seed: 1234>` | the seed Live mode uses on this map |
| `<Strew Density: 1.4>` | this map's density, multiplied by the parameter |
| `<Strew Mask: 3,4>` | extra kept-clear region IDs for this map |
| `<Strew Skip: flower>` | kinds to leave out on this map |

## Plugin parameters

| Parameter | Default | Effect |
| --- | --- | --- |
| Density | 1.00 | multiplies every scatter rate (0 to 3) |
| Keep-clear regions | (empty) | region IDs Strew never dresses, comma separated; their floor is kept too |
| Leave out | (empty) | kinds to leave out: flower, tuft, bush, pebble, rock, wood, variants |
| Live on every map | No | dress every map as it loads |
| Playtest hotkeys | On | F7 bake or reroll, Shift+F7 undo, F6 plan (playtest only) |
| Show the result card | On | after a bake or undo, show what was placed and the seed |

## Plugin commands

| Command | Effect |
| --- | --- |
| Bake this map (playtest) | dress and write the current map; seed 0 picks a new seed |
| Undo the last bake (playtest) | remove what the last bake placed and write the map back |
| Dress this map now (memory only) | dress the current map in memory; seed 0 uses the map's own seed |
| Show or hide the plan | show or hide the plan view |

## Script calls

`Strew.bake(seed)`, `Strew.undo()`, `Strew.live(seed)` and `Strew.setPlan(true)` do what the
commands do. `Strew.lastResult()` returns the last result, with its counts and seed.

## The result card and the plan view

After a bake the card shows what was placed, by kind, with a swatch of a tile from each kind, the
number of floor variants and the seed. It fades after about five seconds.

The plan view (F6) shades every path, hatches every square kept clear for an event, tints
kept-clear regions, washes the flower drift field and marks each placement with a dot coloured by
kind, under a legend and the palette panel described above.

## Compatibility

Strew extends two engine methods by saved-original prototype extension and replaces none:
`Scene_Map.prototype.isReady` (Live mode dresses the map before it is first drawn) and
`Scene_Map.prototype.start` (keeps the plan view showing across map changes). It changes only map
tile data, so plugins that read the map (minimaps, lighting, pathfinding) see the dressed map like
any other.

## Frame cost

Strew does its work once, when you bake or when a Live map loads. During play the dressed tiles are
drawn by the engine's own tilemap like any tile you placed. Measured in the engine on the gate
scenario (a Live-dressed map with the party walking, the result card up and the plan view showing):
**11** draw calls a frame, 0 texture uploads, 0 bitmap rewrites and no growth in display objects.

## Terms

See `LICENSE.txt`. Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
