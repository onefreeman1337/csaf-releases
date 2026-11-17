# Reelhouse Floor: Slot Machine Sound Effects in Three Cabinets (Mechanical One Armed Bandit, Video Slot and Pachislot) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Reelhouse Floor: Slot Machine Sound Effects in Three Cabinets (Mechanical One Armed Bandit, Video Slot and Pachislot)  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-17


---

# Reelhouse Floor: Slot Machine Sound Effects in Three Cabinets (Mechanical One Armed Bandit, Video Slot and Pachislot)

**320 sound effects in 3 kits, WAV and OGG, for any game engine: Cast Iron (103 sounds, a mechanical one armed bandit with no electricity), Video Reels (114 sounds, a video slot cabinet) and Three Stop (103 sounds, a pachislot cabinet).**

Three slot machine cabinets for a game that holds more than one machine, each with its own acoustic language: a cast iron bandit with no electricity, a video cabinet with electronic reels and feature games, and a pachislot stopped by hand. Each pack is complete in its own folder, with its own Readme, licence, naming manifest and proof, so you can copy one folder into a project and leave the others.

## One set of names, three machines

Every kit ships the same core names as *Reelhouse: Slot Machine Sound Effects*, the studio's single cabinet pack: `coin_insert_01..03`, `reel_start_01..02`, `reel_spin_slow_loop`, `reel_spin_medium_loop`, `reel_spin_fast_loop`, `reel_anticipation_loop`, `reel_1_stop`, `reel_2_stop`, `reel_3_stop`, `reel_stop_01..03`, `near_miss_01..03`, `no_win_01..02`, `win_1`, `win_2`, `win_3`, `win_4`, `win_5`, `payout_cascade_1_loop`, `payout_cascade_2_loop`, `payout_cascade_3_loop`, `payout_cascade_4_loop`, `payout_cascade_5_loop` (Video Reels adds `reel_4_stop` and `reel_5_stop` for its five reels). The core ladders climb the same way in every kit. A game wired to those names swaps a cabinet by changing the folder it loads from. Only the start differs: Cast Iron starts with `lever_pull_01..03`, with `lever_return` and `lever_locked`, Video Reels starts with `spin_button_01..02` and Three Stop starts with `lever_pull_01..03` (the start lever knocked down) with `lever_return`.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio, no generative audio model. Nothing here is musical.

## The kits

| Folder | Kit | Sounds | Loops |
|---|---|---|---|
| `CastIron/` | Cast Iron: Mechanical One Armed Bandit Sound Effects | 103 | 14 |
| `VideoReels/` | Video Reels: Video Slot Sound Effects with Feature Games | 114 | 18 |
| `ThreeStop/` | Three Stop: Pachislot Sound Effects | 103 | 17 |
| | **Total** | **320** | **49** |

**Cast Iron**: Cast Iron is the machine with no motor and no lamp: a cast iron case on an oak stand, three thin steel reels on one shaft, a lever arm on a coil spring dragging a ratchet, a clockwork timing train that drops one brake per reel, a brass coin tube and one nickel steel bell. The coin grid answers coin size by outcome, so a game changes one word in a file name for the coin a player feeds it; the bell is a ladder a game can drive from the size of the win; the lever, the jackpot and the back door run through their states.

**Video Reels**: Video Reels is the cabinet with no reel motor: the reels are drawn on a screen, so they sound electronic, and around them sit a plastic button deck on microswitches, touch glass, a bill validator with rollers, a thermal ticket printer and a steel cabinet with a fan. The feature games Reelhouse does not hold are here as ladders a game can drive from its own counters: the cascade chain, the respin counter, the scatter count, the progressive tier, the gamble step and the big win tier; the bill validator, the ticket printer and hold and win run through their states.

**Three Stop**: Three Stop is the cabinet the player stops by hand: a moulded plastic front, three spring loaded stop buttons on microswitches, stepper motor reels that lock with a thunk, a medal hopper and a medal tray, and a start lever knocked down with the palm. Medals are its coins, so `coin_insert` here is a medal into the slot. Reel slip is a ladder a game can drive from how late the player pressed; the medal counter, the bonus round and the bonus lamp run through their states.

## Licence, the short version

**Royalty free. Commercial use. No attribution required.** Full terms in `LICENSE.txt` (each kit folder carries the same terms). Credit line, if you want one:

```
Sound effects: "Reelhouse Floor" by Core Systems Asset Factory
```

## Proof

Each kit's `pack_proof.json` carries a sha256 and a full measurement record for every file: **2,960** signal checks across the three kits, 0 failed. They measure signal, not taste; listen to the free demo first.

*Core Systems Asset Factory · Reelhouse Floor: Slot Machine Sound Effects in Three Cabinets (Mechanical One Armed Bandit, Video Slot and Pachislot) · 320 sounds*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
