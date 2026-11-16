# Arcade Genre Scores: 132 Racing, Rhythm and FPS Tracks — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Arcade Genre Scores: 132 Racing, Rhythm and FPS Tracks  
**Engine:** MIDI composition from Node (deterministic, theory-checkable) + rendered OGG via a redistribution-cleared soundfont - engine-agnostic music packs. Renderer + soundfont licence gate is the wing's first architecture decision; see Wings/Music/CLAUDE.md 3.  
**Store page:** https://csaf.itch.io/arcade-genre-scores  
**Docs published:** 2026-11-16


---

# Arcade Genre Scores: three complete game scores for racing, rhythm and retro FPS games

Copyright (c) 2026 Core Systems Asset Factory

This download holds **3 complete game music albums**, one per arcade genre, **132 tracks** in all (108 full
pieces and 24 short cues), each as an **.ogg** file and its editable **.mid** source (132 MIDI files), about
**2 h 30 min** of music. **108** of the tracks carry sample-accurate loop points in their OGG tags (`LOOPSTART`
and `LOOPLENGTH`, in samples); the other 24 are short cues that play once (a race countdown, stage clear, full combo,
level clear, game over and the like).

## What is in it

| folder | album | tracks | full pieces | cues | loop-tagged | running time |
| --- | --- | --- | --- | --- | --- | --- |
| `apex/` | Apex: A Racing Game Score | 44 | 36 | 8 | 36 | 51:17 |
| `click-track/` | Click Track: A Rhythm Game Score With Note Charts | 44 | 36 | 8 | 36 | 50:02 |
| `gunmetal-midi/` | Gunmetal MIDI: A 90s Metal Score for Retro Shooters | 44 | 36 | 8 | 36 | 48:52 |

- **Apex** (`apex/`) scores a racing game from the title screen to the podium: menus, garage, course select, the grid, and
  **8 circuits that each have a final-lap version** of their own track, plus rival, drift, replay, pit stop and results.
- **Click Track** (`click-track/`) is a rhythm game score in which **every one of its 44 tracks ships with a note chart**
  (`charts/`, three difficulties each, timed to the MIDI), a StepMania export and a small browser player (`player/index.html`).
- **Gunmetal MIDI** (`gunmetal-midi/`) is early 90s shooter metal as General MIDI played it: **32 pieces carry a
  power-chord riff** that the kick drum doubles strike for strike, across a front end, three episodes, bosses and a secret level.

Each album folder is that album's own download, unchanged: its tracks, its MIDI, its own `README.md` (every track by title, and how to
use the loop tags in Godot, Unity, GameMaker and RPG Maker), its own `LICENSE.txt` and a `proofs/` folder with what was measured on
its MIDI and audio. Start with an album's `README.md`.

## Formats

Counted from the files in this download: OGG Vorbis at 44.1 kHz, stereo, and a Standard MIDI File beside every track.
The loop points are written into each looping .ogg file's Vorbis comments, so RPG Maker MV and MZ read them with no setup; the album
Readmes say how to use them in other engines.

## Also in the Music Library

All three albums are also inside the CSAF Music Library (https://csaf.itch.io/music-library), which holds every music album the studio has made and
adds each new one on its launch day. This volume is the three arcade genre scores on their own.

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
