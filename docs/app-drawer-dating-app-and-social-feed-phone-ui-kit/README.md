# App Drawer: Dating App + Social Feed Phone UI Kit, 6 Looks — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** App Drawer: Dating App + Social Feed Phone UI Kit, 6 Looks  
**Engine:** Cross-engine UI/GUI kits generated from ONE theme spec by Kernel/ui/uikit_gen.js: pixel (hard pixels, palette-closed) and HD (SVG via headless Chrome) atlases + per-cell PNGs + atlas.json, exported as a Godot 4 Theme + self-screenshotting demo, Unity .meta spriteBorder + USS, Unreal margin CSV, GameMaker nine-slice JSON, RPG Maker MZ 192x192 Window.png and a Ren'Py gui/ set; PROVEN by Wings/UIKits/Tools/uikit_gate.js (stretch test at five sizes with zero edge drift, native redraw match, the widget x state matrix counted, contrast >= 4.5:1, a headless Godot screenshot the agent then LOOKS at). See Wings/UIKits/CLAUDE.md.  
**Docs published:** 2026-11-22


---

# App Drawer: Dating App and Social Feed Phone UI Kit, Six App Looks

Two phone UI kits on one page: **Mutual**, a dating app in three looks, and **Feed Line**, a social feed in three looks. Each look is a
complete kit of its own (pixel AND HD, files for Godot 4, Unity, Unreal, GameMaker, RPG Maker MZ and Ren'Py) and each carries the
handset and chat set of our Phone Line kit, so a character's phone in your game can open a chat, a feed and a dating app. No real
app's or platform's logo, name, colours or layout is drawn, and the names in the demos are invented. This is UI ART: no app logic,
networking, swiping physics or feed scrolling ships for any engine.

| Folder | Look | Apps | Widgets | Widget-state images (per mode) | Modes |
| --- | --- | --- | --- | --- | --- |
| `Mutual/daybreak/` | **Daybreak** | dating app + chat | 129 | 249 | pixel + HD |
| `Mutual/afterhours/` | **Afterhours** | dating app + chat | 129 | 249 | pixel + HD |
| `Mutual/familiar/` | **Familiar** | dating app + chat | 129 | 249 | pixel + HD |
| `FeedLine/daylight/` | **Daylight** | social feed + chat | 140 | 292 | pixel + HD |
| `FeedLine/nightshift/` | **Nightshift** | social feed + chat | 140 | 292 | pixel + HD |
| `FeedLine/pinboard/` | **Pinboard** | social feed + chat | 140 | 292 | pixel + HD |

Each dating look has **129 distinct widgets** and each feed look **140**: 807 widgets and 1623 widget-state images per mode
across the six looks (a widget is one element, for example a button; a widget-state image is that element in one state or one
animation frame). The three looks of each kit share every widget name, state
name, 9-slice margin and Godot theme type, so a game switches look by pointing at another folder.

## The App Drawer Godot project (`godot_app_drawer/`)

Open `godot_app_drawer/project.godot` in Godot 4 and run it. One handset, three apps:

- The three buttons above the handset (or **C**, **F**, **D**, and **A** for the next app) open **Chat**, **Feed** and **Dating**.
- **1**, **2**, **3** (or **T** to cycle) switch the phone: **Day** (Daybreak dating, Daylight feed), **Night** (Afterhours dating,
  Nightshift feed), **Odd** (Familiar dating, Pinboard feed). Each app keeps its own look on the same phone, as apps do on a real one;
  Chat takes the look of the last app you opened (the feed's direct messages or the dating app's match chat).
- The pixel theme draws on the left (1x, scaled 3x), the HD theme on the right.
- `demo/demo.gd` is the worked example: `_feed`, `_dating` and `_phone` build the three screens from the kits' theme types,
  and `_rebuild` shows the one-line look switch: `root.theme = load("res://uikit/<theme id>/pixel/theme_pixel.tres")`.
- To use the looks in your own game, copy the `godot_app_drawer/uikit/<theme id>/` folders you want (each holds the pixel and HD
  themes, their atlases and the look's pixel typeface).

## Each kit folder

`Mutual/` and `FeedLine/` are the two kits exactly as they ship on their own, each with its own Readme_for_Users.md
(the volume) and, inside each look folder, a Readme with the full widget list, the dating-app or social-feed set, the Godot theme
types and the import steps for every engine, plus each kit's `godot_theme_switch/` project (one kit's three looks on the same
controls). The engine notes below are the short form.

## Engines

- **Godot 4:** each look's `godot/` folder is a runnable project with `uikit/<theme id>/pixel/theme_pixel.tres` and
  `theme_hd.tres` (StyleBoxTexture 9-slices, theme type variations such as `PhoneFrame`, `ProfileCard`, `PostCard`,
  `SwipeLike`, `ActLike`); assign one Theme to your root Control.
- **Unity:** every sprite PNG has a `.meta` with its 9-slice border (Point filter in pixel mode), and `unity/uikit_pixel.uss` /
  `uikit_hd.uss` carry the UI Toolkit slice values.
- **Unreal:** `unreal/brush_margins.csv` lists the Draw As Box margins in pixels and as 0..1 fractions.
- **GameMaker:** `gamemaker/nineslice.json` holds the nine-slice values for every sprite.
- **RPG Maker MZ:** `rpgmaker_mz/img/system/Window.png` is a standard 192x192 windowskin in the look's colours.
- **Ren'Py:** `renpy/game/gui/` images under the default 1080p template names, with `gui_values.rpy.txt` (Borders and colours).

## What was run, and in which engine

The two kit folders are byte for byte the files of Mutual and Feed Line as tested and sold inside our UI Kit Collection (every file's
sha256 compared). They were RUN in these engines:

- **Godot 4.7.2**: the App Drawer project (godot_app_drawer/) was imported into a fresh folder and run windowed: all 12 screens (each dating look as Dating and Chat, each feed look as Feed and Chat), every themed control on that look's own atlas (40 to 70 per screen), 0 errors, every screen inside a 1080p desktop (2026-11-22). Each look's own demo project in godot/ and each kit's godot_theme_switch/ were run when Mutual (2026-11-12) and Feed Line (2026-11-16) were tested.
- **RPG Maker MZ**: a blank MZ project loaded each of the six looks' img/system/Window.png pixel for pixel, its 32 text colours, and a message window with a name box paused on it; the drawn frame corners equal the shipped frame (7 of 7 checks per look; a run without the skin installed goes red; Mutual 2026-11-12, Feed Line 2026-11-16, on these same files).
- **Unity 6000.5.7f1**: Feed Line's three looks only: a blank Unity 6 project imported each look's pixel and HD sprites with their .meta files and both .uss stylesheets, read back the 9-slice border, filter, pixels per unit and size of every sprite and rendered sliced uGUI Images (21 of 21 checks per look; 2026-11-16). Mutual's three looks ship the same kind of files for Unity, not run in Unity by us.

For the other engines the files are provided and checked for consistency with `atlas.json` (same regions, same 9-slice margins);
they have not been opened in that engine by us, so treat each kit's import steps as the documented way to import them.

## Licence

See LICENSE.txt. The art is AI-generated (code written by an AI drew every pixel from the theme specifications).


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
