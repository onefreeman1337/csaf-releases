# Cartridge: 16-bit RPG World Sounds and BGS Loops — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Cartridge: 16-bit RPG World Sounds and BGS Loops  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-02


---

# Cartridge: 133 16-bit RPG World Sounds and BGS Loops

**133 sound effects in WAV and OGG for RPG Maker MZ and MV, Godot, Unity, GameMaker and any other engine: the world layer of a 16-bit era RPG, rendered through one modelled 16-bit console sound chain. 33 seamless background loops (rain, wind, storms, forests, rivers, shores, caves, dungeons, towns, taverns, castles), the chests, doors and switches a map is full of, and the creatures that roam it. Royalty free, no credit required.**

Cartridge is for a retro RPG whose art is pixel art and whose sound should not be crisp and modern. It covers the half of a game's sound that a map plays: the background loops (BGS) and the field sounds. It does not cover battle, menu or spell sounds.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio of any kind, and no generative audio model. Nothing here is musical: there are no jingles, fanfares or chimes.

---

## What is in the box

| | |
|---|---|
| Sounds | **133** |
| Formats | `.wav` (16 bit, 32,000 Hz, mono) **and** `.ogg` |
| Total files | 266 (133 wav + 133 ogg) |
| Seamless background loops | 33, loop points written into every loop file (4.096 s or 8.192 s long) |
| Ladders | 4 |
| Mechanisms with every state | 10 |
| Variation sets | 26 |
| Total audio | 5 min 11 s |
| Shortest / longest | 121 ms / 8.19 s |

## What the download contains

```
wav/                   133 files, 16 bit 32,000 Hz mono
ogg/                   133 files, Vorbis
Readme_for_Users.md    this file
NAMING_MANIFEST.md     every file, its group, take, measured duration and brightness
LICENSE.txt            the full licence
pack.json              the machine readable manifest (the chain, ladders, mechanisms, variation sets)
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
Sound effects: "Cartridge: 133 16-bit RPG World Sounds and BGS Loops" by Core Systems Asset Factory
```

---

## The chain

These are not modern sounds pushed through a bit crusher. Every file is made the way a 16-bit era console made sound, by one modelled chain, end to end:

1. **An instrument bank.** 22 short samples (noise, a water drop, a wood knock, a metal clank, a creak, a single cycle buzz and so on), made once.
2. **A 4-bit block code.** Each sample is stored as blocks of 16 samples in 9 bytes: a shift and one of 4 predictors per block, then sixteen 4-bit values. The encoder tries every shift and predictor per block. The whole bank codes to **32,256 bytes**, inside a **65,536 byte** budget (blocks per predictor 0 / 1 / 2 / 3: 529 / 391 / 1141 / 1523).
3. **Pitch and interpolation.** A voice plays a sample at a 14-bit pitch register through a 4-tap Gaussian interpolation kernel, which is where the soft top end comes from.
4. **Noise and envelopes.** A 15-bit noise generator clocked from a 32-step rate table (rain, wind and breath come from it), and ADSR envelopes at 11-bit resolution.
5. **Eight voices.** No sound in the pack uses more than eight voices at once (the most any one uses: **5**), mixed at 7-bit volumes into a 16-bit sum that never clips.
6. **An echo unit.** A delay in 16 ms steps, an 8-tap filter on the return, and feedback. Caves, halls and castles ring through it.
7. **Out at 32,000 Hz**, 16-bit. The files ship at that rate; every engine listed below plays it.

Every one of those numbers is checked by the build from the render, not written by hand.

## The groups

| Group | Files | Loops |
|---|---|---|
| **Weather** | 14 | 9 |
| **Nature and water** | 17 | 9 |
| **Caves and dungeons** | 15 | 6 |
| **Towns and interiors** | 9 | 7 |
| **Chests and doors** | 20 | 0 |
| **Switches and secrets** | 15 | 1 |
| **Terrain and travel** | 20 | 0 |
| **Creatures** | 23 | 1 |

## Weather

Background loops: `rain_light_loop`, `rain_steady_loop`, `rain_heavy_loop`, `thunderstorm_loop`, `wind_plains_loop`, `wind_mountain_loop`, `wind_blizzard_loop`, `snowfall_hush_loop`, `desert_wind_loop`. The rain and the wind each come in three intensities, so a map can crossfade as the weather turns. One shots: `thunder_crack_01..03` and `thunder_rumble_01..02` to drop over `rain_heavy_loop` when you want the storm under your control instead of `thunderstorm_loop`.

## Nature and water

Background loops: `forest_birds_loop`, `meadow_insects_loop`, `night_crickets_loop`, `frog_pond_loop`, `swamp_loop`, `river_loop`, `waterfall_loop`, `seashore_loop`, `spring_bubbling_loop`. One shots: `bird_takeoff_01..02` when the player startles a flock, `owl_hoot_01..02` for a night map, `wave_crash_01..02` for a single breaking wave and `fish_splash_01..02`.

## Caves and dungeons

Background loops: `cave_drips_loop`, `lava_cavern_loop`, `dungeon_hum_loop`, `sewer_loop`, `ice_cavern_loop`, `haunted_manor_loop`. One shots: `water_drip_01..03` in three echoes, `rockfall_01..02`, `torch_ignite` and `torch_snuff`, and `chain_rattle_01..02`.

## Towns and interiors

Background loops: `town_square_loop`, `tavern_loop`, `castle_hall_loop`, `campfire_loop`, `hearth_loop`, `ship_deck_loop`, `windmill_loop`. There are no voices in the town or the tavern: the town is its fountain, its footsteps and its carts. `cart_pass_01..02` is a cart going by.

## Chests and doors

Three chests (`chest_wood_*`, `chest_iron_*`, `chest_ornate_*`), each with `_open`, `_close` and `_locked`. Two doors (`door_wood_*`, `door_iron_*`) with the same three states, and the dungeon gate: `gate_raise`, `gate_drop` and `gate_locked`. `key_turn_01..02` unlocks any of them.

## Switches and secrets

`lever_pull` and `lever_return`; `floor_switch_on` and `floor_switch_off`; `pressure_plate_down` and `pressure_plate_up`. The push block runs `stone_block_push_loop` while the player pushes, then `stone_block_stop` against a wall or `stone_block_drop` into its hole. `secret_passage_rumble` and `bookshelf_slide` open a hidden way, `wall_crumble` breaks one, `warp_tile` moves the party, `heal_spring` restores it and `earthquake` shakes the map.

## Terrain and travel

`bush_rustle_01..03`, `grass_cut_01..03`, `water_splash_01..02`, `pit_fall`, `ladder_climb_01..03`, `stairs_up` and `stairs_down`, `ice_crack_01..02`, `mud_squelch_01..02` and `rope_bridge_creak_01..02`.

## Creatures

Monster yells in four sizes (`monster_yell_small_01..02`, `monster_yell_medium_01..02`, `monster_yell_large_01..02`, `monster_yell_huge_01..02`) and footfalls in four sizes (`monster_stomp_small`, `monster_stomp_medium`, `monster_stomp_large`, `monster_stomp_huge`), `boss_roar_01..02`, `slime_squelch_01..03`, `bat_wings_loop` for a bat that circles, `ghost_wail_01..02` and `beast_snarl_01..03`.

## The ladders

Measured from the shipped files, so a game can wire the rung to a number it already has.

- **rain** (brightness, up): light, steady and heavy rain as seamless loops, each denser and brighter than the last, to crossfade as a storm builds. `rain_light_loop` 2693 Hz < `rain_steady_loop` 3844 Hz < `rain_heavy_loop` 4660 Hz
- **wind** (brightness, up): wind on the plains, on a mountain pass and in a blizzard, each harder and brighter than the last. `wind_plains_loop` 1570 Hz < `wind_mountain_loop` 2044 Hz < `wind_blizzard_loop` 3469 Hz
- **monster_yell** (brightness, down): a monster yell in four sizes, each creature bigger and darker than the last. `monster_yell_small` 3579 Hz > `monster_yell_medium` 2930 Hz > `monster_yell_large` 2321 Hz > `monster_yell_huge` 1762 Hz
- **monster_stomp** (brightness, down): a monster footfall in four sizes, each heavier and darker than the last. `monster_stomp_small` 2789 Hz > `monster_stomp_medium` 2270 Hz > `monster_stomp_large` 1520 Hz > `monster_stomp_huge` 1044 Hz

Every brightness step is at least **8%** and every ladder at least **1.5x** end to end: **10** steps compared, failing steps: **0**.

## The mechanisms

| Mechanism | States |
|---|---|
| The wooden chest | `chest_wood_open`, `chest_wood_close`, `chest_wood_locked` |
| The iron bound chest | `chest_iron_open`, `chest_iron_close`, `chest_iron_locked` |
| The ornate chest | `chest_ornate_open`, `chest_ornate_close`, `chest_ornate_locked` |
| The wooden door | `door_wood_open`, `door_wood_close`, `door_wood_locked` |
| The iron door | `door_iron_open`, `door_iron_close`, `door_iron_locked` |
| The dungeon gate | `gate_raise`, `gate_drop`, `gate_locked` |
| The wall lever | `lever_pull`, `lever_return` |
| The floor switch | `floor_switch_on`, `floor_switch_off` |
| The pressure plate | `pressure_plate_down`, `pressure_plate_up` |
| The push block | `stone_block_push_loop`, `stone_block_stop`, `stone_block_drop` |

**24** state pairs compared, each at least **9%** apart in brightness or **18%** in length; indistinct pairs: **0**.

## Loops

Only files named `_loop` loop, and the loop region is the **whole file**, written as `smpl` points in the `.wav` and as `LOOPSTART` and `LOOPLENGTH` tags in the `.ogg`. Every loop is a power of two samples long (4.096 s or 8.192 s at 32,000 Hz).

`rain_light_loop`, `rain_steady_loop`, `rain_heavy_loop`, `thunderstorm_loop`, `wind_plains_loop`, `wind_mountain_loop`, `wind_blizzard_loop`, `snowfall_hush_loop`, `desert_wind_loop`, `forest_birds_loop`, `meadow_insects_loop`, `night_crickets_loop`, `frog_pond_loop`, `swamp_loop`, `river_loop`, `waterfall_loop`, `seashore_loop`, `spring_bubbling_loop`, `cave_drips_loop`, `lava_cavern_loop`, `dungeon_hum_loop`, `sewer_loop`, `ice_cavern_loop`, `haunted_manor_loop`, `town_square_loop`, `tavern_loop`, `castle_hall_loop`, `campfire_loop`, `hearth_loop`, `ship_deck_loop`, `windmill_loop`, `stone_block_push_loop`, `bat_wings_loop`.

## Avoiding repetition

26 sounds ship as **variation sets**: separate renders, not copies of one file. Play a random member that did not play last. Measured across all 26 sets on the shipped files: brightness differs between takes by 5% to 24%, and length by 11% to 40%.

## One level

Every file is normalised to one loudness target. The measured inner loudness range (10th to 90th percentile) across all 133 files is
**0.56 dB**, so a single drip and a thunderstorm need no gain riding.

## Import notes

**RPG Maker MV / MZ**: use the `ogg` files. One shots go in `audio/se`; `_loop` files go in `audio/bgs`, and their loop tags are read by the engine, so Play BGS loops them with no plugin.

**Godot**: import the `wav` folder for the 33 `_loop` files; Godot reads their `smpl` loop points on import with default settings. The `.ogg` loops import with *Loop* off: select them, tick *Loop* in the Import dock (Loop Offset 0) and press *Reimport*. One shots import with *Loop* off. Put a variation set in an `AudioStreamRandomizer` (Godot 4).

**Unity**: drop the `ogg` folder into `Assets/`. For a `_loop` file: Tick *Loop* on the `AudioSource`. Hold a variation set in an `AudioClip[]` and call `AudioSource.PlayOneShot(clip)`.

**Unreal**: import the `wav` folder. For a `_loop` file: Tick *Looping* on the Sound Wave. Make a Sound Cue with a **Random** node over a variation set.

**GameMaker**: import the `ogg` folder as sounds. For a `_loop` file: `audio_play_sound(snd, priority, true)`.

**Web / HTML5**: use the `ogg` files. For a `_loop` file: `loop = true` on the `AudioBufferSourceNode`.

## Proof

`pack_proof.json` ships with the pack. It carries a **sha256 for every audio file** and the full measurement record (peak, RMS,
duration, spectral centroid, edge trim, loop seam) behind **1240 signal checks, 0 of which failed**. You can re hash any file and check
it against the proof.

`cross_pack_proof.json` is for owners of the studio's other packs: every file here was compared against every file in the 6 nearest
packs on our shelf (Overdub2, Squall, Dwell, Portcullis, VocalForge, Concrete: **104,937** pairs) on spectral shape and on envelope, each tolerant of a transposition, and
**104,937** of 104,937 measure as separate sounds: no file here is one of theirs at another pitch.

## Honest limits

- These are **synthesised** sounds made in code through a model of a 16-bit era sound chain. The model is built from the general shape of that era's hardware (sample rate, block code, interpolation, voices, echo); it is not an emulation of any one console, and nothing here is taken from any game.
- There are no battle, menu or spell sounds and no music: those belong to other packs.
- There are no voices or crowds. The town and the tavern are their objects, not their people.
- The files are mono. Position them yourself.
- The proof files measure **signal**, not taste. They certify there is no measurable defect: no clipping, no silence, no abrupt
  edges, no broken loop, no ladder step out of order. They do not, and cannot, tell you the pack sounds good to you. Listen to the
  free demo first; that is what it is for.

---

*Core Systems Asset Factory · pack version 1.0.0 · 133 sounds · 1240 checks passed*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
