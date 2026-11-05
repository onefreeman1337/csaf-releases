# Bazaar Core: Shop Economy and Trade Routes for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Bazaar Core: Shop Economy and Trade Routes for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/bazaar-core  
**Docs published:** 2026-11-05


---

# Bazaar Core — the economy under the shop

**RPG Maker MZ · v1.0.0**

Keep your shop plugin. This is the layer underneath it that decides what anything is worth.

Every shop plugin for MZ governs how a shop *looks* or *what is on the shelf*. None of them makes a
price or a stock level respond to anything. Bazaar Core does:

- **Stock is finite.** Buying a vendor out empties the shelf, and it stays empty until the market
  recovers over game days. Not an instant refill when the player walks back onto the map.
- **A price is never stored.** It is derived, every time it is asked for, from base value, this
  market's stock against what it wants to hold, its regional appetite, and any running event. So the
  economy cannot disagree with itself.
- **The same good is worth different money in different towns** — which is what makes a trade route
  a mechanic instead of a menu.

**Untracked items are left completely alone.** If you have not told Bazaar Core about an item, its
price and availability stay exactly where you or another plugin put them.

---

## Installing

1. Copy `js/plugins/BazaarCore.js`, `js/plugins/BazaarMarketUI.js` and `js/plugins/CSAF_Theme.js`
   into your project's `js/plugins/` folder.
2. In the Plugin Manager add **BazaarCore first**, then **BazaarMarketUI below it**.
   `BazaarMarketUI` needs `BazaarCore` to already be loaded and will say so in the console if it is
   not. **`CSAF_Theme` can go anywhere in the list.**
3. `BazaarMarketUI` is optional. Leave it out if you do not want the Market screen; everything else
   works without it.

> **`CSAF_Theme.js` is the custom look, and it is part of what you bought.** It replaces RPG Maker's
> default windowskin, typography and layout with procedural panels, a type scale, easing and a bloom
> filter — it is what the store screenshots show, including the per-row price gauges. **Its position
> in the plugin list does not matter:** it is adopted at boot rather than at load, so you can drop it
> anywhere. Switch it off and every window falls back to your project's normal windowskin with no
> errors. Recolour it from its parameters: accent, panel gradient top/bottom, corner radius, and
> motion.

---

## Five minutes to a living economy

### 1. Add commodities

Open **BazaarCore** in the Plugin Manager and add rows to **Commodities**.

| Field | What it is |
| --- | --- |
| `id` | Internal name, e.g. `iron_ore`. This is what events and script calls use. |
| `name` | What the player sees. |
| `baseValue` | What one unit is worth when a market holds exactly its target. |
| `volatility` | How hard the price swings. `1.0` is a staple; `2.5` is a luxury. |
| `Item Type` + `Item ID` | The database record this good trades as. |

### 2. Add markets

Add rows to **Markets**. Each one lists:

- **Stock** — one row per good, with a **quantity** (what is on the shelf now) and a **target**
  (the level at which it sells for base value). Above target the price falls; below it the price
  rises; at zero it reaches the Scarcity Ceiling.
- **Demand** — a multiplier for goods this town particularly wants. A fishing port might set
  `salt_fish` to `0.5`; a mountain town might set it to `2.0`.
- **Refuses** — goods this market will not trade at all.

### 3. Tell the game where the player is

Set **Starting Market**, then use the **Set Current Market** plugin command whenever the player
enters a town. Shop prices follow it.

### 4. Use Shop Processing exactly as you always have

No special event command. Governed items are priced and stocked by the economy; everything else is
untouched.

### 5. Let time pass

The economy has no opinion about your clock. It moves when you tell it to, with **Advance Days** —
on sleeping at an inn, on a day/night plugin firing, on a fast travel, or never, if you want a
world that holds still.

---

## Binding items without the parameter list

A commodity can name its database item, **or** the item can name the commodity. Put this in an Item,
Weapon or Armor note box:

```
<bazaar: iron_ore>
```

Either direction works. The notetag wins if both are set, because it is the one sitting next to the
thing it describes.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Set Current Market** | Choose which market the player is standing in. |
| **Advance Days** | Move the economy forward. Stock recovers; events expire. |
| **Start Market Event** | Run a `shortage`, `glut` or `embargo` on one good in one market. |
| **Set Stock** / **Add Stock** | Overwrite or adjust what a market holds right now. |
| **Read Price Into Variable** | Write what a market charges (or pays) into a game variable. |
| **Read Stock Into Variable** | Write how much a market holds into a game variable. |
| **Read Best Trade Route** | Find the most profitable good to carry between two markets. |
| **Open Market Ledger** | Open the Market screen. Needs BazaarMarketUI. |

A command naming a market or commodity that does not exist does nothing and leaves the world alone,
rather than clearing it. A typo in one event should not silently un-price every shop in your game.

---

## Script calls

Safe from a Script command or a Conditional Branch:

```js
Bazaar.price('harbour', 'iron_ore')       // what that market charges
Bazaar.sellPrice('harbour', 'iron_ore')   // what it pays
Bazaar.stock('harbour', 'iron_ore')       // how much is left
Bazaar.market()                           // current market id
Bazaar.setMarket('highlands')             // move the player
Bazaar.day()                              // days elapsed
Bazaar.advance(3)                         // move time on
Bazaar.route('harbour', 'highlands')      // best good to carry, or null
Bazaar.name('iron_ore')                   // display name
Bazaar.profit()                           // earned less spent, all game
Bazaar.event('harbour', 'iron_ore', 'shortage', 7)
```

Every one is null-safe and none of them throws. A Conditional Branch that throws stops the event
dead and reads to you as "the engine broke", which is worse than a `false`.

---

## The Market screen

`BazaarMarketUI` adds a Market entry to the main menu (switch it off in BazaarCore's parameters if
you would rather open it only from an event).

It lists every market, everything each one trades, what it charges, and how much is left. The
percentage column is the whole plugin in one number: `480%` means this town is asking nearly five
times what the good is worth, because they have run out.

The footer shows where in the world the highlighted good is **cheapest to buy** and where it
**fetches most**, with the margin per unit. That is the trade route, stated as one line.

---

## Parameters worth knowing

| Parameter | Default | What it does |
| --- | --- | --- |
| **Scarcity Ceiling** | `4.00` | The most an empty shelf alone can multiply a price by. |
| **Sell Margin** | `0.60` | What a market pays as a fraction of what it charges. Below 1, or the player prints money. |
| **Default Restock Rate** | `0.08` | Fraction of its target a market recovers per day. |
| **Economy Seed** | `24301` | Seeds restock jitter. The same seed always produces the same world. |
| **Govern Shop Scenes** | `on` | Turn off to leave every shop exactly as RPG Maker had it. |
| **Show Stock In Shop** | `on` | Draw the remaining quantity beside each governed item. |

### How the scarcity curve behaves

The multiplier is exactly `1.0` when stock equals target, exactly the Scarcity Ceiling at zero
stock, and decays smoothly as stock runs above target. There is no clamp to maintain and no
division by zero. Volatility is the exponent, so a luxury swings harder than a staple in **both**
directions — which is what makes it a luxury.

At base value 100 with a target of 40:

| Stock | 0 | 4 | 10 | 20 | **40** | 80 | 200 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Buy | 400 | 308 | 229 | 160 | **100** | 57 | 25 |
| Sell | 240 | 184 | 137 | 96 | **60** | 34 | 15 |

---

## Saving, loading, and patching a game already in progress

The whole economy rides in the save file, so a world is genuinely persistent.

When you ship an update that adds a commodity or a market, existing saves pick it up on load.
**Anything the save already knows is left completely alone** — a shelf your player emptied does not
refill because you shipped an unrelated patch. Finite stock would otherwise be a lie.

A save written before you installed this plugin loads as a fresh economy rather than an error.

---

## Compatibility

Nothing here overwrites a core method. Every hook saves the original and calls it, so this sits
alongside other shop plugins instead of fighting them.

Specifically:

- An **untracked** item takes the engine's original draw path verbatim and keeps whatever price
  another plugin gave it.
- The economy's live state is deliberately **not** stored on `$gameSystem`. It is packed into plain
  arrays for the save file instead, so it cannot collide with another plugin's save data.

Tested against the stock `Scene_Shop`. If another plugin replaces `Window_ShopBuy.prototype.price`
outright rather than aliasing it, load Bazaar Core **after** it.

---

## Known limits, stated plainly

- **Time is yours to advance.** Nothing moves the economy on its own. This is deliberate — it is
  what lets you drive it from any day/night plugin, or from nothing.
- **Building the goods list for a market is proportional to how many goods that market stocks**, and
  runs once when you open or switch markets, not per frame. Drawing is bounded by the visible page:
  measured at exactly 10 `drawItem` calls per refresh whether a market holds 2,000 stock lines or
  20,000.
- **Frame cost measured in the real engine** on the Market screen: 2.29–2.36 ms per frame, about 14%
  of the 60 FPS budget, 0 of 600 sampled frames over budget. These are frame *costs*, measured by
  stepping the engine; they are not a claim about presented frame rate on your machine.

---

## Terms of use

See `LICENSE.txt` beside this file.

---

*Bazaar Core is one of a line of MZ systems. If you want quests whose choices actually foreclose
other quests, see Chronicle Core: <https://csaf.itch.io/chronicle-core>*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
