# Annals - the illuminated world timeline — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Annals - the illuminated world timeline  
**Engine:** Unity 6  
**Docs published:** 2026-09-06


---

# Annals — the illuminated world timeline

Annals turns the world-event records your project already has into a drawn chronicle page: an era
band per age, a distinct generated mark for every event, reign ribbons under the years each ruler
held, and the page furniture that makes it a chronicle rather than a chart.

There is **no texture, no atlas, no material and no font** in this package. Every mark is a signed
distance field evaluated per pixel, so a page composed at 600×900 and the same page at 2400×3600 are
the same drawing at two resolutions, not a small picture enlarged.

---

## What you get

| | |
| --- | --- |
| **Event devices** | 26 separately authored marks — war, siege, treaty, alliance, founding, coronation, death, birth, plague, famine, fire, flood, earthquake, storm, omen, eclipse, discovery, voyage, migration, schism, rebellion, council, trade, ruin, law, oath |
| **Reign devices** | 10 — crown, circlet, laurel, helm, mitre, signet, sceptre, hand, star, mask |
| **Era grounds** | 10 register surfaces — plain, ruled, hatched, diapered, waved, mottled, starred, gridded, marbled, scorched |
| **Ornament** | 12 — fleuron, rosette, knot, vine, cartouche, corner, terminal, tassel, chain, pilcrow, crescent, sun |
| **Media** | 7 — vellum, woodcut, papyrus, palimpsest, bronze, starchart, datalog |

The exact corpus total is printed by `Corpus.Count()` and shown in the editor window. It is read from
the corpus rather than typed here, so it cannot go stale.

Seven media × ten era grounds is seventy distinct registers before a single event is placed, and each
age on a page takes its own tincture from its own position, so two ages never read as one band
repeated and two pages never read as one page recoloured.

---

## The shortest integration

```csharp
using CSAF.Annals;

var chronicle = new Chronicle { Title = "ANNALS OF THE VEIL", Medium = Medium.Vellum };
chronicle.Events.Add(new ChronicleEvent("The Salt War", "war", -128, 0.85f));
chronicle.Events.Add(new ChronicleEvent("The Grey Fever", "plague", -18, 0.95f));
chronicle.Events.Add(new ChronicleEvent("Vesper Crowned", "coronation", 514, 0.85f));

Texture2D page = AnnalsPage.Compose(chronicle, 900, 1200);
```

That is the whole minimum. **Ages are optional** — supply none and the page bands your events itself,
cutting the ages at the largest gaps between consecutive years, which is where a reader already
perceives a boundary. Supply your own `Era` list when your world names its ages.

Reigns are optional too:

```csharp
chronicle.Reigns.Add(new Reign("Vesper Queen", "queen", 514, 640));
```

### Where the fields come from

Every field is something a world-event record already has. Nothing asks you to author art, pick a
glyph id, or add a field whose only purpose is to feed this package.

- `Kind` is **your own word** — "war", "plague", "founding". It is matched whole-word against the
  corpus, so `charcoal` can never claim `coal`.
- `Magnitude` (0–1) drives both how large a device is drawn **and** how many parts it is built from,
  so a great war is a busier device and not merely a larger copy of a small one.
- `Year` is a `double`, so negative years before a reckoning, half years and fractional seasons all
  work. Nothing interprets it beyond ordering and spacing.

---

## The rule that will surprise you, and why it is the right one

**An event whose `Kind` the corpus does not recognise gets NO device.** It is drawn as a plain tick
on the rule instead.

That is deliberate. An event device makes a claim about what happened, and drawing crossed swords
beside a royal wedding is not a stylistic slip — it is a false statement about your data that a
player reads as true. Reign devices, era grounds and ornament take the opposite policy and always
resolve, because every reign was held by someone, every age has a surface and every page has margins.

If a kind of yours draws nothing and you want it drawn, the source ships raw: add a mark to
`MarksEvent.Build()` with your own selector words. Every word must be a single token — no spaces, no
underscores, no punctuation — and the family throws at construction if you break that, rather than
silently giving you a mark nothing can ever reach.

---

## Performance, measured

A page is software-rasterised on the CPU, so its cost is **linear in pixel count**. The figures below
were measured on one ordinary Windows workstation, and the high end of each range is an
**observation, not a ceiling** — a busier machine will exceed it, and this package runs on machines
we cannot see.

| page size | pixels | typical compose |
| --- | --- | --- |
| 480 × 640 | 0.31 M | *see the editor window, which prints the real number for your machine* |
| 720 × 960 | 0.69 M | " |
| 900 × 1200 | 1.08 M | " |

The editor window prints `Last compose: N ms` after every preview, and the demo scene logs the same
figure. **Read your own number rather than trusting ours** — that is the only honest way to size an
integration, and it is one keystroke away.

**Compose ahead and cache, or bake to PNG in the editor.** Do not compose a page on the frame a
player opens a menu. Two patterns work well:

1. **Bake at authoring time.** If your history is fixed, open *Window ▸ CSAF ▸ Annals*, export a PNG,
   and ship the image. Nothing in this package runs at run time at all.
2. **Compose off the main thread.** `AnnalsPage.Bake` touches no Unity object and returns plain
   pixels; hand them to `AnnalsPage.ToTexture` on the main thread when they are ready. Call
   `AnnalsPage.Warmup()` once on the main thread first — it draws a tiny page and throws it away,
   which is what forces the runtime to compile the rasteriser. Without it the first real page pays
   that cost while the player is watching.

---

## The editor window

*Window ▸ CSAF ▸ Annals* composes the worked example on any medium and exports a PNG at any size up
to 4096. It previews at the size it displays rather than composing large and shrinking, so the timing
it reports is a real timing for a real page.

## The demo scene

`Assets/CSAF/Annals/Demo/AnnalsDemo.unity` — open it and press Play. One page composes; **SPACE**
cycles the medium, composing each one lazily the first time you ask for it and caching it after.

---

## Requirements and compatibility

- **Unity 2022.3 or newer.** Nothing here uses an API introduced after 2022.3, and the package is
  built and gated against Unity 6000.5.
- **Every render pipeline**, because the package does not render: it writes pixels into a
  `Texture2D`. Built-in, URP, HDRP and a custom pipeline are all the same to it.
- **No package dependencies.** Nothing in `Packages/manifest.json` needs to change.
- **No `Resources/` folder**, so nothing here is added unconditionally to your build.
- Three assembly definitions — `CSAF.Annals.Runtime`, `CSAF.Annals.Editor` (Editor-only) and
  `CSAF.Annals.Demo`. Delete the `Demo` folder and nothing else notices.

## Determinism

Nothing in this package ever calls `UnityEngine.Random`. Every choice that looks random is hashed
from the record's own text plus `Chronicle.Seed`, so the same history composes the same page forever
— a screenshot a player shared last week is still the history they have.

## Licence

See `LICENSE.txt`. The source ships raw and readable on purpose: extend the corpus, change the
layout, re-tune the palettes.

## AI disclosure

This package was written with AI assistance. Code: yes. Graphics: yes — and note that "graphics"
here means the drawing code itself, since the package ships no image files at all. Sounds: no.
Text and dialog: no.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
