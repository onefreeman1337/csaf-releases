# Slate Type: 4 Pixel UI Fonts, Latin + Cyrillic — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Slate Type: 4 Pixel UI Fonts, Latin + Cyrillic  
**Engine:** Cross-engine UI/GUI kits generated from ONE theme spec by Kernel/ui/uikit_gen.js: pixel (hard pixels, palette-closed) and HD (SVG via headless Chrome) atlases + per-cell PNGs + atlas.json, exported as a Godot 4 Theme + self-screenshotting demo, Unity .meta spriteBorder + USS, Unreal margin CSV, GameMaker nine-slice JSON, RPG Maker MZ 192x192 Window.png and a Ren'Py gui/ set; PROVEN by Wings/UIKits/Tools/uikit_gate.js (stretch test at five sizes with zero edge drift, native redraw match, the widget x state matrix counted, contrast >= 4.5:1, a headless Godot screenshot the agent then LOOKS at). See Wings/UIKits/CLAUDE.md.  
**Docs published:** 2026-11-23


---

# Slate Type

A pixel UI font family for game menus, HUDs and settings screens: four faces (1792 glyphs, 448 in each) covering Latin, Latin
Extended-A and Cyrillic, so one font set carries your UI into 33 languages. TrueType (.ttf), BMFont (.fnt + .png) and Godot 4
FontFile (.tres), with files for Godot, Unity, Unreal, GameMaker, RPG Maker MZ and Ren'Py. Drawn as the type for our Clean Slate UI kit,
and plain enough for any interface.

## What is inside

| face | for | native size | glyphs | kerning pairs |
| --- | --- | --- | --- | --- |
| Slate Regular | menus, settings, dialogue, HUD labels | 12 px (baseline 10) | 448 | 59 |
| Slate Bold | buttons, names, selected items, warnings | 12 px (baseline 10) | 448 | 59 |
| Slate Small Caps | tabs, headers, stat names, button captions | 12 px (baseline 10) | 448 | 55 |
| Slate Large | titles, menu headings, big numbers | 24 px (baseline 20) | 448 | 59 |

- **Slate Regular** is a square, open sans: 7 px capitals and a 5 px x-height, flat-topped A and 3, serifed I, i and l (so I, l and 1
  never blur together) and multi-stroke letters drawn wide with 2 px gaps. 170 letters, figures and marks were drawn for this pack;
  its punctuation and Latin-1 symbols share drawings with our Phone Line Type faces (same metrics), its accented letters are composed
  from a letter and a mark, and Cyrillic letters that share a shape with a Latin letter (А В Е К М Н О Р С Т Х ...) use that drawing.
- **Slate Bold** is Slate Regular emboldened by one rule (every pixel also inks the pixel to its right, so a glyph grows 1 px wider;
  Ĩ ĩ Ĭ ĭ keep their width because the accent is already wider than the letter) with its accents kept thin; a few letters and symbols
  the rule would fill in are drawn by hand (ð, and Њ њ 2 px wider) or keep their Regular drawing.
- **Slate Small Caps** has the Regular capitals, and every small letter is a 5 px small capital (Latin and Cyrillic): for tabs,
  headers, stat names and button captions.
- **Slate Large** is Slate Regular at twice the size with smoothed diagonals: 2 px strokes, 24 px line, for titles and big numbers.
- **Tabular figures:** every digit 0-9 has the same advance in each face, so a score, a timer or a counter never shifts as it changes.
- **UI marks:** ← → ↑ ↓ ↔ ✓ ✗ ♥ ♡ ★ ☆ ● ○ ▶ ◀ ▲ ▼ ♪ № (arrows, check and cross, hearts, stars, dots, triangles, a note, the numero sign).

## Coverage (every face)

| block | characters |
| --- | --- |
| Basic Latin (ASCII) | 95 |
| Latin-1 Supplement | 95 |
| Latin Extended-A | 128 |
| Romanian comma-below letters (Latin Extended-B) | 4 |
| Cyrillic (U+0400 to U+045F, plus Ґ ґ) | 98 |
| Typographic marks | 9 |
| UI marks | 19 |

**Languages:** English, French, German, Spanish, Portuguese, Italian, Dutch, Danish and Norwegian, Swedish, Finnish, Icelandic, Polish, Czech, Slovak, Slovenian, Croatian and Bosnian, Hungarian, Romanian, Turkish, Latvian, Lithuanian, Estonian, Maltese, Welsh, Esperanto, Catalan, Albanian, Russian, Ukrainian, Belarusian, Bulgarian, Serbian (Cyrillic), Macedonian. Every letter of each of these 33 alphabets is in every face; the full lists are in `GLYPH_MAP.md`.
Not in this version: Greek, Vietnamese, Kazakh and other Cyrillic letters outside U+0400 to U+045F (except Ґ ґ), Arabic, Hebrew, CJK.

## Use them at whole-number sizes

These are pixel fonts. Use the native size or an exact multiple (Regular, Bold, Small Caps: 12, 24, 36 ...; Large: 24, 48 ...), with
smoothing / anti-aliasing OFF and hinting OFF, and draw at whole-pixel positions. Any other size blurs or drops pixels.

**Measured:** in Godot 4.7.2 with each .ttf loaded with hinting None, every glyph of all four faces matches the drawn glyph pixel for pixel at
1x, 2x and 3x (5,376 renders compared), and every kerning pair shapes to its listed width. The `.tres` files never go through a hinter.

## Godot 4

- **Easiest:** use the `.tres` files (bitmap FontFile resources, no import step, crisp at 2x and 3x). Copy `godot/slate_type/` into
  your project and set a `.tres` as a Control's font or your Theme's default font. Font size = the native size or a multiple.
- **The .ttf:** after copying a `.ttf` in, select it, open the Import dock, set Antialiasing = None, Hinting = None, Subpixel
  Positioning = Disabled, then Reimport.
- **Demo:** open `godot/` as a project and press F5: a settings screen and a HUD in all four faces, in 6 languages (English, Polski, Čeština, Türkçe, Русский, Українська).
  Keys 1-6 or Left / Right switch the language.
- Set Project Settings > Rendering > Textures > Default Texture Filter = Nearest, and scale with stretch mode "viewport" or
  "canvas_items" at an integer scale.

## Unity

- Drop a `.ttf` into Assets. In the Font import settings set Font Size to the native size (or a multiple), Rendering Mode =
  Raster (not Smooth), Character = Dynamic.
- TextMeshPro: Window > TextMeshPro > Font Asset Creator, Sampling Point Size = the native size (or a multiple), Render Mode = RASTER,
  Padding 1, Character Set = Unicode Range (Hex) `20-7E,A0-17F,218-21B,400-45F,490-491,2013-2026,20AC,2116,2190-2194,25B2-25CF,2605-266A,2713,2717`,
  then set the font atlas texture's Filter Mode to Point.
- Files for Unity: the font files and these steps; we have not run this pack inside Unity.

## Unreal Engine

- Import a `.ttf` (drag it into the Content Browser) to create a Font Face and a Font. In the Font Face set Hinting = None and
  Loading Policy = Lazy Load; in UMG use the font at the native size or a multiple.
- Files for Unreal: the font files and these steps; not run inside Unreal.

## GameMaker

- `gamemaker/slate_type.gml` loads the four faces from Included Files with `font_add` and anti-aliasing off. Or install a `.ttf` on
  your machine and make a Font asset in the IDE at the native size with anti-aliasing off, adding the Cyrillic range if you need it.
- Files for GameMaker: not run inside GameMaker.

## RPG Maker MZ

- Copy `rpgmaker_mz/fonts/*.ttf` into your project's `fonts/` folder. Database > System 2 > Advanced Settings: Main Font Filename =
  `SlateRegular.ttf`, Font Size = 24 (2x) or 36 (3x).
- MZ draws a dark outline around window text by default, so the letters keep their shape but gain a soft edge.
- Files for MZ: not run inside MZ.

## Ren'Py

- Copy the `.ttf` files into `game/fonts/` and `renpy/slate_type_styles.rpy` into `game/`. It defines four text styles and an
  example screen. `renpy/gui_font_lines.rpy.txt` holds the gui.rpy lines that make Slate the whole game's font (replace those
  lines, do not add them twice).
- Files for Ren'Py: not run (no Ren'Py SDK on the build machine).

## Other engines

The `.fnt` + `.png` pairs are standard AngelCode BMFont text files (Phaser, LOVE, Defold, Construct, MonoGame, libGDX and others read
them). The `_metrics.json` beside each font lists every glyph's rectangle, offsets, advance and the kerning pairs.

## Licence and credits

Royalty-free in your games and apps; no resale of the font files themselves. See `LICENSE.txt`. Credit is optional:
"Type: Slate Type by Core Systems Asset Factory".

**AI disclosure:** every glyph was drawn as pixels by code written by an AI agent, and the font files were built from those drawings by
AI-written code. No third-party font was used or traced.

More from the same studio: the Clean Slate UI kit and the UI Kit Collection at https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
