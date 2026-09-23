/* ===========================================================================
   scenes.js — the evening's four conversations, the opening, and closing up.

   Rules, held to throughout:
     1. Every choice is a TONE FORK. No branch is wrong. Branches differ in
        how much a person volunteers and how fast they get there.
     2. Nobody recites a statistic at an unprompted student. Teaching arrives
        because the player asked, or because somebody was complaining anyway.
     3. Nobody is a spokesperson for their demographic. Tanaka is not "the
        elderly vote"; he is a proud man who is worried he is out of date and
        happens to have voted in every election since 1971.
     4. No character is wrong on purpose so another can correct them. Aiko and
        Ren are both right. So are Tanaka and Yui.

   Markup: {{key|words on screen}} renders as a clickable term from GLOSSARY.

   Node kinds:
     { say, who, expr }               somebody speaks
     { narrate }                      stage direction, italic
     { choose: [ {label, tone, warm, then} ] }
                                      player picks a line. `tone` is the label
                                      shown; `warm` names who warms to it.
     { bench: true }                  stop and make the bowls
     { reactions: true }              play each guest's reaction to their bowl
     { confessions: true }            the thing they only say over a good bowl
     { bonus: 'id' }                  one extra line if warmth with id is high
   =========================================================================== */

(function (global) {
  'use strict';

  var SCENES = {

  /* =====================================================================
     BEFORE OPENING — Etsuko, the shop, and why you are standing here.
     ===================================================================== */
  open_shop: { script: [
    { narrate: 'It’s 6:40 in the evening. The soup has been cooking since two o’clock. Your grandmother stands behind the counter with her hands on the rail. She is pretending to think about something.' },
    { say: 'You’re early.', who: 'etsuko', expr: 'neutral' },
    { say: 'I said seven. It is not seven.', who: 'etsuko', expr: 'stern' },
    { choose: [
      { label: '"I thought I’d help set up."', tone: 'Curious', warm: 'etsuko',
        then: [
          { say: 'Set up. There is nothing to set up. The broth is on, the noodles are in the fridge, the bowls are where the bowls go.', who: 'etsuko', expr: 'neutral' },
          { narrate: 'She hands you an apron anyway, without looking at you.' },
          { say: 'The eggs need doing. Six of them. The sauce is in the blue container. Don’t crack them on the edge of the bowl. Use the counter.', who: 'etsuko', expr: 'warm' } ] },
      { label: '"Mom said you’d try to open by yourself again."', tone: 'Playful', warm: 'etsuko',
        then: [
          { say: 'Your mother says a lot of things from Sendai. She is not here. She is in the city.', who: 'etsuko', expr: 'stern' },
          { narrate: 'A beat.' },
          { say: 'Apron’s on the hook. Eggs need doing. Six.', who: 'etsuko', expr: 'warm' } ] },
      { label: '"How’s your back today?"', tone: 'Empathetic',
        then: [
          { say: 'My back is my business.', who: 'etsuko', expr: 'stern' },
          { narrate: 'She turns to the pot. It doesn’t need her.' },
          { say: 'Apron. Eggs. Six of them.', who: 'etsuko', expr: 'neutral' } ] }
    ]},
    { narrate: 'You do the eggs. It takes nine minutes. She watches you the whole time and doesn’t say a word.' },
    { say: 'I have opened this shop for forty-one years. Your grandfather helped for eleven of them. Then he died, which was rude of him.', who: 'etsuko', expr: 'warm' },
    { say: 'Now hang the noren out. That’s the curtain over the door. Nobody comes in if the curtain isn’t out.', who: 'etsuko', expr: 'neutral' },
    { narrate: 'Outside, it is an August evening. There are four shops on this stretch. Two have their metal shutters pulled down. One of those has been closed since before you were born.' },
    { narrate: 'You hang the curtain out. Somewhere down the road a car door shuts.' }
  ]},

  /* =====================================================================
     1 — DAIKI. Your uncle. Etsuko's son.
     Teaches: the old-age dependency ratio, standing in one room; and the
     caregiving burden as an actual timetable rather than an idea.
     ===================================================================== */
  daiki: { script: [
    { narrate: 'The curtain lifts. A man in a work shirt ducks under it. He is already saying sorry to everybody.' },
    { say: 'Sorry — sorry. Am I — you’re open? You’re open.', who: 'daiki', expr: 'surprised' },
    { say: 'We are open because the curtain is out. That is what the curtain is for.', who: 'etsuko', expr: 'stern' },
    { say: 'Hello, Mom.', who: 'daiki', expr: 'warm' },
    { narrate: 'He sits on the stool nearest the door. He always sits there. He puts his phone face up on the counter, then face down. Then face up again.' },
    { choose: [
      { label: '"Long one?"', tone: 'Empathetic', warm: 'daiki',
        then: [
          { say: 'I drove to Nagoya and back. That’s hours each way. I left at five this morning. A truck broke down on the highway and I sat in traffic for an hour and a half.', who: 'daiki', expr: 'worried' },
          { say: 'It was kind of relaxing, honestly. For ninety minutes, nothing was my fault.', who: 'daiki', expr: 'warm' } ] },
      { label: '"You look like you’ve been driving since Tuesday."', tone: 'Playful', warm: 'daiki',
        then: [
          { say: 'I have. Not the same Tuesday, though. Several Tuesdays.', who: 'daiki', expr: 'warm' },
          { say: 'I drove to Nagoya and back today. That’s hours each way. I left at five this morning.', who: 'daiki', expr: 'neutral' } ] },
      { label: '"How was the drive?"', tone: 'Curious',
        then: [
          { say: 'Long. Fine. Long.', who: 'daiki', expr: 'neutral' },
          { narrate: 'He rubs his eyes with the back of his wrist, like someone with dirty hands. His hands are clean.' } ] }
    ]},
    { say: 'He drives too much. I have said this.', who: 'etsuko', expr: 'stern' },
    { say: 'She has said this.', who: 'daiki', expr: 'warm' },
    { say: 'Give him the fast one. He won’t chew it anyway.', who: 'etsuko', expr: 'neutral' },
    { narrate: 'He hasn’t eaten since a rice ball from a convenience store at seven this morning. He wouldn’t tell you that. His mother tells you, without even turning around.' },
    { bench: true },
    { reactions: true },
    { say: 'Right. Yes. That’s — thank you.', who: 'daiki', expr: 'warm' },
    { narrate: 'He eats about a third of it before he says anything. For him, that is a long time.' },
    { say: 'She had a hospital visit on Thursday. Did she tell you about the hospital on Thursday?', who: 'daiki', expr: 'neutral' },
    { say: 'I am standing here.', who: 'etsuko', expr: 'stern' },
    { say: 'You are. It’s one of my favorite things about you.', who: 'daiki', expr: 'warm' },
    { choose: [
      { label: '"How often is the hospital?"', tone: 'Curious',
        then: [
          { say: 'Twice a month right now. The hospital is in Kōriyama, the nearest big city. That’s fifty minutes there and fifty back, plus the waiting.', who: 'daiki', expr: 'neutral' },
          { say: 'The bus leaves at 7:40 and the next one isn’t until 1:30. So it takes a whole day either way. I take Thursdays off work when I can.', who: 'daiki', expr: 'worried' },
          { say: 'The clinic here in town closed in 2019. It had one doctor, and he was seventy-one.', who: 'daiki', expr: 'neutral' } ] },
      { label: '"That’s a lot to carry on your own."', tone: 'Empathetic', warm: 'daiki',
        then: [
          { say: 'I’m not totally on my own. Your mother handles the money and the paperwork from Sendai. That’s really half the work. She’d come if she could get away.', who: 'daiki', expr: 'neutral' },
          { say: 'But the hospital means somebody has to drive her there. You can’t drive a car from Sendai.', who: 'daiki', expr: 'worried' },
          { say: 'So it’s me. It was always going to be me. I’m the one who came back.', who: 'daiki', expr: 'worried' } ] },
      { label: '"Is she a difficult patient?"', tone: 'Playful', warm: 'daiki',
        then: [
          { say: 'She told her heart doctor that he looked tired.', who: 'daiki', expr: 'warm' },
          { say: 'He did look tired.', who: 'etsuko', expr: 'neutral' },
          { say: 'He looked tired because he’s one of only two heart doctors for four towns, Mom.', who: 'daiki', expr: 'warm' } ] }
    ]},
    { say: 'You came back from Osaka. I remember when you came back.', who: 'etsuko', expr: 'neutral' },
    { say: 'I did.', who: 'daiki', expr: 'neutral' },
    { choose: [
      { label: '"Why did you come back?"', tone: 'Curious',
        then: [
          { say: 'Because there wasn’t anybody else to do it.', who: 'daiki', expr: 'neutral' },
          { say: 'Look — it isn’t a tragedy. I had a good job. Now I have an okay job. That’s all it is.', who: 'daiki', expr: 'warm' },
          { say: 'But do the math. There are two of us kids. Only one of us is here. She’s seventy-four, Grandpa’s gone, and the neighbors are all older than she is.', who: 'daiki', expr: 'worried' },
          { say: 'When Grandma was my age, families had five kids, and four of them lived on this street. Somebody was always ten minutes away. Now nobody is ten minutes away.', who: 'daiki', expr: 'worried' } ] },
      { label: '"Do you miss Osaka?"', tone: 'Empathetic', warm: 'daiki',
        then: [
          { say: 'Every single day. And I’d make the same choice again. Both things are true at once. Nobody warns you about that.', who: 'daiki', expr: 'worried' },
          { say: 'In Osaka I ran a team of eleven people. Here, I drive.', who: 'daiki', expr: 'neutral' },
          { say: 'About a hundred thousand people a year in Japan quit or change jobs to take care of a parent. There’s a word for it. There’s a government pamphlet about it. I’ve read the pamphlet.', who: 'daiki', expr: 'worried' },
          { say: 'It is a very good pamphlet. It does not drive to the hospital.', who: 'daiki', expr: 'neutral' } ] },
      { label: '"Osaka’s loss."', tone: 'Playful',
        then: [
          { say: 'Osaka has not noticed.', who: 'daiki', expr: 'warm' },
          { say: 'That’s the thing about big cities. Everyone under forty moved there. The cities didn’t notice. The empty space is all back here.', who: 'daiki', expr: 'neutral' } ] }
    ]},
    { say: 'He is telling you about the {{dependency|dependency ratio}}. He is just pretending it’s a story about a car.', who: 'etsuko', expr: 'stern' },
    { narrate: 'You both look at her.' },
    { say: 'I watch the news. I am old, not dead. They show it on a chart. This many old people. This many working people.', who: 'etsuko', expr: 'neutral' },
    { say: 'When I opened this shop there were eleven working people in this country for every two of my age. It is nearer two to one now, and I am the one.', who: 'etsuko', expr: 'stern' },
    { choose: [
      { label: '"Two working people for every person over 65 — in the whole country?"', tone: 'Curious',
        then: [
          { say: 'Close enough. They say it as a number out of a hundred. {{oldage|About fifty of us for every hundred of you}}, and going up.', who: 'etsuko', expr: 'neutral' },
          { say: 'It sounds like just a number. But it means taxes, and pensions, and a man stuck in his car on the highway.', who: 'etsuko', expr: 'stern' } ] },
      { label: '"That must be strange, being a chart."', tone: 'Empathetic',
        then: [
          { say: 'It is not strange. It is true.', who: 'etsuko', expr: 'stern' },
          { say: 'I would rather be a difficult old woman than a number on a chart. I have managed to be both.', who: 'etsuko', expr: 'warm' } ] },
      { label: '"You’ve been watching TV shows about population again."', tone: 'Playful', warm: 'etsuko',
        then: [
          { say: 'There is nothing else on at two in the afternoon.', who: 'etsuko', expr: 'warm' },
          { say: 'They always film in a town like this one. They always find the emptiest street to stand in. They could film this street. I would tell them to move their van.', who: 'etsuko', expr: 'stern' } ] }
    ]},
    { confessions: true },
    { narrate: 'Daiki drinks the last of the soup, holding the bowl in both hands. His mother taught him that. He doesn’t even think about it.' },
    { say: 'Right. Thanks. I have to drive to Sendai at six tomorrow.', who: 'daiki', expr: 'neutral' },
    { say: 'Take the eggs. There are eggs.', who: 'etsuko', expr: 'neutral' },
    { say: 'I don’t need—', who: 'daiki', expr: 'surprised' },
    { say: 'Take the eggs, Daiki.', who: 'etsuko', expr: 'stern' },
    { bonus: 'daiki' },
    { narrate: 'He takes the eggs.' }
  ],
  react: {
    daiki: {
      matched: [
        { say: 'Oh — oh, that’s a real bowl of ramen.', who: 'daiki', expr: 'surprised' },
        { narrate: 'He stops with the spoon halfway up. He looks at the bowl like it just said something to him.' },
        { say: 'I didn’t know I was hungry. I really didn’t know.', who: 'daiki', expr: 'warm' } ],
      near: [
        { say: 'That’s good. Thank you. That’s good.', who: 'daiki', expr: 'warm' },
        { narrate: 'He eats it steadily, like eating is just one more job on his list.' } ],
      mismatched: [
        { say: 'Oh — great. Thank you.', who: 'daiki', expr: 'neutral' },
        { narrate: 'He eats all of it and doesn’t say anything else. Your grandmother looks at the bowl, then at you. She doesn’t say anything either. That’s worse.' } ]
    }
  },
  confession: {
    daiki: [
      { narrate: 'He puts the spoon down. The phone stays face down.' },
      { say: 'Can I tell you something I haven’t told your mother?', who: 'daiki', expr: 'worried' },
      { say: 'Here is one way the next ten years could go. I’m here every Thursday, and she gets worse slowly. That’s the good version. That’s the one I’m hoping for.', who: 'daiki', expr: 'worried' },
      { say: 'But some days on the highway, I catch myself planning for the bad version. How long could I keep my job? Then I hate myself for about twenty-five miles.', who: 'daiki', expr: 'worried' },
      { say: 'She would have done the same for her mother without even thinking. She did, actually. Nobody wrote a pamphlet about it back then. They just called it being a daughter.', who: 'daiki', expr: 'neutral' },
      { say: 'Don’t tell her I said any of that. She’d be insulted for both of us.', who: 'daiki', expr: 'warm' } ]
  },
  bonus: {
    daiki: [
      { narrate: 'At the curtain he stops, holding the eggs.' },
      { say: 'Hey. Summer kid.', who: 'daiki', expr: 'warm' },
      { say: 'It’s better with you here. Not for the shop. For her.', who: 'daiki', expr: 'warm' } ]
  }},

  /* =====================================================================
     2 — KENJI and MARY.
     Teaches: rural depopulation, the silver economy where nobody is left to
     sell to, and migrant care work as the human form of a policy response.
     ===================================================================== */
  kenji_mary: { script: [
    { narrate: 'Someone holds the curtain up slowly. An old man walks in. He moves at exactly the speed he has decided to move. Behind him is a younger woman with an umbrella she didn’t need and a bag on her shoulder.' },
    { say: 'Etsuko! You’ve changed the curtain.', who: 'kenji', expr: 'warm' },
    { say: 'In 2011.', who: 'etsuko', expr: 'neutral' },
    { say: 'Well. It’s very good.', who: 'kenji', expr: 'warm' },
    { narrate: 'Getting onto the middle stool takes him a moment. The woman doesn’t help him, but she doesn’t look away either. Once he’s seated, she sits next to him and puts the bag where he won’t trip on it.' },
    { say: 'Good evening. Sorry we’re a bit slow tonight. The hill was hot.', who: 'mary', expr: 'warm' },
    { say: 'The hill was not hot. She walks fast because she is thirty-four.', who: 'kenji', expr: 'stern' },
    { say: 'I am thirty-four,', who: 'mary', expr: 'warm' },
    { say: 'and I walk fast because you walk fast when I’m not looking.', who: 'mary', expr: 'warm' },
    { choose: [
      { label: '"Have you two been coming here long?"', tone: 'Curious', warm: 'kenji',
        then: [
          { say: 'I’ve been coming here since Etsuko’s mother-in-law ran the place. Two owners. Same stool.', who: 'kenji', expr: 'warm' },
          { say: 'Mary has been coming here for two years and four months. She likes it more than I do, which is shocking.', who: 'kenji', expr: 'warm' } ] },
      { label: '"You look like you’ve had a day."', tone: 'Empathetic', warm: 'mary',
        then: [
          { say: 'A little. It’s bath day and trash day, and those should never be the same day.', who: 'mary', expr: 'warm' },
          { say: 'She is very serious about the trash. There is a schedule with colors.', who: 'kenji', expr: 'warm' } ] },
      { label: '"Is he always this much trouble?"', tone: 'Playful', warm: 'mary',
        then: [
          { say: 'Yes.', who: 'mary', expr: 'warm' },
          { say: 'I heard that.', who: 'kenji', expr: 'stern' },
          { say: 'You were meant to.', who: 'mary', expr: 'warm' } ] }
    ]},
    { say: 'The plainest thing you have, for me. I have eaten the same bowl since 1968. I see no reason to change now.', who: 'kenji', expr: 'neutral' },
    { say: 'And I’ll have the rich one. The white broth. With the corn.', who: 'mary', expr: 'warm' },
    { say: 'She eats it like someone from the cold north. She is from Cebu, in the Philippines.', who: 'kenji', expr: 'warm' },
    { say: 'I am from the Philippines, where it is warm. I eat it like a person who is cold nine months of the year.', who: 'mary', expr: 'warm' },
    { bench: true },
    { reactions: true },
    { narrate: 'For a while, the only sounds are two people eating and the fan over the stove.' },
    { say: 'Etsuko. Did you hear about Nakano’s?', who: 'kenji', expr: 'worried' },
    { say: 'I heard.', who: 'etsuko', expr: 'neutral' },
    { say: 'Fifty-one years. He didn’t even put up a sign until Friday.', who: 'kenji', expr: 'worried' },
    { choose: [
      { label: '"Nakano’s — the fish shop across the way?"', tone: 'Curious', warm: 'kenji',
        then: [
          { say: 'That’s the shutter you can see from here. Fish on the left, ice in the back. His father ran it before him.', who: 'kenji', expr: 'worried' },
          { say: 'He didn’t go broke. That’s the part people get wrong. He ran out of customers and he ran out of a son.', who: 'kenji', expr: 'worried' },
          { say: 'His son lives near Tokyo and sells insurance. He is doing very well. Why would he come back here to clean fish in a town where the school is closed?', who: 'kenji', expr: 'neutral' } ] },
      { label: '"That must be hard to watch, one at a time."', tone: 'Empathetic', warm: 'kenji',
        then: [
          { say: 'It is like counting down. Nobody tells you that about getting old in a small town.', who: 'kenji', expr: 'worried' },
          { say: 'When I opened my shop, there were eleven businesses on this street. Now there is this place, the vending machine, and a post office that opens three days a week.', who: 'kenji', expr: 'worried' },
          { say: 'The bus went from nine a day to two. The school closed in 2016 with eleven children left. Now they bus them to the next town. Each time, somebody decided it wasn’t worth it anymore. And each one made the next one easier to decide.', who: 'kenji', expr: 'worried' } ] },
      { label: '"Ran out of customers, or ran out of people?"', tone: 'Curious', warm: 'kenji',
        then: [
          { say: 'Ha! Now you sound like the man from the government office.', who: 'kenji', expr: 'warm' },
          { say: 'People. Nobody here stopped being hungry. What we ran out of is {{depop|town}}.', who: 'kenji', expr: 'worried' },
          { say: 'There were four thousand of us when I got married. Now there are under fifteen hundred, and half of them are over sixty-five. Try selling fish to that.', who: 'kenji', expr: 'worried' } ] }
    ]},
    { say: 'They keep saying we are a growth market. Have you heard this? Old people are a growth market. A market that keeps getting bigger.', who: 'kenji', expr: 'stern' },
    { choose: [
      { label: '"That’s the — what’s it called — the ‘silver economy’?"', tone: 'Curious',
        then: [
          { say: 'That’s what they call it. {{silver|The silver economy}}. Businesses that sell to old people. Handrails, hearing aids, soft food, little scooters.', who: 'kenji', expr: 'neutral' },
          { say: 'And it is real! Somebody is getting rich off my bad knees. But look out there and tell me where the store is.', who: 'kenji', expr: 'stern' },
          { say: 'Those stores are all in the big cities, Kōriyama and Sendai. There are enough old people there to pay the rent. Out here, we are the customers, and nobody is here to sell to us.', who: 'kenji', expr: 'worried' } ] },
      { label: '"A growth market. That sounds like an ad."', tone: 'Playful', warm: 'mary',
        then: [
          { say: 'The catalog comes to the house. It is huge. Everything in it is beige.', who: 'mary', expr: 'warm' },
          { say: 'Everything in it is beige. And everything costs four times too much, because they know exactly who is buying.', who: 'kenji', expr: 'stern' } ] },
      { label: '"Somebody’s making money off it, at least."', tone: 'Empathetic',
        then: [
          { say: 'Somebody always is. It is not the town.', who: 'kenji', expr: 'stern' } ] }
    ]},
    { narrate: 'Mary has been quiet, eating her way through her bowl. She sees you looking at her.' },
    { choose: [
      { label: '"How did you end up here, Mary?"', tone: 'Curious', warm: 'mary',
        then: [
          { say: 'Through nursing. Japan has a special visa just for {{migrant|care work}}. I studied Japanese for two years and passed a test I still have nightmares about.', who: 'mary', expr: 'warm' },
          { say: 'I trained in Cebu and worked four years in Manila, back home. My mother is a nurse. My sister is a nurse in Saudi Arabia. It’s what my family does.', who: 'mary', expr: 'warm' },
          { say: 'Japan needs about half a million more care workers than it has. It won’t find them among Japanese twenty-year-olds. There aren’t enough Japanese twenty-year-olds.', who: 'mary', expr: 'neutral' } ] },
      { label: '"Is it strange, being so far from home?"', tone: 'Empathetic', warm: 'mary',
        then: [
          { say: 'Some days. I make video calls at six in the morning because of the time difference. My son is nine. My mother takes care of him.', who: 'mary', expr: 'worried' },
          { say: 'But I like this work. I’m good at it, and it pays for his school. So — yes, it’s hard, and yes, it’s worth it.', who: 'mary', expr: 'warm' },
          { say: 'And this one is easy. He talks the whole time, so I always know he is still breathing.', who: 'mary', expr: 'warm' } ] },
      { label: '"Does he ever actually let you finish a sentence?"', tone: 'Playful', warm: 'mary',
        then: [
          { say: 'Once. In March.', who: 'mary', expr: 'warm' },
          { say: 'It was a very good sentence,', who: 'kenji', expr: 'warm' },
          { say: 'and I have thought about it often since.', who: 'kenji', expr: 'warm' } ] }
    ]},
    { say: 'His daughter set it up through an agency. She called thirty places.', who: 'mary', expr: 'neutral' },
    { say: 'She did. She is very organized. She gets that from her mother.', who: 'kenji', expr: 'warm' },
    { narrate: 'His phone rings in his shirt pocket, very loud, set for someone who can’t hear well. He takes it out with both hands.' },
    { say: 'Ah — that’s her. That’s Sachiko.', who: 'kenji', expr: 'warm' },
    { narrate: 'He answers it right there at the counter. It never occurs to him that a phone call could be private.' },
    { narrate: 'A voice, thin through the speaker: "Dad? Sorry, I’ve only got a minute, I’m still at the office—"' },
    { say: 'I’m at Etsuko’s! I’m having the salt one!', who: 'kenji', expr: 'warm' },
    { narrate: '"—good, good. Listen, about this month. I have a big project at work, and then Hiroto has exams. So I don’t think I can visit until — it might be October, Dad. Is Mary there? Is she there now?"' },
    { say: 'She is here. She is eating corn.', who: 'kenji', expr: 'warm' },
    { narrate: '"Good. Good. That’s — okay. I’ll call Sunday. I will actually call Sunday."' },
    { say: 'Sunday. Yes. Work hard.', who: 'kenji', expr: 'warm' },
    { narrate: 'He sets the phone on the counter, face up. He looks at it longer than the call lasted.' },
    { say: 'Tokyo,', who: 'kenji', expr: 'neutral' },
    { say: 'is four hours away, if the train is on time.', who: 'kenji', expr: 'neutral' },
    { confessions: true },
    { say: 'Okay. Bath day. Up you get, before you get stiff.', who: 'mary', expr: 'warm' },
    { say: 'I do not get stiff.', who: 'kenji', expr: 'stern' },
    { say: 'You get stiff.', who: 'mary', expr: 'warm' },
    { bonus: 'kenji' },
    { bonus: 'mary' },
    { narrate: 'She grabs the bag before he reaches for it. She makes it look like she was standing up anyway.' }
  ],
  react: {
    kenji: {
      matched: [
        { narrate: 'He looks into the bowl before he touches it. The soup is so clear you can see the bottom.' },
        { say: 'Ha! Yes. That is the one.', who: 'kenji', expr: 'warm' },
        { say: 'Nobody makes this anymore. Everybody wants soup thick enough to stand a chopstick in. This is how ramen tasted when it was new.', who: 'kenji', expr: 'warm' } ],
      near: [
        { say: 'That’s a good bowl. Thank you.', who: 'kenji', expr: 'warm' },
        { narrate: 'He eats it happily. But he stirs it twice, like he’s looking for something that isn’t there.' } ],
      mismatched: [
        { say: 'Oh — that’s a lot of food.', who: 'kenji', expr: 'surprised' },
        { narrate: 'He eats a little from the top and drinks about half the soup. He is much too polite to say anything.' } ]
    },
    mary: {
      matched: [
        { say: 'Yes! Yes. That is exactly it.', who: 'mary', expr: 'warm' },
        { say: 'My first winter here, I could not get warm. Somebody put this in front of me, and I understood this whole country in about four minutes.', who: 'mary', expr: 'warm' } ],
      near: [
        { say: 'That’s really nice, thank you.', who: 'mary', expr: 'warm' },
        { narrate: 'She finishes every bite and stacks her bowl neatly inside Kenji’s. Nobody asked her to.' } ],
      mismatched: [
        { say: 'Oh — thank you.', who: 'mary', expr: 'neutral' },
        { narrate: 'She eats it without complaining. Halfway through, she quietly reaches for the pepper.' } ]
    }
  },
  confession: {
    kenji: [
      { narrate: 'He turns the phone face down. It takes him two tries.' },
      { say: 'She is a good daughter. I want to say that first.', who: 'kenji', expr: 'worried' },
      { say: 'She called thirty agencies for me. She pays what the insurance doesn’t. She has a job, a son with exams, and a husband who works even later than she does.', who: 'kenji', expr: 'worried' },
      { say: 'And I have not eaten a meal with my daughter since New Year’s.', who: 'kenji', expr: 'worried' },
      { say: 'Mary is here five days a week. She is kind, and she is good at her job. And she is not my daughter. Both things are true. I would never say the second one in front of her.', who: 'kenji', expr: 'worried' },
      { say: 'That is what all this costs. Not money. The money is fine.', who: 'kenji', expr: 'neutral' } ],
    mary: [
      { narrate: 'Kenji has turned to talk to Etsuko about the curtain again. Mary leans closer to you.' },
      { say: 'Can I tell you something you shouldn’t repeat?', who: 'mary', expr: 'neutral' },
      { say: 'I know why I’m here. I am a policy. Somebody in the government did the math. The math said: not enough young people, too many old people — so open a door.', who: 'mary', expr: 'neutral' },
      { say: 'And it is a narrow door. Even after years on this visa, I’m still not sure what I am here. The visa says one thing. The neighbors say another.', who: 'mary', expr: 'worried' },
      { say: 'But after my accident, he taught me to ride a bike again. He yelled at me the whole way down the hill.', who: 'mary', expr: 'warm' },
      { say: 'You can’t put that on a form. So people will keep arguing about the forms.', who: 'mary', expr: 'warm' } ]
  },
  bonus: {
    kenji: [
      { say: 'You really listen. That matters.', who: 'kenji', expr: 'warm' },
      { say: 'Most people talk right past someone my age. After about ten years of that, you stop trying to talk at all.', who: 'kenji', expr: 'warm' } ],
    mary: [
      { say: 'Hey. Next time I’ll teach you to say something rude in my language.', who: 'mary', expr: 'warm' },
      { say: 'He already knows four. He uses them on the trash cans.', who: 'mary', expr: 'warm' } ]
  }},

  /* =====================================================================
     3 — AIKO and REN.
     Teaches: falling fertility, and why money has not moved it.
     The couple are not fighting. They have had this conversation so many
     times that it has worn smooth, which is worse and more accurate.
     ===================================================================== */
  aiko_ren: { script: [
    { narrate: 'Two people about your mother’s age come in, in the middle of an argument. They stop the moment the curtain drops behind them.' },
    { say: '—no, I’m just saying we could have gone on the weekend instead.', who: 'ren', expr: 'neutral' },
    { say: 'And I’m saying I’m hungry now.', who: 'aiko', expr: 'stern' },
    { narrate: 'They sit. She puts her phone face down without looking at it. He reads the whole menu on the wall, like always, even though he knows it already.' },
    { say: 'Miso for me. Nothing on it. Actually — green onions. That’s it.', who: 'aiko', expr: 'neutral' },
    { say: 'Miso as well, and could I have—', who: 'ren', expr: 'warm' },
    { say: 'He wants the corn and the butter.', who: 'aiko', expr: 'neutral' },
    { say: 'I want the corn and the butter.', who: 'ren', expr: 'warm' },
    { choose: [
      { label: '"Same broth, opposite bowls."', tone: 'Playful', warm: 'ren',
        then: [
          { say: 'That’s marriage. That is the entire thing, right there.', who: 'ren', expr: 'warm' },
          { say: 'He has butter in his coffee.', who: 'aiko', expr: 'neutral' },
          { say: 'Once. I did that once, in 2019, and I will hear about it at my funeral.', who: 'ren', expr: 'warm' } ] },
      { label: '"Rough day?"', tone: 'Empathetic',
        then: [
          { say: 'It was a normal day. A completely normal day. And I’m this tired at the end of it. That’s the part that gets me.', who: 'aiko', expr: 'worried' },
          { narrate: 'She stops herself. She lines up her chopsticks with the edge of the counter.' },
          { say: 'Sorry. Yes. Rough day.', who: 'aiko', expr: 'neutral' } ] },
      { label: '"Are you two from the new apartments?"', tone: 'Curious', warm: 'aiko',
        then: [
          { say: 'For two years now. We moved from Sendai, the city, for his job. I work from home three days a week.', who: 'aiko', expr: 'neutral' },
          { say: 'The rent here is a third of what we paid there. A third. For twice the space.', who: 'aiko', expr: 'warm' },
          { say: 'Because nobody wants to live here,', who: 'aiko', expr: 'neutral' },
          { say: 'which is either a great deal or a bad sign. We’re still finding out which.', who: 'aiko', expr: 'neutral' } ] }
    ]},
    { bench: true },
    { reactions: true },
    { narrate: 'Ren takes out his phone to take a picture of his bowl. He changes his mind. Then he does it anyway.' },
    { say: 'Oh — did you see the town’s new banner? The one by the train station.', who: 'ren', expr: 'warm' },
    { say: 'I saw it.', who: 'aiko', expr: 'stern' },
    { say: 'They raised the baby money again. It’s six hundred thousand yen per child now, I think, plus money for moving here.', who: 'ren', expr: 'warm' },
    { choose: [
      { label: '"Six hundred thousand yen — for having a baby here?"', tone: 'Curious', warm: 'aiko',
        then: [
          { say: 'For having one and staying. There’s money for moving here, money for each child, free doctor visits until junior high, and free daycare.', who: 'aiko', expr: 'neutral' },
          { say: 'It’s about four thousand dollars. That sounds like a lot until you look up what one year of childcare costs. Then the eighteen years after that.', who: 'aiko', expr: 'stern' },
          { say: 'They’ve been trying things like this since the 1990s. {{pronatal|Every part of Japan has a program}}. The birth rate has kept going down the whole time.', who: 'aiko', expr: 'neutral' } ] },
      { label: '"Does that kind of thing work?"', tone: 'Curious', warm: 'aiko',
        then: [
          { say: 'It moves people around. A town with good money steals a family from the town next door. That’s not new babies. That’s just moving them.', who: 'aiko', expr: 'neutral' },
          { say: 'Japan’s number is {{tfr|about 1.2}} kids per woman. You need {{replacement|2.1}} just to stay the same size. No check is big enough to close that gap.', who: 'aiko', expr: 'stern' } ] },
      { label: '"You sound like you’ve looked into it."', tone: 'Empathetic',
        then: [
          { say: 'I have a spreadsheet.', who: 'aiko', expr: 'neutral' },
          { say: 'She has a spreadsheet.', who: 'ren', expr: 'warm' },
          { say: 'I have a spreadsheet because it’s the only way to talk about this without it turning into four hours of feelings.', who: 'aiko', expr: 'stern' } ] }
    ]},
    { say: 'It’s not nothing, though. It pays for about a year of daycare.', who: 'ren', expr: 'warm' },
    { say: 'It’s a year. And then it’s me.', who: 'aiko', expr: 'stern' },
    { narrate: 'She doesn’t say it sharply. She says it like something she has said many times before.' },
    { choose: [
      { label: '"Why you?"', tone: 'Curious', warm: 'aiko',
        then: [
          { say: 'Because that’s how it usually goes. Not in our house — he would do it. He really would.', who: 'aiko', expr: 'neutral' },
          { say: 'I would.', who: 'ren', expr: 'warm' },
          { say: 'But my boss had a baby in March. She came back to work, and her career is over. She’s the one who picks up the baby at six. So she can’t travel. So she didn’t get the big job in Osaka.', who: 'aiko', expr: 'worried' },
          { say: 'Nobody was mean to her. Nobody decided it in a meeting. It just happened to her, one step at a time, over eight months.', who: 'aiko', expr: 'worried' },
          { say: 'I’m thirty-three. I worked for nine years to get where I am. That’s what the six hundred thousand yen is up against. The town doesn’t understand that.', who: 'aiko', expr: 'stern' } ] },
      { label: '"That sounds like a lot to be holding."', tone: 'Empathetic',
        then: [
          { say: 'It’s fine.', who: 'aiko', expr: 'stern' },
          { narrate: 'She eats two bites. Ren says nothing. It seems to be on purpose.' },
          { say: '—It’s not fine. It’s the normal amount of not fine that everyone I know is dealing with. Somehow that’s worse than if it were just me.', who: 'aiko', expr: 'worried' } ] },
      { label: '"Ren, what do you think?"', tone: 'Curious', warm: 'ren',
        then: [
          { say: 'Honestly? I want one. I’ve always wanted one.', who: 'ren', expr: 'warm' },
          { say: 'But I’m not the one whose life gets turned upside down. So my wanting one doesn’t cost me much. I know that. So I try not to push.', who: 'ren', expr: 'worried' },
          { say: 'He is the only man I have ever met who says that out loud.', who: 'aiko', expr: 'warm' },
          { say: 'I got really good at it in therapy,', who: 'ren', expr: 'warm' },
          { say: 'which you also paid for.', who: 'ren', expr: 'warm' } ] }
    ]},
    { say: 'My mother had three by thirty-one.', who: 'aiko', expr: 'neutral' },
    { choose: [
      { label: '"What was different for her?"', tone: 'Curious', warm: 'aiko',
        then: [
          { say: 'Everything, and nothing. She got married at twenty-three because that’s when people did. She quit her job because that’s what women did.', who: 'aiko', expr: 'neutral' },
          { say: 'Her own mother lived four minutes away and watched the kids every afternoon. My mother lives in Sendai. She still works part-time at sixty-two, because her pension is smaller than she was promised.', who: 'aiko', expr: 'worried' },
          { say: 'So: we married later, we’d have kids later, there’s no grandma nearby, and there’s rent. We didn’t stop wanting kids. Everything just got pushed about four years later. And four years later adds up.', who: 'aiko', expr: 'neutral' } ] },
      { label: '"Does she ask about it?"', tone: 'Empathetic',
        then: [
          { say: 'She stopped asking. That is the loudest thing she has ever done.', who: 'aiko', expr: 'worried' } ] },
      { label: '"Three! Where did she keep them all?"', tone: 'Playful', warm: 'ren',
        then: [
          { say: 'In a two-room house, with her mother-in-law living there too. She has told me. Many times. In detail.', who: 'aiko', expr: 'warm' },
          { say: 'The detail is the point of the story, I think,', who: 'ren', expr: 'warm' } ] }
    ]},
    { say: 'The part that gets me is the school.', who: 'ren', expr: 'worried' },
    { say: 'The school here closed before we moved in. So a kid would ride a bus to the next town. Thirty-five minutes each way, starting at six years old.', who: 'ren', expr: 'worried' },
    { say: 'And that’s a reason not to have a kid, isn’t it? The school closed because nobody had children. And now nobody will, because the school closed.', who: 'ren', expr: 'worried' },
    { say: 'That’s the whole problem, in one bus.', who: 'aiko', expr: 'neutral' },
    { confessions: true },
    { narrate: 'She finishes first, and she waits for him. She never waits for anybody at work.' },
    { say: 'Okay. Sorry. That got heavy. It’s a ramen shop.', who: 'aiko', expr: 'neutral' },
    { say: 'People say everything in here. It’s the steam.', who: 'etsuko', expr: 'neutral' },
    { bonus: 'aiko' },
    { bonus: 'ren' }
  ],
  react: {
    aiko: {
      matched: [
        { narrate: 'She takes the first bite like someone about to leave. Then she settles back onto her stool.' },
        { say: 'Oh, that’s good. That’s simple. Thank you.', who: 'aiko', expr: 'warm' },
        { say: 'Today, everything I touched had eleven parts. This has four.', who: 'aiko', expr: 'warm' } ],
      near: [ { say: 'That’s good, thanks.', who: 'aiko', expr: 'neutral' } ],
      mismatched: [
        { say: 'Oh — thank you.', who: 'aiko', expr: 'surprised' },
        { narrate: 'She pushes two of the toppings to the side of the bowl in a neat little pile. She doesn’t eat them.' } ]
    },
    ren: {
      matched: [
        { say: 'Oh, that’s ridiculous. Look at it. Look at the butter.', who: 'ren', expr: 'warm' },
        { say: 'It’s eight at night and he’s eating dessert.', who: 'aiko', expr: 'neutral' },
        { say: 'It’s my comfort bowl,', who: 'ren', expr: 'warm' } ],
      near: [ { say: 'Really good, thank you. Really.', who: 'ren', expr: 'warm' } ],
      mismatched: [
        { say: 'Oh — nice. Very… plain.', who: 'ren', expr: 'neutral' },
        { say: 'He wanted it to be a birthday cake.', who: 'aiko', expr: 'warm' } ]
    }
  },
  confession: {
    aiko: [
      { narrate: 'Ren has gotten up to look at the old photo on the wall. He doesn’t need to.' },
      { say: 'He does that when he thinks I need a minute alone. It’s annoying, and it works.', who: 'aiko', expr: 'warm' },
      { say: 'Here’s what I don’t say out loud. I’m not unsure.', who: 'aiko', expr: 'worried' },
      { say: 'I want a baby. I’ve wanted one since I was twenty-six. I’m not some woman in a magazine story who picked her career instead. I’ve just been doing the math for seven years. And the math keeps saying: not this year.', who: 'aiko', expr: 'worried' },
      { say: 'And I’m thirty-three. There are only so many years left to keep saying ‘not this year.’ I know exactly how many.', who: 'aiko', expr: 'worried' },
      { say: 'So when the town hangs a banner offering me six hundred thousand yen, I’m not insulted that it’s small. I’m insulted that they think the problem is that I didn’t want to.', who: 'aiko', expr: 'stern' } ],
    ren: [
      { narrate: 'Aiko has stepped outside to take a phone call. She said sorry about it twice.' },
      { say: 'She probably told you it’s the money and the job. That’s true.', who: 'ren', expr: 'neutral' },
      { say: 'Here’s what she didn’t say. Her mother called in June to say she needs medical tests. Aiko bought a train ticket before she even hung up.', who: 'ren', expr: 'worried' },
      { say: 'So that means going to Sendai every other weekend, probably. For as long as it takes.', who: 'ren', expr: 'worried' },
      { say: 'Everybody talks about this like it’s one thing at a time. First you raise babies. Then, thirty years later, you take care of your parents.', who: 'ren', expr: 'worried' },
      { say: 'For us, it would be the same five years. Same money, same weekends, same person.', who: 'ren', expr: 'worried' },
      { say: 'I don’t think the people who make these programs have done that math. I think they did the baby part and stopped.', who: 'ren', expr: 'neutral' } ]
  },
  bonus: {
    aiko: [
      { say: 'This was better than being at home. Don’t tell him I said that either.', who: 'aiko', expr: 'warm' } ],
    ren: [
      { say: 'We’ll come back. She won’t say so, but she’ll want to come back Thursday and pretend it was my idea.', who: 'ren', expr: 'warm' } ]
  }},

  /* =====================================================================
     4 — TANAKA and YUI.
     Teaches: political consequences. Two people who love each other and
     want different buildings.
     ===================================================================== */
  tanaka_yui: { script: [
    { narrate: 'The last two of the night. He walks in like he owns a piece of the place. She follows, carrying a folder she’s clearly been holding all day.' },
    { say: 'Etsuko. Still here.', who: 'tanaka', expr: 'warm' },
    { say: 'Still here.', who: 'etsuko', expr: 'neutral' },
    { say: 'This is my daughter. She came up from Sendai. She is telling me I am wrong about several things.', who: 'tanaka', expr: 'warm' },
    { say: 'Two things. I’ve been very polite about it.', who: 'yui', expr: 'warm' },
    { say: 'Pork bone broth. Done right. Nothing trendy on it.', who: 'tanaka', expr: 'neutral' },
    { say: 'Same, but make mine with a kick. And I’ll want a {{kaedama|kaedama}} after — extra noodles.', who: 'yui', expr: 'warm' },
    { say: 'She orders a refill before she has even started.', who: 'tanaka', expr: 'stern' },
    { say: 'That’s how they do it down south in Fukuoka, Dad. You told me that.', who: 'yui', expr: 'warm' },
    { say: 'I told you that in 1994 and you have used it against me ever since.', who: 'tanaka', expr: 'warm' },
    { bench: true },
    { reactions: true },
    { narrate: 'The folder sits closed on the counter between them. Somehow, closed, it’s louder than if it were open.' },
    { choose: [
      { label: '"What’s in the folder?"', tone: 'Curious', warm: 'tanaka',
        then: [
          { say: 'Ah — well. That is for Tuesday’s town meeting.', who: 'tanaka', expr: 'neutral' },
          { say: 'The town has enough money left for one new building. There are two things it could be.', who: 'yui', expr: 'neutral' },
          { say: 'One is a health and senior center — a real one, with daytime care and a room for physical therapy. The other is a daycare center, open late, so parents can work in the city and still raise a child here.', who: 'tanaka', expr: 'neutral' },
          { say: 'One building. One.', who: 'yui', expr: 'stern' } ] },
      { label: '"Councilman? You were on the town council?"', tone: 'Curious', warm: 'tanaka',
        then: [
          { say: 'For twenty-six years. I retired in 2019, and they still send me the papers. I think that’s kind. My daughter thinks it’s a problem.', who: 'tanaka', expr: 'warm' },
          { say: 'It’s not a problem. It’s just that you still get a vote at the meeting, and the meeting is Tuesday.', who: 'yui', expr: 'neutral' } ] },
      { label: '"You two have been arguing all the way here, haven’t you."', tone: 'Playful',
        then: [
          { say: 'Since the train station.', who: 'yui', expr: 'warm' },
          { say: 'It is not arguing. She is simply wrong, for a long time.', who: 'tanaka', expr: 'stern' },
          { say: 'There’s a folder. There’s a meeting Tuesday. One building, and two things it could be.', who: 'yui', expr: 'neutral' } ] }
    ]},
    { say: 'I will tell you exactly how Tuesday goes. I sat in that room for twenty-six years.', who: 'tanaka', expr: 'neutral' },
    { say: 'The senior center wins. The vote will be eleven to four, maybe twelve to three.', who: 'tanaka', expr: 'neutral' },
    { choose: [
      { label: '"How can you know that already?"', tone: 'Curious', warm: 'tanaka',
        then: [
          { say: 'Because I know who sits in that room. And I know who showed up to vote them in.', who: 'tanaka', expr: 'neutral' },
          { say: 'In this town, about four out of five people over sixty-five vote. Every time. Rain, snow, small election — it doesn’t matter.', who: 'tanaka', expr: 'neutral' },
          { say: 'People in their twenties? About one in three. On a good day.', who: 'tanaka', expr: 'stern' },
          { say: 'Now. In twenty-six years, I never once heard a council member say "let’s ignore the young people." Not once. Not one person.', who: 'tanaka', expr: 'neutral' },
          { say: 'But every one of them can count. And {{turnout|counting voters is the whole job}}.', who: 'tanaka', expr: 'neutral' } ] },
      { label: '"Is that what you want to happen?"', tone: 'Curious', warm: 'tanaka',
        then: [
          { say: 'I want the senior center. I won’t pretend I don’t.', who: 'tanaka', expr: 'stern' },
          { say: 'Sixty percent of this town is over sixty. The nearest physical therapy is fifty minutes away, on a bus that runs twice a day.', who: 'tanaka', expr: 'stern' },
          { say: 'Old people are falling down in their homes, alone, and lying there. That isn’t some special-interest group. That’s just an ordinary Wednesday.', who: 'tanaka', expr: 'worried' } ] },
      { label: '"And the daycare doesn’t?"', tone: 'Curious', warm: 'yui',
        then: [
          { say: 'It gets talked about. It has been talked about for six years.', who: 'yui', expr: 'stern' },
          { say: 'It only gets talked about, because the people it’s for are twenty-nine and busy. Most of them don’t live here yet, so they can’t vote. They haven’t moved here because there’s no daycare.', who: 'yui', expr: 'stern' } ] }
    ]},
    { narrate: 'Yui opens the folder about an inch, then shuts it again.' },
    { say: 'Dad. Tell them the other part. The part you told me on the train.', who: 'yui', expr: 'neutral' },
    { narrate: 'He takes his time chewing a bite he doesn’t need.' },
    { say: 'Pensions and medical care for old people take up about a third of the national budget now. Maybe more, depending on who’s counting.', who: 'tanaka', expr: 'neutral' },
    { say: 'And it is paid for by people working today. The system was set up when there were many workers and few old people.', who: 'tanaka', expr: 'neutral' },
    { say: 'And no one — no political party, no one — will change it, because {{silverdem|we are the ones who show up to vote}}.', who: 'tanaka', expr: 'worried' },
    { choose: [
      { label: '"So what would you actually do about it?"', tone: 'Curious', warm: 'yui',
        then: [
          { say: 'Split it. Same building.', who: 'yui', expr: 'neutral' },
          { say: 'Senior care in one half, daycare in the other. One kitchen, one parking lot, one heating bill. A city called Toyama did it, and the old people love it because there are kids in the building.', who: 'yui', expr: 'warm' },
          { say: 'It’s cheaper than building two. But it’s somehow the hardest thing in the world to get passed, because it isn’t what either side asked for.', who: 'yui', expr: 'stern' },
          { say: '...It is not a stupid idea.', who: 'tanaka', expr: 'neutral' },
          { say: 'High praise. I’ll take it to the meeting.', who: 'yui', expr: 'warm' } ] },
      { label: '"That’s a hard thing to say out loud."', tone: 'Empathetic', warm: 'yui',
        then: [
          { say: 'He’s said it exactly twice. Never in a meeting.', who: 'yui', expr: 'neutral' },
          { say: 'Because if you say it in a meeting, you might as well quit your job.', who: 'tanaka', expr: 'stern' } ] },
      { label: '"So the young people should just vote."', tone: 'Playful', warm: 'yui',
        then: [
          { say: 'Yes! Yes, they should. I say that at every family dinner, and it changes nothing.', who: 'yui', expr: 'stern' },
          { say: 'Because there are also just fewer young people. That’s not a lecture. That’s the low birth rate showing up at the voting booth, twenty years later.', who: 'yui', expr: 'neutral' },
          { say: 'You can’t out-vote the population numbers. You can only build the thing before it’s too late to matter.', who: 'yui', expr: 'worried' } ] }
    ]},
    { narrate: 'You put the extra noodles in front of Yui. She drops some into what’s left of her father’s soup too, without asking. He lets her.' },
    { confessions: true },
    { say: 'Tuesday, then.', who: 'yui', expr: 'neutral' },
    { say: 'Tuesday.', who: 'tanaka', expr: 'neutral' },
    { say: 'I make no promises. I am a very stubborn man, and I have a reputation to protect.', who: 'tanaka', expr: 'warm' },
    { bonus: 'tanaka' },
    { bonus: 'yui' }
  ],
  react: {
    tanaka: {
      matched: [
        { narrate: 'He doesn’t say anything for a moment. He turns the bowl a tiny bit, the way you straighten something that matters.' },
        { say: 'Now that. That’s how it tasted in the south, in 1971, when I was twenty-two and had no money and no sense.', who: 'tanaka', expr: 'warm' },
        { say: 'Dad’s doing the face.', who: 'yui', expr: 'warm' },
        { say: 'I am not doing a face.', who: 'tanaka', expr: 'stern' } ],
      near: [ { say: 'Good. Yes. That’s good work.', who: 'tanaka', expr: 'warm' } ],
      mismatched: [
        { say: 'Hm.', who: 'tanaka', expr: 'stern' },
        { narrate: 'He eats all of it, properly, at a steady pace. He says nothing at all about it. From him, that says plenty.' } ]
    },
    yui: {
      matched: [
        { say: 'Oh, that’s the one. That’s exactly the one.', who: 'yui', expr: 'warm' },
        { say: 'I’ve eaten a lot of bad pork bone ramen in Sendai because I missed home. This is what I was missing.', who: 'yui', expr: 'warm' } ],
      near: [ { say: 'That’s really good, thank you.', who: 'yui', expr: 'warm' } ],
      mismatched: [
        { say: 'Thanks. Yeah, that’s — thanks.', who: 'yui', expr: 'neutral' },
        { narrate: 'She eats it fast, just to get it done. She adds more pepper than it needs.' } ]
    }
  },
  confession: {
    tanaka: [
      { narrate: 'Yui has gone outside to take a call. He watches the curtain swing.' },
      { say: 'I will tell you something I haven’t said to her.', who: 'tanaka', expr: 'worried' },
      { say: 'She is right. About the building, and about the rest of it.', who: 'tanaka', expr: 'worried' },
      { say: 'I sat in that room for twenty-six years. Every single time, I voted for people my own age. Each time, I told myself it was the most urgent thing. And each time, it was! That is the trick. Every single one was urgent.', who: 'tanaka', expr: 'worried' },
      { say: 'And now the school is closed, the young people are in the city, and the town I was protecting has fourteen hundred people. Half of them are over sixty-one.', who: 'tanaka', expr: 'worried' },
      { say: 'I didn’t vote the town away in one meeting. I did it in two hundred meetings, being reasonable every time.', who: 'tanaka', expr: 'worried' },
      { say: 'So on Tuesday, I am going to vote for her building. And I am going to complain the whole way there. I am seventy-six. I’ve earned that much.', who: 'tanaka', expr: 'stern' } ],
    yui: [
      { narrate: 'Her father has turned to argue with Etsuko about a road that was repaved in 2006.' },
      { say: 'Can I be honest? I don’t actually think he’s the problem.', who: 'yui', expr: 'neutral' },
      { say: 'People my age talk about old people like they’re stealing from us. But then I sit in a meeting like Tuesday’s. It’s twelve people who all know each other, trying to keep a town alive with one building.', who: 'yui', expr: 'worried' },
      { say: 'Nobody in that room is greedy. They are just the ones who came.', who: 'yui', expr: 'neutral' },
      { say: 'I plan cities for a living. Do you know how many towns in Japan might stop working as towns by 2040? About four in ten.', who: 'yui', expr: 'worried' },
      { say: 'So I yell at my dad about a daycare. But what I really mean is this: I don’t want to come back in fifteen years and find him alone in a house on an empty street, with nobody left to notice.', who: 'yui', expr: 'worried' },
      { say: 'I can say that about a building. I can’t say it about him.', who: 'yui', expr: 'worried' } ]
  },
  bonus: {
    tanaka: [
      { say: 'You asked me what I think. People don’t do that at my age. They tell me what I think.', who: 'tanaka', expr: 'warm' } ],
    yui: [
      { say: 'If you’re here next summer, come to a town meeting. They’re incredibly boring. And they’re where everything really gets decided.', who: 'yui', expr: 'warm' } ]
  }},

  /* =====================================================================
     5 — HIROSHI, on his own.
     Teaches: social isolation, single-person elderly households, and the
     small industry that exists to check whether somebody is still alive.

     The rule for writing him: he never asks for sympathy and never
     complains. He apologises for taking up time. Everything sad about him
     is something the player notices rather than something he says. He is
     also the only customer all night who asks the player a question.
     ===================================================================== */
  hiroshi: { script: [
    { narrate: 'It’s ten minutes to ten. You’re wiping the counter when the curtain lifts, slowly, with one hand. Like someone who isn’t sure he should come in.' },
    { say: 'Ah — you’re still open? Are you still open? I can come another time.', who: 'hiroshi', expr: 'worried' },
    { say: 'Sit down, Hiroshi.', who: 'etsuko', expr: 'neutral' },
    { say: 'Only if it’s no trouble.', who: 'hiroshi', expr: 'worried' },
    { say: 'Sit down.', who: 'etsuko', expr: 'stern' },
    { narrate: 'He sits on the second stool from the end. He puts his cap on the counter, then changes his mind and puts it on his knee. He’s wearing an ironed, collared shirt. On a Tuesday.' },
    { choose: [
      { label: '"You’re not trouble. It’s been quiet all night."', tone: 'Empathetic',
        then: [
          { say: 'That is kind. That is very kind.', who: 'hiroshi', expr: 'warm' },
          { narrate: 'He says it like someone accepting a gift. Then he looks down at the counter for a moment.' } ] },
      { label: '"I don’t think we’ve met — I’m Etsuko’s grandchild."', tone: 'Curious', warm: 'hiroshi',
        then: [
          { say: 'Ah! The summer helper. She told me about you. In — June, I think. Yes, June.', who: 'hiroshi', expr: 'warm' },
          { say: 'I’m Hiroshi. Hiroshi Yamashita. I live at the end of the road, in the gray house with the bad gate.', who: 'hiroshi', expr: 'warm' },
          { say: 'It is not a bad gate. It is a fine gate. I have been meaning to fix it since 2011.', who: 'hiroshi', expr: 'neutral' } ] },
      { label: '"Ironed shirt on a Tuesday. Big night?"', tone: 'Playful', warm: 'hiroshi',
        then: [
          { say: 'Ha! No. No.', who: 'hiroshi', expr: 'warm' },
          { say: 'It’s a habit. I caught the 6:52 train to work for forty-one years. The job is gone, but the shirt stayed.', who: 'hiroshi', expr: 'warm' } ] }
    ]},
    { say: 'And how do you like it? The shop, the town? It must be very slow for someone your age.', who: 'hiroshi', expr: 'warm' },
    { narrate: 'You realize he is the first customer all night to ask you a question.' },
    { choose: [
      { label: '"Honestly? It’s the best summer I’ve had."', tone: 'Empathetic', warm: 'hiroshi',
        then: [
          { say: 'Is it. Is it really.', who: 'hiroshi', expr: 'warm' },
          { say: 'That is a very good thing to hear. I will think about that later.', who: 'hiroshi', expr: 'warm' },
          { narrate: 'You aren’t sure what he means by later.' } ] },
      { label: '"It’s slow. I’ve started to like slow."', tone: 'Curious', warm: 'hiroshi',
        then: [
          { say: 'It takes about two years, in my experience. My wife liked it right away. It took me until about 2004.', who: 'hiroshi', expr: 'warm' } ] },
      { label: '"She works me to death."', tone: 'Playful', warm: 'hiroshi',
        then: [
          { say: 'She does that. She did it to your grandfather too. He used to hide in the walk-in fridge.', who: 'hiroshi', expr: 'warm' },
          { say: 'He was counting stock.', who: 'etsuko', expr: 'stern' },
          { say: 'He was hiding in the fridge, Etsuko.', who: 'hiroshi', expr: 'warm' } ] }
    ]},
    { say: 'Anyway. Whatever is easiest. I’m not picky.', who: 'hiroshi', expr: 'neutral' },
    { narrate: 'Your grandmother doesn’t help you. She is wiping a pan that is already clean.' },
    { say: 'He will tell you, if you ask him the right way.', who: 'etsuko', expr: 'neutral' },
    { choose: [
      { label: '"What do you usually have?"', tone: 'Curious', warm: 'hiroshi',
        then: [
          { say: 'Oh — I do not want to be a—', who: 'hiroshi', expr: 'worried' },
          { say: 'Hiroshi.', who: 'etsuko', expr: 'stern' },
          { say: 'The soy sauce one. The local one, Kitakata style. With the bamboo shoots and the egg.', who: 'hiroshi', expr: 'warm' },
          { say: 'That is how Kimiko, my wife, always ordered it. Every time, for thirty years. Nobody could change her mind. So I had it too, and then I could not stop.', who: 'hiroshi', expr: 'warm' } ] },
      { label: '"Everybody has a favorite. What’s yours?"', tone: 'Playful', warm: 'hiroshi',
        then: [
          { say: 'Ha. All right. All right, you caught me.', who: 'hiroshi', expr: 'warm' },
          { say: 'The soy sauce one. The local Kitakata style. Bamboo shoots and the egg. It was my wife’s order. I ate it next to her for thirty years, and it stuck.', who: 'hiroshi', expr: 'warm' } ] },
      { label: '"I’ll surprise you, then."', tone: 'Playful',
        then: [
          { say: 'Please. Anything at all.', who: 'hiroshi', expr: 'warm' },
          { narrate: 'He glances, very quickly, at the menu sign on the wall — the soy sauce one. Then he doesn’t mention it.' } ] }
    ]},
    { bench: true },
    { reactions: true },
    { narrate: 'He eats slowly. Slower than anyone else tonight. It takes you a minute to realize he’s doing it on purpose.' },
    { say: 'The lamps out in the arcade are broken again. The middle one.', who: 'hiroshi', expr: 'neutral' },
    { say: 'Nine months.', who: 'etsuko', expr: 'stern' },
    { say: 'Nine months! I will write to them again.', who: 'hiroshi', expr: 'warm' },
    { say: 'You have written twice.', who: 'etsuko', expr: 'neutral' },
    { say: 'Then a third letter won’t surprise them.', who: 'hiroshi', expr: 'warm' },
    { choose: [
      { label: '"Have you been here long? In the town, I mean."', tone: 'Curious', warm: 'hiroshi',
        then: [
          { say: 'Twenty-seven years. We came here to retire. That was the plan. Kimiko’s family came from a town nearby.', who: 'hiroshi', expr: 'warm' },
          { say: 'But I worked at my company until I was sixty-two. So for the first ten years, I was only here on weekends. I made electronics. Thermostats, mostly. Kettles, rice cookers, and one very bad hair dryer in 1988.', who: 'hiroshi', expr: 'warm' },
          { say: 'Forty-one years at the same company. You do not notice at the time that it is also every single person you know.', who: 'hiroshi', expr: 'neutral' } ] },
      { label: '"You know everyone’s business around here."', tone: 'Playful', warm: 'hiroshi',
        then: [
          { say: 'I know the lamps. The lamps are my job.', who: 'hiroshi', expr: 'warm' },
          { say: 'I was an engineer. Forty-one years, mostly thermostats. You retire, but the habit of noticing things doesn’t retire with you.', who: 'hiroshi', expr: 'warm' } ] },
      { label: '"Who do you write to about a lamp?"', tone: 'Curious',
        then: [
          { say: 'The town office, supposedly. Really it’s the shop owners’ club. Except the club is now two people, and one of them is me.', who: 'hiroshi', expr: 'neutral' },
          { say: 'The other one is eighty-eight and lives in the city with her son.', who: 'hiroshi', expr: 'neutral' } ] }
    ]},
    { narrate: 'His phone makes a sound on the counter — not a ring, just a short beep-beep. He looks at it. For a second his face goes blank. Then he comes back.' },
    { say: 'Ah — that’s only the kettle.', who: 'hiroshi', expr: 'neutral' },
    { choose: [
      { label: '"The kettle?"', tone: 'Curious', warm: 'hiroshi',
        then: [
          { say: 'It’s really a hot water thermos. My son bought it. When you make tea, it sends a little message to him in Chiba, near Tokyo. It sends one to me too, so I know it worked.', who: 'hiroshi', expr: 'neutral' },
          { say: 'If I don’t use it by evening, it messages him anyway. Then he calls me.', who: 'hiroshi', expr: 'neutral' },
          { narrate: 'He turns the phone so you can see it. One line of text: 7:48pm — hot water used.' },
          { say: 'It is a {{mimamori|watch-over}} device. There’s a whole business in them now. Thermoses, fridge doors, electric meters. Even the gas company will check on you.', who: 'hiroshi', expr: 'neutral' } ] },
      { label: '"That’s a strange sound for a kettle."', tone: 'Playful', warm: 'hiroshi',
        then: [
          { say: 'It is a strange thing for a kettle. It writes to my son.', who: 'hiroshi', expr: 'warm' },
          { say: 'You make tea here, and a phone lights up hours away. Nobody in 1988 would have believed what we’d use that for.', who: 'hiroshi', expr: 'warm' } ] },
      { label: '"Is somebody checking on you?"', tone: 'Empathetic',
        then: [
          { say: 'Ah — no. Well. Yes.', who: 'hiroshi', expr: 'worried' },
          { narrate: 'He lines up the phone with the edge of the counter.' },
          { say: 'It is a thermos that tells my son I made tea. It is a {{mimamori|watch-over}} thing. There are lots of them now.', who: 'hiroshi', expr: 'neutral' } ] }
    ]},
    { say: 'And I will tell you what nobody says about it.', who: 'hiroshi', expr: 'warm' },
    { say: 'It is a lovely piece of design.', who: 'hiroshi', expr: 'warm' },
    { narrate: 'He means it. He sounds like a proud engineer. It takes you a second to understand what he’s really saying.' },
    { say: 'Really — it is. It uses almost no power. If it breaks, it breaks safely. My old team would have been proud of it. I would have approved it in one morning.', who: 'hiroshi', expr: 'warm' },
    { say: 'And what it is for is telling my son that I’m still alive.', who: 'hiroshi', expr: 'neutral' },
    { say: 'I do think about that. On good days, I think it is very clever. On other days, I make the tea, I look at the little light, and I think: there. Proof.', who: 'hiroshi', expr: 'worried' },
    { confessions: true },
    { narrate: 'He finishes the bowl, drinks the soup, and sets the bowl down exactly in the middle of the mat.' },
    { say: 'That was — thank you. That was a good one.', who: 'hiroshi', expr: 'warm' },
    { say: 'Well. I have kept you both too long. It is nearly—', who: 'hiroshi', expr: 'worried' },
    { narrate: 'He is already reaching for his cap.' },
    { choose: [
      { label: '"Come back Tuesday. It’s always empty on Tuesdays."', tone: 'Empathetic', warm: 'hiroshi',
        then: [
          { narrate: 'He stops with the cap halfway to his head.' },
          { say: 'Tuesday.', who: 'hiroshi', expr: 'surprised' },
          { say: 'Yes. All right. Tuesday, then — if it’s really no—', who: 'hiroshi', expr: 'warm' },
          { say: 'Tuesday, Hiroshi.', who: 'etsuko', expr: 'stern' },
          { say: 'Tuesday.', who: 'hiroshi', expr: 'warm' },
          { narrate: 'He puts on his cap. He walks differently now.' } ] },
      { label: '"You haven’t kept us. Finish your tea."', tone: 'Empathetic', warm: 'hiroshi',
        then: [
          { say: 'I have finished it. I finished it eleven minutes ago. I’ve just been sitting here anyway.', who: 'hiroshi', expr: 'warm' },
          { narrate: 'He says it like a joke about himself. It doesn’t quite come out as a joke.' },
          { say: 'Come Tuesday. Tuesdays are empty.', who: 'etsuko', expr: 'neutral' },
          { say: '...All right. Tuesday.', who: 'hiroshi', expr: 'warm' } ] },
      { label: '"Next time, you fix that gate and I’ll hold it."', tone: 'Playful', warm: 'hiroshi',
        then: [
          { say: 'The gate is fine!', who: 'hiroshi', expr: 'surprised' },
          { narrate: 'A pause.' },
          { say: 'Saturday. I have the wood. I’ve had the wood since 2011.', who: 'hiroshi', expr: 'warm' },
          { say: 'Saturday, then. Bring gloves. It is a terrible gate.', who: 'hiroshi', expr: 'warm' } ] }
    ]},
    { bonus: 'hiroshi' },
    { narrate: 'At the curtain he turns and bows a little — to Etsuko, to you, and to the shop. Then he walks out under the broken lamp and slowly up the arcade.' },
    { say: 'His wife died in the spring of 2019. She got sick and it was very fast.', who: 'etsuko', expr: 'neutral' },
    { say: 'He came in the week after. He sat right where you’re wiping and said nothing for forty minutes. I let him.', who: 'etsuko', expr: 'neutral' },
    { choose: [
      { label: '"Does he have anyone here?"', tone: 'Curious', warm: 'etsuko',
        then: [
          { say: 'A son in Chiba who calls on Sundays and visits at New Year’s. A good son. Not a nearby son.', who: 'etsuko', expr: 'neutral' },
          { say: 'And that’s all. He worked in Tokyo his whole life. His friends were the people at his company. The company is in Tokyo. Most of those friends are dead or in Tokyo. From here, that’s the same problem.', who: 'etsuko', expr: 'stern' },
          { say: 'One in five men his age in Japan lives alone. It’s on the same chart as everything else. {{isolation|They call it a "social" problem}}, like it’s just a feeling.', who: 'etsuko', expr: 'stern' } ] },
      { label: '"He waited outside, didn’t he."', tone: 'Empathetic', warm: 'etsuko',
        then: [
          { say: 'On the bench. He does it most weeks.', who: 'etsuko', expr: 'neutral' },
          { say: 'He waits until it’s quiet so he won’t be in anybody’s way. But by the time it’s quiet, I’m closing. So he only gets twenty minutes.', who: 'etsuko', expr: 'worried' },
          { say: 'I have told him. For four years I have told him. He is a polite man, and being polite is going to be what kills him.', who: 'etsuko', expr: 'stern' } ] },
      { label: '"He seemed all right, though."', tone: 'Playful',
        then: [
          { say: 'He is all right. That is not the same as being taken care of.', who: 'etsuko', expr: 'stern' },
          { say: 'He is all right for twenty minutes on a Tuesday. The other six days, he is just a light on his son’s phone.', who: 'etsuko', expr: 'worried' } ] }
    ]},
    { say: 'Right. The pots.', who: 'etsuko', expr: 'neutral' }
  ],
  react: {
    hiroshi: {
      matched: [
        { narrate: 'He looks at it for a moment before he picks up his chopsticks. The bamboo shoots. The egg.' },
        { say: 'Ah.', who: 'hiroshi', expr: 'surprised' },
        { narrate: 'That’s all he says. Then he is quiet for a while. So is your grandmother. The fan hums.' },
        { say: 'You were listening. That is — thank you. People don’t, usually. It’s nobody’s fault. Everybody is just busy.', who: 'hiroshi', expr: 'warm' } ],
      near: [
        { say: 'That is very good. Thank you.', who: 'hiroshi', expr: 'warm' },
        { narrate: 'He eats it gratefully and doesn’t move anything around in the bowl. Later you’ll realize he treats everything that way.' } ],
      mismatched: [
        { say: 'Oh — how nice. Thank you very much.', who: 'hiroshi', expr: 'warm' },
        { narrate: 'He eats every bite and thanks you twice more. He never mentions that it isn’t what he has ordered every week since 1994.' } ]
    }
  },
  confession: {
    hiroshi: [
      { narrate: 'Etsuko has gone into the back room to get something. There is nothing she needs back there.' },
      { say: 'May I tell you something I haven’t told my son?', who: 'hiroshi', expr: 'worried' },
      { say: 'In March, I fell. In the hallway, on the little step. Nothing dramatic. I got up after a while, and I wasn’t hurt.', who: 'hiroshi', expr: 'neutral' },
      { say: 'It wasn’t the fall that scared me.', who: 'hiroshi', expr: 'worried' },
      { say: 'It was this. While I was on the floor, I did the math. He calls on Sunday. It was Wednesday. If the thermos didn’t go off at eight, he might think I went to bed early. He is busy. He wouldn’t want to make a fuss.', who: 'hiroshi', expr: 'worried' },
      { say: 'I got to Friday. Lying there, I figured nobody would check on me until Friday. And I thought: well. That’s the system doing exactly what it was built to do.', who: 'hiroshi', expr: 'worried' },
      { narrate: 'He straightens his phone again. It was already straight.' },
      { say: 'They have a word for it now. They have a word and a cleaning company and a line in the budget. That means it happens often enough to need all three.', who: 'hiroshi', expr: 'neutral' },
      { say: 'I don’t want that word used about me. I want to be a person it doesn’t apply to.', who: 'hiroshi', expr: 'worried' },
      { say: 'So — I sit on the bench for a while. Then I come in and bother your grandmother for twenty minutes. That takes care of Tuesday. That is my whole system.', who: 'hiroshi', expr: 'warm' },
      { say: 'Don’t tell my son about March. He would move me to Chiba by October. And there, I would be nobody at all.', who: 'hiroshi', expr: 'worried' } ]
  },
  bonus: {
    hiroshi: [
      { narrate: 'He pauses with one hand on the curtain.' },
      { say: 'You asked me a question earlier. About the town. And you waited for the answer.', who: 'hiroshi', expr: 'warm' },
      { say: 'I’ve thought of four more things to tell you since then. I will have to save them.', who: 'hiroshi', expr: 'warm' } ]
  }},

  /* =====================================================================
     CLOSING UP — where the night gets tied together, by the one person
     who has been standing there through all four conversations.
     ===================================================================== */
  closing: { script: [
    { narrate: 'It’s 10:10. Etsuko takes the curtain down herself. She never lets you do it. Then she sits on the customer side of her own counter. You have never seen her do that.' },
    { say: 'Sit. Two minutes. Then the pots.', who: 'etsuko', expr: 'neutral' },
    { narrate: 'The fan clicks off. The street outside is totally silent. It took you a week to get used to that.' },
    { choose: [
      { label: '"Is it always like that? All of them at once?"', tone: 'Curious', warm: 'etsuko',
        then: [
          { say: 'It’s always the same five conversations. Just different people.', who: 'etsuko', expr: 'neutral' },
          { say: 'Somebody is driving somebody to the hospital. Somebody’s shop has closed. Somebody can’t afford the child they want. Somebody is angry about a building. And somebody comes in at ten o’clock because there’s nobody waiting at home.', who: 'etsuko', expr: 'neutral' },
          { say: 'Forty-one years. In 1984, the conversations were: the new highway, the price of pork, a wedding, and whose son was being an idiot.', who: 'etsuko', expr: 'warm' } ] },
      { label: '"Everyone was talking about the same thing tonight."', tone: 'Curious', warm: 'etsuko',
        then: [
          { say: 'They were talking about five things, and it was all one thing. Yes. Good job.', who: 'etsuko', expr: 'warm' },
          { say: 'Nobody in here would use those words. Nobody says "we are an {{aging|aging population}}" while eating. They say: my daughter can’t visit until October.', who: 'etsuko', expr: 'neutral' } ] },
      { label: '"You must be exhausted."', tone: 'Empathetic',
        then: [
          { say: 'I am seventy-four. I am always exhausted. That’s just normal now.', who: 'etsuko', expr: 'stern' },
          { narrate: 'She leans back a little. That’s her way of agreeing with you.' } ] }
    ]},
    { say: 'At school they’ll tell you it’s because women stopped having babies. That’s the half of the story that fits on a chart.', who: 'etsuko', expr: 'stern' },
    { choose: [
      { label: '"What’s the other half?"', tone: 'Curious', warm: 'etsuko',
        then: [
          { say: 'That we old people didn’t die.', who: 'etsuko', expr: 'warm' },
          { say: 'I have survived two illnesses that would have killed my mother at my age. And here I am, complaining about my back. {{lifeexp|We stopped dying}} and we did not start being born. That is the whole story. And one half of it is a triumph — a win.', who: 'etsuko', expr: 'neutral' },
          { say: 'Nobody wants to say the win is part of the problem. So they blame young women instead.', who: 'etsuko', expr: 'stern' } ] },
      { label: '"That’s not really fair on Aiko, is it."', tone: 'Empathetic', warm: 'etsuko',
        then: [
          { say: 'It isn’t fair to anybody. Aiko is doing math. So was I, in 1976. My math just came out the other way, because my mother lived up the road and rent was cheap.', who: 'etsuko', expr: 'neutral' },
          { say: 'Same kind of woman. Different math.', who: 'etsuko', expr: 'neutral' } ] },
      { label: '"So it’s your fault for living so long."', tone: 'Playful', warm: 'etsuko',
        then: [
          { say: 'Entirely. I am extremely sorry.', who: 'etsuko', expr: 'warm' },
          { say: 'I intend to keep doing it.', who: 'etsuko', expr: 'stern' } ] }
    ]},
    { say: 'Ask me the question you’ve been holding in all night.', who: 'etsuko', expr: 'neutral' },
    { choose: [
      { label: '"What happens to the shop?"', tone: 'Curious',
        then: [
          { say: 'Nothing happens to the shop. The shop closes.', who: 'etsuko', expr: 'neutral' },
          { say: 'Not this year. But your uncle is always driving, your mother is in Sendai, and your life isn’t on this street. It shouldn’t be.', who: 'etsuko', expr: 'neutral' },
          { say: 'There are nine million {{akiya|empty houses}} in Japan. Someday this will be one of them. It won’t be a tragedy. It will just be a normal Tuesday.', who: 'etsuko', expr: 'stern' },
          { say: 'That isn’t sad. It’s only sad if nobody remembers it was here.', who: 'etsuko', expr: 'warm' },
          { say: 'That is what the summer is for.', who: 'etsuko', expr: 'warm' } ] },
      { label: '"Are you all right? Really?"', tone: 'Empathetic',
        then: [
          { say: 'No.', who: 'etsuko', expr: 'neutral' },
          { narrate: 'She says it like a fact about the weather.' },
          { say: 'My back is getting worse. The hospital is twice a month. My son drives sixty thousand miles a year because of me. He won’t say so. But I know exactly what it costs him.', who: 'etsuko', expr: 'worried' },
          { say: 'And I would rather be a burden here than be comfortable in a nursing home in the city. Nobody there would know that I opened this shop in 1984 with eight hundred thousand yen — about five thousand dollars — and a cousin’s van.', who: 'etsuko', expr: 'stern' },
          { say: 'No government program can fix that. Nobody can build that.', who: 'etsuko', expr: 'worried' } ] },
      { label: '"Can I do the pots?"', tone: 'Playful', warm: 'etsuko',
        then: [
          { say: 'You may do the pots.', who: 'etsuko', expr: 'warm' },
          { say: 'But not the way you did them on Sunday.', who: 'etsuko', expr: 'stern' } ] }
    ]},
    { narrate: 'She stands up, holding on to the counter. She has to stop for a moment on the way. She would say she didn’t.' },
    { say: 'Same thing tomorrow. Six o’clock. Eggs.', who: 'etsuko', expr: 'neutral' },
    { say: 'And keep that notebook somewhere safe. You’ll want it later.', who: 'etsuko', expr: 'warm' }
  ]}

  };

  global.Scenes = SCENES;

}(window));
