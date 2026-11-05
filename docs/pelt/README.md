# Pelt - Team Dodgeball Minigame for RPG Maker MZ: Your Party vs Any Troop, Special Throws From Skills — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Pelt - Team Dodgeball Minigame for RPG Maker MZ: Your Party vs Any Troop, Special Throws From Skills  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/pelt  
**Docs published:** 2026-11-05


---

# Pelt for RPG Maker MZ

Team dodgeball inside your game. Your party plays a troop or a team of rival actors on a court the plugin draws: run,
throw, catch, dodge, jump, and special throws made from each player's own skills, with their side-view battler sheets
playing every motion.

Copyright (c) 2026 Core Systems Asset Factory. Terms of use: LICENSE.txt.

## What you get

- **Your party is the team on day one.** Pelt draws each player from its side-view battler sheet (`img/sv_actors`) and
  maps MZ's own battle motions onto the game: walk to run, guard to catch, swing to throw, skill for a special, evade to
  dodge, damage when hit, dead when out, victory when your side wins. No new art.
- **Any troop is the other team**, drawn from its enemy images with a hop, a lean and a squash, and lettered the way MZ
  letters a troop (Goblin A, Goblin B). Or name a team of rival actors, on their side-view sheets like yours.
- **The classic rules.** Three hits and a player is out. Catch a throw and the thrower is out, and one of your own out
  players comes back. Each side has an outfielder behind the other team who throws in from behind.
- **Special throws made from skills.** Each player gets up to three specials from the skills it knows, then the skills its
  class will learn, then its attack skill, and throws them in turn. The skill's element decides the look; the way the
  skill reaches its target decides the throw: a straight shot, a fast rush, a rising spike, a high drop, a skim along the
  floor, a burst that is hard to step out of, or a drain that heals the thrower. A spike, a drop or a skim cannot be
  caught, only dodged, and a skim can be jumped.
- **9 element looks** for MZ's stock elements (Physical, Fire, Ice, Thunder, Water, Earth, Wind, Light, Darkness): the
  ball, its glow and its hit spark. An element you named yourself is matched by its words ("Frost Nova" throws as ice),
  and a name nothing matches gets a colour made from the name.
- **5 courts:** Schoolyard, Beach, Castle Courtyard, Frozen Pond, Tavern Cellar.
- **An arcade HUD:** a card per player with a tapered HP bar and an OUT stamp, special meters, round pips, a clock, and
  CATCH! / OUT! / HIT / PLAY BALL! / TIME! / YOU WIN! lettering. No font and no image file is used.
- **Four computer strengths**, measured over 240 matches per strength (two seed sets of 120). A newcomer who reacts late
  and rarely catches wins most matches against Beginner, more than half against Easy and about a third against Normal. A
  competent player who catches on time and runs up before throwing wins every match against Beginner and Easy, nearly
  every one against Normal and about half against Hard. Mashing the buttons wins under half against Beginner and less
  at every strength above it.

## Install

1. Copy `js/plugins/PeltCore.js`, `js/plugins/PeltDraw.js` and `js/plugins/Pelt.js` into your project's `js/plugins`
   folder.
2. In the Plugin Manager, add all three and turn them ON. Any order works.
3. Set the parameters you want (all optional, see Results).

## Start a match

From an event: **Plugin Command > Pelt > Start Match**, then choose:

| Option | What it does |
| --- | --- |
| Opponents: troop | The troop whose enemies make the other team |
| Opponents: rival actors | A team of actors instead of a troop. An actor who is in your party plays for you |
| Opponent strength | Beginner, Easy, Normal or Hard |
| Court | Schoolyard, Beach, Castle Courtyard, Frozen Pond or Tavern Cellar |
| Infielders per side | 2, 3 or 4, plus one outfielder each |
| Rounds (best of) | 1 or 3 |
| Demo | Both sides play themselves: an exhibition or an attract screen |

Or a script call:

```js
Pelt.start({ troop: 1, ai: 'normal', court: 'schoolyard', perTeam: 3, rounds: 1 })
Pelt.start({ rivals: [5, 6, 7, 8], ai: 'hard', court: 'castle' })
```

Your team is your party, the leader first. A small party is filled from the actors in your database.

## Controls

| Input | Action |
| --- | --- |
| Arrow keys | Move the player under the gold arrow: the one holding the ball, or the one nearest it |
| OK (Z, Enter / gamepad A) | Throw when you hold the ball, catch when you do not. Face the ball; a stance that catches nothing leaves you off balance |
| Cancel (X, Esc / gamepad B) | Dodge: a quick sidestep the ball passes through |
| Shift (gamepad X) | Jump |
| Page Up / Page Down (Q, W / LB, RB) | A special throw, when the green meter is at least half full |

The meter fills when you catch and when you hit. Your other players play themselves at the opponent's strength.
Version 1.0 is one player against the computer, played with a keyboard or a gamepad.

## Results

Written before the event continues:

| Parameter | Receives |
| --- | --- |
| Winner -> variable | 1 = your team won, 2 = the other team won, 0 = a draw |
| Your team won -> switch | ON when your team won |
| Common event afterwards | Reserved when the match closes |
| Time limit (seconds) | 60 to 300, default 120. At the limit the side with more players left wins, then the side with more HP |

A match started as a Demo writes no variable, switch or common event. Script call: `Pelt.lastResult()` returns
`{ winner, rounds, wins, court, ai, perTeam, demo }`.

## Compatibility

- RPG Maker MZ. Pelt adds its own scene and one plugin command. It replaces and extends no engine method.
- Players need side-view battler images (`img/sv_actors`). An actor with none plays as a plain drawn figure, and so does
  an enemy with no image. With the side-view battle option on, enemies are drawn from `img/sv_enemies`.
- Pelt plays the system sounds set in your own database (cursor, enemy attack, collapse, recovery, buzzer, save). It
  ships no audio.

## Questions

Store page: https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
