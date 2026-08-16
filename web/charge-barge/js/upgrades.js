/* =====================================================================
   upgrades.js — CHARGE BARGE. Charge 1: the economy.

   Nine upgrade lines bought with VOLTS in coves. Tier availability is
   gated by the leg you have reached — the operator's "lots of unlock
   layers paced over time" applied to the shop itself. Three of the
   nine lines are themselves locked behind legs.

   Every line states its effect as a pure function of tier so game.js
   never hard-codes a number that actually lives here.
   ===================================================================== */
'use strict';

(function (root) {

  /* Highest tier purchasable once you have REACHED leg L (0-based):
     legs 0-1 → tier 2 · leg 2 → 3 · leg 3 → 4 · leg 4+ → 5. */
  function tierCap(legReached) {
    if (legReached >= 4) return 5;
    if (legReached >= 3) return 4;
    if (legReached >= 2) return 3;
    return 2;
  }

  var LINES = [
    {
      id: 'pivot', name: 'PIVOT GUN', max: 5, base: 40, curve: 1.75, minLeg: 0,
      desc: 'The aimed gun. Heavier shot, faster crews.',
      /* dmg per shell, shots per second */
      effect: function (t) { return { dmg: 10 + t * 5, rate: 2.2 + t * 0.4 }; }
    },
    {
      id: 'coil', name: 'COIL BROADSIDE', max: 5, base: 45, curve: 1.75, minLeg: 0,
      desc: 'The auto-guns. More reach, more often.',
      /* dmg, seconds between volleys, range */
      effect: function (t) { return { dmg: 5 + t * 2.6, every: Math.max(0.34, 0.85 - t * 0.1), range: 240 + t * 36 }; }
    },
    {
      id: 'hull', name: 'IRON HULL', max: 5, base: 50, curve: 1.8, minLeg: 0,
      desc: 'Plate on plate. More hull, harder hull.',
      /* max hull, incoming damage multiplier */
      effect: function (t) { return { max: 100 + t * 28, take: 1 - t * 0.07 }; }
    },
    {
      id: 'engine', name: 'ENGINE', max: 5, base: 45, curve: 1.7, minLeg: 0,
      desc: 'Top speed and rudder answer. The coast gets less say.',
      /* cruise px/s, steer authority */
      effect: function (t) { return { cruise: 150 + t * 22, steer: 300 + t * 42 }; }
    },
    {
      id: 'dynamo', name: 'TRADE DYNAMO', max: 5, base: 35, curve: 1.8, minLeg: 0,
      desc: 'Volts per second under way. Slow water pays better.',
      effect: function (t) { return { perSec: t * 1.5 }; }
    },
    {
      id: 'rig', name: 'SALVAGE RIG', max: 5, base: 35, curve: 1.8, minLeg: 0,
      desc: 'Volts stripped per wreck. Violence as income.',
      /* multiplier on volt drops */
      effect: function (t) { return { mult: 1 + t * 0.35 }; }
    },
    {
      id: 'magnet', name: 'AMBER MAGNET', max: 3, base: 60, curve: 1.9, minLeg: 1,
      desc: 'Salvage comes to you. Unlocked past the first cove.',
      effect: function (t) { return { radius: 70 + t * 60 }; }
    },
    {
      id: 'banks', name: 'LEYDEN BANKS', max: 3, base: 70, curve: 1.9, minLeg: 1,
      desc: 'Deeper surge capacity. Bigger miracles held in reserve.',
      effect: function (t) { return { cap: 100 + t * 40 }; }
    },
    {
      id: 'tap', name: 'STORM TAP', max: 3, base: 80, curve: 1.95, minLeg: 2,
      desc: 'Surge gained per wreck. The storm notices you.',
      effect: function (t) { return { mult: 1 + t * 0.4 }; }
    }
  ];

  function line(id) {
    for (var i = 0; i < LINES.length; i++) if (LINES[i].id === id) return LINES[i];
    return null;
  }

  function cost(l, tier) {          /* cost of buying tier (1-based) */
    return Math.round(l.base * Math.pow(l.curve, tier - 1));
  }

  /** Effective stats for a full upgrade map {id:tier}. */
  function stats(up) {
    var s = {};
    for (var i = 0; i < LINES.length; i++) {
      var l = LINES[i];
      s[l.id] = l.effect(up[l.id] || 0);
    }
    return s;
  }

  root.Upgrades = { LINES: LINES, line: line, cost: cost, stats: stats, tierCap: tierCap };

})(typeof window !== 'undefined' ? window : globalThis);
