"use client";
import React, { useRef, useEffect } from "react";
import type { BackendSlide } from "../../text-to-template/types/presentation";
import { createModernTemplate }    from "../../text-to-template/templates/modernTemplate";
import { createCorporateTemplate } from "../../text-to-template/templates/corporateTemplate";
import { createCreativeTemplate }  from "../../text-to-template/templates/creativeTemplate";
import { createBoldTemplate }      from "../../text-to-template/templates/boldTemplate";
import { createMinimalTemplate }   from "../../text-to-template/templates/minimalTemplate";
import { createVyntraTemplate }    from "../../text-to-template/templates/vyntraTemplate";
import { createCivoraTemplate }    from "../../text-to-template/templates/civoraTemplate";
import { createFluxeraTemplate }   from "../../text-to-template/templates/fluxeraTemplate";
import { createLinearTemplate }    from "../../text-to-template/templates/linearTemplate";
import { createRetroTemplate }     from "../../text-to-template/templates/retroTemplate";
import { createPitchDeckTemplate } from "../../text-to-template/templates/pitchDeckTemplate";
import { createDarkTemplate }     from "../../text-to-template/templates/darkTemplate";
import { createVibrantTemplate }  from "../../text-to-template/templates/vibrantTemplate";
import { createNeonTemplate }     from "../../text-to-template/templates/neonTemplate";
import { createElevateTemplate }  from "../../text-to-template/templates/elevateTemplate";
import { createSunriseTemplate }  from "../../text-to-template/templates/sunriseTemplate";

/*
 * Template registry — maps templateStyle id → generator function.
 * Each generator receives (BackendSlide, slideIndex) and returns a Slide with htmlTemplate.
 */
export const TEMPLATE_REGISTRY: Record<
  string,
  (slide: BackendSlide, index: number) => { htmlTemplate?: string }
> = {
  modern:    createModernTemplate,
  corporate: createCorporateTemplate,
  creative:  createCreativeTemplate,
  bold:      createBoldTemplate,
  minimal:   createMinimalTemplate,
  Vyntra:    createVyntraTemplate,
  civora:    createCivoraTemplate,
  fluxera:   createFluxeraTemplate,
  linear:    createLinearTemplate,
  retro:     createRetroTemplate,
  pitchDeck: createPitchDeckTemplate,
  dark:      createDarkTemplate,
  vibrant:   createVibrantTemplate,
  neon:      createNeonTemplate,
  elevate:   createElevateTemplate,
  sunrise:   createSunriseTemplate,
};

export const TEMPLATE_META: { id: string; name: string; accent: string; bg: string }[] = [
  { id: "modern",    name: "Modern",     accent: "#00C4B4", bg: "#F7FAFC" },
  { id: "corporate", name: "Corporate",  accent: "#114B5F", bg: "#F9F7F3" },
  { id: "creative",  name: "Creative",   accent: "#F43F5E", bg: "#FFF1F2" },
  { id: "bold",      name: "Bold",       accent: "#14B8A6", bg: "#F9FAFB" },
  { id: "minimal",   name: "Minimal",    accent: "#4C1D95", bg: "#FEFCE8" },
  { id: "Vyntra",    name: "Vyntra",     accent: "#6366F1", bg: "#0F172A" },
  { id: "civora",    name: "Civora",     accent: "#FFD23F", bg: "#114B5F" },
  { id: "fluxera",   name: "Fluxera",    accent: "#F97316", bg: "#0C0A09" },
  { id: "linear",    name: "Linear",     accent: "#3B82F6", bg: "#111827" },
  { id: "retro",     name: "Retro",      accent: "#EF4444", bg: "#FEF3C7" },
  { id: "pitchDeck", name: "Pitch Deck", accent: "#8B5CF6", bg: "#0D0D0D" },
  { id: "dark",      name: "Dark Mode",  accent: "#63B3ED", bg: "#0B0F1A" },
  { id: "vibrant",   name: "Vibrant",    accent: "#FF5733", bg: "#FFFBF7" },
  { id: "neon",      name: "Neon",       accent: "#00F5FF", bg: "#050508" },
  { id: "elevate",   name: "Elevate",    accent: "#B8972A", bg: "#FAFAF8" },
  { id: "sunrise",   name: "Sunrise",    accent: "#FF6B6B", bg: "#FFFDF9" },
];

/*
 * Convert an editor slide object to the BackendSlide format
 * expected by all template generator functions.
 */
function editorSlideToBackend(slide: any): BackendSlide {
  const textElements = (slide.elements || []).filter(
    (el: any) =>
      el.element_type === "bullet_point" ||
      el.element_type === "text"
  );

  return {
    slide_id: slide.slide_id || "slide",
    slide_title: slide.slide_title || { text: "" },
    image_url: slide.image_url || "",
    textBlock: {
      elements: textElements.map((el: any) => ({
        id: el.id || "",
        text: el.text || "",
        properties: el.properties || {},
      })),
    },
    titleBlock: {
      elements: [{ text: slide.slide_title?.text || "" }],
    },
    imageBlock: slide.image_url
      ? { elements: [{ properties: { imageSrc: slide.image_url } }] }
      : undefined,
  };
}

interface TemplateHTMLSlideProps {
  slide: any;
  templateStyle: string;
  slideIndex: number;
  isEditing?: boolean;
  onSlideUpdate?: (updated: any) => void;
}

/*
 * Renders any registered template style as fully editable HTML inside the editor.
 * When isEditing=true, finds all text-bearing nodes and attaches contenteditable,
 * then maps changes back to the slide data model on blur.
 */
export const TemplateHTMLSlide: React.FC<TemplateHTMLSlideProps> = ({
  slide,
  templateStyle,
  slideIndex,
  isEditing = false,
  onSlideUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const templateFn = TEMPLATE_REGISTRY[templateStyle];
  if (!templateFn) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f0f0",
          fontFamily: "sans-serif",
          color: "#666",
        }}
      >
        Unknown template: {templateStyle}
      </div>
    );
  }

  const backendSlide = editorSlideToBackend(slide);
  const generated = templateFn(backendSlide, slideIndex);

  /*
   * Prepend a style tag so images inside flex/grid containers always fill
   * their slot with cover-fit rather than stretching.
   */
  const imageFixStyle = `<style>
    ._sx-wrap img {
      display: block;
      object-fit: cover !important;
      max-width: 100%;
    }
    ._sx-wrap [data-slidexy-field] {
      cursor: text;
      border-radius: 3px;
      outline: none;
      transition: box-shadow 0.15s ease;
    }
    ._sx-wrap [data-slidexy-field]:focus {
      box-shadow: 0 0 0 2px rgba(99,102,241,0.5) !important;
    }
  </style>`;

  const htmlTemplate = imageFixStyle + `<div class="_sx-wrap" style="width:100%;height:100%;position:relative;overflow:hidden;">${generated.htmlTemplate || ""}</div>`;

  /*
   * After the HTML renders, mark ALL meaningful text elements as contenteditable.
   * Strategy:
   *  1. First heading (h1-h4) with >5 chars of text  → "title"
   *  2. All subsequent headings                        → "heading-N"
   *  3. All <p>, <li> with >3 chars of text            → "text-N"
   *  4. Exclude elements that contain SVG/IMG children (icon containers)
   *  5. On blur, map back: title → slide_title.text, text-N → elements[N].text
   */
  useEffect(() => {
    if (!isEditing || !containerRef.current) return;
    const container = containerRef.current;

    // Helpers
    const hasMediaChild = (el: Element) =>
      !!el.querySelector("svg, img, canvas, video");

    const trimmedText = (el: Element) =>
      (el.textContent || "").replace(/\s+/g, " ").trim();

    // --- Collect editable elements ---
    let titleAssigned = false;
    let headingIdx = 0;
    let textIdx = 0;

    const allHeadings = Array.from(
      container.querySelectorAll("h1, h2, h3, h4, h5, h6")
    );
    const allParas = Array.from(
      container.querySelectorAll("p, li, span")
    );

    // Mark headings
    allHeadings.forEach((el) => {
      const text = trimmedText(el);
      if (text.length < 3 || hasMediaChild(el)) return;
      // Skip tiny label-like text (uppercase all-caps, < 10 chars → likely a badge)
      if (text.length < 10 && text === text.toUpperCase()) return;

      if (!titleAssigned && text.length > 5) {
        makeEditable(el, "title");
        titleAssigned = true;
      } else {
        makeEditable(el, `heading-${headingIdx++}`);
      }
    });

    // Mark paragraphs / list items
    allParas.forEach((el) => {
      // Skip nested inside an already-editable heading
      if (el.closest("[data-slidexy-field]")) return;
      // Skip if no meaningful text
      const text = trimmedText(el);
      if (text.length < 4) return;
      // Skip SVG/icon containers
      if (hasMediaChild(el)) return;
      // Skip pure number/stat displays (1-2 chars)
      if (/^\d{1,2}%?$/.test(text)) return;
      // Skip if the span is inside a p that's already marked
      if ((el.tagName === "SPAN") && el.closest("p[data-slidexy-field]")) return;

      makeEditable(el, `text-${textIdx++}`);
    });

    // --- Blur handler: maps changes back to slide data ---
    const handleBlur = (e: Event) => {
      const target = e.target as HTMLElement;
      const field = target.getAttribute("data-slidexy-field");
      if (!field) return;

      const newText = target.innerText?.trim() || "";
      const updatedSlide = structuredClone(slide);

      if (field === "title") {
        if (updatedSlide.slide_title) {
          updatedSlide.slide_title.text = newText;
        }
        const vi = updatedSlide.currentVariantIndex ?? 0;
        if (updatedSlide.layouts?.[vi]?.slide_title) {
          updatedSlide.layouts[vi].slide_title.text = newText;
        }
      } else if (field.startsWith("text-")) {
        const idx = parseInt(field.replace("text-", ""), 10);
        const textEls = (updatedSlide.elements || []).filter(
          (el: any) =>
            el.element_type === "bullet_point" || el.element_type === "text"
        );
        if (textEls[idx]) {
          textEls[idx].text = newText;
          const vi = updatedSlide.currentVariantIndex ?? 0;
          const variantTextEls = (
            updatedSlide.layouts?.[vi]?.elements || []
          ).filter(
            (el: any) =>
              el.element_type === "bullet_point" || el.element_type === "text"
          );
          if (variantTextEls[idx]) variantTextEls[idx].text = newText;
        }
      } else if (field.startsWith("heading-")) {
        // Extra headings: update subtitle or first available text slot
        const idx = parseInt(field.replace("heading-", ""), 10);
        if (idx === 0 && updatedSlide.subtitle) {
          updatedSlide.subtitle = newText;
        }
      }

      onSlideUpdate?.(updatedSlide);
    };

    container.addEventListener("blur", handleBlur, true);
    return () => {
      container.removeEventListener("blur", handleBlur, true);
    };
  }, [isEditing, slide.slide_id, templateStyle]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}
      dangerouslySetInnerHTML={{ __html: htmlTemplate }}
    />
  );
};

/* ── helpers ──────────────────────────────────────────────────────────────── */

function makeEditable(el: Element, field: string) {
  if (el.getAttribute("data-slidexy-field")) return; // already wired
  el.setAttribute("contenteditable", "true");
  el.setAttribute("data-slidexy-field", field);
  el.setAttribute("spellcheck", "false");
  (el as HTMLElement).style.userSelect = "text";
}

export default TemplateHTMLSlide;
