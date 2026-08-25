# Oracle Deck — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Oracle Deck  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-08-25


---

# Oracle Deck — for RPG Maker MZ

**A divination system whose deck the plugin draws.**
Seventy-eight cards, every face of them generated. No image files.

---

## What this is

A fortune teller in your game deals a spread. The cards are dealt face down, they
flip, and each one becomes an **omen** the player carries with them — a real,
visible, expiring effect they can steer.

There are no PNGs anywhere in this plugin. Every card face is drawn from
primitives at whatever size the engine asks for, so the deck is exactly as sharp
at 1920×1080 as at 816×624, and nothing breaks when you change your resolution.

**The same card always draws the same way, forever.** Every face is a pure
function of that card's own name, so a player who saw The Tower once will
recognise it three hours later in a different spread on a different save.

---

## Installation — the load order matters

Copy the five files into `js/plugins/` and add them in the Plugin Manager **in
this order**:

1. `OracleRender.js` — the engraving engine
2. `OracleAtlas.js` — the arcana, the palettes, the deck
3. `OracleCard.js` — the composer
4. `OracleDeck.js` — the engine integration
5. `OracleScene.js` — the reading scene

The first three contain no RPG Maker code at all. That is deliberate: you can
call them yourself to draw a card onto any bitmap you like (see **For
programmers** below).

---

## Your first reading, in one event command

Add a **Plugin Command** to any event:

> **Oracle Deck → Draw a Reading**
> Spread: `crossroads`
> Reader's Name: `Mother Aubade`

That is the whole setup. The scene opens, three cards are dealt and flipped, and
the player reads each one before anything binds.

### The three spreads

| Spread | Cards | The positions |
| --- | --- | --- |
| `omen` | 1 | What travels with you |
| `crossroads` | 3 | What is behind · What presses · What comes |
| `fate` | 5 | The root · The crossing · The crown · The cost · The end |

---

## What a reading actually does — read this part

A divination system that changes nothing is decoration. One that rolls dice and
punishes the player for the result is resented. Oracle Deck is neither, and it
is worth understanding why before you place your first fortune teller.

Every drawn card becomes an **omen**: a named, visible, expiring contract.

| Part | What it is |
| --- | --- |
| **Promise** | a real modifier while it runs — a parameter, gold, experience, drop rate or the encounter rate |
| **Clause** | the condition the player must **meet**, or must **avoid** |
| **Term** | how long they have |
| **Outcome** | fulfilled, broken or lapsed — each fires a common event |

**The clause is shown to the player before the omen binds**, and binding happens
when they leave the scene, not when the card is dealt. So a bad draw is never
something that happened to them — it is information, and a decision.

The Reaping reversed does not quietly weaken your defence. It tells the player
they are carrying a debt to the dead, and that putting down one more enemy
settles it.

### Three aspects, and none is a flat debuff

- **Boon** — a blessing that simply expires.
- **Bane** — a burden that **names its own escape**, so a bad draw becomes a
  short quest instead of a tax.
- **Trial** — a wager. It pays out immediately, and only costs the player if
  they break the clause.

### The clauses the plugin can actually see

Every clause is wired to a real engine hook. There is no prose in this plugin
that it cannot observe.

**Fulfil:** `victories` (win N battles) · `steps` (walk N steps) · `spend`
(spend N gold) · `rest` (recover fully) · `treasure` (gain an item outside
battle and outside a shop)

**Break:** `flee` (escape a battle) · `itemInBattle` (use an item in battle) ·
`memberDown` (a party member falls) · `rest` (recover fully)

---

## What your events can read

Set these in the plugin's parameters and your own content can react to a reading.

- **Omen Active Switch** — ON while any omen is running.
- **Last Card Variable** — the last drawn card's index in the deck, 0–77.
- **Last Aspect Variable** — 1 boon, 2 bane, 3 trial.
- **On Fulfilled / On Broken / On Lapsed Common Event** — run when an omen
  resolves.

From a Conditional Branch's script box, or anywhere else:

```js
CSAF.Oracle.hasOmen('tower')     // is The Tower's omen running?
CSAF.Oracle.omenCount()          // how many are running
CSAF.Oracle.activeOmens()        // the live omen records
```

Card ids are `tower`, `starcard`, `moon`… for the major arcana, `blades-10` for
a pip card, and `patriarch-cups` for a court card.

---

## The other plugin commands

| Command | What it does |
| --- | --- |
| **Draw a Reading** | opens the scene and deals a spread |
| **Draw One Card** | draws a single card silently, with no scene |
| **Clear All Omens** | ends every omen immediately, firing no outcome events |
| **Set Deck Style** | changes the deck's printed look at runtime |
| **Is an Omen Active?** | sets a switch from a named card's omen |

---

## What is in the deck

Counted from the plugin itself, not claimed:

- **22** major arcana, each a hand-authored symbol
- **40** pip cards — 4 suits × 10 ranks, laid out the way a Marseille deck lays
  them out
- **16** court cards — 4 figures × 4 suits
- **78** card faces in total
- **6** deck styles and **6** card backs, so **468** distinct card images
- **156** omens — 78 upright and 78 reversed, of which the **44** major-arcana
  omens are individually written

### The six deck styles

`parchment` · `midnight` · `sanguine` · `verdigris` · `ivory` · `imperial`

One parameter re-prints all seventy-eight cards.

---

## Compatibility

Tested against RPG Maker MZ with the stock scripts unmodified, and verified by
running inside the real engine rather than only in tests.

Oracle Deck **extends eleven core methods, every one of them with the original
saved and called, and replaces none of them**:

`Game_Party.increaseSteps` · `Game_Party.loseGold` · `Game_Party.gainItem` ·
`Game_Interpreter.command314` · `Game_Troop.goldRate` · `Game_Troop.expTotal` ·
`Game_Enemy.dropItemRate` · `Game_Player.encounterProgressValue` ·
`Game_Battler.consumeItem` · `Game_BattlerBase.die` · `Game_System.initialize`

It also extends `Game_Actor.paramRate`, `BattleManager.processVictory`,
`BattleManager.processEscape` and the two `DataManager` save hooks, all the same
way.

Because nothing is clobbered, Oracle Deck co-exists with other plugins that
patch the same seams, including large suites. If you use a battle-system plugin
that replaces `BattleManager` wholesale, load Oracle Deck **after** it so the
extension wraps the replacement.

**It adds no update-loop code at all.** Every card is drawn once into a cached
bitmap and re-used from cache, so the deck cannot cost you a frame during play.

---

## For programmers

The generator has no engine dependencies and you can call it directly:

```js
CSAF.OracleCard.draw(ctx, x, y, w, h, {
  kind: 'major', motif: 'tower', numeral: 16, title: 'The Tower',
  palette: 'midnight', seed: 'tower', reversed: false
});

CSAF.OracleCard.drawBack(ctx, x, y, w, h, {
  palette: 'imperial', back: 'rosette', seed: 'my-seed'
});
```

and the plugin will hand you a ready `Bitmap`:

```js
const bmp = CSAF.Oracle.cardBitmap(CSAF.Oracle.card('moon'), 200, 300, false);
```

Use it for title screens, cutscene inserts, menu panels, save-file thumbnails —
anywhere you would otherwise have needed an artist and a PNG.

### Adding your own cards

Push a function onto `CSAF.OracleAtlas.ARCANA`. The signature is
`(ctx, cx, cy, s, colour, rand)`, and it must call `rand` a **fixed** number of
times regardless of its inputs — the composer draws from one stream, so a motif
with a variable draw count would shift every card after it.

Two things worth knowing, both learned the hard way while drawing this deck:

- **Lead with a large filled shape.** A motif made of thin strokes vanishes at
  the ~120px a card is actually seen at.
- **To punch a hole, trace the hole in the SAME path as the shape it belongs
  to and fill once with `'evenodd'`.** Do not use
  `globalCompositeOperation = 'destination-out'` — that erases to transparent,
  through everything behind it.

---

## Terms of use

See `LICENSE.txt`. Free for commercial and non-commercial use in RPG Maker MZ
projects. Do not redistribute the source itself.

---

*Core Systems Asset Factory · <https://csaf.itch.io>*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
