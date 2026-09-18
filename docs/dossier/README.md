# Dossier — Generated Case File Page — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Dossier — Generated Case File Page  
**Engine:** Unity 6  
**Docs published:** 2026-09-18


---

# Dossier — the case file spread, generated from your case data

![Dossier: a bond sheet clipped to a manila board, struck with the package's own CASE FILE stamp](https://raw.githubusercontent.com/onefreeman1337/csaf-releases/main/docs/dossier/readme_header.png)

**Your mystery game already knows its suspects, clues and statements. Dossier types them up.**

Hand Dossier a case — people, evidence, statements — and it composes an open manila case file on a
lamp-lit desk: a suspect roster typed onto a printed form with a booking photograph beside every
name, an evidence index with redaction bars wherever your data says a fact is unknown, carbon copies
and telex strips for the statements, rubber stamps struck in red, a paperclip, a strip of evidence
tape, and the investigator's red-pencil marks in the margins.

It ships **52 hand-authored motifs in 10 families** and **4 paper stocks**. None of it is an imported
image: every sheet, stamp, clip and line of type is drawn in code by a software rasteriser included
in this package, and the lettering is filled from the outlines of three real typefaces (Oswald,
Courier Prime, Caveat — SIL Open Font License, shipped in `Typefaces/`).

---

## What this is not

**It is not a detective game framework, and it is not a fixed UI kit.** It does not run your case
logic, deduction or dialogue — keep whichever framework you use. And it does not ship a set of
pre-drawn screens you pour text into: the layout answers the data. Three people get full-width cards
with large photographs; ten get a two-column roster. Seven clues get two lines each with their
descriptions; twenty get a two-column index. A cold case is typed on yellowed, foxed paper; a
classified one on onionskin, redacted hard.

---

## Thirty seconds to your first spread

```csharp
using CSAF.Dossier;

// The four typeface files ship in Assets/CSAF/Dossier/Typefaces — assign them in the Inspector.
[SerializeField] TextAsset display, body, bodyBold, hand;

void Start()
{
    DossierType type = DossierType.FromAssets(display, body, bodyBold, hand);

    var c = new CaseFile { CaseNumber = "HX-1954-0117", Title = "The Lantern Street Fire",
                           Category = "Arson", Status = CaseStatus.Active, OpenedOn = "12 OCT 1954" };
    c.Suspects.Add(new CaseSuspect { Name = "Marguerite Vane", Status = SuspectStatus.Suspect, Age = "34" });
    c.Clues.Add(new CaseClue { Title = "Scorched theatre ticket", Detail = "Bagged at the scene.",
                               Status = ClueStatus.Key, LinkedTo = "Marguerite Vane" });
    // Statements live in c.Testimonies, typed CaseTestimony — they set as carbon copies and telexes.
    c.Testimonies.Add(new CaseTestimony { Witness = "Nora Finch", Method = "Interview", Reliability = 0.8f,
                                          Statement = "Saw her leave before the fire started." });

    Texture2D spread = DossierSpread.Compose(c, type);   // 1920x1080 by default
    myRawImage.texture = spread;                          // you own it; Destroy() it when done
}
```

Or open **Tools ▸ CSAF ▸ Dossier**, pick a case (or one of the four samples) and press **Compose
spread**. The window shows the spread and, beside it, **why it looks like this**: every stamp, clip,
strip of tape and paper choice with the word in your data that chose it, or "derived" where a stable
hash did.

To author a case without code: **Assets ▸ Create ▸ CSAF ▸ Dossier Case File**, fill in the
Inspector, and press **Compose this case in Dossier** at the top of it.

### Off the main thread

A full 1920×1080 spread is not instant, so compose it off the main thread and upload on it:

```csharp
Corpus.Preload();                                                  // main thread, once
SpreadBake bake = await Task.Run(() => DossierSpread.Bake(c, type)); // pure arithmetic, no Unity objects
Texture2D spread = DossierSpread.ToTexture(bake);                  // main thread
```

`DossierSpread.Warmup(type)` composes and discards a tiny spread so the first real one is not also
paying for the runtime compiling the rasteriser.

**Measured cost** (Unity 6000.5.7f1 Editor, whose scripts compile in Debug mode by default, on a
busy build machine): **3.1–4.1 s** per 1920×1080 spread and about **1 s** at 960×540. That is a
sample, not a ceiling — this factory measured identical work a factor of ten apart on a loaded
machine. At 1920×1080 and supersample 1 a composition peaks at roughly 100 MB of transient managed
memory (the drawing buffer, then the resolved and flipped pixel arrays); nothing is kept afterwards
but the pixels you asked for.

---

## What your data does to the spread

| your data | what it draws |
| --- | --- |
| `Category` | the folder tab's colour (see the word table) and, for paper-trail crimes, ledger paper |
| `Status` of the case | the case stamp (PRIORITY, COLD CASE, CASE CLOSED, SOLVED, CLASSIFIED) and the paper (cold → aged, classified → onionskin) |
| `OpenedOn` | the struck RECEIVED date stamp |
| each suspect's `Status` | the stamp across their photograph (SUSPECT, CLEARED, CHARGED, DECEASED in black, MISSING, WITNESS, INFORMANT, PERSON OF INTEREST, UNIDENTIFIED) |
| a suspect's `Name` | the booking photograph's profile (nose, chin, hair, hat, collar, shoulders) — the same name in the same case is always the same person; which way a sitter is TURNED is the roster's, so every third card is photographed facing the other way and a row of nine does not read as one person nine times |
| a suspect's `Note` | a line in the investigator's hand beside the record |
| a suspect's `Portrait` | sepia-graded and corner-mounted instead of the generated photograph (the texture must have Read/Write enabled) |
| a clue's `Status` | a tick (verified), a cross (disputed), a star and an underline (key) |
| a clue's `Detail` | a strip of tape when its own words say so ("bagged", "sealed", "taped", "pinned note") |
| clues found at the same `FoundAt` in a row | a red-pencil bracket round them |
| a key clue's `LinkedTo` | a red-pencil arrow across the spread to that suspect's photograph |
| the most-linked suspect | their name circled |
| a statement's `Method` | a carbon copy (interview, statement) or a telex strip (phone call, telegram, wire, radio) |
| a statement's `Reliability` below 0.4 | a query in the margin, "doubtful" |
| any field that SAYS it is unknown | a redaction bar, weighted by what the fact is |

### Unknown is a word, not a blank

A field that is **empty** is simply not typed. A field that **says** it is unknown — `?`, `unknown`,
`redacted`, `classified`, `withheld`, `protected`, `name withheld` — is blacked out. A sentence that
merely contains the word ("an unknown man in a grey coat") is data and is typed.

| unknown fact | redaction |
| --- | --- |
| a suspect's name, a witness's name, a classified statement, the officer on a classified case | **blocked out** (a double marker pass) |
| an alias, a last-seen place, where a clue was found | **marker bar** |
| an age, an occupation | **struck through** |

---

## The corpus — 52 motifs

| family | count | chosen by |
| --- | --- | --- |
| Stamps | 8 | the status word (box, double rule, round seal, oval, date, slanted banner, cartouche, hazard band) |
| Fasteners | 6 | a stable hash of the case number (gem paperclip, brass owl clip, binder clip, staples, push pin, brass paper fastener) |
| Tapes | 4 | the clue's own words (evidence tape, tamper seal, clear tape, masking tape) |
| Folder tabs | 6 | the case category (manila, red, ochre, steel, sepia, charcoal) |
| Photo mountings | 4 | a stable hash of the case (black corners, kraft art corners, clear film corners, taped) |
| Typed blocks | 5 | a stable hash for suspect cards (printed form, index card, plain), the method for statements (carbon copy, telex) |
| Hand marks | 8 | the evidence (circle, underline, arrow, query, tick, cross, bracket, star) |
| Paper stocks | 4 | category and status (bond, aged, onionskin, ledger) |
| Stains | 4 | the file's age (coffee ring, thumbprint, fold crease, torn edge) |
| Redactions | 3 | what the unknown fact is (struck through, marker bar, blocked out) |

**Show the motif sheet** in the editor window draws every one of them from the shipped code.

### Words that choose a folder tab

| tab | words in `Category` |
| --- | --- |
| red | homicide, murder, assault, violent, violence, manslaughter, killing |
| ochre | theft, burglary, robbery, heist, larceny, stolen, break |
| steel | missing, disappearance, kidnapping, abduction, runaway, vanished |
| sepia | fraud, forgery, embezzlement, financial, smuggling, counterfeit, extortion |
| charcoal | espionage, conspiracy, cult, occult, paranormal, arson, sabotage |
| manila | general, misc, miscellaneous, records, civil |

Words are matched **whole**: "Unarmed robbery" chooses ochre through *robbery*, never anything
through *arm*. A category that names none of them gets a tab chosen by a stable hash of the case.

---

## Nothing is struck over a name

Every name, title and file number is recorded as it is typed, and every stamp, clip, strip of tape
and coffee ring is placed by searching candidate spots for one that misses them. Four things are
refused outright at any price: a **name or title**, a **face**, the **chalked placard** on a booking
photograph (it carries the file number, and red ink over near-black is not a mark), and a **solid
redaction bar** (the one mark that says this file is withholding something). Typed values, the
photographs and the other marks are costs rather than refusals, so a stamp may lean across the corner
of a form — the cheapest spot wins, and the stamp comes in five sizes so a crowded card gets a
smaller one rather than a legend struck through an occupation.

The field **labels** (NAME, AGE, OCCUPATION, LAST SEEN) are costed too, and deliberately below the
values: a label names the box, a value is the record, so a stamp will step off a label if it can and
cross one before it crosses what the file says. The **handling marks** are costed in both directions
— a coffee ring keeps off the stamps already struck, and the stamps struck afterwards keep off the
ring, so two marks in the same red-brown register never stack into what reads as a printing fault.

When no size clears the record, the stamp is struck below it on bare paper, never centred on a
photograph, and every candidate is slid back onto the sheet rather than left hanging off it. A stamp
also keeps out of the NEXT person's record: a seal sitting in the empty top of the card below reads
as belonging to that person, so another card's band is costed too, below the labels — leaning into
the bare gutter between cards stays cheaper, because that is what a clerk's stamp really does.
The editor window lists what was left out and why. `SpreadBake.Placed`, `.Protected`, `.Typed`,
`.Labels`, `.Placards` and `.Bars` publish every footprint so you can check all of this yourself.

### The red-pencil arrow is placed by the same search

The leader ruled from a key clue to the person it names is the one mark that crosses the whole spread,
and it goes through the same search as the stamps: every aim point on the photograph — its top, its
outer edge, its foot — from several starts along the clue's number, both directions of the hand's
bow and two arc depths, costed against the roster's count, the names, the values, the labels, the
faces, the placards and the bars. A route that crosses nothing wins before cost is consulted. When a
crowded card leaves no clear approach to the photograph, the arrow stops at the **circled name**
instead of ruling through the record, and the editor window says which of the two it did and what the
route runs over. `SpreadBake.Leaders` publishes each arrow's crossings, by class, in samples of path.

### The fold crease is not allowed to read as a strike-through

A crease runs the full width of a page, and in this file's own vocabulary a thin dark line through a
typed value **means the fact is unknown** (see the redaction table above). So the fold is the
strictest-placed mark in the product: its dark valley is refused outright by a **name**, a **booking
placard** and any **stamp**, a **typed value** costs it the spot, and the candidate heights are the
page's own empty bands — the gutter between card rows, the strip under the last card — before any
hashed one. A page with no band that clears every value simply **has no crease**, and the editor
window says so. Handling marks are decoration; the record is not.

---

## Using the texture

- **uGUI:** `rawImage.texture = spread;`
- **UI Toolkit:** `element.style.backgroundImage = new StyleBackground(spread);`
- **In the world:** `renderer.material.mainTexture = spread;` on a quad lying on your own desk.

The texture has straight alpha. With **Lamp-lit desk** off (`SpreadOptions.Desk = false`) the area
round the folder is transparent, so the file can sit on your own scene's surface.

---

## Demo scene

`Assets/CSAF/Dossier/Demo/Scenes/DossierDemo.unity` — press Play. Four sample cases (3/7/4, 9/20/2,
5/11/3 and 4/6/2 people/clues/statements; active, cold, closed and classified; bond, aged, ledger and
onionskin paper) are composed on a worker thread; **LEFT / RIGHT** page between them. It draws with
`OnGUI`, so it needs no Canvas and runs the same on any render pipeline.

---

## Limitations, stated plainly

- **The font reader is TrueType only.** OpenType-CFF (`.otf`) and WOFF files are refused with a
  message. There is no hinting (the rasteriser antialiases instead) and no kerning table is read;
  the shipped faces were chosen knowing this (Courier Prime is monospaced; the stamps are tracked).
- **No complex-script shaping, and Latin is what the faces are for.** Text is set character by
  character, left to right. A character missing from a face is drawn from Courier Prime; a character
  missing from every shipped face is drawn as the font's placeholder glyph. Scripts that need shaping
  (Arabic, the Indic scripts) will not set correctly — swap in a TrueType face that covers your
  language through `new DossierType(...)` if you need one.
- **The layout sets up to 10 suspect cards, 24 clues and 4 statements** (`SpreadOptions.MaxSuspects`,
  `MaxClues`, `MaxStatements`); the rest are listed as continued on file, never dropped silently.
  More than nine clues are set in two columns.
- The photographs are generated profiles unless you supply portraits.

---

## Package contents

- `Runtime/` — the rasteriser (`Core/`), the font reader and typesetter (`Type/`), the motif corpus
  (`Mark/`), the case model and derivation (`Model/`), and the spread composer and motif sheet
  (`Spread/`). Assembly `CSAF.Dossier.Runtime`, all platforms.
- `Editor/` — the Dossier window and the case asset's Inspector button. Assembly `CSAF.Dossier.Editor`.
- `Demo/` — the demo scene and its component. Assembly `CSAF.Dossier.Demo`.
- `Typefaces/` — Oswald Bold, Courier Prime Regular and Bold, Caveat Regular, as `.bytes` so Unity
  imports them as TextAssets readable at runtime on every platform, and their licences in
  `Third-Party Notices.txt`. Rename a copy to `.ttf` to use a face in your own UI.

No `Resources/` folder, no shaders, no images, no network calls.

Built and tested with Unity 6000.5.7f1.

---

*Dossier · Core Systems Asset Factory. AI disclosure: the code and the store imagery were produced
with AI assistance; the spreads are drawn by the code in this package, not by an image model.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
