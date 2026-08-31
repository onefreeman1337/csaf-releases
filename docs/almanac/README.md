# Almanac (illustrated year / calendar screen) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Almanac (illustrated year / calendar screen)  
**Engine:** Unity 6  
**Docs published:** 2026-08-31


---

# Almanac

**Point it at the season, crop and event data your farming or life sim already has — the crop's
name, how far through growth it is, what the weather did, which days are feasts — and it composes
the illustrated year.** One printed almanac page per season: a laid-paper ground under a plate
impression, a woodcut weather glyph struck against each day that has one, the moon ruled across the
head of the month, gilded feast cards on the days that carry them, and a strip along the foot where
every crop stands at the stage your own number says it has reached.

Nothing on that page is a stored image. There is **no PNG, no atlas, no sprite sheet, no shader and
no material anywhere in this package**. It is all drawn in code, at runtime or in the editor, from a
corpus of **62 hand-authored marks** you can read and edit: 16 weather glyphs, 6 crop habits at 5
growth stages each, 8 feast cards, 4 moon phases and 4 season treatments.

**Almanac draws no text.** It ships no font, measures no string and renders no words. It draws the
picture and leaves the masthead and the label areas clear, so your own `TextMeshPro`, `Text` or
IMGUI labels sit over it with your fonts, your localisation and your rich text exactly as they are.

---

## 1. The five minutes that get you a calendar screen

1. Open **`Assets/CSAF/Almanac/Demo/AlmanacDemo.unity`** and press **Play**. It composes one page
   from the built-in sample year, lazily, and prints what it decided and how long it took on your
   machine. The four buttons switch season.
2. Open **Window ▸ CSAF ▸ Almanac**. Change the season or the width and the page redraws. The panel
   beside it tells you which of *your own words* selected each mark and which fell through to a
   derived one.
3. Point it at your own data. From your own code it is a handful of lines:

```csharp
using CSAF.Almanac;

var year = new AlmanacRecord("The Long Harvest", 1147);

var autumn = new SeasonRecord(Season.Autumn, "Autumn", 28);
autumn.Crops.Add(new CropRecord("Barley", progress: 1.00f, yield: 9));
autumn.Crops.Add(new CropRecord("Pumpkin", progress: 0.62f));
autumn.Marked.Add(new DayRecord(9, weather: "fair", ev: "Harvest Home"));
autumn.Marked.Add(new DayRecord(12, weather: "rain"));
year.Seasons.Add(autumn);

Texture2D page = PageComposer.Compose(year, autumn, 760, 1040, out PageDerivation how);
```

`page` is a plain `Texture2D`. Put it on a `RawImage`, a `SpriteRenderer`, a material, or write it
to disk. `how` tells you exactly what every mark on it resolved to and why — see §4.

---

## 2. What the corpus actually contains

| family | count | what it is |
| --- | --- | --- |
| **Weather glyphs** | 16 | clear · haze · overcast · drizzle · rain · downpour · thunder · hail · sleet · snow · blizzard · frost · fog · gale · heat · rainbow |
| **Crop growth** | **30** | 6 habits — cereal, root, vine, brassica, gourd, orchard bough — each drawn at 5 stages: sown, sprout, leaf, bud, ripe |
| **Feast cards** | 8 | the sowing · first fruits · midsummer · harvest home · the lantern night · the frost fair · the turning year · market day |
| **Moon phases** | 4 | new · waxing · full · waning |
| **Season treatments** | 4 | spring · summer · autumn · winter — each with its own marginal motif, border ornament and margin density |
| | **62** | |

**A growth stage is a different plant, not a bigger one.** A cereal goes seed in a drill → hooked
coleoptile → fan of strap blades → ear standing in the boot → nodding awned ear. A root goes seed on
a ridge → cotyledons over a radicle → rosette → the root's shoulder breaking the soil → the whole
tuber lifted with its tops trimmed. Nothing in either sequence is a scaled copy of the picture
before it, because five sizes of one shape is a progress bar and you already have one of those.

---

## 3. How a mark gets chosen — your words first, always

**1. Your own words win.** The crop's name and the day's weather word are matched WHOLE-WORD,
case-insensitively, against the corpus. `"Winter Wheat"` finds the cereal habit through `wheat`;
`"hard frost"` finds the frost glyph. You do not rename anything and you do not author a parallel
table of art metadata.

**2. Then a stable fallback, where a fallback is honest.** The three families deliberately behave
differently, and the difference is about what your data actually asserted:

| | if the word is unknown | if there is no word at all |
| --- | --- | --- |
| **Crop** | a stable hash picks a habit | — a crop row always draws; the plant is standing there either way |
| **Weather** | a stable hash picks a glyph — you asserted the weather was worth recording | **nothing is drawn.** A game with no weather model does not get a year of invented rain |
| **Feast** | **nothing is drawn** | **nothing is drawn** |

**A festival is never guessed.** Most days are not feasts, so the card only means anything while it
is rare — and a card your data never asked for is a lie printed in gold on the player's calendar.

**Every fallback is stable.** The same record always draws the same page: the seed is the almanac's
title and year and nothing that can change during a playthrough, so planting a crop does not
reshuffle the art on a page the player is using to find their way around.

---

## 4. The derivation — why it drew what it drew

`Compose` hands back a `PageDerivation`, and the editor window prints it:

```csharp
foreach (CropDerivation c in how.Crops)
    Debug.Log($"{c.Record.Name} -> {c.Form.DisplayName} at {c.Stage} " +
              $"({(c.FormSource == MarkSource.ByName ? "your word" : "derived")})");
```

That distinction is the one you need when a crop draws the wrong plant: if it says **your word**,
the corpus matched something in the name and you can change the name or the corpus; if it says
**derived**, nothing matched and adding one word fixes it. A generator that cannot explain itself is
one you end up fighting.

---

## 5. Adding your own marks

Every mark is an id, the words that select it, and a drawing function. Adding one is a single entry:

```csharp
new Mark("weather.ashfall", "Ashfall",
    new[] { "ashfall", "ash", "cinders", "fallout" },
    (ink, c) => { /* draw it with GlyphKit and Ink */ });
```

Read `Runtime/Mark/MarksWeather.cs` for sixteen worked examples. The shape vocabulary is in
`Runtime/Mark/GlyphKit.cs` and the rasteriser in `Runtime/Core/Ink.cs`; both are commented for
someone extending them rather than for someone who wrote them.

**Three rules the shipped corpus follows, and the reasons are in the source:**

- **Lead with a large filled shape.** These are struck at roughly a twentieth of the page's width in
  the year grid. A mark made of thin strokes is a smudge at that size.
- **Words are matched whole-word, and a word belongs to exactly one mark in a family.** Adding a
  duplicate throws at construction rather than silently tossing a coin between two drawings. An
  underscored key also throws, because no token can ever equal it and the mark would be unreachable.
- **`GlyphKit.AuthoringChecks`** is public for exactly this: turn it on and `Plate` records anything
  its own `bounds` rectangle is cutting. A bounds rectangle that is too small does not throw and does
  not draw nothing — it draws a plausible *fragment* with a correct outline along the cut, so it
  looks deliberate. Every mark in the shipped corpus passes it.

---

## 6. Performance, measured

**A full page is not free and this section will not pretend otherwise.** On the development machine
a 760×1040 page composes in about **2.4 seconds**, and the package's own timing test measures and
prints that figure on every run. Where it goes, from the composer's own profile:

```
ground 278 ms · plate + masthead 93 · ornament bands 7 · moon strip 74 · calendar grid 1131 · crop strip 812
```

The grid and the crop strip ARE the marks, and the marks cost what they cost because of what they
are: a single frost frond evaluates roughly fifty distance functions per subsample. That is the
whole reason the art holds up, so the answer is not to make it cheaper but to compose it at the
right moment:

- **Compose the page the player is looking at, keep it, and let the others wait.** The demo does
  exactly this — and it composes on the frame *after* the first one is presented, so the screen
  appears immediately and the page arrives a moment later instead of blocking the load.
- **Tiles are cached** across composes for the weather glyphs, feast cards, moons and ornament, so
  the second and subsequent pages are markedly cheaper than the first. (`PageComposer.CachedTiles`
  reports the count; `ClearTileCache()` drops them if you edit the corpus at runtime. Crop marks are
  deliberately *not* cached — each row carries its own jitter and a cache would flatten it.)
- **Cost scales with the page's pixel count.** Halving the width is roughly a quarter of the work.
  The demo composes at 560 px wide for that reason.
- **`PageComposer.Profile = true`** prints the breakdown above for your own project. "The page is
  slow" is not an actionable report; that line makes it one.

The figures above are from one machine on one day. **Quote the number your own test run prints, not
this one.**

---

## 7. What is in the package

```
Assets/CSAF/Almanac/
  Runtime/
    Core/      Hash, Ink (the software rasteriser), Words (the tokeniser), AlmanacPalette
    Mark/      Mark, Corpus, GlyphKit, and the five mark files that are the corpus
    Model/     AlmanacRecord, SampleYear, Derive, AlmanacAsset
    Page/      PageLayout (every measurement, once), PageComposer
  Editor/      AlmanacWindow - preview, derivation panel, PNG export
  Demo/        AlmanacDemo.unity and its script
```

Every script is in a named, platform-constrained assembly definition. **There is no `Resources`
folder**, deliberately: anything under `Resources` is pulled into every one of your builds whether
you reference it or not.

Requires **Unity 2022.3 or newer**. Editor-only? No — the composer is runtime code and works in a
build, on any render pipeline, because it never touches one.

---

## 8. Licence, support and disclosure

`LICENSE.txt` in this folder is the licence. In short: use it on everything you build, the pages it
draws for you are yours with no attribution and no royalty, and the tool itself is not for resale.

**AI disclosure:** the source and the store imagery were produced with AI assistance, declared
truthfully on every storefront. The artwork is **not** produced by an image model — it is drawn by
the software rasteriser in this package from the hand-authored corpus described above, offline,
with no network call anywhere in the art path.

Support is through the storefront you bought it from. Documentation is published at the link on the
listing, and this file ships in the package because a readme you cannot read until after you buy is
not documentation.

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
