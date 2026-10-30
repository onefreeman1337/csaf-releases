# Compliance — A Megacorp Dystopia Score — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Compliance — A Megacorp Dystopia Score  
**Engine:** MIDI composition from Node (deterministic, theory-checkable) + rendered OGG via a redistribution-cleared soundfont - engine-agnostic music packs. Renderer + soundfont licence gate is the wing's first architecture decision; see Wings/Music/CLAUDE.md 3.  
**Docs published:** 2026-10-30


---

# COMPLIANCE — A MEGACORP DYSTOPIA SCORE
### 44 tracks, 58:07

Core Systems Asset Factory

---

## What this is

Most game-music packs are a **grab-bag**: tracks bought or bundled together that happen to share a
genre. Drop three of them into one project and the player hears the seams — different rooms,
different instruments, different composers.

**This is an album, not a bag.** 44 tracks across 44 slots, written in
one musical language from one family of 6 hand-authored themes. That is not a
description, it is a measurement: the harness reads the finished MIDI back and counts every statement
of every theme in every track — **3,535** of them here — and the
report is in this download. Your game gets a **score**, not a playlist.

## What you get

- **44 × `.ogg`** — OGG Vorbis, 44.1 kHz stereo, ready to drop in
- **44 × `.mid`** — the **editable MIDI sources**. Re-voice them, re-orchestrate
  them, change the tempo, pull out a single line.
- **Sample-accurate loop metadata** — `LOOPSTART` / `LOOPLENGTH` in the OGG Vorbis comments,
  denominated in samples, which is exactly what **RPG Maker MV / MZ** reads
- **Per-engine import notes** (below)
- **A royalty-free licence** for commercial games (see `LICENSE.txt`)

## The clock

A side stick ticks on every beat of every bar of tracks 1 to 39, 4564 ticks in all, from the welcome video to the
last system sound. It stops at track 40, "Service Tunnels", the moment the record leaves the building. It is a quiet
part of its own: in the .mid it is the track named `clock` on channel 10, so you can drop it and re-render if a scene wants
the music without it. In the OGG renders it is baked in.

## The voice

Choir aahs and voice oohs sound in the last 5 tracks (749 notes) and in no other track. Until then the only voice on
the record is a synth voice. Those last 5 tracks use no synth at all: piano, strings, harp, flute and voices.

## The decay

The harmony slows down act by act and then starts again outside. Read the pad and bass parts of any full piece:

- Onboarding: a new chord every bar
- The Floors: a new chord every 2 bars
- The Audit: a new chord every 4 bars
- The Purge: a new chord every 8 bars
- Outside: a new chord every bar

So the chords move every bar on the first day and hold for eight bars in the purge, where the pace comes from the
ostinato and the lead instead. The act of each track is listed in album.json, under tracks[].act.

## Long loops

Office and investigation scenes stay on one screen for a long time, so all 38 full pieces loop for at least a
minute before they repeat (the shortest loop is 62.2 seconds; read the LOOPSTART and LOOPLENGTH tags in any .ogg).
8 of the faster pieces carry a third section so their loop stays over the minute.

### Instruments

Every sound is one of 31 General MIDI programs, rendered through the GeneralUser GS soundfont, named here
by their General MIDI names, plus the side stick of the General MIDI drum kit for the clock. There is no other drum.

Keys and mallets: acoustic grand piano, electric piano, vibraphone, marimba and tubular bells.
Strings: violin, viola, cello, contrabass, tremolo strings, harp, string ensemble, slow strings and finger bass.
Winds and brass: clarinet, flute, muted trumpet and brass section.
Synths: synth bass 1, synth bass 2, synth strings, synth voice, synth brass, square lead, sawtooth lead, polysynth pad, halo pad and crystal.
Voices: choir aahs and voice oohs.
Percussion: timpani.

The `.mid` files are the real sources: load them into your own instruments to replace any part. No game, book or film cue
is quoted anywhere on this record; every tune on it was composed for it.

## Track list

| # | Title | Slot | Key | BPM | Length | LOOPSTART / LOOPLENGTH |
| --- | --- | --- | --- | --- | --- | --- |
|  1 | Welcome to the Company | Title / main theme | C ionian | 92 | 1:13 | 230087 / 2991130 |
|  2 | The Atrium | Atrium | F lydian | 80 | 1:21 | 264600 / 3307500 |
|  3 | Visitor Badge | Lobby | G ionian | 96 | 1:10 | 220500 / 2866500 |
|  4 | Elevator Music | Elevator | D ionian | 84 | 1:23 | 252000 / 3402000 |
|  5 | Orientation Video | Orientation | A lydian | 100 | 1:10 | 211680 / 2857680 |
|  6 | The Mission Statement | Mission statement | E ionian | 72 | 1:37 | 441000 / 3822000 |
|  7 | Company Anthem | Company anthem | A# ionian | 104 | 1:35 | 203538 / 3969000 |
|  8 | Please Hold | Hold music | D lydian | 88 | 1:11 | 240545 / 2886546 |
|  9 | Open Plan | Open plan office | G mixolydian | 100 | 1:31 | 211680 / 3810240 |
| 10 | Data Entry | Data entry | E dorian | 112 | 1:26 | 189000 / 3591000 |
| 11 | The Quota | Quota | A mixolydian | 108 | 1:07 | 196000 / 2744000 |
| 12 | The Canteen | Canteen | C dorian | 92 | 1:18 | 230087 / 3221217 |
| 13 | The Break Room | Break room | F mixolydian | 76 | 1:38 | 417789 / 3899369 |
| 14 | Performance Review | Staff review | B dorian | 84 | 1:20 | 252000 / 3276000 |
| 15 | Overtime | Overtime | G dorian | 72 | 1:43 | 441000 / 4116000 |
| 16 | The Server Hall | Server hall | D mixolydian | 96 | 1:35 | 220500 / 3969000 |
| 17 | Night Shift | Night shift | A dorian | 66 | 1:53 | 481091 / 4490182 |
| 18 | Surveillance | Surveillance | E aeolian | 72 | 1:57 | 441000 / 4704000 |
| 19 | Flagged | Flagged | C aeolian | 84 | 1:37 | 252000 / 4032000 |
| 20 | The Auditor | Auditor | F# aeolian | 76 | 1:35 | 278526 / 3899369 |
| 21 | Interview Room | Interview room | B phrygian | 64 | 2:11 | 496125 / 5292000 |
| 22 | The File Store | File store | G aeolian | 60 | 2:04 | 529200 / 4939200 |
| 23 | Dead Files | Dead files | D phrygian | 66 | 1:38 | 481091 / 3848727 |
| 24 | Someone Is Listening | Listening | D# aeolian | 78 | 1:45 | 271385 / 4342153 |
| 25 | Camera Corridor | Stealth | A phrygian | 96 | 1:25 | 220500 / 3528000 |
| 26 | Clearance Revoked | Clearance revoked | C# aeolian | 100 | 1:22 | 211680 / 3386880 |
| 27 | Lockdown | Lockdown | E phrygian | 116 | 1:10 | 182483 / 2919724 |
| 28 | Security Sweep | Battle | A aeolian | 128 | 1:34 | 165375 / 3969000 |
| 29 | Containment | Containment | C phrygian | 120 | 1:08 | 176400 / 2822400 |
| 30 | Termination | Hard battle | D aeolian | 136 | 1:32 | 311294 / 3735530 |
| 31 | The Drones | Drones | F phrygian | 110 | 1:14 | 192436 / 3078982 |
| 32 | The Boardroom | Boardroom | G aeolian | 84 | 1:37 | 252000 / 4032000 |
| 33 | The Chairman | Final boss | B phrygian | 132 | 1:31 | 160364 / 3848727 |
| 34 | Access Granted | Access granted | C ionian | 100 | 0:15 | one-shot |
| 35 | Access Denied | Access denied | E phrygian | 100 | 0:13 | one-shot |
| 36 | Incident Logged | Incident sting | A aeolian | 84 | 0:17 | one-shot |
| 37 | Quota Met | Victory stinger | G lydian | 108 | 0:15 | one-shot |
| 38 | Terminated | Defeat stinger | D phrygian | 60 | 0:22 | one-shot |
| 39 | Security Alert | Alert sting | B aeolian | 120 | 0:11 | one-shot |
| 40 | Service Tunnels | Tunnels | E dorian | 88 | 1:19 | 240545 / 3247364 |
| 41 | The Loading Dock | Loading dock | A dorian | 96 | 1:13 | 220500 / 2976750 |
| 42 | The Perimeter Fence | Perimeter | D mixolydian | 112 | 1:30 | 189000 / 3780000 |
| 43 | Daylight | Daylight | G ionian | 80 | 1:27 | 264600 / 3572100 |
| 44 | Exit Interview | Credits | C ionian | 72 | 1:37 | 441000 / 3822000 |

## The theme family

Everything here grows from **6 hand-authored themes**, one seed and five cells beside it:
`chime` climbs a chord and comes home: the company's sign-on chime, in every track.
`memo` is four even quarters for the working day: the quota, the canteen, the break room, overtime.
`form` is two neighbouring notes and nowhere to go, for repetition: open plan, data entry, the auditor, the file store.
`watch` opens on two half notes, a lens turning: surveillance, the interview room, someone listening, the corridor.
`purge` is two climbing fourths, each taken back by a third, for force: lockdown, the sweep, termination, the chairman.
`daylight` opens on a dotted quarter and climbs a fourth: the tunnels, the dock, the fence, the morning.
Building a family of themes from one cell is an old composer's method and is not claimed as new here; what this
record adds is a clock on every beat until the record leaves the building, the first human voice after it, and
a harmony that slows act by act and starts again outside, each checked in the shipped files.
Every track states at least one of them — in its original form, inverted, backwards, widened or
compressed.

| id | Theme | Built from | Role |
| --- | --- | --- | --- |
| `chime` | The Chime | the chime: up a third, up a third, down a step, down a fourth; ends where it began | The company: the sign-on chime, climbing a chord and coming home. Stated in its own shape in every track, from the welcome video to the last thing sung outside the building. |
| `memo` | The Memo | the memo: up a step, up a step, up a step, down a third; ends a step up | The working day: the quota, the canteen, the break room, overtime. Four even quarters, a small climb and a small correction. |
| `form` | The Form | the form: up a step, down a step, up a step, down a step; ends where it began | Repetition: open plan, data entry, the auditor, the file store. Two neighbouring notes and nowhere to go. The only cell that opens on four quick eighths. |
| `watch` | The Watch | the watch: down a step, down a third, up a step, down a step; ends a fourth down | Being observed: surveillance, the interview room, someone listening, the camera corridor. The only cell that opens on two half notes, a lens turning. |
| `purge` | The Purge | the purge: up a fourth, down a third, up a fourth, down a third; ends a third up | Force: lockdown, the sweep, termination, the chairman. Two climbing fourths, each taken back by a third. The only cell built of leaps. |
| `daylight` | Daylight | daylight: up a step, up a third, up a step, down a step; ends a fourth up | Outside: the tunnels, the loading dock, the fence, the morning. The only cell that opens on a dotted quarter and the only one that climbs a fourth. |

## Why the loops actually loop

A track that is **cut** at a bar line rather than **written** to repeat drops the decay of its last bar.
Even with a sample-perfect loop point, if the music has any reverb or natural decay you hear the seam,
because the tail is missing.

Two things were done about that:

1. **Composed to loop.** The final bar is written to sound *into* the loop point. On all 38 loops the last
   chord is the chord the loop restarts on.
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
| Theory checks | **788 passed, 0 failed** across 44 tracks |
| Audio checks | **510 passed, 0 failed** |
| Distinct keys | 33 |
| Tempo range | 60–136 BPM |
| Instrument palette | 31 instruments across the whole album |
| Slots covered | 44 |
| Theme statements | 3535 across the album |
| Development forms | prime, retrograde, head, inversion, contraction, prime+expansion, inversion+expansion, expansion, retrogradeInversion, inversion+contraction, prime+contraction |

Every track was checked for key discipline, resolving harmony, voice-leading (no parallel fifths or
octaves between the outer voices), grid alignment, playable instrument ranges, melodic singability,
a varying density curve, and loop-seam continuity. The audio was checked for silence, clipping,
headroom, loudness, and that the loop tags in the **shipped bytes** match the composed loop.

⚠️ **What those numbers are not.** They establish that the music is *technically sound* — correctly
written, correctly rendered, correctly tagged. They are not a claim about taste, and no amount of
them can be. Judge that yourself from the **free three-track preview** — **The Atrium**, **The Chairman** and **Daylight**,
complete tracks with their `.mid` sources, downloadable without paying
from the same itch page you got this from: <https://csaf.itch.io/compliance>

This record is sold on a clock that ticks on every beat until the record leaves the building, on the first human voice
after it, and on a harmony that slows act by act. The three free tracks are "The Atrium" (a new chord every bar),
"The Chairman" (a new chord every eight bars) and "Daylight" (no clock, voices, a new chord every bar again).
Open their .mid files and read the part named clock in the first two; the third has none.

## Licence

Royalty-free for commercial and non-commercial games. See `LICENSE.txt` for the exact terms.

---

*Core Systems Asset Factory*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
