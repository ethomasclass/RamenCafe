CHARACTER ART — drop PNGs in this folder and they appear in the game.

Filenames are already wired in js/sprites.js. You do not have to edit any
code; a file that is not here is simply ignored and the game draws its own
figure instead, so art can arrive one piece at a time.

  etsuko-neutral.png   daiki-neutral.png    kenji-neutral.png
  etsuko-warm.png      daiki-warm.png       kenji-warm.png
  etsuko-worried.png   daiki-worried.png    kenji-worried.png
  etsuko-stern.png     daiki-surprised.png  kenji-stern.png
  etsuko-blink.png     daiki-blink.png      kenji-blink.png

  mary-neutral.png     aiko-neutral.png     ren-neutral.png
  mary-warm.png        aiko-warm.png        ren-warm.png
  mary-worried.png     aiko-worried.png     ren-worried.png
  mary-blink.png       aiko-stern.png       ren-blink.png
                       aiko-blink.png

  hiroshi-neutral.png  tanaka-neutral.png   yui-neutral.png
  hiroshi-warm.png     tanaka-warm.png      yui-warm.png
  hiroshi-worried.png  tanaka-worried.png   yui-worried.png
  hiroshi-surprised.png tanaka-stern.png    yui-stern.png
  hiroshi-blink.png    tanaka-blink.png     yui-blink.png

YOU DO NOT NEED ALL OF THEM. Missing expressions fall back:

  warm      -> neutral
  worried   -> neutral
  stern     -> worried -> neutral
  surprised -> neutral

So one file — <name>-neutral.png — is enough to see somebody in the shop, and
four covers every mood the writing uses. `blink` is optional and separate:
supply an eyes-closed version and that character blinks by themselves every
few seconds. It is the single cheapest thing on this list and it buys the most
life.

REQUIREMENTS

  - Transparent background.
  - No counter or table. The room draws its own, and it passes in front of
    everybody at a fixed height.
  - Crop so the bottom edge sits just below where the hands would rest.
  - Any size — each image is scaled to the room on load, so generate big.
  - Framing: head and shoulders down to about the chest. Roughly a 3:4
    portrait works best; the game shows about 132px of height at 384x216, and
    the counter hides everything below it.

WHO IS WHO

  etsuko  74, your grandmother, behind the counter all night. Sharp, dry,
          hates admitting she needs anything. Apron.
  daiki   46, her son. Tired in a permanent way. Work shirt. Checks his phone.
  kenji   81, retired greengrocer. Warm, a talker, a cap.
  mary    34, care worker from the Philippines. Warm, quick, practical.
  aiko    33, project manager. Guarded, precise, tired of being asked.
  ren     34, her husband. Sentimental, keeps things light, glasses.
  tanaka  76, retired town councilman. Proud, upright, glasses.
  yui     38, his daughter, urban planner. Sharper than him and fond of him.
  hiroshi 79, retired electronics engineer, widower, lives alone at the end
          of the road. Ironed collared shirt on a Tuesday, glasses, thin
          white hair combed across, a cap he holds on his knee rather than
          put on the counter. Should read as dignified and courteous rather
          than pitiable — the sadness in his scene is entirely in what the
          player notices, never in his face.

While a file is missing the browser console notes it could not be loaded.
That is expected and harmless — it is how the fallback works.
