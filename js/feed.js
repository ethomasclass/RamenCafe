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
      body: 'Some context for the numbers everyone is posting today.<br><br>· {{median|Median age}}: 49.9 (highest of any large country)<br>· Over 65: 29.3% of the population<br>· {{tfr|Fertility rate}}: 1.20, against a {{replacement|replacement level}} of 2.1<br><br>This is {{natdecrease|natural decrease}}. It is not a forecast, it is this year.',
      likes: '8.1K', rt: '6.7K' },

    { name: 'ゆき / Yuki', handle: '@yukiyuki_2003', av: 'ゆ', colour: '#c96a9a', time: '18:02',
      body: 'my hometown just made the news for having the oldest population in the prefecture and honestly? checks out. i went home in august and the convenience store shut at 7pm because there was nobody to work the night shift',
      likes: '31K', rt: '12K' },

    { name: 'Kawaguchi Town Office', handle: '@kawaguchi_city', av: '町', colour: '#3a7a5a', time: '18:30', verified: true,
      body: '【Settlement support】From this month the child settlement grant rises to ¥600,000 per child for families moving to or staying in the town. Free medical care to the end of junior high. Enquiries at the town office, weekdays 8:30–17:15.',
      likes: '412', rt: '96' },

    { name: 'ゆき / Yuki', handle: '@yukiyuki_2003', av: 'ゆ', colour: '#c96a9a', time: '18:34', reply: true,
      body: 'replying to @kawaguchi_city — genuinely asking, not being rude: is ¥600,000 supposed to cover the eighteen years or just the first bit',
      likes: '9.4K', rt: '2.1K' }
  ],

  /* ---------------------------------------------------------------------
     AFTER DAIKI — the caregiving thread. He would never post any of this.
     --------------------------------------------------------------------- */
  daiki: [
    { name: 'Asahi Shimbun', handle: '@asahi', av: 'A', colour: '#a83232', time: '20:15', verified: true,
      body: 'More than 100,000 people a year leave work or reduce their hours to care for a parent — 介護離職, "care-leaving". Around two-thirds are women. Ministry survey finds most had no discussion with their employer before quitting.',
      likes: '22K', rt: '18K' },

    { name: 'とも@介護4年目', handle: '@tomo_kaigo', av: 'と', colour: '#8c5a3a', time: '20:31',
      body: 'Year four of this. Things nobody tells you about the {{burden|caregiving}} years:<br><br>1. It is not one big decision, it is 400 small ones<br>2. The paperwork is a part-time job by itself<br>3. Your siblings will remember it differently<br>4. You will grieve someone who is still alive<br><br>Anyway. Good luck out there.',
      likes: '58K', rt: '31K' },

    { name: 'Kenta', handle: '@kenta_dev', av: 'K', colour: '#3a5a8c', time: '20:44',
      body: 'The bit that gets me is that the {{pension|pension}} and the health system are paid by people working NOW. My generation pays in for people who will retire before we do, and the maths only worked when there were lots of us. Nobody designed this badly. It just aged.',
      likes: '17K', rt: '11K' },

    { name: 'Demography Desk', handle: '@jp_demog', av: 'D', colour: '#4a6d8c', time: '20:52',
      body: 'The number behind that: the {{oldage|old-age dependency ratio}}. People 65+ per 100 people of working age.<br><br>1970: about 10<br>2000: about 25<br>Now: about 51<br><br>Two working-age adults per retired person. In 1970 it was ten.',
      likes: '12K', rt: '9.8K',
      quote: { name: 'Kenta', handle: '@kenta_dev', body: 'The bit that gets me is that the pension and the health system are paid by people working NOW...' } },

    { name: 'Tsubuyaki Poll', handle: '@tsubu_polls', av: '?', colour: '#1d9bf0', time: '21:00',
      body: 'Who should be mainly responsible for looking after someone in their eighties?',
      poll: { q: '', opts: ['Their family', 'The government', 'Paid carers, family pays', 'Paid carers, state pays'],
              res: [31, 22, 18, 29], total: '48,201 votes · 6 hours left' },
      likes: '2.9K', rt: '1.1K' }
  ],

  /* ---------------------------------------------------------------------
     AFTER KENJI & MARY — the town, the empty houses, and who is doing
     the work nobody is left to do.
     --------------------------------------------------------------------- */
  kenji_mary: [
    { name: 'Fukushima Minpo', handle: '@minpo_np', av: 'F', colour: '#2a6a5a', time: '21:18', verified: true,
      body: 'Nakano Fisheries, Kawaguchi, has closed after 51 years. The owner, 78, said he had no successor. It is the fourth business on the same street to close since 2019.',
      likes: '3.4K', rt: '2.8K' },

    { name: 'akiya hunter', handle: '@akiya_bot', av: '空', colour: '#7a6a4a', time: '21:20',
      body: '【New listing】Detached house, 1974, 4 rooms + garden. 8 min walk to the (closed) primary school.<br><br>Price: ¥50,000.<br><br>That is not a typo. Roughly $330. There are nine million {{akiya|empty houses}} in this country and the problem is not that nobody will sell them.',
      likes: '87K', rt: '44K' },

    { name: 'ゆき / Yuki', handle: '@yukiyuki_2003', av: 'ゆ', colour: '#c96a9a', time: '21:26', reply: true,
      body: 'people in the replies going "just move there then, it\'s free!!" — mate the house is free because the school is shut, the bus goes twice a day and the nearest hospital is 50 minutes. the house was never the expensive part',
      likes: '41K', rt: '19K' },

    { name: 'Mie', handle: '@mie_kango', av: 'M', colour: '#8c3a6a', time: '21:33',
      body: 'I manage a care home. We are short 11 staff. I have advertised for 14 months. Last week two carers arrived from Indonesia through the {{migrant|specified skilled worker}} route and one of my residents asked me when the "real" staff were starting.<br><br>They are the real staff. They are the only staff.',
      likes: '64K', rt: '29K' },

    { name: '匿名 / anon', handle: '@kaze_no_koe', av: '匿', colour: '#6a6a6a', time: '21:39', reply: true,
      body: 'replying to @mie_kango — Japan managed for two thousand years without importing people. Why is the answer always more foreigners and never "pay Japanese workers properly"?',
      likes: '5.2K', rt: '1.9K' },

    { name: 'Mie', handle: '@mie_kango', av: 'M', colour: '#8c3a6a', time: '21:44', reply: true,
      body: 'Pay them with what, and hire them from where? The under-25 population is half what it was when I started. I raised wages 22% and got four applicants, two of whom were over 60.<br><br>The other option is {{automation|machines}} and I have those too. A lifting frame cannot hold a hand.',
      likes: '38K', rt: '21K' },

    { name: 'Robotics Weekly', handle: '@robo_wk', av: 'R', colour: '#4a4a8c', time: '21:48',
      body: 'Care-sector {{automation|robotics}} shipments up 19% year on year — lifting assists, monitoring sensors, medication dispensers. Every one of these exists because the workers do not.',
      likes: '6.1K', rt: '3.3K' }
  ],

  /* ---------------------------------------------------------------------
     AFTER AIKO & REN — the fertility argument, and the notice for Tuesday.
     --------------------------------------------------------------------- */
  aiko_ren: [
    { name: 'Cabinet Office', handle: '@cao_japan', av: '政', colour: '#2a4a8c', time: '22:02', verified: true,
      body: 'The new package for children and families: expanded child allowance, free fertility treatment, subsidised childcare, expanded paternity leave. Total spending to double over three years. <span class="tag">#少子化対策</span>',
      likes: '1.8K', rt: '900' },

    { name: 'Haruka', handle: '@haruka_works', av: 'は', colour: '#a85a3a', time: '22:09', reply: true,
      body: 'Every government since 1994 has announced a package. I have now watched four of them from inside my thirties. The {{pronatal|money is not the binding constraint}} — the hours are, the housing is, and the fact that it is still my career that pauses and not his.',
      likes: '73K', rt: '38K' },

    { name: 'Demography Desk', handle: '@jp_demog', av: 'D', colour: '#4a6d8c', time: '22:14',
      body: 'Worth knowing: pro-natalist spending has a measurable effect. It is just small. Best estimates put big packages at roughly +0.1 on the {{tfr|fertility rate}}.<br><br>Japan needs about +0.9.<br><br>It is not that nothing works. It is that nothing works at that size.',
      likes: '19K', rt: '15K' },

    { name: 'Kenta', handle: '@kenta_dev', av: 'K', colour: '#3a5a8c', time: '22:20',
      body: 'Also nobody says the obvious: the number of women in their twenties is itself much smaller than it was, because of the birth rate 25 years ago. Even if the rate stopped falling tomorrow, births keep falling for another generation. It is baked in.',
      likes: '24K', rt: '17K' },

    { name: 'Tsubuyaki Poll', handle: '@tsubu_polls', av: '?', colour: '#1d9bf0', time: '22:28',
      body: 'Honest one. If your town offered ¥600,000 per child, would it change your decision about having one?',
      poll: { q: '', opts: ['Yes, genuinely', 'No — nowhere near enough', 'Would move me, not decide me', 'Not my decision to make'],
              res: [7, 61, 24, 8], total: '112,884 votes · 1 day left' },
      likes: '4.4K', rt: '2.2K' },

    { name: 'Kawaguchi Town Office', handle: '@kawaguchi_city', av: '町', colour: '#3a7a5a', time: '22:35', verified: true,
      body: '【Notice】Ordinary council meeting, Tuesday 10:00, town hall. Agenda item 3: allocation of the remaining capital budget — (a) community health and senior centre, (b) extended-hours childcare centre. Public gallery open. <span class="tag">#町議会</span>',
      likes: '38', rt: '11' },

    { name: 'Yui T.', handle: '@yui_planning', av: 'Y', colour: '#7a4a8c', time: '22:41', reply: true,
      body: 'Thirty-eight likes. For the meeting that decides which of the two things this town gets for the next twenty years.<br><br>Average age in that gallery on Tuesday will be about seventy. Not because they took it — because they {{turnout|showed up}}. Doors open at ten.',
      likes: '11K', rt: '7.9K' }
  ]

  };

  global.Feeds = FEEDS;

}(window));
