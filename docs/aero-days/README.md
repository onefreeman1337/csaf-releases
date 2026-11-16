# Aero Days - A Frutiger Aero Music Volume: Desktop Optimism, Aquatic Biosphere and Plaza Lounge Scores — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Aero Days - A Frutiger Aero Music Volume: Desktop Optimism, Aquatic Biosphere and Plaza Lounge Scores  
**Engine:** MIDI composition from Node (deterministic, theory-checkable) + rendered OGG via a redistribution-cleared soundfont - engine-agnostic music packs. Renderer + soundfont licence gate is the wing's first architecture decision; see Wings/Music/CLAUDE.md 3.  
**Docs published:** 2026-11-16


---

# Aero Days: three complete Frutiger Aero game scores for menus, bright worlds and lounges

Copyright (c) 2026 Core Systems Asset Factory

This download holds **3 complete game music albums** in the Frutiger Aero sound of 2000s console menus and desktop computers:
glassy, bright, watery and optimistic. **132 tracks** in all (108 full pieces and 24 short cues), each as an
**.ogg** file and its editable **.mid** source (132 MIDI files), about **3 h 08 min** of music. **108** of the
tracks carry sample-accurate loop points in their OGG tags (`LOOPSTART` and `LOOPLENGTH`, in samples); the other 24 are
short cues that play once (startup and shutdown chimes, notifications, collect and level clear jingles, prize and high score cues).

## What is in it

| folder | album | tracks | full pieces | cues | loop-tagged | running time |
| --- | --- | --- | --- | --- | --- | --- |
| `aero-desktop/` | Aero Days: Desktop (A Frutiger Aero Menu and Desktop Score) | 44 | 36 | 8 | 36 | 66:05 |
| `aero-aquatic/` | Aero Days: Aquatic (A Frutiger Aero Ocean and Sky Score) | 44 | 36 | 8 | 36 | 61:18 |
| `aero-plaza/` | Aero Days: Plaza (A Frutiger Aero Bossa and Lounge Score) | 44 | 36 | 8 | 36 | 60:21 |

- **Desktop** (`aero-desktop/`), a Frutiger Aero Menu and Desktop Score: six sets of tracks (Power On, The Desktop, Settings, The Shop Channel, Online, and Night Mode) and eight short cues (Startup Chime, Signed In, Notification, New Message, System Error, Download Complete, Achievement, and Shutdown Chime).
  Its theme, the startup chime, is stated in its own shape in **all 44 tracks** (142 statements).
- **Aquatic** (`aero-aquatic/`), a Frutiger Aero Ocean and Sky Score: six sets of tracks (The Ocean Hub, Coral Glass, The Bubble Forest, Sky Islands, Underwater, and Rain on Glass) and eight short cues (Discovery, Bubble Collect, Rare Find, Dive In, Surface, Level Clear, Game Saved, and Washed Ashore).
  Its theme, the droplet, is stated in its own shape in **all 44 tracks** (147 statements).
- **Plaza** (`aero-plaza/`), a Frutiger Aero Bossa and Lounge Score: six sets of tracks (The Plaza Cafe, The Glass Lounge, The Mall Atrium, Airport and Park, The Bossa Menus, and Results and Evening) and eight short cues (Order Up, New Look, Ticket Get, Boarding Call, Round Start, Prize Won, New High Score, and Closing Time).
  Its theme, the stroll, is stated in its own shape in **all 44 tracks** (182 statements). 18 of its pieces carry a bossa bass on the off-beats.

Each album folder is that album's own download, unchanged: its tracks, its MIDI, its own `README.md` (every track by title, and how to
use the loop tags in Godot, Unity, GameMaker and RPG Maker), its own `LICENSE.txt` and a `proofs/` folder with what was measured on
its MIDI and audio. Start with an album's `README.md`.

## Formats

Counted from the files in this download: OGG Vorbis at 44.1 kHz, stereo, and a Standard MIDI File beside every track.
The loop points are written into each looping .ogg file's Vorbis comments, so RPG Maker MV and MZ read them with no setup; the album
Readmes say how to use them in other engines.

## Also in the Music Library

All three albums are also inside the CSAF Music Library (https://csaf.itch.io/music-library), which holds every music album the studio has made and
adds each new one on its launch day. This volume is the three Aero Days scores on their own.

## How this download was made

Each album folder was copied from that album's own tested download, and every file was checked against that download's manifest by
sha256 before it was copied; catalogue.json records each folder's digest. Nothing was re-rendered for this volume.

## Licence

`LICENSE.txt` in this folder covers the whole download, and every album also carries its own `LICENSE.txt`. In short: use the music
in commercial games and other finished work, in as many projects as you like, no credit required; do not resell or redistribute the
music itself as music. A copy and paste credit line is in `LICENSE.txt` if you want one.

## How the music was made

Every track is composed by code: hand-authored themes and chord progressions, developed across each album by a composition system
written with AI assistance, then rendered from the MIDI through FluidSynth and the GeneralUser GS soundfont. There are no recorded
samples beyond that soundfont and no generative audio model anywhere in the chain. The cover art and store images are AI-generated.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
