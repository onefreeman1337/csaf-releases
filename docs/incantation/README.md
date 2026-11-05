# Incantation - Typing Battles for RPG Maker MZ (Words From Your Own Database) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Incantation - Typing Battles for RPG Maker MZ (Words From Your Own Database)  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/incantation  
**Docs published:** 2026-11-05


---

# INCANTATION

**Typing battles for RPG Maker MZ, the words written from your own database.** v1.0.0.

Foes walk toward the party down a drawn corridor, each carrying a word over its head. Type the word to strike it
down. The words are your own: the names of your skills (the incantation you must say to cast it), your enemies and
your items, or any text you give a record in an `<Incantation: words>` notetag. You add one plugin command; the
battle, the stage and the lettering are Incantation's.

## What is in the box

| | |
| --- | --- |
| `js/plugins/IncantationCore.js` | The rules: harvesting words from your database, the battle, the scoring. Knows nothing about RPG Maker. |
| `js/plugins/IncantationDraw.js` | The drawing kit: three stages, word plates with igniting letters, candles, the score band, the results. Knows nothing about RPG Maker. |
| `js/plugins/Incantation.js` | The only file that touches the engine: the plugin command, the battle scene, the results. |

## Install

1. Copy the three `.js` files into your project's `js/plugins` folder.
2. Enable all three in the Plugin Manager. Any order works: each file finds the others when a battle starts.

## The words

Incantation reads the names of your skills, enemies and items (or one of those lists) and keeps every name a
keyboard can type: letters, digits, spaces, apostrophes and hyphens, 3 to 24 characters, lower-cased, with
underscores read as spaces. It skips blank names, dividers (`-----Reserved`), names two records share, and names
with characters a keyboard cannot type directly (accents, kana): give those records a notetag instead.

```
<Incantation: ignis ardens>
```

The stock MZ database alone gives 159 words. A battle deals short words first and long words last, and two foes on
the field never start with the same letter, so your first key always picks exactly one.

## Using it

Add the plugin command **Start Typing Battle** to an event. The event waits while the battle runs.

| Argument | Default | |
| --- | --- | --- |
| Difficulty | normal | easy, normal or hard (below) |
| Words to clear | 0 | 0 = the difficulty's own count; up to 40 |
| Words from | all | all, skills, enemies or items |
| Troop (foe pictures) | 0 | the foes wear this troop's enemy pictures; 0 = any enemy in your database. A foe carrying an enemy's name wears that enemy's picture. |
| Stage | auto | crypt, grove or void |
| Variable: score | 0 | |
| Variable: words cleared | 0 | |
| Switch: won | 0 | ON when the party survives the battle |
| Gold per 10 points | 0 | 0 = no payout |
| Seed (optional) | | blank = new words every time; a number or a word = the same battle every time |

## Difficulty, measured

A simulated typist at 93% accuracy, 200 battles on each of two seed sets, the stock database's words:

| Difficulty | Words | Lives | Foes at once | Wins |
| --- | --- | --- | --- | --- |
| easy | 12 | 5 | 2 | 65 to 70% at 1.5 keys a second, every battle at 2 |
| normal | 12 | 3 | 3 | none at 2 keys a second, about half at 3, every battle at 4 |
| hard | 16 | 3 | 4 | 10 to 12% at 5 keys a second, about 90% at 6, every battle at 8 |

Three keys a second is roughly 35 words a minute.

## Controls

A keyboard. The first letter you type locks the nearest foe whose word starts with it; type the rest of the word to
strike it. A wrong key is a miss: the lock holds, and your combo breaks. Every five words in a row multiply the score.
A foe that reaches the party snuffs a candle; when the candles are out, the battle is lost. On the results, OK (or a
click) leaves. A battle needs a keyboard: there is no on-screen keyboard in this version.

## Parameters (sounds)

| Parameter | Default |
| --- | --- |
| Sound: a right letter | Cursor2 |
| Sound: a word finished | Magic3 |
| Sound: a wrong key | Buzzer1 |
| Sound: a foe reaches the party | Damage1 |

Every default is a sound from the stock RTP.

## Script

```
Incantation.start({ difficulty: 'hard', stage: 'void', sources: 'skills' })   // the same options as the command
Incantation.record()                                                         // { v: 1, played, won, best }
```

## Compatibility

Incantation adds its own scene and replaces nothing. It extends two core methods, each by saving the original and
calling it: `Game_System.initialize` (its save record) and `Game_Interpreter.updateWaitMode` (so the event waits while
the battle runs). It reads your database and never writes to it. It listens for key presses only while a battle is
running and removes its listener when the battle ends.

## Credits

Made by Core Systems Asset Factory. The code and the drawing code were written with AI assistance. No image, font or
sound ships with the plugin, and no word list: the stages, plates and candles are drawn in code, the foes wear your
own enemy pictures, and the words are your own database's.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
