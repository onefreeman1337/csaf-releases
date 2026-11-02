# Attract Mode: Four 1983 Arcade Cue Sheets — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Attract Mode: Four 1983 Arcade Cue Sheets  
**Engine:** MIDI composition from Node (deterministic, theory-checkable) + rendered OGG via a redistribution-cleared soundfont - engine-agnostic music packs. Renderer + soundfont licence gate is the wing's first architecture decision; see Wings/Music/CLAUDE.md 3.  
**Docs published:** 2026-11-02


---

# ATTRACT MODE — FOUR 1983 ARCADE CUE SHEETS
### 46 tracks, 38:25

Core Systems Asset Factory

---

## What this is

Most game-music packs are a **grab-bag**: tracks bought or bundled together that happen to share a
genre. Drop three of them into one project and the player hears the seams — different rooms,
different instruments, different composers.

**This is an album, not a bag.** 46 tracks across 12 slots, written in
one musical language from one family of 5 hand-authored themes. That is not a
description, it is a measurement: the harness reads the finished MIDI back and counts every statement
of every theme in every track — **6,628** of them here — and the
report is in this download. Your game gets a **score**, not a playlist.

## What you get

- **46 × `.ogg`** — OGG Vorbis, 44.1 kHz stereo, ready to drop in
- **46 × `.mid`** — the **editable MIDI sources**. Re-voice them, re-orchestrate
  them, change the tempo, pull out a single line.
- **Sample-accurate loop metadata** — `LOOPSTART` / `LOOPLENGTH` in the OGG Vorbis comments,
  denominated in samples, which is exactly what **RPG Maker MV / MZ** reads
- **Per-engine import notes** (below)
- **A royalty-free licence** for commercial games (see `LICENSE.txt`)

## The four cue sheets

This record is the complete sound sheet of four 1983 coin-op cabinets from one studio: a maze game, a space shooter, a
climbing game and a racer. Each cabinet has eleven tracks: an attract mode, three rounds, a fourth round (or a boss, or a
final lap), a bonus round, an intermission, a high score entry, and three cues: start, miss and game over. Two more cues
belong to the whole studio: Insert Coin and Extra Life. Every full piece loops; every cue plays once and stops on the
tonic. The length column is the music's length to the end of its last bar at the tempo given (the .ogg adds the reverb
tail after it), so you can time a READY screen or a respawn to it.

### The maze game

| # | track | slot | bpm | key | length |
| --- | --- | --- | --- | --- | --- |
| 01 | Maze: Attract Mode | Attract mode | 140 | C ionian | 66.86 s, loops |
| 02 | Maze: Round One | Round | 144 | G mixolydian | 65.00 s, loops |
| 03 | Maze: Round Two | Round | 150 | D ionian | 62.40 s, loops |
| 04 | Maze: Round Three | Round | 156 | A dorian | 60.00 s, loops |
| 05 | Maze: Round Four | Round | 162 | E aeolian | 57.78 s, loops |
| 06 | Maze: Bonus Round | Bonus round | 168 | F ionian | 55.71 s, loops |
| 07 | Maze: Intermission | Intermission | 120 | A# ionian | 78.00 s, loops |
| 08 | Maze: High Score | High score | 104 | F mixolydian | 90.00 s, loops |
| 09 | Maze: Start | Start | 150 | C ionian | 6.40 s, cue |
| 10 | Maze: Miss | Miss | 120 | C aeolian | 4.00 s, cue |
| 11 | Maze: Game Over | Game over | 96 | A aeolian | 10.00 s, cue |

### The space shooter

| # | track | slot | bpm | key | length |
| --- | --- | --- | --- | --- | --- |
| 12 | Shooter: Attract Mode | Attract mode | 132 | D aeolian | 70.91 s, loops |
| 13 | Shooter: Stage One | Round | 148 | E dorian | 63.24 s, loops |
| 14 | Shooter: Stage Two | Round | 156 | B aeolian | 60.00 s, loops |
| 15 | Shooter: Stage Three | Round | 160 | G dorian | 58.50 s, loops |
| 16 | Shooter: The Mothership | Boss | 168 | C harmonic minor | 55.71 s, loops |
| 17 | Shooter: Challenge Stage | Bonus round | 152 | A mixolydian | 61.58 s, loops |
| 18 | Shooter: Warp | Intermission | 126 | F dorian | 74.29 s, loops |
| 19 | Shooter: High Score | High score | 100 | G aeolian | 93.60 s, loops |
| 20 | Shooter: Start | Start | 152 | E aeolian | 6.32 s, cue |
| 21 | Shooter: Miss | Miss | 132 | D aeolian | 3.64 s, cue |
| 22 | Shooter: Game Over | Game over | 92 | E harmonic minor | 10.43 s, cue |

### The climbing game

| # | track | slot | bpm | key | length |
| --- | --- | --- | --- | --- | --- |
| 23 | Climber: Attract Mode | Attract mode | 124 | F ionian | 75.48 s, loops |
| 24 | Climber: Floor One | Round | 132 | G ionian | 70.91 s, loops |
| 25 | Climber: Floor Two | Round | 138 | D mixolydian | 67.83 s, loops |
| 26 | Climber: Floor Three | Round | 144 | A ionian | 65.00 s, loops |
| 27 | Climber: The Top | Boss | 150 | B harmonic minor | 62.40 s, loops |
| 28 | Climber: Bonus Round | Bonus round | 160 | C mixolydian | 58.50 s, loops |
| 29 | Climber: Intermission | Intermission | 116 | D ionian | 80.69 s, loops |
| 30 | Climber: High Score | High score | 96 | E ionian | 97.50 s, loops |
| 31 | Climber: Start | Start | 144 | F ionian | 6.67 s, cue |
| 32 | Climber: Miss | Miss | 120 | G mixolydian | 4.00 s, cue |
| 33 | Climber: Game Over | Game over | 88 | C aeolian | 10.91 s, cue |

### The racer

| # | track | slot | bpm | key | length |
| --- | --- | --- | --- | --- | --- |
| 34 | Racer: Attract Mode | Attract mode | 150 | E mixolydian | 62.40 s, loops |
| 35 | Racer: Course One | Round | 160 | C dorian | 58.50 s, loops |
| 36 | Racer: Course Two | Round | 164 | A# mixolydian | 57.07 s, loops |
| 37 | Racer: Course Three | Round | 168 | C# aeolian | 55.71 s, loops |
| 38 | Racer: Final Lap | Final lap | 176 | F# dorian | 53.18 s, loops |
| 39 | Racer: Bonus Round | Bonus round | 172 | A ionian | 54.42 s, loops |
| 40 | Racer: Pit Stop | Intermission | 128 | D# mixolydian | 73.13 s, loops |
| 41 | Racer: High Score | High score | 104 | A dorian | 90.00 s, loops |
| 42 | Racer: Start | Start | 160 | E mixolydian | 6.00 s, cue |
| 43 | Racer: Miss | Miss | 140 | F# dorian | 3.43 s, cue |
| 44 | Racer: Game Over | Game over | 96 | C dorian | 10.00 s, cue |

### The studio

| # | track | slot | bpm | key | length |
| --- | --- | --- | --- | --- | --- |
| 45 | Insert Coin | Insert coin | 160 | C ionian | 3.00 s, cue |
| 46 | Extra Life | Extra life | 168 | G ionian | 2.86 s, cue |

## The channel budget

Every track is written inside the budget of a dual PSG arcade sound board: two AY-3-8910-class programmable sound
generators, six square-wave channels that play one note each, and a noise generator.

- PSG A: SQ1 plays the lead, SQ2 the counter-line, SQ3 the arpeggio.
- PSG B: SQ4 plays the bass. SQ5 and SQ6 are left empty: they are yours for sound effects.
- The noise generator plays the drums.

A PSG channel cannot hold a chord, so nothing on this record does: there is no pad anywhere. The build measured every
track: every part plays one note at a time, and at most 4 pitched notes sound at once anywhere on the record.
`CHANNEL_MAP.md` in this download lists, for each of the 46 tracks, which MIDI track is which channel and which General
MIDI program stands in for it. `channel_budget_proof.json` is the same check run again on the `.mid` files you received.

## The arpeggio

The harmony is spelled one note at a time by the arpeggio, the part named `arp` on MIDI channel 3: in eighths in the first
section of each loop (root and fifth, then third and fifth), in sixteenths in the second (root, third, fifth, third) and in
the third and in every cue (root, third, fifth, octave). Each beat it sits in the highest octave that keeps it under the
lowest note the lead is playing. On 99 of its 4912 beats the octave does not fit there, so it moves up and
leaves out the top note (the third takes its place); on 4 it has no room at all and rests. 15796 of its
15796 notes are tones of the chord sounding (all of them).

## The drums

The 32 full pieces carry drums; the 14 cues do not. Every drum note on the record (13709) is one of four
sounds standing in for the noise generator: bass drum, snare, closed hi-hat, crash. In the first section of each loop the bass drum plays
under the hi-hat; in the second and third sections the snare takes the backbeat (beat three on the
5 half-time tracks), the crash marks where each begins and a snare roll leads into the loop point. The drums are on
MIDI channel 10, the General MIDI drum channel.

## The cadence

Every one of the 32 full pieces closes its loop on the same three chords: flat six, flat seven, one (in C major: A flat
major, B flat major, C major), and the last of them holds into the loop point. The build checked the last three chords
named for every loop (32 of 32) and that all three tones of each chord sound while it is named.

### Instruments

Every sound is a General MIDI program rendered through the GeneralUser GS soundfont: square, sawtooth, calliope and
charang leads, mallets, a music box and a celesta, harpsichord and electric pianos, a reed organ and a harmonica, a few
winds and a trumpet, synth brass and synth basses, chosen for the arcade idiom. The `.ogg` files are a reference render:
they are not chip emulation. The `.mid` files are the real sources: load them into a tracker or a PSG sound driver, or
into your own instruments, with `CHANNEL_MAP.md` beside you. No arcade game's music is quoted anywhere on this record;
every tune on it was composed for it.

## Track list

| # | Title | Slot | Key | BPM | Length | LOOPSTART / LOOPLENGTH |
| --- | --- | --- | --- | --- | --- | --- |
|  1 | Maze: Attract Mode | Attract mode | C ionian | 140 | 1:07 | 151200 / 2797200 |
|  2 | Maze: Round One | Round | G mixolydian | 144 | 1:05 | 147000 / 2719500 |
|  3 | Maze: Round Two | Round | D ionian | 150 | 1:02 | 141120 / 2610720 |
|  4 | Maze: Round Three | Round | A dorian | 156 | 1:00 | 135692 / 2510308 |
|  5 | Maze: Round Four | Round | E aeolian | 162 | 0:58 | 130667 / 2417333 |
|  6 | Maze: Bonus Round | Bonus round | F ionian | 168 | 0:56 | 126000 / 2331000 |
|  7 | Maze: Intermission | Intermission | A# ionian | 120 | 1:18 | 176400 / 3263400 |
|  8 | Maze: High Score | High score | F mixolydian | 104 | 1:30 | 203538 / 3765462 |
|  9 | Maze: Start | Start | C ionian | 150 | 0:12 | one-shot |
| 10 | Maze: Miss | Miss | C aeolian | 120 | 0:13 | one-shot |
| 11 | Maze: Game Over | Game over | A aeolian | 96 | 0:19 | one-shot |
| 12 | Shooter: Attract Mode | Attract mode | D aeolian | 132 | 1:11 | 160364 / 2966727 |
| 13 | Shooter: Stage One | Round | E dorian | 148 | 1:03 | 143027 / 2646000 |
| 14 | Shooter: Stage Two | Round | B aeolian | 156 | 1:00 | 135692 / 2510308 |
| 15 | Shooter: Stage Three | Round | G dorian | 160 | 0:59 | 132300 / 2447550 |
| 16 | Shooter: The Mothership | Boss | C harmonic minor | 168 | 0:56 | 126000 / 2331000 |
| 17 | Shooter: Challenge Stage | Bonus round | A mixolydian | 152 | 1:02 | 139263 / 2576369 |
| 18 | Shooter: Warp | Intermission | F dorian | 126 | 1:14 | 168000 / 3108000 |
| 19 | Shooter: High Score | High score | G aeolian | 100 | 1:34 | 211680 / 3916080 |
| 20 | Shooter: Start | Start | E aeolian | 152 | 0:09 | one-shot |
| 21 | Shooter: Miss | Miss | D aeolian | 132 | 0:06 | one-shot |
| 22 | Shooter: Game Over | Game over | E harmonic minor | 92 | 0:15 | one-shot |
| 23 | Climber: Attract Mode | Attract mode | F ionian | 124 | 1:15 | 170710 / 3158129 |
| 24 | Climber: Floor One | Round | G ionian | 132 | 1:11 | 160364 / 2966727 |
| 25 | Climber: Floor Two | Round | D mixolydian | 138 | 1:08 | 153391 / 2837739 |
| 26 | Climber: Floor Three | Round | A ionian | 144 | 1:05 | 147000 / 2719500 |
| 27 | Climber: The Top | Boss | B harmonic minor | 150 | 1:02 | 141120 / 2610720 |
| 28 | Climber: Bonus Round | Bonus round | C mixolydian | 160 | 0:59 | 132300 / 2447550 |
| 29 | Climber: Intermission | Intermission | D ionian | 116 | 1:21 | 182483 / 3375931 |
| 30 | Climber: High Score | High score | E ionian | 96 | 1:38 | 220500 / 4079250 |
| 31 | Climber: Start | Start | F ionian | 144 | 0:10 | one-shot |
| 32 | Climber: Miss | Miss | G mixolydian | 120 | 0:07 | one-shot |
| 33 | Climber: Game Over | Game over | C aeolian | 88 | 0:14 | one-shot |
| 34 | Racer: Attract Mode | Attract mode | E mixolydian | 150 | 1:02 | 141120 / 2610720 |
| 35 | Racer: Course One | Round | C dorian | 160 | 0:59 | 132300 / 2447550 |
| 36 | Racer: Course Two | Round | A# mixolydian | 164 | 0:57 | 129073 / 2387854 |
| 37 | Racer: Course Three | Round | C# aeolian | 168 | 0:56 | 126000 / 2331000 |
| 38 | Racer: Final Lap | Final lap | F# dorian | 176 | 0:53 | 120273 / 2225045 |
| 39 | Racer: Bonus Round | Bonus round | A ionian | 172 | 0:54 | 123070 / 2276790 |
| 40 | Racer: Pit Stop | Intermission | D# mixolydian | 128 | 1:13 | 165375 / 3059438 |
| 41 | Racer: High Score | High score | A dorian | 104 | 1:30 | 203538 / 3765462 |
| 42 | Racer: Start | Start | E mixolydian | 160 | 0:08 | one-shot |
| 43 | Racer: Miss | Miss | F# dorian | 140 | 0:06 | one-shot |
| 44 | Racer: Game Over | Game over | C dorian | 96 | 0:13 | one-shot |
| 45 | Insert Coin | Insert coin | C ionian | 160 | 0:08 | one-shot |
| 46 | Extra Life | Extra life | G ionian | 168 | 0:09 | one-shot |

## The theme family

Everything here grows from **5 hand-authored themes**, one studio seed and four cabinet cells:
`coin` climbs the chord from two quick sixteenths, turns and holds: the studio, in every track.
`maze` runs eighths that turn back on themselves, for the maze game. `dive` falls a fourth and climbs back
up three quick steps, for the space shooter. `rung` climbs four steps on a dotted bounce, for the climbing game. `road`
falls two eighths, flicks up and holds, for the racer. Building a family of themes from one cell is an old
composer's method and is not claimed as new here; what this record adds is four complete arcade cue sheets in
one voice and the PSG budget (no part ever holds a chord), each checked in the shipped MIDI.
Every track states at least one of them — in its original form, inverted, backwards, widened or
compressed.

| id | Theme | Built from | Role |
| --- | --- | --- | --- |
| `coin` | Coin | the seed: up a third, up a third, down a step, up a step; ends a fifth up | The studio's signature: a quick climb up the chord that opens on two sixteenths, a turn and a held note. Stated in its own shape in every track on the record, the coin drop included. |
| `maze` | Maze | the maze: up a step, down a step, down a step, up a third; ends a step up | The maze game: running eighths that turn back on themselves, like a corridor that doubles back. Its attract mode, four rounds, bonus round, intermission and high score. |
| `dive` | Dive | the shooter: down a fourth, up a step, up a step, up a step; ends where it began | The space shooter: a dive of a fourth and a quick climb back up three steps. Its attract mode, three stages, the mothership, the challenge stage, the warp and high score. |
| `rung` | Rung | the climber: up a step, up a step, up a step, up a step; ends a fifth up | The climbing game: four steps up on a dotted bounce, a rung at a time. Its attract mode, three floors, the top, bonus round, intermission and high score. |
| `road` | Road | the racer: down a step, down a step, up a third, down a step; ends a step down | The racer: two falling eighths, a flick and a long held note, the engine at speed. Its attract mode, three courses, the final lap, bonus round, intermission and high score. |

## Why the loops actually loop

A track that is **cut** at a bar line rather than **written** to repeat drops the decay of its last bar.
Even with a sample-perfect loop point, if the music has any reverb or natural decay you hear the seam,
because the tail is missing.

Two things were done about that:

1. **Composed to loop.** The final bar is written to sound *into* the loop point, and the harmony
   resolves onto the chord the loop restarts on.
2. **Rendered to loop.** Each track is rendered *past* its loop end, and that decay tail is summed
   back over the head of the loop. The reverb carries across the join instead of being cut at it.

## Engine notes

**RPG Maker MV / MZ** — copy the `.ogg` files into `audio/bgm/`. The loop tags are read
automatically; no plugin and no configuration. Stingers belong in `audio/me/` (victory, defeat)
or `audio/se/`.

**Godot 4** — select the `.ogg`, and in the Import dock tick **Loop** and set **Loop Offset** to the
LOOPSTART figure above divided by 44100 (Godot counts in seconds), then press **Reimport**. Each file
ends exactly at its loop end, so there is no loop-end field to fill.

**Unity** — set the clip to *Streaming* for the long tracks and *Decompress On Load* for the
stingers. Unity has no native loop-point field, so either trim to the loop region or use the
sample values above with a scripted `AudioSource.timeSamples` jump.

**GameMaker** — drop the `.ogg` in as an audio asset. Use the LOOPSTART value with
`audio_sound_loop_start()` (GameMaker counts in seconds; divide by 44100).

**Anything else** — the `.mid` files are plain Standard MIDI Format 1 and will open in any DAW
or tracker.

## How this was verified

No claim here is decorative. The pack ships with the reports that produced these numbers.

| | |
| --- | --- |
| Theory checks | **808 passed, 0 failed** across 46 tracks |
| Audio checks | **510 passed, 0 failed** |
| Distinct keys | 31 |
| Tempo range | 88–176 BPM |
| Instrument palette | 28 instruments across the whole album |
| Slots covered | 12 |
| Theme statements | 6628 across the album |
| Development forms | prime, head, inversion, retrograde, contraction, retrogradeInversion, expansion, retrogradeInversion+expansion |

Every track was checked for key discipline, resolving harmony, voice-leading (no parallel fifths or
octaves between the outer voices), grid alignment, playable instrument ranges, melodic singability,
a varying density curve, and loop-seam continuity. The audio was checked for silence, clipping,
headroom, loudness, and that the loop tags in the **shipped bytes** match the composed loop.

⚠️ **What those numbers are not.** They establish that the music is *technically sound* — correctly
written, correctly rendered, correctly tagged. They are not a claim about taste, and no amount of
them can be. Judge that yourself from the **free four-track preview** — **Maze: Round One**, **Shooter: The Mothership**, **Climber: Floor One** and **Racer: Final Lap**,
complete tracks with their `.mid` sources, downloadable without paying
from the same itch page you got this from: <https://csaf.itch.io/attract-mode>

This record is sold on four complete 1983 arcade cue sheets from one studio, one theme heard in every
track, written to a dual PSG budget where no part ever holds a chord. The four free tracks are one from
each cabinet: "Maze: Round One", "Shooter: The Mothership" (a boss), "Climber: Floor One" and "Racer:
Final Lap". Open any .mid and count the voices: the lead, the counter-line, the arpeggio and the bass
each play one note at a time, the drums sit on channel 10. The full pack's CHANNEL_MAP.md maps every
part of every track to its PSG channel.

## Licence

Royalty-free for commercial and non-commercial games. See `LICENSE.txt` for the exact terms.

---

*Core Systems Asset Factory*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
