# Stride Idle — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Stride Idle  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/mz-plugin-library  
**Docs published:** 2026-11-17


---

# Stride Idle v1.0.0 for RPG Maker MZ

Part 2 of **Stride** by Core Systems Asset Factory (https://csaf.itch.io).

In MZ a character that stands still is a frozen picture. Stride Idle gives every walking sheet an **idle**:
**nine drawings in each of the four facings**, made from that character's own walking sheet when it is
first needed, played on that character's own seeded rhythm. No idle art to draw, for the hero, the
followers or any event.

## What the idle does

| Drawing | What you see |
| --- | --- |
| rest | the standing frame, as drawn |
| inhale | the head, shoulders and chest rise one pixel and settle; the hips, legs and feet stay where they stand (the sprite is never stretched or skewed) |
| weight shift A / B | the body sways a pixel over one leg and the other heel lifts a row; seen from the side, the body settles back on its heels, then forward. A one-pixel change: subtle at 1x, as weight shifts in hand-drawn sprites are |
| blink | the eyes are found on the face and closed for a moment, the lid drawn in the eye's own darkest colour |
| glance A / B | a small gesture: the head turns a pixel and the eyes look aside; seen from the side, the head dips to look down, then lifts |
| hands on hips | both arms redrawn bent at the elbow, elbows out, hands at the waist, in the sheet's own sleeve, skin and outline colours |
| doze | the eyes shut and the head dipped a row: nodding off, jerking awake now and then |

Each character breathes, blinks and makes a waiting gesture (a weight shift, a glance, hands on hips, and
after a long wait a doze) on its own rhythm, drawn from the Rhythm seed, its map, its event id and its sheet,
so a town square never breathes or blinks in step. The same seed gives the same idles every time the game
runs. Moving ends the idle at once.

## Install

1. Copy the five files from `js/plugins` into your project's `js/plugins` folder.
2. Turn on all five in the Plugin Manager. Any order works; this order reads best:
   PostureCore, KnackCore, StrideCore, StrideIdleCore, StrideIdle.

If you already own Stride Run, Posture, Knack or Rally, keep ONE copy of PostureCore.js, KnackCore.js and
StrideCore.js: the files in this download are the same files, byte for byte.

## Who idles

| Who | When it idles |
| --- | --- |
| the player and the followers | after standing still for Stand before idling (40 frames by default) |
| an event | the same, unless its page uses Stepping, has Walking off, has Direction Fix on, or shows a pattern other than the middle one: those are your own pose or animation, and are left exactly as drawn |
| object sheets (`!` file names), tile events, events with no picture | never |

The Who idles parameter picks **everyone** (the default), **party** (the player and followers; events only
when tagged) or **tagged** (only what carries a tag).

Note tags go in an event's Note box or in a Comment on its current page (a comment on the page wins), or in an
actor's Note box:

| Tag | What it does |
| --- | --- |
| `<stride idle: full>` | idle with every gesture (also overrides the Stepping, Walking, Direction Fix and pattern rules) |
| `<stride idle: breathe>` | breathe and blink only: a guard at attention, a monster or animal sheet |
| `<stride idle: off>` | never idle |

## Plugin commands

| Command | What it does |
| --- | --- |
| Idle Mode | Who (-1 the player, -2/-3/-4 the followers, 0 this event, 1 and up an event id) and Mode: **full**, **breathe**, **off** or **auto** (the rules above). Kept in the save file. |
| Play Gesture | a standing character makes one gesture now: **glance**, **shift**, **hips**, **doze** or **blink** (a cutscene beat: the guard glances around). **hips** plays only on a character that can show it from every side (see below); on any other it does nothing. |
| Prepare Idle | draws a character's idle now, so it is ready the moment the character stands still. |

The party's idles are drawn when the map first shows them; an event's is drawn the first time it stands
still, at most one character per frame. Each character's idle is drawn once and cached; most take a few
milliseconds, and on the 116-character test cast every one took under 100 ms to draw.

## Parameters (StrideIdle.js)

| Parameter | Default | What it does |
| --- | --- | --- |
| Who idles | everyone | everyone, party or tagged (see above) |
| Stand before idling (frames) | 40 | how long a character stands still before it idles (60 = one second) |
| Breaths per minute | 18 | how often the chest rises |
| Seconds between blinks | 4 | the average wait between blinks |
| Seconds between gestures | 9 | the average wait between waiting gestures |
| Hands on hips | on | allow the hands-on-hips gesture |
| Doze after (seconds) | 30 | a character left standing this long may nod off; 0 = never |
| Rhythm seed | 1 | changes every character's rhythm at once |

## Script calls

```
CSAF.StrideIdle.setMode(target, 'full' | 'breathe' | 'off' | 'auto')
CSAF.StrideIdle.play(target, 'glance' | 'shift' | 'hips' | 'doze' | 'blink')
CSAF.StrideIdle.isIdle(target)
CSAF.StrideIdle.prepare(target)
```

`target` is `$gamePlayer`, a character, or the number the commands use.

## What to expect on different sheets

- **Hands on hips needs a torso long enough to show it**: figures whose waist sits at least a third of their
  height below the neck, with arms the walk shows clearly. MZ's stock characters are big-head chibis whose
  arms hang under the chin, so on them this gesture is never drawn; they breathe, blink, shift, glance and
  doze. Hands on hips plays only when all four facings can show it, so a character never loses it by turning.
  Measured over the test cast: 6 of 116 characters draw it in all four facings (custom and tall figures).
- **Blinking needs a pair of eyes the plugin can find**: from the front, 88 of the 116 test characters
  blink; from the side, 84. The eyes are found against the face's own skin colour, light or dark. A helmet,
  a mask, hair over the eyes or a face it cannot read simply does not blink (it is never guessed). From
  behind there is no face, so there is no blink.
- A long robe or skirt has no legs to shift: the weight shift moves the robe's hem with the hip.
- Every pixel of every drawing is one of the character's own colours; nothing is resampled or blended.

## Compatibility

Stride Idle extends these engine methods and calls the original of each:
`Game_CharacterBase.prototype.update`; `Sprite_Character.prototype.updateBitmap`, `characterBlockX`,
`characterBlockY`, `characterPatternX`, `patternWidth` and `patternHeight`;
`Sprite_Balloon.prototype.updatePosition`. For an idling character only, the sprite shows the idle cell
(a little larger than the walking cell, so an elbow on a hip and a rising head are never cut off), anchored at
the feet; a balloon still sits on the head.

**With Stride Run:** a running character runs, a standing one idles; tested together in the engine (a dash
shows the run sheet, a stop shows the idle sheet, neither sticks). A character that Knack, Posture, Hoist,
Stricken or Rally Field is posing, working or carrying keeps that look. If another plugin replaces the
character's sheet while it stands, the plugin that swaps last wins and Stride Idle steps aside for that frame
(it checks that the sprite still shows its own sheet). Not tested with VisuStella Events & Movement Core's
idle or other idle-animation plugins: use one idle plugin per character.

Saves: only Idle Mode is saved (a number on the character); the idle and its rhythm are never written to the
save file.

Measured performance: each character's idle is drawn once and cached; on a steady frame an idling character
counts down a few numbers and compares them, and allocates nothing. Eight characters idling on a map:
**9** draw calls a frame, **0** texture uploads, display objects steady.

Tested on MZ 1.10.0 (the stock runtime) with the stock database and the 96 stock characters.

## Credits

Core Systems Asset Factory. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
