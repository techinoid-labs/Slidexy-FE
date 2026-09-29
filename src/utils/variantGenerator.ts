// variantGenerator.ts
// Generates variant metadata for HTML AND Konva renderers.
// Each variant now carries `konvaLayout` — absolute Konva positions for
// title, subtitle, bullets and the main slide image.
import { getSlideDimensions } from "./slideUtils";

// Canvas dimensions (must match KonvaTemplateLayer & SlideEditor)
const W = 960;
const H = 540;

// ─── Konva layout position tables ────────────────────────────────────────────
// [variantIndex 0-based] → { title, subtitle, bullet, image }
type KonvaLayout = {
  title:    { x: number; y: number; width: number; fontSize: number; align?: string; fontWeight?: string; fill?: string };
  subtitle: { x: number; y: number; width: number; fontSize: number; align?: string; fill?: string };
  bullet:   { startX: number; startY: number; width: number; lineGap: number; fontSize: number; align?: string; fill?: string };
  image:    { x: number; y: number; width: number; height: number };
};

const COVER_HERO_LAYOUTS: KonvaLayout[] = [
  // V1 Glass Overlay — left content, right image
  { title: {x:40,y:100,width:440,fontSize:44,align:"left",fontWeight:"800"},  subtitle:{x:40,y:200,width:440,fontSize:16}, bullet:{startX:40,startY:240,width:440,lineGap:38,fontSize:14}, image:{x:520,y:0,width:440,height:H} },
  // V2 Modern Split — left gradient, right image
  { title: {x:36,y:90,width:420,fontSize:42,align:"left",fontWeight:"700",fill:"#ffffff"}, subtitle:{x:36,y:182,width:420,fontSize:16,fill:"rgba(255,255,255,0.85)"}, bullet:{startX:36,startY:218,width:420,lineGap:38,fontSize:14,fill:"rgba(255,255,255,0.8)"}, image:{x:490,y:20,width:450,height:H-40} },
  // V3 Diagonal Geometric
  { title: {x:36,y:90,width:420,fontSize:44,align:"left",fontWeight:"800"},  subtitle:{x:36,y:190,width:400,fontSize:16}, bullet:{startX:36,startY:228,width:400,lineGap:37,fontSize:14}, image:{x:440,y:0,width:520,height:H} },
  // V4 Card Stack — centered
  { title: {x:100,y:60,width:760,fontSize:48,align:"center",fontWeight:"800"},  subtitle:{x:100,y:160,width:760,fontSize:18,align:"center"}, bullet:{startX:100,startY:360,width:760,lineGap:30,fontSize:13,align:"center"}, image:{x:450,y:30,width:490,height:265} },
  // V5 Professional Sidebar
  { title: {x:120,y:100,width:760,fontSize:40,align:"left",fontWeight:"700"}, subtitle:{x:120,y:195,width:760,fontSize:16}, bullet:{startX:120,startY:235,width:760,lineGap:38,fontSize:14}, image:{x:110,y:140,width:400,height:280} },
  // V6 Bold Cinematic — dark, full bleed
  { title: {x:60,y:150,width:840,fontSize:54,align:"center",fontWeight:"900",fill:"#ffffff"}, subtitle:{x:60,y:255,width:840,fontSize:18,align:"center",fill:"rgba(255,255,255,0.8)"}, bullet:{startX:200,startY:400,width:560,lineGap:28,fontSize:13,align:"center",fill:"rgba(255,255,255,0.7)"}, image:{x:0,y:0,width:W,height:H} },
  // V7 Magazine Bold Split — left accent
  { title: {x:30,y:90,width:410,fontSize:46,align:"left",fontWeight:"800",fill:"#ffffff"}, subtitle:{x:30,y:200,width:410,fontSize:16,fill:"rgba(255,255,255,0.85)"}, bullet:{startX:30,startY:238,width:410,lineGap:38,fontSize:14,fill:"rgba(255,255,255,0.8)"}, image:{x:470,y:0,width:490,height:H} },
  // V8 Glassmorphism Dark — center card
  { title: {x:155,y:100,width:650,fontSize:40,align:"center",fontWeight:"700",fill:"#ffffff"}, subtitle:{x:155,y:196,width:650,fontSize:16,align:"center",fill:"rgba(255,255,255,0.75)"}, bullet:{startX:155,startY:238,width:650,lineGap:38,fontSize:14,align:"center",fill:"rgba(255,255,255,0.7)"}, image:{x:520,y:90,width:300,height:270} },
  // V9 Clean Executive
  { title: {x:60,y:80,width:540,fontSize:42,align:"left",fontWeight:"700"},  subtitle:{x:60,y:178,width:540,fontSize:16}, bullet:{startX:60,startY:218,width:540,lineGap:38,fontSize:14}, image:{x:630,y:60,width:300,height:380} },
  // V10 Dashboard App-UI
  { title: {x:20,y:68,width:540,fontSize:34,align:"left",fontWeight:"700"}, subtitle:{x:20,y:148,width:540,fontSize:14}, bullet:{startX:20,startY:190,width:540,lineGap:34,fontSize:13}, image:{x:10,y:58,width:640,height:H-68} },
];

const CONTENT_RIGHT_LAYOUTS: KonvaLayout[] = [
  // V1 Clean Card
  { title: {x:40,y:40,width:478,fontSize:34,align:"left",fontWeight:"700"},  subtitle:{x:40,y:110,width:478,fontSize:15}, bullet:{startX:40,startY:142,width:478,lineGap:46,fontSize:13}, image:{x:545,y:25,width:400,height:H-50} },
  // V2 Floating Card
  { title: {x:36,y:50,width:470,fontSize:34,align:"left",fontWeight:"700"},  subtitle:{x:36,y:118,width:470,fontSize:15}, bullet:{startX:36,startY:152,width:470,lineGap:46,fontSize:13}, image:{x:530,y:20,width:420,height:H-40} },
  // V3 Vertical Accent
  { title: {x:55,y:40,width:452,fontSize:34,align:"left",fontWeight:"700"},  subtitle:{x:55,y:108,width:452,fontSize:15}, bullet:{startX:55,startY:142,width:452,lineGap:46,fontSize:13}, image:{x:535,y:20,width:410,height:H-40} },
  // V4 Asymmetric
  { title: {x:40,y:50,width:440,fontSize:34,align:"left",fontWeight:"700"},  subtitle:{x:40,y:118,width:440,fontSize:15}, bullet:{startX:40,startY:152,width:440,lineGap:46,fontSize:13}, image:{x:480,y:0,width:480,height:H} },
  // V5 Full Bleed — text over dark overlay
  { title: {x:36,y:50,width:460,fontSize:34,align:"left",fontWeight:"700",fill:"#ffffff"}, subtitle:{x:36,y:118,width:460,fontSize:15,fill:"rgba(255,255,255,0.85)"}, bullet:{startX:36,startY:152,width:460,lineGap:46,fontSize:13,fill:"rgba(255,255,255,0.8)"}, image:{x:0,y:0,width:W,height:H} },
  // V6 Dark Mode — white text
  { title: {x:40,y:50,width:470,fontSize:34,align:"left",fontWeight:"700",fill:"#ffffff"}, subtitle:{x:40,y:118,width:470,fontSize:15,fill:"rgba(255,255,255,0.8)"}, bullet:{startX:40,startY:152,width:470,lineGap:46,fontSize:13,fill:"rgba(255,255,255,0.75)"}, image:{x:548,y:25,width:400,height:H-50} },
  // V7 Bento Grid
  { title: {x:20,y:20,width:515,fontSize:32,align:"left",fontWeight:"700"},  subtitle:{x:20,y:84,width:515,fontSize:14}, bullet:{startX:20,startY:305,width:515,lineGap:58,fontSize:12}, image:{x:548,y:10,width:400,height:H/2-15} },
  // V8 Cinematic Strip — image top, content bottom
  { title: {x:40,y:226,width:860,fontSize:30,align:"left",fontWeight:"700"}, subtitle:{x:40,y:272,width:860,fontSize:14}, bullet:{startX:40,startY:305,width:860,lineGap:36,fontSize:12}, image:{x:0,y:0,width:W,height:210} },
  // V9 Timeline Steps
  { title: {x:50,y:30,width:440,fontSize:32,align:"left",fontWeight:"700"},  subtitle:{x:50,y:92,width:440,fontSize:14}, bullet:{startX:52,startY:130,width:400,lineGap:56,fontSize:13}, image:{x:540,y:20,width:400,height:H-40} },
  // V10 Bold Typographic
  { title: {x:55,y:40,width:452,fontSize:34,align:"left",fontWeight:"800"},  subtitle:{x:55,y:110,width:452,fontSize:15}, bullet:{startX:55,startY:146,width:452,lineGap:56,fontSize:13}, image:{x:538,y:20,width:410,height:H-40} },
];

// Fallback layout for all other layout types (5 positions)
const GENERIC_LAYOUTS: KonvaLayout[] = [
  { title:{x:40,y:40,width:520,fontSize:32,fontWeight:"700"},  subtitle:{x:40,y:108,width:520,fontSize:15}, bullet:{startX:40,startY:142,width:520,lineGap:44,fontSize:13}, image:{x:W/2+20,y:20,width:W/2-40,height:H-40} },
  { title:{x:20,y:40,width:520,fontSize:32,fontWeight:"700"},  subtitle:{x:20,y:108,width:520,fontSize:15}, bullet:{startX:20,startY:142,width:520,lineGap:44,fontSize:13}, image:{x:W-370,y:30,width:350,height:H-60} },
  { title:{x:40,y:40,width:460,fontSize:32,fontWeight:"700",fill:"#ffffff"},  subtitle:{x:40,y:108,width:460,fontSize:15,fill:"rgba(255,255,255,0.85)"}, bullet:{startX:40,startY:142,width:460,lineGap:44,fontSize:13,fill:"rgba(255,255,255,0.8)"}, image:{x:0,y:0,width:W,height:H} },
  { title:{x:40,y:40,width:520,fontSize:32,fontWeight:"700",fill:"#ffffff"},  subtitle:{x:40,y:108,width:520,fontSize:15,fill:"rgba(255,255,255,0.8)"}, bullet:{startX:40,startY:142,width:520,lineGap:44,fontSize:13,fill:"rgba(255,255,255,0.75)"}, image:{x:W-420,y:20,width:400,height:H-40} },
  { title:{x:40,y:40,width:420,fontSize:32,fontWeight:"700",fill:"#ffffff"},  subtitle:{x:40,y:108,width:420,fontSize:15,fill:"rgba(255,255,255,0.85)"}, bullet:{startX:40,startY:142,width:420,lineGap:44,fontSize:13,fill:"rgba(255,255,255,0.8)"}, image:{x:490,y:0,width:470,height:H} },
];

function getKonvaLayout(layoutType: string, variantNumber: number): KonvaLayout {
  const idx = variantNumber - 1;
  if (layoutType === "cover-hero") {
    return COVER_HERO_LAYOUTS[idx] ?? COVER_HERO_LAYOUTS[0];
  }
  if (layoutType === "content-right-image") {
    return CONTENT_RIGHT_LAYOUTS[idx] ?? CONTENT_RIGHT_LAYOUTS[0];
  }
  return GENERIC_LAYOUTS[idx % GENERIC_LAYOUTS.length];
}

// Define how many variants each layout type supports
const LAYOUT_VARIANT_COUNTS: Record<string, number> = {
  "cover-hero": 10,
  "content-right-image": 10,
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

  // Generate variant metadata — HTML components handle CSS rendering,
  // konvaLayout provides absolute positions for the Konva canvas renderer.
  const variants = [];
  for (let i = 1; i <= variantCount; i++) {
    const kl = getKonvaLayout(layoutType, i);

    const variant: any = {
      name: `Layout ${i}`,
      layout_type: layoutType,
      variantNumber: i,
      konvaLayout: kl,       // ← Konva absolute positions
      // Deep clone objects to prevent Redux state mutation between variant references
      slide_title: structuredClone(slide.slide_title),
      subtitle: structuredClone(slide.subtitle),
      elements: structuredClone(updatedElements),
      image_url: slide.image_url,
      background: { type: "solid", color: colors.background },
      slide_id: slide.slide_id,
    };

    // Apply konvaLayout positions to slide_title.properties (for AnimatedKonvaText)
    if (variant.slide_title) {
      variant.slide_title = {
        ...variant.slide_title,
        properties: {
          ...variant.slide_title.properties,
          x: kl.title.x,
          y: kl.title.y,
          width: kl.title.width,
          fontSize: kl.title.fontSize,
          align: kl.title.align || "left",
          fontWeight: kl.title.fontWeight || "700",
          ...(kl.title.fill ? { fill: kl.title.fill } : {}),
        },
      };
    }

    // Apply konvaLayout positions to subtitle.properties
    if (variant.subtitle) {
      variant.subtitle = {
        ...variant.subtitle,
        properties: {
          ...variant.subtitle.properties,
          x: kl.subtitle.x,
          y: kl.subtitle.y,
          width: kl.subtitle.width,
          fontSize: kl.subtitle.fontSize,
          align: kl.subtitle.align || "left",
          ...(kl.subtitle.fill ? { fill: kl.subtitle.fill } : {}),
        },
      };
    }

    // Apply konvaLayout positions to bullet/text elements sequentially
    if (variant.elements && variant.elements.length > 0) {
      let bulletCount = 0;
      variant.elements = variant.elements.map((el: any) => {
        if (
          el.element_type === "bullet_point" ||
          el.element_type === "text"
        ) {
          const updatedEl = {
            ...el,
            properties: {
              ...el.properties,
              x: kl.bullet.startX,
              y: kl.bullet.startY + bulletCount * kl.bullet.lineGap,
              width: kl.bullet.width,
              fontSize: kl.bullet.fontSize,
              align: kl.bullet.align || "left",
              ...(kl.bullet.fill ? { fill: kl.bullet.fill } : {}),
            },
          };
          bulletCount++;
          return updatedEl;
        }
        return el;
      });
    }

    // ✅ Preserve quote/author/context for quote slides
    if (layoutType === 'quote-slide') {
      variant.quote = slide.quote || null;
      variant.author = slide.author || null;
      variant.context = slide.context || null;
    }

    variants.push(variant);
  }

  return variants;
};