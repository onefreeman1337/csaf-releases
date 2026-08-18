# Asset Sentinel — Documentation

Asset standards for Unreal Engine 5 that **repair** your project, not just report on it.

Author naming conventions, texture/mesh budgets and folder policies as editable Data Assets — no
C++ required — then enforce them in the editor, on save, and headless in CI.

- **Current version:** 1.1.0
- **Engine:** Unreal Engine 5.8 (verified — see [Verified platforms](#verified-platforms))
- **Downloads:** <https://github.com/onefreeman1337/csaf-releases/releases>

---

## Installation

1. Download `AssetSentinel_5.8.zip` from the
   [releases page](https://github.com/onefreeman1337/csaf-releases/releases).
2. Unzip it. You will get a single folder named `AssetSentinel`.
3. Copy that folder into your project's `Plugins` directory, so the layout is
   `YourProject/Plugins/AssetSentinel/AssetSentinel.uplugin`.
   Create the `Plugins` folder if your project does not have one yet.
4. Launch the project. Unreal will compile the plugin's editor modules on first load.
5. Confirm it loaded: **Edit → Plugins**, search `Asset Sentinel`, and check it is enabled.
   It is enabled by default.

> Asset Sentinel depends on Epic's own **Data Validation** plugin, which ships with the engine and
> is enabled automatically as a dependency.

---

## Getting started

### 1. Open the panel

**Window → Asset Sentinel.** The panel lists every finding, grouped by rule, with the asset it came
from and the exact remediation.

### 2. Create a rule set

A rule set is an ordinary Data Asset, so you author it in the Content Browser:

1. Right-click in the Content Browser → **Miscellaneous → Data Asset**.
2. Choose **Asset Sentinel Rule Set** as the class.
3. Name it — for example `DA_StudioStandard` — and open it.
4. Add rules to the **Rules** array. Five types ship built in; each is configured with plain
   properties, and no C++ is involved at any point.

### 3. Scan

Press **Scan** in the panel. Findings appear immediately. Anything the tool can repair is tagged
**AUTO-FIXABLE** and states what it will do — for example *"Rename to `M_brick_wall`"*.

### 4. Repair

Press **Fix Selected** in the panel, or run the commandlet with `-Fix` (below). Renames go through
`IAssetTools`, so redirectors are created and referencers are repointed — a bulk rename cannot
silently break the materials that referenced a texture.

### 5. Gate it in CI

```
UnrealEditor-Cmd.exe MyProject.uproject -run=AssetSentinel ^
  -RuleSet=/Game/Standards/DA_StudioStandard ^
  -Output=Saved/AssetSentinel ^
  -FailOn=Error -unattended -nopause
```

Add `-Fix` to repair, or `-Fix -DryRun` to print the repair plan and change nothing.

---

## Commandlet switches

| Switch | Meaning |
| --- | --- |
| `-RuleSet=<path>` | The rule set Data Asset to enforce. Repeatable. |
| `-Output=<dir>` | Where the HTML, JSON and JUnit reports are written. |
| `-FailOn=Error\|Warning` | The severity at or above which the run returns a non-zero exit code. |
| `-Fix` | Apply every auto-fixable finding, save, then **re-scan to verify**. |
| `-Fix -DryRun` | Emit the repair plan as an artifact. Changes nothing. |

**Exit codes:** `0` clean — with `-Fix`, clean *after* repairs and verified by the re-scan ·
`1` violations at or above the threshold remain · `2` configuration error.

---

## The built-in rules

| Rule | Enforces | Repairs |
| --- | --- | --- |
| **Naming Convention** | Class prefixes and suffixes, illegal characters, `_01` duplication suffixes | Renames through redirectors, referencers repointed |
| **Texture Budget** | Maximum dimension, power-of-two, square | Clamps Max Texture Size |
| **Mesh Budget** | Triangles, LOD count, collision, Nanite exemption | — reports only |
| **Folder Policy** | Which asset classes may live under which paths | Moves the asset to its agreed root |
| **Material Complexity** | Unique texture sampler count | — reports only |

A duplication suffix is deliberately **not** auto-fixed: only a human can choose what the asset
should actually be called.

---

## Reports

Every run writes three files side by side:

- **`Report.html`** — a self-contained page. Every asset carries a generated compliance mark drawn
  from its own name and verdict: the outer figure is the asset's class, and one spoke per rule shows
  that rule's result. Red with a hollow tip is an open error; green and welded means this run
  repaired it.
- **`Report.json`** — a versioned schema with a `repair` block: fixed, remaining, dry-run.
- **`Report.xml`** — valid JUnit, so Jenkins, GitLab and GitHub Actions render it as a test report
  with no parser to write.

---

## Verified platforms

**Verified on this build:** Windows (Win64), Unreal Engine **5.8.1**, packaged with
`RunUAT BuildPlugin` — 0 errors, 0 warnings, 18 compile and 4 link actions, and 28/28 automation
tests green.

The plugin's `PlatformAllowList` is `Win64, Mac, Linux`. Both modules are **editor-only** C++ with
no platform-specific code, so they are expected to build on macOS and Linux editors — but CSAF has
only Windows hardware and **has not gated those builds**, so we state them as supported-by-descriptor
rather than as verified by us. If you hit a build issue on macOS or Linux, contact support and it
will be treated as a defect.

---

## Support

Open an issue at <https://github.com/onefreeman1337/csaf-releases/issues>, or use the contact link on
the store listing you bought from.
