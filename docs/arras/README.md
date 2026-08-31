# Arras — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Arras  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-08-31


---

# Arras — the playthrough, woven

**For RPG Maker MZ.** Six plugin files, plain readable JavaScript, no dependencies.

Arras takes what your playthrough actually did — the switches you set, the variables you moved,
the victories and the choices — and weaves it into an embroidered frieze. A continuous
Bayeux-style hanging that grows as the game is played, that the player can open and scroll, and
that is different in every save file because it is made out of that save file.

Nothing in it is shipped art. Every figure, border, letter and thread is drawn by the plugin.

---

## What is in the box

| | |
| --- | --- |
| `js/plugins/` | the six plugin files |
| `LICENSE.txt` | the commercial licence (short version: ship as many games as you like) |
| `store_assets/` | the images from the store page, yours to reuse if you want them |

---

## Install

1. Copy everything in `js/plugins/` into your project's own `js/plugins/` folder.
2. Open the Plugin Manager and add all six.
3. That is the whole install. **Order does not matter** — every file resolves what it needs the
   first time it needs it, and the plugin is tested in the alphabetical order the Plugin Manager
   gives you when you drag the folder in. A recommended reading order is listed below purely
   because it reads sensibly.

---

## Making the hanging record something

There are three ways, and you only need one.

### 1. Watched switches — no scripting at all

Open **ArrasBind** in the Plugin Manager and add rows to **Watched switches**. Give each row a
switch and a line of text. The moment that switch turns ON, the act is woven.

    Switch: 24  ·  What happened: THE OATH AT ROVEN

If your project already has switches like "Chapter 3 complete", you have already done the work.

### 2. Watched variables

The same, on a variable reaching a value. Useful for "the fifth town liberated" or "reputation
passed 100".

### 3. The plugin command — `Arras ▸ Weave an act`

The explicit route. Call it from any event:

    Plugin Command  ArrasBind  ▸  Weave an act
      What happened : THE BURNING OF THE MILL
      Scene         : (choose from the words)

Leave the scene on **(choose from the words)** and Arras reads what you typed. "The oath at Roven"
is woven as an oath; "the burning of the mill" as a battle; "crossing the narrow sea" as a voyage.
If it recognises nothing, it still picks a scene — a stable one, derived from the act's own name,
so the same act always weaves the same way and no two unnamed acts land on the same picture.

### Showing it to the player

    Plugin Command  ArrasBind  ▸  Open the hanging

Left and right scroll. Page Up and Page Down jump a panel. Cancel closes it.

---

## What each act becomes

An act picks up four things, and they are FROZEN onto the act when it is woven:

- **a scene** — one of ten compositions: council, oath, march, battle, voyage, siege, works,
  feast, judgement, errand. Each casts three figures from a corpus of sixteen.
- **a border** — one of ten decorated registers, running above and below. The register follows
  what the act was: interlace for oaths and bargains, wyverns for peril, tillage for labour,
  fish and eel for anything that happened on water.
- **a ground** — bare linen, stacked ground lines, a worked mound, running water, or a tiled floor.
- **an inscription** — a Latin formula in the tapestry's own manner, followed by a raised point and
  the words you typed. `HIC CECIDERVNT IN PROELIO · THE BURNING OF THE MILL`.

**Why they are frozen:** so a future version of Arras cannot re-weave a hanging you have already
saved. If we add a scene next year, your existing acts keep the pictures they had.

---

## The lettering

The inscription is not set in a font. It is stitched, letter by letter, from stroke centrelines —
which is why it looks like thread and not like type, and why it cannot look like RPG Maker's
default font.

It is the **classical Latin alphabet: twenty-three letters.** There is no J, U or W, because Latin
has none. Arras folds your text automatically, exactly as the tapestries do:

    J → I        U → V        W → VV
    "Journey"  →  IOVRNEY          "Winterhall"  →  VVINTERHALL

That is not a limitation, it is the look. If you want a word to read a particular way, spell it the
way you want it stitched.

Numbers are Roman numerals, because a hanging with `Chapter 12` on it has a computer in it.

---

## Settings

**ArrasBind** carries all four:

| Setting | What it does |
| --- | --- |
| **Watched switches** | switches that weave an act when they turn ON |
| **Watched variables** | variables that weave an act when they reach a value |
| **Dye set** | which wools the whole hanging is worked in — six sets |
| **Most acts kept** | older acts fall off the left-hand end beyond this. 40 is a long game |

The other five files have no settings. They are the drawing layer.

### The six dye sets

**Bayeux** — the eight historical wools: madder, weld and woad on bleached linen.
**Northlands** — cold blues and slates over grey flax, with one rust to carry the eye.
**Harvest** — madder, saffron and umber on a warm unbleached ground.
**Verdigris** — copper greens and sea colours on pale flax.
**Crownlands** — indigo, gold and vermilion; the hanging made for a hall.
**Ashland** — a hanging that has been on the wall three hundred years.

Colour is deliberately arbitrary within a set, the way it is on the real thing — a horse with two
blue legs and two red ones is normal on the Bayeux Tapestry. A figure is told apart by its POSE and
by what it carries, never by its colour, which is why the frieze still reads in every dye set.

---

## What Arras does not do

**It does not record deaths.** That is deliberate. If you want the dead commemorated, that is
[Barrow](https://csaf.itch.io/barrow), which carves a marker for every death your game records in
a memorial ground the player can walk. The two are meant to sit side by side:

> **Barrow is what was lost. Arras is what was done.**

---

## Performance

The frieze is expensive to stitch and cheap to show. Each panel is drawn ONCE into its own bitmap,
the first time it comes on screen, and afterwards it is a sprite. A forty-act hanging costs the
same per frame as a two-act one — a handful of draw calls — and the scene allocates nothing at all
in its update loop.

Measured in the real engine: **zero engine windows and zero engine buttons** on the display list,
against a control that reads one window on the title screen.

---

## Saving

The hanging lives on `$gameSystem` and is saved with your game. The format is versioned and
migrated on load, so a save made today keeps working when Arras is updated. A save written by a
NEWER Arras than the one running is returned untouched rather than reset.

---

<hr>

### ⚠️ Compatibility — the question you actually have

**Tested against RPG Maker MZ with the stock scripts unmodified**, verified by running the plugin
in the real engine rather than only in tests.

**Plugin Manager order** (a recommendation, not a requirement — nothing depends on it):

1. `ArrasRender.js` — the thread pen: stitch, laid work, linen, and the colour rules.
2. `ArrasCorpus.js` — the authored corpus: 16 figures, 10 borders, 10 scenes, 6 dye sets,
   5 grounds and a 23-letter alphabet.
3. `ArrasFigure.js` — draws one worked figure.
4. `ArrasFrieze.js` — the hanging: inscription, borders, grounds, panels.
5. `ArrasScene.js` — the scene the player looks at.
6. `ArrasBind.js` — reads the playthrough. The plugin commands live here.

**Core methods extended — both by saved-original prototype extension, *none replaced*:**
`Game_Switches.prototype.onChange`, `Game_Variables.prototype.onChange`.

Because nothing is clobbered, Arras co-exists with other plugins that patch the same seams,
including large suites such as VisuStella MZ.

---

## Support

Post on the product's itch.io page and you will get an answer.

© 2026 Core Systems Asset Factory. See `LICENSE.txt`.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
