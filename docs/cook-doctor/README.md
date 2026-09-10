# Cook Failure Triage and Auto-Remediation — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Cook Failure Triage and Auto-Remediation  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-10


---

# Cook Doctor

**Name the one true cause of a failed cook, disprove the rest, repair it, and prove the repair.**

Unreal Engine 5.8, Windows, editor plugin. Runs as a commandlet for CI and as an editor console
command. It never writes to your project unless you pass `-Fix`, and everything `-Fix` does is
reversible with one switch.

---

## The problem this exists for

A single damaged package makes UE 5.8 emit **more than a thousand `Package is unloadable` errors,
of which exactly one is true.**

Measured on real cooks with a clean control run first:

| run | what changed | accusations | packages cooked | packages found |
| --- | --- | --- | --- | --- |
| baseline | nothing | 0 | 578 | 585 |
| corrupt A | one `.uasset` truncated | 1,412 (1 true) | 405 | 412 |
| corrupt B | a different `.uasset` truncated | 1,339 (1 true) | 524 | 531 |
| corrupt C | one `.uasset` truncated | 1,538 (1 true) | 525 | 532 |
| corrupt D | the same `.uasset` truncated again | 1,779 (1 true) | 418 | 425 |
| header only | 4 tag bytes overwritten | 1 | 578 | 585 |

Corrupt D is the run the store listing's screenshots were cropped from.

**The size of the cascade is not a constant.** The four truncation runs above produced 1,339,
1,412, 1,538 and 1,779 accusations, because how far the asset scan gets before the damage interrupts
it varies between runs. Corrupt C and corrupt D are the *same break of the same file* and differ by
241 accusations, which is the clearest demonstration of the point. The *shape* was identical every time: exactly one true cause, a false cascade
in the thousands, and nearly all of it aimed at engine content. Treat any single figure here as one
draw, not as a specification.

The `header only` row is the control that explains the mechanism. Overwriting the four tag bytes
instead of truncating the body produces **one** accusation and no cascade at all: the bad tag makes
the reader return early, before it can enter the error state that the `|| IsError()` half of the
condition below then reports about every file after it.

An *accusation* is a distinct package named in a `Package is unloadable` line. The raw log carries
about fifty more of those lines than there are packages, because some accusations are echoed;
Cook Doctor counts the packages, which is why its number is the smaller one.

**1,775 of the false accusations in corrupt D named files inside the installed engine
directory** - files whose bytes are perfect. The natural reading of that log is "my engine
installation is corrupt, verify or reinstall it", and that is hours spent on the wrong thing.

There is a second cost nobody is told about. The failing cook did not merely print errors, it
**cooked 418 packages where the clean control cooked 578** - and it did not say so anywhere. It
also *found* fewer packages to begin with (425 against 585), because the damage interrupts the
scan before the cook.

### Why the engine says it

`Engine/Source/Runtime/AssetRegistry/Private/PackageReader.cpp:159`:

```cpp
if (PackageFileSummary.Tag != PACKAGE_FILE_TAG || IsError())
{
    UE_LOGF(LogAssetRegistry, Error,
        "Package is unloadable: %ls. Reason: Invalid value for PACKAGE_FILE_TAG at start of file.",
        *PackageFilename);
    ...
}
```

**The message names one cause for a two-cause condition.** The branch fires on a bad tag *or* on the
reader already being in an error state, and it prints the tag explanation either way. So most of
those lines are a claim about the first four bytes of a file that this branch never checked.

Cook Doctor checks them.

---

## What it does

1. **Reads the cook log and the project together, and refuses if they no longer correspond.** The
   bytes on disk describe the project *as it is now*; the log describes it *as it was at cook time*.
   If an accused file changed in between, its bytes are not evidence about that cook, and answering
   anyway produces a confident wrong answer. Cook Doctor refuses and names the files that drifted.
2. **Classifies every accusation by the bytes on disk**, never by the log's reason string - four
   bytes per file, not a load. A file whose first four bytes are `0x9E2A83C1` is intact, whatever the
   log said about it.
3. **Names the genuinely damaged package with its evidence**: `header intact, body truncated - the
   reader wanted 9642 bytes with 4113 remaining, and the file is 12504 bytes`.
4. **Acts, if you ask it to.** `-Fix` moves the named file out of the project into a timestamped
   quarantine folder, writes a journal, and tells you which packages referenced it. Nothing is ever
   deleted, nothing outside the project is ever touched, and `-Undo=<journal>` puts everything back.
5. **Proves the repair** rather than asserting it. `-Prove` compares the failing log with the re-cook
   and prints the delta that matters. On the `corrupt D` run above, that was
   `accusations 1779 -> 0` and `packages 418 -> 578 (of 425 and 585 total)`, copied from the tool's
   own output. Your numbers will differ - the count of false accusations is not a constant, and the
   only part of it that reproduced across runs is the shape: exactly one true cause, a large false
   cascade after it, and both gone once the damaged package is dealt with.

---

## Quick start

```
"C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" ^
    "D:\MyProject\MyProject.uproject" ^
    -run=CookDoctor -CookLogPath="D:\MyProject\Saved\Logs\Cook.log" ^
    -Report="D:\MyProject\Saved\CookDoctor.html" ^
    -unattended -nopause -nosplash
```

Then, if it named a damaged file and you have no version control to restore it from:

```
    -run=CookDoctor -CookLogPath="...\Cook.log" -Fix
```

Re-cook, and prove it:

```
    -run=CookDoctor -CookLogPath="...\Cook_after.log" -Prove="...\Cook.log"
```

In the editor, the same body runs from the console: `Cook.Doctor CookLogPath=... Fix`.

---

## Switches

| switch | what it does |
| --- | --- |
| `-CookLogPath=<path>` | The cook log to read. Required except for `-Undo` and `-Help`. |
| `-Fix` | Quarantine every named true cause, reversibly, and write a journal. |
| `-Undo=<journal>` | Put quarantined files back exactly where they came from. |
| `-Prove=<before log>` | Compare a failing cook log with `-CookLogPath` (the re-cook) and print the delta. |
| `-Report=<path>` | Write a report. `.json` for CI, anything else HTML. The extension decides. |
| `-Quarantine=<dir>` | Where `-Fix` moves files. Default `<Project>/Saved/CookDoctor/Quarantine/<time>`. |
| `-AllowStale` | Answer even though accused files changed after the cook. Off by default. |
| `-CookTime=<ISO8601>` | Override the cook clock, for a log copied off a build machine. |
| `-NoReferencers` | Skip the asset registry pass that names what pointed at a quarantined file. |
| `-Help` | The switch table. |

### Why it is not `-Log=`

Because Unreal would eat it, and take your cook log with it.

The engine resolves its own log filename with
`FParse::Value(FCommandLine::Get(), TEXT("LOG="), ...)`
(`GenericPlatformOutputDevices.cpp:84`), and `FParse::Value` is a **plain case-insensitive substring
search over the entire command line** (`Parse.cpp:265` - `FCString::Strifind`, with no requirement
that the match begin a token). So `-Log=D:\Cook.log` **and** `-CookLog=D:\Cook.log` both contain
`Log=`, and the editor would point its own log file at the cook log you are asking about - and then
write over it.

`-CookLogPath=` cannot contain the substring `LOG=`. If you pass `-Log=` or `-CookLog=` anyway, Cook
Doctor refuses the run and tells you this, rather than starting work on a file that is being
overwritten underneath it.

For the same reason, Cook Doctor **refuses to read the log the running editor is writing to**.

---

## Exit codes

The exit code is the CI contract. **It is true on the commandlet and cannot be true on the editor
console command**, because on Windows a non-forced exit request becomes `PostQuitMessage` and a
headless editor does not surface it as a process exit code. Gate your build on the commandlet.

| code | name | meaning |
| --- | --- | --- |
| 0 | `Clean` | Real work was done and no damaged package was found. |
| 1 | `BadUsage` | A switch was not recognised, or two switches contradict. Nothing ran. |
| 2 | `NothingScanned` | The file carries no recognisable Unreal log lines. Almost certainly the wrong file. |
| 3 | `Inconclusive` | Accusations exist and **every one was disproved**. The cause is not on disk now. |
| 4 | `FindingsFound` | At least one genuinely damaged package was named. **Gate CI on this.** |
| 5 | `Refused` | The run would not have been provably safe or provably current. |
| 6 | `MissingInput` | A required file was absent or unreadable. |

`Inconclusive` is deliberately not `Clean`. If the cook complained and nothing on disk is damaged
now, something is wrong that this tool cannot see, and telling you the project is fine would be the
worst answer available.

`-Fix` returns `FindingsFound` when it found and quarantined a cause. The repair is not proven until
you re-cook and run `-Prove`.

---

## What `-Fix` will and will not do

1. **Nothing outside your project is ever moved.** A damaged file under the installed engine is
   reported with its evidence and left alone. This tool does not repair Epic's installation and will
   not pretend to.
2. **Nothing is overwritten.** A destination that already exists is a refusal, not a replacement.
3. **Files are moved, never deleted**, and the journal makes every move reversible.
4. **Every refusal is printed with its reason.** A silent skip would let a run report success over
   work it did not do.
5. **Restoring the real bytes is better than quarantining the file.** When a `.git`, `.svn` or
   `p4config` is found at or above the project, the report leads with the exact command to run
   instead - `git checkout -- <file>`, `svn revert <file>`, `p4 sync -f <file>`. This is detection
   and advice: Cook Doctor never invokes a version control client itself.
6. **`-Undo` refuses an entry whose original path is occupied again**, because that usually means you
   have already restored the real file and putting the damaged copy back would destroy the repair.

---

## What it does not claim

- **One failure class is measured: a truncated or partially written package** - what an interrupted
  save, a partial sync or a bad LFS checkout produces. Cook failures have other causes; this tool
  says nothing about them and will tell you it found nothing rather than invent a culprit.
- **The false cascade's behaviour is measured; its internal mechanism is inferred.** What is proven
  is that the accusations are false and that reading four bytes falsifies them.
- **A bad file header does not cascade.** Same fixture, one variable: truncating a package body
  produced 1,338 false accusations, overwriting its first four bytes produced one and no cascade.
- **Verified on UE 5.8 only**, because 5.8 is the only version it has been built and run against.

## The report's typeface

The HTML report sets its headline and its counts in **Manrope**, embedded in the plugin binary as a
base64 woff2 so a saved report renders the same way on a build machine with no network and nothing
installed. Paths stay in Cascadia Mono, and body text falls back to whatever the reader's system
provides.

> Manrope is Copyright 2019 The Manrope Project Authors
> (<https://github.com/sharanda/manrope>), licensed under the **SIL Open Font License, Version
> 1.1**, which expressly permits embedding the font in a document. The licence text is at
> <https://scripts.sil.org/OFL>. Manrope is not sold as part of this product and no part of this
> licence applies to the rest of the plugin.

The byte count and sha256 of the exact font file compiled in are recorded at the top of
`Source/CookDoctor/Private/CDReportFont.cpp`.

## AI disclosure

Code: generated with AI assistance. Graphics: generated with AI assistance. Sounds: none.
Text and dialog: none.

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
