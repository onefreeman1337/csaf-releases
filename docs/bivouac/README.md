# Bivouac — every enemy band stages its own ground, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Bivouac — every enemy band stages its own ground, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/bivouac  
**Docs published:** 2026-11-05


---

# Bivouac — every enemy band stages its own ground

**For RPG Maker MZ.** Three plugin files, no image files, no configuration required.

---

## What it does

RPG Maker MZ gives every enemy the same nothing to stand on. A goblin rabble and a demon lord
float at the same height over the same battleback, casting no shadow, leaving no trace, surrounded
by no sign that anything lives there.

Bivouac reads the troop you already made and draws the ground that band holds:

- **the worked earth** beneath them, shaped by where the members of that troop actually stand
- **cast shadows** that seat every battler on it
- **the things the band brought and set down** — a fire and a spit for a rabble, a standard for a
  host, a dais for a champion
- **the marks it leaves** — tracks leading in from the direction it came, and whatever that
  particular band does to the ground it stands on

Everything is drawn from your database. There is no battleback to buy, nothing to place by hand,
and no image file anywhere in the package.

---

## Installing

1. Copy the three files from `js/plugins/` into your project's `js/plugins/` folder.
2. In the Plugin Manager, add them **in this order, top to bottom**:

   ```
   BivouacCore.js     the reading and the composition
   BivouacDraw.js     the constructions
   Bivouac.js         parameters, plugin commands, the engine binding
   ```

3. Start a battle.

That is the whole installation. Nothing else needs changing, and no notetags are required.

> If you list them in some other order it still works — each file resolves its dependencies the
> first time it needs them rather than at load time — but the order above is the one to use.

---

## What it reads, and what it does with it

| What it reads | What it decides |
| --- | --- |
| **Member positions** in the troop | the shape of the worked ground, and where the furniture stands |
| **The eight parameters** of each enemy | that creature's *nature*: raider, warded, quick, adept or great |
| **Experience**, against your own database | the band's *standing*: rabble, band, warband, host, champion |
| **Element traits** (codes 11 and 31) | what the earth under the band looks like |
| **Battles fought** against that troop | how worn its ground and its belongings are |

Two things are worth saying plainly about this.

**Standing is relative to your game, not to a number we invented.** A band's place on the ladder is
its place in *your* enemy database. If every enemy in your project has five-digit experience values,
the weakest of them is still a rabble and the strongest is still a champion. Nothing has to be
tuned, and rebalancing your game rebalances the staging with it.

**Nature is read from the shape of a creature's parameters, not their size.** A project where every
number is ten times larger classifies identically. This is checked by the test suite.

---

## What gets drawn

**10 grounds** — trodden · hardpan · ash bed · rime · mire · scorch · blight · drift · flagstone ·
sward

**14 marks** — boot, claw, hoof, drag, slither and cart tracks · blood slick · scorch lick · web
strand · frost creep · spore bloom · bone scatter · gouges · ward ring

**28 pieces of furniture** — campfire · cook pot · spit · bedroll · lean-to · stacked arms · shield
rest · war drum · standard · palisade · chevaux-de-frise · totem · altar · brazier · carrion post ·
bone midden · cage · spoil pile · crates · dais · hide dryer · anvil stone · cocoon · fungal
cluster · ice cairn · cinder vent · reed bundle · root knot

**52 distinct drawn things in total**, each with its own construction. None of them is a recolour of
another: a brazier is not a campfire in a different palette, it is a tripod, a bowl, a bed of coals
and a lipped rim.

---

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Enabled | on | Draw staged ground in battle. Off restores stock MZ behaviour exactly. |
| Draw the ground | on | The worked earth. |
| Draw the marks | on | Tracks and traces. |
| Draw the furniture | on | What the band brought. |
| Draw cast shadows | on | Turn off if another plugin already draws battler shadows. |
| Shadow strength | 40 | How dark the cast shadows are, as a percentage. |
| Overall opacity | 255 | Opacity of the whole staged layer. |
| Vertical offset | 0 | Nudge the staging up or down for a battleback with an unusual horizon. |
| Wear from repeat battles | on | Fighting the same troop again wears its ground and its belongings. |

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Set Enabled** | Turn the staging on or off from an event. |
| **Force Ground** | Use one named ground for every battle until cleared — for a story fight that has to happen on scorched earth whatever the enemy is. |
| **Clear Forced Ground** | Go back to reading the band. |
| **Reset Wear** | Forget how many times a troop has been fought. Troop id 0 forgets every troop. |

---

## Compatibility

Bivouac adds **one** sprite to the battle field, behind every battler and in front of the
battleback. It extends three engine methods and **replaces none** — the original is saved and
called in every case — so a plugin that also extends them keeps working whichever order they load
in.

| Method | What Bivouac does |
| --- | --- |
| `Spriteset_Battle.prototype.createBattleField` | extends — adds the staged ground sprite after the field is built |
| `BattleManager.setup` | extends — counts a battle against that troop, for wear |
| `Game_System.prototype.initialize` | extends — creates the plugin's own save record |

**Works alongside:** VisuStella MZ Core Engine and Battle Core, [CGMZ] battle plugins, animated
battleback plugins, and any plugin that supplies its own battleback image — Bivouac draws *on top*
of whatever battleback is there, not instead of it.

**If another plugin already draws battler shadows**, turn *Draw cast shadows* off and keep the rest.

**Saves are forward compatible.** The plugin stores a small versioned record on `$gameSystem`. A
save made before Bivouac was installed loads normally and simply starts with no wear recorded.

---

## Performance

The entire composition — the ground, every mark and every piece of furniture — is baked **once**,
when the battle scene builds its field, into a **single** cached bitmap. Nothing is redrawn per
frame, and the staged layer costs exactly **one extra display object** on the battle field however
many pieces a band fields. That figure is measured in the real engine, not estimated.

Per-frame cost in the update half is inside RPG Maker's frame budget with room to spare. A single
timing figure is not quoted here on purpose: timings on any one machine vary enough to be
misleading, and the number that actually holds still is the display-object count above.

---

## Requirements

RPG Maker MZ. No other plugin is required. No image, audio or font files ship with this product, and
none are needed.

---

## Terms of use

Free for use in commercial and non-commercial RPG Maker projects. Credit is appreciated but not
required. Do not redistribute the source as an asset pack.

Every line of this plugin was written with AI assistance. The artwork it generates is produced by
the code at runtime.

---

**Core Systems Asset Factory** — <https://csaf.itch.io>


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
