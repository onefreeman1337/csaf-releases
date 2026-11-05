# Tilestack - Mahjong Solitaire Minigame for RPG Maker MZ and MV (drawn tiles, generated layouts) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Tilestack - Mahjong Solitaire Minigame for RPG Maker MZ and MV (drawn tiles, generated layouts)  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/tilestack  
**Docs published:** 2026-11-05


---

# Tilestack for RPG Maker MZ and MV

**Version 1.0.**

**Mahjong solitaire, inside your game.** The player sits down at a table where a stack of carved tiles is laid out,
and clears it two at a time: remove any two FREE tiles that match. A tile is free when nothing lies on top of it and
its left or right side is open. Clear the board to win.

**Every deal can be cleared.** Tilestack deals backwards: it takes two free tiles off the full layout, gives them a
matching pair, and repeats until the layout is empty, so a winning order always exists. If the player still gets
stuck, they can shuffle the tiles left on the board, and the shuffle is dealt the same way.

**Every tile is drawn by the plugin.** No image files. 42 faces (three suits of nine, four winds, three dragons, four
flowers, four seasons) in five sets: ivory, bone, jade, black lacquer and porcelain. The layout is the classic
144-tile turtle, or a generated one of the size you ask for (8 to 144 tiles), different for every seed.

The time, the moves and a cleared switch go back into your variables.

## Installing

Copy the three files into `js/plugins` and turn them on in the Plugin Manager:

1. `TilestackCore.js`: the rules, the layouts and the deals
2. `TilestackDraw.js`: the tiles and the table
3. `Tilestack.js`: the parameters, the plugin command and the game scene

That order is the recommended one, but any order works: each file looks for the others the first time a game opens,
not when it loads (tested with `Tilestack.js` loading first).

**In RPG Maker MV 1.6:** also copy `CSAF_MVBridge.js` and put it **at the top of the list**, above the three Tilestack
files. It supplies the few parts of MZ's scripting these files use and MV lacks, changes no window of yours or of any
other plugin, and does nothing at all in MZ (you can leave it out there).

## The plugin command: Start a game

| Argument | Default | Meaning |
| --- | --- | --- |
| Layout | turtle | `turtle` (the classic 144) or `generated`. |
| About how many tiles | 72 | For a generated layout, 8 to 144. The count is always even and close to what you ask. |
| Tile set | (the parameter) | `ivory`, `bone`, `jade`, `lacquer` or `porcelain`. Blank uses the Default tile set parameter. |
| Hints allowed | 3 | 0 to 99. |
| Shuffles allowed | 2 | 0 to 9. |
| Seed | blank | Blank = a new deal every time. Any number or word deals the same game every time. |

The event waits while the game is on screen. Everything is written before the event continues, so the next command
can read the result (for example a Conditional Branch on the cleared switch).

### In RPG Maker MV: the command as one line

```
Tilestack start layout=turtle set=jade seed=7
Tilestack start layout=generated tiles=72 set=lacquer hints=5
```

### Script call

```
CSAF.Tilestack.start({ layout: 'generated', tiles: 72, set: 'ivory', seed: 7 })
```

## Plugin parameters (Tilestack.js)

| Parameter | Default | Meaning |
| --- | --- | --- |
| Seconds -> variable | 0 (none) | The time taken, in whole seconds. |
| Moves -> variable | 0 (none) | Each pair removed counts one move, and so does each undo. |
| Cleared -> switch | 0 (none) | ON when the board is cleared, OFF when the player sets it aside. |
| Common event afterwards | 0 (none) | Reserved when the game closes, either way. |
| Default tile set | ivory | The set used when the command leaves it blank. |

## Playing

- **Mouse or touch:** click a free tile, then its match. Clicking a tile that is not free does nothing (a short buzz).
  Clicking the picked tile again puts it down.
- **Keyboard:** the arrow keys move a hand between free tiles; OK picks.
- **Q (Page Up)** shows a pair that can be removed, while hints last. **W (Page Down)** puts the last pair back.
- **Stuck:** when no pair is left, the plaque says NO PAIRS. OK (or a click) shuffles the tiles still on the board,
  while shuffles last; after that, the game is set aside.
- **Set it aside:** Cancel (Esc, or a right click) gives up. The plaque says SET ASIDE with how many tiles were
  cleared, and the cleared switch goes OFF.
- **The ending:** when the board is clear, a gold outline of the layout appears where the tiles stood, the last pair
  rises to the middle of the table, and the CLEARED plaque gives the tiles, the time and the moves.

The board is fitted to the screen it is on (measured on 816 x 624, 1280 x 720 and a 1080 x 1920 phone screen, in MZ
and in MV): every tile on the felt, clear of the plaque. The plaque's type grows with the screen.

**The characters, winds and the red and green dragons** are drawn with your players' own system fonts (every desktop
and phone system ships one that has them). Tilestack checks each character before drawing it; where a browser has no
font for it, the tile is drawn with a numeral or letter instead, so the game stays playable. Every one of those tiles
also carries a small index (1 to 9, or E S W N) in its corner for players who do not read the characters.

## The result, from a script

```
CSAF.Tilestack.lastResult()
// { layout, tiles, cleared, left, seconds, moves, hints, shuffles, seed }
```

The last result and a count of games played are kept in the save file.

## Compatibility

Tilestack adds its own scene and changes no scene, window or sprite of the engine's or of any other plugin. It is
opened only by its command. Tested in RPG Maker MZ 1.10.0 and RPG Maker MV 1.6.1 (with the bridge).

## Terms

See `LICENSE.txt`. In short: use it in any number of commercial and non-commercial games; do not redistribute the
plugin files.

Made by Core Systems Asset Factory, https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
