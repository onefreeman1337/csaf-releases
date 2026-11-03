# Augury for Godot 4: 78 Tarot Cards Drawn in Code — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Augury for Godot 4: 78 Tarot Cards Drawn in Code  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Augury for Godot 4 - 78 Tarot Cards Drawn in Code

All 78 tarot cards, printed at runtime by GDScript `_draw()` code: 22 major arcana, 40 pip cards in authored
arrangements and 16 court cards, in 8 deck styles, upright or reversed, face up or face down, at any size, smooth or as
pixel cards. No card image ships in this addon: every face, frame, numeral and title is drawn from one corpus of shapes.
It comes with a card node, a seeded deck, four spreads and a PNG exporter for games on any other engine.

Made for Godot 4.7 (run on 4.7.2 under Forward+ and Compatibility). Older Godot 4 versions were not run.

## Install

1. Copy the folder `addons/augury/` into your project's `addons/` folder. There is no plugin to enable.
2. Use the cards from code or from the scenes in `addons/augury/cards/` (one scene per card).

Keep the folder at `addons/augury/`: the card scenes and the eight style files point at that path. If the folder is
moved or renamed, Augury prints one error naming the path it expected and prints the cards in Ivory.

The demo project in this folder (`godot/`) opens on `res://demo/demo.tscn`: the whole deck on a card table.
Demo keys: Left/Right page, S next style, R reversed, P pixel cards, F turn every card over, 1-4 deal a spread (single,
three, cross, road), Space reshuffle the spread, Tab back to the deck, E export this style to PNG.

## Use

```gdscript
var card := AuguryCard.new()
card.card_key = "major:moon"            # see "Card keys" below
card.style = AuguryStyle.named("midnight")
card.card_size = Vector2(172, 300)
add_child(card)
card.flip()                             # turn it over; emits flipped(face_up)
```

```gdscript
var deck := AuguryDeck.new(1234)        # the same seed always deals the same cards
deck.reversed_chance = 0.25
for c in deck.draw(3):                  # [{"key": "coin:queen", "reversed": false}, ...]
	print(AuguryCorpus.card(c["key"])["title"])
```

```gdscript
var spread := AugurySpread.new()
spread.layout = "cross"                 # "single", "three", "cross", "path"
spread.deck_seed = 7
add_child(spread)
spread.deal()                           # deals face down, then turns each card in order
```

Print a card into your own node from its `_draw()`:

```gdscript
func _draw() -> void:
	AuguryPaint.draw_card(self, "stave:10", Rect2(0, 0, 172, 300), AuguryStyle.named("ember"))
```

## Card keys

- Major arcana: `major:` + fool, magician, priestess, empress, emperor, hierophant, lovers, chariot, strength, hermit,
  wheel, justice, hanged, death, temperance, devil, tower, star, moon, sun, judgement, world.
- Minor arcana: suit `chalice`, `blade`, `coin` or `stave`, then `:` and a rank `1` (or `ace`) to `10`, or `page`,
  `knight`, `queen`, `king`. Examples: `chalice:3`, `blade:ace`, `coin:queen`.
- An empty key draws a blank card (the stock, panel and cartouche with nothing printed).
- `AuguryCorpus.keys()` lists all 78 in deck order; `AuguryCorpus.card(key)` returns the record (`cls`, `title`, `frame`,
  `suit`, `rank`, `court`, `trump`, `motif`).

## AuguryCard properties

| property | what it does |
| --- | --- |
| `card_key` | which card (above) |
| `style` | an `AuguryStyle`; empty = Ivory |
| `card_size` | size in pixels (tarot proportion is about 0.57 : 1) |
| `reversed` | illustration upside down and faded, REVERSED in the cartouche; majors take the mourning frame |
| `face_up` | face or the shared card back |
| `pixel_size` | 1 = smooth; 2 to 8 = printed that many times smaller and shown nearest-neighbour (pixel cards) |
| `caption` | a second line struck into the cartouche (a name, an owner); not shown on a reversed card |
| `hover_lift` | lift and deepen the shadow under the mouse; emit `clicked(card)` on a left click |
| `shadow` | a soft drop shadow |

Methods: `flip(to_face_up = null, seconds = 0.35)`, `get_rect()`, `info()`. Signals: `flipped(face_up)`, `clicked(card)`.

## Styles

Eight styles ship in `addons/augury/styles/`: ivory, midnight, ember, verdant, sanguine, frost, bone, violet. A style is
eight colours, one per role: `stock` (the paper), `ground` (the panel wash), `body` (the emblem), `cut` (the engraved cut
line), `halo` (thin strokes and the suit grounds), `accent` (the gilt), `ink` (titles) and `edge` (the card outline).
Duplicate a `.tres`, change the colours, and the whole deck reprints in your palette.

## Export PNG files (for any engine)

Open `addons/augury/export/export_deck.tscn`, set `styles`, `card_pixels` (default 344 x 600), `reversed` and
`pixel_size` in the Inspector, and run the scene (F6). It writes every card face plus the back, one PNG per card, to
`user://augury_png/<style>/` and prints the folder. From code: `await AuguryExporter.export_deck(node, dir, style, size)`.
Exporting needs a window: a headless run has no renderer and saves nothing. If `node` is freed while the job runs, the job
stops with a warning and returns the number of files written so far.

## What is inside

- `addons/augury/`: `augury_card.gd` (the card node), `augury_paint.gd` (the printer), `augury_corpus.gd` (the shapes:
  22 major motifs, 4 suit emblems, 4 suit grounds, 10 pip arrangements, 4 court postures, 6 frames), `augury_style.gd`,
  `augury_deck.gd`, `augury_spread.gd`, `augury_lettering.gd` (the engraved lettering; no font file ships),
  `augury_exporter.gd`, `cards/` (78 card scenes + `blank.tscn`), `styles/` (8), `export/`.
- `demo/`: the demo table.

## Renderers

Everything is 2D canvas drawing (no shaders), so Forward+, Mobile and Compatibility (web) print the same cards.

## Licence

See `LICENSE.txt`: use the cards in any number of your games; do not resell or redistribute the files or exported
images as a pack or deck. The pack is AI-generated (code and drawings), and the store page says so.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
