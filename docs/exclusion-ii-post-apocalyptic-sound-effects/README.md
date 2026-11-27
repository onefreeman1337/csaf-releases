# Exclusion II: 308 Post Apocalyptic Sound Effects — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Exclusion II: 308 Post Apocalyptic Sound Effects  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-27


---

# Exclusion II: Post Apocalyptic Sound Effects in Three Packs (Anomalies, the Emission and the Scavenger's Haul)

**308 sound effects in 3 kits, WAV and OGG, for any game engine: Anomalies (103 sounds, the hazard layer of an exclusion zone), Emission (102 sounds, the storm an exclusion zone game runs as an event) and Haul (103 sounds, the scavenging loop).**

The three layers an exclusion zone game needs after the Geiger counter: the anomaly fields you can hear before you see them, with a detector that ticks faster as you close in; the emission storm from the first warning to the ash fall; and the scavenging loop, every pile and every container a survivor searches. Every pack is built as structure a game wires to its systems: grids that answer two values the game already holds, ladders by distance, intensity and weight, and lifecycles with a seamless loop to hold. Each pack is complete in its own folder, with its own Readme, licence, naming manifest and proof, so you can copy one folder into a project and leave the others.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio, no generative audio model. Nothing here is musical.

## The kits

| Folder | Kit | Sounds | Loops |
|---|---|---|---|
| `Anomalies/` | Exclusion II Anomalies: Anomaly Field, Detector and Artifact Sound Effects | 103 | 24 |
| `Emission/` | Exclusion II Emission: Emission Storm, Siren and Shelter Sound Effects | 102 | 16 |
| `Haul/` | Exclusion II Haul: Scavenging, Container and Loot Sound Effects | 103 | 2 |
| | **Total** | **308** | **42** |

**Anomalies**: Anomalies is a dead open place after the disaster: a short slapback off broken concrete and a thin dry tail, crackling air, a cheap handheld detector with a small speaker, iron bolts and a lead lined case. Each field owns a register and a tempo: a gravity well is sub pressure and debris pulled in, an electric field a buzz and snapping arcs, a heat field a fluttering roar and crackle, a chemical mist a fizz and bubbles, a spatial rift beating tones and warping sweeps. The field grid puts all three events in every field under one name, so a game picks the file from the field and what it is doing; the detector is a ladder; the detector and the case are lifecycles.

**Emission**: Emission is a red sky over a dead town: very long slapbacks off distant blocks and a wide tail, a mechanical siren on a pole, a steel hatch on a concrete stair, ash. The emission is a pressure event, not weather: it builds as a sub drone and crackling air, breaks as a broadband wave, passes as falling rumbles and leaves ash. The sky grid puts every sky event in every place under one name, so a game swaps one word when the player goes underground. The sky, the siren and the pressure are ladders; the emission, the siren motor and the hatch are lifecycles.

**Haul**: Haul is a looted flat and a scrapyard after the disaster: a small hard room with a short bright tail, rust, rotten wood, mildewed cloth and a canvas rucksack. The rummage grid gives each pile its own material (rubble is dull chunks, scrap clanks and rings, a wrecked car is a body panel and glass, a rotten crate splits, a cloth heap is friction and soft thuds) and each tool its own part (a crowbar rings, scrapes and levers, a boot kicks), so a game picks the file from the pile and the tool in hand. The pack weight is a ladder; the seven containers are lifecycles.

## Licence, the short version

**Royalty free. Commercial use. No attribution required.** Full terms in `LICENSE.txt` (each kit folder carries the same terms). Credit line, if you want one:

```
Sound effects: "Exclusion II" by Core Systems Asset Factory
```

## Proof

Each kit's `pack_proof.json` carries a sha256 and a full measurement record for every file: **2,848** signal checks across the three kits, 0 failed. They measure signal, not taste; listen to the free demo first.

*Core Systems Asset Factory · Exclusion II: Post Apocalyptic Sound Effects in Three Packs (Anomalies, the Emission and the Scavenger's Haul) · 308 sounds*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
