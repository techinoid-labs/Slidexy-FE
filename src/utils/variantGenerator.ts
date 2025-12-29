// variantGenerator.ts - HTML-based variant system
// Generates variant metadata for HTML layout components
import { getSlideDimensions } from "./slideUtils";

// Define how many variants each layout type supports
const LAYOUT_VARIANT_COUNTS: Record<string, number> = {
  "cover-hero": 5,
  "content-right-image": 5,
  "content-left-image": 5,
  "content-split": 5,
  "comparison-slide": 3,
  "infographic-bullets": 5,
  "timeline-slide": 5,
  "quote-slide": 5,
  "conclusion": 5,
  "call-to-action": 5,
  "full-image-text-overlay": 5,
};

export const generateSlideVariants = (slide: any, selectedTheme: any) => {
  const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
  const layoutType = slide.layout_type || "content-right-image";
  const variantCount = LAYOUT_VARIANT_COUNTS[layoutType] || 5;

  if (!LAYOUT_VARIANT_COUNTS[layoutType]) {
    console.warn(`[variantGenerator] Unknown layout_type: "${layoutType}", defaulting to 5 variants`);
  }

  const colors = {
    primary: selectedTheme?.artPalette?.[0] || "#6c5ce7",
    secondary: selectedTheme?.artPalette?.[1] || "#00b894",
    accent: selectedTheme?.artPalette?.[2] || "#fdcb6e",
    background: selectedTheme?.backgroundColor || "#ffffff",
    surface: selectedTheme?.artPalette?.[3] || "#f5f5f5",
  };

  // Improved text color - use darker colors for better visibility
  const bgColor = selectedTheme?.backgroundColor || "#ffffff";
  const isLightBg = bgColor && (bgColor.toLowerCase().includes('fff') || bgColor.toLowerCase().includes('f7fafc') || bgColor.toLowerCase().includes('f5f5f5'));
  const textColor = selectedTheme?.primaryColor || (isLightBg ? "#0a0a0a" : "#ffffff");

  // Preserve user-added elements (images, text, bullets, quotes, etc.)
  const userElements = (slide.elements || []).filter((el: any) => {
    return (
      el.element_type === "image" ||
      el.element_type === "text" ||
      el.element_type === "bullet_point" ||
      el.element_type === "quote" ||
      el.element_type === "author" ||
      el.element_type === "context" ||
      (el.element_type === "shape" && el.shape_id && !el.shape_id.startsWith('auto-') && el.userAdded !== false)
    );
  });

  console.log(`[variantGenerator] Preserving ${userElements.length} user elements for "${layoutType}"`);

  // Update text colors for preserved elements
  const updatedElements = userElements.map((el: any) => {
    if ((el.element_type === "text" || el.element_type === "bullet_point" || el.element_type === "quote" || el.element_type === "author" || el.element_type === "context") && el.properties) {
      return { ...el, properties: { ...el.properties, fill: textColor } };
    }
    return el;
  });

  // Generate variant metadata - HTML components will handle their own rendering
  const variants = [];
  for (let i = 1; i <= variantCount; i++) {
    variants.push({
      name: `Layout ${i}`,
      layout_type: layoutType,
      variantNumber: i,
      // Deep clone objects to prevent Redux state mutation between variant references
      slide_title: structuredClone(slide.slide_title),
      subtitle: structuredClone(slide.subtitle),
      elements: structuredClone(updatedElements),
      image_url: slide.image_url,
      background: { type: "solid", color: colors.background },
      slide_id: slide.slide_id,
    });
  }

  return variants;
};