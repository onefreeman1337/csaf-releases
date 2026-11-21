# Stratagem: Tactics RPG Battle Sound Effects in Three Voices — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Stratagem: Tactics RPG Battle Sound Effects in Three Voices  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-21


---

# Stratagem: Tactics RPG Battle Sound Effects in Three Voices (War Table, Command Deck, Sixteen Bit)

**552 tactics RPG battle sound effects in 3 kits, WAV and OGG, for any game engine: War Table (184 sounds, a fantasy tactics battle on a general's map table), Command Deck (184 sounds, a modern or sci fi tactics battle on a command screen) and Sixteen Bit (184 sounds, a retro tactics battle on a 16 bit console).**

Three voices on ONE turn. Every kit voices the same **178** core files under the same names (the grid cursor, unit select and move ranges, orders and menus, unit movement by class, phase banners and objectives, the battle forecast, clash hits by attack and weight, criticals, misses, counters and breaks, healing and status, the experience bar, level ups and the eight rung stat ladder, ranks, promotion, the shop, the forge, deployment and chapter results), so a game can switch its whole battle between War Table, Command Deck and Sixteen Bit by changing one folder. Each kit then adds its own look's sounds. Each kit is a complete pack in its own folder, with its own Readme, licence, cue sheet, naming manifest and proof. `CUE_SHEET.csv` maps every file to its game event in all three kits.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio, no generative audio model. Nothing here is musical and nothing here is a voice.

## The kits

| Folder | Kit | Sounds | Loops |
|---|---|---|---|
| `WarTable/` | Stratagem War Table: Fantasy Tactics RPG Battle Sound Effects | 184 | 3 |
| `CommandDeck/` | Stratagem Command Deck: Modern and Sci Fi Tactics Battle Sound Effects | 184 | 3 |
| `SixteenBit/` | Stratagem Sixteen Bit: Retro Tactics RPG Battle Sound Effects | 184 | 3 |
| | **Total** | **552** | **9** |

**War Table**: War Table voices a tactics battle as if it were played on a general's map table: the cursor is a wooden token tapped on the map, a confirm rings a small brass bell, a phase banner lands on a leather drum skin and every menu drags parchment. It fits fantasy tactics RPGs, grid strategy games, medieval war games and any turn based battle with a hand drawn map.

**Command Deck**: Command Deck voices a tactics battle as a clean command screen: the cursor blips, a confirm is a short held tone, a range overlay glides up in pitch and a status change chirps like data. It fits modern military tactics, sci fi squad tactics, mech and space strategy games and any turn based battle with a holographic map.

**Sixteen Bit**: Sixteen Bit voices a tactics battle the way a 16 bit console would: every tone is two operator FM, every rush of air is a noise channel, and every sound is reduced in bits and band, so a cursor tick is a short FM blip and a level up is an FM bell over a rising noise sweep. It fits retro tactics RPGs, pixel art strategy games and any turn based battle with a console look.

## Licence, the short version

**Royalty free. Commercial use. No attribution required.** Full terms in `LICENSE.txt` (each kit folder carries the same terms). Credit line, if you want one:

```
Sound effects: "Stratagem" by Core Systems Asset Factory
```

## Proof

Each kit's `pack_proof.json` carries a sha256 and a full measurement record for every file: **5,010** signal checks across the three kits, 0 failed. Every kit was also compared with its two sibling kits, file by file, so the same file name in two kits is measurably two different sounds. They measure signal, not taste; listen to the free demo first.

*Core Systems Asset Factory · Stratagem: Tactics RPG Battle Sound Effects in Three Voices (War Table, Command Deck, Sixteen Bit) · 552 sounds*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
