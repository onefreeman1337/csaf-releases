# Haversack — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Haversack  
**Engine:** GameMaker 2024+  
**Docs published:** 2026-10-31


---

# Haversack - A Spatial Inventory That Draws Its Own Containers for GameMaker

**Haversack is a grid inventory for GameMaker (2024.14, tested on runtime 2024.14.4.268) in pure GML, with a runnable demo room.**
Items have real footprints you declare in data, any polyomino, and turn in quarter steps with the lamp staying where it is. They lift and
drop with a ghost that marks exactly which cells are the problem, and a refused drop springs back to where it was lifted from. Mouse, touch
and gamepad all work, and the gamepad walks irregular shapes properly. Containers nest, scroll, carry weight limits and dividers, tidy
themselves without ever losing an item, and save with rotation and nesting intact. The package draws 48 containers (8 kinds in 6
materials) and 55 items, with no image files, so you can build the whole screen before your own art exists. One commercial licence covers all your games.

Every picture on the store page was rendered by this package in a blank GameMaker project.

---

## What is in the package

| | |
| --- | --- |
| `hvs_core` | the rules: footprints, rotation, containers, dividers, stacks, weight, nesting, tidy, save and load - **no drawing calls and no device input** |
| `hvs_desk` | the hands: lift, turn, ghost, drop, swap, stack, spring back, the gamepad walk. Takes plain input, so you can drive it with your own controls or a replay |
| `hvs_art` | ramps, the relief painter, the bake and the cache |
| `hvs_forms` | the 55 drawn items |
| `hvs_cases` | the 48 drawn containers |
| `hvs_draw` | the desk on screen: redrawn only when something changes |
| `hvs_demo` + `obj_hvs_demo` + `rm_hvs_demo` | THE QUARTERMASTER, a bench with a case, a crate, a scrolling stash, a roll of pockets and an open pouch |
| `hvs_selftest` | the in-engine test suite (run the demo with `-selftest`) |
| 4 fonts | `fnt_haversack_display_s/_l` (from Stardos Stencil) and `fnt_haversack_body_s/_l` (Barlow Condensed SemiBold), both SIL OFL 1.1; licences and notices in `Haversack/fonts/`. Stack counts and the name plate use the body face unless you pass your own |

## Install

1. In GameMaker: **Tools > Import Local Package**, choose `Haversack.yymps`, **Add All**, **Import**.
2. Run the project with `rm_hvs_demo` first in the room order to open THE QUARTERMASTER.

The raw `.gml` sources are also in the `Haversack/` folder of this download, readable without GameMaker.

## Quickstart

```gml
// Create
hvs_starter_items();                         // every drawn item, registered under its form's name. Use hvs_item_define for your own.
my_bag = hvs_container({ w: 8, h: 5, kind: "attache", material: "hide" });
hvs_put(my_bag, hvs_item("rifle"), 0, 0);
hvs_add(my_bag, hvs_item("potion"));         // finds room by itself
my_desk = hvs_desk_create();
hvs_desk_add(my_desk, my_bag, 40, 40, { cell: 40 });
```

```gml
// Step
hvs_desk_step(my_desk);
```

```gml
// Draw GUI
hvs_desk_draw(my_desk);
```

```gml
// Clean Up
hvs_desk_free(my_desk);
hvs_art_free();
```

The Clean Up lines matter: baked sprites and surfaces are yours to release, and with those two calls a `game_restart` leaves the engine's resource counts where they were (measured through three restarts).

## Your own items

A footprint is DATA. It never comes from a sprite's size.

```gml
hvs_item_define("carbine", { name: "Carbine", shape: ["XXXX", "..X."], weight: 3.2, form: "rifle" });      // a drawn form
hvs_item_define("relic",   { name: "Relic",   shape: "2x2", weight: 1, sprite: spr_relic });                 // your own sprite, fitted and turned with the footprint
hvs_item_define("ration",  { name: "Ration",  shape: "1x1", stack: 8, weight: 0.2 });                        // no art yet: it draws as a wrapped parcel of its own footprint
hvs_item_define("big_bag", { name: "Big Bag", shape: "3x3", weight: 1, form: "pouch", holds: { w: 6, h: 6, kind: "rucksack" } }); // an item that is itself a container
```

`shape` takes rows of text (`X` is a cell), `"2x3"`, or a list of `[x, y]` pairs. `rotates: false` keeps an item upright. `hue` recolours a form's liquid or gem.
`hvs_forms` lists the drawn items with their footprints. `hvs_item_def()` reads a definition back; `hvs_item_cells()` and `hvs_item_box()` read an item's footprint at a rotation.

| | |
| --- | --- |
| `hvs_item_define()` | register a kind of item |
| `hvs_item()` | make one item; `hvs_item("potion", 1, { durability: 5 })` carries your own data, and the data saves with it |
| `hvs_starter_items()` | register all 55 drawn items |

## Containers

```gml
my_trunk = hvs_container({
    w: 9, h: 6, kind: "footlocker", material: "oak", seed: 7, wear: 0.4,
    limit: 30,                               // the most weight it holds, nested bags included
    mask: ["XXXXXXXXX", "XXXXXXXXX", "XXXXXXXXX", "XXXXXXXXX", "XXXXXXXXX", ".XXXXXXX."], // X is a cell
    dividers: [["v", 6, 0, 6]],              // a wall between columns 5 and 6, rows 0 to 5. No item may straddle it
    accept: function(_item, _container) { return _item.def.area <= 6; }
});
```

| Kind | How its grid is made | Material |
| --- | --- | --- |
| `attache` | cut foam, dimpled | `hide` |
| `rucksack` | stitched waxed canvas, shoulders masked by `hvs_case_mask()` | `canvas` |
| `footlocker` | felt in a tray of laths | `oak` |
| `saddlebag` | suede pressed into squares, bottom corners masked by `hvs_case_mask()` | `steel` |
| `crate` | straw over a stencilled floor, chalked corners | `polymer` |
| `locker` | hex mesh panels | `lacquer` |
| `chest` | tufted velvet, gilt buttons | |
| `toolroll` | sewn pockets | |

`hvs_case_kinds()`, `hvs_case_materials()` and `hvs_case_title()` give you those names in code. `seed` and `wear` make each one its own (0 is fresh from the shop; 1 has seen a war). `hvs_case_metrics()` tells you how much drawn case surrounds the grid, for laying out a screen.
`hvs_divider_add()` adds a wall later. `hvs_cell_open()` asks whether a cell is usable. `hvs_used()` reports cells, free cells and the largest free rectangle. Pass `draw_case: false` to `hvs_desk_add()` to draw only the items over your own panel.

## Moving things by code

```gml
var _why = hvs_why(my_bag, my_rifle, 2, 1, 1);  // "ok", "bounds", "masked", "occupied", "divider", "self", "weight", "refused"
if (hvs_fits(my_bag, my_rifle, 2, 1, 1)) hvs_put(my_bag, my_rifle, 2, 1, 1);
```

`hvs_put()` is atomic: if the answer is not "ok" nothing has moved. `hvs_why_text()` turns a reason into a caption for the player.

| | |
| --- | --- |
| `hvs_put()` | place at a cell and rotation, moving it from wherever it is |
| `hvs_add()` | tops up matching stacks, then finds room, trying each rotation; `hvs_find_room()` asks where without moving anything |
| `hvs_take()` | take it out; it still exists |
| `hvs_at()` | the item covering a cell |
| `hvs_count()` | how many of a kind, nested containers included |
| `hvs_find()` | the first of a kind, nested containers included |
| `hvs_consume()` | use up some of a kind, all or nothing |
| `hvs_merge()` | pour one stack into another |
| `hvs_split()` | take some off a stack as a new item |
| `hvs_can_stack()` | would these two stack? Same id, stack size above 1, room left, and neither carries your data |
| `hvs_weight()` | total weight, nested containers included |
| `hvs_clear()` | take everything out; returns the list |

## Tidy

```gml
var _r = hvs_tidy(my_bag);                  // { ok, moved, before, after, nodes }: before and after are the largest free rectangle
hvs_tidy(my_bag, { key: function(_item) { return _item.def.weight; } }); // heaviest first
```

Stacks merge first. An item is NEVER lost: if no layout at least as good is found the items stay where they were. Tested over 60 random fills, dividers and masks respected. `hvs_desk_tidy()` does the same on screen, with each item flying to its new place. The worst tidy measured took 5.9 ms to 6.4 ms on up to 28 items.

## Save and load

```gml
var _text = hvs_save_string(my_bag);        // JSON. hvs_save_struct gives plain data to put in your own save
var _report = {};
my_bag = hvs_load_string(_text, _report);   // rotation, nesting, stacks and your data all return
```

Your item definitions will change after a player has a save. An item still never vanishes: a footprint that no longer fits where it was finds other room (`_report.moved`); whatever fits nowhere comes back in `_report.overflow` for you to hand to the player; a removed id goes in `_report.unknown` and stays in the container's data, so the next save writes it back and restoring the definition restores the item. `hvs_load_struct()` reads what `hvs_save_struct()` wrote; text that is not JSON returns `undefined`.

An item in the player's hand stays in its container until the drop lands, so a save taken mid-drag restores it where it was. The one exception is a swap: the item that came up in the swap has no cell until it lands, so call `hvs_desk_cancel()` before saving.

## The desk

| | Mouse | Touch | Gamepad |
| --- | --- | --- | --- |
| Lift and drop | drag, or click and click | drag, or tap and tap | A |
| Turn | R or right button | a second finger | X or a shoulder |
| Cancel | | | B |
| Quick-move to the next container | Shift + click | | Y |
| Tidy | T | | Start |
| Scroll a tall container | wheel, or drag to its edge | | follows the cursor |
| Move | | | d-pad or left stick |

The gamepad cursor leaves the whole footprint it is on and lands on the next different thing, remembers its row or column so an L-shape does not make it drift, and crosses to the nearest container past an edge. Every item is reachable from every cell (asserted over 44 cursor states on a fixture of irregular shapes).

```gml
my_desk = hvs_desk_create({
    pad_device: 0,
    keys: { rotate: ord("Q"), tidy: ord("E") },
    on_event: function(_what, _item, _pane) { if (_what == "snapback") audio_play_sound(snd_nope, 1, false); }
});
hvs_desk_add(my_desk, my_stash, 500, 40, { cell: 40, rows: 5 }); // rows: a taller container scrolls
```

`on_event` hears `lift`, `drop`, `snapback`, `refuse`, `rotate`, `stack`, `swap`, `transfer`, `tidy` and `discard`. Drive your sounds from it; the package makes none.

| | |
| --- | --- |
| `hvs_desk_create()` | make a desk |
| `hvs_desk_add()` | put a container on it |
| `hvs_desk_remove()` | take one off (closing a bag) |
| `hvs_desk_step()` | one frame: `hvs_desk_read()` then `hvs_desk_tick()`. In a Draw event rather than Draw GUI, pass `{ gui: false }` |
| `hvs_desk_read()` | read the real devices into `hvs_desk_feed()` |
| `hvs_desk_feed()` | one frame of input as plain values, with no device touched: your own bindings, a tutorial, a replay |
| `hvs_desk_tick()` | advance the springs and flights |
| `hvs_desk_draw()` | draw it all. Blend mode, font, colour, alpha and alignment are handed back as found |
| `hvs_desk_preload()` | bake everything now, behind a loading screen, in a Draw event |
| `hvs_desk_carry()` | put a pickup or a shop purchase in the player's hand |
| `hvs_desk_held()` | the item in the hand |
| `hvs_desk_hovered()` | the item under the cursor |
| `hvs_desk_cancel()` | put the held item back where it came from |
| `hvs_desk_tidy()` | tidy a pane, with flights |
| `hvs_desk_step_cursor()` | one step of the pad cursor, by code |
| `hvs_desk_free()` | free its surfaces (Clean Up) |
| `hvs_pane_at()` | the pane at a screen point |
| `hvs_pane_cell()` | the cell at a screen point, scroll included |
| `hvs_cell_screen()` | a cell's corner on screen |

## Drawing outside the desk

`hvs_item_draw()` draws an item anywhere: an icon in your HUD, a shop list, a pickup on the ground.

```gml
hvs_item_draw("medkit", 20, 20, 0, 32);
```

`hvs_item_art()` gives you the baked sprite and its shadow. `hvs_case_shell_art()` and `hvs_case_lining_art()` give you a container's. Everything baked is premultiplied, so draw it with `gpu_set_blendmode_ext(bm_one, bm_inv_src_alpha)`. `hvs_art_free()` releases all of it and `hvs_art_count()` says how much there is. `hvs_oklch()` and `hvs_ramp()` are the package's colour functions; `hvs_rng()` and `hvs_rand()` its seeded generator.

## What it costs

MEASURED on runtime 2024.14.4.268, Windows, the VM target, on a shared machine: each figure is the range over two suite runs.

| | |
| --- | --- |
| An open inventory with nothing happening, 2 containers | 0.05 ms to 0.07 ms a frame. Nothing is recomposed: 300 idle frames add no redraw at all |
| A frame in which something changes | 13 ms to 28 ms, that one frame |
| The first draw of a 2-container desk with nothing baked yet | 130 ms to 154 ms. `hvs_desk_preload()` moves this behind your loading screen |
| One item at one rotation and cell size, first time | 8.3 ms to 8.7 ms on average; kept after that |
| One container's shell and lining, first time | 32 ms to 33 ms on average, 62 ms to 63 ms at worst; kept after that |

A surface lost to a window resize or an alt-tab is rebuilt from the sprites on the next draw, pixel for pixel.

## What it does not do

- It does not make your game's items mean anything: no equipment slots, crafting or shop prices. Your code decides what `hvs_consume()` and the events do.
- No sounds; `on_event` is where yours go.
- Text is ASCII: the shipped fonts cover characters 32 to 126. Pass your own fonts to `hvs_desk_create()` as `font` and `font_small` for other alphabets.
- `hvs_put()` and the desk do not ask a nested bag to fit its contents when you close it: a bag is its footprint, however full.

## Verification, stated plainly

GML cannot be unit-tested outside the engine, so every number here came from a real Igor-built Windows VM executable: 520 in-engine assertions (run the demo with `-selftest`), a fresh install of this `.yymps` into a blank project running this Readme's code, and an adversarial pass over every function documented here. Drawing was checked by opening the renders. The mouse, touch and gamepad reading in `hvs_desk_read()` compiles and runs but no run has pressed a real button; everything it feeds was driven through `hvs_desk_feed()`. HTML5, mobile and YYC builds have not been run. GMRT is not required and has not been tested.

## Licence

One commercial licence: use it in all your games, no royalties, no attribution required. See `LICENSE.txt`. The fonts' notices are in `Haversack/fonts/THIRD-PARTY-NOTICES.txt`.

AI disclosure: this package's code and its generated art were written by AI. It makes no sound and tells no story.

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
