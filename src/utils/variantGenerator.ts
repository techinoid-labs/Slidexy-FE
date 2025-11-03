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

// Map layout types to variant creators
const LAYOUT_VARIANT_MAP: Record<string, any> = {
  "cover-hero": createCoverSlide,
  "content-right-image": createContentRightImageSlide,
  "content-left-image": createContentLeftImageSlide,
  "content-split": createSplitContentSlide,
  "comparison-slide": createComparisonSlide,
  "infographic-bullets": createInfographicBulletsSlide,
  "timeline-slide": createTimelineSlide,
  "quote-slide": createQuoteSlide,
  "conclusion": createConclusionSlide,  // ✅ Added the correct key!
  "call-to-action": createConclusionSlide,  // Keep this for backwards compatibility
  "full-image-text-overlay": createFullImageTextOverlaySlide,
};

export const generateSlideVariants = (slide: any, selectedTheme: any) => {
  const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
  const layoutType = slide.layout_type || "content-right-image";
  const variantCreator = LAYOUT_VARIANT_MAP[layoutType];

  // ✅ Add debugging to catch missing layout types
  if (!variantCreator) {
    console.warn(`[variantGenerator] No variant creator found for layout_type: "${layoutType}"`);
    console.warn('[variantGenerator] Available layout types:', Object.keys(LAYOUT_VARIANT_MAP));
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

  // NEW: Layout-aware image adjustments (scale down/hide/reposition for data-heavy slides)
  let adjustedImagePlaceholder = slide.image_placeholder; // Default: keep backend's
  let adjustedImageUrl = slide.image_url; // Optional: swap to a smaller/alt image if needed

  switch (layoutType) {
    case "infographic-bullets":
      // Shrink image to bottom-right corner for metrics focus; or set width/height to 0 to hide
      adjustedImagePlaceholder = {
        x: SLIDE_WIDTH - 200, // e.g., 760 on 960px slide
        y: SLIDE_HEIGHT - 150,
        width: 180,
        height: 120,
      };
      // Optional: Use a metrics-themed alt image (fetch from backend or generate)
      // adjustedImageUrl = slide.image_url.replace('.webp', '-metrics-small.webp');
      break;
    case "quote-slide":
      // Hide image completely for clean quote focus
      adjustedImagePlaceholder = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
      adjustedImageUrl = null;
      break;
    case "conclusion":
    case "content-split":
      // Slight shrink for balance
      adjustedImagePlaceholder = {
        ...slide.image_placeholder,
        width: 300,
        height: 350,
      };
      break;
    // Add more cases as needed (e.g., "timeline-slide": vertical strip)
    default:
      // Image-heavy layouts: keep full size
      break;
  }

  // Exclude background to force fresh theme-based override in variants
  const { background: _, ...tempSlideBase } = slide;
  let tempSlide = {
    ...tempSlideBase,
    image_url: adjustedImageUrl,
    image_placeholder: adjustedImagePlaceholder, // ✅ Use adjusted!
    elements: slide.elements || [], // Keep all elements including images
  };

  // Update fills for all text-based non-shapes to ensure theme consistency
  tempSlide.elements = tempSlide.elements.map((el: any) => {
    if ((el.element_type === "text" || el.element_type === "bullet_point") && el.properties) {
      return {
        ...el,
        properties: {
          ...el.properties,
          fill: textColor,
        },
      };
    }
    return el;
  });

  // Generate all variants (up to 5)
  const variants = [];
  for (let i = 1; i <= 5; i++) {
    const variantFn = variantCreator[`variant${i}`];
    if (variantFn) {
      try {
        const variantSlide = variantFn(tempSlide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT);
        variants.push({
          name: `Layout ${i}`,
          ...variantSlide,
        });
      } catch (error) {
        console.error(`[variantGenerator] Error creating variant ${i} for layout ${layoutType}:`, error);
      }
    }
  }

  console.log(`[variantGenerator] Generated ${variants.length} variants for layout "${layoutType}" with adjusted image:`, adjustedImagePlaceholder);
  return variants;
};