# Source Link — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Source Link  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-05


---

# Source Link

**Repairs the dead source-file paths that make every Reimport button in a moved project stop working.**

Unreal records, on every imported asset, the path of the file it came from. Reorganise the raw art
tree, rename a folder, or hand the project to another artist on another machine, and every one of
those paths goes stale at once. Reimport stops working project-wide, and there is no built-in way
to fix it in bulk — the property is read-only in the details panel and lives on a sub-object the
Bulk Editor cannot reach.

Source Link finds every one of those broken links, works out where the files went, and writes the
corrected paths back.

---

## Install

1. Copy the `SourceLink` folder into your project's `Plugins` directory.
2. Restart the editor. The plugin is enabled by default.
3. Built and verified against **Unreal Engine 5.8** on Windows. Only 5.8 is claimed, because 5.8 is
   the only version it has been built and run against.

---

## The 60-second first run

Nothing is written unless you ask for it. Start with a preview:

```
UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=SourceLink
```

That scans `/Game`, writes a report to `Saved/SourceLink/SourceLink.html`, and changes nothing.
Open the report: it lists every imported asset, every source file it points at, and which of those
files are no longer there.

Then point it at wherever the art actually lives now, still as a preview:

```
UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=SourceLink ^
  -NewRoot="D:\Studio\SourceArt"
```

The report now shows, for every missing file, what Source Link would write and why. When you are
satisfied, add `-Apply`.

---

## How it decides

For each missing source file it looks under `-NewRoot` for files with the same name, and scores
each candidate:

| Signal | Weight | Why |
| --- | --- | --- |
| Filename matches | 100 | The entry condition — nothing else is ever considered a candidate. |
| Each folder level of the old path that still agrees | +25 | `Characters/Hero/Hero.fbx` beats `Props/Hero.fbx` when the old path was under `Characters/Hero`. |
| MD5 matches the hash recorded at import | +1000 | Decisive. This *is* the file, wherever it has moved to. |
| MD5 differs from the one recorded at import | −500 | Heavily penalised, but not disqualifying: a source file legitimately edited since import has a different hash and is still the right file. |

**If two candidates tie at the top, Source Link refuses to choose.** The row is reported as
Ambiguous, both alternatives are listed with their scores, and nothing is written. A wrong repair
is written into an asset and committed, and afterwards it is indistinguishable from a right one —
so the choice stays with you.

Hashes are computed **lazily**: only to break a tie, or when you pass `-VerifyHash`. Hashing every
candidate would read your entire art tree off disk, and it is wasted whenever the name and folder
already agree uniquely.

---

## It does not hang your editor

The scan reads every source path from the **Asset Registry**, which already holds them as a tag. No
asset is opened to produce the report — the sheet prints `Assets loaded to scan: 0`, and that is a
measurement, not a claim. Only the assets actually being repaired are ever loaded, so a project
with 20,000 assets and nine broken links opens nine of them.

---

## Absolute paths, and why they bite later

A path like `C:\Users\you\Art\Hero.fbx` resolves on your machine and nowhere else. Source Link
flags these separately, and `-Normalise` rewrites them relative to the asset's package using the
engine's own rules, so they survive being opened by a teammate.

This is **off by default**. It changes assets that are working today, and a tool that quietly
rewrites healthy data the first time you run it does not get trusted with the data that is broken.

---

## Arguments

| Argument | Effect |
| --- | --- |
| `-NewRoot="D:\Path"` | Where the source files live now. Without it, missing files are reported but nothing can be matched. |
| `-Apply` | Write the repairs. Without it, every run is a preview. |
| `-Normalise` | Also rewrite absolute paths into package-relative ones. |
| `-VerifyHash` | Hash every candidate rather than only tied ones. Exact, and much slower. |
| `-Paths="/Game,/Game/Art"` | Which content roots to scan. Defaults to `/Game`. |
| `-Filter="Characters"` | Only assets whose package path contains this substring. |
| `-Report="C:\out.html"` | Where to write the report. |
| `-NoSave` | Apply in memory and leave the packages dirty in the editor for review. |

## Exit codes

Distinct on purpose, so a build step can tell "your links have rotted" from "I could not run".

| Code | Meaning |
| --- | --- |
| 0 | Everything resolved, or everything asked for was applied. |
| 1 | Bad or missing arguments. Nothing was scanned. |
| 2 | The scan could not run — no assets found, or a bad `-NewRoot`. **Nothing was measured.** |
| 3 | Missing source files remain that could not be matched. |
| 4 | Matches were found but two or more were equally good, so nothing was written for them. |
| 5 | An apply pass was requested and one or more assets could not be written or saved. |

Code 2 is deliberately separate from code 3: a run that scanned nothing must never be reported as a
run that found nothing wrong.

---

## What it will not do

- **It will not guess.** Ambiguous rows are never written.
- **It will not touch your import settings.** Repaired references keep the timestamp and MD5
  recorded at import, because those describe the file *as it was imported*; this operation only
  says where that same file now lives.
- **It will not reimport for you.** It repairs the link. Reimporting is your decision and your
  content pipeline's business.
- **It will not write anything without `-Apply`.**

## Source control

With source control enabled, affected files are checked out before they are written, and the
report states how many. If checkout fails the run says so rather than silently relying on a
writable working copy.

---

## Support

Questions, bugs and requests: <https://csaf.itch.io>

Full source is included and is meant to be read.

---

*Source Link · Core Systems Asset Factory*
*This product was built with AI assistance. Code and graphics: AI-assisted. Sounds: none. Text: authored.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
