# PRISMHORN

**js13kGames 2026 — theme "Unicorns and Rainbows"**

Play it: <https://csaf.itch.io/prismhorn>

> You never cast a spell. You cast a rainbow.

One shaft of dawn strikes your horn and leaves it as **seven bands of light**. Each band is a
different verb. They fire **together, always, in a rigid fan** — so every shot is seven decisions at
once, and you aim the whole spectrum or none of it.

| band | what it does |
| --- | --- |
| UNMAKE | dissolves the made |
| FORGE | hardens into matter |
| WAKE | animates the dormant |
| GROW | accelerates living things |
| CHILL | slows and stills |
| SCRY | reveals what is hidden |
| MEND | restores what it touches |

The trap is in that table. GROW ripens the blooms that pay you — and it feeds the blight standing
beside them just as happily. MEND heals your cairns and whatever is eating them. FORGE hardens your
ground and armours the thing standing on it. You cannot fire one band. That is the game.

## The 13KB

| | bytes |
| --- | --- |
| readable source in this folder | 52,455 |
| shipped, packed | 33,648 |
| **zipped package** | **11,254 / 13,312** |

The packer strips comments and indentation only — **no renaming, newlines kept** — so the shipped
file is still readable JavaScript, and every string literal in the source is verified present in
the output before the archive is accepted.

There are **no image files and no audio files**. Every flower, every band, the unicorn herself and
the whole moor are Canvas paths drawn at runtime; the eight sound effects and the drifting ambient
bed are synthesised from oscillators in the same file. At 13,312 bytes that is not a stylistic
choice — a single 630×500 PNG is about 450,000 bytes, thirty-four times the entire game.

## Controls

`WASD`/`Arrows` walk · `Q`/`E` narrow ‹ › widen the fan · `SPACE` flare ·
`ENTER` walk in · `1`–`6` at the Prism spend Light

Falling is not losing: you keep every upgrade, every band and every mote of Light, and walk back
into the same valley. Saves to `localStorage` under the namespaced key `ph.save` (js13k rule).

## Files

| | |
| --- | --- |
| `g.js` | the whole game, readable |
| `index.html` | the shell |
| `LICENSE.txt` | MIT |

## Disclosure

Written with AI assistance. There is no generative-AI art or audio in the game — there are no asset
files in it at all. The cover illustration on the itch page is a generated image and is not part of
the game or of this repository.

MIT licensed. © Core Systems Asset Factory.
