# Reroll: Auto Battler Sound Effects in Three Packs — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Reroll: Auto Battler Sound Effects in Three Packs  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-22


---

# Reroll: Auto Battler Sound Effects in Three Packs (Shop and Economy, Board and Merge, Round and Results)

**322 auto battler sound effects in 3 packs, WAV and OGG, for any game engine, royalty free for commercial games: Shop and Economy (110 sounds), Board and Merge (107 sounds) and Round and Results (105 sounds).**

One auto battler loop, three packs, one sound. The shop phase (rerolls, buying and selling by cost tier, gold, interest, shop levels, items, augments and the timer), the board (placing units, the bench, merging copies into stars, trait tiers, items on units and a bag grid) and the round (the fight resolving, round results, streaks, player damage, placement and rewards), all voiced in one identity: glass, gold and gems. Files are named by game state (`reroll_cards_01`, `buy_t3_02`, `merge_star3_01`, `trait_gold`, `streak_win_4`, `place_1`). No file name appears in two packs, so all three folders drop into one project. Each pack is complete in its own folder, with its own Readme, licence, cue sheet, naming manifest and proof. `CUE_SHEET.csv` maps every file to its game event.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio, no generative audio model. Nothing here is musical and nothing here is a voice.

## The packs

| Folder | Pack | Sounds | Loops |
|---|---|---|---|
| `ShopEconomy/` | Reroll Shop and Economy: Auto Battler Reroll, Buy, Sell and Income Sound Effects | 110 | 2 |
| `BoardMerge/` | Reroll Board and Merge: Auto Battler Placement, Star Up and Trait Sound Effects | 107 | 1 |
| `RoundResults/` | Reroll Round and Results: Auto Battler Timer, Streak and Placement Sound Effects | 105 | 2 |
| | **Total** | **322** | **5** |

**Shop and Economy**: Shop and Economy is the shop phase of an auto battler, a chess style team builder or a roguelike shop: the reroll that deals five new cards, a buy that rings brighter for a pricier unit, a sale that slides the gold back, interest that adds one coin per gold earned, the shop levelling up, item and augment picks and the timer counting the shop down.

**Board and Merge**: Board and Merge is everything a player does with units between fights: picking a unit up and setting it on a tile, swapping and benching, the merge that fuses copies into a higher star and rings longer with every star, trait tiers from bronze to prismatic, items going onto units and combining, and the bag grid variant where items are lifted, rotated, placed and linked.

**Round and Results**: Round and Results is the fight and everything after it: match found, round start and the countdown, the auto attack feedback by style and weight, abilities, mana, shields, crits, dodges, stuns and knockouts, a seamless fight bed and a tenser overtime bed, the round won, lost or drawn, win and loss streaks from two to five, damage to the player from a scratch to a crushing blow, elimination, loot, placement from eighth to first and rank changes.

## Licence, the short version

**Royalty free. Commercial use. No attribution required.** Full terms in `LICENSE.txt` (each pack folder carries the same terms). Credit line, if you want one:

```
Sound effects: "Reroll" by Core Systems Asset Factory
```

## Proof

Each pack's `pack_proof.json` carries a sha256 and a full measurement record for every file: **2,936** signal checks across the three packs, 0 failed. Every pack was also compared with its two sibling packs, file by file (**69,110** pairs, every one measured as a separate sound), so one identity never means one gesture under three names. They measure signal, not taste; listen to the free demo first.

*Core Systems Asset Factory · Reroll: Auto Battler Sound Effects in Three Packs (Shop and Economy, Board and Merge, Round and Results) · 322 sounds*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
