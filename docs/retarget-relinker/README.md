# Retarget Relinker — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Retarget Relinker  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-27


---

# Retarget Relinker

**For Unreal Engine 5.8. Windows (Win64). Editor plugin, run as a commandlet.**

You ran *Duplicate and Retarget* (or an IK Retargeter batch export). The new character now has its
own animation library. But every gameplay Blueprint, Anim Blueprint default, DataTable row and soft
reference that should drive the new character still points at the **old** character's animations.

Unreal's options after that are both wrong for this job:

- `EditorAnimUtils::ReplaceReferredAnimationsInBlueprint` takes a `UAnimBlueprint*`. It remaps
  **Anim Blueprints only**.
- *Replace References* (consolidation) is **global**. It redirects every user of the old asset,
  including the old character, which must keep its own library.

Retarget Relinker rewrites the references **only inside the folder you name**, only to twins it can
**prove**, and refuses anything that still belongs to the old character.

---

## What it does

1. **Builds a proven mapping, old asset to retargeted twin, from the asset registry.** For every
   animation asset under `-OldRoot` it predicts the twin's path under `-NewRoot` (same sub-folders,
   renamed by your `-Prefix`, `-Suffix` or `-Replace` rule). A pair is used only when the twin exists,
   is the same class, the old asset is on the old skeleton, the twin is on the new skeleton, and no
   other old asset predicts the same twin. **No animation is loaded to decide this**: the skeleton of
   every asset is read from its registry tag.
2. **Derives the skeletons instead of guessing them.** Give `-OldSkeleton=` and `-NewSkeleton=`, or
   let it read them from the libraries. A library that holds animations on more than one skeleton is
   refused by name, and it tells you which switch to pass.
3. **Finds every package in your `-Scope` that uses the old library**, from the registry's referencer
   graph. Packages outside the scope are left alone and **counted**, and so are the old library's own
   assets.
4. **Refuses, before anything is written:**
   - a referencer that **still drives the old skeleton**: it is itself an animation on the old
     skeleton, an Anim Blueprint targeting it, or it hard-references the old skeleton, a skeletal mesh
     on it, or an Anim Blueprint targeting it. Relinking it would point the old character at the new
     character's animations;
   - a referencer that uses an old asset **with no usable twin** (missing, wrong class, wrong
     skeleton, ambiguous). A half-relinked character plays a mixture of both libraries.
5. **Relinks with `-Apply`, all or nothing.** While anything in scope is refused, `-Apply` writes
   nothing and exits 4. Otherwise it:
   - copies every package it is about to change into a journal,
   - rewrites hard references in each package with the engine's own replace archive (the same one
     Epic's Anim-Blueprint-only remap uses) over every top-level object. On our test project that
     relinked Blueprint variable defaults, Anim Blueprint variable defaults and DataTable rows,
   - rewrites soft references (`FSoftObjectPath` values, measured on a Blueprint default),
   - compiles each touched Blueprint **once**, after every rewrite,
   - saves, then **re-scans the saved files** and counts what still points into the old library.
6. **Gives CI an exit code.** `-FailOnMismatch` exits 5 while any in-scope referencer still points into
   the old library. Referencers refused for driving the old skeleton are left on it by design and are
   not counted as a mismatch.
7. **Undoes byte for byte.** `-Undo=<stamp>` copies every journalled package back.

Every run writes an HTML report to `Saved/RetargetRelinker/Reports/`: the referencers with their
verdicts, then the full mapping with the reason for every refused pair.

## Quick start

The commandlet is `RRL`. Content paths may be written `/Game/...` or `+Game/...` (the `+` form survives
shells that rewrite a leading slash, such as Git Bash).

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=RRL -Help
```

**1. Preview. Writes nothing.**

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=RRL ^
  -OldRoot=+Game/Characters/Manny/Anims -NewRoot=+Game/Characters/Quinn/Anims ^
  -Prefix=RTG_ -Scope=+Game/Characters/Quinn
```

The log lists every refused pair and every in-scope referencer with its verdict, and prints the path
of the HTML report.

**2. Apply.**

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=RRL ^
  -OldRoot=+Game/Characters/Manny/Anims -NewRoot=+Game/Characters/Quinn/Anims ^
  -Prefix=RTG_ -Scope=+Game/Characters/Quinn -Apply
```

It prints `Journal <stamp>`. Keep it.

**3. Prove it in a fresh process, and keep proving it in CI.**

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=RRL ^
  -OldRoot=+Game/Characters/Manny/Anims -NewRoot=+Game/Characters/Quinn/Anims ^
  -Prefix=RTG_ -Scope=+Game/Characters/Quinn -FailOnMismatch
```

**4. Changed your mind?**

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=RRL -Undo=<stamp>
```

Close the editor before `-Apply` and `-Undo`: they rewrite `.uasset` files on disk.

## Switches

| Switch | Meaning |
| --- | --- |
| `-OldRoot=<folder>` | Content folder of the old character's animation library. Required. |
| `-NewRoot=<folder>` | Content folder of the retargeted copies. Required. |
| `-Scope=<folder>[+<folder>...]` | The only folders whose packages may be rewritten. Required: this tool never rewrites a whole project. A folder boundary, not a prefix: `/Game/Hero` does not include `/Game/HeroOld`. |
| `-Prefix=` `-Suffix=` | Added to the old asset name to predict the twin's name. |
| `-Replace=From:To` | Replaced in the old asset name (case-sensitive), before prefix and suffix. |
| `-OldSkeleton=<path>` `-NewSkeleton=<path>` | Object paths of the skeletons. Optional when the library uses exactly one. |
| `-Apply` | Relink. Writes nothing while anything in scope is refused. |
| `-FailOnMismatch` | Exit 5 while any in-scope referencer still points into the old library. |
| `-Undo=<stamp>` | Restore every package a run wrote from its journal. |
| `-Help` | Print the switches and exit codes. |

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Done: preview printed, relink confirmed, nothing to do, or undo complete. |
| 2 | Bad arguments, including an empty `-OldRoot` and a skeleton that cannot be derived. Nothing was read or written. |
| 4 | Refused. Nothing was written. |
| 5 | `-FailOnMismatch`: something in scope still points into the old library. |
| 6 | Written but not confirmed: a save failed, a package had nothing to rewrite, a Blueprint failed to compile, or the re-scan still found old references. `-Undo` restores every byte. |
| 7 | Undo failed. |

Codes 1 and 3 are never used by this tool: the engine uses them for its own failures and a crash.

## Limits, stated plainly

- **It relinks references; it does not retarget animation.** Retarget the animations first with
  Unreal's own tools. A montage that is still on the old skeleton is refused, not relinked: retarget
  it too, and *Duplicate and Retarget* will remap its segments for you.
- **Twins are found by name.** If your retarget renamed assets in a way a prefix, suffix or single
  replace cannot express, the unmatched pairs are refused and listed; nothing is guessed.
- **Montage segment timing is not changed.** Retargeted twins have the length of their source.
- **Levels are not in scope unless you put them there**, and a level that places the old character's
  Blueprint is the old character's.
- Verified on **Unreal Engine 5.8, Win64** only. No other engine version has been run.

## Support

<https://csaf.itch.io>

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
