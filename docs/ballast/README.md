# Ballast — Resources Reachability and Build-Weight Actor — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Ballast — Resources Reachability and Build-Weight Actor  
**Engine:** Unity 6  
**Docs published:** 2026-09-05


---

# Ballast — cut the Resources folder out of your build, and prove the bytes

Unity strips unused assets when it builds. It documents one exception, and it is the only one that
matters here:

> "Unity includes assets that are referenced in your project and strips any unused assets during the
> build process ... The only assets that aren't removed are assets in the `Resources` folder."
> — Unity Manual, *Reducing the file size of your build*

Everything in `Resources/` ships. All of it, in every build, forever, because Unity cannot know which
file a script will ask for by name at runtime. Ballast works out which ones nothing ever asks for,
moves those out of the build, and hands you a drawn certificate showing exactly how many bytes left.

**Ballast never claims an asset is dead.** It proves an asset is *unreached*, and where the question
cannot be answered it refuses to act and tells you which line of your code stopped it. That
distinction is the whole product, and the rest of this file explains it.

---

## Quick start (about five minutes)

1. Import the package. Everything lands under `Assets/CSAF/Ballast/`.
2. Open **Window ▸ CSAF ▸ Ballast**.
3. Press **Survey**. Ballast reads every `Resources/` folder in your project and every
   `Resources.Load*` call site in your C#, and gives each asset one of three verdicts.
4. Read the list. Every `IN USE` row cites **the file and line** that reached it. Every `WITHHELD`
   row cites the dynamic call site that made it undecidable.
5. Press **Compose certificate** to draw the plate, and **Export PNG** to keep it.
6. If you are happy, press **Migrate**. It names the count and the byte total before it does
   anything.

Nothing runs on import. Nothing runs on build. Nothing runs on a timer. Ballast does exactly nothing
until you press a button.

---

## The three verdicts

| verdict | what it means | what Ballast does |
| --- | --- | --- |
| **IN USE** (`Reached`) | a literal load site resolves to this asset | keeps it, and cites the call site |
| **UNREACHED** | no literal resolves to it, **and** no dynamic site could reach it | offers to migrate it |
| **WITHHELD** (`Indeterminate`) | a dynamic load site could reach it | **never touches it**, and says which site |

`Resources.Load` takes a string, so it is decidable for a literal and undecidable in general:

```csharp
Resources.Load<Sprite>("icons/sword");          // decidable  -> that asset is IN USE
Resources.Load<Sprite>("icons/" + item.slug);   // prefix known -> all of icons/* is WITHHELD
Resources.LoadAll<Sprite>("icons");             // claims a folder -> all of icons/** is WITHHELD
Resources.Load<Sprite>(pathFromServerConfig);   // nothing known -> the WHOLE tree is WITHHELD
```

That last line is worth dwelling on. **If you have one fully dynamic load site, Ballast will migrate
nothing at all**, and it will tell you which file caused it. That is the correct answer, not a
failure. A tool that guessed there would eventually delete an asset your game loads, and you would
find out when a player hit that code path.

`UNREACHED` is the narrowest of the three sets by construction: a literal match wins first, anything
a dynamic site could reach is withheld, and only what *nothing* can reach is ever offered.

---

## Safety — what Ballast will and will not do to your project

- **It migrates, it never deletes.** Assets move to
  `Assets/CSAF/Ballast/Quarantine/<timestamp>/...`, keeping the folder shape they came from.
- **The `.meta` file moves with the asset.** Your GUIDs survive, so every existing reference in every
  scene and prefab still resolves. Nothing becomes a missing reference.
- **One-click revert.** The manifest records where each asset came from, and the revert replays it,
  so it is a true inverse rather than a second guess at the path.
- **Read-only until you confirm**, and the confirmation names the count and the bytes.

### Why the quarantine folder renames `Resources` to `_Resources`

This is the single rename that makes the migration do anything at all, and it is worth knowing about
because it is the first thing you would notice.

Unity decides what goes into a build by looking for a folder named exactly `Resources`, **at any
depth**. The quarantine preserves the folder shape an asset came from, so
`Assets/Game/Resources/icons/sword.png` would land at
`.../Quarantine/<stamp>/Game/Resources/icons/sword.png` — which is *still inside a Resources folder*.
Unity would go on shipping every quarantined byte and nothing would have been achieved. So the
`Resources` segment is renamed to `_Resources` on the way in, and renamed back on revert.

It is a rename and **not** a `~` suffix on purpose. A `~` folder is ignored by Unity entirely, which
would take your assets out of the AssetDatabase and break every GUID reference to them — exactly what
this package promises not to do. A renamed folder is an ordinary folder: the assets stay imported,
keep their GUIDs, keep every reference, and are simply no longer loadable by name and no longer
forced into the build.

Matching is segment-wise and exact, the same rule Unity uses. A folder called `ResourcesOld` is an
ordinary folder to Unity and stays an ordinary folder here.

---

## The certificate

The report is a drawn document rather than a list: a lading certificate for your build. It carries a
tonnage bar per top-level `Resources` folder sized by real bytes, the reached fraction struck solid
and the unreached fraction hatched, a cross-hatched band for the withheld tonnage, the displacement
figure set large, and a dateline.

The withheld band is drawn in a **different visual language** rather than just a different colour, so
it still reads on a greyscale screenshot. The honesty of the whole product lives in that band, and it
should not be the one thing that disappears when someone prints the page.

The window also lists every asset with its verdict and its citation. The certificate is what you
keep; the list is what you audit.

---

## Performance — read this before you wire it up

The certificate is drawn by a CPU rasteriser, so its cost is proportional to pixel count. **It is
composed on demand and cached — never on window open.**

Measured across **three separate runs** in a blank Unity 6000.5.7f1 project, importing the shipped
package, on an ordinary workstation doing other work at the time:

| certificate size | pixels | measured span, 3 runs |
| --- | --- | --- |
| 550 x 750 | 0.41 M | 0.48 - 0.59 s |
| 1100 x 1500 (default) | 1.65 M | 1.46 - 1.80 s |
| 1650 x 2250 | 3.71 M | 3.08 - 3.60 s |

Roughly 0.8 - 1.3 microseconds per thousand pixels.

**The high figure is an observation, not a ceiling.** Three runs give you a sample, never a bound —
the same code on the same machine varied by about 20% between runs purely with background load, and
a busier machine will exceed the top of that range. Size your expectations from the span, not from
the fast number, and treat anything above it as ordinary rather than as a fault.

Compose when the user asks for the plate, not on a repaint, and keep the texture you get back.

The survey itself is fast and unrelated to the above — it is a text scan over your scripts plus a
directory walk, and it does not rasterise anything.

---

## What decides the survey

Ballast reads your project, not a configuration file. There is nothing to set up and no list to
maintain:

- every `Resources/` folder at any depth, and every asset inside it, with real file sizes;
- every `Resources.Load`, `Resources.LoadAll` and `Resources.LoadAsync` call site in your C#, found
  by a real lexer rather than a regex, so a call site commented out, inside `#if`, or written inside
  a string literal is not mistaken for a live one.

Verbatim (`@"..."`), interpolated (`$"..."`) and verbatim-interpolated strings in either order are
all handled. An interpolated string with a known prefix is treated as a **prefixed** site, not an
opaque one, so `$"icons/{slug}"` withholds `icons/*` rather than your entire project.

---

## Using it from your own code

Every part is public and editor-side:

```csharp
using CSAF.Ballast.Editor;

Survey survey = SurveyRunner.Run(projectRoot, projectName, stock, DateTime.UtcNow);

List<AssetVerdict> verdicts = Reachability.Classify(inventory, sites);
long dead = Reachability.BytesWith(verdicts, Verdict.Unreached);

MigrationManifest manifest = Migrator.Migrate(projectRoot, pathsToMove, stamp);
int restored = Migrator.Revert(projectRoot, manifest);

Texture2D plate = Certificate.Compose(lading);
```

`Revert` returns a **count** rather than a boolean, so you can compare it against the manifest and
notice a partial restore rather than being told "success" while three of forty assets sat in
quarantine.

---

## What is in the package

- `Editor/Scan/` — the load-site lexer, the reachability join and the taint propagation.
- `Editor/Index/` — the `Resources` inventory with real byte sizes.
- `Editor/Migrate/` — quarantine and revert, with the manifest.
- `Editor/Plate/`, `Editor/Core/`, `Editor/Type/` — the certificate, the rasteriser and the
  letterforms.
- `Editor/BallastWindow.cs` — the buyer surface.
- `Demo/Scenes/BallastDemo.unity` — a scene you can open and press Play on.

All editor code sits in a platform-constrained `CSAF.Ballast.Editor` assembly definition, so **none
of Ballast ships in your build**. The package itself contains no `Resources/` folder, which would be
an unusually poor joke in this product.

---

## Compatibility

- **Unity 2022.3 and newer**, including Unity 6. Built and gated against 6000.5.7f1.
- **Render pipeline agnostic** — Built-in, URP and HDRP. Ballast is editor-only and rasterises on the
  CPU, so it touches no pipeline at all.
- **No third-party dependencies.** No packages to add, no services, no network calls, no telemetry.
- Works on Windows and macOS editors.

---

## Support

Documentation and contact:
https://github.com/onefreeman1337/csaf-releases/blob/main/docs/ballast/README.md

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
