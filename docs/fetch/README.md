# Fetch — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Fetch  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-10-31


---

# Fetch for RPG Maker MZ

Doppelganger mirror-match bosses. A fetch is a folklore double. When the fight starts, this plugin copies your party into real enemies: each twin carries its hero's live level, stats, equipment, traits and learned skills, is drawn from that hero's own battler sheet in one of ten looks, and chooses its moves from that kit and from how the player has really been fighting.

No image files ship. Nothing is hand-copied into the database. Every twin is minted when the battle starts and gone when it ends.

## What you get

- **Two plugin files**, raw and readable: `FetchCore.js` (the looks, the record, the brain) and `Fetch.js` (the engine side).
- **Ten looks**, each a different structure rather than a recolour, listed below.
- **Three ways to start a fight**: a plugin command, an armed Battle Processing, or an enemy note you place in any troop.
- **A brain that chooses as it moves**: a healer can answer a twin that dropped this turn.
- **Habits**: each twin leans on what its own hero has actually been used for, over the whole save.
- **An entrance**: each hero's floor shadow slides across the field and the twin stands up out of it, with a MIRROR MATCH card.

## Before you buy

- **Engine.** RPG Maker MZ. Tested on core script version 1.10.0, in a desktop browser engine. MV is not supported.
- **Battle systems.** Tested in turn-based battles and both Time Progress modes, side view and front view.
- **Your art.** A side-view battle needs side-view battler sheets, which MZ's own actors already have. Standard sheets of 9 x 6 frames play every motion.
- **Deployment.** A sheet named only in a `<fetch-image>` note is not referenced anywhere MZ can see, so "Exclude unused files" may drop it. Keep a copy or leave that option off.
- **Loading.** Each sheet is read and drawn once while the battle scene loads, one per frame, behind the transition.
- **Not tested with VisuStella Battle Core,** see Compatibility.
- **Support.** Ask in the comments on the store page. This is version 1.0.0.

## Install

1. Copy `js/plugins/Fetch.js` and `js/plugins/FetchCore.js` into your project's `js/plugins` folder.
2. In the Plugin Manager, turn both on. Any order works.

That is the whole install. Your actors already have the art a twin needs.

## Start a mirror match

**The quick way.** In an event, add Plugin Command > Fetch > **Mirror Match**. The fight starts at once. Set a Result variable and a Win switch to branch afterward.

**Keep the If Win branch.** Plugin Command > Fetch > **Arm the Next Battle**, then an ordinary Battle Processing on the next line. The twins join that battle's troop. The arm is spent after one battle.

**Put it in a troop.** Make an enemy in the database, give it one of these notes and place it in any troop. The enemy's own EXP, Gold and drops are the twin's, so you set a boss's rewards the normal way. **Each twin carries them in full,** so `<fetch: party>` with 100 EXP and four heroes pays 400:

| Note on the enemy | What stands there |
| --- | --- |
| `<fetch: party>` | Every living battle member, in the party's own formation mirrored across the field |
| `<fetch: leader>` | The party leader, where you placed this enemy |
| `<fetch: member 2>` | That party member, where you placed this enemy |
| `<fetch: actor 5>` | That actor, in the party or not, where you placed this enemy |

A note Fetch cannot read leaves the enemy as the database has it and prints a warning to the console. Fetch never guesses.

## The looks

Pick one with the Default look parameter, per fight in the command, per enemy with `<fetch-look: void>`, per hero with `<fetch-look: ember>` on the actor, or at any time with the Set an Actor's Look command. Those are read in this order: the command or the enemy note, then Set an Actor's Look, then the actor's note, then the parameter.

| Look | What it is |
| --- | --- |
| shadow | Three hard tones of dark, a rim of cold light on the edge that faces the party, the eyes lit, the feet coming apart. |
| void | The figure becomes a window on the night: a bright nebula and stars held in its outline, a thin pale edge, white eyes. |
| mirror | Broken silver: shards of dark polished metal, each catching the hero a little out of true, bright where the glass is cut. |
| ink | A brush drawing come alive: bare paper for a body, the hero's own shadows laid in black ink and grey wash, drips running from every hem. |
| ember | A charcoal crust over fire: fissures of live heat running down the body, widest at the feet, sparks climbing off it. |
| frost | Hoarfrost: faceted planes of pale ice and needles of rime growing up out of every top edge, past the figure's own outline. |
| phantom | A pale teal ghost: seen through, fading out before the feet, a shimmer on every row, and hollow black eyes. |
| gilded | The paragon: beaten white gold with hard bright highlights inside a three-step aura, the hero the party will never be. |
| glitch | A corrupted save: rows torn sideways per frame, the colour channels split, whole blocks replaced by the missing-texture check. |
| crimson | The wet twin: red-black flesh glowing through its own skin at the edge, bright wet highlights on every top surface, and blood running from the hems. |

The look is drawn on every frame of the hero's sheet, so all 18 side-view motions work: walk, wait, chant, guard, damage, evade, thrust, swing, missile, skill, spell, item, escape, victory, dying, abnormal, sleep, dead.

**The eyes.** Fetch lights a small mark on each eye where it can find a face on the sheet, and skips frames where the eyes are shut. A face it cannot read (a helmet, a mask, a monster, red eyes on some stock heroes) gets no mark, and the figure still reads by its outline. So some heroes in a party can have lit eyes and some not. Turn this off with Light the eyes.

## What a twin copies

- **Its numbers.** Base parameters at the hero's level plus equipment, with the hero's rate traits applied once, by the engine, on the twin. At 100% every parameter equals the hero's exactly.
- **Its traits.** Everything from the actor, the class and the gear: elements, resistances, hit and evasion rates, extra actions.
- **Its skills.** Every learned skill usable in battle, plus Attack and Guard.
- **Its attack animation.** The hero's weapon, and that weapon's attack motion in side view.
- **Its live states**, when the fight starts, except Death. Turn this off with Copy live states.

**What a twin never uses.** A skill whose only effect is escaping, growing, learning or a bare common event: those are written for the player's side. Any skill can be kept from twins with `<fetch: no>` in its note.

A twin does not use items, because it has no inventory to take them from.

## How a twin chooses

In a turn-based battle MZ makes enemies pick when the turn opens. A twin picks again when it actually moves, so it can answer what happened this turn. Every option it could take gets a score, roughly in this order:

| What it sees | What it favours |
| --- | --- |
| A fallen ally, with a revive skill | Reviving first |
| An ally under Heal under % of Max HP | Healing, aimed at the lowest such ally |
| A hero it can finish | Taking the kill |
| The opening turns | A buff or debuff, never re-casting what is already held, never on a hero immune to it |
| A hero its skills hurt most | Striking that hero, by the engine's own damage formula, with elements and physical or magic rates counted |
| Past the stall turn | All but stops healing and presses the attack |

**Cunning %** is how often it takes the best-scoring choice. At 100 it always does. Otherwise it picks by weight, so a good move is still likely and a twin is never a macro. **Habit weight %** leans it toward the skills its own hero really uses. **Answer the last skill** leans it toward the last skill that hero used. Clear the record with Forget Habits.

## How long a fight runs

A mirror match is four on four at equal strength, which runs long at full HP. That is why **Max HP % defaults to 60**. Measured in the real engine with MZ's own auto-battle driving the party, 16 fights each, on the stock classes:

| Setup | Median turns | Party won | Twins won |
| --- | --- | --- | --- |
| Level 1, Max HP 60% (the default) | 21 | 16 | 0 |
| Level 12, Max HP 60% (the default) | 11 | 13 | 3 |
| Level 30, Max HP 60% (the default) | 11 | 15 | 1 |
| Level 12, Max HP 100% (an exact copy) | 22 | 5 | 11 |
| Level 12, Max HP 100%, all four heal | 32 | 9 | 7 |
| The control: stall guard off, Max HP 100%, all four heal | 43 | 1 | 15 |

"All four heal" gives every hero a healing skill. "Stall guard off" sets Stop stalling after turn to 999. MZ's auto-battle is only a stand-in for a player, so read this for the length of a fight rather than the difficulty. To make a fight harder raise Max HP % and Other stats % or give it a level offset, and to make it easier lower them.

## Plugin commands

| Command | What it does |
| --- | --- |
| Mirror Match | Starts the fight now. Who to copy, a look, level offset, Max HP %, other stats %, a troop to fight beside, can escape, continue on loss, Result variable (1 won, 2 escaped, 3 lost), Win switch. |
| Arm the Next Battle | The next battle started by anything adds these twins to its troop. |
| Set an Actor's Look | From now on this actor's twin wears this look. Saved with the game. Blank clears it. |
| Forget Habits | Clears what the twins know about how the player fights. |

## Notes

| Where | Note | What it does |
| --- | --- | --- |
| Enemy | `<fetch: who>` | Replaced by a twin. See above. |
| Enemy | `<fetch-look: void>` | That twin's look. |
| Enemy | `<fetch-level: +3>` | Read the base numbers this many levels higher or lower. |
| Enemy | `<fetch-hp: 150>` | Percent of the hero's Max HP. |
| Enemy | `<fetch-stats: 110>` | Percent of the hero's other stats. |
| Actor | `<fetch-look: ember>` | This hero's twin wears this look. |
| Actor | `<fetch-image: Name>` | Strike the twin from `img/sv_actors/Name.png` instead of the hero's own battler. |
| Skill | `<fetch: no>` | No twin ever uses this skill. |

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Default look | shadow | The look when nothing else names one. |
| Name format | %2 %1 | The twin's name in battle. %1 is the hero's name and %2 is the look's name, so a Gilded twin is not called Shadow. |
| Level offset | 0 | Read the base numbers this many levels from the hero's. Equipment is added either way. |
| Max HP % | 60 | Percent of the hero's Max HP. |
| Other stats % | 100 | Percent of the hero's Max MP, Attack, Defense, M.Attack, M.Defense, Agility and Luck. |
| Copy live states | ON | The twin starts with the states its hero is under. Never Death. |
| Start at full HP and MP | ON | OFF starts each twin at its hero's HP and MP rate. |
| Cunning % | 70 | How often a twin takes the best choice it can see. |
| Habit weight % | 50 | How far a twin leans on what its hero has really been used for. |
| Answer the last skill | ON | A twin leans toward the last skill its hero used. |
| Heal under % | 50 | A twin heals only an ally under this share of Max HP. |
| Stop stalling after turn | 12 | After this many turns twins all but stop healing. |
| EXP per twin | 0 | For the Mirror Match and Arm commands. A placeholder enemy's own rewards are used instead when there is one. |
| Gold per twin | 0 | See EXP per twin. |
| Rise from the floor | ON | The entrance. OFF: twins are simply there. |
| Motes | ON | The look's own smoke, sparks, drips or snow coming off the figure. |
| Light the eyes | ON | Light the eyes where a face is found. |
| Card text | MIRROR MATCH | Lettering over the field as the fight opens, with its reflection. Blank: no card. |
| Hide "emerged" lines | ON | Leaves the twins out of the "X emerged!" message. |
| Front-view scale | 3 | How big a twin is drawn in a front-view battle. |

## Front view and side view

In a **side-view** battle a twin is struck from the hero's side-view sheet, flipped to face the party, and runs real motions. It steps forward to act and goes back into the floor when it falls.

In a **front-view** battle a twin is struck from the hero's map sprite, facing the camera, at the Front-view scale. It has no side-view motions there, because a map sprite has none; it walks on the spot.

If neither sheet exists, the twin fights as a hooded figure and the console says so. A `<fetch-image>` file that is not there falls back to the hero's own sheet.

## Save data

Habits and look choices live in `$gameSystem._csafFetch`, one key with a version number. Twins themselves are never saved: every minted row is removed when the battle ends, so `$dataEnemies` is exactly as long as your database and no save holds a twin. A save made before Fetch was installed loads, and starts with no habits. Removing Fetch leaves a harmless unused key in the save.

## Performance

Every sheet is read once, one per frame, while the battle scene loads, then never again: a fight reads zero pixels. Per-frame work only swaps frames and moves a small fixed pool of motes. Measured in the real engine with four twins from 128 px HD sheets in a running fight: under the budget of 60 draw calls a frame, with no texture uploads and no bitmap redraws from Fetch.

## Compatibility

**Tested against RPG Maker MZ with the stock scripts unmodified**, verified by running the plugin in the real engine rather than only in tests.

**Plugin Manager order:**

- `FetchCore.js`

- `Fetch.js`

This order reads sensibly in the list and **nothing depends on it**. `Fetch.js` finds `FetchCore.js` the first time a twin is made, so any order works, including `Fetch.js` first (the order the in-engine and fresh-install tests load them in).

**Core methods extended: 21 by saved-original prototype extension, *none replaced*:** `Game_Troop.prototype.setup`, `Game_Enemy.prototype.enemy`, `Game_Enemy.prototype.makeActions`, `Game_Enemy.prototype.performAction`, `Game_Enemy.prototype.performDamage`, `Game_Enemy.prototype.transform`, `Window_BattleLog.prototype.showEnemyAttackAnimation`, `Game_Troop.prototype.enemyNames`, `Scene_Battle.prototype.start`, `Scene_Battle.prototype.terminate`, `Sprite_Enemy.prototype.setBattler`, `Sprite_Enemy.prototype.loadBitmap`, `Sprite_Enemy.prototype.update`, `Sprite_Enemy.prototype.updateFrame`, `Sprite_Enemy.prototype.updateStateSprite`, `Sprite_Enemy.prototype.updateCollapse`, `Sprite_Enemy.prototype.startBossCollapse`, `Sprite_Enemy.prototype.updateBossCollapse`, `Sprite_Enemy.prototype.revertToNormal`, `Spriteset_Battle.prototype.createEnemies`, `Spriteset_Battle.prototype.update`.

Because nothing is clobbered, Fetch co-exists with other plugins that patch the same seams. It is tested with the stock scripts only.

**It also extends 2 methods on core singletons, the same way: original saved and called through:** `BattleManager.processTurn`, `BattleManager.startAction`. Another plugin patching those keeps working.

**It also defines 5 methods that their core class only inherited:** `Game_Troop.prototype.onBattleEnd` (inherited from `Game_Unit`), `Game_Enemy.prototype.performEvasion` (inherited from `Game_Battler`), `Game_Enemy.prototype.performMagicEvasion` (inherited from `Game_Battler`), `Scene_Battle.prototype.isReady` (inherited from `Scene_Base`), `Sprite_Enemy.prototype.isMoving` (inherited from `Sprite_Battler`). That touches those classes only, never the parent. If another plugin redefines the same method on the same class, load Fetch after it.

**VisuStella Battle Core.** Not tested: it is a paid plugin that this studio has not run against Fetch. Fetch adds no scene and replaces no battle system, and its twins are real `Game_Enemy` objects in `$gameTroop`, so damage, states, targeting and turn order are the engine's. Battle Core adds its own side-view enemy path, so try one fight before you rely on the two together.

**Other enemy AI plugins.** A twin chooses its own actions, so a plugin that picks enemy actions will not steer a twin. The twin's whole kit is still in `enemy().actions` for anything that reads it.

## Credits

Written with AI assistance: every line of code, and the look of every twin. No sound and no narrative text ship in this product. Use it in commercial and non-commercial games with no royalty; do not redistribute the source. Copyright (c) 2026 Core Systems Asset Factory. See LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
