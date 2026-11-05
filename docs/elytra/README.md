# Elytra: Generated Insect Bestiary for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Elytra: Generated Insect Bestiary for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/elytra  
**Docs published:** 2026-11-05


---

# Elytra — every insect your game declares, drawn from its own data

**RPG Maker MZ · eight plugin files · no image assets**

Your bestiary has beetles in it, or your collection quest does, or your alchemy list does. Elytra
draws them. It builds a distinct specimen for every creature your project declares — body plan,
elytra sculpture, hindwing venation, antennae and material — and it draws all of it at run time.

There is no PNG in this package. No sprite sheet, no atlas, no icon set. The insect you see is
geometry, solved from a row you already wrote.

**You do not have to author anything.** Elytra reads your existing `Enemies.json` (or items, or
troops) and gives every row a specimen. A tag is available when you want to decide a particular
one, and it is never required.

---

## Install

1. Copy the eight files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and switch all eight on.
3. Turn the **Reveal everything** parameter ON while you look around — the cabinet only shows what
   you have discovered, so on a brand-new project it is otherwise empty by design (see *The
   cabinet* below).
4. In an event, add a Plugin Command, choose **`ElytraScene`**, and pick **Open the cabinet**.

**Load order does not matter.** Every file resolves the others the first time it needs them rather
than when it loads, and that is tested rather than hoped for: the headless suite, the store-plate
renderer and the in-engine verification all load the eight files **alphabetically**, which puts
`ElytraScene.js` ahead of most of what it depends on. That is the worst order a buyer can create by
dragging files in, and it is the order every test runs in. This package deliberately ships no
load-order file.

---

## Compatibility — the short version

Elytra patches **one** core RPG Maker method, `Game_System.prototype.initialize`, by **saved-original
prototype extension**: the original is kept and called through, so anything else patching the same
seam keeps working. It also extends the `DataManager.extractSaveContents` static the same way.

Nothing else in the engine is touched. No core method is replaced, and no window, scene or manager
that another plugin is likely to own is overridden.

- Verified in a real MZ runtime against a **stock RPG Maker MZ project with the standard scripts**.
  Other plugin suites are not claimed as tested, because they were not: what is claimed instead is
  the property that decides most conflicts, which is the single saved-and-called-through patch above.
- The cabinet is its own `Scene_Elytra`. It does not modify `Scene_Menu`, `Scene_Battle`,
  `Window_Base` or the message system.
- Runtime figures from the engine gate, measured over 600 stepped frames × 3 runs with zero page
  errors. The **deterministic per-frame counts** are the ones worth quoting, because they do not
  move between runs: **2 draw calls · 0 texture uploads · 0 bitmap dirties · 0 window refreshes ·
  0 stock RPG Maker windows · display objects 3, growth 0.** The cabinet draws none of the engine's
  chrome.
- The plugin's own update work sits **far below the 2 ms budget** — measured repeatedly at
  hundredths of a millisecond. A precise figure is deliberately not quoted: on a shared GPU the
  same code measured 0.016 and 0.021 ms in two runs an hour apart, a 30%+ spread, so any single
  decimal here would be a number about the machine rather than about the plugin. These are frame
  COSTS in any case, never a presented frame rate.

---

## The corpus

| axis | count | what it decides |
| --- | --- | --- |
| **body plan** | **12** | the outline — ground, stag, rhino, weevil, leaf, longhorn, click, tiger, scarab, firefly, diving, rove |
| **elytra sculpture** | **8** | smooth, striate, ribbed, punctate, granular, costate, reticulate, sulcate |
| **antennae** | **7** | filiform, clubbed, lamellate, serrate, pectinate, geniculate, moniliform |
| **material** | **7** | matte, satin, lacquer, metallic, iridescent, pruinose, velvet |
| **hindwing** | **4** | folded, ajar, fanned, full — the one axis that changes the silhouette |

**An antenna is not chosen freely.** Each body plan wears only the two or three forms that body
entomologically carries, which is **28 body-and-antenna pairs** rather than 84. That constraint is
the reason a lamellate club never appears on a longhorn, and it is why the automatic reading reaches
**224** distinct specimens rather than a larger number it could not honestly draw.

With explicit tags the reachable set is **672**; across all five axes it is **18,816**. The number
that matters is the first one, because most projects never tag anything.

---

## What a project actually gets

Measured over synthetic projects by `spread_check`, on the **unauthored** case — plain creature
names, no tags, no insect words, which is the project most buyers have:

> **60 species resolve to 60 visibly different specimens (53 distinct in body, sculpture and
> antenna alone).**

The residual is the birthday problem, not a defect: a uniform spread over 224 reachable specimens
cannot do better, and more corpus makes it smaller rather than zero. At 24 rows it is 24 of 24.

---

## Declaring specimens

Two routes, and they coexist. Use either or both.

### 1. Do nothing

Every creature in your database already resolves. Elytra reads the row's own name and note text for
words it recognises, and falls back to the row's identity when it finds none — so the result is
**deterministic** (the same project always draws the same insects) and **order-independent**
(reordering your database changes nothing).

### 2. A note tag, when you want to decide one

```
<elytra body:stag sculpture:ribbed antenna:geniculate lustre:metallic venation:fanned hue:#3B6E2A>
```

Every field is optional; anything you leave out is read as in route 1. **An unknown id is dropped
and reported, never guessed and never thrown** — a typo in a note tag will not crash a battle, and
it will not silently become something else either. The remaining valid fields still apply.

---

## The cabinet

**Open the cabinet** opens a specimen drawer, with the selected creature drawn as a pinned specimen
on a card and its five axes named beneath it. A creature you have not discovered reads as
undetermined and draws nothing, which is the honest answer rather than a placeholder.

> ⚠️ **Discovery is yours to drive, and the cabinet starts EMPTY.** Elytra does not hook combat and
> does not patch `BattleManager` or `Game_Troop` — that is deliberate, because guessing when a
> species counts as "found" is exactly the sort of decision a plugin should not make for you, and
> hooking the battle flow is where plugin conflicts come from. Nothing is populated until you say
> so.
>
> **To see the whole cabinet immediately**, either turn the **Reveal everything** parameter ON in
> the Plugin Manager, or call **Discover every species** once. To use it as a collection, call
> **Discover a species** with the row id from a troop's own event page, or wherever your game
> decides the player has properly seen the creature.

Four plugin commands, all on `ElytraScene`:

| command | what it does |
| --- | --- |
| **Open the cabinet** | opens the specimen drawer |
| **Discover a species** | marks one row id as encountered |
| **Forget a species** | clears one row id |
| **Discover every species** | reveals the whole cabinet, for testing or for a New Game+ |

There are also plugin parameters for the cabinet title, which database table to read specimens from,
whether to restrict to tagged rows only, and whether to reveal everything.

Discovery state is saved and restored with your save file, versioned, and forward-compatible.

---

## Files

| file | what it owns |
| --- | --- |
| `ElytraCorpus.js` | the authored corpus — every body plan, sculpture, venation, antenna and material |
| `ElytraForms.js` | body silhouettes, traced as one continuous outline per plan |
| `ElytraInk.js` | colour solving — relief, contrast and hue travel |
| `ElytraReading.js` | turns a row of your database into a specimen |
| `ElytraSculpt.js` | the elytral sculpture — striae, ribs, punctures, granules, keels |
| `ElytraShell.js` | the lit specimen — shell colour, material, iridescence, seam and rim |
| `ElytraVenation.js` | the hindwing — membrane, venation and spread |
| `ElytraScene.js` | the cabinet scene, the discovery record and the save seam |

All eight ship as raw, readable, uncompressed JavaScript. Nothing is minified and nothing is
obfuscated; read it, change it, keep it.

---

## Licence

See `LICENSE.txt`. In short: ship as many games with it as you like, commercial or free, keep 100%
of your revenue, and do not resell the plugin itself. The specimens it draws inside your game are
yours.

---

*Elytra is built by Core Systems Asset Factory. Code and graphics in this product are
AI-generated; see the store listing's disclosure.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
