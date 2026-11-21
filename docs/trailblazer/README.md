# Trailblazer — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Trailblazer  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-21


---

# Trailblazer v1.0.0 for RPG Maker MZ

By Core Systems Asset Factory (https://csaf.itch.io).

Three things a player can do to your own map, in three parts and 8 plugin files: bomb a wall or a rock open, cut grass
and brush with a swing, and hop ledges, fences and gaps. The cracks, breaches, rubble, clippings, stubble, shadows,
chips and dust are drawn from the tiles already on your map; the bomb, its fireball and the hop guide are drawn in code
in their own colours, sized to your tiles. No new art to draw, no events on every wall or tuft.

| Part | What it does in your game | Files |
| --- | --- | --- |
| **Trailblazer Blast** | Bombs that open your own walls and rocks. A marked wall shows a **crack drawn from its own pixels**; a bomb's fuse burns, it bursts in a fireball with a shock ring and a scorch, and the wall comes apart in blocks into a **breach cut from its own stones**, with rubble in its own colours. A rock shatters into its own pieces. The opening stays open and can be walked through. | `TrailblazerBlastCore.js` + `TrailblazerBlast.js` + the two Smithereens files |
| **Trailblazer Reap** | A swing that cuts your own grass and brush. MZ's own **Bush** tiles (tall grass) can be cut with no setup, and any bush, fern, reed, vine or bramble you mark. The blade sweeps the three cells in front, **clippings fly from the cell's own pixels**, grass is mown to the ground beneath it, a tuft is cut to a stub, cut grass stops hiding feet, a cut can drop an item, and it all **grows back** on a saved timer. | `TrailblazerReapCore.js` + `TrailblazerReap.js` + the two Smithereens files |
| **Trailblazer Vault** | Hops over your own map. Walk off a **ledge** and the party drops over it; push against a **fence, a log or a narrow stream** and the party vaults it. The hop is MZ's own jump; Vault draws what a player sees: a **shadow in the ground's own colour**, chips of the ground at takeoff and landing, dust, pebbles from a ledge's face, a squash and stretch, and a **dotted guide** on the real arc. | `TrailblazerVaultCore.js` + `TrailblazerVault.js` |

`SmithereensCore.js` and `SmithereensCut.js` are shared by Blast and Reap. This download carries one copy of each.

## Install

1. Copy every file in this download's `js/plugins/` folder into your project's `js/plugins/` folder.
2. Open the Plugin Manager and turn ON the files of the part or parts you want: Blast needs its two files and the two
   Smithereens files, Reap the same, Vault only its two. Any order works; this order reads best: SmithereensCore,
   SmithereensCut, TrailblazerBlastCore, TrailblazerBlast, TrailblazerReapCore, TrailblazerReap, TrailblazerVaultCore,
   TrailblazerVault. The Plugin Manager descriptions of the two Smithereens files say "Install with Smithereens.js": that
   line belongs to the shared file, and you do not need Smithereens.js.
3. Mark your map. **Reap works at once** on MZ's own tall grass (Bush tiles). **Blast** waits for its **Bombable
   region** parameter (or a terrain tag, or `<blast>` in an event's note). **Vault** waits for its **Ledge region** and
   **Hop region** parameters (or terrain tags, or `<Vault>` in an event's note). Use a different region number for each.
4. In a playtest: **B** sets a bomb, **C** (or OK facing grass) swings, and walking into a ledge or pushing against a
   fence hops.

Every part's full guide (parameters, note tags, plugin commands, limits) is in the `Guides/` folder:
`Guides/Trailblazer_Blast.md`, `Guides/Trailblazer_Reap.md`, `Guides/Trailblazer_Vault.md`.

## Using the three together

Measured in the engine with all 8 files ON, in a blank RPG Maker MZ project on MZ's own database and MZ's own Outside
tileset, every parameter at its default except the three a buyer sets: Bombable region 50, Ledge region 53, Hop
region 52. On one map: MZ's own tall grass, a stock rock painted with region 50, a stock fence-height object painted
with region 52 and a row of ground painted with region 53.

- **One map, all three parts, the real keyboard.** C cut the three tall-grass cells in front; B set a bomb and the
  rock blew open and could be walked through; pushing the region-52 object vaulted it; walking down into the region-53
  row dropped over it; OK facing the grass swung again.
- **The keys stay apart:** a swing set no bomb and hopped nothing, a bomb cut nothing and hopped nothing, a hop set no
  bomb and cut nothing.
- **Vault never re-reads the map:** it reads every ground picture once while the map loads; the bomb, the cuts and the
  hops after it read no pixels. A cell Blast or Reap changed afterwards keeps the shadow and chip colours Vault read when
  the map loaded, until the map is loaded again.
- **One save carries all three parts:** after a save and a load the rock is still open, every cut cell is still cut,
  and the hop count is kept.
- **Turn a part off and the other two still work:** the same save loads with any one part removed; what the removed
  part opened or cut is back the way your map draws it, and the other two still bomb, cut or hop.
- **Without the two Smithereens files,** Blast and Reap each say so once in the console and do nothing, and their saved
  state is kept for when the files are back; Vault still hops.
- **Plugin order does not change the result:** the same checks pass with the files in the order above, in reverse
  order and in a shuffled order.
- Five engine methods are extended by more than one file (`Game_Map.prototype.setup`,
  `Game_Player.prototype.moveByInput`, and `Spriteset_Map` createTilemap, createLowerLayer and update). Each file saves
  the original and calls it, so every part's addition runs.
- **A swing spreads its clippings over frames:** one swing cuts three cells at once and throws one cell's clippings per
  frame (Trailblazer Reap 1.0.1). Version 1.0.0 threw all three in one frame, which was the heaviest frame when a swing
  met Blast's and Vault's pieces in flight.
- **Frame cost with all three acting at once:** on one map, one act every third of a second in turn (a swing, a bomb, a
  hop), the studio's frame gate passed with **14** draw calls a frame, inside the 60 it allows.

## Compatibility

- RPG Maker MZ 1.x. Tested on the MZ 1.10.0 runtime.
- Tested with only these plugins loaded. No VisuStella plugin was loaded in these tests. The Reap and Vault guides say
  where to put them if you use VisuStella's Core Engine; the Blast guide does not cover VisuStella.
- No part ships an image, a font or a sound file. The cracks, breaches, rubble, clippings, stubble, shadows, chips and
  dust are drawn in code from your own map's tiles; the bomb, its fireball, shock ring and scorch, and the hop guide's
  dots are drawn in code in their own colours, sized to your tiles. The sounds they play are MZ's own stock sound effects, already in your project (Blast: Fire1,
  Explosion1, Crash; Reap: Wind7, Slash1, Item3; Vault: Jump1, Move1), each one a parameter you can change or clear.
  Reap's drops show your project's own item icons.
- The tiles, the characters and the gems in the store images are CSAF test art and are **not included**. The cracks,
  blasts, breaches, rubble, clippings, stubble, shadows, chips, dust and guides in them are what the plugins draw; the
  ones listed above as drawn from tiles come from **your** tiles in your game.
- If you also own Smithereens, Timber or the MZ Plugin Library: keep ONE copy of `SmithereensCore.js` and
  `SmithereensCut.js`. They are the same files, byte for byte.

## Versions

Trailblazer Blast 1.0.0, Trailblazer Reap 1.0.1, Trailblazer Vault 1.0.0.

## Already own the MZ Plugin Library?

All three parts are also inside the MZ Plugin Library (https://csaf.itch.io/mz-plugin-library), byte for byte the
same files. If you own the Library, you already have Trailblazer.

## Licence

See `LICENSE.txt`. This product was made with AI tools: the code was produced with AI assistance, everything it draws
in your game is drawn by that AI-written code, and the store images were made with AI tools too.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
