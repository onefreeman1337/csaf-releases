# Mainspring: Lighthouse, Clock Tower and Observatory Sound Effects in Three Packs — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Mainspring: Lighthouse, Clock Tower and Observatory Sound Effects in Three Packs  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-18


---

# Mainspring: Lighthouse, Clock Tower and Observatory Sound Effects in Three Packs

**338 sound effects in 3 kits, WAV and OGG, for any game engine: Lamp Room (118 sounds, a lighthouse lamp room), Great Clock (107 sounds, a tower clock from the inside) and Dome (113 sounds, an observatory).**

Three machines the size of a building for steampunk, clockwork, puzzle and adventure games, each a place a player walks into and operates: a lighthouse lamp room, a tower clock and an observatory. They share the brass and iron of *Escapement: Clockwork, Brass and the Machine Room*, the studio's clockwork pack, so the two layer. Each pack is complete in its own folder, with its own Readme, licence, naming manifest and proof, so you can copy one folder into a project and leave the others.

## One set of names, three machines

Every kit ships the same lifecycle names for its great machine: `machine_wind_01..02`, `machine_start`, `machine_run_1_loop`, `machine_run_2_loop`, `machine_run_3_loop`, `machine_stop`, `machine_jam_01..02`, `machine_repair_01..02`. In Lamp Room they are the clockwork that turns the optic, In Great Clock they are the going train and In Dome they are the dome drive. The run loops climb in brightness the same way in every kit. A game wired to those names swaps one machine for another by changing the folder it loads from.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio, no generative audio model. Nothing here is musical.

## The kits

| Folder | Kit | Sounds | Loops |
|---|---|---|---|
| `LampRoom/` | Lamp Room: Lighthouse Sound Effects | 118 | 19 |
| `GreatClock/` | Great Clock: Clock Tower Sound Effects | 107 | 12 |
| `Dome/` | Dome: Observatory and Orrery Sound Effects | 113 | 19 |
| | **Total** | **338** | **50** |

**Lamp Room**: Lamp Room is the top of a stone tower: a clockwork rotation machine of brass wheels on a cast iron frame, driven by an iron weight on a cable through the tower and steadied by a governor fan, turning a great glass optic on a roller carriage; a paraffin vapour lamp under a glass chimney; a sheet brass shutter; a compressed air fog signal in the house below; the gallery outside the glass and the iron stair. The optic, the shutter code, the fog signal by distance, the wind and the rain are ladders a game can drive from a number it already has; the lamp, the shutter, the gallery door and the hatch run through their states.

**Great Clock**: Great Clock is the movement in the tower: a cast iron frame of brass wheels and steel arbors, a long pendulum, two iron weights on cables through the floors, a strike train that lifts a hammer against one large bronze bell, the dial works behind the face and an oak clock room with its ladders and trapdoor. Every hour file strikes the count its name says, counted from the written file; the quarters are a ladder by length, the pendulum's beat and the blow on the bell are ladders too; the movement, the strike train, the clock room door, the trapdoor and the movement case run through their states.

**Dome**: Dome is the observatory on the hill: a dome on a steel ring track with rollers and a worm drive, a canvas shutter in its slit, a telescope on a cast iron pier and an equatorial mount with a clock drive, a brass orrery of geared arms, and an oak floor with its chart table. The dome speed, the slew, the orrery and the alignment are ladders a game can drive from its own counters; the shutter, the drive and the mount run through their states.

## Licence, the short version

**Royalty free. Commercial use. No attribution required.** Full terms in `LICENSE.txt` (each kit folder carries the same terms). Credit line, if you want one:

```
Sound effects: "Mainspring" by Core Systems Asset Factory
```

## Proof

Each kit's `pack_proof.json` carries a sha256 and a full measurement record for every file: **3,124** signal checks across the three kits, 0 failed. They measure signal, not taste; listen to the free demo first.

*Core Systems Asset Factory · Mainspring: Lighthouse, Clock Tower and Observatory Sound Effects in Three Packs · 338 sounds*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
