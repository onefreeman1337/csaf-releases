# Pendant - Spot the Difference From Any Picture, for RPG Maker MZ and MV (generated, measured changes) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Pendant - Spot the Difference From Any Picture, for RPG Maker MZ and MV (generated, measured changes)  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/pendant  
**Docs published:** 2026-11-05


---

# Pendant for RPG Maker MZ and MV

**Version 1.0.**

**Any picture in your game becomes a spot-the-difference puzzle, hung as a pair of paintings in a gallery.** A CG, a
parallax, a title screen, a portrait: name it, and Pendant hangs it twice and changes the second copy in as many places
as you ask. Every change is generated, so no two puzzles are alike and you never draw a second picture by hand.

There are four kinds of change:

- **An object added** that belongs where it lands: a bird, a kite, a balloon or a moon in a sky (a star at night), a
  fish in water, a flower, an apple, a mushroom or a pennant in a field, a key or a lantern on a dark wall or a table.
  Twelve objects are drawn by the plugin, each in a colour chosen to stand out from what it sits on, with a soft shadow
  so it sits on the painting. A puzzle uses a different object each time it can, and only repeats one when nothing
  else fits.
- **A detail mirrored**, left to right, only where the patch is uneven enough for the flip to show.
- **Something painted out** with the picture around it, with a soft, irregular edge rather than a hard circle.
- **An object recoloured** to a colour your picture already uses, only where the region has an edge of its own all
  round (a roof, a sail, a board square), never a band of sky or a shadow.

Every change is measured before it is kept: at the size the changes are made (640 pixels on the long side, or larger for
a long thin picture such as a panorama, so its short side has room) it must move
at least 120 pixels by a clear margin, or it is undone and another place is tried. Changes never overlap.

The gallery is drawn by the plugin: a damask wall (green, plum, navy or oxblood), a picture rail with the two paintings
hung on cords, gilt frames with beaded mouldings, picture lights, and a brass plaque that keeps the count, the time,
the misses and the hints. A find is ringed in red ink on both paintings. When every difference is found, the ALL FOUND
plaque comes up; the time, the finds, the misses and an all-found switch go back into your variables.

## Installing

Copy the two files into `js/plugins` and turn them on in the Plugin Manager:

1. `PendantCore.js`: the difference maker
2. `Pendant.js`: the parameters, the plugin command and the gallery scene

That order is the recommended one, but any order works: `Pendant.js` looks for the core the first time a puzzle opens,
not when it loads (tested with `Pendant.js` loading first).

**The demo picture.** `img/pictures/pendant_demo.png` (1024 x 687, a painted riverside village with a windmill) is
included so you can try a puzzle straight away: copy it into your project's `img/pictures` folder and use
`pendant_demo` as the picture. You may use it in your game.

**In RPG Maker MV 1.6:** also copy `CSAF_MVBridge.js` and put it **at the top of the list**, above the two Pendant
files. It supplies the few parts of MZ's scripting these files use and MV lacks, changes no window of yours or of any
other plugin, and does nothing at all in MZ (you can leave it out there).

## The plugin command: Start a spot-the-difference

| Argument | Default | Meaning |
| --- | --- | --- |
| Picture | (none) | Any file in `img/pictures`. Required: with no picture the command does nothing and says so in the console. |
| Differences | 5 | 1 to 12. On a picture with very little in it, fewer may be made; the plaque counts the ones that were. |
| Seed | blank | Blank = new differences every time. Any number or word makes the same differences every time. |
| Time limit (seconds) | 0 | 0 = no limit. With a limit the plaque counts down, and at zero the puzzle ends as TIME. |
| Hints | 3 | 0 to 9. |

The event waits while the puzzle is on screen. Everything is written before the event continues, so the next command
can read the result (for example a Conditional Branch on the all-found switch).

### In RPG Maker MV: the command as one line

MV has no command list, so the puzzle is a Plugin Command line:

```
Pendant start picture=pendant_demo count=5 seed=7
Pendant start picture="Castle at Night" count=7 time=90 hints=2
```

Put a picture name with spaces in double quotes. The same line also works in MZ through the bridge, and so does the
script call below.

### Script call

```
CSAF.Pendant.start({ picture: 'pendant_demo', count: 5, seed: 7, time: 0, hints: 3 })
```

## Plugin parameters (Pendant.js)

| Parameter | Default | Meaning |
| --- | --- | --- |
| Seconds -> variable | 0 (none) | The time taken, in whole seconds. |
| Finds -> variable | 0 (none) | How many differences were found. |
| Misses -> variable | 0 (none) | Clicks on a painting that found nothing. |
| All found -> switch | 0 (none) | ON when every difference was found, OFF when the player gave up or the time ran out. |
| Common event afterwards | 0 (none) | Reserved when the puzzle closes, either way. |
| Gallery wall | Green | Green, Plum, Navy or Oxblood. |
| Changes: add an object | ON | Turn a kind of change OFF to leave it out of every puzzle. With all four OFF, all four are used. If the kinds left ON can find nothing to change on a picture, that picture gets all four (and the console says so), so a puzzle never opens with no differences. |
| Changes: recolour | ON | |
| Changes: mirror a detail | ON | |
| Changes: paint something out | ON | |

## Playing

- **Mouse or touch:** click or tap where the two paintings differ, on either painting. A find is ringed on both. A click
  on a painting that finds nothing is a miss and leaves a small mark that fades; a click on a difference already found,
  or on the wall, is neither.
- **Keyboard:** the arrow keys move a hand (hold Shift to move it faster), OK marks the spot under it.
- **Hints:** Q (Page Up), or a press on the plaque, lights a glow around a difference not yet found, on both paintings,
  for about three seconds. Each one spends a hint.
- **Give up:** Cancel (Esc, or a right click). The plaque says SET ASIDE with how many were found, and every difference
  left is marked with a dashed gold ring so the player can see what they missed.
- **The ending:** ALL FOUND gives the count, the time and the misses. The ending plays out for well under a second
  before OK, Cancel or a tap returns to the map, so a key held from the last find cannot skip it.

The paintings are hung for the screen they are on: side by side, or one above the other when that hangs them larger.
Measured on an 816 x 624, a 1280 x 720 and a 1080 x 1920 portrait screen (on the portrait one they hang one above the
other). The plaque's type grows with the screen.

## The result, from a script

```
CSAF.Pendant.lastResult()
// { picture, count, found, misses, hints, seconds, allFound, timedOut, seed }
```

`count` is how many differences were made, `hints` how many were used. The last result and a count of puzzles played
are kept in the save file.

## Compatibility

Pendant adds its own scene and changes no scene, window or sprite of the engine's or of any other plugin. It is opened
only by its command, so it does not touch battles, menus or the map while it is closed. Tested in RPG Maker MZ 1.10.0
and RPG Maker MV 1.6.1 (with the bridge).

## Terms

See `LICENSE.txt`. In short: use it in any number of commercial and non-commercial games; do not redistribute the
plugin files.

Made by Core Systems Asset Factory, https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
