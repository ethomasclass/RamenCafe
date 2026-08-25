# Ramen Talk

*A small town in northern Japan. Tuesday, some August. Your grandmother's
ramen counter has six seats and four of them stay empty.*

A *Coffee Talk*–style visual novel for one class period, built the same way as
[Colonial Coffee House](https://github.com/ethomasclass/Colonial-Coffee-House).
Students spend an evening behind a ramen counter while seven people sit down
and talk to them, and the whole of **AP Human Geography Topic 2.9 — aging
populations** arrives as somebody's actual problem rather than a bullet point.

No install, no accounts, no student data collected. It is a folder of static
files — open `index.html` and it runs.

## ▶ Play it

### **https://ethomasclass.github.io/RamenCafe/**

That is the link to give students. It opens straight into the game, works on a
school Chromebook, and needs nothing installed. Every push to this branch
republishes it within about a minute.

*(Turn it on once under Settings → Pages → deploy from branch, root.)*

---

## Documentation

- **[docs/HOW-TO-PLAY.md](docs/HOW-TO-PLAY.md)** — student directions.
  Printable, or project it while they start.
- **[docs/STUDENT-HANDOUT.md](docs/STUDENT-HANDOUT.md)** — one double-sided
  sheet. Front filled in while playing, back after closing.
- **[docs/GUIDED-NOTES.md](docs/GUIDED-NOTES.md)** — the scaffolded
  alternative: fill-in-the-blank, one block per scene, in the order they
  happen. **Use this *or* the handout, not both.**
  [`docs/print/guided-notes.html`](docs/print/guided-notes.html) is the same
  thing laid out for a printer — open it and hit print.
- **[docs/TEACHING-GUIDE.md](docs/TEACHING-GUIDE.md)** — what it teaches and
  where, timing, discussion prompts in the order that works, the full answer
  key including every guided-notes blank, and what it deliberately leaves out.

---

## Running it

**Locally:** double-click `index.html`. Deliberately built with plain scripts
rather than ES modules so it works straight off the filesystem — no web
server, no build step, no dependencies.

**For a class:** turn on GitHub Pages and hand out one URL.

---

## What's in the box

| | |
|---|---|
| **Setting** | A shrinking town in Tohoku, present day. Menya Etsuko, six seats |
| **Length** | 30–35 minutes: four conversations, seven bowls, four phone breaks, closing up, end card |
| **Reading level** | Written for 9th graders with zero background in Japan, Japanese food, or the DTM. Every specialist term is glossed in-game |
| **Ramen** | Four real regional broths and eight toppings, all named and placed on a map. Nothing is invented food |
| **Sound** | The pot, the extractor fan and a car going past, all synthesised in-browser. No audio files. **Off by default**, one toggle |
| **Fail state** | None. Every bowl is eaten and nobody walks out |

### The loop

1. **A customer sits down** and starts talking. Every dialogue choice is a
   **tone fork** — *Curious*, *Empathetic*, *Playful*. No branch is wrong;
   they differ in what somebody volunteers. Etsuko deflects sympathy and
   answers questions. Kenji will talk to anybody who lets him.

2. **They give an order as a mood, not a menu item.** *"The plainest thing you
   have."* *"Something rich and a little sweet."* You build the bowl — one
   broth, two toppings — from a shelf where every item is a real regional
   style with a real history attached.

3. **The confession.** Every customer has **one thing they will only say over
   a bowl that actually suited them.** Daiki admits what he catches himself
   thinking on the motorway. Kenji admits that Mary is kind and good at her
   job and is not his daughter. Tanaka admits his daughter is right and always
   was. A student who cooks carelessly never hears any of it, and the closing
   screen tells them how many they missed. **This is what makes two students'
   notes different.**

4. **Between customers, you check your phone.** Tsubuyaki — the whole country
   arguing about the same things your customers are, in posts, replies and
   polls. This is where the vocabulary lives: nobody in the shop says
   "dependency ratio", but the timeline does, three times, while people fight
   about it.

5. **Closing up.** Etsuko sits on the customer side of her own counter for the
   only time all night and ties the four conversations into one.

6. **The end card** runs the arithmetic forward — 2035, 2040, 2050, 2070 —
   and then names South Korea, Italy, Spain, Germany and China, because Japan
   is early rather than strange.

### The mechanic that does the teaching

There is no money and no score. The only thing you can spend is **attention**,
and the only thing you can lose is **what somebody would have told you**.

A bowl is matched against four hidden tags on each customer — not against one
correct recipe. Three tags met is a bowl that suited them. That means there
is never a lookup answer, only reading somebody carefully enough, and it means
a student who listens to the order gets it right without knowing anything
about ramen.

### The recipe notebook

Fills in by itself as you cook. Every broth gets its region, a phonetic hint
on first use, a dot on a map of Japan, and the piece of history that makes it
worth naming — Sapporo miso is seventy years old and still a tradition;
Hakodate shio exists because Chinese cooks worked an 1859 treaty port. A
margin note per scene carries the exam term for that scene, in the student's
own book, without ever putting it in somebody's mouth.

---

## The cast

| Who | Carries |
|---|---|
| **Etsuko**, 74, your grandmother | The whole night, from behind the counter. Forty-one years of it |
| **Daiki**, 46, her son | The old-age dependency ratio, with a steering wheel and 100,000 km a year |
| **Kenji**, 81, retired greengrocer | Rural depopulation as counting, and the silver economy that is never where he lives |
| **Mary**, 34, his care worker | A labor shortage answered by opening a door, from the inside of the door |
| **Aiko**, 33, project manager | Why fertility does not respond to money — and that she is not undecided |
| **Ren**, 34, her husband | The childcare years and the eldercare years being the *same five years* |
| **Tanaka**, 76, ex-councilman | Who votes, what gets funded, and two hundred reasonable meetings |
| **Yui**, 38, his daughter | The generational pressure, and what she actually means by "daycare" |

---

## Files

```
index.html        markup and every panel
css/style.css     lantern light, indigo noren, dark wood
js/data.js        broths, toppings, the cast and their orders, the glossary,
                  the notebook margin notes, the end card, the running order
js/scenes.js      the four conversations, the confessions, closing up
js/feed.js        the phone — accounts, posts, replies, polls
js/art.js         the shop, the people in it, the evening going by
js/sprites.js     which PNG is whose face — already wired, optional
js/icons.js       bowls, shelf jars, the map of Japan
js/audio.js       the pot and the fan, synthesised
js/game.js        state, the script player, the bench, the phone, closing
```

**To change the writing**, edit `js/scenes.js`. It needs no knowledge of the
rest of the game.
**To change the phone**, edit `js/feed.js`.
**To cut the game short**, edit `ORDER` near the middle of `js/data.js` —
delete any scene and its phone break, notebook entry and closing line go with
it.

### Adding your own art

Drop PNGs into `art/characters/` using the names in
[`art/characters/README.txt`](art/characters/README.txt) and they appear. A
file that is not there is ignored and the game draws its own figure instead,
so art can arrive one face at a time and nothing ever breaks. One
`<name>-neutral.png` is enough to see somebody; `-blink.png` is the cheapest
thing on the list and buys the most life.

The room is drawn in code too — see [`art/room/README.md`](art/room/README.md)
if you would rather paint it.

### Accessibility and classroom practicalities

- **Text size** (four steps) and **text speed** (including "all at once")
  under the `Aa` button. Both remembered between sessions.
- **Sound is off until somebody turns it on**, and the choice is remembered.
- **The night is saved** as you go. If a tab dies or the period ends, the
  title screen offers to carry on where they stopped.
- Dialogue advances with click, space or enter. `Esc` closes any panel.
- Nothing is sent anywhere. No accounts, no analytics, no network calls.

---

## Honest notes

**Real, and named as such:** Japan's population falling every year since 2010;
a fertility rate around 1.2 against a replacement level of 2.1; a median age
near 49; roughly 29% of the population over 65; about nine million empty
houses; the estimate that around 40% of municipalities are at risk of ceasing
to function by 2040; over 100,000 people a year leaving work over caregiving;
the nursing-care visa route; and the histories of Hakata tonkotsu, Sapporo
miso, Kitakata shoyu and Hakodate shio.

**Invented:** the town, the shop, every person in it, and every account on the
phone. The figures quoted inside the posts are real; the people posting them
are not.

**Deliberate choices worth knowing before students ask:**

- **There is no villain.** No character is wrong so another can correct them.
  Aiko and Ren are both right. So are Tanaka and Yui.
- **Immigration is present and unsettled.** It arrives through two people and
  one argument in a comment thread, and the game does not resolve it.
- **Fertility is not a moral question here.** Aiko is not a cautionary tale in
  either direction. If a student reads her as selfish, that is worth twenty
  minutes and the game has not told them to.
- **Japan is not treated as strange.** The end card names five other countries
  on the same road. Japan is early.
- **Not built yet:** real timing data with real students. Do that before
  committing a class to it, and cut `ORDER` accordingly.
