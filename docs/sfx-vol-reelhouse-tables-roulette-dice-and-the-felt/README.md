# Reelhouse Tables: Casino Table Sound Effects in Three Packs (Roulette Wheel, Craps and Dice Tables, Chips and Dealer on the Felt) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Reelhouse Tables: Casino Table Sound Effects in Three Packs (Roulette Wheel, Craps and Dice Tables, Chips and Dealer on the Felt)  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-18


---

# Reelhouse Tables: Casino Table Sound Effects in Three Packs (Roulette Wheel, Craps and Dice Tables, Chips and Dealer on the Felt)

**327 sound effects in 3 kits, WAV and OGG, for any game engine: The Wheel (105 sounds, a single zero roulette wheel), The Dice (117 sounds, the dice tables) and The Felt (105 sounds, chips and the dealer's apparatus on the felt).**

Three casino tables for a game that holds more than one table, each built as mechanisms and ladders rather than fixed takes: a roulette wheel whose rotor, ball, drop and settle are separate files a simulated wheel can drive; the dice tables; and the chips and the dealer's apparatus on the felt. Each pack is complete in its own folder, with its own Readme, licence, naming manifest and proof, so you can copy one folder into a project and leave the others.

## Wired to a croupier

Every kit's `pack.json` carries a `cueMap` pairing line ids of *High Table 01: Casino Croupier Voice Pack* (a separate voice pack from the same studio) with the file that belongs to the same moment: **53** pairs across the three kits. No voice ships here. A game that owns both wires "No more bets" to the ball by reading one file. Each kit's Readme prints its map.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio, no generative audio model. Nothing here is musical.

## The kits

| Folder | Kit | Sounds | Loops |
|---|---|---|---|
| `Wheel/` | The Wheel: Roulette Sound Effects | 105 | 17 |
| `Dice/` | The Dice: Craps and Dice Table Sound Effects | 117 | 11 |
| `Felt/` | The Felt: Casino Chips and Dealer Sound Effects | 105 | 9 |
| | **Total** | **327** | **37** |

**The Wheel**: The Wheel is a roulette wheel a game can drive, not one fixed spin take. The rotor and the ball are separate seamless loops at several speeds, so a game that simulates its own wheel crossfades the ball from fast to slow over whatever stopping time it rolls, then plays the drop with the bounce count it wants and the settle. The landing grid answers ball size by how it comes to rest; the round, the air ball wheel, the dolly and the cover run through their states.

**The Dice**: The Dice is the dice tables as mechanisms. A craps throw is a launch, bounces and a settle a game can play whole or in parts to match its own physics; the throw energy, the shake and the back wall are ladders; the landing grid answers how many dice by what they land on, so a game changes one word in a file name; the puck, the sic bo dome, the chuck a luck cage, the dice cup and the bowl run through their states.

**The Felt**: The Felt is the dealer's side of a card table. Chips are ladders by stack size, from one chip to a rack, so a game picks the file from the size of the bet; the card shoe, the shuffling machine, the float lid and the drop box run through their states. There is no hand of cards here: it is the apparatus and the chips around one.

## Licence, the short version

**Royalty free. Commercial use. No attribution required.** Full terms in `LICENSE.txt` (each kit folder carries the same terms). Credit line, if you want one:

```
Sound effects: "Reelhouse Tables" by Core Systems Asset Factory
```

## Proof

Each kit's `pack_proof.json` carries a sha256 and a full measurement record for every file: **3,012** signal checks across the three kits, 0 failed. They measure signal, not taste; listen to the free demo first.

*Core Systems Asset Factory · Reelhouse Tables: Casino Table Sound Effects in Three Packs (Roulette Wheel, Craps and Dice Tables, Chips and Dealer on the Felt) · 327 sounds*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
