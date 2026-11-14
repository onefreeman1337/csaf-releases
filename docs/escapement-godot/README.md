# Escapement: 48 Clockwork Gear Puzzles for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Escapement: 48 Clockwork Gear Puzzles for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-14


---

# Escapement for Godot 4: Clockwork Gear Puzzles Drawn in Code, 48 Mechanisms

Escapement is a Godot 4.7 addon that puts a clockwork puzzle in your game: a plate with fixed arbors, a tray of loose wheels,
a mainspring barrel that drives and a payoff that only moves when the train is right. It ships 48 mechanisms in
12 workshops, each drawn entirely in code (canvas shaders and `_draw()`): no image files.

- Wheels mesh only when their sizes fit the gap between two arbors.
- Every wheel turns the opposite way to the one driving it.
- The payoff only turns one way. Reach it the wrong way round and **the pawl holds**.
- Close a loop of an odd number of wheels and the whole train **jams**.

Every puzzle is generated from a key (any text) and laid around a working train, so it cannot be unsolvable, and the same key is the same puzzle on every machine.

## Installing

1. Copy `addons/escapement/` into your project's `addons/` folder. Keep the folder's name and layout: the shipped mechanism files name `res://addons/escapement/` by path, and the wheels find their shader and font beside their own script. (A mechanism you make in code works from any folder.)
2. Nothing to enable: the classes (`EscapementPuzzle`, `EscapementMechanism`, `EscapementWheel`, `EscapementCore`) register themselves.
3. Open `demo/demo.tscn` in this project first to play every mechanism.

Godot **4.7.2** was run (Forward+ and Compatibility). Older 4.x versions were not run.

## Using it

Add an **EscapementPuzzle** node (a Node2D) to a scene and set:

| Property | What it does |
| --- | --- |
| `mechanism` | an `EscapementMechanism` (pick one of `addons/escapement/mechanisms/*.tres`, or your own) |
| `puzzle_key` | any text: the puzzle's seed. Two puzzles with the same key and grade are the same puzzle |
| `grade` | 1 (three wheels, nothing hidden) to 5 (five or six wheels, a wrong-way trap route, dead ends, decoys) |
| `interactive` | mouse, keys and gamepad play it; off, it only draws |
| `show_tray` | the drawer of loose wheels under the plate |
| `show_bench` | a leather workbench behind the plate |
| `title_override` | the name engraved on the plate (blank = the mechanism's title) |
| `show_status` | a line of words under the tray saying what just happened |
| `allow_leave_unsolved` | if false, a leave request is refused until the train is complete |
| `start_solved` | start with the solution set (a finished machine for decoration) |

The node draws in plate units: the plate is 640 x 380 and the tray sits under it (640 x 500 in all). Scale the node to fit your screen.

**Signals:** `solved`, `jammed`, `pawl_held`, `wheel_set(arbor, tray_index)`, `wheel_lifted(arbor, tray_index)`, `refused(arbor, tray_index, reason)`, `leave_requested`.

**Methods:** `is_solved()`, `state()` ("open", "solved", "pawl" or "jammed"), `place(arbor, tray_index)`, `lift(arbor)`, `reset()`, `solve_now()`, `get_state()` / `set_state(dict)` (a save record), `set_frozen(bool)`, `footprint()`, `arbor_count()`, `tray_size()`, `arbor_position(i)`.

**Cost.** Measured with vsync off on the machine it was built on: a grade 5 puzzle builds in under 60 ms; one puzzle filling a 1920 x 1080 screen averaged under 7 ms a frame under both renderers. A turning train re-sends every wheel's angle each frame, which Forward+ charges more for: fifty animated at once averaged under 180 ms a frame under Forward+ and under 60 ms under Compatibility, and fifty frozen with `set_frozen(true)` under 15 ms. Freeze the puzzles that only need to be seen (a level select, a menu).

```gdscript
var p := EscapementPuzzle.new()
p.mechanism = load("res://addons/escapement/mechanisms/watchmaker_lock.tres")
p.puzzle_key = "vault_door"
p.grade = 3
p.solved.connect(func(): open_the_vault())
add_child(p)
```

## Controls

- **Mouse / touch:** click an arbor, then a wheel in the tray (or a wheel first, then the arbor). Click a set wheel to lift it back.
- **Keys / gamepad:** `ui_left/right/up/down` choose an arbor; `ui_accept` opens the tray, the arrows choose a wheel, `ui_accept` sets it; `ui_accept` on a set wheel lifts it; `ui_cancel` closes the tray, or asks to leave.

## The mechanisms

A mechanism is a workshop's look (tooth profile, wheel webs, plate finish, metals and render style) and the payoff its train drives: a strongroom bolt, a tower clock (the minute hand is the output wheel's arbor), an orrery of three planets or a winch that raises a counterweight. Every field is an exported parameter on `EscapementMechanism`.

### Watchmaker

Brass wheels with watch teeth on a Geneva-striped plate, ruby jewels in gold chatons.

- **Watchmaker: Strongroom** `watchmaker_lock`
- **Watchmaker: Horologe** `watchmaker_clock`
- **Watchmaker: Orrery** `watchmaker_orrery`
- **Watchmaker: Winch** `watchmaker_winch`

### Royal Atelier

Gold wheels with rounded teeth and filigree webs over a lapis guilloche enamel, sapphire jewels.

- **Royal Atelier: Strongroom** `royal_lock`
- **Royal Atelier: Horologe** `royal_clock`
- **Royal Atelier: Orrery** `royal_orrery`
- **Royal Atelier: Winch** `royal_winch`

### Foundry

Cast-iron cog wheels with square teeth and cross webs on a riveted iron panel, brass bosses.

- **Foundry: Strongroom** `foundry_lock`
- **Foundry: Horologe** `foundry_clock`
- **Foundry: Orrery** `foundry_orrery`
- **Foundry: Winch** `foundry_winch`

### Millwright

Oak wheels with lantern-peg teeth on planked boards, iron fittings.

- **Millwright: Strongroom** `millwright_lock`
- **Millwright: Horologe** `millwright_clock`
- **Millwright: Orrery** `millwright_orrery`
- **Millwright: Winch** `millwright_winch`

### Verdigris Ruin

Corroded green bronze wheels on a cracked stone slab overgrown with moss, emerald jewels.

- **Verdigris Ruin: Strongroom** `verdigris_lock`
- **Verdigris Ruin: Horologe** `verdigris_clock`
- **Verdigris Ruin: Orrery** `verdigris_orrery`
- **Verdigris Ruin: Winch** `verdigris_winch`

### Copperworks

Copper wheels with star-window and fine-spoke webs on a perlage-polished plate.

- **Copperworks: Strongroom** `copperworks_lock`
- **Copperworks: Horologe** `copperworks_clock`
- **Copperworks: Orrery** `copperworks_orrery`
- **Copperworks: Winch** `copperworks_winch`

### Arcane Sanctum

Wheels traced in violet light over a slate plate carved with a glowing sigil.

- **Arcane Sanctum: Strongroom** `arcane_lock`
- **Arcane Sanctum: Horologe** `arcane_clock`
- **Arcane Sanctum: Orrery** `arcane_orrery`
- **Arcane Sanctum: Winch** `arcane_winch`

### Crystal Grotto

Ice-clear wheels with pointed crystal teeth on a frosted plate, cyan jewels.

- **Crystal Grotto: Strongroom** `crystal_lock`
- **Crystal Grotto: Horologe** `crystal_clock`
- **Crystal Grotto: Orrery** `crystal_orrery`
- **Crystal Grotto: Winch** `crystal_winch`

### Ossuary

Carved bone wheels with eye-socket webs on black granite inlaid with a bone border.

- **Ossuary: Strongroom** `ossuary_lock`
- **Ossuary: Horologe** `ossuary_clock`
- **Ossuary: Orrery** `ossuary_orrery`
- **Ossuary: Winch** `ossuary_winch`

### Blueprint

The whole mechanism as a draughtsman's drawing: white line wheels with dashed pitch circles on a blue grid.

- **Blueprint: Strongroom** `blueprint_lock`
- **Blueprint: Horologe** `blueprint_clock`
- **Blueprint: Orrery** `blueprint_orrery`
- **Blueprint: Winch** `blueprint_winch`

### Pixel Works

Square-cog wheels drawn on a 3-unit grid in five levels a channel, on a dithered plate.

- **Pixel Works: Strongroom** `pixel_lock`
- **Pixel Works: Horologe** `pixel_clock`
- **Pixel Works: Orrery** `pixel_orrery`
- **Pixel Works: Winch** `pixel_winch`

### Infernal Forge

Obsidian wheels with red-hot crystal teeth on black glass split by glowing lava.

- **Infernal Forge: Strongroom** `infernal_lock`
- **Infernal Forge: Horologe** `infernal_clock`
- **Infernal Forge: Orrery** `infernal_orrery`
- **Infernal Forge: Winch** `infernal_winch`

## EscapementMechanism parameters

`title`, `workshop`, `notes`, `payoff` (lock, clock, orrery, winch), `payoff_label`; wheels: `tooth` (watch, rounded, square cog, lantern pegs, crystal), `webs` (eight web cuts the loose wheels choose from), `output_web`, `render` (shaded, ink, glow, hot), `metal_hi` / `metal_mid` / `metal_lo` / `metal_edge` / `metal_cut`, `glint`, `accent_hi` / `accent_mid` / `accent_lo` / `accent_edge`, `line_color`, `glow_color`, `shadows`; plate: `plate` (twelve finishes), `plate_hi` / `plate_mid` / `plate_lo`, `plate_detail`, `plate_glow`, `corner_radius`, `jewel`, `chaton`, `engrave_ink`; `pixel` (draw on a grid of this many units), `levels` (posterise); motion: `drive_speed`, `payoff_turns`; `preview_angle`, `preview_progress` (the moment a preview is posed at).

## Renderers

Every mechanism compiles and draws under **Forward+** and **Compatibility** (OpenGL 3, web exports). Each was photographed under both with zero engine error lines.

## Licence

See LICENSE.txt: use it in any number of games; do not resell or redistribute the files as a pack. The font is Cormorant Garamond under the SIL Open Font License (fonts/OFL-CormorantGaramond.txt).

This pack is AI-generated (code and drawing). Made by Core Systems Asset Factory, https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
