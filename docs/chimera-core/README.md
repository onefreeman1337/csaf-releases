# Chimera Core: Creature Genetics and Breeding, RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Chimera Core: Creature Genetics and Breeding, RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/chimera-core  
**Docs published:** 2026-11-05


---

# Chimera Core v1.0.0
### Creature Genetics, Breeding & Storage Engine for RPG Maker MZ

Your capture plugin gets a creature into the party. **Chimera Core is everything that happens
afterwards** — the systems that turn a ten-minute demo into a hundred-hour game.

- **Genetics** — 8 stat genes (IVs), 25 natures, gender, ability slots, rare variants
- **Breeding** — parental gene inheritance, nature passing, mutation, egg groups, hatch counters
- **Evolution** — a condition graph with genuinely **branching** outcomes
- **Storage** — multi-box PC storage with sort, search, filter, and paging that holds frame budget

---

## Table of contents

1. [Installation](#1-installation)
2. [Quick start](#2-quick-start)
3. [Notetags](#3-notetags)
4. [Plugin parameters](#4-plugin-parameters)
5. [Script API](#5-script-api)
6. [Plugin commands](#6-plugin-commands)
7. [Recipes](#7-recipes)
8. [Performance](#8-performance)
9. [Compatibility](#9-compatibility)
10. [Troubleshooting](#10-troubleshooting)
11. [Licence & support](#11-licence--support)

---

## 1. Installation

1. Copy all three files into your project's `js/plugins/` folder:
   - `ChimeraCore.js` — the engine
   - `ChimeraStorageUI.js` — the storage box and genome inspector screen (optional)
   - `CSAF_Theme.js` — the custom visual layer (optional)
2. Open **Tools → Plugin Manager**, add them, and set each to **ON**.
3. **Place `ChimeraCore` BELOW your capture plugin** in the plugin list, and put
   `ChimeraStorageUI` below `ChimeraCore`.
4. Configure the parameters (all have sensible defaults — you can ship without touching one).

That's it. No dependencies, no other plugins required.

> **`CSAF_Theme.js` is the custom look, and it is part of what you bought.** It replaces RPG Maker's
> default windowskin, typography and layout with procedural panels, a type scale, easing and a bloom
> filter — it is what the store screenshots show. **Its position in the plugin list does not
> matter:** it is adopted at boot rather than at load, so you can drop it anywhere. Switch it off and
> every window falls back to your project's normal windowskin with no errors. Recolour it from its
> parameters: accent, panel gradient top/bottom, corner radius, and motion.

> **Chimera Core does not implement capture.** That is deliberate. It is built to sit on top of
> whichever capture system you already use — Synrec, TheDelm, or your own events — so you are not
> forced to abandon what already works.

---

## 2. Quick start

**Step 1 — give an enemy a Chimera identity.** In the Database → Enemies, add to the note box:

```
<chimera species: 1>
<chimera eggGroups: 1, 2>
<chimera genderRatio: 50>
<chimera evolvesTo: 2 level 16>
```

**Step 2 — create a creature.** In an event, use the plugin command **Create Creature**, or a script
call:

```javascript
const c = $chimera.create(1, 5);          // species 1, level 5
$gameSystem.chimeraStorage().deposit(c);
```

**Step 3 — read its stats.**

```javascript
const species = $chimera.species(c.speciesId);
const stats = $chimera.stats(c, species.baseParams);
console.log("HP", stats[0], "ATK", stats[2]);
```

Every creature you create now has unique genetics. Two level-5 creatures of the same species will
have measurably different stats — which is the entire point of the genre.

---

## 3. Notetags

Put these in the **note box of an Enemy** (recommended) or an Actor.

| Notetag | Meaning |
|---|---|
| `<chimera species: 12>` | Species id. **Required** — this is how Chimera identifies the creature. |
| `<chimera eggGroups: 3, 7>` | Groups that may interbreed. Two creatures need one group in common. |
| `<chimera genderRatio: 50>` | Percent chance of female. `-1` makes the species genderless (cannot breed). |
| `<chimera catchRate: 45>` | Stored for your capture plugin to read if it wants it. Chimera never uses it. |
| `<chimera evolvesTo: 13 level 16>` | An evolution branch. Repeat the line for more branches. |

### Branching evolution

Add multiple `evolvesTo` lines. Branches are checked **top to bottom**, and the first one whose
conditions *all* pass wins — so ordering is how you set priority.

```
<chimera species: 12>
<chimera evolvesTo: 20 level 30 paramCompare 2 3 >
<chimera evolvesTo: 21 level 30 paramCompare 2 3 <
<chimera evolvesTo: 22 level 30>
```

That reads as: at level 30, become 20 if attack beats defence, 21 if defence beats attack, and 22 if
they are exactly equal.

### Condition types

| Type | Example | Passes when |
|---|---|---|
| `level` | `level 16` | Creature's level is at least 16 |
| `item` | `item 22` | Item 22 was just used on it |
| `friendship` | `friendship 220` | Friendship is at least 220 |
| `timeOfDay` | `timeOfDay night` | Your time plugin reports `night` |
| `gender` | `gender 1` | Gender matches (0 genderless, 1 female, 2 male) |
| `variant` | `variant true` | Creature is a rare variant |
| `traded` | `traded true` | Creature changed hands |
| `paramCompare` | see above | Compares two computed stats |

---

## 4. Plugin parameters

| Parameter | Default | Notes |
|---|---|---|
| Max Individual Value | 31 | Highest roll for one stat gene. Lower it for a flatter power curve. |
| Max Effort Value (per stat) | 252 | Training cap for a single stat. |
| Max Effort Value (total) | 510 | Training budget across all stats — this is what forces build choices. |
| Variant Rate | 4096 | 1-in-N chance of a rare variant. Set to 1 to make every creature a variant (useful for testing). |
| Genes Inherited From Parents | 3 | How many of the 8 stat genes pass down. Raise it to make breeding more powerful. |
| Mutation Chance (%) | 5 | Chance an inherited gene rerolls instead. |
| Number of Boxes | 24 | Storage boxes. |
| Slots Per Box | 30 | Creatures per box. 24 × 30 = 720 total by default. |

---

## 5. Script API

Everything is available on the global `$chimera`.

### Creating

```javascript
$chimera.create(speciesId, level, options)
```
Returns a new creature. `options` accepts `{ species, genome, rng }`.

### Stats

```javascript
$chimera.stats(creature, baseParams)   // → [mhp, mmp, atk, def, mat, mdf, agi, luk]
$chimera.trainStat(creature, paramId, amount)   // → points actually applied
```

`stats()` is cached — calling it every frame is free. The cache invalidates automatically when level
or training changes.

### Genetics

```javascript
$chimera.Genome.ivs(creature.genome)          // → array of 8 values
$chimera.Genome.iv(creature.genome, 2)        // → attack gene
$chimera.Genome.nature(creature.genome)       // → 0-24
$chimera.Genome.gender(creature.genome)       // → 0 genderless, 1 female, 2 male
$chimera.Genome.isVariant(creature.genome)    // → boolean
$chimera.Genome.generation(creature.genome)   // → breeding depth, 0-15
$chimera.Genome.potential(creature.genome)    // → 0..1, ideal for a star rating
$chimera.Natures[natureId].name               // → e.g. "Nimble"
```

### Breeding

```javascript
$chimera.Breeding.compatible(a, b, $chimera.speciesLookup)  // → { ok, reason }
$chimera.breed(mother, father, { inheritNature: true, eggSteps: 2560 })  // → egg or null
$chimera.Breeding.walk(egg, steps)   // → true on the step it hatches
```

`compatible()` returns a **player-facing reason string** — show it directly in your UI instead of
writing your own error messages.

Eggs held in storage tick down automatically as the party walks.

### Evolution

```javascript
$chimera.checkEvolution(creature, { usedItemId: 22, timeOfDay: 'night' })  // → speciesId or null
$chimera.Evolution.apply(creature, targetSpeciesId)
```

Evolution preserves genetics, training, friendship, and nickname. Only the species changes.

### Storage

```javascript
const box = $gameSystem.chimeraStorage();

box.deposit(creature)                  // → { box, slot } or null if full
box.withdraw(boxIndex, slotIndex)      // → creature or null
box.count()                            // → total stored
box.page(boxIndex, from, count)        // → array slice (convenience)
box.pageInto(boxIndex, from, count, buffer)  // → n written (allocation-free)
box.search({ speciesId, minLevel, variantOnly, gender, minPotential })
box.sortBox(boxIndex, 'level' | 'species' | 'potential')
```

> **Drawing a box every frame? Use `pageInto`.** Allocate one buffer at scene setup and reuse it.
> `page()` allocates a fresh array per call, which is fine for menus but produces garbage in a
> scroll loop. See [Performance](#8-performance).

---

## 6. Plugin commands

| Command | Arguments | Effect |
|---|---|---|
| **Create Creature** | Species Id, Level | Rolls a creature and deposits it into storage. |
| **Breed Pair** | Mother index, Father index | Breeds two creatures from box 1; the egg goes to storage. |
| **Open Storage Boxes** | — | Opens the storage scene, if one is registered. |

---

## 7. Recipes

**Show a creature's genetics on screen**

```javascript
const c = $gameSystem.chimeraStorage().boxes[0][0];
const nature = $chimera.Natures[$chimera.Genome.nature(c.genome)].name;
const stars = Math.round($chimera.Genome.potential(c.genome) * 5);
$gameMessage.add(`${nature} · ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}`);
```

**Only let the player breed when the pair is valid**

```javascript
const result = $chimera.Breeding.compatible(a, b, $chimera.speciesLookup);
if (!result.ok) {
  $gameMessage.add(result.reason);   // e.g. "These species share no egg group."
} else {
  const egg = $chimera.breed(a, b, { inheritNature: true });
  $gameSystem.chimeraStorage().deposit(egg);
}
```

**Evolve with a stone**

```javascript
const target = $chimera.checkEvolution(creature, { usedItemId: 22 });
if (target !== null) $chimera.Evolution.apply(creature, target);
```

**Find every high-potential creature the player owns**

```javascript
const elites = $gameSystem.chimeraStorage().search({ minPotential: 0.8 });
$gameMessage.add(`You have ${elites.length} exceptional creatures.`);
```

**Reproducible breeding (for testing or seeded runs)**

```javascript
const rng = $chimera.createRng(12345);
const egg = $chimera.breed(a, b, { rng });   // same seed → identical egg, every time
```

---

## 8. Performance

Chimera Core holds a steady 60 FPS with a fully-stocked storage.

**Confirmed on real hardware:** RPG Maker MZ playtest, storage scene open with a full collection —
a steady 60 FPS with the F2 counter, never dropping to 59. The measurements below explain why
there is so much room to spare.

**How:** genomes are bit-packed into two 32-bit integers rather than objects of 13 fields, computed
stats are cached behind a dirty flag, and box drawing is paged so cost scales with *visible slots*,
not collection size.

### In-engine (what actually matters)

Measured in **RPG Maker MZ itself** — real corescript, real PIXI WebGL renderer, 816×624, with
**600 creatures stored** and the storage scene open:

| Scenario | Mean frame | % of 60 FPS budget |
|---|---|---|
| Idle (browsing a box) | 3.29 ms | 19.8% |
| Realistic cursor movement (~7.5 moves/sec) | **2.62 ms** | **15.7%** |
| Held key (15 moves/sec) | 3.00 ms | 18.0% |
| Box switch every 0.5 s (full grid repaint) | 2.63 ms | 15.8% |
| Abusive: 60 cursor moves/sec + box flips | 2.80 ms | 16.8% |

**Roughly 80–84% of the frame budget is left for your game.** Note that hammering the UI at 60
moves per second — about eight times faster than a human can press a key — barely moves the mean.
The storage scene is not what will cost you frames.

### Engine logic in isolation

Measured headlessly on Node v24 with **720 stored creatures**:

| Operation | Result |
|---|---|
| Chimera's own per-frame logic | 0.000557 ms |
| Cached stat read | 100.6 M ops/sec |
| Genome read | 201.0 M ops/sec |
| Search across all 720 | 1.41 ms |
| Save payload, 720 creatures | **43.0 KB** (61 bytes per creature) |
| Heap growth per draw frame | **0.655 bytes** — effectively allocation-free |

> These two tables measure different things and should not be confused. The Node figures cover
> Chimera's *logic only*; the in-engine figures are complete MZ frames including PIXI rendering and
> window repaints, which dominate the cost. Only the in-engine table describes what your players
> will experience.

Reproduce either yourself: `node --expose-gc tests/bench.js` for the logic benchmark, or open the
storage scene in your own project and press F2.

---

## 9. Compatibility

Chimera Core extends core methods with saved originals and never overwrites them, so it coexists
cleanly with other plugins.

| Plugin | Status |
|---|---|
| Synrec Monster Capture | ✅ Compatible — place Chimera below it |
| TheDelm Creature Capture | ✅ Compatible — place Chimera below it |
| VisuStella MZ suite | ✅ Compatible — no overlapping core overrides |
| Battle system replacements | ✅ Compatible — Chimera touches no battle code |
| Time/day-night plugins | ✅ Pass the phase into `checkEvolution({ timeOfDay })` |

**Extended core methods:** `Game_System.prototype.initialize`, `DataManager.makeSaveContents`,
`DataManager.extractSaveContents`, `DataManager.setupNewGame`, `Game_Party.prototype.increaseSteps`.

**Save compatibility.** Adding Chimera to an existing save is safe — you get empty storage. Saves
carry a schema version, and loading a save written by a *newer* Chimera than you have installed
fails with a clear message instead of corrupting data.

---

## 10. Troubleshooting

**`$chimera is not defined`**
The plugin isn't enabled. Check the Plugin Manager, and confirm the filename is exactly
`ChimeraCore.js` — the parameter lookup is filename-based.

**`$chimera.species(id)` returns null**
The enemy has no `<chimera species: N>` notetag, or the id doesn't match. Species ids come from the
notetag, not from the database row number.

**All my creatures have identical stats**
You're reading the database's base params instead of computed stats. Use
`$chimera.stats(creature, species.baseParams)`.

**"expected a packed genome {a, b}"**
You passed a creature where a genome was expected. Use `creature.genome`.

**Breeding always returns null**
Check with `$chimera.Breeding.compatible(a, b, $chimera.speciesLookup)` and read `.reason`. Usually:
same gender, a genderless species, or no shared egg group.

**Eggs never hatch**
Eggs tick down as the party *walks*. Confirm the egg is in storage and `eggSteps > 0`.

**Frame drops when scrolling a box**
You're calling `page()` in a draw loop. Switch to `pageInto()` with a reusable buffer.

---

## 11. Licence & support

Licensed under the **Chimera Commercial Asset Licence** — see `LICENSE.txt`. In short: use it in
unlimited commercial and non-commercial games, forever, no royalties. You may not resell or
redistribute the plugin file itself.

The source ships **uncompressed and fully commented** on purpose. You bought an engine mechanic;
you should be able to read, debug, and extend every line of it.

**Coming next:** *Chimera Battle* (type matrix, move sets, status effects, battle AI) and
*Chimera Field* (overworld spawns, biomes, encounter tables). Owners of Chimera Core get bundle
pricing.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
