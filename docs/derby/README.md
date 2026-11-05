# Derby - Snail Racing and Betting for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Derby - Snail Racing and Betting for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/derby  
**Docs published:** 2026-11-05


---

# Derby for RPG Maker MZ

**A race meeting the player can bet on.** The player reads a race card (every runner's form, the going it likes,
its silks and its price), puts gold on a runner to Win or to Place, and watches the race run on a drawn garden
course. Close finishes go to the judge's photograph. Winnings are paid into the party's gold.

The runners are racing snails. Every stable is generated from a seed: each runner's name, shell colour, shell
pattern (bands, spots, flames or rays), spiral, body colour, silks and saddle cloth. Every race draws its own field,
course, going and prices. Nothing is loaded from an image file.

## Five courses, six surfaces

A course is laid in sections: moss, slate, sand, puddle, leaf litter and gravel. Some runners like it damp and some
like it dry, so the same field runs differently over a wet course than a dry one, and the going of the day (dewy,
damp or dry) moves it again. The five course themes are the **Kitchen Garden** (terracotta pots and a brick wall),
the **Rockery** (stones and alpine flowers), the **Greenhouse** (glass, pots and tomato vines), the **Orchard**
(trees and fallen apples) and the **Moss Bank** (ferns and toadstools).

During the race runners surge, tire, and now and then stop to nibble a leaf. A commentary line calls the lead
changes and the surfaces, and a strip at the top shows the whole field on the course.

## The prices are measured

When a card is drawn, the bookmaker runs the **same race model the player watches** 2,000 times and counts how often
each runner wins and places. Every price is set from the upper bound of that chance and rounded **down** a ladder of
traditional prices (5/2, 7/4, Evens and so on). A second, independent 2,000 races then check the board, and any bet
that still reads over your **Payback** setting plus 4% is shortened. The pricing uses about a millisecond of each
frame while the player reads the card, and the prices are chalked up when it finishes. The card for each later race
of a visit is priced while the race before it is being run.

Measured on a third, independent set of races (60 cards over two seed ranges, 4,000 races each, default Payback 85):
the best bet on any card returned at most 0.89 of its stake, no bet returned more than its stake, and the average bet
returned about 0.75. **The house keeps an edge whichever runner the player backs.** A runner too likely to win or
place to be priced at your Payback is not offered for that bet ("win only" on the card).

The form figures are the runners' real placings, run by the same model, and they carry on from the races the
player watches. Over the same 60 cards the favourite won about 38% of races, a runner priced 8/1 or longer won about
10%, about 14% of races were decided by a head or less (a photo), and the lead changed hands about 3.6 times a race.

## Installing

Copy the three files into `js/plugins` and add them in the Plugin Manager in this order, top to bottom:

1. `DerbyCore.js`: the stables, courses, race model and bookmaker
2. `DerbyDraw.js`: the drawing
3. `Derby.js`: the Open Race Meeting command and the scene

## Opening a meeting

Add the plugin command **Derby > Open Race Meeting** to an event:

| Argument | What it does |
| --- | --- |
| Races per visit | 1 to 5. The last race of a visit of two or more is the Derby. |
| Runners per race | 5, 6, 7, 8 or auto (6 to 8). Place pays the first two with 5 to 7 runners, the first three with 8. |
| Course | `kitchen`, `rockery`, `greenhouse`, `orchard`, `mossbank` or `auto`. |
| Going | `dewy`, `damp`, `dry` or `auto`. |
| Smallest stake (gold) | The first stake step. Below it the player is just watching. |
| Largest stake (gold) | The most the player may put on one race. |
| Stake step (gold) | How much left / right changes the stake. |
| Payback (%) | 50 to 100. Every price is set so a bet returns about this share of its stake over many races. |
| Variable: net winnings of the visit | Receives winnings minus stakes when the player leaves. |
| Meeting name | Shown on the race card. Blank names it after the course. |
| Seed | Blank keys the meeting to this map and event: the same stable every visit, its form carrying on. |

The event waits while the player is at the course, then continues.

**Fresh races after loading.** With this parameter on (the default), a race is drawn when the player arrives at the
course, so reloading a save and going back cannot replay a race whose winner the player already knows. With an
explicit Seed the races are fixed by the seed instead.

## Controls

- On the card: **up / down** choose a runner, **left / right** change the stake, **Shift** (or Q / W) switches
  between Win and Place, **OK** starts the race, **Escape** leaves.
- During the race: hold **OK** to watch at triple speed.
- **Mouse / touch**: click a runner, the Win / Place tabs, the − / + buttons, "Off they go!" and "Leave the course".

## Script call

```js
Derby.record("m3e12")   // { races, net, form } for that meeting so far
```

## Parameters

| Parameter | Default |
| --- | --- |
| Fresh races after loading | true |
| Sound: the off | Bell3 |
| Sound: the finish | Applause1 |
| Sound: a winning bet | Coin |
| Sound: card cursor | Cursor2 |

## Compatibility

Derby adds its own scene and replaces nothing. It extends one engine method, `Game_System.initialize`, calling the
original first, to create its save record (`$gameSystem._csafDerby = { v: 1, meetings: {...} }`). It draws no window,
so window skin plugins do not change it. Stakes and winnings use the party's gold.

## Terms

Commercial and non-commercial use in RPG Maker projects. See LICENSE.txt. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
