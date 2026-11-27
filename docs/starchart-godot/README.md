# Starchart: 48 Star Charts Drawn in Code for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Starchart: 48 Star Charts Drawn in Code for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-27


---

# Starchart for Godot 4

48 star charts for Godot 4.7, every ring, sign, body and aspect drawn in code: 12 chart styles in 4 chart
kinds (natal, dome, dial, astrolabe). A chart draws itself in front of the player (rings ink in, houses sweep round, signs stamp in,
bodies travel to their degrees, aspects draw last) and returns a reading your game can act on at once: the rising sign,
where each of seven bodies falls (sign and house), the aspects between them and the leading element.
No image files and no shaders: every look is a parameter you can change.

## Install

1. Copy `addons/starchart/` into your project (keep the folder name).
2. Nothing to enable: the classes register themselves (`StarChart2D`, `StarchartStyle`, `StarchartSheet`, `StarchartGlyphs`).
3. Drop a preset into a scene (`addons/starchart/presets/<id>.tscn`), or add a `StarChart2D` node and give it a style from
   `addons/starchart/styles/`.

Open `demo/demo.tscn` (the project's main scene) first: Left / Right change the style, Up / Down the chart kind,
Space or a click draws a new chart, Tab shows the style's whole vocabulary of signs and bodies.

## Drawing a chart from code

```gdscript
var chart := StarChart2D.new()
chart.chart_style = load("res://addons/starchart/styles/parchment.tres")
chart.kind = "natal"                # natal, dome, dial or astrolabe
chart.draw_on_ready = false
add_child(chart)
var reading := chart.draw_chart()   # the reading is ready at once; the chart then draws itself
print(reading["ascendant"]["sign_name"], " rising")
for body in reading["bodies"]:
    print(body["name"], " in ", body["sign_name"], ", house ", body["house"], " (", body["meaning"], ")")
chart.chart_finished.connect(func(r): print(r["summary"]))
```

The reading is a Dictionary: `style`, `kind`, `seed`, `date`, `ascendant`, `bodies`, `aspects`, `elements`, `dominant` and
`summary` (one line of text). Each body is `index` (0-6), `name`, `key`, `degree`, `sign` (0-11), `sign_name`, `meaning`,
`element`, `house` (1-12) and `retrograde`. Each aspect is `a`, `b` (body indexes), `type` (conjunction, sextile, square,
trine or opposition), `angle`, `orb` and `harmonious`; aspects come tightest first.

Sign `i` means the same thing in every style: `StarChart2D.MEANINGS[i]` (courage, endurance, wit, home, pride, craft, balance,
secrets, quest, ambition, vision, dreams), and its element is `StarChart2D.ELEMENTS[i % 4]` (fire, earth, air, water).
Body `i` carries the key `StarChart2D.BODY_KEYS[i]` (self, heart, word, love, strife, fortune, time). Sign and body names
differ per style (classic names, or a generated calendar's); meanings do not, so your game logic works with any style.

A chart redraws only the strokes still drawing: finished strokes are recorded once and left alone, and a finished chart
is not redrawn. Many charts drawing at the same moment are costly under Forward+ (fifty at once measured over 100 ms a
frame on the test machine, several times less under Compatibility); a handful at a time is the intended use.

The same `chart_seed`, style and kind always draw the same chart (a saved reading can be redrawn exactly).
`draw_chart()` with no argument picks a new seed; `draw_chart(1234)` uses that one. Set `use_date` and `date`
({year, month, day, hour}) to draw from a date instead.

Signals: `chart_started(reading)`, `ring_drawn(ring_name)`, `body_placed(body)` (one per body as it lands, in order),
`chart_finished(reading)`. Methods: `draw_chart(seed = -1)`, `reading()`, `is_drawn()`, `finish_now()`,
`StarChart2D.meaning_index(meaning)`.

## StarChart2D parameters

| Parameter | What it does |
| --- | --- |
| `chart_style` | the StarchartStyle: ground, inks, line mode, ornament and glyph vocabulary |
| `kind` | `natal` (the wheel), `dome` (a sky of constellations over a horizon), `dial` (sign plates and a hand) or `astrolabe` |
| `chart_seed` | the chart; the same seed always draws the same chart |
| `use_date` / `date` | draw from a date through the simple model below instead of the seed |
| `radius` | size of the chart in pixels (lines and glyphs scale with it) |
| `speed` | drawing speed: 2 draws twice as fast |
| `orb` | the widest gap in degrees an aspect may miss its exact angle by |
| `ink_tint` | overrides the style's ink while its alpha is above 0 |
| `show_ground` | draw the chart's ground, or draw onto your own art |
| `draw_on_ready` | draw once when the node enters the game (the editor always shows the finished chart) |

## StarchartStyle parameters (one .tres per style)

| Parameter | What it does |
| --- | --- |
| `title` | the style's name |
| `ground_color` / `ground_edge` | the chart's ground and its rim |
| `panes` | the colours a `glass` style fills its sign sectors and plates with |
| `ink` / `accent` / `glyph_color` | lines, the highlighted parts (axes, sun and moon, the ruling plate) and the glyphs |
| `aspect_soft` / `aspect_hard` | harmonious (sextile, trine) and tense (square, opposition) aspect lines |
| `line_width` | line weight at radius 140 |
| `line_mode` | `ink`, `glow`, `chalk`, `woodcut`, `glass` or `pixel` |
| `glow` | glow strength for the `glow` line mode |
| `ornament` | `none`, `dots`, `rays`, `scallops`, `stars` or `ticks` round the rim |
| `dust` | scattered star dust over the ground (0 none) |
| `vocabulary` | `classic` (the twelve traditional signs and seven bodies, drawn by code) or `generated` (a seeded calendar) |
| `grammar` | the stroke grammar of a generated calendar (0-11: orbit, spine, lattice, crescent, thorn, knot, comet, gate, wave, eye, crown, rune) |
| `calendar_seed` | picks the generated calendar's sigils and names: change it for a new calendar in the same grammar |

## StarchartSheet

Draws a style's whole vocabulary as a page: the twelve signs with their names and meaning keys, and the seven bodies
(a codex screen, a calendar, a sign picker). Parameters: `chart_style`, `glyph_size`, `font` (give it one to print names),
`font_size`, `show_ground`.

## The 48 presets

Each preset is `addons/starchart/presets/<id>.tscn`: a StarChart2D with a style, a kind and a seed.

| Style | Line | Glyphs | Presets |
| --- | --- | --- | --- |
| Parchment Ink | ink | classic | `parchment_natal` `parchment_dome` `parchment_dial` `parchment_astrolabe` |
| Brass Orrery | ink | classic | `brass_natal` `brass_dome` `brass_dial` `brass_astrolabe` |
| Midnight Gold | ink | classic | `midnight_natal` `midnight_dome` `midnight_dial` `midnight_astrolabe` |
| Woodcut Almanac | woodcut | generated | `woodcut_natal` `woodcut_dome` `woodcut_dial` `woodcut_astrolabe` |
| Blueprint | ink | generated | `blueprint_natal` `blueprint_dome` `blueprint_dial` `blueprint_astrolabe` |
| Stained Glass Rose | glass | classic | `glass_natal` `glass_dome` `glass_dial` `glass_astrolabe` |
| Chalkboard Lesson | chalk | generated | `chalk_natal` `chalk_dome` `chalk_dial` `chalk_astrolabe` |
| Nebula Glow | glow | generated | `nebula_natal` `nebula_dome` `nebula_dial` `nebula_astrolabe` |
| Bone and Blood | ink | generated | `bone_natal` `bone_dome` `bone_dial` `bone_astrolabe` |
| Carved Jade | ink | generated | `jade_natal` `jade_dome` `jade_dial` `jade_astrolabe` |
| Neon Horoscope | glow | generated | `neon_natal` `neon_dome` `neon_dial` `neon_astrolabe` |
| Pixel Sky | pixel | generated | `pixel_natal` `pixel_dome` `pixel_dial` `pixel_astrolabe` |

## Renderers and versions

Run on Godot 4.7.2 under Forward+ and Compatibility (every preset photographed under both, zero error lines). The pack
is plain GDScript `_draw()` code with no shaders and no image files. Older Godot versions were not run.

A game prop, not an ephemeris: positions come from the seed, or from a date through a simple mean-motion model (each body
a fixed period from the year 2000). They are not astronomically accurate and the readings are not real astrology.

## Licence

See LICENSE.txt. The two demo fonts (demo/fonts/) are SIL OFL 1.1 and are not covered by the pack licence.

Made by Core Systems Asset Factory. The code is AI-written; see LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
