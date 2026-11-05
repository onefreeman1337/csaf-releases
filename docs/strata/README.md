# Strata - Generated Excavation Digs for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Strata - Generated Excavation Digs for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/strata  
**Docs published:** 2026-11-05


---

# Strata for RPG Maker MZ

**Generated excavation digs.** Give the player a rock face and two tools. Every blow cuts the rock back and puts
stress on the face; somewhere under it lie fossils, relics, crystals or ore. Free a find completely before the
face gives way and it is theirs. Push too hard and the face collapses, taking whatever is still buried with it.

- **Pick**: 2 layers at the target, 1 on the four cells beside it. Stress 2.
- **Hammer**: 2 layers at the target and beside it, 1 on the diagonals. Stress 4.
- **Bedrock** (dark stones) cannot be cut.
- A find freed by the very blow that brings the face down still counts.

Every site is generated from a seed: the finds, the bedrock, the thickness of the rock and the stability of the
face. Stability is derived from how a careful digger does on that exact site, so no site is impossible and the
grade decides how forgiving it is. Nothing is loaded from an image file.

## Installing

Copy the three files into `js/plugins` and add them in the Plugin Manager in this order, top to bottom:

1. `StrataCore.js`: the generator and the rules
2. `StrataDraw.js`: the drawing
3. `Strata.js`: parameters, the Open Dig command, the scene

## Making a dig

Add the plugin command **Strata > Open Dig** to an event:

| Argument | What it does |
| --- | --- |
| Grade | 1 (forgiving) to 5 (hard). 0 uses the Default grade parameter. |
| Rock | `sandstone`, `shale`, `limestone`, `clay`, `basalt` or `auto`. |
| Items that can be found | Each find becomes one of these items, in order. Empty: finds are drawn but give no item. |
| Title | Shown above the face. Blank names it after the rock. |
| Switch if every find is freed | Turned ON only when the whole face is cleared. |
| Variable: finds freed | Receives how many finds were freed. |
| Dig once | If ON, the same event re-opens the face worked out, with nothing more to find. |
| Seed | Blank keys the site to this map and event. |

The event **waits** while the player digs, then continues.

### What each find looks like

Add a note to the item:

```
<Strata: ammonite>
```

Families: `ammonite`, `trilobite`, `bone`, `tooth`, `amber`, `geode`, `ore`, `crystal`, `tablet`, `shell`. Without
a note the item's name is read for a hint (fossil, amber, crystal, gem, ore, gold, bone, fang, tooth, shell, tablet,
rune, geode); otherwise the seed chooses.

## Grades

| Grade | Finds | Bedrock stones | How forgiving |
| --- | --- | --- | --- |
| 1 | 2 | 1 to 2 | about 9 in 10 careful diggers clear the whole face |
| 2 | 2 to 3 | 2 to 3 | about 3 in 4 |
| 3 | 3 | 2 to 4 | about 3 in 5 |
| 4 | 3 to 4 | 3 to 4 | a little under half |
| 5 | 4 | 3 to 5 | about 2 in 5 |

(Measured over 600 generated sites with a model of an attentive digger. An exceptional digger always can: every
site is proven clearable within its stability.)

## Controls

- **Arrow keys** move the mark. **OK** strikes. **Q / W** (page up / page down) or **Shift** switch tools.
- **Escape** packs up and leaves, keeping every find that is already free.
- **Mouse / touch**: click a cell to strike it; click a tool to take it.

## Script calls

```js
Strata.dugAt("m3e12")   // { freed, total } once that site has been dug, else null
Strata.keyFor(3, 12)    // "m3e12"
```

## Parameters

| Parameter | Default |
| --- | --- |
| Default grade | 2 |
| Sound: pick strike | Blow1 |
| Sound: hammer strike | Blow3 |
| Sound: find freed | Item3 |
| Sound: collapse | Collapse4 |
| Sound: change tool | Cursor2 |

## Compatibility

Strata adds its own scene and replaces nothing. It extends one engine method, `Game_System.initialize`, calling the
original first, to create its save record (`$gameSystem._csafStrata = { v: 1, dug: {...} }`). It draws no window,
so window skin plugins do not change it.

## Terms

Commercial and non-commercial use in RPG Maker projects. See LICENSE.txt. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
