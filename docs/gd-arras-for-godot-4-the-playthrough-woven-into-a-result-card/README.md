# Arras for Godot 4: Your Playthrough Woven Into a Tapestry — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Arras for Godot 4: Your Playthrough Woven Into a Tapestry  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Arras for Godot 4 - your playthrough, woven into a tapestry

**For Godot 4.7** (made and tested on 4.7.2; older 4.x versions were not run). GDScript and one canvas shader, plain
readable text, no plugins to enable, no GDExtension, no image files.

Arras takes what a playthrough actually did and weaves it into a Bayeux-style embroidered hanging: one woven panel
per act, with figures, borders, a ground and a stitched Latin inscription naming the act in your own words. The
player opens it and scrolls along it, and it is different in every save file because it is made out of that save.
**48 scenes** over 16 figures, 12 props, 10 border registers, 5 grounds, 6 dye sets and a
23-letter stitched alphabet. Nothing in it is shipped art: every figure, border, letter and stitch is drawn at runtime.

---

## Install

1. Copy the `addons/arras/` folder into your project, keeping the path `res://addons/arras/` (the scripts find their
   shader there).
2. That is all. There is no plugin to enable; the classes `ArrasPanel`, `ArrasHanging`, `ArrasChronicle` and the rest are
   registered by name as soon as the folder is in the project.

The `demo/` folder and `project.godot` are the demo project: open `godot/` in Godot 4.7 and press Play.
Demo keys: Left / Right scroll · Space weaves the next act · D changes the dye set · G shows every scene · P saves a PNG.

## Quick start

```gdscript
# 1. Keep a chronicle with your save data and weave an act whenever something happens.
var chronicle := ArrasChronicle.new()
chronicle.weave("The oath at Roven")            # the scene is read from the words: an oath
chronicle.weave("Crossing the narrow sea")      # a voyage
chronicle.weave("Mournhold", "siege")           # or name the scene yourself

# 2. Show it: an ArrasHanging is a Control. Size it like any Control.
var hanging := ArrasHanging.new()
hanging.chronicle = chronicle
hanging.band_height = 300.0
hanging.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
add_child(hanging)

# 3. Save and load it with the rest of your game.
var data := chronicle.to_dict()                 # JSON-safe
chronicle = ArrasChronicle.from_dict(data)

# One panel on its own (a chapter card, a result screen):
var p := ArrasPanel.new()
p.scene_id = "wyrm"
p.title = "The wyrm of Cold Fell"
add_child(p)
await p.baked
p.save_png("user://cold_fell.png")
```

## What each act becomes

`ArrasChronicle.weave(title, scene = "")` freezes four things onto the act the moment it is woven:

- **a scene** - one of the 48 compositions below. Leave `scene` empty and Arras reads the title: each scene has a
  word list ("oath", "sworn", "pledge"...) and the scene with the most hits wins. Words match WHOLE words with plain
  endings: "burn" matches "burned" and "burning", never a name like "Burnley". A title it recognises nothing in still
  gets a scene, a stable one derived from the act itself, so acts named only by proper nouns still spread.
- **a border** - the scene's own register, or (about one act in five, `border_variety`) another of the ten.
- **a ground** - the scene's own, or occasionally another (`ground_variety`).
- **a seed** - which wools each figure is worked in and how every stitch drifts. Same act, same picture, every run.

They are frozen so a later version of Arras can never re-weave a hanging a player has already saved.

## The scenes

| # | id | scene | the Latin it opens with |
| --- | --- | --- | --- |
| 1 | `council` | the council (Court) | HIC CONSILIVM TENETVR |
| 2 | `oath` | the oath (Court) | VBI SACRAMENTVM FECIT |
| 3 | `judgement` | the judgement (Court) | VBI IVDICATVM EST |
| 4 | `coronation` | the crowning (Court) | HIC CORONATVS EST |
| 5 | `audience` | the envoys (Court) | HIC NVNTII AD REGEM VENIVNT |
| 6 | `proclamation` | the proclamation (Court) | HIC PRAECO CLAMAT |
| 7 | `battle` | the battle (War) | HIC CECIDERVNT IN PROELIO |
| 8 | `siege` | the siege (War) | HIC CASTELLVM OPPVGNATVR |
| 9 | `march` | the march (War) | HIC MILITES PERGVNT |
| 10 | `duel` | the duel (War) | HIC DVO MILITES CERTANT |
| 11 | `ambush` | the ambush (War) | HIC INSIDIAE PARANTVR |
| 12 | `burning` | the burning (War) | HIC DOMVS INCENDITVR |
| 13 | `voyage` | the crossing (Water) | HIC MARE TRANSIERVNT |
| 14 | `landing` | the landing (Water) | HIC NAVES VENERVNT AD TERRAM |
| 15 | `storm` | the storm (Water) | HIC TEMPESTAS ORTA EST |
| 16 | `bridge` | the bridge (Water) | HIC PONS TRANSITVR |
| 17 | `harbour` | the harbour market (Water) | HIC IN PORTV MERCANTVR |
| 18 | `shipwright` | the shipwrights (Water) | HIC NAVES AEDIFICANTVR |
| 19 | `works` | the works (Work and trade) | ISTI OPERANTVR |
| 20 | `forge` | the forge (Work and trade) | HIC FABER FERRVM FORMAT |
| 21 | `ploughing` | the ploughing (Work and trade) | HIC TERRA ARATVR |
| 22 | `market` | the fair (Work and trade) | HIC MERCATVM HABETVR |
| 23 | `treasury` | the counting (Work and trade) | HIC THESAVRVS NVMERATVR |
| 24 | `raising` | the raising of the hall (Work and trade) | HIC AVLA AEDIFICATVR |
| 25 | `feast` | the feast (Feast and faith) | HIC EPVLANTVR |
| 26 | `wedding` | the wedding (Feast and faith) | HIC NVPTIAE CELEBRANTVR |
| 27 | `blessing` | the blessing of the fleet (Feast and faith) | HIC EPISCOPVS NAVES BENEDICIT |
| 28 | `healing` | the healing (Feast and faith) | HIC AEGROTVS SANATVR |
| 29 | `pilgrimage` | the pilgrimage (Feast and faith) | HIC PEREGRINI AMBVLANT |
| 30 | `vigil` | the vigil (Feast and faith) | HIC VIGILANT ET ORANT |
| 31 | `errand` | the errand (The road) | HIC NVNTIVS VENIT |
| 32 | `journey` | the journey (The road) | HIC IN VIA SVNT |
| 33 | `hunt` | the hunt (The road) | HIC VENANTVR |
| 34 | `watch` | the watch (The road) | HIC SPECVLATOR VIGILAT |
| 35 | `arrival` | the homecoming (The road) | HIC AD AVLAM VENIT |
| 36 | `exile` | the exile (The road) | HIC IN EXILIVM EVNT |
| 37 | `omen` | the omen (Lore and omen) | ISTI MIRANTVR STELLAM |
| 38 | `study` | the writing (Lore and omen) | HIC LIBER SCRIBITVR |
| 39 | `prophecy` | the prophecy (Lore and omen) | HIC PROPHETA LOQVITVR |
| 40 | `treaty` | the treaty (Lore and omen) | HIC PAX FACTA EST |
| 41 | `finding` | the finding (Lore and omen) | HIC THESAVRVS INVENTVS EST |
| 42 | `letter` | the letter (Lore and omen) | HIC LITTERAE MITTVNTVR |
| 43 | `wyrm` | the wyrm (Beasts and peril) | HIC CVM DRACONE PVGNAT |
| 44 | `lair` | the lair (Beasts and peril) | HIC DRACO THESAVRVM CVSTODIT |
| 45 | `taming` | the taming (Beasts and peril) | HIC DRACO MANSVETVR |
| 46 | `flight` | the flight (Beasts and peril) | HIC FVGIVNT |
| 47 | `muster` | the muster (Beasts and peril) | HIC EXERCITVS CONVENIT |
| 48 | `beacon` | the beacon (Beasts and peril) | HIC IGNIS ACCENDITVR |

Each is also a ready scene file: `addons/arras/scenes/NN_<id>.tscn` (an ArrasPanel with that scene and a sample act).

## ArrasPanel (Node2D) - one panel

| property | what it does |
| --- | --- |
| `scene_id` | the scene to weave; `""` weaves the bare panel (linen, ground and borders) |
| `title` | the act's own words, stitched after the scene's Latin formula |
| `dye_set` | `bayeux`, `northlands`, `harvest`, `verdigris`, `crownlands`, `ashland` |
| `panel_height` | height in px, borders included; the panel is 1.75 times as wide |
| `border_override` | "" keeps the scene's own, or one of `vine`, `hounds`, `birds`, `interlace`, `lozenge`, `tillage`, `fishes`, `wyverns`, `tools`, `wave` |
| `ground_override` | "" keeps the scene's own, or one of `plain`, `stacked`, `hill`, `water`, `pavement` |
| `seed_text` | the seed for wools and stitch drift ("" = the scene id) |
| `show_inscription` | draw the inscription band |
| `centered` | centre on the node, or top-left at the node |
| `supersample` | 2 stitches at twice the size and shows at 1x (smooth thread edges); 1 is cheaper |

Methods: `rebuild()`, `get_image(full_res = false) -> Image`, `save_png(path, full_res = false) -> Error`. Signal: `baked`
(the picture is on screen). `report` holds what the last bake drew (scene, cast, figure height, whether the inscription fit).

## ArrasHanging (Control) - the whole hanging

| property | what it does |
| --- | --- |
| `chronicle` | the ArrasChronicle it shows (a new one is made if empty); weaving into it re-lays the hanging |
| `band_height` | height of the woven band in px (the rod and fringe add about a fifth) |
| `keyboard` | scroll with `ui_left` / `ui_right` / `ui_page_up` / `ui_page_down` and the wheel; drag with the mouse |
| `scroll_speed` | px per second for held keys |
| `margin_panels` | panels kept stitched on each side of the view (only the panels near the view are ever stitched) |
| `supersample` | as on ArrasPanel |

Methods: `weave(title, scene = "")` (adds the act and scrolls to it), `scroll_to_act(i, instant = false)`, `scroll_by(px)`,
`panel_width()`, `await save_png(path, from = 0, count = -1)` (a PNG strip of acts, at most 16384 px wide). Signal:
`act_focused(index)`. The borders run on from panel to panel, so it reads as one hanging, not a row of pictures.

## ArrasChronicle (Resource) - the record

`dye_set`, `max_acts` (older acts fall off the left end; 40 is a long game), `acts` (each a Dictionary: id, title, scene,
border, ground, seed, matched, at), `border_variety`, `ground_variety`. Methods: `weave(title, scene = "", id = "")`,
`static classify(title, seed = "")`, `clear()`, `to_dict()`, `static from_dict(d)`. Signal: `woven(act)`. Every field is
exported, so a chronicle also saves as a `.tres`. `from_dict` reads a file written by a newer Arras as far as it understands
it rather than resetting it, and an act whose scene a corpus lacks is re-read from its words.

## The lettering

The inscription is not set in a font. It is stitched letter by letter from stroke centrelines in the classical Latin
alphabet of twenty-three letters, so your text is folded the way the tapestry folds it: **J to I, U to V, W to VV**
("Winterhall" is stitched VVINTERHALL). Commas become the raised point. Digits and other symbols have no letterform and
are left out rather than drawn as gaps; use `ArrasCorpus.roman(n)` for numbers. A title too long for the band is fitted
by tightening the letter spacing, then shrinking the letters; `report.inscription.fits` says if it still did not fit.

## The dye sets

- **Bayeux** (`bayeux`) - the eight historical wools: madder, weld and woad on bleached linen.
- **Northlands** (`northlands`) - cold blues and slates over grey flax, with one rust to carry the eye.
- **Harvest** (`harvest`) - madder, saffron and umber on a warm unbleached ground.
- **Verdigris** (`verdigris`) - copper greens and sea colours on pale flax.
- **Crownlands** (`crownlands`) - indigo, gold and vermilion - the hanging made for a hall.
- **Ashland** (`ashland`) - a hanging that has been on the wall three hundred years.

Colour is deliberately arbitrary within a set, the way it is on the real thing. A figure is told apart by its pose and
what it carries, never by its colour, which is why every scene reads in every dye set.

## Renderers and cost

Tested under **Forward+ and Compatibility** (OpenGL 3, the web renderer) on Godot 4.7.2: every scene photographed under
both with zero engine error lines. Mobile was also run.

A panel is stitched once, when it is woven or scrolls into view: about 20 to 50 ms of GDScript per panel on the
test machine (all 48 scenes at the 264 px preset size, under Forward+ and Compatibility; so the first frame a panel appears on can take that long). After that it is one texture: scrolling a 40-act hanging end to end measured a median frame of under 3 ms with vsync off, on both renderers.

## What Arras does not do

It does not record deaths, and it does not animate the figures: it is a record, worked in thread. It has no digits.
It does not save itself: put `chronicle.to_dict()` in your own save file (or save the chronicle as a resource).

---

Made by Core Systems Asset Factory. AI-generated code and art; see LICENSE.txt. Support: post on the itch.io page.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
