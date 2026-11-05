# Jigsaw - Jigsaw Puzzles From Any Picture, for RPG Maker MZ and MV (generated cuts, 4 to 256 pieces) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Jigsaw - Jigsaw Puzzles From Any Picture, for RPG Maker MZ and MV (generated cuts, 4 to 256 pieces)  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/jigsaw  
**Docs published:** 2026-11-05


---

# Jigsaw for RPG Maker MZ and MV

**Version 1.0.**

**Any picture in your game becomes a jigsaw puzzle the player puts together on a drawn table.** A CG, a parallax, a
portrait, a screenshot of a map: name it, and Jigsaw cuts it. Every cut is generated: each edge is a knob-and-socket
curve shared by the two pieces it separates, the corners are jittered so no grid lines show, and no two seeds cut the
same puzzle. Each piece is bevelled, lit from the upper left and shadowed, and lifts higher while the player carries it.

The table has a felt mat in a wooden rim, the frame with a faint ghost of the picture to work from, and a plaque that
keeps the count, the time and the moves. Hold Q for the box lid. When the last piece goes in, the finished picture
rises from the frame to the middle of the table and the result plaque comes up beneath it. The time, the moves and a
solved switch go back into your variables.

It draws everything itself. The only image it needs is your picture.

## Installing

Copy the three files into `js/plugins` and turn them on in the Plugin Manager:

1. `JigsawCut.js`: the cutter
2. `JigsawDraw.js`: the pieces and the table
3. `Jigsaw.js`: the parameters, the plugin command and the puzzle scene

That order is the recommended one, but any order works: each file looks for the others the first time a puzzle opens,
not when it loads (tested with `Jigsaw.js` loading first).

**The demo picture.** `img/pictures/jigsaw_demo.png` (1024 x 687, a painted harbour town) is included so you can try a
puzzle straight away: copy it into your project's `img/pictures` folder and use `jigsaw_demo` as the picture. You may
use it in your game.

**In RPG Maker MV 1.6:** also copy `CSAF_MVBridge.js` and put it **at the top of the list**, above the three Jigsaw
files. It supplies the few parts of MZ's scripting these files use and MV lacks, changes no window of yours or of any
other plugin, and does nothing at all in MZ (you can leave it out there).

## The plugin command: Start a jigsaw

| Argument | Default | Meaning |
| --- | --- | --- |
| Picture | (none) | Any file in `img/pictures`. Required: with no picture the command does nothing and says so in the console. |
| About how many pieces | 24 | 4 to 256. The cutter picks the near-square grid closest to this for your picture's shape, so the real count can differ a little (100 on the demo picture is 12 x 8 = 96 pieces). A side has at most 16 pieces, so a very wide or very tall picture gets fewer: a 2400 x 200 panorama is 16 x 2 = 32 at most. |
| Seed | blank | Blank = a new cut every time. Any number or word cuts the same puzzle every time. |

The event waits while the puzzle is on screen. Everything is written before the event continues, so the next command
can read the result (for example a Conditional Branch on the solved switch).

### In RPG Maker MV: the command as one line

MV has no command list, so the puzzle is a Plugin Command line:

```
Jigsaw start picture=jigsaw_demo pieces=24 seed=7
Jigsaw start picture="Castle at Night" pieces=48
```

Put a picture name with spaces in double quotes. The same line also works in MZ through the bridge, and so does the
script call below.

### Script call

```
CSAF.Jigsaw.start({ picture: 'jigsaw_demo', pieces: 48, seed: 7 })
```

## Plugin parameters (Jigsaw.js)

| Parameter | Default | Meaning |
| --- | --- | --- |
| Seconds -> variable | 0 (none) | The time taken, in whole seconds. |
| Moves -> variable | 0 (none) | Every time a piece is put down counts one move, placed or not. |
| Solved -> switch | 0 (none) | ON when the puzzle is finished, OFF when the player sets it aside. |
| Common event afterwards | 0 (none) | Reserved when the puzzle closes, either way. |
| Snap distance (px) | 16 | How close to its place a piece must be put down to click in. 4 to 60. |

## Playing

- **Mouse or touch:** press on a piece, drag it, let go. A piece let go within the snap distance of its place clicks
  in and stays.
- **Keyboard:** the arrow keys move a hand (hold Shift to move it faster), OK picks up the piece under it
  and puts it down again.
- **The box lid:** hold Q (Page Up), or press and hold the plaque, and the whole picture lifts over the frame. Each
  look is counted.
- **Set it aside:** Cancel (Esc, or a right click) gives up. The plaque says SET ASIDE with how many pieces were placed,
  and the solved switch goes OFF.
- **The ending:** when the last piece goes in, the picture rises to the middle of the table and the SOLVED plaque gives
  the pieces, the time and the moves. The ending plays out for about a second before OK, Cancel or a tap returns to
  the map, so a key held from the last move cannot skip it.

The loose pieces are laid out for the screen they are on: every piece starts on a spot of its own, off the frame and
off the plaque, at 4 to 256 pieces on an 816 x 624, a 1280 x 720 and a 1080 x 1920 portrait screen (measured on all
three, in MZ and in MV). On a portrait screen the frame sits above a full-width strip of pieces. The type on the
plaques grows with the screen.

## The result, from a script

```
CSAF.Jigsaw.lastResult()
// { picture, pieces, solved, seconds, moves, peeks, seed }
```

`peeks` is how many times the player looked at the box lid. The last result and a count of puzzles played are kept in
the save file.

## Compatibility

Jigsaw adds its own scene and changes no scene, window or sprite of the engine's or of any other plugin. It is opened
only by its command, so it does not touch battles, menus or the map while it is closed. Tested in RPG Maker MZ 1.10.0
and RPG Maker MV 1.6.1 (with the bridge).

## Terms

See `LICENSE.txt`. In short: use it in any number of commercial and non-commercial games; do not redistribute the
plugin files.

Made by Core Systems Asset Factory, https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
