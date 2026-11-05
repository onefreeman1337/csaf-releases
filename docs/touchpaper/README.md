# Touchpaper: Elemental Surface Chemistry for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Touchpaper: Elemental Surface Chemistry for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/touchpaper  
**Docs published:** 2026-11-05


---

# Touchpaper — Elemental Surface Chemistry for RPG Maker MZ

**The ground burns, freezes, floods and conducts, and every tile remembers.**

Touchpaper gives every tile on your map a surface, a temperature, a wetness and a
charge, and then lets those argue with each other.

* Set fire to dry grass and it spreads, leaves ash, and stops at a river.
* Soak a line of ground first and you have built a firebreak.
* Freeze a lake and the party walks across it. Thaw it and they cannot.
* Pour oil, light one end, and the whole trail goes up.
* Earth a shock through standing water and it hits everything standing in it.
* Throw fire at water and you get steam, not a burning lake.

None of that is scripted. There is no "fire event" and no "ice event" — the rules
are properties of the materials, so combinations you never planned for still work.

---

## What is in the box

Five plain JavaScript files, no images, no audio, no third-party assets.

| File | What it is |
| --- | --- |
| `TouchpaperCore.js` | Parameters, plugin commands, the map layer, saving |
| `TouchpaperField.js` | The model: five numbers per tile and the rules that move them |
| `TouchpaperPaint.js` | One painter per surface state — the file to edit to change the look |
| `TouchpaperInk.js` | The palette and the marks the painters are made of |
| `TouchpaperRng.js` | The deterministic random seam |

**Load order does not matter.** Touchpaper's files find each other at first use, so
any order in the Plugin Manager works. There is no `plugin_order.json` to respect.

---

## Installing

1. Copy all five `.js` files into your project's `js/plugins/` folder.
2. Open the Plugin Manager and add each one. Any order.
3. Open `TouchpaperCore` and set **Default Surface** to whatever most of your
   ground is made of.

That is the whole installation. Everything else is optional.

---

## Setting up a map

Touchpaper reads your **region layer**, which is the R button in the tileset
palette.

1. Paint regions over the ground you care about.
2. Map each region id to a surface in `TouchpaperCore`'s **Region → surface**
   parameter.

Out of the box: region **1** is grass, **2** is water, **3** is wood, **4** is oil,
**5** is stone. Anything you do not paint uses the Default Surface.

To change the default for one map only, put a notetag in that map's note box:

```
<tp:sand>
```

You do not have to set up every map. A map with no regions painted is simply one
surface throughout, and costs nothing until something happens on it.

---

## Making something happen

Every plugin command takes an X and a Y. **Leave them blank and it happens at the
player's feet**, which is what you want most of the time.

| Command | What it does |
| --- | --- |
| **Ignite** | Heat. Dry flammable ground catches; wet ground does not. |
| **Chill** | Cold. Enough of it and standing water freezes into a sheet. |
| **Douse** | Water. Wet ground will not catch, and boils off as steam. |
| **Shock** | A charge, which earths through anything conductive. |
| **Pour oil** | A slick that catches instantly and burns along its whole length. |
| **Set surface** | Change what an area of ground is made of. |
| **Set wind** | Push fire in a direction. |
| **Reset this map** | Put every tile back to its starting state. |

A fire spell that sets the ground alight is **one Ignite command** in its common
event. Nothing else is required.

### Reading the ground from an event

In a Script command or a conditional branch:

```js
Touchpaper.stateAt(x, y)      // 'dry' 'wet' 'frozen' 'burning' 'scorched' ...
Touchpaper.surfaceAt(x, y)    // 'grass' 'water' 'oil' ...
Touchpaper.isBurning(x, y)    // true / false
```

So "this door only opens if the brazier's fire has reached the oil" is a
conditional branch with `Touchpaper.isBurning(12, 8)` in it.

---

## The materials

| Surface | Burns? | Notes |
| --- | --- | --- |
| stone | no | Takes a scorch mark. Conducts a little. |
| grass | yes, fast | Catches easily, burns out in about five steps, leaves ash. |
| wood | yes, slowly | The long burn. Still alight when the grass around it is out. |
| sand | no | Fuses to glass at very high heat. |
| water | no | Conducts perfectly. Freezes. Boils to steam. |
| snow | no | Melts to mud. |
| mud | barely | Conducts well when wet. Freezes. |
| ash | barely | What is left after a fire. |
| oil | yes, instantly | Catches at the first spark and runs the length of a trail. |

Temperature runs 0–255 with **128 as ambient**. Above **190** a dry, flammable tile
catches; at or below **60** water and mud freeze. One number carries both fire and
frost, which is why a flame arriving at a frozen pond is a real fight rather than a
special case.

---

## What the player feels

Standing on burning ground costs HP every simulation step, and standing in water
something has just earthed a charge through costs more. Both are parameters and
both can be set to **0** if you would rather handle it yourself with the script
calls above.

Frozen water is walkable while it is frozen — that is the parameter
**Frozen water is walkable**, and it is on by default.

---

## COMPATIBILITY

**Tested alongside:** a blank RPG Maker MZ project (v1.8.x core scripts), the stock
`Scene_Map`, and VisuStella MZ Core Engine.

**Plugin Manager order:** *any*. Touchpaper resolves its own files at first use.
If you are also using VisuStella MZ Core Engine, put it above Touchpaper as
VisuStella requires — Touchpaper does not care either way.

**What Touchpaper extends, keeping the original and calling it:**

| Method | Why |
| --- | --- |
| `Spriteset_Map.prototype.createTilemap` | to add the surface layer |
| `Game_Map.prototype.setup` | to load the field for the new map |
| `Game_Map.prototype.update` | to step the simulation |
| `Game_Map.prototype.isPassable` | to allow walking on ice |

**Nothing is replaced.** Every one of those four keeps a reference to the original
and calls it, so Touchpaper stacks with any other plugin that does the same.
`isPassable` only ever **adds** passage across frozen water; it never removes
passage your map allowed.

**Touchpaper does not touch** the battle scene, the menu, the message system, the
save file format, or the database. It adds no windows and overrides no core method
outright.

**It adds exactly one sprite** to the map's tilemap, at `z = 1` — above your tiles,
below your characters.

---

## Performance

Touchpaper is designed around one idea: **the ground almost never changes, so
almost nothing should be redrawn.**

* The surfaces are one cached bitmap, repainted only on the tiles whose appearance
  actually moved, and at most a few tiles per frame.
* Flames, steam and arcs are a second, much cheaper bitmap over the top, redrawn
  only for the handful of tiles that are actually doing something.
* The simulation itself runs once every six frames by default, not every frame.
* Nothing is allocated in the per-frame path.

Measured in a real MZ runtime with the whole map alight, over three runs of 300
frames: **0.208 ms mean plugin CPU per frame, 2.1 ms at the 99th percentile, and
zero frames over the 16.67 ms frame budget.** Display objects do not grow while it
runs.

If you want it cheaper still, raise **Simulation step (frames)**. If you want it
smoother, lower it.

---

## Saving

The state of every map you have changed is saved with the game, so a forest the
player burned down is still burnt when they load.

The data is run-length encoded, so the cost depends on how *varied* the map is
rather than on how big it is. Measured on a 221-tile map: **about 260 bytes** once
the fire has gone out and the ground has settled, and **about 1.4 KB** at the
messiest possible moment, mid-fire, with heat and moisture different on almost
every tile. A quiet map you have never touched costs nothing at all, because no
field is created until something happens on it.

---

## Licence

Copyright © 2026 **Core Systems Asset Factory**. See `LICENSE.txt`.

Commercial and non-commercial use in RPG Maker games is permitted. Redistributing
or reselling the plugin files themselves is not.

## AI disclosure

This plugin's code and its store artwork were generated with AI assistance. It
ships no third-party assets, no sound, and no text or dialogue.

---

*Touchpaper is one of a catalogue of RPG Maker MZ systems from Core Systems Asset
Factory: <https://csaf.itch.io>*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
