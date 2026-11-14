/**
 * game.js - THEODOLITE: layout (two shapes), drawing, input, save/resume and the loop. Every number on screen is
 * read from SIM (sim.js); this file computes none of the survey.
 *
 * Three logical surfaces, chosen by the window: WIDE 960x600 (the itch embed, a desktop), TALL 480x960 (an upright
 *   phone) and, since 1.1, SHORT 720x405 (a phone held sideways, or any window under 520 css px tall). On TALL and
 *   SHORT every string is drawn at a type floor taken from the LIVE element scale (10 css px, capped at 13 logical).
 * The canvas element keeps the surface's aspect (CSS aspect-ratio from --ar), so a tap maps with ONE scale on
 *   both axes and the picture is never letterboxed inside its own box.
 * Save/resume, never a restart: autosave on every action, every season and every 5 s; the parties keep working
 *   while you are away (up to one season), weather and all.
 * No key is ever preventDefault-ed except the arrow keys while the map cursor is in use: the embed never traps
 *   Tab (WCAG 2.1.2).
 */
'use strict';

(function () {
  var cv = document.getElementById('cv');
  var g = cv.getContext('2d');
  var SAVE_KEY = 'theodolite.survey.v1';
  var SHAPES = { wide: { W: 960, H: 600 }, tall: { W: 480, H: 960 }, short: { W: 720, H: 405 } };
  var shape = 'wide', W = 960, H = 600;

  /* the survey office: a walnut-dark desk under green baize, the map on cream paper, sepia and red ink */
  var C = {
    bg: '#15110c', panel: '#1f2a21', panelEdge: '#6d5a3a', ink: '#f2e8d2', inkDim: '#d4c7a8', inkFaint: '#a89c80',
    red: '#a8321f', redInk: '#b23a24', gold: '#e2b75e', good: '#9fd08a', alarm: '#ff8a6a', btn: '#2c3a2d', btnOn: '#3f5a40', btnEdge: '#8a7550',
    sepia: '#3b2a1a', pencil: 'rgba(92,80,62,0.42)', paper: '#e9dcb8',
  };
  var PLATES = { paper: null, baize: null }, platesReady = 0;
  ['paper', 'baize'].forEach(function (k) {
    var img = new Image();
    img.onload = function () { try { PLATES[k] = g.createPattern(img, 'repeat'); platesReady++; } catch (e) { /* keep the flat colour */ } };
    img.src = 'art/plate_' + k + '.png';
  });
  var SERIF = 'Georgia, "Times New Roman", serif';
  var UI = '"Trebuchet MS", Verdana, sans-serif';

  var state = {
    screen: 'title', county: null, tab: 'instruments', t: 0, speed: 1, help: false, confirmNewUntil: 0, lastSaveReal: 0,
    eventsSeen: 0, toast: [], cut: 0, pendingToast: null, tool: 'raise', cursor: -1, hoverCell: -1, flashes: [], lastObserved: 0, lastInked: 0, inkSoundAt: 0,
    helpPage: 0, notePage: 0,   // SHORT only: the help and the field notes are two and three pages there
  };

  /* ---------------------------------------------------------------- save */
  var saveFailSaid = false;
  function save() {
    if (!state.county) return;
    try { CG.store.setItem(SAVE_KEY, JSON.stringify({ v: 1, savedAt: Date.now(), paused: !!state.userPaused, county: state.county })); }
    catch (e) { if (!saveFailSaid) { saveFailSaid = true; toast('This browser is blocking saves. Progress will not persist.', 'bad'); } }
  }
  function num(x) { return typeof x === 'number' && isFinite(x); }
  function valid(a) {
    if (!a || a.v !== 1 || !num(a.seed) || !num(a.t) || a.t < 0 || !num(a.funds) || !num(a.seq) || !num(a.inkProg)) return false;
    if (!Array.isArray(a.cells) || a.cells.length !== SIM.N || !Array.isArray(a.sheets) || a.sheets.length !== SIM.NT) return false;
    if (!Array.isArray(a.stations) || a.stations.length < 2 || a.stations.length > 200 || !Array.isArray(a.edges) || !Array.isArray(a.obsWork)) return false;
    if (!(a.parties >= 1 && a.parties <= 8) || !(a.planes >= 1 && a.planes <= 8) || !(a.wx >= 0 && a.wx <= 2)) return false;
    if (!a.levels || typeof a.levels !== 'object') return false;
    for (var k in SIM.UPGRADES) if (!num(a.levels[k]) || a.levels[k] < 0 || a.levels[k] > SIM.UPGRADES[k].max) return false;
    for (var s = 0; s < a.stations.length; s++) { var st = a.stations[s]; if (!st || !(st.i >= 0 && st.i < SIM.N) || !(st.tower >= 0 && st.tower <= SIM.TOWER_MAX) || !num(st.err)) return false; }
    for (var e = 0; e < a.edges.length; e++) { var ed = a.edges[e]; if (!ed || !(ed.a >= 0 && ed.a < a.stations.length) || !(ed.b >= 0 && ed.b < a.stations.length) || !num(ed.obs)) return false; }
    for (var i = 0; i < a.cells.length; i++) { var c = a.cells[i]; if (!c || !num(c.err)) return false; }
    for (var q = 0; q < a.sheets.length; q++) { var sh = a.sheets[q]; if (!sh || !(sh.pub >= 0 && sh.pub <= 3) || !num(sh.paid)) return false; }
    if (!Array.isArray(a.events) || !a.stats || typeof a.stats !== 'object') return false;
    return true;
  }
  function load() {
    try {
      var raw = CG.store.getItem(SAVE_KEY);
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (!d || !valid(d.county)) return null;
      return d;
    } catch (e) { return null; }
  }
  function hasSave() { try { return !!CG.store.getItem(SAVE_KEY); } catch (e) { return false; } }
  /* the parties keep working while you are away, up to one season */
  function catchUp(a, seconds) {
    var days = Math.max(0, Math.min(seconds / SIM.DAY_SEC, SIM.SEASON_DAYS));
    SIM.step(a, days);
    return days;
  }

  function toast(msg, kind) {
    var top = state.toast[0];
    if (top && top.base === msg && state.t - top.at < 8) { top.n++; top.msg = msg + ' x' + top.n; top.at = state.t; return; }
    state.toast.unshift({ msg: msg, base: msg, n: 1, kind: kind || 'info', at: state.t }); if (state.toast.length > 4) state.toast.pop();
  }
  /* THE TYPE FLOOR (1.1, the phone-type-floor census of 2026-10-12): a phone held sideways picked the 960x600 surface
   * at 0.65 and drew 990 of 1,056 strings under 9 css px (smallest 6.5); an upright phone drew the map's place-names at
   * 7.3. TALL and SHORT are the COMPACT shapes: every string they draw is at least MIN() logical px, where MIN() is 10
   * css px at the LIVE element scale (LIVEMIN, refreshed at the top of every render), rounded UP and capped: 13
   * logical px on SHORT (10.3 css px at 640x320, a sideways phone with its bar) and 15 on TALL. TALL's cap was 13 until
   * review_11 #2 measured a 390 phone WITH its browser bars (390x664, scale 0.69): every floor-sized string at 8.99 css
   * px; 15 holds 10 css px down to a 0.67 scale (360x640, 390x664). WIDE keeps its sizes: the 960x600 embed draws it at
   * 1.0. HEFTSTONE 1.2's rule, ported. */
  var LIVEMIN = 0, LIVESC = 1;
  function compact() { return shape !== 'wide'; }
  function liveFloor() { var r = cv.getBoundingClientRect(), sc = r.width / W; LIVESC = sc > 0.05 ? sc : 1; LIVEMIN = compact() && sc > 0.05 ? 10 / sc : 0; }
  function MIN() { return compact() ? Math.max(10, Math.min(shape === 'short' ? 13 : 15, Math.ceil(LIVEMIN - 1e-9))) : 9; }
  function fs(n) { var b = shape === 'tall' ? Math.round(n * 1.1) : n; return compact() ? Math.max(MIN(), b) : b; }
  /* the pointer the player is using, for WORDS (tap or click): a short desktop window picks SHORT and has a mouse */
  function coarse() { return !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches); }
  function cap1(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function fmt(n) { n = Math.floor(n); return n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e4 ? Math.round(n / 1000) + 'k' : String(n); }
  function pct(x) { return Math.floor(x * 100 + 1e-9) + '%'; }
  /* every word ("Wyke Cross?", not "Wyke cross?": review_11 #9) */
  function titleCase(s) { return s.split(' ').map(function (w) { return w.charAt(0) + w.slice(1).toLowerCase(); }).join(' '); }

  /* -------------------------------------------------------------- layout */
  function L() {
    if (shape === 'wide') return {
      top: { x: 0, y: 0, w: 960, h: 52 },
      map: { x: 8, y: 58, cw: 26, ch: 24 },
      field: { x: 588, y: 58, w: 364, h: 288 },
      panel: { x: 8, y: 354, w: 944, h: 194 }, bottom: { x: 0, y: 552, w: 960, h: 48 },
    };
    /* SHORT (1.1): the map on the left at cells of 17 x 19 (the tall map's are 21 x 21; at 844x390 these read 16.4 x
     * 18.3 css px, where the wide surface drew 16.9 x 15.6), the counts and the three tools in a strip under it, and
     * the tab panel on the right with THE FIELD as its own first tab */
    if (shape === 'short') return {
      top: { x: 0, y: 0, w: 720, h: 46 },
      map: { x: 8, y: 52, cw: 17, ch: 19 },
      field: { x: 8, y: 286, w: 374, h: 56 },
      panel: { x: 390, y: 52, w: 322, h: 290 }, bottom: { x: 0, y: 348, w: 720, h: 57 },
    };
    return {
      top: { x: 0, y: 0, w: 480, h: 86 },
      map: { x: 9, y: 92, cw: 21, ch: 21 },
      field: { x: 8, y: 352, w: 464, h: 192 },
      panel: { x: 8, y: 550, w: 464, h: 330 }, bottom: { x: 0, y: 884, w: 480, h: 76 },
    };
  }
  function mapRect() { var r = L().map; return { x: r.x, y: r.y, w: r.cw * SIM.COLS, h: r.ch * SIM.ROWS, cw: r.cw, ch: r.ch }; }
  function cellRect(i) { var r = mapRect(); return { x: r.x + SIM.cx(i) * r.cw, y: r.y + SIM.cy(i) * r.ch, w: r.cw, h: r.ch }; }
  function cellAt(x, y) {
    var r = mapRect();
    if (x < r.x || y < r.y || x >= r.x + r.w || y >= r.y + r.h) return -1;
    return Math.floor((y - r.y) / r.ch) * SIM.COLS + Math.floor((x - r.x) / r.cw);
  }

  /* ------------------------------------------------------------- drawing */
  var buttons = [];
  function T(s, x, y, size, col, align, weight, family) {
    g.font = (weight || '400') + ' ' + size + 'px ' + (family || UI);
    g.textAlign = align || 'left'; g.textBaseline = 'alphabetic';
    g.fillStyle = col || C.ink;
    g.fillText(s, x, y);
    return g.measureText(s).width;
  }
  function tw(s, size, weight, family) { g.font = (weight || '400') + ' ' + size + 'px ' + (family || UI); return g.measureText(s).width; }
  function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function btn(id, x, y, w, h, label, enabled, on, sub, why) {
    var b = { id: id, x: x, y: y, w: w, h: h, label: label, enabled: enabled !== false, on: !!on, sub: sub, why: why };
    buttons.push(b); return b;
  }
  /* the MOUSE's point on the surface, never a finger's (1.1, review_11 #1). Until 1.1 this held a button OBJECT from
   * the frame before, and every render rebuilds the list, so `buttons.indexOf(hoverBtn)` was always -1: no hover
   * readout and no hover highlight ever drew, on any shape. The point is hit-tested against the list THIS frame built */
  var hoverPt = null, hoverBtn = null;
  function hoverNow() { hoverBtn = hoverPt ? btnAt(hoverPt.x, hoverPt.y) : null; return hoverBtn; }
  function drawButtons() {
    hoverNow();
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      if (b.silent) continue;
      g.fillStyle = !b.enabled ? '#1a211b' : b.hot ? '#5a3a1c' : b.on ? C.btnOn : (b === hoverBtn ? '#36483a' : C.btn);
      g.strokeStyle = b.hot || b.on ? C.gold : b.enabled ? C.btnEdge : '#3a3528';
      g.lineWidth = b.on || b.hot ? 2 : 1;
      rr(b.x, b.y, b.w, b.h, 4); g.fill(); g.stroke();
      if (b.bar) bar(b.x + 10, b.y + b.h - 8, b.w - 20, 4, b.bar.f, b.bar.col, 'rgba(0,0,0,0.3)');
      var f = fs(b.h >= 34 ? 13 : 12), cx0 = b.x + b.w / 2;
      if (b.label) T(b.label, cx0, b.y + (b.sub ? b.h / 2 - 2 : b.h / 2 + f * 0.36), f, b.enabled ? C.ink : '#8e8a7c', 'center', '700');
      if (b.sub) T(b.sub, cx0, b.y + b.h / 2 + fs(11) + 1, fs(11), b.enabled ? (b.subCol || C.gold) : '#8e8a7c', 'center', '400');
    }
  }
  function bar(x, y, w, h, f, col, back) {
    g.fillStyle = back || '#2a3226'; rr(x, y, w, h, h / 2); g.fill();
    var fw = Math.max(0, Math.min(1, f)) * w;
    if (fw > 0.5) { g.fillStyle = col; rr(x, y, Math.max(h, fw), h, h / 2); g.fill(); }
  }
  function wrapText(s, x, y, w, size, col, weight, lh) {
    var ls = splitLines(s, w, size, null, weight);
    for (var i = 0; i < ls.length; i++) { T(ls[i], x, y, size, col, 'left', weight); y += lh || size + 5; }
    return y;
  }
  /* the ONE line-breaking rule of both wraps, measured without drawing (1.1: the short title sizes its card from it,
   * THE FIELD tab asks whether its hint fits before drawing it) */
  function splitLines(s, w, size, family, weight) {
    g.font = (weight || '400') + ' ' + size + 'px ' + (family || UI);
    var words = s.split(' '), line = '', out = [];
    for (var i = 0; i < words.length; i++) { var tst = line ? line + ' ' + words[i] : words[i]; if (g.measureText(tst).width > w && line) { out.push(line); line = words[i]; } else line = tst; }
    if (line) out.push(line);
    return out;
  }
  function wrapCenter(s, cx, y, w, size, col, family) {
    var ls = splitLines(s, w, size, family);
    for (var i = 0; i < ls.length; i++) { T(ls[i], cx, y, size, col, 'center', '400', family); y += size + 6; }
    return y;
  }
  function hash(n) { return SIM.hash(n); }
  function rgba(c, al) { return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + al + ')'; }
  function panelBack(x, y, w, h) {
    g.fillStyle = PLATES.baize || C.panel; rr(x, y, w, h, 6); g.fill();
    g.fillStyle = 'rgba(8,14,10,0.28)'; rr(x, y, w, h, 6); g.fill();
    g.strokeStyle = C.panelEdge; g.lineWidth = 1; rr(x, y, w, h, 6); g.stroke();
  }

  /* ------------------------------------------------------------ the map
   * An engraved county map on cream paper. Ground nobody has surveyed is the hearsay sketch in pencil; each cell a
   * plane-table party inks becomes the finished engraving: a wash by the ground's kind, hachures down every slope,
   * trees in the woods, hedgerows on the low ground, water lining on the lakes, contour lines across it all, and
   * the towns with their spires and names. Over it the network: stations as trig triangles, observed sights in
   * red ink, sights still to read in pencil, and the parties at work on them. */
  var WASH = { low: [214, 206, 160], forest: [176, 190, 132], hill: [210, 180, 128], peak: [196, 160, 112], water: [150, 182, 196] };
  var CONTOURS = [0.3, 0.44, 0.58, 0.72, 0.86];
  function cornerH(G, x, y) {
    var s = 0, n = 0;
    for (var dy = -1; dy <= 0; dy++) for (var dx = -1; dx <= 0; dx++) {
      var cx0 = x + dx, cy0 = y + dy; if (cx0 < 0 || cy0 < 0 || cx0 >= SIM.COLS || cy0 >= SIM.ROWS) continue;
      var i = cy0 * SIM.COLS + cx0; s += G.ter[i] === 'water' ? Math.min(G.h[i], 0.1) : G.h[i]; n++;
    }
    return n ? s / n : 0;
  }
  function drawPaper(r, seed) {
    g.fillStyle = PLATES.paper || C.paper; g.fillRect(r.x, r.y, r.w, r.h);
    /* large soft stains, placed by the county's seed, so the plate's repeat never reads as a grid */
    for (var k = 0; k < 5; k++) {
      var sx = r.x + hash(seed * 31 + k * 7) * r.w, sy = r.y + hash(seed * 17 + k * 13) * r.h, rad = 60 + hash(seed + k * 29) * 120;
      var gr = g.createRadialGradient(sx, sy, rad * 0.1, sx, sy, rad);
      gr.addColorStop(0, 'rgba(150,110,50,0.07)'); gr.addColorStop(1, 'rgba(150,110,50,0)');
      g.fillStyle = gr; g.fillRect(r.x, r.y, r.w, r.h);
    }
  }
  /* the hearsay sketch: light pencil hatching over ground nobody has surveyed, and a rough mark for what it is
   * said to be (hills as pencilled humps, woods as scribbled crowns, a lake as a wavy line) */
  function sketchCell(G, i, x, y, w, h) {
    var t = G.ter[i];
    g.strokeStyle = 'rgba(92,80,62,0.13)'; g.lineWidth = 1; g.beginPath();
    for (var d = 0; d < 3; d++) { var o = (d + 0.5) * (w + h) / 3; g.moveTo(x + Math.max(0, o - h), y + Math.min(h, o)); g.lineTo(x + Math.min(w, o), y + Math.max(0, o - w)); }
    g.stroke();
    g.strokeStyle = 'rgba(80,68,50,0.6)'; g.lineWidth = 1;
    if (t === 'hill' || t === 'peak') {
      var n = t === 'peak' ? 2 : 1;
      for (var k = 0; k < n; k++) { var ox = x + w * (n === 1 ? 0.5 : 0.32 + 0.36 * k) + (hash(i * 7 + k) - 0.5) * 3, oy = y + h * 0.66; g.beginPath(); g.moveTo(ox - w * 0.2, oy); g.quadraticCurveTo(ox, oy - h * (t === 'peak' ? 0.56 : 0.38), ox + w * 0.2, oy); g.stroke(); }
    } else if (t === 'forest') {
      for (var f = 0; f < 2; f++) {
        var fx = x + w * (0.3 + 0.4 * f), fy = y + h * (0.5 + 0.1 * hash(i + f)), fr = Math.min(w, h) * 0.1;
        g.beginPath(); g.arc(fx - fr, fy, fr, Math.PI * 0.5, Math.PI * 1.6); g.arc(fx, fy - fr * 0.9, fr, Math.PI, Math.PI * 2); g.arc(fx + fr, fy, fr, Math.PI * 1.4, Math.PI * 0.5); g.stroke();
      }
    } else if (t === 'water') {
      for (var wv = 0; wv < 2; wv++) { var wy = y + h * (0.38 + 0.26 * wv); g.beginPath(); g.moveTo(x + 3, wy); g.quadraticCurveTo(x + w * 0.3, wy - 3, x + w / 2, wy); g.quadraticCurveTo(x + w * 0.7, wy + 3, x + w - 3, wy); g.stroke(); }
    }
  }
  /* a cell's wash colour, and the colour at each of its corners (the mean of the land cells that meet there), so
   * the wash can be laid as a smooth field: flat squares let the cell grid show through as a checkerboard */
  function washOf(G, i) { var t = G.ter[i], wc = WASH[t] || WASH.low, k = t === 'water' ? 1 : 0.94 + 0.12 * (G.h[i] - 0.5); return [wc[0] * k, wc[1] * k, wc[2] * k]; }
  function cornerWash(G, x, y) {
    var s = [0, 0, 0], n = 0;
    for (var dy = -1; dy <= 0; dy++) for (var dx = -1; dx <= 0; dx++) {
      var cx0 = x + dx, cy0 = y + dy; if (cx0 < 0 || cy0 < 0 || cx0 >= SIM.COLS || cy0 >= SIM.ROWS) continue;
      var j = cy0 * SIM.COLS + cx0; if (G.sea[j]) continue;
      var c = washOf(G, j); s[0] += c[0]; s[1] += c[1]; s[2] += c[2]; n++;
    }
    return n ? [s[0] / n, s[1] / n, s[2] / n] : null;
  }
  function inkCell(G, a, i, x, y, w, h, alpha) {
    var t = G.ter[i], seed = i * 7919 + G.seed;
    g.globalAlpha = alpha;
    var own = washOf(G, i), cxI = SIM.cx(i), cyI = SIM.cy(i);
    var c00 = cornerWash(G, cxI, cyI) || own, c10 = cornerWash(G, cxI + 1, cyI) || own, c01 = cornerWash(G, cxI, cyI + 1) || own, c11 = cornerWash(G, cxI + 1, cyI + 1) || own;
    /* a lake keeps a flat wash and a hard edge: smoothed into its banks it reads as a stain */
    var SUB = t === 'water' ? 0 : 4;
    if (!SUB) { g.fillStyle = rgba(own, 0.72); g.fillRect(x, y, w, h); }
    for (var sy = 0; sy < SUB; sy++) for (var sx = 0; sx < SUB; sx++) {
      var u = (sx + 0.5) / SUB, v = (sy + 0.5) / SUB, col = [0, 1, 2].map(function (q) { return (c00[q] * (1 - u) + c10[q] * u) * (1 - v) + (c01[q] * (1 - u) + c11[q] * u) * v; });
      var x0 = Math.round(x + sx * w / SUB), x1 = Math.round(x + (sx + 1) * w / SUB), y0 = Math.round(y + sy * h / SUB), y1 = Math.round(y + (sy + 1) * h / SUB);
      g.fillStyle = rgba(col, 0.62); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
    if (t === 'low') {
      /* hedgerows: a line or two of small dashes across the field at the cell's own angle */
      g.strokeStyle = 'rgba(88,98,52,0.55)'; g.lineWidth = 1; g.setLineDash([2, 2]);
      var an = hash(seed) * Math.PI;
      g.beginPath(); g.moveTo(x + w / 2 - Math.cos(an) * w * 0.5, y + h / 2 - Math.sin(an) * h * 0.5); g.lineTo(x + w / 2 + Math.cos(an) * w * 0.5, y + h / 2 + Math.sin(an) * h * 0.5); g.stroke();
      if (hash(seed + 3) < 0.5) { g.beginPath(); g.moveTo(x + w * hash(seed + 5), y); g.lineTo(x + w * hash(seed + 6), y + h); g.stroke(); }
      g.setLineDash([]);
    } else if (t === 'forest') {
      var nt = 5;
      for (var q = 0; q < nt; q++) {
        var tx = x + 3 + hash(seed + q * 3) * (w - 6), ty = y + 4 + hash(seed + q * 5 + 1) * (h - 7), tr = Math.min(w, h) * (0.11 + 0.05 * hash(seed + q));
        g.fillStyle = 'rgba(58,84,44,0.85)'; g.beginPath(); g.arc(tx, ty, tr, 0, Math.PI * 2); g.fill();
        g.fillStyle = 'rgba(150,176,110,0.8)'; g.beginPath(); g.arc(tx - tr * 0.3, ty - tr * 0.3, tr * 0.45, 0, Math.PI * 2); g.fill();
        g.fillStyle = C.sepia; g.fillRect(tx - 0.5, ty + tr, 1, 2);
      }
    } else if (t === 'hill' || t === 'peak') {
      /* hachures: short strokes pointing down the slope, heavier where it is steeper */
      var gx = neighbourH(G, i, 1, 0) - neighbourH(G, i, -1, 0), gy = neighbourH(G, i, 0, 1) - neighbourH(G, i, 0, -1), gl = Math.sqrt(gx * gx + gy * gy) || 1e-6;
      var dx = -gx / gl, dy = -gy / gl, steep = Math.min(1, gl * 2.2), n = t === 'peak' ? 9 : 7;
      g.strokeStyle = 'rgba(92,60,30,' + (0.45 + 0.4 * steep).toFixed(2) + ')'; g.lineWidth = t === 'peak' ? 1.3 : 1;
      for (var s = 0; s < n; s++) {
        var px = x + 3 + hash(seed + s * 11) * (w - 6), py = y + 3 + hash(seed + s * 13 + 2) * (h - 6), len = Math.min(w, h) * (0.18 + 0.2 * steep);
        g.beginPath(); g.moveTo(px, py); g.lineTo(px + dx * len, py + dy * len); g.stroke();
      }
      if (t === 'peak' && isSummit(G, i)) { g.fillStyle = C.sepia; g.beginPath(); g.moveTo(x + w / 2, y + h * 0.3); g.lineTo(x + w / 2 - 3, y + h * 0.55); g.lineTo(x + w / 2 + 3, y + h * 0.55); g.closePath(); g.fill(); }
    } else if (t === 'water') {
      g.strokeStyle = 'rgba(52,92,118,0.6)'; g.lineWidth = 1;
      for (var wl = 0; wl < 3; wl++) { var ly = y + h * (0.25 + 0.25 * wl); g.beginPath(); g.moveTo(x + 2 + hash(seed + wl) * 4, ly); g.lineTo(x + w - 2 - hash(seed + wl + 9) * 4, ly); g.stroke(); }
    }
    g.globalAlpha = 1;
  }
  /* each sea cell's distance (in cells, 8-way) to the nearest land, remembered per county */
  var SEA_DIST = {};
  function seaDist(G) {
    if (SEA_DIST[G.seed]) return SEA_DIST[G.seed];
    var d = new Array(SIM.N), q = [];
    for (var i = 0; i < SIM.N; i++) { d[i] = G.sea[i] ? 99 : 0; if (!G.sea[i]) q.push(i); }
    while (q.length) {
      var c = q.shift(), cx0 = SIM.cx(c), cy0 = SIM.cy(c);
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        var nx = cx0 + dx, ny = cy0 + dy; if (nx < 0 || ny < 0 || nx >= SIM.COLS || ny >= SIM.ROWS) continue;
        var n = ny * SIM.COLS + nx; if (d[n] > d[c] + 1) { d[n] = d[c] + 1; q.push(n); }
      }
    }
    SEA_DIST[G.seed] = d;
    return d;
  }
  function neighbourH(G, i, dx, dy) { var x = SIM.cx(i) + dx, y = SIM.cy(i) + dy; if (x < 0 || y < 0 || x >= SIM.COLS || y >= SIM.ROWS) return G.h[i]; return G.h[y * SIM.COLS + x]; }
  function isSummit(G, i) { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; if (neighbourH(G, i, dx, dy) > G.h[i]) return false; } return true; }
  /* contour lines by marching squares over the corner heights, drawn only across inked cells */
  function drawContours(G, r, mapped) {
    g.strokeStyle = 'rgba(120,78,40,0.55)'; g.lineWidth = 1;
    for (var y = 0; y < SIM.ROWS; y++) for (var x = 0; x < SIM.COLS; x++) {
      var i = y * SIM.COLS + x; if (!mapped(i) || G.ter[i] === 'water') continue;
      var h0 = cornerH(G, x, y), h1 = cornerH(G, x + 1, y), h2 = cornerH(G, x + 1, y + 1), h3 = cornerH(G, x, y + 1);
      var X = r.x + x * r.cw, Y = r.y + y * r.ch;
      for (var c = 0; c < CONTOURS.length; c++) {
        var lv = CONTOURS[c], pts = [];
        var e = [[h0, h1, X, Y, X + r.cw, Y], [h1, h2, X + r.cw, Y, X + r.cw, Y + r.ch], [h2, h3, X + r.cw, Y + r.ch, X, Y + r.ch], [h3, h0, X, Y + r.ch, X, Y]];
        for (var k = 0; k < 4; k++) {
          var ea = e[k][0], eb = e[k][1];
          if ((ea < lv) !== (eb < lv)) { var f = (lv - ea) / (eb - ea); pts.push([e[k][2] + (e[k][4] - e[k][2]) * f, e[k][3] + (e[k][5] - e[k][3]) * f]); }
        }
        if (pts.length >= 2) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); g.lineTo(pts[1][0], pts[1][1]); if (pts.length === 4) { g.moveTo(pts[2][0], pts[2][1]); g.lineTo(pts[3][0], pts[3][1]); } g.stroke(); }
      }
    }
  }
  function drawTown(G, k, cx0, cy0, m, inked, label) {
    var seed = G.towns[k] * 131;
    if (inked) {
      g.fillStyle = C.sepia;
      for (var b = 0; b < 6; b++) { var bx = cx0 + (hash(seed + b) - 0.5) * m * 0.7, by = cy0 + (hash(seed + b * 3) - 0.3) * m * 0.5; g.fillRect(bx - 2, by - 1.5, 3.5 + hash(seed + b * 5) * 2, 3); }
      g.fillRect(cx0 - 1, cy0 - m * 0.42, 2, m * 0.3); g.beginPath(); g.moveTo(cx0 - 2.5, cy0 - m * 0.12); g.lineTo(cx0, cy0 - m * 0.55); g.lineTo(cx0 + 2.5, cy0 - m * 0.12); g.fill();
    } else { g.strokeStyle = C.pencil; g.lineWidth = 1; g.beginPath(); g.arc(cx0, cy0, m * 0.2, 0, Math.PI * 2); g.stroke(); }
    if (label) {
      /* 1.1: on the compact shapes a place-name is at the type floor too (it read 7.3 css px on an upright phone) */
      var name = SIM.TOWN_NAMES[k], size = Math.max(compact() ? MIN() : 9, Math.round(m * 0.42));
      var tw0 = tw(name, size, '700', SERIF), half = tw0 / 2 + 3, ko = label.keepOut, placed = label.placed || [];
      var cx = function (x) { return Math.max(label.x0 + tw0 / 2 + 2, Math.min(label.x1 - tw0 / 2 - 2, x)); };
      var below = cy0 + m * 0.62 + size * 0.5, above = cy0 - m * 0.6;
      /* where the name goes: under the town (over it at the map's foot), as always; 1.1, the floor raised the names on
       * the compact maps, so a name that would touch one already placed tries over the town, then its right, then
       * its left. A name with nowhere to go, or one a panel over the map would cut in half, is not drawn at all */
      /* review_11 #3: four spots were not enough on SHORT (BRACKENHOLT vanished in 2 of 60 counties at 640x320), so the
       * diagonals and a line further down follow before a name is given up */
      var dxr = cx0 + tw0 / 2 + m * 0.3, dxl = cx0 - tw0 / 2 - m * 0.3;
      var cands = [[cx(cx0), below > label.y1 - 2 ? above : below], [cx(cx0), above], [cx(cx0 + m * 0.5 + tw0 / 2 + 3), cy0 + size * 0.36], [cx(cx0 - m * 0.5 - tw0 / 2 - 3), cy0 + size * 0.36],
        [cx(dxr), below], [cx(dxl), below], [cx(dxr), above], [cx(dxl), above], [cx(cx0), below + size + 3], [cx(cx0), above - size - 3]];
      for (var q = 0; q < cands.length; q++) {
        var lx = cands[q][0], ly = cands[q][1];
        if (label.y0 !== undefined && ly - size < label.y0 + 2) { if (q === 0) return; continue; }
        if (ly > label.y1 - 1) continue;
        if (ko && lx + half > ko.x && lx - half < ko.x + ko.w && ly > ko.y - 4 && ly - size < ko.y + ko.h + 4) { if (q === 0) return; continue; }
        var hit = false;
        /* two names closer than about a word space plus a letter read as ONE name ("MERROW BRACKENHOLT" at 6 px, seen
         * on the first sideways capture), so a placed name keeps 12 px clear on each side */
        for (var pi = 0; pi < placed.length; pi++) { var P0 = placed[pi]; if (lx + half + 9 > P0.x0 && lx - half - 9 < P0.x1 && ly + 3 > P0.y0 && ly - size - 3 < P0.y1) { hit = true; break; } }
        if (hit) continue;
        placed.push({ x0: lx - half, x1: lx + half, y0: ly - size, y1: ly + 3 });
        g.save(); g.shadowColor = 'rgba(240,230,200,0.9)'; g.shadowBlur = 3;
        T(inked ? name : titleCase(name) + '?', lx, ly, size, inked ? C.sepia : 'rgba(92,80,62,0.75)', 'center', inked ? '700' : '400', SERIF);
        g.restore();
        return;
      }
    }
  }
  function sheetEdges(G, r, a) {
    g.strokeStyle = 'rgba(90,60,30,0.35)'; g.lineWidth = 1; g.setLineDash([3, 4]);
    g.beginPath();
    for (var y = 0; y < SIM.ROWS; y++) for (var x = 0; x < SIM.COLS; x++) {
      var i = y * SIM.COLS + x, s = G.sheet[i]; if (s < 0) continue;
      if (x + 1 < SIM.COLS && G.sheet[i + 1] >= 0 && G.sheet[i + 1] !== s) { g.moveTo(r.x + (x + 1) * r.cw, r.y + y * r.ch); g.lineTo(r.x + (x + 1) * r.cw, r.y + (y + 1) * r.ch); }
      if (y + 1 < SIM.ROWS && G.sheet[i + SIM.COLS] >= 0 && G.sheet[i + SIM.COLS] !== s) { g.moveTo(r.x + x * r.cw, r.y + (y + 1) * r.ch); g.lineTo(r.x + (x + 1) * r.cw, r.y + (y + 1) * r.ch); }
    }
    g.stroke(); g.setLineDash([]);
    void a;
  }
  function stationXY(r, i) { return { x: r.x + (SIM.cx(i) + 0.5) * r.cw, y: r.y + (SIM.cy(i) + 0.5) * r.ch }; }
  function drawStation(st, p, m, now, hot) {
    var s = Math.max(5, m * 0.3);
    if (st.tower) {
      g.strokeStyle = C.sepia; g.lineWidth = 1;
      for (var t = 0; t < st.tower; t++) { var ty = p.y - s - 2 - t * 5; g.beginPath(); g.moveTo(p.x - 3, ty + 5); g.lineTo(p.x, ty); g.lineTo(p.x + 3, ty + 5); g.moveTo(p.x - 3, ty + 5); g.lineTo(p.x + 3, ty + 5); g.stroke(); }
    }
    g.beginPath(); g.moveTo(p.x, p.y - s); g.lineTo(p.x - s * 0.9, p.y + s * 0.6); g.lineTo(p.x + s * 0.9, p.y + s * 0.6); g.closePath();
    if (st.fixed) { g.fillStyle = st.base ? '#7a1f12' : C.redInk; g.fill(); g.strokeStyle = C.sepia; g.lineWidth = 1; g.stroke(); g.fillStyle = '#f4e9cf'; g.fillRect(p.x - 1, p.y - 1, 2, 2); }
    else { g.fillStyle = 'rgba(240,230,205,0.85)'; g.fill(); g.strokeStyle = 'rgba(70,60,45,0.9)'; g.lineWidth = 1.2; g.setLineDash([2, 1.5]); g.stroke(); g.setLineDash([]); }
    if (st.base) { g.strokeStyle = C.sepia; g.lineWidth = 1.5; g.beginPath(); g.moveTo(p.x - s, p.y + s * 0.95); g.lineTo(p.x + s, p.y + s * 0.95); g.stroke(); }
    if (hot) { g.strokeStyle = C.gold; g.lineWidth = 1.5; g.beginPath(); g.arc(p.x, p.y, s + 4, 0, Math.PI * 2); g.stroke(); }
    void now;
  }
  function drawNetwork(a, r, now) {
    var m = Math.min(r.cw, r.ch), working = {};
    for (var w = 0; w < a.obsWork.length; w++) if (a.obsWork[w] >= 0) working[a.obsWork[w]] = 1;
    for (var k = 0; k < a.edges.length; k++) {
      var e = a.edges[k], pa = stationXY(r, a.stations[e.a].i), pb = stationXY(r, a.stations[e.b].i);
      if (e.done) { g.strokeStyle = 'rgba(168,50,31,0.85)'; g.lineWidth = 1.3; g.beginPath(); g.moveTo(pa.x, pa.y); g.lineTo(pb.x, pb.y); g.stroke(); continue; }
      g.strokeStyle = 'rgba(80,70,55,0.55)'; g.lineWidth = 1; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(pa.x, pa.y); g.lineTo(pb.x, pb.y); g.stroke(); g.setLineDash([]);
      if (e.obs > 0) {
        var px = pa.x + (pb.x - pa.x) * e.obs, py = pa.y + (pb.y - pa.y) * e.obs;
        g.strokeStyle = 'rgba(168,50,31,0.8)'; g.lineWidth = 1.3; g.beginPath(); g.moveTo(pa.x, pa.y); g.lineTo(px, py); g.stroke();
        if (working[k]) {
          /* the observing party at its theodolite, and the heliotrope's flash from the far station */
          g.strokeStyle = C.sepia; g.lineWidth = 1; g.beginPath(); g.moveTo(px - 3, py + 4); g.lineTo(px, py - 1); g.lineTo(px + 3, py + 4); g.moveTo(px, py - 1); g.lineTo(px, py + 4); g.stroke();
          g.fillStyle = C.sepia; g.fillRect(px - 1.5, py - 3.5, 3, 2.5);
          var fl = 0.5 + 0.5 * Math.sin(now * 7 + k);
          if (a.levels.helio && fl > 0.6) { g.fillStyle = 'rgba(255,240,170,' + ((fl - 0.6) * 2.2).toFixed(2) + ')'; g.beginPath(); g.arc(pb.x, pb.y - m * 0.3, 3 + fl * 3, 0, Math.PI * 2); g.fill(); }
        }
      }
    }
    for (var f = state.flashes.length - 1; f >= 0; f--) {
      var fx = state.flashes[f], age = state.t - fx.at; if (age > 1.6) { state.flashes.splice(f, 1); continue; }
      var s0 = a.stations[fx.s], fixes = s0 ? SIM.fixes(a, fx.s) : [];
      if (!s0) continue;
      var p0 = stationXY(r, s0.i);
      for (var q = 0; q < fixes.length && q < 2; q++) {
        var p1 = stationXY(r, a.stations[fixes[q][0]].i), p2 = stationXY(r, a.stations[fixes[q][1]].i);
        g.fillStyle = 'rgba(178,58,36,' + (0.28 * (1 - age / 1.6)).toFixed(3) + ')'; g.beginPath(); g.moveTo(p0.x, p0.y); g.lineTo(p1.x, p1.y); g.lineTo(p2.x, p2.y); g.closePath(); g.fill();
      }
    }
    var hs = state.hoverCell >= 0 ? SIM.stationAt(a, state.hoverCell) : state.cursor >= 0 ? SIM.stationAt(a, state.cursor) : -1;
    /* the error circle, the surveyor's own notation: every fixed station off the baseline carries a dashed ring whose
     * radius is its error, so a badly fixed corner of the county is visible at a glance */
    g.strokeStyle = 'rgba(120,40,24,0.55)'; g.lineWidth = 1; g.setLineDash([2, 2]);
    for (var s0 = 0; s0 < a.stations.length; s0++) {
      var S0 = a.stations[s0]; if (!S0.fixed || S0.base || S0.err <= 0) continue;
      var pr = stationXY(r, S0.i); g.beginPath(); g.arc(pr.x, pr.y, Math.min(m * 1.6, 5 + S0.err * m * 1.4), 0, Math.PI * 2); g.stroke();
    }
    g.setLineDash([]);
    for (var s = 0; s < a.stations.length; s++) drawStation(a.stations[s], stationXY(r, a.stations[s].i), m, now, s === hs);
  }
  function drawWeather(a, r, now) {
    if (a.wx === 1) {
      /* haze: a warm veil strong enough to read at a glance, and soft bands drifting across it */
      g.fillStyle = 'rgba(236,206,146,0.28)'; g.fillRect(r.x, r.y, r.w, r.h);
      for (var b = 0; b < 4; b++) { var by = r.y + ((b * 0.27 + now * 0.01) % 1) * r.h; var gr = g.createLinearGradient(0, by - 34, 0, by + 34); gr.addColorStop(0, 'rgba(250,232,190,0)'); gr.addColorStop(0.5, 'rgba(250,232,190,0.3)'); gr.addColorStop(1, 'rgba(250,232,190,0)'); g.fillStyle = gr; g.fillRect(r.x, by - 34, r.w, 68); }
    } else if (a.wx === 2) {
      for (var k = 0; k < 9; k++) {
        var fx = r.x + ((hash(k * 7) * 1.4 + now * 0.012 * (0.6 + hash(k * 3))) % 1.4 - 0.2) * r.w, fy = r.y + hash(k * 11) * r.h, rad = 60 + hash(k * 5) * 90;
        var fg = g.createRadialGradient(fx, fy, rad * 0.1, fx, fy, rad); fg.addColorStop(0, 'rgba(246,244,236,0.55)'); fg.addColorStop(1, 'rgba(246,244,236,0)');
        g.fillStyle = fg; g.fillRect(r.x, r.y, r.w, r.h);
      }
      g.fillStyle = 'rgba(236,234,226,0.18)'; g.fillRect(r.x, r.y, r.w, r.h);
    }
  }
  function drawMapAt(a, r, now, opts) {
    opts = opts || {};
    var G = SIM.geo(a), m = Math.min(r.cw, r.ch);
    drawPaper(r, a.seed);
    var mapped = opts.allMapped ? function () { return true; } : function (i) { return !!a.cells[i].m; };
    for (var i = 0; i < SIM.N; i++) {
      var x = r.x + SIM.cx(i) * r.cw, y = r.y + SIM.cy(i) * r.ch;
      if (G.sea[i]) continue;                       /* the water is laid in its own pass below */
      if (mapped(i)) { if (G.ter[i] !== 'water') { var age = opts.allMapped || !a.cells[i].at ? 9 : (a.t - a.cells[i].at); inkCell(G, a, i, x, y, r.cw, r.ch, Math.min(1, 0.15 + age / 0.5)); } }
      else sketchCell(G, i, x, y, r.cw, r.ch);
    }
    /* THE WATER: the sea (known from the start) and every surveyed lake, laid as rounded, overlapping shapes so a
     * coast reads as a coast and not as the cell grid. The shore is drawn by the union trick: a dark ring painted
     * first under every water shape, the water on top, so the ring shows only where water meets land. Then the
     * engraved water lining, densest at the shore. */
    var water = [], ov = Math.max(2, Math.round(m * 0.14)), rad = m * 0.45;
    for (var w0 = 0; w0 < SIM.N; w0++) if (G.sea[w0] || (G.ter[w0] === 'water' && mapped(w0))) water.push(w0);
    var wr = function (k, grow) { var X0 = r.x + SIM.cx(k) * r.cw, Y0 = r.y + SIM.cy(k) * r.ch; rr(X0 - ov - grow, Y0 - ov - grow, r.cw + 2 * (ov + grow), r.ch + 2 * (ov + grow), rad + grow); };
    g.fillStyle = 'rgba(40,62,74,0.9)';
    for (var w1 = 0; w1 < water.length; w1++) { wr(water[w1], 1.4); g.fill(); }
    for (var w2 = 0; w2 < water.length; w2++) { g.fillStyle = G.sea[water[w2]] ? '#9cb4bd' : '#a9c3cc'; wr(water[w2], 0); g.fill(); }
    var sdist = seaDist(G);
    for (var w3 = 0; w3 < water.length; w3++) {
      var k3 = water[w3], X3 = r.x + SIM.cx(k3) * r.cw, Y3 = r.y + SIM.cy(k3) * r.ch, nl = G.sea[k3] ? Math.max(0, 4 - sdist[k3]) : 3;
      if (nl <= 0) continue;
      g.strokeStyle = 'rgba(46,78,96,' + (0.16 + 0.1 * nl).toFixed(2) + ')'; g.lineWidth = 1; g.beginPath();
      var step = r.ch / (nl + 1);
      for (var ln = 1; ln <= nl; ln++) { var yy = Math.round(Y3 + ln * step) + 0.5; g.moveTo(X3 + 2, yy); g.lineTo(X3 + r.cw - 2, yy); }
      g.stroke();
    }
    drawContours(G, r, mapped);
    if (!opts.noSheets) sheetEdges(G, r, a);
    /* labels stay inside the map, or inside the crop a capture will cut from it (the cover) */
    var lb = opts.labelBox || { x: r.x, y: r.y, w: r.w, h: r.h };
    var placedLabels = [];
    for (var k = 0; k < G.towns.length; k++) { var tp = stationXY(r, G.towns[k]); drawTown(G, k, tp.x, tp.y, m, mapped(G.towns[k]), { x0: lb.x, x1: lb.x + lb.w, y0: opts.labelBox ? lb.y : undefined, y1: lb.y + lb.h, keepOut: opts.keepOut, placed: placedLabels }); }
    if (!opts.noNetwork) drawNetwork(a, r, now);
    if (!opts.noWeather) drawWeather(a, r, now);
  }
  function drawMap(a) {
    var r = mapRect(), now = state.t;
    g.save(); rr(r.x - 2, r.y - 2, r.w + 4, r.h + 4, 4); g.clip();
    drawMapAt(a, r, now);
    drawPreview(a, r);
    drawCursor(r);
    g.restore();
    g.strokeStyle = C.panelEdge; g.lineWidth = 2; rr(r.x - 2, r.y - 2, r.w + 4, r.h + 4, 4); g.stroke();
    g.strokeStyle = 'rgba(59,42,26,0.8)'; g.lineWidth = 1; g.strokeRect(r.x + 2.5, r.y + 2.5, r.w - 5, r.h - 5);
  }
  /* RAISE: what a station here would see; TOWER: the station's reach */
  function focusCell() { return state.hoverCell >= 0 ? state.hoverCell : state.cursor; }
  function drawPreview(a, r) {
    var i = focusCell(); if (i < 0) return;
    var m = Math.min(r.cw, r.ch), p = stationXY(r, i), si = SIM.stationAt(a, i);
    if (state.tool === 'raise' && si < 0 && !SIM.geo(a).sea[i]) {
      var why = SIM.whyNotRaise(a, i), pv = SIM.preview(a, i);
      /* a place no station may stand shows no sightlines, only a crossed ghost (lines from it read as a promise) */
      if (why && why !== 'not enough funds') {
        g.globalAlpha = 0.35; drawStation({ fixed: false, tower: 0 }, p, m, 0, false); g.globalAlpha = 1;
        g.strokeStyle = 'rgba(214,110,20,0.95)'; g.lineWidth = 2; g.beginPath(); g.moveTo(p.x - 6, p.y - 6); g.lineTo(p.x + 6, p.y + 6); g.moveTo(p.x + 6, p.y - 6); g.lineTo(p.x - 6, p.y + 6); g.stroke();
        return;
      }
      g.strokeStyle = 'rgba(59,42,26,0.45)'; g.lineWidth = 1; g.setLineDash([4, 4]); g.beginPath(); g.arc(p.x, p.y, SIM.range(a) * m, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
      for (var k = 0; k < pv.length; k++) {
        var q = stationXY(r, a.stations[pv[k].s].i);
        /* green: it would see that station; ORANGE dashes with a cross: the ground or a wood is in the way (never the
         * red of an observed sight); faint grey: out of the telescope's range */
        var blk = !pv[k].ok && pv[k].why === 'blocked';
        g.strokeStyle = pv[k].ok ? (a.stations[pv[k].s].fixed ? 'rgba(40,110,60,0.95)' : 'rgba(40,110,60,0.5)') : blk ? 'rgba(214,110,20,0.95)' : 'rgba(80,70,60,0.35)';
        g.lineWidth = pv[k].ok ? 2 : blk ? 1.8 : 1; g.setLineDash(pv[k].ok ? [] : blk ? [5, 3] : [2, 3]);
        g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.stroke(); g.setLineDash([]);
        if (blk) { var mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2; g.lineWidth = 2; g.beginPath(); g.moveTo(mx - 4, my - 4); g.lineTo(mx + 4, my + 4); g.moveTo(mx + 4, my - 4); g.lineTo(mx - 4, my + 4); g.stroke(); }
      }
      g.globalAlpha = why && why !== 'not enough funds' ? 0.35 : 0.8;
      drawStation({ fixed: false, tower: 0 }, p, m, 0, false);
      g.globalAlpha = 1;
    } else if (si >= 0) {
      g.strokeStyle = 'rgba(59,42,26,0.4)'; g.lineWidth = 1; g.setLineDash([4, 4]); g.beginPath(); g.arc(p.x, p.y, SIM.detail(a) * m, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
      if (state.tool === 'tower') {
        /* TOWER: every sight in range the ground blocks now; green if one more stage would open it, orange crossed if not */
        var tg = SIM.towerGain(a, si);
        for (var t2 = 0; t2 < tg.length; t2++) {
          var q2 = stationXY(r, a.stations[tg[t2].s].i);
          g.strokeStyle = tg[t2].ok ? 'rgba(40,110,60,0.95)' : 'rgba(214,110,20,0.8)'; g.lineWidth = tg[t2].ok ? 2 : 1.4; g.setLineDash(tg[t2].ok ? [] : [5, 3]);
          g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q2.x, q2.y); g.stroke(); g.setLineDash([]);
          if (!tg[t2].ok) { var mx2 = (p.x + q2.x) / 2, my2 = (p.y + q2.y) / 2; g.lineWidth = 2; g.beginPath(); g.moveTo(mx2 - 4, my2 - 4); g.lineTo(mx2 + 4, my2 + 4); g.moveTo(mx2 + 4, my2 - 4); g.lineTo(mx2 - 4, my2 + 4); g.stroke(); }
        }
      }
    }
  }
  function drawCursor(r) {
    var h = state.hoverCell, cur = state.cursor;
    if (h >= 0) { var c1 = cellRect(h); g.strokeStyle = 'rgba(59,42,26,0.75)'; g.lineWidth = 1.2; g.strokeRect(c1.x + 1, c1.y + 1, c1.w - 2, c1.h - 2); }
    if (cur >= 0) { var c2 = cellRect(cur); g.strokeStyle = C.red; g.lineWidth = 2; g.setLineDash([4, 3]); g.strokeRect(c2.x + 1.5, c2.y + 1.5, c2.w - 3, c2.h - 3); g.setLineDash([]); }
    void r;
  }

  /* ------------------------------------------------------------ top bar */
  var WX_COL = ['#b9e0a0', '#f0cf8a', '#d8d4cc'];
  function drawTop(a) {
    var t = L().top;
    g.fillStyle = '#120e09'; g.fillRect(t.x, t.y, t.w, t.h);
    g.fillStyle = C.panelEdge; g.fillRect(t.x, t.y + t.h - 1, t.w, 1);
    var small = fs(12), G = SIM.geo(a);
    var mapped = SIM.mappedCount(a) / Math.max(1, G.land);
    if (shape === 'wide') {
      T('THEODOLITE', 14, 34, 23, C.gold, 'left', '700', SERIF);
      var x = 186, y1 = 22, y2 = 41;
      T('DAY ' + (SIM.day(a) + 1) + ' · ' + SIM.SEASONS[SIM.season(a)] + ' · YEAR ' + SIM.year(a), x, y1, small, C.inkDim, 'left', '700');
      T(SIM.WEATHER[a.wx], x, y2, small, WX_COL[a.wx], 'left', '700');
      T('FUNDS', 402, y1, small, C.inkFaint, 'left', '700'); T(fmt(a.funds), 402, y2, fs(15), C.gold, 'left', '700');
      T('MAPPED', 478, y1, small, C.inkFaint, 'left', '700'); T(pct(mapped), 478, y2, fs(15), C.ink, 'left', '700');
      T('SHEETS', 560, y1, small, C.inkFaint, 'left', '700'); T(SIM.goodSheets(a) + ' of ' + SIM.NT, 560, y2, fs(15), SIM.goodSheets(a) >= SIM.NT ? C.good : C.ink, 'left', '700');
      T('STATIONS', 632, y1, small, C.inkFaint, 'left', '700'); T(SIM.fixedCount(a) + '/' + a.stations.length, 632, y2, fs(15), C.ink, 'left', '700');
      btn('pause', 712, 11, 56, 30, 'PAUSE');
      btn('help', 772, 11, 52, 30, 'HELP');
      btn('mute', 828, 11, 66, 30, AUDIO.muted() ? 'MUTED' : 'SOUND');
      btn('speed', 898, 11, 50, 30, state.speed > 1 ? '3x' : '1x', true, state.speed > 1);
    } else if (shape === 'short') {
      /* SHORT: one row. The name, the date over the weather, FUNDS against the four buttons; the other three counts
       * sit in the strip under the map (drawField). Buttons are 34 tall: 26.9 css px at 640x320, the smallest window
       * the gate renders */
      var dx = 10 + T('THEODOLITE', 10, 31, 20, C.gold, 'left', '700', SERIF) + 14;
      var sb = [['speed', 44, state.speed > 1 ? '3x' : '1x'], ['mute', 68, AUDIO.muted() ? 'MUTED' : 'SOUND'], ['help', 56, 'HELP'], ['pause', 64, 'PAUSE']], bx = 714;
      for (var q = 0; q < sb.length; q++) { bx -= sb[q][1]; btn(sb[q][0], bx, 6, sb[q][1], 34, sb[q][2], true, sb[q][0] === 'speed' && state.speed > 1); bx -= 6; }
      T('DAY ' + (SIM.day(a) + 1) + ' · ' + SIM.SEASONS[SIM.season(a)] + ' · YEAR ' + SIM.year(a), dx, 20, small, C.inkDim, 'left', '700');
      T(SIM.WEATHER[a.wx], dx, 39, small, WX_COL[a.wx], 'left', '700');
      T('FUNDS', bx - 6, 20, small, C.inkFaint, 'right', '700'); T(fmt(a.funds), bx - 6, 40, fs(15), C.gold, 'right', '700');
    } else {
      T('THEODOLITE', 10, 30, 21, C.gold, 'left', '700', SERIF);
      btn('pause', 166, 6, 64, 36, 'PAUSE'); btn('help', 236, 6, 64, 36, 'HELP'); btn('mute', 306, 6, 98, 36, AUDIO.muted() ? 'MUTED' : 'SOUND'); btn('speed', 410, 6, 62, 36, state.speed > 1 ? '3x' : '1x', true, state.speed > 1);
      T('DAY ' + (SIM.day(a) + 1) + ' · ' + SIM.SEASONS[SIM.season(a)] + ' · Y' + SIM.year(a), 10, 60, small, C.inkDim, 'left', '700');
      T(SIM.WEATHER[a.wx], 470, 60, small, WX_COL[a.wx], 'right', '700');
      T('FUNDS ' + fmt(a.funds), 10, 79, small, C.gold, 'left', '700');
      T('MAPPED ' + pct(mapped), 142, 79, small, C.ink, 'left', '700');
      T('SHEETS ' + SIM.goodSheets(a) + '/' + SIM.NT, 282, 79, small, C.ink, 'left', '700');
      T('ST ' + SIM.fixedCount(a) + '/' + a.stations.length, 470, 79, small, C.ink, 'right', '700');
    }
  }

  /* ------------------------------------------------------------ the field */
  var TOOLS = [['raise', 'RAISE'], ['tower', 'TOWER'], ['read', 'READ']];
  function drawField(a) {
    var f = L().field, wide = shape === 'wide';
    if (shape === 'short') {
      /* SHORT: the strip under the map. The three counts the top bar has no room for, then the three tools, 34 tall;
       * everything else THE FIELD shows lives in its own tab (drawFieldTab) */
      var G0 = SIM.geo(a), cnt = [['MAPPED', pct(SIM.mappedCount(a) / Math.max(1, G0.land)), C.ink], ['SHEETS', SIM.goodSheets(a) + ' of ' + SIM.NT, SIM.goodSheets(a) >= SIM.NT ? C.good : C.ink], ['STATIONS', SIM.fixedCount(a) + '/' + a.stations.length, C.ink]];
      var cw3 = f.w / 3, cy3 = f.y + fs(12) - 2;
      for (var c3 = 0; c3 < cnt.length; c3++) { var lx3 = f.x + c3 * cw3 + 2, lw3 = T(cnt[c3][0], lx3, cy3, fs(12), C.inkFaint, 'left', '700'); T(cnt[c3][1], lx3 + lw3 + 5, cy3, fs(12), cnt[c3][2], 'left', '700'); }
      var gs = 6, tbs = (f.w - 2 * gs) / 3;
      for (var k3 = 0; k3 < TOOLS.length; k3++) btn('tool:' + TOOLS[k3][0], f.x + k3 * (tbs + gs), f.y + f.h - 34, tbs, 34, TOOLS[k3][1], true, state.tool === TOOLS[k3][0]);
      return;
    }
    panelBack(f.x, f.y, f.w, f.h);
    var x = f.x + 10, y = f.y + fs(17), w = f.w - 20;
    T('THE FIELD', x, y, fs(12), C.gold, 'left', '700');
    T(fmt(SIM.incomeRate(a)) + ' funds a day', f.x + f.w - 10, y, fs(11), C.inkFaint, 'right');
    var gap = 6, tb = (w - 2 * gap) / 3, th = wide ? 32 : 38, ty = y + 8;
    var subs = { raise: 'a station', tower: 'lift the eye', read: 'what is here' };
    for (var k = 0; k < TOOLS.length; k++) btn('tool:' + TOOLS[k][0], x + k * (tb + gap), ty, tb, th, TOOLS[k][1], true, state.tool === TOOLS[k][0], wide ? undefined : subs[TOOLS[k][0]]);
    var ly = ty + th + fs(18), lh = fs(15);
    var undone = 0, reading = 0; for (var e = 0; e < a.edges.length; e++) if (!a.edges[e].done) undone++;
    for (var p = 0; p < a.obsWork.length; p++) if (a.obsWork[p] >= 0) reading++;
    function row(label, value, col) { T(label, x, ly, fs(12), C.inkFaint); T(value, x + w, ly, fs(12), col || C.ink, 'right', '700'); ly += lh; }
    row('sights to read', undone + ' of ' + a.edges.length + (undone ? ' · ' + reading + ' being read' : ''), undone ? C.ink : C.good);
    row('observing parties', a.parties + ' · range ' + SIM.range(a).toFixed(1) + ' cells');
    row('plane-table parties', a.planes + ' · reach ' + SIM.detail(a).toFixed(1) + ' cells');
    /* what the plane-tables are doing, said truly: a stall with unmapped land left means no fixed station reaches it */
    var tg = SIM.inkTarget(a), leftToMap = SIM.landCount(a) - SIM.mappedCount(a);
    row('the plane-tables', tg ? (tg[1] ? 'revising a cell' : 'inking new ground') : leftToMap > 0 ? 'no fixed station reaches the rest' : 'the county is inked', tg || !leftToMap ? C.good : C.gold);
    if (wide) {
      /* the forecast, with the barometer; without it, today and the season's odds */
      ly += 4;
      if (a.levels.barometer) {
        T('THE BAROMETER', x, ly, fs(11), C.gold, 'left', '700');
        var fc = SIM.forecast(a, 6), cw0 = (w - 100) / 6;
        for (var d = 0; d < fc.length; d++) { var fx = x + 100 + d * cw0; g.fillStyle = WX_COL[fc[d]]; rr(fx + 2, ly - 11, cw0 - 4, 14, 3); g.fill(); T(SIM.WEATHER[fc[d]].charAt(0) + (d === 0 ? ' now' : ''), fx + cw0 / 2, ly, fs(10), '#1b1409', 'center', '700'); }
        ly += lh + 2;
      } else { T('A barometer would forecast six days of weather.', x, ly, fs(11), C.inkFaint); ly += lh; }
      var fcell = focusCell();
      var HINT = { raise: 'Hover the map: a station raised there would see every green line; an orange crossed line is blocked by the ground or a wood.',
        tower: 'Hover a station: a green line is a sight a tower there would open, an orange crossed line stays blocked. Click to build it.',
        read: 'Click anything on the map to read it: a station\'s error and best triangle, a cell\'s height, sheet and error.' };
      var info = fcell >= 0 ? cellInfo(a, fcell) : HINT[state.tool];
      wrapText(info, x, ly + 4, w, fs(11), C.inkDim, '400', fs(11) + 4);
      drawLegend(x, f.y + f.h - 62, w);
    } else {
      if (a.levels.barometer) {
        var fc2 = SIM.forecast(a, 6), cw1 = (w - 110) / 6;
        T('forecast', x, ly, fs(12), C.inkFaint);
        for (var d2 = 0; d2 < fc2.length; d2++) { var fx2 = x + 110 + d2 * cw1; g.fillStyle = WX_COL[fc2[d2]]; rr(fx2 + 2, ly - 12, cw1 - 4, 16, 3); g.fill(); T(SIM.WEATHER[fc2[d2]].charAt(0), fx2 + cw1 / 2, ly, fs(11), '#1b1409', 'center', '700'); }
      } else T('No barometer: buy one to see six days ahead.', x, ly, fs(12), C.inkFaint);
    }
  }
  /* SHORT (1.1): THE FIELD's rows as a tab of their own. A value too long to sit beside its label goes on the line
   * under it (measured at draw time), then the forecast, then the map's key in two columns at the foot */
  function drawFieldTab(a, c) {
    var x = c.x, w = c.w, size = fs(12), lh = size + 5, ly = c.y + size;
    var undone = 0, reading = 0; for (var e = 0; e < a.edges.length; e++) if (!a.edges[e].done) undone++;
    for (var p = 0; p < a.obsWork.length; p++) if (a.obsWork[p] >= 0) reading++;
    var tg = SIM.inkTarget(a), leftToMap = SIM.landCount(a) - SIM.mappedCount(a);
    var rows = [
      ['stipend and sales', fmt(SIM.incomeRate(a)) + ' funds a day', C.gold],
      ['sights to read', undone + ' of ' + a.edges.length + (undone ? ' · ' + reading + ' being read' : ''), undone ? C.ink : C.good],
      ['observing parties', a.parties + ' · range ' + SIM.range(a).toFixed(1) + ' cells', C.ink],
      ['plane-table parties', a.planes + ' · reach ' + SIM.detail(a).toFixed(1) + ' cells', C.ink],
      ['the plane-tables', tg ? (tg[1] ? 'revising a cell' : 'inking new ground') : leftToMap > 0 ? 'no fixed station reaches the rest' : 'the county is inked', tg || !leftToMap ? C.good : C.gold],
    ];
    for (var r = 0; r < rows.length; r++) {
      T(rows[r][0], x, ly, size, C.inkFaint);
      if (tw(rows[r][0], size) + tw(rows[r][1], size, '700') + 12 > w) ly += lh;
      T(rows[r][1], x + w, ly, size, rows[r][2], 'right', '700'); ly += lh;
    }
    ly += 3;
    if (a.levels.barometer) {
      T('forecast', x, ly, size, C.inkFaint);
      var fc = SIM.forecast(a, 6), fw0 = (w - 84) / 6;
      for (var d = 0; d < fc.length; d++) { var fx = x + 84 + d * fw0; g.fillStyle = WX_COL[fc[d]]; rr(fx + 2, ly - size, fw0 - 4, size + 5, 3); g.fill(); T(SIM.WEATHER[fc[d]].charAt(0), fx + fw0 / 2, ly, size, '#1b1409', 'center', '700'); }
      ly += lh;
    } else ly = wrapText('A barometer would forecast six days of weather.', x, ly, w, size, C.inkFaint, '400', lh);
    var ky = c.y + c.h - 80;
    /* what the tool in hand does, in the room left above the key, only when all of it fits (measured, never cut) */
    var HINT = { raise: coarse() ? 'Tap land once to see a station\'s sightlines and price; tap again to raise it.' : 'Hover the map to see what a station there would see; click to raise it.',
      tower: coarse() ? 'Tap a station once to see the sights a tower would open; tap again to build it.' : 'Hover a station to see the sights a tower would open; click to build it.',
      read: (coarse() ? 'Tap' : 'Click') + ' anything on the map to read it in the bar below.' };
    var hl = splitLines(HINT[state.tool], w, size, null, '400');
    /* the last line's baseline is (n - 1) line-heights down, its descenders about 4 px below that; the key starts at ky - 4 */
    if (ly + 2 + (hl.length - 1) * lh + 4 <= ky - 8) wrapText(HINT[state.tool], x, ly + 2, w, size, C.inkDim, '400', lh);
    if (ly < ky) drawLegend(x, ky, w, 2);
  }
  /* the map's key, drawn with the map's own symbols: what a player needs to read the network at a glance */
  function drawLegend(x, y, w, cols) {
    cols = cols || 3;
    var nrow = Math.ceil(6 / cols);
    g.fillStyle = 'rgba(233,220,184,0.9)'; rr(x - 2, y - 4, w + 4, nrow * 26 + 6, 4); g.fill();
    var cw0 = w / cols, items = [
      ['fixed station', function (px, py) { drawStation({ fixed: true, tower: 0 }, { x: px, y: py }, 22, 0, false); }],
      ['unfixed station', function (px, py) { drawStation({ fixed: false, tower: 0 }, { x: px, y: py }, 22, 0, false); }],
      ['baseline end', function (px, py) { drawStation({ fixed: true, base: true, tower: 0 }, { x: px, y: py }, 22, 0, false); }],
      ['sight read', function (px, py) { g.strokeStyle = 'rgba(168,50,31,0.85)'; g.lineWidth = 1.3; g.beginPath(); g.moveTo(px - 10, py); g.lineTo(px + 10, py); g.stroke(); }],
      ['sight to read', function (px, py) { g.strokeStyle = 'rgba(80,70,55,0.7)'; g.lineWidth = 1; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(px - 10, py); g.lineTo(px + 10, py); g.stroke(); g.setLineDash([]); }],
      ['tower', function (px, py) { drawStation({ fixed: true, tower: 1 }, { x: px, y: py + 3 }, 22, 0, false); }],
    ];
    for (var k = 0; k < items.length; k++) {
      var ix = x + (k % cols) * cw0 + 14, iy = y + 12 + Math.floor(k / cols) * 26;
      items[k][1](ix, iy);
      T(items[k][0], ix + 16, iy + 4, fs(11), '#3b2a1a', 'left', '700');
    }
  }
  function stationInfo(a, s) {
    var st = a.stations[s], ed = SIM.edgesOf(a, s), done = 0; for (var k = 0; k < ed.length; k++) if (ed[k].done) done++;
    var fx = SIM.fixes(a, s), best = null; for (var q = 0; q < fx.length; q++) if (!best || fx[q][2] < best[2]) best = fx[q];
    var head = st.base ? 'A BASELINE STATION, measured by chain: no error' : st.fixed ? 'A FIXED STATION, error ' + st.err.toFixed(2) + ' chains' : 'AN UNFIXED STATION: it needs observed sights to two fixed stations';
    return head + ' · ' + (st.tower ? 'tower ' + st.tower + ' · ' : '') + done + ' of ' + ed.length + ' sights read' + (best ? ' · best triangle ' + Math.round(best[3]) + ' degrees at this station' : '');
  }
  function cellInfo(a, i) {
    var G = SIM.geo(a), s = SIM.stationAt(a, i);
    if (s >= 0 && state.tool === 'tower') {
      var tw = SIM.towerGain(a, s), op = 0, opF = 0, whyT = SIM.whyNotTower(a, s);
      for (var t3 = 0; t3 < tw.length; t3++) if (tw[t3].ok) { op++; if (a.stations[tw[t3].s].fixed) opF++; }
      return stationInfo(a, s) + (whyT && whyT !== 'not enough funds' ? ' · ' + whyT : ' · a tower here: ' + SIM.towerCost(a, s) + ' funds, ' + (op ? 'opens ' + op + (op === 1 ? ' sight' : ' sights') + (opF ? ' (' + opF + ' to fixed stations)' : '') : 'opens no sight in range'));
    }
    if (s >= 0) return stationInfo(a, s);
    if (G.sea[i]) return 'THE SEA · not on any sheet: the Board surveys the land and its lakes.';
    var t = G.ter[i], tn = G.towns.indexOf(i), kind = tn >= 0 ? SIM.TOWN_NAMES[tn] : { low: 'LOW GROUND', forest: 'A WOOD', hill: 'A HILL', peak: 'HIGH GROUND', water: 'A LAKE' }[t];
    var sh = G.sheet[i] >= 0 ? ' · the ' + SIM.TOWN_NAMES[G.sheet[i]] + ' sheet' : '';
    var c = a.cells[i], m = c.m ? ' · mapped, error ' + c.err.toFixed(2) : ' · unmapped';
    var rs = '';
    if (state.tool === 'raise' && tn < 0 && t !== 'water') {
      var why = SIM.whyNotRaise(a, i), pv = SIM.preview(a, i), fs0 = 0, un = 0;
      for (var k = 0; k < pv.length; k++) if (pv[k].ok) { if (a.stations[pv[k].s].fixed) fs0++; else un++; }
      rs = why && why !== 'not enough funds' ? ' · ' + why : ' · a station here: ' + SIM.stationCost(a, i) + ' funds, sees ' + fs0 + ' fixed' + (un ? ' and ' + un + ' unfixed' : '') + (fs0 >= 2 ? '' : fs0 === 1 ? ' (it needs two)' : ' (it needs two fixed)');
      var ff = fs0 >= 2 ? SIM.forecastFix(a, i) : null;
      if (ff && !(why && why !== 'not enough funds')) rs += ' · once read: error ' + ff.err.toFixed(2) + ' (' + SIM.GRADE_NAMES[ff.grade] + '), triangle ' + Math.round(ff.ang) + ' degrees';
    }
    return kind + ', height ' + Math.round(G.h[i] * 100) + sh + m + rs;
  }

  /* -------------------------------------------------------------- panel */
  var TABS = [['instruments', 'INSTRUMENTS'], ['sheets', 'THE SHEETS'], ['notes', 'FIELD NOTES']];
  /* SHORT has a fourth tab, THE FIELD, and shorter names so four fit in its 322 px panel */
  var TABS_SHORT = [['field', 'FIELD'], ['instruments', 'INSTRUMENTS'], ['sheets', 'SHEETS'], ['notes', 'NOTES']];
  function tabs() { return shape === 'short' ? TABS_SHORT : TABS; }
  function tabOk(t) { var l = tabs(); for (var i = 0; i < l.length; i++) if (l[i][0] === t) return true; return false; }
  function panelFrame() {
    var p = L().panel;
    panelBack(p.x, p.y, p.w, p.h);
    var TB = tabs(), tw2 = shape === 'wide' ? 128 : 144, th = shape === 'wide' ? 30 : shape === 'short' ? 32 : 36;
    if (shape === 'short') {
      /* each tab as wide as its name plus an equal share of what is left, measured at the size drawButtons uses */
      var lw = [], sum = 0, avail = p.w - 16 - 6 * (TB.length - 1);
      for (var j = 0; j < TB.length; j++) { lw.push(tw(TB[j][1], fs(12), '700')); sum += lw[j]; }
      var pad = (avail - sum) / TB.length, tx = p.x + 8;
      for (var m = 0; m < TB.length; m++) { btn('tab:' + TB[m][0], tx, p.y + 8, lw[m] + pad, th, TB[m][1], true, state.tab === TB[m][0]); tx += lw[m] + pad + 6; }
    } else for (var i = 0; i < TB.length; i++) btn('tab:' + TB[i][0], p.x + 8 + i * (tw2 + 6), p.y + 8, tw2, th, TB[i][1], true, state.tab === TB[i][0]);
    if (shape === 'wide') {
      var a = state.county;
      T('the county is done when every sheet is published at grade B or better', p.x + p.w - 12, p.y + 28, fs(11), C.inkFaint, 'right');
      void a;
    }
    return { x: p.x + 12, y: p.y + th + 18, w: p.w - 24, h: p.h - th - 26 };
  }
  var UPG = [
    ['party', 'OBSERVING PARTY'], ['plane', 'PLANE-TABLE PARTY'], ['barometer', 'BAROMETER'], ['scope', 'LONGER TELESCOPE'], ['alidade', 'BETTER ALIDADE'],
    ['vernier', 'FINER VERNIER'], ['helio', 'HELIOTROPES'], ['mules', 'MULE TRAIN'], ['checkbase', 'CHECK BASELINE'], ['press', 'PRINTING PRESS'],
  ];
  var SHORT_NAME = { party: 'OBSERVERS', plane: 'PLANE-TABLES', barometer: 'BAROMETER', scope: 'TELESCOPE', alidade: 'ALIDADE', vernier: 'VERNIER', helio: 'HELIOTROPES', mules: 'MULE TRAIN', checkbase: 'CHECK BASE', press: 'PRESS' };
  var DONE = { party: function (a) { return a.parties + ' parties, the most'; }, plane: function (a) { return a.planes + ' parties, the most'; }, barometer: function () { return 'six days ahead'; },
    scope: function (a) { return 'range ' + SIM.range(a).toFixed(1) + ' cells'; }, alidade: function (a) { return 'reach ' + SIM.detail(a).toFixed(1) + ' cells'; }, vernier: function (a) { return 'error per sight x' + SIM.vernier(a); },
    helio: function () { return 'seen through haze'; }, mules: function () { return 'sights read faster'; }, checkbase: function () { return 'both chained'; }, press: function () { return 'copies sell 1.8x'; } };
  var UPGRADE_INFO = {
    party: 'another observing party: one more sight read at a time', plane: 'another plane-table party: the ground is inked faster',
    barometer: 'forecasts the next six days of weather in THE FIELD', scope: 'a longer telescope: every station sees farther, and new sightlines open (5.0, 6.5, 8.5 cells)',
    alidade: 'a better alidade: the plane-tables draw farther round each fixed station (2.5, 3.3, 4.2 cells)', vernier: 'a finer vernier: every station is re-reckoned at once with less error per sight (x0.7, then x0.5), and the plane-tables redraw what improves',
    helio: 'heliotropes flash sunlight from the far station: long sights can be read in haze', mules: 'a mule train carries the instruments: every sight is read faster',
    checkbase: 'chain a second measured baseline along the observed sight whose ends carry the most error: both ends drop to no error, and every station fixed through them is re-reckoned',
    press: 'a printing press: every published sheet sells 1.8 times as many copies',
  };
  /* review_11 #11: words name a tab as THIS shape labels it (SHORT's are FIELD, SHEETS, NOTES) */
  function tabLabel(id) { var l = tabs(); for (var i = 0; i < l.length; i++) if (l[i][0] === id) return l[i][1]; return id === 'field' ? 'THE FIELD' : id.toUpperCase(); }
  function upInfo(k) { return k === 'barometer' ? 'forecasts the next six days of weather in ' + (shape === 'short' ? 'the FIELD tab' : 'THE FIELD') : UPGRADE_INFO[k]; }
  function shortWhy(why) {
    var m = /wants (\d+) sheets? published/.exec(why || '');
    if (m) return 'after ' + m[1] + (m[1] === '1' ? ' sheet' : ' sheets');
    if (/no observed sight/.test(why || '')) return 'no sight to chain yet';
    return why;
  }
  function drawInstruments(a, c) {
    var wide = shape === 'wide', cols = wide ? 4 : 2, gap = 6, bw = (c.w - gap * (cols - 1)) / cols, bh = 40, rowH = bh + (wide ? 5 : 5);
    for (var i = 0; i < UPG.length; i++) {
      var k = UPG[i][0], u = SIM.UPGRADES[k], lv = a.levels[k], done = lv >= u.max, why = SIM.whyNot(a, k);
      var x = c.x + (i % cols) * (bw + gap), y = c.y + Math.floor(i / cols) * rowH;
      /* the count is what is OWNED of the most there can be ("2/3" read as "the third of three" was ambiguous) */
      var lab = UPG[i][1] + (u.max > 1 && !done ? ' · ' + lv + ' of ' + u.max : '');
      var sub = done ? DONE[k](a) : why && why !== 'not enough funds' ? shortWhy(why) : SIM.cost(a, k) + ' funds';
      /* 1.1, measured at the size drawButtons will use: a name and its count too long for the button move the count
       * to the second line, and a name still too long takes its short form (SHORT's 146 px buttons) */
      var lsz = fs(bh >= 34 ? 13 : 12);
      if (tw(lab, lsz, '700') > bw - 10 && u.max > 1 && !done) { lab = UPG[i][1]; sub += ' · ' + lv + ' of ' + u.max; }
      if (tw(lab, lsz, '700') > bw - 10) lab = SHORT_NAME[k];
      var b = btn('buy:' + k, x, y, bw, bh, lab, !why, false, sub, done ? 'already done' : why);
      b.info = upInfo(k);
      if (done) b.subCol = C.good; else if (why && why !== 'not enough funds') b.subCol = C.inkFaint;
      if (y + bh > c.y + c.h + 2) state.cut = 1;
    }
    if (wide) {
      var lx = c.x + 2 * (bw + gap), ly = c.y + 2 * rowH;
      wrapText('Hover an instrument to read what it does in the bar below. The Board grants more as sheets are published.', lx + 4, ly + 16, 2 * bw + gap - 8, fs(11), C.inkFaint, '400', 14);
    }
  }
  var GRADE_COL = ['#8e8a7c', '#e08a5a', '#e2b75e', '#9fd08a'];
  /* the card's second line; given a width (1.1, the compact cards), the longest form that fits, measured */
  function sheetLine(a, k, maxW, size) {
    var st = SIM.sheetStats(a, k), sh = a.sheets[k], why = SIM.whyNotPublish(a, k), g0 = SIM.GRADE_NAMES[st.grade] || '-', c;
    if (sh.pub) c = why ? ['sold at ' + SIM.GRADE_NAMES[sh.pub] + ' · ' + pct(st.frac) + ' · error ' + st.mean.toFixed(2), 'sold at ' + SIM.GRADE_NAMES[sh.pub] + ' · error ' + st.mean.toFixed(2), 'sold at ' + SIM.GRADE_NAMES[sh.pub]] : ['REISSUE at ' + g0];
    else if (!why) c = ['PUBLISH at ' + g0];
    /* review_11 #6a: the mean error stays on an unpublished card while it fits (WIDE prints it on every row) */
    else c = st.mapped ? [pct(st.frac) + ' mapped · grade ' + g0 + ' · error ' + st.mean.toFixed(2), pct(st.frac) + ' · grade ' + g0 + ' · error ' + st.mean.toFixed(2), pct(st.frac) + ' · ' + g0 + ' · error ' + st.mean.toFixed(2), pct(st.frac) + ' mapped · grade ' + g0, pct(st.frac) + ' · grade ' + g0] : [pct(st.frac) + ' mapped'];
    if (maxW) for (var i = 0; i < c.length; i++) if (tw(c[i], size) <= maxW) return c[i];
    return maxW ? c[c.length - 1] : c[0];
  }
  /* what a sheet's button says when hovered (WIDE, and since 1.1 the compact cards: review_11 #6b) and on a finger's
   * first tap */
  function sheetInfo(a, k) {
    var st = SIM.sheetStats(a, k), sh = a.sheets[k];
    /* a sold sheet whose survey now earns a better grade can be REISSUED (its button says so): say what that pays, never
     * "keeps that grade" over a button that offers to change it (found by cert_suite on 1.1, the first tap on a ready
     * sheet) */
    if (sh.pub && !SIM.whyNotPublish(a, k)) return 'reissue the ' + SIM.TOWN_NAMES[k] + ' sheet at grade ' + SIM.GRADE_NAMES[st.grade] + ': the Board pays ' + Math.max(0, SIM.grant(a, k, st.grade) - sh.paid) + ' more, and it sells ' + (SIM.GRADE_MULT[st.grade] * 100).toFixed(0) + '% as well as a grade A would (' + (SIM.GRADE_MULT[sh.pub] * 100).toFixed(0) + '% at ' + SIM.GRADE_NAMES[sh.pub] + ')';
    return sh.pub ? 'the ' + SIM.TOWN_NAMES[k] + ' sheet was sold at ' + SIM.GRADE_NAMES[sh.pub] + ' and keeps that grade; it sells ' + (SIM.GRADE_MULT[sh.pub] * 100).toFixed(0) + '% as well as a grade A would' + (st.grade && st.grade !== sh.pub ? ', and its survey reads ' + SIM.GRADE_NAMES[st.grade] + ' now' : '') : 'publish the ' + SIM.TOWN_NAMES[k] + ' sheet at the grade its survey earns now: the Board pays ' + SIM.grant(a, k, Math.max(1, st.grade)) + ' and the town buys copies';
  }
  function drawSheets(a, c) {
    var wide = shape === 'wide';
    if (!wide) {
      /* the tall shape: each sheet is ONE tall card, a button whose label is the town and whose second line says
       * what a tap does; the progress bar is drawn under the words. (Eight rows of small PUBLISH buttons measured
       * 15.8 css px on a 360 px phone, under the 24 px tap floor.) */
      var cols2 = 2, gap2 = 8, cw2 = (c.w - gap2) / cols2, rh2 = (c.h + 4) / 4;
      for (var q = 0; q < SIM.NT; q++) {
        var x2 = c.x + (q % cols2) * (cw2 + gap2), y2 = c.y + Math.floor(q / cols2) * rh2, st2 = SIM.sheetStats(a, q), why2 = SIM.whyNotPublish(a, q);
        var b2 = btn('publish:' + q, x2, y2, cw2, rh2 - 6, SIM.TOWN_NAMES[q], !why2, false, sheetLine(a, q, cw2 - 10, fs(11)), why2);
        if (!why2) b2.hot = true;
        b2.info = sheetInfo(a, q);
        var gl2 = a.sheets[q].pub && why2 ? a.sheets[q].pub : st2.grade;
        b2.subCol = gl2 ? GRADE_COL[gl2] : C.inkFaint;
        b2.bar = { f: st2.frac / SIM.PUBLISH_AT, col: st2.ready ? C.good : C.gold };
      }
      return;
    }
    var cols = 2, gap = 8, bw = (c.w - gap * (cols - 1)) / cols, rows = Math.ceil(SIM.NT / cols), rh = Math.min(34, (c.h + 2) / rows);
    var G = SIM.geo(a);
    for (var k = 0; k < SIM.NT; k++) {
      var x = c.x + (k % cols) * (bw + gap), y = c.y + Math.floor(k / cols) * rh, st = SIM.sheetStats(a, k), sh = a.sheets[k];
      g.fillStyle = 'rgba(10,16,11,0.35)'; rr(x, y, bw, rh - 4, 4); g.fill();
      var gy = y + (rh - 4) / 2 + 5;
      T(SIM.TOWN_NAMES[k], x + 8, gy, fs(12), C.ink, 'left', '700', SERIF);
      /* the bar and the percentage mapped */
      var nx = x + (wide ? 118 : 124), bwid = wide ? 70 : 60;
      bar(nx, gy - 8, bwid, 7, st.frac / SIM.PUBLISH_AT, st.ready ? C.good : C.gold);
      T(pct(st.frac) + (wide ? ' mapped' : ''), nx + bwid + 6, gy, fs(11), C.inkDim);
      var gx = x + bw - (wide ? 110 : 116);
      T(st.mapped ? 'error ' + st.mean.toFixed(2) : 'no survey', gx - 8, gy, fs(11), C.inkFaint, 'right');
      var why = SIM.whyNotPublish(a, k);
      /* a sold sheet keeps the grade it was sold at (that is what the county counts), so its letter is the SOLD grade;
       * the ground inked after the sale can raise the mean error, and the hover says so */
      var gl = sh.pub && why ? sh.pub : st.grade;
      g.fillStyle = GRADE_COL[gl]; T(gl ? SIM.GRADE_NAMES[gl] : '-', gx + 6, gy + 1, fs(15), GRADE_COL[gl], 'center', '700', SERIF);
      var label = sh.pub ? (why ? 'SOLD ' + SIM.GRADE_NAMES[sh.pub] : 'REISSUE') : 'PUBLISH';
      var b = btn('publish:' + k, x + bw - 88, y + 1, 82, rh - 6, label, !why, !why, undefined, why);
      if (!why) b.hot = true;
      b.info = sheetInfo(a, k);
      void G;
    }
  }
  function drawNotes(a, c) {
    var wide = shape === 'wide', colW = wide ? (c.w - 24) / 3 : c.w, x = c.x, y = c.y + fs(10);
    function para(title, words, xx, yy, w) { T(title, xx, yy, fs(12), C.gold, 'left', '700'); return wrapText(words, xx, yy + fs(16), w, fs(11), C.inkDim, '400', fs(11) + 4); }
    var e1 = 'A station is fixed once its sights to two fixed stations are read. It carries the worse of their errors, plus ' + SIM.ERR_K.toFixed(2) + ' a cell of sight, times the triangle\'s shape: a right angle at the new station costs x1, 30 degrees x2, 15 degrees x4. Each extra triangle cuts it further, to half at most. Now: x' + SIM.vernier(a) + ' for the vernier.';
    var y1 = para('THE ERROR', e1, x, y, colW - 6);
    var odds = ['spring 60% clear', 'summer 58%', 'autumn 45%', 'winter 36%'];
    var e2 = 'Haze: only sights under ' + Math.round(SIM.HAZE_REACH * 100) + '% of the range can be read' + (a.levels.helio ? ' (the heliotropes cut through it)' : '') + '. Fog: no sight can be read and the plane-tables work at a third. Clear days: ' + odds.join(', ') + '.';
    var x2 = wide ? c.x + colW + 12 : c.x, y2 = wide ? y : y1 + 8;
    var yb = para('THE WEATHER', e2, x2, y2, colW - 6);
    var x3 = wide ? c.x + 2 * (colW + 12) : c.x, y3 = wide ? y : yb + 8;
    var e3 = 'A sheet can be published once ' + Math.round(SIM.PUBLISH_AT * 100) + '% of it is mapped. Its grade is its mean error: A to ' + SIM.GRADE_A.toFixed(2) + ', B to ' + SIM.GRADE_B.toFixed(2) + ', C beyond. The Board pays ' + SIM.CELL_FEE + ' for every new cell inked and a grant on publishing; towns buy copies every day. A printed sheet keeps its grade even if rougher cells pull the survey below it; reissue when it improves.';
    var yc = para('THE SHEETS', e3, x3, y3, colW - 6);
    if ((wide ? Math.max(y1, yb, yc) : yc) - fs(11) > c.y + c.h + 2) state.cut = 1;
  }
  /* TALL and SHORT (1.1): the three notes do not fit either compact panel at the type floor (TALL's ran past its panel
   * at 13 px, MEASURED by the layout gate), so they are three pages, one button each; N turns the page */
  /* the third is PUBLISHING, not THE SHEETS, so it is never read as the tab of that name beside it */
  var NOTE_PAGES = ['THE ERROR', 'THE WEATHER', 'PUBLISHING'];
  function drawNotesPaged(a, c) {
    var odds = ['spring 60% clear', 'summer 58%', 'autumn 45%', 'winter 36%'];
    var words = [
      'A station is fixed once its sights to two fixed stations are read. It carries the worse of their errors, plus ' + SIM.ERR_K.toFixed(2) + ' a cell of sight, times the triangle\'s shape: a right angle at the new station costs x1, 30 degrees x2, 15 degrees x4. Each extra triangle cuts it further, to half at most. Now: x' + SIM.vernier(a) + ' for the vernier.',
      'Haze: only sights under ' + Math.round(SIM.HAZE_REACH * 100) + '% of the range can be read' + (a.levels.helio ? ' (the heliotropes cut through it)' : '') + '. Fog: no sight can be read and the plane-tables work at a third. Clear days: ' + odds.join(', ') + '.',
      'A sheet can be published once ' + Math.round(SIM.PUBLISH_AT * 100) + '% of it is mapped. Its grade is its mean error: A to ' + SIM.GRADE_A.toFixed(2) + ', B to ' + SIM.GRADE_B.toFixed(2) + ', C beyond. The Board pays ' + SIM.CELL_FEE + ' for every new cell inked and a grant on publishing; towns buy copies every day. A printed sheet keeps its grade even if rougher cells pull the survey below it; reissue when it improves.',
    ];
    /* the page buttons at the tap floor for the live scale: 31 logical on SHORT down to 0.77, 36 on an upright 360 phone */
    var pg = Math.max(0, Math.min(2, state.notePage | 0)), gap = 6, bw = (c.w - 2 * gap) / 3, ph = Math.min(40, Math.max(31, Math.ceil(24 / LIVESC - 1e-9)));
    for (var i = 0; i < 3; i++) btn('note:' + i, c.x + i * (bw + gap), c.y - 6, bw, ph, NOTE_PAGES[i], true, i === pg);
    var y = wrapText(words[pg], c.x, c.y + ph + fs(11) + 6, c.w, fs(11), C.inkDim, '400', fs(11) + 4);
    if (y - fs(11) > c.y + c.h + 2) state.cut = 1;
  }

  /* ---------------------------------------------------------- the bottom */
  function drawBottom() {
    var b = L().bottom, a = state.county;
    g.fillStyle = '#120e09'; g.fillRect(b.x, b.y, b.w, b.h);
    g.fillStyle = C.panelEdge; g.fillRect(b.x, b.y, b.w, 1);
    var tm = state.toast[0], size = fs(13), focus = focusCell();
    var hv = hoverNow(), hb = hv && (hv.info || (hv.why && !hv.enabled)) ? hv : null;
    /* 1.1: the hover and cursor readouts of the compact shapes (TALL and SHORT) live here; the words follow the pointer */
    var hoverMsg = hb ? (hb.info ? cap1(hb.info) + (hb.enabled || !hb.why ? '.' : ' · ' + hb.why + '.') : cap1(hb.why) + '.') : a && state.hoverCell >= 0 && compact() ? cellInfo(a, state.hoverCell) : null;
    var top1 = shape === 'short' ? b.y + 19 : b.y + 24, top2 = shape === 'short' ? b.y + 19 : b.y + 22;
    if (hoverMsg || !tm || state.t - tm.at > 10) {
      var bad = hb && !hb.enabled && hb.why && hb.why !== 'already done';
      var msg = hoverMsg || (a && focus >= 0 && compact() ? cellInfo(a, focus) : (shape === 'wide' ? (coarse() ? 'Tap' : 'Click') + ' the map to raise a station · 1 raise · 2 tower · 3 read · arrows + Enter · B publish · T tabs · P pause · F speed · H help' : coarse() ? 'Tap the map once to see a station\'s sightlines, again to raise it.' : 'Hover the map to see a station\'s sightlines, click to raise it. Keys: H help, P pause.'));
      /* 1.1: with the hover readout working (review_11 #1) the longest instrument text is about 200 characters, past the
       * bar's width at 11 px, so a message that does not fit one line at 12 wraps onto two at 11 */
      state.bottomText = msg;   // what the bar shows this frame, read by the cert suite's hover assertion
      if (shape === 'wide') { if (tw(msg, fs(12)) <= b.w - 28) T(msg, b.x + 14, b.y + b.h / 2 + 5, fs(12), bad ? C.alarm : C.inkFaint); else wrapText(msg, b.x + 14, b.y + 19, b.w - 28, fs(11), bad ? C.alarm : C.inkFaint, '400', 16); }
      else wrapText(msg, b.x + 12, top1, b.w - 24, fs(12), bad ? C.alarm : C.inkFaint, '400', fs(12) + 5);
      return;
    }
    var col = tm.kind === 'bad' ? C.alarm : tm.kind === 'good' ? C.good : C.ink, prev = state.toast[1];
    state.bottomText = tm.msg;
    if (shape === 'wide') {
      T(tm.msg, b.x + 14, b.y + 20, tw(tm.msg, size) > b.w - 28 ? fs(11) : size, col);
      if (prev) T(prev.msg, b.x + 14, b.y + 39, tw(prev.msg, fs(12)) > b.w - 28 ? fs(10) : fs(12), C.inkFaint);
    } else {
      var ny = wrapText(tm.msg, b.x + 12, top2, b.w - 24, size, col, '400', size + 5);
      if (prev && ny + 2 < b.y + b.h - 4 && tw(prev.msg, fs(12)) <= b.w - 24) T(prev.msg, b.x + 12, ny + 2, fs(12), C.inkFaint);
    }
  }

  /* --------------------------------------------------------- the overlays */
  function scrim(al) { g.fillStyle = 'rgba(12,9,5,' + al + ')'; g.fillRect(0, 0, W, H); }
  function drawHelp() {
    g.fillStyle = '#15110c'; g.fillRect(0, 0, W, H);
    var wide = shape === 'wide', x = wide ? 60 : shape === 'short' ? 26 : 22, w = W - 2 * x, y = wide ? 44 : shape === 'short' ? 34 : 58;
    T('HOW TO MAP A COUNTY', W / 2, y, fs(22), C.gold, 'center', '700', SERIF);
    y += 22;
    var S = wide ? 12 : fs(13), secs = [
      ['THE BASELINE AND THE STATIONS', 'The county is a hearsay sketch in pencil. Two stations stand at the ends of a measured baseline and carry no error. RAISE a station anywhere on land: ' + (coarse() ? 'tap once' : 'hover') + ' to see its sightlines, green where it would see a station, orange and crossed where a hill or a wood is in the way. TOWER lifts a station\'s eye over what blocks it.'],
      ['THE PARTIES', 'Observing parties read every sightline, one at a time each. A station whose sights to TWO fixed stations are read is fixed. Plane-table parties then ink the ground round every fixed station, nearest first, and later redraw any cell a better station could draw more truly.'],
      ['THE ERROR', 'A fixed station inherits the worse error of the two that fixed it, plus a little for every cell of sight, times the triangle\'s shape: a fat triangle fixes a point well, a thin one badly. Long chains away from the baseline pile error up. The vernier and a check baseline bring it down.'],
      ['THE WEATHER', 'Each day is CLEAR, HAZE or FOG, more fog in autumn and winter. Haze stops the long sights; fog stops every sight and slows the ink. The barometer forecasts; heliotropes cut through haze.'],
      ['THE SHEETS', 'Each of the eight towns buys the sheet of land round it once 90% is mapped, at a grade set by its mean error (A, B or C). Publishing pays a grant, and the town buys copies every day. REISSUE a sheet when its grade improves. The county is done when every sheet is published at B or better.'],
    ];
    if (shape === 'short') {
      /* SHORT (1.1): two pages at the type floor. Page 1 the survey, page 2 the weather, the sheets, the controls and
       * who made it; Enter or Space turns the page, then closes; the arrows turn it either way */
      var pg = state.helpPage ? 1 : 0;
      secs.push(['CONTROLS', (coarse() ? 'Tap. The first tap on a place, an instrument or a ready sheet explains it and a second acts. ' : 'Click; hover a place or an instrument to read it. ') + 'Keys: 1 raise · 2 tower · 3 read · arrows move a cursor on the map, Enter or Space act there · B publish the next sheet that can be · T the tabs · N the next note · F speed · P pause · H this page · M sound · Esc close.']);
      secs.push(['MADE BY', 'Core Systems Asset Factory. Code, text and pictures were made with AI assistance; the music and every sound are synthesised by our own code, no AI audio model.']);
      var from = pg ? 3 : 0, to = pg ? secs.length : 3;
      for (var j = from; j < to; j++) { T(secs[j][0], x, y, S, C.gold, 'left', '700'); y = wrapText(secs[j][1], x, y + S + 4, w, S, j === secs.length - 1 ? C.inkDim : C.ink, '400', S + 4) + 3; }
      T('PAGE ' + (pg + 1) + ' OF 2', W - x, 36, S, C.inkFaint, 'right', '700');
      var hb0 = Math.min(H - 44, y + 6);
      btn(pg ? 'helpprev' : 'helpnext', W / 2 - 230, hb0, 220, 36, pg ? 'PREVIOUS PAGE' : 'NEXT PAGE');
      btn('closehelp', W / 2 + 10, hb0, 220, 36, state.county ? 'BACK TO THE SURVEY' : 'BACK');
      return;
    }
    for (var i = 0; i < secs.length; i++) { T(secs[i][0], x, y, S, C.gold, 'left', '700'); y = wrapText(secs[i][1], x, y + S + 4, w, S, C.ink, '400', S + 4) + 3; }
    T('CONTROLS', x, y + 2, S, C.gold, 'left', '700');
    y = wrapText('Tap or click. On a phone the first tap on a place, an instrument or a ready sheet explains it and a second acts. Keys: 1 raise · 2 tower · 3 read · arrows move a cursor on the map, Enter or Space act there · B publish the next sheet that can be · T the tabs' + (compact() ? ' · N the next note' : '') + ' · F speed · P pause · H this page · M sound · Esc close.', x, y + S + 6, w, S, C.ink, '400', S + 4);
    T('MADE BY', x, y + 6, S, C.gold, 'left', '700');
    y = wrapText('Core Systems Asset Factory. Code, text and pictures were made with AI assistance; the music and every sound are synthesised by our own code, no AI audio model.', x, y + S + 10, w, S, C.inkDim, '400', S + 4);
    btn('closehelp', W / 2 - 110, Math.min(H - 50, y + 8), 220, 38, state.county ? 'BACK TO THE SURVEY' : 'BACK');
  }
  function drawPause() {
    scrim(0.78);
    var cy = shape === 'wide' ? 250 : shape === 'short' ? 168 : 420, cw = shape === 'wide' ? 440 : 400;
    panelBack(W / 2 - cw / 2, cy - 58, cw, 196);
    T('PAUSED', W / 2, cy, fs(40), C.gold, 'center', '700', SERIF);
    T('The parties rest until you come back.', W / 2, cy + 34, fs(14), C.ink, 'center');
    btn('resume', W / 2 - 110, cy + 58, 220, 40, 'RESUME');
    /* the keys only where there is likely a keyboard (review_11 #4: a phone was told P, Esc or Enter) */
    if (!coarse()) T('P, Esc or Enter also resumes', W / 2, cy + 124, fs(12), C.inkFaint, 'center');
  }
  function drawEnding(a) {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var r = fullRect(), wide = shape === 'wide', sh = shape === 'short', y = wide ? 170 : sh ? 112 : 330, bw0 = W - 56, bh0 = wide ? 250 : sh ? 262 : 330;
    g.save(); drawMapAt(a, r, state.t, { noWeather: true, keepOut: { x: 28, y: y - 64, w: bw0, h: bh0 } }); g.restore();
    g.fillStyle = 'rgba(20,14,8,0.25)'; g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(24,18,11,0.86)'; rr(28, y - 64, bw0, bh0, 10); g.fill(); g.strokeStyle = C.gold; g.lineWidth = 1.5; rr(34, y - 58, bw0 - 12, bh0 - 12, 8); g.stroke();
    g.save(); g.shadowColor = 'rgba(226,183,94,0.5)'; g.shadowBlur = 14;
    T('THE COUNTY IS MAPPED', W / 2, y, fs(wide ? 38 : sh ? 32 : 26), C.gold, 'center', '700', SERIF);
    g.restore();
    var ws = a.wonStats || { day: SIM.day(a), year: SIM.year(a), stations: a.stations.length, fixed: SIM.fixedCount(a), mapped: SIM.mappedCount(a), grades: a.sheets.map(function (s) { return s.pub; }), earned: Math.round(a.stats.earned), a: 0 };
    var lines = [
      'Every sheet is in print at grade B or better. The county is known now, hill by hill.',
      'Day ' + (ws.day + 1) + ', year ' + ws.year + ' · ' + ws.stations + ' stations · ' + ws.mapped + ' cells inked · ' + ws.a + ' of ' + SIM.NT + ' sheets at grade A',
      ws.a >= SIM.NT ? 'Every sheet at grade A: a survey to hang in the Board\'s own hall.' : 'Keep going: reissue the B sheets at A as the survey improves.',
    ];
    var yy = y + 36;
    for (var i = 0; i < lines.length; i++) { yy = wrapCenter(lines[i], W / 2, yy, W - 90, fs(14), i === 0 ? C.ink : C.inkDim); yy += 6; }
    btn('closeending', W / 2 - 150, yy + 14, 300, 40, 'KEEP SURVEYING');
  }
  function fullRect() { return { x: 0, y: 0, w: W, h: H, cw: W / SIM.COLS, ch: H / SIM.ROWS }; }
  /* the title: a finished county, drawn by the game's own renderer over the whole surface */
  var titleCounty = null;
  function stagedCounty(seed) {
    var a = SIM.newCounty(seed), G = SIM.geo(a);
    /* stations on the high ground, spaced, then every sight observed and every cell inked */
    var cand = [];
    for (var i = 0; i < SIM.N; i++) if (!G.sea[i] && G.ter[i] !== 'water' && G.towns.indexOf(i) < 0) cand.push([G.h[i] + hash(i * 3) * 0.2, i]);
    cand.sort(function (p, q) { return q[0] - p[0]; });
    for (var k = 0; k < cand.length && a.stations.length < 22; k++) {
      var c = cand[k][1], ok = true;
      for (var s = 0; s < a.stations.length; s++) if (SIM.dist(a.stations[s].i, c) < 3.2) { ok = false; break; }
      if (ok) a.stations.push({ i: c, tower: 0, fixed: true, err: 0.05, base: false, at: 0 });
    }
    a.levels.scope = 1; SIM.rebuildEdges(a);
    a.edges.forEach(function (e) { e.obs = 1; e.done = true; });
    for (var j = 0; j < SIM.N; j++) { a.cells[j].m = G.sea[j] ? 0 : 1; a.cells[j].err = 0.05; a.cells[j].at = -9; }
    a.wx = 0;
    return a;
  }
  function drawTitleMap(keepOut, labelBox) {
    if (!titleCounty) titleCounty = stagedCounty(7);
    var r = fullRect();
    /* 1.1: names stay above the 30 px footer (on SHORT, PELLING and STANMERE were drawn half under it) */
    drawMapAt(titleCounty, r, state.t, { noWeather: true, keepOut: keepOut, labelBox: labelBox || { x: 0, y: 0, w: W, h: H - 32 } });
    g.fillStyle = 'rgba(30,20,10,0.12)'; g.fillRect(0, 0, W, H);
  }
  function drawTitle() {
    if (shape === 'short') { drawTitleShort(); return; }
    var wide = shape === 'wide', cy = wide ? 150 : 260, bw0 = wide ? 640 : 430, bh0 = wide ? 400 : 480;
    drawTitleMap({ x: W / 2 - bw0 / 2, y: cy - (wide ? 92 : 90), w: bw0, h: bh0 });
    g.fillStyle = 'rgba(24,18,11,0.84)'; rr(W / 2 - bw0 / 2, cy - (wide ? 92 : 90), bw0, bh0, 10); g.fill();
    g.strokeStyle = C.gold; g.lineWidth = 1.5; rr(W / 2 - bw0 / 2 + 7, cy - (wide ? 85 : 83), bw0 - 14, bh0 - 14, 7); g.stroke();
    g.save(); g.shadowColor = 'rgba(226,183,94,0.5)'; g.shadowBlur = 16;
    T('THEODOLITE', W / 2, cy, wide ? 70 : 48, C.gold, 'center', '700', SERIF);
    g.restore();
    T('Map a county by sight, by angle and by error.', W / 2, cy + 36, fs(wide ? 17 : 15), C.ink, 'center', '400', SERIF);
    var sy = wrapCenter('A survey incremental: raise trig stations on the high ground, read the angles between them, and ink the county sheet by sheet before the fog comes in.', W / 2, cy + 64, wide ? 560 : W - 90, fs(wide ? 13 : 12), C.inkDim);
    var has = hasSave(), bw = 260, bx = W / 2 - bw / 2, by = sy + 8;
    btn('start', bx, by, bw, 42, has ? 'CONTINUE' : 'BEGIN A SURVEY', true, false);
    var armed = state.t < state.confirmNewUntil;
    btn('fresh', bx, by + 50, bw, 36, armed ? 'PRESS AGAIN TO ERASE' : 'A NEW COUNTY', true, armed);
    btn('help', bx, by + 94, bw, 36, 'HOW TO PLAY');
    if (armed) T('A new county erases your saved survey.', W / 2, by + 150, fs(12), C.alarm, 'center');
    g.fillStyle = 'rgba(18,14,9,0.88)'; g.fillRect(0, H - 30, W, 30);
    T('Free · saves as you go · by Core Systems Asset Factory', W / 2, H - 11, fs(11), C.inkDim, 'center');
  }
  /* SHORT (1.1): the same card, lower and wider; BEGIN on its own row, A NEW COUNTY and HOW TO PLAY side by side */
  function drawTitleShort() {
    var cy = 90, bw0 = 580, top = cy - 64, BLURB = 'A survey incremental: raise trig stations on the high ground, read the angles between them, and ink the county sheet by sheet before the fog comes in.';
    var sy0 = cy + 58, lines = splitLines(BLURB, 500, fs(12)).length;
    var by = sy0 + lines * (fs(12) + 6) + 6, armed = state.t < state.confirmNewUntil, bh0 = by + 78 + (armed ? 32 : 14) - top;
    drawTitleMap({ x: W / 2 - bw0 / 2, y: top, w: bw0, h: bh0 });
    g.fillStyle = 'rgba(24,18,11,0.84)'; rr(W / 2 - bw0 / 2, top, bw0, bh0, 10); g.fill();
    g.strokeStyle = C.gold; g.lineWidth = 1.5; rr(W / 2 - bw0 / 2 + 7, top + 7, bw0 - 14, bh0 - 14, 7); g.stroke();
    g.save(); g.shadowColor = 'rgba(226,183,94,0.5)'; g.shadowBlur = 16;
    T('THEODOLITE', W / 2, cy, 54, C.gold, 'center', '700', SERIF);
    g.restore();
    T('Map a county by sight, by angle and by error.', W / 2, cy + 30, fs(15), C.ink, 'center', '400', SERIF);
    wrapCenter(BLURB, W / 2, sy0, 500, fs(12), C.inkDim);
    var has = hasSave(), bx = W / 2 - 150;
    btn('start', bx, by, 300, 38, has ? 'CONTINUE' : 'BEGIN A SURVEY', true, false);
    btn('fresh', bx, by + 44, 180, 34, armed ? 'PRESS AGAIN TO ERASE' : 'A NEW COUNTY', true, armed);
    btn('help', bx + 186, by + 44, 114, 34, 'HOW TO PLAY');
    if (armed) T('A new county erases your saved survey.', W / 2, by + 100, fs(12), C.alarm, 'center');
    g.fillStyle = 'rgba(18,14,9,0.88)'; g.fillRect(0, H - 30, W, 30);
    T('Free · saves as you go · by Core Systems Asset Factory', W / 2, H - 11, fs(11), C.inkDim, 'center');
  }

  function render() {
    buttons = []; state.cut = 0;
    liveFloor();
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    if (state.screen === 'title') { drawTitle(); if (state.help) { buttons = []; drawHelp(); } drawButtons(); return; }
    var a = state.county;
    g.fillStyle = PLATES.baize || C.panel; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(10,8,4,0.55)'; g.fillRect(0, 0, W, H);
    drawMap(a);
    drawTop(a);
    drawField(a);
    /* a tab another shape does not have (THE FIELD after turning a phone upright) falls back to the instruments */
    if (!tabOk(state.tab)) state.tab = 'instruments';
    var c = panelFrame();
    if (state.tab === 'instruments') drawInstruments(a, c); else if (state.tab === 'sheets') drawSheets(a, c); else if (state.tab === 'field') drawFieldTab(a, c); else if (compact()) drawNotesPaged(a, c); else drawNotes(a, c);
    drawBottom();
    /* the play screen's controls are drawn BEFORE any overlay, so a veil lies over a whole screen */
    drawButtons();
    if (state.help) { buttons = []; drawHelp(); drawButtons(); return; }
    if (a.won && !a.endingSeen) { buttons = []; drawEnding(a); drawButtons(); return; }
    if (state.userPaused) { buttons = []; drawPause(); drawButtons(); return; }
  }

  /* ------------------------------------------------------------------ tick */
  function tick(dt) {
    state.t += dt;
    var a = state.county;
    if (state.screen !== 'play' || !a || state.help || state.userPaused || (a.won && !a.endingSeen)) return;
    SIM.step(a, dt * state.speed / SIM.DAY_SEC);
    if (a.stats.observed > state.lastObserved) { state.lastObserved = a.stats.observed; AUDIO.sight(); }
    if (a.stats.inked + a.stats.revised > state.lastInked) { state.lastInked = a.stats.inked + a.stats.revised; if (state.t - state.inkSoundAt > 0.35) { state.inkSoundAt = state.t; AUDIO.quill(); } }
    for (var ei = 0; ei < a.events.length; ei++) {
      var e = a.events[ei];
      if (!(e.seq > state.eventsSeen)) continue;
      state.eventsSeen = e.seq;
      if (e.kind === 'fixed') { toast(e.msg, 'good'); AUDIO.fixed(); state.flashes.push({ s: e.s, at: state.t }); save(); }
      else if (e.kind === 'weather') { toast(e.msg, e.msg.indexOf('Fog') === 0 ? 'bad' : 'info'); if (e.msg.indexOf('Fog') === 0) AUDIO.fog(); }
      else if (e.kind === 'season') { toast(e.msg, 'info'); AUDIO.season(); save(); }
      else if (e.kind === 'ready') { toast(e.msg, 'good'); AUDIO.chime(); save(); }
      else if (e.kind === 'publish') { toast(e.msg, 'good'); AUDIO.stamp(); save(); }
      else if (e.kind === 'unlock') { toast(e.msg, 'good'); AUDIO.chime(); }
      else if (e.kind === 'check') { toast(e.msg, 'good'); AUDIO.clank(); save(); }
      else if (e.kind === 'win') { AUDIO.fanfare(); save(); }
    }
    if (Date.now() - state.lastSaveReal > 5000) { state.lastSaveReal = Date.now(); save(); }
  }

  /* ----------------------------------------------------------------- input */
  var actedThisFrame = false, lastPointer = 'mouse', armedBuy = null, armedPub = -1;
  function toSurface(ev) {
    var r = cv.getBoundingClientRect();
    return { x: (ev.clientX - r.left) * (W / r.width), y: (ev.clientY - r.top) * (H / r.height) };
  }
  function btnAt(x, y) { for (var i = buttons.length - 1; i >= 0; i--) { var b = buttons[i]; if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) return b; } return null; }
  function overlayUp() { var a = state.county; return state.screen !== 'play' || !a || state.help || state.userPaused || (a.won && !a.endingSeen); }
  cv.addEventListener('pointerdown', function (ev) {
    try { window.focus(); } catch (e) { /* cross-origin parent */ }
    try { cv.focus({ preventScroll: true }); } catch (e) { /* old browser */ }
    AUDIO.unlock();
    if (ev.button !== undefined && ev.button !== 0) return;
    var p = toSurface(ev);
    if (actedThisFrame) return;
    var b = btnAt(p.x, p.y);
    lastPointer = ev.pointerType || 'mouse';
    if (b && b.enabled) { actedThisFrame = true; doButton(b); return; }
    /* a finger has no hover: a tap on a locked instrument says what it does as well as why it is locked */
    if (b && b.why) { actedThisFrame = true; toast((lastPointer === 'touch' && b.info && b.why !== 'already done' ? cap1(b.info) + '. ' : '') + cap1(b.why) + '.', 'bad'); AUDIO.tick(); return; }
    if (!overlayUp()) {
      var i = cellAt(p.x, p.y);
      if (i >= 0) {
        actedThisFrame = true;
        /* a finger has no hover: the first tap on a cell shows what a station there would see, a second acts */
        /* review_11 #5: no "Tap again" where no station may stand (the sea, a lake, a town, a cell too close), and one
         * full stop, never two (the sea's line already ends with one) */
        if (ev.pointerType === 'touch' && state.tool === 'raise' && SIM.stationAt(state.county, i) < 0 && state.cursor !== i) { var wr = SIM.whyNotRaise(state.county, i), inf = cellInfo(state.county, i).replace(/\.$/, ''), refused = wr && wr !== 'not enough funds'; state.cursor = i; toast(inf + (refused ? (inf.indexOf(wr) < 0 && !SIM.geo(state.county).sea[i] ? ' · ' + wr : '') + '.' : '. Tap again to raise it.'), 'info'); AUDIO.tick(); return; }
        if (ev.pointerType === 'touch' && state.tool === 'tower' && SIM.stationAt(state.county, i) >= 0 && state.cursor !== i) { state.cursor = i; toast(cellInfo(state.county, i) + '. Tap again to lift it.', 'info'); AUDIO.tick(); return; }
        state.cursor = ev.pointerType === 'touch' ? i : -1;
        actOnCell(i);
      }
    }
  });
  cv.addEventListener('pointermove', function (ev) { var p = toSurface(ev); hoverPt = ev.pointerType === 'touch' ? null : p; state.hoverCell = overlayUp() || ev.pointerType === 'touch' ? -1 : cellAt(p.x, p.y); });
  cv.addEventListener('pointerleave', function () { hoverPt = null; hoverBtn = null; state.hoverCell = -1; });
  cv.addEventListener('contextmenu', function (ev) { ev.preventDefault(); });

  function actOnCell(i) {
    var a = state.county, s = SIM.stationAt(a, i), w;
    if (state.tool === 'read' || (state.tool === 'raise' && s >= 0)) { toast(cellInfo(a, i), 'info'); AUDIO.tick(); return; }
    if (state.tool === 'tower') {
      if (s < 0) { toast('There is no station there to lift: ' + (coarse() ? 'tap' : 'click') + ' a station with TOWER.', 'bad'); AUDIO.tick(); return; }
      var cost = SIM.towerCost(a, s);
      w = SIM.tower(a, s);
      if (!w) { AUDIO.clank(); toast('A tower goes up (' + cost + ' funds). The station\'s eye stands ' + a.stations[s].tower + (a.stations[s].tower === 1 ? ' level' : ' levels') + ' higher, and new sights may open.', 'good'); save(); return; }
      toast(cap1(w) + '.', 'bad'); AUDIO.tick(); return;
    }
    var price = SIM.stationCost(a, i);
    w = SIM.raise(a, i);
    if (!w) {
      var n = a.stations.length - 1, fixedSeen = 0, ed = SIM.edgesOf(a, n);
      for (var k = 0; k < ed.length; k++) { var o = ed[k].a === n ? ed[k].b : ed[k].a; if (a.stations[o].fixed) fixedSeen++; }
      AUDIO.raise(); toast('A station is raised (' + price + ' funds). It sees ' + ed.length + (ed.length === 1 ? ' station' : ' stations') + ', ' + fixedSeen + ' of them fixed' + (fixedSeen >= 2 ? ': the parties will read its sights.' : ': it needs two fixed to be fixed itself.'), fixedSeen >= 2 ? 'good' : 'info');
      state.cursor = -1; save(); return;
    }
    toast(cap1(w) + '.', 'bad'); AUDIO.tick();
  }
  function publishNext() {
    var a = state.county;
    for (var k = 0; k < SIM.NT; k++) if (!SIM.whyNotPublish(a, k)) { doButton({ id: 'publish:' + k, key: true }); return; }
    toast('No sheet can be published or reissued yet: see ' + tabLabel('sheets') + '.', 'bad'); AUDIO.tick();
  }

  window.addEventListener('keydown', function (ev) {
    var k = ev.key, primary = k === 'Enter' || k === ' ';
    /* Space is this game's own key, so it must not also scroll the store page; Tab is never taken */
    if (k === ' ') ev.preventDefault();
    AUDIO.unlock();
    if (state.help) {
      /* SHORT's help is two pages: Enter or Space turns to page 2 and then closes; the arrows turn either way */
      if (shape === 'short' && ((primary && !state.helpPage) || k === 'ArrowRight')) { state.helpPage = 1; AUDIO.tick(); return; }
      if (shape === 'short' && k === 'ArrowLeft') { state.helpPage = 0; AUDIO.tick(); return; }
      if (k === 'Escape' || primary || k === 'h' || k === 'H' || k === '?') closeHelp(); else if (k === 'm' || k === 'M') AUDIO.toggleMute(); return;
    }
    if (k === 'm' || k === 'M') { AUDIO.toggleMute(); return; }
    if (state.screen === 'title') { if (primary) doButton({ id: 'start' }); else if (k === 'h' || k === 'H' || k === '?') state.help = true; return; }
    if (state.screen !== 'play' || !state.county) return;
    if (state.county.won && !state.county.endingSeen) { if (k === 'Escape' || primary) doButton({ id: 'closeending' }); return; }
    if (state.userPaused) { if (k === 'p' || k === 'P' || k === 'Escape' || primary) { state.userPaused = false; save(); AUDIO.tick(); } return; }
    if (k === 'p' || k === 'P') { state.userPaused = true; save(); AUDIO.tick(); return; }
    if (k === 'h' || k === 'H' || k === '?') { state.help = true; return; }
    if (k === '1') { doButton({ id: 'tool:raise' }); return; }
    if (k === '2') { doButton({ id: 'tool:tower' }); return; }
    if (k === '3') { doButton({ id: 'tool:read' }); return; }
    if (k === 'b' || k === 'B') { publishNext(); return; }
    if (k === 't' || k === 'T') { var TB = tabs(), ti = 0; for (var q = 0; q < TB.length; q++) if (TB[q][0] === state.tab) ti = q; state.tab = TB[(ti + 1) % TB.length][0]; AUDIO.tick(); return; }
    /* N: the next page of the field notes (TALL and SHORT, where the notes are three pages) */
    if ((k === 'n' || k === 'N') && compact()) { if (state.tab !== 'notes') state.tab = 'notes'; else state.notePage = ((state.notePage | 0) + 1) % NOTE_PAGES.length; AUDIO.tick(); return; }
    if (k === 'f' || k === 'F') { state.speed = state.speed > 1 ? 1 : 3; AUDIO.tick(); return; }
    if (k === 'Escape') { state.cursor = -1; return; }
    var mv = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k];
    if (mv) {
      /* the arrows drive the map cursor; only they are held back from scrolling the page */
      ev.preventDefault();
      var cur = state.cursor < 0 ? Math.floor(SIM.ROWS / 2) * SIM.COLS + Math.floor(SIM.COLS / 2) : state.cursor;
      var x = Math.max(0, Math.min(SIM.COLS - 1, SIM.cx(cur) + (state.cursor < 0 ? 0 : mv[0]))), y = Math.max(0, Math.min(SIM.ROWS - 1, SIM.cy(cur) + (state.cursor < 0 ? 0 : mv[1])));
      state.cursor = y * SIM.COLS + x; return;
    }
    /* Enter or Space acts at the cursor, and the cursor stays where it was so the next arrow walks on from there */
    if (primary) { if (state.cursor < 0) { state.cursor = Math.floor(SIM.ROWS / 2) * SIM.COLS + Math.floor(SIM.COLS / 2); return; } var at = state.cursor; actOnCell(at); state.cursor = at; }
  });
  /* the page stops sending keyup when it loses focus: nothing here holds a key, so there is nothing to release */

  function startPlay(a, fromSave) {
    state.county = a; state.screen = 'play'; state.tab = 'instruments'; state.eventsSeen = a.seq || 0; state.tool = 'raise'; state.cursor = -1;
    state.lastObserved = a.stats.observed; state.lastInked = a.stats.inked + a.stats.revised;
    state.help = !fromSave;
    save();
  }
  function closeHelp() {
    state.help = false; state.helpPage = 0;
    if (state.pendingToast) { toast(state.pendingToast.msg, state.pendingToast.kind); state.pendingToast = null; }
  }
  function awayReport(a, days, seq0, before) {
    state.eventsSeen = a.seq || 0;
    state.lastObserved = a.stats.observed; state.lastInked = a.stats.inked + a.stats.revised;
    var nd = Math.floor(days), fixed = 0, fog = 0, ready = 0;
    for (var i = 0; i < a.events.length; i++) {
      var e = a.events[i]; if (!(e.seq > (seq0 || 0))) continue;
      if (e.kind === 'fixed') fixed++; else if (e.kind === 'weather' && e.msg.indexOf('Fog') === 0) fog++; else if (e.kind === 'ready') ready++;
    }
    if (days < 1) { toast('Welcome back to the survey.', 'good'); return; }
    var parts = [], inked = a.stats.inked - before.inked, read = a.stats.observed - before.observed;
    if (read) parts.push(read + (read === 1 ? ' sight read' : ' sights read'));
    if (fixed) parts.push(fixed + (fixed === 1 ? ' station fixed' : ' stations fixed'));
    if (inked) parts.push(inked + (inked === 1 ? ' cell inked' : ' cells inked'));
    if (fog) parts.push(fog + (fog === 1 ? ' fog came in' : ' fogs came in'));
    if (ready) parts.push(ready + (ready === 1 ? ' sheet is' : ' sheets are') + ' ready to publish');
    toast('While you were away, ' + nd + (nd === 1 ? ' day' : ' days') + ' passed' + (parts.length ? ': ' + parts.join(', ') : ', and the fog kept the parties in camp') + '.', 'good');
  }
  /* a new county's seed comes from the clock; window.THEODOLITE_SEED, when set, replays a particular county */
  function newSeed() { return typeof window.THEODOLITE_SEED === 'number' ? window.THEODOLITE_SEED : 1 + Math.floor((Date.now() / 1000) % 99991); }
  function doButton(b) {
    var a = state.county;
    if (b.id === 'start') {
      var d = load(), away = 0, seq0 = 0, before = null;
      if (d && !d.paused) { seq0 = d.county.seq || 0; before = { inked: d.county.stats.inked, observed: d.county.stats.observed }; try { away = catchUp(d.county, (Date.now() - (d.savedAt || Date.now())) / 1000); } catch (e) { d = null; } }
      if (d && d.paused) { startPlay(d.county, true); state.userPaused = true; state.eventsSeen = d.county.seq || 0; toast('The survey waited where you paused it. Nothing ran while you were away.', 'good'); }
      else if (d) { startPlay(d.county, true); awayReport(d.county, away, seq0, before); }
      else {
        /* a save that fails validation is KEPT ASIDE under its own key and the player is told, never silently overwritten */
        var unreadable = hasSave();
        if (unreadable) { try { CG.store.setItem(SAVE_KEY + '.unreadable', CG.store.getItem(SAVE_KEY)); } catch (e) { /* storage refused */ } }
        startPlay(SIM.newCounty(newSeed()), false);
        state.pendingToast = unreadable ? { msg: 'Your saved survey could not be read. It was kept aside, and a new county begins.', kind: 'bad' }
          : { msg: 'The baseline is measured. Raise a station where it can see both ends of it: ' + (coarse() ? 'tap the map once to see its sightlines.' : 'hover the map to see its sightlines.'), kind: 'good' };
      }
      AUDIO.tick(); return;
    }
    if (b.id === 'fresh') {
      if (!hasSave()) { doButton({ id: 'start' }); return; }
      if (!(state.t < state.confirmNewUntil)) { state.confirmNewUntil = state.t + 4; return; }
      state.confirmNewUntil = 0; startPlay(SIM.newCounty(newSeed()), false); state.pendingToast = { msg: 'A new county. The baseline is measured: raise a station that sees both ends.', kind: 'good' }; return;
    }
    if (b.id === 'closehelp') { closeHelp(); return; }
    if (b.id === 'helpnext' || b.id === 'helpprev') { state.helpPage = b.id === 'helpnext' ? 1 : 0; AUDIO.tick(); return; }
    var mn = /^note:(\d)$/.exec(b.id);
    if (mn) { state.notePage = +mn[1]; AUDIO.tick(); return; }
    if (b.id === 'closeending') { a.endingSeen = true; save(); AUDIO.tick(); return; }
    if (b.id === 'help') { state.help = true; return; }
    if (b.id === 'mute') { AUDIO.toggleMute(); return; }
    if (b.id === 'speed') { state.speed = state.speed > 1 ? 1 : 3; AUDIO.tick(); return; }
    if (b.id === 'pause') { state.userPaused = true; save(); AUDIO.tick(); return; }
    if (b.id === 'resume') { state.userPaused = false; save(); AUDIO.tick(); return; }
    if (b.id.indexOf('tab:') === 0) { state.tab = b.id.slice(4); AUDIO.tick(); return; }
    if (!a) return;
    var vb = coarse() ? 'tap' : 'click';   // review_11 #4: the tool toasts said "tap" to a mouse
    if (b.id.indexOf('tool:') === 0) { state.tool = b.id.slice(5); state.cursor = -1; AUDIO.tick(); toast({ raise: 'RAISE: ' + vb + ' land to raise a station there.', tower: 'TOWER: ' + vb + ' a station to lift its eye over what blocks it (' + SIM.TOWER_COST[0] + ', then ' + SIM.TOWER_COST[1] + ' funds).', read: 'READ: ' + vb + ' anything on the map to read it.' }[state.tool], 'info'); return; }
    var mp = /^publish:(\d)$/.exec(b.id);
    if (mp) {
      /* review_11 #6c: on a phone a ready sheet explains first (its grade and what the Board pays) and acts on the second
       * tap, as an instrument does; the B key (b.key) publishes at once */
      var pk = +mp[1];
      if (!b.key && lastPointer === 'touch' && armedPub !== pk && !SIM.whyNotPublish(a, pk)) { armedPub = pk; toast(cap1(sheetInfo(a, pk)) + '. Tap again to ' + (a.sheets[pk].pub ? 'reissue' : 'publish') + ' it.', 'info'); AUDIO.tick(); return; }
      armedPub = -1;
      var r = SIM.publish(a, pk); if (r) { toast(cap1(r) + '.', 'bad'); AUDIO.tick(); } return;
    }
    if (b.id.indexOf('buy:') === 0) {
      var key = b.id.slice(4);
      /* on a phone the first tap says what an instrument does and what it costs; the second buys it */
      if (lastPointer === 'touch' && armedBuy !== key) { armedBuy = key; toast(cap1(upInfo(key)) + '. Tap again to buy it for ' + SIM.cost(a, key) + ' funds.', 'info'); AUDIO.tick(); return; }
      armedBuy = null;
      var res = SIM.buy(a, key);
      if (res) toast(cap1(res) + '.', 'bad');
      else { if (key !== 'checkbase') toast(cap1(upInfo(key)) + '.', 'good'); if (key === 'party' || key === 'plane' || key === 'mules') AUDIO.clank(); else AUDIO.coin(); save(); }
      return;
    }
  }

  /* ---------------------------------------------------------------- shape */
  /* upright -> TALL; sideways and under 520 css px tall (a phone held sideways, a short window) -> SHORT; else WIDE.
   * The itch embed (960x600) stays WIDE. HEFTSTONE 1.2's rule, ported, including its near-square clause (a landscape
   * window that TALL would draw larger gets TALL); with this game's 480x960 TALL that clause cannot fire, since TALL
   * would need a window under 0.75 as wide as it is tall, so it is kept only as the same rule as the sibling's */
  function pickShape() {
    var iw = window.innerWidth, ih = Math.max(1, window.innerHeight), s = iw / ih < 1 ? 'tall' : ih < 520 ? 'short' : 'wide';
    if (s === 'short' && Math.min(iw / SHAPES.tall.W, ih / SHAPES.tall.H) > Math.min(iw / SHAPES.short.W, ih / SHAPES.short.H)) s = 'tall';
    setShape(s);
  }
  function setShape(s) {
    if (!SHAPES[s]) return;
    shape = s; W = SHAPES[s].W; H = SHAPES[s].H;
    if (!tabOk(state.tab)) state.tab = 'instruments';
    if (cv.width !== W) cv.width = W;
    if (cv.height !== H) cv.height = H;
    document.documentElement.style.setProperty('--ar', String(W / H));
  }
  window.addEventListener('resize', pickShape);
  pickShape();

  /* ------------------------------------------------------------------ loop */
  var last = 0, paused = false;
  function frame(ts) {
    requestAnimationFrame(frame);
    if (!last) last = ts;
    var dt = Math.min(0.1, (ts - last) / 1000);
    last = ts;
    if (!paused) { tick(dt); actedThisFrame = false; render(); }
  }
  requestAnimationFrame(frame);
  /* rAF stops in a hidden tab: back from hidden, the survey catches up exactly as CONTINUE does (up to a season) */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { state.hiddenAt = Date.now(); save(); return; }
    var a = state.county, at = state.hiddenAt; state.hiddenAt = 0;
    if (!at || state.screen !== 'play' || !a || (a.won && !a.endingSeen) || state.help || state.userPaused) return;
    var secs = (Date.now() - at) / 1000;
    if (secs < 8) return;
    var seq0 = a.seq || 0, before = { inked: a.stats.inked, observed: a.stats.observed };
    awayReport(a, catchUp(a, secs), seq0, before);
    save();
  });

  window.THEODOLITE = {
    state: state, sim: SIM,
    /* CrazyGames build: a player with no save lands straight in a new county, in play (their rule: land new users in
     * gameplay immediately); the first-step line shows in the toast bar and the full help stays on the HELP button */
    cgBegin: function () { if (state.screen === 'title' && !hasSave()) { doButton({ id: 'start' }); closeHelp(); } },
    isReady: function () { return state.t > 0; },
    platesReady: function () { return platesReady; },
    buttons: function () { return buttons.slice(); },
    findButton: function (id) { for (var i = 0; i < buttons.length; i++) if (buttons[i].id === id) return buttons[i]; return null; },
    shape: function () { return { shape: shape, W: W, H: H }; },
    typeFloor: function () { return { min: MIN(), live: LIVESC }; },
    setShape: setShape,
    setPaused: function (p) { paused = !!p; },
    advance: function (sec) { var n = Math.max(1, Math.ceil(sec / 0.05)); for (var i = 0; i < n; i++) tick(sec / n); actedThisFrame = false; render(); },
    newCounty: function (seed) { startPlay(SIM.newCounty(seed === undefined ? 3 : seed), true); },
    cellRect: cellRect, cellAt: cellAt, stagedCounty: stagedCounty,
    render: render,
    /* the county alone over the whole surface, no interface (capture only; players never see it) */
    renderMap: function (opts) {
      var a = state.county; if (!a) return;
      buttons = []; g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
      drawMapAt(a, fullRect(), state.t, opts || {});
    },
    /* the store cover: the title's county under the name, no buttons (capture only; players never see it) */
    renderCover: function (cx, ty) {
      cx = cx || W / 2; ty = ty || 200;
      buttons = []; g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
      /* the store crop is 630x500 centred on the name: keep every town label inside it */
      drawTitleMap({ x: cx - 300, y: ty - 88, w: 600, h: 146 }, { x: cx - 315, y: ty - 200, w: 630, h: 500 });
      g.fillStyle = 'rgba(24,18,11,0.8)'; rr(cx - 300, ty - 88, 600, 146, 10); g.fill();
      g.strokeStyle = C.gold; g.lineWidth = 1.5; rr(cx - 293, ty - 81, 586, 132, 7); g.stroke();
      g.save(); g.shadowColor = 'rgba(226,183,94,0.55)'; g.shadowBlur = 20; T('THEODOLITE', cx, ty, 72, C.gold, 'center', '700', SERIF); g.restore();
      T('Map a county by sight, by angle and by error.', cx, ty + 38, 20, C.ink, 'center', '400', SERIF);
    },
  };
})();
