# Schuss: 48 Downhill Runs for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Schuss: 48 Downhill Runs for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-15


---

# Schuss for Godot 4: Downhill Run Minigames Drawn in Code

Downhill runs for a Godot 4 game. The player skis, snowboards, sleds, rides a mine cart or steers a raft down a course the
addon lays out and draws, through slalom gates, after coins, or ahead of something chasing them. 48 courses in
12 themes, 48 obstacle forms, 5 ride modes and 3 goals. Every slope, mine, river, obstacle, gate, coin, vehicle,
pursuer and the default rider is drawn by the addon's code; no image files ship.

Copyright (c) 2026 Core Systems Asset Factory. Terms of use: LICENSE.txt.

## Requirements

- Godot 4.7 (built and tested on 4.7.2 stable). Older 4.x versions were not run.
- Both renderers: Forward+ and Compatibility (the web and low-end renderer). Every course is photographed under both.
- 2D. No GDExtension, no plugin to enable.

## Install

1. Copy the folder `addons/schuss/` into your project (keep the name and the folders inside it).
2. That is all: the classes `SchussRun`, `SchussCourse`, `SchussTheme` and `SchussForms` are registered by name.

The demo project (`godot/`, open `project.godot`) runs every course: click a run to watch the autopilot ride it, P to ride it
yourself, A for the autopilot, N for the next run, R for a new course of the same kind.

## Start a run

Add a `SchussRun` node to a scene, set its `theme` to one of `addons/schuss/themes/*.tres`, pick a `mode` and a `goal`, and
play the scene. Or from code:

```gdscript
var run := SchussRun.new()
run.theme = load("res://addons/schuss/themes/alpine.tres")
run.mode = SchussCourse.Mode.SKI         # SKI, BOARD, SLED, CART, RAFT
run.goal = SchussCourse.Goal.SLALOM      # SLALOM, COLLECT, CHASE
run.difficulty = 3                       # 1 to 5
run.seconds = 60.0                       # about how long a clean run takes
run.course_seed = "old mine"             # blank = a new course every run
run.size = Vector2(480, 320)             # the run draws inside this rectangle; (0, 0) = the viewport
run.finished.connect(func(result): print(result))
add_child(run)
```

A theme suits a mode (snow themes for ski, snowboard and sled; mine themes for the cart; river themes for the raft), but any
mode runs on any theme.

## Controls

| Input | Action |
| --- | --- |
| Left / Right | Steer. In the mine cart: change rails, only at a switch (the lamps beside the track mark one) |
| Down | Tuck (faster) |
| Up | Brake |
| Accept | Hop (mine cart, over a gap in the rails) |
| Cancel | Give up the run |
| Mouse / touch | Hold the left or right half of the run to steer |

The keys are Godot's `ui_left`, `ui_right`, `ui_down`, `ui_up`, `ui_accept` and `ui_cancel` actions, so a gamepad works out of
the box. Change them in the node's Input actions group.

## Every course can be finished

A course is laid around a hidden clean line first: a route from the top to the bottom that can be ridden at full speed, through
every gate, with nothing on it. Everything else is placed around that line; ramps, ice and falls sit only where it runs straight.
Then the addon's own autopilot rides the course along the line, using the same movement code as the player; anything that ride
hits is removed and any gate or line coin it misses is moved onto its path, and the ride repeats until it is clean. Harder
courses make the clean corridor narrower and the rest of the slope busier; coins off the line are the risky ones.

## The node: SchussRun

| Parameter | What it does |
| --- | --- |
| `theme` | The SchussTheme: ground, colours, forms, light. Blank = `themes/alpine.tres` when it is present |
| `mode` | SKI, BOARD, SLED, CART or RAFT |
| `goal` | SLALOM (gates against the clock), COLLECT (coins), CHASE (keep ahead of the pursuer) |
| `difficulty` | 1 to 5: the speed, how busy the course is and how narrow the clean corridor |
| `seconds` | 15 to 240: about how long a clean run takes |
| `course_seed` | Blank = a new course every run; any text = the same course every time |
| `size` | The rectangle the run draws in, from the node's position down and right; (0, 0) = the viewport |
| `course_width` | The widest course in pixels (640). A wider run lays its course out this wide and scales it up to fill: a 1920 x 1080 run shows a 640 x 360 course at 3x, the HUD drawn sharp. 0 = always 1:1 |
| `autostart` | Start a run when the node enters the tree |
| `demo` | The autopilot rides (an attract screen or a preview); a demo run sets no best time |
| `show_hud` | The time, gates, coins or lead, the progress strip and the result card |
| `rider_texture` | Any picture of your character standing, feet at the bottom edge. Blank = the drawn rider |
| `rider_height` | The rider picture's height in pixels |
| `rider_scale` | Draws the rider, vehicle and shadow larger or smaller (collisions are unchanged) |
| `pursuer_texture` | A picture to chase the rider in a CHASE run. Blank = the theme's pursuer |
| `jacket` | The drawn rider's jacket colour |
| `miss_penalty` | Seconds added for each missed slalom gate |
| `preview_at` | Where `csaf_preview()` poses the run, as a fraction of the course |
| `action_left, action_right, action_tuck, action_brake, action_hop, action_give_up` | The input action names |
| `touch_steering` | Hold the left or right half of the run to steer |

Methods: `start()` lays out a new course and starts; `give_up()`; `last_result()`; `csaf_preview()` poses the course at
`preview_at` and freezes it (a menu thumbnail). Static: `SchussRun.best(key)`, `SchussRun.export_bests()` (a Dictionary for your
save file) and `SchussRun.import_bests(dictionary)`; `best_key()` names this run's course.

Signals: `run_started(info)`, `gate_passed(index)`, `gate_missed(index)`, `coin_collected(total)`, `crashed(total)`, `jumped`,
`caught`, `finished(result)`.

`result` holds: `mode`, `goal`, `theme`, `seed`, `difficulty`, `finished` (reached the bottom), `caught`, `gave_up`, `time`,
`penalty`, `total` (time plus penalty), `gates`, `gates_missed`, `coins`, `coins_total`, `crashes`, `best`, `new_best`, `demo`.
A best time is kept for runs with a fixed `course_seed` that the player finished (never a demo run).

## The themes

Each theme is a `SchussTheme` resource in `addons/schuss/themes/`: open one in the inspector and every colour, the forms on the
course and at its edges, the density, the darkness and lamp light, the wash, the snowfall and the pursuer are one field each.

| Theme | Ground | What it looks like | Pursuer |
| --- | --- | --- | --- |
| `alpine` Alpine Piste | snow | A groomed piste through dark pines, lift pylons and a log cabin, in full daylight | yeti |
| `birchwood` Birchwood | snow | Golden birches, split-rail fences and snowmen on cream snow | yeti |
| `floodlit` Floodlit Night | snow | A night run under lamp posts, each pool of light the only colour on a blue-black slope | yeti |
| `glacier` Glacier | snow | Blue ice: seracs, crevasses and polished ice patches under a pale sun | avalanche |
| `alpenglow` Alpenglow | snow | Dusk on the high slopes: rose snow, violet shadows, dead trees and a lit cabin | yeti |
| `whiteout` Whiteout | snow | A storm on the mountain: driving snow, muted pines and fences half buried | avalanche |
| `goldmine` Gold Seam | mine | A timbered gold mine: lanterns on pit props, ore carts, crates and the odd broken rail | boulder |
| `crystal` Crystal Deep | mine | A violet cavern where crystal clusters are the only light | rockfall |
| `forge` Forge Run | mine | The deep workings: lava pools, anvils and red iron, lit from below | boulder |
| `snowmelt` Snowmelt River | river | A cold river between snowy banks: drift ice, logs, wet rocks and a fall | flood |
| `jungle` Jungle Rapids | river | Green water under mangroves: lily pads, snags and a whirlpool | flood |
| `canyon` Red Canyon | river | Turquoise water through red sandstone: boulders, flat slabs and a long fall | flood |

## The 48 runs

Every run is a scene in `demo/presets/` (the theme, mode, goal and difficulty set, the course seed = its id).

| Run id | Title |
| --- | --- |
| `alpine_ski_slalom` | Alpine Piste: Ski Slalom |
| `alpine_board_collect` | Alpine Piste: Snowboard Collect |
| `alpine_sled_chase` | Alpine Piste: Sled Chase |
| `alpine_board_slalom` | Alpine Piste: Snowboard Slalom |
| `birchwood_ski_chase` | Birchwood: Ski Chase |
| `birchwood_sled_collect` | Birchwood: Sled Collect |
| `birchwood_ski_collect` | Birchwood: Ski Collect |
| `birchwood_board_chase` | Birchwood: Snowboard Chase |
| `floodlit_sled_slalom` | Floodlit Night: Sled Slalom |
| `floodlit_ski_slalom` | Floodlit Night: Ski Slalom |
| `floodlit_board_collect` | Floodlit Night: Snowboard Collect |
| `floodlit_sled_chase` | Floodlit Night: Sled Chase |
| `glacier_board_slalom` | Glacier: Snowboard Slalom |
| `glacier_ski_chase` | Glacier: Ski Chase |
| `glacier_sled_collect` | Glacier: Sled Collect |
| `glacier_ski_collect` | Glacier: Ski Collect |
| `alpenglow_board_chase` | Alpenglow: Snowboard Chase |
| `alpenglow_sled_slalom` | Alpenglow: Sled Slalom |
| `alpenglow_ski_slalom` | Alpenglow: Ski Slalom |
| `alpenglow_board_collect` | Alpenglow: Snowboard Collect |
| `whiteout_sled_chase` | Whiteout: Sled Chase |
| `whiteout_board_slalom` | Whiteout: Snowboard Slalom |
| `whiteout_ski_chase` | Whiteout: Ski Chase |
| `whiteout_sled_collect` | Whiteout: Sled Collect |
| `goldmine_cart_slalom` | Gold Seam: Mine Cart Slalom |
| `goldmine_cart_collect` | Gold Seam: Mine Cart Collect |
| `goldmine_cart_chase` | Gold Seam: Mine Cart Chase |
| `goldmine_cart_collect_expert` | Gold Seam: Mine Cart Collect (Expert) |
| `crystal_cart_slalom` | Crystal Deep: Mine Cart Slalom |
| `crystal_cart_collect` | Crystal Deep: Mine Cart Collect |
| `crystal_cart_chase` | Crystal Deep: Mine Cart Chase |
| `crystal_cart_collect_expert` | Crystal Deep: Mine Cart Collect (Expert) |
| `forge_cart_slalom` | Forge Run: Mine Cart Slalom |
| `forge_cart_collect` | Forge Run: Mine Cart Collect |
| `forge_cart_chase` | Forge Run: Mine Cart Chase |
| `forge_cart_collect_expert` | Forge Run: Mine Cart Collect (Expert) |
| `snowmelt_raft_slalom` | Snowmelt River: Raft Slalom |
| `snowmelt_raft_collect` | Snowmelt River: Raft Collect |
| `snowmelt_raft_chase` | Snowmelt River: Raft Chase |
| `snowmelt_raft_slalom_expert` | Snowmelt River: Raft Slalom (Expert) |
| `jungle_raft_slalom` | Jungle Rapids: Raft Slalom |
| `jungle_raft_collect` | Jungle Rapids: Raft Collect |
| `jungle_raft_chase` | Jungle Rapids: Raft Chase |
| `jungle_raft_slalom_expert` | Jungle Rapids: Raft Slalom (Expert) |
| `canyon_raft_slalom` | Red Canyon: Raft Slalom |
| `canyon_raft_collect` | Red Canyon: Raft Collect |
| `canyon_raft_chase` | Red Canyon: Raft Chase |
| `canyon_raft_slalom_expert` | Red Canyon: Raft Slalom (Expert) |

## The 48 obstacle forms

`SchussForms.draw(canvas_item, id, palette)` draws any form on any CanvasItem. A solid form is a crash; a mogul slows; ice
takes the grip away; a ramp or a fall is a jump; a gap must be hopped; an eddy slows a raft; a decor form stands beside the course.

- **The snow (20):** `pine`, `tall_pine`, `snowy_pine`, `birch`, `dead_tree`, `stump`, `rock`, `boulder`, `cabin`, `snowman`, `fence`, `signpost`, `lift_pylon`, `lamp_post`, `mogul` (mogul), `ice_patch` (ice), `ramp` (ramp), `crevasse`, `serac`, `flag_marker` (decor)
- **The mine (14):** `crate`, `barrel`, `rockfall`, `ore_cart`, `buffer`, `gap` (gap), `lantern` (decor), `crystal`, `pit_prop` (decor), `pickaxe` (decor), `lava_pool`, `anvil`, `signal_lamp` (decor), `timber_arch` (decor)
- **The river (14):** `wet_rock`, `flat_rock`, `log`, `snag`, `buoy`, `eddy` (eddy), `falls` (falls), `reeds` (decor), `lily_pad` (decor), `bank_stone` (decor), `whirlpool`, `drift_ice`, `red_boulder`, `mangrove`

## Renderers and cost

Every course compiles and draws under Forward+ and Compatibility with zero errors. A run draws only the forms near its view:
forms are created as the course scrolls into view and freed behind it. A run wider than `course_width` paints its ground at
layout resolution and stretches it.

Measured on the machine that built it (an integrated AMD Radeon, vsync off, the demo riding): one run filling a 1920 x 1080
screen averaged under 12 ms a frame under both renderers; nine runs at once on one 1920 x 1080 screen averaged under 140 ms a
frame under Forward+ and under 60 ms under Compatibility. Laying out a course happens once, in `start()`: a 120-second course
builds in under 1.5 seconds and a 60-second one in about half that, so start a run behind a fade or a menu if the pause matters.

## Licence

See LICENSE.txt: use it in any number of games, edit it freely; do not resell or redistribute the files as a pack. The font in
`addons/schuss/fonts/` is Alegreya Sans under the SIL Open Font License 1.1 (OFL-AlegreyaSans.txt beside it).

This pack is AI-generated (code and every drawn picture); see LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
