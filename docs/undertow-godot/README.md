# Undertow: 144 Water Presets for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Undertow: 144 Water Presets for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-20


---

# Undertow for Godot 4

**The 2D water mechanics volume: three addons, 144 presets, one Godot 4.7 project.** Version 1.0.0 · Core Systems Asset Factory

Undertow puts three water mechanisms into a 2D Godot game, each working on your own TileMapLayers, each drawn at runtime by
code (no image files in any addon):

| part | folder | what it does | presets |
| --- | --- | --- | --- |
| **Foreshore** | `addons/foreshore/` | shoreline foam, surf that follows your coast and breaks, spray on rock, wet sand and a tide; `depth_at()` and `is_wet()` for game logic | 48 coasts |
| **Creel** | `addons/creel/` | fishing on your own water tiles: cast, nibble, bite, hook and a reel duel, 48 catches drawn in code, a journal and catch cards | 48 catches |
| **Wake** | `addons/wake/` | water that answers what moves in it: rings round a wading foot, a swimmer's trail, a boat's V, splashes, rain rings, bobbing floats, clipped to your shore | 48 styles |

Each part works alone; together they share one map. Foreshore and Wake read the same TileSet tag (a custom data layer named
`foreshore_surface`), and Creel finds the same water by its own tag, the layer's name or the tiles' colour.

## Install

Copy the folder of each part you want from `godot/addons/` into your project's `addons/` folder. None needs a plugin enabled.
Then follow that part's own Readme, which ships unchanged in `docs/`:

- `docs/Foreshore_Readme.md`: a Foreshore2D node beside your TileMapLayers, a coast resource, the tide, `depth_at()`.
- `docs/Creel_Readme.md`: a CreelWater2D reading your water, a CreelRod2D on your player, the reel, the catch catalogue.
- `docs/Wake_Readme.md`: a Wake2D beside your TileMapLayers, a style, and a WakeBody2D on anything that moves through water.

The three addons have no name in common (no shared class, autoload or input action), so any two or all three install side
by side.

## Using them together

Put Foreshore2D, Wake2D and CreelWater2D as siblings of your TileMapLayers (Foreshore2D first, so the wakes draw over the
surf). Connect Creel's rod to Wake so the water answers the fishing:

```gdscript
rod.cast_started.connect(func(t: Vector2) -> void: target = t)
rod.landed_in_water.connect(func(_kind: String) -> void: wake.splash(target, 0.9, 0.6))
rod.bite.connect(func(_id: String) -> void: wake.ripple(target, 1.3, 0.9))
rod.caught.connect(func(_id: String, _cm: float) -> void: wake.splash(target, 1.3, 1.0))
```

Give your player a WakeBody2D child and every step through the shallows rings the water; give a boat one with `churn` above 0.

## The project

Open `godot/project.godot` and press F5. The menu opens each part's own demo (every coast, catch and style in it) and
**the harbour**: the three on one map, surf on the beach, an angler fishing from the pier by itself while every cast, bite and
catch rings the water, a rowboat drifting with its wake, and you wading with the arrow keys (R rain, 1-3 the wake style).
F10 comes back to the menu from any demo. The launcher (`godot/undertow/`) is demo code; your game does not need it.

## Renderers and versions

Every preset of the three parts was run and photographed under **Forward+** and **Compatibility** (OpenGL 3, the web
renderer) in Godot **4.7.2**, in this one project, with zero shader or script errors under either. Earlier Godot 4 versions
were not run.

## Licence

See LICENSE.txt: use it in any number of games, edit it freely; no resale or redistribution of the files as a pack; no AI
training. The demo tiles in `godot/demos/*/fixture/` come from CSAF's own Verdant tilesets (each folder's NOTICE.txt names
them).

This volume is AI-generated: every shader, script and preset, the demos and the harbour were written by an AI.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
