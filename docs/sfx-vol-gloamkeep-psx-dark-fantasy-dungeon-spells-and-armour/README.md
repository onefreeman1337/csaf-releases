# Cryptlight: PSX Dark Fantasy Sound Effects in Three Packs — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Cryptlight: PSX Dark Fantasy Sound Effects in Three Packs  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-20


---

# Cryptlight: PSX Dark Fantasy Sound Effects in Three Packs

**457 sound effects in 3 kits, WAV and OGG, for any game engine: Dungeon and Keep (118 sounds), Spells and Relics (120 sounds) and Armour and Footfalls (219 sounds).**

The sound of a PS1 style dark fantasy game: a dungeon and its keep, crypt magic in five schools, and armour on stone, all in one low rate, coarse grain register and one short stone room, so the three packs belong in one game. Each pack is complete in its own folder, with its own Readme, licence, naming manifest and proof, so you can copy one folder into a project and leave the others.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio, no generative audio model. Nothing here is musical.

## The PSX register, measured

Across the volume, every one of the **457** files is written at **22,050 Hz**; every 16 bit sample sits on a **10 bit** grid (a whole multiple of 64); and the energy above **10,000 Hz** is at least **40 dB** under each file's total (the worst file: **46.9 dB** under). Each kit's `pack_proof.json` records it file by file.

## The kits

| Folder | Kit | Sounds | Loops |
|---|---|---|---|
| `DungeonKeep/` | Cryptlight I: PSX Dungeon and Keep Sound Effects | 118 | 12 |
| `SpellsRelics/` | Cryptlight II: PSX Spells and Relics Sound Effects | 120 | 25 |
| `ArmourFootfalls/` | Cryptlight III: PSX Armour and Footfall Sound Effects | 219 | 4 |
| | **Total** | **457** | **41** |

**Dungeon and Keep**: Dungeon and Keep is the place a crawler is built from: iron banded oak, granite blocks and forged chain. The doors, the portcullis, the secret wall, the traps, the torches, the brazier, the well and the save shrine run through their states, a file per state, with a seamless loop wherever a state lasts. The chests are a grid of material by action, and coins and rubble are ladders that grow by length.

**Spells and Relics**: Spells and Relics is crypt magic as mechanisms a game drives: every cast is a seamless charge loop to hold while the button is down, a release and an impact, at a minor, a greater and a grand tier, and the release and the impact of every school grow longer from tier to tier. Wards are raised, held and broken; curses are laid, linger and lift; an enchantment is laid on, hums and fades.

**Armour and Footfalls**: Armour and Footfalls is a footstep system as a grid: seven surfaces by two gaits by four armour weights, three takes in every cell, so a game indexes the surface under the foot, the pace and what the character wears. The armour rides on each footfall, so for every surface and gait the step grows longer from cloth to leather to chain to plate; the ladder, the landing and the fall grow the same way.

## Licence, the short version

**Royalty free. Commercial use. No attribution required.** Full terms in `LICENSE.txt` (each kit folder carries the same terms). Credit line, if you want one:

```
Sound effects: "Cryptlight" by Core Systems Asset Factory
```

## Proof

Each kit's `pack_proof.json` carries a sha256 and a full measurement record for every file: **4,189** signal checks across the three kits, 0 failed. They measure signal, not taste; listen to the free demo first.

*Core Systems Asset Factory · Cryptlight: PSX Dark Fantasy Sound Effects in Three Packs · 457 sounds*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
