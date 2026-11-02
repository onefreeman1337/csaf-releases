# Bestiary: Dragons, Yokai and Giant Bugs — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Bestiary: Dragons, Yokai and Giant Bugs  
**Engine:** PixelLab API (REST, from Node) — engine-agnostic PNG/sheet output  
**Docs published:** 2026-11-02


---

BESTIARY · Dragons, Yokai and Giant Bugs
========================================

Twelve top-down monsters, combat-complete: idle, walk, strike, hurt and death in four directions.

WHAT IS IN THIS PACK
--------------------
Twelve monsters in three casts, combat-complete. DRAGONS AND DRAKES: emberDrake, jadeDragon,
greatDragon, stormRaptor. ONI AND YOKAI: redOni, crowTengu, kappa, kitsune. GIANT BUGS: giantMantis,
giantSpider, giantScorpion, giantHornet. Every one of them has:

  idle   1 frame x 4 directions (south, west, east, north), a still standing pose
  walk   6 frames x 4 directions (south, west, east, north), a looping walk
  strike 6 frames x 4 directions (south, west, east, north), a one-shot attack with the monster's own body: fists, jaws, scythes or a stinger
  hurt   6 frames x 4 directions (south, west, east, north), a one-shot flinch that returns to the standing pose
  death  6 frames x 4 directions (south, west, east, north), a one-shot fall

That is 100 frames per character and 1,200 frames in the pack at each of 2 grid sizes: 160x160 and
80x80 pixels. The 160px frames are the master, drawn natively (nothing in them is upscaled); the
80px set is an exact 2:1 reduction of it, palette-locked, so it stays crisp. In the 160px cell the
south idles measure 52 to 121px tall; the cell is that large so strikes at full reach and deaths lying
flat fit without clipping.

  crowTengu     A crow tengu: a man with a long crow beak. Strike: throws a straight
                punch with a clawed hand; head-on it lunges with both hands together.
  emberDrake    A wingless fire drake that rests sitting. Strike: lunges forward and
                down, horned head first; from behind the head dips and lifts, and that cycle ends
                on a held frame.
  giantHornet   A giant hornet on four pale wings. Strike: tilts and beats its
                wings, with no visible sting.
  giantMantis   A giant mantis with two scythe forelegs. Strike: brings its scythe
                forelegs down; head-on and from behind they snap closed over the head.
  giantScorpion A giant scorpion, its stinger raised. Strike: stabs its tail forward
                over the body; head-on the tail tip only sways.
  giantSpider   A giant black spider on long jointed legs. Strike: lifts its front
                legs and stabs from the front and back; in profile it barely moves, only the leg
                tips shuffle.
  greatDragon   The great blue dragon, the heaviest body. Strike: drops its head and
                bites, the jaws closing at full reach; from behind the head dips and the wings
                flare a little.
  jadeDragon    A jade-green dragon, wings spread wide. Strike: flares its wings and
                dips its head forward in a lunge.
  kappa         A squat river kappa, a white dish on top. Strike: pushes a webbed
                hand forward in profile, the smallest strike in the pack; head-on and from behind
                both arms reach out wide.
  kitsune       A white fox spirit with one great tail. Strike: springs forward with
                its jaws open.
  redOni        A huge red oni that fights with its fists. Strike: throws a big
                punch at full reach from the shoulder; head-on it hunches and drives both fists
                low.
  stormRaptor   A running drake with an orange-red crest. Strike: lunges its head
                forward with the jaw open.

ONE STYLE, ONE SCALE
--------------------
All twelve share one 128-colour palette: 3 amber colours pinned for the eyes, plus 125 more fitted
to this cast. They are drawn to one scale in one cell, so they stand in the same scene without
resizing: the kappa is 68px tall, the crow tengu 108px, the red oni 118px and the jade dragon 121px.
Every monster's feet stand on row 148 of the 160px cell (row 74 of the 80px cell) and the hornet
hovers 24px above it until it falls.

HOW THE VIEWS WERE MADE (disclosed so you are not surprised)
-----------------------------------------------------------
South (front) and north (back) are generated art for every state. For the side views, one profile
was generated and the other is its exact horizontal mirror:

  The WEST death is the generated EAST death mirrored, pixel for pixel, for: crowTengu, emberDrake, giantHornet, giantMantis, giantScorpion, giantSpider, greatDragon, jadeDragon, kappa, kitsune, redOni, stormRaptor.
  The WEST hurt is the generated EAST hurt mirrored, pixel for pixel, for: crowTengu, emberDrake, giantHornet, giantMantis, giantScorpion, giantSpider, greatDragon, jadeDragon, kappa, kitsune, redOni, stormRaptor.
  The WEST idle is the generated EAST idle mirrored, pixel for pixel, for: crowTengu, emberDrake, giantHornet, giantMantis, giantScorpion, giantSpider, greatDragon, jadeDragon, kappa, kitsune, redOni, stormRaptor.
  The WEST strike is the generated EAST strike mirrored, pixel for pixel, for: crowTengu, emberDrake, giantHornet, giantMantis, giantScorpion, giantSpider, greatDragon, jadeDragon, kappa, kitsune, redOni, stormRaptor.
  The WEST walk is the generated EAST walk mirrored, pixel for pixel, for: crowTengu, emberDrake, giantHornet, giantMantis, giantScorpion, giantSpider, greatDragon, jadeDragon, kappa, kitsune, redOni, stormRaptor.

(Checked pixel for pixel at the 160px master; the 80px set is reduced from it facing by facing.)
Anything carried on one side therefore swaps sides between east and west in those cycles.

  * Strikes, hurts and deaths are one-shots: every strike plays out once and every hurt returns to
  the standing pose.
  * Edits to the generated art, all of them pixel edits of the model's own frames: the kappa's south
  and north views are each mirrored from one half of the generated image, so they are symmetrical;
  the jade dragon's south head is pasted from one of its own strike frames; the storm raptor's
  second tail arm was erased from its south idle and walk, and a thin leftover shows at the right
  thigh when zoomed in; the ember drake's eyes were recoloured to amber; some painted marks were
  removed from individual frames.
  * Three deaths end on a frame made from the creature's own idle rather than generated: the giant
  scorpion east is flipped belly-up with its tail rearranged along the ground (a few pixels of its
  underside are cut flat at the ground line), and the giant spider north and jade dragon north are
  squashed flat. The light on those last frames comes from the other side, and the jade dragon's
  lower wing edge is cut straight on its last north frame.
  * Crow tengu: in the east and west hurt the torso turns toward the viewer for three frames while
  head and legs stay in profile; the east strike twists the torso the other way. Its north strike
  carries one forearm out of sight and does not bring it back before the last frame.
  * Ember drake: it rests sitting and stands up to walk. The north walk moves both hind feet
  together, more of a pump than a stride, and its south and east walks stand a few pixels above the
  idle's ground line. The thin second tail doubles on two east death frames.
  * Giant hornet: on the east and west strike a dark striped wedge reads as a second abdomen and one
  wing goes flat and straight. On its last south death frame the abdomen is a plain navy dome
  without its yellow bands. In the side views it hangs upright rather than level.
  * Giant mantis: the scythes are smooth blades in the side views and toothed from the front and
  back, and the walk shows one blade where the idle shows two. Its north walk lifts both feet
  together for three frames, closer to a hop.
  * Giant scorpion: on the east and west death the claws turn flat amber for three frames before
  they settle. Its north walk moves the two rear legs together, its mouthparts change between the
  south walk and the south death, and head-on the stinger is a blunt shape.
  * Giant spider: it has nine walking legs in the side views and eight from the front and back. Its
  east and west death curls the legs but leaves the abdomen raised above the ground.
  * Great dragon: on the east and west death the long tail shortens to a stub on the last two frames
  and a brown slab shows under the belly on one of them. The near wing sits in front of the body at
  idle and behind it in the walk, so it changes when the state changes.
  * Jade dragon: on the east and west strike the wing flattens over the head like a canopy and the
  head turns toward the viewer. The east and west death ends horizontal on its snout and one foot,
  the south death ends propped up with its head raised, and the north death sinks with the wings
  still spread, so none of the three lies fully flat. It has a two-branched tail in every view.
  * Kappa: the shell has a band of broken red and black pieces in the side views, where the back
  view has clean plates. In the side-view strike the belly loses its cream plates and turns a flat
  mauve. In the north strike the hands become pincer shapes and the feet become wedges with a white
  tip.
  * Kitsune: from behind the inner legs are short stubs during the hurt, and the ear tips lose their
  outline on many frames.
  * Red oni: on the east and west death the spotted cloth becomes plain gold strips. In the east and
  west hurt the chest stays facing the viewer more than the head does.
  * Storm raptor: the north walk shows one leg, the other hidden behind the tail, and dark lobes
  grow on the sides of its head on the last three frames. Its north strike drops the crown 26 pixels
  in one frame and shortens the crest. The south walk has small leftovers from the tail edit at the
  right thigh.

FOLDERS
-------
  160x160/frames/       1,200 individual PNGs, one animation frame each
  80x80/frames/         1,200 individual PNGs, one animation frame each
  160x160/sheets/       60 sheets, one per character per state
  80x80/sheets/         60 sheets, one per character per state
  frames.json           every frame's sheet, x, y, w, h at the 160px grid
  pack.json             the manifest: palette, grids, characters, states, which states are one-shots
  rpgmaker_mz/          24 RPG Maker MZ character sheets ($-prefixed, 3x4 walk, both grids)
  engine_import/godot/  146 files: 24 Godot 4 SpriteFrames resources (.tres) with their sheets

SHEET LAYOUT
------------
Columns are the animation frame index, 0..n-1. Rows are south / west / east / north, RPG Maker
character-sheet order. Every sheet has four rows. frames.json gives every frame's exact rectangle,
so nothing has to be counted by hand.

RPG MAKER MZ
------------
Drop the contents of rpgmaker_mz/160x160/ (or 80x80/) into img/characters/. The files are
$-prefixed, so MZ treats each one as a single 3x4 character sheet and the walk plays down / left /
right / up out of the box. The strike, hurt and death sheets are in 160x160/sheets/ and
80x80/sheets/ for your own battle or event animations.

GODOT 4
-------
Copy an engine_import/godot/<grid>/ folder anywhere in your project and load a .tres. Each one is a
SpriteFrames with that monster's animations already named (idle_south, walk_west, strike_east,
death_north and so on), regions sliced and fps set; strike, hurt, death do not loop. The texture
paths are RELATIVE, so the folder works wherever you put it. Both grids were loaded in Godot 4.7.2
before shipping and the engine built every declared frame: 1,200 per grid, every one a real
AtlasTexture, every region exact.

THE CONSISTENCY PROOF
---------------------
Every figure below was re-derived from the shipped files by `node Kernel/sprites/pack_proof.js`
immediately before this file was written, not typed from a previous build:

  2,664 files are real PNGs, not renamed JPEGs
  2,664 files decode to real pixels
  2,664 files are exactly one cell, or a whole multiple of it
  16,535,490 opaque pixels, every one of them inside the declared 128-colour palette
  119,808,000 pixels carry strictly binary alpha: no anti-aliasing, no soft upscale
  4,800 frame-map checks: all 1,200 entries in frames.json land inside their sheets,
  and every declared frame has a real file at both grid sizes
  2,664 asset slots checked: every asset present at one grid size is present at the other

The palette is 128 colours and it is closed: no pixel anywhere in the pack, at either grid, in any
state, sits outside it. The richest single frame carries 37 of them.

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
                  reviewed frame by frame)
  Sounds    no   (there are none)
  Text      no   (there is no narrative content)

Every character was opened at four facings and every animation cycle was reviewed frame by frame
before this pack shipped. The mechanical proof above is the part you do not have to take our word
for: run the numbers against the files you just downloaded.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
