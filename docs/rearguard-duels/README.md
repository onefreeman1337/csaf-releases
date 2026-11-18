# Rearguard Duels — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Rearguard Duels  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-18


---

# Rearguard Duels v1.0.0 for RPG Maker MZ

Part 3 of **Rearguard** by Core Systems Asset Factory (https://csaf.itch.io). An add-on for **Over the Shoulder**.

Over the Shoulder's duel staging puts one party member low left and one enemy high right on raised discs, but the
whole party still fights. Rearguard Duels makes that staging a **real one-on-one duel**: one fighter stands out,
the rest of your battle members wait on a **drawn bench**, **Switch** sends a bench member in at the cost of the
turn, a fallen fighter is replaced by the bench member the player picks, and the troop steps up **one at a time**.
Every swap crosses the screen on a drawn **send-out strip** with whoever goes in, cheering.

Every line of these plugins was written with AI assistance. No image files ship: the bench, the bench window, the
strip and every figure in them are drawn when the battle starts, from your own character sprites.

## When is a battle a duel?

When Over the Shoulder stages it with its **duel** staging (its Staging parameter, its Set staging command, or a
map note `<ots-staging: duel>`) and Rearguard Duels is on. Nothing else to set up.

A troop whose **name** contains `<no duel>` fights as a whole party even then (a boss you want the whole party
against, say). The plugin command Turn on or off switches duels off and on for the whole game.

## What a duel does

- **One fighter.** The first battle member who can fight goes out. The others are on the bench, out of the fight:
  they cannot be hit, targeted or healed, and their states do not tick until they go in.
- **Switch.** An actor command, between Guard and Item. It opens the bench window; the player picks who goes in.
  It is the fighter's action for the turn and moves first, as Guard does. The fighter turns round and runs off
  the field toward the camera, the strip crosses the screen, and the new fighter walks in from below. The player
  can cancel back to the commands.
- **A fallen fighter.** When the fighter falls and two or more on the bench can still fight, the bench window opens
  before anyone else acts, and the player picks who goes in (it cannot be cancelled; a fallen member cannot be
  picked). With only one left who can fight, that one goes in without asking. With **When the fighter falls** set to *the next in line*, the next living member in party order goes
  in without asking. The fallen fighter fades from the disc.
- **The battle is lost** only when the fighter and the whole bench have fallen.
- **The troop one at a time.** The first troop member stands on the front disc; the rest wait, out of sight.
  When the foe in front falls or escapes, the next steps up onto the disc after its own strip. **The battle is won**
  when the troop is spent. An enemy a troop event makes appear (Enemy Appear, including the usual "when this
  foe falls, that one appears" page) joins the queue and steps up onto the disc in its turn. Set **Foes one at a time** OFF to keep the whole troop on the field.
- **Time-progress battles** work the same way. While the player picks from the bench, battle time stands still;
  whoever goes in starts their time gauge from empty.

## The bench

Beside the fighter's status plate, a plate in Over the Shoulder's theme shows who waits on the bench, each member
**drawn from their own walking sheet, facing the player, in a pose that shows their state**:

| State | Pose |
| --- | --- |
| ready | standing |
| HP under a quarter | down on one knee |
| asleep | lying, with Z marks |
| a status with the abnormal motion | shoulders and head sagging |
| fallen | lying down, the name in red |

The figures are drawn twice their size where the plate has room (once for tall sheets), standing at the plate's rail.
The bench window (Switch, or a fallen fighter) draws the same members larger with their HP, MP and state icons; a
ready member under the cursor raises their weapon, and one who is asleep, afflicted, kneeling or fallen keeps the
pose that says so.

The poses are cut from each sheet by **RearguardCore** 1.1.0, the same file Rearguard Foes ships: the front-facing
poses Rearguard Foes uses for its foes, here for your own party. A member's weapon in the
drawing follows their equipped weapon (a `<rally weapon: axe>` tag on the weapon picks the form, as in Rally
Actors and Rearguard Motions). A character whose sheet RearguardCore cannot pose is drawn standing from the
sheet's own front row.

## The send-out strip

A slanted band crosses the screen in the theme's colours, with speed lines, a burst of light, the member who goes
in drawn up to three times their size (as large as the band holds) with their weapon raised, a small label and
their name. For a party member it
slides in from the left; for a foe, from the right, with the foe's own picture (or, with Rearguard Foes, its own
character sheet cheering). Turn **Send-out strip** OFF to keep only the battle log lines.

## Install

1. Install **Over the Shoulder** (OverTheShoulder.js and OverTheShoulderCore.js) if it is not installed, and set
   its Staging to duel (or use its Set staging command, or a map note) where you want duels.
2. Copy the five files from `js/plugins` into your project's `js/plugins` folder: PostureCore.js, KnackCore.js,
   RallyCore.js, RearguardCore.js and RearguardDuels.js.
3. Turn all five on in the Plugin Manager. **Any order works**, before or after Over the Shoulder: Rearguard Duels
   joins in when the game boots, after every plugin has loaded. This order reads best: Over the Shoulder's two
   files, then PostureCore, KnackCore, RallyCore, RearguardCore, RearguardDuels.
4. Start a battle that Over the Shoulder stages as a duel.

**RearguardCore.js must be 1.1.0** (the file in this package). If you own Rearguard Foes, its four core files are the
same files as these, byte for byte: keep one copy. **If you own Rearguard Motions, replace its RearguardCore.js
(1.0.0) with this one**: 1.1.0 draws everything 1.0.0 drew, unchanged. With 1.0.0 in place the duel still works but
the bench, the bench window and the strip lose their poses and draw each member's walking frame (the console says so
once). PostureCore.js, KnackCore.js and RallyCore.js are the same files in all three parts. If Over the Shoulder is
not installed, Rearguard Duels says so once in the console and does nothing.

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Foes one at a time | ON | the troop fights one at a time; OFF keeps the whole troop on the field |
| When the fighter falls | the player chooses | who replaces a fallen fighter: the player picks from the bench, or the next in line |
| Switch command | Switch | the name of the actor command |
| Bench title | Bench | the heading over the bench plate and the bench window |
| Draw the bench | ON | the bench plate beside the fighter's status plate (needs Over the Shoulder's status plates) |
| Send-out strip | ON | the drawn band across the screen at every swap |
| Strip label (party) | GO | the small word over a party member's name on the strip |
| Strip label (foe) | NEXT | the small word over a foe's name on the strip |
| Message: come back | %1, come back! | the battle log line when the fighter is switched out (%1 = the name; blank = none) |
| Message: go | Go, %1! | the line when a bench member goes in |
| Message: next foe | %1 steps up! | the line when the next foe steps up |

## Plugin command

| Command | What it does |
| --- | --- |
| Turn on or off | OFF: a duel staging is a layout again and the whole party fights. Kept in the save |

## What stays MZ's

Nobody is added to or removed from your party: the duel only decides who is on the field. Skills, items, states,
troop events and rewards are MZ's. **EXP:** a bench member who went in during the duel gets full EXP; one who never
went in gets MZ's own reserve-member EXP (Database > System 1, "EXP for Reserve Members"). At the end of the battle
everyone is a battle member again, and MZ's own end of battle (states removed, a lost battle that may be lost
revives everyone) runs over the whole party.

## What it does not do

- It changes no layout: Over the Shoulder stages the duel. With another staging, or with Over the Shoulder off, or
  in a battle it stands down from, nothing changes.
- The bench is out of the fight: an effect on the whole party reaches the fighter only, and a fallen bench member
  cannot be revived until the battle ends.
- It draws no poses for the fighter on the field: that is Rearguard Motions (part 1), and character-sheet foes are
  Rearguard Foes (part 2). All three work together on one RearguardCore.
- The bench plate needs Over the Shoulder's status plates (its Draw status plates ON). With them off, the bench
  window and the strip still work.
- Over the Shoulder's command bar shows five commands at a time; with Switch added, an actor with two skill types
  has six, and the bar scrolls to the sixth.
- It is not tested with VisuStella Battle Core. Over the Shoulder stands down while that plugin is on, and then
  Rearguard Duels does nothing.

## Performance

Every battle member's front sheet is built once when the battle starts and kept for later battles; the bench
plate is redrawn only when something it shows changes (a number compared each frame, nothing allocated), and the
strip is painted once per swap. Measured in the real engine with Over the Shoulder in a running duel: within the
budget of 60 draw calls a frame, with no texture uploads while the fight plays. The numbers are in the test report.

## Compatibility

Tested against RPG Maker MZ with the stock scripts unmodified and Over the Shoulder 1.0.0, in the real engine, with
the Plugin Manager listing Over the Shoulder first, listing it last, and with Rearguard Motions and Rearguard Foes
installed too, in turn-based and time-progress battles.

Rearguard Duels extends nineteen engine methods and calls the original of each, none replaced: `Game_Party`
isAllDead and reviveBattleMembers; `Game_Actor.prototype.finalExpRate`; `Game_Action` setSkill and setItem (choosing
another command clears a pending Switch); `Window_ActorCommand.prototype.makeCommandList`;
`BattleManager` isBusy, updateStart, updateTurn, processTurn and endBattle; `Scene_Battle` create, start, update,
isAnyInputWindowActive, isTimeActive, updateCancelButton and terminate; `Scene_Boot.prototype.start` (where it joins, once every plugin
has loaded); and Over the Shoulder's own `Window_BattleStatus.prototype.itemRect`. It also defines three methods
their class only inherited, each calling the inherited original: `Game_Actor.prototype.isAppeared` (only the fighter is on the field),
`Game_Troop.prototype.isAllDead` (the waiting foes count) and `Game_Enemy.prototype.appear` (a foe an event makes
appear waits its turn). That touches those classes only, never the parent. If another plugin redefines the same
method on the same class, load Rearguard Duels after it.

## Saves

The on/off switch lives in `$gameSystem._rearguardDuels` (`{v: 1, on}`), plain data with a version number. Nothing
about a duel is saved: it ends with the battle. A save made with the plugin on loads the same with it removed: MZ
ignores the extra field.

## Licence

See `LICENSE.txt`. Use it in any game, commercial or not. Do not resell or redistribute the plugins themselves.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
