# Canticle — the soundtrack gallery, drawn from your own audio

**Your game already has a soundtrack. Canticle draws its music room, and each track's cover comes from
that track's own audio.**

Hand Canticle a soundtrack (its name, its tracks, which ones the player has unlocked, how often they
have played each and which one is playing) and it composes the music-room page: a header with the
soundtrack's name, track count and total run time, then shelves of record sleeves, one generated cover
per track. Each cover is shaped by the loudness of the track it belongs to, so a slow-building theme
and a boss fight look as different as they sound.

Nothing in it is an imported image. Every cover, sleeve, shelf and letter is drawn in code by a
software rasteriser shipped in this package. The package ships no font and no audio file.

---

## What your data does to the page

| your data | what it draws |
| --- | --- |
| the soundtrack's `Name` | the **pressing**, the look of the whole shelf (seven: Vinyl, Cassette, Chrome, Neon, Parchment, Chip, Noir), from the words in the name ("Lofi Tapes" → Cassette, "Legends of the Vale" → Parchment, "Harbour Nights" → Neon); an unrecognised name gets a stable pressing from a hash of itself. `OverridePressing` + `PressingChoice` set it by hand |
| each track's `Clip` | the **shape of its cover**: its amplitude envelope (64 loudness readings across the track) becomes the skyline, the pulse bars, the tide line or the rings, depending on the family |
| each track's `Title` | its **cover family** (ten: Horizon, Pulse, Halo, Groove, Tide, Grid, Contour, Stripes, Stars, Monogram), whole-word ("Boss Battle" → Pulse, "Harbour at Dusk" → Tide, "Main Theme" → Monogram) |
| each track's `Mood` (optional) | the cover family when the title's words name none ("Salt and Cinder" with mood "calm" → Tide). The title always wins over the mood; with neither, a stable hash of the title chooses |
| each track's run time (`Seconds`, else the clip's length as read by `Envelope.Extract`) | how many parts its cover draws (grooves, bars, bands): 3 at 30 seconds or less, 8 at six minutes or more. It is also printed under the sleeve as m:ss, and summed in the header |
| each track's `Plays` | how **played** the sleeve reads: a faded wash, and on a well-played sleeve (over 45% of the busiest unlocked track's plays, or of `PlaysForFullWear`) the pale ring a record presses through its sleeve |
| `Unlocked = false` | a closed sleeve with a padlock, "LOCKED" for a title and "?:??" for a run time. The cover stays hidden until the player earns it |
| `NowPlaying` (1-based) | a glow and an outline round that sleeve, and a "NOW PLAYING" tag |

Every choice is listed in the editor window's derivation panel: the pressing and whether a word chose
it, and for every track its family, whether a word or the hash chose it, whether its shape came from
its audio or from its title, whether it is locked, and how worn it reads.

### When a cover follows the title instead of the audio

`Envelope.Extract` reads each clip with `AudioClip.GetData`, which needs the clip's audio in memory:
set the clip's **Load Type** to **Decompress On Load** (Streaming clips cannot be read). A track with
no clip, or a clip that cannot be read, still gets a cover: its shape is grown from a stable hash of its
title, so it never changes between launches and never draws a flat line. The page reports which route
each cover took (`CoverChoice.FromAudio`), so you can tell.

---

## Quick start

1. Open **`Assets/CSAF/Canticle/Demo/Scenes/CanticleDemo.unity`** and press **Play**.
   Its three sample soundtracks carry clips the demo **synthesises at runtime**, so every cover you
   see was drawn from real audio. LEFT / RIGHT change soundtrack, UP / DOWN change page, **P** plays
   the next unlocked track (you hear it, and its sleeve wears a little more), **U** unlocks the next
   locked track.
2. **Assets > Create > CSAF > Canticle > Soundtrack** makes a soundtrack you can fill in the
   Inspector (drag your AudioClips into the tracks); press **Compose this soundtrack in Canticle** at
   the top of it.
3. **Window > CSAF > Canticle** composes any soundtrack asset, pages through it, shows why it looks
   like this, and saves a PNG. The window's preview uses `CoverSamples = 2`; **Save PNG** composes
   again at the full default.

From code:

```csharp
using CSAF.Canticle;

var ost = new Soundtrack { Name = "Harbour Nights", Subtitle = "Original Soundtrack", NowPlaying = 1 };
ost.Tracks.Add(new SoundtrackEntry("Main Theme") { Clip = mainThemeClip });
ost.Tracks.Add(new SoundtrackEntry("Boss Battle", 184f, plays: 12) { Clip = bossClip });
ost.Tracks.Add(new SoundtrackEntry("Secret Ending", 240f, unlocked: false));

Envelope.Extract(ost);   // main thread: reads each clip's loudness and length once
Texture2D page = MusicRoom.Compose(ost, new RoomOptions { Width = 1920, Height = 1080 });
myRawImage.texture = page;   // you own it; Destroy() it when you replace it
```

### Off the main thread

Composing is software rasterisation, so compose when the soundtrack, the unlocks or the play counts
change, never per frame, and off the main thread for anything a player opens:

```csharp
Envelope.Extract(ost);                                            // main thread, once per load
RoomBake bake = await Task.Run(() => MusicRoom.Bake(ost, options));
Texture2D page = MusicRoom.ToTexture(bake);                       // main thread
```

`MusicRoom.Bake` touches no Unity object: everything it needs from a clip (its loudness and its length)
is read by `Envelope.Extract` on the main thread first. Do not change the soundtrack while a bake is
reading it.
`RoomBake` also reports the page, the page count, the pressing and every cover choice, so your own UI
can page the room and label what is on it, plus what the compose cost (`Milliseconds`).

### Making it cheaper

- **Cover tiles are cached.** Playing one track and composing again redraws the sleeves, not the
  covers: every cover whose family, size, pressing, run time, title and envelope are unchanged comes
  back from the cache (`RoomBake.TilesFromCache` counts them). The cache holds at most 1.5 million
  pixels and empties itself past that; `MusicRoom.ClearTileCache()` empties it on demand.
- **Cover tiles are drawn on worker threads** (`RoomOptions.Parallel`, on by default, off on WebGL).
  The pixels are identical either way.
- **`RoomOptions.CoverSamples`** (1 to 4, default 3) is the antialiasing of each cover. Cost is
  quadratic in it: 2 takes four samples per cover pixel where 3 takes nine.
- Compose at the size you display. Cost scales with pixel count.

Measured in a blank Unity 6 project on an 8-core laptop CPU (AMD Ryzen 7 5825U, 16 threads), three
runs each: a new 1920x1080 page takes 4.3 to 4.5 seconds at `CoverSamples = 3` and 3.1 to 3.5
seconds at 2; the same page recomposed after a play takes 2.0 to 2.2 seconds, with every cover served
from the cache. These are samples from one machine, not bounds: measure on your target hardware, and
compose off the main thread.

---

## Paging

A long soundtrack is split into pages. `RoomOptions.Rows` sets the shelves per page (1 to 4, default
2); the sleeves per shelf are derived from the page's width (`RoomOptions.Columns` fixes it).
`RoomOptions.Page = -1` (the default) opens on the page that holds the track that is playing.

---

## Limitations, stated plainly

- The drawn letterforms cover Latin capitals, the figures and a small set of marks, with common
  accented Latin folded to its base letter. Text outside that set is left empty rather than printed as
  boxes; set such a title in your own UI.
- A cover follows its clip's audio only when the clip can be read (see above); otherwise it follows its
  title, and says so.
- One composition draws one page of one soundtrack.
- Compose time scales with pixels; measure it on your target hardware and compose off the main thread.

---

## Package contents

- `Runtime/` — the rasteriser (`Core/`), the drawn letterforms (`Type/`), the cover corpus and the
  shared shape kit (`Mark/`), the soundtrack model, audio envelope reader and derivation rules
  (`Model/`), and the composer (`Room/`). Assembly `CSAF.Canticle.Runtime`, all platforms.
- `Editor/` — the Canticle window and the soundtrack asset's Inspector button. Assembly
  `CSAF.Canticle.Editor`.
- `Demo/` — the demo scene and its driver, which synthesises the sample clips. Assembly
  `CSAF.Canticle.Demo`.

No `Resources/` folder, no shaders, no images, no fonts, no audio files, no network calls.

---

*Canticle · Core Systems Asset Factory. AI disclosure: the code and the store imagery were produced
with AI assistance; the pages are drawn by the code in this package, not by an image model.*
