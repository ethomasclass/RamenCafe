/* ===========================================================================
   icons.js — the bowls, the toppings and the map, printed in the same
   woodblock manner as the room.

   Everything is drawn at three times the size it is shown, so it stays crisp
   on a projector. paintBowl() is the one bowl painter: the bench, the
   notebook and the counter in the room all use it, so the bowl you build is
   exactly the bowl that gets put down in front of somebody.
   =========================================================================== */

(function (global) {
  'use strict';

  var D = global.Data;
  var SS = 3;                                   /* supersampling */

  var INK = {
    sumi: '#1d1a17', washi: '#efe6d2', shu: '#c8402f', bowl: '#ede4d2',
    nori: '#1f2a26', cold: '#bfe3f2'
  };
  var MIS = { x: 1.4, y: .9 };

  function mk(w, h, scale) {
    var c = document.createElement('canvas');
    c.width = w * SS; c.height = h * SS;
    c.style.width = (w * (scale || 1)) + 'px';
    c.style.height = (h * (scale || 1)) + 'px';
    var x = c.getContext('2d'); x.scale(SS, SS);
    return { c: c, x: x };
  }
  function block(x, path, col) { x.save(); x.translate(MIS.x * .4, MIS.y * .4); x.fillStyle = col; x.beginPath(); path(); x.fill(); x.restore(); }
  function key(x, path, w, col, a) {
    x.save(); x.globalAlpha = a == null ? 1 : a; x.strokeStyle = col || INK.sumi; x.lineWidth = w || 1;
    x.lineJoin = 'round'; x.lineCap = 'round'; x.beginPath(); path(); x.stroke(); x.restore();
  }
  function both(x, path, col, w, kc) { block(x, path, col); key(x, path, w, kc); }

  /* ------------------------------------------------------------------ */
  /* THE TOPPINGS, as little prints — used on the shelf and in the bowl */
  /* Each is drawn around (0,0) at unit size 1 = about 20 px.            */

  function topping(x, id, u) {
    var lw = Math.max(.7, u * .07);
    switch (id) {
      case 'chashu':
        both(x, function () { x.ellipse(0, 0, 11 * u, 9 * u, -.2, 0, 7); }, '#b5714a', lw);
        block(x, function () { x.ellipse(-1 * u, 0, 7 * u, 5.5 * u, -.2, 0, 7); }, '#e2b08a');
        key(x, function () { x.moveTo(-6 * u, 0); x.bezierCurveTo(-4 * u, -4 * u, 4 * u, -4 * u, 4 * u, 0); x.bezierCurveTo(4 * u, 3 * u, -2 * u, 3 * u, -1 * u, 0); }, lw * .8, '#8a4a2a');
        key(x, function () { x.ellipse(0, 0, 11 * u, 9 * u, -.2, 0, 7); }, lw * 1.6, '#6a3418', .55);
        break;
      case 'ajitama':
        both(x, function () { x.ellipse(0, 0, 10 * u, 8 * u, -.15, 0, 7); }, '#f6efe0', lw);
        both(x, function () { x.ellipse(.5 * u, .3 * u, 5.4 * u, 4.4 * u, -.15, 0, 7); }, '#e9a531', lw * .8);
        block(x, function () { x.ellipse(-.6 * u, -.8 * u, 2.2 * u, 1.6 * u, 0, 0, 7); }, '#f6c95a');
        key(x, function () { x.ellipse(0, 0, 10 * u, 8 * u, -.15, 0, Math.PI); }, lw * 1.4, '#b88a4a', .45);
        break;
      case 'menma':
        [[-5, -1, .15], [0, 1, -.1], [5, -.5, .2]].forEach(function (m) {
          x.save(); x.translate(m[0] * u, m[1] * u); x.rotate(m[2]);
          both(x, function () { x.rect(-1.8 * u, -7 * u, 3.6 * u, 14 * u); }, '#c79c4a', lw);
          key(x, function () { x.moveTo(0, -6 * u); x.lineTo(0, 6 * u); }, lw * .6, '#8a6a2a', .6);
          x.restore();
        });
        break;
      case 'nori':
        both(x, function () { x.rect(-7 * u, -10 * u, 14 * u, 20 * u); }, INK.nori, lw);
        key(x, function () { x.moveTo(-4 * u, -4 * u); x.lineTo(2 * u, -5 * u); x.moveTo(-2 * u, 4 * u); x.lineTo(4 * u, 3 * u); }, lw * .7, '#3a4a40', .8);
        break;
      case 'negi':
        [[-6, -3], [0, 2], [6, -2], [-2, -6], [4, 6], [-6, 5], [7, 3]].forEach(function (p) {
          both(x, function () { x.arc(p[0] * u, p[1] * u, 2.4 * u, 0, 7); }, '#8fbf5a', lw * .7);
          block(x, function () { x.arc(p[0] * u, p[1] * u, 1.1 * u, 0, 7); }, '#e2f0c8');
        });
        break;
      case 'corn':
        for (var i = 0; i < 11; i++) {
          var a = i * 2.39, r = Math.sqrt(i) * 3 * u;
          both(x, function () { x.ellipse(Math.cos(a) * r, Math.sin(a) * r, 2.3 * u, 2 * u, a, 0, 7); }, '#f2c53d', lw * .6, '#8a6a10');
        }
        break;
      case 'butter':
        both(x, function () { x.moveTo(-7 * u, -3 * u); x.lineTo(6 * u, -6 * u); x.lineTo(8 * u, 3 * u); x.lineTo(-5 * u, 6 * u); x.closePath(); }, '#f6e6a8', lw);
        block(x, function () { x.moveTo(-7 * u, -3 * u); x.lineTo(6 * u, -6 * u); x.lineTo(7 * u, -3 * u); x.lineTo(-6 * u, 0); x.closePath(); }, '#fdf7d8');
        /* melting at the edge */
        block(x, function () { x.ellipse(-3 * u, 7 * u, 6 * u, 2 * u, 0, 0, 7); }, 'rgba(246,230,168,.7)');
        break;
      case 'naruto':
        both(x, function () {
          for (var t = 0; t < 12; t++) { var an = t / 12 * Math.PI * 2, rr = (t % 2 ? 8.2 : 9) * u; if (t === 0) x.moveTo(Math.cos(an) * rr, Math.sin(an) * rr); else x.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); }
          x.closePath();
        }, '#f6f0ea', lw);
        key(x, function () { for (var i = 0; i < 44; i++) { var an = i / 44 * Math.PI * 3.3, r = (1 + i / 44 * 5.8) * u; if (i === 0) x.moveTo(Math.cos(an) * r, Math.sin(an) * r); else x.lineTo(Math.cos(an) * r, Math.sin(an) * r); } }, lw * 1.6, '#e0708c');
        break;
    }
  }

  /* ------------------------------------------------------------------ */
  /* THE BOWL                                                            */
  /* (cx, cy) is the centre of the rim. At scale 1 the rim is 240 px     */
  /* across, which is the size it sits on the counter in the room.       */

  function paintBowl(x, cx, cy, sc, brothId, tops, frame, opts) {
    opts = opts || {};
    var b = brothId ? D.byId(D.BROTHS, brothId) : null;
    var tilt = opts.tilt || 1;                 /* 1 = counter height, ~2 = looking down into it */
    var rw = 120 * sc, rh = 22 * sc * tilt, lw = Math.max(1.2, 2.4 * sc);
    tops = tops || [];

    /* the body of the bowl */
    var body = function () {
      x.moveTo(cx - rw, cy); x.quadraticCurveTo(cx - rw * .9, cy + 84 * sc, cx - rw * .4, cy + 98 * sc);
      x.lineTo(cx + rw * .4, cy + 98 * sc); x.quadraticCurveTo(cx + rw * .9, cy + 84 * sc, cx + rw, cy);
    };
    both(x, function () { body(); x.closePath(); }, INK.bowl, lw);
    /* the shadow side of the glaze */
    x.save(); x.beginPath(); body(); x.closePath(); x.clip();
    var g = x.createLinearGradient(cx - rw, 0, cx + rw, 0);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.6, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(60,40,20,.28)');
    x.fillStyle = g; x.fillRect(cx - rw, cy, rw * 2, 100 * sc);
    x.restore();
    /* the raimon band — the thunder pattern every ramen bowl in Japan wears */
    var by = cy + Math.max(20 * sc, rh + 3 * sc), bh = 14 * sc;
    x.save(); x.beginPath(); body(); x.closePath(); x.clip();
    block(x, function () { x.rect(cx - rw, by, rw * 2, bh); }, INK.shu);
    key(x, function () {
      var step = 16 * sc;
      for (var px = cx - rw + 4 * sc; px < cx + rw; px += step) {
        x.moveTo(px, by + bh * .8); x.lineTo(px, by + bh * .22); x.lineTo(px + step * .5, by + bh * .22);
        x.lineTo(px + step * .5, by + bh * .6); x.lineTo(px + step * .25, by + bh * .6);
      }
    }, Math.max(.8, 1.2 * sc), INK.washi, .9);
    x.restore();
    /* the foot */
    both(x, function () { x.rect(cx - rw * .36, cy + 96 * sc, rw * .72, 8 * sc); }, '#d8cdb8', lw * .8);

    /* the broth */
    if (b) {
      block(x, function () { x.ellipse(cx, cy, rw - 3 * sc, rh - 2 * sc, 0, 0, 7); }, b.colour);
      x.save(); x.beginPath(); x.ellipse(cx, cy, rw - 3 * sc, rh - 2 * sc, 0, 0, 7); x.clip();
      /* the lantern catches the surface on the near-left */
      var sh = x.createLinearGradient(cx - rw, 0, cx + rw, 0);
      sh.addColorStop(0, 'rgba(255,220,160,.45)'); sh.addColorStop(.45, 'rgba(255,220,160,0)'); sh.addColorStop(1, 'rgba(0,0,0,.18)');
      x.fillStyle = sh; x.fillRect(cx - rw, cy - rh, rw * 2, rh * 2);
      /* fat on the surface for the rich ones */
      if (brothId === 'tonkotsu' || brothId === 'miso') {
        for (var f = 0; f < 9; f++) {
          x.fillStyle = 'rgba(255,240,200,.35)';
          x.beginPath(); x.ellipse(cx - rw * .6 + f * rw * .14, cy + Math.sin(f * 2.1) * rh * .4, 3 * sc, 1.6 * sc, 0, 0, 7); x.fill();
        }
      }
      /* noodles folded under the surface */
      key(x, function () {
        for (var n = 0; n < 5; n++) {
          var ny = cy - rh * .5 + n * rh * .25;
          x.moveTo(cx - rw * .7, ny);
          for (var t = 0; t <= 1; t += .1) x.lineTo(cx - rw * .7 + t * rw * 1.4, ny + Math.sin(t * 18 + n) * 2 * sc);
        }
      }, Math.max(.8, 1.4 * sc), '#f3dfa4', .45);
      x.restore();

      /* toppings: nori stands up at the back; everything else lies in the broth */
      var slots = [[-44, -2], [40, 2], [0, 6]], si = 0;
      if (tops.indexOf('nori') !== -1) {
        x.save(); x.translate(cx + 70 * sc, cy - 26 * sc * Math.min(tilt, 1.4)); x.rotate(.35);
        topping(x, 'nori', 2.2 * sc); x.restore();
      }
      tops.forEach(function (t) {
        if (t === 'nori') return;
        var s = slots[si++] || slots[0];
        x.save(); x.translate(cx + s[0] * sc, cy + s[1] * sc * tilt); x.scale(1, Math.min(1, .5 + tilt * .2));
        topping(x, t, (tilt > 1.4 ? 2.4 : 1.9) * sc); x.restore();
      });
    } else {
      block(x, function () { x.ellipse(cx, cy, rw - 3 * sc, rh - 2 * sc, 0, 0, 7); }, '#d9ccb2');
      block(x, function () { x.ellipse(cx, cy + 4 * sc, rw * .8, rh * .6, 0, 0, 7); }, '#cbbd9f');
    }
    key(x, function () { x.ellipse(cx, cy, rw, rh, 0, 0, 7); }, lw);
    key(x, function () { body(); }, lw);

    /* steam, drawn the old way: calligraphic curls, not particles */
    if (b && opts.steam !== 0) {
      [[-50, 0], [-4, 1.3], [44, 2.6]].forEach(function (s) {
        var ph = s[1] + (frame || 0) / 30;
        key(x, function () {
          x.moveTo(cx + s[0] * sc, cy - 10 * sc);
          for (var t = 0; t <= 1.001; t += .05) {
            x.lineTo(cx + s[0] * sc + Math.sin(t * 7 + ph) * (8 + t * 10) * sc, cy - 10 * sc - t * (opts.steam || 92) * sc);
          }
        }, Math.max(1, 2 * sc), opts.onPaper ? '#8a7a64' : INK.washi, opts.onPaper ? .4 : .34);
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* SHELF ICONS                                                         */

  function brothIcon(id, scale) {
    var m = mk(40, 32, scale), x = m.x;
    paintBowl(x, 20, 11, .15, id, [], 0, { tilt: 2.3, onPaper: true, steam: 0 });
    return m.c;
  }

  function toppingIcon(id, scale) {
    var m = mk(26, 24, scale), x = m.x;
    x.save(); x.translate(13, 12); topping(x, id, .95); x.restore();
    return m.c;
  }

  /* the bench bowl: the canvas is 360x280 shown at 180x140 */
  function drawBowl(x, w, h, brothId, tops, frame) {
    x.clearRect(0, 0, w, h);
    x.save();
    var sc = w / 300;
    paintBowl(x, w / 2, h * .36, sc, brothId, tops, frame, { tilt: 2.1, onPaper: true, steam: 70 });
    if (!brothId) {
      x.fillStyle = '#8a7963'; x.font = (13 * sc * 1.2) + 'px sans-serif'; x.textAlign = 'center';
      x.fillText('empty', w / 2, h * .44);
    }
    x.restore();
  }

  /* ------------------------------------------------------------------ */
  /* THE MAP IN THE NOTEBOOK, as an ink sketch. Canvas 400x520.          */

  function drawMap(x, w, h, known) {
    var s = w / 200;
    x.clearRect(0, 0, w, h);
    x.save(); x.scale(s, s);
    /* the sea, as a bokashi wipe */
    var g = x.createLinearGradient(0, 0, 0, 260);
    g.addColorStop(0, '#dbe4e6'); g.addColorStop(1, '#eef0ea');
    x.fillStyle = g; x.fillRect(0, 0, 200, 260);
    /* waves, the seigaiha way, very faint */
    x.strokeStyle = 'rgba(31,51,80,.10)'; x.lineWidth = .7;
    for (var yy = 12; yy < 260; yy += 14) for (var xx = (yy / 14) % 2 * 10; xx < 200; xx += 20) { x.beginPath(); x.arc(xx, yy, 8, Math.PI, 0); x.stroke(); }

    var land = '#e6dcc4', ink = '#3a3226';
    /* Honshu: a thick brushed stroke is close enough at this size */
    x.lineCap = 'round'; x.lineJoin = 'round';
    x.strokeStyle = ink; x.lineWidth = 21;
    var hon = [[142, 82], [150, 102], [134, 126], [114, 142], [92, 152], [70, 160], [54, 166]];
    x.beginPath(); hon.forEach(function (p, i) { if (i) x.lineTo(p[0], p[1]); else x.moveTo(p[0], p[1]); }); x.stroke();
    x.strokeStyle = land; x.lineWidth = 18.5;
    x.beginPath(); hon.forEach(function (p, i) { if (i) x.lineTo(p[0], p[1]); else x.moveTo(p[0], p[1]); }); x.stroke();
    /* Hokkaido, Shikoku, Kyushu */
    function isle(path) { x.fillStyle = land; x.strokeStyle = ink; x.lineWidth = 1.3; x.beginPath(); path(); x.fill(); x.stroke(); }
    isle(function () { x.moveTo(128, 20); x.lineTo(168, 28); x.lineTo(174, 52); x.lineTo(150, 74); x.lineTo(126, 60); x.lineTo(118, 36); x.closePath(); });
    isle(function () { x.ellipse(76, 184, 13, 6, -.2, 0, 7); });
    isle(function () { x.ellipse(36, 200, 14, 17, .3, 0, 7); });

    D.BROTHS.forEach(function (b) {
      var on = known && known[b.id];
      if (on) {
        x.fillStyle = INK.shu; x.strokeStyle = ink; x.lineWidth = 1;
        x.beginPath(); x.arc(b.map.x, b.map.y, 4.2, 0, 7); x.fill(); x.stroke();
        x.fillStyle = ink; x.font = '600 9px "Shippori Mincho", Georgia, serif';
        var right = b.map.x > 110;
        x.textAlign = right ? 'right' : 'left';
        x.fillText(b.name.split(' ')[0], b.map.x + (right ? -8 : 8), b.map.y + 3);
      } else {
        x.strokeStyle = 'rgba(58,50,38,.45)'; x.lineWidth = 1;
        x.beginPath(); x.arc(b.map.x, b.map.y, 3, 0, 7); x.stroke();
      }
    });
    x.fillStyle = '#8a7963'; x.font = 'italic 8.5px Georgia, serif'; x.textAlign = 'left';
    x.fillText('where the broths come from', 8, 252);
    x.restore();
  }

  global.Icons = {
    brothIcon: brothIcon, toppingIcon: toppingIcon,
    drawBowl: drawBowl, paintBowl: paintBowl, drawMap: drawMap
  };

}(window));
