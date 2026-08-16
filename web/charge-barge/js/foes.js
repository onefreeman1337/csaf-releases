/* =====================================================================
   foes.js — CHARGE BARGE. The hostile part of the coastline.

   Foe definitions, per-leg spawn tables and behaviours. game.js owns
   the arrays and the tick; this file owns what a foe IS. New types
   layer in leg by leg — the unlock pacing rule applies to enemies too.
   ===================================================================== */
'use strict';

(function (root) {

  /* ------------------------------------------------------------ types */

  var TYPES = {
    /** Ramming skiff — fast, fragile, wants to touch you. */
    skiff: {
      hp: 14, speed: 175, radius: 14, dmg: 9, volts: 6, surge: 4,
      score: 1
    },
    /** Fireship — a skiff that detonates near the hull. Kill it early. */
    brander: {
      hp: 10, speed: 150, radius: 15, dmg: 22, blast: 90, volts: 9, surge: 5,
      score: 2
    },
    /** Shore tower — static, lobs ball shot at your predicted position. */
    tower: {
      hp: 46, radius: 20, dmg: 12, reload: 2.1, shot: 300, volts: 14, surge: 7,
      score: 2
    },
    /** Gunboat — paces the channel and broadsides on a reload. */
    gunboat: {
      hp: 34, speed: 105, radius: 18, dmg: 8, reload: 1.7, shot: 260, volts: 12, surge: 6,
      score: 2
    },
    /** Mortar barge — slow, arcing splash shells. Kill it or keep moving. */
    mortar: {
      hp: 58, speed: 44, radius: 22, dmg: 16, blast: 78, reload: 3.1, volts: 20, surge: 9,
      score: 3
    }
  };

  /* -------------------------------------------------- per-leg tables */
  /* Weighted spawn tables. A type absent from the table cannot appear —
     that IS the enemy unlock pacing. Rates in spawns/second, scaled by
     hostility inside game.js. */

  function tableFor(leg) {
    if (leg <= 0) return { rate: 0.42, mix: [['skiff', 1]] };
    if (leg === 1) return { rate: 0.5, mix: [['skiff', .72], ['brander', .28]] };
    if (leg === 2) return { rate: 0.56, mix: [['skiff', .5], ['brander', .22], ['gunboat', .28]] };
    if (leg === 3) return { rate: 0.62, mix: [['skiff', .4], ['brander', .2], ['gunboat', .26], ['mortar', .14]] };
    /* leg 4+ full mix, rate keeps climbing gently */
    var rate = Math.min(1.05, 0.66 + (leg - 4) * 0.055);
    return {
      rate: rate,
      mix: [['skiff', .34], ['brander', .2], ['gunboat', .26], ['mortar', .2]]
    };
  }

  /* Towers arm on leg 1+. Leg 0 keeps its footings dark — the player's
     first sight of a tower firing should come after the first cove. */
  function towersArmed(leg) { return leg >= 1; }

  function pick(mix, rand) {
    var t = rand(), acc = 0;
    for (var i = 0; i < mix.length; i++) {
      acc += mix[i][1];
      if (t <= acc) return mix[i][0];
    }
    return mix[mix.length - 1][0];
  }

  /**
   * Spawn a foe just outside the view ahead of the barge, inside the
   * channel. game.js supplies the leg data and camera.
   */
  function spawn(type, legData, aheadY, rand) {
    var def = TYPES[type];
    var ci = root.Chart.channelAt(legData, aheadY);
    var f = {
      type: type,
      x: ci.c + (rand() - 0.5) * (ci.w - 90),
      y: aheadY,
      vx: 0, vy: 0,
      hp: def.hp,
      radius: def.radius,
      reload: def.reload ? def.reload * (0.6 + rand() * 0.8) : 0,
      wob: rand() * 7,
      dead: false
    };
    return f;
  }

  /**
   * Per-foe behaviour tick. Writes movement into the foe; combat
   * decisions (firing) are returned as intents for game.js to execute,
   * because projectiles live there.
   *   returns null or {fire:'ball'|'mortar', tx, ty}
   */
  function tick(f, dt, barge, legData, t) {
    var def = TYPES[f.type];
    var intent = null;

    if (f.type === 'skiff' || f.type === 'brander') {
      /* home on the barge with a sea-wobble */
      var dx = barge.x - f.x, dy = barge.y - f.y;
      var d = Math.hypot(dx, dy) || 1;
      var s = def.speed;
      f.vx = dx / d * s + Math.sin(t * 3 + f.wob) * 22;
      f.vy = dy / d * s;
      f.x += f.vx * dt; f.y += f.vy * dt;
    }
    else if (f.type === 'tower') {
      /* static; lead the shot at the barge's current velocity */
      f.reload -= dt;
      var dist = Math.hypot(barge.x - f.x, barge.y - f.y);
      if (f.reload <= 0 && dist < 520) {
        f.reload = def.reload;
        var lead = dist / def.shot;
        intent = { fire: 'ball', tx: barge.x + barge.vx * lead, ty: barge.y + barge.vy * lead, speed: def.shot, dmg: def.dmg };
      }
    }
    else if (f.type === 'gunboat') {
      /* hold a lane: drift toward a point offset from the barge, match pace */
      var side = (f.wob % 2 < 1) ? -1 : 1;
      var wantX = barge.x + side * 190;
      var ci = root.Chart.channelAt(legData, f.y);
      var lo = ci.c - ci.w / 2 + 50, hi = ci.c + ci.w / 2 - 50;
      if (wantX < lo) wantX = lo; if (wantX > hi) wantX = hi;
      f.vx = (wantX - f.x) * 1.4;
      f.vy = (barge.y + 60 - f.y) * 0.9;
      var sp = Math.hypot(f.vx, f.vy), cap = def.speed;
      if (sp > cap) { f.vx = f.vx / sp * cap; f.vy = f.vy / sp * cap; }
      f.x += f.vx * dt; f.y += f.vy * dt;
      f.reload -= dt;
      if (f.reload <= 0 && Math.abs(f.y - barge.y) < 240) {
        f.reload = def.reload;
        intent = { fire: 'ball', tx: barge.x, ty: barge.y, speed: def.shot, dmg: def.dmg };
      }
    }
    else if (f.type === 'mortar') {
      /* crawl up-channel, keep distance, lob splash shells */
      var dy2 = barge.y + 300 - f.y;
      f.vy = Math.sign(dy2) * Math.min(Math.abs(dy2), def.speed);
      f.vx = Math.sin(t * 0.8 + f.wob) * 18;
      f.x += f.vx * dt; f.y += f.vy * dt;
      f.reload -= dt;
      var dist2 = Math.hypot(barge.x - f.x, barge.y - f.y);
      if (f.reload <= 0 && dist2 < 560) {
        f.reload = def.reload;
        intent = { fire: 'mortar', tx: barge.x + barge.vx * 0.9, ty: barge.y + barge.vy * 0.9, dmg: def.dmg, blast: def.blast };
      }
    }

    return intent;
  }

  root.Foes = {
    TYPES: TYPES,
    tableFor: tableFor,
    towersArmed: towersArmed,
    pick: pick,
    spawn: spawn,
    tick: tick
  };

})(typeof window !== 'undefined' ? window : globalThis);
