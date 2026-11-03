# Verdigris: 48 Material Ageing Shaders for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Verdigris: 48 Material Ageing Shaders for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Verdigris - 48 Material Ageing Shaders for Godot 4

48 shaders that age your own 2D art while the game runs: rust blooming out of the rivets, copper going green, frost
creeping in from the edges, snow settling on top, moss and ivy taking a wall, paint peeling, soot rising, a statue turning
to stone. Each state is grown by ONE number, `age`, from 0 (your sprite, untouched) to 1 (fully taken), so a gate can rust
across a campaign, a hull can gather barnacles with the days at sea, or a cursed relic can blacken as the player's
corruption rises. The shaders read your sprite's own pixels (its silhouette edges, the faces that look up or down, its
dark crevices) so the ageing lands where it would in life. Nothing is painted in advance: every state is computed at
runtime and recoloured with three colour parameters.

- **Godot version:** built and tested on **Godot 4.7.2**, under **both renderers: Forward+ and Compatibility**
  (Compatibility is the one web exports use). Older 4.x versions were NOT run, so they are not claimed.
- **What is in the box:** 48 preset materials over four shaders (corrosion, frost, growth, wear), a preview scene per
  preset, the `Verdigris` catalogue class, the `VerdigrisAger` node, five sample props (a shield, a bell, a stone stele, a
  door and a pixel-art shield) and a demo.

## Install

1. Copy `godot/addons/verdigris/` into your project's `addons/` folder (you get `res://addons/verdigris/`).
2. That is all: no plugin to enable. The classes `Verdigris`, `VerdigrisAger` and `VerdigrisSample` register themselves.

To browse everything first, open the `godot/` folder as a project in Godot 4.7 and press Play.

## Use it

Drag a material from `res://addons/verdigris/materials/<group>/<id>.tres` onto the Material slot of any textured
CanvasItem: a `Sprite2D`, an `AnimatedSprite2D`, a `TileMapLayer` or a `TextureRect`. Then move its `age`. Or in code:

```gdscript
Verdigris.apply($Gate, "rust_bloom", 0.0)     # a private copy of the preset, starting untouched
Verdigris.set_age($Gate, 0.8)                 # ...later, rusted

var ager := VerdigrisAger.new()               # or add a VerdigrisAger node as a child in the editor
$Statue.add_child(ager)
ager.set_preset("petrify")
ager.age_to(1.0, 6.0)                         # turn to stone over six seconds
ager.drive(days_at_sea, 0, 90)                # or follow a number you already track
```

| member | what it does |
| --- | --- |
| `Verdigris.apply(item, id, age = -1)` | puts a private copy of preset `id` on `item` and returns the ShaderMaterial (age < 0 keeps the preset's own) |
| `Verdigris.set_age(item, age)`, `get_age(item)` | set / read the age of the Verdigris material on `item` |
| `Verdigris.material(id)`, `info(id)`, `ids()`, `ids_for_group(group)`, `PRESETS`, `GROUPS` | the catalogue |
| `VerdigrisAger.age` | 0..1; setting it pushes to the target's material |
| `age_to(value, seconds)`, `age_by(delta)`, `drive(value, from, to)`, `set_preset(id)` | tween, nudge, map a game value, swap the state |
| `aged(value)`, `age_reached(value)` | signals: every change; the end of an `age_to` |
| VerdigrisAger exports `target`, `make_unique`, `preset` | the node it drives (empty = its parent), copy the material on ready, a preset to put on at ready |

Shader parameters, on every preset material:

| parameter | what it does |
| --- | --- |
| `age` | 0 = untouched, 1 = fully taken. The one value you animate. |
| `amount` | 0..1 blend of the whole effect over your sprite |
| `col_a`, `col_b`, `col_c` | the state's body, dark and light colours: the recolour |
| `scale` | pattern size (0.25..4) |
| `reach` | how far, in texture pixels, the shader looks for edges, tops and crevices (1..32) |
| `pixel_size` | 0 = smooth; 1 or more snaps every pattern to blocks of that many texture pixels, for pixel art |
| `seed` | a different but equivalent pattern |
| `animate` | 0..1; the few living states (blight's pulse, scorch's embers) move with it, 0 freezes them |
| `kind` | which of the shader's twelve states this is; changing it turns one preset into another of the same shader |

A recolour is a change of `col_a` / `col_b` / `col_c`; it is never counted as a preset.

## The 48 presets

Ids, by group (material: `res://addons/verdigris/materials/<group>/<id>.tres`; preview scene:
`res://addons/verdigris/presets/<group>/<id>.tscn`):

- **corrosion:** `rust_bloom`, `scale_rust`, `rust_streaks`, `verdigris`, `bronze_patina`, `tarnish`, `gilded`, `pitting`,
  `white_rust`, `heat_tint`, `acid_etch`, `blackened`.
- **frost:** `hoarfrost`, `rime`, `ice_glaze`, `frozen_solid`, `snow_cap`, `needle_frost`, `icicles`, `permafrost`,
  `frostbite`, `sleet`, `ice_crystals`, `thaw`.
- **growth:** `moss`, `lichen`, `ivy`, `mould`, `algae`, `barnacles`, `mushrooms`, `wildflowers`, `rot`, `roots`, `geodes`,
  `blight`.
- **wear:** `peeling_paint`, `scratches`, `cracks`, `chipped`, `sun_bleach`, `soot`, `scorch`, `water_stains`, `dust`,
  `salt_crust`, `petrify`, `crumble`.

## Good to know

- **Leave a transparent border around art that should grow outward.** `snow_cap` piles snow above top edges, `icicles`
  hang below bottom edges, `ice_crystals` grow shards out of the silhouette and `moss` tufts up past top edges: they draw
  into the empty pixels of your texture, so a sprite cropped tight to its art has nowhere to put them.
- **Edges come from transparency.** On a fully opaque texture (most tiles), the edge-led states fall back to their noise
  and crevice placement.
- **Some states rise from the bottom of the texture** (`ivy`, `algae`, `barnacles`, `mushrooms`, `rot`, `roots`, `soot`,
  `scorch`, `water_stains`, `salt_crust`). On a single sprite or Control that is the object's bottom; on a `TileMapLayer`
  it is the bottom of each tile.
- **Patterns are laid in the node's local pixels**, so they stay put when the node moves, keep their size from sprite to
  sprite, and do not repeat tile by tile across a `TileMapLayer`.
- `chipped` and `crumble` remove pixels (alpha) only; collision shapes are not changed.
- One material per CanvasItem (Godot's rule): to wear two states at once, put one on the node and one on a child copy.
- Pixel art: set `pixel_size` to 1 and lower `reach` and `scale` (the demo uses 1, 2.5 and 0.25 on its 64 px shield).

## Demo controls

Left / Right preset · Up / Down group · 1-5 shield, bell, stele, door, pixel-art shield · Space sweep the age 0 to 1 ·
[ / ] age -0.05 / +0.05, or drag the bar · H help line.

## Licence and AI disclosure

See `LICENSE.txt`. Use in any number of your games, commercial or free; no resale or redistribution of the files as a
pack. This pack is AI-generated: the shaders, scenes and scripts were written by an AI, and the five sample props were
painted by code the same AI wrote.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
