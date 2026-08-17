//=============================================================================
// ColosseumCore.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [v1.0.0] The championship layer: seeded brackets, persistent rivals that level and remember, weight classes, seasons and belts.
 * @author CSAF — Corey & Stephanie's Asset Factory
 * @url https://csaf.itch.io/colosseum-core
 *
 * @param tournaments
 * @text Tournaments
 * @type struct<Tournament>[]
 * @desc Every championship in your game. A tournament is a bracket, its entrants, its weight class and its prizes.
 * @default []
 *
 * @param rivals
 * @text Rivals
 * @type struct<Rival>[]
 * @desc The persistent cast. Rivals keep their record, level between rounds and remember every result against the player.
 * @default []
 *
 * @param belts
 * @text Championship belts
 * @type struct<Belt>[]
 * @desc Titles that change hands. The current holder is tracked across seasons and shown in the bracket and season scenes.
 * @default []
 *
 * @param worldSeed
 * @text Tournament seed
 * @type string
 * @desc Every simulated result derives from this string. Same seed, same championship, on every machine and in every save.
 * @default sand-and-glory
 *
 * @param upsetSlope
 * @text Upset resistance
 * @type number
 * @decimals 2
 * @min 0.10
 * @max 20.00
 * @desc How strongly the higher-rated team is favoured. Low makes every match a coin flip; high makes seeding destiny. Probe-tuned.
 * @default 4.00
 *
 * @param ratingPerLevel
 * @text Rating per level
 * @type number
 * @decimals 1
 * @min 0.1
 * @max 100.0
 * @desc Rating contributed by one mean party level. The resolver compares ratings, so only ratios matter. Probe-tuned.
 * @default 10.0
 *
 * @param ratingPerMember
 * @text Rating per team member
 * @type number
 * @decimals 1
 * @min 0.0
 * @max 100.0
 * @desc Rating contributed by each fighter on the team beyond the first. Probe-tuned.
 * @default 6.0
 *
 * @param npcScalePerLevel
 * @text Rival power per level
 * @type number
 * @decimals 3
 * @min 0.000
 * @max 1.000
 * @desc Stat multiplier a rival's troop gains per level above its base. 0.04 = +4% per level. 0 disables scaling.
 * @default 0.040
 *
 * @param slate
 * @text Palette: slate
 * @type string
 * @desc The near-black every colosseum screen is built on. Set here ONCE — the bracket and the ledger both read it.
 * @default #16120f
 *
 * @param brass
 * @text Palette: brass
 * @type string
 * @desc Rules, seed discs, bracket lines, table hairlines. The engraved metal of the whole look.
 * @default #b08d4a
 *
 * @param parchment
 * @text Palette: parchment
 * @type string
 * @desc Fighter names and body text. Kept warm so names read like a ledger rather than a spreadsheet.
 * @default #d9c69a
 *
 * @param blood
 * @text Palette: crimson
 * @type string
 * @desc Losses, eliminations, and anything urgent.
 * @default #8e2f23
 *
 * @param gold
 * @text Palette: champion gold
 * @type string
 * @desc Your own chips and rows, champions, belts, and every line that matters most.
 * @default #e3b544
 *
 * @command openBracket
 * @text Open the bracket
 * @desc Opens the live bracket diagram for a tournament: lines draw toward the final as results land.
 * @arg tournamentId
 * @text Tournament
 * @type string
 * @desc The tournament id from the Tournaments parameter.
 * @default main
 *
 * @command openSeason
 * @text Open the season table
 * @desc Opens the season standings and rival dossiers.
 *
 * @command enterTournament
 * @text Enter a tournament
 * @desc Registers the player's party into a tournament and builds the seeded bracket.
 * @arg tournamentId
 * @text Tournament
 * @type string
 * @default main
 *
 * @command startPlayerMatch
 * @text Start the player's match
 * @desc Starts the player's current-round battle through the normal battle system. The result lands in the bracket.
 *
 * @command resolveNpcRound
 * @text Resolve rival matches
 * @desc Instantly resolves every rival-vs-rival match in the current round. The player's own match is never simulated.
 * @arg tournamentId
 * @text Tournament
 * @type string
 * @default main
 *
 * @command simulateToPlayer
 * @text Simulate to the player's match
 * @desc Fast-forwards rival matches round by round until the player is due to fight, or the tournament ends.
 *
 * @command advanceSeason
 * @text Advance the season
 * @desc Closes the season: the season counter rises and every rival trains toward the player's level. Call it at your season boundary.
 *
 * @command awardBelt
 * @text Award a belt
 * @desc Hands a belt to a holder directly, for scripted title changes. Use rival ids, or $player.
 * @arg beltId
 * @text Belt
 * @type string
 * @default belt-grand
 * @arg holder
 * @text New holder
 * @type string
 * @default $player
 *
 * @command exportStanding
 * @text Export standing to variable
 * @desc Writes the player's current placement in a tournament (1 = champion) into a game variable.
 * @arg tournamentId
 * @text Tournament
 * @type string
 * @default main
 * @arg variableId
 * @text Variable
 * @type variable
 * @default 1
 *
 * @help
 * ============================================================================
 * Colosseum Core — the championship layer
 * ============================================================================
 * Keep your arena menu. This is the championship above it: seeded brackets
 * that fill in as you win, rivals that persist, level between rounds and
 * remember beating you, weight classes, seasons and belts.
 *
 * This plugin owns the STRUCTURE. Battles themselves run through your battle
 * system untouched — the player fights real battles; rival-vs-rival matches
 * resolve deterministically from the tournament seed.
 *
 * Full documentation ships in Readme_for_Users.md.
 * ============================================================================
 */
/*~struct~Tournament:
 * @param id
 * @text Id
 * @type string
 * @desc Unique key you use in plugin commands.
 * @default main
 *
 * @param name
 * @text Name
 * @type string
 * @default The Grand Colosseum
 *
 * @param size
 * @text Bracket size
 * @type select
 * @option 4
 * @option 8
 * @option 16
 * @desc Entrant slots. Fewer real entrants than slots means the top seeds draw byes, exactly as a real bracket does.
 * @default 8
 *
 * @param entrants
 * @text Entrants
 * @type string[]
 * @desc Rival ids, and $player for the player's party. Order does not matter — seeding is by rating.
 * @default []
 *
 * @param minLevel
 * @text Weight class — minimum level
 * @type number
 * @min 0
 * @desc Lowest mean party level admitted. Blank or 0 disables the floor.
 * @default 0
 *
 * @param maxLevel
 * @text Weight class — maximum level
 * @type number
 * @min 0
 * @desc Highest mean party level admitted. Blank or 0 disables the ceiling.
 * @default 0
 *
 * @param beltId
 * @text Belt on the line
 * @type string
 * @desc Optional belt id from the Belts parameter. The winner takes it.
 * @default
 *
 * @param rewardBase
 * @text Round reward (gold)
 * @type number
 * @min 0
 * @desc Gold the player earns for winning a first-round match. Blank disables gold rewards.
 * @default 200
 *
 * @param rewardGrowth
 * @text Reward growth per round
 * @type number
 * @decimals 2
 * @min 1.00
 * @max 10.00
 * @desc Each later round pays this many times the previous one. 2 doubles the purse every round.
 * @default 2.00
 */
/*~struct~Rival:
 * @param id
 * @text Id
 * @type string
 * @default rival1
 *
 * @param name
 * @text Name
 * @type string
 * @default Cassia of the Ninth
 *
 * @param faceName
 * @text Face image
 * @type file
 * @dir img/faces
 * @default
 *
 * @param faceIndex
 * @text Face index
 * @type number
 * @min 0
 * @max 7
 * @default 0
 *
 * @param troopId
 * @text Troop fought as
 * @type troop
 * @desc The troop the PLAYER fights when drawn against this rival.
 * @default 1
 *
 * @param baseLevel
 * @text Base level
 * @type number
 * @min 1
 * @max 99
 * @default 10
 *
 * @param members
 * @text Team size
 * @type number
 * @min 1
 * @max 8
 * @default 3
 *
 * @param temperament
 * @text Temperament
 * @type select
 * @option steady
 * @option hungry
 * @option volatile
 * @desc How the rival levels between rounds and seasons. Hungry chases the player's level; volatile swings; steady grinds.
 * @default steady
 */
/*~struct~Belt:
 * @param id
 * @text Id
 * @type string
 * @default belt-grand
 *
 * @param name
 * @text Name
 * @type string
 * @default The Grand Belt
 *
 * @param holder
 * @text Initial holder
 * @type string
 * @desc Rival id who holds it when the game starts, or blank for vacant.
 * @default
 */

'use strict';

(function () {

  /**
   * The pure tournament engine. Everything in here runs identically in Node
   * (the headless suite) and in the engine, and touches nothing of RPG Maker.
   */
  const Engine = {};

  /* ------------------------------------------------------------------ rng */

  /**
   * FNV-1a 32-bit hash of a string. Deterministic across platforms.
   * @param {string} str Input.
   * @returns {number} Unsigned 32-bit hash.
   */
  Engine.hashString = function (str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  };

  /**
   * Mulberry32 PRNG. Small, fast, and good enough for match odds by a wide
   * margin. Never call Math.random() in game logic — this is the seam.
   * @param {number} seed Unsigned 32-bit seed.
   * @returns {function(): number} Generator of floats in [0, 1).
   */
  Engine.mulberry32 = function (seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  /**
   * A generator scoped to one match, derived from the world seed and the
   * match's address. A reloaded save replays identically; two saves with
   * different world seeds diverge.
   * @param {object} state Colosseum state.
   * @param {string} tournamentId Tournament.
   * @param {number} round Round index (0-based).
   * @param {number} slot Match slot within the round.
   * @returns {function(): number} Seeded generator.
   */
  Engine.matchRng = function (state, tournamentId, round, slot) {
    const key = state.seed + '|' + tournamentId + '|r' + round + '|m' + slot + '|run' + state.runNo;
    return Engine.mulberry32(Engine.hashString(key));
  };

  /* ------------------------------------------------------- id discipline */

  const BANNED_IDS = ['__proto__', 'constructor', 'prototype'];

  /**
   * Validates a user-supplied id before it becomes an object key. The wing
   * shipped a flag named __proto__ once; it set the prototype, read back
   * false forever, and the fix forced a second fix. Never again.
   * @param {string} id Proposed id.
   * @returns {string} The id, if legal.
   */
  Engine.assertId = function (id) {
    if (typeof id !== 'string' || !id.length) throw new Error('Colosseum: empty id');
    if (BANNED_IDS.indexOf(id) !== -1) throw new Error('Colosseum: illegal id "' + id + '"');
    return id;
  };

  /* ---------------------------------------------------------------- state */

  /**
   * Creates a fresh persisted record. Plain data only — this object is what
   * lives in the save file, so no class instances, no functions, no holes.
   * @param {string} seed World seed string.
   * @returns {object} State v1.
   */
  Engine.createState = function (seed) {
    return {
      v: 1,
      seed: String(seed === undefined ? 'sand-and-glory' : seed),
      runNo: 0,
      seasonNo: 1,
      lvlTick: 0,
      rivals: {},
      belts: {},
      active: null,
      pendingMatch: null,
      player: { wins: 0, losses: 0, titles: 0, bestFinish: null },
      h2h: {},
      history: []
    };
  };

  /**
   * Fills any fields a state written by an older version lacks, and preserves
   * everything it does not recognise. Forward compatibility is a promise this
   * catalogue makes about saves: a buyer's game updates the plugin mid-project
   * and every existing save keeps working.
   * @param {object} state Possibly old state.
   * @returns {object} The same object, upgraded in place.
   */
  Engine.migrate = function (state) {
    if (state.v === undefined) state.v = 1;
    if (state.lvlTick === undefined) state.lvlTick = 0;
    if (state.pendingMatch === undefined) state.pendingMatch = null;
    if (!state.player) state.player = { wins: 0, losses: 0, titles: 0, bestFinish: null };
    if (!state.h2h) state.h2h = {};
    if (!state.history) state.history = [];
    return state;
  };

  /**
   * Registers a rival into state. Levels and records persist from then on.
   * @param {object} state Colosseum state.
   * @param {object} def {id, name, troopId, baseLevel, members, temperament, faceName, faceIndex}
   * @returns {object} The stored rival record.
   */
  Engine.defineRival = function (state, def) {
    const id = Engine.assertId(def.id);
    if (!state.rivals[id]) {
      state.rivals[id] = {
        id: id,
        name: String(def.name || id),
        troopId: def.troopId | 0,
        level: Math.max(1, def.baseLevel | 0),
        base: Math.max(1, def.baseLevel | 0),
        members: Math.max(1, def.members | 0),
        temperament: def.temperament || 'steady',
        faceName: def.faceName || '',
        faceIndex: def.faceIndex | 0,
        wins: 0,
        losses: 0,
        titles: 0,
        bestFinish: null
      };
    }
    return state.rivals[id];
  };

  /**
   * Registers a belt.
   * @param {object} state Colosseum state.
   * @param {object} def {id, name, holder}
   * @returns {object} The stored belt record.
   */
  Engine.defineBelt = function (state, def) {
    const id = Engine.assertId(def.id);
    if (!state.belts[id]) {
      const holder = def.holder || null;
      state.belts[id] = { id: id, name: String(def.name || id), holder: holder, reigns: [] };
      // The initial holder is the belt's FIRST reign, not a footnote — the
      // dossier must be able to say who the player took the title from.
      if (holder) state.belts[id].reigns.push({ holder: holder, season: 0, tournament: null });
    }
    return state.belts[id];
  };

  /* -------------------------------------------------------------- seeding */

  /**
   * Standard bracket seed order for a power-of-two size: the arrangement in
   * which seeds 1 and 2 can only meet in the final, 1 plays the lowest seed
   * first, and every round-1 pair sums to size + 1.
   * @param {number} size 4, 8 or 16.
   * @returns {number[]} Seed numbers (1-based) in slot order.
   */
  Engine.seedOrder = function (size) {
    if ([4, 8, 16].indexOf(size) === -1) throw new Error('Colosseum: bracket size must be 4, 8 or 16');
    let order = [1];
    for (let n = 2; n <= size; n *= 2) {
      const next = [];
      for (let i = 0; i < order.length; i++) next.push(order[i], n + 1 - order[i]);
      order = next;
    }
    return order;
  };

  /**
   * Rating of one entrant. Only ratios matter to the resolver, so the scale
   * is arbitrary; the constants are exposed as parameters and probe-tuned.
   * @param {object} entrant {level, members} — rival record or player proxy.
   * @param {object} cfg {ratingPerLevel, ratingPerMember}
   * @returns {number} Rating.
   */
  Engine.rating = function (entrant, cfg) {
    const perLevel = cfg && cfg.ratingPerLevel !== undefined ? cfg.ratingPerLevel : 10;
    const perMember = cfg && cfg.ratingPerMember !== undefined ? cfg.ratingPerMember : 6;
    return entrant.level * perLevel + (entrant.members - 1) * perMember;
  };

  /**
   * Probability that the HIGHER-rated side wins, from the rating gap through
   * a logistic curve. gap 0 gives exactly 0.5; the slope parameter decides
   * how fast favouritism saturates.
   *
   * PROBE-MEASURED 2026-08-11 (balance_probe.js, 20 000 draws per point):
   * at the default slope 4, the resolver's realised underdog rate matches
   * this formula within 0.5pp at every gap tried (1 lvl 45.8%, 3 lvl 36.4%,
   * 5 lvl 28.0%, 7 lvl 21.2%) — the fought path and the formula agree.
   * Across 20 000 8-bracket tournaments the #1 seed takes 31% of titles and
   * the #8 seed 1.9%: a real favourite, live upsets. Slope 2 flattens that
   * to 21%/5% for buyers who want chaos.
   * @param {number} ratingA Side A rating.
   * @param {number} ratingB Side B rating.
   * @param {number} slope Upset resistance (parameter, probe-tuned).
   * @returns {number} P(A wins), in (0, 1).
   */
  Engine.winChance = function (ratingA, ratingB, slope) {
    const scale = Math.max(ratingA, ratingB, 1);
    const gap = (ratingA - ratingB) / scale;
    return 1 / (1 + Math.exp(-(slope === undefined ? 4 : slope) * gap));
  };

  /**
   * Builds a seeded bracket. Entrants are seeded BY RATING (highest = seed 1);
   * when there are fewer entrants than slots the low slots become byes, which
   * standard seed order hands to the top seeds — exactly as a real draw does.
   * @param {object} state Colosseum state.
   * @param {object} t {id, name, size, entrantKeys, beltId} — entrantKeys may
   *   include '$player'.
   * @param {object} playerProxy {level, members} for the player's party.
   * @param {object} cfg Rating config.
   * @returns {object} The active tournament record (also stored on state).
   */
  Engine.buildBracket = function (state, t, playerProxy, cfg) {
    Engine.assertId(t.id);
    const size = t.size | 0;
    const keys = t.entrantKeys.slice(0, size);
    const seeded = keys.map(function (k) {
      const src = k === '$player' ? playerProxy : state.rivals[k];
      if (!src) throw new Error('Colosseum: unknown entrant "' + k + '"');
      return { key: k, rating: Engine.rating(src, cfg) };
    }).sort(function (a, b) { return b.rating - a.rating; });

    const order = Engine.seedOrder(size);
    const slots = order.map(function (seedNo) {
      return seedNo <= seeded.length
        ? { key: seeded[seedNo - 1].key, seed: seedNo, rating: seeded[seedNo - 1].rating }
        : null; // bye
    });

    const rounds = [];
    let matchCount = size / 2;
    for (let r = 0; matchCount >= 1; r++, matchCount /= 2) {
      const ms = [];
      for (let m = 0; m < matchCount; m++) {
        ms.push({ a: null, b: null, winner: null, resolved: false, byRating: null });
      }
      rounds.push(ms);
    }
    for (let i = 0; i < slots.length; i++) {
      const match = rounds[0][Math.floor(i / 2)];
      if (i % 2 === 0) match.a = slots[i]; else match.b = slots[i];
    }

    state.runNo += 1;
    state.active = {
      id: t.id,
      name: t.name || t.id,
      size: size,
      beltId: t.beltId || null,
      round: 0,
      rounds: rounds,
      champion: null,
      finishes: {}
    };
    Engine.resolveByes(state.active);
    return state.active;
  };

  /**
   * Auto-advances every round-0 match that has exactly one real participant.
   * A bye is not a result: no h2h is recorded and no rng is drawn.
   * @param {object} tour Active tournament.
   */
  Engine.resolveByes = function (tour) {
    const first = tour.rounds[0];
    for (let m = 0; m < first.length; m++) {
      const match = first[m];
      if (match.a && !match.b) { match.winner = 'a'; match.resolved = true; match.bye = true; }
      else if (!match.a && match.b) { match.winner = 'b'; match.resolved = true; match.bye = true; }
      if (match.resolved) Engine.pushWinner(tour, 0, m);
    }
  };

  /**
   * Copies a match's winner into its slot in the next round, or crowns the
   * champion if this was the final.
   * @param {object} tour Active tournament.
   * @param {number} round Round index.
   * @param {number} slot Match index within the round.
   */
  Engine.pushWinner = function (tour, round, slot) {
    const match = tour.rounds[round][slot];
    const winner = match.winner === 'a' ? match.a : match.b;
    if (round + 1 >= tour.rounds.length) {
      tour.champion = winner ? winner.key : null;
      return;
    }
    const next = tour.rounds[round + 1][Math.floor(slot / 2)];
    if (slot % 2 === 0) next.a = winner; else next.b = winner;
  };

  /**
   * Resolves one NPC-vs-NPC match deterministically. Refuses to simulate the
   * player — that is the whole point of the design: the player's matches are
   * fought, never rolled.
   * @param {object} state Colosseum state.
   * @param {number} round Round index.
   * @param {number} slot Match index.
   * @param {object} cfg {upsetSlope}
   * @returns {object} The resolved match.
   */
  Engine.resolveMatch = function (state, round, slot, cfg) {
    const tour = state.active;
    if (!tour) throw new Error('Colosseum: no active tournament');
    const match = tour.rounds[round][slot];
    if (match.resolved) return match;
    if (!match.a || !match.b) throw new Error('Colosseum: match not yet populated');
    if (match.a.key === '$player' || match.b.key === '$player') {
      throw new Error('Colosseum: the player is never simulated — fight the match');
    }
    const pA = Engine.winChance(match.a.rating, match.b.rating,
      cfg && cfg.upsetSlope !== undefined ? cfg.upsetSlope : 4);
    const roll = Engine.matchRng(state, tour.id, round, slot)();
    match.winner = roll < pA ? 'a' : 'b';
    match.byRating = match.a.rating >= match.b.rating ? 'a' : 'b';
    match.resolved = true;
    Engine.recordResult(state, match, round);
    Engine.pushWinner(tour, round, slot);
    return match;
  };

  /**
   * Records a fought result reported from the real battle system for the
   * player's current match.
   * @param {object} state Colosseum state.
   * @param {number} round Round index.
   * @param {number} slot Match index.
   * @param {boolean} playerWon Outcome of the real battle.
   * @returns {object} The resolved match.
   */
  Engine.reportPlayerResult = function (state, round, slot, playerWon) {
    const tour = state.active;
    if (!tour) throw new Error('Colosseum: no active tournament');
    const match = tour.rounds[round][slot];
    if (!match.a || !match.b) throw new Error('Colosseum: match not yet populated');
    const playerSide = match.a.key === '$player' ? 'a' : match.b.key === '$player' ? 'b' : null;
    if (!playerSide) throw new Error('Colosseum: player is not in this match');
    match.winner = playerWon ? playerSide : (playerSide === 'a' ? 'b' : 'a');
    match.resolved = true;
    Engine.recordResult(state, match, round);
    Engine.pushWinner(tour, round, slot);
    Engine.advanceRound(state);
    return match;
  };

  /**
   * Updates W/L records (rival AND player), head-to-head memory and
   * elimination finishes for a resolved match. Bye matches never reach here.
   * @param {object} state Colosseum state.
   * @param {object} match Resolved match.
   * @param {number} round Round index.
   */
  Engine.recordResult = function (state, match, round) {
    const winner = match.winner === 'a' ? match.a : match.b;
    const loser = match.winner === 'a' ? match.b : match.a;
    if (state.rivals[winner.key]) state.rivals[winner.key].wins += 1;
    if (state.rivals[loser.key]) state.rivals[loser.key].losses += 1;
    if (winner.key === '$player') state.player.wins += 1;
    if (loser.key === '$player') state.player.losses += 1;
    const h2hKey = 'k:' + winner.key + '>' + loser.key;
    state.h2h[h2hKey] = (state.h2h[h2hKey] || 0) + 1;
    state.active.finishes[loser.key] = round;
  };

  /**
   * Advances the round pointer when the current round is fully resolved.
   * Shared by the NPC path and the fought-battle path so neither can strand
   * a bracket — the player's match being the last of the round advanced
   * nothing before this existed.
   * @param {object} state Colosseum state.
   * @returns {boolean} True if the pointer moved.
   */
  Engine.advanceRound = function (state) {
    const tour = state.active;
    if (!tour || tour.champion) return false;
    if (Engine.roundComplete(tour, tour.round) && tour.round + 1 < tour.rounds.length) {
      tour.round += 1;
      return true;
    }
    return false;
  };

  /**
   * Tournament place implied by falling in a given round: losing the final of
   * an 8-bracket is 2nd, the semis 3rd, the quarters 5th — the standard
   * shared-place convention. The champion is 1st.
   * @param {object} tour Tournament (needs rounds.length).
   * @param {number} finishRound Round index the entrant lost in.
   * @returns {number} Place, 1-based.
   */
  Engine.finishPlace = function (tour, finishRound) {
    return Math.pow(2, tour.rounds.length - 1 - finishRound) + 1;
  };

  /**
   * True when every match of the given round is resolved.
   * @param {object} tour Active tournament.
   * @param {number} round Round index.
   * @returns {boolean} Complete.
   */
  Engine.roundComplete = function (tour, round) {
    const ms = tour.rounds[round];
    for (let i = 0; i < ms.length; i++) if (!ms[i].resolved) return false;
    return true;
  };

  /**
   * Resolves every NPC-vs-NPC match in the current round, skipping the
   * player's, then advances the round pointer once the round is complete.
   * @param {object} state Colosseum state.
   * @param {object} cfg {upsetSlope}
   * @returns {number} Matches resolved by this call.
   */
  Engine.resolveNpcRound = function (state, cfg) {
    const tour = state.active;
    if (!tour) throw new Error('Colosseum: no active tournament');
    let n = 0;
    const ms = tour.rounds[tour.round];
    for (let i = 0; i < ms.length; i++) {
      const m = ms[i];
      if (m.resolved || !m.a || !m.b) continue;
      if (m.a.key === '$player' || m.b.key === '$player') continue;
      Engine.resolveMatch(state, tour.round, i, cfg);
      n += 1;
    }
    Engine.advanceRound(state);
    return n;
  };

  /**
   * The player's pending match in the current round, or null.
   * @param {object} state Colosseum state.
   * @returns {?{round: number, slot: number, match: object}} Address, or null.
   */
  Engine.playerMatch = function (state) {
    const tour = state.active;
    if (!tour || tour.champion) return null;
    const ms = tour.rounds[tour.round];
    for (let i = 0; i < ms.length; i++) {
      const m = ms[i];
      if (m.resolved || !m.a || !m.b) continue;
      if (m.a.key === '$player' || m.b.key === '$player') {
        return { round: tour.round, slot: i, match: m };
      }
    }
    return null;
  };

  /**
   * Concludes a finished tournament: belt transfer, titles, history entry.
   * @param {object} state Colosseum state.
   * @returns {?object} The history entry, or null if not finished.
   */
  Engine.concludeTournament = function (state) {
    const tour = state.active;
    if (!tour || !tour.champion) return null;
    if (tour.beltId && state.belts[tour.beltId]) {
      const belt = state.belts[tour.beltId];
      belt.reigns.push({ holder: tour.champion, season: state.seasonNo, tournament: tour.id });
      belt.holder = tour.champion;
    }
    if (state.rivals[tour.champion]) state.rivals[tour.champion].titles += 1;
    if (tour.champion === '$player') state.player.titles += 1;

    // Best finishes: the champion took 1st; every loser took the place their
    // elimination round implies. bestFinish is a career stat the dossier
    // renders ("Best: runner-up, season 2"), so lower is better and null
    // means never entered.
    const noteFinish = function (rec, place) {
      if (rec && (rec.bestFinish === null || place < rec.bestFinish)) rec.bestFinish = place;
    };
    noteFinish(tour.champion === '$player' ? state.player : state.rivals[tour.champion], 1);
    for (const key in tour.finishes) {
      if (!Object.prototype.hasOwnProperty.call(tour.finishes, key)) continue;
      const place = Engine.finishPlace(tour, tour.finishes[key]);
      noteFinish(key === '$player' ? state.player : state.rivals[key], place);
    }

    const entry = {
      tournament: tour.id,
      name: tour.name,
      size: tour.size,
      season: state.seasonNo,
      champion: tour.champion,
      beltId: tour.beltId,
      finishes: tour.finishes,
      rounds: tour.rounds
    };
    state.history.push(entry);
    // The bracket scene renders the LAST completed tournament when nothing is
    // live, so recent entries keep their full rounds. Older entries drop them
    // — a long game enters hundreds of tournaments and a save file is not an
    // archive. Champion and finishes stay forever; they are what the dossier
    // and standings read.
    for (let i = 0; i < state.history.length - 3; i++) {
      if (state.history[i].rounds) delete state.history[i].rounds;
    }
    state.active = null;
    state.pendingMatch = null;
    return entry;
  };

  /**
   * Hands a belt to a holder outside tournament flow, for scripted moments —
   * a story usurper, a stripped title, a commissioner's decision.
   * @param {object} state Colosseum state.
   * @param {string} beltId Belt id.
   * @param {string} holder Rival id or '$player'.
   * @returns {?object} The belt, or null if unknown.
   */
  Engine.awardBelt = function (state, beltId, holder) {
    const belt = state.belts[beltId];
    if (!belt) return null;
    belt.reigns.push({ holder: holder, season: state.seasonNo, tournament: null });
    belt.holder = holder;
    return belt;
  };

  /**
   * Closes a season: the counter rises. Rival training toward the player is
   * the caller's move (levelRivals with phase 'season') — the model never
   * reaches into the engine to ask what level the party is.
   * @param {object} state Colosseum state.
   * @returns {number} The new season number.
   */
  Engine.advanceSeason = function (state) {
    state.seasonNo += 1;
    return state.seasonNo;
  };

  /* ------------------------------------------------------------ levelling */

  /**
   * Temperament table. offset is where the rival wants to sit RELATIVE TO THE
   * PLAYER's mean level; pace is how much of the gap one training event
   * closes (scaled by the phase); wobble is a deterministic swing applied on
   * top, volatile only.
   *
   * PROBE-TUNED — balance_probe.js question 3 re-measures drift whenever
   * these change. Do not retune by eye. MEASURED 2026-08-11, 5 seasons of
   * (3 rounds + 1 season event), all rivals base 10:
   *   player +4/season → 30:  steady 19.0 · hungry 25.2 · volatile 23.8
   *   player +2/season → 20:  steady 13.6 · hungry 18.1 · volatile 17.3
   *   player stalled at 10:   steady 10.0 · hungry 11.0 · volatile 12.7
   * Rubber band holds at both extremes: a stalled player never meets a wall
   * (worst creep +2.7 over five idle seasons), a racing player is tracked
   * but not caught, and troop scaling keeps the trailing fights honest.
   */
  const TEMPERAMENT = {
    steady: { offset: -2, pace: 0.5, wobble: 0 },
    hungry: { offset: 1, pace: 1.0, wobble: 0 },
    volatile: { offset: 0, pace: 0.75, wobble: 2.5 }
  };

  /** Fraction of the level gap one BETWEEN-ROUNDS training event closes. */
  const ROUND_LEVEL_SCALE = 0.12;
  /** Fraction of the level gap one BETWEEN-SEASONS training block closes. */
  const SEASON_LEVEL_SCALE = 0.55;

  /**
   * Levels every rival toward the player-party mean, each through its
   * temperament. The rubber band this implements is the product's central
   * balance promise: a season-3 bracket is never a walkover and never a wall.
   *
   * Two deliberate asymmetries, both there for believability:
   * - Gap-seeking only ever pulls UP. A champion does not forget how to
   *   fight because the player stopped grinding: when the target is below a
   *   rival they hold, whatever their temperament. (The first draft let
   *   volatile drift downward; against a low-level player the huge negative
   *   drift swamped the wobble, the base floor pinned the level, and
   *   volatile silently degraded to steady. The suite caught it.)
   * - volatile rivals swing around whatever they hold — the wobble is
   *   two-way but never carries them below their authored base level.
   *
   * Levels are kept fractional internally so slow drift accumulates instead
   * of rounding to zero forever; display code rounds.
   *
   * Deterministic: the wobble draw is keyed on (world seed, rival id,
   * lvlTick), and lvlTick lives in the save — a reloaded save trains the
   * same rivals to the same levels.
   *
   * @param {object} state Colosseum state.
   * @param {number} playerMean Mean level of the player's party.
   * @param {string} phase 'round' or 'season'.
   * @returns {void}
   */
  Engine.levelRivals = function (state, playerMean, phase) {
    const scale = phase === 'season' ? SEASON_LEVEL_SCALE : ROUND_LEVEL_SCALE;
    state.lvlTick += 1;
    for (const id in state.rivals) {
      if (!Object.prototype.hasOwnProperty.call(state.rivals, id)) continue;
      const r = state.rivals[id];
      const t = TEMPERAMENT[r.temperament] || TEMPERAMENT.steady;
      const target = playerMean + t.offset;
      let drift = (target - r.level) * scale * t.pace;
      if (drift < 0) drift = 0;
      let wobble = 0;
      if (t.wobble > 0) {
        const roll = Engine.mulberry32(
          Engine.hashString(state.seed + '|lvl|' + id + '|' + state.lvlTick))();
        wobble = (roll * 2 - 1) * t.wobble * scale;
      }
      const floor = Math.max(1, r.base || 1);
      r.level = Math.min(99, Math.max(floor, r.level + drift + wobble));
    }
  };

  /**
   * Stat multiplier for a rival's troop in the battle the player actually
   * fights. This is what makes "rivals level between rounds" a fact of the
   * fight rather than a number on a menu: the troop is authored once at the
   * rival's base level, and every level gained since scales it.
   * @param {object} rival Rival record.
   * @param {number} perLevel Multiplier gained per level above base (param).
   * @returns {number} Multiplier, >= a floor of 0.1.
   */
  Engine.levelScale = function (rival, perLevel) {
    if (!rival || !perLevel) return 1;
    return Math.max(0.1, 1 + (rival.level - rival.base) * perLevel);
  };

  /* ------------------------------------------------------------- rewards */

  /**
   * Gold for winning a given round. Geometric: the purse doubles (by
   * default) every round, so the final is worth the whole early bracket —
   * which is also the anti-grind shape, since re-running a repeatable
   * tournament's early rounds pays least.
   * @param {number} base Gold for a round-0 win.
   * @param {number} growth Multiplier per round.
   * @param {number} round Round index (0-based).
   * @returns {number} Gold, integer.
   */
  Engine.roundReward = function (base, growth, round) {
    if (!base || base <= 0) return 0;
    const g = growth && growth > 0 ? growth : 2;
    return Math.round(base * Math.pow(g, round));
  };

  /* ----------------------------------------------------------- standings */

  /**
   * Career standings, sorted for the season table: titles, then wins, then
   * win rate. Includes the player as key '$player'.
   * @param {object} state Colosseum state.
   * @returns {object[]} Rows: {key, name, wins, losses, titles, bestFinish, level}.
   */
  Engine.standings = function (state) {
    const rows = [];
    for (const id in state.rivals) {
      if (!Object.prototype.hasOwnProperty.call(state.rivals, id)) continue;
      const r = state.rivals[id];
      rows.push({ key: r.id, name: r.name, wins: r.wins, losses: r.losses,
        titles: r.titles, bestFinish: r.bestFinish, level: Math.round(r.level) });
    }
    const p = state.player;
    rows.push({ key: '$player', name: '$player', wins: p.wins, losses: p.losses,
      titles: p.titles, bestFinish: p.bestFinish, level: null });
    rows.sort(function (a, b) {
      if (b.titles !== a.titles) return b.titles - a.titles;
      if (b.wins !== a.wins) return b.wins - a.wins;
      const ra = a.wins + a.losses > 0 ? a.wins / (a.wins + a.losses) : 0;
      const rb = b.wins + b.losses > 0 ? b.wins / (b.wins + b.losses) : 0;
      return rb - ra;
    });
    return rows;
  };

  /**
   * Weight-class check. Blank or zero bounds disable that side — and blank
   * arrived as '' through the Plugin Manager, which Number() turns into 0,
   * which is why 0 and "no limit" are deliberately the same value here (§16:
   * blank is absent, never a real zero).
   * @param {number} mean Mean party level.
   * @param {number} minLevel Floor, 0 disables.
   * @param {number} maxLevel Ceiling, 0 disables.
   * @returns {boolean} Admitted.
   */
  Engine.checkWeight = function (mean, minLevel, maxLevel) {
    if (minLevel > 0 && mean < minLevel) return false;
    if (maxLevel > 0 && mean > maxLevel) return false;
    return true;
  };

  /* -------------------------------------------------- engine binding (MZ) */

  // In Node (the headless suite) PluginManager does not exist: export the
  // pure engine and stop. A green suite is then a claim about the bytes a
  // buyer receives, not about a copy that can drift from them.
  if (typeof module !== 'undefined' && typeof PluginManager === 'undefined') {
    module.exports = Engine;
    return;
  }

  const PLUGIN = 'ColosseumCore';
  window.CSAF_Colosseum = Engine;

  /* ------------------------------------------------------ parameter parse */

  const rawParams = PluginManager.parameters(PLUGIN);

  /**
   * Numeric field with a fallback. Plugin parameters arrive as STRINGS, and
   * Number('') is 0 rather than NaN — a blank field silently becoming a real
   * zero is the exact failure §16 exists for. Blank is absent, never zero.
   * @param {*} raw Raw string value.
   * @param {number} fallback Used when blank or unparseable.
   * @returns {number} Parsed number.
   */
  function numField(raw, fallback) {
    if (raw === undefined || raw === null || String(raw).trim() === '') return fallback;
    const n = Number(raw);
    return isFinite(n) ? n : fallback;
  }

  /**
   * Parses a struct<T>[] parameter, which is DOUBLE-encoded: a JSON array
   * whose elements are themselves JSON strings, every leaf a string even
   * where the struct declared @type number (§16). A malformed element is
   * skipped with a console error naming its index — fail toward reporting.
   * @param {string} raw The parameter value.
   * @param {string} name Parameter name, for the error message.
   * @returns {object[]} Parsed structs (leaves still strings).
   */
  function parseStructArray(raw, name) {
    if (!raw || !String(raw).trim()) return [];
    let outer;
    try { outer = JSON.parse(raw); } catch (e) {
      console.error('ColosseumCore: parameter "' + name + '" is not valid JSON'); return [];
    }
    if (!Array.isArray(outer)) return [];
    const out = [];
    for (let i = 0; i < outer.length; i++) {
      try { out.push(JSON.parse(outer[i])); } catch (e) {
        console.error('ColosseumCore: "' + name + '" entry ' + (i + 1) + ' is malformed and was skipped');
      }
    }
    return out;
  }

  /**
   * Parses a string[] leaf INSIDE a struct — one more layer of the same
   * encoding: the struct's field is a JSON string of an array of strings.
   * @param {string} raw Field value.
   * @returns {string[]} Values.
   */
  function parseStringArray(raw) {
    if (!raw || !String(raw).trim()) return [];
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.map(String) : [];
    } catch (e) { return []; }
  }

  const CFG = {
    worldSeed: String(rawParams.worldSeed === undefined || String(rawParams.worldSeed).trim() === ''
      ? 'sand-and-glory' : rawParams.worldSeed),
    upsetSlope: numField(rawParams.upsetSlope, 4),
    ratingPerLevel: numField(rawParams.ratingPerLevel, 10),
    ratingPerMember: numField(rawParams.ratingPerMember, 6),
    npcScalePerLevel: numField(rawParams.npcScalePerLevel, 0.04)
  };

  /* ------------------------------------------------------------- the ink kit
   *
   * ONE visual language, defined once, used by every scene this product ships.
   *
   * Why it lives in Core rather than in each scene: the palette is a BUYER
   * setting. Two scenes carrying their own copies of "brass" is a promise that
   * they will drift the first time someone restyles one of them — and a
   * championship whose bracket and ledger disagree about the colour of brass
   * looks broken in a way no test would ever catch.
   *
   * Nothing in here runs per frame. Every one of these functions is called
   * while a bitmap is being baked, which happens at scene create or when the
   * player presses a key; the gate's per-frame proxies (draw calls, texture
   * uploads, bitmap dirties) are what hold that line.
   *
   * Scenes read this LAZILY — inside create(), never at load time. Plugin load
   * order is the buyer's choice, and a `typeof` test at load is a coin flip
   * that silently no-ops the whole look when it loses.
   */

  const PALETTE = {
    slate: String(rawParams.slate || '#16120f'),
    brass: String(rawParams.brass || '#b08d4a'),
    parchment: String(rawParams.parchment || '#d9c69a'),
    blood: String(rawParams.blood || '#8e2f23'),
    gold: String(rawParams.gold || '#e3b544')
  };

  // No font FILE ships with this plugin. Redistributing a typeface is a licence
  // problem a plugin has no business handing its buyer, and MZ's default face
  // is the single loudest "this is RPG Maker" signal a screenshot can carry —
  // so the ledger voice comes from these stacks plus wide tracked caps.
  const FONT_HEAD = 'Constantia,"Palatino Linotype","Book Antiqua",Palatino,Georgia,serif';
  const FONT_NUM = 'Consolas,"Andale Mono","DejaVu Sans Mono",monospace';

  /**
   * Sets a type style on a bitmap's 2D context.
   * @param {Bitmap} bitmap Target.
   * @param {string} face Font stack.
   * @param {number} size Pixel size.
   * @param {string} colour CSS colour.
   * @param {number} [alpha] Global alpha, default 1.
   * @returns {void}
   */
  function setType(bitmap, face, size, colour, alpha) {
    const ctx = bitmap.context;
    ctx.font = size + 'px ' + face;
    ctx.fillStyle = colour;
    ctx.strokeStyle = colour;
    ctx.globalAlpha = alpha === undefined ? 1 : alpha;
    ctx.textBaseline = 'top';
  }

  /**
   * Draws text glyph by glyph with explicit tracking. Canvas has no
   * letter-spacing in the PIXI 5 era, and wide tracking is most of what
   * separates an engraved label from a default one.
   * @param {Bitmap} bitmap Target.
   * @param {string} text Text.
   * @param {number} x Left edge.
   * @param {number} y Top edge.
   * @param {number} tracking Extra pixels between glyphs.
   * @returns {number} Width drawn.
   */
  function drawTracked(bitmap, text, x, y, tracking) {
    const ctx = bitmap.context;
    let cursor = x;
    const s = String(text);
    for (let i = 0; i < s.length; i++) {
      ctx.fillText(s.charAt(i), cursor, y);
      cursor += ctx.measureText(s.charAt(i)).width + tracking;
    }
    bitmap._baseTexture.update();
    return cursor - x - tracking;
  }

  /**
   * Measures what drawTracked would draw, in the bitmap's current type state.
   * @param {Bitmap} bitmap Target.
   * @param {string} text Text.
   * @param {number} tracking Tracking.
   * @returns {number} Width.
   */
  function measureTracked(bitmap, text, tracking) {
    const ctx = bitmap.context;
    let w = 0;
    const s = String(text);
    for (let i = 0; i < s.length; i++) w += ctx.measureText(s.charAt(i)).width + tracking;
    return Math.max(0, w - tracking);
  }

  /**
   * Chooses the largest listed type size that fits, then gives up tracking,
   * and only then truncates — WITH a mark. "DAGEN THE AN" chopped mid-word
   * reads as a rendering bug; "DAGEN THE ANV·" reads as a ledger running out
   * of column, which is what it is.
   * @param {Bitmap} bitmap Target, for measurement.
   * @param {string} face Font stack.
   * @param {string} text Text.
   * @param {number} maxW Available width.
   * @param {number[]} sizes Sizes to try, largest first.
   * @param {number[]} tracks Tracking to try alongside each size.
   * @param {string} colour Ink colour (measurement needs the type set).
   * @returns {{size: number, track: number, text: string}} What to draw.
   */
  function fitTracked(bitmap, face, text, maxW, sizes, tracks, colour) {
    const label = String(text);
    for (let i = 0; i < sizes.length; i++) {
      const track = tracks[i] === undefined ? tracks[tracks.length - 1] : tracks[i];
      setType(bitmap, face, sizes[i], colour);
      if (measureTracked(bitmap, label, track) <= maxW) {
        return { size: sizes[i], track: track, text: label };
      }
    }
    const size = sizes[sizes.length - 1];
    const track = tracks[tracks.length - 1];
    setType(bitmap, face, size, colour);
    let cut = label;
    while (cut.length > 2 && measureTracked(bitmap, cut + '·', track) > maxW) cut = cut.slice(0, -1);
    return { size: size, track: track, text: cut.replace(/\s+$/, '') + '·' };
  }

  /**
   * Rounded-rect path. The radius is clamped at zero because MZ asks for
   * degenerate sub-2px layouts while it settles, and arcTo THROWS on a
   * negative radius — which kills the whole Scene.create with no clue why.
   * @param {CanvasRenderingContext2D} ctx Context.
   * @param {number} x Left.
   * @param {number} y Top.
   * @param {number} w Width.
   * @param {number} h Height.
   * @param {number} r Corner radius.
   * @returns {void}
   */
  function rr(ctx, x, y, w, h, r) {
    const rad = Math.max(0, Math.min(r, w / 2, h / 2));
    if (w <= 0 || h <= 0) return;
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  /**
   * Cubic ease-out. Every reveal in this product uses it, so they share a feel.
   * @param {number} t 0..1.
   * @returns {number} Eased 0..1.
   */
  function easeOut(t) {
    const u = 1 - t;
    return 1 - u * u * u;
  }

  /**
   * Paints the ground every colosseum screen stands on: slate, a warm floor
   * gradient so it is never one flat value, and the engraver's double rule.
   * Shared rather than copied — the ground is the most visible thing the two
   * scenes have in common, and two copies of it is two chances to drift.
   * @param {Bitmap} bitmap Full-screen bitmap.
   * @returns {void}
   */
  function paintGround(bitmap) {
    const ctx = bitmap.context;
    ctx.fillStyle = PALETTE.slate;
    ctx.fillRect(0, 0, bitmap.width, bitmap.height);
    const g = ctx.createLinearGradient(0, 0, 0, bitmap.height);
    g.addColorStop(0, 'rgba(255,235,200,0.030)');
    g.addColorStop(0.55, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(255,180,110,0.050)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, bitmap.width, bitmap.height);
    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = PALETTE.brass;
    ctx.lineWidth = 2;
    ctx.strokeRect(14.5, 14.5, bitmap.width - 29, bitmap.height - 29);
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1;
    ctx.strokeRect(20.5, 20.5, bitmap.width - 41, bitmap.height - 41);
    ctx.globalAlpha = 1;
    bitmap._baseTexture.update();
  }

  /**
   * Stone grain, vignette and the slow breath of lamplight — the one effect
   * stock MZ cannot produce, and deliberately QUIET: the noise is STATIC
   * (animated grain wrecks a GIF palette and this wing has shipped a 21 MB
   * store GIF that way) and only the light level breathes.
   */
  const GRAIN_FRAG = [
    'precision mediump float;',
    'varying vec2 vTextureCoord;',
    'uniform sampler2D uSampler;',
    'uniform float uTime;',
    '',
    'float rand(vec2 c){ return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453); }',
    '',
    // Smoothly interpolated value noise — a raw floored hash at low frequency
    // renders as a checkerboard that reads as JPEG blocking.
    'float vnoise(vec2 p){',
    '  vec2 i = floor(p); vec2 f = fract(p);',
    '  f = f * f * (3.0 - 2.0 * f);',
    '  float a = rand(i);',
    '  float b = rand(i + vec2(1.0, 0.0));',
    '  float c = rand(i + vec2(0.0, 1.0));',
    '  float d = rand(i + vec2(1.0, 1.0));',
    '  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
    '}',
    '',
    'void main(void) {',
    '  vec2 uv = vTextureCoord;',
    '  vec4 base = texture2D(uSampler, uv);',
    '  vec3 col = base.rgb;',
    '',
    '  float fib = rand(floor(uv * vec2(1400.0, 1000.0)));',
    '  col *= 0.966 + 0.040 * fib;',
    '  col *= 0.950 + 0.070 * vnoise(uv * vec2(19.0, 13.0));',
    '',
    '  float breath = 0.5 + 0.5 * sin(uTime * 0.9);',
    '  vec2 lampC = uv - vec2(0.30, 0.72);',
    '  float lamp = 1.0 - smoothstep(0.0, 0.9, dot(lampC, lampC) * 2.2);',
    '  col += vec3(0.055, 0.038, 0.012) * lamp * (0.55 + 0.45 * breath);',
    '',
    '  vec2 c = uv - vec2(0.5);',
    '  float r2 = dot(c, c);',
    '  col *= 1.0 - smoothstep(0.14, 0.85, r2) * 0.66;',
    '  gl_FragColor = vec4(col, base.a);',
    '}'
  ].join('\n');

  /** Heraldic tinctures for generated crests. Muted enough to sit under brass. */
  const TINCTURE = ['#5a2f2a', '#2f4a52', '#46355e', '#37512f', '#6a5220', '#5a3550'];

  /**
   * Draws a heraldic crest derived entirely from a fighter's key, so every
   * rival a buyer invents gets a distinct shield with no art to supply. Same
   * key, same crest, on every machine — it runs through the product's seeded
   * hash, never Math.random.
   *
   * Lives HERE, in the shared ink kit, so the season ledger's dossier and the
   * championship board's chips draw the SAME crest by construction rather
   * than by two copies agreeing (wing rule: prefer the shape where one path
   * calls the other). Moved from ColosseumSeason.js 2026-08-17 when the
   * bracket gained crests; the Season scene now delegates to this.
   *
   * @param {Bitmap} b Target bitmap.
   * @param {string} key Fighter key ('$player' gets the gold-on-umber livery).
   * @param {number} x Left.
   * @param {number} y Top.
   * @param {number} size Shield width. Height is size * 1.15.
   * @returns {void}
   */
  function drawCrest(b, key, x, y, size) {
    const ctx = b.context;
    const hash = Engine.hashString('crest|' + key);
    const isPlayer = key === '$player';
    const w = size;
    const h = size * 1.15;

    ctx.save();
    ctx.translate(x, y);

    // Heater shield outline: square shoulders falling to a point.
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, h * 0.52);
    ctx.quadraticCurveTo(w, h * 0.88, w / 2, h);
    ctx.quadraticCurveTo(0, h * 0.88, 0, h * 0.52);
    ctx.closePath();
    ctx.save();
    ctx.clip();

    const field = TINCTURE[hash % TINCTURE.length];
    let second = TINCTURE[(hash >>> 3) % TINCTURE.length];
    // On a collision, step off the FIELD's index — guaranteed different. The
    // form `hash >>> 3 + 1` parses as `hash >>> 4` (shift binds looser than +)
    // and could re-collide, leaving the division invisible.
    if (second === field) second = TINCTURE[(hash % TINCTURE.length + 1) % TINCTURE.length];
    ctx.fillStyle = isPlayer ? '#4a3a16' : field;
    ctx.fillRect(0, 0, w, h);

    // Division of the field: per pale, per fess, per bend, or plain.
    const division = (hash >>> 6) & 3;
    ctx.fillStyle = isPlayer ? '#5e4a1c' : second;
    if (division === 0) {
      ctx.fillRect(w / 2, 0, w / 2, h);
    } else if (division === 1) {
      ctx.fillRect(0, h / 2, w, h / 2);
    } else if (division === 2) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
    }

    // The charge.
    const charge = (hash >>> 9) & 3;
    ctx.fillStyle = isPlayer ? PALETTE.gold : PALETTE.parchment;
    ctx.globalAlpha = 0.92;
    if (charge === 0) {
      // Chevron.
      ctx.beginPath();
      ctx.moveTo(w * 0.12, h * 0.62);
      ctx.lineTo(w * 0.5, h * 0.26);
      ctx.lineTo(w * 0.88, h * 0.62);
      ctx.lineTo(w * 0.72, h * 0.62);
      ctx.lineTo(w * 0.5, h * 0.42);
      ctx.lineTo(w * 0.28, h * 0.62);
      ctx.closePath();
      ctx.fill();
    } else if (charge === 1) {
      // Lozenge.
      ctx.save();
      ctx.translate(w / 2, h * 0.46);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-w * 0.19, -w * 0.19, w * 0.38, w * 0.38);
      ctx.restore();
    } else if (charge === 2) {
      // Three bars.
      for (let i = 0; i < 3; i++) ctx.fillRect(w * 0.16, h * (0.26 + i * 0.16), w * 0.68, h * 0.07);
    } else {
      // A four-point mullet — a star with straight rays.
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.18);
      ctx.lineTo(w * 0.60, h * 0.40);
      ctx.lineTo(w * 0.82, h * 0.48);
      ctx.lineTo(w * 0.60, h * 0.56);
      ctx.lineTo(w * 0.5, h * 0.78);
      ctx.lineTo(w * 0.40, h * 0.56);
      ctx.lineTo(w * 0.18, h * 0.48);
      ctx.lineTo(w * 0.40, h * 0.40);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // Brass edge over the clip, so the shield reads as struck metal.
    ctx.lineWidth = 2;
    ctx.strokeStyle = isPlayer ? PALETTE.gold : PALETTE.brass;
    ctx.stroke();
    ctx.restore();
  }

  window.CSAF_ColosseumInk = {
    palette: PALETTE,
    FONT_HEAD: FONT_HEAD,
    FONT_NUM: FONT_NUM,
    setType: setType,
    drawTracked: drawTracked,
    measureTracked: measureTracked,
    fitTracked: fitTracked,
    rr: rr,
    easeOut: easeOut,
    paintGround: paintGround,
    drawCrest: drawCrest,
    GRAIN_FRAG: GRAIN_FRAG
  };

  const DEFS = {
    tournaments: parseStructArray(rawParams.tournaments, 'tournaments').map(function (t) {
      return {
        id: String(t.id || 'main'),
        name: String(t.name || t.id || 'Tournament'),
        size: numField(t.size, 8),
        entrantKeys: parseStringArray(t.entrants),
        minLevel: numField(t.minLevel, 0),
        maxLevel: numField(t.maxLevel, 0),
        beltId: String(t.beltId || '') || null,
        rewardBase: numField(t.rewardBase, 200),
        rewardGrowth: numField(t.rewardGrowth, 2)
      };
    }),
    rivals: parseStructArray(rawParams.rivals, 'rivals').map(function (r) {
      return {
        id: String(r.id || ''),
        name: String(r.name || r.id || ''),
        faceName: String(r.faceName || ''),
        faceIndex: numField(r.faceIndex, 0),
        troopId: numField(r.troopId, 0),
        baseLevel: numField(r.baseLevel, 10),
        members: numField(r.members, 3),
        temperament: String(r.temperament || 'steady')
      };
    }),
    belts: parseStructArray(rawParams.belts, 'belts').map(function (b) {
      return { id: String(b.id || ''), name: String(b.name || b.id || ''), holder: String(b.holder || '') || null };
    })
  };

  /* -------------------------------------------------------- save integration
   *
   * The persisted record is `$gameSystem._csafColosseum`, plain data only.
   *
   * ⚠️ There is deliberately NO live-wrapper object and therefore no
   * non-enumerable runtime slot (wing §13). §13's pattern exists to hide a
   * live cache from JsonEx; this model has no cache to hide — every Engine
   * function is stateless over the plain record, nothing runs per frame, and
   * ratings are computed at bracket build. The safest wrapper is the one that
   * does not exist: there is nothing here for JsonEx.makeDeepCopy to
   * double-serialise, on any path, including ones that do not exist yet.
   */

  /**
   * Registers every Plugin-Manager rival and belt that the save does not
   * already know. Idempotent — an existing record keeps its levels, W/L and
   * memory — so a buyer can add rivals mid-project and old saves gain them
   * without losing anything.
   * @param {object} st Colosseum state.
   * @returns {void}
   */
  function syncDefs(st) {
    for (let i = 0; i < DEFS.rivals.length; i++) {
      if (DEFS.rivals[i].id) Engine.defineRival(st, DEFS.rivals[i]);
    }
    for (let i = 0; i < DEFS.belts.length; i++) {
      if (DEFS.belts[i].id) Engine.defineBelt(st, DEFS.belts[i]);
    }
  }

  /**
   * The colosseum state for the current save, created and synced on first
   * touch. Covers all three entry paths: new game (initialize hook), loaded
   * save (onAfterLoad hook), and a save made before this plugin was
   * installed (the create-if-missing branch here).
   * @returns {?object} State, or null before $gameSystem exists.
   */
  function colosseumState() {
    if (!$gameSystem) return null;
    if (!$gameSystem._csafColosseum) {
      $gameSystem._csafColosseum = Engine.createState(CFG.worldSeed);
      syncDefs($gameSystem._csafColosseum);
    }
    return $gameSystem._csafColosseum;
  }

  Object.defineProperty(window, '$gameColosseum', {
    get: colosseumState,
    configurable: true
  });

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this._csafColosseum = Engine.createState(CFG.worldSeed);
    syncDefs(this._csafColosseum);
  };

  const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function () {
    _Game_System_onAfterLoad.call(this);
    if (this._csafColosseum) {
      Engine.migrate(this._csafColosseum);
      syncDefs(this._csafColosseum);
    }
  };

  /* ------------------------------------------------------- party utilities */

  /**
   * Mean level of the battle party — the number the weight class admits and
   * the rubber band chases.
   * @returns {number} Mean level, >= 1.
   */
  function partyMeanLevel() {
    const members = $gameParty.battleMembers();
    if (!members.length) return 1;
    let sum = 0;
    for (let i = 0; i < members.length; i++) sum += members[i].level;
    return sum / members.length;
  }

  /** @returns {object} The player's rating proxy for seeding. */
  function playerProxy() {
    return { level: partyMeanLevel(), members: $gameParty.battleMembers().length };
  }

  /* --------------------------------------------------------- battle wiring */

  /**
   * Stat scale applied to enemies while a colosseum match battle is live.
   * Set at battle start, cleared when the result lands. Module-level rather
   * than saved: stock MZ cannot save mid-battle, and an abandoned battle
   * (window closed) leaves the match unresolved, which re-fights it cleanly.
   */
  let activeEnemyScale = 1;

  const _Game_Enemy_paramBase = Game_Enemy.prototype.paramBase;
  Game_Enemy.prototype.paramBase = function (paramId) {
    const base = _Game_Enemy_paramBase.call(this, paramId);
    return activeEnemyScale === 1 ? base : base * activeEnemyScale;
  };

  /**
   * The rival opposite the player in a pending match, or null.
   * @param {object} st Colosseum state.
   * @param {object} pm playerMatch() result.
   * @returns {?object} Rival record.
   */
  function opponentOf(st, pm) {
    const key = pm.match.a.key === '$player' ? pm.match.b.key : pm.match.a.key;
    return st.rivals[key] || null;
  }

  /**
   * Applies everything that follows a fought result: record it, pay the
   * purse, train the rivals if the round turned, conclude if it crowned.
   * @param {object} st Colosseum state.
   * @param {{round: number, slot: number}} adr Match address.
   * @param {boolean} playerWon Outcome.
   * @returns {void}
   */
  function settlePlayerResult(st, adr, playerWon) {
    const def = tournamentDef(st.active && st.active.id);
    const roundBefore = st.active.round;
    Engine.reportPlayerResult(st, adr.round, adr.slot, playerWon);
    if (playerWon && def) {
      const gold = Engine.roundReward(def.rewardBase, def.rewardGrowth, adr.round);
      if (gold > 0) $gameParty.gainGold(gold);
    }
    if (st.active && st.active.round !== roundBefore) {
      Engine.levelRivals(st, partyMeanLevel(), 'round');
    }
    if (st.active && st.active.champion) Engine.concludeTournament(st);
  }

  /**
   * Tournament definition by id, or null.
   * @param {?string} id Tournament id.
   * @returns {?object} Definition from the Plugin Manager.
   */
  function tournamentDef(id) {
    for (let i = 0; i < DEFS.tournaments.length; i++) {
      if (DEFS.tournaments[i].id === id) return DEFS.tournaments[i];
    }
    return null;
  }

  /* ------------------------------------------------------- plugin commands */

  PluginManager.registerCommand(PLUGIN, 'openBracket', function (args) {
    if (window.Scene_ColosseumBracket) {
      SceneManager.push(window.Scene_ColosseumBracket);
      SceneManager.prepareNextScene(String(args.tournamentId || ''));
    } else {
      console.warn('ColosseumCore: ColosseumBracket.js is not enabled — the bracket scene ships in it');
    }
  });

  PluginManager.registerCommand(PLUGIN, 'openSeason', function () {
    if (window.Scene_ColosseumSeason) {
      SceneManager.push(window.Scene_ColosseumSeason);
    } else {
      console.warn('ColosseumCore: ColosseumSeason.js is not enabled — the season scene ships in it');
    }
  });

  PluginManager.registerCommand(PLUGIN, 'enterTournament', function (args) {
    const st = colosseumState();
    const def = tournamentDef(String(args.tournamentId || 'main'));
    if (!def) {
      console.error('ColosseumCore: no tournament "' + args.tournamentId + '" in the Tournaments parameter');
      return;
    }
    if (!Engine.checkWeight(partyMeanLevel(), def.minLevel, def.maxLevel)) {
      console.warn('ColosseumCore: party is outside the weight class of "' + def.id + '"');
      return;
    }
    try {
      Engine.buildBracket(st, def, playerProxy(), CFG);
    } catch (e) {
      console.error('ColosseumCore: ' + e.message);
    }
  });

  PluginManager.registerCommand(PLUGIN, 'startPlayerMatch', function () {
    const st = colosseumState();
    const pm = Engine.playerMatch(st);
    if (!pm || $gameParty.inBattle()) return;
    const rival = opponentOf(st, pm);
    if (!rival || !rival.troopId || !$dataTroops[rival.troopId]) {
      console.error('ColosseumCore: opponent has no valid troop to fight');
      return;
    }
    st.pendingMatch = { round: pm.round, slot: pm.slot };
    activeEnemyScale = Engine.levelScale(rival, CFG.npcScalePerLevel);
    BattleManager.setup(rival.troopId, false, true);
    BattleManager.setEventCallback(function (result) {
      // endBattle result codes, verified against rmmz_managers.js: 0 win,
      // 1 abort/escape, 2 defeat. Escape is disabled at setup, but an Abort
      // Battle event command still produces 1 — the match stays unresolved
      // and can be re-fought, which is the only honest reading of an abort.
      activeEnemyScale = 1;
      const st2 = colosseumState();
      if (!st2 || !st2.pendingMatch || !st2.active) return;
      const adr = st2.pendingMatch;
      st2.pendingMatch = null;
      if (result === 1) return;
      settlePlayerResult(st2, adr, result === 0);
    });
    // command301 does this unconditionally, but events only ever run on a
    // map. This command can legitimately fire from a context no map has
    // loaded in (a title-screen custom menu), where $dataMap is still null
    // and encounterStep would throw. Found in-engine, 2026-08-11.
    if ($dataMap) $gamePlayer.makeEncounterCount();
    SceneManager.push(Scene_Battle);
  });

  PluginManager.registerCommand(PLUGIN, 'resolveNpcRound', function () {
    const st = colosseumState();
    if (!st.active) return;
    const roundBefore = st.active.round;
    Engine.resolveNpcRound(st, CFG);
    if (st.active && st.active.round !== roundBefore) {
      Engine.levelRivals(st, partyMeanLevel(), 'round');
    }
    if (st.active && st.active.champion) Engine.concludeTournament(st);
  });

  PluginManager.registerCommand(PLUGIN, 'simulateToPlayer', function () {
    const st = colosseumState();
    let guard = 0;
    while (st.active && !st.active.champion && guard++ < 16) {
      // Resolve the round's rival matches FIRST, then look for the player's.
      // The first draft checked the player first and fast-forwarded NOTHING
      // whenever the player's match came up early in the round — found
      // in-engine: seed 8 meets seed 1 in match 0, so "simulate to my fight"
      // did zero work exactly when the player was the underdog.
      const roundBefore = st.active.round;
      const n = Engine.resolveNpcRound(st, CFG);
      if (st.active.round !== roundBefore) Engine.levelRivals(st, partyMeanLevel(), 'round');
      if (Engine.playerMatch(st)) break;
      if (n === 0 && st.active.round === roundBefore) break;
    }
    if (st.active && st.active.champion) Engine.concludeTournament(st);
  });

  PluginManager.registerCommand(PLUGIN, 'advanceSeason', function () {
    const st = colosseumState();
    Engine.advanceSeason(st);
    Engine.levelRivals(st, partyMeanLevel(), 'season');
  });

  PluginManager.registerCommand(PLUGIN, 'awardBelt', function (args) {
    const st = colosseumState();
    if (!Engine.awardBelt(st, String(args.beltId || ''), String(args.holder || '$player'))) {
      console.error('ColosseumCore: no belt "' + args.beltId + '" in the Belts parameter');
    }
  });

  PluginManager.registerCommand(PLUGIN, 'exportStanding', function (args) {
    const st = colosseumState();
    const varId = numField(args.variableId, 0);
    if (varId <= 0) return;
    // 1 = champion, 2/3/5/9 = eliminated at that place, 0 = still competing
    // (or never entered). Documented in the Readme; 0 lets an event ask
    // "is the run still alive?" with a single condition.
    let place = 0;
    const tour = st.active ||
      (st.history.length ? st.history[st.history.length - 1] : null);
    if (tour) {
      if (tour.champion === '$player') place = 1;
      else if (tour.finishes && tour.finishes.$player !== undefined) {
        place = Engine.finishPlace(tour, tour.finishes.$player);
      }
    }
    $gameVariables.setValue(varId, place);
  });

})();
