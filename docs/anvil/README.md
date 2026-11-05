# Anvil: Forging Minigame for Crafting in RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Anvil: Forging Minigame for Crafting in RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/anvil  
**Docs published:** 2026-11-05


---

# Anvil for RPG Maker MZ

**A hot-metal forging minigame that plugs into your crafting.** The player works a glowing bar on the anvil toward a
pattern chalked on its face. They read the heat by the colour of the metal, the way a smith does: blows move hot metal
and crack cold metal, the hearth reheats it a limited number of times, and the quench fixes the result, best at cherry
red. Then the piece is shown finished, polished and hilted, exactly as the player shaped it, and its quality goes back
to your events.

Everything on screen is drawn by the plugin: the smithy, the anvil, the bar at every heat from black to white with its
glow, sparks off every blow, the colour chart on the wall, steam from the quench, and the finished weapon. Nothing is
loaded from an image file.

## The pattern is your weapon

Name a weapon from your database and the pattern is generated from it:

- the **weapon type** picks the family: `sword`, `dagger`, `axe`, `spear`, `mace` or `claw` (staves, rods and wands
  forge as a rod with a worked head, the `mace` family; bows, crossbows, guns and whips are not forged metal and fall
  back to a `sword` blade, so set the family yourself if you forge them);
- the **weapon's name** picks the metal: `steel`, `iron`, `bronze`, `mithril` or `blacksteel` (for example "Mithril
  Sword" forges in mithril);
- the weapon's **id, name and attack** pick its proportions: blade width and taper, point (spear, clip, round, leaf),
  ricasso and tang, an axe head's poll, eye and bit, a mace head's flanges.

Measured on MZ's own stock database: its 40 named weapons give 40 distinct patterns across all six families. Over 240
generated patterns, all 240 were distinct.

## Skill decides the grade

A blow moves the metal a fixed step toward the pattern, larger when the metal is hotter, so white heat roughs a shape
out and a cooler bar takes finer work; a blow where the metal is already right overshoots it. A blow on metal below
blood red cracks it. The quality (0 to 100) weighs the shape (60%), the quench (25%) and the heats used (15%), less 8
for each crack, and gives a grade: **Crude** (under 40), **Serviceable** (40), **Fine** (65), **Masterwork** (85).

Measured over 240 pieces per difficulty (all six families), a player who strikes where the bar most needs it and
keeps a heat for the quench reached Masterwork 239 times on easy, 187 on normal and 86 on hard, and never fell below
Fine on easy or normal. A player hammering at random reached at most 43 on easy, 40 on normal and 67 on hard, and 95%
of their pieces stayed below Fine; none reached Masterwork.

| Difficulty | Heats allowed | Cooling |
| --- | --- | --- |
| easy | 6 | slow |
| normal | 5 | medium |
| hard | 4 | fast |

## Installing

Copy the three files into `js/plugins` and add them in the Plugin Manager in this order, top to bottom:

1. `AnvilCore.js`: the patterns, the metal and the score
2. `AnvilDraw.js`: the drawing
3. `Anvil.js`: the Open Anvil command and the scene

## Opening the forge

Add the plugin command **Anvil > Open Anvil** to an event:

| Argument | What it does |
| --- | --- |
| Weapon to forge | The pattern is generated from this weapon. None gives a generated blade. |
| Family (override) | `auto` (from the weapon type), or one of the six families. |
| Difficulty | `easy`, `normal` or `hard`. |
| Variable: quality (0-100) | Set to the quality when the piece is quenched; 0 if the player left without quenching. |
| Variable: grade (1-4) | 1 Crude, 2 Serviceable, 3 Fine, 4 Masterwork; 0 if the player left without quenching. |
| Switch: on at the bar | Turned on when the quality reaches "Quality for the switch", off when it does not. |
| Quality for the switch | Default 65 (Fine). |
| Give the weapon at the bar | When ON, the weapon is added to the party if the quality reaches the same bar. |
| Title | Shown on the work order. Blank uses the weapon's name. |
| Seed | Blank keys the pattern to this map, event and weapon: the same pattern every visit. |

The event waits while the player works, then continues.

## With your crafting system

Anvil is the step where the player makes the thing; it does not replace a crafting system. Open it from the event
that crafts, or right after your crafting plugin's craft, then read the quality variable and decide what it means in
your game (a stat bonus, a better item, a name, a price). `Give the weapon at the bar` covers the simple case with no
crafting plugin at all.

## Controls

- **Left / right** move the hammer along the bar. **OK** strikes. **Shift** puts the bar back in the hearth. **Q**
  quenches. **Escape** leaves without quenching.
- **Mouse / touch**: click the bar to strike there; click the Strike, Reheat and Quench plaques; right-click leaves.

The colour chart on the wall is the heat gauge: its pointer rides the bar's colour, and the quench band is marked.

## Script calls

```js
Anvil.record("m3e12w5")   // { best, grade, times } for that forge and weapon
Anvil.forgedCount()       // how many pieces the player has finished
Anvil.lastResult          // { quality, grade, gradeName, shape, quench, heats, strikes, flaws } of the last piece
```

## Parameters

| Parameter | Default |
| --- | --- |
| Sound: a hammer blow | Hammer |
| Sound: a blow on cold metal | Break |
| Sound: into the hearth | Fire1 |
| Sound: the quench | Water1 |
| Sound: the piece finished | Item3 |

## Compatibility

Anvil adds its own scene and replaces nothing. It extends one engine method, `Game_System.initialize`, calling the
original first, to create its save record (`$gameSystem._csafAnvil = { v: 1, forged: {...} }`). It draws no window,
so window skin plugins do not change it.

## Terms

Commercial and non-commercial use in RPG Maker projects. See LICENSE.txt. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
