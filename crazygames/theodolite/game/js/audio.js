/**
 * audio.js - THEODOLITE's sound: effects synthesised live with WebAudio, plus one composed music loop
 * (audio/theodolite_theme.ogg). Effects: a soft tick for a tab, a wooden knock when a station is raised, a small
 * bell when a sight is read, two rising tones when a station is fixed, a quill's scratch as the ground is inked,
 * a clank for a tower or a new party, coins for an instrument, a chime for a sheet ready or something granted, a
 * rubber stamp and a coin for a published sheet, a low hollow swell when the fog comes in, two tones for a season
 * and a rising cadence when the county is done. Muting is remembered, and PAUSES the music (iPhone Safari ignores
 * a media element's volume).
 */
'use strict';

var AUDIO = (function () {
  var ctx = null, master = null, muted = false, noiseBuf = null, BUS = 1.0;
  var forced = false;   // CrazyGames build: the platform's mute or an ad playing; never saved
  try { muted = CG.store.getItem('theodolite.muted') === '1'; } catch (e) { /* storage blocked */ }

  var music = null;
  function playMusic() {
    if (!music || muted || forced || document.hidden || !music.paused) return;
    var pr = music.play(); if (pr && pr.catch) pr.catch(function () { /* autoplay refused: the next tap retries */ });
  }
  function startMusic() {
    if (music) { playMusic(); return; }
    try { music = new Audio('audio/theodolite_theme.ogg'); music.loop = true; music.volume = 0.3; playMusic(); } catch (e) { music = null; }
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (music) music.pause(); if (ctx && ctx.state === 'running') ctx.suspend(); }
    else { playMusic(); if (ctx && ctx.state === 'suspended') ctx.resume(); }
  });
  function unlock() {
    startMusic();
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = (muted || forced) ? 0 : BUS; master.connect(ctx.destination);
      /* one second of fixed noise for the quill, the stamp, the clank and the fog (fixed, so each cue sounds the same) */
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      var d = noiseBuf.getChannelData(0), s = 24680;
      for (var i = 0; i < d.length; i++) { s = (s * 1103515245 + 12345) & 0x7fffffff; d[i] = (s / 0x7fffffff) * 2 - 1; }
    } catch (e) { ctx = null; }
  }
  function tone(freq, dur, type, vol, slide, delay) {
    if (!ctx || muted || forced) return;
    var t = ctx.currentTime + (delay || 0);
    var o = ctx.createOscillator(), gn = ctx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
    gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.01); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(gn); gn.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, freq, q, vol, sweep, delay, type) {
    if (!ctx || muted || forced || !noiseBuf) return;
    var t = ctx.currentTime + (delay || 0);
    var src = ctx.createBufferSource(); src.buffer = noiseBuf;
    var f = ctx.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.setValueAtTime(freq, t); f.Q.value = q || 1;
    if (sweep) f.frequency.exponentialRampToValueAtTime(freq * sweep, t + dur);
    var gn = ctx.createGain(); gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.02); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(gn); gn.connect(master); src.start(t); src.stop(t + dur + 0.05);
  }

  /* the whole API is the list of cues; SFX_CUES is read by the offline measurer so it cannot miss a new one */
  var API = {
    tick: function () { tone(880, 0.05, 'triangle', 0.06); },
    raise: function () { tone(190, 0.12, 'triangle', 0.16, 0.7); noise(0.06, 900, 2, 0.18); tone(150, 0.14, 'triangle', 0.12, 0.7, 0.11); noise(0.05, 800, 2, 0.14, 1, 0.11); },
    sight: function () { tone(1568, 0.5, 'sine', 0.06); tone(2349, 0.35, 'sine', 0.03, 1, 0.02); },
    fixed: function () { tone(659, 0.22, 'sine', 0.11); tone(988, 0.4, 'sine', 0.1, 1, 0.12); tone(1319, 0.3, 'sine', 0.05, 1, 0.24); },
    /* a quill across paper: two short bright scratches */
    quill: function () { noise(0.07, 5200, 3, 0.16, 1.4); noise(0.06, 4400, 3, 0.12, 1.3, 0.09); },
    clank: function () { tone(160, 0.3, 'square', 0.07, 0.7); noise(0.08, 3000, 4, 0.14); tone(520, 0.45, 'triangle', 0.05, 0.98, 0.02); },
    coin: function () { tone(1320, 0.09, 'square', 0.05); tone(1760, 0.18, 'square', 0.045, 1, 0.07); },
    chime: function () { tone(784, 0.35, 'sine', 0.12); tone(1175, 0.45, 'sine', 0.09, 1, 0.09); },
    stamp: function () { noise(0.12, 300, 0.8, 0.45, 0.5, 0, 'lowpass'); tone(90, 0.16, 'sine', 0.2, 0.6); tone(1320, 0.1, 'square', 0.04, 1, 0.18); tone(1760, 0.2, 'square', 0.04, 1, 0.25); },
    fog: function () { noise(1.6, 400, 0.5, 0.18, 0.6, 0, 'lowpass'); tone(110, 1.6, 'sine', 0.07, 0.94); tone(147, 1.4, 'sine', 0.05, 0.95, 0.2); },
    season: function () { tone(440, 0.3, 'sine', 0.07); tone(587, 0.4, 'sine', 0.06, 1, 0.14); },
    fanfare: function () { var n = [392, 523, 659, 784, 1047]; for (var i = 0; i < n.length; i++) tone(n[i], 0.6, 'triangle', 0.1, 1, i * 0.17); },
  };
  var SFX_CUES = Object.keys(API);
  API.unlock = unlock;
  API.SFX_CUES = SFX_CUES;
  API.toggleMute = function () {
    muted = !muted;
    try { CG.store.setItem('theodolite.muted', muted ? '1' : '0'); } catch (e) { /* storage blocked */ }
    if (master) master.gain.value = (muted || forced) ? 0 : BUS;
    if (music) { if (muted || forced) music.pause(); else playMusic(); }
    return muted;
  };
  API.muted = function () { return muted; };
  API.setForced = function (f) {
    forced = !!f;
    if (master) master.gain.value = (muted || forced) ? 0 : BUS;
    if (music) { if (muted || forced) music.pause(); else playMusic(); }
    return forced;
  };
  API.forced = function () { return forced; };
  API.musicPlaying = function () { return !!music && !music.paused; };
  return API;
})();
