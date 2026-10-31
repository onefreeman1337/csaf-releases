# Verdant GBC: Route, Cave and Town in Game Boy Color, Four Seasons by Palette Swap, GB Studio Color Mode and RPG Maker MZ Ready [16x16] — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Verdant GBC: Route, Cave and Town in Game Boy Color, Four Seasons by Palette Swap, GB Studio Color Mode and RPG Maker MZ Ready [16x16]  
**Engine:** PixelLab API (REST, from Node) — grid-aligned tile sheets + autotiles  
**Docs published:** 2026-10-31


---

# Verdant GBC: Route, Cave and Town Tileset [16x16]

**Verdant GBC: Route, Cave and Town Tileset** is a 16x16 Game Boy Color tileset volume for GB Studio colour mode, Tiled, Godot 4, RPG Maker MZ and Unity: the Route, the Cave, the Town and the Interiors in one download, in four seasons (spring, summer, autumn, winter) that differ by palette and nothing else. It holds **794 tiles at 16x16**: 12 complete 47-mask sets (autotiles), 85 distinct objects, 3 animated waterfall pieces and 7 sample scenes, each sample scene already a GB Studio background in all four seasons. Commercial use is allowed in unlimited projects, including Game Boy Color ROMs, with no royalty and no attribution required; you may not resell the pack itself. The wider Verdant series has a free sampler: the Verdant 00 Series Sampler (https://csaf.itch.io/verdant-00-sample).

## What is in it

| what | how many |
| --- | --- |
| **Fills** | 52 |
| Autotile transition tiles | 564 (12 sets x 47) |
| Object tiles | 166 files (85 objects, transparent overlays; a large object is cut into 16x16 cells) |
| Animation frames | 12 (3 waterfall pieces x 4 frames at 150 ms) |
| **Total** | **794**, in each of the 4 seasons |

Of the 794 tiles, **71%** are transitions: the 47 shapes of every set, so any shape you paint has its edge.

### By environment

| environment | fills | transition tiles (sets) | objects | tiles |
| --- | --- | --- | --- | --- |
| The Route | 16 | 188 (4) | 19 | 246 |
| The Cave | 11 | 94 (2) | 24 | 137 |
| The Town | 15 | 188 (4) | 20 | 278 |
| The Interiors | 10 | 94 (2) | 22 | 133 |

### The autotile sets

12 complete sets, every one of the 47 shapes present in each. `X_on_Y` means X is drawn inside, with the ground Y around it.

| set | environment | what it draws |
| --- | --- | --- |
| `route_path_on_grass` | The Route | dirt path on grass |
| `route_water_on_grass` | The Route | pond water on grass, with a foam line |
| `route_tall_on_grass` | The Route | tall grass on short grass |
| `route_hill_on_grass` | The Route | raised hilltop with an earth face, on grass |
| `cave_wall_on_floor` | The Cave | cave wall with a rock face, on the floor |
| `cave_pool_on_floor` | The Cave | underground pool with a lit edge, in the floor |
| `town_paving_on_grass` | The Town | cobbled square on the town lawn |
| `town_road_on_paving` | The Town | carriage road with a kerb, on the cobbled square |
| `town_hedge_on_grass` | The Town | clipped hedge with a face, on the lawn |
| `town_flowerbed_on_grass` | The Town | flowerbed with an edging, on the lawn |
| `interior_wall_on_floor` | The Interiors | interior wall with a papered face, on the boards |
| `interior_rug_on_floor` | The Interiors | rug with a border, on the boards |

### The objects

- **The Route**: tree round (2x2), tree pine (1x2), bush, berry bush, flower patch, rock, boulder (2x2), sign, stump, fence ew, fence end, log (2x1), grave, ledge w, ledge m, ledge e, cave mouth (2x2), bridge ns, bridge ew.
- **The Cave**: rock, boulder, stalagmite, stairs down, stairs up, rail ns, rail ew, rail turn nw, rail turn ne, rail turn sw, rail turn se, ladder down, ladder up, mine cart, support (2x2), chest, chest open, plank bridge, crystal, crystal big (1x2), ore node, lamp (1x2), mushrooms, cave exit (2x2).
- **The Town**: house red (3x3), house blue (3x3), shop (4x3), hall (4x4), lamp (1x2), crate, barrel, bench, sign, mailbox, well, fountain (2x2), market stall (2x2), tree round (2x2), tree fruit (2x2), bush, flower pot, fence ew, fence end, gate.
- **The Interiors**: bed (1x2), clinic bed (1x2), table (2x1), chair, stool, bookshelf (1x2), cupboard (1x2), shop shelves (1x2), counter w, counter m, counter e, stove (1x2), plant, vase, chest, stairs down, stairs up, door mat, window, clock, picture, wall shelf.

## The four seasons

Every tile is painted in named colour roles, and a season is a table of colours for those roles. So the 3 other seasons are the same tiles in the same places, and nothing else changes: same ids, same sheet positions, same transparency. A test compares every shipped image of every season against its summer twin, 8x8 block by 8x8 block, and refuses a block that is anything but a colour swap.

The root of the download is **summer**. `seasons/spring/`, `seasons/autumn/` and `seasons/winter/` hold the same images at the same relative paths. To change season in any engine, replace the image file with the one from the season you want, keep its name, and your map stays as you painted it. All 4 seasons of the GB Studio backgrounds are in `importers/GBStudio/backgrounds/`, named `<scene>_<season>.png`.

## Built for the Game Boy Color

A GB Studio background in colour mode allows 4 colours in every 8x8 tile and 8 palettes in a scene, one of them shared with dialogue windows and menus. It also allows at most 192 unique 8x8 tiles in Monochrome and Color + Monochrome games (384 in Color Only). This pack is built to those limits, and the build refuses a tile that breaks them:

- Every 8x8 quarter of every tile uses 4 colours or fewer, from one of 7 palettes per environment. The 8th is left for your dialogue windows and menus.
- Every colour is 5 bits per channel, so every colour is one the hardware has.
- A whole 47 shape set is drawn from at most **13 distinct 8x8 tiles**, counted on every set by the build.

| sample scene | size | unique 8x8 tiles of 192 | palettes |
| --- | --- | --- | --- |
| The Route | 320x288 | 162 | 7 |
| The Cave | 320x288 | 121 | 7 |
| The Town: Street | 320x288 | 187 | 7 |
| The Town: Square | 320x288 | 144 | 6 |
| Interior: Home | 192x160 | 98 | 7 |
| Interior: Shop | 192x160 | 65 | 7 |
| Interior: Clinic | 192x160 | 76 | 7 |

The count treats only identical 8x8 blocks as one tile and gives no credit for flips, so it is an upper bound. The tile counts are the same in all 4 seasons.

### Keep the .mono.png beside the PNG

**Every background ships with a matching `.mono.png`. Import both, keep the names together, and use GB Studio 4.0.0 or later.** GB Studio's automatic colouring merges palettes greedily, in tile order, and on a busy scene that strands tiles: without the override, The Route and The Cave would need up to **9 palettes**, more than the hardware's 8 allow once a window needs one, and the extra ones silently wrap round onto other palettes' colours. With the `.mono.png`, GB Studio reads each pixel's palette slot from it instead, and every scene here needs **7 or fewer**.

GB Studio is not installed where this pack is built, so these scenes have not been opened in GB Studio. What was done instead: GB Studio's palette merge was re-implemented from its own source code (`autoColor.ts`, commit eb6aa8a), and every shipped background was run through it from the PNG on disk, in all 4 seasons, with colour correction off and at its default. Every pixel repaints to its own colour in both. `budget.json` beside the backgrounds holds the figures, scene by scene. Colour correction is a project setting and it is on by default: it treats each PNG colour as the colour wanted on screen, so the most saturated shades land a little off, because the correction cannot quite reach them. No palette loses a shade.

To build your own scenes, paint them in Tiled with the `.tsx` sets (autotiling works there), export the map as a PNG and keep every 8x8 block inside one palette. `importers/GBStudio/palettes/` lists all seven palettes per environment, slot by slot, per season, for the palette editor. A scene of your own has no `.mono.png` until you make one; GB Studio's changelog says that since 4.2.0, extracting a background's palettes generates a matching one.

## Using it in other engines

### Tiled

`importers/Tiled/` holds one `.tsx` tileset per sheet, the autotile sets as Wang sets. `sample_maps/` holds 7 `.tmx` maps (The Route, The Cave, The Town: Street, The Town: Square, Interior: Home, Interior: Shop, Interior: Clinic), each opened and rendered by Tiled 1.12.2's own tmxrasterizer and compared pixel for pixel against its PNG. The waterfall plays in Tiled: its renderer was advanced through the animation and compared frame by frame.

### Godot 4

`importers/Godot/` holds a `.tres` TileSet with one atlas per sheet. It was loaded in Godot 4.7.2, which was made to count the tiles it built against the ones declared. The waterfall frames arrive as separate tiles: this TileSet does not set up their animation, so use the frame order in `tiles.json` if you want it to move.

### RPG Maker MZ

`importers/RPGMakerMZ/` holds MZ tileset images at 48px (each 16px tile scaled x3, nearest neighbour): **A2** with the 12 sets as floor autotiles, and **B, C, D, E** with the grounds and objects. The A2 sheet composes correctly against MZ's own autotile table, read out of the engine's code. RPG Maker MZ itself is not installed where this pack is built, so it has not been painted with in the MZ editor. The waterfall frames are still stamps there, not an animated tile.

### Unity

Copy `importers/Unity/` anywhere under `Assets/`, then run **Tools > CSAF Verdant > Verdant GBC Route, Cave and Town Tileset [16x16] > Build Unity Assets** to build sprites, Tiles and RuleTiles in your project.

## How it was checked

Every tile's wrap boundary is measured against its own interior, and every 4x4 repetition is rendered and reviewed (`proof/repetition/`). Grid, palette and autotile completeness are machine-proven: every tile is exactly 16x16, every pixel in every season is inside the pack's locked colour list (`pack.json`), every set carries all 47 transitions, and every tile in `tiles.json` has a role. The wallpaper has a skirting board at its foot, so it repeats along a wall and not up one; `tiles.json` says so on those tiles.

## Files

```
  tiles/16x16/            every tile as its own PNG (summer)
  sheets/16x16/           the tiles packed into sheets by environment
  seasons/                the other three seasons, same paths
  importers/GBStudio/     backgrounds with their .mono.png, palettes, and budget.json
  importers/Tiled/        .tsx tilesets
  importers/Godot/        a .tres TileSet
  importers/RPGMakerMZ/   MZ tileset pages at 48px
  importers/Unity/        the Unity importer
  sample_maps/            the sample scenes as PNG (2x), JSON and .tmx
  proof/                  4x4 repetition renders
  preview/                the sample scenes at 1x
  tiles.json              every tile: role, environment, set, mask, passability
  pack.json               palette and counts
```

## Licence and AI disclosure

See `LICENSE.txt`. Made by Core Systems Asset Factory with AI written procedural code: no image model, no scraped art. The store listing carries itch.io's Generative AI disclosure.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
