// variantGenerator.ts - FIXED FILTER (do NOT remove quote/author/context)
import { createCoverSlide } from "./layouts/coverSlide";
import { createContentRightImageSlide } from "./layouts/contentRightImageSlide";
import { createContentLeftImageSlide } from "./layouts/contentLeftImageSlide";
import { createSplitContentSlide } from "./layouts/splitContentSlide";
import { createComparisonSlide } from "./layouts/comparisonSlide";
import { createInfographicBulletsSlide } from "./layouts/infographicBulletsSlide";
import { createTimelineSlide } from "./layouts/timelineSlide";
import { createQuoteSlide } from "./layouts/quoteSlide";
import { createConclusionSlide } from "./layouts/conclusionSlide";
import { createFullImageTextOverlaySlide } from "./layouts/fullImageTextOverlaySlide";
import { getSlideDimensions } from "./slideUtils";

const LAYOUT_VARIANT_MAP: Record<string, any> = {
  "cover-hero": createCoverSlide,
  "content-right-image": createContentRightImageSlide,
  "content-left-image": createContentLeftImageSlide,
  "content-split": createSplitContentSlide,
  "comparison-slide": createComparisonSlide,
  "infographic-bullets": createInfographicBulletsSlide,
  "timeline-slide": createTimelineSlide,
  "quote-slide": createQuoteSlide,
  "conclusion": createConclusionSlide,
  "call-to-action": createConclusionSlide,
  "full-image-text-overlay": createFullImageTextOverlaySlide,
};

export const generateSlideVariants = (slide: any, selectedTheme: any) => {
  const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
  const layoutType = slide.layout_type || "content-right-image";
  const variantCreator = LAYOUT_VARIANT_MAP[layoutType];

  if (!variantCreator) {
    console.warn(`[variantGenerator] No variant creator found for layout_type: "${layoutType}"`);
    return [];
  }

  const colors = {
    primary: selectedTheme?.artPalette?.[0] || "#6c5ce7",
    secondary: selectedTheme?.artPalette?.[1] || "#00b894",
    accent: selectedTheme?.artPalette?.[2] || "#fdcb6e",
    background: selectedTheme?.backgroundColor || "#ffffff",
    surface: selectedTheme?.artPalette?.[3] || "#f5f5f5",
  };

  const textColor = selectedTheme?.primaryColor || "#000000";

  // FIXED: INCLUDE quote, author, context
  const userElements = (slide.elements || []).filter((el: any) => {
    return (
      el.element_type === "image" ||
      el.element_type === "text" ||
      el.element_type === "bullet_point" ||
      el.element_type === "quote" ||      // ← ADDED
      el.element_type === "author" ||     // ← ADDED
      el.element_type === "context" ||    // ← ADDED
      (el.element_type === "shape" && el.shape_id && !el.shape_id.startsWith('auto-') && el.userAdded !== false)
    );
  });

  console.log(`[variantGenerator] Preserving ${userElements.length} user elements (incl. quote/author)`);

  let tempSlide = {
    ...slide,
    elements: userElements,
  };

  // Update text colors
  tempSlide.elements = tempSlide.elements.map((el: any) => {
    if ((el.element_type === "text" || el.element_type === "bullet_point" || el.element_type === "quote" || el.element_type === "author" || el.element_type === "context") && el.properties) {
      return { ...el, properties: { ...el.properties, fill: textColor } };
    }
    return el;
  });

  const variants = [];
  for (let i = 1; i <= 5; i++) {
    const variantFn = variantCreator[`variant${i}`];
    if (variantFn) {
      try {
        const variantSlide = variantFn(tempSlide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT);
        variants.push({ name: `Layout ${i}`, ...variantSlide });
      } catch (error) {
        console.error(`[variantGenerator] Error creating variant ${i}:`, error);
      }
    }
  }

  // Mark auto shapes
  variants.forEach(variant => {
    variant.elements?.forEach((el: any) => {
      if (el.element_type === "shape" && el.shape_id?.startsWith('auto-')) {
        el.userAdded = false;
      }
    });
  });

  console.log(`[variantGenerator] Generated ${variants.length} variants for "${layoutType}"`);
  return variants;
};