# Armorial: Epilogues With Coats of Arms for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Armorial: Epilogues With Coats of Arms for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/armorial  
**Docs published:** 2026-11-05


---

# Armorial — generated heraldic epilogues for RPG Maker MZ

**What became of everyone, worked out from what the player actually did — and given a coat of arms
this plugin draws.**

Version 1.0.0 · RPG Maker MZ · © Core Systems Asset Factory

---

## What it does

Your game already records what happened. Switches got flipped, variables went up, someone was
spared or wasn't. Armorial reads that at the end of the game, works out a **fate** for each person
or faction you named, and shows it as an epilogue plate — with a **coat of arms it generates from
that character's own deeds**.

The arms are not pictures we shipped. They are composed, per character, per playthrough, out of:

| | count |
| --- | --- |
| **Charges** — the figure on the shield | **50** |
| **Field divisions** — the shape of the arc | 10 |
| **Tinctures** — the tone it is read in | 10 |
| **Ordinaries** — a broad band across the field | 8 |
| **Bordures** — how the world regarded them | 8 |
| **Distinct achievable devices** | **320,000** |

**There are no image files.** Every shield is drawn as vector geometry at whatever size it is
needed, so it is crisp on any resolution and adds nothing to your deployment size.

**Two players who finish your game do not get the same arms.**

---

## What it is *not*

**It is not a cutscene tool.** If you want to choreograph pictures, movement and scrolling credits
by hand, a cinematic sequencer does that job and does it well — use one, and use Armorial for the
part it does not do. Armorial does not play an ending you authored; it **works out what the ending
is**.

**It is not an endings gallery.** If you want a collected-endings screen showing which routes a
player has found, that is a different product — our own *Threads* covers exactly that ground, and
the two are designed to sit together: **Threads shows them the map. Armorial shows them what
became of everyone.**

---

## Installing

1. Copy the three files from `js/plugins/` into your project's `js/plugins/` folder.
2. In the Plugin Manager add them in this order:
   1. `ArmorialCharges.js` — the corpus (data only; registers nothing)
   2. `Armorial.js` — the compiler
   3. `ArmorialUI.js` — the renderer and the epilogue scene
3. Turn all three ON.

Order is a tidiness request, not a requirement: Armorial defers every read of the corpus to
`Scene_Boot`, so it does not depend on plugin load order at all.

---

## The three things you fill in

Everything is configured on **`Armorial.js`**.

### 1. Subjects — who gets an epilogue

A party member, a rival, a town, a guild, a god. Each needs a short `id`, a display `name`, and an
`order` (lower shows first).

```
id: kael      name: Kael of the Ninth       order: 0
id: riona     name: Riona Vale              order: 1
id: ashfall   name: The Ashfall Compact     order: 2
```

### 2. Deeds — what the game recorded about them

A deed watches **one** switch or variable. When it holds, it contributes to that subject's arms.

| field | what it does |
| --- | --- |
| **Subject Id** | whose arms this deed contributes to |
| **Condition** | when it counts — see below |
| **Tone** | `noble` `grim` `quiet` `cruel` `kind` `strange` — biases the **tincture** |
| **Charge Group** | `beast` `arms` `place` `fortune` `celestial` `craft` `bond` — which family of figures it argues for |
| **Weight** | how strongly. A defining deed should outweigh a minor one |
| **Standing** | −3 reviled … +3 celebrated. Drives the **bordure** |

**You never choose the picture.** The deeds that held decide it:

- The **dominant charge group** picks the figure.
- The **dominant tone** picks the colour.
- **How many different groups** argued for them picks how divided the field is — a character pulled
  three ways gets a genuinely divided shield.
- **Standing** picks the border, which is the first thing a player reads.

### 3. Fates — the words

Each fate names its subject and a condition. **The first fate whose condition holds is the one
shown**, so order them most-specific first.

> ⚠️ **Give every subject a catch-all fate — one with a BLANK condition — and put it last.**
> If none of a subject's conditions hold, that subject is skipped entirely. Armorial warns you
> about this in the console at boot, by name.

---

## Conditions

A small expression, and there is **no script call and no `eval`**:

| you write | it means |
| --- | --- |
| `s12` | switch 12 is ON |
| `!s12` | switch 12 is OFF |
| `v8>=50` | variable 8 is at least 50 |
| `v8<10` | variable 8 is under 10 |
| `v3==2` | variable 3 equals 2 |
| `v3!=2` | variable 3 is anything but 2 |
| `s12 & v8>=50` | both |
| `s12 \| s13` | either |
| *(blank)* | always true — the catch-all |

**A condition that cannot be parsed is reported in the console at boot and treated as FALSE.**
Never as true. A typo can therefore never quietly promote a fate over the one you meant.

---

## Plugin commands

| command | what it does |
| --- | --- |
| **Play Epilogue** | compile every fate from the current game state and play the sequence |
| **Compile Only** | work the fates out and store them, showing nothing — use before your own ending scene |
| **Get One Subject's Fate** | write one subject's resolved fate index into a variable, for your own branching |

The usual place for **Play Epilogue** is the last event of your ending, immediately before the
game-over or title return.

---

## Options

| parameter | default | notes |
| --- | --- | --- |
| **Epilogue Title** | `What Became of Them` | shown on every plate |
| **Hold Per Plate** | `240` frames | the player can always advance early |
| **Auto Advance** | ON | OFF waits for input on every plate |

---

## Saves

A compiled armorial is written into the save with a schema version and restored losslessly. An
older save that predates the plugin simply has no armorial yet and compiles fresh when asked.

---

## Compatibility

**Tested against a clean RPG Maker MZ project, in the real engine — 28/28 in-engine checks and
26/26 headless tests, with 0 console errors and 0 page errors.**

**It touches exactly two core methods, and it extends both rather than replacing them:**

| method | what Armorial does | why it is safe |
| --- | --- | --- |
| `Scene_Boot.prototype.start` | reads its own parameters, then calls the original | the original is saved and always called |
| `Game_System.prototype.initialize` | calls the original, then adds one key | the original is saved and always called first |

It adds `Game_System.prototype.csafArmorial` (a new, namespaced method) and one property,
`_csafArmorial`. **Nothing else in the engine is modified.** In particular it does **not** restyle
`Window_Gold`, `Window_Help`, `Window_Base` or any other window your game already uses — its
epilogue is a scene of its own that draws itself, so installing Armorial cannot change the look of
the rest of your project.

- **Load order does not matter.** Every read of the corpus is deferred to `Scene_Boot`, so Armorial
  does not care whether it loads before or after anything else.
- It reads `$gameSwitches` and `$gameVariables`, and writes one key on `$gameSystem`.
- **No script calls and no `eval`** — conditions are parsed by a small expression reader, and an
  unparseable condition is reported at boot and treated as FALSE, never as true.
- It ships no images, no audio and no fonts.

> **On other plugins:** because Armorial replaces no core method and restyles no shared window, it
> has no known conflicts — but "no known conflicts" is not the same as "tested with every plugin",
> and it would be dishonest to imply otherwise. It has **not** been tested alongside any specific
> third-party suite. If you hit an interaction with one, tell us and it will be looked at.

---

## Also from Core Systems Asset Factory

- **Threads** — the branching-story flowchart and endings gallery. *Threads shows them the map;
  Armorial shows them what became of everyone.*
- **Chronicle Core** — branching quests, choices, faction reputation and world state. The layer that
  *records* the consequences Armorial reads.
- **Sigil Core** — every spell generates its own animated seal from that skill's own properties.

<https://csaf.itch.io>

---

## Terms of use

See `LICENSE.txt`. Commercial and non-commercial use in RPG Maker MZ projects is permitted.
Redistribution of the plugin itself is not.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
