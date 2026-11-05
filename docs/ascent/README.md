# Ascent - Climbing Minigames for RPG Maker MZ: Six Painted Faces, 36 Holds, a Real Rope, Your Own Hero — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Ascent - Climbing Minigames for RPG Maker MZ: Six Painted Faces, 36 Holds, a Real Rope, Your Own Hero  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/ascent  
**Docs published:** 2026-11-05


---

# Ascent for RPG Maker MZ

Climbing minigames for RPG Maker MZ. Your own hero climbs a sea cliff, an ice wall, a castle wall under siege, a great
tree, a ship's rigging or a round tower, hold by hold, against a grip that drains while they hang. The plugin lays out
and paints every face, proves it can be climbed before the player sees it, and hands the result back to your event.

Copyright (c) 2026 Core Systems Asset Factory. Terms of use: LICENSE.txt.

## What you get

- **Six faces, six structures.** Each face is laid out a different way, not recoloured:
  - **Sea cliff**: free rock, strata, fractures and lichen, the sea and sky behind the stack.
  - **Ice wall**: an icefall between rock walls, holds pulled toward vertical seams.
  - **Castle wall**: coursed masonry under siege (soot, spent arrows, siege ladders at the foot); every hold sits on a
    course line.
  - **Great tree**: a trunk that narrows as you climb, bark fissures, moss and fungus, the forest behind.
  - **Ship's mast**: the shrouds and ratlines of a rope net in front of the mast, sails and sea behind; every hold sits
    on the rigging's lattice.
  - **Tower**: a round brick tower under the moon, ivy, lit windows; every hold sits on its courses.
- **36 kinds of hold, six per face, each with its own name.** Every face uses the same six roles, so a player learns
  them once, and draws them in its own material:

  | Role | What it does | Cliff | Ice | Castle | Tree | Mast | Tower |
  | --- | --- | --- | --- | --- | --- | --- | --- |
  | firm | grip drains slowly | jug | bulge | putlog hole | branch stub | ratline | stone spout |
  | firm | grip drains slowly | crack | seam | joint | fissure | belaying pin | ivy trunk |
  | hard | grip drains fastest | edge | thin ice | mortar seam | bark plate | shroud | brick lip |
  | slick | grip drains fast | sloper | verglas | corbel | burl | tarred block | ivy clump |
  | breaks | gives way a moment after you grab it | loose flake | chandelier | loose stone | dead twig | frayed line | loose brick |
  | rest | grip comes back while you stand on it | ledge | snow ledge | string course | bough | yard | window sill |

  The hold your input points at is ringed and named on screen with what it costs (FIRM, HARD, SLICK, BREAKS, REST);
  every other hold within reach gets a faint ring. Every breaking hold, on every face, trickles grit beneath it, so a
  player can spot one before grabbing it.
- **Anchors and a real rope.** Reaching an anchor (a bolt, an ice screw, a grapnel, a sling, a shackle or a piton,
  one per face) clips your rope in, and the rope is drawn from your belayer at the foot up through every anchor you
  clipped to your climber. A fall drops you back to the last anchor clipped.
- **Three fall rules:** `rope` (before the first anchor the rope runs to the belayer: back to the start), `strict` (a
  fall before the first anchor ends the climb), `solo` (no rope: any fall ends the climb).
- **Hazards with fair warning.** Things fall from above: rocks, icicles, stones, pine cones, rigging blocks or
  bricks, with a shadow on the face and a warning mark at the top of the screen over their column, so you can move
  aside. Gulls, ravens, owls, bats or arrows cross the face, with a warning mark at the edge at their height, so you can
  climb out of their path. Gusts (on every face but the castle) drain a loose hold faster: shelter on a firm hold or a
  rest. A hit costs grip.
- **Three goals:** `summit` (reach the top against the clock), `collect` (eggs, crystals, coins, acorns, doubloons or
  gems wait beside the line, and each can give one of your items) and `race` (a rival climbs its own line beside yours;
  summit first).
- **Your cast.** The climber is your party leader's walking character (or any actor) seen from behind, the row MZ uses
  for ladders, with arms in the colour of its own sleeves reaching for the holds. Your second party member belays at
  the foot. A rival can be any character sheet; a thrower that hurls the falling stones down at you can be any enemy
  image.
- **Every face can be climbed.** Each face is laid out around a hidden safe line: every step within reach, no
  crumbling hold on it, a ledge to rest on and an anchor to clip at regular heights, and a firm hold beside it to dodge
  to. Before the player sees the face, the plugin's own autopilot climbs it and must reach the summit with no fall,
  every pickup and (race) ahead of the rival; a face that fails is laid out again. Measured over 7,200 faces (six faces,
  three goals, five difficulties, two lengths, two seed families): every one passed.
- **The same seed is the same face**, so a best time per face, goal, seed and difficulty is kept. A blank seed gives a
  new face every climb.
- **A HUD drawn by the plugin:** a grip gauge that turns amber and then red, the height in metres, the clock, falls,
  pickups or the rival's height, and an altitude rail down the right edge with your marker (and the rival's). Lettering
  (CLIPPED IN, FALL!, GUST!, SUMMIT!) is drawn in the plugin's own carved block alphabet. No font and no image file is used.

## Install

1. Copy `AscentCore.js`, `AscentDraw.js` and `Ascent.js` into your project's `js/plugins` folder.
2. In the Plugin Manager, add all three and turn them ON. Any order works: the files find each other when a climb starts.
3. Optional: set the result variables, the summit switch, a common event and an item per pickup in Ascent.js's parameters.

## Start a climb

From an event, use the Plugin Command **Ascent > Start a climb**:

| Argument | Values | Default |
| --- | --- | --- |
| Face | `cliff`, `ice`, `castle`, `tree`, `mast`, `tower` | `cliff` |
| Goal | `summit`, `collect`, `race` | `summit` |
| Difficulty | 1 to 5 | 3 |
| Climb length (seconds) | 15 to 240: about how long a steady climb takes | 60 |
| Seed | blank = a new face every climb; any text or number = the same face every time | blank |
| Falls rule | `rope`, `strict`, `solo` | `rope` |
| Climber | an actor; none = the party leader | none |
| Rival character sheet / index | a sheet in `img/characters` and its index 0 to 7 (race) | none |
| Thrower enemy image | an image in `img/enemies` | none |
| Demo | `true` lets the autopilot climb (an attract screen, or a preview) | `false` |

Or from a script call:

```js
CSAF.Ascent.start({ face: 'mast', goal: 'race', difficulty: 4, seed: 'harbour', rivalImage: 'People1', rivalIndex: 2 });
```

Unknown faces fall back to `cliff`, unknown goals to `summit`, unknown fall rules to `rope`.

## Controls

- **Arrow keys** (diagonals too) reach for the next hold that way and pull up to it, hand over hand. Holding a direction
  keeps climbing.
- **Mouse / touch:** tap a hold within reach.
- **Cancel** gives up the climb.

## Results

When the climb ends, before your event continues:

| Parameter | Receives |
| --- | --- |
| Time (1/100 s) -> variable | the climb time in hundredths of a second |
| Height reached (m) -> variable | the highest point reached, in metres |
| Falls -> variable | how many times the climber fell |
| Pickups -> variable | pickups taken |
| Summit -> switch | ON when the climber reached the top (in a race: before the rival) |
| Common event afterwards | reserved to run after the scene closes |
| Item per pickup | given once for every pickup taken |

Script calls:

```js
CSAF.Ascent.lastResult();  // { face, goal, seed, difficulty, finished, failed, won, time, height, heightMax,
                           //   falls, items, itemsMax, hits, best, newBest }
CSAF.Ascent.best('cliff', 'summit', 7, 3);  // best time in hundredths for that face, goal, seed and difficulty, or null
```

The record (climbs, best times, the last result) lives in `$gameSystem` and is saved with the game.

## Difficulty

Difficulty 1 to 5 sets how fast grip drains, how far apart the ledges and anchors are, how many hard and crumbling
holds there are, how quickly crumbling holds give way, how often hazards come and how much a hit costs, and how fast the
rival climbs. Measured with the plugin's balance probe (an internal test tool, 20 faces for each setting): a climber that does nothing
after its first move always falls (grip is the clock); a climber who reads the hazards and takes about half a second
per move reaches the summit at every difficulty; in a race that climber wins every race at difficulty 1 and 2 and
loses most at 4 and 5, where the rival climbs faster.

## Compatibility

- RPG Maker MZ (1.x). Tested on the MZ runtime with no other plugins.
- Ascent adds its own scene (`Scene_Ascent`) and one plugin command. **It replaces and extends no engine method.**
- It reads your actors' character names and indexes, your party's members, and the character sheets and enemy images
  you name. It plays your project's system sounds.

## Credits

Code and graphics: Core Systems Asset Factory, written with AI assistance (see LICENSE.txt).


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
