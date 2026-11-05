# Fathom - Underwater Maps for RPG Maker MZ: Caustics, Light Shafts, Kelp, Sea Life and a Dive — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Fathom - Underwater Maps for RPG Maker MZ: Caustics, Light Shafts, Kelp, Sea Life and a Dive  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/fathom  
**Docs published:** 2026-11-05


---

# Fathom — your own maps under the sea, for RPG Maker MZ

Mark a map underwater and Fathom draws it as if seen from below the surface:
- the colours graded by depth, with the reds going first;
- your map's own rivers and ponds sinking into the water's colour, so they read as part of the seabed;
- a network of caustic light crawling over the floor;
- light shafts slanting down and wavering;
- a gentle refraction wobble;
- drifting motes of plankton;
- bubble chains rising from every character;
- your own tileset's grass and bushes swaying as sea grass;
- sea life that swims around the party.

Dive and Surface commands take the party in and out with a splash.

Nothing is loaded from an image file: every effect and every creature is drawn by the plugin. It works over any tileset.

## Install

Copy the three files into `js/plugins/` and turn all three on in the Plugin Manager. Any order works.

| file | what it is |
| --- | --- |
| `FathomCore.js` | the rules: depth light, caustics, the species, schools, air (no parameters) |
| `FathomPaint.js` | draws every creature, bubble and light shaft (no parameters) |
| `Fathom.js` | the plugin: parameters, the map notetag and plugin commands |

## Make a map underwater

In **Map Properties > Note**, add:

```
<underwater>
<underwater: depth 3, murk 40>
<underwater: depth 1, murk 10, current 90 1.5, life 150, shafts 5, kelp off, caustics 120>
```

| word | range | what it does |
| --- | --- | --- |
| depth | 0-5 | How deep the map is. Reds are absorbed first, then greens, and the light falls away. Default 2. |
| murk | 0-100 | How much of the water's own colour hangs in the scene. Default 30. |
| current | degrees, speed | Which way the water flows. Kelp leans with it, motes drift with it, and schools swim with it. |
| life | 0-300 | Percent of the usual sea life. 0 means none. |
| shafts | 0-8 | How many light shafts come down from the surface. Default 4. |
| kelp | on/off | Whether your tileset's bush tiles (grass, reeds, shrubs: any tile with the Bush flag) sway as sea grass. |
| caustics | 0-300 | Percent of the Caustic light parameter, for this map. |

## Sea life

48 species are drawn from their parts: a body plan, a body, a tail, a pattern and a palette.
- **Fish**, in schools that part around the party and close up behind it.
- **Rays**, gliding overhead.
- **Jellyfish**, drifting with the current.
- **Eels and crabs** on the floor.
- **Seahorses.**

Each map always holds the same life. Deep maps gather more jellyfish and eels, and shallow maps more crabs and seahorses.

Crabs and eels live on the floor and take the floor's colour. Fish, rays, jellyfish and seahorses swim above it, so there is less water between them and the camera: they keep more of their colour, and each one casts a soft shadow on the floor below it.

## Dive and surface

Use the **Dive** and **Surface** plugin commands in place of Transfer Player:
- **Dive:** a splash ring at the party, the screen sinks into blue, and on the new map the light falls away to the water's own colour.
- **Surface:** the light rises to white, and the party breaks the surface with a splash.

## Optional rules

- **Slower movement** (default 1 step): the party wades under water. Followers follow at the same pace.
- **Air** (seconds, default 0 = off): a column of bubbles on screen shows the air that is left. When it runs out, the common event you choose runs once. If you choose none, the party loses 5% of its max HP each second, never falling below 1. Air refills above water, and the **Refill air** command fills it anywhere (an air pocket, a potion).

## Plugin commands

| command | what it does |
| --- | --- |
| Dive | transfer under water, with the dive transition |
| Surface | transfer back up, with the surface transition |
| Set this map underwater / dry | overrides this map's notetag (a flooding room, a drained cistern); kept in the save |
| Refill air | fills the air column |

## Compatibility

- Fathom **adds one filter** to the map's base sprite and never replaces the existing ones. The swimming sea life sits on Fathom's own layer just above the map, with its own copy of that filter.
- It reads the **live screen tone**, so a day/night plugin still darkens the scene, and the caustics shrink at night (parameter **Caustics at night**).
- Patched engine methods, each calling the original:
  - `Spriteset_Map`: createLowerLayer, update, destroy
  - `Game_System`: initialize, onAfterLoad
  - `Game_Player`: realMoveSpeed
  - `Scene_Map`: update
- The save keeps one small record, which is repaired if it is damaged. Saves made before Fathom was installed load normally.

## How it was tested

Every check below ran against the files in this zip, extracted fresh.
- **In RPG Maker MZ's own runtime**, on our own reef and town test maps: the filter added after the engine's own, the sea life, shafts, motes and swaying sea grass built; Set dry and back; the party wading; Dive into the town and Surface back out; a save and load; the air running out and Refill air; a night screen tone shrinking the caustics; bubbles rising; the notetag words; 1,200 frames with no error.
- **Installed into a blank MZ project** with the stock data and tileset, nothing changed but `<underwater>` on the first map: the same checks, the way you will first see it.
- **The rules, in Node:** the notetag, the depth grade, the caustic sheet tiling without a seam, 48 distinct species, schools that part around the party and keep each fish its own room, air, and the dive timeline.
- **The plugin in a browser with the real PIXI:** the shader compiles and links, every load order works, a missing file is reported instead of crashing, a damaged save record is repaired, and the per-frame update makes no allocations.
- **This Readme:** every claim in it is re-checked against the plugin files, and junk notetags and junk plugin parameters are fed in on purpose.
- **Frame cost:** MZ's frame gate on the busiest test map reports the draw calls, texture uploads and display objects per frame, all inside its limits.

## AI disclosure

This plugin's code was written with AI assistance. Every effect and creature is drawn by that code at run time. No image model and no third-party art was used.

Copyright (c) 2026 Core Systems Asset Factory. Licence: see LICENSE.txt (commercial use permitted).


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
