# Ephemeris — Every Month Prints Its Own Almanac Leaf, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Ephemeris — Every Month Prints Its Own Almanac Leaf, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/ephemeris  
**Docs published:** 2026-11-05


---

# Ephemeris

**Every month your project declares prints its own almanac leaf.**

Version 1.0.0 · RPG Maker MZ · Core Systems Asset Factory · <https://csaf.itch.io>

---

## What this is

A sheet of hand-laid paper with a torn deckle edge, a calendar grid that is **drawn** rather than
tabulated, an engraved device composed from that month's own character, a seasonal colourway, and
feast days marked with struck symbols your own game data supplies.

Twelve month characters × four seasons is **48 distinct leaves** before you change a single
parameter, and five paper stocks and five rule treatments multiply on top of that. There is **no
image file anywhere in this plugin**. Every mark is drawn at runtime from authored data, so a
project that invents thirteen months called Frostmoot and Emberwane gets thirteen devices rather
than twelve stock ones and an apology.

**It is not a calendar system.** It does not track time, trigger events or advance days. It is the
part nobody sells: the thing the player actually looks at. Keep whatever calendar you already have
— or have none, and it still works.

---

## Installation

Copy all **eight** files into `js/plugins` and turn them on in the Plugin Manager.

| File | What it is |
| --- | --- |
| `EphemerisCorpus.js` | the authored data — humours, seasons, papers, rulings, feast marks, moons |
| `EphemerisRender.js` | drawing primitives — colour solving, paper, engraved line work |
| `EphemerisDevices.js` | the twelve engraved month devices, the garlands, the marks, the moon |
| `EphemerisLetters.js` | the drawn alphabet |
| `EphemerisReading.js` | the adapter that reads your calendar and your festivals |
| `EphemerisLeaf.js` | the leaf |
| `EphemerisScene.js` | the almanac scene and its page turn |
| `Ephemeris.js` | parameters and plugin commands — the only file with settings |

**The order does not matter.** Every file resolves its siblings at first use rather than at load,
so any order in the Plugin Manager works. The table above is the order that reads most sensibly in
the list, nothing more.

---

## The fastest way to see it

Turn the plugins on and run the plugin command **Open the almanac**.

You do not have to configure anything. With no months declared, a complete twelve-month year is
derived that walks all four seasons, all five paper stocks and all five rule treatments.

Then run **Print what was read** and open the console with F8. It prints exactly which source
answered for the calendar, for today and for the festivals, plus the counts. If something is not
appearing, that report says why in words.

---

## Controls

| | |
| --- | --- |
| left / right | turn to the previous or next month |
| cancel | close |
| touch | left third and right third turn the page; the middle closes |

---

## Festivals from your own database

Put a tag in the note box of any item, weapon, armour, actor, state or troop:

```
<ephemeris: 8 14 harvest Ingathering>
             ^  ^     ^       ^
         month day   kind    name (optional — the record's own name is used if you omit it)
```

So an item called *Harvest Charm* can **be** the festival. Twelve kinds, each with its own struck
mark:

```
feast    fast      market    moot     rite    muster
harvest  mourning  crowning  birth    omen    quarter
```

When two fall on one day the higher-ranked mark wins, so a crowning is never hidden behind a
market. A festival declared in the parameter list can also name a switch: while that switch is off
the day is not marked, which is how a coronation appears on the almanac only once it has actually
happened.

---

## Using it with a calendar plugin you already have

Two routes. Either works.

**1. Variables.** Point the three *Today* parameters at whatever variables your existing system
keeps the date in. Nothing else is needed.

**2. A registered calendar.** In a script call or from another plugin:

```js
EphemerisReading.registerCalendar(function () {
    return {
        months: [
            { name: 'Frostmoot', days: 28, humour: 'rime' },
            { name: 'Emberwane', days: 31, humour: 'guttering' }
            // ...
        ],
        today:    { year: 3, month: 0, day: 14 },   // month counts from 0 here
        weekdays: ['ONE', 'TWO', 'THREE'],
        yearName: 'THE THIRD YEAR'
    };
});
EphemerisReading.invalidate();
```

Anything you leave out is filled in from the derived year. There is a matching
`EphemerisReading.registerFestivals(fn)` returning `[{month, day, kind, name, switchId}]`.

**This plugin names no third-party plugin and claims compatibility with none, because we have not
run them.** The contract above is the honest version of that promise: it is six lines, it is
documented, and it is what ships.

---

## What you can change

Everything below is a Plugin Manager parameter.

- **Months** — name, length, character, season, paper, ruling and marginal line, per month. Leave
  the list empty for the derived year; leave any single field empty and it is chosen for you.
  **Months run up to 40 days.** Past roughly that the day numerals stop fitting the sheet, and the
  leaf refuses rather than printing something illegible — the parameter maximum is set so you
  cannot reach that state by accident. If a calendar you registered in script supplies a longer
  month, the console says so by name instead of showing a blank sheet.
- **Weekday names** — the number of entries **is** the length of your week. Three-day weeks work.
- **Year name** — printed as the running head in the rubricated second colour.
- **Today** — three variables for year, month and day.
- **Festivals** — days, kinds, names, and an optional switch each.
- **Days in a lunation** — set to 0 to print no moon at all.
- **Menu command** — a name here adds an almanac entry to the main menu; leave it empty and the
  plugin touches the menu not at all.

### The twelve month characters

`quickening` · `thaw` · `flowering` · `nesting` · `pasture` · `zenith` · `ripening` · `reaping`
· `pressing` · `guttering` · `rime` · `wake`

### The four seasons

`waking` · `high` · `waning` · `still` — each with its own paper, ink, rubrication and garland.

### The five paper stocks

`laid` · `wove` · `vellum` · `rag` · `foolscap` — laid wires, chain lines, fibre, a skin's mottle
and a deckle amplitude of its own.

### The five rulings

`hairline` · `double` · `ladder` · `bracketed` · `chequer` — from a fine full grid to a solid head
band with the weekday letters reversed out of it.

---

## Compatibility

<!-- COMPAT -->

This plugin **replaces no core method.** It extends three by prototype with the original saved and
called, and two of those only when you set a *Menu command* name:

- `Scene_Boot.prototype.start` — to read your parameters after the database has loaded
- `Window_MenuCommand.prototype.addOriginalCommands` — only with a menu command set
- `Scene_Menu.prototype.createCommandWindow` — only with a menu command set

It adds one scene, `Scene_Ephemeris`, and — again only with a menu command set — one new method,
`Scene_Menu.prototype.commandEphemeris`, which did not previously exist and overrides nothing.

**It writes no save data and reads none**, so it can be added to or removed from a project in
progress without breaking a save.

Every statement in this section is produced by a detector that scans the shipped source against the
engine's own class list and refuses to report "none replaced" unless the measured clobber count is
genuinely zero — it is not a claim typed by hand.

Tested against a clean RPG Maker MZ project. It uses no `Window_Base` anywhere, so it does not
inherit or interfere with a custom windowskin.

---

## A note on how this was tested

There is no human tester on this product. It was verified by its own harness against the real MZ
runtime rather than by eye alone:

- a headless suite of **55 checks exercising 472 things**, and a sabotage runner that proves each
  of those checks actually fails on the defect it names;
- an in-engine probe of **38 assertions** driving the real engine — page turns, save/load
  round-trips, the menu wrapper, every month of the year — and confirming zero texture uploads at
  rest and zero display-object growth through a whole page turn;
- every store image opened and looked at before it shipped.

---

## Terms

See `LICENSE.txt`.

## AI disclosure

The code and the artwork in this plugin were produced with AI assistance. This is stated on the
store listing and here.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
