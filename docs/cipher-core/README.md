# Cipher Core: Invented Language Puzzle for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Cipher Core: Invented Language Puzzle for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/cipher-core  
**Docs published:** 2026-11-05


---

# Cipher Core — an invented language your players actually learn

**Keep your quest log. This is the language your ruins are written in.**

RPG Maker will happily *show* the player ancient writing — a picture of runes, a switch, a
translated message. What it will not do is make the player **earn** it. Cipher Core hides a real
written language inside your game: glyphs render untranslated in ordinary message windows and on
carved surfaces, the player presses rubbings of what they cannot read into a field notebook,
guesses meanings from context, and the moment a guess is proven the glyph **resolves —
permanently, everywhere, in every text box in the game.** Heaven's Vault and Chants of Sennaar,
as an engine for your project.

And it does not arrive empty: **Eldrin ships in the box** — a complete authored language of
122 glyphs built from 14 radical families, with 10 validation anchors and a 20-inscription story
corpus that is *proven solvable* (see "The puzzle is fair", below).

---

## Install

1. Copy the three files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and add them:

   | Plugin | What it is |
   | --- | --- |
   | `CipherCore` | the language engine, the text-pipeline hook, the inscription scene. **Required.** |
   | `CipherScript_Eldrin` | the Eldrin language — 122 glyphs, the demo corpus. Study it to author your own. |
   | `CipherLexicon` | the rubbing-book scene: the player's field notebook. The face of the product. |

   **Order does not matter** — registration is load-order-free by design, and the shipped test
   suite loads Eldrin *before* the engine on purpose.

3. That's it. No notetags, no database edits. Write `\LEX[sea]` in any message and it renders as
   an untranslated glyph.

---

## How the loop plays

1. **The player meets writing they cannot read.** In messages: `\LEX[word-key]` (alias
   `\CIPHER[...]`) renders the word's glyphs in unread ink. In the world: the **Show an
   Inscription** command opens a full-screen carved surface — stone, wood or parchment — and
   every glyph on it is pressed into the notebook as a charcoal rubbing.
2. **Context teaches concepts.** When the scene around an inscription makes a meaning available
   — a tide table beside the harbour, a mural of the drowned city — call **Teach a Concept**.
   Taught concepts form the pool the player can guess from.
3. **The player guesses.** In the Lexicon, selecting a rubbing and pressing OK opens the guess
   carousel. Guesses are visibly provisional — and a wrong guess that keeps failing to fit will
   begin to *strain*: "…but it does not sit right." No softlocks from an early mistake.
4. **An anchor proves it.** At a checkpoint you author — a mural, a bilingual stone, a ritual —
   call **Validate Glyphs**. If every glyph in the anchor group carries a correct guess, they
   all resolve with the ink-bloom, fire your switch, and **read as their meaning forever**, in
   gloss, translation, or proud untranslated glyph (your choice, per game).

Resolution policy is yours: `anchor` (the Sennaar model, default), `corroborate N` (a correct
guess locks after N distinct sightings), or `instant`.

---

## The seven plugin commands

| Command | What it does |
| --- | --- |
| `Open the Lexicon` | Opens the player's rubbing-book. |
| `Show an Inscription` | Opens a carved surface from the corpus, full screen. Viewing it records sightings. |
| `Teach a Concept` | Adds a meaning to the player's guessing pool. |
| `Validate Glyphs (anchor)` | Checks an anchor group; full success resolves every glyph, sets your switch, writes the correct-count to a variable. |
| `Resolve a Glyph (override)` | Developer override — fixes a glyph directly, for scripted moments. |
| `Glyph State to Variable` | Writes a glyph's state (0 unseen / 1 seen / 2 guessed / 3 resolved) to a variable, for your own events. |
| `Mark a Word Seen` | Records sightings from surfaces that are not messages or inscriptions — props, item descriptions, your own scenes. |

---

## The two scenes (and why they don't look like RPG Maker)

**The Lexicon** (`CipherLexicon`) is a field notebook, not a menu: pressed charcoal rubbings
grouped by radical family so shared anatomy sits side by side, a detail page with the glyph's
family hint, sighting count and current guess, and the ink-bloom when a meaning fixes. The book
grows **leaves** as it fills — one page holds about thirty rubbings and the cursor turns the
leaf at the page's edge. **The Inscription scene** is the writing in place: large glyphs on
aged stone, wood or parchment, resolved words glossed beneath, unread ones waiting.

**Nothing in either scene is an RPG Maker window.** No `Window_Base`, no windowskin, no default
font — that is measured in the engine gate, not promised. A fully populated two-leaf notebook
costs **4 draw calls a frame**; every rubbing is baked once and animated by moving sprites.

Every colour — unread ink, resolved ink, gloss, paper, slate, thread — is a plugin parameter,
so restyling the whole product to your game's palette is a handful of colour fields.

---

## The puzzle is fair — measured, not hoped

A language puzzle that cannot actually be solved is a refund. Eldrin's corpus ships with its
solve-probe numbers pasted into the source:

- Playing the 20 inscriptions in **any reachable order**, all 10 anchors are deducible from zero
  knowledge.
- Playing in strict **story order**, the anchors unlock at inscriptions 1, 2, 5, 9, 11, 13, 13,
  16, 18 and 20 — a steady drip, no dead zone.
- 31 of the 38 anchor glyphs are sighted in two or more places before they are needed; the
  finale's pair is unforeshadowed **by design**.
- Every one of the 14 radical families has at least two glyphs in the corpus, so
  family-deduction — "this shares the water frame, so it is something water-ish" — is always
  demonstrable.

The probe's numbers are pasted as comments beside the corpus in `CipherScript_Eldrin.js`, so if
you edit Eldrin you can see exactly which claims your edit is responsible for keeping true.

---

## Authoring your own language

Eldrin is both the demo and the documentation. A language is data: ~14 radical frames, ~30
differentiator strokes, glyphs declared as *radical + strokes*, words as glyph sequences,
anchors as glyph groups, inscriptions as word lists with a `teaches` array. The engine renders
everything from stroke paths — one visual grammar, no drift, no art pipeline. Smaller additions
need no JavaScript at all: the **Your words** and **Your anchors** plugin parameters extend
Eldrin from the Plugin Manager.

---

## Compatibility

- **Saves:** all progress lives in a versioned plain-data record inside the normal save file —
  proven byte-identical through a save/load round trip in the real engine.
- **The text pipeline** is entered additively: every patch extends the original and calls it,
  unknown escape codes fall straight through, and the engine's own codes (`\G`, `\V`, `\N`,
  `\P`) are verified unbroken in the shipped test run. No core method is replaced.
- **Determinism:** no `Math.random()` anywhere — rubbing grain, paper texture and glyph jitter
  are all seeded, so every player sees the same book.
- Requires RPG Maker MZ. Not compatible with MV.

---

## Sibling systems from CSAF

- **Sigil Core** — glyph-*drawing* magic (the player's hand; this is the player's *mind*).
- **Verdict Core** — evidence, testimony and trials. A deciphered document makes a fine exhibit.
- **Chronicle Core** — the consequence engine under your quest log.
- **Chimera Core / Battle / Field** — breeding, genetics and creature collection.
- **Bazaar Core** — the economy under your shops. **Colosseum Core** — the championship layer.
- **Aperture Core** — photography. **Loop Core** — time loops. **Voyage Core** — sea travel.

All at [csaf.itch.io](https://csaf.itch.io).


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
