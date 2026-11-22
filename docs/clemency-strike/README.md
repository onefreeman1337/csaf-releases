# Clemency Strike: Undertale-style strike meter and one-bit enemies for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Clemency Strike: Undertale-style strike meter and one-bit enemies for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-22


---

# Clemency Strike v1.0.0 for RPG Maker MZ

Part 3 of **Clemency**, the Undertale-style battle frame, by Core Systems Asset Factory (https://csaf.itch.io).
It works on its own.

Two things change in your battles. **FIGHT becomes a timing meter:** when an actor attacks, a striped target
plate opens at the bottom of the screen and a bar slides across it; stopping the bar near the centre hits
harder. **Every enemy is redrawn as a one-bit figure** from its own battler image when the battle starts: its
silhouette outline and its own ink lines in one colour on a black body, on a black field. Nothing to draw:
any battler you already have works, stock or your own.

## Install

1. Copy the two files from `js/plugins` into your project's `js/plugins` folder.
2. Turn on both in the Plugin Manager. Any order works; this order reads best: ClemencyStrikeCore,
   ClemencyStrike.

Tested with MZ's own battle system (turn based, front view and side view) and MZ's stock windows.

## The strike meter

When an actor uses the **Attack** command, the meter opens and the battle waits:

- Press **OK** (or click, or tap) to stop the bar. The closer to the centre, the harder the hit: **Best damage**
  (x1.50) at the centre, falling evenly to **Worst damage** (x0.50) at the edge.
- Stopping inside the narrow **centre slot** is a **PERFECT** stop: Best damage, and a critical hit too if you
  turn on *Perfect is critical*.
- A bar left to run off the far end is a **miss**: no damage, and the plugin draws MISS above the enemy.
- A strike that lands **always hits**: the meter replaces MZ's hit roll (the enemy's own evasion still applies).
- With several bars, each press stops the front-most moving bar, and the hit is the **average** of the bars
  (a missed bar counts zero). Every bar missed is a miss.

The plate names the pattern and, once you stop, shows the result (`PERFECT!`, `MISS` or the multiplier, such as
`x1.23`) in the plate's top strip. While the meter is open, and until that action ends, the status and log
windows step aside. An actor on **Auto Battle**, or confused, stops the bar on its own at the *Auto-battle
accuracy* you set.

### Nine patterns, picked from the weapon

The pattern comes from the **name of the weapon's type** (Database > Types > Weapon Types), so a renamed type
still works:

| Pattern | Bars | Weapon type names it answers to |
| --- | --- | --- |
| CUT | 1, medium | sword, blade, katana, sabre, rapier (and any name it does not know) |
| FLURRY | 3 quick bars | dagger, knife, kunai |
| HEAVY | 1 slow bar, wide centre | axe, hammer, flail, mace, club |
| AIM | 1 fast bar from the right, narrow centre | bow, crossbow, sling |
| VOLLEY | 4 quick bars | gun, rifle, pistol, musket |
| COMBO | 2 bars from both sides | claw, glove, fist, gauntlet (and an actor with no weapon) |
| THRUST | 1 bar from the right | spear, lance, pike, halberd |
| LASH | 2 bars from both sides | whip, chain |
| TAP | 1 slow bar | staff, rod, wand |

Each pattern has its own **one-bit slash**, drawn on the target in place of the attack animation.

## The one-bit enemies

When a battle starts, each enemy's battler image is read once and redrawn on a grid of square dots
(*Dot size*, 3 px by default, the same for the whole troop):

- **line** (default): a white outline and the battler's own ink lines inside it, on a black body. Where a battler
  has a large bright area (a white pelt, a pale robe), *Highlight tone* prints a dot screen on it; small or dark
  battlers usually get none.
- **dither**: a dotted body shaded by the battler's own light, inside the outline.
- **ink**: the print reversed, a white body with black lines and a white rim.

The painted ground shadow under a battler is left out. Enemies bob while they wait (*Idle bob*), and the strike's
damage number is drawn above the enemy's head in the plugin's own pixel type. With *Battleback* set to `black`
(the default) the fight happens on a black field.

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| One-bit enemies | Redraw | redraw every enemy battler, or keep the art |
| Drawing style | line | line, dither or ink |
| Dot size (px) | 3 | 1 to 8; 2 keeps more detail, 4 and up is chunkier |
| Line colour | #ffffff | the lines (and a dither's dots) |
| Body colour | #000000 | inside the outline |
| Highlight tone | 35 | 0 to 100: how much of the brightest areas get a dot screen (line style) |
| Idle bob (px) | 3 | 0 keeps enemies still |
| Battleback | black | black, or keep your battlebacks |
| Strike meter | Show | the meter on Attack, or off |
| Meter on | attack and tagged | attack; attack and tagged; or physical (every physical damage skill) |
| Best damage (x) | 1.50 | at the centre |
| Worst damage (x) | 0.50 | at the edge |
| Perfect is critical | false | a PERFECT stop on every bar is also a critical hit |
| Auto-battle accuracy | 70 | 0 to 100: how close to the centre an auto-battle actor stops |
| One-bit slash | true | the slash instead of the attack animation |

## Notetags

| Where | Tag | Effect |
| --- | --- | --- |
| Weapon or skill | `<Strike: flurry>` | use this pattern (cut, flurry, heavy, aim, volley, combo, thrust, lash, tap) |
| Skill | `<Strike>` | this skill opens the meter too (with *Meter on* set to attack and tagged) |
| Skill | `<Strike: off>` | never open the meter for this skill, the Attack skill included |
| Actor | `<Strike: combo>` | the pattern when this actor has no weapon |
| Enemy | `<Strike Restrike: off>` | keep this enemy's art |
| Enemy | `<Strike Style: dither>` | this enemy's drawing style |

## Plugin command

**Strike settings**: turn the one-bit enemies and the meter on or off for the battles that follow, or set
either back to the plugin's parameter. The choice is saved with the game.

## Notes

- Items never open the meter; skills open it only as *Meter on* and the tags say.
- Counter-attacks and magic reflection are never scaled by a strike.
- An enemy that transforms is redrawn from its new image.
- Nothing is added to your save except the Strike settings record (three small fields).
- The enemy is read from its own image once per battle; nothing is read during play.

## Compatibility

Clemency Strike extends MZ's own methods and calls the originals (it replaces none). It has been tested with MZ's
stock battle system only; a plugin that rebuilds the battle scene or its action sequence (VisuStella Battle Core,
for example) has not been tested with it. Put Clemency Strike below other battle plugins.

Part of **Clemency**, the Undertale-style battle frame for MZ: Box (the four-command frame) and Act and Mercy
(talk an enemy down and spare it) are its other parts. For the dodge phase of the same fight, see **Barrage**
(https://csaf.itch.io/barrage).

Every line of code was written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
