# Shelf Life: Store Simulator Sound Effects in Three Packs (Checkout, Stockroom and Shop Floor) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Shelf Life: Store Simulator Sound Effects in Three Packs (Checkout, Stockroom and Shop Floor)  
**Engine:** Procedural audio synthesis from Node (ZzFX-class oscillators/noise + layered DSP, deterministic, licence-clean - NO third-party samples) rendered to WAV + OGG via ffmpeg - engine-agnostic sound-effect packs. Inherits the music wing’s cannot-hear discipline and signal gates; see Wings/SoundFX/CLAUDE.md.  
**Docs published:** 2026-11-23


---

# Shelf Life: Store Simulator Sound Effects in Three Packs (Checkout, Stockroom and Shop Floor)

**324 sound effects in 3 kits, WAV and OGG, for any game engine: Checkout (106 sounds, the checkout lane from the first scan to the receipt), Stockroom (108 sounds, the back room from the delivery to a faced shelf) and Shop Floor (110 sounds, the store itself from the shutter going up to the lights going off).**

Three places in a first person store simulator, each as the actions a store sim already tracks: the checkout lane from scan to receipt, the stockroom from delivery to a faced shelf, the shop floor from the shutter going up to the night shift, each in its own room and with its own ladders a game can map to a number it already has. Each pack is complete in its own folder, with its own Readme, licence, naming manifest and proof, so you can copy one folder into a project and leave the others.

Made by Core Systems Asset Factory. Every sound is synthesised from code: no samples, no recordings, no third party audio, no generative audio model. Nothing here is musical.

## The kits

| Folder | Kit | Sounds | Loops |
|---|---|---|---|
| `Checkout/` | Shelf Life Checkout: Scanner, Register and Receipt Sound Effects | 106 | 4 |
| `Stockroom/` | Shelf Life Stockroom: Delivery, Boxes and Restock Sound Effects | 108 | 6 |
| `ShopFloor/` | Shelf Life Shop Floor: Doors, Carts and Freezer Sound Effects | 110 | 11 |
| | **Total** | **324** | **21** |

**Checkout**: Checkout is one lane under a low tiled ceiling: a laminate counter, a steel cash drawer, plastic keys and a thermal printer, all in one short room. Every scanner and the card terminal beep at their own single pitch, the same on every take, so a game can tell them apart by ear. The sale, the receipt and the coins are ladders a store sim can map to the basket it already counts; the belt, the drawer, the lane light and the roll change are lifecycles, every state its own file.

**Stockroom**: Stockroom is a concrete back room, harder and longer than the checkout lane: corrugated card that thuds rather than rings, steel cages and a pallet jack's frame, a concrete floor under every contact. Each kind of packaging owns its body (a can rings bright, a jar rings long, a bottle thocks hollow, a carton thuds dull, a crisp bag is all crinkle) and each action owns its shape, so a game picks the file from the item it already knows and what happened to it. The box, the stack and the tape are ladders; the van doors, the pallet jack, the roll cage, the swing door, the baler and the step ladder are lifecycles.

**Shop Floor**: Shop Floor is one large store hall, the longest room of the three: a tiled floor, steel shelving, glass freezer doors and the hum of the cases. The cart's wire basket rattles on every move, faster and brighter the faster it goes; what the cart runs into is a grid (target by force), so a game picks the file from the collider it hit and the cart's speed. The push, the freezer door and the failing tube are ladders; the doors, the shutter, the lights, the chest lid, the compressor and the bottle return are lifecycles; the beds run from the empty store before opening to the night shift.

## Licence, the short version

**Royalty free. Commercial use. No attribution required.** Full terms in `LICENSE.txt` (each kit folder carries the same terms). Credit line, if you want one:

```
Sound effects: "Shelf Life" by Core Systems Asset Factory
```

## Proof

Each kit's `pack_proof.json` carries a sha256 and a full measurement record for every file: **2,969** signal checks across the three kits, 0 failed. They measure signal, not taste; listen to the free demo first.

*Core Systems Asset Factory · Shelf Life: Store Simulator Sound Effects in Three Packs (Checkout, Stockroom and Shop Floor) · 324 sounds*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
