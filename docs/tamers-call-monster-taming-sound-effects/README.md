# Tamer's Call: 360 Monster Taming Sound Effects — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Tamer's Call: 360 Monster Taming Sound Effects  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-27


---

# Tamer's Call: Monster Taming Sound Effects in Three Packs (Capture, Battle Flow, Cries and Evolution)

**360 sound effects in 3 kits, WAV and OGG, for any game engine: Capture (124 sounds, everything a monster taming game does outside the fight), Battle (127 sounds, the battle layer of a monster taming game) and Cries (109 sounds, thirty creature cries in ten lines and three stages (a rock line, a fire lizard, a plant, a water line, a shadow line, an ice fox, an electric rodent, a songbird, an insect and a wind bat, each in its first, middle and final form), two takes for every creature, a faint for every creature, the evolution as a lifecycle (the start, the reveal and a cancel) with an evolution glow ladder of five seamless loops from the first pulse to the moment of change, an egg wobbling, cracking and hatching, and a rare variant sparkle).**

The sound layer of a monster taming game in one handheld register: the catch and everything outside the fight, the battle from the encounter flash to the level up, and thirty creatures in ten lines with their evolution. Every pack is built as structure a game wires to its systems: grids that answer two values the game already holds (an element and an effectiveness, a creature line and a stage), ladders by shake, stat stage and evolution, and lifecycles with a seamless loop to hold. Each pack is complete in its own folder, with its own Readme, licence, naming manifest and proof, so you can copy one folder into a project and leave the others.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio, no generative audio model. Nothing here is musical.

## The kits

| Folder | Kit | Sounds | Loops |
|---|---|---|---|
| `Capture/` | Tamer's Call Capture: Capture, Companion and Field Sound Effects | 124 | 3 |
| `Battle/` | Tamer's Call Battle: Monster Battle Flow Sound Effects | 127 | 2 |
| `Cries/` | Tamer's Call Cries: Creature Cry and Evolution Sound Effects | 109 | 5 |
| | **Total** | **360** | **10** |

**Capture**: Capture is the overworld half of a monster taming game in one handheld register: pulse waves at four duty widths, a triangle and clocked noise under volume stepped at 60 frames a second, dry, band limited and on a 12 bit grid that the gate measures on every file. The catch is a lifecycle and its shake is a ladder, so a game plays one rung per wobble and then the click or the break out; the storage box and the healing station are lifecycles with a seamless loop to hold while the player waits.

**Battle**: Battle is the fight in the same handheld register: pulse, triangle and clocked noise, stepped volume, dry. The hit grid puts the nine elements on a lattice of three lengths by three brightnesses, so no two elements at one effectiveness share a sound, and effectiveness scales the whole hit: a resisted hit is shorter and duller, a strong one longer, brighter and with an impact under it. A game picks the file from the element and the effectiveness its damage step already computes. Stat stages are ladders a game indexes with the stage number; fleeing and the battle menu are lifecycles.

**Cries**: Cries is the creatures in the same handheld register: every cry is a contour of pulse, triangle and clocked noise, never a recording of an animal or a voice. Each line owns its own shape (a gravel grunt, a rising growl, a soft two part coo, a bubbling warble, a wavering hum, two sharp yips, a buzzing squeak, three chirps, a trill and a long screech) and a cell of a five lengths by two brightnesses lattice, so no two lines at one stage share a cry; each later form is longer, lower and rougher, so a final form sounds like the first form grown up.

## Licence, the short version

**Royalty free. Commercial use. No attribution required.** Full terms in `LICENSE.txt` (each kit folder carries the same terms). Credit line, if you want one:

```
Sound effects: "Tamer's Call" by Core Systems Asset Factory
```

## Proof

Each kit's `pack_proof.json` carries a sha256 and a full measurement record for every file: **3,285** signal checks across the three kits, 0 failed. They measure signal, not taste; listen to the free demo first.

*Core Systems Asset Factory · Tamer's Call: Monster Taming Sound Effects in Three Packs (Capture, Battle Flow, Cries and Evolution) · 360 sounds*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
