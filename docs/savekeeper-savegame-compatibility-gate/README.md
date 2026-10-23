# Savekeeper — SaveGame Compatibility Gate — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Savekeeper — SaveGame Compatibility Gate  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-10-23


---

# Savekeeper - SaveGame Compatibility Gate

Unreal Engine 5.8, Windows. Copyright (c) 2026 Core Systems Asset Factory.

Rename a variable on your SaveGame class, change its type or move a struct member, and an old player's save
still loads. The value is simply gone: the engine matches stored values by name and skips any it cannot place,
with no error. Savekeeper reads the saves you kept from every shipped build against your current classes and
tells you, per stored value, whether a player keeps it.

## The part the editor hides from you

Your editor and your packaged game do not load saves by the same rules. When the editor loads a save it follows
`[CoreRedirects]` property redirects and Blueprint property GUIDs, so a renamed variable comes back in PIE. A
packaged game loading with `UGameplayStatics` does neither: the engine applies both only when
`!RequiresCookedData() || IsSaveGame()` (Class.cpp, lines 1621-1622 in 5.8), a packaged game requires cooked
data, and `LoadGameFromMemory` never marks its archive as a save game. So Savekeeper judges every stored value
three ways: in the editor, in a packaged game with the stock loader, and in a packaged game with Savekeeper's
loader.

This statement is read from the 5.8 engine source. Savekeeper's own tests run in the editor.

## Install

Copy the `Savekeeper` folder into your project's `Plugins` folder and open the project. The plugin ships as
source, so the editor offers to build it on first open; that needs a C++ project and Visual Studio (a
Blueprint-only project becomes one when you add any C++ class). Two modules load: `SavekeeperRuntime` (ships
with your game) and `Savekeeper` (editor only).

## 1. Keep the saves each build writes

Play the build, save, then:

    UnrealEditor-Cmd.exe YourGame.uproject -run=Savekeeper -Capture=1.0.0

copies every `.sav` in `Saved/SaveGames` into `SaveFixtures/1.0.0/`. Saves from a packaged build live elsewhere;
pass `-From=<folder>`. A build folder is never overwritten. Commit `SaveFixtures` with your project.

## 2. Gate every build

    UnrealEditor-Cmd.exe YourGame.uproject -run=Savekeeper

reads every save under `SaveFixtures/`, one folder per build, and writes `Saved/Savekeeper/`:

- `Savekeeper_Report.html`: builds by SaveGame class, then every stored value with its stored type, its value,
  where it lands now, and its fate in the editor and in a packaged game.
- `Savekeeper_Report.json` and `Savekeeper_JUnit.xml` for CI.
- `Savekeeper_CoreRedirects.ini`: the redirect lines it found.
- `Savekeeper_UpgradeSteps.txt`: code to carry values no redirect can carry.

Exit codes: 0 nothing lost, 2 a stored value is lost, 4 bad arguments, 5 a save file could not be read,
6 `-Apply` could not write. `-Loader=Savekeeper` judges a packaged game as loading with Savekeeper's loader.

## 3. The fixes it writes

- **A Blueprint variable you renamed.** In a save written by the editor (PIE), the variable's property GUID
  proves the rename, so Savekeeper writes the `+PropertyRedirects=` line. A packaged game writes no property
  GUIDs into a save (the same Class.cpp test), so in saves captured from a packaged build a Blueprint rename is
  proposed the way a C++ rename is.
- **A C++ field you renamed.** When exactly one new field of the same type exists at that level, Savekeeper
  proposes the line. Confirm it with `-Accept=Gold:Coins` (join several with `+`).
- **Every line is proven before it is offered as active.** Savekeeper rewrites the save with the line applied,
  loads it through the engine, saves it again and checks that the value is in the new field.
- `-Apply` writes the proven lines into `Config/DefaultEngine.ini` under `[CoreRedirects]`. The previous file is
  kept in `Saved/Savekeeper/`.
- A field whose type changed beyond what the engine converts gets an upgrade step that reads the stored value with
  `USavekeeperLibrary::ReadStoredValue`.
- A field you removed on purpose goes in `SaveFixtures/Allowed.txt` (`Class.Field`, `Class.Struct.Field` or
  `*.Field`, one per line, `#` for comments).

## 4. Load so a packaged game keeps renamed values

Replace **Load Game from Slot** with **Load Game from Slot (Savekeeper)** (C++:
`USavekeeperLibrary::LoadGameFromSlotKeepingRenames`). It applies your project's `[CoreRedirects]` class and
property redirects to the stored bytes, then hands them to the stock `LoadGameFromMemory`. It returns how many
names it changed. A save it cannot read is loaded unchanged.

## What it reads

Saves written by `UGameplayStatics` (Save Game to Slot / Save Game to Memory) in UE 5.4 or later, which record
complete property type names. Savekeeper reads the tagged-property stream itself, walking into structs and
arrays of structs, and checks that every walk ends exactly where the stored size says it should. Sets and maps
are judged as one value each. Saves from older engines are refused by name rather than guessed at.

Not covered: save formats of third-party save plugins; your own `Serialize` overrides that write raw bytes.

## AI disclosure

Savekeeper's code and its store images were written and made with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
