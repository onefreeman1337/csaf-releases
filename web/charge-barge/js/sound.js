/* =====================================================================
   sound.js — CHARGE BARGE. Every sound, synthesized.

   No audio files ship with this game. Each effect is a ZzFX parameter
   set — sound as code, matching art.js's every-pixel-drawn thesis.

   Contains ZzFXMicro v1.3.2, MIT licence:
     Copyright (c) 2019 Frank Force  (github.com/KilledByAPixel/ZzFX)
     Permission is hereby granted, free of charge, to any person
     obtaining a copy of this software and associated documentation
     files (the "Software"), to deal in the Software without
     restriction, including without limitation the rights to use, copy,
     modify, merge, publish, distribute, sublicense, and/or sell copies
     of the Software. The above notice shall be included in all copies
     or substantial portions of the Software. THE SOFTWARE IS PROVIDED
     "AS IS", WITHOUT WARRANTY OF ANY KIND.
   MODIFIED here (as the MIT licence permits): the AudioContext is
   created LAZILY on the first play instead of at load — browsers block
   audio before a user gesture, and the run begins from a click, so the
   first click both creates and unlocks it. Combat sounds fired by the
   loop are safe because the loop only runs after that click.
   ===================================================================== */
'use strict';

(function (root) {

  var zzfxV = 0.28;         /* master volume */
  var zzfxX = null;         /* AudioContext — created on first play */

  /* ZzFXMicro v1.3.2 by Frank Force, MIT (see header). Reformatted only
     as far as the lazy-context change required; the algorithm is his. */
  function zzfx(p, k, b, e, r, t, q, D, u, y, v, z, l, E, A, F, c, w, m, B, N) {
    p = p === undefined ? 1 : p; k = k || .05; b = b === undefined ? 220 : b;
    e = e || 0; r = r || 0; t = t === undefined ? .1 : t; q = q || 0;
    D = D === undefined ? 1 : D; u = u || 0; y = y || 0; v = v || 0; z = z || 0;
    l = l || 0; E = E || 0; A = A || 0; F = F || 0; c = c || 0;
    w = w === undefined ? 1 : w; m = m || 0; B = B || 0; N = N || 0;
    if (!zzfxX) zzfxX = new (root.AudioContext || root.webkitAudioContext)();
    if (zzfxX.state === 'suspended') zzfxX.resume();
    var M = Math, d = 2 * M.PI, R = 44100, G = u *= 500 * d / R / R,
        C = b *= (1 - k + 2 * k * M.random(k = [])) * d / R,
        g = 0, H = 0, a = 0, n = 1, I = 0, J = 0, f = 0, h = N < 0 ? -1 : 1,
        x = d * h * N * 2 / R, L = M.cos(x), Z = M.sin, K = Z(x) / 4, O = 1 + K,
        X = -2 * L / O, Y = (1 - K) / O, P = (1 + h * L) / 2 / O, Q = -(h + L) / O,
        S = P, T = 0, U = 0, V = 0, W = 0;
    e = R * e + 9; m *= R; r *= R; t *= R; c *= R; y *= 500 * d / R ** 3;
    A *= d / R; v *= d / R; z *= R; l = R * l | 0; p *= zzfxV;
    for (h = e + m + r + t + c | 0; a < h; k[a++] = f * p)
      ++J % (100 * F | 0) || (
        f = q ? 1 < q ? 2 < q ? 3 < q ? 4 < q ?
              (g / d % 1 < D / 2) * 2 - 1 : Z(g ** 3) :
              M.max(M.min(M.tan(g), 1), -1) :
              1 - (2 * g / d % 2 + 2) % 2 :
              1 - 4 * M.abs(M.round(g / d) - g / d) : Z(g),
        f = (l ? 1 - B + B * Z(d * a / l) : 1) *
            (4 < q ? f : (f < 0 ? -1 : 1) * M.abs(f) ** D) *
            (a < e ? a / e : a < e + m ? 1 - (a - e) / m * (1 - w) :
             a < e + m + r ? w : a < h - c ? (h - a - c) / t * w : 0),
        f = c ? f / 2 + (c > a ? 0 : (a < h - c ? 1 : (h - a) / c) * k[a - c | 0] / 2 / p) : f,
        N ? f = W = S * T + Q * (T = U) + P * (U = f) - Y * V - X * (V = W) : 0),
      x = (b += u += y) * M.cos(A * H++), g += x + x * E * Z(a ** 5),
      n && ++n > z && (b += v, C += v, n = 0),
      !l || ++I % l || (b = C, u = G, n = n || 1);
    var buf = zzfxX.createBuffer(1, h, R);
    buf.getChannelData(0).set(k);
    var src = zzfxX.createBufferSource();
    src.buffer = buf;
    src.connect(zzfxX.destination);
    src.start();
  }

  /* --------------------------------------------------- the instrument */

  var MUTE_KEY = 'chargebarge_mute';
  var muted = false;
  try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) {}

  /* Named sounds, tuned to the iron-and-arc register: low thumps for
     powder, cold zaps for charge. Rate-limited combat sounds so a busy
     screen never becomes a saw. */
  var BANK = {
    /* console interactions */
    click:   [.55, , 224, .005, .01, .04, 4, 1.7, , , , , , , , , , .6, .01],
    /* the pivot gun speaks */
    shot:    [.6, .1, 291, .003, .02, .08, 4, 2.4, -4, , , , , .5, , .2, , .5, .02],
    /* broadside coil-guns — colder, smaller */
    coil:    [.35, .15, 620, .002, .01, .05, 1, 3.4, -14, , , , , , , , , .45, .01],
    /* a shell lands on timber */
    hit:     [.6, , 132, .008, .03, .13, 4, 2.2, , , , , , .9, , .3, , .46, .02],
    /* a foe goes under */
    wreck:   [.85, , 76, .02, .1, .38, 4, 1.6, -2, , , , , .7, , .5, , .44, .06],
    /* volts stripped from a wreck */
    salvage: [.5, , 587, .01, .05, .12, 1, 2.1, , , 156, .05, , , , , , .5, .03],
    /* the hull takes one */
    hurt:    [.8, , 94, .01, .05, .22, 3, 1.4, , , -20, , , .8, , .4, , .48, .03],
    /* SURGE spent — the arc-light miracle */
    surge:   [.9, , 980, .01, .12, .3, 1, 2.8, , , -180, .06, .08, , , .2, , .55, .07],
    /* RAMMING SPEED — the engine overcharges */
    ram:     [1, , 55, .03, .16, .44, 4, 2, 2, , , , .06, 1.2, , .4, , .46, .08],
    /* purchase — copper on copper */
    buy:     [.65, , 393, .02, .1, .22, 1, 1.6, , , 131, .06, .04, , , , , .55, .06],
    /* an ability or route unlocks — the gold leaf */
    unlock:  [.75, , 524, .02, .16, .34, 1, 1.9, , , 262, .07, .06, , , , , .55, .1],
    /* the cove bell */
    cove:    [.7, , 330, .04, .22, .42, 1, 1.2, , , 110, .09, .07, , , , , .5, .12],
    /* the sea takes the hull */
    sunk:    [.95, , 58, .06, .3, .8, 2, .7, , , , , , .3, , .5, , .4, .2],
    /* thunder, far off — leg start */
    thunder: [.6, .2, 41, .04, .2, .7, 4, .6, , , , , , 1.4, , .6, .1, .38, .15]
  };

  /* Combat sounds can fire many times a frame; keep a tiny per-name
     cooldown so density raises intensity, not clipping. */
  var last = {};
  var LIMIT = { coil: 55, hit: 45, shot: 60, salvage: 70, wreck: 90 };

  function play(name) {
    if (muted) return;
    var lim = LIMIT[name];
    if (lim) {
      var now = Date.now();
      if (last[name] && now - last[name] < lim) return;
      last[name] = now;
    }
    var s = BANK[name];
    if (!s) return;
    try { zzfx.apply(null, s); } catch (e) { /* audio is never fatal */ }
  }

  function toggleMute() {
    muted = !muted;
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (e) {}
    return muted;
  }

  root.Sfx = { play: play, toggleMute: toggleMute, isMuted: function () { return muted; } };

})(typeof window !== 'undefined' ? window : globalThis);
