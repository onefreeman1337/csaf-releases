# Pennant — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Pennant  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-10-29


---

# Pennant for RPG Maker MZ

Capture the flag inside your game. Your party plays a troop or a team of rival actors on a field the plugin draws: raid
the other side's banner, tag raiders in your own half and march them into your pen, fling the gate open to free your
teammates, and carry the banner home over the midline to score. Each player's field abilities come from its own skills,
and its side-view battler sheet plays every motion.

Copyright (c) 2026 Core Systems Asset Factory. Terms of use: LICENSE.txt.

## What you get

- **Your party is the team on day one.** Pennant draws each player from its side-view battler sheet (`img/sv_actors`)
  and maps MZ's own battle motions onto the game: walk to run, thrust to tag, spell to use an ability, damage when
  shoved, dying while held in the pen, victory when your side wins. No new art.
- **Any troop is the other team**, drawn from its enemy images with a hop, a lean and a squash, and lettered the way MZ
  letters a troop (Goblin A, Goblin B). Or name a team of rival actors, on their side-view sheets like yours.
- **Each side flies its own banner, struck from its leader's name**: one of 6 field colours, a gold or silver metal, one
  of 8 charges (star, sun, crescent, tower, key, crown, cross, hart) and one of 4 divisions (plain, pale, bend, bordure).
  The two sides never fly the same field colour. Rename the leader and the banner is struck again from the new name. The banners ripple on their
  poles and stream behind a raider who carries one.
- **The rules of the playground game.** The field is split at the midline. In your own half you tag any raider you
  touch, and a tagged raider is marched into your pen. Cross into their half to raid: reach their banner and you lift
  it; carry it back over the midline and your side scores a capture. Tagged while carrying, you drop it and it flies
  home. Reach the gate of the pen holding your teammates and it swings open: everyone inside walks home with you under a
  white truce flag (nobody can tag a truce walker, and a truce walker can tag nobody). No guarding: a side may not stand
  inside the ring around its own banner or its own pen, so a raider who reaches the ring is safe there.
- **Six field abilities made from skills.** Each player gets up to two, from the skills it knows, then the skills its
  class will learn, then its attack skill, and uses them in turn. The skill's element decides the look; the way the
  skill reaches its target decides what it does:

  | The skill | The ability |
  | --- | --- |
  | Physical, one enemy | **Sprint**: the player runs much faster for a moment |
  | Magic, one enemy | **Freeze**: roots the nearest opponent in reach, who is then immune for a while |
  | Physical, all enemies | **Shove**: every opponent near is knocked away and stunned |
  | Magic, all enemies | **Smoke**: a cloud where opponents stumble at about half speed |
  | Random enemies | **Ward**: a ring on the ground opponents cannot enter |
  | Any healing or draining skill | **Rally**: the player and teammates near it run faster |

  The skill's MP cost sets its tier: dearer skills recharge sooner and last longer.
- **9 element looks** for MZ's stock elements (Physical, Fire, Ice, Thunder, Water, Earth, Wind, Light, Darkness) on the
  smoke, the ward rings and the bursts. An element you named yourself is matched by its words ("Frost Nova" reads as
  ice), and a name nothing matches gets a colour made from the name.
- **5 fields:** Fair Meadow, Castle Bailey, Snowfield, Low Tide, Torchlit Clearing. Each has its own timber pens with
  gates that swing.
- **An arcade HUD:** a card per player with CAUGHT / BANNER / TRUCE stamps, each side's banner tally in its own colours,
  the clock, and your ability discs filling as they recharge; TAGGED! / FREED! / GOT IT! / SAVED! / FROZEN! / CAPTURE! /
  YOU WIN! lettering. No font and no image file is used.
- **Four computer strengths with real roles**: a keeper in front of the banner, guards on the line, raiders, a rescuer
  when a teammate is held, chasers when the banner is taken. The computer sees the field a moment late (a third of a
  second at Beginner, under a tenth at Hard), so a well-timed sidestep beats it. Carrying is a chase: between a quarter
  and two fifths of the banners lifted are run down before the line (computer against computer, 60 matches a strength).
  Measured over 120 matches per strength (two seed sets of 60), three a side: a player who runs straight for the banner
  wins nearly nine in ten against Beginner and Easy and about two in five against Normal and Hard. A player who bends
  wide around every defender wins a little over half against Beginner, about two in three against Easy and Normal, and
  about a third against Hard. Standing still, or mashing every button, loses more than eight matches in ten at every
  strength.

## Install

1. Copy `js/plugins/PennantCore.js`, `js/plugins/PennantDraw.js` and `js/plugins/Pennant.js` into your project's
   `js/plugins` folder.
2. In the Plugin Manager, add all three and turn them ON. Any order works.
3. Set the parameters you want (all optional, see Results).

## Start a match

From an event: **Plugin Command > Pennant > Start Match**, then choose:

| Option | What it does |
| --- | --- |
| Opponents: troop | The troop whose enemies make the other team |
| Opponents: rival actors | A team of actors instead of a troop. An actor who is in your party plays for you |
| Opponent strength | Beginner, Easy, Normal or Hard |
| Field | Fair Meadow, Castle Bailey, Snowfield, Low Tide or Torchlit Clearing |
| Players per side | 2, 3 or 4 |
| Captures to win | 1, 2, 3 or 5 |
| Demo | Both sides play themselves: an exhibition or an attract screen |

Or a script call:

```js
Pennant.start({ troop: 1, ai: 'normal', field: 'meadow', perTeam: 3, target: 3 })
Pennant.start({ rivals: [5, 6, 7], ai: 'hard', field: 'bailey' })
```

Your team is your party, the leader first. A small party is filled from the actors in your database.

## Controls

| Input | Action |
| --- | --- |
| Arrow keys | Move the player under the gold arrow (the party leader to start with) |
| OK (Z, Enter / gamepad A) | Burst: a short dash. It recharges in under two seconds |
| Cancel or Page Up / Page Down (X, Esc, Q, W / gamepad B, LB, RB) | Your next field ability (the discs bottom left) |
| Shift (gamepad X) | Switch to the next teammate who is free |

When your player is caught, you take over the nearest teammate who is free. Your other players play themselves at the
opponent's strength. Version 1.0 is one player against the computer, played with a keyboard or a gamepad; touch and
mouse control are not supported.

## Results

Written before the event continues:

| Parameter | Receives |
| --- | --- |
| Winner -> variable | 1 = your team won, 2 = the other team won, 0 = a draw |
| Your team won -> switch | ON when your team won |
| Your captures -> variable | How many banners your side carried home |
| Common event afterwards | Reserved when the match closes |
| Time limit (seconds) | 60 to 600, default 180. At the limit the side with more captures wins, then the side holding more prisoners, else a draw |

A match started as a Demo writes no variable, switch or common event. Script call: `Pennant.lastResult()` returns
`{ winner, score, clock, field, ai, perTeam, target, demo, tags, rescues }`. Your record (matches played, won and
captures) is kept with the save file.

## Compatibility

- RPG Maker MZ. Pennant adds its own scene and one plugin command. It replaces and extends no engine method.
- Players need side-view battler images (`img/sv_actors`). An actor with none plays as a plain drawn figure, and so does
  an enemy with no image. With the side-view battle option on, enemies are drawn from `img/sv_enemies`.
- Names are struck in the arcade lettering (A to Z, 0 to 9 and a few marks). A name it cannot strike shows as HOME 1,
  AWAY 2 and so on on the cards, and as HOME or AWAY in the announcements. Banners are struck from any name.
- Pennant plays the system sounds set in your own database (cursor, enemy attack, recovery, equip, evasion, magic
  evasion, use skill, buzzer, save). It ships no audio.

## Questions

Store page: https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
