# Tray - Packing Puzzle Minigame in Inlaid Wood for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Tray - Packing Puzzle Minigame in Inlaid Wood for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/tray  
**Docs published:** 2026-11-05


---

# Tray for RPG Maker MZ

**A packing puzzle for your game, generated and drawn in inlaid wood.** A shaped tray sits on the table and its
pieces wait in a box beside it, turned every which way. The player picks them up, turns and flips them, and fits
every one back into the tray. When the last piece goes in, the tray is a finished marquetry panel, and the result goes
back to your events.

Everything on screen is drawn by the plugin: the workbench, the black japanned case with its brass fillet and baize
lining, the parts box, every piece in its own wood with its grain, stringing and inlay, and the finished panel.
Nothing is loaded from an image file.

## Every puzzle is generated, and every one can be solved

The tray comes in six shapes: `rect`, `cross`, `diamond`, `round`, `notched` and `arch`. It is carved into pieces of
three to six squares, all different even turned or flipped, so the pieces always go back: every puzzle is solvable by
construction. The box is sized so each shape holds about the same area per piece, so a diamond is not easier than a
rectangle.

| Difficulty | Pieces |
| --- | --- |
| easy | 4 or 5 |
| normal | 6 or 7 |
| hard | 8 to 10 |

A built-in solver grades each puzzle by how many **different** ways the tray can be filled (two fillings that are the
same picture turned or flipped over count once). The generator carves up to four trays for easy, five for normal and
six for hard, grades each within a search budget of 150,000 steps, and keeps the first that is tight enough for the
difficulty (at most 4 different ways for easy, 12 for normal, 40 for hard), or the tightest it found.

Measured over 120 puzzles per difficulty:

- **easy:** all 120 fill at most 4 different ways; 52 fill exactly one way; the median is 2.
- **normal:** 116 of 120 fill at most 12 different ways; the median is 5.
- **hard:** 81 of 120 fill at most 40 different ways; the median is 17. Hard trays are big, and 25 of the 120 still
  fill more than 200 ways: with 8 to 10 pieces they are hard for their size, not for being unique.

Over 200 seeds per difficulty the generator gave 183 different easy puzzles, 200 different normal ones and 200
different hard ones. Easy trays are small, so an easy puzzle repeats now and then.

## Every piece is marquetry

Each piece is cut from one of ten woods, each with its own colour and figure: **walnut**, **maple** (fiddleback),
**cherry**, **oak** (ray flecks), **ebony**, **ash**, **rosewood** (dark streaks), **yew**, **olive** (wild grain) and
**holly**. No two pieces in one puzzle share a wood. Each carries an inlaid motif (star, lozenge, rosette, bars,
chevron, dot, ring, cross, leaf or wave) in brass, mother-of-pearl, holly or ebony, chosen to show against its wood,
with a line of stringing run just inside its edge. The grain and the inlay turn and flip with the piece, as they would
on a real one; the light does not.

## Installing

Copy the three files into `js/plugins` and add them in the Plugin Manager in this order, top to bottom:

1. `TrayCore.js`: the generator, the solver and the rules
2. `TrayDraw.js`: the drawing
3. `Tray.js`: the Open Tray command and the scene

## Opening a tray

Add the plugin command **Tray > Open Tray** to an event:

| Argument | What it does |
| --- | --- |
| Difficulty | `easy`, `normal` or `hard`. |
| Tray shape | `auto` (chosen by the seed), or one of the six shapes. |
| Hints allowed | 0 to 99, default 3. |
| Variable: moves | Set to the number of pieces the player put down when the tray is filled; 0 if the player left. |
| Variable: hints used | Set to the hints used when the tray is filled. |
| Switch: on when solved | Turned on when the tray is filled, off if the player left. |
| A new puzzle each time it is solved | OFF: the same event always deals the same puzzle. ON: each solve at that event deals a fresh one. |
| Title | Shown on the brass plate. Blank reads "The Cabinetmaker's Tray". |
| Seed | Blank keys the puzzle to this map and event. |

The event waits while the player works, then continues.

## Hints

A hint looks for a way to finish that keeps every piece the player has already placed. If there is one, it puts one
more piece in (a hint is not counted as a move). If there is none, it takes the piece that has to come out back to
the box. Each counts as one hint.

## Controls

- **Keyboard and gamepad:** left and right choose a piece (a brass pointer marks it), **OK** picks it up, the
  **arrows** move it over the tray, **Q** and **W** turn it, **Shift** flips it, **OK** puts it down, **Cancel** puts
  it back where it was. **Tab** asks for a hint. **Escape** leaves.
- **Mouse and touch:** drag a piece onto the tray; while holding it, the **right button** or the **wheel** turns it.
  Where it would land is outlined on the cloth, gold if it fits and red if not; let go on a red outline, or off the
  tray, and it goes back to the box. Click the Turn, Flip, Hint and Leave plaques. Right-click on the table leaves.

## Script calls

```js
Tray.record("m3e12")   // { times, bestMoves, hints } for that event
Tray.solvedCount()     // how many trays the player has filled
Tray.lastResult        // { moves, hints, difficulty, shape, pieces, ways } of the last tray filled (ways -1 = over the bar)
```

## Parameters

| Parameter | Default |
| --- | --- |
| Sound: a piece picked up | Cursor2 |
| Sound: a piece put down | Knock |
| Sound: a piece turned or flipped | Cursor1 |
| Sound: it does not fit | Buzzer1 |
| Sound: a hint | Book1 |
| Sound: the tray filled | Item3 |

## Compatibility

Tray adds its own scene and replaces nothing. It extends one engine method, `Game_System.initialize`, calling the
original first, to create its save record (`$gameSystem._csafTray = { v: 1, solved: {...} }`). It draws no window,
so window skin plugins do not change it.

## Terms

Commercial and non-commercial use in RPG Maker projects. See LICENSE.txt. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
