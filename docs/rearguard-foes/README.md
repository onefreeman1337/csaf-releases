# Rearguard Foes — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Rearguard Foes  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-18


---

# Rearguard Foes v1.0.0 for RPG Maker MZ

Part 2 of **Rearguard** by Core Systems Asset Factory (https://csaf.itch.io). An add-on for **Over the Shoulder**.

Over the Shoulder shows your party from behind, facing the enemies. Rearguard Foes puts **any character sheet on
the other side as an enemy that faces the party**: a bandit, an orc warchief, a pirate gunner, the town watch
turned against you. The foe is built from the sheet's own frames, facing the party, in **all 18 of MZ's battle
motions**, 3 drawings each, with its weapon drawn in. It walks in toward the party, waits and
breathes, steps forward on its turn and swings, thrusts or shoots, casts, guards, flinches, kneels when its HP
is low, falls, sleeps, turns its back and runs when it escapes, and cheers if the party falls. One note tag per
enemy; no art to draw.

Every line of these plugins was written with AI assistance. No image files ship: every pose is built from your
own art when the battle starts.

## Make an enemy a foe

Database > Enemies > Note:

| Note | What it does |
| --- | --- |
| `<rearguard: Actor1, 3>` | fights as character 3 (0 to 7) of `img/characters/Actor1.png` |
| `<rearguard: $Guard>` | a single-character (`$`) sheet |
| `<rally weapon: axe>` | its weapon: dagger, sword, flail, axe, whip, staff, bow, crossbow, gun, claw, glove, spear, or none (bare hands) |
| `<rally material: gold>` | the weapon's metal: iron, steel, copper, gold, crystal or obsidian |

**A sheet that already holds a weapon in its art** (a guard with a pike, a mage with a staff) keeps it: the drawn
weapon is added beside it. For such a character, `<rally weapon: none>` makes it fight with its hands, so only its
own weapon shows.

The enemy keeps everything else from the database: its stats, actions, rewards and Battler Hue (the hue tints the
character). Over the Shoulder's own enemy tags still work on a foe: `<ots-scale: 1.2>` makes it larger,
`<ots-lift: 40>` stands it off the ground, `<ots-no-shadow>` drops its shadow.

## The motions

| Motion | When | What the foe does |
| --- | --- | --- |
| walk | the start of the battle, and its turn | walks toward the party from further up the floor (never from beyond the floor's far edge); walks forward on its turn |
| wait | standing | breathes: the shoulders drop one row and rise |
| swing, thrust, missile | it attacks | the weapon's motion from MZ's [SV] Attack Motions table (Database > System 2): a sword or an axe swings, a spear thrusts, a bow or a gun shoots |
| skill | a physical skill | a big blow raised high on one side |
| spell | a magic skill | the hands thrust out, then thrown wide |
| chant | waiting to cast | hands together, rising and falling |
| item | an item | a flask raised |
| guard | guarding | the weapon held across in front |
| damage | hit | a flinch with the eyes shut |
| evade | it evades | a hop to one side |
| dying | HP under a quarter | down on one knee, breathing |
| dead | it falls | lying on the ground, as MZ's collapse fades it |
| abnormal | a status with that motion | the shoulders and head sag |
| sleep | asleep | lying, with one, two, then three Z marks |
| escape | it escapes | turns its back (the sheet's up row) and runs into the distance as it fades, staying on the floor |
| victory | the party falls | the weapon raised high |

The thirteen battle poses come from **RallyCore** 1.2.0, the same file Rally and Rearguard Motions ship, so a
character fights the same way side-on (Rally Foes), from behind (Rearguard Motions) and facing the party (here).
Walk, wait, abnormal, sleep and escape are drawn by RearguardCore from the same pixels. The attacks, casts and
cheers start from the sheet's front-facing row; dead and sleep lie the figure down (PostureCore's lying pose); escape
uses the row that faces away. Facing the camera, RearguardCore also grows each redrawn arm one pixel on each side,
in the sheet's own colours and only into empty space, so the arm reads as an arm at battle scale. Nothing is
mirrored, resampled or blended.

MZ's own enemy effects all stay: the white flash when it starts its turn, the blink when hit, the selection
flash, the collapse and the boss collapse.

## Size and place

A foe stands where Over the Shoulder puts that troop member, in the same left-to-right arrangement you gave the
troop, with its feet on that spot. It is drawn the size of a party member (Over the Shoulder's Figure height),
times the troop position's depth (a member further back is smaller) and `<ots-scale>`, never taller than Over the
Shoulder's Tallest enemy. When it steps toward the party it grows a little, by Over the Shoulder's own depth rule.

## Install

1. Install **Over the Shoulder** (OverTheShoulder.js and OverTheShoulderCore.js) if it is not installed.
2. Copy the five files from `js/plugins` into your project's `js/plugins` folder: PostureCore.js, KnackCore.js,
   RallyCore.js, RearguardCore.js and RearguardFoes.js.
3. Turn all five on in the Plugin Manager. **Any order works**, before or after Over the Shoulder: Rearguard Foes
   joins in when the game boots, after every plugin has loaded. This order reads best: Over the Shoulder's two
   files, then PostureCore, KnackCore, RallyCore, RearguardCore, RearguardFoes.
4. Tag an enemy and start a battle with it. Each foe's sheet is built once as the battle starts, before its first
   frame.

**RearguardCore.js must be 1.1.0** (the file in this package). If you own Rearguard Motions, replace its
RearguardCore.js (1.0.0) with this one: 1.1.0 draws everything 1.0.0 drew, unchanged, and adds the front sheet. If
you already use Rally, Knack or Posture, keep one copy of PostureCore.js, KnackCore.js and RallyCore.js: they are
the same files. If Over the Shoulder is not installed, Rearguard Foes says so once in the console and does nothing.

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Weapon drawn | sword | what a foe fights with when it has no `<rally weapon>` tag |
| Weapon metal | iron | the weapon's metal when it has no `<rally material>` tag |
| Step forward on its turn | ON | the foe steps 24 px toward the party while it acts, and back after |
| Walk in at the start | ON | at the start of a battle every visible foe walks to its place from up to 72 px further up the floor, less for a foe already near the floor's far edge |
| Cheer when the party falls | ON | every foe still standing plays its victory motion |

## Plugin command

| Command | What it does |
| --- | --- |
| Turn on or off | OFF: tagged enemies show their own enemy pictures again (Over the Shoulder fits them as usual). Kept in the save |

## What it does not do

- It draws nothing for the party: that is Rearguard Motions, part 1 (the two work together on one RearguardCore).
- It does not change who fights: that is Rearguard Duels, part 3.
- It does nothing outside a battle Over the Shoulder stages. With Over the Shoulder off, or in a battle it stands
  down from, every enemy shows its own picture.
- An enemy whose sheet RallyCore refuses (a frame with nothing in it, a figure too small to pose) keeps its own
  picture; the console says which and why, once.
- A tag naming a file that is not in `img/characters` stops the battle with MZ's own "Failed to load" message, as a
  missing enemy picture does. Check the spelling, including a leading `$`.
- It reads only its own tag. Rally Foes' `<rally: Name, index>` tag is Rally Foes' (side-view battles).
- It is not tested with VisuStella Battle Core. Over the Shoulder stands down while that plugin is on, and then
  Rearguard Foes does nothing.

## Performance

A foe's sheet is built once per look (sheet, character, weapon form, metal) when the battle starts and kept for
later battles; nothing is built or allocated per frame. Measured in the real engine with Over the Shoulder and a
troop of three foes in a running battle: within the budget of 60 draw calls a frame, with no texture uploads while
the fight plays. The numbers are in the test report.

## Compatibility

Tested against RPG Maker MZ with the stock scripts unmodified and Over the Shoulder 1.0.0, in the real engine, with
the Plugin Manager listing Over the Shoulder first, listing it last, and with Rearguard Motions installed too.

Rearguard Foes extends sixteen engine methods and calls the original of each, none replaced: `Sprite_Enemy`
updateBitmap, updateFrame, update, updateStateSprite and startBossCollapse; `Game_Enemy` performAction,
performDamage, performEvasion, performMagicEvasion, performCounter and refresh; `BattleManager.processDefeat`;
`Scene_Battle` create, start and terminate; and `Scene_Boot.prototype.start` (where it joins, once every plugin has
loaded). For a foe only, the enemy picture is swapped for the motion's cell and the boss collapse runs over the
cell's height.

**With Rally Foes:** Rally Foes draws a character side-on in MZ's side-view battle from `<rally: ...>`; Rearguard
Foes draws one facing the party in Over the Shoulder's battle from `<rearguard: ...>`. They share RallyCore.js,
PostureCore.js and KnackCore.js: one copy of each.

## Saves

The on/off switch lives in `$gameSystem._rearguardFoes` (`{v: 1, on}`), plain data with a version number. Nothing
drawn is saved. A save made with the plugin on loads the same with it removed: MZ ignores the extra field.

## Licence

See `LICENSE.txt`. Use it in any game, commercial or not. Do not resell or redistribute the plugins themselves.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
