# Ductus — Letter Tracing Generator — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Ductus — Letter Tracing Generator  
**Engine:** Unity 6  
**Docs published:** 2026-09-20


---

# Ductus — Letter Tracing Generator

**Generate letter tracing lessons from your own font, in Latin, Cyrillic and Greek.**

**Built and tested on Unity 6 (6000.5)** · no third party packages · full readable source · a playable demo scene.

That version is what every store declares, because it is the one this package was compiled, gated and
fresh-installed against. The source uses no API or C# syntax newer than 2022.3 and is very likely to build
there, but no 2022.3 editor was available to compile it here, so that is an inference and is not claimed as a
tested version.

---

## 1. Install

Import the package. Everything lands under `Assets/CSAF/Ductus/`:

```
Assets/CSAF/Ductus/
  Runtime/     Corpus, Plate, Fit, Trace, Core   (CSAF.Ductus.Runtime)
  Editor/      FontRaster, DuctusWindow          (CSAF.Ductus.Editor)
  Demo/        DuctusDemo.unity + its script     (CSAF.Ductus.Demo)
  Readme.md
```

There is no `Resources/` folder and nothing is added to your build that you do not reference.

## 2. Press Play on the demo

Open **`Assets/CSAF/Ductus/Demo/DuctusDemo.unity`** and press Play.

Trace the letter with the mouse: start on the dot marked **1** and follow the arrows. Finish a stroke and
the next number lights up. Go the wrong way and the board writes the letter for you, then lets you try
again. The strip along the top changes script, letter and colourway.

## 3. Make your own sheets

**`Window ▸ CSAF ▸ Ductus`.**

1. **Font** — drop in any dynamic font you have imported (`.ttf` or `.otf`; Dynamic is the default import
   mode). Its letterforms shape every plate.
2. **Script** — Latin, Cyrillic or Greek.
3. **Survey this font.** Every letter is fitted and graded, and the grid colours each one.
4. Click any letter to see its plate, its grade, and the two numbers behind the grade.
5. Pick a **folder**, tick which grades to include, and press **Export**. You get one PNG per letter.

Plate size, colourway and export folder are remembered between sessions.

## 4. Put a lesson in your game

Add a **`SpriteRenderer`** and a **CSAF ▸ Ductus Tracing Board** to any GameObject. Set **Character** and
press Play. It reads the mouse and touch through the built in input manager, so there is nothing to install.

```csharp
using CSAF.Ductus;

var board = GetComponent<DuctusTracingBoard>();

board.StrokeFinished += i  => chime.Play();                 // i is the zero based stroke index
board.GlyphFinished  += () => Stars.Award(3);
board.WentWrong      += e  => Debug.Log("the child went " + e);

board.Teach('ж');    // Cyrillic zhe
board.Palette = 3;        // 0 to 5
board.Demonstrate();      // play the stroke by stroke demonstration
board.Restart();          // back to stroke one
```

`board.Tracer` exposes progress directly: `CurrentStroke`, `StrokeProgress`, `Written`, `Done`.

`WentWrong` reports one of `TraceEvent.WrongOrder` (they started a later stroke first),
`TraceEvent.WrongDirection` (they started at the wrong end) or `TraceEvent.OffPath` (they strayed).

### Inspector settings

| | |
| --- | --- |
| **Character** | the letter to teach |
| **Palette** | 0 to 5: Candy, Meadow, Ocean, Sunny, Berry, Slate |
| **Plate size** | 64 to 2048, rounded to a power of two. 512 is plenty on a phone |
| **Tolerance** | how far the pointer may stray, in em where the cap height is 1. Default 0.12 |
| **Demonstrate on mistake** | play the demonstration when the child goes wrong |
| **Demonstration seconds** | how long the whole letter takes to write |

## 5. Drawing plates yourself

Everything the window does is public API:

```csharp
StrokeGlyph lesson = Strokes.Get('A');                    // null if the corpus does not teach it
Color32[] pixels   = Plate.Draw(lesson, PlatePalette.Curated(0), 512);
Color32[] halfway  = Plate.DrawDemo(lesson, PlatePalette.Curated(0), 512, 0.5f);

foreach (char c in Strokes.Characters(DuctusScript.Greek)) { /* 49 of them */ }
```

`Plate.Draw` returns bottom up pixels, ready for `Texture2D.SetPixels32`. It touches no shader, no render
texture and no file, so it behaves identically in batch mode and on every platform.

## 6. What the grades mean

- **Fitted** — the lesson runs down the middle of your font's own strokes. Ship it.
- **Approximate** — the lesson lies on your font's letter but is not centred in every stroke. Usually a
  display or script face. Usable; have a look at it.
- **Fell back** — your font's letterform is not the shape the lesson teaches. A single storey **ɑ** against
  the double storey **a** a child is taught, for instance. Ductus uses its own canonical form scaled to your
  font's ink box, so the lesson is still a correct lesson; it just no longer matches the face.

Two numbers sit behind each grade: how much of the lesson lands on your font's ink, and how centred it is in
the stroke it lies on.

On a plain text face, 164 of the 177 lessons grade fitted. That was measured in a blank project against
Unity's own built in font.

## 7. Limitations, stated plainly

- **Stroke order is a teaching convention, and conventions differ.** The corpus follows the manuscript hand
  taught in English speaking primary schools and the ordinary Russian and Greek school hands. Your country,
  your school or your era may differ. The corpus is plain, readable data in
  `Runtime/Corpus/Strokes*.cs` precisely so you can change it.
- **Aliased letters.** Cyrillic А and Latin A are the same shape in every face, so they share a lesson. The
  character is always re stamped, so plates, tracer and export report the Cyrillic code point.
- **Punctuation is not covered.** Letters and the figures 0 to 9 only.
- **Ductus ships no fonts.** It reads yours at edit time and draws pictures of letters. Your font's own
  licence governs what you may do with the sheets; a font under the SIL Open Font License is safe for this.
  Ductus never copies, embeds, subsets or redistributes any part of a font file.
- **The font reader needs a graphics device**, so the editor window works in the editor but the survey will
  not run in a `-nographics` batch build. Plate drawing has no such limitation.

## 8. Support

**csassetfactory@gmail.com** — a font that will not fit, a glyph you would like added, or anything else.

Licence: see `LICENSE.txt`. One commercial licence, unlimited projects, no royalties; the plates you export
are yours.

---

*Built by Core Systems Asset Factory. Code and graphics are AI generated; the package ships no audio and no
third party content. The plates are drawn in code, not by an image model.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
