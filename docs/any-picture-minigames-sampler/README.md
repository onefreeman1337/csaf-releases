# Any Picture Minigames Sampler - Free RPG Maker MZ Jigsaw, Spot the Difference and Picture Reveal Plugins — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Any Picture Minigames Sampler - Free RPG Maker MZ Jigsaw, Spot the Difference and Picture Reveal Plugins  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/any-picture-minigames-sampler  
**Docs published:** 2026-11-05


---

# Any Picture Minigames Sampler for RPG Maker MZ (free)

Three free RPG Maker MZ plugins that turn any picture in your project's `img/pictures` folder into a minigame.
**Jigsaw Lite** cuts the picture into a 9 piece jigsaw the player assembles on a drawn felt table. **Pendant Lite** hangs
the picture twice in a gilt gallery with 3 generated differences to find. **Unveil Lite** hides the picture under a silk
veil the player cuts away, Qix style. Each one is a single plugin command with one picture argument and one result
switch. Free to use in commercial and non commercial games. Each is a small fixed cut of a paid plugin from the same
studio, and the last section lists what the full versions add.

Made by Core Systems Asset Factory. Version 1.0.0. Tested on RPG Maker MZ 1.x core scripts. MZ only (not MV).

---

## What is in the zip

| File | What it does | Needs |
| --- | --- | --- |
| `js/plugins/CSAF_JigsawLite.js` | a 9 piece jigsaw of any picture | nothing else |
| `js/plugins/CSAF_PendantLite.js` | spot the 3 differences in any picture | nothing else |
| `js/plugins/CSAF_UnveilLite.js` | reveal any picture by cutting away a silk veil | the stock sounds `Cursor1`, `Chime1`, `Damage1` in `audio/se` (every new MZ project has them) |
| `img/pictures/CSAF_Harbour.png` | a demo picture to try them with (1024 x 687) | |
| `LICENSE.txt` | the licence | |

## Install

1. Copy the plugin files you want into your project's `js/plugins/` folder. Take one, two or all three: they do not
   depend on each other.
2. Copy `img/pictures/CSAF_Harbour.png` into your project's `img/pictures/` folder if you want the demo picture.
3. Open **Plugin Manager**, add each plugin and switch it ON. The order does not matter.

Every game is started from an event with a **Plugin Command**. The event waits while the minigame is open and carries on
with its next command when the player leaves, so a Conditional Branch on the result switch can follow it directly.

---

## Jigsaw Lite: a 9 piece jigsaw from any picture

**Plugin Command:** `CSAF_JigsawLite` > **Start a jigsaw**, then pick the picture. Script call:
`CSAF.JigsawLite.start({ picture: 'CSAF_Harbour' })`

The picture is cut into a 3 x 3 jigsaw of interlocking pieces, a new cut every time, laid out on a felt table so no two
loose pieces start on top of each other. A faint ghost of the picture sits in the frame to work from.

**Controls.** Drag a piece with the mouse or a finger. Or move the hand with the arrow keys (Shift = faster) and press OK
to pick a piece up and OK again to put it down. A piece dropped close to its home snaps in. Cancel (Esc) sets the
puzzle aside. When the last piece goes home the whole picture rises over the table with a SOLVED plaque.

**Parameter:** **Solved -> switch** (default none): turned ON when the puzzle is solved, OFF when it is set aside.

## Pendant Lite: spot the 3 differences

**Plugin Command:** `CSAF_PendantLite` > **Start a spot-the-difference**, then pick the picture. Script call:
`CSAF.PendantLite.start({ picture: 'CSAF_Harbour' })`

The picture is hung twice on a green gallery wall, side by side or one above the other (whichever hangs them larger), and
the second copy is changed in 3 places: a detail mirrored or a patch painted out from its neighbour. Every change is
measured against a visibility floor before it is kept, so none is invisible. The changes are new every time.

**Controls.** Click or tap either painting where they differ, or move the hand with the arrow keys (Shift = faster) and
press OK. A find is ringed in red ink on both paintings; a click on nothing is a miss. Cancel gives up and marks the ones
left with a pencil ring.

**Parameter:** **All found -> switch** (default none): ON when all 3 were found, OFF otherwise.

A very flat picture (a single colour, a plain gradient) may give no change that clears the floor. Pendant Lite then says
so in the console, turns its switch OFF and closes at once, and the event carries on. All three do the same when the
picture cannot be used at all.

## Unveil Lite: reveal the picture

**Plugin Command:** `CSAF_UnveilLite` > **Start Unveil**, then pick the picture. Script call:
`CSAF.UnveilLite.start({ picture: 'CSAF_Harbour' })`

The picture lies under a silk veil. Reveal 75% of it to win. You have 3 lives; one creature drifts in the veil and two
sparks run along the edge of the revealed land.

**Controls.** Walk the edge of the revealed land with the arrow keys. Hold OK (or Shift) to cut into the veil, and close
the cut on revealed land again: every part of the veil with no creature in it falls away. The creature touching your
cut, or a spark touching you, costs a life. Touch: press and drag toward where you want to go; while pressed you cut.
On the results, OK or a click leaves.

**Parameter:** **Won -> switch** (default none): ON on a win, OFF on a loss.

---

## Upgrading to the full versions

Each Lite steps aside for its full version. Install the full Jigsaw, Pendant or Unveil and the Lite's command hands the
game to it (Jigsaw at nine pieces, Pendant at three differences, Unveil at its defaults), so no event has to change on
the day you upgrade. Switch your events to the full plugin's own command when you want its options.

## Compatibility

All three patch **no** engine method. Each adds one scene of its own and one plugin command, and nothing else, so the
order in the Plugin Manager does not matter and they cannot replace anything another plugin relies on. Each keeps a
small counter in the save file (`$gameSystem`). The type is a book serif (Georgia or Palatino), never the engine's UI
font.

---

## What the full versions add

| Free here | The full plugin | What it adds |
| --- | --- | --- |
| Jigsaw Lite, 9 pieces | [Jigsaw](https://csaf.itch.io/jigsaw) | 4 to 256 pieces, a seed so the same puzzle comes back, the box lid peek, time and moves into variables, a common event afterwards, RPG Maker MV |
| Pendant Lite, 3 differences | [Pendant](https://csaf.itch.io/pendant) | 1 to 12 differences of four kinds, including recoloured objects and twelve small drawn objects that belong where they land; hints, a time limit, four wall colours, a seed, results into variables, RPG Maker MV |
| Unveil Lite, one board | [Unveil](https://csaf.itch.io/unveil) | three veils (silk, frost, lacquer), the target, lives, creatures and sparks set per game, a seed, the percent revealed into a variable, your own sounds |

More minigames from the same studio, each built from your own pictures or your own database:

- [Sapper](https://csaf.itch.io/sapper): a no guessing minesweeper that clears a field over your picture.
- [Rummage](https://csaf.itch.io/rummage): I spy and seek and find scenes made from your own items and characters.
- [Rebus](https://csaf.itch.io/rebus): picture word puzzles built from your own database.
- [Quizmaster](https://csaf.itch.io/quizmaster): quiz shows and exams with questions written from your database.
- [Tilestack](https://csaf.itch.io/tilestack): mahjong solitaire with drawn tiles and generated layouts.
- [Pinfall](https://csaf.itch.io/pinfall): generated pachinko and plinko boards.
- [Leadlight](https://csaf.itch.io/leadlight): a stained glass brick breaker; break the pane, win the picture.
- [Incantation](https://csaf.itch.io/incantation): typing battles with words from your own database.

## AI disclosure

The code was written with AI assistance and the demo picture was generated with an AI image model. Every plugin was
tested in the real MZ engine before release.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
