# Stride — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Stride  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-17


---

# Stride v1.0.0 for RPG Maker MZ

By Core Systems Asset Factory (https://csaf.itch.io).

The three things a walking sprite cannot do, drawn from each character's own walking sheet. Three parts, 8 plugin
files: a real run cycle when the player dashes, idles when a character stands still, and gaits the game switches
by itself (a limp at low HP, a tired trudge, a sneak, wading, a tucked jump and a landing). No new art to draw.
Use one part, any two, or all three: each part works alone, and all three were tested together.

| Part | What it does in your game | Files |
| --- | --- | --- |
| **Stride Run** | While the player dashes, the hero and the followers run instead of walking faster: **6 drawings in each of the 4 facings**, a long stride, a lean into the run and arms pumping, from each character's own walking sheet. Tag an event to make it run too. | `StrideRun.js` + the three cores |
| **Stride Idle** | A character that stands still breathes, blinks, shifts its weight, glances around, sets its hands on its hips and dozes: **9 drawings in each of the 4 facings**, each character on its own rhythm so a crowd never breathes in step. | `StrideIdleCore.js` + `StrideIdle.js` + the three cores |
| **Stride Gaits** | **5 gaits the game switches by itself**: a limp at low HP, a tired trudge (Poison by default), a crouched sneak (Hide by default), wading on the tiles you mark, and a tucked jump with a landing. **14 drawings in each of the 4 facings.** | `StrideGaitsCore.js` + `StrideGaits.js` + the three cores |

The three cores are shared by all three parts: `PostureCore.js`, `KnackCore.js` and `StrideCore.js` (version 1.0.0).
This download carries one copy of each.

## Install

1. Copy every file in this download's `js/plugins/` folder into your project's `js/plugins/` folder.
2. Open the Plugin Manager and turn ON the three cores and the part or parts you want. Any order works; this order
   reads best: PostureCore, KnackCore, StrideCore, StrideRun, StrideIdleCore, StrideIdle, StrideGaitsCore,
   StrideGaits. (Stride Idle needs `StrideIdleCore.js`; Stride Gaits needs `StrideGaitsCore.js`.)
3. Nothing else is needed to start: the run plays when the player dashes, the idles play when a character stands
   still, and the limp, tired, sneak and jump gaits switch on from HP, states and jumps. Wading waits until you mark
   your shallow water with a region id or a terrain tag (Stride Gaits' Wade parameters).

Every part's full guide (parameters, note tags, plugin commands, limits) is in the `Guides/` folder:
`Guides/Stride_Run.md`, `Guides/Stride_Idle.md`, `Guides/Stride_Gaits.md`.

## Using the three together

Measured in the engine with all 8 files ON at their default parameters, in a blank RPG Maker MZ project on MZ's own
database, map and hero:

- **One character, three parts, no conflict.** Standing still the stock hero idles; holding the dash key he runs on
  his run drawings; let go, he walks and then idles again. Hit down to low HP he limps, and holding the dash key he
  still limps (No dashing in a gait), then, healed, he runs again.
- **Who wins when two parts apply:** a limping character standing still idles (its standing drawing is the plain
  one); a tired (poisoned) follower keeps its tired drawing while it stands instead of breathing upright; a jump
  shows the tuck, then the landing.
- **One save carries all three parts,** and it still loads with any one part turned off afterwards: the map runs and
  the remaining parts still draw.
- **Plugin order does not change the result:** the same checks pass with the files in the order above, in reverse
  order and in a shuffled order.
- Eight engine methods are extended by all three parts (the character sprite's bitmap, frame and size methods,
  `Game_CharacterBase.prototype.update` and the balloon position). Each part saves the original and calls
  it, so every part's addition runs; Stride Gaits also wraps Stride Idle's own idle-frame method so that a gait
  holds while a character stands.

## Compatibility

- RPG Maker MZ 1.x. Tested on the MZ 1.10.0 runtime.
- Each part's guide lists its own limits. In short: Stride Run was tested with MZ's own dash, not with VisuStella
  Events & Movement Core's dash or other dash plugins; no part was tested with VisuStella's own sprite changes or
  with other plugins that swap walking sheets. If another plugin replaces a character's sheet, the plugin that swaps
  last wins and Stride steps aside for that frame.
- Tested with only these plugins loaded. No VisuStella plugin was loaded in these tests.
- No part loads an image, a font or a sound file: every drawing is built in code from your own project's walking
  sprites, once per character, and cached.
- The characters and grounds in the store images are CSAF test art and are **not included**. Every part builds from
  **your** sprites.
- If you also own Posture, Knack, Rally or one of the Stride parts on its own: keep ONE copy of each core file. The
  cores in this download are the same files, byte for byte.

## Versions

Stride Run 1.0.0, Stride Idle 1.0.0, Stride Gaits 1.0.0, StrideCore 1.0.0.

## Already own the MZ Plugin Library?

All three parts are also inside the MZ Plugin Library (https://csaf.itch.io/mz-plugin-library), byte for byte the
same files. If you own the Library, you already have Stride.

## Licence

See `LICENSE.txt`. Every line of code was written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
