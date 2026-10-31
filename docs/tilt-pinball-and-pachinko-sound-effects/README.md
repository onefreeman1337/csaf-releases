# Tilt: 150 Pinball and Pachinko Sound Effects — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Tilt: 150 Pinball and Pachinko Sound Effects  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-10-31


---

# Tilt: 184 Pinball and Pachinko Sound Effects

**184 pinball and pachinko sound effects in WAV and OGG for any game engine: both flippers firing, held and dropping, pop bumpers in three voices, slingshots, drop targets and their bank reset, the spinner, the plunger by pull strength, the ball rolling on wood, plastic and steel wire at three speeds as seamless loops, the drain, ball saver, multiball, tilt, the replay knocker and score chimes, peg hits in glass, brass and stone as 10 step ladders for peg boards, and a pachinko machine with its falling balls, tulips and payout.**

Tilt is one wooden table and one pachinko machine, heard close. A steel ball on a plywood playfield inside a wooden cabinet: coils firing into steel stops, rubber rings, plastic caps and ramps, steel wire rails, and tubular score chimes. The pachinko machine is the other cabinet: tiny steel balls over brass nails behind glass.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio of any kind, and no generative audio model. There are no voices or callouts. Nothing here is musical: there are no jingles, attract mode tunes or fanfares; a chime file is one strike of one rod.

---

## What is in the box

| | |
|---|---|
| Sounds | **184** |
| Formats | `.wav` (16 bit, 44.1 kHz, mono) **and** `.ogg` |
| Total files | 368 (184 wav + 184 ogg) |
| Seamless loops | 24, loop points written into every loop file |
| Ladders | 14 |
| Mechanisms with every state | 10 |
| Rolling grid | 3 surfaces x 3 speeds |
| Variation sets | 36 |
| Total audio | 1 min 54 s |
| Shortest / longest | 75 ms / 4.00 s |

## What the download contains

```
wav/                   184 files, 16 bit 44.1 kHz mono
ogg/                   184 files, Vorbis
Readme_for_Users.md    this file
NAMING_MANIFEST.md     every file, its group, take, measured duration and brightness
LICENSE.txt            the full licence
pack.json              the machine readable manifest (ladders, mechanisms, the grid, variation sets)
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
Sound effects: "Tilt: 184 Pinball and Pachinko Sound Effects" by Core Systems Asset Factory
```

---

## The groups

| Group | Files |
|---|---|
| **Flippers** | 16 |
| **Bumpers and targets** | 34 |
| **Ball handling** | 28 |
| **The ball rolling** | 15 |
| **Machine state** | 29 |
| **Peg boards** | 42 |
| **The pachinko machine** | 20 |

## A ball in play, start to finish

Coin up with `coin_in` and start with `game_start`. Serve the ball with `ball_serve`, pull with `plunger_pull`, and let go with `launch_1` to `launch_4` by how far it was pulled.
While the ball moves, run one rolling loop by surface and crossfade by speed: `roll_wood_*`, `roll_plastic_*` or `roll_wire_*`, with `ramp_enter`, `ramp_exit`, `wire_enter` and `wire_exit` at the joins, and `ball_drop` when it lands.
Fire `flipper_left_up` or `flipper_right_up` on the button, loop `flipper_left_hold_loop` or `flipper_right_hold_loop` while it is held, and play the matching `flipper_left_down` or `flipper_right_down` on release. When the bat meets the ball, add `flipper_shot_1` to `flipper_shot_4` by ball speed.
Hits are `pop_bumper_deep`, `pop_bumper_mid`, `pop_bumper_bright`, `slingshot_left`, `slingshot_right`, `standup_target`, `rubber_post`, `rollover_switch`, `gate_flip` and `spinner_1` to `spinner_5` by how hard it was hit. A bank goes `drop_target_hit`, `drop_target_last`, `drop_target_reset`.
Holes are `saucer_catch`, `saucer_eject`, `up_kicker`, `kickback`, `ball_lock_catch`, `ball_lock_release` and `multiball_release`. Two balls meeting is `ball_clack`; a ball hitting the glass is `glass_hit`.
It ends with `drain_outlane` or `drain_center`, or `ball_save` if your timer says so. Score with `chime_10`, `chime_100`, `chime_1000`, `score_reel_step` and `score_reel_run_loop`, count the bonus with `bonus_count_slow_loop`, `bonus_count_medium_loop` or `bonus_count_fast_loop`, pay a replay with `knocker`, and finish with `match_wheel` and `game_over`. A shove is `nudge`, and too many of them are `tilt_warning`, `tilt_trip` and `tilt_reset`. `cabinet_hum_loop` and `attract_relays_loop` run underneath.

## A peg board

Aim with `aim_tick`, fire with `cannon_fire`. Each hit in the shot plays the next step of one ladder: peg 1 of the shot is `peg_glass_hit1`, peg 10 and every peg after it is `peg_glass_hit10`. Swap `glass` for `brass` or `stone` by board. A cleared peg is `peg_pop`, a special one is `bonus_peg`, a ball in the bucket is `bucket_catch`, an extra ball is `free_ball`, and the end of a board is `board_clear`.

## A pachinko machine

`launcher_run_loop` runs while the handle is held, or fire single shots with `pachinko_launch`. Balls over the nails are `nail_hit` one at a time, or `ball_stream_light_loop`, `ball_stream_medium_loop` and `ball_stream_heavy_loop` for a full board. A ball in the start pocket is `start_pocket`. Open and close the tulip with `tulip_open` and `tulip_close`, and the big gate with `attacker_open` and `attacker_close`. Pay out with `payout_small_loop`, `payout_medium_loop` or `payout_large_loop`, and end on `tray_settle`.

## The rolling grid

The ball rolling is what a table is made of, so it is a grid: every surface at every speed, 9 seamless loops.

| | slow | medium | fast |
|---|---|---|---|
| The wood playfield | `roll_wood_slow_loop` 859 Hz | `roll_wood_medium_loop` 1074 Hz | `roll_wood_fast_loop` 1414 Hz |
| A plastic ramp | `roll_plastic_slow_loop` 1793 Hz | `roll_plastic_medium_loop` 2213 Hz | `roll_plastic_fast_loop` 2797 Hz |
| A steel wireform | `roll_wire_slow_loop` 4114 Hz | `roll_wire_medium_loop` 5022 Hz | `roll_wire_fast_loop` 6304 Hz |

Each surface is its own recipe, never one loop filtered three ways, and the loops of one surface share one length and one structure, so you can crossfade between speeds without a jump. The gate compares every pair of cells along its row and its column (at least **9%** apart in brightness or **18%** in length): **18** pairs compared, indistinct: **0**.

## The ladders

Measured from the shipped files, so a game can wire the rung to a number it already has.

- **flipper_shot** (brightness): the flipper bat meeting the ball at four strengths, each hit brighter than the last, so a game can wire the rung to the ball speed. `flipper_shot_1` 660 Hz < `flipper_shot_2` 793 Hz < `flipper_shot_3` 957 Hz < `flipper_shot_4` 1166 Hz
- **pop_bumper** (brightness): three pop bumper voices from deep to bright, so three bumpers in a cluster do not read as one. `pop_bumper_deep` 494 Hz < `pop_bumper_mid` 644 Hz < `pop_bumper_bright` 885 Hz
- **spinner** (length): the spinner hit five ways, from a tap to a full speed pass, each spinning on longer than the last. `spinner_1` 0.23 s < `spinner_2` 0.30 s < `spinner_3` 0.51 s < `spinner_4` 0.71 s < `spinner_5` 1.06 s
- **launch** (brightness): the plunger let go at four pull strengths, each launch brighter than the last. `launch_1` 1766 Hz < `launch_2` 2107 Hz < `launch_3` 2503 Hz < `launch_4` 2968 Hz
- **roll_wood** (brightness): the wood playfield at three speeds as seamless loops, each faster and brighter than the last. `roll_wood_slow_loop` 859 Hz < `roll_wood_medium_loop` 1074 Hz < `roll_wood_fast_loop` 1414 Hz
- **roll_plastic** (brightness): a plastic ramp at three speeds as seamless loops, each faster and brighter than the last. `roll_plastic_slow_loop` 1793 Hz < `roll_plastic_medium_loop` 2213 Hz < `roll_plastic_fast_loop` 2797 Hz
- **roll_wire** (brightness): a steel wireform at three speeds as seamless loops, each faster and brighter than the last. `roll_wire_slow_loop` 4114 Hz < `roll_wire_medium_loop` 5022 Hz < `roll_wire_fast_loop` 6304 Hz
- **chime** (brightness): three score chimes, one rod to a file, for the thousands, the hundreds and the tens. `chime_1000` 1434 Hz < `chime_100` 2040 Hz < `chime_10` 2913 Hz
- **bonus_count** (brightness): the bonus counting down at three speeds as seamless loops, each faster and brighter than the last. `bonus_count_slow_loop` 2607 Hz < `bonus_count_medium_loop` 3459 Hz < `bonus_count_fast_loop` 4765 Hz
- **peg_glass** (brightness): glass pegs as a ten step ladder, one file per hit in a shot, each step brighter than the last. `peg_glass_hit1` 1762 Hz < `peg_glass_hit2` 2001 Hz < `peg_glass_hit3` 2262 Hz < `peg_glass_hit4` 2586 Hz < `peg_glass_hit5` 2923 Hz < `peg_glass_hit6` 3317 Hz < `peg_glass_hit7` 3754 Hz < `peg_glass_hit8` 4262 Hz < `peg_glass_hit9` 4846 Hz < `peg_glass_hit10` 5491 Hz
- **peg_brass** (brightness): brass pegs as a ten step ladder, one file per hit in a shot, each step brighter than the last. `peg_brass_hit1` 803 Hz < `peg_brass_hit2` 910 Hz < `peg_brass_hit3` 1037 Hz < `peg_brass_hit4` 1170 Hz < `peg_brass_hit5` 1329 Hz < `peg_brass_hit6` 1515 Hz < `peg_brass_hit7` 1714 Hz < `peg_brass_hit8` 1942 Hz < `peg_brass_hit9` 2196 Hz < `peg_brass_hit10` 2489 Hz
- **peg_stone** (brightness): stone pegs as a ten step ladder, one file per hit in a shot, each step brighter than the last. `peg_stone_hit1` 436 Hz < `peg_stone_hit2` 491 Hz < `peg_stone_hit3` 559 Hz < `peg_stone_hit4` 632 Hz < `peg_stone_hit5` 717 Hz < `peg_stone_hit6` 811 Hz < `peg_stone_hit7` 921 Hz < `peg_stone_hit8` 1039 Hz < `peg_stone_hit9` 1183 Hz < `peg_stone_hit10` 1328 Hz
- **ball_stream** (brightness): balls falling over the nails as three seamless loops, from a few to a full board, each brighter than the last. `ball_stream_light_loop` 4227 Hz < `ball_stream_medium_loop` 5329 Hz < `ball_stream_heavy_loop` 6834 Hz
- **payout** (brightness): balls pouring into the tray as three seamless loops, from a small win to a large one, each brighter than the last. `payout_small_loop` 3116 Hz < `payout_medium_loop` 3928 Hz < `payout_large_loop` 4854 Hz

Every brightness step is at least **8%**, every length step at least **12%**, and every ladder at least **1.5x** end to end: **53** steps compared, failing steps: **0**.

The peg ladders rise by one fixed ratio per step that is no musical interval, so they are a climb and not a scale. If your game wants a melody on its peg hits, that is yours to write; this pack does not carry one.

## The mechanisms

| Mechanism | States |
|---|---|
| Left flipper | `flipper_left_up_01..03`, `flipper_left_hold_loop`, `flipper_left_down_01..02` |
| Right flipper | `flipper_right_up_01..03`, `flipper_right_hold_loop`, `flipper_right_down_01..02` |
| Drop target bank | `drop_target_hit_01..03`, `drop_target_last`, `drop_target_reset` |
| Saucer | `saucer_catch`, `saucer_eject` |
| Ball lock | `ball_lock_catch`, `ball_lock_release` |
| Plunger | `plunger_pull`, `plunger_rest` |
| Tilt | `tilt_warning`, `tilt_trip`, `tilt_reset` |
| Game cycle | `game_start`, `game_over` |
| Tulip | `tulip_open`, `tulip_close` |
| Attacker | `attacker_open`, `attacker_close` |

**18** state pairs compared, each at least **9%** apart in brightness or **18%** in length; indistinct pairs: **0**. A filter on `<mechanism>_*` returns that mechanism's states and nothing else.

## Loops

Only files named `_loop` loop, and the loop region is the **whole file**, written as `smpl` points in the `.wav` and as `LOOPSTART` and `LOOPLENGTH` tags in the `.ogg`.

`flipper_left_hold_loop`, `flipper_right_hold_loop`, `roll_wood_slow_loop`, `roll_wood_medium_loop`, `roll_wood_fast_loop`, `roll_plastic_slow_loop`, `roll_plastic_medium_loop`, `roll_plastic_fast_loop`, `roll_wire_slow_loop`, `roll_wire_medium_loop`, `roll_wire_fast_loop`, `score_reel_run_loop`, `bonus_count_slow_loop`, `bonus_count_medium_loop`, `bonus_count_fast_loop`, `cabinet_hum_loop`, `attract_relays_loop`, `ball_stream_light_loop`, `ball_stream_medium_loop`, `ball_stream_heavy_loop`, `launcher_run_loop`, `payout_small_loop`, `payout_medium_loop`, `payout_large_loop`.

## Avoiding repetition

36 sounds ship as **variation sets**: separate renders, not copies of one file. Flippers go up 3 ways, the bumpers each have 3 takes, and two balls clack 4 ways. Play a random member that did not play last. Measured across all 36 sets on the shipped files: brightness differs between takes by 5% to 103%, and length by 11% to 54%. A chime set stays one rod: its takes move how hard the rod is struck, not its pitch.

## One level

Every file is normalised to one loudness target. The measured inner loudness range (10th to 90th percentile) across all 184 files is
**1.49 dB**, so a rollover tick and the knocker need no gain riding.

A table fires many sounds at once, so leave headroom on your sound effects bus or put a limiter on it.

## Import notes

**Unity**: drop the `ogg` folder into `Assets/`. For a `_loop` file: Tick *Loop* on the `AudioSource`. Hold a variation set in an `AudioClip[]` and call `AudioSource.PlayOneShot(clip)`.

**Unreal**: import the `wav` folder. For a `_loop` file: Tick *Looping* on the Sound Wave. Make a Sound Cue with a **Random** node over a variation set.

**Godot**: import the `wav` folder for the 24 `_loop` files; Godot reads their `smpl` loop points on import with default settings. The `.ogg` loops import with *Loop* off: select them, tick *Loop* in the Import dock (Loop Offset 0) and press *Reimport*. One shots import with *Loop* off. Put a variation set in an `AudioStreamRandomizer` (Godot 4).

**GameMaker**: import the `ogg` folder as sounds. For a `_loop` file: `audio_play_sound(snd, priority, true)`. Build a rung name with `"peg_glass_hit" + string(n)` and resolve it with `asset_get_index`.

**RPG Maker MV / MZ**: use the `ogg` files. One shots go in `audio/se`; `_loop` files go in `audio/bgs`, and their loop tags are read by the engine.

**Web / HTML5**: use the `ogg` files. For a `_loop` file: `loop = true` on the `AudioBufferSourceNode`.

## Proof

`pack_proof.json` ships with the pack. It carries a **sha256 for every audio file** and the full measurement record (peak, RMS,
duration, spectral centroid, edge trim, loop seam) behind **1691 signal checks, 0 of which failed**. You can re hash any file and check
it against the proof.

`cross_pack_proof.json` is for owners of the studio's other packs: every file here was compared against every file in the 6 nearest
packs on our shelf (Reelhouse, Escapement, Portcullis, Tally, Tumbler, Barrage: **135056** pairs) on spectral shape and on envelope, each tolerant of a transposition, and
**135056** of 135056 measure as separate sounds: no file here is one of theirs at another pitch.

## Honest limits

- These are **synthesised** sounds made in code: models of coils, rubber, wood and steel, not recordings of a real machine. They do not reproduce any particular table.
- The sound is one machine, so it does not cover themed tables: there are no lasers, spaceships or monsters. There are no voices, callouts or music, and no display or video mode sounds.
- The files are mono. Position them yourself; a ball moving across a table is yours to pan.
- The proof files measure **signal**, not taste. They certify there is no measurable defect: no clipping, no silence, no abrupt
  edges, no broken loop, no ladder step out of order. They do not, and cannot, tell you the pack sounds good to you. Listen to the
  free demo first; that is what it is for.

---

*Core Systems Asset Factory · pack version 1.0.0 · 184 sounds · 1691 checks passed*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
