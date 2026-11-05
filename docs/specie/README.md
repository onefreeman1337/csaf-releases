# Specie — Your Realm Strikes Its Own Money, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Specie — Your Realm Strikes Its Own Money, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/specie  
**Docs published:** 2026-11-05


---

# Specie — your realm strikes its own money

**RPG Maker MZ · eight plugin files · no image assets**

Your party's gold is a number. Specie is the coin. It reads the currency, the prices and the names
your project already declares, works out the coinage that realm would actually have struck, and
**draws every piece at run time** — obverse device, reverse device, a legend around the rim in the
realm's own lettering, a metal that shows in the colour and in how it corrodes, and a strike that is
off-centre or double-struck or worn smooth depending on how old that particular coin is.

There is no PNG in this package, no icon sheet and no atlas. What you see is geometry.

**Keep your gold display plugin.** Specie does not change your gold, convert currencies, add a shop
scene or pop a number over the player's head. Those are somebody else's job and they do them well.
Specie answers the question they leave alone: *what does the money look like?*

---

## Install

1. Copy the eight files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and switch all eight on.
3. Run the plugin command **Open the purse**, or `SceneManager.push(Scene_Specie)`.

**Load order does not matter**, and that is tested rather than hoped for. Every file resolves the
others the first time it needs them instead of when it loads, and the headless suites, the
store-plate renderer and the in-engine verification all load the eight files **alphabetically** —
which puts `SpecieScene.js` ahead of the `SpecieStrike.js` it uses. That is the worst order you can
create by dragging files in, and it is the order the tests run in. This package deliberately ships
no load-order file.

---

## What is authored

| axis | count | what it decides |
| --- | --- | --- |
| **obverse devices** | **18** | the issuing power — who struck it |
| **reverse devices** | **18** | what that power claims — grain, tower, beast, star, anchor |
| **metals** | **8** | colour, lustre, and **how each one corrodes** |
| **flan forms** | **6** | round, milled, scyphate, pierced, squared, clipped |
| **letterforms** | **72** | two alphabets of 36 glyphs, differing in *construction* |
| **wear stages** | **5** | Mint · Fine · Worn · Poor · Worn Smooth |
| **denomination names** | **6** | Bit · Penny · Groat · Mark · Crown · Sovereign |

These are **authored** things, not a multiplication. The number that matters to you is not how many
combinations exist in principle — it is how many *your* project resolves to, and that is decided by
your data, not by this table.

---

## What your project gets

Specie reads your `System.json` and your item, weapon and armor prices, and derives:

- **How many denominations** the realm strikes — between three and six, from your own price spread.
  A realm whose economy spans ten times does not strike five coins; one spanning three thousand
  needs more than three.
- **What each is worth**, on a ladder whose base is small enough to make change for your cheapest
  item.
- **What the realm is called.** Your currency unit is read first, then your title, then whatever else
  you have renamed. ⚠️ Anything RPG Maker ships is subtracted — all **364** words of it, read out of
  a stock project rather than guessed at — so your coinage is never named after a default suit of
  armour.
- **Which device, metal, flan and alphabet** each denomination carries. Metal rises with value, the
  way money actually does.

A project that has said nothing about itself gets a coinage named after the one thing it did say.
That is honest; inventing a name would be the plugin pretending to know something it does not.

---

## A purse is a mixture of ages

This is the part that took the longest and it is the reason the drawer looks like money rather than
like one sprite repeated.

Twelve freshly struck pieces of one issue are twelve *very similar coins* — the die shifts a few
pixels and one in six is visibly double-struck, and a player would still call them the same coin. So
the strike alone does not carry it. What does is that **a circulating currency is a mixture of
ages**: your purse holds coins struck across generations, and Specie derives each piece's age from
that piece's own identity.

Small change circulates harder than big money — a copper bit passes through a hundred hands a week
while a gold sovereign sits in a chest — so on average the smaller denominations in your purse are
the more worn. An individual penny can still be fresher than an individual groat, because an
individual coin is an individual.

Wear is geometry before it is colour. The high points go first: an old piece keeps its silhouette
and loses its eye, its mane and its lettering.

---

## Parameters

| parameter | default | what it does |
| --- | --- | --- |
| **Open with key** | *(none)* | a map key that opens the purse. Leave blank for none. |
| **Circulation** | working currency | how old the realm's money is. **Every setting still mixes ages** — none of them produces a purse of one repeated coin. |
| **Heading** | `THE PURSE` | the heading at the top of the scene. |
| **Mint quality** | `55` | how careful the mint is. Lower means more off-centre and double-struck pieces. |

## Plugin commands

| command | what it does |
| --- | --- |
| **Open the purse** | pushes the scene. |
| **Close the purse** | pops back, if the purse is the active scene. |
| **Name the realm** | overrides the realm. Changes every device, metal and legend. Saved. |
| **Clear the realm override** | goes back to reading your own data. |
| **Debase the coinage** | strikes the whole ladder in base metal — iron up to silver — instead of copper up to gold. Saved. |

---

## Compatibility

**Tested against a stock RPG Maker MZ project.** Seven of the eight files touch **no core RPG Maker
method at all** — they are pure corpora and geometry. The eighth, `SpecieScene.js`, extends exactly
one:

- `Scene_Map.prototype.updateScene` — by **saved-original prototype extension, calling through in
  every case**, only to watch for the optional open key.

Nothing is replaced and nothing is clobbered, so Specie co-exists with other plugins that patch the
same seam, including large suites.

**It never writes your gold.** It calls `$gameParty.gold()` and draws what that number is made of.
Breaking a total into pieces is a display step: value is conserved exactly, and the remainder below
the smallest coin is shown rather than hidden.

**Saved data** is two settings — a realm override and the debased flag — in a plain slot on
`$gameSystem`, created the first time you open the purse. A save made before you installed Specie
loads without migration. Nothing is stored per coin: a piece's identity is its realm, denomination
and position in the purse, so the same purse always looks the same and spending money removes coins
rather than reshuffling the drawer.

---

## Notes

- The scene draws **no `Window_Base` at all**. It is `Scene_Base` plus three sprites the plugin
  draws into, so there is no windowskin on screen and no stock RPG Maker chrome — the touch-UI
  buttons are detached explicitly.
- A **pierced** flan carries no central device. Real holed coinage does not: its identity is the
  legend set around the piercing.
- The rim legend **refuses to draw when it cannot resolve**. Below the size at which letters are
  legible it lays the beading a legend is set on instead. That is what a small or worn coin honestly
  looks like — an inscription you can see and cannot read — and it is better than fake letters.
- Coins are baked once and reused, so a drawer of a dozen costs one draw each.

---

Copyright © 2026 Core Systems Asset Factory. See `LICENSE.txt`.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
