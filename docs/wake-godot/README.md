# Wake for Godot 4: 48 Wakes, Splashes and Rain Rings on Your Own Water Tiles — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Wake for Godot 4: 48 Wakes, Splashes and Rain Rings on Your Own Water Tiles  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-21


---

# Wake for Godot 4

**48 water wake styles that answer bodies, boats, splashes and rain on your own TileMapLayers, for Godot 4.7.**
Version 1.0.0 · Core Systems Asset Factory

Wake makes the water of your own map answer what moves in it. A character wading leaves rings that spread and overlap into
a trail; a swimmer leaves a narrower one; a boat faster than the rings leaves a V; something dropped in throws up a crown
of drops and a foam ring; rain covers the surface in small rings; a float bobs in its own slow rings. Rings stop at the
shoreline your tiles draw and break into foam there. Nothing is an image: every ring is computed at runtime by one shader
from a list of events, and the look comes from a style resource you can edit. 48 styles ship, each built
differently (its own ring shape, motion and light), never recoloured.

Wake reads your water the same way Foreshore (shoreline foam and tide) reads it, and its rings sit on top of Creel's
fishing floats as well as anything else; the three are the parts of the Undertow volume, and each works alone.

## Install

1. Copy `addons/wake/` into your project's `addons/` folder. There is no plugin to enable.
2. Add a **Wake2D** node as a sibling of your TileMapLayers, AFTER them in the scene tree (or give it a higher `z_index`),
   so it draws over them.
3. Set its `style` to one of the files in `addons/wake/styles/` (or a copy you edited).
4. Give anything that moves through water a **WakeBody2D** child (a player, an NPC, a boat, a float). It finds the first
   Wake2D in the scene by itself, or point its `wake_path` at one.

With `layers` empty, Wake2D reads every TileMapLayer that is its sibling; to choose, list them in `layers`. Keep the Wake2D
node unrotated and unscaled (scale the map's parent instead). Open `demo/demo.tscn` and press F5 to see every style; every
scene in `demo/presets/` is one style in its own scene (F6).

## How it reads your map

Every piece of the map (`sub_cells` x `sub_cells` pieces per cell, 4 by default) is water or land. Per tile, in this order:

1. **A custom data layer** named `foreshore_surface` (or `wake_surface`), type String, on your TileSet: `liquid` is water;
   `shore`, `hard` are land; `edge` and `edge_hard` split a tile pixel by pixel against the colours of your tiles tagged
   `liquid` and `shore`; `ignore` skips it. This is the only way to make a lava, bog or acid tile count as water.
2. **The layer's node name**: `water`, `sea`, `ocean`, `lake`, `river`, `pond`, `lava`, `magma`, `bog`, `swamp`, `acid`,
   `liquid` make it water wherever it has pixels; `rock`, `cliff`, `quay`, `pier`, `dock`, `jetty`, `wall`, `stone`, `sand`,
   `beach`, `shore`, `ground`, `grass`, `land`, `mud`, `floor` make it land; `prop`, `decor`, `object`, `overlay`,
   `shadow` are ignored.
3. **Each pixel's colour** on a layer with neither: blue-dominant pixels are water.

Later layers win where they have an opaque pixel. Set `show_water_map` to see what it read (red is the distance to the
shore). After you change tiles at runtime, call `rebuild_water_map()`. `add_water_rect(rect, "liquid")` marks a fountain
basin or a trough that has no tile.

## Wake2D

| property | what it does |
| --- | --- |
| `style` | the look (a WakeStyle). `set_style(next, seconds)` cross-fades to another. |
| `layers` | the TileMapLayers to read (empty = every TileMapLayer sibling). |
| `sub_cells` | pieces per cell the water map is read at, 1 to 8 (4 follows an autotile's drawn edge). |
| `intensity` | overall strength, 0 to 2. |
| `speed` | time multiplier for every ring (0 = frozen). |
| `rain` | drops a second on every 100 x 100 px of water (0 = dry); `rain_seed` changes where. |
| `playing` | pause every ring. |
| `show_water_map` | draw what the reader found instead of the rings. |

| method | what it does |
| --- | --- |
| `ripple(world_pos, strength = 1, size = 1)` | rings spreading from a point; returns false (and draws nothing) off the water. |
| `splash(world_pos, strength = 1, size = 1)` | a crown of drops, a ring of foam and strong rings; emits `splashed`. |
| `drop(world_pos, size = 0.5)` | one small short ring, as a raindrop or a drip makes. |
| `churn(world_pos, strength = 1, size = 1)` | foam with no rings (behind a hull, an oar, a propeller). |
| `add_event(world_pos, kind, strength, size, ago)` | any of the four (`Wake2D.RING`, `SPLASH`, `DROP`, `CHURN`), born `ago` seconds in the past. |
| `is_water(world_pos)` / `depth_at(world_pos)` | water here? / distance to the nearest shore in cells (+ on water, - on land, -INF off the map). |
| `event_count()` / `clear()` | events alive now / remove them all. |
| `show_events(events, at)` / `resume()` | show a fixed list at a fixed clock (cut-scenes, screenshots) / back to running time. |

Wake2D keeps at most 128 events alive (`Wake2D.MAX_EVENTS`); when the list is full the oldest goes first. A drop lives
about two thirds of the style's `ring_life`, a ring the whole of it and a splash a third longer. One Wake2D draws one
water map with one shader in one draw call.

## WakeBody2D

| property | what it does |
| --- | --- |
| `wake_path` | the Wake2D to draw on (empty = the first Wake2D in the scene). |
| `size`, `strength` | how big and how strong its rings are (a duckling 0.5, a person 1, a boat 1.5). |
| `spacing` | pixels moved between two trail rings (a walker about one stride, 10 to 14). |
| `idle_interval` | seconds between rings while it stands still on water (0 = none). |
| `splash_on_enter` | a splash the frame it walks or falls into the water. |
| `churn` | foam behind it while it moves (oars, paddles, a propeller). |
| `bob`, `bob_period` | a float: rings on a bob cycle whether it moves or not. |
| `enabled` | leave no rings (a cut-scene, flying over water). |

Signals `entered_water(world_pos)` and `left_water(world_pos)`; `is_in_water()` answers now. A body faster than the
style's `ring_speed` leaves a V, a slower one a trail of rings.

## WakeStyle

Every value the shader uses is an exported property, grouped in the inspector: **Rings** (`ring_kind` smooth, toon, pixel,
ink, glow, stipple or double; `crest_color`, `trough_color` (the darker band behind each crest), `ring_width`,
`ring_count`, `ring_gap`, `ring_speed`, `ring_life`, `squash` (1 round for top-down, lower for a three-quarter view),
`wobble`, `dash`), **Foam and splash** (`foam_color`, `foam_amount`, `splash_color`, `splash_drops`, `splash_height`,
`shore_foam`), **Light** (`glint_color`, `glint`, `glow_color`, `glow`, `stir_color`, the tint of disturbed water) and
**Stylise** (`pixel_px`, `posterize`). Duplicate a style and move a slider to make your own.

## The 48 styles

### Wading (6)

people walking through water: shallows, a ford, a marsh, a sprint, standing still, icy water.

- `shallows_wade` **Shallows Wade**: Two people wading the shallows: soft rings trail each step and break into foam on the sand.
- `ford_crossing` **Ford Crossing**: Three walkers crossing a river: paired lines round every step.
- `marsh_wade` **Marsh Wade**: Slow, uneven rings through peat water, stirring up mud as they go.
- `sprint_splash` **Sprint Splash**: A runner through the shallows: a splash and a crown of drops at every stride.
- `standing_still` **Standing Still**: People standing waist deep: slow rings keep spreading round them and glinting.
- `cold_shallows` **Cold Shallows**: Wading icy water: short sharp rings and slush crunching up white round each step.

### Swimming (6)

swimmers and animals: breaststroke, front crawl, an otter, a duck family, a swan, a line of swimmers.

- `breaststroke` **Breaststroke**: Two swimmers: a trail of rings and a pair of kicks either side every stroke.
- `front_crawl` **Front Crawl**: A fast swimmer churning white water, a small splash at each arm.
- `otter_dash` **Otter Dash**: A small fast swimmer leaves a sharp narrow V.
- `duck_family` **Duck Family**: A duck and four ducklings in a line, every wake crossing the next.
- `swan_glide` **Swan Glide**: A swan gliding: a wide, slow, paired V on cold water.
- `synchro_swim` **Synchronised Swim**: Four swimmers in a line, kicking together: rows of tight bright rings.

### Boats (6)

hulls: a rowboat with its oars, a canoe, a sailing dinghy, a motor launch, a log raft, a harbour tug.

- `rowboat` **Rowboat**: A rowboat: its wake, and a ring at each oar either side every stroke.
- `canoe` **Canoe**: A canoe: a clean narrow wake and the paddle dipping side to side.
- `sailing_dinghy` **Sailing Dinghy**: A dinghy running before the wind: a long fine V of single lines.
- `motor_launch` **Motor Launch**: A motor launch at speed: a wide V with white water boiling behind.
- `log_raft` **Log Raft**: A raft drifting: broad slow rings, three deep, wobbling as the logs roll.
- `harbour_tug` **Harbour Tug**: A heavy tug: thick rings, deep troughs and a churned, paler track.

### Splashes (6)

things landing in water: a heavy drop, skipping stones, fish rising, frogs, diving birds, thrown pebbles.

- `cannonball` **Cannonball**: Something heavy dropped in three times: tall crowns, foam discs, big rings.
- `stone_skip` **Stone Skip**: Skipping stones: a splash, then rings at every hop, closer and smaller each time.
- `fish_rise` **Fish Rise**: Fish rising to feed: a leap, a small splash and a slow spread of rings.
- `frog_plop` **Frog Plop**: Frogs dropping in among the lily pads: green plops in a dark pool.
- `plunge_dive` **Plunge Dive**: Seabirds diving: narrow, very tall crowns and sharp rings.
- `thrown_pebbles` **Thrown Pebbles**: A handful of pebbles: small cold plops all over a lake.

### Rain (6)

water from above: drizzle, a downpour, hail, a cave drip, falling blossom, embers on lava.

- `drizzle` **Drizzle**: Light rain: fine single rings scattered over the water.
- `downpour` **Downpour**: Heavy rain: the whole surface crowded with rings, paler where they crowd.
- `hail` **Hail**: Hail on a lake: every stone throws up a small crown.
- `cave_drip` **Cave Drip**: Water dripping from above at a steady beat: sets of rings in step, bright on dark.
- `blossom_fall` **Blossom Fall**: Petals drifting down onto a stream, each landing in a pale ring.
- `ember_fall` **Ember Fall**: Embers falling on lava: each one lands in a glowing ring of cooler crust.

### Floats (6)

things that bob: fishing floats, buoys, lily pads, lanterns, barrels, autumn leaves.

- `fishing_float` **Fishing Float**: Three floats bobbing on a stream, each in its own slow set of rings.
- `harbour_buoys` **Harbour Buoys**: Buoys riding the swell: wide, widely spaced rings round each.
- `lily_pads` **Lily Pads**: Lily pads rocking on a still pool, faint green rings round each.
- `floating_lanterns` **Floating Lanterns**: Paper lanterns drifting at night, warm light caught in their rings.
- `drifting_barrels` **Drifting Barrels**: Barrels adrift, rolling as they go: uneven rings in a loose trail.
- `autumn_leaves` **Autumn Leaves**: Leaves riding the current, each trailing tiny rings.

### Stylised (6)

looks for a game's own style: pixel rings, a toon wake, ink rings, 8-bit rings, storybook outlines, a blueprint.

- `pixel_ripples` **Pixel Ripples**: Rings snapped to a 2 px grid in three flat levels, for pixel-art games.
- `toon_wake` **Toon Wake**: Flat cel-shaded rings with a hard dark band behind a cartoon boat.
- `ink_rings` **Ink Rings**: Rain drawn in broken brush-ink rings.
- `retro_8bit` **Retro 8-bit**: Chunky 4 px rings in two levels behind two swimmers, like an old console.
- `storybook` **Storybook**: Soft double outlines wobbling behind a line of storybook ducks.
- `blueprint` **Blueprint**: A boat drawn as a chart: thin cyan rings on a darkened track.

### Otherworldly (6)

lava, a bog, magic and the deep: wading lava, marsh gas, a mana pool, a ghost wake, glowing plankton, a sea serpent.

- `lava_wade` **Lava Wade**: Armoured walkers through lava: dark crust rings with the glow showing between them.
- `bog_bubbles` **Bog Bubbles**: Marsh gas bubbling up: wobbling green rings that glint as they burst.
- `mana_pool` **Mana Pool**: Three wells of light pulsing violet rings across the water.
- `ghost_wake` **Ghost Wake**: Spirits gliding over a lake: pale glowing wakes with no shadow.
- `plankton_glow` **Plankton Glow**: Night swimmers lighting the sea: every wake glows cyan.
- `sea_serpent` **Sea Serpent**: Something long under the surface: humps in a line, each pushing its own wake.

Each demo scene shows its style with the bodies that suit it (people, swimmers, boats, floats), drawn by the demo only.
In your game, your own sprites carry the WakeBody2D.

## Renderers and versions

Every style was run and photographed under **Forward+** and **Compatibility** (OpenGL 3, the web renderer) in Godot
**4.7.2**, with zero shader or script errors under either. Earlier Godot 4 versions were not run. The noise in the shader
is an integer hash, so a style draws the same under both renderers.

## Demo controls

Left / Right: previous / next style. Up / Down: previous / next family. Click on water: a splash. Hold the right mouse
button: wade through the water with the mouse (a WakeBody2D). R: rain on or off. M: show the water map. Space: pause.

## Licence

See LICENSE.txt: use it in any number of games, edit it freely; no resale or redistribution of the files as a pack;
no AI training. The demo tiles in `demo/fixture/` come from CSAF's own Verdant tilesets (see their NOTICE.txt).

This pack is AI-generated: the shader, every script, style and preset, and the demo were written by an AI.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
