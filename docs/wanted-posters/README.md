# Wanted Posters: Generated Bounty Board for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Wanted Posters: Generated Bounty Board for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/wanted-posters  
**Docs published:** 2026-11-05


---

# Wanted Posters — for RPG Maker MZ

**Every bounty in your game prints its own wanted poster, generated from the quarry itself.**

An engraved figure cut from that beast's own body plan, the crime set in period type, the reward in
old-style figures, and the issuing jurisdiction's seal struck in wax — printed on paper that ages,
weathers and tears. The board fills with them as bounties are posted, claimed and expire.

Nothing in this plugin is an image file. There is no atlas, no sprite sheet and no PNG anywhere in
the package. Every mark you see is drawn at run time from the bounty's own record, which is why two
bounties never print the same sheet and why the posters are sharp at any size your layout asks for.

---

## Install

1. Copy the four files from `js/plugins/` into your project's `js/plugins/` folder.
2. In the Plugin Manager, add them **in this order**:

   1. `BountyRender.js` — drawing primitives
   2. `BountyQuarry.js` — the 49-beast corpus
   3. `BountyPoster.js` — the composer
   4. `WantedPosters.js` — the system

3. Turn all four ON.

**The order is a recommendation, not a requirement.** The plugins resolve each other at first use
rather than at load time, so a wrong order cannot break them — it simply reads more sensibly in the
Plugin Manager list. (This was not free: an earlier build captured its siblings at load time and
no-oped silently behind one console line when the folder loaded alphabetically.)

---

## Compatibility — the question you actually have

**Tested in the real RPG Maker MZ engine with the stock scripts unmodified**, not only in tests.

**It extends three engine functions, each by saving the original and calling it, and replaces nothing:**

```
Game_System.prototype.initialize        (original saved and called)
DataManager.makeSaveContents            (save hook)
DataManager.extractSaveContents         (load hook)
```

**Nothing is clobbered.** No core method is overwritten outright, so Wanted Posters co-exists with
other plugins that patch the same seams — including large suites such as VisuStella MZ Core Engine.
If another plugin also extends `Game_System.prototype.initialize`, both run.

The runtime state is stored on a **non-enumerable** property, so `JsonEx` cannot double-write it
into your save file.

---

## Quick start

Post a bounty from an event with a Plugin Command:

| Command | What it does |
| --- | --- |
| `post` | Post a bounty. Leave `quarryId` blank and one is chosen for you. |
| `claim` | Mark a bounty claimed — the sheet is struck through in red. |
| `expire` | Mark a bounty expired — struck through in grey. |
| `tearDown` | Remove a bounty from the board entirely. |
| `openBoard` | Open the bounty board scene. |

A minimal setup is one event that calls `post` a few times and one that calls `openBoard`.

---

## What is generated

| | count |
| --- | --- |
| Quarry figures (authored vector body plans) | **49** |
| Jurisdiction seal devices | **12** |
| Crime marks | **10** |
| Fleurons | **5** |
| Paper stocks | **4** |
| **Total distinct generated visual entities** | **80** |

Paper stocks age independently and continuously: staining, foxing, sun-fade and water damage all
scale with how long the sheet has been up, so the same bounty prints differently on each stock and
differently again a month later.

---

## Performance

Measured in the real engine, not estimated:

- **3 draw calls per frame**, 0 texture uploads, 0 bitmap dirties, 0 window refreshes.
- **0 display-object growth** over 600 frames — nothing accumulates.
- **0 stock RPG Maker windows or touch buttons** on screen in either scene.
- The update half of the frame stays far inside its budgets (2 ms mean, 4 ms p99) on every gate run. Timing moves from run
  to run on the same code, so the counts above are the figures worth quoting.

Posters are composed once and cached as a single bitmap; the board does not redraw them per frame.

---

## Determinism and saves

- **No `Math.random()` anywhere in the product.** Every sheet derives from a hash of the bounty's
  own fields, so the same bounty prints the same poster on every machine, every run, forever.
- Saves are versioned (`schema: 2`) and round-trip losslessly.

---

## Licence

See `LICENSE.txt`. In short: use it in unlimited games, commercial or free, keep 100% of your
revenue, modify it freely — just don't resell or republish the plugin itself.

---

## AI disclosure

The code and the generated artwork in this product were produced with AI assistance. This is
disclosed truthfully on the store listing as required.

© 2026 Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
