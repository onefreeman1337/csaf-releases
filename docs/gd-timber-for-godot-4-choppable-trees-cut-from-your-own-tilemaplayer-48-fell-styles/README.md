# Timber for Godot 4: Choppable Trees Cut From Your Own TileMapLayer, 48 Fell Styles — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Timber for Godot 4: Choppable Trees Cut From Your Own TileMapLayer, 48 Fell Styles  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-01


---

# Timber for Godot 4

**The trees already painted on your TileMapLayer can be chopped down.** Each blow shudders the tree and opens a notch in
its own bark; chips and leaves fly. The last blow brings it down in one of 8 ways (topple, crash, snap, whip, uproot,
slice, shatter, burn). The crown breaks into clumps and leaves cut from its own pixels, the trunk splits into logs cut
from its own bark, and a stump with a cut face stays. After a while it grows back from a sapling.

Every leaf, chip, log, stump face, crater and ember is drawn by code at run time from the tree you painted. No tree
sprite sheets, no frame art. 48 styles ship: 6 kinds of tree x 8 falls.

Version 1.0.0 · Godot 4.7 (run on 4.7.2; older 4.x versions were not run) · Core Systems Asset Factory

---

## Install

1. Copy `addons/timber/` into your project's `addons/` folder. There is no plugin to enable.
2. Open `demo/demo.tscn` in this project to see it first: click a tree, it falls away from the side you clicked.

`addons/timber/demo_trees/` and `addons/timber/presets/` are demo art and showcase scenes; you can delete both once your
own trees are tagged. Keep `styles/` (the 48 styles live there).

---

## Make your trees choppable

1. Select your TileSet. In **Custom Data Layers**, add a layer named `timber` of type **String**.
2. Paint the word on every tile of every tree (TileSet editor, Paint, Custom Data):
   `broadleaf`, `conifer`, `palm`, `dead`, `birch` or `mushroom`. Add a fall to choose how it comes down:
   `conifer-snap`, `palm-whip`, `dead-burn`. A word with only a fall (`crash`) uses the layer's `default_kind`.
3. Add a **TimberLayer2D** node anywhere in the scene and set its `tile_layer` to the layer your trees are on.
4. From your player, strike a tree:

```gdscript
@onready var timber: TimberLayer2D = $TimberLayer2D

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_accept"):
		var target := global_position + facing * 16.0   # a point on the tree in front of you
		timber.chop_at(target, global_position)          # it falls away from the player
```

### Three ways a tree can be painted (all found)

| Your tree is | Timber reads it as |
| --- | --- |
| one big atlas tile (a 32x48 tree is one tile, size 2x3) | one tree |
| several 16x16 tiles painted together from the atlas (a 2x2 tree) | one tree: two neighbours belong together when their atlas tiles are neighbours the same way |
| a trunk on the tree layer and a canopy on a second layer | one tree: set `canopy_layer` and tag the canopy tiles too; a canopy joins the tagged trunk directly below it |

Two copies of the same tree standing side by side stay two trees.

**What it needs from your art:** tree tiles with a transparent background, on their own layer (not baked into ground
tiles). Flip H and Flip V alternatives are read; a transposed alternative is rotated, untested on real art.

---

## What happens when a tree is struck

The first blow lifts the tree off the map: its cells are erased and a **TimberTree2D** drawn from the same pixels takes
its place (same position, scale and z index, added beside your tile layer so a y-sorted parent sorts it with your
characters). When it grows back, the exact cells (source, atlas coords, alternative) are put back and the node is freed.

| Kind | Blows | Debris | What is left |
| --- | --- | --- | --- |
| broadleaf | 3 | leaves and clumps of its own crown, chips | 3 logs, a ringed stump |
| conifer | 4 | needles, wide boughs, cones, snow if the crown has snow | 4 logs, a ringed stump |
| palm | 2 | fronds, coconuts | 5 short segments, a fibrous stump |
| dead | 2 | splinters and twigs | 2 logs, a cracked grey stump |
| birch | 3 | small leaves, white bark curls | 3 white logs, a pale stump |
| mushroom | 2 | glowing spores, soft flesh | 2 stem pieces, a flesh stump |

| Fall | How it comes down |
| --- | --- |
| topple | topples about the notch, bounces, the crown breaks up, the trunk splits into logs |
| crash | falls heavier and faster, a cloud of dust, logs roll apart |
| snap | snaps at the notch with a jagged break, drops into it, then tips |
| whip | the crown lags behind, then springs past as it lands |
| uproot | no notch: blows loosen it, it tips over roots and all and leaves a crater |
| slice | one bright stroke cuts it through at an angle; the top slides off and falls |
| shatter | does not fall: bursts apart where it stands into pieces of itself |
| burn | each blow is fire: it chars from the foot up, falls burning and lands as ash and embers |

Blows are the kind's number for topple, crash, snap, whip and shatter; uproot takes one more, slice and burn one fewer
(never fewer than 2). Each is the style's `chops`, a slider.

Struck from the left, a tree falls right, and from the right it falls left. Trees always fall sideways, so a tree lying
on the ground is drawn at its full length in both top-down and side views.

---

## TimberLayer2D

| Property | Default | What it does |
| --- | --- | --- |
| `tile_layer` | none | the TileMapLayer your trees (or trunks) are on |
| `canopy_layer` | none | optional second layer of canopies |
| `custom_data_name` | `timber` | the String custom data layer that marks tree tiles |
| `default_kind` | broadleaf | kind for a word that names only a fall |
| `default_fall` | topple | fall for a word that names only a kind (read when a tree is first struck) |
| `styles` | {} | your own TimberStyle per kind word, used instead of the shipped one |
| `regrow_time` | 300 | seconds after a fall until it grows back (0 = never) |
| `side_view` | false | debris lands on the ground line (platformers) instead of scattering around the foot |
| `stump_blocks` | true | a stump gets a StaticBody2D so it blocks like the trunk did |
| `stump_collision_layer` | 1 | physics layer bits for stump bodies |
| `trees_parent` | none | where lifted trees go (empty = the tile layer's parent) |

Methods: `chop_at(point, from)`, `fell_at(point, from)` (at once), `tree_at(point)`, `is_tree(point)`,
`regrow_all(seconds)`, `felled_count()`, `tree_count()`, `rescan()` (after painting new trees at run time),
`get_save_data()` and `load_save_data(data)`.

Signals: `tree_hit(tree, chops_left)`, `tree_felled(tree, direction)`, `tree_landed(tree, force)`,
`log_spawned(tree, global_position)` (give wood here), `tree_regrown(cell)`.

**Saves.** `get_save_data()` returns one small Dictionary per felled tree (`cell`, `dir`, `left` seconds). Load the level,
let the layer scan (it scans on the frame after `_ready`), then call `load_save_data()`: those trees come back as stumps
at once, no animation, and grow back over the time left.

## TimberTree2D (one tree without a TileMapLayer)

Add a TimberTree2D, give it a `texture` (a sprite, any picture with a transparent background) and a `style`. Its origin is
the foot of the trunk. Call `chop(from_global)`, `fell(from_global)`, `fell_toward(1 or -1)`, `regrow_now(seconds)`,
`reset()`. `play_story(true)` makes it chop itself on a loop (what the preset scenes do). Same signals as above, without
the tree argument: `hit`, `felled`, `landed`, `log_spawned` (local position), `regrow_started`, `regrown`.

## TimberStyle (every preset is one, every number is a slider)

`kind`, `fall`, `chops`, `speed`, `weight`, `bounce`, `debris` (amount), `particle_size`, `shudder`, `logs`, `tint` (multiplies
every colour taken from your tree), `wood_color` (cut faces, rings, chips), `accent_color` (embers, the slice glint,
spores), `dust`, `debris_stay` and `logs_stay` (seconds, 0 = until it regrows), `slice_angle`.

Load a shipped one by id with `TimberLibrary.style("conifer-snap")`. All 48 ids: `<kind>-<fall>` for the 6 kinds and 8
falls above.

---

## Renderers

Every preset was photographed under **Forward+** and **Compatibility** (OpenGL 3, the web renderer) with zero error lines.
Everything is drawn with CanvasItem `_draw()` calls: no shaders, no GPU particles, nothing renderer-specific.

## Credits, licence and AI disclosure

Core Systems Asset Factory. See LICENSE.txt. The demo trees and meadow tiles are from this studio's Verdant tilesets
(see the NOTICE.txt files beside them). The code in this pack was written with AI, and the demo art is AI-generated.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
