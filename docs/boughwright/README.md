# Boughwright — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Boughwright  
**Engine:** Unity 6  
**Docs published:** 2026-08-22


---

# Boughwright

**Procedural skill-tree art. Every node draws its own mark from its own data — no icon pack required.**

Copyright (c) 2026 Core Systems Asset Factory. Licence: see `LICENSE.txt`.

---

## What this is, and what it is not

Every skill-tree asset on the market builds the *wiring*: nodes, edges, prerequisites, unlock state.
They all then ask you for sprites. **The sprites are the part that costs money and time**, and a
hundred-node tree needs a hundred of them that look like they belong together.

Boughwright is the other half. You give it a node's `id`, `branch` and `tier`; it gives you back a
struck emblem — plate, field, motif, tier frame, state treatment — drawn in code, and it derives the
choice so that **every node on a branch is visibly kin and no other branch looks like it**.

It is not a tree builder. It has a small layout and a demo view so you can see the art in context,
but it is designed to sit alongside whatever tree system you already use, or none.

---

## Ten-second start

1. Open `Assets/CSAF/Boughwright/Demo/BoughwrightDemo.unity` and press **Play**.
2. Click any available node. Marks regenerate as state changes.
3. Open `Demo/BoughwrightDemo.cs` and change `"war"` to `"wild"` on one node. Press Play again — that
   node's mark is now from a different family, and it still belongs to the tree.

Nothing to import, no atlas, no setup step.

---

## The corpus

| | |
| --- | --- |
| Hand-authored motifs | **48**, in 8 families of 6 |
| Palettes | **10**, each a six-role scheme rather than a hue rotation |
| Tiers | **4**, cumulative frame ornament |
| States | **3** — locked, available, owned |

That is **5,760 distinct mark renderings**, and none of them is a PNG this package ships. Every one
is drawn at request time by `Ink`, a supersampled software rasteriser included in the source.

**Families:** `Blade` · `Ward` · `Arcana` · `Verdure` · `Beast` · `Forge` · `Vital` · `Lore`.

Pick a family per branch and the branch reads as one hand. `Verdure` and `Beast` are the two
asymmetric families — use one of them on a branch when a tree of heraldic marks starts to feel like
a stamp sheet.

---

## How a mark is decided

```
node.MotifId set?      -> that motif, exactly.
otherwise              -> a motif from the branch's family, chosen by a stable hash of node.Id
node.PaletteName set?  -> that palette
otherwise              -> the branch's palette; and if the branch is undeclared, one derived from
                          the branch key, so a tree that declares nothing still gets distinct branches
node.Tier              -> plate ornament, 1..4. Tier does NOT change the motif.
state                  -> locked mutes toward the plate and adds a bar; available adds an accent
                          halo; owned adds a filled seal at the foot
```

Two properties worth knowing because they will bite otherwise:

- **It is deterministic and platform-independent.** The same node yields byte-identical art on every
  machine and every run. The hash is FNV-1a, not `string.GetHashCode()`, which .NET randomises per
  process.
- **Renaming a node's `id` changes its mark.** That is the design — the art follows the data. If you
  need a mark pinned across a rename, set `MotifId` explicitly on that node.

---

## Using it

### Runtime

```csharp
Texture2D tex = MarkComposer.Render(tree, node, NodeState.Available, 128);
```

Or resolve the decision without drawing, which is cheap and pure:

```csharp
MarkPlan plan = MarkComposer.Plan(tree, node, NodeState.Owned);
```

### Baking to assets

`MarkBaker.BakeTree(tree, folder, size, state)` writes one `.png` per node into your project and
returns a report with counts — written, skipped, and how many explicit `MotifId` values failed to
resolve. Bulk writes are wrapped in `StartAssetEditing`/`StopAssetEditing`.

Baked marks are ordinary textures. Use them in uGUI, UI Toolkit, sprites, materials, anywhere — and
hand them to an artist to overpaint if you want. See `LICENSE.txt` clause 2.4: **the generated
artwork is yours.**

---

## What ships

```
Assets/CSAF/Boughwright/
  Runtime/  Mark/   Ink · Palette · Hash · Motif · MotifLibrary · Motifs*(the corpus) ·
                    Plate · MarkComposer
            Model/  SkillNode · BranchStyle · SkillTreeAsset
            View/   TreeLayout
  Editor/           MarkBaker
  Demo/             BoughwrightDemo.unity · BoughwrightDemo.cs
```

Three platform-constrained assembly definitions, editor code confined to `Editor/`, and no
`Resources/` folder. The source is raw and commented — you are meant to read it, and the motif files
in particular are meant to be edited.

**Render-pipeline agnostic.** The art path is software, not shaders, so this is correct on Built-in,
URP, HDRP and any custom pipeline with nothing to configure.

**Unity 2022.3 or newer.** Built and verified against **6000.5.7f1**: zero errors and zero warnings
under `-warnaserror` with nullable reference types enabled.

---

## Adding your own motif

Open any `Motifs*.cs`, copy a neighbour, and register it. One rule, learned the hard way while
authoring the corpus:

> **Lead with mass.** A motif built from thin strokes reads as bent wire at the size a node is
> actually seen at. Every motif that reads as an emblem starts with a filled shape — a polygon, a
> disc, a lens — with strokes used only for detail on top of it.

If you write a custom shape as a signed distance function, make sure it really is a *distance* —
`Ink` feathers its edge over one pixel of distance, so an implicit surface with a non-unit gradient
resolves as a blur rather than an edge.

---

## Support

Questions, motif requests and bug reports are welcome through the storefront you bought this on.

**AI disclosure:** this package's code and its store imagery were produced with AI assistance,
declared truthfully on every storefront. The marks themselves are **not** produced by an image
model — they are drawn in code from a hand-authored corpus you can read and edit, with no network
call anywhere in the art path.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
