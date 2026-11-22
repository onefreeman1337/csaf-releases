# Byplay — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Byplay  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-22


---

# Byplay v1.0.0 for RPG Maker MZ

By Core Systems Asset Factory (https://csaf.itch.io).

The acting a walking sprite cannot do, in three parts and 10 plugin files: one-shot reactions a message can trigger as
its line prints, moods a character holds while it stands, and a whole room answering a line together. Every drawing is
made from each character's **own walking sheet**, in its own colours, in all four facings, the first time it is needed.
No pose art to draw, for the hero, the followers or any event.

| Part | What it does in your game | Files |
| --- | --- | --- |
| **Byplay Reactions** | **Fifteen reactions** on any walking sprite: nod, head shake, shrug, facepalm, think, point, beckon, clap, salute, pray, bow, sob, laugh, scratch, cower. The arms are redrawn bent at the elbow in the character's own sleeve and skin colours, with the hand on a spot measured on that figure (the eyes, the chin, the brow, the chest, the crown, the belly). Play one from a message with `\BYP[shrug]`, a plugin command or a script call. | `ByplayReactionsCore.js` + `ByplayReactions.js` + the four shared cores |
| **Byplay Moods** | **Ten moods** a character holds while it stands: sulking, proud, nervous, furious, grieving, lovestruck, guarded, giddy, shivering, bored. Each has a small loop that keeps it alive (a huff, a fidget, a bounce, a sigh). Put `<Mood: sulking>` in a comment on an event page or in the event's Note, or `\BYM[giddy]` in a message. A mood is kept in the save file. | `ByplayMoodsCore.js` + `ByplayMoods.js` + the four shared cores |
| **Byplay Company** | **A whole room answers together.** Ten cues (agree, disagree, applaud, gasp, laugh, mourn, murmur, salute, welcome, turn): the nearest people react first, the reaction travels outward, and each person does their own share of it (twelve people agreeing are exactly nine nods and three claps). They turn to face whoever spoke before they react. `\BYC[gasp]` in a message, or a plugin command. | `ByplayCompanyCore.js` + `ByplayCompany.js` + Byplay Reactions' two files + the four shared cores |

The four shared cores (`PostureCore.js`, `KnackCore.js`, `StrideCore.js`, `StrideIdleCore.js`) are used by all three
parts, and Byplay Company plays every room through Byplay Reactions' two files. This download carries one copy of each.
Reactions and Moods each work on their own; Company needs Reactions' two files.

## Install

1. Copy every file in this download's `js/plugins/` folder into your project's `js/plugins/` folder.
2. Open the Plugin Manager, add an entry for each file of the part or parts you want, and turn it ON: Reactions needs
   its two files and the four cores; Moods its two files and the four cores; Company its two files, Reactions' two files
   and the four cores. Any order works; this order reads best: PostureCore, KnackCore, StrideCore, StrideIdleCore,
   ByplayReactionsCore, ByplayReactions, ByplayMoodsCore, ByplayMoods, ByplayCompanyCore, ByplayCompany.
3. Nothing to mark on the map: any event with a walking sheet can react and join a room, and the player and followers
   can react too (they join a room only with Company's "Party joins in" setting). A mood starts from a tag, a message
   code or a plugin command.
4. In a message: `\BYM[giddy]We won?\BYP[clap] We WON!\BYC[applaud]`. Each code acts on the event that is running the
   message (for a room: the room around it). Add a second number for someone else: `-1` the player, `-2` to `-4` the
   followers, `5` event 5. A message run by an invisible trigger event acts on that event, so name the speaker by number.

Every part's full guide (parameters, tags, plugin commands, limits) is in the `Guides/` folder:
`Guides/Byplay_Reactions.md`, `Guides/Byplay_Moods.md`, `Guides/Byplay_Company.md`.

## Using the three together

Measured in the engine with all 10 files ON, in a blank RPG Maker MZ project on MZ's own database and map, every
parameter at its default. The scene: a speaker and eight townsfolk on MZ's own People1 and People2 sheets, four of them
carrying a mood tag (two in a page comment, one in the event's Note, one beside `<Company: listen>`).

- **Moods from tags.** Once the map had opened, the four tagged townsfolk held their moods and showed them.
- **A room reacts over held moods.** The room agreed: all eight turned to the speaker and reacted. The four holding a
  mood showed their mood or their reaction on every frame of it, never the plain walking sprite, and held the same
  mood afterwards.
- **All three codes in one line.** `\BYM[giddy]\BYP[shrug]Fine, then. Go!\BYC[gasp]`, run by MZ's own message
  window: the listener turned as the message opened, the speaker took the mood and shrugged as the line began, and the
  room gasped when the text reached the code. A second line, `\BYM[proud,-1]`, gave the player a mood.
- **One save carries the moods:** after a save and a load the player, the speaker and the four tagged townsfolk all
  held their moods. A reaction and a room are moments: neither writes anything to the save file.
- **Turn Moods or Company off and the other two still work; turn Reactions off and Moods still works, but Company goes
  quiet.** The same save loads with any one part removed. Without Moods, nobody shows a mood and the room still reacts.
  Without Company, moods still hold and a single reaction still plays over a mood, which comes back with no plain frame
  between. Without Reactions, Company says once in the console that `ByplayReactions.js` is not loaded and plays
  nothing, and moods still hold.
- **Uninstall:** with every file removed, the same save loads and the map runs.
- **Plugin order does not change the main result:** the moods, the room, the three codes and the save checks pass
  with the files in the order above, in reverse order and in a shuffled order (the part-removal and uninstall checks
  ran in the order above).
- Thirteen engine methods, and Stride Idle's own `csafIdleFrame`, are extended by more than one file (among them
  `Game_CharacterBase.prototype.update`, `Scene_Map.prototype.start`, `Window_Base.prototype.processEscapeCharacter`
  and the `Sprite_Character` frame methods). Each file saves the original and calls it, so every part's addition runs.
- **Frame cost with all three acting at once:** a speaker and a hall of twelve, seven of the thirteen holding moods,
  the room cued every 100 frames and the speaker changing mood and reacting between cues: over 300 measured frames of
  that scene the studio's frame gate passed with **9** draw calls a frame, inside the 60 it allows.

## Compatibility

- RPG Maker MZ. Tested on the MZ 1.10.0 runtime only.
- Tested with only these plugins loaded. No VisuStella plugin was loaded in these tests. Message plugins that keep MZ's
  own escape-code handling (MZ's message window does) pass the three codes through; VisuStella Message Core was not
  tested in the engine.
- No part ships an image, a font or a sound file. Every drawing is built in code from your own project's walking
  sheets, in their own colours, and nothing is resampled or blended.
- The characters and the ground in the store images are CSAF test art and are **not included**. The reactions, moods
  and room reactions in them are what the plugins draw from those sheets; in your game they are drawn from **your**
  sheets.
- If you also own Posture, Knack, Stride, Stride Idle, Rally, Rearguard or the MZ Plugin Library: keep ONE copy of
  each shared file. They are the same files, byte for byte.

## Versions

Byplay Reactions 1.0.0, Byplay Moods 1.0.0, Byplay Company 1.0.0.

## Already own the MZ Plugin Library?

All three parts are also inside the MZ Plugin Library (https://csaf.itch.io/mz-plugin-library), byte for byte the
same files. If you own the Library, you already have Byplay.

## Licence

See `LICENSE.txt`. This product was made with AI tools: the code was produced with AI assistance, everything it draws
in your game is drawn by that AI-written code from your own walking sprites, and the store images were made with AI
tools too.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
