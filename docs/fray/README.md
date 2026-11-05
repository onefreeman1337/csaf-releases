# Fray - Battle Wear on Your Own Heroes' Faces and Side-View Battlers, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Fray - Battle Wear on Your Own Heroes' Faces and Side-View Battlers, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/fray  
**Docs published:** 2026-11-05


---

# FRAY

**Your party wears the fight, drawn into your own heroes' faces and side-view battlers, for RPG Maker MZ.** v1.0.0.

Every hit a hero takes is drawn into that hero's own art. A blade grazes a cheek or tears a sleeve, a blow leaves a
bruise, fire scorches the clothing, ice frosts it, lightning leaves a flash burn, poison and darkness a sick bruise.
As HP falls the hero looks more spent: the colour drains from the skin and grime sinks in. The wear does not vanish when
the battle ends. It is there in the menu, on the status screen, in the next battle and in the save file, until the
hero rests. A healing item lays a plaster or a bandage over the worst mark.

Nothing to draw. Fray finds the skin, the clothing and the armour in each face and battler from the image's own
colours, and draws every mark as pixel work on a copy of it. Your heroes, your art, no damaged variants to make.

## What is in the box

| | |
| --- | --- |
| `js/plugins/ScatheCore.js` | The mark painter shared with Scathe (fire, frost, lightning and blight). The same file Scathe ships: if you own Scathe, keep one copy. |
| `js/plugins/FrayCore.js` | The wear itself: finds skin, cloth and armour, places every mark, draws grazes, bruises, tears, dressings and the HP-band look. Knows nothing about RPG Maker. |
| `js/plugins/Fray.js` | The only file that touches the engine: records each hit on the hero, shows the worn face and battler, the notetag, parameters and plugin commands. |

## Install

1. Copy the three `.js` files into your project's `js/plugins` folder.
2. Enable all three in the Plugin Manager. Any order works: `Fray.js` finds the other two the first time it needs them.

That is all. Every hero in your party now wears the fight. If `FrayCore.js` is missing the first battle stops with the
message **Fray needs FrayCore.js enabled**; if `ScatheCore.js` is missing, **Fray needs ScatheCore.js enabled**.

## Where the wear shows

| | |
| --- | --- |
| Faces | Everywhere the game draws a face FOR a hero: the battle status, the main menu, the status, skill and equipment screens. |
| Side-view battlers | Every motion frame of the hero's `img/sv_actors` sheet, with each mark held on the same part of the body as the hero walks, swings, guards, staggers, falls and lies down. Side view only. |

Faces chosen in a Show Text command are not changed: those are picked by the event, not by a hero.

## The kind of mark comes from the element

Fray reads the **name** of the element that hit, so a database with its own elements still works. A skill uses its own
element; a skill set to "Normal Attack" uses the attacker's first attack element.

| Element name contains | On skin | On clothing | On armour |
| --- | --- | --- | --- |
| anything else (Physical, Wind, Light, none) | a **graze**: skin rubbed raw with a few fine scratches | a **tear**: a ragged opening onto a darker layer, threads across it | a **gash** in the metal |
| earth, stone, rock, blunt, crush, impact | a **bruise**: violet at the centre, yellow-green at the edge | a smaller **tear** | a **dent**: a dark hollow with a lit rim |
| fire, flame, burn, heat, lava, inferno | a reddened **burn** | **scorch**: char with a smouldering edge | **scorch** |
| ice, frost, cold, water, snow, freez | **frost** | **frost** that keeps the folds under it | **frost** |
| thunder, lightning, electric, spark, storm, bolt | a raw **flash burn** | a **lightning burn** spreading from the strike | a **lightning burn** |
| poison, venom, dark, shadow, blight, toxic, curse, death | a **sick bruise**, olive-green | a creeping **stain** with dark veins | a creeping **stain** |

Which surface a hit marks depends on the kind of hit (a blade grazes skin or tears cloth, fire and frost take the
clothing first, a blow bruises skin) and on what that picture has: a face with no visible clothing takes its marks on
the skin. The size of a mark follows the damage: a hit for a third of the hero's max HP or more draws the biggest mark.
Each new mark lands away from the marks already there. On a face, skin marks go on the cheeks, never on the eyes, the
nose or the mouth. Only damage to HP leaves a mark (MP damage, healing and misses do not).

## HP bands

Below each band (75%, 50% and 25% of max HP by default) the hero looks one step more spent: the skin drains toward a
cold pallor and grime sinks into skin and clothing in patches, heavier at each band. At the last band a side-view
battler's coat or robe frays at the hem. Healing lifts the band look; the marks stay until the hero rests.

## Dressings and rest

| | |
| --- | --- |
| A healing item | Used on a marked hero, it lays a dressing over the worst undressed mark: a sticking plaster on skin, a wrapped bandage on clothing. |
| Recover All | (an inn, a save point, any event that uses the Recover All command) removes every mark. |
| Mend a hero | The plugin command, from any event. |

## Notetag (actor note)

| Notetag | |
| --- | --- |
| `<Fray: off>` | This hero never shows wear (its art is never read). |

## Plugin commands

| Command | Arguments | |
| --- | --- | --- |
| Wear a hero | Actor (0 = every party member), Kind of mark, Power (0 to 1) | Draws a mark from an event: a trap, a fall, a cutscene blow. |
| Mend a hero | Actor (0 = every party member) | Removes every mark. The HP-band look still follows HP. |
| Dress a wound | Actor (0 = every party member) | Lays a dressing over the hero's worst undressed mark. |

Kinds of mark: `cut`, `crack`, `scorch`, `rime`, `fork`, `blight` (the six rows of the table above, in order).

## Parameters

| Parameter | Default | |
| --- | --- | --- |
| HP bands (percent) | 75,50,25 | Highest first, comma separated. Below each, the hero looks one step more spent. |
| Marks per hero | 10 | 1 to 24. Once a hero carries this many marks, new hits stop adding marks (the bands still deepen). |
| Wear on faces | true | Draw the wear on faces. |
| Wear on side-view battlers | true | Draw the wear on side-view battler sheets. |
| Healing items dress wounds | true | A healing item lays a dressing over the worst mark. |
| Rest mends everything | true | Recover All removes every mark. |
| Battle bake budget (ms) | 1.0 | Milliseconds per frame Fray may spend redrawing worn art during a battle. |

## Script

| | |
| --- | --- |
| `$gameActors.actor(1).frayRecord()` | The hero's record: `{ v, seed, gen, hits: [{ f, p, s, b }] }` (kind, power, seed, dressed). |
| `$gameActors.actor(1).frayWear('scorch', 0.8)` | The Wear command for one hero. Returns false when the hero is full or off. |
| `$gameActors.actor(1).frayMend()` | The Mend command for one hero. |
| `$gameActors.actor(1).frayDress()` | The Dress command for one hero. |

## How it runs

- Each face and battler sheet is read **once**, from a copy Fray owns. Your image files and RPG Maker's image cache are
  never changed.
- The save file keeps the wear as a short list of decisions (kind, power, seed, dressed) per hero, never pixels, and
  the pictures are redrawn from it after a load. A save made with Fray loads with Fray removed; an unreadable record
  loads as a clean hero.
- In a battle the redrawing is spread over frames inside the budget, and a new mark is drawn on top of the last picture
  rather than redrawing every mark. Outside a battle a face is redrawn when a menu opens.
- Pixel art keeps its pixels: art scaled up 2x, 3x or 4x is detected and the marks are drawn on the same grid.
- Marks are never drawn outside the figure: not on a face's backdrop, not on a battler's empty cell.
- Works with the stock face sheets (anime style), painted portraits with a dark backdrop, the stock side-view battlers
  (chibi proportions) and tall pixel-art battlers.

## Compatibility

Fray extends `Game_Action.prototype.executeHpDamage`, `Game_Action.prototype.itemEffectRecoverHp`,
`Game_Actor.prototype.recoverAll`, `Window_StatusBase.prototype.drawActorFace`, `Window_BattleStatus.prototype.update`,
`Sprite_Actor.prototype.updateBitmap` and `Scene_Battle`'s `create`, `start`, `update` and `terminate`, always calling the
original. It adds methods named `fray...` and replaces no core method. A face plugin that replaces
`drawActorFace` without calling the original, or a battler plugin that draws actors without `Sprite_Actor`, will show its
own art without the wear.

## Credits

Made by Core Systems Asset Factory. The code was written with AI assistance. Nothing else ships: every mark is drawn in
code at run time from your own face and battler art.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
