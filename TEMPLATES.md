# Slide Template Architecture

This is the reference for how Slidexy's premium slide **templates** work, and
what a new one needs to do to plug in correctly. If you're asking Claude to
add more templates, point it at this file first.

## Two separate systems — don't conflate them

Slidexy has two independent mechanisms that both affect how a slide looks.
A slide uses **one or the other**, never both at once:

| | **Templates** (this doc) | **Layout variants** |
|---|---|---|
| What it is | Hand-authored HTML/CSS strings, full creative control | Procedural — positions text/image boxes from a coordinate table |
| Where | `src/app/text-to-template/templates/*.ts` | `src/utils/variantGenerator.ts` |
| Selector field | `slide.templateStyle` (e.g. `"modern"`) | `slide.layout_type` + `slide.currentVariantIndex` |
| Picked from | Editor → Layouts panel → **Templates** tab | Editor → Layouts panel → **Layouts** tab |
| Renderer | `TemplateHTMLSlide.tsx` (raw HTML, `dangerouslySetInnerHTML`) | `HTMLSlideRenderer.tsx` building from `slide.layouts[i]` data |

**The important gotcha:** if `slide.templateStyle` is set, it wins completely
— the template's own hardcoded HTML/colors render regardless of what
theme, palette, or layout variant is selected. The editor's Layouts panel
already shows a warning banner for this ("template style is active, remove
it to use layout variants"). This bit us during the editor redesign: theme
picks silently did nothing because a template was active, and the theme
panel didn't know to clear it.

This file is only about the **templates** side.

## File map

```
src/app/text-to-template/
├── types/presentation.ts          # Slide, BackendSlide, SlideElement types
└── templates/
    ├── modernTemplate.ts          # one file per template
    ├── corporateTemplate.ts
    ├── ...                        # 16 total today
    └── minimalTemplate.ts

src/app/components/layouts/
└── TemplateHTMLSlide.tsx          # registry + live editor renderer

src/utils/
└── convertPresentation.ts         # SECOND registry — see "Two registries" below
```

## Template function contract

Every template file exports **one function**:

```ts
export const create{Name}Template = (
  backendSlide: BackendSlide,
  slideIndex: number
): Slide => { ... }
```

- **Naming is load-bearing.** The registry imports `create{Name}Template`
  where `{Name}` is the PascalCase of the file's own id. A mismatch fails
  silently at import time (Next.js logs a warning, the template just doesn't
  render) — this exact bug existed in `minimalTemplate.ts`
  (`createMinimalistTemplate` vs the expected `createMinimalTemplate`) for
  this entire project until it was caught and fixed. **Double-check the
  export name matches the import in both registries before calling a new
  template done.**
- Input: `BackendSlide` — `slide_title`, `textBlock.elements[]` (body text /
  bullets), `titleBlock`, `imageBlock.elements[].properties.imageSrc`,
  `image_url`. See `types/presentation.ts` for the full shape.
- Output: a `Slide` — in practice this always means: build an HTML string,
  wrap it in one `Konva.HTML` element, return it. Copy this shape from any
  existing template:

```ts
elements.push({
  element_type: 'html',
  konva_component: 'Konva.HTML',
  properties: { x: 0, y: 0, width: 960, height: 540, htmlContent: htmlTemplate, zIndex: 0 },
  id: `html-template-${slide_id || slideIndex}`,
});

return { slide_id: slide_id || `slide-${slideIndex}`, title: titleText, image_url: images[0], elements, htmlTemplate };
```

The canvas is always **960×540** — every template's outer HTML wrapper
should fill `100%`/`100%` of that, not hardcode different pixel dimensions.

## Internal conventions (established pattern, not enforced by code)

Every existing template follows the same internal shape — copy it:

1. **`palette` object** at the top — named colors (`primary`, `accent`,
   `bg`, `text`, etc.), not colors inlined ad hoc through the HTML.
2. **Small decorative helper functions** — e.g. `waveBackground()`,
   `circleAccent()`, an icon-SVG lookup — each returning an HTML string
   snippet, composed into the main layout.
3. **Data-extraction helpers** — `getTextContent(block)` and
   `getImages(backendSlide)` pull the actual slide content out of
   `BackendSlide` into flat arrays your layout code can `.map()` over.
4. **`layoutType = slideIndex % N`** — a `switch` over N hardcoded layout
   variants (`modernTemplate.ts` has 5) so consecutive slides in the same
   deck don't all look identical, while still being deterministic per
   position. This is a template's *own* internal variety mechanism —
   unrelated to the separate "layout variants" system above.
5. Each `case` builds one big inline-styled HTML template-literal string —
   `position:absolute`/flex/grid layout, decorative background layer first,
   content layer with `z-index: 2` on top.

## Editability requirement (easy to get wrong)

The live editor makes template text edit-in-place by scanning the rendered
HTML for specific tags — see `TemplateHTMLSlide.tsx`'s `useEffect`. If your
template doesn't use these tags, that text **will render but won't be
editable** in the app:

- **Title**: first `<h1>`–`<h6>` with >5 characters of text becomes the
  editable title, mapped back to `slide_title.text`.
- **Body / bullets**: `<p>`, `<li>`, and `<span>` elements with >3
  characters become editable, mapped back to `elements[i].text` in the
  same order they appear in the DOM.
- Anything containing an `<svg>`, `<img>`, `<canvas>`, or `<video>` child is
  skipped automatically (so icon containers don't get wrongly marked
  editable) — no extra markup needed on your end for that.
- Short all-caps strings (<10 chars, e.g. a "NEW" badge) are skipped so
  labels don't get mistaken for the title.

**Practical rule: use real semantic heading tags for the title and
`<p>`/`<li>` for every other text block.** A `<div>` styled to look like a
heading will render fine but silently isn't editable.

Images: don't worry about `object-fit` per-image — a global stylesheet rule
(`._sx-wrap img { object-fit: cover !important }`) is injected around every
template automatically.

## Two registries — register a new template in both

There are **two separate places** a template must be listed, because two
separate parts of the app consume the same template files:

1. **`src/app/components/layouts/TemplateHTMLSlide.tsx`** — the one that
   matters for the main editor (`/editor`). Add to both:
   - `TEMPLATE_REGISTRY`: `{ id: createYourTemplate }`
   - `TEMPLATE_META`: `{ id, name, accent, bg }` — powers the template
     picker card in the editor's Layouts panel (accent/bg drive the little
     preview swatch, not the actual template — keep them roughly matching
     your template's real palette).

2. **`src/utils/convertPresentation.ts`** — only used by the separate
   standalone `/text-to-template` tool, not the main editor. Add an import
   + a `case "id": return createYourTemplate(backendSlide, index)` branch.
   If you only care about the main editor, you can skip this, but a
   template that's in one registry and not the other will behave
   inconsistently depending which part of the app the user is in — worth
   keeping them in sync.

## Checklist for adding a new template

1. Create `src/app/text-to-template/templates/{name}Template.ts`.
2. Define a `palette`, write 3-5 layout variants keyed off
   `slideIndex % N`, export `create{Name}Template(backendSlide, slideIndex): Slide`.
3. Use `<h1>`-`<h6>` for the title and `<p>`/`<li>` for body text — not
   plain `<div>`s — or the text won't be editable in the live editor.
4. Wrap the HTML in the standard single-`Konva.HTML`-element `elements`
   array shown above.
5. Register in `TemplateHTMLSlide.tsx` (`TEMPLATE_REGISTRY` + `TEMPLATE_META`)
   and, if it should also work in the standalone tool, in
   `convertPresentation.ts`.
6. Double-check the exported function name matches exactly what both
   registries import — this is the one thing that fails silently.
7. Test in the editor: Layouts panel → Templates tab → pick it → confirm
   text is click-to-edit and images/bullets render for a slide that has
   more/fewer bullets and images than your test slide, since real decks
   vary in content length.
