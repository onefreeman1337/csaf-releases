# Sigil Core for Godot 4: 60 Procedural Magic Circles — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Sigil Core for Godot 4: 60 Procedural Magic Circles  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Sigil Core for Godot 4 - Procedural Magic Circles and Spell Seals

60 magic circles for Godot 4 games, drawn live by one shader: rings, tick bands, polygon and star figures, spokes, rune
bands and a core glyph, in six schools (Ember, Tide, Gale, Stone, Radiance, Umbra). Every seal **casts** (draws itself on,
layer by layer), **holds** (layers counter-rotate and breathe) and **breaks** (cracks by sector and scatters). No images
ship: each seal is a scene whose shader parameters you can change, and a palette resource recolours it.

- **Godot version:** built and tested on **Godot 4.7.2**, under **both renderers: Forward+ and Compatibility**
  (Compatibility is the one web exports use). Older 4.x versions were NOT run, so they are not claimed.
- **What is in the box:** 60 seal scenes, the seal shader, 6 school palettes, the `SigilEffect` controller, the
  `SigilCatalog` index and a demo browser.

## Install

1. Copy `godot/addons/sigil_core/` into your project's `addons/` folder (you get `res://addons/sigil_core/`).
2. That is all: no plugin to enable. The classes `SigilEffect`, `SigilPalette` and `SigilCatalog` register themselves.

To browse everything first, open the `godot/` folder as a project in Godot 4.7 and press Play.

## Use a seal

```gdscript
var seal := SigilCatalog.instantiate("ember_03")
seal.position = caster.global_position
add_child(seal)              # casts on its own (autoplay)
# ... when the spell fires:
seal.free_when_broken = true
seal.break_seal()
```

Or drag a scene from `res://addons/sigil_core/seals/<school>/` into your scene.

| method / signal | what it does |
| --- | --- |
| `cast()` | draw the seal on from nothing over `cast_time`, then hold |
| `hold()` | show the seal fully drawn and holding, no cast |
| `break_seal()` | crack and scatter over `break_time`, then hide (and free, if `free_when_broken`) |
| `stop()` | hide immediately |
| `is_active()` | true while casting, holding or breaking |
| `seek(state, amount)`, `seek_preview()` | freeze on a moment (stills, thumbnails) |
| `cast_finished`, `broken` | signals |

Exported parameters on every seal: `palette`, `cast_time`, `break_time`, `autoplay`, `speed_scale`, `effect_scale`,
`intensity`, `additive` (1 = pure light, 0 = normal blending for bright backgrounds), `spin` (layer rotation while
holding), `squash` (1 = facing the camera; lower lays the seal on the ground in perspective, for an area marker),
`free_when_broken`, `preview_time`, `editor_preview`.

**Shape parameters** live on each seal's `Seal` node material and change the seal itself: `ring_count`, `ring_style`
(0 solid, 1 dashed, 2 wavy, 3 double, 4 dotted), `ticks` and `tick_style` (0 lines, 1 flame points, 2 dots), `poly_n`
and `poly_step` (a polygon when the step is 1, a star like 5/2 or 7/3 when it is more), `poly_layers` (a second figure
turned half a step), `spokes`, `rune_bands` and `rune_cells`, `core_glyph` (any number 0 to 255 is a different glyph),
`node_dots`, `line_width`, `glow`, `fill`, `seed`. Changing these is how you make your own seals.

## The 60 seals

Ids are `<school>_01` to `<school>_10`; scenes are `res://addons/sigil_core/seals/<school>/<id>.tscn`.

- **Ember** (star figures, flame-point ticks): Kindle, Pyre Ward, Cinder Oath, Ashen Crown, Brand, Hearth Seal, Flare
  Rite, Smoulder, Wildfire, Phoenix Sign.
- **Tide** (wavy rings, dot ticks): Undertow, Tidewall, Brine Lock, Fathom, Riptide, Still Water, Moon Pull, Deluge,
  Shoal Sign, Pearl Gate.
- **Gale** (dashed rings, spokes): Zephyr, Updraft, Cyclone Mark, Kite Rune, Squall, Wind Lattice, Feather Fall, Gust
  Bind, Skyward, Tempest Eye.
- **Stone** (double rings, polygons, heavier lines): Bulwark, Keystone, Monolith, Rampart, Quarry Sign, Bedrock, Cairn
  Ward, Fault Line, Granite Oath, Pillar Rite.
- **Radiance** (dotted rings, many spokes): Dawnbreak, Halo, Sunwell, Lumen, Benediction, Aureole, Zenith, Clarion,
  Sanctum, Glory Sign.
- **Umbra** (doubled figures, two rune bands): Eclipse, Hollow Gate, Nightbind, Gloam, Void Script, Shade Pact,
  Penumbra, Black Lantern, Wraith Seal, Null Sign.

`SigilCatalog.SEALS` lists every id with its school and name; `SigilCatalog.ids_for_school("tide")` returns one school.

## Demo controls

Left / Right school · Tab shows all 60 at once · C casts everything on screen · B breaks it · H holds every seal on its
showcase frame · P cycles the palette · Click casts the seal under the mouse at the mouse · F12 saves a screenshot.

## Notes

- Each seal is one quad with one shader; cost grows with the pixels it covers.
- The shader is `unshaded`: 2D lights do not darken a seal (it is its own light).

## Licence and AI disclosure

See `LICENSE.txt`. Use in any number of your games, commercial or free; no resale or redistribution of the files as a
pack. This pack is AI-generated: the shader, scenes and scripts were written by an AI.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
