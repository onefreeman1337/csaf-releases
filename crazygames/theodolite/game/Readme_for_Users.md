# THEODOLITE

Map a county by sight, by angle and by error.

Free, plays in the browser, nothing to install and no account needed.

## The county

Nobody has surveyed it. What you have is a hearsay sketch in pencil: hills that are said to be there, woods
that may be bigger than drawn, towns with question marks after their names. Two trig stations stand at the
ends of a **measured baseline**, and they are the only two points in the county known for certain.

## The one rule

**A station is fixed once its sights to two fixed stations are read.** Its error is the worse of the two that
fixed it, plus a little for every cell of sight, times the **shape of the triangle**: a right angle at the new
station fixes it well, a thin sliver of a triangle fixes it badly. Before you raise one, the map tells you the
error it will get and the angle of its best triangle. Chain station after station away from the baseline and the
error piles up. That is the whole game: where you put the next station decides how well the county is known.

## How to work it

- **RAISE** a station on any land. Hover the map (or tap once on a phone) to see what a station there would
  see: a green line to every station in sight, an orange crossed line where a hill or a wood is in the way. Tap again, or
  click, to raise it.
- **TOWER** lifts a station's eye over what blocks it. Hover a station (or tap it once) to see which sights a
  tower would open: green lines open, orange crossed lines stay blocked.
- **READ** tells you what is anywhere on the map: a station's error, its best triangle, a cell's height.
- **Observing parties** read the sightlines one at a time, and **plane-table parties** ink the ground round
  every fixed station, nearest first, later redrawing any cell a better station could draw more truly.

## The weather

Every day is CLEAR, HAZE or FOG, with more fog in autumn and winter. Haze stops the long sights; fog stops
every sight and slows the ink. A barometer forecasts six days ahead, and heliotropes flash sunlight from the far
station through the haze.

## The sheets

Each of the eight towns buys the sheet of land round it once 90% of it is mapped. Its **grade** is its mean
error: A, B or C. Publishing pays a grant and the town buys copies every day; the Board also pays a fee for
every new cell inked. Sell a sheet at C now, or wait for a better grade, and **REISSUE** it when the survey
improves. The county is done when every sheet is published at grade **B or better**.

## Instruments

More observing and plane-table parties, a longer telescope, a better alidade, a finer vernier, heliotropes, a
mule train, a **check baseline** (a second measured base that wipes the error off both its ends and re-reckons
every station fixed through them) and a printing press. The Board grants them as sheets are published.

## Saving

The survey saves itself as you go. While you are away the parties keep working, up to one season. Pause it
and it waits exactly where you left it.

## Controls

Tap or click. On a phone the first tap on a place, an instrument or a ready sheet explains it and a second acts. Keys: **1** raise, **2** tower, **3** read, arrows move a cursor on the map and **Enter** or
**Space** acts there, **B** publishes the next sheet that can be, **T** the tabs, **N** the next page of the field
notes on a phone, **F** speed, **P** pause, **H** help, **M** sound, **Esc** close. The game never takes the Tab key.

## On a phone (new in 1.1)

Upright or sideways, each with its own layout. A phone held sideways (or any landscape browser window under about
520 pixels tall) now gets a layout of its own: the map on the left, the counts and the three tools under it, and
the tabs on the right, with the field (parties, plane tables, forecast and the map's key) as a FIELD tab of its own.
Before 1.1 it got the desktop layout shrunk to about two thirds, with most of the type under 9 pixels. On both phone
layouts the type is now drawn at 10 CSS pixels or more, the town names on the map included: upright on a phone 390
pixels wide with its browser bars showing (and on a 360 by 640 screen), sideways in a window about 320 pixels tall
or more. A smaller window than those gets a little less, about 8.8 on a 360 pixel phone with its bars. The help is
two pages and the field notes three when the phone is held sideways; upright, the notes are three pages. On the
desktop the layout is unchanged, and hovering a button now shows what it does in the bar at the bottom (in 1.0 that
readout never appeared).

## Made by

Core Systems Asset Factory. Code, text and pictures were made with AI assistance; the music and every sound
are synthesised by our own code, with no generative audio model. See CREDITS.txt and LICENSE.txt.
