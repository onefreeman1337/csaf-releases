# Gargoyle — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Gargoyle  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-10-28


---

# Gargoyle for RPG Maker MZ

Statues of your own monsters that move only while nobody is looking. Each time the player looks back, a statue is
nearer, standing in a different pose, with a fresh crack in its stone and grit settling at its feet. Touch one, or
let one reach you, and the stone splits into plates and falls away: the monster steps out, and your event (or a troop
battle) takes over.

Every statue is struck from the character's own walking sprite, in one of seven materials, when the map loads. Its
held poses are made from its own frames. No statue art to draw, no pose sheets, and your image files are never
changed.

## Install

1. `PlinthCore.js`
2. `PostureCore.js`
3. `GargoyleCore.js`
4. `Gargoyle.js`

Copy all four into your project's `js/plugins` folder and turn them ON in the Plugin Manager. Any order works.
`PlinthCore.js` is the same file Plinth ships and `PostureCore.js` the same file Posture and Embrace ship, byte for
byte; if you own those, keep one copy of each.

## Make a statue

Put a Comment on an event page (that page is a statue), or a note on the event (every page with a character graphic is
a statue):

| Tag | What it does |
| --- | --- |
| `<gargoyle>` | the page's own graphic, struck in the default material |
| `<gargoyle: actor 3, bronze, age 60>` | actor 3's walking sprite, in old bronze (the page needs no graphic) |
| `<gargoyle: screen, speed 3>` | moves only while off screen, slowly |
| `<gargoyle: still, near 2>` | never moves; wakes when the player comes within 2 tiles |
| `<gargoyle: troop 4>` | wakes into a battle with troop 4 |
| `<gargoyle: steps 2>` | moves at most 2 tiles each time it is unwatched |
| `<gargoyle: off>` | (in a page comment) this page is not a statue, even with the note |

Tokens, comma separated, any order: `self` or `actor N`; a material (`granite` `marble` `sandstone` `bronze` `gilt`
`obsidian` `ice`); `age N` (0 to 100); `lantern`, `screen` or `still`; `speed N` (1 to 6); `steps N`; `near N`;
`troop N`; `off`. A token it does not understand is reported in the console with the event and map, never ignored.

## The gaze rules

- **lantern** (the default): the map is dark except the player's lantern, a beam where the player faces and a glow all
  round. Whatever the lantern lights is watched. Wall and roof tiles (A3, A4) and the sight-blocking region cast
  shadow, so a statue behind a wall is unwatched even inside the beam. A statue in the dark is not drawn at all, so it
  can never be seen moving. The beam turns with the player.
- **screen**: a statue is watched while any part of it is on screen.
- **still**: it never moves. Wake it by touch, by `near N`, or by command (an armos-style guardian).

A watched statue is frozen, even halfway between two tiles. An unwatched one walks toward the player around obstacles.

## A glance

When a statue that moved is seen again it is nearer, and:

- it holds the **next pose** of its cycle: two strides, a lean, a lunge, a crouch, an arm raised, both arms raised,
  and turned half away. Every eight glances show all eight, in an order of its own, never the same pose twice in a
  row. A pose the sprite cannot make distinct (a winged creature has no arm to raise) is replaced by a hunch, a lean
  the other way or a slump, so the eight stay different pictures;
- it gains a **crack** (up to 12): each new crack is added and none moves;
- **grit** falls from it and settles;
- the glance sound plays, if you set one.

## Waking

A statue wakes when the player touches it (give its page the trigger Action Button, Player Touch or Event Touch), when
it reaches the player (first seen within one tile after closing in), when the player comes within `near N`, or by the
**Wake a statue** command. The stone splits into twelve plates that are thrown off and fall, dust settles, the screen
shakes (Shake when the stone breaks), and the living character fades in. The player cannot move while the stone breaks.

Then the page's own commands run, as if it had been started, or, with `troop N`, a battle with that troop: win and
the event's self switch (Self switch on a won battle, A by default) turns ON and the event is erased; lose and it is
game over; escape and nothing more happens. A woken character turns back to stone where it stands after its event
ends (Turn back to stone after, 180 frames; 0 keeps it alive), the stone climbing from its feet.

## Commands

| Command | What it does |
| --- | --- |
| Hold statues | ON: one statue (Event ID) or every statue (0) stays still, watched or not. OFF: it moves again |
| Wake a statue | Event ID (0 = this event): the stone breaks |
| Turn back to stone | Event ID (0 = this event): a woken statue turns back to stone |
| Lantern | auto (shown on maps with a lantern-rule statue), on, or off (off: no darkness; the rule still follows the player's facing, so a statue behind the player can be seen moving) |

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Gaze rule | lantern | the rule a statue uses when its tag names none |
| Default material | granite | used when a tag names none |
| Default age | 20 | weathering, 0 to 100: lichen, rain streaks, moss |
| Statue speed | 4 | 1 to 6, as the event editor's Speed (4 = the player's walk) |
| Steps per look-away | 0 | the most tiles a statue may move each time it is unwatched; 0 = no limit |
| Lantern beam width | 76 | degrees, full width |
| Lantern reach | 7 | tiles |
| Lantern glow radius | 1.2 | tiles all round the player |
| Darkness | 238 | 0 to 255, how dark the unlit map is |
| Walls block sight | ON | A3 and A4 tiles block the lantern |
| Sight-blocking region | 0 | tiles painted with this region also block sight; 0 = none |
| Self switch on a won battle | A | turned ON when a `troop N` statue is beaten |
| Turn back to stone after | 180 | frames after a woken statue's event ends; 0 = it stays alive |
| Switch: a statue is moving | 0 | ON while any statue moved in the last half second (music, a heartbeat) |
| Variable: nearest statue | 0 | the tiles between the player and the nearest stone statue |
| Sound: a statue is seen moved | (none) | an SE from audio/se |
| Sound: the stone breaks | (none) | an SE from audio/se |
| Shake when the stone breaks | ON | |
| Blank the eyes | ON | a statue has no eyes: they are blanked when a face is found, never guessed |

## What works with what

- Normal 8-character sheets and `$` one-character sheets, any cell size. Tested on the stock MZ characters (Actor1,
  People1, Monster, Evil, SF_Monster) and on CSAF's own goblins, orcs, townsfolk and winged creatures: every facing of
  every one gets eight different held poses.
- Tile-image events cannot be statues.
- Any map. Statues save with the game: their pose, cracks and state come back exactly.
- Statues are read from their sheet once, when the map loads; nothing reads pixels during play.

**What it changes in the engine:** it extends `Game_Map.prototype.setup`, `refresh` and `update`,
`Game_Event.prototype.update`, `updateSelfMovement`, `start` and `list`, `Game_Player.prototype.canMove`,
`Sprite_Character.prototype.update`, `isEmptyCharacter`, `updateBitmap`, `updateFrame` and `updateVisibility`, and
`Spriteset_Map.prototype.createLowerLayer`, calling the original first or falling through to it for anything that is
not a statue. It adds `Sprite_Character.prototype.gargoyleLayer` (a sprite beside each statue for its grit and plates),
`updateGargoyleGrit`, `updateGargoylePlates` and `hideGargoyleExtras`, and saves `$gameSystem._gargoyle` and each statue event's `_garg` record.

## Terms

Commercial and non-commercial use in RPG Maker projects. Credit is appreciated, not required. Written with AI
assistance (see LICENSE.txt). The creatures and ground in the store images are other Core Systems Asset Factory art
and are not part of this download.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
