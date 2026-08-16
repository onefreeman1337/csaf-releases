/* =====================================================================
   actives.js — CHARGE BARGE. Charge 2: the spendables.

   Six abilities bought with SURGE mid-run. Unlocks are paced by RENOWN
   (total wrecks sunk, persistent across runs and sinkings) — the
   second unlock ladder the operator asked for. game.js executes the
   effects; this file owns definitions, costs and the unlock line.
   ===================================================================== */
'use strict';

(function (root) {

  var LIST = [
    {
      id: 'ram', key: '1', name: 'RAMMING SPEED', cost: 30, renown: 0,
      blurb: 'Overcharge the engine. 2.5s: unhittable, and the hull itself wrecks what it touches.',
      dur: 2.5
    },
    {
      id: 'archers', key: '2', name: 'BOARDING ARCHERS', cost: 25, renown: 25,
      blurb: '12s: a crew of longbows volleys the nearest foes, over and over.',
      dur: 12
    },
    {
      id: 'tempest', key: '3', name: 'TEMPEST', cost: 60, renown: 60,
      blurb: 'One enormous ring of storm. Everything near the barge takes the sky personally.',
      dur: 0
    },
    {
      id: 'sloop', key: '4', name: 'MERCENARY SLOOP', cost: 45, renown: 110,
      blurb: '20s: a hired sloop holds your flank and shoots what you cannot.',
      dur: 20
    },
    {
      id: 'gunners', key: '5', name: 'HIRED GUNNERS', cost: 35, renown: 170,
      blurb: '12s: the pivot gun goes to double crews — twin shells, faster.',
      dur: 12
    },
    {
      id: 'patch', key: '6', name: 'PATCH CREW', cost: 40, renown: 240,
      blurb: 'Carpenters over the side, under fire. 35% hull back over 6s.',
      dur: 6
    }
  ];

  function byId(id) {
    for (var i = 0; i < LIST.length; i++) if (LIST[i].id === id) return LIST[i];
    return null;
  }

  /** ids unlocked at a renown value */
  function unlockedAt(renown) {
    var out = [];
    for (var i = 0; i < LIST.length; i++) if (renown >= LIST[i].renown) out.push(LIST[i].id);
    return out;
  }

  /** the next locked ability, for the "next unlock" line — null if all open */
  function nextUnlock(renown) {
    for (var i = 0; i < LIST.length; i++) if (renown < LIST[i].renown) return LIST[i];
    return null;
  }

  root.Actives = { LIST: LIST, byId: byId, unlockedAt: unlockedAt, nextUnlock: nextUnlock };

})(typeof window !== 'undefined' ? window : globalThis);
