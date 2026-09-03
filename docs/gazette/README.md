# Gazette - the in-game newspaper — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Gazette - the in-game newspaper  
**Engine:** Unity 6  
**Docs published:** 2026-09-03


---

# Gazette

**Hand it the events your game already recorded — what happened, where, who did it and how much it
mattered — and it prints the newspaper.** The biggest story becomes the lead under a struck
headline, its subject becomes a woodcut, the rest of the day fills the columns around it, the
weather word becomes a device in the weather box, and the whole sheet is pulled on one of several
presses so a run of issues reads as one paper rather than as a set of unrelated pictures.

Nothing on that page is a stored image. There is **no PNG, no atlas, no sprite sheet, no shader and
no material anywhere in this package**. Every mark is drawn in code, at runtime or in the editor,
from a corpus of **74 hand-authored forms in thirteen families** you can read and edit: news cuts
for war (8), statecraft (6), mourning (4), ruin (6), trade (5), society (5), learning (5), public
works (4) and the countryside (5), plus 6 advertisement blocks, 8 weather glyphs, 8 typographic
ornaments and 4 masthead devices.

**Gazette draws its own type.** The masthead, the headlines, the datelines, the bylines, the weather
box, the advertisements and the folio are struck as real letterforms from a display face included in
this package — no font asset, no TextMeshPro dependency, no `Text` component anywhere on the page.

---

## 1. The five minutes that get you a newspaper

1. Open **`Assets/CSAF/Gazette/Demo/Scenes/GazetteDemo.unity`** and press **Play**. It composes a full
   issue from the built-in sample events and prints what it decided — which story led, which cut
   each one got, and how long the page took on your machine.
2. Open **Window ▸ CSAF ▸ Gazette**. Edit the masthead, the dateline, the weather or any event, and
   the page recomposes. The panel underneath tells you which of *your own words* selected each cut
   and which fell through to a derived one. **Export** writes the sheet to a PNG.
3. Point it at your own event log. From your own code it is a handful of lines:

```csharp
var issue = new GazetteIssue {
    Masthead = "THE FENN CHRONICLE",
    Motto    = "PRINTED WEEKLY AT THE SIGN OF THE BELL",
    Dateline = "DAY 41 OF THE THIRD SPRING",
    Price    = "ONE PENNY",
    Weather  = "gale",
    Press    = Press.Broadside,
};
issue.Events.Add(new EventRecord("THE SIEGE OF ASHGATE IS LIFTED", 92, "siege") {
    Place = "Ashgate", Actor = "Captain Vell", Count = 1,
});
issue.Events.Add(new EventRecord("GRAIN PRICES FALL A THIRD", 40, "price"));

Texture2D page = GazettePage.Compose(issue, 1200, 1600);   // you own it; Destroy it when done
```

`EventRecord` and `GazetteIssue` are plain serialisable classes. Copy your own log entries into
them — they are deliberately the shape an event log already has.

---

## 2. What decides what

| What you give it | What it draws | If nothing matches |
| --- | --- | --- |
| `Kind` | the named cut, always winning over the prose | falls through to `Tags` |
| `Tags` | a cut named by one of your own tags | falls through to `Report` |
| `Report` | a cut named by a word in the headline | **no cut at all** — the story sets as plain type |
| `Place` | the story's dateline, e.g. `ASHGATE.` | no dateline |
| `Actor` | the byline under the dateline | no byline |
| `Weight` | which story leads, and the issue's tenor | 0, i.e. a filler item |
| `Count` | how much happens inside the cut | drawn as once |
| `Weather` | one of 8 weather devices | a device from a stable hash |
| `Press` | the sheet's whole palette and paper | Broadside |

Matching is **whole-word and case-insensitive**, over every word in the field, in the order
`Kind` → `Tags` → `Report` → `Place`. The first token that hits wins.

⛔ **A story whose words name nothing in the corpus gets NO cut, and that is deliberate.** Every
other choice on the page falls back to a stable hash; a story cut does not. A cut is a *claim about
what happened*, so a headline about a bridge that fell through to a hashed device would print a
siege over it. An unrecognised story sets as a headline and type, which is what a real paper did
with a story it had no block for.

**Everything else always draws.** An issue with no weather word, no masthead and one event still
composes a complete sheet, because every remaining choice is keyed on the issue itself. The same
log prints the same paper every time your game runs.

---

## 3. The one failure that is silent, and the one call that removes it

The display face refuses a line it cannot strike rather than misspelling it, so **a single
unsupported character costs the whole headline** — and a missing headline looks like a layout bug
rather than a character-set problem.

```csharp
char bad = issue.Unstrikeable(out string where);
if (bad != '\0') Debug.LogWarning($"Gazette cannot strike '{bad}' in {where}");
```

Call it once in your own test and the entire class of defect disappears. It reads only the lines
that are STRUCK — body copy is set as type texture and carries no glyphs, so a character that
appears nowhere but a paragraph is not a problem and is not reported.

---

## 4. Why the body copy has no letters in it

The body is set as **type texture**: bars of the right length, in the right rhythm, with real word
spacing, a paragraph indent and a short last line — not strings.

This is a design decision, not a shortcut, and it is stated here rather than left to be discovered.
A broadsheet column is roughly eight point type. On a 1200-pixel page that is about four pixels of
cap height, and four pixels of cap height is not small text — it is a grey line with noise on it.
Striking real letters at that size costs a signed-distance evaluation per letter per pixel to
produce something no reader can read and that looks *worse* than the grey it is imitating.

So the division is the one a nineteenth-century compositor made: display type struck by hand, body
set on a machine. Everything a reader actually reads at page size — masthead, headlines, decks,
datelines, weather box, advertisements, folio — is real type, and it holds up when a player zooms
into the headline.

The word lengths are drawn from the real distribution of English word lengths rather than from a
uniform random. Uniform lengths produce a texture that reads as a barcode, which is the single
commonest tell of a fake newspaper.

---

## 5. What is in the package

```
Assets/CSAF/Gazette/
  Runtime/
    Core/      the rasteriser, the palettes and the presses
    Mark/      the 74-form corpus, in ten family files, plus the drawing kits
    Model/     EventRecord, GazetteIssue and the ScriptableObject wrapper
    Page/      the composer, the page measurements and the type texture
    Type/      the display letterforms and the setter
  Editor/      the Gazette window
  Demo/
    Scenes/    GazetteDemo.unity
    Scripts/   the demo behaviour
```

Every script is in a named, platform-constrained `.asmdef`. There is **no `Resources/` folder** —
that folder is loaded into every build whether or not it is used, and shipping one would grow your
build for a tool you may only run in the editor.

`PageLayout` is the only place a page measurement exists. The composer reads its columns from it,
the flow reads its leading from it, and the tests import those numbers rather than restating them.

---

## 6. What it costs to print a sheet

**Gazette rasterises on the CPU, so a sheet takes seconds, not milliseconds.** These are real
measurements, taken by importing this package into a blank Unity 6000.5.7f1 project and composing
the built-in sample issue — the span across two runs on the same machine, warm:

| sheet | pixels | measured |
| --- | --- | --- |
| 600 × 800 | 0.48 MP | 8.3 – 10.3 s |
| 900 × 1200 | 1.08 MP | 18.0 – 21.3 s |
| 1200 × 1600 | 1.92 MP | 23.0 – 27.8 s |
| 1400 × 1860 | 2.60 MP | 23.3 – 28.4 s |

⚠️ **The high figure is an observation, not a ceiling.** Those two runs were taken on one shared
workstation and differ by 20–24% purely because the second one had more competing for the CPU — so
a busier machine than ours will take longer than the top of that range, and a quiet one will beat
the bottom of it. Treat the shape as the useful part, not the digits, and measure on your own
target if the number matters to your design.

Cost rises steeply with pixel count but not by a clean rule, because the column layout changes with
the sheet size: **four times the pixels cost about 2.7 times the time** (measured 2.75× and 2.69×
on the two runs), not four times.

**So do not compose a page on a frame a player is watching.** Two patterns work, and the demo scene
ships the first one running:

1. **Compose on a worker thread.** `GazettePage.Bake` returns an `Ink` and touches no Unity object,
   so it is safe off the main thread; call `GazettePage.Warmup()` once on the main thread first, and
   resolve the `Ink` to a `Texture2D` on the main thread when it is done.
2. **Compose when the day ends and cache the texture** — print the paper at the moment the events
   stop changing, then simply show it when the player opens it.

Either way the player sees a finished newspaper instantly. Proof small in the editor window and
export large.

---

## 7. Compatibility

- **Unity 2022.3 LTS and newer.** Built and gated on **6000.5.7f1**.
- **Every render pipeline.** Gazette rasterises on the CPU into a `Texture2D` and uses no shader,
  no material and no camera, so Built-in, URP, HDRP and a custom pipeline are all the same to it.
- **No third-party dependencies.** No TextMeshPro, no font asset, no package-manager entries.
- **No network calls of any kind.** It writes a file only when you press Export and choose a path.

---

## 8. Licence, in one line

Use it on unlimited projects, keep 100% of your revenue, and **ship the pages it prints inside your
game freely** — they are yours. Don't resell the tool, and don't repackage the generated artwork as
a standalone art pack. Full terms in `LICENSE.txt`.

---

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
