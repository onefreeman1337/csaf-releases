# Signet - the generated result card players post — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Signet - the generated result card players post  
**Engine:** Unity 6  
**Docs published:** 2026-09-02


---

# Signet — the result card your players post, composed from the run's own numbers

**At the end of a run, Signet composes a card.** Not a screenshot with a frame on it — a struck
metal plate that draws the outcome as a device, sets every stat beside its own glyph, and stamps a
seed sigil that no other run in your game will ever get. It comes out as a `Texture2D` or a PNG,
and it is designed to be posted.

Nothing in this package is a texture. There is no atlas, no sprite sheet, no material and **no
font**. Twenty-four run-stat glyphs, nine outcome plates, fifty struck letterforms and figures, a
seed sigil with **eight hundred distinct shape combinations**, and seven standing palettes are all
drawn in C# by a software rasteriser that ships with the package. A thousand runs cost a thousand
cards and zero import time.

---

## Quick start (about five minutes)

1. **Open the demo.** `Assets/CSAF/Signet/Demo/Scenes/SignetDemo.unity` — press Play. `SPACE`
   rerolls the seed and the sigil changes; `1`–`7` walk the standings; `T` switches between the
   social card and the thumbnail composition; `S` saves a PNG and puts its path on your clipboard.

2. **Open the window.** `Window ▸ CSAF ▸ Signet`. Type your own labels into the stat rows and watch
   which ones resolve to a glyph — that is the fastest way to find out how your game's vocabulary
   lands before you write any integration code.

3. **Compose a card from your own run:**

   ```csharp
   using CSAF.Signet;

   var run = new RunRecord("THE LONG FALL", "Slain by the Hollow King", seed, Standing.Gold)
   {
       Ended = System.DateTime.Now,
       Depth = 14,
   };
   run.With("Kills", "142")
      .With("Depth", "14")
      .With("Time", "12:04")
      .With("Accuracy", "97%");

   Texture2D card = SignetCard.Compose(run, 1200, 630, out CardLayout layout);
   // You own the texture. Destroy it when the run-end screen closes.
   ```

4. **Or save it straight to disk:**

   ```csharp
   string path = CardExport.ComposeAndSave(run);   // returns the absolute path it wrote
   CardExport.CopyPathToClipboard(path);
   CardExport.Reveal(path);                        // opens the folder where the platform allows
   ```

---

## The labels are the interface

There is no enum to map and no second field to fill in. **The label you already print is what picks
the glyph.**

```csharp
run.With("Kills", "142");      // strikes the blade device
run.With("Slain", "142");      // the same device — the corpus knows the word
run.With("Eliminations", "142");   // and this one
run.With("Caravans Lost", "1");    // no match: the row sets flush, with no glyph
```

Twenty-four devices cover kills, depth, time, gold, distance, accuracy, combo, deaths, damage dealt
and taken, healing, secrets, bosses, score, waves, rank, streak, multiplier, items, energy, shots,
blocks, traps and rooms — each with a list of words a game might actually use.

⚠️ **An unmatched label draws NO glyph, deliberately.** It does not fall back to a hash, because a
wrong glyph beside a real number is a false claim about what that number means. If you want a
device for "Caravans Lost", add its word to the corpus — `Runtime/Mark/MarksRunStat.cs` is plain,
readable C# and the word list is right there at the top of each entry.

The **outcome** is matched as a phrase and behaves the opposite way: it falls back to a stable hash
rather than to silence, because every run that ended has an outcome and a blank hero plate is never
the honest answer.

---

## The seed sigil is the part no art pack can sell you

`Sigil.Form(seed)` is a **pure function to an inspectable struct** — arm count, core, terminal,
inner ring, bar, phase — and `Sigil.Draw` is the only thing that touches pixels. That split is
deliberate: the claim "no two runs get the same sigil" is testable over millions of seeds by
comparing structs, rather than by rasterising a handful of images and hoping the sample was
representative.

`SigilForm.DistinctForms` reports **800**, and it deliberately EXCLUDES phase. Rotation is
continuous, so counting it would let the number be anything we liked, and a rotation of a five-fold
device is very often not a different picture at all. Eight hundred is the count of genuinely
different shapes.

Leave `Seed` empty and no sigil is struck — the layout closes up and the stat ledger takes the
space. It is never derived from the title instead, because two runs of the same game would then
share the one device that exists to tell them apart.

---

## Two compositions, not one scaled

`CardLayout` chooses from the **pixel height** you ask for:

| | |
| --- | --- |
| **Full** (height ≥ 260) | title, hero device, seed sigil, up to eight stat rows, foot band with seed and date |
| **Compact** (height < 260) | bigger type, four rows, no foot band |

A shrunken social card is a grey smudge at thumbnail size, so the thumbnail is a different
composition. You do not have to know the rule — ask for the size you want.

---

## Your text, where the face cannot reach

Signet draws its own letterforms, so it ships no font and inherits no font licence. The cost of
that is coverage: **A–Z, 0–9 and a small set of marks**, with common accented Latin folded to its
base letter (so `CAFÉ` strikes as `CAFE`).

⚠️ **Text outside that set leaves the field EMPTY.** A Japanese or Cyrillic title is not mangled and
is not printed as placeholder boxes — it is simply not struck, and the Editor window tells you which
field and which character. That is a deliberate choice: a row of tofu on an image your player is
about to post is worse than a clean plate.

Every field's rectangle is published so you can draw it yourself:

```csharp
Texture2D card = SignetCard.Compose(run, 1200, 630, out CardLayout layout);
Rect titlePx = layout.ToPixels(layout.TitleRect, 1200, 630);   // origin top-left, Y down
// ...draw your own text into titlePx with TextMeshPro, IMGUI, or anything else.
```

`layout.Rows` gives you the same for every stat line: the glyph's centre and radius, the baseline,
and where the label starts and the value ends.

---

## Performance — read this before you call it on the main thread

Signet is a software rasteriser. It does real work, and how much depends on the size you ask for
and how many devices the run resolved.

**Measured on the development machine, after warmup, for a 1200×630 card:** the plate is roughly
half a second, the type under a fifth, and the devices between one and three seconds — the seed
sigil is the single largest item, because it is five rasteriser passes over a million samples of a
radially folded distance field. ⚠️ Those are **samples on one shared machine, not a bound**; the
same card has varied by more than a factor of two between runs.

**So compose it off the main thread.** Everything except the final texture is arithmetic over
arrays and touches no Unity object:

```csharp
void Awake()
{
    SignetCard.Warmup();          // once, on the main thread, before any background bake
}

async void ShowCard(RunRecord run)
{
    CardLayout layout = null;
    Color[] px = await Task.Run(() => SignetCard.Bake(run, 1200, 630, out layout));
    Texture2D card = SignetCard.ToTexture(px, 1200, 630, run);   // main thread
    // ...show it.
}
```

⛔ **`Warmup()` is not optional if you bake in the background.** The corpora and the type face build
themselves on first use, and two threads reaching an unbuilt one at the same moment is a race that
fails rarely and looks like a corrupt card. It also bakes a tiny throwaway card so the runtime has
compiled the rasteriser — without that, your player's FIRST card pays several seconds that no later
card does.

`SignetCard.LastTimings` reports where the time went on the most recent bake — plate, type, marks,
resolve, and how many devices were drawn. The Editor window prints it.

---

## What it writes, and where

- `CardExport.ToPng(card)` — bytes, nothing else.
- `CardExport.Save(card, run)` — writes to `Application.persistentDataPath/Signet/`, returns the
  absolute path. Names are built from the title and the end time, and sanitised, because
  `Descent 14: The Long Fall` is an ordinary title and an illegal Windows filename.
- `CardExport.CopyPathToClipboard(path)` — the PATH, so it pastes into any upload box.
- `CardExport.Reveal(path)` — opens the folder where the platform has one; returns `false` rather
  than throwing where it does not.

⚠️ **There is no image-to-clipboard call, and that is a decision rather than an omission.** Unity's
only cross-platform clipboard is text. Putting a bitmap on the system clipboard needs native interop
per platform, and a package that shipped one and claimed "copy to clipboard" would be claiming three
platforms it was tested on one of.

---

## Requirements and contents

- **Unity 2022.3 or newer.** No render pipeline requirement — the demo is a camera and one script,
  and works identically in Built-in, URP and HDRP.
- No third-party dependencies, no network calls, no fonts, no textures, no shaders.

```
Runtime/Core     Hash, Ink (the rasteriser), SignetPalette, Words
Runtime/Mark     the corpus: run-stat glyphs, outcome plates, the seed sigil, GlyphKit
Runtime/Type     the struck letterforms and the typesetter
Runtime/Model    RunRecord, and Derive (how the run's numbers reach the drawing)
Runtime/Card     CardLayout and SignetCard
Runtime/Export   CardExport
Editor           the Signet window
Demo             the scene and its script
```

Everything ships as readable source. Nothing is obfuscated, minified or compiled away — including
the corpus, which is where you go to add your own device.

---

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
