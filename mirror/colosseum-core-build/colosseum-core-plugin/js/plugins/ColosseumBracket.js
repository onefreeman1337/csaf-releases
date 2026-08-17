//=============================================================================
// ColosseumBracket.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [v1.0.0] The championship board. A slate-and-brass bracket that draws itself toward the final. Requires ColosseumCore.
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
 * @param revealSeconds
 * @text Seconds per reveal
 * @type number
 * @decimals 2
 * @min 0.05
 * @max 3.00
 * @desc How long one result takes to draw its line into the tree when the board opens.
 * @default 0.32
 *
 * @help
 * ============================================================================
 * The championship board
 * ============================================================================
 * This is the face of Colosseum Core. Open it with the OpenBracket plugin
 * command. It shows the live tournament if one is running, otherwise the most
 * recently completed one.
 *
 * The bracket is a DIAGRAM, drawn line by line: results land as brass strokes
 * toward the final, eliminated fighters crack and fade, the champion's path
 * burns gold, and your own chip is ringed when you are due in the arena.
 *
 * NOTHING HERE IS AN RPG MAKER WINDOW
 * -----------------------------------
 * No Window_Base, no windowskin, no default font anywhere in this scene.
 * Every mark is drawn into a Bitmap once and animated by moving sprites, so
 * the board costs almost nothing per frame.
 *
 * COLOURS LIVE IN ColosseumCore
 * -----------------------------
 * Slate, brass, parchment, crimson and gold are set once in ColosseumCore's
 * parameters and used by every colosseum screen, so the bracket and the season
 * ledger can never drift apart. Only the two settings above are local to this
 * scene.
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

  var params = PluginManager.parameters('ColosseumBracket');

  var CFG = {
    showGrain: params.showGrain !== 'false',
    revealSeconds: Math.max(0.05, Number(params.revealSeconds) || 0.32)
  };

  // The shared drawing kit and palette, both owned by ColosseumCore.
  //
  // Resolved in create(), NEVER at load time: plugin order is the buyer's
  // choice, and a `typeof` test at load is a coin flip that silently no-ops
  // the whole look when it loses. By the time a scene is created, every
  // enabled plugin has run.
  var K = null;
  var C = null;

  /* ========================================================================
   * Scene_ColosseumBracket
   * ====================================================================== */

  /**
   * The championship board.
   *
   * PERFORMANCE SHAPE, DELIBERATE. Every bitmap is drawn ONCE — at create or
   * when a result bakes. Per frame the scene writes sprite properties (the
   * reveal segments' scales, three pulse alphas) and one shader uniform.
   * The wing's gate asserts deterministic per-frame counts; a scene that
   * redrew a bitmap to animate would fail it whatever the machine.
   *
   * @constructor
   */
  function Scene_ColosseumBracket() {
    this.initialize.apply(this, arguments);
  }

  Scene_ColosseumBracket.prototype = Object.create(Scene_Base.prototype);
  Scene_ColosseumBracket.prototype.constructor = Scene_ColosseumBracket;

  /** @returns {void} */
  Scene_ColosseumBracket.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
    this._wantedId = '';
    this._time = 0;
    this._segs = [];          // reveal segments, preallocated at create
    this._pulseSprites = [];  // sprites whose alpha breathes
    this._champGlow = null;
    this._playerRing = null;
    this._done = false;
  };

  /**
   * Called by SceneManager.prepareNextScene from the OpenBracket command.
   * @param {string} tournamentId Requested tournament, '' for whatever is live.
   * @returns {void}
   */
  Scene_ColosseumBracket.prototype.prepare = function (tournamentId) {
    this._wantedId = String(tournamentId || '');
  };

  /**
   * The tournament to draw: the live one if it matches (or nothing specific
   * was asked for), else the most recent completed entry that still carries
   * its rounds, else null — the scene must survive nothing configured.
   * @returns {?object} Tournament-shaped record with rounds.
   */
  Scene_ColosseumBracket.prototype.readTournament = function () {
    var st = window.$gameColosseum;
    if (!st) return null;
    if (st.active && (!this._wantedId || st.active.id === this._wantedId)) return st.active;
    for (var i = st.history.length - 1; i >= 0; i--) {
      var h = st.history[i];
      if (!h.rounds) continue;
      if (this._wantedId && h.tournament !== this._wantedId) continue;
      return h;
    }
    return null;
  };

  /** @returns {void} */
  Scene_ColosseumBracket.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    // Late-bound on purpose (see K/C above). Core is unavoidable anyway — the
    // command that opens this scene is registered by it — so a missing kit
    // means a broken install, and the honest thing is to say so loudly
    // rather than to paint a black rectangle.
    K = window.CSAF_ColosseumInk;
    if (!K) {
      console.error('ColosseumBracket: ColosseumCore is not enabled — the board needs its palette and drawing kit');
      return;
    }
    C = K.palette;
    this._state = window.$gameColosseum || null;
    this._tour = this.readTournament();
    this.createBoard();
    this.createCartouche();
    if (this._tour) {
      this.layoutBracket();
      this.createSkeleton();
      this.createChips();
      this.createReveals();
      this.createBeltPlaque();
    } else {
      this.createEmptyCard();
    }
    this.createShader();
  };

  /* ----------------------------------------------------------- the board */

  /** Slate ground with the engraver's double rule — shared with the ledger. @returns {void} */
  Scene_ColosseumBracket.prototype.createBoard = function () {
    var b = new Bitmap(Graphics.width, Graphics.height);
    K.paintGround(b);
    this._board = new Sprite(b);
    this.addChild(this._board);
  };

  /** Title cartouche: tournament name, season, standing line. @returns {void} */
  Scene_ColosseumBracket.prototype.createCartouche = function () {
    var b = new Bitmap(560, 74);
    var name = this._tour ? String(this._tour.name || this._tour.id).toUpperCase()
                          : 'THE COLOSSEUM';
    var season = this._state ? this._state.seasonNo : 1;
    K.setType(b, K.FONT_HEAD, 27, C.parchment);
    var w = K.drawTracked(b, name, 8, 8, 6);
    K.setType(b, K.FONT_NUM, 12, C.brass, 0.95);
    K.drawTracked(b, 'SEASON ' + season + ' · THE CHAMPIONSHIP BOARD', 10, 46, 3);
    // Rule under the title, weighted like an engraver's.
    var ctx = b.context;
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = C.brass;
    ctx.fillRect(8, 40, Math.max(w, 200), 2);
    ctx.globalAlpha = 0.4;
    ctx.fillRect(8, 43, Math.max(w, 200) * 0.62, 1);
    ctx.globalAlpha = 1;
    b._baseTexture.update();
    var s = new Sprite(b);
    s.x = 30;
    s.y = 26;
    this.addChild(s);
  };

  /* ------------------------------------------------------------- layout */

  /**
   * Compute every chip and connector position once. All later animation is
   * sprite-property writes against these numbers.
   * @returns {void}
   */
  Scene_ColosseumBracket.prototype.layoutBracket = function () {
    var tour = this._tour;
    var roundsN = tour.rounds.length;
    // ⚠️ 168 IS LOAD-BEARING — measured 2026-08-17, twice, before it was
    // believed. When the crest was added, widening to 184 then 172 both
    // KILLED THE REVEAL PLAN (9+ segments -> 6): the junction sits at
    // colX + chipW + 22 and the carry segment's width is nextColX - jx,
    // which at 168 is already only ~4px. Any wider chip drives it negative
    // and addSeg drops the whole third segment of every match — caught by
    // the in-engine suite's segs>=9 check, not by looking. Name room for the
    // crest comes from INSIDE the chip (seed disc, padding), never from here.
    var chipW = roundsN >= 3 ? 168 : 190;
    var chipH = roundsN >= 3 ? 38 : 44;
    var left = 44;
    var right = Graphics.width - 44;
    var championW = 148;
    var treeRight = right - championW - 26;
    var colGap = roundsN > 1 ? (treeRight - left - chipW) / (roundsN - 1 + 0.0001) : 0;
    var top = 128;
    var bottom = Graphics.height - 36;

    this._L = { chipW: chipW, chipH: chipH, cols: [], championX: treeRight + 26 };
    var r, m;
    for (r = 0; r < roundsN; r++) {
      this._L.cols.push(left + (roundsN > 1 ? colGap * r : (treeRight - left - chipW) / 2));
    }

    // Slot centres: round 0 is evenly spaced pairs; later rounds sit at the
    // midpoint of the two feeding slots — the classic tree.
    this._L.y = [];
    var size = tour.rounds[0].length * 2;
    var rowH = (bottom - top) / size;
    var y0 = [];
    for (m = 0; m < size; m++) y0.push(top + rowH * (m + 0.5));
    this._L.y.push(y0);
    for (r = 1; r < roundsN; r++) {
      var prev = this._L.y[r - 1];
      var ys = [];
      for (m = 0; m < prev.length / 2; m++) ys.push((prev[m * 2] + prev[m * 2 + 1]) / 2);
      this._L.y.push(ys);
    }
  };

  /**
   * Position of the slot for participant side of a match.
   * @param {number} round Round index.
   * @param {number} slot Match index.
   * @param {string} side 'a' or 'b'.
   * @returns {{x:number,y:number}} Chip centre-left anchor.
   */
  Scene_ColosseumBracket.prototype.slotPos = function (round, slot, side) {
    var idx = slot * 2 + (side === 'a' ? 0 : 1);
    return { x: this._L.cols[round], y: this._L.y[round][idx] };
  };

  /* -------------------------------------------------- the dim skeleton */

  /**
   * The full connector structure, faint — an empty bracket is a diagram too.
   * Drawn once into one bitmap.
   * @returns {void}
   */
  Scene_ColosseumBracket.prototype.createSkeleton = function () {
    var b = new Bitmap(Graphics.width, Graphics.height);
    var ctx = b.context;
    ctx.strokeStyle = C.brass;
    ctx.globalAlpha = 0.26;
    ctx.lineWidth = 2;
    var tour = this._tour;
    for (var r = 0; r < tour.rounds.length; r++) {
      for (var m = 0; m < tour.rounds[r].length; m++) {
        var pa = this.slotPos(r, m, 'a');
        var pb = this.slotPos(r, m, 'b');
        var jx = this._L.cols[r] + this._L.chipW + 22;
        var out = r + 1 < tour.rounds.length
          ? this.slotPos(r + 1, Math.floor(m / 2), m % 2 === 0 ? 'a' : 'b')
          : { x: this._L.championX, y: (pa.y + pb.y) / 2 };
        var midY = (pa.y + pb.y) / 2;
        ctx.beginPath();
        ctx.moveTo(pa.x + this._L.chipW, pa.y);
        ctx.lineTo(jx, pa.y);
        ctx.lineTo(jx, pb.y);
        ctx.lineTo(pb.x + this._L.chipW, pb.y);
        ctx.moveTo(jx, midY);
        ctx.lineTo(out.x, r + 1 < tour.rounds.length ? out.y : midY);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    b._baseTexture.update();
    this.addChild(new Sprite(b));

    // Round labels along the top of each column.
    var LABELS = { 4: ['SEMIFINALS', 'THE FINAL'], 8: ['QUARTERFINALS', 'SEMIFINALS', 'THE FINAL'],
      16: ['ROUND OF SIXTEEN', 'QUARTERFINALS', 'SEMIFINALS', 'THE FINAL'] };
    var names = LABELS[tour.size] || [];
    for (var c = 0; c < this._L.cols.length && c < names.length; c++) {
      var lb = new Bitmap(this._L.chipW + 40, 20);
      K.setType(lb, K.FONT_NUM, 11, C.brass, 0.75);
      K.drawTracked(lb, names[c], 0, 4, 4);
      var ls = new Sprite(lb);
      ls.x = this._L.cols[c];
      ls.y = 104;
      this.addChild(ls);
    }
  };

  /* --------------------------------------------------------------- chips */

  /**
   * Bake one fighter chip. Eliminated chips are baked muted WITH crack lines
   * — a result, not a filter, so it costs nothing per frame.
   * @param {?object} slotRef {key, seed} or null for an undecided slot.
   * @param {boolean} eliminated Baked as defeated.
   * @param {boolean} isChampion Gold treatment.
   * @returns {Bitmap} The chip.
   */
  Scene_ColosseumBracket.prototype.bakeChip = function (slotRef, eliminated, isChampion) {
    var w = this._L.chipW;
    var h = this._L.chipH;
    var b = new Bitmap(w, h);
    var ctx = b.context;

    var isPlayer = slotRef && slotRef.key === '$player';
    var name = '—';
    if (slotRef) {
      if (isPlayer) {
        name = ($gameParty && $gameParty.leader()) ? $gameParty.leader().name() : 'YOU';
      } else {
        var rec = this._state && this._state.rivals[slotRef.key];
        name = rec ? rec.name : slotRef.key;
      }
    }

    var back = eliminated ? '#241d17' : (isChampion ? '#2e2214' : '#221a12');
    var edge = eliminated ? '#4a3a2a' : (isPlayer || isChampion ? C.gold : C.brass);
    var ink = eliminated ? '#77644d' : C.parchment;

    K.rr(ctx, 1, 1, w - 2, h - 2, 6);
    ctx.fillStyle = back;
    ctx.fill();
    // Parchment face inset.
    K.rr(ctx, 3, 3, w - 6, h - 6, 5);
    var g = ctx.createLinearGradient(0, 3, 0, h - 3);
    g.addColorStop(0, eliminated ? 'rgba(120,100,75,0.16)' : 'rgba(233,210,160,0.20)');
    g.addColorStop(1, 'rgba(0,0,0,0.10)');
    ctx.fillStyle = g;
    ctx.fill();
    K.rr(ctx, 1, 1, w - 2, h - 2, 6);
    ctx.lineWidth = isPlayer || isChampion ? 2 : 1.4;
    ctx.strokeStyle = edge;
    ctx.globalAlpha = eliminated ? 0.8 : 1;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Seed disc — a shade smaller since 2026-08-17, buying name room the
    // crest costs (the chip itself cannot widen; see layoutBracket).
    if (slotRef && slotRef.seed) {
      ctx.beginPath();
      ctx.arc(15, h / 2, 8, 0, Math.PI * 2);
      ctx.fillStyle = eliminated ? '#3a2f22' : C.brass;
      ctx.fill();
      K.setType(b, K.FONT_NUM, 11, eliminated ? '#77644d' : C.slate);
      var sw = ctx.measureText(String(slotRef.seed)).width;
      ctx.fillText(String(slotRef.seed), 15 - sw / 2, h / 2 - 6);
    }

    // The fighter's crest, struck small at the chip's right edge — the same
    // generated heraldry the season ledger's dossier carries, from the same
    // shared routine (K.drawCrest, ColosseumCore.js), so every chip on the
    // board is a distinct generated mark rather than a name in a box. Added
    // 2026-08-17: the board without them was eight identical pills.
    var crestW = 0;
    if (slotRef) {
      var crestH = h - 15;
      crestW = Math.round(crestH / 1.15);
      K.drawCrest(b, slotRef.key, w - crestW - 7, 7, crestW);
      if (eliminated) {
        // The dead face's veil, over the crest too — colour belongs to the living.
        ctx.fillStyle = 'rgba(30,24,18,0.55)';
        ctx.fillRect(w - crestW - 8, 3, crestW + 4, h - 6);
      }
    }

    // Name, tracked caps — the ledger voice. A name that does not fit first
    // drops the type size, then loses its tracking, and only then truncates —
    // WITH a mark. "DAGEN THE AN" chopped mid-word reads as a rendering bug;
    // "DAGEN THE ANV·" reads as a ledger running out of column.
    // The 11px tier exists for the crest era (2026-08-17): with ~27px of the
    // chip now spent on heraldry, a 15-glyph epithet like DAGEN THE ANVIL
    // fits only at 11 — and a fitted name at 11 beats a truncated one at 12.
    var fit = K.fitTracked(b, K.FONT_HEAD, String(name).toUpperCase(), w - 36 - (crestW ? crestW + 7 : 0),
      [15, 13.5, 12, 11], [1.5, 0.8, 0.8, 0.4], ink);
    K.setType(b, K.FONT_HEAD, fit.size, ink);
    K.drawTracked(b, fit.text, 29, Math.floor(h / 2) - Math.round(fit.size * 0.62), fit.track);

    // The crack of elimination: two jagged strokes baked over the face.
    if (eliminated) {
      ctx.strokeStyle = 'rgba(20,14,10,0.85)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(w * 0.30, 2);
      ctx.lineTo(w * 0.40, h * 0.42);
      ctx.lineTo(w * 0.34, h * 0.58);
      ctx.lineTo(w * 0.46, h - 2);
      ctx.moveTo(w * 0.40, h * 0.42);
      ctx.lineTo(w * 0.52, h * 0.30);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(150,60,40,0.30)';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(w * 0.30, 2);
      ctx.lineTo(w * 0.40, h * 0.42);
      ctx.lineTo(w * 0.34, h * 0.58);
      ctx.lineTo(w * 0.46, h - 2);
      ctx.stroke();
    }

    b._baseTexture.update();
    return b;
  };

  /**
   * Every populated slot becomes a chip sprite; the champion pedestal at the
   * far right if the tournament is decided. Chips for later rounds exist only
   * once their occupant is known — the tree fills in.
   * @returns {void}
   */
  Scene_ColosseumBracket.prototype.createChips = function () {
    var tour = this._tour;
    var finishes = tour.finishes || {};
    var pending = null;
    if (this._state && this._state.active === tour) {
      pending = window.CSAF_Colosseum.playerMatch(this._state);
    }

    for (var r = 0; r < tour.rounds.length; r++) {
      for (var m = 0; m < tour.rounds[r].length; m++) {
        var match = tour.rounds[r][m];
        var sides = ['a', 'b'];
        for (var si = 0; si < 2; si++) {
          var ref = match[sides[si]];
          if (!ref) continue;
          var lostHere = match.resolved && !match.bye && match.winner !== sides[si];
          // A fighter shows as CRACKED at the round they fell; their earlier
          // chips stay whole — the ledger records the career, not the corpse.
          var eliminated = lostHere && finishes[ref.key] === r;
          var pos = this.slotPos(r, m, sides[si]);
          var sp = new Sprite(this.bakeChip(ref, eliminated, false));
          sp.x = pos.x;
          sp.y = pos.y - this._L.chipH / 2;
          this.addChild(sp);

          // Ring the player's pending fight. The tag goes on the side of the
          // chip that faces the BETWEEN-PAIRS gap — above an 'a' slot, below
          // a 'b' slot — because the paired chip sits close on the other side
          // and the first render put the tag straight through it.
          if (pending && r === pending.round && m === pending.slot && ref.key === '$player') {
            this.createPlayerRing(pos, sides[si] === 'b');
          }
        }
      }
    }

    if (tour.champion) this.createChampion();
  };

  /**
   * The pulsing gold ring and tag on the player's next fight.
   * @param {{x:number,y:number}} pos Chip anchor.
   * @param {boolean} tagBelow Tag under the ring ('b' slots) or above ('a').
   * @returns {void}
   */
  Scene_ColosseumBracket.prototype.createPlayerRing = function (pos, tagBelow) {
    var w = this._L.chipW + 12;
    var h = this._L.chipH + 12;
    var b = new Bitmap(w, h + 18);
    var ringY = tagBelow ? 1.5 : 19.5;
    var tagY = tagBelow ? h + 3 : 2;
    var ctx = b.context;
    K.rr(ctx, 1.5, ringY, w - 3, h - 3, 8);
    ctx.lineWidth = 2;
    ctx.strokeStyle = C.gold;
    ctx.stroke();
    K.setType(b, K.FONT_NUM, 11, C.gold);
    K.drawTracked(b, 'YOU FIGHT NEXT', 8, tagY, 3);
    b._baseTexture.update();
    var s = new Sprite(b);
    s.x = pos.x - 6;
    s.y = pos.y - this._L.chipH / 2 - (tagBelow ? 6 : 24);
    this.addChild(s);
    this._playerRing = s;
    this._pulseSprites.push(s);
  };

  /** The champion pedestal, gold. @returns {void} */
  Scene_ColosseumBracket.prototype.createChampion = function () {
    var tour = this._tour;
    var finalRound = tour.rounds.length - 1;
    var midY = this._L.y[finalRound].length === 2
      ? (this._L.y[finalRound][0] + this._L.y[finalRound][1]) / 2
      : this._L.y[finalRound][0];

    var isPlayer = tour.champion === '$player';
    var name = isPlayer
      ? (($gameParty && $gameParty.leader()) ? $gameParty.leader().name() : 'YOU')
      : ((this._state && this._state.rivals[tour.champion])
          ? this._state.rivals[tour.champion].name : tour.champion);

    var w = 150;
    var h = 66;
    var b = new Bitmap(w, h);
    var ctx = b.context;
    K.rr(ctx, 1, 12, w - 2, h - 14, 7);
    ctx.fillStyle = '#2e2312';
    ctx.fill();
    K.rr(ctx, 1, 12, w - 2, h - 14, 7);
    ctx.lineWidth = 2;
    ctx.strokeStyle = C.gold;
    ctx.stroke();
    // Laurel dashes flanking the crown line.
    K.setType(b, K.FONT_NUM, 10, C.gold, 0.9);
    K.drawTracked(b, 'CHAMPION', Math.floor((w - K.measureTracked(b, 'CHAMPION', 4)) / 2), 0, 4);
    // The pedestal is the ONE place a name is read as a result rather than as a
    // row, so it gets the same shrink-then-mark treatment every chip gets. It
    // was hand-rolled here and truncated silently mid-word: a decided board
    // crowned "DAGEN THE A", which reads as a rendering bug. Found by LOOKING
    // at the store frame (wing CLAUDE.md sec 9.5), not by any assert.
    var fit = K.fitTracked(b, K.FONT_HEAD, String(name).toUpperCase(), w - 20,
      [16, 14, 12.5], [1.5, 1, 0.6], C.gold);
    K.setType(b, K.FONT_HEAD, fit.size, C.gold);
    K.drawTracked(b, fit.text,
      Math.floor((w - K.measureTracked(b, fit.text, fit.track)) / 2),
      26 + Math.round((16 - fit.size) * 0.5), fit.track);
    b._baseTexture.update();

    var s = new Sprite(b);
    s.x = this._L.championX;
    s.y = midY - h / 2;
    this.addChild(s);
    this._pulseSprites.push(s);
  };

  /* -------------------------------------------- the belt, if one rides */

  /** Belt plaque top-right: name and current holder. @returns {void} */
  Scene_ColosseumBracket.prototype.createBeltPlaque = function () {
    var tour = this._tour;
    if (!tour.beltId || !this._state || !this._state.belts[tour.beltId]) return;
    var belt = this._state.belts[tour.beltId];
    var holderName = belt.holder === '$player'
      ? (($gameParty && $gameParty.leader()) ? $gameParty.leader().name() : 'YOU')
      : (belt.holder && this._state.rivals[belt.holder]
          ? this._state.rivals[belt.holder].name : (belt.holder || 'VACANT'));

    var w = 240;
    var b = new Bitmap(w, 58);
    var ctx = b.context;
    K.rr(ctx, 1, 1, w - 2, 56, 6);
    ctx.fillStyle = 'rgba(40,30,16,0.85)';
    ctx.fill();
    K.rr(ctx, 1, 1, w - 2, 56, 6);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = C.brass;
    ctx.stroke();
    K.setType(b, K.FONT_NUM, 10, C.brass, 0.9);
    K.drawTracked(b, 'ON THE LINE', 10, 6, 4);
    K.setType(b, K.FONT_HEAD, 14, C.parchment);
    K.drawTracked(b, String(belt.name).toUpperCase(), 10, 20, 2);
    K.setType(b, K.FONT_NUM, 11, C.gold, 0.95);
    K.drawTracked(b, 'HELD BY ' + String(holderName).toUpperCase(), 10, 40, 2);
    b._baseTexture.update();
    var s = new Sprite(b);
    s.x = Graphics.width - w - 30;
    s.y = 28;
    this.addChild(s);
  };

  /* ----------------------------------------- the reveal: results land */

  /**
   * One shared 2x2 brass texture powers every animated segment, so the whole
   * reveal batches into a single draw call and animating it is nothing but
   * scale writes.
   * @returns {Bitmap} The texture.
   */
  Scene_ColosseumBracket.prototype.segmentTexture = function (colour) {
    var b = new Bitmap(2, 2);
    b.fillAll(colour);
    return b;
  };

  /**
   * Build the animation plan: for every resolved non-bye match, in bracket
   * order, three segments (winner's run-out, the junction drop, the carry to
   * the next slot) that draw themselves in sequence. Preallocated here;
   * update() only writes scales.
   * @returns {void}
   */
  Scene_ColosseumBracket.prototype.createReveals = function () {
    var tour = this._tour;
    var brassTex = this.segmentTexture(C.brass);
    var goldTex = this.segmentTexture(C.gold);
    var t = 0.15; // opening beat
    var stagger = CFG.revealSeconds;
    var LINE = 3;

    // The champion's path back through the tree burns gold.
    var champPath = {};
    if (tour.champion) {
      for (var cr = 0; cr < tour.rounds.length; cr++) {
        for (var cm = 0; cm < tour.rounds[cr].length; cm++) {
          var cmatch = tour.rounds[cr][cm];
          var winRef = cmatch.winner === 'a' ? cmatch.a : cmatch.b;
          if (cmatch.resolved && winRef && winRef.key === tour.champion) {
            champPath['r' + cr + 'm' + cm] = true;
          }
        }
      }
    }

    for (var r = 0; r < tour.rounds.length; r++) {
      for (var m = 0; m < tour.rounds[r].length; m++) {
        var match = tour.rounds[r][m];
        if (!match.resolved || !match.winner) continue;
        var golden = champPath['r' + r + 'm' + m] === true;
        var tex = golden ? goldTex : brassTex;
        var winSide = match.winner;
        var pw = this.slotPos(r, m, winSide);
        var pa = this.slotPos(r, m, 'a');
        var pb = this.slotPos(r, m, 'b');
        var jx = this._L.cols[r] + this._L.chipW + 22;
        var midY = (pa.y + pb.y) / 2;
        var out = r + 1 < tour.rounds.length
          ? this.slotPos(r + 1, Math.floor(m / 2), m % 2 === 0 ? 'a' : 'b')
          : { x: this._L.championX, y: midY };

        // Byes carry a quiet line with no run-out beat.
        var dur = match.bye ? stagger * 0.5 : stagger;

        // 1. run-out from the winner's chip to the junction
        this.addSeg(tex, pw.x + this._L.chipW, pw.y - LINE / 2, jx - (pw.x + this._L.chipW), LINE,
          'x', t, dur * 0.35, golden);
        // 2. the junction drop from the winner's lane to the middle. Extended
        // half a line each end so the elbows join solid — the first render
        // left a 1.5 px notch at every corner.
        var vy0 = Math.min(pw.y, midY) - LINE / 2;
        var vh = Math.abs(midY - pw.y) + LINE;
        this.addSeg(tex, jx - LINE / 2, pw.y <= midY ? vy0 : midY - LINE / 2, LINE, vh,
          pw.y <= midY ? 'y' : 'y-up', t + dur * 0.35, dur * 0.25, golden);
        // 3. the carry to the next slot, starting under the junction bar.
        this.addSeg(tex, jx - LINE / 2, midY - LINE / 2, out.x - jx + LINE / 2, LINE,
          'x', t + dur * 0.6, dur * 0.4, golden);

        t += match.bye ? stagger * 0.35 : stagger * 0.8;
      }
      t += stagger * 0.5; // breath between rounds
    }
    this._revealEnds = t + 0.5;
  };

  /**
   * Register one reveal segment sprite.
   * @param {Bitmap} tex Shared texture.
   * @param {number} x Left. @param {number} y Top.
   * @param {number} w Full width. @param {number} h Full height.
   * @param {string} axis 'x' | 'y' | 'y-up' (grows upward from the bottom).
   * @param {number} t0 Reveal start, seconds from scene start.
   * @param {number} dur Reveal duration.
   * @param {boolean} golden Champion path.
   * @returns {void}
   */
  Scene_ColosseumBracket.prototype.addSeg = function (tex, x, y, w, h, axis, t0, dur, golden) {
    if (w <= 0 || h <= 0) return;
    var s = new Sprite(tex);
    s.x = x;
    s.y = axis === 'y-up' ? y + h : y;
    if (axis === 'y-up') s.anchor.y = 1;
    s.scale.x = axis === 'x' ? 0 : w / 2;
    s.scale.y = axis === 'x' ? h / 2 : 0;
    this.addChild(s);
    this._segs.push({
      sprite: s, axis: axis, full: axis === 'x' ? w / 2 : h / 2,
      t0: t0, dur: Math.max(0.05, dur), golden: golden
    });
    if (golden) this._pulseSprites.push(s);
  };

  /* ------------------------------------------------------- empty state */

  /** The board with no championship to show — still themed. @returns {void} */
  Scene_ColosseumBracket.prototype.createEmptyCard = function () {
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
    K.drawTracked(b, 'NO CHAMPIONSHIP CALLED',
      Math.floor((w - K.measureTracked(b, 'NO CHAMPIONSHIP CALLED', 3)) / 2), 28, 3);
    K.setType(b, K.FONT_NUM, 12, C.brass, 0.9);
    var hint = 'ENTER A TOURNAMENT AND THE BOARD FILLS IN';
    K.drawTracked(b, hint, Math.floor((w - K.measureTracked(b, hint, 2)) / 2), 68, 2);
    b._baseTexture.update();
    var s = new Sprite(b);
    s.x = (Graphics.width - w) / 2;
    s.y = (Graphics.height - h) / 2 - 20;
    this.addChild(s);
    this._pulseSprites.push(s);
  };

  /* ------------------------------------------------------------- shader */

  /** @returns {void} */
  Scene_ColosseumBracket.prototype.createShader = function () {
    this._boardFilter = null;
    if (!CFG.showGrain || typeof PIXI === 'undefined' || !PIXI.Filter) return;
    try {
      this._boardFilter = new PIXI.Filter(undefined, K.GRAIN_FRAG, { uTime: 0 });
      this.filters = [this._boardFilter];
    } catch (e) {
      this._boardFilter = null;
    }
  };

  /* ------------------------------------------------------------- update */

  /** @returns {void} */
  Scene_ColosseumBracket.prototype.update = function () {
    Scene_Base.prototype.update.call(this);
    this._time += 1 / 60;
    var t = this._time;

    // Reveal segments: pure scale writes against the precomputed plan.
    var segs = this._segs;
    for (var i = 0; i < segs.length; i++) {
      var g = segs[i];
      var k = (t - g.t0) / g.dur;
      if (k <= 0) continue;
      if (k > 1) k = 1;
      var v = K.easeOut(k) * g.full;
      if (g.axis === 'x') g.sprite.scale.x = v;
      else g.sprite.scale.y = v;
    }

    // Pulses: champion path and rings breathe; a slow 1.6 s cycle.
    var pulse = 0.82 + 0.18 * Math.sin(t * 3.9);
    var ps = this._pulseSprites;
    for (var p = 0; p < ps.length; p++) ps[p].alpha = pulse;

    if (this._boardFilter) this._boardFilter.uniforms.uTime = t;

    this.processInput();
  };

  /** Cancel or ok leaves the board. @returns {void} */
  Scene_ColosseumBracket.prototype.processInput = function () {
    if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) {
      SoundManager.playCancel();
      SceneManager.pop();
    }
  };

  window.Scene_ColosseumBracket = Scene_ColosseumBracket;

})();
