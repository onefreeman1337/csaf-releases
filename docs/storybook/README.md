# Storybook: A Fairy Tale Score — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Storybook: A Fairy Tale Score  
**Engine:** MIDI composition from Node (deterministic, theory-checkable) + rendered OGG via a redistribution-cleared soundfont - engine-agnostic music packs. Renderer + soundfont licence gate is the wing's first architecture decision; see Wings/Music/CLAUDE.md 3.  
**Docs published:** 2026-11-01


---

# STORYBOOK — A FAIRY TALE SCORE
### 44 tracks, 54:53

Core Systems Asset Factory

---

## What this is

Most game-music packs are a **grab-bag**: tracks bought or bundled together that happen to share a
genre. Drop three of them into one project and the player hears the seams — different rooms,
different instruments, different composers.

**This is an album, not a bag.** 44 tracks across 44 slots, written in
one musical language from one family of 8 hand-authored themes. That is not a
description, it is a measurement: the harness reads the finished MIDI back and counts every statement
of every theme in every track — **1,763** of them here — and the
report is in this download. Your game gets a **score**, not a playlist.

## What you get

- **44 × `.ogg`** — OGG Vorbis, 44.1 kHz stereo, ready to drop in
- **44 × `.mid`** — the **editable MIDI sources**. Re-voice them, re-orchestrate
  them, change the tempo, pull out a single line.
- **Sample-accurate loop metadata** — `LOOPSTART` / `LOOPLENGTH` in the OGG Vorbis comments,
  denominated in samples, which is exactly what **RPG Maker MV / MZ** reads
- **Per-engine import notes** (below)
- **A royalty-free licence** for commercial games (see `LICENSE.txt`)

## The storyteller

Every one of the 38 full pieces opens the same way: a music box, alone, states the album's first theme, "Once Upon a Time",
before anything else sounds. Then the scene begins. The music box is heard nowhere else on the record: not after those opening bars,
and not in any of the six cues. In the .mid it is the part named `storyteller` on its own channel, so you can mute it or give it
another instrument.

The loop point is placed after the storyteller, at the start of the scene, so in a game the opening plays once and the scene repeats.

## The spell

In the 15 tracks under the spell (Chapters 3 and 4 and one cue: Enchantment, The Sleeping Castle, The Doorless Tower, The Briar Hedge, The Mirror That Lies, A Hundred Winters, The Three Tasks, The Glass Mountain, The Giant's Larder, The Riddle Gate, Battle in the Wood, The Dragon's Lair, The Dragon, The Witch Queen and The Spell Is Cast) the first theme is heard only upside
down: every interval turned the other way, never in its own shape and never backwards. On the
14 full pieces among them the storyteller's opening is upside down too. It comes back the right way up in "The Spell Breaks", which opens
Chapter 5, and stays that way to the end of the book.

## The small band

The whole record is played by one small storybook band: woodwinds, strings, harp, keys and bells, voices and one timpani. There is no
brass and no drum kit on any track.

## The book

### Chapter 1: Once Upon a Time

- 01. Once Upon a Time
- 02. The Village Green
- 03. Hearthside
- 04. The Mill Wheel
- 05. Fair Day
- 06. The Child
- 07. The King's Hall
- 08. The Royal Ball
- 09. Cradle Song

### Chapter 2: Into the Wood

- 10. The Forest Path
- 11. The Wicked Wood
- 12. The Fairy Ring
- 13. The Enchanted Spring
- 14. The Woodcutter
- 15. The Troll Bridge
- 16. The Grey Wolf
- 17. The Sweet House
- 18. The Witch's Kitchen

### Chapter 3: The Spell

- 19. Enchantment (under the spell)
- 20. The Sleeping Castle (under the spell)
- 21. The Doorless Tower (under the spell)
- 22. The Briar Hedge (under the spell)
- 23. The Mirror That Lies (under the spell)
- 24. A Hundred Winters (under the spell)

### Chapter 4: The Trial

- 25. The Three Tasks (under the spell)
- 26. The Glass Mountain (under the spell)
- 27. The Giant's Larder (under the spell)
- 28. The Riddle Gate (under the spell)
- 29. Battle in the Wood (under the spell)
- 30. The Dragon's Lair (under the spell)
- 31. The Dragon (under the spell)
- 32. The Witch Queen (under the spell)

### Chapter 5: Happily Ever After

- 33. The Spell Breaks
- 34. The Way Home
- 35. The Wedding Feast
- 36. Dancing on the Green
- 37. Ever After
- 38. The End

### The Cues

- 39. Once
- 40. A Wish
- 41. The Spell Is Cast (under the spell)
- 42. Treasure
- 43. And So They Won
- 44. The Book Closes

## Loops

All 38 full pieces loop, the shortest for 45.0 seconds (read the LOOPSTART and LOOPLENGTH tags in any .ogg).
The 6 cues (Once, A Wish, The Spell Is Cast, Treasure, And So They Won and The Book Closes) play once and do not loop.

### Instruments

Every sound is one of 29 General MIDI programs, rendered through the GeneralUser GS soundfont, named here by their General MIDI names.

Keys and mallets: music box, celesta, tubular bells, dulcimer, harpsichord, acoustic grand piano and reed organ.
Plucked: harp, pizzicato strings and nylon guitar.
Strings: violin, viola, cello, contrabass, acoustic bass, tremolo strings, string ensemble and slow strings.
Woodwinds: piccolo, flute, recorder, ocarina, oboe, English horn, clarinet and bassoon.
Voices: choir aahs and voice oohs.
Drum: timpani.

The `.mid` files are the real sources: load them into your own instruments to replace any part. No game or film cue is quoted anywhere on this
record, and no traditional tune is used; every tune on it was composed for it.

## Track list

| # | Title | Slot | Key | BPM | Length | LOOPSTART / LOOPLENGTH |
| --- | --- | --- | --- | --- | --- | --- |
|  1 | Once Upon a Time | Title / main theme | F ionian | 84 | 1:23 | 378000 / 3276000 |
|  2 | The Village Green | Town / village | C ionian | 104 | 1:12 | 305308 / 2849538 |
|  3 | Hearthside | Cottage | G ionian | 72 | 1:43 | 441000 / 4116000 |
|  4 | The Mill Wheel | Mill | D mixolydian | 112 | 1:06 | 283500 / 2646000 |
|  5 | Fair Day | Fair | G mixolydian | 120 | 0:58 | 264600 / 2293200 |
|  6 | The Child | Hero theme | A ionian | 92 | 1:16 | 345130 / 2991131 |
|  7 | The King's Hall | Castle | D ionian | 88 | 1:19 | 360818 / 3127091 |
|  8 | The Royal Ball | Ball | A# ionian | 132 | 0:59 | 240545 / 2345319 |
|  9 | Cradle Song | Lullaby | D# ionian | 66 | 1:49 | 481091 / 4329818 |
| 10 | The Forest Path | Forest | E dorian | 96 | 1:13 | 330750 / 2866500 |
| 11 | The Wicked Wood | Dark forest | B aeolian | 70 | 1:53 | 453600 / 4536000 |
| 12 | The Fairy Ring | Fairy ring | F lydian | 100 | 1:05 | 317520 / 2540160 |
| 13 | The Enchanted Spring | Enchanted spring | D lydian | 76 | 1:25 | 417789 / 3342316 |
| 14 | The Woodcutter | Woodcutter | A dorian | 100 | 1:14 | 317520 / 2963520 |
| 15 | The Troll Bridge | Troll bridge | C mixolydian | 84 | 1:29 | 378000 / 3528000 |
| 16 | The Grey Wolf | Wolf | E aeolian | 120 | 1:02 | 264600 / 2469600 |
| 17 | The Sweet House | Witch's lure | A ionian | 108 | 1:00 | 294000 / 2352000 |
| 18 | The Witch's Kitchen | Witch | C# phrygian | 96 | 1:18 | 330750 / 3087000 |
| 19 | Enchantment | Curse | D harmonic minor | 60 | 2:04 | 529200 / 4939200 |
| 20 | The Sleeping Castle | Sleeping castle | G aeolian | 63 | 1:49 | 504000 / 4284000 |
| 21 | The Doorless Tower | Tower | F# phrygian | 66 | 1:53 | 481091 / 4490182 |
| 22 | The Briar Hedge | Briar | C dorian | 80 | 1:39 | 396900 / 3969000 |
| 23 | The Mirror That Lies | Mirror | F harmonic minor | 72 | 1:37 | 441000 / 3822000 |
| 24 | A Hundred Winters | Long winter | A# aeolian | 58 | 2:00 | 547448 / 4744552 |
| 25 | The Three Tasks | Trials | G dorian | 104 | 1:07 | 305308 / 2646000 |
| 26 | The Glass Mountain | Mountain | E lydian | 80 | 1:27 | 396900 / 3439800 |
| 27 | The Giant's Larder | Giant | A# mixolydian | 92 | 1:21 | 345130 / 3221218 |
| 28 | The Riddle Gate | Riddle | A phrygian | 76 | 1:25 | 417789 / 3342316 |
| 29 | Battle in the Wood | Battle | D aeolian | 138 | 0:52 | 230087 / 2070783 |
| 30 | The Dragon's Lair | Dragon lair | E phrygian | 64 | 1:56 | 496125 / 4630500 |
| 31 | The Dragon | Boss | C harmonic minor | 144 | 0:50 | 220500 / 1984500 |
| 32 | The Witch Queen | Final boss | A harmonic minor | 150 | 1:09 | 211680 / 2822400 |
| 33 | The Spell Breaks | Spell breaks | D ionian | 72 | 1:37 | 441000 / 3822000 |
| 34 | The Way Home | Way home | G mixolydian | 96 | 1:18 | 330750 / 3087000 |
| 35 | The Wedding Feast | Feast | F ionian | 116 | 1:08 | 273724 / 2737242 |
| 36 | Dancing on the Green | Dance | D ionian | 120 | 0:56 | 264600 / 2182950 |
| 37 | Ever After | Ending | C ionian | 66 | 2:00 | 481091 / 4810909 |
| 38 | The End | Credits | F ionian | 84 | 1:34 | 378000 / 3780000 |
| 39 | Once | Opening sting | F ionian | 80 | 0:22 | one-shot |
| 40 | A Wish | Magic sting | D lydian | 96 | 0:14 | one-shot |
| 41 | The Spell Is Cast | Curse sting | D harmonic minor | 72 | 0:20 | one-shot |
| 42 | Treasure | Treasure sting | G ionian | 112 | 0:16 | one-shot |
| 43 | And So They Won | Victory stinger | A# ionian | 108 | 0:15 | one-shot |
| 44 | The Book Closes | Defeat stinger | D aeolian | 60 | 0:23 | one-shot |

## The theme family

Everything here grows from **8 hand-authored themes**, one seed and seven cells beside it:
`once` is a third, two steps up and a fall of a fourth: the storyteller's opening line, on every page.
`child` climbs a step and a third, steps back and climbs again: the cell that ends highest.
`hearth` is four even quarters, settling down and coming back up: home.
`wood` opens on a half note and ends lower than any other cell: the wicked wood and the briar.
`spell` limps in dotted pairs, turns on one note and drops: the witch and the curse.
`fairy` leaps up a fifth in quick eighths and floats down by steps: good magic.
`beast` opens by falling a fourth: the wolf, the troll, the giant and the dragon.
`ever` is the longest, a reach of a fourth and a slow way home: the ball, the feast and the ending.
A narrator's instrument and a theme turned upside down by a curse are old storytelling devices and are not claimed as new here; what this
record adds is that both are strict and checked in the shipped files: the music box opens every full piece and plays nowhere else, and
under the spell the first theme never once appears the right way up.
Every track states at least one of them — in its original form, inverted, backwards, widened or
compressed.

| id | Theme | Built from | Role |
| --- | --- | --- | --- |
| `once` | Once Upon a Time | once upon a time: up a third, up a step, up a step, down a fourth; ends a step up | The storyteller's opening line: a third, two steps up, and a fall of a fourth. Stated in its own shape in every track outside the spell, and only upside down inside it. |
| `child` | The Child | the child: up a step, up a third, down a step, up a step; ends a fourth up | The child who walks into the story: up a step and a third, a step back, and up again. The cell that ends highest above where it began. |
| `hearth` | The Hearth | the hearth: down a step, down a step, up a step, up a third; ends a step up | Home: the cottage, the village, the mill. The only cell of four even quarters, settling down and coming back up. |
| `wood` | The Wood | the wood: down a third, down a step, up a step, down a third; ends a fifth down | The wicked wood and the briar: it opens on a half note and ends lower than any other cell. |
| `spell` | The Spell | the spell: up a step, down a step, up a step, down a fourth; ends a third down | The witch and the curse: the only cell in dotted pairs, a limp that turns on one note and drops. |
| `fairy` | The Fairy | the fairy: up a fifth, down a step, down a step, down a step; ends a step up | Good magic: the only cell that opens with a leap up a fifth, in four quick eighths, and floats back down by steps. |
| `beast` | The Beast | the beast: down a fourth, up a step, down a step, up a step; ends a third down | The wolf, the troll, the giant and the dragon: the only cell that opens by falling a fourth. |
| `ever` | Ever After | ever after: up a fourth, up a step, down a step, down a third; ends a step up | The ball, the feast and the ending: the longest cell, a reach of a fourth and a slow way home. |

## Why the loops actually loop

A track that is **cut** at a bar line rather than **written** to repeat drops the decay of its last bar.
Even with a sample-perfect loop point, if the music has any reverb or natural decay you hear the seam,
because the tail is missing.

Two things were done about that:

1. **Composed to loop.** The final bar is written to sound *into* the loop point. On all 38 loops the last
   chord is the chord the loop restarts on.
2. **Rendered to loop.** Each track is rendered *past* its loop end, and that decay tail is summed
   back over the head of the loop. The reverb carries across the join instead of being cut at it.

## Engine notes

**RPG Maker MV / MZ** — copy the `.ogg` files into `audio/bgm/`. The loop tags are read
automatically; no plugin and no configuration. Stingers belong in `audio/me/` (victory, defeat)
or `audio/se/`.

**Godot 4** — select the `.ogg`, and in the Import dock tick **Loop** and set **Loop Offset** to the
LOOPSTART figure above divided by 44100 (Godot counts in seconds), then press **Reimport**. Each file
ends exactly at its loop end, so there is no loop-end field to fill.

**Unity** — set the clip to *Streaming* for the long tracks and *Decompress On Load* for the
stingers. Unity has no native loop-point field, so either trim to the loop region or use the
sample values above with a scripted `AudioSource.timeSamples` jump.

**GameMaker** — drop the `.ogg` in as an audio asset. Use the LOOPSTART value with
`audio_sound_loop_start()` (GameMaker counts in seconds; divide by 44100).

**Anything else** — the `.mid` files are plain Standard MIDI Format 1 and will open in any DAW
or tracker.

## How this was verified

No claim here is decorative. The pack ships with the reports that produced these numbers.

| | |
| --- | --- |
| Theory checks | **788 passed, 0 failed** across 44 tracks |
| Audio checks | **510 passed, 0 failed** |
| Distinct keys | 31 |
| Tempo range | 58–150 BPM |
| Instrument palette | 29 instruments across the whole album |
| Slots covered | 44 |
| Theme statements | 1763 across the album |
| Development forms | prime, head, retrograde, inversion, retrogradeInversion, contraction, prime+expansion, retrograde+expansion, expansion |

Every track was checked for key discipline, resolving harmony, voice-leading (no parallel fifths or
octaves between the outer voices), grid alignment, playable instrument ranges, melodic singability,
a varying density curve, and loop-seam continuity. The audio was checked for silence, clipping,
headroom, loudness, and that the loop tags in the **shipped bytes** match the composed loop.

⚠️ **What those numbers are not.** They establish that the music is *technically sound* — correctly
written, correctly rendered, correctly tagged. They are not a claim about taste, and no amount of
them can be. Judge that yourself from the **free three-track preview** — **Hearthside**, **The Witch Queen** and **The Spell Breaks**,
complete tracks with their `.mid` sources, downloadable without paying
from the same itch page you got this from: <https://csaf.itch.io/storybook>

This record is sold on its storybook structure: a music box that opens every full piece and plays nowhere else, and a spell under which
the first theme is heard only upside down. The three free tracks are "Hearthside" (a home scene, the storyteller first), "The Witch
Queen" (the final boss, under the spell, the storyteller upside down too) and "The Spell Breaks" (the theme the right way up again).
Open their .mid files and read the part named storyteller to check it.

## Licence

Royalty-free for commercial and non-commercial games. See `LICENSE.txt` for the exact terms.

---

*Core Systems Asset Factory*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
