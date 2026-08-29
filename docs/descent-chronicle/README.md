# Descent (dynasty & lineage chronicle) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Descent (dynasty & lineage chronicle)  
**Engine:** Unity 6  
**Docs published:** 2026-08-29


---

# Descent Chronicle

**Point it at your characters, their parents, their marriages and the dates things happened to them,
and it draws the finished illuminated descent chart.** Every person is a cartouche carrying a
generated device, every descent is drawn in the hand of the relationship, and every life event is
marked along the line with its own generated glyph.

Nothing in that picture is a stored image. There is no PNG, no atlas, no sprite sheet, no shader and
no material anywhere in this package. It is all drawn in code, at runtime or in the editor, from a
corpus of **62 hand-authored forms** you can read and edit.

---

## 1. The five minutes that get you a chart

1. Open **`Assets/CSAF/DescentChronicle/Demo/DescentChronicleDemo.unity`** and press **Play**. That
   draws the worked sample, the House of Vairholt, and prints what it decided and how long it took.
2. Open **Window ▸ CSAF ▸ Descent Chronicle**. Press **Compose**. Same chart, plus the derivation
   panel — which tells you, person by person and event by event, which of *your own words* selected
   each mark.
3. Make your own: **Create ▸ CSAF ▸ Descent Chronicle ▸ Lineage**, fill in some people, drag the
   asset into the window's **Lineage** slot, press Compose.

From your own code it is three lines:

```csharp
var composer = new ChartComposer();
ChartCanvas page = composer.Compose(myDescentRecord, ChartOptions.Default(), out ChartReading reading);
Texture2D chart = page.Resolve("DescentChart");
```

`ChartReading` is worth reading. It carries every decision the composer made, the compose time in
milliseconds, and the name-plate rect for every person.

---

## 2. The data you give it

```csharp
var record = new DescentRecord { Title = "The House of Vairholt" };

var aldric = new PersonRecord {
    Id       = "aldric",          // unique within the record; how parents and spouses are wired
    Name     = "Aldric the Elder",// never drawn — see §4 on lettering
    Calling  = "king",            // selects the cartouche device
    House    = "Vairholt",        // selects the tincture, so a house reads as a set
    Descent  = "direct",          // selects the hand this person's descent line is drawn in
};
aldric.Spouses.Add("isolde");
aldric.Events.Add(new LifeEvent("marriage", when: 22, weight: 0.8f));
aldric.Events.Add(new LifeEvent("death by age", when: 68, weight: 1.0f));
record.People.Add(aldric);
```

**`Calling`, `Descent` and `LifeEvent.Kind` are free strings on purpose.** You already have a word
for these things in your own data, and renaming your fields to fit somebody else's enum is exactly
the friction that stops a tool getting used. The corpus matches your word **whole-word**, handles
`camelCase`, `SCREAMING_SNAKE`, `kebab-case` and spaces, and falls back to a stable derived mark when
it does not recognise one — **and it tells you which happened**, in the window's derivation panel and
in `ChartReading.Events`. If a word of yours is falling through, add it to the corpus: the word lists
are plain arrays in `Runtime/Mark/`.

`LifeEvent.When` is only ever used for ORDER, so a year, a turn number or a day index all work
equally well. `Weight` is `[0,1]` and does two things: it sizes the mark, and it decides which events
survive when a person has more than `ChartOptions.MaxEventsPerPerson`. Overflow is never silent —
`ChartReading.EventsDropped` says how many were not drawn.

### It refuses bad data instead of drawing it wrong

`DescentRecord.Validate()` returns one message per fault and the composer refuses to run while any
exist. It catches duplicate ids, dangling parent and spouse ids, more than two parents, and — the one
that matters — **cycles**, where somebody ends up their own ancestor. A hand-assembled genealogy
arrives with all of these, and a chart drawn from a cyclic descent is either an infinite loop or a
silently wrong picture. Both are worse than a message naming the fault.

---

## 3. What it draws, and why it is 62 forms and not 6

| family | count | what they are |
| --- | --- | --- |
| **Life events** | **24** | birth · twin · natural · posthumous · betrothal · marriage · succession · abdication · regency · usurpation · elevation · oath · war · siege · victory · defeat · truce · exile · death by age · death in battle · plague · murder · entombment · extinction |
| **Cartouche devices** | **16** | crown · coronet · mitre · helm · sword · scales · key · torch · quill · hammer · sickle · ship · chalice · staff · mask · lyre |
| **Line treatments** | **8** | direct · cadet · adopted · natural · uncertain · extinct · collateral · restored |
| **Border treatments** | **8** | fillet · dentil · vine · rope · chain · meander · laurel · thorn |
| **Generation bands** | **6** | vellum · ochre · verdigris · madder · indigo · soot |

Times the eight tinctures, a chart draws from a space far larger than its own page.

**The line treatments are the part people underestimate.** A descent chart is mostly LINE — twenty
cartouches and a hundred segments between them — so the lines occupy more of the picture than every
glyph combined, and a chart that draws all descents identically is a flowchart with nice icons on it.
Each of the eight is a property of the line's whole length (weight, doubling, breaking, texture)
rather than a symbol at its midpoint, so it reads over a gap as short as two siblings and a run as
long as the page. Each one also carries a `Meaning` string your own legend can print verbatim.

---

## 4. Lettering: the chart deliberately draws no text

Your font, your language, your point size. Baking our typeface into a texture would be a chart you
cannot ship in German.

What you get instead is a real drawn recess on every cartouche and a rect telling you where it is:

```csharp
foreach (PersonReading p in reading.People)
{
    // p.NamePlateUv is in PAGE UV, origin bottom-left.
    PlaceMyLabel(byId[p.Id].Name, p.NamePlateUv);
}
```

UV rather than pixels, because you may be showing the chart at any size and a pixel rect goes wrong
the moment you do.

---

## 5. Speed, and the honest numbers

A software rasteriser's cost is the pixel count, so a page twice as wide is four times the work.
That is worth knowing before you compose a forty-person dynasty at full size in a loading screen.

Three things this package does about it, all of them measured rather than asserted:

- **Cartouches are cached tiles.** Each person is rasterised once into a small tile and blitted; the
  cache key is the DERIVATION, not the person, so two brothers of one house with one calling cost
  one rasterisation. `ChartReading.TilesRasterised` and `TilesReused` report the real numbers.
- **The page is bounded.** `ChartOptions.MaxPageSide` scales the cell down rather than allocating
  whatever a roster asks for.
- **Every compose times itself.** `ChartReading.ComposeMilliseconds` is measured on your machine, on
  every compose, so you never have to trust a figure in a document.

**The integration this package recommends: compose once, cache the `Texture2D`, and recompose only
when the roster changes.** The demo scene shows the pattern — it composes ONE chart, lazily, after
the first frame has presented, so nothing ever blocks a load.

If you want it faster: `ChartOptions.Preview()` is the small, quick configuration the editor window
uses, and `ChartOptions.PageSamples` trades edge quality for speed on the page ground.

---

## 6. Layout, for when you want to know why it looks like that

A genealogy is not a tree. A person has two parents, so the graph has diamonds; spouses must share a
row or a marriage cannot be drawn as a horizontal; a person may marry twice and have children by
both; and cousins marry, which closes loops. The solve is four passes:

1. **Generations** — longest path from the roots, then spouse levelling so a married pair shares a
   band, with descendants re-propagated.
2. **Blocking** — spouses are laid out as one contiguous run, so a marriage tie is always between
   adjacent cartouches. Someone married twice sits BETWEEN their two spouses, which is the only
   arrangement where neither tie crosses the other.
3. **Ordering** — barycentre sweeps down and back up, keeping the arrangement with the fewest
   measured crossings rather than whatever the last sweep produced.
4. **Routing** — orthogonal paths through a bus lane in the gutter between two bands, one lane per
   union. That is what guarantees no descent line runs through a cartouche.

`ChartLayout.Solve()` returns all of it as plain data — placements, ties and routed polylines in cell
units — so you can draw your own chart from our layout if you would rather.

`ChartReading.Crossings` reports how many descent lines cross another. On a roster with enough
intermarriage it will not be zero, and it is reported rather than hidden.

---

## 7. Requirements and what is in the box

- **Unity 2022.3 or newer.** No package dependencies, no render-pipeline dependency: the art is drawn
  on the CPU, so it is identical on Built-in, URP and HDRP.
- Everything is under one root, `Assets/CSAF/DescentChronicle/`, in three named assembly definitions
  (Runtime, Editor, Demo). There is no `Resources/` folder — that would bloat every build you make,
  forever, whether you use this or not.
- Full readable C# source. The corpus is the product; it is meant to be extended.

---

## 8. AI disclosure

This tool's source code and its store imagery were produced with the assistance of AI, and that is
declared truthfully on every storefront where it is sold.

**What that specifically does not mean:** the charts are not produced by an image model. They are
drawn by the software rasteriser in `Runtime/Core/Ink.cs` from 62 hand-authored forms in
`Runtime/Mark/`. There is no diffusion model, no image model and no network call anywhere in the art
path, and the tool generates identical output offline and forever.

---

## 9. Licence

See `LICENSE.txt`. The short version: use it on unlimited projects, keep all your revenue, and **the
charts it draws for you are yours** — ship them in your game, its store page and its trailer with no
attribution. Just don't resell the tool, or the generated art on its own as an art pack.

© 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
