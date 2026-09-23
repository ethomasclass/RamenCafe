/* ===========================================================================
   art.js — the shop, printed as a shin-hanga woodblock.

   Everything is drawn in code at 1280x720. There are no image files, and
   the style is chosen because its rules are ones code can follow well:

     1. INKS.   Every colour is a flat block from one small palette.
     2. BOKASHI. The only gradients are the smooth wipes a printer makes by
                hand on the block. Never noise, never airbrush.
     3. KEY.    A sumi line block printed on top, a hair out of register
                with the colour, which is most of what makes it read as a
                print rather than as vector art.
     4. WASHI.  All of it pressed onto paper: fibre, grain, uneven ink.

   The arcade outside is built in real one-point perspective (proj() below),
   so everything out there — shutters, signs, the vending machine standing
   at an angle, the bench, the cat — sits in one consistent space.

   Layers, back to front, each frame:
     backdrop (printed once)  — shop walls, the arcade, its fixed contents
     live alley               — lamp flicker, machine glow, rain, the cat
     noren                    — swaying, gusting when somebody comes in
     people                   — cached per face and expression
     counter (printed once)
     bowls on the counter, steam
     lantern light, the night going by, the paper itself

   If a PNG named in sprites.js exists it is drawn in place of the printed
   figure, so hand-made art can still arrive one face at a time.
   =========================================================================== */

(function (global) {
  'use strict';

  var W = 1280, H = 720;
  var view = null, vctx = null;
  var buf = mk(W, H), b = buf.getContext('2d');

  var INK = {
    sumi: '#1d1a17', sumiSoft: '#3a342d',
    indigo: '#1f3350', indigoDk: '#141f33', ai: '#2e4a6e',
    night: '#0e1522', nightLt: '#1a2539',
    washi: '#efe6d2', cream: '#e4d6b8', paper: '#f4ecdb',
    shu: '#c8402f', shuDk: '#9e2f22',
    ochre: '#e3a54a', lamp: '#f6d58c', lampHot: '#fff0c8',
    wood: '#5a3e2b', woodDk: '#3a281c', woodLt: '#7a5638', wall: '#3a2a1f',
    cold: '#bfe3f2', coldDk: '#7fb6d0', steel: '#8fa6b8',
    nori: '#1f2a26'
  };

  /* ------------------------------------------------------------------ */
  /* PRINTING TOOLS                                                     */

  function mk(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  /* seeded, so the same print comes off the block every time */
  var seed = 11;
  function R() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function reseed(n) { seed = n; }

  var MIS = { x: 1.8, y: 1.1 };   /* colour sits this far off the key block */

  function block(x, path, col) {
    x.save(); x.translate(MIS.x, MIS.y); x.fillStyle = col; x.beginPath(); path(); x.fill(); x.restore();
  }
  function key(x, path, w, col, a) {
    x.save(); x.globalAlpha = a == null ? 1 : a; x.strokeStyle = col || INK.sumi; x.lineWidth = w || 2.2;
    x.lineJoin = 'round'; x.lineCap = 'round'; x.beginPath(); path(); x.stroke(); x.restore();
  }
  function both(x, path, col, w, kcol) { block(x, path, col); key(x, path, w, kcol); }
  function bok(x, x0, y0, x1, y1, stops) {
    var g = x.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(function (s) { g.addColorStop(s[0], s[1]); }); return g;
  }
  function glow(x, cx, cy, r, col, a) {
    var g = x.createRadialGradient(cx, cy, 1, cx, cy, r);
    g.addColorStop(0, 'rgba(' + col + ',' + a + ')'); g.addColorStop(1, 'rgba(' + col + ',0)');
    x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2);
  }
  function poly(x, pts) { x.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) x.lineTo(pts[i][0], pts[i][1]); x.closePath(); }
  function rr(x, a, c, w, h) { x.rect(a, c, w, h); }

  /* woodgrain: long wavering lines, clipped to whatever path is given */
  function grain(x, clip, col, n, span, amp, horiz, from) {
    x.save(); x.beginPath(); clip(); x.clip();
    x.strokeStyle = col; x.lineWidth = 1;
    for (var i = 0; i < n; i++) {
      x.globalAlpha = .16 + R() * .24; x.beginPath();
      var off = (from || 0) + R() * span, ph = R() * 6, fr = .004 + R() * .01;
      for (var t = -20; t <= (horiz ? W : H) + 20; t += 8) {
        var wv = Math.sin(t * fr + ph) * amp + Math.sin(t * fr * 3.1 + ph) * amp * .35;
        if (horiz) x.lineTo(t, off + wv); else x.lineTo(off + wv, t);
      }
      x.stroke();
    }
    x.restore();
  }

  function jp(size, weight) {
    return (weight || 700) + ' ' + size + 'px "Shippori Mincho","Hiragino Mincho ProN","Yu Mincho","Noto Serif CJK JP",serif';
  }

  /* ------------------------------------------------------------------ */
  /* THE ARCADE'S SPACE                                                 */
  /*                                                                    */
  /* Metres. X across (walls at +-3), Y up (roof at 4), Z away from you. */
  /* You sit at the counter with your eye 1.2 m up; the arcade's far end */
  /* is 40 m down. The shop front itself is about 1.5 m in front of you. */

  var CAM = { vx: 690, hz: 250, f: 520, y: 1.2 };
  function proj(X, Y, Z) { return [CAM.vx + CAM.f * X / Z, CAM.hz + CAM.f * (CAM.y - Y) / Z]; }
  function pq(pts) { return pts.map(function (p) { return proj(p[0], p[1], p[2]); }); }

  /* the opening in the shop front, in screen space */
  var OX = 250, OY = 30, OW = 790, OB = 470;

  /* ------------------------------------------------------------------ */
  /* THE VENDING MACHINE — standing at an angle to the right wall, the  */
  /* way they do, facing back up the arcade toward the shop.            */

  var VM = (function () {
    var phi = -50 * Math.PI / 180;                       /* face edge angle in XZ */
    var u = [Math.cos(phi), Math.sin(phi)];              /* along the face, left to right */
    var n = [u[1], -u[0]];                               /* outward normal */
    var p0 = [1.72, 5.9];                                /* front-left foot */
    return { u: u, n: n, p0: p0, w: 1.0, d: 0.72, h: 1.83 };
  }());
  /* a point on the machine's face: s across (0..1), yM up in metres, out = metres proud of the face */
  function vmFace(s, yM, out) {
    var X = VM.p0[0] + VM.u[0] * VM.w * s + VM.n[0] * (out || 0);
    var Z = VM.p0[1] + VM.u[1] * VM.w * s + VM.n[1] * (out || 0);
    return proj(X, yM, Z);
  }
  function vmSide(dz, yM) {  /* the right-hand side panel: dz 0..1 into the depth */
    var X = VM.p0[0] + VM.u[0] * VM.w - VM.n[0] * VM.d * dz;
    var Z = VM.p0[1] + VM.u[1] * VM.w - VM.n[1] * VM.d * dz;
    return proj(X, yM, Z);
  }
  function faceQuad(s0, y0, s1, y1, out) {
    return [vmFace(s0, y0, out), vmFace(s1, y0, out), vmFace(s1, y1, out), vmFace(s0, y1, out)];
  }

  /* ------------------------------------------------------------------ */
  /* STATE                                                              */

  var seats = [];            /* [{id, x}] */
  var bowls = {};            /* id -> {broth, tops} served and in front of them */
  var speaker = null, expr = 'neutral';
  var phase = 0;             /* 0 early evening .. 1 closing time */
  var gust = 0;              /* the noren, when somebody comes in */
  var waiting = false;       /* somebody on the bench, not coming in yet */
  var blinkAt = {};
  var backdrop = null, counterLayer = null, paperMul = null, paperScr = null, vignette = null;

  /* ------------------------------------------------------------------ */
  /* 1. THE ARCADE — printed once                                       */

  var SIGNS_L = [
    { z: 5.2, t: '中野鮮魚', col: '#3b4a52' },
    { z: 9.5, t: '書店',     col: '#3d3642' },
    { z: 14,  t: '薬',       col: '#2f4a44' },
    { z: 20,  t: '茶舗',     col: '#4a3a30' },
    { z: 28,  t: '酒',       col: '#3a3a4a' }
  ];
  var SIGNS_R = [
    { z: 10.5, t: '洋品', col: '#443a48' },
    { z: 15,   t: '写真', col: '#34424e' },
    { z: 21,   t: 'パン', col: '#4c3e2e' },
    { z: 29,   t: '理容', col: '#3a4450' }
  ];

  function arcade(x) {
    reseed(29);
    x.save(); x.beginPath(); x.rect(OX, OY, OW, OB - OY); x.clip();

    /* the dark, wiped down toward the damp ground */
    x.fillStyle = bok(x, 0, OY, 0, OB, [[0, INK.night], [.5, '#172237'], [1, '#222f45']]);
    x.fillRect(OX, OY, OW, OB - OY);

    /* the far end: the arcade opens onto a street, and it is raining there */
    var e = pq([[-3, 0, 40], [3, 0, 40], [3, 4, 40], [-3, 4, 40]]);
    both(x, function () { poly(x, e); }, '#1d2c45', 1.2, '#0a0f18');
    block(x, function () { rr(x, e[0][0] + 12, e[2][1] + 10, 7, 9); }, 'rgba(246,213,140,.7)');
    block(x, function () { rr(x, e[0][0] + 44, e[2][1] + 18, 6, 8); }, 'rgba(246,213,140,.45)');
    for (var fr = 0; fr < 26; fr++) {
      var rx = e[0][0] + R() * (e[1][0] - e[0][0]), ry = e[2][1] + R() * (e[0][1] - e[2][1]);
      key(x, function () { x.moveTo(rx, ry); x.lineTo(rx - 2, ry + 7); }, .8, '#9fb4cc', .35);
    }

    /* --- the floor: tiles running away from you --------------------- */
    x.fillStyle = bok(x, 0, 262, 0, OB, [[0, '#1b2638'], [1, '#27344a']]);
    x.beginPath(); poly(x, pq([[-3, 0, 3.4], [3, 0, 3.4], [3, 0, 40], [-3, 0, 40]])); x.fill();
    for (var tz = 4; tz < 40; tz += (tz < 12 ? 1 : 2)) {
      (function (tz) {
        var a = proj(-3, 0, tz), c = proj(3, 0, tz);
        key(x, function () { x.moveTo(a[0], a[1]); x.lineTo(c[0], c[1]); }, 1, '#0d1420', .45);
      }(tz));
    }
    [-2, -1, 0, 1, 2].forEach(function (tx) {
      var a = proj(tx, 0, 3.4), c = proj(tx, 0, 40);
      key(x, function () { x.moveTo(a[0], a[1]); x.lineTo(c[0], c[1]); }, 1, '#0d1420', .4);
    });

    /* --- the walls, and the shops along them ------------------------ */
    [-1, 1].forEach(function (side) {
      var X = 3 * side;
      /* the wall plane itself */
      block(x, function () { poly(x, pq([[X, 0, 3.4], [X, 4, 3.4], [X, 4, 40], [X, 0, 40]])); }, side < 0 ? '#1c2638' : '#192233');
      /* frontages, three metres each */
      for (var z = 3.5; z < 38; z += 3) {
        (function (z0, z1, k) {
          var fascia = pq([[X, 2.4, z0], [X, 3.1, z0], [X, 3.1, z1], [X, 2.4, z1]]);
          block(x, function () { poly(x, fascia); }, ['#2a3244', '#2e2b38', '#26343a', '#332c2c'][k % 4]);
          /* the shutter */
          var sh = pq([[X, 0, z0 + .15], [X, 2.35, z0 + .15], [X, 2.35, z1 - .15], [X, 0, z1 - .15]]);
          block(x, function () { poly(x, sh); }, k % 3 === 1 ? '#2d3645' : '#283142');
          /* corrugations: lines of constant height, so they run to the vanishing point */
          for (var yy = .12; yy < 2.35; yy += (z0 < 10 ? .09 : .16)) {
            (function (yy) {
              var p = proj(X, yy, z0 + .15), q = proj(X, yy, z1 - .15);
              key(x, function () { x.moveTo(p[0], p[1]); x.lineTo(q[0], q[1]); }, z0 < 8 ? 1 : .8, '#131a26', .55);
            }(yy));
          }
          key(x, function () { poly(x, sh); }, 1.2, '#0b1019', .8);
          /* the pillar between frontages */
          var pl = pq([[X, 0, z0 - .08], [X, 3.1, z0 - .08], [X, 3.1, z0 + .1], [X, 0, z0 + .1]]);
          block(x, function () { poly(x, pl); }, '#141b27');
        }(z, z + 3, Math.round(z)));
      }
    });

    /* the yellowed notice on Nakano's shutter */
    var nt = pq([[-3, 1.25, 4.6], [-3, 1.62, 4.6], [-3, 1.62, 5.05], [-3, 1.25, 5.05]]);
    both(x, function () { poly(x, nt); }, '#a39a74', 1, '#3a3624');
    for (var nl = 0; nl < 4; nl++) {
      (function (nl) {
        var p = proj(-3, 1.55 - nl * .07, 4.66), q = proj(-3, 1.55 - nl * .07, 4.98);
        key(x, function () { x.moveTo(p[0], p[1]); x.lineTo(q[0], q[1]); }, 1, '#5a5436', .7);
      }(nl));
    }

    /* --- the roof: arches every four metres, translucent panels ------- */
    for (var az = 4; az <= 40; az += 4) {
      (function (az) {
        var pts = [];
        for (var a = 0; a <= 16; a++) {
          var t = a / 16 * Math.PI;
          pts.push(proj(-3 * Math.cos(t), 3.9 + Math.sin(t) * .9, az));
        }
        key(x, function () { x.moveTo(pts[0][0], pts[0][1]); pts.forEach(function (p) { x.lineTo(p[0], p[1]); }); }, az < 12 ? 3 : 2, '#070b12', .95);
      }(az));
    }
    /* the spine of the roof */
    var s0 = proj(0, 4.8, 4), s1 = proj(0, 4.8, 40);
    key(x, function () { x.moveTo(s0[0], s0[1]); x.lineTo(s1[0], s1[1]); }, 2, '#070b12');

    /* --- hanging signs, perpendicular to the walls, facing you ------- */
    function hanging(list, side) {
      list.forEach(function (sg) {
        var X0 = 3 * side, X1 = 2.15 * side;
        var a = proj(Math.min(X0, X1), 3.55, sg.z), c = proj(Math.max(X0, X1), 1.75, sg.z);
        var sx = a[0], sy = a[1], sw = c[0] - a[0], shh = c[1] - a[1];
        /* the bracket */
        var br = proj(X0, 3.7, sg.z), br2 = proj(X1, 3.7, sg.z);
        key(x, function () { x.moveTo(br[0], br[1]); x.lineTo(br2[0], br2[1]); x.moveTo(br2[0], br2[1]); x.lineTo(br2[0], sy); }, Math.max(1, 3.4 / sg.z * 4), '#070b12');
        both(x, function () { rr(x, sx, sy, sw, shh); }, sg.col, Math.max(1, 6 / sg.z), '#0a0e16');
        /* the lettering, long faded */
        var fs = Math.min(sw * .72, shh / (sg.t.length + .6));
        x.save(); x.globalAlpha = .42; x.fillStyle = '#d9d0bc'; x.font = jp(Math.max(6, fs));
        x.textAlign = 'center'; x.textBaseline = 'middle';
        for (var i = 0; i < sg.t.length; i++) x.fillText(sg.t[i], sx + sw / 2 + MIS.x, sy + shh * (i + .8) / (sg.t.length + .6));
        x.restore();
      });
    }
    hanging(SIGNS_L, -1);
    hanging(SIGNS_R, 1);

    /* a barber's pole on the far right, stopped */
    var bp = proj(2.9, 2.3, 28.5), bq = proj(2.9, 1.4, 28.5);
    both(x, function () { rr(x, bp[0] - 3, bp[1], 6, bq[1] - bp[1]); }, '#d8d2c6', 1, '#0a0e16');
    key(x, function () { for (var i = 0; i < 5; i++) { x.moveTo(bp[0] - 3, bp[1] + i * 4); x.lineTo(bp[0] + 3, bp[1] + i * 4 + 4); } }, 1.2, INK.shu, .8);

    /* the cable the lamps hang from, sagging between arches */
    var ca = proj(-3, 3.5, 9), cb = proj(3, 3.4, 30), cm = proj(0, 3.0, 18);
    key(x, function () { x.moveTo(ca[0], ca[1]); x.quadraticCurveTo(cm[0], cm[1] + 10, cb[0], cb[1]); }, 1.2, '#070b12', .8);

    /* --- the bench: against the left wall, facing the machine across the way */
    var benchZ0 = 5.3, benchZ1 = 6.9, bxI = -2.05, bxO = -2.5;
    var seat = pq([[bxI, .44, benchZ0], [bxO, .44, benchZ0], [bxO, .44, benchZ1], [bxI, .44, benchZ1]]);
    both(x, function () { poly(x, seat); }, '#2c3441', 1.4, '#080c13');
    var back = pq([[bxO, .5, benchZ0], [bxO, .9, benchZ0], [bxO, .9, benchZ1], [bxO, .5, benchZ1]]);
    both(x, function () { poly(x, back); }, '#262e3a', 1.2, '#080c13');
    [[bxI, benchZ0], [bxI, benchZ1], [bxO, benchZ0], [bxO, benchZ1]].forEach(function (lg) {
      var p = proj(lg[0], .44, lg[1]), q = proj(lg[0], 0, lg[1]);
      key(x, function () { x.moveTo(p[0], p[1]); x.lineTo(q[0], q[1]); }, 1.6, '#080c13');
    });

    /* --- the recycling bin beside the machine ------------------------- */
    var bn = { x0: 1.18, x1: 1.62, z: 5.55, h: .82 };
    var binF = pq([[bn.x0, 0, bn.z], [bn.x1, 0, bn.z], [bn.x1, bn.h, bn.z], [bn.x0, bn.h, bn.z]]);
    var binS = pq([[bn.x1, 0, bn.z], [bn.x1, 0, bn.z + .4], [bn.x1, bn.h, bn.z + .4], [bn.x1, bn.h, bn.z]]);
    x.save(); x.globalAlpha = .5; x.fillStyle = '#05080d'; x.beginPath();
    poly(x, pq([[bn.x0 - .05, 0, bn.z - .05], [bn.x1 + .05, 0, bn.z - .05], [bn.x1 + .05, 0, bn.z + .45], [bn.x0 - .05, 0, bn.z + .45]])); x.fill(); x.restore();
    both(x, function () { poly(x, binS); }, '#2d4a6a', 1.2);
    both(x, function () { poly(x, binF); }, '#3a6ea8', 1.4);
    var hole = proj((bn.x0 + bn.x1) / 2, .62, bn.z);
    both(x, function () { x.ellipse(hole[0], hole[1], 8, 7, 0, 0, 7); }, '#0b0f15', 1);
    var lab = proj(bn.x0 + .05, .38, bn.z), lab2 = proj(bn.x1 - .05, .22, bn.z);
    block(x, function () { rr(x, lab[0], lab[1], lab2[0] - lab[0], lab2[1] - lab[1]); }, '#e8edf2');
    x.save(); x.fillStyle = INK.sumi; x.font = jp(9, 500); x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('あきかん', (lab[0] + lab2[0]) / 2 + MIS.x, (lab[1] + lab2[1]) / 2 + MIS.y); x.restore();

    vendingMachine(x);

    x.restore();
  }

  /* ------------------------------------------------------------------ */
  /* THE VENDING MACHINE, IN DETAIL                                     */

  var PRODUCTS = [
    /* row, slot, shape, body colour, cap/band colour, hot? */
    [0, 0, 'pet', '#d9ecf2', '#3a8ad0'], [0, 1, 'pet', '#f0d66a', '#d64a2a'], [0, 2, 'pet', '#c9e4c0', '#2f7a44'],
    [0, 3, 'pet', '#f3eee4', '#2f5f8f'], [0, 4, 'pet', '#e6c79a', '#8a5a2a'], [0, 5, 'pet', '#d9ecf2', '#3a8ad0'],
    [1, 0, 'can', '#2f5f8f', '#e4e8ec'], [1, 1, 'can', '#c8402f', '#f1e9dc'], [1, 2, 'can', '#e0a92c', '#2a2a2a'],
    [1, 3, 'can', '#2f7a44', '#f1e9dc'], [1, 4, 'can', '#6b3a2a', '#e0a92c'], [1, 5, 'can', '#1f3350', '#c8402f'],
    [2, 0, 'bot', '#e9e4da', '#4a8a5a'], [2, 1, 'bot', '#a3432e', '#e0a92c'], [2, 2, 'bot', '#2a2a2a', '#c8402f'],
    [2, 3, 'can', '#7a4a2a', '#f1e9dc', 1], [2, 4, 'can', '#3d2a1f', '#e0a92c', 1], [2, 5, 'bot', '#dcd2bd', '#6a3a8a']
  ];

  function vendingMachine(x) {
    /* its shadow on the tiles */
    var foot = [vmFace(-.05, 0, .08), vmFace(1.05, 0, .08), vmSide(1.1, 0), vmSide(-.1, 0)];
    x.save(); x.globalAlpha = .55; x.fillStyle = '#05080d'; x.beginPath(); poly(x, foot); x.fill(); x.restore();
    var face = faceQuad(0, 0, 1, VM.h);
    var side = [vmSide(0, 0), vmSide(1, 0), vmSide(1, VM.h), vmSide(0, VM.h)];

    /* the side panel: a big livery stripe, no brand */
    both(x, function () { poly(x, side); }, '#1d3b66', 1.6, '#060a10');
    var st = [vmSide(0, .55), vmSide(1, .55), vmSide(1, 1.05), vmSide(0, 1.05)];
    block(x, function () { poly(x, st); }, '#e8edf2');
    var st2 = [vmSide(0, 1.05), vmSide(1, 1.05), vmSide(1, 1.14), vmSide(0, 1.14)];
    block(x, function () { poly(x, st2); }, INK.shu);

    /* the cabinet front */
    both(x, function () { poly(x, face); }, '#e7ebee', 2, '#060a10');
    x.save(); x.beginPath(); poly(x, face); x.clip();
    var ft = vmFace(.5, VM.h), fb = vmFace(.5, 0);
    x.fillStyle = bok(x, 0, ft[1], 0, fb[1], [[0, 'rgba(0,0,0,0)'], [.5, 'rgba(0,0,0,0)'], [1, 'rgba(10,20,34,.35)']]);
    x.fillRect(0, 0, W, H); x.restore();
    /* header panel */
    both(x, function () { poly(x, faceQuad(0, 1.64, 1, 1.83)); }, '#1d3b66', 1.2, '#060a10');
    var hd = vmFace(.5, 1.735);
    x.save(); x.fillStyle = '#eef2f5'; x.font = jp(9, 700); x.textAlign = 'center'; x.textBaseline = 'middle';
    x.translate(hd[0] + MIS.x, hd[1]); x.transform(1, (vmFace(1, 1.735)[1] - vmFace(0, 1.735)[1]) / (vmFace(1, 1.735)[0] - vmFace(0, 1.735)[0]), 0, 1, 0, 0);
    x.fillText('つめた〜い', 0, 0); x.restore();

    /* the lit display window */
    var win = faceQuad(.05, .98, .95, 1.6, .01);
    block(x, function () { poly(x, win); }, INK.cold);
    x.save(); x.beginPath(); poly(x, win); x.clip();
    var top = vmFace(.5, 1.6), bot = vmFace(.5, .98);
    x.fillStyle = bok(x, 0, top[1], 0, bot[1], [[0, 'rgba(255,255,255,.75)'], [1, 'rgba(255,255,255,.05)']]);
    x.fillRect(0, 0, W, H);
    /* three shelves of samples */
    PRODUCTS.forEach(function (pr) {
      var row = pr[0], slot = pr[1], shape = pr[2], body = pr[3], cap = pr[4];
      var s0 = .09 + slot * .142, s1 = s0 + .1;
      var yb = 1.39 - row * .19 + .005;           /* shelf top, metres */
      var hgt = shape === 'pet' ? .165 : shape === 'bot' ? .145 : .115;
      var sm = (s0 + s1) / 2;
      var outline;
      if (shape === 'can') {
        outline = [vmFace(s0, yb, .02), vmFace(s1, yb, .02), vmFace(s1, yb + hgt, .02), vmFace(s0, yb + hgt, .02)];
      } else {
        var neck = shape === 'pet' ? .028 : .022;
        outline = [vmFace(s0, yb, .02), vmFace(s1, yb, .02), vmFace(s1, yb + hgt * .66, .02),
                   vmFace(sm + neck, yb + hgt * .86, .02), vmFace(sm + neck, yb + hgt, .02),
                   vmFace(sm - neck, yb + hgt, .02), vmFace(sm - neck, yb + hgt * .86, .02), vmFace(s0, yb + hgt * .66, .02)];
      }
      both(x, function () { poly(x, outline); }, body, .9, '#243040');
      /* the label band */
      var band = [vmFace(s0, yb + hgt * .28, .021), vmFace(s1, yb + hgt * .28, .021), vmFace(s1, yb + hgt * .5, .021), vmFace(s0, yb + hgt * .5, .021)];
      block(x, function () { poly(x, band); }, cap);
      /* a highlight down the left of every can: they are lit from behind the glass */
      var hl = [vmFace(s0 + .012, yb + .01, .022), vmFace(s0 + .026, yb + .01, .022), vmFace(s0 + .026, yb + hgt * .6, .022), vmFace(s0 + .012, yb + hgt * .6, .022)];
      block(x, function () { poly(x, hl); }, 'rgba(255,255,255,.55)');
      /* price tag and button under each */
      var pt = [vmFace(s0, yb - .045, .01), vmFace(s1, yb - .045, .01), vmFace(s1, yb - .01, .01), vmFace(s0, yb - .01, .01)];
      block(x, function () { poly(x, pt); }, '#1a1f26');
      var bt = vmFace(sm, yb - .028, .012);
      block(x, function () { x.ellipse(bt[0], bt[1], 1.6, 1.3, 0, 0, 7); }, pr[5] ? '#ff6a4a' : '#6fd0ff');
    });
    /* the shelf lips */
    [1.39, 1.2, 1.01].forEach(function (yy) {
      var p = vmFace(.05, yy, .01), q = vmFace(.95, yy, .01);
      key(x, function () { x.moveTo(p[0], p[1]); x.lineTo(q[0], q[1]); }, 1.1, '#5a6a7a', .8);
    });
    x.restore();
    key(x, function () { poly(x, win); }, 1.5, '#060a10');

    /* the hot row is labelled in red: あったか〜い — even in August, two cans of coffee stay hot */
    var hotL = faceQuad(.56, .975, .95, 1.0, .015);
    block(x, function () { poly(x, hotL); }, INK.shu);

    /* the control panel: IC reader, coin slot, note slot, a little display */
    both(x, function () { poly(x, faceQuad(.05, .74, .95, .93)); }, '#cfd6dc', 1, '#3a4450');
    both(x, function () { poly(x, faceQuad(.1, .79, .3, .89, .005)); }, '#2a8a9a', .8, '#0a1a20');  /* IC card pad */
    both(x, function () { poly(x, faceQuad(.62, .83, .7, .9, .005)); }, '#2a2f36', .8);            /* coin slot */
    both(x, function () { poly(x, faceQuad(.74, .84, .92, .87, .005)); }, '#1a1f26', .8);          /* note slot */
    both(x, function () { poly(x, faceQuad(.4, .8, .56, .86, .005)); }, '#0e2a18', .8);            /* display */
    var dg = vmFace(.48, .83, .006);
    x.save(); x.fillStyle = '#7dff9a'; x.font = '600 7px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('0', dg[0], dg[1]); x.restore();
    both(x, function () { poly(x, faceQuad(.72, .76, .84, .79, .005)); }, '#9aa4ae', .6);             /* coin return */

    /* the take-out flap, and the kick plate */
    both(x, function () { poly(x, faceQuad(.08, .14, .92, .36, .004)); }, '#1b2027', 1.3, '#060a10');
    block(x, function () { poly(x, faceQuad(.1, .3, .9, .35, .006)); }, '#343b45');
    block(x, function () { poly(x, faceQuad(0, 0, 1, .09, .003)); }, '#2b3440');
  }

  /* ------------------------------------------------------------------ */
  /* 2. THE SHOP AROUND THE OPENING — printed once                      */

  function shop(x) {
    reseed(41);
    /* walls either side */
    [[0, OX - 22], [OX + OW + 22, W]].forEach(function (s) {
      block(x, function () { rr(x, s[0], 0, s[1] - s[0], 500); }, INK.wall);
      grain(x, function () { rr(x, s[0] + MIS.x, MIS.y, s[1] - s[0], 500); }, '#1f150f', 34, s[1] - s[0], 2, false, s[0]);
    });
    /* posts and lintel */
    [[OX - 22, 0, 22, 500], [OX + OW, 0, 22, 500], [OX - 22, 0, OW + 44, 32]].forEach(function (r) {
      block(x, function () { rr(x, r[0], r[1], r[2], r[3]); }, INK.wood);
      grain(x, function () { rr(x, r[0] + MIS.x, r[1] + MIS.y, r[2], r[3]); }, INK.woodDk, 12, r[2] > r[3] ? r[3] : r[2], 1.5, r[2] > r[3], r[2] > r[3] ? r[1] : r[0]);
      key(x, function () { rr(x, r[0], r[1], r[2], r[3]); }, 2);
    });

    /* menu tanzaku */
    ['醤油', '味噌', '塩', '豚骨'].forEach(function (m, i) {
      var mx = 22 + i * 52;
      both(x, function () { rr(x, mx, 150, 40, 150); }, INK.washi, 1.6);
      x.save(); x.fillStyle = INK.sumi; x.font = jp(26); x.textAlign = 'center';
      for (var k = 0; k < m.length; k++) x.fillText(m[k], mx + 20 + MIS.x, 190 + k * 32);
      x.restore();
      block(x, function () { x.arc(mx + 20, 286, 5, 0, 7); }, INK.shu);
    });

    /* the calendar: half the squares have a name written in */
    both(x, function () { rr(x, 46, 326, 112, 124); }, INK.washi, 1.8);
    block(x, function () { rr(x, 46, 326, 112, 26); }, INK.shu);
    x.save(); x.fillStyle = INK.washi; x.font = jp(15); x.textAlign = 'center'; x.fillText('八月', 102 + MIS.x, 345); x.restore();
    for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) {
      (function (r, c) {
        var cx = 55 + c * 16, cy = 360 + r * 21;
        block(x, function () { rr(x, cx, cy, 11, 11); }, '#d8ceb8');
        if ((r * 6 + c) % 3 === 0) key(x, function () { x.moveTo(cx + 2, cy + 7); x.lineTo(cx + 9, cy + 4); }, 1.2, INK.shu, .9);
      }(r, c));
    }

    /* the photograph from opening day, 1984 */
    both(x, function () { rr(x, 1090, 70, 150, 110); }, INK.cream, 1.8);
    block(x, function () { rr(x, 1102, 82, 126, 86); }, '#8d7c63');
    block(x, function () { rr(x, 1102, 130, 126, 38); }, '#a89678');
    for (var p = 0; p < 6; p++) block(x, function () { x.arc(1116 + p * 20, 118, 6.5, 0, 7); x.rect(1111 + p * 20, 123, 11, 16); }, '#5f513f');
    key(x, function () { x.moveTo(1102, 82); x.lineTo(1228, 82); }, 1, INK.sumi, .3);

    /* shelf and bottles */
    both(x, function () { rr(x, 1070, 330, 210, 10); }, INK.wood, 1.6);
    ['#7a4a2a', '#4a5a3a', '#6a5a2a', INK.indigo, '#5a3a3a'].forEach(function (c, i) {
      var bx = 1090 + i * 38;
      both(x, function () { x.rect(bx, 272, 22, 58); x.rect(bx + 6, 256, 10, 18); }, c, 1.4);
      block(x, function () { rr(x, bx + 3, 288, 16, 20); }, INK.washi);
    });
    /* a maneki-neko on the shelf end, paw up, as they always are */
    both(x, function () { x.ellipse(1250, 312, 14, 17, 0, 0, 7); }, '#f3ede2', 1.4);
    both(x, function () { x.arc(1250, 290, 11, 0, 7); }, '#f3ede2', 1.4);
    both(x, function () { x.ellipse(1262, 280, 4, 7, .3, 0, 7); }, '#f3ede2', 1.2);
    block(x, function () { rr(x, 1242, 299, 16, 3); }, INK.shu);
    block(x, function () { x.arc(1250, 304, 3, 0, 7); }, INK.ochre);
    key(x, function () { x.moveTo(1245, 289); x.lineTo(1248, 289); x.moveTo(1252, 289); x.lineTo(1255, 289); }, 1.2);

    /* the lantern hanging in the corner, lit by itself */
    key(x, function () { x.moveTo(112, 0); x.lineTo(112, 24); }, 2);
    block(x, function () { x.ellipse(112, 72, 34, 48, 0, 0, 7); }, INK.shu);
    x.fillStyle = bok(x, 78, 0, 146, 0, [[0, 'rgba(255,200,120,0)'], [.45, 'rgba(255,215,150,.78)'], [1, 'rgba(255,200,120,0)']]);
    x.beginPath(); x.ellipse(112 + MIS.x, 72 + MIS.y, 34, 48, 0, 0, 7); x.fill();
    key(x, function () { x.ellipse(112, 72, 34, 48, 0, 0, 7); }, 2.2);
    for (var k = -3; k <= 3; k++) (function (k) {
      key(x, function () { x.ellipse(112, 72 + k * 12, Math.sqrt(1 - Math.pow(k * 12 / 48, 2)) * 34, 3, 0, 0, Math.PI); }, 1, INK.sumi, .45);
    }(k));
    block(x, function () { rr(x, 94, 20, 36, 8); rr(x, 94, 116, 36, 8); }, INK.sumi);
    x.save(); x.fillStyle = INK.sumi; x.font = jp(30); x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('悦', 112 + MIS.x, 74); x.restore();
  }

  /* ------------------------------------------------------------------ */
  /* 3. THE COUNTER — printed once                                      */

  function counter(x) {
    reseed(53);
    block(x, function () { rr(x, 0, 470, W, 30); }, INK.woodLt);
    block(x, function () { rr(x, 0, 500, W, 220); }, INK.wood);
    grain(x, function () { rr(x, MIS.x, 470 + MIS.y, W, 30); }, INK.woodDk, 12, 30, 2, true, 470);
    grain(x, function () { rr(x, MIS.x, 500 + MIS.y, W, 220); }, INK.woodDk, 70, 220, 6, true, 500);
    grain(x, function () { rr(x, MIS.x, 500 + MIS.y, W, 220); }, INK.woodLt, 26, 220, 4, true, 500);
    key(x, function () { x.moveTo(0, 470); x.lineTo(W, 470); x.moveTo(0, 500); x.lineTo(W, 500); }, 2.6);
    key(x, function () { x.moveTo(0, 612); x.lineTo(W, 612); }, 1.4, INK.woodDk, .8);
    /* your side of it: the stock pot, the stacked bowls, the chopstick pot */
    both(x, function () { rr(x, 24, 560, 150, 130); }, '#4a4e57', 2.2);
    both(x, function () { rr(x, 16, 548, 166, 16); }, '#5c616b', 2);
    block(x, function () { rr(x, 30, 600, 138, 6); }, '#3a3e46');
    x.fillStyle = bok(x, 24, 0, 174, 0, [[0, 'rgba(255,255,255,0)'], [.25, 'rgba(255,255,255,.14)'], [.4, 'rgba(255,255,255,0)']]);
    x.fillRect(24 + MIS.x, 560, 150, 130);
    [0, 1, 2].forEach(function (i) {
      both(x, function () {
        x.moveTo(1030 - i * 4, 640 - i * 22); x.lineTo(1170 + i * 4, 640 - i * 22);
        x.quadraticCurveTo(1160 + i * 4, 668 - i * 22, 1130, 672 - i * 22); x.lineTo(1070, 672 - i * 22);
        x.quadraticCurveTo(1040 - i * 4, 668 - i * 22, 1030 - i * 4, 640 - i * 22);
      }, '#ede4d2', 1.8);
      block(x, function () { rr(x, 1044 - i * 3, 648 - i * 22, 112 + i * 6, 5); }, INK.shu);
    });
    /* a ladle hooked over the rim of the pot */
    key(x, function () { x.moveTo(150, 552); x.quadraticCurveTo(190, 500, 236, 470); }, 5, '#8a8f98');
    key(x, function () { x.moveTo(150, 552); x.quadraticCurveTo(190, 500, 236, 470); }, 1, INK.sumi, .8);
    both(x, function () { x.ellipse(144, 566, 18, 8, 0, 0, 7); }, '#6f747d', 1.4);

    /* the cutting board: scallions done, the knife put down square */
    both(x, function () { x.moveTo(300, 606); x.lineTo(560, 598); x.lineTo(572, 672); x.lineTo(308, 684); x.closePath(); }, '#c9a878', 2);
    grain(x, function () { x.moveTo(300 + MIS.x, 606 + MIS.y); x.lineTo(560, 598); x.lineTo(572, 672); x.lineTo(308, 684); x.closePath(); }, '#9a7a4e', 14, 90, 1.5, true, 598);
    for (var sc2 = 0; sc2 < 60; sc2++) {
      (function () {
        var nx = 330 + R() * 90, ny = 620 + R() * 40;
        both(x, function () { x.arc(nx, ny, 3.2, 0, 7); }, sc2 % 5 ? '#8fbf5a' : '#e2f0c8', .8, '#3a5a20');
      }());
    }
    both(x, function () { x.moveTo(440, 648); x.lineTo(546, 636); x.lineTo(548, 646); x.lineTo(442, 660); x.closePath(); }, '#c9d2da', 1.4);
    both(x, function () { x.moveTo(546, 636); x.lineTo(600, 630); x.lineTo(602, 642); x.lineTo(548, 646); x.closePath(); }, INK.woodDk, 1.4);
    /* a folded indigo tenugui */
    both(x, function () { x.moveTo(620, 640); x.lineTo(720, 632); x.lineTo(724, 668); x.lineTo(624, 676); x.closePath(); }, INK.indigo, 1.8);
    key(x, function () { for (var i = 0; i < 5; i++) { x.moveTo(630 + i * 20, 640); x.lineTo(634 + i * 20, 672); } }, 1, '#e8e2d4', .5);

    /* the condiment tray on the customers' ledge: shichimi, pepper, soy, garlic, pickled ginger */
    both(x, function () { x.rect(930, 460, 150, 12); }, INK.woodDk, 1.6);
    both(x, function () { x.moveTo(944, 460); x.lineTo(944, 424); x.quadraticCurveTo(952, 412, 960, 424); x.lineTo(960, 460); x.closePath(); }, '#e8dcc4', 1.4);
    both(x, function () { x.rect(944, 418, 16, 8); }, INK.shu, 1.2);
    both(x, function () { x.rect(972, 426, 18, 34); }, '#efe8da', 1.4);
    both(x, function () { x.rect(972, 420, 18, 7); }, '#9aa2aa', 1.2);
    both(x, function () { x.moveTo(1000, 460); x.lineTo(1000, 432); x.quadraticCurveTo(1010, 418, 1020, 432); x.lineTo(1020, 460); x.closePath(); }, 'rgba(120,70,40,.85)', 1.4);
    both(x, function () { x.rect(1004, 412, 12, 10); }, INK.shu, 1.2);
    both(x, function () { x.ellipse(1050, 450, 20, 10, 0, 0, 7); x.rect(1030, 438, 40, 12); }, '#c8402f', 1.4);
    block(x, function () { x.ellipse(1050, 438, 20, 6, 0, 0, 7); }, '#e87a6a');

    both(x, function () { rr(x, 1206, 600, 44, 70); }, INK.woodDk, 1.8);
    [0, 1, 2, 3].forEach(function (i) {
      key(x, function () { x.moveTo(1214 + i * 9, 600); x.lineTo(1210 + i * 11, 540); }, 3, '#c9a878');
    });
  }

  /* ------------------------------------------------------------------ */
  /* THE PAPER — built once, laid over every frame                      */

  function buildPaper() {
    reseed(71);
    /* uneven ink take-up, multiplied */
    paperMul = mk(W, H);
    var m = paperMul.getContext('2d');
    var small = mk(160, 90), sx = small.getContext('2d'), id = sx.createImageData(160, 90);
    for (var i = 0; i < id.data.length; i += 4) {
      var v = 228 + R() * 27; id.data[i] = v; id.data[i + 1] = v - 3; id.data[i + 2] = v - 10; id.data[i + 3] = 255;
    }
    sx.putImageData(id, 0, 0);
    m.imageSmoothingEnabled = true; m.drawImage(small, 0, 0, W, H);
    var gd = m.getImageData(0, 0, W, H), d = gd.data;
    for (var j = 0; j < d.length; j += 4) { var n = (R() - .5) * 22; d[j] += n; d[j + 1] += n; d[j + 2] += n; }
    m.putImageData(gd, 0, 0);
    /* fibre, screened */
    paperScr = mk(W, H);
    var s = paperScr.getContext('2d');
    for (var f = 0; f < 3200; f++) {
      var fx = R() * W, fy = R() * H, fl = 3 + R() * 10, fa = R() * Math.PI;
      s.strokeStyle = 'rgba(240,230,210,' + (.04 + R() * .06) + ')'; s.lineWidth = .8;
      s.beginPath(); s.moveTo(fx, fy); s.lineTo(fx + Math.cos(fa) * fl, fy + Math.sin(fa) * fl); s.stroke();
    }
    /* the darkened edge of the sheet */
    vignette = mk(W, H);
    var v = vignette.getContext('2d');
    var g = v.createRadialGradient(W / 2, H * .46, H * .35, W / 2, H * .5, H * .95);
    g.addColorStop(0, 'rgba(10,8,6,0)'); g.addColorStop(1, 'rgba(10,8,6,.5)');
    v.fillStyle = g; v.fillRect(0, 0, W, H);
  }

  function build() {
    backdrop = mk(W, H);
    var x = backdrop.getContext('2d');
    arcade(x);
    shop(x);
    counterLayer = mk(W, H);
    counter(counterLayer.getContext('2d'));
    buildPaper();
  }

  /* ------------------------------------------------------------------ */
  /* 4. PEOPLE                                                          */
  /*                                                                    */
  /* Every face is built from the same few lines — the woodblock way.   */
  /* What makes each person is proportion, hair, clothing, and age      */
  /* lines; what makes each mood is a brow, an eye and a mouth.         */

  var LOOK = {
    etsuko: { skin: '#e8c7a4', sh: '#c9a07c', hair: '#d7d2c8', hairLn: '#a39d92', style: 'tenugui',
              cloth: 'kappogi', c1: '#f1ebe0', c2: '#cfc6b6', c3: INK.indigo, fw: 60, fh: 88, jaw: .9, age: 3 },
    daiki:  { skin: '#dcb892', sh: '#b99270', hair: '#2a2320', hairLn: '#4a3f38', style: 'crop',
              cloth: 'work', c1: '#8a9aa8', c2: '#6d7d8b', c3: '#c8402f', fw: 68, fh: 92, jaw: 1.1, age: 1, tired: true },
    kenji:  { skin: '#e2c09e', sh: '#c29b78', hair: '#e2ddd4', hairLn: '#a8a298', style: 'cap', cap: '#56604e',
              cloth: 'cardigan', c1: '#8a6a4a', c2: '#6c5238', c3: '#e8e0d0', fw: 64, fh: 86, jaw: .95, age: 3, glasses: 'rect' },
    mary:   { skin: '#b98a63', sh: '#9a6e4a', hair: '#241a15', hairLn: '#4a3a30', style: 'pony',
              cloth: 'scrubs', c1: '#3f8a86', c2: '#2f6d6a', c3: '#f1ebe0', fw: 60, fh: 86, jaw: .9, age: 0, earring: true , nose: .85 },
    aiko:   { skin: '#e8c6a6', sh: '#c9a282', hair: '#1c1817', hairLn: '#3a3230', style: 'bob',
              cloth: 'blazer', c1: '#3a404c', c2: '#2c313b', c3: '#f3efe8', fw: 58, fh: 86, jaw: .85, age: 0, earring: true , nose: .85 },
    ren:    { skin: '#e0bd98', sh: '#c09a76', hair: '#2e2626', hairLn: '#504444', style: 'mop',
              cloth: 'sweater', c1: '#b0724a', c2: '#8f5b3a', c3: '#e0cdb0', fw: 66, fh: 88, jaw: 1, age: 0, glasses: 'round' },
    tanaka: { skin: '#e2c2a0', sh: '#c29c7a', hair: '#dcd8d0', hairLn: '#8f897f', style: 'side', brow: '#4a4540',
              cloth: 'suit', c1: '#3a3c48', c2: '#2a2c36', c3: INK.indigo, fw: 70, fh: 90, jaw: 1.15, age: 2, glasses: 'bold', nose: 1.12 },
    yui:    { skin: '#e8c6a6', sh: '#c9a282', hair: '#221a18', hairLn: '#44383a', style: 'long',
              cloth: 'blouse', c1: '#7a5a8a', c2: '#5f4570', c3: INK.ochre, fw: 58, fh: 86, jaw: .85, age: 0, earring: true , nose: .85 },
    hiroshi:{ skin: '#e6c3a0', sh: '#c79e7c', hair: '#ece7de', hairLn: '#a9a399', style: 'comb',
              cloth: 'shirt', c1: '#9fb0bf', c2: '#7d8fa0', c3: '#c3cfda', fw: 61, fh: 95, jaw: .9, age: 3, glasses: 'rect' }
  };

  var FW = 380, FH = 470;           /* scratch canvas per figure */
  var FC = { x: 190, y: 160 };      /* face centre within it */
  var figCache = {};

  function figure(id, ex, blink, dim) {
    var k = id + '|' + ex + '|' + (blink ? 1 : 0) + '|' + (dim ? 1 : 0);
    if (figCache[k]) return figCache[k];
    var L = LOOK[id]; if (!L) return null;
    var c = mk(FW, FH), x = c.getContext('2d');
    reseed(id.length * 97 + 13);
    drawFigure(x, L, ex, blink);
    if (dim) {
      /* those not speaking recede, the way a printer would pull a lighter impression */
      x.save(); x.globalCompositeOperation = 'source-atop';
      x.fillStyle = 'rgba(16,22,36,.3)'; x.fillRect(0, 0, FW, FH); x.restore();
    }
    figCache[k] = c;
    return c;
  }

  function drawFigure(x, L, ex, blink) {
    var cx = FC.x, cy = FC.y, fw = L.fw, fh = L.fh;
    var neckTop = cy + fh * .62, shY = cy + fh + 18;

    /* ---- hair that sits behind the head -------------------------- */
    if (L.style === 'long') {
      both(x, function () {
        x.moveTo(cx - fw - 8, cy - 20); x.quadraticCurveTo(cx - fw - 22, cy + 120, cx - fw - 30, shY + 110);
        x.lineTo(cx + fw + 30, shY + 110); x.quadraticCurveTo(cx + fw + 22, cy + 120, cx + fw + 8, cy - 20); x.closePath();
      }, L.hair, 2.2);
    }
    if (L.style === 'pony') {
      both(x, function () { x.ellipse(cx + fw + 6, cy + 30, 16, 44, .35, 0, 7); }, L.hair, 2);
    }

    /* ---- body and clothes ---------------------------------------- */
    var bw = fw * 2.25;
    function torso() {
      x.moveTo(cx - bw, FH); x.lineTo(cx - bw + 10, shY + 40);
      x.quadraticCurveTo(cx - bw + 22, shY + 4, cx - fw, shY - 6);
      x.lineTo(cx + fw, shY - 6); x.quadraticCurveTo(cx + bw - 22, shY + 4, cx + bw - 10, shY + 40);
      x.lineTo(cx + bw, FH); x.closePath();
    }
    block(x, torso, L.c1);
    /* shadow side */
    block(x, function () {
      x.moveTo(cx + fw * .5, shY - 6); x.lineTo(cx + fw, shY - 6); x.quadraticCurveTo(cx + bw - 22, shY + 4, cx + bw - 10, shY + 40);
      x.lineTo(cx + bw, FH); x.lineTo(cx + fw * .8, FH); x.closePath();
    }, L.c2);

    /* neck */
    both(x, function () {
      x.moveTo(cx - fw * .45, neckTop); x.lineTo(cx - fw * .5, shY + 2); x.lineTo(cx, shY + 30);
      x.lineTo(cx + fw * .5, shY + 2); x.lineTo(cx + fw * .45, neckTop); x.closePath();
    }, L.skin, 2);
    block(x, function () { x.moveTo(cx + 6, neckTop + 8); x.lineTo(cx + fw * .45, neckTop); x.lineTo(cx + fw * .5, shY + 2); x.lineTo(cx + 6, shY + 24); x.closePath(); }, L.sh);

    clothing(x, L, cx, shY, bw, fw);
    key(x, torso, 2.4);

    /* ---- the head -------------------------------------------------- */
    function head() {
      x.moveTo(cx - fw, cy - 18);
      x.bezierCurveTo(cx - fw - 4, cy - fh * 1.18, cx + fw + 4, cy - fh * 1.18, cx + fw, cy - 18);
      x.bezierCurveTo(cx + fw - 2, cy + fh * .42 * L.jaw, cx + fw * .6, cy + fh * .92, cx, cy + fh);
      x.bezierCurveTo(cx - fw * .6, cy + fh * .92, cx - fw + 2, cy + fh * .42 * L.jaw, cx - fw, cy - 18);
    }
    /* ears first, so the head sits over them */
    [-1, 1].forEach(function (s) {
      both(x, function () { x.ellipse(cx + s * (fw + 2), cy + 6, 10, 20, s * .15, 0, 7); }, s > 0 ? L.sh : L.skin, 2);
      key(x, function () { x.moveTo(cx + s * fw, cy - 6); x.quadraticCurveTo(cx + s * (fw + 8), cy + 6, cx + s * fw, cy + 18); }, 1.1, INK.sumi, .5);
    });
    if (L.earring) [-1, 1].forEach(function (s) {
      both(x, function () { x.arc(cx + s * (fw + 3), cy + 28, 3.2, 0, 7); }, INK.ochre, 1);
    });
    block(x, head, L.skin);
    /* one flat shadow tone down the side away from the lantern */
    block(x, function () {
      x.moveTo(cx + fw * .28, cy - fh * .96);
      x.bezierCurveTo(cx + fw * .95, cy - fh * .9, cx + fw + 4, cy - fh * .45, cx + fw, cy - 18);
      x.bezierCurveTo(cx + fw - 2, cy + fh * .42 * L.jaw, cx + fw * .6, cy + fh * .92, cx, cy + fh);
      x.bezierCurveTo(cx + fw * .45, cy + fh * .55, cx + fw * .5, cy - fh * .1, cx + fw * .28, cy - fh * .96);
    }, L.sh);
    /* a little warmth on the near cheek, from the lantern */
    var ck = x.createRadialGradient(cx - fw * .5, cy + fh * .3, 1, cx - fw * .5, cy + fh * .3, fw * .3);
    ck.addColorStop(0, 'rgba(200,64,47,.13)'); ck.addColorStop(1, 'rgba(200,64,47,0)');
    x.fillStyle = ck; x.fillRect(cx - fw, cy, fw, fh);

    hairFront(x, L, cx, cy, fw, fh);
    key(x, head, 2.5);
    face(x, L, ex, blink, cx, cy, fw, fh);

    /* the cold edge from the machine outside, down the far side */
    key(x, function () { x.moveTo(cx + fw - 1, cy - 30); x.bezierCurveTo(cx + fw - 2, cy + fh * .42, cx + fw * .6, cy + fh * .9, cx + 4, cy + fh); }, 3, INK.cold, .5);
    key(x, function () { x.moveTo(cx + fw + 6, shY - 4); x.quadraticCurveTo(cx + bw - 22, shY + 4, cx + bw - 10, shY + 40); x.lineTo(cx + bw, FH - 40); }, 3, INK.cold, .4);
  }

  function clothing(x, L, cx, shY, bw, fw) {
    var t = L.cloth;
    if (t === 'shirt' || t === 'work') {
      both(x, function () {
        x.moveTo(cx - fw * .7, shY - 8); x.lineTo(cx - 6, shY + 38); x.lineTo(cx - 18, shY + 48); x.lineTo(cx - fw * .95, shY + 8); x.closePath();
        x.moveTo(cx + fw * .7, shY - 8); x.lineTo(cx + 6, shY + 38); x.lineTo(cx + 18, shY + 48); x.lineTo(cx + fw * .95, shY + 8); x.closePath();
      }, L.c3 === '#c8402f' ? '#aab8c4' : L.c3, 2);
      key(x, function () { x.moveTo(cx, shY + 44); x.lineTo(cx, FH); }, 2);
      [shY + 78, shY + 124].forEach(function (by) { both(x, function () { x.arc(cx + 6, by, 3.5, 0, 7); }, '#e8eef3', 1); });
      key(x, function () { x.moveTo(cx - bw * .62, shY + 60); x.quadraticCurveTo(cx - bw * .52, shY + 100, cx - bw * .6, shY + 150); }, 1.6, INK.sumi, .6);
      if (t === 'work') {
        /* the company lanyard he forgot to take off */
        key(x, function () { x.moveTo(cx - fw * .55, shY - 4); x.quadraticCurveTo(cx - 20, shY + 70, cx - 12, shY + 110);
                             x.moveTo(cx + fw * .55, shY - 4); x.quadraticCurveTo(cx + 4, shY + 70, cx - 8, shY + 110); }, 3, INK.shu);
        both(x, function () { rr(x, cx - 34, shY + 108, 44, 56); }, '#eef0f2', 1.6);
        block(x, function () { rr(x, cx - 30, shY + 114, 16, 18); }, '#8a9aa8');
        key(x, function () { x.moveTo(cx - 10, shY + 118); x.lineTo(cx + 6, shY + 118); x.moveTo(cx - 10, shY + 126); x.lineTo(cx + 2, shY + 126); x.moveTo(cx - 30, shY + 146); x.lineTo(cx + 6, shY + 146); }, 1.2, INK.sumi, .6);
      }
    } else if (t === 'kappogi') {
      /* the white cook's overcoat, crossed at the neck, over an indigo collar */
      both(x, function () { x.moveTo(cx - fw * .7, shY - 8); x.lineTo(cx + 26, shY + 70); x.lineTo(cx + 10, shY + 82); x.lineTo(cx - fw * .98, shY + 6); x.closePath(); }, L.c3, 2);
      both(x, function () { x.moveTo(cx + fw * .7, shY - 8); x.lineTo(cx - 26, shY + 70); x.lineTo(cx - 10, shY + 82); x.lineTo(cx + fw * .98, shY + 6); x.closePath(); }, L.c3, 2);
      key(x, function () { x.moveTo(cx - bw * .7, shY + 50); x.quadraticCurveTo(cx - bw * .6, shY + 110, cx - bw * .66, FH);
                           x.moveTo(cx + bw * .5, shY + 70); x.quadraticCurveTo(cx + bw * .44, shY + 120, cx + bw * .5, FH); }, 1.4, INK.sumi, .5);
    } else if (t === 'cardigan') {
      both(x, function () { x.moveTo(cx - fw * .6, shY - 8); x.lineTo(cx - 2, shY + 52); x.lineTo(cx + fw * .6, shY - 8); x.closePath(); }, L.c3, 1.8);
      key(x, function () { x.moveTo(cx - fw * .6, shY - 8); x.lineTo(cx - 8, shY + 64); x.lineTo(cx - 8, FH); x.moveTo(cx + fw * .6, shY - 8); x.lineTo(cx + 8, shY + 64); x.lineTo(cx + 8, FH); }, 2.2);
      [shY + 90, shY + 136].forEach(function (by) { both(x, function () { x.arc(cx - 16, by, 4.5, 0, 7); }, '#5a4028', 1); });
      /* knit ribbing */
      for (var i = 0; i < 18; i++) key(x, function () { x.moveTo(cx - bw + 20 + i * 5, FH - 30); x.lineTo(cx - bw + 20 + i * 5, FH); }, 1, INK.sumi, .25);
    } else if (t === 'scrubs') {
      both(x, function () { x.moveTo(cx - fw * .62, shY - 8); x.lineTo(cx, shY + 64); x.lineTo(cx + fw * .62, shY - 8); x.closePath(); }, L.skin, 2);
      key(x, function () { x.moveTo(cx - fw * .62, shY - 8); x.lineTo(cx, shY + 64); x.lineTo(cx + fw * .62, shY - 8); }, 3, L.c2);
      /* a chest pocket with two pens */
      both(x, function () { rr(x, cx - bw * .62, shY + 76, 46, 40); }, L.c1, 1.6);
      key(x, function () { x.moveTo(cx - bw * .6 + 10, shY + 60); x.lineTo(cx - bw * .6 + 10, shY + 80); x.moveTo(cx - bw * .6 + 20, shY + 64); x.lineTo(cx - bw * .6 + 20, shY + 80); }, 3, INK.indigo);
    } else if (t === 'blazer' || t === 'suit') {
      both(x, function () { x.moveTo(cx - fw * .55, shY - 10); x.lineTo(cx, shY + 60); x.lineTo(cx + fw * .55, shY - 10); x.closePath(); }, L.c3 === INK.indigo ? '#eef0f2' : L.c3, 1.8);
      if (t === 'suit') both(x, function () { x.moveTo(cx - 9, shY + 6); x.lineTo(cx + 9, shY + 6); x.lineTo(cx + 12, shY + 120); x.lineTo(cx, shY + 136); x.lineTo(cx - 12, shY + 120); x.closePath(); }, L.c3, 1.6);
      /* lapels */
      both(x, function () { x.moveTo(cx - fw * .62, shY - 10); x.lineTo(cx - 22, shY + 96); x.lineTo(cx - 40, shY + 40); x.lineTo(cx - fw * .98, shY + 18); x.closePath(); }, L.c2, 2);
      both(x, function () { x.moveTo(cx + fw * .62, shY - 10); x.lineTo(cx + 22, shY + 96); x.lineTo(cx + 40, shY + 40); x.lineTo(cx + fw * .98, shY + 18); x.closePath(); }, L.c2, 2);
      if (t === 'suit') both(x, function () { x.arc(cx - bw * .5, shY + 50, 5, 0, 7); }, INK.ochre, 1.2);   /* the council pin */
    } else if (t === 'sweater') {
      both(x, function () { x.moveTo(cx - fw * .55, shY - 8); x.quadraticCurveTo(cx, shY + 36, cx + fw * .55, shY - 8); x.quadraticCurveTo(cx, shY + 20, cx - fw * .55, shY - 8); }, L.c2, 2);
      for (var j = 0; j < 7; j++) key(x, function () { x.moveTo(cx - bw * .7 + j * 26, shY + 70); x.quadraticCurveTo(cx - bw * .7 + j * 26 + 6, shY + 110, cx - bw * .7 + j * 26, FH); }, 1, INK.sumi, .22);
    } else if (t === 'blouse') {
      both(x, function () { x.moveTo(cx - fw * .5, shY - 8); x.quadraticCurveTo(cx, shY + 50, cx + fw * .5, shY - 8); x.quadraticCurveTo(cx, shY + 30, cx - fw * .5, shY - 8); }, L.skin, 1.8);
      key(x, function () { x.moveTo(cx - fw * .42, shY - 2); x.quadraticCurveTo(cx, shY + 44, cx + fw * .42, shY - 2); }, 1.2, L.c3, .95);
      both(x, function () { x.arc(cx, shY + 42, 3.2, 0, 7); }, L.c3, 1);
    }
  }

  function hairFront(x, L, cx, cy, fw, fh) {
    var s = L.style, top = cy - fh * .98;
    if (s === 'tenugui') {
      /* grey hair at the temples, the rest under an indigo tenugui */
      both(x, function () { x.moveTo(cx - fw - 2, cy - 4); x.quadraticCurveTo(cx - fw - 4, cy - 50, cx - fw * .5, cy - 58); x.lineTo(cx - fw + 8, cy + 6); x.closePath(); }, L.hair, 1.6);
      both(x, function () { x.moveTo(cx + fw + 2, cy - 4); x.quadraticCurveTo(cx + fw + 4, cy - 50, cx + fw * .5, cy - 58); x.lineTo(cx + fw - 8, cy + 6); x.closePath(); }, L.hair, 1.6);
      both(x, function () {
        x.moveTo(cx - fw - 6, cy - 40); x.bezierCurveTo(cx - fw - 8, top - 30, cx + fw + 8, top - 30, cx + fw + 6, cy - 40);
        x.quadraticCurveTo(cx, cy - fh * .62, cx - fw - 6, cy - 40);
      }, L.c3, 2.2);
      /* the tenugui's pattern — a small repeating asanoha star, printed white */
      for (var i = 0; i < 9; i++) {
        var px = cx - fw * .8 + i * fw * .2, py = cy - fh * .8 + Math.sin(i) * 6;
        key(x, function () { for (var a = 0; a < 3; a++) { var an = a * Math.PI / 3; x.moveTo(px - Math.cos(an) * 4, py - Math.sin(an) * 4); x.lineTo(px + Math.cos(an) * 4, py + Math.sin(an) * 4); } }, 1, '#e8e2d4', .8);
      }
      /* the knot at the side */
      both(x, function () { x.ellipse(cx + fw + 10, cy - 52, 10, 7, .5, 0, 7); x.moveTo(cx + fw + 14, cy - 48); x.lineTo(cx + fw + 30, cy - 30); x.lineTo(cx + fw + 20, cy - 26); x.closePath(); }, L.c3, 1.8);
    } else if (s === 'crop') {
      both(x, function () {
        x.moveTo(cx - fw - 1, cy - 12); x.bezierCurveTo(cx - fw - 8, top - 26, cx + fw + 8, top - 26, cx + fw + 1, cy - 12);
        x.lineTo(cx + fw - 6, cy - 40); x.quadraticCurveTo(cx + 20, cy - fh * .78, cx - 30, cy - fh * .72);
        x.quadraticCurveTo(cx - fw + 4, cy - 50, cx - fw - 1, cy - 12);
      }, L.hair, 2.2);
    } else if (s === 'cap') {
      both(x, function () { x.moveTo(cx - fw - 2, cy - 8); x.lineTo(cx - fw + 2, cy - 36); x.lineTo(cx - fw + 12, cy + 4); x.closePath();
                             x.moveTo(cx + fw + 2, cy - 8); x.lineTo(cx + fw - 2, cy - 36); x.lineTo(cx + fw - 12, cy + 4); x.closePath(); }, L.hair, 1.4);
      both(x, function () {
        x.moveTo(cx - fw - 8, cy - 36); x.bezierCurveTo(cx - fw - 6, top - 44, cx + fw + 6, top - 44, cx + fw + 8, cy - 36);
        x.quadraticCurveTo(cx, cy - fh * .58, cx - fw - 8, cy - 36);
      }, L.cap, 2.2);
      both(x, function () { x.moveTo(cx - fw - 10, cy - 38); x.quadraticCurveTo(cx - 10, cy - fh * .5, cx + fw * .5, cy - 44); x.quadraticCurveTo(cx - 10, cy - fh * .64, cx - fw - 10, cy - 38); }, '#46503f', 1.8);
      key(x, function () { x.moveTo(cx, top - 30); x.lineTo(cx, cy - fh * .6); }, 1.2, INK.sumi, .5);
    } else if (s === 'pony') {
      both(x, function () {
        x.moveTo(cx - fw - 1, cy - 4); x.bezierCurveTo(cx - fw - 8, top - 24, cx + fw + 8, top - 24, cx + fw + 1, cy - 4);
        x.quadraticCurveTo(cx + fw * .6, cy - fh * .66, cx, cy - fh * .7); x.quadraticCurveTo(cx - fw * .6, cy - fh * .66, cx - fw - 1, cy - 4);
      }, L.hair, 2.2);
      key(x, function () { for (var i = 0; i < 5; i++) { x.moveTo(cx - fw * .7 + i * fw * .3, cy - fh * .66); x.quadraticCurveTo(cx - fw * .5 + i * fw * .3, top - 8, cx + fw * .6, top); } }, 1, L.hairLn, .8);
    } else if (s === 'bob') {
      both(x, function () {
        x.moveTo(cx - fw - 12, cy + 44); x.bezierCurveTo(cx - fw - 24, top - 52, cx + fw + 24, top - 52, cx + fw + 12, cy + 44);
        x.lineTo(cx + fw - 8, cy + 44); x.lineTo(cx + fw - 6, cy - 20);
        x.lineTo(cx - fw + 6, cy - 36); x.lineTo(cx - fw + 8, cy + 44); x.closePath();
      }, L.hair, 2.2);
      /* the straight fringe */
      var fr = function () {
        x.moveTo(cx - fw + 4, cy - fh * .8); x.lineTo(cx + fw - 4, cy - fh * .8);
        x.lineTo(cx + fw - 4, cy - fh * .36);
        for (var i = 0; i <= 6; i++) x.lineTo(cx + fw - 4 - i * (fw * 2 - 8) / 6, cy - fh * (.33 + (i % 2) * .035));
        x.closePath();
      };
      block(x, fr, L.hair);
      key(x, function () { for (var i = 0; i <= 6; i++) { var px = cx + fw - 4 - i * (fw * 2 - 8) / 6; x.lineTo(px, cy - fh * (.33 + (i % 2) * .035)); } }, 2);
      key(x, function () { for (var i = 1; i < 6; i++) { var px = cx - fw + 4 + i * (fw * 2 - 8) / 6; x.moveTo(px, cy - fh * .78); x.lineTo(px + 3, cy - fh * .38); } }, 1, L.hairLn, .8);
    } else if (s === 'mop') {
      both(x, function () {
        x.moveTo(cx - fw - 6, cy - 2); x.bezierCurveTo(cx - fw - 16, top - 40, cx + fw + 16, top - 40, cx + fw + 6, cy - 2);
        for (var i = 0; i <= 8; i++) { var px = cx + fw - i * fw / 4, py = cy - fh * .42 + (i % 2 ? 12 : -4); x.lineTo(px, py); }
        x.closePath();
      }, L.hair, 2.2);
      key(x, function () { for (var i = 0; i < 8; i++) { var px = cx - fw * .8 + i * fw * .23; x.moveTo(px, top - 16); x.quadraticCurveTo(px + 10, cy - fh * .7, px + 4, cy - fh * .44); } }, 1.1, L.hairLn, .85);
    } else if (s === 'side') {
      both(x, function () {
        x.moveTo(cx - fw - 3, cy - 8); x.bezierCurveTo(cx - fw - 12, top - 40, cx + fw + 12, top - 40, cx + fw + 3, cy - 8);
        x.lineTo(cx + fw - 8, cy - 36); x.quadraticCurveTo(cx + 10, cy - fh * .8, cx - fw * .35, cy - fh * .66);
        x.quadraticCurveTo(cx - fw + 4, cy - 44, cx - fw - 2, cy - 8);
      }, L.hair, 2.2);
      key(x, function () { x.moveTo(cx - fw * .35, cy - fh * .66); x.quadraticCurveTo(cx - fw * .32, top + 4, cx - fw * .26, top + 2);
                           for (var i = 0; i < 6; i++) { x.moveTo(cx - fw * .22 + i * 10, top + 6 + i * 3); x.quadraticCurveTo(cx + fw * .45, top + 10 + i * 5, cx + fw - 8, cy - 42 + i * 4); } }, 1.3, L.hairLn, .95);
    } else if (s === 'long') {
      both(x, function () {
        x.moveTo(cx - fw - 8, cy + 30); x.bezierCurveTo(cx - fw - 14, top - 32, cx + fw + 14, top - 32, cx + fw + 8, cy + 30);
        x.lineTo(cx + fw - 6, cy + 20); x.quadraticCurveTo(cx + fw * .5, cy - fh * .66, cx + 4, cy - fh * .8);
        x.quadraticCurveTo(cx - fw * .5, cy - fh * .66, cx - fw + 6, cy + 20); x.closePath();
      }, L.hair, 2.2);
    } else if (s === 'comb') {
      both(x, function () {
        x.moveTo(cx - fw + 2, cy - 30); x.bezierCurveTo(cx - fw - 4, top - 22, cx + fw - 6, top - 30, cx + fw, cy - 40);
        x.quadraticCurveTo(cx + fw * .6, cy - fh * .8, cx - fw * .3, cy - fh * .84);
        x.quadraticCurveTo(cx - fw * .8, cy - fh * .76, cx - fw + 2, cy - 30);
      }, L.hair, 1.6);
      key(x, function () { for (var i = 0; i < 7; i++) { x.moveTo(cx - fw * .8 + i * 6, cy - fh * .74 - i * 4); x.quadraticCurveTo(cx + 10, top - 12 + i * 2, cx + fw * .88 - i * 2, cy - fh * .6 + i * 2); } }, 1.2, L.hairLn, 1);
    }
  }

  function face(x, L, ex, blink, cx, cy, fw, fh) {
    var ey = cy - 4, eo = fw * .45, ew = fw * .22;

    /* ---- brows: most of every expression is here ------------------- */
    var bIn = { neutral: 0, warm: 2, worried: -8, stern: 7, surprised: -12 }[ex] || 0;
    var bOut = { neutral: 0, warm: 0, worried: 2, stern: -3, surprised: -12 }[ex] || 0;
    [-1, 1].forEach(function (s) {
      var ox = cx + s * eo, yIn = ey - 22 + bIn, yOut = ey - 20 + bOut;
      var pale = ['#ece7de', '#e2ddd4', '#d7d2c8'].indexOf(L.hair) !== -1;
      key(x, function () { x.moveTo(ox + s * ew * 1.15, yOut); x.quadraticCurveTo(ox, ey - 30 + (bIn + bOut) / 2, ox - s * ew * .95, yIn); }, L.brow ? 4.2 : pale ? 3 : 3.4, L.brow || (pale ? '#8f8a82' : INK.sumi));
    });

    /* ---- eyes ------------------------------------------------------- */
    [-1, 1].forEach(function (s) {
      var ox = cx + s * eo;
      if (blink) {
        key(x, function () { x.moveTo(ox - ew, ey); x.quadraticCurveTo(ox, ey + 5, ox + ew, ey); }, 2.6);
      } else if (ex === 'warm') {
        key(x, function () { x.moveTo(ox - ew, ey + 2); x.quadraticCurveTo(ox, ey - 7, ox + ew, ey + 2); }, 2.8);
      } else {
        var open = ex === 'surprised' ? 8 : ex === 'stern' ? 3.4 : 5;
        /* the white of the eye, then the iris under the lid */
        block(x, function () { x.moveTo(ox - ew, ey); x.quadraticCurveTo(ox, ey - open * 1.4, ox + ew, ey); x.quadraticCurveTo(ox, ey + open * .9, ox - ew, ey); }, '#f5efe4');
        x.save(); x.beginPath(); x.moveTo(ox - ew, ey); x.quadraticCurveTo(ox, ey - open * 1.4, ox + ew, ey); x.quadraticCurveTo(ox, ey + open * .9, ox - ew, ey); x.clip();
        var ir = ex === 'surprised' ? 4.4 : 5.4, look = ex === 'worried' ? 2 : 0;
        block(x, function () { x.arc(ox - 1 + look, ey - 1 + look, ir, 0, 7); }, '#2a221e');
        x.fillStyle = 'rgba(255,255,255,.8)'; x.fillRect(ox - 3 + look, ey - 4 + look, 2, 2);
        x.restore();
        key(x, function () { x.moveTo(ox - ew - 1, ey + 1); x.quadraticCurveTo(ox, ey - open * 1.45, ox + ew + 1, ey + 1); }, 2.8);
        key(x, function () { x.moveTo(ox - ew + 3, ey + 2); x.quadraticCurveTo(ox, ey + open * .95, ox + ew - 3, ey + 2); }, 1, INK.sumi, .45);
      }
      /* the tired line under the eye */
      if (L.tired || L.age >= 2) key(x, function () { x.moveTo(ox - ew * .8, ey + 9); x.quadraticCurveTo(ox, ey + 13, ox + ew * .8, ey + 9); }, 1.1, INK.sumi, .45);
      /* crow's feet */
      if (L.age >= 2) key(x, function () { x.moveTo(ox + s * (ew + 4), ey - 2); x.lineTo(ox + s * (ew + 11), ey - 6); x.moveTo(ox + s * (ew + 4), ey + 3); x.lineTo(ox + s * (ew + 11), ey + 5); }, 1.1, INK.sumi, .5);
    });

    /* ---- glasses ---------------------------------------------------- */
    if (L.glasses) {
      [-1, 1].forEach(function (s) {
        var gx = cx + s * eo;
        key(x, function () {
          if (L.glasses === 'round') x.arc(gx, ey - 1, ew + 7, 0, 7);
          else if (L.glasses === 'bold') x.roundRect(gx - ew - 8, ey - 15, (ew + 8) * 2, 25, 3);
          else x.roundRect(gx - ew - 7, ey - 15, (ew + 7) * 2, 27, 8);
        }, L.glasses === 'bold' ? 4 : 2, L.glasses === 'bold' ? '#231f1c' : '#4a4e55');
      });
      key(x, function () { x.moveTo(cx - eo + ew + 6, ey - 5); x.quadraticCurveTo(cx, ey - 10, cx + eo - ew - 6, ey - 5);
                           x.moveTo(cx - eo - ew - 7, ey - 6); x.lineTo(cx - fw, ey - 2); x.moveTo(cx + eo + ew + 7, ey - 6); x.lineTo(cx + fw, ey - 2); }, 2, '#4a4e55');
      /* the lantern catches the near lens */
      x.save(); x.globalAlpha = .32; x.fillStyle = INK.lamp;
      x.beginPath(); x.moveTo(cx - eo - ew, ey - 11); x.lineTo(cx - eo - ew + 9, ey - 11); x.lineTo(cx - eo - ew + 2, ey + 6); x.closePath(); x.fill(); x.restore();
    }

    /* ---- nose ------------------------------------------------------- */
    var nz = L.nose || 1;
    key(x, function () { x.moveTo(cx - 2, ey + 4 * nz); x.quadraticCurveTo(cx + 6, ey + 26 * nz, cx + 2, ey + 34 * nz); x.quadraticCurveTo(cx - 6 * nz, ey + 38 * nz, cx - 11 * nz, ey + 34 * nz); }, 2);

    /* ---- age: forehead lines and the lines from nose to mouth ------- */
    if (L.age >= 1) key(x, function () { x.moveTo(cx - 20, ey + 32); x.quadraticCurveTo(cx - 28, ey + 48, cx - 25, ey + 60); x.moveTo(cx + 20, ey + 32); x.quadraticCurveTo(cx + 28, ey + 48, cx + 25, ey + 60); }, 1.2, INK.sumi, L.age >= 2 ? .55 : .3);
    if (L.age >= 2 && L.style !== 'bob' && L.style !== 'cap' && L.style !== 'tenugui') {
      key(x, function () { x.moveTo(cx - 28, cy - fh * .5); x.quadraticCurveTo(cx, cy - fh * .55, cx + 28, cy - fh * .5);
                           x.moveTo(cx - 20, cy - fh * .6); x.quadraticCurveTo(cx, cy - fh * .64, cx + 20, cy - fh * .6); }, 1.1, INK.sumi, .38);
    }
    if (L.style === 'crop' && L.tired) {
      /* a day's stubble, stippled */
      x.save(); x.fillStyle = 'rgba(40,32,28,.13)';
      for (var i = 0; i < 260; i++) { var a = R() * Math.PI, rr2 = .55 + R() * .42; x.fillRect(cx + Math.cos(a) * fw * .62 * rr2, ey + 36 + Math.sin(a) * fh * .46 * rr2, .9, .9); }
      x.restore();
    }

    /* ---- mouth ------------------------------------------------------ */
    var my = ey + 54;
    if (ex === 'warm') {
      key(x, function () { x.moveTo(cx - 20, my - 3); x.quadraticCurveTo(cx, my + 9, cx + 20, my - 3); }, 2.6);
    } else if (ex === 'worried') {
      key(x, function () { x.moveTo(cx - 15, my + 4); x.quadraticCurveTo(cx, my - 2, cx + 15, my + 4); }, 2.4);
    } else if (ex === 'stern') {
      key(x, function () { x.moveTo(cx - 17, my + 1); x.lineTo(cx + 17, my + 1); }, 2.8);
    } else if (ex === 'surprised') {
      both(x, function () { x.ellipse(cx, my + 1, 5.5, 4.5, 0, 0, 7); }, '#a0584c', 2);
    } else {
      key(x, function () { x.moveTo(cx - 17, my); x.quadraticCurveTo(cx, my + 3, cx + 17, my - 1); }, 2.4);
    }
    /* a touch of colour on the lip */
    x.save(); x.globalAlpha = .22; x.fillStyle = INK.shu;
    x.beginPath(); x.ellipse(cx + MIS.x, my + 6, 10, 3, 0, 0, 7); x.fill(); x.restore();
  }

  /* ------------------------------------------------------------------ */
  /* OPTIONAL PNG SPRITES                                               */

  var poses = {}, tried = {};
  function sprite(id, want) {
    var set = (global.SPRITES || {})[id]; if (!set) return null;
    var order = { warm: ['warm', 'neutral'], worried: ['worried', 'neutral'], stern: ['stern', 'worried', 'neutral'],
                  surprised: ['surprised', 'neutral'], neutral: ['neutral'] }[want] || ['neutral'];
    var file = null;
    for (var i = 0; i < order.length; i++) if (set[order[i]]) { file = set[order[i]]; break; }
    if (!file) return null;
    if (poses[file]) return poses[file];
    if (tried[file]) return null;
    tried[file] = true;
    var img = new Image(); img.onload = function () { poses[file] = img; }; img.src = file;
    return null;
  }

  function drawPerson(id, sx, lit, frame) {
    var ex = (speaker === id) ? expr : 'neutral';
    var img = sprite(id, ex);
    var blink = ((frame + (blinkAt[id] || 0)) % 290) < 7;
    var scale = 1;
    if (img) {
      var hgt = FH * scale, wid = img.width * hgt / img.height;
      b.save(); if (!lit) b.globalAlpha = .6;
      b.drawImage(img, sx - wid / 2, 470 + 60 - hgt, wid, hgt); b.restore();
      return;
    }
    var c = figure(id, ex, blink, !lit);
    if (!c) return;
    /* the face centre lands at about y 262 on screen; the counter hides the rest */
    b.drawImage(c, sx - FC.x * scale, 272 - FC.y * scale, FW * scale, FH * scale);
  }

  /* ------------------------------------------------------------------ */
  /* BOWLS ON THE COUNTER                                               */

  function drawBowlAt(x, bx, by, sc, broth, tops, frame) {
    var Ico = global.Icons;
    if (!Ico || !Ico.paintBowl) return;
    Ico.paintBowl(x, bx, by, sc, broth, tops, frame);
  }

  /* ------------------------------------------------------------------ */
  /* 5. EVERY FRAME                                                     */

  function liveAlley(frame) {
    b.save(); b.beginPath(); b.rect(OX, OY, OW, OB - OY); b.clip();

    /* the lamps: one alive, the middle one dead, one flickering, the rest long gone */
    [[12, 1], [16, 0], [21, 2], [29, 0], [38, 0]].forEach(function (L) {
      var p = proj(0, 3.15, L[0]), top = proj(0, 4.5, L[0]);
      var on = L[1] === 1 || (L[1] === 2 && (Math.sin(frame / 5.3) + Math.sin(frame / 2.1)) > -.4);
      var r = 60 / L[0];
      if (on) {
        glow(b, p[0], p[1], r * 12, '246,213,140', L[1] === 1 ? .5 : .32);
        var fl = proj(0, 0, L[0]);
        b.save(); b.translate(fl[0], fl[1]); b.scale(1, .2);
        var pg = b.createRadialGradient(0, 0, 1, 0, 0, r * 20);
        pg.addColorStop(0, 'rgba(246,213,140,' + (L[1] === 1 ? .26 : .14) + ')'); pg.addColorStop(1, 'rgba(246,213,140,0)');
        b.fillStyle = pg; b.fillRect(-r * 20, -r * 20, r * 40, r * 40); b.restore();
      }
      key(b, function () { b.moveTo(top[0], top[1]); b.lineTo(p[0], p[1] - r); }, 1, '#070b12', .8);
      both(b, function () { b.ellipse(p[0], p[1], r * 1.2, r * .9, 0, 0, 7); }, on ? INK.lamp : '#2b3140', 1.2, '#070b12');
      block(b, function () { rr(b, p[0] - r * .9, p[1] - r * 1.1, r * 1.8, r * .3); }, '#10151d');
    });

    /* the machine's cold light: on the floor, on the bench, on the cat */
    var fc = vmFace(.5, 1.2, .05);
    var pulse = .30 + Math.sin(frame / 50) * .02;
    glow(b, fc[0] - 20, fc[1] + 40, 250, '160,215,240', pulse);
    var sp0 = vmFace(.5, 0, .9);
    b.save(); b.translate(sp0[0], sp0[1]); b.scale(1, .28);
    var sg = b.createRadialGradient(0, 0, 1, 0, 0, 150);
    sg.addColorStop(0, 'rgba(170,220,240,.22)'); sg.addColorStop(1, 'rgba(170,220,240,0)');
    b.fillStyle = sg; b.fillRect(-150, -150, 300, 300); b.restore();
    /* its reflection in the wet floor: broken vertical strokes */
    reseed(101 + Math.floor(frame / 6) % 3);
    for (var i = 0; i < 24; i++) {
      var s = R(), bp = vmFace(s, 0, .3);
      var rl = 8 + R() * 24, a = .14 + R() * .2;
      key(b, function () { b.moveTo(bp[0], bp[1] + 4 + R() * 12); b.lineTo(bp[0], bp[1] + 6 + rl); }, 2, INK.cold, a);
    }

    /* the cat that lives under the machine, lit from one side by it */
    var ct = proj(1.05, 0, 5.1), sc = 5.1 / 5.1;
    var tail = Math.sin(frame / 26) * 5;
    block(b, function () { b.ellipse(ct[0], ct[1] - 12 * sc, 22 * sc, 11 * sc, 0, 0, 7); b.moveTo(ct[0] - 16, ct[1] - 20); b.arc(ct[0] - 18 * sc, ct[1] - 22 * sc, 11 * sc, 0, 7); }, '#0c1016');
    block(b, function () { poly(b, [[ct[0] - 27, ct[1] - 28], [ct[0] - 24, ct[1] - 40], [ct[0] - 19, ct[1] - 30]]); poly(b, [[ct[0] - 16, ct[1] - 30], [ct[0] - 11, ct[1] - 41], [ct[0] - 9, ct[1] - 28]]); }, '#0c1016');
    key(b, function () { b.moveTo(ct[0] + 20, ct[1] - 10); b.quadraticCurveTo(ct[0] + 38, ct[1] - 14 + tail, ct[0] + 34, ct[1] - 32 + tail); }, 3.4, '#0c1016');
    key(b, function () { b.moveTo(ct[0] - 10, ct[1] - 22); b.quadraticCurveTo(ct[0] + 6, ct[1] - 26, ct[0] + 20, ct[1] - 18); }, 1.6, INK.cold, .5);
    b.fillStyle = '#d9cf7c'; b.fillRect(ct[0] - 24, ct[1] - 25, 2.5, 2); b.fillRect(ct[0] - 17, ct[1] - 25, 2.5, 2);

    /* somebody on the bench, facing the shutters, not coming in yet */
    if (waiting) {
      var bs = proj(-2.28, .44, 6.2), k2 = 6.2;
      var u = CAM.f / k2 * .01;      /* pixels per centimetre at that depth */
      var bx = bs[0], by = bs[1];
      b.save(); b.translate(bx, 0); b.scale(-1, 1); b.translate(-bx, 0);   /* he faces the machine */
      both(b, function () {
        b.moveTo(bx + 10 * u, by);                                 /* hips */
        b.lineTo(bx - 32 * u, by - 2 * u); b.lineTo(bx - 34 * u, by + 44 * u); b.lineTo(bx - 26 * u, by + 44 * u); b.lineTo(bx - 22 * u, by + 6 * u);   /* thigh, shin */
        b.lineTo(bx + 14 * u, by + 6 * u);
        b.lineTo(bx + 12 * u, by - 56 * u);                        /* back, a little stooped */
        b.quadraticCurveTo(bx - 4 * u, by - 62 * u, bx - 12 * u, by - 50 * u);
        b.lineTo(bx - 8 * u, by - 18 * u);
        b.closePath();
      }, '#141a24', 1.2, '#05080d');
      both(b, function () { b.arc(bx - 4 * u, by - 72 * u, 11 * u, 0, 7); }, '#141a24', 1.2, '#05080d');
      both(b, function () { rr(b, bx - 17 * u, by - 84 * u, 24 * u, 6 * u); rr(b, bx - 22 * u, by - 79 * u, 12 * u, 2 * u); }, '#1d2430', 1, '#05080d');
      key(b, function () { b.moveTo(bx - 14 * u, by - 76 * u); b.quadraticCurveTo(bx - 18 * u, by - 66 * u, bx - 12 * u, by - 62 * u); b.moveTo(bx - 8 * u, by - 18 * u); b.lineTo(bx - 32 * u, by - 2 * u); }, 1.6, INK.cold, .5);
      b.restore();
    }

    /* RAIN: between the shop and the start of the arcade roof, falling in the open */
    var rain = Math.max(0, Math.min(1, (phase - .22) / .45));
    if (rain > 0) {
      reseed(7 + (frame % 997));
      var n = Math.round(90 + rain * 190);
      for (var r = 0; r < n; r++) {
        var rx = OX + R() * (OW + 80) - 40, ry = OY + ((R() * (OB - OY) + frame * (9 + R() * 4)) % (OB - OY));
        var rl = 18 + R() * 32;
        key(b, function () { b.moveTo(rx, ry); b.lineTo(rx - rl * .2, ry + rl); }, .9, '#c9d7e6', (.08 + R() * .16) * (.4 + rain * .6));
      }
      /* splashes where it lands, just outside the door */
      for (var sp = 0; sp < 18 * rain; sp++) {
        var spx = OX + R() * OW, spy = 420 + R() * 45;
        key(b, function () { b.arc(spx, spy, 2 + R() * 3, Math.PI, 0); }, .9, '#c9d7e6', .25);
      }
    }
    b.restore();
  }

  function noren(frame) {
    var NP = 4, NW = OW / NP;
    for (var i = 0; i < NP; i++) {
      (function (i) {
        var nx = OX + i * NW;
        var sway = Math.sin(frame / 40 + i * 1.3) * 2 + gust * Math.sin(frame / 5 + i) * 10;
        var path = function () { b.moveTo(nx + 2, 32); b.lineTo(nx + NW - 2, 32); b.lineTo(nx + NW - 2 + sway, 150); b.lineTo(nx + 2 + sway, 152); b.closePath(); };
        block(b, path, INK.indigo);
        b.fillStyle = bok(b, nx, 0, nx + NW, 0, [[0, 'rgba(0,0,0,.28)'], [.18, 'rgba(0,0,0,0)'], [.82, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.22)']]);
        b.beginPath(); path(); b.fill();
        key(b, path, 2);
        b.save(); b.fillStyle = INK.washi; b.font = jp(76); b.textAlign = 'center'; b.textBaseline = 'middle';
        b.fillText(['ラ', 'ー', 'メ', 'ン'][i], nx + NW / 2 + 1 + sway * .5, 96); b.restore();
      }(i));
    }
    if (gust > 0) gust = Math.max(0, gust - .01);
  }

  /* 6:40 when the curtain goes out, 10:10 when Etsuko takes it down */
  function wallClock() {
    var cx = 1165, cy = 408, r = 40;
    both(b, function () { b.arc(cx, cy, r + 6, 0, 7); }, INK.woodDk, 2.2);
    both(b, function () { b.arc(cx, cy, r, 0, 7); }, '#efe6d2', 1.6);
    for (var i = 0; i < 12; i++) {
      var a = i / 12 * Math.PI * 2;
      key(b, function () { b.moveTo(cx + Math.sin(a) * r * .78, cy - Math.cos(a) * r * .78); b.lineTo(cx + Math.sin(a) * r * .9, cy - Math.cos(a) * r * .9); }, i % 3 ? 1.2 : 2.4);
    }
    var mins = 18 * 60 + 40 + phase * (22 * 60 + 10 - (18 * 60 + 40));
    var hA = (mins / 60 % 12) / 12 * Math.PI * 2, mA = (mins % 60) / 60 * Math.PI * 2;
    key(b, function () { b.moveTo(cx, cy); b.lineTo(cx + Math.sin(hA) * r * .5, cy - Math.cos(hA) * r * .5); }, 3.4);
    key(b, function () { b.moveTo(cx, cy); b.lineTo(cx + Math.sin(mA) * r * .76, cy - Math.cos(mA) * r * .76); }, 2);
    block(b, function () { b.arc(cx, cy, 3.2, 0, 7); }, INK.shu);
  }

  function lanternLight(frame) {
    var a = .30 + Math.sin(frame / 33) * .02 - phase * .04;
    glow(b, 112, 72, 560, '246,190,110', a);
  }

  function drawRoom(frame) {
    if (!backdrop) build();
    b.clearRect(0, 0, W, H);
    b.drawImage(backdrop, 0, 0);
    wallClock();
    liveAlley(frame);
    noren(frame);

    seats.forEach(function (s) { drawPerson(s.id, s.x, speaker === null || speaker === s.id, frame); });

    b.drawImage(counterLayer, 0, 0);

    /* what they are eating */
    seats.forEach(function (s) {
      var bw = bowls[s.id];
      if (bw) drawBowlAt(b, s.x, 492, .7, bw.broth, bw.tops, frame);
    });

    lanternLight(frame);

    /* the night going by: the whole print cools and darkens */
    b.fillStyle = 'rgba(12,16,34,' + (.04 + phase * .22) + ')';
    b.fillRect(0, 0, W, H);

    b.save(); b.globalCompositeOperation = 'multiply'; b.globalAlpha = .6; b.drawImage(paperMul, 0, 0); b.restore();
    b.save(); b.globalCompositeOperation = 'screen'; b.drawImage(paperScr, 0, 0); b.restore();
    b.drawImage(vignette, 0, 0);

    blit();
  }

  function blit() {
    if (!vctx) return;
    vctx.drawImage(buf, 0, 0, view.width, view.height);
  }

  /* ------------------------------------------------------------------ */
  /* TITLE AND END CARDS                                                */

  function paperOver(c) {
    var x = c.getContext('2d');
    if (!paperMul) buildPaper();
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = .6; x.drawImage(paperMul, 0, 0, c.width, c.height); x.restore();
    x.save(); x.globalCompositeOperation = 'screen'; x.drawImage(paperScr, 0, 0, c.width, c.height); x.restore();
    x.drawImage(vignette, 0, 0, c.width, c.height);
  }

  /* The title: the arcade from its mouth on the street, looking all the way
     down to the far end, where one shop still has its lights on. It is the
     same arcade as the room, seen from the other end. */
  function titleArt(canvas) {
    var x = canvas.getContext('2d'); reseed(211);
    var T = { vx: 640, hz: 340, f: 600, y: 1.55 };
    function P(X, Y, Z) { return [T.vx + T.f * X / Z, T.hz + T.f * (T.y - Y) / Z]; }
    function PQ(a) { return a.map(function (p) { return P(p[0], p[1], p[2]); }); }
    var END = 19, MOUTH = 6.5;

    /* night sky over the street, then the arcade's dark interior */
    x.fillStyle = bok(x, 0, 0, 0, H, [[0, '#0b111c'], [.5, '#152036'], [1, '#1f2b40']]);
    x.fillRect(0, 0, W, H);
    block(x, function () { poly(x, PQ([[-3, 0, MOUTH], [3, 0, MOUTH], [3, 4.9, MOUTH], [-3, 4.9, MOUTH]])); }, '#121a28');

    /* floor, wet, tiles running away */
    x.fillStyle = bok(x, 0, T.hz, 0, H, [[0, '#1a2436'], [1, '#2a374c']]);
    x.beginPath(); poly(x, PQ([[-3, 0, 2.2], [3, 0, 2.2], [3, 0, END], [-3, 0, END]])); x.fill();
    for (var tz = MOUTH; tz < END; tz += 1.2) (function (tz) { var a = P(-3, 0, tz), c = P(3, 0, tz); key(x, function () { x.moveTo(a[0], a[1]); x.lineTo(c[0], c[1]); }, 1, '#0d1420', .45); }(tz));
    [-2, -1, 0, 1, 2].forEach(function (tx) { var a = P(tx, 0, MOUTH), c = P(tx, 0, END); key(x, function () { x.moveTo(a[0], a[1]); x.lineTo(c[0], c[1]); }, 1, '#0d1420', .4); });

    /* both walls of dead shutters */
    [-1, 1].forEach(function (side) {
      var X = 3 * side;
      block(x, function () { poly(x, PQ([[X, 0, MOUTH], [X, 4, MOUTH], [X, 4, END], [X, 0, END]])); }, '#1b2435');
      for (var z = MOUTH; z < END - 1; z += 3) (function (z0, z1, k) {
        block(x, function () { poly(x, PQ([[X, 2.4, z0], [X, 3.1, z0], [X, 3.1, z1], [X, 2.4, z1]])); }, ['#2a3244', '#2e2b38', '#26343a', '#332c2c'][k % 4]);
        var sh = PQ([[X, 0, z0 + .15], [X, 2.35, z0 + .15], [X, 2.35, z1 - .15], [X, 0, z1 - .15]]);
        block(x, function () { poly(x, sh); }, '#283142');
        for (var yy = .12; yy < 2.35; yy += (z0 < 10 ? .09 : .15)) (function (yy) {
          var p = P(X, yy, z0 + .15), q = P(X, yy, z1 - .15);
          key(x, function () { x.moveTo(p[0], p[1]); x.lineTo(q[0], q[1]); }, 1, '#131a26', .55);
        }(yy));
        key(x, function () { poly(x, sh); }, 1.4, '#0b1019', .85);
        block(x, function () { poly(x, PQ([[X, 0, z0 - .08], [X, 3.1, z0 - .08], [X, 3.1, z0 + .1], [X, 0, z0 + .1]])); }, '#141b27');
      }(z, z + 3, z));
    });

    /* hanging signs, faded */
    [[-1, 8, '中野鮮魚', '#3b4a52'], [1, 9.5, '写真', '#34424e'], [-1, 12, '書店', '#3d3642'], [1, 14, 'パン', '#4c3e2e'], [-1, 16, '薬', '#2f4a44']].forEach(function (sg) {
      var X0 = 3 * sg[0], X1 = 2.15 * sg[0];
      var a = P(Math.min(X0, X1), 3.55, sg[1]), c = P(Math.max(X0, X1), 1.75, sg[1]);
      both(x, function () { rr(x, a[0], a[1], c[0] - a[0], c[1] - a[1]); }, sg[3], 1.4, '#0a0e16');
      var sw = c[0] - a[0], shh = c[1] - a[1], fs = Math.min(sw * .7, shh / (sg[2].length + .6));
      x.save(); x.globalAlpha = .45; x.fillStyle = '#d9d0bc'; x.font = jp(fs); x.textAlign = 'center'; x.textBaseline = 'middle';
      for (var i = 0; i < sg[2].length; i++) x.fillText(sg[2][i], a[0] + sw / 2, a[1] + shh * (i + .8) / (sg[2].length + .6));
      x.restore();
    });

    /* the roof: arches, and every lamp dark but one near the end */
    for (var az = MOUTH; az <= END; az += 2.5) (function (az) {
      var pts = []; for (var q = 0; q <= 16; q++) { var t = q / 16 * Math.PI; pts.push(P(-3 * Math.cos(t), 3.9 + Math.sin(t) * .9, az)); }
      key(x, function () { x.moveTo(pts[0][0], pts[0][1]); pts.forEach(function (p) { x.lineTo(p[0], p[1]); }); }, az < 8 ? 3 : 2, '#070b12', .95);
    }(az));
    [[8, 0], [11, 0], [14, 0], [17, 1]].forEach(function (L) {
      var p = P(0, 3.2, L[0]), r = 70 / L[0];
      if (L[1]) glow(x, p[0], p[1], r * 12, '246,213,140', .45);
      both(x, function () { x.ellipse(p[0], p[1], r * 1.2, r * .9, 0, 0, 7); }, L[1] ? INK.lamp : '#2b3140', 1.2, '#070b12');
    });

    /* THE END OF THE ARCADE: Menya Etsuko, the one light on */
    var sf = PQ([[-2.6, 0, END], [2.6, 0, END], [2.6, 2.7, END], [-2.6, 2.7, END]]);
    var mid = P(0, 1.3, END);
    glow(x, mid[0], mid[1], 300, '246,190,110', .34);
    both(x, function () { poly(x, sf); }, '#2b2723', 2);
    var lit = PQ([[-2.3, .1, END], [2.3, .1, END], [2.3, 2.2, END], [-2.3, 2.2, END]]);
    x.fillStyle = bok(x, 0, lit[2][1], 0, lit[0][1], [[0, '#f6c878'], [1, '#e39a44']]);
    x.beginPath(); poly(x, lit); x.fill();
    /* the counter inside, a customer on a stool, and her behind it */
    var ctr = PQ([[-2.3, .95, END], [2.3, .95, END], [2.3, 1.05, END], [-2.3, 1.05, END]]);
    block(x, function () { poly(x, ctr); }, 'rgba(90,52,20,.75)');
    var s2 = T.f / END * .01;
    var et = P(.8, 1.05, END);
    block(x, function () { x.moveTo(et[0] - 20 * s2, et[1]); x.quadraticCurveTo(et[0] - 22 * s2, et[1] - 34 * s2, et[0], et[1] - 38 * s2); x.quadraticCurveTo(et[0] + 22 * s2, et[1] - 34 * s2, et[0] + 20 * s2, et[1]); x.closePath();
                          x.moveTo(et[0] + 11 * s2, et[1] - 52 * s2); x.arc(et[0], et[1] - 52 * s2, 11 * s2, 0, 7); }, 'rgba(46,26,10,.7)');
    block(x, function () { x.ellipse(et[0], et[1] - 60 * s2, 12 * s2, 5 * s2, 0, 0, 7); }, 'rgba(31,51,80,.85)');
    var cu = P(-1.0, .5, END - .8), s3 = T.f / (END - .8) * .01;
    block(x, function () { x.moveTo(cu[0] - 26 * s3, cu[1] + 10 * s3); x.quadraticCurveTo(cu[0] - 28 * s3, cu[1] - 44 * s3, cu[0], cu[1] - 50 * s3);
                          x.quadraticCurveTo(cu[0] + 28 * s3, cu[1] - 44 * s3, cu[0] + 26 * s3, cu[1] + 10 * s3); x.closePath();
                          x.moveTo(cu[0] + 13 * s3, cu[1] - 64 * s3); x.arc(cu[0], cu[1] - 64 * s3, 13 * s3, 0, 7); }, 'rgba(24,14,6,.85)');
    /* the noren, four panels, and the lantern hung beside it */
    var nr = PQ([[-2.4, 2.2, END], [2.4, 2.2, END], [2.4, 2.72, END], [-2.4, 2.72, END]]);
    both(x, function () { poly(x, nr); }, INK.indigo, 1.4);
    for (var ni = 1; ni < 4; ni++) (function (ni) { var p = P(-2.4 + ni * 1.2, 2.72, END), q = P(-2.4 + ni * 1.2, 2.25, END); key(x, function () { x.moveTo(p[0], p[1]); x.lineTo(q[0], q[1]); }, 1.2, INK.indigoDk); }(ni));
    x.save(); x.fillStyle = INK.washi; x.font = jp((nr[0][1] - nr[3][1]) * .62); x.textAlign = 'center'; x.textBaseline = 'middle';
    ['ラ', 'ー', 'メ', 'ン'].forEach(function (ch, i) { var p = P(-1.8 + i * 1.2, 2.46, END); x.fillText(ch, p[0], p[1]); }); x.restore();
    var ch = P(-2.85, 2.25, END), cr = T.f / END * .22;
    glow(x, ch[0], ch[1], cr * 5, '255,190,110', .5);
    both(x, function () { x.ellipse(ch[0], ch[1], cr * .7, cr, 0, 0, 7); }, INK.shu, 1.4);

    /* its light, running down the wet floor all the way to you */
    for (var rs = 0; rs < 150; rs++) {
      var zz = 2.4 + R() * (END - 2.9), xx = (R() - .5) * 4.4, p0 = P(xx * (zz / END), 0, zz);
      var len = 6 + R() * (46 * 6 / zz);
      key(x, function () { x.moveTo(p0[0], p0[1]); x.lineTo(p0[0], p0[1] + len); }, Math.max(1.2, 26 / zz), INK.lamp, .05 + R() * .16 * Math.pow(zz / END, .6));
    }

    /* a machine's cold light spilling in from somewhere off to the left */
    var gl = P(-2.8, .9, 8.5);
    glow(x, gl[0], gl[1], 230, '160,215,240', .2);
    x.save(); x.translate(gl[0] + 60, P(0, 0, 8.5)[1]); x.scale(1, .22);
    var cg = x.createRadialGradient(0, 0, 1, 0, 0, 170); cg.addColorStop(0, 'rgba(170,220,240,.25)'); cg.addColorStop(1, 'rgba(170,220,240,0)');
    x.fillStyle = cg; x.fillRect(-170, -170, 340, 340); x.restore();

    /* the mouth of the arcade, framing it all, with the street's name */
    var a = P(-3.3, 0, MOUTH), b2 = P(3.3, 0, MOUTH), c = P(3.3, 4.1, MOUTH), d = P(-3.3, 4.1, MOUTH), t = P(0, 5.4, MOUTH);
    /* the street in front, wet */
    x.fillStyle = bok(x, 0, a[1], 0, H, [[0, '#1c2638'], [1, '#2a364a']]); x.fillRect(0, a[1], W, H - a[1]);
    key(x, function () { x.moveTo(0, a[1] + 60); x.lineTo(W, a[1] + 60); }, 2, '#c9c2ae', .25);
    /* the sky over the street, with the wires every Japanese street has */
    x.fillStyle = bok(x, 0, 0, 0, 90, [[0, '#0a0f19'], [1, '#141d2e']]); x.fillRect(0, 0, W, 90);
    /* the buildings either side of the arcade's mouth */
    both(x, function () {
      x.moveTo(0, a[1]); x.lineTo(0, 40); x.lineTo(d[0] - 40, 30); x.lineTo(d[0], d[1] - 60);
      x.lineTo(d[0], a[1]); x.closePath();
      x.moveTo(W, a[1]); x.lineTo(W, 50); x.lineTo(c[0] + 50, 36); x.lineTo(c[0], c[1] - 60);
      x.lineTo(c[0], b2[1]); x.closePath();
    }, '#161d2a', 2.4);
    [[60, 120], [60, 230], [180, 170], [1100, 140], [1200, 250], [1060, 260]].forEach(function (w, i) {
      both(x, function () { rr(x, w[0], w[1], 46, 58); }, i === 4 ? 'rgba(246,213,140,.55)' : '#0e141e', 1.4, '#070b12');
    });
    /* the arch */
    both(x, function () {
      x.moveTo(d[0] - 30, a[1]); x.lineTo(d[0] - 30, d[1]); x.quadraticCurveTo(t[0], t[1] - 70, c[0] + 30, c[1]); x.lineTo(c[0] + 30, b2[1]);
      x.lineTo(c[0], b2[1]); x.lineTo(c[0], c[1]); x.quadraticCurveTo(t[0], t[1] - 20, d[0], d[1]); x.lineTo(d[0], a[1]); x.closePath();
    }, '#2a3244', 2.6);
    /* a telegraph pole, and the wires */
    both(x, function () { rr(x, 1040, 0, 22, a[1] + 60); rr(x, 1010, 40, 82, 8); rr(x, 1016, 70, 70, 7); }, '#221e1a', 2);
    key(x, function () { x.moveTo(0, 60); x.quadraticCurveTo(520, 110, 1030, 44); x.moveTo(0, 90); x.quadraticCurveTo(520, 140, 1030, 74); x.moveTo(1060, 44); x.quadraticCurveTo(1170, 70, W, 52); }, 1.4, '#070b12', .9);
    var sgn = P(0, 4.62, MOUTH);
    both(x, function () { rr(x, sgn[0] - 170, sgn[1] - 30, 340, 58); }, '#232a3a', 2.2);
    x.save(); x.fillStyle = '#d8cfbc'; x.globalAlpha = .7; x.font = jp(36); x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('本町商店街', sgn[0] + MIS.x, sgn[1]); x.restore();
    /* one letter of the sign has lost its light for good */
    x.save(); x.fillStyle = '#232a3a'; x.globalAlpha = .55; x.fillRect(sgn[0] + 34, sgn[1] - 20, 34, 40); x.restore();

    /* the street: a kerb, a manhole cover with the town flower on it, and a puddle holding the shop's light */
    key(x, function () { x.moveTo(0, a[1] + 8); x.lineTo(W, a[1] + 8); }, 3, '#0d131d', .8);
    x.save(); x.translate(360, 620); x.scale(1, .28);
    both(x, function () { x.arc(0, 0, 90, 0, 7); }, '#2c333d', 3, '#0a0e14');
    key(x, function () { x.arc(0, 0, 76, 0, 7); }, 2, '#0a0e14', .8);
    for (var pe = 0; pe < 5; pe++) (function (pe) {
      var an = pe / 5 * Math.PI * 2;
      key(x, function () { x.ellipse(Math.cos(an) * 30, Math.sin(an) * 30, 26, 14, an, 0, 7); }, 2, '#4a525e', .9);
    }(pe));
    key(x, function () { x.arc(0, 0, 12, 0, 7); }, 2, '#4a525e', .9);
    x.restore();
    x.save(); x.translate(660, 560); x.scale(1, .16);
    var pg2 = x.createRadialGradient(0, 0, 1, 0, 0, 260); pg2.addColorStop(0, 'rgba(246,190,110,.28)'); pg2.addColorStop(1, 'rgba(246,190,110,0)');
    x.fillStyle = pg2; x.fillRect(-260, -260, 520, 520); x.restore();
    for (var pr2 = 0; pr2 < 30; pr2++) {
      var px2 = 600 + R() * 120, py2 = 525 + R() * 60;
      key(x, function () { x.moveTo(px2, py2); x.lineTo(px2, py2 + 10 + R() * 24); }, 3, INK.lamp, .08 + R() * .16);
    }

    /* rain on the street in front of you — the arcade roof keeps the rest dry */
    for (var q2 = 0; q2 < 380; q2++) {
      var qx = R() * W, qy = R() * H, ql = 26 + R() * 44;
      key(x, function () { x.moveTo(qx, qy); x.lineTo(qx - ql * .22, qy + ql); }, 1, '#c8d6e6', .08 + R() * .15);
    }
    x.fillStyle = bok(x, 0, H - 70, 0, H, [[0, 'rgba(10,16,26,0)'], [1, 'rgba(10,16,26,.6)']]); x.fillRect(0, H - 70, W, 70);
    paperOver(canvas);
  }

  /* Tokyo, at dawn: where everybody went */
  function endArt(canvas) {
    var x = canvas.getContext('2d'); reseed(307);
    x.fillStyle = bok(x, 0, 0, 0, H, [[0, '#24314e'], [.5, '#7a6a86'], [.8, '#d9a07a'], [1, '#e9c48e']]);
    x.fillRect(0, 0, W, H);
    /* a thin crescent, going */
    both(x, function () { x.arc(1060, 120, 24, 0, 7); }, '#efe6d2', 1.4);
    block(x, function () { x.arc(1070, 114, 22, 0, 7); }, '#3a4466');
    /* Fuji, faint, beyond everything */
    block(x, function () { poly(x, [[380, 470], [640, 250], [700, 262], [940, 470]]); }, 'rgba(90,96,130,.55)');
    block(x, function () { poly(x, [[590, 292], [640, 250], [700, 262], [740, 300], [700, 296], [670, 310], [640, 296], [612, 306]]); }, 'rgba(240,236,228,.7)');
    /* towers, back to front, full of lit windows */
    function tower(bx, bw, bh, col, lit) {
      both(x, function () { rr(x, bx, H - bh, bw, bh); }, col, 1.4, '#141824');
      for (var wy = 0; wy < Math.floor(bh / 16); wy++) for (var wx = 0; wx < Math.floor(bw / 13); wx++) {
        if (R() > lit) continue;
        block(x, function () { rr(x, bx + 5 + wx * 13, H - bh + 8 + wy * 16, 6, 9); }, 'rgba(248,222,168,.8)');
      }
    }
    [[20, 120, 380, '#3a3f5a', .35], [150, 90, 300, '#434866', .3], [250, 150, 470, '#333850', .45], [410, 100, 340, '#3c4160', .35],
     [520, 130, 420, '#30354c', .45], [660, 90, 310, '#40456a', .3], [760, 150, 520, '#2c3048', .5], [920, 110, 360, '#3a3f5c', .35],
     [1040, 140, 440, '#31364e', .45], [1190, 90, 330, '#40456a', .3]].forEach(function (t) { tower(t[0], t[1], t[2], t[3], t[4]); });
    /* the crossing, and the crowd on it */
    both(x, function () { rr(x, 0, H - 110, W, 110); }, '#262b3e', 1.6);
    for (var z = 0; z < 16; z++) block(x, function () { rr(x, 60 + z * 76, H - 88, 44, 10); }, 'rgba(236,230,214,.55)');
    for (var p = 0; p < 90; p++) {
      var px = R() * W, py = H - 100 + R() * 70, ph = 22 + R() * 14, s = 1 - (py - (H - 100)) / 160;
      both(x, function () { rr(x, px - 4, py - ph, 8, ph); x.moveTo(px + 5, py - ph - 5); x.arc(px, py - ph - 5, 5, 0, 7); }, ['#1d2232', '#2a2230', '#20283a', INK.indigo][p % 4], .8, '#0d1018');
      if (p % 7 === 0) { both(x, function () { x.ellipse(px, py - ph - 10, 14, 5, 0, Math.PI, 0); }, ['#c8402f', '#e3a54a', '#3a6ea8'][p % 3], .8); }
    }
    glow(x, W / 2, H, 700, '246,196,140', .3);
    paperOver(canvas);
  }

  /* ------------------------------------------------------------------ */
  /* A BUST, FOR WHOEVER IS STANDING NEXT TO YOU                         */

  function portrait(canvas, id, ex, frame) {
    var x = canvas.getContext('2d');
    x.clearRect(0, 0, canvas.width, canvas.height);
    var img = sprite(id, ex);
    if (img) {
      var h2 = img.height * .6;
      x.drawImage(img, 0, 0, img.width, h2, 0, 0, canvas.width, canvas.width * h2 / img.width);
      return;
    }
    var blink = ((frame + (blinkAt[id] || 0)) % 290) < 7;
    var c = figure(id, ex, blink, false); if (!c) return;
    x.fillStyle = INK.nightLt; x.fillRect(0, 0, canvas.width, canvas.height);
    glow(x, 0, 0, canvas.width * 1.4, '246,190,110', .35);
    /* crop head and shoulders out of the full figure */
    x.drawImage(c, FC.x - 150, FC.y - 150, 300, 318, 0, 0, canvas.width, canvas.height);
  }

  /* ------------------------------------------------------------------ */
  /* CLICKABLE THINGS                                                   */

  function hot() {
    var vmq = faceQuad(0, 0, 1, VM.h), ct = proj(1.05, 0, 5.1);
    var bs = proj(-2.5, .95, 5.3), be = proj(-2.05, 0, 6.9);
    return [
      { key: 'calendar', x: 46, y: 326, w: 112, h: 124 },
      { key: 'photo', x: 1090, y: 70, w: 150, h: 110 },
      { key: 'noren', x: OX, y: 32, w: OW, h: 120 },
      { key: 'shutter', x: OX, y: 200, w: 170, h: 220 },
      { key: 'vending', x: vmq[0][0] - 4, y: vmq[3][1] - 4, w: vmSide(1, 0)[0] - vmq[0][0] + 8, h: vmq[0][1] - vmq[3][1] + 20 },
      { key: 'cat', x: ct[0] - 45, y: ct[1] - 48, w: 90, h: 52 },
      { key: 'bench', x: bs[0] - 10, y: bs[1] - 10, w: be[0] - bs[0] + 30, h: be[1] - bs[1] + 20 },
      { key: 'arcade', x: 450, y: 152, w: 420, h: 60 },
      { key: 'seats', x: 300, y: 470, w: 680, h: 40 }
    ];
  }

  /* ------------------------------------------------------------------ */

  global.Art = {
    W: W, H: H,
    init: function (canvas) {
      view = canvas; vctx = canvas.getContext('2d');
      Object.keys(LOOK).forEach(function (k, i) { blinkAt[k] = i * 53; });
      build();
    },
    setSeats: function (ids) {
      var xs = ids.length === 1 ? [520] : ids.length === 2 ? [420, 740] : [360, 600, 840];
      seats = ids.map(function (id, i) { return { id: id, x: xs[i] }; });
      bowls = {};
    },
    setBowl: function (id, broth, tops) { bowls[id] = { broth: broth, tops: (tops || []).slice() }; },
    setSpeaker: function (id, e) { speaker = id || null; expr = e || 'neutral'; },
    setPhase: function (p) { phase = Math.max(0, Math.min(1, p)); },
    gust: function () { gust = 1; },
    setWaiting: function (v) { waiting = !!v; },
    drawRoom: drawRoom,
    titleArt: titleArt,
    endArt: endArt,
    portrait: portrait,
    hitTest: function (mx, my) {
      var hs = hot();
      for (var i = 0; i < hs.length; i++) {
        var r = hs[i];
        if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return r.key;
      }
      return null;
    },
    /* shared with icons.js so the bench, notebook and room are one print */
    ink: INK, tools: { block: block, key: key, both: both, bok: bok, glow: glow, poly: poly, jp: jp, mk: mk, MIS: MIS }
  };

}(window));
