# CLOISTERFALL — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** CLOISTERFALL  
**Engine:** Hand-written HTML5 (Canvas + vanilla JS) — browser-native, no runtime to license. GameMaker only if its HTML5 module ever installs (licence grants it; module absent, Igor refused twice with "Signature is invalid"). RPG Maker MZ is BARRED for shipping: CLAUDE.md §8.5 forbids redistributing the Kadokawa runtime, and an itch upload is redistribution.  
**Docs published:** 2026-11-10


---

# CLOISTERFALL

A gothic side-view action-platformer. The abbey fell in one night, and its hunter comes home at dusk to fight down through the Cloister, the Ossuary beneath it and the Undercroft below that. Every blow a foe or a boss throws is shown before it lands: a wind-up, a red mark on the floor, a line. Knockback never carries you over a ledge or into a hazard, and a hit always gives you a moment of safety.

20 rooms over three areas, 3 bosses (the Stone Colossus, the Wendigo, the Demon Lord) and 3 relics that open the doors you have already seen: the Matins Bell (ring it to stun foes, open bell gates and break a boss's wind-up), the Rook Feather (a second jump in the air) and the Vigil Lantern (it shows false walls and lets you through them).

## How to play

Unzip the folder anywhere and run `CLOISTERFALL.exe`. There is no installer. Your save and settings are kept in the app's own data folder under your Windows user profile (the app framework also keeps its cache there); delete that folder to remove them.

| action | keyboard | gamepad |
| --- | --- | --- |
| move, climb | arrow keys or WASD | left stick or d-pad |
| jump (hold for height) | Z, Space or K | A |
| axe (press again to chain three) | X or J | X |
| dash | C, Shift or L | B |
| ring the Matins Bell (once you have it) | V, E or I | Y |
| pause | Esc or P | Start |
| map | Tab | Select |
| mute | M | |

Touch screens: the left half of the screen is a stick; JUMP, AXE, DASH and BELL are on the right.

## Tips

- A foe that is winding up shows a red diamond and a red strip on the floor where it will strike. Step out, or hit it while it recovers.
- Bosses brace through a wind-up: your axe barely marks them then. Ring the Matins Bell DURING a wind-up and it breaks them open.
- Shrines (three candles on a plinth) heal you and are where you wake after a fall in battle.
- The map (Tab / Select) pins every door you have seen with the icon of the relic it needs: a red ring until you have it, green once you do.

## Saving

The game saves at every shrine and when a boss falls. Continue from the title screen.

## How CLOISTERFALL was made (AI disclosure)

- **Code and writing:** made with AI.
- **Art (sprites, tiles, effects, type):** AI-generated asset packs of our own, listed in CREDITS_AND_MEDIA_LICENCES.md. Every warning (the red
  diamonds and floor marks of a wind-up, a bat's target ring, an archer's sight line, a boss's landing zone, pillars and shockwave lines),
  the light, the map and the bell gates are drawn by the game's own code.
- **Music:** our own scores, composed as MIDI by our own composition code and synthesized with FluidSynth through the GeneralUser GS
  soundfont, whose licence permits commercial recordings. No generative audio model.
- **Sound effects:** our own packs made by procedural synthesis. No generative audio model.

Made by Core Systems Asset Factory. Licence: LICENSE.txt. Credits and media licences: CREDITS_AND_MEDIA_LICENCES.md.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
