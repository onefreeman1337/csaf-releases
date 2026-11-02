# Quiet Hours: A Lofi Score for Every Screen at Every Time of Day — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Quiet Hours: A Lofi Score for Every Screen at Every Time of Day  
**Engine:** MIDI composition from Node (deterministic, theory-checkable) + rendered OGG via a redistribution-cleared soundfont - engine-agnostic music packs. Renderer + soundfont licence gate is the wing's first architecture decision; see Wings/Music/CLAUDE.md 3.  
**Docs published:** 2026-11-02


---

# QUIET HOURS — A LOFI SCORE FOR EVERY SCREEN AT EVERY TIME OF DAY
### 44 tracks, 66:54

Core Systems Asset Factory

---

## What this is

Most game-music packs are a **grab-bag**: tracks bought or bundled together that happen to share a
genre. Drop three of them into one project and the player hears the seams — different rooms,
different instruments, different composers.

**This is an album, not a bag.** 44 tracks across 44 slots, written in
one musical language from one family of 5 hand-authored themes. That is not a
description, it is a measurement: the harness reads the finished MIDI back and counts every statement
of every theme in every track — **2,279** of them here — and the
report is in this download. Your game gets a **score**, not a playlist.

## What you get

- **44 × `.ogg`** — OGG Vorbis, 44.1 kHz stereo, ready to drop in
- **44 × `.mid`** — the **editable MIDI sources**. Re-voice them, re-orchestrate
  them, change the tempo, pull out a single line.
- **Sample-accurate loop metadata** — `LOOPSTART` / `LOOPLENGTH` in the OGG Vorbis comments,
  denominated in samples, which is exactly what **RPG Maker MV / MZ** reads
- **Per-engine import notes** (below)
- **A royalty-free licence** for commercial games (see `LICENSE.txt`)

## The grid

36 full pieces: nine screens (menu, home, garden, workshop, market, map, reading, rain, waiting) at four times of day: pick the row for your time of
day and the track in it for your screen. The rain pieces are written for a rainy screen and carry no rain sound.

- **Morning:** 100 BPM, 40 bar loop, 96.0 seconds, all in the seven notes of D major.
- **Afternoon:** 86 BPM, 40 bar loop, 111.6 seconds, all in the seven notes of G major.
- **Evening:** 74 BPM, 32 bar loop, 103.8 seconds, all in the seven notes of C major.
- **Night:** 60 BPM, 24 bar loop, 96.0 seconds, all in the seven notes of F major.

Each row has one track for each of the nine screens. The "Track list" section gives every track its number, slot and key.

## One clock per time of day

All nine pieces of a time of day have the same tempo, the same two bar intro and the same loop length, so their
LOOPSTART and LOOPLENGTH tags are identical to the sample. `shelf_clock_proof.json` lists them, and the tests read the same
figures back out of every shipped OGG.
Because the clocks match, you can start two of them together, one muted, and fade between them at any moment: from the home
piece to the market piece and back without the beat moving.

In Godot 4, use an `AudioStreamSynchronized`: set `stream_count`, then `set_sync_stream(0, home)` and `set_sync_stream(1, market)`, and
move `set_sync_stream_volume` to fade. The test here loaded a whole row and a drumless file into one and read back their lengths and
volumes; it ran with no audio device, so it played nothing. In another engine, start both sounds in the same call; how tightly they
stay together after that depends on that engine's audio, and was not tested here.

Every track is levelled to -22 LUFS, and nothing on the record had to be held back to reach it, so a fade between two pieces
holds its level. That is lower than the -16 LUFS this studio's other packs use: it leaves room over the music, and your engine's volume can raise it.

## One scale per time of day

Every pitched note of a time of day is one of the same seven notes. The pieces take different modes of those notes, so they do not
all sit on one home note, but no chord or melody uses a note from outside its time of day's seven, and no borrowed chord appears anywhere
on this record. Each row is a fifth under the one before, so neighbouring rows differ by exactly one note. Fading between two
pieces of a row adds no note outside that row's seven. The two pieces may still be on different chords while they overlap.

## Drumless versions

Every full piece also ships without its drums, in `stems/` (36 OGG files, each with its `.mid`). A drumless file has the same
loop tags as the full piece and the same gain, so it sits on the same clock and can be faded against it. The dust layer is in both.

## How it is made

The keys play four note voicings with the third, fifth, seventh and ninth, and leave the root to the bass (680 chords on the record; on the
53 chords where a ninth would sit a semitone above the root, the root takes the ninth's place). The bass opens 631 of its 644
chords on the root and the rest on another tone of the chord. Every track swings its off beats 3:2.
The drums are five sounds with no cymbal: kick, side stick, snare, closed hat and shaker. Morning and afternoon use the soundfont's
Room drum kit, evening and night its Brush kit. The backbeat sits 10 ticks behind the grid (480 ticks to the quarter note).

The tape wobble is written into the `.mid` as pitch bend on every pitched part: two slow sine curves, periods of one and two bars,
3 cents each, 5.1 cents at their deepest together, and it reads the same at the loop start and the loop end. Delete the pitch bend events to remove it.
The dust is a synthesised hiss and crackle added to the OGG files only, the same loop for every full piece of a time of day (each cue
has its own, fading out with it). The `.mid` files carry no dust. The music is low passed at 9 kHz before the dust goes on, and the
dust has filters of its own, lower still: the hiss at 5.5 kHz, the crackle at 7 kHz.

### Instruments

Every note is a General MIDI program, rendered through the GeneralUser GS soundfont. The `.mid` files are the real sources: load
them into your own instruments to replace any part. No song is quoted anywhere on this record; every tune on it was composed for it.

## Track list

| # | Title | Slot | Key | BPM | Length | LOOPSTART / LOOPLENGTH |
| --- | --- | --- | --- | --- | --- | --- |
|  1 | First Light | Menu, morning | D ionian | 100 | 1:41 | 211680 / 4233600 |
|  2 | Kettle On | Home, morning | G lydian | 100 | 1:41 | 211680 / 4233600 |
|  3 | Dew on the Beans | Garden, morning | A mixolydian | 100 | 1:41 | 211680 / 4233600 |
|  4 | Sawdust and Coffee | Workshop, morning | E dorian | 100 | 1:41 | 211680 / 4233600 |
|  5 | The Stall Opens at Eight | Market, morning | D ionian | 100 | 1:41 | 211680 / 4233600 |
|  6 | The Short Way to the Bakery | Map, morning | A mixolydian | 100 | 1:41 | 211680 / 4233600 |
|  7 | Homework on the Porch | Reading, morning | B aeolian | 100 | 1:41 | 211680 / 4233600 |
|  8 | Sun Shower | Rain, morning | E dorian | 100 | 1:41 | 211680 / 4233600 |
|  9 | The Bus Is Late | Waiting, morning | G lydian | 100 | 1:41 | 211680 / 4233600 |
| 10 | Long Lunch | Menu, afternoon | C lydian | 86 | 1:57 | 246140 / 4922790 |
| 11 | Cat on the Windowsill | Home, afternoon | G ionian | 86 | 1:57 | 246140 / 4922790 |
| 12 | Weeding Slowly | Garden, afternoon | A dorian | 86 | 1:57 | 246140 / 4922790 |
| 13 | Second Coat of Paint | Workshop, afternoon | D mixolydian | 86 | 1:57 | 246140 / 4922790 |
| 14 | Exact Change | Market, afternoon | G ionian | 86 | 1:57 | 246140 / 4922790 |
| 15 | Bicycle Through Town | Map, afternoon | C lydian | 86 | 1:57 | 246140 / 4922790 |
| 16 | Library Hours | Reading, afternoon | A dorian | 86 | 1:57 | 246140 / 4922790 |
| 17 | Rain on the Awning | Rain, afternoon | E aeolian | 86 | 1:57 | 246140 / 4922790 |
| 18 | Waiting on the Laundry | Waiting, afternoon | D mixolydian | 86 | 1:57 | 246140 / 4922790 |
| 19 | Golden Hour | Menu, evening | D dorian | 74 | 1:50 | 286054 / 4576865 |
| 20 | Something on the Stove | Home, evening | C ionian | 74 | 1:50 | 286054 / 4576865 |
| 21 | Watering Before Dark | Garden, evening | A aeolian | 74 | 1:50 | 286054 / 4576865 |
| 22 | Just One More Repair | Workshop, evening | D dorian | 74 | 1:50 | 286054 / 4576865 |
| 23 | Closing Up the Stall | Market, evening | G mixolydian | 74 | 1:50 | 286054 / 4576865 |
| 24 | Streetlights Coming On | Map, evening | F lydian | 74 | 1:50 | 286054 / 4576865 |
| 25 | Letters to Answer | Reading, evening | A aeolian | 74 | 1:50 | 286054 / 4576865 |
| 26 | Storm Far Off | Rain, evening | A aeolian | 74 | 1:50 | 286054 / 4576865 |
| 27 | Bread in the Oven | Waiting, evening | C ionian | 74 | 1:50 | 286054 / 4576865 |
| 28 | Quiet Hours | Menu, night | D aeolian | 60 | 1:44 | 352800 / 4233600 |
| 29 | Lamp Still On | Home, night | F ionian | 60 | 1:44 | 352800 / 4233600 |
| 30 | Fireflies Over the Rows | Garden, night | G dorian | 60 | 1:44 | 352800 / 4233600 |
| 31 | Bench by Moonlight | Workshop, night | C mixolydian | 60 | 1:44 | 352800 / 4233600 |
| 32 | The All Night Counter | Market, night | G dorian | 60 | 1:44 | 352800 / 4233600 |
| 33 | Last Bus Home | Map, night | D aeolian | 60 | 1:44 | 352800 / 4233600 |
| 34 | One More Chapter | Reading, night | F ionian | 60 | 1:44 | 352800 / 4233600 |
| 35 | Rain on a Tin Roof | Rain, night | D aeolian | 60 | 1:44 | 352800 / 4233600 |
| 36 | Three A.M. Loading Screen | Waiting, night | G dorian | 60 | 1:44 | 352800 / 4233600 |
| 37 | Alarm Clock | Wake stinger | D ionian | 100 | 0:13 | one-shot |
| 38 | Task Done | Task stinger | A mixolydian | 100 | 0:13 | one-shot |
| 39 | Found Something | Found stinger | C lydian | 86 | 0:14 | one-shot |
| 40 | Wages | Paid stinger | G ionian | 86 | 0:14 | one-shot |
| 41 | Level Up | Level stinger | D dorian | 74 | 0:16 | one-shot |
| 42 | Journal Saved | Save stinger | C ionian | 74 | 0:16 | one-shot |
| 43 | Lights Out | Sleep stinger | D aeolian | 60 | 0:19 | one-shot |
| 44 | New Day | New day stinger | F ionian | 60 | 0:19 | one-shot |

## The theme family

Everything here grows from **5 hand-authored themes**, one seed and four things done to it:
`hour` lifts a third and sinks one step past where it began. `kettle` is the seed turned over, for
the home and the garden. `errand` zigzags in eighths, for the workshop and the market, and carries the swing most plainly. `stoop` steps
down twice and reaches up a fourth, for the map and the waiting. `page` is a slow arch that comes home, for the reading and the rain.
Building a family of themes from one cell is an old composer's method and is not claimed as new here; what this record adds is the
shared clock and the shared scale on each time of day, each checked in the shipped files.
Every track states at least one of them — in its original form, inverted, backwards, widened or
compressed.

| id | Theme | Built from | Role |
| --- | --- | --- | --- |
| `hour` | Hour | the seed: up a third, down a step, down a step, down a step; ends a step down | The whole record, and the seed of every other cell. A small lift that sinks one step past where it began. Stated in its own shape in every track. |
| `kettle` | Kettle | the seed turned over: down a third, up a step, up a step, up a step; ends a step up | The home and the garden. The seed inverted, so it dips and climbs back past where it began. |
| `errand` | Errand | the errand: up a step, down a step, up a third, down a step; ends a step up | The workshop and the market. The only cell in eighths, so it carries the swing most plainly. |
| `stoop` | Stoop | the stoop: down a step, down a step, up a fourth, down a step; ends where it began | The map and the waiting. Two steps down, a reach of a fourth, one step back: the only cell with a leap that wide. |
| `page` | Page | the page: up a step, up a third, down a step, down a third; ends where it began | The reading and the rain. A slow arch that comes home, and the only cell that opens on a long note. |

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
| Theory checks | **784 passed, 0 failed** across 44 tracks |
| Audio checks | **504 passed, 0 failed** |
| Distinct keys | 19 |
| Tempo range | 60–100 BPM |
| Instrument palette | 28 instruments across the whole album |
| Slots covered | 44 |
| Theme statements | 2279 across the album |
| Development forms | head, prime, inversion, retrograde, contraction, retrogradeInversion, expansion, retrogradeInversion+expansion |

Every track was checked for key discipline, resolving harmony, voice-leading (no parallel fifths or
octaves between the outer voices), grid alignment, playable instrument ranges, melodic singability,
a varying density curve, and loop-seam continuity. The audio was checked for silence, clipping,
headroom, loudness, and that the loop tags in the **shipped bytes** match the composed loop.

⚠️ **What those numbers are not.** They establish that the music is *technically sound* — correctly
written, correctly rendered, correctly tagged. They are not a claim about taste, and no amount of
them can be. Judge that yourself from the **free four-track preview** — **First Light**, **Exact Change**, **Letters to Answer** and **Quiet Hours**,
complete tracks with their `.mid` sources, downloadable without paying
from the same itch page you got this from: <https://csaf.itch.io/quiet-hours>

This record is sold on one theme across nine screens and four times of day. The four free tracks are
one from each time of day: "First Light" (menu, morning), "Exact Change" (market, afternoon),
"Letters to Answer" (reading, evening) and "Quiet Hours" (menu, night). Open any .mid and look at the keys and the bass.

## Licence

Royalty-free for commercial and non-commercial games. See `LICENSE.txt` for the exact terms.

---

*Core Systems Asset Factory*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
