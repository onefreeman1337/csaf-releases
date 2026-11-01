# Folio — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Folio  
**Engine:** GameMaker 2024+  
**Docs published:** 2026-11-01


---

# Folio - A Page-Turning Book for GameMaker

**Folio is a book the player actually reads, for GameMaker (2024.14, tested on runtime 2024.14.4.268), in pure GML with a runnable demo room.**
You hand it chapters, paragraphs, headings, pictures and your own drawings; it sets them on pages (justified lines, no stranded single
lines, headings kept with their text, a drop initial opening each chapter, running heads and page numbers) and turns the pages as paper
turns: the reader drags a corner and the leaf curls as a bent mesh with a highlight along the curl, its back is the next page you will
read, and the uncovered page darkens in its shadow. Click, keys and a gamepad's shoulder buttons turn it too, and ribbons and thumb tabs
jump. The paper is generated: 48 looks from 8 stocks ruled 6 ways, each with its own edge, age, frame, page-number device, headpiece
and initials, with no image files. One commercial licence covers all your games.

Every picture on the store page was rendered by this package in a blank GameMaker project.

---

## What is in the package

| | |
| --- | --- |
| `fol_core` | the rules: the book, pagination, ribbons, tabs, the shape of a turning leaf and the turn itself - **no drawing calls and no device input** |
| `fol_paper` | the 48 papers: stocks, rulings, edges, age, frames, page-number devices, headpieces, initials |
| `fol_draw` | type, page composition and the book on screen: boards, page block, the spread, the curled leaf, shadows, ribbons, tabs |
| `fol_art` | colour, the vertex batch, outlines, the polygon filler, the relief painter, the bake and the cache |
| `fol_demo` + `obj_fol_demo` + `rm_fol_demo` | THE READING ROOM: a book on a desk holding a short guide to itself |
| `fol_selftest` | the in-engine test suite (run the demo with `-selftest`) |
| 6 fonts | `fnt_folio_text_s/_l` (from Libre Baskerville), `fnt_folio_italic_s/_l` (Libre Baskerville Italic), `fnt_folio_display_s/_l` (Marcellus SC), all SIL OFL 1.1; licences and notices in `Folio/fonts/` |

## Install

1. In GameMaker: **Tools > Import Local Package**, choose `Folio.yymps`, **Add All**, **Import**.
2. Run the project with `rm_fol_demo` first in the room order to open THE READING ROOM.

The raw `.gml` sources are also in the `Folio/` folder of this download, readable without GameMaker.

## Quickstart

```gml
// Create
my_book = fol_book_create({ paper: "Bestiary", title: "A Book of Beasts", page_w: 420, page_h: 560 });
fol_book_chapter(my_book, "The Wyrm");
fol_book_text(my_book, "It sleeps under the hill.\nA second paragraph starts on a new line of the string.");
fol_book_heading(my_book, "Where it is found");
fol_book_text(my_book, "In the old mines, and nowhere else.");
fol_book_ribbon(my_book, 0, 0);
```

```gml
// Step
fol_book_read(my_book);
fol_book_step(my_book);
```

```gml
// Draw GUI
fol_book_draw(my_book, 220, 96);
```

```gml
// Clean Up
fol_book_free(my_book);
fol_art_free();
```

`fol_book_read()` reads the mouse in GUI space; for a book drawn in a Draw event pass `false` as its second argument. The Clean Up lines
matter: page surfaces and baked paper are yours to release.

## Writing into the book

| | |
| --- | --- |
| `fol_book_create()` | a new book. Options: `page_w`, `page_h`, `paper` (index or name), `title`, `type_px`, `justify`, `roman`, `seed`, `turn_time`, `on_turn`, `cloth` |
| `fol_book_chapter()` | start a chapter on a new page: headpiece, title, a drop initial. `{ tab: false }` leaves it without a thumb tab, `{ recto: true }` starts it on a right-hand page, `{ initial: false }` drops the initial |
| `fol_book_text()` | running text; each line of the string is a paragraph |
| `fol_book_heading()` | a heading, never left at the foot of a page without the two lines after it |
| `fol_book_picture()` | a sprite set as a mounted plate with a caption |
| `fol_book_custom()` | reserve a height and draw it yourself: your function gets `(x, y, w, h, page)` with the page's surface as the target |
| `fol_book_space()` | vertical space |
| `fol_book_break()` | continue on a new page |
| `fol_book_clear()` | empty the book |
| `fol_book_ribbon()` | lay ribbon 0, 1 or 2 in a page (`-1` takes it out) |

```gml
fol_book_picture(my_book, spr_map, 0, 180, "The road north.");
fol_book_custom(my_book, 140, function(_x, _y, _w, _h, _page) {
    draw_set_colour(c_maroon);
    draw_circle(_x + _w * 0.5, _y + _h * 0.5, 40, true);
    draw_set_colour(c_white);
});
```

A function written inside the `fol_book_create()` options (such as `on_turn`) reads your instance's variables: Folio hands it back to
the instance that made the book.

## The pages

| | |
| --- | --- |
| `fol_book_paginate()` | flow everything onto pages now (the draw does it for you when anything changed); returns the page count |
| `fol_book_pages()` | how many pages |
| `fol_book_spreads()` | how many spreads: the first right-hand page alone, then pairs |
| `fol_book_spread()` | the spread lying open |
| `fol_spread_pages()` | a spread's two pages as `[left, right]`, `-1` for an endpaper |
| `fol_page_spread()` | the spread a page lies in |
| `fol_book_sections()` | the chapters with tabs, `[{ title, page }, ...]` |
| `fol_book_metrics()` | where text goes on a page: its box, line pitch and margins |
| `fol_folio_text()` | a page number as printed (arabic, or roman when the book asks) |

Pagination works on a grid of whole lines, so ruled paper and text always agree. A paragraph of four lines or more never leaves a single
line at the foot of a page or carries one alone to the next; a shorter one moves whole. A word wider than a line is broken with a hyphen.

## Turning

| | Mouse | Keys | Gamepad |
| --- | --- | --- | --- |
| Turn forward | drag a right-hand corner over the spine, or click the right page | Right, Page Down | right shoulder or d-pad right |
| Turn back | drag a left-hand corner over the spine, or click the left page | Left, Page Up | left shoulder or d-pad left |
| Jump | click a thumb tab or a ribbon's tail | Home, End | |

Let a dragged page go past the spine, or flick it, and it falls over; let it go short and it springs back. Resting the pointer near a
lower corner lifts it a little. Pressing again while a leaf is in the air queues the next turn, so a held key riffles.

| | |
| --- | --- |
| `fol_book_next()` | turn forward (queued if a leaf is turning) |
| `fol_book_prev()` | turn back |
| `fol_book_goto()` | open at a page; riffles there, or `fol_book_goto(my_book, 12, true)` for at once |
| `fol_book_turning()` | is a leaf in the air? |
| `fol_book_step()` | advance the turn; pass `dt` in seconds for your own clock |
| `fol_book_read()` | read the real devices into `fol_book_feed()` |
| `fol_book_feed()` | one frame of input as plain values (`mx`, `my`, `down`, `pressed`, `released`, `next`, `prev`): your own bindings, a tutorial, a replay |
| `fol_book_place()` | where the book lies on screen (the draw sets it) |
| `fol_book_hit()` | which page is under a point, and where on it: make words, pictures or margins clickable |
| `fol_book_to_leaf()` | a screen point in the leaf's own coordinates |
| `fol_book_leaf()` | the leaf in motion, for effects of your own |

`on_turn` in the options is called as `on_turn(book, from_spread, to_spread)` when a turn completes: play your page sound there; the
package makes none.

## Drawing

| | |
| --- | --- |
| `fol_book_draw()` | the book open at `x, y` (the left page's top-left corner), at a scale; boards and tabs reach a little past it. Blend, matrix, colour and alpha are handed back as found |
| `fol_book_free()` | free the book's page surfaces (Clean Up) |
| `fol_art_free()` | delete the baked paper; it is shared between books |
| `fol_art_count()` | how much baked paper there is |

## The papers

| | |
| --- | --- |
| `fol_paper_count()` | 48 |
| `fol_paper_name()` | a look's name: Monster Manual, Ship's Manifest, Fairy Tale, Bestiary, Spellbook, Grimoire, Star Atlas and the rest |
| `fol_paper_find()` | a look's index from its name or index, `-1` if there is none |
| `fol_paper_look()` | its recipe: stock, ruling, edge, age, frame, page-number device, accent, headpiece, initials |
| `fol_paper_colours()` | its paper, ink, rule and accent colours, to draw your own work in the book's palette |
| `fol_book_set_paper()` | change a book's paper; the text flows again (a frame can widen a margin) |
| `fol_paper_sprite()` | a blank sheet of any look as a sprite, for a note, a scroll or a menu panel |

| Stock | Ink | Rulings, one look each |
| --- | --- | --- |
| ivory laid (chain lines) | sepia | blank, lined, grid, ledger, staff, dots |
| cream wove | warm black | the same six |
| rag white | cool black | the same six |
| vellum (follicle drifts) | iron-gall brown | the same six |
| parchment (mottled) | brown | the same six |
| kraft | dark brown | the same six |
| ledger green | blue-black | the same six |
| midnight | silver | the same six |

Edges are cut, deckle (torn) or gilt; age is new, worn (toned edges, a thumbed corner) or foxed (rust spots, sometimes a tide line).
Frames are none, a rule, a double rule with corner squares, a vine down the outer margin, a ruled margin column, or an illuminated band.
Staff ruling fills the part of a page below the writing.

## The shape of a turn

For effects of your own (a page that tears, a book that flips by itself in a cutscene), the geometry is public and pure:
`fol_leaf_pose()` is the curl for a corner carried to a point, `fol_leaf_map()` where any point of the flat leaf lands, `fol_leaf_bands()`
the leaf cut into flat pieces along the fold, and `fol_leaf_shade()` how brightly each part faces the lamp. `fol_oklch()` is the
package's colour function; `fol_rng()` and `fol_rand()` its seeded generator.

## What it costs

MEASURED on runtime 2024.14.4.268, Windows, the VM target, on a shared machine: each figure is the range over two suite runs, for a
420 x 560 page at scale 1.

| | |
| --- | --- |
| A frame with the book at rest | 1.8 ms to 2.6 ms |
| A frame while a leaf turns (both faces, shadows, highlight) | 5.0 ms to 6.6 ms on average, 7.3 ms to 11 ms at worst |
| Composing one page of text (once; kept as a surface after) | 1.6 ms to 2.6 ms |
| Baking one paper look at that size (once per look and size) | 42 ms to 56 ms on average |
| Paginating the demo book (15 pages) | 30 ms to 34 ms |
| The first draw of a book, nothing composed yet | 4.4 ms to 5.5 ms |

A book keeps at most eight page surfaces; a surface lost to a window resize or an alt-tab is composed again on the next draw.

## What it does not do

- It draws pages, not covers or spines: the boards under the page block are plain cloth in a colour you can set.
- No sounds; `on_turn` is where yours go.
- Text is ASCII: the shipped fonts cover characters 32 to 126. Pagination does not hyphenate except to break a word longer than a line.
- One leaf turns at a time; a riffle turns them one after another, faster.

## Verification, stated plainly

GML cannot be unit-tested outside the engine, so every number here came from a real Igor-built Windows VM executable: 90
in-engine assertions (run the demo with `-selftest`), a fresh install of this `.yymps` into a blank project running this Readme's code,
and an adversarial pass over every function documented here. Drawing was checked by opening the renders. The mouse, keyboard and gamepad
reading in `fol_book_read()` compiles and runs, but no run has pressed a real button; everything it feeds was driven through
`fol_book_feed()`. HTML5, mobile and YYC builds have not been run. GMRT is not required and has not been tested.

## Licence

One commercial licence: use it in all your games, no royalties, no attribution required. See `LICENSE.txt`. The fonts' notices are in
`Folio/fonts/THIRD-PARTY-NOTICES.txt`.

AI disclosure: this package's code, its generated art and the demo book's text were written by AI. It makes no sound.

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
