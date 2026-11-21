# Byplay Reactions — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Byplay Reactions  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-21


---

# Byplay Reactions v1.0.0 for RPG Maker MZ

Part 1 of **Byplay** by Core Systems Asset Factory (https://csaf.itch.io).

A walking sprite in MZ can walk and stand. It cannot nod, shrug or put its head in its hands, so a cutscene
has to say it in words or with a balloon icon. Byplay Reactions gives every walking sheet **fifteen
reactions in each of the four facings**, drawn from that character's own pixels the first time they are
needed, and plays them from a code inside a message, so the speaker acts as the line prints. No pose art to
draw, for the hero, the followers or any event.

## The fifteen reactions

| Reaction | What you see |
| --- | --- |
| `nod` | the chin tucks a row, then two, twice (the head's own rows move; the sprite is never squashed) |
| `shake` | the head turns a pixel each way with the eyes, twice |
| `shrug` | shoulders and head up a row, both forearms out to the sides, palms up |
| `facepalm` | the head bows and one hand covers the eyes |
| `think` | a hand to the chin |
| `point` | one arm straight out at shoulder height |
| `beckon` | the arm held out, the forearm curling up and back, three times |
| `clap` | both hands meet at the chest and part, four times |
| `salute` | the right hand to the brow |
| `pray` | eyes shut, head bowed, both hands together under the chin |
| `bow` | toward the camera the head and shoulders go down and the hands meet at the belly; seen from the side the body leans forward from the hip |
| `sob` | eyes shut, head down, both hands to the face, the shoulders heaving |
| `laugh` | eyes shut, the head tipped back, a hand on the belly, the body shaking |
| `scratch` | a hand on the crown, rubbing |
| `cower` | eyes squeezed shut, the head ducks and both hands cover it |

Names are read in any case, and a few other words work too: `yes` and `no` (nod, shake), `dunno` (shrug),
`hmm` (think), `come` (beckon), `applause` and `bravo` (clap), `cry` and `weep` (sob), `haha` (laugh),
`flinch` and `duck` (cower).

The arms are **redrawn bent at the elbow** in the character's own sleeve, skin and outline colours (one
sleeve colour for both arms, read from the arms themselves; hair is never taken for a sleeve; where an arm
crosses the body it takes the sheet's own darker shade of that sleeve and skin, so it stays visible), with the
hand placed on a spot measured on that figure: the eyes, the chin, the brow, the chest, the crown, the belly.
The hand the arm used to hang with is removed from the hip. The
eyes shut with the character's own lid colour (Stride Idle's blink). Every pixel of every drawing is one of
the character's own colours; nothing is resampled or blended.

## Install

1. Copy the six files from `js/plugins` into your project's `js/plugins` folder.
2. Turn on all six in the Plugin Manager. Any order works; this order reads best:
   PostureCore, KnackCore, StrideCore, StrideIdleCore, ByplayReactionsCore, ByplayReactions.

If you already own Stride, Posture, Knack or Rally, keep ONE copy of PostureCore.js, KnackCore.js,
StrideCore.js and StrideIdleCore.js: the files in this download are the same files, byte for byte.

## In a message

Put the code in the message text where the reaction should start. It prints nothing.

```
\BYP[shrug]Who knows where he went?
I told you!\BYP[facepalm] Nobody listens.
```

`\BYP[name]` plays on the event that is running the message. A second number names someone else, with the
same numbers the plugin commands use:

```
\BYP[nod,-1]    the player
\BYP[clap,-2]   follower 1 (-3 and -4: followers 2 and 3)
\BYP[laugh,5]   event 5
```

The code letters are a parameter (BYP by default) if they clash with another plugin's code. In other
windows (choices, help text) the code is removed and plays nothing.

## Plugin commands

| Command | What it does |
| --- | --- |
| Play Reaction | Who (-1 the player, -2/-3/-4 the followers, 0 this event, 1 and up an event id), Reaction, and Wait for it: **Wait** pauses the event until the reaction has played (a cutscene beat), **Do not wait** lets the event go on. |
| Stop Reaction | ends a character's reaction now; it stands as drawn again. |
| Prepare Reactions | draws a character's reactions now, so the first one plays on its first frame (a cutscene's cast before the scene starts). |

A reaction plays in the direction the character faces. Each character's reactions are drawn once, the first
time any reaction is asked for, and cached; that first drawing is a one-off cost, and Prepare Reactions moves
it to wherever you like (before a cutscene, behind a fade).

## Parameters (ByplayReactions.js)

| Parameter | Default | What it does |
| --- | --- | --- |
| Speed (%) | 100 | how fast every reaction plays; 200 = twice as fast |
| Message code letters | BYP | the letters of the message code |

## Script calls

```
CSAF.Byplay.react(target, 'nod')      // true when it plays
CSAF.Byplay.stop(target)
CSAF.Byplay.isReacting(target)
CSAF.Byplay.prepare(target)
CSAF.Byplay.length('bow')             // frames, at the Speed setting
```

`target` is `$gamePlayer`, a character, or the number the commands use.

## Who can react

A character standing on the map with a walking sheet. A character that is moving, jumping, a tile, an object
sheet (a file name starting with `!`), an erased event, the player in a vehicle, or a character another CSAF
map pose holds (Posture, Knack, Hoist, Stricken, Rally Field) does not react: the call returns false and
nothing changes. Walking off ends a reaction at once. A reaction is a moment, not a state: it is never written
to the save file.

## What to expect on different sheets

- **The arms come from the walk.** A reaction that moves an arm needs an arm the plugin can find. Measured
  over the 116-character test cast (20 CSAF test characters and MZ's 96 stock characters): from the front both
  arms move on 113, from behind on 111, and in profile the near arm moves on 91. Where a facing shows no arm
  it can trust (a cape over the arm, a sleeve hidden in a robe, hair where the arm should be), that facing plays
  the head and body part of each reaction instead (a facepalm is then a bowed head; a point does nothing), and
  an arm is never drawn from nothing.
- If one front arm cannot be found but the other can, the missing side is drawn as the other arm's mirror, in
  the same colours.
- **From behind**, a hand raised to the face or held at the chest passes behind the head and the body, as it
  would, so a clap or a scratch seen from behind can look still.
- The nod and the head shake are one or two pixels of head movement: they read in motion, not in a still.
- Eyes shut only where Stride Idle's blink finds a pair of eyes; elsewhere the face stays as drawn.

## Compatibility

Byplay Reactions extends these engine methods and calls the original of each:
`Game_CharacterBase.prototype.update`; `Sprite_Character.prototype.updateBitmap`, `characterBlockX`,
`characterBlockY`, `characterPatternX`, `characterPatternY`, `patternWidth` and `patternHeight`;
`Sprite_Balloon.prototype.updatePosition`; `Scene_Map.prototype.start`;
`Window_Base.prototype.processEscapeCharacter` (for the `\BYP` code only; every other code goes to the
original). It adds `csafByplayUpdate` and `csafByplayFrame` to `Game_CharacterBase`. For a reacting
character only, the sprite shows the reaction cell (a little larger than the walking cell, so a pointing arm
and a hand on the crown are never cut off), anchored at the feet; a balloon still sits on the head.

**With Stride Idle:** a reacting character stops idling for the length of the reaction and idles again after;
tested together in the engine. To do that it wraps Stride Idle's own `csafIdleFrame` (saved and called for
every character that is not reacting) when the map first starts or the first reaction plays, so the two work
in either Plugin Manager order. If another plugin replaces the character's sheet while it reacts, the plugin
that swaps last wins and Byplay Reactions steps aside for that frame. Message plugins that keep MZ's own
escape-code handling (MZ's message window does) pass the code through; VisuStella Message Core was not tested
in the engine.

Measured performance: eight characters acting on a map at once (each starting its next reaction the frame
its last one ends): **9** draw calls a frame, **0** texture uploads, display objects steady. A reacting
character's per-frame work counts a frame and reads a table, and allocates nothing.

Tested on MZ 1.10.0 (the stock runtime) with the stock database and the 96 stock characters.

## Credits

Core Systems Asset Factory. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
