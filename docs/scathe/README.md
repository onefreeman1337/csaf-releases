# Scathe - Battle Damage Drawn Into Your Own Enemy Art, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Scathe - Battle Damage Drawn Into Your Own Enemy Art, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/scathe  
**Docs published:** 2026-11-05


---

# SCATHE

**Battle damage you can see, drawn into your own enemy art, for RPG Maker MZ.** v1.0.0.

Every enemy shows the damage it takes. A sword leaves a gash that bleeds, an earth spell cracks it, fire chars it, ice
frosts it, thunder burns a fern of lightning into it, poison and darkness spread a bruise with veins. As its HP falls
the enemy looks more and more worn. Nothing to draw: Scathe reads each battler image once when the battle starts and
generates the damage from that image's own pixels, inside its own outline. Your enemies, your art, no damaged variants
to make.

## What is in the box

| | |
| --- | --- |
| `js/plugins/ScatheCore.js` | The damage itself: reads a battler's shape and colours and draws every mark as pixel work on a copy. Knows nothing about RPG Maker. |
| `js/plugins/Scathe.js` | The only file that touches the engine: records each hit, shows the damaged copy, the notetags, parameters and plugin commands. |
| `Demo/img/enemies/` | Seven painted enemy battlers to try it on (Ogre, Scarab, Golem, Armor, Ooze, Wraith, Wyvern), one for each material. |
| `Demo/img/battlebacks1/CSAF_RuinedHall.png` | A painted battleback (1000 x 740) to stand them on. |

## Install

1. Copy the two `.js` files into your project's `js/plugins` folder.
2. Enable both in the Plugin Manager. Any order works: `Scathe.js` finds `ScatheCore.js` the first time an enemy is drawn.

That is all. Every enemy in every battle now shows its damage. If `ScatheCore.js` is missing, the first battle stops
with the message **Scathe needs ScatheCore.js enabled**.

To try the demo art, copy the `Demo/img` folders into your project's `img` folder and give an enemy one of the
battlers (for example `CSAF_Golem`, with `<Scathe Material: stone>` in its note).

## The kind of mark comes from the element

Scathe reads the **name** of the element that hit, so a database with its own elements still works. A skill uses its
own element; a skill set to "Normal Attack" uses the attacker's first attack element.

| Element name contains | Mark |
| --- | --- |
| fire, flame, burn, heat, lava, inferno | **scorch**: char with a smouldering edge and a few embers |
| ice, frost, cold, water, snow, freez | **rime**: a coat of frost that keeps the shape under it, with crystals |
| thunder, lightning, electric, spark, storm, bolt | **fork**: a lightning burn spreading from a charred strike |
| poison, venom, dark, shadow, blight, toxic, curse, death | **blight**: a creeping bruise with dark veins |
| earth, stone, rock, blunt, crush, impact | **crack**: a crack network in the material's own colour |
| anything else (Physical, Wind, Light, none) | **cut**: a gash, or a **crack** on stone, metal and shell |

The size of a mark follows the damage: a hit for a third of the enemy's max HP or more draws the biggest mark. Each new
hit lands away from the marks already on the enemy, on a part of the body thick enough to hold it. Only damage to HP
leaves a mark (MP damage, healing and misses do not).

## Materials

| Material | A cut or crack on it |
| --- | --- |
| flesh (the default) | a gash that bleeds and runs |
| stone | a crack with a chipped crater at the blow |
| shell | a fracture with a chipped crater |
| metal | a score through to bare bright metal |
| slime | a dark split in the gel |
| spirit | a violet tear |

On a dark surface a crack shows the bare material underneath (bright steel, pale chitin) instead of darkening, so it
reads on black armour as well as on sandstone.

## HP bands

Below each band (75%, 50% and 25% of max HP by default) the whole enemy looks one step more worn: its colour drains,
its edges darken, and from the second band grime sinks into the body in patches. At the last band the outline takes
bites. Marks from every hit stay on the enemy until the battle ends; healing lifts the wear but keeps the marks.

## Notetags (enemy note)

| Notetag | |
| --- | --- |
| `<Scathe Material: stone>` | `flesh`, `shell`, `stone`, `metal`, `slime` or `spirit`. An unknown word uses the default material. |
| `<Scathe: off>` | This enemy never shows damage (its image is never read). |

## Plugin commands

| Command | Arguments | |
| --- | --- | --- |
| Mark an enemy | Troop member (1 = first, 0 = every enemy), Kind of mark, Power (0 to 1) | Draws a mark from an event: a scripted blow, a trap, a cutscene. |
| Mend an enemy | Troop member (1 = first, 0 = every enemy) | Clears every mark. The HP-band wear still follows its HP. |

A troop member number past the end of the troop does nothing.

## Parameters

| Parameter | Default | |
| --- | --- | --- |
| HP bands (percent) | 75,50,25 | Highest first, comma separated. Below each, the enemy looks one step more worn. |
| Default material | flesh | For enemies without a `<Scathe Material>` notetag. |
| Marks per enemy | 16 | 1 to 40. Once an enemy holds this many marks, new hits stop adding marks (the bands still deepen). |

## How it runs

- Each battler image is read **once**, when it first appears in a battle, from a copy Scathe owns. Your image files and
  RPG Maker's image cache are never changed.
- The damaged picture is redrawn only when a hit lands or the HP band changes, never every frame. A new hit is drawn on
  top of the last picture rather than redrawing every mark.
- Pixel art keeps its pixels: art scaled up 2x, 3x or 4x is detected and the marks are drawn on the same grid.
- Marks are never drawn outside the battler's outline, and never on a semi-transparent ground shadow painted under it.
- Works in front view (`img/enemies`) and side view (`img/sv_enemies`).
- An enemy that transforms starts clean with its new image. Every battle starts clean.
- Nothing is added to save files.

## Compatibility

Scathe extends `Game_Action.prototype.executeHpDamage`, `Game_Enemy.prototype.transform` and `Sprite_Enemy`'s
`initMembers`, `update` and `destroy`, always calling the original first. It adds methods named `scathe...` and replaces
no core method. Collapse, blink and whiten effects stay with RPG Maker or with your collapse plugin, and work on the
damaged picture. A plugin that keeps replacing an enemy's image (animated battlers) is left alone after four images, so
it never costs a pixel read per frame; an image that holds several animation frames in one sheet is treated as one
battler.

## Credits

Made by Core Systems Asset Factory. The code was written with AI assistance. The seven demo battlers and the demo
battleback were generated with AI image tools. Nothing else ships: every mark is drawn in code at run time from your
own battler art.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
