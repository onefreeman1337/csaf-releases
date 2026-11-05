# Table Service - Restaurant Serving Minigame on Your Own Map for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Table Service - Restaurant Serving Minigame on Your Own Map for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/table-service  
**Docs published:** 2026-11-05


---

# Table Service for RPG Maker MZ

**A serving rush played on the map you already built.** Customers walk in and take the seats at your own tables. They
ring for service, order, wait for the kitchen, eat, pay and tip, or run out of patience and walk out. The player
carries the dishes from the pass to the right tables, two at a time. When the last party leaves, the night's ledger
opens, and the result goes back to your events.

No separate minigame scene: the shift runs on your map, with your player walking your floor.

Everything the plugin shows during a shift is drawn by the plugin: the customers, their dishes, the order tickets, the
candles that burn down as their patience runs out, the service bell, the dishes waiting at the pass, the server's tray,
the tags that float up from the tables, the opening sign and the ledger. Nothing is loaded from an image file.

## Every dish is drawn from its own name

Name a dish in your database and the plugin reads the name and draws it. **Pumpkin Soup** comes in a bowl the colour of
pumpkin. **Pale Ale** is a wooden tankard with a head of foam. **Honey Loaf** is a scored loaf, **Grilled Trout** a
whole fish with a slice of lemon, **Apple Pie** a wedge with its filling showing, **Mulled Wine** a stemmed glass.

It knows about 170 words for 19 kinds of dish: bottle, mug, cup, glass, soup, stew, pie, cake, bread, fish, roast,
sausage, steak, noodles, rice, egg, cheese, salad and fruit, and it reads colour words too (pumpkin, honey, berry,
mint, blue and more). Drinks are read before food, so **Herbal Tea** is a cup and not a salad. A name it does not know
still gets a plated dish, the same one every time. Two potions of the same colour still differ: bottles come in three
shapes.

## Every customer is generated

Unless you give it your own character sheets, every party is drawn fresh from a seed: skin, hair colour and style
(short, bob, long, bun, ponytail, crop), a hat or none (flat cap, wide brim, hood, beret, headscarf), a coat colour, a
shirt, and sometimes a scarf, glasses, a beard or an earring. Each is drawn seated, in MZ's own proportions, facing the
way your seat event faces, with a dark outline like MZ's own character art.

## Installing

Copy the three files into `js/plugins` and add them in the Plugin Manager in this order, top to bottom:

1. `ServiceCore.js`: the rules of the shift
2. `ServiceDraw.js`: the drawing
3. `Service.js`: the commands, the parameters and the map

## Setting up a floor (three steps)

1. **Seats.** On your dining map, place an event where each customer should sit (on the chair) and write `<Table>` in
   the event's Note box. `<Table: 4>` gives it table number 4; without a number, tables are numbered in event order
   after the numbered ones. A comment `<Table>` on the event's first page works too. Set the event's direction to face
   the table: the customer faces that way, and their plates and candle go on that tile.
2. **The pass.** Place one event on the kitchen counter and write `<Pass>` in its Note (or a comment). Finished dishes
   wait there.
3. **Start.** Call the plugin command **Service > Start Shift** from any event: a waiter, a door, a notice.

The event that starts the shift carries straight on (it does not wait), so the player can move. Use the command's
**Switch ON when done** or **Common event when done** to continue your story after the ledger closes.

## Playing a shift

- A customer with a **ringing bell** over them wants to order: walk up, face them and press **OK** (or click them).
- A customer with a **ticket** over them is waiting for food. The ticket names each dish; a tick marks what has come.
- At the **pass**, OK picks up the first dish waiting. The server has **two hands**. With both hands full, OK at the
  pass swaps (the first dish carried goes back, the next comes up); with nothing ready, OK puts a carried dish back.
- OK at the customer hands over any of **their** dishes you carry. A dish for another table is refused
  ("Not their order") and stays in your hand.
- Every waiting customer has a **candle** on their table. It burns while they wait for you and for the food (not while
  they eat). If it goes out, they walk out, and anything cooked for them is wasted.
- The **tray** in the corner shows your two hands (each dish with its table number), the tips so far, the parties
  served and walked out, and a clock that sweeps once across the shift.
- When a ticket is over the spot where you stand, it goes see-through so you can see yourself.

A served party eats for 10 seconds, then pays and leaves. **The tip** is 5% of the bill plus 35% times the share of the
candle left when their food arrived: serve fast and a party tips up to 40% of the bill.

When the last party has left, **the ledger** opens: parties served, dishes brought, takings, tips, walkouts, the longest
wait, the best run served in a row, a tick or cross for every party, the takings and tips as stacks of coins, the
night's favourite dish, and the stars. OK (or Escape, or a click) closes it.

**Stars:** three for a full house (every party served and tips at least 60% of the most they could have been), two for
a good night (at least 80% served and tips at least 35%), one for a fair night (at least half served), none for a
rough one.

## Difficulty

| Difficulty | Parties | Patience | Shift (arrivals) |
| --- | --- | --- | --- |
| easy | 8 | about 40 s | 90 s |
| normal | 12 | about 35 s | 105 s |
| busy | 15 | about 31 s | 120 s |

Patience varies 15% either way from party to party, a party orders one dish or (about one time in three) two, and
arrivals come faster as the shift goes on. Measured over 60 simulated nights per row on a 6-seat cafe beside the pass,
with a server who works well (delivers what is ready, then takes the order of whoever has least patience left):

| Difficulty | Stars 0 / 1 / 2 / 3 |
| --- | --- |
| easy | 0 / 0 / 26 / 34 |
| normal | 0 / 1 / 55 / 4 |
| busy | 0 / 18 / 42 / 0 |

A careless server (one party at a time, one dish at a time) earned no stars in any of the 60 normal or busy nights.
**Your floor matters:** on an 8-seat hall with longer walks to the pass, the same good server earned one star fewer
(normal: 1 / 31 / 28 / 0). Put the pass near the tables for a gentler night.

## The menu

With the command's **Menu** left blank, every item with `<Menu>` in its note is served. If no item has it, the
**House menu** parameter is served: 16 dishes from Roast Fowl to Mana Tonic, so a shift works in a blank project with
no database setup at all. Or name item ids in the command (`12, 13, 15`) to serve exactly those.

Item notetags:

| Tag | Meaning |
| --- | --- |
| `<Menu>` | Serve this item when the command's menu is blank. |
| `<Price: 40>` | What it costs a customer. Default: the item's price (10 if that is 0). |
| `<Cook: 5>` | Seconds in the kitchen. Default by kind: a drink 2.5 s, a bowl, salad, bread, fruit or cheese 3.7 s, anything else 5.3 s. |
| `<Dish: soup>` | How to draw it, if the name does not say: bottle, mug, cup, glass, soup, stew, pie, cake, bread, fish, roast, sausage, steak, noodles, rice, egg, cheese, salad, fruit or plate. |
| `<Dish Colour: blue>` | Its colour: red, orange, amber, yellow, green, blue, purple, pink, brown, cream, gold or dark. |

## Plugin parameters (Service.js)

| Parameter | Default | Meaning |
| --- | --- | --- |
| House menu | 16 dishes | One dish a line, `Name: price`. Used when no item is named or tagged. |
| Customer sheets | blank | Blank draws every customer fresh. Or list character sheets with an index, `People1:0, People1:3, People2:5`; each party is cut from one of them, facing the seat's way. |
| Allow menu in a shift | false | Can the player open the menu during a shift? (The shift pauses while it is open.) |
| Tray corner | bottom-left | Where the server's tray sits: bottom-left, bottom-right, top-left or top-right. |
| Sound: seated / order taken / dish ready / served / walked out | blank | Sound effects from your project's `audio/se`. Blank is silent. |

## Plugin commands

**Start Shift**

| Argument | Default | Meaning |
| --- | --- | --- |
| Difficulty | normal | easy, normal or busy. |
| Title | blank | Shown on the opening sign and the ledger. Blank uses the map's display name. |
| Menu (item ids) | blank | See The menu above. |
| Pay the party | tips | What goes into the party's gold when the ledger closes: nothing, tips, or everything (takings and tips). |
| Takings / Tips / Stars -> variable | 0 | Variables that receive the night's takings, tips and stars (0 to 3). 0 = none. |
| Switch ON when done | 0 | Turned ON when the ledger closes. |
| Common event when done | 0 | Run when the ledger closes. |
| Seed | blank | Blank deals a new night every time; a number replays the same night. |

**End Shift Now** closes the floor at once and opens the ledger. Parties still waiting are not served.

## Script calls

- `Service.isOpen()`: true while a shift runs or its ledger is open.
- `Service.lastResult()`: the last night as `{ served, parties, walkouts, covers, takings, tips, stars, grade,
  bestStreak, difficulty, seed }`, or `null` before the first.

## Saving, pausing, and other maps

The shift is saved with the game and picks up where it was on load. It pauses while a message is showing (the tray
hides so it cannot sit under the message box), while another event is running, while the menu is open, and whenever
the player is on a different map. It lives in `$gameSystem._csafService`, versioned, and a save made before you
installed the plugin loads cleanly.

## The demo room

`Demo/img/parallaxes/!TableService_Demo.png` is a painted dining room, 816 x 624, for a 17 x 13 map (the `!` makes it
scroll with the map), and `Demo/img/characters/$TableService_Server.png` is a server in an apron. The store images
were taken on that room. To use it: copy the two files into your project's `img` folders, make a 17 x 13 map with the
parallax set to `!TableService_Demo` and "Show in the editor" ticked, block the walls, counter, tables and plants with
any impassable tile, and place the events: `<Table>` seats at (3,4), (13,4), (3,8), (13,8) facing down, at (6,7)
facing left and (10,7) facing right; `<Pass>` at (8,2).

## Compatibility

Table Service replaces nothing. It extends five engine methods, each saved and called:

- `Game_Map.prototype.update` (runs the shift one frame after the map)
- `Game_Player.prototype.checkEventTriggerThere` (OK or a click on a seated party or the pass is a service action;
  anything else is passed on)
- `Game_Player.prototype.canMove` (the player stands still while the ledger is open)
- `Scene_Map.prototype.isMenuEnabled` (the menu is off during a shift unless you allow it)
- `Spriteset_Map.prototype.update` (builds and removes the floor's drawings)

Because every one of those calls the original, it sits alongside other plugins that extend the same methods; put the
three files below any core-engine plugin (such as VisuStella MZ Core Engine) in the Plugin Manager. It draws no window,
so window skin plugins do not change it. The drawings sit in the map's tilemap layer (tickets and bells above
characters), so lighting plugins that tint the map tint them too.

Tested in RPG Maker MZ's own runtime (the `rmmz_*.js` scripts) on a blank project with the stock database, with
keyboard and mouse. It has not been tested with every third-party plugin; if one clashes, tell us on the store page.

## Written with AI assistance

The code, the drawn customers and dishes, the demo images, the store images and the cover were produced with AI
assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
