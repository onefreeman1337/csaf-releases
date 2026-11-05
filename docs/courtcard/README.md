# Courtcard: Generated Card Art for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Courtcard: Generated Card Art for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/courtcard  
**Docs published:** 2026-11-05


---

# Courtcard — every card in your deck, drawn by the plugin

**RPG Maker MZ · nine plugin files · no image assets**

Courtcard draws the **face of every card in your game**, from the data you already have. A card is a
made object: a stock, a frame with worked corners and ornament bands, a central charge composed from
what the card actually does, a suit and cost rail, a nameplate that sets your own title text, and a
foil, edge and wear pass on top.

There is no PNG in this package, no atlas and no icon sheet. Every mark you see is geometry drawn at
run time, so a card is sharp at any size you ask for.

---

## Install

1. Copy the nine files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and switch all nine on.
3. Use the plugin command **Open the deck viewer**, or call `CourtcardScene.open('skills')`.

**Load order does not matter.** Every file resolves the others the first time it needs them rather
than when it loads. That is tested rather than hoped for: the headless suite, the store-plate
renderer, the capture pipeline and the in-engine verification all load the nine files
**alphabetically** — the exact order you get by dragging them in, and the worst case for a plugin
that captures its siblings at load, because it puts `CourtcardCard.js` first and the
`CourtcardScene.js` that drives it last. The in-engine run then asserts all nine resolved anyway.

Nothing else is required. There is no configuration step, no database setup and no per-card
authoring: point it at a project and it reads what is already there.

---

## What decides a card's face

Four things, and every one of them is read from your own database.

**The type decides the CHARGE — the central object.** Twelve builds, each composed rather than
picked from a sheet:

| build | what it draws |
| --- | --- |
| **strike** | a blade driving down, with an impact scatter under its point |
| **guard** | a tower shield with a boss and bracing |
| **spell** | an open hand, sigil breaking at the fingertips |
| **summon** | a horned arch, something rising through it |
| **curse** | a knot pulled tight around a shaft, loose ends falling |
| **mend** | a vessel tipped to pour into a shallow bowl |
| **trap** | a sprung jaw at an angle, its line taut |
| **aura** | a censer hanging on chains, vapour rising |
| **relic** | a stepped plinth carrying a broken object |
| **beast** | a print with claw and heel |
| **rush** | a spurred boot, motion trailing behind the heel |
| **ruin** | a leaning column snapped through, drums scattered at its foot |

**The element CUTS that charge.** This is structural, not a tint — the cut is clipped to the
charge's own masses, so it belongs to the object rather than sitting on top of it:

| element | cut |
| --- | --- |
| **ember** | flame tongues licking up off the charge's top edge |
| **frost** | straight facet chords cut across the inside |
| **storm** | a forked crack splitting it from one edge |
| **stone** | bedding layers banded through it |
| **gale** | a stream escaping to the right |
| **radiance** | a pierce running through, rays escaping the holes |
| **umbra** | the charge dissolving, detached flakes falling away |
| **venom** | drips gathering and falling from the bottom edge |

**The rarity decides how much WORK the object carries** — the frame construction, the rail count,
the corner treatment, the foil and the pip rail all change together, so a player reads standing at a
glance before reading a word. Five ranks: common, uncommon, rare, epic, legendary.

**The deck decides the STOCK.** Six, and the whole palette re-solves against each one — paper, rail,
ink, relief, foil direction and the engraved shading. There is no light version and dark version and
no per-deck special case anywhere in the renderer:

`courtly` cream laid paper, vermilion · `grim` grey stock, oxblood · `verdant` sage, green ·
`abyssal` near-black wove, teal · `gilded` ivory, gold leaf · `ashen` bleached, rust

---

## How much is in it

| | |
| --- | --- |
| device builds | **12** |
| element cuts | **8** |
| charges (build × cut) | **96** |
| card faces before the deck palette (build × cut × rarity) | **480** |
| stocks | **6** |
| back designs | **6** |
| pip glyphs | **8** |

**What that resolves to on a real project, measured on the unmodified Blank Project:** 235 stock
skill rows produce **164 distinct faces (69.8%)** and 76 distinct charges, covering 11 of 12 builds,
8 of 8 elements and 5 of 5 rarities. 30 stock item rows produce 24 distinct faces (80%).

⚠️ **Cards that do the same thing at the same magnitude land on the same face, and that is the
product being truthful** rather than a defect — two identical restoratives are siblings by design.
Where two rows differ in a way a player is supposed to see, they differ on the card.

---

## Reading your data

Tag a skill or item explicitly with a note tag:

```
<courtcard rarity:epic type:strike element:ember>
```

Keys are `rarity`, `type`, `element` and `cost`, written `key:value` and separated by **spaces**, in
any order. State only the ones you care about — anything you leave out is classified for you.

Anything you do not tag is **classified** from the row itself — its damage type and element, its
scope, its cost, its icon, its parameters. That classifier is the point: a finished project has
hundreds of rows and nobody wants to tag them all. Both paths are exercised in the shipped
verification, on purpose — the demo database leaves 137 of 149 rows untagged.

---

## Plugin commands

| command | what it does |
| --- | --- |
| **Open the deck viewer** | opens the viewer on `skills`, `items`, or `both` |
| **Set the deck** | overrides the stock, saved with the game |
| **Clear the deck override** | returns to the plugin's default stock |

## Parameters

| parameter | default | meaning |
| --- | --- | --- |
| `deck` | `courtly` | which stock to print on |
| `source` | `skills` | what the viewer lists |
| `handling` | `0.10` | how worn the cards are, 0 to 1 |
| `cardWidth` | `0` | **0 fits the screen automatically.** Set a pixel width to override |

`cardWidth: 0` solves the grid against your resolution: it tries every plausible column and row
count and takes the largest card that still shows a full page. At 816×624 that is eight cards at
171×239.

---

## Compatibility

**It patches no core RPG Maker method at all.** `Scene_Courtcard` is a new scene extending
`Scene_Base`, so there is no window layer and nothing of anyone else's to collide with — including
large plugin suites. The one piece of state it keeps (your chosen deck) is a plain property on
`$gameSystem` with a schema version beside it, so it round-trips through save and load and an older
save migrates rather than breaking.

`CourtcardScene.js` is the only file that touches the engine. The other eight are a corpus, a
classifier, a colour model, a frame builder, a device corpus, a pip alphabet, a foil model and a
card compositor, and none of them knows RPG Maker exists. Switch `CourtcardScene.js` off and nothing
is patched.

**Tested in the real MZ runtime**, not only in headless tests: the scene draws with **0 stock windows
and 0 stock buttons** in its display list, at 2 draw calls per frame with zero display-object growth.

---

## Licence

See `LICENSE.txt`. In short: ship as many games with it as you want, keep 100% of your revenue, and
the card images it draws inside your game are yours. Just do not resell the plugin itself.

---

## Disclosure

This plugin's code and its store artwork were produced with AI assistance. It was verified by running
it in the real RPG Maker MZ runtime.

Copyright © 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
