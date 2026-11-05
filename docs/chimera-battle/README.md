# Chimera Battle: Monster Type Chart and AI for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Chimera Battle: Monster Type Chart and AI for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/chimera-battle  
**Docs published:** 2026-11-05


---

# Chimera Battle

**Type Matrix, Move Sets, Status Effects & Battle AI for RPG Maker MZ**
Version 1.1.0

Every creature-collector runs on the same four systems: a type chart the player learns to read,
moves with limited uses, status effects that change how a fight is played, and an opponent that
punishes a bad matchup. RPG Maker MZ ships none of them.

Chimera Battle adds all four, without replacing RPG Maker's battle system and without touching a
single skill you have already built.

---

## Contents

1. [The one promise](#1-the-one-promise)
2. [Install](#2-install)
3. [Setup in one minute](#3-setup-in-one-minute)
4. [Notetag reference](#4-notetag-reference)
5. [Plugin parameters](#5-plugin-parameters)
6. [Plugin commands](#6-plugin-commands)
7. [Script calls & full API](#7-script-calls--full-api)
8. [Working with Chimera Core](#8-working-with-chimera-core)
9. [Balancing: the Damage Scale](#9-balancing-the-damage-scale)
10. [Compatibility](#10-compatibility)
11. [Troubleshooting](#11-troubleshooting)
12. [Performance](#12-performance)
13. [Licence & support](#13-licence--support)

---

## 1. The one promise

**A skill with no `<chimera type:>` notetag is left completely alone.**

Install this into a finished project and no existing skill changes its damage by a single point.
Nothing is replaced — every core method is extended through a saved original, the way plugins are
supposed to co-operate. You opt each skill in, one notetag at a time.

---

## 2. Install

1. Copy `js/plugins/ChimeraBattle.js`, `js/plugins/ChimeraBattleUI.js` and
   `js/plugins/CSAF_Theme.js` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and add them, in this order:

   ```
   ChimeraCore        (optional — only if you own it)
   ChimeraBattle
   ChimeraBattleUI
   CSAF_Theme         (anywhere — order does not matter)
   ```

`ChimeraBattleUI` is purely cosmetic: it draws type labels, PP, and the matchup preview. Turn it off
and the engine behaves identically.

> **`CSAF_Theme.js` is the custom look, and it is part of what you bought.** It replaces RPG Maker's
> default windowskin, typography and layout with procedural panels, a type scale, easing and a bloom
> filter — it is what the store screenshots show, across the whole battle scene rather than one
> panel. **Its position in the plugin list does not matter:** it is adopted at boot rather than at
> load, so you can drop it anywhere. Switch it off and every window falls back to your project's
> normal windowskin with no errors. Recolour it from its parameters: accent, panel gradient
> top/bottom, corner radius, and motion.

---

## 3. Setup in one minute

**Step 1 — type your creatures.** In an Enemy's or Actor's Note box:

```
<chimera types: Fire, Flying>
```

**Step 2 — turn a skill into a move.** In a Skill's Note box:

```
<chimera type: Fire>
<chimera power: 90>
<chimera category: special>
<chimera pp: 15>
```

Set that skill's **Damage Type** to `HP Damage` in the database. The formula field is ignored for
Chimera moves — leave it as `0`. For a status move, set Damage Type to `None`.

That is already enough for types, STAB, priority, PP and the matchup preview to work.

**Step 3 — wire up the statuses.** RPG Maker ships Poison, Sleep, Paralysis and Confusion, and those
four are already selected in the plugin parameters. It ships no **Burn** and no **Freeze**, so:

- Create a state called Burn. Give it an *HP Regeneration* trait of about −6% if you want it to deal
  damage each turn (this is how RPG Maker deals slip damage, and it is how the stock Poison state
  works).
- Create a state called Freeze. Set its **Restriction** to *Cannot Move*.
- Select both in the plugin's **Status ↔ State Mapping** parameters.

That's it.

---

## 4. Notetag reference

### Skills

| Tag | Meaning |
|---|---|
| `<chimera type: Fire>` | **Required.** Its presence is what makes a skill a Chimera move. |
| `<chimera power: 90>` | Base power. Default 0. |
| `<chimera category: special>` | `physical` (ATK vs DEF), `special` (MAT vs MDF), or `status`. Default `physical`. |
| `<chimera pp: 15>` | Uses before it runs dry. Default 10. |
| `<chimera accuracy: 95>` | Hit chance as a percentage. Default 100 — and a 100 never misses. |
| `<chimera priority: 1>` | Higher goes first, whatever the speed. Default 0. Negative moves go last. |
| `<chimera effect: …>` | A secondary effect. See below. |

### Effects

One move carries one secondary effect, which is the genre convention. Several `<chimera effect:>`
lines **merge into that one effect**, so `chance` and `self`/`target` apply to the whole of it.

| Clause | Meaning |
|---|---|
| `status burn` | Inflicts Burn. Also `poison`, `paralysis`, `sleep`, `freeze`. |
| `confuse` | Inflicts confusion, which rides alongside a major status. |
| `stages atk -1 def -1` | Shifts stat stages. Stats: `atk def mat mdf agi luk`. Range −6…+6. |
| `heal 50` | Restores that percentage of max HP. |
| `chance 30` | Percentage chance the whole effect fires. Omit for always. |
| `self` / `target` | Who it lands on. Default `target`. |

Examples:

```
<chimera effect: status burn chance 10>          Flamethrower's burn chance
<chimera effect: stages atk +2 self>             Swords Dance
<chimera effect: stages atk -1 def -1 target>    Tail Whip
<chimera effect: heal 50 self>                   Recover
<chimera effect: confuse>                        Confuse Ray
<chimera effect: stages agi -1 target>           Icy Wind's rider
```

### Enemies, Actors and Classes

| Tag | Meaning |
|---|---|
| `<chimera types: Fire, Flying>` | One or two types (or more — the chart compounds). |
| `<chimera level: 25>` | **Enemies only.** They have no level in RPG Maker; without this they use the Default Enemy Level parameter. |

An Actor's own note wins; if it has none, its Class note is used, so you can type a whole class at
once.

> **Typos are reported, not ignored.** `<chimera type: Fyre>` raises an error naming `Fyre` and the
> skill it came from. A parser that silently skips what it does not understand gives you a move that
> "just does nothing", and that is a very bad afternoon.

---

## 5. Plugin parameters

**Types** — the full type list, and the same-type attack bonus (default ×1.5).

**Damage** — critical multiplier and rate, the variance floor, and **Damage Scale**
(see §9).

**Moves** — how many moves a creature holds at once.

**Skip Empty Battle Log** (default ON) — stops RPG Maker rendering the battle log window while it
has no lines to show. It is fully transparent and empty at those moments, so nothing changes
visually; it simply removes a full-width, half-height window from the frame. Turn it off only if
another plugin draws its own content into the battle log without pushing lines through it.

**Status Effects** — burn and poison damage percentages, burn's attack cut, paralysis' speed cut and
skip chance, sleep duration, freeze thaw chance, and confusion's duration, self-hit chance and
self-hit power.

**Status ↔ State Mapping** — which database state represents each status, plus **Chimera Drives
Burn/Poison Damage**. Leave that off if your states already deal damage through an HP Regeneration
trait, which is the RPG Maker way and how the stock Poison state works. Turn it on to use the
percentages in this plugin instead — and remove the trait first, or it ticks twice.

**Battle AI** — difficulty, whether the AI picks enemy moves at all, and the default enemy level.

**Presentation** — whether effectiveness is announced, the three lines it announces, and whether the
skill list shows types and PP.

### Replacing the type system entirely

Your game has six elements, not eighteen? Call this once at boot, from a script call in an autorun
event:

```js
$chimeraBattle.Types.configure([
  { name: 'Flame',  superEffective: ['Frost', 'Verdant'], resisted: ['Tide'] },
  { name: 'Tide',   superEffective: ['Flame'],            resisted: ['Verdant'] },
  { name: 'Verdant',superEffective: ['Tide'],             resisted: ['Flame'] },
  { name: 'Frost',  superEffective: ['Verdant'],          resisted: ['Flame'] },
  { name: 'Spirit', superEffective: ['Spirit'],           immune: ['Mundane'] },
  { name: 'Mundane',superEffective: [],                   immune: ['Spirit'] }
]);
```

Relationships name the **defending** types, and anything unlisted is neutral. Nothing in the engine
assumes the default eighteen exist. Give `ChimeraBattleUI` the same number of colours in the same
order.

---

## 6. Plugin commands

| Command | What it does |
|---|---|
| **Change Stat Stage** | Shifts one battler's stage, as a stat-lowering move would. |
| **Reset Stat Stages** | Clears every stage, as switching out does. |
| **Restore PP** | Refills one actor's moves, or the whole party's. Inns already do this. |
| **Set AI Difficulty** | Random / Basic / Smart / Expert — for a boss, or a difficulty setting. |

---

## 7. Script calls & full API

The engine is exposed as `$chimeraBattle`, and is fully usable outside battle.

### Types

```js
$chimeraBattle.Types.configure(chart)          // replace the whole type system
$chimeraBattle.Types.count()                   // how many types exist
$chimeraBattle.Types.idOf('Fire')              // name -> id, case-insensitive, -1 if unknown
$chimeraBattle.Types.nameOf(1)                 // id -> name
$chimeraBattle.Types.multiplier(atk, def)      // one pairing: 0, 0.5, 1 or 2
$chimeraBattle.effectiveness(atkType, [ids])   // compounded across a defender's types
$chimeraBattle.stab(moveType, [attackerIds])   // the same-type bonus, or 1
```

### Battlers (in RPG Maker)

```js
battler.chimeraTypes()                         // resolved type ids
battler.chimeraLevel()                         // actor level, or the enemy notetag/default
battler.chimeraStage(paramId)                  // -6..+6
battler.chimeraChangeStage(paramId, delta)     // true if it actually moved
battler.chimeraResetStages()
battler.chimeraHasStatus($chimeraBattle.Status.BURN)
battler.chimeraPp(skill)                       // uses left
battler.chimeraMaxPp(skill)                    // full PP, 0 for a non-Chimera skill
battler.chimeraRestorePp()
```

### The engine, headless

Everything below works on plain objects with no RPG Maker present, which is how the plugin is
tested — 133 automated tests, run outside the engine.

```js
const b = $chimeraBattle.createBattler({
  name: 'Emberling', types: [1], level: 25,
  maxHp: 90, params: [90, 30, 55, 48, 70, 52, 60, 40]
});

$chimeraBattle.calcDamage(attacker, defender, move, opts, out)
$chimeraBattle.applyEffect(user, target, move, rng, out)
$chimeraBattle.turnOrder(actions, rng)
$chimeraBattle.resolveTurn(actions, { rng, participants })
$chimeraBattle.AI.chooseMove(attacker, defender, moves, difficulty, rng)
$chimeraBattle.serializeBattler(b) / deserializeBattler(data)
```

`resolveTurn` returns an event log — one entry per thing that happened, oldest first, every entry the
same shape:

```js
{ type, actor, target, move, damage, effectiveness, critical,
  status, stageChanges, healed, confused }
```

`type` is one of `hit, missed, immune, effect, residual, faint, asleep, frozen, paralysed, woke,
thawed, snappedOut, selfHit, noTarget, noMove, noPp`.

### Determinism

Every random decision — damage spread, criticals, status procs, sleep duration, thaw rolls, AI
tie-breaks — draws from an injectable generator. `Math.random()` is never called in battle logic.

```js
const rng = $chimeraBattle.createRng(12345);
$chimeraBattle.rng = rng;   // or pass one per call
```

The same seed and the same actions always produce the same battle. That is what makes a fight
replayable, testable, and identical across a save/load round trip.

### AI difficulties

| Level | Behaviour |
|---|---|
| **Random** | Picks uniformly. For an early trainer who should feel careless. |
| **Basic** | Highest raw power. Ignores the matchup entirely. |
| **Smart** | Maximises expected damage — respects types, stat stages and status. |
| **Expert** | As Smart, but given two lethal options takes the *reliable* one over the flashy one. |

Smart and Expert only ever re-pick among actions RPG Maker already judged valid, so your enemies'
conditions, ratings and turn restrictions all still hold.

---

## 8. Working with Chimera Core

Chimera Battle is standalone. If **Chimera Core** is also installed, genetics stop being cosmetic and
start deciding fights:

```js
const battler = $chimeraBattle.fromCreature(creature, {
  name: 'Emberling',
  types: ['Fire'],
  baseParams: species.baseParams
});
```

Stats come from Core verbatim — this deliberately does not recompute them, so IVs, training and
nature behave in battle exactly as your storage screen shows them. Two creatures of the same species
at the same level hit for different amounts, because their natures differ.

`$chimeraBattle.hasCore()` reports whether Core is present.

---

## 9. Balancing: the Damage Scale

The damage formula is the genre convention, so tuning knowledge transfers:

```
base   = floor( ((2 × level / 5 + 2) × power × A / D) / 50 + 2 )
damage = floor( base × STAB × effectiveness × critical × variance × damageScale )
```

`A`/`D` are ATK/DEF for a physical move and MAT/MDF for a special one, each already carrying stat
stages and status modifiers.

**That formula is calibrated for creature-style stats**, where a level-25 creature has roughly 90 HP
and stats in the 40–70 range. RPG Maker's default class curves are a different scale entirely — a
level-25 stock actor has over 2,000 HP. Drop this plugin onto those curves unchanged and moves land
for single digits.

Two ways to fix that, and both are legitimate:

1. **Rebuild your stat curves at genre scale.** Best if you are starting fresh — everything then
   behaves exactly as the genre expects, with no dial to remember.
2. **Raise Damage Scale.** Best if you are adding creature battles to an existing project. Multiply
   every Chimera hit until it feels right. A project on stock MZ curves typically wants something in
   the 20–30 range; check one move against one enemy and adjust from there.

Stat stages, for reference — the curve is symmetric around 1 and bounded:

| Stage | −6 | −4 | −2 | 0 | +2 | +4 | +6 |
|---|---|---|---|---|---|---|---|
| Multiplier | ×0.25 | ×0.33 | ×0.5 | ×1 | ×2 | ×3 | ×4 |

---

## 10. Compatibility

**Extends, never replaces.** Every core method below is patched by saving the original and calling
it, so other plugins in the chain keep working:

`Game_BattlerBase.param` · `Game_BattlerBase.canPaySkillCost` · `Game_BattlerBase.paySkillCost` ·
`Game_BattlerBase.recoverAll` · `Game_Action.makeDamageValue` · `Game_Action.itemHit` ·
`Game_Action.applyItemUserEffect` · `Game_Action.makeTargets` · `Game_Action.speed` ·
`Game_Battler.isStateAddable` · `Game_Battler.onBattleStart` · `Game_Battler.onBattleEnd` ·
`Game_Battler.onTurnEnd` · `Game_Enemy.makeActions` · `Window_BattleLog.displayActionResults` ·
`Window_SkillList.drawItem` · `Scene_Battle.createEnemyWindow` · `Scene_Battle.update` ·
`DataManager.setupNewGame` · `DataManager.extractSaveContents`

**Known interactions:**

- **Battle system replacers** (tactical, ATB, action battle) rebuild `Scene_Battle`. The type chart,
  damage formula, PP, stat stages and status all still work, because those live on `Game_Action` and
  `Game_BattlerBase`. The matchup preview will not appear, because it attaches to MZ's own enemy
  selection window — turn `ChimeraBattleUI` off in that case.
- **Skill-window replacers** will overwrite the type chips and PP display for the same reason. The PP
  *mechanic* is unaffected; only the drawing is.
- **Plugins that also patch `Game_BattlerBase.param`** stack fine in either order. Chimera multiplies
  its stage and status modifiers onto whatever the previous plugin returned.
- **State-heavy plugins** are fine: Chimera statuses *are* database states, so cures, icons and state
  UI all work normally.

Load ChimeraBattle **below** ChimeraCore, and ChimeraBattleUI **below** ChimeraBattle.

---

## 11. Troubleshooting

**"Every Chimera move does about 5 damage."**
Your database is on RPG Maker's default stat curves. See §9 — raise Damage Scale.

**"My skill isn't behaving like a Chimera move."**
It needs `<chimera type:>` in its Note box. Without that tag it is deliberately untouched. Check the
tag is in *Note*, not Description.

**"A damaging move deals no damage."**
Its **Damage Type** in the database is set to `None`. Set it to `HP Damage`. The formula field itself
is ignored.

**"Nothing gets burned / frozen."**
Burn and Freeze default to *disabled*, because RPG Maker ships no such states. Create them and select
them in the Status ↔ State Mapping parameters (§3, step 3).

**"Burn deals damage twice a turn."**
Both the state's HP Regeneration trait and "Chimera Drives Burn/Poison Damage" are active. Pick one.

**"An error mentions an unknown type."**
Exactly what it says — a `<chimera type:>` or `<chimera types:>` tag names something not in your type
list. The message includes the offending text and the skill it came from.

**"Effectiveness is never announced."**
Either the matchup is neutral (nothing is announced at ×1, by design), or Announce Effectiveness is
off, or the skill has no `<chimera type:>`.

**"PP never goes down."**
That skill has no `<chimera pp:>` — or no `<chimera type:>` at all, so it is not a Chimera move.

**"The enemy ignores the matchup."**
It has no Chimera-tagged skills in its Action list, or Enemies Pick Moves By Matchup is off, or the
difficulty is Random or Basic — Basic deliberately ignores types.

**"Priority isn't working."**
Check the tag is `<chimera priority: 1>` and not the database's own Speed field. Both work; they are
different dials.

---

## 12. Performance

Measured in RPG Maker MZ — real corescript, real PIXI, WebGL on a real GPU, 816×624, a three-enemy
battle, with the target-selection matchup panel on screen.

A stepped MZ frame is two halves: `SceneManager.update()` runs every line of game logic and every
line of this plugin, then `Graphics._app.render()` submits the scene to WebGL. Timing them apart is
the only honest way to say what a plugin costs, because the two are not comparable in size:

| Half of the frame | Cost, 6000 frames |
|---|---|
| **`SceneManager.update()`** — all game logic, all of this plugin | **0.37 ms mean, 0.7 ms p99** |
| `Graphics._app.render()` — WebGL submission, RPG Maker's own scene | 3.73 ms mean |

So the update half is about **9% of the frame**, and a CPU profile attributes **0.043 ms per frame**
to this product's own code — under 1% of the total.

| Path | Cost |
|---|---|
| Chimera's addition to `param()` | +0.20 µs with no stage, +0.34 µs with one |
| `effectiveness()`, dual-type defender | 0.14 µs |
| Matchup preview, per frame | **0.15 µs** — it redraws only when the matchup changes |
| A full Chimera damage roll | 28.5 µs, once per hit |
| Enemy AI move choice | 54 µs, once per turn |

Notetags are parsed **once** and cached; no regular expression ever runs inside a damage roll. The
type chart is a flat 324-byte `Uint8Array`, so a lookup is one indexed read with no allocation.
`calcDamage` and the AI write into reusable result objects, so resolving a turn allocates nothing.
Counted in the engine over 120 frames of live battle, the plugin performs **zero** texture uploads,
**zero** bitmap redraws and **zero** window refreshes per frame.

**New in 1.1.0 — the battle scene renders less than RPG Maker's does by default.** MZ draws
`Window_BattleLog` every frame even while it is empty and fully transparent, and it is full width
and half the screen tall. Skipping it while it holds no lines takes the target-selection frame from
3 rendered windows to 2, 30 draw calls to 27, and 18 shader binds to 16. Nothing changes on screen.
See **Skip Empty Battle Log** in §5.

Frame *cost* is what the numbers above report. Vsync-presented pacing is a different quantity and is
not claimed here — run your project in a focused window and press F2 if you want to see it.

---

## 13. Licence & support

See `LICENSE.txt`. In short: use it in unlimited games, commercial or free, keep 100% of your
revenue, modify it freely — just don't resell the plugin itself.

The source ships raw and uncommented-out. Every public function carries full JSDoc. You bought a
tool you can read, debug and extend.

**Also from Chimera Works:**
[Chimera Core](https://csaf.itch.io/chimera-core) — genetics, breeding, branching evolution and box
storage. Chimera Battle detects it automatically and feeds genetics into the damage formula.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
