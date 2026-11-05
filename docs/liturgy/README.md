# Liturgy: Printed Ledger Menus for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Liturgy: Printed Ledger Menus for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/liturgy  
**Docs published:** 2026-11-05


---

# Liturgy — every menu becomes a printed object

**RPG Maker MZ · nine plugin files · no dependencies**

Liturgy redraws your main menu, your item list and your status page as one printed ledger page:
real paper with laid and chain wires, an engraved rule system, a drawn alphabet, and a device
beside every command composed from what that command **does**.

**It does not change your menu.** Your command list, your plugins' added commands, your handlers,
your selection and your input all stay exactly where they are. Liturgy prints them.

---

## Install, in one minute

1. Copy the nine `Liturgy*.js` files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and add all nine. **The order does not matter** — see below.
3. Open the menu.

That is the whole installation. There is nothing to configure to see it working.

### Plugin order does not matter, and here is why

Every file resolves its siblings at **first use** rather than at load time, so any order works —
including the alphabetical order the Plugin Manager gives you if you drag all nine in at once.
The product's own in-engine test suite runs that alphabetical order deliberately, because it is the
worst case: it loads dependent files **before** the files they depend on.

The order below is only what reads sensibly in the list:

```
LiturgyInk.js        the colour and scale laws, and the single light
LiturgyAlphabet.js   the drawn alphabet — 50 letterforms, six founts
LiturgyCorpus.js     the authored corpus — houses, stocks, rulings, markers, devices
LiturgyPaper.js      the paper — wires, tooth, foxing, deckle, the gutter
LiturgyRule.js       the rule system — rules, leaders, ornament, markers, printed gauges
LiturgyDevice.js     the device struck beside each command
LiturgyReading.js    the classifier — reads your project, returns a page spec
LiturgyPage.js       the assembler — one whole page into a rect
LiturgyScene.js      the engine seam — the three scenes, the parameters, the commands
```

---

## Parameters

All of them are on **`LiturgyScene`**. Every other file is a library and has none.

| parameter | what it does |
| --- | --- |
| **Ledger house** | Which kind of book the menu is set as. `auto` reads your project's own title. |
| **Index column head** | The heading over the command column. Default `THE INDEX`. |
| **Register column head** | The heading over the party column. Default `THE COMPANY`. |
| **Sum-carried label** | The label beside the party's money at the foot. Default `SUM CARRIED`. |
| **Running head** | The line at the head of every page. Blank uses your game's title. |
| **Print the main menu / item list / status page** | Turn each scene on or off independently. |

## Plugin commands

| command | what it does |
| --- | --- |
| **Set the ledger house** | Change which kind of book the menu is printed as, from that point on. Chapter two can be a different book from chapter one. |
| **Set the running head** | Change the line printed at the head of every page — a chapter title, for instance. |
| **Return to the automatic house** | Undo `Set the ledger house`. |

Both settings are saved with the game and restored on load.

---

## The six houses

A house is a coherent decision about a **kind of book**, not a colour scheme. Each one changes the
paper, the rule system, the letterforms, the marker and the ornament together.

| house | paper | ruling | letterforms | marker |
| --- | --- | --- | --- | --- |
| **Chancery** | laid, with chain wires | double rules at head and foot, dotted leaders, corner returns | a heavy legal hand, slab serifs | a lozenge with a tail |
| **Breviary** | vellum, deckle-edged | drypoint — rules scored into the sheet, not inked | a liturgical versal, the nib canted over | a pointing hand |
| **Daybook** | blue account paper | three rules at the head, ruled leaders, double margins | a condensed merchant hand | a chevron |
| **Cartulary** | coarse foolscap | braced corners, dashed leaders | a rustic capital, very heavy stem | a dagger |
| **Almanac** | smooth wove | every entry in its own ruled box | a bold printed titling, fat slabs | a square bracket |
| **Muster** | heavy ledger stock | one swelled rule at the head and nothing else | a stencilled monoline roll hand | a lozenge |

**`auto` picks a house from your game's own title** — a word like *chronicle*, *company*, *abbey*
or *ledger* is read directly, and anything else is hashed, so different projects get different
books. Set the parameter if you would rather choose.

---

## The devices

Every command on your menu gets a device struck beside it, chosen from the command's **symbol**
first — `item`, `skill`, `equip`, `status`, `formation`, `options`, `save`, `gameEnd`. A symbol is
an engine constant, so this works in a project of any language, whatever the menu actually says.

Commands your other plugins add are read too. There are twenty-four devices in the corpus covering
quests, bestiaries, crafting, maps, shops, relations, achievements, galleries, fishing, mining,
cooking, guilds, help, calendars and banking — and **anything the corpus does not recognise is
struck as a monogram of its own initial**, drawn in the same alphabet as everything else. The page
can never render a hole.

---

## The alphabet

Every heading, command name, party name, figure and folio on the page is **drawn**, not typed.
Fifty authored letterforms are cut six ways by a broad pen: the stem weight, the pen angle, the
serif treatment, the set width and the tracking all change, so the six houses have six genuinely
different alphabets rather than one alphabet in six weights.

There is no font file, which means nothing on the page can fall back to RPG Maker's own typeface —
the loudest signal there is that a game was made in RPG Maker.

**It is a titling alphabet: capitals, figures and points.** Any string it cannot set — Japanese,
Cyrillic, accented Latin — falls back to a chosen serif stack **per string**, never per letter, so
a name is never half drawn and half typed.

---

## What it does to your project

Nothing outside the three menu scenes. It adds no data, writes no files, and touches no map, no
battle, no event and no database record.

The compatibility detail is printed on the store page and is measured from the source rather than
claimed: seven core methods are extended by saved-original prototype extension, and three
`Scene_Menu` rect methods are **replaced** — deliberately, since replacing that layout is what the
product is for. The originals are saved, so stock behaviour can be restored in one line:

```js
Scene_Menu.prototype.commandWindowRect = LiturgyScene.stock.commandWindowRect;
```

**If another plugin also replaces `Scene_Menu`'s layout, Liturgy and that plugin cannot both draw
the menu**, and whichever loads last wins. That is true of every menu-look plugin and is said here
rather than glossed.

---

## Performance

The page is drawn once into a bitmap and redrawn only when something on it actually changes — not
every frame.

Measured in the engine over 600 frames, and quoted as **counts rather than milliseconds**, because
a count is deterministic and a timing on a shared GPU is not: **11 draw calls per frame, 0 texture
uploads, 0 bitmap dirties, 0 window refreshes, and display-object growth of 0**. Nothing is
allocated per frame and nothing is uploaded per frame. The update half of the frame measured
comfortably inside its 2 ms budget across every run, with no frame over the 16.67 ms total budget.

---

## Terms

You may use Liturgy in any number of commercial or non-commercial RPG Maker projects, forever, and
you may modify it for your own use. You may not resell or redistribute the plugin files themselves,
modified or not. See `LICENSE.txt`.

---

## AI disclosure

The code and the generated artwork in this product were produced with AI assistance. The store page
carries the same disclosure.

**Core Systems Asset Factory** · <https://csaf.itch.io>


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
