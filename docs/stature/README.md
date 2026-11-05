# Stature - Taller Side-View Battlers From Your Own Sheets for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Stature - Taller Side-View Battlers From Your Own Sheets for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/stature  
**Docs published:** 2026-11-05


---

# Stature for RPG Maker MZ

**Taller side-view battlers from the sheets you already have.** MZ's side-view battlers are chibi: a big head on a short
body. Stature reads each actor's own side-view sheet once, when it loads, and gives the battle a taller copy. The body
between the neck and the feet is lengthened; the head and the feet are left exactly as they were. All 18 battle
motions are handled, and your image files are never changed.

No new art, no editing 54 frames per character by hand, no second set of sheets to keep in step with the first.

## How the taller copy is made

Stature finds the body once per sheet, on the standing frame (the middle frame of "wait"): the top and bottom of the
figure, the **neck** (the narrowest row between the head and the shoulders) and the **feet** (the bottom eighth of the
figure). It then lengthens only the band between the neck and the feet, by **repeating whole pixel rows** spread evenly
through the band.

- **No pixel is resampled or blended**, so nothing blurs and no colour is invented. Every row of the taller frame is a
  row of your original frame.
- Every cell grows by the same number of rows, and the figure keeps its feet on the cell floor, so MZ lines it up as
  before.
- **Poses that are not upright follow their own rule:** "dying" (on one knee) and "abnormal" grow by half as much;
  "sleep" and "dead" (lying down) are copied unchanged onto the taller cell's floor.
- The weapon an actor swings is raised with the hands, so it stays in the grip.

How much taller: the stature is a multiple of the figure's own height. **1.25** (the default) adds a quarter of the
figure's height; 1 changes nothing; 2 is the most. It works for any cell size, because the cell is read from the
sheet (its width divided by 9, its height by 6).

## Installing

Copy the two files into `js/plugins` and add them in the Plugin Manager in this order, top to bottom:

1. `StatureCore.js`: the pixel rules
2. `Stature.js`: the parameters and the battle

Turn side-view on (Database > System 1 > Side-view). That is all: every actor's battler is taller in the next battle.

## Parameters (Stature.js)

| Parameter | Default | Meaning |
| --- | --- | --- |
| Default stature | 1.25 | How much taller every side-view actor stands (1 to 2). An actor's tag wins. |
| Apply to | every actor | "every actor" uses the default for anyone without a tag; "tagged actors only" leaves untagged actors as they are. |

## Actor notetag

- `<Stature: 1.3>` this actor stands 1.3 times as tall (1 to 2).
- `<Stature: 1>` this actor keeps the original proportions.

A tall knight and a short halfling in the same party is one tag each.

## What it touches

- Your image files: never. The taller sheet is made in memory when the original loads, once per sheet and stature,
  and reused. Turn the plugin off and every battler is back as it was.
- Frame cost: the pixels of each sheet are read once, at load. During battle Stature reads no pixels at all (measured
  over 300 frames).

## The demo art

`Demo/img/sv_actors/` holds four side-view battler sheets drawn for this product (CSAF_Knight, CSAF_Mage, CSAF_Ranger,
CSAF_Cleric, in MZ's own 9 x 6 layout of 64 x 64 cells), and `Demo/img/battlebacks1/CSAF_Courtyard.png` with
`Demo/img/battlebacks2/CSAF_Curtainwall.png` is a courtyard battleback. The store images were taken with them. Copy
them into the same folders of your project to use them.

## Compatibility

Stature replaces nothing. It extends one engine method, `Sprite_Actor.prototype.updateBitmap`, calling the original
first and then swapping in the taller copy of the sheet the engine chose. Plugins that draw side-view actors their own
way (their own sprite class instead of `Sprite_Actor`) will not see the taller sheets. Put the two files below any
core-engine plugin in the Plugin Manager.

Tested in RPG Maker MZ's own runtime (the `rmmz_*.js` scripts) in a side-view battle, with the stock battlers and with
the demo cast. It has not been tested with every third-party battle plugin; if one clashes, tell us on the store page.

## Written with AI assistance

The code, the demo art, the store images and the cover were produced with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
