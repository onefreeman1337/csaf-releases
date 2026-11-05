# Sapper - Minesweeper Minigame for RPG Maker MZ: Clear a Field Over Your Picture, No Guessing — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Sapper - Minesweeper Minigame for RPG Maker MZ: Clear a Field Over Your Picture, No Guessing  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/sapper  
**Docs published:** 2026-11-05


---

# Sapper for RPG Maker MZ

**Version 1.0.**

**Clear the field, uncover the picture.** One of your own pictures lies under a minefield the plugin lays over it:
turf, sand, snow or slate, each cell tinted from the picture beneath it, so the field hints at what it hides. Every cell
the player clears uncovers that patch of the picture, and a number on it says how many mines touch it. Clear every safe
cell and the rest of the field lifts away: the picture is shown whole. Set off a mine and it costs a life.

**No guessing.** Every field is laid after the first click, away from it, and laid again until a logic solver can
finish it from there. A careful player never has to guess, and no game ends on a coin flip.

Nothing is loaded but your picture: the ground, the numbers, the flags, the mines, the frame and the results are drawn by
the plugin. Any picture in `img/pictures` works: a CG, a portrait, a map screenshot, a title image.

## Installing

Copy the three files into `js/plugins` and turn them on in the Plugin Manager. The order does not matter (tested with
`Sapper.js` loading first):

1. `SapperCore.js`: the rules (the field, the no-guess generator and its solver)
2. `SapperDraw.js`: the ground, the numbers, the flags, the mines, the frame
3. `Sapper.js`: the plugin command, the parameters and the game scene

Then call the plugin command **Start Sapper** from any event and name a picture. If `SapperCore.js` or `SapperDraw.js`
is missing or off, nothing starts and the console says which files to enable.

## The plugin command: Start Sapper

| Argument | Default | Meaning |
| --- | --- | --- |
| Picture | blank | A picture from `img/pictures`. Blank starts nothing (the console says so once). |
| Field | medium | small 9 x 7 (9 mines), medium 12 x 9 (17), large 16 x 12 (32). |
| Mines | 0 | 0 = the field's own count. More is harder, up to 30% of the field; still solvable without a guess. |
| Ground | auto | turf, sand, snow or slate. Auto picks one from the seed. |
| Mines drawn as | iron | iron = drawn mines. troop = the enemies of the troop below, pressed into wax seals. |
| Troop (for troop mines) | 0 | A troop from your database. |
| Lives | 1 | How many mines the player may set off. 1 to 9. The last one ends the game. |
| Variable: seconds taken | 0 | Written when the game ends. |
| Variable: mines set off | 0 | Written when the game ends. |
| Variable: flags planted | 0 | Written when the game ends. |
| Variable: percent cleared | 0 | 0 to 100, written when the game ends. |
| Switch: cleared | 0 | ON if the field was cleared, OFF otherwise. |
| Seed | blank | Blank = a new field every time. A number or a word = the same field for the same first click, every time. |

The event waits while the game is on screen; everything is written before the event continues.

Script call, the same arguments as plain values:

```
Sapper.start({ picture: 'Castle', size: 'large', cover: 'snow', lives: 3, clearedSwitch: 4 });
Sapper.isOpen()   // true while a game is on screen
```

## Sounds (plugin parameters)

Five sounds, each a sound effect from `audio/se`: ground cleared (Sand), a flag planted (Equip1), a mine goes off
(Explosion1), the field is clear (Chime2), the field holds (Collapse1). Set any of them to (None) and that sound is
silent. Moving the cursor plays your system's own cursor sound.

## How it plays

- **Mouse:** left click clears a cell (on release), right click plants or lifts a flag, a click on a number whose
  flags are all placed clears every other cell around it.
- **Touch:** tap clears, a long press flags.
- **Keyboard and pad:** move with the arrows, OK clears (or clears around a number), Shift or Cancel flags.
- On the results, OK or a click leaves.

The first click always opens ground, never more than 60% of the field. Measured over 1,000 fields per size and two
seed sets, about half the small and medium fields and two thirds of the large ones need more than reading one number at
a time: the player has to compare two numbers, or count the mines left.

## Compatibility

Sapper adds its own scene and replaces nothing. It extends two engine methods, each by saving the original and calling
it: `Game_System.initialize` (its save record) and `Game_Interpreter.updateWaitMode` (so the event waits while the game
runs). The scene draws no MZ window, uses its own typeface stack (Palatino Linotype, Book Antiqua, Palatino, Georgia),
and is laid out for 816 x 624 and scaled to fit other screen sizes. It was tested in a stock MZ project; it has not
been tested beside every plugin.

Your picture is read once when a game starts and never again while it plays. A picture name that does not exist in
`img/pictures` stops the game with RPG Maker's own "Failed to load" message, the same as a missing picture in Show
Picture. Troop mines use each enemy's front-view battler, or its side-view battler in a side-view project.

**Save data.** One small record in the save file (`$gameSystem._csafSapper`, version 1: games played, cleared, the best
percent). A save made before Sapper was installed loads cleanly.

**Cost per frame.** On the large field with a cell cleared every 6 frames, the scene draws in **5** draw calls per frame
with 0 windows drawn; a cell is redrawn only when it is cleared or flagged.

## Licence and AI disclosure

See `LICENSE.txt`. Every line of this plugin was written with AI assistance, and its store images and cover were
produced with AI assistance. It contains no audio: its default sounds are files from MZ's own RTP.

Copyright (c) 2026 Core Systems Asset Factory. https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
