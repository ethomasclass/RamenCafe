# The room

The shop is currently **drawn in code** — see `js/art.js`. There is no image
file here yet and the game does not need one.

If you want to paint it instead, the target is **384 × 216 pixels**, which is
the exact size of the canvas, so nothing gets resampled and the pixels stay
square when it is scaled up on a projector.

What the code draws over the top of the picture, and therefore what the
painting should leave room for:

| | Where |
|---|---|
| The people at the counter | seated, heads around y 60–150 |
| The counter itself | a band from y 150 down; it passes in front of everybody |
| Steam off the pot | rising from around x 14–62, y 166 |
| The lantern glow | pulsing, centred x 171, y 18 |
| The night getting later | a wash over everything that deepens each scene |

Clickable things students can look at (`ROOM` in `js/data.js`, hit boxes in
`js/art.js`): the calendar, the photograph from opening day, the noren over
the door, the shuttered shop across the street, and the empty seats.

Wiring a painted room in is one `drawImage` at the top of `wall()` in
`js/art.js` — everything else already draws on top.
