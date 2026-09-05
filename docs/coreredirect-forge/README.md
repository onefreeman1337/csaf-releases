# CoreRedirect Forge — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** CoreRedirect Forge  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-05


---

# CoreRedirect Forge

**For Unreal Engine 5.8. Windows. Editor-only.**

---

## 1. The problem: the rename that succeeds, and takes your data with it

You rename a `UPROPERTY`. `Health` becomes `Vitality`. It compiles. The editor opens. Nothing
errors.

Every asset that stored a value for `Health` now has a `Vitality` set to whatever the constructor
puts there. The old value is not recovered later and it is not recoverable at all, because the only
thing that ever connected the two names was the source line you just changed.

Epic states the consequence in the documentation for this exact feature:

> *"simply renaming the code member and recompiling your project will cause considerable data loss,
> because Unreal Engine will no longer recognize existing Assets"*

The remedy Epic names is a `[CoreRedirects]` block in `DefaultEngine.ini`, written by hand:

```ini
[CoreRedirects]
+PropertyRedirects=(OldName="/Script/MyGame.AMyActor.Health",NewName="/Script/MyGame.AMyActor.Vitality")
```

That is the whole mechanism, and it works. The difficulty is not the syntax. It is that **writing
the block requires knowing what the names used to be, and by the time you need it, they are gone.**
The compiler has the new ones. Your assets have the old ones. Nothing in the editor holds both.

Epic's own engineers hit this constantly and solve it the same way you would. **133 plugins shipped
with Unreal Engine 5.8 carry a hand-maintained `[CoreRedirects]` section** — Niagara, Control Rig,
GameplayAbilities, MetaSound, PCG, Enhanced Input, Paper2D, Interchange, Datasmith and 124 more.
(Counted on a stock 5.8 install: `Engine/Plugins/**/Config/*.ini` containing a `[CoreRedirects]`
header.) Every one of those entries was typed by somebody who still remembered what the name used
to be. Nothing in the editor generates one.

### The mistake almost everyone makes writing one by hand

A `[CoreRedirects]` entry names the **reflected** type, and that is not the name in your header.
UHT strips the leading `A` or `U` when it registers a class, exactly as `AActor` itself is
registered `/Script/Engine.Actor`:

| your C++ | what the redirect must say |
| --- | --- |
| `class AMyActor` | `/Script/MyGame.MyActor` |
| `struct FMyPayload` | `/Script/MyGame.MyPayload` |
| `enum class EMyTile` | `/Script/MyGame.EMyTile` — the `E` is **kept** |

Type `AMyActor` and the engine drops the entry with a single line at startup. The file looks
right, parses, and does nothing.

CoreRedirect Forge cannot make that mistake, because it never parses a header — it reads
`GetPathName()` off the live `UClass`, which is by definition the name the engine matches on.

### Why "just be careful" does not scale

A rename sweep across a module is not one redirect. It is a class rename, plus the properties
inside it, plus the enum whose values got tidied at the same time, plus the two structs that moved
to a shared module. Each needs a differently-shaped entry under a differently-named key, and a
malformed one **does not fail loudly** — `ReadRedirectsFromIni` logs a line at startup and drops
it. You get a file that looks right, parses, and does nothing.

---

## 2. The one thing to do before you rename anything

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=CoreRedirectForge ^
    -Snapshot="<YourProject>/Saved/CRF/before.json" -Packages=/Script/MyGame -Apply ^
    -unattended -nosplash
```

That captures your modules' reflection surface while it is still correct: every class, struct, enum,
property, function and enumerator, with its parent class, its C++ type and its declaration order.

**Commit that file.** It is the only record of the names you are about to destroy. Everything below
depends on it existing, and nothing — not this tool, not Epic, not you a fortnight later — can
reconstruct it after the fact.

Then rename, move, delete and recompile however you like.

---

## 3. After the refactor: capture again, and diff

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=CoreRedirectForge ^
    -Snapshot="<YourProject>/Saved/CRF/after.json" -Packages=/Script/MyGame -Apply ^
    -unattended -nosplash

UnrealEditor-Cmd.exe <YourProject>.uproject -run=CoreRedirectForge ^
    -Before="<YourProject>/Saved/CRF/before.json" ^
    -After="<YourProject>/Saved/CRF/after.json" ^
    -Out="<YourProject>/Saved/CRF/redirects.ini" ^
    -Report="<YourProject>/Saved/CRF/report.html" ^
    -Apply -Verify -unattended -nosplash
```

You get an ini fragment to paste into `DefaultEngine.ini`, and an HTML sheet explaining every line
of it — including the ones it refused to write.

> **Use the same `-Packages` for both captures.** Two snapshots taken over different package sets
> produce a diff in which every type the second run did not look at appears deleted. The tool
> refuses that comparison rather than emitting from it.

---

## 4. How it decides, and where it stops

Types are matched **by path first**. Anything present in both snapshots is identity-matched and
never reaches the fuzzy stage, so a project where nothing was renamed produces no findings at all
whatever the thresholds say.

What is left over is matched **by structure, within the same kind** — a class is never matched to a
struct. The score blends shared member names, shared member *types*, and the parent class, because a
rename usually preserves all three and a coincidence rarely preserves more than one. Members are
then matched only *inside* a matched type pair, by name first and then by type plus declaration
slot. Declaration order is a tie-breaker and never primary evidence: inserting one field at the top
of a struct shifts every index below it, and an order-first matcher would rename the entire tail.

**A winner must clear `-MinConfidence` AND beat the runner-up by `-Margin`.** Failing either is
reported as *ambiguous*, with every rival named and scored, rather than resolved by best guess.

That refusal is the feature, not a limitation:

> A wrong redirect does not error. It loads the wrong data into every affected asset, and the load
> **succeeds**. Nobody finds out until the values are committed.

So two `float` properties renamed in the same commit are reported for you to settle, because
nothing in the structure distinguishes them and any tool that answers is guessing with your project
as the stake. A member that vanished with nothing plausible in its place is reported as **removed**
with no invented target — the engine does support a `Removed=true` entry, but that is a statement
about your intent and this tool will not make it for you.

---

## 5. `-Verify`: turning the claim into a measurement

`-Verify` does three things, in this order:

1. **Registers the generated block in the running editor process.** Not in your ini — nothing is
   written to your project by `-Verify`, and the registration is removed again when the run ends.
2. **Reads it back** through the same queries the loader uses, and refuses to continue unless every
   generated entry is confirmed live. A partial verification reported as a verification is worse
   than none, because it is the number your build agent would trust.
3. **Loads every package that depends on the affected module** — found through the asset registry's
   dependency graph, so nothing is loaded to decide what to load — and counts the packages that
   still fail to resolve, with the first real error for each.

### What it proves, and what it does not

It proves the generated redirects **resolve the names** in the assets you have on disk. That is the
question you need answered before pasting a block into a shared `DefaultEngine.ini`.

It does not prove the redirects are semantically what you meant. If you accepted a pairing the
report flagged as ambiguous, the load will succeed and the data will be wrong — which is the whole
reason the ambiguous ones are refused rather than guessed.

**Packages already loaded in the editor are reported separately and counted as neither pass nor
fail.** `LoadPackage` returns a resident package without re-reading a byte, so nothing can be
concluded about it. Run the commandlet rather than the console command for a measurement that
starts with nothing loaded.

---

## 6. Every switch

| switch | what it does |
| --- | --- |
| `-Snapshot=<file>` | Capture the live reflection surface to `<file>`. |
| `-Before=<file>` | With `-After`: compare two manifests and generate redirects. |
| `-After=<file>` | The manifest captured after the refactor. |
| `-Out=<file>` | Where to write the generated ini fragment. Diff mode only. **No default** — omit it and the block is logged rather than written. |
| `-Report=<file>` | Where to write the HTML sheet. No default; omitted means none. |
| `-Packages=<a,b>` | Package prefixes to capture. Snapshot mode only. Defaults to `/Script/<YourProject>`. |
| `-MinConfidence=<n>` | 0-100, default **70**. A candidate below this never wins. |
| `-Margin=<n>` | 0-100, default **15**. The winner must beat the runner-up by this much or the change is reported as ambiguous. |
| `-Apply` | Actually write. **Without it nothing is written and every mode is a preview**, including `-Snapshot`. |
| `-Verify` | Section 5. |
| `-IgnoreUnknownSwitches` | Downgrade an unrecognised switch from an error to a log line. |
| `-ExitOnFinish` | Quit the editor when the run ends. Required for the **console** path in CI. |
| `-Help` / `-?` | Print the switch table and stop. |

Unrecognised switches are **refused, not ignored** — a typo'd `-Marjin=40` must not silently run at
the default. Engine switches (`-run`, `-unattended`, `-nosplash`, `-NullRHI` and the rest) are
recognised as the engine's and skipped; if yours is not on that list, `-IgnoreUnknownSwitches` is
the escape hatch and the error message says so.

> **Widening `-Packages` to `/Script/Engine` is a mistake worth naming.** It makes an *engine
> upgrade* read as thousands of renames in your own code.

---

## 7. Exit codes, and the one thing to get right in CI

| code | name | meaning |
| --- | --- | --- |
| 0 | Ok | Did what was asked; any verification passed. |
| 1 | BadArguments | Nothing was read or written. |
| 2 | NothingFound | No types matched, or the two manifests are identical. |
| 3 | UnresolvedChanges | Real changes this tool refuses to guess at — read the report. |
| 4 | VerificationFailed | Redirects were emitted and assets still do not resolve, **or** `-Verify` was asked for and could not be run. |
| 5 | IoError | A file could not be read or written. |

> ⛔ **Gate CI on the commandlet (`-run=CoreRedirectForge`), not on the console command.**
>
> The editor console path (`-ExecCmds="CoreRedirect.Forge ..."`) always exits **0** whatever this
> tool requests. On Windows a non-forced exit request becomes `PostQuitMessage`, and a headless
> editor does not surface that as the process exit code. That is engine behaviour, not a defect
> here — but a build step wired to the console form is a step that can never fail, so it is worth
> knowing before you write the YAML. The tool logs its code on that path so you can read it from the
> log if you need the console form for some other reason.

The commandlet also sets `UseCommandletResultAsExitCode`, which stops the engine rewriting a clean
`0` into `1` because something unrelated logged an error during the session. Without it, a
successful run that happened to load one asset with an unrelated warning would report
`BadArguments`.

---

## 8. The editor console form

```
CoreRedirect.Forge Before=C:/Snap/before.json After=C:/Snap/after.json Out=C:/Snap/redirects.ini Apply
```

Same body, same switches, same output — with the exit-code caveat in section 7. Leading dashes are
optional here because the console strips them anyway.

---

## 9. Applying the block

Paste the generated section into `DefaultEngine.ini`. **If that file already has a
`[CoreRedirects]` header, paste only the `+` lines underneath the existing one** — the engine reads
the section once, so a second header in the same file leaves one of the two blocks unread.

Then restart the editor. Redirects are read at startup.

---

## 10. What it does not do

- **It does not rename anything.** It reads your reflection surface and writes a text file. The
  refactor is yours.
- **It does not handle Blueprint-generated classes.** Those are skipped deliberately: renaming a
  Blueprint asset already writes an asset redirector, which is a different mechanism with a
  different remedy, and including them would fill the manifest with names that change every time
  somebody recompiles a Blueprint.
- **It does not read your old snapshot's schema if it changes.** A manifest from a different schema
  version is refused rather than best-effort parsed, because misreading the only record of your
  pre-refactor names is exactly the failure this product exists to prevent.
- **It does not decide about deletions.** A removed member with no successor is reported, never
  redirected.

---

## 11. If you also have Migration Ledger

They generate the same kind of block from opposite ends, and neither can do the other's job.

| | source of truth | answers |
| --- | --- | --- |
| **Migration Ledger** | the **engine's** deprecation database | "Epic renamed something under me during an engine upgrade" |
| **CoreRedirect Forge** | two snapshots of **your own** reflection surface | "I renamed something, and my assets still hold the old name" |

Migration Ledger knows the old-to-new mapping because Epic declares it in the engine headers.
Nothing in the engine records that *you* renamed `Health` to `Vitality`, which is why this tool has
to capture the surface itself, before the fact. Run Migration Ledger when you change engine
version; run this when you refactor.

## 12. Support

Questions, bugs and feature requests: <https://csaf.itch.io>

Made by Core Systems Asset Factory.

---

### AI disclosure

This product was built with AI assistance. Code: yes. Graphics: yes. Sounds: no. Text and dialog:
no.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
