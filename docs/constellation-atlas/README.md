# Constellation Atlas — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Constellation Atlas  
**Engine:** Unity 6  
**Docs published:** 2026-08-23


---

# Constellation Atlas

**Your progression screen, drawn as a star chart — computed from your own chart data, not assigned
to it.**

You never pick art for a node. You write down what the node *is* — an id, a house, a tier, what it
depends on — and the Atlas derives the star: which of forty hand-authored stellar forms it takes,
how bright it burns, what colour it is, where it sits, and which constellation figure it joins. Edit
the data and the sky redraws. There is no sprite sheet, no atlas and no PNG anywhere in this
package.

---

## The five-minute version

1. Open `Assets/CSAF/ConstellationAtlas/Demo/ConstellationAtlasDemo.unity` and press **Play**.
   Click a star that is offering itself — the one wearing a ring — and watch the sky redraw with its
   constellation figure lit.
2. Open **Window ▸ CSAF ▸ Constellation Atlas**. Drag a chart in, press **Preview**.
3. Make your own: **Assets ▸ Create ▸ CSAF ▸ Constellation Atlas ▸ Atlas Chart**.

That is the whole product. Everything below is detail.

---

## What you author

A chart is a list of nodes and a list of houses. Here is a complete, working one:

```csharp
chart.Houses = new List<AtlasHouse> {
    new AtlasHouse { Key = "ember", DisplayName = "The Forge",
                     SpectrumName = "Ochreous", Family = FormFamily.Radiant },
    new AtlasHouse { Key = "frost", DisplayName = "The Long Cold",
                     SpectrumName = "Vesper",   Family = FormFamily.Cardinal },
};

chart.Nodes = new List<AtlasNode> {
    new AtlasNode { Id = "ember_spark",   DisplayName = "Spark",   House = "ember", Tier = 1 },
    new AtlasNode { Id = "ember_bellows", DisplayName = "Bellows", House = "ember", Tier = 2,
                    Requires = { "ember_spark" } },
};
```

**There is no art field in there, and that is the point.** `Demo/SampleChart.cs` is the same thing
at full size — thirty-four nodes across five houses — and it is worth reading as the API
documentation, because it is the entire authoring surface on one screen.

| Field | What it decides |
| --- | --- |
| `Id` | Which of the eight forms in its family the node draws, plus its rotation and its wobble |
| `House` | Its spectrum (colour), its form family, and which constellation it belongs to |
| `Tier` | Its magnitude — size, reach, spike length and brightness — normalised against your chart's own highest tier |
| `Requires` | The figure lines. A constellation's shape **is** its dependency graph |

Four optional fields exist for when derivation is not what you want: `FormId` pins a specific
stellar form, `Position` plus `PinPosition` pins a node's place, `SpectrumName` on a house overrides
its colours, and `SkyAngle` puts a house where you want it in the sky.

**Undeclared beats mis-declared, deliberately.** A house you never declare is derived from its key,
so a chart with zero house declarations still comes out with distinct constellation languages. A
house you *do* declare with a spectrum name that does not exist falls back to a stated default
rather than deriving one — because "absent" and "wrong" are different problems and quietly treating
a typo as a design decision is how a bug survives to ship.

---

## What it draws

**Forty stellar forms, in five families of eight.** Every form is written against the same six
colour roles and the same four-call light language (`StarKit`), which is why forty independently
authored shapes read as one sky.

| Family | Character | Use it for |
| --- | --- | --- |
| **Cardinal** | Point stars defined by spike geometry — sharp, martial | The family that survives smallest; good for wide, shallow trees |
| **Radiant** | Corona-dominant, broad and warm | High-tier capstones; reads best at magnitude |
| **Companion** | Binaries, clusters, occultations | Nodes that are a pair, a choice, or a chain |
| **Nebulous** | Soft, gaseous, no hard edge | Mystery, depth, anything "unknowable" |
| **Sovereign** | Rings, gates, frames — architectural | Rank and consequence |

**Ten houses**, each built on a real stellar spectral class rather than a hue rotation of one
scheme: Azimuth (O), Vesper (B), Lumen (A), Meridian (F), Aurelian (G), Ochreous (K), Cinder (M),
Verdance, Amaranth and Argent.

Forty forms across ten houses is **four hundred distinct star marks** before magnitude and state
are applied, and each one is drawn at run time from your data.

**Three states, one object.** `Dark`, `Reachable`, `Kindled` are the same star restated — a dark
node keeps its body and loses its fire; a reachable one gains a ring. They are not three drawings,
which is why they can never drift apart.

---

## Using it in your game

```csharp
var view = gameObject.AddComponent<AtlasView>();
view.Chart = myChart;
view.NodeClicked += (id, state) => Debug.Log(id + " is " + state);
view.Rebuild();

// Later, when the player spends a point:
view.TryTake("ember_bellows");   // refuses unless the node is Reachable; re-renders when it is not
```

`AtlasView` puts the texture on a `Renderer`, a `SpriteRenderer` or a `RawImage`, whichever it finds.

**It deliberately does not own your progression rules.** It renders a chart against an
`AtlasProgress` and raises events. Whether a click may spend a point, what a point costs, and where
progress is saved all belong to your game. The one rule it does enforce is refusing a node that is
not reachable, because that is the rule the picture is already telling the player.

### One star on its own, for a hotbar or a tooltip

```csharp
Texture2D icon = StarComposer.Render(chart, node, StarState.Kindled, 128);
```

Same code path as the sky, so a hotbar icon and the chart are guaranteed to be the same picture
after a designer edits the data — which is exactly what a folder of pre-drawn PNGs cannot promise.

### Baking to disk

**Window ▸ CSAF ▸ Constellation Atlas** bakes the whole sky as one PNG, every node as its own
sprite in all three states, or the forty-form corpus sheet. Bake if you want the art as static
assets; you do not have to — rendering at run time needs no baked files at all.

---

## Performance, honestly

Rendering is CPU-side and deterministic. A thirty-four node sky at 1600×900 takes on the order of a
second on a desktop; a hundred-and-thirty-node sky at 2200×1300 takes several. **That is a screen
you build when it opens, not something you run every frame** — which suits a progression screen,
and is why `AtlasView.Rebuild()` is an explicit call rather than an `Update` loop.

If you need it instant, bake the sky to a PNG with the Atlas window and ship that; the run-time path
is then only for the star sprites, which are small.

**Memory:** star tiles are rasterised at 4× supersample and are small and short-lived. The sky
itself composites at 1:1 and antialiases its own lines analytically, specifically so a full-size
field does not allocate the half-gigabyte of accumulators a supersampled one would.

---

## What is in the package

```
Runtime/Core/     Hash, Ink (the rasteriser), Spectrum (the ten houses)
Runtime/Star/     StarForm, StarKit, the five form files, StarFormLibrary, StarComposer
Runtime/Model/    AtlasNode, AtlasHouse, AtlasChartAsset, AtlasProgress
Runtime/Sky/      SkyCanvas, SkyProjection, SkyComposer, AtlasStyle
Runtime/View/     AtlasView
Editor/           AtlasBakerWindow
Demo/             AtlasDemo, SampleChart, ConstellationAtlasDemo.unity
```

Every script is in a named, platform-constrained assembly definition, so nothing pollutes your
global assembly and the editor code is never compiled into your build. There is no `Resources/`
folder. The runtime assembly references nothing outside `UnityEngine` — not even uGUI, which
`AtlasView` reaches through reflection precisely so this package works in a project that does not
ship it.

**Unity 2022.3 or newer.** Render-pipeline agnostic: the art path is a software rasteriser, so
Built-in, URP, HDRP and any custom pipeline are all correct with no variants to maintain.

---

## Things worth knowing before you file a bug

- **Renaming a node's `Id` changes its star.** That is derivation working, not a fault. Pin it with
  `FormId` if you need it stable across a rename.
- **Adding a tier-6 node to a five-tier chart re-scales every magnitude**, because magnitude is
  normalised against your chart's own ceiling. That is usually what you want; if it is not, keep a
  ceiling node.
- **Appending a node never re-rolls its siblings.** Nothing in the derivation depends on a node's
  position in the list — layout sorts by id, and every hash is keyed on the node id alone.
- **A node that requires an id not in the chart draws as permanently dark.** The Atlas renders it
  rather than refusing, because a data typo should not give you a blank screen. Press **Check
  chart** in the Atlas window and it will name every one.

---

## Support

Questions, bugs and requests: reply on the store page you bought this from and it will reach us.
Include your Unity version and, where you can, the chart asset — most reports are answered fastest
by rendering the exact chart.

---

Constellation Atlas — Core Systems Asset Factory
Copyright (c) 2026 Core Systems Asset Factory. All rights reserved. See `LICENSE.txt`.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
