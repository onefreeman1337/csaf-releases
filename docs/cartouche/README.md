# Cartouche — The Message Box Drawn As An Object, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Cartouche — The Message Box Drawn As An Object, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/cartouche  
**Docs published:** 2026-11-05


---

# Cartouche — the message box drawn as an object

**RPG Maker MZ · five plugin files · no image assets**

Cartouche replaces the message window with an **object**: a made thing, with a material, a frame,
worked corners, rim treatments and a nameplate struck into its head rail. It builds a different one
for every speaker in your game, and it draws all of it at run time. There is no PNG in this
package, no atlas and no windowskin — the box you see is geometry.

---

## Install

1. Copy the five files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and switch all five on.
3. Play. Any Show Text command with a face or a name box now draws a Cartouche.

**Load order does not matter.** Every file resolves the others the first time it needs them rather
than when it loads, and that is tested rather than hoped for — the headless suite, the store-plate
renderer, the capture pipeline and the in-engine verification all load the five files
*alphabetically*, which puts the entry file `Cartouche.js` first, before the four it depends on.

Nothing else is required. There is no configuration step, no database setup and no per-speaker
authoring: point it at a project and it reads what is already there.

---

## What decides a speaker's box

Three things, in this order.

**The face sheet decides the TRADITION.** Which materials exist at all, which frame constructions,
which corners, which rim work.

| tradition | face sheets | what it is made of |
| --- | --- | --- |
| **company** | `Actor1-3`, `SF_Actor1-3` | planed and bound: waxed oak, tooled leather, pewter, enamelled bronze, gilt |
| **commons** | `People1-4`, `SF_People1` | hand-worked and honest: limewash board, woven rush, pine plank, tinned iron, slate |
| **adversary** | `Evil` | hard, dark and cold: pitch lacquer, blackened iron, slag, obsidian, bloodstone, jet |
| **bestial** | `Monster`, `SF_Monster` | spliced from what a creature is made of: hide, bone, bark and sinew, horn, chitin, ivory |
| **numinous** | `Nature` | grown rather than made: river stone, hoarfrost, living wood, sea glass, star iron, nacre |

An unknown face sheet — which is what a finished game uses, because you will have replaced the RTP
art — is assigned to a tradition deterministically rather than dropped. Your own art never blanks a
box and never crashes one.

**Standing decides how much WORK the object carries.** Five ranks — plain, kept, worked, honoured,
sovereign. Standing slides a window along each tradition's own ordering, so a plain villager draws
from the humble end of their tradition and a sovereign from the rich end. It also decides how many
rim treatments run around the frame, and which corner: **the corner is the statement of standing**,
and a plain speaker cannot reach a crown.

Standing is read from your project where your project says something, and from the face and slot
where it does not:

- an actor whose **level has been raised** above the engine's default of 1;
- an actor with a **nickname** (empty in all eight stock actors, so it is unambiguously your word);
- an enemy's **gold**, which genuinely varies in the stock table;
- otherwise the face sheet and slot you chose.

> ⚠️ It deliberately ignores `initialLevel: 1` and an empty nickname. Those are what Kadokawa ships
> in every copy of the engine and are statements about nothing; scoring them collapses a whole party
> onto one box.

**The individual decides the rest** — which of the equivalent grounds, which tint inside the
material's own range, which caret — and only where that freedom means nothing.

Two speakers of the same tradition at the same standing are **siblings by design**. They are made in
the same workshop out of the same materials, and they differ in their rim treatment, their surface
tint and their caret rather than in their construction. That is what a tradition and a rank mean.

---

## What is in the package

Everything below is drawn by the plugin at run time.

| | |
| --- | --- |
| materials | **40**, in five traditions — measured at **30 distinct surface structures** with the palette held still |
| surface figures | **18** — straight and figured timber, bast fibre, tooled and pebbled hide, cleaved slate, conchoidal obsidian, mottled bloodstone, porous slag, waterworn stone, banded horn, hoarfrost needles, frosted glass, planished iron, the Widmanstätten lattice of meteoric star iron, nacre growth arcs, woven rush, chitin plating |
| frame constructions | **28** |
| corner treatments | **26**, all distinct |
| rim treatments | **30**, all distinct |
| nameplates | **35**, in five letterings — painted, struck, incised, gilt, chalk |
| carets | **15**, all distinct |

**Legibility is the one thing this product treats as a gate.** Cartouche replaces the surface your
player reads for an entire game, and a beautiful box that is tiring to read is worse than the stock
one. So no ink anywhere is a hard-coded colour: every one is **solved** against the surface it will
actually sit on, at that surface's worst excursion under its own texture. Measured across all 160
reachable material and ground pairs, the dialogue clears **WCAG AAA (7:1)**; across all 280
reachable material and plate pairs, the nameplate achieves the full contrast its surface allows.

---

## Plugin commands

| command | what it does |
| --- | --- |
| `setSpeaker` | override the tradition, the standing or the whole identity for the next messages |
| `clearSpeaker` | drop the override and go back to reading the speaker |

Use them for a disguised character, a possessed one, a narrator with no face, or any moment where
the object should not match the portrait.

---

## Performance

Verified in the real engine rather than only in tests, with the engine's own frame stepping:

- update half **0.094 ms mean / 0.4 ms p99** against budgets of 2 ms and 4 ms;
- **8 draw calls per frame**, 0 texture uploads, 0 bitmap dirties, 0 window refreshes;
- display objects **361 with growth 0** — the box is drawn once into the window's own bitmap when
  the speaker changes, not per frame;
- 0 page errors across 1,800 measured frames.

The box is cached and only redrawn when the speaker actually changes.

---

## Save files

Cartouche stores nothing in your save file and adds no fields to any saved object. Remove the
plugin and your saves still load.

---

## ⚠️ Compatibility — the question you actually have

**Tested against RPG Maker MZ with the stock scripts unmodified**, verified by running the plugin in
the real engine rather than only in tests.

**Core methods extended — all 7 by saved-original prototype extension, and every saved original is
CALLED through. None is replaced:**

- `Scene_Message.prototype.messageWindowRect`
- `Window_Message.prototype.initialize`
- `Window_Message.prototype.update`
- `Window_Message.prototype.drawMessageFace`
- `Window_Message.prototype.newLineX`
- `Window_Message.prototype.newPage`
- `Window_NameBox.prototype.updatePlacement`

**Four more are extended on `Window_Message` where the engine defines them on an ancestor**, each
also saving and calling the inherited original:

- `Window_Message.prototype.updateBackOpacity` — the engine defines this on `Window_Base`
- `Window_Message.prototype.resetFontSettings` — on `Window_Base`
- `Window_Message.prototype._refreshBack` — on `Window`
- `Window_Message.prototype._updatePauseSign` — on `Window`; suppressed, because Cartouche draws an
  advance caret belonging to the speaker's own set and the engine's is a second, stock one drawn on
  the window FRAME, outside the object

**Nothing is clobbered**, so Cartouche co-exists with other plugins that patch the same seams,
including large suites. It adds four new methods, all `csafCartouche`-prefixed so they cannot
collide.

**What it does NOT touch:** `Scene_Map`, the tilemap, the character sprites, the database, the save
format, the battle system, or any scene other than the message layer.

**VisuStella MZ Message Core** governs text BEHAVIOUR — auto-colour, text codes, speed, word wrap.
Cartouche governs what the box IS MADE OF. They are different layers and Cartouche does not
re-implement any of Message Core's features; if you use both, load Message Core first so its text
codes are registered before a box is drawn.

---

## Licence

See `LICENSE.txt`. You may use Cartouche in commercial and non-commercial RPG Maker MZ projects,
including projects you sell. You may modify it. You may not resell it as an asset pack.

## Support

Core Systems Asset Factory — <https://csaf.itch.io>

---

*AI disclosure: the code and the generated graphics in this product are AI-authored. The sounds and
the text of your game are yours; this plugin ships neither.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
