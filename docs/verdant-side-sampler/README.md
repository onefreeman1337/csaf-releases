# Verdant Side Sampler: 214 Free Platformer Tiles [16x16] — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Verdant Side Sampler: 214 Free Platformer Tiles [16x16]  
**Engine:** PixelLab API (REST, from Node) — grid-aligned tile sheets + autotiles  
**Docs published:** 2026-10-30


---

# Verdant Side Sampler: Free Side-View Tiles

A free side-view platformer tileset for **Godot 4** (a ready TileSet with collision, one-way platforms and a terrain brush, plus three sample scenes) and **Tiled** (tilesets with collision shapes and terrain sets, plus three sample maps). **214 tiles at 16x16**, cut from the three paid Verdant Side volumes: 3 complete autotile sets of 47 shapes, 30 slope pieces, 12 one-way platform pieces, an animated lava hazard and 6 objects (one animated), in one 65 colour palette. Free, commercial use permitted, no attribution required (LICENSE.txt). Every tile is drawn by AI written procedural code: see AI DISCLOSURE below.

**What this is.** A demo cut: one biome's ground from each volume, so you can paint a level in your own engine tonight and see whether the family fits your game. Each cut is at most 10% of its volume's tiles (65 of 651, 70 of 703 and 79 of 807). Every tile is the paid volume's own file, byte for byte, under the same name, so nothing here looks different from what the volumes sell.

## What is inside

- **From [Verdant Side: Greenwood, Keep & Undercroft](https://csaf.itch.io/verdant-side)** (65 tiles, 10% of the volume): the `turf` set (grass-capped forest loam: all 47 shapes, its 10 slope pieces and 3 extra interior fills), a 4 piece one-way platform (`branch`); objects: meadow flowers.
- **From [Verdant Side Depths: Infernal Halls, Desert Tomb & Crypt](https://csaf.itch.io/verdant-side-depths)** (70 tiles, 10% of the volume): the `brimstone` set (brimstone rock with an ember-lit underside: all 47 shapes, its 10 slope pieces and 3 extra interior fills), a 4 piece one-way platform (`iron_grate`), molten lava as an animated hazard; objects: a heap of skulls and obsidian shards.
- **From [Verdant Side Village: Market Street, Walk-In Homes & Farm](https://csaf.itch.io/verdant-side-village)** (79 tiles, 9.8% of the volume): the `cobble` set (cobbled street with a dressed kerb: all 47 shapes, its 10 slope pieces and 3 extra interior fills), a 4 piece one-way platform (`market_awning`); objects: a planter box of red and gold flowers, a wooden street bench and an iron street lamp with a flickering flame (animated).

## The sets

| Set | From | What it is | Slopes |
| --- | --- | --- | --- |
| `turf` | Verdant Side | grass-capped forest loam | solid, with 10 slope pieces |
| `brimstone` | Verdant Side Depths | brimstone rock with an ember-lit underside | solid, with 10 slope pieces |
| `cobble` | Verdant Side Village | cobbled street with a dressed kerb | solid, with 10 slope pieces |

## What the full volumes add

Each paid volume is three biomes, not one: **Verdant Side** ($8.99): Greenwood, Keep and Undercroft, 651 tiles, 9 autotile sets (6 solid, 3 back wall), 60 slope pieces, 39 kinds of object (7 animated), 9 parallax layers and three finished sample levels; **Verdant Side Depths** ($8.99): Infernal Halls, Desert Tomb and Crypt, 703 tiles, 9 autotile sets (6 solid, 3 back wall), 60 slope pieces, 43 kinds of object (8 animated), 9 parallax layers and three finished sample levels; **Verdant Side Village** ($8.99): Market Street, Walk-In Homes and Farm Outskirts, 807 tiles, 9 autotile sets (6 solid, 3 back wall), 60 slope pieces, 69 kinds of object (8 animated), 9 parallax layers and three finished sample levels. Together they hold 2,161 tiles on the same grid, light and engine layer, so the volumes and this sampler sit in one game.

- [Verdant Side: Greenwood, Keep & Undercroft](https://csaf.itch.io/verdant-side), $8.99: https://csaf.itch.io/verdant-side
- [Verdant Side Depths: Infernal Halls, Desert Tomb & Crypt](https://csaf.itch.io/verdant-side-depths), $8.99: https://csaf.itch.io/verdant-side-depths
- [Verdant Side Village: Market Street, Walk-In Homes & Farm](https://csaf.itch.io/verdant-side-village), $8.99: https://csaf.itch.io/verdant-side-village

Follow CSAF on itch (https://csaf.itch.io) to hear when the next volume is out.

## The counts

| What | Count |
| --- | --- |
| Individual tile PNGs | 214 |
| Autotile transition tiles | 141 |
| **Fills** | 9 |
| Slope pieces | 30 |
| One-way platform pieces | 12 |
| Hazard tiles (animation frames) | 4 |
| Object tiles | 6 files |
| Animated tiles | 12 files (the street lamp's frames) |

**65 declared colours**, one palette across the three cuts. The 3 complete 47-mask sets fill 141 mask slots, and **66%** of the files are transitions. 6 distinct objects, one of them animated.

## What is in the download

```
  tiles/16x16/        every tile as its own PNG (214 files), named as in the paid volume
  sheets/16x16/       the same tiles on sheets: one per set, two per volume (terrain pieces, objects)
  importers/Godot/    verdant-side-00-sampler.tres (the TileSet), sample_greenwood.tscn, sample_infernal.tscn, sample_street.tscn, the sheets
  importers/Tiled/    one .tsx per sheet, with the sheet beside it
  sample_maps/        each sample level as .tmx (Tiled), .json (placed tile ids by layer), .png (1x) and _scene.png (over a flat sky)
  proof/repetition/   37 4x4 repetition renders
  tiles.json          every tile's role, collision polygon, one-way flag, set and mask, slope piece, animation frames, source volume
```

## Godot 4

1. Copy the `importers/Godot/` folder anywhere in your project (it uses relative paths, so any folder works).
2. Open `sample_greenwood.tscn`, `sample_infernal.tscn`, `sample_street.tscn` to see a finished level (32 by 12 cells) on its TileMapLayers.
3. For your own level, add a TileMapLayer and set its Tile Set to `verdant-side-00-sampler.tres`. In the TileMap panel open **Terrains**: terrain set 0 holds 3 terrains (turf, brimstone, cobble). Pick one and paint: the painter chooses the right one of the 47 shapes and mixes the interior fills for you.
4. Place slopes, platforms, the hazard and the objects from the **Tiles** tab.

What the TileSet carries:
- **Physics layer 0** (collision layer 1): every solid tile and slope, and the one-way platforms with **one way** collision on, so a CharacterBody2D jumps up through them and lands on top.
- **Physics layer 1** (collision layer 2): the lava only. A player on mask 1 falls into it; a hurtbox Area2D on mask 2 detects it.
- **Custom data**: `kind` (the tile's role, for example `terrain-slope` or `platform-oneway`), `hazard` (true on the lava) and `climbable` (the same layer the paid volumes use for their ladders; no tile in this sampler is climbable).
- **Animations**: the lava and the street lamp play as Godot tile animations (each frame 150 or 300 ms).
- **Slopes**: set your CharacterBody2D's floor_max_angle above 45 degrees (the sample run uses 50) so it walks up the 45 degree pieces.

## Tiled

Open `sample_maps/greenwood.tmx`, `sample_maps/infernal.tmx`, `sample_maps/street.tmx`: the tilesets load from `../importers/Tiled/`. Each set sheet carries a **mixed terrain set** (corners and edges, the 47 shape blob), so the Terrain Brush paints it, with the three interior fills as variants. Every solid, slope, platform and hazard tile carries its collision shape as a tile object (type `solid`, `oneway` or `hazard`) and the properties `kind`, `csafTileId` and `oneWay` or `hazard` where true. The lava and the street lamp carry their frames and timings.

## Any other engine

`tiles.json` lists every tile with its file, its sheet position, its role and its collision polygon in tile pixels (0,0 is the top left, 16,16 the bottom right), the one-way flag, and for set tiles the 47 shape mask (bits N 1, NE 2, E 4, SE 8, S 16, SW 32, W 64, NW 128).

## How slopes fit

A slope sits on its own set: the cell below a slope is that set, the cell beyond its low end is open, and the cell beyond its high end is the set's flat top. Under a slope's low end goes that slope's `base` piece (its surface continues into it); under the high piece of a 22.5 degree slope goes the plain fill. The sample levels use these arrangements: a hill with 22.5 degree flanks and a 45 degree crown, and a two step 45 degree ramp onto a plateau.

## Measured on these files

- **The tiles**: every tile is exactly 16x16, every pixel inside one 65 colour palette, alpha strictly on or off (no anti-aliasing), and every set has all 47 shapes. Every repeating tile's wrap boundary is measured against its own interior, and every 4x4 repetition is rendered and reviewed (the 37 renders ship in `proof/`). Every tile was re-encoded from its volume's generator and compared to the file that volume ships: identical, byte for byte.
- **Godot 4.7.2**: loaded `verdant-side-00-sampler.tres` from a subfolder of a blank project and built 202 of 202 atlas tiles exactly as `tiles.json` declares them (collision, one-way, terrain, custom data, animation). Its own terrain painter placed the right tile for 141 of 141 shapes (3 sets x 47). A CharacterBody2D made 16 runs on these tiles: it landed, walked up the 45 and 22.5 degree slopes both ways, jumped up through each one-way platform and landed on it, and fell through the lava on mask 1 while a mask 2 query found it. The three sample scenes, re-opened from a different folder, held every cell.
- **Tiled 1.12.2**: its own renderer (tmxrasterizer) drew the three sample maps identical to ours, 294,912 pixels with 0 different.

Not offered: RPG Maker MZ (a top-down engine) and GameMaker.

## AI DISCLOSURE

Every tile and sheet in this download was drawn by CSAF's own procedural drawing engine (pixel_forge) and drawing code written with AI. No image model, scraped art or third party dataset was used for any of them. The store page cover illustration (not part of the tiles) was generated with an OpenAI image model. The itch.io listing carries the Generative AI disclosure with Graphics marked yes.

## Licence

Free. Commercial and noncommercial use in your games, no royalty, no attribution required. Do not resell or re-upload the art itself as an asset pack, free or paid. Full text: LICENSE.txt. Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
