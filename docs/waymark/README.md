# Waymark (illustrated save-slot screen) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Waymark (illustrated save-slot screen)  
**Engine:** Unity 6  
**Docs published:** 2026-08-31


---

# Waymark

**Point it at a save file your game already has — where the player was, what chapter they were in,
who was with them, how far they had got and how long they had played — and it draws the finished
slot plate.** The location becomes a drawn landscape under its own sky, the chapter becomes a device
in a gilded roundel, the roster becomes a strip of busts, the playtime grows the frame's ornament
through six tiers, and the save's own clock and weather pick which of eight hours the whole scene is
lit by.

Nothing in that plate is a stored image. There is **no PNG, no atlas, no sprite sheet, no shader and
no material anywhere in this package**. It is all drawn in code, at runtime or in the editor, from a
corpus of **46 hand-authored marks** you can read and edit: 16 places, 12 chapter devices, 10 roster
busts and 8 stamps, across 8 hour palettes and 6 frame tiers.

**Waymark draws no text.** It ships no font, measures no string and renders no words. It draws the
picture and leaves the right-hand half of the plate readable, so your own `Text`, `TextMeshPro` or
IMGUI label sits over it with your fonts, your localisation and your rich text exactly as they are.

---

## 1. The five minutes that get you a save screen

1. Open **`Assets/CSAF/Waymark/Demo/WaymarkDemo.unity`** and press **Play**. It builds a save screen
   from the built-in sample saves, one plate per frame, and prints what it decided and how long each
   one took on your machine. Up and down arrows move the selection.
2. Open **Window ▸ CSAF ▸ Waymark**. Edit any field — location, chapter, party, time of day,
   progress, play hours — and the plate redraws. The panel underneath tells you which of *your own
   words* selected each mark and which fell through to a derived one.
3. Point it at your own save data. From your own code it is two lines:

```csharp
var rec = new SaveRecord {
    Slot = 1, Title = "Before the Gate", Location = "The Drowned Keep",
    Chapter = "The Crown", TimeOfDay = 18.5f, Progress = 0.62f, PlayHours = 41f,
    Party = new List<string> { "knight", "mage", "ranger" },
};
Texture2D plate = SlotComposer.Compose(rec);      // you own it; Destroy it when the slot goes away
```

`SaveRecord` is a plain serialisable class. Copy your own save metadata into it — it is deliberately
the shape a save file already has, so for most projects this is a field-for-field assignment.

---

## 2. What decides what

| What you give it | What it draws | If nothing matches |
| --- | --- | --- |
| `Location` | one of 16 drawn places, on a horizon | a place chosen by a stable hash of the record |
| `Chapter` | one of 12 devices, in a gilded roundel | a device chosen by the same stable hash |
| `Party` | up to 5 roster busts, in your own order | nothing is drawn |
| `Stamped` | one of 8 struck stamps | no stamp |
| `TimeOfDay` + `Weather` | one of 8 hour palettes | Morning |
| `PlayHours` | one of 6 frame tiers | tier 0 |
| `Progress` | the fill on the progress band | an empty track |

Matching is **whole-word and case-insensitive**, over every word in the field. `"The Drowned Keep"`
finds `keep`; `"keeper of the flames"` does not, and falls through to the derived choice. That is
deliberate — a substring match would let `keeper`, `keepsake` and `housekeeping` all draw a castle.

**Nothing ever fails to draw.** A save with no location, no chapter and no party still gets a
complete plate, because every choice has a deterministic fallback keyed on the record itself. The
same file draws the same picture every time your game runs.

`SaveKind.Empty` draws a panel, a frame and an empty roundel and **no landscape at all**. A picture
on an empty slot tells the player there is a file there, and being pretty is not worth being wrong.

---

## 3. Speed, measured rather than claimed

Every figure here is printed by the package's own test suite on the machine that ran it, and the
demo scene prints its own numbers live while it draws.

- A full-size **720x270** plate composes in **about 1 second** on the development machine.
- The demo scene composes **one plate per frame**, so a six-slot save screen appears immediately and
  fills in over the next six frames rather than freezing on load.
- The editor window composes at the size it displays, not at full size.

**Compose lazily and cache.** A save screen shows a handful of slots; draw the visible one, compose
the rest on demand, and keep the `Texture2D` until the slot changes. `Compose` returns a texture
**you own** — `Destroy` it when you are done with it.

---

## 4. Making it yours

Every mark is a small method in a file you can read. To add a place:

1. Open `Runtime/Mark/MarksPlace.cs`.
2. Add a `new PlaceMark("place.yours", "Your Place", Ground.Downs, words, (ink, c) => Yours(ink, in c))`.
3. Write `Yours` using `GlyphKit` — the same signed-distance vocabulary every shipped mark uses.

Two rules the shipped corpus follows, and both are there because breaking them was measured:

- **Lead with a large filled shape.** A mark made of thin strokes is a grey smudge at roundel size.
- **The `bounds` rectangle you hand `GlyphKit.Plate` must CONTAIN your shape.** `Plate` only
  rasterises inside it, so a rectangle that is too small silently draws a plausible *fragment* of
  what you meant, complete with a correct outline along the cut. Set
  `GlyphKit.AuthoringChecks = true`, draw your mark once, and read `GlyphKit.ClipReports` — it names
  any mark its own rectangle is cutting. Leave it off in play; it is an authoring aid.

---

## 5. What is in the package

```
Runtime/Core     Ink (the rasteriser), SlotPalette (the 8 hours), Hash
Runtime/Mark     GlyphKit and the four mark families
Runtime/Card     SlotComposer, SlotLayout, Vignette
Runtime/Model    SaveRecord, SampleSaves
Editor           the Waymark window
Demo             the demo scene and its component
```

Three assembly definitions, platform-constrained: `CSAF.Waymark.Runtime` ships everywhere,
`CSAF.Waymark.Editor` is Editor-only, `CSAF.Waymark.Demo` carries only the sample scene's component.
There is **no `Resources/` folder** — nothing in this package is forced into your build.

Unity **2022.3 or newer**. Built and gated against **6000.5.7f1** with warnings as errors.

---

## 6. Support

Through the storefront you bought it from. The package ships its full readable source and this
document; nothing in it is obfuscated, minified or compiled away.

Code and store imagery were produced with AI assistance, declared truthfully on every storefront.
The plates themselves are **not** produced by an image model — they are drawn by the software
rasteriser in this package from the 46 hand-authored forms listed above, with no network call
anywhere in the art path.

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved. See LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
