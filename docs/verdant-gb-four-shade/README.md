# Verdant GB — Game Boy Tileset: Overworld, Town and Dungeon in 4 Shades, GB Studio Ready [16x16] — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Verdant GB — Game Boy Tileset: Overworld, Town and Dungeon in 4 Shades, GB Studio Ready [16x16]  
**Engine:** PixelLab API (REST, from Node) — grid-aligned tile sheets + autotiles  
**Store page:** https://csaf.itch.io/verdant-gb  
**Docs published:** 2026-11-05


---

# Verdant GB — Game Boy Tileset: Overworld, Town and Dungeon in 4 Shades, GB Studio Ready [16x16]

**Verdant GB — Game Boy Tileset: Overworld, Town and Dungeon in 4 Shades, GB Studio Ready** is a 16x16 Game Boy style tileset volume in the four GB Studio shades (#071821 #306850 #86c06c #e0f8cf), for GB Studio, Tiled, Godot 4, RPG Maker MZ and Unity: three environments in one download, the Overworld, the Town and the Dungeon. It holds **569 tiles at 16x16**: 10 complete 47-mask sets (autotiles), 37 distinct objects and 3 sample scenes, each sample scene already a GB Studio background inside the 192 unique tile limit. Commercial use is allowed in unlimited projects, including Game Boy ROMs, with no royalty and no attribution required; you may not resell the pack itself. The wider Verdant series (full colour, not Game Boy) has a free sampler: the Verdant 00 Series Sampler (https://csaf.itch.io/verdant-00-sample).

## What is in it

| what | how many |
| --- | --- |
| **Fills** | 26 |
| Autotile transition tiles | 470 (10 sets x 47) |
| Object tiles | 73 files (37 objects, transparent overlays; a large object is cut into 16x16 cells) |
| **Total** | **569** |

Of the 569 tiles, **83%** are transitions: the 47 shapes of every set, so any shape you paint has its edge.

### By environment

| environment | fills | transition tiles (sets) | objects | GB Studio sample scene |
| --- | --- | --- | --- | --- |
| The Overworld | 11 | 188 (4) | 12 | 320x288, 140 of 192 unique tiles |
| The Town | 8 | 141 (3) | 11 | 320x288, 153 of 192 unique tiles |
| The Dungeon | 7 | 141 (3) | 14 | 320x288, 99 of 192 unique tiles |

### The autotile sets

10 complete sets, every one of the 47 shapes present in each. `X_on_Y` means X is drawn inside, with the ground Y around it.

| set | environment | what it draws |
| --- | --- | --- |
| `path_on_grass` | The Overworld | dirt path on grass |
| `water_on_grass` | The Overworld | pond water on grass, with a shore line |
| `tall_on_grass` | The Overworld | tall grass on short grass |
| `hill_on_grass` | The Overworld | raised hilltop with a rock face, on grass |
| `lawn_on_paving` | The Town | lawn on the cobbled square |
| `road_on_paving` | The Town | carriage road with a kerb, on the cobbled square |
| `garden_on_lawn` | The Town | flowerbed with an edging, on the lawn |
| `wall_on_floor` | The Dungeon | wall with a brick face, on the flagstones |
| `pit_on_floor` | The Dungeon | bottomless pit with a lit lip, in the flagstones |
| `carpet_on_floor` | The Dungeon | carpet runner with a border, on the flagstones |

### The objects

- **The Overworld**: tree round (2x2), tree pine (1x2), bush, rock, boulder (2x2), sign, stump, fence ew, fence end, cave mouth (2x2), log (2x1), grave.
- **The Town**: house (3x3), shop (3x3), well, lamp (1x2), crate, barrel, bench, market stall (2x2), fountain (2x2), inn sign, flower pot.
- **The Dungeon**: chest, chest open, brazier, statue (1x2), stairs down, stairs up, door, pot, push block, switch up, switch down, pillar (1x2), spikes, skull.

## Built for the Game Boy tile budget

A GB Studio background may hold at most 192 unique 8x8 tiles (Monochrome and Color + Monochrome games; 384 in Color Only). Busy art runs out fast, so every autotile set here is built from 8x8 quarters: each quarter of a 16x16 tile is decided only by its own three neighbours, and every texture repeats every 8 pixels. A whole 47 tile set is drawn from **13 distinct 8x8 tiles**, counted on every set by the build, which refuses a set that needs more.

The 3 sample scenes are in `importers/GBStudio/backgrounds/` at 1x, ready to import as backgrounds. Their unique 8x8 tiles were counted on the shipped PNGs: The Overworld 140, The Town 153, The Dungeon 99, against the 192 limit. The count treats only identical 8x8 blocks as one tile and gives no credit for flips, so it is an upper bound. GB Studio itself is not installed where this pack is built, so the scenes have not been opened in GB Studio; the count is the rule its documentation states.

To build your own scenes, paint them in Tiled with the `.tsx` sets (each autotile set is a Terrain brush there) and export the map as a PNG, or arrange tiles from `tiles/16x16/` in any image editor. Keep the four colours exact.

## Using it in other engines

### Tiled

`importers/Tiled/` holds one `.tsx` tileset per sheet. Each of the 10 autotile sets is a Tiled Wang set (mixed: corners and edges, one terrain colour), the kind Tiled's Terrain brush paints with: 46 of its 47 tiles carry a wang id, and the single-cell tile, which has no edge or corner to match, is stamped by hand. Every wang id was looked up on a test map holding all 46 shapes and the result rendered by Tiled 1.12.2's own tmxrasterizer, identical to the pack's own tile table (2,340 cells). The brush itself was not driven, because no Tiled editor runs where this pack is built. `sample_maps/` holds 3 `.tmx` maps (The Overworld, The Town, The Dungeon), each opened and rendered by Tiled 1.12.2's own tmxrasterizer and compared pixel for pixel against its PNG.

### Godot 4

`importers/Godot/` holds a `.tres` TileSet with one atlas per sheet. It was loaded in Godot 4.7.2, which was made to count the tiles it built against the ones declared.

### RPG Maker MZ

`importers/RPGMakerMZ/` holds MZ tileset images at 48px (each 16px tile scaled x3, nearest neighbour): **A2** with the 10 sets as floor autotiles, and **B, C, D** with the grounds and objects. The A2 sheet composes correctly against MZ's own autotile table, read out of the engine's code. RPG Maker MZ itself is not installed where this pack is built, so it has not been painted with in the MZ editor.

### Unity

Copy `importers/Unity/` anywhere under `Assets/`, then run **Tools > CSAF Verdant > Verdant GB Game Boy Tileset Overworld, Town and Dungeon in 4 Shades, GB Studio Ready [16x16] > Build Unity Assets** to build sprites, Tiles and RuleTiles in your project.

## How it was checked

Every tile's wrap boundary is measured against its own interior, and every 4x4 repetition is rendered and reviewed (`proof/repetition/`). Grid, palette and autotile completeness are machine-proven: every tile is exactly 16x16, every pixel is one of the 4 GB Studio shades (**4 colours, locked**), every set carries all 47 transitions, and every tile in `tiles.json` has a role.

## Files

```
  tiles/16x16/            every tile as its own PNG
  sheets/16x16/           the tiles packed into sheets by environment
  importers/GBStudio/     the sample scenes as GB Studio backgrounds, and budget.json with their tile counts
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
