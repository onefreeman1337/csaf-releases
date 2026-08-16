/* =====================================================================
   art.js — CHARGE BARGE. Every pixel drawn.

   No image files ship with this game. The look is an engraver's chart
   come alive: dark water in ruled strokes, hatched cliff mass with a
   copper rim, an ironclad with a visible amber heart. Gate 1 lives
   here — if a frame of this could be mistaken for a default canvas
   demo, this file has failed.

   Conventions: world y runs UP the coast; screen y runs down. All
   world→screen mapping goes through S() so the flip lives in exactly
   one place. `t` is elapsed seconds for animation.
   ===================================================================== */
'use strict';

(function (root) {

  var W = 1000, H = 560;

  /* deterministic hash → 0..1, for stable per-item detail */
  function h1(n) {
    n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3) | 0;
    n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15);
    return (n >>> 0) / 4294967296;
  }

  /* world → screen (camY = world y at screen bottom) */
  function S(wy, camY) { return H - (wy - camY); }

  /* ============================================================ SEA */

  function sea(ctx, camY, t, hostility) {
    /* depth gradient: darker out at the edges of the channel's world */
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0d141d');
    g.addColorStop(0.5, '#101823');
    g.addColorStop(1, '#0d141c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* engraved wave strokes: rows of short dashes, each row with its
       own phase, drifting slowly downweather. Rows are locked to WORLD
       space so the water scrolls with the camera. */
    ctx.strokeStyle = 'rgba(124,139,150,0.24)';
    ctx.lineWidth = 1;
    var rowStep = 26;
    var firstRow = Math.floor(camY / rowStep) * rowStep;
    ctx.beginPath();
    for (var wy = firstRow; wy < camY + H + rowStep; wy += rowStep) {
      var sy = S(wy, camY);
      var ph = h1(wy | 0) * 97;
      var drift = t * (6 + h1(wy | 0) * 8);
      for (var x = -40; x < W + 40; x += 46) {
        var xx = x + ((ph + drift) % 46);
        var bow = Math.sin((xx * 0.05) + wy * 0.01 + t * 0.7) * 2;
        ctx.moveTo(xx, sy + bow);
        ctx.quadraticCurveTo(xx + 9, sy + bow - 2.5, xx + 18, sy + bow);
      }
    }
    ctx.stroke();

    /* sparse whitecaps — always some life; more as the coast worsens */
    if (true) {
      ctx.strokeStyle = 'rgba(223,230,234,' + (0.09 + hostility * 0.08) + ')';
      ctx.beginPath();
      for (wy = firstRow; wy < camY + H; wy += rowStep * 3) {
        if (h1((wy | 0) * 7) > 0.6) continue;
        var cy = S(wy, camY);
        var cx = h1((wy | 0) * 13) * W;
        var wob = Math.sin(t * 2.2 + wy) * 3;
        ctx.moveTo(cx + wob, cy);
        ctx.quadraticCurveTo(cx + 7 + wob, cy - 3, cx + 15 + wob, cy);
      }
      ctx.stroke();
    }

    /* faint rhumb lines — the chart under the water */
    ctx.strokeStyle = 'rgba(179,101,31,0.05)';
    ctx.beginPath();
    for (var i = 0; i < 4; i++) {
      var ry = ((i * 173 - camY * 0.15) % (H + 200) + (H + 200)) % (H + 200) - 100;
      ctx.moveTo(0, ry); ctx.lineTo(W, ry + 60);
    }
    ctx.stroke();
  }

  /* =========================================================== SHORE */

  /**
   * Draw both shore walls for the visible span. The wall is a filled
   * mass from the screen edge to the channel edge, hatched inside,
   * with a lit copper rim on the waterline and breaker foam.
   */
  function shore(ctx, legData, camY, t) {
    var step = legData.step;
    var y0 = camY - step * 2, y1 = camY + H + step * 2;

    for (var side = -1; side <= 1; side += 2) {
      /* wall body */
      ctx.beginPath();
      var started = false;
      for (var wy = y0; wy <= y1; wy += step) {
        var ci = root.Chart.channelAt(legData, Math.max(0, Math.min(legData.length, wy)));
        var edge = ci.c + side * ci.w / 2;
        /* jagged waterline: stable per-sample teeth */
        edge += side * (h1((wy / step | 0) * (side === -1 ? 31 : 57)) * 14);
        var sy = S(wy, camY);
        if (!started) { ctx.moveTo(edge, sy); started = true; }
        else ctx.lineTo(edge, sy);
      }
      /* close to the screen edge */
      ctx.lineTo(side === -1 ? -4 : W + 4, S(y1, camY));
      ctx.lineTo(side === -1 ? -4 : W + 4, S(y0, camY));
      ctx.closePath();

      var g = ctx.createLinearGradient(side === -1 ? 0 : W, 0, side === -1 ? 260 : W - 260, 0);
      g.addColorStop(0, '#0a0d11');
      g.addColorStop(1, '#222d38');
      ctx.fillStyle = g;
      ctx.fill();

      /* hatching inside the mass — engraver's shading */
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = 'rgba(70,92,112,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      var hatchOff = ((camY * 0.7) % 14);
      for (var d = -H; d < W + H; d += 14) {
        ctx.moveTo(d + hatchOff, 0);
        ctx.lineTo(d + hatchOff - H, H);
      }
      ctx.stroke();
      ctx.restore();

      /* copper rim + foam along the waterline */
      ctx.beginPath();
      for (wy = y0; wy <= y1; wy += step) {
        ci = root.Chart.channelAt(legData, Math.max(0, Math.min(legData.length, wy)));
        edge = ci.c + side * ci.w / 2 + side * (h1((wy / step | 0) * (side === -1 ? 31 : 57)) * 14);
        var sy2 = S(wy, camY);
        if (wy === y0) ctx.moveTo(edge, sy2); else ctx.lineTo(edge, sy2);
      }
      ctx.strokeStyle = 'rgba(224,138,60,0.75)';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = 'rgba(224,138,60,0.5)';
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      /* animated foam: dashes riding the rim */
      ctx.strokeStyle = 'rgba(223,230,234,0.34)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (wy = y0; wy <= y1; wy += step) {
        var k = wy / step | 0;
        if (h1(k * 5 + (side + 1)) > 0.55) continue;
        ci = root.Chart.channelAt(legData, Math.max(0, Math.min(legData.length, wy)));
        edge = ci.c + side * ci.w / 2 + side * (h1(k * (side === -1 ? 31 : 57)) * 14);
        var fy = S(wy, camY);
        var surge = Math.sin(t * 1.8 + k * 2.2) * 5;
        ctx.moveTo(edge - side * (4 + surge < 0 ? 0 : surge), fy);
        ctx.lineTo(edge - side * (16 + surge), fy + 2);
      }
      ctx.stroke();
    }
  }

  /* ================================================ CHANNEL FEATURES */

  function rock(ctx, r, camY, t) {
    var sy = S(r.y, camY);
    if (sy < -60 || sy > H + 60) return;
    var s = r.seed;
    ctx.save();
    ctx.translate(r.x, sy);
    /* breaking water ring first */
    ctx.strokeStyle = 'rgba(223,230,234,0.16)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, r.r + 6 + Math.sin(t * 2 + s) * 2, 0, Math.PI * 2);
    ctx.stroke();
    /* the rock: irregular dark polygon with a lit edge */
    ctx.beginPath();
    for (var i = 0; i < 8; i++) {
      var a = i / 8 * Math.PI * 2;
      var rr = r.r * (0.72 + h1(s + i) * 0.4);
      var px = Math.cos(a) * rr, py = Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = '#0d1117';
    ctx.fill();
    ctx.strokeStyle = 'rgba(179,101,31,0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    /* engraved facet lines */
    ctx.strokeStyle = 'rgba(36,49,61,0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-r.r * 0.4, -r.r * 0.1); ctx.lineTo(r.r * 0.3, -r.r * 0.5);
    ctx.moveTo(-r.r * 0.2, r.r * 0.3); ctx.lineTo(r.r * 0.4, 0);
    ctx.stroke();
    ctx.restore();
  }

  function reef(ctx, rf, camY, t) {
    var sy = S(rf.y, camY);
    if (sy < -80 || sy > H + 80) return;
    ctx.save();
    ctx.translate(rf.x, sy);
    /* pale teeth just under the water */
    ctx.fillStyle = 'rgba(124,139,150,0.13)';
    for (var i = 0; i < 7; i++) {
      var a = h1(rf.seed + i) * Math.PI * 2;
      var d = h1(rf.seed + i * 7) * rf.r;
      var px = Math.cos(a) * d, py = Math.sin(a) * d * 0.8;
      ctx.beginPath();
      ctx.moveTo(px - 6, py + 4);
      ctx.lineTo(px, py - 6 + Math.sin(t * 1.5 + i) * 1.5);
      ctx.lineTo(px + 6, py + 4);
      ctx.closePath();
      ctx.fill();
    }
    /* disturbed water ellipse */
    ctx.strokeStyle = 'rgba(223,230,234,0.1)';
    ctx.beginPath();
    ctx.ellipse(0, 0, rf.r, rf.r * 0.8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function derelict(ctx, wk, camY, t) {
    if (wk.taken) return;
    var sy = S(wk.y, camY);
    if (sy < -60 || sy > H + 60) return;
    ctx.save();
    ctx.translate(wk.x, sy);
    ctx.rotate(h1(wk.seed) * 0.9 - 0.45);
    /* broken hull halves */
    ctx.fillStyle = '#171310';
    ctx.strokeStyle = 'rgba(179,101,31,0.5)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-22, 6); ctx.quadraticCurveTo(-24, -2, -14, -7);
    ctx.lineTo(-3, -5); ctx.lineTo(-4, 7); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4, -6); ctx.lineTo(18, -8); ctx.quadraticCurveTo(26, -1, 21, 7);
    ctx.lineTo(6, 8); ctx.closePath();
    ctx.fill(); ctx.stroke();
    /* mast stump */
    ctx.strokeStyle = '#2a2118';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(1, -4); ctx.lineTo(6, -18); ctx.stroke();
    /* the amber glow that says SALVAGE */
    var pulse = 0.5 + Math.sin(t * 2.4 + wk.seed) * 0.25;
    ctx.fillStyle = 'rgba(245,184,61,' + (0.12 * pulse) + ')';
    ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(245,184,61,' + (0.75 * pulse + 0.2) + ')';
    ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  /* ============================================================ BARGE */

  /**
   * The ironclad, top-down: plated hull, riveted seams, twin coil
   * pods, rotating pivot gun, amber heart. `b` carries x,y,vx,vy,
   * aim (radians, screen frame), surgeFrac, ramT (>0 while ramming).
   */
  function barge(ctx, b, camY, t) {
    var sy = S(b.y, camY);
    ctx.save();
    ctx.translate(b.x, sy);

    /* the deck lanterns: a wide, soft amber pool so the player's water
       always reads against the dark — the picture has a subject */
    var lamp = ctx.createRadialGradient(0, 0, 20, 0, 0, 170);
    lamp.addColorStop(0, 'rgba(245,184,61,0.10)');
    lamp.addColorStop(0.6, 'rgba(245,184,61,0.035)');
    lamp.addColorStop(1, 'rgba(245,184,61,0)');
    ctx.fillStyle = lamp;
    ctx.beginPath(); ctx.arc(0, 0, 170, 0, Math.PI * 2); ctx.fill();
    var lean = Math.max(-0.3, Math.min(0.3, b.vx * 0.0016));
    ctx.rotate(lean);

    /* wake: two diverging engraved lines + prop wash */
    ctx.strokeStyle = 'rgba(223,230,234,0.16)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-7, 26); ctx.quadraticCurveTo(-13, 48, -19, 74);
    ctx.moveTo(7, 26); ctx.quadraticCurveTo(13, 48, 19, 74);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(223,230,234,0.1)';
    ctx.beginPath();
    for (var i = 0; i < 3; i++) {
      var wy = 34 + i * 16 + (t * 60 % 16);
      ctx.moveTo(-9 + i, wy); ctx.lineTo(9 - i, wy);
    }
    ctx.stroke();

    /* ram glow while RAMMING SPEED runs */
    if (b.ramT > 0) {
      var rg = ctx.createRadialGradient(0, 0, 4, 0, 0, 52);
      rg.addColorStop(0, 'rgba(111,211,255,0.5)');
      rg.addColorStop(1, 'rgba(111,211,255,0)');
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(0, 0, 52, 0, Math.PI * 2); ctx.fill();
    }

    /* hull: elongated plated octagon, bow up */
    ctx.beginPath();
    ctx.moveTo(0, -30);            /* ram bow */
    ctx.lineTo(10, -18);
    ctx.lineTo(12, 14);
    ctx.lineTo(7, 26);
    ctx.lineTo(-7, 26);
    ctx.lineTo(-12, 14);
    ctx.lineTo(-10, -18);
    ctx.closePath();
    var hg = ctx.createLinearGradient(-12, 0, 12, 0);
    hg.addColorStop(0, '#2a2118');
    hg.addColorStop(0.5, '#4a3826');
    hg.addColorStop(1, '#241c14');
    ctx.fillStyle = hg;
    ctx.fill();
    ctx.strokeStyle = '#b3651f';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    /* the ram itself — bright copper wedge */
    ctx.beginPath();
    ctx.moveTo(0, -30); ctx.lineTo(5, -21); ctx.lineTo(-5, -21); ctx.closePath();
    ctx.fillStyle = b.ramT > 0 ? '#6fd3ff' : '#e08a3c';
    ctx.fill();

    /* plate seams + rivets */
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-10, -8); ctx.lineTo(10, -8);
    ctx.moveTo(-11, 4); ctx.lineTo(11, 4);
    ctx.moveTo(-10, 16); ctx.lineTo(10, 16);
    ctx.stroke();
    ctx.fillStyle = 'rgba(224,138,60,0.8)';
    for (i = 0; i < 3; i++) {
      var ry = -8 + i * 12;
      ctx.fillRect(-9, ry - 1, 1.6, 1.6);
      ctx.fillRect(7.6, ry - 1, 1.6, 1.6);
    }

    /* coil pods amidships — the auto-guns */
    for (var side = -1; side <= 1; side += 2) {
      ctx.save();
      ctx.translate(side * 12, 2);
      ctx.fillStyle = '#141c26';
      ctx.strokeStyle = '#2a7ea6';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, 4.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(111,211,255,' + (0.5 + Math.sin(t * 6 + side) * 0.3) + ')';
      ctx.beginPath(); ctx.arc(0, 0, 1.6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    /* amber heart — the charge, breathing with surge */
    var pulse = 0.55 + 0.45 * Math.sin(t * 3);
    var glow = ctx.createRadialGradient(0, -2, 1, 0, -2, 14);
    glow.addColorStop(0, 'rgba(245,184,61,' + (0.55 + 0.3 * pulse * b.surgeFrac) + ')');
    glow.addColorStop(1, 'rgba(245,184,61,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, -2, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f5b83d';
    ctx.beginPath(); ctx.arc(0, -2, 2.6, 0, Math.PI * 2); ctx.fill();

    /* pivot gun — rotates independently of the hull lean */
    ctx.rotate(-lean);
    ctx.rotate(b.aim + Math.PI / 2);   /* aim is screen-frame atan2 */
    ctx.fillStyle = '#10161e';
    ctx.strokeStyle = '#e08a3c';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#0d1319';
    ctx.fillRect(-2, -21, 4, 17);
    ctx.strokeRect(-2, -21, 4, 17);

    ctx.restore();
  }

  /* ============================================================= FOES */

  function foe(ctx, f, camY, t) {
    var sy = S(f.y, camY);
    if (sy < -60 || sy > H + 60) return;
    ctx.save();
    ctx.translate(f.x, sy);

    if (f.type === 'skiff' || f.type === 'brander') {
      var ang = Math.atan2(-(f.vy || -1), f.vx || 0) + Math.PI / 2;
      ctx.rotate(ang);
      /* lean hull */
      ctx.beginPath();
      ctx.moveTo(0, -13); ctx.lineTo(6, -3); ctx.lineTo(5, 11);
      ctx.lineTo(-5, 11); ctx.lineTo(-6, -3); ctx.closePath();
      ctx.fillStyle = f.type === 'brander' ? '#1d1410' : '#151a21';
      ctx.fill();
      ctx.strokeStyle = f.type === 'brander' ? '#c0392b' : '#7c8b96';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      /* oars beating */
      ctx.strokeStyle = 'rgba(124,139,150,0.7)';
      ctx.lineWidth = 1;
      var stroke = Math.sin(t * 9 + f.wob) * 4;
      ctx.beginPath();
      ctx.moveTo(-6, 0); ctx.lineTo(-11, stroke);
      ctx.moveTo(6, 0); ctx.lineTo(11, stroke);
      ctx.moveTo(-5, 7); ctx.lineTo(-10, 7 + stroke);
      ctx.moveTo(5, 7); ctx.lineTo(10, 7 + stroke);
      ctx.stroke();
      if (f.type === 'brander') {
        /* fire aboard: flickering ember */
        ctx.fillStyle = 'rgba(245,120,40,' + (0.6 + Math.sin(t * 11 + f.wob) * 0.3) + ')';
        ctx.beginPath(); ctx.arc(0, -2, 2.6, 0, Math.PI * 2); ctx.fill();
      }
    }
    else if (f.type === 'tower') {
      /* squat drum with a lamp and an embrasure toward the channel */
      ctx.fillStyle = '#0d1117';
      ctx.strokeStyle = '#b3651f';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(36,49,61,0.9)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.stroke();
      /* crenellations */
      ctx.fillStyle = '#171d25';
      for (var i = 0; i < 8; i++) {
        var a = i / 8 * Math.PI * 2 + 0.2;
        ctx.fillRect(Math.cos(a) * 14 - 1.5, Math.sin(a) * 14 - 1.5, 3, 3);
      }
      /* the watch lamp */
      ctx.fillStyle = 'rgba(245,184,61,' + (0.6 + Math.sin(t * 2.6 + f.wob) * 0.3) + ')';
      ctx.beginPath(); ctx.arc(0, 0, 2.4, 0, Math.PI * 2); ctx.fill();
    }
    else if (f.type === 'gunboat') {
      var ang2 = Math.atan2(-(f.vy || -1), f.vx || 0) + Math.PI / 2;
      ctx.rotate(ang2);
      ctx.beginPath();
      ctx.moveTo(0, -18); ctx.lineTo(8, -8); ctx.lineTo(8, 12);
      ctx.lineTo(0, 17); ctx.lineTo(-8, 12); ctx.lineTo(-8, -8); ctx.closePath();
      ctx.fillStyle = '#161d16';
      ctx.fill();
      ctx.strokeStyle = '#5e7050';
      ctx.lineWidth = 1.3;
      ctx.stroke();
      /* gun ports */
      ctx.fillStyle = '#05080c';
      ctx.fillRect(-8, -4, 2.4, 3); ctx.fillRect(5.6, -4, 2.4, 3);
      ctx.fillRect(-8, 4, 2.4, 3); ctx.fillRect(5.6, 4, 2.4, 3);
      /* funnel smoke */
      ctx.fillStyle = 'rgba(124,139,150,0.25)';
      ctx.beginPath();
      ctx.arc(Math.sin(t * 2 + f.wob) * 2, -12 - (t * 14 % 8), 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (f.type === 'mortar') {
      /* round tub with a fat mortar mouth */
      ctx.beginPath(); ctx.arc(0, 0, 17, 0, Math.PI * 2);
      ctx.fillStyle = '#1c1620'; ctx.fill();
      ctx.strokeStyle = '#7a5a86'; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#05080c';
      ctx.beginPath(); ctx.arc(0, -2, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#9a86a6';
      ctx.beginPath(); ctx.arc(0, -2, 6, 0, Math.PI * 2); ctx.stroke();
      /* fuse glow when about to fire */
      if (f.reload < 0.6) {
        ctx.fillStyle = 'rgba(245,120,40,0.85)';
        ctx.beginPath(); ctx.arc(0, -2, 2.2 + (0.6 - f.reload) * 3, 0, Math.PI * 2); ctx.fill();
      }
    }

    /* hp notch bar for the bigger foes */
    var def = root.Foes.TYPES[f.type];
    if (def.hp >= 30 && f.hp < def.hp) {
      ctx.rotate(0);
      ctx.setTransform(1, 0, 0, 1, f.x, sy);   /* undo rotation, keep translate */
      ctx.fillStyle = 'rgba(5,8,12,0.7)';
      ctx.fillRect(-14, -26, 28, 3);
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(-14, -26, 28 * Math.max(0, f.hp / def.hp), 3);
    }
    ctx.restore();
  }

  /* ======================================================== PROJECTILES */

  function shot(ctx, p, camY) {
    var sy = S(p.y, camY);
    if (sy < -30 || sy > H + 30) return;
    ctx.save();
    ctx.translate(p.x, sy);
    if (p.kind === 'shell') {                  /* player pivot shell */
      ctx.strokeStyle = 'rgba(245,184,61,0.55)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-p.vx * 0.035, p.vy * 0.035);
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.fillStyle = '#f5b83d';
      ctx.beginPath(); ctx.arc(0, 0, 2.6, 0, Math.PI * 2); ctx.fill();
    } else if (p.kind === 'coil') {            /* broadside arc-bolt */
      ctx.strokeStyle = 'rgba(111,211,255,0.8)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      var jx = (Math.random() - 0.5) * 3, jy = (Math.random() - 0.5) * 3;
      ctx.moveTo(-p.vx * 0.03 + jx, p.vy * 0.03 + jy);
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.fillStyle = '#bfe9ff';
      ctx.beginPath(); ctx.arc(0, 0, 1.8, 0, Math.PI * 2); ctx.fill();
    } else if (p.kind === 'ball') {            /* enemy round shot */
      ctx.fillStyle = '#0d1117';
      ctx.strokeStyle = 'rgba(223,230,234,0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (p.kind === 'arrow') {           /* boarding archers */
      var a = Math.atan2(-p.vy, p.vx);
      ctx.rotate(a);
      ctx.strokeStyle = 'rgba(223,230,234,0.8)';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(5, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(5, 0); ctx.lineTo(2, -2); ctx.moveTo(5, 0); ctx.lineTo(2, 2); ctx.stroke();
    }
    ctx.restore();
  }

  /** Mortar bomb: airborne dot + growing shadow ring on the target. */
  function mortarShot(ctx, m, camY) {
    var frac = m.t / m.T;
    /* target ring — the warning is the gameplay */
    var ty = S(m.ty, camY);
    if (ty > -40 && ty < H + 40) {
      ctx.strokeStyle = 'rgba(192,57,43,' + (0.25 + frac * 0.5) + ')';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(m.tx, ty, m.blast * (0.4 + 0.6 * frac), 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(m.tx, ty, 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    /* the bomb in flight: rises then falls, drawn as arc over the line */
    var bx = m.x + (m.tx - m.x) * frac;
    var by0 = m.y + (m.ty - m.y) * frac;
    var lift = Math.sin(frac * Math.PI) * 90;
    var by = S(by0, camY) - lift;
    ctx.fillStyle = '#171d25';
    ctx.strokeStyle = 'rgba(245,120,40,0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(bx, by, 3.4 + Math.sin(frac * Math.PI) * 1.6, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  }

  /* ============================================================== FX */

  function boom(ctx, e, camY) {
    var sy = S(e.y, camY);
    var frac = e.t / e.T;
    var r = e.r * (0.3 + frac * 0.7);
    ctx.save();
    ctx.globalAlpha = 1 - frac;
    ctx.strokeStyle = e.cold ? '#6fd3ff' : '#f5b83d';
    ctx.lineWidth = 2.4 * (1 - frac) + 0.6;
    ctx.beginPath(); ctx.arc(e.x, sy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = e.cold ? 'rgba(191,233,255,0.7)' : 'rgba(255,240,200,0.7)';
    ctx.lineWidth = 1;
    for (var i = 0; i < e.sparks; i++) {
      var a = h1(e.seed + i) * Math.PI * 2;
      var d1 = r * 0.5, d2 = r * (0.9 + h1(e.seed + i * 3) * 0.3);
      ctx.beginPath();
      ctx.moveTo(e.x + Math.cos(a) * d1, sy + Math.sin(a) * d1);
      ctx.lineTo(e.x + Math.cos(a) * d2, sy + Math.sin(a) * d2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function mote(ctx, m, camY, t) {
    var sy = S(m.y, camY);
    if (sy < -20 || sy > H + 20) return;
    var pulse = 0.6 + Math.sin(t * 5 + m.seed) * 0.4;
    ctx.fillStyle = 'rgba(245,184,61,' + (0.18 * pulse) + ')';
    ctx.beginPath(); ctx.arc(m.x, sy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(245,184,61,' + (0.65 + 0.3 * pulse) + ')';
    ctx.beginPath(); ctx.arc(m.x, sy, 2.2, 0, Math.PI * 2); ctx.fill();
  }

  /** TEMPEST: expanding storm ring with lightning legs. */
  function tempest(ctx, e, camY) {
    var sy = S(e.y, camY);
    var frac = e.t / e.T;
    var r = e.r * frac;
    ctx.save();
    ctx.globalAlpha = 1 - frac * 0.7;
    ctx.strokeStyle = '#6fd3ff';
    ctx.lineWidth = 3 * (1 - frac) + 1;
    ctx.beginPath(); ctx.arc(e.x, sy, r, 0, Math.PI * 2); ctx.stroke();
    /* lightning legs: jagged radial paths, redrawn each frame */
    ctx.lineWidth = 1.4;
    for (var i = 0; i < 7; i++) {
      var a = (i / 7) * Math.PI * 2 + frac * 2;
      var px = e.x, py = sy, d = 0;
      ctx.beginPath(); ctx.moveTo(px, py);
      while (d < r) {
        d += 14 + Math.random() * 12;
        var jitter = (Math.random() - 0.5) * 18;
        px = e.x + Math.cos(a) * d + Math.cos(a + Math.PI / 2) * jitter;
        py = sy + Math.sin(a) * d + Math.sin(a + Math.PI / 2) * jitter;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  /** Allied mercenary sloop. */
  function sloop(ctx, s, camY, t) {
    var sy = S(s.y, camY);
    ctx.save();
    ctx.translate(s.x, sy);
    ctx.beginPath();
    ctx.moveTo(0, -16); ctx.lineTo(7, -6); ctx.lineTo(6, 12);
    ctx.lineTo(-6, 12); ctx.lineTo(-7, -6); ctx.closePath();
    ctx.fillStyle = '#12202a';
    ctx.fill();
    ctx.strokeStyle = '#6fd3ff';
    ctx.lineWidth = 1.3;
    ctx.stroke();
    /* hired colours: a pennant */
    ctx.strokeStyle = '#f5b83d';
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.quadraticCurveTo(5 + Math.sin(t * 6) * 2, -20, 9, -18);
    ctx.stroke();
    ctx.restore();
  }

  /* ==================================================== SCREEN DRESSING */

  function compass(ctx, t) {
    ctx.save();
    ctx.translate(64, H - 64);
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#b3651f';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 27, 0, Math.PI * 2); ctx.stroke();
    /* star */
    ctx.fillStyle = '#7c8b96';
    for (var i = 0; i < 8; i++) {
      var a = i / 8 * Math.PI * 2;
      var len = i % 2 === 0 ? 24 : 12;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a - 0.08) * 6, Math.sin(a - 0.08) * 6);
      ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
      ctx.lineTo(Math.cos(a + 0.08) * 6, Math.sin(a + 0.08) * 6);
      ctx.closePath();
      ctx.fill();
    }
    /* north needle — always up the coast, amber */
    ctx.fillStyle = '#f5b83d';
    ctx.beginPath();
    ctx.moveTo(-3, 0); ctx.lineTo(0, -24); ctx.lineTo(3, 0); ctx.closePath();
    ctx.fill();
    ctx.font = '10px Georgia';
    ctx.fillStyle = '#dfe6ea';
    ctx.textAlign = 'center';
    ctx.fillText('N', 0, -38);
    ctx.restore();
  }

  /** Leg-name cartouche, fading in/out at leg start. alpha 0..1 */
  function cartouche(ctx, name, sub, alpha) {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, alpha);
    var cx = W / 2, cy = 90;
    ctx.font = '11px Georgia';
    var w = Math.max(240, ctx.measureText(name).width * 2.4 + 80);
    ctx.fillStyle = 'rgba(12,18,25,0.85)';
    ctx.strokeStyle = '#b3651f';
    ctx.lineWidth = 1;
    ctx.fillRect(cx - w / 2, cy - 26, w, 52);
    ctx.strokeRect(cx - w / 2, cy - 26, w, 52);
    ctx.strokeRect(cx - w / 2 + 4, cy - 22, w - 8, 44);
    ctx.fillStyle = '#f5b83d';
    ctx.textAlign = 'center';
    ctx.font = '20px Georgia';
    ctx.fillText(name, cx, cy + 1);
    ctx.fillStyle = '#7c8b96';
    ctx.font = '10px Georgia';
    ctx.fillText(sub, cx, cy + 17);
    ctx.restore();
  }

  /** Storm vignette + distant lightning at higher hostility. */
  function weather(ctx, hostility, t) {
    var v = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 0.85);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,' + (0.28 + hostility * 0.2) + ')');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
    if (hostility > 0.3) {
      /* far-off sheet lightning: rare frame flashes */
      var k = Math.sin(t * 0.7) * Math.sin(t * 2.31 + 4) * Math.sin(t * 5.7 + 9);
      if (k > 0.96) {
        ctx.fillStyle = 'rgba(191,233,255,' + ((k - 0.96) * 3) + ')';
        ctx.fillRect(0, 0, W, H);
      }
    }
  }

  root.Art = {
    W: W, H: H, S: S,
    sea: sea, shore: shore,
    rock: rock, reef: reef, derelict: derelict,
    barge: barge, foe: foe,
    shot: shot, mortarShot: mortarShot,
    boom: boom, mote: mote, tempest: tempest, sloop: sloop,
    compass: compass, cartouche: cartouche, weather: weather
  };

})(typeof window !== 'undefined' ? window : globalThis);
