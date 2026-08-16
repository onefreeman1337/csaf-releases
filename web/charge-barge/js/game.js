/* =====================================================================
   game.js — CHARGE BARGE. The loop.

   Scenes: TITLE → RUN ⇄ COVE, RUN → SUNK → COVE. Save at every cove,
   every purchase, every unlock and every sinking — the operator's
   standing rule is save/resume, never a full restart, and the save
   writes are placed so a closed tab can never lose more than the
   current leg.

   World frame: y runs UP the coast. Screen mapping lives in Art.S.
   ===================================================================== */
'use strict';

(function (root) {

  var SAVE_KEY = 'chargebarge.save.v1';
  var W = Art.W, H = Art.H;

  /* ------------------------------------------------------------ state */

  var save = null;        /* persistent: volts, renown, upgrades, legReached… */
  var scene = 'title';
  var legData = null;
  var barge = null;
  var foes = [], shots = [], mortars = [], booms = [], motes = [], allies = [];
  var spawnAcc = 0;
  var elapsed = 0;        /* run-scene seconds, drives all animation */
  var cartT = 0;          /* cartouche fade clock */
  var shakeT = 0;
  var stats = null;       /* Upgrades.stats(save.upgrades) — rebuilt on buy */
  var chipEls = {};       /* active id → button element */
  var keys = {};
  var mouse = { x: W / 2, y: H / 2, down: false };
  var fireAcc = 0, coilAcc = 0, dynAcc = 0;
  var camY = 0;
  var shotsFired = 0;     /* monotonic — the input probe's observable */

  /* ------------------------------------------------------------- save */

  function freshSave() {
    return {
      v: 1,
      seed: (Math.random() * 1e9) | 0,
      volts: 0,
      renown: 0,
      legReached: 0,          /* highest leg index reached (cove count) */
      upgrades: {},           /* line id → tier */
      totals: { kills: 0, legs: 0, sinkings: 0, voltsEarned: 0 },
      run: null               /* { leg } while a run is live */
    };
  }

  function writeSave() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {}
  }

  function readSave() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || s.v !== 1) return null;
      return s;
    } catch (e) { return null; }
  }

  /* ------------------------------------------------------------ DOM */

  function el(id) { return document.getElementById(id); }
  var cv = el('sea'), ctx = cv.getContext('2d');

  function show(id) { el(id).hidden = false; }
  function hide(id) { el(id).hidden = true; }

  var toastTimer = null;
  function toast(name, what) {
    el('unlockName').textContent = name;
    el('unlockWhat').textContent = ' — ' + what;
    show('unlockToast');
    Sfx.play('unlock');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { hide('unlockToast'); }, 3200);
  }

  /* ------------------------------------------------------------ input */

  /* Listeners live on WINDOW, not document: real events bubble up to
     window, and the html5 gate's inputProbe dispatches AT window — a
     document listener would never see those (the propagation path of a
     dispatched event starts at its target). */
  window.addEventListener('keydown', function (e) {
    if (e.repeat) return;
    var k = e.key.toLowerCase();
    keys[k] = true;
    if (scene === 'run') {
      for (var i = 0; i < Actives.LIST.length; i++)
        if (Actives.LIST[i].key === k) { useActive(Actives.LIST[i].id); }
      if (k === 'm') Sfx.toggleMute();
    }
    if ((k === ' ' || k === 'enter')) {
      if (scene === 'title') { e.preventDefault(); startFromTitle(); }
      else if (scene === 'cove') { e.preventDefault(); sailOn(); }
      else if (scene === 'sunk') { e.preventDefault(); refloat(); }
    }
  });
  window.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; });

  cv.addEventListener('mousemove', function (e) {
    var r = cv.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) * (W / r.width);
    mouse.y = (e.clientY - r.top) * (H / r.height);
  });
  window.addEventListener('mousedown', function (e) {
    /* only arm the gun for presses on the sea itself — or for events
       dispatched straight at window (the gate's probe), which have no
       meaningful target element */
    if (e.target === cv || e.target === window || e.target === document.body || !e.target.closest) mouse.down = true;
  });
  window.addEventListener('mouseup', function () { mouse.down = false; });

  /* ------------------------------------------------------- scene: title */

  function boot() {
    save = readSave();
    if (save && (save.run || save.legReached > 0 || save.volts > 0)) {
      el('btnContinue').hidden = false;
      el('btnNew').textContent = 'START THE COAST OVER';
    }
    el('btnContinue').addEventListener('click', function () { Sfx.play('click'); startFromTitle(); });
    el('btnNew').addEventListener('click', function () {
      Sfx.play('click');
      save = freshSave();
      writeSave();
      startRun(0);
    });
    el('btnSail').addEventListener('click', function () { Sfx.play('click'); sailOn(); });
    el('btnRefloat').addEventListener('click', function () { Sfx.play('click'); refloat(); });
    requestAnimationFrame(frame);
  }

  function startFromTitle() {
    if (!save) { save = freshSave(); writeSave(); }
    var leg = save.run ? save.run.leg : Math.max(0, save.legReached);
    startRun(leg);
  }

  /* --------------------------------------------------------- scene: run */

  function startRun(leg) {
    hide('title'); hide('cove'); hide('sunk');
    legData = Chart.buildLeg(save.seed, leg);
    stats = Upgrades.stats(save.upgrades);
    save.run = { leg: leg };
    writeSave();

    barge = {
      x: W / 2, y: 140,
      vx: 0, vy: 0,
      hull: stats.hull.max,
      surge: 0,
      aim: -Math.PI / 2,
      ramT: 0, archT: 0, sloopT: 0, gunT: 0, patchT: 0,
      surgeFrac: 0,
      scrapeAcc: 0
    };
    foes = []; shots = []; mortars = []; booms = []; motes = []; allies = [];
    spawnAcc = 0; elapsed = 0; cartT = 3.6; fireAcc = 0; coilAcc = 0; dynAcc = 0;
    lastUnlockCount = Actives.unlockedAt(save.renown).length;
    scene = 'run';
    buildChips();
    Sfx.play('thunder');
  }

  function buildChips() {
    var box = el('chips');
    box.innerHTML = '';
    chipEls = {};
    var unlocked = Actives.unlockedAt(save.renown);
    for (var i = 0; i < Actives.LIST.length; i++) {
      (function (a) {
        var b = document.createElement('button');
        b.className = 'chip locked';
        b.innerHTML = '<span class="key">' + a.key + '</span>' +
          '<span>' + a.name + '</span>' +
          '<span class="cost">' + (unlocked.indexOf(a.id) >= 0 ? (a.cost + ' SURGE') : ('RENOWN ' + a.renown)) + '</span>' +
          '<span class="cfill"></span>';
        b.title = a.blurb;
        b.addEventListener('click', function () { useActive(a.id); });
        el('chips').appendChild(b);
        chipEls[a.id] = b;
      })(Actives.LIST[i]);
    }
  }

  function useActive(id) {
    if (scene !== 'run') return;
    var a = Actives.byId(id);
    if (!a) return;
    if (save.renown < a.renown) return;
    if (barge.surge < a.cost) return;
    /* refuse re-trigger while running (except tempest/patch stack rules) */
    if (id === 'ram' && barge.ramT > 0) return;
    if (id === 'archers' && barge.archT > 0) return;
    if (id === 'sloop' && barge.sloopT > 0) return;
    if (id === 'gunners' && barge.gunT > 0) return;
    if (id === 'patch' && barge.patchT > 0) return;

    barge.surge -= a.cost;
    Sfx.play(id === 'ram' ? 'ram' : 'surge');

    if (id === 'ram') barge.ramT = a.dur;
    else if (id === 'archers') barge.archT = a.dur;
    else if (id === 'sloop') { barge.sloopT = a.dur; allies.push({ x: barge.x - 60, y: barge.y - 20, reload: 0.4 }); }
    else if (id === 'gunners') barge.gunT = a.dur;
    else if (id === 'patch') barge.patchT = a.dur;
    else if (id === 'tempest') {
      booms.push({ x: barge.x, y: barge.y, r: 250, t: 0, T: 0.8, sparks: 0, seed: (Math.random() * 1e9) | 0, tempest: true });
      for (var i = 0; i < foes.length; i++) {
        var f = foes[i];
        if (Math.hypot(f.x - barge.x, f.y - barge.y) < 250) damageFoe(f, 60);
      }
      shakeT = 0.5;
    }
  }

  /* ------------------------------------------------------ combat helpers */

  function damageFoe(f, dmg) {
    if (f.dead) return;
    f.hp -= dmg;
    Sfx.play('hit');
    if (f.hp <= 0) {
      f.dead = true;
      var def = Foes.TYPES[f.type];
      Sfx.play('wreck');
      booms.push({ x: f.x, y: f.y, r: 34, t: 0, T: 0.5, sparks: 6, seed: (Math.random() * 1e9) | 0 });
      /* renown + surge + amber motes */
      save.renown++;
      save.totals.kills++;
      var tapMult = stats.tap.mult;
      barge.surge = Math.min(stats.banks.cap, barge.surge + def.surge * tapMult);
      var nMotes = 2 + (def.volts / 6 | 0);
      for (var i = 0; i < nMotes; i++) {
        motes.push({
          x: f.x + (Math.random() - 0.5) * 26,
          y: f.y + (Math.random() - 0.5) * 26,
          v: def.volts / nMotes,
          seed: (Math.random() * 1e9) | 0
        });
      }
      checkUnlocks();
    }
  }

  function damageBarge(dmg) {
    if (barge.ramT > 0) return;                 /* unhittable while ramming */
    barge.hull -= dmg * stats.hull.take;
    shakeT = Math.min(0.4, shakeT + 0.15);
    Sfx.play('hurt');
    if (barge.hull <= 0) sink();
  }

  var lastUnlockCount = 0;   /* re-based in startRun from saved renown */
  function checkUnlocks() {
    var n = Actives.unlockedAt(save.renown).length;
    if (n > lastUnlockCount) {
      var justOpened = Actives.LIST[n - 1];
      toast(justOpened.name, 'new ability — key ' + justOpened.key);
      lastUnlockCount = n;
      buildChips();
      writeSave();
    }
  }

  /* -------------------------------------------------------- scene: cove */

  function enterCove() {
    scene = 'cove';
    Sfx.play('cove');
    save.totals.legs++;
    save.legReached = Math.max(save.legReached, legData.leg + 1);
    save.run = { leg: legData.leg + 1 };
    writeSave();
    el('coveKicker').textContent = 'LEG ' + (legData.leg + 1) + ' CHARTED — SAFE WATER';
    el('coveName').textContent = legData.coveName;
    el('coveLine').textContent = legData.coveLine;
    buildShop();
    show('cove');
  }

  function buildShop() {
    var shop = el('shop');
    shop.innerHTML = '';
    var cap = Upgrades.tierCap(save.legReached);
    for (var i = 0; i < Upgrades.LINES.length; i++) {
      (function (l) {
        var tier = save.upgrades[l.id] || 0;
        var row = document.createElement('div');
        row.className = 'srow';
        var gated = save.legReached < l.minLeg;
        var atCap = !gated && tier >= Math.min(l.max, cap);
        var maxed = tier >= l.max;
        if (gated) row.className += ' gated';
        if (maxed) row.className += ' maxed';

        var pips = '';
        for (var p = 0; p < l.max; p++) pips += '<span class="pip' + (p < tier ? ' lit' : '') + '"></span>';

        var btnLabel;
        if (gated) btnLabel = 'LEG ' + (l.minLeg + 1);
        else if (maxed) btnLabel = 'MAXED';
        else if (atCap) btnLabel = 'CAP ' + cap;
        else btnLabel = '&#x26A1;' + Upgrades.cost(l, tier + 1);

        row.innerHTML =
          '<span class="sname">' + l.name + '</span>' +
          '<span class="sdesc">' + l.desc + '</span>' +
          '<span class="spips">' + pips + '</span>';
        var btn = document.createElement('button');
        btn.className = 'sbuy';
        btn.innerHTML = btnLabel;
        btn.disabled = gated || maxed || atCap || save.volts < Upgrades.cost(l, tier + 1);
        btn.addEventListener('click', function () {
          var c = Upgrades.cost(l, tier + 1);
          if (save.volts < c) return;
          save.volts -= c;
          save.upgrades[l.id] = tier + 1;
          stats = Upgrades.stats(save.upgrades);
          Sfx.play('buy');
          writeSave();
          buildShop();
          updateHud();
        });
        row.appendChild(btn);
        shop.appendChild(row);
      })(Upgrades.LINES[i]);
    }
  }

  function sailOn() {
    if (scene !== 'cove') return;
    hide('cove');
    startRun(save.run.leg);
  }

  /* -------------------------------------------------------- scene: sunk */

  function sink() {
    scene = 'sunk';
    Sfx.play('sunk');
    save.totals.sinkings++;
    /* the standing rule: volts, upgrades, renown all kept; the leg
       restarts from its cove. save.run.leg already equals this leg. */
    writeSave();
    el('sunkLine').textContent =
      legData.name + ' takes the barge at leg ' + (legData.leg + 1) +
      '. The charge survives: ' + save.volts + ' volts, ' + save.renown + ' renown, every upgrade banked.';
    show('sunk');
  }

  function refloat() {
    if (scene !== 'sunk') return;
    hide('sunk');
    /* reopen the cove — a sinking earns a shop visit, not a menu */
    scene = 'cove';
    el('coveKicker').textContent = 'REFLOATED — SAFE WATER';
    el('coveName').textContent = legData.coveName;
    el('coveLine').textContent = 'The wreckers tow you in. They keep the story; you keep the charge.';
    buildShop();
    show('cove');
  }

  /* ------------------------------------------------------------- tick */

  function tick(dt) {
    elapsed += dt;
    if (cartT > 0) cartT -= dt;
    if (shakeT > 0) shakeT -= dt;

    var s = stats;

    /* ---- steering ---- */
    var steer = 0, throttle = 1;
    if (keys['a'] || keys['arrowleft']) steer -= 1;
    if (keys['d'] || keys['arrowright']) steer += 1;
    if (keys['w'] || keys['arrowup']) throttle = 1.45;
    if (keys['s'] || keys['arrowdown']) throttle = 0.55;

    var cruise = s.engine.cruise * (barge.ramT > 0 ? 1.9 : 1);
    barge.vy = cruise * throttle;
    barge.vx += steer * s.engine.steer * dt * 3.2;
    barge.vx *= Math.pow(0.0018, dt);           /* water drag on lateral */
    barge.x += barge.vx * dt;
    barge.y += barge.vy * dt;

    /* ---- channel constraint: shore scrape ---- */
    var ci = Chart.channelAt(legData, barge.y);
    var margin = 22;
    var lo = ci.c - ci.w / 2 + margin, hi = ci.c + ci.w / 2 - margin;
    if (barge.x < lo) {
      barge.x = lo; barge.vx = Math.abs(barge.vx) * 0.4;
      barge.scrapeAcc += dt;
    } else if (barge.x > hi) {
      barge.x = hi; barge.vx = -Math.abs(barge.vx) * 0.4;
      barge.scrapeAcc += dt;
    } else {
      barge.scrapeAcc = 0;
    }
    if (barge.scrapeAcc > 0.12) {               /* grinding, not touching */
      barge.scrapeAcc = 0;
      damageBarge(4);
    }

    /* ---- rocks & reefs ---- */
    for (var i = 0; i < legData.rocks.length; i++) {
      var rk = legData.rocks[i];
      var d = Math.hypot(barge.x - rk.x, barge.y - rk.y);
      if (d < rk.r + 14) {
        /* push out + damage */
        var px = (barge.x - rk.x) / (d || 1), py = (barge.y - rk.y) / (d || 1);
        barge.x = rk.x + px * (rk.r + 14);
        barge.y = rk.y + py * (rk.r + 14);
        barge.vx = px * 120;
        damageBarge(10);
        booms.push({ x: barge.x, y: barge.y, r: 20, t: 0, T: 0.35, sparks: 4, seed: (Math.random() * 1e9) | 0 });
      }
    }
    var inReef = false;
    for (i = 0; i < legData.reefs.length; i++) {
      var rf = legData.reefs[i];
      if (Math.hypot(barge.x - rf.x, barge.y - rf.y) < rf.r) { inReef = true; break; }
    }
    if (inReef) {
      barge.y -= barge.vy * dt * 0.42;          /* reef drags the keel */
      if (Math.random() < dt * 1.6) damageBarge(2);
    }

    /* ---- derelict wrecks: salvage ---- */
    for (i = 0; i < legData.wrecks.length; i++) {
      var wk = legData.wrecks[i];
      if (!wk.taken && Math.hypot(barge.x - wk.x, barge.y - wk.y) < 44) {
        wk.taken = true;
        Sfx.play('salvage');
        for (var m = 0; m < 6; m++) {
          motes.push({
            x: wk.x + (Math.random() - 0.5) * 30,
            y: wk.y + (Math.random() - 0.5) * 30,
            v: 3,
            seed: (Math.random() * 1e9) | 0
          });
        }
      }
    }

    /* ---- dynamo income (income-over-time) ---- */
    dynAcc += s.dynamo.perSec * dt;
    if (dynAcc >= 1) {
      var whole = Math.floor(dynAcc);
      dynAcc -= whole;
      save.volts += whole;
      save.totals.voltsEarned += whole;
    }

    /* ---- aim + pivot gun ---- */
    var wmx = mouse.x;
    var wmy = camY + (H - mouse.y);            /* mouse in world frame */
    var dxw = wmx - barge.x, dyw = wmy - barge.y;
    barge.aim = Math.atan2(-dyw, dxw);         /* screen-frame for drawing */

    var rate = s.pivot.rate * (barge.gunT > 0 ? 1.8 : 1);
    fireAcc -= dt;
    if (mouse.down && fireAcc <= 0) {
      fireAcc = 1 / rate;
      var dw = Math.hypot(dxw, dyw) || 1;
      var spd = 520;
      var offsets = barge.gunT > 0 ? [-6, 6] : [0];
      for (i = 0; i < offsets.length; i++) {
        var ox = -dyw / dw * offsets[i], oy = dxw / dw * offsets[i];
        shots.push({
          kind: 'shell',
          x: barge.x + ox, y: barge.y + oy,
          vx: dxw / dw * spd, vy: dyw / dw * spd,
          dmg: s.pivot.dmg, from: 'player', life: 1.4
        });
      }
      shotsFired++;
      Sfx.play('shot');
    }

    /* ---- coil broadside (auto-attack) ---- */
    coilAcc -= dt;
    if (coilAcc <= 0) {
      coilAcc = s.coil.every;
      var best = null, bd = s.coil.range;
      for (i = 0; i < foes.length; i++) {
        var f0 = foes[i];
        if (f0.dead) continue;
        var dd = Math.hypot(f0.x - barge.x, f0.y - barge.y);
        if (dd < bd) { bd = dd; best = f0; }
      }
      if (best) {
        var dx2 = best.x - barge.x, dy2 = best.y - barge.y;
        var dn = Math.hypot(dx2, dy2) || 1;
        shots.push({
          kind: 'coil',
          x: barge.x, y: barge.y,
          vx: dx2 / dn * 430, vy: dy2 / dn * 430,
          dmg: s.coil.dmg, from: 'player', life: 1.1
        });
        Sfx.play('coil');
      }
    }

    /* ---- boarding archers ---- */
    if (barge.archT > 0) {
      barge.archT -= dt;
      barge.archAcc = (barge.archAcc || 0) - dt;
      if (barge.archAcc <= 0) {
        barge.archAcc = 0.32;
        var tgt = null, td = 330;
        for (i = 0; i < foes.length; i++) {
          if (foes[i].dead) continue;
          var d3 = Math.hypot(foes[i].x - barge.x, foes[i].y - barge.y);
          if (d3 < td) { td = d3; tgt = foes[i]; }
        }
        if (tgt) {
          var dx3 = tgt.x - barge.x, dy3 = tgt.y - barge.y;
          var dn3 = Math.hypot(dx3, dy3) || 1;
          shots.push({
            kind: 'arrow',
            x: barge.x, y: barge.y,
            vx: dx3 / dn3 * 390 + (Math.random() - 0.5) * 40,
            vy: dy3 / dn3 * 390 + (Math.random() - 0.5) * 40,
            dmg: 6, from: 'player', life: 1
          });
        }
      }
    }

    /* ---- gunners / patch / ram timers ---- */
    if (barge.gunT > 0) barge.gunT -= dt;
    if (barge.ramT > 0) barge.ramT -= dt;
    if (barge.patchT > 0) {
      barge.patchT -= dt;
      barge.hull = Math.min(stats.hull.max, barge.hull + stats.hull.max * 0.35 / 6 * dt);
    }

    /* ---- mercenary sloop ---- */
    if (barge.sloopT > 0) {
      barge.sloopT -= dt;
      if (barge.sloopT <= 0) allies = [];
    }
    for (i = 0; i < allies.length; i++) {
      var al = allies[i];
      al.x += ((barge.x - 64) - al.x) * dt * 2.4;
      al.y += ((barge.y - 26) - al.y) * dt * 2.4;
      al.reload -= dt;
      if (al.reload <= 0) {
        var t2 = null, td2 = 320;
        for (var j = 0; j < foes.length; j++) {
          if (foes[j].dead) continue;
          var d4 = Math.hypot(foes[j].x - al.x, foes[j].y - al.y);
          if (d4 < td2) { td2 = d4; t2 = foes[j]; }
        }
        if (t2) {
          al.reload = 0.6;
          var dx4 = t2.x - al.x, dy4 = t2.y - al.y;
          var dn4 = Math.hypot(dx4, dy4) || 1;
          shots.push({
            kind: 'coil', x: al.x, y: al.y,
            vx: dx4 / dn4 * 430, vy: dy4 / dn4 * 430,
            dmg: 7, from: 'player', life: 1
          });
          Sfx.play('coil');
        } else al.reload = 0.25;
      }
    }

    /* ---- spawning ---- */
    var table = Foes.tableFor(legData.leg);
    var nearEnd = barge.y > legData.length - 900;   /* cove approach is safe */
    if (!nearEnd) {
      spawnAcc += dt * table.rate * (1 + legData.hostility * 0.5);
      while (spawnAcc >= 1) {
        spawnAcc -= 1;
        var type = Foes.pick(table.mix, Math.random);
        foes.push(Foes.spawn(type, legData, camY + H + 120, Math.random));
      }
    }
    /* towers arm as fixed emplacements when in view */
    if (Foes.towersArmed(legData.leg)) {
      for (i = 0; i < legData.towers.length; i++) {
        var tw = legData.towers[i];
        if (!tw.armed && tw.y > camY - 40 && tw.y < camY + H + 160) {
          tw.armed = true;
          foes.push({
            type: 'tower', x: tw.x, y: tw.y, vx: 0, vy: 0,
            hp: Foes.TYPES.tower.hp, radius: Foes.TYPES.tower.radius,
            reload: 1.2 + Math.random(), wob: Math.random() * 7, dead: false
          });
        }
      }
    }

    /* ---- foe ticks ---- */
    for (i = 0; i < foes.length; i++) {
      var f = foes[i];
      if (f.dead) continue;
      var intent = Foes.tick(f, dt, barge, legData, elapsed);
      if (intent) {
        if (intent.fire === 'ball') {
          var dx5 = intent.tx - f.x, dy5 = intent.ty - f.y;
          var dn5 = Math.hypot(dx5, dy5) || 1;
          shots.push({
            kind: 'ball', x: f.x, y: f.y,
            vx: dx5 / dn5 * intent.speed, vy: dy5 / dn5 * intent.speed,
            dmg: intent.dmg, from: 'foe', life: 2.2
          });
        } else if (intent.fire === 'mortar') {
          mortars.push({
            x: f.x, y: f.y, tx: intent.tx, ty: intent.ty,
            t: 0, T: 1.5, dmg: intent.dmg, blast: intent.blast
          });
        }
      }
      /* contact with the barge */
      var db = Math.hypot(f.x - barge.x, f.y - barge.y);
      if (db < f.radius + 16) {
        var def = Foes.TYPES[f.type];
        if (barge.ramT > 0) {
          damageFoe(f, 999);                   /* the ram wrecks what it touches */
        } else if (f.type === 'brander') {
          f.dead = true;
          booms.push({ x: f.x, y: f.y, r: def.blast, t: 0, T: 0.6, sparks: 9, seed: (Math.random() * 1e9) | 0 });
          damageBarge(def.dmg);
          Sfx.play('wreck');
        } else if (f.type === 'skiff') {
          damageFoe(f, 999);                   /* it dies ramming you */
          damageBarge(def.dmg);
        } else {
          damageBarge(def.dmg * dt * 2);       /* grinding contact */
        }
      }
      /* cull far behind */
      if (f.y < camY - 200) f.dead = true;
    }
    foes = foes.filter(function (f) { return !f.dead; });

    /* ---- projectiles ---- */
    for (i = 0; i < shots.length; i++) {
      var p = shots[i];
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.life -= dt;
      if (p.from === 'player') {
        for (j = 0; j < foes.length; j++) {
          var f2 = foes[j];
          if (f2.dead) continue;
          if (Math.hypot(f2.x - p.x, f2.y - p.y) < f2.radius + 4) {
            damageFoe(f2, p.dmg);
            p.life = 0;
            break;
          }
        }
        /* shells bite rocks too */
        if (p.life > 0 && p.kind === 'shell') {
          for (j = 0; j < legData.rocks.length; j++) {
            var rk2 = legData.rocks[j];
            if (Math.hypot(rk2.x - p.x, rk2.y - p.y) < rk2.r) { p.life = 0; break; }
          }
        }
      } else {
        if (Math.hypot(barge.x - p.x, barge.y - p.y) < 18) {
          damageBarge(p.dmg);
          p.life = 0;
        }
      }
    }
    shots = shots.filter(function (p) { return p.life > 0; });

    /* ---- mortar bombs ---- */
    for (i = 0; i < mortars.length; i++) {
      var mb = mortars[i];
      mb.t += dt;
      if (mb.t >= mb.T) {
        booms.push({ x: mb.tx, y: mb.ty, r: mb.blast, t: 0, T: 0.55, sparks: 8, seed: (Math.random() * 1e9) | 0 });
        if (Math.hypot(barge.x - mb.tx, barge.y - mb.ty) < mb.blast) damageBarge(mb.dmg);
        Sfx.play('hit');
      }
    }
    mortars = mortars.filter(function (m) { return m.t < m.T; });

    /* ---- booms ---- */
    for (i = 0; i < booms.length; i++) booms[i].t += dt;
    booms = booms.filter(function (b) { return b.t < b.T; });

    /* ---- amber motes ---- */
    var magR = s.magnet.radius;
    for (i = 0; i < motes.length; i++) {
      var mo = motes[i];
      var dxm = barge.x - mo.x, dym = barge.y - mo.y;
      var dm = Math.hypot(dxm, dym) || 1;
      if (dm < magR) {
        var pull = (1 - dm / magR) * 420 + 60;
        mo.x += dxm / dm * pull * dt;
        mo.y += dym / dm * pull * dt;
      }
      if (dm < 24) {
        mo.dead = true;
        var gain = Math.max(1, Math.round(mo.v * s.rig.mult));
        save.volts += gain;
        save.totals.voltsEarned += gain;
        barge.surge = Math.min(s.banks.cap, barge.surge + 1 * s.tap.mult);
        Sfx.play('salvage');
      }
    }
    motes = motes.filter(function (m) { return !m.dead; });

    /* ---- camera ---- */
    camY = barge.y - H * 0.32;
    if (camY < 0) camY = 0;

    /* ---- leg end → cove ---- */
    if (barge.y >= legData.length - 200) enterCove();

    barge.surgeFrac = barge.surge / s.banks.cap;
    updateHud();
  }

  /* ------------------------------------------------------------- HUD */

  function updateHud() {
    var s = stats;
    el('hullFill').style.width = Math.max(0, barge ? (barge.hull / s.hull.max * 100) : 0) + '%';
    el('hullVal').textContent = barge ? Math.max(0, Math.ceil(barge.hull)) : '—';
    el('surgeFill').style.width = (barge ? (barge.surge / s.banks.cap * 100) : 0) + '%';
    el('surgeVal').textContent = barge ? Math.floor(barge.surge) : '—';
    el('voltVal').textContent = save ? save.volts : 0;
    if (legData) {
      el('legName').textContent = legData.name;
      el('legFill').style.width = (barge ? Math.min(100, barge.y / legData.length * 100) : 0) + '%';
    }
    /* chips */
    var unlocked = Actives.unlockedAt(save.renown);
    for (var i = 0; i < Actives.LIST.length; i++) {
      var a = Actives.LIST[i];
      var b = chipEls[a.id];
      if (!b) continue;
      var open = unlocked.indexOf(a.id) >= 0;
      var ready = open && barge && barge.surge >= a.cost;
      b.className = 'chip' + (ready ? ' ready' : (open ? '' : ' locked'));
      var fill = b.querySelector('.cfill');
      if (fill) fill.style.width = open && barge ? Math.min(100, barge.surge / a.cost * 100) + '%' : '0%';
    }
  }

  /* ------------------------------------------------------------ frame */

  var lastT = 0;
  function frame(ts) {
    requestAnimationFrame(frame);
    var dt = Math.min(0.05, (ts - lastT) / 1000 || 0.016);
    lastT = ts;

    if (scene === 'run') tick(dt);

    /* ---- draw ---- */
    ctx.save();
    if (shakeT > 0) {
      ctx.translate((Math.random() - 0.5) * shakeT * 14, (Math.random() - 0.5) * shakeT * 14);
    }

    var t = elapsed;
    var host = legData ? legData.hostility : 0;
    Art.sea(ctx, camY, t, host);
    if (legData) {
      Art.shore(ctx, legData, camY, t);
      for (var i = 0; i < legData.reefs.length; i++) Art.reef(ctx, legData.reefs[i], camY, t);
      for (i = 0; i < legData.rocks.length; i++) Art.rock(ctx, legData.rocks[i], camY, t);
      for (i = 0; i < legData.wrecks.length; i++) Art.derelict(ctx, legData.wrecks[i], camY, t);
    }
    for (i = 0; i < motes.length; i++) Art.mote(ctx, motes[i], camY, t);
    for (i = 0; i < foes.length; i++) Art.foe(ctx, foes[i], camY, t);
    for (i = 0; i < allies.length; i++) Art.sloop(ctx, allies[i], camY, t);
    if (barge && scene === 'run') Art.barge(ctx, barge, camY, t);
    for (i = 0; i < shots.length; i++) Art.shot(ctx, shots[i], camY);
    for (i = 0; i < mortars.length; i++) Art.mortarShot(ctx, mortars[i], camY);
    for (i = 0; i < booms.length; i++) {
      if (booms[i].tempest) Art.tempest(ctx, booms[i], camY);
      else Art.boom(ctx, booms[i], camY);
    }
    Art.weather(ctx, host, t);
    Art.compass(ctx, t);
    if (legData && cartT > 0 && scene === 'run') {
      var alpha = cartT > 3 ? (3.6 - cartT) / 0.6 : Math.min(1, cartT / 0.8);
      Art.cartouche(ctx, legData.name, 'LEG ' + (legData.leg + 1) + ' — CHARGE ON', alpha);
    }
    ctx.restore();
  }

  /* -------------------------------------------------------------- go */

  document.addEventListener('DOMContentLoaded', boot);

  /* ---------------------------------------------------------- test surface
     Consumed by Kernel/engines/html5_gate.js (contract in its header).
     begin() starts (or resumes) a run. The inputProbe is the game's real
     primary input — mousedown fires the pivot gun — and what it reads is
     the monotonic shell counter, so what gets proved is the window-level
     event wiring, the part that actually breaks inside a store iframe.
     settleMs is generous because the gun fires from the rAF tick, not
     from the event itself. */
  root.__game = {
    get elapsed() { return elapsed; },
    get shots() { return shotsFired; },
    get scene() { return scene; },
    begin: function () { startFromTitle(); },
    inputProbe: {
      events: [{ type: 'mousedown', init: { bubbles: true } }],
      read: function () { return shotsFired; },
      settleMs: 700
    },
    /* harness only — staging hooks for capture; every stager uses the
       game's own calls so every staged screen is a reachable state */
    _h: {
      state: function () { return { scene: scene, volts: save && save.volts, renown: save && save.renown, foes: foes.length, barge: barge && { x: barge.x, y: barge.y, hull: barge.hull, surge: barge.surge } }; },
      grant: function (volts, renown) { save.volts += volts | 0; save.renown += renown | 0; buildChips(); updateHud(); },
      surge: function (n) { if (barge) barge.surge = Math.min(stats.banks.cap, n | 0); updateHud(); },
      warp: function (y) { if (barge) barge.y = Math.max(barge.y, y | 0); },
      heal: function () { if (barge) barge.hull = stats.hull.max; updateHud(); },
      sink: function () { if (scene === 'run') sink(); },
      use: useActive
    }
  };

})(typeof window !== 'undefined' ? window : globalThis);
