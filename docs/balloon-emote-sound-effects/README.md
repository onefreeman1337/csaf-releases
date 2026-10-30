# Balloon: 120 Emote Sound Effects — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Balloon: 120 Emote Sound Effects  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-10-30


---

# Balloon: 120 Emote Sound Effects

**120 emote sound effects in WAV and OGG for any game engine, with a small RPG Maker MZ plugin. One cue for each speech balloon a character pops over its head: the ten stock RPG Maker balloons (exclamation, question, music note, heart, anger, sweat, frustration, silence, light bulb, Zzz) plus surprise, sparkle, gloom and blush, each played by 4 matched voices (Soft cozy, Retro chip, Anime, Wood and paper), two takes of every cue, and a balloon pop in and pop out per voice.**

Balloon is one idea. An emote is a gesture and a voice is an instrument: a question rises and hangs, gloom sags, silence is three small
dots, and the voice decides what makes the sound. Pick one voice and every balloon in your game speaks the same language.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio of any
kind. These are not voices: there are no syllables and no spoken reactions. Nothing here is musical: the music note cue is one pitch
skipped three times, never a tune.

---

## What is in the box

| | |
|---|---|
| Sounds | **120** |
| Emotes | 14 (ids 1 to 14) |
| Voices | 4 (Soft cozy, Retro chip, Anime, Wood and paper) |
| Takes per cue | 2 |
| Balloon pops | 8 (in and out, per voice) |
| Formats | `.wav` (16 bit, 44.1 kHz, mono) **and** `.ogg` |
| Total files | 240 (120 wav + 120 ogg) |
| Plugin | `plugin/CSAF_BalloonCues.js` for RPG Maker MZ |
| Variation sets | 56 |
| Total audio | 1 min 0 s |
| Shortest / longest | 102 ms / 1.16 s |

## What the download contains

```
wav/                   120 files, 16 bit 44.1 kHz mono
ogg/                   120 files, Vorbis
plugin/                CSAF_BalloonCues.js, the RPG Maker MZ plugin
Readme_for_Users.md    this file
NAMING_MANIFEST.md     every file, its emote, voice, take, measured duration and brightness
LICENSE.txt            the full licence
pack.json              the machine readable manifest (emotes, voices, the grid, variation sets)
pack_proof.json        a sha256 and a full measurement record for every file
plugin_proof.json      what the plugin was tested on and what was checked
cross_pack_proof.json  the measurement that no file here is a transposed copy of a file in the studio's nearest packs
```

## Licence, the short version

**Royalty free. Commercial use. No attribution required.**

Use these sounds in any number of commercial and non commercial games, on any platform, forever. You may modify them freely.
The only thing you may not do is resell or redistribute the pack itself (or a repackaged subset of it) as a sound library or
asset pack. The plugin is free to ship inside your game under the same terms.

Full terms in `LICENSE.txt`. If you would like to credit it anyway, this line is enough:

```
Sound effects: "Balloon: 120 Emote Sound Effects" by Core Systems Asset Factory
```

---

## The groups

| Group | Files |
|---|---|
| **Exclamation** | 8 |
| **Question** | 8 |
| **Music note** | 8 |
| **Heart** | 8 |
| **Anger** | 8 |
| **Sweat** | 8 |
| **Frustration** | 8 |
| **Silence** | 8 |
| **Light bulb** | 8 |
| **Zzz** | 8 |
| **Surprise** | 8 |
| **Sparkle** | 8 |
| **Gloom** | 8 |
| **Blush** | 8 |
| **Balloon pop** | 8 |

## The emotes

| Id | Emote | The gesture | File |
|---|---|---|---|
| 1 | Exclamation | a hard stab that leaps up | `balloon_01_exclamation_<voice>_01` and `_02` |
| 2 | Question | a slow rise that hangs on its top | `balloon_02_question_<voice>_01` and `_02` |
| 3 | Music note | one pitch skipped three times, never a tune | `balloon_03_note_<voice>_01` and `_02` |
| 4 | Heart | two soft round beats, the second lower | `balloon_04_heart_<voice>_01` and `_02` |
| 5 | Anger | a rough low flutter that boils up and pops | `balloon_05_anger_<voice>_01` and `_02` |
| 6 | Sweat | one drop: a quick bend up, then a small plip after | `balloon_06_sweat_<voice>_01` and `_02` |
| 7 | Frustration | an erratic scribble that tangles and gives up | `balloon_07_frustration_<voice>_01` and `_02` |
| 8 | Silence | three small dots at the pace the balloon draws them | `balloon_08_silence_<voice>_01` and `_02` |
| 9 | Light bulb | a filament tick, then a bright ring | `balloon_09_bulb_<voice>_01` and `_02` |
| 10 | Zzz | a long low breath that swells and sinks | `balloon_10_zzz_<voice>_01` and `_02` |
| 11 | Surprise | a wide fast whoop up, cut off at the top | `balloon_11_surprise_<voice>_01` and `_02` |
| 12 | Sparkle | a scatter of tiny high glints | `balloon_12_sparkle_<voice>_01` and `_02` |
| 13 | Gloom | a slow dark sag that keeps falling | `balloon_13_gloom_<voice>_01` and `_02` |
| 14 | Blush | a soft warm flush that rises and fades, no attack | `balloon_14_blush_<voice>_01` and `_02` |

Ids 1 to 10 follow the rows of the stock RPG Maker MZ balloon sheet, so the number in the file name is the id a Show Balloon Icon
event uses. Rows 11 to 15 of that sheet are empty: ids 11 to 14 are yours to draw art for, or to use as plain reaction sounds. Id 15
has no cue. In any other engine the id is only a label: use the files however your emote system fires them.

## The voices

| Voice | File name word | What makes the sound |
|---|---|---|
| Soft cozy | `cozy` | felted mallet tones and a soft breath, in a small warm room |
| Retro chip | `chip` | a pulse wave and a noise channel, stepped pitch, bone dry |
| Anime | `anime` | a slide whistle with breath in it and glass glints |
| Wood and paper | `wood` | a wooden ratchet, a wood block and paper rustle, dry and close |

Every gesture is played on every instrument. The gate compares every pair of cells that differs in one coordinate (at least
**9%** apart in brightness or **18%** in length): **448** pairs compared, indistinct: **0**.

A separate check reads the shipped files and confirms the gesture survives the instrument, in every voice and take: question, surprise, exclamation, sweat all end brighter than they start, gloom ends darker than it starts, the heart has two beats, the music note has three skips, and silence has three dots (take 1 of the cozy voice measures 261 ms between its first two).

## The RPG Maker MZ plugin

The engine draws a balloon and makes no sound, so normally every Show Balloon Icon command needs a Play SE command beside it.
With the plugin on, every balloon plays its cue by itself, including balloons from other plugins that call `$gameTemp.requestBalloon`.

1. Copy the contents of the `ogg` folder into your project's `audio/se` folder.
2. Copy `plugin/CSAF_BalloonCues.js` into `js/plugins` and turn it on in the Plugin Manager.
3. Choose a **Voice**. That is the whole setup.

| Parameter | What it does | Default |
|---|---|---|
| Voice | the instrument every balloon uses (`cozy`, `chip`, `anime`, `wood`) | `cozy` |
| Volume | as in a Play SE command | 90 |
| Pitch | as in a Play SE command | 100 |
| Preload the voice | loads the voice when a map starts, so the first balloon is not late | on |
| Balloon ids with a cue | a list or a range, the rest stay silent | `1-14` |
| Takes per cue | alternates takes per id | 2 |

- **Plugin command Set voice** changes the voice for everything without a note tag. It is kept in the save file.
- **Plugin command Set enabled** turns the cues off and on, for a scene that scores its own balloons. Also kept in the save file.
- **Note tag** `<balloonVoice:chip>` in a map event's Note box gives that one character its own voice. A tag naming no known voice is ignored.

Tested in the MZ 1.10.0 runtime in a fresh project: **112** id and voice cells through the engine's own Show Balloon Icon
command, in both of its ogg decoders, **0** problems (`plugin_proof.json` lists what was checked).

**If you deploy with "Exclude unused files":** the plugin builds file names at run time, so check that `audio/se` in the output still
holds the `balloon_` files, and copy them in by hand if not. The MZ editor's deployer was not available to test here, so treat this as a step to check.

## Every cue fits the balloon

A stock balloon is on screen for 76 frames, 1.27 s at 60 frames a second (`Sprite_Balloon`: 8 frames of 8 ticks, then 12 ticks of hold).
The longest file here is 1.16 s, and a separate check reads the length of every cue against that figure.

## Avoiding repetition

56 cues ship as **variation sets** of two takes: separate renders, not copies of one file. Alternate them, or play a random member
each time. Measured across all 56 sets on the shipped files: brightness differs between takes by 6% to 33%, and length by 12% to 26%.

## One level

Every file is normalised to one loudness target. The measured inner loudness range (10th to 90th percentile) across all 120 files is
**0.87 dB**, so swapping the voice or the emote needs no gain riding.

## Import notes

**Unity**: drop the `ogg` folder into `Assets/`. Hold each cue's two takes in an `AudioClip[]` and pick the one that did not play last, then
`AudioSource.PlayOneShot(clip)`.

**Unreal**: import the `wav` folder. For each cue, make a Sound Cue with a **Random** node over its two takes.

**Godot**: import the `wav` folder. Every file is a one shot and imports with *Loop* off under default settings. Put each cue's takes in an `AudioStreamRandomizer` (Godot 4) with *Playback Mode* set to *Random (Avoid Repeats)*.

**GameMaker**: import the `ogg` folder as sounds. Build a name with
`"balloon_05_anger_" + voice + "_01"` and resolve it with `asset_get_index`.

**RPG Maker MV / MZ**: use the `ogg` files in `audio/se`. On MZ use the plugin above, or a Play SE command beside each balloon. The plugin is MZ only; on MV use Play SE.

**Web / HTML5**: use the `ogg` files.

## Proof

`pack_proof.json` ships with the pack. It carries a **sha256 for every audio file** and the full measurement record (peak, RMS,
duration, spectral centroid, edge trim) behind **1089 signal checks, 0 of which failed**. You can re hash any file and check
it against the proof.

`cross_pack_proof.json` is for owners of the studio's other packs: every file here was compared against every file in the 6 nearest
packs on our shelf (Blip, Blip02, Babble, Tally, Akatsuki, Hearthlight: **145680** pairs) on spectral shape and on envelope, each tolerant of a transposition, and
**145680** of 145680 measure as separate sounds: no file here is one of theirs at another pitch.

## Honest limits

- These are **synthesised** sounds made in code: stylised cues, not recordings of real objects. The wood and paper voice is a wooden
  ratchet, a wood block and paper friction made from models of those things.
- There are no voices: no gasps, sighs, laughs or spoken reactions. There is no music: no cue carries a tune.
- Two takes per cue reduces repetition; it does not remove it. A room full of characters all saying the same thing at once will
  still repeat.
- The proof files measure **signal**, not taste. They certify there is no measurable defect: no clipping, no silence, no abrupt
  edges, no grid cell that duplicates its neighbour. They do not, and cannot, tell you the pack sounds good to you. Listen to the
  free demo first; that is what it is for.

---

*Core Systems Asset Factory · pack version 1.0.0 · 120 sounds · 1089 checks passed*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
