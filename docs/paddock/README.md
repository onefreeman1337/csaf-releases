# Paddock — Livery Generator — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Paddock — Livery Generator  
**Engine:** Unity 6  
**Docs published:** 2026-09-19


---

# Paddock - Livery Generator for Unity

Generates a designed racing livery for every car in your roster (scheme, team colours, a number roundel and
a universe of fictional sponsors) and paints it onto your OWN vehicle meshes by projecting it into their UVs.
A 20-car AI grid stops being one car in 20 tints.

Version 1.0.0 - Core Systems Asset Factory

---

## What you get

- **Twelve hand-authored scheme families** for the flanks: Twin Stripes, Chevron, Sash, Halves, Spear, Hoops,
  Arrow, Fade, Checker, Wave, Dazzle and Split. Each is drawn from a seed, so every team gets its own
  variation, and each has a matching roof and bonnet treatment (racing stripes, a centre band, a bonnet
  chevron, a checkered or dazzle rear deck, or a front/rear split).
- **Twelve curated motorsport palettes**, or your team's own two colours. The number's ink is chosen by
  WCAG contrast so it reads on its panel (at least 4.5:1 on every curated palette).
- **A sponsor universe.** Every championship generates its own fictional sponsors: names from a syllable
  grammar (sometimes with a trade word: OIL, TIRES, BRAKES...), one of nine drawn marks, and one of six decal
  styles (keylined italic, box, slant, tab, swoosh, split panel). Each team gets a title sponsor on the rear
  door and across the bonnet, plus minors on the sills and front wing. One tyre supplier appears on every car,
  and the series sponsor runs across every windscreen, so a grid reads as one championship.
- **Team-mates share a livery.** Cars with the same team name get the same scheme, colours and sponsors and
  differ only in their number. With twelve or fewer teams, every team gets a different scheme family.
- **Words read correctly on both sides.** The right flank is the left flank's shapes mirrored, and then the
  number and every sponsor are drawn onto it again the right way round. A single mirrored side design would
  print them backwards on one side of the car.
- **Painted onto your meshes.** Each triangle is rasterised in UV space and coloured from the view facing it
  (left flank, right flank, top, or the nose and tail). The result is an ordinary texture for your own
  material; the main texture slot is found by name (`_BaseMap` in URP, `_BaseColorMap` in HDRP, `_MainTex` in
  Built-in). Tested in the Built-in pipeline. Glass, tyres and trim on other submeshes are left alone.
- **It tells you when your UVs cannot work.** If both flanks share texels (mirrored UVs), the bake reports it
  in the window and in `BakeReport.HasMirroredUVs`, because one side's words would read backwards. It also
  counts texels where two different parts of the body overlap in UV space.

Nothing in the package is an image file, a model file or a font: every livery is drawn by the C# in the
package, every letter and number is drawn as geometry, and the demo car is built by code.

---

## Quick start

1. Import the package. Everything lands under `Assets/CSAF/Paddock/`.
2. Open `Assets/CSAF/Paddock/Demo/Scenes/PaddockDemo.unity` and press **Play**: a 12-car starting grid,
   every car painted from one generated championship. **N** draws a new championship, **Left / Right** walk
   the grid car by car, **Space** stops the camera orbit, **R** turns the roof number (left, right, front,
   none).
3. Open **Window > CSAF > Paddock** and press **Create a sample roster** (8 teams, 16 cars), or drag in your
   own roster asset (**Create > CSAF > Paddock Roster**). The garage below shows every car's left flank.
4. Select your car objects in the scene, set **Vehicle forward**, **Vehicle up** and **Body submeshes**, and
   press **Bake roster onto N selected object(s)**. Objects are taken in name order, one roster entry each.

---

## The roster

A `PaddockRoster` asset holds the championship:

| Field | What it does |
| --- | --- |
| Series Seed | A different seed is a different sponsor universe and a different draw of schemes and palettes. |
| Series Banner | Puts the series sponsor across every windscreen. |
| Roof Number | Which way the roof number reads: from the left, from the right, from the front, or none. |
| Entries | One per car: Team, Number (0-999), Use Team Colours + Primary + Secondary, Auto Scheme or a chosen Scheme, Variation. |

The FIRST car of a team decides that team's look. **Variation** re-rolls a team's shapes without changing
anything else.

---

## Baking in the editor

**Window > CSAF > Paddock** writes, for each selected object:

- `Assets/Paddock Bakes/<Team>_<Number>.png`, the baked livery texture;
- `Assets/Paddock Bakes/<Team>_<Number>_<submesh>.mat`, a copy of that submesh's material with the livery
  as its main texture (`_BaseMap` in URP, `_BaseColorMap` in HDRP, `_MainTex` in Built-in), assigned to the
  object with Undo.

**Export every car's views as PNG** writes each car's left, right and top views to
`Assets/Paddock Bakes/Views`.

Settings:

- **Vehicle forward / up**: the mesh's own axes. Most car models point their nose along +Z with +Y up; a
  model authored nose-to-+X needs Forward = +X.
- **Body submeshes**: comma-separated submesh indices that are painted body (usually `0`). Everything else
  keeps its material.
- **Beltline**: the top of the doors as a fraction of the body's height. The lower 65% of each flank view is
  laid over the body below it, so the scheme's main band and the door number land on the doors. -1 turns
  this off.
- **Texture size**: 256 to 4096.

## Baking at run time

Add **CSAF / Paddock Livery** to a car (it needs a `MeshFilter` and a `MeshRenderer`), give it a roster and
an entry index, and it bakes on Start. It sets the texture through a `MaterialPropertyBlock` per body
submesh, so a material asset shared by twenty cars is never repainted by one of them. In a player build the
mesh must have **Read/Write** enabled in its import settings; the component throws a message naming the mesh
if it does not.

From code:

```csharp
using CSAF.Paddock;

LiveryDesign[] grid = roster.Design();                      // or PaddockGrid.Design(entries, seed, true, RoofNumber.FromLeft)
LiveryViews views = Livery.Compose(grid[0]);                // left, right and top views
BakeReport report = GetComponent<PaddockLivery>().Bake(grid[0]);
if (report.HasMirroredUVs) Debug.LogWarning("this mesh's flanks share UVs");
```

`Livery.Compose`, `Sponsors.Universe` and `LiveryBaker.Bake` touch no Unity object, so they can run on a
worker thread. `PaddockLivery.Bake` and `Texture2D` work stay on the main thread.

---

## What your mesh needs

- **UV0 that does not mirror the flanks.** Each flank needs its own UV island, or its words cannot read
  correctly. Most game-ready car models already have this; models built for a single tiled texture sometimes
  do not.
- **The body on its own submesh(es)** if you want glass, tyres and lights left alone.
- The livery is placed by fractions of the body's box, laid out for a car whose wheels sit near 20% and 80%
  of its length. On a very different shape (a kart, a truck) the number and sponsors still land on the flanks,
  but may sit over a wheel arch.

## Limits, stated plainly

- The lettering is a Latin display face: A-Z, 0-9, space, `.`, `-`, `'` and `&`, with common accented Latin
  folded to its base letter. A sponsor name it cannot set is refused whole, never printed with letters
  missing.
- Generated sponsor names are nonsense words, and a list of well-known sponsor names is refused, but no
  generator can promise a nonsense word is nobody's trademark. Check any name you ship.
- The projection is planar per face direction, so a strongly curved panel stretches the design where it turns
  away from the view that paints it.

---

## Files

```
Assets/CSAF/Paddock/
  Runtime/   CSAF.Paddock.Runtime   (generator, sponsors, lettering, baker, roster, component, demo body)
  Editor/    CSAF.Paddock.Editor    (Window > CSAF > Paddock)
  Demo/      CSAF.Paddock.Demo      (PaddockDemo scene and script)
```

Unity 2022.3 or later. Built and tested on Unity 6000.5.

AI disclosure: the source code and the store images were produced with the assistance of AI. The liveries
are drawn by code in this package, not by an image model.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
