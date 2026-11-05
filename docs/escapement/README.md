# Escapement - Generated Clockwork Gear Puzzles for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Escapement - Generated Clockwork Gear Puzzles for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/escapement  
**Docs published:** 2026-11-05


---

# Escapement for RPG Maker MZ

**Generated clockwork puzzles, solvable by construction.**

A locked door is usually a switch and a line of text. Escapement turns it into a mechanism the player
has to finish: a plate with fixed arbors, a tray of loose wheels, a mainspring that drives, and a
payoff that only moves when the train is right.

- Wheels mesh only when their sizes fit the gap between two arbors.
- Every wheel turns the opposite way to the one driving it.
- The payoff only turns one way. Reach it the wrong way round and **the pawl holds**.
- Close a loop of an odd number of wheels and the whole train **jams**.

Every puzzle is generated from a seed and laid around a working train, so it cannot be unsolvable.
The same event always gets the same puzzle. Nothing is loaded from an image file.

## Installing

Copy the three files into your project's `js/plugins` folder and add them in the Plugin Manager in
this order, top to bottom:

1. `EscapementCore.js`: the generator and the gear physics
2. `EscapementDraw.js`: the drawing
3. `Escapement.js`: parameters, commands, the puzzle scene

## Making a puzzle

On any event, add the plugin command **Escapement > Open Puzzle**:

| Argument | What it does |
| --- | --- |
| Grade | 1 (easy) to 5 (hard). 0 uses the plugin's Default grade. |
| What the train drives | `lock` (a strongroom bolt), `clock` (a tower clock), `orrery`, `winch` (a portcullis counterweight), or `auto`. |
| Metal | `brass`, `steel`, `bronze`, `verdigris`, `gunmetal`, `auto` (chosen by the seed) or `default` (the parameter). |
| Title | The name set above the plate. Blank names it after the payoff. |
| Switch when solved | Turned ON when the player completes the train. |
| Self switch when solved | A, B, C or D of this event. |
| Seed | Blank keys the puzzle to this map and event. Any text or number gives a fixed puzzle you can reuse. |

The event **waits** while the puzzle is open. The next command runs after the player leaves, so a
Conditional Branch on the switch works straight away. A puzzle that is already solved does not open
again; it just sets its switches.

**Reset Puzzle** forgets a puzzle's progress and its solved state.

## What the grades mean

| Grade | Wheels in the true train | Wrong-way trap route | Dead-end arbors | Spare wheels |
| --- | --- | --- | --- | --- |
| 1 | 3 | none | 0 | 1 |
| 2 | 3 to 4 | none | 1 | 1 |
| 3 | 4 | 1 to 2 wheels | 1 | 1 |
| 4 | 4 to 5 | 1 to 2 wheels | 2 | 2 |
| 5 | 5 to 6 | 1 to 2 wheels | 2 | 2 |

From grade 3 the plate contains a second route to the payoff that reaches it turning the wrong way.
Filling both routes closes an odd loop and jams everything.

## Controls

- **Arrow keys** choose an arbor. **OK** on an empty arbor opens the tray; **left/right** choose a
  wheel; **OK** sets it. **OK** on a set wheel lifts it back into the tray.
- **Escape** leaves. The wheels stay where the player left them and are there next time.
- **Mouse / touch**: click an arbor, then click a wheel in the tray.

## Script calls

```js
Escapement.isSolved("m3e12")      // true once that puzzle is solved
Escapement.keyFor(3, 12)          // "m3e12": the key an event's puzzle is saved under
```

A puzzle opened with a seed is saved under `"s" + seed` (for example `"s4242"`).

## Parameters

| Parameter | Default | |
| --- | --- | --- |
| Default grade | 2 | |
| Default metal | auto | |
| Drive speed | 1.2 | degrees per frame |
| Allow leaving unsolved | true | if false, Escape is refused until the train is complete |
| Sounds | Equip1, Cursor2, Buzzer1, Open1, Cursor1 | set, lift, refused/jammed, solved, cursor. Any SE in your project. |

## Compatibility

Escapement adds its own scene and replaces nothing. It extends one engine method,
`Game_System.initialize`, calling the original first, to create its save record. It draws no
window and uses no Window_Base, so window skin plugins do not change it. Its save record is
versioned, and a save made with this version loads in later ones.

## Save data

`$gameSystem._csafEscapement = { v: 1, solved: {...}, placed: {...} }`: which puzzles are solved
and where the wheels of any unfinished puzzle were left.

## Terms

Commercial and non-commercial use in RPG Maker projects. See LICENSE.txt. Written with AI
assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
