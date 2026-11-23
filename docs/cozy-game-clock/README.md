# Cozy Game Clock: three cozy life sim scores on one game clock (All Hours, Almanac, Errands) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Cozy Game Clock: three cozy life sim scores on one game clock (All Hours, Almanac, Errands)  
**Engine:** MIDI composition from Node (deterministic, theory-checkable) + rendered OGG via a redistribution-cleared soundfont - engine-agnostic music packs. Renderer + soundfont licence gate is the wing's first architecture decision; see Wings/Music/CLAUDE.md 3.  
**Docs published:** 2026-11-23


---

# Cozy Game Clock: three cozy life sim game scores on one game clock

Copyright (c) 2026 Core Systems Asset Factory

This download holds **3 complete game music albums** for cozy life sim and farming games, laid out so a game can choose its music
from its own clock, calendar and map: **All Hours** has a piece for every hour of the day, 5 AM to 4 AM, **Almanac** a piece for each of four seasons by four parts of the day, and
**Errands** a piece for each of 16 places of a life sim. **142 tracks** in all (116 full pieces and 26 short cues),
each as an **.ogg** file and its editable **.mid** source (142 MIDI files), about **3 h 51 min** of music. **116** of
the tracks carry sample-accurate loop points in their OGG tags (`LOOPSTART` and `LOOPLENGTH`, in samples); the other 26 are
short cues that play once.

## Pairs: two takes of one piece

**56 pairs** (112 of the 116 full pieces) come as two takes of one piece: clear and rain on All Hours, clear and
weather on Almanac, day and night on Errands. The two takes of a pair share the tempo, the metre, the key, the number of bars, the chord of
every bar and the loop points, and the second take holds every note of the first take's lead, pad, bass and counter-line at the same time,
pitch, length and velocity: **36,646 notes** in all, each found note for note when this download was checked. So a game can start both
takes together and crossfade between them when the rain starts or night falls, without a jump in the music. Each album's own `README.md`
lists its pairs in its track list, explains the two takes, and has a section on wiring the music to your game ("Wiring it to your game").

## What is in it

| folder | album | tracks | full pieces | pairs | cues | loop-tagged | running time |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `all-hours/` | All Hours (A Cozy Life-Sim Jazz Score) | 56 | 48 | 24 | 8 | 48 | 100:56 |
| `almanac/` | Almanac (A Cozy Farm Score for Every Season and Hour) | 44 | 36 | 16 | 8 | 36 | 70:07 |
| `errands/` | Errands (A Cozy Life Sim Score for Every Place, by Day and by Night) | 42 | 32 | 16 | 10 | 32 | 60:11 |

- **All Hours** (`all-hours/`), a Cozy Life-Sim Jazz Score. 24 pairs over every hour of the day, 5 AM to 4 AM, each hour in a clear take and a rain take: 48 of its 48 full pieces. Its full pieces come in six sets (Dawn, Morning, Afternoon, Evening, Night, and The Small Hours), plus eight short cues: "Morning Chime", "The Noon Bell", "Shop Bell", "Closing Time", "A New Day", "Rain Begins", "Rain Clears", and "A Little Fanfare".
  Its seed theme `chime` (the town clock) sounds in its own shape in **all 56 tracks**.
- **Almanac** (`almanac/`), a Cozy Farm Score for Every Season and Hour. 16 pairs over four seasons by four parts of the day, each cell in a clear take and a weather take (rain in spring, summer, and autumn; snow in winter): 32 of its 36 full pieces. The other four full pieces have one take: "The Flower Dance", "Lanterns on the Millpond", "The Harvest Fair", and "The Star Supper". Its full pieces come in four sets (Spring, Summer, Autumn, and Winter), plus eight short cues: "Spring Arrives", "Summer Arrives", "Autumn Arrives", "Winter Arrives", "Crop Ready", "The Day's Takings", "Goodnight, Farm", and "Festival Day".
  Its seed theme `furrow` (the plough line) sounds in its own shape in **all 44 tracks**.
- **Errands** (`errands/`), a Cozy Life Sim Score for Every Place, by Day and by Night. 16 pairs over 16 places of a life sim, each place in a day take and a night take: 32 of its 32 full pieces. Its full pieces come in four sets (Home and Yard, Around Town, Out and About, and Gatherings and Work), plus ten short cues: "A Bite on the Line", "Harvest In", "Made by Hand", "The Door Bell", "Getting Better at It", "A Small Gift", "Lights Out", "First Light", "The Festival Opens", and "Day Done".
  Its seed theme `errand` (off down the lane) sounds in its own shape in **all 42 tracks**. It also quotes All Hours' `chime` and Almanac's `furrow`; each quote is stated in its own shape in every track that declares it, 10 tracks in all.

Each album folder is that album's own download, unchanged: its tracks, its MIDI, its own `README.md` (every track by title, the pairs, and how
to use the loop tags in Godot, Unity, GameMaker and RPG Maker), its own `LICENSE.txt` and a `proofs/` folder with what was measured on its
MIDI and audio. Start with an album's `README.md`.

## Formats

Counted from the files in this download: OGG Vorbis at 44.1 kHz, stereo, and a Standard MIDI File beside every track.
The loop points are written into each looping .ogg file's Vorbis comments, so RPG Maker MV and MZ read them with no setup; the album
Readmes say how to use them in other engines.

## Also in the Music Library

All three albums are also inside the CSAF Music Library (https://csaf.itch.io/music-library), which holds every music album the studio has made and
adds each new one on its launch day. This volume is the three game-clock scores on their own.

## How this download was made

Each album folder was copied from that album's own tested download, and every file was checked against that download's manifest by
sha256 before it was copied; catalogue.json records each folder's digest. Nothing was re-rendered for this volume.

## Licence

`LICENSE.txt` in this folder covers the whole download, and every album also carries its own `LICENSE.txt`. In short: use the music
in commercial games and other finished work, in as many projects as you like, no credit required; do not resell or redistribute the
music itself as music. A copy and paste credit line is in `LICENSE.txt` if you want one.

## How the music was made

Every track is composed by code: themes and chord progressions written in code, developed across each album by a composition system
written with AI assistance, then rendered from the MIDI through FluidSynth and the GeneralUser GS soundfont. There are no recorded
samples beyond that soundfont and no generative audio model anywhere in the chain. The cover art and store images are AI-generated.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
