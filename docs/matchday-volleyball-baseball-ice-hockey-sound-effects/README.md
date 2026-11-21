# Matchday: 367 Sports Sound Effects — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Matchday: 367 Sports Sound Effects  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-21


---

# Matchday: Volleyball, Baseball and Ice Hockey Sound Effects in Three Packs

**367 sound effects in 3 kits, WAV and OGG, for any game engine: Volleyball (118 sounds, indoor and beach volleyball), Baseball (122 sounds, baseball) and Ice Hockey (127 sounds, ice hockey).**

Three sports, each as the plays a game scores: volleyball in a hall and on the beach, baseball on an open diamond, ice hockey in an arena, each with its own acoustic language and its own ladders a game can map to a power value. Each pack is complete in its own folder, with its own Readme, licence, naming manifest and proof, so you can copy one folder into a project and leave the others.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio, no generative audio model. Nothing here is musical.

## The kits

| Folder | Kit | Sounds | Loops |
|---|---|---|---|
| `Volleyball/` | Volleyball: Court and Beach Sound Effects | 118 | 7 |
| `Baseball/` | Baseball: Diamond Sound Effects | 122 | 8 |
| `IceHockey/` | Ice Hockey: Rink Sound Effects | 127 | 12 |
| | **Total** | **367** | **27** |

**Volleyball**: Volleyball is a sprung hardwood hall and an open beach. One ball body is struck on every touch, by hands that make it brighter as they hit harder. The serve and the attack are ladders a game can map to its power value; the ball on a surface is a grid (surface by power), so a game changes one word in a file name when a dig lands on the sand instead of the floor; the cart, the winch and the pump start, run as seamless loops and stop.

**Baseball**: Baseball is an open ballpark: dry outdoor air, ash and alloy, leather, dirt and grass. The bat is a grid (wood or metal by contact, from a bunt to a home run), so a game picks the file from its own hit quality, and the bat, the pitch, the glove and the swing are ladders a game can map to a power or speed value; the pitching machine and the tarp start, run as seamless loops and stop.

**Ice Hockey**: Ice Hockey is an indoor arena: ice, boards, glass and one hard hall. Skating, the shot, the pass and the check are ladders a game can map to its speed or power value; the puck is a grid (surface by power), so a game changes one word in a file name when a shot rings the post instead of the glass; the resurfacer and the sharpener start, run as seamless loops and stop.

## Licence, the short version

**Royalty free. Commercial use. No attribution required.** Full terms in `LICENSE.txt` (each kit folder carries the same terms). Credit line, if you want one:

```
Sound effects: "Matchday" by Core Systems Asset Factory
```

## Proof

Each kit's `pack_proof.json` carries a sha256 and a full measurement record for every file: **3,363** signal checks across the three kits, 0 failed. They measure signal, not taste; listen to the free demo first.

*Core Systems Asset Factory · Matchday: Volleyball, Baseball and Ice Hockey Sound Effects in Three Packs · 367 sounds*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
