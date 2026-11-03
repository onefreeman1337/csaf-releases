# Canopy: A Jungle Expedition Score — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Canopy: A Jungle Expedition Score  
**Engine:** MIDI composition from Node (deterministic, theory-checkable) + rendered OGG via a redistribution-cleared soundfont - engine-agnostic music packs. Renderer + soundfont licence gate is the wing's first architecture decision; see Wings/Music/CLAUDE.md 3.  
**Docs published:** 2026-11-03


---

# CANOPY — A JUNGLE EXPEDITION SCORE
### 44 tracks, 80:00

Core Systems Asset Factory

---

## What this is

Most game-music packs are a **grab-bag**: tracks bought or bundled together that happen to share a
genre. Drop three of them into one project and the player hears the seams — different rooms,
different instruments, different composers.

**This is an album, not a bag.** 44 tracks across 44 slots, written in
one musical language from one family of 8 hand-authored themes. That is not a
description, it is a measurement: the harness reads the finished MIDI back and counts every statement
of every theme in every track — **6,015** of them here — and the
report is in this download. Your game gets a **score**, not a playlist.

## What you get

- **44 × `.ogg`** — OGG Vorbis, 44.1 kHz stereo, ready to drop in
- **44 × `.mid`** — the **editable MIDI sources**. Re-voice them, re-orchestrate
  them, change the tempo, pull out a single line.
- **Sample-accurate loop metadata** — `LOOPSTART` / `LOOPLENGTH` in the OGG Vorbis comments,
  denominated in samples, which is exactly what **RPG Maker MV / MZ** reads
- **Per-engine import notes** (below)
- **A royalty-free licence** for commercial games (see `LICENSE.txt`)

## The band changes on the way in

Every instrument on this record belongs to one of two bands: the expedition's (trumpet, clarinet, steel guitar, strings and the rest) or the jungle's
(marimba, kalimba, pan flute, ocarina and the rest). The map decides who plays what:

- Leg I, The Last Port: every part is the expedition's.
- Leg II, Up the River: the jungle takes the colour part.
- Leg III, The Canopy: the jungle also takes the pad.
- Leg IV, The Ruins: everything but the lead is the jungle's.
- Leg V, The Lost Temple: every part is the jungle's.
- Leg VI, The Way Out: both bands play together.

Counted from the notes in the .mid files, the jungle plays 0% of the notes in Leg I, 4% in Leg II, 55% in Leg III, 84% in Leg IV and 100% in Leg V.
Leg I and Leg V have no instrument in common, and the same river theme runs through both.

The jungle band is a set of General MIDI stand-ins chosen for this record. It does not imitate the music of any real people or place, and the jungle
it was written for is a made-up one.

## The interlock

Two mallet parts, `mallet1` on marimba and `mallet2` on kalimba, share one pattern: each strikes only in the other's gaps. They never strike together and
between them they fill every slot of the grid in every bar they play, sixteenths at 104 bpm and under, eighths above. Every note is a tone of the chord
sounding then, and both parts sit under the lead. In every section they play, the lead rests for at least two whole bars and leaves them alone with the percussion.

They arrive with the map: section C of each piece in Leg III, sections B and C in Leg IV, every section of the loop in Leg V, and section C again in Leg VI.
Legs I and II do not have them. Each part has its own channel in the .mid, so you can mute either one or give it another instrument.

Changing a score's instruments as a story goes on, and interlocking two parts so each plays in the other's gaps, are old ideas and are not claimed as new here. What this record adds is that
both are strict and checked in the shipped files: Leg I and Leg V share no instrument, and the two mallets never strike together.

## The hands

The percussion follows the same map. Leg I is bass drum, snare and hi-hat. Leg II adds maracas. In Leg III the snare and hi-hat are gone and congas and
bongos arrive. In Legs IV and V the bass drum is gone too, and wood blocks arrive. Leg VI uses both kits. Some quiet pieces have no percussion at all.

## The expedition

### Leg I: The Last Port

- 01. Canopy
- 02. The Expedition
- 03. The Last Port
- 04. The Outfitter
- 05. Charts and Lamplight
- 06. Base Camp
- 07. Night at Camp

### Leg II: Up the River

- 08. Upriver
- 09. The River at Night
- 10. Rapids
- 11. The Mangrove Maze
- 12. The Drowned Wreck
- 13. Crocodile Water
- 14. Battle on the River

### Leg III: The Canopy

- 15. Under the Leaves
- 16. The Canopy Walk
- 17. The Waterfall
- 18. The Rope Bridge
- 19. The Village in the Trees
- 20. The Lantern Festival
- 21. Cloudburst
- 22. Firefly Night
- 23. Battle in the Canopy

### Leg IV: The Ruins

- 24. Stones in the Roots
- 25. The Overgrown Steps
- 26. The Serpent Court
- 27. The Trap Corridor
- 28. The Boulder Run
- 29. Battle in the Ruins
- 30. The Jaguar

### Leg V: The Lost Temple

- 31. The Antechamber
- 32. The Hall of Idols
- 33. The Flooded Crypt
- 34. The Puzzle Floor
- 35. The Heart of the Temple
- 36. The Old One

### Leg VI: The Way Out

- 37. The Temple Falls
- 38. Daylight

### The Cues

- 39. Discovery
- 40. Trap Sprung
- 41. Treasure
- 42. Rest at Camp
- 43. Victory
- 44. Lost in the Jungle

## Loops

All 38 full pieces loop, the shortest for 58.6 seconds (read the LOOPSTART and LOOPLENGTH tags in any .ogg). Each opens with the river theme
once, and the loop point sits after that opening, so in a game the opening plays once.
The 6 cues (Discovery, Trap Sprung, Treasure, Rest at Camp, Victory and Lost in the Jungle) play once and do not loop. They mix the two bands freely and have no mallets or percussion.

### Instruments

Every pitched part is one of 30 General MIDI programs, named here by their General MIDI names, and the percussion is the General MIDI drum kit. All of it is rendered through the GeneralUser GS soundfont.

The expedition: trumpet, French horn, tuba, clarinet, flute, harmonica, tango accordion, steel guitar, banjo, violin, viola, cello, contrabass, acoustic bass, pizzicato strings, string ensemble and slow strings.
The jungle: pan flute, ocarina, blown bottle, shakuhachi, whistle, marimba, kalimba, vibraphone, voice oohs, choir aahs, fretless bass, taiko drum and melodic tom.

The `.mid` files are the real sources: load them into your own instruments to replace any part. No game or film cue is quoted anywhere on this record,
and no traditional tune is used; every tune on it was composed for it.

## Track list

| # | Title | Slot | Key | BPM | Length | LOOPSTART / LOOPLENGTH |
| --- | --- | --- | --- | --- | --- | --- |
|  1 | Canopy | Title / main theme | F ionian | 88 | 2:03 | 360818 / 5051455 |
|  2 | The Expedition | Expedition theme | D mixolydian | 116 | 1:33 | 273724 / 3832138 |
|  3 | The Last Port | Port town | G ionian | 104 | 1:48 | 305308 / 4477846 |
|  4 | The Outfitter | Shop | A mixolydian | 96 | 1:58 | 330750 / 4851000 |
|  5 | Charts and Lamplight | Map room | E dorian | 72 | 2:30 | 441000 / 6174000 |
|  6 | Base Camp | Base camp | C ionian | 92 | 2:03 | 345130 / 5061913 |
|  7 | Night at Camp | Camp at night | A# mixolydian | 76 | 2:13 | 417789 / 5431264 |
|  8 | Upriver | River by day | D mixolydian | 100 | 1:48 | 317520 / 4445280 |
|  9 | The River at Night | River by night | B aeolian | 66 | 2:44 | 481091 / 6735273 |
| 10 | Rapids | Rapids | E dorian | 138 | 1:13 | 230087 / 2991130 |
| 11 | The Mangrove Maze | Mangrove | C dorian | 84 | 2:09 | 378000 / 5292000 |
| 12 | The Drowned Wreck | Wreck | F aeolian | 72 | 2:30 | 441000 / 6174000 |
| 13 | Crocodile Water | River danger | G phrygian | 96 | 1:53 | 330750 / 4630500 |
| 14 | Battle on the River | River battle | A aeolian | 148 | 1:08 | 214541 / 2789027 |
| 15 | Under the Leaves | Jungle floor | A dorian | 92 | 2:08 | 345130 / 5292000 |
| 16 | The Canopy Walk | Canopy | F lydian | 84 | 2:20 | 378000 / 5796000 |
| 17 | The Waterfall | Waterfall | D lydian | 76 | 2:22 | 417789 / 5849053 |
| 18 | The Rope Bridge | Rope bridge | G mixolydian | 108 | 1:44 | 294000 / 4312000 |
| 19 | The Village in the Trees | Tree village | C ionian | 96 | 2:03 | 330750 / 5071500 |
| 20 | The Lantern Festival | Festival | A mixolydian | 126 | 1:31 | 252000 / 3780000 |
| 21 | Cloudburst | Cloudburst | E aeolian | 112 | 1:41 | 283500 / 4158000 |
| 22 | Firefly Night | Jungle night | A# lydian | 72 | 2:40 | 441000 / 6615000 |
| 23 | Battle in the Canopy | Canopy battle | D dorian | 152 | 1:09 | 208895 / 2854894 |
| 24 | Stones in the Roots | Outer ruins | G aeolian | 76 | 2:54 | 417789 / 7241685 |
| 25 | The Overgrown Steps | Ruin steps | C dorian | 88 | 2:30 | 360818 / 6254182 |
| 26 | The Serpent Court | Serpent court | E phrygian | 80 | 2:27 | 396900 / 6085800 |
| 27 | The Trap Corridor | Trap corridor | A harmonic minor | 112 | 1:45 | 283500 / 4347000 |
| 28 | The Boulder Run | Chase | D phrygian | 160 | 1:09 | 198450 / 2844450 |
| 29 | Battle in the Ruins | Ruins battle | F harmonic minor | 150 | 1:14 | 211680 / 3034080 |
| 30 | The Jaguar | Boss | C phrygian | 156 | 1:11 | 203538 / 2917385 |
| 31 | The Antechamber | Antechamber | A phrygian | 66 | 3:35 | 481091 / 8980364 |
| 32 | The Hall of Idols | Idol hall | D harmonic minor | 72 | 3:17 | 441000 / 8232000 |
| 33 | The Flooded Crypt | Flooded crypt | B aeolian | 60 | 3:24 | 529200 / 8467200 |
| 34 | The Puzzle Floor | Puzzle room | G dorian | 96 | 2:13 | 330750 / 5512500 |
| 35 | The Heart of the Temple | Temple heart | E phrygian | 72 | 2:57 | 441000 / 7350000 |
| 36 | The Old One | Final boss | A# harmonic minor | 144 | 1:25 | 220500 / 3528000 |
| 37 | The Temple Falls | Collapse | D aeolian | 168 | 1:03 | 189000 / 2583000 |
| 38 | Daylight | Ending | F ionian | 92 | 2:03 | 345130 / 5061913 |
| 39 | Discovery | Discovery sting | D lydian | 96 | 0:20 | one-shot |
| 40 | Trap Sprung | Trap sting | E phrygian | 120 | 0:12 | one-shot |
| 41 | Treasure | Treasure sting | G ionian | 112 | 0:19 | one-shot |
| 42 | Rest at Camp | Rest stinger | C ionian | 80 | 0:18 | one-shot |
| 43 | Victory | Victory stinger | A# ionian | 108 | 0:15 | one-shot |
| 44 | Lost in the Jungle | Defeat stinger | D aeolian | 60 | 0:22 | one-shot |

## The theme family

Everything here grows from **8 hand-authored themes**, one seed and seven cells beside it:
`river` is two quick steps up, a slip back and a step on: the theme the whole expedition follows, on every track.
`compass` reaches up a fourth and keeps reaching: the expedition itself.
`camp` is four even quarters: the port, the camp and the village in the trees.
`leaf` is a long dotted rise and a drift back down: the canopy overhead.
`drip` is four quick eighths and a held note: water off the leaves.
`serpent` limps in three, three, two, winding round one note: what moves in the water and the walls.
`idol` opens on a half note falling a fourth and ends lowest: the ruins and the temple.
`jaguar` leaps up a fifth and comes down in pounces: every fight.
Every track states at least one of them — in its original form, inverted, backwards, widened or
compressed.

| id | Theme | Built from | Role |
| --- | --- | --- | --- |
| `river` | The River | the river: up a step, up a step, down a third, up a step; ends a step up | The theme the whole expedition follows: two quick steps up, a slip back and a step on. Stated in its own shape in every track, from the last port to the heart of the temple. |
| `compass` | The Compass | the compass: up a fourth, down a step, up a third, down a third; ends a third up | The expedition itself: the only cell that opens by reaching up a fourth and keeps reaching. |
| `camp` | The Camp | the camp: up a third, down a step, down a step, up a third; ends a third up | Rest and shelter: the port, the camp, the village in the trees. Four even quarters. |
| `leaf` | The Leaf | the leaf: up a third, up a third, down a step, down a third; ends a step up | The canopy overhead: a long dotted rise and a drift back down. |
| `drip` | The Drip | the drip: down a step, up a third, down a step, down a step; ends a step down | Water off the leaves: four quick eighths and a held note. |
| `serpent` | The Serpent | the serpent: down a step, up a step, down a third, up a step; ends a step down | What moves in the water and the walls: the only cell in a three, three, two limp, winding round one note. |
| `idol` | The Idol | the idol: down a fourth, up a step, up a step, down a third; ends a fourth down | The ruins and the temple: the only cell that opens on a half note falling a fourth, and the one that ends lowest. |
| `jaguar` | The Jaguar | the jaguar: up a fifth, down a third, down a step, down a third; ends a step down | Every fight: the only cell that opens with a leap up a fifth, in quick notes, and comes down in pounces. |

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
| Distinct keys | 31 |
| Tempo range | 60–168 BPM |
| Instrument palette | 31 instruments across the whole album |
| Slots covered | 44 |
| Theme statements | 6015 across the album |
| Development forms | prime, retrograde, inversion, retrogradeInversion, contraction, head, expansion, retrograde+expansion, inversion+expansion, retrogradeInversion+expansion, prime+expansion |

Every track was checked for key discipline, resolving harmony, voice-leading (no parallel fifths or
octaves between the outer voices), grid alignment, playable instrument ranges, melodic singability,
a varying density curve, and loop-seam continuity. The audio was checked for silence, clipping,
headroom, loudness, and that the loop tags in the **shipped bytes** match the composed loop.

⚠️ **What those numbers are not.** They establish that the music is *technically sound* — correctly
written, correctly rendered, correctly tagged. They are not a claim about taste, and no amount of
them can be. Judge that yourself from the **free four-track preview** — **Base Camp**, **Battle in the Canopy**, **The Jaguar** and **The Heart of the Temple**,
complete tracks with their `.mid` sources, downloadable without paying
from the same itch page you got this from: <https://csaf.itch.io/canopy>

This record is sold on its map: the band changes on the way in, and Leg I and Leg V share no instrument. The four free tracks are "Base Camp" (Leg I, every part
the expedition's), "Battle in the Canopy" (Leg III, both bands, the mallets in section C), "The Jaguar" (Leg IV, a boss, only the lead left from the expedition) and
"The Heart of the Temple" (Leg V, every part the jungle's, the mallets throughout). Open the .mid files and read the part names to check it.

## Licence

Royalty-free for commercial and non-commercial games. See `LICENSE.txt` for the exact terms.

---

*Core Systems Asset Factory*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
