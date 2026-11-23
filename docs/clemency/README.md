# Clemency — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Clemency  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-23


---

# Clemency v1.0.0 for RPG Maker MZ

By Core Systems Asset Factory (https://csaf.itch.io).

An Undertale-style battle frame for RPG Maker MZ, in three parts and 6 plugin files: MZ's battle screen redrawn as one
white-on-black box with FIGHT, ACT, ITEM and MERCY plates and a soul for a cursor; enemies you can talk down and spare,
from note tags; and a sliding strike meter on FIGHT, with every enemy battler redrawn as a one-bit figure from your own
art. No art to draw: the box, the type and the meters are drawn in code, and the one-bit enemies are made from the
battlers you already have.

| Part | What it does in your game | Files |
| --- | --- | --- |
| **Clemency Box** | The battle becomes **one drawn box on a black field**. Every line of the battle types into it (a flavour line each turn, the battle log, the start, victory, reward, level-up and defeat messages). Under it sit the party plates and four command plates, **FIGHT, ACT, ITEM and MERCY**, and the cursor is a **soul**. MZ's windows, frame and font are gone from the battle. | `ClemencyBoxCore.js` + `ClemencyBox.js` |
| **Clemency Act and Mercy** | **ACT turns into talking.** Pick an enemy and one of its acts; its **mood** moves, shown as a heart and a bar over it. At 100 it is ready, and **Spare** (new in MERCY) lets it leave the fight. Acts, Check lines and spared lines come from enemy note tags; an enemy with no tags gets three acts dealt from its database id (one it likes, one it tolerates, one it hates). | `ClemencyActCore.js` + `ClemencyAct.js` (needs Clemency Box) |
| **Clemency Strike** | **FIGHT becomes a timing meter**: a bar slides across a target plate and stopping it near the centre hits harder, with **nine patterns** picked from the weapon type. **Every enemy is redrawn as a one-bit figure** from its own battler image when the battle starts, in three styles (line, dither, ink). | `ClemencyStrikeCore.js` + `ClemencyStrike.js` |

Box and Strike each work on their own; Act and Mercy needs Box's two files.

**Where the skills go when Act and Mercy is on:** by default every actor talks with ACT, and a talking actor's skills
move to the last entry of every act list (ACT, an enemy, then **Skills**). For a caster, put `<Clemency Magic>` in the
actor's or class's note and that actor's ACT stays its skill list, as Box draws it; or set *Who talks with ACT* to
*tagged* so only actors or classes with `<Clemency Talk>` talk. The Act and Mercy guide has the details.

## Install

1. Copy every file in this download's `js/plugins/` folder into your project's `js/plugins/` folder.
2. Open the Plugin Manager, add an entry for each file of the part or parts you want, and turn it ON. Any order works;
   this order reads best: ClemencyBoxCore, ClemencyBox, ClemencyActCore, ClemencyAct, ClemencyStrikeCore,
   ClemencyStrike. Put them below other battle plugins.
3. Nothing else is needed to start: a stock battle opens in the box with its enemies one-bit, FIGHT opens the meter and
   ACT talks. Add note tags to enemies when you want their own acts and lines, for example
   `<Clemency Act: Compliment | +40 | You tell {name} it looks great. | {name} blushes.>` (the act's name, the mood
   change, then its lines).

Every part's full guide (parameters, note tags, plugin commands, limits) is in the `Guides/` folder:
`Guides/Clemency_Box.md`, `Guides/Clemency_Act_and_Mercy.md`, `Guides/Clemency_Strike.md`. They are the parts' own
guides, unchanged: where a guide says "this download", it means that part's own single download. This volume carries
all three parts, Clemency Box included, and this Readme and `LICENSE.txt` cover all of it.

## Using the three together

Measured in the engine with all 6 files ON, in a blank RPG Maker MZ project on MZ's own database, every parameter at its
default, MZ's first troop (two Goblins) against MZ's starting party:

- **One fight, all three parts.** The battle opened in the box with both Goblins drawn one-bit on the black field.
  Played with the keyboard only: the first actor chose FIGHT each turn and Strike's meter opened **inside the box** (the
  box closes onto the meter's plate while the bar slides, then opens again for the log); the others chose ACT and talked
  to the second Goblin until its heart turned the spare colour; then Spare. The battle was won with one Goblin struck
  down and the other spared.
- **Plugin order does not change it:** in the order above, in reverse order and in a shuffled order, the box is built,
  the enemies are one-bit, FIGHT opens the meter in the box, ACT opens the troop to talk to and Spare is in MERCY.
- **Turn a part off and the others still work, as each guide says.** Without Strike, FIGHT is a plain attack and the
  enemies keep their art, and ACT and Spare still work. Without Act and Mercy, MERCY holds Defend and Flee and FIGHT
  still opens the meter. Without Box, Act and Mercy writes one warning to the console naming `ClemencyBox.js` and stands
  aside, and Strike runs on MZ's own battle windows.
- **The save file:** only Strike's settings record (three small fields) is saved. Moods live only for the battle, and
  the box saves nothing. With every file removed, a save made with all three loads and the map runs.
- Eight engine methods are extended by more than one file (among them `Scene_Battle.prototype.createAllWindows`, which
  all three extend, `Sprite_Enemy.prototype.updatePosition` and the `Sprite_Damage` popup methods). Each file saves the
  original and calls it, so every part's addition runs.
- **Frame cost with all three acting at once:** six enemies drawn one-bit, every actor on auto battle so every action
  opened the strike meter inside the box, the mood meters jumping every 40 frames and the leaving scatter every 90: over
  300 measured frames of that scene our in-engine performance check counted about **6** draw calls a frame (its budget is
  60) and no MZ window drawn.

## Compatibility

- RPG Maker MZ. Tested on the MZ 1.10.0 runtime only, with MZ's own battle system, as each guide states: Box and Act
  and Mercy in turn based and Time Progress, front view and side view; Strike in turn based, front view and side view.
  The fight above was turn based, front view.
- Tested with only these plugins loaded. A plugin that rebuilds the battle scene's windows or its action sequence
  (VisuStella Battle Core, for example) has not been tested with them.
- What Clemency Box changes by design, as its guide says: it skips the Fight / Escape menu at the start of a turn (Flee
  lives in MERCY), it replaces the actor command list with the four plates, and it replaces the drawing (never the
  logic) of the battle log and help windows. **Commands that other plugins add to MZ's actor command window are not
  shown** while Box is on.
- No part ships an image, a font or a sound file. Every drawing is built in code; the one-bit enemies are made from your
  project's own battler images.
- The pixel-art enemies in the store images (a kobold shaman, a stone warden, an eye tyrant and others) are the studio's
  own demo art and are **not included**: in your game the one-bit figures are drawn from **your** battlers.
- For the dodge phase of the same fight, see **Barrage** (https://csaf.itch.io/barrage): enemy attacks open its dodge
  arena over the box. Barrage is not in this download.

## Versions

Clemency Box 1.0.0, Clemency Act and Mercy 1.0.0, Clemency Strike 1.0.0.

## Already own the MZ Plugin Library?

All three parts are also inside the MZ Plugin Library (https://csaf.itch.io/mz-plugin-library), byte for byte the same
files. If you own the Library, you already have Clemency.

## Licence

See `LICENSE.txt`. This product was made with AI tools: the code was produced with AI assistance, everything it draws in
your game is drawn by that AI-written code, and the store images were made with AI tools too.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
