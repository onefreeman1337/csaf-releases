# Timber: Choppable Trees Cut from Your Own Sprites and Tiles for GameMaker — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Timber: Choppable Trees Cut from Your Own Sprites and Tiles for GameMaker  
**Engine:** GameMaker 2024+  
**Docs published:** 2026-11-17


---

# Timber - Choppable Trees Cut from Your Own Sprites and Tiles, for GameMaker

**Timber makes the trees already in your GameMaker game choppable (2024.14, tested on runtime 2024.14.4.268), in pure GML with
a runnable demo room.** Give it a tree SPRITE you already draw, or let it find the trees on your TILE LAYER, and every blow
shudders the tree and opens a notch in its own bark while chips and leaves fly. The last blow brings it down in one of 8 ways
(topple, crash, snap, whip, uproot, slice, shatter, burn), always away from the side it was struck from. The crown breaks into
clumps and leaves cut from its own pixels, the trunk splits into logs cut from its own bark, and a stump with a cut face stays.
After a while it grows back from a sapling. 6 kinds of tree (broadleaf, conifer, palm, dead, birch, giant mushroom) x 8 falls
= 48 styles, and every number in a style is yours to change.

Every leaf, chip, log, stump face, crater and ember is drawn at run time from the tree you painted: no tree sprite sheets, no
frame art. It is a GameMaker port of our Timber for RPG Maker MZ and for Godot 4. One commercial licence covers all your games.

Every picture on the store page was rendered by this package in a blank GameMaker project.

---

## What is in the package

| | |
| --- | --- |
| `tmb_core` | the 48 styles, reading a tree out of its pixels, the blows, the eight falls, debris, logs, regrowth, save data - **no drawing calls** |
| `tmb_styles` | the style table (generated from the same numbers the Godot and MZ editions ship) |
| `tmb_draw` | making trees from your sprite or your tiles, and drawing the standing tree, the notch, the fall, the stump, the logs and the debris |
| `tmb_forest` | many trees at once: scan a tile layer, add sprite trees, strike whatever stands at a point, step, draw back to front, save |
| `tmb_demo` + `obj_tmb_demo` + `rm_tmb_demo` | THE WOODLOT: fourteen sprite trees and five tile trees on a meadow, a woodcutter and a browser of all 48 styles |
| `tmb_selftest` | the in-engine test suite (run the demo with `-selftest`) |
| 15 sprites + `ts_tmb_demo` | the demo trees and meadow (from this studio's Verdant tilesets), used only by the demo and the suite |
| 4 fonts | `fnt_timber_display_s/_l` (from Oswald Bold) and `fnt_timber_body_s/_l` (Barlow Condensed SemiBold), SIL OFL 1.1, used only by the demo |

## Install

1. In GameMaker: **Tools > Import Local Package**, choose `Timber.yymps`, **Add All**, **Import**.
2. Run the project with `rm_tmb_demo` first in the room order to open THE WOODLOT.

The raw `.gml` sources are also in the `Timber/` folder of this download, readable without GameMaker.

**THE WOODLOT's keys:** click a tree to chop it (it falls away from the side you clicked), 1 to 8 pick the fall for trees not yet
struck, R grows everything back, A lets the woodcutter loose, TAB opens the browser of all 48 styles chopping themselves.

## Quickstart: one tree from your sprite

```gml
// Create event of the object that owns the tree (a tree sprite with a transparent background)
my_tree = tmb_tree_create(spr_my_oak, 0, x, y, "broadleaf-topple", { regrow_time: 60 });

// Step event: strike it when the player swings, then advance it
if (keyboard_check_pressed(vk_space) && point_distance(my_player_x, my_player_y, x, y) < 24) {
    tmb_chop(my_tree, my_player_x, my_player_y);   // it falls away from the player (my_player_x/y: where your player stands)
}
tmb_step(my_tree, delta_time / 1000000);

// Draw event (draw it instead of the sprite)
tmb_draw(my_tree);

// Clean Up event
tmb_free(my_tree);
```

`tmb_tree_create(sprite, subimg, x, y, style, options)` stands the tree exactly where `draw_sprite(sprite, subimg, x, y)` would draw
it; the sprite's own origin is honoured. Read it once (it copies the frame's pixels) and keep the struct.

## Quickstart: every tree on your tile layer

```gml
// Create event of a controller object
var my_words = tmb_tile_words({}, 8, 0, 1, 2, 2, "broadleaf");   // tileset 8 tiles wide: a 2 x 2 tree at atlas column 0, row 1
tmb_tile_words(my_words, 8, 5, 1, 2, 3, "conifer-snap");        // a 2 x 3 pine whose fall is snap
my_wood = 0;
my_forest = tmb_forest_create({ regrow_time: 120, on_log: function(_tree, _x, _y) { my_wood += 1; } });
tmb_forest_scan_tiles(my_forest, layer_tilemap_get_id(layer_get_id("Trees")), my_words);

// Step event
if (mouse_check_button_pressed(mb_left)) tmb_forest_chop_at(my_forest, mouse_x, mouse_y, my_player_x, my_player_y);
tmb_forest_step(my_forest, delta_time / 1000000);

// Draw event (of an object drawn above your tile layer)
tmb_forest_draw(my_forest);

// Clean Up event
tmb_forest_free(my_forest);
```

**Which cells make one tree.** Two neighbouring cells belong to one tree when their tiles are neighbours the same way in the
tileset, so a 2 x 3 tree painted from the atlas is one tree and two copies of it standing side by side stay two trees. A mirrored
or flipped tile reads its neighbour the other way round. A rotated tile is read rotated (untested on real art).

**What happens on the layer.** A tree nobody has struck is still drawn by YOUR tile layer. The first blow lifts it: its cells are
emptied and Timber draws it from then on. When it grows back, the exact tiles (index, mirror and flip) go back on the layer, and
`tmb_free` / `tmb_forest_free` put back any tree still lifted, so the level is left as you painted it.

**What it needs from your art:** trees with a transparent background, on their own layer (not baked into the ground tiles).

## What happens when a tree is struck

| Kind | Blows | Debris | What is left |
| --- | --- | --- | --- |
| broadleaf | 3 | leaves and clumps of its own crown, chips | 3 logs, a ringed stump |
| conifer | 4 | needles, wide boughs, cones, snow if the crown carries snow | 4 logs, a ringed stump |
| palm | 2 | fronds, coconuts | 5 short segments, a fibrous stump |
| dead | 2 | splinters and twigs | 2 logs, a split grey stump |
| birch | 3 | small leaves, white bark curls | 3 white logs, a pale stump |
| mushroom | 2 | glowing spores, soft flesh | 2 stem pieces, a flesh stump |

| Fall | How it comes down |
| --- | --- |
| topple | topples about the notch, bounces, the crown breaks up, the trunk splits into logs |
| crash | falls heavier and faster, a cloud of dust, the logs roll apart |
| snap | snaps at the notch with a jagged break, drops into it, then tips (2 logs at most) |
| whip | the crown lags behind, then springs past as it lands |
| uproot | no notch: the blows loosen it, it tips over roots and all and leaves a crater (no logs) |
| slice | one bright stroke cuts it through at an angle; the top slides off and falls |
| shatter | does not fall: it bursts apart where it stands into square pieces of itself (no logs) |
| burn | each blow is fire: it chars from the foot up, falls burning and lands as ash and embers (no logs) |

Blows are the kind's number for topple, crash, snap, whip and shatter; uproot takes one more, slice and burn one fewer (never
under 2). Struck from the left a tree falls right, struck from the right it falls left. Trees always fall sideways, so a tree
lying on the ground is drawn at its full length in both top-down and side views.

## Styles

A style is a struct; every field is a slider. `tmb_style(id)` returns a COPY you can edit:

```gml
var my_style = tmb_style("conifer-crash");
my_style.tint = make_colour_rgb(255, 210, 160);   // autumn: every colour taken from your tree is multiplied by this
my_style.chops = 6;                              // a tougher tree
my_tree2 = tmb_tree_create(spr_my_pine, 0, x, y, my_style);
```

| Field | Default | What it does |
| --- | --- | --- |
| `kind`, `fall` | from the id | 0..5 and 0..7, in the order of `tmb_kind_names()` and `tmb_fall_names()` |
| `chops` | by kind and fall | blows to bring it down (1..12) |
| `speed` | 1 | time scale for the whole life of the tree (0.25..4) |
| `weight` | by style | how hard the fall pulls (0.2..4) |
| `bounce` | by style | how far it rebounds when it lands (0..0.8) |
| `debris` | by style | amount of leaves, chips and dust (0..3) |
| `particle_size` | 1 | debris pixel size in pixels of your art (1..4) |
| `shudder` | by style | how hard each blow shakes the tree (0..3) |
| `logs` | by kind | logs the trunk splits into (0..8) |
| `tint` | `c_white` | multiplies every colour sampled from your tree |
| `wood` | by kind | cut wood: notches, log ends, stump rings, chips |
| `accent` | by style | the style's own light: embers, the slice glint, spores |
| `dust` | by style | dust on landing (0..3) |
| `debris_stay`, `logs_stay` | 8, 5 | seconds debris and logs lie before they fade (0 = until it regrows) |
| `slice_angle` | 28 | tilt of the SLICE cut, in degrees (0..60) |

A missing field is filled from the style's own kind and fall, and every number is clamped to its range, so a partial struct such
as `{ kind: 1, fall: 2, chops: 5 }` works. An unknown id gives `undefined`; a tree given `undefined` uses broadleaf-topple and
says so in the output log.

## Calls

**Making and placing trees**

| Call | What it does |
| --- | --- |
| `tmb_tree_create(sprite, subimg, x, y, style, [options])` | a tree from your sprite (see the quickstart); `tree.ok` is false and `tree.why` says why when the picture cannot be read |
| `tmb_tree_from_tiles(tilemap, cell_x, cell_y, cells_w, cells_h, style, [options])` | a tree from a rectangle of cells on your tile layer |
| `tmb_tree_place(tree, x, y, [scale])` | move a tree so its FOOT (the bottom of the trunk) stands at (x, y), optionally at a new scale |
| `tmb_style(id)` | a copy of a shipped style by id, by a kind or fall alone, or by index 0..47 |
| `tmb_style_ids()`, `tmb_kind_names()`, `tmb_fall_names()` | the 48 ids, the 6 kinds, the 8 falls |

Options (all optional): `scale` (1), `seed` (0, the debris pattern), `regrow_time` (300 seconds; 0 = never), `side_view` (false:
debris scatters round the foot; true: it lands on one ground line, for platformers), and five callbacks: `on_hit(tree,
chops_left)`, `on_felled(tree, direction)`, `on_landed(tree, force)`, `on_log(tree, x, y)` (once per log, at the log's place in
the room: give wood here) and `on_regrown(tree)`. A callback written inline in the options struct runs in the scope of the
instance that made the tree, so it can read and change that instance's variables.

**Striking, stepping, drawing**

| Call | What it does |
| --- | --- |
| `tmb_chop(tree, from_x, from_y)` | one blow from a striker at (from_x, from_y); returns true when this blow felled it |
| `tmb_fell(tree, from_x)` | bring it down now, away from from_x |
| `tmb_fell_toward(tree, direction)` | bring it down now toward 1 (right) or -1 (left) |
| `tmb_step(tree, dt)` | advance by dt seconds (60 fixed steps a second inside, so the same fall plays the same at any frame rate) |
| `tmb_draw(tree)` | draw it as it is now; honours your camera and any world matrix, restores every GPU setting it changes |
| `tmb_free(tree)` | free its sprites and buffers (a lifted tile tree puts its tiles back first) |

Call `tmb_chop` and `tmb_step` from a Step event and `tmb_draw` from a Draw event. Old pictures are freed on the next `tmb_step`,
after the frame that drew them.

**State**

| Call | What it does |
| --- | --- |
| `tmb_is_standing(tree)` | true while it stands and a blow still does something |
| `tmb_chops_left(tree)` | blows still needed |
| `tmb_fall_direction(tree)` | 1 = it fell (or will fall) right, -1 = left |
| `tmb_regrow_seconds_left(tree)` | seconds until it stands again (-1 while it stands, or when it never grows back) |
| `tmb_regrow_now(tree, seconds)` | grow back now, the sapling rising from the stump in three steps |
| `tmb_set_felled(tree, direction, regrow_seconds_left)` | the felled state at once, no animation: the stump only |
| `tmb_reset(tree)` | standing and untouched again, at once |
| `tmb_play_story(tree, loop, direction)` | the tree chops itself (chop, fall, lie, grow back), as the demo's browser does |
| `tmb_seek(tree, phase, direction)` | freeze on one moment: 0 mid-chop, 1 the moment that shows the fall best, 2 after it landed |
| `tmb_unfreeze(tree)` | let a tree frozen by `tmb_seek` run again |
| `tmb_save(tree)`, `tmb_load(tree, data)` | a small struct for a felled tree (`felled`, `dir`, `left`); loading brings it back as a stump that grows back over the time left |

**Many trees**

| Call | What it does |
| --- | --- |
| `tmb_forest_create([options])` | an empty forest; its options go to every tree it makes (each tree's seed is offset) |
| `tmb_tile_words(words, columns, atlas_x, atlas_y, w, h, word)` | mark a rectangle of TILESET tiles as one kind of tree; returns the struct so calls chain |
| `tmb_forest_scan_tiles(forest, tilemap, words)` | find the trees on a tile layer; returns how many |
| `tmb_forest_add(forest, tree)`, `tmb_forest_add_sprite(forest, sprite, subimg, x, y, style)` | add a tree |
| `tmb_forest_tree_at(forest, x, y)`, `tmb_tree_hit_test(tree, x, y)` | the standing tree at a room point (its own opaque pixels, or the trunk and a pixel either side near the foot) |
| `tmb_forest_chop_at(forest, x, y, from_x, from_y)` | strike what stands there: 0 nothing, 1 a blow, 2 felled by this blow |
| `tmb_forest_step(forest, dt)`, `tmb_forest_draw(forest)` | step every tree; draw them back to front by the y of the foot |
| `tmb_forest_tree_count(forest)`, `tmb_forest_felled_count(forest)` | trees in it; trees not standing right now |
| `tmb_forest_regrow_all(forest, seconds)` | grow every felled tree back |
| `tmb_forest_save(forest)`, `tmb_forest_load(forest, data)` | one save struct per tree, in the order they were added |
| `tmb_forest_free(forest)` | free every tree |

**Depth.** `tmb_forest_draw` sorts the forest's own trees. To sort trees against your characters, draw each tree from an object
of its own with `depth = -y`, calling `tmb_draw` on that one tree.

**Saves.** Scan the same layer and add the same sprites in the same order, then call `tmb_forest_load(my_forest, saved)`: felled
trees come back as stumps at once and grow back over the time that was left.

## Proof and measured numbers

The package's own suite (50 assertions) runs on a real GameMaker build: the 14 demo trees are read (foot, trunk, crown, cut, and
where the foot lands in the room), the blow count and the notch's side and depth are checked, all 48 styles fall to rest both
ways (landing exactly once, the right number of logs, debris bounded, the side view's single ground line), regrowth puts back an
unnotched tree, saves round-trip, the tile scan finds exactly the painted trees (two copies side by side stay two, a mirrored tree
joins), a lifted tree empties exactly its cells and gets the same tiles back, the 8 falls of each kind are measured as distinct
pictures at their best moment, a caller's world matrix is honoured, and bad input is refused without a crash.

<!-- measured:start -->
- Reading a tree out of its sprite (once, when you create it): 4.0 to 4.1 ms a tree, averaged over the 14 demo trees, two runs.
- The busiest frame measured: all 19 trees of a forest falling at the same moment, worst step 31.4 to 39.6 ms over 90 frames (the frames where crowns burst into debris). Trees felled one at a time cost a fraction of that.
- These are the VM build on a busy Windows machine; YYC was not built.
<!-- measured:end -->

## Compatibility and limits

- GameMaker 2024.14 or newer with the GMS2 runtime; tested on runtime 2024.14.4.268, Windows, VM. HTML5, mobile, consoles and YYC
  were not built. GMRT was not tested.
- Your tree pictures are read once into a buffer, so a tree costs about four times its pixel count in memory, plus up to five
  sprites of its own size while it falls. Trees up to 2048 x 2048 pixels are accepted; trees of 16 to 64 pixels are what it was
  built and tested on.
- Every global and macro is prefixed `tmb_` or `TMB_`; the only global variable is `global.__tmb_px` (a 2 x 2 white sprite the
  package draws once for its square marks).

## Licence, credits and AI disclosure

Core Systems Asset Factory. See LICENSE.txt. The demo trees and meadow tiles are from this studio's Verdant tilesets; they are
covered by this package's licence for use in your games, not for redistribution as art (see `Timber/fonts/THIRD-PARTY-NOTICES.txt`,
which also carries the font notices). The code in this package was written with AI, and the demo art is AI-generated.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
