# Vivarium — The Small Life of Every Map, Drawn at Runtime, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Vivarium — The Small Life of Every Map, Drawn at Runtime, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/vivarium  
**Docs published:** 2026-11-05


---

```
  ┌───────────────────────────────────────────────┐
  │                                               │
  │            V  I  V  A  R  I  U  M             │
  │          ─────────────  ✦  ─────────────      │
  │     The small life of every map,              │
  │              drawn at runtime.                │
  │                                               │
  │              RPG MAKER MZ PLUGIN · v1.0.0     │
  │                                               │
  └───────────────────────────────────────────────┘
```

**Vivarium fills your maps with the small life a real place has.** Butterflies and bees over the
meadow, dragonflies quartering the pond, fish moving under the surface, frogs on the bank that dive
when your party walks up, and when the screen darkens: fireflies, moths drawn to the party, and bats.
**Nothing to place and no events:** the plugin reads each map (its water, its shore, its walkable
ground) and decides what lives there. **Nothing here is an image file:** all 43 species
are drawn in code, wing by wing and fin by fin, when a map loads.

It leaves the sky to the birds: if you use a bird plugin, Vivarium fills everything under it.

---

## What is in the box

| | |
| --- | --- |
| `js/plugins/Vivarium.js` | Parameters, notetags, plugin commands and the map layer. The only file that touches RPG Maker. |
| `js/plugins/VivariumCore.js` | The species, the habitat reader, day and night, and how each creature moves. Knows nothing about RPG Maker. |
| `js/plugins/VivariumPaint.js` | The painter. Draws every frame of every creature. Knows nothing about RPG Maker. |

---

## Install

1. Copy the three `.js` files into your project's `js/plugins` folder and switch them on in the
   Plugin Manager. **Any order works**: each file looks its siblings up the first time it needs them,
   including the alphabetical order you get by dragging the folder in, which puts `Vivarium.js` first.
2. Start a new game. On MZ's own sample map (the **Overworld** tileset) butterflies and bees are already
   out. Nothing else is needed.

---

## Where life appears

Every tile of a map is read once, when the map loads:

| Tile | Is | What lives there |
| --- | --- | --- |
| **Water** | an A1 water tile (not a waterfall), **or** a tile with your *Water terrain tag*, **or** a tile with your *Water region* | fish under the surface, pond skaters and whirligigs on it, dragonflies and damselflies over it |
| **Shore** | a walkable tile beside water | frogs and toads |
| **Land** | any other walkable tile | butterflies and bees by day; moths, fireflies and bats at dusk and night |

A tile nobody can walk on (a wall, a tree, a rock) gets no land life. **Land-life region** keeps land
creatures to one region; **No-life region** keeps a road or a stage clear.

**Which maps.** A map note decides first, then the tileset's note, then the tileset's **name**:

```
<Vivarium: meadow pond>      this map is a meadow with a pond
<Vivarium: none>             no life on this map
<Vivarium density: 1.5>      half as much again on this map
```

Biomes: **meadow, forest, pond, marsh, town, cave, none**. A map with no note is matched by its
tileset's name against **Biome by tileset name**; with the defaults, MZ's own *Overworld* and *Outside*
maps are meadows, *Dungeon* maps are caves, and *Inside* maps stay empty. Water life joins any biome
whose map actually has water.

| Biome | Families |
| --- | --- |
| meadow, forest | butterflies, moths, fireflies, bees, bats, and (with water) dragonflies, fish, frogs, skaters |
| pond | dragonflies, fish, frogs, skaters, fireflies, moths |
| marsh | dragonflies, fish, frogs, skaters, fireflies, moths, butterflies |
| town | butterflies, moths, bees, bats, fish |
| cave | bats, glow-worms and blue ghosts, at any hour; moths at dusk and night |
| none | nothing |

Some species keep to their own biomes: the Blue Morpho and the Poison Dart Frog to forest and marsh,
the Blue Ghost to forest, marsh and cave, the Glow-worm to cave, forest and meadow, and the koi to town,
meadow and pond maps. The table below lists every species' biomes.

## Day, dusk and night

By default the **screen tone** decides, so any day/night plugin that tints the screen works with no
setup: MZ's own *Night* tint is night, *Sunset* is dusk, and a desaturated look like *Sepia* is not a
time of day. Or point **Day and night from** at a switch (ON = night) or at a variable that holds the
hour (21:00 to 04:59 is night, 18:00 to 20:59 and 05:00 to 06:59 are dusk).

| | Out |
| --- | --- |
| Day | butterflies, bees, dragonflies, fish, frogs, skaters |
| Dusk | moths, fireflies, fish, frogs |
| Night | moths, fireflies, fish, bats |

When the time changes, the creatures of the old hour leave together and the new ones arrive over a few
seconds. The fireflies' light sits above the night tint, so it glows instead of being dimmed with the
ground it lights.

## How they behave

* **Butterflies** flutter between flowers and settle for a moment with their wings opening and closing.
* **Moths** flutter harder and, at dusk and night, circle your party as if it carried a lamp
  (**Moths circle the party**).
* **Fireflies** drift low and flash in their species' rhythm: a single flash, a double flash, or a
  steady glow. Like some real fireflies, each species **falls into step within seconds and flashes
  together**, so a meadow at night pulses in waves (**Fireflies flash together**; off = every firefly
  on its own beat).
* **Dragonflies** dart and hover over the water, wings a blur.
* **Bees** zigzag from flower to flower.
* **Fish** glide under the surface and never leave the water; small **minnows** swim in shoals of three.
* **Frogs** sit and croak on the bank and hop about. Walk up to one and it **dives**, leaving a ripple,
  and surfaces somewhere else along the bank a few seconds later.
* **Bats** swoop in wide arcs.
* **Pond skaters** push and glide across the surface; **whirligigs** spin.

Come within **Flee distance** of a creature and it scatters: flyers climb away, fish and skaters dart,
frogs dive. Fireflies and bats do not flee. The **Scatter** command makes everything on screen flee at
once.

Creatures are scenery: they never block, collide with or trigger anything, and they live only in and
around the part of the map on screen, so a large map costs no more than a small one.

---

## The species

| Species | Family | Lives over | Out | Only in |
| --- | --- | --- | --- | --- |
| Cabbage White | butterfly | ground | day | any |
| Brimstone | butterfly | ground | day | any |
| Orange Tip | butterfly | ground | day | any |
| Red Admiral | butterfly | ground | day | any |
| Peacock | butterfly | ground | day | any |
| Common Blue | butterfly | ground | day | any |
| Swallowtail | butterfly | ground | day | any |
| Monarch | butterfly | ground | day | any |
| Blue Morpho | butterfly | ground | day | forest, marsh |
| Small Copper | butterfly | ground | day | any |
| Buff-tip | moth | ground | dusk, night | any |
| Garden Tiger | moth | ground | dusk, night | any |
| Luna Moth | moth | ground | dusk, night | forest, meadow, marsh |
| Silver Y | moth | ground | dusk, night | any |
| Emperor Moth | moth | ground | dusk, night | any |
| Meadow Firefly | firefly | ground | dusk, night | meadow, forest, pond, marsh, town |
| Amber Firefly | firefly | ground | dusk, night | meadow, forest, pond, marsh, town |
| Blue Ghost | firefly | ground | dusk, night (any hour in a cave) | forest, marsh, cave |
| Glow-worm | firefly | ground | dusk, night (any hour in a cave) | cave, forest, meadow |
| Emperor Dragonfly | dragonfly | water | day | any |
| Scarlet Darter | dragonfly | water | day | any |
| Golden-ringed | dragonfly | water | day | any |
| Banded Demoiselle | dragonfly | water | day | any |
| Azure Damselfly | dragonfly | water | day | any |
| Honeybee | bee | ground | day | any |
| Bumblebee | bee | ground | day | any |
| Hoverfly | bee | ground | day | any |
| Carpenter Bee | bee | ground | day | meadow, forest, town |
| Kohaku Koi | fish | water | day, dusk, night | town, meadow, pond |
| Showa Koi | fish | water | day, dusk, night | town, meadow, pond |
| Golden Orfe | fish | water | day, dusk, night | any |
| Minnow | fish | water | day, dusk, night | any |
| Pike | fish | water | day, dusk, night | meadow, forest, marsh, pond |
| Perch | fish | water | day, dusk, night | any |
| Common Frog | frog | shore | day, dusk | any |
| Marsh Frog | frog | shore | day, dusk | any |
| Common Toad | frog | shore | day, dusk | any |
| Poison Dart Frog | frog | shore | day, dusk | forest, marsh |
| Pipistrelle | bat | ground | night (any hour in a cave) | any |
| Long-eared Bat | bat | ground | night (any hour in a cave) | any |
| Fruit Bat | bat | ground | night | forest, meadow, town |
| Pond Skater | skater | water | day | any |
| Whirligig Beetle | skater | water | day | any |

## Your own species

Add them in **Your own species**: choose a family, give it three colours (`#rrggbb`) and a size, and the
same painter draws it. **Shape** and **Pattern** are optional (blank uses the family's first); the
values each family accepts are:

| Family | Shape | Pattern |
| --- | --- | --- |
| butterfly | round, leaf, scallop, tailed, pointed | tips, dot, band, eyes, margin, veins, spots |
| moth | delta, luna, broad | tips, net, eyes, mark |
| firefly | seed, grub | single, double, steady |
| dragonfly | hawker, darter, damsel | plain, rings, wingband |
| bee | bee, bumble, fly | stripes, tail, gloss |
| fish | koi, slim, pike, deep | patches, patches3, plain, line, dapple, bars |
| frog | frog, toad | spots, stripe, warts, blots |
| bat | bat, eared, fox | plain, mantle |
| skater | skater, whirligig | plain, gloss |

**Only in biomes** is optional (a list such as `forest marsh`). A row with an unknown family is ignored,
and a colour that is not `#rrggbb` falls back to the family's own.

---

## Plugin commands

| Command | Arguments | What it does |
| --- | --- | --- |
| Set Life On | On | Turns every creature on or off. Saved with the game. |
| Set Density | Density (0 to 4) | How much life there is. Saved with the game. |
| Set This Map's Biomes | Biomes | Overrides the current map's biomes (for example `marsh`, or `none`). Blank goes back to the map's own. Saved with the game. |
| Set Time Of Day | auto, day, dusk, night | Forces the creatures' time of day, or goes back to automatic. Saved with the game. |
| Scatter | none | Everything on screen flees at once. |

**Script calls:** `CSAF.Vivarium.count()` creatures alive now · `CSAF.Vivarium.phase()` `'day'`,
`'dusk'` or `'night'` · `CSAF.Vivarium.biomes()` the current map's biomes ·
`CSAF.Vivarium.speciesIds()` every species id, yours included · `CSAF.Vivarium.scatter()`.

---

## Parameters

| Parameter | Default | |
| --- | --- | --- |
| Life on | `true` | Every creature on or off (Set Life On changes it in play). |
| Density | `1.00` | 0 to 4. Per map: `<Vivarium density: 1.5>`. |
| Creature size | `1.50` | 0.5 to 2.5. 1.5 suits 48 px tiles; the creatures are drawn at this size, never stretched. |
| Most creatures at once | `48` | 4 to 96. |
| Flee distance (px) | `64` | How close the party can come before creatures scatter. |
| Biome by tileset name | Overworld, Outside, Field = meadow · Forest, Jungle = forest · Town, Village = town · Marsh, Swamp, Tidewater = marsh · Dungeon, Cave, Mine = cave | The first word found in a tileset's name picks its biomes. |
| Water terrain tag | `0` (off) | Tiles with this terrain tag count as water, as well as A1 water. |
| Water region | `0` (off) | Tiles with this region count as water. |
| Land-life region | `0` (off) | If set, land creatures live only on this region. |
| No-life region | `0` (off) | Tiles with this region never get life. |
| Day and night from | `tone` | `tone`, `switch` or `variable`. |
| Night switch | `0` | For `switch`: ON = night. |
| Hour variable | `0` | For `variable`: the hour, 0 to 23. |
| Moths circle the party | `true` | |
| Fireflies flash together | `true` | Each species falls into step and flashes in unison. |
| Families | all on | Turn any of the nine families off. |
| Your own species | `[]` | See above. |

---

## Compatibility

Only `Vivarium.js` touches RPG Maker, and every core method it touches is **extended**: the original is
saved and called through: `Spriteset_Map.createLowerLayer`, `Spriteset_Map.update`, `Game_Map.setup`
and `Game_System.initialize`. The creatures live on the map's own tilemap at the engine's layers (under
the water surface, on the ground, and in the air above characters), so they scroll, shake and tint with
the map like everything else on it. The one exception is the fireflies' light, which sits just under the
weather layer so the night tint does not dim it.

**Bird plugins.** Vivarium draws no birds on purpose. It sits happily beside a bird plugin: they fill
the sky, Vivarium fills the ground, the water and the night.

**Weather and day/night plugins.** Weather particles and Vivarium's creatures are separate layers. A
day/night plugin that tints the screen drives Vivarium's day and night with no setup; one that uses a
switch or an hour variable is one parameter away.

**Saves.** Only the command settings are saved, in a small versioned slot on `Game_System`. Where each
creature is, is not saved: a map's life is made again when the map is entered, and the same map with the
same save makes the same life. Closing the menu returns you to the same creatures, not a reshuffle.
Adding Vivarium to a game in progress is safe.

**Cost.** Every frame of every species is drawn once, into one image, the first time a map needs it;
after that nothing is redrawn or re-uploaded. Measured in the engine at 0 texture uploads per frame and
about 11 draw calls with 96 creatures on screen, the plugin's own update averaging
0.5 ms or less, and allocating nothing per frame.

---

## Licence

See `LICENSE.txt`. **The creatures are yours to show:** anything Vivarium draws on your maps is your
output, for your game, your trailer and your screenshots. No image, font or sound ships with the plugin,
and no RPG Maker RTP art is used or required.

## AI disclosure

The code and the graphics in this product were produced with AI assistance. No sounds ship with it and
it adds no story text. The tiles and the character in the store images are demonstration art from our
other products and are not included.

---

*Vivarium v1.0.0 · RPG Maker MZ · Core Systems Asset Factory · https://csaf.itch.io*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
