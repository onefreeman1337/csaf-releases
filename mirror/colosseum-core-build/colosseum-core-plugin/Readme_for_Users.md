# Colosseum Core — the championship layer for RPG Maker MZ

**Keep your arena menu. This is the championship above it.**

RPG Maker will happily run a battle. What it will not do is make that battle *mean* anything: who
you had to beat to get here, who is waiting in the other half of the draw, who took the belt off
you last season and remembers doing it. Colosseum Core is that structure — seeded brackets that
fill in as you win, persistent rivals that level between rounds and hold grudges, weight classes,
seasons, and championship belts that change hands.

Your player fights **real battles through your battle system, untouched**. Every rival-vs-rival
match resolves deterministically from a tournament seed, so the same championship plays out the
same way in every save — and differently the moment you change the seed.

---

## Install

1. Copy the three files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and add them **in this order**:

   | Order | Plugin | What it is |
   | --- | --- | --- |
   | 1 | `ColosseumCore` | the tournament engine. **Required.** |
   | 2 | `ColosseumBracket` | the championship board — a slate-and-brass bracket that draws itself. Optional, and it is the face of the product. |
   | 3 | `ColosseumSeason` | the ledger — season standings and a dossier on every rival. Optional. |

3. Open `ColosseumCore` and add at least one **Tournament**, a few **Rivals**, and (if you want a
   title on the line) a **Belt**. No notetags, no database edits, no map changes.

---

## Your first championship, in five steps

1. **Create rivals.** In `ColosseumCore` → *Rivals*, each rival has an id (a short stable name like
   `cassia`, never shown to the player), a display name, a face image, the **troop the player
   fights** when drawn against them, a base level, a team size, and a **temperament**:

   - `steady` — grinds upward at their own pace.
   - `hungry` — chases the player's level and closes the gap season by season.
   - `volatile` — swings up and down, but never below their authored base.

2. **Create a tournament.** In *Tournaments*, give it an id, a name, a bracket size (4, 8 or 16),
   and its entrants — rival ids plus `$player` for the player's party. Fewer real entrants than
   slots means the top seeds draw byes, exactly as a real bracket does. Optional: a weight class
   (min/max mean party level), a belt on the line, and a gold purse that grows every round.

3. **Enter it.** Call the **Enter a tournament** plugin command. Seeding is by rating — a blend of
   level and team size — so the bracket has favourites and long shots, not a random scatter.

4. **Fight, and let the world fight around you.** **Start the player's match** runs the player's
   current-round battle through your battle system; the result lands in the bracket. **Resolve
   rival matches** (or **Simulate to the player's match**) plays out everyone else's round from the
   seed. Open the board any time with **Open the bracket** and watch the lines draw toward the
   final.

5. **Close the season.** At your season boundary, call **Advance the season**: every rival trains
   toward the player, the standings roll on, and the belts remember their lineage.

---

## The nine plugin commands

| Command | What it does |
| --- | --- |
| `Open the bracket` | Opens the live championship board for a tournament. |
| `Open the season table` | Opens the ledger: standings and rival dossiers. |
| `Enter a tournament` | Registers the player's party and builds the seeded bracket. |
| `Start the player's match` | Runs the player's current-round battle through your battle system. |
| `Resolve rival matches` | Instantly resolves every rival-vs-rival match in the current round. The player's own match is never simulated. |
| `Simulate to the player's match` | Fast-forwards rival matches round by round until the player is due, or the tournament ends. |
| `Advance the season` | Closes the season; rivals train, the counter rises. |
| `Award a belt` | Hands a belt to a holder directly, for scripted title changes (`$player` works). |
| `Export standing to variable` | Writes the player's placement (1 = champion) into a game variable, for your own events. |

---

## The three screens (and why they don't look like RPG Maker)

**The board** (`ColosseumBracket`) is a diagram, not a menu: brass strokes draw each result into
the tree, eliminated fighters crack and fade, the champion's path burns gold, and your own chip is
ringed when you are due in the arena. **The ledger** (`ColosseumSeason`) is a season table with a
win-rate bar and form pips per fighter, beside a dossier on whoever is selected — their level
against yours, your head-to-head record, and what they did to you last time.

**Nothing in either scene is an RPG Maker window.** No `Window_Base`, no windowskin, no default
font. Every mark is drawn into a bitmap once and animated by moving sprites, so a fully animated
board costs 3 draw calls a frame. Both scenes carry a stone-grain-and-lamplight shader you can
switch off on very low-end hardware.

The palette — slate, brass, parchment, crimson, gold — is set **once** in `ColosseumCore` and read
by every colosseum screen, so restyling the whole product is five colour fields.

---

## Balance, measured rather than hoped

The resolver's odds were tuned with a 20,000-tournament probe, and the numbers ship in the source:
the #1 seed wins about 31% of open championships and the #8 seed about 2% — favourites are real and
upsets genuinely happen. The rubber band holds at both extremes: stall for five seasons and the
worst rival creep is a couple of levels; race ahead and hungry rivals track about five levels
behind you. Deep tournament runs pay ~2.3× more per battle than shallow farming, so entering the
harder bracket is always worth it.

Tune it yourself with `Upset resistance` (low = every match a coin flip, high = seeding is
destiny), `Rival power per level`, and the rating weights.

---

## Compatibility

- **Saves:** everything lives in a versioned plain-data record inside the normal save file. Old
  saves migrate forward automatically when you update.
- **Battle systems:** the player's matches run through `BattleManager` exactly as a troop battle
  does, so battle-system plugins keep working. Colosseum Core never replaces a core method — every
  patch extends and calls the original.
- **Determinism:** no `Math.random()` anywhere in the logic. Same seed, same championship, on every
  machine.
- Requires RPG Maker MZ. Not compatible with MV.

---

## Sibling systems from CSAF

- **Chimera Core / Battle / Field** — breeding, genetics and creature collection.
- **Chronicle Core** — the consequence engine under your quest log.
- **Bazaar Core** — the economy under your shops: supply, demand, depleting stock.
- **Verdict Core** — evidence, testimony and trials.
- **Sigil Core** — glyph-drawing magic.
- **Aperture Core** — the photography layer.
- **Loop Core** — the time-loop engine.
- **Voyage Core** — sea travel as gameplay.

All at [csaf.itch.io](https://csaf.itch.io).
