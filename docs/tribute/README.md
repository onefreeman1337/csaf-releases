# Tribute - the generated season track — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Tribute - the generated season track  
**Engine:** Unity 6  
**Docs published:** 2026-09-18


---

# Tribute — the season-track screen, composed from your own reward table

**Your game already has a reward table. Tribute draws the battle-pass screen from it.**

Hand Tribute a season (its name, its tiers, the free and premium reward on each tier, and the
player's progress) and it composes the season-track screen: a season banner with its own motif, a
progress rail, and one plate per tier in two lanes, each carrying a drawn emblem chosen from the
reward's own name. Locked, claimable and claimed rewards each get their own treatment, so a player can
see what is left to take without reading a label.

Nothing in it is an imported image. Every emblem, banner, plate and letter is drawn in code by a
software rasteriser shipped in this package, and the package ships no font.

---

## What your data does to the screen

| your data | what it draws |
| --- | --- |
| the season's `Name` | the **livery** (seven: Frost, Ember, Verdant, Tide, Dusk, Gilt, Neon) and the **banner motif**, from the words in the name ("Frostfall" → Frost); an unrecognised name gets a stable livery from a hash of itself |
| each reward's `Name` | its **emblem**, whole-word ("Epic Chest" → a chest, "XP Boost" → a bolt); an unrecognised name gets a stable emblem, never a blank |
| each reward's `Amount` | a number set under the emblem (250, 1,250) |
| each reward's `Rarity`, or a rarity word in its `Name` ("Epic Chest") | the plate's **rim**, in the colours players already read: common, uncommon, rare, epic, legendary, mythic. A reward whose words name no rarity keeps its lane's own rim; nothing is guessed |
| how far along the season a tier sits | how rich the emblem is: coins in a stack, points on a crown, facets on a gem |
| the player's progress | the rail fills to the current tier; claimed rewards read pressed and spent, the claimable ones get a halo, locked ones are veiled with a padlock |
| a premium lane the player does not own | locked, whatever tier they have reached |

Every choice is listed in the editor window's derivation panel, with the word that made it.

---

## Quick start

1. Open **`Assets/CSAF/Tribute/Demo/Scenes/TributeDemo.unity`** and press **Play**.
   LEFT / RIGHT change season, UP / DOWN change page, **C** claims the next reward and redraws.
2. **Assets > Create > CSAF > Tribute > Season** makes a season you can fill in the Inspector; press
   **Compose this season in Tribute** at the top of it.
3. **Window > CSAF > Tribute** composes any season asset, pages through it, shows why it looks like
   this (livery, banner motif, and every emblem and rarity with the word that chose it), and saves a
   PNG. The window's preview uses `MarkSamples = 2`; **Save PNG** composes again at the full default.

From code:

```csharp
using CSAF.Tribute;

var season = new SeasonPass { Name = "Frostfall", Subtitle = "Season 7" };
season.Tiers.Add(new TierEntry(new RewardEntry("Gold", 250), new RewardEntry("Legendary Skin")));
season.Tiers.Add(new TierEntry(null, new RewardEntry("Epic Chest")));   // an empty free slot
season.Progress.CurrentTier = 1;
season.Progress.PremiumOwned = true;

Texture2D page = TributeTrack.Compose(season, new TrackOptions { Width = 1920, Height = 720 });
myRawImage.texture = page;   // you own it; Destroy() it when you replace it
```

### Off the main thread

Composing is software rasterisation, so compose when the season or the progress changes — never per
frame — and off the main thread for anything a player opens:

```csharp
TributeTrack.Warmup();                                        // main thread, once
TrackBake bake = await Task.Run(() => TributeTrack.Bake(season, options));
Texture2D page = TributeTrack.ToTexture(bake);                // main thread
```

`TrackBake` also reports the page, the page count, the livery and every emblem choice, so your own UI
can page the track and label what is on it, and what the compose cost: `Milliseconds`, split into
`GroundMilliseconds`, `MarksMilliseconds` and `TypeMilliseconds`.

### Making it cheaper

- **Emblem tiles are cached.** Claiming one reward and composing again redraws only the emblem that
  changed; every other tile comes back from the cache (`TrackBake.TilesFromCache` counts them). The
  cache holds at most about a million pixels and empties itself past that;
  `TributeTrack.ClearTileCache()` empties it on demand.
- **Emblem tiles are drawn on worker threads** (`TrackOptions.Parallel`, on by default, off on WebGL).
  The pixels are identical either way; the test suite compares them byte for byte.
- **`TrackOptions.MarkSamples`** (1 to 4, default 3) is the antialiasing of each emblem. Cost is
  quadratic in it: 2 takes four samples per emblem pixel where 3 takes nine.
- Compose at the size you display. Cost scales with pixel count.

---

## Paging

A long season is split into pages; the number of tiers per page is derived from the width
(`TrackOptions.TiersPerPage` fixes it). A season shorter than one page spreads its tiers across the
track instead. `TrackOptions.Page = -1` (the default) opens on the page that holds the player's current
tier. On the last page the rail stops at the last tier.

---

## Limitations, stated plainly

- The drawn letterforms cover Latin capitals, the figures and a small set of marks. Text outside that
  set is left empty rather than printed as boxes; set such a title in your own UI.
- One composition draws one page of one season.
- Compose time scales with pixels; measure it on your target hardware and compose off the main thread.

---

## Package contents

- `Runtime/` — the rasteriser (`Core/`), the drawn letterforms (`Type/`), the emblem and banner corpus
  (`Mark/`), the season model and derivation rules (`Model/`), and the composer (`Track/`). Assembly
  `CSAF.Tribute.Runtime`, all platforms.
- `Editor/` — the Tribute window and the season asset's Inspector button. Assembly `CSAF.Tribute.Editor`.
- `Demo/` — the demo scene and its driver. Assembly `CSAF.Tribute.Demo`.

No `Resources/` folder, no shaders, no images, no fonts, no network calls.

---

*Tribute · Core Systems Asset Factory. AI disclosure: the code and the store imagery were produced with
AI assistance; the screens are drawn by the code in this package, not by an image model.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
