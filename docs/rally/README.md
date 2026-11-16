# Rally — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Rally  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-16


---

# Rally v1.0.0 for RPG Maker MZ

By Core Systems Asset Factory (https://csaf.itch.io).

Walking sprites become real side-view battlers. Three parts, 6 plugin files: your party fights in MZ's own side-view
battle on sheets built from their walking sprites, any character sheet fights as an enemy, and the same combat poses
play on the map. No side-view art to draw. Use one part, any two, or all three: each part works alone, and all three
were tested on together.

| Part | What it does in your game | Files |
| --- | --- | --- |
| **Rally Actors** | Any actor with a walking sheet and no SV battler image fights in side view: a full 9 x 6 battler sheet built at the start of a battle, all **18 motions**, 3 frames each, with the equipped weapon drawn in (12 weapon forms plus bare hands). | `RallyActors.js` + the three cores |
| **Rally Foes** | Tag an enemy with a character sheet (`<rally: Evil, 0>`) and it stands in the troop facing the party with the same 18 motions, built from the sheet's own right-facing row. It walks in, steps forward on its turn, recoils, kneels, falls and cheers. | `RallyFoes.js` + the three cores |
| **Rally Field** | One plugin command makes any character on the map strike a combat pose in the direction it faces: **13 poses in all four facings**, for cutscenes, duels and on-map fights. | `RallyField.js` + the three cores |

The three cores are shared by all three parts: `PostureCore.js`, `KnackCore.js` and `RallyCore.js` (version 1.2.0).
This download carries one copy of each.

## Install

1. Copy every file in this download's `js/plugins/` folder into your project's `js/plugins/` folder.
2. Open the Plugin Manager and turn ON the three cores and the part or parts you want. Any order works; this order
   reads best: PostureCore, KnackCore, RallyCore, then RallyActors, RallyFoes, RallyField.
3. For Rally Actors and Rally Foes the battle must be side view: Database > System 1 > Battle Screen > Side-view.
4. Start each part as its guide says: Rally Actors needs nothing (actors with no SV battler image are built
   automatically); Rally Foes needs a `<rally: File, index>` tag on an enemy; Rally Field needs the **Pose** plugin
   command on an event.

Every part's full guide (parameters, note tags, plugin commands, limits) is in the `Guides/` folder:
`Guides/Rally_Actors.md`, `Guides/Rally_Foes.md`, `Guides/Rally_Field.md`.

## Using the three together

Measured in the engine with all 6 files ON, in a blank RPG Maker MZ project on MZ's own database:

- **Both sides of a battle come from walking sheets.** With Rally Actors set to Every actor and the stock Goblin
  tagged as a Rally foe, the whole party and the whole troop fight on Rally sheets in one side-view battle, and real
  turns run to a win with both sides playing their action's motion.
- **The same drawing on the map and in battle.** A hero's Pose on the map, facing left, is cell for cell the same
  pixels as that hero's battle sheet in Rally Actors (all 13 poses, 3 drawings each); facing right, it is the same
  figure, pixel for pixel, as that sheet fighting as a Rally foe, which adds only its ground shadow under the feet.
- **One save carries all three parts,** including a map pose in progress, and it still loads with any one part
  turned off afterwards.
- **Plugin order does not change the result:** the same checks pass with the files in alphabetical order, in
  reverse order and in a shuffled order.
- Two engine methods are extended by both Rally Actors and Rally Foes (`Scene_Battle.prototype.create` and
  `Scene_Battle.prototype.terminate`). Each part calls the original it saved, so both parts' additions run.

## Compatibility

- RPG Maker MZ 1.x. Tested on the MZ 1.10.0 runtime.
- Each part's guide lists its own limits. In short: Rally Actors and Rally Foes work in MZ's own side-view battle;
  VisuStella's Battle Core replaces MZ's side-view motion handling with its own, and Rally was not tested with it.
  Rally Field works on any map.
- Tested with only these plugins loaded. No VisuStella plugin was loaded in these tests.
- No part loads an image, a font or a sound file: every frame is built in code from your own project's walking
  sprites, and the weapons are drawn in code.
- The characters, fields and courtyard in the store images are CSAF test art and are **not included**. Every part
  builds from **your** sprites.
- If you also own Posture, Knack or one of the Rally parts on its own: keep ONE copy of each core file. The cores in
  this download are the same files, byte for byte.

## Versions

Rally Actors 1.0.2, Rally Foes 1.0.1, Rally Field 1.0.0, RallyCore 1.2.0.

## Already own the MZ Plugin Library?

All three parts are also inside the MZ Plugin Library (https://csaf.itch.io/mz-plugin-library), byte for byte the
same files. If you own the Library, you already have Rally.

## Licence

See `LICENSE.txt`. Every line of code was written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
