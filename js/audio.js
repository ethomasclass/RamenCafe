/* ===========================================================================
   audio.js — the shop, synthesised. No sound files, nothing downloaded.

   Off until somebody turns it on, and the choice is remembered. What you get
   is a broth simmer, the extractor fan, the odd car going past outside, and
   small sounds for picking things up and putting a bowl down.
   =========================================================================== */

(function (global) {
  'use strict';

  var ctx = null, master = null, bed = null, on = false;

  function start() {
    if (ctx) return;
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.0;
    master.connect(ctx.destination);
    bed = buildBed();
  }

  /* Pink-ish noise, once, reused for everything that hisses. */
  function noiseBuffer(sec) {
    var n = Math.floor(ctx.sampleRate * sec);
    var buf = ctx.createBuffer(1, n, ctx.sampleRate);
    var d = buf.getChannelData(0), last = 0;
    for (var i = 0; i < n; i++) {
      var white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      d[i] = last * 3.5;
    }
    return buf;
  }

  function buildBed() {
    var g = ctx.createGain(); g.gain.value = 1; g.connect(master);

    /* the pot: filtered noise, slowly breathing */
    var simmer = ctx.createBufferSource();
    simmer.buffer = noiseBuffer(4); simmer.loop = true;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 620;
    var sg = ctx.createGain(); sg.gain.value = 0.18;
    simmer.connect(lp); lp.connect(sg); sg.connect(g);

    var breathe = ctx.createOscillator(); breathe.frequency.value = 0.14;
    var bAmt = ctx.createGain(); bAmt.gain.value = 0.06;
    breathe.connect(bAmt); bAmt.connect(sg.gain);

    /* the extractor fan: a low hum */
    var hum = ctx.createOscillator(); hum.type = 'sawtooth'; hum.frequency.value = 58;
    var hf = ctx.createBiquadFilter(); hf.type = 'lowpass'; hf.frequency.value = 180;
    var hg = ctx.createGain(); hg.gain.value = 0.05;
    hum.connect(hf); hf.connect(hg); hg.connect(g);

    simmer.start(); breathe.start(); hum.start();

    /* a car goes past now and then */
    setInterval(function () {
      if (!on || Math.random() > 0.25) return;
      var c = ctx.createBufferSource(); c.buffer = noiseBuffer(3);
      var cf = ctx.createBiquadFilter(); cf.type = 'bandpass';
      cf.frequency.setValueAtTime(180, ctx.currentTime);
      cf.frequency.linearRampToValueAtTime(90, ctx.currentTime + 2.4);
      var cg = ctx.createGain();
      cg.gain.setValueAtTime(0, ctx.currentTime);
      cg.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 1.0);
      cg.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.4);
      c.connect(cf); cf.connect(cg); cg.connect(g);
      c.start(); c.stop(ctx.currentTime + 2.5);
    }, 9000);

    return g;
  }

  function ping(freq, len, type, vol) {
    if (!on || !ctx) return;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(vol || 0.09, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (len || 0.25));
    o.connect(g); g.connect(master);
    o.start(); o.stop(ctx.currentTime + (len || 0.25) + 0.02);
  }

  global.Sound = {
    get on() { return on; },
    enable: function () {
      start();
      if (!ctx) return false;
      if (ctx.state === 'suspended') ctx.resume();
      on = true;
      master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.8);
      return true;
    },
    disable: function () {
      on = false;
      if (master) master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    },
    /* an ingredient going in */
    pick: function () { ping(520, 0.12, 'triangle', 0.05); },
    /* the bowl going down on the counter */
    serve: function () {
      ping(180, 0.18, 'sine', 0.10);
      setTimeout(function () { ping(240, 0.5, 'sine', 0.05); }, 60);
    },
    /* the phone */
    phone: function () { ping(880, 0.07, 'square', 0.03); },
    /* somebody says the thing they were not going to say */
    confide: function () {
      ping(392, 0.9, 'sine', 0.05);
      setTimeout(function () { ping(587, 1.2, 'sine', 0.035); }, 180);
    }
  };

}(window));
