# Augury 2.1 - Generated Oracle Deck, Binding Pacts & Card Album for RPG Maker MV & MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Augury 2.1 - Generated Oracle Deck, Binding Pacts & Card Album for RPG Maker MV & MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/augury  
**Docs published:** 2026-11-05


---

# Augury — the generated oracle deck

**Version 2.1.1.** **For RPG Maker MZ and MV.** Six raw JavaScript files, plus one bridge file for MV.
No other plugin required, and nothing ships as an image file.

Augury generates a complete 78-card arcana — 22 trumps and four suits of fourteen — from 46
authored motifs, drawn as vector geometry at runtime. Then it deals with them: the draw is
weighted by what the playthrough has actually done, and every card dealt is written back into
switches and variables you branch on in an ordinary event page.

A fortune-teller becomes a mechanic instead of a cutscene.

**New in 2.0 — cards that bind.** A dealt card can now become a **pact**: a named contract with a
clause the player reads *before* it binds, a term that counts down in battles or in steps, and a
break condition stated in plain words. 156 pacts, one for every card upright and reversed. See
[Pacts](#pacts--new-in-20) below. Existing 1.0 saves load unchanged.

**New in 2.1 — RPG Maker MV, and three fixes.** The same six files now run in **RPG Maker MV 1.6**
with `CSAF_MVBridge.js` at the top of the Plugin Manager; every command and parameter in this guide was
run on both engines from the shipped download. Fixed: **Bind the last reading** found nothing after a
reading in 2.0 and now binds it; a pact outcome that landed as a battle ended lost its common event in MZ
and now runs it on the map; a misspelt spread name dealt one card in silence and is now reported.

---

## COMPATIBILITY — read this first

**Tested alongside:** VisuStella MZ Core Engine, and the stock RPG Maker MZ scripts with no other
plugins installed.

**Import order in the Plugin Manager — all six, in exactly this order:**

```
1. AuguryArcana.js    the corpus (data only, draws nothing)
2. AuguryDeck.js      the model  (logic only, no rendering)
3. AuguryCard.js      the renderer
4. AuguryPactLore.js  the pact corpus and contract machine (data + pure logic)
5. Augury.js          the scenes, commands and parameters
6. AuguryPacts.js     the pact bindings and the ledger scene
```

⚠️ **`AuguryPacts.js` must load AFTER `Augury.js`**, not before it — it extends the scenes and
commands that `Augury.js` defines. This is the one ordering mistake that matters.

**In RPG Maker MV 1.6:** also copy `CSAF_MVBridge.js` and put it **at the top of the list**, above
`AuguryArcana.js`. It supplies the few parts of MZ's scripting these files use and MV lacks, changes no
window of yours or of any other plugin, and does nothing at all in MZ (you can leave it out there).

**Upgrading from 1.0?** Add `AuguryPactLore.js` and `AuguryPacts.js` in the positions above. The
other four files are drop-in replacements. Nothing else changes, and your saves keep working.

Each file checks the ones before it and says so plainly in the console if they are missing, rather
than failing silently halfway through a scene.

**Place them anywhere in your plugin list relative to other plugins.** Augury reads your switches
and variables and adds three scenes of its own (the reading, the deck album and the pact ledger). It implements no combat, no inventory, no equipment
and no dialogue, so it does not compete with the plugins that do.

**It is written specifically to sit beside a card-battle plugin, not against one.** If you already
use MythAtelier's Card Game Combat, Undermax's Card Duel System, a Triple Triad plugin or similar,
Augury does a different job: those resolve card *duels*, this deals *readings*.

**Core methods, measured rather than claimed** — every one EXTENDED with its original saved and
called, and **zero clobbered**. Read off the shipped source by
`Wings/RPGMaker/Internal_Ops/compat_facts.js`, not typed by hand.

**The deck (`Augury.js`) — three, exactly as in 1.0:**

| Method | Why |
| --- | --- |
| `Game_System.prototype.initialize` | create the record store |
| `Window_MenuCommand.prototype.addOriginalCommands` | add the menu command (only if enabled) |
| `Scene_Menu.prototype.createCommandWindow` | wire that command's handler (only if enabled) |

Turn **Add "The Deck" to the menu** off in the parameters and the last two do nothing at all.

**Pacts (`AuguryPacts.js`) — only if you deal a pact.** Each is the hook a clause needs in order to
count down or pay out:

| Method | Why |
| --- | --- |
| `Game_Party.prototype.increaseSteps` | terms measured in steps |
| `Game_Interpreter.prototype.command314` | the Recover All event command — a "rest" clause |
| `Game_Party.prototype.loseGold` · `gainItem` | clauses about spending and acquiring |
| `Game_Troop.prototype.goldRate` · `expTotal` | boons that pay out after a battle |
| `Game_Enemy.prototype.dropItemRate` | drop-rate boons |
| `Game_Player.prototype.encounterProgressValue` | clauses that change how often you are found |
| `Game_Battler.prototype.consumeItem` | "without reaching for an item" break conditions |
| `Game_BattlerBase.prototype.die` | "breaks if anyone falls" break conditions |
| `BattleManager.processVictory` · `processEscape` | terms measured in battles |
| `DataManager.extractSaveContents` | migrate a 1.0 save to a working empty ledger |

One method is **overridden rather than extended**, deliberately:
`Game_Actor.prototype.paramRate` — declared on `Game_BattlerBase` and inherited. Overriding it on
`Game_Actor` is what keeps a pact's parameter change on **the party only**; enemies keep the
unpatched base method, so a bane never accidentally buffs the monsters.

The scenes extend `Scene_Base`, not `Scene_MenuBase`, so they bring none of the stock menu
background or the stock cancel button with them.

---

## Quick start

1. Copy the six files into `js/plugins/` and enable them in the order above.
2. In an event, run the plugin command **Deal a reading**.
3. That is the whole minimum. **Pacts are on by default:** when the cards are face up they bind as
   pacts, and dismissing the reading opens the ledger. Turn **Bind Pacts From A Reading** and **Open The
   Ledger After A Reading** off for 1.0's behaviour, a reading that only writes back.

---

## Plugin commands

**The deck (`Augury.js`):**

| Command | What it does |
| --- | --- |
| **Deal a reading** | Deals a spread and shows it on the table. Takes a spread and an optional question printed above the cards. A spread name that does not exist is reported in the console and the default spread is dealt. |
| **Open the deck** | Shows every card the player has met and what is still unturned. |
| **Draw without showing** | Deals one card and writes the result back, with no scene. For scripted omens. |
| **Forget every reading** | Clears the record of which cards the player has seen. |

**Pacts (`AuguryPacts.js`) — new in 2.0:**

| Command | What it does |
| --- | --- |
| **Open the pact ledger** | Shows every running pact with its clause, term and progress. |
| **Bind the last reading** | Binds the cards the most recent reading dealt, shown or silent. Use when automatic binding is off, or to bind a silent draw. A reading binds once. |
| **Bind one card** | Binds a named card's pact directly, without dealing anything. Takes a card key and an optional *reversed* flag for its shadow pact. |
| **Clear every pact** | Clears the ledger. Running pacts end with no outcome. |
| **Is a card's pact running?** | Writes ON or OFF into a switch you choose. (Progress is on the ledger, and in `CSAF.AuguryPacts.active()` from a script.) |

**In RPG Maker MV** there is no command dropdown; each command is a Plugin Command line:

```
Augury read spread=three question="What waits at Vantre?"
Augury openDeck
Augury drawSilent
Augury clearRecords
AuguryPacts openLedger
AuguryPacts bindLast
AuguryPacts bindCard card=major:tower reversed=true
AuguryPacts clearPacts
AuguryPacts queryPact card=major:tower target=13
```

Leave `spread=` out for the default spread. A misspelt command name is reported in the console.

## The four spreads

| Key | Cards | Positions |
| --- | --- | --- |
| `single` | 1 | The Matter |
| `three` | 3 | What Was · What Is · What Comes |
| `cross` | 5 | The Matter · What Crowns It · What Is Before · What Is Behind · What Lies Beneath |
| `path` | 4 | The Setting Out · The Trial · The Cost · The Arrival |

---

## What a reading writes back

Set these in the parameters, then branch on them in an ordinary event page. Leave any of them at 0
to write nothing.

| Parameter | Receives |
| --- | --- |
| Variable — first card id | `0`–`77`, the first card dealt |
| Variable — first card trump | `0`–`21` for a trump, `-1` for a pip or court |
| Switch — first card reversed | ON if the first card came up reversed, OFF if upright |
| Variable — cards dealt | how many the spread laid |

So `if variable 21 == 16` is *"the Tower came up"*. **The card ids are stable and listed at the
bottom of this file** — they are a compatibility contract, so a future version will not renumber
them under your save.

---

## Pacts — new in 2.0

A reading that changes nothing is decoration. A pact is the same card, dealt as a **promise the
game then holds you to**.

**156 pacts — one for every card, upright and reversed.** Not 44 authored ones plus filler: the
trumps and courts are written one by one, and every pip pact is composed from its suit and rank, so the
Ten of Staves promises something a Ten of Staves would promise.

Each pact has four parts, and the player sees all of them before it binds:

| Part | What it is |
| --- | --- |
| **Aspect** | **Trial** asks something of you · **Bane** costs you until you escape it · **Boon** pays out |
| **Clause** | What has to happen, in plain words — *"Win three fights without reaching for an item."* |
| **Term** | How long it has to happen in, counted in **battles** or in **steps** |
| **Break** | What ends it early, stated up front — *"breaks if anyone falls"* |

**The design rules, and they are enforced by the test suite rather than by good intentions:**

- **Every bane names an escape, and no bane can be broken.** A cost you cannot end is a punishment,
  not a mechanic.
- **Every trial can be broken.** A promise you cannot fail is not a promise.
- **No boon can be broken.** A reward that can be snatched away reads as a bug.

**Three outcomes, each with its own common event hook:** *fulfilled* when the clause is met,
*broken* when the break condition fires, *lapsed* when the term runs out unresolved. Wire any or
none of them. An outcome that lands as a battle ends (a won fight that completes a clause, a battle
term running out) runs its common event back on the map. MV holds one reserved common event at a time,
so when two pacts resolve on the same step or battle only the last one's event runs there; MZ runs all
of them.

**Every part can be turned off.** Binding from a reading and opening the ledger after it are on by
default (see Quick start). Set **Promise Strength** to 0 and pacts still bind,
still show and still resolve — they simply change no numbers, which is the honest way to use them
purely as narrative. **Most Pacts At Once** caps the ledger; binding past it drops the oldest
running pact with no outcome.

**Save compatibility:** a 1.0 save loads into 2.0 with an empty ledger and no error. This is
covered by a test that takes a real 1.0 save shape, deletes the pact slot entirely, and requires it
to migrate.

---

## Omen rules — how the playthrough bends the deck

A rule makes a card likelier, or impossible, when your game state says so.

```
card "major:tower",  switch 12 ON,              weight 20   -> twenty times as likely
card "major:sun",    variable 8 at least 3,     weight 0    -> cannot be drawn at all
```

**A weight of 0 removes the card from the deck.** That is deliberate — *"the Tower cannot appear
before act three"* is a thing designers want. If every card is zeroed the deck falls back to an even
draw rather than dealing nothing into a scene that cannot cope, and it says so in the console.

**MEASURED over 20,000 draws per arm:** with a ×20 rule on the Tower its share went from **1.31%**
(an even deck is 1.28%) to **20.77%**; a ×0 rule on the Sun took it to exactly **0.00%**. The
weighting is arithmetic, not decoration.

## Bindings — make the deck about *your* world

Name a card in the parameters and the name is struck into its cartouche:

```
major:emperor  ->  "Aldric, the Winter King"
major:tower    ->  "The Fall of Vantre"
```

The Emperor is now your king. The Tower is the catastrophe your story actually turns on.

---

## Card keys

Used by omen rules and bindings.

```
major:fool  major:magician  major:priestess  major:empress  major:emperor
major:hierophant  major:lovers  major:chariot  major:strength  major:hermit
major:wheel  major:justice  major:hanged  major:death  major:temperance
major:devil  major:tower  major:star  major:moon  major:sun
major:judgement  major:world

<suit>:1 .. <suit>:10          where <suit> is chalice, blade, coin or stave
<suit>:page  <suit>:knight  <suit>:queen  <suit>:king
```

**A misspelt key is ignored and reported in the console, never silently substituted.** A typo that
quietly weights the wrong card is worse than one that does nothing, because nothing tells you that
you made it.

---

## Determinism

Augury mints **one seed per playthrough** and every draw runs through it. Two players get different
readings; one player replaying a save gets theirs back. The seed is printed in the corner of the
reading, so a bug report can be reproduced exactly.

`Math.random` is used in exactly one place — minting that seed, once, at world creation. No game
logic calls it.

---

## The eight decks

`ivory · midnight · ember · verdant · sanguine · frost · bone · violet`

A colourway is not a filter over a finished picture. Every motif names a *role* — body, void, halo,
accent, ground — and the deck resolves those roles, so the ink, the cut, the gilt and the stock all
change together. 78 faces × 8 decks = **624 renderable faces**, and reversal doubles that to 1,248
card states.

---

## One honest limitation, stated plainly

**Augury draws the cards; it does not write their meanings for your game.** Every card ships with
its traditional title so a reading is legible out of the box, but a story that turns on *"the Hanged
Man means X in THIS world"* is yours to write in the event that branches on it. The plugin gives you
the deck, the draw and the branch — not the script.

---

## Card ids

Stable, and a compatibility contract.

```
  0 The Fool            1 The Magician        2 The High Priestess  3 The Empress
  4 The Emperor         5 The Hierophant      6 The Lovers          7 The Chariot
  8 Strength            9 The Hermit         10 The Wheel          11 Justice
 12 The Hanged Man     13 Death              14 Temperance         15 The Devil
 16 The Tower          17 The Star           18 The Moon           19 The Sun
 20 Judgement          21 The World

 22-35  Chalices: Ace, 2-10, Page, Knight, Queen, King
 36-49  Blades:   Ace, 2-10, Page, Knight, Queen, King
 50-63  Coins:    Ace, 2-10, Page, Knight, Queen, King
 64-77  Staves:   Ace, 2-10, Page, Knight, Queen, King
```

---

## Terms of use

Commercial and non-commercial use permitted in RPG Maker MZ and MV projects. Credit is appreciated but not
required. **Do not redistribute the plugin files themselves**, modified or otherwise. Full terms in
`LICENSE.txt`.

## More from Core Systems Asset Factory

- **Sigil Core** — every spell generates its own animated seal · <https://csaf.itch.io/sigil-core>
- **Asterism** — a constellation skill tree that draws its own stars · <https://csaf.itch.io/asterism>
- **Niello** — every weapon and armour draws its own engraved plate · <https://csaf.itch.io/niello>
- **Formulary** — every recipe draws its own alchemical plate · <https://csaf.itch.io/formulary>
- **Herbarium** — every reagent mounts as a botanical plate · <https://csaf.itch.io/herbarium>
- **Armorial** — a coat of arms generated from what the playthrough did · <https://csaf.itch.io/armorial>
- **Chronicle Core** — branching quests, faction reputation and world state · <https://csaf.itch.io/chronicle-core>


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
