# Askew — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Askew  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-10-28


---

# Askew for RPG Maker MZ

Exit 8-style anomaly loops on maps you already made. The player walks the same corridor, room or street again and
again. Each pass the map is either exactly as you built it, or one thing in it has changed. Nothing changed: walk on.
Something changed: turn back. Answer right and the pass sign counts up; answer wrong and the lights cut and the count
falls to 0. Reach the goal and an exit opens at the far end.

Every anomaly is made from your own map: your tiles, your paintings and props, your walls and floors, your characters
and your enemies. Askew reads the map when each pass loads and makes the change from its pixels. Your image files and
your map files are never changed. There are 50 kinds of anomaly, listed at the end of this file.

## Install

1. `AskewCore.js`
2. `Askew.js`

Copy both into your project's `js/plugins` folder and turn them ON in the Plugin Manager. Any order works.

## Make a loop

1. Put `<askew>` in the map's **Note** box.
2. Paint the far end of the map with **region 61** (walk on) and the way back with **region 62** (turn back).
3. Optional: an event whose Note is `<askew: sign>` is where the pass sign hangs. It is drawn over that event, two
   tiles wide. Without one, the sign sits at the top centre of the screen.

The loop starts the moment the player arrives on the map. Every pass starts where the player first arrived, facing the
way they faced. Stepping onto a region 61 tile or a region 62 tile ends the pass, and the next one begins at the start.
Leaving the map any other way (a door event, a transfer) ends the loop; coming back starts a new one at 0.

Map note options, comma separated, any order:

| Option | What it does |
| --- | --- |
| `goal 8` | correct passes in a row to reach the exit (default: the parameter) |
| `chance 50` | the percent chance that a pass carries an anomaly |
| `go 61`, `back 62` | which regions mean walk on and turn back |
| `start 4 7 6` | each pass starts at x 4, y 7, facing right (2 down, 4 left, 6 right, 8 up) |
| `difficulty hard` | `easy`, `normal` or `hard` (see below) |

Example: `<askew: goal 5, chance 60, start 1 7 6>`.

## A pass

- **Right** (walked on when nothing changed, or turned back when something did): the screen fades, the next pass
  begins, and the sign flips its number up.
- **Wrong**: the lights cut at once, the next pass begins in the dark, the sign clatters down to 0, and the lights come
  back.
- The first pass, and the pass after a mistake, is always clean, so the player can learn the map (parameter **First
  pass is always clean**).
- **The exit**: when the count reaches the goal, the next pass is clean and a lit EXIT sign hangs over the far end.
  Walking on through it turns the **Switch: escaped** ON, runs the **Common event: escaped**, and transfers the player
  to **Exit transfer: map** if you set one. Turning back on the exit pass is a mistake like any other.

The same anomaly is never chosen twice in a row, and kinds the player has not caught yet are chosen twice as often as
ones they have.

## How a change is checked

Before a change that redraws tiles is kept, Askew draws the affected part of the map as you built it and as changed,
the way the engine draws it, and compares the two at full size. A change that moves fewer than 6% of one tile's
pixels, or moves them too little to see, is refused, and another place or another kind is tried. Changes that would
block the way from the start to either exit are refused too. On the store gallery map Askew's drawing of the whole map
matched the engine's own rendering to the pixel.

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Passes to escape | 8 | correct passes in a row to reach the exit |
| Anomaly chance (%) | 50 | the chance a pass carries one anomaly |
| First pass is always clean | ON | the first pass, and the pass after a mistake, changes nothing |
| Difficulty | normal | `easy`: only the louder anomalies (33 kinds). `normal`: all 50. `hard`: leaves out the loudest (44 kinds) |
| Leave out these anomalies | blank | anomaly names, comma separated, for example `negative, hole, upside` |
| Region: walk on / turn back | 61 / 62 | the two exit regions |
| Seed | blank | blank = a new loop every play; a number = the same anomalies in the same order every time |
| Variable: pass count / anomalies found / mistakes / kinds seen | 0 | variables Askew keeps up to date (0 = none). Kinds seen counts every different kind the player has caught, kept in the save |
| Switch: escaped | 0 | turned ON when the player walks out through the exit |
| Common event: escaped | 0 | runs when the player walks out through the exit |
| Exit transfer: map, x, y | 0 | where the exit leads; map 0 = stay on this map |
| Pass sign style | enamel | `enamel`, `brass` or `paper` |
| Sound: count goes up / count falls to zero / the exit opens | blank | sound effects (blank = none) |

## Plugin commands

| Command | What it does |
| --- | --- |
| Start a loop here | starts a loop on this map from where the player stands (for a map without the note) |
| Stop the loop | from the next pass on the map stays as you built it and the exits do nothing |
| Leave the pass | for your own events instead of the regions: the player leaves by `go` or `back` |
| Set the next pass | `none`: the next pass is clean. `any`: it has an anomaly. Or an anomaly name: that one, if this map has what it needs |
| Show the anomaly | rings what changed on this pass for a few seconds (a tutorial, a hint, a fail screen); a clean pass shows nothing |
| Set the pass count | sets the count (reaching the goal arms the exit pass) |

`Set the next pass` overrides **First pass is always clean**, so a tutorial can script exactly what the player sees.

## What Askew reads on your map

- **Objects and pictures**: tiles from the B to E sheets on the upper layers that are not plain floor (an object, a
  painting, a plaque). Tiles drawn next to each other on the sheet and placed next to each other on the map are one
  object, so a two-tile bench or a tall portrait moves as one piece. An object on a wall is a picture.
- **Floors and walls**: the ground the player can reach (A1, A2, A5 or a full-tile B to E floor) and the wall faces (A3,
  A4) beside it.
- **Characters**: events with a character graphic. Object graphics (file names starting with `!`) are left alone unless
  the event's Note says `<askew: npc>`; `<askew: still>` keeps a character out of the anomalies.
- **Enemies**: the silhouette anomaly is cut from one of your enemy images (side view or front view, as your
  project uses).

Only what the player can reach, or stand within three tiles of, is used. A map with no objects or characters still
gets the floor, wall, light, figure and sign anomalies.

## The 50 anomalies

Objects and pictures (17): `swap` (replaced by its neighbour on your tileset sheet), `mirror`, `flip` (upside down),
`tilt` (hung crooked), `turn` (a quarter turn), `hue` (another colour), `grey` (drained of colour), `dark` (in shadow),
`negative`, `bigger`, `smaller`, `sink` (a picture slipped down the wall), `blank` (a picture painted out), `gone`,
`shift` (moved one tile), `twin` (a copy beside it), `trade` (two objects swapped places).

Floors and walls (7): `floorPatch` (a patch of another of your floors), `wallPatch` (a strip of another of your walls),
`stain`, `prints` (footprints), `hole`, `crack`, `drip`. Marks are drawn in a deeper shade of the darkest colour of the tile they
land on, so they belong to your floor or wall.

Light (5): `lightOut`, `redCast`, `flicker`, `dim` (the whole map darker), `coldCast` (the whole map colder).

Figures (2): `silhouette` (a figure near the far end, black, cut from one of your enemy images), `doppel` (a copy of
the player standing ahead, facing away).

Characters (15): `stare` (keeps facing the player), `backTurned` (keeps its back to the player), `backwards` (walks
backwards), `follow`, `frozen` (stopped mid-step), `fast`, `vanished`, `hueShift`, `taller`, `shorter`, `ghost`
(see-through), `upside`, `otherFace` (someone else from the same character sheet), `elsewhere` (standing where nobody
stood), `double` (a second one beside it).

The pass sign (4): `signMirror` (the number mirrored; never chosen on a number that mirrors to itself, such as 0 or 8),
`signWrong` (one more than the real count), `arrowBack` (the arrow points the way you came), `signGone`.

Loudness for **Difficulty**: `easy` drops the quiet ones (`mirror`, `tilt`, `grey`, `dark`, `smaller`, `sink`,
`shift`, `floorPatch`, `prints`, `crack`, `dim`, `coldCast`, `frozen`, `fast`, `taller`, `shorter`, `elsewhere`);
`hard` drops the loudest (`flip`, `negative`, `hole`, `follow`, `upside`, `signGone`).

## Compatibility

- RPG Maker MZ 1.x. Not for MV.
- Every engine function Askew changes keeps the original and calls it (no core method is replaced). The full list is
  on the store page.
- The loop uses a same-map transfer for each pass, so the map's events reset each pass exactly as when the player
  first entered (self switches and variables are kept).
- Saved with the game: a save made mid-pass loads back into the same pass with the same anomaly.

## Limits

- One loop at a time.
- A change that needs something your map does not have (a character, a second floor or wall tile, an enemy image) is
  skipped and another kind is chosen.
- Animated water (A1) is checked at its first frame.

Every line of this plugin was written with AI assistance. Copyright (c) 2026 Core Systems Asset Factory. Terms of
use: LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
