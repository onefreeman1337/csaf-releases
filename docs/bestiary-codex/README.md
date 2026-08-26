# Bestiary Codex — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Bestiary Codex  
**Engine:** Unity 6  
**Docs published:** 2026-08-26


---

# Bestiary Codex

**Illustrated creature pages, generated from the stat blocks you already have.**

Point it at your creature data and it composes a finished bestiary page: your own sprite mounted on
a designed plate, a threat rosette that changes shape with the tier, an elemental rose, a generated
habitat landscape behind the creature, a scale rule with a human figure for comparison, a wax
discovery seal, and a strip of trait glyphs chosen from your own trait words.

Nothing in this package is an imported image. Every mark is drawn in C# by a software rasteriser, so
it is pipeline-agnostic, deterministic and works headlessly.

---

## 1. Two minutes to your first page

1. **Window ▸ CSAF ▸ Bestiary Codex.**
2. It opens on a built-in sample catalogue of fourteen creatures. Click through them.
3. **Export PNG** writes the page you are looking at. **Export All** writes the whole catalogue.

Then open **Assets/CSAF/BestiaryCodex/Demo/BestiaryCodexDemo.unity** and press **Play**. Left and
Right arrows flip along the shelf. Every page there is composed at run time from the sample data.

---

## 2. Using your own creatures

You have two options, and the second one is the one most projects should take.

### Option A — the included catalogue asset

**Create ▸ CSAF ▸ Bestiary Codex ▸ Catalogue**, fill in entries, and drop it into the window's
object field. Fine for a small project or for trying the tool out.

### Option B — project your existing data (recommended)

Your project almost certainly already has a creature definition with fifty fields on it. Do not
migrate it. Write four lines that project it into a `BestiaryEntry` at call time and keep your own
type as the source of truth:

```csharp
using CSAF.BestiaryCodex;

CodexPage page = CodexComposer.Compose(new BestiaryEntry
{
    Id          = myMonster.guid,            // stable - derived choices hash off this
    DisplayName = myMonster.name,
    Element     = Element.Ember,             // map from your own damage type
    Habitat     = Habitat.Volcanic,
    ThreatTier  = Mathf.Clamp(myMonster.level / 5, 1, 10),
    Size        = SizeClass.Large,
    Discovery   = save.HasKilled(myMonster) ? Discovery.Slain : Discovery.Sighted,
    Traits      = myMonster.tags,            // your own words - see section 4
    Portrait    = myMonster.sprite,          // optional
});

myImage.sprite = Sprite.Create(page.Texture,
    new Rect(0, 0, page.Texture.width, page.Texture.height), new Vector2(0.5f, 0.5f));
```

`BestiaryEntry` owns no mechanics on purpose — no health, no damage, no loot, no capture rate. It is
the smallest thing that can describe a picture.

---

## 3. Where the text goes

**The page generates a name cartouche and a note plate. It does not draw letters.** Your font, your
localisation, your text pipeline — baking type into the texture would fight all three and force a
font licence into this package.

`page.NamePlate` and `page.NotePlate` are the rectangles to lay your own label over, **in pixels from
the top-left of the texture** (Unity UI convention, not texture convention — the flip is already done
for you). `CodexShelf.cs` in the demo does exactly this with a stock `TextMesh`; copy from there.

---

## 4. Your own words always win

`Traits` is matched **whole-word** against a lexicon of 48 trait glyphs before anything is derived.
Write `"venomous"` and you get the venom glyph. Write `"armoured plates"` and you get the plated
scute.

Matching is whole-word on purpose: `charcoal` will never claim `coal`, and `lapwinged` will never
claim `wing`. A confidently wrong glyph is worse than a derived one, because you can see it is wrong.

When your words say nothing about a family, the page derives a glyph from the creature's `Id` so the
page is always complete — including for a creature you have only half filled in. **The editor window
lists every glyph with the word that selected it, or marks it derived**, and the page itself repeats
the distinction with a lit or unlit stop beside each glyph.

---

## 5. What is generated

| | count | driven by |
| --- | --- | --- |
| Trait glyphs, in 8 families of 6 | **48** | your `Traits`, then the `Id` |
| Threat rosettes — ten different **shapes**, not one shape with a counter | **10** | `ThreatTier` |
| Elemental roses — ten different **shapes**, not ten colours | **10** | `Element` |
| Discovery seals, stamped into one wax blank | **12** | `Discovery` |
| Habitat bands — generated landscapes | **12** | `Habitat` |
| Scale-rule body plans | **4** | the chosen glyphs |
| Colour ramps | **10 element + 12 habitat** | `Element`, `Habitat` |

Crossed with the palettes, that is several hundred distinct rendered marks. A page for the same
creature is byte-identical on every machine and every run.

---

## 6. No art yet? The page is still complete

Leave `Portrait` empty and the plate renders a **generated field sketch** built from that creature's
own trait glyphs — plainly a diagram rather than a portrait, and honest about it. This is what makes
the tool usable on day one of a project, months before the creature art is drawn.

If you assign a sprite whose texture is not readable, the page falls back to the sketch and the
editor window tells you to tick **Read/Write Enabled** on its import settings.

An entry marked `Discovery.Unrecorded` renders **redacted** — an empty well with redaction bars.
Drawing a landscape and a creature for something the player has never seen would be the page telling
them what the fiction says they do not know.

---

## 7. Bake, don't generate at runtime

Composing a page costs roughly a tenth of a second on a desktop. That is fine for one page opened on
demand. It is **not** fine for a forty-creature grid that fades in.

Use **Export All** once, in the editor, and ship ordinary PNGs you can atlas, compress and address
like any other art. Runtime generation is fully supported and is what the demo scene does, but it is
the exception rather than the default.

---

## 8. Requirements and layout

- **Unity 2022.3 or newer.** Built-in, URP and HDRP — there is no shader and no material in the art
  path, so there is nothing to be pipeline-specific about.
- Everything lives under `Assets/CSAF/BestiaryCodex/`.
- Three assemblies: `CSAF.BestiaryCodex.Runtime`, `.Editor` (Editor-only) and `.Demo`. No
  `Resources/` folder — nothing here is forced into your build.
- The demo and its scene can be deleted once you have looked at them.

---

## 9. Extending the corpus

The corpus is plain C#. To add a glyph:

1. Add an entry to the relevant `Forms*.Build()` array with an id, a display name and its selecting
   words.
2. Write the draw method. **Lead with a large filled shape** and put it through `GlyphKit.Plate` —
   the header of `GlyphKit.cs` explains why thin strokes read as bent wire, and it is the single most
   expensive lesson in this codebase.
3. Whole words only in the lexicon, and prefer specific phrases: multi-word entries beat single words.

Adding a glyph to an existing family costs nothing. Adding a ninth **family** is a real design change
— the composer draws at most one glyph per family, so every family added is one more thing every page
shows at once.

---

## 10. Honest limits

- **It does not draw your creature.** It draws the page around it. If you want generated creature
  art, this is not that product.
- **It does not manage collection, capture or encounter mechanics.** If you need those, tools that
  sell exactly that plumbing already exist and this is designed to sit alongside one rather than
  replace it.
- The scale rule compares against a human figure at a fixed height, and a Colossal creature is
  allowed to run off the top of the rule. That is informative, not a bug.

---

## 11. Support and licence

Bug reports and feature requests are welcome through the store page you bought this on.

Licence: see `LICENSE.txt`. In short — unlimited projects, commercial or free, no royalties, and
**the generated pages are yours**, with no attribution required, anywhere your game or its marketing
appears. You may not resell or redistribute the tool itself.

**AI disclosure:** the code and the generated graphics in this package are AI-written. There are no
audio assets, and no authored narrative text beyond the sample catalogue's field notes.

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
