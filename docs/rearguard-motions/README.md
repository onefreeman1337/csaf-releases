# Rearguard Motions — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Rearguard Motions  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/mz-plugin-library  
**Docs published:** 2026-11-18


---

# Rearguard Motions v1.0.1 for RPG Maker MZ

Part 1 of **Rearguard** by Core Systems Asset Factory (https://csaf.itch.io). An add-on for **Over the Shoulder**.

Over the Shoulder shows your party from behind, with the enemy ahead of them, using the up-facing row of each
walking sheet, and it moves that one drawing by code. Rearguard Motions gives the back view real poses: **15 of
MZ's 18 battle motions are drawn**, 3 drawings each, built at load time from each actor's own walking sheet,
with the equipped weapon drawn in. Seen from behind, the hero raises the sword beside the head and cuts down
across the body, drives a spear toward the horizon, holds the blade across over the head to guard, kneels when
dying and falls when dead. At victory, when Over the Shoulder turns the party round, they cheer facing the
player. No art to draw and no note tags needed.

Every line of these plugins was written with AI assistance. No image files ship: every pose is built from your
own art when the battle starts.

## The motions

| Motion | Seen from behind |
| --- | --- |
| swing | the weapon raised beside the head, then cut down across the body |
| thrust | the point driven up toward the enemy |
| missile | a bow drawn and loosed, a gun raised and fired with its flash, a hand weapon thrown |
| skill | a big blow raised high on one side |
| guard | the weapon held across over the head |
| damage | a shudder to one side |
| evade | a sidestep |
| chant | the arms out at the sides, rising and falling |
| spell | the hands thrust out, then thrown wide |
| item | a flask raised |
| dying | down on one knee |
| dead | lying on the ground |
| abnormal | the shoulders and head sag, swaying (Over the Shoulder's sway is kept) |
| sleep | lying, with one, two, then three Z marks over the actor |
| victory | facing the player after Over the Shoulder turns them round: the weapon raised high |

**walk**, **wait** and **escape** stay the walking sheet's own frames, as Over the Shoulder shows them: the
walk-in, the breath while standing, and the turn to run.

The thirteen battle poses come from **RallyCore** 1.2.0, the same file Rally ships, so a character fights the
same way on the map (Rally Field), side-on (Rally Actors) and from behind (here). Abnormal and sleep are drawn
by RearguardCore from the same pixels, in the sheet's own colours. Nothing is mirrored, resampled or blended.

Over the Shoulder still moves each figure: the step up on its turn, the lunge toward the horizon on an attack
(the figure shrinks as it goes), the recoil and flash on a hit, the camera drift. Where it used to squash or tilt
its one drawing to stand in for a pose (a guard, a fall, sleep, the swing), that stand-in is dropped, because
the pose is now drawn.

## The weapon

The weapon drawn is the one the actor has equipped: its weapon type's attack motion in the database picks the
form (MZ's own Weapon image ids 1 to 12 map to dagger, sword, flail, axe, whip, staff, bow, crossbow, gun, claw,
glove and spear), with no weapon an actor fights bare-handed. The same tags as Rally decide it:

| Where | Note | What it does |
| --- | --- | --- |
| Weapon | `<rally weapon: axe>` | the form drawn for this weapon |
| Weapon | `<rally material: gold>` | its metal: iron, steel, copper, gold, crystal or obsidian |
| Actor | `<rally weapon: spear>` | the form drawn when the actor has no weapon |
| Actor | `<rearguard: off>` | keep Over the Shoulder's own moves for this actor |
| Actor | `<rearguard>` | draw this actor when Which actors is set to tagged |

## Install

1. Install **Over the Shoulder** (OverTheShoulder.js and OverTheShoulderCore.js) if it is not installed.
2. Copy the five files from `js/plugins` into your project's `js/plugins` folder: PostureCore.js, KnackCore.js,
   RallyCore.js, RearguardCore.js and RearguardMotions.js.
3. Turn all five on in the Plugin Manager. **Any order works**, before or after Over the Shoulder: Rearguard
   joins in when the game boots, after every plugin has loaded, and its step always runs after Over the
   Shoulder's. This order reads best: Over the Shoulder's two files, then PostureCore, KnackCore, RallyCore,
   RearguardCore, RearguardMotions.
4. Start a battle. Each actor's back-view poses are built once as the battle starts, before its first frame.

If you already use Rally, Knack or Posture, keep one copy of PostureCore.js, KnackCore.js and RallyCore.js: they
are the same files. If Over the Shoulder is not installed, Rearguard Motions says so once in the console and does
nothing.

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Which actors | every actor Over the Shoulder draws | or only actors tagged `<rearguard>`; `<rearguard: off>` always keeps an actor out |
| Weapon drawn | the equipped weapon's type | or one fixed form for everyone (a weapon's `<rally weapon>` tag still wins) |
| Weapon metal | iron | the metal of the drawn weapon (a weapon's `<rally material>` tag wins) |
| Cheer when turned round | ON | ON: after Over the Shoulder turns the party round at victory, they cheer facing the player. OFF: Over the Shoulder's hop |

With Over the Shoulder's Turn round at victory switched off, the party cheers from behind instead.

## Plugin command

| Command | What it does |
| --- | --- |
| Turn on or off | OFF: battles show Over the Shoulder's own moves again. Kept in the save |

## Which actors stay on Over the Shoulder's own moves

- An actor tagged `<rearguard: off>`, or untagged when Which actors is set to tagged.
- An actor with a hand-drawn back picture (`<ots-back>`), a sheet that is not 3 x 4 (`<ots-sheet>`) or a row
  other than the up row (`<ots-row>`): the poses are built from a standard walking sheet's up row.
- An actor whose sheet RallyCore refuses (a frame with nothing in it, a figure too small to pose): the console
  says which and why, once.
- An actor Over the Shoulder itself shows side-on (`<ots-side>`, or no walking sheet at all).

## What it does not do

- It draws nothing for the enemies: that is Rearguard Foes, part 2.
- It does not change who fights: that is Rearguard Duels, part 3.
- It does not move the figures: Over the Shoulder's walk-in, step, lunge and camera are unchanged.
- It is not tested with VisuStella Battle Core. Over the Shoulder stands down while that plugin is on, and
  Rearguard Motions does nothing when Over the Shoulder is not staging the battle.

## Performance

A back-view sheet is built once per look (sheet, character, weapon form, metal) when the battle starts and kept
for later battles; nothing is built or allocated per frame. Every member of the battle party is built at the start,
including members another plugin keeps off the field (Rearguard Duels' bench), so a member sent in mid-battle does
not pause the frame it arrives on. Measured in the real engine with Over the Shoulder
and four actors in a running battle: within the budget of 60 draw calls a frame, with no texture uploads while
the fight plays. The numbers are in the compatibility notes below and in the test report.

## Compatibility

Tested against RPG Maker MZ with the stock scripts unmodified and Over the Shoulder 1.0.0, in the real engine,
with the Plugin Manager listing Over the Shoulder first and, separately, last.

Rearguard Motions extends four engine methods and calls the original of each, none replaced:
`Sprite_Actor.prototype.updateFrame` (after Over the Shoulder chooses a figure's drawing for the frame, a drawn
motion swaps in its pose, at the same place and scale, with the feet on the same spot), `Scene_Battle.prototype.start`
(the sheets are built before the first frame of play), `Scene_Battle.prototype.terminate` (the copies of the walking
sheets' pixels are dropped) and `Scene_Boot.prototype.start` (where it joins, once every plugin has loaded).

**With Rally:** Rally Actors and Rally Foes draw MZ's own side-view battle; Over the Shoulder replaces that view with
the back view while it stages a battle, and Rearguard Motions draws only inside Over the Shoulder's battle. The three
share RallyCore.js, PostureCore.js and KnackCore.js: one copy of each.

A plugin that changes how MZ draws the party's battle sprites will not show while Over the Shoulder stages the
battle, since Over the Shoulder draws the actors itself. Not tested with VisuStella Battle Core: Over the Shoulder
stands down while it is on, and then Rearguard Motions does nothing.

## Saves

The on/off switch lives in `$gameSystem._rearguard` (`{v: 1, on}`), plain data with a version number. Nothing
drawn is saved. A save made with the plugin on loads the same with it removed: MZ ignores the extra field.

## Changes

- **1.0.1** (2026-11-18): the back-view sheets are built for the whole battle party when the battle starts, not only
  for the members on the field. With Rearguard Duels, each bench member's sheet used to be built on the frame a
  Switch sent them in, a visible pause on that frame (one sheet built per member sent in). No other change.
- **1.0.0** (2026-11-17): first release.

## Licence

See `LICENSE.txt`. Use it in any game, commercial or not. Do not resell or redistribute the plugins themselves.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
