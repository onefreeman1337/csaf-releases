# Refectory — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Refectory  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/refectory  
**Docs published:** 2026-11-05


---

```
  ┌───────────────────────────────────────────────┐
  │                                               │
  │                 R E F E C T O R Y             │
  │              ──────────  ◆  ──────────        │
  │             The finished dish, plated.        │
  │                                               │
  │              RPG MAKER MZ PLUGIN · v1.0.0     │
  │                                               │
  └───────────────────────────────────────────────┘
```

Whatever your cooking or crafting system makes, **Refectory plates it.** It reads the
ingredients that actually went into a dish and draws the meal your players see: a service
vessel chosen from the kind of dish and how grand it is, a principal component built from
those ingredients, a sauce that behaves like a sauce, garnish placed by rules, steam if it
is hot, and a hand-set menu card naming the dish and listing what went in.

Change the ingredients and the picture changes. **Nothing here is an image file.** Every
plate is drawn in code at run time, so a dish you invent tomorrow is drawn tomorrow without
anyone opening a paint program.

---

## What is in the box

| | |
| --- | --- |
| `js/plugins/RefectoryRender.js` | Drawing primitives: one light direction, the pantry palette, the seeded generator, lit masses, garnish placement, the shipped typefaces. Knows nothing about RPG Maker. |
| `js/plugins/RefectoryDish.js` | The reading. Turns an ingredient list into a dish profile — component, vessel, sauce behaviour, colour, portions, char. Knows nothing about RPG Maker. |
| `js/plugins/RefectoryPlate.js` | The drawing. Sixteen service vessels, twenty principal components, ten finishes, garnish, steam and the menu card. Knows nothing about RPG Maker. |
| `js/plugins/Refectory.js` | The scenes, plugin parameters and plugin commands. The only file that touches the engine. |
| `fonts/Refectory-Menu.woff2` | Cormorant Garamond SemiBold — the menu card's display face. |
| `fonts/Refectory-Note.woff2` | Alegreya Sans — the ingredient lines and captions. |
| `fonts/OFL-CormorantGaramond.txt`, `fonts/OFL-AlegreyaSans.txt` | The SIL Open Font Licence for each face. Both fonts are redistributable; see **Fonts and licences** below. |

---

## Install

1. Copy the four `.js` files into your project's `js/plugins` folder and switch them on in
   the Plugin Manager. The order that reads best in the list is:

   1. `RefectoryRender.js`
   2. `RefectoryDish.js`
   3. `RefectoryPlate.js`
   4. `Refectory.js`

   **Nothing depends on that order.** Every file looks its siblings up the first time it
   needs them rather than when it loads, so any order works — including the alphabetical one
   you get by dragging the folder in, which puts the entry file first, ahead of everything it
   uses. That is the order this plugin is tested and captured in.

2. Copy the two `.woff2` files from `fonts/` into your project's own `fonts/` folder.

   Optional but recommended. Without them the menu card falls back to Cormorant Garamond,
   Garamond or Georgia, and the ingredient lines to a system sans. **It never falls back to
   RPG Maker's own font**, and a missing font file can never stop your game from booting —
   the fonts are loaded through the browser's own `FontFace` loader, not through RPG Maker's
   `FontManager`, precisely so that a missing file is a fallback and not a crash.

   If you keep your fonts somewhere else, set the **Font folder** plugin parameter to that
   path (default `fonts/`).

---

## Making an item a dish

Put a notetag on any Item in the database:

```
<refectory ingredients: Boar Haunch, Wild Thyme, Coarse Salt, Honey>
```

That is the whole minimum. Three optional tags refine it:

```
<refectory: stew>             force the kind of dish
<refectory vessel: cauldron>  force the service vessel
<refectory quality: 4>        1 plain … 5 a feast (default 2)
```

An item that carries the tag but no ingredient list is **read from its own name**. The name
is read even when ingredients are present, because a name says things a list does not:
*Woodcutter's Bean Pot* is served in a pot, *Cellar Cheese Board* on a board, *Hunter's Pie*
as a pie.

Ingredient words the plugin has never seen still work. They contribute mass and colour by
their own shape rather than being skipped, so a homebrew pantry does not need registering
anywhere.

---

## The three places your players meet food

**Cooking result.** Call the plugin command **Serve Dish** after your crafting or cooking
plugin hands over the item — or switch on **Plate dishes as they are gained** and it happens
by itself whenever the party gains a dish on the map, from a chest, an event or a shop.

**Tavern menu.** The plugin command **Open Tavern Menu** opens a menu card of dishes with the
selected one plated beside it, its ingredients listed on its own card. Leave the dish list
empty and it lists every item in the database carrying a `refectory` notetag. Set **Sell
dishes** and choosing one buys it at its database price and then serves it.

**Item detail.** Using a dish from the Item menu plates it (on by default — **Plate a dish
when used**), and the plugin command **Show Dish** displays one from an event, with the
item's own description under its name.

---

## Plugin parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Tavern menu heading | `Tonight's Table` | The heading set at the top of the tavern menu card. |
| Served caption | `A dish is served` | The small line above the dish name when a dish is served. |
| Continue hint | `OK to continue` | The quiet line at the foot of the plate. Blank for none. |
| Price suffix | *(blank)* | Written after prices on the tavern menu. Blank uses the database currency unit. |
| Plate a dish when used | on | Using a dish item from the Item menu shows it plated. |
| Plate dishes as they are gained | off | Gaining a dish on the map shows it plated. |
| Table | `Dark walnut` | The surface every dish is served on. Four materials, each drawn rather than recoloured: **Dark walnut** and **Pale oak** are planks with flowing grain and seams, **Dark slate** is stone with cleavage striations, mineral flecks and fractures, **Linen cloth** is a woven thread grid with slubs and soft folds. |
| Table tint | *(blank)* | A hex colour such as `#2E4A6B` mixed into whichever table is chosen, so the same material can be pushed cool, warm, or toward your game's palette. Blank leaves the table as it is. |
| Font folder | `fonts/` | Where the two shipped `.woff2` files live, relative to the game root. |

## Plugin commands

| Command | Arguments |
| --- | --- |
| **Serve Dish** | *Dish item* — plate a dish item as a cooking result. |
| **Show Dish** | *Dish item* — show a dish plated, with its description. |
| **Open Tavern Menu** | *Dishes on the menu* (blank = every tagged item), *Heading* (blank = the parameter), *Sell dishes*. |

## Script calls

```js
CSAF.Refectory.serve(itemId);   // plate a database item
CSAF.Refectory.plate({ name: "Hunter's Pie",
                       ingredients: ['Venison', 'Turnip', 'Sage'] });
CSAF.Refectory.read(spec);      // the dish profile, for your own UI
```

`read()` returns the profile the renderer works from, so you can drive your own window with it
instead of ours. Among its fields: `component` (what kind of dish it is), `vessel` (what it is
served in and on), `bodyColour`, `portions`, `behaviour` (the sauce or finish) and `char`. It
also carries `componentWhy` (`name` if the dish's title decided the form, `axes` if the
ingredients did) and `vesselWhy` (`declared` from a notetag, `name` from the title, `derived`
from the ingredients), which is the fastest way to see why a dish came out the way it did.

---

## Compatibility

Tested against RPG Maker MZ with the stock scripts unmodified, **verified by running the
plugin in the real engine**, not only in tests.

Refectory adds two scenes and extends **five** core methods, every one of them by saving the
original and calling through to it:

- `Game_System.prototype.initialize`
- `Scene_Boot.prototype.start`
- `Scene_Item.prototype.useItem`
- `Game_Party.prototype.gainItem`
- `Scene_Map.prototype.update`

**It replaces nothing.** Because nothing is clobbered, Refectory co-exists with other plugins
that patch the same seams, including large suites such as VisuStella MZ.

Saves are versioned and forward-compatible: a save made before Refectory was added loads
normally, and a save made with Refectory loads in a project where it has been switched off.

---

## Fonts and licences

Both typefaces ship under the **SIL Open Font Licence 1.1**, which permits redistribution
inside a game:

- **Cormorant Garamond** — Copyright 2015 the Cormorant Project Authors. Licence in
  `fonts/OFL-CormorantGaramond.txt`.
- **Alegreya Sans** — Copyright 2013 The Alegreya Sans Project Authors. Licence in
  `fonts/OFL-AlegreyaSans.txt`.

Keep those two licence files with the fonts if you ship the fonts. The plugin code itself is
covered by `LICENSE.txt` in this folder.

---

## Support and the rest of the shelf

Refectory is one of a shelf of RPG Maker MZ plugins that generate what your players look at
rather than shipping picture files. **Formulary** draws the recipe; Refectory draws the meal;
they are built to sit side by side.

Everything is at **https://csaf.itch.io** — questions and bug reports on the product page's
community tab get answered.

---

*Refectory · Core Systems Asset Factory · v1.0.0*
*Built with AI assistance: code yes, graphics yes, sounds no, text and dialog no.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
