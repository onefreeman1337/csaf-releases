# Song Sheets — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Song Sheets  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/song-sheets  
**Docs published:** 2026-11-05


---

# Song Sheets — for RPG Maker MZ

**Every song your player collects becomes a real engraved score — and the sheet plays what it shows.**

Ten musical traditions, ten notation systems, one plugin. A plainchant hymn is set as square
neumes on a red four-line stave with sung syllables underneath. A courtly pavane is mensural, with
void noteheads and diamond longs. A reel is modern notation with sloped beams and barlines. A
muster call is a percussion grid with a horn-call signal chart. A fae round curls its stave into a
spiral that comes back round to where it started.

None of it is an image file. Every plate is drawn as vector geometry at runtime from the song's
own id, so a song that does not exist until your player finds it still has a score — and a sound.

---

## What it does

- **Ten traditions, ten kinds of document.** Plainchant · Courtly Air · Reel · Muster Call ·
  Lament · Fae Round · Hymnal · Shanty · Incantation · Work Song. Each has its own melodic
  construction, notation system, paper, ink, page furniture, instrument and tempo.
- **The melody is generated, not stored.** A song id maps to exactly one melody, forever, on every
  machine and in every save. `the-hours-of-ash` is always the same piece of music.
- **It is real notation.** Stem direction flips at the middle line. Beams slope with the melody and
  are clamped the way an engraver clamps them. Barlines fall where the metre puts them and beams
  never cross one. Ledger lines locate the notes above and below the stave. Semibreves have no
  stems. Plainchant has no barlines, because plainchant has none.
- **The sheet plays.** Press OK and the melody sounds through WebAudio — a different instrument per
  tradition — while a light runs across the notation, note by note, landing on each notehead as it
  sounds.
- **A collection scene** that looks nothing like RPG Maker: no windowskin, no default font, no
  `Window_Base` anywhere in it.

## Install

Copy all four files into `js/plugins/` and enable them **in this order**:

| Order | File | What it is |
| --- | --- | --- |
| 1 | `SongCorpus.js` | The traditions and the melody generator. No engine code, no drawing. |
| 2 | `SongEngraver.js` | The engraver. No engine code. |
| 3 | `SongPlayer.js` | The synthesiser. No engine code. |
| 4 | `SongSheets.js` | Storage, plugin commands and the songbook scene. |

The order matters. The first three are libraries the fourth uses.

## Compatibility

**This plugin ADDS a scene. It replaces nothing.** Every core method it touches is extended with
the original saved and called, so a plugin loaded after this one sees the engine it expects:

| Core method | How it is touched |
| --- | --- |
| `Game_System.prototype.initialize` | extended, original called |
| `DataManager.makeSaveContents` | extended, original called |
| `DataManager.extractSaveContents` | extended, original called |
| `Window_MenuCommand.prototype.addOriginalCommands` | extended, original called *(optional — turn off "Add to the main menu")* |
| `Scene_Menu.prototype.createCommandWindow` | extended, original called *(same)* |

**Nothing is overwritten. Zero core methods are replaced.**

- Tested alongside the **stock MZ scripts** and with **VisuStella MZ Core Engine** present.
- Import order against other plugins: anywhere. If you use VisuStella, put these four **below**
  the VisuStella Core Engine, as VisuStella asks for all third-party plugins.
- Save-safe and forward-compatible: the collection lives on `Game_System` with a version stamp.
  A save made before you installed this plugin loads without error. A save made by a **later**
  version keeps its data rather than being downgraded.

## Using it

### Plugin commands

| Command | What it does |
| --- | --- |
| **Learn a song** | Adds a sheet to the player's book. Choose the id, the tradition, the title and optionally a tonic. |
| **Forget a song** | Removes one. |
| **Open the songbook** | Opens the collection scene. |
| **Show one sheet** | Learns the song if unknown, then opens the book on that sheet. |
| **Count collected songs** | Writes the number collected into a variable. |
| **Test for a song** | Turns a switch on if the player has that sheet. |

### Script calls

```js
CSAF.SongSheets.learn('the-hours-of-ash', 'chant', 'The Hours of Ash');
CSAF.SongSheets.forget('the-hours-of-ash');
CSAF.SongSheets.has('the-hours-of-ash');   // -> true / false
CSAF.SongSheets.count();                   // -> how many collected
CSAF.SongSheets.list();                    // -> a copy of the collection
SceneManager.push(Scene_Songbook);
```

### In the songbook

| Key | Does |
| --- | --- |
| Up / Down | choose a sheet |
| Page Up / Page Down | jump a page |
| OK | play the melody; the notation follows it |
| Shift | stop |
| Cancel | leave |

### Plugin parameters

Songbook title · default tonic · desk colour · play on open · show the playhead · add to the main
menu · menu command label.

## The traditions

| Tradition | Mode | Metre | Notation | Instrument |
| --- | --- | --- | --- | --- |
| Plainchant | dorian | free | square neumes, four-line stave, one red, sung syllables | voice |
| Courtly Air | ionian | 3/2 | mensural — void noteheads, diamond longs, no barlines | plucked |
| Reel | mixolydian | 6/8 | modern stave, beamed | reed |
| Muster Call | ionian | 4/4 | percussion grid + horn-call signal chart | brass |
| Lament | phrygian | 4/4 | modern stave, mourning bands | bowed |
| Fae Round | lydian | 5/8 | an invented spiral stave that returns to its start | bell |
| Hymnal | ionian | 4/4 | modern stave, ruled, with a hymn number | organ |
| Shanty | dorian | 2/2 | modern stave, rope border | voice |
| Incantation | locrian | free | square neumes — and the whole piece is a palindrome | glass |
| Work Song | aeolian | 3/4 | anvil grid + voice chart, with tally marks | hammer |

Each tradition is a genuinely different **construction**, not one generator with different numbers
in it. The reel is built from a chord turn with passing notes; the shanty answers every call with
the same literal refrain; the incantation is a phrase followed by its exact retrograde, rhythm
included; the work song strikes an anvil against a cycling answer.

## What is and is not in this package

**Not included, and not needed:** no images, no audio files, no fonts, no RPG Maker runtime files.

Every plate is vector geometry drawn at runtime. Every note is synthesised from oscillators. That
is why ten traditions × unlimited songs costs about sixty kilobytes of readable JavaScript.

**The source ships raw and uncompressed.** Nothing here is minified. Read it, change it, learn from
it.

## Requirements

RPG Maker MZ. No other plugins required.

## Terms

Free for use in commercial and non-commercial RPG Maker MZ projects. Do not redistribute the plugin
files themselves. Credit appreciated, not required.

Copyright © Core Systems Asset Factory.

## Disclosure

This plugin's code and store artwork were produced with AI assistance. The audio is procedural
synthesis written in JavaScript — there is no generative audio model anywhere in it, and no audio
files ship with it.

---

*More RPG Maker MZ systems from Core Systems Asset Factory: <https://csaf.itch.io>*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
