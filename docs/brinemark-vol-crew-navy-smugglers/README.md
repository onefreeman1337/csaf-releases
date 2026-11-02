# Brinemark: Pirate Crew, Crown Navy and Smugglers — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Brinemark: Pirate Crew, Crown Navy and Smugglers  
**Engine:** PixelLab API (REST, from Node) — engine-agnostic PNG/sheet output  
**Docs published:** 2026-11-02


---

BRINEMARK · Pirate Crew, Crown Navy and Smugglers
=================================================

Thirteen top-down sea-faring characters, combat-complete: idle, walk, attack, hurt and death in four directions.

WHAT IS IN THIS PACK
--------------------
Thirteen sea-faring characters of the Brinemark series in three casts, combat-complete. THE PIRATE
CREW: pirateCaptain, pirateGunner, quartermaster, deckhand. THE CROWN NAVY: admiral, navyMarine,
navyOfficer, powderHand. SMUGGLERS AND ISLANDERS: smuggler, fence, pearlDiver, harbourWitch,
castaway. Every one of them has:

  idle   1 frame x 4 directions (south, west, east, north), a still standing pose
  walk   6 frames x 4 directions (south, west, east, north), a looping walk
  attack 6 frames x 4 directions (south, west, east, north), a one-shot attack: melee, gunfire or the witch's lantern, per character
  hurt   6 frames x 4 directions (south, west, east, north), a one-shot flinch that returns to the standing pose
  death  6 frames x 4 directions (south, west, east, north), a one-shot fall that ends lying on the ground

That is 100 frames per character and 1,300 frames in the pack at each of 2 grid sizes: 160x160 and
80x80 pixels. The 160px frames are the master, drawn natively (nothing in them is upscaled); the
80px set is an exact 2:1 reduction of it, palette-locked, so it stays crisp. In the 160px cell the
south idles measure 114 to 124px tall; the cell is that large so attacks at full reach and deaths lying
flat fit without clipping.

  admiral       The navy admiral, with a silver pistol. Gunfire attack: raises his
                silver pistol at arm's length and fires, with a sharp recoil and a muzzle flash.
  castaway      A ragged castaway with a driftwood club. Melee attack: swings the
                driftwood club up to the shoulder and chops it down.
  deckhand      A young deckhand with a belaying pin. Melee attack: swings the
                belaying pin up to the shoulder and chops it down.
  fence         A fence of stolen goods, a gold fist. Melee attack: punches with the
                gold knuckle duster on his right fist.
  harbourWitch  A harbour witch with a glowing lantern. Lantern attack: holds her
                lantern out at waist height while its glass flares bright sea-green, then dims.
  navyMarine    A navy marine with a short musketoon. Gunfire attack: fires the
                musketoon from the waist, the gun jerking with one heavy recoil and a muzzle
                flash.
  navyOfficer   A navy lieutenant in white gloves. Melee attack: drives a
                white-gloved fist straight out and pulls it back, the other fist held up.
  pearlDiver    A pearl diver who fights with her fists. Melee attack: boxes: drives
                a fist straight out and pulls it back, the other fist held up.
  pirateCaptain The pirate captain, with a flintlock. Gunfire attack: raises his
                flintlock pistol at arm's length and fires, with a sharp recoil and a yellow
                muzzle flash.
  pirateGunner  A pirate gunner with a brass blunderbuss. Gunfire attack: brings the
                brass blunderbuss up and fires it with a large star-shaped muzzle flash.
  powderHand    A wiry navy powder hand who boxes. Melee attack: boxes: drives a
                fist straight out and pulls it back, the other fist held up.
  quartermaster The quartermaster, with an iron buckler. Melee attack: punches with
                her free right fist, the iron buckler kept on her left forearm.
  smuggler      A hooded, masked smuggler with a pistol. Gunfire attack: raises his
                flintlock pistol in his left hand and fires, with a sharp recoil and a muzzle
                flash.

THE FIRST BRINEMARK VOLUME, ON THE HEARTHHANDS BUILD
----------------------------------------------------
Brinemark is the people of the sea: this first volume is its fighting cast. It stands on the same
human build as Hearthhands 05: Harbour Hands, the working harbour villagers of the same coast. Every
character here was generated from the same standing-figure reference as those villagers, so they
share one scale: the south idles measure 114 to 124px tall here, against 117 to 124px for Harbour
Hands. The palette holds all 43 colours of the Hearthhands series palette, unchanged, plus 85 more
fitted to this cast (the crew's reds, the navy's blues and golds). Harbour Hands ships a 200px cell
and this volume a 160px cell; the characters are not rescaled, so place both at 1:1 and align them
on their feet.

HOW THE VIEWS WERE MADE (disclosed so you are not surprised)
-----------------------------------------------------------
South (front) and north (back) are generated art for every state. For the side views, one profile
was generated and the other is its exact horizontal mirror:

  The EAST attack is the generated WEST attack mirrored, pixel for pixel, for: harbourWitch, navyMarine, quartermaster, smuggler.
  The WEST attack is the generated EAST attack mirrored, pixel for pixel, for: admiral, castaway, deckhand, fence, navyOfficer, pearlDiver, pirateCaptain, pirateGunner, powderHand.
  The EAST death is the generated WEST death mirrored, pixel for pixel, for: harbourWitch, navyMarine, quartermaster, smuggler.
  The WEST death is the generated EAST death mirrored, pixel for pixel, for: admiral, castaway, deckhand, fence, navyOfficer, pearlDiver, pirateCaptain, pirateGunner, powderHand.
  The EAST hurt is the generated WEST hurt mirrored, pixel for pixel, for: harbourWitch, navyMarine, quartermaster, smuggler.
  The WEST hurt is the generated EAST hurt mirrored, pixel for pixel, for: admiral, castaway, deckhand, fence, navyOfficer, pearlDiver, pirateCaptain, pirateGunner, powderHand.
  The EAST idle is the generated WEST idle mirrored, pixel for pixel, for: harbourWitch, navyMarine, quartermaster, smuggler.
  The WEST idle is the generated EAST idle mirrored, pixel for pixel, for: admiral, castaway, deckhand, fence, navyOfficer, pearlDiver, pirateCaptain, pirateGunner, powderHand.
  The EAST walk is the generated WEST walk mirrored, pixel for pixel, for: harbourWitch, navyMarine, quartermaster, smuggler.
  The WEST walk is the generated EAST walk mirrored, pixel for pixel, for: admiral, castaway, deckhand, fence, navyOfficer, pearlDiver, pirateCaptain, pirateGunner, powderHand.

(Checked pixel for pixel at the 160px master; the 80px set is reduced from it facing by facing.)
Anything carried on one side therefore swaps sides between east and west in those cycles.

  * Attack, hurt and death are one-shots: every attack plays out once, every hurt returns to the
  standing pose, and every death ends on the ground.
  * Five characters attack with guns (the captain, the gunner, the admiral, the marine and the
  smuggler). Their muzzle flashes and the witch's lantern flare are drawn into the attack frames;
  there are no separate projectile sprites. Seen head-on, the gunner's large muzzle flash covers his
  face on the firing frame.
  * Some strikes do not hold their view. In profile, the powder hand and the pearl diver turn toward
  the camera on frames 2 to 4 of their attacks, and so does the quartermaster, whose buckler arm
  swings to the trailing side. Facing south, several free-fist fighters throw their punches to the
  side, and the pearl diver turns to a near-profile on frame 3.
  * In their side-view attacks the castaway and the deckhand strike with the empty far fist while
  the club or the belaying pin stays at their side, and the fence's gold cuff shows on his bare far
  wrist in his side-view attack and hurt.
  * A few props drop out of single cycles. The deckhand's belaying pin is gone in the last two
  frames of his back-view attack and the last frame of his side-view deaths, and lies across his
  legs at the end of his front death. The castaway's driftwood club becomes a plain brown stick from
  frame 3 of his back-view death. The smuggler's pistol passes from his near hand to his far hand on
  frames 2 and 3 of his side-view deaths and is gone in their last two frames; in his front death it
  shrinks to a small dark block under his hand. In the admiral's back-view death the pistol is
  hidden under him in the last frame.
  * The navy lieutenant's front walk draws him with an open mouth and a slightly longer face than
  his standing pose.
  * From behind, some details are simplified: the admiral's white sash and the marine's gold armband
  do not show, the back of the marine's head under his cap can read as a face at small sizes, the
  captain's pistol reads as a short black grip, the gunner's blunderbuss is hidden in front of him
  while he walks away, the quartermaster's hat reads rounder than a tricorn, and the deckhand's
  cross-body strap does not match its front.
  * In two deaths a hair tail stands up stiffly: the gunner's black queue on frames 2 to 4 of his
  front death, and the quartermaster's red braid in the last frame of hers.
  * The harbour witch's lantern glass is partly see-through on frames 4 and 5 of her front walk.

FOLDERS
-------
  160x160/frames/       1,300 individual PNGs, one animation frame each
  80x80/frames/         1,300 individual PNGs, one animation frame each
  160x160/sheets/       65 sheets, one per character per state
  80x80/sheets/         65 sheets, one per character per state
  frames.json           every frame's sheet, x, y, w, h at the 160px grid
  pack.json             the manifest: palette, grids, characters, states, which states are one-shots
  rpgmaker_mz/          26 RPG Maker MZ character sheets ($-prefixed, 3x4 walk, both grids)
  engine_import/godot/  158 files: 26 Godot 4 SpriteFrames resources (.tres) with their sheets

SHEET LAYOUT
------------
Columns are the animation frame index, 0..n-1. Rows are south / west / east / north, RPG Maker
character-sheet order. Every sheet has four rows. frames.json gives every frame's exact rectangle,
so nothing has to be counted by hand.

RPG MAKER MZ
------------
Drop the contents of rpgmaker_mz/160x160/ (or 80x80/) into img/characters/. The files are
$-prefixed, so MZ treats each one as a single 3x4 character sheet and the walk plays down / left /
right / up out of the box. The attack, hurt and death sheets are in 160x160/sheets/ and
80x80/sheets/ for your own battle or event animations.

GODOT 4
-------
Copy an engine_import/godot/<grid>/ folder anywhere in your project and load a .tres. Each one is a
SpriteFrames with that character's animations already named (idle_south, walk_west, attack_east,
death_north and so on), regions sliced and fps set; attack, hurt, death do not loop. The texture
paths are RELATIVE, so the folder works wherever you put it. Both grids were loaded in Godot 4.7.2
before shipping and the engine built every declared frame: 1,300 per grid, every one a real
AtlasTexture, every region exact.

THE CONSISTENCY PROOF
---------------------
Every figure below was re-derived from the shipped files by `node Kernel/sprites/pack_proof.js`
immediately before this file was written, not typed from a previous build:

  2,886 files are real PNGs, not renamed JPEGs
  2,886 files decode to real pixels
  2,886 files are exactly one cell, or a whole multiple of it
  14,944,764 opaque pixels, every one of them inside the declared 128-colour palette
  129,792,000 pixels carry strictly binary alpha: no anti-aliasing, no soft upscale
  5,200 frame-map checks: all 1,300 entries in frames.json land inside their sheets,
  and every declared frame has a real file at both grid sizes
  2,886 asset slots checked: every asset present at one grid size is present at the other

The palette is 128 colours and it is closed: no pixel anywhere in the pack, at either grid, in any
state, sits outside it. The richest single frame carries 47 of them.

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
