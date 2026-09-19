# Mandorla — Coloring Page Generator — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Mandorla — Coloring Page Generator  
**Engine:** Unity 6  
**Docs published:** 2026-09-19


---

# Mandorla - Coloring Page Generator for Unity

Generates closed-region coloring pages for coloring and colour-by-number games, and converts your own
line art into the same template-ready format. Every page comes with its line art, a region map, one
white piece per area, a reference colouring and a numbered overlay.

Version 1.0.0 - Core Systems Asset Factory

---

## What you get

- **Six hand-authored page families**, each drawn from a seed, so every seed is a different page:
  - **Mandala** - concentric bands of petals, scallops, cells, beads and zigzags around a centre flower,
    with a pointed crown.
  - **Rosette** - a flower-of-life centre inside rings of beads and a scalloped crown.
  - **Lattice** - eight-point stars in an octagon-and-square net, or hexagrams in a hexagon net, framed.
  - **Stained Glass** - a leaded arch window of jittered glass cells with a centre medallion.
  - **Botanical** - a radial wreath: a layered centre bloom, stems with veined leaves, blooms and buds.
  - **Zentangle** - curved strings divide a framed page and each area gets its own tangle pattern
    (stripes, grid, scales, bubbles, rings or woven pods).
- **Detail 1 to 5** on every family: higher detail means more, smaller areas. Measured over ten seeds per
  family, the average page grows from detail 1 to detail 5 on every family: Mandala 107 to 392 areas,
  Lattice 120 to 680, Stained Glass 64 to 199, Zentangle 89 to 340, Rosette 158 to 255, Botanical 193 to
  271. On Rosette and Botanical the step from 1 to 3 is small; there, detail mostly adds the finer patterns of
  4 and 5. One seed can buck the trend, so choose pages by looking at them.
- **Eight reference palettes** (Sunset, Tidepool, Meadow, Jewel, Pastel, Autumn, Berry, Desert), assigned
  so that areas that belong together share a colour (the rings of a mandala, the repeating tiles of a
  lattice) and neighbouring areas differ where the palette allows it.
- **A child-safe floor.** Every area must hold a circle of a size you choose. An area too small to tap is
  inked solid black instead of shipped as an unfillable speck. The editor window warns when a quarter or
  more of a page has become ink.
- **Line art conversion.** Hand Mandorla your own clean line art and it finds every closed area exactly as a
  flood fill would, seals small gaps in the outlines (and draws the seal, so the boundary is always
  visible), and produces the same outputs as a generated page.

Nothing in the package is an image file: every line is drawn by the C# in the package, and the numbers
are drawn from figures in the package. It ships no font.

---

## Quick start

1. Import the package. Everything lands under `Assets/CSAF/Mandorla/`.
2. Open `Assets/CSAF/Mandorla/Demo/Scenes/MandorlaDemo.unity` and press **Play**. It is a small
   colour-by-number game: pick a colour (click a swatch or press 1-8), click an area.
   **LEFT / RIGHT** change family, **N** draws a new page, **R** reveals the reference colouring,
   **C** clears.
3. Open **Window > CSAF > Mandorla**. Choose a family, seed, detail, size, line weight, smallest area and
   palette, press **Generate**, and look at the three views side by side: line, reference fill, colour by
   number. Use **<** and **>** to step through seeds.
4. Press **Export this page**, or **Export N seeds** to write a whole batch, into the export folder
   (default `Assets/Mandorla Pages`).

---

## What an export contains

Each page is written to its own folder, `<Export folder>/<Family>_<Seed>/`:

| File | What it is |
| --- | --- |
| `line.png` | The line art on white paper. |
| `line_transparent.png` | The line art on transparency, to lay over your own fills. |
| `reference.png` | The page filled with its reference palette. |
| `numbered.png` | The colour-by-number page: line art with a grey number in every area. |
| `regions.png` | The region map: each pixel stores `area id + 1` in red (low byte) and green (high byte); 0 means a line. Imported uncompressed, point-filtered, readable and not colour-managed, so the ids survive. |
| `page.json` | Size, family, seed, palette colours, and every area's id, number, pixel area, bounds, deepest point and inscribed radius. |
| `pieces/piece_<id>_x<X>_y<Y>.png` | One white piece per area on transparency, cropped to the area and padded to tuck under the line; X and Y are the piece's position on the page (from the bottom-left, in pixels). Imported as sprites. This is the "separate white parts" format sliced coloring templates load. Turn it off with **Write pieces**. |

Reading the region map in your game:

```csharp
Color32 c = regionMap.GetPixel(x, y);        // regions.png, readable
int id = (c.r | (c.g << 8)) - 1;             // -1 means the player tapped a line
```

---

## From code

Generation and conversion touch no Unity object, so both are safe on a worker thread. Build textures on the
main thread.

```csharp
using CSAF.Mandorla;

var options = new PageOptions { Family = PageFamily.Mandala, Seed = 42, Detail = 3, Size = 2048 };
ColoringPage page = await Task.Run(() => Coloring.Generate(options));

Texture2D line = ColoringPage.ToTexture(page.LinePixels(), page.Width, page.Height);
Texture2D numbered = ColoringPage.ToTexture(page.NumberedPixels(), page.Width, page.Height);
```

The class is `Coloring` (not `Mandorla`), so it can never collide with the `CSAF.Mandorla` namespace in
your code.

Playing a page with the included board:

```csharp
var board = new ColoringBoard(page, showNumbers: true);
myRawImage.texture = board.CreateTexture();

// on a tap, with uv in 0..1 from the bottom-left of the page:
board.FillAtUV(uv, page.Palette.Colours[selected]);
board.Apply();                                      // uploads only if something changed
int score = board.CorrectCount();                   // areas holding their reference colour
```

`ColoringBoard` rewrites only the pixels of the area you fill, so a tap costs the size of the area, not the
page. `Reveal()` fills every area with its reference colour and `Clear()` empties the page.

Converting your own line art:

```csharp
Color32[] pixels = myLineArt.GetPixels32();         // the texture must be readable
var convert = new ConvertOptions { InkThreshold = 0.5f, CloseGaps = 2, MinRegionSize = 0.006f };
ColoringPage page = Coloring.Convert(pixels, myLineArt.width, myLineArt.height, convert);
Debug.Log(page.Regions.Count + " areas, " + page.ClosedGapPixels + " px of gaps sealed");
```

The editor window's **Convert line art** tab does the same for any texture, readable or not.

---

## Options

**PageOptions** (generation)

| Option | Default | Meaning |
| --- | --- | --- |
| `Family` | Mandala | Which of the six families draws the page. |
| `Seed` | 1 | Any integer. The same options always give byte-identical output. |
| `Size` | 2048 | Page edge in pixels, 512 to 4096. |
| `Detail` | 3 | 1 (a few large areas) to 5 (dense). |
| `LineWeight` | 0.0025 | Line width as a fraction of the page edge (5 px on a 2048 page). |
| `MinRegionSize` | 0.009 | The child-safe floor: the smallest circle every area must hold, as a fraction of the page edge (18 px across on a 2048 page). For a toddler app, raise it (for example to 0.03) together with `Detail` 1: every area smaller than the floor is inked solid, so a high floor on a busy page inks much of it (measured: 0.03 inks about 41% of an average detail-5 Mandala and 69-75% of a detail-4 or 5 Lattice, against 5-16% at the default). |
| `PaletteIndex` | -1 | Which built-in palette; -1 picks one from the seed. |

**ConvertOptions** (line art)

| Option | Default | Meaning |
| --- | --- | --- |
| `InkThreshold` | 0.5 | Luminance below this is a line. Transparent pixels are always paper. |
| `CloseGaps` | 2 | Seals breaks in the outlines up to about twice this many pixels wide; the seal is drawn into the line layer. 0 leaves the art as drawn. |
| `MinRegionSize` | 0.006 | The child-safe floor, as above. |
| `PaletteIndex` | 0 | Which built-in palette colours the reference fill. |

Out-of-range options are refused with an `ArgumentOutOfRangeException` that names the option.

---

## How the areas are found

Areas are found on the RASTER, the way your game will find them: 4-connected paper pixels at the page's own
resolution. Two outlines that meet in the geometry can leave a one-pixel crack after antialiasing, and a
fill would leak through it; so Mandorla does not trust the geometry that drew the page, it floods the pixels
it will export. The test suite floods the exported `line.png` from every area and requires the fill to stay
inside that area.

Each area's number sits at its deepest point (the centre of the largest circle it holds), sized to the area.

---

## Performance, measured

On an AMD Ryzen 7 5825U in the Unity 6000.5.7f1 editor, across two runs, one 2048 x 2048 page at detail 3
took from 0.7 to 0.8 s (Lattice, the fastest family) up to 2.6 s (Zentangle, the slowest), and one 1024 x 1024
page from 0.2 s to 0.7 s. These are samples on one machine, not ceilings. Generate off the main thread (the demo does) and cache what you generate: a page is a
function of its options, so the same seed never needs drawing twice.

---

## Compatibility

- **Unity 2022.3 and newer**, including Unity 6. Built and tested against 6000.5.7f1.
- **Render pipeline agnostic** (Built-in, URP, HDRP): pages are drawn on the CPU into textures.
- **Any input system**: the demo reads input through `Event.current`, so it runs in projects set to the Input
  System package only.
- Three named assembly definitions: `CSAF.Mandorla.Runtime`, `CSAF.Mandorla.Editor` (Editor only),
  `CSAF.Mandorla.Demo`. No `Resources` folder, no shaders, no images, no fonts, no audio, no network calls,
  no third-party code.
- Full, readable C# source.

---

## Limitations, stated plainly

- Conversion needs clean line art: dark lines on a light or transparent ground. Shaded, textured or sketchy
  drawings produce areas where the shading is, because that is what a flood fill in your game would do too.
- `CloseGaps` seals small breaks, not missing strokes. A gap wider than about twice its value stays open and
  the two areas it joins stay one area. It works the same at any line thickness. A part of an area that is
  narrower than about twice `CloseGaps` (the thin tip of a leaf, say) looks exactly like a break to it, so it
  gets a line across it too; set `CloseGaps` to 0 for art you know is already closed.
- The reference palette avoids giving two neighbouring areas the same colour wherever eight colours allow it;
  on a page where one area touches more than seven differently coloured neighbours, two neighbours may match.
- Mandorla draws and slices pages. It does not save a player's progress or provide painting tools beyond the
  included `ColoringBoard`; your game or template does that.

---

## AI disclosure

Code: yes. Graphics: yes, because the code that draws the pages was AI-written; there is no image model
anywhere in the art path, and every page is drawn by the shipped code from hand-authored families. Sounds: no,
the package contains no audio. Text and dialog: no.

---

## Support

Bug reports and questions: the issue tracker on the csaf-releases repository that hosts this guide. Please
include your Unity version and the family, seed and options of a page that drew unexpectedly.

Copyright (c) 2026 Core Systems Asset Factory. See LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
