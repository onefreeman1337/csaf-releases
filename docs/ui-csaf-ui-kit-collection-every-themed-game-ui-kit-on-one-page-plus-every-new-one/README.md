# CSAF UI Kit Collection: Every Themed Game UI Kit on One Page, Plus Every New One — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** CSAF UI Kit Collection: Every Themed Game UI Kit on One Page, Plus Every New One  
**Engine:** Cross-engine UI/GUI kits generated from ONE theme spec by Kernel/ui/uikit_gen.js: pixel (hard pixels, palette-closed) and HD (SVG via headless Chrome) atlases + per-cell PNGs + atlas.json, exported as a Godot 4 Theme + self-screenshotting demo, Unity .meta spriteBorder + USS, Unreal margin CSV, GameMaker nine-slice JSON, RPG Maker MZ 192x192 Window.png and a Ren'Py gui/ set; PROVEN by Wings/UIKits/Tools/uikit_gate.js (stretch test at five sizes with zero edge drift, native redraw match, the widget x state matrix counted, contrast >= 4.5:1, a headless Godot screenshot the agent then LOOKS at). See Wings/UIKits/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# CSAF UI Kit Collection

**The CSAF UI Kit Collection puts all 26 of our paid game UI kits in one download: 30 themes, 2,314 widgets and 4,826 widget states, each theme in pixel and HD, with files for Godot 4, Unity, Unreal, GameMaker, RPG Maker MZ and Ren'Py.** Royalty free in your games (`LICENSE.txt`).

## Try every theme first

Open `godot/project.godot` in Godot 4.7 and press Play. The wall shows all 30 themes at once, each drawn by its own Godot theme. Click one, or use the arrow keys and Enter, and you get the same screen in that theme's pixel and HD versions side by side. Left and Right change theme. Esc goes back.

## Use one theme

Every kit is in `kits/` exactly as its own page sells it, with its own Readme: import notes for each engine, every widget name, the 9-slice margins.

1. Pick a theme in the browser. The bar at the top names its folder.
2. Open that folder's `Readme_for_Users.md` and follow your engine's section.
3. In Godot, copy `<theme folder>/godot/uikit/<theme>/` into your project at the same path and set your root Control's Theme to `uikit/<theme>/pixel/theme_pixel.tres` or `uikit/<theme>/hd/theme_hd.tres`.

## The kits

| Kit | Folder | Themes | Widgets | States per mode | List price |
| --- | --- | --- | --- | --- | --- |
| [Arena Ticket: Monster Battle UI Kit (Pixel + HD)](https://csaf.itch.io/arena-ticket-monster-battle-ui-kit) | `kits/ArenaTicket/` | Arena Ticket | 101 | 210 | $7.99 |
| [Bone and Brass: Dark Fantasy UI Kit (Pixel + HD)](https://csaf.itch.io/bone-and-brass-dark-fantasy-ui-kit) | `kits/BoneAndBrass/` | Bone and Brass | 58 | 125 | $5.99 |
| [Bookbinder: Grimoire, Bestiary and Field Journal Book UI Kit](https://csaf.itch.io/bookbinder-grimoire-bestiary-and-field-journal-book-ui-kit) | `kits/Bookbinder/` | Bestiary, Grimoire, Field Journal | 83, 83, 83 | 183, 183, 183 | $8.99 |
| [Casual Pop: Chunky Bright Game UI Kit (Pixel + HD)](https://csaf.itch.io/casual-pop-chunky-bright-game-ui-kit) | `kits/CasualPop/` | Casual Pop | 58 | 125 | $5.99 |
| [Clean Slate: Modern Minimal UI Kit (Pixel + HD)](https://csaf.itch.io/clean-slate-modern-minimal-ui-kit) | `kits/CleanSlate/` | Clean Slate | 58 | 125 | $5.99 |
| [Codex Pages: Book and Journal UI Kit (Pixel + HD)](https://csaf.itch.io/codex-pages-book-and-journal-ui-kit) | `kits/CodexPages/` | Codex Pages | 83 | 183 | $5.99 |
| [Crucible: 107 Widget Crafting and Alchemy UI Kit](https://csaf.itch.io/crucible-crafting-cooking-and-alchemy-ui-kit) | `kits/Crucible/` | Crucible | 107 | 206 | $7.99 |
| [Duct Tape: 80 Widget Grunge and Distressed UI Kit](https://csaf.itch.io/duct-tape-grunge-and-distressed-ui-kit) | `kits/DuctTape/` | Duct Tape | 80 | 150 | $7.99 |
| [Dusk, Mint and Contrast: Modern Minimal UI Kit Volume (Dark Mode, Pastel, High Contrast)](https://csaf.itch.io/dusk-mint-and-contrast-modern-minimal-ui-kit-volume) | `kits/DuskMintContrast/` | Contrast, Dusk, Mint | 58, 58, 58 | 145, 145, 145 | $8.99 |
| [Ember Court: Pixel RPG Dialogue and Menu UI Kit](https://csaf.itch.io/ember-court-pixel-rpg-dialogue-and-menu-ui-kit) | `kits/EmberCourt/` | Ember Court | 58 | 125 | $5.99 |
| [Felt Table: Card Game and Deckbuilder UI Kit (Pixel + HD)](https://csaf.itch.io/felt-table-card-game-and-deckbuilder-ui-kit) | `kits/FeltTable/` | Felt Table | 88 | 173 | $5.99 |
| [Fingerpost: RPG Cursor and Selection UI Kit (Mouse Cursors with Hotspots, Pixel + HD, 6 Engines)](https://csaf.itch.io/fingerpost-rpg-cursor-and-selection-ui-kit) | `kits/Fingerpost/` | Fingerpost | 86 | 191 | $7.99 |
| [Four Shade: Four-Colour Handheld UI Kit (Pixel + HD)](https://csaf.itch.io/four-shade-four-colour-handheld-ui-kit) | `kits/FourShade/` | Four Shade | 59 | 126 | $4.99 |
| [Hearthwood: Cozy Farming UI Kit (Pixel + HD)](https://csaf.itch.io/hearthwood-cozy-farming-ui-kit) | `kits/Hearthwood/` | Hearthwood | 58 | 125 | $5.99 |
| [Iron Bastion: Medieval Strategy UI Kit (Pixel + HD)](https://csaf.itch.io/iron-bastion-medieval-strategy-ui-kit) | `kits/IronBastion/` | Iron Bastion | 58 | 125 | $5.99 |
| [Night Terminal: Sci-Fi HUD UI Kit (Pixel + HD)](https://csaf.itch.io/night-terminal-sci-fi-hud-kit) | `kits/NightTerminal/` | Night Terminal | 64 | 131 | $5.99 |
| [One Bit: 1-Bit UI Kit (Two Colours, Pixel + HD, Dither Tiles, Playdate Files)](https://csaf.itch.io/one-bit-1-bit-ui-kit) | `kits/OneBit/` | One Bit | 74 | 141 | $7.99 |
| [Phone Line: Visual Novel Phone and Chat UI Kit (Pixel + HD)](https://csaf.itch.io/phone-line-visual-novel-phone-and-chat-ui-kit) | `kits/PhoneLine/` | Phone Line | 102 | 186 | $7.99 |
| [Proscenium: 9 Title, Settings, Save Screens, Godot UI Kit](https://csaf.itch.io/proscenium-title-settings-and-save-screen-ui-kit) | `kits/Proscenium/` | Proscenium | 89 | 181 | $8.99 |
| [Silverpoint: Minimal Fantasy UI Kit (Pixel + HD)](https://csaf.itch.io/silverpoint-minimal-fantasy-ui-kit) | `kits/Silverpoint/` | Silverpoint | 65 | 153 | $5.99 |
| [Status Line: HP, MP and Boss Bar UI Kit (7 Bar Styles, Pixel + HD, 6 Engines)](https://csaf.itch.io/status-line-hp-mp-and-boss-bar-ui-kit) | `kits/StatusLine/` | Status Line | 141 | 208 | $7.99 |
| [Sundial: 87 Widget Clock, Weather and Calendar UI Kit](https://csaf.itch.io/sundial-clock-day-night-and-weather-hud-ui-kit) | `kits/Sundial/` | Sundial | 87 | 185 | $7.99 |
| [Tiny Delve: 16px Dungeon Crawler UI Kit (Pixel + HD)](https://csaf.itch.io/tiny-delve-16px-dungeon-crawler-ui-kit) | `kits/TinyDelve/` | Tiny Delve | 86 | 155 | $7.99 |
| [Unfurl: 79 Widget Animated Scroll and Map UI Kit](https://csaf.itch.io/unfurl-animated-scroll-map-and-letter-ui-kit) | `kits/Unfurl/` | Unfurl | 79 | 171 | $7.99 |
| [Verdant Frame: UI Kit for the Verdant Tilesets (Pixel + HD)](https://csaf.itch.io/verdant-frame-ui-kit-for-the-verdant-tilesets) | `kits/VerdantFrame/` | Verdant Frame | 58 | 125 | $5.99 |
| [Wellglass: Action RPG Orb HUD UI Kit (Health and Mana Orbs, Pixel + HD, 6 Engines)](https://csaf.itch.io/wellglass-action-rpg-orb-hud-ui-kit) | `kits/Wellglass/` | Wellglass | 94 | 217 | $7.99 |

Listed singly these come to $185.74. `catalog.json` holds the same table for a script to read.

## The looks

- **Arena Ticket** (`kits/ArenaTicket/`): Monster battles: stadium navy panels, a gold band with every corner bitten like a ticket stub, type-coloured move plates.
- **Bone and Brass** (`kits/BoneAndBrass/`): Dark fantasy: heavy bone frames over iron-dark panels, brass corner caps, blood-red danger.
- **Bestiary** (`kits/Bookbinder/bestiary/`): A monster bestiary: green hide bands around aged parchment, claw marks on every corner.
- **Grimoire** (`kits/Bookbinder/grimoire/`): An arcane spellbook: black leather bands around vellum pages, an eye on every corner.
- **Field Journal** (`kits/Bookbinder/journal/`): An explorer's notebook: kraft paper bands, off-white pages, tape on every corner.
- **Casual Pop** (`kits/CasualPop/`): Bright flat candy for casual and party games: a thick ink outline, a gloss strip, a chunky lip.
- **Clean Slate** (`kits/CleanSlate/`): Modern minimal: hairline outlines, rounded corners, a soft shadow, one cool blue accent.
- **Codex Pages** (`kits/CodexPages/`): Book and journal: oxblood leather bands, parchment pages, gilt book-corner guards.
- **Crucible** (`kits/Crucible/`): Crafting and alchemy: verdigris copper pipe frames, dark oak, amber glass, recipe cards.
- **Duct Tape** (`kits/DuctTape/`): Grunge: cardboard bands, charcoal board, torn duct tape over the corners, spray-paint orange.
- **Contrast** (`kits/DuskMintContrast/contrast/`): High contrast: black fills, 2-unit white outlines that turn yellow on hover, no shadows.
- **Dusk** (`kits/DuskMintContrast/dusk/`): A dark mode of modern minimal: hairlines and rounded corners on deep slate.
- **Mint** (`kits/DuskMintContrast/mint/`): A soft pastel for casual and cozy games: mint outlines and the widest rounded corners.
- **Ember Court** (`kits/EmberCourt/`): Classic pixel RPG: gilt frames over dark plum panels, a teal accent, crimson danger.
- **Felt Table** (`kits/FeltTable/`): Card table: lacquered mahogany rails around green baize, a brass suit pip in each corner, card frames.
- **Fingerpost** (`kits/Fingerpost/`): Cursors and selection: armoured steel and gilt, gauntlet cursors with hotspots, an animated selection frame.
- **Four Shade** (`kits/FourShade/`): Exactly four colours: a handheld screen bezel corner, frames built on 8x8 tiles.
- **Hearthwood** (`kits/Hearthwood/`): Cozy farming: honey wood with a carved channel and round log-end corners over cream paper.
- **Iron Bastion** (`kits/IronBastion/`): Medieval strategy: grey ashlar castle walls with corner turrets over dark oak panels.
- **Night Terminal** (`kits/NightTerminal/`): Sci-fi HUD: chamfered cyan steel, amber corner ticks, deep navy panels, segmented gauges.
- **One Bit** (`kits/OneBit/`): Exactly two colours: ink and paper, crossed corner rules, dither tiles.
- **Phone Line** (`kits/PhoneLine/`): Phone and chat for visual novels: a dark-mode handset, chat bubbles, app widgets.
- **Proscenium** (`kits/Proscenium/`): Front-of-game screens: oxblood velvet, a pewter band, an arch over each top corner, nine runnable Godot screens.
- **Silverpoint** (`kits/Silverpoint/`): Minimal fantasy: warm vellum, sepia hairlines, an inner keyline with a bookplate notch.
- **Status Line** (`kits/StatusLine/`): Bars: gunmetal panels with bolt heads, seven bar styles with fill, trail, heal and glass layers.
- **Sundial** (`kits/Sundial/`): Time of day: polished brass around night-sky panels, a clock on one pivot, a day-night arc, season and weather badges.
- **Tiny Delve** (`kits/TinyDelve/`): Tiny dungeon crawler at 16 px: slate frames with a bone skull on each corner, pickups, chests, room cells.
- **Unfurl** (`kits/Unfurl/`): Containers that open: vellum between walnut rollers, wax seals, scrolls and a map that unroll.
- **Verdant Frame** (`kits/VerdantFrame/`): Drawn in the Verdant tilesets' palette: slate stone frames with ivy and daisy tufts.
- **Wellglass** (`kits/Wellglass/`): Action RPG: runed obsidian, gem corners, glass health and mana orbs, a skill bar with a cooldown wipe.

## What is in each theme folder

| Path | What |
| --- | --- |
| `theme.json` | the one specification that theme's files were generated from |
| `pixel/` and `hd/` | `atlas.png` + `atlas.json` (every widget, state, region, 9-slice margin and text colour) and `sprites/`, one PNG per widget state with a Unity `.meta` beside it. HD is the same design at 3x, anti-aliased |
| `godot/` | that theme's own runnable Godot 4 project and `uikit/<theme>/` theme resources |
| `unity/` | UI Toolkit stylesheets with 9-slice values |
| `unreal/` | `brush_margins.csv`: Draw As Box margins in pixels and as 0..1 fractions |
| `gamemaker/` | `nineslice.json`: nine-slice values for every sprite |
| `rpgmaker_mz/` | `img/system/Window.png`: a standard 192x192 MZ windowskin. It does not ship an MZ plugin or the MZ runtime |
| `renpy/` | `game/gui/` images under the default template names and `gui_values.rpy.txt` |

Some kits ship more: `kits/Fingerpost/cursors/` (`.cur` files and hotspots), `kits/FourShade/gbstudio/` and `kits/FourShade/palettes/`, `kits/OneBit/playdate/` and `kits/OneBit/palettes/`, `kits/Proscenium/screens_layout/`, and `kits/DuskMintContrast/godot_theme_switch/` and `kits/Bookbinder/godot_theme_switch/`, which switch theme at runtime. Each kit's Readme says what its extras do.

## What was run, and in which engine

**Godot 4.7.2, Unity 6 and RPG Maker MZ ran on all 26 kits. In Godot each theme's demo project was imported and run from a fresh folder, and every themed control resolved to that theme's textures. In Unity both sprite sets and both stylesheets went into a blank project, and Unity read back every sprite's GUID, 9-slice border, filter and size. In MZ the `Window.png` went into a blank project and MZ opened a message window on it. MZ ran from this download on 30 of 30 windowskins (210 checks).

The gate ran again on the bytes in this download, every theme: 23,910 stretch renders with 0 pixels of edge drift, 28,780 comparisons with the widget drawn natively at that size, every text colour at 4.55:1 contrast or better. In the theme browser all 30 themes drew with every control resolved to the theme's own textures and 0 error lines.

Unreal, GameMaker and Ren'Py were not run: those files are checked for consistency with each theme's `atlas.json` (same regions, same 9-slice margins). Treat the steps in each Readme as the documented way to import them.

## New kits

New CSAF UI kits join this download when they launch, at no extra cost. No promise is made about how many or how often. Follow https://csaf.itch.io to hear about them.

## AI disclosure

Every widget, frame, icon, cursor and letter here was drawn by program code written by an AI, from one theme specification per theme. The store page discloses this. No third-party font or icon ships in this collection.

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
