# Refectory: 46 Plated Dishes Drawn in Code for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Refectory: 46 Plated Dishes Drawn in Code for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-10


---

# Refectory for Godot 4

Plated dishes for Godot 4.7, drawn in code from the ingredients your cooking system used. A `RefectoryPlate2D` reads a
dish name and an ingredient list, works out what the dish IS (the form, the service vessel, the sauce, the finish, the
garnish, the portions, whether it steams) and paints the plate at runtime. No image files: change the recipe and the plate
changes, so a cooking game with 200 recipes needs no 200 sprites. The demo cookbook holds 46 dishes
on 16 vessels in 20 dish forms.

## Install

1. Copy the folder `addons/refectory/` into your project (keep the folder whole: the two fonts live in `addons/refectory/fonts/`).
2. There is no plugin to enable. Add a **RefectoryPlate2D** node (Add Node, search "Refectory") or create one in code.
3. Set `dish_name` and `ingredients`. The plate bakes on the next frame and the node shows it.

```gdscript
var plate := RefectoryPlate2D.new()
plate.dish_name = "Hunter's Pie"
plate.ingredients = PackedStringArray(["Venison", "Turnip", "Sage", "Pastry"])
plate.quality = 3
add_child(plate)
var icon: Texture2D = await plate.baked     # the plate as a texture: an inventory slot, a shop row, a close-up
```

Open `demo/demo.tscn` (the project's main scene) for the tavern menu: every dish of the cookbook plated small, the selected one
served large with its menu card. Arrows or a click choose; left alone it turns the pages every 4 seconds.

## How a recipe becomes a plate

- **The ingredients.** Each entry's head noun (its last word: "Wild Thyme" is thyme, "Chicken Stock" is stock) is read against a
  pantry of 150 food words with their kinds and colours; a word the pantry does not know is still read from its own name.
- **The form** (20): roast, fillet, stew, loaf, soup, pie, salad, skewers, porridge, broth, jerky, cake, pastry, dumplings, noodles, eggs, cheeseboard, fruit, preserves, drink. A word in the dish name decides it first ("Stew", "Pie",
  "Skewers"), then the bulk ingredient, then the balance of kinds. Force one with `component`.
- **The vessel** (16): bowl, board, trencher, skillet, tureen, platter, skewerRack, cup, pieDish, cauldron, leafWrap, breadBowl, tankard, tray, clothBundle, stoneSlab. Each form lists the vessels that make sense for it, humblest
  to grandest, and the dish's magnitude (quality, how much went in, how many things) picks one. A vessel word in the name
  ("Platter", "Tankard") wins. Force one with `vessel`.
- **The sauce** (10 behaviours): jus, gremolata, glaze, dusting, charOil, herbOil, brothPool, crumb, cream, bare, read from the liquids, fats, acids and sugars.
- **The finish, garnish and steam** follow from the same reading: herbs scatter as leaves, spice as flecks, a hot dish steams,
  a salad never does. The same recipe always plates the same way (the drawing is seeded from the recipe, never random).

## RefectoryPlate2D parameters

| parameter | what it does |
| --- | --- |
| `dish_name` | The dish's name. Words in it can name the form and the vessel. |
| `ingredients` | What went into it, one ingredient per entry. |
| `component` | Force the dish form (one of the forms above); empty = read it. |
| `vessel` | Force the service vessel (one of the vessels above); empty = chosen by form and magnitude. |
| `quality` | 1 plain ... 5 a feast. Grander dishes come on grander vessels. |
| `radius` | The plate's radius in pixels, 8 to 400 (24 for an icon, 48 for a shop row, 120 for a close-up). |
| `table` | Paint the walnut table under the plate (off = a transparent plate for your own art). |
| `tint` | Modulates the whole plate and its steam. |
| `steam` | Show the steam layer (it only has wisps for a hot dish). |
| `steam_strength` | Steam opacity, 0 to 1. |
| `steam_speed` | How fast the steam breathes (1 = the original pace at 60 fps). |
| `supersample` | 1 to 4. The bake paints at this multiple of the size and brings it down (2 = smooth edges). |

Methods and signals: `set_recipe({name, ingredients, component?, vessel?, quality?})`, `get_recipe()`, `get_profile()` (what the
reading made of it: component, vessel, behaviour, portions, colours, garnish, seed), `get_texture()` and `get_steam_texture()`
(null until the first bake), `is_baked()`, `get_bake_rect()`, the static `RefectoryPlate2D.read(recipe)`, and the signal
`baked(texture)`. The texture has straight alpha, so it can go straight into a TextureRect or an ItemList.

For your own scenes, the drawing is a plain library: `refectory_plate.gd` draws through `refectory_canvas.gd`, a Canvas 2D style
API (`table()`, `plate()`, `card()` for the menu card, `steam()`), and `refectory_dish.gd` is the reading. The demo shows the table
and the menu card drawn that way. A canvas owns what it drew: keep it referenced (a member variable) while its drawing is
shown; when the last reference goes, its drawing goes with it.

## Renderers, versions, cost

- Built and tested on **Godot 4.7.2** under **Forward+** and **Compatibility** (every preset photographed under both). Older Godot
  versions were not run.
- A plate is painted on the CPU once per recipe (never per frame), then drawn as one texture. Painting cost grows with the radius
  and the dish. The steam layer is a second texture that only moves and fades.
- Plates bake one frame after they are added or changed; in a headless run there are no pixels, so no texture is made (the reading
  still works).
- Plates take turns: one plate is painted per frame, so fifty plates added at once fill in one by one over about fifty frames
  instead of freezing a single frame (a large menu shows its plates arriving; `baked` fires for each).

## The 46 demo dishes (preset ids)

Each is a scene in `demo/presets/<id>.tscn`: a RefectoryPlate2D with that recipe.

| id | dish | form | vessel | ingredients |
| --- | --- | --- | --- | --- |
| `hearthside-boar-roast` | Hearthside Boar Roast | roast | board | Boar Haunch, Coarse Salt, Wild Thyme, Honey |
| `river-trout-in-vine-leaf` | River Trout in Vine Leaf | fillet | leafWrap | River Trout, Lemon, Butter, Dill |
| `winter-root-stew` | Winter Root Stew | stew | tureen | Beef Shin, Turnip, Carrot, Barley, Beef Broth, Bay Leaf |
| `millers-rye-loaf` | Miller's Rye Loaf | loaf | board | Rye Flour, Water, Salt, Caraway |
| `morel-broth` | Morel Broth | broth | cup | Morel, Chicken Stock, Chive |
| `hunters-pie` | Hunter's Pie | pie | pieDish | Venison, Turnip, Pastry Dough, Sage |
| `spring-cress-salad` | Spring Cress Salad | salad | trencher | Cress, Lettuce, Radish, Vinegar, Oil |
| `coal-fired-skewers` | Coal-Fired Skewers | skewers | skewerRack | Mutton, Onion, Paprika, Oil |
| `oat-porridge-with-cream` | Oat Porridge with Cream | porridge | bowl | Oat, Milk, Cream, Honey |
| `smoked-eel-bundle` | Smoked Eel Bundle | jerky | clothBundle | Eel, Salt, Smoke |
| `honey-almond-cake` | Honey Almond Cake | cake | platter | Flour, Honey, Egg, Butter, Nut, Cinnamon |
| `plum-turnover` | Plum Turnover | pastry | board | Pastry, Plum, Sugar, Butter |
| `steamed-pork-dumplings` | Steamed Pork Dumplings | dumplings | bowl | Pork, Dough, Ginger, Chive |
| `long-noodles-in-broth` | Long Noodles in Broth | noodles | breadBowl | Noodle, Stock, Pepper, Chive |
| `skillet-eggs-and-bacon` | Skillet Eggs and Bacon | eggs | skillet | Egg, Bacon, Pepper, Butter |
| `cellar-cheese-board` | Cellar Cheese Board | cheeseboard | board | Cheese, Curd, Fig, Bread |
| `orchard-fruit-bowl` | Orchard Fruit Bowl | fruit | bowl | Apple, Pear, Grape, Cherry |
| `bramble-berry-preserve` | Bramble Berry Preserve | preserves | clothBundle | Berry, Sugar, Lemon |
| `innkeepers-barley-soup` | Innkeeper's Barley Soup | soup | bowl | Barley, Stock, Pumpkin, Leek, Parsley |
| `salt-cured-ham-haunch` | Salt-Cured Ham Haunch | roast | stoneSlab | Pork Haunch, Salt, Clove, Smoke |
| `dragon-rib-roast` | Dragon Rib Roast | roast | stoneSlab | Dragon Ribs, Ember, Salt, Pepper |
| `griffin-egg-scramble` | Griffin Egg Scramble | eggs | trencher | Griffin Egg, Butter, Chive |
| `mana-broth` | Mana Broth | broth | bowl | Mana, Water, Anise |
| `hardtack-ration` | Hardtack Ration | loaf | clothBundle | Flour, Water, Salt |
| `slime-jelly-tart` | Slime Jelly Tart | pie | board | Slime, Sugar, Dough |
| `woodcutters-bean-pot` | Woodcutter's Bean Pot | stew | cauldron | Bean, Bacon, Onion, Stock, Bay |
| `fishermans-chowder` | Fisherman's Chowder | soup | cup | Cod, Clam, Milk, Potato, Pepper |
| `crab-legs-on-stone` | Crab Legs on Stone | fillet | stoneSlab | Crab, Butter, Lemon, Salt |
| `goose-and-sage-trencher` | Goose and Sage Trencher | roast | trencher | Goose, Sage, Onion, Butter |
| `pigeon-pasty` | Pigeon Pasty | pie | board | Pigeon, Pastry, Mushroom, Pepper |
| `saffron-rice` | Saffron Rice | porridge | bowl | Rice, Saffron, Stock, Butter |
| `ale-braised-ox-cheek` | Ale-Braised Ox Cheek | stew | breadBowl | Ox Cheek, Ale, Onion, Bay, Barley |
| `tavern-brown-ale` | Tavern Brown Ale | drink | tankard | Ale, Barley, Water |
| `ewes-milk-curd` | Ewe's Milk Curd | cheeseboard | stoneSlab | Curd, Milk, Salt, Mint |
| `herb-roast-turnips` | Herb-Roast Turnips | roast | board | Turnip, Rosemary, Thyme, Oil |
| `wayfarers-jerky` | Wayfarer's Jerky | jerky | clothBundle | Venison, Salt, Pepper, Smoke |
| `voidcap-skewers` | Voidcap Skewers | skewers | platter | Void Cap, Oil, Salt |
| `baked-turnip` | Baked Turnip | roast | trencher | Turnip |
| `roast-goose-feast` | Roast Goose Feast | roast | stoneSlab | Whole Goose, Apple, Sage, Chestnut, Butter, Onion |
| `harvest-seed-loaf` | Harvest Seed Loaf | loaf | stoneSlab | Rye Flour, Wheat, Seed, Butter, Honey |
| `honey-seed-cake` | Honey Seed Cake | cake | clothBundle | Flour, Honey, Seed, Butter, Egg |
| `pan-fried-dumplings` | Pan-Fried Dumplings | dumplings | skillet | Pork, Cabbage, Dough, Ginger, Oil |
| `salmon-fillet-platter` | Salmon Fillet Platter | fillet | platter | Salmon, Dill, Lemon, Butter, Coarse Salt, Cress |
| `quince-jelly` | Quince Jelly | preserves | stoneSlab | Quince, Sugar, Lemon |
| `fig-and-grape-fruit-platter` | Fig and Grape Fruit Platter | fruit | platter | Fig, Grape, Pear, Honey, Walnut |
| `frost-berry-tart` | Frost Berry Tart | pie | tray | Pastry, Frost Berry, Cream, Sugar |

## Licence

See LICENSE.txt: use it in any number of games, commercial or free; no resale of the files as a pack. The two fonts in
`addons/refectory/fonts/` are SIL OFL 1.1 (their licences are beside them). The pack is AI-generated: the code, the presets and
the demo were written by an AI, and every plate is computed by that code.

Made by Core Systems Asset Factory: https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
