# Fogbank: 2D Fog of War in 48 Looks for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Fogbank: 2D Fog of War in 48 Looks for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Fogbank - 2D Fog of War in 48 Generated Looks for Godot 4

Fog of war for 2D Godot games: what the player has not seen is hidden, what they have seen is remembered, and what they
can see right now is clear. Walls block sight. And the fog itself comes in 48 looks, every one computed while the game
runs: smoke, a sea of clouds seen from above, storm fronts, sand, ash, toxic gas, frost, night with stars, steam, pollen,
deep water; parchment, torn paper, a burning map, ink wash, watercolour, pencil hatching, a blueprint, a sea chart,
linen, a woodcut, gilded vellum, stained glass; square tiles, hex clouds, hex tiles, a 1-bit dither, chunky handheld
pixels, isometric diamonds, low poly, a game board, a tactical radar, halftone, masonry, mosaic; and a void, a starfield,
aurora, a shadow realm, ice crystals, a hologram, static, blood mist, a holy veil, ghost fire, embers and rune wards.

Nothing is a frame sheet or a painted fog texture. The visibility is a small mask computed from your revealers and walls;
each look is a shader over it; every colour, size, speed and edge is a parameter in the inspector.

- **Godot version:** built and tested on **Godot 4.7.2**, under **both renderers: Forward+ and Compatibility**
  (Compatibility is the one web exports use). Older 4.x versions were NOT run, so they are not claimed.
- **What is in the box:** 48 looks (`looks/weather`, `looks/paper`, `looks/grid`, `looks/arcane`, twelve each, as
  `FogLook` resources), a drop-in `FogBank` scene per look (`presets/<id>.tscn`), three classes (`FogBank`,
  `FogRevealer`, `FogLook`), `FogbankCatalog`, four family shaders and their shared core, and a demo crypt to try them in.

## Install

1. Copy `godot/addons/fogbank/` into your project's `addons/` folder (you get `res://addons/fogbank/`).
2. That is all: no plugin to enable. The classes register themselves. Keep the folder name: the looks and preset scenes
   reference `res://addons/fogbank/` by path.

To browse everything first, open the `godot/` folder as a project in Godot 4.7 and press Play (keys below).

## Use it

```gdscript
# one FogBank over the level, after the map in the tree (or above it by z_index)
var fog := FogbankCatalog.instantiate("cloud_sea")
fog.fog_rect = Rect2(0, 0, 1024, 768)      # the area it covers, in the FogBank's own coordinates
fog.wall_layer = $Walls                    # optional: a TileMapLayer whose wall tiles block sight
add_child(fog)

# anything that sees: a radius...
var eyes := FogRevealer.new()
eyes.radius = 120.0
$Player.add_child(eyes)

# ...or a flashlight cone with a small circle of peripheral sight
var torch := FogRevealer.new()
torch.cone_degrees = 70.0
torch.radius = 200.0
torch.near_radius = 24.0
$Player.add_child(torch)
```

Or in the editor: drag `addons/fogbank/presets/<id>.tscn` into your level, set `fog_rect`, and add a `FogRevealer`
child to your player.

### Walls

`FogBank.wall_layer` reads a `TileMapLayer`. If its TileSet has a custom data layer named `fog_blocks` (type bool; the
name is `wall_data`), only tiles with it set to true block sight. If it has no such layer, every used cell blocks sight.
Polygon2D, LightOccluder2D and CollisionPolygon2D nodes in the group `fogbank_wall` block sight too. Call
`rebuild_walls()` after you change them. A revealer with `sees_through_walls` ignores walls.

### Memory (`FogBank.memory`)

- `NONE` - line of sight only: anything out of sight is fog again.
- `DIM` - explored ground stays visible, re-graded by the look (desaturated, tinted, darkened, or under a thin layer of
  that fog, as with cloud sea, frost breath, pollen haze and linen): the classic strategy-game "seen before" state.
  Default.
- `KEEP` - explored ground stays fully clear.
- `FADE` - explored ground slowly returns to fog over `forget_seconds`.

### The API

| call | what it does |
| --- | --- |
| `visibility_at(world) -> float` / `is_visible_at(world) -> bool` | how clearly a point is in sight now |
| `is_explored_at(world) -> bool` | seen at some time |
| `explored_ratio() -> float` | share of open cells explored (walls excluded); signal `explored_changed(ratio)` |
| `reveal_circle(world, radius, through_walls)` | mark a circle explored (a flare, a map scroll) |
| `reveal_rect(world_rect)` / `reveal_tile(layer, coords)` | mark a rectangle or one tile explored (grid and turn-based games) |
| `trace_path(points, radius, through_walls)` | explore along a path, as if a revealer had walked it |
| `reveal_all()` / `reset()` | everything explored / forget everything |
| `get_state() -> PackedByteArray` / `set_state(bytes) -> bool` | the explored memory for your save file |
| `rebuild_walls()` | re-read the walls |
| `seek(t)` | set the look's animation time |
| `get_mask_texture()` | the mask (R visible, G explored, B wall) for your own shaders |

`FogRevealer`: `radius`, `cone_degrees` (360 = all round), `facing`, `auto_face` (point the cone the way it moves),
`face(dir)`, `near_radius`, `softness`, `strength`, `sees_through_walls`, `enabled`.

`FogbankCatalog`: `look(id) -> FogLook` (a fresh copy you can edit), `instantiate(id) -> FogBank`,
`ids_for_family(family)`, `PRESETS`, `FAMILIES`.

### Every parameter of a look (`FogLook`)

`family` (WEATHER, PAPER, GRID, ARCANE) and `style` (0-11) choose the look's code; the rest are parameters:
`fog_color` (the body), `accent_color` (the style's glow, rim, line or second hue), `memory_color` (the tint of
remembered ground), `density` (1 = solid; lower it for a see-through mist), `memory_strength`, `scale` (feature size),
`drift` (wind, pixels per second), `speed` (animation), `edge` (how soft the boundary is), `edge_noise` (how much the
style's own texture shapes the boundary), `noise_seed`. A recolour is these sliders, not another preset.

### FogBank settings

`look`, `fog_rect`, `cell_size` (world pixels per mask cell, default 8: smaller is finer and costs more CPU), `memory`,
`forget_seconds`, `wall_layer`, `wall_data`, `wall_group`, `revealer_group`, `preview_time`.

## The 48 looks

- **Weather:** `smoke`, `cloud_sea`, `river_mist`, `storm_front`, `sandstorm`, `ash_fall`, `toxic_miasma`,
  `frost_breath`, `night_shroud`, `steam_vents`, `pollen_haze`, `deep_water`
- **Paper and maps:** `parchment`, `torn_paper`, `burnt_map`, `ink_wash`, `watercolour`, `pencil_hatch`, `blueprint`,
  `sea_chart`, `linen_cloth`, `woodcut`, `gilded_vellum`, `stained_glass`
- **Grids and pixels:** `square_tiles`, `hex_clouds`, `hex_tiles`, `pixel_dither`, `pixel_stair`, `iso_diamonds`,
  `low_poly`, `checkerboard`, `tactical_scan`, `halftone`, `dungeon_masonry`, `mosaic`
- **Arcane:** `void_tendrils`, `starfield`, `aurora_veil`, `shadow_realm`, `crystal_frost`, `hologram`, `static`,
  `blood_mist`, `holy_veil`, `ghost_fire`, `ember_veil`, `rune_ward`

## The demo

Open `godot/` as a project and press Play. WASD or the arrow keys walk the explorer through the crypt. Tab, Q and E change
the look (all 48), M cycles the memory mode, C switches between a lantern radius and a flashlight cone aimed with the
mouse, F reveals the whole map, R forgets everything, G marks the tile under the mouse explored.

## Notes

- **Renderers:** every look compiles and draws under Forward+ and Compatibility (measured on Godot 4.7.2). The fog reads
  the screen behind it (to re-grade remembered ground), so a FogBank must be drawn after the map.
- **CanvasModulate:** remembered ground is drawn from the screen it reads, so under a CanvasModulate night that ground
  is modulated once more and reads darker. Ground in sight is never touched (the fog's alpha is 0 there).
- **Cost (measured):** sight is computed on the CPU, in GDScript, and only when a revealer moves, turns or changes; a
  revealer standing still costs nothing. On the test machine, with a 2560 x 1440 fog at the default 8 px cell, one
  revealer moving every frame averaged about 4 ms per frame and eight moving every frame about 14 ms per frame, under
  both renderers, with no single frame over 40 ms; timings vary run to run. For many moving units or a huge map, raise `cell_size` (16 px is a quarter of the work). Keep the
  FogBank unrotated and unscaled.
- The demo crypt's tiles are from Verdant 05 Depths by the same studio (see `godot/demo/crypt/NOTICE.txt`).

## AI disclosure

This pack is AI-generated: every shader, scene and script, and the demo, was written by an AI. Graphics: the store
images and cover are generated. No audio. See LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
