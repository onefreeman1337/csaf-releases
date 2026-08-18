# Plugin Cleaner — Documentation

**Unreal Engine 5.8 · Editor plugin · Win64 verified**

Find the engine plugins your project loads but nothing references, and turn them off in your
`.uproject` — safely, per project, in source control, with a backup and a one-call revert.

- Support: <https://csaf.itch.io>
- Publisher: Core Systems Asset Factory

---

## 1. Before you start: this is a commandlet, not a panel

Plugin Cleaner has **no toolbar button, no menu item and no editor window.** Installing it and
restarting the editor adds one line to your log — `Plugin Cleaner loaded.` — and nothing you can
click. Everything in this document is reached by running the commandlet in §4.

This is deliberate. The entire analysis and remediation path runs with no editor UI loaded, which is
what lets a build machine run it, and it means the code path your CI executes is the same one you
ran at your desk rather than a headless re-implementation of a panel.

If you wanted a click-to-clean button inside the editor, this is honestly not that tool.

---

## 2. Installing

1. Copy the `PluginCleaner` folder into your project's `Plugins/` directory.
2. Restart the editor. It compiles on first load.
3. Confirm the log line `LogPluginCleaner: Plugin Cleaner loaded.`

The plugin is editor-only and adds nothing to a packaged build.

**Engine version.** Built and verified on **UE 5.8** only. The descriptor also allows Mac and Linux
and the source uses no platform-specific APIs, but those builds have not been run by us — treat them
as source-compatible, not verified.

---

## 3. What the tool claims, and what it refuses to claim

Plugin Cleaner will never tell you a plugin is "unused". No static tool can know that, so it does not
pretend to. The claim it makes is narrower and true:

> No reference to this plugin was found through any channel this tool can read.

Every enabled plugin lands in one of **three** buckets, not two.

| Bucket | Meaning |
| --- | --- |
| **REFERENCED** | A reference was found. The row shows the referencing asset, file and line. You are never asked to accept a bare verdict. |
| **NO REFERENCE FOUND** | Every channel came back clean. This is the only bucket the disable action acts on, and only after you have seen the diff. |
| **UNDECIDABLE** | No honest verdict is available — the plugin exposes no readable reference channel, or your project does something static analysis cannot follow. Never acted on. |

A two-bucket report — used / unused — forces every uncertainty into one of two lies. The third bucket
is where the real engineering lives.

**Everything unreadable counts as a reason to keep a plugin, never a reason to disable it.** A false
"no reference found" on a plugin you actually need is the one outcome that would make the whole
report worthless, and you would discover it by your editor failing to open.

---

## 4. Running it

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=PluginCleaner [switches]
```

Close the editor first — the commandlet opens the project itself.

### Switches

| Switch | Effect |
| --- | --- |
| `-Out=<dir>` | Where to write `report.json` and `report.html`. **Default: `<Project>/Saved/PluginCleaner`.** |
| `-Apply` | Actually write the `.uproject`. **Omitted, the run is a dry run.** |
| `-IncludeProjectPlugins` | Also consider plugins under your own `Plugins/` folder (excluded by default). |
| `-ReadAssetGuidelines` | Load candidate assets to read Epic's `UAssetGuideline` (off by default — see §6). |
| `-FailOnFindings` | Exit 1 when any plugin lands in NO REFERENCE FOUND. For CI gates. |

### Exit codes

| Code | Meaning |
| --- | --- |
| **0** | Clean. |
| **1** | Findings present, and `-FailOnFindings` was set. |
| **2** | **The scan examined nothing.** A failure, not a pass. |
| **3** | The scan aborted; the report says why. |
| **4** | An apply was attempted and did not verify. |

Exit code 2 exists because a scan that examines zero plugins and reports "no problems" is the most
dangerous possible output. It is reported as a failure, never as success.

**Both reports are written whatever happens** — including when the scan is refused — because a
refusal is exactly the case a human needs to read, and an exit code with no report leaves a CI
operator with nothing to act on.

### A typical first run

```
# 1. Look, change nothing.
UnrealEditor-Cmd.exe MyGame.uproject -run=PluginCleaner

# 2. Read Saved/PluginCleaner/report.html. Check the REFERENCED evidence rows.

# 3. When you agree with it, write the change.
UnrealEditor-Cmd.exe MyGame.uproject -run=PluginCleaner -Apply

# 4. REOPEN THE EDITOR. Check the log for "Skipping load" and missing-module errors.
```

Step 4 is not optional. Writing the file is not the same as your project still working, and the tool
prints this instruction after every apply.

---

## 5. The six evidence channels

| # | Channel | What it catches |
| --- | --- | --- |
| 1 | **Asset registry package dependencies** | A package outside the plugin's content mount depending on one inside it. Registry tags only — the scan never loads an asset. |
| 2 | **`/Script/<Module>` dependencies** | A Blueprint using a C++ class from a **code-only** plugin. The most common real case, and channel 1 structurally cannot see it: a code-only plugin has no content mount. |
| 3 | **`*.Build.cs`** | Your own C++ modules naming a plugin module in their dependency lists. |
| 4 | **Config class and object paths** | A renderer, audio or input setting in `Config/*.ini` naming `/Script/Module.Class`, silently binding a plugin with no asset and no code reference anywhere. |
| 5 | **Plugin → plugin dependencies, to a fixpoint** | A plugin you are keeping requires this one. Resolved **transitively**: if A needs B and B needs C, disabling C breaks A. This is the failure people actually hit doing it by hand. |
| 6 | **Asset guidelines** | Epic's `UAssetGuideline`, where an asset declares it needs a plugin. **Off by default** — see §6. |

### The one that cannot be a channel

**String-constructed dynamic loads.** `LoadClass`, `LoadObject`, `StaticLoadObject`, an
`FSoftObjectPath` built from an `FString`, DataTable cells holding paths. A path assembled at runtime
from pieces that exist nowhere as a literal cannot be resolved by any static analysis — not by this
tool and not by any other.

Plugin Cleaner **detects the call sites and reports their count and locations, unattributed.** It
tells you your project has this property. It never guesses which plugin any given call might reach,
because that guess would be indistinguishable from a fabrication.

---

## 6. Honest limitations — please read these

1. **Asset guidelines are off by default.** `UAssetGuideline` is stored as asset *user data* and is
   **not indexed by the asset registry**, so reading it means loading assets rather than querying an
   index. Plugin Cleaner does not blanket-load your project to answer this — that turns a two-second
   scan into a twenty-minute editor hang. When the channel is off the report **says so**, and it
   counts as a reason to keep. Opt in with `-ReadAssetGuidelines` when you can afford the time.
2. **Project plugins are excluded by default.** A plugin under your own `Plugins/` folder was added
   by a teammate deliberately. Proposing to disable it on static evidence is a worse error than
   leaving it alone. Opt in with `-IncludeProjectPlugins`.
3. **The scan aborts rather than guessing.** If the asset registry is still gathering you get a
   refusal, not a report. A partial registry produces false "no reference found" on real references,
   and a report missing a channel is not a weaker report — it is a wrong one.
4. **Writing the file is not the same as your project still working.** After an apply, reopen the
   editor and check for `Skipping load` and missing-module errors.
5. **No in-editor UI.** See §1.

---

## 7. What the apply actually does to your `.uproject`

- **A minimal diff.** Only `Enabled` flags change. Key order, indentation, spacing and line endings
  are preserved byte for byte everywhere else. The edit is surgical text over the file's own bytes
  rather than a JSON round-trip, because your `.uproject` is a committed file your whole team
  inherits and a reformatting diff would be unreviewable.
- **A backup first.** Timestamped, beside the file, before a single byte is written. There is no path
  through this tool that modifies your project without a recoverable copy already on disk.
- **A preview.** The unified diff is printed before anything is written.
- **A read-back.** After writing, the result is re-read and rejected unless it parses as JSON and
  says exactly what the plan said.
- **A revert**, from the backup, in one call.

Most engine plugins are enabled *by default* and appear nowhere in your `.uproject` at all, so the
usual act is **adding** a disable entry rather than flipping an existing one. Plugin Cleaner handles
both, plus creating the `Plugins` array when your project has none.

---

## 8. Using it in CI

```yaml
- name: Plugin hygiene gate
  run: >
    "$UE/Engine/Binaries/Win64/UnrealEditor-Cmd.exe"
    "$PWD/MyGame.uproject"
    -run=PluginCleaner
    -Out=artifacts/plugincleaner
    -FailOnFindings
```

Publish `artifacts/plugincleaner/report.html` as a build artifact. Treat exit **2** as a red build:
it means the scan examined nothing, which is a broken gate rather than a clean project.

`-Apply` is opt-in and never the default. The act your CI performs on a committed file should be one
you asked for explicitly.

---

## 9. What Epic already ships, and where this fits

UE 5.8 ships two beta tools in this space, both off by default, and both worth turning on:

- **Plugin Reference Viewer** — a plugin-to-plugin dependency graph, with CSV export.
- **Plugin Audit** — gameplay-tag dependency violations across game feature plugins.

Neither answers this tool's question — *which of my enabled engine plugins does nothing in my project
reference* — and neither writes the fix into your `.uproject`. Epic also exposes
`IProjectManager::SetPluginEnabled`, which is the API a tool like this one builds on.

Plugin Cleaner is an **improvement on an existing space, not a unique invention,** and it is
described that way deliberately.

---

## 10. Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Exit code 2 | The scan examined nothing. Check the project path is correct and the registry mounted. This is a failure, never a pass. |
| Exit code 3 | The scan aborted. Read `report.html` — it states the reason. Most often the asset registry was incomplete. |
| Exit code 4 | The apply did not verify. Your `.uproject` is unchanged or restorable from the timestamped backup beside it. |
| `Skipping load` after an apply | A disabled plugin was needed. Restore the backup, then re-run and read the UNDECIDABLE rows. |
| Everything lands in UNDECIDABLE | Usually a refused or incomplete scan. Check the abort reason in the report. |
| The editor shows no Plugin Cleaner UI | Correct — there is none. See §1. |

---

## 11. AI disclosure

The code and the store images for this product were produced with AI assistance. It is disclosed on
every storefront this product is listed on.
