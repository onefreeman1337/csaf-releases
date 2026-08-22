# Primary Asset Doctor — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Primary Asset Doctor  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-08-22


---

# Primary Asset Doctor

**Repairs the Asset Manager configuration that makes `GetPrimaryAssetIdList` return an empty array
with no error.**

For Unreal Engine **5.8**, Windows. Editor plugin. Ships full, readable C++ source.

---

## The problem this exists for

You add a Primary Asset type, point it at a directory, set the base class, and call:

```cpp
TArray<FPrimaryAssetId> Ids;
UAssetManager::Get().GetPrimaryAssetIdList(TEXT("Item"), Ids);
// Ids.Num() == 0
```

No error. No warning. No log line. The Project Settings page still shows your entry, complete and
correct-looking. `LoadPrimaryAsset` fails the same way — silently.

That is not a bug in your code. It is the shape of the subsystem. In
`Engine/Private/AssetManager.cpp`, `ScanPrimaryAssetTypesFromConfig` does this:

```cpp
if (!ShouldScanPrimaryAssetType(TypeInfo))
{
    continue;
}
```

`ShouldScanPrimaryAssetType` returns `FillRuntimeData`'s validity flag, and `FillRuntimeData`
reports failure through `ensureMsgf`. An `ensure` fires once in a Development editor and is
**compiled out of a Shipping build entirely**. So the entry is dropped, and the only thing that
happens is nothing.

There are sixteen distinct ways to reach that state. This plugin finds out which one you are in,
explains it, and repairs it.

---

## What it does, in one run

```
UnrealEditor-Cmd.exe MyProject.uproject -run=PrimaryAssetDoctor -Report=Saved/pad.html
```

That is a **dry run**. It changes nothing. It writes an illustrated report telling you, per Primary
Asset type, whether the engine finds anything under it and — if not — why.

```
UnrealEditor-Cmd.exe MyProject.uproject -run=PrimaryAssetDoctor -Apply -Report=Saved/pad.html
```

That one repairs. It backs up your `DefaultGame.ini` first, writes the corrected values,
reinitialises the Asset Manager, and **runs the entire diagnosis again** to find out whether it
worked. The exit code comes from that second pass.

---

## How it attributes a cause, and why that matters

Most configuration checkers read your settings and tell you what looks wrong. This one is
**differential**. It runs the engine's own `UAssetManager::SearchAssetRegistryPaths` — the same
function `ScanPathsForPrimaryAssets` calls — under your configuration as written, and then again
with exactly one thing changed. The difference is the evidence.

So instead of:

> Your `Directories To Exclude` list looks suspicious.

you get:

> **Directories To Exclude is eating "Item": 34 asset(s) hidden.** The same search finds 34 assets
> with the exclusion list skipped and none with it applied.

The plugin is not modelling the Asset Manager. It is asking it.

---

## The sixteen causes

| Cause | What it looks like to you |
| --- | --- |
| **Base class unresolvable** | The entry looks complete. The class path resolves to nothing — a renamed module, a deleted class, a typo. The most expensive one, because nothing about it looks wrong. |
| **Base class is a generated class** | The `_C` trap. The Asset Manager wants the native *instance* base class and derives the generated classes itself. Given a generated class it builds a derived-class set that matches nothing. |
| **Has Blueprint Classes mismatch** | Your assets are Blueprints and the flag is off, or they are data assets and it is on. Either way the filter rejects every asset and reports success. |
| **Scan directory missing** | A package path the asset registry has never heard of. A directory that is not there is indistinguishable, to the Asset Manager, from one that is empty. |
| **Scan path excluded** | `IsPathExcludedFromScan` uses `Path.Contains()` — a **substring** test, not a path-prefix test. Excluding `/Game/Test` also excludes `/Game/TestChamber`. |
| **Empty exclusion entry** | One blank row in `Directories To Exclude`. Every string contains the empty string, so this silently excludes all primary asset scanning, project-wide. |
| **No scan paths** | No directory and no specific asset. `SearchAssetRegistryPaths` returns 0 immediately. |
| **No base class** | Same immediate zero, from the other precondition. |
| **Type name missing** | An entry with no `PrimaryAssetType`. Skipped before anything else about it is read. |
| **Duplicate type entry** | The engine merges the paths, then applies each entry's `Rules` in order — so the **last** entry's Chunk ID and Cook Rule overwrite the first's. This is how maps silently do not chunk at cook. |
| **Editor only** | `bIsEditorOnly` is checked against `GIsEditor`. Correct in PIE, absent from every packaged build. |
| **Cooked id divergence** | `bShouldGuessTypeAndNameInEditor` is on and `bShouldManagerDetermineTypeAndName` is off. The engine's own comment on the `#else` branch reads `// Never guess type in cooked builds`. |
| **Dead chunk assignment** | A Chunk ID on a type that matches nothing. The chunk is created and stays empty, and a cook that produces an empty chunk does not fail. |
| **Orphaned rules override** | A `Primary Asset Rules` entry naming a type nothing scans. Read, stored, never consulted. |
| **Redirect to nowhere** | A type redirect whose destination no entry declares. |
| **Scan found nothing** | Everything checks out and there are genuinely no assets there yet. Reported so that an empty type stops looking like a broken one. |

---

## What it repairs, and what it refuses

**Repairs it will make**, each previewed in the report before you pass `-Apply`:

- rewrite an `Asset Base Class` to the class that a module rename moved it to — **only when exactly
  one loaded native class carries that name**;
- rewrite a generated class to its nearest native ancestor;
- flip `Has Blueprint Classes` to whichever position the assets on disk require;
- rewrite a scan directory that differs from a real one only in case or by a missing `/Game` root;
- delete an exclusion entry that is provably suppressing a type;
- fold a duplicate type entry into the first, unioning the scan paths;
- set `Should Manager Determine Type And Name`;
- clear `Is Editor Only`;
- delete a nameless type entry, a dead rules override, or an empty exclusion row.

**Refusals are printed as prominently as fixes**, with the reason, by name. It will not:

- invent a type name — that name becomes part of every saved Primary Asset Id in your project;
- guess a base class when the field is empty;
- pick between two classes that share a name — an ambiguous rewrite trades one silent failure for a
  harder-to-find one, because the config now looks repaired;
- guess which directory your assets are in;
- change a chunk assignment you chose on purpose.

`Clear Is Editor Only` is repairable but deliberate: if the type exists to label assets for chunking
rather than to be loaded, the current setting is right and changing it starts cooking content you
did not intend to ship. The report says so on the finding.

---

## Command line

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=PrimaryAssetDoctor
    [-Apply]                  write the repairs. Default is a dry run.
    [-Report=<path.html>]     the illustrated report.
    [-Json=<path.json>]       machine-readable result, for diffing between builds.
    [-FailOn=fatal|any|none]  what makes the run exit non-zero. Default: fatal.
```

**Exit codes**

| Code | Meaning |
| --- | --- |
| `0` | Clean under the chosen `-FailOn` rule. |
| `1` | The gate condition was met. |
| `2` | `-FailOn` was not one of the three accepted values. It refuses to guess which gate you meant. |
| `3` | `-Apply` was given and no re-scan could be run, so the repairs are unverified. It fails rather than reporting an unchecked success. |

### As a CI gate

```yaml
- name: Primary Asset configuration
  run: >
    "%UE%\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" "%CD%\MyProject.uproject"
    -run=PrimaryAssetDoctor -FailOn=fatal
    -Report=Saved/pad.html -Json=Saved/pad.json
    -unattended -nosplash -nopause
```

The dry run is the right mode for a gate: it never touches the working tree, and a fatal finding
fails the build.

---

## Undo

Before the first byte is written, `-Apply` copies your whole `Config/DefaultGame.ini` to:

```
Saved/PrimaryAssetDoctor/DefaultGame.<timestamp>.ini.bak
Saved/PrimaryAssetDoctor/repair.<timestamp>.json
```

To undo, copy the `.bak` back over `Config/DefaultGame.ini` and restart the editor. The `.json`
manifest lists every change with its old and new value, so you can review what happened without the
`.ini` beside you.

**If the backup cannot be made, nothing is written at all.** A repair that cannot be undone is not a
repair this plugin will perform on somebody else's project.

---

## Performance

**No content asset is ever loaded to answer a question about it.** The entire scan runs on asset
registry queries. The only synchronous load the plugin will perform is a single declared base
*class* per type entry — which is exactly what `UAssetManager` itself does at startup, and is bounded
by the number of Primary Asset types you have configured, not by the size of your content.

On a project with a few hundred thousand assets, a dry run is a few seconds.

---

## Installation

1. Copy the `PrimaryAssetDoctor` folder into your project's `Plugins/` directory.
2. Restart the editor. The plugin is enabled by default.
3. Run the command line above, or find the report under whatever `-Report=` path you passed.

The plugin is `Type: Editor`. It compiles into editor and commandlet targets only and contributes
nothing to a packaged game.

---

## Supported versions

**Unreal Engine 5.8 only.** That is the version this plugin was built and verified against with a
zero-warning packaging build, and it is the only version claimed. Earlier engine versions are not
supported, and the `.uplugin` declares `5.8.0` — which the plugin loader **enforces**, so it will
refuse to load rather than misbehave on a version it was not verified on.

---

## Support

- Docs: <https://github.com/onefreeman1337/csaf-releases/blob/main/docs/primary-asset-doctor/README.md>
- Support: <https://csaf.itch.io>

---

## AI disclosure

This product's code and store graphics were produced with AI assistance. Disclosed truthfully on
every storefront it is listed on.

---

Copyright (c) 2026 Core Systems Asset Factory. All Rights Reserved.

Unreal® and Unreal Engine® are trademarks or registered trademarks of Epic Games, Inc.
This product is not affiliated with or endorsed by Epic Games, Inc.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
