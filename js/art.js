/* ===========================================================================
   art.js — the shop, the people in it, and the evening going by.

   Everything here is drawn in code at 384x216 and scaled up with nearest
   neighbour, so it stays sharp on a projector and needs no image files. If a
   PNG named in sprites.js does exist, it is drawn over the top of the figure
   this file would otherwise draw.

   Where things sit:
     y 0–58     the back wall, menu strips, shelf, calendar, photograph
     y 58–150   the people, seated, seen from behind your own counter
     y 150–216  the counter, the pot, the things on your side of it
   =========================================================================== */

(function (global) {
  'use strict';

  var W = 384, H = 216;
  var view = null, vctx = null;
  var buf = document.createElement('canvas');
  buf.width = W; buf.height = H;
  var b = buf.getContext('2d');
  b.imageSmoothingEnabled = false;

  var seats = [];        /* [{id, x}] currently sitting down */
  var speaker = null, expr = 'neutral';
  var phase = 0;         /* 0 = early evening, 1 = closing time */
  var blinkAt = {};
  var gust = 0;               /* the noren, when somebody comes in */
  var waiting = false;        /* somebody on the bench, not coming in yet */

  /* ------------------------------------------------------------------ */
  /* Who looks like what, when there is no PNG for them.                 */

  var LOOK = {
    etsuko: { skin: '#e8c9a8', hair: '#d8d4cc', style: 'bun',  cloth: '#5a6b6a', cloth2: '#46554f', w: 19, h: 30, glasses: false, apron: true },
    daiki:  { skin: '#dcb894', hair: '#2a2320', style: 'crop', cloth: '#6a7a86', cloth2: '#55636d', w: 24, h: 33, glasses: false },
    kenji:  { skin: '#e0c0a0', hair: '#cfcac0', style: 'thin', cloth: '#8a7a5c', cloth2: '#6f624a', w: 21, h: 30, glasses: true,  cap: true },
    mary:   { skin: '#b98a63', hair: '#241a15', style: 'tie',  cloth: '#4a8a86', cloth2: '#3a6f6b', w: 21, h: 31, glasses: false },
    aiko:   { skin: '#e6c4a4', hair: '#1f1a18', style: 'bob',  cloth: '#3f4756', cloth2: '#333a46', w: 20, h: 31, glasses: false },
    ren:    { skin: '#dfbd9a', hair: '#33282a', style: 'mop',  cloth: '#b0724a', cloth2: '#8f5b3a', w: 23, h: 32, glasses: true },
    tanaka: { skin: '#e2c2a2', hair: '#e2ded6', style: 'side', cloth: '#4a4a55', cloth2: '#3a3a44', w: 24, h: 32, glasses: true },
    hiroshi:{ skin: '#e4c7a6', hair: '#e8e4dc', style: 'comb', cloth: '#93a0ad', cloth2: '#77848f', w: 20, h: 29, glasses: true },
    yui:    { skin: '#e6c4a4', hair: '#241c1a', style: 'long', cloth: '#7a5f8a', cloth2: '#634d70', w: 20, h: 31, glasses: false }
  };

  /* ------------------------------------------------------------------ */
  /* OPTIONAL PNG SPRITES                                                */

  var poses = {};        /* 'id:expr' -> image, once loaded */
  var tried = {};

  function fallbackChain(set, want) {
    var order = { warm: ['warm', 'neutral'], worried: ['worried', 'neutral'],
                  stern: ['stern', 'worried', 'neutral'],
                  surprised: ['surprised', 'neutral'], neutral: ['neutral'] };
    var chain = order[want] || ['neutral'];
    for (var i = 0; i < chain.length; i++) if (set[chain[i]]) return set[chain[i]];
    return null;
  }

  function sprite(id, want) {
    var set = (global.SPRITES || {})[id];
    if (!set) return null;
    var file = fallbackChain(set, want);
    if (!file) return null;
    if (poses[file]) return poses[file];
    if (tried[file]) return null;
    tried[file] = true;
    var img = new Image();
    img.onload = function () { poses[file] = img; };
    img.src = file;
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* PEOPLE                                                              */

  /* People are drawn small into a scratch canvas and then blown up, so the
     pixels stay square and the whole figure can be scaled in one place. */
  var pcan = document.createElement('canvas');
  pcan.width = 100; pcan.height = 130;
  var g = pcan.getContext('2d');
  g.imageSmoothingEnabled = false;
  var FOOT = 130;                 /* where the figure sits on the scratch canvas */
  var SCALE = 1.30;

  function face(cx, cy, L, ex, blink) {
    var eyeY = cy + 1;
    g.fillStyle = '#20181a';
    if (blink) {
      g.fillRect(cx - 7, eyeY, 5, 1); g.fillRect(cx + 2, eyeY, 5, 1);
    } else if (ex === 'surprised') {
      g.fillRect(cx - 7, eyeY - 1, 4, 4); g.fillRect(cx + 3, eyeY - 1, 4, 4);
    } else {
      g.fillRect(cx - 7, eyeY, 4, 3); g.fillRect(cx + 3, eyeY, 4, 3);
    }
    g.fillStyle = L.hair;
    if (ex === 'stern') { g.fillRect(cx - 8, eyeY - 4, 5, 1); g.fillRect(cx + 3, eyeY - 3, 5, 1); }
    else if (ex === 'worried') { g.fillRect(cx - 8, eyeY - 3, 5, 1); g.fillRect(cx + 3, eyeY - 4, 5, 1); }
    else if (ex === 'surprised') { g.fillRect(cx - 8, eyeY - 5, 5, 1); g.fillRect(cx + 3, eyeY - 5, 5, 1); }
    else { g.fillRect(cx - 8, eyeY - 4, 5, 1); g.fillRect(cx + 3, eyeY - 4, 5, 1); }
    g.fillStyle = '#7f4744';
    if (ex === 'warm') {
      g.fillRect(cx - 3, cy + 8, 7, 1); g.fillRect(cx - 4, cy + 7, 1, 1); g.fillRect(cx + 4, cy + 7, 1, 1);
    } else if (ex === 'worried') {
      g.fillRect(cx - 3, cy + 9, 7, 1); g.fillRect(cx - 4, cy + 10, 1, 1); g.fillRect(cx + 4, cy + 10, 1, 1);
    } else if (ex === 'surprised') {
      g.fillRect(cx - 2, cy + 7, 5, 4);
    } else {
      g.fillRect(cx - 3, cy + 9, 7, 1);
    }
    if (L.glasses) {
      g.strokeStyle = '#3f382f'; g.lineWidth = 1;
      g.strokeRect(cx - 9.5, eyeY - 3.5, 8, 8);
      g.strokeRect(cx + 1.5, eyeY - 3.5, 8, 8);
      g.beginPath(); g.moveTo(cx - 1.5, eyeY + 0.5); g.lineTo(cx + 1.5, eyeY + 0.5); g.stroke();
    }
  }

  function hair(cx, cy, L) {
    g.fillStyle = L.hair;
    var s = L.style;
    if (s === 'bun') {
      g.beginPath(); g.arc(cx, cy - 3, 13, Math.PI, 0); g.fill();
      g.beginPath(); g.arc(cx, cy - 16, 6, 0, 7); g.fill();
    } else if (s === 'crop') {
      g.fillRect(cx - 13, cy - 15, 26, 9);
      g.beginPath(); g.arc(cx, cy - 5, 13, Math.PI, 0); g.fill();
    } else if (s === 'thin') {
      g.fillRect(cx - 11, cy - 12, 22, 3);
      g.fillRect(cx - 13, cy - 10, 3, 9); g.fillRect(cx + 10, cy - 10, 3, 9);
    } else if (s === 'tie') {
      g.beginPath(); g.arc(cx, cy - 4, 13, Math.PI, 0); g.fill();
      g.fillRect(cx - 14, cy - 6, 3, 11); g.fillRect(cx + 11, cy - 6, 3, 11);
      g.beginPath(); g.arc(cx + 14, cy + 3, 5, 0, 7); g.fill();
    } else if (s === 'bob') {
      g.beginPath(); g.arc(cx, cy - 3, 14, Math.PI, 0); g.fill();
      g.fillRect(cx - 14, cy - 4, 5, 15); g.fillRect(cx + 9, cy - 4, 5, 15);
    } else if (s === 'mop') {
      g.beginPath(); g.arc(cx, cy - 5, 14, Math.PI, 0.25); g.fill();
      g.fillRect(cx - 14, cy - 9, 28, 6);
    } else if (s === 'side') {
      g.fillRect(cx - 13, cy - 13, 26, 5);
      g.fillRect(cx - 13, cy - 9, 7, 6); g.fillRect(cx + 7, cy - 9, 6, 6);
    } else if (s === 'comb') {
      g.fillRect(cx - 12, cy - 13, 24, 3);
      g.fillRect(cx - 12, cy - 10, 17, 4);
      g.fillRect(cx - 13, cy - 10, 3, 9); g.fillRect(cx + 10, cy - 10, 3, 9);
    } else if (s === 'long') {
      g.beginPath(); g.arc(cx, cy - 3, 14, Math.PI, 0); g.fill();
      g.fillRect(cx - 14, cy - 4, 5, 30); g.fillRect(cx + 9, cy - 4, 5, 30);
    }
  }

  function figure(id, L, ex, frame) {
    g.clearRect(0, 0, 100, 130);
    var cx = 50;
    var cy = FOOT - L.h - 16;          /* face centre */
    var shoulder = FOOT - L.h + 2;

    /* torso: flat shoulders, slight taper — a person leaning on a counter */
    g.fillStyle = L.cloth;
    g.beginPath();
    g.moveTo(cx - L.w, FOOT);
    g.lineTo(cx - L.w + 1, shoulder + 5);
    g.quadraticCurveTo(cx - L.w + 4, shoulder, cx - L.w + 9, shoulder - 1);
    g.lineTo(cx + L.w - 9, shoulder - 1);
    g.quadraticCurveTo(cx + L.w - 4, shoulder, cx + L.w - 1, shoulder + 5);
    g.lineTo(cx + L.w, FOOT);
    g.closePath(); g.fill();

    /* collar */
    g.fillStyle = L.cloth2;
    g.beginPath(); g.moveTo(cx - 7, shoulder - 1); g.lineTo(cx, shoulder + 10);
    g.lineTo(cx + 7, shoulder - 1); g.closePath(); g.fill();
    g.fillRect(cx - L.w + 1, shoulder + 12, 2, FOOT - shoulder - 12);
    if (L.apron) { g.fillStyle = '#e6dcc8'; g.fillRect(cx - 11, shoulder + 14, 22, FOOT); }

    /* neck and head */
    g.fillStyle = L.skin;
    g.fillRect(cx - 5, cy + 10, 10, 8);
    g.beginPath(); g.ellipse(cx, cy, 13, 14, 0, 0, 7); g.fill();
    g.fillRect(cx - 15, cy, 2, 5); g.fillRect(cx + 13, cy, 2, 5);
    /* a little shading down one side of the face */
    g.fillStyle = 'rgba(0,0,0,.07)';
    g.beginPath(); g.ellipse(cx + 7, cy + 1, 6, 12, 0, 0, 7); g.fill();

    hair(cx, cy, L);
    if (L.cap) {
      g.fillStyle = '#5a6a5a'; g.fillRect(cx - 14, cy - 16, 28, 7); g.fillRect(cx - 15, cy - 10, 30, 2);
    }
    face(cx, cy, L, ex, (frame - (blinkAt[id] || 0)) % 260 < 8);
  }

  function drawPerson(id, x, baseY, lit, frame) {
    var L = LOOK[id];
    if (!L) return;
    var ex = (speaker === id) ? expr : 'neutral';
    var img = sprite(id, ex);

    b.globalAlpha = lit ? 1 : 0.5;
    if (img) {
      var hgt = 132, wid = Math.round(img.width * (hgt / img.height));
      b.drawImage(img, Math.round(x - wid / 2), Math.round(baseY - hgt), wid, hgt);
    } else {
      figure(id, L, ex, frame);
      var w2 = 100 * SCALE, h2 = 130 * SCALE;
      b.drawImage(pcan, Math.round(x - w2 / 2), Math.round(baseY - h2), Math.round(w2), Math.round(h2));
    }
    b.globalAlpha = 1;
  }

  /* ------------------------------------------------------------------ */
  /* THE ROOM                                                            */

  var HOT = [
    { key: 'calendar', x: 14,  y: 96,  w: 34, h: 40 },
    { key: 'photo',    x: 306, y: 46,  w: 46, h: 34 },
    { key: 'noren',    x: 88,  y: 16,  w: 208, h: 26 },
    { key: 'shutter',  x: 92,  y: 84,  w: 130, h: 30 },
    { key: 'vending',  x: 244, y: 64,  w: 46, h: 50 },
    { key: 'arcade',   x: 88,  y: 42,  w: 208, h: 16 },
    { key: 'cat',      x: 98,  y: 116, w: 30, h: 22 },
    { key: 'bench',    x: 196, y: 110, w: 48, h: 28 },
    { key: 'seats',    x: 40,  y: 150, w: 180, h: 22 }
  ];

  /* The shop front is open onto the arcade. Everything between these two
     posts is outside; everything either side of them is the shop. */
  var AX = 88, AW = 208, AY = 16, AB = 150;

  function alley(frame) {
    b.save();
    b.beginPath(); b.rect(AX, AY, AW, AB - AY); b.clip();

    b.fillStyle = '#10141b'; b.fillRect(AX, AY, AW, AB - AY);

    /* --- under the arcade roof: one lamp left working ------------------ */
    b.fillStyle = '#171c25'; b.fillRect(AX, AY, AW, 40);
    b.fillStyle = '#0d1117';
    for (var rb = 0; rb < 6; rb++) b.fillRect(AX + 10 + rb * 34, AY, 5, 40);
    [[132, 1], [206, 0], [268, 2]].forEach(function (L) {
      var lx = L[0], live = L[1] === 1 || (L[1] === 2 && Math.sin(frame / 6) > -0.25);
      b.fillStyle = '#242a34'; b.fillRect(lx, 44, 1, 4);
      b.fillStyle = live ? 'rgba(230,212,160,.9)' : '#282d36';
      b.beginPath(); b.ellipse(lx, 50, 5, 3.5, 0, 0, 7); b.fill();
      if (live) {
        b.fillStyle = 'rgba(230,212,160,.09)';
        b.beginPath(); b.moveTo(lx - 4, 51); b.lineTo(lx + 4, 51);
        b.lineTo(lx + 26, AB); b.lineTo(lx - 26, AB); b.closePath(); b.fill();
      }
    });
    b.strokeStyle = '#0b0e13'; b.lineWidth = 1;
    [50, 57].forEach(function (cy2) {
      b.beginPath(); b.moveTo(AX, cy2);
      b.quadraticCurveTo(AX + AW / 2, cy2 + 6, AX + AW, cy2 - 2); b.stroke();
    });

    /* --- the building opposite, close enough to touch ------------------ */
    b.fillStyle = '#1e2732'; b.fillRect(AX, 56, AW, 58);
    b.fillStyle = '#1a222c';
    for (var pl = 0; pl < 14; pl++) b.fillRect(AX + pl * 16, 56, 1, 58);

    /* hanging signs for shops that closed years apart */
    var signs = [[100, '#2c3646', 26], [150, '#38323c', 22], [196, '#2c3c3c', 28]];
    signs.forEach(function (sg) {
      b.fillStyle = '#141922'; b.fillRect(sg[0] - 1, 58, 15, 2);
      b.fillStyle = sg[1]; b.fillRect(sg[0], 60, 13, sg[2]);
      b.fillStyle = 'rgba(190,200,214,.20)';
      for (var t = 0; t < 3; t++) b.fillRect(sg[0] + 3, 65 + t * 7, 7, 2);
    });

    /* --- the shutters, all the way down -------------------------------- */
    b.fillStyle = '#1a2029'; b.fillRect(AX + 4, 84, 130, 3);
    b.fillStyle = '#232a34'; b.fillRect(AX + 4, 87, 130, 27);
    b.fillStyle = '#2c343f';
    for (var sh = 0; sh < 7; sh++) b.fillRect(AX + 4, 88 + sh * 4, 130, 2);
    b.fillStyle = '#8a8468'; b.fillRect(AX + 52, 95, 10, 8);
    b.fillStyle = '#6e6a52'; b.fillRect(AX + 53, 97, 8, 1); b.fillRect(AX + 53, 100, 6, 1);

    /* --- the vending machine, the only other thing open ---------------- */
    var vx = 246;
    var vg = b.createRadialGradient(vx + 20, 92, 4, vx + 20, 92, 54);
    vg.addColorStop(0, 'rgba(154,204,240,' + (0.16 + Math.sin(frame / 60) * 0.02) + ')');
    vg.addColorStop(1, 'rgba(154,204,240,0)');
    b.fillStyle = vg; b.fillRect(AX, 42, AW, AB - 42);
    b.fillStyle = '#20262e'; b.fillRect(vx - 2, 64, 44, 50);
    b.fillStyle = '#2f363f'; b.fillRect(vx, 66, 40, 46);
    b.fillStyle = '#e4eff7'; b.fillRect(vx + 3, 69, 34, 28);
    var cans = ['#d8483a', '#3a7ad8', '#e0a92c', '#4aa86a', '#c8543a', '#3a8ad0', '#d8b83a', '#5a9a5a'];
    for (var cn = 0; cn < 8; cn++) {
      b.fillStyle = cans[cn];
      b.fillRect(vx + 6 + (cn % 4) * 8, 72 + Math.floor(cn / 4) * 13, 5, 10);
      b.fillStyle = 'rgba(255,255,255,.5)';
      b.fillRect(vx + 6 + (cn % 4) * 8, 72 + Math.floor(cn / 4) * 13, 1, 10);
    }
    b.fillStyle = '#9fb8cc'; b.fillRect(vx + 3, 98, 34, 2);
    b.fillStyle = '#151a20'; b.fillRect(vx + 6, 102, 28, 7);
    b.fillStyle = '#c8402f'; b.fillRect(vx + 30, 100, 4, 2);

    /* --- the ground, still damp from this afternoon -------------------- */
    b.fillStyle = '#151a20'; b.fillRect(AX, 114, AW, AB - 114);
    b.fillStyle = '#1a2028';
    for (var gg = 0; gg < 6; gg++) b.fillRect(AX, 118 + gg * 6, AW, 1);
    for (var rf = 0; rf < 5; rf++) {
      b.globalAlpha = 0.10 + (rf % 2) * 0.04;
      b.fillStyle = '#a8d6ee';
      b.fillRect(vx + 4 + rf * 8, 114, 3, 11 + Math.sin(frame / 20 + rf) * 3);
    }
    for (var rw = 0; rw < 7; rw++) {
      b.globalAlpha = 0.07 + (rw % 3) * 0.03;
      b.fillStyle = '#f0a848';
      b.fillRect(AX + 10 + rw * 14, 130, 3, 10 + Math.sin(frame / 17 + rw) * 3);
    }
    b.globalAlpha = 1;

    /* --- the bench, bolted down, facing the shutters ------------------- */
    b.fillStyle = '#2a3038'; b.fillRect(198, 122, 44, 3);
    b.fillStyle = '#222831'; b.fillRect(198, 125, 44, 2);
    b.fillRect(201, 127, 3, 8); b.fillRect(236, 127, 3, 8);
    b.fillStyle = '#1d232b'; b.fillRect(198, 112, 44, 2);
    b.fillRect(201, 114, 3, 8); b.fillRect(236, 114, 3, 8);

    /* somebody has been sitting on it a while */
    if (waiting) {
      var bx = 220, by = 122;
      b.fillStyle = '#171c23';
      b.fillRect(bx - 5, by - 13, 11, 14);              /* back and shoulders */
      b.fillRect(bx - 6, by, 13, 4);                    /* knees */
      b.fillRect(bx - 5, by + 4, 4, 7); b.fillRect(bx + 2, by + 4, 4, 7);
      b.beginPath(); b.arc(bx, by - 17, 5, 0, 7); b.fill();
      b.fillStyle = '#20262f'; b.fillRect(bx - 6, by - 21, 12, 3);   /* the cap */
      b.fillRect(bx - 7, by - 19, 14, 1);
      /* the vending machine puts a cold edge down one side of him */
      b.fillStyle = 'rgba(168,214,238,.30)';
      b.fillRect(bx + 5, by - 12, 1, 13); b.fillRect(bx + 4, by - 19, 1, 5);
    }

    /* --- the cat nobody owns and everybody feeds ----------------------- */
    var cxx = 112, cyy = 128, tw = Math.sin(frame / 26) * 2;
    b.fillStyle = '#12151a';
    b.beginPath(); b.ellipse(cxx, cyy + 4, 10, 5, 0, 0, 7); b.fill();
    b.beginPath(); b.arc(cxx - 7, cyy - 3, 5, 0, 7); b.fill();
    b.fillRect(cxx - 11, cyy - 10, 2, 4); b.fillRect(cxx - 5, cyy - 10, 2, 4);
    b.fillRect(cxx + 7, cyy + 1 + tw, 7, 1);
    b.fillStyle = '#c9c07a';
    b.fillRect(cxx - 9, cyy - 4, 1, 1); b.fillRect(cxx - 5, cyy - 4, 1, 1);

    b.restore();
  }

  function wall(frame) {
    /* the inside of the shop */
    b.fillStyle = '#2b2723'; b.fillRect(0, 0, W, 152);
    b.fillStyle = '#252119';
    for (var i = 0; i < 14; i++) b.fillRect(0, 9 + i * 11, W, 1);

    alley(frame);

    /* the posts and beam of the shop front */
    b.fillStyle = '#3b332a';
    b.fillRect(AX - 8, 6, 8, 146); b.fillRect(AX + AW, 6, 8, 146);
    b.fillRect(AX - 8, 6, AW + 16, 10);
    b.fillStyle = '#4a4136'; b.fillRect(AX - 8, 6, AW + 16, 2);

    /* the noren, swaying — harder for a moment when somebody comes in */
    var sway = Math.sin(frame / 40) * 1.2 + gust * Math.sin(frame / 5) * 3;
    for (var np = 0; np < 4; np++) {
      var px2 = AX + np * (AW / 4), pw = AW / 4 - 1;
      var off = Math.sin(frame / 40 + np * 0.8) * 1.1 + gust * Math.sin(frame / 5 + np) * 3;
      b.fillStyle = np % 2 ? '#1f3350' : '#22385a';
      b.fillRect(px2 + off, 16, pw, 26);
    }
    b.fillStyle = '#eae4d4'; b.font = '13px serif'; b.textAlign = 'center';
    b.fillText('ラーメン', AX + AW / 2 + sway * 0.4, 34);
    b.fillStyle = '#16243a'; b.fillRect(AX, 40, AW, 2);
    if (gust > 0) gust = Math.max(0, gust - 0.012);

    /* ---- the left-hand wall: lantern, menu strips, calendar ---------- */
    b.fillStyle = '#3b332a'; b.fillRect(40, 0, 2, 10);
    var glow = 0.80 + Math.sin(frame / 33) * 0.05;
    b.fillStyle = 'rgba(240,168,72,' + glow + ')';
    b.beginPath(); b.ellipse(41, 20, 12, 10, 0, 0, 7); b.fill();
    b.fillStyle = 'rgba(255,228,175,.92)';
    b.beginPath(); b.ellipse(41, 19, 6, 5, 0, 0, 7); b.fill();
    b.fillStyle = '#c8402f'; b.fillRect(32, 28, 18, 2);

    var menus = ['しょうゆ', 'みそ', 'しお', 'とんこつ'];
    for (var m = 0; m < 4; m++) {
      var mx = 4 + m * 19;
      b.fillStyle = '#e9dfc8'; b.fillRect(mx, 40, 15, 44);
      b.fillStyle = '#cfc4aa'; b.fillRect(mx, 82, 15, 2);
      b.fillStyle = '#2e2a22'; b.font = '8px serif'; b.textAlign = 'center';
      for (var ch = 0; ch < menus[m].length; ch++) b.fillText(menus[m][ch], mx + 7, 50 + ch * 9);
    }

    b.fillStyle = '#efe6d4'; b.fillRect(14, 96, 34, 40);
    b.fillStyle = '#c8402f'; b.fillRect(14, 96, 34, 8);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) {
      b.fillStyle = ((r * 6 + c) % 5 === 0) ? '#c8402f' : '#a89a86';
      b.fillRect(17 + c * 5, 108 + r * 6, 3, 3);
    }

    /* ---- the right-hand wall: the photograph and the shelf ------------ */
    b.fillStyle = '#d8c7a6'; b.fillRect(306, 46, 46, 34);
    b.fillStyle = '#94836a'; b.fillRect(309, 49, 40, 28);
    b.fillStyle = '#b3a288'; b.fillRect(312, 60, 34, 14);
    b.fillStyle = '#7a6a52';
    for (var pp = 0; pp < 4; pp++) b.fillRect(314 + pp * 8, 56, 4, 6);

    b.fillStyle = '#3b332a'; b.fillRect(304, 116, 80, 4);
    var cols = ['#7a4a2a', '#4a5a3a', '#6a5a2a', '#1f3350', '#5a3a3a'];
    for (var q = 0; q < 5; q++) {
      b.fillStyle = cols[q]; b.fillRect(308 + q * 15, 102, 8, 14);
      b.fillStyle = '#d8cbb4'; b.fillRect(310 + q * 15, 98, 4, 5);
    }

  }

  function counter(frame) {
    b.fillStyle = '#4a3a2c'; b.fillRect(0, 150, W, 13);
    b.fillStyle = '#5e4a38'; b.fillRect(0, 150, W, 3);
    b.fillStyle = '#2e2620'; b.fillRect(0, 163, W, H - 163);
    b.fillStyle = '#271f1a';
    for (var i = 0; i < 9; i++) b.fillRect(0, 170 + i * 6, W, 1);

    /* the pot, your side, on the left */
    b.fillStyle = '#454952'; b.fillRect(14, 170, 48, 32);
    b.fillStyle = '#575c66'; b.fillRect(12, 166, 52, 6);
    b.fillStyle = '#6b7078'; b.fillRect(14, 167, 48, 2);
    b.fillStyle = '#383c44'; b.fillRect(14, 186, 48, 2);
    b.globalAlpha = 0.32; b.fillStyle = '#e8ded0';
    for (var s = 0; s < 4; s++) {
      var t = (frame * 0.7 + s * 30) % 130;
      b.fillRect(22 + s * 11 + Math.sin(t / 11 + s) * 3, 164 - t * 0.26, 2, 3);
    }
    b.globalAlpha = 1;

    b.fillStyle = '#e8e2d8';
    b.fillRect(88, 180, 28, 5); b.fillRect(90, 175, 24, 5); b.fillRect(92, 170, 20, 5);
    b.fillStyle = '#1f3350'; b.fillRect(88, 183, 28, 1); b.fillRect(90, 178, 24, 1);
    b.fillStyle = '#5e4a38'; b.fillRect(140, 172, 13, 18);
    b.fillStyle = '#c9a878';
    b.fillRect(142, 163, 2, 10); b.fillRect(146, 161, 2, 12); b.fillRect(149, 164, 2, 9);
    b.fillStyle = '#c8bda6'; b.fillRect(184, 176, 22, 7);
    b.fillStyle = '#b3a68d'; b.fillRect(184, 180, 22, 3);
  }

  function nightWash() {
    /* the evening going by: the room cools and darkens */
    var a = 0.10 + phase * 0.26;
    b.fillStyle = 'rgba(12,10,26,' + a + ')';
    b.fillRect(0, 0, W, H);
    /* lantern keeps a pool of warm light no matter how late it is */
    var g = b.createRadialGradient(120, 90, 10, 120, 90, 190);
    g.addColorStop(0, 'rgba(240,180,90,' + (0.16 - phase * 0.04) + ')');
    g.addColorStop(1, 'rgba(240,180,90,0)');
    b.fillStyle = g; b.fillRect(0, 0, W, H);
  }

  function drawRoom(frame) {
    wall(frame);

    seats.forEach(function (s) {
      drawPerson(s.id, s.x, 160, speaker === null || speaker === s.id, frame);
    });

    counter(frame);

    nightWash();
    blit();
  }

  function blit() {
    if (!vctx) return;
    vctx.imageSmoothingEnabled = false;
    vctx.clearRect(0, 0, view.width, view.height);
    vctx.drawImage(buf, 0, 0, W, H, 0, 0, view.width, view.height);
  }

  /* ------------------------------------------------------------------ */
  /* TITLE AND END CARDS                                                  */
  /*                                                                      */
  /* The title is the arcade from the outside: one lit stall in a run of  */
  /* shutters. The end card is Tokyo at dawn — where everybody went.      */

  function arcade(canvas) {
    var c = canvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.fillStyle = '#0b0e13'; c.fillRect(0, 0, W, H);

    /* roof of the arcade, in perspective, running away from us */
    c.fillStyle = '#141922'; c.fillRect(0, 0, W, 46);
    for (var rb = 0; rb < 11; rb++) {
      var t = rb / 10, bx = 192 + (rb - 5) * 40 * (1 - t * 0.2);
      c.fillStyle = '#0d1117'; c.fillRect(bx, 0, 5, 46);
    }
    /* strung lamps down the middle, most of them out */
    [[96, 0], [150, 1], [206, 0], [262, 0], [312, 1]].forEach(function (L) {
      c.fillStyle = L[1] ? 'rgba(226,206,150,.8)' : '#252a33';
      c.beginPath(); c.ellipse(L[0], 44, 5, 3.5, 0, 0, 7); c.fill();
    });

    /* the two walls of shops, angled in */
    function side(dir) {
      for (var i = 0; i < 5; i++) {
        var t = i / 5;
        var x0 = dir < 0 ? i * 34 : W - i * 34 - 34;
        var top = 46 + t * 26, bot = 168 - t * 12;
        c.fillStyle = i % 2 ? '#171d26' : '#1b222c';
        c.fillRect(x0, top, 34, bot - top);
        /* shutters */
        c.fillStyle = '#232a33'; c.fillRect(x0 + 4, bot - 34, 26, 32);
        c.fillStyle = '#2b333e';
        for (var sh = 0; sh < 7; sh++) c.fillRect(x0 + 4, bot - 32 + sh * 4, 26, 2);
        /* a dead sign */
        c.fillStyle = ['#2a3240', '#33303a', '#2c3a3a'][i % 3];
        c.fillRect(x0 + 10, top + 6, 9, 22);
      }
    }
    side(-1); side(1);

    /* our shop, right of centre, the only warm thing in the picture */
    var sx = 156, sw = 74;
    c.fillStyle = '#2b2723'; c.fillRect(sx, 58, sw, 110);
    c.fillStyle = 'rgba(240,168,72,.92)'; c.fillRect(sx + 5, 76, sw - 10, 84);
    /* the counter, seen end-on through the opening, with stools */
    c.fillStyle = 'rgba(90,58,26,.55)'; c.fillRect(sx + 5, 128, sw - 10, 5);
    c.fillStyle = 'rgba(70,44,20,.45)';
    for (var st2 = 0; st2 < 4; st2++) c.fillRect(sx + 10 + st2 * 15, 133, 7, 12);
    /* one person at the far end, and somebody behind the counter */
    c.fillStyle = 'rgba(58,34,16,.6)';
    c.beginPath(); c.ellipse(sx + 20, 116, 7, 15, 0, 0, 7); c.fill();
    c.fillStyle = 'rgba(48,28,12,.5)';
    c.beginPath(); c.ellipse(sx + 52, 112, 6, 13, 0, 0, 7); c.fill();
    /* the noren, and the beam over it */
    c.fillStyle = '#1f3350'; c.fillRect(sx + 3, 70, sw - 6, 16);
    c.fillStyle = '#16243a';
    c.fillRect(sx + 20, 74, 2, 12); c.fillRect(sx + 50, 74, 2, 12);
    c.fillStyle = '#eae4d4'; c.font = '11px serif'; c.textAlign = 'center';
    c.fillText('ラーメン', sx + sw / 2, 82);
    c.fillStyle = '#3b332a'; c.fillRect(sx, 58, sw, 6);

    /* the floor of the arcade, wet */
    c.fillStyle = '#12161d'; c.fillRect(0, 160, W, H - 160);
    c.fillStyle = '#171c24';
    for (var g = 0; g < 8; g++) c.fillRect(0, 164 + g * 6, W, 1);
    for (var rw = 0; rw < 7; rw++) {
      c.globalAlpha = 0.07 + (rw % 3) * 0.035;
      c.fillStyle = '#f0a848';
      c.fillRect(sx + 4 + rw * 10, 162, 4, 18 + (rw % 3) * 5);
    }
    c.globalAlpha = 1;

    /* a vending machine down on the left, and the glow off it */
    var vgr = c.createRadialGradient(58, 138, 4, 58, 138, 52);
    vgr.addColorStop(0, 'rgba(150,200,236,.16)'); vgr.addColorStop(1, 'rgba(150,200,236,0)');
    c.fillStyle = vgr; c.fillRect(0, 80, 140, 110);
    c.fillStyle = '#20262e'; c.fillRect(40, 116, 36, 46);
    c.fillStyle = '#2f363f'; c.fillRect(42, 118, 32, 42);
    c.fillStyle = '#dceaf4'; c.fillRect(45, 121, 26, 24);
    c.fillStyle = '#151a20'; c.fillRect(46, 148, 24, 6);

    var v = c.createRadialGradient(sx + 36, 118, 10, sx + 36, 118, 170);
    v.addColorStop(0, 'rgba(240,168,72,.20)'); v.addColorStop(1, 'rgba(240,168,72,0)');
    c.fillStyle = v; c.fillRect(0, 0, W, H);
  }

  function tokyoDawn(canvas) {
    var c = canvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    var sky = c.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#24314e');
    sky.addColorStop(0.55, '#8a7488'); sky.addColorStop(1, '#e0a878');
    c.fillStyle = sky; c.fillRect(0, 0, W, H);

    /* towers, layered back to front, full of lit windows */
    function block(x, w, h, shade, lit) {
      c.fillStyle = shade; c.fillRect(x, H - h, w, h);
      for (var wy = 0; wy < Math.floor(h / 7); wy++) {
        for (var wx = 0; wx < Math.floor(w / 6); wx++) {
          if (((wx * 7 + wy * 13 + x) % 5) > 2) continue;
          c.fillStyle = 'rgba(248,222,168,' + lit + ')';
          c.fillRect(x + 2 + wx * 6, H - h + 4 + wy * 7, 3, 4);
        }
      }
    }
    block(6, 44, 120, '#2e3448', 0.55);   block(56, 30, 92, '#333950', 0.5);
    block(92, 52, 148, '#272d40', 0.6);   block(150, 34, 104, '#343a52', 0.5);
    block(190, 46, 132, '#2b3145', 0.6);  block(242, 30, 88, '#363c54', 0.45);
    block(278, 50, 156, '#252b3c', 0.65); block(334, 44, 118, '#303648', 0.5);

    /* the street below, and the crowd on it */
    c.fillStyle = '#1d2130'; c.fillRect(0, 176, W, H - 176);
    c.fillStyle = '#161a26'; c.fillRect(0, 176, W, 3);
    for (var p2 = 0; p2 < 34; p2++) {
      var px2 = (p2 * 37 + 11) % W, ph = 10 + (p2 % 3) * 2;
      c.fillStyle = 'rgba(18,20,30,' + (0.55 + (p2 % 4) * 0.1) + ')';
      c.fillRect(px2, 190 - ph, 4, ph);
      c.beginPath(); c.arc(px2 + 2, 190 - ph - 2, 2, 0, 7); c.fill();
    }
    /* first light coming down the avenue */
    var v2 = c.createRadialGradient(W / 2, 176, 6, W / 2, 176, 200);
    v2.addColorStop(0, 'rgba(240,190,130,.28)'); v2.addColorStop(1, 'rgba(240,190,130,0)');
    c.fillStyle = v2; c.fillRect(0, 0, W, H);
  }

  /* ------------------------------------------------------------------ */
  /* A BUST, FOR THE PERSON STANDING NEXT TO YOU                          */

  function portrait(canvas, id, ex, frame) {
    var c = canvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.clearRect(0, 0, canvas.width, canvas.height);
    var L = LOOK[id];
    if (!L) return;
    var img = sprite(id, ex);
    if (img) {
      /* a supplied PNG is cropped to its top half — head and shoulders */
      var w2 = canvas.width, h2 = Math.round(img.height * 0.62);
      c.drawImage(img, 0, 0, img.width, h2, 0, 0, w2, Math.round(w2 * h2 / img.width));
      return;
    }
    figure(id, L, ex, frame || 0);
    /* the scratch figure is 100x130 with the head near the top; take the
       top 62 pixels of it and blow that up to fill the frame */
    c.drawImage(pcan, 20, FOOT - L.h - 34, 60, 62, 0, 0, canvas.width, canvas.height);
  }

  /* ------------------------------------------------------------------ */

  global.Art = {
    init: function (canvas) {
      view = canvas; vctx = canvas.getContext('2d');
      Object.keys(LOOK).forEach(function (k, i) { blinkAt[k] = i * 37; });
    },
    setSeats: function (ids) {
      var xs = ids.length === 1 ? [152] : ids.length === 2 ? [128, 258] : [96, 192, 288];
      seats = ids.map(function (id, i) { return { id: id, x: xs[i] }; });
    },
    setSpeaker: function (id, e) { speaker = id || null; expr = e || 'neutral'; },
    gust: function () { gust = 1; },
    setWaiting: function (v) { waiting = !!v; },
    setPhase: function (p) { phase = Math.max(0, Math.min(1, p)); },
    drawRoom: drawRoom,
    titleArt: arcade,
    endArt: tokyoDawn,
    portrait: portrait,
    hitTest: function (mx, my) {
      for (var i = 0; i < HOT.length; i++) {
        var r = HOT[i];
        if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return r.key;
      }
      return null;
    }
  };

}(window));
