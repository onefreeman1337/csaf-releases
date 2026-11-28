# Warhost March: a drawn campaign map where your armies march and every meeting opens a battle, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Warhost March: a drawn campaign map where your armies march and every meeting opens a battle, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-28


---

# Warhost March for RPG Maker MZ

A drawn campaign map for your armies. The plugin paints the land (coast, hills, woods, rivers), the roads between your strongholds, every castle, town, fort and village, and the ground each side holds, washed in its banner's colour. Your host is a banner token; so is every enemy host. Each day you march one road, then the enemy marches. When two hosts meet, a battle opens: Warhost's field battle in the open, a Warhost Siege at the walls. **Warhost 1.1 and Warhost Siege are separate plugins** (both are in the MZ Plugin Library); without them, every meeting is fought off screen by the same rules and the map shows the outcome.

Warhost March is part 3 of the Warhost Campaign volume (part 1 Warhost Siege, part 2 Warhost Muster), three scenes built on the original Warhost battle plugin. Any of them works alone; together, Muster raises the army, March takes it across the map, and Warhost and Warhost Siege fight its battles.

## What you get

- `WarhostMarch.js`: the commands, the campaign map scene and the map painter.
- `WarhostMarchCore.js`: the rules of the campaign (strongholds, roads, hosts, meetings, the save record).
- `WarhostCore.js` and `WarhostDraw.js`: Warhost's rules of battle and its banners. They are the same files as in Warhost 1.1; if you own Warhost, install them once.

No image files: everything on the map is drawn by the plugin when the map opens.

## Install

1. Copy the four `.js` files into your project's `js/plugins` folder.
2. In the Plugin Manager, add all four and turn them ON. Any order works: each file finds the others when the map first opens.
3. Optional, for battles on screen: Warhost 1.1 (`Warhost.js`) for field battles, Warhost Siege 1.0 (`WarhostSiege.js` and `WarhostSiegeCore.js`) for sieges. They are separate products.
4. Optional: Warhost Muster, to march the army mustered in its war camp.
5. If you own an older Warhost, download it again from its page: the current download is Warhost 1.1, whose `WarhostCore.js` and `WarhostDraw.js` are byte for byte the ones in this download.

The map is laid out for RPG Maker MZ's default 816 x 624 screen; other screen sizes are not supported in this version.

## Quick start

Make an event, add **Plugin Command > Warhost March > Open the Campaign Map**, and play. The default arguments are a ready campaign: 8 strongholds, 3 enemy hosts and a host of 5 regiments (214 men). The event waits while the map is on screen and goes on when you leave it.

## A day on the map

- **Your turn.** Left and Right (or Up and Down) choose a road from where your host stands; the roads light up in gold and the panel says what waits at the end. OK (Enter, Space or Z) marches. W (Page Down) waits a day. Escape leaves the map. With a mouse or a touch screen, click a stronghold one road away to choose it, click it again to march, or use the panel's buttons.
- **The enemy's turn.** Every enemy host whose stance is "march" moves one road toward the nearest place you hold or stand on. A host whose stance is "hold" stays where it stands. Two hosts never share a stronghold.
- A stronghold you march into without a fight becomes yours: a neutral one joins you, and an enemy one whose walls stand empty is taken.
- A stronghold you hold is taken by any enemy host that marches into it while your host is elsewhere.

## Meetings

| Where your host arrives | What happens |
| --- | --- |
| A neutral place, or an enemy village with no host | Taken without a fight |
| An enemy castle, town or fort with a garrison | A siege against the garrison |
| A place where an enemy host stands that its side does not hold | A field battle against that host |
| An enemy village where its own host stands | A field battle against that host (a village has no walls) |
| An enemy castle, town or fort where its host stands | A siege against the host and the garrison together |

When an enemy host marches onto the place where your host stands, you defend: a siege when you stand in a castle, town or fort you hold, a field battle anywhere else.

**After the battle.** Win an attack and the place is yours (its garrison is gone, and a host that stood there is broken). Win a defence and the host that came is broken. Lose an attack and your host falls back to the place it marched from. Lose a defence and the place is lost to that host; your host falls back to the nearest place you hold.

**Survivors.** The men who fled rejoin their regiments; the dead are lost for the rest of the campaign. No soldier is ever made on the map. A regiment with a variable has its survivors written to it after every battle.

**On screen or off screen.** With "Fight meetings: on screen" a meeting opens Warhost's battle (field) or Warhost Siege (walls), and the map comes back with the survivors that battle recorded. When the plugin a meeting needs is not installed, or with "off screen", the meeting is fought by the same rules off screen, a little each frame so the game never stalls, and the map shows the outcome. "Fight meetings" is "on screen" by default. Off screen, a siege uses Warhost Siege's rules when `WarhostSiegeCore.js` is installed; otherwise it is fought as a field battle with the defenders at half again their strength.

## The end of a campaign

- **Won** when no enemy host is left and no stronghold is in enemy hands ("The campaign is won when: every stronghold is taken"; neutral strongholds may stay neutral), or as soon as every enemy host is broken ("every enemy host is broken").
- **Lost** when your host has no soldiers left, or has nowhere left to stand.

The outcome variable gets 1 (won), 2 (lost) or 3 (the campaign goes on: you left the map). The day, the strongholds you hold and every regiment's variable are written when you leave the map.

**Kept by title.** A campaign is saved with the game under its title. Open the map with the same title and it carries on: the same day, the same holders, the same hosts. A regiment with a variable reads it again, so men mustered in camp since your last visit join the host. A finished campaign opened again starts over. **Start again** (an argument) starts a saved campaign over; **Forget a Campaign** (a command) forgets it.

## The map

- Up to 16 strongholds and 8 enemy hosts. Each enemy host is its own side.
- Positions: give a stronghold "Across" and "Down" (0 to 100 across the map) to place it, or leave them blank and the seed places it, on land and apart from the others.
- Roads: list a stronghold's "Roads to", or leave every list blank and the seed draws the roads. Either way every stronghold can reach every other: the plugin adds the shortest road between any two groups that cannot.
- Five lands: meadow, steppe, snow, desert and moor. The sea lies along one side of the map, chosen by the seed.
- The ground each side holds is washed in its banner's colour, with a dotted frontier where two sides meet. It changes the moment a stronghold changes hands, and so does the flag on the stronghold.
- Garrisons: a stronghold an enemy holds at the start fights with its garrison once. Blank means the garrison by kind (castle 26, town 20, fort 16 men, a village none); "none" means no garrison. A stronghold that changes hands keeps no garrison.

**Banners.** Each enemy host flies the banner its name generates (Warhost's heraldry: the same name always gives the same arms). Your host flies the banner of its first regiment, unless you set "Your host's banner" to a name. In a battle, every regiment flies its own banner, as in Warhost. A side's ground is washed in its banner's main colour, or its second colour when the main one is white.

## The default campaign

"The War for the Vale": Highgate (your castle), Millbrook, Ashford, Eastwatch (neutral), Thornwick (Kestrel Watch, holding), Saltmere and Kingsbarrow (The Storm Host) and Greywater (The Ashen Riders). The Storm Host and the Ashen Riders march; Kestrel Watch holds Thornwick.

We played it 16 times with different seeds, every battle fought by Warhost's and Warhost Siege's own rules. Marching on the nearest enemy place every day won 11 of 16 campaigns and lost none; the other 5 were not over when we stopped them. The median win took 7 days and left 63 men. Waiting behind walls whenever the enemy outnumbers your host 1.3 to 1 won 10 of 16. It is meant to be winnable, not a foregone win.

## Your army

"Your army" chooses where the host comes from:

- **auto** (the default): Warhost Muster's mustered army if Warhost Muster is installed and its war camp has been closed at least once (Break Camp), else the regiments in the command.
- **Warhost Muster**: the army that marched out of the war camp, in its order of battle. Without one, the regiments in the command (with a note in the console).
- **the regiments below**: the command's own list, up to 8. Give a regiment a variable and its soldiers are read from it when the map opens and written back after every battle.

## Compatibility

Warhost March adds one scene. It changes no RPG Maker method: it patches nothing in MZ's own code. It loads no image files and works with any plugin that does not replace the scene system. It reads its own save record, the variables and switches you give it, Warhost Muster's army when you ask for it, and (after a battle on screen) the record Warhost or Warhost Siege keeps of that battle.

## Plugin commands

**Open the Campaign Map** (`march`): title, land, strongholds, enemy hosts, where your host starts, your army, your regiments, when the campaign is won, fight meetings on or off screen, variables for the outcome, the day and the strongholds held, a won switch, a common event afterwards, a seed, and "Start again".

**Forget a Campaign** (`forget`): the title.

## Script calls

- `WarhostMarch.open({...})`: open the map with any of the command's arguments, e.g. `WarhostMarch.open({ title: 'The War in the North', terrain: 'snow', armyFrom: 'Warhost Muster' })`. In a script call the "Land" argument is named `terrain`.
- `WarhostMarch.campaign(title)`: the saved campaign as `{ day, men, held, enemyHeld, neutral, hosts, places, meetings, status }` (status is `on`, `won` or `lost`), or null.
- `WarhostMarch.forget(title)`: forget a saved campaign.
- `WarhostMarch.isOpen()`: true while the campaign map is on screen.

A compact army line works anywhere an army is asked for: `role:count:Name:strength`, regiments separated by commas, underscores read as spaces, strength optional (1 ordinary troops, 1.5 veterans, 0.5 levies), e.g. `foot:50:Storm_Spears,archer:20:Storm_Bows:1.5`. Roles: foot, pike, archer, horse, mage.

## Parameters

- **Your army's name**: shown on the panel and on the title banners across the map. Default "Your Host". (Warhost and Warhost Siege show their own "Your army's name" in their battles: set the same name there.)
- **Your army's colour**: a #hex colour for your side's ground on the map; blank = your banner's own colour.
- **Your host's banner**: a name your banner's arms are drawn from; blank = your first regiment's banner.
- **Default land**: meadow, steppe, snow, desert or moor.
- **Sounds**: choose a road (Cursor1), march (Move1), hosts meet (Horn), a stronghold changes hands (Item3). These name sound effects from MZ's own RTP.
- **Music on the map**: blank = the map's music keeps playing.

## Performance

Measured with our frame gate in MZ's own runtime on the heaviest case the map allows (16 strongholds, 8 marching hosts, a host that marches every turn, every meeting fought off screen): **3** draw calls a frame, no stock window drawn, and no growth in display objects while it ran. The plugin never reads pixels back from the screen.

## Terms

Commercial and non-commercial use in your RPG Maker projects, no royalty. See LICENSE.txt.

Written with AI assistance (code and graphics). No audio is included.

Core Systems Asset Factory, https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
