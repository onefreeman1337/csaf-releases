# GUID Warden — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** GUID Warden  
**Engine:** Unity 6  
**Docs published:** 2026-08-21


---

# GUID Warden

**Meta and GUID integrity, guarded before references break.**

Every reference in a Unity project — every material on a mesh, every sprite in a prefab, every
script on a GameObject — resolves through the GUID in a `.meta` file. Lose a `.meta` in a merge,
copy a folder with its metas, or delete the wrong sidecar file, and Unity repairs the damage
*silently*: it mints a fresh GUID, and everything that pointed at the old one goes quietly `None`.
Nobody is told. You find out in QA, or on a teammate's machine, or after the build ships.

GUID Warden watches that class of breakage continuously, repairs it while repair is still
possible, and refuses the commits that would spread it.

---

## What it does

### Guards, always on
A background watcher re-checks the project after every asset import (toggleable). The scan itself
runs on a worker thread — the editor never blocks, and nothing runs per-frame.

### Repairs, explicitly, with receipts
- **Asset missing its `.meta`** → **Restore the `.meta` from git history.** The original GUID —
  and every reference to it — survives. This is the repair Unity itself cannot perform: on the
  next refresh it mints a fresh GUID and the references break. Or, if you prefer, *Accept fresh
  GUID* records the mint as an explicit decision.
- **Orphaned `.meta`** (its asset is gone) → **Delete it, with a byte-exact backup** kept under
  `Library/` and a one-click restore.
- **One GUID claimed by two files** (the copy-pasted-folder classic) → **You choose which claimant
  keeps the GUID.** Every other claimant is re-minted explicitly — the exact edit is verified
  byte-for-byte after the write — and the card shows every asset that references the contested
  GUID before you decide.

Every act writes a receipt describing what was verified after the write. An act that cannot verify
itself rolls back and says so.

### Prevents, at the repository
One panel installs the three pieces of git configuration most Unity teams are missing:

1. **Smart-merge rules** in `.gitattributes` — scenes, prefabs and assets merge structurally
   through UnityYAMLMerge instead of clobbering each other.
2. **The UnityYAMLMerge driver**, configured repo-locally against this machine's editor install.
3. **A pre-commit guard** (dependency-free POSIX sh) that refuses a commit which:
   - adds an asset without staging its `.meta`,
   - deletes a `.meta` while its asset stays tracked, or
   - stages two `.meta` files claiming one GUID.

   The refusal prints exactly what is wrong and the one-line fix. Bypass is always available with
   `git commit --no-verify`. GUID Warden never modifies a hook or attributes file it did not
   write — a foreign file is reported and left alone, with the hook text one click away to merge
   by hand.

### Gates CI
```
Unity.exe -batchmode -quit -nographics -projectPath . ^
  -executeMethod CSAF.GuidWarden.CI.GuidWardenCI.Run ^
  -guidWardenReport Temp/guid-warden-report.json
```
Exit 0 = clean. Exit 1 = integrity issues (report lists each one). Exit 2 = the scan itself
failed. A scan that examined zero files never passes.

---

## Quick start

1. **Tools → CSAF → GUID Warden → Open Window** (also under Window → CSAF).
2. Press **Scan now** — or just work; the auto-guard re-scans after every import.
3. To see every card and act on deliberately broken files, **Tools → CSAF → GUID Warden →
   Create Sandbox Issues**, then Scan. **Remove Sandbox** cleans up completely.
4. Open the demo scene at `CSAF/GuidWarden/Demo/GuidWardenDemo.unity` and press Play for the
   guided walkthrough.

## Requirements and scope

- Unity **2022.3 or newer** (developed and gated on Unity 6).
- Editor-only: two assemblies (`CSAF.GuidWarden.Editor`, editor-platform-constrained, plus the
  demo). **Nothing ships into your builds**, and there is no `Resources/` folder.
- Reference search covers **text-serialized** assets (the default for years). Binary-serialized
  projects still get scanning, repair and the commit guard; the referencer list says what it
  could not search rather than guessing.
- The commit guard requires git. Everything else works without it.
- All preferences are namespaced (`CSAF.GuidWarden.*`) and never collide with yours.

## Support

Core Systems Asset Factory — CSAF.
Every shipped file is readable C# with XML documentation; the public API (`MetaScanner`,
`ReferenceIndex`, `MetaRepair`, `CollisionResolver`, `GitHygiene`, `GuidWardenCI`) is yours to
script against.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
