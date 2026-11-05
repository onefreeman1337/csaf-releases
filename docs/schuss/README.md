# Schuss - Downhill Run Minigames for RPG Maker MZ: Ski, Board, Sled, Mine Cart, Raft — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Schuss - Downhill Run Minigames for RPG Maker MZ: Ski, Board, Sled, Mine Cart, Raft  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/schuss  
**Docs published:** 2026-11-05


---

# Schuss for RPG Maker MZ

Downhill run minigames inside your game. The player skis, snowboards, sleds, rides a mine cart or
steers a raft down a course the plugin lays out and draws, steering around trees, rocks, crates and
rapids, through gates and over ramps, with your own character riding.

Copyright (c) 2026 Core Systems Asset Factory. Terms of use: LICENSE.txt.

## What you get

- **5 modes:** Ski, Snowboard, Sled (snow), Mine cart (rails, switches and gaps), Raft (a river with a current).
- **3 goals:** Slalom (gates against the clock), Collect (coins down the course), Chase (something follows you down).
- **42 drawn obstacle forms** across the snow, the mine and the river: pines, birches, dead trees, rocks, boulders,
  cabins, snowmen, fences, lift pylons, moguls, ice, ramps; crates, barrels, rockfalls, ore carts, buffers, gaps,
  lanterns, crystals; wet rocks, logs, snags, buoys, eddies, falls, reeds and more.
- **Your character rides.** The party leader (or an actor you choose) stands on the skis, board, sled or raft, or sits
  in the mine cart with head and shoulders above the rim, using their own walking picture.
- **Tracks stay in the snow** behind the rider, spray flies on hard turns and landings, and the rider's shadow drops
  away on a jump.
- **Nothing to draw.** Every slope, mine, river, obstacle and letter on screen is drawn by the plugin's code. No image
  files ship and none are needed.

## Install

1. Copy `js/plugins/SchussCourse.js`, `js/plugins/SchussDraw.js` and `js/plugins/Schuss.js` into your project's
   `js/plugins` folder.
2. In the Plugin Manager, add all three and turn them ON. Any order works.
3. Set the parameters you want (all optional, see below).

## Start a run

From an event: **Plugin Command > Schuss > Start a run**, then choose:

| Option | What it does |
| --- | --- |
| Mode | Ski, Snowboard, Sled, Mine cart or Raft |
| Goal | Slalom, Collect or Chase |
| Difficulty (1-5) | How busy the slope is and how narrow the clean line through it |
| Course length (seconds) | About how long a clean run takes, 15 to 240 |
| Seed | Blank = a new course every run. Any text or number = the same course every time |
| Pursuer (chase) | Yeti, Boulder, Flood wave, or an enemy image from your project |
| Pursuer enemy image | The image used when Pursuer is "Enemy image" |
| Rider | An actor, or none for the party leader |
| Demo (rides itself) | The plugin's own autopilot rides: an attract screen or a preview |

Or a script call:

```js
CSAF.Schuss.start({ mode: 'ski', goal: 'slalom', seed: 7, difficulty: 3, seconds: 60 })
CSAF.Schuss.start({ mode: 'cart', goal: 'collect', seed: 'old mine' })
CSAF.Schuss.start({ mode: 'board', goal: 'chase', pursuer: 'enemy', enemyImage: 'Gnome', difficulty: 4 })
```

## Controls

| Input | Action |
| --- | --- |
| Left / Right | Steer. In the mine cart: change rails, only at a switch |
| Down | Tuck (faster) |
| Up | Brake |
| OK | Hop (mine cart, over a gap) |
| Mouse / touch | Hold the left or right half of the screen to steer |
| Cancel | Give up the run |

## Every course can be finished

Every course is laid out around a hidden safe line first: a route from the top to the bottom that the rider can
steer at full speed, through every gate, with nothing on it. Everything else is placed around that line, and ramps,
falls and ice sit only where the line runs straight. Then, before the player sees the course, the plugin's own
autopilot rides it once along that line; anything that ride hits is taken out and any gate or coin it misses is
moved onto its path. So every course can be finished with no crash, through every gate and past every coin on the
line, at every difficulty and every seed. Harder courses make that line narrower and the rest of the slope busier;
coins off the line are the risky ones.

## Results

Written before the event continues:

| Parameter | Receives |
| --- | --- |
| Time (1/100 s) -> variable | The run time in hundredths of a second, plus the missed-gate penalty |
| Gates passed -> variable | Gates the rider went through |
| Coins -> variable | Coins picked up |
| Crashes -> variable | Times the rider crashed |
| Clean finish -> switch | ON when the rider reached the bottom (not caught, not given up) |
| Common event afterwards | Reserved when the run closes |
| Item per coin | Given once for every coin picked up |
| Seconds added per missed gate | Slalom penalty, default 3.0 |

A run started with **Demo** writes no variables, switches or items.

Script calls:

```js
CSAF.Schuss.lastResult()
// { mode, goal, seed, difficulty, finished, caught, gaveUp, time, gates, gatesMissed, coins, crashes, best, newBest, demo }
CSAF.Schuss.best('ski', 'slalom', 7, 3)   // the best time for that course, or null
```

Best times are kept per course (mode, goal, seed and difficulty) for player runs with a fixed seed, in the save file
(a Demo run never sets one).

## Compatibility

- RPG Maker MZ. Schuss adds its own scene and one plugin command. It replaces and extends no engine method, so
  it does not change how the rest of your game behaves.
- Any screen size: the course sits in the middle of the screen.
- The rider uses your actor's walking picture, including `$` single-character sheets. A character cell larger
  than 64 px (big `$` sheets) is drawn down to fit the vehicle, never cropped.

## Questions

Store page: https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
