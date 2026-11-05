# Rebuttal: Danganronpa Style Debates for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Rebuttal: Danganronpa Style Debates for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/rebuttal  
**Docs published:** 2026-11-05


---

# Rebuttal for RPG Maker MZ

**Version 1.0.0 (the debate).**

**Class-trial debates, inside your game.** The cast sits in a ring. One after another they make their statements, and
every statement flies across the stage as big moving type. Somewhere in one of them is a lie, glowing gold: the weak
point. The player picks a truth bullet from the evidence they hold, aims, and fires. The right bullet on the right
weak point breaks the statement apart and wins the debate. A wrong one costs influence. Run out of influence or time and
the debate is lost.

**You write only the words.** Every statement's motion is composed from its own text and its speaker: each speaker
moves in their own way, each line enters differently from the one before it, punctuation sets the emphasis (`!`
punches, `?` wobbles, `...` drifts), long lines move slower so they stay readable, and a weak point is never split
across two lines.

## Installing

Copy the three files into `js/plugins` and turn them on in the Plugin Manager:

1. `RebuttalCore.js`: the rules (reads the debate, composes the motion)
2. `RebuttalDraw.js`: the look (the ring, the type, the cylinder, the stamp)
3. `Rebuttal.js`: the plugin command and the debate scene

That order is the recommended one, but any order works: each file looks for the others the first time a debate opens
(tested with `Rebuttal.js` loading first).

## Writing a debate

Make a common event and write the debate in it as **Comment** lines, one statement per line:

```
Rebuttal: Kasey | The door was {locked from the inside} the whole night. | receipt
Rebuttal: Eliot | Nobody could have reached the {east stair} without being seen! | stair-map
Rebuttal: Reid | Are you sure the {window} was shut? | window-latch
Rebuttal: Kasey | It was suicide... plain and simple.
```

- `Rebuttal:` then the **speaker**, then `|`, then the **statement**.
- Curly brackets mark the **weak point**: one per statement at most.
- A weak point needs the **bullet** that breaks it after a second `|`. A statement with no weak point is a distraction.
- `Rebuttal noise:` makes a line with no weak point that only adds to the din.
- A statement may be up to 160 characters long; split a longer one into two statements.
- Other comments in the event are ignored. A line the plugin cannot read is skipped and named in the console with its
  comment line number, so a typo never vanishes silently.

## Truth bullets

Bullets are the items the party holds that carry a notetag naming the bullet:

```
<Rebuttal Bullet: receipt>
```

The item's name is what the player sees. If the party holds none, the debate offers its own answers, so you can test a
debate before its evidence exists.

## The plugin command: Start a Debate

| Argument | Default | Meaning |
| --- | --- | --- |
| Debate (common event) | 1 | The common event whose Comment lines hold the statements. |
| Influence | 3 | Wrong shots allowed (1 to 9). |
| Time limit (seconds) | 90 | 10 to 600. |

The event waits while the debate is on screen and continues when it ends.

## Plugin parameters (Rebuttal.js)

| Parameter | Default | Meaning |
| --- | --- | --- |
| Won -> switch | 0 (none) | ON when the player breaks the right weak point, OFF when the debate is lost. |
| Shots -> variable | 0 (none) | How many shots the player fired. |
| Seed | rebuttal | Changes how every statement moves. The same seed always moves them the same way. |

## Playing

- **Aim:** the mouse, a finger, or the arrow keys.
- **Choose the bullet:** Page Up and Page Down, or the mouse wheel. The cylinder turns to it and the HUD names it.
- **Fire:** OK, or a click or tap.
- The statements loop until the debate is decided. A weak point can only be hit while it is fully on screen.

## Terms

See `LICENSE.txt`. Made by Core Systems Asset Factory, https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
