# Verdant 8-Bit: NES RPG Tileset for RPG Maker MZ [16x16] — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Verdant 8-Bit: NES RPG Tileset for RPG Maker MZ [16x16]  
**Engine:** PixelLab API (REST, from Node) — grid-aligned tile sheets + autotiles  
**Store page:** https://csaf.itch.io/verdant-8bit  
**Docs published:** 2026-11-05


---

# Verdant 8-Bit: NES RPG Tileset for RPG Maker MZ [16x16]

**Verdant 8-Bit: NES RPG Tileset for RPG Maker MZ** is a 16x16 NES-palette tileset volume for RPG Maker MZ (pages at 48px, checked against the v1.10.0 runtime's own code), with Tiled, Godot 4 and Unity imports: the Overworld, the Castle Town, the Interiors, the Cavern and the Lava Keep in one download. It holds **2,113 tiles at 16x16**: 22 complete 47-shape terrain sets (4 of them animated), 18 wall and roof blocks, 112 distinct objects (107 static and 5 animated), 8 animated waterfall and lavafall pieces and 5 ready-to-open MZ sample maps, plus a sailing ship for MZ's vehicle slot. Commercial use is allowed in unlimited projects with no royalty and no attribution required; you may not resell the pack itself. The wider Verdant series has a free sampler: the Verdant 00 Series Sampler (https://csaf.itch.io/verdant-00-sample).

## What is in it

| what | how many |
| --- | --- |
| **Fills** | 42 |
| Terrain and wall transition tiles | 1,320 (18 terrain sets x 47, plus 18 wall and roof blocks) |
| Animated terrain tiles | 564 (4 sets x 47 x 3 frames) |
| Object tiles | 148 files (107 objects, transparent overlays; a large object is cut into 16x16 cells) |
| Animated object and waterfall frames | 39 (13 pieces x 3 frames: 5 objects, 8 waterfall and lavafall pieces) |
| **Total** | **2,113** |

### By environment

| environment | fills | objects | tiles | sample map |
| --- | --- | --- | --- | --- |
| The Overworld | 17 | 18 | 570 | `sample_map_01.json` |
| The Castle Town | 10 | 29 | 605 | `sample_map_02.json` |
| The Interiors | 6 | 28 | 269 | `sample_map_03.json` |
| The Cavern | 4 | 17 | 327 | `sample_map_04.json` |
| The Lava Keep | 5 | 15 | 342 | `sample_map_05.json` |

### The terrain sets

22 complete sets, every one of the 47 shapes present in each. `X_on_Y` means X is drawn inside, with the ground Y around it.

| set | environment | what it draws |
| --- | --- | --- |
| `world_forest_on_grass` | The Overworld | forest on grass |
| `world_tall_on_grass` | The Overworld | tall grass on grass |
| `world_hill_on_grass` | The Overworld | raised hills with a south face, on grass |
| `world_road_on_grass` | The Overworld | dirt road on grass |
| `world_sand_on_grass` | The Overworld | desert sand on grass |
| `world_mountain_on_grass` | The Overworld | brown mountain range on grass |
| `world_snowpeak_on_grass` | The Overworld | snow peaks on grass |
| `world_snow_on_grass` | The Overworld | snowfield on grass |
| `town_cobble_on_grass` | The Castle Town | cobblestones on grass |
| `town_farm_on_grass` | The Castle Town | ploughed field on grass |
| `town_hedge_on_grass` | The Castle Town | clipped hedge with a south face, on grass |
| `town_flowerbed_on_grass` | The Castle Town | flower bed on grass |
| `interior_rug_on_wood` | The Interiors | crimson rug with a gold border, on planks |
| `interior_marble_on_wood` | The Interiors | marble inlay on planks |
| `cavern_rubble_on_floor` | The Cavern | rubble bank on the cavern floor |
| `cavern_chasm_on_floor` | The Cavern | chasm with a lit far lip, on the cavern floor |
| `keep_carpet_on_floor` | The Lava Keep | throne-room carpet on flagstones |
| `keep_rubble_on_floor` | The Lava Keep | broken masonry on flagstones |
| `world_sea_on_grass` | The Overworld | sea and rivers on grass, three wave frames (animated, 3 frames) |
| `town_moat_on_flagstone` | The Castle Town | castle moat on flagstones, three wave frames (animated, 3 frames) |
| `cavern_pool_on_floor` | The Cavern | underground pool on the cavern floor, three wave frames (animated, 3 frames) |
| `keep_lava_on_floor` | The Lava Keep | lava on flagstones, three flow frames (animated, 3 frames) |

### The wall and roof blocks

Each block is built for its MZ page and holds the number of shapes shown. The wall-top blocks on A4 hold all 47; the roofs and wall faces hold 16.

| block | environment | what it draws | MZ page | shapes |
| --- | --- | --- | --- | --- |
| `town_roof_red` | The Castle Town | red tile roof | A3 | 16 |
| `town_roof_slate` | The Castle Town | blue slate roof | A3 | 16 |
| `town_roof_thatch` | The Castle Town | thatched roof | A3 | 16 |
| `town_wall_timber` | The Castle Town | half-timbered wall | A3 | 16 |
| `town_wall_brick` | The Castle Town | red brick wall | A3 | 16 |
| `town_wall_stone` | The Castle Town | dressed stone wall | A3 | 16 |
| `town_top_castle` | The Castle Town | castle wall top | A4 | 47 |
| `town_side_castle` | The Castle Town | castle wall face | A4 | 16 |
| `town_top_garden` | The Castle Town | garden hedge top | A4 | 47 |
| `town_side_garden` | The Castle Town | garden hedge face | A4 | 16 |
| `interior_top_plaster` | The Interiors | room wall top, timber | A4 | 47 |
| `interior_side_plaster` | The Interiors | plaster wall with a timber wainscot | A4 | 16 |
| `interior_top_chapel` | The Interiors | chapel wall top, stone | A4 | 47 |
| `interior_side_chapel` | The Interiors | dressed chapel wall | A4 | 16 |
| `cavern_top_cave` | The Cavern | cave wall top | A4 | 47 |
| `cavern_side_cave` | The Cavern | cave wall face | A4 | 16 |
| `keep_top_keep` | The Lava Keep | keep wall top | A4 | 47 |
| `keep_side_keep` | The Lava Keep | keep wall face | A4 | 16 |

### The objects

- **The Overworld**: castle (2x2), walled town, village, tower (1x2), lighthouse (1x2), windmill (1x2), shrine, ruins, cave mouth, bridge ns, bridge ew, dock, tree round, tree pine, bush, sign, rock, grave.
- **The Castle Town**: tree round (1x2), tree pine (1x2), bush, flower pot, well, barrel, crate, fence ew, fence end, market stall (2x2), sign inn, sign shop, sign arms, lamp post (1x2), cart (2x1), haystack, door timber, door brick, door stone, window timber, window brick, window stone, fountain (2x2), statue (1x2), castle gate (2x2), drawbridge, stone stairs, banner (1x2), chimney.
- **The Interiors**: bed (1x2), table, stool, chair, counter w, counter m, counter e, barrel, crate, sack, pot, chest, chest open, altar (2x1), pew (2x1), stairs up, stairs down, weapon rack (1x2), armour stand (1x2), bookshelf (1x2), potion shelf (1x2), clock (1x2), portrait, door in, window in, sign inn, sign shop, goods table (2x1).
- **The Cavern**: stalagmite, stalactite, rock, boulder (2x2), crystal, big crystal (1x2), glowcap, ore node, rail ns, rail ew, rail turn, minecart, support (1x2), ladder, hole down, chest, bones.
- **The Lava Keep**: iron door (1x2), portcullis, throne (1x2), gargoyle (1x2), pillar (1x2), skull pile, chain, cage (1x2), lever, spikes, lava bridge ns, lava bridge ew, banner (1x2), keep stairs, chest.

**Animated objects (5, 3 frames each):** fireplace, candle, lantern, brazier, wall torch.

**Animated waterfall and lavafall pieces (8, 3 frames each):** fall single, fall left, fall mid, fall right, lavafall single, lavafall left, lavafall mid, lavafall right. Left, mid and right build a fall of any width; single is a fall one tile wide. These join side by side and are not objects.

## Drawn under NES colour limits

The NES gives each 16x16 area of a background one of four 3-colour palettes, all sharing one backdrop colour. Every tile here is drawn to that rule, and the build refuses a tile that breaks it:

- Every environment declares four sub-palettes on one black backdrop (`nes` in `pack.json` lists them).
- Every 16x16 tile, and every 16x16 of every sample map as composed, fits one sub-palette of its environment.
- In the sample maps a floor object sits on the plain floor tile, the first variant of that fill, because that is what keeps its 16x16 inside one sub-palette. Painted over a patterned floor tile it still draws, but that 16x16 then holds more colours than the hardware rule allows.
- Every pixel is one of the 55 colours of the Lospec NES table. A real NES has no canonical RGB, so these values vary by emulator; this pack uses that table's values and 23 of its colours.
- There are no partly transparent pixels.

| sample map | unique 8x8 patterns |
| --- | --- |
| The Overworld | 262 |
| The Castle Town | 307 |
| The Interiors | 230 |
| The Cavern | 167 |
| The Lava Keep | 156 |

This is a tileset for modern engines drawn in the NES's look, not a cartridge: it is not an NES ROM. An NES holds 256 background patterns at a time, and The Overworld and The Castle Town use more than that. The count treats only identical 8x8 blocks as one pattern and gives no credit for flips.

## RPG Maker MZ

`importers/RPGMakerMZ/` holds the pages at 48px (each 16px tile scaled x3, nearest neighbour): **A1** water, lava and waterfalls, **A2** the static terrain sets, **A3** roofs and building walls, **A4** room tops and walls, **A5** the 42 fills and **B** the objects.

**To use the pages:** copy the PNG files from `importers/RPGMakerMZ` into your project's `img/tilesets`, then in Database > Tilesets set Mode to World or Area and pick each page in its slot.

**To open the sample maps:** use a NEW project, because these steps assume the ids a new project leaves free. Copy `maps/Map002.json` to `maps/Map006.json` into `data/`. In `data/Tilesets.json` replace the last `]` with the contents of `maps/Tilesets_append.txt` (this adds tileset row 7, with every passage flag set). In `data/MapInfos.json` replace the last `]` with the contents of `maps/MapInfos_append.txt` (this adds maps 2 to 6). In an existing project those ids may be taken: change them first, because copying over a map of yours replaces it.

**The ship:** copy `vehicles/$Verdant8Bit_Ship.png` into `img/characters` and choose it as the Ship in Database > System. It is a 48px big-character sheet with four directions of three frames, in three colours plus transparent, like an NES sprite.

**What is flagged:** the shipped tileset row marks walls, water, lava and furniture as blocked, tall grass as bush, shop counters as counters, the mine ladder as a ladder, spikes as damage floor, and the sea as open to the boat and ship. The tops of tall objects such as castles, trees and pillars are star tiles, so a walker passes behind them.

**What animates:** the A1 water, lava and waterfalls animate in MZ. The other animated objects are on page B as a row of stills, because page B does not animate: run them with an event if you want them to move.

**What was checked:** RPG Maker MZ itself is not installed where this pack is built, so nothing here was painted in the MZ editor. What was done instead: the runtime's own JavaScript (v1.10.0) was run headless. Its autotile drawing code composed all 5 sample maps from the shipped pages, and the result matched the shipped pictures pixel for pixel. Its `Game_Map` was then asked about every cell of every map, and every answer matched the role map. The A2 sheet composes correctly against MZ's own autotile table.

## Tiled

`importers/Tiled/` holds one `.tsx` tileset per sheet. Each of the 22 terrain sets (the 4 animated ones included) and the 6 A4 wall-top blocks is a Tiled Wang set (mixed: corners and edges, one terrain colour), the kind Tiled's Terrain brush paints with: 46 of its 47 tiles carry a wang id, and the single-cell tile, which has no edge or corner to match, is stamped by hand. On an animated set each wang id names the shape's first frame, which carries the animation. Every wang id was looked up on a test map holding all 46 shapes and the result rendered by Tiled 1.12.2's own tmxrasterizer, identical to the pack's own tile table (6,552 cells). The brush itself was not driven, because no Tiled editor runs where this pack is built. The 12 roof and wall-face blocks (16 shapes each) are placed tile by tile. `sample_maps/` holds 5 `.tmx` maps (The Overworld, The Castle Town, The Interiors, The Cavern, The Lava Keep), each opened and rendered by Tiled 1.12.2's own tmxrasterizer and compared pixel for pixel against its PNG. The animations play in Tiled: its renderer was advanced through them and compared frame by frame.

## Godot 4

`importers/Godot/` holds a `.tres` TileSet with one atlas per sheet. It was loaded in Godot 4.7.2, which was made to count the tiles it built against the ones declared. Animation frames arrive as separate tiles: this TileSet does not set up their animation, so use the frame order in `tiles.json` if you want them to move.

## Unity

Copy `importers/Unity/` anywhere under `Assets/`, then run **Tools > CSAF Verdant > Verdant 8-Bit NES RPG Tileset for RPG Maker MZ [16x16] > Build Unity Assets** to build sprites, Tiles and RuleTiles in your project. The wall and roof blocks arrive as sprites only, with no RuleTile.

## How it was checked

Every tile's wrap boundary is measured against its own interior, and every 4x4 repetition is rendered and reviewed (`proof/repetition/`). Grid, palette and autotile completeness are machine-proven: every tile is exactly 16x16, every pixel is inside the pack's locked colour list (`pack.json`), every terrain set carries all 47 shapes, and every tile in `tiles.json` has a role.

## Files

```
  tiles/16x16/            every tile as its own PNG
  sheets/16x16/           the tiles packed into sheets by environment
  importers/RPGMakerMZ/   MZ pages at 48px, maps/ and vehicles/
  importers/Tiled/        .tsx tilesets
  importers/Godot/        a .tres TileSet
  importers/Unity/        the Unity importer
  sample_maps/            the sample maps as PNG (2x), JSON and .tmx
  proof/                  4x4 repetition renders
  preview/                the sample maps at 1x
  tiles.json              every tile: role, environment, set, mask, passability
  pack.json               palette, sub-palettes and counts
```

## Licence and AI disclosure

See `LICENSE.txt`. Made by Core Systems Asset Factory with AI written procedural code: no image model, no scraped art. The store listing carries itch.io's Generative AI disclosure.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
