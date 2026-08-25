# Provenance (equipment & set atlas) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Provenance (equipment & set atlas)  
**Engine:** Unity 6  
**Docs published:** 2026-08-25


---

# Provenance Atlas

**Armoury plates your project draws from its own item data.**

Point it at your item table and it draws a plate for any piece of equipment: the motif for what that
thing actually *is*, the material it was made from, the ore or hide or salvage it traces back to, how
far along its upgrade line it sits, how much of its set the player is holding, and how many of its
sockets are filled. There is no atlas, no sprite sheet and no imported texture anywhere in the art
path — every plate is rasterised from your data at the moment it is drawn.

The point is not that it saves you finding icons. It is that the plates **know where things came
from**. Re-source a sword so it is forged from drowned coral instead of pit ore and its plate
changes — the silhouette shifts realm, the origin mark under it is repainted in the new material,
and the ancestry strip beneath re-draws itself. A pack of five hundred hand-drawn icons cannot do
that, because the pictures in it do not know your recipes exist.

---

## 60-second start

1. Open `Assets/CSAF/ProvenanceAtlas/Demo/ProvenanceAtlasDemo.unity` and press **Play**.
   Every plate on the wall is generated at runtime from `SampleArmoury.cs`. Page with
   **Left / Right** (or **A / D**).
2. Open **Window → CSAF → Provenance Atlas**, pick an item in the list, and read the derivation
   panel — it names *why* that plate looks the way it does, line by line.
3. Replace the sample catalogue with yours:

```csharp
using CSAF.ProvenanceAtlas;

var atlas = new ItemAtlas();

// Sources: raw things the world gives you. Material and origin are yours to name.
atlas.AddSource("pit_ore",     "Ferrous", "deep");
atlas.AddSource("coral_bloom", "Nacre",   "tide");

// Crafted things declare only what they are MADE FROM. Realm, motif, rarity and the
// whole ancestry strip are derived from that.
atlas.AddCrafted("iron_blade",   "pit_ore");
atlas.AddCrafted("tidecut_edge", "iron_blade", "coral_bloom");

var prov = new Provenance(atlas);
Texture2D plate = PlateComposer.Render(prov, atlas, "tidecut_edge", 640, 400);
```

That is the whole integration. `Provenance` indexes the catalogue once; `PlateComposer.Render` draws
any item in it.

---

## What is actually derived

Nothing on a plate is decoration chosen at random. Each element is a read of your data:

| What you see | Where it comes from |
| --- | --- |
| The **motif** | the item's realm — mined, grown, drowned, burnt, entombed, forged, aerial or blighted |
| The **plate colour** | the item's `Material` |
| The **origin mark** | the material of the thing it traces back to, which is why it is a different colour |
| **Ornament count** | rarity — more rivets, tines, chambers or rays as the tier climbs |
| The **ascent frame** | how far along its upgrade line the item sits |
| The **set rosette** | how many pieces of its set the player is holding |
| The **socket lattice** | `Sockets`, and how many are filled |

The corpus is **forty hand-authored silhouettes across eight realms**, five to a realm. They are
plain C# in `Runtime/Mark/Forms*.cs` — readable, editable, and yours to extend.

---

## Making it yours

**Pin anything you do not want derived.** Three fields on `ProvenanceItem` win outright over the
derivation, because a designer who has made a decision should not be quietly overruled:

```csharp
var item = atlas.Find("tidecut_edge");
item.Material        = "Nacre";      // forces the plate colour
item.FormOverride    = "tide.nautilus";  // forces the motif
item.RarityOverride  = 4;            // forces the ornament count
```

An override that does not resolve falls back to the derived value rather than throwing — a typo
costs you a wrong picture, never a broken armoury screen.

**Add your own motifs.** Copy any `Runtime/Mark/Forms*.cs`, write your draw methods against the same
`PlateKit` primitives, and add your `Build()` call to `PlateCorpus`. Two rules the shipped corpus
follows and yours should too: lead with a large filled shape (thin-stroke motifs stop reading at
small sizes), and route every wobble through `c.Rand(salt)` so a given item always draws identically.

**Use it as a ScriptableObject instead of code.** `ItemCatalogue` is a `ScriptableObject` with
`Items`, `Sets` and `HeldForPreview` lists; `FillWithSample()` populates it, and `ToAtlas()` hands
you the same `ItemAtlas` the code path uses. Drop one on the demo's `ArmouryWall` component to drive
the wall from an asset.

---

## Baking to PNG

The editor window bakes plates to disk when you want them as ordinary textures — for a UI atlas, a
wiki, or a store page. It writes only `.png` files, only into the folder you nominate, and only
names taken from your item ids. It never touches a scene, a prefab, or a file it did not create.

A bake overwrites a previous bake of the same name. Commit before baking over hand-edited art.

---

## Requirements and footprint

- **Unity 2022.3 or newer.** Built and gated against Unity 6 (6000.5).
- **No package dependencies.** No uGUI, no TextMeshPro, no URP requirement — the demo draws with
  `SpriteRenderer` and an orthographic camera deliberately, so the scene opens in any project.
- **No `Resources/` folder**, so nothing here is forced into your build.
- Three assemblies, each in a named `.asmdef`: `Runtime`, `Editor` (editor-only), and the demo.
  Delete the `Demo` folder once you have read it and nothing else breaks.
- **No network calls anywhere.** Identical output offline, and identical output on every machine —
  every jitter is seeded from the item's own id.

---

## Support and licence

Licence terms are in `LICENSE.txt` beside this file. The short version: use it on unlimited
projects, keep 100% of your revenue, and **the artwork it generates for you is yours** — ship it in
your game, its trailer and its store page with no attribution. Do not resell the tool itself, or the
generated plates as a standalone art pack.

**AI disclosure:** the source code and the store imagery were produced with AI assistance, declared
truthfully on every storefront. The plates themselves are **not** generated by an image model —
they are drawn in code by the software rasteriser in this package, from silhouettes you can read and
edit. There is no diffusion model and no network call in the art path.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
