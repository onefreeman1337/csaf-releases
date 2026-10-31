# Fathom for Godot 4 - Underwater Levels: 48 Species and 12 Seas Drawn in Code — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Fathom for Godot 4 - Underwater Levels: 48 Species and 12 Seas Drawn in Code  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-10-31


---

# Fathom for Godot 4

One node turns a Godot 4 scene into an underwater level: light that falls as you go down, shafts, marine snow, caustics on your own rock, kelp grown from your own tile map, and 48 species drawn in code that part around your player. 12 seas, each with its own drawn backdrop.

Godot **4.7.2**, tested under **Forward+** and **Compatibility**. Older versions were not run. GDScript and shaders only, no extension, no image files in the addon.

## Install

1. Copy `godot/addons/fathom/` into your project's `addons/` folder. There is no plugin to enable: the classes register themselves.
2. Run the demo first if you like: open `godot/project.godot`, press Play.

## One sea

```gdscript
var sea := FathomSea2D.new()
sea.sea = "kelp-forest"
sea.view = FathomSea2D.View.SIDE_ON
sea.floor_layer = $Rocks            # a TileMapLayer: optional
add_child(sea)
$Player.add_to_group("fathom_watch")
```

Put the sea node **after your floor layers and before your characters** in the scene tree, so its plants and floor life draw between them. Add whatever moves to the group `fathom_watch` (or to `watch`): shoals part around it, reef fish bolt, a garden eel sinks into the sand, and it breathes out bubbles.

With no `floor_layer`, a side-on sea that has a floor draws its own (good for a title screen or a cutscene). Every sea can also be placed from the preset scenes in `addons/fathom/presets/sea/`.

### Two views

- **`SIDE_ON`**: `floor_layer`'s cells are rock. Plants grow from the top of each cell with open water above it, crabs walk on it, fish steer round it. The light falls from the top of the area to the bottom (`depth_gain`).
- **`TOP_DOWN`**: `floor_layer`'s cells are the sea bed, so a town or dungeon map goes under water with no other change. Floor creatures stay on cells. Fish only avoid `wall_layer`. Depth is the same everywhere.

A tile with custom data `fathom` = `"none"` (if the TileSet has a string data layer named `fathom`) grows nothing and holds no floor life.

## FathomSea2D

Set a field to **-1** (colours: alpha 0, words: empty) to keep the sea's own value.

| field | what it does |
| --- | --- |
| `sea` | a sea id from the table below |
| `view` | `SIDE_ON` or `TOP_DOWN` |
| `floor_layer`, `wall_layer` | your TileMapLayers, both optional |
| `plant_layers` | your own plant TileMapLayers: each sways as sea grass. **This sets the layer's material.** The atlas must have no margin or separation. |
| `area` | the sea's size in this node's space. Empty = the floor layer's used rectangle, or the view when it starts |
| `life_seed` | the same seed gives the same sea |
| `depth` | 0 to 8. Reds go first, then greens; the brightness falls more slowly than the hue |
| `depth_gain` | `SIDE_ON`: how many depth units the light falls from the top of the area to the bottom |
| `murk` | 0 to 100: how much of the water's own colour hangs in the scene |
| `water_color` | the colour of the water |
| `caustics`, `caustics_on_floor` | percent of a full net of light. `SIDE_ON`: the net falls on the floor layer's own pixels, **which sets that layer's material**; turn `caustics_on_floor` off if it has its own. `TOP_DOWN`: it falls over the screen |
| `wobble` | how far the picture wavers, in pixels |
| `shafts`, `shaft_strength` | how many light shafts cross one view, and how bright they are |
| `snow` | 0 to 1: marine snow. In deep seas it glows |
| `lamp_radius` | a pool of light around each watcher, in pixels; colours come back inside it. Up to four lamps |
| `sunk` | 0 = dry, 1 = fully under. Tween it for a flood |
| `current_degrees`, `current_speed` | the way the water flows (0 = right, 90 = down). Motes, kelp and jellies follow it |
| `life` | percent of the sea's own life (which also scales with the area, up to 3.5 times a 1280 x 720 view) |
| `creature_scale`, `speed_scale` | size and pace of every creature |
| `custom_life` | `[["species-id", count], ...]` instead of the sea's own life, with exactly these counts; a record from `make_species()` can stand in for the id |
| `watch`, `watch_group`, `flee_distance` | what creatures react to, and how close |
| `swim_above_grade` | on: swimmers draw above the light (they keep their colour and are never behind your tiles). Off: they live in your world, under the grade, in tree order |
| `breath`, `bubble_columns` | watchers breathe out bubbles; columns rise from the floor |
| `kelp`, `kelp_density`, `kelp_height`, `kelp_sway` | `giant`, `grass`, `meadow` or `none`; plants per 100 px of floor; the tallest plant; how far it sways |
| `backdrop`, `backdrop_layer`, `grade_layer` | draw the water and its silhouettes behind everything; the CanvasLayers it uses (it also uses `grade_layer` + 1 and + 2) |
| `draw_floor`, `floor_level` | the floor this node draws when it has no floor layer |

Methods: `rebuild()`, `sink_to(depth, seconds)`, `sea_area()`, `count_alive()`, `kelp_node()`. Signal: `startled(species_id, at)`.

Changing `sea` rebuilds it. Changing a light or water field takes effect on the next frame, so you can tween them.

## One species, by hand

```gdscript
var school := FathomCatalog.instantiate("sardine") as FathomSchool2D
school.count = 24
school.radius = 200.0
school.watch = [$Player]
add_child(school)
```

`FathomSchool2D` needs no sea. Fields: `species`, `count`, `radius`, `creature_scale`, `speed_scale`, `tint`, `watch`, `watch_group`, `flee_distance`, `life_seed`, `custom_species`, `detail`, `glow_strength`. Signal: `startled(species_id, at)`. Method: `count_alive()`.

Recolour one: `FathomCatalog.make_species("my-clown", "clownfish", "#3060e0", "#ffffff", "#101010")`, then set it as `custom_species`. A colour that is not `#rrggbb` keeps the species' own.

## Diving, and air

```gdscript
var d := FathomDive.play(self, FathomDive.DIVE, player_screen_pos, Color("#1c5a74"))
d.midpoint.connect(func(): get_tree().change_scene_to_file("res://reef.tscn"))
```

`FathomDive` covers the screen with a splash and a sink, fires `midpoint` while covered, clears, fires `finished` and frees itself. `FathomDive.SURFACE` is the rise.

`FathomAir` is a Control: a column of bubbles that falls while `under` is true and refills five times as fast above water. Fields: `seconds`, `under`, `bubble_color`, `low_color`, `bubbles`. Signals: `air_low`, `air_empty`. Method: `refill(amount)`. It keeps the time and draws; your game decides what running out costs.

`FathomKelp` can also be placed by itself: `kind`, `roots`, `height`, `root_color`, `tip_color`, `plant_seed`, `sway_px`, `sway_speed`, `lean_px`.

## The seas

| sea | id | depth | murk | shafts | caustics | floor | plants | lamp |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sunlit Shallows | `sunlit-shallows` | 0.5 | 14 | 6 | 150 | yes | grass | none |
| Coral Garden | `coral-garden` | 1.3 | 18 | 5 | 110 | yes | grass | none |
| Kelp Forest | `kelp-forest` | 2 | 34 | 4 | 60 | yes | giant | none |
| Seagrass Meadow | `seagrass-meadow` | 1 | 26 | 5 | 90 | yes | meadow | none |
| Open Blue | `open-blue` | 2.6 | 26 | 8 | 0 | no | none | none |
| Twilight Drop | `twilight-drop` | 4.4 | 40 | 2 | 0 | no | none | none |
| Midnight Zone | `midnight-zone` | 7 | 10 | 0 | 0 | no | none | 150 |
| Ice Shelf | `ice-shelf` | 1.5 | 22 | 5 | 40 | yes | none | none |
| Vent Field | `vent-field` | 3.9 | 26 | 0 | 0 | yes | none | 110 |
| Shipwreck | `shipwreck` | 3 | 38 | 3 | 40 | yes | grass | none |
| Sea Cave | `sea-cave` | 2.8 | 30 | 1 | 30 | yes | none | 90 |
| Drowned Temple | `drowned-temple` | 3.4 | 34 | 4 | 50 | yes | giant | none |

## The families

| family | how it behaves | where it draws |
| --- | --- | --- |
| Reef fish | hold a home on the reef, hover and dart, and bolt when the player comes close | above the grade |
| Shoaling fish | swim as one shoal that parts around the player and closes up behind | above the grade |
| Big fish | cruise long lines across the sea, unbothered, turning wide | above the grade |
| Deep sea fish | hang in the dark almost still, their own lights pulsing, and drift toward a lamp | above the grade |
| Rays | glide in wide slow arcs on beating wings | above the grade |
| Jellies | pulse upward and sink, carried by the current | above the grade |
| Eels and sea snakes | wind along the floor; garden eels sway in place and sink into the sand when the player comes near | in your world, under it |
| Crabs and crustaceans | walk the sea floor, pausing, and scuttle away from the player | in your world, under it |
| Seahorses | hang upright near one spot, swaying, fins a blur | above the grade |
| Cephalopods | rest, then jet off in bursts; startled, they leave a puff of ink | above the grade |
| Turtles | row slowly across the sea | above the grade |
| Floor creepers | stay almost still on the floor | in your world, under it |

## The species

| species | id | family | size (px) |
| --- | --- | --- | --- |
| Clownfish | `clownfish` | reef | 28 |
| Blue Tang | `blue-tang` | reef | 34 |
| Moorish Idol | `moorish-idol` | reef | 36 |
| Queen Angelfish | `queen-angel` | reef | 40 |
| Butterflyfish | `butterflyfish` | reef | 30 |
| Parrotfish | `parrotfish` | reef | 46 |
| Lionfish | `lionfish` | reef | 40 |
| Pufferfish | `pufferfish` | reef | 34 |
| Sardine | `sardine` | shoal | 20 |
| Mackerel | `mackerel` | shoal | 28 |
| Yellowtail Fusilier | `fusilier` | shoal | 26 |
| Fairy Anthias | `anthias` | shoal | 20 |
| Blacktip Reef Shark | `reef-shark` | hunter | 130 |
| Hammerhead | `hammerhead` | hunter | 140 |
| Barracuda | `barracuda` | hunter | 92 |
| Ocean Sunfish | `sunfish` | hunter | 90 |
| Swordfish | `swordfish` | hunter | 130 |
| Anglerfish | `anglerfish` | deep | 56 |
| Lanternfish | `lanternfish` | deep | 24 |
| Viperfish | `viperfish` | deep | 64 |
| Gulper Eel | `gulper-eel` | deep | 96 |
| Manta Ray | `manta` | ray | 120 |
| Spotted Eagle Ray | `eagle-ray` | ray | 84 |
| Bluespotted Stingray | `stingray` | ray | 56 |
| Moon Jelly | `moon-jelly` | jelly | 44 |
| Lion's Mane Jelly | `lions-mane` | jelly | 62 |
| Sea Nettle | `sea-nettle` | jelly | 52 |
| Comb Jelly | `comb-jelly` | jelly | 34 |
| Crystal Jelly | `crystal-jelly` | jelly | 46 |
| Moray Eel | `moray` | eel | 96 |
| Ribbon Eel | `ribbon-eel` | eel | 92 |
| Garden Eel | `garden-eel` | eel | 40 |
| Banded Sea Krait | `sea-krait` | eel | 84 |
| Red Rock Crab | `red-crab` | crab | 36 |
| Hermit Crab | `hermit-crab` | crab | 30 |
| Spider Crab | `spider-crab` | crab | 62 |
| Spiny Lobster | `lobster` | crab | 62 |
| Mantis Shrimp | `mantis-shrimp` | crab | 44 |
| Yellow Seahorse | `seahorse` | seahorse | 36 |
| Leafy Sea Dragon | `sea-dragon` | seahorse | 56 |
| Reef Octopus | `octopus` | cephalopod | 58 |
| Bigfin Squid | `squid` | cephalopod | 66 |
| Cuttlefish | `cuttlefish` | cephalopod | 52 |
| Chambered Nautilus | `nautilus` | cephalopod | 44 |
| Green Sea Turtle | `sea-turtle` | turtle | 82 |
| Red Starfish | `starfish` | creeper | 34 |
| Sea Urchin | `urchin` | creeper | 30 |
| Nudibranch | `nudibranch` | creeper | 30 |

## Cost and limits

Two hundred creatures in one sea, with the grade, shafts and snow on, averaged under about 20 ms a frame, with no frame over about 52 ms, on our test machine (an integrated AMD Radeon, busy with other work at the time), under both renderers. Each creature is one textured quad a frame. A sea's atlas is painted once when the sea starts, in about 780 ms for that sea's species (a shoal of big animals makes a bigger atlas).

Plants are one mesh swayed by a shader: no work per frame, one draw call. The grade and light each read or fill the whole screen once a frame.

- The addon reads the world from the camera's position and zoom: **a rotated Camera2D is not supported** (caustics and depth would not line up).
- The grade sits on a CanvasLayer, so everything in your world under `grade_layer` goes under water, including your HUD if it is on a lower layer. Put your HUD above `grade_layer` + 2.
- A sea with `plant_layers` or `caustics_on_floor` replaces those layers' material.

## Licence

See LICENSE.txt: use it in any number of games, no redistribution as a pack. Every script, shader and scene here was written by an AI; every creature is drawn by that code at run time. The demo's town tiles are from our own Verdant 09 Town (see `godot/demo/fixture/NOTICE.txt`).

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
