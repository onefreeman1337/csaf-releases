# Ajar - Searchable Furniture for RPG Maker MZ: Drawers, Lids, Sacks and Shelves in Your Own Tileset Open — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Ajar - Searchable Furniture for RPG Maker MZ: Drawers, Lids, Sacks and Shelves in Your Own Tileset Open  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/ajar  
**Docs published:** 2026-11-05


---

# Ajar for RPG Maker MZ

**Search the furniture in your own tileset, and watch it open.** A drawer slides out toward the camera and the dark
inside shows. A barrel's lid lifts, tips and comes to rest askew on its rim. A sack's tie lets go and its top sinks
into a collar round a dark mouth. Books tip out of line on a shelf. What the event gives rises out of the opening as its own
icon, and a searched piece **rests ajar**, so the player can see which drawers they have already been through.

Every moving pixel is cut from the furniture tile you painted. No opening sprite sheets, no frames to draw.

Version 1.0.0 · Core Systems Asset Factory

---

## Install

1. Copy the two files from `js/plugins` into your project's `js/plugins` folder: `AjarCore.js` and `Ajar.js`.
2. In the Plugin Manager, add both and switch them ON, AjarCore.js above Ajar.js (the Plugin Manager suggests that
   order). If they end up the other way round it still works: Ajar.js finds AjarCore.js the first time it needs it.

---

## Mark a piece

1. Make an event and give it a **tile** as its graphic: the dresser, barrel, jar or bookcase from your own tileset
   (tabs B to E), exactly as you would for a stock container.
2. Write the kind in the event's **Note** box:

```
<ajar: drawer>
```

That is all. The event's commands stay yours: Show Text, Change Items, a loot plugin, anything. Ajar reads the tile's
pixels once when the map loads and works out how it opens.

| Kind | It opens like this | Also written as |
| --- | --- | --- |
| `drawer` | a drawer slides out toward the camera, its sides and the dark inside showing | dresser, desk, cabinet, nightstand |
| `lid` | the lid lifts, tips, and comes to rest askew; its shadow falls into the mouth | barrel, crate, jar, pot, urn, basket, box |
| `sack` | the tie loosens, the top sinks into a collar round a dark mouth, the body slumps | bag, pouch |
| `shelf` | one book is pulled toward the camera, two more lean out of line | bookshelf, bookcase |

**Which drawer.** Ajar finds the drawer fronts in the picture (light panels between darker seams) and opens the top
front that has a handle. To choose: `<ajar: drawer 2>` opens the 2nd front from the top; `<ajar: drawer all>` opens
every front, one after another.

**Which lid.** Ajar finds the rim where the colour breaks across the piece. To set it yourself: `<ajar: lid rim 12>`
(the lid is the top 12 pixels). `<ajar: lid left>` sets the lid down to the left instead of the right. Handles that
stick out at rim height stay on the pot.

**Bigger pieces.** A desk two tiles wide or a bookcase two tiles tall: give EVERY tile of it its own event with the same
note, and it opens as one piece. Tiles join only when they sit side by side on your tileset the same way they sit on
your map, so a dresser placed beside a desk stays its own piece. `nogroup` in a note keeps that piece apart.

On our test furniture (66 pieces from six tilesets, drawn in three styles, plus MZ's own Inside set) Ajar found the
moving part of every piece from its pixels alone.

---

## The search

When the player searches a marked event (Action Button, Player Touch or Event Touch), it opens, and the event's own
commands run.

- **What it gives rises out of it.** If the page gives something (Change Items, Change Weapons, Change Armors or Change
  Gold, increased by a constant), that item's icon rises out of the dark inside. Gold shows the **Gold icon**.
- **An empty search shakes out a little dust** instead (turn it off with `nodust` in a note, or the parameter).
- **Then it rests ajar.** A drawer stays half out, a lid stays askew, a sack stays open. The record of what has been
  searched is saved with the game and survives leaving the map.
- **Searching again** opens it again from where it rests. The stock pattern works as it always has: the first page
  gives the item and turns Self Switch A on, the second page (Self Switch A) says it is empty, and Ajar shakes dust.

**Glint (opt in).** A faint four point glint on pieces nobody has searched yet: the **Glint** parameter for every
piece, or `glint` in one note. `noglint` turns it off for one piece.

**Manual pieces.** `manual` in a note: the event never opens by itself; open it from the plugin commands.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| Search Piece | opens it the way a search does (the found icon rises, or dust), then it rests ajar |
| Open Piece | opens it fully, with no search (for cutscenes) |
| Close Piece | closes it |
| Forget Search | closes it and marks it unsearched again (a stash that refills) |
| Show Found Icon | rises any icon out of an open piece, for a loot plugin that does not use Change Items |

Event ID 0 means the event running the command.

---

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Open time | 16 | frames a piece takes to open |
| Hold open | 40 | frames a searched piece stays fully open before it settles (it also waits for the event to finish) |
| Searched pieces rest | ajar | `ajar`: a drawer half out, a lid askew. `open`: fully open. `closed`: shut again |
| Found item rises | true | the icon of what the page gives rises out of the piece |
| Rise time | 54 | frames the icon takes to rise and fade |
| Gold icon | 314 | the IconSet index shown when a search gives gold |
| Dust on an empty search | true | |
| Glint on unsearched pieces | false | |
| Glint interval | 300 | frames between two glints on one piece |
| Sound: drawer, lid, sack, shelf | none | a sound from your audio/se folder, one per kind |

---

## Saves, speed and compatibility

**Saves.** A save keeps which pieces have been searched, nothing else: one short entry per piece. A save made while a
piece is moving resumes it.

**Speed.** Each piece's picture is read once, while the map fades in, and every frame of its opening is made then.
Searching afterwards reads no pixels at all. Measured in the real engine on our showroom (17 pieces, one searched every
10 frames): **11** draw calls a frame and no texture uploads, inside the limits we hold every plugin to.

**Compatibility.** Ajar extends MZ's event, character sprite and map spriteset code without replacing any of it (every
original is called). It changes no window or menu. A Change Tileset event is handled: the pieces are read again from
the new tileset.

**With our other plugins.** Hinged cupboard and wardrobe doors are Threshold's (`<threshold: door>`); breaking a barrel
is Smithereens' (`<smash>`). An event that carries `<threshold>` or `<smash>` belongs to that plugin and Ajar leaves it
alone.

---

## What it does not do

- It decides nothing about loot: what is found is your event's business.
- The inside of a drawer or a jar is never guessed: it is darkness, and the found item rises out of it.
- Treasure chests and hinged doors are not in scope. Neither are pieces drawn on the map layers: a piece is an event
  with a tile graphic, as in stock MZ.
- `shelf` is drawn for books. On a shelf of bottles or jars it still works, but the item that tips out shows a book's
  pale page edge on top.

---

## Credits, licence and AI disclosure

Core Systems Asset Factory. See LICENSE.txt.

The code in this product was produced with AI assistance. No images, sounds or authored narrative text ship with it.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
