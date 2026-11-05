# Loop Core: Time Loop Engine for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Loop Core: Time Loop Engine for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/loop-core  
**Docs published:** 2026-11-05


---

# Loop Core — the time-loop engine for RPG Maker MZ

**The world resets. The player does not.**

Majora's Mask, Outer Wilds, Deathloop, *12 Minutes*. The mechanic is easy to describe and miserable
to hand-roll, because it is not really about time — it is about bookkeeping. What snaps back. What
survives. What the game must remember that the world has forgotten. And how the player is ever shown
any of it.

Loop Core is that bookkeeping, plus the screen that makes it legible.

---

## Install

1. Copy the three files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and add them **in this order**:

   | Order | Plugin | What it is |
   | --- | --- | --- |
   | 1 | `LoopCore` | the engine. Required. |
   | 2 | `LoopLedger` | the Loop Ledger scene. Optional but it is half the product. |
   | 3 | `LoopRewind` | the rewind shader. Optional; the loop works without it. |

3. Set **World switches** and **World variables** to the id ranges your world state lives in.
   That is the only setting you must think about, and the next section is about why.

Loop Core needs no new database entries, no notetags and no map changes.

---

## The one rule that keeps your project safe

**Loop Core only ever touches ids you list in World switches and World variables.**

Everything else — every other plugin's switches, every variable you use for something that is not
the world — is not read, not written, and not rewound. There is deliberately **no "reset everything"
mode**, because a loop plugin that clears state it does not own is a plugin that breaks the rest of
your game on the second loop.

So: put your world state in a known range (the default assumes `1-100`), and put anything that must
outlive a loop outside it. That is the whole safety model.

---

## The workflow, start to finish

1. **Build your day as an ordinary map.** Do not think about looping yet.
2. At the moment the day begins, call **Set the anchor**.
3. Wherever the player learns something, call **Learn a fact**.
4. Wherever the day ends — death, midnight, a choice — call **Rewind the loop**.
5. Gate the dialogue that should change on `knows()` and on the loop counter.

That is it. **The Ledger is generated from those calls. You never author the Ledger.**

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Set the anchor** | Marks this moment as the point every rewind returns to. Call once, at loop start. |
| **Rewind the loop** | Restores the world to the anchor, keeps what is declared to survive, advances the loop counter. Takes a short *Cause* string that the Ledger records. |
| **Learn a fact** | Records knowledge the player keeps forever. A rewind cannot take it away. |
| **Forget a fact** | Removes a fact. Rare, but some stories take knowledge back. |
| **Mark a divergence** | Records that the player did something this loop. Becomes a pin on the Ledger's ring. |
| **Open the Loop Ledger** | Opens the scene. |

---

## Gating events on the loop

**Without any scripting at all.** Point *Loop counter variable* at a spare variable and Loop Core
keeps it equal to the current loop number. Now any ordinary Conditional Branch works:

```
Conditional Branch: Variable [Loop] >= 3
```

**With script conditions,** for knowledge. These read like sentences on purpose:

```js
$gameLoop.knows('mayor_lies')            // ever learned it
$gameLoop.learnedThisLoop('mayor_lies')  // learned it THIS time round
$gameLoop.factLoop('mayor_lies')         // which loop taught it (0 = never)
$gameLoop.loopIndex()                    // how many loops deep
$gameLoop.divergedFrom('saved_the_smith')// ever did it, in any loop
```

The pattern that carries a whole time-loop game:

> *Page 1 — condition: none.* The mayor gives you the official story.
> *Page 2 — condition: `$gameLoop.knows('mayor_lies')`.* You interrupt him, and he goes quiet.

Same NPC. Same map. The world reset; the conversation did not.

---

## What survives a rewind

| | |
| --- | --- |
| **Always** | facts, divergence pins, the loop counter, the Ledger itself |
| **If you declare it** | items in *Items that survive*, switches in *Switches that survive* |
| **Never** | anything inside the world ranges not declared to survive |
| **Untouched** | every id outside the world ranges, whatever it belongs to |

**Self-switches** — how MZ remembers "this chest is open" — are rewound by default, and the rewind
*deletes* self-switches created since the anchor rather than only overwriting the ones the anchor
recorded. Without that, a chest opened during a loop stays open forever, which is the single most
likely "my loop plugin is broken" bug and is invisible until the second loop.

---

## The Loop Ledger

Press the command and the player sees the shape of their own repetition.

- **The dial.** One ring per loop, oldest innermost. The live loop is the outer ring, and it breathes.
- **Pins.** Every divergence is a mark on its loop's ring. A crowded ring was a loop where you
  changed things.
- **The constellation.** Everything known, laid out from the facts' own ids so the map is identical
  in every save on every machine. Facts learned in the same loop are joined, because the story that
  taught you one taught you the other.

Controls: **Up/Down** select a loop · **Left/Right** move through knowledge · **Cancel** close.

It draws no RPG Maker windows at all — the whole scene is custom, and the colours are yours to
change in the plugin parameters.

---

## Saves

Loop Core stores its state in a **versioned record with a migration path**, and it stores your fact
ids in **arrays, never as object keys**. That is not a style preference. An id taken from author
text can be `__proto__`, which as an object key sets the prototype instead of storing a value — and
the resulting object breaks MZ's own save serialiser for your *entire game*, not just for this
plugin. Arrays cannot express that bug, and the test suite has a case asserting exactly it.

- Adding Loop Core to an existing save works.
- Removing it later leaves the rest of the save intact.
- Saving mid-loop and reloading rewinds correctly, because the anchor is part of the record.

---

## Compatibility

Patches are applied by **prototype extension with the original saved and called**, never by
replacing a core method. Loop Core touches `Game_System#initialize`, `Game_System#onAfterLoad` and
`DataManager.makeSaveContents`; `LoopRewind` extends `SceneManager.updateMain` and
`SceneManager.changeScene`. Nothing else in the engine is modified.

The rewind visual degrades safely: if the shader will not compile on a player's hardware, the rewind
still happens, immediately and correctly, with no visual.

**Performance.** The Ledger draws everything into bitmaps once and animates only sprite properties.
Measured in the real engine over 400 stepped frames: **2 draw calls per frame, 0 texture uploads,
0 bitmap redraws, 0 window refreshes, 0 display-object growth**, with the update half of the frame
at **0.014 ms mean**. Those are frame *costs* measured with the engine stepped by hand — not a
claim about presented frame rate, which cannot be measured this way.

---

## Also from CSAF

**[Chronicle Core](https://csaf.itch.io/chronicle-core)** — branching quests, foreclosed choices and
faction consequence. A choice closed off in one loop can be reopened in the next; Chronicle tracks
what your choices *do*, Loop Core decides which of it survives the reset.

Full catalogue: **[csaf.itch.io](https://csaf.itch.io)**

---

## Licence

See `LICENSE.txt`. Short version: **ship as many games with it as you like, commercial or free,
keep 100% of your revenue — just do not resell the plugin itself.**

Built by CSAF — Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
