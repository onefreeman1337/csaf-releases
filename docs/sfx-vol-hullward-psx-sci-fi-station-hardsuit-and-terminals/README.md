# Hullward: PSX Sci-Fi Sound Effects in Three Packs — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Hullward: PSX Sci-Fi Sound Effects in Three Packs  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-21


---

# Hullward: PSX Sci-Fi Sound Effects in Three Packs

**419 sound effects in 3 kits, WAV and OGG, for any game engine: Station and Airlocks (111 sounds), Hardsuit and Tools (202 sounds) and Terminals and Signals (106 sounds).**

The sound of a PS1 style sci-fi game: a space station and its airlocks, a hardsuit and its tools, and the station's terminals and signals, all in one low rate, coarse grain register and one short steel compartment, so the three packs belong in one game. Each pack is complete in its own folder, with its own Readme, licence, naming manifest and proof, so you can copy one folder into a project and leave the others.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio, no generative audio model. Nothing here is musical.

## The PSX register, measured

Across the volume, every one of the **419** files is written at **22,050 Hz**; every 16 bit sample sits on a **10 bit** grid (a whole multiple of 64); and the energy above **10,000 Hz** is at least **40 dB** under each file's total (the worst file: **41.1 dB** under). Each kit's `pack_proof.json` records it file by file.

## The kits

| Folder | Kit | Sounds | Loops |
|---|---|---|---|
| `StationAirlocks/` | Hullward I: PSX Station and Airlocks Sound Effects | 111 | 18 |
| `HardsuitTools/` | Hullward II: PSX Hardsuit and Tools Sound Effects | 202 | 8 |
| `TerminalsSignals/` | Hullward III: PSX Terminals and Signals Sound Effects | 106 | 18 |
| | **Total** | **419** | **44** |

**Station and Airlocks**: Station and Airlocks is the place a station game is built from: steel plate, pneumatics, small motors and moving air. The doors, the bulkheads, the airlock, the lifts, the generator, the vent fan, the docking clamps and the conveyor run through their states, a file per state, with a seamless loop wherever a state lasts. Storage is a grid of container by action, and debris on the hull and cargo set down are ladders that grow by length.

**Hardsuit and Tools**: Hardsuit and Tools is a footstep system as a grid: six grounds by two gaits by four suit weights, three takes in every cell, so a game indexes the ground under the boot, the pace and what the character wears. The suit rides on each footfall, so for every ground and gait the step grows longer from crew boots to mag boots; the landing and the fall grow the same way.

**Terminals and Signals**: Terminals and Signals is the electronics of a station as mechanisms a game drives: a terminal boots, idles on a seamless loop and shuts down; a download starts, runs and completes; the save station activates, waits, saves and confirms. The motion tracker pings brighter from far to near, and the scanner charge grows longer from short to full, both measured ladders a game can wire to a distance or a timer.

## Licence, the short version

**Royalty free. Commercial use. No attribution required.** Full terms in `LICENSE.txt` (each kit folder carries the same terms). Credit line, if you want one:

```
Sound effects: "Hullward" by Core Systems Asset Factory
```

## Proof

Each kit's `pack_proof.json` carries a sha256 and a full measurement record for every file: **3,850** signal checks across the three kits, 0 failed. They measure signal, not taste; listen to the free demo first.

*Core Systems Asset Factory · Hullward: PSX Sci-Fi Sound Effects in Three Packs · 419 sounds*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
