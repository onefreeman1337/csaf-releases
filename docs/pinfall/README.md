# Pinfall - Generated Pachinko and Plinko Boards for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Pinfall - Generated Pachinko and Plinko Boards for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/pinfall  
**Docs published:** 2026-11-05


---

# Pinfall for RPG Maker MZ

**Generated pachinko and plinko boards.** The player slides a launcher along the rail, stakes gold and drops a
steel ball through brass pins and jewelled bumpers into a row of prize pockets, each paying a multiple of the stake.

Every board is generated from a seed: the pin pattern (lattice, diamond, fan, waves or rings), the bumpers, the number
of pockets (7, 9 or 11) and the payout table, drawn in one of five themes (carnival, jade, midnight, ember, ivory).
Nothing is loaded from an image file.

## A house that cannot be farmed

A pin board where the player chooses where to drop is only fair if no spot on the rail is a gold farm. Pinfall
calibrates every table **against a player who aims**, when the board is built:

- The launcher only travels the central band the pins cover.
- 480 balls are dropped across that band in 8 aim positions, and the table is scaled so the **best** position
  (less its measurement error) returns no more than your **Payback** setting plus 8%.
- A second, independent set of 480 balls checks the result and steps the table down if any position still pays
  too well.

Measured on a third, independent set of balls (8 aim positions × 300 drops, 10 boards, default Payback 90): the
best spot on every board returned at most 0.97 of the stake, and the average across the rail was between 0.64 and
0.91 (median about 0.8). **The house keeps an edge however well the player aims.** Tables are always symmetric.

The ball's bounce is deterministic: the same board, dropped from the same spot on the same numbered ball, falls the
same way on every machine. Balls keep counting from visit to visit, so a board never replays the same drops.

## Installing

Copy the three files into `js/plugins` and add them in the Plugin Manager in this order, top to bottom:

1. `PinfallCore.js`: the board generator and the ball physics
2. `PinfallDraw.js`: the drawing
3. `Pinfall.js`: the Open Board command and the scene

## Opening a board

Add the plugin command **Pinfall > Open Board** to an event:

| Argument | What it does |
| --- | --- |
| Stake per ball (gold) | Taken from the party's gold for each ball. |
| Balls per visit | 0 = until the player leaves or cannot pay the stake. |
| Theme | `carnival`, `jade`, `midnight`, `ember`, `ivory` or `auto`. |
| Pin pattern | `lattice`, `diamond`, `fan`, `waves`, `rings` or `auto`. |
| Pockets | 7, 9, 11 or auto. |
| Payback (%) | No spot on the rail returns more than this plus 8%. The average is lower. |
| Variable: net winnings of the visit | Receives winnings minus stakes when the player leaves. |
| Title | Shown beside the board. Blank names it after the theme. |
| Seed | Blank keys the board to this map and event (the same board every visit). |

The event waits while the player plays, then continues. Winnings are paid into the party's gold.

## Controls

- **Left / right** move the launcher along the rail. **OK** drops a ball. **Escape** leaves the table.
- **Mouse / touch**: click just above the pins to drop from that spot.

## Script call

```js
Pinfall.record("m3e12")   // { drops, net } for that board so far
```

## Parameters

| Parameter | Default |
| --- | --- |
| Sound: drop | Cursor3 |
| Sound: pin (every few hits) | Cursor1 |
| Sound: a paying pocket | Coin |
| Sound: five times the stake or more | Item3 |

## Compatibility

Pinfall adds its own scene and replaces nothing. It extends one engine method, `Game_System.initialize`, calling the
original first, to create its save record (`$gameSystem._csafPinfall = { v: 1, boards: {...} }`). It draws no window,
so window skin plugins do not change it.

## Terms

Commercial and non-commercial use in RPG Maker projects. See LICENSE.txt. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
