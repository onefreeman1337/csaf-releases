# Bonbon: 185 Candy World Sound Effects — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Bonbon: 185 Candy World Sound Effects  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-02


---

# Bonbon: 185 Candy World Sound Effects

**185 candy world sound effects in WAV and OGG for any game engine: 8 candies that each answer the same 5 actions (collect, land on, bounce, bite and break), a bubble you can blow and pop at 5 sizes, a jawbreaker and a sugar glass bridge cracking in stages, a 6 step collect streak, sweets poured by the handful, 9 seamless world loops, and the machines of the candy factory.**

Bonbon is one candy world, heard close. The candies are chocolate, marshmallow, licorice, gummy, jelly, cotton candy, hard candy and sugar glass, and every one answers the same 5 actions, so a game can wire one candy and swap only the material. The places are the chocolate river, the caramel bog, the soda spring, sprinkle rain, the rock candy cave, the jelly lake, wind over the sugar dunes, the frosting falls and the candy factory floor.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio of any kind, and no generative audio model. There are no voices, no creatures and no jingles, and nothing here is musical.

---

## What is in the box

| | |
|---|---|
| Sounds | **185** |
| Formats | `.wav` (16 bit, 44.1 kHz, mono) **and** `.ogg` |
| Total files | 370 (185 wav + 185 ogg) |
| Seamless loops | 14, loop points written into every loop file |
| The candy grid | 8 candies x 5 actions, two takes per cell |
| Ladders | 6 |
| Machines and mechanisms | 7 |
| Variation sets | 60 |
| Total audio | 2 min 12 s |
| Shortest / longest | 67 ms / 4.00 s |

## What the download contains

```
wav/                   185 files, 16 bit 44.1 kHz mono
ogg/                   185 files, Vorbis
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
Sound effects: "Bonbon: 185 Candy World Sound Effects" by Core Systems Asset Factory
```

---

## The groups

| Group | Files |
|---|---|
| **Candy by action** | 80 |
| **Bubbles, cracks and streaks** | 28 |
| **The candy world** | 9 |
| **The candy factory** | 24 |
| **Treats and wrappers** | 27 |
| **Syrup, soda and sugar** | 17 |

## The candy grid

The grid is the product. Name a file `<candy>_<action>_01` or `_02`, where the candy is `chocolate`, `marshmallow`, `licorice`, `gummy`, `jelly`, `cotton_candy`, `hard_candy` and `sugar_glass` and the action is `collect`, `land`, `bounce`, `bite` and `break`. A level made of gummy and a level made of sugar glass run the same code: change one word.

| | Collect | Land on | Bounce | Bite | Break |
|---|---|---|---|---|---|
| Chocolate | `chocolate_collect` 1393 Hz, 0.11 s | `chocolate_land` 1419 Hz, 0.25 s | `chocolate_bounce` 628 Hz, 0.48 s | `chocolate_bite` 2358 Hz, 0.16 s | `chocolate_break` 2567 Hz, 0.58 s |
| Marshmallow | `marshmallow_collect` 1242 Hz, 0.15 s | `marshmallow_land` 957 Hz, 0.31 s | `marshmallow_bounce` 805 Hz, 0.65 s | `marshmallow_bite` 2053 Hz, 0.35 s | `marshmallow_break` 2010 Hz, 1.15 s |
| Licorice | `licorice_collect` 875 Hz, 0.10 s | `licorice_land` 621 Hz, 0.22 s | `licorice_bounce` 544 Hz, 0.48 s | `licorice_bite` 1897 Hz, 0.25 s | `licorice_break` 1731 Hz, 0.89 s |
| Gummy | `gummy_collect` 761 Hz, 0.15 s | `gummy_land` 1400 Hz, 0.31 s | `gummy_bounce` 581 Hz, 0.63 s | `gummy_bite` 2475 Hz, 0.30 s | `gummy_break` 2210 Hz, 0.83 s |
| Jelly | `jelly_collect` 927 Hz, 0.21 s | `jelly_land` 1559 Hz, 0.50 s | `jelly_bounce` 519 Hz, 0.88 s | `jelly_bite` 3194 Hz, 0.26 s | `jelly_break` 2317 Hz, 1.22 s |
| Cotton candy | `cotton_candy_collect` 6288 Hz, 0.21 s | `cotton_candy_land` 5474 Hz, 0.41 s | `cotton_candy_bounce` 3830 Hz, 0.66 s | `cotton_candy_bite` 8455 Hz, 0.34 s | `cotton_candy_break` 6877 Hz, 1.12 s |
| Hard candy | `hard_candy_collect` 5921 Hz, 0.08 s | `hard_candy_land` 3082 Hz, 0.12 s | `hard_candy_bounce` 3726 Hz, 0.47 s | `hard_candy_bite` 5393 Hz, 0.22 s | `hard_candy_break` 5799 Hz, 0.66 s |
| Sugar glass | `sugar_glass_collect` 6617 Hz, 0.27 s | `sugar_glass_land` 4801 Hz, 0.34 s | `sugar_glass_bounce` 5310 Hz, 0.54 s | `sugar_glass_bite` 7349 Hz, 0.24 s | `sugar_glass_break` 5349 Hz, 0.90 s |

The numbers above are the mean of each cell's two takes. Each candy is its own recipe: the brittle ones (chocolate, hard candy, sugar glass) are struck bodies with cracks and crumbs, the elastic ones (licorice, gummy, jelly) are bodies that overshoot and settle with wet partings, and the soft ones (marshmallow, cotton candy) are air, fibres and low thumps with nothing that rings. The gate compares every pair of cells along its row and its column (at least **9%** apart in brightness or **18%** in length): **220** pairs compared, indistinct: **0**.

## The ladders

Measured from the shipped files, so a game can wire the rung to a number it already has: how long the button is held, how many hits it has taken, how long the streak is.

- **gum_blow** (length): a bubble blown at five sizes, each breath longer than the last, so a game can wire the rung to how long the button is held. `gum_blow_1` 0.29 s < `gum_blow_2` 0.39 s < `gum_blow_3` 0.51 s < `gum_blow_4` 0.68 s < `gum_blow_5` 0.90 s
- **gum_pop** (brightness, falling): the pop of that bubble at five sizes, each one lower and rounder than the last: a bigger bubble pops deeper. `gum_pop_1` 2341 Hz > `gum_pop_2` 1992 Hz > `gum_pop_3` 1711 Hz > `gum_pop_4` 1430 Hz > `gum_pop_5` 1149 Hz
- **jawbreaker_crack** (length): a jawbreaker cracking in four stages, from a hairline to the split, each crack running longer than the last. `jawbreaker_crack_1` 0.22 s < `jawbreaker_crack_2` 0.27 s < `jawbreaker_crack_3` 0.35 s < `jawbreaker_crack_4` 0.46 s
- **bridge_crack** (length): a sugar glass bridge giving way in four stages, each stress crack spreading further than the last. `bridge_crack_1` 0.33 s < `bridge_crack_2` 0.37 s < `bridge_crack_3` 0.47 s < `bridge_crack_4` 0.61 s
- **streak** (brightness): a candy collect streak in six steps, each one brighter than the last by one fixed ratio, never a scale. `streak_1` 2868 Hz < `streak_2` 3318 Hz < `streak_3` 3849 Hz < `streak_4` 4448 Hz < `streak_5` 5205 Hz < `streak_6` 6131 Hz
- **pour** (length): sweets poured into a jar, from a pinch to a whole bag, each pour longer than the last. `pour_1` 0.38 s < `pour_2` 0.53 s < `pour_3` 0.61 s < `pour_4` 0.85 s

Every brightness step is at least **8%**, every length step at least **12%**, and every ladder at least **1.5x** end to end: **22** steps compared, failing steps: **0**.

The streak climbs by one fixed ratio from step to step, not by a musical scale, and nothing here is tuned to a key.

## The candy factory

Each machine is three files: a start, a seamless loop to hold for as long as it runs, and a stop. The gumball machine and the sweets jar are stateful one shots. Play the start, start the loop under its tail, and play the stop when the machine shuts down.

| Machine | States |
|---|---|
| The taffy puller | `taffy_puller_start`, `taffy_puller_loop`, `taffy_puller_stop` |
| The conveyor | `conveyor_start`, `conveyor_loop`, `conveyor_stop` |
| The wrapping machine | `wrapper_machine_start`, `wrapper_machine_loop`, `wrapper_machine_stop` |
| The cotton candy spinner | `floss_spinner_start`, `floss_spinner_loop`, `floss_spinner_stop` |
| The sugar rush power up | `sugar_rush_start`, `sugar_rush_loop`, `sugar_rush_stop` |
| The gumball machine | `gumball_crank_01..02`, `gumball_drop_01..02`, `gumball_tray` |
| The sweets jar | `jar_open_01..02`, `jar_close_01..02` |

**19** state pairs compared, each at least **9%** apart in brightness or **18%** in length; indistinct pairs: **0**. A filter on `<machine>_*` returns that machine's states and nothing else.

## Loops

Only files named `_loop` loop, and the loop region is the **whole file**, written as `smpl` points in the `.wav` and as `LOOPSTART` and `LOOPLENGTH` tags in the `.ogg`.

`chocolate_river_loop`, `caramel_bog_loop`, `soda_spring_loop`, `sprinkle_rain_loop`, `rock_candy_cave_loop`, `jelly_lake_loop`, `sugar_wind_loop`, `frosting_falls_loop`, `factory_floor_loop`, `taffy_puller_loop`, `conveyor_loop`, `wrapper_machine_loop`, `floss_spinner_loop`, `sugar_rush_loop`.

## Avoiding repetition

60 sounds ship as **variation sets**: separate renders, not copies of one file. Every cell of the grid has two takes, a wrapper crinkles 4 ways and a syrup drip falls 3 ways. Play a random member that did not play last. Measured across all 60 sets on the shipped files: brightness differs between takes by 6% to 60%, and length by 20% to 50%.

## One level

Every file is normalised to one loudness target. The measured inner loudness range (10th to 90th percentile) across all 185 files is
**1.41 dB**, so a sprinkle and a soda geyser need no gain riding.

A candy world fires pickups over a loop all the time, so leave headroom on your sound effects bus or put a limiter on it.

## Import notes

**Unity**: drop the `ogg` folder into `Assets/`. For a `_loop` file: Tick *Loop* on the `AudioSource`. Hold a variation set in an `AudioClip[]` and call `AudioSource.PlayOneShot(clip)`.

**Unreal**: import the `wav` folder. For a `_loop` file: Tick *Looping* on the Sound Wave. Make a Sound Cue with a **Random** node over a variation set.

**Godot**: import the `wav` folder for the 14 `_loop` files; Godot reads their `smpl` loop points on import with default settings. The `.ogg` loops import with *Loop* off: select them, tick *Loop* in the Import dock (Loop Offset 0) and press *Reimport*. One shots import with *Loop* off. Put a variation set in an `AudioStreamRandomizer` (Godot 4).

**GameMaker**: import the `ogg` folder as sounds. For a `_loop` file: `audio_play_sound(snd, priority, true)`. Build a name with `"gummy_" + action + "_01"` and resolve it with `asset_get_index`.

**RPG Maker MV / MZ**: use the `ogg` files. One shots go in `audio/se`; `_loop` files go in `audio/bgs`, and their loop tags are read by the engine.

**Web / HTML5**: use the `ogg` files. For a `_loop` file: `loop = true` on the `AudioBufferSourceNode`.

## Proof

`pack_proof.json` ships with the pack. It carries a **sha256 for every audio file** and the full measurement record (peak, RMS,
duration, spectral centroid, edge trim, loop seam) behind **1690 signal checks, 0 of which failed**. You can re hash any file and check
it against the proof.

`cross_pack_proof.json` is for owners of the studio's other packs: every file here was compared against every file in the 6 nearest
packs on our shelf (Tumbler, Shatterworks, Alembic, Hearthlight02, Tally, Wade: **133755** pairs) on spectral shape and on envelope, each tolerant of a transposition, and
**133755** of 133755 measure as separate sounds: no file here is one of theirs at another pitch.

## Honest limits

- These are **synthesised** sounds made in code: models of brittle sugar, elastic gummy, soft foam, thick liquid and small machines. They are stylised for a candy world and they do not reproduce any particular sweet, confectioner or game.
- There is no music, no jingle and no match-3 reward fanfare here, and no voices or creatures. Pair it with your own music and your own match feedback.
- The files are mono. Position them yourself.
- The proof files measure **signal**, not taste. They certify there is no measurable defect: no clipping, no silence, no abrupt
  edges, no broken loop, no ladder step out of order. They do not, and cannot, tell you the pack sounds good to you. Listen to the
  free demo first; that is what it is for.

---

*Core Systems Asset Factory · pack version 1.0.0 · 185 sounds · 1690 checks passed*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
