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
