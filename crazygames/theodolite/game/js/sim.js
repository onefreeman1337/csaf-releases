/**
 * sim.js - THEODOLITE's county, its survey and its weather. Pure and deterministic (every "random" choice is a hash
 * of the seed, the day or a cell), and the ONLY place a number is computed: the renderer reads what this file
 * exports, so a figure on screen cannot disagree with the figure the survey runs on.
 *
 * MAP THE COUNTY FOR REAL. It exists only as a hearsay sketch. You raise trig stations; your parties do the rest.
 *
 * THREE SYSTEMS THAT CHANGE EACH OTHER:
 *   THE NETWORK  stations on a heightmap. Two stations are joined by a SIGHTLINE only if the line between their eyes
 *                clears the ground and the forest canopy between them, within the telescope's range; a tower lifts
 *                the eye. A station is FIXED when its sightlines to two fixed stations have both been observed:
 *                a triangle (its third side is known by reckoning). It inherits the worse of the pair's errors, plus a term that grows
 *                with the length of its sights and with a badly shaped triangle (a thin angle at the new station
 *                fixes it badly). More fixing triangles average its error down. The two ends of the measured
 *                baseline carry no error at all.
 *   THE FIELD    observing parties work through the unobserved sightlines one at a time; plane-table parties ink
 *                every cell a fixed station can see within the alidade's reach, nearest first, and later go back
 *                over any cell a better station could now draw more truly. A mapped cell carries its station's
 *                error.
 *   THE WEATHER  a draw each day of CLEAR, HAZE or FOG, weighted by the season (winter is foggiest). Haze shortens
 *   AND THE      every sight that can be read (heliotropes cut through it); fog stops the theodolites and slows the
 *   COUNTY       ink. Eight towns each buy the SHEET of cells nearest them once it is mapped, at a grade set by its
 *                mean error, and then pay for copies every day. A sheet sold at a poor grade can be reissued when
 *                its survey improves.
 *
 * Units: t is in DAYS; distances are in CELLS; heights run 0..1. game.js turns real seconds into days.
 */
'use strict';

var SIM = (function () {
  /* ------------------------------------------------------------ calendar */
  var DAY_SEC = 3;                             // real seconds per day at 1x
  var SEASONS = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];
  var SEASON_DAYS = 10;
  var YEAR_DAYS = SEASON_DAYS * 4;
  var STEP = 0.02;                             // the sim's own granularity in days

  /* -------------------------------------------------------------- county */
  var COLS = 22, ROWS = 12, N = COLS * ROWS;
  var WATER_FRAC = 0.13;                       // the lowest ground is water (sea to the west, a lake or two)
  var WATER_H = 0.13;                          // a water surface, for sightlines
  var CANOPY = 0.05;                           // a forest stands this high above its ground
  var MAST = 0.02;                             // the theodolite's own height on its stand
  var TOWER_H = 0.07;                          // each tower level lifts the eye this much
  var TOWER_MAX = 2;
  var MIN_GAP = 1.5;                           // no two stations closer than this (cells)
  var TOWN_NAMES = ['ASHCOMBE', 'FENNICK', 'STANMERE', 'HOLLOWBY', 'MERROW', 'PELLING', 'WYKE CROSS', 'BRACKENHOLT'];
  var NT = TOWN_NAMES.length;

  /* ------------------------------------------------------------- survey */
  var RANGE = [5.0, 6.5, 8.5];                 // telescope range by level (cells)
  var DETAIL = [2.5, 3.3, 4.2];                // alidade reach by level (cells)
  var VERNIER = [1.0, 0.7, 0.5];               // error per sight, multiplied
  var ERR_K = 0.06;                            // error per cell of sight length, before the triangle's shape
  var MULES = [1.0, 0.78, 0.62];               // observation time multiplier
  var INK_RATE = 1.0;                          // cells a plane-table party inks in a clear day
  var HAZE_REACH = 0.6;                        // in haze only sights this fraction of the range can be read
  var GRADE_A = 0.18, GRADE_B = 0.36;          // a sheet's mean error at or under these is an A, a B; else a C
  var GRADE_NAMES = ['', 'C', 'B', 'A'];
  var GRADE_MULT = [0, 0.45, 0.7, 1.0];
  var PUBLISH_AT = 0.9;                        // a sheet can be published when this much of it is mapped
  var STIPEND = 4;                             // the Board's stipend, funds a day
  var CELL_FEE = 2;                            // the Board's fee for every cell inked for the first time
  var WIN_GRADE = 2;                           // the county is done when every sheet is published at grade B or better
  var GRANT = 110;                             // a sheet's grant at grade A, a mid-sized town, a mid-sized sheet
  var SALES = 1.1;                             // copies sold a day at grade A, a mid-sized town
  var TOWER_COST = [35, 60];

  var UPGRADES = {
    party:     { name: 'Another observing party',    base: 45,  mult: 1.9, max: 3, req: 0 },
    plane:     { name: 'Another plane-table party',  base: 40,  mult: 1.8, max: 3, req: 0 },
    barometer: { name: 'A barometer',                base: 30,  mult: 1,   max: 1, req: 0 },
    scope:     { name: 'A longer telescope',         base: 90,  mult: 2.2, max: 2, req: 1 },
    alidade:   { name: 'A better alidade',           base: 80,  mult: 2.1, max: 2, req: 1 },
    vernier:   { name: 'A finer vernier',            base: 110, mult: 2.2, max: 2, req: 2 },
    helio:     { name: 'Heliotropes',                base: 140, mult: 1,   max: 1, req: 2 },
    mules:     { name: 'A mule train',               base: 150, mult: 2.0, max: 2, req: 3 },
    checkbase: { name: 'A check baseline',           base: 180, mult: 1.7, max: 2, req: 3 },
    press:     { name: 'A printing press',           base: 260, mult: 1,   max: 1, req: 4 },
  };

  /* ------------------------------------------------------------ weather */
  var WEATHER = ['CLEAR', 'HAZE', 'FOG'];
  var WX_ODDS = [[0.6, 0.3], [0.58, 0.37], [0.45, 0.3], [0.36, 0.26]];   // [clear, haze] by season; fog is the rest

  /* ------------------------------------------------------------- helpers */
  function hash(n) { n = n | 0; n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15); return (n >>> 0) / 4294967296; }
  /* one epsilon for every calendar reading, so a step ending a hair before midnight changes day and season together */
  function tt(a) { return a.t + 1e-7; }
  function day(a) { return Math.floor(tt(a)); }
  function season(a) { return Math.floor((tt(a) % YEAR_DAYS) / SEASON_DAYS); }
  function seasonOfDay(d) { return Math.floor((d % YEAR_DAYS) / SEASON_DAYS); }
  function year(a) { return Math.floor(tt(a) / YEAR_DAYS) + 1; }
  function dayOfSeason(a) { return Math.floor(tt(a) % SEASON_DAYS); }
  function cx(i) { return i % COLS; }
  function cy(i) { return Math.floor(i / COLS); }
  function dist(i, j) { var dx = cx(i) - cx(j), dy = cy(i) - cy(j); return Math.sqrt(dx * dx + dy * dy); }

  /* ------------------------------------------------------- the terrain
   * Built from the county's seed alone and never saved: a save carries the seed, and the ground is re-made from it. */
  function vnoise(x, y, seed, scale) {
    function lat(ix, iy) { return hash(ix * 374761 + iy * 668265 + seed * 1013); }
    var fx = x / scale, fy = y / scale, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy;
    tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
    var a = lat(ix, iy), b = lat(ix + 1, iy), c = lat(ix, iy + 1), d = lat(ix + 1, iy + 1);
    return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
  }
  var GEO = typeof WeakMap !== 'undefined' ? new WeakMap() : null, GEO_KEY = {};
  function makeGeo(seed) {
    var raw = [], i;
    for (i = 0; i < N; i++) {
      var x = cx(i), y = cy(i);
      var v = 0.55 * vnoise(x, y, seed, 5.5) + 0.3 * vnoise(x, y, seed + 7, 2.7) + 0.15 * vnoise(x, y, seed + 13, 1.3);
      v -= 0.32 * Math.max(0, 1 - x / 4.5);            // the sea comes in from the west
      raw.push([v, i]);
    }
    /* rank-normalise: heights spread evenly over 0..1 whatever the seed */
    raw.sort(function (p, q) { return p[0] - q[0] || p[1] - q[1]; });
    var h = new Array(N), ter = new Array(N);
    for (i = 0; i < N; i++) h[raw[i][1]] = i / (N - 1);
    for (i = 0; i < N; i++) {
      var f = vnoise(cx(i), cy(i), seed + 29, 3.2) * 0.8 + hash(i * 31 + seed) * 0.2;
      ter[i] = h[i] < WATER_FRAC ? 'water' : h[i] >= 0.91 ? 'peak' : h[i] >= 0.7 ? 'hill' : (f > 0.58 && h[i] < 0.7) ? 'forest' : 'low';
    }
    /* the towns: lowland cells spread over the county by farthest-point choice, the first nearest the middle-west */
    var towns = [], cand = [];
    for (i = 0; i < N; i++) if (ter[i] === 'low' && cx(i) > 0 && cx(i) < COLS - 1 && cy(i) > 0 && cy(i) < ROWS - 1) cand.push(i);
    var first = -1, bestS = -1e9;
    for (var k = 0; k < cand.length; k++) { var c0 = cand[k], sc = -Math.abs(cx(c0) - 7) - Math.abs(cy(c0) - 6) * 0.8 + hash(c0 + seed) * 0.5; if (sc > bestS) { bestS = sc; first = c0; } }
    if (first < 0) first = Math.floor(N / 2);
    towns.push(first);
    while (towns.length < NT) {
      var pick = -1, far = -1;
      for (var q = 0; q < cand.length; q++) {
        var cc = cand[q]; if (towns.indexOf(cc) >= 0) continue;
        var md = 1e9; for (var t = 0; t < towns.length; t++) md = Math.min(md, dist(cc, towns[t]));
        md += hash(cc * 7 + seed) * 0.6;
        if (md > far) { far = md; pick = cc; }
      }
      if (pick < 0) break;
      towns.push(pick);
    }
    /* the SEA: water joined to the edge of the county. It is on no sheet (the Board surveys land and its lakes) */
    var sea = new Array(N), stack = [];
    for (i = 0; i < N; i++) { sea[i] = false; if (ter[i] === 'water' && (cx(i) === 0 || cy(i) === 0 || cx(i) === COLS - 1 || cy(i) === ROWS - 1)) { sea[i] = true; stack.push(i); } }
    while (stack.length) {
      var c1 = stack.pop(), nb = [c1 - 1, c1 + 1, c1 - COLS, c1 + COLS];
      for (var n1 = 0; n1 < 4; n1++) {
        var c2 = nb[n1];
        if (c2 < 0 || c2 >= N || (n1 < 2 && cy(c2) !== cy(c1))) continue;
        if (!sea[c2] && ter[c2] === 'water') { sea[c2] = true; stack.push(c2); }
      }
    }
    /* each town's sheet: the land and lake cells nearest it */
    var sheet = new Array(N), sheetCells = towns.map(function () { return []; });
    for (i = 0; i < N; i++) {
      if (sea[i]) { sheet[i] = -1; continue; }
      var bi = 0, bd = 1e9;
      for (var tt2 = 0; tt2 < towns.length; tt2++) { var dd = dist(i, towns[tt2]) + hash(i * 13 + tt2 * 7 + seed) * 0.35; if (dd < bd) { bd = dd; bi = tt2; } }
      sheet[i] = bi; sheetCells[bi].push(i);
    }
    var size = towns.map(function (c, n) { return n === 0 ? 1.4 : 0.65 + 0.6 * hash(c * 17 + seed); });
    var land = 0; for (i = 0; i < N; i++) if (!sea[i]) land++;
    return { seed: seed, h: h, ter: ter, sea: sea, land: land, towns: towns, sheet: sheet, sheetCells: sheetCells, size: size };
  }
  function geo(a) {
    if (GEO) { var g0 = GEO.get(a); if (g0 && g0.seed === a.seed) return g0; var g1 = makeGeo(a.seed); GEO.set(a, g1); return g1; }
    if (!GEO_KEY[a.seed]) GEO_KEY[a.seed] = makeGeo(a.seed);
    return GEO_KEY[a.seed];
  }
  /* what stands in the way of a sight at a cell: the ground, or the water's surface, plus a forest's canopy */
  function obstruction(G, j) { return G.ter[j] === 'water' ? WATER_H : G.h[j] + (G.ter[j] === 'forest' ? CANOPY : 0); }
  function groundH(G, j) { return G.ter[j] === 'water' ? WATER_H : G.h[j]; }
  function eyeH(G, i, tower) { return groundH(G, i) + MAST + TOWER_H * (tower || 0); }
  /* does the line from eye A to height hb over cell j clear everything between? (the two end cells never block) */
  function clear(G, i, ha, j, hb) {
    var x0 = cx(i) + 0.5, y0 = cy(i) + 0.5, x1 = cx(j) + 0.5, y1 = cy(j) + 0.5, d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
    var n = Math.max(2, Math.ceil(d * 4));
    for (var k = 1; k < n; k++) {
      var f = k / n, px = x0 + (x1 - x0) * f, py = y0 + (y1 - y0) * f, c = Math.floor(py) * COLS + Math.floor(px);
      if (c === i || c === j) continue;
      if (obstruction(G, c) >= ha + (hb - ha) * f) return false;
    }
    return true;
  }

  /* -------------------------------------------------------------- a new county */
  function newCounty(seed) {
    seed = (seed === undefined ? 1 : seed) | 0;
    var a = { v: 1, seed: seed, t: 0.2, funds: 120, announced: 0, stations: [], edges: [], cells: [], sheets: [],
      levels: {}, parties: 1, planes: 1, inkProg: 0, obsWork: [], wx: 0, checkUsed: 0, events: [], seq: 0,
      won: false, wonAt: 0, endingSeen: false, published: 0, bestPublished: 0,
      stats: { raised: 0, towers: 0, fixed: 0, observed: 0, inked: 0, revised: 0, earned: 0, grants: 0, sales: 0, fogDays: 0, hazeDays: 0, reissued: 0 } };
    for (var k in UPGRADES) a.levels[k] = 0;
    var G = geo(a);
    for (var i = 0; i < N; i++) a.cells.push({ m: 0, err: 0 });
    for (var s = 0; s < NT; s++) a.sheets.push({ pub: 0, paid: 0 });
    /* the measured baseline: two cells near the county town that see each other, about four cells apart, chosen
     * so that the most places a first station could stand would see BOTH ends (a county where no such place
     * existed would leave a new player with nothing to do but guess at towers) */
    var t0 = G.towns[0], best = null, bs = -1e9, R0 = RANGE[0];
    for (var p = 0; p < N; p++) {
      if (G.ter[p] === 'water' || G.towns.indexOf(p) >= 0 || dist(p, t0) > 5) continue;
      for (var q = p + 1; q < N; q++) {
        if (G.ter[q] === 'water' || G.towns.indexOf(q) >= 0 || dist(q, t0) > 5) continue;
        var d = dist(p, q); if (d < 3 || d > 5.2) continue;
        if (!clear(G, p, eyeH(G, p, 0), q, eyeH(G, q, 0))) continue;
        var sites = 0;
        for (var c = 0; c < N; c++) {
          if (c === p || c === q || G.ter[c] === 'water' || G.towns.indexOf(c) >= 0 || dist(c, p) < MIN_GAP || dist(c, q) < MIN_GAP) continue;
          if (dist(c, p) > R0 || dist(c, q) > R0) continue;
          var ec = eyeH(G, c, 0);
          if (clear(G, c, ec, p, eyeH(G, p, 0)) && clear(G, c, ec, q, eyeH(G, q, 0))) sites++;
        }
        var sc = Math.min(sites, 8) * 1.0 - Math.abs(d - 4) - 0.2 * (dist(p, t0) + dist(q, t0)) + (G.ter[p] === 'low' ? 0.3 : 0) + (G.ter[q] === 'low' ? 0.3 : 0);
        if (sc > bs) { bs = sc; best = [p, q]; }
      }
    }
    if (!best) { best = [t0 - 2 >= 0 ? t0 - 2 : t0 + 2, t0 + 2 < N ? t0 + 2 : t0 - 3]; }
    a.stations.push({ i: best[0], tower: 0, fixed: true, err: 0, base: true, at: 0 });
    a.stations.push({ i: best[1], tower: 0, fixed: true, err: 0, base: true, at: 0 });
    rebuildEdges(a);
    a.edges.forEach(function (e) { if (e.a === 0 && e.b === 1) { e.obs = 1; e.done = true; } });
    a.wx = weatherOn(a, 0);
    return a;
  }

  /* ------------------------------------------------------------- queries */
  function range(a) { return RANGE[Math.min(RANGE.length - 1, a.levels.scope)]; }
  function detail(a) { return DETAIL[Math.min(DETAIL.length - 1, a.levels.alidade)]; }
  function vernier(a) { return VERNIER[Math.min(VERNIER.length - 1, a.levels.vernier)]; }
  function obsDays(a, len) { return (0.7 + 0.28 * len) * MULES[Math.min(MULES.length - 1, a.levels.mules)]; }
  function stationAt(a, i) { for (var k = 0; k < a.stations.length; k++) if (a.stations[k].i === i) return k; return -1; }
  function edgeLen(a, e) { return dist(a.stations[e.a].i, a.stations[e.b].i); }
  function isTown(a, i) { return geo(a).towns.indexOf(i) >= 0; }
  /* a sightline between two stations: in range, and nothing between their eyes */
  function sees(a, s1, s2) {
    var G = geo(a), A = a.stations[s1], B = a.stations[s2];
    if (dist(A.i, B.i) > range(a) + 1e-9) return false;
    return clear(G, A.i, eyeH(G, A.i, A.tower), B.i, eyeH(G, B.i, B.tower));
  }
  function rebuildEdges(a) {
    var keep = {};
    a.edges.forEach(function (e) { keep[e.a + '-' + e.b] = e; });
    var out = [];
    for (var p = 0; p < a.stations.length; p++) for (var q = p + 1; q < a.stations.length; q++) {
      var e = keep[p + '-' + q];
      if (e || sees(a, p, q)) out.push(e || { a: p, b: q, obs: 0, done: false });
    }
    a.edges = out;
  }
  function edgesOf(a, s) { var o = []; for (var k = 0; k < a.edges.length; k++) { var e = a.edges[k]; if (e.a === s || e.b === s) o.push(e); } return o; }
  function doneEdge(a, s1, s2) { var p = Math.min(s1, s2), q = Math.max(s1, s2); for (var k = 0; k < a.edges.length; k++) { var e = a.edges[k]; if (e.a === p && e.b === q) return e.done ? e : null; } return null; }
  /* the angle at station S between its sights to A and B, in degrees */
  function angleAt(a, s, A, B) {
    var S = a.stations[s].i, ia = a.stations[A].i, ib = a.stations[B].i;
    var ux = cx(ia) - cx(S), uy = cy(ia) - cy(S), vx = cx(ib) - cx(S), vy = cy(ib) - cy(S);
    var c = (ux * vx + uy * vy) / Math.max(1e-9, Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy)));
    return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
  }
  /* a triangle's shape factor: 1 for a good fix, growing as the angle at the new station thins toward 0 or 180 */
  function shapeFactor(deg) { return 1 / Math.max(0.15, Math.sin(deg * Math.PI / 180)); }
  /* every fixing triangle a station has now: [A, B, the error it gives, the angle] */
  function fixes(a, s) {
    var st = a.stations[s], out = [];
    if (st.base) return out;
    var nb = [];
    edgesOf(a, s).forEach(function (e) { if (!e.done) return; var o = e.a === s ? e.b : e.a; if (a.stations[o].fixed) nb.push(o); });
    /* the third side of the triangle is known by reckoning once both ends are fixed; it need not be observed */
    for (var x = 0; x < nb.length; x++) for (var y = x + 1; y < nb.length; y++) {
      var A = nb[x], B = nb[y];
      var ang = angleAt(a, s, A, B), la = dist(st.i, a.stations[A].i), lb = dist(st.i, a.stations[B].i);
      var e = Math.max(a.stations[A].err, a.stations[B].err) + ERR_K * vernier(a) * (la + lb) / 2 * shapeFactor(ang);
      out.push([A, B, e, ang]);
    }
    return out;
  }
  /* settle the network: every station's error from its fixing triangles, until nothing changes. Errors only fall. */
  function refix(a) {
    var newly = [];
    for (var pass = 0; pass < a.stations.length + 2; pass++) {
      var changed = false;
      for (var s = 0; s < a.stations.length; s++) {
        var st = a.stations[s]; if (st.base) continue;
        var fx = fixes(a, s); if (!fx.length) continue;
        var best = 1e9; for (var k = 0; k < fx.length; k++) best = Math.min(best, fx[k][2]);
        var e = best / (1 + 0.25 * Math.min(fx.length - 1, 4));
        if (!st.fixed) { st.fixed = true; st.err = e; st.at = a.t; newly.push(s); changed = true; }
        else if (e < st.err - 1e-9) { st.err = e; changed = true; }
      }
      if (!changed) break;
    }
    return newly;
  }
  function fixedCount(a) { var n = 0; for (var s = 0; s < a.stations.length; s++) if (a.stations[s].fixed) n++; return n; }
  /* the cells a fixed station's plane-table party can draw: every cell within the alidade's reach, nearest first.
   * The party walks the ground round its station, so a valley or a wood inside the reach is drawn too (sightlines
   * are the network's business; the detail is legwork). A cell the station's eye cannot see costs a little more
   * error, drawn from a walk rather than a sight. */
  var VIS = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  var HIDDEN_ERR = 0.06;
  function visOf(a, s) {
    var st = a.stations[s], key = st.i + ':' + st.tower + ':' + a.levels.alidade;
    var m = VIS ? VIS.get(a) : null; if (!m) { m = {}; if (VIS) VIS.set(a, m); }
    if (m[s] && m[s].key === key) return m[s].list;
    var G = geo(a), R = detail(a), eye = eyeH(G, st.i, st.tower), out = [];
    for (var j = 0; j < N; j++) {
      var d = dist(st.i, j); if (d > R + 1e-9) continue;
      var seen = d <= 1.5 || clear(G, st.i, eye, j, groundH(G, j) + 0.01);
      out.push([d, j, seen ? 0 : HIDDEN_ERR]);
    }
    out.sort(function (p, q) { return p[0] - q[0] || p[1] - q[1]; });
    m[s] = { key: key, list: out };
    return out;
  }
  /* the network's signature: it changes whenever anything a plane-table depends on changes */
  function netSig(a) {
    var s = a.stations.length + '|' + a.levels.alidade + '|';
    for (var k = 0; k < a.stations.length; k++) { var st = a.stations[k]; s += (st.fixed ? Math.round(st.err * 1e5) : 'u') + ':' + st.tower + ','; }
    return s;
  }
  var CACHE = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  function cacheOf(a) { var c = CACHE ? CACHE.get(a) : a.__c; if (!c) { c = {}; if (CACHE) CACHE.set(a, c); } return c; }
  /* for every cell, the best any fixed station could draw it now: error and station (-1 where none sees it) */
  function bestMap(a) {
    var c = cacheOf(a), sig = netSig(a);
    if (c.best && c.best.sig === sig) return c.best;
    var err = new Array(N), st = new Array(N);
    for (var j = 0; j < N; j++) { err[j] = 1e9; st[j] = -1; }
    for (var s = 0; s < a.stations.length; s++) {
      var S = a.stations[s]; if (!S.fixed) continue;
      var v = visOf(a, s);
      for (var k = 0; k < v.length; k++) { var jj = v[k][1], e = S.err + 0.02 * v[k][0] + v[k][2]; if (e < err[jj]) { err[jj] = e; st[jj] = s; } }
    }
    c.best = { sig: sig, err: err, st: st };
    return c.best;
  }
  function bestFor(a, j) { var b = bestMap(a); return [b.err[j], b.st[j]]; }
  /* the next cell a plane-table party inks: an unmapped cell, nearest a fixed station, else the cell a better
   * station would draw most truly than it stands drawn now. Nothing to do is remembered until the network changes. */
  function inkTarget(a) {
    var c = cacheOf(a), sig = netSig(a);
    if (c.stall === sig) return null;
    var bestNew = -1, bnd = 1e9, bne = 1e9;
    var G = geo(a);
    for (var s = 0; s < a.stations.length; s++) {
      var st = a.stations[s]; if (!st.fixed) continue;
      var v = visOf(a, s);
      for (var k = 0; k < v.length; k++) {
        var j = v[k][1]; if (a.cells[j].m || G.sea[j]) continue;
        var d = v[k][0], e = st.err + 0.02 * d + v[k][2];
        if (d < bnd - 1e-9 || (Math.abs(d - bnd) <= 1e-9 && e < bne)) { bnd = d; bne = e; bestNew = j; }
        break;
      }
    }
    if (bestNew >= 0) return [bestNew, false];
    var bm = bestMap(a), bestRev = -1, gain = 0.08;
    for (var j2 = 0; j2 < N; j2++) {
      if (!a.cells[j2].m || bm.st[j2] < 0) continue;
      var g2 = a.cells[j2].err - bm.err[j2];
      if (g2 > gain) { gain = g2; bestRev = j2; }
    }
    if (bestRev >= 0) return [bestRev, true];
    c.stall = sig;
    return null;
  }
  function mappedCount(a) { var n = 0; for (var i = 0; i < N; i++) if (a.cells[i].m) n++; return n; }
  function landCount(a) { return geo(a).land; }
  /* a sheet: how much of it is mapped, its mean error, the grade it would print at now */
  function sheetStats(a, k) {
    var G = geo(a), cells = G.sheetCells[k], m = 0, se = 0;
    for (var q = 0; q < cells.length; q++) { var c = a.cells[cells[q]]; if (c.m) { m++; se += c.err; } }
    var mean = m ? se / m : 0, grade = !m ? 0 : mean <= GRADE_A + 1e-9 ? 3 : mean <= GRADE_B + 1e-9 ? 2 : 1;
    return { cells: cells.length, mapped: m, frac: m / Math.max(1, cells.length), mean: mean, grade: grade, ready: m / Math.max(1, cells.length) >= PUBLISH_AT - 1e-9 };
  }
  function grant(a, k, grade) { var G = geo(a); return Math.round(GRANT * G.size[k] * (G.sheetCells[k].length / 33) * GRADE_MULT[grade]); }
  function salesRate(a) {
    var G = geo(a), r = 0;
    for (var k = 0; k < NT; k++) if (a.sheets[k].pub) r += SALES * G.size[k] * GRADE_MULT[a.sheets[k].pub];
    return r * (a.levels.press ? 1.8 : 1);
  }
  function incomeRate(a) { return STIPEND + salesRate(a); }
  function publishedCount(a) { var n = 0; for (var k = 0; k < NT; k++) if (a.sheets[k].pub) n++; return n; }
  /* sheets the Board accepts as final: published at grade B or better */
  function goodSheets(a) { var n = 0; for (var k = 0; k < NT; k++) if (a.sheets[k].pub >= WIN_GRADE) n++; return n; }

  /* ------------------------------------------------------------- weather */
  function weatherOn(a, d) {
    var o = WX_ODDS[seasonOfDay(d)], r = hash(d * 7919 + a.seed * 131 + 17);
    return r < o[0] ? 0 : r < o[0] + o[1] ? 1 : 2;
  }
  function forecast(a, n) { var out = [], d0 = day(a); for (var k = 0; k < n; k++) out.push(weatherOn(a, d0 + k)); return out; }
  /* can this sight be read in today's weather? */
  function readable(a, e) {
    if (a.wx === 2) return false;
    if (a.wx === 1 && !a.levels.helio && edgeLen(a, e) > HAZE_REACH * range(a) + 1e-9) return false;
    return true;
  }

  /* ------------------------------------------------------------- prices */
  function cost(a, k) { var u = UPGRADES[k]; return Math.round(u.base * Math.pow(u.mult, a.levels[k])); }
  function stationCost(a, i) { var G = geo(a); return Math.round(10 + 26 * G.h[i] + 2 * a.stations.length); }
  function towerCost(a, s) { var t = a.stations[s] ? a.stations[s].tower : TOWER_MAX; return t >= TOWER_MAX ? 0 : TOWER_COST[t]; }
  function whyNot(a, k) {
    var u = UPGRADES[k];
    if (!u) return 'there is no such thing';
    if (a.levels[k] >= u.max) return 'already done';
    if (a.bestPublished < u.req) return 'the Board wants ' + u.req + (u.req === 1 ? ' sheet' : ' sheets') + ' published first';
    if (k === 'checkbase' && !checkCandidate(a)) return 'no observed sight of 6 cells or less joins two fixed stations yet';
    if (a.funds < cost(a, k)) return 'not enough funds';
    return '';
  }
  function whyNotRaise(a, i) {
    var G = geo(a);
    if (!(i >= 0 && i < N)) return 'there is no such place';
    if (G.ter[i] === 'water') return 'a station cannot stand in water';
    if (G.towns.indexOf(i) >= 0) return 'the town stands there';
    for (var s = 0; s < a.stations.length; s++) if (dist(a.stations[s].i, i) < MIN_GAP) return a.stations[s].i === i ? 'a station stands there already' : 'too close to another station';
    if (a.funds < stationCost(a, i)) return 'not enough funds';
    return '';
  }
  function whyNotTower(a, s) {
    if (!(s >= 0 && s < a.stations.length)) return 'there is no station there';
    if (a.stations[s].tower >= TOWER_MAX) return 'that tower is as tall as it goes';
    if (a.funds < towerCost(a, s)) return 'not enough funds';
    return '';
  }
  function whyNotPublish(a, k) {
    if (!(k >= 0 && k < NT)) return 'there is no such sheet';
    var st = sheetStats(a, k), sh = a.sheets[k];
    if (!st.ready) return 'only ' + Math.floor(st.frac * 100) + '% of the sheet is mapped; it needs ' + Math.round(PUBLISH_AT * 100) + '%';
    if (sh.pub && st.grade <= sh.pub) return 'it is published at grade ' + GRADE_NAMES[sh.pub] + '; the survey must improve to reissue it';
    return '';
  }
  /* the sight a check baseline would re-measure: the observed sight between two fixed stations, 6 cells or less,
   * whose ends carry the most error */
  function checkCandidate(a) {
    var best = null, be = 0.02;
    for (var k = 0; k < a.edges.length; k++) {
      var e = a.edges[k]; if (!e.done) continue;
      var A = a.stations[e.a], B = a.stations[e.b];
      if (!A.fixed || !B.fixed || (A.base && B.base) || edgeLen(a, e) > 6 + 1e-9) continue;
      var err = A.err + B.err; if (err > be) { be = err; best = e; }
    }
    return best;
  }

  /* -------------------------------------------------------------- events */
  function ev(a, kind, msg, extra) {
    a.seq++;
    var e = { seq: a.seq, t: a.t, kind: kind, msg: msg };
    if (extra) for (var k in extra) e[k] = extra[k];
    a.events.push(e);
    if (a.events.length > 40) a.events.shift();
    return e;
  }

  /* ------------------------------------------------------------- actions */
  function buy(a, k) {
    var w = whyNot(a, k); if (w) return w;
    a.funds -= cost(a, k); a.levels[k]++;
    if (k === 'party') a.parties++;
    if (k === 'plane') a.planes++;
    if (k === 'scope') rebuildEdges(a);
    /* a finer vernier re-reckons every station at once (waiting for the next sight to complete could mean waiting
     * for ever when every sight is already read) */
    if (k === 'vernier') settle(a);
    if (k === 'checkbase') {
      var e = checkCandidate(a);
      a.stations[e.a].base = true; a.stations[e.a].err = 0; a.stations[e.b].base = true; a.stations[e.b].err = 0;
      a.checkUsed++;
      settle(a);
      ev(a, 'check', 'A check baseline is chained between two stations ' + edgeLen(a, e).toFixed(1) + ' cells apart. Both now carry no error, and every station fixed through them is re-reckoned.');
    }
    return '';
  }
  function raise(a, i) {
    var w = whyNotRaise(a, i); if (w) return w;
    a.funds -= stationCost(a, i);
    a.stations.push({ i: i, tower: 0, fixed: false, err: 0, base: false, at: a.t });
    a.stats.raised++;
    rebuildEdges(a);
    return '';
  }
  function tower(a, s) {
    var w = whyNotTower(a, s); if (w) return w;
    a.funds -= towerCost(a, s); a.stations[s].tower++; a.stats.towers++;
    rebuildEdges(a);
    return '';
  }
  function publish(a, k) {
    var w = whyNotPublish(a, k); if (w) return w;
    var st = sheetStats(a, k), sh = a.sheets[k], G = geo(a), g = grant(a, k, st.grade), pay = Math.max(0, g - sh.paid), was = sh.pub;
    sh.pub = st.grade; sh.paid = Math.max(sh.paid, g);
    a.funds += pay; a.stats.earned += pay; a.stats.grants += pay;
    if (was) a.stats.reissued++;
    var n = publishedCount(a), old = a.bestPublished;
    a.published = n; if (n > a.bestPublished) a.bestPublished = n;
    ev(a, 'publish', (was ? 'The ' + TOWN_NAMES[k] + ' sheet is reissued at grade ' : 'The ' + TOWN_NAMES[k] + ' sheet is published at grade ') + GRADE_NAMES[st.grade] + ': the Board pays ' + pay + ' and the town buys copies.', { k: k, grade: st.grade, pay: pay });
    announce(a, old);
    if (!a.won && goodSheets(a) >= NT) {
      a.won = true; a.wonAt = a.t;
      var grades = a.sheets.map(function (x) { return x.pub; });
      a.wonStats = { day: day(a), year: year(a), stations: a.stations.length, fixed: fixedCount(a), mapped: mappedCount(a), grades: grades, earned: Math.round(a.stats.earned), a: grades.filter(function (x) { return x === 3; }).length };
      ev(a, 'win', 'Every sheet of the county is published. It is known now, hill by hill.');
    }
    void G;
    return '';
  }
  function announce(a, old) {
    var un = [];
    for (var k in UPGRADES) { var u = UPGRADES[k]; if (u.req && old < u.req && a.bestPublished >= u.req) un.push(u.name); }
    if (un.length) ev(a, 'unlock', 'The Board grants more: ' + un.map(function (n, q) { return q ? n.charAt(0).toLowerCase() + n.slice(1) : n.toLowerCase(); }).join(', ') + (un.length === 1 ? ' is' : ' are') + ' on the INSTRUMENTS tab now.');
  }
  function settle(a) {
    var n = refix(a);
    for (var k = 0; k < n.length; k++) {
      var st = a.stations[n[k]]; a.stats.fixed++;
      ev(a, 'fixed', 'A station is fixed' + (a.stations[n[k]].tower ? ' on its tower' : '') + ', to within ' + st.err.toFixed(2) + ' chains.', { s: n[k], err: st.err });
    }
    return n.length;
  }

  /* ------------------------------------------------------------- the parties */
  /* which sight the next free observing party takes: one that would fix a station first, then one that closes a
   * triangle between fixed stations, shortest first; never one another party holds */
  function pickEdge(a, taken) {
    var best = -1, bs = -1e9;
    for (var k = 0; k < a.edges.length; k++) {
      var e = a.edges[k]; if (e.done || taken[k] || !readable(a, e)) continue;
      var A = a.stations[e.a], B = a.stations[e.b], sc = 0;
      if (A.fixed !== B.fixed) sc = 3; else if (A.fixed && B.fixed) sc = 1.5; else sc = 0.5;
      sc -= edgeLen(a, e) * 0.05;
      if (sc > bs) { bs = sc; best = k; }
    }
    return best;
  }
  function observe(a, dt) {
    var mult = 1, taken = {}, done = 0;
    /* keep each party on its sight while it can still be read; otherwise it takes the best free one */
    var work = [];
    for (var p = 0; p < a.parties; p++) {
      var k = a.obsWork[p];
      if (!(k >= 0 && k < a.edges.length) || a.edges[k].done || taken[k] || !readable(a, a.edges[k])) k = pickEdge(a, taken);
      work.push(k); if (k >= 0) taken[k] = 1;
    }
    a.obsWork = work;
    for (var q = 0; q < work.length; q++) {
      var ek = work[q]; if (ek < 0) continue;
      var e = a.edges[ek];
      e.obs += dt * mult / obsDays(a, edgeLen(a, e));
      if (e.obs >= 1) { e.obs = 1; e.done = true; a.stats.observed++; done++; }
    }
    return done;
  }
  function ink(a, dt) {
    var wxm = a.wx === 2 ? 0.35 : a.wx === 1 ? 0.8 : 1;
    a.inkProg += a.planes * INK_RATE * wxm * dt;
    var n = 0;
    while (a.inkProg >= 1) {
      var tg = inkTarget(a);
      if (!tg) { a.inkProg = Math.min(a.inkProg, 1); break; }
      var b = bestFor(a, tg[0]);
      a.cells[tg[0]].m = 1; a.cells[tg[0]].err = b[0]; a.cells[tg[0]].at = a.t;
      if (tg[1]) a.stats.revised++; else { a.stats.inked++; a.funds += CELL_FEE; a.stats.earned += CELL_FEE; a.stats.fees = (a.stats.fees || 0) + CELL_FEE; }
      a.inkProg -= 1; n++;
    }
    return n;
  }

  /* ----------------------------------------------------------------- time */
  function seasonStart(a) {
    var s = season(a), y = year(a);
    var note = ['The ground dries and the hills stand clear.', 'Long days, and haze over the low ground.', 'The fogs begin.', 'Short days and the thickest fogs of the year.'][s];
    ev(a, 'season', SEASONS[s] + ', year ' + y + '. ' + note);
  }
  function dawn(a) {
    var d = day(a);
    var was = a.wx;
    a.wx = weatherOn(a, d);
    if (a.wx === 2) a.stats.fogDays++; else if (a.wx === 1) a.stats.hazeDays++;
    if (a.wx === 2 && was !== 2) ev(a, 'weather', 'Fog. The theodolites stand idle; the plane-tables work slowly.');
    else if (a.wx === 1 && was === 0) ev(a, 'weather', 'Haze. Only the shorter sights can be read today' + (a.levels.helio ? ', but the heliotropes flash through it.' : '.'));
    else if (a.wx === 0 && was !== 0) ev(a, 'weather', 'Clear again. Every sight in range can be read.');
    /* sheets newly ready to publish */
    for (var k = 0; k < NT; k++) {
      var st = sheetStats(a, k), sh = a.sheets[k];
      if (st.ready && !sh.ready) { sh.ready = 1; if (!sh.pub) ev(a, 'ready', 'The ' + TOWN_NAMES[k] + ' sheet is mapped and ready to publish at grade ' + GRADE_NAMES[st.grade] + '.', { k: k }); }
    }
  }
  /* one small step (dt <= STEP days) */
  function micro(a, dt) {
    var oldDay = day(a), oldSeason = season(a);
    if (observe(a, dt)) settle(a);
    ink(a, dt);
    var inc = incomeRate(a) * dt;
    a.funds += inc; a.stats.earned += inc; a.stats.sales += salesRate(a) * dt;
    a.t += dt;
    if (day(a) !== oldDay) { if (season(a) !== oldSeason) seasonStart(a); dawn(a); }
  }
  /* advance by dt days, never crossing a dawn inside a step */
  function step(a, dt) {
    while (dt > 1e-12) {
      var edge = day(a) + 1 - a.t;
      var h = Math.min(dt, STEP, Math.max(1e-9, edge));
      micro(a, h);
      dt -= h;
    }
  }

  /* ------------------------------------------------------------ the preview
   * what a station raised at cell i would see now: every existing station in range, and whether the line clears */
  function preview(a, i) {
    var G = geo(a), out = [], eye = eyeH(G, i, 0), R = range(a);
    for (var s = 0; s < a.stations.length; s++) {
      var st = a.stations[s], d = dist(i, st.i);
      if (d > R + 2) continue;
      var ok = d <= R + 1e-9 && clear(G, i, eye, st.i, eyeH(G, st.i, st.tower));
      out.push({ s: s, d: d, ok: ok, why: d > R + 1e-9 ? 'range' : ok ? '' : 'blocked' });
    }
    return out;
  }
  /* what a station raised at cell i would be fixed at once its sights are read, from the fixed stations it would see
   * now: the arithmetic of fixes() and refix(), before a coin is spent. null when it would see fewer than two. */
  function forecastFix(a, i) {
    var pv = preview(a, i), nb = [];
    for (var k = 0; k < pv.length; k++) if (pv[k].ok && a.stations[pv[k].s].fixed) nb.push(a.stations[pv[k].s]);
    if (nb.length < 2) return null;
    var best = null, n = 0;
    for (var x = 0; x < nb.length; x++) for (var y = x + 1; y < nb.length; y++) {
      var A = nb[x], B = nb[y];
      var ux = cx(A.i) - cx(i), uy = cy(A.i) - cy(i), vx = cx(B.i) - cx(i), vy = cy(B.i) - cy(i);
      var c = (ux * vx + uy * vy) / Math.max(1e-9, Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy)));
      var ang = Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
      var e = Math.max(A.err, B.err) + ERR_K * vernier(a) * (dist(i, A.i) + dist(i, B.i)) / 2 * shapeFactor(ang);
      n++;
      if (!best || e < best.err) best = { err: e, ang: ang };
    }
    best.err = best.err / (1 + 0.25 * Math.min(n - 1, 4));
    best.grade = best.err <= GRADE_A ? 3 : best.err <= GRADE_B ? 2 : 1;
    return best;
  }
  /* what lifting station s one stage would change: every station in range its eye cannot see now, and whether the
   * lift opens that sight (the same clear() test the network is built with, at the new height) */
  function towerGain(a, s) {
    var G = geo(a), st = a.stations[s], out = [], R = range(a);
    if (!st || st.tower >= TOWER_MAX) return out;
    var now = eyeH(G, st.i, st.tower), up = eyeH(G, st.i, st.tower + 1);
    for (var o = 0; o < a.stations.length; o++) {
      if (o === s) continue;
      var ot = a.stations[o];
      if (dist(st.i, ot.i) > R + 1e-9) continue;
      var he = eyeH(G, ot.i, ot.tower);
      if (clear(G, st.i, now, ot.i, he)) continue;
      out.push({ s: o, ok: clear(G, st.i, up, ot.i, he) });
    }
    return out;
  }

  return {
    DAY_SEC: DAY_SEC, SEASONS: SEASONS, SEASON_DAYS: SEASON_DAYS, YEAR_DAYS: YEAR_DAYS, COLS: COLS, ROWS: ROWS, N: N, NT: NT,
    TOWN_NAMES: TOWN_NAMES, UPGRADES: UPGRADES, RANGE: RANGE, DETAIL: DETAIL, VERNIER: VERNIER, MULES: MULES, WEATHER: WEATHER,
    GRADE_A: GRADE_A, GRADE_B: GRADE_B, GRADE_NAMES: GRADE_NAMES, GRADE_MULT: GRADE_MULT, PUBLISH_AT: PUBLISH_AT, STIPEND: STIPEND,
    TOWER_MAX: TOWER_MAX, TOWER_COST: TOWER_COST, HAZE_REACH: HAZE_REACH, ERR_K: ERR_K, INK_RATE: INK_RATE, MIN_GAP: MIN_GAP,
    hash: hash, newCounty: newCounty, geo: geo, day: day, season: season, year: year, dayOfSeason: dayOfSeason, cx: cx, cy: cy, dist: dist,
    eyeH: function (a, i, t) { return eyeH(geo(a), i, t); }, clear: function (a, i, ha, j, hb) { return clear(geo(a), i, ha, j, hb); },
    range: range, detail: detail, vernier: vernier, obsDays: obsDays, stationAt: stationAt, edgeLen: edgeLen, isTown: isTown, sees: sees,
    rebuildEdges: rebuildEdges, edgesOf: edgesOf, doneEdge: doneEdge, angleAt: angleAt, shapeFactor: shapeFactor, fixes: fixes, refix: refix,
    fixedCount: fixedCount, visOf: visOf, bestFor: bestFor, inkTarget: inkTarget, mappedCount: mappedCount, landCount: landCount, sheetStats: sheetStats,
    grant: grant, salesRate: salesRate, incomeRate: incomeRate, publishedCount: publishedCount, goodSheets: goodSheets, WIN_GRADE: WIN_GRADE, CELL_FEE: CELL_FEE,
    weatherOn: weatherOn, forecast: forecast,
    readable: readable, cost: cost, stationCost: stationCost, towerCost: towerCost, whyNot: whyNot, whyNotRaise: whyNotRaise,
    whyNotTower: whyNotTower, whyNotPublish: whyNotPublish, checkCandidate: checkCandidate,
    buy: buy, raise: raise, tower: tower, publish: publish, settle: settle, step: step, preview: preview,
    forecastFix: forecastFix, towerGain: towerGain,
  };
})();

if (typeof module !== 'undefined') module.exports = SIM;
