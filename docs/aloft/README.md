# Aloft — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Aloft  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-10-27


---

# Aloft — your own maps as islands in the sky (RPG Maker MZ)

Aloft turns any RPG Maker MZ map into an island in the sky. Put `<aloft>` in the map's note and leave the sky empty
(or paint it with a region). Under every southern edge of your ground the plugin hangs a rock underside, cut from
**your own edge tiles' pixels** and tinted by them, so it matches whatever tileset you use. The empty map becomes
open air over a **sea of clouds drifting far below**, with wisps passing between your islands, your islands' soft
shadows on the clouds, distant islands, and petals, dust or rain on the wind. Nothing in your map file changes, and no
image files ship: everything is drawn in code when the map loads.

- **Three plugins:** `AloftCore.js`, `AloftPaint.js`, `Aloft.js`. Raw, readable JavaScript.
- **Five dressings:** Spirit Garden, Sky Ruins, Crystal Spire, Steam Isle, Storm Reach.
- **59 kinds of generated thing** (underside bodies, lips, keels, 26 hangers, cloud fields, wisps, distant isles,
  motes, wind streaks), each drawn by its own code.
- **A Fall Off the Edge command** for scripted moments.
- RPG Maker MZ 1.x. No other plugin required.

## Install

1. Copy the three `.js` files into your project's `js/plugins/` folder.
2. Open the Plugin Manager and add all three, **ON**. Any order works.
3. Set the parameters on `Aloft.js` if you want different defaults. The other two files have no settings.

## Make a sky map

1. Put `<aloft>` in a map's **Note** box.
2. Mark the sky. Either route works, and you can mix them:
   - **Empty cells:** a cell with no tile on any of its four tile layers is sky.
   - **The Sky Region:** paint sky cells with **region 1** (the `Sky Region` parameter; per map `sky region N`).
     The tiles you painted underneath stay in your map file. Aloft hides them on screen only.
3. Playtest. Your ground floats. Sky cells cannot be walked on, from either side.

Islands are found for you: every connected patch of ground is its own island, with its own underside, its own shadow
and its own hangers. A wide island hangs a deep keel and a small islet hangs a small cone. An island touching the
bottom edge of the map hangs nothing there, because nothing past the map's edge is ever on screen.

## The map note

```
<aloft>                        the Default Dressing parameter
<aloft: ruins>                 garden, ruins, crystal, steam or storm
<aloft: storm, depth 4, wind 200, speed 2, clouds 90, motes 30, isles 3, shadow off, sky region 7>
```

| key | what it does | range |
| --- | --- | --- |
| `depth` | how far the rock hangs under a large island, in tiles | 1 to 6 |
| `wind` | the direction clouds and motes travel, in degrees: 0 east, 90 south, 180 west, 270 north | 0 to 359 |
| `speed` | wind speed | 0 to 4 |
| `clouds` | how much of the cloud sea is covered | 0 to 100 |
| `motes` | how many petals, leaves, dust or rain drops ride the wind | 0 to 100 |
| `isles` | distant islands in the far sky | 0 to 4 |
| `shadow` | your islands' shadows on the cloud sea | on / off |
| `sky region` | the region that marks sky on this map; 0 = only empty cells | 0 to 255 |

A word Aloft does not know, or a key with no value, is ignored. A blank value never becomes zero.

## The five dressings

| dressing | the underside | what hangs from it | the sky below |
| --- | --- | --- | --- |
| `garden` Spirit Garden | earth strata and buried stones | tangled roots, tap roots, ivy, flowering vines, moss beards, drips, a waterfall off the edge | white cumulus, petals and leaves |
| `ruins` Sky Ruins | cut-stone courses in stepped tiers | chains, broken arches, hanging blocks, torn banners, pillar stubs | long stratus banks, dust |
| `crystal` Crystal Spire | geode rock with glowing veins | crystal clusters and spikes that pulse, geode shards | small puffs, sparkles |
| `steam` Steam Isle | a riveted hull with brass bands and a brass keel | struts, pipes, gears, a turning propeller, steam vents, lanterns that glow | cumulus, soot |
| `storm` Storm Reach | jagged slate | rock spikes, lightning rods, static veins, hanging shards | dark anvil clouds lit by lightning, rain |

The top band of every underside is **your edge tile's own bottom rows**, mirrored and shaded, and the strata are tinted
toward your edge tiles' colours: a grass island and a sand island in the same dressing get different rock.

## Your screen tone drives the sky

Aloft reads MZ's own screen tone. A **Night** tint gives a deep night sky with stars; a **Sunset** tint warms the
horizon; MZ's tone filter then grades everything on top, as it does for the rest of your map. The sky is redrawn only
when the tone actually changes.

## Plugin commands

| command | what it does |
| --- | --- |
| **Aloft On/Off** | turns Aloft on or off for the whole game (saved). Off: your maps look exactly as authored. |
| **Set Map Dressing** | changes the current map's dressing at once (saved per map) |
| **Set Wind** | direction and speed for every Aloft map (saved) |
| **Set Cloud Cover** | cover for every Aloft map (saved) |
| **Fall Off the Edge** | the player or an event jumps one tile forward off the edge, then falls through the clouds, shrinking and fading. With *Wait for Completion* the event waits for it. The player is then transferred to the map you name (or left hidden if you name none); an event is erased for the rest of the map visit. |

Settings are stored in the save file under one versioned key. Island shapes and hangers are rebuilt from the map
itself every time it loads, so nothing about a map's geometry is ever saved.

## Compatibility

- **Extends** (saves the original and calls it): `Game_System` initialize and onAfterLoad, `Game_Map` setup and
  isPassable, `Game_CharacterBase` update and screenY, `Game_Interpreter` updateWaitMode, `Sprite_Character`
  updateOther, `Spriteset_Map` createLowerLayer, update and destroy, `Scene_Map` start.
- **Replaces nothing.**
- The sky sits between MZ's own parallax and the tilemap, so a map's parallax image is hidden behind it on Aloft maps.
- A map without `<aloft>` is never touched: no layer, and region 1 stays walkable.
- **Looping maps:** the sky and clouds work; undersides are not drawn across the loop seam.
- Any tile size works: the undersides are built in your project's own tile size.

## Performance

Everything is drawn once, when the map loads, and then only moved. The per-frame update allocates nothing. Figures
from our own in-engine gate are on the store page.

## Licence and AI disclosure

See `LICENSE.txt`. The code and the graphics this product draws were produced with AI assistance; no sounds and no
narrative text ship with it.

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
