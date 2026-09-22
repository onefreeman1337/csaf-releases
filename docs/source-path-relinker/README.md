# Source Path Relinker — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Source Path Relinker  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-22


---

# Source Path Relinker

**Find every asset whose source file has moved, work out which file on disk it actually is, prove
it, and relink it reversibly.**

An art folder moves. Every asset imported from it now fails Reimport with *Source file not found*,
on every machine that syncs. Unreal's answer is a modal file picker in a details panel row, one
asset at a time.

This surveys the whole project without loading a single asset, indexes a directory you name, and
matches each broken source to its real file by **the MD5 the engine recorded when the asset was
imported**. When two files could be the source, it refuses and names both.

- UE 5.8, Windows, editor-only.
- Full C++ source included.

## 1. What makes a match a match

Anything can compare filenames. The reason this is a tool rather than a script is that it
distinguishes a match it can **prove** from one it is **guessing** at, and tells you which you are
looking at:

| class | what it means | written by `-Apply`? |
| --- | --- | --- |
| `hash proven` | exactly one file under `-Root` has the MD5 the engine recorded at import | yes |
| `hash ambiguous` | two or more files carry that MD5, so it refuses and names every one | no |
| `name only` | no usable recorded hash, and exactly one file has that filename | only with `-AllowNameOnly` |
| `name ambiguous` | no recorded hash and several files share the name, so it refuses | no |
| `no candidate` | nothing under `-Root` could be this file | no |
| `healthy` | the recorded path still resolves; never touched, and counted | no |

## 2. Install

1. Copy the `SourcePathRelinker` folder into your project's `Plugins` folder.
2. Launch the editor once so the plugin is registered, then close it.

## 3. First run, two minutes

**Survey the project.** Read-only. Which source paths no longer resolve?

```
UnrealEditor-Cmd.exe "YourProject.uproject" -run=SPR -Audit -unattended -nopause
```

**Fail a build when any source path is broken.**

```
UnrealEditor-Cmd.exe "YourProject.uproject" -run=SPR -Audit -FailOnBroken -unattended -nopause
```

Exit code 5 means at least one source path does not resolve.

**Match the broken ones against a directory.** Still read-only: this previews what `-Apply` would
do and writes nothing.

```
UnrealEditor-Cmd.exe "YourProject.uproject" -run=SPR -Root="D:/Art/Library" -unattended -nopause
```

**Narrow it to part of the project.** Content paths take a leading `+`, not a leading `/`:

```
UnrealEditor-Cmd.exe "YourProject.uproject" -run=SPR -Audit -Paths=+Game/Art -unattended -nopause
```

The `+` is not decoration. Git Bash rewrites a leading `/` into its install root, which turns a
content path into a filesystem path; the tool refuses that outright rather than searching nothing.

## 4. Relinking, and taking it back

`-Apply` is the only switch that writes. It needs `-Root`, because the match comes from the index
and the index comes from the directory you name.

```
UnrealEditor-Cmd.exe "YourProject.uproject" -run=SPR -Root="D:/Art/Library" -Apply -unattended -nopause
```

What happens, in this order:

1. **Every row is validated before anything is touched.** If a package has no file on disk, or is
   read-only because it is not checked out, the run refuses and changes nothing.
2. **Every file it is about to write is copied into a journal** under
   `Saved/SourcePathRelinker/Journal/<stamp>/` first.
3. The paths are rewritten and the packages saved.
4. **Each saved package is re-read from disk** and the tool checks the stored path resolves to the
   file the hash proved. A relink that only looked right in memory is not reported as done.

The run prints its journal stamp. To put every file back exactly as it was:

```
UnrealEditor-Cmd.exe "YourProject.uproject" -run=SPR -Undo=20260922-014233-518 -unattended -nopause
```

Undo restores whole files, so it does not depend on the rows being re-derivable. It refuses if the
journal was written in a different project.

Add `-AllowNameOnly` to also write rows matched by filename alone. Without it those rows are
reported and left alone, and the report says so.

## 5. The report

Every run writes a self-contained HTML report you can send to a lead. Paths in it are shortened to
`<Project>/...` or `.../folder/file` so a screenshot does not carry your machine's directory
layout; the log always has them in full.

| switch | effect |
| --- | --- |
| `-Report=<file.html>` | write it here instead of `Saved/SourcePathRelinker/Reports` |
| `-NoReport` | skip the report |
| `-FullPaths` | print absolute paths in the report too |

**Every switch:**

```
UnrealEditor-Cmd.exe "YourProject.uproject" -run=SPR -Help -unattended -nopause
```

## 6. Exit codes are a contract

| code | meaning |
| --- | --- |
| 0 | ran, and what it claims is proven |
| 2 | bad arguments |
| 4 | refused, nothing was changed |
| 5 | broken source paths found (`-FailOnBroken`) |
| 6 | written but not proven |
| 7 | undo could not restore every file |

1 and 3 are never returned: Unreal itself exits 3 when the process crashes, and a crash must never
read as a clean refusal.

## 7. What it is honest about

- A source file that was never hashed at import (older assets) can only be matched by name, and the
  report says `name only` rather than pretending that is proof.
- A recorded hash that matches nothing under `-Root` is reported as `no candidate`. It does not
  quietly fall back to a same-named file, because a same-named file is usually a different revision
  of the art rather than the missing source.
- Timestamps are ignored on purpose. Copying a file between machines rewrites the timestamp, which
  is exactly the situation this tool exists for.
- An asset can carry more than one source file. The unit of work is the (asset, slot) pair, so a
  mesh with a separate LOD or skinning source has each slot matched and written independently.
- The scan reads asset registry tags and loads nothing. Only assets that are actually being
  rewritten are loaded, and only during `-Apply`.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
