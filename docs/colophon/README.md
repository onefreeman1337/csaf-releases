# Colophon — A Save Screen for RPG Maker MZ That Prints What Is In The File — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Colophon — A Save Screen for RPG Maker MZ That Prints What Is In The File  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/colophon  
**Docs published:** 2026-11-05


---

# Colophon — a save screen that prints what is in the file

**RPG Maker MZ · five plugin files · no image assets · raw readable JavaScript**

A colophon is the printer's inscription at the end of a book: the device, the
place, the date, the hand that made it. Colophon replaces MZ's save and load
screens with a **shelf of printed leaves** — one leaf per slot, each one composed
from what that save actually contains.

None of it is a PNG. There is no atlas, no sprite sheet and no image file in this
package at all. Every leaf is drawn by code, at whatever size the shelf asks for.

---

## The claim, stated exactly

Plenty of plugins improve the save screen, and several are very good. Every one
of them shows you a **screenshot**, a **row of faces**, or **a picture you supply
yourself**.

**Colophon generates the picture from the save data.** That is the whole
difference, and it is the only thing this package claims.

> *Keep your save system. This is the part that draws what is in the file.*

---

## What a leaf is made of

Six things are read out of the save and each one drives part of the drawing.

| What you see | Read from |
| --- | --- |
| **The device** — the printer's mark struck in the middle | what the run has spent its time doing, and how far it has come |
| **The paper** — laid, wove, vellum, foxed, tinted, deckle, blotted, marbled | where the save was taken |
| **The binding** — the border, from unbound up to flowered | how far into the work the run is |
| **The handling** — foxing, thumbing, folds, a turned corner | playtime |
| **The house** — the ink and the letterform | your project's own vocabulary. One game prints in one house |
| **The register** — the small marks along the foot | who is in the party |

**45 authored entities**: 15 printer's devices (5 families × 3 progress
variants), 8 papers, 6 bindings, 5 states of handling, 6 register marks and 5
houses. They combine into far more leaves than that, but 45 is the number that
was authored one by one, and it is the one worth quoting.

### The device matures as the run does

The five families are **arms, wayfare, coin, dominion** and **lore** — a war
helm, a fingerpost, a banded coffer, a tower, an open book. The family says who
the run has been; the variant says how far it has come, rising from a plain
struck roundel, to a roundel with a motto scroll, to a scalloped cartouche with a
crest above it.

So the mark on a late save visibly outranks the mark on an early one.

---

## The thing this had to get right

The hard part of a save screen is not drawing. It is that **the six files a
player owns are usually six moments of the same run** — same party, same game,
an hour apart. A generator that keys off the party draws one picture six times.

So the axes that move *within* a single playthrough carry the weight: where you
stopped, how far in you are, how long you have played, and the device's own
progress variant. Party composition is deliberately given the smallest and least
dominant element on the leaf.

**Measured on a real six-save run, in the actual engine: six saves of one
playthrough produce six distinct leaves.** That test is in the package's
verification and it is the condition the product was allowed to ship on.

---

## Installation

1. Copy the five files from `js/plugins/` into your project's `js/plugins/`.
2. Turn all five on in the Plugin Manager.
3. That is the whole installation. Open the save or load screen and the shelf is
   there.

**Load order does not matter.** The files resolve each other on first use rather
than at load time, so dragging the folder in and letting the Plugin Manager sort
them alphabetically works — which puts the entry file *first*, before the four it
depends on. That is the order the tests and the in-engine verification actually
run in, because it is the worst case you can create by accident.

**Old saves work.** A file written before Colophon was installed has none of the
extra information in its header. Those leaves are drawn from what the stock
header does carry — the title, the playtime and the party size — and they print
as valid leaves rather than failing or inventing figures they do not know.

---

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| **Shelf columns** | 3 | How many leaves across. Two draws them larger. |
| **Shelf rows** | 2 | How many leaves down. |
| **Shelf tone** | `32,30,36` | The surface the leaves lie on, as R,G,B. The leaves take their own colour from the house. |
| **Shelf heading** | *(blank)* | Printed above the shelf. Blank uses the game's own title. |
| **Print the collation** | on | Prints LEVEL / FIELDS / PACES on each leaf. Off gives a plainer sheet. |

## Plugin commands

| Command | What it does |
| --- | --- |
| **Set chapter** | Records which book of the work the player is in. It is struck into the imprint of every leaf saved from then on. Takes the chapter and, optionally, the total. |
| **Set imprint** | Overrides the place line under the device — for a set piece where the map name is not the truth. |
| **Clear imprint** | Returns the imprint line to the map name. It leaves the chapter alone. |

---

## Compatibility

**Tested against RPG Maker MZ with the stock scripts unmodified**, verified by
running the plugin in the real engine and not only in tests.

Colophon **replaces five methods on `Scene_File`** — `create`, `start`,
`savefileId`, `isSavefileEnabled` and `activateListWindow` — and extends
`DataManager.makeSavefileInfo`, with the original saved and called so the stock
header survives intact underneath the added information.

Being plain about what that means:

* **Colophon will not co-exist with another plugin that also replaces
  `Scene_File`**, and whichever loads last wins. If you already run a save-screen
  plugin, you are choosing between them.
* The original methods **are** saved, so the stock behaviour can be restored.
* Nothing else in your project is touched. Four of the five files — the
  renderer, the corpus, the classifier and the compositor — do not know RPG Maker
  exists.

Your save files stay standard. Colophon adds a block to the header and never
removes or rewrites anything the engine put there, so turning the plugin off
leaves every existing save loadable.

---

## What is in the package

```
js/plugins/ColophonRender.js     drawing and colour primitives
js/plugins/ColophonCorpus.js     the 45 authored entities
js/plugins/ColophonReading.js    save file  ->  leaf specification
js/plugins/ColophonLeaf.js       leaf specification  ->  a drawn sheet
js/plugins/Colophon.js           the scenes, the parameters, the commands
```

Raw, readable, commented JavaScript. Nothing is minified and nothing is
obfuscated — the reasoning behind the drawing is written down in the source,
including the parts that were got wrong first.

---

## Licence

One licence per developer. Use it in as many of your own projects as you like,
commercial or free. You may modify it. You may not resell or redistribute the
source itself. Full terms in `LICENSE.txt`.

**Made by Core Systems Asset Factory.** Written with AI assistance — code and
graphics both, disclosed on the store page.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
