# Vellum — illuminated item cards, drawn from your own item data

**Every item in your game draws its own card.** Not eight frames repeated across five hundred
items — a different drawn card for each one, composed from the fields your item database already
has: its kind, its rarity, its origin, its stats.

Nothing in this package is a texture. There is no atlas, no sprite sheet, no material and no font.
Forty item devices, ten provenance seals, twelve stat glyphs and seven border orders are drawn in
C# by a software rasteriser that ships with the package, so a five-hundred-item game costs five
hundred cards and zero import time.

---

## Quick start (about five minutes)

1. **Open the demo.** `Assets/CSAF/Vellum/Demo/VellumDemo.unity` — press Play, click down the item
   list, and watch each item compose its own card. The words on those cards are drawn by the demo
   from the rectangles the package publishes; see *Your text goes on top*, below.

2. **Open the window.** `Window ▸ CSAF ▸ Vellum`. It shows any item's card beside a derivation
   panel that tells you **exactly why it looks like that** — which mark was chosen, whether your
   own word chose it or a hash did, which origin word matched the seal, and every derived scalar.

3. **Compose a card from your own item:**

   ```csharp
   using CSAF.Vellum;

   var item = new VellumItem("Ashfall Greatsword", "greatsword", Rarity.Legendary)
       .At(itemLevel: 18, worth: 24000)
       .From("forge", "Quenched in a river that has not run since.")
       .Stat("Damage", "2d6+5")
       .Stat("Weight", "8");

   Texture2D card = CardComposer.Compose(item, 420, 596, out CardPlan plan);
   // You own the texture. Destroy it when the tooltip closes.
   ```

4. **Map your own item type once.** Every project already has its own item class and none of them
   is ours, so the integration is a small mapping function you write once:

   ```csharp
   static VellumItem ToVellum(MyItem it)
   {
       var v = new VellumItem(it.displayName, it.category, MapRarity(it.tier));
       v.ItemLevel = it.level;
       v.Worth     = it.goldValue;
       v.Origin    = it.factionId;
       v.Flavour   = it.flavourText;
       foreach (var s in it.modifiers) v.Stat(s.name, s.ToDisplayString());
       return v;
   }
   ```

---

## Your text goes on top — and that is deliberate

**The package draws no lettering.** A tooltip's words have to stay selectable, localisable and set
in *your* font, and baking them into a texture breaks all three. So Vellum draws the sheet, the
border order, the device, the seal and the stat glyphs, and publishes where the words go:

```csharp
CardLayout layout = CardLayout.For(item.Stats.Count, hasFlavour: !string.IsNullOrEmpty(item.Flavour));

titleText.rectTransform.anchorMin = layout.Title.min;   // normalised, bottom-left origin
titleText.rectTransform.anchorMax = layout.Title.max;
```

`Title`, `TypeLine`, `Stats`, `Flavour`, `Device` and `Seal` are all published this way, and the
layout **reflows around what the item actually has** — an item with two stats and no flavour line
gives that space to the illumination instead of leaving a hole in the card.

---

## What decides how a card looks

| Your field | What it drives |
| --- | --- |
| `Kind`, then `Name`, then `Tags` | **which of the 40 devices** is struck, matched whole-word |
| `Rarity` | the palette **and** the border order — seven orders, not seven tints |
| `Origin` | which of the 10 provenance seals is struck, or **none** |
| `ItemLevel` | the device's part count — flanges on a mace, points on a diadem, pips on a rank mark |
| `Worth` | how heavily the card is gilded (logarithmic, so 50 gp and 50,000 gp look different) |
| `Stats[].Label` | which stat glyph is struck against each line |

**Your own words always beat the heuristic.** If you write `Kind = "axe"` you get an axe. If you
write nothing but `"Ashfall Greatsword"` you still get a blade, because the name is searched next.
Only when nothing matches does a stable hash choose — and it chooses the *same* device for that
item every time, so a card never reshuffles itself between launches.

**An unrecognised origin draws no seal at all.** A provenance mark invented by a hash would be a
claim about your item's history that your data never made.

---

## Determinism

The same item always draws the same card, in the editor, in a build, and on every platform. The
seed is built from the item's **name and kind only** — so re-balancing a damage number never
redraws the art, and your store screenshots do not go stale on the next balance pass. Renaming an
item is the one edit that is *meant* to change its card.

---

## Performance

A card is composed on the CPU and costs roughly what its pixel count costs. Compose lazily — when
the tooltip opens, not when the inventory loads — and destroy the texture when it closes. Set
`CardComposer.Profile = true` once if you want the per-phase timings printed rather than guessed.

`CardComposer.Sheet_(width, height, rarity)` returns just the prepared vellum with no card
furniture on it, so the panel behind the card and the button under it can be on the same skin.

---

## What is in the package

```
Runtime/Core     Hash · Ink (the software rasteriser) · Words · VellumPalette
Runtime/Mark     GlyphKit · Mark · Corpus · MarksArms · MarksGoods · MarksSeal · MarksStat · MarksBorder
Runtime/Model    VellumItem · VellumLibrary · Derive · SampleArmoury
Runtime/Card     CardLayout · CardComposer
Editor           VellumWindow
Demo             VellumDemo.unity + VellumDemo.cs
```

Every script is inside a named, platform-constrained assembly definition
(`CSAF.Vellum.Runtime`, `CSAF.Vellum.Editor`, `CSAF.Vellum.Demo`). There is no `Resources/`
folder, so nothing here is added to your build unless you reference it.

**Requires Unity 2022.3 or newer.** No third-party dependencies. No render-pipeline dependency —
the output is a `Texture2D`, so it works on Built-in, URP and HDRP alike.

---

## Support

Documentation and contact: <https://onefreeman1337.github.io/csaf-releases/vellum/>

---

*Code and graphics in this package are AI-generated. Copyright (c) 2026 Core Systems Asset Factory.*
