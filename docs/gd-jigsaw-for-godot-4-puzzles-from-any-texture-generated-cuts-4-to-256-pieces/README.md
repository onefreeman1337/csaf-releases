# Jigsaw for Godot 4: 48 Puzzle Styles From Any Picture — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Jigsaw for Godot 4: 48 Puzzle Styles From Any Picture  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Jigsaw for Godot 4 - 48 puzzle styles from any picture

**Version 1.0.1, for Godot 4.7** (tested on Godot 4.7.2; older versions were not run).

**Any Texture2D becomes a jigsaw puzzle your players put together.** Give it a picture and a piece count and it cuts the
picture, lays the pieces out on a table beside a tray and lets the player assemble it with the mouse, touch, the keyboard
or a gamepad. Every cut is generated from a seed: each shared side is ONE curve, so a tab always meets its own socket and
the pieces tile the picture exactly, and no two seeds cut the same puzzle. Each piece is lit, bevelled and shadowed from
its own outline; the table, tray, plaque and ending are drawn in code. The only images in the pack are four demo pictures.

It runs under **Forward+ and Compatibility** (and Mobile), with no GDExtension and no plugin to enable.

## Install

1. Copy the `addons/jigsaw/` folder into your project's `addons/` folder and **keep the folder name**: the styles, preset
   scenes and pictures point at `res://addons/jigsaw/`. (Measured: in a renamed folder Godot prints errors naming the
   missing `res://addons/jigsaw/` paths, so a wrong path is loud, never silent.)
2. That is all: the classes (`JigsawBoard`, `JigsawMinigame`, `JigsawStyle`, `JigsawCut`, `JigsawPiece`, `JigsawPaint`)
   register themselves. There is nothing to enable in Project Settings > Plugins.

To try it first, open the `godot/` folder of this download as a project and run it: the demo plays every style.

## Quick start: one call

```gdscript
var result := await JigsawMinigame.open(self, preload("res://art/castle.png"), {
	"pieces": 48,
	"style": preload("res://addons/jigsaw/styles/parlour.tres"),
	"seed": "chapter-3",      # blank or missing = a new cut every time
	"pause": true,            # pause the game while the puzzle is up
})
if result.solved:
	open_the_gate()
```

`open()` adds a full-screen layer, waits until the player solves the puzzle and clicks (or sets it aside), removes the layer
and returns the result. Options: `pieces` (24), `style` (Parlour), `seed`, `rotation` (false), `pause` (false),
`layer` (64), `snap` (16), `set_aside` (true).

## Quick start: a node in your scene

Add a **Node2D**, attach `addons/jigsaw/jigsaw_board.gd` (or instance any scene in `addons/jigsaw/presets/`), set
`picture` and `style`, and run. Then:

```gdscript
var result: Dictionary = await $JigsawBoard.finished
```

### The result

`{solved, pieces, placed, seconds, moves, peeks, seed, style, tiling, edge}`: `seconds` is whole seconds played, `moves`
counts every time a piece is put down (placed or not), `peeks` counts looks at the box lid, `seed` re-cuts the same
puzzle when passed back as `seed_text`.

## JigsawBoard

| Property | Default | What it does |
| --- | --- | --- |
| `picture` | none | The Texture2D to cut. With none, the board warns once and draws the table and an empty tray. |
| `pieces` | 24 | About how many pieces, 4 to 256 (see "Piece counts"). |
| `seed_text` | "" | Blank = a new cut every time; any number or word cuts the same puzzle every time. |
| `style` | Parlour | A `JigsawStyle` (the 48 are in `addons/jigsaw/styles/`). |
| `fit_viewport` | true | Fill the viewport and follow it when it is resized; off = use `board_size`. |
| `board_size` | 1280 x 720 | The board's size when `fit_viewport` is off. |
| `centered` | false | Draw round the node's origin instead of from its top-left. |
| `frame_share` | 0.6 | How much of the width (height, on a portrait screen) the tray may take. |
| `autostart` | true | Cut and lay out as soon as the node enters the tree. |
| `snap_distance` | 16 | How close (pixels on a 720 high board; it scales with the board) a piece must land to click in. |
| `rotation_enabled` | false | Loose pieces start turned; the player turns them back. |
| `allow_set_aside` | true | Cancel (or a right click with nothing held, when rotation is off) gives up. |
| `close_on_confirm` | true | After the ending, `finished` waits for a click or the pick/cancel action. |
| `keyboard_hand` | true | A drawn hand the arrow keys / left stick move. |
| `gamepad_buttons` | true | Also read a gamepad's A, B, X and left shoulder directly (Godot's default `ui_accept` and `ui_cancel` have no gamepad button). |
| `showcase` | false | Start part-assembled with one piece in the air (the preset scenes use it). |
| `action_*` | ui_* | The InputMap actions it reads (see "Controls"); any missing action is simply ignored. |

Signals: `piece_placed(placed, total)` · `solved(result)` (the moment the last piece clicks in) · `finished(result)`.
Methods: `start(picture = null, pieces = -1, seed = null)` · `preview(fraction)` · `set_aside()` · `solve_now()` ·
`get_result()` · `piece_count()` · `get_pieces()`.

## Controls (defaults)

| Do this | Mouse / touch | Keyboard / gamepad |
| --- | --- | --- |
| Move the hand | - | `ui_left/right/up/down` (arrows, d-pad, left stick); hold Shift to go faster |
| Pick up / put down | press, drag, let go | `ui_accept` (Enter, Space) or gamepad A |
| Turn the held piece (rotation on) | right click or the wheel | `ui_focus_next` (Tab) or gamepad X |
| Look at the box lid | - | hold `ui_page_up` (Page Up) or the gamepad's left shoulder |
| Set the puzzle aside | right click with nothing held (rotation off) | `ui_cancel` (Esc) or gamepad B, with nothing held |

Touch works through Godot's "Emulate Mouse From Touch" (on by default); with that setting off, the board reads the touch
events itself. Every action name is an exported property, so remap them to your own actions.

## Styles

Each style is a `JigsawStyle` resource: how the picture is cut (tiling x sides), how a piece is finished, the table, the
tray, the plaque and the ending. Open any `.tres` in the inspector and move a slider; duplicate one to make your own.
Colours, piece count, seed and snap are parameters, never styles.

| id | name | cut | sides | finish | table | demo picture |
| --- | --- | --- | --- | --- | --- | --- |
| `parlour` | Parlour | grid | classic | card | felt | harbour |
| `casino` | Casino | grid | bulb | gilded | felt | night_market |
| `billiard` | Billiard Room | brick | classic | wood | felt | autumn_shrine |
| `card_room` | Card Room | diamond | petite | card | felt | pixel_valley |
| `quarry` | Quarry | shard | straight | slab | slate | autumn_shrine |
| `schoolhouse` | Schoolhouse | grid | petite | paper | slate | harbour |
| `forge` | Forge | brick | crenel | metal | slate | night_market |
| `runestone` | Runestone | hex | button | ink | slate | pixel_valley |
| `scriptorium` | Scriptorium | grid | lean | ink | parchment | autumn_shrine |
| `atlas` | Atlas | rings | classic | card | parchment | harbour |
| `herbarium` | Herbarium | grid | wave | paper | parchment | pixel_valley |
| `illumination` | Illumination | grid | twin | gilded | parchment | night_market |
| `jewel_box` | Jewel Box | shard | wave | glass | velvet | night_market |
| `crown` | Crown Velvet | grid | bulb | gilded | velvet | autumn_shrine |
| `cameo` | Cameo | rings | wave | porcelain | velvet | harbour |
| `midnight_club` | Midnight Club | hex | classic | neon | velvet | pixel_valley |
| `dojo` | Dojo | grid | dovetail | wood | tatami | autumn_shrine |
| `shoji` | Shoji | grid | straight | paper | tatami | harbour |
| `teahouse` | Teahouse | hex | wave | porcelain | tatami | night_market |
| `sumi` | Sumi | triangle | saw | ink | tatami | pixel_valley |
| `palace` | Palace | grid | bulb | porcelain | marble | harbour |
| `basilica` | Basilica | rings | straight | glass | marble | night_market |
| `treasury` | Treasury | diamond | classic | gilded | marble | autumn_shrine |
| `colosseum` | Colosseum | brick | dovetail | slab | marble | pixel_valley |
| `workbench` | Workbench | grid | crenel | wood | planks | autumn_shrine |
| `toy_box` | Toy Box | hex | classic | slab | planks | harbour |
| `foundry` | Foundry | grid | saw | metal | planks | pixel_valley |
| `carpenter` | Carpenter | brick | dovetail | card | planks | night_market |
| `synthwave` | Synthwave | grid | classic | neon | neon_grid | night_market |
| `mainframe` | Mainframe | grid | crenel | metal | neon_grid | pixel_valley |
| `hologram` | Hologram | hex | straight | glass | neon_grid | autumn_shrine |
| `arcade` | Arcade | grid | saw | pixel | neon_grid | harbour |
| `eight_bit` | 8-Bit | grid | classic | pixel | pixel_tiles | pixel_valley |
| `dungeon_crawl` | Dungeon Crawl | grid | crenel | pixel | pixel_tiles | night_market |
| `handheld` | Handheld | grid | petite | pixel | pixel_tiles | harbour |
| `sixteen_bit` | 16-Bit | brick | classic | pixel | pixel_tiles | autumn_shrine |
| `adventurer` | Adventurer | grid | lean | card | leather | autumn_shrine |
| `saddlebag` | Saddlebag | brick | classic | wood | leather | harbour |
| `grimoire` | Grimoire | grid | bulb | gilded | leather | night_market |
| `armory` | Armory | triangle | straight | metal | leather | pixel_valley |
| `frostbite` | Frostbite | shard | straight | frost | snow | harbour |
| `snow_globe` | Snow Globe | rings | wave | glass | snow | night_market |
| `ice_palace` | Ice Palace | hex | button | frost | snow | autumn_shrine |
| `winter_porcelain` | Winter Porcelain | grid | twin | porcelain | snow | pixel_valley |
| `nebula` | Nebula | triangle | petite | neon | starfield | autumn_shrine |
| `constellation` | Constellation | hex | wave | gilded | starfield | harbour |
| `comet` | Comet | diamond | wave | frost | starfield | night_market |
| `observatory` | Observatory | rings | classic | glass | starfield | pixel_valley |

**Cuts (tiling):** grid, brick, hex, triangle, diamond, rings, shard. **Sides:** straight, classic, bulb, petite, twin, wave,
dovetail, crenel, saw, button, lean. **Finishes:** card, wood, glass, gilded, porcelain, ink, pixel, neon, frost, slab, metal,
paper. **Tables:** felt, slate, parchment, velvet, tatami, marble, planks, neon grid, pixel tiles, leather, snow, starfield.
**Endings:** rise, sparkle, shine, glow. `pixel_steps` gives stepped pixel-art sides on grid and brick cuts only.

## Piece counts

Grid cuts pick the near-square grid closest to your number (on the measured pictures, 1200 x 800, 1024 x 687 and 800 x 1200, asking for 12, 48, 150 and 256 gave exactly 12, 48, 150 and 256). The lattice cuts land close to it, never above
256 (measured over 1232 cuts at 12, 48, 150 and 256: brick, hex, triangle, diamond, rings and shard gave 12 to 20 pieces for 12, 42 to 57 for 48, 141 to 162 for 150 and 243 to 256 for 256). A grid or brick side has at most 16 pieces,
so a very wide or very tall picture gets fewer (measured: a 2400 x 200 picture asked for 256 gives 32). A piece whose sides would cross itself is cut with
straight sides instead, and lattice pieces cut to a sliver at the picture's edge join a neighbour.

## Performance

Measured on a 1280 x 720 board with vsync off, on integrated AMD Radeon graphics: about 70 pieces cost under 10 ms a frame in both renderers; 256 pieces cost under 12 ms a frame in Forward+ and under 25 ms in Compatibility (the neon and glass finishes are the heaviest). Cutting and laying out 256 pieces takes under half a second, once, when the puzzle opens.

## Files

- `addons/jigsaw/`: `jigsaw_board.gd`, `jigsaw_minigame.gd`, `jigsaw_style.gd`, `jigsaw_cut.gd`, `jigsaw_piece.gd`,
  `jigsaw_paint.gd`, `shaders/jigsaw_face.gdshader`, `styles/` (48 styles), `presets/` (48 showcase scenes, 480 x 320),
  `pictures/` (the four demo pictures).
- `demo/`: the style browser (Q / E style, R new cut, W picture, S solve, T rotation).
- `pack.json`: the style list, machine-readable.

The demo pictures were made with an AI image model; you may use them in your game. No third-party code is included.

## Terms

See `LICENSE.txt`. In short: use it in any number of commercial and free games; do not redistribute the files as a pack.

Made by Core Systems Asset Factory, https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
