# Epistolary - Draws Every Letter Your Game Sends as a Physical Document — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Epistolary - Draws Every Letter Your Game Sends as a Physical Document  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/epistolary  
**Docs published:** 2026-11-05


---

# Epistolary — the letter as a drawn object

**RPG Maker MZ · version 1.0.1 · Core Systems Asset Factory**

Your game already has letters in it. They arrive in the message window, in the same box as the
shopkeeper's small talk, in the engine's own font. This turns each one into a physical document
that the plugin **draws** — paper, handwriting, wax, folds and postmarks — and then builds a
system on top of it.

There is **no image file anywhere in this plugin**. Every mark on the page is generated, which is
why a letter from a sender you invented this afternoon looks as specific as one shipped with the
demo.

---

## Install, in four minutes

### 1. Copy the files

Copy all four files from `js/plugins/` into your project's `js/plugins/` folder:

```
EpistolaryHand.js
EpistolaryForms.js
EpistolaryDocument.js
Epistolary.js
```

### 2. Add them in the Plugin Manager, IN THIS ORDER

⛔ **The order is not optional. All four, in exactly this sequence:**

| # | Plugin | What it is |
| --- | --- | --- |
| 1 | `EpistolaryHand.js` | the pen model and the 84 glyph skeletons |
| 2 | `EpistolaryForms.js` | paper stocks, seal devices, waxes, postmarks, folds, damage |
| 3 | `EpistolaryDocument.js` | composes a sheet from those parts |
| 4 | `Epistolary.js` | the scenes, the delivery system, the forgery check |

Only the fourth one has parameters. The first three are libraries and have nothing to configure.

**If a file loads before something it needs, the plugin says so.** It checks at boot and writes a
plain-language error to the console naming what must load first, rather than failing somewhere
obscure twenty minutes later.

### 3. Define one sender and one letter

Open `Epistolary.js` in the Plugin Manager.

**Senders** — everyone who can write to the player. Each one gets a hand, a device, a wax and a
paper stock, and those four things together are what makes their letters recognisably theirs.

**Letters** — the letters themselves. Each references a sender by `id`.

### 4. Deliver it

In an event, use the plugin command **Deliver Letter** with your letter's id. That is the whole
minimum setup.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Post Letter** | Queue a letter to arrive after a delay in game minutes |
| **Deliver Letter** | Put a letter in the player's hands right now |
| **Open Letter** | Show one letter full screen |
| **Open Letterbook** | Show everything kept, oldest first |
| **Examine Letter** | Run the forgery check and write the result to variables |
| **Record Exemplar** | Remember what a sender's letters look like |
| **Break Seal** | Open a sealed letter, permanently |

## Script access

```js
CSAF.Epistolary.pending()          // letters posted but not yet arrived
CSAF.Epistolary.inbox()            // letters that have arrived
CSAF.Epistolary.unread()           // how many are unread
CSAF.Epistolary.examine(letterId)  // { checked, matched, tells: [...] }
CSAF.Epistolary.has(letterId)      // has this letter arrived
```

---

## Forgery — the part that is a game, not a renderer

A letter *claims* a sender. Everything that makes it look like theirs is separate evidence:

- the **hand** it is written in
- the **device** struck into the wax
- the **colour** of that wax
- the **paper** it is written on

A forger has to get all four right.

1. Register what the player has seen of a sender with **Record Exemplar**.
2. Mark a letter as actually written by someone else with `forgedBy`.
3. **Examine Letter** compares it against the exemplar and returns the **tells** — the specific
   things that do not match.

A letter from a sender the player has never corresponded with returns **cannot be checked**, which
is a real answer rather than a pass, and is worth designing around.

This only works because the document is generated from parts. A drawn-in-Photoshop letter cannot
be examined, because there is nothing inside it to compare.

---

## Parameters worth knowing about

| Parameter | Default | Note |
| --- | --- | --- |
| **Sheet aspect** | `1.32` | Height ÷ width. 1.32 is close to a real folio. |
| **Desk colour** | `#2b2620` | The surface the letter is shown lying on. |
| **Show dockets** | on | Draws the marginal endorsement in a clerk's hand. |
| **Game minutes per step** | `1` | How much post-time passes per player step. **0 disables step-driven delivery** — set it to 0 if you want to drive arrival entirely from events. |
| **Switch on arrival** | `0` | Turned ON when any letter arrives. Leave at 0 to ignore. |
| **Unread count variable** | `0` | Kept in step with the number of unread letters. Leave at 0 to ignore. |

---

## ⚠️ One honest limitation, stated plainly

**The handwriting engine draws 84 glyphs: the ASCII letters, digits and common punctuation listed
in `EpistolaryHand.js`.**

It does **not** draw accented Latin, Cyrillic, Greek, kana or CJK, and it never will without
someone authoring those skeletons — every glyph is an authored pen path, not a font lookup.

An unknown character does not crash and does not draw a tofu box. It advances the pen by half a
space and is skipped, so a letter containing text the plugin cannot write will render with gaps.

**If your game is not written in Latin script, this plugin will not do what you want, and you
should know that before you buy it rather than after.**

---

## Compatibility

**This plugin replaces no core method.** It adds two scenes of its own and extends `DataManager`'s
new-game and load steps through saved originals, so it composes with anything else that does the same.

It does not touch `Scene_Map`, `Scene_Battle`, `Scene_Menu`, the message window, or any `Window`
class — so it has no opinion about your UI plugins.

**Verified in the real RPG Maker MZ engine against the stock scripts, unmodified.**

**It extends three engine functions and replaces none:** `Game_Player.prototype.increaseSteps`,
which is how a letter posted "in three days" knows that three days have passed, and
`DataManager.setupNewGame` and `DataManager.extractSaveContents`, which keep the save record ready.
Each one saves the original and calls it. That is what makes it safe to run beside a large plugin
suite, and you do not have to take it on trust: the whole product is four readable files.

**Load order against other plugins:** the four Epistolary files must be consecutive and in the
order above. Where they sit relative to everything else does not matter, because nothing in them
patches a class another plugin is likely to want.

**Saves.** The save format is versioned with a migration seam, and a save round-trips losslessly.
Adding this plugin to a project mid-development will not break existing saves; they simply start
with an empty letterbook.

---

## Troubleshooting

**Nothing happens when I deliver a letter.**
Check the Plugin Manager order first — it is the cause four times out of five. The console will
have named the problem at boot.

**The letter renders with gaps in the text.**
See the limitation above. A character outside the 84-glyph set is skipped rather than drawn.

**A letter I posted never arrives.**
Post-time advances with player steps by default. If **Game minutes per step** is `0`, nothing
posted will ever arrive on its own — deliver it from an event instead, or set a non-zero value.

**Examine says "cannot be checked".**
That is correct behaviour, not a bug: the player has no exemplar for that sender. Use **Record
Exemplar** first.

**A letter reads "from an unknown hand".**
Its sender id does not match any row in **Senders**. It still opens, in default materials, and the
console names the letter and the id it could not find.

---

## Licence

See `LICENSE.txt`. Short version: use it in unlimited games, commercial or free, keep 100% of your
revenue, modify it however you like. Do not resell or republish the plugin itself.

---

## Other Core Systems Asset Factory plugins for MZ

Epistolary was built to sit beside two of them in particular:

- **Chronicle Core** — the consequence engine under your quest log. A quest that arrives as a
  sealed writ instead of a journal entry is the obvious pairing.
- **Verdict Core** — courtroom investigation. A forged letter is an **exhibit**, which is that
  plugin's own core noun.

The full catalogue is at **https://csaf.itch.io**.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
