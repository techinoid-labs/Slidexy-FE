---
name: canva-design-skill
description: How to design slide templates, slide layouts and slide decoration for Slidexy, based on a study of the Canva presentation catalogue plus the hard constraints of our own PowerPoint exporter. Use this whenever the work touches a template in src/templates/catalog, a block in src/templates/blocks, decoration in decor.tsx or decorNative.tsx, a new theme, a slide layout, or the copy the generator writes onto a slide. Also use it when someone asks for "more templates", "better looking slides", "a new design system", "less text on slides", or points at a competitor's deck and asks for something like it, even if they do not mention templates by name. It carries three things that are easy to get wrong from first principles: which slide archetypes actually exist, what makes one template family differ from another, and which CSS survives our export and which silently disappears.
---

# Designing slides for Slidexy

## Why this exists

Three facts about this product shape every design decision, and none of them
are obvious from looking at the code:

1. **Slide archetypes are a small fixed set.** Twenty thousand presentation
   templates in the Canva catalogue are not twenty thousand designs. They are
   roughly eleven recurring slides wearing different clothes.
2. **Our exporter only understands a few things.** Most of CSS vanishes on the
   way to PowerPoint. A design that ignores this ships as a flat picture,
   which contradicts the one promise the product is sold on.
3. **A slide is not a document.** The generator used to write 15 to 25 word
   bullets. The product manager's note, and it was right, was that there is
   too much text and not enough picture.

Work that ignores any of the three produces something that looks fine in the
browser and fails in the hands of a customer.

## The archetypes

Two decks from opposite ends of the catalogue, one dark and glassy, one white
and hairline, with nothing visually in common, run the same slots:

| # | Archetype | Also called |
|---|---|---|
| 1 | Cover | Title |
| 2 | Contents | Table of contents, agenda |
| 3 | About | Who we are, introduction |
| 4 | Problem | The challenge, market insight |
| 5 | Solution | What we built, services we offer |
| 6 | Proof | Traction, performance, why choose us |
| 7 | Market | Opportunity, sizing |
| 8 | Model | Business model, pricing, how it works |
| 9 | People | Team, our people |
| 10 | Next | Roadmap, what's next, the ask |
| 11 | Close | Thank you, contact |

Design for the archetype, not for a specific deck. A template is complete when
all eleven exist in one visual language. Our catalogue in
`src/templates/catalog/` is organised this way already.

## What actually makes two templates different

Colour is the least important lever, which is counter-intuitive and worth
holding onto. In order of how much they differentiate:

1. **One signature device, repeated on every slide.** This is the biggest and
   the one most often missing. One deck's device was a rounded panel with a
   three-dot header; another's was thin outlined circles bleeding off the
   top-right corner. Every single slide carried it. A template without a
   signature device reads as a colour scheme, not a design.
2. **Density.** One deck filled the frame; the other left most of the slide
   empty and the emptiness *was* the design. This single choice changes a
   template more than any palette swap.
3. **Type pairing and weight.** One heavy grotesque at two sizes, versus the
   same family at low contrast with wide letterspacing, produces two families
   that share a typeface and look unrelated.
4. **Colour.** Real, but mostly a swap. Do not start here.

When adding a template, decide the device and the density first. If you cannot
say the device in one sentence, the template is not designed yet.

## Cover slides

Five patterns cover nearly everything in the catalogue:

- **Oversized word**, often clipped by the canvas edge. "PORTO/FOLIO" broken
  across two lines; "Startup." with the full stop doing the work.
- **Full-bleed photograph** with a scrim and one line of light type.
- **Flat field with one soft gradient form** in a corner, everything else bare.
- **Cream field, serif display, circular photo cut-out.**
- **Split field**, flat colour against photograph.

Meta is always tiny and always in the corners: company mark top-left, date or
"Presented by" top-right, URL bottom. **No cover in the sample carried a
subtitle paragraph.** If a cover needs a paragraph to explain itself, the title
is wrong.

## The export constraint

This is the part that cannot be reasoned out from looking at a browser, and it
governs what is buildable. `src/utils/exportBlockDeckAsPPT.ts` walks the DOM
and, for each leaf, reads exactly three things: `backgroundColor`, a uniform
border, and the corner radius. From those it emits a real PowerPoint `rect` or
`roundRect`.

What follows:

| CSS | What PowerPoint gets |
|---|---|
| solid `background-color` | a real, editable shape |
| uniform `border` | a real shape outline |
| `border-radius` over 3px | `roundRect`; at or under 3px, `rect` |
| **gradient** | **no fill at all**, because `backgroundColor` is transparent |
| **`clip-path`, `mask`, `box-shadow`, `::before`** | **nothing; silently dropped** |
| **`transform: rotate`** | **ignored; the shape lands square** |
| **`<svg>`** | falls through to a snapshot, a flat picture |

Two consequences worth internalising:

- **A CSS 3D cube is not buildable as slide decor.** Six divs under a
  `rotate3d` arrive in PowerPoint as six squares in a heap. Fake depth with
  three flat faces at stepped tones instead; see `IsoBlock` in
  `src/templates/decorNative.tsx`.
- **Background decoration is exempt.** The exporter flattens the whole slide
  background into one picture and lays editable content on top, so SVG behind
  the content costs nothing. That is why `decor.tsx` is SVG and
  `decorNative.tsx` is divs. Put background motifs in the first; put anything
  in the content area in the second.

Before adding decoration, ask which of the two files it belongs in. Getting
this wrong is the most common way to ship something that looks right and
exports broken.

## Copy on a slide

The generator's rules live in `Slidexy-BE/services/generateSlideText.js` under
RULE 0, and template sample copy should obey the same limits:

- About 25 words of body text on a slide, across all bullets combined.
- A bullet is a phrase, not a sentence. No full stop at the end.
- Three bullets, four when the fourth earns it. More than four is two slides.
- Subtitles are a line, not a sentence about the line. Ten words.
- Metrics read `"47%: churn, after the onboarding rebuild"`, never a number
  followed by an explanatory sentence.
- No em dashes anywhere in output. Use a colon, a comma, or two sentences.

"Churn down 47% after onboarding rebuild" says everything that "47% reduction
in customer churn achieved after implementing the new onboarding workflow in
Year 2" does, in a third of the room.

## Adding a template

1. **Name the signature device and the density** in one sentence each. If you
   cannot, stop and decide.
2. **Choose the type pairing**, display and body, from the loaded families.
3. **Build the eleven archetypes** in `src/templates/catalog/`, following the
   shape of the existing files. The helpers in `catalog/helpers.ts` compose the
   blocks.
4. **Put the device in `decorNative.tsx`** if it sits in the content area, or
   `decor.tsx` if it is a background motif.
5. **Keep sample copy inside the limits above.** The catalogue copy is what a
   customer browses, so it is marketing as much as placeholder.
6. **Check the export** before calling it done. Anything that rasterises when
   it should not is a defect, not a detail.

## Research, and the line

Studying the market is ordinary practice: open the catalogues, look at what
recurs, name the patterns, build your own. Everything in this document came
from that and none of it is anyone's property.

Do not scrape template catalogues or extract assets from them. Those templates
are copyrighted design work, the terms of service prohibit automated
extraction, and shipping anything derived from them inside a competing product
is a legal exposure rather than a shortcut. There is also nothing in the files
worth having: the value is the vocabulary above, which is free.
