# Temperament - Personality Quizzes for RPG Maker MZ (Sort the Player Into Your Own Classes, Heroes or Houses) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Temperament - Personality Quizzes for RPG Maker MZ (Sort the Player Into Your Own Classes, Heroes or Houses)  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/temperament  
**Docs published:** 2026-11-05


---

# Temperament - personality quizzes for RPG Maker MZ

Version 1.0.0 · Core Systems Asset Factory

A personality quiz for your game. The player answers situational questions where no answer is right, and is sorted
into one of YOUR outcomes: your classes, your actors, or houses you name. Then a twelve-spoke wheel fills from their
answers, the strongest spoke flares, and a card turns over with the outcome's face, its name and the player's epithet
("the Calm"). An outcome with no face shows its own crest on the card; the medallion under the epithet is always
the player's.

Use it for a "who are you?" opening that picks the starting hero, a class chosen by temperament instead of a menu, a
house sorting at an academy, or a fortune teller in a tent.

## Files

| File | What it is |
| --- | --- |
| `js/plugins/TemperamentCore.js` | the rules: the twelve temperaments, the question bank, the sort and the tie rule |
| `js/plugins/TemperamentDraw.js` | the drawing kit: six stages, cards, tiles, twelve crests, the wheel |
| `js/plugins/Temperament.js` | the plugin command, the scene, the results |
| `LICENSE.txt` | the licence |

## Installing

Copy the three files into your project's `js/plugins` folder and enable all three in the Plugin Manager. Any order
works.

## Using it

Add the plugin command **Start Temperament Quiz** to an event. The event waits while the quiz runs.

### What it sorts into

| Sort into | The outcomes | How each one's temperament is read |
| --- | --- | --- |
| houses | the houses in the plugin parameters | the temperaments you write for it, e.g. `Gentle 2, Wise 1` |
| classes | the classes you pick (blank = every named class) | its parameter curves compared with the OTHER classes you list, plus the skills it learns |
| actors | the actors you pick (blank = every named actor) | through the actor's class |

A notetag on a class or an actor replaces the reading:

```
<Temperament: Gentle>
<Temperament: Bold 2, Daring 1>
```

The twelve temperaments, numbered as the temperament variable reports them:

| # | Temperament | Its crest |
| --- | --- | --- |
| 1 | Steadfast | a shield with a cross |
| 2 | Bold | a flame |
| 3 | Fierce | three claw marks |
| 4 | Proud | a crown |
| 5 | Loyal | a paw print |
| 6 | Gentle | a leaf |
| 7 | Calm | a moon over water |
| 8 | Wise | an open book |
| 9 | Curious | a spiral shell |
| 10 | Cunning | a fox mask |
| 11 | Daring | an arrow |
| 12 | Lucky | a horseshoe and a star |

### Reading your classes

A class is read by what makes it DIFFERENT from the other classes you list: a class with more Attack than its siblings
leans Bold, more Magic Attack leans Wise, more Magic Defense leans Gentle, more Agility leans Daring, more Luck leans
Lucky, and so on. Healing skills add a little Gentle, magic attacks a little Wise, physical attacks a little Bold.
Each class then gets its OWN leading temperament where it can: when two classes lead with the same one, the stronger
claim keeps it and the other takes its next best. A class identical to all its siblings reads as Steadfast.

On MZ's eight stock classes this gives eight different temperaments:

| Class | Leads with |
| --- | --- |
| Swordsman | Proud |
| Sorcerer | Wise |
| Priest | Gentle |
| Knight | Steadfast |
| Martial Artist | Bold |
| Magic Swordsman | Calm |
| Hunter | Lucky |
| Bandit | Daring |

Two actors of the same class read the same, so a quiz between them always ends in a tie question (see below). Give
one of them a notetag if you want them told apart by the answers.

### Command arguments

| Argument | Default | What it does |
| --- | --- | --- |
| Sort into | `houses` | houses, classes or actors |
| Classes (source: classes) | `[]` | the classes to sort into; blank = every named class |
| Actors (source: actors) | `[]` | the actors to sort into; blank = every named actor |
| Questions | `8` | 4 to 20 |
| Stage | `auto` | auto, dream, tent, shrine, guild, stars or hall |
| Variable: outcome id | `0` | gets the class id, the actor id, or the house's number in the list (from 1) |
| Variable: temperament (1-12) | `0` | gets the player's temperament, numbered as in the table above |
| Switch: quiz completed | `0` | turned ON when the quiz ends |
| Switch: decided by a tie question | `0` | ON when a tie question decided it, OFF otherwise |
| Classes: change the leader's class | `false` | the party leader changes to the sorted class |
| Classes: keep EXP on class change | `true` | passed to the engine's own class change |
| Actors: party change | `none` | none, join (the sorted actor joins), replaceLeader (the sorted actor joins at the front and the old leader leaves; if the sorted actor is already in the party, they move to the front and the old leader leaves) |
| Seed (optional) | | blank = different questions every time; a number or a word = the same quiz every time |

A variable or switch left at 0 is not touched.

### Plugin parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Sound: moving between answers | `Cursor1` | blank = silent |
| Sound: an answer chosen | `Decision1` | blank = silent |
| Sound: the reveal | `Chime2` | blank = silent |
| Houses | four houses | the outcomes for "houses": Hearth (Gentle 2, Loyal 1), Ember (Bold 2, Fierce 1), Tide (Calm 2, Wise 1), Gale (Daring 2, Cunning 1); each can have a face image |
| Your own questions | none | added to the bank (see below) |
| Use the built-in questions | `true` | false = only your own questions |

## The questions

**44 questions** are built in, with **176 answers** between them. They are situations in a fantasy world ("A rope
bridge sways over a gorge. The far side is where you need to be."), and every answer leans toward one or two
temperaments. No answer is right, and no answer names a temperament.

Each quiz draws its questions so that every temperament your outcomes care about is offered, and the answers are
read against what the quiz offered: a temperament the bank happens to offer more often cannot win by frequency
alone.

### Your own questions

Add them in the plugin parameter "Your own questions". Each has a question and up to four answers, and each answer has
a lean:

```
Question:  The ferry is late and the river is rising.
Answer A:  Wade across now.          leans toward: Daring 2
Answer B:  Wait for the ferry.       leans toward: Calm 2
Answer C:  Build a raft.             leans toward: Curious 1, Cunning 1
```

A question with no text, or with fewer than two answers that lean toward a temperament, is skipped, and the browser
console says which one and why.

## Ties

When two or more outcomes match the answers equally, the quiz does not pick one quietly. A banner reads "A TIE. ONE
QUESTION DECIDES.", the tied outcomes are shown with their crests, and one more question is asked: a question not yet
asked, with one answer per tied outcome, each answer the one that leans most toward that outcome. The player's pick
decides. When more outcomes tie than any question has answers, the last question is simply "Which road is yours?" with
one answer per outcome.

## The stages

Six places, each drawn by the plugin:

| Stage | Name |
| --- | --- |
| dream | The Dreaming Void |
| tent | The Fortune-Teller's Tent |
| shrine | The Shrine of Charms |
| guild | The Guild Hall at Night |
| stars | Under the Starfield |
| hall | The Sorting Hall |

## Controls

Arrow keys choose an answer, OK picks it; or click / tap an answer. On the reveal, OK or a click leaves.

## Script calls

```
Temperament.lastResult()
```
returns `{ source, outcomeId, outcomeName, temperament, temperamentIndex, epithet, byFaceoff }` for the last quiz, or
`null`. It is kept in the save file.

```
Temperament.start({ source: 'houses', questions: 8 })
```
starts a quiz from a script, with the same argument names as the command.

## Performance

While a question waits for the player the scene draws in **2 draw calls per frame** and uploads no textures; the wheel
is redrawn 24 times while it fills, never every frame.

## Compatibility

Temperament adds its own scene and replaces nothing. It extends two core methods, each by saving the original and
calling it:

- `Game_System.initialize` (its save record)
- `Game_Interpreter.updateWaitMode` (so the event waits while the quiz runs)

The class change and the party change use the engine's own `changeClass`, `addActor`, `swapOrder` and `removeActor`,
so they are saved like any other change.

## Terms

Commercial and non-commercial use in RPG Maker projects. See `LICENSE.txt`. The code, the drawing code and the
question text were written with AI assistance. No image, font or sound ships with it.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
