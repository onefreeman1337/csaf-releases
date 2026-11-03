# Weatherglass: 48 2D Weather and Atmosphere Shaders for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Weatherglass: 48 2D Weather and Atmosphere Shaders for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Weatherglass - 48 2D Weather and Atmosphere Shaders for Godot 4

48 full-screen weather and atmosphere layers for Godot 4 games, each drawn live by a shader: rain, snow, hail, fog, mist,
sandstorms, embers, aurora, lightning, sunsets, rainbows, caustics, falling leaves, fireflies, lanterns and more. Every
layer sits on its own CanvasLayer so it follows the screen, fades in and out, and a `WeatherController` blends from one
weather to the next (rain easing into snow, fog lifting off a sunrise). No images ship.

- **Godot version:** built and tested on **Godot 4.7.2**, under **both renderers: Forward+ and Compatibility**
  (Compatibility is the one web exports use). Older 4.x versions were NOT run, so they are not claimed.
- **What is in the box:** 48 preset scenes over four shaders (precipitation, air, sky and light, nature), 23 palette
  resources, `WeatherLayer`, `WeatherController`, `WeatherPalette`, the `WeatherCatalog` index and a demo.

## Install

1. Copy `godot/addons/weatherglass/` into your project's `addons/` folder (you get `res://addons/weatherglass/`).
2. That is all: no plugin to enable. The classes `WeatherLayer`, `WeatherController`, `WeatherPalette` and
   `WeatherCatalog` register themselves.

To browse everything first, open the `godot/` folder as a project in Godot 4.7 and press Play.

## Use it

```gdscript
var weather := WeatherController.new()
add_child(weather)
weather.set_weather("downpour", 2.0)              # fade the current weather out and rain in over 2 s
weather.add_weather("lightning", 1.0)             # stack a second layer on top
weather.set_weather(["gentle_snow", "fog_bank"], 4.0)
weather.clear(3.0)
```

Or one layer on its own: `var rain := WeatherCatalog.instantiate("drizzle")`, `add_child(rain)`, `rain.fade_in(2.0)`.
Or drag a scene from `res://addons/weatherglass/presets/<group>/` into your scene.

| member | what it does |
| --- | --- |
| `WeatherController.set_weather(ids, seconds)` | replace every active weather with one id or an Array of ids, crossfading |
| `add_weather(id, seconds)`, `remove_weather(id, seconds)`, `clear(seconds)`, `active_ids()` | stack, remove, clear, list |
| `weather_changed(ids)` | signal at the end of a blend |
| `WeatherLayer.fade_in(seconds)`, `fade_out(seconds)`, `faded_out` | fade one layer; signal at zero |
| `seek(seconds)`, `seek_preview()` | freeze on a moment (stills, thumbnails) |
| `WeatherCatalog.instantiate(id)`, `path_of(id)`, `ids_for_group(group)`, `PRESETS`, `GROUPS` | the index |

Exported on every layer: `palette` (a `WeatherPalette` with `tint`, the body colour, and `glow`, the highlight colour),
`amount` (0 to 1, what fades move), `speed_scale`, `intensity`, `wind` (-2 to 2, read by rain, snow and drift),
`layer` (the CanvasLayer order: above your world, below your UI) and `preview_time`. Each preset's `Weather` node material
also carries its shader's own parameters: `density` and `fall_speed` (precipitation), `density` and `drift_speed` (air and
nature), `strength` and `flash_rate` (sky and light), and `seed`. A recolour is a palette swap; it is not a new preset.

## The 48 presets

Ids, by group (scene: `res://addons/weatherglass/presets/<group>/<id>.tscn`):

- **precip:** `drizzle`, `downpour`, `storm_rain`, `rain_on_glass`, `sleet`, `hail`, `gentle_snow`, `blizzard`,
  `big_flakes`, `snow_globe`, `ice_glitter`, `meteor_shower`.
- **air:** `fog_bank`, `mist`, `haze`, `dust_motes`, `sandstorm`, `pollen`, `ash_fall`, `embers`, `smoke`, `spores`,
  `swamp_gas`, `wind_lines`.
- **sky:** `god_rays`, `aurora`, `starfield`, `moonlight`, `lightning`, `sunset`, `rainbow`, `cloud_shadows`,
  `lantern_light`, `caustics`, `sun_glare`, `heat_haze`.
- **nature:** `falling_leaves`, `cherry_petals`, `fireflies`, `dandelion_seeds`, `bubbles`, `ripples`,
  `puddle_splashes`, `feathers`, `magic_dust`, `falling_sparks`, `snow_clumps`, `floating_lanterns`.

`moonlight`, `cloud_shadows` and `lantern_light` darken what is under them (normal blending); every other layer adds light.

## Demo controls

Left / Right preset · Up / Down group · B blend to the next preset over 3 s · S stack fog on top · C clear · H help line.

## Notes

- Each layer is one full-screen quad with one shader; cost grows with the screen size, not with how much falls.
- `heat_haze` draws shimmer lines (an empty stage cannot show refraction); it does not distort your scene.
- The shaders are `unshaded`: 2D lights do not change a weather layer.

## Licence and AI disclosure

See `LICENSE.txt`. Use in any number of your games, commercial or free; no resale or redistribution of the files as a
pack. This pack is AI-generated: the shaders, scenes and scripts were written by an AI.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
