# Cartography: 48 Journey Map Styles for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Cartography: 48 Journey Map Styles for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Cartography - Journey Maps Drawn as the Player Travels, for Godot 4

A map that draws itself while your player explores, in 48 styles. A recorder follows the player and remembers every cell
they have seen (and what it was: grass, forest, hills, snow, sand, shallows, deep water, walls, floors), the road they
walked and the places they found. A map Control turns that into a finished sheet: an explorer's parchment with hatched
coasts and a compass rose, a sea chart with soundings and rhumb lines, a dungeon plan on graph paper, a star chart, a
blueprint, a pixel overworld. The unexplored part stays blank paper (or fog, or cloud) with a ragged edge that moves as
they walk. One call exports it as a PNG your players can keep.

Nothing is a painted map. The paper, coastlines, hatching, washes, contour lines, depth bands, mountains, trees, waves,
compass roses, frames, title cartouches, scale bars and the lettering are all drawn by code from the journey, every frame
the map changes. Every colour and every choice is a parameter of a `CartographyStyle` resource.

- **Godot version:** built and tested on **Godot 4.7.2**, under **both renderers: Forward+ and Compatibility**
  (Compatibility is the one web exports use). Older 4.x versions were NOT run, so they are not claimed.
- **What is in the box:** 48 styles (`styles/<family>/<id>.tres`) with a preview scene each
  (`presets/<family>/<id>.tscn`), in four families of twelve; eight classes (`CartographyJourney`, `CartographyRecorder`,
  `CartographyMap`, `CartographyStyle`, `CartographyLettering`, `CartographyDraw`, `CartographySample`, and the
  `Cartography` catalogue); two shaders; a demo with an island and a dungeon to explore.

## Install

1. Copy `godot/addons/cartography/` into your project's `addons/` folder (you get `res://addons/cartography/`).
2. That is all: no plugin to enable. The classes register themselves. Keep the folder name: the styles and preview
   scenes reference `res://addons/cartography/` by path.

To browse everything first, open the `godot/` folder as a project in Godot 4.7 and press Play (keys below).

## Use it

```gdscript
# 1. Record: a CartographyRecorder as a child of the player. With a TileMapLayer it reads each tile's kind.
var rec := CartographyRecorder.new()
rec.journey = CartographyJourney.new()
rec.journey.title = "The Lantern Coast"
rec.tile_layer = $World/Ground         # optional; its tile size becomes the map's cell size
rec.reveal_radius = 8                  # how far the player sees, in cells
$Player.add_child(rec)

# 2. Draw: a CartographyMap anywhere in your UI (a pause screen, a journal page, a HUD corner).
var map := CartographyMap.new()
map.size = Vector2(800, 520)
map.journey = rec.journey
map.style = Cartography.style("explorers_parchment")
$PauseMenu.add_child(map)

# 3. Name what they find (icons and lettering are drawn for you).
rec.mark_place("Saltmere", CartographyJourney.Place.PORT)
rec.journey.add_area("The Greenwold", $Player.position)

# 4. Let them keep it.
var err: Error = await map.export_png("user://my_journey.png", Vector2i(1600, 1000))
```

**Telling the recorder what your tiles are.** Add a custom data layer named `map_kind` (type String) to your TileSet and
type one of: `ground`, `water`, `deep`, `forest`, `mountain`, `sand`, `snow`, `wall`, `floor`, `void` (an int
`CartographyJourney.Kind` also works). Without it, a tile with a collision polygon counts as `wall` and any other tile as
`ground`; an empty cell is `empty_kind` (water by default). Or skip tiles entirely and set
`rec.terrain_callable = func(cell: Vector2i) -> int: return ...` (the demo does this).

**A minimap.** `map.view = CartographyMap.View.FOLLOW` keeps the newest route point centred, `follow_cells` cells across.
`View.FIT_EXPLORED` (default) frames everything seen so far; `View.FIXED` shows `fixed_rect` (in cells), so the sheet does
not re-zoom as the journey grows.

**Saving.** A journey is a Resource: `ResourceSaver.save(journey, "user://journey.tres")` works, or use
`journey.save_json(path)` / `journey.load_json(path)` (plain JSON: cells, route, places, areas).

**Changing the look.** `Cartography.style(id)` returns a private copy; change any property and assign it again
(`map.style = s`). Or duplicate a `.tres` in `styles/` and edit it in the inspector. `Cartography.ids()` lists every id,
`Cartography.ids_for_family("sea")` one family.

**CartographyMap properties:** `journey`, `style`, `view`, `fixed_rect`, `follow_cells`, `show_route`, `show_places`,
`show_title`, `refresh_interval`, `scale_units` (the word under the scale bar). Methods: `refresh()`,
`render_image(size)` and `export_png(path, size)` (both awaited), `cell_to_local()`, `world_to_local()`.

**CartographyRecorder properties:** `journey`, `target` (defaults to the parent), `tile_layer`, `reveal_radius`,
`route_step`, `kind_data_layer` (default `map_kind`), `empty_kind`, `recording`, `terrain_callable`. Methods:
`record_now()`, `kind_at(cell)`, `mark_place(name, kind)`. Signal `revealed(count)`.

**Place kinds** (`CartographyJourney.Place`): `TOWN`, `CASTLE`, `CAVE`, `RUIN`, `CAMP`, `PORT`, `SHRINE`, `TREASURE`, `PEAK`,
`DANGER`, `DOOR`, `STAIRS`, each with its own drawn icon.

## Performance

Measured on this pack's test machine (Godot 4.7.2, AMD Radeon integrated graphics, both renderers), with the
island sample (4268 cells) on a 1280x720 sheet: a full redraw (fields, symbols, labels) takes **under 60 ms**;
a redraw while the player walks, which only writes the newly revealed cells, takes **under 25 ms**; with the
finished sheet on screen a frame costs **under 16 ms** (vsync off). Rebuilds happen at most every
`refresh_interval` seconds (0.2 by default), only when the journey changed, and never while the map is hidden (it catches
up the moment it is shown), so a map in a closed pause menu does not redraw.
Redraw in GDScript is the expensive part: for a large world, open the map on demand rather than keeping a full-screen
sheet redrawing during play, or use a small FOLLOW minimap.

## The 48 styles

### Survey (12, drawn over the island sample)

- `explorers_parchment`: pen hatching on stained parchment, ripple coasts, a red dashed route
- `royal_atlas`: watercolour washes, painted mountains, a graduated checker border, a fleur-de-lis rose
- `field_notebook`: pencil on a ruled notebook page, zoomed to the walk, a north arrow
- `woodcut`: black engraved sea lines, bold carved mountains, a white land
- `sepia_engraving`: stippled land, eight ripple lines, rope border, all in sepia
- `topographic`: contour lines every rise, a graticule, a modern compass ring
- `watercolour_journal`: loose pastel washes with pooled edges, no outlines, a travel-journal page
- `treasure_map`: burnt edges, dark aged paper, a dashed trail to a red cross
- `pilgrims_way`: illuminated vellum, a gilded border, a red road of arrows
- `charcoal_rubbing`: chalk and charcoal on black paper, smudged coasts
- `hasty_copy`: ochre land blocked in fast, folded twice, a wandering ink line
- `relief_atlas`: hill-shaded relief in hypsometric greens and browns, a deep blue sea

### Sea charts (12, drawn over the island sample)

- `admiralty_chart`: soundings, a blue shallows band, buff land, a plan title block
- `portolan`: rhumb lines radiating from five points across bare vellum seas, a wind rose
- `pirate_chart`: a dark teal sea with a serpent in it, singed corners, a ship
- `night_navigator`: pale cyan coasts on a navy sheet, lantern-gold route
- `whalers_log`: grey-blue paper, engraved swell lines, a whaler's loose hand, zoomed to the strait
- `coastal_pilot`: ten ripple lines hugging every coast, dense hatching, a pilot's close view
- `arctic_chart`: snow-white land, pale ice-blue sea, dark blue coasts and frost hatching
- `tropic_isles`: turquoise shallows falling to deep navy, green islands, sand rings
- `storm_chart`: slate sheet, dark land, white wave marks, red route of warnings
- `bathymetric`: five depth bands from cyan to midnight, a bare white land
- `merchant_ledger`: cream land ruled onto a dark green ledger, a double-ruled trade road
- `ghost_sea`: drowned-green mist, glowing coasts, a spectral glow over the sheet

### Dungeon plans (12, drawn over the dungeon sample)

- `graph_paper`: old school blue graph paper, hatched rock around every room
- `blueprint`: white on blueprint blue, stone walls, a plan title block
- `cave_survey`: stippled tan floors, crosshatched rock, a caver's footprints
- `castle_plan`: solid black walls (poche) on cream, an architect's plan
- `mine_survey`: brown survey paper, timbered stone, a grid of shafts
- `crypt`: bone-white floors on black, hatched in bone, a skull at the end
- `sewer_plan`: murky green plan, glowing sludge, brick walls
- `arcane_vault`: violet floors on deep purple, glowing walls, a rune-bright glow
- `ruin_rubbing`: a rubbing: charcoal-dark floors on pale paper, crosshatched rock, chalk route
- `lava_depths`: black rock, a lava pool where the water was, ember-red walls
- `ice_cavern`: white floors, solid ice-blue walls, a frozen pool
- `pixel_dungeon`: 8-bit dungeon: grey floors, brick walls, pixel lettering

### Arcane and modern (12, drawn over the island sample)

- `star_chart`: constellation lines from place to place on a starry night sheet
- `holo_scan`: a cyan hologram: filled land, dot grid, scanlines
- `terminal_green`: phosphor-green contour lines on black, a CRT scanline finish
- `neon_grid`: synthwave: a magenta grid, cyan coasts, glowing everything
- `dreamscape`: pastel washes on blush paper, soft edges, a sun rose
- `infernal`: black-red land cracked with fire, a molten sea
- `fae_glade`: luminous greens and gold under drifting cloud, close in on the wood
- `pixel_overworld`: 8-bit overworld: pixel symbols, pixel lettering, a pixelated sheet
- `crayon`: a child's crayon map: thick wobbly coasts, bright flat colour, close in
- `stained_glass`: jewel-toned panes set in black lead lines
- `recon`: olive-drab military sheet, lettered map squares, contour relief
- `cyber_wire`: magenta wireframe coasts over a cyan dot field, nothing filled

## Every style parameter

Each style is a `CartographyStyle` resource; these are its properties, in inspector order.

**Paper**

- `paper_mode` (default `1`, range 0..7): 0 plain, 1 parchment (stains + fibres), 2 graph paper, 3 blueprint, 4 ruled notebook, 5 night sky, 6 terminal, 7 felt / board
- `paper_color` (default `Color("e9dcbc")`): see the inspector.
- `paper_color2` (default `Color("b89d6a")`): Stains, grid lines, stars or scanlines, depending on the paper.
- `grain` (default `0.35`, range 0.0..1.0): see the inspector.
- `stains` (default `0.4`, range 0.0..1.0): see the inspector.
- `vignette` (default `0.35`, range 0.0..1.0): see the inspector.
- `creases` (default `0`, range 0..4): Fold creases across the sheet (0 = flat).
- `burnt_edge` (default `0.0`, range 0.0..1.0): Charred, torn edge of the sheet (0 = clean cut).

**Land**

- `land_mode` (default `1`, range 0..6): 0 flat fill, 1 hatching, 2 stipple, 3 watercolour wash, 4 outline only, 5 contour lines, 6 hill shade
- `land_color` (default `Color("e2cf9f")`): see the inspector.
- `land_ink` (default `Color("6b4a2b")`): Hatching, stipple and contour ink.
- `hatch_spacing` (default `6.0`, range 2.0..24.0): see the inspector.
- `hatch_angle` (default `45.0`, range -180.0..180.0): see the inspector.
- `terrain_lines` (default `0.0`, range 0.0..4.0): Ink lines (px) where forest, hills, sand and snow meet (0 = none; stained glass leads, crayon outlines).
- `forest_color` (default `Color("7d8a4a")`): see the inspector.
- `mountain_color` (default `Color("9a7a52")`): see the inspector.
- `sand_color` (default `Color("e8d29a")`): see the inspector.
- `snow_color` (default `Color("f6f4ee")`): see the inspector.

**Water**

- `sea_mode` (default `1`, range 0..6): 0 flat, 1 ripple lines along the coast, 2 engraved horizontal lines, 3 wash (deepens offshore), 4 none (paper), 5 depth bands, 6 wave marks
- `water_color` (default `Color("c9cfb0")`): see the inspector.
- `deep_color` (default `Color("a8b49a")`): see the inspector.
- `ripple_count` (default `4`, range 0..12): see the inspector.
- `ripple_spacing` (default `0.08`, range 0.02..0.3): see the inspector.

**Coast and walls**

- `coast_width` (default `1.6`, range 0.0..6.0): see the inspector.
- `coast_color` (default `Color("4a3322")`): see the inspector.
- `coast_halo` (default `0.3`, range 0.0..1.0): A soft shadow (or glow) hugging the coast on the water side.
- `wall_mode` (default `1`, range 0..4): Interior walls: 0 solid fill, 1 hatched, 2 crosshatched rock, 3 outline only, 4 stone blocks
- `wall_color` (default `Color("3a2a1c")`): see the inspector.

**Unexplored**

- `fog_mode` (default `0`, range 0..4): 0 blank paper, 1 hatched, 2 dark fog, 3 drifting cloud, 4 grid only
- `fog_color` (default `Color("d8c9a4")`): see the inspector.
- `edge_mode` (default `1`, range 0..3): 0 soft fade, 1 ragged ink, 2 torn line, 3 glowing rim
- `edge_width` (default `0.5`, range 0.0..1.0): see the inspector.

**Grid**

- `grid_mode` (default `0`, range 0..4): 0 none, 1 cell grid, 2 lat/long graticule, 3 dot grid, 4 lettered map squares
- `grid_color` (default `Color(0.4, 0.3, 0.2, 0.25)`): see the inspector.
- `grid_every` (default `8`, range 1..64): see the inspector.
- `rhumb_lines` (default `0`, range 0..32): Rhumb lines radiating from compass points across the sea (portolan charts).
- `rhumb_color` (default `Color(0.55, 0.2, 0.15, 0.5)`): see the inspector.

**Symbols**

- `glyph_mode` (default `1`, range 0..6): 0 none, 1 pen sketch, 2 bold woodcut, 3 painted, 4 pixel, 5 plan symbols, 6 neon
- `glyph_color` (default `Color("4a3322")`): see the inspector.
- `glyph_density` (default `1.0`, range 0.0..2.0): see the inspector.
- `glyph_size` (default `1.0`, range 0.5..2.5): see the inspector.
- `soundings` (default `false`): Depth soundings (small numbers) scattered over open water.
- `sea_creature` (default `false`): A sea creature drawn in open water.

**Route**

- `route_mode` (default `1`, range 0..8): 0 hidden, 1 dashed, 2 dotted, 3 solid with arrows, 4 footprints, 5 double line, 6 glowing, 7 pixel steps, 8 constellation (straight lines from place to place, a star on each)
- `route_color` (default `Color("a3322a")`): see the inspector.
- `route_width` (default `2.6`, range 0.5..6.0): see the inspector.
- `marker_mode` (default `0`, range 0..5): Where the player is now: 0 cross, 1 ship, 2 figure, 3 flag, 4 pin, 5 radar blip
- `marker_color` (default `Color("a3322a")`): see the inspector.

**Places and lettering**

- `place_mode` (default `0`, range 0..4): 0 pen icons, 1 dots, 2 painted icons, 3 pixel icons, 4 neon icons
- `label_color` (default `Color("3a2618")`): see the inspector.
- `font_mode` (default `0`, range 0..4): 0 engraved capitals, 1 italic hand, 2 stencil, 3 pixel, 4 brush
- `label_size` (default `9.0`, range 6.0..20.0): see the inspector.
- `label_halo` (default `true`): A light halo behind letters so they read over hatching.

**Compass, frame, title**

- `compass_mode` (default `3`, range 0..8): 0 none, 1 north arrow, 2 four-point star, 3 sixteen-point rose, 4 rose with fleur-de-lis, 5 sun rose, 6 modern ring, 7 pixel, 8 radar sweep
- `compass_corner` (default `3`, range 0..3): 0 top left, 1 top right, 2 bottom left, 3 bottom right
- `compass_size` (default `1.0`, range 0.5..2.5): see the inspector.
- `compass_color` (default `Color("4a3322")`): see the inspector.
- `compass_accent` (default `Color("a3322a")`): see the inspector.
- `frame_mode` (default `2`, range 0..9): 0 none, 1 single rule, 2 double rule, 3 graduated checker band, 4 rope, 5 corner flourishes, 6 terminal brackets, 7 plan title block, 8 gilded, 9 pixel
- `frame_color` (default `Color("4a3322")`): see the inspector.
- `frame_width` (default `0.5`, range 0.0..1.0): see the inspector.
- `margin` (default `0.05`, range 0.0..0.2): Space between the sheet edge and the map, as a fraction of the shorter side.
- `cartouche_mode` (default `2`, range 0..6): 0 none, 1 framed box, 2 scroll banner, 3 ribbon, 4 terminal header, 5 plan block, 6 plain title
- `cartouche_corner` (default `0`, range 0..4): 0 top left, 1 top right, 2 bottom left, 3 bottom right, 4 top centre
- `title_color` (default `Color("3a2618")`): see the inspector.
- `scale_bar` (default `true`): see the inspector.

**Finish**

- `finish_mode` (default `0`, range 0..3): 0 none, 1 pixelate, 2 scanlines, 3 bloom-ish glow
- `finish_amount` (default `0.5`, range 0.0..1.0): see the inspector.
- `wobble` (default `0.3`, range 0.0..1.0): Hand-drawn wobble on every ink line.
- `zoom_cells` (default `0.0`, range 0.0..400.0): How many cells of the journey fit across the sheet (0 = fit everything explored).
- `seed` (default `1`): see the inspector.

## The demo

Open `godot/` as a project and press Play. An explorer walks the island and the map fills in. **Left / Right:** style ·
**Tab:** island / dungeon · **W A S D:** walk the explorer yourself · **Space:** pause · **R:** set out again ·
**E:** export the map as a PNG (the path is shown on screen).

## Renderers

Every style was rendered and photographed under Forward+ and Compatibility with zero shader or script errors. The
optional finishes (`finish_mode` pixelate, scanlines, glow) read the screen texture, which both renderers support.

## Licence and AI

See `LICENSE.txt`: use the maps in any number of games, commercial or free; do not resell or redistribute the files as a
pack. This pack is AI-generated (every shader and script was written by an AI); the store page says so.
Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
