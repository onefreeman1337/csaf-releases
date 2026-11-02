# Grindline: 149 Skateboard Sound Effects — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Grindline: 149 Skateboard Sound Effects  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-02


---

# Grindline: 149 Skateboard Sound Effects

**149 skateboard sound effects in WAV and OGG for any game engine: pushing off, the board rolling on 6 surfaces at 3 speeds as seamless loops, the ollie pop as a 5 step strength ladder, kickflips, heelflips and shove its, landings as a 5 step drop height ladder from a curb to a big gap, grinds on a square steel rail, a round handrail, a waxed concrete ledge, steel pipe coping and a painted curb, board slides, manuals, a wall ride, powerslides and the bail.**

Grindline is one skateboard, heard close and outdoors: a seven ply maple deck, two aluminium trucks on steel axles, four urethane wheels and griptape. It rolls on a concrete bowl, smooth concrete, a wooden ramp, slab pavement, rough asphalt and a steel plate ramp, and it grinds a square steel rail, a round handrail, a waxed concrete ledge, steel pipe coping and a painted curb.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio of any kind, and no generative audio model. There are no voices, grunts, callouts or crowds, and nothing here is musical.

---

## What is in the box

| | |
|---|---|
| Sounds | **149** |
| Formats | `.wav` (16 bit, 44.1 kHz, mono) **and** `.ogg` |
| Total files | 298 (149 wav + 149 ogg) |
| Seamless loops | 29, loop points written into every loop file |
| Rolling grid | 6 surfaces x 3 speeds |
| Ladders | 9 |
| Mechanisms with enter, loop and exit | 11 |
| Variation sets | 33 |
| Total audio | 1 min 58 s |
| Shortest / longest | 126 ms / 2.18 s |

## What the download contains

```
wav/                   149 files, 16 bit 44.1 kHz mono
ogg/                   149 files, Vorbis
Readme_for_Users.md    this file
NAMING_MANIFEST.md     every file, its group, take, measured duration and brightness
LICENSE.txt            the full licence
pack.json              the machine readable manifest (the grid, ladders, mechanisms, variation sets)
pack_proof.json        a sha256 and a full measurement record for every file
cross_pack_proof.json  the measurement that no file here is a transposed copy of a file in the studio's nearest packs
```

## Licence, the short version

**Royalty free. Commercial use. No attribution required.**

Use these sounds in any number of commercial and non commercial games, on any platform, forever. You may modify them freely.
The only thing you may not do is resell or redistribute the pack itself (or a repackaged subset of it) as a sound library or
asset pack.

Full terms in `LICENSE.txt`. If you would like to credit it anyway, this line is enough:

```
Sound effects: "Grindline: 149 Skateboard Sound Effects" by Core Systems Asset Factory
```

---

## The groups

| Group | Files |
|---|---|
| **Push and roll** | 44 |
| **Tricks** | 26 |
| **Landings** | 21 |
| **Grinds and slides** | 24 |
| **Manuals and wall rides** | 11 |
| **Bails and the board** | 23 |

## A run, start to finish

Step on with `step_on` and push off with `first_push`, then `push` for every kick after it. While the board moves, run one rolling loop by the surface under it and crossfade by speed: `roll_<surface>_slow_loop`, `roll_<surface>_cruise_loop` and `roll_<surface>_fast_loop`, where the surface is `bowl`, `concrete`, `wood`, `pavement`, `asphalt` and `metal`. Add `seam_tick` when the wheels cross a single crack. Turn with `carve` and `kickturn`, slow down with `powerslide`, `foot_brake` or `tail_stop`, and stop dead on `pebble_stop`.

Jump with `ollie_pop_1` to `ollie_pop_5` by how long the jump was charged, or `nollie_pop` off the nose. Spin the board with `kickflip`, `heelflip` or `shove_it`, or layer `flip_whoosh_1` to `flip_whoosh_4` by spin speed under any trick of your own; catch it with `board_catch`, and `grab` it in the air.

Land with `land_curb`, `land_stairs`, `land_ledge`, `land_gap` or `land_big_gap` by drop height, or by how it went: `land_clean`, `land_sketchy`, `land_primo` (on the board's edge) and `land_tail_drag`. In a park, `drop_in` off the coping, `land_transition` on a ramp and `revert` to come back around.

When it goes wrong: `bail_concrete`, `bail_wood` or `bail_metal` by surface, then `board_clatter`, `board_rollaway`, `board_hit` and `truck_rattle` for the board on its own, `wheels_land` when it drops back onto its wheels, and `board_pickup` to start again.

## Grinds and slides

Every grind and slide is three files: an enter one shot as the board locks on, a seamless loop to hold for as long as the grind lasts, and an exit one shot that leaves the obstacle and lands. Play the enter, start the loop under its tail, and play the exit when the player pops out.

| Mechanism | States |
|---|---|
| Grind: a square steel rail | `grind_rail_enter`, `grind_rail_loop`, `grind_rail_exit` |
| Grind: a round handrail | `grind_handrail_enter`, `grind_handrail_loop`, `grind_handrail_exit` |
| Grind: a waxed concrete ledge | `grind_ledge_enter`, `grind_ledge_loop`, `grind_ledge_exit` |
| Grind: steel pipe coping | `grind_coping_enter`, `grind_coping_loop`, `grind_coping_exit` |
| Grind: a painted curb | `grind_curb_enter`, `grind_curb_loop`, `grind_curb_exit` |
| Boardslide on the rail | `boardslide_rail_enter`, `boardslide_rail_loop`, `boardslide_rail_exit` |
| Noseslide on the ledge | `noseslide_ledge_enter`, `noseslide_ledge_loop`, `noseslide_ledge_exit` |
| Tailslide on the curb | `tailslide_curb_enter`, `tailslide_curb_loop`, `tailslide_curb_exit` |
| Manual | `manual_enter`, `manual_loop`, `manual_exit` |
| Nose manual | `nose_manual_enter`, `nose_manual_loop`, `nose_manual_exit` |
| Wall ride | `wallride_enter`, `wallride_loop`, `wallride_exit` |

**33** state pairs compared, each at least **9%** apart in brightness or **18%** in length; indistinct pairs: **0**. A filter on `<mechanism>_*` returns that mechanism's states and nothing else. `tail_scrape` is the tail touching down during a manual.

## The rolling grid

The board rolling is most of what a skate game sounds like, so it is a grid: every surface at every speed, 18 seamless loops.

| | slow | cruise | fast |
|---|---|---|---|
| A concrete bowl | `roll_bowl_slow_loop` 522 Hz | `roll_bowl_cruise_loop` 681 Hz | `roll_bowl_fast_loop` 896 Hz |
| Smooth concrete | `roll_concrete_slow_loop` 1785 Hz | `roll_concrete_cruise_loop` 2323 Hz | `roll_concrete_fast_loop` 2869 Hz |
| A wooden ramp | `roll_wood_slow_loop` 1044 Hz | `roll_wood_cruise_loop` 1343 Hz | `roll_wood_fast_loop` 1734 Hz |
| Slab pavement | `roll_pavement_slow_loop` 2413 Hz | `roll_pavement_cruise_loop` 3085 Hz | `roll_pavement_fast_loop` 3694 Hz |
| Rough asphalt | `roll_asphalt_slow_loop` 3491 Hz | `roll_asphalt_cruise_loop` 4417 Hz | `roll_asphalt_fast_loop` 5337 Hz |
| A steel plate ramp | `roll_metal_slow_loop` 1449 Hz | `roll_metal_cruise_loop` 1874 Hz | `roll_metal_fast_loop` 2440 Hz |

Each surface is its own recipe, never one loop filtered six ways, and the loops of one surface share one length and one structure, so you can crossfade between speeds without a jump. The gate compares every pair of cells along its row and its column (at least **9%** apart in brightness or **18%** in length): **63** pairs compared, indistinct: **0**.

## The ladders

Measured from the shipped files, so a game can wire the rung to a number it already has: the charge, the drop height, the spin speed, the board speed.

- **ollie_pop** (brightness): the tail snapping the ground at five strengths, each pop brighter than the last, so a game can wire the rung to how long the jump was charged. `ollie_pop_1` 2748 Hz < `ollie_pop_2` 3306 Hz < `ollie_pop_3` 3952 Hz < `ollie_pop_4` 4475 Hz < `ollie_pop_5` 5106 Hz
- **flip_whoosh** (brightness): the board spinning under the feet at four speeds, each whoosh brighter than the last. `flip_whoosh_1` 2547 Hz < `flip_whoosh_2` 3046 Hz < `flip_whoosh_3` 3639 Hz < `flip_whoosh_4` 4339 Hz
- **land** (length): five landings from a curb to a big gap, each one ringing and rattling on longer than the last, so a game can wire the rung to the drop height. `land_curb` 0.30 s < `land_stairs` 0.39 s < `land_ledge` 0.52 s < `land_gap` 0.68 s < `land_big_gap` 0.89 s
- **roll_bowl** (brightness): a concrete bowl at three speeds as seamless loops, each faster and brighter than the last. `roll_bowl_slow_loop` 522 Hz < `roll_bowl_cruise_loop` 681 Hz < `roll_bowl_fast_loop` 896 Hz
- **roll_concrete** (brightness): smooth concrete at three speeds as seamless loops, each faster and brighter than the last. `roll_concrete_slow_loop` 1785 Hz < `roll_concrete_cruise_loop` 2323 Hz < `roll_concrete_fast_loop` 2869 Hz
- **roll_wood** (brightness): a wooden ramp at three speeds as seamless loops, each faster and brighter than the last. `roll_wood_slow_loop` 1044 Hz < `roll_wood_cruise_loop` 1343 Hz < `roll_wood_fast_loop` 1734 Hz
- **roll_pavement** (brightness): slab pavement at three speeds as seamless loops, each faster and brighter than the last. `roll_pavement_slow_loop` 2413 Hz < `roll_pavement_cruise_loop` 3085 Hz < `roll_pavement_fast_loop` 3694 Hz
- **roll_asphalt** (brightness): rough asphalt at three speeds as seamless loops, each faster and brighter than the last. `roll_asphalt_slow_loop` 3491 Hz < `roll_asphalt_cruise_loop` 4417 Hz < `roll_asphalt_fast_loop` 5337 Hz
- **roll_metal** (brightness): a steel plate ramp at three speeds as seamless loops, each faster and brighter than the last. `roll_metal_slow_loop` 1449 Hz < `roll_metal_cruise_loop` 1874 Hz < `roll_metal_fast_loop` 2440 Hz

Every brightness step is at least **8%**, every length step at least **12%**, and every ladder at least **1.5x** end to end: **23** steps compared, failing steps: **0**.

## Loops

Only files named `_loop` loop, and the loop region is the **whole file**, written as `smpl` points in the `.wav` and as `LOOPSTART` and `LOOPLENGTH` tags in the `.ogg`.

`roll_bowl_slow_loop`, `roll_bowl_cruise_loop`, `roll_bowl_fast_loop`, `roll_concrete_slow_loop`, `roll_concrete_cruise_loop`, `roll_concrete_fast_loop`, `roll_wood_slow_loop`, `roll_wood_cruise_loop`, `roll_wood_fast_loop`, `roll_pavement_slow_loop`, `roll_pavement_cruise_loop`, `roll_pavement_fast_loop`, `roll_asphalt_slow_loop`, `roll_asphalt_cruise_loop`, `roll_asphalt_fast_loop`, `roll_metal_slow_loop`, `roll_metal_cruise_loop`, `roll_metal_fast_loop`, `grind_rail_loop`, `grind_handrail_loop`, `grind_ledge_loop`, `grind_coping_loop`, `grind_curb_loop`, `boardslide_rail_loop`, `noseslide_ledge_loop`, `tailslide_curb_loop`, `manual_loop`, `nose_manual_loop`, `wallride_loop`.

## Avoiding repetition

33 sounds ship as **variation sets**: separate renders, not copies of one file. A push comes 4 ways, a carve 4 ways, and every trick and landing has its own takes. Play a random member that did not play last. Measured across all 33 sets on the shipped files: brightness differs between takes by 10% to 39%, and length by 18% to 51%.

## One level

Every file is normalised to one loudness target. The measured inner loudness range (10th to 90th percentile) across all 149 files is
**1.04 dB**, so a seam tick and a bail need no gain riding.

A run fires a rolling loop under every trick, so leave headroom on your sound effects bus or put a limiter on it.

## Import notes

**Unity**: drop the `ogg` folder into `Assets/`. For a `_loop` file: Tick *Loop* on the `AudioSource`. Hold a variation set in an `AudioClip[]` and call `AudioSource.PlayOneShot(clip)`. Crossfade two `AudioSource`s for the rolling speeds.

**Unreal**: import the `wav` folder. For a `_loop` file: Tick *Looping* on the Sound Wave. Make a Sound Cue with a **Random** node over a variation set.

**Godot**: import the `wav` folder for the 29 `_loop` files; Godot reads their `smpl` loop points on import with default settings. The `.ogg` loops import with *Loop* off: select them, tick *Loop* in the Import dock (Loop Offset 0) and press *Reimport*. One shots import with *Loop* off. Put a variation set in an `AudioStreamRandomizer` (Godot 4).

**GameMaker**: import the `ogg` folder as sounds. For a `_loop` file: `audio_play_sound(snd, priority, true)`. Build a rung name with `"ollie_pop_" + string(n)` and resolve it with `asset_get_index`.

**RPG Maker MV / MZ**: use the `ogg` files. One shots go in `audio/se`; `_loop` files go in `audio/bgs`, and their loop tags are read by the engine.

**Web / HTML5**: use the `ogg` files. For a `_loop` file: `loop = true` on the `AudioBufferSourceNode`.

## Proof

`pack_proof.json` ships with the pack. It carries a **sha256 for every audio file** and the full measurement record (peak, RMS,
duration, spectral centroid, edge trim, loop seam) behind **1381 signal checks, 0 of which failed**. You can re hash any file and check
it against the proof.

`cross_pack_proof.json` is for owners of the studio's other packs: every file here was compared against every file in the 6 nearest
packs on our shelf (Tilt, Footfall, Kickoff, PitLane, Clamber, Haymaker: **265071** pairs) on spectral shape and on envelope, each tolerant of a transposition, and
**265071** of 265071 measure as separate sounds: no file here is one of theirs at another pitch.

## Honest limits

- These are **synthesised** sounds made in code: models of a maple deck, aluminium trucks, urethane wheels, steel, wood and concrete. They are not recordings of a skateboard and they do not reproduce any particular board, park or game.
- There are no voices, grunts, callouts, crowds or music, and no bike, scooter or roller skate sounds.
- The files are mono. Position them yourself; a board passing the camera is yours to pan.
- The proof files measure **signal**, not taste. They certify there is no measurable defect: no clipping, no silence, no abrupt
  edges, no broken loop, no ladder step out of order. They do not, and cannot, tell you the pack sounds good to you. Listen to the
  free demo first; that is what it is for.

---

*Core Systems Asset Factory · pack version 1.0.0 · 149 sounds · 1381 checks passed*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
