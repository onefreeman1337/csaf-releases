# Emberflux: 120 2D Combat VFX for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Emberflux: 120 2D Combat VFX for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Emberflux - 120 2D Combat VFX for Godot 4

120 combat effects for 2D Godot games: hits, slashes, bursts, projectiles, buffs and status marks, in six elements
(Fire, Frost, Storm, Venom, Void, Radiant). Every effect is a shader computed at runtime. There are no frame sheets:
each preset is a small scene you instance, and you recolour it by swapping one palette resource.

- **Godot version:** built and tested on **Godot 4.7.2**, under **both renderers: Forward+ and Compatibility**
  (Compatibility is the one web exports use). Older 4.x versions were NOT run, so they are not claimed.
- **What is in the box:** 120 preset scenes, 20 effect-family shaders plus one shared shader library, 12 palettes,
  the `EmberfluxEffect` controller script, the `EmberfluxCatalog` index, and a demo browser.

## Install

1. Copy the folder `godot/addons/emberflux/` into your project's `addons/` folder (so you get `res://addons/emberflux/`).
2. That is all. There is no plugin to enable: the scripts register the classes `EmberfluxEffect`, `EmberfluxPalette`
   and `EmberfluxCatalog` on their own.

To browse everything first, open the `godot/` folder itself as a project in Godot 4.7 and press Play: the demo is the
main scene (`res://demo/demo.tscn`).

## Use a preset

Drag a preset scene from `res://addons/emberflux/presets/<element>/` into your scene, or spawn one in code:

```gdscript
var fx: EmberfluxEffect = preload("res://addons/emberflux/presets/fire/fire_impact.tscn").instantiate()
fx.position = enemy.global_position
fx.free_when_finished = true
add_child(fx)
```

or by id:

```gdscript
var fx := EmberfluxCatalog.instantiate("frost_shockwave")
fx.position = where
add_child(fx)
```

- **One-shots** (hits, slashes, bursts, dissolve) play once when they enter the tree, hide when done, emit `finished`,
  and free themselves if `free_when_finished` is on.
- **Loops** (orb, missile, beam, aura, shield, charge, status, sigil, vortex) run until you call `stop()` or free them.
- **Projectiles and beams face +x.** Set the node's `rotation` to aim them. Move an orb or missile like any node.
- **Origins:** eruption and aura sit on the ground point (put the node at the target's feet); beam starts at the
  emitter (put the node at the caster's hand) and fills its `Layer`: widen the `Layer` node (`offset_right`) to make
  the beam longer. Everything else is centred.

## Recolour, resize, retime

Every preset's root node is an `EmberfluxEffect`. Its exported parameters:

| parameter | what it does |
| --- | --- |
| `palette` | an `EmberfluxPalette` (three colours: `core`, `mid`, `edge`). Swap it to recolour. The element's SHAPES stay. |
| `duration` | seconds for one play of a one-shot (or one progress cycle of a loop) |
| `looping` | repeat a one-shot; loops ship with it on |
| `autoplay` | start when the node enters the tree (off = hidden until `play()`) |
| `speed_scale` | playback speed multiplier |
| `effect_scale` | uniform size multiplier (sets the node scale) |
| `intensity` | brightness; above 1 pushes more of the effect into the core colour |
| `additive` | 1 = pure light that adds to the scene, 0 = normal blending that reads on bright backgrounds |
| `free_when_finished` | free the node when a one-shot ends |
| `preview_progress` | the showcase moment (0..1) used by `seek_preview()` |
| `editor_preview` | animate the preset in the editor viewport |

Methods: `play()`, `stop()`, `is_playing()`, `seek(fraction, hold)`, `seek_preview()`; signal `finished`.

**Palettes** in `res://addons/emberflux/palettes/`: the six element palettes (`fire`, `frost`, `storm`, `venom`,
`void`, `radiant`) and six extras (`blood`, `shadow`, `emerald`, `sunset`, `ghost`, `azure_flame`). Make your own with
New Resource > EmberfluxPalette, or in code with `palette.hue_shifted(0.3)`.

**Shape parameters.** Each preset's `Layer` node carries a `ShaderMaterial`; its shader parameters (for example
`rays`, `reach`, `thickness`, `arms`, `twist`, `rune_count`, `spin_speed`) change the shape further. The `style`
parameter (0 fire, 1 frost, 2 storm, 3 venom, 4 void, 5 radiant) picks the element's shape grammar: a Fire slash
licks outward in tongues, a Frost slash grows faceted shards, a Storm slash is a jagged filament, a Venom slash is a
lumpy membrane with bubbles, a Void slash is a triple line with rune ticks, a Radiant slash is a soft blade throwing
rays.

## The 120 presets

Preset id = `<element>_<family>`; the scene is `res://addons/emberflux/presets/<element>/<id>.tscn`.

| family | what it is | loop | Fire | Frost | Storm | Venom | Void | Radiant |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Impact | quick hit flash, strokes thrown outward, a spray of sparks | no | `fire_impact` | `frost_impact` | `storm_impact` | `venom_impact` | `void_impact` | `radiant_impact` |
| Heavy Impact | swelling core, shock ring, heavy strokes and debris | no | `fire_heavy_impact` | `frost_heavy_impact` | `storm_heavy_impact` | `venom_heavy_impact` | `void_heavy_impact` | `radiant_heavy_impact` |
| Slash | one crescent cut sweeping an arc, sparks off its head | no | `fire_slash` | `frost_slash` | `storm_slash` | `venom_slash` | `void_slash` | `radiant_slash` |
| Cross Slash | two blades cut an X, a flash where they cross | no | `fire_cross_slash` | `frost_cross_slash` | `storm_cross_slash` | `venom_cross_slash` | `void_cross_slash` | `radiant_cross_slash` |
| Flurry | a rapid volley of short cuts at scattered angles | no | `fire_flurry` | `frost_flurry` | `storm_flurry` | `venom_flurry` | `void_flurry` | `radiant_flurry` |
| Thrust | a piercing lunge along +x with speed lines and a tip flare | no | `fire_thrust` | `frost_thrust` | `storm_thrust` | `venom_thrust` | `void_thrust` | `radiant_thrust` |
| Nova | a filled explosion that swells and hollows from the centre | no | `fire_nova` | `frost_nova` | `storm_nova` | `venom_nova` | `void_nova` | `radiant_nova` |
| Shockwave | two thinning rings racing outward | no | `fire_shockwave` | `frost_shockwave` | `storm_shockwave` | `venom_shockwave` | `void_shockwave` | `radiant_shockwave` |
| Eruption | a column bursting up out of the ground; origin = the ground point | no | `fire_eruption` | `frost_eruption` | `storm_eruption` | `venom_eruption` | `void_eruption` | `radiant_eruption` |
| Scatter | a pinpoint pop throwing a full spray of element sparks | no | `fire_scatter` | `frost_scatter` | `storm_scatter` | `venom_scatter` | `void_scatter` | `radiant_scatter` |
| Dissolve | a defeat puff eaten away by a glowing edge | no | `fire_dissolve` | `frost_dissolve` | `storm_dissolve` | `venom_dissolve` | `void_dissolve` | `radiant_dissolve` |
| Orb | projectile ball with a comet tail; faces +x | yes | `fire_orb` | `frost_orb` | `storm_orb` | `venom_orb` | `void_orb` | `radiant_orb` |
| Missile | pointed dart with a core trail and two twisting strands; faces +x | yes | `fire_missile` | `frost_missile` | `storm_missile` | `venom_missile` | `void_missile` | `radiant_missile` |
| Beam | sustained ray from the origin along +x; widen the Layer to lengthen it | yes | `fire_beam` | `frost_beam` | `storm_beam` | `venom_beam` | `void_beam` | `radiant_beam` |
| Aura | power-up shell rising from a ring at the feet; origin = the ground point | yes | `fire_aura` | `frost_aura` | `storm_aura` | `venom_aura` | `void_aura` | `radiant_aura` |
| Shield | barrier bubble with an element rim and an orbiting highlight | yes | `fire_shield` | `frost_shield` | `storm_shield` | `venom_shield` | `void_shield` | `radiant_shield` |
| Charge | energy gathered into a pulsing core | yes | `fire_charge` | `frost_charge` | `storm_charge` | `venom_charge` | `void_charge` | `radiant_charge` |
| Status | small looping status mark for over a unit's head | yes | `fire_status` | `frost_status` | `storm_status` | `venom_status` | `void_status` | `radiant_status` |
| Sigil | ground circle in perspective: AoE marker or cast circle | yes | `fire_sigil` | `frost_sigil` | `storm_sigil` | `venom_sigil` | `void_sigil` | `radiant_sigil` |
| Vortex | spiral arms winding into a bright eye | yes | `fire_vortex` | `frost_vortex` | `storm_vortex` | `venom_vortex` | `void_vortex` | `radiant_vortex` |

## Demo controls

Left / Right page · Tab switches between one family in all six elements and one element in all twenty families ·
Up / Down element · P cycles the palette over everything on screen · H holds every preset on its showcase frame (H again
to play) · Space replays · Click casts the preset under the mouse at the mouse · F12 saves a screenshot to `user://`.

## Notes

- **Performance:** each preset is one quad with one shader; cost grows with the pixels it covers. Measured on our test
  machine (integrated AMD Radeon graphics, Godot 4.7.2, vsync off): 50 Nova presets on screen at once, each 280x280 px,
  averaged under 10 ms per frame under both Forward+ and Compatibility. Keep very large effects to a handful at a time on
  low-end mobile (not measured).
- **Lights:** the shaders are `unshaded`, so 2D lights do not darken them (effects are their own light).

## Changes

- **1.0.3:** six presets drew wrong under Forward+ and now match Compatibility. `frost_impact`, `frost_heavy_impact`,
  `frost_nova` and `frost_shockwave` had lost their ice spikes; `radiant_impact` and `radiant_heavy_impact` had lost their
  rays. Compatibility and web exports were right all along. The only addon file that changed is
  `shaders/ef_common.gdshaderinc`: copy it over yours to update.
- **1.0.1 and 1.0.2:** the demo's lettering. The addon did not change.

## Licence and AI disclosure

See `LICENSE.txt`. Use in any number of your games, commercial or free; no resale or redistribution of the files as a
pack. This pack is AI-generated: the shaders, scenes and scripts were written by an AI.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
