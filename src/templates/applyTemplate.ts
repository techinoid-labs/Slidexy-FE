/**
 * Applies a block template to an existing deck, preserving the content.
 *
 * This is the operation that matters for the generate-then-restyle flow: a
 * deck already has titles, subtitles, bullets and images, and the user wants
 * it to *look* like a template — not to be replaced by the template's sample
 * copy. So content is extracted from whatever shape each slide is in (block
 * slide, layout-variant slide, or raw generator output) and poured into the
 * template's slide specs.
 */

import { v4 as uuid } from "uuid";
import type { Block, SlideSpec, SlideTemplate } from "./types";
import { isBlockSlide } from "./toDeck";

export interface SlideContent {
  title: string;
  subtitle: string;
  bullets: Array<{ label: string; body?: string }>;
  imageUrl?: string;
  imagePrompt?: string;
  quote?: string;
  author?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Extract
// ─────────────────────────────────────────────────────────────────────────────

function textOf(v: any): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v.text === "string") return v.text;
  return "";
}

/** Pulls content out of a slide regardless of which renderer produced it. */
export function extractContent(slide: any): SlideContent {
  if (isBlockSlide(slide)) {
    const spec: SlideSpec = slide.blockSpec;
    const heading: any = spec.blocks.find((b) => b.type === "heading");
    const list: any = spec.blocks.find((b) =>
      ["iconBullets", "iconGrid", "pillars", "checklist", "statCards", "processFlow"].includes(b.type)
    );
    const img: any = spec.blocks.find((b) => b.type === "image");

    return {
      title: textOf(heading?.title),
      subtitle: textOf(heading?.subtitle),
      bullets: (list?.items ?? []).map((it: any) => ({
        label: textOf(it.label ?? it.title ?? it.value ?? it.name),
        body: textOf(it.body),
      })),
      imageUrl: img?.url ?? spec.background?.url,
      imagePrompt: img?.prompt ?? spec.background?.prompt,
    };
  }

  // Layout-variant / generator slide. The active variant wins if present,
  // since that is what the user is actually looking at.
  const variant =
    slide.layouts && slide.layouts.length
      ? slide.layouts[slide.currentVariantIndex ?? 0] ?? slide
      : slide;

  const elements: any[] = variant.elements ?? slide.elements ?? [];
  const bullets = elements
    .filter((el) =>
      ["bullet_point", "text", "context"].includes(el?.element_type)
    )
    .map((el) => ({ label: textOf(el), body: undefined }))
    .filter((b) => b.label.trim().length > 0);

  const imageEl = elements.find((el) => el?.element_type === "image");

  return {
    title: textOf(variant.slide_title ?? slide.slide_title),
    subtitle: textOf(variant.subtitle ?? slide.subtitle),
    bullets,
    imageUrl:
      variant.image_url || slide.image_url || imageEl?.properties?.imageSrc || undefined,
    quote: textOf(slide.quote),
    author: textOf(slide.author),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Fill
// ─────────────────────────────────────────────────────────────────────────────

const LIST_TYPES = new Set([
  "iconBullets",
  "iconGrid",
  "pillars",
  "checklist",
  "statCards",
  "processFlow",
  "timeline",
  "roadmapPhases",
  "teamCards",
  "imageGrid",
]);

/**
 * Writes content into a spec, keeping the template's own styling, icons and
 * item count conventions. Surplus template items are dropped and surplus
 * content is truncated rather than overflowing the slide.
 */
function fillSpec(spec: SlideSpec, content: SlideContent): SlideSpec {
  const blocks: Block[] = spec.blocks.map((block) => {
    const b: any = block;

    if (b.type === "heading") {
      return {
        ...b,
        title: content.title ? { ...b.title, text: content.title } : b.title,
        subtitle:
          b.subtitle && content.subtitle
            ? { ...b.subtitle, text: content.subtitle }
            : b.subtitle,
      };
    }

    if (b.type === "quote" && content.quote) {
      return {
        ...b,
        quote: { ...b.quote, text: content.quote },
        author: b.author && content.author ? { ...b.author, text: content.author } : b.author,
      };
    }

    if (b.type === "paragraph" && content.subtitle) {
      return { ...b, body: { ...b.body, text: content.subtitle } };
    }

    if (LIST_TYPES.has(b.type) && content.bullets.length && Array.isArray(b.items)) {
      // Keep at most what the template was designed to hold — a layout built
      // for three cards does not survive eight.
      const n = Math.min(content.bullets.length, b.items.length);
      const items = b.items.slice(0, Math.max(n, 1)).map((item: any, i: number) => {
        const src = content.bullets[i];
        if (!src) return item;
        const next = { ...item };
        // Fill whichever label-ish field this item type uses.
        for (const key of ["label", "title", "name", "phase", "value"]) {
          if (next[key]?.text !== undefined) {
            next[key] = { ...next[key], text: src.label };
            break;
          }
        }
        if (next.body?.text !== undefined && src.body) {
          next.body = { ...next.body, text: src.body };
        }
        return next;
      });
      return { ...b, items };
    }

    if (b.type === "image" && (content.imageUrl || content.imagePrompt)) {
      return { ...b, url: content.imageUrl ?? b.url, prompt: content.imagePrompt ?? b.prompt };
    }

    return b;
  });

  const background =
    spec.background && content.imageUrl && !spec.background.url
      ? { ...spec.background, url: content.imageUrl }
      : spec.background;

  return { ...spec, blocks, background };
}

// ─────────────────────────────────────────────────────────────────────────────
// Apply
// ─────────────────────────────────────────────────────────────────────────────

/** Picks the template slide to use for position `i` of a deck of `total`. */
function pickSpec(template: SlideTemplate, i: number, total: number): SlideSpec {
  const specs = template.slides;
  const first = specs[0];
  const last = specs[specs.length - 1];

  if (i === 0) return first;
  if (i === total - 1 && total > 1) return last;

  // Cycle the middle (content) slides so a longer deck keeps varying layout
  // instead of repeating one.
  const middle = specs.slice(1, -1);
  if (!middle.length) return first;
  return middle[(i - 1) % middle.length];
}

export function applyTemplateToDeck(slides: any[], template: SlideTemplate): any[] {
  if (!slides.length) return slides;

  return slides.map((slide, i) => {
    const content = extractContent(slide);
    const spec = pickSpec(template, i, slides.length);
    const filled = fillSpec(structuredClone(spec), content);

    return {
      ...slide,
      // A re-skinned slide becomes a block slide; its old layout variants and
      // loose elements no longer describe what is on screen.
      blockSpec: { ...filled, id: `${filled.id}-${i}` },
      templateThemeId: template.theme.id,
      templateId: template.id,
      layout_type: `block:${filled.layout}`,
      layouts: undefined,
      currentVariantIndex: undefined,
      templateStyle: undefined,
      elements: [],
      slide_title: {
        ...(slide.slide_title ?? {}),
        konva_component: slide.slide_title?.konva_component ?? "Konva.Text",
        text: content.title || slide.slide_title?.text || template.name,
      },
      slide_id: slide.slide_id ?? `slide-${uuid()}`,
    };
  });
}
