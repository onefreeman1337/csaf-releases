# Taproom: 4 Tavern Board Games vs NPCs for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Taproom: 4 Tavern Board Games vs NPCs for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/taproom  
**Docs published:** 2026-11-05


---

# Taproom for RPG Maker MZ

**Four old tavern board games your player can sit down and play against the people of your world, for gold.** Nine
Men's Morris, Fox and Geese, Oware and Fanorona, each on a board the plugin draws, against an opponent who thinks.
When the game ends, the result goes back to your events: a variable, a switch, and the stake won or lost.

Everything on screen is drawn by the plugin: the tavern table under its lamp, the board, the men, the seeds, the
opponent's card, the trays for the men each side has taken, and the plaques. Nothing is loaded from an image file.

## The four games

| Game | Board | How it is won |
| --- | --- | --- |
| **Nine Men's Morris** (`morris`) | 24 points on three nested squares; nine men each | Place your men, then move them along the lines. Three in a row along a line is a mill and takes one of the other side's men (not one standing in a mill, unless all of them are). A side down to three men may fly to any empty point. Leave the other side two men, or no move, and you win. |
| **Fox and Geese** (`foxgeese`) | 33 points on a cross; one fox, thirteen geese | The geese move first, one step forward or sideways, never back. The fox steps any way along the lines, or jumps a goose to the empty point beyond to take it, and may keep jumping. Trap the fox and the geese win; take enough geese that fewer than nine are left and the fox wins. The geese must close the trap: after 80 moves each, the fox has won. |
| **Oware** (`oware`) | two rows of six pits, four seeds in each | Take every seed from a pit on your row and sow them one by one round the board, skipping the emptied pit on a long sowing. If your last seed makes two or three in a pit on their row, take them, and any twos and threes just behind it. A move that would take every seed on their row takes nothing. If their row is empty you must feed it if you can. More than 24 seeds wins; 24 each is a draw. |
| **Fanorona** (`fanorona`) | 5 x 9 points joined by lines; 22 men each | Move a man along a line to the next empty point. Moving toward an enemy line takes the whole line (approach); moving away from an adjacent one takes it (withdrawal). After a capture the same man may keep taking, never twice in the same direction and never back to a point it has left. Taking is compulsory. The first move of the game takes once. Take every man to win. |

A game that runs too long ends as a draw: Morris after thirty moves each without a mill (once all men are placed) or
300 moves in all; Fanorona after twenty-five moves each without a capture or 240 moves in all. An Oware game that goes
eighty moves without a capture, or reaches a position where no move can feed an empty row, ends with each side keeping
the seeds on its own row, and the larger store wins.

In-game, the **Rules** plaque (or Shift) shows the rules of the game being played on a card over the board.

## Every board is drawn

Eight boards, each a different material with its own surface, lines and border worked at a steady pitch, and the
wear of use (scratches and chipped edges):

| Board | Lines |
| --- | --- |
| `slate` | chalk-scribed, chevron border |
| `marble` | inlaid dark lines, key-pattern border |
| `knifed` | cut into the tabletop, notched border |
| `lacquer` | gilt lines on black lacquer, lozenge border, red rim |
| `linen` | stitched in red thread, stitched border |
| `leather` | burned into tooled leather, rope border |
| `walnut` | brass lines, brass bead border |
| `soapstone` | cut into carved green stone, notched border |

Oware is played on the six that can hold carved pits: walnut, soapstone, knifed, lacquer, marble and leather.

## Every man is drawn

Six sets, each with a light and a dark man, and the seed its Oware game is played with:

| Set | Light | Dark | Oware seeds |
| --- | --- | --- | --- |
| `stones` | pale river stones | basalt | pebbles |
| `bone` | bone | horn | cowrie shells |
| `glass` | clear glass | cobalt glass | glass beads |
| `coins` | silver | copper | small coins |
| `clay` | red fired clay | black glaze | clay beads |
| `boxwood` | boxwood | ebony | beans |

The fox in Fox and Geese is always a larger carnelian stone with a gold ring, whatever the set, so it can never be
mistaken for a goose. River stones are each a slightly different shape.

## Each opponent sets out their own board

Which board and which men an opponent plays with is chosen from their **name** (and the game), so the same person
always sets out the same board, whatever the seed. You can name a board and a set in the command instead.

## The opponent

Five strengths: **1 Novice, 2 Regular, 3 Sharp, 4 Hustler, 5 Master.** The opponent searches ahead with alpha-beta.
Its strength sets how many moves ahead it looks and how often it misjudges a move:

| Strength | Morris | Fox and Geese | Oware | Fanorona |
| --- | --- | --- | --- | --- |
| 1 Novice | 1 | 1 | 1 | 1 |
| 2 Regular | 2 | 2 | 2 | 2 |
| 3 Sharp | 3 | 3 | 4 | 2 |
| 4 Hustler | 4 | 4 | 6 | 3 |
| 5 Master | 5 | 5 | 8 | 3 |

(plies looked ahead). In Fanorona a Master looks as far as a Hustler and never misjudges: when it looked one move
further it LOST to the Hustler, 7 wins to 15 in 24 games, so the extra look was taken out.

Each strength was played against the one below it, 24 games per pair, sides alternated:

<!-- fill:ladder -->
| Pair (won-drawn-lost, 24 games) | Morris | Fox and Geese | Oware | Fanorona |
| --- | --- | --- | --- | --- |
| Regular vs Novice | 24-0-0 | 13-0-11 | 23-0-1 | 23-1-0 |
| Sharp vs Regular | 24-0-0 | 17-0-7 | 20-0-4 | 15-8-1 |
| Hustler vs Sharp | 17-0-7 | 20-0-4 | 16-3-5 | 12-10-2 |
| Master vs Hustler | 14-6-4 | 17-0-7 | 22-1-1 | 11-10-3 |
<!-- /fill:ladder -->

The opponent always takes a moment to think, and its search runs a little at a time across frames (1 ms a frame by
default, the **Opponent search per frame** parameter), so the game never stalls. The move it chooses does not depend
on how the search is sliced, and the same position with the same seed gets the same move.

Fox and Geese at equal strengths, 12 games each with the computer on both sides: <!-- fill:fox -->Novice: fox 12, geese 0; Regular: fox 10, geese 2; Sharp: fox 10, geese 2; Hustler: fox 0, geese 12; Master: fox 0, geese 12.<!-- /fill:fox -->

## Installing

Copy the three files into `js/plugins` and add them in the Plugin Manager in this order, top to bottom:

1. `TaproomCore.js`: the rules and the opponent
2. `TaproomDraw.js`: the drawing
3. `Taproom.js`: the Play a Game command and the scene

## Playing a game

Add the plugin command **Taproom > Play a Game** to an event:

| Argument | What it does |
| --- | --- |
| Game | `morris`, `foxgeese`, `oware` or `fanorona`. |
| Opponent's name | Shown on the card, and it chooses their board and men. Blank reads "The Stranger". |
| Opponent's strength | 1 Novice to 5 Master, default 3. |
| The player's side | `first`, `second` or `random`. In Fox and Geese, `fox` or `geese` (the geese move first, so `first` is the geese). |
| Stake (gold) | Won or lost in gold. If the party has less, the stake is what they have. A draw returns it. |
| Variable: result | 1 won, 0 lost (or conceded), 2 drawn. |
| Variable: margin | By how much, in the game's own count: men ahead (Morris, Fanorona), seeds ahead (Oware), geese taken (as the fox) or geese left (as the geese). Negative when the player lost. |
| Switch: on for a win | On only for a win; off otherwise. |
| Board | Blank = the opponent's own. Or one of the eight boards. |
| Men | Blank = the opponent's own. Or one of the six sets. |
| Seed | Blank = keyed to this map and event and how many games have been played there, so a rematch is a new game. |

The event waits while they play, then continues.

The card shows the stake, which side the player has, and their record against this opponent at this game.

## Controls

- **Mouse and touch:** click a man, then where it goes. Rings show every point you may click next; a red cross marks
  a man you may take. Right-click puts a picked-up man back.
- **Keyboard and gamepad:** the arrows move between the ringed points, OK chooses, Cancel puts a picked-up man back.
- **Shift** or the **Rules** plaque shows the rules card.
- **Stop** (or W / page down) ends a chain of captures early, when the rules allow another.
- **Concede** gives the game up; click it twice. A conceded game is a loss.
- When the game ends, a card says who won, by how much and what the stake did. OK leaves the table.

## Plugin parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Sound: a man set down | `Knock` | |
| Sound: a man taken | `Coin` | |
| Sound: a seed sown | `Cursor2` | |
| Sound: a man picked up | `Cursor1` | |
| Sound: not allowed | `Buzzer1` | |
| Sound: the player wins | `Applause1` | |
| Sound: the player loses | `Cancel1` | |
| Opponent search per frame (ms) | 1.0 | How much of each frame the opponent may spend searching. Its move is the same whatever this is. |

The sounds are the ones already in your project's `audio/se` folder, chosen by name. The defaults are all stock MZ
sounds.

## Script calls

- `Taproom.record("Old Brannoc", "morris")` returns `{w, l, d}`: the player's wins, losses and draws against that
  opponent at that game.
- `Taproom.lastResult` is the last game's result: `{game, opponent, grade, result, margin, reason, plies, stake}`.

## Saving

Records are kept in the save file (`$gameSystem._csafTaproom`, versioned). A game in progress is not saved; the scene
is a table the player sits at and gets up from.

## Compatibility

Taproom adds its own scene and replaces nothing. It extends one engine method, `Game_System.prototype.initialize`
(to create its save record), calling the original first. It draws no stock window, and its font is a serif stack
(Palatino Linotype, Book Antiqua, Palatino, Georgia), never the engine's default face.

## Frame cost

Measured in the real MZ runtime with the engine gate, during active play on Fanorona (44 men on the board, the player
clicking every 6 frames, the opponent thinking and moving): **5 draw calls a frame, 0 stock windows drawn, and no
growth in display objects**, every count inside the gate's ceilings, 1,800 frames over three runs.

## Terms

See `LICENSE.txt`. Made by Core Systems Asset Factory. Every line was written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
