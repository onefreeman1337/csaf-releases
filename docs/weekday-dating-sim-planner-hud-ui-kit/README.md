# Weekday: 109 Widget Dating Sim Planner HUD UI Kit — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Weekday: 109 Widget Dating Sim Planner HUD UI Kit  
**Engine:** Cross-engine UI/GUI kits generated from ONE theme spec by Kernel/ui/uikit_gen.js: pixel (hard pixels, palette-closed) and HD (SVG via headless Chrome) atlases + per-cell PNGs + atlas.json, exported as a Godot 4 Theme + self-screenshotting demo, Unity .meta spriteBorder + USS, Unreal margin CSV, GameMaker nine-slice JSON, RPG Maker MZ 192x192 Window.png and a Ren'Py gui/ set; PROVEN by Wings/UIKits/Tools/uikit_gate.js (stretch test at five sizes with zero edge drift, native redraw match, the widget x state matrix counted, contrast >= 4.5:1, a headless Godot screenshot the agent then LOOKS at). See Wings/UIKits/CLAUDE.md.  
**Docs published:** 2026-11-23


---

# Weekday: Dating Sim and Life Sim Planner HUD Kit, Three Looks

The screen around the phone in a modern-day dating sim, raising sim or life sim: a week planner whose time-slot cells take activity
chips, a month calendar, stat rows with rank pips, relationship rows with heart meters, wallet and energy pills, mood faces, a location
card and map pin, a day-end results card, a deadline banner and a choice button with a stat-requirement tag. Three looks, each a complete
kit of its own (pixel AND HD, files for Godot 4, Unity, Unreal, GameMaker, RPG Maker MZ and Ren'Py) with the full base widget set
(windows, buttons, toggles, sliders, tabs, text fields, the dialogue box with name plate, bars, slots, tooltips, cursors, scrollbars),
sharing every widget name, state name, 9-slice margin and Godot theme type with each other. The names in the demo are invented.

| Folder | Look | Widgets | Widget-state images (per mode) | Modes |
| --- | --- | --- | --- | --- |
| `night/` | **Night** | 109 | 232 | pixel + HD |
| `daylight/` | **Daylight** | 109 | 232 | pixel + HD |
| `homeroom/` | **Homeroom** | 109 | 232 | pixel + HD |

- **Night:** Night, in the exact colours of our Phone Line kit: navy and slate panels with a rim one step lighter, a violet accent, a rose danger red. A Phone Line project can add this HUD beside its phone with no colour change. Its ornament: two metal binder rings rise through the top band of the planner, the month panel and the day-end card, as on a ring-bound planner.
- **Daylight:** Daylight, in the exact colours of our Clean Slate kit: near-white panels with a grey hairline, cool greys, one blue accent, one red danger colour. A Clean Slate project can add this HUD with no colour change. Its ornament: a blue paper clip holds the top-left corner of the planner, the month panel and the day-end card.
- **Homeroom:** Homeroom, a classroom chalkboard for school-life games: chalkboard-green panels with chalk-white text, wood hairlines, an amber pencil accent with dark text, a brick-red danger colour. Its ornament: the planner, the month panel and the day-end card are chalkboards in a wood frame, with a chalk tray along the bottom holding a stick of chalk and an eraser.

Each look's folder has its own Readme_for_Users.md with the widget list, the planner set and the import steps for all six engines,
and its own LICENSE.txt (the same licence as the one here).

## Switching look at runtime

- **Godot 4:** `godot_theme_switch/` is a runnable project holding all three looks. Open `godot_theme_switch/project.godot`
  and press **1**, **2** or **3** (or **T** to cycle): the same controls take the Night, Daylight or Homeroom look.
  In your own game copy the three `uikit/<theme>/` folders and switch with one line on your root Control:
  `root.theme = load("res://uikit/weekday-daylight/pixel/theme_pixel.tres")`. Every Button, Panel, ProgressBar, LineEdit and the
  rest restyles itself. Anything you fetched from a theme yourself (an icon from `theme.get_icon(...)`, animation frames) you
  fetch again; the demo shows how (its `_apply()` function).
- **Unity:** the sprite names are the same in all three looks (`planner_panel__normal.png` in each), so a sprite set or
  `.uss` swap points the same widget at another look. (Files for Unity; see each look's Readme for what was run.)
- **GameMaker, Unreal, RPG Maker MZ, Ren'Py:** the same file names in every look's folder; swap the folder. (Files for these engines.)

## Licence

See LICENSE.txt. The art is AI-generated (code written by an AI drew every pixel from the theme specifications).


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
