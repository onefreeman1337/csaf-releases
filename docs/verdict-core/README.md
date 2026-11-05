# Verdict Core - Investigation, Cross-Examination & Deduction for RPG Maker MV & MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Verdict Core - Investigation, Cross-Examination & Deduction for RPG Maker MV & MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/verdict-core  
**Docs published:** 2026-11-05


---

# Verdict Core — the part where the player has to be right

**RPG Maker MZ and RPG Maker MV · v1.2.1**

Keep your clue system. This is the layer that decides whether the evidence the player just presented
actually contradicts the thing they presented it against.

Every clue plugin for MZ tracks *what the player has found*. None of them resolves an exhibit against
a claim. Verdict Core does, and it answers with three results rather than two:

- **CONTRADICTION** — the right exhibit, aimed at the right line. The statement breaks, and what the
  break reveals goes on the record as a fact.
- **CLOSE** — the right exhibit, aimed at the **wrong line**. This is the result nothing else models.
  The game says the evidence matters *here*, just not against *this* claim, and points at the
  statement that would have worked. By default it costs nothing.
- **WRONG** — unrelated evidence. Costs credibility. Run out and the case collapses.

Nothing about that is scripted per case. You author what each exhibit *establishes*, what each
statement *claims*, and the engine derives the rest — which statements an exhibit can break, which
blanks it can fill, which conclusions the corkboard will accept.

**It adds four scenes and replaces none of yours.** No core method is clobbered; every patch is a
prototype extension with the original saved.

---

## Installing

1. Copy `js/plugins/VerdictCore.js` and `js/plugins/VerdictCaseFile.js` into your project's
   `js/plugins/` folder.
2. In the Plugin Manager add **VerdictCore first**, then **VerdictCaseFile below it**.
3. Both are required. `VerdictCore` holds the rules and every plugin command; `VerdictCaseFile` holds
   the four scenes and the look.

> **The look is part of what you bought.** `VerdictCaseFile.js` uses **no windowskin at all** —
> aged paper, photo corners, pushpins, rubber stamps, red string and the typewriter/serif type scale
> are all drawn procedurally at runtime. That is why the screenshots do not look like RPG Maker.
> Every colour and both font stacks are plugin parameters, so you can retune the whole aesthetic
> without touching code, and `motion` off gives you instant transitions for accessibility.
>
> **It only styles its own four scenes.** Installing this does not restyle your menus, your shop or
> your battles.

### In RPG Maker MV

The same two files run in MV 1.6 with one more file from this download:

1. Copy `js/plugins/CSAF_MVBridge.js` into your MV project's `js/plugins/` folder as well.
2. In the Plugin Manager put **CSAF_MVBridge at the top**, then **VerdictCore**, then **VerdictCaseFile**.

`CSAF_MVBridge.js` supplies the few parts of MZ's scripting that these plugins use and MV lacks (windows
built from a rectangle, MZ's window padding and row layout for these windows only, and plugin
commands). It changes no window of yours or of any other plugin, and in MZ it does nothing at all, so
you can leave it out there. Case data goes in the same plugin parameters in both engines.

---

## Five minutes to a working case

### 1. Add exhibits

Open **VerdictCore** in the Plugin Manager and add rows to **Exhibits**.

| Field | What it is |
| --- | --- |
| `id` | Internal name, e.g. `bloodied_glove`. Events and every other list refer to this. |
| `name` | What the player sees. |
| `kind` | A free label — `physical`, `document`, `account`. Shown as the card's kicker. |
| `summary` | One line, shown on the list row. |
| `detail` | The dossier paragraph. |
| `facts` | **The important one.** The fact ids holding this exhibit proves. |

`facts` is the whole design. An exhibit is not an item — it is a set of facts that become true while
the player holds it, and false again if they lose it.

### 2. Add testimony

Add rows to **Testimonies**. Each has a `title`, a `speaker`, and a list of **Statements**:

| Field | What it is |
| --- | --- |
| `text` | The line the witness says. |
| `claims` | Fact ids this statement asserts. Used to spot a near miss. |
| `contradictedBy` | Exhibit ids that break it. Leave empty for an unbreakable line. |
| `breakText` | What the witness says when it breaks. |
| `breakFacts` | Facts established by breaking it. |
| `pressText` / `pressFacts` / `pressAdds` | What pressing (asking again) yields. `pressAdds` can reveal a statement that was `hidden`. |

### 3. Add link rules and a deduction

**Link rules** say which two cards mean something *together* — an exhibit and a statement, or two
exhibits. Pin them on the Case Board and the string stays, with a conclusion and new facts.

A **Deduction** is a sentence with blanks. Each blank offers options; exactly one is correct. Fill
every blank, commit, and the sheet takes a stamp: **CASE MADE** or **OVERRULED**. Overruled strikes
through the blanks that failed — so the player learns *which half* of their theory was wrong.

### 4. Drive it from events

```
Plugin Command  VerdictCore  startCase        caseId: ashfield
Plugin Command  VerdictCore  giveExhibit      exhibitId: bloodied_glove
Plugin Command  VerdictCore  startTestimony   testimonyId: t_maid
Plugin Command  VerdictCore  openCaseFile
Plugin Command  VerdictCore  openCaseBoard
Plugin Command  VerdictCore  openDeduction    deductionId: d_accusation
```

---

## Controls: keyboard, gamepad, mouse and touch

Every verb in all four scenes works from a keyboard or gamepad **and** from a mouse or a touchscreen.
Nothing is keyboard-only (new in v1.2.0; before it, presenting an exhibit was the Shift key alone and
the corkboard and the accusation sheet answered to arrow keys only).

| Scene | Keyboard / gamepad | Mouse / touch |
| --- | --- | --- |
| Case File | ↑ ↓ choose an exhibit | tap an exhibit |
| Cross-Examination | ↑ ↓ walk the testimony, **OK** presses, **Shift** presents | tap a statement, tap it again to press it, the **PRESENT** tab presents |
| Case Board | arrows move between cards, **OK** picks, then picks a second to link | tap a card to pick it up, tap a second to run the string, tap the held card to put it down |
| Deduction | ← → choose a blank, **OK** fills it, **Shift** commits | tap a blank, tap an option twice to choose it, the **COMMIT** tab commits |
| Everywhere | **Cancel** | the **CLOSE** tab, a right click, or a two-finger tap |

With a mouse in MZ, pointing at a row already selects it, so a single click presses or chooses. Also
new in v1.2.0: the red selection mark now follows the selection in every list. Before, it stayed on
the row it was first drawn on while the arrow keys moved the selection underneath it.

The PRESENT, COMMIT and CLOSE tabs are drawn paper tabs, not RPG Maker's button sheet. They follow MZ's
own **Options › Touch UI** switch: turn it off and no tabs are drawn, while taps on rows, cards and blanks
keep working. RPG Maker MV has no such switch, so in MV the tabs, CLOSE included, are always drawn.

---

## Every plugin command

**Thirteen commands, all registered under `VerdictCore`** — including the four that open scenes
defined in `VerdictCaseFile.js`. RPG Maker keys a plugin command by the file whose `@command` block
declares it, so the editor writes `VerdictCore` into the event either way.

| Command | What it does |
| --- | --- |
| `startCase` | Begin an investigation. Resets credibility. |
| `giveExhibit` | Put an exhibit in the case file. Its facts become established. |
| `revokeExhibit` | Take one away. Its facts un-prove themselves. |
| `learnFact` | Establish a fact directly, with no exhibit behind it. Permanent. |
| `startTestimony` | Open the Cross-Examination on one testimony. |
| `openCaseFile` | Open the Case File. |
| `openCaseBoard` | Open the corkboard. |
| `openDeduction` | Open the accusation sheet. |
| `readCredibility` | Write current credibility into a variable. |
| `setCredibility` | Set it directly. |
| `readFactKnown` | Write a switch: is this fact established? |
| `readTestimonyBroken` | Write a switch: is this testimony fully broken? |
| `readBreakCount` | Write a variable: how many statements have been broken. |

The five `read*` commands exist so your events can branch on the investigation without a script call.

**In RPG Maker MV** there are no command dropdowns, so each command is one **Plugin Command** event line:
`VerdictCore`, the command, then its values as `key=value` (quote a value with spaces):

```
VerdictCore startCase
VerdictCore giveExhibit exhibitId=bloodied_glove
VerdictCore learnFact factId=blood_was_spilled_indoors
VerdictCore startTestimony testimonyId=t_maid
VerdictCore openDeduction deductionId=d_accusation
VerdictCore setCredibility value=3
VerdictCore readCredibility variableId=5
VerdictCore readFactKnown switchId=3 factId=the_hearth_was_lit
VerdictCore readTestimonyBroken switchId=4 testimonyId=t_maid
VerdictCore readBreakCount variableId=6
```

The keys are the same names the MZ dropdowns use: `exhibitId`, `factId`, `testimonyId`, `deductionId`,
`value`, `variableId`, `switchId`. `openCaseFile`, `openCaseBoard` and `revokeExhibit exhibitId=...` follow
the same pattern.

**If an id in a command is wrong** (a typo, or an exhibit you have since deleted), a playtest stops with
an error that names it, so you see it on the spot. In a released game the same mistake is written to the
console and the event carries on, so a player never sees an error screen because of it.

---

## Saving

Saves are versioned and lossless, and they carry **ids only — never your case text**. That matters
in practice: edit a statement's wording after a player has saved and their save still loads, because
nothing about the wording was ever written into it. Content you *delete* is dropped from the save on
load rather than refusing to load at all.

---

## Compatibility

- **No core method is overwritten.** Every patch extends the prototype and calls the saved original.
- **Nothing outside the four Verdict scenes is restyled.**
- **No `Math.random()` in game logic.** All randomness runs through a seeded generator, so a case
  plays out identically from the same seed — which is what makes it testable.
- **Zero allocation in per-frame paths.** Measured in the real MZ engine on the Case File: 15 draw calls
  a frame, no texture uploads, no growth in display objects, and 0 of 1,800 measured frames over the
  60 FPS budget.
- **RPG Maker MV 1.6:** the same files run with `CSAF_MVBridge.js` at the top of the list (see Installing).
  Every command and all four scenes were run on both engines from this download.

---

## Turning the look off

Set **motion** to `false` in `VerdictCaseFile` for instant, non-animated transitions. Every other
visual decision is a colour or font parameter on the same plugin: `paperLight`, `paperDark`, `ink`,
`inkFaded`, `sealRed`, `proofGreen`, `corkColour`, `displayFont`, `typewriterFont`.

Removing `VerdictCaseFile.js` entirely leaves the rules working and the four scenes unavailable.

---

## Support

Raw, uncompressed, commented JavaScript — 4,639 lines across three files. Read it, change it, ship it
in a commercial game. Licence in `LICENSE.txt`.

**More RPG Maker MZ systems from CSAF:**
[Chronicle Core](https://csaf.itch.io/chronicle-core) ·
[Bazaar Core](https://csaf.itch.io/bazaar-core) ·
[Chimera Core](https://csaf.itch.io/chimera-core) ·
[Chimera Field](https://csaf.itch.io/chimera-field) ·
[Chimera Battle](https://csaf.itch.io/chimera-battle)


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
