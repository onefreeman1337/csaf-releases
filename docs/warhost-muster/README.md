# Warhost Muster: a drawn war camp and order of battle for your armies, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Warhost Muster: a drawn war camp and order of battle for your armies, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-27


---

# Warhost Muster for RPG Maker MZ

**Version 1.0.** The second of three parts of the Warhost Campaign volume. It works on its own: you do not need Warhost (the
open-field battle) to use the camp. You need Warhost 1.1 or Warhost Siege only to march the army out to a battle.

**A war camp for your army.** Each regiment has its own tent, dyed toward its banner; the banner flies beside the tent while
the regiment stays in camp and is carried at its front on the parade ground. The recruits wait at a table. The player sends recruits to the regiments and every new man walks from the table to his banner;
sends men back and they walk back. The player chooses which regiments **march** and which **stay in camp**, and sets the
**order of battle**. A drawn map of the field shows where each regiment will stand when the battle opens. When the camp
breaks, every regiment's soldiers go into its own variable: the same variable Warhost and Warhost Siege read when a battle
starts and write the survivors back to.

No soldier is made or lost in camp: men only move between the recruits and the regiments. There is no money, no upkeep
and no turn counter. Nothing is loaded: no image files. It needs nothing else in your project: turn it on and call the
command.

## Installing

Copy the four files into `js/plugins` and turn them on in the Plugin Manager. The order does not matter (tested with
`WarhostMuster.js` loading before `WarhostMusterCore.js`):

1. `WarhostCore.js`: the soldiers' rules and their banners' arms (the same file as in Warhost 1.1)
2. `WarhostDraw.js`: the soldiers, banners and fields (the same file as in Warhost 1.1)
3. `WarhostMusterCore.js`: the rules of the camp
4. `WarhostMuster.js`: the parameters, the two plugin commands, the scene and the camp painter

**If you own Warhost or Warhost Siege:** `WarhostCore.js` and `WarhostDraw.js` are byte for byte the files they ship.
Install them once; every Warhost plugin uses them.

## The plugin command: Open War Camp

| Argument | Default | Meaning |
| --- | --- | --- |
| Title | blank | Shown on the call to muster. Blank = "The Muster at" and the map's display name. |
| Field | (default) | meadow, steppe, snow, desert or moor. (default) uses the parameter. |
| Your regiments | six regiments | Up to eight regiments (below). More are left out, with a note in the console. |
| Recruits | 120 | How many recruits wait at the table when no variable is set. Read once; afterwards the camp remembers. |
| Recruits from/to variable | 0 | If set, the recruits are **read** from this variable and the men left at the table are **written back** to it. |
| Men marching -> variable | 0 | How many soldiers march: every marching regiment added up. |
| Common event afterwards | 0 | Runs (as a reserved common event) when the camp breaks. |
| Seed | blank | The camp's look. Blank = the same camp for the same title. |

The event waits while the camp is on screen. Everything is written before the event continues.

### A regiment

The same fields as a Warhost regiment, so you can copy a regiment from one command to the other.

| Field | Meaning |
| --- | --- |
| Name | Also decides the banner and the tent's colour: the same name always flies the same arms. |
| Role | foot, pike, archer, horse or mage. |
| Soldiers | Used when no variable is set. Read once; afterwards the camp remembers. A regiment may stand empty, waiting for recruits. |
| Soldiers from/to variable | If set, the count is **read** from this variable when the camp opens and **written back** when it breaks. Give every regiment a variable and Warhost and Warhost Siege read the same men. |
| Strength | 1 = ordinary troops. 1.5 = veterans. 0.5 = levies. (0.25 to 4) Shown in camp; used in battle. |

**Recruiting through events:** add to the recruits variable with an ordinary Control Variables command (a town hall, a
quest reward, a banner raised in a village), then open the camp. The player decides where the men go.

## The plugin command: March Out to Battle

Opens a battle with the army mustered in camp, in its order of battle: the regiments that march, with the soldiers each
has now (a regiment with a variable is read from it at that moment, so men lost in an earlier battle are not counted
twice).

| Argument | Default | Meaning |
| --- | --- | --- |
| Battle | field battle | **field battle** opens a Warhost battle (Warhost 1.1). **siege** opens a Warhost Siege. |
| In a siege, your army | attack | attack or defend. |
| Title, Field, Enemy army's name, Enemy regiments, Seed | blank | Passed to the battle. Blank = the battle's own default. |
| Victory -> switch, Outcome -> variable, Your fallen -> variable, Common event afterwards | 0 | Passed to the battle. |

The event waits while the battle is on screen, and the battle writes its results as it always does: survivors back to each
regiment's variable. If no regiment marches, or the battle plugin is not installed, nothing opens and the console says why.

## How the camp works

- **Men.** Right sends a recruit to the chosen regiment, Left sends a man back to the table. Held, the step grows: one
  man, then five, then twenty-five. A regiment holds up to 99,999 men.
- **March or stay.** OK switches the chosen regiment between marching (it stands on the parade ground, in the order of
  battle) and staying in camp (it stands before its tent). A regiment with no men does not march.
- **The order of battle.** Q (Page Up) moves the chosen regiment earlier, W (Page Down) later. The parade ground shows the
  order left to right.
- **Where they will stand.** The map in the panel shows each marching regiment as a block in its banner's colour, numbered as
  in the order of battle (the same number is on its plate on the parade ground). It is read from WarhostCore's own deployment: foot and pikes in the front
  rank, archers behind them, mages at the rear, horse on the wings. Regiments in one rank stand in the order of battle from
  the top of the field down, and the horse take the upper wing, then the lower, in turn. It is drawn in a line; the
  formation chosen on the field reshapes each block, not where it stands.
- **Breaking camp.** Escape (or the BREAK CAMP button) writes everything and returns to the map. The camp remembers the
  order of battle and who marches for the next visit.

## Plugin parameters (WarhostMuster.js)

| Parameter | Default | Meaning |
| --- | --- | --- |
| Your army's name | Your Host | Shown on the call to muster. |
| Your army's colour | blank | A #hex colour for your soldiers' tunics. Blank = royal blue. Set the same colour as in Warhost. |
| Default field | meadow | Used when the camp's Field is (default). |
| Sounds | Cursor1, Equip2, Decision2, Book1, Horn | Choosing a regiment, men joining or leaving, march or stay, the order changing, breaking camp (RTP sound effects). Blank = silent. |
| Music in camp | blank | Blank = the map's music keeps playing. |

## Controls

- Up / Down: choose a regiment. Left / Right: men out / in (hold for more).
- OK: march or stay. Q / W (Page Up / Page Down): earlier / later in the order of battle.
- Escape: break camp.
- Mouse or touch: click a regiment's block or tent to choose it, click it again to march or stay; the panel's buttons do
  the rest (hold the + and - buttons for more).

## Script calls

- `WarhostMuster.muster({...})`: open the camp from a Script command, with any of the command's arguments. Regiments may be
  a compact line, e.g. `WarhostMuster.muster({ recruitsVariableId: 5, regiments: 'foot:0:Iron_Company:1:11,archer:0:Frost_Bows:1:12' })`
  (role:count:Name:strength:variable, regiments separated by commas, underscores in a name are spaces).
- `WarhostMuster.army()`: the mustered army in the order of battle, in the shape Warhost reads:
  `Warhost.battle({ playerArmy: WarhostMuster.army(), seed: 7 })` or `WarhostSiege.siege({ playerArmy: WarhostMuster.army() })`.
- `WarhostMuster.marchOut({...})`: the March Out to Battle command.
- `WarhostMuster.lastCamp()`: the last camp: `{title, army, totals}`. Saved with the game.
- `WarhostMuster.isOpen()`: true while the camp is on screen.

## What it touches

- Your project files: never. It adds one scene (`Scene_WarhostMuster`) and two plugin commands, and patches no engine method.
- Your save files: one small record (`$gameSystem._csafWarhostMuster`, versioned): the order of battle, who marches, and
  the soldiers of regiments that have no variable. A save made before the plugin was installed loads as before.
- Frame cost: with eight regiments and the recruits on screen at one man a figure (240 figures) while men walk and the
  order of battle keeps changing, the camp is drawn in 9 draw calls a frame, and it reads no pixels while it runs (both
  measured in MZ's own runtime).

## Compatibility

Warhost Muster replaces nothing: it adds its own scene and draws everything in it itself, so plugins that restyle MZ's
windows, battles or menus do not reach it and it does not reach them. It opens from any event and returns to the same map,
like the shop or the menu. Tested in RPG Maker MZ's own runtime (the `rmmz_*.js` scripts), in a new project, from the
shipped download, and with Warhost 1.1 and Warhost Siege 1.0 for March Out. It has not been tested with every third-party
plugin; if one clashes, tell us on the store page. It is written for RPG Maker MZ; RPG Maker MV is not supported in this
version. Variables and switches you name must exist in your project's database (MZ ignores an id past the list).

## Part of the Warhost Campaign

Warhost (the open-field battle), Warhost Siege and Warhost Muster share their soldiers, banners and variables: muster a
regiment in camp, march it to the field or the wall, and its survivors come home to the same variable. A campaign map is
planned as the volume's third part.

## Written with AI assistance

The code, the store images and the cover were produced with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
