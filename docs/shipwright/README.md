# Shipwright — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Shipwright  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/shipwright  
**Docs published:** 2026-11-05


---

# Shipwright — every ship is drawn from her name

**For RPG Maker MZ.** Version 1.0.0
© 2026 Core Systems Asset Factory

Every vessel your project names is drawn as a **shipwright's draught**: a hull
lofted from real naval parameters, a rig built spar by spar, planking, wales,
gunports, shrouds and ratlines, paintwork, and the fouling and battle damage of
a ship that has been somewhere.

**No PNG. No atlas. No sprite sheet.** This package is six JavaScript files.
Every line you see is computed, and the same name gives the same ship forever.

---

## Install

1. Copy the six files from `js/plugins/` into your project's `js/plugins/`.
2. In the Plugin Manager, add them. The order that reads most sensibly is:

   1. `ShipwrightRender.js`
   2. `ShipwrightCorpus.js`
   3. `ShipwrightHull.js`
   4. `ShipwrightPortrait.js`
   5. `ShipwrightBind.js`
   6. `ShipwrightScene.js`

   **Nothing depends on that order.** Every file resolves its siblings the first
   time it needs one rather than when it loads, so the plugin works in any
   order — including the alphabetical order you get by dragging the folder in,
   which is the order that breaks most multi-file plugins.

3. That is the whole installation. There is nothing to configure to see it work.

---

## Show a ship

One plugin command:

```
Plugin Command -> ShipwrightBind -> ShowPortrait
    name: Ptarmigan
```

That is it. The draught board opens, the sheet inks in, and the title block
fills with her class, rig, era, paintwork and condition.

Any name works. You do not define ships anywhere — the name **is** the
definition.

---

## What it does with your project

Shipwright reads, in this order:

1. **A roster you declare** in the plugin parameters, if you want direct control
   over a particular vessel — her class, rig, paint and history.
2. **MZ's own vehicles.** `$dataSystem.boat`, `.ship` and `.airship` already
   have names; Shipwright will draw them.
3. **Anything else you pass by name.** A ship that appears once in a cutscene
   needs no setup at all.

For a name it has never seen, every property is derived from the name itself by
a stable hash. `Ptarmigan` is a tarred age-of-sail frigate under a three-masted
barque rig, under full canvas, newly launched — and she will be that ship in
every save, on every machine, forever.

Rename her and you get a different ship, and the difference is not subtle:
`HMS Ptarmigan` is a salted medieval great hulk under a single square sail in
chequered paint. That is the system working as intended rather than a quirk —
the name is the whole specification, so two names are two vessels.

---

## What it can draw

| axis | count | what changes |
| --- | --- | --- |
| Hull classes | 16 | the OUTLINE — sheer, rake, forefoot, stern form |
| Rig plans | 10 | square, gaff, lateen and lug are different pictures |
| Paint schemes | 8 | hull, wale, trim and canvas, each solved for contrast |
| Weathering states | 5 | fouling at the waterline, patched strakes, shot holes |
| States of canvas | 5 | full, topsails only, reefed, storm canvas, bare poles |

**44 distinct authored things**, and they are things rather than numbers: a cog
is not a recoloured frigate, it is a different hull with a straight raking stem,
a stern rudder and a tiller. A longship carries a row of shields along her
gunwale, a carved stem head and a steering oar on the quarter. A carrack has
castles fore and aft with railed tops.

Those five axes combine into 32,000 vessels, which is arithmetic and not the
point. The point is the 44.

---

## The part that matters if you have a fleet list

**Every detail is dropped at the size it stops being readable, and the size is
measured rather than chosen.**

The gap two lines can leave between them and still read as two lines was
measured on this renderer — it is 2.6 pixels of paper, and it is a number of
pixels rather than a ratio, because a ratio that looks right on a thick line is
too tight on a thin one. Every repeated feature derives its own count from that
floor.

So a vessel drawn 64 pixels long is a small ship, not a smear:

| length on deck | what resolves |
| --- | --- |
| 16 px | masts |
| 38 px | sails |
| 97 px | shrouds and ratlines |
| 150 px | wale, gunports, planking, quarter gallery |
| 158 px | shield rows |
| 250 px | channels |
| 259 px | steering gear |
| 500 px | figurehead |

Draw her in a list at 64 px and in a portrait at 500 and it is the same ship,
honestly drawn at both.

---

## She cannot come out impossible

A rig is chosen by the hull's **era and size**, not by chance. A two-decked
frigate with a full gunport row cannot come out ketch-rigged. A Viking longship
cannot come out as a three-masted full-rigged ship. A class that carries no guns
gets no gunports — the first draft put eleven of them on a longship, which was
arithmetically correct and absurd.

---

## Compatibility

- **RPG Maker MZ**, any version. Nothing here touches an MV-only API.
- **VisuStella MZ Core Engine** — compatible. Shipwright's scene extends
  `Scene_Base` directly and creates no windows at all, so there is nothing for a
  core engine's window rewrites to collide with.
- **Any other plugin.** Shipwright replaces no engine method. It adds one scene,
  one plugin command and one namespace (`CSAF.Shipwright`). Every function it
  defines is new.
- **Save files.** Shipwright stores nothing in the save. There is nothing to
  migrate, and adding or removing it mid-project cannot corrupt a save.
- **Load order.** Any. See Install.

---

## Performance

Measured in the real MZ runtime over 400 frames, twice:

- **2 draw calls per frame** while the board is open
- **0 texture uploads, 0 bitmap dirties, 0 window refreshes, 0 windows drawn**
- **display objects: 2, growth 0** — nothing accumulates while the scene runs
- update half: 0.013 ms mean, 0.1 ms p99

The board is drawn once to a bitmap and then it is a single sprite. It costs
nothing to leave open.

> These are frame **costs**. They are not a claim about presented frame rate,
> which cannot be measured in an automated browser at all.

---

## Two things worth knowing

**The reveal is a clip rectangle, not a timer.** The draught inks in from a
value you can set directly, so if you want it instant, or want to drive it from
your own event, you can.

**No `Math.random` anywhere in the drawing.** Every vessel comes from a seeded
generator keyed on her name. This is what makes the same ship the same ship, and
it is enforced by a test that replaces the generator with `Math.random` and
requires the suite to fail.

---

## Files

| file | what it is |
| --- | --- |
| `ShipwrightRender.js` | drawing primitives, colour solving, type |
| `ShipwrightCorpus.js` | the hulls, rigs, schemes, weathering and canvas states |
| `ShipwrightHull.js` | naval architecture — lofting, spars, the resolution floor |
| `ShipwrightPortrait.js` | the vessel itself |
| `ShipwrightBind.js` | binding a name to a ship, and your roster |
| `ShipwrightScene.js` | the draught board |

All six ship as raw, readable, commented JavaScript. Nothing is minified and
nothing is obfuscated — if you want to change how a hull is lofted, the
parameters are named the way a draughtsman names them and the reasoning is in
the comments.

---

## Licence

See `LICENSE.txt`. Short version: use it in as many games as you like,
commercial or free, keep all your revenue, never resell the plugin itself.

## Support

Through the store page you bought it from.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
