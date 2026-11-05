# Scales - Counterfeit Coin and Weighing Puzzles for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Scales - Counterfeit Coin and Weighing Puzzles for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/scales  
**Docs published:** 2026-11-05


---

# Scales for RPG Maker MZ

**Weighing puzzles for your game, on a brass balance at a money-changer's counter.** Two puzzles:

- **The counterfeit.** A hoard of identical coins hides one false coin, lighter or heavier than the rest. The player
  puts coins on the two pans, weighs, reads the beam, and names the false coin (and whether it is heavy or light, if
  they were not told) within a set number of weighings. The coin they name is cut open with a banker's chisel.
- **The measure.** Weigh out an exact order of goods (saffron, pepper, salt, tea...) with a box of weights. A weight may
  go in either pan. When the order is right the beam comes to rest level and the goods are packed and sealed.

Every mint (metal, device, rim and legend), every hoard and every order is generated from a seed. Nothing is loaded
from an image file.

## Every counterfeit puzzle is fair, and cannot be guessed

The number of weighings allowed is the **fewest that always suffice**, found by an exact search of the whole game
before the puzzle is shown. For a hoard of `n` coins:

| Coins | Told heavy or light | Not told (and must say which) |
| --- | --- | --- |
| 3 | 1 | 2 |
| 4 to 9 | 2 | 3 |
| 10 to 12 | 3 | 3 |
| 13 | 3 | 4 |

The false coin is **not fixed in advance.** After every weighing it is wherever the weighings so far leave it best
hidden. So a correct method always wins, and a lucky guess never does: naming a coin while the weighings still allow
another one reveals that other one instead. Whatever the player is shown at the end, it agrees with every weighing
they made.

Measured on the shipped code: the solver's own method, played through every one of 360 generated puzzles (120 per
difficulty), found the coin within the weighings allowed in all 360. A guess before any weighing won 0 of 200 times.

## The measure

Five weight boxes: the ternary set (1, 3, 9, 27), the doubling set (1, 2, 4, 8, 16), the apothecary's set (1, 2, 5, 10,
20), the spicer's set (2, 3, 7, 15, 25) and the assayer's set (1, 4, 6, 13, 22). Every order is checked, before it is
offered, to be possible with its box.

- **easy**: the order can be made with weights on one pan (at least two of them).
- **normal**: the order cannot be made on one pan. A weight must go in with the goods.
- **hard**: as normal, and it needs at least three weights.

The player places the weights and weighs. The ledger records every weighing and the fewest weights the order needs.

## Mints

Five metals (`gold` crowns, `silver` marks, `copper` pence, `electrum` staters, `bronze` obols), six devices (`star`,
`rosette`, `cross`, `sun`, `crescent`, `tower`) and three rims (`beaded`, `milled`, `rope`), each with its own
proportions (points, petals, rays, pellets, an inner ring) and a legend struck round the edge. Measured over 3,000
seeds the generator struck 2,913 distinct coins, covering all 90 metal, device and rim combinations.

A counterfeit's cut shows what it is made of: lead in a heavy one, copper under gold, silver or electrum in a light
one, tin under copper or bronze.

## Installing

Copy the three files into `js/plugins` and add them in the Plugin Manager in this order, top to bottom:

1. `ScalesCore.js`: the generator, the solver and the counterfeiter
2. `ScalesDraw.js`: the drawing
3. `Scales.js`: the Open Scales command and the scene

## Opening a puzzle

Add the plugin command **Scales > Open Scales** to an event:

| Argument | What it does |
| --- | --- |
| Puzzle | `counterfeit` or `measure`. |
| Difficulty | `easy`, `normal`, `hard` or `auto`. Counterfeit: easy = told heavy or light, 1 or 2 weighings; normal = 3 weighings; hard = 10 to 12 coins, not told, 3 weighings. |
| Coins in the hoard | Counterfeit only. 0 = chosen by the difficulty. 3 to 13 = this many coins. |
| Metal | One of the five metals, or `auto`. |
| Device on the coins | One of the six devices, or `auto`. |
| Switch: on when solved | Turned on when the puzzle is solved. |
| Variable: 1 solved, 2 wrong coin, 0 left | Set when the player finishes or leaves. |
| Title | Shown on the card. Blank names it after the mint or the order. |
| Seed | Blank keys the puzzle to this map and event: the same puzzle every visit. |

The event waits while the player works, then continues. The variable is set to 1 when the puzzle is solved, 2 when
the player named the wrong coin, and 0 when they left without an answer; the switch turns on only when the puzzle is
solved. A solved puzzle reopens at its verdict. An unsolved
counterfeit puzzle starts afresh on the next visit.

## Controls

- **Arrow keys** move between the coins (or weights) and the three brass plaques.
- **OK** on a coin moves it: tray, left pan, right pan, back to the tray. On a weight: box, far pan, goods pan, box.
- **Shift** weighs (the pans must hold the same number of coins).
- The plaques: **Weigh**, **Clear the pans**, and **Name the false coin** (then choose the coin, then Heavier or
  Lighter if the direction was not told). In the measure, the third plaque is **Leave the counter**.
- **Escape** backs out of naming a coin, or leaves.
- **Mouse / touch**: click a coin, a weight or a plaque; right-click leaves.

The beam is held level while the pans are loaded, and is released when the player weighs.

## Script calls

```js
Scales.record("m3e12")    // { done, won, tries } for that puzzle
Scales.solvedCount()      // how many puzzles the player has solved
```

## Parameters

| Parameter | Default |
| --- | --- |
| Sound: a coin or weight moved | Coin |
| Sound: the beam released | Chain |
| Sound: solved | Chime2 |
| Sound: the wrong coin named | Buzzer2 |

## Compatibility

Scales adds its own scene and replaces nothing. It extends one engine method, `Game_System.initialize`, calling the
original first, to create its save record (`$gameSystem._csafScales = { v: 1, puzzles: {...} }`). It draws no window,
so window skin plugins do not change it.

## Terms

Commercial and non-commercial use in RPG Maker projects. See LICENSE.txt. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
