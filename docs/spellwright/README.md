# Spellwright - In-Game Spell Crafting With Generated Magic Circles, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Spellwright - In-Game Spell Crafting With Generated Magic Circles, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/spellwright  
**Docs published:** 2026-11-05


---

# Spellwright for RPG Maker MZ

**Your players write their own spells.** At a spellwright's circle they take the effects of spells their hero already
knows, combine them, turn a magnitude dial that drives the cost, name the result, and watch its magic circle inscribe
itself from what they put in. The new spell is a real skill: it shows in the skill list, casts in battle, and saves and
loads like any other.

Every seal is drawn in code from the spell's own composition. No icons to draw, no seal art to buy.

Version 1.0.0 · Core Systems Asset Factory

---

## Install

1. Copy the two files from `js/plugins` into your project's `js/plugins` folder: `SpellwrightCore.js` and `Spellwright.js`.
2. In the Plugin Manager, add both and switch them ON. Either order works: Spellwright.js finds SpellwrightCore.js the
   first time it needs it.
3. Make an event that runs the plugin command **Open Spellwright's Circle**. That is all a new project needs.

---

## What the player does

The circle lists the **aspects** their actor can draw on: the effects of the spells they have learned.

| Aspect | Read from a known spell's | Example from a new project |
| --- | --- | --- |
| harm, MP harm, drain, MP siphon | damage type and element (a FORM) | Fire harm, from Fire III |
| Restore HP, Restore MP | recovery damage type (a FORM) | Restore HP, from Heal III |
| a state at a chance | each Add State effect | Sleep 50%, from Sleep |
| a stat up or down | each Add Buff or Add Debuff effect | M.Attack up, from Spell Enhancement |
| cure ailments | the Remove State effects, together | Cure 3 ailments, from Cure I |

An effect that reaches every target is its own aspect (Fire harm from Fire III, and **Fire harm, all** from Flame II).
Where two known spells offer the same aspect, the stronger one (the dearer, or the higher chance) supplies it.

In a new project with no changes, the stock Sorcerer at level 25 is offered 9 aspects and the stock Priest 15.

**Controls in the circle**

| Key | Does |
| --- | --- |
| Up / Down | choose an aspect, or the Name and Inscribe rows |
| OK | place the aspect in the circle, or take it out |
| Left / Right | turn the magnitude dial: Faint, Lesser, True, Greater, Grand |
| Shift | keep one target instead of widening (when the sources disagree) |
| Page Down | another proposed name |
| Page Up | open the Spell Ledger |
| Cancel | take the last aspect out; with an empty circle, leave |

With a keyboard the player can type a name on the Name row (Enter keeps it, Escape drops it). Mouse and touch: click a
row, a half of the dial, the ribbon for another name, or a socket to take its aspect out.

As each aspect goes in, the seal at the centre redraws: what it shares with the previous seal stays inscribed and only
the change draws itself.

---

## The rules of a circle

1. **One side.** Every aspect in a circle aims at foes, or every aspect aims at allies.
2. **One form.** A spell has at most one form. The exception: two harms of **different** elements fuse into one
   two-element spell, which meets the **mean** of the target's two element rates (Fire x2 and Earth x0.5 make x1.25).
3. **The cap.** No more aspects than the cap (4 by default; a plugin command sets it per actor).

**Reach.** When one source hits one target and another hits them all, the spell takes the wider reach and the cost is
multiplied by the widening multiplier (1.5). Shift keeps the narrow reach at no extra cost.

**What the spell becomes.** The form's own damage formula, multiplied by the magnitude: Fire III's
`500 + a.mat * 2 - b.mdf * 2` becomes `(500 + a.mat * 2 - b.mdf * 2) * 1.25` at Greater. State chances are multiplied
too (Sleep 50% becomes 62.5% at Greater), and buff turns. Its icon, animation and hit type come from its form's source
spell, and so does its occasion (made from battle-only spells, it is battle-only).

---

## Cost

Each **source** spell's cost is counted once, however many of its aspects you take:

```
cost = ceil( sum x (1 + 0.15 x (aspects - 1)) x magnitude^1.25 x reach )
```

and **never less than the dearest source spell at that magnitude**, nor the minimum cost (5 MP). So a crafted spell is
never cheaper than a spell it was made from. We checked this over 100,000 crafted spells (20,000 random circles from
the stock Sorcerer, Priest and Magic Swordsman, each at all five magnitudes): none undercut its dearest source.

Example: Fire III (50 MP) + Sleep (15 MP), widened to all foes, at True: `ceil(65 x 1.15 x 1 x 1.5)` = **113 MP**.

A TP-cost source counts 1 MP per TP (a parameter changes that). The **Cost formula** parameter can replace the first
line with your own JavaScript (variables `sum n mult reach max tax`, like a damage formula); the floor still applies,
and a formula that fails to run falls back to the default.

---

## Names

A proposed name is built from the spell: magnitude word, rider word, element word, and a noun for the form and reach.
Fire III + Sleep at True: **Drowsing Ember Tempest** (Page Down: *Drowsing Ember Storm*, *Ember Storm of Sleep*).
Element and state words come from two parameters, matched by **your** element and state names; a state with no word
reads as "<State>-touched". A name already used by that actor gets II, III and so on. Typed names keep 36 characters.

---

## The Spell Ledger

Every crafted spell of an actor with its seal, cost and description, eight to a page. Left/Right/Up/Down choose,
Page Up/Page Down turn pages, **Shift twice** unmakes the chosen spell (nothing is refunded), Cancel returns.

## In battle

A crafted spell casts like any skill. When one is cast, its seal inscribes itself over the battlefield (the **Seal flash
in battle** parameter turns this off).

---

## Plugin commands

| Command | Does |
| --- | --- |
| Open Spellwright's Circle | opens the circle for an actor (0 = the party leader) |
| Open Spell Ledger | shows an actor's crafted spells |
| Craft Spell (scripted) | crafts a spell from source skills you list, at a magnitude, with a name or the proposed one. For rewards and tutorials |
| Unmake Spell | removes the last crafted spell, or all of them, from an actor |
| Set Aspect Cap | how many aspects that actor may combine |
| Lock or Unlock Aspects | a locked skill offers no aspects (a library you must reach first) |
| Count Crafted Spells | stores how many crafted spells an actor holds in a variable |

## Parameters

| Parameter | Default | |
| --- | --- | --- |
| Aspects per spell | 4 | the cap |
| Crafted spells per actor | 6 | an actor's ledger holds this many |
| Skill types that offer aspects | 1 | skill type ids, comma separated (1 = Magic in a new project) |
| Crafted spell skill type | 1 | the skill type a crafted spell belongs to |
| Minimum cost (MP) | 5 | |
| Combination surcharge | 0.15 | each aspect past the first adds this share |
| Widening multiplier | 1.50 | |
| Magnitude cost exponent | 1.25 | |
| Magnitude steps | 0.6, 0.8, 1.0, 1.25, 1.5 | five, weakest first |
| MP per TP | 1.00 | |
| Cost formula (optional) | blank | |
| First crafted skill id | 3000 | crafted spells are added at 3001, 3002 ... keep it above your last skill |
| Gold per craft | 0 | |
| Players may type names | true | |
| Last crafted skill variable | 0 | receives the new spell's skill id |
| Main menu command | blank | a name here adds a menu command that opens the circle for the chosen actor |
| Menu command switch | 0 | show that command only while this switch is ON |
| Seal flash in battle | true | |
| Element name words | Fire=Ember and so on | one per line, `Element=Word` |
| State name words | Sleep=Drowsing and so on | one per line, `State=Word` |

**Notetags (skills).** `<spellwright aspect>` lets a skill of any type offer aspects. `<spellwright no aspect>` keeps one
out. Crafted spells never offer aspects, so spells cannot be compounded.

---

## Saves

A crafted spell is stored in the save as its own record, frozen as it was made (editing Fire III later does not change a
spell already crafted from it). On load each record is added back to the database at its own id and granted to its
actor. The ids are never written into an actor's learned-skill list, so a save still loads if the plugin is ever removed:
the crafted spells simply disappear. A new game starts with none.

---

## Compatibility

Extends, never replaces: `Game_Actor.skills`, `Game_Action.calcElementRate`, `DataManager.createGameObjects`,
`DataManager.extractSaveContents`, `BattleManager.startAction`, `Spriteset_Battle.update`, and (only with a menu command
set) `Window_MenuCommand.addOriginalCommands`, `Scene_Menu.createCommandWindow`, `Scene_Menu.onPersonalOk`.
Adds `Scene_Spellwright` and `Scene_SpellLedger`.

Plugins that read skill notetags once when the database loads (for example VisuStella Skills and States Core) do not see
crafted spells' notes. Crafted spells carry no notetags those plugins need. Not tested with VisuStella plugins
installed; the plugins tested alongside it are listed under Tested.

With our **Sigil Core** installed, crafted spells also get Sigil Core seals in its Grimoire, because they are ordinary
skills.

## Tested

In the real MZ engine on a new project's own database: the circle draws no MZ window and no stock button; real key
presses place aspects, turn the dial, type a name and inscribe; the stock Magic list shows the new spell; Game_Action
casts it on a stock enemy; a save round trip brings every spell back; every plugin command runs. Frame cost: with a
player changing an aspect every second, 4 draw calls and under 0.4 texture uploads per frame; at rest, 0 uploads.

---

## Terms

Use in commercial and non-commercial RPG Maker MZ projects. Credit CSAF. Do not redistribute or resell the plugin
itself. Full terms in `LICENSE.txt`. The code was written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
