# Stride Run — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Stride Run  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/mz-plugin-library  
**Docs published:** 2026-11-17


---

# Stride Run v1.0.0 for RPG Maker MZ

Part 1 of **Stride** by Core Systems Asset Factory (https://csaf.itch.io).

When the player dashes, MZ plays the walking animation faster. Stride Run gives every character a **real run
cycle** instead: **six drawings in each of the four facings**, made from that character's own walking sheet
when it is first needed. No run art to draw, for the hero, the followers or any event you tag.

## What the run looks like

| Drawing | From the side | From the front and back |
| --- | --- | --- |
| contact | a long stride: the front foot lands ahead, the back foot pushes off behind | both knees bent, the body a row lower |
| pass | the swing knee comes forward under the body, the heel trails behind | one knee lifted (the leg drawn shorter) |
| flight | both feet off the ground, the body lifted, the front knee raised | the lifted knee higher, the body lifted |

Then the same three with the other leg leading. From the side the upper body **leans into the run** and the
arms are **redrawn bent at the elbow, pumping opposite to the legs**, in the sheet's own sleeve, skin and
outline colours; the far arm and the far leg are drawn a shade darker so the two read apart. The legs are
the sheet's own leg pixels, cut at the knee and turned about the hip and knee (or, on a short chibi leg,
slid like a pixel artist slides a foot). Nothing is resampled or blended.

The pace follows the move speed: each drawing holds `(9 - speed) x 3 x 0.55` frames (7 frames at dash
speed 5), scaled by the Cadence % parameter.

## Install

1. Copy the four files from `js/plugins` into your project's `js/plugins` folder.
2. Turn on all four in the Plugin Manager. Any order works; this order reads best:
   PostureCore, KnackCore, StrideCore, StrideRun.

If you already own Posture, Knack or Rally, keep ONE copy of PostureCore.js and KnackCore.js: the files
in this download are the same files, byte for byte.

## Who runs

| Who | When it runs |
| --- | --- |
| the player and the followers | while the player dashes (parameter Run when dashing, on by default) |
| an event tagged `<stride: run>` | whenever it moves, at any speed |
| any other event | only if you set Events run at speed (0 = off, the default) and it moves at that speed or faster |
| a character standing still | never: it shows its own walking sheet, exactly as before |

Note tags go in an event's Note box or in a Comment on its current page (a comment on the page wins), or in an
actor's Note box:

| Tag | What it does |
| --- | --- |
| `<stride: run>` | always run when moving |
| `<stride: walk>` | never run (a ghost that floats, a cart, a horse, a slime) |
| `<stride: 4>` | run when moving at speed 4 or faster |

Events run at speed is off by default because a monster or animal sheet moving that fast would be given a
two-legged run too. If you turn it on, tag those events `<stride: walk>`.

## Plugin commands

| Command | What it does |
| --- | --- |
| Run Mode | Who (-1 the player, -2/-3/-4 the followers, 0 this event, 1 and up an event id) and Mode: **run** (always run when moving), **walk** (never run) or **auto** (the rules above). Kept in the save file. |
| Prepare Run | draws a character's run now, so the first dash in a cutscene does not wait while it is made. |

The party's runs are drawn when the map first shows them, so the first dash never pauses. One run takes
about 5 to 45 ms to draw (measured over the 116-character test cast), once per character.

## Parameters (StrideRun.js)

| Parameter | Default | What it does |
| --- | --- | --- |
| Run when dashing | on | the player and followers run while the player dashes |
| Events run at speed | 0 (off) | events moving at this speed or faster run (5 = x2 Faster) |
| Cadence % | 100 | how quickly the six drawings follow each other (150 = half again as quick) |

## Script calls

```
CSAF.StrideRun.setMode(target, 'run' | 'walk' | 'auto')
CSAF.StrideRun.isRunning(target)
CSAF.StrideRun.prepare(target)
```

`target` is `$gamePlayer`, a character, or the number the commands use.

## What it will not run, and what to expect on unusual sheets

- Object sheets (file names starting with `!`), tile events and events with no picture never run.
- A long robe or skirt has no legs to stride: the hem swings with the run and the feet step out under it.
- On a big-head chibi whose legs are 3 to 5 rows tall, the knee lifts one or two rows and the run reads
  mostly from the lean, the arms and the bounce.
- Seen from the front or back, a run is a jog toward or away from the camera, as it is in hand-drawn
  sheets; the side views carry the stride.
- Arms are drawn 3 px wide (4 px on figures over 70 px tall) in the sheet's own colours; on very ornate
  sheets they are simpler than the sheet's own drawing.

## Compatibility

Stride Run extends these engine methods and calls the original of each:
`Game_CharacterBase.prototype.update`; `Sprite_Character.prototype.updateBitmap`, `characterBlockX`,
`characterBlockY`, `characterPatternX`, `patternWidth` and `patternHeight`;
`Sprite_Balloon.prototype.updatePosition`. For a running character only, the sprite shows the run cell
(taller than the walking cell, so a lifted body and a pumping fist are never cut off), anchored at the feet;
a balloon still sits on the head and a bush still turns the lower half translucent.

A character that Knack, Posture, Hoist, Stricken or Rally Field is posing or carrying keeps that look. If
another plugin replaces the character's sheet while it moves, the plugin that swaps last wins and Stride
Run steps aside for that frame (it checks that the sprite still shows its own sheet). Tested with MZ's own
dash; not tested with VisuStella Events & Movement Core's dash or with other dash plugins.

Saves: only Run Mode is saved (a number on the character); the run itself is never written to the save file.

Measured performance: each character's run is drawn once and cached; on a steady frame a running character
advances a counter and compares numbers only, and allocates nothing. Four characters running laps on a map:
**9** draw calls a frame, **0** texture uploads, display objects steady.

Tested on MZ 1.10.0 (the stock runtime) with the stock database and the 96 stock characters.

## Credits

Core Systems Asset Factory. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
