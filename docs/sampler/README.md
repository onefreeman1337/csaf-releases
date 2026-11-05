# Sampler: Picross Cross-Stitch Minigame for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Sampler: Picross Cross-Stitch Minigame for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/sampler  
**Docs published:** 2026-11-05


---

# Sampler for RPG Maker MZ

**Picross for your game, finished as needlework.** The player fills a chart from the number clues along its rows and
columns: each number is a run of stitches, in order. When the chart is right, the stitches take their colours from
the centre out and the finished piece is set in an embroidery hoop as a cross-stitch sampler, inside a stitched
wreath, with a brass plaque.

Every puzzle is generated from a seed: the motif, its thread colours and the chart size (5, 10 or 15 stitches).
Nothing is loaded from an image file. You can also turn any icon in your own IconSet into a chart.

## Every puzzle is proven fair

Before the player sees a chart, a line-logic solver works it from the clues. Where the clues alone leave cells
undecided, a few stitches are given (sewn in from the start, and locked) until the solver completes the whole chart.
So every puzzle has exactly one answer and never needs a guess. Generated motifs are redrawn until no more than 8% of
the chart would need to be given.

Measured on the shipped generator: 480 generated charts across every size and form were each completed by line logic
from their clues and givens, and a brute-force count over 40 5 x 5 charts found exactly one solution for every one.

## Motifs

Generated motifs are four-fold symmetric, like real sampler work, in four forms: `star`, `medallion`, `lattice` and
`diamond`, each drawing its own structure (arm width and length, diagonals, rings, bands, studs) from the seed. Measured
over 300 seeds per form, the generator produced 552 distinct 15 x 15 charts and 146 distinct 10 x 10 charts.

Six thread palettes: `scarlet` (Scarlet and Gold), `indigo`, `forest`, `rose` (Rose Garden), `harvest` and `midnight`.

Every finished sampler is bordered with one of four stitched wreaths, chosen from its seed: `beads`, `garland`, `rope`
and `twin`. The wreath is stitched just inside the hoop and wraps round the motif without touching it.

While the player works, the chart is worked in a grey tacking thread, and given stitches are sewn in the palette thread
farthest from that grey, so they stand out. When the chart is right, every stitch takes its own colour.

## Installing

Copy the three files into `js/plugins` and add them in the Plugin Manager in this order, top to bottom:

1. `SamplerCore.js`: the generator and the solver
2. `SamplerDraw.js`: the drawing
3. `Sampler.js`: the Open Sampler command and the scene

## Opening a chart

Add the plugin command **Sampler > Open Sampler** to an event:

| Argument | What it does |
| --- | --- |
| Chart size | 5, 10, 15 or auto. |
| Motif form | `star`, `medallion`, `lattice`, `diamond` or `auto`. |
| Threads | One of the six palettes, or `auto`. |
| Icon (optional) | 0 = a generated motif. Otherwise the chart is this icon from your IconSet (its shape), stitched in the nearest thread colours. |
| Switch: on when finished | Turned on when the chart is finished. |
| Variable: 1 finished, 0 left unfinished | Set when the player finishes or leaves. |
| Title | Shown on the pattern card and the plaque. Blank names it after the threads and the motif. |
| Seed | Blank keys the chart to this map and event: the same chart every visit. |

The event waits while the player works, then continues. If the player leaves an unfinished chart, the stitches are
kept and restored on the next visit. A finished chart reopens as its finished sampler.

## Controls

- **Arrow keys** move the needle. **OK** stitches (or unpicks) a cell. **Shift** marks a cell empty. **Escape** leaves.
- **Mouse / touch**: click to stitch, drag to stitch a run; right-click marks a cell empty (right-click outside the
  chart leaves).

Rows and columns whose stitches already match their clue are greyed out on the clue tape as the player works.

## Script calls

```js
Sampler.record("m3e12")    // { done, work } for that chart
Sampler.finishedCount()    // how many charts the player has finished
```

## Parameters

| Parameter | Default |
| --- | --- |
| Sound: a stitch | Cursor1 |
| Sound: a cell marked empty | Cursor2 |
| Sound: the sampler finished | Item3 |

## Compatibility

Sampler adds its own scene and replaces nothing. It extends one engine method, `Game_System.initialize`, calling the
original first, to create its save record (`$gameSystem._csafSampler = { v: 1, charts: {...} }`). It draws no window,
so window skin plugins do not change it.

## Terms

Commercial and non-commercial use in RPG Maker projects. See LICENSE.txt. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
