# Interchange — Octilinear Fast-Travel Diagram — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Interchange — Octilinear Fast-Travel Diagram  
**Engine:** Unity 6  
**Docs published:** 2026-09-07


---

# Interchange — Octilinear Fast-Travel Diagram

**Nodes and edges in, a printed transit diagram out.**

Interchange turns the fast-travel graph you already have into a drawn transit-style route map:
routes snapped to 45° angles, parallel bands where routes share a corridor, a capsule interchange
wherever two lines meet, terminus caps, every stop named, a legend and a title band.

It is not a minimap. A minimap is a picture of the world; this is a diagram of the **network** — the
same difference as between a satellite photo and a subway map.

---

## Install

Import the package. Everything lands under `Assets/CSAF/Interchange/`, in three assembly
definitions, with no `Resources/` folder and no package dependencies. Unity **2022.3 or newer**;
Built-In, URP and HDRP all work because the art path never touches a render pipeline.

## Quick start (about five minutes)

1. **Open the demo.** `Assets/CSAF/Interchange/Demo/Scenes/InterchangeDemo.unity` — press Play. It
   builds a 44-stop, 10-route invented realm and renders it. **R** re-renders, **D** walks discovery
   forward, **G** toggles the construction grid.
2. **Open the window.** `Window ▸ CSAF ▸ Interchange Diagram`. Press **Create a new network asset**,
   add stations and lines, and watch the preview. The preview is the real renderer at the real
   settings — what you tune is what you ship.
3. **Bake to PNG**, or call the renderer at runtime.

## From your own data

`InterchangeNetwork` is a plain `ScriptableObject` with public fields, precisely so you do not have
to re-author anything you already have:

```csharp
var net = ScriptableObject.CreateInstance<InterchangeNetwork>();
foreach (Region r in myWorld.Regions)
    net.Stations.Add(new InterchangeStation {
        Id = r.Key, Label = r.DisplayName, WorldPosition = r.MapPos, Discovered = r.Visited });
```

Then render:

```csharp
ResolvedNetwork? resolved = net.Resolve(out List<string> problems);
if (resolved == null) { Debug.LogError(string.Join("\n", problems)); return; }

DiagramResult sheet = DiagramRenderer.Render(resolved, 1800, 1200);
myRawImage.texture = sheet.Texture;      // you own the texture; destroy it when done
```

## Read this before you decide where to call it from

Interchange is a **software rasteriser**. It owns every pixel, which is what makes the output
identical on every machine and every render pipeline — and it means a sheet is paid for in CPU time.
Measured, mean of three runs each after a warm-up, on one desktop workstation:

| sheet | mean | range |
| --- | --- | --- |
| 900 × 600 | 0.79 s | 0.77 – 0.85 |
| 1200 × 800 | 1.26 s | 1.18 – 1.33 |
| 1600 × 1067 | 2.06 s | 1.96 – 2.20 |
| 1920 × 1280 | 2.87 s | 2.73 – 2.96 |

Roughly **a fixed 0.15 s for the layout solve plus about 1.1 s per megapixel** of drawing. The high
figures are observations, not a ceiling.

**So bake, do not stream.** Render on a screen transition, when a save loads, or when discovery
actually changes, then keep the texture until the data moves. For most games that is one render per
session. Or bake to PNG in the editor and ship the image, which costs a player's machine nothing.

## Discovery state

Set `InterchangeStation.Discovered = false` and the stop is drawn in the unvisited treatment — a
held-back mark and a lighter name — so one asset renders a player's *current* knowledge of the
network rather than the designer's complete one. The title band counts it for you.

## Reading the counts

Both reports carry counts rather than a verdict, so you can check them. `LayoutReport` gives how
many edges came out **exactly** octilinear (on an integer grid this is an exact test, not a
tolerance), bends, octant changes and the final objective value. `RenderReport` gives routes
stroked, marks drawn, interchanges among them, names struck, names given a reserve plate, and names
the face could not strike.

If `LabelsRefused` is above zero, a station name used a character the face does not carry. Names are
refused **whole** rather than partially struck — a silently misspelt name is worse than a missing
one.

## Full documentation

`Assets/CSAF/Interchange/README.md` inside the package, and the online copy linked from the store
listing.

---

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved.
Licensed under the terms in `LICENSE.txt`.

*Built with AI assistance: code yes, graphics yes (all art is generated procedurally by this
package's own code), sounds no, text and dialog no.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
