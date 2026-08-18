# Migration Ledger — Documentation

**Engine-upgrade pre-flight for Unreal Engine 5.**
Find what an engine upgrade silently broke — before your players do.

**Verified on Unreal Engine 5.8, Win64.** That is the only configuration the packaging gate has run
against, and it is the only one claimed. See [Platform support](#platform-support).

- Store page: <https://csaf.itch.io/migration-ledger>
- Support: <https://csaf.itch.io/migration-ledger> (comments) — CSAF, Core Systems Asset Factory

---

## Contents

1. [Quick start](#quick-start)
2. [Installing](#installing)
3. [Running it](#running-it)
4. [Commandlet reference](#commandlet-reference)
5. [Exit codes](#exit-codes)
6. [Reading the report](#reading-the-report)
7. [Core Redirects](#core-redirects)
8. [CI recipes](#ci-recipes)
9. [Platform support](#platform-support)
10. [Technical details](#technical-details)
11. [Troubleshooting](#troubleshooting)
12. [The honest limits](#the-honest-limits)

---

## Quick start

```bat
:: 1. Copy the MigrationLedger folder into YourProject/Plugins/
:: 2. Launch the editor once so it builds, then:

UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=MigrationLedger ^
    -Output="Saved/MigrationLedger" -Since=5.5 -Redirects
```

Open `Saved/MigrationLedger/Report.html`. Read the **Silent degradation** section first — that is the
class of problem this tool exists for.

> **The first run takes a few minutes.** It reads your installed engine's headers once (~28,500 files
> on a stock 5.8 install) and caches an index. Warm runs take about 3 seconds. Progress is logged
> every 10% with elapsed time so you can see it working rather than wondering whether it hung.

---

## The problem this exists for

Unreal will happily open your project on a newer engine, compile it with zero errors, and run it —
while parts of it have quietly stopped doing anything at all.

Two real examples, both of which happened to us and both of which shipped:

- A plugin's `.uplugin` declared `EngineVersion 5.4.0`. On UE 5.8 it compiled **perfectly** — zero
  errors, zero warnings, 21 compile actions — and then the engine logged `Skipping load` and never
  ran a line of it. Nothing in the editor said so.
- `UMaterialInterface::GetUsedTextures` (the 5-argument overload) was deprecated in 5.7 as **`final`
  with an empty body**. Every call compiled with one warning and **measured zero, forever.**

Neither was findable by code review. **That class of failure — compiles clean, does nothing — is what
Migration Ledger looks for.**

---

## Installing

1. Copy the `MigrationLedger` folder into your project's `Plugins/` directory, so you have
   `YourProject/Plugins/MigrationLedger/MigrationLedger.uplugin`.
2. Restart the editor. It will prompt to build the plugin if needed.
3. The plugin is editor-only and `EnabledByDefault`. Nothing ships into a packaged build.

**Source builds:** regenerate project files after copying, then build the editor target as usual.

---

## Running it

Migration Ledger is a **commandlet**, so it runs headlessly and needs no editor UI. That is what
makes it usable from CI.

```bat
UnrealEditor-Cmd.exe YourProject.uproject -run=MigrationLedger ^
    -Output="Saved/MigrationLedger" -FailOn=Silent -Since=5.5 -Redirects
```

---

## Commandlet reference

| Switch | Meaning |
| --- | --- |
| `-Output=<dir>` | Where reports go. Default `Saved/MigrationLedger`. |
| `-FailOn=<sev>` | Non-zero exit at or above `Blocker`, `Silent`, `Warning`, `None`. Default `Silent`. |
| `-Since=<ver>` | Only deprecations from this version onward, e.g. `5.5`. |
| `-Redirects` | Also emit the reviewable `CoreRedirects.ini`. |
| `-Fix` | Apply the safe automatic fixes (see [Core Redirects](#core-redirects)). |
| `-IncludeEnginePlugins` | Also index `Engine/Plugins`. **Off by default** — see below. |
| `-Quiet` | Suppress per-finding log lines. |

**About `-IncludeEnginePlugins`.** By default Migration Ledger indexes `Engine/Source` — 28,567
headers discovered on a stock 5.8 install. Adding `Engine/Plugins` takes that to roughly 78,000,
tripling the I/O, and it matches your code against deprecations in engine plugins your project may
not even enable. That is slower *and* noisier. Turn it on if your project leans heavily on engine
plugins.

---

## Exit codes

Exit codes are the contract:

| Code | Meaning |
| --- | --- |
| `0` | Scan ran, nothing at or above the threshold. |
| `1` | Findings at or above the threshold. |
| `2` | **The scan did no real work.** Not a pass — nothing was examined. |

That third code exists deliberately. A tool that scans nothing and reports success is worse than no
tool, so this one refuses to call that a pass. **Treat exit 2 as a build failure in CI.**

---

## Reading the report

Every report leads with **Silent degradation** as its own section:

- **Silent degradation** — compiles, maybe warns, does not work. Nothing tells you.
- **Warning** — deprecated and still functional. Your compiler will also mention it.
- **Blocker** — will not load, build or cook.

Every report also prints **what was scanned** — headers parsed, index rows, source files, lines,
plugins. "0 findings" means nothing without it.

### Formats

| File | Use |
| --- | --- |
| `Report.html` | Self-contained, no external assets — survives email, CI artifacts and network shares. |
| `Report.json` | Machine-readable, for your own tooling. |
| `Report.xml` | **Valid JUnit** — build servers render it natively as test results. |
| `Report.csv` | Spreadsheets and triage. |

---

## Core Redirects

Unreal already has a supported, declarative way to say "this old name now means that new name" — and
Epic ships **817 of them** in `BaseEngine.ini`. Migration Ledger generates the ones your project
needs, into a **separate, reviewable `CoreRedirects.ini`**.

It does **not** write into your `DefaultEngine.ini` for you. You read it, then you paste it. Undoing
it is deleting the lines.

**Your C++ is never rewritten.** Call sites are reported with file, line and the engine's own
suggested replacement. A human applies them. Automatically editing your source is not a risk this
tool takes.

`-Fix` is limited to correcting a `.uplugin` whose `EngineVersion` would make the engine skip loading
it, and it reads the file back to confirm the change landed.

---

## CI recipes

### GitHub Actions (self-hosted Windows runner with UE installed)

```yaml
- name: Migration Ledger pre-flight
  shell: cmd
  run: |
    "%UE_ROOT%\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" ^
      "%GITHUB_WORKSPACE%\YourProject.uproject" -run=MigrationLedger ^
      -Output="%GITHUB_WORKSPACE%\Saved\MigrationLedger" -FailOn=Silent -Since=5.5

- name: Publish results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: migration-ledger
    path: Saved/MigrationLedger/
```

### Jenkins

```groovy
bat returnStatus: false, script: """
  "%UE_ROOT%\\Engine\\Binaries\\Win64\\UnrealEditor-Cmd.exe" ^
    "%WORKSPACE%\\YourProject.uproject" -run=MigrationLedger ^
    -Output="%WORKSPACE%\\Saved\\MigrationLedger" -FailOn=Silent
"""
junit 'Saved/MigrationLedger/Report.xml'
```

`Report.xml` is valid JUnit, so `junit` renders every finding as a test result with no glue code.

### Suggested rollout

1. Start with `-FailOn=None` and just archive the report — see what your project actually has.
2. Fix the **Silent** findings.
3. Turn on `-FailOn=Silent` so new ones cannot land.

---

## Platform support

| | |
| --- | --- |
| **Editor platforms verified** | **Windows (Win64) — UE 5.8.** This is the only configuration the packaging gate has run on. |
| **Mac / Linux** | The module's `PlatformAllowList` **declares** `Win64`, `Mac` and `Linux`, and the code is plain engine C++ with no platform-specific calls. **Neither has been compiled or tested by us**, so neither is claimed as verified. |
| **Target build platforms** | **None.** The module type is `Editor`; the plugin is not included in a packaged build and adds no runtime cost. |
| **Network replicated** | **No.** Editor-only tooling with no runtime or gameplay surface. |

A `PlatformAllowList` entry is a declaration, not a verification, and we do not present it as one.

---

## Technical details

| Field | Value |
| --- | --- |
| **Code modules** | `MigrationLedger` — Type **Editor**, LoadingPhase **Default**. One module. |
| **Number of Blueprints** | **0** (`CanContainContent: false`; no `.uasset` ships) |
| **Number of C++ classes** | **11** — 6 classes + 5 structs. Plus 2 `UENUM`s. **6 reflected types** (1 `UCLASS`, 3 `USTRUCT`, 2 `UENUM`). |
| **Engine version** | **5.8.0** |
| **Third-party software** | **None.** Dependencies are Epic engine modules only. |
| **Automation tests** | **31**, shipped with the source: `Automation RunTests CSAF.MigrationLedger` |

### Public API

`UMigrationLedgerCommandlet` · `FMigrationLedgerScanner` · `FMigrationLedgerIndex` ·
`FMigrationLedgerFixer` · `FMigrationLedgerReporter` · `FMigrationLedgerModule` ·
`FMigrationDeprecation` · `FMigrationFinding` · `FMigrationCoverage` · `FMigrationFix` ·
`FMigrationSummary` · `EMigrationSeverity` · `EMigrationFindingKind`

Full source ships in `Source/MigrationLedger/` — raw and readable, never minified.

---

## Troubleshooting

**"The first run is taking minutes."** Expected. It reads ~28,500 engine headers once and caches the
index; warm runs are ~3 seconds. Progress logs every 10%.

**Exit code 2.** The scan examined nothing. Check that `-Output` is writable and that the commandlet
was pointed at a real `.uproject`. **Do not treat this as a pass.**

**"It found nothing at all."** Read the coverage line in the report — headers parsed, index rows,
source files, lines. If those are zero, the engine path was not found. If they are large and findings
are zero, your project genuinely has none at that `-Since` threshold.

**A finding names one of my own identifiers.** C++ matching is lexical (comments and string literals
excluded, whole-word boundaries enforced), so a coincidental match is possible. Every finding carries
file and line so you can judge it in a second.

**The plugin does not load.** Check the log for `Skipping load`. That means an `EngineVersion`
mismatch in the `.uplugin` — which is, fittingly, one of the things `-Fix` repairs.

---

## The honest limits

**Read this before you buy, not after.**

- **Removals are not detected.** A symbol deprecated in 5.4 and *removed* by 5.7 is simply absent
  from a 5.8 header, so it cannot be found this way. That is deliberate: removals are hard compile
  errors and your compiler already reports them loudly.
- **89.2% of deprecation markers resolve to a symbol**, not 100%. The rest are reported as
  unattributed and never guessed at. One wrong entry would produce a false blocker and destroy trust
  in every other row.
- **C++ matching is lexical.** See troubleshooting above.
- **A redirect is only emitted when the evidence is strong enough.** The engine's message must name
  an unambiguous replacement of the right kind, and the deprecated symbol must be distinctive enough
  to be safe — an unqualified Core Redirect applies wherever that name appears. Everything filtered
  out still appears in the report with the engine's own message; only the automatic rewrite is
  withheld.
- **Silent-vs-warning classification is a heuristic** based on the engine's own wording ("no longer
  supported", "has no effect", "does nothing"). It is a ranking that puts the dangerous ones at the
  top, not a guarantee.
- **Verified on UE 5.8 / Win64 only.**

---

## AI disclosure

This product's source code was written with AI assistance, and its store artwork is AI-generated.
Declared truthfully on every storefront it appears on.
