# Tidewater: 48 2D Water Shaders for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Tidewater: 48 2D Water Shaders for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Tidewater - 48 2D Water Shaders for Godot 4

48 water presets for 2D games, every one computed while the game runs: top-down lakes, seas, rivers, swamps and lava
whose depth and surf follow the outline YOU draw; side-on pools for platformers that bend what is behind them, mirror
what is above them and ripple where things land in them; waterfalls, cascades, drips and fountains; and full-screen
underwater filters that can fade in by themselves as your camera goes below the surface. Nothing is a frame sheet or a
painted texture: each preset is a canvas_item shader plus a small node that drives it, and every colour is a parameter.

- **Godot version:** built and tested on **Godot 4.7.2**, under **both renderers: Forward+ and Compatibility**
  (Compatibility is the one web exports use). Older 4.x versions were NOT run, so they are not claimed.
- **What is in the box:** 48 preset scenes over four shaders (`surface`, `side`, `fall`, `dive`), a palette resource
  per preset, four nodes (`TidewaterBody`, `TidewaterSide`, `TidewaterFall`, `TidewaterLayer`), the `TidewaterCatalog`
  class, the `TidewaterPalette` resource and a demo.

## Install

1. Copy `godot/addons/tidewater/` into your project's `addons/` folder (you get `res://addons/tidewater/`).
2. That is all: no plugin to enable. The classes register themselves.

To browse everything first, open the `godot/` folder as a project in Godot 4.7 and press Play.

## Use it

Instance a preset scene from `res://addons/tidewater/presets/<family>/<id>.tscn` into your level, or in code:

```gdscript
# top-down: a lake whose surf follows the outline you give it
var lake := TidewaterCatalog.instantiate("lagoon") as TidewaterBody
lake.polygon = PackedVector2Array([Vector2(0, 0), Vector2(420, -30), Vector2(460, 200), Vector2(30, 240)])
add_child(lake)

# ...or fill the water tiles you already painted (put them on their own TileMapLayer)
lake.tile_mask = $WaterTiles

# side-on: a pool the player can splash
var pool := TidewaterCatalog.instantiate("clear_pool") as TidewaterSide
pool.position = Vector2(640, 400)      # the middle of the still surface
pool.size = Vector2(800, 220)
add_child(pool)
pool.splash(player.global_position.x, 1.0)
crate.global_position.y = pool.get_surface_y(crate.global_position.x)

# a waterfall: origin = the centre of the falling water
var fall := TidewaterCatalog.instantiate("waterfall") as TidewaterFall
fall.size = Vector2(110, 320)
add_child(fall)

# underwater: fades in as the camera goes below the pool's surface
var dive := TidewaterCatalog.instantiate("deep_dive") as TidewaterLayer
dive.surface = pool
add_child(dive)
```

### The four nodes

| node (extends) | what it draws | members |
| --- | --- | --- |
| `TidewaterBody` (`Polygon2D`) | top-down water inside its polygon, or inside the used cells of `tile_mask` | exports `palette`, `speed_scale`, `intensity`, `pattern_scale`, `foam_width`, `depth`, `flow`, `tile_mask`, `mask_check_interval`, `bake_texel`, `preview_time`; the inspector button **Bake shoreline**; `bake()`, `shore_distance(local_point)`, `is_water(local_point)`, `seek(seconds)`, `play()`, `seek_preview()`, static `default_shape(half, points, wobble)`; signal `baked` |
| `TidewaterSide` (`Node2D`) | side-on water: `size` below its origin, waves and effects in `headroom` above it | exports `palette`, `size`, `headroom`, `speed_scale`, `intensity`, `pattern_scale`, `wave_height`, `wave_length`, `wave_speed`, `refraction`, `reflection`, `reflection_depth`, `clarity`, `stiffness`, `damping`, `spread`, `preview_time`, `preview_splash`; `splash(global_x, strength)`, `get_surface_y(global_x)`, `is_underwater(global_point)`, `calm()`, `seek(seconds)`, `play()`, `seek_preview()`; signal `splashed(global_x, strength)` |
| `TidewaterFall` (`Node2D`) | falling water centred on its origin, `size` wide and tall, with the splash, pool and mist past its foot | exports `palette`, `size`, `fall_speed`, `basin`, `speed_scale`, `intensity`, `pattern_scale`, `preview_time`; `get_draw_rect()`, `seek(seconds)`, `play()`, `seek_preview()` |
| `TidewaterLayer` (`Node2D` + `CanvasLayer`) | a full-screen filter over everything on lower canvas layers | exports `palette`, `amount`, `speed_scale`, `intensity`, `pattern_scale`, `wobble`, `layer`, `surface`, `blend_px`, `preview_time`; `fade_in(seconds)`, `fade_out(seconds)`, `seek(seconds)`, `play()`, `seek_preview()`; signal `faded_out` |

`TidewaterCatalog`: `PRESETS` (id, name, family, path), `FAMILIES`, `path_of(id)`, `instantiate(id)`,
`ids_for_family(family)`. `TidewaterPalette`: `deep`, `shallow`, `foam`, `glow` and `apply_to(material_rid)`.

### Recolour and tune

Every node takes a `palette` (a `TidewaterPalette`: deep, shallow, foam and glow colours). Each preset ships with its
own palette in `res://addons/tidewater/palettes/<id>.tres`; make a new one, or edit the colours on the preset's
material. A recolour is a parameter you move; it is never counted as a preset.

Shader parameters on every material: `kind` (which of the shader's twelve presets this is), `seed`, `deep`, `shallow`,
`foam`, `glow`, `intensity`, `pattern_scale`, `pixel_size` (0 = smooth; above 0 snaps every pattern to blocks of that many
pixels, for pixel art), and `tw_time` (driven by the node). Plus, per shader:

| shader | extra parameters |
| --- | --- |
| `surface` | `foam_width`, `depth_px`, `flow`, `opacity`; `shore_sdf`, `sdf_origin`, `sdf_size`, `sdf_reach` (baked by the node) |
| `side` | `size`, `headroom`, `wave_height`, `wave_length`, `wave_speed`, `refraction`, `reflection`, `reflection_depth`, `clarity`, `springs`, `spring_count` |
| `fall` | `size`, `fall_speed`, `basin` |
| `dive` | `amount`, `wobble`, `view_size` |

The node pushes its exports into these every frame it changes them, so set the export on the node rather than the
shader parameter when the node has one.

## The 48 presets

Ids, by family (scene: `res://addons/tidewater/presets/<family>/<id>.tscn`):

- **surface** (top-down, `TidewaterBody`): `lake`, `open_sea`, `lagoon`, `river`, `sewer`, `lava`, `swamp`, `frozen_pond`,
  `pixel_sea`, `moonlit_bay`, `toxic_pool`, `hot_spring`.
- **side** (side-on, `TidewaterSide`): `clear_pool`, `ocean_swell`, `murky_canal`, `lava_flow`, `mirror_lake`, `acid_vat`,
  `cave_water`, `mud_bog`, `pixel_water`, `arctic_water`, `sunset_sea`, `poison_marsh`.
- **fall** (waterfalls and flows, `TidewaterFall`): `waterfall`, `thin_cascade`, `lavafall`, `sewer_outflow`,
  `frozen_fall`, `mana_fall`, `mist_veil`, `drip_ledge`, `fountain_jet`, `rapids_chute`, `pixel_fall`, `slime_fall`.
- **dive** (full-screen, `TidewaterLayer`): `shallow_dive`, `deep_dive`, `abyss`, `murky_dive`, `caustic_floor`,
  `sun_shafts`, `bubble_stream`, `kelp_shadow`, `under_ice`, `low_air`, `wet_lens`, `toxic_dive`.

## Good to know

- **The shoreline is baked, not guessed.** A `TidewaterBody` turns its polygon (or its `tile_mask` cells) into a small
  distance field when it is created and whenever the polygon changes; `foam_width` and `depth` are measured in pixels from
  that edge. After you paint or erase water tiles at runtime, the body notices within `mask_check_interval` seconds (0.25
  by default) and rebakes; in Godot 4.7 a TileMapLayer's `changed` signal does not fire for cell edits, so the body
  watches the cells themselves. Call `bake()` for an immediate rebake, or press **Bake shoreline** in the inspector. `bake_texel` sets the field's resolution (4 px by default; the
  field is capped at 256 x 256 samples).
- **Side-on water and the filters read the screen.** Put a `TidewaterSide` AFTER the scenery it should refract and
  reflect (later in the scene tree, or a higher `z_index`). A `TidewaterLayer` sits on its own `CanvasLayer` (layer 4 by
  default, under a UI on layer 5 or above) and carries a `BackBufferCopy`, so it sees everything drawn below it,
  side-on water included.
- **`reflection`** mirrors what is drawn above the waterline into the water, strongest at the surface and fading over
  `reflection_depth` pixels (36 for most presets; `mirror_lake` uses 320 so whole hills mirror). It reads the current
  screen, so it mirrors what the camera sees.
- **Origins:** a `TidewaterBody` draws its polygon where you put it; a `TidewaterSide` has its origin at the middle of the
  still surface; a `TidewaterFall` is centred on its origin (its top edge is the lip); a `TidewaterLayer` covers the
  viewport wherever it is.
- **`get_surface_y()`** returns the swell plus splash ripples, not the shader's fine noise ripple (a pixel or so), which is
  close enough to float a crate or a boat.
- **Pixel art:** `pixel_sea`, `pixel_water` and `pixel_fall` ship with `pixel_size` 4. Any other preset takes `pixel_size`
  too.
- **Animation:** every node animates on its own; `seek(seconds)` freezes it on a moment (for screenshots) and `play()`
  resumes. `speed_scale` slows or speeds it.

## Demo controls

Left / Right preset · 1-4 family (top-down, side-on, falls, underwater) · on the side-on page: click or Space to splash,
V to dive the camera through the surface and back.

## Licence and AI disclosure

See `LICENSE.txt`. Use in any number of your games, commercial or free; no resale or redistribution of the files as a
pack. This pack is AI-generated: the shaders, scenes, scripts and the demo were written by an AI, and every water effect
is computed at runtime by that code.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
