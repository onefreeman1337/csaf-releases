# Codex Type: 3 Book Pixel Fonts + 78 Illuminated Initials — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Codex Type: 3 Book Pixel Fonts + 78 Illuminated Initials  
**Engine:** Cross-engine UI/GUI kits generated from ONE theme spec by Kernel/ui/uikit_gen.js: pixel (hard pixels, palette-closed) and HD (SVG via headless Chrome) atlases + per-cell PNGs + atlas.json, exported as a Godot 4 Theme + self-screenshotting demo, Unity .meta spriteBorder + USS, Unreal margin CSV, GameMaker nine-slice JSON, RPG Maker MZ 192x192 Window.png and a Ren'Py gui/ set; PROVEN by Wings/UIKits/Tools/uikit_gate.js (stretch test at five sizes with zero edge drift, native redraw match, the widget x state matrix counted, contrast >= 4.5:1, a headless Godot screenshot the agent then LOOKS at). See Wings/UIKits/CLAUDE.md.  
**Docs published:** 2026-11-22


---

# Codex Type

Book and journal pixel fonts for game UIs: three faces (687 glyphs), 78 colour drop-cap initials in 3 styles and 18 ornaments,
as TrueType (.ttf), BMFont (.fnt + .png) and Godot 4 FontFile (.tres), with files for Godot, Unity, Unreal, GameMaker, RPG Maker MZ
and Ren'Py. Drawn for the pages of our Codex Pages and Bookbinder UI kits, and plain enough for any book, journal, quest log or letter.

## What is inside

| face | for | native size | glyphs | kerning pairs |
| --- | --- | --- | --- | --- |
| Codex Text | book body text, quest entries, notes | 12 px (baseline 10) | 229 | 50 |
| Codex Margin | margin notes, captions, quoted letters (slanted) | 12 px (baseline 10) | 229 | 36 |
| Codex Chapter | chapter titles, page headings, names on a cover | 24 px (baseline 20) | 229 | 50 |

- **Codex Text** is a serif book face: 7 px capitals, a 5 px x-height and small serifs at the cap line and the baseline. Its
  71 letters and figures were drawn for this pack; its punctuation and Latin-1 symbols share drawings with our Phone Line Type faces
  (same metrics), and its accented letters are composed from a letter and a mark.
- **Codex Margin** is Codex Text slanted one pixel every three rows, for margin notes, captions and quoted letters. It is built from
  the Codex Text drawings, not drawn separately; its ornaments stay upright.
- **Codex Chapter** is Codex Text at twice the size rebuilt as a high-contrast display face: 2 px stems, 1 px bars and serifs, and
  smoothed diagonals. For chapter titles, page headings and names on a cover.
- **Coverage (all three faces):** ASCII (95), the Latin-1 Supplement (95, including 62 accented and special letters for French,
  German, Spanish, Portuguese, Italian, Dutch and the Nordic languages), 9 typographic marks (curly quotes, ellipsis, en and em dash,
  bullet, euro) and the 18 ornaments. Not in this version: Latin Extended-A (Polish, Czech, Turkish ...), Cyrillic, Greek, CJK.
- **Ornaments:** 18 fleurons and divider pieces (hedera leaves, asterism, manicules, cross, lozenge, fleuron, star, trefoil, scrolls,
  plain, dotted and diamond rules and their end curls), typed as characters of the faces. Codes are in `GLYPH_MAP.md`; each also
  ships as its own PNG in `ornaments/png/` and on `ornaments/sheet.png`.
- **Initials:** 78 colour drop caps, A to Z in three styles, each 36 x 36 pixels (exactly three lines of Codex Text):
  - **Gilt:** a framed square in lapis, vermilion, verdigris or murex (by letter) with a gold lattice, and the letter in shaded gold.
  - **Vine:** the letter in vermilion with green vines grown around it (leaves, berries and buds), on a transparent ground.
  - **Woodcut:** a black block with a cream double rule, engraved scrollwork, and a smaller cream letter.
  Each initial ships as a PNG at 1x (`initials/<style>/png/`) and 3x (`png_x3/`), all 26 on one sheet with an atlas JSON, and as a
  BMFont and a Godot FontFile in which typing the letter draws the initial. Colour initials cannot live in a TrueType file, so they
  ship as images and bitmap fonts only.

## Use them at whole-number sizes

These are pixel fonts. Use the native size or an exact multiple (Text and Margin: 12, 24, 36 ...; Chapter: 24, 48, 72 ...), with
smoothing / anti-aliasing OFF and hinting OFF, and draw at whole-pixel positions. Any other size blurs or drops pixels.

**Measured:** in Godot 4.7.2 with each .ttf loaded with hinting None, every glyph of all three faces matches the drawn glyph pixel for pixel at
1x, 2x and 3x (2,061 renders compared), and every kerning pair shapes to its listed width. The `.tres` files never go through a hinter.

## Godot 4

- **Easiest:** use the `.tres` files (bitmap FontFile resources, no import step, crisp at 2x and 3x). Copy `godot/codex_type/` into
  your project and set a `.tres` as a Control's font or your Theme's default font. Font size = the native size or a multiple.
- **Initials as a font:** `godot/codex_type/CodexInitialsGilt.tres` (and Vine, Woodcut): a Label or RichTextLabel set in it draws
  the initial for each letter you type, in colour (leave the font colour white). Or use a PNG in a TextureRect.
- **The .ttf:** after copying a `.ttf` in, select it, open the Import dock, set Antialiasing = None, Hinting = None, Subpixel
  Positioning = Disabled, then Reimport.
- **Demo:** open `godot/` as a project and press F5: a journal spread set in the three faces with a drop cap from each style.
- Set Project Settings > Rendering > Textures > Default Texture Filter = Nearest, and scale with stretch mode "viewport" or
  "canvas_items" at an integer scale.

## Unity

- Drop a `.ttf` into Assets. In the Font import settings set Font Size to the native size (or a multiple), Rendering Mode =
  Raster (not Smooth), Character = Dynamic.
- TextMeshPro: Window > TextMeshPro > Font Asset Creator, Sampling Point Size = the native size (or a multiple), Render Mode = RASTER,
  Padding 1, then set the font atlas texture's Filter Mode to Point. Add the ornament range E000-E011 to the character set.
- Initials: import the PNGs as Sprite (2D and UI), Filter Mode = Point, Compression = None.
- Files for Unity: the font files, images and these steps; we have not run this pack inside Unity.

## Unreal Engine

- Import a `.ttf` (drag it into the Content Browser) to create a Font Face and a Font. In the Font Face set Hinting = None and
  Loading Policy = Lazy Load; in UMG use the font at the native size or a multiple.
- Initials: import the PNGs as textures with Texture Group = UI and Filter = Nearest, and place them in an Image widget.
- Files for Unreal: the font files, images and these steps; not run inside Unreal.

## GameMaker

- `gamemaker/codex_type.gml` loads the three faces from Included Files with `font_add` and anti-aliasing off, and shows how to load
  and draw an initial with `sprite_add`. Or install a `.ttf` on your machine and make a Font asset in the IDE at the native size with
  anti-aliasing off.
- Files for GameMaker: not run inside GameMaker.

## RPG Maker MZ

- Copy `rpgmaker_mz/fonts/*.ttf` into your project's `fonts/` folder. Database > System 2 > Advanced Settings: Main Font Filename =
  `CodexText.ttf`, Font Size = 24 (2x) or 36 (3x). Initials: copy the `png_x3` files you want into `img/pictures/` and show them with
  the Show Picture command.
- MZ draws a dark outline around window text by default, so the letters keep their shape but gain a soft edge. Files for MZ: not
  run inside MZ.

## Ren'Py

- Copy the `.ttf` files into `game/fonts/`, the `initials/` folder into `game/images/codex_initials/` and
  `renpy/codex_type_styles.rpy` into `game/`. It defines three text styles and a drop-cap example screen.
  `renpy/gui_font_lines.rpy.txt` holds the gui.rpy lines that make Codex Text the whole game's font (replace those lines, do not add
  them twice).
- Files for Ren'Py: not run (no Ren'Py SDK on the build machine).

## Other engines

The `.fnt` + `.png` pairs are standard AngelCode BMFont text files (Phaser, LOVE, Defold, Construct, MonoGame, libGDX and others read
them; the initials' pages are full colour). The `_metrics.json` beside each font lists every glyph's rectangle, offsets, advance and
the kerning pairs; `<style>_atlas.json` lists every initial's rectangle on its sheet.

## Licence and credits

Royalty-free in your games and apps; no resale of the fonts or images themselves. See `LICENSE.txt`. Credit is optional:
"Type: Codex Type by Core Systems Asset Factory".

**AI disclosure:** every glyph, ornament and initial was drawn as pixels by code written by an AI agent, and the font files were built
from those drawings by AI-written code. No third-party font or art was used or traced.

More from the same studio: the Codex Pages and Bookbinder book UI kits and the UI Kit Collection at https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
