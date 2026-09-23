/* ===========================================================================
   feed.js — the phone.

   Between customers the shop is empty and you do what anybody standing behind
   a counter at nine at night does. The feed is where the vocabulary lives:
   the words nobody would say out loud in the shop get said here, by people
   arguing, which is how anybody actually meets them.

   Everything is invented — the accounts, the numbers in the posts are real
   published figures, the people are not. Nothing is a real account.

   Post shape:
     { name, handle, av, colour, time, body, likes, rt,
       verified: true, reply: true,
       quote: { name, handle, body },
       poll: { q, opts: [...], res: [...], total } }

   `body` takes the same {{key|words}} glossary markup as the dialogue.
   =========================================================================== */

(function (global) {
  'use strict';

  var FEEDS = {

  /* ---------------------------------------------------------------------
     BEFORE THE FIRST CUSTOMER — the national picture, at a distance.
     --------------------------------------------------------------------- */
  open: [
    { name: 'NHK News', handle: '@nhk_news', av: 'N', colour: '#1d5fa8', time: '17:12', verified: true,
      body: 'Population figures released today: the number of people in Japan fell for the 14th year running. Births under 730,000 — a record low. Deaths were more than double that. <span class="tag">#人口</span>',
      likes: '14K', rt: '9.2K' },

    { name: 'Demography Desk', handle: '@jp_demog', av: 'D', colour: '#4a6d8c', time: '17:40',
      body: 'Here’s what the numbers everyone is posting mean.<br><br>· {{median|Median age}}: 49.9 (the oldest of any big country)<br>· Over 65: 29.3% of people<br>· {{tfr|Fertility rate}}: 1.20 kids per woman. You need 2.1 — the {{replacement|replacement level}} — just to stay the same size.<br><br>This is {{natdecrease|natural decrease}}. It’s not a prediction. It’s happening now.',
      likes: '8.1K', rt: '6.7K' },

    { name: 'ゆき / Yuki', handle: '@yukiyuki_2003', av: 'ゆ', colour: '#c96a9a', time: '18:02',
      body: 'my hometown just made the news for having the oldest people in the whole region and honestly? makes sense. i went home in august and the convenience store closed at 7pm. nobody was left to work the night shift',
      likes: '31K', rt: '12K' },

    { name: 'Kawaguchi Town Office', handle: '@kawaguchi_city', av: '町', colour: '#3a7a5a', time: '18:30', verified: true,
      body: '【Money for families】Starting this month, families who move here or stay here get ¥600,000 for each child. Free doctor visits until the end of junior high. Questions? Visit the town office, weekdays 8:30–5:15.',
      likes: '412', rt: '96' },

    { name: 'ゆき / Yuki', handle: '@yukiyuki_2003', av: 'ゆ', colour: '#c96a9a', time: '18:34', reply: true,
      body: 'replying to @kawaguchi_city — honest question, not being rude. is ¥600,000 supposed to pay for all eighteen years? or just the first part?',
      likes: '9.4K', rt: '2.1K' }
  ],

  /* ---------------------------------------------------------------------
     AFTER DAIKI — the caregiving thread. He would never post any of this.
     --------------------------------------------------------------------- */
  daiki: [
    { name: 'Asahi Shimbun', handle: '@asahi', av: 'A', colour: '#a83232', time: '20:15', verified: true,
      body: 'More than 100,000 people a year quit their jobs or cut their hours to take care of a parent. In Japanese it’s called 介護離職, "quitting to give care." About two-thirds of them are women. A government survey found most never talked to their boss before they quit.',
      likes: '22K', rt: '18K' },

    { name: 'とも@介護4年目', handle: '@tomo_kaigo', av: 'と', colour: '#8c5a3a', time: '20:31',
      body: 'Year four of taking care of my dad. Things nobody tells you about the {{burden|caregiving}} years:<br><br>1. It’s not one big decision. It’s 400 small ones<br>2. The paperwork is a part-time job by itself<br>3. Your brothers and sisters will remember it differently<br>4. You will miss someone who is still alive<br><br>Anyway. Good luck out there.',
      likes: '58K', rt: '31K' },

    { name: 'Kenta', handle: '@kenta_dev', av: 'K', colour: '#3a5a8c', time: '20:44',
      body: 'What gets me: {{pension|pensions}} and health care for old people are paid for by people working NOW. My generation pays for people who retire before us. The math only worked when there were lots of workers. Nobody planned this badly. The country just got old.',
      likes: '17K', rt: '11K' },

    { name: 'Demography Desk', handle: '@jp_demog', av: 'D', colour: '#4a6d8c', time: '20:52',
      body: 'The number behind that: the {{oldage|old-age dependency ratio}}. It counts people 65+ for every 100 people of working age.<br><br>1970: about 10<br>2000: about 25<br>Now: about 51<br><br>That’s two workers for every retired person. In 1970 it was ten.',
      likes: '12K', rt: '9.8K',
      quote: { name: 'Kenta', handle: '@kenta_dev', body: 'What gets me: pensions and health care for old people are paid for by people working NOW...' } },

    { name: 'Tsubuyaki Poll', handle: '@tsubu_polls', av: '?', colour: '#1d9bf0', time: '21:00',
      body: 'Who should be mostly responsible for taking care of someone in their eighties?',
      poll: { q: '', opts: ['Their family', 'The government', 'Paid helpers, family pays', 'Paid helpers, government pays'],
              res: [31, 22, 18, 29], total: '48,201 votes · 6 hours left' },
      likes: '2.9K', rt: '1.1K' }
  ],

  /* ---------------------------------------------------------------------
     AFTER KENJI & MARY — the town, the empty houses, and who is doing
     the work nobody is left to do.
     --------------------------------------------------------------------- */
  kenji_mary: [
    { name: 'Fukushima Minpo', handle: '@minpo_np', av: 'F', colour: '#2a6a5a', time: '21:18', verified: true,
      body: 'Nakano Fish Shop in Kawaguchi has closed after 51 years. The owner, 78, said he had nobody to take it over. It is the fourth business on the same street to close since 2019.',
      likes: '3.4K', rt: '2.8K' },

    { name: 'akiya hunter', handle: '@akiya_bot', av: '空', colour: '#7a6a4a', time: '21:20',
      body: '【For sale】House, built 1974, 4 rooms + garden. 8-minute walk to the (closed) elementary school.<br><br>Price: ¥50,000.<br><br>That’s not a typo. About $330. Japan has nine million {{akiya|empty houses}}. The problem isn’t that nobody will sell them.',
      likes: '87K', rt: '44K' },

    { name: 'ゆき / Yuki', handle: '@yukiyuki_2003', av: 'ゆ', colour: '#c96a9a', time: '21:26', reply: true,
      body: 'people in the replies saying "just move there, it\'s free!!" — ok but the house is free because the school is closed, the bus comes twice a day, and the nearest hospital is 50 minutes away. the house was never the expensive part',
      likes: '41K', rt: '19K' },

    { name: 'Mie', handle: '@mie_kango', av: 'M', colour: '#8c3a6a', time: '21:33',
      body: 'I run a nursing home. We need 11 more workers. I’ve been hiring for 14 months. Last week two caregivers came from Indonesia on a {{migrant|foreign worker visa}}. One of our residents asked me when the "real" workers were starting.<br><br>They are the real workers. They are the only workers.',
      likes: '64K', rt: '29K' },

    { name: '匿名 / anon', handle: '@kaze_no_koe', av: '匿', colour: '#6a6a6a', time: '21:39', reply: true,
      body: 'replying to @mie_kango — Japan did fine for two thousand years without bringing in foreigners. Why is the answer always more foreigners, and never "pay Japanese workers better"?',
      likes: '5.2K', rt: '1.9K' },

    { name: 'Mie', handle: '@mie_kango', av: 'M', colour: '#8c3a6a', time: '21:44', reply: true,
      body: 'Pay them with what money? Hire them from where? There are half as many people under 25 as when I started. I raised pay 22% and got four applicants. Two were over 60.<br><br>The other option is {{automation|machines}}, and I have those too. A lifting frame cannot hold a hand.',
      likes: '38K', rt: '21K' },

    { name: 'Robotics Weekly', handle: '@robo_wk', av: 'R', colour: '#4a4a8c', time: '21:48',
      body: 'Sales of care {{automation|robots}} are up 19% from last year — machines that lift patients, sensors that watch them, machines that hand out pills. Every one of them exists because there aren’t enough workers.',
      likes: '6.1K', rt: '3.3K' }
  ],

  /* ---------------------------------------------------------------------
     AFTER AIKO & REN — the fertility argument, and the notice for Tuesday.
     --------------------------------------------------------------------- */
  aiko_ren: [
    { name: 'Cabinet Office', handle: '@cao_japan', av: '政', colour: '#2a4a8c', time: '22:02', verified: true,
      body: 'Our new plan for families: more money per child, free help for couples who can’t get pregnant, cheaper childcare, and more time off for new dads. We’ll double the spending over three years. <span class="tag">#少子化対策</span>',
      likes: '1.8K', rt: '900' },

    { name: 'Haruka', handle: '@haruka_works', av: 'は', colour: '#a85a3a', time: '22:09', reply: true,
      body: 'Every government since 1994 has announced a plan like this. I’ve watched four of them during my thirties. The {{pronatal|money isn’t the real problem}}. The work hours are. The housing is. And it’s still my career that stops, not his.',
      likes: '73K', rt: '38K' },

    { name: 'Demography Desk', handle: '@jp_demog', av: 'D', colour: '#4a6d8c', time: '22:14',
      body: 'Good to know: spending money to get people to have babies does work a little. Just a little. Big plans raise the {{tfr|fertility rate}} by about +0.1.<br><br>Japan needs about +0.9.<br><br>It’s not that nothing works. It’s that nothing works that much.',
      likes: '19K', rt: '15K' },

    { name: 'Kenta', handle: '@kenta_dev', av: 'K', colour: '#3a5a8c', time: '22:20',
      body: 'Also, nobody says the obvious part. There are far fewer women in their twenties now, because fewer babies were born 25 years ago. So even if the birth rate stopped dropping tomorrow, the number of births would keep falling for another generation. It’s already locked in.',
      likes: '24K', rt: '17K' },

    { name: 'Tsubuyaki Poll', handle: '@tsubu_polls', av: '?', colour: '#1d9bf0', time: '22:28',
      body: 'Be honest. If your town offered ¥600,000 per child, would that change your mind about having one?',
      poll: { q: '', opts: ['Yes, genuinely', 'No — nowhere near enough', 'I’d move here, but still not have a kid', 'Not my decision to make'],
              res: [7, 61, 24, 8], total: '112,884 votes · 1 day left' },
      likes: '4.4K', rt: '2.2K' },

    { name: 'Kawaguchi Town Office', handle: '@kawaguchi_city', av: '町', colour: '#3a7a5a', time: '22:35', verified: true,
      body: '【Notice】Town council meeting, Tuesday at 10:00, town hall. Item 3: what to build with the money we have left — (a) a health and senior center, or (b) a daycare center open late. The public can come watch. <span class="tag">#町議会</span>',
      likes: '38', rt: '11' },

    { name: 'Yui T.', handle: '@yui_planning', av: 'Y', colour: '#7a4a8c', time: '22:41', reply: true,
      body: 'Thirty-eight likes. For the meeting that decides what this town gets for the next twenty years.<br><br>The average age in that room on Tuesday will be about seventy. Not because they took over — because they {{turnout|showed up}}. Doors open at ten.',
      likes: '11K', rt: '7.9K' }
  ],

  /* ---------------------------------------------------------------------
     AFTER TANAKA & YUI — the last one before closing. Nobody has said the
     word "lonely" all night, so the timeline says it instead, ten minutes
     before somebody walks in who would never use it about himself.
     --------------------------------------------------------------------- */
  tanaka_yui: [
    { name: 'Mainichi Shimbun', handle: '@mainichi', av: 'M', colour: '#3a5a8c', time: '22:52', verified: true,
      body: 'Survey: <b>1 in 5</b> men over 65 who live alone say they talk to another person less than once every two weeks. For women the same age, it’s less than half that many. <span class="tag">#高齢者</span>',
      likes: '19K', rt: '14K' },

    { name: 'Demography Desk', handle: '@jp_demog', av: 'D', colour: '#4a6d8c', time: '22:58',
      body: 'Why are men so much lonelier? For a whole generation of Japanese men, their company <i>was</i> their friend group. When they retire, it doesn’t shrink. It ends.<br><br>{{solohouse|People over 65 living alone}}: about three times as many as in 1990.',
      likes: '27K', rt: '19K' },

    { name: 'とも@介護4年目', handle: '@tomo_kaigo', av: 'と', colour: '#8c5a3a', time: '23:04', reply: true,
      body: 'My father says "I’m fine, I don’t need anyone." He has said it 400 times. What he means is that asking for help would be a bother. He was raised to believe that being a bother is the worst thing a man can be.<br><br>{{isolation|That’s not just his personality}}. That’s a whole generation.',
      likes: '52K', rt: '30K' },

    { name: 'Mie', handle: '@mie_kango', av: 'M', colour: '#8c3a6a', time: '23:09',
      body: 'The word is <b>{{kodokushi|kodokushi}}</b> — dying alone and not being found for a while. I wish people would stop saying it like a ghost story. It happens to thousands of people a year. There are cleaning companies for it. Towns budget for it.<br><br>What prevents it is really boring stuff: a neighbor, a delivery, a regular Tuesday somewhere.',
      likes: '88K', rt: '51K' },

    { name: 'Watanabe Denki', handle: '@wtnb_denki', av: 'W', colour: '#2a6a8c', time: '23:14',
      body: '【Check-in products】The thermos that messages your family when you make tea. On sale for ten years. Also: fridge-door sensors, alerts if your power use stops, and a daily phone call from the post office. <span class="tag">#見守りサービス</span>',
      likes: '2.2K', rt: '1.4K' },

    { name: 'ゆき / Yuki', handle: '@yukiyuki_2003', av: 'ゆ', colour: '#c96a9a', time: '23:19', reply: true,
      body: 'i keep seeing this ad called heartwarming and i honestly can’t get over it. we invented a kettle that proves you’re alive. instead of just. living near each other',
      likes: '104K', rt: '61K' },

    { name: 'Tsubuyaki Poll', handle: '@tsubu_polls', av: '?', colour: '#1d9bf0', time: '23:24',
      body: 'Be honest. How many people have you had a real conversation with in the last seven days?',
      poll: { q: '', opts: ['More than ten', 'Four to ten', 'One to three', 'None'],
              res: [46, 34, 16, 4], total: '76,455 votes · 12 hours left' },
      likes: '3.1K', rt: '1.6K' }
  ]

  };

  global.Feeds = FEEDS;

}(window));
