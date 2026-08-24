# Synthesis Web — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Synthesis Web  
**Engine:** Unity 6  
**Docs published:** 2026-08-24


---

# Synthesis Web

**Crafting screens your project draws from its own recipe data.**

Point it at your recipe table and it draws the whole thing: every reagent, every result, every
connection. There is no atlas, no sprite sheet and no imported texture anywhere in the art path —
each mark is rasterised from your data at the moment it is drawn.

The point is not that it saves you finding icons. It is that the icons **relate to each other**.
Smelt copper ore with coal and the ingot comes out copper-coloured with a dark inlay struck into it,
because the recipe says so. Change the flux and the inlay changes. Add a reagent and the mark gains
an ornament. A pack of five hundred hand-drawn icons cannot do that, because the pictures in it do
not know the recipes exist.

---

## 60-second start

1. Open `Assets/CSAF/SynthesisWeb/Demo/SynthesisWebDemo.unity` and press **Play**.
   Everything you see is generated at runtime from `SampleEconomy.cs`.
2. Open **Window → CSAF → Synthesis Web Baker**, press **Load Sample Economy**, and read the
   *"Why each mark looks the way it does"* list under the preview.
3. Replace the sample graph with yours:

```csharp
var graph = new SynthesisGraph();

graph.AddSource("copper_ore", "Cuprous");
graph.AddSource("coal",       "Lithic");

// Declare only what it is MADE FROM. Material, silhouette, inlay and ornament count are derived.
graph.AddRecipe("copper_ingot", "Copper Ingot",
                new Reagent("copper_ore", 3),
                new Reagent("coal", 1));

var view = GetComponent<SynthesisView>();
view.Graph   = graph;
view.FocusId = "copper_ingot";   // draw only what produces this. Empty draws everything.
view.Rebuild();
```

`view.Texture` is a plain `Texture2D`. Put it on a `RawImage`, a UI Toolkit background, a quad, a
sprite — or just save it.

---

## What is derived, and from what

| The mark's… | comes from |
| --- | --- |
| **Material** | the reagent consumed in the greatest quantity. Ties break on the order you authored, never on a hash — so renaming an unrelated node cannot change this |
| **Inlay** | the highest-ranked reagent whose material *differs* from the primary. A single-material recipe gets no inlay at all, because an inlay in the host's own colour is invisible |
| **Silhouette stage** | process depth — how many steps from a raw source. Raw → Dressed → Refined → Component → Assembly, plus Essence for non-solid classes |
| **Finished-good shape** | whether anything *consumes* it. Nothing does ⇒ it is a finished good, whatever its depth says |
| **Form** | **your own words first.** A node whose id or label contains `blade`, `ingot`, `gear`, `lantern`… is drawn as that thing. Only when nothing matches does it derive one from the stage |
| **Ornament count** | how many distinct reagents the recipe consumes |
| **Lustre** | the node's `CraftState` — `Unknown`, `Known`, `Craftable` |

Every one of those decisions is reported back to you in plain English, per node, in the baker
window and on `MarkDerivation.Explain`. If you disagree with a derivation, override it: `Material`,
`StageOverride` and `FormOverride` on any node win outright.

---

## What ships

- **48 authored silhouettes** across 6 process stages
- **10 material spectra**, each a six-role scheme rather than a hue rotation
- **3 progression states**, which are the same mark restated rather than three drawings
- A layered graph layout with crossing reduction, and `AncestryOf` for focused views
- An editor window that previews, explains and bakes every mark to PNG
- A demo scene, full XML docs on the public API, and readable source throughout

**No `Resources/` folder. No prefabs, no canvases, no shaders, no package dependencies.**
Everything is in a platform-constrained assembly definition, so nothing touches your global
assembly or your build size.

---

## Requirements and compatibility

- **Unity 2022.3 or newer** (built and gate-tested on 6000.5.7f1)
- **Every render pipeline** — Built-in, URP, HDRP and custom. The art path is a software
  rasteriser: there is no shader in this package, so there is nothing to break when you switch
- **Every platform.** It is CPU-side `Color32` work with no graphics device required, which is
  also why it runs in batch mode and in CI
- **No dependencies.** The runtime assembly definition's reference list is empty

### Performance, measured

Marks are drawn at 4× supersampling into small square tiles and composited onto the plate at 1:1.
A whole web is built once and cached as a `Texture2D`; nothing redraws per frame. Rebuild only when
the data changes — `SynthesisView.Rebuild()` destroys the previous texture before assigning the new
one, so a view rebuilt on every craft does not leak.

For a very large economy, prefer `FocusId` over drawing everything. That is not only a performance
note: a graph of several hundred recipes drawn at once is not a picture anyone can read, and
"what goes into *this*" is the question a crafting screen exists to answer.

---

## Extending it

- **A new material** is one entry in `MaterialSpectrum.All`. Every one of the 48 forms paints into
  its six roles, so a new material immediately works with all of them.
- **A new silhouette** is one method plus one line in a `Forms*.Build()` array. Draw through
  `MarkKit` — it owns the light direction, the outline weight and the inlay treatment, which is
  what keeps independently-authored forms looking like one set.
- Light comes from the **upper left**, always. It is stated once in `MarkKit` and no form overrides
  it; a consistent light direction is most of what makes a drawn mark read as a solid object.

---

## Support

Questions, bug reports and requests for additional material classes or silhouettes are welcome.
Include your Unity version and, where you can, the recipe rows that produced the mark you are
asking about — the derivation is deterministic, so the same rows reproduce it exactly here.

---

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
