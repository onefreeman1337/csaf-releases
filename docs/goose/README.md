# Goose: Party Board Game Plugin for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Goose: Party Board Game Plugin for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/goose  
**Docs published:** 2026-11-05


---

# GOOSE

**Party board games for RPG Maker MZ, laid out and drawn by the plugin.** v1.0.0.

The party leader races up to three rivals along a trail of spaces: roll the die, hop along, and choose at every fork
between a shortcut full of hazards and a scenic route full of coins. Every board is GENERATED from a seed and DRAWN in
code: the landscape, the trail, every space tile, the tokens and the dice. Spaces can run your own common events, and
the result comes back to your variables, a switch and the party's gold.

## What is in the box

| | |
| --- | --- |
| `js/plugins/GooseCore.js` | The rules: board generation, the race, the rivals. Knows nothing about RPG Maker. |
| `js/plugins/GooseDraw.js` | The drawing kit: landscapes, trail, tiles, tokens, dice, plates. Knows nothing about RPG Maker. |
| `js/plugins/Goose.js` | The only file that touches the engine: the plugin command, the game scene, the results. |

## Install

1. Copy the three `.js` files into your project's `js/plugins` folder.
2. Enable all three in the Plugin Manager. Any order works: each file finds the others when a game starts.

## Using it

Add the plugin command **Play Board Game** to an event. The event waits while the game is played and continues when
the player leaves the table.

| Argument | Default | |
| --- | --- | --- |
| Spaces on the trail | 36 | 24 to 60 |
| Forks | 2 | 0 to 3 places where the trail splits into a shortcut and a scenic route |
| Landscape | auto | meadow, desert, snowfield, coast, forest or volcano; auto picks one from the seed |
| Rivals | 3 | 1 to 3 |
| Rival actors (faces and names) | [] | optional: actors whose names and faces the rivals use |
| Rival names | Pip, Marlowe, Wren | used when no rival actors are given |
| Rival temper | mixed | bold, steady, canny, or mixed (one of each) |
| Dice | 1 | 1 or 2 |
| Round limit | 30 | the game ends after this many rounds; places then go by distance to the goal |
| Event space common events | [] | each common event listed gets one Event space on the board (up to 6) |
| Variable: player's place | 0 | 1 = won |
| Variable: player's coins | 0 | the coins the player ended with |
| Switch: player won | 0 | ON when the player finishes first |
| Gold per coin | 0 | coins paid out as gold at the end; 0 = no payout |
| Seed (optional) | | blank = a new board every visit; a number or a word = the same board every time |

## The spaces

| Space | What it does |
| --- | --- |
| Coins | +3 coins |
| Loss | -3 coins (never below zero) |
| Chest | 5 to 10 coins, fixed for that chest when the board is laid out |
| Event | runs one of your common events (text, items, gold, switches) |
| Warp | carries the racer to its exit further along (or back) the trail |
| Roll again | the same racer rolls once more (once a turn) |
| Snare | the racer loses its next turn |
| Gust | blows the racer back 2 to 4 spaces along the way it came |
| Boost | carries the racer forward 2 to 4 spaces |
| Start, Goal | first to reach or pass the goal finishes first |

A warp, gust or boost does not trigger the space it lands on. Every board is checked when it is laid out: the goal can
be reached along every route, there are no dead ends, no space overlaps another, no two hazards sit next to each other
on the open trail, every warp has an exit that is not itself a warp, and every fork offers a shortcut that is 30% to 85%
the length of its scenic route.

## Forks and rivals

At a fork the player picks a route. A **shortcut** is fewer spaces and at least half hazards; a **scenic route** is
longer, with coins and a chest. The rivals choose by temper: **bold** always takes the shortcut, **steady** always the
scenic route, **canny** the scenic route while it is in touch with the leader and the shortcut once it trails by 4 or
more moves.

Measured over 9,000 games between one rival of each temper (two seed sets, boards of 24, 40 and 60 spaces, seats
rotated): bold wins 41 to 46% of games, canny 29 to 33%, steady 24 to 27%; on a 40-space board steady ends with about
23 coins, canny 18 and bold 13. The shortcut is a race-or-coins decision, never a free one. A 36-space board with four
racers takes 10 to 13 rounds (median).

## Controls

OK, a click or a tap rolls the die. At a fork, left / right (or up / down) picks a route and OK takes it, or click the
space you want. Hold OK to hurry the rivals' turns. On the results, OK leaves.

## Script

```
Goose.play({ length: 36, rivals: 2, theme: 'coast' })   // the same options as the command
Goose.record()                                          // { v: 1, played, won }
```

## Parameters (sounds)

| Parameter | Default |
| --- | --- |
| Sound: the roll | Knock |
| Sound: a step | Cursor1 |
| Sound: coins | Coin |
| Sound: a hazard | Buzzer1 |
| Music effect: a win | Victory1 |

Every default is a sound from the stock RTP, so a new project plays them without adding a file.

## Compatibility

Goose adds its own scene and replaces nothing. It extends two core methods, each by saving the original and calling
it: `Game_System.initialize` (its save record) and `Game_Interpreter.updateWaitMode` (so the event waits while the
game is played). Event spaces run your common events like a battle event does. Commands that need the map do not hold
the game up: a Transfer Player takes place when the player leaves the table, and a movement route runs when the map is
back on screen.

A save keeps a small record (`played`, `won`); a game in progress is not saved, because the game scene has no menu.

In the engine, the busiest moment (the biggest board, three rivals moving, the camera following) measured **2 draw
calls per frame**, with no growth in display objects.

## Credits

Made by Core Systems Asset Factory. The code and the drawing code were written with AI assistance. No image, font or
sound ships with the plugin: every board, tile, token and die is drawn in code, and the sounds are the RTP's own.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
