# Warhost - Army Battles for RPG Maker MV & MZ: Drawn Soldiers, Generated Banners, Formations — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Warhost - Army Battles for RPG Maker MV & MZ: Drawn Soldiers, Generated Banners, Formations  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/warhost  
**Docs published:** 2026-11-05


---

# Warhost for RPG Maker MZ and MV

**Version 1.1.** New: RPG Maker MV 1.6, a one-line army form for MV's Plugin Command, and a script call.

**Army battles for your game.** Two hosts of regiments meet on a painted field. Every soldier is drawn (foot, pikes,
archers, horse and mages, in each army's colours), every regiment carries a banner whose arms are generated from its
name, and the field itself is painted from a seed. The player chooses a formation; then the battle plays out soldier by
soldier: volleys arc overhead, spells burst, cavalry charges, regiments break and run. A war record closes it, with the
course of the battle charted, and the survivors go back into your variables.

Nothing is loaded: no image files, no battlebacks, no sprite sheets. It works in a new project the moment it is on.

## Installing

Copy the three files into `js/plugins` and turn them on in the Plugin Manager. The order does not matter (tested with
`Warhost.js` loading first):

1. `WarhostCore.js`: the rules of the battle
2. `WarhostDraw.js`: the soldiers, banners, fields and plates
3. `Warhost.js`: the parameters, the plugin command and the battle scene

Then call the plugin command **Start Army Battle** from any event.

**In RPG Maker MV 1.6:** also copy `CSAF_MVBridge.js` and put it **at the top of the list**, above the three
Warhost files. It supplies the few parts of MZ's scripting these files use and MV lacks, changes no window of yours
or of any other plugin, and does nothing at all in MZ (you can leave it out there).

## The plugin command: Start Army Battle

| Argument | Default | Meaning |
| --- | --- | --- |
| Title | blank | Shown on the call to arms and the war record. Blank = "The Battle of" and the map's display name. |
| Field | (default) | meadow, steppe, snow, desert or moor. (default) uses the parameter. |
| Your regiments | four regiments | The player's army, a list of regiments (below). |
| Enemy army's name | The Enemy | Shown in the HUD and the war record. |
| Enemy regiments | four regiments | The enemy's army. |
| Your formation | choose | "choose" lets the player pick from four cards; or fix it to line, wedge, square or loose. |
| Enemy formation | auto | "auto" reads the enemy's own make-up (many bows: loose; many riders: wedge; many pikes: square) with a seeded coin; or fix it. |
| Victory -> switch | 0 | ON after a victory, OFF after a defeat or a draw. |
| Outcome -> variable | 0 | 1 = victory, 2 = defeat, 3 = neither army held the field. |
| Your fallen -> variable | 0 | How many of the player's soldiers fell. |
| Common event afterwards | 0 | Reserved when the war record closes. |
| Seed | blank | Blank = a different battle every time. A number replays the same battle exactly. |

The event waits while the battle is on screen. Everything is written before the event continues, so the next command
can read the result.

### A regiment

| Field | Meaning |
| --- | --- |
| Name | Also decides the banner: the same name always flies the same arms. |
| Role | foot, pike, archer, horse or mage. |
| Soldiers | 1 to 99,999. |
| Soldiers from/to variable | If set, the count is **read** from this variable when the battle starts and the **survivors are written back** when it ends (those who fled come home). Recruit with ordinary Control Variables; lose men in battle. A regiment whose variable reads 0 stays home. |
| Strength | 1 = ordinary troops. 1.5 = veterans. 0.5 = levies. (0.25 to 4) |

Up to 240 figures a side are drawn. A bigger army is carried at several soldiers per figure, and every number you read
back is still in soldiers: a 5,000-man horde is accounted for to the man.

## In RPG Maker MV: the command as one line

MV has no command dropdown, so the battle is a Plugin Command line. Every argument above is `name=value`, in the
table's order: `title`, `terrain`, `playerArmy`, `enemyName`, `enemyArmy`, `playerFormation`, `enemyFormation`,
`victorySwitchId`, `outcomeVariableId`, `fallenVariableId`, `commonEventId`, `seed`. An army is
written `role:count:Name:strength:variable`, regiments separated by commas (underscores in a name are spaces;
everything after the count is optional):

```
Warhost battle
Warhost battle enemyName="The Red Host" seed=7 victorySwitchId=3 playerArmy=foot:40:Shieldmen,archer:30:Bowmen enemyArmy=foot:50:Raiders,horse:20:Riders
Warhost battle playerArmy=foot:99:Iron_Company:1:11 outcomeVariableId=13 fallenVariableId=14
```

An army you leave out is the command's own default army (four regiments a side), so `Warhost battle` alone is a
whole battle. A regiment that is not `role:count` is reported in the console and left out. The same short form
also works in MZ, and so does the script call below.

## Plugin parameters (Warhost.js)

| Parameter | Default | Meaning |
| --- | --- | --- |
| Your army's name | Your Host | Shown in the HUD and the war record. |
| Your army's colour | blank | A #hex colour for your soldiers' tunics. Blank = royal blue. |
| Enemy colour | blank | A #hex colour for the enemy's tunics. Blank = crimson. |
| Default field | meadow | Used when a battle's Field is (default). |
| Time limit (seconds) | 60 | When time runs out the stronger army holds the field (15% ahead), or neither does. |
| Show the enemy's formation | ON | ON: the player sees how the enemy has formed before choosing. OFF: it stays hidden until the clash. |
| Sounds | Horn, Blow3, Bow1, Fire1, Horse | Horn at the start, clash of arms, volley, spell burst, cavalry charge (RTP sound effects). Blank = silent. |
| Music | Victory1, Defeat1, Battle2 | Victory and defeat music, and the battle music (the map's music comes back afterwards). Blank = none / keep the current music. |

## Who beats whom

- **Pikes stop horse.** Horse runs down archers and mages. Foot cut down archers and mages who let them close.
- **Archers and mages kill from range**: arrows fly in arcs and land where they were aimed; spells burst over an area.
- **Morale:** a regiment that has lost most of its men while its army is losing may break and run for its own edge of
  the field. Those who flee survive, and count as survivors in your variables.

## The four formations

| Formation | Beats | How |
| --- | --- | --- |
| Line | Loose | Steady ranks. |
| Wedge | Line | Drives in hard. |
| Square | Wedge | Shields locked; horse strike it at 60% of their force. |
| Loose | Square | Spread out: arrows and spells find little. |

The counter is worth a lot. Measured with `Internal_Ops/_scripts/balance_probe.js` over 40 seeded battles per cell, with
the player's army at four fifths of the enemy's size and the enemy's formation shown before the choice:

| Army | Enemy forms | Player picks the counter | Player copies the enemy |
| --- | --- | --- | --- |
| infantry | line | wedge wins 100% | 0% |
| infantry | wedge | square wins 58% | 0% |
| infantry | square | loose wins 23% | 0% |
| infantry | loose | line wins 100% | 0% |
| mixed | line | wedge wins 40% | 0% |
| mixed | wedge | square wins 5% | 0% |
| mixed | square | loose wins 40% | 0% |
| mixed | loose | line wins 33% | 0% |

Numbers still matter most: with equal formations, an army a quarter larger won every one of 40 battles. The counter is
how a smaller army gets a chance. A loose screen needs bows or mages on the field to beat a square: with no missiles to
dodge, its spread ranks are cut down.

Identical armies in identical formations split fairly: over 300 seeded battles each way, the army on the left won 154
and the army on the right 146, and with the sides swapped 147 and 153.

## Controls

- Left / Right, or the mouse: choose a formation. OK or a click on the chosen card: sound the charge.
- Hold OK, Shift or the mouse button during the clash: the battle runs three times faster.
- OK or a click on the war record: back to the map.

## Script calls

- `Warhost.lastResult()`: the last battle: `{title, winner, seconds, forms, sides, regiments}` (winner 0 = the player's
  army, 1 = the enemy, -1 = neither). Saved with the game.
- `Warhost.isOpen()`: true while a battle is on screen.
- `Warhost.battle({...})` (new in 1.1): start a battle from a Script command, with any of the command's arguments;
  an army may be a plain list, e.g. `Warhost.battle({ seed: 7, playerArmy: [{ name: 'Iron Company', role: 'foot',
  count: 60 }], enemyArmy: 'foot:50:Raiders,horse:20:Riders' })`.

## What it touches

- Your project files: never. It adds one scene (`Scene_Warhost`) and one plugin command, and patches no engine method.
- Your save files: one small record (`$gameSystem._csafWarhost`, versioned), created the first time a battle is fought.
  A save made before the plugin was installed loads as before.
- Frame cost: with 480 soldiers on the field, the whole army is drawn in about four draw calls a frame, and the battle
  reads no pixels while it runs (both measured in MZ's own runtime).

## Compatibility

Warhost replaces nothing: it adds its own scene and draws everything in it itself, so plugins that restyle MZ's windows,
battles or menus do not reach it and it does not reach them. It opens from any event and returns to the same map, like
the shop or the menu. Tested in RPG Maker MZ's own runtime (the `rmmz_*.js` scripts) and in RPG Maker MV 1.6.1 with the bridge file, in
new projects, from the shipped download. It has not been
tested with every third-party plugin; if one clashes, tell us on the store page.

## Written with AI assistance

The code, the store images and the cover were produced with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
