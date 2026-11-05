# Quires — every book in your project binds itself — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Quires — every book in your project binds itself  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/quires  
**Docs published:** 2026-11-05


---

# QUIRES — every book in your project binds itself

**RPG Maker MZ · Core Systems Asset Factory**

Quires reads whatever lore entries, skill books, journals, registers and quest documents your
project already defines, and renders each one as a **closed, bound volume**: boards and covering
chosen from what the book is, raised spine bands counted from its length, blind- or gold-tooling
composed from what it is about, furniture from its value, edge decoration, and wear from its
station in life.

Then it shelves them all in a case with a bookseller's collation card.

**You do not tag anything.** The name and the price your database already carries are the input.

---

## Install

1. Copy the six files from `js/plugins/` into your project's `js/plugins/` folder.
2. Turn all six on in the Plugin Manager.
3. Add the plugin command **Quires → Open the case** to an event.

That is the whole installation.

**Order does not matter.** Every file resolves its siblings the first time it needs them rather
than when it loads, so any order the Plugin Manager gives you works — including the alphabetical
order you get by dragging the folder in, which puts `QuiresBind.js` before everything it depends
on. Both the test suite and the in-engine verification run in exactly that order on purpose.

The order below simply reads sensibly in the list:

1. `QuiresRender.js` — drawing and colour primitives
2. `QuiresCorpus.js` — the binding vocabulary
3. `QuiresDevices.js` — the nineteen tooling devices
4. `QuiresBind.js` — the classifier
5. `QuiresVolume.js` — the volume renderer
6. `QuiresScene.js` — the case scene and the plugin command

---

## What counts as a book

Quires binds a database entry whose **name** says it is a book. Both English shapes are handled:

- the book noun **last** — `Field Journal`, `Harbour Ledger`, `Royal Atlas`, `Stone Tome`
- the book noun **first, before a preposition** — `Psalter of the Quiet Hours`,
  `Treatise on Coastal Winds`, `Lexicon of Old Roots`, `Chronicle of Verse`

A book noun followed by an ordinary noun is a **modifier, not a head**, so `Tome Cutter` is a
blade and stays out of the case. So does `Ledger Key` and `Journal Case`.

It reads **Items, Armors and Weapons** — a great many projects model a tome as armour or a
spellbook as a weapon, and a case that only read Items would silently drop them. Each table can be
switched off in the plugin parameters.

### Note tags, when you want to override it

```
<quires: none>              never bind this entry, whatever its name says
<quires>                    bind it even though its name says otherwise
<quires: covering=goat>     force the covering
<quires: motif=anchor>      force the tooled device
```

Covering ids: `calf` `goat` `pig` `vellum` `buckram` `velvet` `shagreen` `parchment` `limp`
`wrapper`.
Device ids: `vine` `acorn` `thistle` `wheat` `keys` `chalice` `lamp` `anchor` `shell` `dolphin`
`quill` `scroll` `seal` `sword` `shield` `banner` `anvil` `alembic` `gear`.

---

## How a binding is decided

| what it reads | what it decides |
| --- | --- |
| words in the **name** | the FAMILY — devotional, scholarly, ledger, field or treasure |
| the **price** | the TIER, and the tier decides how rich the tooling is |
| words in the name and **description** | the SUBJECT, and the subject decides which device is struck |
| the **description's length** | how thick the book is, and how many raised bands its spine carries |

The tier thresholds are read off **RPG Maker's own shipped item prices** — Magic Water 300,
Potion 500, Super Potion 1500 — rather than numbers we chose, so a book priced like a potion is
bound like an ordinary book and a book priced like a relic is not.

The family chooses which coverings are in play and the magnitude chooses within it, so a project
with six lore entries gets six different books rather than one book six times.

---

## What it can make

| axis | count |
| --- | --- |
| covering materials, each with its own grain | 10 |
| board shapes | 6 |
| spine treatments | 6 |
| tooled devices | 19 |
| furniture fittings | 8 |
| edge treatments | 5 |

10 × 6 × 6 = **360 base volumes** before tooling, furniture, edges and wear.

**There is no PNG and no atlas anywhere in this plugin.** Every leather grain, every raised band,
every gold-tooled device and every clasp is drawn from paths at whatever size it is asked for. The
same code draws a 90px book on the shelf and a 420px book on the card.

---

## It is not a reader

Quires never opens a book. The object is the **closed volume** — what it looks like on the shelf,
in a shop window, in a reward screen, in a collection.

If you want your players to READ the text inside, use a reader plugin; several good free ones
exist, and Quires does not compete with them. Point your reader at the same entry and you have
both halves.

---

## Save safety

**Quires writes nothing into your save file.** Every binding is derived from the database entry
each time it is needed, so:

- a save made with Quires installed loads correctly **without** it,
- there is no save migration to get wrong when you update,
- adding or renaming an item re-binds it immediately, with no stale cache.

Verified in the engine: opening the case does not change the save contents at all, and the word
`quires` appears nowhere in a save.

---

## Compatibility

**It patches no core RPG Maker method.** Not one. There is nothing of anyone else's for it to
collide with, and nothing of the engine's for it to break.

The case scene extends `Scene_Base` rather than `Scene_MenuBase`, so it creates no windows and no
touch-UI buttons of its own, and it uses its own typography rather than the engine's default font.

Tested against RPG Maker MZ with the stock scripts unmodified, verified by running in the real
engine rather than only in tests.

---

## Deterministic

The same database binds the same books forever. Nothing here calls `Math.random`; every binding
comes from a hash of the entry's own name, so a book keeps its binding when you insert an item
above it, and a screenshot you take today reproduces tomorrow.

---

## Licence

See `LICENSE.txt`. Short version: use it in as many commercial and non-commercial RPG Maker
projects as you like, including projects you sell. Do not resell or redistribute the plugin files
themselves.

---

## Support

Questions, bugs and requests: <https://csaf.itch.io/quires>

*Core Systems Asset Factory*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
