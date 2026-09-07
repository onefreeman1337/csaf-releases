# Niagara User Parameter Surgeon — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Niagara User Parameter Surgeon  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-07


---

# Niagara Parameter Surgeon

**For Unreal Engine 5.8. Editor-only. Windows (Win64).**

## 1. Why this exists

A Niagara **user parameter** is held by NAME in three unrelated places:

1. the Niagara System asset that exposes it,
2. every Blueprint that sets it, through `Set Niagara Variable (Float)` and its siblings,
3. every placed Niagara component that overrides it.

Unreal repairs only the first. Rename a user parameter in the Niagara editor and the engine fixes
the System and its emitters and touches nothing outside the asset.

What makes that expensive is **how it fails**. Setting a parameter by a name the System no longer
exposes does not error and does not warn:

> The engine creates a new parameter that nothing reads, stores your value in it, and reports
> success. The effect simply stops responding, and nothing is written to any log.

So the failure is silent at author time, silent at cook time and silent at runtime. The first
anybody usually hears of it is an artist saying an effect "stopped working" weeks later.

This tool builds the index nobody has, joins the three places on the parameter name, and tells you
every name that joins to nothing.

## 2. Install

1. Copy the `NiagaraParameterSurgeon` folder into your project's `Plugins/` folder, so that you
   have `YourProject/Plugins/NiagaraParameterSurgeon/NiagaraParameterSurgeon.uplugin`.
2. Open the project. Unreal will offer to build the plugin the first time; accept.
3. Confirm it loaded: **Edit → Plugins**, search for *Niagara Parameter Surgeon*, and check it is
   enabled. It requires the **Niagara** plugin, which is enabled in Unreal by default.

The plugin adds no menus and no toolbar buttons. It is a commandlet and a console command, so it
never changes the editor you are used to.

## 3. First run, two minutes

**Step 1 — audit from the editor.** Open the console (`` ` ``) and run:

```
Niagara.Parameters Audit
```

Read the log. The first line is the work, not the verdict:

```
Scanned 12 Niagara System(s) and 340 Blueprint(s) (340 loaded).
Found 61 parameter site(s) across 24 distinct exposed parameter(s).
Walked 8 level(s) of 8 found, 4,112 actor(s), 96 placed Niagara component(s).
```

**Step 2 — read the findings.** Every broken name is one line, and it names the asset, the graph
and the node, so it is something you can go and fix:

```
ORPHAN  "Intensity"  /Game/FX/BP_Torch  graph "EventGraph", node SetVariableFloat
        (BlueprintCallSite) - no Niagara System under this root exposes it.

ORPHAN  "Intensity"  /Game/Maps/L_Cavern  actor "FX_Brazier" (FX_Brazier_3),
        component NiagaraComponent0  (ComponentOverride) - the System this component
        uses (/Game/FX/NS_Smoke.NS_Smoke) does not expose it.
        AUTHORED VALUE LOST - someone set this on this placed effect.
```

Those two lines are found by different questions, and the second is the one that costs you money.
A Blueprint node names no System — the component is whatever was wired in at runtime — so its name
is checked against every System under the root. A placed component names exactly one System, so it
is checked against **that** System only. If it were checked against all of them, an override broken
on `NS_Smoke` would be cleared the moment any other effect in your project happened to expose a
parameter called `Intensity`, and that is the commonest stale override there is.

`AUTHORED VALUE LOST` means somebody set that value on that placed effect on purpose. The System no
longer has a parameter by that name, so nothing reads it and nothing will ever tell you.

**Step 3 — check what it could not read.** These are reported separately and are NOT counted as
broken, because "I could not read this" is a different claim from "this is wrong":

```
UNREADABLE  /Game/FX/BP_Beacon  graph "EventGraph", node SetVariableFloat
            - the parameter name is not a literal here, so it was not checked.
```

That happens when the name comes from a variable or a computed string. The tool tells you rather
than quietly skipping it.

**Step 4 — get the page a person reads.**

```
Niagara.Parameters Audit Root=/Game/FX Report=C:/temp/niagara_params.html
```

That writes one self-contained HTML file — no sibling CSS, nothing to serve — so it survives being
mailed to a colleague, committed beside a build, or dropped in a CI artefact store. It carries:

- a **wiring map** joining every parameter a System exposes to every Blueprint call site and placed
  component override that names it, with orphans drawn as connections that terminate in nothing;
- the **orphan table**, split by severity, because a stale name with no value is untidy while a
  stale name carrying an authored value is data loss;
- the names the build **could not read**, listed rather than guessed at;
- **what the scan could not see** — unrecognised call shapes, One File Per Actor levels, assets that
  failed to load. Each one makes the orphan count a lower bound, and the page says so.

Swap the extension for `.json` and you get the machine-readable report instead. **The extension
decides**, and the JSON leads with counts so anything consuming it can see how much work happened
before it reads a verdict.

**Step 5 — put it in CI.** Gate on the commandlet, not the console command (see §5):

```
UnrealEditor-Cmd.exe "C:\Path\YourProject.uproject" -run=NiagaraParameterSurgeon -Audit -Root=/Game -ExitOnFinish
```

Exit code `4` means orphans were found. Fail the build on it.

## 4. Switch table

| Switch | What it does |
| --- | --- |
| `-Help` | Print the switch table and exit. |
| `-Audit` | Build the index and report every name that joins to nothing. Never writes. |
| `-Rename` | **Not yet available in this build.** Parsed and refused, so nothing can believe it ran. |
| `-Revert` | **Not yet available in this build.** Parsed and refused. |
| `-Root=/Game/Path` | Content root to scan. Default `/Game`. |
| `-Report=Path.html` | Write the audit as a self-contained HTML page: the wiring map, the orphan table, and what the scan could not see. |
| `-Report=Path.json` | Write the machine-readable report instead. **The extension decides** — `.html`/`.htm` renders the page, anything else writes JSON. |
| `-ExitOnFinish` | Exit the process when finished. For CI. |

An unrecognised switch is **refused by name** and nothing runs. It is never ignored and never
fuzzy-matched to the nearest known switch.

⚠️ **The engine's own switches are not yours and are not refused.** `UCommandlet::Main` receives the
whole command line, so `-run=`, `-unattended`, `-nosplash` and friends arrive as arguments to this
tool. They are filtered before validation, and everything that survives is still checked strictly —
a typo like `-Roott=/Game` is still refused by name.

## 5. Exit codes — and which surface they are true on

| Code | Name | Meaning |
| --- | --- | --- |
| 0 | `Clean` | Real work was scanned and nothing needed reporting. |
| 1 | `BadUsage` | A switch was not recognised, or two contradict. |
| 2 | `NothingScanned` | **Nothing matched.** Deliberately not 0 — see below. |
| 4 | `FindingsFound` | Orphans exist. Gate your build on this. |
| 5 | `Refused` | Understood and refused, because it would not be provably safe. |
| 6 | `MissingInput` | A required input was absent or unreadable. |

> ⚠️ **This table is true of the COMMANDLET. It is not true of the console command.** On Windows a
> non-forced exit request from an in-editor console command becomes `PostQuitMessage`, and a
> headless editor does not surface that as the process exit code. The console command therefore
> **logs** its result instead of returning it. **Gate CI on the commandlet, never on the console
> command.** We say this because we measured it on one of our own tools, not because we read it
> somewhere.

**Why `NothingScanned` is not `Clean`.** If the scan matched no Niagara System, nothing was proved
— the root is almost certainly wrong. Reporting that as success would be a pass with a zero next to
it, so it gets its own code and its own message.

## 6. What it does not do

Being explicit about this, because a tool that overstates its coverage is worse than one that
does less:

- **It does not write to your project.** This build is audit-only.
- **It does not read non-literal names.** If a parameter name is computed or comes from a variable,
  it is reported as `UNREADABLE`, never guessed at.
- **It does not follow a Blueprint call site to a specific System.** A `SetVariable*` node names no
  System statically — the component is whatever was wired into the target pin at runtime — so a
  Blueprint name is checked against every System under the root, and a name exposed by *any* of them
  is not reported. That deliberately under-reports rather than inventing findings. A **placed
  component override** is different: it names exactly one System, read off the component's own asset
  pointer, so it is checked against that System alone.
- **It does not judge a System it never read.** If a placed component points at a System outside
  `-Root`, or at one that failed to load, its overrides are skipped rather than called orphans.
  "No System exposes this" would otherwise be a statement about our coverage wearing the clothes of
  a statement about your project.
- **It does not scan placed components in World Partition / One File Per Actor maps, and it tells you
  so every time.** Those maps keep their actors in separate packages, and loading the map does not
  load them — World Partition streams them in, which does not happen outside a running editor world.
  So on such a map this tool reaches almost no actors. **It counts those maps and warns that any
  placed-component result is a lower bound**, and if *every* map it opened was one of them it refuses
  to report a component verdict at all rather than returning a zero. We are explicit about this
  because the failure is invisible from the outside: a World Partition map still contains a
  `WorldSettings` actor, so a scan of it does not look empty — it looks clean. **The Blueprint
  call-site and System halves are unaffected and are complete on any project.**
- **It does not report a verdict on component overrides if the level walk looks impossible.** Every
  level contains at least a `WorldSettings` actor, so opening levels and walking zero actors cannot
  happen in a healthy scan. That exits `NothingScanned` and says so, because an empty scan and a
  clean project are indistinguishable from the outside, and only one of them is good news.
- **It does not treat a difference in capitalisation as a problem.** `Intensity` and `intensity` are
  the same parameter, because Unreal compares parameter names case-insensitively and a System cannot
  expose two that differ only by case. This tool matches the engine's own comparison, so it agrees
  with what your project will actually do at runtime.
- **It does not guess.** There is no "did you mean" and nothing here rewrites a name on a hunch. An
  automatic rewrite of a name the tool guessed is how a fixer damages the project it was bought to
  protect.
- **It reads the parameter name off a known set of pin spellings, and it tells you when it meets one
  it does not know.** Niagara exposes user parameters from several directions, and this build indexes
  all of them: the setters and getters on `UNiagaraComponent` itself, which call the pin
  `InVariableName`; the static library functions such as `SetTextureObject`, `SetNiagaraArrayFloat`
  and `OverrideSystemUserVariableStaticMesh`, which take the component as an argument and call it
  `OverrideName`; and the data-interface entry points, which use `UserParameterName`, `DIName`,
  `ParameterName`, `VariableName` or plain `Name`. If a node targets a Niagara component and carries a
  name argument in a spelling this build does not recognise — which is what a future engine version
  may introduce — it is **counted and reported as not understood**, and the run warns that the orphan
  count is a lower bound. It is never quietly skipped. A zero you cannot trust is worth less than a
  number that tells you what it missed.

  The set is not hand-remembered: an in-editor test walks the engine's own reflection database on
  every build and fails if any Blueprint-callable Niagara function that names a user parameter uses a
  spelling this build cannot read.

- **A name is not a parameter name just because it is a name.** `SetEmitterFixedBounds` and its
  siblings take an *emitter* name, which lives in a different namespace from a user parameter. Those
  nodes are excluded outright rather than matched, because treating them as parameter references
  would report a healthy project's emitter-bounds nodes as orphans. **A confident wrong finding is
  the one failure this tool refuses to risk**, and it is why the exclusion is tested from both
  directions rather than assumed.

## 7. Compatibility

Built and gated against **UE 5.8** — the only engine version it has been verified on. We do not
claim versions we have not run.

## 8. Support

<https://csaf.itch.io>

---

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
