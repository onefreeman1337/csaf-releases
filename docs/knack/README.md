# Knack — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Knack  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-02


---

# Knack for RPG Maker MZ

Twelve work animations made from your own walking sprites: chop, mine, dig, hoe, water, fish, hammer, saw, sweep, reap, stir and gather. Tag a tree and the hero swings an axe at it with chips flying, then the event's page runs. Tag an NPC and it hammers at its anvil all day. There is no pose sheet to draw and no tool sheet to draw: each frame is made from the character's own walking sheet, in that sheet's own colours, the first time it is needed.

Three files: `Knack.js` (the one you configure), `KnackCore.js` (the pose rules) and `PostureCore.js` (the shared pixel measurements; the same file ships with Posture, Embrace and Hoist, and one copy serves all of them). A sample sheet, `Demo/img/characters/!Knack_Nodes.png`, has eight objects drawn for this plugin to work at: a tree, an ore rock, an anvil, a log on a sawhorse, crops, a cauldron, a dirt mound and a stump.

## Install

1. Copy `Knack.js`, `KnackCore.js` and `PostureCore.js` into your project's `js/plugins` folder.
2. Open the Plugin Manager and add all three, switched ON. Any order works; the recommended order is PostureCore, KnackCore, Knack.
3. Optional: copy `!Knack_Nodes.png` into `img/characters` to use the sample objects.

## The jobs

| Job | Tool | What the character does | Where the tool lands |
| --- | --- | --- | --- |
| `chop` | axe | swings from over the shoulder | wood chips |
| `mine` | pickaxe | swings down hard | sparks and stone chips |
| `dig` | shovel | drives it in, levers, tosses | clods of earth |
| `hoe` | hoe | chops at the ground | clods of earth |
| `water` | watering can | tilts and pours | drops of water |
| `fish` | rod | casts, waits for a bite, reels in | a float, a line and a ripple |
| `hammer` | hammer | strikes quickly at chest height | sparks |
| `saw` | saw | pushes and pulls | sawdust |
| `sweep` | broom | sweeps side to side | dust |
| `reap` | scythe | swings low and wide | cut flecks |
| `stir` | ladle | stirs round | steam |
| `gather` | bare hands | crouches, pulls something up | leaf flecks |

The tool's name works anywhere a job's name does: `axe`, `pick`, `pickaxe`, `shovel`, `can`, `rod`, `broom`, `scythe`, `ladle`.

Six tool materials: `iron`, `copper`, `gold`, `steel`, `crystal`, `obsidian`. They recolour the metal; the shape never changes. A broom and bare hands have no metal, so a material changes nothing on them.

## A resource the hero works

Make an event for the tree or the rock, with Action Button as its trigger, and put a tag in its **Note** box or in a **comment on its page**:

| Tag | What it does |
| --- | --- |
| `<knack: axe>` | the action button plays the axe, then the page runs |
| `<knack: pick 5 gold>` | five swings of a gold pickaxe, then the page runs |

The page runs after the work, as if you had pressed the button then. So the page can give the wood itself, or call any gathering plugin.

A comment belongs to its page: a tree that has been cut down onto another page, with no tag there, stops asking for the axe. A page with nothing on it never swings.

## A character who works by itself

| Tag | What it does |
| --- | --- |
| `<knack worker: hammer>` | this event works all the time |
| `<knack worker: saw copper>` | in copper |

It stops while it walks and while you talk to it, then goes back to work. A worker tag in a page comment ends when that page does.

## Work regions

Plugin parameter **Work regions**: a region id, a job, and a common event. The action button facing a tile of that region, or a tap or click on one right next to the hero, works it, then runs the common event. A tap further away walks, as usual. `CSAF.Knack.lastTile()` tells the common event which tile it was. Regions answer only when nothing else on the map did.

## Plugin commands

| Command | What it does |
| --- | --- |
| Work | a character works: who, which job, how many swings, what material, and whether the event waits |
| Stop Work | a character stops, and a worker stays off until its page changes or the map is loaded again |

**Who:** -1 is the player, 0 this event, 1 and up an event id, -2 to -4 the followers. In a common event that no event called, 0 means nobody: use -1 or an id. **Swings:** blank is the job's own number, 0 is until a Stop Work command (the event does not wait for that one). For the rod, a swing is a cast.

This is the hook for a gathering plugin that runs a common event: put the Work command in that common event.

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Work speed (percent) | 100 | 200 is twice as fast (25 to 400) |
| Default tool material | iron | what a tool's metal is made of unless a tag or command says otherwise |
| Show effects | true | chips, sparks, clods, drops, dust, flecks and steam |
| Fishing cast (tiles) | 2 | how far out the float lands (1 to 5) |
| Fishing wait, shortest (frames) | 90 | the shortest wait for a bite (60 frames = 1 second) |
| Fishing wait, longest (frames) | 240 | the longest wait for a bite |
| Work regions | [] | see above |
| Swing the axe with Timber | true | with Timber installed, the OK-button chop also plays a quick axe swing |
| Worker sound range (tiles) | 6 | a worker is heard this many tiles from the player, quieter with distance; 0 keeps workers silent. The player's own work is always heard |
| Sound: chop | Blow1 | a sound from `audio/se`; blank is silence |
| Sound: mine | Sword1 | |
| Sound: dig and hoe | Earth1 | |
| Sound: water | Water1 | |
| Sound: the float lands, the fish bites | Water2 | |
| Sound: hammer | Hammer | |
| Sound: saw | | |
| Sound: sweep | | |
| Sound: reap | Wind1 | |
| Sound: stir | | |
| Sound: gather | | |

## Script calls

```
CSAF.Knack.work(target, 'chop', {swings: 3, material: 'gold'})
CSAF.Knack.stop(target)
CSAF.Knack.isWorking(target)   // true or false
CSAF.Knack.lastTile()          // {x, y}: the last region tile worked
```

`target` is `$gamePlayer`, any character, or the number the command uses (0 is the event the map is running now, if any).

## How the frames are made

Each character gets one sheet per job and material, with four facings and one column per key frame, made from its own walking sheet. Everything a map announces is made while the map opens, one sheet a frame, so the first swing does not stall: the tags on any page of its events, its regions, and the Work commands in its events and in the common events. A job nothing announced (a script call, a new party leader) is made the first time it is needed, which can take a few frames. A walking sheet is read once, the first time it is needed; a swing reads no pixels.

The arms are found from the character's own walk (the pixels that swing), erased, and redrawn to the grip in the sheet's own sleeve, skin and outline colours. The upper body leans in whole pixels; the legs stay on the tile. The tool is drawn from a small outline shape at that frame's angle, with a 1 px outline in the sheet's own darkest arm colour. Nothing is resampled or blended.

It works on 48 px sheets, big `$` sheets and tall sheets.

## Good to know

- The fish bites by itself and nothing is caught for you: the bite is an exclamation balloon from your own balloon sheet, and the page or common event that runs after the reel decides what was caught.
- The fishing float lands where the cast takes it, water or not. Tag the water's edge.
- Followers can work through the Work command. They stay put and keep their facing until it ends.
- A hero carrying something with Hoist does not start work. A character in a Posture pose or showing a Stricken look keeps it while the work's clock runs.
- A sheet holds up to six frames. A four-frame sheet on a stock 48 px character is about 1 MB of video memory, so twelve jobs on four party members in one material is about 48 MB; most maps use two or three jobs. Sheets, and a copy of each walking sheet's pixels, stay in memory until the game closes.
- Facing away from the camera, the body hides most of the work: the tool shows over the head or beside the body. Facing the camera, a saw and a hammer work to the character's side.
- A save taken in the middle of a swing loads back to the same swing.
- A character sheet that is not a walking figure (a door, a chest) still draws something, and it will not look like work. Use a figure.

## Compatibility

Tested in RPG Maker MZ 1.10.0 with Posture, Hoist, Stricken and Timber installed beside it. Knack adds its own frames only while a character works; at every other moment the engine's own sprite code runs unchanged. Pixel-movement plugins, 8-frame walking plugins, and plugins that redraw a character's sprite themselves are untested with it. VisuStella's Events and Movement Core is untested with it.

## Terms

See LICENSE.txt. Commercial and non-commercial use in RPG Maker projects. Written with AI assistance.

Core Systems Asset Factory, https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
