/**
 * cg_platform.js - THEODOLITE on CrazyGames. This file exists only in the CrazyGames build; the itch build never
 * loads it. It boots the CrazyGames SDK v3 (docs.crazygames.com/sdk/intro, read 2026-11-13), then loads the game.
 *
 *   SAVES     CG.store is the game's storage. On CrazyGames it is the SDK's Data Module ("Yes, using the Data
 *             Module from the CrazyGames SDK" on the submission form); with the SDK absent (an ad blocker, or the
 *             file opened anywhere else) it is the browser's localStorage, so the game still saves.
 *             Like localStorage, a call THROWS when no store answers: the game already catches that and tells
 *             the player saves will not persist.
 *   EVENTS    gameplayStart when the survey is on screen and running; gameplayStop on every break (the title,
 *             the help sheet, the player's pause, the ending page, an ad). Focus loss is not reported: the docs
 *             say CrazyGames handles that itself.
 *   LOADING   loadingStart before the game's files load, loadingStop on the first drawn frame.
 *   MUTE      the platform's muteAudio setting silences the game (it outranks the game's own mute key) and the
 *             game is silenced while an ad plays.
 *   ADS       one midgame ad may be requested at the game's only level-end, the county's ending page (a break, never
 *             active play), never in the first three minutes and never within three minutes of the last ad's end.
 *             The game is paused and silent only once the ad actually starts; input is held from the request until
 *             the ad finishes or fails, and released anyway if no start comes in 10 s or no end in 120 s.
 *             No rewarded ads. With ads disabled or blocked nothing changes for the player.
 *   PROGRESS  reportGameCompletedPercentage = sheets at grade B or better out of eight (100 only when the county is
 *             done); happytime when the ending page opens.
 *   NEW PLAYER a player with no save lands straight in a new county with the help sheet open (one click to play).
 *
 * No hostname or user-agent test anywhere: the SDK's own `environment` decides ('crazygames' or 'local' = live,
 * 'disabled' or no SDK = offline).
 */
'use strict';

var CG = (function () {
  var SAVE_KEYS = ['theodolite.survey.v1', 'theodolite.survey.v1.unreadable', 'theodolite.muted'];
  var GAME_FILES = ['js/sim.js', 'js/audio.js', 'js/game.js'];
  var AD_GAP_MS = 180000;          // CrazyGames throttles midgame ads to about one per 3 minutes; we ask no more often
  var INIT_TIMEOUT_MS = 8000;      // a hung SDK must not hold the game: boot offline instead

  var SDK = null, env = 'none', live = false, dataOk = false, booted = false, settled = false;
  var inPlay = false, adPending = false, adPlaying = false, sdkMuted = false;
  var bootAt = 0, lastAdAt = 0, lastPct = -1;
  var log = [];                     // what this layer did, newest last (read by the test harness)
  function note(s) { log.push(s); if (log.length > 200) log.shift(); }

  /* ------------------------------------------------------------- storage */
  function local() { try { return window.localStorage || null; } catch (e) { return null; } }
  function backing() { return dataOk ? SDK.data : local(); }
  var store = {
    getItem: function (k) { var s = backing(); if (!s) throw new Error('no storage'); var v = s.getItem(k); return v === undefined ? null : v; },
    setItem: function (k, v) { var s = backing(); if (!s) throw new Error('no storage'); s.setItem(k, String(v)); },
    removeItem: function (k) { var s = backing(); if (!s) throw new Error('no storage'); s.removeItem(k); },
  };
  function backend() { return !booted ? 'booting' : dataOk ? 'crazygames-data-module' : local() ? 'localstorage' : 'none'; }

  /* a save written to localStorage on this origin before the Data Module took over is carried across once
   * (their data-module page: migrate existing local keys for returning players), never over a newer one */
  function migrate() {
    var ls = local(); if (!ls) return;
    for (var i = 0; i < SAVE_KEYS.length; i++) {
      var k = SAVE_KEYS[i];
      try {
        var have = SDK.data.getItem(k), old = ls.getItem(k);
        if ((have === null || have === undefined) && old !== null && old !== undefined) { SDK.data.setItem(k, old); note('migrated ' + k); }
      } catch (e) { /* leave it where it is */ }
    }
  }

  /* --------------------------------------------------------------- calls */
  function call(mod, fn, arg) {
    if (!live) return false;
    try { var m = SDK[mod]; if (!m || typeof m[fn] !== 'function') return false; if (arg === undefined) m[fn](); else m[fn](arg); note(mod + '.' + fn + (arg === undefined ? '' : '(' + arg + ')')); return true; }
    catch (e) { note(mod + '.' + fn + ' threw ' + (e && e.message)); return false; }
  }

  /* ---------------------------------------------------------------- sound */
  function applySound() { if (window.AUDIO && typeof AUDIO.setForced === 'function') AUDIO.setForced(sdkMuted || adPlaying); }
  /* the SDK calls this when the player changes the site's audio setting */
  function onSettings(s) { sdkMuted = !!(s && s.muteAudio); applySound(); note('muteAudio ' + sdkMuted); }

  /* ------------------------------------------------------------------ ads */
  function hold(ev) { if (adPending) { ev.stopImmediatePropagation(); if (ev.cancelable) ev.preventDefault(); } }
  ['pointerdown', 'pointerup', 'click', 'keydown', 'keyup', 'touchstart', 'wheel'].forEach(function (t) { window.addEventListener(t, hold, true); });
  function adDone(why) {
    if (!adPending) return;
    adPending = false; clearTimeout(adTimer);
    lastAdAt = Date.now();   /* the gap counts from the END of an ad (review_cg #2: a gap from the request can collide with the SDK's own cooldown) */
    if (adPlaying) { adPlaying = false; if (window.THEODOLITE) THEODOLITE.setPaused(false); }
    applySound(); note('ad ' + why);
  }
  /* review_cg #2: a request the SDK ignores, or an ad that never reports its end, must not hold input or sound for good */
  var adTimer = 0, AD_START_WAIT_MS = 10000, AD_MAX_MS = 120000;
  function requestMidgame() {
    if (!live || adPending || !SDK.ad || typeof SDK.ad.requestAd !== 'function') return false;
    var now = Date.now();
    if (now - bootAt < AD_GAP_MS || (lastAdAt && now - lastAdAt < AD_GAP_MS)) return false;
    lastAdAt = now; adPending = true; note('ad requested');
    adTimer = setTimeout(function () { adDone('no start in ' + AD_START_WAIT_MS / 1000 + ' s'); }, AD_START_WAIT_MS);
    try {
      SDK.ad.requestAd('midgame', {
        adStarted: function () {
          /* delta review #1: a start that arrives AFTER the 10 s release is still an ad on screen: hold, pause and
           * silence again rather than let it play over a live, audible game */
          if (adPlaying) return;
          if (!adPending) { adPending = true; note('ad started late'); }
          clearTimeout(adTimer); adTimer = setTimeout(function () { adDone('no end in ' + AD_MAX_MS / 1000 + ' s'); }, AD_MAX_MS);
          adPlaying = true; if (window.THEODOLITE) THEODOLITE.setPaused(true); applySound(); note('ad started');
          /* the break is reported the moment the ad starts, not on the next frame (test_cg caught a one-frame lag) */
          if (inPlay) { inPlay = false; call('game', 'gameplayStop'); }
        },
        adFinished: function () { adDone('finished'); },
        adError: function (err) { adDone('error ' + (err && (err.code || err.message) || '')); },
      });
    } catch (e) { adDone('threw ' + (e && e.message)); }
    return true;
  }

  /* --------------------------------------------------------------- watch */
  var wasEnding = false, firstFrame = true;
  function watch() {
    requestAnimationFrame(watch);
    var T = window.THEODOLITE; if (!T) return;
    /* their loadingStop: when loading is complete and the first frame is up (review_cg: it went out before the first draw) */
    if (firstFrame) { firstFrame = false; if (live) call('game', 'loadingStop'); }
    var st = T.state, a = st.county;
    var ending = st.screen === 'play' && !!a && !!a.won && !a.endingSeen;
    var playing = st.screen === 'play' && !!a && !st.help && !st.userPaused && !ending && !adPlaying;
    if (playing !== inPlay) { inPlay = playing; call('game', playing ? 'gameplayStart' : 'gameplayStop'); }
    /* THE ONE AD BREAK (review_cg #3: an ad after a published sheet fell in active play): the county's ending page,
     * the only level-end this game has; happytime goes out on the same transition, so a finished county that is
     * merely continued in a later session sends neither again */
    if (ending && !wasEnding) { call('game', 'happytime'); requestMidgame(); }
    wasEnding = ending;
    if (!a) return;
    /* completion counts sheets at grade B or better, the county's own win rule (review_cg: 8 published with a C read 100%) */
    var good = 0; for (var k = 0; k < a.sheets.length; k++) if (a.sheets[k].pub >= 2) good++;
    var pct = a.won ? 100 : Math.min(99, Math.floor(100 * good / a.sheets.length));
    if (pct !== lastPct) { lastPct = pct; call('game', 'reportGameCompletedPercentage', pct); }
  }

  /* ---------------------------------------------------------------- boot */
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = src;
      s.onload = function () { res(); }; s.onerror = function () { rej(new Error('could not load ' + src)); };
      document.body.appendChild(s);
    });
  }
  function initSdk() {
    var sdk = window.CrazyGames && window.CrazyGames.SDK;
    if (!sdk || typeof sdk.init !== 'function') { env = 'none'; return Promise.resolve(); }
    var timer;
    var init = Promise.resolve().then(function () { return sdk.init(); }).then(function () {
      if (settled) return; settled = true; SDK = sdk; env = String(sdk.environment || 'unknown');
    }, function (e) { if (settled) return; settled = true; env = 'init-failed'; note('init failed ' + (e && e.message)); });
    var timeout = new Promise(function (res) { timer = setTimeout(function () { if (!settled) { settled = true; env = 'init-timeout'; note('init timed out'); } res(); }, INIT_TIMEOUT_MS); });
    return Promise.race([init, timeout]).then(function () { clearTimeout(timer); });
  }
  function boot() {
    bootAt = Date.now();
    return initSdk().then(function () {
      live = !!SDK && (env === 'crazygames' || env === 'local');
      if (live) {
        try { if (SDK.data && typeof SDK.data.getItem === 'function') { SDK.data.getItem(SAVE_KEYS[0]); dataOk = true; } } catch (e) { dataOk = false; note('data module unavailable ' + (e && e.message)); }
        if (dataOk) migrate();
        try { sdkMuted = !!(SDK.game && SDK.game.settings && SDK.game.settings.muteAudio); } catch (e) { sdkMuted = false; }
        try { SDK.game.addSettingsChangeListener(onSettings); } catch (e) { /* older SDK */ }
        call('game', 'loadingStart');
      }
      booted = true; note('boot env=' + env + ' live=' + live + ' store=' + backend());
      return GAME_FILES.reduce(function (p, src) { return p.then(function () { return loadScript(src); }); }, Promise.resolve());
    }).then(function () {
      applySound();
      if (live && window.THEODOLITE && typeof THEODOLITE.cgBegin === 'function') THEODOLITE.cgBegin();
      requestAnimationFrame(watch);
    }).catch(function (e) { note('boot failed ' + (e && e.message)); });
  }

  var API = {
    store: store, backend: backend,
    env: function () { return env; }, live: function () { return live; },
    inPlay: function () { return inPlay; }, adPending: function () { return adPending; }, adPlaying: function () { return adPlaying; },
    sdkMuted: function () { return sdkMuted; }, log: function () { return log.slice(); },
    requestMidgame: requestMidgame,
    /* test seam: lets the harness move the ad clock instead of waiting three real minutes */
    _ageClock: function (ms) { bootAt -= ms; if (lastAdAt) lastAdAt -= ms; },
    /* test seam: the same function the SDK's settings listener calls */
    _settings: onSettings,
  };
  API.ready = boot();
  return API;
})();
