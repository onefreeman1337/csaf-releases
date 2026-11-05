# Posture - Sit, Kneel, Sleep and Wave Poses From Your Own Sprites (RPG Maker MZ) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Posture - Sit, Kneel, Sleep and Wave Poses From Your Own Sprites (RPG Maker MZ)  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/posture  
**Docs published:** 2026-11-05


---

# Posture for RPG Maker MZ

Your characters can sit, kneel, lie down, sleep, collapse, wave and cheer, and every one of those poses is made from
the walking sheet the character already has. No new art, no pose sheets to draw.

When a character first takes a pose, Posture reads that character's standing frames and builds the pose from the
same pixels: whole pixels moved, dropped, mirrored or turned. Nothing is resampled or blended, so the pose keeps the
sheet's own outline and colours. It is built once, in memory, and reused. Your image files are never changed.

## Install

1. `PostureCore.js`
2. `Posture.js`

Copy both into your project's `js/plugins` folder and turn both ON in the Plugin Manager, PostureCore above Posture.

## The poses

| Pose | What it shows | Facings |
| --- | --- | --- |
| `sit` | seated on a chair or bench, raised by the Seat height | 4 |
| `sitfloor` | sitting on the floor, legs out in front | 4 |
| `kneel` | on one knee | 4 |
| `read` | seated with a book held in both hands | 4 (from behind, no book shows) |
| `lie` | lying on the floor | 2 (head left or head right) |
| `sleep` | in bed, seen from above: head on a pillow, eyes closed, under a quilt, breathing | 3 (face up; head turned left or right) |
| `collapsed` | face down on the ground | 2 |
| `wave` | one arm up, waving; turns to face the camera | animated |
| `cheer` | both arms up, a little jump; turns to face the camera | animated |

The character's facing picks the frame. For `lie` and `collapsed`, facing down or left lays the head to the left,
facing right or up lays it to the right. For `sleep`, facing down or up sleeps face up, and facing left or right turns
the head on the pillow that way.

**Sleeping in a bed.** The stock MZ beds stand upright on the map, pillow on the top tile and the foot on the tile
below, so a sleeper is two tiles tall: put the sleeping event (or the Bed region) on the bed's **foot** tile and the head
lies on the pillow tile above it. The quilt is in the colour of the character's clothes.

How the poses are made: the figure is measured once on its down-facing standing frame (its top, its neck, and its hip,
which is where the figure narrows from the arms-and-body width to the legs; a long skirt or robe that never narrows
counts its bottom fifth as legs). A seated pose drops the upper body onto the lap and moves the lower legs; a side view
slides the lower legs forward, never stretches them; a kneeling figure bows its head; a lying pose turns the whole
figure a quarter turn. The arms of a wave or cheer are found from the character's own walk (the pixels that swing as it
walks) and turned up about the shoulder, so they stay attached. A sleeper's eyes are closed by finding the pair of eyes
in its face; on a face where no pair can be told apart from the hair, the face is left as drawn.

The pixels that are not the character's own: a soft shadow on the floor under seated, kneeling and lying figures; the
book; and the pillow, sheet and quilt, painted in the character's own colours and lighter and darker tints of them.

## Setting a pose

**Event notetag** (the event's Note box): `<pose: sit>` the event starts in this pose.

**Page comment** (a Comment command on an event page): `<pose: sleep>` while this page is active the event holds this
pose. A page without one uses the notetag, and an event with neither stands. `<pose: auto>` sits on a chair region and
sleeps on a bed region (see the parameters; paint the Bed region on the beds' foot tiles), and stands anywhere else.

**Plugin commands:** **Set pose** (Who: player, this event or an event id; Pose) and **Stand up** (Who). Set pose with
`stand` also ends the pose.

**Script:** `Posture.set($gamePlayer, 'kneel')`, `Posture.set(5, 'wave')` (an event id; 0 is the player),
`Posture.clear(5)`, `Posture.get($gameMap.event(5))`.

Poses are saved with the game.

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Seat height | 6 | Pixels a character on a chair (`sit`, `read`) is raised, 0 to 24 |
| Stand up on move | Stand up | A posed character who takes a step stands and walks normally |
| Chair regions | 10 | Region ids, comma separated, where `auto` sits |
| Bed regions | 11 | Region ids, comma separated, where `auto` sleeps |
| Breath length | 48 | Frames per breath of a sleeping character (60 = one second) |
| Wave speed | 10 | Frames per step of a waving or cheering character |

## What works with what

- Normal 8-character sheets and `$` one-character sheets, any cell size (the cell is the sheet width / 12 and height / 8,
  or / 3 and / 4 for a `$` sheet, exactly as MZ reads it).
- Tile-image events and events with no image are left alone.
- A character sheet whose down-facing standing frame is empty is left alone.
- Tested on every one of the 96 stock MZ characters (Actor1-3, People1-4 and the SF sheets) as well as CSAF's own
  sheets in three other styles: every pose derives, keeps the character's colours and stays inside its cell. Eyes were
  closed on 77 of 96 stock sleepers; the rest keep their faces as drawn.
- The arms of a wave or cheer are the ones that swing in the character's walk. A long robe whose walk swings nothing,
  with the hands kept inside it, raises little that shows: try those characters with `cheer` before you use `wave`.

**What it changes in the engine:** it extends `Sprite_Character.prototype.updateBitmap`, `characterBlockX`,
`characterBlockY`, `characterPatternX`, `patternWidth` and `patternHeight`, `Game_CharacterBase.prototype.increaseSteps`
and `Game_Event.prototype.setupPageSettings`, calling the original first or falling through to it when a character
holds no pose; it adds `Game_CharacterBase.prototype.csafPose` and `csafSetPose`.

## Demo files

`Demo/img/characters/CSAF_Townsfolk.png` (eight townsfolk) and `Demo/img/characters/$CSAF_Tall_Warden.png` (one tall
character, 48 x 64 cells) are CSAF's own art, included so you can try every pose straight away. You may use them in
your projects under the same terms as the plugin.

## Terms

Commercial and non-commercial use in RPG Maker projects. Credit is appreciated, not required. Written with AI
assistance (see LICENSE.txt).


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
