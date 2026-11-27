# Warhost Siege: storm or hold a drawn fortress with armies of drawn soldiers, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Warhost Siege: storm or hold a drawn fortress with armies of drawn soldiers, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-27


---

# Warhost Siege for RPG Maker MZ

**Version 1.0.** The first of three parts of the Warhost Campaign volume. It works on its own: you do not need Warhost (the
open-field battle) to use it.

**Siege battles for your game.** A curtain wall with towers and a gate stands across the field, painted from a seed. One
host storms it with **ladders**, a **battering ram** or a **siege tower**; the other holds it by **pushing the ladders
down**, pouring **oil at the gate** or shooting **fire arrows** at the tower. Each defence beats one approach. Then the
siege plays out soldier by soldier: men climb the ladders three at a time, the ram strikes the gate until it splinters,
the tower rolls in and drops its bridge onto the wall walk, the bows on the battlements shoot down from cover. The
broken gate, the burned oil, the fallen ladders and the fallen men stay drawn. A war record closes it, and the
survivors go back into your variables. Your army can attack or defend.

Nothing is loaded: no image files, no battlebacks, no sprite sheets. It needs nothing else in your project: turn it on
and call the command.

## Installing

Copy the four files into `js/plugins` and turn them on in the Plugin Manager. The order does not matter (tested with
`WarhostSiege.js` loading before `WarhostSiegeCore.js`):

1. `WarhostCore.js`: the soldiers' rules and their banners' arms (the same file as in Warhost 1.1)
2. `WarhostDraw.js`: the soldiers, banners, fields, record and HUD (the same file as in Warhost 1.1)
3. `WarhostSiegeCore.js`: the rules of the siege
4. `WarhostSiege.js`: the parameters, the plugin command, the scene and the fortress painter

**If you own Warhost:** `WarhostCore.js` and `WarhostDraw.js` are byte for byte the files Warhost 1.1 ships. Install them
once; both plugins use them. If your copy of Warhost is 1.0, download 1.1 from its page first (buyers get updates).

Then call the plugin command **Start Siege** from any event.

## The plugin command: Start Siege

| Argument | Default | Meaning |
| --- | --- | --- |
| Title | blank | Shown on the call to arms and the war record. Blank = "The Siege of" and the map's display name. |
| Field | (default) | meadow, steppe, snow, desert or moor. (default) uses the parameter. |
| Your army | attack | **attack**: your host storms the wall. **defend**: your host holds it. |
| Your regiments | five regiments | Your army, a list of regiments (below). |
| Enemy army's name | The Garrison | Shown in the HUD and the war record. |
| Enemy regiments | four regiments | The enemy's army. |
| Your approach or defence | choose | "choose" lets the player pick from three cards. Attacking: ladders, ram or tower. Defending: push, oil or fire. A choice of the wrong kind (a defence while attacking) also means "choose". |
| Enemy's approach or defence | auto | "auto" reads the enemy's own make-up with a seeded coin (below); or fix it. |
| Victory -> switch | 0 | ON after a victory, OFF after a defeat. |
| Outcome -> variable | 0 | 1 = victory, 2 = defeat. |
| Your fallen -> variable | 0 | How many of your soldiers fell. |
| Gate broken -> switch | 0 | ON if the gate was battered down, OFF if it stood. |
| Common event afterwards | 0 | Runs (as a reserved common event) when the war record closes. |
| Seed | blank | Blank = a different siege every time. A number replays the same siege exactly. |

The event waits while the siege is on screen. Everything is written before the event continues, so the next command
can read the result.

### A regiment

| Field | Meaning |
| --- | --- |
| Name | Also decides the banner: the same name always flies the same arms (Warhost's heraldry). |
| Role | foot, pike, archer, horse or mage. |
| Soldiers | 1 to 99,999. |
| Soldiers from/to variable | If set, the count is **read** from this variable when the siege starts and the **survivors are written back** when it ends (those who fled come home). A regiment whose variable reads 0 stays home. |
| Strength | 1 = ordinary troops. 1.5 = veterans. 0.5 = levies. (0.25 to 4) |

Up to 240 figures a side are drawn. A bigger army is carried at several soldiers per figure, and every number you read
back is still in soldiers: a 5,000-man horde is accounted for to the man.

## How a siege works

- **The wall.** Nobody crosses the masonry except on an open crossing: a raised ladder, the broken gate, or the docked
  tower's bridge. Bows and mages on the walk shoot down from cover: missiles from the field do a third of their harm to
  them, and a bow on the wall reaches further than one on the ground.
- **Ladders.** There are six places for a ladder along the wall; a ladder goes up at each place your foot and pikes reach,
  so a host spread wide raises more of them (four is common). Each holds three climbers at a time; a man on a ladder fights at a disadvantage. A defender at a ladder's head may throw it down, and the men on it
  fall. A thrown ladder lies on the ground until it is raised again.
- **The ram.** Eight foot or pikes carry it to the gate and keep striking while three of them stand by it; the rest of
  the storming party waits back from the gate. When the gate breaks, everyone goes through it, the horse included.
  **Horse can only get in through a broken gate.**
- **The tower.** Eight men push it to the wall. When it docks, its bridge drops onto the walk and the men queued
  behind it cross over.
- **The garrison holds its nerve** while no attacker stands inside the wall; once the wall is breached, a beaten
  regiment can break and run for the keep, as attackers can break and run back down the field.
- **The clock.** When time runs out, the wall is taken if more attackers stand inside it than defenders are left, or if
  the garrison **surrenders**: fewer than 15% of its strength still fighting, outnumbered two to one. Otherwise the wall
  held.

## The three defences

| Defence | Beats | How |
| --- | --- | --- |
| Push the ladders | Ladders | Foot and pikes stand on the walk at the ladder heads and throw the ladders down far more often. |
| Oil at the gate | Ram | The gate is braced (it takes more blows) and oil burns whoever stands at its foot. |
| Fire arrows | Tower | Three in four bows on the walk shoot burning arrows at the tower until it burns. |

The counter is worth a great deal. Measured with our own test suite over 12 seeded sieges per cell,
an attacking host of 180 (foot, pikes, bows, horse, mages) against a garrison of 100:

| Approach | Against push | Against oil | Against fire |
| --- | --- | --- | --- |
| Ladders | **8%** | 100% | 58% |
| Ram | 100% | **0%** | 100% |
| Siege tower | 58% | 42% | **0%** |

(the attacker's share of sieges won; bold = the defence that counters the approach)

The three approaches are not equal, on purpose: the ram is the strongest when its counter is not chosen, and it is the
only way your horse gets in; the tower is the weakest, a reach for a host of bows and mages.

**Show the enemy's choice** (ON by default) lets a careful player always pick the counter. Turn it OFF when the choice
should be a real guess.

The wall is worth a great deal too: with the attacker only 1.3 times the garrison, the garrison held 359 of 360 sieges in
the balance probe (our own simulation runs: every pairing, 20 seeds, two seed runs). A siege needs
numbers and the right approach.

### When the enemy chooses ("auto")

- **Attacking:** a host with more than a quarter horse brings the ram (it is the only way its horse gets in); a host
  more than two fifths bows and mages brings the tower; otherwise ladders. A seeded coin (seven in ten) keeps it from
  being certain.
- **Defending:** a garrison more than two fifths bows shoots fire arrows; one more than three tenths pikes pushes the
  ladders; otherwise oil at the gate. The same coin.
- It never looks at the player's choice. With **Show the enemy's choice** ON (the default) the player sees it first.

## Plugin parameters (WarhostSiege.js)

| Parameter | Default | Meaning |
| --- | --- | --- |
| Your army's name | Your Host | Shown in the HUD and the war record. |
| Your army's colour | blank | A #hex colour for your soldiers' tunics. Blank = royal blue. |
| Enemy colour | blank | A #hex colour for the enemy's tunics. Blank = crimson. |
| Stone colour | blank | A #hex colour for the fortress stone. Blank = one of five stones chosen by the seed: limestone, granite, sandstone, chalk or basalt. |
| Default field | meadow | Used when a siege's Field is (default). |
| Time limit (seconds) | 90 | See "The clock" above. |
| Show the enemy's choice | ON | ON: the player sees how the enemy attacks or defends before choosing. OFF: it stays hidden until the assault. |
| Sounds | Horn, Blow3, Bow1, Fire1, Hammer, Collapse3, Fire3, Fall, Gate2 | Horn, clash of arms, volley, spell burst, the ram, the gate breaking, oil, a ladder thrown down, the bridge dropping (RTP sound effects). Blank = silent. |
| Music | Victory1, Defeat1, Battle2 | Victory and defeat music, and the siege music (the map's music comes back afterwards). Blank = none / keep the current music. |

## Controls

- Left / Right, or the mouse: choose a card. OK or a click on the chosen card: begin the assault.
- Hold OK, Shift or the mouse button during the siege: it runs three times faster.
- OK or a click on the war record: back to the map.

## Script calls

- `WarhostSiege.siege({...})`: start a siege from a Script command, with any of the command's arguments; an army may be
  a compact line, e.g. `WarhostSiege.siege({ side: 'defend', seed: 7, enemyArmy: 'foot:120:Raiders,archer:40:Slingers' })`
  (role:count:Name:strength:variable, regiments separated by commas, underscores in a name are spaces). An army left
  out is the command's default army.
- `WarhostSiege.lastResult()`: the last siege: `{title, winner, seconds, attacker, approach, posture, wallTaken,
  gateBroken, sides, regiments}` (winner 0 = the player's army, 1 = the enemy). Saved with the game.
- `WarhostSiege.isOpen()`: true while a siege is on screen.

## What it touches

- Your project files: never. It adds one scene (`Scene_WarhostSiege`) and one plugin command, and patches no engine
  method.
- Your save files: one small record (`$gameSystem._csafWarhostSiege`, versioned), created the first time a siege is
  fought. A save made before the plugin was installed loads as before.
- Frame cost: with 480 figures at the wall (both hosts at the 240-figure cap), the whole siege is drawn in fewer than
  five draw calls a frame, and the siege reads no pixels while it runs (both measured in MZ's own runtime).

## Compatibility

Warhost Siege replaces nothing: it adds its own scene and draws everything in it itself, so plugins that restyle MZ's
windows, battles or menus do not reach it and it does not reach them. It opens from any event and returns to the same
map, like the shop or the menu. Tested in RPG Maker MZ's own runtime (the `rmmz_*.js` scripts), in a new project, from
the shipped download. It has not been tested with every third-party plugin; if one clashes, tell us on the store page.
It is written for RPG Maker MZ; RPG Maker MV is not supported in this version.

## Part of the Warhost Campaign

Warhost (the open-field battle) and Warhost Siege share their soldiers, banners and variables: a regiment that
survives the field can storm the wall with the same count variable. A war camp and a campaign map are planned as the
volume's next two parts.

## Written with AI assistance

The code, the store images and the cover were produced with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
