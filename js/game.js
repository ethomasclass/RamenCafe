/* ===========================================================================
   game.js — state, the script player, the bench, the phone, closing up.

   One evening. Four conversations, seven bowls, no fail state: every bowl is
   eaten and nobody walks out. What a wrong bowl costs you is what you get
   told — the thing each person will only say over food that suited them.

   The flow is built once from Data.ORDER, so cutting a scene cuts its phone
   break and its notebook entry with it and nothing else has to know.
   =========================================================================== */

(function (global) {
  'use strict';

  var D = global.Data, S = global.Scenes, F = global.Feeds,
      A = global.Art, Ico = global.Icons, Snd = global.Sound;

  var SAVE = 'ramentalk.save.v1';
  var PREFS = 'ramentalk.prefs.v1';

  /* =======================================================================
     FLOW — what happens, in what order.
     ======================================================================= */

  function buildFlow() {
    var f = [{ k: 'script', id: 'open_shop' }];
    if (F.open) f.push({ k: 'feed', id: 'open' }, { k: 'idle' });
    var scenes = D.scenesInOrder();
    scenes.forEach(function (sc, i) {
      f.push({ k: 'scene', id: sc.id });
      if (F[sc.id] && i < scenes.length - 1) f.push({ k: 'feed', id: sc.id }, { k: 'idle' });
    });
    f.push({ k: 'script', id: 'closing' }, { k: 'summary' }, { k: 'end' });
    return f;
  }

  var FLOW = buildFlow();

  /* =======================================================================
     STATE
     ======================================================================= */

  var st = {
    step: 0,             /* index into FLOW */
    warmth: {},          /* character id -> 0..3 */
    outcomes: {},        /* guest id -> 'matched' | 'near' | 'mismatched' */
    bowls: {},           /* guest id -> {broth, tops} */
    heard: {},           /* guest id -> true, they told you the thing */
    knownBroths: {},
    knownTops: {},
    seenWords: {},
    seenRoom: {},
    polls: {},           /* poll index -> chosen option */
    scenesDone: {}
  };

  var prefs = { size: 2, speed: 2, sound: false };

  var el = {}, queue = [], typing = null, frame = 0, curScene = null;
  var benchGuests = [], benchAt = 0, bench = { broth: null, tops: [] };
  var asideWho = null, asideExpr = 'neutral';
  var afterBench = null, roomNoteOpen = false;

  function $(id) { return document.getElementById(id); }

  /* =======================================================================
     TEXT — glossary markup, typing, speakers
     ======================================================================= */

  function markup(text) {
    return String(text).replace(/\{\{(\w+)\|([^}]*)\}\}/g, function (_, key, words) {
      if (D.GLOSSARY[key]) st.seenWords[key] = true;
      return '<span class="gloss" data-key="' + key + '">' + words + '</span>';
    });
  }

  function plain(text) {
    return String(text).replace(/\{\{(\w+)\|([^}]*)\}\}/g, '$2');
  }

  function nameOf(id) {
    if (id === 'etsuko') return D.ETSUKO.name;
    var found = null;
    D.CAST.forEach(function (sc) {
      sc.guests.forEach(function (g) { if (g.id === id) found = g; });
    });
    return found ? found.name : '';
  }

  function guestsOf(sceneId) {
    var sc = D.CAST.filter(function (c) { return c.id === sceneId; })[0];
    return sc ? sc.guests : [];
  }

  function type(html, done) {
    var box = el.line;
    if (prefs.speed === 3) { box.innerHTML = html; if (done) done(); return; }
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    var full = html, i = 0;
    var speed = prefs.speed === 1 ? 34 : 16;
    /* type on the plain text, then swap in the marked-up version at the end,
       so a glossary span never appears half-built */
    var text = tmp.textContent;
    box.textContent = '';
    clearInterval(typing);
    typing = setInterval(function () {
      i += 1;
      box.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(typing); typing = null;
        box.innerHTML = full;
        if (done) done();
      }
    }, speed);
  }

  function finishTyping() {
    if (!typing) return false;
    clearInterval(typing); typing = null;
    el.line.innerHTML = el.line.getAttribute('data-full') || el.line.innerHTML;
    return true;
  }

  /* =======================================================================
     THE SCRIPT PLAYER
     ======================================================================= */

  function play(nodes, after) {
    queue = nodes.slice();
    queue.push({ end: true, after: after });
    step();
  }

  function step() {
    el.choices.innerHTML = '';
    el.advance.hidden = true;
    var n = queue.shift();
    if (!n) return;

    if (n.end) { if (n.after) n.after(); return; }

    /* --- stop and cook ------------------------------------------------ */
    if (n.bench) { openBench(guestsOf(curScene), step); return; }

    /* --- how each guest took their bowl -------------------------------- */
    if (n.reactions) {
      var add = [];
      guestsOf(curScene).forEach(function (g) {
        var r = (S[curScene].react || {})[g.id];
        if (r) add = add.concat(r[st.outcomes[g.id]] || []);
      });
      queue = add.concat(queue);
      step(); return;
    }

    /* --- the thing they only say over a good bowl ---------------------- */
    if (n.confessions) {
      var conf = [];
      guestsOf(curScene).forEach(function (g) {
        if (st.outcomes[g.id] === 'matched' && (S[curScene].confession || {})[g.id]) {
          conf = conf.concat(S[curScene].confession[g.id]);
          st.heard[g.id] = true;
        }
      });
      if (conf.length) { Snd.confide(); stamp(); }
      queue = conf.concat(queue);
      step(); return;
    }

    /* --- a warm closing line ------------------------------------------- */
    if (n.bonus) {
      var lines = (S[curScene].bonus || {})[n.bonus];
      if (lines && (st.warmth[n.bonus] || 0) >= 2) queue = lines.concat(queue);
      step(); return;
    }

    /* --- somebody speaks ----------------------------------------------- */
    if (n.say !== undefined) {
      A.setSpeaker(n.who, n.expr || 'neutral');
      showAside(n.who, n.expr || 'neutral');
      el.speaker.textContent = nameOf(n.who);
      el.line.className = 'line';
      var html = markup(n.say);
      el.line.setAttribute('data-full', html);
      type(html, function () { el.advance.hidden = false; });
      return;
    }

    if (n.narrate !== undefined) {
      A.setSpeaker(null, 'neutral');
      showAside(null);
      el.speaker.textContent = '';
      el.line.className = 'line narrate';
      var nh = markup(n.narrate);
      el.line.setAttribute('data-full', nh);
      type(nh, function () { el.advance.hidden = false; });
      return;
    }

    /* --- the player says something -------------------------------------- */
    if (n.choose) {
      el.advance.hidden = true;
      n.choose.forEach(function (opt) {
        var btn = document.createElement('button');
        btn.className = 'choice';
        btn.innerHTML = (opt.tone ? '<span class="tone">' + opt.tone + '</span>' : '') + plain(opt.label);
        btn.onclick = function () {
          if (opt.warm) st.warmth[opt.warm] = Math.min(3, (st.warmth[opt.warm] || 0) + 1);
          el.choices.innerHTML = '';
          queue = (opt.then || []).concat(queue);
          step();
        };
        el.choices.appendChild(btn);
      });
      return;
    }

    step();
  }

  /* Etsuko is not at the counter — she is next to you. Anybody who is not
     sitting down gets a bust at the edge and their own card. */
  function showAside(who, ex) {
    var seated = curScene && guestsOf(curScene).some(function (g) { return g.id === who; });
    if (who && !seated) {
      asideWho = who; asideExpr = ex || 'neutral';
      el.asideBox.hidden = false;
      el.dialogue.classList.add('aside-on');
    } else {
      asideWho = null;
      el.asideBox.hidden = true;
      el.dialogue.classList.remove('aside-on');
    }
  }

  /* the stamp that marks somebody telling you the thing */
  function stamp() {
    el.hanko.hidden = true;
    void el.hanko.offsetWidth;
    el.hanko.hidden = false;
    setTimeout(function () { el.hanko.hidden = true; }, 1950);
  }

  /* a screen closing and opening again between scenes */
  var wiping = false;
  function wipe(then) {
    if (wiping) { then(); return; }
    wiping = true;
    el.shoji.hidden = false;
    requestAnimationFrame(function () { el.shoji.classList.add('shut'); });
    setTimeout(function () {
      then();
      setTimeout(function () {
        el.shoji.classList.remove('shut');
        setTimeout(function () { el.shoji.hidden = true; wiping = false; }, 460);
      }, 140);
    }, 450);
  }

  function advance() {
    if (finishTyping()) { el.advance.hidden = false; return; }
    if (el.choices.children.length) return;
    if (el.advance.hidden) return;
    step();
  }

  /* =======================================================================
     THE BENCH — one bowl per guest, in order
     ======================================================================= */

  function openBench(guests, after) {
    benchGuests = guests.slice();
    benchAt = 0; afterBench = after;
    nextBowl();
  }

  function nextBowl() {
    if (benchAt >= benchGuests.length) {
      el.bench.hidden = true;
      save();
      if (afterBench) afterBench();
      return;
    }
    bench = { broth: null, tops: [] };
    var g = benchGuests[benchAt];
    el.benchWho.textContent = g.name;
    el.benchOrder.textContent = g.order;
    el.bench.hidden = false;
    renderShelf();
    renderBowl();
  }

  function renderShelf() {
    el.brothRow.innerHTML = '';
    D.BROTHS.forEach(function (br) {
      var d = document.createElement('button');
      d.className = 'ing' + (bench.broth === br.id ? ' on' : '');
      d.appendChild(Ico.brothIcon(br.id, 1.6));
      var nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = br.name;
      var jp = document.createElement('span'); jp.className = 'jp'; jp.textContent = br.jp;
      d.appendChild(nm); d.appendChild(jp);
      d.onclick = function () {
        bench.broth = br.id;
        st.knownBroths[br.id] = true;
        Snd.pick(); renderShelf(); renderBowl();
      };
      el.brothRow.appendChild(d);
    });

    el.topRow.innerHTML = '';
    D.TOPPINGS.forEach(function (t) {
      var chosen = bench.tops.indexOf(t.id) !== -1;
      var full = bench.tops.length >= 2 && !chosen;
      var d = document.createElement('button');
      d.className = 'ing' + (chosen ? ' on' : '') + (full ? ' off' : '');
      d.appendChild(Ico.toppingIcon(t.id, 1.5));
      var nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = t.name;
      d.appendChild(nm);
      d.onclick = function () {
        if (chosen) bench.tops.splice(bench.tops.indexOf(t.id), 1);
        else if (bench.tops.length < 2) { bench.tops.push(t.id); st.knownTops[t.id] = true; }
        else return;
        Snd.pick(); renderShelf(); renderBowl();
      };
      el.topRow.appendChild(d);
    });
  }

  function renderBowl() {
    var x = el.bowlArt.getContext('2d');
    Ico.drawBowl(x, el.bowlArt.width, el.bowlArt.height, bench.broth, bench.tops, frame);
    var br = bench.broth ? D.byId(D.BROTHS, bench.broth) : null;
    el.bowlName.textContent = br ? br.name : 'an empty bowl';
    el.bowlParts.textContent = bench.tops.length
      ? 'with ' + bench.tops.map(function (t) { return D.byId(D.TOPPINGS, t).name.toLowerCase(); }).join(' and ')
      : (br ? 'no toppings yet' : '');
    el.benchStep.textContent = !bench.broth ? 'Pick a broth'
      : bench.tops.length < 2 ? 'Pick ' + (2 - bench.tops.length) + ' more topping' + (bench.tops.length === 1 ? '' : 's')
      : 'Ready';
    el.serveBtn.disabled = !(bench.broth && bench.tops.length === 2);
  }

  function serve() {
    var g = benchGuests[benchAt];
    var v = D.verdict(g, bench.broth, bench.tops);
    st.outcomes[g.id] = v.outcome;
    st.bowls[g.id] = { broth: bench.broth, tops: bench.tops.slice() };
    Snd.serve();
    benchAt++;
    nextBowl();
  }

  /* =======================================================================
     THE PHONE
     ======================================================================= */

  function showFeed(id, after) {
    var posts = F[id] || [];
    el.feed.innerHTML = '';
    el.phoneClock.textContent = posts.length ? posts[posts.length - 1].time : '21:30';

    posts.forEach(function (p, i) {
      var d = document.createElement('div');
      d.className = 'post' + (p.reply ? ' reply' : '');
      var head = '<div class="post-head">' +
        '<span class="pfp" style="background:' + (p.colour || '#888') + '">' + (p.av || '?') + '</span>' +
        '<span class="p-name">' + p.name + '</span>' +
        (p.verified ? '<span class="p-badge">&#10004;</span>' : '') +
        '<span class="p-handle">' + p.handle + '</span>' +
        '<span class="p-time">&middot; ' + p.time + '</span></div>';
      var body = '<div class="post-body">' + markup(p.body) + '</div>';
      var quoted = p.quote ? '<div class="post-quoted"><b>' + p.quote.name + '</b> <span class="p-handle">' +
        p.quote.handle + '</span><br>' + markup(p.quote.body) + '</div>' : '';
      d.innerHTML = head + body + quoted;

      if (p.poll) d.appendChild(pollEl(p.poll, id + ':' + i));

      var stats = document.createElement('div');
      stats.className = 'post-stats';
      stats.innerHTML = '<span>&#8635; ' + (p.rt || '') + '</span><span>&#9825; ' + (p.likes || '') + '</span>';
      d.appendChild(stats);
      el.feed.appendChild(d);
    });

    var endm = document.createElement('div');
    endm.className = 'feed-end';
    endm.textContent = 'You have reached the end of the timeline.';
    el.feed.appendChild(endm);
    el.feed.scrollTop = 0;

    el.phone.hidden = false;
    el.phoneBtn.hidden = false;
    Snd.phone();
    el.phoneClose.onclick = function () {
      el.phone.hidden = true;
      el.phoneBtn.hidden = true;
      if (after) after();
    };
  }

  function pollEl(poll, key) {
    var wrap = document.createElement('div');
    wrap.className = 'poll';

    function draw() {
      wrap.innerHTML = '';
      var chosen = st.polls[key];
      if (chosen === undefined) {
        poll.opts.forEach(function (o, i) {
          var btn = document.createElement('button');
          btn.className = 'poll-opt'; btn.textContent = o;
          btn.onclick = function () { st.polls[key] = i; Snd.pick(); draw(); };
          wrap.appendChild(btn);
        });
      } else {
        poll.opts.forEach(function (o, i) {
          var row = document.createElement('div');
          row.className = 'poll-res';
          row.innerHTML = '<div class="poll-fill" style="width:' + poll.res[i] + '%"></div>' +
            '<div class="poll-txt' + (chosen === i ? ' you' : '') + '"><span>' +
            o + (chosen === i ? ' &#10004;' : '') + '</span><span>' + poll.res[i] + '%</span></div>';
          wrap.appendChild(row);
        });
        var tot = document.createElement('div');
        tot.className = 'poll-total'; tot.textContent = poll.total || '';
        wrap.appendChild(tot);
      }
    }
    draw();
    return wrap;
  }

  /* =======================================================================
     THE EMPTY SHOP — a beat between customers, and the room to poke at
     ======================================================================= */

  function idle(after) {
    A.setSeats([]);
    A.setSpeaker(null);
    el.speaker.textContent = '';
    el.line.className = 'line narrate';
    el.line.innerHTML = 'The shop is empty. Somewhere behind you the pot ticks over. ' +
      '<span class="quiet">(Click anything in the room to look at it.)</span>';
    el.advance.hidden = true;
    el.choices.innerHTML = '';
    var btn = document.createElement('button');
    btn.className = 'choice';
    btn.innerHTML = '<span class="tone">Wait</span>Wipe down the counter and see who comes in.';
    btn.onclick = function () { el.choices.innerHTML = ''; after(); };
    el.choices.appendChild(btn);
  }

  function roomNote(key) {
    var r = D.ROOM[key];
    if (!r) return;
    st.seenRoom[key] = true;
    el.popTerm.textContent = r.name;
    el.popDef.innerHTML = markup(r.text);
    el.pop.hidden = false;
    roomNoteOpen = true;
  }

  /* =======================================================================
     THE NOTEBOOK
     ======================================================================= */

  function openBook() {
    el.bookBroths.innerHTML = '';
    D.BROTHS.forEach(function (br) {
      var known = st.knownBroths[br.id];
      var d = document.createElement('div');
      d.className = 'entry' + (known ? '' : ' locked');
      d.appendChild(Ico.brothIcon(known ? br.id : 'shio', 1.4));
      var t = document.createElement('div');
      t.innerHTML = known
        ? '<div class="e-name">' + br.name + '<span class="jp">' + br.jp + '</span></div>' +
          '<div class="e-say">(' + br.say + ') &middot; ' + br.region + '</div>' +
          '<div class="e-desc">' + br.desc + '<br><span class="e-say">' + br.more + '</span></div>'
        : '<div class="e-name">' + br.name + '</div><div class="e-desc">not cooked yet</div>';
      d.appendChild(t);
      el.bookBroths.appendChild(d);
    });

    el.bookTops.innerHTML = '';
    D.TOPPINGS.forEach(function (t) {
      var known = st.knownTops[t.id];
      var d = document.createElement('div');
      d.className = 'entry' + (known ? '' : ' locked');
      d.appendChild(Ico.toppingIcon(t.id, 1.2));
      var body = document.createElement('div');
      body.innerHTML = known
        ? '<div class="e-name">' + t.name + '<span class="jp">' + t.jp + '</span></div>' +
          '<div class="e-desc">' + t.desc + ' <span class="e-say">' + t.more + '</span></div>'
        : '<div class="e-name">' + t.name + '</div><div class="e-desc">not used yet</div>';
      d.appendChild(body);
      el.bookTops.appendChild(d);
    });

    Ico.drawMap(el.mapArt.getContext('2d'), el.mapArt.width, el.mapArt.height, st.knownBroths);

    el.bookMargin.innerHTML = '';
    var any = false;
    D.scenesInOrder().forEach(function (sc) {
      if (!st.scenesDone[sc.id]) return;
      any = true;
      var m = D.MARGIN[sc.id];
      var d = document.createElement('div');
      d.className = 'mg';
      d.innerHTML = '<b>' + m.head + '</b>' + m.note;
      el.bookMargin.appendChild(d);
    });
    if (!any) el.bookMargin.innerHTML = '<div class="mg quiet">Nothing written down yet.</div>';

    el.book.hidden = false;
  }

  function openWords() {
    el.wordList.innerHTML = '';
    Object.keys(D.GLOSSARY).forEach(function (k) {
      var g = D.GLOSSARY[k];
      var d = document.createElement('div');
      d.className = 'word' + (st.seenWords[k] ? '' : ' unseen');
      d.innerHTML = '<b>' + g.term + (g.jp ? ' <span class="jp">' + g.jp + '</span>' : '') + '</b>' +
        (st.seenWords[k] ? g.def : 'You have not met this one yet.');
      el.wordList.appendChild(d);
    });
    el.words.hidden = false;
  }

  /* =======================================================================
     CLOSING SUMMARY
     ======================================================================= */

  function summary() {
    var heard = 0, total = 0, lines = '';
    D.scenesInOrder().forEach(function (sc) {
      sc.guests.forEach(function (g) {
        if (!(S[sc.id].confession || {})[g.id]) return;
        total++;
        var got = st.heard[g.id];
        if (got) heard++;
        lines += '<div class="close-line"><span class="who">' + g.name + '</span> — ' +
          (got
            ? '<span class="heard">told you the thing they had not told anyone.</span>'
            : '<span class="missed">ate what you gave them, said thank you, and kept it to themselves.</span>') +
          '</div>';
      });
    });

    var brothsKnown = Object.keys(st.knownBroths).length;
    var topsKnown = Object.keys(st.knownTops).length;
    var wordsMet = Object.keys(st.seenWords).length;

    el.closeBody.innerHTML =
      '<div class="close-sec"><h3>Who talked to you</h3>' + lines + '</div>' +
      '<div class="close-sec"><h3>The night, counted</h3><div class="tally">' +
        '<b>' + heard + ' of ' + total + '</b> people told you the thing they were not going to say.<br>' +
        '<b>' + brothsKnown + ' of ' + D.BROTHS.length + '</b> broths cooked &middot; ' +
        '<b>' + topsKnown + ' of ' + D.TOPPINGS.length + '</b> toppings used<br>' +
        '<b>' + wordsMet + '</b> of the words in the back of the notebook turned up in conversation.' +
      '</div></div>' +
      '<div class="close-sec"><h3>What everybody was actually talking about</h3>' +
        '<div class="close-line">Daiki drives to a hospital twice a month because he is one working-age adult and there is one of him. That is the <b>old-age dependency ratio</b> with a steering wheel.</div>' +
        '<div class="close-line">Kenji’s street lost its shops because it ran out of people, not customers — <b>rural depopulation</b> — and Mary is here because a country short of care workers opened a door it does not like talking about.</div>' +
        '<div class="close-line">Aiko is not undecided. She is doing arithmetic, and ¥600,000 does not change it. That is why <b>pro-natalist policy</b> keeps not working.</div>' +
        '<div class="close-line">Tanaka has voted in every election since 1971 and Yui’s neighbours mostly have not. Nobody in that council room is greedy. They are just the ones who came.</div>' +
      '</div>';

    el.closing.hidden = false;
  }

  function endcard() {
    A.endArt(el.endArt);
    el.endList.innerHTML = D.TIMELINE.map(function (t) {
      return '<div class="yr"><b>' + t.yr + '</b><span>' + t.ev + '</span></div>';
    }).join('');
    el.endcard.hidden = false;
  }

  /* =======================================================================
     THE FLOW
     ======================================================================= */

  function runStep() {
    var f = FLOW[st.step];
    if (!f) return;
    save();

    if (f.k === 'script') {
      if (f.id === 'closing') { wipe(function () { runScript(f); }); return; }
      runScript(f);
      return;
    }

    if (f.k === 'scene') {
      wipe(function () {
        curScene = f.id;
        var g = guestsOf(f.id).map(function (x) { return x.id; });
        A.setSeats(g);
        A.setPhase(st.step / FLOW.length);
        A.gust();
        progress();
        play(S[f.id].script, function () { st.scenesDone[f.id] = true; next(); });
      });
      return;
    }

    if (f.k === 'feed') { showFeed(f.id, next); return; }
    if (f.k === 'idle') { idle(next); return; }
    if (f.k === 'summary') { summary(); return; }
    if (f.k === 'end') { endcard(); return; }
  }

  function runScript(f) {
    curScene = f.id;
    A.setSeats([]);
    play(S[f.id].script, next);
  }

  function next() { st.step++; runStep(); }

  function progress() {
    var scenes = D.scenesInOrder();
    var done = scenes.filter(function (s) { return st.scenesDone[s.id]; }).length;
    el.progress.textContent = 'customer ' + Math.min(scenes.length, done + 1) + ' of ' + scenes.length;
  }

  /* =======================================================================
     SAVE / PREFS
     ======================================================================= */

  function save() {
    try { localStorage.setItem(SAVE, JSON.stringify(st)); } catch (e) { /* private mode */ }
  }
  function loadSave() {
    try {
      var raw = localStorage.getItem(SAVE);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function savePrefs() {
    try { localStorage.setItem(PREFS, JSON.stringify(prefs)); } catch (e) { /* ignore */ }
  }
  function loadPrefs() {
    try {
      var raw = localStorage.getItem(PREFS);
      if (raw) prefs = JSON.parse(raw);
    } catch (e) { /* ignore */ }
    applyPrefs();
  }
  function applyPrefs() {
    document.body.className = 'size-' + prefs.size;
    el.soundBtn.textContent = prefs.sound ? 'Sound on' : 'Sound off';
  }

  /* =======================================================================
     TITLE SCREEN
     ======================================================================= */

  var slide = 1;
  function showSlide(n) {
    slide = n;
    var all = document.querySelectorAll('.slide');
    for (var i = 0; i < all.length; i++) all[i].hidden = (i + 1 !== n);
    el.slideBack.hidden = (n === 1);
    el.slideNext.hidden = (n === all.length);
    el.beginBtn.hidden = (n !== all.length);
    el.slideDots.innerHTML = '';
    for (var d = 1; d <= all.length; d++) {
      var i2 = document.createElement('i');
      if (d === n) i2.className = 'on';
      el.slideDots.appendChild(i2);
    }
  }

  function begin(resume) {
    if (!resume) {
      st = { step: 0, warmth: {}, outcomes: {}, bowls: {}, heard: {},
             knownBroths: {}, knownTops: {}, seenWords: {}, seenRoom: {},
             polls: {}, scenesDone: {} };
    }
    el.title.hidden = true;
    el.dialogue.hidden = false;
    progress();
    runStep();
  }

  /* =======================================================================
     WIRING
     ======================================================================= */

  function boot() {
    ['stage', 'dialogue', 'speaker', 'line', 'choices', 'advance', 'title', 'titleArt',
     'asideBox', 'asideArt', 'shoji', 'hanko',
     'slideBack', 'slideNext', 'beginBtn', 'slideDots', 'resumeRow', 'resumeBtn', 'freshBtn',
     'bench', 'benchWho', 'benchOrder', 'benchStep', 'brothRow', 'topRow', 'bowlArt',
     'bowlName', 'bowlParts', 'tipBtn', 'serveBtn', 'phone', 'phoneBtn', 'feed', 'phoneClose',
     'phoneClock', 'book', 'bookBtn', 'bookClose', 'bookBroths', 'bookTops', 'mapArt',
     'bookMargin', 'words', 'wordsBtn', 'wordsClose', 'wordList', 'pop', 'popTerm', 'popDef',
     'popClose', 'settings', 'settingsBtn', 'setClose', 'sizeBtns', 'speedBtns', 'soundBtn',
     'closing', 'closeBody', 'stepOut', 'endcard', 'endArt', 'endList', 'endRestart', 'progress'
    ].forEach(function (id) { el[id] = $(id); });

    A.init(el.stage);
    A.titleArt(el.titleArt);
    loadPrefs();
    showSlide(1);

    var saved = loadSave();
    if (saved && saved.step > 0 && saved.step < FLOW.length - 2) {
      el.resumeRow.hidden = false;
      el.resumeBtn.onclick = function () { st = saved; begin(true); };
      el.freshBtn.onclick = function () { el.resumeRow.hidden = true; };
    }

    el.slideNext.onclick = function () { showSlide(slide + 1); };
    el.slideBack.onclick = function () { showSlide(slide - 1); };
    el.beginBtn.onclick = function () { begin(false); };

    /* advancing the conversation */
    el.dialogue.onclick = function (e) {
      if (e.target.classList.contains('gloss')) return;
      advance();
    };
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        [el.book, el.words, el.settings, el.pop].forEach(function (o) { o.hidden = true; });
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        if (el.title.hidden && el.bench.hidden && el.phone.hidden && el.book.hidden &&
            el.words.hidden && el.pop.hidden && el.closing.hidden && el.endcard.hidden) {
          e.preventDefault(); advance();
        }
      }
    });

    /* glossary terms, wherever they appear */
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.classList && t.classList.contains('gloss')) {
        var g = D.GLOSSARY[t.getAttribute('data-key')];
        if (!g) return;
        el.popTerm.innerHTML = g.term + (g.jp ? ' <span class="jp">' + g.jp + '</span>' : '');
        el.popDef.innerHTML = g.def;
        el.pop.hidden = false;
      }
    });
    el.popClose.onclick = function () { el.pop.hidden = true; roomNoteOpen = false; };

    /* the room, when there is nobody in it */
    el.stage.onclick = function (e) {
      if (!el.choices.querySelector('.choice')) return;   /* only while idle */
      var r = el.stage.getBoundingClientRect();
      var mx = (e.clientX - r.left) / r.width * 384;
      var my = (e.clientY - r.top) / r.height * 216;
      var key = A.hitTest(mx, my);
      if (key) roomNote(key);
    };

    /* bench */
    el.serveBtn.onclick = serve;
    el.tipBtn.onclick = function () { bench = { broth: null, tops: [] }; renderShelf(); renderBowl(); };

    /* panels */
    el.bookBtn.onclick = openBook;
    el.bookClose.onclick = function () { el.book.hidden = true; };
    el.wordsBtn.onclick = openWords;
    el.wordsClose.onclick = function () { el.words.hidden = true; };
    el.phoneBtn.onclick = function () { el.phone.hidden = false; };
    el.settingsBtn.onclick = function () { el.settings.hidden = false; renderSettings(); };
    el.setClose.onclick = function () { el.settings.hidden = true; };
    el.soundBtn.onclick = function () {
      prefs.sound = !prefs.sound;
      if (prefs.sound) { if (!Snd.enable()) prefs.sound = false; } else Snd.disable();
      applyPrefs(); savePrefs();
    };

    el.stepOut.onclick = function () { el.closing.hidden = true; st.step++; runStep(); };
    el.endRestart.onclick = function () {
      el.endcard.hidden = true; el.title.hidden = false;
      el.resumeRow.hidden = true; showSlide(1);
    };

    if (prefs.sound) { prefs.sound = false; applyPrefs(); }  /* browsers need a click first */

    (function loop() {
      frame++;
      A.drawRoom(frame);
      if (asideWho) A.portrait(el.asideArt, asideWho, asideExpr, frame);
      if (!el.bench.hidden) renderBowl();
      requestAnimationFrame(loop);
    }());
  }

  function renderSettings() {
    el.sizeBtns.innerHTML = '';
    [1, 2, 3, 4].forEach(function (n) {
      var b2 = document.createElement('button');
      b2.textContent = 'A'; b2.style.fontSize = (10 + n * 2) + 'px';
      if (prefs.size === n) b2.className = 'on';
      b2.onclick = function () { prefs.size = n; applyPrefs(); savePrefs(); renderSettings(); };
      el.sizeBtns.appendChild(b2);
    });
    el.speedBtns.innerHTML = '';
    [['Slow', 1], ['Normal', 2], ['All at once', 3]].forEach(function (p) {
      var b2 = document.createElement('button');
      b2.textContent = p[0];
      if (prefs.speed === p[1]) b2.className = 'on';
      b2.onclick = function () { prefs.speed = p[1]; savePrefs(); renderSettings(); };
      el.speedBtns.appendChild(b2);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  void roomNoteOpen;

}(window));
