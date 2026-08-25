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
    { key: 'calendar', x: 10,  y: 10, w: 32, h: 38 },
    { key: 'photo',    x: 314, y: 8,  w: 44, h: 32 },
    { key: 'noren',    x: 226, y: 10, w: 76, h: 26 },
    { key: 'shutter',  x: 240, y: 44, w: 44, h: 26 },
    { key: 'seats',    x: 40,  y: 150, w: 180, h: 22 }
  ];

  function wall(frame) {
    /* back wall */
    b.fillStyle = '#2f211a'; b.fillRect(0, 0, W, 152);
    b.fillStyle = '#281c15';
    for (var i = 0; i < 14; i++) b.fillRect(0, 9 + i * 11, W, 1);

    /* ---- the doorway, and the street through it ---------------------- */
    var dx = 228, dw = 72;
    /* night sky and the road outside */
    b.fillStyle = '#1a2230'; b.fillRect(dx, 30, dw, 122);
    b.fillStyle = '#20262e'; b.fillRect(dx, 104, dw, 48);          /* road */
    /* the closed shop opposite: shutter, and a yellowed notice on it */
    b.fillStyle = '#252d36'; b.fillRect(dx + 12, 46, 46, 30);
    b.fillStyle = '#2e3843';
    for (var sh = 0; sh < 7; sh++) b.fillRect(dx + 12, 48 + sh * 4, 46, 2);
    b.fillStyle = '#8a8468'; b.fillRect(dx + 30, 58, 8, 6);
    /* street lamp glow, breathing very slightly */
    b.fillStyle = 'rgba(240,206,140,' + (0.13 + Math.sin(frame / 47) * 0.02) + ')';
    b.beginPath(); b.arc(dx + 62, 52, 20, 0, 7); b.fill();
    b.fillStyle = '#3a4048'; b.fillRect(dx + 61, 52, 2, 52);
    /* door frame */
    b.fillStyle = '#3f2c21';
    b.fillRect(dx - 6, 26, 6, 126); b.fillRect(dx + dw, 26, 6, 126); b.fillRect(dx - 6, 26, dw + 12, 6);

    /* noren over the door */
    b.fillStyle = '#23364f'; b.fillRect(dx - 8, 8, dw + 16, 24);
    b.fillStyle = '#1a2a3d';
    b.fillRect(dx + 18, 14, 2, 18); b.fillRect(dx + 52, 14, 2, 18);
    b.fillStyle = '#eae4d4'; b.font = '11px serif'; b.textAlign = 'center';
    b.fillText('ラーメン', dx + 36, 25);

    /* ---- menu strips ------------------------------------------------- */
    var menus = ['しょうゆ', 'みそ', 'しお', 'とんこつ'];
    for (var m = 0; m < 4; m++) {
      var mx = 54 + m * 23;
      b.fillStyle = '#e9dfc8'; b.fillRect(mx, 8, 16, 46);
      b.fillStyle = '#c9bfa8'; b.fillRect(mx, 52, 16, 2);
      b.fillStyle = '#3a2a20'; b.font = '8px serif';
      for (var ch = 0; ch < menus[m].length; ch++) b.fillText(menus[m][ch], mx + 8, 18 + ch * 9);
    }

    /* ---- calendar, with a name written on half the squares ----------- */
    b.fillStyle = '#efe6d4'; b.fillRect(10, 10, 32, 38);
    b.fillStyle = '#b8433a'; b.fillRect(10, 10, 32, 8);
    b.fillStyle = '#8a7a66';
    for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) {
      b.fillStyle = ((r * 6 + c) % 5 === 0) ? '#b8433a' : '#a89a86';
      b.fillRect(13 + c * 5, 22 + r * 6, 3, 3);
    }

    /* ---- the photograph from opening day ----------------------------- */
    b.fillStyle = '#d8c7a6'; b.fillRect(314, 8, 44, 32);
    b.fillStyle = '#94836a'; b.fillRect(317, 11, 38, 26);
    b.fillStyle = '#b3a288'; b.fillRect(320, 22, 32, 12);
    b.fillStyle = '#7a6a52';
    for (var pp = 0; pp < 4; pp++) b.fillRect(322 + pp * 8, 18, 4, 6);

    /* ---- shelf of bottles -------------------------------------------- */
    b.fillStyle = '#3f2c21'; b.fillRect(292, 76, 92, 4);
    var cols = ['#7a4a2a', '#4a5a3a', '#6a5a2a', '#3a4a5a', '#5a3a3a'];
    for (var q = 0; q < 5; q++) {
      b.fillStyle = cols[q]; b.fillRect(298 + q * 17, 62, 9, 14);
      b.fillStyle = '#d8cbb4'; b.fillRect(300 + q * 17, 58, 5, 5);
    }

    /* ---- the lantern over the counter -------------------------------- */
    b.fillStyle = '#3f2c21'; b.fillRect(170, 0, 2, 8);
    var glow = 0.78 + Math.sin(frame / 33) * 0.05;
    b.fillStyle = 'rgba(240,168,72,' + glow + ')';
    b.beginPath(); b.ellipse(171, 18, 13, 10, 0, 0, 7); b.fill();
    b.fillStyle = 'rgba(255,228,175,.92)';
    b.beginPath(); b.ellipse(171, 17, 7, 5, 0, 0, 7); b.fill();
    b.fillStyle = '#c0872c'; b.fillRect(160, 26, 22, 2);
  }

  function counter(frame) {
    b.fillStyle = '#5f4130'; b.fillRect(0, 150, W, 13);
    b.fillStyle = '#764f39'; b.fillRect(0, 150, W, 3);
    b.fillStyle = '#3d2a20'; b.fillRect(0, 163, W, H - 163);
    b.fillStyle = '#33241b';
    for (var i = 0; i < 9; i++) b.fillRect(0, 170 + i * 6, W, 1);

    /* the pot, your side of the counter, on the left */
    b.fillStyle = '#4a4a52'; b.fillRect(14, 170, 48, 32);
    b.fillStyle = '#5c5c66'; b.fillRect(12, 166, 52, 6);
    b.fillStyle = '#70707a'; b.fillRect(14, 167, 48, 2);
    b.fillStyle = '#3c3c44'; b.fillRect(14, 186, 48, 2);
    b.globalAlpha = 0.32; b.fillStyle = '#e8ded0';
    for (var s = 0; s < 4; s++) {
      var t = (frame * 0.7 + s * 30) % 130;
      b.fillRect(22 + s * 11 + Math.sin(t / 11 + s) * 3, 164 - t * 0.26, 2, 3);
    }
    b.globalAlpha = 1;

    /* stacked bowls and the chopstick pot */
    b.fillStyle = '#e8e2d8';
    b.fillRect(88, 180, 28, 5); b.fillRect(90, 175, 24, 5); b.fillRect(92, 170, 20, 5);
    b.fillStyle = '#3d6d9a'; b.fillRect(88, 183, 28, 1); b.fillRect(90, 178, 24, 1);
    b.fillStyle = '#6a4a30'; b.fillRect(140, 172, 13, 18);
    b.fillStyle = '#c9a878';
    b.fillRect(142, 163, 2, 10); b.fillRect(146, 161, 2, 12); b.fillRect(149, 164, 2, 9);
    /* a folded cloth */
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

    /* Etsuko stands on your side, so the counter passes behind her */
    if (seats.some(function (s) { return s.id === 'etsuko'; }) === false) {
      drawPerson('etsuko', 336, 212, speaker === 'etsuko' || speaker === null, frame);
    }

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
  /* TITLE AND END CARDS — the street outside, before and after           */

  function street(canvas, dawn) {
    var c = canvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    var sky = c.createLinearGradient(0, 0, 0, H);
    if (dawn) { sky.addColorStop(0, '#2c3a56'); sky.addColorStop(0.6, '#7a6a72'); sky.addColorStop(1, '#c99a72'); }
    else { sky.addColorStop(0, '#0d1220'); sky.addColorStop(0.7, '#1b2436'); sky.addColorStop(1, '#2a2c34'); }
    c.fillStyle = sky; c.fillRect(0, 0, W, H);

    if (!dawn) {
      c.fillStyle = 'rgba(255,255,255,.55)';
      for (var i = 0; i < 40; i++) {
        c.fillRect((i * 79) % W, (i * 37) % 90, 1, 1);
      }
    }

    /* hills behind the town */
    c.fillStyle = dawn ? '#4a4250' : '#161d2a';
    c.beginPath(); c.moveTo(0, 118);
    c.lineTo(70, 84); c.lineTo(130, 112); c.lineTo(210, 72); c.lineTo(290, 108); c.lineTo(384, 86);
    c.lineTo(384, 216); c.lineTo(0, 216); c.closePath(); c.fill();

    /* the street */
    c.fillStyle = dawn ? '#5a5048' : '#171a20'; c.fillRect(0, 150, W, 66);

    /* buildings, most of them dark */
    function shop(x, w, h, lit) {
      c.fillStyle = lit ? '#3a2a22' : '#12161c';
      c.fillRect(x, 150 - h, w, h);
      c.fillStyle = lit ? '#4a362a' : '#0e1116';
      c.fillRect(x, 150 - h, w, 4);
      if (lit) {
        c.fillStyle = 'rgba(240,180,90,.85)'; c.fillRect(x + 5, 150 - h + 12, w - 10, h - 22);
        c.fillStyle = '#23364f'; c.fillRect(x + 4, 150 - h + 10, w - 8, 9);
      } else {
        c.fillStyle = '#1a1f26';
        for (var s = 0; s < 5; s++) c.fillRect(x + 4, 150 - h + 14 + s * 4, w - 8, 2);
      }
    }
    shop(14, 54, 66, false);
    shop(80, 40, 58, false);
    shop(136, 74, 78, true);      /* Etsuko's, the only light on the street */
    shop(224, 46, 60, false);
    shop(282, 56, 70, false);
    shop(348, 40, 54, false);

    /* the lit shop's glow on the road */
    var g = c.createRadialGradient(173, 150, 4, 173, 150, 90);
    g.addColorStop(0, 'rgba(240,180,90,.30)'); g.addColorStop(1, 'rgba(240,180,90,0)');
    c.fillStyle = g; c.fillRect(0, 110, W, 90);

    /* a single street lamp */
    c.fillStyle = '#2a2f38'; c.fillRect(300, 96, 2, 54);
    c.fillStyle = dawn ? 'rgba(200,200,200,.2)' : 'rgba(230,220,180,.35)';
    c.beginPath(); c.arc(301, 96, 9, 0, 7); c.fill();
  }

  /* ------------------------------------------------------------------ */

  global.Art = {
    init: function (canvas) {
      view = canvas; vctx = canvas.getContext('2d');
      Object.keys(LOOK).forEach(function (k, i) { blinkAt[k] = i * 37; });
    },
    setSeats: function (ids) {
      var xs = ids.length === 1 ? [118] : ids.length === 2 ? [74, 176] : [56, 140, 224];
      seats = ids.map(function (id, i) { return { id: id, x: xs[i] }; });
    },
    setSpeaker: function (id, e) { speaker = id || null; expr = e || 'neutral'; },
    setPhase: function (p) { phase = Math.max(0, Math.min(1, p)); },
    drawRoom: drawRoom,
    titleArt: function (c) { street(c, false); },
    endArt: function (c) { street(c, true); },
    hitTest: function (mx, my) {
      for (var i = 0; i < HOT.length; i++) {
        var r = HOT[i];
        if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return r.key;
      }
      return null;
    }
  };

}(window));
