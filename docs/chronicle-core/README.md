# Chronicle Core: Branching Quests for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Chronicle Core: Branching Quests for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/chronicle-core  
**Docs published:** 2026-11-05


---

# Chronicle Core — Branching Quests, Choices, Faction Reputation & World State

**For RPG Maker MZ · Version 1.0.0**

Every quest plugin for MZ is a **journal** — a place to read back what an NPC already told you.
This is the layer underneath that: the part that decides what your choices actually *do*.

**Keep your quest log.** Chronicle Core does not replace it, and does not want to.

---

## Contents

1. [Install](#1-install)
2. [The one idea](#2-the-one-idea)
3. [Your first branching quest, in five minutes](#3-your-first-branching-quest-in-five-minutes)
4. [The condition language](#4-the-condition-language)
5. [Quests, objectives and branches](#5-quests-objectives-and-branches)
6. [Reputation](#6-reputation)
7. [The Chronicle](#7-the-chronicle)
8. [Plugin commands](#8-plugin-commands)
9. [Script calls](#9-script-calls)
10. [Saving, and adding this to a game in progress](#10-saving-and-adding-this-to-a-game-in-progress)
11. [Performance](#11-performance)
12. [Compatibility](#12-compatibility)
13. [Troubleshooting](#13-troubleshooting)
14. [Full API reference](#14-full-api-reference)

---

## 1. Install

1. Copy all three files into your project's `js/plugins/` folder:
   - `ChronicleCore.js`
   - `ChronicleJournalUI.js`
   - `CSAF_Theme.js` — the custom visual layer (optional)
2. Open the **Plugin Manager**.
3. Add **ChronicleCore** first, then **ChronicleJournalUI** below it. The order matters —
   the UI reads the engine's parameters. **`CSAF_Theme` can go anywhere.**
4. Open ChronicleCore's parameters and add your quests, factions and tiers.

That is the whole install. No dependencies, no other plugins required.

> **`CSAF_Theme.js` is the custom look, and it is part of what you bought.** It replaces RPG Maker's
> default windowskin, typography and layout with procedural panels, a type scale, easing and a bloom
> filter — it is what the store screenshots show. **Its position in the plugin list does not
> matter:** it is adopted at boot rather than at load, so you can drop it anywhere. Switch it off and
> every window falls back to your project's normal windowskin with no errors. Recolour it from its
> parameters: accent, panel gradient top/bottom, corner radius, and motion.

> If you only want the engine and intend to draw your own journal, install `ChronicleCore.js`
> alone. It has no dependency on the UI file in either direction.

---

## 2. The one idea

**A quest does not own its progress. It reads the world.**

There is one world-state store per save file. Objectives, branch gates, quest availability and
quest failure are all *predicates over that one store*.

That single decision is what separates this from a journal, and it is why it cannot be
retrofitted onto one. Because every quest reads the same store:

- A choice made in Act 1 changes a quest written in Act 3, and **neither quest has to know the
  other exists.** You write a flag; everything that reads it moves.
- "The blacksmith is dead, so this other quest can never start" is one line, not a web of
  self-managed switches.
- Consequences fall out for free instead of being wired by hand, one pair at a time.

The store holds four kinds of thing:

| Kind | What it is | Example |
|---|---|---|
| **Flags** | Named facts that are true or false | `blacksmith_dead`, `thieves_allied` |
| **Counters** | Named integers that never go below zero | `wolves_killed`, `ledgers_read` |
| **Reputation** | Integer standing with a faction, in named tiers | `thieves` at 40, "friendly" |
| **Choices** | Which branch a quest was committed to, permanently | `guild_war` → `side_thieves` |

---

## 3. Your first branching quest, in five minutes

In the Plugin Manager, open **ChronicleCore → Quests** and add one:

| Field | Value |
|---|---|
| Quest ID | `guild_war` |
| Title | `A Matter of Loyalty` |
| Category | `Main` |
| Available When | `flag reached_lowtown` |

Add two **Objectives**:

| ID | Text | Complete When |
|---|---|---|
| `hear_thieves` | Hear the thieves out | `flag met_thieves` |
| `hear_merchants` | Hear the merchants out | `flag met_merchants` |

Add two **Branches**:

| ID | Text | Offered When | Sets Flags | Reputation | Outcome |
|---|---|---|---|---|---|
| `side_thieves` | Side with the thieves | `flag met_thieves` | `thieves_allied` = true | thieves +40, merchants −40 | The docks answer to the guild now. |
| `side_merchants` | Side with the merchants | `flag met_merchants` | `merchants_allied` = true | merchants +40, thieves −40 | Every crate is counted and taxed. |

Now, in your events:

- When the player reaches Lowtown → **Set Flag** `reached_lowtown` = true
- After the thieves' conversation → **Set Flag** `met_thieves` = true
- After the merchants' conversation → **Set Flag** `met_merchants` = true
- In the "pick a side" Show Choices → **Commit Branch** `guild_war` / `side_thieves`

That is it. The moment that branch is committed:

- `thieves_allied` becomes true for the rest of the game,
- reputation moves with both factions and may cross a tier,
- **`side_merchants` becomes permanently unreachable**, and
- the choice is written into the Chronicle.

Any other quest can now gate on `chose guild_war side_thieves` without touching the quest that
offered it.

---

## 4. The condition language

One language, everywhere a condition is accepted. Blank always means "no requirement".

```
flag blacksmith_dead
not flag blacksmith_dead
flag gate_open is false
count wolves_killed >= 5
count ledgers_read == 3
rep thieves >= 25
rep crown <= -10
quest guild_war is complete
chose guild_war side_thieves
```

Combine with `and`, `or`, `not` and parentheses. `and` binds tighter than `or`:

```
flag reached_city and (rep thieves >= 25 or chose guild_war side_thieves)
```

Quest states are `unavailable`, `available`, `active`, `complete`, `failed`.

Comparisons are `>=`, `>`, `<=`, `<`, `==`.

> **A misspelled condition is a loud error at boot, not a gate that quietly opens.** If you type
> `flagg gate_open`, the game refuses to start and tells you which quest and which field. A typo
> that silently evaluated true is the bug you find months later with nothing to point at, and this
> plugin will not let you ship one.

---

## 5. Quests, objectives and branches

### Objectives

An objective is complete when its **Complete When** condition holds. That condition is re-read from
the world, so an objective can go back to incomplete if the world moves — which is exactly what you
want for "keep five potions" and exactly what you do not want for "talk to the captain".

For "talk to the captain", leave **Complete When** blank and tick it with the **Complete Objective**
plugin command instead. Those two ways of completing an objective are mutually exclusive on purpose:
if you try to hand-tick an objective that has its own condition, you get an error rather than two
sources of truth that disagree depending on read order.

**Hidden While** hides an objective from the journal. Use it so that listing *"Confront the traitor"*
does not tell the player there is a traitor. Progress counts against **visible** objectives only —
a hidden one must never make the player read "1 of 2" and start wondering.

**Optional** objectives are shown but never block completion.

### Branches

Branches are **mutually exclusive outcomes**, and committing one forecloses every other one of that
quest *permanently*.

This is enforced, not documented. If a later event tries to commit a second branch it raises an
error rather than quietly writing both — because "the player sided with the thieves AND the
merchants" is a state you never designed, and the engine's job is to make it impossible rather than
to warn about it in a readme.

A branch can also be closed **without** any branch being taken — the window shut and the player
missed it:

> **Foreclose Branch** `guild_war` / `side_thieves`

A quest that declares branches is not complete until one has been committed.

### Failure

**Fails When** permanently fails a quest. Failure **latches**: once the condition has been true
once, the quest stays failed even if the world moves back. A failure that can un-fire is not a
failure. Completion latches for the same reason — otherwise a cleared flag would re-open a finished
quest and let the player claim its reward twice.

---

## 6. Reputation

Reputation is an **integer**, clamped to the range in the parameters (default −100 to +100).

It is integer-only on purpose: floating-point standing would make tier crossings depend on platform
rounding, and a cutscene that fires on one machine and not another is the worst class of bug this
plugin could ship.

**Tiers** are named bands. The defaults:

| Tier | From |
|---|---|
| hated | −100 |
| hostile | −60 |
| disliked | −25 |
| neutral | 0 |
| friendly | 25 |
| honoured | 60 |
| exalted | 100 |

Crossing a tier is the event worth writing a cutscene against, and it is recorded in the Chronicle
automatically.

You do **not** have to declare a faction before using it. Reputation works with any id at all;
declaring one in **Factions** buys it a display name and a description for the journal, nothing
more. Refusing an undeclared faction would only produce crashes in your game, never fewer bugs.

---

## 7. The Chronicle

The Chronicle is the record of what the player **did** — every committed choice, every quest that
completed or failed, every tier crossing, in the order they happened.

Selecting an entry expands it into the consequences that followed: the standing that moved, and the
**Outcome** prose you wrote on that branch.

Write that outcome text in the player's language. The plugin deliberately never shows the player the
flag names a branch sets — `docks_lawless` is your private vocabulary, and showing it in the
player's own record of their own choice would be a defect.

The Chronicle is capped (default 500 entries, oldest dropped) so a long game cannot grow the save
file without bound.

---

## 8. Plugin commands

| Command | What it does |
|---|---|
| **Set Flag** | Write a world-state fact |
| **Add To Counter** | Move a counter (never below zero) |
| **Add Reputation** | Move a faction's standing |
| **Start Quest** | Mark a quest accepted, so it shows as active |
| **Complete Objective** | Tick an objective that has no condition of its own |
| **Commit Branch** | Take one outcome, foreclosing the rest forever |
| **Foreclose Branch** | Close one outcome without taking any |
| **Fail Quest** | Permanently fail a quest |
| **Check Condition** | Evaluate a condition into a switch |
| **Read Reputation** | Write a faction's standing into a variable |
| **Read Counter** | Write a counter's value into a variable |
| **Open Journal** | Open the journal scene |

---

## 9. Script calls

For a **Conditional Branch → Script**:

```js
$chronicle.check('rep thieves >= 25 and flag thieves_allied')
```

Everything else:

```js
$chronicle.flag('gate_open')             // -> true / false
$chronicle.setFlag('gate_open', true)
$chronicle.count('wolves_killed')        // -> number
$chronicle.add('wolves_killed', 1)
$chronicle.rep('thieves')                // -> number
$chronicle.tier('thieves')               // -> 'friendly'
$chronicle.addRep('thieves', 10)
$chronicle.state('guild_war')            // -> 'active'
$chronicle.chose('guild_war')            // -> 'side_thieves' or null
$chronicle.commit('guild_war', 'side_thieves')
$chronicle.start('guild_war')
$chronicle.world()                       // the raw store, if you want it
```

To react to a quest finishing without polling for it:

```js
ChronicleCore.onStateChange = function (changes) {
  changes.forEach(function (c) {
    if (c.state === 'complete') $gameMessage.add(c.quest.name + ' complete!');
  });
};
```

---

## 10. Saving, and adding this to a game in progress

World state travels in its own slot in the save file, packed by id rather than by name: the save
carries the flag dictionary once and the truth values as 32-flags-per-integer bitfields. A world
with eleven flags, five factions, a committed choice and eight Chronicle entries measured **706
bytes**.

Every save carries a schema version and there is a migration path, so a future version of this
plugin can load your players' existing saves rather than discarding their world.

**Adding it mid-project is safe.** A save written before you installed the plugin loads as an empty
world rather than crashing — a save file made before the plugin existed is a normal thing to open,
not an error.

---

## 11. Performance

All figures below were **measured in RPG Maker MZ** — real corescript, real PIXI/WebGL, 808×616,
fourteen quests, journal open, 600 sampled frames per condition. They are frame **costs**. See the
note at the end of this section about why that is not the same as a frame rate.

| Condition | Mean | % of the 16.67 ms budget | Frames over budget |
|---|---|---|---|
| Journal open, idle | 4.10 / 4.80 / 4.66 ms | 24.6% / 28.8% / 28.0% | 0 / 600 each |
| Journal open, scrolling continuously | 4.99 ms | 29.9% | 0 / 600 |

Three identical idle runs spanned 4.10–4.80 ms, a 17% spread. **Scrolling is therefore not
distinguishable from idle beyond that run-to-run noise**, and no claim is made that it is.

**The list draws only what is on screen, and this is a count, not a timing:**

| Quests registered | Rows in the list | `drawItem` calls per refresh |
|---|---|---|
| 14 | 10 | 10 |
| 2,000 | 1,996 | **12** |
| 20,000 | 19,996 | **12** |

Twelve is the number of visible rows. Draw work is bounded by the visible page, exactly, at any
collection size.

Building the list is a different matter and is honestly O(quests): it happens **once per tab
change**, not per frame, and measured 3.4 ms at 14 quests, 3.3 ms at 2,000, and 19.5 ms at 20,000.
At 20,000 quests that is a one-off hitch when you switch tabs, at a quest count no RPG Maker game
will reach.

Everything the journal reads per frame is cached behind a dirty flag and written into arrays the
windows already own. There are no array literals in a refresh path.

> **Why frame *cost* and not frame *rate*.** These numbers come from an automated browser session,
> and Chrome throttles `requestAnimationFrame` in a window that is not in front — so the engine is
> stepped by hand and vsync pacing simply is not observable. Cost is measurable and is reported.
> Presented frame rate is not, and is not claimed.

---

## 12. Compatibility

**Nothing in this plugin overwrites a core method.** Every hook saves the original and calls it, so
your quest log, menu plugin, message plugin and save plugin keep working. Plugin interoperability is
the single largest source of support load in this market, and a quest engine that breaks someone's
menu is worthless however good its logic is.

Specifically:

- The main-menu command is added through `Window_MenuCommand.addOriginalCommands` with the original
  saved — it stacks with any other plugin that adds menu commands.
- Save integration goes through `DataManager.makeSaveContents` / `extractSaveContents`, the standard
  path, with the originals called.
- The world-state store is **not** attached to `$gameSystem`. Its dictionaries are prototype-less so
  that a flag named `__proto__` behaves like any other flag, and RPG Maker's `JsonEx` cannot encode
  such an object. Keeping it out of the save graph is what makes both of those true at once. This
  has been verified with a real `saveGame` / `loadGame` round trip, including a flag literally
  named `__proto__`.

---

## 13. Troubleshooting

**The game will not start and the console names a quest.**
A condition somewhere has a syntax error. The message names the quest and the field. This is
deliberate: conditions are validated at boot rather than at the moment a gate is reached, so you
find the typo instead of your players.

**"unknown condition key" / "unexpected ... in condition".**
Check §4. The most common cause is a comparison without an operator — `rep thieves 25` instead of
`rep thieves >= 25`.

**A quest never becomes available.**
Check its **Available When**. Use `$chronicle.check('...')` in a Script command to test the exact
condition, and `$chronicle.flag('name')` to confirm the flag you think is set really is. An unset
flag and a flag set to false both read false — `ChronicleCore.Flags.isKnown()` tells them apart.

**A branch will not commit.**
Three possible reasons and the error says which: the branch id does not exist, its **Offered When**
does not hold, or the quest has already been committed to something else.

**The journal command is missing from the main menu.**
`ChronicleJournalUI.js` must be installed and listed **below** ChronicleCore, and ChronicleCore's
**Add Journal to Main Menu** must be on.

**Quest completion is recorded later than it happened.**
The engine observes state after every write it performs. If you are changing the world by writing
the store directly from your own code, call `ChronicleCore.observe($gameSystem.chronicle())`
afterwards.

---

## 14. Full API reference

Every public function carries full JSDoc in the source, which ships uncompressed and unobfuscated —
you bought a plugin you can read, debug and extend.

### `ChronicleCore.Flags`
`create()` · `get(world, name)` · `set(world, name, value)` · `isKnown(world, name)` ·
`names(world)` · `count(world, name)` · `add(world, name, delta)` · `setCount(world, name, value)` ·
`counters(world)` · `serialize(world)` · `deserialize(data)`

### `ChronicleCore.Reputation`
`get(world, faction)` · `add(world, faction, delta)` · `set(world, faction, value)` ·
`tierOf(world, faction)` · `tierAt(value)` · `factions(world)` · `configure(options)` ·
`settings()` · `reset()`

### `ChronicleCore.Quest`
`define(spec)` · `register(quest)` · `clear()` · `get(id)` · `all()` · `objective(quest, id)` ·
`isAvailable(quest, world)` · `isObjectiveComplete(quest, id, world)` ·
`completeObjective(quest, id, world)` · `start(quest, world)` · `fail(quest, world)` ·
`stateOf(quest, world)` · `branch(quest, id)` · `chosenBranch(quest, world)` ·
`isForeclosed(quest, id, world)` · `foreclose(quest, id, world)` ·
`availableBranches(quest, world)` · `availableBranchesInto(quest, world, out)` ·
`commit(quest, branchId, world)`

### `ChronicleCore.Journal`
`active(world)` · `activeInto(world, out)` · `finished(world)` · `finishedInto(world, out)` ·
`objectives(quest, world)` · `objectivesInto(quest, world, out)` ·
`isObjectiveVisible(world, objective)` · `progress(quest, world, out)` · `isComplete(quest, world)`

### `ChronicleCore.Chronicle`
`entries(world)` · `record(world, kind, a, b)` · `describe(entry)` · `limit`

### `ChronicleCore`
`evaluate(condition, world)` · `parse(text)` · `clearParseCache()` · `observe(world)` ·
`onStateChange` · `factionName(id)` · `serialize(world)` · `deserialize(data)` · `VERSION` ·
`SCHEMA_VERSION`

The `...Into(…, out)` variants write into an array you own instead of allocating one. Use them if
you are drawing your own journal and refreshing on a dirty flag.

---

## Licence

See `LICENSE.txt`. Use it in unlimited games, commercial or free, and keep 100% of your revenue.
Do not resell or redistribute the plugin itself.

**Support:** open a comment on the itch.io product page.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
