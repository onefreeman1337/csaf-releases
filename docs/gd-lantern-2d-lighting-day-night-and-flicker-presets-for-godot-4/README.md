# Lantern: 48 2D Lighting and Day-Night Presets for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Lantern: 48 2D Lighting and Day-Night Presets for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Lantern - 2D Lighting, Day-Night and Flicker Presets for Godot 4

48 lighting presets for 2D games, every one computed while the game runs. Light that falls through a window in the shape
of its panes, a chapel arch, a rose window or leaded glass; blinds, bars, leaf dapple, a paper screen, a pierced tin
lantern, a door left ajar, a grate. Flames that live: a candle, a wall torch, a campfire throwing embers, a swinging oil
lantern, a forge, a street lamp, a neon sign that keeps failing, a fluorescent tube that will not start, a searchlight, a
spinning beacon, a wisp, a swarm of fireflies. Twelve skies, from pre-dawn to an aurora, that blend into a full day and
switch your lights on at dusk. And twelve kinds of darkness that follow the player.

Nothing is a frame sheet or a painted light texture. Each light shape is drawn into a texture by code when the game starts
(and cached), each flicker is a curve, each sky is a colour grade, each darkness is a shader; every colour, size and
speed is a parameter in the inspector.

- **Godot version:** built and tested on **Godot 4.7.2**, under **both renderers: Forward+ and Compatibility**
  (Compatibility is the one web exports use). Older 4.x versions were NOT run, so they are not claimed.
- **What is in the box:** 48 preset scenes (`presets/cookie`, `presets/flame`, `presets/sky`, `presets/shade`, twelve
  each), twelve sky looks (`presets/sky/looks/*.tres`), seven classes (`LanternLight`, `LanternCookie`, `LanternSource`,
  `LanternSky`, `LanternSkyLook`, `LanternClock`, `LanternShade`), `LanternCatalog`, `LanternUtil`, three shaders, and a
  demo town to try them in.

## Install

1. Copy `godot/addons/lantern/` into your project's `addons/` folder (you get `res://addons/lantern/`).
2. That is all: no plugin to enable. The classes register themselves. Keep the folder name: the preset scenes reference
   `res://addons/lantern/` by path.

To browse everything first, open the `godot/` folder as a project in Godot 4.7 and press Play (keys below).

## Use it

2D lights only show where it is dark, so a scene needs darkness first: either a `LanternSky` (recommended, it is the
day-night cycle) or Godot's own `CanvasModulate`. Then drop in lights.

```gdscript
# the time of day (one per scene: it owns the scene's CanvasModulate)
var sky := LanternCatalog.instantiate("moonlit") as LanternSky
add_child(sky)

# a window: put it at the bottom of the window, the light falls down the screen from there
var win := LanternCatalog.instantiate("cottage_window") as LanternLight
win.position = Vector2(320, 180)
win.follow_night = true          # off by day, on at dusk
add_child(win)

# a living flame (LanternLight + its LanternSource)
var torch := LanternCatalog.instantiate("wall_torch") as LanternLight
torch.position = Vector2(400, 176)
add_child(torch)

# darkness that follows the player: add it as a CHILD of the player
var shade := LanternCatalog.instantiate("torch_radius") as LanternShade
player.add_child(shade)

# change the sky over four seconds
sky.blend_to(LanternCatalog.look("blue_hour"), 4.0)
```

### A whole day

```gdscript
var clock := LanternClock.new()
clock.looks = [LanternCatalog.look("pre_dawn"), LanternCatalog.look("sunrise"), LanternCatalog.look("high_noon"),
	LanternCatalog.look("golden_hour"), LanternCatalog.look("sunset"), LanternCatalog.look("blue_hour"), LanternCatalog.look("moonlit")]
clock.hours = PackedFloat32Array([4.5, 6.0, 12.0, 16.5, 18.2, 19.2, 21.5])
clock.day_seconds = 240.0    # one day every four minutes
clock.hour = 17.0
add_child(clock)             # it finds the LanternSky by itself (or set clock.sky)
```

Every `LanternLight` with `follow_night` on fades with the sky's `lights_on`: windows and lamps come on by themselves.

## The nodes

| class (extends) | what it is | members |
| --- | --- | --- |
| `LanternLight` (`PointLight2D`) | a light whose shape is a `LanternCookie` and whose life is a flicker curve | exports `cookie`, `light_color`, `intensity`, `radius`, `flicker` (STEADY, CANDLE, TORCH, FIRE, NEON, STROBE, PULSE, SWEEP, SPIN, SWAY, FIREFLY), `flicker_depth`, `flicker_speed`, `flicker_seed`, `ember_shift`, `reach`, `follow_night`, `async_cookie`, `preview_time`; signal `cookie_ready`; `seek(seconds)`, `get_level()`, `get_time()`, `is_cookie_ready()`, `csaf_preview()` |
| `LanternCookie` (`Resource`) | the light's shape, painted into a texture at runtime and cached per recipe | exports `shape` (SOFT, PANES, ARCH, ROSE, LANCET, SLATS, BARS, LEAVES, LATTICE, PIERCED, CRACK, GRATE, CAGE, CONE), `fade` (RADIAL, THROW), `columns`, `rows`, `bar`, `softness`, `falloff`, `shear`, `aspect`, `glass`, `cone_degrees`, `squash`, `seed`, `size`; `make_texture()`, `make_image()`, `request_texture(done)`, `is_painting()`, static `prewarm(cookies)`, static `painting_count()`, static `clear_cache()` |
| `LanternSource` (`Node2D`) | the visible thing that gives the light, drawn in code at pixel-art scale; put it under a `LanternLight` and it pulses with it | exports `kind` (NONE, CANDLE, TORCH, CAMPFIRE, LANTERN, HEARTH, STREET_LAMP, NEON, TUBE, BEACON, SEARCHLIGHT, ORB, FIREFLIES, TIN), `flame_core`, `flame_mid`, `flame_edge`, `glow_color`, `body_color`, `glyph` (STAR, MOON, ARROW, HEART, CUP, BOLT), `count`, `spread`, `size_scale`, `seed`; `seek(seconds)`, `fly_position(index, seconds)`, `fly_blink(index, seconds)` |
| `LanternSky` (`Node2D`) | the time of day: the scene's ambient (a `CanvasModulate` it owns) plus, at runtime, a full-screen grade | exports `look`, `grade_layer`, `grade`, `preview_time`; signal `look_changed(look)`; `blend_to(look, seconds)`, `set_current(look)`, `get_current()`, `get_ambient()`, `get_lights_on()`, `seek(seconds)`, `strike_time(index)`, `csaf_preview()` |
| `LanternSkyLook` (`Resource`) | one time of day or weather as numbers | exports `title`, `ambient`, `lights_on`, `exposure`, `contrast`, `saturation`, `shadow_tint`, `highlight_tint`, `sun_dir`, `sun_strength`, `sun_color`, `shafts`, `shaft_width`, `clouds`, `cloud_scale`, `wind`, `aurora`, `aurora_a`, `aurora_b`, `flash`, `flash_every`, `haze`, `haze_color`, `vignette`; static `mix_looks(a, b, t)` |
| `LanternClock` (`Node`) | walks a `LanternSky` through looks pinned to hours, blending neighbours | exports `sky`, `looks`, `hours`, `day_seconds`, `hour`, `running`; signal `hour_changed(hour)`; `look_at_hour(hour)` |
| `LanternShade` (`Node2D`) | darkness that follows its target (its parent, or `target`); children travel with it | exports `kind` (RADIUS, CONE, BANDS, FOG_OF_WAR, CAVE, SONAR, HAZE, NIGHTMARE, REVEAL, BINOCULARS, NIGHT_VISION, SPOTLIGHT), `target`, `radius`, `softness`, `darkness`, `rim_color`, `cone_degrees`, `facing`, `auto_face`, `pixel_size`, `breathe`, `breathe_speed`, `reveal_group`, `fog_rect`, `fog_cell`, `fog_memory`, `layer`, `seed`, `preview_time`; `get_target()`, `reveal_path(points)`, `get_fog_image()`, `set_fog_image(image)`, `clear_fog()`, `seek(seconds)`, `csaf_preview()` |
| `LanternCatalog` | every preset by id | `FAMILIES`, `PRESETS`, `path_of(id)`, `instantiate(id)`, `look(id)`, `ids_for_family(family)` |
| `LanternUtil` | helpers | `hash1`, `noise1`, `fbm1`, `ambient_for(node)`, `compensation(ambient)` |

Notes that matter:

- **Window lights (`fade` = THROW) start at the node and fall down the screen**, widening with distance; rotate the node to
  throw them another way. The sill of the window lands next to the node, the top of the window farthest away.
- **Stained glass keeps its colours** (`glass`); `light_color` tints the whole light on top.
- **One `LanternSky` per scene.** It replaces any `CanvasModulate` you had. Its grade draws on CanvasLayer `grade_layer`
  (3) and every `LanternShade` on CanvasLayer `layer` (5): put your HUD on a CanvasLayer above 5 so it is not graded or
  darkened. `grade = false` keeps only the ambient colour (the cheapest option).
- **Flames, neon and lamp glass stay bright at night** (`LanternSource` compensates for the scene's ambient colour); the
  wood, iron and stone parts are lit by your lights like everything else.
- **Fog of war:** `fog_rect` is in world coordinates (the area of your map), `fog_cell` the size of one remembered cell.
  Save the explored map with `get_fog_image()` and restore it with `set_fog_image()`.
- **Reveal:** put any `Node2D` in the group `lantern_reveal` (lamps, campfires); a `LanternLight` there opens a hole of 85%
  of its radius, anything else uses its `lantern_reveal_radius` metadata.
- **Cookie textures are made once per recipe** and shared: forty windows with the same recipe cost one texture. A recipe
  that is not painted yet is painted on a worker thread (`async_cookie`, on by default): the light shows a soft round
  placeholder for a few frames and emits `cookie_ready` when its shape is in place. Call `LanternCookie.prewarm([...])`
  while a level loads to have every shape ready before the first frame.
- **Editor preview:** lights, sources and the sky's ambient show in the editor (they are tool scripts); the sky's grade
  and every darkness layer are drawn at runtime only, so the editor stays readable.

## The 48 presets

Light shapes (`presets/cookie/`, a `LanternLight` with a `LanternCookie`): `cottage_window` (four warm panes),
`tall_casement` (a narrow 2 x 4 window, thrown at an angle), `chapel_arch` (an arched window with tracery and an oculus),
`rose_window` (a stained-glass rose), `lancet_glass` (a pointed lancet of leaded coloured quarries), `venetian_blinds`
(slats), `prison_bars` (bars and a crossbar), `leaf_dapple` (moonlight through leaves), `paper_lattice` (a paper screen
with grain), `tin_lantern` (a pierced tin lantern throwing points of light), `door_ajar` (a wedge of light from a door),
`sewer_grate` (light up through a grate).

Living sources (`presets/flame/`, a `LanternLight` with a `LanternSource`): `candle`, `wall_torch`, `campfire` (with
rising embers), `oil_lantern` (a swinging cage that throws bar shadows), `forge_hearth`, `street_lamp`, `failing_neon`
(a neon sign that cuts out), `fluorescent_tube` (strobes, then holds), `searchlight` (sweeps), `warning_beacon` (spins),
`wisp_orb` (breathes, with orbiting motes), `firefly_swarm` (each firefly is its own small light).

Times of day and weather (`presets/sky/`, a `LanternSky`; the looks alone in `presets/sky/looks/`): `pre_dawn`,
`sunrise`, `morning`, `high_noon`, `golden_hour`, `sunset`, `blue_hour`, `moonlit`, `new_moon`, `overcast` (drifting
cloud shadow), `thunderstorm` (lightning), `aurora_night`.

Darkness that follows the player (`presets/shade/`, a `LanternShade`, some with a carried `LanternLight`):
`torch_radius`, `flashlight` (a cone that turns where you walk), `retro_bands` (stepped, dithered torchlight),
`fog_of_war` (remembers where you have been), `cave_pocket`, `sonar_ping`, `blizzard_haze`, `nightmare` (a heartbeat
vignette), `lamp_reveal` (holes around every lamp), `binoculars`, `night_vision`, `stage_spotlight`.

A recolour is a parameter, never a preset: change `light_color`, `glass`, `glow_color`, the look's colours or the shade's
`darkness` / `rim_color`.

## The demo

`demo/demo.tscn` (the project's main scene) shows every preset over a small town at night, one at a time:
**Left / Right** (or **Q / E**) the preset, **Up / Down** (or **Tab**) the family, **Space** the day cycle (ten skies on a
`LanternClock`, the town's windows and lamps coming on at dusk), **WASD / arrows** walk the traveller in the darkness
family. `demo/presets/<id>.tscn` is each preset alone over the town (press F6 on one); `demo/control.tscn` is the same
town under a plain `CanvasModulate`, for comparison. The town tiles are from Verdant 09 Town (see
`demo/town/NOTICE.txt`).

## Performance

Measured on the build machine (AMD Radeon integrated graphics, Godot 4.7.2, 1280 x 720, vsync off); your hardware will
differ:

- **40 LanternLights** (all twelve shapes and twelve sources) plus a `LanternSky` grade and a `LanternShade` averaged
  **under 8 ms per frame under both Forward+ and Compatibility**.
- **Painting one new 256 px shape takes a few tenths of a second of CPU** (512 px: four to six times as long). It happens
  once per recipe. With `async_cookie` on (the default) it runs on a worker thread and `add_child` returns in about a
  millisecond; with it off, or in `prewarm()`, the calling frame waits for it.

## Licence

See `LICENSE.txt`: use it in any number of games, commercial or free; do not resell or redistribute the files as a pack.
The code and the demo were written by an AI (see the licence).


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
