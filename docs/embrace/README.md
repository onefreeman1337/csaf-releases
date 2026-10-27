# Embrace — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Embrace  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-10-27


---

# Embrace for RPG Maker MZ

Two of your characters hug, kiss, shake hands, high five, bow to each other, dance, walk hand in hand, ride piggyback
and carry one another in their arms. Every pair pose is made from the two walking sheets the characters already have.
No new art, no pair sheets to draw.

The first time a pair takes a pose, Embrace reads both characters' standing and walking frames and composes one new
picture in which they touch. An arm that reaches for the partner is the character's own arm, found from the pixels
that swing in its walk and turned about its shoulder. Whole pixels are moved, never resampled or blended, so both
characters keep their own outline and colours. The pair is built once, in memory, and reused. Your image files are
never changed.

## Install

1. `PostureCore.js`
2. `EmbraceCore.js`
3. `Embrace.js`

Copy all three into your project's `js/plugins` folder and turn them ON in the Plugin Manager in this order.
`PostureCore.js` is the same file Posture ships; if you own Posture, keep one copy.

## The poses

| Pose | What it shows | How the pair stands |
| --- | --- | --- |
| `hug` | bodies together, cheek to cheek, an arm round the partner's shoulders and one round the waist | face to face, 4 facings |
| `kiss` | faces together, eyes closed, the taller one leaning down, a heart rising | face to face, 4 facings |
| `handshake` | the two hands meet halfway, at the waist | face to face, 4 facings |
| `highfive` | the hands meet over their heads, with a burst | face to face, 4 facings, plays once |
| `bow` | both bow to each other | face to face, 4 facings, plays once |
| `dance` | a close hold that turns through all four facings, with notes | turning |
| `holdhands` | hand in hand; the pair walks together | walks |
| `piggyback` | the partner rides on the leader's back, legs round its waist | walks |
| `carry` | the leader carries the partner across its arms | walks |

**Standing poses** (hug, kiss, handshake, highfive, bow, dance): put the two characters on neighbouring tiles. They
turn to face each other and meet halfway between the two tiles. The side they stand on picks the view: side by side
shows them in profile; one above the other shows one from the front and one from behind.

**Walking poses** (holdhands, piggyback, carry): the first character leads. The partner goes wherever the leader walks,
drawn in the pair, and its own sprite is hidden. On Let go the partner steps off onto a free tile beside the leader.
When the player is the partner of an event, the player does not walk on its own until Let go.

How a pair is made: each character is measured on its own down-facing standing frame (head, neck, hip, and the arms,
found from the pixels that swing in its walk; a sheet whose walk swings nothing uses the outer fifth of the figure).
The two figures stand on one floor, placed by comparing their outlines row by row: bodies pressed together for a hug,
faces touching for a kiss, an arm's length apart for a handshake; hands that meet stop where they meet. The carried
figure, lying across the leader's arms, is made by PostureCore, the same rules Posture uses; a piggyback rider peeks over
the leader's shoulder with its legs round the leader's waist. Overlap is ordered by facing: an arm that holds a partner
is drawn over them, and the figure nearer the camera over the one behind.

The pixels that are not copied straight from the two sheets: a one-pixel edge, in one of the character's own darker
colours, where an arm was taken from the side of a body or where a moved arm crosses a partner's body (never in open
air), and the small flourishes (a heart, a small heart, notes, a sweat drop, a burst), which the Flourishes parameter
hides.

## Starting a pair

**Page comment** (a Comment command on an event page): `<embrace: hug, 3>` this event hugs event 3 when the page comes
on. `<embrace: holdhands, player>` pairs it with the player. The pair starts once per page; a step can end it (below).

**Plugin commands:** **Embrace** (Who, With, Pose; each of Who and With is the player, this event, an event id or a
follower number) and **Let go** (Who).

**Script:** `Embrace.start($gamePlayer, $gameMap.event(3), 'holdhands')`, `Embrace.start(5, 0, 'hug')` (event ids; 0 is
the player), `Embrace.stop(5)`, `Embrace.get($gamePlayer)` returns the pose name or `''`.

Pairs are saved with the game. A pair whose partner is an event of the map ends when the player leaves that map.

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Flourishes | Show | The heart over a kiss, notes over a dance, a sweat drop over a piggyback, a burst on a high five |
| Let go on a step | Let go | A standing pose ends when either character takes a step |
| Dance turn | 40 | Frames a dancing pair holds each facing before turning to the next (60 = one second) |
| Flourish speed | 12 | Frames per step of a rising heart or note, and of a bow or high five playing out |

## What works with what

- Normal 8-character sheets and `$` one-character sheets, any cell size, mixed in one pair: a big-head chibi with a
  48 x 64 tall character works, and the taller one leans down for a kiss.
- Tested on all 96 stock MZ characters (Actor1-3, People1-4 and the SF sheets), each paired with another stock
  character, in all nine poses and every facing, and on CSAF's own sheets in three other drawing styles: every pair
  pose builds, uses only the two characters' own colours plus the flourishes, keeps both characters visible, and
  stays inside its frame.
- Tile-image events and events with no image cannot lead or join a pair.
- Followers can be partners (choose "follower" in the command). A pair is drawn as one sprite, so the pair is
  drawn at the leader's depth on the map.

**What it changes in the engine:** it extends `Sprite_Character.prototype.updateBitmap`, `updateVisibility`,
`updatePosition`, `characterBlockX`, `characterBlockY`, `characterPatternX`, `characterPatternY`, `patternWidth` and
`patternHeight`, `Game_CharacterBase.prototype.update` and `increaseSteps`, `Game_Player.prototype.canMove` and
`performTransfer`, `Game_Event.prototype.setupPageSettings` and `Game_Map.prototype.update`, calling the original
first or falling through to it when a character is in no pair; it adds `Game_CharacterBase.prototype.csafEmbrace` and
`csafHeld`.

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
