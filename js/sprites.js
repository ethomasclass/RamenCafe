/* ===========================================================================
   sprites.js — hand-made character art.

   THIS IS ALREADY WIRED. You do not need to edit this file to use it.

   Every character below points at a filename in art/characters/. A file that
   isn't there yet is simply ignored and the game draws its own figure
   instead — so art can arrive one PNG at a time, nothing ever breaks, and
   nothing needs uncommenting.

   TO ADD A FACE
   -------------
   Save a PNG into art/characters/ with the matching name below. That is all.

   You do NOT need all four expressions. Missing ones fall back:
       warm      -> neutral
       worried   -> neutral
       stern     -> worried -> neutral
       surprised -> neutral
   So `neutral` alone is enough to see somebody in the shop, and four covers
   every mood the writing uses.

   `blink` is optional and separate: supply an eyes-closed version and the
   character blinks by themselves every few seconds. It costs one image and
   buys more life than anything else on this list.

   REQUIREMENTS
   ------------
   - Transparent background, and no counter — the room draws its own.
   - Crop so the bottom edge sits just below the hands.
   - Any size; it is scaled to the room on load, so generate big.

   (While a file is missing the browser console notes that it could not be
   loaded. That is expected and harmless — it is how the fallback works.)
   =========================================================================== */

window.SPRITES = {

  /* Etsuko — your grandmother. Behind the counter all night. */
  etsuko: {
    neutral:   'art/characters/etsuko-neutral.png',
    warm:      'art/characters/etsuko-warm.png',
    worried:   'art/characters/etsuko-worried.png',
    stern:     'art/characters/etsuko-stern.png',
    surprised: null,
    blink:     'art/characters/etsuko-blink.png'
  },

  /* Daiki — her son. Tired. Drives. */
  daiki: {
    neutral:   'art/characters/daiki-neutral.png',
    warm:      'art/characters/daiki-warm.png',
    worried:   'art/characters/daiki-worried.png',
    stern:     null,
    surprised: 'art/characters/daiki-surprised.png',
    blink:     'art/characters/daiki-blink.png'
  },

  /* Kenji — the retired greengrocer. */
  kenji: {
    neutral:   'art/characters/kenji-neutral.png',
    warm:      'art/characters/kenji-warm.png',
    worried:   'art/characters/kenji-worried.png',
    stern:     'art/characters/kenji-stern.png',
    surprised: null,
    blink:     'art/characters/kenji-blink.png'
  },

  /* Mary — his care worker. */
  mary: {
    neutral:   'art/characters/mary-neutral.png',
    warm:      'art/characters/mary-warm.png',
    worried:   'art/characters/mary-worried.png',
    stern:     null,
    surprised: null,
    blink:     'art/characters/mary-blink.png'
  },

  /* Aiko — guarded, precise. */
  aiko: {
    neutral:   'art/characters/aiko-neutral.png',
    warm:      'art/characters/aiko-warm.png',
    worried:   'art/characters/aiko-worried.png',
    stern:     'art/characters/aiko-stern.png',
    surprised: null,
    blink:     'art/characters/aiko-blink.png'
  },

  /* Ren — sentimental, keeps the mood up. */
  ren: {
    neutral:   'art/characters/ren-neutral.png',
    warm:      'art/characters/ren-warm.png',
    worried:   'art/characters/ren-worried.png',
    stern:     null,
    surprised: null,
    blink:     'art/characters/ren-blink.png'
  },

  /* Hiroshi — the retired engineer at the end of the road. */
  hiroshi: {
    neutral:   'art/characters/hiroshi-neutral.png',
    warm:      'art/characters/hiroshi-warm.png',
    worried:   'art/characters/hiroshi-worried.png',
    stern:     null,
    surprised: 'art/characters/hiroshi-surprised.png',
    blink:     'art/characters/hiroshi-blink.png'
  },

  /* Tanaka — retired councilman. */
  tanaka: {
    neutral:   'art/characters/tanaka-neutral.png',
    warm:      'art/characters/tanaka-warm.png',
    worried:   'art/characters/tanaka-worried.png',
    stern:     'art/characters/tanaka-stern.png',
    surprised: null,
    blink:     'art/characters/tanaka-blink.png'
  },

  /* Yui — his daughter, urban planner. */
  yui: {
    neutral:   'art/characters/yui-neutral.png',
    warm:      'art/characters/yui-warm.png',
    worried:   'art/characters/yui-worried.png',
    stern:     'art/characters/yui-stern.png',
    surprised: null,
    blink:     'art/characters/yui-blink.png'
  }
};
