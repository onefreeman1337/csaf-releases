# Hallmark: 2,688 Weapon and Armour Icons for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Hallmark: 2,688 Weapon and Armour Icons for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/hallmark  
**Docs published:** 2026-11-05


---

# Hallmark — for RPG Maker MZ

**Every weapon and every piece of armour strikes its own maker's mark.**

Keep your loot system. This is the part that makes the drop *look* like something.

---

## What it does

In stock RPG Maker, a legendary blade and a starter dagger are the same picture: a 32×32 tile from
an iconset that ships with every project ever made. Hallmark replaces that with a **struck mark**
composed from the item's own properties — its guild, its metal, its rank, and whatever your loot
system rolled onto it.

```
56 guild forms  ×  8 metals  ×  6 ranks   =   2,688 distinct marks
                                       +   24 affix glyphs
```

Nothing is a picture file. **This plugin ships no images and loads none at runtime.** Every mark is
vector geometry, drawn at whatever size it is needed — a 32 px inventory icon and a 170 px ledger
plate are the same authored form, not two assets.

It also adds **the Assay Ledger**: the player's own book of proof marks, filling in as the party
handles items.

---

## Installation

1. Copy all three files into your project's `js/plugins/` folder.
2. In the Plugin Manager, add them **in this order**:

   | # | Plugin | What it is |
   | --- | --- | --- |
   | 1 | `HallmarkForms.js` | the corpus — data only, patches nothing |
   | 2 | `Hallmark.js` | the engine — derivation, rendering, icon substitution |
   | 3 | `HallmarkLedger.js` | the Assay Ledger scene |

   Load order is a **tidiness request, not a requirement**. Nothing reads the corpus until
   `Scene_Boot`, so the plugins work in any order — but the list above is easier to read.

3. Turn all three on. That is the whole installation; no notetags are needed to get started.

---

## Compatibility

**Tested alongside:** stock RPG Maker MZ 1.9.0 scripts, and written specifically to sit beside
independent-item and ARPG loot plugins (any plugin that hands the party cloned item objects).

**Core methods extended — three, all by prototype extension with the original saved:**

| Method | Why |
| --- | --- |
| `Window_Base.prototype.drawItemName` | strikes the mark in place of the iconset icon, **for markable items only** |
| `Game_System.prototype.initialize` | creates the Ledger record |
| `Scene_Boot.prototype.start` | reads the parameters once |

Plus `DataManager.makeSaveContents` / `extractSaveContents` for the save round-trip.

**Core methods replaced outright: none.** In particular `Window_Base.prototype.drawIcon` is
deliberately **not** patched, so every icon this plugin has no opinion about — items, skills,
states, your own custom windows — is drawn by the engine exactly as before.

**If another plugin also extends `drawItemName`,** load Hallmark **after** it and both will run.

---

## What decides a mark

Nothing is random. The same item always strikes the same mark, in this save and every other one,
because the mark is **derived** rather than rolled.

| Component | Comes from |
| --- | --- |
| **Guild** | the item's weapon type or armour type — so every axe is marked by one guild and every staff by another, and the player learns to read the shelf at a glance |
| **Form** | a stable hash of the item's identity, within that guild |
| **Metal** | the same hash, different bits |
| **Rank** | the item's **price**, against the Rank Price Steps parameter |
| **Affix glyphs** | the item's own rolled properties — parameter bonuses, attack elements, element rates, state traits |

Change **Mark Seed** and the whole world re-casts. The same seed always produces the same world.

### Rolled and independent items

If another plugin hands the party its own cloned item objects — the usual shape for an ARPG loot
system — Hallmark marks those too, and reads the **clone's** properties. Two swords rolled from one
base with different affixes strike **two different marks**.

Nothing needs registering and no API has to be called.

---

## Notetags

One line, on a weapon, armour or item. Every field is optional; whatever you leave out is derived.

```
<hallmark: form=anvil, metal=meteoric, rank=sunburst, glyphs=ember|keen>
```

Opt an item out entirely, restoring its ordinary iconset icon:

```
<hallmark: none>
```

The ids are listed at the bottom of this file and shown in the Ledger.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Open the Hallmark Ledger** | opens the Assay Ledger scene |
| **Record a Mark** | records an item's mark without the player having to see it in a list |
| **Re-cast Every Mark** | changes the seed at runtime; marks already in the Ledger are kept |

---

## Parameters

| Parameter | Default | Notes |
| --- | --- | --- |
| Mark Seed | `1` | Same seed = same marks, always |
| Mark Weapons | on | |
| Mark Armour | on | |
| Mark Items | **off** | Potions rarely want a smith's punch |
| Rank Price Steps | `200, 800, 2500, 8000, 25000` | Five ascending prices splitting the six ranks. A malformed list falls back to this default rather than making everything legendary |
| Affix Glyph Cap | `4` | Above 6 they crowd the punch |
| Mark Size | `32` | Matches MZ's icon grid |
| Record Marks Seen | on | Feeds the Ledger |

**A blank numeric field is treated as absent, never as zero.** (`Number('')` is `0` in JavaScript,
which would silently make Mark Size zero and draw nothing.)

---

## The Assay Ledger

Arrow keys move, **Q / W** turn the leaf, **X** closes the book.

The Ledger extends `Scene_Base`, not `Scene_MenuBase` — so it creates no window layer and no touch
buttons, and contains no stock RPG Maker chrome at all. The leather, the gilt rules, the ruled
grid, the bracket cursor and the shimmer travelling across the selected mark are all drawn by the
plugin.

---

## Performance

Marks are rendered **once per (mark, size)** and cached, then blitted. Nothing in the Ledger's
`update` draws: the cursor, the shimmer and the strike animation move sprite transforms only.
Verified in the real engine at **zero texture updates across 120 idle frames**, against a positive
control proving the counter fires when a redraw is forced.

---

## The ids

**Guilds** — bladesmith · anvil · crown · beast · celestial · tower · flora · serpent · vessel ·
key · mariner · ecclesiast · cipher · hand

**Metals** — `iron` `steel` `bronze` `silver` `electrum` `coldiron` `meteoric` `blackened`

**Ranks** — `struck` `ringed` `banded` `cartouche` `laurel` `sunburst`

**Affix glyphs** — `ember` `frost` `spark` `venom` `keen` `heavy` `swift` `warded` `blessed`
`cursed` `vampiric` `thorned` `lucky` `arcane` `holy` `shadow` `stone` `gale` `tide` `rust`
`mirror` `echo` `bulwark` `hollow`

Form ids are listed in `HallmarkForms.js`, grouped by guild and commented.

---

## Terms

You may use this plugin in commercial and non-commercial RPG Maker MZ projects. You may edit it to
suit your game. You may not resell or redistribute the plugin itself. See `LICENSE.txt`.

---

*Hallmark is by **Core Systems Asset Factory**. More RPG Maker MZ systems: <https://csaf.itch.io>*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
