/* ===========================================================================
   icons.js — every small drawing in the game, made in code.

   Nothing here loads a file. Bowls, jars, the shelf thumbnails and the map of
   Japan in the notebook are all drawn onto their own little canvases, so the
   game works with an empty art/ folder.
   =========================================================================== */

(function (global) {
  'use strict';

  var D = global.Data;

  function make(w, h, scale) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.style.width = (w * (scale || 1)) + 'px';
    c.style.height = (h * (scale || 1)) + 'px';
    c.style.imageRendering = 'pixelated';
    var x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    return { c: c, x: x };
  }

  function px(x, a, b, w, h, col) { x.fillStyle = col; x.fillRect(a, b, w, h); }

  /* ------------------------------------------------------------------ */
  /* A small bowl seen from the front — used on the shelf and in the book */

  function brothIcon(id, scale) {
    var b = D.byId(D.BROTHS, id);
    var m = make(28, 22, scale || 1), x = m.x;
    /* steam */
    px(x, 9, 1, 1, 3, '#5a4a3e'); px(x, 14, 0, 1, 4, '#6a5a4e'); px(x, 19, 2, 1, 3, '#5a4a3e');
    /* broth surface */
    x.fillStyle = b ? b.colour : '#e8d49a';
    x.beginPath(); x.ellipse(14, 10, 11, 3.4, 0, 0, 7); x.fill();
    /* bowl body */
    x.fillStyle = '#e8e2d8';
    x.beginPath(); x.moveTo(3, 10); x.lineTo(25, 10); x.lineTo(20, 20); x.lineTo(8, 20); x.closePath(); x.fill();
    /* the blue band every cheap ramen bowl has */
    px(x, 4, 13, 20, 2, '#3d6d9a');
    px(x, 5, 15, 18, 1, '#2c5580');
    /* rim highlight */
    px(x, 3, 9, 22, 1, '#fbf8f2');
    return m.c;
  }

  /* ------------------------------------------------------------------ */
  /* Toppings, as they sit on the shelf                                  */

  function toppingIcon(id, scale) {
    var m = make(22, 20, scale || 1), x = m.x;
    switch (id) {
      case 'chashu':
        x.fillStyle = '#b5714a'; x.beginPath(); x.arc(11, 11, 8, 0, 7); x.fill();
        x.fillStyle = '#d99a6c'; x.beginPath(); x.arc(11, 11, 4.5, 0, 7); x.fill();
        x.fillStyle = '#8c5030'; x.fillRect(3, 10, 16, 1);
        break;
      case 'ajitama':
        x.fillStyle = '#fdf6ea'; x.beginPath(); x.ellipse(11, 11, 8, 7.5, 0, 0, 7); x.fill();
        x.fillStyle = '#f3a92a'; x.beginPath(); x.arc(11, 11, 4, 0, 7); x.fill();
        x.fillStyle = '#f6c95a'; x.beginPath(); x.arc(10, 10, 2, 0, 7); x.fill();
        break;
      case 'menma':
        px(x, 4, 5, 3, 12, '#c9a24a'); px(x, 9, 3, 3, 14, '#dcb45c'); px(x, 14, 6, 3, 11, '#b8933f');
        break;
      case 'nori':
        px(x, 5, 2, 12, 16, '#26332c'); px(x, 6, 3, 10, 14, '#1a2620');
        px(x, 7, 5, 2, 1, '#3a4a40'); px(x, 12, 9, 2, 1, '#3a4a40');
        break;
      case 'negi':
        px(x, 3, 8, 4, 4, '#8fbf5a'); px(x, 4, 9, 2, 2, '#d8ecc0');
        px(x, 10, 5, 4, 4, '#7fae4c'); px(x, 11, 6, 2, 2, '#d8ecc0');
        px(x, 12, 12, 4, 4, '#9fcf6a'); px(x, 13, 13, 2, 2, '#d8ecc0');
        break;
      case 'corn':
        [[5,6],[9,5],[13,7],[6,11],[10,10],[14,12],[8,14]].forEach(function (p) {
          px(x, p[0], p[1], 3, 3, '#f2c53d'); px(x, p[0], p[1], 1, 1, '#fbe89a');
        });
        break;
      case 'butter':
        x.fillStyle = '#f6e6a8'; x.fillRect(4, 6, 14, 9);
        x.fillStyle = '#fdf7d8'; x.fillRect(4, 6, 14, 2);
        x.fillStyle = '#dcc678'; x.fillRect(4, 14, 14, 1);
        break;
      case 'naruto':
        x.fillStyle = '#f6f0ea'; x.beginPath(); x.arc(11, 11, 8, 0, 7); x.fill();
        x.strokeStyle = '#e87a94'; x.lineWidth = 2;
        x.beginPath();
        for (var i = 0; i < 40; i++) {
          var a = i / 40 * Math.PI * 3.2, r = 1 + i / 40 * 6;
          var ax = 11 + Math.cos(a) * r, ay = 11 + Math.sin(a) * r;
          if (i === 0) x.moveTo(ax, ay); else x.lineTo(ax, ay);
        }
        x.stroke();
        break;
    }
    return m.c;
  }

  /* ------------------------------------------------------------------ */
  /* The bowl on the bench, at size, with whatever is in it so far        */

  function drawBowl(x, w, h, brothId, tops, frame) {
    x.clearRect(0, 0, w, h);
    x.imageSmoothingEnabled = false;
    var cx = w / 2, top = h * 0.34, b = brothId ? D.byId(D.BROTHS, brothId) : null;

    /* steam, only once there is something hot in it */
    if (b) {
      x.globalAlpha = 0.5;
      for (var s = 0; s < 3; s++) {
        var t = ((frame || 0) * 0.6 + s * 40) % 120;
        var sy = top - 6 - t * 0.22, sx = cx - 26 + s * 26 + Math.sin(t / 12 + s) * 4;
        x.fillStyle = '#cfc4b4';
        x.fillRect(sx, sy, 3, 3);
      }
      x.globalAlpha = 1;
    }

    /* broth */
    if (b) {
      x.fillStyle = b.colour;
      x.beginPath(); x.ellipse(cx, top + 8, w * 0.31, h * 0.085, 0, 0, 7); x.fill();
      /* noodles showing through, faintly */
      x.globalAlpha = 0.35; x.fillStyle = '#f6e9c8';
      for (var n = 0; n < 5; n++) {
        x.fillRect(cx - 22 + n * 9, top + 4 + (n % 2) * 3, 7, 1);
      }
      x.globalAlpha = 1;
    }

    /* toppings, laid round the bowl */
    var spots = [[-19, -7], [15, -4], [-3, 0]];
    (tops || []).forEach(function (t, i) {
      var ic = toppingIcon(t, 1);
      var p = spots[i] || spots[0];
      x.drawImage(ic, Math.round(cx + p[0] - 15), Math.round(top + p[1] - 13), 30, 27);
    });

    /* the bowl itself, drawn last so it sits in front */
    x.fillStyle = '#e8e2d8';
    x.beginPath();
    x.moveTo(cx - w * 0.33, top + 8);
    x.lineTo(cx + w * 0.33, top + 8);
    x.lineTo(cx + w * 0.20, h * 0.86);
    x.lineTo(cx - w * 0.20, h * 0.86);
    x.closePath(); x.fill();
    x.fillStyle = '#3d6d9a'; x.fillRect(cx - w * 0.30, top + 20, w * 0.60, 5);
    x.fillStyle = '#2c5580'; x.fillRect(cx - w * 0.29, top + 25, w * 0.58, 2);
    x.fillStyle = '#fbf8f2'; x.fillRect(cx - w * 0.33, top + 6, w * 0.66, 2);
    /* foot */
    x.fillStyle = '#cfc7ba'; x.fillRect(cx - w * 0.13, h * 0.86, w * 0.26, 4);

    if (!b) {
      x.fillStyle = '#7a6a5e'; x.font = '11px sans-serif'; x.textAlign = 'center';
      x.fillText('empty', cx, top + 14);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Japan, roughly, for the notebook. Not a survey map — a sketch, so a
     student can see that four broths means four different places.        */

  function drawMap(x, w, h, known) {
    x.clearRect(0, 0, w, h);
    x.fillStyle = '#f0e7d6'; x.fillRect(0, 0, w, h);

    /* sea */
    x.fillStyle = '#dfe8ea'; x.fillRect(0, 0, w, h);

    var land = '#c9bda2';

    /* Honshu — a thick line is close enough at this size */
    x.strokeStyle = land; x.lineWidth = 19; x.lineCap = 'round'; x.lineJoin = 'round';
    x.beginPath();
    x.moveTo(142, 82); x.lineTo(150, 102); x.lineTo(134, 126);
    x.lineTo(114, 142); x.lineTo(92, 152); x.lineTo(70, 160); x.lineTo(54, 166);
    x.stroke();

    /* Hokkaido */
    x.fillStyle = land;
    x.beginPath();
    x.moveTo(128, 20); x.lineTo(168, 28); x.lineTo(174, 52);
    x.lineTo(150, 74); x.lineTo(126, 60); x.lineTo(118, 36);
    x.closePath(); x.fill();

    /* Shikoku */
    x.beginPath(); x.ellipse(76, 184, 13, 6, -0.2, 0, 7); x.fill();
    /* Kyushu */
    x.beginPath(); x.ellipse(36, 200, 14, 17, 0.3, 0, 7); x.fill();

    /* the dots */
    D.BROTHS.forEach(function (b) {
      var on = known && known[b.id];
      x.fillStyle = on ? '#c0392b' : '#b3a892';
      x.beginPath(); x.arc(b.map.x, b.map.y, on ? 4 : 2.5, 0, 7); x.fill();
      if (on) {
        x.strokeStyle = '#fff'; x.lineWidth = 1;
        x.beginPath(); x.arc(b.map.x, b.map.y, 4, 0, 7); x.stroke();
        x.fillStyle = '#4a3f30';
        x.font = 'bold 9px sans-serif';
        x.textAlign = b.map.x > 110 ? 'right' : 'left';
        x.fillText(b.name.split(' ')[0], b.map.x + (b.map.x > 110 ? -8 : 8), b.map.y + 3);
      }
    });

    x.fillStyle = '#8a7963'; x.font = '9px sans-serif'; x.textAlign = 'left';
    x.fillText('where the broths come from', 8, h - 8);
  }

  global.Icons = {
    make: make, brothIcon: brothIcon, toppingIcon: toppingIcon,
    drawBowl: drawBowl, drawMap: drawMap
  };

}(window));
