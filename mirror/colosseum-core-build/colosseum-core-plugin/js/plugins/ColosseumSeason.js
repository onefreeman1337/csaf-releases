//=============================================================================
// ColosseumSeason.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [v1.0.0] The ledger. Season standings and a dossier on every rival — record, form, level against yours, and what they did to you last time. Requires ColosseumCore.
 * @author CSAF — Corey & Stephanie's Asset Factory
 * @url https://csaf.itch.io/colosseum-core
 * @base ColosseumCore
 * @orderAfter ColosseumCore
 *
 * @param showGrain
 * @text Grain and lamplight shader
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Stone grain, vignette and the slow breath of torchlight. Turn off on very low-end hardware.
 * @default true
 *
 * @param rowSeconds
 * @text Seconds per row
 * @type number
 * @decimals 2
 * @min 0.00
 * @max 1.00
 * @desc How long each standings row takes to slide into the ledger when it opens. 0 shows the table instantly.
 * @default 0.06
 *
 * @param showForm
 * @text Show the form guide
 * @type boolean
 * @on Show
 * @off Hide
 * @desc The row of win/loss pips from each fighter's recent matches. Hide it if your tournaments are one-offs.
 * @default true
 *
 * @help
 * ============================================================================
 * The ledger
 * ============================================================================
 * Open it with the Open the season table plugin command.
 *
 * LEFT — the season table. Every fighter in your colosseum, sorted by titles,
 * then wins, then win rate, with the player's party in among them. Each row
 * carries a win-rate bar, a form guide of recent results, the fighter's
 * current level and their record.
 *
 * RIGHT — the dossier on whoever is selected. Their crest, their temperament,
 * their level measured against your party's, your head-to-head record, what
 * happened the last time you met, their best finish, and the belt they hold.
 *
 * Move with the up and down arrows (or the mouse wheel), leave with cancel.
 *
 * NOTHING HERE IS AN RPG MAKER WINDOW
 * -----------------------------------
 * No Window_Base, no windowskin, no default font. Every mark is drawn into a
 * Bitmap once and animated by moving sprites, so the ledger costs almost
 * nothing per frame however long your roster gets: only the rows you can see
 * are ever drawn.
 *
 * CRESTS ARE GENERATED, NOT DRAWN BY YOU
 * --------------------------------------
 * Each fighter's crest is derived from their id, so every rival you invent
 * gets a distinct heraldic shield with no art to supply and no file to ship.
 * The same id always produces the same crest, on every machine.
 *
 * COLOURS LIVE IN ColosseumCore
 * -----------------------------
 * Slate, brass, parchment, crimson and gold are set once in ColosseumCore's
 * parameters and shared by every colosseum screen.
 *
 * Requires ColosseumCore. Put ColosseumCore ABOVE this file in the Plugin
 * Manager.
 * ============================================================================
 * Terms
 * ============================================================================
 * One licence per developer. Use it in as many of your own games as you like,
 * commercial or free. Edit it freely. Do not resell or redistribute the plugin
 * itself. Credit is welcome and not required.
 */

(function () {
  'use strict';

  if (typeof PluginManager === 'undefined') return;

  var params = PluginManager.parameters('ColosseumSeason');

  var CFG = {
    showGrain: params.showGrain !== 'false',
    showForm: params.showForm !== 'false',
    // Blank arrives as '' and Number('') is 0, which is a legal value here
    // (instant table). isFinite is what separates blank-means-default from a
    // deliberate zero, so this cannot silently become the wing's §16 bug.
    rowSeconds: isFinite(Number(params.rowSeconds)) && String(params.rowSeconds).trim() !== ''
      ? Math.max(0, Math.min(1, Number(params.rowSeconds))) : 0.06
  };

  // The shared drawing kit and palette, both owned by ColosseumCore, resolved
  // in create() and never at load time — plugin order is the buyer's choice.
  var K = null;
  var C = null;

  /* ------------------------------------------------------------ geometry */

  var L = {
    tableX: 30, tableY: 124, tableW: 428, rowH: 47, rows: 8,
    railX: 466,
    dossX: 478, dossY: 104, dossW: 308, dossH: 420
  };

  /* ------------------------------------------------------------ helpers */

  /**
   * The place a finishing position is called by.
   * @param {?number} place 1-based place, or null for never entered.
   * @returns {string} A word a ledger would print.
   */
  function placeWord(place) {
    if (place === null || place === undefined) return 'NEVER ENTERED';
    if (place === 1) return 'CHAMPION';
    if (place === 2) return 'RUNNER-UP';
    if (place === 3) return 'SEMIFINALIST';
    if (place === 5) return 'QUARTERFINALIST';
    if (place === 9) return 'LAST SIXTEEN';
    return 'PLACED ' + place;
  }

  /**
   * What a round is called, counted back from the final so the same index
   * means different things in a 4 and a 16 bracket.
   * @param {number} round Round index, 0-based.
   * @param {number} total Number of rounds.
   * @returns {string} Round name.
   */
  function roundWord(round, total) {
    var back = total - 1 - round;
    if (back === 0) return 'THE FINAL';
    if (back === 1) return 'THE SEMIFINAL';
    if (back === 2) return 'THE QUARTERFINAL';
    if (back === 3) return 'THE LAST SIXTEEN';
    return 'ROUND ' + (round + 1);
  }

  /**
   * Every tournament that still carries its rounds, newest first: the live one
   * if there is one, then history backwards. Older history entries drop their
   * rounds to keep a save file from becoming an archive, so this is the whole
   * of what can be read match by match.
   * @param {object} state Colosseum state.
   * @returns {object[]} Tournaments with rounds.
   */
  function playedTournaments(state) {
    var out = [];
    if (state.active && state.active.rounds) out.push(state.active);
    for (var i = state.history.length - 1; i >= 0; i--) {
      if (state.history[i].rounds) out.push(state.history[i]);
    }
    return out;
  }

  /* ========================================================================
   * Scene_ColosseumSeason
   * ====================================================================== */

  /**
   * The ledger: season standings beside a dossier.
   *
   * PERFORMANCE SHAPE, DELIBERATE, and the same one the bracket uses. Bitmaps
   * are baked when something changes — scene create, a selection move, a
   * scroll — never per frame. Per frame the scene writes sprite properties
   * and one shader uniform, so the gate's per-frame counts hold whatever the
   * roster size.
   *
   * VIRTUALISED. Only the rows that fit on screen have sprites, and a row is
   * baked the first time it is scrolled into view and cached from then on. A
   * 200-fighter roster costs exactly what an 8-fighter roster costs to show.
   *
   * @constructor
   */
  function Scene_ColosseumSeason() {
    this.initialize.apply(this, arguments);
  }

  Scene_ColosseumSeason.prototype = Object.create(Scene_Base.prototype);
  Scene_ColosseumSeason.prototype.constructor = Scene_ColosseumSeason;

  /** @returns {void} */
  Scene_ColosseumSeason.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
    this._time = 0;
    this._index = 0;        // selected standings row
    this._top = 0;          // first visible standings row
    this._rows = [];        // standings data
    this._rowSprites = [];  // one per VISIBLE slot, re-pointed on scroll
    this._bars = [];        // win-rate bars, one per visible slot
    this._rowCache = [];    // baked row bitmaps by standings index
    this._dossierCache = [];
    this._bakedRows = 0;    // proof of virtualisation, read by the suite
    this._bakedDossiers = 0;
    this._cursor = null;
    this._cursorY = 0;
    this._dossier = null;
    this._dossierT = 1;
    this._pulseSprites = [];
    this._empty = false;
  };

  /** @returns {void} */
  Scene_ColosseumSeason.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    K = window.CSAF_ColosseumInk;
    if (!K) {
      console.error('ColosseumSeason: ColosseumCore is not enabled — the ledger needs its palette and drawing kit');
      return;
    }
    C = K.palette;
    this._state = window.$gameColosseum || null;
    this._engine = window.CSAF_Colosseum || null;
    this._rows = this.readStandings();
    this._empty = this._rows.length <= 1 &&
      (!this._state || !this._state.history || this._state.history.length === 0);

    this.createGround();
    this.createCartouche();
    this.createBeltRail();
    if (this._empty) {
      this.createEmptyCard();
    } else {
      this.createColumnHeads();
      this.createRowSprites();
      this.createCursor();
      this.createRail();
      this.createDossierSprite();
      this.select(0);
    }
    this.createFooter();
    this.createShader();
  };

  /**
   * Career standings, with the player's row given the party leader's name so
   * the table reads as people rather than as keys.
   * @returns {object[]} Rows.
   */
  Scene_ColosseumSeason.prototype.readStandings = function () {
    if (!this._state || !this._engine) return [];
    var rows = this._engine.standings(this._state);
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].key === '$player') {
        rows[i].name = ($gameParty && $gameParty.leader()) ? $gameParty.leader().name() : 'YOUR PARTY';
        rows[i].level = Math.round(this.partyMean());
      }
    }
    return rows;
  };

  /**
   * Mean level of the battle party — the number the dossier measures a rival
   * against, and the one the rubber band chases.
   * @returns {number} Mean level, at least 1.
   */
  Scene_ColosseumSeason.prototype.partyMean = function () {
    if (!$gameParty) return 1;
    var members = $gameParty.battleMembers();
    if (!members.length) return 1;
    var sum = 0;
    for (var i = 0; i < members.length; i++) sum += members[i].level;
    return sum / members.length;
  };

  /* --------------------------------------------------------- furniture */

  /** @returns {void} */
  Scene_ColosseumSeason.prototype.createGround = function () {
    var b = new Bitmap(Graphics.width, Graphics.height);
    K.paintGround(b);
    this.addChild(new Sprite(b));
  };

  /** Title cartouche: the ledger and its season. @returns {void} */
  Scene_ColosseumSeason.prototype.createCartouche = function () {
    var b = new Bitmap(430, 74);
    var season = this._state ? this._state.seasonNo : 1;
    K.setType(b, K.FONT_HEAD, 27, C.parchment);
    var w = K.drawTracked(b, 'THE LEDGER', 8, 8, 6);
    K.setType(b, K.FONT_NUM, 12, C.brass, 0.95);
    K.drawTracked(b, 'SEASON ' + season + ' · CAREER STANDINGS', 10, 46, 3);
    var ctx = b.context;
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = C.brass;
    ctx.fillRect(8, 40, Math.max(w, 200), 2);
    ctx.globalAlpha = 0.4;
    ctx.fillRect(8, 43, Math.max(w, 200) * 0.62, 1);
    ctx.globalAlpha = 1;
    b._baseTexture.update();
    var s = new Sprite(b);
    s.x = L.tableX;
    s.y = 26;
    this.addChild(s);
  };

  /**
   * Every belt and who holds it, top right. This is the one place in the
   * product that shows the whole title picture at once.
   * @returns {void}
   */
  Scene_ColosseumSeason.prototype.createBeltRail = function () {
    if (!this._state) return;
    var ids = [];
    for (var id in this._state.belts) {
      if (Object.prototype.hasOwnProperty.call(this._state.belts, id)) ids.push(id);
    }
    if (!ids.length) return;
    var shown = Math.min(ids.length, 2);
    var w = L.dossW;
    var rowH = 30;
    var b = new Bitmap(w, shown * rowH + 8);
    for (var i = 0; i < shown; i++) {
      var belt = this._state.belts[ids[i]];
      var y = i * rowH;
      var holder = this.displayName(belt.holder);
      var held = !!belt.holder;
      // A belt glyph: a buckle bar with a stud, drawn rather than written.
      var ctx = b.context;
      ctx.globalAlpha = held ? 1 : 0.45;
      ctx.fillStyle = held ? C.gold : C.brass;
      ctx.fillRect(0, y + 11, 18, 7);
      ctx.fillStyle = C.slate;
      ctx.fillRect(6, y + 13, 3, 3);
      ctx.globalAlpha = 1;
      K.setType(b, K.FONT_NUM, 10, C.brass, 0.9);
      K.drawTracked(b, String(belt.name).toUpperCase(), 26, y + 2, 2.5);
      K.setType(b, K.FONT_HEAD, 14, held ? C.gold : '#6f6153');
      var fit = K.fitTracked(b, K.FONT_HEAD, held ? holder.toUpperCase() : 'VACANT',
        w - 30, [14, 12.5, 11], [1.2, 0.8, 0.6], held ? C.gold : '#6f6153');
      K.setType(b, K.FONT_HEAD, fit.size, held ? C.gold : '#6f6153');
      K.drawTracked(b, fit.text, 26, y + 14, fit.track);
    }
    b._baseTexture.update();
    var s = new Sprite(b);
    s.x = L.dossX;
    s.y = 30;
    this.addChild(s);
  };

  /** Column heads over the table. @returns {void} */
  Scene_ColosseumSeason.prototype.createColumnHeads = function () {
    var b = new Bitmap(L.tableW, 18);
    K.setType(b, K.FONT_NUM, 10, C.brass, 0.7);
    K.drawTracked(b, 'POS', 8, 3, 2.5);
    K.drawTracked(b, 'FIGHTER', 44, 3, 2.5);
    if (CFG.showForm) K.drawTracked(b, 'FORM', 250, 3, 2.5);
    K.drawTracked(b, 'LV', 330, 3, 2.5);
    K.drawTracked(b, 'W–L', 374, 3, 2.5);
    var ctx = b.context;
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = C.brass;
    ctx.fillRect(0, 16, L.tableW, 1);
    ctx.globalAlpha = 1;
    b._baseTexture.update();
    var s = new Sprite(b);
    s.x = L.tableX;
    s.y = L.tableY - 22;
    this.addChild(s);
  };

  /** The footer hint line. @returns {void} */
  Scene_ColosseumSeason.prototype.createFooter = function () {
    var b = new Bitmap(420, 20);
    K.setType(b, K.FONT_NUM, 10, C.brass, 0.6);
    K.drawTracked(b, this._empty ? 'ESC  LEAVE' : '↑ ↓  SELECT A FIGHTER      ESC  LEAVE', 0, 4, 2.5);
    b._baseTexture.update();
    var s = new Sprite(b);
    s.x = L.tableX;
    s.y = Graphics.height - 46;
    this.addChild(s);
  };

  /* ------------------------------------------------------------- rows */

  /**
   * One sprite per VISIBLE slot, plus one growth bar each. Nothing here scales
   * with the roster: scrolling re-points these same sprites at other bitmaps.
   * @returns {void}
   */
  Scene_ColosseumSeason.prototype.createRowSprites = function () {
    var visible = Math.min(L.rows, this._rows.length);
    var barTex = new Bitmap(2, 2);
    barTex.fillAll(C.gold);
    var lossTex = new Bitmap(2, 2);
    lossTex.fillAll(C.blood);
    this._barTex = barTex;
    this._lossTex = lossTex;
    for (var i = 0; i < visible; i++) {
      var sp = new Sprite(this.rowBitmap(i));
      sp.x = L.tableX;
      sp.y = L.tableY + i * L.rowH;
      sp.alpha = 0;
      this.addChild(sp);
      this._rowSprites.push(sp);

      var bar = new Sprite(barTex);
      bar.x = L.tableX + 44;
      bar.y = L.tableY + i * L.rowH + 33;
      bar.scale.x = 0;
      bar.scale.y = 2.5;
      this.addChild(bar);
      this._bars.push({ sprite: bar, full: 0, t0: 0 });
    }
    this.refitBars();
  };

  /**
   * Recomputes every visible bar's target width and reveal time from the rows
   * now on screen. Called on create and on every scroll — never per frame.
   * @returns {void}
   */
  Scene_ColosseumSeason.prototype.refitBars = function () {
    for (var i = 0; i < this._bars.length; i++) {
      var row = this._rows[this._top + i];
      var played = row ? row.wins + row.losses : 0;
      var rate = played > 0 ? row.wins / played : 0;
      var bar = this._bars[i];
      bar.full = Math.max(0, (rate * 188) / 2);
      bar.t0 = 0.12 + i * CFG.rowSeconds;
      bar.sprite.scale.x = 0;
      // A losing record is crimson, a winning one gold: the bar says which
      // before any number is read.
      bar.sprite.bitmap = rate >= 0.5 ? this._barTex : this._lossTex;
    }
  };

  /**
   * The baked bitmap for a standings row, from cache or freshly drawn.
   * @param {number} index Standings index.
   * @returns {Bitmap} Row bitmap.
   */
  Scene_ColosseumSeason.prototype.rowBitmap = function (index) {
    if (this._rowCache[index]) return this._rowCache[index];
    var b = this.bakeRow(index);
    this._rowCache[index] = b;
    this._bakedRows += 1;
    return b;
  };

  /**
   * Draws one standings row: position disc, name, title marks, the win-rate
   * bar's track, the form guide, level and record.
   * @param {number} index Standings index.
   * @returns {Bitmap} The row.
   */
  Scene_ColosseumSeason.prototype.bakeRow = function (index) {
    var row = this._rows[index];
    var w = L.tableW;
    var h = L.rowH;
    var b = new Bitmap(w, h);
    var ctx = b.context;
    var isPlayer = row.key === '$player';
    var ink = isPlayer ? C.gold : C.parchment;

    // Row ground: a hairline rule and a faint plate, so the table has weight
    // without becoming a grid of boxes.
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = isPlayer ? C.gold : '#ffffff';
    ctx.fillRect(0, 1, w, h - 3);
    ctx.globalAlpha = 0.30;
    ctx.fillStyle = C.brass;
    ctx.fillRect(0, h - 1, w, 1);
    ctx.globalAlpha = 1;

    // Position disc.
    ctx.beginPath();
    ctx.arc(20, 20, 11, 0, Math.PI * 2);
    ctx.fillStyle = index === 0 ? C.gold : '#2a2117';
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = isPlayer ? C.gold : C.brass;
    ctx.stroke();
    K.setType(b, K.FONT_NUM, 12, index === 0 ? C.slate : C.brass);
    var pos = String(index + 1);
    ctx.fillText(pos, 20 - ctx.measureText(pos).width / 2, 14);

    // Name, tracked caps.
    var fit = K.fitTracked(b, K.FONT_HEAD, String(row.name).toUpperCase(), 168,
      [16, 14, 12.5], [1.4, 1, 0.8], ink);
    K.setType(b, K.FONT_HEAD, fit.size, ink);
    var nameW = K.drawTracked(b, fit.text, 44, 6, fit.track);

    // Titles as small gold lozenges after the name — a count you can see
    // without reading it.
    var titles = Math.min(row.titles || 0, 5);
    for (var t = 0; t < titles; t++) {
      var cx = 44 + nameW + 10 + t * 11;
      ctx.save();
      ctx.translate(cx, 14);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = C.gold;
      ctx.fillRect(-3.5, -3.5, 7, 7);
      ctx.restore();
    }

    // Win-rate bar track, with the tick that marks an even record. The filled
    // part of this bar is a separate sprite so it can grow.
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#000000';
    ctx.fillRect(44, 33, 188, 5);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = C.brass;
    ctx.fillRect(44 + 94, 31, 1, 9);
    ctx.globalAlpha = 1;

    if (CFG.showForm) this.drawForm(b, row.key, 250, 14);

    // Level and record.
    K.setType(b, K.FONT_NUM, 13, C.brass);
    K.drawTracked(b, row.level === null ? '—' : String(row.level), 330, 12, 1);
    K.setType(b, K.FONT_NUM, 13, ink, 0.95);
    K.drawTracked(b, row.wins + '–' + row.losses, 374, 12, 1);

    b._baseTexture.update();
    return b;
  };

  /**
   * The form guide: pips for the fighter's most recent results, oldest on the
   * left. A win is a filled gold pip, a loss a hollow crimson one.
   * @param {Bitmap} b Target row bitmap.
   * @param {string} key Fighter key.
   * @param {number} x Left edge.
   * @param {number} y Centre line.
   * @returns {void}
   */
  Scene_ColosseumSeason.prototype.drawForm = function (b, key, x, y) {
    var form = this.formOf(key);
    var ctx = b.context;
    if (!form.length) {
      K.setType(b, K.FONT_NUM, 10, C.brass, 0.4);
      K.drawTracked(b, '—', x, y - 6, 1);
      return;
    }
    for (var i = 0; i < form.length; i++) {
      var cx = x + i * 14;
      if (form[i]) {
        ctx.fillStyle = C.gold;
        ctx.fillRect(cx, y - 5, 10, 10);
      } else {
        ctx.strokeStyle = C.blood;
        ctx.lineWidth = 1.6;
        ctx.strokeRect(cx + 0.5, y - 4.5, 9, 9);
      }
    }
  };

  /**
   * Recent results for a fighter, oldest first, at most five. Read out of the
   * tournaments that still carry their rounds — which is what "form" means.
   * @param {string} key Fighter key.
   * @returns {boolean[]} True for a win.
   */
  Scene_ColosseumSeason.prototype.formOf = function (key) {
    var out = [];
    if (!this._state) return out;
    var tours = playedTournaments(this._state);
    for (var i = 0; i < tours.length && out.length < 5; i++) {
      var rounds = tours[i].rounds;
      for (var r = rounds.length - 1; r >= 0 && out.length < 5; r--) {
        for (var m = 0; m < rounds[r].length && out.length < 5; m++) {
          var match = rounds[r][m];
          if (!match.resolved || match.bye || !match.a || !match.b) continue;
          var isA = match.a.key === key;
          var isB = match.b.key === key;
          if (!isA && !isB) continue;
          out.push(match.winner === (isA ? 'a' : 'b'));
        }
      }
    }
    out.reverse();
    return out;
  };

  /**
   * The last time this fighter met the player, newest first.
   * @param {string} key Fighter key.
   * @returns {?object} {season, round, rounds, playerWon, name} or null.
   */
  Scene_ColosseumSeason.prototype.lastMeeting = function (key) {
    if (!this._state || key === '$player') return null;
    var tours = playedTournaments(this._state);
    for (var i = 0; i < tours.length; i++) {
      var tour = tours[i];
      for (var r = tour.rounds.length - 1; r >= 0; r--) {
        for (var m = 0; m < tour.rounds[r].length; m++) {
          var match = tour.rounds[r][m];
          if (!match.resolved || match.bye || !match.a || !match.b) continue;
          var keys = match.a.key + '|' + match.b.key;
          if (keys.indexOf(key) === -1 || keys.indexOf('$player') === -1) continue;
          var winner = match.winner === 'a' ? match.a.key : match.b.key;
          return {
            season: tour.season === undefined ? this._state.seasonNo : tour.season,
            round: r,
            rounds: tour.rounds.length,
            playerWon: winner === '$player',
            name: tour.name || tour.id
          };
        }
      }
    }
    return null;
  };

  /**
   * A fighter's display name.
   * @param {?string} key Fighter key, or null.
   * @returns {string} Name.
   */
  Scene_ColosseumSeason.prototype.displayName = function (key) {
    if (!key) return '';
    if (key === '$player') {
      return ($gameParty && $gameParty.leader()) ? $gameParty.leader().name() : 'YOUR PARTY';
    }
    var rec = this._state && this._state.rivals[key];
    return rec ? rec.name : key;
  };

  /* ----------------------------------------------------------- cursor */

  /** The selection cursor, which slides between rows. @returns {void} */
  Scene_ColosseumSeason.prototype.createCursor = function () {
    var b = new Bitmap(L.tableW, L.rowH);
    var ctx = b.context;
    K.rr(ctx, 0.5, 0.5, L.tableW - 1, L.rowH - 2, 4);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = C.gold;
    ctx.stroke();
    ctx.fillStyle = C.gold;
    ctx.fillRect(0, 2, 4, L.rowH - 5);
    b._baseTexture.update();
    var s = new Sprite(b);
    s.x = L.tableX;
    s.y = L.tableY;
    this.addChild(s);
    this._cursor = s;
    this._cursorY = L.tableY;
    this._pulseSprites.push(s);
  };

  /**
   * The scroll rail, drawn only when the roster overflows the table.
   * @returns {void}
   */
  Scene_ColosseumSeason.prototype.createRail = function () {
    if (this._rows.length <= L.rows) return;
    var h = L.rows * L.rowH;
    var track = new Bitmap(3, h);
    track.fillAll('rgba(176,141,74,0.25)');
    var ts = new Sprite(track);
    ts.x = L.railX;
    ts.y = L.tableY;
    this.addChild(ts);

    var thumbH = Math.max(24, Math.floor(h * L.rows / this._rows.length));
    var thumb = new Bitmap(3, thumbH);
    thumb.fillAll(C.brass);
    this._thumb = new Sprite(thumb);
    this._thumb.x = L.railX;
    this._thumb.y = L.tableY;
    this.addChild(this._thumb);
    this._thumbTravel = h - thumbH;
  };

  /* ---------------------------------------------------------- dossier */

  /** The dossier sprite, re-pointed as the selection moves. @returns {void} */
  Scene_ColosseumSeason.prototype.createDossierSprite = function () {
    var s = new Sprite(null);
    s.x = L.dossX;
    s.y = L.dossY;
    this.addChild(s);
    this._dossier = s;
  };

  /**
   * The baked dossier for a standings row, from cache or freshly drawn.
   * @param {number} index Standings index.
   * @returns {Bitmap} Dossier bitmap.
   */
  Scene_ColosseumSeason.prototype.dossierBitmap = function (index) {
    if (this._dossierCache[index]) return this._dossierCache[index];
    var b = this.bakeDossier(index);
    this._dossierCache[index] = b;
    this._bakedDossiers += 1;
    return b;
  };

  /**
   * Draws the dossier: crest, name, temperament, the level comparison, the
   * head-to-head, the last meeting, best finish and belt.
   * @param {number} index Standings index.
   * @returns {Bitmap} The dossier.
   */
  Scene_ColosseumSeason.prototype.bakeDossier = function (index) {
    var row = this._rows[index];
    var isPlayer = row.key === '$player';
    var rival = !isPlayer && this._state ? this._state.rivals[row.key] : null;
    var w = L.dossW;
    var h = L.dossH;
    var b = new Bitmap(w, h);
    var ctx = b.context;

    // Card.
    K.rr(ctx, 1, 1, w - 2, h - 2, 8);
    ctx.fillStyle = 'rgba(30,23,15,0.92)';
    ctx.fill();
    K.rr(ctx, 1, 1, w - 2, h - 2, 8);
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = C.brass;
    ctx.stroke();
    K.rr(ctx, 6, 6, w - 12, h - 12, 6);
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.30;
    ctx.stroke();
    ctx.globalAlpha = 1;

    this.drawCrest(b, row.key, 20, 20, 64);

    // Name and temperament.
    var ink = isPlayer ? C.gold : C.parchment;
    var fit = K.fitTracked(b, K.FONT_HEAD, String(row.name).toUpperCase(), w - 116,
      [20, 17, 15], [1.6, 1.2, 1], ink);
    K.setType(b, K.FONT_HEAD, fit.size, ink);
    K.drawTracked(b, fit.text, 98, 24, fit.track);
    K.setType(b, K.FONT_NUM, 10, C.brass, 0.9);
    K.drawTracked(b, isPlayer ? 'YOUR PARTY' : this.temperamentLine(rival), 98, 52, 2);
    K.setType(b, K.FONT_NUM, 10, C.brass, 0.7);
    K.drawTracked(b, 'BEST · ' + placeWord(row.bestFinish), 98, 68, 2);

    var y = 108;
    y = this.drawRule(b, y);

    // Level, as two bars rather than two numbers.
    var mean = Math.round(this.partyMean());
    var theirs = isPlayer ? this.fieldMean() : (row.level || 0);
    var label = isPlayer ? 'YOUR PARTY AGAINST THE FIELD' : 'LEVEL AGAINST YOUR PARTY';
    K.setType(b, K.FONT_NUM, 10, C.brass, 0.85);
    K.drawTracked(b, label, 20, y, 2.5);
    y += 20;
    var top = Math.max(1, Math.max(mean, theirs));
    y = this.drawMeterRow(b, y, isPlayer ? 'YOU' : 'THEM',
      isPlayer ? mean : theirs, top, isPlayer ? C.gold : C.brass);
    y = this.drawMeterRow(b, y, isPlayer ? 'FIELD' : 'YOU',
      isPlayer ? theirs : mean, top, isPlayer ? C.brass : C.gold);
    y += 6;
    y = this.drawRule(b, y);

    // Head to head.
    if (!isPlayer) {
      K.setType(b, K.FONT_NUM, 10, C.brass, 0.85);
      K.drawTracked(b, 'HEAD TO HEAD', 20, y, 2.5);
      y += 20;
      y = this.drawH2H(b, y, row.key);
      y += 8;
      var met = this.lastMeeting(row.key);
      K.setType(b, K.FONT_NUM, 10, C.brass, 0.85);
      K.drawTracked(b, 'LAST MET', 20, y, 2.5);
      y += 18;
      if (met) {
        K.setType(b, K.FONT_HEAD, 14, met.playerWon ? C.gold : C.blood);
        K.drawTracked(b, met.playerWon ? 'YOU BEAT THEM' : 'THEY BEAT YOU', 20, y, 1);
        y += 20;
        K.setType(b, K.FONT_NUM, 10, C.parchment, 0.75);
        K.drawTracked(b, 'SEASON ' + met.season + ' · ' + roundWord(met.round, met.rounds), 20, y, 1.5);
        y += 20;
      } else {
        K.setType(b, K.FONT_HEAD, 14, C.parchment, 0.55);
        K.drawTracked(b, 'NEVER MET', 20, y, 1);
        y += 26;
      }
      y = this.drawRule(b, y);
    }

    // Belts held.
    var belt = this.beltOf(row.key);
    if (belt) {
      ctx.fillStyle = C.gold;
      ctx.fillRect(20, y + 5, 18, 7);
      ctx.fillStyle = C.slate;
      ctx.fillRect(26, y + 7, 3, 3);
      K.setType(b, K.FONT_HEAD, 14, C.gold);
      var bf = K.fitTracked(b, K.FONT_HEAD, 'HOLDS ' + String(belt.name).toUpperCase(),
        w - 76, [14, 12.5, 11], [1, 0.8, 0.6], C.gold);
      K.setType(b, K.FONT_HEAD, bf.size, C.gold);
      K.drawTracked(b, bf.text, 46, y, bf.track);
      y += 20;
      K.setType(b, K.FONT_NUM, 10, C.brass, 0.8);
      K.drawTracked(b, this.reignLine(belt, row.key), 46, y, 1.5);
      y += 22;
    }

    // Career line, pinned to the foot of the card.
    var footY = h - 40;
    this.drawRule(b, footY - 12);
    K.setType(b, K.FONT_NUM, 11, C.parchment, 0.9);
    K.drawTracked(b, 'W ' + row.wins + '   L ' + row.losses + '   TITLES ' + (row.titles || 0),
      20, footY, 2);

    b._baseTexture.update();
    return b;
  };

  /**
   * A horizontal rule inside the dossier.
   * @param {Bitmap} b Target.
   * @param {number} y Top.
   * @returns {number} The y below the rule.
   */
  Scene_ColosseumSeason.prototype.drawRule = function (b, y) {
    var ctx = b.context;
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = C.brass;
    ctx.fillRect(20, y, L.dossW - 40, 1);
    ctx.globalAlpha = 1;
    return y + 14;
  };

  /**
   * One labelled meter: a number turned into a length, which is the whole
   * point of the comparison — a rival's level means nothing except beside
   * your own.
   * @param {Bitmap} b Target.
   * @param {number} y Top.
   * @param {string} label Left label.
   * @param {number} value Value.
   * @param {number} top Value that fills the bar.
   * @param {string} colour Bar colour.
   * @returns {number} The y below the meter.
   */
  Scene_ColosseumSeason.prototype.drawMeterRow = function (b, y, label, value, top, colour) {
    var ctx = b.context;
    K.setType(b, K.FONT_NUM, 10, C.parchment, 0.8);
    K.drawTracked(b, label, 20, y + 2, 1.5);
    var x = 66;
    var maxW = L.dossW - 66 - 44;
    ctx.globalAlpha = 0.30;
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, maxW, 12);
    ctx.globalAlpha = 1;
    var fill = top > 0 ? Math.max(2, Math.round(maxW * Math.min(1, value / top))) : 2;
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, fill, 12);
    K.setType(b, K.FONT_NUM, 12, colour);
    K.drawTracked(b, String(Math.round(value)), L.dossW - 40, y, 1);
    return y + 22;
  };

  /**
   * The head-to-head bar: your wins against theirs, as one divided line.
   * @param {Bitmap} b Target.
   * @param {number} y Top.
   * @param {string} key Rival key.
   * @returns {number} The y below.
   */
  Scene_ColosseumSeason.prototype.drawH2H = function (b, y, key) {
    var mine = this._state.h2h['k:$player>' + key] || 0;
    var theirs = this._state.h2h['k:' + key + '>$player'] || 0;
    var total = mine + theirs;
    var ctx = b.context;
    var x = 20;
    var w = L.dossW - 40;
    ctx.globalAlpha = 0.30;
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, w, 14);
    ctx.globalAlpha = 1;
    var mineW = total > 0 ? Math.round(w * mine / total) : 0;
    if (total > 0) {
      ctx.fillStyle = C.gold;
      ctx.fillRect(x, y, mineW, 14);
      ctx.fillStyle = C.blood;
      ctx.fillRect(x + mineW, y, w - mineW, 14);
    }
    // Each label is inked for the ground it actually sits on — a shutout fills
    // the whole bar with one colour, and parchment-on-gold is invisible (found
    // by looking at the frame, §9.5).
    var left = 'YOU ' + mine;
    K.setType(b, K.FONT_NUM, 11, C.parchment, 0.6);
    var leftOnGold = total > 0 && mineW >= K.measureTracked(b, left, 1) + 12;
    K.setType(b, K.FONT_NUM, 11, leftOnGold ? C.slate : C.parchment, total > 0 ? 1 : 0.6);
    K.drawTracked(b, left, x + 6, y + 2, 1);
    var right = 'THEM ' + theirs;
    var rightW = K.measureTracked(b, right, 1);
    var rightOnGold = total > 0 && x + w - rightW - 6 < x + mineW;
    K.setType(b, K.FONT_NUM, 11, rightOnGold ? C.slate : C.parchment, total > 0 ? 1 : 0.6);
    K.drawTracked(b, right, x + w - rightW - 6, y + 2, 1);
    return y + 24;
  };

  /**
   * The belt a fighter currently holds, if any.
   * @param {string} key Fighter key.
   * @returns {?object} Belt record.
   */
  Scene_ColosseumSeason.prototype.beltOf = function (key) {
    if (!this._state) return null;
    for (var id in this._state.belts) {
      if (!Object.prototype.hasOwnProperty.call(this._state.belts, id)) continue;
      if (this._state.belts[id].holder === key) return this._state.belts[id];
    }
    return null;
  };

  /**
   * How long a holder has held a belt, in reigns and since when.
   * @param {object} belt Belt record.
   * @param {string} key Holder key.
   * @returns {string} A ledger line.
   */
  Scene_ColosseumSeason.prototype.reignLine = function (belt, key) {
    var reigns = 0;
    var since = null;
    for (var i = 0; i < belt.reigns.length; i++) {
      if (belt.reigns[i].holder !== key) continue;
      reigns += 1;
      if (since === null || belt.reigns[i].season > since) since = belt.reigns[i].season;
    }
    if (!reigns) return 'AWARDED OUTSIDE THE BRACKET';
    var word = reigns === 1 ? '1 REIGN' : reigns + ' REIGNS';
    return since ? word + ' · SINCE SEASON ' + since : word + ' · FROM THE FIRST BELL';
  };

  /**
   * The temperament line, in the words the model actually behaves by.
   * @param {?object} rival Rival record.
   * @returns {string} Line.
   */
  Scene_ColosseumSeason.prototype.temperamentLine = function (rival) {
    var t = rival ? rival.temperament : 'steady';
    if (t === 'hungry') return 'HUNGRY · TRAINS PAST YOU';
    if (t === 'volatile') return 'VOLATILE · UNPREDICTABLE FORM';
    return 'STEADY · KEEPS PACE BEHIND YOU';
  };

  /**
   * Mean level of every rival — what the player's own dossier is measured
   * against, since a party has no rival record to compare with.
   * @returns {number} Mean level of the field.
   */
  Scene_ColosseumSeason.prototype.fieldMean = function () {
    if (!this._state) return 0;
    var sum = 0;
    var n = 0;
    for (var id in this._state.rivals) {
      if (!Object.prototype.hasOwnProperty.call(this._state.rivals, id)) continue;
      sum += this._state.rivals[id].level;
      n += 1;
    }
    return n ? Math.round(sum / n) : 0;
  };

  /* ------------------------------------------------------------ crests */

  /**
   * Draws a heraldic crest for a fighter. The drawing itself lives in the
   * shared ink kit (CSAF_ColosseumInk.drawCrest, ColosseumCore.js) since
   * 2026-08-17, when the championship board's chips gained crests too — one
   * routine, two scenes, agreement by construction rather than by two copies
   * staying in sync.
   * @param {Bitmap} b Target bitmap.
   * @param {string} key Fighter key.
   * @param {number} x Left.
   * @param {number} y Top.
   * @param {number} size Shield width.
   * @returns {void}
   */
  Scene_ColosseumSeason.prototype.drawCrest = function (b, key, x, y, size) {
    K.drawCrest(b, key, x, y, size);
  };

  /* --------------------------------------------------------- selection */

  /**
   * Selects a standings row, scrolling it into view and swapping the dossier.
   * Runs on a key press, never per frame.
   * @param {number} index Standings index.
   * @returns {void}
   */
  Scene_ColosseumSeason.prototype.select = function (index) {
    if (!this._rows.length) return;
    var i = index;
    if (i < 0) i = this._rows.length - 1;
    if (i >= this._rows.length) i = 0;
    this._index = i;
    var moved = false;
    if (i < this._top) {
      this._top = i;
      moved = true;
    } else if (i >= this._top + L.rows) {
      this._top = i - L.rows + 1;
      moved = true;
    }
    if (moved) this.refreshRows();
    this._dossier.bitmap = this.dossierBitmap(i);
    this._dossierT = 0;
  };

  /**
   * Re-points the visible row sprites after a scroll. Bounded by the number of
   * rows on screen, never by the roster — this is the virtualisation.
   * @returns {void}
   */
  Scene_ColosseumSeason.prototype.refreshRows = function () {
    for (var i = 0; i < this._rowSprites.length; i++) {
      var index = this._top + i;
      if (index < this._rows.length) {
        this._rowSprites[i].bitmap = this.rowBitmap(index);
        this._rowSprites[i].visible = true;
      } else {
        this._rowSprites[i].visible = false;
      }
    }
    this.refitBars();
    if (this._thumb && this._rows.length > L.rows) {
      this._thumb.y = L.tableY +
        Math.round(this._thumbTravel * this._top / (this._rows.length - L.rows));
    }
  };

  /* ------------------------------------------------------------- shader */

  /** @returns {void} */
  Scene_ColosseumSeason.prototype.createShader = function () {
    this._boardFilter = null;
    if (!CFG.showGrain || typeof PIXI === 'undefined' || !PIXI.Filter) return;
    try {
      this._boardFilter = new PIXI.Filter(undefined, K.GRAIN_FRAG, { uTime: 0 });
      this.filters = [this._boardFilter];
    } catch (e) {
      this._boardFilter = null;
    }
  };

  /* --------------------------------------------------------- empty state */

  /** The ledger with nothing in it — still the ledger. @returns {void} */
  Scene_ColosseumSeason.prototype.createEmptyCard = function () {
    var w = 460;
    var h = 120;
    var b = new Bitmap(w, h);
    var ctx = b.context;
    K.rr(ctx, 1, 1, w - 2, h - 2, 8);
    ctx.fillStyle = 'rgba(38,29,18,0.9)';
    ctx.fill();
    K.rr(ctx, 1, 1, w - 2, h - 2, 8);
    ctx.lineWidth = 2;
    ctx.strokeStyle = C.brass;
    ctx.stroke();
    K.setType(b, K.FONT_HEAD, 20, C.parchment);
    var title = 'THE LEDGER IS EMPTY';
    K.drawTracked(b, title, Math.floor((w - K.measureTracked(b, title, 3)) / 2), 28, 3);
    K.setType(b, K.FONT_NUM, 12, C.brass, 0.9);
    var hint = 'FIGHT A CHAMPIONSHIP AND THE NAMES APPEAR HERE';
    K.drawTracked(b, hint, Math.floor((w - K.measureTracked(b, hint, 2)) / 2), 68, 2);
    b._baseTexture.update();
    var s = new Sprite(b);
    s.x = (Graphics.width - w) / 2;
    s.y = (Graphics.height - h) / 2 - 10;
    this.addChild(s);
    this._pulseSprites.push(s);
  };

  /* ------------------------------------------------------------- update */

  /** @returns {void} */
  Scene_ColosseumSeason.prototype.update = function () {
    Scene_Base.prototype.update.call(this);
    this._time += 1 / 60;
    var t = this._time;

    // Rows slide in from the left, staggered down the table.
    var rows = this._rowSprites;
    for (var i = 0; i < rows.length; i++) {
      var k = (t - (0.10 + i * CFG.rowSeconds)) / 0.26;
      if (k <= 0) {
        rows[i].alpha = 0;
        continue;
      }
      if (k > 1) k = 1;
      var e = K.easeOut(k);
      rows[i].alpha = e;
      rows[i].x = L.tableX - 16 + 16 * e;
    }

    // Win-rate bars grow to their measured width.
    var bars = this._bars;
    for (var g = 0; g < bars.length; g++) {
      var bk = (t - bars[g].t0) / 0.45;
      if (bk <= 0) continue;
      if (bk > 1) bk = 1;
      bars[g].sprite.scale.x = K.easeOut(bk) * bars[g].full;
    }

    // The cursor eases toward the selected row rather than snapping.
    if (this._cursor) {
      var target = L.tableY + (this._index - this._top) * L.rowH;
      this._cursorY += (target - this._cursorY) * 0.35;
      this._cursor.y = this._cursorY;
    }

    // The dossier slides a few pixels as it changes, so a swap reads as a
    // page turning rather than as a redraw.
    if (this._dossier && this._dossierT < 1) {
      this._dossierT += 1 / 14;
      if (this._dossierT > 1) this._dossierT = 1;
      var d = K.easeOut(this._dossierT);
      this._dossier.alpha = d;
      this._dossier.x = L.dossX + 10 - 10 * d;
    }

    var pulse = 0.82 + 0.18 * Math.sin(t * 3.9);
    var ps = this._pulseSprites;
    for (var p = 0; p < ps.length; p++) ps[p].alpha = pulse;

    if (this._boardFilter) this._boardFilter.uniforms.uTime = t;

    this.processInput();
  };

  /** Arrow keys move the selection; cancel leaves. @returns {void} */
  Scene_ColosseumSeason.prototype.processInput = function () {
    if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
      SoundManager.playCancel();
      SceneManager.pop();
      return;
    }
    if (this._empty) return;
    if (Input.isRepeated('down')) {
      SoundManager.playCursor();
      this.select(this._index + 1);
    } else if (Input.isRepeated('up')) {
      SoundManager.playCursor();
      this.select(this._index - 1);
    } else if (Input.isTriggered('pagedown')) {
      SoundManager.playCursor();
      this.select(Math.min(this._rows.length - 1, this._index + L.rows));
    } else if (Input.isTriggered('pageup')) {
      SoundManager.playCursor();
      this.select(Math.max(0, this._index - L.rows));
    } else if (TouchInput.wheelY > 0) {
      this.select(this._index + 1);
    } else if (TouchInput.wheelY < 0) {
      this.select(this._index - 1);
    }
  };

  window.Scene_ColosseumSeason = Scene_ColosseumSeason;

})();
