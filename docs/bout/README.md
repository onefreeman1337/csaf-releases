# Bout - One-on-One Fighting Game Scene for RPG Maker MZ: Your Actors, Specials From Their Skills — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Bout - One-on-One Fighting Game Scene for RPG Maker MZ: Your Actors, Specials From Their Skills  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/bout  
**Docs published:** 2026-11-05


---

# Bout for RPG Maker MZ

A one-on-one fighting scene inside your game. Two of your actors fight side-on in real time, best of three rounds,
using the side-view battler sheets your project already has: walk, jump, crouch, guard, light and heavy attacks, a low
attack, a throw, and specials made from each actor's own skills.

Copyright (c) 2026 Core Systems Asset Factory. Terms of use: LICENSE.txt.

## What you get

- **Every actor is a fighter on day one.** Bout draws each fighter from its side-view battler sheet (`img/sv_actors`),
  mapping MZ's own battle motions onto the fight (walk, guard, thrust, swing, damage, victory, dead). No new art.
- **Specials made from skills.** Each fighter gets up to three specials from the skills it knows, then the skills its class
  will learn, then its attack skill. The skill's element decides the look; the way it reaches its target decides the move:
  a projectile, a rush, a rising strike, a wave along the ground, a rain from above, a burst, or a draining tether.
- **9 element looks** for MZ's stock elements (Physical, Fire, Ice, Thunder, Water, Earth, Wind, Light, Darkness), each with
  its own hit spark. An element you named yourself is matched by its words ("Frost Nova" strikes as ice), and a name nothing
  matches gets a colour made from the name.
- **5 arenas:** Dojo at Dusk, Moonlit Courtyard, Harbour Pier, Desert Ruin, Snow Shrine.
- **A fighting-game HUD:** tapered health bars with a damage trail, guard bars, round markers, a round timer, special meters,
  and ROUND / FIGHT! / K.O. / PERFECT / TIME lettering. No font and no image file is used.
- **Four AI strengths.** A player new to fighting games, who guards some of the time, wins more than half their matches
  against Beginner. A competent player who reacts in about a sixth of a second wins most matches against Easy, about half
  against Normal and about a third against Hard (measured over 120 best-of-three matches per strength). Mashing one button
  wins against none of them.

## Install

1. Copy `js/plugins/BoutCore.js`, `js/plugins/BoutDraw.js` and `js/plugins/Bout.js` into your project's `js/plugins` folder.
2. In the Plugin Manager, add all three and turn them ON. Any order works.
3. Set the parameters you want (all optional, see below).

## Start a duel

From an event: **Plugin Command > Bout > Start Duel**, then choose:

| Option | What it does |
| --- | --- |
| Fighter (you) | An actor, or none for the party leader |
| Opponent | The actor you fight |
| Opponent strength | Beginner, Easy, Normal or Hard |
| Rounds (best of) | 1, 3 or 5 |
| Arena | Dojo at Dusk, Moonlit Courtyard, Harbour Pier, Desert Ruin or Snow Shrine |
| Demo | Both fighters play themselves: an attract screen or a showcase |

Or a script call:

```js
Bout.start({ fighter: 1, opponent: 2, ai: 'normal', rounds: 3, stage: 'dojo' })
```

## Controls

| Input | Action |
| --- | --- |
| Left / Right | Walk |
| Up | Jump |
| Down | Crouch |
| OK (Z, Enter / gamepad A) | Light attack. Down + OK is a low attack |
| Cancel (X, Esc / gamepad B) | Heavy attack |
| OK + Cancel at the same moment | Throw, from point blank: beats any guard, loses to any attack |
| Shift (gamepad X) | Guard. Standing stops high and mid attacks; Shift + Down stops lows and mids |
| Page Up / Page Down (Q, W / LB, RB) | Special: alone the first, with Forward the second, with Back the third |

A special costs half of the green meter. The meter fills over time and when you land or take hits. Version 1.0 is one
player against the computer, played with a keyboard or a gamepad.

## Results

Written before the event continues:

| Parameter | Receives |
| --- | --- |
| Winner -> variable | 1 = your fighter won, 2 = the opponent won, 0 = a draw |
| Fighter won -> switch | ON when your fighter won |
| Common event afterwards | Reserved when the duel closes |
| Round timer (seconds) | 20 to 99, default 99 |

A duel started as a Demo writes no variable, switch or common event. Script call: `Bout.lastResult()` returns
`{ winner, rounds, wins, fighter, opponent, ai, stage, demo }`.

## Compatibility

- RPG Maker MZ. Bout adds its own scene and one plugin command. It replaces and extends no engine method.
- Your fighters need side-view battler images (`img/sv_actors`). An actor with none fights as a plain drawn figure.

## Questions

Store page: https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
