# Lucky Draw: Scratch Card, Prize Wheel, Lottery and Bingo SFX — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Lucky Draw: Scratch Card, Prize Wheel, Lottery and Bingo SFX  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-01


---

# Lucky Draw: 150 Scratch, Prize Wheel, Lottery and Bingo SFX

**150 sound effects in WAV and OGG for any game engine, for the games of chance beside the slot reels: scratch cards scratched on silver foil, gold foil and grey latex at three speeds as seamless loops, three prize wheels that tick down to a stop or a near miss, a lottery drum and an air mixing machine, a bingo cage with its dauber, a raffle drum of paper tickets, and a five tier win ladder from a small prize to the jackpot.**

Lucky Draw is one fairground prize booth and one church hall draw, heard close. Cards with a foil or latex coating on a wooden counter, scratched with a coin. Plywood prize wheels with steel pegs round the rim and a leather flapper. An acrylic drum and an air machine full of hollow plastic balls. A wire bingo cage of wooden balls. A tin raffle drum. A brass hand bell, a steel desk bell, a tin cash box and brass prize tokens.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio of any kind, and no generative audio model. There are no voices and no number callouts. Nothing here is musical: there are no jingles or fanfares; a win is a hand bell shaken on one pitch, and a desk bell is one strike of one pitch.

---

## What is in the box

| | |
|---|---|
| Sounds | **150** |
| Formats | `.wav` (16 bit, 44.1 kHz, mono) **and** `.ogg` |
| Total files | 300 (150 wav + 150 ogg) |
| Seamless loops | 28, loop points written into every loop file |
| Ladders | 12 |
| Mechanisms with every state | 9 |
| Scratch grid | 3 coatings x 3 speeds |
| Variation sets | 34 |
| Total audio | 2 min 22 s |
| Shortest / longest | 90 ms / 3.88 s |

## What the download contains

```
wav/                   150 files, 16 bit 44.1 kHz mono
ogg/                   150 files, Vorbis
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
Sound effects: "Lucky Draw: 150 Scratch, Prize Wheel, Lottery and Bingo SFX" by Core Systems Asset Factory
```

---

## The groups

| Group | Files |
|---|---|
| **Scratch cards** | 39 |
| **Prize wheels** | 29 |
| **The lottery draw** | 21 |
| **Bingo** | 24 |
| **The raffle** | 16 |
| **Wins and the counter** | 21 |

## A scratch card

Pick a card with `card_pick_up` and set the coin down with `scratch_coin_down`. While the pointer drags, run one scratch loop by coating and crossfade by drag speed: `scratch_silver_*`, `scratch_gold_*` or `scratch_latex_*` (or `scratch_fingernail_loop`), and stop it with `scratch_coin_lift`. For a single swipe, play a take of `scratch_stroke_silver`, `scratch_stroke_gold` or `scratch_stroke_latex`.
Each cell that comes clear plays a take of `cell_reveal`. When a symbol matches, play `symbol_match_1`, then `symbol_match_2` and `symbol_match_3` as the row builds. `last_cell_hold_loop` runs while the player works the last cell. The result is `card_match` or `card_no_match`. `card_tear_off` takes a card from the strip, and `dust_brush` sweeps the scratchings away.

## A prize wheel

There are three wheels: `wheel_small_*` (a tabletop wheel), `wheel_medium_*` (a booth wheel) and `wheel_large_*` (a carnival wheel). Start a spin with `wheel_<size>_spin_start`, then run `wheel_<size>_fast_loop`, `wheel_<size>_medium_loop` and `wheel_<size>_slow_loop` in turn as it slows. End on `wheel_<size>_stop`, or `wheel_<size>_near_miss` when the flapper hangs on a peg and the wheel falls back one segment.
If your game moves the wheel itself, play a take of `wheel_<size>_tick` each time a peg passes the flapper. `wheel_hand_brake` is a palm on the rim.

## A lottery draw

Load the drum with `drum_load_pour`, start it with `drum_start`, run `drum_tumble_few_loop`, `drum_tumble_half_loop` or `drum_tumble_full_loop` by how many balls are in it, and stop it with `drum_stop`. A ball leaves through `ball_gate_release`, rolls down `ball_chute_roll` and rests with `ball_settle`.
The air machine is `air_mix_start`, `air_mix_loop` and `air_mix_stop`; `air_ball_pick` sucks a ball up the tube into its clip. Show the number with `number_flip`.

## A bingo game

Crank the cage with `cage_crank_slow_loop`, `cage_crank_medium_loop` or `cage_crank_fast_loop`, open and close its door with `cage_door_open` and `cage_door_close`, and drop a ball with `cage_ball_drop`. The caller sets it in the board with `ball_into_board`.
At the table, `dauber_cap_off`, `dauber_stamp` and `dauber_cap_on` for an ink dauber, or `marker_disc_place` for markers, cleared with `markers_sweep`. A win is `bingo_line`, `bingo_two_lines` or `bingo_full_house`.

## A raffle

Open the drum with `raffle_hatch_open`, turn it with `raffle_drum_turn_loop` or one turn at a time with `raffle_drum_one_turn`, and close it with `raffle_hatch_close`. `ticket_tear` takes a ticket from the roll, `ticket_stub_drop` drops the stub in, `ticket_draw` pulls a winner out and `ticket_unfold` opens it.

## The counter

Pay with `coin_into_cashbox` or `coins_on_counter`, print a ticket with `ticket_print` and validate it with `rubber_stamp`. `desk_bell` is a confirm. A prize goes out with `prize_token`. A result is `no_win`, or `win_1` to `win_5` by the size of the prize.
The win ladder keeps the timing of the five tier win ladder in our slot machine pack, so the two packs can sit in one game: rung for rung, the lengths line up.

## The scratch grid

The scratch is what a card is made of, so it is a grid: every coating at every speed, 9 seamless loops.

| | slow | medium | fast |
|---|---|---|---|
| Silver foil | `scratch_silver_slow_loop` 5582 Hz | `scratch_silver_medium_loop` 6987 Hz | `scratch_silver_fast_loop` 8910 Hz |
| Gold foil | `scratch_gold_slow_loop` 4521 Hz | `scratch_gold_medium_loop` 5623 Hz | `scratch_gold_fast_loop` 7005 Hz |
| Grey latex | `scratch_latex_slow_loop` 2978 Hz | `scratch_latex_medium_loop` 3744 Hz | `scratch_latex_fast_loop` 4758 Hz |

Each coating is its own recipe, never one loop filtered three ways, and the loops of one coating share one length and one structure, so you can crossfade between speeds without a jump. The gate compares every pair of cells along its row and its column (at least **9%** apart in brightness or **18%** in length): **18** pairs compared, indistinct: **0**.

## The ladders

Measured from the shipped files, so a game can wire the rung to a number it already has.

- **scratch_silver** (brightness): silver foil scratched at three speeds as seamless loops, each faster and brighter than the last, so a game can follow the drag speed. `scratch_silver_slow_loop` 5582 Hz < `scratch_silver_medium_loop` 6987 Hz < `scratch_silver_fast_loop` 8910 Hz
- **scratch_gold** (brightness): gold foil scratched at three speeds as seamless loops, each faster and brighter than the last, so a game can follow the drag speed. `scratch_gold_slow_loop` 4521 Hz < `scratch_gold_medium_loop` 5623 Hz < `scratch_gold_fast_loop` 7005 Hz
- **scratch_latex** (brightness): grey latex scratched at three speeds as seamless loops, each faster and brighter than the last, so a game can follow the drag speed. `scratch_latex_slow_loop` 2978 Hz < `scratch_latex_medium_loop` 3744 Hz < `scratch_latex_fast_loop` 4758 Hz
- **symbol_match** (brightness): the first, second and third matching symbol uncovered, each brighter than the last, so a card builds toward its win. `symbol_match_1` 1839 Hz < `symbol_match_2` 2386 Hz < `symbol_match_3` 3079 Hz
- **wheel_small** (brightness): the tabletop wheel ticking at three speeds as seamless loops, each faster and brighter than the last, to crossfade as it slows. `wheel_small_slow_loop` 3097 Hz < `wheel_small_medium_loop` 4067 Hz < `wheel_small_fast_loop` 4963 Hz
- **wheel_medium** (brightness): the booth wheel ticking at three speeds as seamless loops, each faster and brighter than the last, to crossfade as it slows. `wheel_medium_slow_loop` 2521 Hz < `wheel_medium_medium_loop` 3258 Hz < `wheel_medium_fast_loop` 4207 Hz
- **wheel_large** (brightness): the carnival wheel ticking at three speeds as seamless loops, each faster and brighter than the last, to crossfade as it slows. `wheel_large_slow_loop` 2373 Hz < `wheel_large_medium_loop` 3190 Hz < `wheel_large_fast_loop` 4308 Hz
- **wheel_stop_by_size** (length): the three wheels coming to rest, the bigger wheel ticking on longer before its flapper settles. `wheel_small_stop` 1.34 s < `wheel_medium_stop` 2.01 s < `wheel_large_stop` 3.01 s
- **drum_tumble** (brightness): the lottery drum turning with a few balls, half a load and a full load, each brighter than the last. `drum_tumble_few_loop` 3162 Hz < `drum_tumble_half_loop` 4359 Hz < `drum_tumble_full_loop` 5667 Hz
- **cage_crank** (brightness): the bingo cage cranked at three speeds as seamless loops, each faster and brighter than the last. `cage_crank_slow_loop` 2356 Hz < `cage_crank_medium_loop` 3003 Hz < `cage_crank_fast_loop` 3913 Hz
- **bingo_win** (length): a line, two lines and a full house, each ringing on longer than the last. `bingo_line` 1.40 s < `bingo_two_lines` 1.82 s < `bingo_full_house` 3.08 s
- **win** (length): five win tiers from a small prize to the jackpot, the hand bell and the tokens running longer each time, on the same timing as our slot machine pack. `win_1` 0.73 s < `win_2` 0.93 s < `win_3` 1.27 s < `win_4` 1.84 s < `win_5` 2.57 s

Every brightness step is at least **8%**, every length step at least **12%**, and every ladder at least **1.5x** end to end: **26** steps compared, failing steps: **0**.

The symbol match ladder rises by one fixed ratio per step that is no musical interval, so it is a climb and not a scale.

## The mechanisms

| Mechanism | States |
|---|---|
| The scratch ticket | `card_pick_up_01..02`, `scratch_coin_down_01..02`, `scratch_coin_lift_01..02`, `card_match`, `card_no_match` |
| The tabletop wheel | `wheel_small_spin_start`, `wheel_small_medium_loop`, `wheel_small_stop`, `wheel_small_near_miss` |
| The booth wheel | `wheel_medium_spin_start`, `wheel_medium_medium_loop`, `wheel_medium_stop`, `wheel_medium_near_miss` |
| The carnival wheel | `wheel_large_spin_start`, `wheel_large_medium_loop`, `wheel_large_stop`, `wheel_large_near_miss` |
| The lottery drum | `drum_start`, `drum_tumble_half_loop`, `drum_stop` |
| The air mixing machine | `air_mix_start`, `air_mix_loop`, `air_mix_stop` |
| The bingo cage | `cage_door_open`, `cage_crank_medium_loop`, `cage_door_close` |
| The ink dauber | `dauber_cap_off`, `dauber_stamp_01..04`, `dauber_cap_on` |
| The raffle drum | `raffle_hatch_open`, `raffle_drum_turn_loop`, `raffle_drum_one_turn_01..02`, `raffle_hatch_close` |

**46** state pairs compared, each at least **9%** apart in brightness or **18%** in length; indistinct pairs: **0**.

## Loops

Only files named `_loop` loop, and the loop region is the **whole file**, written as `smpl` points in the `.wav` and as `LOOPSTART` and `LOOPLENGTH` tags in the `.ogg`.

`scratch_silver_slow_loop`, `scratch_silver_medium_loop`, `scratch_silver_fast_loop`, `scratch_gold_slow_loop`, `scratch_gold_medium_loop`, `scratch_gold_fast_loop`, `scratch_latex_slow_loop`, `scratch_latex_medium_loop`, `scratch_latex_fast_loop`, `scratch_fingernail_loop`, `last_cell_hold_loop`, `wheel_small_slow_loop`, `wheel_small_medium_loop`, `wheel_small_fast_loop`, `wheel_medium_slow_loop`, `wheel_medium_medium_loop`, `wheel_medium_fast_loop`, `wheel_large_slow_loop`, `wheel_large_medium_loop`, `wheel_large_fast_loop`, `drum_tumble_few_loop`, `drum_tumble_half_loop`, `drum_tumble_full_loop`, `air_mix_loop`, `cage_crank_slow_loop`, `cage_crank_medium_loop`, `cage_crank_fast_loop`, `raffle_drum_turn_loop`.

## Avoiding repetition

34 sounds ship as **variation sets**: separate renders, not copies of one file. Each coating has 3 strokes, a cell clears 4 ways and the dauber stamps 4 ways. Play a random member that did not play last. Measured across all 34 sets on the shipped files: brightness differs between takes by 8% to 76%, and length by 12% to 64%.

## One level

Every file is normalised to one loudness target. The measured inner loudness range (10th to 90th percentile) across all 150 files is
**2.52 dB**, so a marker disc and the full house need no gain riding.

## Import notes

**Unity**: drop the `ogg` folder into `Assets/`. For a `_loop` file: Tick *Loop* on the `AudioSource`. Hold a variation set in an `AudioClip[]` and call `AudioSource.PlayOneShot(clip)`.

**Unreal**: import the `wav` folder. For a `_loop` file: Tick *Looping* on the Sound Wave. Make a Sound Cue with a **Random** node over a variation set.

**Godot**: import the `wav` folder for the 28 `_loop` files; Godot reads their `smpl` loop points on import with default settings. The `.ogg` loops import with *Loop* off: select them, tick *Loop* in the Import dock (Loop Offset 0) and press *Reimport*. One shots import with *Loop* off. Put a variation set in an `AudioStreamRandomizer` (Godot 4).

**GameMaker**: import the `ogg` folder as sounds. For a `_loop` file: `audio_play_sound(snd, priority, true)`. Build a rung name with `"win_" + string(n)` and resolve it with `asset_get_index`.

**RPG Maker MV / MZ**: use the `ogg` files. One shots go in `audio/se`; `_loop` files go in `audio/bgs`, and their loop tags are read by the engine.

**Web / HTML5**: use the `ogg` files. For a `_loop` file: `loop = true` on the `AudioBufferSourceNode`.

## Proof

`pack_proof.json` ships with the pack. It carries a **sha256 for every audio file** and the full measurement record (peak, RMS,
duration, spectral centroid, edge trim, loop seam) behind **1389 signal checks, 0 of which failed**. You can re hash any file and check
it against the proof.

`cross_pack_proof.json` is for owners of the studio's other packs: every file here was compared against every file in the 6 nearest
packs on our shelf (Reelhouse, Tilt, CardTable, Escapement, Casebook, Tally: **131700** pairs) on spectral shape and on envelope, each tolerant of a transposition, and
**131700** of 131700 measure as separate sounds: no file here is one of theirs at another pitch.

## Honest limits

- These are **synthesised** sounds made in code: models of foil, card, wood, steel, plastic and paper, not recordings of real devices. They do not reproduce any particular lottery, wheel or bingo hall.
- There are no voices, number callouts, crowd or music. A bingo caller or a game show host is yours to add.
- There are no reels, coin hopper, cards, chips or dice: those are other packs.
- The files are mono. Position them yourself.
- This pack is for games. It is not built for real money gambling machines, which have their own certification rules.
- The proof files measure **signal**, not taste. They certify there is no measurable defect: no clipping, no silence, no abrupt
  edges, no broken loop, no ladder step out of order. They do not, and cannot, tell you the pack sounds good to you. Listen to the
  free demo first; that is what it is for.

---

*Core Systems Asset Factory · pack version 1.0.0 · 150 sounds · 1389 checks passed*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
