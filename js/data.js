/* ===========================================================================
   data.js — the shelf, the cast, the words, the map, the end card.

   Everything here is content, not machinery. Nothing in this file knows how
   the game works; game.js reads it and scenes.js writes against it.

   TO CUT THE GAME SHORT: delete an entry from ORDER at the bottom. Nothing
   breaks — the notebook, the closing screen and the progress counter all
   follow that list. Keep 'tanaka_yui' last if you keep it at all; the closing
   scene answers it.
   =========================================================================== */

(function (global) {
  'use strict';

  /* =======================================================================
     THE BROTHS — four real regional styles.

     `tags` are what a bowl says about itself. A customer's `wants` are
     matched against the tags of the broth and both toppings together, so
     there is never one correct bowl, only bowls that suit somebody and
     bowls that don't.
     ======================================================================= */

  var BROTHS = [
    { id: 'tonkotsu', name: 'Hakata Tonkotsu', jp: '博多とんこつ',
      say: 'hah-KAH-tah ton-KOTS',
      region: 'Fukuoka, on Kyushu — the south',
      map: { x: 34, y: 199 },
      desc: 'Pork bone boiled hard for hours until the broth turns cloudy and white. Thin, straight noodles. The signature of Japan’s southern island.',
      more: 'Hakata shops expect you to eat fast, so the portion is small and the noodles are thin — and when you finish them there is still broth in the bowl. That is what kaedama is for: you call for a second helping of noodles and drop them straight in.',
      tags: ['rich', 'bold', 'hearty', 'traditional'],
      colour: '#efe6dc' },

    { id: 'miso', name: 'Sapporo Miso', jp: '札幌みそ',
      say: 'sah-POH-roh MEE-soh',
      region: 'Sapporo, on Hokkaido — the far north',
      map: { x: 150, y: 34 },
      desc: 'Fermented soybean paste stirred into a pork-and-vegetable broth. Thick curly noodles. Usually crowned with corn and a slab of butter.',
      more: 'Younger than it tastes: a Sapporo cook put miso in ramen in the 1950s, and the corn and butter came from Hokkaido being Japan’s dairy and corn country. A regional tradition can be about seventy years old and still be a tradition.',
      tags: ['hearty', 'warming', 'sweet', 'modern'],
      colour: '#c98a42' },

    { id: 'shoyu', name: 'Kitakata Shoyu', jp: '喜多方しょうゆ',
      say: 'kee-TAH-kah-tah SHOH-yoo',
      region: 'Kitakata, in Fukushima — the Tohoku region',
      map: { x: 128, y: 120 },
      desc: 'A clear brown soy-sauce broth with flat, wide, wavy noodles. One of the three oldest ramen towns in the country.',
      more: 'Kitakata has something like a hundred ramen shops for a town of forty thousand people, and people there eat ramen for breakfast. It is also, like this town, losing residents every year — the shops are outlasting the customers.',
      tags: ['plain', 'classic', 'nostalgic', 'traditional'],
      colour: '#b9793a' },

    { id: 'shio', name: 'Hakodate Shio', jp: '函館しお',
      say: 'hah-KOH-dah-teh SHEE-oh',
      region: 'Hakodate, on Hokkaido — the northern port',
      map: { x: 143, y: 62 },
      desc: 'Salt, and almost nothing else. A pale gold broth you can see the bottom of. The oldest and plainest of the four.',
      more: 'Hakodate was one of the first ports opened to foreign ships in 1859, and Chinese cooks working there are part of how noodles in soup became a Japanese dish at all. Every bowl in this shop is descended from somebody’s immigrant grandmother.',
      tags: ['plain', 'clear', 'light', 'old'],
      colour: '#e8d49a' }
  ];

  /* =======================================================================
     THE TOPPINGS — pick two.
     ======================================================================= */

  var TOPPINGS = [
    { id: 'chashu', name: 'Chashu', jp: 'チャーシュー',
      desc: 'Rolled pork belly, simmered slow in soy and sugar, sliced thin.',
      more: 'The name comes from Chinese char siu, though the cooking method went its own way once it got here.',
      tags: ['rich', 'hearty'], colour: '#b5714a' },

    { id: 'ajitama', name: 'Ajitama egg', jp: '味玉',
      desc: 'A soft-boiled egg marinated overnight. The yolk should still run a little.',
      more: 'Ajitama means "seasoned egg". Getting the yolk right is the fussiest thing on this shelf and the thing regulars notice first.',
      tags: ['rich', 'comforting'], colour: '#f3c34a' },

    { id: 'menma', name: 'Menma', jp: 'メンマ',
      desc: 'Bamboo shoots, fermented and then dried. Sour, salty, chewy.',
      more: 'Fermented bamboo arrived from China and Taiwan; for decades most menma in Japan was imported, which made a shelf staple quietly dependent on somebody else’s harvest.',
      tags: ['traditional', 'savory'], colour: '#c9a24a' },

    { id: 'nori', name: 'Nori', jp: '海苔',
      desc: 'A sheet of dried seaweed, stood up against the side of the bowl.',
      more: 'You are meant to push it under, let it go soft, and wrap a mouthful of noodles in it before it dissolves.',
      tags: ['plain', 'classic'], colour: '#26332c' },

    { id: 'negi', name: 'Scallion', jp: 'ねぎ',
      desc: 'Green onion, sliced fine. Nearly every bowl in Japan gets some.',
      more: 'It is there to cut the fat. A heavy broth without something sharp on top gets tiring by the halfway mark.',
      tags: ['fresh', 'plain'], colour: '#8fbf5a' },

    { id: 'corn', name: 'Sweetcorn', jp: 'コーン',
      desc: 'A scoop of sweetcorn, northern style.',
      more: 'Hokkaido grows most of Japan’s corn, which is the whole reason it ends up in a Sapporo bowl and almost never in a Hakata one.',
      tags: ['sweet', 'modern'], colour: '#f2c53d' },

    { id: 'butter', name: 'Butter', jp: 'バター',
      desc: 'A pat of butter, melting into the top of the broth.',
      more: 'Hokkaido dairy again. Purists grumble about it. It has been on menus for sixty years and the grumbling has changed nothing.',
      tags: ['rich', 'warming', 'modern'], colour: '#f6e6a8' },

    { id: 'naruto', name: 'Narutomaki', jp: '鳴門巻き',
      desc: 'A slice of white fish cake with a pink spiral cut through it.',
      more: 'Named for the whirlpools in the Naruto Strait. It is old-fashioned now — you see it in cartoons more than in new shops, which is exactly why some people order it.',
      tags: ['classic', 'nostalgic'], colour: '#f6f0ea' }
  ];

  /* =======================================================================
     THE CAST

     One scene per entry. `guests` are the people who sit down and order;
     Etsuko is behind the counter all night and never orders anything.

     `wants` are matched against the tags on the bowl. Three hits or more is
     a bowl that suited them, and that is the only thing that unlocks the
     confession. Two is near. One or none is a bowl they eat politely.
     ======================================================================= */

  var ETSUKO = { id: 'etsuko', name: 'Etsuko', jp: '悦子', role: 'your grandmother, 74' };

  var CAST = [

    { id: 'daiki',
      title: 'Your uncle comes in',
      teaches: 'old-age dependency ratio; the caregiving burden on working-age adults',
      term: 'dependency ratio',
      guests: [
        { id: 'daiki', name: 'Daiki', jp: '大輝', role: 'Etsuko’s son, 46',
          order: 'Whatever’s fastest. He has not eaten since a conbini rice ball at seven this morning and he keeps looking at his phone.',
          wants: ['rich', 'hearty', 'comforting', 'warming'] }
      ] },

    { id: 'kenji_mary',
      title: 'Kenji, and the woman who looks after him',
      teaches: 'rural depopulation; the silver economy outside the cities; migrant care work',
      term: 'depopulation',
      guests: [
        { id: 'kenji', name: 'Kenji', jp: '健二', role: 'a retired greengrocer, 81',
          order: 'The plainest thing you have. He says he has been eating the same bowl since 1968 and sees no reason to review the decision.',
          wants: ['plain', 'clear', 'old', 'classic'] },
        { id: 'mary', name: 'Mary', jp: 'メアリー', role: 'his care worker, 34',
          order: 'Something rich and a little sweet. She learned to like this the year she arrived and orders it every time, slightly defensively.',
          wants: ['rich', 'sweet', 'modern', 'bold'] }
      ] },

    { id: 'aiko_ren',
      title: 'The couple from the new apartments',
      teaches: 'falling fertility; why pro-natalist policy mostly fails',
      term: 'total fertility rate',
      guests: [
        { id: 'aiko', name: 'Aiko', jp: '愛子', role: 'a project manager, 33',
          order: 'Northern broth, and keep it simple — she has had a day and does not want to be asked questions about it.',
          wants: ['warming', 'plain', 'fresh', 'hearty'] },
        { id: 'ren', name: 'Ren', jp: '蓮', role: 'her husband, 34',
          order: 'The same broth as his wife, and then everything comfortable you can put on it. He is not embarrassed about this.',
          wants: ['sweet', 'warming', 'rich', 'comforting'] }
      ] },

    { id: 'tanaka_yui',
      title: 'The councilman and his daughter',
      teaches: 'political consequences — who votes, and what gets funded',
      term: 'voter turnout',
      guests: [
        { id: 'tanaka', name: 'Tanaka', jp: '田中', role: 'retired town councilman, 76',
          order: 'Southern broth, done properly, the way he had it as a young man in Fukuoka. No modern nonsense on top.',
          wants: ['traditional', 'bold', 'rich', 'savory'] },
        { id: 'yui', name: 'Yui', jp: '結衣', role: 'his daughter, urban planner, 38',
          order: 'The same broth as her father, but she wants it sharp and she is going to ask for a noodle refill afterwards.',
          wants: ['bold', 'rich', 'fresh', 'modern'] }
      ] }
  ];

  /* The running order. Delete entries to shorten the night. */
  var ORDER = ['daiki', 'kenji_mary', 'aiko_ren', 'tanaka_yui'];

  function scenesInOrder() {
    return ORDER.map(function (id) {
      return CAST.filter(function (c) { return c.id === id; })[0];
    }).filter(Boolean);
  }

  function byId(list, id) {
    return list.filter(function (x) { return x.id === id; })[0] || null;
  }

  /* How well a bowl suits a guest. Three want-tags met or more is a match. */
  function verdict(guest, brothId, toppingIds) {
    var tags = [];
    var b = byId(BROTHS, brothId);
    if (b) tags = tags.concat(b.tags);
    toppingIds.forEach(function (t) {
      var o = byId(TOPPINGS, t);
      if (o) tags = tags.concat(o.tags);
    });
    var hits = 0;
    guest.wants.forEach(function (w) { if (tags.indexOf(w) !== -1) hits++; });
    return { hits: hits, outcome: hits >= 3 ? 'matched' : hits === 2 ? 'near' : 'mismatched' };
  }

  /* =======================================================================
     THE WORDS

     Every {{key|words on screen}} in scenes.js or feed.js points here. A
     term the student has actually met on screen shows in full in the Words
     panel; the rest stay greyed until they turn up.
     ======================================================================= */

  var GLOSSARY = {
    aging: { term: 'aging population', jp: '高齢化',
      def: 'A population where the share of older people is rising and the share of children is falling. It happens when people have fewer babies and live longer at the same time — which is most of the rich world, and Japan first and fastest.' },

    dependency: { term: 'dependency ratio',
      def: 'The number of people too young or too old to be working, compared to every 100 people of working age (15–64). Split it up and you get the <b>child dependency ratio</b> and the <b>old-age dependency ratio</b>. A high ratio means fewer workers supporting more non-workers — through taxes, and through showing up in person.' },

    oldage: { term: 'old-age dependency ratio',
      def: 'People 65 and over for every 100 people of working age. Japan’s is above 50 — roughly two working-age adults for every retired person, and falling. In 1970 it was about ten per hundred.' },

    tfr: { term: 'total fertility rate', jp: '合計特殊出生率',
      def: 'The average number of children a woman would have over her lifetime at current rates. Japan’s is about 1.2. Anything under about 2.1 means each generation is smaller than the one before it.' },

    replacement: { term: 'replacement level',
      def: 'A fertility rate of about 2.1 children per woman — the level that keeps a population the same size without immigration. Two to replace the parents, and a fraction over for children who do not survive to have their own.' },

    natdecrease: { term: 'natural decrease',
      def: 'More deaths than births in a year, so the population shrinks on its own regardless of anybody moving in or out. Japan has been in natural decrease every year since 2007.' },

    lifeexp: { term: 'life expectancy',
      def: 'How long an average newborn can expect to live. Japan’s is around 84, among the highest anywhere. Longer life is a triumph and a bill at the same time: the same person draws a pension for twenty-five years instead of eight.' },

    pronatal: { term: 'pro-natalist policy', jp: '少子化対策',
      def: 'Government spending meant to get people to have more children — cash payments per baby, free daycare, subsidised fertility treatment, paid leave. Japan has spent decades on it. The birth rate has kept falling. The usual explanation is that the money is small next to the real costs: housing, hours, careers, and who is expected to stop working.' },

    silver: { term: 'silver economy',
      def: 'The whole business of selling to old people — care homes, adult diapers, handrails, easy-open packaging, hearing aids. In an aging country it is one of the few markets that grows. It also concentrates where old people can pay, which is not usually a shrinking rural town.' },

    depop: { term: 'depopulation', jp: '過疎',
      def: 'A place losing residents faster than it gains them. In rural Japan it runs on two engines at once: young people leaving for cities, and the people left behind being too old to have children. The Japanese word, kaso, has been a formal government category since 1970.' },

    akiya: { term: 'akiya', jp: '空き家',
      def: 'An empty house. Japan has roughly nine million, many inherited by children who live in cities and cannot sell, rent, or afford to demolish them. They are the most visible thing about a shrinking town.' },

    labor: { term: 'labor shortage',
      def: 'More jobs than workers to fill them. It is the direct consequence of a small generation replacing a large one, and it hits care work, construction, farming and small shops first — the jobs that cannot be moved somewhere else.' },

    migrant: { term: 'foreign worker program', jp: '技能実習・特定技能',
      def: 'Japan does not describe itself as an immigration country, but it now runs several visa routes for foreign workers, including one specifically for nursing care. It is one of the two standard responses to a labor shortage — the other is automation.' },

    automation: { term: 'automation',
      def: 'Replacing missing workers with machines: self-order screens, delivery robots, care-home lifting equipment. A country with a shrinking workforce automates faster, because it has to rather than because it wants to.' },

    burden: { term: 'caregiving burden',
      def: 'The unpaid work of looking after aging parents — hours, travel, money, and career. In Japan it falls heavily on people in their forties and fifties, and disproportionately on daughters and daughters-in-law. Tens of thousands of people a year leave a job over it. It has its own word: kaigo rishoku.' },

    turnout: { term: 'voter turnout',
      def: 'The share of eligible people who actually vote. In Japan people over 60 vote at roughly twice the rate of people in their twenties. Politicians can count. That arithmetic decides what gets funded.' },

    silverdem: { term: 'silver democracy', jp: 'シルバー民主主義',
      def: 'The Japanese term for what happens when older voters are both the largest bloc and the most reliable one: spending tilts toward pensions and healthcare, and away from childcare, schools and young families — even when everyone agrees the young ones are the problem.' },

    pension: { term: 'pension',
      def: 'A retirement income, in Japan paid mostly out of the contributions of people working today rather than out of a pot the retiree filled up. That design is fine when there are many workers per retiree and painful when there are two.' },

    dtm: { term: 'demographic transition model',
      def: 'The five-stage model of how a country’s birth and death rates change as it develops. Japan is the standard example of <b>Stage 5</b>: death rate now higher than birth rate, so the population shrinks without anyone moving in.' },

    median: { term: 'median age',
      def: 'The age that splits a population in half. Japan’s is about 49 — the highest of any large country. Nigeria’s is about 18.' },

    kaedama: { term: 'kaedama', jp: '替え玉',
      def: 'A second helping of noodles, dropped into the broth you have left. A Hakata custom, and a thing you have to know to ask for.' }
  };

  /* =======================================================================
     THE NOTEBOOK MARGIN — one term per scene, in the student's own book.
     ======================================================================= */

  var MARGIN = {
    daiki: { head: 'Dependency ratio',
      note: 'Grandma is one person. Uncle Daiki is one person. That is the ratio, standing in one room. Nationally: about 50 people over 65 for every 100 of working age.' },
    kenji_mary: { head: 'Depopulation &amp; the silver economy',
      note: 'The shops that close are not failing at business. They are running out of people. And the care work the town needs is done by somebody who moved 5,000 km to do it.' },
    aiko_ren: { head: 'Total fertility rate',
      note: 'Japan: about 1.2. Replacement: 2.1. The government has been paying people to close that gap since before Aiko was born, and it has not closed.' },
    tanaka_yui: { head: 'Voter turnout &amp; silver democracy',
      note: 'Two buildings, one budget: a senior centre or a daycare. Whoever turns up on election day wins that argument before it starts.' }
  };

  /* =======================================================================
     THE END CARD — where the arithmetic goes if nothing changes.
     Every figure here is a published projection, not a guess by this game.
     ======================================================================= */

  var TIMELINE = [
    { yr: 'now', ev: 'Japan has about <b>124 million</b> people. Roughly <b>29%</b> are 65 or over — the highest share of any country on earth. The population has fallen every year since 2010.' },
    { yr: '2035', ev: 'One in three people is 65 or over. The generation that would be having children is itself smaller than its parents’, so the birth number keeps falling even if the <b>fertility rate</b> stops falling.' },
    { yr: '2040', ev: 'A government-commissioned study estimated that <b>roughly 40% of Japan’s municipalities</b> are at risk of disappearing as functioning towns. Kenji’s street is what that looks like from the inside.' },
    { yr: '2050', ev: 'Care work is projected to be short by <b>hundreds of thousands</b> of workers. Japan has two levers — <b>bring people in</b>, or <b>build machines</b> — and is pulling both, cautiously.' },
    { yr: '2070', ev: 'On current projections the population is about <b>87 million</b>, and around one in ten residents is foreign-born — a bigger change to what Japan is than anything that happened in the last century.' },
    { yr: 'and not only here', ev: 'South Korea, Italy, Spain, Germany and China are all on the same road, some of them faster. Japan is not a special case. Japan is just early.' }
  ];

  /* Things in the room you can click when nobody is sitting down. */
  var ROOM = {
    calendar: { name: 'The calendar', text: 'A free calendar from the fish supplier, still on the right month. Half the squares have a name written in: hospital, hospital, Daiki, hospital.' },
    photo:    { name: 'The photograph', text: 'The shop on opening day, 1984. Six seats, all full, and a queue out the door in the rain. Etsuko is in it, thirty-four years old, not smiling because she is busy.' },
    seats:    { name: 'The empty seats', text: 'Six stools. On a Tuesday, four of them stay empty all night. Etsuko still wipes down all six.' },
    noren:    { name: 'The noren', text: 'The split curtain over the door. Hung out means open. Etsuko has taken it down twenty minutes early three times this month and denies it each time.' },
    shutter:  { name: 'The shutters opposite', text: 'A run of them, all the way down that side of the arcade. The nearest one has a laminated notice taped to it that has gone yellow. It was a fishmonger for fifty-one years. Etsuko can still tell you what day he did the mackerel.' },
    vending:  { name: 'The vending machine', text: 'It is the brightest thing in the arcade and the only other business on this side of it that is open at this hour. It takes cards now. Somebody drives out from Kōriyama to fill it once a fortnight, which makes him the most reliable visitor the street gets.' },
    cat:      { name: 'The cat', text: 'Nobody owns her. Everybody feeds her, which in a street with fourteen hundred people and falling is a smaller committee than it used to be. Etsuko denies feeding her and buys the small dried fish in the large bag.' },
    arcade:   { name: 'The arcade roof', text: 'Put up in 1988, when the shopping street was busy enough that the rain was the problem. Half the lamps under it have gone and nobody has decided whose job that is.' }
  };

  global.Data = {
    BROTHS: BROTHS, TOPPINGS: TOPPINGS, CAST: CAST, ORDER: ORDER,
    ETSUKO: ETSUKO, GLOSSARY: GLOSSARY, MARGIN: MARGIN,
    TIMELINE: TIMELINE, ROOM: ROOM,
    scenesInOrder: scenesInOrder, byId: byId, verdict: verdict
  };

}(window));
