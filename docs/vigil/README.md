# Vigil - Souls-like Rest Shrines for RPG Maker MZ: Bonfires, Respawning Enemies, Echoes Where You Fell — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Vigil - Souls-like Rest Shrines for RPG Maker MZ: Bonfires, Respawning Enemies, Echoes Where You Fell  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/vigil  
**Docs published:** 2026-11-05


---

# Vigil — Souls-like rest shrines for RPG Maker MZ

Rest at shrines to heal and bring the fallen enemies back. Spend what you carry at the altar. When the party falls, it wakes at the last shrine, and everything it carried waits where it fell, inside an echo of the party leader that replays the fall. Walk back and take it. Fall again first and it is gone.

Three files, no image files, no common events to author.

## Install

Copy all three into `js/plugins/` and turn them on in the Plugin Manager. Any order works.

| file | what it is |
| --- | --- |
| `VigilShrine.js` | draws every shrine (no parameters) |
| `VigilEcho.js` | remembers the leader's steps and draws the echo (no parameters) |
| `Vigil.js` | the loop: parameters, notetags and plugin commands |

## Shrines

Put `<vigil: shrine>` in an event's Note box and give the event no image. Vigil draws a shrine on that tile. The party rests when it activates the event.

Each shrine is put together from four choices and drawn in code:

| choice | values |
| --- | --- |
| form | brazier, cairn, wardlamp, stone, idol |
| fuel (the colour of the fire) | pine, peat, bone, oil, coal |
| relic | none, blade, skull, bell, banner, ring |
| weathering | fresh, worn, cracked, overgrown |

If you don't choose, the map, the event and the region it stands on choose for you, so the same project always draws the same shrine in the same place. To choose yourself, add any of these to the Note box:

```
<vigil-form: cairn>   <vigil-fuel: bone>   <vigil-relic: blade>   <vigil-weather: worn>   <vigil-seed: 42>
```

A shrine shows banked coals until the party first rests there, then it stays lit. (Parameter **Shrines start lit** turns that off.)

## Resting

Resting:
- heals the whole party;
- makes this shrine the place the party wakes after a fall;
- brings back the defeated enemies (see below), on every map;
- writes the autosave, if your project has autosave on (parameter **Autosave on rest**);
- opens the altar (parameter **Open the altar on rest**).

## Enemies that come back

Put one of these in an encounter event's Note box:

| tag | what resting does |
| --- | --- |
| `<vigil: respawn>` | brings it back |
| `<vigil: respawn stronger>` | brings it back stronger each time: every parameter +25% per rest (parameter **Stronger step**), up to 4 times (**Stronger cap**) |
| `<vigil: never>` | leaves it defeated |

Here, "defeated" means the event turned one of its self switches ON, which is the usual way an encounter removes itself. Resting turns those self switches OFF again. Events with no tag follow the parameter **Untagged enemies**, which defaults to leaving them defeated.

## The altar

The altar spends what the party carries. Choose a party member, then one of nine offerings: a level, or more of any of the eight parameters. Every row is labelled with your own database's terms (Level, Max HP, Attack and so on, in your project's language). Each bar runs toward that actor's class value at its maximum level, so you can see how far each parameter has to grow. An offer card shows what OK would buy, from what to what, and for how much. At the foot of the scene the shrine you rested at burns, drawn exactly as it stands on your map, with the party leader beside it and what you carry heaped at its foot. The layout is worked out from your game's screen size.

Keyboard and gamepad: arrows choose, OK offers, Cancel rises. Touch and mouse: touch a name or an offering to choose it, touch the chosen offering again to offer it, touch the fire (or the line at the bottom) to rise. The altar shows no stock RPG Maker buttons.

The amount is labelled with your own word for it: with gold, your database's currency unit; with a variable, that variable's name; with embers, EMBERS. Parameter **Currency name** sets your own label.

**What the party carries** (parameter **Currency carried**):
- **Gold**
- **A variable** of your choosing
- **Embers**: battle EXP is held instead of applied, and a level at the altar costs exactly what MZ's own EXP curve asks for the next level. Parameter **Mirror embers to variable** copies the amount into a variable, so your events and HUD can show it.

Prices are formulas, so you can retune them:
- **Level cost** (used with gold or a variable): default `Math.round(25 * level * level + 75)`.
- **Attribute cost**: default `Math.round(40 + 20 * bought)`, where `bought` counts what this actor has already bought.
- **Attribute steps**: how much one purchase adds to each attribute.

A formula that can't be computed makes that offering unavailable; it never crashes the scene.

## Falling

Without Vigil, a party wipe ends the game. With Vigil, the death plate appears (playing your project's own Game Over music effect, and showing the amount that stays behind) and the party wakes at the last shrine, healed. This works for a wipe in battle and for one on the map, such as poison with "knockout by slip damage" on. What it carried (parameter **Dropped on death**, default 100%) stays behind in an **echo** on the tile where it fell. The echo is a ghost of the party leader, made from your own walking sheet: drained of colour, cooled, see-through, shedding embers. When the leader comes within three tiles (parameter **Echo wakes within**), the ghost replays the last steps the party took on that map. Walk onto it to take everything back: embers burst from the spot and the amount rises over it.

- Falling again before you collect it loses the old echo.
- If the party has not rested anywhere yet, Game Over happens as normal.
- Your own **Game Over** event command still ends the game, as you wrote it. Parameter **Catch event "Game Over"** sends that to the shrine too.

## Plugin commands

| command | what it does |
| --- | --- |
| **Rest here** | rest at the event that runs it, without the notetag |
| **Open the altar** | open the altar |
| **Give currency** | add to (or, with a negative number, take from) what the party carries |
| **Clear the echo** | remove an uncollected echo and what it holds |

## Saves

Vigil keeps its state in one plain-data slot in the save file. The slot has a schema version. Saves made before Vigil was installed load normally, and a damaged slot is rebuilt rather than thrown on.

## Compatibility notes

- Vigil extends every engine method it touches and calls the original through; it replaces none. The one exception is deliberate: in **Embers** mode, battle EXP is held as embers, so the engine's own EXP award (`BattleManager.gainExp`) is not called in that mode. With gold or a variable it is.
- Game Over is caught at the one door every path uses (`SceneManager.goto` with the Game Over scene). Your own Game Over event command passes straight through unless you turn on **Catch event "Game Over"**.

## What was tested, and how

- **In the real RPG Maker MZ engine**, on a demo project with two maps: **48 checks**, all passing. Resting through the event's own action-button path, the altar bought from with the keyboard and by touch, every parameter named here switched on and off, all four plugin commands, four real battles started by the encounter events, every respawn rule, the stronger tier reaching the troop (a Gnome's Max HP 250 becomes 313 at tier 1), a wipe in battle and a wipe on the map by poison, the wake at the shrine, the echo replaying and being reclaimed on the same map and on another map, a defeat on one map raised by a rest on another, embers mode, the save round trip, a save made before Vigil, and both Game Over cases that must stay Game Over.
- **On a fresh, unmodified MZ project** (the stock database and screen size) with one event tagged `<vigil: shrine>`: **19 checks**, all passing, including the altar's layout at 816 x 624 and its labels read from the stock database.
- **Per-frame cost, counted in the engine**: on the map with a lit shrine and a replaying echo, the scene draws in 19 calls with no texture uploads and no bitmap redraws per frame; the altar draws in 11, the death plate in 2. Nothing is created per frame.
- **86 headless checks** across three suites (`run_tests.js`, each suite in its own process, every result recounted independently), each check that guards a defect we actually had paired with a deliberate break that must make it fail.
- **48 shrines**, resolved the way a project places them, give **46 distinct compositions**. No drawing call lands outside its own animation cell.

## AI disclosure

This plugin's code was written with AI assistance. Every shrine, fire, echo and scene is drawn by that code at run time. No image model and no third-party art was used.

Copyright (c) 2026 Core Systems Asset Factory. Licence: see LICENSE.txt (commercial use permitted).


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
