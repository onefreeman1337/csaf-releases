# Formulary — Generated Recipe Plates for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Formulary — Generated Recipe Plates for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/formulary  
**Docs published:** 2026-11-05


---

# Formulary — generated recipe plates for RPG Maker MZ

**Every recipe in your game draws its own alchemical plate.**

Formulary reads the recipes you have already written and draws each one as a formulary page: the
reagents set as glyphs in a graduated ring, their proportions as an arc *and* as notation, the
process as the vessel the diagram is built on, and the result struck at the centre.

Nothing is a picture file. **58 authored motifs across four axes combine into 33,600 distinct
plate forms, and nine palettes take that to 302,400.** No PNG, no atlas, no icon sheet. Your plates
look like *your* recipes because they are drawn *from* your recipes — a four-ingredient recipe draws
four different glyphs, so a plate's information content rises with the recipe's own complexity.

---

## Install

Copy the four files from `js/plugins/` into your project's `js/plugins/` folder, then add them in
the Plugin Manager **in this order**:

```
1. FormularyGlyphs.js     the corpus (data only, draws nothing)
2. FormularyPlate.js      the renderer
3. FormularyRecipes.js    the database reader
4. Formulary.js           parameters, commands, the scene
```

**Order matters.** If one is missing or loads too late, Formulary disables itself and prints exactly
which file is absent to the console (F8) rather than half-working. A plugin that silently does
nothing is the worst thing that can happen to you at 2am.

---

## Declaring a recipe

Put the recipe on the **result** — the item, weapon or armor it makes.

```
<Formulary>
in: 3 Iron Ore
in: 1 Pine Resin
in: Emberflower
process: alembic
tier: exquisite
yield: 2
</Formulary>
```

Or the one-liner:

```
<FormularyIn: 3 Iron Ore, 1 Pine Resin, Emberflower>
```

Quantities accept `3 Iron Ore`, `Iron Ore x3` and `Iron Ore * 3`. **No number means one.** A written
zero is read as one, because an ingredient you need none of is not an ingredient.

| line | optional? | what it does |
| --- | --- | --- |
| `in:` | at least one | an ingredient, by the name in your database |
| `process:` | yes | which vessel the plate is built on — see the list below |
| `tier:` | yes | which border frames the plate |
| `yield:` | yes | how many the recipe makes. Default 1 |
| `palette:` | yes | force a palette instead of deriving one |
| `seal:` | yes | force the centre mark instead of deriving one |

### Everything optional is DERIVED if you leave it out

You do not have to notetag two hundred items to get a coherent formulary. Formulary works out the
rest from what your database already says, in this order:

1. an explicit notetag
2. a **material keyword** in the item's own name
3. the item's own database facts — weapon type, equip slot, consumability, damage element, price
4. a deterministic hash of the name

Step 4 is a hash, **never** a random number: an item Formulary cannot recognise still gets the same
mark on every launch, on every machine, forever.

**The keyword table is built from material FAMILIES, not from item names**, so `resin` matches Pine
Sap, Amber Tear *and* Bog Pitch — none of which contains the word. There are 24 families covering
ore, ingot, crystal, salt, stone, ash, leaf, root, seed, flower, fungus, resin, hide, bone, scale,
feather, venom, cloth, thread, glass, essence, rune, relic and catalyst.

If it guesses wrong, pin it on the **ingredient**:

```
<FormularyGlyph: bone>
```

### The vessels (`process:`)

`alembic` · `crucible` · `mortar` · `anvil` · `kiln` · `still` · `loom` · `hearth` · `press` ·
`circle`

### The tiers (`tier:`)

Either a border name — `plain` `double` `ruled` `corner` `keyed` `laurel` `studded` `notched`
`banded` `radiant` — or a word: `crude` `common` `sturdy` `fine` `superior` `master` `rare`
`exquisite` `heroic` `legendary`. Leave it out and the tier is ranked from the result's price.

### The palettes

`vellum` · `foolscap` · `blueprint` · `ledger` · `slate` · `copperas` · `verdigris` · `cinnabar` ·
`nocturne`

---

## Discovery

A plate the player has not earned renders **redacted**: the ring shows how many components the
recipe takes and nothing else, the result name is struck out, and the notation reads `?? ————`. Each
component resolves the first time the party obtains that ingredient, so the plate fills in as they
explore.

Turn that off with **Discover On Obtain** and drive it from events instead.

---

## Plugin commands

| command | what it does |
| --- | --- |
| **Open Formulary** | opens the scene |
| **Reveal Component** | marks one ingredient known, on every recipe that uses it |
| **Reveal Recipe** | marks one whole recipe known |
| **Reveal All** | everything. Useful for a demo or a new game plus |
| **Reset Discovery** | forgets everything |
| **Query Recipe Known** | writes whether a recipe is fully known into a switch |

## Parameters

| parameter | default | |
| --- | --- | --- |
| Scene Palette | `slate` | the colours of the book itself. Each plate still uses its own |
| Plate Palette | `auto` | `auto` derives one per result; anything else forces it |
| List Undiscovered | on | show sealed entries in the index, or hide them entirely |
| Discover On Obtain | on | resolve a component when the party first obtains it |
| Show In Main Menu | on | add a Formulary command to the main menu |
| Menu Command Name | `Formulary` | the wording of that command |
| Menu Switch | 0 | switch that must be ON for the command to appear. 0 = always |

---

## Compatibility

**You do not need a crafting plugin.** Formulary reads your own `$dataItems`, `$dataWeapons`,
`$dataArmors` and `$dataSystem` — the things every MZ project already has — so it stands alone.

If you *do* use a crafting plugin, register it as an extra source and its recipes are **added** to
the ones your database declares. An adapter can never replace the database read, so your hand-written
recipes cannot disappear because you installed something else:

```js
CSAF.FormularyRecipes.registerSource(function () {
  return [{ resultName: 'Healing Salve', ingredients: [{ name: 'Herb', qty: 2 }] }];
});
```

### What Formulary touches in the engine

It **extends four core methods and one core static, and clobbers none** — every original is saved
and called. Measured from the shipped source, not from memory:

| method | why |
| --- | --- |
| `Game_Party.prototype.gainItem` | to notice a newly obtained ingredient |
| `Scene_Boot.prototype.start` | to check the load order once, after every plugin has loaded |
| `Window_MenuCommand.prototype.addOriginalCommands` | only when **Show In Main Menu** is on |
| `Scene_Menu.prototype.createCommandWindow` | only when **Show In Main Menu** is on |
| `DataManager.makeSaveContents` | to keep the live cache out of your save file |

**Its own scene contains no `Window_Base` at all.** That is a deliberate design decision, not a side
effect: Formulary cannot restyle anything in your project, cannot touch your windowskin, and cannot
change how any other scene looks. Verified in-engine — zero windows, zero touch-UI buttons and zero
`img/system` art in the Formulary scene, checked again after 90 further frames.

Tested alongside stock MZ scripts. It adds one scene, reads the database, and writes one versioned
record into your save.

### Saves

Formulary writes a single versioned record to `$gameSystem`. Its live cache is held on a
non-enumerable property, so it is invisible to every serialisation path — including
`JsonEx.makeDeepCopy`, which some plugins call directly and which bypasses the normal save hook.
Your save does not carry it, and discovery survives a round trip losslessly.

---

## Performance

A plate is drawn **once** to a Bitmap and cached; it is never redrawn per frame. The cache is
bounded. The index list is virtualised — only the visible rows are drawn, whatever the size of your
recipe list.

---

## Terms

Free for use in commercial and non-commercial RPG Maker MZ projects. Credit is appreciated and not
required. Do not resell or redistribute the plugin files themselves.

Copyright (c) 2026 Core Systems Asset Factory.

---

## More from Core Systems Asset Factory

Every plugin in the catalogue is at **<https://csaf.itch.io>**.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
