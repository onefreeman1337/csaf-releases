# Unveil - Qix-Style Picture Reveal Minigame for RPG Maker MZ (Your Own Pictures) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Unveil - Qix-Style Picture Reveal Minigame for RPG Maker MZ (Your Own Pictures)  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/unveil  
**Docs published:** 2026-11-05


---

# UNVEIL

**A Qix-style minigame for RPG Maker MZ: claim the board to reveal one of your own pictures.** v1.0.0.

One of your pictures lies under a veil. The player walks the edge of the land already revealed and, holding OK, cuts a
line into the veil; when the line reaches revealed land again, every part of the veil with no creature in it falls
away. A creature drifting under the veil that touches the line, or a spark running along the edge that touches the
player, costs a life. Reveal the target share to win, and the whole picture is shown. You add one plugin command and
name a picture; the veil, the creature, the sparks and the scoring are Unveil's.

## What is in the box

| | |
| --- | --- |
| `js/plugins/UnveilCore.js` | The rules: the board, the cuts, what is revealed, the creatures, the sparks. Knows nothing about RPG Maker. |
| `js/plugins/UnveilDraw.js` | The drawing kit: three veils, the rim, the cutting line, the creature, the sparks, the score band. Knows nothing about RPG Maker. |
| `js/plugins/Unveil.js` | The only file that touches the engine: the plugin command, the game scene, the results. |

## Install

1. Copy the three `.js` files into your project's `js/plugins` folder.
2. Enable all three in the Plugin Manager. Any order works: each file finds the others when a game starts.

## Using it

Add the plugin command **Start Unveil** to an event and choose a picture from `img/pictures`. The event waits while
the game runs.

| Argument | Default | |
| --- | --- | --- |
| Picture | | a picture from img/pictures; without one, no game starts |
| Veil | auto | silk, frost or lacquer |
| Target (%) | 75 | the share of the board to reveal, 10 to 95 |
| Lives | 3 | 1 to 9 |
| Creatures in the veil | 1 | 1 to 4 |
| Sparks on the edge | 2 | 0 to 6 |
| Variable: percent revealed | 0 | |
| Switch: won | 0 | ON when the target is reached |
| Seed (optional) | | blank = a new game every time; a number or a word = the same game every time |

## Controls

Arrow keys move along the edge of the revealed land; hold OK (or Shift) to cut into the veil. A line cannot cross
itself. On a touch screen, press and drag toward where you want to go; while pressed, you cut, and a cut whose finger
stops a cell or two short of revealed land carries on and closes onto it. On the results, OK (or a click) leaves.

## Difficulty, measured

Measured over 200 scripted games per setting (two seed sets of 100) on the real rules. A careful script reads where the
creature is heading before it cuts; a reckless one looks only at where the creature is now. A game the script had not
finished after eight minutes counts as a loss, so every figure is a floor.

| Target | Creatures | Sparks | Lives | careful script wins | reckless script wins |
| --- | --- | --- | --- | --- | --- |
| 60 | 1 | 0 | 3 | 100% | 69 to 82% |
| 75 (the defaults) | 1 | 2 | 3 | 72 to 75% | 40 to 41% |
| 75 | 4 | 2 | 3 | 44 to 52% | 1 to 2% |
| 85 | 2 | 4 | 3 | 25 to 31% | 4 to 10% |
| 95 | 4 | 6 | 1 | 0% | 0% |

The last row is the far corner of every range at once: a wall, not a level.

## Screens and pictures

The board fills whatever screen size the game runs at (checked at 816 x 624 and 1280 x 720), and the picture is scaled
to cover it. A picture name with no file behind it shows RPG Maker's own "Failed to load" screen naming the file, as
Show Picture does.

## Parameters (sounds)

| Parameter | Default |
| --- | --- |
| Sound: a cut begins | Cursor1 |
| Sound: land revealed | Chime1 |
| Sound: a life lost | Damage1 |

Every default is a sound from the stock RTP.

## Script

```
Unveil.start({ picture: 'MyPicture', stage: 'frost', target: 80 })   // the same options as the command
Unveil.record()                                                     // { v: 1, played, won, best }
```

## Compatibility

Unveil adds its own scene and replaces nothing. It extends two core methods, each by saving the original and calling
it: `Game_System.initialize` (its save record) and `Game_Interpreter.updateWaitMode` (so the event waits while the game
runs). It reads one picture and never writes to your project.

## Credits

Made by Core Systems Asset Factory. The code and the drawing code were written with AI assistance. No image, font or
sound ships with the plugin: the veils, the creature and the sparks are drawn in code, and the picture is your own.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
