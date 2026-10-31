# Halation — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Halation  
**Engine:** GameMaker 2024+  
**Docs published:** 2026-10-31


---

# Halation - Lens Flares, Glints and Glare for GameMaker

**Halation is a lens flare system for GameMaker (2024.14, tested on runtime 2024.14.4.268) in pure GML, with a runnable demo room.**
A light declares its kind and the package generates its flare through one of 8 lens kits: 80 distinct flare designs from 10 light
kinds. Ghosts strung along the axis through your frame's centre, shaped by the lens's aperture blades, diffraction spikes, rainbow rings,
anamorphic streaks, veiling glare and lens dirt that lights up as a bright source crosses it. Flares fade smoothly when their source
passes behind a wall. No image files are drawn, no surface or shader is used: one commercial licence covers all your games.

Every picture on the store page was rendered by this package in a blank GameMaker project.

---

## What is in the package

| | |
| --- | --- |
| `hal_core` | the lens kits, the light kinds, colour temperature, the design compiler, the optical axis, flicker, occlusion, the world of lights - **no drawing calls** |
| `hal_draw` | drawing: every flare with `draw_vertex_colour`, in one additive pass |
| `hal_demo` + `obj_hal_demo` + `rm_hal_demo` | THE BACKLOT: one location from noon to night, through whichever lens you choose |
| `hal_selftest` | the in-engine test suite (run the demo with `-selftest`) |
| `obj_hal_wall`, `spr_hal_mark`, `ts_hal_mark` | a stone block and a one-tile tileset. The demo and the tests use them as your walls and your tile layer. No flare draws them, and you can delete them with the demo |
| 4 fonts | `fnt_halation_display_s/_l` (from Bebas Neue) and `fnt_halation_body_s/_l` (Barlow Condensed SemiBold), both SIL OFL 1.1; licences and notices in `Halation/fonts/`. Only the demo uses them |

## Install

1. In GameMaker: **Tools > Import Local Package**, choose `Halation.yymps`, **Add All**, **Import**.
2. Run the project with `rm_hal_demo` first in the room order to open THE BACKLOT.

The raw `.gml` sources are also in the `Halation/` folder of this download, readable without GameMaker.

## Quickstart

```gml
// Create - one world per camera; lights in it are in room coordinates
my_wall_object = obj_hal_wall;   // your own wall object goes here
my_lens = hal_world_create({ kit: "vintage", occluder: { mode: "objects", objects: my_wall_object } });
my_sun = hal_light_add(my_lens, "sun", 200, 90);
hal_light_add(my_lens, "torch", 620, 410);
```

```gml
// Step - flicker, one-shots, and what the walls cover
hal_world_step(my_lens);
```

```gml
// Draw GUI - every flare, over everything
hal_world_draw(my_lens);
```

There is no Clean Up call, because there is nothing to clean up: a world is plain data and the package creates no sprite, surface,
shader or vertex buffer, so nothing can leak on a room change or a `game_restart`.

Then, wherever something happens:

```gml
hal_flash(my_lens, "muzzle", gun_x, gun_y);
hal_flash(my_lens, "explosion", boom_x, boom_y);
hal_glint(my_lens, gem_x, gem_y, { size: 28 });
hal_glint_along(my_lens, hilt_x, hilt_y, tip_x, tip_y);
hal_world_set_kit(my_lens, "anamorphic");
```

## The lens kits

| kit | what it looks like |
| --- | --- |
| `vintage` | Vintage Prime: a single-coated prime from the 1970s: hexagon ghosts in amber and green, a rainbow arc |
| `anamorphic` | Anamorphic Cinema: a squeezed cinema lens: a long blue streak across the frame, tall oval ghosts |
| `phone` | Cheap Phone: a tiny phone lens: a violet wash, one hard green blob mirrored, a greasy thumbprint of dust |
| `telescope` | Space Telescope: a segmented mirror on three struts: eight dispersed diffraction spikes, Airy rings, a doughnut ghost |
| `crystal` | Fantasy Crystal: a lens cut from quartz: prismatic hexagon shards, full rainbow rings and a dust of sparkles |
| `pixel` | Retro Pixel: a 16-bit flare: every shape snapped to a pixel grid, 12 colours, stepped light |
| `nightvision` | Night Vision: an image-intensifier tube: green phosphor, a bloomed-out source, scanlines and live noise, and the frame graded green |
| `dream` | Dreamy Soft: a mist filter over an old portrait lens: a red halation glow, pastel bokeh, nothing with an edge |

Make your own from any of them. Anything you do not name is inherited:

```gml
hal_kit_define("my_seven_blade", "vintage", { blades: 7, coat: [c_orange, c_aqua, c_fuchsia] });
```

The aperture follows the real rule: an even number of blades gives that many spikes, an odd number gives twice as many, so a 7-blade lens
draws 14. Fields you can set: `blades`, `round`, `rot`, `squeeze`, `coat` (ghost colours), `ghostTint`, `core`, `bloom`, `spike`, `ghosts`,
`rings`, `streaks`, `veil`, `dirt`, `sparks`, `scan`, `noise`, `grade`. `hal_core` documents each one where the kits are declared.

## The light kinds

| kind | colour | what it does |
| --- | --- | --- |
| `sun` | 5600 K | everything the lens has |
| `moon` | 9000 K | faint ghosts and a full halo ring |
| `torch` | 1850 K | short spikes, and a flame's flicker |
| `lantern` | 2650 K | a big soft bloom that breathes |
| `neon` | your colour (default pink) | a bloom stretched along the tube, a hum and the odd stutter |
| `muzzle` | 2300 K | a one-shot under 0.11 s: small, orange, all hard spikes |
| `orb` | your colour (default blue) | a pulse, a ring and sparkles |
| `eye` | your colour (default gold) | a tiny point with a thin streak that twinkles |
| `headlamp` | 8200 K | cold, wide and all streak |
| `explosion` | 2300 K | a one-shot lasting 0.75 s that lifts the whole frame |

Set your own with `hal_light_add`'s `colour` or `kelvin`.

## Occlusion

Give the world, or one light, an occluder. Each light samples a disc of its `radius` (room pixels), so a sun half behind a column gives
half its flare, and the change eases in at the world's `attack` and `release`.

| mode | description |
| --- | --- |
| `{ mode: "objects", objects: my_wall_object, precise: false }` | a point test against objects (one, or an array) |
| `{ mode: "tiles", tilemaps: "Walls" }` | any non-empty tile covers it: a layer name, a tilemap id, or an array of them |
| `{ mode: "mask", surface: my_surface, scale: 0.5, ox: 0, oy: 0, threshold: 0.5 }` | your own surface: alpha at or above `threshold` covers. A lost surface covers nothing and sets the occluder's `lost` field |
| `{ mode: "line", objects: my_wall_object, from: [x, y] }` | a line of sight from a viewer (`[x, y]` or an instance) to the light |
| `{ mode: "function", fn: function(_x, _y) { return my_test(_x, _y); } }` | your own answer; it reads your instance's variables |

A light in front of your walls, like a torch mounted on one, takes `occlude: false`. `hal_light_visibility(light)` returns the eased 0..1, for your own bloom or sound.

## Reference

**The world**
- `hal_world_create([options])` -> a world. Options: `kit`, `occluder`, `camera`, `samples` (per light, default 12), `attack` (default 0.06 s), `release` (default 0.14 s), `gain`, `veil`, `dirt`, `grade`
- `hal_world_step(world, [dt])` - dt in seconds, default this frame's `delta_time`, capped at 0.05
- `hal_world_draw(world, [x], [y], [w], [h], [clip])` - the frame defaults to the GUI size; `clip` true scissors to it, in render-target pixels, for split screen drawn 1:1
- `hal_world_set_kit(world, kit)`, `hal_world_set_occluder(world, occluder)`, `hal_world_set_camera(world, camera)`
- `hal_world_pause(world, paused)`, `hal_world_clear(world)`, `hal_world_count(world)`

The world's camera view maps onto the frame, so a light at a room position lands where the player sees that position. The camera defaults to view 0 when views are on, otherwise the whole room.

**Lights**
- `hal_light_add(world, kind, x, y, [options])` -> a light, or undefined when refused. Options: `colour`, `kelvin`, `size`, `brightness`, `elong`, `angle`, `kit`, `radius`, `occluder`, `occlude`, `screen`, `flicker`, `flickerAmount`, `follow`
- `hal_flash(world, kind, x, y, [options])` -> a one-shot light that retires itself. Options as above, plus `attack` and `decay` in seconds
- `hal_light_move(light, x, y)`, `hal_light_set(light, options)`, `hal_light_remove(world, light)`, `hal_light_visibility(light)`, `hal_light_exists(world, light)`

`flicker` is one of `none`, `flame`, `breathe`, `hum`, `pulse`, `twinkle`. `follow` tracks an instance, and the light retires when the instance does.

**Glints**
- `hal_glint(world, x, y, [options])` - a one-shot sparkle. Options: `size`, `life`, `colour`, `points` (4 or 6), `spin`, `screen`
- `hal_glint_along(world, x0, y0, x1, y1, [options])` - a glint that runs along an edge once
- `hal_glint_draw(x, y, size, [phase], [colour], [points], [rot])` - one still sparkle now, for an icon or a menu

**Without a world**
- `hal_flare_draw(kit, kind, x, y, [brightness], [options])` - one flare now, for a title screen or a still. Options: `fx`, `fy`, `fw`, `fh` (the frame), `t`, `colour`, `kelvin`, `size`, `elong`, `angle`, `veil`, `dirt`, `grade`

**The catalogue**
- `hal_kits()`, `hal_kit_title(kit)`, `hal_kit_line(kit)`, `hal_kinds()`, `hal_kind_title(kind)`, `hal_kit_define(name, base, overrides)`
- `hal_design(kit, kind, [options])`, `hal_design_stats(kit, kind)`, `hal_axis_point(lightX, lightY, t, frameX, frameY, frameW, frameH)`, `hal_kelvin(kelvin)`
- `hal_rng(seed)`, `hal_rand(generator)` - the seeded generator

Colour adds and alpha blends as "over", so drawing onto an opaque surface leaves it opaque. Every drawing call hands back your blend, shader, depth state, world matrix and scissor. A world matrix or a GUI scale you have set simply applies.

## Performance (measured, two suite runs, Windows VM build)

One flare on a 960 x 540 frame, drawing only:

- `vintage` x `sun`: 1.5 ms to 1.6 ms (3846 vertices)
- `crystal` x `sun`: 1.7 ms to 2.0 ms
- `telescope` x `sun`: 1.1 ms to 1.2 ms
- `pixel` x `sun`: 2.1 ms
- `vintage` x `torch`: 0.9 ms (2127 vertices)
- a world with a sun and eight torches: 9.4 ms to 10 ms (20862 vertices)

The heaviest of the 80 designs writes 4107 vertices; the median writes 1704. These figures are the VM on a busy Windows machine; YYC was not built.

To spend less: `veil: false` and `dirt: false` on the world, fewer `samples`, or fewer lights at once.

## Limits, stated

- 2D. A flare is a screen-space effect: it is drawn over your frame, and walls occlude it by the tests above, never by depth.
- `hal_light_set` with a new colour or size compiles a new design (cached, up to 512 at a time). Animate `brightness` freely; animate colour in steps.
- The `mask` occluder reads pixels back from a surface, which is the slowest of the five. Use it for a few lights.
- The `clip` argument uses the GPU scissor, which works in render-target pixels, so it does not follow a GUI scale or a world matrix.
- No sound ships.
- Built and tested on Windows (VM). HTML5, mobile and YYC were not built.
- GML cannot be unit-tested outside the engine. Every figure above came from real Igor-built executables running the package's own suite (175 assertions) and a fresh install of the package into a blank project.

## Globals

Halation keeps these globals, all namespaced: `global.hal_t_kits`, `global.hal_t_kinds`, `global.hal_t_kit_order`, `global.hal_t_kind_order`, `global.hal_t_designs`, `global.hal_t_design_count`, `global.hal_t_circles`, `global.hal_t_discs`, `global.hal_vtotal` (vertices written, for profiling), `global.hal_pn` (the retro kit's batch count) and `global.hal_stage` (the suite's progress). The macros in `hal_core` are the ten element types of a compiled design.

## Licence and AI disclosure

One commercial licence, unlimited games: see `LICENSE.txt`. The fonts are SIL OFL 1.1 (`Halation/fonts/`).
Halation was written with AI assistance (code and the drawings it makes). Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
