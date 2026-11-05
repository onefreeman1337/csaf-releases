# Niello: Generated Weapon and Armour Plates for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Niello: Generated Weapon and Armour Plates for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/niello  
**Docs published:** 2026-11-05


---

# Niello — Generated Arms & Armour Plates for RPG Maker MZ

**Version 1.0.1** · RPG Maker MZ · Core Systems Asset Factory

Every weapon and every piece of armour in your game draws its own engraved plate.
Niello reads your `Weapons` and `Armors` database and generates the object itself as
vector metalwork — blade, fuller, quillons, grip and pommel for arms; helm, cuirass,
boss and greave profiles for armour — composed from that item's own type, tier,
parameters, traits and element, and set in blackened silver inlay.

**Nothing ships as an image file.** There is no icon sheet, no atlas, no PNG. The
plates are drawn at runtime from 77 authored motifs.

**And the plate is not static.** It records what the item has *done*: strikes made,
enemies felled, criticals landed, damage borne. The same sword looks different at
hour 2 and hour 40.

---

## Installation

1. Copy the four files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the **Plugin Manager** and add them **in this order**:

   | # | File | What it is |
   | --- | --- | --- |
   | 1 | `NielloForms.js` | the motif corpus — data only, draws nothing |
   | 2 | `NielloArms.js` | the reader — database row to plate description |
   | 3 | `NielloPlate.js` | the renderer |
   | 4 | `Niello.js` | the product: parameters, commands, the Armoury scene |

3. Turn all four **ON**.

That is the whole installation. Niello works in a brand-new project with no other
plugins and no configuration at all — every item in your database gets a plate
immediately.

> **If the order is wrong**, `Niello.js` says so in the console by name rather than
> failing silently halfway through a scene.

---

## COMPATIBILITY

**Tested against:** stock RPG Maker MZ, loaded into an otherwise-empty project and
run in the real engine — the four plugins loading in order, the parameters and
commands reaching the Plugin Manager, the reader running over a live database, the
Armoury opening from a plugin command, and a save round-trip. 213 automated checks,
37 of them inside the engine.

**Not claimed:** Niello has **not** been tested alongside VisuStella MZ, Hakuen
Studio or any other third-party suite, because this studio does not own them. What
can honestly be said instead is structural, and it is the thing that actually
predicts interop: Niello reads the database and draws. It does not implement
equipping, upgrading, stat maths or crafting, and it touches four core methods — all
extended, none replaced (table below). It should therefore sit *beside* your
equipment plugin rather than competing with it. If you do hit a conflict, say so on
the store page and it will be looked at.

**Import order:** `NielloForms.js` → `NielloArms.js` → `NielloPlate.js` → `Niello.js`.
Place all four **below** any core/engine suite and **below** your equipment plugin.
Niello reads `$dataWeapons` / `$dataArmors` at the moment a plate is drawn, not at
load time, so anything above it that edits the database has already run.

**Core methods touched — 4, every one EXTENDED with its original saved and called,
0 replaced:**

| Method | Why | Can it be turned off? |
| --- | --- | --- |
| `Game_System.prototype.initialize` | create the history store | no (it is one assignment) |
| `Game_Action.prototype.apply` | count strikes, kills, criticals | **yes** — set *Track item history* to Off |
| `Window_MenuCommand.prototype.addOriginalCommands` | add the menu command | **yes** — set *Add "Armoury" to the menu* to Off |
| `Scene_Menu.prototype.createCommandWindow` | bind that command | **yes** — same parameter |

*Measured, not asserted: the figures above come from scanning the shipped source
against the real MZ runtime (164 classes, 3,600 methods), and the wording "0
replaced" is emitted only when the measured clobber count is actually zero.*

**Niello adds no windows.** The Armoury is built on `Scene_Base` and draws its own
chrome, so installing it cannot restyle anything else in your project.

---

## Using it

### Opening the Armoury

- **From the menu.** On by default; rename or remove it in the parameters.
- **From an event.** Plugin Command → `Niello` → **Open the Armoury**.

Up/Down move, PageUp/PageDown jump five, Cancel closes.

### Plugin commands

| Command | What it does |
| --- | --- |
| **Open the Armoury** | opens the scene |
| **Reforge an item** | increments that item's reforge count, which marks its plate |
| **Reset an item's history** | clears one item's record, or all of them |

### Parameters

| Parameter | Default | Notes |
| --- | --- | --- |
| Alloy override | `auto` | `auto` picks the metal from the item's tier |
| Show provenance lines | on | prints the history under the name |
| Track item history | on | off = plates are drawn from database data only |
| Track damage absorbed | on | records damage taken while armour is equipped |
| Add "Armoury" to the menu | on | |
| Menu command name | `Armoury` | |
| Include carried items | on | off = equipped items only |

---

## Notetags — all optional

Put these in a weapon's or armour's **Note** box to override what Niello derived.

```
<niello head:katana>      force the weapon form
<niello harness:cloak>    force the armour form
<niello guard:crowned>    <niello grip:wrapped>    <niello pommel:beast>
<niello inlay:frost>      <niello alloy:meteoric>
<niello tier:4>           force the tier, 0..4
<niello hide>             never draw a plate for this item
```

**A misspelt value is ignored and reported in the console — never silently
substituted.** A typo that quietly draws the wrong weapon is worse than one that
draws the default, because nothing tells you that you made it.

<details>
<summary>Every legal value</summary>

**head** — sword, greatsword, rapier, dagger, sabre, cleaver, katana, scythe, axe,
greataxe, halberd, spear, glaive, trident, mace, hammer, flail, staff, wand, bow,
crossbow, claw

**harness** — helm, greathelm, circlet, hood, cuirass, mail, robe, cloak, shield,
buckler, gauntlet, greave, ring, amulet

**guard** — none, bar, swept, lobed, cup, winged, ringed, horned, basket, crowned

**grip** — plain, corded, wrapped, ridged, riveted, twohand, gilt, bound

**pommel** — disc, wheel, scent, faceted, beast, ring, tear, crescent, knot, spike

**inlay** — none, vine, chevron, runes, scales, flame, wave, bolt, frost, eye,
tally, lattice, cross

**alloy** — steel, blued, bronze, silver, gilt, blackened, verdigris, meteoric, bone
</details>

---

## How a plate is decided

Nothing here needs configuring; it is listed so you can predict what you will get.

| Part of the plate | Comes from |
| --- | --- |
| the weapon's form | your `$dataSystem.weaponTypes` name, then the item's own name |
| the armour's form | the item's name, then its armour type, then its equip slot |
| the crossguard and grip | the item's **tier** — its price relative to the rest of your database |
| the pommel | the parameter the item boosts most |
| the inlay | the item's attack element, or its own identity when it has none |
| the alloy | the tier, unless you override it |
| notches, tallies, patina | the item's recorded history |

**Tier is relative to *your* database, not to an absolute price.** A game whose best
sword costs 800g and a game whose best sword costs 90,000g both get a full spread of
tiers.

**Renamed everything?** That is fine. Unknown weapon types and renamed elements still
resolve to distinct, stable forms — they are derived from the item's identity, so
they never change between sessions or machines.

---

## One honest limitation

**RPG Maker MZ has no item instances.** `$gameParty` stores a *count* of
`$dataWeapons[7]`, not seven individually-tracked swords. So history is kept **per
item ID**: if the player owns three Iron Swords, they share one record.

That is a limit of the engine rather than a shortcut here, and there is no way around
it without replacing MZ's inventory wholesale — which would break every other plugin
you own. It is stated plainly so you can decide before you buy.

---

## Performance

Plates are drawn **once** into a bitmap and then blitted, so a plate on screen costs
one sprite per frame. The Armoury's per-frame path allocates nothing — no object or
array literals, no closures, no `map`/`filter`/`slice` — and that is enforced by a
static scan of the shipped source, proven to fire against a deliberately broken copy.

Verified in the real engine: **0 stock windows, 0 stock buttons, 0 `img/system` art**
in the Armoury, measured against a detector first proven to report 53 leaks on a
stock MZ menu.

---

## Saving

The history record is plain versioned data on `$gameSystem`, so MZ saves it with no
extra hook. It round-trips losslessly, tolerates garbage from an edited save, and a
record written by a *newer* version of Niello is passed through rather than reset —
loading a newer save in an older build will not destroy an accumulated history.

---

## Terms

Commercial and non-commercial use in RPG Maker MZ projects, unlimited games, no
royalties. Do not redistribute the plugin files themselves. Full terms in
`LICENSE.txt`.

**Support:** <https://csaf.itch.io/niello>

---

## Also from Core Systems Asset Factory

Generated-art systems for MZ, each drawing its own artwork from your own data:

- [**Sigil Core**](https://csaf.itch.io/sigil-core) — every spell draws its own animated seal
- [**Asterism**](https://csaf.itch.io/asterism) — a constellation skill tree where every node draws its own star
- [**Formulary**](https://csaf.itch.io/formulary) — every recipe draws its own alchemical plate
- [**Hallmark**](https://csaf.itch.io/hallmark) — every item struck with its own guild mark
- [**Herbarium**](https://csaf.itch.io/herbarium) — every reagent mounted as a botanical plate
- [**Armorial**](https://csaf.itch.io/armorial) — a coat of arms generated from what the playthrough actually did
- [**Lineage**](https://csaf.itch.io/lineage) — a branching evolution atlas of generated specimen marks


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
