# Broadside - Ship-to-Ship Naval Battles for RPG Maker MZ: Drawn Ships, Fire on the Roll — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Broadside - Ship-to-Ship Naval Battles for RPG Maker MZ: Drawn Ships, Fire on the Roll  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/broadside  
**Docs published:** 2026-11-05


---

# Broadside for RPG Maker MZ

**Version 1.0.**

**Ship-to-ship battles for your game.** Two sailing ships fight broadside-on, the way an age-of-sail painting shows a
duel: your ship rolls on the swell in the foreground, the enemy lies beyond her across a painted sea under a painted
sky. Each turn you give two orders (a manoeuvre and what to load), then fire on the roll: a brass dial swings with
your ship, and the moment you fire decides where the broadside goes. The ships take the damage visibly: shot holes
along her side, a topmast shot away and hanging over the side, canvas torn to strips, fire on deck, every mast gone
by the board, a list, and at the end a ship going down. A ship's log closes the fight and the result goes into your
variables and switches.

Nothing is loaded: no image files, no battlebacks, no sprite sheets. The ships, the sea, the sky, the smoke, the
instruments and the log are all drawn by the plugin when the battle opens. It works in a new project the moment it
is on.

## Installing

Copy the four files into `js/plugins` and turn them on in the Plugin Manager. The order does not matter (tested with
`Broadside.js` loading first):

1. `BroadsideCore.js`: the rules of the duel
2. `BroadsideShips.js`: the ships and the damage drawn into them
3. `BroadsideSea.js`: the sea, the sky, the smoke and fire, and the instruments
4. `Broadside.js`: the parameters, the plugin command and the battle scene

Then call the plugin command **Start Sea Battle** from any event. If one of the first three files is missing or off,
the command stops with a message naming the files it needs.

## The plugin command: Start Sea Battle

| Argument | Default | Meaning |
| --- | --- | --- |
| Title | blank | Shown on the opening chart and the log. Blank = "An Action off" and the map's display name. |
| Enemy ship's name | Vengeur | Shown on her card, in the notes and in the log. |
| Enemy hull | frigate | Any of the 16 hulls (below). It decides how she fights. |
| Enemy rig | ship | Any of the 10 rigs. |
| Enemy paint scheme | black-strake | Any of the 8 schemes. |
| Enemy wear | salted | new, worked, salted, battered or derelict. |
| Enemy canvas | topsails | full, topsails, reefed or storm. |
| Enemy captain | (default) | green, seasoned, veteran or legend. (default) uses the parameter. |
| Who starts with the wind | chance | chance, you, or the enemy: the weather gauge on the first turn. |
| Either ship can get away | Yes | Yes: a ship that bears away and out-sails her chaser gets clear. No: a boss fight, nobody leaves. |
| Weather | (default) | afternoon, dusk or squall. (default) uses the parameter. |
| Seed | blank | Blank = a new fight every time. A number = the same weather gauge, sky and enemy choices, and the same fight for the same orders fired at the same moments. |
| Outcome to variable | 0 | The ending as a number (below). |
| Victory to switch | 0 | ON when she sank, struck or was taken; OFF otherwise. |
| Your hull, carried over | 0 | A variable read at the start and written at the end, so damage carries from one fight to the next (below). |
| Common event after | 0 | Reserved when the log closes. |

The event waits while the battle is on screen. Everything is written before the event continues, so the next command
can read the result.

### The endings, as the outcome variable writes them

| Code | Ending | Code | Ending |
| --- | --- | --- | --- |
| 1 | she sank | 5 | we got clear |
| 2 | she struck her colours | 6 | we struck our colours |
| 3 | we took her by boarding | 7 | she took us by boarding |
| 4 | she got away | 8 | we sank |
| 9 | the ships parted (both bore away, or 80 turns passed) | | |

### Carrying damage from one fight to the next

Give the command a variable for **Your hull, carried over**. When the fight starts the plugin reads it: 1 to 100 is how
much of your hull is left, and 0 (or anything else) is a sound ship. When the fight ends it writes your hull back: 1 to
100 for a ship that survived (never 0, even with a splinter of hull left), 0 only if she sank. Repair her at a port
with an ordinary Control Variables command.

## Plugin parameters (Broadside.js)

| Parameter | Default | Meaning |
| --- | --- | --- |
| Your ship's name | Resolute | Shown on your card and in the log. |
| Your hull, rig, paint scheme, wear, canvas | frigate, ship, royal, worked, topsails | What your ship is and looks like. |
| Enemy captains | seasoned | The default captain for battles that do not set one. |
| Weather | random | random, afternoon, dusk or squall. Random picks from the fight's seed. |
| Sound: broadside, shot falling short, a hit, a mast falling | Explosion2, Water1, Crash, Collapse4 | Sound effects from MZ's own RTP. Blank = silent. |
| Battle music | Ship3 | Played during the fight; the map's music comes back afterwards. Blank = keep the current music. |
| Sea sound | Sea | A background sound under the fight. Blank = none. |
| Music: victory, defeat | Victory1, Defeat1 | Played as the log opens after a win or a loss (not after an escape or a parting). |

## How a turn plays

**1. The orders.** Two rows of cards. Cards you cannot use this turn are greyed out.

- **Close**: bring the range down. More of your shot strikes home, and grape and boarding come within reach.
- **Bear away**: open the range. Out-sail her and you get clear (unless the battle says nobody leaves).
- **Weather gauge**: claw up to windward. The ship to windward fires through clear air; the ship to leeward fires
  through her own smoke.
- **Cross her bow**: only from the weather gauge, at middling range, in a ship not much slower than hers (at least nine
  tenths of her speed). It comes off about three
  times in five; when it does, every gun rakes her from end to end and only her chase guns answer. Either way you
  pass to leeward of her. A dismasted ship cannot turn away, so anyone can cross her bow.
- **Hold**: keep your course and fire.
- **Board her**: only alongside. Crew against crew, and the defenders fight from behind their own bulwarks: boarding an
  untouched crew is a bad bet, boarding one thinned by grape is the decisive move. Repelled boarders lose a third of
  their number.

Then what to load:

- **Round shot**: into her hull. Fire at the bottom of the roll.
- **Chain shot**: cuts her rig. Fire at the top of the roll. Reaches musket shot and closer.
- **Grape**: sweeps her deck of men. Pistol shot only.

**2. Fire on the roll.** A brass dial swings with your ship. Fire (OK, or a tap) at the bottom of the roll and the
broadside goes low and steady into her hull; at the top it goes high into her rig; while the ship is swinging the shot
scatters and fewer guns hit. Cancel takes the order back.

**3. The volley.** Your broadside ripples gun by gun along your side, smoke rolls downwind, and white water or
splinters show where each shot fell. Then she answers. A banner of words says what happened, and each ship's card
catches up only when the shot that hit her lands. Hold OK (or Shift, or keep a finger down) to run the volley at
double speed.

**Damage you will see.** Shot holes accumulate in her side (the same holes in the same places, more of them as the
hull goes). Her main topmast goes by the board when her rig falls under 60%, her canvas tears to strips under 30%,
and under 15% every mast is gone and she can no longer manoeuvre. Under half her hull she lists; under 35% a fire may
start, and a fire burns on until the fight ends. A ship strikes her colours when her crew falls under 20%, and sinks
when her hull is gone.

### The seven fighting classes

Every hull the plugin draws fights as one of seven classes:

| Class | Guns a side | Crew | Hull | Rig | Sailing | Hulls that fight as it |
| --- | --- | --- | --- | --- | --- | --- |
| Cutter | 4 | 40 | 40 | 30 | 1.00 | cutter, longship |
| Sloop | 8 | 70 | 60 | 40 | 0.92 | sloop, ketch, cog |
| Brig | 10 | 100 | 80 | 55 | 0.85 | brig, schooner, junk |
| Xebec | 8 | 120 | 60 | 45 | 0.95 | xebec, galley |
| Frigate | 16 | 220 | 140 | 90 | 0.80 | frigate, barque |
| Galleon | 14 | 260 | 180 | 100 | 0.55 | galleon, carrack, hulk |
| Ship of the line | 34 | 600 | 320 | 150 | 0.50 | ship-of-the-line |

A faster ship closes and opens the range faster, and only the faster ship can cross the other's bow. A frigate cannot
fight a ship of the line; she can run from one.

### The enemy captains, measured

How good a captain is decides how close to the roll's pause her gunners fire, how hard she fights for the weather
gauge, how often she takes the cross, and when she runs. Measured over 2,000 simulated fights per row and two seeds,
in two equal frigates, a player who closes and fires round shot:

| Captain | Fires within about 1/8 s of the moment | Within about 1/4 s | At a random moment |
| --- | --- | --- | --- |
| green | 92% won | 81 to 83% won | 4 to 5% won |
| seasoned (the default) | 71% won | 53 to 55% won | 1 in 100 won |
| veteran | 45 to 47% won | 28 to 29% won | 1 in 1,000 won |

A legend is better again. The roll matters: the same orders fired at random lose almost every fight.

## Script calls

```
Broadside.battle({ enemyName: 'Grey Widow', enemyHull: 'xebec', enemyRig: 'lateen', skill: 'veteran',
                   outcomeVariableId: 5, victorySwitchId: 3 });
Broadside.isOpen()      // true while a battle is on screen
Broadside.lastResult()  // the last fight: { title, enemy, ending, turns, me: {hull, rig, crew}, foe: {...} }
```

`Broadside.battle` takes the same arguments as the plugin command, as plain values (`escape: false` for a boss fight).

## Controls

Arrow keys and OK, or the mouse and touch. On the orders, left and right choose a card, up and down change row, OK
moves on and then gives the order, Cancel goes back. On the dial, OK or a tap fires, Cancel takes the order back. In a
volley, hold OK, Shift or a touch to speed it up. On the log, OK or a tap closes it.

## Compatibility

Broadside adds its own scene (`Scene_Broadside`) and changes no method of RPG Maker MZ's: no core class, window or
scene is patched, so it does not collide with plugins that change the engine's own classes (such as VisuStella's MZ
Core Engine). It was tested in a stock MZ project; it has not been tested beside every plugin. It draws its whole
screen itself, in its own typeface stack (Palatino Linotype, Book Antiqua, Palatino, Georgia), with no MZ window
anywhere in it.

The ship generator inside `BroadsideShips.js` is a copy of the one in our Shipwright plugin, placed under its own name:
owning both is safe, and nothing in one reads or changes the other.

**Save data.** The plugin keeps one small record in the save file (`$gameSystem._csafBroadside`, version 1: the number
of fights, wins, and the last result). A save made before Broadside was installed loads cleanly.

**Cost per frame.** In the heaviest scene the battle produces (a ship of the line at pistol shot, both ships afire, a
broadside every turn and both ships redrawn every turn), the scene draws in **8** draw calls per frame with 0 windows
drawn. A ship is redrawn only when the damage drawn on her changes, never during a volley.

## Licence and AI disclosure

See `LICENSE.txt`. Every line of this plugin was written with AI assistance, and its drawing code, store images and
cover illustration were produced with AI assistance. It contains no audio: the sounds it plays by default are files
from MZ's own RTP that are already in your project.

Copyright (c) 2026 Core Systems Asset Factory. https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
