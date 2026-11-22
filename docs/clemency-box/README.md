# Clemency Box — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Clemency Box  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-22


---

# Clemency Box v1.0.0 for RPG Maker MZ

Part 1 of **Clemency**, the Undertale-style battle frame, by Core Systems Asset Factory (https://csaf.itch.io).
It works on its own.

Your battle screen becomes **one drawn box on a black field**, and every line of the battle types into it.
Under the box sits a row of framed party plates (name, MP, HP bar and HP), and under that four command plates:
**FIGHT, ACT, ITEM and MERCY**. The cursor is a **soul**. MZ's windows, its window frame and its font are
gone from the battle; the box, the plates and the type are drawn by the plugin.

## Install

1. Copy the two files from `js/plugins` into your project's `js/plugins` folder.
2. Turn on both in the Plugin Manager. Any order works; this order reads best: ClemencyBoxCore, ClemencyBox.

Made for MZ's own battle system: turn based (the default) and Time Progress, front view (the default) and
side view.

## What types into the box

- **A flavour line** while the party chooses, once per turn (the same line for every actor in that turn).
- **The battle log** while actions play ("* Reid attacks!", "* Goblin took 61 damage!").
- **The battle's messages**: the start message, victory, EXP and gold (on one page), each level-up and learned
  skill, defeat, and the escape messages. They wait for **OK** (or a click or tap), as MZ's message window
  does; OK while a line is typing shows it at once. A small arrow blinks when the box is waiting.

Text codes in your database terms are converted (`\G` becomes your currency, `\N[1]` the actor's name,
`\V[1]` the variable). Colour and icon codes are dropped, because the box draws in one colour. Letters the
pixel type has no glyph for (accents, Japanese) are drawn in your game's own font at the same size.

## The commands

| Plate | What it does |
| --- | --- |
| FIGHT | Attack. The targets are listed in the box, each with an HP bar |
| ACT | The actor's skills, every skill type in one list, with the MP or TP cost on the right and the description under the list |
| ITEM | The party's items, with the count and the description |
| MERCY | **Defend**, and **Flee** when the battle allows escape |

There is no Fight / Escape menu at the start of a turn: the turn opens on the first actor's plates, and Flee
lives in MERCY. A failed Flee loses the turn, as MZ's own Escape does. Cancel on the first actor stays on that
actor. An actor with no skill types has ACT greyed out (stippled). Commands that other plugins add to MZ's
actor command window are not shown.

Arrow keys, OK and cancel, the mouse and touch all work: MZ's own windows still take the input at the places
the box draws them; only their drawing is replaced.

## Flavour lines

Each turn one living enemy is picked (seeded, so a turn shows the same line however often it is drawn) and its
line is typed:

| Enemy note tag | Effect |
| --- | --- |
| `<Clemency Flavour: The slime wobbles nervously.>` | a line for this enemy; add as many as you like, one is picked each turn |
| `<Clemency Flavour Low: The slime is melting.>` | used when this enemy is under 30% HP |

Without tags: a state's "persists" message from your database (Database > States > Messages), else one of
eight built-in lines with the enemy's name ("* Slime blocks the way.", "* Slime is sizing you up.") or three
low-HP lines. Your own lines replace the built-in ones through the *Flavour lines* and *Low-HP lines*
parameters (one per line, `{name}` is the enemy's name). On the first turn of a fight with more than one
enemy the line names the group ("* Slime and 2 others block the way.").

**Plugin command, Next flavour line**: the line typed on the next turn, from a troop event (for a scripted
moment). It is used once.

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Line colour | #ffffff | the box's border and its text |
| Body colour | #000000 | inside the box and behind the plates |
| Plate colour | #ffffff | the command plates and the party row (orange gives the plates of the games this is styled after) |
| Soul colour | #ff3030 | the heart that is the cursor |
| Typing speed | 40 | characters per second; 0 shows every line at once |
| Battleback | black | black field, or keep your battlebacks |
| Asterisk before lines | true | start every typed line with "* " |
| Flavour lines | (empty) | your lines for enemies with no tag of their own |
| Low-HP lines | (empty) | your lines for enemies under 30% HP |
| FIGHT / ACT / ITEM / MERCY labels | FIGHT, ACT, ITEM, MERCY | the four plate labels |
| Defend / Flee labels | Defend, Flee | the two MERCY entries |
| Enemy HP bars | true | an HP bar beside each enemy when choosing a target |
| Damage numbers in the box type | true | every damage, recovery (+) and MISS popup in the plugin's pixel type |
| Shake on hurt | true | the box shakes when a party member loses HP |
| Battle messages in the box | true | the start, victory, reward, level-up, defeat and escape messages type into the box; false leaves them to MZ's message window |
| Raise the troop | true | move the whole troop up (keeping its formation) so the lowest enemy stands above the box; front view only |

## With the other Clemency parts, and Barrage

- **Clemency Strike** (part 3): FIGHT opens its strike meter **inside the box**: the box closes onto the
  meter's plate while the bar slides, then opens again for the log.
- **Barrage** (https://csaf.itch.io/barrage): enemy attacks open its dodge arena over the box, as they do on
  MZ's own screen.

For other plugins: `ClemencyBox.addMercy({ name: 'Spare', symbol: 'spare', enabled: function (actor) { return true; }, run: function (scene) { ... } })`
adds an entry to MERCY (call it at load time); `ClemencyBox.say(['line', 'line'])` queues a page of lines in the
box during a battle; `ClemencyBox.flavour()` returns this turn's flavour line.

## Notes

- A name longer than its list column is cut with a period (the skill and item lists have two columns; the
  target and MERCY lists one).
- Troop events that show text still use your message window; the box steps aside while it is open.
- Nothing is added to your save.
- The box draws each line once and reveals it by typing; nothing is redrawn while a line types.

## Compatibility

Clemency Box extends MZ's own methods and calls the originals, with three exceptions it states: it skips the
Fight / Escape menu at the start of a turn (startPartyCommandSelection), it replaces the actor command list with
the four plates, and it replaces the drawing (never the logic) of the battle log and help windows. It has been
tested with MZ's stock battle system and with Clemency Strike; a plugin that rebuilds the battle scene's
windows (VisuStella Battle Core, for example) has not been tested with it. Put Clemency Box below other battle
plugins.

Part of **Clemency**, the Undertale-style battle frame for MZ: Strike (the FIGHT meter and one-bit enemies) and
Act and Mercy (talk an enemy down and spare it) are its other parts.

Every line of code was written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
