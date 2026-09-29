/**
 * Bridges the block-template system into the existing deck/editor data model.
 *
 * A deck slide gains two fields:
 *   `blockSpec`      the SlideSpec to render
 *   `templateThemeId` which theme to render it with
 *
 * Everything else about the slide (slide_id, ordering, user-added elements)
 * keeps working as before, so the carousel, export and persistence paths did
 * not need to change.
 */

import { v4 as uuid } from "uuid";
import { collectSpecText } from "./applyEdit";
import { THEMES } from "./themes";
import type { SlideSpec, SlideTemplate, TemplateTheme } from "./types";

export interface BlockDeckSlide {
  slide_id: string;
  /** Present iff this slide is block-rendered. */
  blockSpec: SlideSpec;
  templateThemeId: string;
  templateId: string;
  /** Kept so existing panels, the carousel and search still have a title. */
  slide_title: { text: string; properties?: Record<string, unknown> };
  layout_type: string;
  elements: unknown[];
}

export function templateToDeck(template: SlideTemplate): BlockDeckSlide[] {
  return template.slides.map((spec) => {
    const heading = spec.blocks.find((b) => b.type === "heading") as
      | { title?: { text: string } }
      | undefined;

    return {
      slide_id: `slide-${uuid()}`,
      blockSpec: structuredClone(spec),
      templateThemeId: template.theme.id,
      templateId: template.id,
      slide_title: { text: heading?.title?.text ?? spec.name },
      // Kept for compatibility with code that switches on layout_type; the
      // block renderer is chosen by the presence of `blockSpec`, not this.
      layout_type: `block:${spec.layout}`,
      elements: [],
    };
  });
}

export function isBlockSlide(slide: any): slide is BlockDeckSlide {
  return !!slide?.blockSpec?.blocks;
}

export function themeForSlide(slide: any, fallback: TemplateTheme): TemplateTheme {
  return THEMES[slide?.templateThemeId] ?? fallback;
}

/** Plain text of a slide, for thumbnails, search and accessibility. */
export function blockSlideText(slide: any): string {
  return isBlockSlide(slide) ? collectSpecText(slide.blockSpec).join(" ") : "";
}
