# Salt and Timber: Ships and Sea Audio Kit — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Salt and Timber: Ships and Sea Audio Kit  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-01


---

# Salt and Timber: Ships and Sea Audio Kit

**Salt and Timber is a ships and sea audio kit for any game engine: 165 sound effects (.wav and .ogg) and 42 music tracks (.ogg with loop tags, plus editable .mid), with a cue map that places every file in one of 17 game moments.** Royalty free in commercial games, no credit required. A free demo on the store page carries a small cut of both halves.

It is two complete packs from the same studio in one download, unchanged, plus the map that joins them:

| folder | what it is | contents | format |
|---|---|---|---|
| `Sound_Effects/` | Leeward: Ships, Sea and Harbour | 165 sounds in 120 families, 7 seamless ambience loops | 44.1 kHz / 16-bit mono .wav + .ogg |
| `Music/` | Saltline: A Voyage and Harbour Score | 42 tracks (38 looping pieces and 4 stingers), 53.5 minutes | .ogg (44.1 kHz stereo) + editable .mid |
| `CUE_MAP.md` | the cue map | 17 game moments, 202 placements | Markdown, and `kit.json` for code |

Each folder keeps its own Readme, licence and proof files exactly as the separate pack ships them, so every import note inside still applies word for word.

## The cue map

A sea game needs the same moments again and again: the harbour, the shop, leaving port, open water, the night watch, fog, a storm, a fight, the aftermath, landfall. `CUE_MAP.md` takes each one and names the music that plays under it and the sound families that belong in it. Every one of the 120 sound families and every one of the 42 tracks is placed at least once, so nothing in the download is a file you never find.

| game moment | music | sound families |
|---|---|---|
| Title screen and main menu | Saltline | 6 |
| The harbour by day | The Salt Quarter · Rope, Tar and Canvas · The Tide Comes In At Four · Cranes, Barrows, Shouting | 16 |
| The chandler's shop and the chart room | The Chandler's Shop · Charts, Rules and Dividers | 9 |
| The taproom | The Taproom · A Song With No Words In It | 5 |
| Weighing anchor and casting off | Weighing Anchor · Out Past The Mole · Casting Off | 12 |
| Open water under sail | Open Water · The Long Reach · Blue Water, No Land · The Trade Wind | 12 |
| The night watch | First Watch · The Bell At Two · Nothing On The Water | 8 |
| Fog | Fog Off The Bank · The Bell You Cannot Place | 5 |
| Becalmed | Becalmed · Water Like A Floor | 6 |
| Weather and the squall | Weather From The West · The Squall · All Hands | 14 |
| The reef and the soundings | The Reef At Night · Sound The Bottom | 10 |
| Gunnery and boarding | Grapples · Close Work · Colours Struck · Lost With All Hands | 18 |
| After the fight | Counting The Living · Read Them By Name | 6 |
| The lighthouse | The Light On The Head · The Keeper's Stair | 6 |
| The wreck and what the sea keeps | The Wreck Of The Wrenlight · What The Sea Keeps | 8 |
| Landfall | Land, Two Points Off The Bow · Landfall · Land Ho | 9 |
| The chart screen and the long night at sea | The Sea, All Night | 10 |

`kit.json` holds the same map as data (scene, track files, sound files per family) if you want to wire it in code.

## Quick start

1. Copy `Sound_Effects/ogg/` (or `wav/`) and `Music/ogg/` into your project.
2. Open `CUE_MAP.md` at the scene you are building and drop in what it lists.
3. Loops: the 7 ambience beds in `Sound_Effects` loop from sample 0 to the end of the file (the `.wav` also carries `smpl` loop points). The 38 looping music tracks carry `LOOPSTART` and `LOOPLENGTH` in their Vorbis comments, counted in samples at 44,100 per second; the 4 stingers do not loop.

Per engine (Godot, Unity, Unreal, GameMaker, RPG Maker MV and MZ, web): `Sound_Effects/Readme_for_Users.md` (section "Import notes") and `Music/README.md` (section "Engine notes").

## Levels

The two halves were mastered as separate packs. Measured on the files in this download: the sound effects sit at a median RMS of -20 dBFS, the music at a median RMS of -19 dBFS. Give music and effects their own volume settings in your game so a player can balance them.

## Licence, in one line

Use any of it in any number of commercial games and other finished productions, with no fee and no credit required. Do not resell or redistribute the files themselves as sounds or music. The full terms are in `LICENSE.txt`.

## How it was made

The sound effects are synthesised from code: modal resonators, filters, noise and envelopes. The music is composed as MIDI by code and rendered with FluidSynth through the GeneralUser GS soundfont, whose licence permits selling recordings made with it; the soundfont itself is not included. No recorded samples, no stock library and no generative audio model were used anywhere in either half. The code was written with AI assistance and the store graphics are AI generated.

## What was measured, and what was not

Before release every file here was traced to the live upload of its pack, byte for byte (425 files). The sound effects half was re-run through the studio's sound effects gate (1500 checks, 0 failed). Every music track was decoded and measured against the pack's own render record (length, peak, level, loop tags). Those are signal and file checks. They are not a judgement that anything sounds good: listen to the free demo on the store page before you buy.

## The two packs on their own

- Leeward: Ships, Sea and Harbour: https://csaf.itch.io/leeward-ships-sea-and-harbour
- Saltline: A Voyage and Harbour Score: https://csaf.itch.io/saltline

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
