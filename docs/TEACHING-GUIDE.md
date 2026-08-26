# Ramen Talk — teaching guide

**AP Human Geography, Topic 2.9 — Aging Populations (SPS-2.C)**
Causes and consequences (political, economic, social) of an aging population.

Runs in **35–42 minutes**. Written for 9th graders with no prior knowledge of
Japan, Japanese food, or the demographic transition model.

---

## The one-sentence version

Five conversations at a ramen counter, in which nobody ever says "dependency
ratio" out loud except once, sarcastically, and every 2.9 concept arrives as
somebody's actual problem.

---

## What it teaches, and where

| 2.9 concept | Where it lives | What the student actually sees |
|---|---|---|
| **Causes** — falling fertility, delayed childbirth | Scene 3 (Aiko & Ren) | A couple who both want a child doing arithmetic that keeps coming out "not this year" |
| **Causes** — longer life expectancy | Closing scene (Etsuko) | "We stopped dying and we did not start being born, and one half of that is a triumph" |
| **Old-age dependency ratio** | Scene 1 (Daiki) | One son driving 100 minutes to a hospital twice a month because he is the only working-age adult left |
| **Caregiving burden (social)** | Scene 1, phone feed 2 | 介護離職 — over 100,000 people a year leaving work to care for a parent |
| **Rural depopulation (social)** | Scene 2 (Kenji), phone feed 3 | Eleven businesses on a street, now three. A ¥50,000 house nobody wants |
| **Labor shortage (economic)** | Scene 2 (Mary), phone feed 3 | A care home 11 staff short after advertising for 14 months |
| **Silver economy (economic)** | Scene 2 (Kenji) | "Old people are a growth market" — and the market is 50 minutes away in the city |
| **Immigration as policy response** | Scene 2 (Mary) | A Filipina care worker on Japan's nursing visa route, and one xenophobic reply getting answered |
| **Automation as policy response** | Phone feed 3 | Care robotics shipments up 19% — "a lifting frame cannot hold a hand" |
| **Failed pro-natalism (economic)** | Scene 3, phone feed 4 | ¥600,000 per child against nine years of career, and the estimate that big packages move fertility about +0.1 |
| **Political consequences** | Scene 4 (Tanaka & Yui) | Two buildings, one budget, and four-in-five turnout among over-65s against one-in-three among twentysomethings |
| **Social isolation (social)** | Scene 5 (Hiroshi), phone feed 5 | A man who waits on a bench outside until the shop is quiet enough that he will not be a nuisance |
| **Single-person households / kodokushi** | Scene 5, phone feed 5 | A thermos flask that messages his son when he makes tea, and the afternoon in March he lay on the floor doing arithmetic about when somebody would notice |
| **Stage 5 / natural decrease** | Phone feed 1, end card | Deaths at double births; population falling every year since 2010 |

Every scene also carries a **margin note** into the in-game notebook naming
the exam term for that scene. Students can reopen it at any point.

---

## Running it in a period

| Minutes | What |
|---|---|
| 0–3 | Hand out the link and **one** worksheet — the two-page [concept handout](CONCEPT-HANDOUT.md) unless you have a reason to use another. Say nothing about demography. |
| 3–42 | They play. It is quiet. Let it be quiet. |
| 42–55 | Discussion (prompts below), or the FRQ-style question on the back of the handout |

**This now runs longer than a 45-minute period for a slow reader.** If you have
a single short period, cut a scene from `ORDER` (below) before you run it.

**Point them at the concept bank before they start, not at the concepts.**
The bank on the front of the handout is a word list, not a lesson — students
should meet Daiki first and go looking for the term afterwards. The column
that matters is the fourth one, where they have to say *how* the detail proves
the concept; a student who writes "this relates to the dependency ratio" has
not answered it, and that distinction is worth making out loud before they
play.

**Do not front-load vocabulary.** The whole design assumes students meet
"dependency ratio" *after* they have met Daiki. Pre-teaching it turns the game
into an illustration of a lecture, which is the thing it is built to avoid.

### If you are short on time

Open `js/data.js` and edit the running order near the middle of the file:

```js
var ORDER = ['daiki', 'kenji_mary', 'aiko_ren', 'tanaka_yui', 'hiroshi'];
```

Delete any entry and nothing breaks — the phone break, notebook entry, closing
summary and progress counter all follow this list.

| Cut | Gets you to | What it costs |
|---|---|---|
| `'aiko_ren'` | ~33 min | All the fertility and pro-natalism content. The other four scenes do not cover it |
| `'tanaka_yui'` | ~34 min | All the political-consequences content |
| `'hiroshi'` | ~35 min | Social isolation, and the emotional centre of the night |
| `'kenji_mary'` | ~34 min | Depopulation, the silver economy and immigration. The single most expensive cut |

If you must cut one, cut `'tanaka_yui'` and cover political consequences in
discussion — it is the most lecture-able of the five. **Keep `'hiroshi'`
last if you keep him**; the closing scene answers him directly, and he is
built to be the last thing that happens.

---

## The mechanic that does the work

Each customer's order is a mood, not a menu item, and the bowl is matched
against four hidden tags. Three tags met or better = the bowl suited them.

**A bowl that suits somebody unlocks a confession** — the thing that character
will not say otherwise:

| Who | What they only say over a good bowl |
|---|---|
| **Daiki** | He catches himself planning for his mother's decline on the motorway, and hates himself for it |
| **Kenji** | Mary is kind and good at her job and is not his daughter, and he would never say the second part in front of her |
| **Mary** | She knows she is a policy — "somebody in Tokyo worked out the numbers and opened a door" |
| **Aiko** | She is not undecided. She has wanted a child since she was 26 and the arithmetic keeps saying not yet |
| **Ren** | Aiko's mother is having tests. The childcare years and the eldercare years would be the *same five years* |
| **Tanaka** | He voted for people his own age 200 times, was reasonable every time, and that is how the town emptied |
| **Yui** | The daycare argument is really "I don't want to find you alone on an empty street" |
| **Hiroshi** | He fell in March, and while he was on the floor he worked out that nobody would have known until Friday |

**This is what makes two students' notes different**, and it is what the
discussion should open with. The closing screen tells each student how many
of the seven they heard.

Nobody is punished. A student who heard two of seven still met every concept
in the table above — they just got the public version instead of the private
one.

---

## Discussion prompts

Best in this order. The first one gets everyone talking regardless of what
they heard.

1. **"Who did you get a bowl right for, and what did they tell you?"**
   Immediately reveals that people have different information. Let two
   students compare Daiki.

2. **"Daiki and Etsuko are in the same room. What number are they?"**
   Gets you to the old-age dependency ratio from the inside. Push for: two
   working-age adults per person over 65, nationally about 51 per 100.

3. **"Nakano's fish shop closed after 51 years. Did it fail?"**
   No. It ran out of customers *and* out of a successor. Separating "bad
   business" from "no people" is the depopulation concept.

4. **"Why is Mary here?"**
   Trace it back: fewer young Japanese → care work unfilled → visa route
   opened. Then ask what the alternative was (automation), and whether the
   anonymous reply on the phone had a point about wages. Mie's answer — she
   raised wages 22% and got four applicants, two over 60 — is the answer.

5. **"The town offers ¥600,000 to have a child. Aiko says no. Is she wrong?"**
   The hard one. Push past "it's not enough money" to *what the money is
   bidding against*: nine years of career, no grandmother nearby, a school
   that closed, and the fact that it is her job that pauses.

6. **"Tanaka has voted since 1971. Yui's generation mostly doesn't. Who is at
   fault for the senior centre?"**
   The intended landing: nobody in the room is greedy, and the arithmetic does
   the deciding. Then: Yui's split-building proposal — why is the compromise
   the hardest thing to get voted for?

7. **"Hiroshi says the flask is a lovely piece of design. Why is that the
   saddest line in the game?"**
   He is an engineer admiring the device that exists to prove he is still
   alive. Push toward: technology is a real response to isolation and it is
   not the same as company. Then ask what the alternative would cost — a
   neighbour, a delivery, a regular Tuesday somewhere — and why that is
   harder to fund than a flask.

8. **"Why did Hiroshi wait on the bench?"**
   Almost every class will have noticed the figure outside and not known who
   it was. He waits so as not to be a nuisance, which means he gets twenty
   minutes at closing time. Good route into why isolation is *structural* —
   he is not shy, he is a man whose entire social network was a company in
   Tokyo forty-one years long.

9. **"Etsuko says a fifth of men his age live alone. Why men?"**
   Their networks were built through work and ended with it. Women his age
   are far more likely to have kept neighbourhood and family ties. Worth
   naming that this is one of the few places where the aging story is
   sharply gendered against men.

10. **"Etsuko says one half of the problem is a triumph. What does she mean?"**
   Rising life expectancy. Worth naming that "aging population" is caused as
   much by success as by anything going wrong.

---

## Answer key — the concepts, stated plainly

- **Aging population**: rising share over 65 and falling share of children,
  caused by falling fertility *and* rising life expectancy together.
- **Total fertility rate**: Japan ≈ 1.2. **Replacement level** ≈ 2.1.
- **Natural decrease**: deaths exceed births; Japan every year since 2007.
- **Old-age dependency ratio**: people 65+ per 100 aged 15–64. Japan ≈ 51.
  About 10 in 1970.
- **Political consequence**: over-60s vote at roughly twice the rate of
  twentysomethings, and are also a larger bloc, so spending tilts toward
  pensions and healthcare. Japanese term: シルバー民主主義, "silver democracy."
- **Economic consequences**: shrinking workforce and tax base; pension and
  health spending around a third of the national budget; labor shortage
  concentrated in care, farming, construction; the silver economy as one of
  the few growth markets, concentrated in cities.
- **Social consequences**: caregiving burden on people in their 40s–50s,
  disproportionately women; rural depopulation and ~9 million empty houses;
  elder care moving outside the family; and **social isolation** — around a
  fifth of men over 65 live alone, single-person elderly households have
  roughly tripled since 1990, and *kodokushi* (dying alone and not being
  found) is common enough to have a word, an industry and a budget line.
- **Policy responses**: pro-natalism (small measured effect), immigration
  (politically constrained, and real), automation (real, and limited).

---

## What it deliberately leaves out

- **Any claim that this is uniquely Japanese.** The end card names South
  Korea, Italy, Spain, Germany and China on purpose. Japan is early, not
  strange.
- **A villain.** No character is wrong so another can correct them. Aiko and
  Ren are both right; so are Tanaka and Yui.
- **The immigration debate at full size.** It is present through two people
  and one argument in a comment thread. It is not settled and the game does
  not settle it.
- **Fertility as a moral question.** Aiko is not a cautionary tale in either
  direction. If a student reads her as selfish, that is worth a conversation
  and the game has not told them to.
- **Japan's history and its policy on foreign labor in any detail.** Mary's
  visa route is named and not explained. That needs its own lesson.

---

## Historical and factual notes

**Real, and named as such:** the *mimamori* watch-over industry, including
thermos flasks that message a relative when hot water is used, fridge-door
sensors and utility-usage alerts — these exist and have been on sale for
years; *kodokushi* as a recognised category with its own specialist cleaning
sector; Japan's population decline since 2010; fertility
around 1.20; median age around 49; over-65 share around 29%; the ~9 million
empty houses; the 2014 and later municipality-viability estimates (~40% at
risk by 2040); over 100,000 people a year leaving work over caregiving; the
nursing-care visa route; Kitakata, Sapporo, Hakodate and Hakata as real ramen
regions with the histories described.

**Invented:** the town, the shop, and every person in it. There is no real
Kawaguchi being depicted, no real council meeting, and no real accounts on the
phone. The Tsubuyaki posts are written for this game in the manner of the
platform; the numbers quoted inside them are real published figures.

**Simplifications worth knowing before a student asks:**
- Yen figures are current-ish and rounded for playability.
- The ¥600,000 settlement grant is typical of real municipal schemes rather
  than a specific one.
- "Four in five over-65s vote" is the town's number in-game; national turnout
  gaps are real but vary by election.

---

## Guided-notes answer key

Blanks in order, by block. Where a student's wording will vary, the accepted
substance is given rather than exact words.

**Before the shop opens.** 14th · double · natural decrease · 1.20 (about 1.2) ·
2.1

**Scene 1 — Daiki.** Osaka · there was nobody else to look after his mother ·
twice · fifty (50) · 2019 · the only doctor was 71 and it closed ·
eleven / two · two / one · old-age dependency · 65 · 100 · about 51 ·
about 10
*Phone:* 100,000 · two-thirds · women

**Scene 2 — Kenji & Mary.** eleven · three · depopulation ·
(1) young people leaving for cities (2) the people left behind are too old to
have children · fifty-one · customers · successor / son · growth ·
Kōriyama and Sendai · that is where enough older people live in one place to be
worth the rent · Cebu, the Philippines · nursing / care · half a million ·
there are not enough young Japanese people to fill the jobs
*Phone:* 22 · four · two · automation / machines · hold a hand
*Daughter:* Tokyo · four · October

**Scene 3 — Aiko & Ren.** 600,000 · pro-natalist · nursery / daycare · her
(her career, her time) ·
Four differences — any four of: married later; first child later; no
grandmother nearby to do the afternoons; her mother still works at 62; rent
and housing; her own career is nine years in; it is her job that pauses, not
his · 35 · closed in 2016 ·
*The loop:* families do not move here because the school is shut, and the
school shut because families stopped having children here — each one makes the
next more likely
*Phone:* +0.1 · +0.9

**Scene 4 — Tanaka & Yui.** (a) the community health and senior centre
(b) the extended-hours childcare centre · four in five · one in three ·
voter turnout · count · about a third · today (people working now) ·
silver democracy ·
*Yui's compromise:* both in one building — day service in one wing, childcare
in the other, sharing a kitchen, car park and heating ·
*Why it's hard:* it is not what either side asked for, so neither side
campaigns for it

**Scene 5 — Hiroshi.** twenty-seven · forty-one · the company — his whole
social network was his employer, and it ended on the day he retired ·
a thermos flask / watch-over (mimamori) device · his son, in Chiba ·
a fifth (1 in 5) · social isolation · kodokushi ·
*Why he waited on the bench:* so as not to be a nuisance while the shop was
busy — which means he only ever gets the twenty minutes before closing
*Phone:* 1 in 5 · tripled (since 1990)

**Closing — Etsuko.** longer life expectancy — people stopped dying young ·
*The triumph:* living to 84 is a success, not a failure; the problem is caused
as much by medicine working as by anything going wrong, and saying so is
harder than blaming young women for not having children

**Put it together.** caused by falling fertility AND rising life expectancy.
Daiki — social (caregiving burden) · Kenji — social/economic (depopulation and
the silver economy) · Mary — economic (labor shortage, immigration as
response) · Aiko — economic/causes (failed pro-natalism, falling fertility) ·
Tanaka — political (turnout and what gets funded)
