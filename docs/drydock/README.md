# Drydock - the loadout schematic sheet — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Drydock - the loadout schematic sheet  
**Engine:** Unity 6  
**Docs published:** 2026-09-06


---

# Drydock — the loadout schematic sheet

**Drydock draws a technical schematic of the player's craft from your own parts list.** A blueprint
ground, the hull in silhouette, one drawn fitting per hardpoint with a leader line and a callout, a
ruled frame with zone marks, and a filled title block with a struck approval stamp. One distinct
sheet per configuration, composed at runtime.

You write no drawing rules. You hand it a list of parts.

---

## What you get

- **47 separately authored part silhouettes** — hulls, propulsion, power, weapons, protection,
  sensors, utility and structure. Every one is drawn in code as a signed-distance field; the package
  ships **zero image files**.
- **8 drafting stocks** — cyanotype, whiteprint, vellum, linen, mylar, kraft, phosphor and amber.
  Each is a complete re-colour of the whole sheet, not a tint: on a cyanotype the line is *white*,
  because a cyanotype is a photographic negative.
- **A composer** that lays out the frame, the title block, the callout columns and the leader fan.
- **An editor window** (`Window ▸ CSAF ▸ Drydock`) to preview a sheet and save it as a PNG.
- **A demo scene.** Open `Demo/Scenes/DrydockDemo.unity` and press Play.

## Quick start

```csharp
using CSAF.Drydock;

Loadout l = Loadout.Empty("KESTREL III", "Interceptor", Stock.Cyanotype);
l.SheetNumber = "DK-114";
l.Revision    = "C";

l.Fittings.Add(new PartFitting { Name = "Ion Thruster", Station = "AFT 1", Spec = "2.4 GW", Grade = 4 });
l.Fittings.Add(new PartFitting { Name = "Railgun",      Station = "SPINE", Spec = "88 MJ",  Grade = 5, Revised = true });
l.Fittings.Add(new PartFitting { Name = "Radiator Fin", Station = "PORT",  Spec = "1.2 MW", Grade = 5, IsContext = true });

Texture2D sheet = DrydockSheet.Compose(l, 1024, 720);
```

That is the whole API surface you need.

## How your data reaches the drawing

Four independent columns reach four independent properties of the sheet. That is deliberate — if
they all keyed on one field, a high-grade loadout would simply look *more* rather than look
*different*.

| Your field | What it changes |
| --- | --- |
| `Name` | **Which silhouette is drawn.** Matched WHOLE-WORD against the corpus, so "Mk II Ion Thruster" finds the ion drive. Also sets the part's scale, so two parts of the same grade are not stamped copies. |
| `Grade` | **How busy the silhouette is** — barrels on a mount, cells in a bank, fins on a radiator. Clamped to 3–8. Leave it 0 and you get the middle of the range, not the minimum. |
| `IsContext` | **Subject or surroundings.** Context is drawn lighter, exactly as reference structure is on a real drawing: no rim highlight, softer shadow, body drifted toward the sheet — but still fully outlined, because a phantom line is lighter and never absent. |
| `MountDegrees` | **The mounting angle.** A thruster raked off the keel is drawn raked, and opposed fittings mirror instead of repeating. |

`Revised` flags a fitting as changed: its callout and leader are drawn in the stock's revision
colour.

### When a part name matches nothing

You get an **unspecified module** — a plain envelope box with mounting lugs and a data port — and
never a wrong part. This is a deliberate choice and it is worth knowing about:

- Picking a silhouette at *random* would draw a railgun for a part called "Coffee Urn". On a
  technical drawing, being confidently wrong is the worst failure available.
- Drawing *nothing* would leave the station empty, and an empty station means "nothing is fitted".

A generic module says exactly what is true: something is fitted, and this drawing does not know
what. Real drafting does the same thing — an unspecified bought-in part is drawn as an envelope box.

The demo ships a "Coffee Urn" on purpose so you can see the path.

## Notes worth reading before you integrate

- **`Spec` is a string, and that is deliberate.** A headline figure can be thrust, power, mass, a
  calibre, a Mark number or a percentage, and every one formats and localises differently. Drydock
  will not guess your locale. You format your own figure.
- **`Loadout` talks to nothing.** No inventory asset, no ScriptableObject base class, no save
  system. It is a plain struct and a `List<>`. Fill it from whatever you already have.
- **`ComposePixels` is safe off the main thread**; `Compose` is not, because it allocates a
  `Texture2D`. Bake on a worker, upload on the main thread — a sheet composes when a refit screen
  opens, which is a frame the player is watching.
- **The same loadout always composes the same pixels.** Nothing here reads `UnityEngine.Random`.
- **A sheet annotates up to 10 fittings.** Hand it more and it draws the first ten — and the title
  block prints the true total with "(N SHOWN)", so the drawing never misrepresents the loadout.
- **Call `Corpus.Warm()` from a loading screen** if you want corpus validation to happen there
  rather than the first time a sheet composes.

## Requirements

- Unity 2022.3 or newer. Built against **Unity 6000.5.7f1**.
- No render-pipeline dependency — the demo draws with `OnGUI`, so it opens identically on Built-in,
  URP and HDRP.
- No third-party packages.

## Layout

```
Runtime/
  Core/     Hash, Ink (the software rasteriser), DrydockPalette, Words
  Mark/     GlyphKit (the shape vocabulary), Mark, GlyphContext, Corpus, Marks*.cs (the 47)
  Model/    Loadout, PartFitting, Derive
  Sheet/    SheetLayout (one geometry), DrydockSheet (the composer)
  Type/     Letterforms, TypeSetter
Editor/     DrydockWindow
Demo/       DrydockDemo + scene
```

Every script sits in a named, platform-constrained assembly definition. There is no `Resources/`
folder — Drydock adds nothing to your build that you do not reference.

## Extending it

The source ships raw and the licence permits adding your own marks. Add a `Mark` to any
`Marks*.cs`, give it selector words your project's part names actually contain, and it is reachable
immediately. Two rules the corpus enforces at startup, both of which will throw rather than fail
quietly:

1. **A selector word must be a single run of letters and digits.** The tokeniser splits on
   everything else, so `"point-defence"` could never be produced from a buyer string and the mark
   would be unreachable through it.
2. **No word may be claimed by two marks**, or which one you get is a coin toss decided by
   dictionary ordering.

`Corpus.Count()` reads the real total. Nothing in this package quotes a corpus size it has not
counted.

---

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
