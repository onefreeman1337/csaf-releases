/* =====================================================================
   chart.js — CHARGE BARGE. The coastline.

   Generates each leg of the coast deterministically from (seed, leg):
   a resumed run replays the same water. The channel is a centreline
   plus a width, both built from layered sines; hostility rises with
   the leg index — narrower throats, harder bends, more rock.

   World frame: x is lateral (roughly canvas x), y runs UP the coast
   (the barge charges +y; the camera follows). All distances px.
   ===================================================================== */
'use strict';

(function (root) {

  /* mulberry32 — tiny seeded PRNG, good enough for coastlines */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  var LEG_LEN = 9000;          /* world px per leg */
  var STEP = 40;               /* channel sample spacing */
  var VIEW_W = 1000;

  /* Named water. Names escalate with the coast. After the list runs
     out the coast loops with "THE LONG CHARGE I, II…" — endless mode. */
  var LEG_NAMES = [
    'THE SKERRIES',
    "WRECKERS' TEETH",
    'THE THROAT',
    'GALLOWS REACH',
    'CAPE THUNDER',
    'THE BONEYARD',
    'WIDOWMAKER SOUND',
    'THE ANVIL SHORE'
  ];

  var COVE_NAMES = [
    'HALFLIGHT COVE', 'TALLOW HARBOUR', 'THE QUIET SHELF', 'BRINEHOLLOW',
    'LEEWARD REST', 'THE COPPER POOL', 'SAINT FUSE', 'LAST ANCHORAGE'
  ];

  var COVE_LINES = [
    'The dynamo hums. Spend what the coast gave you.',
    'Wreckers sell what wrecking brings. No questions in either direction.',
    'Water flat as a chart table. It will not last.',
    'The chandler bites every volt to check it is real.',
    'Somebody painted WELCOME on the rocks. Somebody else scratched it out.',
    'They pray to the storm here. It pays to be polite.',
    'The bell buoy rings without wind. Nobody discusses it.',
    'Beyond this pool the chart just says NO.'
  ];

  function legName(i) {
    if (i < LEG_NAMES.length) return LEG_NAMES[i];
    var n = i - LEG_NAMES.length + 1;
    return 'THE LONG CHARGE ' + roman(n);
  }
  function roman(n) {
    var out = '', v = [[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    for (var i = 0; i < v.length; i++) while (n >= v[i][0]) { out += v[i][1]; n -= v[i][0]; }
    return out;
  }

  /**
   * Build one leg. Everything downstream (render, physics, spawns)
   * reads this object; nothing regenerates.
   */
  function buildLeg(seed, leg) {
    var r = rng((seed * 2654435761 ^ (leg + 1) * 40503) >>> 0);
    var hostility = Math.min(1, leg * 0.14);          /* 0 → 1 over ~7 legs */

    /* --- channel spine: layered sines, amplitude and frequency rise --- */
    var n = Math.floor(LEG_LEN / STEP) + 2;
    var centre = new Float32Array(n);
    var width = new Float32Array(n);

    var f1 = 0.9 + r() * 0.6, f2 = 2.2 + r() * 1.4, f3 = 5 + r() * 3;
    var p1 = r() * 7, p2 = r() * 7, p3 = r() * 7;
    var amp = 120 + 150 * hostility;                   /* bend hard, later */
    var baseW = 520 - 190 * hostility;                 /* narrow, later */

    for (var i = 0; i < n; i++) {
      var t = i / (n - 1);
      var y = t * Math.PI * 2;
      centre[i] = VIEW_W / 2
        + Math.sin(y * f1 + p1) * amp
        + Math.sin(y * f2 + p2) * amp * 0.45
        + Math.sin(y * f3 + p3) * amp * 0.16;
      /* throats: width pinches at 2-3 spots per leg */
      var pinch =
        Math.exp(-Math.pow((t - (0.3 + r() * 0.001)) * 14, 2)) +
        Math.exp(-Math.pow((t - 0.62) * 16, 2)) * (hostility > 0.25 ? 1 : 0) +
        Math.exp(-Math.pow((t - 0.85) * 18, 2)) * (hostility > 0.5 ? 1 : 0);
      width[i] = Math.max(210, baseW - pinch * (150 + 90 * hostility)
        + Math.sin(y * 3.1 + p2) * 40);
      /* clamp the channel inside the view with a shoulder */
      var half = width[i] / 2;
      if (centre[i] - half < 60) centre[i] = 60 + half;
      if (centre[i] + half > VIEW_W - 60) centre[i] = VIEW_W - 60 - half;
    }

    /* opening and cove: wide, calm, straight */
    for (i = 0; i < 8; i++) {
      var ease = i / 8;
      width[i] = width[i] * ease + 620 * (1 - ease);
      centre[i] = centre[i] * ease + VIEW_W / 2 * (1 - ease);
      var j = n - 1 - i;
      width[j] = width[j] * ease + 660 * (1 - ease);
      centre[j] = centre[j] * ease + VIEW_W / 2 * (1 - ease);
    }

    /* --- rocks in the channel: collision. more + meaner later --- */
    var rocks = [];
    var rockCount = Math.floor(5 + hostility * 14 + r() * 4);
    for (i = 0; i < rockCount; i++) {
      var ry = 900 + r() * (LEG_LEN - 1800);
      var ci = channelAt(centre, width, ry);
      rocks.push({
        x: ci.c + (r() - 0.5) * (ci.w - 180),
        y: ry,
        r: 26 + r() * 30,
        seed: (r() * 1e9) | 0
      });
    }

    /* --- reefs: slow + scrape. drawn as pale teeth under water --- */
    var reefs = [];
    var reefCount = Math.floor(3 + hostility * 8 + r() * 3);
    for (i = 0; i < reefCount; i++) {
      ry = 700 + r() * (LEG_LEN - 1400);
      ci = channelAt(centre, width, ry);
      reefs.push({
        x: ci.c + (r() - 0.5) * (ci.w - 140),
        y: ry,
        r: 52 + r() * 46,
        seed: (r() * 1e9) | 0
      });
    }

    /* --- derelict wrecks: free salvage, the reason to steer close --- */
    var wrecks = [];
    var wreckCount = 3 + ((r() * 3) | 0);
    for (i = 0; i < wreckCount; i++) {
      ry = 800 + r() * (LEG_LEN - 1600);
      ci = channelAt(centre, width, ry);
      wrecks.push({
        x: ci.c + (r() - 0.5) * (ci.w - 160),
        y: ry,
        taken: false,
        seed: (r() * 1e9) | 0
      });
    }

    /* --- tower footings on the shore walls (foes.js arms them) --- */
    var towers = [];
    var towerCount = Math.floor(2 + hostility * 7 + r() * 2);
    for (i = 0; i < towerCount; i++) {
      ry = 1100 + (i + 0.4 + r() * 0.4) * ((LEG_LEN - 2000) / towerCount);
      ci = channelAt(centre, width, ry);
      var side = r() < 0.5 ? -1 : 1;
      towers.push({
        x: ci.c + side * (ci.w / 2 + 26),
        y: ry,
        side: side,
        seed: (r() * 1e9) | 0
      });
    }

    return {
      leg: leg,
      name: legName(leg),
      coveName: COVE_NAMES[leg % COVE_NAMES.length],
      coveLine: COVE_LINES[leg % COVE_LINES.length],
      hostility: hostility,
      length: LEG_LEN,
      step: STEP,
      centre: centre,
      width: width,
      rocks: rocks,
      reefs: reefs,
      wrecks: wrecks,
      towers: towers
    };
  }

  /* interpolated channel centre/width at world y */
  function channelAt(centre, width, y) {
    var f = y / STEP;
    var i = Math.max(0, Math.min(centre.length - 2, Math.floor(f)));
    var t = Math.max(0, Math.min(1, f - i));
    return {
      c: centre[i] * (1 - t) + centre[i + 1] * t,
      w: width[i] * (1 - t) + width[i + 1] * t
    };
  }

  root.Chart = {
    LEG_LEN: LEG_LEN,
    STEP: STEP,
    buildLeg: buildLeg,
    channelAt: function (legData, y) {
      return channelAt(legData.centre, legData.width, y);
    },
    rng: rng
  };

})(typeof window !== 'undefined' ? window : globalThis);
