# Primer — Printed How-To-Play Spread — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Primer — Printed How-To-Play Spread  
**Engine:** Unity 6  
**Docs published:** 2026-09-18


---

# Primer — the printed how-to-play spread, composed from your own bindings

Primer draws a **saddle-stitched instruction booklet spread** — two facing pages of cream stock, printed
in two spot inks — from your game's own tutorial steps and input bindings. FIG. 1 on the left is your
active control scheme drawn whole, every bound control tethered by a numbered callout to a legend. The
right page is your numbered steps, each with its screenshot re-screened as a two-ink halftone.

**It redraws when a binding changes.** Rebind Jump from Space to the south face button at runtime and the
diagram, the callout numbering, the leader and the legend row all move, because all four are derived
from the same list. That is the difference between this and a sheet of input icons.

---

## Quick start (two minutes)

1. Open **`Assets/CSAF/Primer/Demo/Scenes/PrimerDemo.unity`** and press **Play**.
   Left and right page through three sample games. Press **R** to rebind a control and watch the page
   redraw.
2. Open **Window → CSAF → Primer** to see the same thing in the Editor, with a derivation panel that
   explains every choice the composer made.
3. In your own scene, add a **CSAF/Primer/Primer Page** component, assign the three typefaces from
   `Assets/CSAF/Primer/Typefaces`, give it a book, and call `Rebuild()`.

---

## Giving it your data

Primer composes from a `PrimerBook`: a title, a scheme name, a list of controls, a list of steps and an
optional list of hazards.

```csharp
var book = new PrimerBook { Title = "Hollow Ascent", Scheme = "Keyboard" };

book.Controls.Add(new PrimerControl("<Keyboard>/a",         "Move left"));
book.Controls.Add(new PrimerControl("<Keyboard>/d",         "Move right"));
book.Controls.Add(new PrimerControl("<Keyboard>/space",     "Jump"));
book.Controls.Add(new PrimerControl("<Keyboard>/leftShift", "Dash", bound: false)); // listed, not hidden

book.Steps.Add(new PrimerStep("Cross the gap", "Run up to the edge and jump.", controlIndex: 2, shot: myScreenshot));
book.Hazards.Add(new PrimerHazard("Spike bed", "spikes"));

var page = GetComponent<PrimerPage>();
page.Book = book;
page.Rebuild();                    // page.Texture is a Texture2D you can show anywhere
```

### With the Input System

The control path is the **generic** Input System path — exactly the string
`InputBinding.effectivePath` gives you. There is no dependency on `com.unity.inputsystem` in the
composing code, so Primer works the same on the legacy Input Manager, on Rewired, or on your own
bindings file: fill the list yourself and you get the identical page.

```csharp
foreach (var action in myActions)
    foreach (var binding in action.bindings)
        book.Controls.Add(new PrimerControl(binding.effectivePath, action.name));
```

Call `Rebuild()` from your own rebinding callback. **Primer does not rebuild in `Update`, and there is
no auto-refresh toggle** — composing is software rasterisation and it is not cheap (see below), so
doing it per frame would be a catastrophic default. Your rebinding callback is the only place that
actually knows a binding changed.

### How long a compose takes, measured

A full **1920×1200** spread with four screenshots, supersample 1, **measured on an AMD Ryzen 7 5825U
(16 threads)** in a blank project through the imported package: **cold 3.8 s, four warm runs
3.7–5.1 s.** That is a span on one shared machine, **not a ceiling and not a promise** — your numbers
will differ with page size, step count and what else the machine is doing. Compose scales with
PIXELS, so the same page at 1280×800 is roughly half of that.

⚠️ **So compose OFF the main thread for anything a player opens.** A pause menu that hangs for three
seconds is worse than no manual. The recipe below is the documented default for runtime use; call
`Rebuild()` directly only from editor tooling, a loading screen, or a rebinding screen where you are
happy to show a spinner.

### Showing the page

`page.Texture` is an ordinary `Texture2D`.

```csharp
rawImage.texture      = page.Texture;                       // uGUI
element.style.backgroundImage = new StyleBackground(page.Texture);  // UI Toolkit
material.mainTexture  = page.Texture;                       // a quad in the world
```

### Composing off the main thread

Everything in the composing path is plain C#. The one Unity call is reading your screenshots, so read
them first and the compose itself is safe on a worker:

```csharp
var shots = ShotImage.ReadAll(book);         // main thread
var result = await Task.Run(() => PrimerSpread.Compose(book, type, new SpreadOptions { Shots = shots }));
```

---

## What it draws

**78 hand-authored marks**, mapped onto the Input System's generic control paths:

| family | what is in it |
| --- | --- |
| Keyboard | 7 cap forms (unit, wide, modifier, space bar, tall, function-row, numeric-pad) and 14 special keys, each with a drawn legend |
| Gamepad | face buttons by POSITION, the D-pad and its four directions, **left and right sticks as separate drawings** with press and four pushes each, shoulders, triggers, system buttons |
| Mouse and touch | 10 mouse marks including the thumb buttons, 6 touch gestures |
| Page furniture | the callout disc, three leader terminals, three figure frames, the hazard triangle, six hazard icons, the saddle-stitch staple |

Every control mark has a **pressed** state that is a different drawing, not a tint.

**Three weights, because there are three states.** A key you have bound prints at full ink and gets a
numbered callout. A key the drawn board carries that your book never mentions is **ghosted** — printed
with less of itself rather than faded, so the board still reads as a board. And a control your book
*lists* but leaves unbound (`bound: false`) sits between the two: an outlined cap with its legend still
struck, **plus a legend row of its own** reading `— Dash  (unbound)`. That middle row is the point —
a player learns the action exists and has no key yet, which neither full ink nor a hairline ghost can
say.

**Four paper stocks** — cream, newsprint, bright and kraft — chosen from your game's own words unless you
set one. The stock decides the paper, the ink, the halftone dot pitch and how far ink spreads into the
sheet, so it changes the whole print job rather than just a colour.

**The page count is derived.** A three-step keyboard platformer and a twelve-step gamepad twin-stick get
different spreads and different numbers of them. There is no page-count field to maintain.

---

## Things worth knowing

- **Controls are position-generic.** Primer draws the *south face button*, never a console
  manufacturer's trademarked glyph, and fills the legend from the display names your bindings supply.
  This is deliberate and is not something to work around.
- **Screenshots are re-screened, never pasted.** Your shot is separated into two plates and halftoned at
  15° and 75°. A full-colour screenshot dropped on a two-ink page is the one thing that breaks the
  register completely. The ink plate has its black and white points read off your own image before it is
  screened, the way a press sets levels — so a night scene prints as a picture instead of an even grey
  field. The teal plate is deliberately *not* levelled: it carries how blue each pixel is, and opening
  that range turns a tint into a flood.
- **Legend size follows the render size.** On the shipped 1920×1200 spread a key-cap legend is struck at
  about 14 px, roughly a third of the cap, which is where a real keyboard legend sits. Render the spread
  larger and everything on it scales with the page — `PrimerPage` takes any size — so if you need a
  bigger legend, ask for a bigger spread rather than a bigger label.
- **A screenshot needs Read/Write enabled** on its import settings, or Primer cannot read its pixels. It
  does not fail the page: the figure prints a ruled panel and the Primer window tells you which step and
  why.
- **An unrecognised control path still draws** — as a plain cap carrying the path's own last segment —
  and the Primer window lists every path it did not recognise, so an unexpected drawing has a visible
  cause.
- **Output is deterministic.** The same book composes to the same pixels every time, on every machine,
  offline. Nothing in the art path is random, networked or model-generated.

## Limitations, stated plainly

- The font reader reads TrueType-outline fonts only, without hinting or kerning tables, and does not
  shape complex scripts (no Arabic, Devanagari or CJK shaping). A character missing from one face falls
  back to Source Sans 3.
- Source Sans 3 ships as a variable font and renders at its default weight. Set headings in the display
  face rather than asking this one for a bold.
- **Composing a 1920×1200 spread took 3.7–5.1 s** on the machine named above, and scales with pixels.
  Compose on a change, not on a frame, and compose off the main thread for anything a player opens.
  This is a measured span on one machine, not a ceiling.
- The hazard key prints at most six hazards; a seventh is not drawn.
- **One spread draws ONE scheme.** The device for FIG. 1 is taken from the first bound control, so a
  book that mixes a keyboard binding with a gamepad binding draws the keyboard board and the gamepad
  binding does not appear in that figure or its legend — the step that uses it still shows its mark
  inline. Give each scheme its own `PrimerBook` and you get a spread each, which is what a printed
  manual does anyway. Keyboard keys the compact board does not carry — the arrows, the function row,
  the numeric pad — are drawn in their own bank beneath it and are called out normally.

## Extending it

Everything ships as readable source — nothing is obfuscated, minified or compiled away.

- **New marks:** add a `Mark` to one of the four families in `Runtime/Mark/Forms*.cs`. The corpus count
  is derived, so nothing needs updating elsewhere.
- **New control paths:** add a row to the relevant table in `Runtime/Model/Derive.cs`. Paths are parsed
  from an explicit table, never word-matched — see the comment there for the measured reason.
- **New paper stocks:** add a case to `PrimerPalette.For` and a value to `ManualStock`.
- **Layout:** `Runtime/Spread/PrimerSpread.cs` composes the page; `Layout.cs` plans the spreads and
  assigns the callouts.

## Licence

`LICENSE.txt` at the package root. Short version: unlimited projects, no royalties, ship the generated
pages in your game and let your players share them; do not resell the tool or repackage its output as an
art pack. The three typefaces are SIL Open Font License 1.1 by their own authors — see
`Assets/CSAF/Primer/Typefaces/Third-Party Notices.txt`.

## AI disclosure

This tool's code and its store imagery were made with AI assistance, declared truthfully on every
storefront where it is sold. The pages it generates are **not** produced by an image model: they are
drawn in code by a software rasteriser in this package, from hand-authored geometry you can read and
edit, with lettering filled from the outlines of the three shipped fonts. There is no diffusion model
and no network call anywhere in the art path.

---

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
