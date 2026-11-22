# Byplay Moods — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Byplay Moods  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-22


---

# Byplay Moods v1.0.0 for RPG Maker MZ

Part 2 of **Byplay** by Core Systems Asset Factory (https://csaf.itch.io).

A walking sprite in MZ stands the same way whatever the scene is about: the grieving widow and the cheerful
shopkeeper hold the same pose. Byplay Moods gives every walking sheet **ten moods it can hold, in each of the
four facings**, drawn from that character's own pixels the first time they are needed. A mood stays on while
the character stands, with a small loop that keeps it alive (a huff, a fidget, a bounce, a sigh), until you
change it. Put a tag on an event page and a whole room carries its mood with no event logic. (Where a facing shows no arm the
plugin can trust, that facing keeps the head, eyes and body part of the mood; how often that happens is measured below.)

## The ten moods

| Mood | What you see | Its loop |
| --- | --- | --- |
| `sulking` | arms folded across the chest, the head bowed a row and turned away | a huff: the shoulders rise a row now and then |
| `proud` | the chin up two rows, both hands clasped behind the back, the elbows out | a sniff: the chin goes up once more, the eyes shut slowly |
| `nervous` | hands wringing at the belly, the head sunk a row | the eyes dart one way then the other, the hands trade places |
| `furious` | the shoulders hunched up, the head sunk into them, fists clenched beside the hips | trembling: a burst of shaking, then still |
| `grieving` | eyes shut, the head bowed two rows, the shoulders slumped, the hands hanging clasped low | a sigh: the shoulders sink a row further |
| `lovestruck` | both hands clasped together under the chin, the head leaned toward them | a daydream: the head sways further with the eyes shut |
| `guarded` | one arm across the body gripping the other arm, the head held back | the eyes watch one way then the other |
| `giddy` | fists up under the chin | bouncing: the whole figure leaves the floor by a pixel, then lands with a squash and the eyes shut |
| `shivering` | arms hugging the shoulders, the head sunk, the eyes shut | a shudder: the figure shakes a pixel side to side |
| `bored` | both hands behind the head, the chin tipped up | a long blink with the head lolling to one side |

Names are read in any case, and other words work too: `sulk`, `pout` (sulking), `smug` (proud), `anxious`,
`worried` (nervous), `angry`, `rage` (furious), `sad`, `mourning` (grieving), `smitten`, `dreamy` (lovestruck),
`wary`, `suspicious` (guarded), `excited`, `happy` (giddy), `cold`, `freezing` (shivering), `lazy` (bored).
`none` clears a mood.

The arms are **redrawn bent at the elbow** in the character's own sleeve, skin and outline colours (from the front
and from behind, one sleeve colour for both arms, read from the arms themselves; in profile the near arm takes the
colour Stride's side rule reads from the walking frames, which on some sheets is a darker shade or the trousers' colour; hair is never taken for a sleeve; where an arm crosses the
body it takes the sheet's own darker shade of that sleeve and skin, so it stays visible). Hands held behind the
back or behind the head show only where the body does not cover them, so from the front you see the elbows and
from behind you see the hands. On a big-head figure the head is drawn over folded arms, as it would sit in front
of them. The eyes shut with the character's own lid colour (Stride Idle's blink). Every pixel of every drawing
is one of the character's own colours; nothing is resampled or blended.

## Install

1. Copy the six files from `js/plugins` into your project's `js/plugins` folder.
2. Turn on all six in the Plugin Manager. Any order works; this order reads best:
   PostureCore, KnackCore, StrideCore, StrideIdleCore, ByplayMoodsCore, ByplayMoods.

If you already own Byplay Reactions, Stride, Posture, Knack or Rally, keep ONE copy of PostureCore.js,
KnackCore.js, StrideCore.js and StrideIdleCore.js: the files in this download are the same files, byte for byte.

## On an event: a tag

Put a comment on the event page:

```
<Mood: sulking>
```

or the same tag in the event's Note. The page's comment wins over the Note. The mood starts when the page
starts. When the event turns to a page with no tag, a mood that came from a tag ends; a mood you set with a
command or a message code stays until you change it.

## In a message

Put the code in the message text where the mood should start. It prints nothing.

```
\BYM[sulking]Fine. Go without me.
\BYM[giddy]We won? We WON!
```

`\BYM[name]` sets the mood of the event that is running the message. A second number names someone else, with
the same numbers the plugin commands use:

```
\BYM[nervous,-1]  the player
\BYM[proud,-2]    follower 1 (-3 and -4: followers 2 and 3)
\BYM[none,5]      event 5 stops holding its mood
```

The code letters are a parameter (BYM by default) if they clash with another plugin's code. In other windows
(choices, help text) the code is removed and does nothing.

## Plugin commands

| Command | What it does |
| --- | --- |
| Set Mood | Who (-1 the player, -2/-3/-4 the followers, 0 this event, 1 and up an event id) and Mood (one of the ten, or none). |
| Clear Mood | the character stands as drawn again. |
| Prepare Moods | draws a character's moods now, so a mood shows on its first frame (a cutscene's cast before the scene starts). |

A mood shows in the direction the character faces. Each character's moods are drawn once, the first time a mood
is set, and cached; that first drawing is a one-off cost, and Prepare Moods moves it to wherever you like.

## Parameters (ByplayMoods.js)

| Parameter | Default | What it does |
| --- | --- | --- |
| Beat speed (%) | 100 | how fast each mood's loop plays; 200 = twice as fast |
| Message code letters | BYM | the letters of the message code |

## Script calls

```
CSAF.ByplayMoods.set(target, 'proud')   // true when the character now holds it
CSAF.ByplayMoods.clear(target)
CSAF.ByplayMoods.moodOf(target)         // 'proud', or '' for none
CSAF.ByplayMoods.prepare(target)
CSAF.ByplayMoods.moods()                // the ten names
```

`target` is `$gamePlayer`, a character, or the number the commands use.

## Who holds a mood, and when it shows

Any character with a walking sheet: the player, the followers, any event. A tile or an object sheet (a file
name starting with `!`, a door or a chest) holds no mood: the call returns false and nothing changes.

The mood **shows while the character stands still**. It walks as drawn and goes back into its mood the frame
it stops. A jumping character, an erased event, the player in a vehicle, an event with stepping animation on,
or a character another CSAF map pose holds (Posture, Knack, Hoist, Stricken, Rally Field, Stride Run) does not
show its mood while that lasts; the mood comes back after.

**A mood is a state, kept in the save file** as a small record (`{ v: 1, name }`); the loop's clock is not
saved. The player's and the followers' moods last until you change them; an event's mood lasts while you stay
on its map (events are rebuilt when a map is entered, and their tags set their moods again). A save record from
a newer version, or one naming a mood this version does not know, reads as no mood and never throws.

## What to expect on different sheets

- **The arms come from the walk.** A mood that moves an arm needs an arm the plugin can find. Measured over
  the 116-character test cast (20 CSAF test characters and MZ's 96 stock characters): from the front both arms
  move on 113, from behind on 111, and in profile the near arm moves on 91. Where a facing shows no arm it can
  trust (a cape over the arm, a sleeve hidden in a robe, hair where the arm should be), that facing keeps the
  head, eyes and body part of each mood, and an arm is never drawn from nothing.
- **Short arms.** On a chibi whose arms cannot reach across its own chest, folded or hugging arms are brought
  down onto the chest so they never cross the face.
- **From behind**, hands held in front of the body pass behind it, as they would; proud and bored show their
  hands from behind instead.
- **In profile** only the near arm moves, so sulking, guarded and shivering differ more by the head than by the
  arm from the side.
- **Faces are not redrawn.** The eyes shut where Stride Idle's blink finds a pair of eyes; everything else a mood shows is
  the arms, the body and the head's position. A head moved one or two rows reads in motion more than in a still, so the
  arms carry each mood in a screenshot.

## Compatibility

Byplay Moods extends these engine methods and calls the original of each:
`Game_CharacterBase.prototype.update`; `Game_Event.prototype.setupPageSettings` and `clearPageSettings` (for
the tag); `Sprite_Character.prototype.updateBitmap`, `characterBlockX`, `characterBlockY`, `characterPatternX`,
`characterPatternY`, `patternWidth` and `patternHeight`; `Sprite_Balloon.prototype.updatePosition`;
`Scene_Map.prototype.start`; `Window_Base.prototype.processEscapeCharacter` (for the `\BYM` code only; every
other code goes to the original). It adds `csafMood`, `csafMoodUpdate` and `csafMoodFrame` to
`Game_CharacterBase`. For a character standing in a mood only, the sprite shows the mood cell (a little larger
than the walking cell, so an elbow or a bounce is never cut off), anchored at the feet; a balloon still sits on
the head.

**With Byplay Reactions:** a reaction plays over the mood, and the mood comes back on the very next frame, with
no frame of the plain walking sheet between; tested together in the engine. **With Stride Idle:** a character
in a mood does not idle, and idles again when the mood is cleared; to do that Byplay Moods wraps Stride Idle's
own `csafIdleFrame` (saved and called for every character not in a mood) when the map first starts or the first
mood is set, so the two work in either Plugin Manager order. If another plugin replaces the character's sheet
while it stands in a mood, the plugin that swaps last wins and Byplay Moods steps aside for that frame. Message
plugins that keep MZ's own escape-code handling (MZ's message window does) pass the code through; VisuStella
Message Core was not tested in the engine.

Measured performance: eight characters standing in moods on a map at once (each changing to its next mood
every 90 frames): **9** draw calls a frame, **0** texture uploads, display objects steady. A character's
per-frame work in a mood counts a frame and reads a table, and allocates nothing.

Tested on MZ 1.10.0 (the stock runtime) with the stock database and the 96 stock characters.

## Credits

Core Systems Asset Factory. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
