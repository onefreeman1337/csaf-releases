# Vivarium: 48 Small Animals and Insects for Godot 4 Maps — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Vivarium: 48 Small Animals and Insects for Godot 4 Maps  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Vivarium for Godot 4 - 48 Species of Small Life Drawn in Code

Vivarium fills your 2D maps with the small life a real place has. Butterflies and bees over the meadow, dragonflies
quartering the pond, fish moving under the surface, frogs on the bank that dive when your player walks up, lizards
basking in the open, and when night falls: moths that circle the player's lamp, fireflies that flash in step, and bats.
**Nothing to place:** the `Vivarium2D` node reads your TileMapLayer (a `vivarium` custom data layer, or each tile's
collision) and decides what lives where. **Nothing here is an image file:** all 48 species in 10 families are drawn by
GDScript, wing by wing and fin by fin, into one texture when a level loads.

- **Godot 4.7** (built and tested on 4.7.2 stable). Older 4.x versions were NOT run.
- **Both renderers**: every species was rendered and checked under **Forward+** and **Compatibility** (the web / low-end
  renderer). Creatures are 2D draw calls on one baked texture; the demo's ground is the only shader.
- Top-down maps on **orthogonal** (square or rectangular) TileMapLayers. Isometric and hexagonal layers were not tested.
- Pure GDScript, plain text, no plugin to enable, no GDExtension.

## Install

1. Copy the folder `godot/addons/vivarium/` into your project's `addons/` folder (so you have `res://addons/vivarium/`).
2. That is all: there is no plugin to enable. The classes `Vivarium2D`, `VivariumColony2D`, `VivariumZone2D`,
   `VivariumCatalog`, `VivariumPaint`, `VivariumAtlas`, `VivariumSim` and `VivariumDraw` are available everywhere.

To see everything first, open the `godot/` folder itself as a project in Godot 4.7 and press Play (the demo scene:
Tab or 1-4 changes page, S scatters, the arrow keys walk).

## The fast way: Vivarium2D over your level

1. Add a **Vivarium2D** node to your level, in the tree **after** your ground TileMapLayers and **before** your
   characters (so fish and frogs draw over the ground and under the player; flyers are raised by `air_z_index`).
2. Drag your ground TileMapLayer(s) into its `layers` array.
3. Give your TileSet a **custom data layer** named `vivarium` (type String) and type `water` on your water tiles. Every
   other tile is **ground** - unless it has a collision polygon (a wall, a tree trunk, a rock), which makes it **none**.
4. Put your player in `watch` (or add it to the group `vivarium_watch`) so creatures flee from it.
5. Play. Vivarium2D fills what is on screen and keeps it filled as the camera moves.

### Where life appears

| a cell is | when | what lives there |
| --- | --- | --- |
| **water** | its `vivarium` value is `water`, or it is a used cell of a layer in `water_layers` | fish under the surface, pond skaters and whirligigs on it, dragonflies and damselflies over it |
| **shore** | ground with water on any of its four sides | frogs and toads (and everything that lives over ground) |
| **ground** | any other used cell, or a value such as `ground` or `flowers` | butterflies, bees, lizards by day; moths, fireflies, bats at dusk and night |
| **none** | the value `none` (also `block`, `wall`, `solid`), or no value and a collision polygon (`walls_from_collision`) | nothing |

Precedence when several layers cover one cell: **none** wins, then **water**, then ground. A whole layer of water tiles
can go in `water_layers` instead of tagging each tile. For maps that are not TileMapLayers (a painted background, a
Polygon2D pond), add **VivariumZone2D** nodes: a `polygon` and a `habitat` (GROUND, WATER or NONE). Zones are read
after the layers and override them; with no layers at all, the grid uses `zone_cell_size`.

Changed the map by script? Vivarium2D re-reads its layers when their number of used cells changes (`auto_rebuild`,
checked once a second), or call `rebuild_habitat()` yourself.

### Biomes

`biomes` decides which families live here (several may be combined, for example `["meadow", "pond"]`). Water families
also need water cells on screen.

| biome | families |
| --- | --- |
| meadow | butterflies, moths, fireflies, bees, bats, dragonflies, fish, frogs, skaters, lizards |
| forest | butterflies, moths, fireflies, bees, bats, dragonflies, fish, frogs, skaters |
| pond | dragonflies, fish, frogs, skaters, fireflies, moths |
| marsh | dragonflies, fish, frogs, skaters, fireflies, moths, butterflies |
| town | butterflies, moths, bees, bats, fish, lizards |
| desert | lizards, moths, bats, bees |
| cave | bats, fireflies (glow-worms and blue ghosts at any hour), moths |
| none | nothing |

Some species keep to their own biomes (the Blue Morpho to forest and marsh, the koi to town, meadow and pond, the
glow-worm to cave, forest and meadow); the species table below lists each one's.

### Day, dusk and night

| | out |
| --- | --- |
| day | butterflies, bees, dragonflies, fish, frogs, skaters, lizards |
| dusk | moths, fireflies, fish, frogs |
| night | moths, fireflies, fish, bats |

`time_of_day` = **AUTO** (default) reads, in this order: `hour` when it is 0 or more (21:00-04:59 night, 18:00-20:59 and
05:00-06:59 dusk), else the colour of `canvas_modulate` or, if that is empty, the first **CanvasModulate** in the
current scene: a dark tint (average of r, g, b at or below 0.45) is night, a dim or warm one (average at or below 0.8, or
red at least 0.22 above blue) is dusk. So a day/night cycle that tints the screen drives Vivarium with no setup. Or force
DAY, DUSK or NIGHT. In a **cave** biome bats and fireflies are out at any hour. Setting `time_of_day`, `hour` or
`canvas_modulate` changes `phase()` at once; a tint's colour is read three times a second. When the phase changes, the
creatures of the old hour fade out together and the new ones arrive.

The fireflies' light is drawn on its own CanvasLayer (`glow_above_night`, layer `glow_canvas_layer`), so a CanvasModulate
night does not dim it: it glows instead of being darkened with the ground it lights.

### How they behave

- **Butterflies** flutter between targets on the ground and settle for a moment, wings opening and closing.
- **Moths** flutter harder and, at dusk and night, circle the first watched node as if it carried a lamp
  (`moths_circle_watch`).
- **Fireflies** drift low and flash in their species' rhythm (a single flash, a double flash, or a steady glow). Each
  species falls into step and flashes together within seconds (`fireflies_flash_together`; off = each on its own beat).
- **Dragonflies** dart and hover over the water, wings a blur.
- **Bees** zigzag from target to target.
- **Fish** glide under the surface (drawn through `water_tint`) and never leave the water; minnows swim in shoals of three.
- **Frogs** sit and croak on the bank and hop. Walk up to one and it **dives** into the nearest water away from you,
  leaving a ripple, and surfaces on another bank cell a few seconds later.
- **Bats** swoop in wide arcs.
- **Pond skaters** push and glide across the surface; **whirligigs** spin.
- **Lizards** bask in the open, shift their pose now and then, scuttle in short bursts, and when the player comes close
  they dash off and freeze.

Come within `flee_distance` of a creature and it leaves: flyers climb away, fish, skaters and lizards dart, frogs dive.
Fireflies and bats do not flee. `scatter()` makes everything on screen flee at once. Every flyer except the fireflies casts a
soft shadow on the ground below it (`flyer_shadows`). Creatures are scenery: they never block, collide with or trigger anything, and
they live only in and around the part of the map on screen (they fade out a few cells beyond the view), so a large map
costs no more than a small one.

## By hand: VivariumColony2D (the 48 presets)

Every file in `addons/vivarium/presets/<family>/<species>.tscn` is a **VivariumColony2D**: one species, `count`
creatures living within `radius` of the node. Drop a colony anywhere - koi in a fountain, fireflies in a glade, bats
over a ruin - with no map at all. Frogs sit on the rim (the outer 28% of the disc) and dive into the middle; water
families live inside the disc; flyers fly over it. A creature that fled settles back toward the colony.

```gdscript
var koi := VivariumCatalog.instantiate("koi-kohaku") as VivariumColony2D
koi.radius = 70.0
koi.position = fountain.position
add_child(koi)
```

## Your own species

```gdscript
var sp := VivariumCatalog.make_species("ember-moth", "moth", "#7a2a1a", "#f2b04a", "#2a1a10", 15.0, "broad", "eyes", ["forest"])
$Vivarium2D.extra_species = [sp]        # before the node enters the tree, or call set_biomes() after
colony.custom_species = sp             # or one colony of it, set before the colony enters the tree
```

`make_species(id, family, c1, c2, c3, size, shape, pattern, biomes)`: three `#rrggbb` colours (anything else falls back
to the family's own), a size in pixels at `creature_scale` 1 (4 to 40), and a shape and pattern the family draws
(`VivariumCatalog.shapes_of(family)` / `patterns_of(family)`; anything else uses the family's first).

| family | shapes | patterns |
| --- | --- | --- |
| butterfly | round, leaf, scallop, tailed, pointed, broad | tips, dot, orangetip, band, eyes, margin, veins, spots |
| moth | delta, luna, broad | tips, net, eyes, mark, band |
| firefly | shield, seed, ghost, grub | single, double, steady |
| dragonfly | hawker, darter, damsel | plain, rings, wingband |
| bee | bee, bumble, fly | stripes, tail, gloss |
| fish | koi, slim, pike, deep | patches, patches3, plain, line, dapple, bars |
| frog | frog, toad, tree | spots, stripe, warts, blots, flanks |
| bat | bat, eared, fox | plain, mantle |
| skater | skater, whirligig | plain, gloss |
| lizard | lacertid, gecko, skink | speckle, leopard, stripes |

## Vivarium2D reference

| method | what it does |
| --- | --- |
| `scatter()` | every creature on screen takes flight at once |
| `count()` | creatures alive now |
| `phase()` | `"day"`, `"dusk"` or `"night"` |
| `species_ids()` | every species this node can show (its biomes' species plus `extra_species`) |
| `set_biomes(list)` | changes the biomes; creatures that no longer belong fade out |
| `habitat_at(position)` | `"ground"`, `"water"`, `"shore"` or `"none"` at a position in the node's space |
| `habitat_counts()` | cells of each habitat in the grid (ground includes shore) |
| `rebuild_habitat()` | re-reads the layers and zones |
| `atlas_ready()` | true once the creatures' texture is drawn |

Signals: `creature_fled(species_id: String, at: Vector2)` (for a rustle or a splash sound) and `phase_changed(phase: String)`.

| property | default | what it does |
| --- | --- | --- |
| `enabled` | true | off = every creature fades out |
| `layers` | empty | ground TileMapLayers to read |
| `water_layers` | empty | TileMapLayers whose every used cell is water |
| `habitat_data_layer` | "vivarium" | the custom data layer's name |
| `walls_from_collision` | true | a tile with no value and a collision polygon is none |
| `zone_cell_size` | 16.0 | the grid's cell size when there are no layers (zones only) |
| `auto_rebuild` | true | re-read the layers when their used-cell count changes |
| `biomes` | ["meadow"] | which families live here |
| `density` | 1.0 | 0 to 4: how much life |
| `creature_scale` | 1.0 | 0.25 to 4: the size creatures are drawn at (1 suits 32 px tiles, 0.5 a 16 px game, 1.5 a 48 px one) |
| `max_creatures` | 48 | the most alive at once |
| `families_off` | empty | family ids to leave out (`"bat"`, `"lizard"`, ...) |
| `only_species` | empty | only these species ids |
| `extra_species` | empty | your own species (`VivariumCatalog.make_species`) |
| `life_seed` | 1 | the same seed makes the same life |
| `watch` | empty | nodes creatures flee from (the first is the moths' lamp) |
| `watch_group` | "vivarium_watch" | nodes in this group are watched too |
| `flee_distance` | 64.0 | how close a watched node comes before creatures leave (px) |
| `moths_circle_watch` | true | moths orbit the first watched node at dusk and night |
| `time_of_day` | AUTO | AUTO, DAY, DUSK or NIGHT |
| `hour` | -1.0 | 0-24 drives the phase when 0 or more |
| `canvas_modulate` | null | the CanvasModulate AUTO reads (empty = the first in the scene) |
| `fireflies_flash_together` | true | each species falls into step |
| `detail` | 2.0 | atlas pixels per screen pixel (2 keeps creatures crisp under a 2x camera zoom) |
| `air_z_index` | 10 | z index of the flyers' layer, above your characters |
| `water_tint` | Color(0.74, 0.86, 0.96, 0.8) | fish are drawn under the surface through this tint |
| `flyer_shadows` | true | a soft shadow under every flyer |
| `glow_above_night` | true | fireflies' light on its own CanvasLayer |
| `glow_canvas_layer` | 2 | that CanvasLayer's layer |
| `glow_strength` | 1.0 | 0 to 3: the size of the fireflies' light |

## VivariumColony2D reference

| property | default | what it does |
| --- | --- | --- |
| `species` | "peacock" | a species id from the table below |
| `count` | 5 | creatures in the colony (1 to 32) |
| `radius` | 96.0 | the colony's disc; frogs sit on its outer 28% |
| `creature_scale` | 1.0 | as on Vivarium2D |
| `watch` | empty | nodes the colony flees from |
| `watch_group` | "vivarium_watch" | |
| `flee_distance` | 64.0 | |
| `life_seed` | 1 | |
| `custom_species` | {} | a `make_species` record used instead of `species` (set before the colony enters the tree) |
| `detail` | 2.0 | |
| `air_z_index` | 10 | |
| `water_tint` | Color(0.74, 0.86, 0.96, 0.8) | |
| `flyer_shadows` | true | |
| `glow_above_night` | true | |
| `glow_canvas_layer` | 2 | |
| `glow_strength` | 1.0 | |
| `preview_size` | 150.0 | the specimen size `csaf_preview()` draws (the store photograph; harmless in a game) |
| `preview_scale` | 3.0 | the four smaller ones around it |

Methods: `scatter()`, `count_alive()`, `species_record()`. Signal: `creature_fled(species_id, at)`.

**VivariumCatalog**: `species(id)`, `species_ids()`, `ids_for_family(family)`, `path_of(id)`, `instantiate(id)`,
`shapes_of(family)`, `patterns_of(family)`, `make_species(...)`, and the tables `FAMILIES`, `BIOMES`, `SPECIES`, `PRESETS`.

## The 48 species

Every species is a distinct shape and pattern within its family; the three colours are yours to change with
`make_species`. Sizes are in pixels at `creature_scale` 1.

| species | id | family | size | shape | pattern | lives over | out | only in |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cabbage White | `cabbage-white` | butterfly | 15 | round | tips | ground | day | any |
| Brimstone | `brimstone` | butterfly | 16 | leaf | dot | ground | day | any |
| Orange Tip | `orange-tip` | butterfly | 14 | round | orangetip | ground | day | any |
| Red Admiral | `red-admiral` | butterfly | 17 | scallop | band | ground | day | any |
| Peacock | `peacock` | butterfly | 18 | scallop | eyes | ground | day | any |
| Common Blue | `common-blue` | butterfly | 12 | round | margin | ground | day | any |
| Swallowtail | `swallowtail` | butterfly | 21 | tailed | veins | ground | day | any |
| Monarch | `monarch` | butterfly | 19 | pointed | veins | ground | day | any |
| Blue Morpho | `morpho` | butterfly | 21 | broad | margin | ground | day | forest, marsh |
| Small Copper | `small-copper` | butterfly | 12 | round | spots | ground | day | any |
| Buff-tip | `buff-tip` | moth | 14 | delta | tips | ground | dusk, night | any |
| Garden Tiger | `garden-tiger` | moth | 16 | delta | net | ground | dusk, night | any |
| Luna Moth | `luna` | moth | 19 | luna | eyes | ground | dusk, night | forest, meadow, marsh |
| Silver Y | `silver-y` | moth | 13 | delta | mark | ground | dusk, night | any |
| Emperor Moth | `emperor-moth` | moth | 18 | broad | eyes | ground | dusk, night | any |
| Rosy Maple Moth | `rosy-maple` | moth | 13 | broad | band | ground | dusk, night | forest, meadow, town |
| Meadow Firefly | `meadow-firefly` | firefly | 7 | shield | single | ground | dusk, night | meadow, forest, pond, marsh, town |
| Amber Firefly | `amber-firefly` | firefly | 6 | seed | double | ground | dusk, night | meadow, forest, pond, marsh, town |
| Blue Ghost | `blue-ghost` | firefly | 5 | ghost | steady | ground | dusk, night | forest, marsh, cave |
| Glow-worm | `glow-worm` | firefly | 7 | grub | steady | ground | dusk, night | cave, forest, meadow |
| Emperor Dragonfly | `emperor-dragonfly` | dragonfly | 27 | hawker | plain | water | day | any |
| Scarlet Darter | `scarlet-darter` | dragonfly | 21 | darter | plain | water | day | any |
| Golden-ringed Dragonfly | `golden-ringed` | dragonfly | 27 | hawker | rings | water | day | any |
| Banded Demoiselle | `banded-demoiselle` | dragonfly | 21 | damsel | wingband | water | day | any |
| Azure Damselfly | `azure-damselfly` | dragonfly | 16 | damsel | rings | water | day | any |
| Honeybee | `honeybee` | bee | 9 | bee | stripes | ground | day | any |
| Bumblebee | `bumblebee` | bee | 12 | bumble | tail | ground | day | any |
| Hoverfly | `hoverfly` | bee | 10 | fly | stripes | ground | day | any |
| Carpenter Bee | `carpenter-bee` | bee | 13 | bumble | gloss | ground | day | meadow, forest, town, desert |
| Kohaku Koi | `koi-kohaku` | fish | 27 | koi | patches | water | day, dusk, night | town, meadow, pond |
| Showa Koi | `koi-showa` | fish | 26 | koi | patches3 | water | day, dusk, night | town, meadow, pond |
| Golden Orfe | `golden-orfe` | fish | 21 | slim | plain | water | day, dusk, night | any |
| Minnow | `minnow` | fish | 11 | slim | line | water | day, dusk, night | any |
| Pike | `pike` | fish | 32 | pike | dapple | water | day, dusk, night | meadow, forest, marsh, pond |
| Perch | `perch` | fish | 18 | deep | bars | water | day, dusk, night | any |
| Common Frog | `common-frog` | frog | 14 | frog | spots | shore | day, dusk | any |
| Marsh Frog | `marsh-frog` | frog | 15 | frog | stripe | shore | day, dusk | any |
| Common Toad | `toad` | frog | 16 | toad | warts | shore | day, dusk | any |
| Poison Dart Frog | `poison-dart` | frog | 11 | frog | blots | shore | day, dusk | forest, marsh |
| Red-eyed Tree Frog | `tree-frog` | frog | 13 | tree | flanks | shore | day, dusk | forest, marsh |
| Pipistrelle | `pipistrelle` | bat | 17 | bat | plain | ground | night | any |
| Long-eared Bat | `long-eared` | bat | 18 | eared | plain | ground | night | any |
| Fruit Bat | `fruit-bat` | bat | 25 | fox | mantle | ground | night | forest, meadow, town |
| Pond Skater | `pond-skater` | skater | 10 | skater | plain | water | day | any |
| Whirligig Beetle | `whirligig` | skater | 7 | whirligig | gloss | water | day | any |
| Green Lizard | `green-lizard` | lizard | 26 | lacertid | speckle | ground | day | meadow, town, desert |
| Leopard Gecko | `leopard-gecko` | lizard | 22 | gecko | leopard | ground | day | desert, town, meadow |
| Blue-tailed Skink | `blue-tailed-skink` | lizard | 21 | skink | stripes | ground | day | meadow, town, desert |

## Cost

Every frame of every species a node shows is drawn **once**, when the node enters the tree, into one texture
(`VivariumAtlas`, shared by every node that asks for the same species at the same scale): all 48 species at
`creature_scale` 1 and `detail` 2 bake into a 1280 x 880 texture in **under 1.5 seconds** on our test machine (0.25 to
0.85 s measured, the slower on Forward+), fewer species faster. After that nothing is redrawn: a creature on screen is one
textured quad a frame (a flyer adds a soft shadow quad, a firefly two glow quads; a frog's dive leaves two thin rings for
under a second), and no shape is rebuilt per frame. The behaviour runs at a fixed 60 steps a second in GDScript and allocates nothing per step: **96
creatures cost under 1 ms a step** (0.44 to 0.66 ms measured). Creatures live only around the screen, so map size does
not matter.

## The demo

Open `godot/` as a project and press Play. Page 1 is a field guide of every species in its cycle; pages 2 to 4 are one
meadow with a pond at day, dusk and night. The map is a TileMapLayer with a `vivarium` custom data layer (its trees carry
only collision, so the collision rule marks them; its rocks are tagged `none`); a ground shader paints it, and Vivarium2D
reads both the layer and the CanvasModulate. A walker follows the path (arrow keys take over); S scatters.

## Licence and AI disclosure

See `LICENSE.txt`: use it in any number of your games; do not resell or redistribute the files as a pack. **Everything
Vivarium draws in your game is your output**, for your game, your trailer and your screenshots. No image, font or sound
file ships with the pack.

This pack was made with AI: the code, the creature designs it draws and the demo were produced with AI assistance. It
ships no sounds and no story text.

---

*Vivarium for Godot 4 v1.0.1 · Godot 4.7.2 · Core Systems Asset Factory · https://csaf.itch.io*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
