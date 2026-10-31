# Deepwarren Side: 15 Side-View Monster Sprites — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Deepwarren Side: 15 Side-View Monster Sprites  
**Engine:** PixelLab API (REST, from Node) — engine-agnostic PNG/sheet output  
**Docs published:** 2026-10-31


---

DEEPWARREN SIDE · Crypt, Cavern and Wildwood
============================================

Fifteen foes drawn for a side camera, one scale and one ground line. Every one idles, moves, strikes, flinches and falls.

WHAT IS IN THIS PACK
--------------------
15 foes drawn for a SIDE camera (platformers, metroidvanias, side-scrollers), in one style and one
palette at one world scale, in three groups: the crypt undead, the cavern beasts and the wildwood
monsters. Every foe has:

  idle   4 frames, a looping rest
  walk   6 frames, a looping move
  attack 6 frames, one-shot, with a named hit frame
  hurt   6 frames, one-shot flinch
  death  6 frames, one-shot fall that ends down

Every animation faces RIGHT (east) and LEFT (west). That is 840 frames at each of two grid sizes,
224x224 and 112x112 pixels (1,680 frame files in all). The 224px frames are the master, drawn
natively; the 112px set is an exact 2:1 reduction of it, palette-locked. At rest they stand from
41px (caveSlime) to 187px (treant) tall in the 224px cell, on one shared ground row, so any two can
share a scene at 1:1.

  THE CRYPT
    skeletonSwordsman Bare bones, a red rag, a long iron sword. Attack: raises the sword overhead
                      and chops down; hit frame 5.
    boneArcher        Hooded skeleton with a bow and quiver. Attack: raises the bow to firing
                      height; hit frame 5.
    ghoul             Long-limbed crawler with a spined back. Attack: reaches far forward with one
                      long clawed arm, jaws open; hit frame 5.
    wraith            Hooded cloak, long pale claws, no feet. Attack: throws both claws overhead and
                      rakes forward and down; hit frame 5.
    armouredRevenant  Dark plate, a huge blade and a short rod. Attack: swings the huge blade out,
                      up over the head and down in a chop; hit frame 5.

  THE CAVERN
    caveSlime         A low yellow dome with a wide mouth. Move: pulses: it squashes and stretches
                      on the spot. Attack: lunges along the ground with its mouth gaping; hit frame
                      4.
    giantBat          Russet wing, big ears, cyan eye. Move: hovers: its wing stays raised and
                      shifts a little. Attack: lunges forward with its jaws open; hit frame 3.
    rockCrawler       Armoured segmented bug, knee high. Attack: lifts its head and lunges with the
                      mandibles open; hit frame 3.
    mushroomFiend     Grinning walking toadstool, thin limbs. Attack: steps up and thrusts one arm
                      straight forward; hit frame 4.
    crystalTroll      Huge pot-bellied brute, crystal back. Attack: raises a fist overhead and
                      brings it down to chin height with a lunge; hit frame 4.

  THE WILDWOOD
    carnivorousPlant  Fanged head on walking roots. Attack: opens its jaws wide and snaps them shut;
                      hit frame 4.
    direWolf          Dark long-legged wolf with a mane. Attack: snarls, lunges and pounces with its
                      forelegs out; hit frame 3.
    tuskedBoar        Heavy wild boar with ivory tusks. Attack: drops its head and lunges tusks
                      first; hit frame 3.
    treant            Striding giant of ridged bark. Attack: reaches forward with its far arm; hit
                      frame 3.
    giantSpider       Rust-red spider, three-quarter view. Attack: lifts its abdomen and dips its
                      head to bite; hit frame 3.

foes.json: PIVOT AND HIT FRAME
------------------------------
One record per foe: its theme, its role, hitFrame (the 0-based attack frame where the blow lands),
and pivot at each grid and facing. pivot.x and pivot.y are pixels from the top-left of a cell: the
foot column on the shared ground row. normalizedX and normalizedYUp are the same point as 0..1
values, with Y counted from the bottom edge, for engines that want a custom pivot. fps values are
starting suggestions.

HOW THE VIEWS WERE MADE, AND WHAT TO EXPECT
-------------------------------------------
The right-facing (east) frames are the generated art. Every left-facing (west) frame is an exact
horizontal mirror of the east frame with the same name, checked pixel for pixel in all 420 east/west
pairs at the 224px master (the 112px set is reduced from each facing).

  - The bone archer raises its bow to firing height and looses from there: it does not pull a string
  and no arrow is included, so spawn your own projectile on its hit frame.
  - The giant spider is drawn in a three-quarter view with its head turned toward the viewer, and the
  mushroom fiend close to head-on with its face turned right; the other thirteen are true or near-true
  side profiles.
  - The bat and the wraith hover with no feet on the ground row, and the bat comes down to it when it
  dies. The bat's wing stays raised in flight, shifting a little, rather than beating up and down.
  - Attack, hurt and death are one-shots. Some attacks end near the rest pose and others end with the
  arm still out or on the strike itself (any foe whose hit frame is 5 ends on its blow), so blend or
  cut back to idle.
  - The crystal troll's blow lands high and short: its raised fist comes down to chin height with a
  lunge, and the arm does not stretch out past the body.
  - The armoured revenant's short rod swings up between the second and third frames of its walk, about
  35 px at the 224px master, and it shows at both sizes. The ghoul's far arm is out of sight while it
  reaches.
  - Small parts simplify on the last death frames: the skeleton's sword thins to a sliver, the bone
  archer's bow loses its lower limb, the carnivorous plant's stem and small leaf go out of sight, the
  mushroom fiend's legs fold under its body, the crystal troll's shell loses its dark rim, and the
  revenant's short rod goes out of sight while its trailing cord becomes a dark red strip across its
  back. The plant and the fiend drop from standing to the ground in a single frame, and the plant's
  head lands one frame after its roots.
  - The tusked boar's large tusk wobbles a little against its snout in the idle loop.
  - Moves play on the spot, so your code supplies the travel. Some lunges and recoils are made by
  moving the whole frame a few pixels inside its cell.
  - Every grounded foe stands on the one ground row in every idle and walk frame. On some attack, hurt
  and death frames a toe, root, limb or jaw reaches up to 2 px past that row, and the mushroom fiend
  sits 2 px above it for one frame as it settles.
  - Every death ends on the ground: most lie flat on the front or side, the bat rests on its wing with
  its eye open, and the cave slime melts into a puddle.

PART OF THE DEEPWARREN SERIES
-----------------------------
The palette is 128 colours: all 96 colours of the Deepwarren series palette (the top-down Deepwarren
packs), unchanged, plus 32 fitted to this cast. This pack is a SIDE view; the top-down packs are
overhead views of a different cast.

FOLDERS
-------
  224x224/frames/               840 individual PNGs, one animation frame each
  112x112/frames/               840 individual PNGs, one animation frame each
  224x224/sheets/               75 sheets, one per foe per animation, two rows
  112x112/sheets/               75 sheets, one per foe per animation, two rows
  engine_import/strips/224x224/ 150 strips, one per foe per animation per facing, one row
  engine_import/strips/112x112/ 150 strips, one per foe per animation per facing, one row
  frames.json                   every frame's sheet, x, y, w, h at the 224px grid (halve them for 112px)
  foes.json                     pivot and hit frame per foe, at each grid and facing
  pack.json                     the manifest: palette, grids, foes, animations, which ones are one-shots
  engine_import/godot/          182 files: 30 Godot 4 SpriteFrames resources (.tres) with their sheets

SHEET LAYOUT
------------
Columns are the animation frame index, 0..n-1. Row 0 faces right (east), row 1 faces left (west).
frames.json gives every frame's exact rectangle, so nothing has to be counted by hand.

GODOT 4
-------
Copy an engine_import/godot/<grid>/ folder anywhere in your project and load a .tres. Each one is a
SpriteFrames with that foe's animations already named (idle_east, walk_west, attack_east and so on),
regions sliced and fps set; attack, hurt, death do not loop. Texture paths are RELATIVE, so the
folder works wherever you put it. Both grids were loaded in headless Godot before shipping and the
engine built every declared frame.

OTHER ENGINES
-------------
Unity, GameMaker, Construct, Phaser and the rest: use the strips, the sheets with frames.json, or
the single frames, and set each pivot from foes.json. Every frame of a foe shares one cell and one
pivot, so frames swap in place without offsets.

THE CONSISTENCY PROOF
---------------------
Every figure below was re-derived from the shipped files by our pack gate immediately before
this file was written, not typed from a previous build:

  2,280 files are real PNGs, not renamed JPEGs
  2,280 files decode to real pixels
  2,280 files are exactly one cell, or a whole multiple of it
  22,087,632 opaque pixels, every one of them inside the declared 128-colour palette
  210,739,200 pixels carry strictly binary alpha: no anti-aliasing, no soft upscale
  3,360 frame-map checks: every declared frame lands inside its sheet and has a real file at both grids
  1,140 assets present at BOTH grid sizes (2,280 asset slots in all)

LICENCE
-------
See LICENSE.txt. Short version: commercial use is permitted, in as many projects as you like, and
you do not need to credit us. You may not resell the art itself as an asset pack.

AI DISCLOSURE
-------------
This pack is AI-generated art, and the store page says so.

  Code      yes  (the pipeline, the gates and the engine exporters are AI-written)
  Graphics  yes  (the sprites are generated with PixelLab, a pixel-art diffusion model, on a paid
                  plan whose terms permit commercial use, then palette-snapped, cleaned and
                  reviewed frame by frame; some cycles play their generated frames in a chosen order)
  Sounds    no   (there are none)
  Text      no   (there is no narrative content)

Every animation cycle was reviewed frame by frame, by the builder and by an independent reviewer,
before this pack shipped.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
