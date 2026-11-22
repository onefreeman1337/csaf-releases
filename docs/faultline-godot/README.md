# Faultline: 148 Destruction Presets for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Faultline: 148 Destruction Presets for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-22


---

# Faultline for Godot 4

**The destructible TileMap volume: four addons, 148 presets, one Godot 4.7 project.** Version 1.0.0 · Core Systems Asset Factory

Faultline makes a 2D map that can be mined, broken, burned and ruined, on your own TileMapLayers and your own sprites. Three
finished addons and one new layer that joins them:

| part | folder | what it does | presets |
| --- | --- | --- | --- |
| **Seam** | `addons/seam/` | the ground of your TileMapLayer becomes diggable: crack stages drawn over your tile, chunks and dust in its own colours, ore and gem veins drawn in code, drops | 48 strata |
| **Smithereens** | `addons/smithereens/` | a Breakable2D under any Sprite2D cuts that sprite into pieces by its material (sherds, planks, shards, petals) with crack stages first | 48 break styles |
| **Wrack** | `addons/wrack/` | your town as its aftermath without editing the map: burned, ruined, overgrown, flooded, abandoned, blighted, buried, haunted, over a region you choose | 40 looks |
| **Faultline** | `addons/faultline/` | NEW: one damage call across the three, one saved world state, events that cross packs, and chain reactions | 12 chains |

Each part works alone and ships with its own Readme, unchanged, in `docs/`. Faultline works with any of the three present: a
missing part is one warning naming it, and the steps that need it are skipped.

## Install

Copy the folder of each part you want from `godot/addons/` into your project's `addons/` folder, keeping the folder names (each
part finds its own files by that path). None needs a plugin enabled. Set up each part as its own Readme says:

- `docs/Seam_Readme.md`: a SeamGround2D beside your TileMapLayer, a String custom data layer `seam` naming each tile's stratum.
- `docs/Smithereens_Readme.md`: a Breakable2D as the child of each Sprite2D that can break, with a break style.
- `docs/Wrack_Readme.md`: a Wrack after your TileMapLayers (same parent, same position), listing the layers.

Then add a **FaultlineWorld** node anywhere under the same parent. It finds a SeamGround2D, every Breakable2D and a Wrack under
its `scope` (empty = its parent) by what they can do, not by their class, so it never needs the others to be installed.

## The one damage call

```gdscript
@onready var world: FaultlineWorld = $FaultlineWorld

func _on_bomb(at: Vector2) -> void:
	var r := world.damage(at, 48.0, 3.0, 1, "res://addons/wrack/recipes/ruined_bombarded.tres")
	print(r["nodes_broken"], " props broken, ", r["cells_broken"], " cells broken")
```

- `damage(at_global, radius_px, power = 1.0, tier = 0, recipe_path = "", from_global = INF)`: everything in a disc. Power falls
  off toward the rim (`falloff` export, 1 = a straight line). `from_global` is where the blow came from; INF = the centre, so
  pieces fly away from it.
- `damage_cells(cells, power = 1.0, tier = 0, recipe_path = "", from_global = INF)`: the same over any Array of map cells, full
  power on each.
- `scar(recipe_path, cells, intensity = 1.0)`: only the aftermath, so a look you lay yourself is saved with the world.

The order inside one call, and why: **what stands on a cell breaks first** (Smithereens `hit()`, while its cell still exists),
**then the ground** (Seam `dig()` on each cell, nearest first), **then the aftermath** (Wrack `apply()` and
`set_region_cells()`), because Wrack lays its smoke and embers out from the cells still painted when it is applied. The result
is a Dictionary: `nodes_hit`, `nodes_broken`, `cells_struck`, `cells_broken`, `too_hard`, `aftermath_cells`,
`aftermath_replaced`, and `skipped` (a list of `{what, why}`, one per refusal).

**One aftermath at a time per Wrack.** Wrack puts one recipe's look on every tile of its layers. The same recipe grows its
region; a different recipe replaces the look over the whole region so far (`aftermath_replaced` is true in that call's result).

Other exports: `ground` and `aftermath` (NodePaths, to pick one when you have several), `layers_above` (tiles on these layers
over a broken ground cell fall in with it), `foot_offset` (a breakable stands on the cell under its sprite's position plus this),
`overlay_z` (draw order of the rings and the aftermath's leading edge). Helpers: `cell_at(global)`, `cell_centre(cell)`,
`find_parts()` (look again after adding breakables at runtime; saves do it for you), `parts()`.

## The 12 chain reactions

A chain is a FaultlineChain resource (`addons/faultline/chains/<id>.tres`) holding timed FaultlineStep resources. Set one off
with `world.play(chain, global_point)` or `world.play_at_cell(chain, cell)`; it runs in real time and sends `chain_finished`.

| chain | what happens | Seam | Smithereens | Wrack |
| --- | --- | --- | --- | --- |
| `powder_keg` | a keg goes up: a crater, the crates and pots round it in pieces, a bombarded ring | blast, disc r 3 | cargo_blast + what stands in the disc | ruined_bombarded |
| `fault_line` | an earthquake: a jagged fissure top to bottom, cracks either side, banner and signpost down | blast + crack, jagged line | banner_tear, signpost_snap | ruined_quake |
| `lantern_fire` | a lantern smashes, a burning front climbs up and right, splitting what it reaches | heat cracks | lantern_pop, crate_planks, window_blowout, hay_scatter | burned_smoulder, then burned_blaze |
| `cellar_collapse` | the street drops into a square pit, what stood on it falls in, ash settles | blast, square | what stands on it (cask, jar, sack) | parched_volcanic_ashfall |
| `meteor_strike` | a crater in the lane, star metal set into the rim, violet veins through the field | blast, ore (starmetal) | what stands in the disc | blighted_void_veins |
| `root_heave` | a stump splits, three root lines crack and burst across the plot, moss takes them | dig + blast, branching | stump_kindling, grass_mow, flower_petals | overgrown_reclaimed |
| `blight_bloom` | a puffball bursts, a rot ring widens, plants break, two sinkholes open | crack ring, blast scatter | mushroom_pop, flower_petals, bush_cut | blighted_rot |
| `flash_flood` | the lane splits into a channel, water rises from the bottom edge across the field | blast, line | sack_tear, jug_splash, egg_hatch | flooded_deep |
| `cave_in` | a pit prop gives, the side passage refills cell by cell to cracked rock, dust | refill + crack | pillar_crumble | parched_dust_bowl |
| `ore_blast` | a charge bursts the rock face in a fan, ore drops tumble out, walls smoulder | blast, cone | ore_vein, crystal_facets | burned_smoulder |
| `crypt_seal` | the stele topples, bones clatter, the wall opens onto a niche ringed with glowstone | blast, ore (glowstone) | stele_topple, bone_clatter, skull_crack | haunted_cursed_ground |
| `gem_resonance` | a rose crystal cracks on three notes and bursts, gems set round it crack and fall out | ore (amethyst), crack, blast | resonance_burst | blighted_crystal |

**Chain parameters** (on the FaultlineChain, in the Inspector): `time_scale` (speed), `radius_scale` (scale of every radius and
length), `power_scale` (damage intensity), `aftermath_intensity` (the Wrack recipe's intensity), `accent_color` (the shock
rings and the aftermath's leading edge), `seed_value` (every jagged line, branch and scatter), `showcase_time` (the moment a
still shows), plus `title` and `description`.

**Step fields** (FaultlineStep): `at` (seconds), `action` (`blast`, `dig`, `crack`, `refill`, `ore`, `smash`, `hit`, `scar`,
`shock`), `shape` (`disc`, `square`, `ring`, `line`, `cone`, `branch`, `rows_up`, `sweep`, `scatter`, `cell`), `origin` and `to`
(cells from the chain's origin), `radius`, `inner`, `angle_deg`, `spread_deg`, `count`, `jitter`, `width`, `order` (`shape`,
`noise`, `instant`), `stagger` (seconds between one order step and the next, so a crack travels), `power`, `tier`, `stage`,
`damage`, `recipe` (a Wrack recipe path), `ore` (a Seam stratum id), `targets` (sprite names; empty = every breakable standing
in the shape), `ring_seconds`. Make your own chain by duplicating a shipped one and editing its steps. A recipe path that does
not exist is an error naming the path.

`seek(chain, global_point, t)` / `seek_at_cell(chain, cell, t)` give a still of a chain at time `t` with no flash or shake, the
pieces advanced to `t`, then everything held (`freeze()`); use it on a fresh scene for previews and screenshots.

## Events across the packs

Signals: `chain_started(chain, origin_cell)`, `chain_finished(chain)`, `cell_broken(cell, stratum_id, global_position)`
(re-sent from Seam, for your own `dig()` calls too), `node_broken(node_path, debris)` (re-sent from Smithereens),
`aftermath_grew(cells)`. Two built-in reactions, each an export you can switch off:

- `undermine` (on): when a ground cell breaks, every breakable standing on it falls in and breaks.
- `ignite_recipe` (empty = off): a breakable whose sprite is in the group `faultline_ignites` scars its cell and the ring round it
  with this Wrack recipe when it breaks (a lantern that smashes scorches the floor).

## One saved world

```gdscript
var save := world.get_world_state()        # JSON-safe: ints, floats, strings, arrays
FileAccess.open("user://world.json", FileAccess.WRITE).store_string(JSON.stringify(save))
# ... later, on a freshly loaded scene, before any damage:
var r := world.load_world_state(JSON.parse_string(FileAccess.get_file_as_string("user://world.json")))
```

The state holds Seam's own save (dug cells and cracks), the ores Faultline set, the tiles that fell in from `layers_above`, every
breakable's broken flag and hits (hits you dealt directly are saved too), and the aftermath (recipe path, intensity, cells). Keys
are node paths under `scope`. `load_world_state()` restores Seam first, then the breakables, then the aftermath, and returns
counts (`cells_dug`, `cracks`, `ores`, `tiles_fallen`, `nodes_broken`, `nodes_cracked`, `aftermath_cells`) and `skipped`.
Smithereens sends `broken` for each node it re-breaks during a load: connect your own listeners after the load, or check
`world.is_loading()`.

What a load does not bring back:

| part | not restored | why |
| --- | --- | --- |
| Seam | drops lying on the ground uncollected; heal clocks restart | not in Seam's own save data |
| Seam | ores you set yourself with `set_ore()` (Faultline's own are saved) | not in Seam's own save data |
| Smithereens | debris and spills in the air or on the ground | debris is a short-lived node |
| Smithereens | a node freed before Faultline saw it; a hidden node's regrow timer (it restarts) | it no longer exists to be found |
| Wrack | a region you set on Wrack yourself; a transition in flight (the finished look is loaded) | Wrack keeps no region record |
| Wrack | a recipe edited in memory with no file | Faultline saves recipes by path |
| Wrack | the smoke and embers restart from zero | they are particles built fresh |

Call `load_world_state()` on a freshly loaded scene: Seam re-derives each cell from the map as painted.

## The project

Open `godot/project.godot` and press F5. The menu opens each part's own demo (every stratum, break style and look in it),
**the 12 chains** (each on its demo base, on a loop; Left and Right to step, Space to set it off again) and **the Quarry**: the
whole demo town with every prop, where 1 to 8 picks a chain, a click sets it off there, D is the one damage call at the mouse,
S saves the world to `user://faultline_world.json`, L reloads the scene and loads the save back (the counts are printed on
screen) and R starts clean. F10 comes back to the menu from any demo. `godot/faultline_demo/` is demo code; your game does not
need it. Smithereens adds the global class names `Breakable2D` and `Smithereens`: rename yours if your project already uses them.

## Renderers and versions

Every preset of the four parts was run and photographed under **Forward+** and **Compatibility** (OpenGL 3, the web renderer)
in Godot **4.7.2**, in this one project, with zero shader or script errors under either. Earlier Godot 4 versions were not run.

## Licence

See LICENSE.txt: use it in any number of games, edit it freely; no resale or redistribution of the files as a pack; no AI
training. The demo tiles in `godot/demos/seam/mine/` (Verdant Ironworks) and `godot/demos/wrack/fixture/` (Verdant 09 Town)
come from CSAF's own tilesets (each folder's NOTICE.txt names them); Smithereens' sample props are part of its addon.

This volume is AI-generated: every script, shader and preset, the demos and the Quarry were written by an AI.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
