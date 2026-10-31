# Over the Shoulder — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Over the Shoulder  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-10-31


---

# Over the Shoulder

Back-view battles for RPG Maker MZ, struck from your own walk sprites.

MZ can show your party from the side, or not at all. This plugin shows them from behind. Every walk sheet already holds a back view: its up-facing row. Over the Shoulder turns that row into a battler and stages MZ's own battle behind the party, with the enemy ahead of them, on a floor it lays to the horizon, with a drawn plate per actor.

Skills, states, damage formulas, troops and your enemy database are not touched. It changes the camera and what the battle is dressed in. It works in a side-view or a front-view project.

Every line of this plugin was written with AI assistance. No image files ship: every floor, plate, window and figure is drawn at run time, from code and from your own art.

## Install

1. Copy `js/plugins/OverTheShoulder.js` and `js/plugins/OverTheShoulderCore.js` into your project's `js/plugins` folder.
2. Turn both on in the Plugin Manager. Any order works.
3. Start a battle. No note tags or commands are needed: each actor's own map sheet is the back view.

Tested on RPG Maker MZ, core script version 1.10.0, with the stock scripts only. **Not tested with VisuStella Battle Core**, which rewrites the same battle sprites. While that plugin is on, Over the Shoulder stands down and says so in the console; the With VisuStella Battle Core parameter lets you run it anyway, at your own risk.

## What a battle does

- **The party stands with their backs to the player**, using the up-facing row of each map sheet. The sheet stays as it is on the map; the plugin works from its own copy.
- **They walk in from below the screen** when the battle opens, step up on their turn, lunge toward the horizon on an attack, recoil on a hit, and collapse when they fall, all as code-driven moves of those frames, so it works on any sheet.
- **At victory they turn round** to face the player, using the side and front rows of their own sheets.
- **When they escape they turn** and run toward the camera.
- **The enemies stand ahead of them** in the same left-to-right arrangement you gave the troop, fitted into a band on the floor, nearer ones larger.
- **Battle commands run as one bar across the top of the screen**, clear of the party and the enemies. Commands Across the Top turns that off.

## The stagings

| Staging | What it looks like |
| --- | --- |
| line | The party in a shallow arc along the bottom, each actor above their own plate |
| rank | A diagonal into the distance, the first actor largest and nearest |
| duel | One figure low left and one enemy high right on raised discs, with the other actors standing off behind; whoever acts or is struck takes the front disc |

The duel staging does not add a swap-in mechanic. Your whole party still fights, and the staging moves whoever is acting to the front.

## The floors

Floor reads the battleback's file name and picks one, so `Snowfield` gets snow and `Ship` gets a deck. When no word in the name fits, a battleback in two layers has its own ground picture laid flat to the horizon, and a single painted picture stands as it is, since it already holds its own ground. Each drawn floor leans toward the colours of your own battleback by Floor tint %. Each one is a different pattern, not a recolour of another.

| Family | Floors |
| --- | --- |
| stone | flagstone, cobble, brick, herringbone, basket, checker, diamond, hexstone, octagon, mosaic, rosette, crazy, ruin, dungeon, marble, terrazzo |
| wood | planks, deck, parquet, tatami, bridge |
| cloth | carpet, kilim |
| nature | grass, meadow, clover, moss, forest, dirt, sand, dune, snow, ice, swamp, water |
| mineral | lava, ash, crystal, cave, bone |
| metal | grate, plate, circuit, hazard, rune, gold |
| other | void, cloud, flesh, stained |

That is **50 floors**. Besides a floor's name, Floor takes `auto`, `battleback` (always lay your own) or `off` (draw no floor: your battleback stands as it is).

When the battleback has a wall picture (Battleback 2), the plugin reads where that wall stands on the ground and fits it to the horizon, so the two meet. When a floor is laid over a single painted picture, it looks for the sharpest change in brightness across the picture, takes that as the picture's horizon and moves the picture so the floor meets it. That is a reading, not a certainty: if it picks the wrong line, set Floor to `off`.

## The themes

| Theme | Look |
| --- | --- |
| iron | Dark steel, studded corners, a plain bold type |
| brass | Dark oak and brass, notched corners, a serif |
| lacquer | Black and vermilion, gilt bars, a serif |
| frost | Blue glass, cut corners, a clean sans |
| verdant | Bottle green and gold, leaf corners, a serif |
| royal | Navy and gold, double corners, a serif |
| neon | Black and cyan, cut corners, a monospace |
| umber | Dark leather and bone, studded corners, a plain bold type |

A theme dresses the status plates and, unless you turn Theme the battle's windows off, every window in the battle including messages. It uses type already on the player's machine and ships no font; a machine without the first face in a theme's list gets the next one down.

A plate shows the actor's face in a medallion, name, HP, MP and TP (when your project shows TP), state icons, and the time gauge in a time-progress battle. An actor with no face picture gets the head from the front row of their walk sheet. Narrow plates (more than four actors) drop the medallion.

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Staging | line | line, rank or duel |
| Figure height (px) | 150 | How tall a figure's drawing should stand. Stock 48 px sheets come out at three times their size |
| Keep hard pixels | ON | ON: figures scale by whole steps with hard pixel edges. OFF: any scale, smoothed |
| Floor | auto | auto, battleback, off, or a floor's name |
| Floor tint % | 35 | How far a drawn floor leans toward your battleback's colours. 0 keeps its own |
| Horizon % | 40 | How far down the screen the floor begins |
| Plate and window theme | iron | One of the eight themes |
| Draw status plates | ON | OFF keeps your own status window |
| Faces on the plates | ON | The medallion |
| Theme the battle's windows | ON | OFF keeps your own windows |
| Commands across the top | ON | One bar across the top of the screen. OFF leaves them where MZ puts them |
| Enemy art | auto | auto: in a side-view project, use the img/enemies picture when one exists, else img/sv_enemies. Or fix the folder |
| Enemy plates | duel | A name and HP plate per enemy, top left: duel only, all, or off |
| Tallest enemy (px) | 280 | A larger enemy picture is scaled down to this height |
| Camera moves | ON | The view drifts toward whoever acts and pushes in on an action |
| Turn round at victory | ON | The party turns to face the player |
| With VisuStella Battle Core | stand down | stand down or try |

## Plugin commands

Each one takes effect from the next battle, and is kept in the save.

| Command | What it does |
| --- | --- |
| Set staging | Changes the staging. `(clear)` goes back to the map note or the parameter |
| Set floor | Changes the floor: a name, auto, battleback or off. Blank clears it |
| Set theme | Changes the theme. `(clear)` goes back to the map note or the parameter |
| Turn on or off | OFF gives you MZ's own battle (a cutscene fight, a boss you stage yourself) |

Which wins: a plugin command, then the map's note, then the parameter.

## Notes

| Where | Note | What it does |
| --- | --- | --- |
| Actor | `<ots-back: Name>` | Use `img/pictures/Name.png` as this actor's back art, for hand-drawn backs |
| Actor | `<ots-back-frames: 3>` | How many frames across that picture holds (default 1) |
| Actor | `<ots-scale: 2.5>` | This figure's scale, instead of Figure height |
| Actor | `<ots-row: 3>` | The row of the sheet that faces away (default 3) |
| Actor | `<ots-sheet: 3 8>` | Columns and rows on a sheet that is not 3 x 4, such as an 8-direction sheet |
| Actor | `<ots-stand: 1>` | The column that stands still. By default it is measured from the drawing: the column with the narrowest legs |
| Actor | `<ots-side>` | Keep this actor's side-view battler from `img/sv_actors` |
| Enemy | `<ots-scale: 1.4>` | Multiply this enemy's size |
| Enemy | `<ots-lift: 40>` | Stand this enemy off the ground by that many pixels, for a flyer |
| Enemy | `<ots-no-shadow>` | No shadow under it |
| Map | `<ots-staging: duel>` | The staging for battles on this map |
| Map | `<ots-floor: snow>` | The floor for battles on this map |
| Map | `<ots-theme: frost>` | The theme for battles on this map |

## What it does not do

- It draws no back art: it uses what your sheets already hold. If a sheet's up-facing row is rough, the figure is rough at three times the size. `<ots-back>` takes hand-drawn art for any actor who needs it.
- It draws no weapons. MZ's side-view weapon sprites face sideways, so they are hidden. Attack animations play on the target as usual.
- There is no catching, breeding or type chart. The duel staging is a layout. Your MZ battle system stays what it was.
- Battle windows wear the theme only inside battle. Your title, menu and map windows stay yours.
- A character with no map sheet and no `<ots-back>` keeps its side-view battler, shown larger, so nobody vanishes.

## Performance

A floor is laid once, before the first frame of play, and is then one still picture, so lava and water do not move. A figure's art is copied once when the battle opens. Measured in the real engine with four figures and full-size enemies in a running fight, in both the line and the duel stagings: under the budget of 60 draw calls a frame, with no pixel read from any bitmap while the fight plays.

## Compatibility

<!--COMPAT-->
**Tested against RPG Maker MZ with the stock scripts unmodified**, verified by running the plugin in the real engine rather than only in tests.

**Plugin Manager order:**

- `OverTheShoulderCore.js`

- `OverTheShoulder.js`

This order reads sensibly in the list and **nothing depends on it**. `OverTheShoulder.js` finds `OverTheShoulderCore.js` the first time a battle opens, so any order works, including `OverTheShoulder.js` first (the order the in-engine and fresh-install tests load them in).

**Core methods extended — 30 by saved-original prototype extension, *none replaced*:** `Game_Actor.prototype.isSpriteVisible`, `Spriteset_Battle.prototype.createLowerLayer`, `Spriteset_Battle.prototype.createBattleField`, `Spriteset_Battle.prototype.createActors`, `Spriteset_Battle.prototype.updateActors`, `Sprite_Battleback.prototype.adjustPosition`, `Sprite_Actor.prototype.moveToStartPosition`, `Sprite_Actor.prototype.setActorHome`, `Sprite_Actor.prototype.updateBitmap`, `Sprite_Actor.prototype.updateFrame`, `Sprite_Actor.prototype.stepForward`, `Sprite_Actor.prototype.retreat`, `Sprite_Actor.prototype.setupWeaponAnimation`, `Sprite_Actor.prototype.damageOffsetX`, `Sprite_Actor.prototype.damageOffsetY`, `Sprite_Enemy.prototype.setBattler`, `Sprite_Enemy.prototype.loadBitmap`, `Sprite_Enemy.prototype.updateBitmap`, `Sprite_Enemy.prototype.updateStateSprite`, `Sprite_Enemy.prototype.updatePosition`, `Window_BattleStatus.prototype.maxCols`, `Window_BattleStatus.prototype.drawItem`, `Scene_Battle.prototype.create`, `Scene_Battle.prototype.start`, `Scene_Battle.prototype.terminate`, `Scene_Battle.prototype.statusWindowRect`, `Scene_Battle.prototype.statusWindowX`, `Scene_Battle.prototype.partyCommandWindowRect`, `Scene_Battle.prototype.actorCommandWindowRect`, `Scene_Battle.prototype.createAllWindows`.

Nothing is clobbered, but while a battle is staged the plugin draws the actors itself, so a plugin that changes MZ's side-view actors will not show. It is tested with the stock scripts only.

**It also defines 4 methods that their core class only inherited:** `Spriteset_Battle.prototype.animationShouldMirror` (inherited from `Spriteset_Base`), `Window_BattleStatus.prototype.itemRect` (inherited from `Window_Selectable`), `Window_BattleStatus.prototype.drawItemBackground` (inherited from `Window_Selectable`), `Scene_Battle.prototype.isReady` (inherited from `Scene_Base`). That touches those classes only, never the parent. If another plugin redefines the same method on the same class, load Over the Shoulder after it.
<!--/COMPAT-->

## Saves

Settings from plugin commands live in `$gameSystem._otsState`, plain data with a version number. A save made with the plugin on still loads with it removed: MZ ignores the extra field.

## Licence

See `LICENSE.txt`. Use it in any game, commercial or not. Do not resell or redistribute the plugin itself.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
