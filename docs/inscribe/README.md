# Inscribe - Name Entry and Riddle Answers for RPG Maker MZ: Six Rites, Drawn Keys, Generated Sigils — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Inscribe - Name Entry and Riddle Answers for RPG Maker MZ: Six Rites, Drawn Keys, Generated Sigils  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/inscribe  
**Docs published:** 2026-11-05


---

# Inscribe for RPG Maker MZ

**Version 1.0.**

**Names and answers, written onto an object.** The stock name screen is a grid of letters in a window. Inscribe draws
the moment as an object being written on: a register signed in ink, a name carved in stone, travel papers stamped by
the office, a typed form, a sigil traced into a circle, a headstone at night. The player types on the keyboard, or
presses keys drawn in the object's own material with a pad, a mouse or a finger.

The same scene asks questions. **Inscribe Answer** checks what the player writes against the answers you accept,
forgiving case and spacing and, when you allow it, accents, punctuation and a typo or two. Right or wrong shows on the
object: gilded, stamped, struck out, cracked. The result goes to a switch.

Nothing is loaded: the objects, the keys and the marks are drawn by the plugin, and the register, the form and the
papers fill themselves from your own database (your other actors, the actor's class, the map's name, the actor's face).

## Installing

Copy the three files into `js/plugins` and turn them on in the Plugin Manager. The order does not matter (tested with
`Inscribe.js` loading first):

1. `InscribeCore.js`: the rules (the entry, the answer check, the name suggestions)
2. `InscribeDraw.js`: the six rites and their keys
3. `Inscribe.js`: the parameters, the plugin commands and the scene

That is all. With the default parameters, every **Name Input Processing** event in your game now opens Inscribe. If
`InscribeCore.js` or `InscribeDraw.js` is missing or off, the stock screen opens instead and the console says which
files to enable.

## The six rites

- **register**: a guest register on a desk. The name is signed in ink on the red line; the lines above hold your other
  actors' names in faded ink. Keys: brass plates.
- **stone**: a slab. The name is carved in V-cut capitals, the chisel at the end of the cut. Keys: stone tiles.
- **papers**: travel papers. The portrait inset holds the actor's face, the place of origin is the map you are on, the
  office seal is struck in red. Keys: rubber stamps.
- **typewriter**: a typed form on a platen. Each letter is struck a little off the line in uneven ribbon ink; the
  occupation is already typed (the actor's class). Keys: typewriter keys.
- **sigil**: the letters traced into a circle. Each letter of the name is a point on an alphabet wheel and the trace
  runs from point to point, so every name makes its own mark. Keys: wax seals.
- **grave**: a headstone at night. The name is carved and mossed; a long name is cut on two lines. Keys: bone tiles.

## Name entry

**Which rite?** In this order: the rite set by **Inscribe Next Name** (it applies to the next Name Input Processing
only), the actor's notetag, the **Default rite** parameter. The actor notetag:

```
<Inscribe Rite: stone>
```

**Replace Name Input Processing** (parameter, default on). Off: Name Input Processing keeps the stock screen, and only
**Inscribe Next Name** or **Inscribe Name** open Inscribe. Turn it off if another plugin already restyles the stock
name screen and you want that screen most of the time.

**Inscribe Next Name** (plugin command): Rite, Heading and Prompt for the next Name Input Processing. Blank Heading and
Prompt use the rite's own. It is kept in the save, so a save between the two commands keeps it.

**Inscribe Name** (plugin command): opens Inscribe for one actor now, without Name Input Processing.

| Argument | Default | Meaning |
| --- | --- | --- |
| Actor | 1 | The actor being named. |
| Max letters | 8 | 1 to 24. |
| Rite | (default) | One of the six, or (default): the notetag, then the parameter. |
| Heading | blank | Blank = the rite's own heading. |
| Prompt | blank | Blank = the rite's own prompt. |

The name starts as the actor's current name. **Done** on an empty name restores it, as the stock screen does.

**Suggest.** With the **Name suggestions** parameter on, the Suggest key writes a new name each time it is pressed.
The names are made from the names in your own database (your actors, and the class, enemy and map words you wrote
yourself; the words a new MZ project ships with are left out) blended with a list fitted to the rite, so the stone
suggests different names from the papers. A suggestion is never a name already in your database, never one letter
away from one, 4 to 8 letters long, and never contains a word on a built-in list of offensive words.

## Inscribe Answer

A question, and the answers you accept. The event waits while the question is on screen.

| Argument | Default | Meaning |
| --- | --- | --- |
| Rite | (default) | One of the six, or the **Default rite** parameter. |
| Heading | blank | Blank = the rite's own heading for a question. |
| Question | blank | Shown on the object; two lines fit on every rite. |
| Accepted answers | blank | One per line. With none, nothing opens (the console says so once). |
| Typos forgiven | 1 | 0 to 3 letters wrong, missing, extra or swapped. Never more than a third of the answer's length. |
| Ignore accents | On | "Eloise" matches "Éloïse". |
| Ignore punctuation | On | "piano!" matches "piano". |
| Attempts | 3 | 0 = as many as the player wants. |
| Max letters | 16 | 1 to 24. |
| Show the answer when they run out | On | The answer is written on the object before the scene closes. |
| Player may give up | On | Cancel on an empty answer leaves, unsolved. |
| Switch: solved | 0 | ON if answered, OFF if not. |
| Variable: attempts used | 0 | How many answers were tried. |
| Variable: last answer typed | 0 | The text itself, as typed. Show it in a message with `\V[n]`. |

Case and spacing never matter: "  A   Piano " matches "a piano". A wrong answer is refused on the object and the line is
cleared for another try while attempts remain.

## Controls

- **Keyboard:** type. Enter finishes, Backspace erases. Letters typed on a keyboard never reach the engine's own keys,
  so "z" is a letter, not OK.
- **Pad or arrow keys:** move over the drawn keys, OK presses the key, Cancel erases (or gives up on an empty answer,
  when allowed), PageUp switches between the letters and the accents and digits, PageDown switches case.
- **Mouse and touch:** press a key. Hovering moves the cursor. A right click erases.

The keys hold A to Z, the apostrophe, the hyphen, the full stop and a space, and on the second page the digits and the
accented letters names use (À Á Â Ä Ç È É Ê Ë Í Ï Ñ Ó Ô Ö Ø Ú Ü ß Æ), each in upper and lower case. After the first
letter of a name the keys turn to lower case by themselves, unless the player chose a case.

## Script calls

```
Inscribe.name({ actorId: 1, maxLength: 10, rite: 'stone' });
Inscribe.answer({ rite: 'papers', prompt: 'What is the password?', answers: ['swordfish'], solvedSwitch: 5 });
Inscribe.nextName({ rite: 'sigil', title: 'The Binding' });
Inscribe.isOpen()   // true while the scene is on screen
```

## Parameters

| Parameter | Default | Meaning |
| --- | --- | --- |
| Replace Name Input Processing | Replace | Off keeps the stock screen (above). |
| Default rite | register | The rite when nothing else chooses one. |
| Name suggestions | On | The Suggest key. |
| Type on the keyboard | On | Off: the keyboard drives the drawn keys like a pad (arrows, OK, Cancel). |
| Portrait on the papers | On | Off: a drawn silhouette instead of the actor's face. |

**Sounds.** Four sound effects from `audio/se`: a letter (Cursor2), erase (Cancel1), a name sealed or an answer
accepted (Chime2), an answer refused (Buzzer1). Set any of them to (None) and that sound is silent. Moving over the
keys plays your system's own cursor sound.

## Compatibility

Inscribe adds its own scene. It extends three engine methods, each by saving the original and calling it:
`Game_Interpreter.command303` (Name Input Processing), `Game_Interpreter.updateWaitMode` (so the event waits) and
`Game_System.initialize` (its save record).

The stock name screen still opens when **Replace Name Input Processing** is off, in battle, and in a project whose
language is Japanese (Inscribe's keys are Latin; the stock screen has the kana tables). Inscribe Name and Inscribe
Answer do nothing in battle.

The scene draws no MZ window and uses its own typeface stacks: Segoe Script, Lucida Handwriting, Brush Script MT for
ink; Palatino Linotype, Book Antiqua, Palatino, Georgia for carving and print; Courier New, Courier, Lucida Console for
type. It is laid out for 816 x 624 and scaled to fit other screen sizes. It was tested in a stock MZ project; it has
not been tested beside every plugin.

**Save data.** One small record in the save file (`$gameSystem._csafInscribe`, version 1: names written, questions
asked, questions solved, and a pending Inscribe Next Name). A save made before Inscribe was installed loads cleanly.

**Cost per frame.** With a fast typist on the sigil (a letter every 8 frames), the scene draws in **2** draw calls per
frame with 0 windows drawn; the written line is redrawn only when a letter changes.

## Licence and AI disclosure

See `LICENSE.txt`. Every line of this plugin was written with AI assistance, and its store images and cover were
produced with AI assistance. It contains no audio: its default sounds are files from MZ's own RTP.

Copyright (c) 2026 Core Systems Asset Factory. https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
