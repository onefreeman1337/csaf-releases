# Errantry — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Errantry  
**Engine:** Unity 6  
**Docs published:** 2026-08-30


---

# Errantry

**Point it at a quest your game already knows about — its kind, its region, its giver, its
difficulty, where it sits in its chain and whether it is done — and it draws the finished illuminated
journal page.** The errand gets its own device, the region its own painted roundel, the giver a
pressed wax seal, the title an illuminated initial, the difficulty a border of its own construction,
and the whole sheet is repainted by whether the quest is offered, in hand, discharged, lost or
abandoned.

Nothing in that page is a stored image. There is **no PNG, no atlas, no sprite sheet, no shader and
no material anywhere in this package**. It is all drawn in code, at runtime or in the editor, from a
corpus of **80 hand-authored forms** you can read and edit: 14 errand devices, 10 region roundels,
8 giver seals, 8 marginalia, 26 illuminated initials, 5 border tiers, 5 state treatments and 4 chain
ornaments.

**Errantry draws no text.** It ships no font, measures no string and renders no words. It draws the
page and hands you back the rectangles where your own `Text`, `TextMeshPro` or IMGUI label belongs,
so your fonts, your localisation and your rich text stay exactly as they are.

---

## 1. The five minutes that get you a page

1. Open **`Assets/CSAF/Errantry/Demo/ErrantryDemo.unity`** and press **Play**. It draws a page from
   the built-in twelve-quest sample journal and prints what it decided and how long it took. Click,
   or press the arrow keys, to turn to the next quest.
2. Open **Window ▸ CSAF ▸ Errantry**. Press **Compose**. Same page, plus the derivation panel —
   which tells you which of *your own words* selected each mark and which fell through to a derived
   one.
3. Make your own: **Create ▸ CSAF ▸ Errantry ▸ Journal**, fill in some quests, drag the asset into
   the window's **Journal** slot, press Compose.

From your own code it is three lines:

```csharp
var composer = new PageComposer();                       // ONE composer, kept, for the whole journal
PageCanvas page = composer.Compose(quest, PageOptions.Default(), out PageReading reading);
Texture2D texture = page.Resolve("Quest Page");
```

`PageReading` is worth reading. It carries every decision the composer made, the compose time in
milliseconds measured on your machine, and how many mark tiles were rasterised versus served from
the cache.

---

## 2. The data you give it

`QuestRecord` is deliberately the record every quest system already has. Nothing here asks you to
author new data.

```csharp
var quest = new QuestRecord {
    Title       = "The Wyrm of Ashcombe",  // its first letter becomes the illuminated initial
    Kind        = "slay",                  // selects the errand device
    Region      = "the greenwood",         // selects the roundel AND tints the whole page
    Giver       = "the crown",             // selects the wax seal
    Difficulty  = 5,                       // 1..5: border tier, marginalia count, initial weight
    ChainStep   = 1,                       // where in a chain this sits
    ChainLength = 1,                       //   ...and how long the chain is
    State       = QuestState.Completed,    // repaints the whole sheet
};
```

`Tags` is optional: extra words (objectives, keywords) that can select a mark. They are never drawn.

**Your words win over any heuristic.** `Kind`, `Region` and `Giver` are matched **whole-word**
against the corpus, and your word is preferred to anything derived. Nothing matched? You still get a
page: the choice falls back to a stable hash of the record, so an unknown kind always draws the
*same* device, on every machine and every run. A journal that reshuffles between sessions would be
unusable, so it cannot happen.

Words each family knows (a phrase is fine — "the deep mire" matches `mire`):

| field | some of the words |
| --- | --- |
| `Kind` | slay · stalk · escort · deliver · gather · rescue · investigate · bounty · explore · defend · craft · bargain · rite · pilgrimage |
| `Region` | forest · coast · mountain · city · ruin · mire · desert · cavern · plain · frost |
| `Giver` | king · temple · guild · watch · thief · mage · druid · farmer |

Each of those has seven to eleven synonyms; the full lists are in
`Runtime/Mark/Marks*.cs`, in plain arrays you can edit.

---

## 3. Where your text goes

`PageLayout` hands back every rect in **normalised UV with the origin at the bottom left**, which is
what Unity UI takes — no conversion, no flip.

```csharp
var layout = new PageLayout(page.Width / (float)page.Height);
titleText.rectTransform.anchorMin = layout.Title.AsUv().min;
titleText.rectTransform.anchorMax = layout.Title.AsUv().max;
```

| rect | what belongs there |
| --- | --- |
| `Title` | the quest's name, in the heading band between the roundel and the device |
| `Opening` | the first lines, beside the illuminated initial (optional — see below) |
| `Body` | the description, on the ruled writing lines |
| `Footer` | the reward, the giver's name, whatever closes the entry |
| `Initial`, `Seal`, `Region`, `Errand` | what the product draws. Nothing of yours belongs here. |

The simplest integration ignores `Opening` and uses `Body` alone: the initial then sits in its own
space above your paragraph, which is a perfectly normal manuscript treatment. `Opening` is there if
you want the text to wrap the initial.

---

## 4. What your data actually changes

This is the whole point of the product, so it is worth being exact about it.

| your field | what changes on the page |
| --- | --- |
| `Kind` | the errand device in the top right |
| `Region` | the painted roundel in the top left **and the tincture of the entire page** — its parchment, its ink, its border and its gold |
| `Giver` | the wax seal at the foot, pressed with that faction's device |
| `Title` | the illuminated initial: a hand-authored letterform on a gilded, vined panel |
| `Difficulty` | the border **construction** (a hairline rule at 1, a thorned and crowned frame at 5), how many marginal drolleries appear, and the stroke weight of the initial |
| `ChainStep` / `ChainLength` | the chain ornament across the head of the page — an open ring, filled links behind you, a gilded current link, a closing knot at the end. Past nine steps it summarises rather than drawing an uncountable dashed line. |
| `State` | the treatment of the **whole sheet**: pin holes and a cool wash when offered, a loose ribbon and a thumbed corner when active, gilding and a tied ribbon when completed, a struck-through red stroke with a scorched edge and a cracked seal when failed, and an illumination that stops part-way with the page fading out when abandoned |

---

## 5. Performance, in numbers you can reproduce

A page is a large picture, and a mark is small. Errantry rasterises each mark as its **own tile** and
blits it, so a mark's distance field is never evaluated over the whole page. Tiles are **cached by
what they derive from** — mark, tincture, size, weight — so a journal of twenty quests in the same
wood rasterises that roundel once.

**Keep one `PageComposer` for the whole journal.** Constructing one per page still renders correctly
and throws the cache away silently. `PageReading.TilesDrawn` and `PageReading.TilesCached` are
reported on every compose so you can see it rather than take our word for it.

**Measured on the machine that built this package** (Unity 6000.5.7f1, EditMode suite, and printed
into the log on every run — these are stopwatch readings, not estimates):

| page | time |
| --- | --- |
| **720x1000** (`PageOptions.Default()`), cold cache | **4.5 s** |
| **720x1000**, warm composer | **2.7 s** |
| **259x360** (a journal index thumbnail) | **161 ms** each across twelve pages |
| a repeated derivation | **0 tiles rasterised** — every mark came from the cache |

Read those numbers the way they are meant: this is a **software rasteriser drawing a large picture**,
not a shader. Compose a page when a quest CHANGES, keep the `Texture2D`, and never call it in
`Update`. A full-resolution page is something you generate once and keep; the small sizes are fast
enough to draw a whole journal index at load.

`PageOptions.Preview()` composes markedly faster and takes exactly the same code path — what you
approve in the preview is what you ship.

---

## 6. What is in the package

```
Runtime/Core/        Hash, Ink (the software rasteriser), PagePalette (8 authored ramps)
Runtime/Mark/        the corpus: errands, regions, seals, marginalia, the 26 initials
Runtime/Model/       QuestRecord, ErrantryAsset, the 12-quest sample journal
Runtime/Page/        the composer, the canvas, the layout, the borders, the state treatments
Editor/              the Errantry window
Demo/                a scene you press Play on
```

Three assemblies (`CSAF.Errantry.Runtime`, `.Editor`, `.Demo`), each with its own asmdef, so nothing
here is compiled into your game unless you use it. Editor code is Editor-only. There is no
`Resources/` folder, because one would bloat every build you ship whether you used this or not.

**Unity 2022.3 or newer.** No third-party dependencies. No render-pipeline dependency: the output is
a `Texture2D`, so it works on Built-in, URP and HDRP alike, and in UI, on a quad, or written to disk.

---

## 7. Honest limits

- **It does not lay out text, and will not.** See §3. If you need words on the page, you place them.
- **The corpus is fantasy-medieval.** A sci-fi project can use the mechanism — the code is plain and
  readable — but the 80 authored forms are a manuscript vocabulary, not a universal one.
- **Composing is not free.** It is a software rasteriser: compose when a quest changes, cache the
  texture, and do not call it every frame. The demo scene prints its real cost on your machine.
- **The page is portrait by default** (`PageOptions.AspectRatio`, 0.72). Landscape works; the layout
  was authored for a leaf.

---

## 8. AI disclosure

This package was produced with AI assistance. **Code: yes. Graphics: yes** — every mark is
procedural, written in the C# you can read in `Runtime/Mark/`, and no generative image model was
used at any point. **Sounds: none.** **Text and dialogue: none** — the package renders no words.

---

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved. See `LICENSE.txt`.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
