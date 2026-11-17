# Stride Gaits — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Stride Gaits  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-17


---

# Stride Gaits v1.0.0 for RPG Maker MZ

Part 3 of **Stride** by Core Systems Asset Factory (https://csaf.itch.io).

In MZ a character walks the same way whatever is happening to it. Stride Gaits gives every walking sheet
**five gaits the game can switch by itself**: a limp at low HP, a tired trudge, a crouched sneak, wading
through water (once you mark which tiles are water), and a tucked jump with a landing. **Fourteen drawings in each of the four facings**, made
from that character's own walking sheet when first needed. No gait art to draw, for the hero, the
followers or any event.

## What the gaits look like

| Gait | Drawings | What you see |
| --- | --- | --- |
| limp | 3 | the step and the stand as drawn; the step onto the hurt leg sinks two rows (the knee gives), the head drops and the body tilts over it. Played step, stand, sink, stand: a hitch on one side |
| tired | 3 | the head hangs, the body leans forward seen from the side, and every step lands heavy (the knees bend a row) |
| sneak | 3 | crouched low: the knees bent by a third of the leg, the head down, the shoulders hunched forward seen from the side; from the front the knees go out |
| wade | 3 | the legs below the water line are gone, the water's surface crosses the body and a ripple ring widens at each step |
| jump | 1 | in the air, both knees drawn up to the body |
| land | 1 | the landing: knees bent, the body down, the feet set apart seen from the front |

Every drawing is the sheet's own pixels moved whole: nothing is stretched, resampled or blended. The only
pixels not taken from the sheet are the wade's two water colours (a pale surface line and a white foam ring).

## Install

1. Copy the five files from `js/plugins` into your project's `js/plugins` folder.
2. Turn on all five in the Plugin Manager. Any order works; this order reads best:
   PostureCore, KnackCore, StrideCore, StrideGaitsCore, StrideGaits.

If you already own Stride Run, Stride Idle, Posture, Knack or Rally, keep ONE copy of PostureCore.js,
KnackCore.js and StrideCore.js: the files in this download are the same files, byte for byte.

## What switches a gait on

| Gait | The party (player and each follower, by its own actor) | Events |
| --- | --- | --- |
| limp | HP under **Limp below HP %** (25 by default) | the `<stride gait: limp>` tag or Set Gait |
| tired | a **Tired state** (stock state 4, Poison, by default) or the **Tired switch** ON | tag or Set Gait |
| sneak | a **Sneak state** (stock state 21, Hide, by default) or the **Sneak switch** ON, so any stealth plugin or event can drive it | tag or Set Gait |
| wade | standing on a **Wade region** or the **Wade terrain tag** | the same, for any event with a normal walk |
| jump | any jump (the Jump move route command, or a plugin that uses it), when **Jump pose** is on | the same |

When two apply: wade, then sneak, then limp, then tired. Wading needs you to mark the shallow water: give
those tiles a region id and put it in Wade regions (nothing wades until you do).

HP and states are read when MZ itself updates the actor (damage, healing, a state added or removed, an inn),
never every frame.

These keep their own look and never show a gait: an event whose page uses Stepping, has Walking turned off,
or has Direction Fix on; an object sheet (a file name starting with `!`); a tile event; an event with no
picture. The **Which events** parameter picks **everyone** (the default: normal walking events wade, jump
and land like the party) or **tagged** (only events that carry a tag show a gait, and the tag decides which:
`<stride gait: wade>` makes an event wade wherever it stands).

Note tags go in an event's Note box or in a Comment on its current page (a comment on the page wins):

| Tag | What it does |
| --- | --- |
| `<stride gait: limp>` | limps, always |
| `<stride gait: tired>` | trudges, always |
| `<stride gait: sneak>` | sneaks, always |
| `<stride gait: wade>` | wades, always (a character standing in water on a map you painted yourself) |
| `<stride gait: off>` | never a gait, never a jump pose |

## Speed and dashing

With **Gaits slow the walk** on (the default), the player and events move one speed step slower while
limping, tired, sneaking or wading (never below the slowest speed; followers keep up with the player).
With **No dashing in a gait** on (the default), the player cannot dash in a gait.

## Plugin commands

| Command | What it does |
| --- | --- |
| Set Gait | Who (-1 the player, -2/-3/-4 the followers, 0 this event, 1 and up an event id) and Gait: **limp**, **tired**, **sneak**, **wade**, **walk** (never a gait) or **auto** (the rules above). Kept in the save file. |
| Prepare Gaits | draws a character's gaits now, so they are ready the moment one is needed. |

The party's gaits are drawn when the map first shows them; an event's the first time it needs one, at most
one character per frame. Each character's sheet is drawn once and cached; on the 116-character test cast
every one took under 100 ms to draw.

## Parameters (StrideGaits.js)

| Parameter | Default | What it does |
| --- | --- | --- |
| Limp below HP % | 25 | a party member under this share of max HP limps; 0 = never by HP |
| Tired states | 4 (Poison) | a party member with any of these states is tired |
| Tired switch | 0 (none) | while ON the whole party is tired |
| Sneak states | 21 (Hide) | a party member with any of these states sneaks |
| Sneak switch | 0 (none) | while ON the whole party sneaks |
| Wade regions | none | characters on these region ids wade |
| Wade terrain tag | 0 (none) | characters on this terrain tag wade |
| Jump pose | on | tuck in the air, squash on landing |
| Landing frames | 8 | how long the landing shows; 0 = no landing pose |
| Gaits slow the walk | on | one speed step slower in a gait |
| No dashing in a gait | on | the player cannot dash in a gait |
| Which events | everyone | everyone or tagged (see above) |

## Script calls

```
CSAF.StrideGaits.set(target, 'auto' | 'limp' | 'tired' | 'sneak' | 'wade' | 'walk')
CSAF.StrideGaits.gait(target)
CSAF.StrideGaits.prepare(target)
```

`target` is `$gamePlayer`, a character, or the number the commands use. `gait()` returns the gait shown now
(`'limp'`, `'tired'`, `'sneak'`, `'wade'`, `'jump'`, `'land'`, or `''` for none).

## What to expect on different sheets

- Every gait is drawn for every character with a standing frame: on the 116-character test cast (the 96
  stock MZ characters and 20 custom figures, tall and chibi), all 116 drew all fourteen drawings in all four
  facings, with every foot on the walking frame's own floor row.
- On MZ's stock big-head chibis the legs are four to nine rows tall, so a crouch is two or three rows: small
  at 1x, clear in motion because the head drops with it.
- A long robe or skirt is never split down the middle: the knees-out of the sneak and the landing apply only
  to legs.
- The ripple ring is drawn inside the character's own sprite, so it moves with the character and never
  needs a map tile.

## Compatibility

Stride Gaits extends these engine methods and calls the original of each:
`Game_CharacterBase.prototype.update` and `realMoveSpeed`; `Game_Player.prototype.isDashing`;
`Game_BattlerBase.prototype.refresh` and `recoverAll` (to read HP and states when they change);
`Sprite_Character.prototype.updateBitmap`, `characterBlockX`, `characterBlockY`, `characterPatternX`,
`patternWidth` and `patternHeight`; `Sprite_Balloon.prototype.updatePosition`. For a character in a gait
only, the sprite shows the gait cell (a little larger than the walking cell, so a lean and a ripple are never
cut off), anchored at the feet; a balloon still sits on the head.

**With Stride Idle:** a limping character standing still idles (its standing drawing is the plain one); a
tired, sneaking or wading character keeps its gait while it stands instead of breathing upright. Tested
together in the engine, with Stride Idle installed after Stride Gaits.

**With Stride Run:** with No dashing in a gait on, a limping player holding the dash key limps; healed, it
runs. Tested together in the engine. A character that Knack, Posture, Hoist, Stricken or Rally Field is
posing, working or carrying keeps that look. If another plugin replaces the character's sheet while it walks,
the plugin that swaps last wins and Stride Gaits steps aside for that frame. Not tested with VisuStella
Events & Movement Core's own sprite changes or other plugins that swap walking sheets.

Saves: only Set Gait is saved (a number on the character); the gaits, the actor readings and the jump state
are never written to the save file.

Measured performance: each character's sheet is drawn once and cached; on a steady frame a character in a
gait compares a few numbers and allocates nothing. A map with the party and five figures in gaits:
**9** draw calls a frame, **0** texture uploads, display objects steady.

Tested on MZ 1.10.0 (the stock runtime) with the stock database and the 96 stock characters.

## Credits

Core Systems Asset Factory. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
