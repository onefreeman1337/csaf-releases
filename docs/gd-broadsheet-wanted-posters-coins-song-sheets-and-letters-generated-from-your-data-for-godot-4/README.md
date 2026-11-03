# Broadsheet: 48 Letters, Notices and Coins for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Broadsheet: 48 Letters, Notices and Coins for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Broadsheet for Godot 4

**Letters, notices and coins drawn from your game's data.** Version 1.0.1, for Godot 4.7. 48 presets: 16 letters, 16 notices, 16 coins.

Hand it a name, a sum, a few lines of text or a portrait and it draws the document your players read: a letter in
one of 12 hands on generated paper, sealed in wax; a wanted poster with your character printed as a woodcut;
a coin with your king struck in gold. Nothing is a picture you have to paint. Every stroke of handwriting is a broad nib
swept along an authored skeleton, the paper is a shader (tooth, fibres, chain lines, age, foxing, water, scorch,
creases), the printed picture is a shader over YOUR texture, and every seal and coin is a height buffer lit as wax,
metal or stone. No font file ships: every letter is drawn.

## What is in the box

| | |
| --- | --- |
| `addons/broadsheet/broadsheet_letter.gd` | `BroadsheetLetter`: a handwritten letter, note, ledger, telegram, postcard, envelope, scroll or diary page. |
| `addons/broadsheet/broadsheet_notice.gd` | `BroadsheetNotice`: a printed poster, bill, notice, newspaper, form or chalkboard. |
| `addons/broadsheet/broadsheet_coin.gd` | `BroadsheetCoin`: a struck coin, token, pair, stack or medal. |
| `addons/broadsheet/broadsheet_document.gd` | `BroadsheetDocument`: what the three share (presets, data, baking, PNG export). |
| `addons/broadsheet/broadsheet_pen.gd`, `broadsheet_type.gd` | The pen (handwriting, devices) and the printed type (8 faces). |
| `addons/broadsheet/broadsheet_paper.gd`, `broadsheet_relief.gd` | Sheet outlines + paper/ink materials; struck and pressed relief. |
| `addons/broadsheet/broadsheet_corpus.gd` | The authored corpus: hands, glyphs, type, devices, stocks, waxes, metals, the presets. |
| `addons/broadsheet/shaders/` | `bs_paper`, `bs_ink`, `bs_print`, `bs_relief`, `bs_height_tex`, `bs_display` (+ `bs_common.gdshaderinc`). |
| `addons/broadsheet/presets/` | 48 preset scenes (`letters/`, `notices/`, `coins/`). |
| `addons/broadsheet/demo_art/` | Seven painted demo pictures the presets print and strike (barbarian, rogue, ranger, knight, witch, ogre, wyvern). |
| `demo/demo.tscn` | Every preset on a desk: Left/Right browse, Up/Down jump kind, V a new variation, E export a PNG. |

The corpus: 12 hands over 84 glyph skeletons, 8 type faces, 24 devices, 20 paper stocks, 10 waxes, 9 metals (and one stone), 12 postmarks, 8 picture treatments.

## Install

1. Copy the `addons/broadsheet/` folder into your project's `addons/` folder. Keep the folder name `broadsheet`: the
   shaders and preset scenes refer to `res://addons/broadsheet/` by path (a moved folder prints an error naming the path it
   looked for).
2. There is no plugin to enable. `BroadsheetLetter`, `BroadsheetNotice` and `BroadsheetCoin` are ordinary script classes.
3. Optional: copy `demo/` too and run `demo/demo.tscn`.

## Use it

Each document is a `Control`. Add one, pick a preset, hand it your data. Any field you leave out falls back to the
preset's own sample, so a preset always draws something.

```gdscript
var letter := BroadsheetLetter.new()
letter.preset = "love_letter"
letter.data = {"recipient": "Dear Rook,", "body": "Meet me at the bridge at dusk.", "signature": "V"}
$UI.add_child(letter)

var poster := BroadsheetNotice.new()
poster.preset = "wanted_frontier"
poster.data = {"name": "MAGGIE VANCE", "crime": "CATTLE THEFT", "reward": "$200", "portrait": preload("res://art/maggie.png")}
$Board.add_child(poster)

var coin := BroadsheetCoin.new()
coin.preset = "crown_portrait"
coin.data = {"ruler": "QUEEN ISOLDE", "portrait": preload("res://art/isolde.png")}
coin.style = {"metal": "silver"}          # any style key, laid over the preset
add_child(coin)
```

Properties on every document: `preset` (an id from the tables below), `data` (a Dictionary), `style` (a Dictionary
laid over the preset), `age` (0 to 1; -1 keeps the preset's), `variation` (an integer: new edges, wobble and wear,
same style), `render_scale` (buffer pixels per document pixel; 0 = automatic, twice the on-screen scale),
`drop_shadow`. Set the Control's `size` to draw at any size; left at zero it takes the preset's size.

Methods and signals: `baked` (emitted when the document has drawn), `export_png(path)` (waits for the bake, saves
straight-alpha PNG), `get_texture()` (the baked texture, premultiplied alpha), `make_sprite()` (a `Sprite2D` showing the
document anywhere in your world), `rebuild()`. `BroadsheetCorpus.preset_ids(kind)` lists the presets ("letter",
"notice", "coin", or "" for all).

**It draws once.** A document bakes into its own buffer when you change it and then costs one textured quad per frame.

### Letter data

`place`, `date`, `recipient`, `body`, `signature`. A `|` breaks an address into lines. A ledger body is one
`item|amount` per line, and the total is summed for you. Style keys: `form` (folio, note, ledger, strip, scrap,
telegram, postcard, envelope, packet, scroll, diary), `stock`, `hand`, `ink`, `ink2`, `seal` {device, wax, at, r,
hanging}, `postmarks`, `fold` (trifold, quarter, letterlock, scroll, flat), `age`, `damage` {foxing, water, scorch,
tear, crease, blot, blood, mildew}, `letterhead`, `dropcap`, `docket`, `cipher`, `stamp`.

### Notice data

Whatever the preset's blocks name in `{braces}` (name, crime, reward, place, text, lots, times, menu...), plus
`portrait`: a `Texture2D` printed as a woodcut, engraving, halftone, stipple, stencil, linocut, riso or sepia print.
Row fields (`lots`, `times`, `menu`) take one row per line, columns split by `|`. Style keys: `stock`, `inks`,
`border`, `pin`, `age`, `damage`, `hand`, and `blocks` (the whole forme: title, line, portrait, rule, body, rows, table,
field, band, arch, stars, device, seal, stamp, tabs, columns, split, hand, handrows, chalkrule).

### Coin data

Whatever the legend names in `{braces}` (ruler, realm, year, guild, town, tavern, temple, mint), `value`, and
`portrait`: a `Texture2D` struck as the bust. Style keys: `metal` (gold, silver, copper, bronze, electrum, brass, iron,
pewter, jade), `inner` (a second metal: bimetal), `shape` (round, hammered, lump, poly8, scallop, square, roundsquare,
clipped), `hole` (square, round), `rim` (plain, beaded, reeded, wreath, none), `device` (any device id, portrait,
cross, four, numeral, rays), `legend`, `reverse` + `reverseLegend` (pair), `wear`, `patina`, `layout` (single, pair,
stack, medal, strung, pile), `count` (coins on a cord), `cord` (its colour).

## The 48 presets

### Letters (16)

| id | name | what |
| --- | --- | --- |
| `royal_summons` | Royal Summons | folio, chancery hand on courtwove, gilt crown seal |
| `love_letter` | Love Letter | note, copperplate hand on vellum, crimson rose seal |
| `field_dispatch` | Field Dispatch | folio, martial hand on foolscap, oxblood sword seal |
| `ransom_note` | Ransom Note | scrap, untutored hand on pulp |
| `last_testament` | Last Testament | folio, scholar hand on blackpaper, sable bell seal |
| `merchant_ledger` | Merchant Ledger | ledger, ledger hand on ledgerleaf, amber scales seal |
| `cipher_slip` | Cipher Slip | strip, cipherclerk hand on oiled, verdigris serpent seal |
| `abbey_missive` | Abbey Missive | folio, uncial hand on vellum, bone chalice seal |
| `frightened_plea` | Frightened Plea | note, tremulous hand on palimpsest |
| `smugglers_scrap` | Smugglers Scrap | scrap, courier hand on bark |
| `telegram` | Telegram | telegram, secretary hand on buffcard |
| `postcard` | Postcard | postcard, secretary hand on card |
| `envelope_back` | Sealed Envelope | envelope, scholar hand on laid, azure stag seal |
| `letterlocked_packet` | Letterlocked Packet | packet, chancery hand on laid, crimson lion seal |
| `decree_scroll` | Decree Scroll | scroll, chancery hand on vellum, imperial eagle seal |
| `diary_page` | Diary Page | diary, spidery hand on ledgerleaf |

### Notices (16)

| id | name | what |
| --- | --- | --- |
| `wanted_frontier` | Frontier Wanted | poster stock, woodcut picture, nail |
| `bounty_warden` | Warden Bounty | laidposter stock, engraving picture, tacks |
| `missing_person` | Missing Person | whitebond stock, halftone picture, tape |
| `beast_bounty` | Beast Bounty | yellowposter stock, stencil picture, nail |
| `royal_proclamation` | Royal Proclamation | laid stock |
| `theatre_bill` | Theatre Bill | cream stock |
| `fair_poster` | Fair Poster | whitebond stock, riso picture |
| `recruitment` | Recruitment Poster | buffposter stock, linocut picture |
| `quarantine` | Quarantine Notice | yellowposter stock, nails |
| `auction_lots` | Auction Lots | newsprint stock |
| `job_board_card` | Job Board Card | card stock, tack |
| `newspaper` | Newspaper Front | newsprint stock, halftone picture |
| `election_poster` | Election Poster | whitebond stock, riso picture |
| `tavern_chalkboard` | Tavern Chalkboard | slate stock |
| `coach_timetable` | Coach Timetable | buffposter stock, nail |
| `court_summons` | Court Summons | courtwove stock |

### Coins (16)

| id | name | what |
| --- | --- | --- |
| `crown_portrait` | Gold Crown | gold, round, portrait device, single |
| `silver_penny` | Hammered Penny | silver, hammered, cross device, single |
| `copper_cash` | Square Hole Cash | copper, round with a square hole, four device, strung |
| `bronze_tower` | Bronze Tower | bronze, round, tower device, single |
| `electrum_lion` | Electrum Stater | electrum, lump, lion device, single |
| `guild_token` | Guild Token | brass, poly8, hammer device, single |
| `siege_square` | Siege Coin | iron, square, numeral device, single |
| `tavern_scallop` | Tavern Token | pewter, scallop, chalice device, single |
| `ducat_ship` | Ship Ducat | gold, round, ship device, pile |
| `thaler_pair` | Silver Thaler Pair | silver, round, portrait device, pair |
| `bimetal_two` | Bimetal Two | silver + gold, round, numeral device, stack |
| `copper_stack` | Copper Stack | copper, round, tree device, stack |
| `holed_sun` | Holed Sun | bronze, round with a round hole, rays device, strung |
| `clipped_worn` | Clipped Silver | silver, clipped, key device, single |
| `valour_medal` | Valour Medal | gold, round, star device, medal |
| `jade_token` | Jade Token | jade, roundsquare, fish device, single |

## Renderers and versions

Every preset was rendered and checked under **Forward+** and **Compatibility** (OpenGL 3, the web renderer) on Godot
**4.7.2**. Older Godot versions were not run and are not claimed. Text is drawn from stroke skeletons: the hands carry
the ASCII letters, digits and common punctuation; accented letters and non-Latin scripts are not drawn (they are
skipped, never shown as boxes).

## Licence

See LICENSE.txt: use it in any number of games; no resale or redistribution of the files as a pack; no AI training. AI-generated: see LICENSE.txt.

Core Systems Asset Factory - https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
