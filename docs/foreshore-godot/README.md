# Foreshore: 48 Shoreline Coasts for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Foreshore: 48 Shoreline Coasts for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-14


---

# Foreshore for Godot 4

**48 coasts drawn along your own TileMapLayers, for Godot 4.7.** Version 1.0.0 · Core Systems Asset Factory

Foreshore draws the edge where your water meets your land. It reads your TileMapLayers once, finds the liquid inside
every tile (so the foam follows the coast your autotiles draw, not the cell grid), and then draws the coast over your map
every frame in one shader pass: shallows next to the shore, wave fronts that follow the coastline and break, a swash that
runs up sand and leaves it wet, spray where waves hit rock or a quay, and a tide that rises and falls. Nothing is an image:
every coast is computed at runtime from your own tiles and a coast resource you can edit. 48 coasts ship, each
built differently (its own foam, motion and shore), never recoloured.

## Install

1. Copy `addons/foreshore/` into your project's `addons/` folder. There is no plugin to enable.
2. Add a **Foreshore2D** node as a sibling of your TileMapLayers, AFTER them in the scene tree (or give it a higher
   `z_index`), so it draws over them.
3. Set its `coast` to one of the files in `addons/foreshore/coasts/` (or a copy you edited).
4. Run. With `layers` empty it reads every TileMapLayer that is a sibling of the node; to choose, list them in `layers`.

Open `demo/demo.tscn` and press F5 to see every coast. Every scene in `demo/presets/` is one coast on its demo map (F6).

## How it reads your map

Every piece of the map (`sub_cells` x `sub_cells` pieces per cell, 4 by default) is liquid, soft shore or hard shore.
Soft shore (sand, mud, grass) takes the swash and the wet band; hard shore (rock, quays, walls, ice) takes spray and the
tide moves a fifth as far on it. Per tile, in this order:

1. **A custom data layer** named `foreshore_surface` (type String) on your TileSet, with one of: `liquid`, `shore`, `hard`,
   `edge` (a coast drawn inside one tile: its pixels are split by comparing them with the colours of your tiles tagged
   `liquid` and `shore`), `edge_hard` (the same, with hard land), or `ignore`. This is the most accurate, and the only way to
   make a lava, bog or acid tile count as liquid.
2. **The layer's node name**: a layer named with `water`, `sea`, `ocean`, `lake`, `river`, `pond`, `lava`, `magma`, `bog`,
   `swamp`, `acid` or `liquid` is liquid wherever it has pixels; `rock`, `cliff`, `quay`, `pier`, `dock`, `jetty`, `wall`,
   `stone` is hard; `sand`, `beach`, `shore`, `ground`, `grass`, `land`, `mud`, `floor` is soft; `prop`, `decor`, `object`,
   `overlay`, `shadow` is ignored. So a two-layer map with a "Water" layer under a "Ground" layer works with no setup.
3. **Each pixel's colour**, on a layer with neither: blue-dominant pixels are water.

Later layers win where they have an opaque pixel. Then a distance transform gives every point its distance to the
waterline and how open the water is (waves are bigger on open water than in a pond). Set `show_coast_map` to see what
it read: red is the distance, green is hard shore, blue is open water. Call `rebuild_coast_map()` after you change tiles,
and `add_coast_rect(rect, "liquid")` to mark water a tile cannot say (a fountain basin drawn as a prop).

## The 48 coasts

Each coast is a `ForeshoreCoast` resource in `addons/foreshore/coasts/<id>.tres`. Each is shown in the demo on one of the
five demo maps; every coast works on any map.

### Beach (6)

sand coasts: a lagoon, surf, a pebble cove, white sand, a storm, the tide far out.

- **Lagoon** `lagoon`: A wide turquoise shallow, lace foam and glints over white sand. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Surf Beach** `surf_beach`: Big breakers rolling in from open water, a long run-up and a wide wet band. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Pebble Cove** `pebble_cove`: A grey-green cove: stippled spray in short fronts, dark wet shingle. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **White Sand** `white_sand`: Glassy water over a very wide bright shallow; a thin lace line, almost no waves. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Storm Coast** `storm_coast`: A dark sea, many broken fronts, heavy spray off the quay and a high tide over the sand. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Low Tide** `low_tide`: The tide far out: wet flats left over the water tiles, small ripples lapping at the edge. Shown on the bay (Verdant 36 sand, sea and a quay pier).

### Harbour (6)

harbour and open coast: still water slapping a quay, swell on a breakwater, moonlight, sunset, kelp, a red tide.

- **Harbour Slap** `harbour_slap`: Still, dark harbour water: thin ripples slap the quay and catch the light. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Breakwater** `breakwater`: Swell driving into the quay and the breakwater: a burst of spray as each front hits. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Moonlit Shore** `moonlit`: Night water: a deep blue tint, pale lace and a silver path of glints. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Sunset Shore** `sunset`: Evening light: rose shallows, warm foam, gold glints on the swell. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Kelp Coast** `kelp_coast`: Mats of kelp and wrack floating off the beach in a dark green sea. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Red Tide** `red_tide`: An algal bloom: the shallows run red and dark rafts of it lap the shore. Shown on the bay (Verdant 36 sand, sea and a quay pier).

### Lake (6)

fresh water: a millpond, a river bank, a reed margin, a clear stream, a muddy river, a mountain tarn.

- **Millpond** `millpond`: Still water: rings lapping at the bank, a faint shallow, a few glints. Shown on the river (Verdant 38 meadow and water).
- **River Bank** `river_bank`: A brown margin, foam lapping along the bank, a broad band of wet mud. Shown on the river (Verdant 38 meadow and water).
- **Reed Margin** `reed_margin`: A dark weedy margin with pale lace caught along it. Shown on the river (Verdant 38 meadow and water).
- **Clear Stream** `clear_stream`: A bright clear shallow over the stones, stippled riffles and many glints. Shown on the river (Verdant 38 meadow and water).
- **Muddy River** `muddy_river`: A silt plume spreading from the banks, creamy foam, the banks churned wet. Shown on the river (Verdant 38 meadow and water).
- **Mountain Tarn** `mountain_tarn`: Deep cold water, a narrow pale shelf and a bright inked waterline. Shown on the river (Verdant 38 meadow and water).

### Cold (6)

ice: new ice crusting, slush, floes, a thaw, a glowing rime, black ice.

- **Frozen Lake** `frozen_lake`: Plates of new ice crusting along the shore, cold glints on the open water. Shown on the frozen lake (Verdant 41 ice and water).
- **Slush** `slush`: Grey slush packed along the ice edge, rocking with the water. Shown on the frozen lake (Verdant 41 ice and water).
- **Arctic Floe** `arctic_floe`: Black water, broken pans of ice along the edge, spray where the swell hits. Shown on the frozen lake (Verdant 41 ice and water).
- **Thaw** `thaw`: The ice rotting at the edge: a dark melt band on the ice, small ripples, a blue rim. Shown on the frozen lake (Verdant 41 ice and water).
- **Rime Glow** `rime_glow`: A pale glow along the ice and rings of light pulsing out from it. Shown on the frozen lake (Verdant 41 ice and water).
- **Black Ice** `black_ice`: Water black as glass, a hard bright waterline and thin inked swells. Shown on the frozen lake (Verdant 41 ice and water).

### Swamp (6)

bog and mire: scum, peat water, wisp light, an algae bloom, tar, murk.

- **Bog Scum** `bog_scum`: Green scum drifting in mats over a black pool, the peat wet and dark around it. Shown on the bog (Verdant 41 peat and bog pools).
- **Peat Pool** `peat_pool`: Tea-brown water stained by the peat, slow rings at the edge. Shown on the bog (Verdant 41 peat and bog pools).
- **Wisp Bog** `wisp_bog`: A dark mire lit from inside: green light along the pools and floating glints. Shown on the bog (Verdant 41 peat and bog pools).
- **Algae Bloom** `algae_bloom`: A bright green bloom crowding the shallows. Shown on the bog (Verdant 41 peat and bog pools).
- **Tar Seep** `tar_seep`: Black tar with an oily violet sheen along its edge. Shown on the bog (Verdant 41 peat and bog pools).
- **Murk** `murk`: Murky water with a yellow froth of bubbles stippled along the bank. Shown on the bog (Verdant 41 peat and bog pools).

### Molten (6)

lava: a cooling crust, rolling molten surf, spitting embers, an obsidian rim, sulphur, a cooling flow.

- **Lava Crust** `lava_crust`: Dark crust plates cooling along the shore, the lava glowing through the cracks. Shown on the lava field (Verdant 25 basalt and magma).
- **Magma Surf** `magma_surf`: Waves of cooling skin rolling in over the lava and breaking on the basalt, the rock scorched behind them. Shown on the lava field (Verdant 25 basalt and magma).
- **Ember Shore** `ember_shore`: Sparks spitting along the edge and heat glowing on the rock around it. Shown on the lava field (Verdant 25 basalt and magma).
- **Obsidian Rim** `obsidian_rim`: A rim of black glass round the lava with a violet heat line. Shown on the lava field (Verdant 25 basalt and magma).
- **Sulphur Pool** `sulphur_pool`: Yellow sulphur rafts on a bright pool that glows at its edge. Shown on the lava field (Verdant 25 basalt and magma).
- **Cooling Flow** `cooling_flow`: A wide skin of big cooled plates, the last of the glow in thin seams. Shown on the lava field (Verdant 25 basalt and magma).

### Stylised (6)

looks for a game's own style: pixel surf, toon bands, sumi ink, 8-bit steps, storybook lace, a blueprint chart.

- **Pixel Surf** `pixel_surf`: Surf snapped to a 2 px grid in four flat levels, for pixel-art games. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Toon Shore** `toon_shore`: Flat cel-shaded bands and a clean white waterline. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Sumi Ink** `sumi_ink`: Brush-ink lines on pale paper water, the bank outlined in black. Shown on the river (Verdant 38 meadow and water).
- **Retro 8-bit** `retro_8bit`: Chunky 4 px steps in two levels, like an old console coast. Shown on the frozen lake (Verdant 41 ice and water).
- **Storybook** `storybook`: Soft pastel lace, a wandering white outline, paper-warm sand. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Blueprint** `blueprint`: The water drawn as a chart: deep blue fill and still contour lines. Shown on the river (Verdant 38 meadow and water).

### Fantasy (6)

a mana tide, bioluminescent surf, a blood sea, a ghost shore, a starlit lake, an acid pool.

- **Mana Tide** `mana_tide`: Violet light pulsing out from the banks in rings. Shown on the river (Verdant 38 meadow and water).
- **Bioluminescent** `bioluminescent`: A night sea whose surf glows blue as it breaks. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Blood Sea** `blood_sea`: Crimson shallows, pink foam and a stained shore. Shown on the bay (Verdant 36 sand, sea and a quay pier).
- **Ghost Shore** `ghost_shore`: A pale mist glowing along the water, the colour drained from it. Shown on the frozen lake (Verdant 41 ice and water).
- **Starlit Lake** `starlit_lake`: Black water full of reflected stars, faint rings at the bank. Shown on the river (Verdant 38 meadow and water).
- **Acid Pool** `acid_pool`: Toxic green fizz along the edge of a glowing pool. Shown on the bog (Verdant 41 peat and bog pools).

## Foreshore2D

| property | what it does |
| --- | --- |
| `coast` | the ForeshoreCoast to draw; change it any time, or `set_coast(coast, seconds)` to fade from one to the next |
| `layers` | the TileMapLayers to read (empty = every TileMapLayer sibling); later entries win |
| `sub_cells` | pieces per cell the map is read at (1 to 8, default 4); use 2 or 1 on very large maps |
| `intensity` | overall strength (0 to 2) |
| `speed` | wave time multiplier (0 = frozen waves) |
| `tide_cycle` | the tide rises and falls by itself over the coast's `tide_period`; off = it stays at `tide` |
| `tide` | the tide when `tide_cycle` is off: 0 low, 1 high |
| `tide_speed` | tide time multiplier |
| `foam_seed` | same coast, different foam |
| `playing` | pause waves and tide |
| `show_coast_map` | draw what the coast map read instead of the coast |

| method / signal | what it does |
| --- | --- |
| `depth_at(world_pos)` | how deep the water is there now, in cells: above 0 under water, below 0 that far up the shore; the tide moves it; `-INF` outside the map |
| `is_under_water(world_pos)` | `depth_at() > 0` |
| `is_wet(world_pos)` | true where the water reaches now or the wet band of the coast is |
| `tide_level()` | the tide now, 0 low to 1 high |
| `rebuild_coast_map()` | re-read the layers after you change tiles or move a layer |
| `add_coast_rect(rect, kind)` | mark a world rectangle `liquid`, `shore` or `hard` |
| `coast_counts()` | what the map read: `{liquid, soft, hard}` in pieces |
| `csaf_preview()` / `resume()` | hold the coast at its preview moment and preview tide (screenshots), then run again |
| `coast_changed(coast)`, `coast_map_built(counts)` | signals |

Keep the Foreshore2D node itself unrotated and unscaled; scaling the map's parent is fine (the demo draws its maps at 2x).

## ForeshoreCoast

Every coast is one resource; duplicate one and move its sliders to make your own. Groups:

- **Water**: `deep_color`, `shallow_color`, `shallow_width` (cells).
- **Foam**: `foam_kind` (Bands, Lace, Stipple, Pixel steps, Ink, Crust, Scum, Ripples, Glow), `foam_color`, `foam_amount`,
  `foam_scale`, `wave_motion` (Roll in, Lap, Still, Pulse out), `wave_len`, `wave_speed`, `wave_reach`, `wave_width`, `break_width`.
- **Shore**: `swash`, `wet_color`, `wet_width`, `flats_color` (the bed the tide leaves dry), `spray_color`, `spray_amount`.
- **Tide**: `tide_range` (cells), `tide_period` (seconds).
- **Light**: `edge_color` + `edge_width` (a line on the waterline), `sparkle_color` + `sparkle_amount` (glints),
  `glow_color` + `glow_width` (light from the shore; it adds light).
- **Style**: `pixel_px` (snap to a pixel grid), `posterize` (flat colour levels), `warp` (how far the line wanders off the tile edge).
- **Preview**: `preview_time`, `preview_tide` (the moment screenshots and `csaf_preview()` show).

A colour's alpha is its strength. Colours are a parameter: a recolour of a coast is the same coast.

## Renderers and versions

Written for and run on **Godot 4.7.2**: every coast was photographed under **Forward+** and **Compatibility** (the
OpenGL renderer web exports use) with no error lines, and loaded into a blank 4.7.2 project from this archive. Older
Godot versions were NOT run. The coast map is read on the CPU once (when the node enters the tree and when you call
`rebuild_coast_map()`); after that the coast costs one shader pass over the map rectangle.

**What it costs, measured on our test machine** (a laptop with integrated AMD graphics): a 120 x 67 cell map (1920 x 1080 px)
took about 2 to 4 seconds to read at `sub_cells` 4, on the main thread. On a large map, add the node behind a loading screen
or set `sub_cells` to 2 (a quarter of the pieces). Drawing that map with the storm coast then averaged under 10 ms a frame
under both renderers, with no frame over 25 ms (vsync off).

## Licence

See LICENSE.txt: use it in any number of games; do not resell or redistribute the files as a pack. The demo tiles in
`demo/fixture/` are from Core Systems Asset Factory tilesets sold separately (`demo/fixture/NOTICE.txt`).

This pack is AI-generated (the shader, every script and coast, and the demo). Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
