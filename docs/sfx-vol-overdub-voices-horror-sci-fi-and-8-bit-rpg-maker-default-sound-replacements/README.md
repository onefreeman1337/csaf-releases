# Overdub Voices: RPG Maker MZ and MV Default Sound Replacement in Three Styles (Horror, Sci-Fi, 8-Bit) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Overdub Voices: RPG Maker MZ and MV Default Sound Replacement in Three Styles (Horror, Sci-Fi, 8-Bit)  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Store page:** https://csaf.itch.io/overdub-voices-rpg-maker-mz-default-sound-replacement  
**Docs published:** 2026-11-18


---

# Overdub Voices: RPG Maker MZ and MV Default Sound Replacement in Three Styles

**Three complete replacements of the 137 default sound effects a new RPG Maker MZ project plays: Horror, Sci-Fi and 8-Bit, each under the
engine's own file names.** Pick the folder that fits your game, copy its `ogg` files over `audio/se`, and the whole default database changes voice.
No database edits, no plugin.

- **Horror/** Overdub Horror: rusted iron, wet stone and breath in a flooded cellar. 139 files (137 MZ names plus the MV names Save and Load).
- **SciFi/** Overdub Sci-Fi: glass, servo and plasma aboard a ship. 139 files (137 MZ names plus the MV names Save and Load).
- **EightBit/** Overdub 8-Bit: a modelled 8 bit sound chip: two pulse channels, a triangle and a noise channel. 139 files (137 MZ names plus the MV names Save and Load).

417 files in all (411 MZ names across the three voices, plus Save and Load in each). Each folder has its own `Readme_for_Users.md` (how to drop it in
and restore the defaults), `MANIFEST.md` (every name, where the database uses it, length and brightness), `pack.json`, `pack_proof.json` and `LICENSE.txt`.

Use **one voice per project**: the three folders share file names, so copying two of them into one `audio/se` leaves whichever you copied last.

Every set was tested in RPG Maker MZ's own runtime code (Horror 478/478, Sci-Fi 478/478, 8-Bit 478/478 buffers decoded) and measured against the original Overdub
and against each other so that no file is a transposed copy. Signal measurements only; nobody has judged how they sound. Listen to the free demo first.

Royalty free, commercial use, no credit required (`LICENSE.txt`). Every sound was made from scratch by a program; no audio from RPG Maker or any other
source was used. The code was written with AI assistance; no generative audio model was used. Not affiliated with or endorsed by the makers of RPG Maker.

*Overdub Voices: RPG Maker MZ and MV Default Sound Replacement in Three Styles* · Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
