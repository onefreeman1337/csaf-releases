# Play Compliance — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Play Compliance  
**Engine:** Unity 6  
**Docs published:** 2026-08-21


---

# Play Compliance

**Find the native plugin that will block your Android update — then fix it.**

From **1 February 2027**, Google will not accept app updates whose native libraries do not support
16 KB memory page sizes. Android's own documentation puts it plainly:

> *"Starting February 1, 2027, if your app updates don't support 16 KB memory page sizes, you won't
> be able to release these updates."*
> — <https://developer.android.com/guide/practices/page-sizes>

Unity's entire remedy is a build warning telling you to **"contact the plug-in creators"** — without
naming which plug-in. Google's own tooling is a set of command-line scripts aimed at a finished APK,
and `check_elf_alignment.sh` is bash, so it does not run on Windows at all.

Play Compliance closes both gaps: it reads the ELF program headers of every `.so` in your project,
names the plugin that owns each one, and then **acts** on what it found.

---

## Install

Import the package. Everything lives under `Assets/CSAF/PlayCompliance/`.

Open **Window → CSAF → Play Compliance**.

If your project ships no Android plugins yet, use **Window → CSAF → Play Compliance — Load sample
libraries**. It writes three sample libraries into `Temp/` — one already compliant, one this tool can
re-align in place, one that genuinely needs the vendor to relink — and scans them. Nothing is written
into `Assets/`.

A demo scene sits at `Assets/CSAF/PlayCompliance/Demo/PlayComplianceDemo.unity`. Press Play for the
two-step tour.

---

## What it does

### 1. It names the plugin

Every `.so` under `Assets/`, `Packages/` and the UPM package cache is opened and its **PT_LOAD
program headers** are read directly — the same `p_align` field Google's `check_elf_alignment.sh`
checks, in pure C#, with no NDK and no shell. Each library is then traced back to the plugin folder
that owns it, whether that is a UPM package, an `.androidlib`, an extracted `.aar` or a vendor folder
under `Assets/`.

The ABI comes from the ELF header, not the folder name. A folder is a convention a vendor can get
wrong; `e_machine` is what the loader actually reads. When the two disagree the window says so.

### 2. It drops the ABIs you never ship

If your project builds `arm64-v8a` only, every `armeabi-v7a` and `x86_64` copy of every SDK is
payload you ship and never load — and each one is a Play Console rejection waiting to happen. One
button excludes them from the Android build by flipping their plugin importer settings. Nothing is
deleted, and **Ctrl+Z puts it back**.

### 3. It re-aligns what can be re-aligned

Some libraries can be brought to 16 KB alignment **in place**, without a relink. The safety argument
is one sentence: **virtual addresses do not change.**

Relocations, the dynamic table, the GOT and PLT, symbol values and DWARF all reference virtual
addresses. The only fields in an ELF file that reference *file offsets* are `e_phoff`, `e_shoff`,
each `p_offset` and each `sh_offset` — a closed, enumerable set. Play Compliance inserts padding so
every LOAD segment's file offset becomes congruent with its virtual address modulo 16 KB, bumps
exactly those four things, and sets `p_align` to 16384. Nothing else in the file changes meaning.

Before it writes anything it:

- copies the original to `PlayCompliance_Backups/<timestamp>/`, outside `Assets/`;
- re-parses its own output from scratch;
- checks every LOAD segment is now 16 KB aligned **and** offset-congruent;
- **compares the entire file, byte for byte**, against the original at its shifted position — every
  byte outside the four header fields listed above must be identical, and every inserted padding
  byte must be zero;
- confirms no virtual address and no segment size moved.

If any check fails, your file is never touched.

### 4. It refuses the ones it cannot safely fix — and writes the email instead

When two LOAD segments with different permissions share a single 16 KB page, no file-level rewrite
can separate them, because their addresses were fixed at link time. Play Compliance says so
explicitly, names the two segments and the address, and generates a complete vendor email listing
the exact files, their measured alignment, the reproduction command and the one linker flag that
fixes it.

**This is common, and the tool does not pretend otherwise.** Relinking with
`-Wl,-z,max-page-size=16384` is the gold standard and Play Compliance says so everywhere. The
in-place fix exists for the libraries you cannot rebuild because you did not build them.

### 5. It fails the build before you waste an upload

The **Fail Android builds** toggle in the Play Compliance window's toolbar installs a pre-build check that stops an
Android build which would produce a package Google refuses, and names the offending plugins in the
error.

**It is off by default.** A package that silently starts failing your existing builds the moment you
import it is a package you uninstall. Turn it on once you have seen what it would say.

---

## Continuous integration

```
Unity.exe -batchmode -quit -nographics -projectPath <project> \
          -executeMethod CSAF.PlayCompliance.BatchMode.Scan \
          -playComplianceJson  Build/play-compliance.json \
          -playComplianceMd    Build/play-compliance.md \
          -playComplianceFailOn 0
```

| Flag | Meaning |
| --- | --- |
| `-playComplianceJson <path>` | Machine-readable report. The diff between two of these **is** the burndown. |
| `-playComplianceMd <path>` | Markdown report grouped by plugin, worst first. |
| `-playComplianceBaseline <path>` | An earlier JSON report, to render a delta. |
| `-playComplianceFailOn <n>` | Exit 1 when more than `n` shipped libraries are blocking. |
| `-playComplianceFix` | Re-align everything that can be re-aligned before the gate is evaluated. |

Exit codes: **0** pass · **1** over budget · **2** the scan did not complete, so the gate cannot
honestly pass.

A cancelled scan finds *fewer* problems than a complete one. Play Compliance marks that in the
report and refuses to let a partial run satisfy a budget — otherwise work not done reads as
progress.

---

## Verdicts

| Verdict | Meaning |
| --- | --- |
| **16 KB OK** | Every LOAD segment is already aligned to 16 KB or better. |
| **FIXABLE HERE** | Not aligned, but an in-place rewrite is safe. One button. |
| **NEEDS RELINK** | Segments share a 16 KB page with different permissions. Only the vendor can fix it. |
| **NOT SHIPPED** | Excluded from the Android build by its importer, so Google never sees it. |
| **UNREADABLE** | Not an ELF this tool will reason about — including zero-byte symlink placeholders, which Windows checkouts of Linux packages produce. |

---

## What it deliberately does not do

- **It does not touch APK or AAB zip alignment.** `zipalign -P 16` is the Android Gradle Plugin's
  job and Unity already runs it. This tool is about the contents of each `.so`, which is the half
  nothing in your toolchain will fix for you.
- **It does not claim a patched library is equivalent to a relinked one.** It is byte-identical in
  every LOAD segment and identical in every virtual address, which is a strong claim and a
  checkable one — but if you can get a rebuilt library from the vendor, take it.
- **It does not modify anything without a backup and a verification pass.**

---

## Support

Core Systems Asset Factory — CSAF.
Include the exported `play-compliance.json` with any question; it contains every program header the
tool read.

---

*Play Compliance v1.0.0 · Unity 2022.3 and newer · Editor-only, ships nothing into your build.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
