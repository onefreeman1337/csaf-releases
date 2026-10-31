# LAST CART OUT — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** LAST CART OUT  
**Engine:** Hand-written HTML5 (Canvas + vanilla JS) — browser-native, no runtime to license. GameMaker only if its HTML5 module ever installs (licence grants it; module absent, Igor refused twice with "Signature is invalid"). RPG Maker MZ is BARRED for shipping: CLAUDE.md §8.5 forbids redistributing the Kadokawa runtime, and an itch upload is redistribution.  
**Docs published:** 2026-10-31


---

# LAST CART OUT

A mine cart action game for phones and browsers, made for Slapjam #2 (theme: Speed). The mine is coming down behind you and this is the last cart.

## How to play

- **Hold** anywhere to drive. **Let go** to brake.
- **Slide your thumb** to lean. Leaning into a bend lets you take it faster, and the gold on the inside of a bend is only reachable if you lean for it.
- A **red number** is the bend ahead. Go in faster than that and the cart tips onto two wheels. Stay over it and it derails.
- A **blue number** is a gap in the rail. Hit the lip slower than that and you fall in.
- The **fuse along the top** is your lead on the collapse. When the spark reaches the cart, you are buried.
- A number under the plaque, marked THEN, is the bend that comes straight after.
- A death puts you back at the gate of the level you were on.

## Keys and pads

- Keyboard: Space, Up or W to drive; Left and Right, or A and D, to lean; Esc or P to pause; M for sound.
- Mouse: hold a button to drive, drag to lean.
- Gamepad: A or a right trigger to drive, stick or d-pad to lean, Start to pause.

## Running it

Open `index.html` in a browser. Everything is local; there is no account, no server and nothing is collected. Your best time and sound setting stay in your browser's own storage.

## Made with

Hand-written HTML5 canvas, drawn by a small software renderer in `js/render.js`. The rules are in `js/sim.js`.

Art, sound and music are CSAF's own packs, each on sale at https://csaf.itch.io: Verdant Ironworks, Verdant 29 Crystal Hollows, Verdant 69 Caverns, Verdant Side Depths, Hearthhands 01, Sparkfall 02, FM Drive, Pithead: The Working Mine, Lantern & Tallow.

**AI disclosure:** the code, graphics and text were made with generative AI. The sound and music are procedural synthesis and sequenced scores, not a generative audio model.

Copyright (c) 2026 Core Systems Asset Factory. See LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
