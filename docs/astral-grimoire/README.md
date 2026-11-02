# Astral Grimoire: A PC-98 Fantasy RPG Score — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Astral Grimoire: A PC-98 Fantasy RPG Score  
**Engine:** MIDI composition from Node (deterministic, theory-checkable) + rendered OGG via a redistribution-cleared soundfont - engine-agnostic music packs. Renderer + soundfont licence gate is the wing's first architecture decision; see Wings/Music/CLAUDE.md 3.  
**Docs published:** 2026-11-02


---

# ASTRAL GRIMOIRE — A PC-98 FANTASY RPG SCORE
### 44 tracks, 53:53

Core Systems Asset Factory

---

## What this is

Most game-music packs are a **grab-bag**: tracks bought or bundled together that happen to share a
genre. Drop three of them into one project and the player hears the seams — different rooms,
different instruments, different composers.

**This is an album, not a bag.** 44 tracks across 44 slots, written in
one musical language from one family of 5 hand-authored themes. That is not a
description, it is a measurement: the harness reads the finished MIDI back and counts every statement
of every theme in every track — **4,155** of them here — and the
report is in this download. Your game gets a **score**, not a playlist.

## What you get

- **44 × `.ogg`** — OGG Vorbis, 44.1 kHz stereo, ready to drop in
- **44 × `.mid`** — the **editable MIDI sources**. Re-voice them, re-orchestrate
  them, change the tempo, pull out a single line.
- **Sample-accurate loop metadata** — `LOOPSTART` / `LOOPLENGTH` in the OGG Vorbis comments,
  denominated in samples, which is exactly what **RPG Maker MV / MZ** reads
- **Per-engine import notes** (below)
- **A royalty-free licence** for commercial games (see `LICENSE.txt`)

## The channel budget

Every track on this record is written inside the sound budget of a PC-98 computer with the YM2608 (OPNA) sound board: six FM
channels that play one note each, three SSG square-wave channels, and a rhythm section of six drum sounds held in ROM.

- FM1 plays the lead, FM2 the bass, FM3 the counter-line.
- FM4, FM5 and FM6 are the pad: three notes, the whole chord, whenever it plays.
- SSG1 plays the arpeggio: a square wave running up the chord in sixteenths, under the lead.
- The rhythm section plays the drums. SSG2, SSG3 and the ADPCM channel are left empty: they are yours for sound effects.

The build measured every track: at most 7 pitched notes sound at once anywhere on the record, and the lead, the bass,
the counter-line and the arpeggio never sound two notes at once. At every one of the
2840 pad chords on the record the pad plays exactly three notes, the root, third and fifth of the chord named for that bar
(2840 of 2840). `CHANNEL_MAP.md` in this download lists, for each of the 44 tracks, which MIDI track is which
channel and which General MIDI program stands in for it. `channel_budget_proof.json` is the same check run again on the
`.mid` files you received.

## The arpeggio

In the third section of each of the 38 full pieces the SSG arpeggio comes in: four sixteenths a beat, the root, third,
fifth and octave of the chord, placed in the highest octave that keeps it under the lowest note the lead is playing in that
beat. 6684 of its 6684 notes are tones of the chord sounding (all of them). It is the part named `arp`, on MIDI channel 5,
General MIDI Lead 1 (square), program 80 as `CHANNEL_MAP.md` numbers it: the SSG is a square wave. Where the arpeggio plays, the pad moves down below it.
On The Witch Unbound the pad drops out of the third section and the arpeggio carries the chord alone.

## The drums

35 of the 44 tracks carry drums; the prologue, the shrine, the parting and the six cues do not. Every drum
note on the record (16133) is one of the six sounds of the rhythm section: bass drum, rim shot, snare, hi-hat, tom, top cymbal.
In the first section of each loop the bass drum plays under the hi-hat and the rim shot takes the backbeat; in the second
and third sections the snare takes it, with the top cymbal where each begins and a tom fill into the loop point. The
backbeat lands on beats two and four (beat three on the 11 half-time tracks) in every bar: rim shot 525 of 525 bars,
snare 770 of 770. The drums are on MIDI channel 10, the General MIDI drum channel.

On 12 tracks a slap or synth bass plays straight eighths and jumps up an octave on the off-beats (1763 notes). The
build left 1 off-beat down, where the jump would have moved in parallel octaves or fifths with the top voice.

## The harmony

The chord changes every bar. Every full piece tonicises in its second and in its third section: it borrows a major chord a
fifth above one of the key's own chords (a secondary dominant: in C major, D major before G, E major before A minor) and
goes straight to that chord. 98 secondary dominants are declared on the record; the build checked that each one moves to
its target (98 of 98) and that all three of its tones sound, the raised third included (98 of 98).
Every one of the 10 major-key full pieces opens its second section on IV, V, iii, vi: the chord loop Japanese pop calls
the royal road.

### Instruments

Every sound is a General MIDI program rendered through the GeneralUser GS soundfont: synth leads, electric pianos, slap and
synth basses, synth brass, a distortion guitar, mallets, synth strings and pads, a few acoustic winds and brass, chosen for
the FM idiom. The `.ogg` files are a reference render: they are not FM synthesis and not chip emulation. The `.mid` files
are the real sources: load them into an FM tracker or sound driver, or into your own instruments, with `CHANNEL_MAP.md`
beside you. No game cue or song is quoted anywhere on this record; every tune on it was composed for it.

## Track list

| # | Title | Slot | Key | BPM | Length | LOOPSTART / LOOPLENGTH |
| --- | --- | --- | --- | --- | --- | --- |
|  1 | Astral Grimoire | Title / main theme | D ionian | 132 | 1:11 | 160364 / 2966727 |
|  2 | Prologue: The Fallen Star | Prologue | A aeolian | 84 | 1:54 | 378000 / 4662000 |
|  3 | Name Entry | Menu | F ionian | 108 | 1:27 | 196000 / 3626000 |
|  4 | Lumen Town | Town / village | G ionian | 112 | 1:24 | 189000 / 3496500 |
|  5 | Harbour of Tides | Harbour | C mixolydian | 118 | 1:19 | 179390 / 3318712 |
|  6 | Academy of the Seven Stars | Academy | E ionian | 104 | 1:30 | 203538 / 3765462 |
|  7 | Night Market | Town at night | D dorian | 100 | 1:34 | 211680 / 3916080 |
|  8 | Over the Green Hills | Field / overworld | C ionian | 128 | 1:13 | 165375 / 3059438 |
|  9 | Field Under Two Moons | Field at night | B dorian | 96 | 1:38 | 220500 / 4079250 |
| 10 | The Whispering Wood | Forest | E mixolydian | 104 | 1:30 | 203538 / 3765462 |
| 11 | Crystal Cavern | Cave | F# aeolian | 80 | 2:00 | 396900 / 4895100 |
| 12 | Desert of Glass | Desert | E harmonic minor | 116 | 1:21 | 182483 / 3375931 |
| 13 | The Frozen Pass | Mountain pass | G dorian | 108 | 1:27 | 196000 / 3626000 |
| 14 | The Sky Ship Aurora | Airship | D mixolydian | 136 | 1:09 | 155647 / 2879471 |
| 15 | The Sunken Library | Library | C aeolian | 92 | 1:42 | 230087 / 4256609 |
| 16 | Tower of the Magus | Tower | B harmonic minor | 120 | 1:18 | 176400 / 3263400 |
| 17 | Ruins of the First Kingdom | Ruins | A dorian | 100 | 1:34 | 211680 / 3916080 |
| 18 | The Demon Labyrinth | Dungeon | D harmonic minor | 128 | 1:13 | 165375 / 3059438 |
| 19 | Castle of the Witch | Castle | G aeolian | 112 | 1:24 | 189000 / 3496500 |
| 20 | Shrine of the Moon Maiden | Sanctuary | E dorian | 88 | 1:49 | 360818 / 4450091 |
| 21 | The Inn by the Old Gate | Inn / rest | F ionian | 96 | 1:38 | 220500 / 4079250 |
| 22 | Item Shop | Shop | A mixolydian | 124 | 1:15 | 170710 / 3158129 |
| 23 | Guild Hall | Guild hall | A# ionian | 120 | 1:18 | 176400 / 3263400 |
| 24 | Theme of the Heroine | Character theme | E ionian | 92 | 1:42 | 230087 / 4256609 |
| 25 | The Rival Swordsman | Rival | C# dorian | 132 | 1:11 | 160364 / 2966727 |
| 26 | The Witch of the Astral Gate | Villain | F harmonic minor | 104 | 1:30 | 203538 / 3765462 |
| 27 | Battle | Battle | A aeolian | 152 | 1:02 | 139263 / 2576369 |
| 28 | Elite Foes | Elite battle | E dorian | 160 | 0:59 | 132300 / 2447550 |
| 29 | Desperate Fight | Desperate battle | G harmonic minor | 168 | 0:56 | 126000 / 2331000 |
| 30 | The Guardian | Boss | C harmonic minor | 144 | 1:05 | 147000 / 2719500 |
| 31 | Duel with the Rival | Duel | D aeolian | 156 | 1:00 | 135692 / 2510308 |
| 32 | The Witch Unbound | Final boss | A harmonic minor | 148 | 1:03 | 143027 / 2646000 |
| 33 | Astral Wrath | Final boss, second form | F# aeolian | 172 | 0:54 | 123070 / 2276790 |
| 34 | Parting at Dawn | Sorrow | D aeolian | 72 | 2:13 | 441000 / 5439000 |
| 35 | Flight from the Castle | Escape | D# harmonic minor | 164 | 0:57 | 129073 / 2387854 |
| 36 | Starfall | Finale / whole cast | C ionian | 116 | 1:21 | 182483 / 3375931 |
| 37 | Epilogue: Home Again | Ending | G ionian | 100 | 1:34 | 211680 / 3916080 |
| 38 | Staff Roll | Credits | F mixolydian | 124 | 1:15 | 170710 / 3158129 |
| 39 | Victory Fanfare | Victory stinger | C ionian | 132 | 0:12 | one-shot |
| 40 | Game Over | Defeat stinger | A harmonic minor | 72 | 0:23 | one-shot |
| 41 | Level Up | Level-up stinger | F ionian | 140 | 0:10 | one-shot |
| 42 | Item Get | Item | G mixolydian | 150 | 0:12 | one-shot |
| 43 | Rest at the Inn | Rest stinger | D ionian | 84 | 0:18 | one-shot |
| 44 | Danger | Alert | E harmonic minor | 144 | 0:12 | one-shot |

## The theme family

Everything here grows from **5 hand-authored themes**, one seed and four things done to it:
`star` climbs a step and a third on a quick pair, lifts and falls back: the hero.
`veil` is the seed turned over, on the same rhythm, for the witch: her tower, her labyrinth, her castle.
`wind` runs up three steps in eighths and turns, for the road. `tear` holds and sighs, for the cave, the
library and the parting. `blade` leaps a fourth in sixteenths, for the battles, the rival and the escape.
Building a family of themes from one cell is an old composer's method and is not claimed as new here; what
this record adds is the PC-98 channel budget (six FM voices with a full-triad pad, one SSG arpeggio, six
rhythm sounds) and a secondary dominant in every full piece, each checked in the shipped MIDI.
Every track states at least one of them — in its original form, inverted, backwards, widened or
compressed.

| id | Theme | Built from | Role |
| --- | --- | --- | --- |
| `star` | Star | the seed: up a step, up a third, up a step, down a third; ends a third up | The hero, the title, the towns and the ending: two quick notes that climb, a dotted lift and a fall back, on the push rhythm of that era's melodies. Stated in its own shape in every track. |
| `veil` | Veil | the seed turned over: down a step, down a third, down a step, up a third; ends a third down | The witch and her works: the tower, the labyrinth, the castle, the guardian and the witch herself. The seed inverted, on the same rhythm. |
| `wind` | Wind | the road: up a step, up a step, up a step, down a third; ends a step up | The journey: the hills, the harbour, the market, the desert, the pass, the sky ship, the shop and the guild. Running eighths that climb three steps and turn. |
| `tear` | Tear | the lament: down a step, up a third, down a step, down a third; ends a third down | The quiet: the prologue, the cave, the library, the ruins, the shrine and the parting. A held note that sighs down a step; the only cell that opens on a dotted quarter note. |
| `blade` | Blade | the fight: up a fourth, down a step, down a step, up a third; ends a fourth up | The fight: the battle set, the rival, the duel, the escape and the second form. A leap of a fourth in sixteenths; the only cell that ends a fourth higher. |

## Why the loops actually loop

A track that is **cut** at a bar line rather than **written** to repeat drops the decay of its last bar.
Even with a sample-perfect loop point, if the music has any reverb or natural decay you hear the seam,
because the tail is missing.

Two things were done about that:

1. **Composed to loop.** The final bar is written to sound *into* the loop point, and the harmony
   resolves onto the chord the loop restarts on.
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
| Tempo range | 72–172 BPM |
| Instrument palette | 32 instruments across the whole album |
| Slots covered | 44 |
| Theme statements | 4155 across the album |
| Development forms | prime, retrograde, contraction, head, inversion, retrogradeInversion |

Every track was checked for key discipline, resolving harmony, voice-leading (no parallel fifths or
octaves between the outer voices), grid alignment, playable instrument ranges, melodic singability,
a varying density curve, and loop-seam continuity. The audio was checked for silence, clipping,
headroom, loudness, and that the loop tags in the **shipped bytes** match the composed loop.

⚠️ **What those numbers are not.** They establish that the music is *technically sound* — correctly
written, correctly rendered, correctly tagged. They are not a claim about taste, and no amount of
them can be. Judge that yourself from the **free three-track preview** — **Lumen Town**, **Battle** and **The Witch Unbound**,
complete tracks with their `.mid` sources, downloadable without paying
from the same itch page you got this from: <https://csaf.itch.io/astral-grimoire>

This record is sold on one theme heard in every track of one fantasy RPG, written to the PC-98 sound
board budget: six FM voices, one SSG arpeggio, six rhythm sounds. The three free tracks are "Lumen Town"
(a town), "Battle" and "The Witch Unbound" (the final boss). Open any .mid and count the voices: the lead,
the bass and the counter-line play one note at a time, the pad three, the arpeggio one, the drums sit on
channel 10. The full pack's CHANNEL_MAP.md maps every part of every track to its channel.

## Licence

Royalty-free for commercial and non-commercial games. See `LICENSE.txt` for the exact terms.

---

*Core Systems Asset Factory*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
