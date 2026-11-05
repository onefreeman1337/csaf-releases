# Leadlight - Stained-Glass Brick-Breaker Minigame for RPG Maker MZ: Break the Pane, Win the Picture — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Leadlight - Stained-Glass Brick-Breaker Minigame for RPG Maker MZ: Break the Pane, Win the Picture  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/leadlight  
**Docs published:** 2026-11-05


---

# Leadlight for RPG Maker MZ

**Version 1.0.**

**Break the glass, win the picture.** One of your own pictures waits behind a stained-glass pane that the plugin makes
from that picture: every piece of glass is the picture itself, coloured as glass would colour it, set in lead. Keep the
ball in play with the lead bar and break the pane piece by piece; as the glass falls the true picture shows through.
Break the target share and the rest of the pane falls away, and the picture is shown whole in a gilt frame. How long
it took, how many balls were lost and how much was broken go back into your variables, and a switch says whether the
pane was cleared.

Nothing is loaded but your picture: the glass, the lead, the bar, the ball, the shards and the frame are drawn by the
plugin. Any picture in `img/pictures` works: a CG, a portrait, a map screenshot, a title image.

## Installing

Copy the three files into `js/plugins` and turn them on in the Plugin Manager. The order does not matter (tested with
`Leadlight.js` loading first):

1. `LeadlightCore.js`: the rules of the game
2. `LeadlightDraw.js`: the glass, the lead, the bar, the shards and the frame
3. `Leadlight.js`: the plugin command, the parameters and the game scene

Then call the plugin command **Start Leadlight** from any event and name a picture. If `LeadlightCore.js` or
`LeadlightDraw.js` is missing or off, nothing starts and the console says which files to enable.

## The plugin command: Start Leadlight

| Argument | Default | Meaning |
| --- | --- | --- |
| Picture | blank | A picture from `img/pictures`. Blank starts nothing (the console says so once). |
| Pane | auto | leaded, cathedral, frost or brick. Auto picks one from the seed. |
| Target (%) | 85 | Break this share of the pane and the rest falls away. 30 to 100. |
| Balls | 3 | How many balls the player has. 1 to 9. |
| Power-ups | On | Some pieces drop a power when they break (below). |
| Variable: seconds taken | 0 | Written when the game ends. |
| Variable: balls lost | 0 | Written when the game ends. |
| Variable: percent broken | 0 | 0 to 100, written when the game ends. |
| Switch: cleared | 0 | ON if the target was broken, OFF otherwise. |
| Seed | blank | Blank = a new game every time. A number or a word = the same pane, powers and serves every time. |

The event waits while the game is on screen; everything is written before the event continues.

Script call, the same arguments as plain values:

```
Leadlight.start({ picture: 'Castle', style: 'frost', lives: 5, clearedSwitch: 3 });
Leadlight.isOpen()   // true while a game is on screen
```

## Sounds (plugin parameters)

Six sounds, each a sound effect from `audio/se`: the glass breaks (Break), the glass cracks (Ice1), the ball meets the
bar (Switch1), a ball is lost (Damage1), a power is caught (Powerup), the pane falls (Chime2). Set any of them to
(None) and that sound is silent.

## The four panes

- **Leaded**: the picture in bright, simplified glass, each piece its own colour, in lead.
- **Cathedral**: deep jewel glass in heavy lead, with a painted roundel here and there.
- **Frost**: the picture blurred and pale behind ice, so every broken piece shows clear.
- **Brick**: a wall of bricks in the picture's own colours, laid in a stagger.

**The picture decides how tough the glass is.** The busiest parts of your picture (an edge, a face, a line of text)
make the toughest pieces: a tenth of the pieces take three hits, a quarter take two, the rest break at once. A tough
piece cracks first, and you can see the crack.

## How it plays

Move the bar under the ball; where the ball meets the bar decides where it goes (the ends send it out at an angle, the
middle sends it nearly straight up, never quite, so it can always reach a new piece). The ball quickens a little with
every piece broken. Lose every ball and the glass holds.

Power-ups, when on: about one piece in ten drops a medallion when it breaks (never the toughest pieces). Catch it with
the bar:

- **Wide**: the bar is half as wide again for 15 seconds.
- **Multi**: two more balls.
- **Slow**: the balls slow down for 10 seconds.

**Controls:** left and right move the bar, OK (or Space) serves the ball. Mouse and touch: the bar follows the pointer,
a click or tap serves. On the results, OK or a click leaves.

**How long a game takes**, measured over 100 simulated games per row and two seeds with the default pane (10 x 7 pieces,
85% target): a player who meets the ball well clears it in a median of about two minutes and rarely loses a ball.

## Compatibility

Leadlight adds its own scene and replaces nothing. It extends two engine methods, each by saving the original and
calling it: `Game_System.initialize` (its save record) and `Game_Interpreter.updateWaitMode` (so the event waits while
the game runs). The scene draws no MZ window, uses its own typeface stack (Palatino Linotype, Book Antiqua, Palatino,
Georgia), and is laid out for 816 x 624 and scaled to fit other screen sizes. It was tested in a stock MZ project; it
has not been tested beside every plugin.

Your picture is read once when a game starts and never again while it plays. A picture name that does not exist in
`img/pictures` stops the game with RPG Maker's own "Failed to load" message, the same as a missing picture in Show
Picture.

**Save data.** One small record in the save file (`$gameSystem._csafLeadlight`, version 1: games played, cleared, the
best percent). A save made before Leadlight was installed loads cleanly.

**Cost per frame.** With three balls breaking cathedral glass, the scene draws in **5** draw calls per frame with 0
windows drawn; a piece of glass is redrawn only when it cracks or breaks.

## Licence and AI disclosure

See `LICENSE.txt`. Every line of this plugin was written with AI assistance, and its store images and cover were
produced with AI assistance. It contains no audio: its default sounds are files from MZ's own RTP.

Copyright (c) 2026 Core Systems Asset Factory. https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
