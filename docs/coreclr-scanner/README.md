# CoreCLR Migration Scanner — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** CoreCLR Migration Scanner  
**Engine:** Unity 6  
**Docs published:** 2026-08-21


---

# CoreCLR Migration Scanner

**Find every Mono-dependent construct before Unity 6.8 removes Mono — then fix what is mechanical,
and ratchet CI so the debt can only shrink.**

Unity is replacing Mono with CoreCLR. Unity 6.8 drops Mono entirely, and Unity describes it as the
most significant change to its C# layer in over a decade. Every commercial project has to audit
P/Invoke, serialization, assembly loading, reflection and threading before that lands.

This tool does that audit, ranks what it finds by how badly it breaks, tells you *why* each one
breaks and what to do about it — and then **acts on it**: a preview-first fix pass applies the
remediations that are mechanical, the burndown classifies every scan against your baseline as
fixed / open / new, and the CI ratchet fails a build only on **new** findings, so you can adopt the
gate on day one without paying down the legacy debt first.

---

## What this covers, and what it deliberately does not

**Read this section first. It is the honest scope, and it is why the tool is worth its price.**

Unity ships **Project Auditor**, free and bundled from Unity 6.4 onward. It is good, and you should
run it. It covers **domain-reload static state** — a static field not reset in an initialize method,
a static event left subscribed — and, since version 2.0.0, **obsolete API usage**.

**This scanner does not duplicate either of those.** Reimplementing them would pad a feature list
and add nothing you cannot already get for free. What Project Auditor does **not** analyse, at any
version, is the rest of the break surface:

| Category | What is checked | Covered by Project Auditor? |
| --- | --- | --- |
| **Serialization** | `BinaryFormatter`, `SoapFormatter`, `IFormatter`, `ISerializable` | No |
| **Threading** | `Thread.Abort`, `Suspend`/`Resume`, `[ThreadStatic]`, explicit `GC.Collect` | No |
| **Assembly loading** | `AppDomain.CreateDomain`/`Unload`, `DomainUnload`, `Assembly.LoadFrom`, `AssemblyResolve` | No |
| **Reflection** | `Assembly.Location`, `Reflection.Emit`, string type resolution, non-public reflection | No |
| **P/Invoke** | `CharSet`, `LPStr` marshalling, delegate lifetime, calling conventions | No |
| Domain-reload static state | — | **Yes — use Project Auditor** |
| Obsolete API | — | **Yes — use Project Auditor 2.0+** |

> **Run both tools.** They do not overlap, and neither is a substitute for the other.

---

## The part nothing else does: compiled assemblies

A text search over your own C# finds what *you* wrote. Your real migration exposure is usually
somewhere else — in the plugins you bought, shipped to you as DLLs, whose vendors may no longer be
active. There is no source to search, so a source-only audit reports a clean project and you find
out at runtime.

This scanner reflects over every compiled assembly in your project, including precompiled
third-party DLLs, and detects platform-invoke methods using the CLR's own
`MethodAttributes.PinvokeImpl` metadata flag. That is a certainty, not a pattern match — it is true
whether or not the source still exists anywhere on earth.

Findings are tagged `[compiled assembly]` so you can always tell which half found what.

---

## What this cannot see

**A migration scanner is answering one question — "am I done?" — so where it is blind matters as
much as what it finds.** These limits are real, they are deliberate, and each one is a choice made
against a specific alternative that would have been worse.

**1. A hazard called through a variable the scanner cannot type.** Source rules are line-oriented
regular expressions, and a line of text carries no type information. `Thread.Abort()` and
`workerThread.Abort()` are reported; a `Thread` held in a variable named `worker` is not.

*Why not simply match any `.Abort()`?* Because in Unity the most common `.Abort()` by far is
`UnityWebRequest.Abort` / `WebRequest.Abort` — `uwr.Abort()`, `request.Abort()`, `www.Abort()` —
which is perfectly fine on CoreCLR. Matching every receiver would raise a **Breaking**-severity
false alarm on ordinary networking code in most projects. A Breaking finding that is usually wrong
teaches you to dismiss the whole report, and a report you dismiss is worth less than no report. The
same reasoning applies to any rule keyed on a receiver name, such as `Assembly.Location`.

**2. Method bodies inside compiled assemblies.** The assembly half reads .NET metadata, which
exposes types, methods and P/Invoke flags with certainty — but not the *instructions inside* a
method. So a third-party DLL that *declares* a P/Invoke is reported, while one that merely *calls*
`Thread.Abort` internally is not.

**3. Anything reached only by string or reflection at runtime.** `Type.GetType(someConfigValue)` is
flagged as a reflection hazard, but what it resolves to is unknowable until it runs.

**4. Domain-reload static state and obsolete API.** Ceded to Project Auditor on purpose — see the
table above. Run both.

**What to do about it.** Treat the report as a prioritised worklist, not a certificate. The rules
are open JSON (see *The rule corpus*), so if your codebase has a naming convention the shipped
patterns miss — a thread consistently called `worker` — add a project-specific pattern and it will
be picked up on the next scan.

---

## Install

1. Import the package. Everything lives under `Assets/CSAF/CoreCLRScanner/`.
2. Open **Window → CSAF → CoreCLR Migration Scanner**.
3. Press **Scan Project**.

No configuration is required. Editor code is confined to an Editor-platform assembly definition, so
nothing ships in your build and nothing touches your runtime assemblies.

**Try it immediately:** **Tools → CSAF → Scan Bundled Sample** scans the deliberately non-compliant
sample files in `Demo/SampleLegacyCode/`, so you see real findings even in a clean project. The
demo scene at `Demo/CoreCLRScannerDemo.unity` shows the same three steps on screen.

**Then watch it act:** **Tools → CSAF → Fix Bundled Sample (Sandbox)** copies those same samples to
`Temp/`, scans them, and opens the fix preview against the copies — press Apply and re-scan to watch
the findings fall. The sandbox means the demo is repeatable forever and never touches your project.

---

## Reading the report

Three counts sit at the top, and they are the summary a producer actually needs:

- **Breaking** — throws, is removed, or does not compile once Mono is gone. Schedulable work with a
  hard deadline.
- **Behavioural** — still runs, returns a different answer. More expensive to find later, because it
  arrives as a bug report rather than a stack trace.
- **Info** — worth knowing during the port; nothing is required.

Every finding expands to show **why CoreCLR breaks it** and **how to fix it**. That reasoning is the
part you cannot get from a grep, and it is what the rule corpus is for.

### Baselines and burndown

Press **Set As Baseline** to save the current report. Every subsequent scan then shows the change
against it — `+3 since baseline`, `-11 since baseline`. That delta is the burndown you report
upward, and it is the only honest way to show a migration is progressing.

> **A cancelled scan is marked as cancelled, everywhere.** A partial scan finds fewer problems than
> a complete one, so without that flag an interrupted run would look like progress that consists
> entirely of work not done. Treat a cancelled report as a lower bound; the tool refuses to pretend
> otherwise.

---

## The fix pass

Press **Preview Fixes** after a scan. The engine builds a plan from the findings whose remediation
is *mechanical* — the edit is unambiguous, behaviour-preserving, and checkable — and shows every
edit as a before/after diff before a single byte is written:

| Rule | The mechanical fix | Why it is safe |
| --- | --- | --- |
| `CSAF5003` | `UnmanagedType.LPStr` → `UnmanagedType.LPUTF8Str` | Mono already marshals LPStr as UTF-8; CoreCLR would switch it to the system code page. The rewrite pins the behaviour your code has today. |
| `CSAF5004` | Inserts `[UnmanagedFunctionPointer(CallingConvention.Cdecl)]` above an unannotated native callback delegate | Cdecl is the near-universal convention for Unity native plugins; the note on the edit tells you to verify against the native header. |
| `CSAF5001` | Adds an explicit `CharSet = CharSet.Ansi` to a `DllImport` — **only when no string crosses that boundary** | With no string in the signature, CharSet cannot change behaviour; making it explicit records the decision and retires the finding. |

**Everything else is deliberately not auto-fixed.** When a string crosses a native boundary, when a
delegate's real calling convention is stdcall, when a `Thread.Abort` needs redesigning into
cooperative cancellation — that is a decision, and the preview lists each one with the rule's own
remedy text instead of guessing. An auto-fixer that guesses converts a visible hazard into an
invisible one, which is worse than no fixer at all.

**Safety, mechanically enforced:** every planned edit records the exact line it expects to change,
and Apply refuses any edit whose file changed since the preview was built — refused edits are
counted and named, never silently skipped. Line endings, trailing newline and BOM are preserved, so
an applied fix diffs as exactly the changed lines. Review the diff in the window; review the commit
in your VCS.

---

## CI integration

```bash
Unity.exe -batchmode -quit -nographics \
  -projectPath  <your project> \
  -executeMethod CSAF.CoreCLRScanner.BatchMode.Run \
  -csafOutDir    CoreCLRReports \
  -csafBaseline  CoreCLRReports/coreclr-baseline.json \
  -csafFailOnNew \
  -csafMaxBreaking 0
```

| Argument | Meaning |
| --- | --- |
| `-csafOutDir` | Where to write `coreclr-report.json` and `coreclr-report.md`. Relative paths resolve against the project root. |
| `-csafBaseline` | An earlier JSON report to classify against. Writes `coreclr-burndown.json` with every finding sorted into fixed / open / new. |
| `-csafFailOnNew` | **The ratchet.** Fail the build when any finding is not in the baseline — and only then. Legacy debt passes; new debt cannot enter. Requires `-csafBaseline`, and refuses to run without it rather than pretending a ratchet is in force. |
| `-csafMaxBreaking` | Fail the build when total breaking findings exceed this number. The endgame gate, once the debt is paid: `0`. |
| `-csafFixPlan` | Write what the fix pass *would* do as reviewable JSON. Batch mode never edits source — a fix belongs in a commit a human made on purpose. |

Exit codes: `0` pass · `1` ratchet or budget failed · `2` scan did not complete (or ratchet had no
baseline) · `3` scan threw.

**Adopt in this order:** scan once, commit the report as your baseline, turn on `-csafFailOnNew`
the same day. The team never has to stop and fix four hundred findings first — the ratchet holds
the line while the burndown walks it down, and `-csafMaxBreaking 0` is the finish line, not the
entry fee.

Commit the JSON report. The delta between two of them *is* the burndown.

**The CI gate refuses to report a pass on an incomplete scan**, and the console summary warns loudly
if zero files and zero assemblies were scanned — because a clean result from a scan that never ran
looks exactly like a clean project, and a CI log is precisely where nobody notices the difference.

---

## The rule corpus

Every rule lives in `Editor/Rules/coreclr-rules.json`. Rules are **data, not code**: adding one,
correcting a pattern, or lowering a severity is a content edit that cannot break the scanner.

```json
{
  "id": "CSAF1001",
  "category": "Serialization",
  "severity": "Breaking",
  "title": "BinaryFormatter is removed",
  "why": "...",
  "remedy": "...",
  "patterns": ["\\bBinaryFormatter\\b"]
}
```

- **Add your own house rules** directly to the file, or point the scanner at your own corpus.
- A pattern that does not compile disables **that one rule** and logs why. It never kills the scan
  and never silently reduces your finding count.
- `corpusVersion` is stamped into every report, so a result from six months ago stays interpretable.

Severity is one of `Breaking`, `Behavioural`, `Info`. Category is free text and drives the filter.

---

## Requirements

- Unity 2022.3 or newer. Developed and gate-verified against **Unity 6000.5.7f1**.
- No third-party dependencies. No `Resources/` folder. Nothing added to your runtime build.

---

## Support

Questions, false positives, and rules you think are missing are all welcome — a false positive is a
corpus bug and gets fixed in the corpus, which means you can also fix it yourself immediately.

Sources for the migration facts encoded in the rules:

- Unity, *Path to CoreCLR, 2026: Upgrade Guide* — <https://discussions.unity.com/t/path-to-coreclr-2026-upgrade-guide/1714279>
- Microsoft, *BinaryFormatter security guide* — <https://learn.microsoft.com/dotnet/standard/serialization/binaryformatter-security-guide>
- Microsoft, *Thread.Abort is not supported* — <https://learn.microsoft.com/dotnet/core/compatibility/core-libraries/5.0/thread-abort-not-supported>
- Microsoft, *AssemblyLoadContext* — <https://learn.microsoft.com/dotnet/core/dependency-loading/understanding-assemblyloadcontext>


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
