# Chimera Field: Spawn Tables and Dex for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Chimera Field: Spawn Tables and Dex for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/chimera-field  
**Docs published:** 2026-11-05


---

# Chimera Field — Spawn Tables, Rarity Tiers, Variant Rates & Field Guide

**For RPG Maker MZ · Version 1.0.0**

Encounter plugins decide **when** a fight starts. Bestiaries record **what you killed**.

This is the layer in between — the one nothing on the store ships. It decides **which species
appears, where, how rare it is, what level it rolls at, and whether this particular one is a
variant** — and feeds all of that into a Field Guide the player is trying to complete.

**Keep your encounter plugin.** This does not replace it and does not want to. It never decides
whether a fight happens; RPG Maker asks "which troop?", and this answers.

---

## Contents

1. [Install](#install)
2. [Setup in three steps](#setup-in-three-steps)
3. [Spawn tables](#spawn-tables)
4. [Rarity tiers](#rarity-tiers)
5. [Gates: time, weather, switches](#gates-time-weather-switches)
6. [Variants and chains](#variants-and-chains)
7. [The Field Guide](#the-field-guide)
8. [Plugin commands](#plugin-commands)
9. [Script API](#script-api)
10. [Working with other plugins](#working-with-other-plugins)
11. [Chimera Core & Chimera Battle](#chimera-core--chimera-battle)
12. [Performance](#performance)
13. [Troubleshooting](#troubleshooting)
14. [Licence](#licence)

---

## Install

1. Copy all three files into your project's `js/plugins/` folder:
   - `ChimeraField.js` — the engine
   - `ChimeraDexUI.js` — the Field Guide scene (optional; leave it out and keep the engine)
   - `CSAF_Theme.js` — the custom visual layer (optional)
2. Open the Plugin Manager and add them, **`ChimeraField` above `ChimeraDexUI`**.
3. Fill in Spawn Tables on `ChimeraField`.

Order matters only in that `ChimeraDexUI` must come after `ChimeraField`. Everything else in your
list — `CSAF_Theme` included — can go wherever it already is.

> **`CSAF_Theme.js` is the custom look, and it is part of what you bought.** It replaces RPG Maker's
> default windowskin, typography and layout with procedural panels, a type scale, easing and a bloom
> filter — it is what the store screenshots show. **Its position in the plugin list does not
> matter:** it is adopted at boot rather than at load, so you can drop it anywhere. Switch it off and
> every window falls back to your project's normal windowskin with no errors. Recolour it from its
> parameters: accent, panel gradient top/bottom, corner radius, and motion.

---

## Setup in three steps

### 1. Number your creatures

Put this in the **Note** box of each enemy that represents a species:

```
<chimera species: 7>
```

Already using **Chimera Core**? It is the same notetag. Nothing more to do.

The number is yours to choose — it is the species' identity, and its slot in the Field Guide.
Numbering them 1, 2, 3… in the order you want them listed is the usual choice.

### 2. Say what each map is

In the map's **Note** box (right-click the map → Edit):

```
<chimera biome: meadow>
```

One map can hold several biomes, using region IDs painted in the editor:

```
<chimera biome: meadow>
<chimera region 3: tidepool>
<chimera region 5: cavern>
```

The region under the player wins where one is painted; everywhere else falls back to the map's
biome. Region 0 means "unpainted", so it uses the map biome rather than counting as its own region.

A map with **no** biome tag behaves exactly as it does today — your encounter list, untouched. That
is deliberate: adding this plugin to an existing project changes nothing until you tag a map.

### 3. Fill in the spawn tables

Plugin Manager → `ChimeraField` → **Spawn Tables**. One entry per biome. That is the whole install.

---

## Spawn tables

A spawn table is one biome's list of species. Each row is:

| Field | Meaning |
|---|---|
| **Species ID** | Matches the `<chimera species: N>` tag on the enemy |
| **Rarity** | A tier name — `common`, `rare`, `legendary`… |
| **Minimum / Maximum Level** | The band this species rolls in here |
| **Only At** | Times of day it appears. Empty = any time |
| **Only In** | Weather it appears in. Empty = any weather |
| **Requires Switch** | Stays hidden until this switch is on. 0 = always available |

The same species can appear in several biomes at different rarities and level bands. A creature that
is common in the meadow at level 3 and very rare in the cavern at level 30 is one species with two
rows — and the Field Guide shows it once, at its rarest tier.

---

## Rarity tiers

Weights live on the **tier**, never on the row. You write `rarity: rare`, not `weight: 3`.

Shipped defaults:

| Tier | Weight |
|---|---|
| common | 100 |
| uncommon | 45 |
| rare | 15 |
| very rare | 5 |
| legendary | 1 |

These are **ratios, not percentages**. A common species is 100/15 ≈ 6.7× likelier than a rare one in
the same table. Actual odds depend on what else is in that biome and what is currently gated out.

This is the single dial that rebalances every biome in the game at once. Decide the whole game is
too generous with rares? Change `rare` from 15 to 8. Every table follows.

You can replace the tier list entirely — three tiers, ten tiers, your own names — in the **Rarity
Tiers** parameter, or at runtime:

```js
$chimeraField.Rarity.configure({ common: 100, elite: 20, mythic: 2 });
```

A misspelled tier throws immediately and names the offender, rather than silently weighting the
species to zero and making it never appear.

---

## Gates: time, weather, switches

A gate closes **only when the game actually supplies the relevant information and it does not
match.** If you have no day/night plugin wired up, night-only species still appear — you get
encounters rather than an empty world, because silence there looks exactly like a broken install.

**Time of day and weather** are read from game *variables*, not from any particular plugin. Point
the `Time of Day Variable` parameter at a variable, have your day/night plugin write `"night"` into
it, and night gating works. Same for weather. Leave the parameter at 0 and time gating is simply off.

**Switches** are read directly. Only switches an entry actually gates on are ever queried.

---

## Variants and chains

A **variant** is the rare recolour/special version of a species. `Variant Rate` is a 1-in-N figure —
4096 means one in 4096. It is per-encounter, and the Field Guide records permanently whether the
player has ever seen one.

**Chains** are what turn a spawn table into a reason to keep playing. Fight the same species
repeatedly and its variant odds improve:

```
rate = baseRate / (1 + chainLength / chainStrength)
```

clamped at `Variant Rate Floor` so a variant is never guaranteed. Fleeing breaks the chain, which is
what makes a long one worth protecting. Encountering a different species starts a new chain at 1.

With the defaults, a chain of 20 takes the rate from 1-in-4096 to 1-in-2048; the floor of 128 is the
best it can ever reach. Turn the whole mechanic off with `Enable Chains`.

---

## The Field Guide

`ChimeraDexUI.js` adds `Scene_ChimeraDex` — a species log driven by your spawn data rather than by
kill counts. That difference is the point: it knows things a kill counter cannot.

- **Every species the world can produce**, listed from the first time the player opens it. Unseen
  entries show as a masked name and a black silhouette, so the player can see how much is left.
- **Where each one lives** — recorded per biome, as the player discovers each one.
- **Whether they have ever seen a variant**, marked permanently.
- **Rarity and level band**, revealed once the species has been met.
- **Completion**, seen and caught, against the real species total.

Open it from the main menu (on by default — rename or disable it in the parameters), with the **Open
Field Guide** plugin command, or:

```js
SceneManager.push(Scene_ChimeraDex);
```

Everything about it is a parameter: mask unknown names or not, silhouette or hide, the caught and
variant markers, whether rarity is shown. Don't want this UI at all? Leave `ChimeraDexUI.js` out and
drive the engine yourself — the whole log is available through the script API below.

---

## Plugin commands

| Command | What it does |
|---|---|
| **Open Field Guide** | Pushes the guide scene |
| **Record Capture** | Logs a species as caught — call this from your capture plugin's success branch |
| **Break Chain** | Drops the current chain, as leaving an area would |
| **Report Completion** | Writes seen / caught / percent into game variables, for use in events |

**Record Capture** is the one you will most likely need. Sightings are logged automatically when a
creature appears in battle (turn that off with `Auto-Record Sightings`), but *catching* is whatever
your capture plugin does, so tell the guide about it there. Leave its Biome argument blank and it
uses wherever the player is standing.

---

## Script API

All of this is on `$chimeraField`.

```js
// Where am I, and what lives here?
$chimeraField.biomeHere()                       // "meadow", or null off-biome
$chimeraField.tableFor('meadow')                // the spawn table, or null
$chimeraField.biomes()                          // every registered biome name
$chimeraField.speciesIndex()                    // every species the world can produce

// Roll one encounter
var table = $chimeraField.tableFor('meadow');
var spawn = $chimeraField.roll(table, $chimeraField.contextHere(table));
// → { speciesId, level, variant, biome, empty }

// The player's log
var dex = $gameSystem.chimeraDex();
$chimeraField.Dex.recordSeen(dex, spawn);       // true if first sighting
$chimeraField.Dex.recordCaught(dex, spawn);     // true if first capture
$chimeraField.Dex.isSeen(dex, 7)
$chimeraField.Dex.isCaught(dex, 7)
$chimeraField.Dex.hasSeenVariant(dex, 7)
$chimeraField.Dex.seenCount(dex, 7)
$chimeraField.Dex.biomesFor(dex, 7)             // ["meadow", "cavern"]
$chimeraField.Dex.completion(dex, total)        // { seen, caught, total, seenPercent, caughtPercent }

// Chains
var chain = $gameSystem.chimeraChain();         // { speciesId, count }
$chimeraField.Chain.variantRate(chain);         // the 1-in-N this chain has earned
$chimeraField.Chain.break(chain);
```

**Determinism.** Every random draw comes from an injectable generator; `Math.random()` is never
called in spawn logic. Pass your own to make an encounter reproducible:

```js
var rng = $chimeraField.createRng(12345);
$chimeraField.roll(table, context, rng);        // same seed, same creature, every time
```

---

## Working with other plugins

**This plugin never decides whether a fight starts.** It extends exactly one encounter-related
method — `Game_Player.prototype.makeEncounterTroopId`, which RPG Maker calls *after* it has already
decided a battle is happening — and it falls straight back to the original whenever it cannot
answer: no biome, no table, nothing eligible, no enemy tagged, no single-enemy troop.

Steps, frequency, encounter regions, and on-map encounter effects all remain your encounter
plugin's job. Hakuen Studio, VisuStella, Casper Gaming — whatever you use, keep it.

Every core method is extended through a saved original, never replaced.

**One requirement:** each species needs a troop the plugin can use — either a troop containing only
that enemy, or an explicit `<chimera troop: N>` on the enemy.

---

## Chimera Core & Chimera Battle

The three plugins are independent products and each runs alone. Installed together they meet without
any of them importing another:

- **Chimera Field** decides which species appears, where, and at what level.
- **Chimera Battle** uses that level in the damage formula, and the type chart in the fight.
- **Chimera Core** supplies the genetics, breeding and storage for the one you caught.

They share the `<chimera species: N>` notetag, so a project already tagged for one is tagged for all.

**With Chimera Core installed**, captures log themselves: every route into the player's collection
goes through Core's storage, and the Field Guide records the capture and where it happened without
you calling anything. Variants are read from the creature's genome.

---

## Performance

The Field Guide draws only the rows inside the visible page. Measured in a real MZ project by
counting `drawItem` calls: a refresh issues **12** of them whether the world holds 48 species,
2,000, or 20,000. Draw cost is bounded by the window, not by the collection.

Measured frame cost in RPG Maker MZ (PIXI WebGL, 816×624, 48 species, guide open, 599 frames):

| Condition | Mean | % of the 16.67 ms budget |
|---|---|---|
| Guide open, idle | 1.96 ms | 11.8% |
| Scrolling at 10 rows/sec | 3.20 ms | 19.2% |
| A selection change every single frame | 5.52 ms | 33.1% |

An encounter roll allocates nothing: selection is a single weighted-reservoir pass with a running
total rather than building an array of eligible entries. The draw path reads through allocation-free
accessors, and the detail panel redraws only when the selected species actually changes.

These are frame **costs**, sampled from the engine's own update loop. They are not presented frame
rates — a browser throttles background windows, so presented pacing has to be confirmed by playing
the game with F2 open.

---

## Troubleshooting

**Nothing changed — I still get my normal encounters.**
The map has no biome tag, or the biome has no spawn table. Both are deliberate fall-throughs. Check
`$chimeraField.biomeHere()` in the console: `null` means the tag is missing or misspelled.

**A species never appears.**
Check, in order: is its enemy tagged `<chimera species: N>` with the right number; is there a troop
containing only that enemy; is it gated on a switch that is off, or a time/weather value that never
matches; is its rarity tier spelled the way the tier list spells it.

**The Field Guide is empty.**
It lists `speciesIndex()` — everything in your spawn tables. Empty tables, empty guide. If the
Plugin Manager shows no Spawn Tables parameter at all, the plugin file is truncated or corrupted;
re-copy it.

**Levels come out wrong / damage is tiny.**
Field only decides the level. What that level *means* is your battle system's business — see Chimera
Battle's Damage Scale parameter if you are using it with RPG Maker's default stat curves.

**Creatures from the previous map keep appearing.**
This was a real bug, fixed in 1.0.0. Make sure you are on 1.0.0 (`$chimeraField.VERSION`).

**A rarity error on boot.**
The message names the offending tier and lists the registered ones. It is thrown early on purpose —
a tier silently weighted to zero is a species that never appears anywhere, months later, with
nothing to point at.

---

## Licence

See `LICENSE.txt`. Commercial use permitted in your games, including sold and commissioned ones.
Redistribution of the plugin source itself, as an asset, is not.

Source ships raw and uncompressed. You bought a mechanic to build on — read it, debug it, extend it.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
