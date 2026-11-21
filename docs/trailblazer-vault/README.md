# Trailblazer Vault: hop ledges, fences and gaps on your own map, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Trailblazer Vault: hop ledges, fences and gaps on your own map, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-21


---

# Trailblazer Vault for RPG Maker MZ

**Hops over your own map, drawn from your own tiles.** Walk off a ledge and the party drops over it at once. Push against
a fence, a log or a narrow stream and the party vaults it. The hop itself is MZ's own jump; what Vault adds is what a
player sees: a shadow on the ground in that ground's own colour that shrinks as the party rises, chips of the ground kicked
up at takeoff and thrown out at landing (cut from the tile's own pixels), a puff of dust in the ground's light tones,
pebbles that crumble from a ledge's own face, a squash and stretch on the sprite, and a dotted guide that traces the real
arc before the hop and fills while the party pushes.

Free plugins already make a party jump. This one is the drawn hop. Every jump on the map can get it, a move route's Jump
included.

It works on its own. It is also part 3 of Trailblazer, a set of plugins about things a player can do to your own map; you
do not need any other part.

Version 1.0.0 · Core Systems Asset Factory

---

## Install

1. Copy the two files from `js/plugins` into your project's `js/plugins` folder: `TrailblazerVaultCore.js` and
   `TrailblazerVault.js`.
2. In the Plugin Manager, add both and switch them ON. Their order does not matter: TrailblazerVault.js finds the core
   the first time it needs it. If the core is missing, nothing hops and the browser console (F8 in a playtest) asks you to
   switch it on.
3. Mark what can be hopped (below). Until you do, nothing hops.

---

## What can be hopped

**Ledges are one-way.** The party drops over a ledge the moment it walks into it, in the **Ledge directions** (`down` by
default; `sides` adds left and right; `any` is all four). Walking at a ledge from any other side does what it always did.

**Hop cells are two-way.** A fence, a log, a hedge or a stream is vaulted after the party pushes against it for **Push
before hop** frames (10 by default; 0 = at once). A hop can cross up to **Longest hop** marked cells in a row (2 by
default, so a two-cell stream is one hop) and lands on the first cell after them.

Mark cells in any of three ways:

**1. A region.** Set **Ledge region** and **Hop region** (for example 53 and 52) and paint them on the cells.

**2. A terrain tag.** Set **Ledge terrain tag** and **Hop terrain tag**, or name them in a tileset's **Note** box, and give
those tags to tiles in the Database (a fence tile, a ledge tile). When a parameter is set it applies to every tileset and
that note is not read; leave it at 0 to give each tileset its own tag with a note:

```
<Vault Ledge Tag 6>
<Vault Hop Tag 7>
```

**3. An event.** Put `<Vault>` in an event's Note box (or in a comment on its page) and the party can hop over that event:
a fallen log, a fence event, a sleeping dog.

**Where a hop lands.** On the first cell past the marked run, if the party could walk into that cell from that side and
nothing stands on it. Otherwise there is no hop and nothing happens, as before. A ledge cell may be walkable ground or a
wall: either way the party drops over it in a ledge direction and never walks onto it; from below, from the side, or with
its landing blocked, a move into a ledge only turns the player to face it. (With hopping turned off by Allow Hopping or
Needs switch, the map is exactly as it was.)

---

## What a player sees

- **The shadow.** While a character is in the air, a shadow sits on the ground under it, in the colour of that ground:
  green on grass, blue on water, brown-grey on a path. It shrinks and fades as the character rises. MZ draws no shadow
  under a jumping character; this one is read from your tileset.
- **Chips and pebbles.** At takeoff, chips of the ground are kicked back; at landing they are thrown out to both sides.
  Each chip is a small square cut from the tile's own pixels (6 px on a 48 px tile, whatever your art's pixel size) with a
  rim in that ground's shadow tone, so a grass chip reads over grass.
  A ledge sheds pebbles from its own face.
- **Dust.** A puff of dust in the ground's light tones spreads out at takeoff and at landing, shaded underneath so it
  shows on a pale path too.
- **Squash and stretch.** The sprite stretches at takeoff and squashes at landing, keeping its volume, and is back to its
  own size when it settles. A scaled sprite is drawn with the engine's own smoothing, so pixel art looks a little soft
  while it squashes. Turn **Squash and stretch** off if another plugin already scales your characters.
- **The guide.** Facing a hop the party can make, five dots trace the real arc of it (computed from MZ's own jump). While
  the party pushes, the dots fill one by one; when the last one fills, it vaults.

**Drawn hop for** chooses who gets the shadow, the chips and the dust: `everyone` (the default: every jump on the map, an
event's move route Jump included) or `party` (only the player and followers). A character the player cannot see (a
hidden follower, a transparent or empty event) never draws one.

---

## Map note

```
<Vault Off>   no hops on this map
```

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Hop** | The player hops now, facing or in a direction, when a hop is there to make (no push needed; Needs switch is not checked: the event decides). |
| **Allow Hopping** | Turn hopping on or off (saved with the game). |

---

## Script calls

For a Conditional Branch (Script) or a Script event command:

```
TrailblazerVault.canHop(d)     true when the player could hop in direction d now (2, 4, 6, 8; 0 = facing;
                               it checks Needs switch, as the arrow keys do)
TrailblazerVault.hop(d)        hop now, if a hop is there
TrailblazerVault.kindAt(x, y)  0 nothing, 1 a hop cell, 2 a ledge
TrailblazerVault.hopCount()    hops the party has made (saved)
```

---

## Parameters

| Parameter | Default | |
| --- | --- | --- |
| Ledge region | 0 | a region id for ledges (0 = off) |
| Hop region | 0 | a region id for fences, logs and gaps (0 = off) |
| Ledge terrain tag | 0 | a terrain tag 1-7 for ledges (0 = off) |
| Hop terrain tag | 0 | a terrain tag 1-7 for fences, logs and gaps (0 = off) |
| Ledge directions | down | down, sides (down, left, right) or any |
| Longest hop (cells) | 2 | 1 to 3 marked cells in one hop |
| Push before hop (frames) | 10 | 0 to 120; ledges never wait |
| Needs switch | 0 | a switch that must be ON (0 = always) |
| Hop guide | ON | the dotted arc when facing a hop |
| Drawn hop for | everyone | everyone or party |
| Squash and stretch | ON | stretch at takeoff, squash at landing |
| Sound: hop / land | Jump1 / Move1 | any sound in your audio/se folder (hop at volume 80, landing at 70); blank = none |

---

## Saves, speed and compatibility

**Saves.** A save keeps two things: whether hopping is turned off, and how many hops the party has made. A save made before
the plugin was installed loads with hopping on.

**Speed.** Every ground picture on a map (up to 600 different ones; past that a cell takes the map's average colour and
throws no chips) is read from the tileset in one pass while the map fades in. After that a hop reads no pixels at all,
and the per-frame loop allocates nothing (a hop, a landing or a change of facing allocates a little, once). Measured in the real engine (headless Chrome, a hop every 24
frames round every kind of hop on the demo map while an event jumps too): **10** draw calls a frame, inside the 60
the studio's gate allows.

**Compatibility.** Trailblazer Vault extends four MZ methods and replaces none of them:
`Game_Player.prototype.executeMove`, `Game_Map.prototype.setup`, `Spriteset_Map.prototype.createLowerLayer` and
`Spriteset_Map.prototype.update`. Three always call the original. `executeMove` calls it for every move except the two
Vault takes over: a move into a ledge it hops, and a move onto a ledge it refuses. Put it below VisuStella's Core Engine if you use it; it has no other order requirements.
Any jump made through MZ's own jump (a move route's Jump) gets the drawn hop; a jump plugin
that moves characters some other way does not (not tested with other jump plugins). A plugin that walks the player
over obstacles on its own (an auto-jump) and Vault would both act on the same fence: use one of them on a map.

---

## What it does not do

- It does not find ledges and fences by itself: you mark them by region, tag or note.
- A hop is MZ's own jump, so followers land where the player lands and then fall in behind, as they always do after a
  jump.
- A cell painted into a parallax picture has no tiles to read: a shadow there takes the map's average colour (a neutral
  shade on a map with no tiles at all), and it throws no chips.
- Hops are tested with the keyboard and the Hop command. With touch or the mouse, MZ walks toward the touched spot
  through the same move, so a ledge or fence on that path may be hopped, but that was not tested; the Hop command
  always works.
- RPG Maker MZ only (tested on 1.10.0), not MV.

---

## Credits, licence and AI disclosure

Made by Core Systems Asset Factory. See `LICENSE.txt` for the full terms: use it in any number of games, commercial or
free, with no royalty; do not resell or redistribute the plugin files.

This product was made with AI tools. The code was produced with AI assistance, and everything it draws in your game
(the shadows, the chips and pebbles, the dust, the hop guide and the squash and stretch) is drawn at run time by that
AI-written code. The store images were made with AI tools too. No image files, no sounds and no authored narrative text
ship with it.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
