# Config Warden 1.0.0 — Documentation (Unreal Engine 5.8)

> This page is the official user documentation for Config Warden: requirements, installation,
> the commandlet reference, the `-Apply` safety model, rule sets, CI integration, reports,
> scope limits and troubleshooting. The download below is the exact package sold on Fab and itch.


**Resolve every UE5 config setting to the layer that actually won, delete the lines that change
nothing, and prove the edit changed nothing.**

An Unreal project's settings are not a file. They are a stack of `.ini` layers that the engine
applies in a fixed order, and the value you get is whatever the last layer to mention a key said.
Over a couple of years a `DefaultEngine.ini` collects lines that lost that race years ago: an
override that a platform file already overrides again, a value restated identically in two places, a
setting someone added during a bug hunt and never removed. None of them do anything. All of them
look load-bearing, which is why nobody deletes them.

Config Warden reads the layers in the engine's own order, tells you which line won for every key,
marks the ones that can never win, and then removes them. After it writes, it re-reads every layer
from disk, re-resolves the whole hierarchy, and compares the result against the resolve it took
before the edit. If a single value moved, it puts the files back exactly as they were.

---


## Requirements

| | |
| --- | --- |
| **Engine** | Unreal Engine 5.8 |
| **Platforms** | Win64, Mac, Linux (editor-only, nothing is compiled into a packaged game) |
| **Project type** | Blueprint or C++ |
| **Dependencies** | None beyond the engine. No third-party libraries are bundled. |
| **Interface** | Commandlet only. There is no editor panel. |

Config Warden is one `Type: Editor` module. Its analysis depends on nothing above `Core`: it reads
`.ini` text and walks Unreal's own public `GConfigLayers` table, which is why it runs headless and
gives the same answer in CI as it does on your machine.

**Only Unreal Engine 5.8 is supported.** That is the only engine this build was compiled and run
against, and the `.uplugin` declares `5.8.0`, which the engine enforces rather than treats as a
label. It will not load on an older engine.

---

## Installation

### From Fab

1. Install to Unreal Engine 5.8 from the Epic Games Launcher.
2. Open your project. The plugin is enabled by default. Confirm under **Edit > Plugins**, search
   "Config Warden".
3. Confirm it loaded: the Output Log contains `LogConfigWarden: Config Warden loaded.`

### Manual

1. Copy the `ConfigWarden` folder into `YourProject/Plugins/`.
2. If your project is C++, right-click the `.uproject` and choose
   **Generate Visual Studio project files**.
3. Open the project and accept the offer to build the plugin module.

---

## First run

Config Warden never writes anything unless you pass `-Apply`. Start with a dry run:

```bash
UnrealEditor-Cmd.exe MyProject.uproject -run=ConfigWarden -unattended -nopause
```

That walks the `Engine` config type for the no-platform layer chain, writes three reports to
`MyProject/Saved/ConfigWarden/`, and prints a summary like this one, which is the real output of a
run on UE 5.8.1 on 2026-08-11 with the output path shortened:

```
LogConfigWarden: Display: Config Warden - type 'Engine', platform '(none)', dry run.
LogConfigWarden: Display: Read 3 layer file(s); examined 1179 assignment(s); resolved 1174 key(s).
LogConfigWarden: Display: Dry run: 3 line(s) across 1 file(s) would be removed. Pass -Apply to remove them.
LogConfigWarden: Display: Reports written to '...\Saved\ConfigWarden'.
```

Open `config-warden.html` and read it before you pass `-Apply` to anything.

**Read that middle line every time.** `examined 1179 assignment(s)` is the number that says the tool
did work. A run that examines zero assignments exits `2` rather than reporting a clean pass, because
a gate that inspects nothing and returns success is worse than no gate at all.

---

## The commandlet

```bash
UnrealEditor-Cmd.exe <Project>.uproject -run=ConfigWarden \
    -ConfigType=Engine \
    -Platform=Windows \
    -Rules=Config/ConfigWarden.json \
    -Out=Saved/ConfigWarden \
    -FailOn=error \
    -unattended -nopause
```

### Switches

| Switch | Default | Effect |
| --- | --- | --- |
| `-ConfigType=<type>` | `Engine` | Which config type to walk: `Engine`, `Game`, `Input`, `Editor`, and so on. One run covers one type. |
| `-Platform=<name>` | none | Expands `{PLATFORM}` in the layer templates, so `-Platform=Windows` includes `Config/Windows/WindowsEngine.ini`. Omit it to walk the no-platform chain. |
| `-Rules=<path>.json` | none | Rule set to enforce. Without it, Config Warden analyses and prunes but asserts nothing. |
| `-Out=<dir>` | `<Project>/Saved/ConfigWarden` | Where the three reports are written. The directory is created if missing. |
| `-Apply` | off | Actually delete the dead lines. Without it every run is a preview and writes no config. |
| `-PruneRedundantOnly` | off | With `-Apply`, remove only `Redundant` lines and leave `Shadowed` ones in place. See below. |
| `-FailOn=error\|warning\|none` | `error` | Severity at which rule failures make the run exit `1`. Any other value is treated as `error`. |

`-unattended -nopause` are standard engine switches and are not Config Warden's. Use them in CI so
the editor never waits on a dialog.

**One run covers one config type and one platform expansion.** To cover several, run the commandlet
several times with a different `-Out` for each, or the reports will overwrite each other. There is a
loop example under [Running in CI](#running-in-ci).

### Why `-PruneRedundantOnly` exists

`Redundant` and `Shadowed` are both provably dead, but they are dead for different reasons and teams
feel differently about them.

- A **redundant** line restates a value that is already resolved. Deleting it is uncontroversial.
- A **shadowed** line is one someone wrote deliberately and a later layer overrides. Deleting it is
  still behaviour-preserving, but some teams keep those lines as a record of intent, or as something
  to uncomment when a platform override is removed.

`-PruneRedundantOnly` is for the second kind of team. The shadowed lines stay in the report either
way.

---

## The four verdicts

Every plain `Key=Value` assignment in the chain gets exactly one of these. They are the vocabulary of
the report, the JSON and the HTML.

| Verdict | Meaning | Removed by `-Apply`? |
| --- | --- | --- |
| **Live** | This line is the one that wins for its section and key. | Never. |
| **Shadowed** | A later layer assigns the same section and key, so this line can never win. Dead. | Yes, unless `-PruneRedundantOnly`. Project files only. |
| **Redundant** | This line restates the value the earlier layers already resolve to. Removing it changes nothing. Dead. | Yes. Project files only. |
| **Unjudgeable** | The key is touched somewhere in the chain by an array operator (`+` `-` `.` `!`), so last-one-wins does not apply and no honest verdict is available. | Never. |

Every dead line in the report carries the evidence for its verdict and the file and line number of
the winner, so you can check it by hand in thirty seconds. Real rows from the run above:

```
Shadowed    BaseEngine.ini:1930   [GameNetDriver RPCDoSDetection] RPCBlockAllowlist=ServerUpdateCamera
            Overridden by layer 'Base' line 1932, which resolves 'RPCBlockAllowlist' to
            'ServerMovePacked'. This line can never win. Reported only - Config Warden never
            edits engine config.

Redundant   DefaultEngine.ini:5   [/Script/EngineSettings.GameMapsSettings]
            GameDefaultMap=/Engine/Maps/Templates/OpenWorld

Unjudgeable Base.ini:9            [SectionsToSave] Section=CurrentIniVersion
            'Section' is also written with an array operator somewhere in the chain, so
            last-one-wins does not apply and no honest verdict is available.
```

### On Unjudgeable

`+Key=`, `-Key=`, `.Key=` and `!Key=` accumulate or subtract rather than override. If a key is
touched by one of those anywhere in the chain, then a plain assignment to that same key elsewhere
cannot be reasoned about with last-one-wins, so Config Warden refuses to give it a verdict instead of
guessing. Those keys are counted and listed in every report, and they are never removed under any
switch.

This is the single most important thing to understand about the tool: the analysis is deliberately
narrow so that everything inside it is provable.

### On Epic's own config

A stock UE 5.8 install contains genuine dead lines. `BaseEngine.ini` assigns
`RPCBlockAllowlist` three times in the same section at lines 1930, 1931 and 1932, and only the last
one can ever win. Config Warden reports them. It does not touch them, and cannot be made to: engine
files are marked non-editable in the model, and only files under your project directory are ever
written.

---

## The `-Apply` safety model

This is the part worth reading twice, because it is the reason the tool is allowed to edit a
studio's `DefaultEngine.ini` at all.

**The problem with an automatic config cleaner** is that the failure mode is silent and delayed. If
it removes one line too many, nothing errors. The project builds, the editor opens, and three weeks
later a packaged build has the wrong shadow quality. No stack trace leads back to the cleanup.

**So Config Warden does not assert that its edit was safe. It measures it.** In order:

1. **Resolve.** Walk the layer chain and record the effective value of every section and key. On the
   run above that was 1,174 keys.
2. **Plan.** Group the dead lines into a per-file removal list. Engine files and `Unjudgeable` keys
   are not in it.
3. **Write.** Remove those lines, and only those lines. Every surviving byte is preserved exactly,
   including the original line endings, so a three-line change stays a three-line diff in source
   control instead of becoming a whole-file rewrite.
4. **Re-read from disk.** Not from memory, and not from the plan. The files are read again as if by
   a fresh process.
5. **Re-resolve and compare.** Every section and key in either resolve is compared against the other.
6. **Roll back on any divergence.** If one value differs, every touched file is restored to its
   original bytes and the run exits `3`.

A successful apply says so, with the number it compared:

```
LogConfigWarden: Display: Pruned 3 line(s) and verified 1174 resolved value(s) unchanged.
```

A rollback names the exact key that moved:

```
LogConfigWarden: Error: Prune ROLLED BACK - the edit changed a resolved value.
  '/Script/Engine.RendererSettings / r.DefaultFeature.AutoExposure' resolved to 'False'
  before the prune and resolves to nothing after it.
```

Both of those lines are real output from the verification runs of this release, not examples.

**What a rollback leaves behind:** nothing. Every file that was touched is byte-identical to how it
started. The reports are still written, so you can see what was attempted and why it was refused.
The run exits `3`, which is a distinct code precisely so that "the prune did not verify" never gets
mistaken in a build log for "your config has rule failures".

**Still commit first.** The verification is thorough and it is not a substitute for source control.
Run `-Apply` on a clean working tree so the diff is reviewable, exactly as you would for any
automated code change.

---

## Rule sets

Analysis tells you what your config is. A rule set asserts what it should be, and fails the build
when it is not.

Rules are **data**, not code. A technical artist can add one without a C++ build, and the file lives
in source control next to the settings it governs, so it branches and diffs with the project.

Pass one with `-Rules=<path>.json`. A copy of the example below ships at
`ConfigWarden/Resources/ExampleRules.json`.

### Format

```json
{
  "rules": [
    {
      "id": "renderer-shadow-quality-pinned",
      "configType": "Engine",
      "section": "/Script/Engine.RendererSettings",
      "key": "r.Shadow.Quality",
      "kind": "expected",
      "expectedValue": "3",
      "severity": "error",
      "rationale": "Shadow quality is an art-direction decision, not a local preference. A machine-local override reaching the build changes every screenshot."
    },
    {
      "id": "no-missing-default-map",
      "configType": "Engine",
      "section": "/Script/EngineSettings.GameMapsSettings",
      "key": "GameDefaultMap",
      "kind": "required",
      "severity": "error",
      "rationale": "A build with no default map boots to a black screen, and the failure appears only after packaging."
    },
    {
      "id": "no-debug-hitch-detector-in-ci",
      "configType": "Engine",
      "section": "/Script/Engine.Engine",
      "key": "bCheckForMultiplePawnsSpawnedInAFrame",
      "kind": "forbidden",
      "severity": "warning",
      "rationale": "A debug aid someone enabled locally. It has no business reaching a build machine."
    }
  ]
}
```

### Fields

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Stable identifier. Becomes the JUnit test name, so a build server can track one rule run over run. |
| `section` | yes | The `.ini` section, without brackets. |
| `key` | yes | The setting name. |
| `kind` | yes | `required`, `forbidden` or `expected`. |
| `expectedValue` | for `expected` | The value the key must resolve to. A rule of kind `expected` with no `expectedValue` is a parse error. |
| `configType` | no | Restricts the rule to one config type. Omit it and the rule is evaluated against whatever type the run is scanning. |
| `severity` | no | `info`, `warning` or `error`. Defaults to `error`. |
| `rationale` | no | Appended to the message on a failing rule, so the report says why the rule exists. |

Keys Config Warden does not recognise are ignored, which is how the shipped example carries a
`$comment` field at the top.

### What each kind asserts

| Kind | Passes when |
| --- | --- |
| `required` | The key resolves to a non-empty value. |
| `forbidden` | The key resolves to nothing at all in this config type. |
| `expected` | The key resolves to exactly `expectedValue`. |

A failing rule reports the value it actually found, the layer that set it, and the file and line
number, so the message is enough to fix it without opening the report:

```
[/Script/Engine.RendererSettings] r.Shadow.Quality should be '3' but resolves to '1',
set by layer 'ProjectDefault' at .../Config/DefaultEngine.ini line 8.
```

### A malformed rule set is refused, not ignored

If the JSON does not parse, has no `rules` array, or contains a rule missing an `id`, `section`,
`key` or `kind`, the run stops and exits `1` with the index of the offending rule. It does not skip
the bad rule and carry on, because a rule set that quietly enforces four of its five rules is a gate
that lies.

---

## Running in CI

### Exit codes

| Code | Meaning | What your build step should do |
| --- | --- | --- |
| `0` | Clean, or only failures below `-FailOn`. | Continue. |
| `1` | Rule failures at or above `-FailOn`, or a rule set that could not be read or parsed. | Fail the build. |
| `2` | The scan examined zero assignments. | **Alert someone.** The gate itself is broken, not the config. |
| `3` | `-Apply` was requested and the prune did not verify. Every file was rolled back. | Fail the build, and read the report. Nothing was changed. |

The `1` / `2` split is the important one: "the config is wrong" and "the check never ran" are
different problems, and only one of them should page a human. `3` is separated from both for the
same reason.

`-FailOn=none` suppresses rule failures only. Exit `2` and exit `3` still fire, because neither of
them is a rule failure.

### GitHub Actions

```yaml
- name: Config hygiene
  shell: bash
  run: |
    "$UE_ROOT/Engine/Binaries/Win64/UnrealEditor-Cmd.exe" \
      "${{ github.workspace }}/MyProject.uproject" \
      -run=ConfigWarden \
      -ConfigType=Engine \
      -Rules="${{ github.workspace }}/Config/ConfigWarden.json" \
      -Out="${{ github.workspace }}/Saved/ConfigWarden/Engine" \
      -FailOn=error -unattended -nopause

- name: Publish results
  if: always()
  uses: mikepenz/action-junit-report@v4
  with:
    report_paths: 'Saved/ConfigWarden/**/config-warden.xml'
```

### Several config types in one step

One run covers one config type, so loop, and give each its own output directory:

```bash
set -e
for TYPE in Engine Game Input; do
  "$UE_ROOT/Engine/Binaries/Win64/UnrealEditor-Cmd.exe" MyProject.uproject \
    -run=ConfigWarden -ConfigType="$TYPE" \
    -Rules=Config/ConfigWarden.json \
    -Out="Saved/ConfigWarden/$TYPE" \
    -FailOn=error -unattended -nopause
done
```

### A suggested pipeline shape

| Stage | Invocation | Why |
| --- | --- | --- |
| Pull request | No `-Apply`, `-FailOn=error` | Fast, read-only, and it blocks a bad setting before it merges. |
| Nightly | No `-Apply`, `-FailOn=warning` | Surfaces the softer rules without blocking anyone at 2pm. |
| Maintenance branch | `-Apply`, reviewed as a normal pull request | The cleanup lands as a diff a human approved, not as an invisible edit. |

Do not put `-Apply` on a per-commit job. The verification makes the edit safe; it does not make an
unreviewed commit to `DefaultEngine.ini` a good idea.

---

## Reports

Three files, written side by side into `-Out`, for three different readers.

| File | Format | Consumer |
| --- | --- | --- |
| `config-warden.json` | JSON | Your own dashboards and trend tracking. Contains every layer, every dead line with its evidence, every rule finding, the skipped-layer list, and the prune result. |
| `config-warden.xml` | JUnit | Jenkins, TeamCity, GitLab CI, GitHub Actions. One `<testcase>` per rule, named with the rule `id` and classed by section. |
| `config-warden.html` | Self-contained HTML | Leads and reviewers. No external CSS, JS or fonts, so it survives being emailed or dropped into an artifact store. |

Reports are written on every run that reached the analysis, including dry runs and rolled-back
applies. An exit of `2`, and an exit of `1` caused by an unreadable rule set, both return before any
report is written.

Two notes on the JUnit file. Every non-passing rule becomes a `<failure>` regardless of severity,
with the severity as the failure `type`, so a `warning` rule shows up as a red test in your build
server even on a run that correctly exits `0` under `-FailOn=error`. And a run with no `-Rules` file
produces a valid JUnit document with zero tests, which some report publishers treat as an error;
skip the publish step when you are not enforcing rules.

---

## Scope limits

These are the boundaries of what the tool claims. They are here rather than in a footnote because
knowing them is what makes the rest of the output trustworthy.

**Only plain `Key=Value` assignments are judged.** Any key touched anywhere in the layer chain by an
array operator (`+` `-` `.` `!`) is reported `Unjudgeable` and is never removed, under any switch.
Override semantics do not apply to those keys, so no honest verdict exists for them.

**Engine config is never edited.** Dead lines in `BaseEngine.ini` and the other engine layers are
reported for information only. Only files under your project directory are ever modified. A tool
that silently edited a shared engine install would break every other project on the machine.

**Three layer categories are not modelled**, and are listed by name in every report rather than
silently dropped:

| Skipped layer | Why |
| --- | --- |
| `UserSettingsDir`, `UserDir`, `AppSettingsDir` | Machine-local. They differ per developer, so including them would make the analysis non-reproducible and would let one person's local file justify deleting a line from the shared project. |
| `CustomConfig`, `CustomConfigPlatform` | Require a custom config name that only the invoking project knows. |
| Platform layers, when `-Platform` is not given | `{PLATFORM}` cannot be expanded without being told which platform. Pass `-Platform=<name>` to include them. |

Every one of these appears in the `skippedLayers` array of the JSON report and in a named list in the
HTML, on every run. If a layer was not read, the report says so.

**Verified on Unreal Engine 5.8 only.** That is the only engine this build was compiled and run
against, and no other version is claimed.

**There is no editor panel.** Config Warden is a commandlet. That is a deliberate design decision
(everything it does has to be reachable headlessly, which is what makes CI use possible), but if you
wanted a UI, this is not that product.

---

## What Unreal already ships

Config Warden is an improvement on something that exists, not an invention, and you should know
exactly where the line is before you buy.

**Unreal already has a config hierarchy viewer.** `FPropertyEditor::EditConfigHierarchy` opens a
first-party Config Editor tab that shows the per-layer values for **one property** you right-click in
the Details panel. If your question is "where is this one setting coming from", the engine answers it
already and you do not need this plugin.

What the engine does not ship, and what this is:

| | Engine | Config Warden |
| --- | --- | --- |
| Per-property layer hierarchy | Yes | Yes |
| Project-wide audit of every key at once | No | Yes |
| Dead-line detection with evidence | No | Yes |
| Removal of dead lines | No | Yes |
| Verification that a removal changed no value | No | Yes |
| Rules as data, with required / forbidden / expected | No | Yes |
| Headless commandlet with CI exit codes | No | Yes |
| JSON, JUnit and HTML reports | No | Yes |

---

## Troubleshooting

**The commandlet exits `2`**
The scan examined zero assignments. Either `-ConfigType=` names a type with no files on disk (check
the spelling; it is `Engine`, not `DefaultEngine`), or the commandlet is running against a project
directory it cannot resolve. The `layers` array in the JSON report lists every file that was read;
if it is empty, that is the problem.

**The commandlet exits `3`**
The prune was refused and rolled back. Nothing on disk changed. Read the `prune.note` field in the
JSON report or the failure banner in the HTML: it names the exact section, key, and the two values
that differed. This is the tool working correctly.

**Nothing is reported as dead, but I can see duplicated settings**
Check whether the key appears anywhere with a `+`, `-`, `.` or `!` prefix. One array operator
anywhere in the chain makes every plain assignment to that key `Unjudgeable`. The `unjudgeable` count
in the report tells you how many keys are in that state.

**A rule matches nothing**
Rules are filtered by `configType` when it is present. A rule with `"configType": "Game"` is skipped
entirely on an `-ConfigType=Engine` run and produces no finding at all, passing or failing. Omit the
field to make the rule apply to whatever type is being scanned.

**A platform override is not being considered**
Pass `-Platform=<name>`. Without it the platform layers are skipped, and the skipped-layer list in the
report says so by name.

**`Skipping load of 'ConfigWarden'` in the log**
The plugin declares `EngineVersion 5.8.0` and the engine enforces it. Config Warden will not load on
another engine version.

**The reports from my second run overwrote the first**
Each run writes `config-warden.json`, `.xml` and `.html` into `-Out`. Give each config type its own
`-Out` directory.

---

## Support

`https://csaf.itch.io`

Include your engine version, the plugin version (`1.0.0`), the exact commandlet line you ran, your
rule set if you used one, and `config-warden.json` from the run. Filtering the Output Log to
`LogConfigWarden` usually shows the cause immediately.

---

## AI disclosure

The source code in this plugin was written with AI assistance, and the store images for it were
AI-generated. This is disclosed on every storefront it is sold through. The measurements quoted in
this document are from real runs of this build on Unreal Engine 5.8, not estimates.

---

*Config Warden 1.0.0 · Unreal Engine 5.8 · Editor-only · CSAF*
