# Kickup: 48 Surface Aware Movement Dust Presets for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Kickup: 48 Surface Aware Movement Dust Presets for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Kickup - 48 Surface-Aware 2D Movement Dust Presets for Godot 4

Movement dust that reads the ground under the feet. Footstep puffs, run trails, landing throws, skid sprays, dash bursts
and wall-slide streams on eight surfaces: dirt, grass, sand, snow, mud, shallow water, stone and wood. Each surface throws
its own shapes with its own physics (clods, tumbling blades, settling grains, drifting flakes, clinging splats, a splash
crown with ripple rings, bouncing grit and sparks, spinning splinters). Every particle is simulated and drawn at runtime
by GDScript `_draw()`; no textures or frame sheets ship.

- **Godot 4.7** (built and tested on 4.7.2 stable). Older 4.x versions were NOT run.
- **Both renderers**: every preset was rendered and checked under **Forward+** and **Compatibility** (the web / low-end
  renderer). It uses no shader at all, only 2D draw calls, so it does not depend on the renderer.
- Side view (platformers) and top-down view, and a pixel mode that snaps every particle to your pixel grid.
- Pure GDScript, plain text, no plugin to enable, no GDExtension.

## Install

1. Copy the folder `godot/addons/kickup/` into your project's `addons/` folder (so you have `res://addons/kickup/`).
2. That is all: there is no plugin to enable. The classes `Kickup2D`, `KickupEffect`, `KickupCatalog` and
   `KickupSurfaceZone` are available everywhere.

To see everything first, open the `godot/` folder itself as a project in Godot 4.7 and press Play (the demo scene).

## The fast way: Kickup2D on your character

1. Add a **Kickup2D** node as a child of your `CharacterBody2D` and place it at the feet.
2. Give your TileMapLayer's TileSet a **custom data layer** named `surface` (type String) and type a surface name on each
   ground tile: `dirt`, `grass`, `sand`, `snow`, `mud`, `water`, `stone` or `wood`.
3. Play. In **auto** mode Kickup2D watches the body every physics frame and fires:
   - `step` / `run` every `step_distance` / `run_distance` px travelled on the floor (run at or above `run_speed`)
   - `land` when the body touches the floor falling faster than `land_min_fall_speed`
   - `skid` when it reverses direction, or brakes harder than `skid_decel` px/s², above `skid_min_speed`
   - `dash` when its speed jumps by more than `dash_speed_jump` in one frame
   - `wall_slide` while it is on a wall, off the floor, sliding down (every `wall_slide_interval` s)

The surface comes from, in this order: a **KickupSurfaceZone** (an Area2D) under the feet, the highest `zone_priority`
winning; then the tile under the feet on any TileMapLayer whose TileSet has the `surface` data layer (leave `tile_layers`
empty and Kickup2D finds them, or list them yourself); then `default_surface`. A surface name the pack does not carry falls
back to `default_surface`.

For footstep sounds, connect the signal `surface_kicked(surface: String, move: String)`: it fires on every kick, with the
same ground the dust used.

Manual mode: set `auto` off and call `kick("land")`, `kick("dash", "snow")` or `kick("skid", "", -1.0)` (move, surface,
facing) yourself. It returns the KickupEffect it added.

### Kickup2D properties

| property | default | what it does |
| --- | --- | --- |
| `auto` | true | watch the parent CharacterBody2D and fire moves by itself |
| `view` | SIDE | SIDE for platformers; TOP_DOWN for top-down games (no land or wall slide there; a skid is a sharp turn or a hard brake) |
| `tile_layers` | empty | the TileMapLayers to read; empty = every TileMapLayer in the scene whose TileSet has the data layer |
| `surface_data_layer` | "surface" | the custom data layer's name |
| `default_surface` | "dirt" | used where no zone or tile says otherwise |
| `probe_depth` | 4.0 | how far below the feet the tile is sampled (px) |
| `wall_probe` | 32.0 | during a wall slide, how far towards the wall its surface is looked for (px): a slide reads the WALL |
| `step_distance` | 40.0 | px walked between two step kicks |
| `run_distance` | 96.0 | px run between two run trails |
| `run_speed` | 230.0 | at or above this speed a footfall is a run trail |
| `land_min_fall_speed` | 260.0 | a softer touch-down makes no landing dust |
| `skid_min_speed` | 170.0 | below this speed no skid |
| `skid_decel` | 1100.0 | braking harder than this (px/s²) is a skid |
| `dash_speed_jump` | 260.0 | a one-frame speed jump bigger than this is a dash |
| `wall_slide_interval` | 0.14 | seconds between wall-slide kicks |
| `cooldown` | 0.12 | minimum seconds between kicks |
| `effect_scale` | 2.0 | size of every effect (1.0 suits a character about 48 px tall) |
| `amount` | 1.0 | multiplies every particle count |
| `pixel_mode` | false | snap every particle to a pixel grid with hard edges |
| `pixel_size` | 2 | that grid, in px |
| `overrides` | {} | surface id -> a KickupEffect scene of your own (your recoloured snow, say) |
| `effects_parent` | null | where effects are added; default the body's parent, so dust stays where it was kicked |

## The presets

48 presets = 8 surfaces x 6 moves, each a scene at `res://addons/kickup/presets/<surface>/<surface>_<move>.tscn`, ids
`<surface>_<move>`:

| surface | what it throws | Step | Run | Land | Skid | Dash | Wall Slide |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dirt | clods and a brown dust bloom | `dirt_step` | `dirt_run` | `dirt_land` | `dirt_skid` | `dirt_dash` | `dirt_wall_slide` |
| Grass | cut blades that tumble and flutter, seed specks, a faint bloom | `grass_step` | `grass_run` | `grass_land` | `grass_skid` | `grass_dash` | `grass_wall_slide` |
| Sand | a fan of fine grains that settle, a low flat haze | `sand_step` | `sand_run` | `sand_land` | `sand_skid` | `sand_dash` | `sand_wall_slide` |
| Snow | a big bright puff, slow drifting flakes, twinkling glints | `snow_step` | `snow_run` | `snow_land` | `snow_skid` | `snow_dash` | `snow_wall_slide` |
| Mud | heavy splats that flatten where they land and cling, droplets, a wet smear, no dust | `mud_step` | `mud_run` | `mud_land` | `mud_skid` | `mud_dash` | `mud_wall_slide` |
| Shallow Water | a splash crown of droplets, ripple rings on the surface, a little mist | `water_step` | `water_run` | `water_land` | `water_skid` | `water_dash` | `water_wall_slide` |
| Stone | grit that bounces once, sparks on hard moves, a grey puff | `stone_step` | `stone_run` | `stone_land` | `stone_skid` | `stone_dash` | `stone_wall_slide` |
| Wood | spinning splinters, chips and a rising fine dust | `wood_step` | `wood_run` | `wood_land` | `wood_skid` | `wood_dash` | `wood_wall_slide` |

The moves: **step** one footfall, debris thrown back and a low bloom at the heel · **run** a trail of four kicks left behind
a running body · **land** debris and dust thrown out both ways, flat and wide · **skid** a low spray ploughed forward over a
short skid path · **dash** a hard burst thrown back, dust and speed streaks behind · **wall slide** a stream peeling off a
wall while sliding down it (the wall is on the facing side).

From code:

```gdscript
var fx := KickupCatalog.instantiate("sand_skid")   # one-shot: frees itself when done
fx.position = feet_position
fx.facing = -1.0                                   # moving left
add_child(fx)
```

`KickupCatalog.ids_for_surface("snow")` and `KickupCatalog.ids_for_move("land")` list ids.

### KickupEffect properties (every preset)

| property | what it does |
| --- | --- |
| `move` | STEP, RUN, LAND, SKID, DASH, WALL_SLIDE |
| `surface` | DIRT, GRASS, SAND, SNOW, MUD, WATER, STONE, WOOD (the shapes and physics) |
| `view` | SIDE or TOP_DOWN |
| `facing` | +1 moving right, -1 moving left (side view) |
| `direction` | top-down only: the direction of travel on screen |
| `light_color`, `mid_color`, `dark_color`, `accent_color` | the recolour (`apply_surface_colours()` restores a surface's defaults) |
| `amount` | multiplies every particle count |
| `effect_scale` | size of the effect (presets ship at 2.0) |
| `lifetime` | multiplies how long every particle lives |
| `gravity` | multiplies the fall of debris (0 floats) |
| `wind` | sideways drift in px/s on light particles (dust, blades, flakes, glints) |
| `pixel_mode`, `pixel_size` | hard-edged pixel particles on a grid |
| `burst_seed` | same seed, same burst |
| `autoplay`, `free_when_done`, `looping` | playback |

Methods: `play()` restarts the burst, `seek(t)` holds it at `t` seconds, `preset_id()` returns `"<surface>_<move>"`.
The node's origin is the foot contact point on the ground. A recolour is a parameter; a surface is a different grammar.

## Cost

Each effect is one Node2D drawing its own particles (14 to 68 of them at `amount` 1) for about a second, then freeing
itself. In the
breakit test 50 bursts looping at once on one 1280x720 screen (all 48 presets mixed, vsync off; an extreme load, a running
character makes one to three at a time) averaged under 25 ms per frame on both renderers, no single frame over 100 ms,
on the test machine's integrated AMD GPU with other work running on the machine; timings vary by machine, load and run,
and the cost is the GDScript that moves the particles, so it scales with how many bursts are alive at once.

## The demo

`godot/demo/demo.tscn` (Tab or 1 / 2 / 3 to switch pages): **1** all 48 presets looping on their own ground, **2** a
side-view runner on a TileMapLayer with the `surface` data layer, Kickup2D in auto mode (arrows move, Space jumps, Shift
dashes; it runs itself when left alone), **3** the same node in top-down view on eight ground patches. **P** switches
every effect to pixel mode and back. The demo's ground tiles are painted by code at start.

## Licence and AI disclosure

See `LICENSE.txt`: use it in any number of your games, commercial or free; do not redistribute the files as a pack. Every
scene and script here was written by an AI, and everything you see is computed at runtime by that code.

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
