# Stele — Carved High-Score Monument — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Stele — Carved High-Score Monument  
**Engine:** Unity 6  
**Docs published:** 2026-09-04


---

# Stele — the carved records monument

**Your leaderboard already works. It just has nothing to show.**

Stele takes a plain list of scores and cuts it into a records monument — a shaped stone or brass
board with a real margin, an order emblem beside every entry, a feat device saying what the record
was *for*, and the names and scores struck into the face as carved letterforms.

It ships **48 hand-authored marks** across four families and **seven stocks**. Nothing is an
imported image. There is no atlas, no sprite sheet, no font and no shader — every mark, the face
treatment, the margin band and every letter are drawn in code by a software rasteriser included in
this package.

---

## What this is not

**It is not a leaderboard backend, and it deliberately does not compete with one.**

Nakama, PlayFab, Steam, Unity Gaming Services, dreamlo, EpicLeaderboard and RankHub all already own
score storage, and most projects have picked one. Stele integrates with none of them, on purpose.
You hand it a `List<RecordEntry>`; where that list came from is not this package's business.

That also means there is no SDK to install, no service to configure, no async call and no failure
mode. Fill the list from your cloud provider, from `PlayerPrefs`, from a JSON file, or by hand.

---

## Thirty seconds to your first monument

```csharp
using CSAF.Stele;

var board = new Board { Title = "HALL OF RECORDS", Subtitle = "ENDLESS", Stock = Stock.Slate };
board.Entries.Add(Records.Entry(1, "VESPER",   Records.Points(1284900), "champion", "flawless"));
board.Entries.Add(Records.Entry(2, "HOLLOWAY", Records.Points(1190455), "crown",    "speedrun"));
board.Entries.Add(Records.Entry(3, "MARROW",   Records.Points(1043220), "star",     "kills"));

Texture2D monument = SteleBoard.Compose(board, 700, 1100);
myRawImage.texture = monument;   // you own it; Destroy() it when you are done
```

Or open **Window ▸ CSAF ▸ Stele**, type your own rows in, and watch it cut. That window is the
fastest way to find out which of your words the corpus knows.

---

## The two axes, and why there are two

| axis | what it is | where it lives |
| --- | --- | --- |
| **Stock** | the material the whole board is cut, cast or lit in | `Board.Stock` — one per board |
| **Order** | the standing of one entry | `RecordEntry.Standing` — one per row |

Seven stocks × eight orders is **fifty-six distinct emblem renderings** before a single feat device,
margin motif or ground treatment is chosen. The two axes are independent on purpose: a first place
on a practice board is not a first place on the hall's own stone, and a palette swap alone would
give you one board tinted seven ways.

### The seven stocks

| stock | what it looks like | the letters |
| --- | --- | --- |
| `Slate` | dark, cool, fine-grained | **gilded** — pale, because a shadow-cut letter in dark stone cannot be read |
| `Sandstone` | warm, pale, weathered soft | dark brown, shadowed |
| `Marble` | the palest stock, cool and veined | near-black, shadowed |
| `Granite` | mid-value, neutral, speckled | very dark, shadowed |
| `Brass` | warm cast metal, brushed | engraved and blacked |
| `Obsidian` | near-black glass | bright inlay, maximum contrast |
| `Cathode` | phosphor on black glass | **emitted** — an arcade cabinet's own board |

`Cathode` is deliberately off the ladder. It is not "better than obsidian", it is a different
century, and it exists so the set does not read as a single gradient.

---

## The corpus — 48 marks

| family | count | what it does | fallback when your word matches nothing |
| --- | --- | --- | --- |
| **Orders** | 8 | the rank emblem beside an entry | a stable hash — every listed entry has a standing |
| **Feats** | 16 | what the record was *for* | ⛔ **none — no device is cut** |
| **Rules** | 14 | the carved margin band | a stable hash from the board title |
| **Grounds** | 10 | the face treatment of the stock | an apt default per stock |

> **Why the feat family has no fallback, and why that matters to you.**
> A feat device makes a claim about what a number *means*. If an unrecognised category fell back to
> a hash, a lap time could be cut with crossed blades beside it, and your players would read that as
> a statement about their run. So an unmatched feat draws **nothing**, and the row simply sets flush.
> Orders are the opposite — every entry on a board has *some* standing — so those always resolve.

### Words the corpus knows

Matching is **whole-word and case-insensitive**, against your own strings.

**Orders** — `laurel champion victor first` · `crown sovereign king queen monarch` ·
`star starred ace elite` · `chevron chevrons veteran service` · `palm triumph ovation` ·
`oak endurance steadfast` · `rosette ribbon prize award` · `bar ranked listed placed`

**Feats** — `speed speedrun fastest time swift rush` · `endurance survival longest duration stamina` ·
`flawless perfect unbroken clean spotless` · `deathless nodeath immortal untouched hitless` ·
`combo chain multiplier linked` · `streak consecutive run tally wins` ·
`depth deepest floor descent dive` · `height highest altitude summit peak climb` ·
`distance furthest farthest mileage travelled` · `accuracy precision hits marksman bullseye` ·
`wealth gold coins riches earnings treasure` · `slayer kills slain defeated hunter vanquished` ·
`explorer explored discovery mapped compass charted` · `builder built crafted construction mason` ·
`survivor survived endured withstood held` · `first founder pioneer earliest inaugural`

If a word you need is missing, add it — `Runtime/Mark/Marks*.cs` is raw, commented source and the
licence explicitly permits extending the corpus.

---

## The top three rows are a different shape

A board of *N* identical rows is a spreadsheet with a nice border, however well each row is drawn.
So ranks 1–3 are cut as **honour blocks** at 1.85× the height of a list row, with a full-size emblem
and larger lettering; ranks 4 and below are compact rows.

The field is divided in **units**, not in fixed pixels, so a board of three entries is three big
blocks and a board of twenty is three blocks and seventeen tight rows — with no dead space at the
foot either way.

---

## Weathering, and the thing your leaderboard already knows

`RecordEntry.SetAtTicks` is optional. When you supply it, every row's wear is derived from **its own
age against the oldest record on the board** — so a wall of long-standing records reads uniformly
rubbed, and one fresh entry among them is visibly newly cut.

```csharp
Records.Entry(1, "VESPER", "1,284,900", "champion", "flawless", setAt: DateTime.Now.AddDays(-410));
```

Leave the dates out and wear falls back to rank depth, more gently, so an undated board still varies
without pretending to information it does not have.

---

## Scores are strings, on purpose

`RecordEntry.Score` is a `string` you have already formatted. A score can be points, a lap time, a
depth, a currency amount or a percentage, and each formats and localises differently — formatting it
inside this package would mean owning a localisation problem it has no business owning, and getting
it wrong in your locale.

`Records.Points(long)` and `Records.Clock(double)` are there for the two common cases and are
entirely optional. Both are **invariant-culture** deliberately: a board is a picture, and a score
that changes its punctuation with the player's OS locale makes two screenshots of the same record
disagree.

---

## Composing off the main thread

A board is composed when a score screen opens — often the frame after a run ended, which is exactly
when a stutter is least forgivable. So the work splits:

```csharp
SteleBoard.Warmup();                       // ONCE, on the main thread, at load

// ...on a worker thread:
BoardBake bake = SteleBoard.Bake(board, 700, 1100);   // pure arithmetic, no Unity API

// ...back on the main thread:
Texture2D tex = SteleBoard.ToTexture(bake);
```

`Warmup()` composes and discards a tiny board. That matters more than it looks: the expensive part
of a first composition is the runtime compiling the rasteriser itself, and none of that happens
until something actually *draws*. A warm-up that only builds data would not do it.

⚠️ Call `Warmup()` on the main thread **before** any worker bake. The corpora are lazily built, and
two threads racing to build one produces a plausible board with a mark missing rather than a crash.

---

## Performance

Cost is **linear in pixel count** — a board twice as wide and twice as tall is four times the work.

MEASURED on Unity 6000.5.7f1 in batch mode on one Windows workstation, composing the eight-entry
sample board this package ships:

| board size | pixels | composed in | µs per 1,000 px |
| --- | --- | --- | --- |
| 300 × 470 | 141,000 | 3.19 s | 22.6 |
| 620 × 980 | 607,600 | **12.6 – 13.7 s** (seven stocks) | 20.7 – 22.5 |

The two sizes differ by 4.31× in pixels and 4.08× in time, which is the linearity this section claims
rather than an assertion of it.

Where the time goes, on the 620 × 980 board: **marks ≈ 9.0–10.0 s**, ground ≈ 3.0–4.2 s, type ≈ 0.4 s,
margin ≈ 0.15 s, resolve ≈ 0.02 s. The marks dominate because each emblem and device is a
signed-distance field drawn on its own supersampled surface — which is also why they stay sharp at
any size.

⚠️ **Cheaper levers, in order:** compose smaller (cost is linear in pixels); use fewer honour rows;
and remember that `Warmup()` is not optional — the first composition in a process pays for the
runtime compiling the rasteriser and can cost several times what the second does.

⚠️ These are **observations on one machine, not a ceiling.** A busier machine will exceed them; this
factory has measured the same composition vary by a factor of ten depending on what else was
running. Compose ahead and cache, or bake to a PNG in the editor, rather than composing on the frame
a screen opens.

---

## Requirements and constraints

- **Unity 2022.3 or newer.** No package dependencies, no third-party code, no network access.
- **Render-pipeline agnostic** — Built-in, URP, HDRP or a custom pipeline. There is no shader and no
  material in the art path, so there are no variants to maintain.
- **Ships zero image files and zero fonts.** No atlas, no sprite sheet, no `Resources/` folder.
- Every script is in a named, platform-constrained assembly definition
  (`CSAF.Stele.Runtime`, `CSAF.Stele.Editor`, `CSAF.Stele.Demo`).
- **Deterministic.** The same board yields byte-identical pixels on every machine and every run.
- The texture returned by `Compose`/`ToTexture` is **yours** — call `Destroy()` on it when you are
  finished with it. The package never caches or frees it for you.

## Characters the face can cut

A–Z, 0–9, and common punctuation. Lower case is folded to upper.

A line is **refused whole rather than cut with a character missing** — a misspelled name is worse
than a blank one, because nothing about it looks wrong. Ask before you compose:

```csharp
if (!TypeSetter.CanStrike(name))
    Debug.Log($"cannot cut '{TypeSetter.FirstUnstrikeable(name)}'");
```

The editor window reports every refusal, by row and by character.

## Demo scene

`Assets/CSAF/Stele/Demo/Scenes/SteleDemo.unity` — open it and press Play. Left and right arrow keys
re-cut the same eight scores in each of the seven stocks. It needs no Canvas, no EventSystem and no
UI package, so it runs identically in a blank project on any pipeline.

---

## Support

Questions, corpus requests and bug reports: the documentation page linked from this product's store
listing carries the current contact route.

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved. See LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
