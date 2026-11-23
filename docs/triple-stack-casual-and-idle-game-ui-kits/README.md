# Triple Stack: 3 UI Kits for Casual and Idle Games — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Triple Stack: 3 UI Kits for Casual and Idle Games  
**Engine:** Cross-engine UI/GUI kits generated from ONE theme spec by Kernel/ui/uikit_gen.js: pixel (hard pixels, palette-closed) and HD (SVG via headless Chrome) atlases + per-cell PNGs + atlas.json, exported as a Godot 4 Theme + self-screenshotting demo, Unity .meta spriteBorder + USS, Unreal margin CSV, GameMaker nine-slice JSON, RPG Maker MZ 192x192 Window.png and a Ren'Py gui/ set; PROVEN by Wings/UIKits/Tools/uikit_gate.js (stretch test at five sizes with zero edge drift, native redraw match, the widget x state matrix counted, contrast >= 4.5:1, a headless Godot screenshot the agent then LOOKS at). See Wings/UIKits/CLAUDE.md.  
**Docs published:** 2026-11-23


---

# Triple Stack: Casual, Rewards and Idle Game UI Kit Volume

Three UI kits for casual and idle games on one page, each a complete kit of its own (pixel AND HD, files for Godot 4, Unity,
Unreal, GameMaker, RPG Maker MZ and Ren'Py) with its own look: **Casual Pop**, the chunky bright base kit; **Bonus Round**, the
screens a casual game shows between rounds; **Compound**, the screen of an idle or incremental game. This is UI ART: no game logic,
economy, store or reward code ships for any engine (the demos' numbers are there to show the widgets).

| Folder | Kit | What it covers | Widgets | Widget-state images (per mode) | Modes |
| --- | --- | --- | --- | --- | --- |
| `CasualPop/` | **Casual Pop** | the chunky bright base kit: menus, buttons, toggles, sliders, bars, tabs, inventory, dialogue | 58 | 125 | pixel + HD |
| `BonusRound/` | **Bonus Round** | the screens between rounds: level complete with stars, level map, shop offers, 7-day rewards, boosters, leaderboard | 106 | 198 | pixel + HD |
| `Compound/` | **Compound** | the idle screen: climbing counter, generators, upgrade rows with x1 / x10 / x100 / MAX, prestige, offline earnings | 111 | 214 | pixel + HD |

275 widgets and 537 widget-state images per mode across the three kits (a widget is one element, for example a button; a
widget-state image is that element in one state or one animation frame). Each kit has its own palette, frame and typeface: Casual
Pop's glossy candy buttons, Bonus Round's star-cornered frames, Compound's brass cog frames.

## The Triple Stack Godot project (`godot_triple_stack/`)

Open `godot_triple_stack/project.godot` in Godot 4 and run it. The window is 1912 x 1080.

- The three buttons on the right (or **1**, **2**, **3**, and **T** for the next kit) switch between **Casual Pop**, **Bonus Round**
  and **Compound**. Each kit's screen draws its pixel theme on the left (1x, scaled 3x) and its HD theme beside it; the switcher
  itself is drawn in the open kit's pixel theme.
- Bonus Round opens on its between-rounds screen (the currency pills, a level-complete card with three result stars, the level map,
  the chest bar, boosters, three shop offers with a BEST VALUE tag, the moves and goal plates, the 7-day reward calendar and the
  leaderboard). Compound opens on its idle screen, and its counter climbs while it is open.
- `demo/kits/` holds each kit's own demo script, the same one that ships in that kit's `godot/` folder, with one change: its
  screenshot flag is `--kit-shot=`. `demo/demo.gd` is the switcher: `_rebuild` frees the open screen and builds the next one.
- To use a kit in your own game, copy its `godot_triple_stack/uikit/<theme id>/` folder (`casual-pop`, `bonus-round` or
  `compound`: the pixel and HD themes, their atlases and the kit's pixel typeface) and set
  `root.theme = load("res://uikit/<theme id>/pixel/theme_pixel.tres")` on your root Control.

## Each kit folder

`CasualPop/`, `BonusRound/` and `Compound/` are the three kits exactly as they ship on their own, each with its own
Readme_for_Users.md (the full widget list, the Godot theme types and the import steps for every engine) and its own `godot/` demo
project. The engine notes below are the short form.

## Engines

- **Godot 4:** each kit's `godot/` folder is a runnable project with `uikit/<theme id>/pixel/theme_pixel.tres` and `theme_hd.tres`
  (StyleBoxTexture 9-slices, theme type variations such as `PrimaryButton`, `HpBar`, `DialogueBox`, `OfferCard`,
  `LevelNode`, `UpgradeRow`); assign one Theme to your root Control.
- **Unity:** every sprite PNG has a `.meta` with its 9-slice border (Point filter in pixel mode), and `unity/uikit_pixel.uss` /
  `uikit_hd.uss` carry the UI Toolkit slice values.
- **Unreal:** `unreal/brush_margins.csv` lists the Draw As Box margins in pixels and as 0..1 fractions.
- **GameMaker:** `gamemaker/nineslice.json` holds the nine-slice values for every sprite.
- **RPG Maker MZ:** `rpgmaker_mz/img/system/Window.png` is a standard 192x192 windowskin in the kit's colours.
- **Ren'Py:** `renpy/game/gui/` images under the default 1080p template names, with `gui_values.rpy.txt` (Borders and colours).

## What was run, and in which engine

The three kit folders are byte for byte the files of Casual Pop, Bonus Round and Compound as tested and sold (every file's sha256
compared with each kit's tested download). They were RUN in these engines:

- **Godot 4.7.2**: the Triple Stack project (godot_triple_stack/) was imported into a fresh folder and run windowed (Windows, Compatibility renderer): each of the three kits' screens was built by that kit's own demo script, every control drawn with a texture stylebox came from that kit's own atlas (58 on Casual Pop, 86 on Bonus Round, 60 on Compound), 0 errors, every screen inside a 1080p desktop, and the screenshots were checked (2026-11-23). Each kit's own demo project in godot/ was run when that kit was tested, and a blank Godot project used each kit's theme folder as a buyer would.
- **RPG Maker MZ**: a blank MZ project loaded each of the three kits' img/system/Window.png pixel for pixel, its 32 text colours, and a message window with a name box paused on it; the drawn frame corners equal the shipped frame (7 of 7 checks per kit, run on this download's files; a run without the skin installed goes red).
- **Unity 6000.5.7f1**: all three kits, when each was tested: a blank Unity 6 project imported the kit's pixel and HD sprites with their .meta files and both .uss stylesheets, read back the 9-slice border, filter, pixels per unit and size of every sprite and rendered sliced uGUI Images; the screenshot was checked.

For the other engines the files are provided and checked for consistency with `atlas.json` (same regions, same 9-slice margins);
they have not been opened in that engine by us, so treat each kit's import steps as the documented way to import them.

## Licence

See LICENSE.txt. The art is AI-generated (code written by an AI drew every pixel from the theme specifications).


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
