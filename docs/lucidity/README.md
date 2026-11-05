# Lucidity: Sanity and Hallucinations for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Lucidity: Sanity and Hallucinations for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/lucidity  
**Docs published:** 2026-11-05


---

# Lucidity — the sanity, stress & hallucination director for RPG Maker MZ

**Keep your horror filter. This is the thing that decides what is real.**

Every horror plugin for MZ works on *presentation* — a vignette, a grain shader, a colour grade, a
jump-scare trigger you fire from an event. Not one of them holds a **state** that the world answers
to. So the fog looks frightening and the dungeon behind it is exactly the dungeon it was at full
health, with the same NPCs saying the same lines.

Lucidity is the layer underneath. It holds one value — 100 is clear-headed, 0 is gone — and turns it
into things that are *true*: which version of an event page exists, which NPC is standing there,
what the party is afflicted with, and **what the player can see that is not there.**

---

## What your players actually see

The hallucination layer ships **forty-four authored apparition motifs**, and every one of them
is *drawn by code at runtime* in the current tier's palette. There is no sprite sheet, no atlas, and
**no PNG ships with this plugin at all**.

| Category | Count | What they are |
| --- | --- | --- |
| `figure` | 8 | doorway silhouettes, a corner crouch, a hall-end watcher, a walking double |
| `architectural` | 8 | doors that were not there, corridors that should not fit, false stairs |
| `surface` | 8 | things moving under the floor, wet spread, breathing walls |
| `watcher` | 6 | paired eyes in the dark, a blink set, a stare through a crack |
| `script` | 6 | writing that was not on that wall a moment ago |
| `light` | 4 | lies told by lamps and shadow |
| `double` | 4 | the player, elsewhere, doing something the player is not doing |

Placement is **deterministic per save, map and tier**: what haunted a corridor haunts it again in
the same playthrough, so a player can *learn* a haunted room and be right. Density rises as lucidity
falls — a Lucid player sees nothing at all, and that absence is what makes the first apparition land.

---

## Install

1. Copy the three files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and add them **in this order**:

   | Order | Plugin | What it is |
   | --- | --- | --- |
   | 1 | `LucidityCore` | the director — the value, the tiers, drains, event variants, afflictions. **Required.** |
   | 2 | `LucidityManifest` | the hallucination layer — the 44 motifs and the tier shader. Optional, and it is the face of the product. |
   | 3 | `LucidityPsyche` | the Psyche scene — the player's read-out of their own state. Optional. |

3. That is the whole install. Sensible defaults ship for every parameter, so the plugin does
   something the moment it is enabled — you do not have to author a five-tier profile to start.

---

## Your first descent, in five steps

1. **Erode it.** Put a drain on a map with a note tag:

   ```
   <Lucidity Drain: 0.2>
   ```

   `0.2` points per second is the recommended dungeon rate and it is a **measured** figure, not a
   round number — see *The numbers are measured* below.

2. **Write a variant.** On any event **page**, add a Comment with a tier condition. That page then
   only exists inside that band:

   ```
   <Lucidity Tier: 2+>      this page appears at tier 2 or worse
   <Lucidity Tier: 0-1>     this page appears only while mostly lucid
   <Lucidity Phantom>       this page dissolves when the player steps adjacent
   ```

   These are ordinary event pages. You author a frightened version of a shopkeeper the same way you
   author any other page — no scripting, no new editor.

3. **Give them a way back.** Any item or skill can restore:

   ```
   <Lucidity: +15>
   ```

4. **Let the tiers bite.** Each tier can auto-apply a state to the party and fire a common event
   once on entry, so crossing a boundary is an *event in the fiction*, not just a number moving.

5. **Show them.** Call **Open the Psyche scene** to give the player their own read-out — where they
   are, what recently moved it, and what that tier is doing to them.

---

## It works with the stat system you already have

Set **Mirror variable** to any game variable id and Lucidity stops managing a value of its own: it
reads and writes that variable instead. Your existing stress, corruption, humanity or morale stat
becomes the source, and everything above — variants, apparitions, afflictions, the scene — runs off
it unchanged.

---

## The numbers are measured, not guessed

`0.2/s` is the shipped dungeon drain because it was measured against the default settle rate, not
because it is a tidy number:

| drain | time pinned at the WORST tier, on a 90s-in / 90s-out loop, settling on |
| --- | --- |
| **0.2/s** (shipped) | **0.0%** — and 68.3% of the run at *Frayed*, the tier the design wants |
| 0.5/s | **64.7%** |

At 0.5 the drain overwhelms the restoring force and the system stops having tiers at all — it just
sits at the bottom. At 0.2 it lives around *Frayed* and pushes into *Delirious* on a bad run, which
is the shape a horror game wants.

**Settling is the reason the tiers have somewhere to sit.** While below the settle target the value
recovers slowly, so ordinary play pulls back toward a baseline. Set the rate to `0` if you want a
pure one-way slide instead.

**Recovery hysteresis** stops the world strobing at a band boundary: climbing out of a tier requires
rising a few points *above* its ceiling, so a value hovering on the line does not flicker the
apparitions, the states and the event pages on and off.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Add lucidity** | add or subtract points, with a cause label shown in the Psyche scene |
| **Set lucidity** | set the value outright |
| **Freeze** / **Unfreeze** | hold the value and tier through a cutscene; nothing accumulates while frozen |
| **Open the Psyche scene** | push the player's read-out onto the scene stack |

Map note tags: `<Lucidity Drain: n>` · `<Lucidity Region 7: n>` · `<Lucidity Quiet>` ·
`<Lucidity Density: n>`

---

## Compatibility and craft

- **Saves are versioned and migrate forward.** A save made on an older version of this plugin loads
  on a newer one.
- **Nothing is patched by replacement.** Core methods are extended with the original saved and
  called, so this coexists with other plugins rather than winning a fight with them.
- **No `Math.random()` in game logic.** Every draw comes from a seeded stream, which is what makes
  apparition placement reproducible per save.
- **Zero allocation in per-frame paths**, enforced by a static scan in the test suite rather than by
  a timing run.

---

## Other CSAF systems for RPG Maker MZ

Lucidity is part of the CSAF catalogue for RPG Maker MZ. If you are building horror or a game where
state changes the world, these sit beside it:

- **Sigil Core** — every spell generates its own animated seal from that skill's own properties.
- **Chronicle Core** — the consequence engine underneath a quest log.
- **Cipher Core** — a constructed script the player learns to read.
- **Verdict Core** — evidence, contradictions and a case that can actually be solved.

Browse them all at <https://csaf.itch.io>.

---

© 2026 CSAF — Core Systems Asset Factory. See `LICENSE.txt` for terms.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
