# Hedgerow - Ambient Animals for RPG Maker MZ: Rabbits, Squirrels, Mice, Cats and More That Flee the Party — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Hedgerow - Ambient Animals for RPG Maker MZ: Rabbits, Squirrels, Mice, Cats and More That Flee the Party  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/hedgerow  
**Docs published:** 2026-11-05


---

```
  ┌───────────────────────────────────────────────┐
  │                                               │
  │            H  E  D  G  E  R  O  W             │
  │        ─────────────  ✦  ─────────────        │
  │       The animals that walk your maps,        │
  │               drawn at runtime.               │
  │                                               │
  │         RPG MAKER MZ PLUGIN · v1.0.0          │
  │                                               │
  └───────────────────────────────────────────────┘
```

**Hedgerow fills your maps with the animals that walk a real place.** Rabbits grazing on the green,
squirrels at the foot of the trees, mice running the base of a wall to their holes, lizards basking
on the rocks, crabs on the sand, a cat asleep by the fire, and after dark hedgehogs, foxes, badgers and
snails. **Nothing to place and no events:** the plugin reads each map once (its walls, its trees, its
rocks, its sand, its fireplaces) and decides who lives where. **Nothing here is an image file:** all
44 coats in 13 families are drawn in code, in the four facings a character has, when a map loads. They are
smooth, outlined illustrations rather than pixel art, at the size you set (**Animal size**).

**And each one flees the party its own way.** A rabbit sits up, thumps and bolts in a zig-zag with its
white tail showing. A squirrel runs to its tree and climbs out of sight. A hedgehog rolls into a ball.
A mouse dives into its hole and peeks out later. A crab raises its claws, backs off sideways and digs in.

It pairs with **Vivarium** (our butterflies, dragonflies, fish, frogs and bats): Vivarium fills the air
and the water, Hedgerow the ground, and both read day and night the same way.

---

## What is in the box

| | |
| --- | --- |
| `js/plugins/Hedgerow.js` | Parameters, notetags, plugin commands and the map layer. The only file that touches RPG Maker. |
| `js/plugins/HedgerowCore.js` | The animals, the habitat reader, day and night, and how each animal moves and flees. Knows nothing about RPG Maker. |
| `js/plugins/HedgerowPaint.js` | The painter. Draws every frame of every animal. Knows nothing about RPG Maker. |

---

## Install

1. Copy the three `.js` files into your project's `js/plugins` folder and switch them on in the
   Plugin Manager. **Any order works**: each file looks its siblings up the first time it needs them,
   including the alphabetical order you get by dragging the folder in, which puts `Hedgerow.js` first.
2. Make a map with MZ's **Outside** tileset (a field, a village, a beach) or its **Inside** tileset (a
   house) and walk onto it. Animals are already out. Nothing else is needed.

World maps (MZ's **Overworld** tileset) stay empty by default: a rabbit at world-map scale is a giant.
Add `Overworld=meadow` to **Biome by tileset name** if you want them there.

---

## Where animals live

Every tile of a map is read once, when the map loads:

| Habitat | Is | Who lives there |
| --- | --- | --- |
| **Open ground** | any walkable tile that is not water | rabbits and hares by day; hedgehogs, foxes and snails at dusk and night, badgers at night; cats in towns and houses |
| **Foot of a wall** | a walkable tile with a blocking tile directly above it that is not a tree or a rock (a house wall, a hedge, a fence, a counter, a cliff) | mice and rats run along it and dive into a hole drawn in the wall; spiders hang there indoors |
| **Foot of a tree** | a walkable tile with a tree directly above it | squirrels forage round it and climb it |
| **Beside a rock** | a walkable tile that is a rock or touches one | lizards bask on the rock itself |
| **Sand by water** | walkable sand within two tiles of water | crabs sidle, and dig in |
| **Beside a fireplace** | a walkable tile touching a fireplace | a cat asleep |

**MZ's own trees, boulders, sand and fireplaces need no setup.** On any other tileset, mark them with a
terrain tag: either in the parameters (**Tree terrain tag**, **Rock terrain tag**, **Sand terrain tag**,
**Hearth terrain tag**, **Water terrain tag**) or per tileset, in the tileset's note:

```
<Hedgerow tags: tree 7, rock 6, sand 5, hearth 4, water 1>
```

Water is any A1 water tile (not a waterfall) plus your water tag. **Animal region** keeps animals to one
region; **No-animal region** keeps a road or a stage clear. Indoors, the tops of walls are the ceiling
and never get an animal.

## Which maps

A map note decides first, then the tileset's note, then the tileset's **name**:

```
<Hedgerow: meadow town>      this map is a meadow at the edge of a village
<Hedgerow: none>             no animals on this map
<Hedgerow density: 1.5>      half as many again on this map
```

Biomes: **meadow, forest, town, coast, desert, snow, house, cellar, none**. A map with no note is matched
by its tileset's name against **Biome by tileset name**; with the defaults, *Outside* maps are meadows,
*Inside* maps are houses and *Dungeon* maps are cellars. **An outside map with enough buildings on it is
also a town** (its A3 roofs and walls cover at least **Town from buildings** of the map), so one Outside
tileset gives you rabbits in a field and cats and rats in a village with no setup.

| Biome | Families |
| --- | --- |
| meadow | rabbits, hares, squirrels, hedgehogs, mice, lizards, crabs, snails, foxes, badgers |
| forest | rabbits, squirrels, hedgehogs, mice, lizards, snails, foxes, badgers |
| town | cats, mice, rats, hedgehogs, squirrels, snails, lizards, crabs |
| coast | crabs, lizards, rabbits, cats |
| desert | lizards, hares |
| snow | hares, rabbits, foxes, squirrels |
| house | mice, cats, spiders |
| cellar | rats, mice, spiders |
| none | nothing |

A family appears only where its habitat exists: no sand, no crabs; no trees, no squirrels.

## Day, dusk and night

By default the **screen tone** decides, so any day/night plugin that tints the screen works with no
setup: MZ's own *Night* tint is night, *Sunset* is dusk, and a desaturated look like *Sepia* is not a
time of day. Or point **Day and night from** at a switch (ON = night) or at a variable that holds the
hour (21:00 to 04:59 is night, 18:00 to 20:59 and 05:00 to 06:59 are dusk). A blank hour is ignored,
never read as midnight.

| | Out of doors |
| --- | --- |
| Day | rabbits, hares, squirrels, mice, lizards, crabs, cats |
| Dusk | rabbits, hares, hedgehogs, mice, rats, crabs, snails, cats, foxes |
| Night | hedgehogs, mice, rats, snails, cats, foxes, badgers |

Indoors there is no sun: house and cellar animals are out at any hour. **Rain** (MZ's own weather)
brings the snails out by day. When the time changes, the animals of the old hour leave together and the
new ones arrive over a few seconds.

## How each one flees

Come within **Flee distance** of an animal and it reacts in its own way (a cat, a hedgehog and a snail
let you a little closer):

| Family | Calm | When the party comes |
| --- | --- | --- |
| Rabbit | grazes, sits | sits up, thumps a hind foot, bolts in a zig-zag with the white scut showing, then grazes again further off |
| Hare | grazes, crouches flat | sits up and runs long and straight |
| Squirrel | forages round its tree, sits and nibbles | runs home to its tree and climbs up behind the leaves; comes down when you have gone |
| Hedgehog | snuffles along | rolls into a ball where it stands, and unrolls after you leave |
| Mouse, rat | sniffs, washes its face | runs along the wall into its hole, then peeks out and comes back |
| Lizard | basks, does a push-up now and then | darts away in short runs with a freeze between each |
| Crab | sidles, feeds | raises both claws, backs off sideways and digs into the sand; surfaces again later |
| Snail | creeps | withdraws into its shell until you have gone |
| Cat | dozes, washes | sits up and watches you, then stalks away at a walk and sits again |
| Fox | noses the ground, sits | stops with its ears up, trots off and stops once more to look |
| Badger | snuffles, digs | lifts its head and trots off |
| Spider | hangs on its thread from the wall above | climbs its thread out of sight; lets itself down again later |

The **Scatter** command makes every animal on screen take flight at once (a shout, a bell, a door).
Bolting rabbits, hares, foxes and badgers kick up small puffs of dust (**Dust when they bolt**).

Animals are scenery: they never block, collide with or trigger anything, and they live only in and
around the part of the map on screen, so a large map costs no more than a small one. They are drawn on
the same layer as your characters, so your party walks in front of an animal below it and behind one
above it, and a squirrel that climbs a tree disappears behind the leaves.

---

## The coats

| Family | Coats | Only in |
| --- | --- | --- |
| Rabbit | Wild Rabbit, Grey Rabbit, Black Rabbit | any |
| | Sandy Rabbit | meadow, coast, town |
| | Snow Rabbit | snow, town |
| Hare | Brown Hare | meadow |
| | Mountain Hare | snow |
| | Desert Hare | desert, meadow |
| Squirrel | Red Squirrel, Grey Squirrel, Black Squirrel | any |
| Hedgehog | Hedgehog, Blond Hedgehog | any |
| Mouse | Wood Mouse, House Mouse | any |
| | Harvest Mouse | meadow, forest |
| | White Mouse | house, town, cellar |
| Rat | Brown Rat, Black Rat | any |
| Lizard | Blue-tailed Skink | any |
| | Green Lizard | meadow, forest, town |
| | Wall Lizard | town, coast, meadow |
| | Sand Gecko | desert, coast |
| Crab | Shore Crab, Blue Crab, Ghost Crab | any |
| | Hermit Crab | coast, town |
| Snail | Garden Snail, Banded Snail, White-lipped Snail | any |
| Cat | Ginger Cat, Grey Tabby, Black Cat, Calico Cat, White Cat, Tuxedo Cat, Tortoiseshell | any |
| Fox | Red Fox | meadow, forest, snow |
| | Grey Fox | meadow, forest |
| | Arctic Fox | snow |
| Badger | Badger | any |
| | American Badger | meadow, desert |
| Spider | House Spider, Garden Spider | any |

## Your own coats

Add them in **Your own coats**: choose a family, give it three colours (`#rrggbb`) and a size, and the
same painter draws it. **Pattern** is optional (blank uses the family's first); the values each family
accepts are:

| Family | Pattern |
| --- | --- |
| rabbit, hare | agouti, plain |
| squirrel | plain, agouti |
| hedgehog | spines |
| mouse, rat | belly, plain |
| lizard | speckle, net, spots, stripes |
| crab | plain, pale, shell |
| snail | spiral, bands |
| cat | tabby, plain, calico, tuxedo, tortie |
| fox | fox, plain |
| badger | badger |
| spider | plain, cross |

**Only in biomes** is optional (a list such as `town coast`). A row with an unknown family is ignored,
a colour that is not `#rrggbb` falls back to the family's own, and a blank size uses the family's own.

---

## Plugin commands

| Command | Arguments | What it does |
| --- | --- | --- |
| **Set Animals On** | On | Turns every animal on or off. Saved with the game. |
| **Set Density** | Density (0 to 4) | How many animals there are. Saved. |
| **Set This Map's Biomes** | Biomes | Overrides the current map's biomes (a list such as `town`). Blank goes back to the map's own. Saved. |
| **Set Time Of Day** | auto, day, dusk, night | Forces the animals' time of day, or goes back to automatic. Saved. |
| **Scatter** | | Every animal on screen takes flight at once. |

## Parameters

| Parameter | Default | |
| --- | --- | --- |
| Animals on | ON | |
| Density | 1.00 | 0.5 = sparse, 2 = busy. Per map: `<Hedgerow density: 1.5>` |
| Animal size | 1.50 | 1.5 suits 48 px tiles. Scaled again by your tile size automatically. Up to 3. |
| Most animals at once | 24 | 4 to 64 |
| Flee distance (px) | 110 | |
| Dust when they bolt | ON | |
| Biome by tileset name | Outside=meadow; ... Inside=house; Dungeon=cellar | the first word found in a tileset's name picks the biomes |
| Town from buildings | 0.04 | 0 = off |
| Water / Tree / Rock / Sand / Hearth terrain tag | 0 (off) | habitats on a custom tileset |
| Animal region | 0 (off) | animals live only on this region |
| No-animal region | 0 (off) | never on this region |
| Day and night from | Screen tone | or a switch, or an hour variable |
| Night switch, Hour variable | none | |
| Families | all ON | switch any family off |
| Your own coats | none | |

## Script calls

```
CSAF.Hedgerow.count()       animals on the map now (hidden ones too)
CSAF.Hedgerow.phase()       'day', 'dusk' or 'night'
CSAF.Hedgerow.biomes()      the current map's biomes
CSAF.Hedgerow.habitat()     the current map's habitat tile counts
CSAF.Hedgerow.lookIds()     every coat id, yours included
CSAF.Hedgerow.scatter()
```

## Saving

Animals' positions are not saved: a map's animals are made again when you enter it, the same way each
time (the map's id picks them). The commands' settings are saved, in one small versioned record on the
game's system object, and a save made before you installed Hedgerow loads with the parameters' defaults.

---

## Compatibility

* **Load order:** any. Each of the three files finds its siblings the first time it needs them.
* **Day and night plugins** that tint the screen work with no setup; others work through the switch or
  the hour variable.
* **Vivarium** (ours): fully compatible, and meant to be used together.
* Hedgerow adds its animals to the map's own sprite layer and extends three engine methods
  (`Spriteset_Map.prototype.createLowerLayer`, `Spriteset_Map.prototype.update`, `Game_Map.prototype.setup`)
  plus `Game_System.prototype.initialize` for its save record. Each original is kept and called.

## Performance

Measured in the real engine with no RPG Maker install (our own harness): on a full screen of animals the
plugin's layer drew in **11 draw calls** per frame with **0 texture uploads** and **0 bitmap redraws**,
because every frame of every animal is painted once, into one sheet, when the first map loads, and the
display list does not grow while you play. Nothing is allocated per frame.

---

## Terms

Commercial and non-commercial use in RPG Maker MZ projects. See `LICENSE.txt`. Written with AI
assistance (code and the drawing code). © Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
