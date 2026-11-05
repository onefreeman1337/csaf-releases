# Lineage: Branching Evolution Atlas for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Lineage: Branching Evolution Atlas for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/lineage  
**Docs published:** 2026-11-05


---

# Lineage — The Evolution Atlas for RPG Maker MZ

**Version 1.0.1** · RPG Maker MZ · Core Systems Asset Factory

Your game already knows which creature becomes which. Your **player** does not — and no amount of
text explains a branching family the way a picture of it does.

Lineage draws that picture, from your database, with **no art to supply**. Every species is
rendered as a generated specimen mark: 65 authored body plans × 8 element palettes × 6 growth
stages = **3,120 distinct marks, and not one image file.**

---

## ⚠️ COMPATIBILITY — read this first

**Tested against:** RPG Maker MZ with the **stock scripts**, `rmmz_core / managers / objects /
scenes / sprites / windows` unmodified, verified by running the plugin in the real engine.

**Plugin Manager order — put them in exactly this order:**

| # | File | What it is |
| --- | --- | --- |
| 1 | `LineageMorphology.js` | the corpus. **Data only** — registers nothing, patches nothing |
| 2 | `Lineage.js` | the graph, the notetags, the save record, the plugin commands |
| 3 | `LineageAtlas.js` | the atlas scene |

Load order is a **tidiness request, not a requirement**: every read of the corpus is deferred to
`Scene_Boot.prototype.start`, so the plugin still works if your manager reorders them.

**Core methods extended — all by saved-original prototype extension, none replaced:**

```
Scene_Boot.prototype.start          parse notetags once, after the database has loaded
Game_System.prototype.initialize    create the discovery record
Game_Troop.prototype.setup          only when "Discover On Encounter" is ON
```

Because nothing is clobbered, Lineage co-exists with other plugins that patch the same seams —
including large suites. **It adds no battle logic, no menu replacement and no map behaviour**, so
there is very little of anyone else's surface for it to collide with.

**It does NOT provide an evolution mechanic.** It does not decide when a creature evolves, change
stats, or touch your battle system. If you already have evolution logic — your own, or another
plugin's — Lineage is the display layer over it. That is deliberate: it means Lineage sits happily
beside a monster-catching suite, a breeding plugin, or nothing at all.

---

## Install

1. Copy the three files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and add all three, in the order above.
3. Tag some enemies (below).
4. Call the **Open Atlas** plugin command from an event.

---

## Notetags — put these in an Enemy's note box

```
<lineage plan:wolf palette:ember stage:juvenile>
<lineage evolves:2,3 when:"level 16">
```

| Field | What it does |
| --- | --- |
| `plan:` | which of the 65 body plans draws this species |
| `palette:` | one of the 8 element palettes |
| `stage:` | `spore` · `juvenile` · `adult` · `prime` · `apex` · `mythic` |
| `evolves:` | one enemy id, or a comma list for a branch. Repeat the tag if you prefer |
| `when:` | a **label** printed on the branch — see below |
| `root` | force this species to head its line, even if something evolves into it |

**Everything is optional.** Omit `plan:` and one is chosen **deterministically from the enemy's
name** — the same name always yields the same mark, in this playthrough and every other, on every
machine. So an untagged database still produces a full, stable atlas, and nothing is random.

**`when:` is a label, not a condition.** Lineage never evaluates it. Your game decides when a
creature evolves; this is how the player is *told what to try*. Whatever you write appears on the
branch — `"level 16"`, `"Moonstone at dusk"`, `"never fled a battle"`.

### A worked example

```
Enemy 1  Cinder Pup      <lineage plan:wolf palette:ember stage:juvenile>
                         <lineage evolves:2,3 when:"level 16">
Enemy 2  Ashmane         <lineage plan:wolf palette:ember stage:adult>
                         <lineage evolves:4 when:"Emberstone at dusk">
Enemy 3  Cinder Drake    <lineage plan:drake palette:ember stage:adult>
Enemy 4  Pyre Sovereign  <lineage plan:phoenix palette:radiant stage:apex>
```

A four-species line with one branch and one dead end — and it draws itself.

**Only tagged enemies, and enemies named by an `evolves:`, enter the atlas.** Your slimes and bats
stay out of it. An atlas that listed every enemy in the database would be a bestiary, and that is a
different thing.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Open Atlas** | open the atlas scene |
| **Discover Species** | mark a species discovered — its mark and name resolve |
| **Record Evolution** | record that one species *became* another. Draws the line in gold and discovers the descendant |
| **Forget Species** | undiscover one. For New Game+ and for testing |

---

## Controls

| Key | Action |
| --- | --- |
| ← → | move along a line, ancestor to descendant |
| ↑ ↓ | move between siblings in the same generation |
| OK | toggle the specimen plate |
| Cancel | close the plate, then leave the atlas |

---

## What the player sees

- **Generations, ruled and numbered**, so descent is legible at a glance.
- **Branches** that curve between them, solid gold where this playthrough actually went and dashed
  where it did not, with your `when:` hint shown on the branches touching the cursor.
- **Undiscovered species as hollow silhouettes of their real shape** — the player can see what they
  are hunting without being told what it is. This is the collection hook, and it is why an atlas
  beats a list.
- **A clade rail** across the foot, built from *your* data: every clade in your project, a real
  mark from it, and how many of it they have found.
- **A specimen plate** with the species' body plan, element, stage, and what it can become.

---

## Parameters

| Parameter | Default | Notes |
| --- | --- | --- |
| Atlas Title | `The Lineage Atlas` | printed at the head of the scene |
| Undiscovered Label | `?` | shown instead of an undiscovered name |
| Reveal Silhouettes | on | off hides undiscovered species entirely |
| Show Unreached Branches | on | reveals one step beyond what is discovered |
| Discover On Encounter | on | discover a species the first time it appears in battle |
| Default Palette | `verdant` | used when a notetag names none |

---

## Saves

Discovery is stored on `$gameSystem` under a **versioned schema with a migration path**, and it
round-trips losslessly through MZ's own `JsonEx` — verified in the real engine, not just in a test.

Only enemy ids are persisted. **The graph itself is rebuilt from your database at boot**, so editing
a notetag updates existing saves rather than stranding them.

---

## Under the hood

- **Raw, readable, uncompressed JavaScript.** No minification, no obfuscation. You bought it; you
  can read it, debug it and extend it. Adding your own body plans is expressly permitted by the
  licence.
- **Zero `Math.random()` in game logic** — a seeded, channel-separated hash instead, so the atlas is
  identical on every machine.
- **Zero allocation in the per-frame path.** The scene redraws only when something changes.
- **Off-screen species are culled before any geometry is replayed**, so a 240-species atlas costs
  the same per frame as a 12-species one.
- **No windowskin, no engine font, no stock chrome anywhere in the scene** — verified in-engine by a
  detector that is itself proven to fire on a stock scene first.

---

## Also from Core Systems Asset Factory

Lineage is the display layer above a collection. If you are building one:

- **Chimera Core** — creature breeding and inheritance — <https://csaf.itch.io/chimera-core>
- **Chimera Field** — field encounters and capture — <https://csaf.itch.io/chimera-field>
- **Chimera Battle** — creature-led battles — <https://csaf.itch.io/chimera-battle>
- **Sigil Core** — every spell generates its own animated seal — <https://csaf.itch.io/sigil-core>
- The full catalogue — <https://csaf.itch.io>

---

## Licence

See `LICENSE.txt`. Unlimited games, commercial or free, no royalties. Don't resell the plugin
itself.

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
