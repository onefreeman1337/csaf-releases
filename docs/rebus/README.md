# Rebus - Picture Word Puzzles for RPG Maker MZ, Built From Your Own Database — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Rebus - Picture Word Puzzles for RPG Maker MZ, Built From Your Own Database  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/rebus  
**Docs published:** 2026-11-05


---

# REBUS

**Picture word puzzles for RPG Maker MZ, built from your own database.** v1.0.0.

Rebus turns the art your game already has into a word game. It pins two to four of your icons that share a name to a
cork board and asks what they have in common; it stands an enemy battler on a spotlit stage as a black silhouette; it
shows an actor's face through a brass lens that slowly widens; it breaks a picture into blocks that sharpen over time.
The player spells the answer from a tray of carved tiles. You add one plugin command; the rounds come from your weapons,
armours, skills, items, enemies and actors.

## What is in the box

| | |
| --- | --- |
| `js/plugins/RebusCore.js` | The rules: rounds harvested from your database, the letter tray, hints and scoring. Knows nothing about RPG Maker. |
| `js/plugins/RebusDraw.js` | The drawing kit: tiles in four materials, slots, the pin board, the stage, the lens, the mosaic, the stamp. Knows nothing about RPG Maker. |
| `js/plugins/Rebus.js` | The only file that touches the engine: the plugin command, the puzzle scene, the results. |

## Install

1. Copy the three `.js` files into your project's `js/plugins` folder.
2. Enable all three in the Plugin Manager. Any order works: `Rebus.js` finds the other two when a game starts.

## Using it

Add the plugin command **Start a Rebus game** to an event. The scene opens over the map and returns to it when the game
ends.

| Argument | Default | |
| --- | --- | --- |
| Mode | mixed | `four`, `silhouette`, `closeup`, `mosaic`, or `mixed` (a round of each in turn) |
| Rounds | 5 | 1 to 30 |
| Reveal time | 20 | Seconds a close-up takes to widen to the whole picture, or a mosaic to sharpen (5 to 120). Also the par time for scoring. |
| Gold per hint | 0 | 0 = hints are free (they still cost points) |
| Score variable | none | Receives the total points |
| Solved count variable | none | Receives how many rounds were solved |
| All-solved switch | none | Turned ON when every round was solved, OFF otherwise |

If your database runs out of rounds for a mode, that round falls back to another mode, so the game still has its
rounds. A database with nothing Rebus can ask opens nothing.

## The four kinds of round

| Mode | The clue | Where it comes from |
| --- | --- | --- |
| Four pictures | Two to four DIFFERENT icons pinned to a board | The weapons of one weapon type, the armours of one armour type or one equipment slot, the skills of one element or one skill type, the items of one item category, or your own group (`<Rebus Group: word>`). The answer is the type's name. |
| Silhouette | A battler blacked out on a spotlit stage, shown in colour when solved | Enemies with a battler image. The answer is the enemy's name. |
| Close-up | A brass lens that starts at 4x on one detail and widens to the whole picture | Actor faces first, then battlers, then icons |
| Mosaic | The picture as blocks of 32 px that sharpen to the full picture | Icons first, then faces, then battlers |

A name whose records all share ONE icon is asked as a single-picture round (close-up or mosaic), never as a board of the
same picture repeated. Silhouettes use battlers only: an icon sits on an opaque tile, so blacked out it is a square.

## Notetags

| Notetag | On | |
| --- | --- | --- |
| `<Rebus: skip>` | any weapon, armour, skill, item, enemy or actor | Never use this record |
| `<Rebus: word>` | an enemy or actor | Spell this word instead of its name |
| `<Rebus Group: word>` | any item, weapon, armour or skill | Put it in a picture round whose answer is that word. Records from different tables can share a group, and the case you type does not matter. |

## Answers

Answers are Latin letters A to Z, 3 to 12 letters long. A space, a hyphen or an apostrophe is shown in place and never
spelled. A name with any other character (accented letters, kana, digits) is skipped, never mangled. Each answer is
asked once per game, even when two groups share a name.

## Playing

- **Click or tap a tile**, or **type its letter**, to place it in the next empty slot.
- **Click a filled slot**, or press **Backspace**, to take a tile back.
- **Escape** ends the game early (the results are still written).
- **Letter** locks the next correct letter into place. **Clear** removes every decoy tile from the tray.
- A solved round holds for a moment with a SOLVED stamp; a click moves on at once.

Rebus is played with a keyboard, a mouse or a touch screen. A gamepad alone cannot spell an answer.

The tray holds every letter of the answer plus decoys (12 to 18 tiles), never more than one spare copy of any letter.

## Scoring

A solved round scores **100 + 10 a letter, minus 40 a hint, minus 2 a second over the reveal time**, and never less than
0. With Gold per hint set, a hint the party cannot afford plays the buzzer and does nothing. The solve and the refused
hint use your database's own OK and Buzzer sounds.

## Parameters

| Parameter | Default | |
| --- | --- | --- |
| Tile material | brass | `wood`, `brass`, `ivory` or `slate` |
| Pixel art pictures | false | ON: your icons, faces and battlers keep sharp pixels at every size. OFF: smoothed when the scale is not a whole number. Turn it on for a pixel-art game. |
| Round label | ROUND %1 OF %2 | %1 is the round, %2 the number of rounds |
| Hint label: reveal a letter | Letter | |
| Hint label: clear decoys | Clear | |
| Solved stamp word | SOLVED | |

The tile face is "Palatino Linotype" (Windows), then Book Antiqua, Palatino (macOS), Georgia, then the system serif.
Rebus ships no font file.

## Compatibility

Rebus adds its own scene and one plugin command and patches no core RPG Maker method at all. It reads your database,
loads your IconSet, faces and battlers through RPG Maker's own image cache, and draws from them without changing them,
so the rest of your game sees exactly what it saw before. It writes only the variables and the switch you name, keeps
no save data of its own, and never writes to your project.

## Credits

Made by Core Systems Asset Factory. The code and the drawing code were written with AI assistance. No image, font or
sound ships with the plugin: the tiles, the board, the stage, the lens and the stamp are drawn in code, and the
pictures are your own.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
