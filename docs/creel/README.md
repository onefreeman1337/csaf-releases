# Creel — Every Fish Your Game Can Catch, Drawn at Runtime, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Creel — Every Fish Your Game Can Catch, Drawn at Runtime, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/creel  
**Docs published:** 2026-11-05


---

# Creel — every fish your game can catch, drawn from its own data

**RPG Maker MZ · seven plugin files · no image assets**

You already have a fishing system, or you are about to write one. Creel is the other half: **the
fish**. It builds a distinct specimen for every species your project declares — body plan, fin set,
marking and livery — and it draws all of it at run time. There is no PNG in this package, no sprite
sheet and no atlas. The fish you see is geometry.

**Keep whatever fishing system you already bought.** Creel does not catch fish, does not add a
minigame, and does not compete with your reel-and-bobber code. It answers the question that system
leaves to you: *what does this one look like?*

---

## Install

1. Copy the seven files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and switch all seven on.
3. Declare a species (below), or tag an item, and open the ledger.

**Load order does not matter.** Every file resolves the others the first time it needs them rather
than when it loads, and that is tested rather than hoped for: the headless suite, the store-plate
renderer and the in-engine verification all load the seven files **alphabetically**, which puts
`CreelScene.js` ahead of the `CreelSpecies.js` it depends on. That is the worst order a buyer can
create by dragging files in, and it is the order the tests run in. This package deliberately ships
no load-order file.

---

## The corpus

| axis | count | what it decides |
| --- | --- | --- |
| **body plan** | **12** | the silhouette — spindle, torpedo, disc, sunfish, eel, ribbon, flathead, hatchet, angler, ray, fan, pike |
| **fin set** | **8** | plain, sail, fork, lance, fringe, spine, paddle, trail |
| **marking** | **10** | plain, bars, stripes, spots, speckle, mottle, saddle, ocelli, chevron, net |
| **livery** | **12** | trout, char, perch, koi, abyssal, reef, silver, pike, carp, tropical, albino, ember |

**12 × 8 = 96 distinct silhouettes**, before a single colour is chosen — that separation is the
point. Markings and liveries multiply the catalogue on top *without changing an outline*, for
**11,520** distinct specimens. A project with sixty species gets sixty fish that differ in shape,
not sixty recolours of one fish.

Body plans are authored as **envelope pairs** — an independent top and bottom profile over one
tail-to-snout axis — so a flat back over a keeled belly is expressible, and half the corpus *is*
that asymmetry.

---

## Declaring species

Two routes, and they coexist. Use either or both.

### 1. A note tag on an item

Put a `<creel>` tag in any item's note box. The species is named by the item.

```
<creel>
<creel: livery=reef>
<creel: form=angler, livery=abyssal, pattern=speckle>
<creel: form=ribbon, finset=trail, pattern=net, livery=koi>
```

A bare `<creel>` derives all four axes from the item's own name, deterministically — "Bog Lamprey"
resolves to an eel, "Marsh Gar" to a pike — so you can tag a hundred items and get a hundred
different fish without typing a single axis. Pin the axes you care about and leave the rest.

**An unknown key is ignored, and an unknown value skips the species rather than substituting one.**
A typo cannot silently draw you a different fish, and it cannot crash a fishing scene.

### 2. The plugin parameter list

`CreelSpecies` carries a `species` parameter — a structured list with the same fields. Use it when
your species are not items, or when you would rather keep them in one place.

Both routes land in the same registry, and a project can use both at once.

---

## Plugin commands

| command | what it does |
| --- | --- |
| `open` | open the catch ledger |
| `close` | close it |
| `recordCatch` | record a catch — species, and optionally a size, which keeps a personal best |
| `clearRecord` | clear the caught record |
| `countCaught` | write the number of species caught into a variable |

`recordCatch` is the only one a fishing system needs to call. Everything else is presentation.

---

## The catch ledger

The scene the package adds: a **head tally**, a **ledger column** of every declared species with
sizes, a **specimen card** drawing the selected fish at scale with its caliper and its four axes,
and a **stringer** strip of silhouettes across the foot. Uncaught species can be shown as unfilled
silhouettes or hidden entirely — one parameter.

It does not look like RPG Maker. There is no stock windowskin anywhere in it: the frame, the
typography, the wave rule and the specimen card are all drawn by this package. The in-engine
verification asserts **zero engine windows drawn** across ninety stepped frames.

---

## Compatibility

Creel **extends** the engine by prototype, saving the original in every case, and **replaces
nothing**. It adds one scene and reads the item database. It does not touch battle, movement,
menus, save-file structure or the message system, so it has no opinion about the plugins you run
alongside it.

- **Load order:** irrelevant, by construction (above).
- **VisuStella MZ Core Engine:** compatible — Creel neither patches nor requires it.
- **Your fishing system:** unaffected. Creel never intercepts input outside its own scene.
- **Your own art:** untouched. Creel draws its specimens and nothing else.

---

## Performance

A specimen is hundreds of path operations, so it is **rendered once into a cached bitmap keyed by
species and size, then blitted**. The cache is bounded and evicts deterministically. Nothing in the
update loop allocates.

Measured in-engine on the ledger scene: **update half 0.015 ms mean** against a 2 ms budget,
**2 draw calls per frame**, zero texture uploads, zero display-object growth across ninety stepped
frames.

⚠️ Specimens are lit from one fixed side, so a baked specimen is not offered for arbitrary
rotation — a fish turned ninety degrees would be lit from below. Mirroring across the vertical axis
is supported and is what a left-swimming fish needs.

---

## Saving

The caught record is versioned and round-trips losslessly, including across a version bump: a save
written by a future version loads here without losing its unknown fields. The bake cache is held
non-enumerable so it never enters a save file.

---

## Files

| file | what it is |
| --- | --- |
| `CreelSpecies.js` | species declaration, database ingestion, resolution, bake cache — **carries the parameters** |
| `CreelScene.js` | the catch ledger scene and the plugin commands |
| `CreelRender.js` | canvas drawing primitives |
| `CreelForms.js` | the 12 body plans |
| `CreelFins.js` | the 8 fin sets |
| `CreelPattern.js` | the 10 markings |
| `CreelLivery.js` | the 12 liveries |

The five corpus and drawing files carry no parameters and are safe to leave alone.

---

## Terms

One purchase covers unlimited commercial and non-commercial projects by the buyer. Redistribute the
plugin source only as part of a game — never as an asset pack. See `LICENSE.txt`.

**AI disclosure:** the code and the artwork in this package are AI-generated. There is no third
party audio or text in it.

---

*Core Systems Asset Factory · https://csaf.itch.io*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
