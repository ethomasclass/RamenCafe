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
      desc: 'Pork bones boiled for hours until the soup turns cloudy and white. Thin, straight noodles. The famous style of Japan’s southern island.',
      more: 'Hakata shops expect you to eat fast, so the noodles are thin and the serving is small. When you finish the noodles, there’s still soup left. That’s what kaedama is for: you ask for more noodles and drop them right in.',
      tags: ['rich', 'bold', 'hearty', 'traditional'],
      colour: '#efe6dc' },

    { id: 'miso', name: 'Sapporo Miso', jp: '札幌みそ',
      say: 'sah-POH-roh MEE-soh',
      region: 'Sapporo, on Hokkaido — the far north',
      map: { x: 150, y: 34 },
      desc: 'Fermented soybean paste stirred into a pork and vegetable soup. Thick, curly noodles. Usually topped with corn and a slab of butter.',
      more: 'It’s newer than it tastes. A cook in Sapporo first put miso in ramen in the 1950s. The corn and butter are there because Hokkaido is Japan’s farm country. A tradition can be only seventy years old and still be a tradition.',
      tags: ['hearty', 'warming', 'sweet', 'modern'],
      colour: '#c98a42' },

    { id: 'shoyu', name: 'Kitakata Shoyu', jp: '喜多方しょうゆ',
      say: 'kee-TAH-kah-tah SHOH-yoo',
      region: 'Kitakata, in Fukushima — the Tohoku region',
      map: { x: 128, y: 120 },
      desc: 'A clear brown soy sauce soup with flat, wide, wavy noodles. It comes from one of the three oldest ramen towns in Japan.',
      more: 'Kitakata has about a hundred ramen shops in a town of forty thousand people. People there eat ramen for breakfast. Like this town, it is losing people every year. The shops are outlasting the customers.',
      tags: ['plain', 'classic', 'nostalgic', 'traditional'],
      colour: '#b9793a' },

    { id: 'shio', name: 'Hakodate Shio', jp: '函館しお',
      say: 'hah-KOH-dah-teh SHEE-oh',
      region: 'Hakodate, on Hokkaido — the northern port',
      map: { x: 143, y: 62 },
      desc: 'Salt, and almost nothing else. A pale gold soup so clear you can see the bottom of the bowl. The oldest and plainest of the four.',
      more: 'In 1859, Hakodate was one of the first ports opened to foreign ships. Chinese cooks who worked there helped turn noodle soup into a Japanese dish. Every bowl in this shop comes from somebody’s immigrant grandmother.',
      tags: ['plain', 'clear', 'light', 'old'],
      colour: '#e8d49a' }
  ];

  /* =======================================================================
     THE TOPPINGS — pick two.
     ======================================================================= */

  var TOPPINGS = [
    { id: 'chashu', name: 'Chashu', jp: 'チャーシュー',
      desc: 'Rolled pork belly, simmered slow in soy and sugar, sliced thin.',
      more: 'The name comes from Chinese char siu pork, but Japan cooks it its own way now.',
      tags: ['rich', 'hearty'], colour: '#b5714a' },

    { id: 'ajitama', name: 'Ajitama egg', jp: '味玉',
      desc: 'A soft-boiled egg marinated overnight. The yolk should still run a little.',
      more: 'Ajitama means "seasoned egg." Getting the yolk just right is the hardest thing on this shelf. It’s the first thing regular customers notice.',
      tags: ['rich', 'comforting'], colour: '#f3c34a' },

    { id: 'menma', name: 'Menma', jp: 'メンマ',
      desc: 'Bamboo shoots, fermented and then dried. Sour, salty, chewy.',
      more: 'Fermented bamboo came from China and Taiwan. For many years, most menma in Japan was imported. So a basic topping depended on other countries’ crops.',
      tags: ['traditional', 'savory'], colour: '#c9a24a' },

    { id: 'nori', name: 'Nori', jp: '海苔',
      desc: 'A sheet of dried seaweed, stood up against the side of the bowl.',
      more: 'You push it into the soup, let it get soft, and wrap some noodles in it before it falls apart.',
      tags: ['plain', 'classic'], colour: '#26332c' },

    { id: 'negi', name: 'Scallion', jp: 'ねぎ',
      desc: 'Green onion, sliced fine. Nearly every bowl in Japan gets some.',
      more: 'It’s there to balance the fat. A heavy soup without something fresh on top gets tiring halfway through.',
      tags: ['fresh', 'plain'], colour: '#8fbf5a' },

    { id: 'corn', name: 'Sweetcorn', jp: 'コーン',
      desc: 'A scoop of sweetcorn, northern style.',
      more: 'Hokkaido, in the north, grows most of Japan’s corn. That’s why corn goes on northern Sapporo ramen and almost never on southern Hakata ramen.',
      tags: ['sweet', 'modern'], colour: '#f2c53d' },

    { id: 'butter', name: 'Butter', jp: 'バター',
      desc: 'A pat of butter, melting into the top of the broth.',
      more: 'Butter comes from Hokkaido’s dairy farms. Some old-school ramen fans complain about it. It’s been on menus for sixty years, and complaining hasn’t changed a thing.',
      tags: ['rich', 'warming', 'modern'], colour: '#f6e6a8' },

    { id: 'naruto', name: 'Narutomaki', jp: '鳴門巻き',
      desc: 'A slice of white fish cake with a pink spiral cut through it.',
      more: 'It’s named after the whirlpools in the Naruto Strait, a stretch of sea in Japan. It’s old-fashioned now. You see it in cartoons more than in new shops, which is exactly why some people order it.',
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
          order: 'Whatever’s fastest. He hasn’t eaten since a convenience-store rice ball at seven this morning. He keeps checking his phone.',
          wants: ['rich', 'hearty', 'comforting', 'warming'] }
      ] },

    { id: 'kenji_mary',
      title: 'Kenji, and the woman who takes care of him',
      teaches: 'rural depopulation; the silver economy outside the cities; migrant care work',
      term: 'depopulation',
      guests: [
        { id: 'kenji', name: 'Kenji', jp: '健二', role: 'a retired greengrocer, 81',
          order: 'The plainest thing you have. He has eaten the same bowl since 1968 and sees no reason to change now.',
          wants: ['plain', 'clear', 'old', 'classic'] },
        { id: 'mary', name: 'Mary', jp: 'メアリー', role: 'his care worker, 34',
          order: 'Something rich and a little sweet. She learned to love it her first year in Japan. She orders it every time, and she’ll defend it.',
          wants: ['rich', 'sweet', 'modern', 'bold'] }
      ] },

    { id: 'aiko_ren',
      title: 'The couple from the new apartments',
      teaches: 'falling fertility; why pro-natalist policy mostly fails',
      term: 'total fertility rate',
      guests: [
        { id: 'aiko', name: 'Aiko', jp: '愛子', role: 'a project manager, 33',
          order: 'Northern broth, and keep it simple. She’s had a long day and doesn’t want any questions.',
          wants: ['warming', 'plain', 'fresh', 'hearty'] },
        { id: 'ren', name: 'Ren', jp: '蓮', role: 'her husband, 34',
          order: 'The same broth as his wife, plus every comfortable, cozy topping you can add. He is not embarrassed about this.',
          wants: ['sweet', 'warming', 'rich', 'comforting'] }
      ] },

    { id: 'hiroshi',
      title: 'The last one in',
      teaches: 'social isolation; single-person elderly households; watch-over services and the technology of being checked on',
      term: 'social isolation',
      guests: [
        { id: 'hiroshi', name: 'Hiroshi', jp: '博', role: 'a retired engineer, 79',
          order: 'He says whatever is easiest. He doesn’t mean it. He has ordered the same bowl for thirty years, but he won’t ask for it in case he’s being a bother.',
          wants: ['nostalgic', 'traditional', 'savory', 'comforting'] }
      ] },

    { id: 'tanaka_yui',
      title: 'The councilman and his daughter',
      teaches: 'political consequences — who votes, and what gets funded',
      term: 'voter turnout',
      guests: [
        { id: 'tanaka', name: 'Tanaka', jp: '田中', role: 'retired town councilman, 76',
          order: 'Southern broth, done the old way, like he ate as a young man in Fukuoka. No trendy extras on top.',
          wants: ['traditional', 'bold', 'rich', 'savory'] },
        { id: 'yui', name: 'Yui', jp: '結衣', role: 'his daughter, urban planner, 38',
          order: 'The same broth as her father, but she wants it fresh and sharp. She will ask for extra noodles after.',
          wants: ['bold', 'rich', 'fresh', 'modern'] }
      ] }
  ];

  /* The running order. Delete entries to shorten the night. */
  var ORDER = ['daiki', 'kenji_mary', 'aiko_ren', 'tanaka_yui', 'hiroshi'];

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
      def: 'A population where more and more people are old and fewer are children. It happens when people have fewer babies and live longer at the same time. This is happening in most rich countries. Japan got there first and fastest.' },

    dependency: { term: 'dependency ratio',
      def: 'How many people are too young or too old to work, for every 100 people of working age (15–64). You can split it into the <b>child dependency ratio</b> and the <b>old-age dependency ratio</b>. A high ratio means fewer workers are supporting more people who don’t work — by paying taxes, and by showing up to help.' },

    oldage: { term: 'old-age dependency ratio',
      def: 'How many people are 65 or older for every 100 people of working age. Japan’s is above 50. That means about two working-age adults for every retired person, and the number of workers keeps shrinking. In 1970 it was about ten per hundred.' },

    tfr: { term: 'total fertility rate', jp: '合計特殊出生率',
      def: 'The average number of kids a woman has in her life. Japan’s is about 1.2. Anything below about 2.1 means each generation is smaller than the one before.' },

    replacement: { term: 'replacement level',
      def: 'A fertility rate of about 2.1 kids per woman. That’s what keeps a population the same size without people moving in. Two kids replace the two parents. The extra 0.1 covers children who don’t live long enough to have kids of their own.' },

    natdecrease: { term: 'natural decrease',
      def: 'When more people die than are born in a year. The population shrinks by itself, even if nobody moves away. Japan has had natural decrease every year since 2007.' },

    lifeexp: { term: 'life expectancy',
      def: 'How long a baby born today can expect to live, on average. Japan’s is about 84 — one of the highest in the world. Living longer is a win, but it also costs money. A person might get a pension for twenty-five years instead of eight.' },

    pronatal: { term: 'pro-natalist policy', jp: '少子化対策',
      def: 'Government programs that try to get people to have more babies — cash for each baby, free daycare, help paying for fertility treatment, paid time off. Japan has tried this for decades. The birth rate kept falling anyway. The usual reason: the money is small compared to the real costs, like housing, long work hours, careers, and which parent is expected to quit working.' },

    silver: { term: 'silver economy',
      def: 'All the businesses that sell things to old people — nursing homes, adult diapers, handrails, easy-open packages, hearing aids. In an aging country, it’s one of the few kinds of business that keeps growing. But it grows in places where old people can pay, which usually isn’t a shrinking country town.' },

    depop: { term: 'depopulation', jp: '過疎',
      def: 'When a place loses people faster than it gains them. In the Japanese countryside, two things cause it at once: young people move to the cities, and the people left behind are too old to have kids. The Japanese word for it, kaso, has been an official government term since 1970.' },

    akiya: { term: 'akiya', jp: '空き家',
      def: 'An empty house. Japan has about nine million of them. Many belong to grown children who live in cities. They can’t sell them, rent them, or afford to tear them down. Empty houses are the easiest way to see that a town is shrinking.' },

    labor: { term: 'labor shortage',
      def: 'When there are more jobs than workers to fill them. It happens when a small generation replaces a big one. It hits nursing, building, farming, and small shops first — jobs that can’t be moved somewhere else.' },

    migrant: { term: 'foreign worker program', jp: '技能実習・特定技能',
      def: 'Japan doesn’t call itself a country of immigrants. But it now has several visas that let foreign workers come, including one just for nursing care. Bringing in workers is one of the two usual answers to a labor shortage. The other is using machines.' },

    automation: { term: 'automation',
      def: 'Using machines to do the work of missing workers — ordering screens in restaurants, delivery robots, machines that lift patients in nursing homes. A country with fewer workers uses more machines, because it has to, not because it wants to.' },

    burden: { term: 'caregiving burden',
      def: 'The unpaid work of taking care of aging parents. It costs time, travel, money, and careers. In Japan it falls mostly on people in their forties and fifties, and more on daughters and daughters-in-law than on sons. Tens of thousands of people a year quit their jobs because of it. There’s a Japanese word for that: kaigo rishoku.' },

    turnout: { term: 'voter turnout',
      def: 'The share of people who are allowed to vote and actually do. In Japan, people over 60 vote about twice as much as people in their twenties. Politicians can count. That math decides what gets paid for.' },

    silverdem: { term: 'silver democracy', jp: 'シルバー民主主義',
      def: 'A Japanese term for what happens when older voters are both the biggest group and the most likely to vote. Government spending leans toward pensions and health care, and away from childcare, schools, and young families — even when everyone agrees the lack of young people is the real problem.' },

    pension: { term: 'pension',
      def: 'Money paid to people after they retire. In Japan, it mostly comes from people who are working today, not from money the retired person saved. That works fine when there are many workers for each retired person. It gets hard when there are only two.' },

    dtm: { term: 'demographic transition model',
      def: 'A five-stage model that shows how a country’s birth and death rates change as it develops. Japan is the classic example of <b>Stage 5</b>: the death rate is now higher than the birth rate, so the population shrinks.' },

    median: { term: 'median age',
      def: 'The age right in the middle — half the people are older, half are younger. Japan’s is about 49, the highest of any big country. Nigeria’s is about 18.' },

    isolation: { term: 'social isolation', jp: '社会的孤立',
      def: 'Having little or no regular contact with other people. Japan treats it as a public health problem, not just a private sadness. It hits men much harder than women. Many men’s whole social life was at their company. When they retire, they lose it. They are far more likely than women to go a week without talking to anyone.' },

    solohouse: { term: 'single-person households', jp: '単身世帯',
      def: 'People who live alone. About one in five Japanese men over 65 live by themselves, and the number is growing fast. The causes: smaller families, children moving to cities, and longer lives — which usually means one person in a married couple lives alone for years after the other dies.' },

    kodokushi: { term: 'kodokushi', jp: '孤独死',
      def: 'It means "lonely death" — dying alone and not being found for a while. Japan has thousands of cases a year, mostly older men who live alone. It has its own word, its own cleaning companies, and its own line in town budgets. That tells you it’s treated as a problem built into society, not just bad luck.' },

    mimamori: { term: 'watch-over services', jp: '見守り',
      def: 'Ways to check that an older person living alone is okay: a visit from the mail carrier, a daily phone call, a neighborhood volunteer, or sensors on a kettle, a fridge door, or an electric meter. The sensors message a family member when something normal doesn’t happen. It is one of the fastest-growing parts of the silver economy.' },

    kaedama: { term: 'kaedama', jp: '替え玉',
      def: 'A second helping of noodles, dropped into the soup you have left. It’s a custom from Hakata, in southern Japan. You have to know to ask for it.' }
  };

  /* =======================================================================
     THE NOTEBOOK MARGIN — one term per scene, in the student's own book.
     ======================================================================= */

  var MARGIN = {
    daiki: { head: 'Dependency ratio',
      note: 'Grandma is one person. Uncle Daiki is one person. That’s the ratio, right in one room. In all of Japan: about 50 people over 65 for every 100 people of working age.' },
    kenji_mary: { head: 'Depopulation &amp; the silver economy',
      note: 'The shops that close aren’t bad businesses. The town is running out of people. And the care work the town needs is done by someone who moved about 3,000 miles to do it.' },
    aiko_ren: { head: 'Total fertility rate',
      note: 'Japan: about 1.2 kids per woman. Needed to stay the same size: 2.1. The government has paid people to close that gap since before Aiko was born. It hasn’t closed.' },
    hiroshi: { head: 'Social isolation',
      note: 'One in five Japanese men over 65 live alone. Hiroshi has a kettle that tells his son he’s still making tea. He sat on the bench outside for an hour, waiting until the shop was quiet so he wouldn’t be a bother.' },
    tanaka_yui: { head: 'Voter turnout &amp; silver democracy',
      note: 'Two buildings, money for only one: a senior center or a daycare. Whoever shows up to vote wins that argument before it starts.' }
  };

  /* =======================================================================
     THE END CARD — where the arithmetic goes if nothing changes.
     Every figure here is a published projection, not a guess by this game.
     ======================================================================= */

  var TIMELINE = [
    { yr: 'now', ev: 'Japan has about <b>124 million</b> people. Roughly <b>29%</b> are 65 or over — the highest share of any country on earth. The population has fallen every year since 2010.' },
    { yr: '2035', ev: 'One in three people is 65 or older. The generation that would be having kids is smaller than their parents’ generation. So the number of births keeps falling, even if the <b>fertility rate</b> stops falling.' },
    { yr: '2040', ev: 'A study for the government found that <b>about 40% of Japan’s towns and cities</b> could stop working as real towns. Kenji’s street is what that looks like up close.' },
    { yr: '2050', ev: 'Japan is expected to be short <b>hundreds of thousands</b> of care workers. It has two choices — <b>bring people in</b>, or <b>build machines</b> — and it is carefully trying both.' },
    { yr: '2070', ev: 'If things keep going this way, Japan will have about <b>87 million</b> people, and about one in ten will have been born in another country. That would change Japan more than anything in the last hundred years.' },
    { yr: 'and not only here', ev: 'South Korea, Italy, Spain, Germany and China are all on the same road, some of them faster. Japan is not a special case. Japan is just early.' }
  ];

  /* Things in the room you can click when nobody is sitting down. */
  var ROOM = {
    calendar: { name: 'The calendar', text: 'A free calendar from the fish company, still on the right month. Half the squares have something written in: hospital, hospital, Daiki, hospital.' },
    photo:    { name: 'The photograph', text: 'The shop on opening day, 1984. Six seats, all full, and a line out the door in the rain. Etsuko is in it, thirty-four years old. She isn’t smiling because she’s busy.' },
    seats:    { name: 'The empty seats', text: 'Six stools. On a Tuesday, four of them stay empty all night. Etsuko still wipes down all six.' },
    noren:    { name: 'The noren', text: 'The split curtain over the door. When it hangs outside, the shop is open. Etsuko has taken it down twenty minutes early three times this month. She denies it every time.' },
    shutter:  { name: 'The shutters opposite', text: 'Metal shutters, all the way down that side of the arcade. The nearest one has a paper notice taped to it, turned yellow. It was a fish shop for fifty-one years. Etsuko can still tell you which day he sold mackerel.' },
    vending:  { name: 'The vending machine', text: 'It’s the brightest thing in the arcade, and the only other business open this late. It takes cards now. A man drives in from the city every two weeks to fill it. He is the street’s most reliable visitor.' },
    cat:      { name: 'The cat', text: 'Nobody owns her. Everybody feeds her — but in a town of fourteen hundred people and shrinking, “everybody” is fewer people than it used to be. Etsuko says she doesn’t feed her. She buys the dried fish in the big bag.' },
    bench:    { name: 'The bench', text: 'A metal bench against the shutters, across from the vending machine, bolted down. Etsuko has been meaning to ask the town to move it so it faces something other than a vending machine. She has been meaning to for nine years.' },
    arcade:   { name: 'The arcade roof', text: 'The roof was built in 1988, back when the shopping street was so busy that rain was the biggest problem. Half the lamps under it are broken now. Nobody has decided whose job it is to fix them.' }
  };

  global.Data = {
    BROTHS: BROTHS, TOPPINGS: TOPPINGS, CAST: CAST, ORDER: ORDER,
    ETSUKO: ETSUKO, GLOSSARY: GLOSSARY, MARGIN: MARGIN,
    TIMELINE: TIMELINE, ROOM: ROOM,
    scenesInOrder: scenesInOrder, byId: byId, verdict: verdict
  };

}(window));
