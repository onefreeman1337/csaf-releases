# Asterism: Constellation Skill Tree for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Asterism: Constellation Skill Tree for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/asterism  
**Docs published:** 2026-11-05


---

# Asterism — a constellation skill tree for RPG Maker MZ

**Every node draws its own star, generated from that skill's own data. No icon sheet, no node art
to draw, nothing to commission.**

Asterism reads your skill database and generates a unique stellar mark for every skill from its own
properties — type, element, scope, cost and effects — then hangs them on a night-sky chart your
players navigate. Skills they have not taken hang **unlit**: the same mark, in outline, at low
light, so they can see the shape of a choice before they make it.

56 authored motifs across four axes combine into **33,600 distinct mark forms**, and ten
palettes take that to **336,000 stars**. Not one of them ships as an image file.

---

## Installation

1. Copy the four files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the **Plugin Manager** and add them **in this order**:

   | # | File | What it is |
   | --- | --- | --- |
   | 1 | `AsterismStars.js` | the motif corpus — data only, draws nothing |
   | 2 | `AsterismChart.js` | the renderer |
   | 3 | `Asterism.js` | the system, the parameters and the plugin commands |
   | 4 | `AsterismScene.js` | the chart scene |

   **Order matters.** Each file reads the one above it, and they are deliberately written so that a
   wrong order fails with a clear message naming the file to move, rather than silently doing
   nothing.

3. Configure your trees on **`Asterism.js`** — the other three take no parameters.

---

## Setting up your first constellation

1. On `Asterism.js`, open **Trees** and add one.
2. Give it a **Tree id** (`warrior`), a **Display name** (*The Sentinel*), and choose whether it
   belongs to an **Actor** or a **Class**.
3. Open **Nodes** and add stars. Each node takes:

   | Field | Meaning |
   | --- | --- |
   | **Node id** | unique within this tree; other nodes refer to it |
   | **Skill** | the skill this star teaches. **Its data generates the mark.** |
   | **Cost** | how many points it costs |
   | **Chart X / Y** | where it sits. Negative Y is upward. |
   | **Requires** | the node ids that must be charted first |

4. Award points (see below) and open the chart with the **Open Chart** plugin command.

**You do not have to make the layout fit the screen.** The chart measures your tree and fits it
between the header and the reading panel automatically. It will shrink a large tree; it will never
magnify a small one, so your stars always draw at their proper size.

---

## Prerequisites, including multiple parents

`Requires` is a comma-separated list of node ids. By default **all** of them must be charted:

```
Requires:  rend, bulwark          both are needed
```

Prefix the list with `any:` and **any one** is enough:

```
Requires:  any: ruin, temper      either will do
```

Both forms accept any number of parents, so a star can sit where three branches converge — which is
what a real constellation looks like. The chart draws a line to every parent and brightens it as
the path becomes reachable.

---

## Awarding points

Points are called **Starlight** by default; rename them in the parameters.

| How | What to do |
| --- | --- |
| On level up | set **Default points per level**, or put `<AsterismPoints:2>` on a **Class** |
| From an item | put `<AsterismPoints:1>` in the item's **Note** — awarded when consumed |
| From an enemy | put `<AsterismPoints:3>` in the enemy's **Note** — awarded to the party on defeat |
| Directly | the **Grant Points** and **Grant Points (Party)** plugin commands |

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Open Chart** | opens the constellation for an actor |
| **Grant Points** | gives one actor points |
| **Grant Points (Party)** | gives every party member points |
| **Reset Chart** | refunds everything an actor has charted |

---

## Controls

| Input | Action |
| --- | --- |
| Arrow keys / WASD | move between stars |
| OK (Enter / Z) | chart the selected star |
| Shift | release it again, if refunds are enabled |
| Cancel (Esc / X) | leave |
| Mouse | click to select, click again to chart |

Movement is *nearest star in that direction*, not a grid step — a constellation is not a grid, and
your stars sit where you put them.

---

## Refunds

With **Allow refund** on, the player may release a star and reclaim its points at the **Refund
rate** you set.

**A star another charted star depends on cannot be released**, and the panel says so rather than
just refusing. Otherwise the player could end up holding a skill they can no longer legally have.
**Reset Chart** ignores that and refunds everything, peeling the outermost stars first.

---

## How the art is generated

You never pick node art. The four axes are read off the skill itself, so the picture teaches the
mechanic:

| Axis | Read from | So… |
| --- | --- | --- |
| **Orbit** | the skill's **scope** | a single-target skill wears one companion star; an all-enemies skill wears a full ring |
| **Corona** | its **element** | every fire skill flares the same way, so a school reads as one family |
| **Mantle** | its **effects** | inflicts a state → a ring of thorns; buffs → a wreath; heals → an aura |
| **Core** | its **type** and **damage type** | the body of the star |
| **Palette** | its **element** | |

Change a skill's element in the database and its star changes to match — in every playthrough, on
every machine, forever. The derivation is a hash, so nothing is stored and nothing can drift.

---

## Compatibility

**Tested alongside:** stock RPG Maker MZ 1.9.0 with no other plugins, and verified in-engine on a
clean project.

**Asterism EXTENDS core methods and never replaces them.** Every patch saves the original and calls
it, so it coexists with other plugins that touch the same methods. Measured on the shipped source:

| Core method | What Asterism does |
| --- | --- |
| `Game_Actor.prototype.levelUp` | extends — awards points, then calls the original |
| `Game_Party.prototype.consumeItem` | extends — reads the notetag, then calls the original |
| `Game_Enemy.prototype.performCollapse` | extends — reads the notetag, then calls the original |

**Core methods replaced outright: none.**

It adds no windows and uses no windowskin, so it will not restyle anything else in your project. It
stores its record inside `$gameSystem`'s own save data, so it needs no save-file surgery and
survives `JsonEx.makeDeepCopy` — which some plugins call freely.

**If you use a plugin that also patches those three methods, load Asterism after it.**

---

## Saving

Everything the player charts is saved with the game, in `$gameSystem`. Existing saves made before
you added Asterism will load fine and simply start with an empty chart. The record carries a
version stamp so future updates can migrate it.

---

## Terms of use

Free for use in commercial and non-commercial RPG Maker MZ projects. Do not redistribute or resell
the plugin itself. Credit is appreciated but not required.

© Core Systems Asset Factory

---

## More from Core Systems Asset Factory

- **Sigil Core** — every spell generates its own animated seal from that skill's own properties
- **Herbarium** — every reagent mounts as a generated botanical plate
- **Armorial** — a coat of arms generated from each character's own deeds
- **Lineage** — a generated evolution atlas of every species your player discovers
- **Hallmark** — a struck guild mark for every item your loot system rolls

<https://csaf.itch.io>


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
