# Voyage Core: Sea Travel, Wind and Cargo for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Voyage Core: Sea Travel, Wind and Cargo for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/voyage-core  
**Docs published:** 2026-11-05


---

# Voyage Core — sea travel as gameplay for RPG Maker MZ

**The sea is not a loading screen.**

RPG Maker gives you a boat, a ship and an airship. They are teleports with a sprite: you board, you
steer, you arrive, and nothing about the passage mattered. Every travel plugin on the market makes
that faster. None of them makes it a *journey*.

Voyage Core is the journey. The wind has a direction and a strength, and your heading relative to it
decides your speed — which means a dogleg course can genuinely beat a straight line. A full hold is
slow. Fruit rots. Storms take the hull and sometimes the cargo. And when you land two hundred tons of
grain somewhere, that somewhere has two hundred tons of grain now, and its price says so.

---

## Install

1. Copy the three files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and add them **in this order**:

   | Order | Plugin | What it is |
   | --- | --- | --- |
   | 1 | `VoyageCore` | the simulation. **Required.** |
   | 2 | `VoyageChart` | the sea chart scene. Optional, and it is most of the product. |
   | 3 | `VoyageManifest` | the cargo manifest scene. Optional. |

3. Open `VoyageCore` and add at least two **Ports**. That is the only setting you must think about.

Voyage Core needs no new database entries, no notetags and no map changes.

---

## Your first voyage, in four steps

1. **Add ports.** In `VoyageCore` → *Ports*, add two or three. Each has an id (a short stable name
   like `tarn`, never shown to the player), a display name, a position on the chart, and an approach
   hazard.

   > Chart coordinates run **0–1000 across** and **0–750 down**. That is the chart's own space, not
   > your game map — the chart is a separate drawn thing, so your world map stays yours.

2. **Put something in the hold.** Use the **Load cargo** plugin command. Give it a stable id, a
   display label, a tonnage, a value per ton, and how many watches it keeps. `0` watches means it
   never spoils — salt, iron, timber.

3. **Call *Open the sea chart*.** Left/Right choose a port, Up/Down swap between setting your
   departure and your destination, Shift drops a waypoint, Confirm weighs anchor.

4. **Watch her sail.** Hold Confirm to run the watches faster. Cancel puts back for port.

---

## The five ideas

### Points of sail

Your speed depends on the angle between your heading and the wind.

**Straight downwind is not fastest — across the wind is.** Straight upwind is impossible and she
tacks instead, giving up distance to gain speed. Most players do not know this, so the first time a
dogleg beats a straight line the mechanic teaches itself.

### The hold

Cargo has weight, and weight costs speed — a full hold is about 40% slower than an empty one. That
makes capacity a real decision instead of an inventory cap with extra steps.

### Keeping time

Perishable lots age every watch and start to turn once they are past their time. A fast passage is
worth money, which is what makes the wind matter rather than being weather-flavoured decoration.

### Weather

Weather is **named from the same wind that drives the ship**, not rolled separately. A storm is the
breeze that carried you all morning grown too strong to carry — and past about 32 knots she is under
storm canvas, so a storm makes you slower *as well as* damaged. That is what makes shelter a
decision.

### Price pressure

Landing goods gluts the port you land them in, and the glut fades over time. Trade routes wear out.
Read it from any event with:

```js
$gameVoyage.priceFactor('oris', 'grain')   // 1.0 = untouched, 0.55 = floor
```

---

## How time works

The simulation steps in **watches** — four hours by default. Conditions are drawn once per watch and
held until the next one, which is what makes a passage reproducible: **the same seed and the same
course always produce the same passage**, on every machine and in every save file.

The chart animates smoothly between watch boundaries. It is interpolating a simulation that has
already been decided; it never rolls dice per frame.

This is also why saving mid-storm and reloading gives you the same storm back.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Open the sea chart** | plot a course, then sail it |
| **Open the cargo manifest** | the hold: weight, value, keeping time |
| **Plot a course** | set a course from an event, with no chart |
| **Sail the plotted course (instantly)** | resolve the whole passage in one go, no animation |
| **Load cargo** | put a lot in the hold |
| **Unload cargo** | take a lot out — this is what gluts a port |
| **Write the result to variables** | copy watches taken / hull / tons spoiled into variables |

## Script access

```js
$gameVoyage.isSailing()                 // true while a passage is running
$gameVoyage.lastResult()                // outcome record of the last passage
$gameVoyage.cargoTons()                 // total tons in the hold
$gameVoyage.hull()                      // 0-100
$gameVoyage.morale()                    // 0-100
$gameVoyage.loadFraction()              // 0-1, how deep she is loaded
$gameVoyage.priceFactor(portId, cargoId)
$gameVoyage.forecast(points, hazard)    // {watches, leagues, worstKnots, stormWatches}
VoyageCore.windAt(seed, watch, out)     // the wind field itself
```

---

## Working with other plugins

Voyage Core touches **four** core methods, all by prototype extension with the original saved and
called. It never replaces one outright:

- `Game_System.prototype.initialize` — creates the record
- `Game_System.prototype.onAfterLoad` — drops the runtime wrapper
- `DataManager.makeSaveContents` — drops the runtime wrapper
- plus the two scenes it adds, which are new classes rather than replacements

Nothing else in the engine is patched, so it sits beside battle systems, menu replacements and
message plugins without argument. Your existing vehicle, world-map and shop plugins are untouched —
Voyage Core adds the passage *between* the ports, not the ports themselves.

**Save compatibility.** The voyage record is stored as a plain object on `$gameSystem`, versioned,
with a migration path. Removing this plugin later leaves a save that still loads; the record simply
becomes an unread property. There is no live object in the save file, ever.

---

## Tuning it

Every number below is a plugin parameter. The defaults are the ones the demo world uses.

| Parameter | Default | What moves if you change it |
| --- | --- | --- |
| Hull speed | 4.00 leagues/hour | everything scales from this |
| Hold capacity | 60 tons | how much weight costs you |
| Crew | 12 | rations eaten per watch |
| Provisions | 240 | 20 watches of food for 12 crew |
| Weather seed | `salt-and-iron` | change it and you get a different world's weather, forever |
| Watches per weather shift | 3 | low is fickle coastal weather; high is a steady trade wind |
| Hours in a watch | 4 | the simulation's time step |
| Spoilage rate | 0.060 | fraction of a lot lost per watch once it is past its time |
| Price pressure per ton | 0.0060 | set to 0 to disable the economy hook entirely |
| Price pressure decay | 0.015 | how fast a market forgets |

**A note on the weather seed.** It is the whole world's weather, not one voyage's. Two projects with
the same seed have the same seas. Change it once, at the start, and leave it alone — changing it
mid-game changes the weather of every voyage a player has not yet made.

---

## If something looks wrong

**"No ports on this chart."** You have fewer than two ports in the *Ports* parameter. Add them and
reopen the chart; it will not throw.

**"Voyage Core not loaded."** `VoyageChart` or `VoyageManifest` is above `VoyageCore` in the Plugin
Manager. Move `VoyageCore` to the top.

**A passage takes forever.** Check the hold — a full one is 40% slower — and check whether the route
runs into the prevailing wind. The forecast on the plotting screen tells you before you commit, and
a waypoint that opens her up to a reach often beats the direct line.

**Everything is a storm.** You have raised the approach hazard on your ports. Hazard multiplies wind
strength on legs that touch a port, so `0.9` on both ends of a route makes it genuinely dangerous.

---

## What is in the box

- `VoyageCore.js` — the simulation. Wind field, points of sail, tacking, cargo, spoilage, storms,
  provisions, morale, price pressure, forecasting, versioned saves.
- `VoyageChart.js` — `Scene_VoyageChart`. A drawn sea chart: vellum, sounding hatchure, coastlines,
  a rhumb-line net, a compass rose with a live wind arrow, a course that inks itself in as she sails
  it, and a weather shader.
- `VoyageManifest.js` — `Scene_VoyageManifest`. A ruled ship's ledger with wax seals, keeping-time
  bars and a weight beam.

Raw, readable, fully commented JavaScript. Nothing is minified. Edit it freely.

**There is no windowskin, no default font and no `Window_Selectable` anywhere in either scene** —
that is deliberate, and it is why it does not look like RPG Maker.

---

## Licence

One licence per developer. Use it in as many of your own games as you like, commercial or free. Edit
it freely. Do not resell or redistribute the plugin itself. Full terms in `LICENSE.txt`.

Credit is welcome and not required.

---

*Built by CSAF — Core Systems Asset Factory.*
*This plugin's code and store artwork were produced with AI assistance; it ships no audio and no
in-game narrative text.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
