# Quizmaster - Quiz Shows and Exams for RPG Maker MZ (Questions Written From Your Database) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Quizmaster - Quiz Shows and Exams for RPG Maker MZ (Questions Written From Your Database)  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/quizmaster  
**Docs published:** 2026-11-05


---

# QUIZMASTER

**Quiz shows and exams for RPG Maker MZ, the questions written from your own database.** v1.0.0.

Quizmaster reads your database and writes multiple-choice questions whose answers are facts in it: what an item costs,
which element a skill is, which class learns it, which state it inflicts, which enemy is toughest, what an enemy drops.
Every question card pictures its subject with your own art (the item's icon, the enemy's image, the actor's face) on a
stage the plugin draws. You add one plugin command; the questions, the stage and the scoring are Quizmaster's.

## What is in the box

| | |
| --- | --- |
| `js/plugins/QuizmasterCore.js` | The rules: reading the database, writing the questions, the quiz, the rivals. Knows nothing about RPG Maker. |
| `js/plugins/QuizmasterDraw.js` | The drawing kit: six stages, question cards, answer tiles, podiums, the timer, element marks. Knows nothing about RPG Maker. |
| `js/plugins/Quizmaster.js` | The only file that touches the engine: the plugin command, the quiz scene, the results. |

## Install

1. Copy the three `.js` files into your project's `js/plugins` folder.
2. Enable all three in the Plugin Manager. Any order works: each file finds the others when a quiz starts.

## The questions

Eleven kinds, each written only when exactly ONE answer is right in your data:

| Card | Question |
| --- | --- |
| MARKET | How much does X cost? / Which of these costs the most? |
| ARMOURY | Which of these is a weapon? |
| SPELLBOOK | How much MP does X cost? / What element is X? / Which state can X inflict? |
| SCHOOLS | Which class learns X? |
| ROLL CALL | What class is X? |
| BESTIARY | Which element is X weakest to? / Which of these has the most HP? / How much gold does X drop? |

Never asked: a blank or divider record ("-----Reserved"), a name two records share, a tie, a fact that is not there,
and a question whose answer is printed in the question itself. The stock MZ database alone writes 392 questions; a
quiz draws them one kind at a time, so a short quiz is never all prices.

## Using it

Add the plugin command **Start Quiz** to an event. The event waits while the quiz runs.

| Argument | Default | |
| --- | --- | --- |
| Mode | show | show = against rivals on podiums; exam = the player alone, marked against a pass mark |
| Questions | 6 | 3 to 20 |
| Seconds per question | 12 | 5 to 30; the timer ring drains, and running out scores nothing |
| Stage | auto | gameshow, classroom, tavern, arcane, court or carnival |
| Rivals (quiz show) | 3 | 0 to 3 |
| Rival level | mixed | novice, sharp, master, or mixed (one of each) |
| Rival actors (faces and names) | [] | optional: actors whose names and faces the rivals use |
| Exam pass mark (%) | 60 | the share of right answers that passes an exam |
| Variable: score | 0 | |
| Variable: right answers | 0 | |
| Variable: place (quiz show) | 0 | 1 = won |
| Switch: won or passed | 0 | ON when the player wins the show or passes the exam |
| Gold per point | 0 | the score paid out as gold; 0 = no payout |
| Seed (optional) | | blank = new questions every time; a number or a word = the same quiz every time |

Scoring: a right answer earns 10 points plus up to 10 for speed. Rivals answer right about 45% (novice), 65% (sharp)
and 85% (master) of the time, a little less on harder cards.

## Controls

Arrow keys choose an answer and OK locks it in; or click or tap an answer. On the results, OK (or a click) leaves.

## Parameters (sounds)

| Parameter | Default |
| --- | --- |
| Sound: a right answer | Chime2 |
| Sound: a wrong answer | Buzzer1 |
| Sound: choosing | Cursor1 |

Every default is a sound from the stock RTP.

## Script

```
Quizmaster.start({ mode: 'exam', questions: 8, theme: 'classroom' })   // the same options as the command
Quizmaster.record()                                                    // { v: 1, played, won, best }
```

## Compatibility

Quizmaster adds its own scene and replaces nothing. It extends two core methods, each by saving the original and
calling it: `Game_System.initialize` (its save record) and `Game_Interpreter.updateWaitMode` (so the event waits while
the quiz runs). It reads your database and never writes to it.

In the engine, a running quiz show (the timer draining, answers revealed, new cards composed) measured **2 draw calls
per frame**, with no growth in display objects.

## Credits

Made by Core Systems Asset Factory. The code and the drawing code were written with AI assistance. No image, font or
sound ships with the plugin: the stages, cards, tiles and marks are drawn in code, and the pictures on the cards are
your own database's art.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
