# Escutcheon (illustrated character sheet) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Escutcheon (illustrated character sheet)  
**Engine:** Unity 6  
**Docs published:** 2026-08-28


---

# Escutcheon

**Illustrated character sheets, generated from the stat block you already have.**

Point it at a character and it composes a finished sheet: a heraldic crest built from your class and
house, an emblem for every attribute chosen from *your own attribute names*, a border that grows
more ornate as the character advances, merit roundels for their titles, and rank pips for their
level.

Nothing in this package is an imported image. Every mark is drawn in C# by a software rasteriser,
so it is render-pipeline agnostic, deterministic, and runs headlessly with no graphics device.

---

## 1. Two minutes to your first sheet

1. **Window ▸ CSAF ▸ Escutcheon Character Sheet.**
2. Press **Load sample** to page through the eight sample characters that ship with the package.
3. **Export PNG** writes the sheet you are looking at.

Then open **Assets/CSAF/Escutcheon/Demo/EscutcheonDemo.unity** and press **Play**. Left and Right
arrows page along the roster. Every sheet there is composed at run time from the sample data — none
of them is a stored image.

---

## 2. Using your own characters

Two options, and the second is the one most projects should take.

### Option A — the included asset

**Create ▸ CSAF ▸ Escutcheon ▸ Character Record**, fill it in, and drop it into the window's object
field. Fine for a small project or for trying the tool out.

### Option B — project your existing data (recommended)

Your project almost certainly already has a character class with fifty fields on it. **Do not
migrate it.** Write a few lines that project it into a `CharacterRecord` at call time and keep your
own type as the source of truth:

```csharp
using CSAF.Escutcheon;

CharacterRecord ToRecord(MyHero hero)
{
    var attrs = new List<AttributeEntry>();
    foreach (var stat in hero.Stats)          // whatever your stat container is
        attrs.Add(new AttributeEntry(stat.DisplayName, stat.Current, stat.Max));

    return CharacterRecord.Create(
        hero.Name, hero.ClassName, hero.FactionName, hero.Level, attrs, hero.Titles);
}

// and then, wherever you want the picture:
SheetPage page = SheetComposer.Compose(ToRecord(hero));
myImage.sprite = Sprite.Create(page.Texture,
    new Rect(0, 0, page.Texture.width, page.Texture.height), new Vector2(0.5f, 0.5f));
```

That is the whole integration. There is no prefab to configure, no atlas to rebuild and no art to
import.

---

## 3. The one thing worth understanding: your words choose the art

`AttributeEntry.Name` is not a label. It is the **primary input to the emblem**.

The package ships a corpus of **48 attribute emblems** in eight virtues, and each one declares the
words that select it. A stat named `Ferocity` draws a bared fang. `Warding` draws a lapped scale.
`spellPower` draws the orrery — the tokeniser splits camelCase, `SCREAMING_SNAKE` and digits, so
`MAX_HEALTH`, `critChance` and `armour_rating` all resolve without you renaming anything.

If nothing in a name is recognised, the emblem is **derived from the character key** instead. That
is a perfectly good result — it is stable, it is consistent, and the same name always draws the same
emblem — but it is arbitrary rather than apt. **The editor window prints which attributes matched by
name and which were derived**, so you can see at a glance whether renaming one stat would buy you a
better sheet.

Matching is by **whole word**. `Intimidation` does not match `int`, and `Alphabet` does not match
`hp`.

### The crest works the same way

`Calling` is read first, then each of `Marks`, then a hash of the character key. A
`Wolfsbane Ranger` bears the wolf because you said so. There are **24 charges** in three orders
(beasts, works, world).

---

## 4. What the sheet is showing

| On the sheet | Comes from |
| --- | --- |
| Shield tincture | `House` (or set it explicitly with `AutoTincture` off) |
| Field division and border style | `House` — **every character of one house gets the same arms** |
| Charge on the shield | `Calling`, then `Marks`, then the key |
| Ordinary (the band over the field) | Appears above one third of `Level / LevelCap` |
| Border ornament density, gilding, rivets | `Level / LevelCap` |
| Rank pips | `Level / LevelCap` |
| One emblem per attribute | that attribute's own `Name` |
| Emblem size, detail count, wear | that attribute's `Value` against its `Max` |
| Attribute pips | `Value / Max`, always out of five |
| Merit roundels along the foot | `Marks` |

Two characters of the same house come out matching, differenced by their charge and their marks —
which is what heraldry is, and what makes a party's sheets read as a party.

---

## 5. Text

**This package draws no text, deliberately.** Your game already has a font, a localisation system
and an opinion about type; baking glyph shapes into the artwork would fight all three and make the
sheet untranslatable.

Instead the composer **reserves the space and tells you where it is**. `SheetPage` carries
`NamePlate`, `CallingPlate`, `MarksPlate` and one `AttributePlates[i]` per attribute, all as `Rect`
in **UV space with the origin bottom-left** — which converts directly to a `RectTransform`'s anchors,
to a sprite's texture rect, or to a world-space quad.

`Demo/Scripts/EscutcheonDemo.cs` does the whole job in about forty lines with `TextMesh`. Read
`LetterSheet` and `Letter` there; adapt to TMP, UGUI or UI Toolkit as you prefer.

---

## 6. Performance and determinism

- **A sheet is composed once, not per frame.** At 900×1200 expect tens of milliseconds. Compose it
  when the character changes and cache the texture.
- **It is deterministic.** The same record produces byte-identical artwork on every machine and in
  every session — the package uses its own FNV-1a hash rather than `string.GetHashCode()`, whose
  seed .NET randomises per process. The test suite asserts this.
- **It runs headlessly.** No shader, no graphics device, no render texture. It works in batch mode,
  on a build agent, and in an EditMode test.
- **Destroy the texture when you are done with it.** `SheetPage.Texture` is a `Texture2D` you own.

---

## 7. Extending the corpus

The corpus files are plain C# and ship as readable source.

- An **attribute emblem** is one entry in `Runtime/Mark/Forms*.cs`: an id, a virtue, a name, the
  words that select it, and the code that draws it.
- A **charge** is one entry in `Runtime/Mark/Charges*.cs`.
- A **border** is one case in `Runtime/Mark/SheetFrame.cs`.

`GlyphKit` is the drawing vocabulary — signed distance functions, the operators that combine them,
and `Plate`, which turns a silhouette into something that reads as a made object. Read
`FormsMight.cs` first; it is the exemplar the rest of the corpus follows.

**One rule if you add your own:** every mark leads with a large filled shape. A form drawn as thin
strokes reads as bent wire at 48 pixels, which is the size most of these are seen at.

Adding a word to an existing entry costs nothing. Duplicate ids and duplicate words **throw at load**
rather than being tolerated, because both are invisible at runtime — a duplicate id silently shadows
one emblem so it can never be selected again.

---

## 8. Requirements

- **Unity 2022.3 or newer.** Built-in, URP and HDRP all work: there is no shader and no material.
- No third-party dependencies. No `Resources/` folder. Every script is in a named, platform-
  constrained assembly definition, and all editor code is Editor-only.

---

## 9. AI disclosure

The code and the artwork in this package were produced with AI assistance. This is disclosed on
every storefront it is sold through.

---

## 10. Support

Questions, bug reports and requests for emblems the corpus does not cover:
**csassetfactory@gmail.com**

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
