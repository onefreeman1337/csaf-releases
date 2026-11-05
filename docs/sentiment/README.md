# Sentiment - Omori-Style Emotion Battles for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Sentiment - Omori-Style Emotion Battles for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/sentiment  
**Docs published:** 2026-11-05


---

# SENTIMENT

**Happy, sad and angry, drawn on every portrait.** RPG Maker MZ plugin, v1.0.0.

Sentiment gives every battler a feeling and draws it. Your own face art is never replaced: the face is
drawn first and the feeling is drawn over it, the way an artist marks up a sheet. A wash that reads the
picture under it (happy lifts and warms it, sad drains its colour toward blue, angry darkens it toward
red from the edges in), an outline scribbled by hand around the portrait or the creature, and the
feeling's marks: gold stars for happy, falling streaks for sad, popped veins and jagged ticks for angry.
Each rung is heavier than the one before, so a player can read a whole party's mood at a glance.

The marks keep off the face. On a portrait, no star and no vein reaches the box where a standard MZ face
has its eyes and mouth: a mark that would is drawn smaller to fit the room it has, and every rung still
gets its full count (3, 6 and 10 marks). Sad's streaks fall from the top edge on purpose, over the hair
and brow, and stay in the top 40% of the portrait. Measured in pixels over 150 seeds per rung.

## The rules

| Feeling | Rung 1 | Rung 2 | Rung 3 | What it does to the numbers (per rung) |
| --- | --- | --- | --- | --- |
| Happy | Happy | Ecstatic | Manic | agility +25%, luck +50%, defence -10% |
| Sad | Sad | Depressed | Miserable | defence +25%, magic defence +25%, agility -15% |
| Angry | Angry | Enraged | Furious | attack +25%, magic attack +20%, defence -15%, magic defence -10% |

The feelings are a rock-paper-scissors: **HAPPY beats ANGRY, ANGRY beats SAD, SAD beats HAPPY.** An
attacker whose feeling beats its target's deals **x1.5** damage; one whose feeling loses deals **x0.5**.
Both numbers are plugin parameters. Heals are never scaled.

## What is in the box

| | |
| --- | --- |
| `js/plugins/SentimentCore.js` | The rules: the wheel, the rungs, the stat table and the notetags. Knows nothing about RPG Maker. |
| `js/plugins/SentimentArt.js` | The drawing kit: washes, scribbled outlines, the feeling's marks and the emotion wheel. Knows nothing about RPG Maker. |
| `js/plugins/Sentiment.js` | The only file that touches the engine: the record on each battler, damage, stats, notetags, the drawn-over portraits and enemies, plugin commands. |

## Install

1. Copy the three `.js` files into your project's `js/plugins` folder.
2. In the Plugin Manager, enable them in this order: **SentimentCore, SentimentArt, Sentiment.**
   (If the two helpers are missing, Sentiment says so once in the console and every battler plays calm.
   It never stops your game.)

## Notetags

**Skills and items** (what a hit does to the target's feeling):

| Tag | Effect |
| --- | --- |
| `<Sentiment: happy>` | one rung more of happy, or happy at rung 1 if the target felt something else |
| `<Sentiment: sad 2>` | straight to rung 2 of sad |
| `<Sentiment: calm>` | clears the feeling |
| `<Sentiment target: user>` | beside one of the tags above: the feeling lands on the user instead of the target, once per action however many targets the skill has |

**Actors and enemies:**

| Tag | Effect |
| --- | --- |
| `<Sentiment max: 2>` | the highest rung this battler can reach (1 to 3) |
| `<Sentiment start: angry 1>` | how it enters a battle it starts calm (with **Calm after battle** on, that is every battle) |

## Plugin commands

| Command | Arguments |
| --- | --- |
| **Set Feeling** | Actor (0 = the whole party), Feeling (happy, sad, angry), Rung (1 to 3, or 0 for one rung more) |
| **Calm Feeling** | Actor (0 = the whole party) |

## Parameters

| Parameter | Default | |
| --- | --- | --- |
| Damage when the feeling wins | 1.50 | multiplier when the attacker's feeling beats the target's |
| Damage when the feeling loses | 0.50 | multiplier when it loses |
| Calm after battle | true | clear every feeling when a battle ends |
| Draw over enemies | true | treat enemy images too, front view and side view |
| Draw over side-view actors | true | treat the side-view battler sheets of the party |
| Wheel on battle portraits | true | the emotion wheel and the rung's name on each battle portrait |
| Battle log line | `%1 feels %2!` | shown when a feeling changes; blank shows nothing |

## Script

```
CSAF.Sentiment.get(battler)         // { e: 'happy' | 'sad' | 'angry' | null, t: 0..3 }
CSAF.Sentiment.set(battler, e, t)   // e may also be 'calm'; t omitted = one rung more
CSAF.Sentiment.rungName(battler)    // 'Ecstatic', or '' when calm
```

## Where the feeling is drawn

- **Battle portraits** (front view): the face in the battle status window, with the wheel and the rung's name.
- **Every other status portrait** that draws an actor's face through the engine's standard method.
- **Enemies**, front view and side view: around the creature's own silhouette.
- **Side-view actors**: every cell of the battler sheet.

Each treated picture is drawn **once** per face and rung and kept. The one moment of drawing is the frame
a feeling changes; after that nothing is redrawn while a battle runs. Measured in the engine
(`Internal_Ops/_probe/in_engine.js`): 120 battle frames with feelings set create no new bitmaps, redraw no
windows and parse no notetags; each frame only compares two stored fields.

An enemy whose database entry shifts its hue shows the drawn feeling in the shifted colours too: the
engine applies the hue to the whole sprite.

## Compatibility

Sentiment extends twelve core methods. Every one is extended by saving the original and **calling** it;
nothing is replaced and nothing is overwritten: `Game_BattlerBase.initMembers`, `Game_BattlerBase.paramRate`,
`Game_Battler.onBattleStart`, `Game_Battler.onBattleEnd`, `Game_Action.makeDamageValue`,
`Game_Action.applyItemUserEffect`, `Window_StatusBase.drawActorFace`, `Window_BattleStatus.drawItemImage`,
`Window_BattleLog.displayAffectedStatus`, `Sprite_Enemy.updateBitmap`, `Sprite_Actor.updateBitmap`,
`Scene_Battle.terminate`. Portraits are drawn by the engine (and by any plugin before Sentiment) first and
the feeling is drawn over them; enemies and side-view actors are treated from whatever picture the engine
or another plugin put on the sprite.

A save made with Sentiment loads without it (the record is a plain field the engine ignores), and a save
made without it loads with it (every battler starts calm).

**Tested with:** a stock MZ project, front view and side view. **Not yet tested with VisuStella Battle
Core** or other battle-system plugins that replace battler sprites. Put Sentiment below them in the Plugin
Manager, so its extensions wrap theirs. If a combination misbehaves, turn **Draw over enemies** or **Draw
over side-view actors** off: the rules, the portraits and the wheel keep working.

## Credits

Made by Core Systems Asset Factory. The code and the drawing code were written with AI assistance. No
image, font or sound ships with the plugin: every mark is drawn in code over your own art.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
