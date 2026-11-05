# Round-up - Herding Minigame for RPG Maker MZ: Drive a Generated Flock Into Your Pen — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Round-up - Herding Minigame for RPG Maker MZ: Drive a Generated Flock Into Your Pen  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/round-up  
**Docs published:** 2026-11-05


---

# Round-up for RPG Maker MZ

**Version 1.0.**

**A herding job on your own map.** Paint a pen with a region ID, call one plugin command, and a generated flock
scatters across your farmyard. The player has until the bell to drive every animal through the gate, using the
movement they already know. No new scene: the animals walk your map, behind your trees and in front of your fences,
and sort with your characters.

**Every animal is drawn by the plugin, and every one is different.** Sheep in six fleeces with four faces, horned or
polled; hens in seven plumages; pigs in five coats; geese in three breeds: 89 looks, in four facings with a walk, at
the size of a stock character. Nothing is loaded but your map.

## Each species moves by its own rule

- **Sheep** flock. Move one and the rest follow; sheep already in the pen draw the others in.
- **Hens** scatter in zig-zags and will not be driven in a straight line.
- **Pigs** bolt from you in a straight dash, then stop dead to get their breath. Line one up and spook it at the gate.
- **Geese** take a stand when you crowd them and may charge before they run.

A calm animal grazes slowly; a startled one runs (and says so: a little "!" over its head, feathers off a hen). A
cornered animal dodges along the fence past you, so a corner is never a dead end. **The whistle** (OK, or the button in
the corner for mouse and touch) calls the animals near you into a bunch for a moment, then needs about five seconds to
cool down. The player can dash as usual.

## Installing

Copy the three files into `js/plugins` and turn them on in the Plugin Manager. The order does not matter (tested with
`Roundup.js` loading first):

1. `RoundupCore.js`: the rules (the flock, the pen, the clock)
2. `RoundupDraw.js`: the livestock, the trough, the clock and tally, the sign and the tally board
3. `Roundup.js`: the plugin commands, the parameters and everything on the map

If `RoundupCore.js` or `RoundupDraw.js` is missing or off, a round does not start and the console says which files to
enable.

## Setting up a yard

1. **Paint the pen's floor with the Pen region ID** (default 9). An animal that steps onto a pen tile is penned for
   good. **Leave a gate two tiles wide.** On a one-tile gate rounds are much harder (see the numbers below).
2. **The yard** is everywhere the animals can walk to within Yard size (default 12 steps) of the gate. Or paint it with
   the Yard region ID and they start only there. They never start within two tiles of the player.
3. **Fences, walls and water** are your map's own passability, the same rule your player walks by. Events that stand on
   the map when the round starts (with an image, not Through, Same as characters) block the animals too.

The `Demo` folder holds a painted farmyard (`img/parallaxes/!Roundup_Farmyard.png`, 816 x 624, 17 x 13 tiles) and a
herder (`img/characters/$Roundup_Herder.png`) if you want to try it on an empty map: the pen is the four by four
square of straw in the top right, the gate the two-tile opening on its left.

## The plugin command: Start Round-up

| Argument | Default | Meaning |
| --- | --- | --- |
| Difficulty | normal | easy: 6 head (4 sheep, 2 hens), 90 s. normal: 7 head (sheep, hens, pigs), 115 s. hard: 9 head with geese, 135 s. custom: the counts below. |
| Sheep / Hens / Pigs / Geese (custom) | 4 / 2 / 1 / 0 | For custom only. Up to 32 animals in all. |
| Time (seconds) | 0 | 0 = the difficulty's own time (custom: 15 seconds a head). |
| Title | blank | On the opening sign and the tally board. Blank = the map's display name. |
| Penned -> variable | 0 | How many were penned, written when the board closes. |
| Stars (0-3) -> variable | 0 | Written when the board closes. |
| Seconds left -> variable | 0 | Written when the board closes. |
| Switch ON when all penned | 0 | Turned ON only if every animal was penned. |
| Common event when done | 0 | Runs when the board closes, won or not. |
| Seed | blank | Blank = a new flock every time. A number = the same flock in the same places. |

The event that calls the command finishes; the round runs on the map after it. Put what happens next in the common
event, or check the switch. **Ring the Bell Now** ends a running round at once and shows the board.

**Stars:** every animal penned with at least 30% of the time left: 3. Every animal penned: 2. At least half: 1.

Script calls:

```
Roundup.isOpen()      // true while a round runs (or its board is open)
Roundup.lastResult()  // the last round: {penned, total, stars, secondsLeft, won, difficulty, seed} or null
```

## Parameters

| Parameter | Default | Meaning |
| --- | --- | --- |
| Pen region ID | 9 | The region that marks the pen. |
| Yard region ID | 0 | 0 = anywhere within Yard size of the gate. |
| Yard size (tiles) | 12 | Walking distance from the gate. |
| Feed trough | true | Draws a hay trough one tile inside the gate; animals near the gate drift toward it. |
| Whistle button (touch) | true | The button in the corner for mouse and touch players. |
| Clock corner | top-left | Where the clock and the tally sit. The whistle button takes the opposite bottom corner. |
| Allow menu in a round | false | If true the menu opens during a round (the round pauses). |
| Sounds | Sheep, Chicken, (none), (none), Horn, Bell1 | A bleat or cluck when an animal is startled or penned, the whistle, the bell. Files from your `audio/se`; set any to (None) for silence. |

## How it plays, and how we tuned it

A scripted herder that moves the way MZ's player moves (four directions, a step at a time, walking and dashing) and
herds the way a person does (gets behind one animal, outside its fright distance, then walks it toward the gate) was
run over 200 rounds per difficulty (two seed sets of 100). On a yard with a two-tile gate and the trough, it penned
every animal in **51% to 57%** of rounds on every difficulty. A player who chases the nearest animal penned them all in
**0% to 9%**; one who stands still, **0%**. On a one-tile gate the same herder managed 19% to 33%, and without the
trough 20% to 37%.

The round pauses while a message shows, while another event runs, while the menu is open, and whenever the player is on
a different map. The map's name window stays closed during a round so it never sits over the clock.

## Compatibility

Round-up adds no scene and replaces nothing. It extends seven engine methods, each by saving the original and calling
it: `Game_Map.update` (the round's clock), `Spriteset_Map.update` (the animals and the clock are drawn), 
`Game_Player.triggerButtonAction` (during a round OK is the whistle, so it does not also start the event you face),
`Game_Player.canMove` (the player stays put while the board is open), `Scene_Map.processMapTouch` (a press on the
whistle button does not walk the player there), `Scene_Map.isMenuEnabled` (the menu stays shut during a round unless
you allow it), and `Scene_Map.updateMapNameWindow`. It draws no MZ window and uses its own typeface stack (Palatino
Linotype, Book Antiqua, Palatino, Georgia for the signs; Segoe Print, Bradley Hand for the chalk). It was tested in a
stock MZ project; it has not been tested beside every plugin. A plugin that replaces the map's touch input or the
player's OK handling may need Round-up placed below it.

**Save data.** One record in the save file (`$gameSystem._csafRoundup`, version 1): the running round's numbers (where
each animal stands, the clock), the request, and the last result. A round saved mid-way resumes where it was. A save
made before Round-up was installed loads cleanly.

## Licence and AI disclosure

See `LICENSE.txt`. Every line of this plugin was written with AI assistance, and its demo pictures, store images and
cover were produced with AI assistance. It contains no audio: its default sounds are files from MZ's own RTP.

Copyright (c) 2026 Core Systems Asset Factory. https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
