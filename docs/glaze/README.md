# Glaze — every consumable is thrown its own vessel — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Glaze — every consumable is thrown its own vessel  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/glaze  
**Docs published:** 2026-11-05


---

# Glaze — every consumable is thrown its own vessel

**For RPG Maker MZ.** Reads your item database and generates a piece of pottery for every
consumable, reagent and container in it. Nothing ships as a PNG.

---

## Install

Copy the four files into `js/plugins/` and enable them in the Plugin Manager:

1. `GlazeRender.js`
2. `GlazeCorpus.js`
3. `GlazeVessel.js`
4. `Glaze.js`

**That order is a recommendation, not a requirement.** Every file resolves its siblings the first
time it needs them rather than when it loads, so the plugin works in any order — including the one
the Plugin Manager gives you if you drag the files in backwards.

That is it. There is no setup step and no configuration you have to do before it works: turn it on
and your potions are pots.

---

## What you get

**Fourteen wheel profiles × twelve glazes = 168 distinct vessels**, before stoppers, kiln marks and
surface behaviour are counted.

The **shape** comes from what an item *is*:

| your item | the pot it gets |
| --- | --- |
| a big healing draught | a round-bellied **flask** |
| an ether or a small tincture | a tall narrow **phial**, corked and wax-capped |
| an antidote or a cure | a small lugged **ampulla** |
| a buff or a tonic | a waisted **gourd** |
| something that damages | an **alembic** with a condenser arm |
| a party-wide restorative | a **krater** on a stem foot |
| a bulk reagent | a squat **jar** with a cloth tied over the mouth |
| a tome or a stat-up | a broad-shouldered **meiping** |
| a non-consumable container | a refractory **crucible** |

The **size** comes from how much is in it — and so does the form. Each kind above is a *family* of
three vessels rather than one, and an item's magnitude chooses within it, so a modest draught and a
great restorative are different pots and not one pot at two sizes:

| | small | standard | great |
| --- | --- | --- | --- |
| single-target healing | beaker | flask | jar |
| party-wide restorative | ewer | krater | amphora |
| mana | phial | ewer | amphora |
| cures | ampulla | flask | ewer |

Magnitude is read from whatever the item actually declares — HP or MP recovered, the constant in a
damage formula, TP gained — and falls back to price when it declares nothing. The thresholds are
anchored to MZ's own vendor database, so a stock **Potion** is standard, a **Super Potion** and a
**Full Potion** are great, and a cheap herb is small.

The **glaze** comes from what it *does*: a fire item is fired in copper red, ice in celadon, thunder
in metallic lustre, water in alkaline turquoise, a cure in crackled raku white, a healing draught in
oxblood *sang de boeuf*.

And every pot is **signed on the foot**. One of eight kiln marks — bar, cross, chevron, ring, three
dots, wave, notch, star — is struck into the bare clay of the base, cut *into* the body rather than
drawn on it, and the catalogue plate shows the impression the way a ceramics catalogue shows a base.

Nothing here is a recolour. Each glaze has its own **behaviour**: tenmoku breaks rust at the rim and
pools thick and black at the foot, hare's fur streaks vertically, oil spot carries discrete silvered
spots, wood ash runs and drips, raku crazes into a fine network with smoke in the cracks.

---

## The part that makes it look like pottery

Every pot is drawn as a **surface of revolution with a real lighting model** — the highlight sits at
its correct angular position at every height, so a narrow neck and a wide belly are lit like parts of
one round object rather than like a flat shape with a stripe on it.

And the glaze behaves like a liquid that was fired until it flowed: it **runs down the pot, stops
short of the foot, and beads where it stops**, leaving raw clay below a wavy line with a few drips
hanging past it. That is the detail a flat coloured bottle can never have.

---

## Options

| parameter | what it does |
| --- | --- |
| **Read the item database** | On by default. Turn it off to generate only the items you list under Overrides. |
| **Include key items** | Off by default — most key items are not pots. |
| **Replace item icons** | Draw the vessel wherever an item name is drawn: inventory, shop, battle. |
| **Icon detail multiplier** | Supersampling for the small icon. `2.0` is the sweet spot. Higher costs memory, not frame time. |
| **Overrides** | Pin any item to a specific profile and glaze. Overrides always win. |

The automatic reading is a starting point, not a cage. Pick the pots yourself for the items you care
about and let the plugin handle the long tail.

## Plugin commands

- **Open the vessel plate** — one item's pot at full size, with its form, glaze, surface and kiln
  mark set as a museum catalogue entry.
- **Open the shelf** — everything the party is carrying, standing on shelves.

---

## Compatibility

**Tested alongside stock MZ scripts and with the VisuStella MZ Core Engine present.**

This plugin **extends** three core methods and **clobbers none** — each original is saved and called:

```
Window_Base.prototype.drawItemName
Scene_Boot.prototype.start
Game_System.prototype.initialize
```

- **No per-frame cost.** A vessel is composed once into a `Bitmap` and blitted from cache after
  that. Composition happens on a scene transition or the first time an item is drawn, never in an
  update loop.
- **Save-safe and versioned.** A save made before you added the plugin loads normally, and so does a
  save made by a *newer* version of it. Removing the plugin from a project that used it also works.
- **Deterministic.** No `Math.random()` anywhere — the same item always draws the same pot, so your
  screenshots and recordings are reproducible.
- **Its own typography.** Nothing reads `$gameSystem.mainFontFace()`, and no `Window_Base` appears in
  either scene, so neither screen looks like stock RPG Maker.

If another plugin also patches `drawItemName`, load order decides who draws the icon. Put Glaze
**after** it to win, **before** it to defer.

---

## Terms

Use it in unlimited games, commercial or free, forever. Keep 100% of your revenue. Modify the source
for your own projects. **Do not resell or redistribute the plugin itself.** Full terms in
`LICENSE.txt`.

---

**Core Systems Asset Factory** · <https://csaf.itch.io>

*Made with AI assistance: code yes, graphics yes, sounds no, text and dialog no.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
