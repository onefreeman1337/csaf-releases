# Facet — every gem is cut and lit — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Facet — every gem is cut and lit  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/facet  
**Docs published:** 2026-11-05


---

# Facet — every gem is cut and lit

**For RPG Maker MZ.** Version 1.0.0
© 2026 Core Systems Asset Factory

Every gem, ore, crystal and socket-stone in your database is drawn as a **cut,
lit stone**: real facet geometry, per-facet reflectance under one fixed light,
body colour that deepens with the distance light travels through the stone, and
an inclusion that makes each one an individual.

**No PNG. No atlas. No icon sheet.** This package is five JavaScript files. Every
stone you see is computed from the item's own name and price.

---

## Install

1. Copy the five files from `js/plugins/` into your project's `js/plugins/`.
2. In the Plugin Manager, add them. The order that reads most sensibly is:

   1. `FacetRender.js`
   2. `FacetCorpus.js`
   3. `FacetLapidary.js`
   4. `Facet.js`
   5. `FacetTray.js` *(optional — the tray scene)*

   **Nothing depends on that order.** Every file resolves its siblings the first
   time it needs them rather than when it loads, so the plugin works in any
   order, including backwards. This is tested: `loadorder` runs the whole product
   in five different orders and requires the identical stone out of each.

3. That is the whole installation. There is nothing to configure to see it work.

---

## What it does with your database

Facet reads `$dataItems`, `$dataArmors` and `$dataWeapons` and decides three
things about every entry it claims.

### Is this a stone?

An entry is claimed when its **last word** names one — `Guard Stone`, `Ruby`,
`Fire Opal`, `Crystal Cluster` — or when the last word is a compound whose front
half is a word the plugin understands, so **`Firestone` and `Bloodstone` are
claimed and `Whetstone` and `Tombstone` are not**.

The last word decides, because in English the material comes first and the noun
comes last: **`Stone Flail` is a flail**, not a gem.

You are never stuck with the guess:

| note tag | effect |
| --- | --- |
| `<facet>` | always treat this entry as a stone |
| `<facet:none>` | never treat this entry as a stone |

### Which mineral?

1. **The name, if it says one.** `Amethyst Shard` is an amethyst. Always.
2. **Otherwise the element it implies** — `Tideglass Shard` is a water stone,
   `Emberdrift Ore` is a fire stone — or the entry's own damage element.
3. **Then a stable hash of the item picks a member of that family**, so six fire
   gems become six different stones rather than one stone six times.

### Which cut?

The entry's **price** sets a centre of gravity, anchored to *RPG Maker's own
database* rather than to our taste — the thresholds are read off the prices MZ
itself ships. A cheap ore comes out uncut; a treasure comes out as a brilliant.
Within a tier, the item picks its own cut, so a run of similarly-priced gems
still spreads.

Real lapidary is honoured in both directions: an **opaque** mineral below the top
tiers is cut as a **cabochon**, and a **transparent** stone at a grand price is
never domed.

Override any of it:

```
<facet:cut=emerald>        <facet:species=sapphire>
<facet:inclusion=rutile>   <facet:mount=socket>
```

---

## Using it

### The tray scene

Plugin command **FacetTray → Open the tray**, or `SceneManager.push(Scene_FacetTray)`.

Shows every stone your database defines, with the selected one inspected at size
beside its measurements.

### Script calls

```js
$gameSystem.facet().isStone(item)          // does Facet claim this entry?
$gameSystem.facet().stoneFor(item)         // the resolved stone
$gameSystem.facet().bitmapFor(item, 96)    // a cached 96px Bitmap of it
```

`bitmapFor` is the one you want for your own UI. It **caches**, so calling it
every frame is safe — the stone is drawn once and blitted thereafter.

---

## What is in the corpus

| axis | count |
| --- | --- |
| cuts | **13** — brilliant, cushion, marquise, pear, heart, princess, trillion, emerald, baguette, table, rose, rough, cabochon |
| minerals | **16**, each with its own published refractive index, dispersion and absorption |
| inclusions | **7** — clean, rutile silk, garden, feather, colour zoning, asterism, chatoyancy |
| settings | **5** — loose, in the palm, bezel, claw, socket |

13 × 16 = **208 base stones** before inclusions and settings.

The cuts are **four genuinely different facet topologies**, not one shape with a
varying vertex count — a brilliant's kites and stars, a step cut's concentric
rectangles, a rose's dome of triangles with no pavilion at all, and unpolished
rough. The cabochon has no facets and is shaded by a separate path entirely,
which is why asterism and chatoyancy can exist.

---

## Why the stones look like stones

A gradient can only say *"this object is round and shiny"*. Four optical facts
are what make a viewer read **gem**, and each is computed rather than painted:

- **Light enters the table, reflects off the pavilion and comes back up**, which
  puts a dark/bright pattern *inside* the outline. A gradient cannot, because the
  pattern is not radial.
- **Facets shallower than the critical angle leak instead of reflecting.** The
  critical angle is `asin(1/n)` from the mineral's refractive index — so a
  diamond and a quartz cut identically still look like different materials.
- **Body colour follows the path length**, so pavilion facets read deeper and
  more saturated than crown facets.
- **Dispersion splits the highlight by wavelength** — big on diamond, near zero
  on amethyst, using the published values, so which stones throw fire is a
  physical fact rather than a preference.

---

## Compatibility

**Tested alongside:** the stock RPG Maker MZ scripts and database, in the real
engine, on a clean project.

**What it does to the engine, measured from the shipped source:**

- **Extends 1 core method**, saving the original first:
  `Game_System.prototype.initialize`
- **Adds 1 new method** the engine does not define: `Game_System.prototype.facet`
- **Replaces nothing.** Zero core methods are clobbered.

That is the whole footprint. `FacetRender.js`, `FacetCorpus.js`,
`FacetLapidary.js` and `FacetTray.js` touch **no core prototype at all**.

**Saves:** Facet writes **nothing** into your save file. Every stone is derived
from the database entry, so there is no state to migrate, nothing to corrupt, and
a save made with the plugin loads fine without it.

**Performance:** a stone is drawn once into a cached Bitmap and blitted
thereafter. The tray scene measures **2 draw calls per frame** and adds **zero**
display objects per frame under a 600-frame gate.

**The tray scene contains no `Window_Base`**, so it cannot show a windowskin —
which is also why it will not inherit your window theme. It is deliberately its
own look.

---

## Determinism

`Math.random()` appears nowhere in this plugin. Every stone is seeded from the
item's own name, id and price, so **the same database cuts the same stones
forever** — your screenshots reproduce, and so does your players' experience
across saves.

---

## Support

Questions, or a database that produces a stone you think is wrong? Contact
through the original point of purchase, and include the item's name and price —
that is all Facet uses, so it is all that is needed to reproduce.

Licence terms: see `LICENSE.txt`.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
