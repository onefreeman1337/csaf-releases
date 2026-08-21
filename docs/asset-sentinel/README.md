# Asset Sentinel — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Asset Sentinel  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-08-21


---

# Asset Sentinel

**Data-driven asset standards, performance budgets and CI validation for Unreal Engine 5.**

Unreal ships a validation *framework*. It does not ship the rules. So every studio writes the same
twenty validators again — naming, texture sizes, LOD counts, collision, folder structure — as C++
classes, Python scripts, or Editor Utility Blueprints, on every project.

Asset Sentinel is that missing layer. Rules are **data assets you edit in the Details panel**, not
code. They run in the editor, on save, and headless in your build pipeline. And the ones that can be
repaired automatically, are.

---

## Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Five-minute quickstart](#five-minute-quickstart)
4. [The rule library](#the-rule-library)
5. [Running in CI](#running-in-ci)
6. [Writing your own rules](#writing-your-own-rules)
7. [Performance notes](#performance-notes)
8. [Troubleshooting](#troubleshooting)
9. [Support](#support)

---

## Requirements

| | |
| --- | --- |
| **Engine** | Unreal Engine 5.4 – 5.8 |
| **Platforms** | Win64, Mac, Linux (editor-only — nothing ships in your packaged game) |
| **Project type** | Blueprint or C++ (no C++ project required) |
| **Dependencies** | Data Validation plugin (bundled with the engine; enabled automatically) |

Asset Sentinel is an **editor-only** plugin. Both of its modules are `Type: Editor`, so no code is
compiled into a shipping build and there is zero runtime cost to your game.

---

## Installation

### From Fab

1. Install to your engine version from the Epic Games Launcher.
2. Open your project → **Edit → Plugins** → search "Asset Sentinel" → **Enabled**.
3. Restart the editor when prompted.

### Manual

1. Copy the `AssetSentinel` folder into `YourProject/Plugins/`.
2. If your project is C++, right-click the `.uproject` → **Generate Visual Studio project files**.
3. Open the project. It will offer to build the plugin modules — accept.

---

## Five-minute quickstart

### 1. Create a rule set

Content Browser → **Add → Miscellaneous → Data Asset** → choose **Asset Sentinel Rule Set**.

Name it `DA_StudioStandard` and put it somewhere version-controlled, e.g. `/Game/Standards/`.

> **Why an asset and not a settings file?** Because your standards belong in source control next to
> the content they govern. They diff in a pull request, they branch with the project, and the
> characters team can run a different set from the environment team.

### 2. Add rules

Open the rule set. Under **Rules**, press **+**, then pick a rule class from the dropdown:

| Rule | What it enforces |
| --- | --- |
| Naming Convention | Class-appropriate prefixes and suffixes |
| Texture Budget | Maximum resolution, power-of-two, square |
| Mesh Budget | Triangle caps, LOD coverage, collision presence |
| Folder Policy | Which classes may live in which folders |
| Material Complexity | Unique texture sampler counts |

Each rule expands inline with its own settings. A sensible starting point for **Naming Convention**:

| Asset Class | Required Prefix |
| --- | --- |
| `StaticMesh` | `SM_` |
| `SkeletalMesh` | `SK_` |
| `Texture2D` | `T_` |
| `Material` | `M_` |
| `MaterialInstanceConstant` | `MI_` |
| `Blueprint` | `BP_` |

### 3. Activate it

**Edit → Project Settings → Plugins → Asset Sentinel** → add your rule set to **Active Rule Sets**.

This writes to `Config/DefaultAssetSentinel.ini`, so committing that file gives the whole team the
same standard automatically.

### 4. Scan

**Tools → Asset Sentinel** → **Scan Project**.

- Double-click any result to reveal that asset in the Content Browser
- Select rows marked **FIXABLE** and press **Fix Selected**
- The entire batch is a single undo — Ctrl+Z reverts all of it

---

## The rule library

### Naming Convention

Enforces prefixes and suffixes per asset class, rejects special characters, and catches the `_01`
duplication suffixes left behind by Ctrl+W.

**Auto-fix: yes.** Renames go through Unreal's asset tools, so redirectors are created and
referencing assets are repointed. Bulk-renaming 300 textures will not break the materials that use
them.

When several patterns match an asset, the **most derived class wins** — a `Texture2D` pattern beats
a generic `Texture` pattern regardless of array order.

### Texture Budget

Caps resolution on either axis, optionally requires power-of-two and square dimensions.

Reads the Asset Registry's cached dimensions, so a full texture library is checked **without loading
a single texture**.

### Mesh Budget

Caps LOD0 triangles, requires a minimum LOD count, and requires simple collision.

**Nanite meshes are exempt from the LOD requirement by default.** Demanding traditional LODs on a
Nanite mesh is wrong advice, and rules that give wrong advice get ignored.

### Folder Policy

Restricts asset classes to agreed content roots, and flags assets dumped directly in `/Game` rather
than a subfolder.

The rule most likely to differ between studios — which is exactly why it is data.

### Material Complexity

Caps the number of unique textures a material samples, and can flag two-sided materials.

**This is the only built-in rule that loads assets**, because sampler usage is not published to the
Asset Registry. Scope it to your materials folder on large projects. See
[Performance notes](#performance-notes).

---

## Running in CI

Asset Sentinel exposes a commandlet that returns a meaningful exit code and writes machine-readable
reports.

```bash
UnrealEditor-Cmd.exe MyProject.uproject -run=AssetSentinel \
    -RuleSet=/Game/Standards/DA_StudioStandard \
    -Output=Saved/AssetSentinel \
    -FailOn=Error \
    -unattended -nopause
```

### Switches

| Switch | Effect |
| --- | --- |
| `-RuleSet=<path>` | Rule set to run. Join several with `+`. Defaults to Project Settings. |
| `-Output=<dir>` | Report directory. Relative paths resolve against the project. |
| `-FailOn=<sev>` | `Error` (default), `Warning`, or `Info`. |
| `-NoLoad` | Registry-only. Skips load-dependent rules for a much faster pass. |
| `-Quiet` | Suppress per-issue logging; keep the summary. |

### Exit codes

| Code | Meaning | What your build step should do |
| --- | --- | --- |
| `0` | Clean, or only issues below the threshold | Continue |
| `1` | Violations at or above the threshold | Fail the build |
| `2` | Configuration error — no rule sets, bad path | **Alert someone.** The gate itself is broken. |

The `1` / `2` split matters: "the project is dirty" and "the check never ran" are very different
problems, and only one of them should page a human at 3am.

### Reports

Three formats, written side by side:

| File | Format | Consumer |
| --- | --- | --- |
| `Report.xml` | JUnit | Jenkins, TeamCity, GitLab CI, GitHub Actions — parsed natively |
| `Report.json` | JSON (versioned schema) | Your own dashboards and trend tracking |
| `Report.html` | Self-contained HTML | Producers and leads; no external CSS/JS, survives email |

Each rule becomes a JUnit `<testsuite>`, so CI shows *"Naming.Convention: 12 failures"* rather than
one opaque red step.

### GitHub Actions example

```yaml
- name: Asset standards
  run: |
    "$UE_ROOT/Engine/Binaries/Win64/UnrealEditor-Cmd.exe" \
      "${{ github.workspace }}/MyProject.uproject" \
      -run=AssetSentinel -FailOn=Error -unattended -nopause

- name: Publish results
  if: always()
  uses: mikepenz/action-junit-report@v4
  with:
    report_paths: 'Saved/AssetSentinel/Report.xml'
```

### On-save validation

Asset Sentinel also registers with Unreal's native Data Validation pipeline, so rules fire when an
asset is saved and when it is submitted to source control — no panel required.

Toggle under **Project Settings → Plugins → Asset Sentinel → Enable On Save Validation**.

---

## Writing your own rules

The built-in library covers the common cases. For studio-specific checks, derive from
`UAssetSentinelRule` in C++ or Blueprint.

```cpp
UCLASS(DisplayName = "No Placeholder Materials")
class UMyRule_NoPlaceholders : public UAssetSentinelRule
{
    GENERATED_BODY()

public:
    virtual FName GetRuleId() const override { return TEXT("Studio.NoPlaceholders"); }
    virtual FText GetRuleName() const override { return INVTEXT("No Placeholder Materials"); }

    // Return false whenever the verdict can come from registry tags alone.
    virtual bool RequiresAssetLoad() const override { return false; }

    virtual void EvaluateAsset(
        const FAssetSentinelRuleContext& Context,
        const FAssetData& AssetData,
        UObject* LoadedAsset,
        TArray<FAssetSentinelIssue>& OutIssues) const override
    {
        if (AssetData.AssetName.ToString().Contains(TEXT("Placeholder")))
        {
            FAssetSentinelIssue Issue = MakeIssue(AssetData,
                INVTEXT("Placeholder asset found in a shipping folder."));
            Issue.Suggestion = INVTEXT("Replace it or move it under /Game/Dev.");
            OutIssues.Add(MoveTemp(Issue));
        }
    }
};
```

The class appears in the rule dropdown automatically — no registration step.

To support auto-fix, override `SupportsAutoFix()` and `ApplyAutoFix()`. Your fix is called inside an
outer transaction, so mark objects dirty and let the caller handle undo — **do not open your own
transaction**.

---

## Performance notes

Scan speed is decided by one thing: **how many assets have to be loaded.**

- Four of the five built-in rules are **registry-only**. They read cached metadata and never load an
  asset. A 10,000-asset project scans in seconds.
- **Material Complexity loads every material it evaluates**, because sampler counts are not in the
  registry. Scope it with `AppliesToClasses` and `ExcludePaths`.

Practical settings for a large project:

| Setting | Value | Why |
| --- | --- | --- |
| **Allow Asset Loading** | Off for interactive scans, on in CI | Fast feedback locally, thorough checking nightly |
| **Scan Chunk Size** | 256 (default) | Lower makes Cancel feel more instant; higher scans marginally faster |
| `-NoLoad` in CI | On for per-commit, off for nightly | Two tiers of strictness |

The editor stays responsive throughout: work is chunked, progress is reported, and **Cancel returns
a partial report** rather than discarding what was already found.

---

## Troubleshooting

**"No rule sets are active"**
Project Settings → Plugins → Asset Sentinel → **Active Rule Sets**. The panel reads that list, not
the assets in your Content Browser.

**A rule reports nothing at all**
Check `Applies To Classes` on the rule. An entry for `Texture2D` will not match a `TextureCube`.
Leave the list empty to match every class.

**Mesh or texture rules stay silent on some assets**
Those rules read Asset Registry tags, which a few asset types do not publish. A missing tag is
treated as "no opinion" rather than a violation — crying wolf on a clean asset is worse than staying
quiet.

**Scanning is slow**
A loading rule is in scope. Turn off **Allow Asset Loading** to confirm, then narrow that rule's
`AppliesToClasses` and `ExcludePaths`.

**A fix failed with "checked out by another user"**
The rename could not acquire the file. Check the asset out, or coordinate with whoever holds it.

**The commandlet exits `2`**
Configuration, not content. Either no rule sets resolved, or a `-RuleSet=` path was wrong. The path
is a package path (`/Game/Standards/DA_StudioStandard`), not a filename.

**Nothing appears under Tools**
Confirm the plugin is enabled and the editor restarted. If you built manually, check the Output Log
for `Asset Sentinel UI loaded.`

---

## Support

Include your engine version, the plugin version (`1.0.0`), your rule set asset, and the relevant
section of `Saved/Logs/`. Filtering the log to `LogAssetSentinel` usually shows the cause
immediately.

---

*Asset Sentinel 1.0.0 · Unreal Engine 5.4–5.8 · Editor-only*


---

# Asset Sentinel — Documentation

Data-driven asset standards, budgets and CI validation for Unreal Engine 5.8.

---

## 1. What it does

Unreal ships a validation *framework* (`UEditorValidatorBase`) and no rules. Every studio that wants
naming conventions, texture budgets or folder policies writes that C++ themselves and maintains it —
and then discovers their technical artists cannot change a rule without a programmer and a recompile.

Asset Sentinel makes rules **editable data**. A technical artist authors the standard; nobody writes
a plugin.

---

## 2. Installation

1. Copy the `AssetSentinel` folder into your project's `Plugins/` directory.
2. Open the project. Unreal will offer to build the plugin modules — accept.
3. **Edit → Plugins → Editor → Asset Sentinel** and confirm it is enabled.
4. Restart the editor.

**Requires the Data Validation plugin**, which ships with the engine. Asset Sentinel enables it
automatically via its `.uplugin` dependency.

---

## 3. Creating a rule set

A rule set is a Data Asset. **Content Browser → right-click → Miscellaneous → Data Asset →
`AssetSentinelRuleSet`.**

| Property | Meaning |
| --- | --- |
| `Display Name` | Shown in reports |
| `Notes` | Free text for your team |
| `Scan Paths` | Package paths to scan. Defaults to `/Game` when empty |
| `Global Exclude Paths` | Paths skipped entirely, e.g. `/Game/ThirdParty` |
| `Rules` | The rules themselves — instanced sub-objects |
| `CI Failure Threshold` | Severity at or above which the commandlet returns non-zero |

Each rule carries **its own `Severity`** (Info / Warning / Error). Roll a new standard out as
warnings, then promote it to errors once the project is clean.

---

## 4. Built-in rules

### Naming Convention
Enforces prefixes and suffixes per asset class.

- `Patterns` — a list of `Asset Class` → `Required Prefix` / `Required Suffix`
- `Disallow Special Characters` — flags anything outside `A–Z a–z 0–9 _`
- `Disallow Duplicate Suffixes` — catches `SM_Rock_01_01`

Subclasses inherit their parent's pattern, so one entry for `UMaterial` covers material instances.

### Texture Budget
Maximum dimensions, and whether non-power-of-two is permitted.

### Mesh Budget
- `Max Triangles`
- `Min LOD Count`
- `Require Collision`
- `Exempt Nanite From LOD Check` — Nanite meshes legitimately ship without traditional LODs

### Folder Policy
Restricts asset classes to agreed package paths, e.g. `UMaterial` only under `/Game/Materials`.

---

## 5. Running in the editor

**Window → Asset Sentinel.** Choose a rule set, press **Scan**. Results group by rule and are
double-clickable to select the offending asset in the Content Browser.

Issues marked **Auto-fixable** can be applied from the panel. Auto-fix is opt-in and undoable.

Scans read the **Asset Registry**, not loaded assets — a 10,000-asset project scans in seconds rather
than hanging the editor while everything loads.

---

## 6. Running headless in CI

```bash
UnrealEditor-Cmd.exe <Project>.uproject \
  -run=AssetSentinel \
  -RuleSet=/Game/Standards/DA_StudioStandard \
  -Output=Artifacts \
  -unattended -nopause -nosplash
```

| Switch | Effect |
| --- | --- |
| `-RuleSet=<path>` | One or more rule sets, joined with `+`. Omit to use Project Settings |
| `-Output=<dir>` | Where the reports are written |
| `-FailOn=<severity>` | Override the CI failure threshold |
| `-Quiet` | Suppress per-issue logging; print the summary only |
| `-NoLoad` | Never load assets, even where a rule would benefit |

**Exit codes:** `0` pass · `1` violations at or above the threshold · `2` configuration error.

Example output:

```
==================================================
  Asset Sentinel: FAIL
  Assets scanned : 11 (0 loaded)
  Errors         : 3
  Warnings       : 0
  Auto-fixable   : 3
  Fail threshold : Error
==================================================
```

---

## 7. Reports

Three formats are written to `-Output`, because three different things read them.

- **`Report.xml`** — JUnit. Your CI already renders it; each violation is a failed test case grouped
  by rule.
- **`Report.json`** — versioned schema with `ruleId`, `severity`, `asset`, `assetClass`, `message`,
  `suggestion` and `autoFixable` per issue. For dashboards and trend tracking.
- **`Report.html`** — a readable summary to attach to a build, or hand to an art lead who does not
  read build logs.

Toggle each in **Project Settings → Plugins → Asset Sentinel**.

---

## 8. Writing a custom rule

Subclass `UAssetSentinelRule` and override two methods:

```cpp
UCLASS(DisplayName = "My Rule")
class UMyRule : public UAssetSentinelRule
{
    GENERATED_BODY()
public:
    virtual FName GetRuleId() const override { return TEXT("My.Rule"); }
    virtual void Evaluate(const FAssetSentinelContext& Ctx,
                          const FAssetData& Asset,
                          TArray<FAssetSentinelIssue>& OutIssues) const override;
};
```

Prefer `Asset.GetTagValue(...)` over loading. Loading every asset to read one property is the
difference between a two-second scan and a twenty-minute editor hang.

---

## 9. Support

Issues and questions: <https://github.com/onefreeman1337/csaf-releases/issues>

---

## 10. Engine support

**Unreal Engine 5.8, Windows.** Earlier versions are not claimed because they were not built and
verified. If you need 5.4–5.7, open an issue and it will be built and verified against them.


---

# Asset Sentinel — Documentation

Data-driven asset standards, budgets and CI validation for Unreal Engine 5.8.

---

## 1. What it does

Unreal ships a validation *framework* (`UEditorValidatorBase`) and no rules. Every studio that wants
naming conventions, texture budgets or folder policies writes that C++ themselves and maintains it —
and then discovers their technical artists cannot change a rule without a programmer and a recompile.

Asset Sentinel makes rules **editable data**. A technical artist authors the standard; nobody writes
a plugin.

---

## 2. Installation

1. Copy the `AssetSentinel` folder into your project's `Plugins/` directory.
2. Open the project. Unreal will offer to build the plugin modules — accept.
3. **Edit → Plugins → Editor → Asset Sentinel** and confirm it is enabled.
4. Restart the editor.

**Requires the Data Validation plugin**, which ships with the engine. Asset Sentinel enables it
automatically via its `.uplugin` dependency.

---

## 3. Creating a rule set

A rule set is a Data Asset. **Content Browser → right-click → Miscellaneous → Data Asset →
`AssetSentinelRuleSet`.**

| Property | Meaning |
| --- | --- |
| `Display Name` | Shown in reports |
| `Notes` | Free text for your team |
| `Scan Paths` | Package paths to scan. Defaults to `/Game` when empty |
| `Global Exclude Paths` | Paths skipped entirely, e.g. `/Game/ThirdParty` |
| `Rules` | The rules themselves — instanced sub-objects |
| `CI Failure Threshold` | Severity at or above which the commandlet returns non-zero |

Each rule carries **its own `Severity`** (Info / Warning / Error). Roll a new standard out as
warnings, then promote it to errors once the project is clean.

---

## 4. Built-in rules

### Naming Convention
Enforces prefixes and suffixes per asset class.

- `Patterns` — a list of `Asset Class` → `Required Prefix` / `Required Suffix`
- `Disallow Special Characters` — flags anything outside `A–Z a–z 0–9 _`
- `Disallow Duplicate Suffixes` — catches `SM_Rock_01_01`

Subclasses inherit their parent's pattern, so one entry for `UMaterial` covers material instances.

### Texture Budget
Maximum dimensions, and whether non-power-of-two is permitted.

### Mesh Budget
- `Max Triangles`
- `Min LOD Count`
- `Require Collision`
- `Exempt Nanite From LOD Check` — Nanite meshes legitimately ship without traditional LODs

### Folder Policy
Restricts asset classes to agreed package paths, e.g. `UMaterial` only under `/Game/Materials`.

---

## 5. Running in the editor

**Window → Asset Sentinel.** Choose a rule set, press **Scan**. Results group by rule and are
double-clickable to select the offending asset in the Content Browser.

Issues marked **Auto-fixable** can be applied from the panel. Auto-fix is opt-in and undoable.

Scans read the **Asset Registry**, not loaded assets — a 10,000-asset project scans in seconds rather
than hanging the editor while everything loads.

---

## 6. Running headless in CI

```bash
UnrealEditor-Cmd.exe <Project>.uproject \
  -run=AssetSentinel \
  -RuleSet=/Game/Standards/DA_StudioStandard \
  -Output=Artifacts \
  -unattended -nopause -nosplash
```

| Switch | Effect |
| --- | --- |
| `-RuleSet=<path>` | One or more rule sets, joined with `+`. Omit to use Project Settings |
| `-Output=<dir>` | Where the reports are written |
| `-FailOn=<severity>` | Override the CI failure threshold |
| `-Quiet` | Suppress per-issue logging; print the summary only |
| `-NoLoad` | Never load assets, even where a rule would benefit |

**Exit codes:** `0` pass · `1` violations at or above the threshold · `2` configuration error.

Example output:

```
==================================================
  Asset Sentinel: FAIL
  Assets scanned : 11 (0 loaded)
  Errors         : 3
  Warnings       : 0
  Auto-fixable   : 3
  Fail threshold : Error
==================================================
```

---

## 7. Reports

Three formats are written to `-Output`, because three different things read them.

- **`Report.xml`** — JUnit. Your CI already renders it; each violation is a failed test case grouped
  by rule.
- **`Report.json`** — versioned schema with `ruleId`, `severity`, `asset`, `assetClass`, `message`,
  `suggestion` and `autoFixable` per issue. For dashboards and trend tracking.
- **`Report.html`** — a readable summary to attach to a build, or hand to an art lead who does not
  read build logs.

Toggle each in **Project Settings → Plugins → Asset Sentinel**.

---

## 8. Writing a custom rule

Subclass `UAssetSentinelRule` and override two methods:

```cpp
UCLASS(DisplayName = "My Rule")
class UMyRule : public UAssetSentinelRule
{
    GENERATED_BODY()
public:
    virtual FName GetRuleId() const override { return TEXT("My.Rule"); }
    virtual void Evaluate(const FAssetSentinelContext& Ctx,
                          const FAssetData& Asset,
                          TArray<FAssetSentinelIssue>& OutIssues) const override;
};
```

Prefer `Asset.GetTagValue(...)` over loading. Loading every asset to read one property is the
difference between a two-second scan and a twenty-minute editor hang.

---

## 9. Support

Issues and questions: <https://github.com/onefreeman1337/csaf-releases/issues>

---

## 10. Engine support

**Unreal Engine 5.8, Windows.** Earlier versions are not claimed because they were not built and
verified. If you need 5.4–5.7, open an issue and it will be built and verified against them.


---

# Asset Sentinel — Documentation

Data-driven asset standards, budgets and CI validation for Unreal Engine 5.8.

---

## 1. What it does

Unreal ships a validation *framework* (`UEditorValidatorBase`) and no rules. Every studio that wants
naming conventions, texture budgets or folder policies writes that C++ themselves and maintains it —
and then discovers their technical artists cannot change a rule without a programmer and a recompile.

Asset Sentinel makes rules **editable data**. A technical artist authors the standard; nobody writes
a plugin.

---

## 2. Installation

1. Copy the `AssetSentinel` folder into your project's `Plugins/` directory.
2. Open the project. Unreal will offer to build the plugin modules — accept.
3. **Edit → Plugins → Editor → Asset Sentinel** and confirm it is enabled.
4. Restart the editor.

**Requires the Data Validation plugin**, which ships with the engine. Asset Sentinel enables it
automatically via its `.uplugin` dependency.

---

## 3. Creating a rule set

A rule set is a Data Asset. **Content Browser → right-click → Miscellaneous → Data Asset →
`AssetSentinelRuleSet`.**

| Property | Meaning |
| --- | --- |
| `Display Name` | Shown in reports |
| `Notes` | Free text for your team |
| `Scan Paths` | Package paths to scan. Defaults to `/Game` when empty |
| `Global Exclude Paths` | Paths skipped entirely, e.g. `/Game/ThirdParty` |
| `Rules` | The rules themselves — instanced sub-objects |
| `CI Failure Threshold` | Severity at or above which the commandlet returns non-zero |

Each rule carries **its own `Severity`** (Info / Warning / Error). Roll a new standard out as
warnings, then promote it to errors once the project is clean.

---

## 4. Built-in rules

### Naming Convention
Enforces prefixes and suffixes per asset class.

- `Patterns` — a list of `Asset Class` → `Required Prefix` / `Required Suffix`
- `Disallow Special Characters` — flags anything outside `A–Z a–z 0–9 _`
- `Disallow Duplicate Suffixes` — catches `SM_Rock_01_01`

Subclasses inherit their parent's pattern, so one entry for `UMaterial` covers material instances.

### Texture Budget
Maximum dimensions, and whether non-power-of-two is permitted.

### Mesh Budget
- `Max Triangles`
- `Min LOD Count`
- `Require Collision`
- `Exempt Nanite From LOD Check` — Nanite meshes legitimately ship without traditional LODs

### Folder Policy
Restricts asset classes to agreed package paths, e.g. `UMaterial` only under `/Game/Materials`.

---

## 5. Running in the editor

**Window → Asset Sentinel.** Choose a rule set, press **Scan**. Results group by rule and are
double-clickable to select the offending asset in the Content Browser.

Issues marked **Auto-fixable** can be applied from the panel. Auto-fix is opt-in and undoable.

Scans read the **Asset Registry**, not loaded assets — a 10,000-asset project scans in seconds rather
than hanging the editor while everything loads.

---

## 6. Running headless in CI

```bash
UnrealEditor-Cmd.exe <Project>.uproject \
  -run=AssetSentinel \
  -RuleSet=/Game/Standards/DA_StudioStandard \
  -Output=Artifacts \
  -unattended -nopause -nosplash
```

| Switch | Effect |
| --- | --- |
| `-RuleSet=<path>` | One or more rule sets, joined with `+`. Omit to use Project Settings |
| `-Output=<dir>` | Where the reports are written |
| `-FailOn=<severity>` | Override the CI failure threshold |
| `-Quiet` | Suppress per-issue logging; print the summary only |
| `-NoLoad` | Never load assets, even where a rule would benefit |

**Exit codes:** `0` pass · `1` violations at or above the threshold · `2` configuration error.

Example output:

```
==================================================
  Asset Sentinel: FAIL
  Assets scanned : 11 (0 loaded)
  Errors         : 3
  Warnings       : 0
  Auto-fixable   : 3
  Fail threshold : Error
==================================================
```

---

## 7. Reports

Three formats are written to `-Output`, because three different things read them.

- **`Report.xml`** — JUnit. Your CI already renders it; each violation is a failed test case grouped
  by rule.
- **`Report.json`** — versioned schema with `ruleId`, `severity`, `asset`, `assetClass`, `message`,
  `suggestion` and `autoFixable` per issue. For dashboards and trend tracking.
- **`Report.html`** — a readable summary to attach to a build, or hand to an art lead who does not
  read build logs.

Toggle each in **Project Settings → Plugins → Asset Sentinel**.

---

## 8. Writing a custom rule

Subclass `UAssetSentinelRule` and override two methods:

```cpp
UCLASS(DisplayName = "My Rule")
class UMyRule : public UAssetSentinelRule
{
    GENERATED_BODY()
public:
    virtual FName GetRuleId() const override { return TEXT("My.Rule"); }
    virtual void Evaluate(const FAssetSentinelContext& Ctx,
                          const FAssetData& Asset,
                          TArray<FAssetSentinelIssue>& OutIssues) const override;
};
```

Prefer `Asset.GetTagValue(...)` over loading. Loading every asset to read one property is the
difference between a two-second scan and a twenty-minute editor hang.

---

## 9. Support

Issues and questions: <https://github.com/onefreeman1337/csaf-releases/issues>

---

## 10. Engine support

**Unreal Engine 5.8, Windows.** Earlier versions are not claimed because they were not built and
verified. If you need 5.4–5.7, open an issue and it will be built and verified against them.


---

# Asset Sentinel — Documentation

Data-driven asset standards, budgets and CI validation for Unreal Engine 5.8.

---

## 1. What it does

Unreal ships a validation *framework* (`UEditorValidatorBase`) and no rules. Every studio that wants
naming conventions, texture budgets or folder policies writes that C++ themselves and maintains it —
and then discovers their technical artists cannot change a rule without a programmer and a recompile.

Asset Sentinel makes rules **editable data**. A technical artist authors the standard; nobody writes
a plugin.

---

## 2. Installation

1. Copy the `AssetSentinel` folder into your project's `Plugins/` directory.
2. Open the project. Unreal will offer to build the plugin modules — accept.
3. **Edit → Plugins → Editor → Asset Sentinel** and confirm it is enabled.
4. Restart the editor.

**Requires the Data Validation plugin**, which ships with the engine. Asset Sentinel enables it
automatically via its `.uplugin` dependency.

---

## 3. Creating a rule set

A rule set is a Data Asset. **Content Browser → right-click → Miscellaneous → Data Asset →
`AssetSentinelRuleSet`.**

| Property | Meaning |
| --- | --- |
| `Display Name` | Shown in reports |
| `Notes` | Free text for your team |
| `Scan Paths` | Package paths to scan. Defaults to `/Game` when empty |
| `Global Exclude Paths` | Paths skipped entirely, e.g. `/Game/ThirdParty` |
| `Rules` | The rules themselves — instanced sub-objects |
| `CI Failure Threshold` | Severity at or above which the commandlet returns non-zero |

Each rule carries **its own `Severity`** (Info / Warning / Error). Roll a new standard out as
warnings, then promote it to errors once the project is clean.

---

## 4. Built-in rules

### Naming Convention
Enforces prefixes and suffixes per asset class.

- `Patterns` — a list of `Asset Class` → `Required Prefix` / `Required Suffix`
- `Disallow Special Characters` — flags anything outside `A–Z a–z 0–9 _`
- `Disallow Duplicate Suffixes` — catches `SM_Rock_01_01`

Subclasses inherit their parent's pattern, so one entry for `UMaterial` covers material instances.

### Texture Budget
Maximum dimensions, and whether non-power-of-two is permitted.

### Mesh Budget
- `Max Triangles`
- `Min LOD Count`
- `Require Collision`
- `Exempt Nanite From LOD Check` — Nanite meshes legitimately ship without traditional LODs

### Folder Policy
Restricts asset classes to agreed package paths, e.g. `UMaterial` only under `/Game/Materials`.

---

## 5. Running in the editor

**Window → Asset Sentinel.** Choose a rule set, press **Scan**. Results group by rule and are
double-clickable to select the offending asset in the Content Browser.

Issues marked **Auto-fixable** can be applied from the panel. Auto-fix is opt-in and undoable.

Scans read the **Asset Registry**, not loaded assets — a 10,000-asset project scans in seconds rather
than hanging the editor while everything loads.

---

## 6. Running headless in CI

```bash
UnrealEditor-Cmd.exe <Project>.uproject \
  -run=AssetSentinel \
  -RuleSet=/Game/Standards/DA_StudioStandard \
  -Output=Artifacts \
  -unattended -nopause -nosplash
```

| Switch | Effect |
| --- | --- |
| `-RuleSet=<path>` | One or more rule sets, joined with `+`. Omit to use Project Settings |
| `-Output=<dir>` | Where the reports are written |
| `-FailOn=<severity>` | Override the CI failure threshold |
| `-Quiet` | Suppress per-issue logging; print the summary only |
| `-NoLoad` | Never load assets, even where a rule would benefit |

**Exit codes:** `0` pass · `1` violations at or above the threshold · `2` configuration error.

Example output:

```
==================================================
  Asset Sentinel: FAIL
  Assets scanned : 11 (0 loaded)
  Errors         : 3
  Warnings       : 0
  Auto-fixable   : 3
  Fail threshold : Error
==================================================
```

---

## 7. Reports

Three formats are written to `-Output`, because three different things read them.

- **`Report.xml`** — JUnit. Your CI already renders it; each violation is a failed test case grouped
  by rule.
- **`Report.json`** — versioned schema with `ruleId`, `severity`, `asset`, `assetClass`, `message`,
  `suggestion` and `autoFixable` per issue. For dashboards and trend tracking.
- **`Report.html`** — a readable summary to attach to a build, or hand to an art lead who does not
  read build logs.

Toggle each in **Project Settings → Plugins → Asset Sentinel**.

---

## 8. Writing a custom rule

Subclass `UAssetSentinelRule` and override two methods:

```cpp
UCLASS(DisplayName = "My Rule")
class UMyRule : public UAssetSentinelRule
{
    GENERATED_BODY()
public:
    virtual FName GetRuleId() const override { return TEXT("My.Rule"); }
    virtual void Evaluate(const FAssetSentinelContext& Ctx,
                          const FAssetData& Asset,
                          TArray<FAssetSentinelIssue>& OutIssues) const override;
};
```

Prefer `Asset.GetTagValue(...)` over loading. Loading every asset to read one property is the
difference between a two-second scan and a twenty-minute editor hang.

---

## 9. Support

Issues and questions: <https://github.com/onefreeman1337/csaf-releases/issues>

---

## 10. Engine support

**Unreal Engine 5.8, Windows.** Earlier versions are not claimed because they were not built and
verified. If you need 5.4–5.7, open an issue and it will be built and verified against them.


---

# Asset Sentinel — Documentation

Data-driven asset standards, budgets and CI validation for Unreal Engine 5.8.

---

## 1. What it does

Unreal ships a validation *framework* (`UEditorValidatorBase`) and no rules. Every studio that wants
naming conventions, texture budgets or folder policies writes that C++ themselves and maintains it —
and then discovers their technical artists cannot change a rule without a programmer and a recompile.

Asset Sentinel makes rules **editable data**. A technical artist authors the standard; nobody writes
a plugin.

---

## 2. Installation

1. Copy the `AssetSentinel` folder into your project's `Plugins/` directory.
2. Open the project. Unreal will offer to build the plugin modules — accept.
3. **Edit → Plugins → Editor → Asset Sentinel** and confirm it is enabled.
4. Restart the editor.

**Requires the Data Validation plugin**, which ships with the engine. Asset Sentinel enables it
automatically via its `.uplugin` dependency.

---

## 3. Creating a rule set

A rule set is a Data Asset. **Content Browser → right-click → Miscellaneous → Data Asset →
`AssetSentinelRuleSet`.**

| Property | Meaning |
| --- | --- |
| `Display Name` | Shown in reports |
| `Notes` | Free text for your team |
| `Scan Paths` | Package paths to scan. Defaults to `/Game` when empty |
| `Global Exclude Paths` | Paths skipped entirely, e.g. `/Game/ThirdParty` |
| `Rules` | The rules themselves — instanced sub-objects |
| `CI Failure Threshold` | Severity at or above which the commandlet returns non-zero |

Each rule carries **its own `Severity`** (Info / Warning / Error). Roll a new standard out as
warnings, then promote it to errors once the project is clean.

---

## 4. Built-in rules

### Naming Convention
Enforces prefixes and suffixes per asset class.

- `Patterns` — a list of `Asset Class` → `Required Prefix` / `Required Suffix`
- `Disallow Special Characters` — flags anything outside `A–Z a–z 0–9 _`
- `Disallow Duplicate Suffixes` — catches `SM_Rock_01_01`

Subclasses inherit their parent's pattern, so one entry for `UMaterial` covers material instances.

### Texture Budget
Maximum dimensions, and whether non-power-of-two is permitted.

### Mesh Budget
- `Max Triangles`
- `Min LOD Count`
- `Require Collision`
- `Exempt Nanite From LOD Check` — Nanite meshes legitimately ship without traditional LODs

### Folder Policy
Restricts asset classes to agreed package paths, e.g. `UMaterial` only under `/Game/Materials`.

---

## 5. Running in the editor

**Window → Asset Sentinel.** Choose a rule set, press **Scan**. Results group by rule and are
double-clickable to select the offending asset in the Content Browser.

Issues marked **Auto-fixable** can be applied from the panel. Auto-fix is opt-in and undoable.

Scans read the **Asset Registry**, not loaded assets — a 10,000-asset project scans in seconds rather
than hanging the editor while everything loads.

---

## 6. Running headless in CI

```bash
UnrealEditor-Cmd.exe <Project>.uproject \
  -run=AssetSentinel \
  -RuleSet=/Game/Standards/DA_StudioStandard \
  -Output=Artifacts \
  -unattended -nopause -nosplash
```

| Switch | Effect |
| --- | --- |
| `-RuleSet=<path>` | One or more rule sets, joined with `+`. Omit to use Project Settings |
| `-Output=<dir>` | Where the reports are written |
| `-FailOn=<severity>` | Override the CI failure threshold |
| `-Quiet` | Suppress per-issue logging; print the summary only |
| `-NoLoad` | Never load assets, even where a rule would benefit |

**Exit codes:** `0` pass · `1` violations at or above the threshold · `2` configuration error.

Example output:

```
==================================================
  Asset Sentinel: FAIL
  Assets scanned : 11 (0 loaded)
  Errors         : 3
  Warnings       : 0
  Auto-fixable   : 3
  Fail threshold : Error
==================================================
```

---

## 7. Reports

Three formats are written to `-Output`, because three different things read them.

- **`Report.xml`** — JUnit. Your CI already renders it; each violation is a failed test case grouped
  by rule.
- **`Report.json`** — versioned schema with `ruleId`, `severity`, `asset`, `assetClass`, `message`,
  `suggestion` and `autoFixable` per issue. For dashboards and trend tracking.
- **`Report.html`** — a readable summary to attach to a build, or hand to an art lead who does not
  read build logs.

Toggle each in **Project Settings → Plugins → Asset Sentinel**.

---

## 8. Writing a custom rule

Subclass `UAssetSentinelRule` and override two methods:

```cpp
UCLASS(DisplayName = "My Rule")
class UMyRule : public UAssetSentinelRule
{
    GENERATED_BODY()
public:
    virtual FName GetRuleId() const override { return TEXT("My.Rule"); }
    virtual void Evaluate(const FAssetSentinelContext& Ctx,
                          const FAssetData& Asset,
                          TArray<FAssetSentinelIssue>& OutIssues) const override;
};
```

Prefer `Asset.GetTagValue(...)` over loading. Loading every asset to read one property is the
difference between a two-second scan and a twenty-minute editor hang.

---

## 9. Support

Issues and questions: <https://github.com/onefreeman1337/csaf-releases/issues>

---

## 10. Engine support

**Unreal Engine 5.8, Windows.** Earlier versions are not claimed because they were not built and
verified. If you need 5.4–5.7, open an issue and it will be built and verified against them.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
