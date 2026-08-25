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
    { narrate: 'Six-forty in the evening. The broth has been on since two. Your grandmother is standing on a rubber mat behind the counter with her hands on the rail, doing the thing where she pretends she is thinking about something.' },
    { say: 'You’re early.', who: 'etsuko', expr: 'neutral' },
    { say: 'I said seven. It is not seven.', who: 'etsuko', expr: 'stern' },
    { choose: [
      { label: '"I thought I’d help set up."', tone: 'Curious', warm: 'etsuko',
        then: [
          { say: 'Set up. There is nothing to set up. The broth is on, the noodles are in the fridge, the bowls are where the bowls go.', who: 'etsuko', expr: 'neutral' },
          { narrate: 'She hands you an apron anyway, without looking at you.' },
          { say: 'Eggs need doing. Six. Marinade is in the blue container and don’t crack them on the rim, use the counter.', who: 'etsuko', expr: 'warm' } ] },
      { label: '"Mum said you’d try to open by yourself again."', tone: 'Playful', warm: 'etsuko',
        then: [
          { say: 'Your mother says a great many things from Sendai, where she is not.', who: 'etsuko', expr: 'stern' },
          { narrate: 'A beat.' },
          { say: 'Apron’s on the hook. Eggs need doing. Six.', who: 'etsuko', expr: 'warm' } ] },
      { label: '"How’s your back today?"', tone: 'Empathetic',
        then: [
          { say: 'My back is my business.', who: 'etsuko', expr: 'stern' },
          { narrate: 'She turns to the pot, which does not need turning to.' },
          { say: 'Apron. Eggs. Six of them.', who: 'etsuko', expr: 'neutral' } ] }
    ]},
    { narrate: 'You do the eggs. It takes nine minutes and she watches you do all nine without saying anything.' },
    { say: 'Forty-one years I have opened this shop. Your grandfather did eleven of them and then he stopped, which was rude of him.', who: 'etsuko', expr: 'warm' },
    { say: 'Now hang the noren out. Nobody comes in if the curtain isn’t out.', who: 'etsuko', expr: 'neutral' },
    { narrate: 'Outside, the street is the colour of an evening in August. Four shops on it. Two of them have their shutters down and one of those has had them down since before you were born.' },
    { narrate: 'You hang the curtain out. Somewhere down the road a car door shuts.' }
  ]},

  /* =====================================================================
     1 — DAIKI. Your uncle. Etsuko's son.
     Teaches: the old-age dependency ratio, standing in one room; and the
     caregiving burden as an actual timetable rather than an idea.
     ===================================================================== */
  daiki: { script: [
    { narrate: 'The curtain lifts and a man in a work shirt ducks under it, already apologising to the room in general.' },
    { say: 'Sorry — sorry. Am I — you’re open? You’re open.', who: 'daiki', expr: 'surprised' },
    { say: 'We are open because the curtain is out. That is what the curtain is for.', who: 'etsuko', expr: 'stern' },
    { say: 'Hello, Mum.', who: 'daiki', expr: 'warm' },
    { narrate: 'He sits at the end stool, the one nearest the door, which is where he always sits. He puts his phone face up on the counter and then turns it face down. Then face up again.' },
    { choose: [
      { label: '"Long one?"', tone: 'Empathetic', warm: 'daiki',
        then: [
          { say: 'Nagoya and back. Left at five. There was a lorry on the expressway at Toyota and I sat in it for an hour and a half thinking about nothing at all.', who: 'daiki', expr: 'worried' },
          { say: 'It was quite restful, honestly. Nothing was my fault for ninety minutes.', who: 'daiki', expr: 'warm' } ] },
      { label: '"You look like you’ve been driving since Tuesday."', tone: 'Playful', warm: 'daiki',
        then: [
          { say: 'I have. Not the same Tuesday, though. Several Tuesdays.', who: 'daiki', expr: 'warm' },
          { say: 'Nagoya and back today. Left at five this morning.', who: 'daiki', expr: 'neutral' } ] },
      { label: '"How was the drive?"', tone: 'Curious',
        then: [
          { say: 'Long. Fine. Long.', who: 'daiki', expr: 'neutral' },
          { narrate: 'He rubs his eyes with the back of his wrist, the way you do when your hands are dirty, except his hands are clean.' } ] }
    ]},
    { say: 'He drives too much. I have said this.', who: 'etsuko', expr: 'stern' },
    { say: 'She has said this.', who: 'daiki', expr: 'warm' },
    { say: 'Give him the fast one. He won’t chew it anyway.', who: 'etsuko', expr: 'neutral' },
    { narrate: 'He has not eaten since a rice ball from a convenience store at seven this morning. He would not say so. His mother says so, from the other end of the counter, without turning round.' },
    { bench: true },
    { reactions: true },
    { say: 'Right. Yes. That’s — thank you.', who: 'daiki', expr: 'warm' },
    { narrate: 'He eats about a third of it before he says anything else, which for him is a long time.' },
    { say: 'She had the hospital on Thursday. Did she tell you she had the hospital on Thursday?', who: 'daiki', expr: 'neutral' },
    { say: 'I am standing here.', who: 'etsuko', expr: 'stern' },
    { say: 'You are. It’s one of my favourite things about you.', who: 'daiki', expr: 'warm' },
    { choose: [
      { label: '"How often is the hospital?"', tone: 'Curious',
        then: [
          { say: 'Twice a month at the moment. It’s in Kōriyama, so it’s fifty minutes there and fifty back, plus the waiting.', who: 'daiki', expr: 'neutral' },
          { say: 'The bus goes at 7:40 and then not again until half one, so it’s a whole day whichever way you cut it. I take the Thursday off when I can.', who: 'daiki', expr: 'worried' },
          { say: 'The clinic in town closed in 2019. There was one doctor and he was seventy-one.', who: 'daiki', expr: 'neutral' } ] },
      { label: '"That’s a lot to carry on your own."', tone: 'Empathetic', warm: 'daiki',
        then: [
          { say: 'It isn’t on my own, exactly. Your mother does the money and the forms from Sendai, which is genuinely half of it, and she’d come if she could get away.', who: 'daiki', expr: 'neutral' },
          { say: 'But the hospital is a body in a car. You can’t do a body in a car from Sendai.', who: 'daiki', expr: 'worried' },
          { say: 'So it’s me. It was always going to be me. I’m the one who came back.', who: 'daiki', expr: 'worried' } ] },
      { label: '"Is she a difficult patient?"', tone: 'Playful', warm: 'daiki',
        then: [
          { say: 'She told the cardiologist he looked tired.', who: 'daiki', expr: 'warm' },
          { say: 'He did look tired.', who: 'etsuko', expr: 'neutral' },
          { say: 'He looked tired because he is one of two cardiologists for four towns, Mum.', who: 'daiki', expr: 'warm' } ] }
    ]},
    { say: 'You came back from Osaka. I remember when you came back.', who: 'etsuko', expr: 'neutral' },
    { say: 'I did.', who: 'daiki', expr: 'neutral' },
    { choose: [
      { label: '"Why did you come back?"', tone: 'Curious',
        then: [
          { say: 'Because there wasn’t anybody else to.', who: 'daiki', expr: 'neutral' },
          { say: 'Look — it isn’t a tragedy. I had a good job and now I have an all right job. That’s the whole size of it.', who: 'daiki', expr: 'warm' },
          { say: 'But that’s the arithmetic, isn’t it. Two of us in my generation. One of me here. She’s seventy-four and Grandad’s gone and the neighbours are all older than she is.', who: 'daiki', expr: 'worried' },
          { say: 'When Grandma was my age there were five children in a family and four of them lived on this street. Somebody was always ten minutes away. Nobody is ten minutes away now.', who: 'daiki', expr: 'worried' } ] },
      { label: '"Do you miss Osaka?"', tone: 'Empathetic', warm: 'daiki',
        then: [
          { say: 'Every single day, and I’d make the same choice again, and both of those are true at once, which nobody warns you about.', who: 'daiki', expr: 'worried' },
          { say: 'I had a team of eleven people there. Here I drive.', who: 'daiki', expr: 'neutral' },
          { say: 'About a hundred thousand people a year in this country leave a job or change one to look after a parent. There’s a word for it. There’s a government leaflet about it. I’ve read the leaflet.', who: 'daiki', expr: 'worried' },
          { say: 'It is a very good leaflet. It does not drive to Kōriyama.', who: 'daiki', expr: 'neutral' } ] },
      { label: '"Osaka’s loss."', tone: 'Playful',
        then: [
          { say: 'Osaka has not noticed.', who: 'daiki', expr: 'warm' },
          { say: 'That’s the thing about cities. They’re where everyone under forty went, and they didn’t leave a gap. The gap is all back here.', who: 'daiki', expr: 'neutral' } ] }
    ]},
    { say: 'He is telling you the {{dependency|dependency ratio}} and pretending it is a story about a car.', who: 'etsuko', expr: 'stern' },
    { narrate: 'You both look at her.' },
    { say: 'I watch the news. I am old, not dead. They put it on a chart. So many of us, so many of you.', who: 'etsuko', expr: 'neutral' },
    { say: 'When I opened this shop there were eleven working people in this country for every two of my age. It is nearer two to one now, and I am the one.', who: 'etsuko', expr: 'stern' },
    { choose: [
      { label: '"Two working people for every one over 65 — nationally?"', tone: 'Curious',
        then: [
          { say: 'Near enough. They say it as a number out of a hundred. {{oldage|Fifty-odd of us for every hundred of you}}, and rising.', who: 'etsuko', expr: 'neutral' },
          { say: 'It sounds like nothing. It is a tax rate, a pension, and a man in a car on the expressway at Toyota.', who: 'etsuko', expr: 'stern' } ] },
      { label: '"That must be strange, being a chart."', tone: 'Empathetic',
        then: [
          { say: 'It is not strange. It is accurate.', who: 'etsuko', expr: 'stern' },
          { say: 'I would rather be a difficult old woman than a statistic, and I have arranged to be both.', who: 'etsuko', expr: 'warm' } ] },
      { label: '"You’ve been watching demography documentaries again."', tone: 'Playful', warm: 'etsuko',
        then: [
          { say: 'There is nothing else on at two in the afternoon.', who: 'etsuko', expr: 'warm' },
          { say: 'They are always filmed in a town like this one and they always find the emptiest street to stand in. They could film this street. I would tell them to move their van.', who: 'etsuko', expr: 'stern' } ] }
    ]},
    { confessions: true },
    { narrate: 'Daiki drinks the last of the broth holding the bowl in both hands, which his mother taught him and which he does without thinking about it.' },
    { say: 'Right. Thanks. I’ve got Sendai at six tomorrow.', who: 'daiki', expr: 'neutral' },
    { say: 'Take the eggs. There are eggs.', who: 'etsuko', expr: 'neutral' },
    { say: 'I don’t need—', who: 'daiki', expr: 'surprised' },
    { say: 'Take the eggs, Daiki.', who: 'etsuko', expr: 'stern' },
    { bonus: 'daiki' },
    { narrate: 'He takes the eggs.' }
  ],
  react: {
    daiki: {
      matched: [
        { say: 'Oh — oh, that’s a proper one.', who: 'daiki', expr: 'surprised' },
        { narrate: 'He stops with the spoon halfway and looks at the bowl like it has said something to him.' },
        { say: 'I didn’t know I was hungry. I genuinely did not know that.', who: 'daiki', expr: 'warm' } ],
      near: [
        { say: 'That’s good. Thank you. That’s good.', who: 'daiki', expr: 'warm' },
        { narrate: 'He eats it steadily, the way you eat when eating is a task on a list.' } ],
      mismatched: [
        { say: 'Ah — lovely. Thank you.', who: 'daiki', expr: 'neutral' },
        { narrate: 'He eats all of it and says nothing more about it. Your grandmother looks at the bowl, then at you, and does not comment, which is worse.' } ]
    }
  },
  confession: {
    daiki: [
      { narrate: 'He puts the spoon down. The phone stays face down.' },
      { say: 'Can I tell you something I haven’t said to your mother.', who: 'daiki', expr: 'worried' },
      { say: 'There is a version of the next ten years where I am here every Thursday and she gets worse slowly, and that is the good version. That’s the one I’m hoping for.', who: 'daiki', expr: 'worried' },
      { say: 'And some days on the expressway I catch myself doing the sums on the bad version instead, and how long I could keep the job, and I hate myself for about forty kilometres.', who: 'daiki', expr: 'worried' },
      { say: 'She’d have done it for her mother without blinking. She did, actually. Nobody wrote a leaflet about it then, they just called it being a daughter.', who: 'daiki', expr: 'neutral' },
      { say: 'Don’t tell her I said any of that. She’d be insulted on behalf of both of us.', who: 'daiki', expr: 'warm' } ]
  },
  bonus: {
    daiki: [
      { narrate: 'At the curtain he stops, holding the eggs.' },
      { say: 'Oi. Summer kid.', who: 'daiki', expr: 'warm' },
      { say: 'It’s better with you here. Not the shop. Her.', who: 'daiki', expr: 'warm' } ]
  }},

  /* =====================================================================
     2 — KENJI and MARY.
     Teaches: rural depopulation, the silver economy where nobody is left to
     sell to, and migrant care work as the human form of a policy response.
     ===================================================================== */
  kenji_mary: { script: [
    { narrate: 'The curtain goes up slowly, held for somebody. An old man comes in at the pace of a man who has decided how fast he is going, followed by a woman with an umbrella she did not need and a bag over her shoulder.' },
    { say: 'Etsuko! You’ve changed the curtain.', who: 'kenji', expr: 'warm' },
    { say: 'In 2011.', who: 'etsuko', expr: 'neutral' },
    { say: 'Well. It’s very good.', who: 'kenji', expr: 'warm' },
    { narrate: 'He takes the middle stool, which takes a moment, and the woman does not help him do it and does not look away either. When he is down she sits beside him and puts the bag where he can’t trip on it.' },
    { say: 'Good evening. Sorry, we’re a bit slow tonight, the hill was warm.', who: 'mary', expr: 'warm' },
    { say: 'The hill was not warm. She walks fast because she is thirty-four.', who: 'kenji', expr: 'stern' },
    { say: 'I am thirty-four,', who: 'mary', expr: 'warm' },
    { say: 'and I walk fast because you walk fast when I’m not looking.', who: 'mary', expr: 'warm' },
    { choose: [
      { label: '"Have you two been coming here long?"', tone: 'Curious', warm: 'kenji',
        then: [
          { say: 'I have been coming here since this one’s mother-in-law ran it. Two owners. Same stool.', who: 'kenji', expr: 'warm' },
          { say: 'Mary has been coming here two years, four months, and she likes it better than I do, which is a scandal.', who: 'kenji', expr: 'warm' } ] },
      { label: '"You look like you’ve had a day."', tone: 'Empathetic', warm: 'mary',
        then: [
          { say: 'A bit. It’s bath day and it’s bin day and they should never be the same day.', who: 'mary', expr: 'warm' },
          { say: 'She is very funny about the bins. There is a schedule with colours.', who: 'kenji', expr: 'warm' } ] },
      { label: '"Is he always this much trouble?"', tone: 'Playful', warm: 'mary',
        then: [
          { say: 'Yes.', who: 'mary', expr: 'warm' },
          { say: 'I heard that.', who: 'kenji', expr: 'stern' },
          { say: 'You were meant to.', who: 'mary', expr: 'warm' } ] }
    ]},
    { say: 'The plainest thing you have, for me. I have had the same bowl since 1968 and I see no reason to review it now.', who: 'kenji', expr: 'neutral' },
    { say: 'And I’ll have the rich one. The white broth. With the corn.', who: 'mary', expr: 'warm' },
    { say: 'She eats it like a northerner and she is from Cebu.', who: 'kenji', expr: 'warm' },
    { say: 'I am from Cebu and I eat it like a person who is cold nine months of the year.', who: 'mary', expr: 'warm' },
    { bench: true },
    { reactions: true },
    { narrate: 'For a while there is only the sound of two people eating and the fan over the range.' },
    { say: 'Etsuko. Did you hear about Nakano’s.', who: 'kenji', expr: 'worried' },
    { say: 'I heard.', who: 'etsuko', expr: 'neutral' },
    { say: 'Fifty-one years. He didn’t even put a notice up until the Friday.', who: 'kenji', expr: 'worried' },
    { choose: [
      { label: '"Nakano’s — the fishmonger across the road?"', tone: 'Curious', warm: 'kenji',
        then: [
          { say: 'The shutter you can see from that window. Fish on the left, ice at the back, and his father before him.', who: 'kenji', expr: 'worried' },
          { say: 'He didn’t go bankrupt, mind. That’s the part people get wrong. He ran out of customers and he ran out of a son.', who: 'kenji', expr: 'worried' },
          { say: 'The son is in Yokohama in insurance and he is doing very well and why on earth would he come back to gut fish in a town with a closed school.', who: 'kenji', expr: 'neutral' } ] },
      { label: '"That must be hard to watch, one at a time."', tone: 'Empathetic', warm: 'kenji',
        then: [
          { say: 'It is like counting. That is what nobody tells you about getting old in a small place.', who: 'kenji', expr: 'worried' },
          { say: 'When I opened my shop there were eleven businesses on this street. Now there is this, and the vending machine, and the post office three days a week.', who: 'kenji', expr: 'worried' },
          { say: 'The bus went from nine a day to two. The school shut in 2016 — eleven children, they bus them to Kawaguchi now. And every one of those is somebody deciding it isn’t worth it any more, and each one makes the next one easier to decide.', who: 'kenji', expr: 'worried' } ] },
      { label: '"Ran out of customers, or ran out of people?"', tone: 'Curious', warm: 'kenji',
        then: [
          { say: 'Ha! Now you sound like the man from the prefecture.', who: 'kenji', expr: 'warm' },
          { say: 'People. There is no shortage of appetite in this town. There is a shortage of {{depop|town}}.', who: 'kenji', expr: 'worried' },
          { say: 'Four thousand of us when I married. Under fifteen hundred now, and half of those are over sixty-five. Say that to a man who wants to sell fish.', who: 'kenji', expr: 'worried' } ] }
    ]},
    { say: 'They keep saying we are a growth market. Have you heard this one? Old people are a growth market.', who: 'kenji', expr: 'stern' },
    { choose: [
      { label: '"That’s the — what, the ‘silver economy’?"', tone: 'Curious',
        then: [
          { say: 'That is what they call it. {{silver|The silver economy}}. Handrails, hearing aids, the soft food, the little scooters.', who: 'kenji', expr: 'neutral' },
          { say: 'And it is real! Somebody is making a fortune out of my knees. But look out of that window and tell me where the shop is.', who: 'kenji', expr: 'stern' },
          { say: 'It’s all in Kōriyama and Sendai, where there are enough old people in one place to be worth the rent. Out here we are the market and there is nobody to sell to us.', who: 'kenji', expr: 'worried' } ] },
      { label: '"Growth market. There’s a sales pitch."', tone: 'Playful', warm: 'mary',
        then: [
          { say: 'The catalogue comes to the house. It is enormous. It is all beige.', who: 'mary', expr: 'warm' },
          { say: 'Everything in it is beige and everything in it costs four times what it should because they know exactly who is buying.', who: 'kenji', expr: 'stern' } ] },
      { label: '"Somebody’s making money off it, at least."', tone: 'Empathetic',
        then: [
          { say: 'Somebody always is. It is not the town.', who: 'kenji', expr: 'stern' } ] }
    ]},
    { narrate: 'Mary has been quiet through this, working steadily down her bowl. She catches you looking.' },
    { choose: [
      { label: '"How did you end up here, Mary?"', tone: 'Curious', warm: 'mary',
        then: [
          { say: 'The nursing route. There is a visa for it — for {{migrant|care work specifically}}. I did two years of Japanese and an exam I still have dreams about.', who: 'mary', expr: 'warm' },
          { say: 'I trained in Cebu, worked four years in Manila. My mother is a nurse. My sister is a nurse in Riyadh. It is what my family does.', who: 'mary', expr: 'warm' },
          { say: 'This country needs about half a million more care workers than it has, and it is not going to find them among Japanese twenty-year-olds, because there aren’t enough Japanese twenty-year-olds.', who: 'mary', expr: 'neutral' } ] },
      { label: '"Is it strange, being so far from home?"', tone: 'Empathetic', warm: 'mary',
        then: [
          { say: 'Some days. Video calls at six in the morning because of the hours. My son is nine. My mother has him.', who: 'mary', expr: 'worried' },
          { say: 'But I like this work and I am good at it and it pays for his school, so — yes and yes, both.', who: 'mary', expr: 'warm' },
          { say: 'And this one is easy. He talks the whole time so I always know he is breathing.', who: 'mary', expr: 'warm' } ] },
      { label: '"Does he ever actually let you finish a sentence?"', tone: 'Playful', warm: 'mary',
        then: [
          { say: 'Once. In March.', who: 'mary', expr: 'warm' },
          { say: 'It was a very good sentence,', who: 'kenji', expr: 'warm' },
          { say: 'and I have thought about it often since.', who: 'kenji', expr: 'warm' } ] }
    ]},
    { say: 'His daughter arranged it. Through the agency. She rang thirty places.', who: 'mary', expr: 'neutral' },
    { say: 'She did. She is very organised. She gets that from her mother.', who: 'kenji', expr: 'warm' },
    { narrate: 'His phone goes off in his shirt pocket at a volume set for somebody who cannot hear it. He gets it out with two hands.' },
    { say: 'Ah — that’s her. That’s Sachiko.', who: 'kenji', expr: 'warm' },
    { narrate: 'He answers it at the counter, because it does not occur to him that a phone is private.' },
    { narrate: 'A voice, thin through the speaker: "Dad? Sorry, I’ve only got a minute, I’m still at the office—"' },
    { say: 'I’m at Etsuko’s! I’m having the salt one!', who: 'kenji', expr: 'warm' },
    { narrate: '"—good, good. Listen, about this month. I’ve got the audit and then Hiroto’s exams, so I don’t think I can get up until — it might be October, Dad. Is Mary there? Is she there now?"' },
    { say: 'She is here. She is eating corn.', who: 'kenji', expr: 'warm' },
    { narrate: '"Good. Good. That’s — okay. I’ll call Sunday. I will actually call Sunday."' },
    { say: 'Sunday. Yes. Work hard.', who: 'kenji', expr: 'warm' },
    { narrate: 'He puts the phone down on the counter, face up, and looks at it for a moment longer than the call lasted.' },
    { say: 'Tokyo,', who: 'kenji', expr: 'neutral' },
    { say: 'is four hours if the train is kind.', who: 'kenji', expr: 'neutral' },
    { confessions: true },
    { say: 'Right. Bath day. Up you get before you stiffen.', who: 'mary', expr: 'warm' },
    { say: 'I do not stiffen.', who: 'kenji', expr: 'stern' },
    { say: 'You stiffen.', who: 'mary', expr: 'warm' },
    { bonus: 'kenji' },
    { bonus: 'mary' },
    { narrate: 'She gets the bag before he reaches for it, and gets it in a way that looks like she happened to be standing up anyway.' }
  ],
  react: {
    kenji: {
      matched: [
        { narrate: 'He looks into it before he touches it. You can see the bottom of the bowl through the broth.' },
        { say: 'Ha! Yes. That is the one.', who: 'kenji', expr: 'warm' },
        { say: 'Nobody makes this any more. Everybody wants it thick enough to stand a chopstick in. This is what it tasted like when it was new.', who: 'kenji', expr: 'warm' } ],
      near: [
        { say: 'That’s a good bowl. Thank you.', who: 'kenji', expr: 'warm' },
        { narrate: 'He eats it happily enough, though he stirs it twice, as if checking for something that isn’t in there.' } ],
      mismatched: [
        { say: 'Oh — that’s very generous.', who: 'kenji', expr: 'surprised' },
        { narrate: 'He eats around the top of it and drinks about half the broth, and is far too polite to say a word.' } ]
    },
    mary: {
      matched: [
        { say: 'Yes! Yes. That is exactly it.', who: 'mary', expr: 'warm' },
        { say: 'The first winter here I could not get warm. Somebody put this in front of me and I understood the entire country in about four minutes.', who: 'mary', expr: 'warm' } ],
      near: [
        { say: 'That’s lovely, thank you.', who: 'mary', expr: 'warm' },
        { narrate: 'She finishes all of it and stacks her bowl neatly inside Kenji’s, which nobody asked her to do.' } ],
      mismatched: [
        { say: 'Ah — thank you.', who: 'mary', expr: 'neutral' },
        { narrate: 'She eats it without complaint. Halfway down she quietly reaches for the pepper.' } ]
    }
  },
  confession: {
    kenji: [
      { narrate: 'He turns the phone face down. It takes him two goes.' },
      { say: 'She is a good daughter. I want that said first.', who: 'kenji', expr: 'worried' },
      { say: 'She rang thirty agencies for me. She pays the part the insurance doesn’t. She has a job and a boy doing exams and a husband who works later than she does.', who: 'kenji', expr: 'worried' },
      { say: 'And I have not eaten a meal with my daughter since New Year.', who: 'kenji', expr: 'worried' },
      { say: 'Mary is here five days a week and she is kind and she is good at it and she is not my daughter, and both of those are true, and I would not say the second one in front of her for anything in the world.', who: 'kenji', expr: 'worried' },
      { say: 'That is what all this costs. Not money. The money is fine.', who: 'kenji', expr: 'neutral' } ],
    mary: [
      { narrate: 'Kenji has turned to say something to Etsuko about the curtain again. Mary leans in a little.' },
      { say: 'Can I say something you should not repeat.', who: 'mary', expr: 'neutral' },
      { say: 'I know what I am here for. I am a policy. Somebody in Tokyo worked out the numbers, and the numbers said: not enough young people, too many old people, open a door.', who: 'mary', expr: 'neutral' },
      { say: 'And it is a narrow door. Ten years on this route and I am still not sure what I am — the visa says one thing and the neighbours say another.', who: 'mary', expr: 'worried' },
      { say: 'But he taught me to ride a bicycle again after my accident. He shouted at me the whole way down the hill.', who: 'mary', expr: 'warm' },
      { say: 'You cannot put that on a form. So they will keep arguing about the forms.', who: 'mary', expr: 'warm' } ]
  },
  bonus: {
    kenji: [
      { say: 'You listen properly. That is not nothing.', who: 'kenji', expr: 'warm' },
      { say: 'Most people my age get talked past. You get talked past for about ten years and then you stop starting.', who: 'kenji', expr: 'warm' } ],
    mary: [
      { say: 'Hey. Next time I will teach you to say something rude in Cebuano.', who: 'mary', expr: 'warm' },
      { say: 'He already knows four. He uses them on the bins.', who: 'mary', expr: 'warm' } ]
  }},

  /* =====================================================================
     3 — AIKO and REN.
     Teaches: falling fertility, and why money has not moved it.
     The couple are not fighting. They have had this conversation so many
     times that it has worn smooth, which is worse and more accurate.
     ===================================================================== */
  aiko_ren: { script: [
    { narrate: 'Two people about the age of your mother come in mid-conversation and stop having it the moment the curtain drops behind them.' },
    { say: '—no, I’m just saying we could have gone at the weekend instead.', who: 'ren', expr: 'neutral' },
    { say: 'And I’m saying I’m hungry now.', who: 'aiko', expr: 'stern' },
    { narrate: 'They sit. She puts her phone screen-down without looking at it. He reads the whole wall menu, every time, even though he already knows.' },
    { say: 'Miso for me. Nothing on it. Actually — negi, that’s it.', who: 'aiko', expr: 'neutral' },
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
          { say: 'It was a normal day. It was a completely normal day and I am this tired at the end of it, which is the part that gets me.', who: 'aiko', expr: 'worried' },
          { narrate: 'She catches herself, and rearranges her chopsticks so they are square with the edge of the counter.' },
          { say: 'Sorry. Yes. Rough day.', who: 'aiko', expr: 'neutral' } ] },
      { label: '"Are you two from the new block?"', tone: 'Curious', warm: 'aiko',
        then: [
          { say: 'Two years now. We came from Sendai — his job, my job’s remote three days.', who: 'aiko', expr: 'neutral' },
          { say: 'The rent here is a third of what we paid there. A third. For twice the space.', who: 'aiko', expr: 'warm' },
          { say: 'Because nobody wants to live here,', who: 'aiko', expr: 'neutral' },
          { say: 'which is either a bargain or a warning, and we are still finding out which.', who: 'aiko', expr: 'neutral' } ] }
    ]},
    { bench: true },
    { reactions: true },
    { narrate: 'Ren gets his phone out to photograph his bowl, thinks better of it, and then does it anyway.' },
    { say: 'Oh — did you see the town thing? The banner by the station.', who: 'ren', expr: 'warm' },
    { say: 'I saw it.', who: 'aiko', expr: 'stern' },
    { say: 'They’ve put the settlement grant up again. Six hundred thousand a child now, I think, plus the moving money.', who: 'ren', expr: 'warm' },
    { choose: [
      { label: '"Six hundred thousand yen — for having a baby here?"', tone: 'Curious', warm: 'aiko',
        then: [
          { say: 'For having one and staying. There’s a grant for moving here, a grant per child, free medical until junior high, and the daycare fee waiver.', who: 'aiko', expr: 'neutral' },
          { say: 'It is about four thousand dollars. It sounds enormous until you price a year of childcare and then price the eighteen years after that.', who: 'aiko', expr: 'stern' },
          { say: 'They’ve been doing versions of this since the nineties. {{pronatal|Every prefecture has a scheme}}. The national rate has gone one direction the entire time.', who: 'aiko', expr: 'neutral' } ] },
      { label: '"Does that kind of thing work?"', tone: 'Curious', warm: 'aiko',
        then: [
          { say: 'It moves people around. A town with a good grant takes a family off the town next door. That’s not new babies, that’s a transfer.', who: 'aiko', expr: 'neutral' },
          { say: 'The national number is {{tfr|about 1.2}}. You need {{replacement|2.1}} to stand still. There is no cheque in that gap.', who: 'aiko', expr: 'stern' } ] },
      { label: '"You sound like you’ve looked into it."', tone: 'Empathetic',
        then: [
          { say: 'I have a spreadsheet.', who: 'aiko', expr: 'neutral' },
          { say: 'She has a spreadsheet.', who: 'ren', expr: 'warm' },
          { say: 'I have a spreadsheet because it is the only way to have this conversation without it being about feelings for four hours.', who: 'aiko', expr: 'stern' } ] }
    ]},
    { say: 'It’s not nothing, though. It’s a year of nursery, near enough.', who: 'ren', expr: 'warm' },
    { say: 'It’s a year. And then it’s me.', who: 'aiko', expr: 'stern' },
    { narrate: 'It is not said sharply. It is said the way you say a thing you have said before.' },
    { choose: [
      { label: '"Why you?"', tone: 'Curious', warm: 'aiko',
        then: [
          { say: 'Because that’s how it goes. Not in this house — he’d do it, he genuinely would.', who: 'aiko', expr: 'neutral' },
          { say: 'I would.', who: 'ren', expr: 'warm' },
          { say: 'But my team lead had a baby in March and she is back and she is finished. She’s the one doing pickup at six, so she’s the one who doesn’t travel, so she’s the one who didn’t get the Osaka account.', who: 'aiko', expr: 'worried' },
          { say: 'Nobody was cruel to her. There was no meeting where they decided. It just happened to her, in order, over eight months.', who: 'aiko', expr: 'worried' },
          { say: 'I am thirty-three and I have spent nine years getting where I am. That is what the six hundred thousand is bidding against, and it does not know that.', who: 'aiko', expr: 'stern' } ] },
      { label: '"That sounds like a lot to be holding."', tone: 'Empathetic',
        then: [
          { say: 'It’s fine.', who: 'aiko', expr: 'stern' },
          { narrate: 'She eats two mouthfuls. Ren says nothing, which appears to be a technique.' },
          { say: '—It is not fine. It is a normal amount of not fine that everyone I know is carrying, which is somehow worse than it being unusual.', who: 'aiko', expr: 'worried' } ] },
      { label: '"Ren, what do you think?"', tone: 'Curious', warm: 'ren',
        then: [
          { say: 'Honestly? I want one. I’ve always wanted one.', who: 'ren', expr: 'warm' },
          { say: 'But I’m not the one whose life goes sideways, so my wanting it is cheap, and I know that, and I try not to spend it.', who: 'ren', expr: 'worried' },
          { say: 'He is the only man I have ever met who says that out loud.', who: 'aiko', expr: 'warm' },
          { say: 'I got very good at it in therapy,', who: 'ren', expr: 'warm' },
          { say: 'which you also paid for.', who: 'ren', expr: 'warm' } ] }
    ]},
    { say: 'My mother had three by thirty-one.', who: 'aiko', expr: 'neutral' },
    { choose: [
      { label: '"What was different for her?"', tone: 'Curious', warm: 'aiko',
        then: [
          { say: 'Everything and nothing. She married at twenty-three because that was when you did. She stopped working because that was what happened.', who: 'aiko', expr: 'neutral' },
          { say: 'Her mother lived four minutes away and did the afternoons. My mother is in Sendai and works part-time at sixty-two because her pension isn’t what she was told it would be.', who: 'aiko', expr: 'worried' },
          { say: 'So: later marriage, later first child, no grandmother, and rent. It isn’t that we stopped wanting them. Everything got about four years later and four years later compounds.', who: 'aiko', expr: 'neutral' } ] },
      { label: '"Does she ask about it?"', tone: 'Empathetic',
        then: [
          { say: 'She has stopped asking, which is the loudest thing she has ever done.', who: 'aiko', expr: 'worried' } ] },
      { label: '"Three! Where did she keep them all?"', tone: 'Playful', warm: 'ren',
        then: [
          { say: 'A two-room house with her mother-in-law in it. She has told me. Repeatedly. In detail.', who: 'aiko', expr: 'warm' },
          { say: 'The detail is the point of the story, I think,', who: 'ren', expr: 'warm' } ] }
    ]},
    { say: 'The bit that gets me is the school.', who: 'ren', expr: 'worried' },
    { say: 'The one here shut before we came. So it’s the bus to Kawaguchi, thirty-five minutes, from six years old.', who: 'ren', expr: 'worried' },
    { say: 'And that is a reason not to, isn’t it. And it’s a reason because nobody had children, and it’s a reason nobody will.', who: 'ren', expr: 'worried' },
    { say: 'That’s the whole thing in one bus.', who: 'aiko', expr: 'neutral' },
    { confessions: true },
    { narrate: 'She finishes first and waits, which she does not do for anybody at work.' },
    { say: 'Right. Sorry. That got heavy — it’s a ramen shop.', who: 'aiko', expr: 'neutral' },
    { say: 'Everything gets said in here. It is the steam.', who: 'etsuko', expr: 'neutral' },
    { bonus: 'aiko' },
    { bonus: 'ren' }
  ],
  react: {
    aiko: {
      matched: [
        { narrate: 'She eats the first mouthful standing the way people do when they have decided to be somewhere else in a minute, and then she sits back down properly.' },
        { say: 'Oh, that’s good. That’s clean. Thank you.', who: 'aiko', expr: 'warm' },
        { say: 'I’ve had a day where everything had eleven things in it. This has four.', who: 'aiko', expr: 'warm' } ],
      near: [ { say: 'That’s good, thanks.', who: 'aiko', expr: 'neutral' } ],
      mismatched: [
        { say: 'Ah — thank you.', who: 'aiko', expr: 'surprised' },
        { narrate: 'She moves two of the toppings to the side of the bowl in a neat little pile and does not eat them.' } ]
    },
    ren: {
      matched: [
        { say: 'Oh, that’s obscene. Look at it. Look at the butter.', who: 'ren', expr: 'warm' },
        { say: 'It is eight in the evening and this is a dessert.', who: 'aiko', expr: 'neutral' },
        { say: 'It’s an emotional support bowl,', who: 'ren', expr: 'warm' } ],
      near: [ { say: 'Lovely, thank you. Really.', who: 'ren', expr: 'warm' } ],
      mismatched: [
        { say: 'Ah — nice. Very restrained.', who: 'ren', expr: 'neutral' },
        { say: 'He wanted it to be a birthday cake.', who: 'aiko', expr: 'warm' } ]
    }
  },
  confession: {
    aiko: [
      { narrate: 'Ren has gone to look at the old photograph on the back wall, which he does not need to do.' },
      { say: 'He does that when he thinks I want a minute. It’s infuriating and it works.', who: 'aiko', expr: 'warm' },
      { say: 'Here is the thing I don’t say. I’m not undecided.', who: 'aiko', expr: 'worried' },
      { say: 'I want one. I have wanted one since I was twenty-six. I’m not the career woman in the article who chose otherwise — I have just been doing arithmetic for seven years and the arithmetic keeps saying: not this year.', who: 'aiko', expr: 'worried' },
      { say: 'And I am thirty-three, and there is a number of years left in that sentence, and I know exactly what it is.', who: 'aiko', expr: 'worried' },
      { say: 'So when the town puts a banner up offering me six hundred thousand yen — I’m not insulted that it’s small. I’m insulted that they think the problem is that I didn’t want to.', who: 'aiko', expr: 'stern' } ],
    ren: [
      { narrate: 'Aiko has stepped out to take a call she apologised for twice.' },
      { say: 'She’ll have told you it’s the money and the job. That’s true.', who: 'ren', expr: 'neutral' },
      { say: 'The bit she won’t have said: her mother rang in June to say she’s having tests, and Aiko booked the train before she put the phone down.', who: 'ren', expr: 'worried' },
      { say: 'So that’s Sendai every other weekend, probably, for however long that is.', who: 'ren', expr: 'worried' },
      { say: 'Everybody talks about this like it’s one thing at a time — you have the babies, then thirty years later you look after your parents.', who: 'ren', expr: 'worried' },
      { say: 'For us it’d be the same five years. Same money, same weekends, same person.', who: 'ren', expr: 'worried' },
      { say: 'I don’t think anybody who writes these schemes has done that sum. I think they did the baby one and stopped.', who: 'ren', expr: 'neutral' } ]
  },
  bonus: {
    aiko: [
      { say: 'This was better than being at home. Don’t tell him I said that either.', who: 'aiko', expr: 'warm' } ],
    ren: [
      { say: 'We’ll come back. She won’t say so but she’ll come back on Thursday and pretend it was my idea.', who: 'ren', expr: 'warm' } ]
  }},

  /* =====================================================================
     4 — TANAKA and YUI.
     Teaches: political consequences. Two people who love each other and
     want different buildings.
     ===================================================================== */
  tanaka_yui: { script: [
    { narrate: 'The last two of the night. He comes in like a man arriving at a place he has a relationship with; she comes in behind him carrying a folder she has clearly been carrying all day.' },
    { say: 'Etsuko-san. Still here.', who: 'tanaka', expr: 'warm' },
    { say: 'Still here.', who: 'etsuko', expr: 'neutral' },
    { say: 'This is my daughter. She is up from Sendai. She is telling me I am wrong about several things.', who: 'tanaka', expr: 'warm' },
    { say: 'Two things. I’ve been extremely restrained.', who: 'yui', expr: 'warm' },
    { say: 'Tonkotsu. Properly. Nothing modern on it.', who: 'tanaka', expr: 'neutral' },
    { say: 'Same, but make mine sharp. And I’ll want a {{kaedama|kaedama}} after.', who: 'yui', expr: 'warm' },
    { say: 'She orders a refill before she has had the first one.', who: 'tanaka', expr: 'stern' },
    { say: 'That’s how it’s done in Fukuoka, Dad. You told me that.', who: 'yui', expr: 'warm' },
    { say: 'I told you that in 1994 and you have used it against me ever since.', who: 'tanaka', expr: 'warm' },
    { bench: true },
    { reactions: true },
    { narrate: 'The folder sits on the counter between them, closed, which is somehow more present than if it were open.' },
    { choose: [
      { label: '"What’s in the folder?"', tone: 'Curious', warm: 'tanaka',
        then: [
          { say: 'Ah — well. That is Tuesday’s meeting.', who: 'tanaka', expr: 'neutral' },
          { say: 'The town has one building budget left this cycle and two things it could be.', who: 'yui', expr: 'neutral' },
          { say: 'The community health and senior centre — a proper one, with the day service and the rehabilitation room. Or the childcare centre, extended hours, so people can work in Kōriyama and still have a child here.', who: 'tanaka', expr: 'neutral' },
          { say: 'One building. One.', who: 'yui', expr: 'stern' } ] },
      { label: '"Councilman — you were on the council?"', tone: 'Curious', warm: 'tanaka',
        then: [
          { say: 'Twenty-six years. Retired in 2019 and they still send me the papers, which I think is a kindness and my daughter thinks is a problem.', who: 'tanaka', expr: 'warm' },
          { say: 'It’s not a problem. It’s that you still get a vote at the meeting and the meeting is Tuesday.', who: 'yui', expr: 'neutral' } ] },
      { label: '"You two have been arguing all the way here, haven’t you."', tone: 'Playful',
        then: [
          { say: 'From the station.', who: 'yui', expr: 'warm' },
          { say: 'It is not arguing. It is that she is wrong at length.', who: 'tanaka', expr: 'stern' },
          { say: 'There’s a folder. There’s a meeting Tuesday. One building, two things it could be.', who: 'yui', expr: 'neutral' } ] }
    ]},
    { say: 'And I will tell you exactly how Tuesday goes, because I have sat in that room for twenty-six years.', who: 'tanaka', expr: 'neutral' },
    { say: 'The senior centre goes through. Eleven to four, maybe twelve to three.', who: 'tanaka', expr: 'neutral' },
    { choose: [
      { label: '"How can you know that already?"', tone: 'Curious', warm: 'tanaka',
        then: [
          { say: 'Because I know who is in the room, and I know who was in the room at the election.', who: 'tanaka', expr: 'neutral' },
          { say: 'In this town, of the people over sixty-five, near enough four in five vote. Every time. Rain, snow, by-election, doesn’t matter.', who: 'tanaka', expr: 'neutral' },
          { say: 'Of the people in their twenties — a third. On a good day.', who: 'tanaka', expr: 'stern' },
          { say: 'Now. I have never in twenty-six years heard a councillor say "let us ignore the young people". Not once. Not one man.', who: 'tanaka', expr: 'neutral' },
          { say: 'But every one of them can count, and {{turnout|counting is the whole job}}.', who: 'tanaka', expr: 'neutral' } ] },
      { label: '"Is that what you want to happen?"', tone: 'Curious', warm: 'tanaka',
        then: [
          { say: 'I want the senior centre. I am not going to pretend otherwise.', who: 'tanaka', expr: 'stern' },
          { say: 'Sixty per cent of this town is over sixty. The nearest rehabilitation room is fifty minutes by a bus that runs twice.', who: 'tanaka', expr: 'stern' },
          { say: 'People are falling over in their houses, alone, and lying there. That is not a lobby. That is Wednesday.', who: 'tanaka', expr: 'worried' } ] },
      { label: '"And the daycare doesn’t?"', tone: 'Curious', warm: 'yui',
        then: [
          { say: 'It gets a discussion. It has had a discussion for six years.', who: 'yui', expr: 'stern' },
          { say: 'It gets a discussion because the people it is for are twenty-nine and busy and mostly not here yet, and they don’t vote, and half of them can’t — they haven’t moved in, because there’s no daycare.', who: 'yui', expr: 'stern' } ] }
    ]},
    { narrate: 'Yui opens the folder about two centimetres and shuts it again.' },
    { say: 'Dad. Tell them the other bit. The bit you told me on the train.', who: 'yui', expr: 'neutral' },
    { narrate: 'He takes his time with a mouthful he does not need.' },
    { say: 'The pension and the medical bill is about a third of the national budget now. Rather more, depending who is counting.', who: 'tanaka', expr: 'neutral' },
    { say: 'And it is paid by people working today. It was set up when there were many of them and few of us.', who: 'tanaka', expr: 'neutral' },
    { say: 'And no one — no party, no one — will touch it, because {{silverdem|we are the ones who show up}}.', who: 'tanaka', expr: 'worried' },
    { choose: [
      { label: '"So what would you actually do about it?"', tone: 'Curious', warm: 'yui',
        then: [
          { say: 'Split it. Same building.', who: 'yui', expr: 'neutral' },
          { say: 'Day service one wing, childcare the other, one kitchen, one car park, one heating bill. They’ve done it in Toyama and the old people like it because there are children in the building.', who: 'yui', expr: 'warm' },
          { say: 'It’s cheaper than either done separately and it is somehow the hardest thing in the world to get voted for, because it isn’t what either side asked for.', who: 'yui', expr: 'stern' },
          { say: '...It is not a stupid idea.', who: 'tanaka', expr: 'neutral' },
          { say: 'High praise. I’ll take it to the meeting.', who: 'yui', expr: 'warm' } ] },
      { label: '"That’s a hard thing to say out loud."', tone: 'Empathetic', warm: 'yui',
        then: [
          { say: 'He’s said it precisely twice. Both times not in a meeting.', who: 'yui', expr: 'neutral' },
          { say: 'Because in a meeting it is not a thought, it is a resignation letter.', who: 'tanaka', expr: 'stern' } ] },
      { label: '"So the young people should just vote."', tone: 'Playful', warm: 'yui',
        then: [
          { say: 'Yes! Yes, they should, and I say that at every family dinner and it changes nothing.', who: 'yui', expr: 'stern' },
          { say: 'Because there are also just fewer of them, and that part is not a lecture — that’s the birth rate arriving at a ballot box twenty years late.', who: 'yui', expr: 'neutral' },
          { say: 'You cannot out-vote demographics. You can only build the thing before it’s too late to matter.', who: 'yui', expr: 'worried' } ] }
    ]},
    { narrate: 'You put the kaedama in front of Yui. She drops the noodles into what is left of her father’s broth as well, without asking, and he lets her.' },
    { confessions: true },
    { say: 'Tuesday, then.', who: 'yui', expr: 'neutral' },
    { say: 'Tuesday.', who: 'tanaka', expr: 'neutral' },
    { say: 'I make no promises. I am a very stubborn man and I have a reputation to consider.', who: 'tanaka', expr: 'warm' },
    { bonus: 'tanaka' },
    { bonus: 'yui' }
  ],
  react: {
    tanaka: {
      matched: [
        { narrate: 'He does not say anything for a moment. He turns the bowl about ten degrees, the way you square up something that matters.' },
        { say: 'Now that. That is how it was in Hakata in 1971 when I was twenty-two and had no money and no sense.', who: 'tanaka', expr: 'warm' },
        { say: 'Dad’s doing the face.', who: 'yui', expr: 'warm' },
        { say: 'I am not doing a face.', who: 'tanaka', expr: 'stern' } ],
      near: [ { say: 'Good. Yes. That’s good work.', who: 'tanaka', expr: 'warm' } ],
      mismatched: [
        { say: 'Hm.', who: 'tanaka', expr: 'stern' },
        { narrate: 'He eats all of it, correctly, at a steady pace, and says nothing whatsoever about it, which from him is a review.' } ]
    },
    yui: {
      matched: [
        { say: 'Oh, that’s the one. That’s exactly the one.', who: 'yui', expr: 'warm' },
        { say: 'I have eaten a lot of bad tonkotsu in Sendai out of homesickness. This is what I was homesick for.', who: 'yui', expr: 'warm' } ],
      near: [ { say: 'That’s really good, thank you.', who: 'yui', expr: 'warm' } ],
      mismatched: [
        { say: 'Thanks. Yeah, that’s — thanks.', who: 'yui', expr: 'neutral' },
        { narrate: 'She eats it quickly, mostly to have eaten it, and puts more pepper on than the bowl deserves.' } ]
    }
  },
  confession: {
    tanaka: [
      { narrate: 'Yui has gone outside to take a call. He watches the curtain swing.' },
      { say: 'I will tell you the thing I have not said to her.', who: 'tanaka', expr: 'worried' },
      { say: 'She is right. About the building, and about the rest of it.', who: 'tanaka', expr: 'worried' },
      { say: 'I sat in that room for twenty-six years and I voted for people my own age every single time, and I told myself each time it was the urgent one. And each time it was! That is the trick of it. Every single one was urgent.', who: 'tanaka', expr: 'worried' },
      { say: 'And now the school is shut and the young ones are in Sendai and the town I was protecting is fourteen hundred people with a median age of sixty-one.', who: 'tanaka', expr: 'worried' },
      { say: 'I did not vote it away in one meeting. I did it in two hundred meetings, being reasonable each time.', who: 'tanaka', expr: 'worried' },
      { say: 'So on Tuesday I am going to vote for her building. And I am going to complain about it the whole way there, because I am seventy-six and I am owed that much.', who: 'tanaka', expr: 'stern' } ],
    yui: [
      { narrate: 'Her father has turned to argue with Etsuko about a road that was resurfaced in 2006.' },
      { say: 'Can I be honest? I don’t actually think he’s the problem.', who: 'yui', expr: 'neutral' },
      { say: 'Everyone my age talks about the old people like it’s a robbery. And then I sit in a room like Tuesday’s and it’s twelve people who all know each other trying to keep a town alive with one building.', who: 'yui', expr: 'worried' },
      { say: 'Nobody in that room is greedy. They are just the ones who came.', who: 'yui', expr: 'neutral' },
      { say: 'I do urban planning. Do you know how many towns in this country are on the list to stop functioning by 2040? About four in ten.', who: 'yui', expr: 'worried' },
      { say: 'So I fly at my dad about a daycare, and what I actually mean is: I don’t want to come back in fifteen years and find you in a house on an empty street with nobody left to notice.', who: 'yui', expr: 'worried' },
      { say: 'I can say that about a building. I can’t say it about him.', who: 'yui', expr: 'worried' } ]
  },
  bonus: {
    tanaka: [
      { say: 'You asked me what I thought. People do not, at my age. They tell me what I think.', who: 'tanaka', expr: 'warm' } ],
    yui: [
      { say: 'If you’re here next summer, come to a meeting. They’re unbelievably boring and they’re where everything actually happens.', who: 'yui', expr: 'warm' } ]
  }},

  /* =====================================================================
     CLOSING UP — where the night gets tied together, by the one person
     who has been standing there through all four conversations.
     ===================================================================== */
  closing: { script: [
    { narrate: 'Ten past ten. Etsuko takes the curtain down herself, which she will not let you do, and then sits on the customer side of her own counter, which you have never seen her do.' },
    { say: 'Sit. Two minutes. Then the pots.', who: 'etsuko', expr: 'neutral' },
    { narrate: 'The fan clicks off. The street outside is entirely silent, which took you a week to get used to.' },
    { choose: [
      { label: '"Is it always like that? All of them at once?"', tone: 'Curious', warm: 'etsuko',
        then: [
          { say: 'It is always the same four conversations. Different mouths.', who: 'etsuko', expr: 'neutral' },
          { say: 'Somebody is driving somebody to a hospital. Somebody’s shop has shut. Somebody cannot afford the child they want. And somebody is angry about a building.', who: 'etsuko', expr: 'neutral' },
          { say: 'Forty-one years. In 1984 the four conversations were: the bypass, the price of pork, a wedding, and whose son was being an idiot.', who: 'etsuko', expr: 'warm' } ] },
      { label: '"Everyone was talking about the same thing tonight."', tone: 'Curious', warm: 'etsuko',
        then: [
          { say: 'They were talking about four things and it was one thing. Yes. Well done.', who: 'etsuko', expr: 'warm' },
          { say: 'Nobody in here would say the word. Nobody says "we are an {{aging|aging population}}" while eating. They say: my daughter cannot come in October.', who: 'etsuko', expr: 'neutral' } ] },
      { label: '"You must be exhausted."', tone: 'Empathetic',
        then: [
          { say: 'I am seventy-four. I am always exhausted. It is the base rate.', who: 'etsuko', expr: 'stern' },
          { narrate: 'She sits back a little, which is her version of agreeing with you.' } ] }
    ]},
    { say: 'They will tell you at school it is because women stopped having babies. That is the half of it they can fit on a chart.', who: 'etsuko', expr: 'stern' },
    { choose: [
      { label: '"What’s the other half?"', tone: 'Curious', warm: 'etsuko',
        then: [
          { say: 'That none of us died.', who: 'etsuko', expr: 'warm' },
          { say: 'I have had two things that would have killed my mother at my age, and I am sitting here complaining about my back. {{lifeexp|We stopped dying}} and we did not start being born, and that is the whole of it, and one half of it is a triumph.', who: 'etsuko', expr: 'neutral' },
          { say: 'Nobody wants to say the triumph is the problem. So they say it about the young women instead.', who: 'etsuko', expr: 'stern' } ] },
      { label: '"That’s not really fair on Aiko, is it."', tone: 'Empathetic', warm: 'etsuko',
        then: [
          { say: 'It is not fair on anybody. Aiko is doing arithmetic. So was I, in 1976 — my arithmetic just came out the other way because my mother lived up the road and the rent was nothing.', who: 'etsuko', expr: 'neutral' },
          { say: 'Same woman. Different sums.', who: 'etsuko', expr: 'neutral' } ] },
      { label: '"So it’s your fault for living so long."', tone: 'Playful', warm: 'etsuko',
        then: [
          { say: 'Entirely. I am extremely sorry.', who: 'etsuko', expr: 'warm' },
          { say: 'I intend to keep doing it.', who: 'etsuko', expr: 'stern' } ] }
    ]},
    { say: 'Ask me the one you have been sitting on all night.', who: 'etsuko', expr: 'neutral' },
    { choose: [
      { label: '"What happens to the shop?"', tone: 'Curious',
        then: [
          { say: 'Nothing happens to the shop. The shop closes.', who: 'etsuko', expr: 'neutral' },
          { say: 'Not this year. But your uncle drives, your mother is in Sendai, and you have a life that is not this street, and you should have.', who: 'etsuko', expr: 'neutral' },
          { say: 'There are nine million {{akiya|empty houses}} in this country and one of them will be this one, and it will not be a tragedy. It will be a Tuesday.', who: 'etsuko', expr: 'stern' },
          { say: 'That is not sad. It is only sad if nobody knew it was here.', who: 'etsuko', expr: 'warm' },
          { say: 'That is what the summer is for.', who: 'etsuko', expr: 'warm' } ] },
      { label: '"Are you all right? Really?"', tone: 'Empathetic',
        then: [
          { say: 'No.', who: 'etsuko', expr: 'neutral' },
          { narrate: 'She says it the way you say a fact about the weather.' },
          { say: 'My back is going and the hospital is twice a month and my son puts a hundred thousand kilometres a year on a car because of me, and he will not say so, and I know exactly what it costs him.', who: 'etsuko', expr: 'worried' },
          { say: 'And I would rather be a burden here than comfortable in a home in Kōriyama where nobody knows that I opened this shop in 1984 with eight hundred thousand yen and a cousin’s van.', who: 'etsuko', expr: 'stern' },
          { say: 'That is not a policy. Nobody can build that.', who: 'etsuko', expr: 'worried' } ] },
      { label: '"Can I do the pots?"', tone: 'Playful', warm: 'etsuko',
        then: [
          { say: 'You may do the pots.', who: 'etsuko', expr: 'warm' },
          { say: 'You may not do the pots the way you did them on Sunday.', who: 'etsuko', expr: 'stern' } ] }
    ]},
    { narrate: 'She gets up, holding the counter, and takes a moment on the way that she would deny taking.' },
    { say: 'Same again tomorrow. Six o’clock. Eggs.', who: 'etsuko', expr: 'neutral' },
    { say: 'And put the notebook somewhere you will find it. You will want it later.', who: 'etsuko', expr: 'warm' }
  ]}

  };

  global.Scenes = SCENES;

}(window));
