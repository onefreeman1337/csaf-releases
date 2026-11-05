# Patina — Every Item Shows What It Has Been Through — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Patina — Every Item Shows What It Has Been Through  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/patina  
**Docs published:** 2026-11-05


---

# Patina — every item shows what it has been through

**RPG Maker MZ · five plugin files · no image assets · raw readable JavaScript**

Patina draws your weapons and armour as the objects they have *become*. A blade
that has been honed carries a bright bevel and a bitten edge. A bronze buckle
grows verdigris out of its joints. A leather grip cracks along the line it bends
on, and darkens where a hand has held it. Gilding wears off the high points
first and nowhere else.

It reads whatever condition your project already tracks and turns the **number**
into the **picture**.

---

## What it actually does

* **20 gear forms** — arming sword, falchion, dagger, war axe, warhammer,
  flanged mace, spear, hunting bow, crossbow, kite shield, buckler, great helm,
  mail coif, cuirass, gauntlet, greave, signet ring, amulet, brooch, war belt.
* **11 materials, each with its OWN decay mode** — iron and steel rust from
  their rivets, bronze and copper grow verdigris out of seams, silver tarnishes
  across its flats, gold does not corrode at all and instead abrades on the high
  points, leather cracks, wood splits, linen frays, bone and horn chip.
* **14 kinds of wear mark** — nick, chip, dent, tear, fray, lost fitting, bloom,
  creep, film, pit, crack, hone, polish, worn gilt.
* **6 condition states** — Pristine, Keen, Worn, Battered, Failing, Ruined.
* **An Armoury scene** that lists your gear and draws the selected piece large,
  with its material, its state and its condition.

**51 authored entities.** Nothing is a shipped PNG; there is no atlas and no
sprite sheet. Every object is drawn by code at whatever size you ask for.

### Wear is not a darkening filter

The thing that makes this a product rather than an overlay: **wear changes the
object's shape, not just its colour.** A ruined blade physically loses material
— measured on our own test plate, about **a fifth of its silhouette** — its
point breaks, and its pommel stone goes missing. A frayed linen edge goes ragged
all the way round. That is why six condition states read as six different
objects instead of one object at six brightnesses.

And one axis runs the *other* way: a **honed** blade is brighter and keener than
a pristine one. Use is not only decay.

---

## Installation

1. Copy the five files from `js/plugins/` into your project's `js/plugins/`.
2. Turn them all on in the Plugin Manager.

**Order does not matter.** Every file resolves its siblings the first time it is
used, so any order works — including the alphabetical order the Plugin Manager
produces when you drag the folder in.

---

## Compatibility

Tested against a stock RPG Maker MZ project (`v1.8.0` runtime layout), with the
plugins loaded in **alphabetical** order, which is the worst case.

* Patches nothing. Patina adds a scene and reads your database; it does not
  extend, wrap or replace any core engine method.
* Therefore it does not conflict with VisuStella, CGMZ, or any durability,
  crafting or equipment plugin. It is a **display layer** and is designed to sit
  above whatever system you already own.
* Save data is untouched — Patina stores nothing in the save file.

---

## Where condition comes from

Three sources, most specific first.

**1. A variable block** — set `Condition variable base` in `PatinaBind` to a
variable id `N`. Patina then reads variable `N + itemId` as a 0–100 value. This
is how you drive Patina from a durability plugin you already own: point both at
the same block. Neither plugin needs to know about the other.

**2. A notetag** on the weapon or armour:

```
<durability:40/100>
<durability:40>          <- the same thing; max defaults to 100
```

The tag name is a plugin parameter, so set it to whatever your existing system
already writes.

**3. The `Default condition` parameter**, for everything else.

---

## Opening the Armoury

Plugin command **`PatinaScene → Open the Armoury`**, or from script:

```js
SceneManager.push(Scene_Patina);
```

Up/Down move, Page Up/Page Down jump, Cancel closes.

By default it lists what the party is actually carrying. Turn
`Only show carried gear` OFF to list the whole database, which is useful while
you are authoring.

---

## Overriding what an item is drawn as

Patina works out the form from the equip type and the material from the price,
because that is all RPG Maker MZ exposes. It gets most rows right and it cannot
tell a bandana from a helm — to the engine both are "head slot, cheap".

So any row can say what it is:

```
<patina:form=war-belt>
<patina:material=linen>
```

Either tag on its own is fine. An unrecognised value is ignored rather than
throwing, so a typo costs you the override and never a crash.

**Forms:** `arming-sword` `falchion` `dagger` `war-axe` `warhammer` `mace`
`spear` `hunting-bow` `crossbow` `kite-shield` `buckler` `great-helm`
`mail-coif` `cuirass` `gauntlet` `greave` `signet-ring` `amulet` `brooch`
`war-belt`

**Materials:** `iron` `steel` `bronze` `copper` `silver` `gold` `leather`
`wood` `bone` `linen` `horn`

---

## Two honest limits

**RPG Maker MZ has no individual item instances.** The engine stores a *count*
per database id, so three iron swords are "3 of item 4" and not three objects
with three separate histories. Patina therefore ages an item **type** at a
condition. It will not remember that one particular sword was the one you
carried through the swamp, because the engine cannot store that and neither can
any plugin.

**Wear is an outline-scale change, so it needs room to read.** A 32×32 icon
cannot show a rolled edge or verdigris in a joint — that is arithmetic, not
taste. Patina therefore owns a scene where the object is drawn large. If you
want the effect at icon size, expect the colour shift to carry it and the
silhouette detail to be lost.

---

## Extending it

`PatinaCorpus.js` is pure data: materials, decay modes, wear marks and the six
states. `PatinaGear.js` holds the forms, each a list of parts with an outline,
a role, and the joints corrosion grows out of. Adding a form is adding one entry
to that table. Everything is commented and nothing is minified.

---

© Core Systems Asset Factory. See `LICENSE.txt`.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
