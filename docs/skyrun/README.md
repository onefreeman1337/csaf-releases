# Skyrun: arcade flight runs in 5 drawn lands for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Skyrun: arcade flight runs in 5 drawn lands for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-28


---

# Skyrun for RPG Maker MZ

By Core Systems Asset Factory (https://csaf.itch.io).

**Flight sequences for your game.** The party's airship flies low over a drawn land toward the horizon; your own enemies, drawn
from the battler images already in your database, fly out of the distance at the camera in waves, swell as they come and shoot
back; a boss closes the run. Steer with the arrow keys or the mouse, fire with OK. A war record closes the run and writes the
outcome, the score and a switch.

Nothing is loaded but your own battler images: the sky, the sun, the far ridge, the ground rushing toward the camera, the
scenery that slides past, the airship, the shots and the record are drawn by the plugin.

## Installing

Copy the three files into `js/plugins` and turn them on in the Plugin Manager. Any order works: `Skyrun.js` finds the other two
the first time a flight opens.

1. `SkyrunCore.js`: the rules of a flight (waves, shots, hits, the boss). No drawing.
2. `SkyrunDraw.js`: the five lands, the sky, the ground's colours and the scenery, drawn from code.
3. `Skyrun.js`: the parameters, the plugin command, the scene and the record.

## The plugin command: Start Flight

| Argument | Default | Meaning |
| --- | --- | --- |
| Title | Into the Storm | Shown at the top of the screen. |
| Land | (default) | sea, plains, desert, snow or clouds (a cloud sea). (default) uses the parameter. |
| Waves | four waves | Each wave: the enemy ids that fly in it (in order, repeating), how many, and their path: straight, weave, swoop, spiral or ring. |
| Boss (enemy id) | 4 | Drawn large at the end, held in front of the ship, firing five-shot volleys. 0 = no boss: the run is won when the last wave is down. |
| Boss hits to bring down | 30 | |
| Ship hits it can take | 5 | |
| Outcome -> variable | 0 | 1 = the run was won, 2 = lost. |
| Score -> variable | 0 | 100 per enemy, 1000 for the boss. |
| Won -> switch | 0 | ON after a won run, OFF after a lost one. |
| Seed | blank | Blank = a different run every time. A number replays the same run. |

The event waits while the flight is on screen. Everything is written before the event continues.

**Your enemies.** An enemy id flies as its battler image from your database. An id with no battler image is left out of the
run, with a note in the console: it would otherwise fly unseen and still shoot. If no enemy in a flight has a battler image, the
flight closes at once on its record.

## Playing

- Arrow keys: steer left, right, up and down. OK (Enter, Space or Z) or Shift: fire.
- Mouse or touch: hold the button and the ship steers toward the pointer and fires.
- Each enemy fires twice on its way in, aimed at where the ship is. The boss fires a five-shot volley.
- A hit is decided where a shot's depth meets a target's depth, so a target is hit where it is, never where it appears.

## Script calls

- `Skyrun.start({ title: 'Into the Storm', land: 'sea', seed: '7' })`: open a flight with any of the command's arguments.
- `Skyrun.isOpen()`: true while a flight is on screen. A second flight is refused while one is open.

## The save file

A small record is kept with the game: how many runs, how many won, the best score (`$gameSystem._csafSkyrun`, versioned).

## Terms

Commercial and non-commercial use in your RPG Maker projects, no royalty. See LICENSE.txt.

Written with AI assistance (code and graphics). No audio is included; the default sounds name MZ's own RTP files.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
