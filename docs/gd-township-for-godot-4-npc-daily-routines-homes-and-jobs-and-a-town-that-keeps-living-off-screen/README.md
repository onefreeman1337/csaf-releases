# Township for Godot 4: NPC Daily Routines, Homes and Jobs, and a Town That Keeps Living Off-Screen — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Township for Godot 4: NPC Daily Routines, Homes and Jobs, and a Town That Keeps Living Off-Screen  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-02


---

# Township for Godot 4

**Give every NPC in your 2D town a day, and let the player see it happen.** Homes, jobs, shops that open and shut, night shifts, market days
and festivals, walked on your own TileMapLayer with doors that open. And 50 places drawn in code that respond to their people: the forge's coals
brighten when the smith arrives, the awning rolls out at opening time, a window lights after dark while someone is home, and the lamplighter's
round lights the street lamps one by one.

Where someone is depends only on the clock. A scene loaded at noon, a save, a time skip and a person in a scene you have not loaded are all simply right,
with no tracking code of yours and nothing stored but the time.

Version 1.0.0 · Godot 4.7 (run on 4.7.2; older 4.x versions were not run) · Core Systems Asset Factory

---

## Install

1. Copy `addons/township/` into your project's `addons/` folder. There is no plugin to enable and no autoload to add. Keep that path for the preset
   scenes: they name `res://addons/township/`, so a renamed folder cannot load them (Godot names the path it tried). The scripts themselves are classes
   (`Township`, `TownshipTown2D`, `TownshipPlace2D`, ...), and a place finds its looks beside its own script, so those work from any folder.
2. Open this project and run it to see `demo/demo.tscn` first: fifteen people on one street, then TAB for all 50 places.

Everything is GDScript. Nothing is loaded: no image files, no sprite sheets. `demo/fixture/` holds the demo's own map tiles (see its NOTICE.txt); you can
delete `demo/` once you have your own town.

---

## A day in a few lines

```gdscript
Township.add_person("odile", {"name": "Odile", "trade": "baker", "stops": [
	{"at": "05:00", "place": "oven", "tag": "work"},
	{"at": "13:00", "place": "square", "tag": "rest"},
	{"at": "22:00", "place": "home", "tag": "sleep"},
]})
print(Township.place_of("odile"))
```

That works anywhere, with no scene at all. **A schedule stores no end times.** The active stop is the last one at or before now, wrapping round midnight, so a
shift from 22:00 to 07:00 is the ordinary case and the broken state cannot be written down.

To see them, in your scene:

1. Add a `TownshipTown2D`. Put your TileMapLayers in its `walk_layers` (the ground) and `blocking_layers` (walls, props).
2. Under it, drop a `TownshipPlace2D` for each stop, with its `place_id` and a `look_id`, or any preset scene from `addons/township/presets/`.
3. Press Play. Everyone is spawned, walks by the clock, and wakes the places they arrive at.

`demo/high_street.json` and `demo/high_street.gd` are a whole town worked this way: copy them.

---

## A schedule

```gdscript
Township.load_town("res://my_town.json")   # or Township.define({...}), or add_person() one at a time
```

```json
{
 "weekly_day_types": {"2": "market"},
 "places": {"oven": {}, "stall": {}, "home": {}, "the_mine": {"scene": "mine"}},
 "people": {"odile": {"name": "Odile", "trade": "baker", "schedules": [
   {"id": "base", "stops": [{"at": "05:00", "place": "oven", "tag": "work"}, {"at": "22:00", "place": "home", "tag": "sleep"}]},
   {"id": "market", "day_type": "market", "stops": [{"at": "07:00", "place": "stall", "tag": "market", "pose": "sell"}, {"at": "22:00", "place": "home", "tag": "sleep"}]}
 ]}}
}
```

| A stop | Meaning |
| --- | --- |
| `at` | When they set off: `"05:30"` or a whole number of minutes since midnight. An unreadable time is dropped with a warning that names the person. |
| `place` | A place id. Declaring `places` lets `Township.check()` catch a misspelt one. |
| `tag` | Anything you like: "work", "sleep", "market". `Township.doing(id)` returns it and the board colours by it. |
| `pose` | A work pose for this stop (below). Empty = the place's own. |

| Which schedule applies | |
| --- | --- |
| no conditions | The base. Always the fallback, so resolving can never fail. |
| `"day_type": "market"` | `Township.set_day_type("market")` for today or any date, or `weekly_day_types` by weekday. |
| `"days": [0, 3]` | Weekdays, counted by `Township.days_in_week` (7). |
| `"when": "rain"` or `"!rain"` | `Township.set_flag("rain", true)`. |
| `"when": {"var": "chapter", "op": ">=", "value": 2}` | `Township.set_var("chapter", 2)`. Ops: `==` `!=` `>` `>=` `<` `<=`. |
| `"priority": 5` | Highest wins. Conditions are data, never code. |

Yesterday's last stop holds until today's first, even when yesterday used a different schedule.

Leave people time to walk. If the next stop comes before they arrive, they turn from wherever they have got to and go on, and that place does not wake. The town warns once, in words, when the scene loads, and `check_walks()` lists every such stop.

---

## Township: the clock and the questions

All static. It lives on the class, so it survives every scene change, and the clock runs from a small node it adds to the tree root the first time you use it.

| Clock | |
| --- | --- |
| `now`, `minutes_per_second` (1.0 = a 24 minute day), `paused`, `days_in_week`, `dawn_hour`, `dusk_hour` | Variables. |
| `set_time(h, m)`, `set_day(d)`, `advance(minutes)` | Everyone is simply where they should be. |
| `day()`, `weekday()`, `hour()`, `minute_of_day()`, `clock_text()`, `night()` | `night()` is 0 at midday, 1 in the dead of night. |
| `follow(callable, absolute)`, `stop_following()` | Follow your own day/night system: a Callable returning minutes since midnight, or since day 0. |

| Asking | |
| --- | --- |
| `where(id, at)` | `{"person", "place", "tag", "pose", "since", "until", "prev_place", "schedule", "forced"}`. A pure function of the time. |
| `place_of(id)`, `doing(id)`, `is_at(id, place)`, `who_is_at(place)` | The questions quests ask. All work on or off screen. |
| `day_strip(id, day)` | Someone's date as bands, for your own UI. |
| `visited_since_dawn(place)` | Whether anyone's stop has been there since the last dawn, from the clock alone. How a lamp knows it has been lit. |
| `check()` | The town's problems, in words. |

| Changing | |
| --- | --- |
| `define(town)`, `load_town(path)`, `add_person(id, data)`, `remove_person(id)`, `clear()` | The data. |
| `set_day_type(type, day)`, `day_type_of(day)`, `set_flag`, `get_flag`, `set_var`, `get_var` | What schedules test. |
| `force(id, place, minutes)`, `release(id)` | Send someone somewhere; they walk back from there when it ends. |
| `use_schedule(id, schedule_id)` | Pin a schedule: an injury, a story beat. |
| `to_save()`, `from_save(data)` | Plain data: the clock, day types, flags, overrides. Positions are never stored, they are derived. |

| Signals, on `Township.events` | |
| --- | --- |
| `minute_changed(m)`, `hour_changed(h)`, `day_changed(d)` | The clock. |
| `person_moved(person, place, tag)` | Someone's stop changed, on or off screen. |
| `town_changed` | The data, a day type, a flag or a force changed. |

---

## TownshipTown2D: one scene's view of the town

| Export | |
| --- | --- |
| `scene_id` | Names this scene, for a door's `leads_to` and a place's `"scene"`. |
| `walk_layers` | The ground. Empty = everyone walks straight lines. A tile with a collision polygon, or custom data `township_block` true, blocks. |
| `blocking_layers` | Any tile here blocks, unless its custom data `township_walk` is true. |
| `blocked_rects`, `open_cells` | Cells to close (a building painted on the ground layer) or keep open (a gate in a fence). |
| `walk_pixels_per_minute`, `walk_speed` | Pixels per game minute; 0 = `walk_speed` pixels per real second at any clock rate. |
| `transfer_minutes` | Between leaving one scene by its door and appearing at the other's. |
| `frames_by_person` | person id -> your SpriteFrames. |
| `figure_pixel_size` | Art pixels to a world pixel for the drawn figures: 1 on a 16 px tile, 2 on 32. |

`hold(person, facing)` and `release_hold(person)` stop someone for a conversation. The clock keeps running; let go and they ease back to where the clock says, so
talking to someone can never break a routine. `path_between(a, b)` is the route they would take. `check_walks()` names every stop that cannot be walked in its time. `rebuild()` re-reads a map you changed at run time.

People walk the cell grid, turning at corners, and pass through one another. They do not push the player or each other. No way between two stops is reported once, by
name, and they fade across rather than vanish.

## TownshipPlace2D: a stop you can see

| Export | |
| --- | --- |
| `place_id` | The id schedules name. Empty = the node's name in snake_case. |
| `look_id` | One of the 50 below, by file name. Empty = an invisible spot to stand on. |
| `accent`, `glow` | The look's main colour and light colour. Alpha 0 = its own. |
| `pixel_size` | 1 sits on a 16 px tile, 2 on 32, 3 on 48. |
| `speed`, `intensity` | How fast, and how much fire, smoke and bustle. |
| `awake`, `show_worker` | Alone, with no town above it: 1 = open and at work, and draw the trade's worker there. |
| `night_override` | -1 follows the clock; 0 to 1 holds that much night. |
| `casts_light` | A real PointLight2D for looks that give light, so a CanvasModulate night is lit by the town. |
| `backing` | Draw the bit of wall a window, door or chimney sits on. Turn it off over your own building. |
| `solid` | People walk round the footprint. |
| `entry` | A `TownshipDoor2D`: for a place they go inside. They walk to it, it opens, they are gone. |
| `wakes_with` | Wake when someone is at another place: a lit window and a chimney set to "home" wake when someone is home. |
| `open_on_day_type` | Awake all day on that day type, with nobody needed. |
| `only_when_awake` | Not drawn while asleep, and never blocks the way: a stall only set up on market days. |
| `extent` | The size of `window_light`, to fit your window tile. |

A look is one small script in `looks/`: `info()`, `base()` for what holds still and `live()` for what moves, drawn with `TownshipBrush`. Copy one, draw your own, and name it in `look_id`.

## TownshipDoor2D, TownshipPerson2D, TownshipSky2D

**TownshipDoor2D** opens as someone comes within `radius`. Give it `layer`, `cell` and `open_atlas` to swap a tile on your own map, or let it draw a leaf
(`size`, `leaf_colour`, `inside_colour`, `draw_leaf`, `pixel_size`). `leads_to` makes it the way out to another scene (`"*"` = anywhere). `step_out` is where people stand.

**TownshipPerson2D** draws someone. A town spawns them; add your own under the town with the same `person_id` to give someone your own art through `frames`:
animations `walk_down`, `walk_left`, `walk_right`, `walk_up`, optionally `idle_down` and so on, and `work`. No `work` animation: your idle frame with a bob. With no frames it draws the trade's
figure in code: `trade` (below), `figure` (any of `tunic`, `trim`, `skin`, `hair`, `hat`, `hat_col`, `apron`, as "#rrggbb"), `figure_seed`.

Trades: `townsfolk`, `smith`, `baker`, `guard`, `farmer`, `innkeeper`, `priest`, `fisher`, `merchant`, `scholar`, `lamplighter`, `weaver`, `miller`, `washer`, `carpenter`, `potter`, `child`, `elder`, `noble`, `player`.

Work poses: `hammer`, `saw`, `chop`, `chisel`, `knead`, `stir`, `peel`, `hoe`, `water`, `fish`, `sweep`, `peg`, `sell`, `pour`, `read`, `pray`, `ring`, `light`, `stand`, `guard`, `carry`, `sit`, `spin`, `fork`, `drum`, `dance`, `mend`, `press`.

**TownshipSky2D** is a CanvasModulate that follows the clock: `day_colour`, `dawn_colour`, `dusk_colour`, `night_colour`. The town's lights shine through it.

## TownshipBoard and TownshipDial: the panels

**TownshipBoard** draws everyone's whole day as a strip each, with the hour hand across them and a night shift as one band running off the right edge and carrying on at the left.
Use it as your debugger or show it to the player as the town's roster. `style` (`ledger`, `slate`, `guild`, `harbour`), `title`, `show_people`, `tag_colours`, `text_size`, `interactive`
(drag or arrow keys scrub the hour), `set_clock_on_release` (letting go moves the world there), `live`. Signals `scrubbed`, `world_moved`, `person_picked`.

**TownshipDial** is the hour as a sky dial: the sun or the moon on a band that darkens through the night. `rim_colour`, `hand_colour`, `show_digits`, `minute_override`.

---

## The 50 places

| Place | Family | Worker | What wakes it |
| --- | --- | --- | --- |
| `window_light` | Home | nobody needed | sits on the window in your own tile, set to its size: dark by day, lit after dark while someone is home |
| `chimney_smoke` | Home | nobody needed | sits on the chimney in your own tile: smoke while someone is home, a thin thread of it by night |
| `hearth_window` | Home | nobody needed | lights after dark while someone is home; a shadow crosses the curtain |
| `shuttered_window` | Home | nobody needed | shutters open by day while someone is home; shut at night with light through the cracks |
| `smoking_chimney` | Home | nobody needed | smokes while someone is home |
| `doorstep_lantern` | Home | nobody needed | the lantern is lit at dusk while someone is home, and moths find it |
| `washing_line` | Home | washer | goes up piece by piece in the morning, comes in when she does |
| `kitchen_garden` | Home | farmer | grows with the days; the can drips while she waters, butterflies by day |
| `woodpile` | Home | townsfolk | logs split on the block and chips fly |
| `porch_bench` | Home | elder | someone sits out with a pipe, and the cat comes |
| `forge` | Craft | smith | coals brighten when the smith arrives; every blow throws sparks |
| `carpenter_bench` | Craft | carpenter | the saw runs, sawdust falls, and the stack grows through the week |
| `potter_wheel` | Craft | potter | the wheel spins with a pot rising on it; the kiln glows behind |
| `great_loom` | Craft | weaver | the shuttle runs and the cloth grows row by row |
| `stonemason_yard` | Craft | townsfolk | chips fly from the chisel and a figure comes out of the block |
| `glass_furnace` | Craft | townsfolk | the mouth roars when the blower arrives; the shelf catches its light |
| `bread_oven` | Food | baker | the fire takes when the baker arrives and the table fills through the morning |
| `brew_kettle` | Food | innkeeper | the fire lights under the copper and the steam rises |
| `butcher_awning` | Food | townsfolk | the awning rolls down, the hams swing, and the cleaver falls |
| `soup_cauldron` | Food | innkeeper | the pot comes to a boil over its tripod and the bowls fill |
| `water_mill` | Food | miller | the sluice opens when the miller arrives and the wheel turns |
| `windmill` | Food | miller | the sails turn while the miller works, slowing when he goes |
| `cider_press` | Food | townsfolk | the screw turns, the board comes down, and juice runs into the tub |
| `fruit_stall` | Market | merchant | the awning rolls out and the tarp comes off the crates at opening time |
| `cloth_stall` | Market | weaver | bolts stand out on the board and lengths of cloth swing from the rail |
| `fish_stall` | Market | fisher | the catch is laid out on ice and the scales swing |
| `flower_cart` | Market | townsfolk | pulled up and opened, every bucket full, petals on the air |
| `spice_stall` | Market | merchant | sacks are rolled open on heaps of colour, and herbs hang drying |
| `book_stall` | Market | scholar | books are stacked out and scrolls unrolled; a candle after dark |
| `toy_stall` | Market | child | pinwheels spin on their rack and the puppet dances on its strings |
| `crop_rows` | Land | farmer | the wheat stands taller through the week and bends in the wind |
| `hay_rick` | Land | farmer | the rick rises through the day and hay flies off the fork |
| `beehives` | Land | nobody needed | bees leave by day and home at dusk, whether anyone is there or not |
| `sheep_pen` | Land | farmer | the flock wanders and grazes all day and lies down at night |
| `stone_well` | Land | washer | the bucket rises and falls on its rope, spilling as it comes up |
| `apple_tree` | Land | farmer | apples fall into the basket while someone picks |
| `fishing_jetty` | Water | fisher | the float bobs on its ripples; dusk puts a lamp on the post |
| `net_rack` | Water | fisher | nets swing drying on their poles; the catch piles up in the creels |
| `beacon_tower` | Water | nobody needed | lit from dusk to dawn, sweeping its beam, whether anyone is there or not |
| `street_lamp` | Civic | lamplighter | the lamplighter's round lights it at dusk, and it stays lit until morning |
| `bell_frame` | Civic | priest | the bell swings and rings while the ringer is at the rope |
| `notice_board` | Civic | scholar | notices are pinned up one by one through the morning, sealed in wax |
| `watch_brazier` | Civic | guard | the night watch lights it and stands by it until the shift ends |
| `wayside_shrine` | Civic | priest | candles are lit while someone prays; petals gather on the step |
| `bunting_line` | Festival | nobody needed | strung up for the day, every pennant in the wind |
| `paper_lanterns` | Festival | nobody needed | hung for the festival and lit at dusk |
| `maypole` | Festival | child | ribbons go up with the garland and turn all day |
| `bonfire` | Festival | townsfolk | laid by day, lit at the festival, and it throws sparks into the dark |
| `feast_table` | Festival | innkeeper | the cloth goes on, pies and mugs come out, candles at dusk |
| `drum_stage` | Festival | townsfolk | the banners rise and the drum beats on the swing of the arm |

Every preset is a real look with its worker at work; drop one in with no town and it plays. The gate photographs each at its showcase moment under both renderers.

---

## Renderers and performance

Run on Godot 4.7.2 under Forward+ and Compatibility with zero engine error lines; every place is `_draw()` code and no shaders ship, so nothing differs between them but the renderer's 2D lights.
With vsync off, on a machine with integrated AMD graphics, a town of 100 people and 30 places on screen averaged under 16 ms a frame under both renderers, busy or idle. At 300 people and 60 places it averaged between about 8 and 32 ms, depending on the renderer and what else the machine was doing; those are this machine's numbers, not a promise.

## What it does not do

It is not dialogue, a quest system, combat AI or crowd avoidance: people follow their day and pass through each other. It has no 3D. A person in a scene you have not loaded has a place and a
stop, not an x and y. A route is worked out when a scene loads, so a map you edit at run time needs `rebuild()`.

---

Core Systems Asset Factory. See LICENSE.txt. More Godot packs: https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
