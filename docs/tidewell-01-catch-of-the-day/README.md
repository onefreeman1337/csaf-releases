# Tidewell: 48 Fish and Water Creatures, Animated (Freshwater, Sea, Deep, Rare) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Tidewell: 48 Fish and Water Creatures, Animated (Freshwater, Sea, Deep, Rare)  
**Engine:** PixelLab API (REST, from Node) — engine-agnostic PNG/sheet output  
**Docs published:** 2026-11-01


---

# Tidewell: 48 Fish and Water Creatures [64x64]

Tidewell is 48 animated pixel-art fish and water creatures at 64x64 for any 2D engine, with Godot 4 SpriteFrames included and GameMaker-ready strips. Every creature has a still (use it as the inventory or catch-log icon), a 6-frame swim loop and a 6-frame catch animation, sorted into four habitats with a ready catch table. Commercial use is allowed and credit is not required.

## What is inside

- **48 creatures**, all facing right, one 64x64 cell each:
  - Freshwater (13): Rainbow Trout, Common Carp, Channel Catfish, Northern Pike, Largemouth Bass, Yellow Perch, Atlantic Salmon, Bluegill, Freshwater Eel, Crayfish, Piranha, Sturgeon, Goldfish
  - Sea (15): Atlantic Cod, Mackerel, Bluefin Tuna, Red Snapper, Pufferfish, Swordfish, Flounder, Clownfish, Octopus, Blue Crab, Seahorse, Lobster, Shrimp, Reef Shark, Lionfish
  - Deep (11): Anglerfish, Gulper Eel, Lanternfish, Oarfish, Giant Squid, Viperfish, Hatchetfish, Moon Jellyfish, Giant Isopod, Blobfish, Coelacanth
  - Rare (9): Golden Koi, Ocean Sunfish, Leafy Sea Dragon, Ghostfin, Ember Eel, Frost Pike, Starfin, Crystal Carp, Sea Serpent Hatchling
- **624 frame PNGs** in `64x64/frames/`, named `<creature>_<animation>_east_<frame>.png` (idle 1 frame, swim 6, catch 6).
- **144 strips** in `64x64/sheets/`, one row per animation, named `<creature>_<animation>_east_strip<frames>.png`.
- **48 Godot 4 SpriteFrames** in `engine_import/godot/64x64/` (animations `idle_east`, `swim_east`, `catch_east`; swim plays at 8 fps and catch at 10 fps, both looping).
- **tidewell_catalogue.csv** and **tidewell_catalogue.json**: name, habitat, rarity (common 17, uncommon 14, rare 8, legendary 9), a real-world length class, a suggested coin value and the file names, for a fishing or aquarium game's catch table.
- **pack.json** and **frames.json**: the manifest and every frame's sheet, x, y, w and h.

## Use it

- **Godot 4**: copy `engine_import/godot/64x64/` into your project, add an AnimatedSprite2D, set its Sprite Frames to `<creature>.tres` and play `swim_east`. Set Texture Filter to Nearest so the pixels stay sharp.
- **GameMaker**: import a strip with Create Sprite From Strip; the `_strip6` suffix gives the frame count. Each frame is 64x64.
- **Unity, Defold, LÖVE, Phaser and the rest**: slice any strip into 64x64 cells, or load the frame PNGs. Use point filtering.
- **Facing left**: flip the sprite horizontally in your engine (Godot: flip_h; GameMaker: image_xscale = -1).
- **Scale**: every creature fills its cell, the way catch-log icons do, so a shrimp and a shark are drawn the same size. The catalogue's length class (tiny, small, medium, large, huge) tells you how big each one is in the world, so you can scale them in your scene.

## The consistency proof (measured on these files)

- Every opaque pixel of all 912 shipped images is one of the **128 colours** in `pack.json → palette`.
- Every frame is exactly 64x64; every strip is a whole number of cells; alpha is strictly on or off (no anti-aliasing).
- 624 frames measured for alignment and loose parts: 0 unaccepted defects. 43 were accepted after a look, each with a written reason: the catch animations move the crown on purpose (a landed creature arches and lifts), the jellyfish and sea dragon bob as they swim, and the jellyfish's thin tentacle strands drift as loose pieces.

## How it was made (AI disclosure)

The creatures were generated with an AI pixel-art model (PixelLab) from written descriptions, in three batches that share one style, then processed, checked and looked at frame by frame by us.

- **39 creatures are animated from their own still**: the swim and the catch move the still's pixels by whole pixels (a tail beat at the tail fin, a body wave for eels and long-finned fish, a fin scull for the ocean sunfish, a landed flop or thrash). No pixel is redrawn or recoloured, so the creature cannot change between frames.
- **9 creatures are animated by PixelLab's animation model**: Crayfish, Octopus, Blue Crab, Giant Squid, Moon Jellyfish, Giant Isopod, Leafy Sea Dragon, Seahorse, Lobster. Those frames are newly drawn, so their legs, claws and tentacles really move; each was opened frame by frame, and 14 stray yellow pixels the model painted near the Giant Squid's tentacles in three catch frames were removed.
- All frames were then mapped onto one 128-colour palette.

## Honest limits

- One size: 64x64. A 32x32 version was built by halving and looked at, and it was not good enough to sell (the lionfish, crayfish and lobster turned to noise), so it is not included.
- The swim loops of the whole-pixel creatures are gentle: the tail fin beats and the body lifts by one pixel. The creature does not travel; move it in your game.
- The Ocean Sunfish fills its cell top to bottom, so it swims with its fins only and its catch rocks it side to side.
- The Moon Jellyfish's thin tentacles are drawn as broken strands, and a strand piece can drift loose for a frame.
- Several fish share a body shape (a trout and a salmon, two pikes); they are told apart by colour and markings, like real fish.

## Licence

See LICENSE.txt. Commercial and non-commercial use, no credit required. You may not resell or redistribute the art itself as an asset pack.

Made by Core Systems Asset Factory. More packs: https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
