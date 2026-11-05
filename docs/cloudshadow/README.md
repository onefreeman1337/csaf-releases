# Cloudshadow — weather that throws a real shadow, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Cloudshadow — weather that throws a real shadow, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/cloudshadow  
**Docs published:** 2026-11-05


---

# Cloudshadow — Weather That Throws a Real Shadow

**For RPG Maker MZ.** Version 1.0.0 · Core Systems Asset Factory

Cloudshadow builds the weather above your map and draws the shadow it casts across the ground. The
clouds are generated from the map itself — its size, its surfaces, its region ids — and they drift
with a wind the plugin keeps, at three altitudes moving at three different speeds. Nothing is
authored, nothing is tinted, and no scene is replaced.

---

## Install, in about a minute

1. Copy **both** files from `js/plugins/` into your project's `js/plugins/` folder:
   - `CloudshadowCore.js`
   - `Cloudshadow.js`
2. Open the Plugin Manager and add them **in this order**:
   1. `CloudshadowCore.js`
   2. `Cloudshadow.js`
3. Play a map. That is the whole installation — there is nothing to author and no notetag is
   required for the plugin to work.

> The order above is what reads sensibly in the Plugin Manager. Nothing actually depends on it:
> each file resolves its sibling the first time it needs it, not when it loads, so dragging the two
> files in alphabetically works too.

---

## What happens with no configuration at all

The plugin reads the map you are standing on and derives a sky from it. It looks at, in order of
authority:

1. **A map note** — `<cloudshadow: storm>` wins over everything. Valid: `clear`, `fair`,
   `scattered`, `overcast`, `storm`.
2. **A game variable**, if you name one in the parameters and put a sky name in it. This is the
   hook for your own weather system.
3. **Region ids 61–65**, painted anywhere on the map, mapping to the five skies in order.
4. **The map's own make-up** — how much open water it has, how much of it is building and cliff,
   what kind of tileset it uses, and the screen tone a day/night plugin has left behind.

So a coastal map gets windier, broken weather; a town of roofs and walls gets quieter skies; an
interior gets none at all and opts itself out.

## The shadow lands by surface, not as a decal

Every tile is classified against the engine's own tile tables and given three properties: how much
it changes when it loses skylight, how high it stands, and how cool the light left on it reads.

| Surface | Behaviour |
| --- | --- |
| Water | Changes most and goes coolest — it is mirroring the sky, and the sky just went grey |
| Roof | Stands two tiles up, so a cloud reaches it *before* the ground beside it |
| Wall top / cliff | Stands high, catches the shadow early |
| Wall side | A vertical face, so it takes a grazing change rather than a full one |
| Ground | The ordinary case |
| Under cover | Takes no cloud shadow at all — the cloud is above the roof, not above the floor |

Measured on the demo map that ships with this plugin, in a storm sky: the deepest point on the
water loses **59.4%** of its light, the roof **57.8%**, the grass beside it **52.8%**, and the cliff
face **33.2%**.

## The demo map

`Demo/` contains a complete working map you can drop into a project to see the plugin running
immediately — it is the exact map every screenshot on the store page was taken on.

- `img/parallaxes/Cloudshadow_Demo.png` — the painted background
- `img/tilesets/Cloudshadow_Demo_A1..E.png` — a **fully transparent** tileset
- `data/Map_Cloudshadow_Demo.json` — the map
- `data/Tileset_Cloudshadow_Demo.json` — the tileset record

To install it: copy the two `img/` folders into your project, append the tileset record to your
`data/Tilesets.json` (it takes the next free id), set `tilesetId` in the map file to that id, and
save the map as the next free `MapXXX.json` with a matching `MapInfos.json` entry.

**Why the tileset is transparent.** The map's picture comes from the parallax; the tiles exist only
to tell the plugin which cells are water, which are roof, which are cliff and which are ground. It
is a working demonstration of a real technique — if you parallax-map, you can lay a transparent
classification layer over your art exactly like this and Cloudshadow will read it.

---

## Parameters worth knowing

| Parameter | What it does |
| --- | --- |
| **Surface responses** | How much each kind of surface changes when it loses skylight. The defaults are the designed look; override per project. |
| **Wind degrees** | Fix the wind direction, or leave it at −1 to let each map keep its own. |
| **Intensity** | Scales the whole effect. Raise it for a stylised look, lower it for subtlety. |
| **Interior mode** | `auto` opts a map out when almost none of it is open to the sky. |
| **Sky variable** | The id of a variable you drive from your own weather system. Blank or 0 means unused. |
| **Terrain tag for "no sky"** | Mark tiles that are under cover but are not roof tiles. |

## Plugin commands

Set the sky, hold it, release it back to derivation, and set the wind. Everything is optional —
the plugin runs with no commands at all.

---

## Performance

Measured with the factory's frame gate over 600 frames × 3 runs, on the heaviest sky:

- The update half of the frame stays **well inside its 2 ms budget** on every run measured, and its
  p99 well inside the 4 ms one — a storm costs a handful of uniform writes, not a redraw
- **10** draw calls per frame · **0** texture uploads · **0** bitmap dirties
- **0** display-object growth — the per-frame path allocates nothing
- **0 of 600** frames over the 16.67 ms frame budget, on all three runs

The counts above are exact and deterministic. The timings are quoted as the budget they clear rather
than as one run's mean, because the mean of that half moves several percent run to run on shared
hardware: a number printed to three decimals here would be stale the next time anyone measured it.

The cloud field is baked once per sky into a small tiling sheet and scrolled; the surface data is
baked once per map. Nothing reads pixels back from the GPU while you play.

## Saving

The weather is saved and resumes where you left it. Save files made before installing the plugin
load normally.

---

## ⚠️ Compatibility — the question you actually have

**Tested against RPG Maker MZ with the stock scripts unmodified**, verified by running the plugin
in the real engine rather than only in tests.

**Plugin Manager order:**

1. `CloudshadowCore.js` — [CSAF] Cloudshadow core: the sky field and the shadow it throws. Install with Cloudshadow.js.
2. `Cloudshadow.js` — [CSAF] Cloudshadow: weather that throws a real shadow across your map, derived from the map itself.

**Core methods extended — 5 by saved-original prototype extension, *none replaced*:**
`Game_System.prototype.initialize`, `Game_System.prototype.onAfterLoad`,
`Spriteset_Map.prototype.createLowerLayer`, `Spriteset_Map.prototype.update`,
`Spriteset_Map.prototype.destroy`.

Because nothing is clobbered, Cloudshadow co-exists with other plugins that patch the same seams,
including large suites such as VisuStella MZ Core Engine.

**It appends one filter** to the map's existing filter chain rather than replacing it, so overlay,
fog and lighting plugins that add their own filters keep working. If another plugin takes the
filter array over wholesale rather than appending to it, load Cloudshadow after it.

---

## AI disclosure

The code and the graphics in this product were produced with AI assistance. No sounds and no
authored narrative text ship with it.

## Licence

See `LICENSE.txt`. Short version: use it in unlimited games, commercial or free, keep all your
revenue, modify it freely — just do not resell or republish the plugin itself.

Copyright © 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
