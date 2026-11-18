# Rearguard — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Rearguard  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-18


---

# Rearguard v1.0.0 for RPG Maker MZ

By Core Systems Asset Factory (https://csaf.itch.io).

Back-view battles for RPG Maker MZ, built from your own walking sprites, in four parts and 9 plugin files: Over the
Shoulder stages MZ's battle behind your party, and the three Rearguard add-ons make them fight from there with
drawn poses, put character sheets on the other side as foes that face the party, and turn the duel staging into
real one-on-one duels. No new art to draw.

| Part | What it does in your game | Files |
| --- | --- | --- |
| **Over the Shoulder** | The party stands with their **backs to the player**, cut from the up-facing row of each walking sheet, the enemy ahead of them on a floor laid to the horizon. **3 stagings** (line, rank, duel), **50 drawn floors**, **8 plate themes**, a drawn HP plate per actor. | `OverTheShoulderCore.js` + `OverTheShoulder.js` |
| **Rearguard Motions** | Real poses seen from behind: **15 of MZ's 18 battle motions drawn, 3 drawings each**, with the equipped weapon drawn in: the swing beside the head and down across the body, the thrust toward the horizon, the guard over the head, the kneel, the fall, sleep with Z marks, and a cheer facing the player at victory. | `RearguardMotions.js` + the four cores |
| **Rearguard Foes** | Any character sheet fights as **an enemy that faces the party**, in **all 18 of MZ's battle motions, 3 drawings each**, with its weapon drawn in. One note tag per enemy: `<rearguard: Actor1, 3>`. | `RearguardFoes.js` + the four cores |
| **Rearguard Duels** | Over the Shoulder's duel staging becomes a **real one-on-one duel**: one fighter out, the rest on a **drawn bench** posed by their state, a **Switch** command, a fallen fighter replaced by the member the player picks, the troop **one at a time**, and a drawn **send-out strip** at every swap. | `RearguardDuels.js` + the four cores |

The four cores are shared by the three Rearguard add-ons: `PostureCore.js`, `KnackCore.js`, `RallyCore.js` (1.2.0)
and `RearguardCore.js` (1.1.0). This download carries one copy of each.

## Install

1. Copy every file in this download's `js/plugins/` folder into your project's `js/plugins/` folder.
2. Open the Plugin Manager and turn ON Over the Shoulder's two files, the four cores, and the add-on or add-ons you
   want. Any order works; this order reads best: OverTheShoulderCore, OverTheShoulder, PostureCore, KnackCore,
   RallyCore, RearguardCore, RearguardMotions, RearguardFoes, RearguardDuels.
3. Start a battle. The party fights from behind with no setup. Foes wait for one note tag on an enemy
   (`<rearguard: Actor1, 3>`). Duels wait for the duel staging (Over the Shoulder's Staging parameter, its Set staging
   command, or a map note `<ots-staging: duel>`).

The three Rearguard add-ons need Over the Shoulder: without it each one says so once in the console and does nothing.
Every part's full guide (parameters, note tags, plugin commands, limits) is in the `Guides/` folder:
`Guides/Over_the_Shoulder.md`, `Guides/Rearguard_Motions.md`, `Guides/Rearguard_Foes.md`, `Guides/Rearguard_Duels.md`.

**One thing differs from Rearguard Motions' own guide:** it ships RearguardCore 1.0.0 and this download ships 1.1.0,
the version Foes and Duels need. 1.1.0 draws everything 1.0.0 drew, unchanged.

## Using the four together

Measured in the engine with all 9 files ON at their default parameters, in a blank RPG Maker MZ project on MZ's own
database, with one edit a buyer would make: the enemies of the stock troop given the note tag `<rearguard: Actor2, 5>`.

- **One battle, all four parts.** The stock party stands with their backs to the player and swings from behind with
  their own weapons; the stock troop's enemies stand as the tagged character facing the party, and their attack is
  the sword's swing.
- **Duels only where you stage them:** in the default line staging the whole party fights. Set the duel staging and
  the same battle is a duel: one fighter out, the other three drawn on the bench, one foe on the front disc and the
  other waiting, and the fighter still swings from behind. A Switch sends a bench member in.
- **No pause on a Switch:** every battle member's back-view poses are built when the battle starts, the bench
  included, so a member sent in mid-battle arrives without a build on that frame (Rearguard Motions 1.0.1).
- **One save carries all four parts,** and it still loads with any one add-on turned off afterwards: the battle runs
  and the other add-ons still draw.
- **Plugin order does not change the result:** the same checks pass with the files in the order above, in reverse
  order and in a shuffled order.
- Eight engine methods are extended by more than one file (`Scene_Battle` create, start and terminate,
  `Scene_Boot.prototype.start`, `Sprite_Actor.prototype.updateFrame`, `Sprite_Enemy` updateBitmap and
  updateStateSprite, and Over the Shoulder's own `Window_BattleStatus.prototype.itemRect`). Each file saves the
  original and calls it, so every part's addition runs.

## Compatibility

- RPG Maker MZ 1.x. Tested on the MZ 1.10.0 runtime, in turn-based battles.
- **Not tested with VisuStella Battle Core**, which rewrites the same battle sprites. While it is on, Over the
  Shoulder stands down and says so in the console, and the three add-ons then do nothing.
- Tested with only these plugins loaded. No VisuStella plugin was loaded in these tests.
- No part loads an image, a font or a sound file: every floor, plate, pose, foe, bench and strip is drawn in code from
  your own project's walking sprites and battlebacks.
- The characters, the painted enemy pictures and the battlebacks in the store images are CSAF test art and are **not
  included**. The floors, plates, poses, character-sheet foes, bench and strips in them are what the plugins draw, and
  every part builds them from **your** sprites and battlebacks.
- If you also own Over the Shoulder, Rally, Posture, Knack or one of the Rearguard parts on its own: keep ONE copy of
  each core file, and keep RearguardCore 1.1.0. The other cores in this download are the same files, byte for byte.

## Versions

Over the Shoulder 1.0.0, Rearguard Motions 1.0.1, Rearguard Foes 1.0.0, Rearguard Duels 1.0.0, RearguardCore 1.1.0,
RallyCore 1.2.0.

## Already own the MZ Plugin Library?

All four parts are also inside the MZ Plugin Library (https://csaf.itch.io/mz-plugin-library), byte for byte the
same files. If you own the Library, you already have Rearguard.

## Licence

See `LICENSE.txt`. Every line of code was written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
