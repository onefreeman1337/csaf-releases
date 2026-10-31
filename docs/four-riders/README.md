# Four Riders — A Western Score — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Four Riders — A Western Score  
**Engine:** MIDI composition from Node (deterministic, theory-checkable) + rendered OGG via a redistribution-cleared soundfont - engine-agnostic music packs. Renderer + soundfont licence gate is the wing's first architecture decision; see Wings/Music/CLAUDE.md 3.  
**Docs published:** 2026-10-31


---

# FOUR RIDERS — A WESTERN SCORE
### 44 tracks, 63:10

Core Systems Asset Factory

---

## What this is

Most game-music packs are a **grab-bag**: tracks bought or bundled together that happen to share a
genre. Drop three of them into one project and the player hears the seams — different rooms,
different instruments, different composers.

**This is an album, not a bag.** 44 tracks across 44 slots, written in
one musical language from one family of 7 hand-authored themes. That is not a
description, it is a measurement: the harness reads the finished MIDI back and counts every statement
of every theme in every track — **2,149** of them here — and the
report is in this download. Your game gets a **score**, not a playlist.

## What you get

- **44 × `.ogg`** — OGG Vorbis, 44.1 kHz stereo, ready to drop in
- **44 × `.mid`** — the **editable MIDI sources**. Re-voice them, re-orchestrate
  them, change the tempo, pull out a single line.
- **Sample-accurate loop metadata** — `LOOPSTART` / `LOOPLENGTH` in the OGG Vorbis comments,
  denominated in samples, which is exactly what **RPG Maker MV / MZ** reads
- **Per-engine import notes** (below)
- **A royalty-free licence** for commercial games (see `LICENSE.txt`)

## The cast

This record is cast like a film. Each of the four riders has one instrument, and that instrument sounds only in the scenes that rider is in.
When a rider is in a scene, the rider's own theme is stated there, in the rider's own part.

- The Stranger: harmonica (General MIDI program 22), 13 tracks
- The Outlaw: clean electric guitar (General MIDI program 27), 12 tracks
- The Marshal: French horn (General MIDI program 60), 12 tracks
- The Widow: cello (General MIDI program 42), 13 tracks

So a cutscene can be scored by who is in it. album.json lists the riders of every track under tracks[].riders.

## The land

A whistle leads the 7 empty-land tracks (Open Range, Red Mesa, Big Sky, Cattle Drive, The Canyon, Ghost Town and Sundown), which hold no rider. It sounds nowhere else on the record, so
when the whistle plays, nobody is around.

## The meeting

All four instruments sound together in exactly three tracks: Four Riders, The Standoff and Four Roads Out. In those three the tune passes from rider to rider,
section by section, each one stating their own theme. In the .mid the later riders' lines are parts of their own, named lead-outlaw, lead-marshal,
lead-widow and lead-stranger, each on its own channel and seat.

## Hoofbeats

5 riding tracks carry a hoofbeat part: woodblocks, 1128 hits in all (The Long Ride, Stagecoach, Cattle Drive, Riders on the Ridge and The Posse). It is the only part on the drum
channel. In the .mid it is the track named `hooves` on channel 10, so you can drop it and re-render if a scene wants the
music without the horse. In the OGG renders it is baked in.

## Scene sheet

01. Four Riders: all four
02. Open Range: the land, no rider
03. Red Mesa: the land, no rider
04. Big Sky: the land, no rider
05. The Stranger: The Stranger
06. The Marshal: The Marshal
07. The Widow: The Widow
08. The Outlaw: The Outlaw
09. Main Street: The Marshal and The Widow
10. The Silver Dollar: The Stranger
11. Five Card Hand: The Stranger and The Outlaw
12. General Store: no rider
13. Barn Dance: no rider
14. Sunday Service: The Widow
15. The Homestead: The Widow and The Stranger
16. Sheriff's Office: The Marshal
17. Border Cantina: no rider
18. The Railroad Comes: The Marshal
19. Town at Night: The Stranger and The Widow
20. Campfire: The Stranger
21. The Long Ride: The Stranger
22. Stagecoach: no rider
23. Cattle Drive: the land, no rider
24. The Canyon: the land, no rider
25. The Old Mine: no rider
26. Ghost Town: the land, no rider
27. Riders on the Ridge: The Outlaw
28. The Bank Job: The Outlaw
29. The Posse: The Marshal and The Stranger
30. Canyon Ambush: The Outlaw and The Stranger
31. Train Robbery: The Outlaw and The Marshal
32. The Jailbreak: The Outlaw and The Widow
33. The Gallows: The Marshal and The Widow
34. The Standoff: all four
35. Last Stand at the Pass: The Outlaw and The Marshal
36. Boot Hill: The Widow
37. Sundown: the land, no rider
38. Four Roads Out: all four
39. Wanted: The Outlaw
40. The Draw: The Stranger
41. Gold Strike: no rider
42. New Day: The Widow
43. Justice: The Marshal
44. Six Feet Under: The Widow

## Loops

All 38 full pieces loop, the shortest for 52.0 seconds (read the LOOPSTART and LOOPLENGTH tags in any .ogg).

### Instruments

Every sound is one of 29 General MIDI programs, rendered through the GeneralUser GS soundfont, named here by their General MIDI
names, plus the two woodblocks of the General MIDI drum kit for the hoofbeats.

Keys and accordion: acoustic grand piano, honky-tonk piano and tango accordion.
Guitars and plucked: nylon guitar, steel guitar, clean electric guitar, banjo and harp.
Strings: violin, viola, cello, contrabass, acoustic bass, tremolo strings, string ensemble and slow strings.
Winds and brass: harmonica, whistle, clarinet, bassoon, trumpet, trombone, tuba, French horn and brass section.
Voices: choir aahs and voice oohs.
Bells and drums: tubular bells and timpani.

The `.mid` files are the real sources: load them into your own instruments to replace any part. No game or film cue is quoted anywhere on this
record; every tune on it was composed for it.

## Track list

| # | Title | Slot | Key | BPM | Length | LOOPSTART / LOOPLENGTH |
| --- | --- | --- | --- | --- | --- | --- |
|  1 | Four Riders | Title / main theme | G mixolydian | 100 | 1:46 | 211680 / 4445280 |
|  2 | Open Range | Field / overworld | G ionian | 88 | 1:27 | 240545 / 3608182 |
|  3 | Red Mesa | Mesa | E dorian | 72 | 1:50 | 441000 / 4410000 |
|  4 | Big Sky | Prairie | D mixolydian | 76 | 1:41 | 278526 / 4177895 |
|  5 | The Stranger | Stranger theme | A aeolian | 66 | 2:00 | 481091 / 4810909 |
|  6 | The Marshal | Marshal theme | D ionian | 84 | 1:26 | 252000 / 3528000 |
|  7 | The Widow | Widow theme | C aeolian | 76 | 1:32 | 313342 / 3760105 |
|  8 | The Outlaw | Outlaw theme | E phrygian | 92 | 1:13 | 230087 / 2991130 |
|  9 | Main Street | Town / village | G ionian | 96 | 1:50 | 220500 / 4630500 |
| 10 | The Silver Dollar | Saloon | F mixolydian | 126 | 1:01 | 168000 / 2520000 |
| 11 | Five Card Hand | Card game | D dorian | 88 | 2:05 | 240545 / 5292000 |
| 12 | General Store | Shop | C ionian | 112 | 1:04 | 189000 / 2646000 |
| 13 | Barn Dance | Barn dance | D ionian | 116 | 0:59 | 205293 / 2395086 |
| 14 | Sunday Service | Church | F ionian | 60 | 2:04 | 529200 / 4939200 |
| 15 | The Homestead | Homestead | D ionian | 88 | 1:57 | 270614 / 4871045 |
| 16 | Sheriff's Office | Sheriff's office | A dorian | 80 | 1:30 | 264600 / 3704400 |
| 17 | Border Cantina | Border | A harmonic minor | 120 | 1:00 | 176400 / 2469600 |
| 18 | The Railroad Comes | Railroad | C mixolydian | 128 | 0:56 | 165375 / 2315250 |
| 19 | Town at Night | Town at night | D aeolian | 64 | 2:43 | 248063 / 6945750 |
| 20 | Campfire | Campfire | A ionian | 70 | 1:53 | 453600 / 4536000 |
| 21 | The Long Ride | Riding | E dorian | 104 | 1:09 | 152654 / 2900423 |
| 22 | Stagecoach | Stagecoach | G ionian | 120 | 0:57 | 198450 / 2315250 |
| 23 | Cattle Drive | Cattle drive | A mixolydian | 96 | 1:20 | 220500 / 3307500 |
| 24 | The Canyon | Canyon | F# dorian | 66 | 2:00 | 481091 / 4810909 |
| 25 | The Old Mine | Mine | C# phrygian | 60 | 2:04 | 529200 / 4939200 |
| 26 | Ghost Town | Ghost town | B phrygian | 56 | 2:21 | 567000 / 5670000 |
| 27 | Riders on the Ridge | Riders approach | A aeolian | 120 | 0:56 | 176400 / 2293200 |
| 28 | The Bank Job | Heist | E aeolian | 108 | 1:02 | 196000 / 2548000 |
| 29 | The Posse | Battle | D aeolian | 132 | 1:16 | 160364 / 3207272 |
| 30 | Canyon Ambush | Hard battle | B aeolian | 140 | 1:07 | 151200 / 2797200 |
| 31 | Train Robbery | Train battle | C# harmonic minor | 152 | 1:02 | 139263 / 2576369 |
| 32 | The Jailbreak | Jailbreak | G aeolian | 124 | 1:17 | 170710 / 3243484 |
| 33 | The Gallows | Gallows | F# aeolian | 58 | 3:06 | 547448 / 7664276 |
| 34 | The Standoff | Showdown | A harmonic minor | 72 | 2:27 | 294000 / 6174000 |
| 35 | Last Stand at the Pass | Boss | D harmonic minor | 148 | 1:03 | 143027 / 2646000 |
| 36 | Boot Hill | Graveyard | D aeolian | 54 | 2:10 | 441000 / 5292000 |
| 37 | Sundown | Sunset | C ionian | 66 | 2:00 | 481091 / 4810909 |
| 38 | Four Roads Out | Credits | G ionian | 84 | 2:06 | 252000 / 5292000 |
| 39 | Wanted | Wanted sting | E phrygian | 96 | 0:16 | one-shot |
| 40 | The Draw | Draw sting | A harmonic minor | 80 | 0:19 | one-shot |
| 41 | Gold Strike | Treasure sting | G ionian | 120 | 0:17 | one-shot |
| 42 | New Day | Rest stinger | F ionian | 72 | 0:20 | one-shot |
| 43 | Justice | Victory stinger | D ionian | 108 | 0:14 | one-shot |
| 44 | Six Feet Under | Defeat stinger | D aeolian | 60 | 0:24 | one-shot |

## The theme family

Everything here grows from **7 hand-authored themes**, one seed and six cells beside it:
`trail` is an open fifth and a walk back down it: the territory itself, in every track.
`stranger` opens on a half note, then dips and reaches: harmonica.
`outlaw` opens on two quick eighths, thrown up a fourth and let fall: clean electric guitar.
`marshal` is a fourth, a correction, a higher reach, and a landing on a long note: French horn.
`widow` opens on a dotted quarter, falling in steps, and ends lower than it began: cello.
`land` is the slowest, reaching up a fifth twice and coming home: the whistle, on the empty land.
`folk` is four even quarters for everyone else: the store, the dance, the mine.
Giving each character an instrument and a theme is an old film composer's method and is not claimed as new here; what this
record adds is that the casting is strict and checked in the shipped files: a rider's instrument sounds only in that rider's
scenes, a whistle only on the empty land, and all four together in exactly three tracks.
Every track states at least one of them — in its original form, inverted, backwards, widened or
compressed.

| id | Theme | Built from | Role |
| --- | --- | --- | --- |
| `trail` | The Trail | the trail: up a fifth, down a step, down a third, up a step; ends a third up | The territory itself: an open fifth and a walk back down it. Stated in its own shape in every track, from the title to the last cue. |
| `stranger` | The Stranger | the stranger: down a third, up a fourth, down a step, down a step; ends a step down | Harmonica. A lone figure: the only rider whose cell opens on a half note, then a dip and a reach it never quite holds. |
| `outlaw` | The Outlaw | the outlaw: up a fourth, down a step, down a step, down a fourth; ends a third down | Clean electric guitar. Swagger: the only cell that opens on two quick eighths, thrown up a fourth and let fall. |
| `marshal` | The Marshal | the marshal: up a fourth, down a step, up a third, down a fourth; ends a step up | French horn. A call to order: a fourth, a correction, a higher reach, and a landing on a long note. |
| `widow` | The Widow | the widow: down a step, down a step, up a third, down a fourth; ends a fourth down | Cello. The only rider whose cell starts by falling in steps, on a dotted quarter, and ends lower than it began. |
| `land` | The Land | the land: up a fifth, down a third, up a third, down a fifth; ends where it began | The whistle, on the empty-land tracks. The slowest cell: it reaches up a fifth twice and comes home. |
| `folk` | Town Folk | town folk: up a step, up a step, down a third, up a step; ends a step up | Everyone else: the store, the dance, the mine. Four even quarters with no rider in them. |

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
| Distinct keys | 27 |
| Tempo range | 54–152 BPM |
| Instrument palette | 29 instruments across the whole album |
| Slots covered | 44 |
| Theme statements | 2149 across the album |
| Development forms | prime, head, inversion, retrograde, retrogradeInversion, contraction, expansion |

Every track was checked for key discipline, resolving harmony, voice-leading (no parallel fifths or
octaves between the outer voices), grid alignment, playable instrument ranges, melodic singability,
a varying density curve, and loop-seam continuity. The audio was checked for silence, clipping,
headroom, loudness, and that the loop tags in the **shipped bytes** match the composed loop.

⚠️ **What those numbers are not.** They establish that the music is *technically sound* — correctly
written, correctly rendered, correctly tagged. They are not a claim about taste, and no amount of
them can be. Judge that yourself from the **free three-track preview** — **Red Mesa**, **Five Card Hand** and **The Standoff**,
complete tracks with their `.mid` sources, downloadable without paying
from the same itch page you got this from: <https://csaf.itch.io/four-riders>

This record is sold on its casting: four riders, each with one instrument, a whistle when nobody is there, and all four together in
exactly three tracks. The three free tracks are "Red Mesa" (the whistle, no rider), "Five Card Hand" (the Stranger on harmonica over the
Outlaw on electric guitar) and "The Standoff" (all four, the tune passing from one to the next).
Open their .mid files and read the part names and programs to check it.

## Licence

Royalty-free for commercial and non-commercial games. See `LICENSE.txt` for the exact terms.

---

*Core Systems Asset Factory*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
