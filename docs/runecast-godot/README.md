# Runecast for Godot 4: 48 Rune Casts Drawn in Code — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Runecast for Godot 4: 48 Rune Casts Drawn in Code  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-22


---

# Runecast for Godot 4

48 rune casts for Godot 4.7, every stone, carving and cloth drawn in code: 12 stone sets, each with its own
generated alphabet of 24 runes, cast in 4 spreads (Three Norns, Five-Stone Cross, Wheel of Eight, Full Scatter).
A cast returns a reading your game can act on: which runes fell, face up or blank, upright or reversed, and where.
No image files: every look is a parameter you can change.

## Install

1. Copy `addons/runecast/` into your project (keep the folder name).
2. Nothing to enable: the classes register themselves (`RuneCast2D`, `RunecastSet`, `RunecastSheet`, `RunecastGlyphs`,
   `RunecastPaint`).
3. Drop a preset into a scene (`addons/runecast/presets/<id>.tscn`), or add a `RuneCast2D` node and give it a set from
   `addons/runecast/sets/`.

Open `demo/demo.tscn` (the project's main scene) first: Left / Right change the stone set, Up / Down the spread,
Space or a click casts again, Tab shows the set's whole alphabet.

## Casting from code

```gdscript
var caster := RuneCast2D.new()
caster.rune_set = load("res://addons/runecast/sets/riverstone.tres")
caster.spread = "norns"            # norns, cross, wheel or scatter
add_child(caster)
var reading := caster.cast()       # the reading is ready at once; the stones then tumble onto the cloth
for stone in reading["read"]:       # face-up stones that landed on the cloth
    print(stone["name"], " ", stone["meaning"], " reversed" if stone["reversed"] else "", " in ", stone["slot"])
caster.cast_finished.connect(func(r): print(r["summary"]))
```

The reading is a Dictionary: `set`, `grammar`, `spread`, `seed`, `stones` (every stone thrown), `read` (the face-up
stones on the cloth) and `summary` (one line of text). Each stone is `index` (0-23), `name`, `meaning`, `face_up`,
`reversed`, `zone` (`heart`, `field`, `edge` or `off`), `slot` and `position`.

Glyph `index` i means the same thing in every set: `RuneCast2D.MEANINGS[i]` (journey, harvest, hearth, storm, gift,
oath, frost, kin, tide, ember, threshold, shadow, dawn, wound, crown, seed, wolf, mirror, bridge, silence, feast, debt,
star, return). Rune names differ per set; meanings do not, so your game logic works with any set.

Slots: `norns` = past, present, future. `cross` = self, above, ahead, below, behind. `wheel` = north, northeast, east,
southeast, south, southwest, west, northwest. `scatter` has no slots; read its `zone` instead.

A cast redraws only while its stones move; once the last one settles it is drawn once and left alone.

The same `cast_seed`, set and spread always fall the same way (a saved reading can be redrawn exactly).
`cast()` with no argument picks a new seed; `cast(1234)` uses that one.

Signals: `cast_started(reading)`, `stone_settled(stone)` (one per stone as it comes to rest), `cast_finished(reading)`.
Methods: `cast(seed = -1)`, `reading()`, `is_settled()`, `settle_now()`, `RuneCast2D.meaning_index(meaning)`.

## RuneCast2D parameters

| Parameter | What it does |
| --- | --- |
| `rune_set` | the RunecastSet: alphabet, stones, carving and cloth |
| `spread` | `norns` (3 stones), `cross` (5), `wheel` (8) or `scatter` |
| `scatter_count` | stones thrown in a scatter cast, 1 to 24 |
| `cast_seed` | the cast; the same seed always falls the same way |
| `cloth_radius` | size of the cloth in pixels (stones scale with it) |
| `stone_scale` | stone size on top of that |
| `speed` | throw speed: 2 throws twice as fast |
| `face_down_chance` | chance a stone lands blank side up |
| `reversed_chance` | chance a stone in a fixed spread lands upside down (scatter stones fall at any angle) |
| `carve_tint` | overrides the set's carving colour while its alpha is above 0 |
| `carve_intensity` | 0 a faint scratch, 1 the set's own look, 2 deep and bright |
| `show_cloth` | draw the cloth, or cast onto your own table art |
| `cast_on_ready` | throw once when the node enters the game (the editor always shows the settled cast) |

## RunecastSet parameters (one .tres per set)

| Parameter | What it does |
| --- | --- |
| `title` | the set's name |
| `grammar` | the rune grammar its alphabet is generated from |
| `alphabet_seed` | picks this alphabet's 24 glyphs from the grammar: change it for a new alphabet in the same script |
| `syllables` | the syllables rune names are built from |
| `stone_shape` | pebble, tile, stave, shard, disk, bone, coin, slate, bead, antler, clay or token |
| `stone_color` / `stone_light` / `stone_side` / `back_color` | the stone face, its highlight, its edge and its blank back |
| `carve_style` | incised, inlaid, painted, glow or burned |
| `carve_color` | the carving |
| `cloth_shape` | round, square, hide, tray, octagon or runner |
| `cloth_color` / `cloth_border` / `cloth_mark` | the cloth, its border band and its pattern |
| `cloth_pattern` | rings, stitch, knotwork, stars, sand or grain |

Grammars in this pack: stave, notch, orb, wedge, spiral, lattice, crescent, bind, brush, knot, pip, angle.

## RunecastSheet

Draws a set's whole alphabet face up in rows (a rune book page, a shop board). Parameters: `rune_set`, `columns`,
`stone_radius`, `spacing`, `font` (give it one to print names and meanings), `font_size`, `label_color`, `show_panel`,
`carve_tint`, `carve_intensity`.

## The 48 presets

Each preset is `addons/runecast/presets/<id>.tscn`: a RuneCast2D with a set, a spread and a seed.

| Set | Grammar | Stones | Cloth | Presets |
| --- | --- | --- | --- | --- |
| Riverstone Staves | stave | pebble | round | `riverstone_norns` `riverstone_cross` `riverstone_wheel` `riverstone_scatter` |
| Hazel Notch Staves | notch | stave | runner | `hazel_norns` `hazel_cross` `hazel_wheel` `hazel_scatter` |
| Moonbone Orbs | orb | bone | hide | `moonbone_norns` `moonbone_cross` `moonbone_wheel` `moonbone_scatter` |
| Kiln Wedges | wedge | clay | tray | `kiln_norns` `kiln_cross` `kiln_wheel` `kiln_scatter` |
| Tidepool Spirals | spiral | bead | octagon | `tidepool_norns` `tidepool_cross` `tidepool_wheel` `tidepool_scatter` |
| Iron Lattice | lattice | token | square | `iron_norns` `iron_cross` `iron_wheel` `iron_scatter` |
| Chalk Moon Slates | crescent | slate | round | `chalkmoon_norns` `chalkmoon_cross` `chalkmoon_wheel` `chalkmoon_scatter` |
| Antler Bindrunes | bind | antler | hide | `antler_norns` `antler_cross` `antler_wheel` `antler_scatter` |
| Ink Brush Tiles | brush | tile | square | `inkbrush_norns` `inkbrush_cross` `inkbrush_wheel` `inkbrush_scatter` |
| Witchknot Coins | knot | coin | octagon | `witchknot_norns` `witchknot_cross` `witchknot_wheel` `witchknot_scatter` |
| Obsidian Pips | pip | shard | hide | `obsidian_norns` `obsidian_cross` `obsidian_wheel` `obsidian_scatter` |
| Ember Angles | angle | disk | tray | `ember_norns` `ember_cross` `ember_wheel` `ember_scatter` |

## Renderers and versions

Run on Godot 4.7.2 under Forward+ and Compatibility (every preset photographed under both, zero error lines). The pack
is plain GDScript `_draw()` code with no shaders and no image files. Older Godot versions were not run.

Rune alphabets are generated by the pack; they are not historical scripts, and the readings are a game prop, not
fortune telling.

## Licence

See LICENSE.txt. The two demo fonts (demo/fonts/) are SIL OFL 1.1 and are not covered by the pack licence.

Made by Core Systems Asset Factory. The code is AI-written; see LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
