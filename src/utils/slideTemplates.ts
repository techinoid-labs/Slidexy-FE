// utils/slideTemplates.ts
import { v4 as uuidv4 } from "uuid";

// ============= UTILITY FUNCTIONS =============

const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = normalizeHex(hex);
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const normalizeHex = (hex: string): string => {
  if (!hex || typeof hex !== 'string') return "#2c3e50";
  hex = hex.trim().toLowerCase();
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length !== 6 || !/^[0-9a-f]{6}$/.test(hex)) {
    return "#2c3e50";
  }
  return `#${hex}`;
};

const generateThemeColors = (artPalette: string[]) => {
  const primary = normalizeHex(artPalette[0] || "#1e293b");
  const secondary = normalizeHex(artPalette[1] || "#3b82f6");
  const accent = normalizeHex(artPalette[2] || "#f59e0b");
  const light = normalizeHex(artPalette[3] || "#f8fafc");
  const extra = artPalette[4] ? normalizeHex(artPalette[4]) : "#ffffff";

  return {
    primary,
    secondary,
    accent,
    light,
    extra,
    background: extra || "#f1f5f9",
    surface: "#ffffff",
    text: "#000000",
    textLight: "#334155",
    gradientStart: hexToRgba(primary, 0.8),
    gradientMid: hexToRgba(secondary, 0.6),
    gradientEnd: hexToRgba(accent, 0.4),
  };
};

const getContrastingTextColor = (bgColor: string): string => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace('#', ''));
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 1;
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const bgLum = getLuminance(bgColor || '#ffffff');
  return bgLum > 0.5 ? '#000000' : '#ffffff';
};

// ============= IMAGE GALLERY SYSTEM =============

const createImageGallery = (
  images: string[],
  x: number,
  y: number,
  totalWidth: number,
  colors: any,
  layout: 'grid' | 'floating' | 'showcase' = 'grid'
) => {
  const elements = [];
  const imageCount = images.length;

  if (layout === 'grid' && imageCount >= 2) {
    // Grid layout for multiple images
    const imageSize = totalWidth / Math.min(imageCount, 3) - 20;
    const rows = Math.ceil(imageCount / 3);
    
    images.forEach((imageUrl, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const imgX = x + (col * (imageSize + 15));
      const imgY = y + (row * (imageSize + 15));
      
      // Image container with shadow
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: imgX,
          y: imgY,
          width: imageSize,
          height: imageSize,
          fill: colors.surface,
          cornerRadius: 12,
          shadowBlur: 15,
          shadowColor: hexToRgba(colors.primary, 0.2),
          shadowOffsetY: 4,
        },
      });

      // Image
      elements.push({
        element_type: "image",
        konva_component: "Konva.Image",
        properties: {
          image_id: uuidv4(),
          imageSrc: imageUrl,
          x: imgX + 6,
          y: imgY + 6,
          width: imageSize - 12,
          height: imageSize - 12,
          cornerRadius: 8,
        },
      });

      // Accent dot
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Circle",
        shape_id: uuidv4(),
        properties: {
          x: imgX + imageSize - 8,
          y: imgY + 8,
          radius: 4,
          fill: colors.accent,
        },
      });
    });
  } else if (layout === 'floating' && imageCount >= 2) {
    // Floating overlapping images
    const baseSize = totalWidth / 2.5;
    const offset = 20;
    
    images.forEach((imageUrl, index) => {
      const imgX = x + (index * offset);
      const imgY = y + (index * offset);
      const scale = 1 - (index * 0.1);
      const imgSize = baseSize * scale;
      
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: imgX,
          y: imgY,
          width: imgSize,
          height: imgSize,
          fill: colors.surface,
          cornerRadius: 12,
          shadowBlur: 20,
          shadowColor: hexToRgba(colors.primary, 0.3),
          shadowOffsetY: 6,
        },
      });

      elements.push({
        element_type: "image",
        konva_component: "Konva.Image",
        properties: {
          image_id: uuidv4(),
          imageSrc: imageUrl,
          x: imgX + 8,
          y: imgY + 8,
          width: imgSize - 16,
          height: imgSize - 16,
          cornerRadius: 8,
        },
      });
    });
  } else {
    // Single showcase image
    const imageUrl = images[0];
    const imgSize = totalWidth - 40;
    
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      shape_id: uuidv4(),
      properties: {
        x: x,
        y: y,
        width: imgSize,
        height: imgSize,
        fillPriority: "linear-gradient",
        fillLinearGradientStartPoint: { x: x, y: y },
        fillLinearGradientEndPoint: { x: x + imgSize, y: y + imgSize },
        fillLinearGradientColorStops: [
          0, hexToRgba(colors.surface, 0.9),
          1, hexToRgba(colors.background, 0.8),
        ],
        cornerRadius: 16,
        shadowBlur: 25,
        shadowColor: hexToRgba(colors.primary, 0.25),
        shadowOffsetY: 8,
      },
    });

    elements.push({
      element_type: "image",
      konva_component: "Konva.Image",
      properties: {
        image_id: uuidv4(),
        imageSrc: imageUrl,
        x: x + 12,
        y: y + 12,
        width: imgSize - 24,
        height: imgSize - 24,
        cornerRadius: 12,
      },
    });

    // Gradient overlay
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      shape_id: uuidv4(),
      properties: {
        x: x,
        y: y,
        width: imgSize,
        height: imgSize,
        fillPriority: "linear-gradient",
        fillLinearGradientStartPoint: { x: x, y: y },
        fillLinearGradientEndPoint: { x: x + imgSize, y: y + imgSize },
        fillLinearGradientColorStops: [
          0, "rgba(255, 255, 255, 0.1)",
          0.7, "rgba(0, 0, 0, 0)",
          1, hexToRgba(colors.accent, 0.1),
        ],
        cornerRadius: 16,
      },
    });
  }

  return elements;
};

// ============= DECORATIVE ELEMENTS =============

const createGradientBlob = (
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  color1: string,
  color2: string,
  opacity: number
) => ({
  element_type: "shape",
  konva_component: "Konva.Ellipse",
  shape_id: uuidv4(),
  properties: {
    x,
    y,
    radiusX,
    radiusY,
    fillPriority: "radial-gradient",
    fillRadialGradientStartPoint: { x, y },
    fillRadialGradientEndPoint: { x, y },
    fillRadialGradientStartRadius: 0,
    fillRadialGradientEndRadius: Math.max(radiusX, radiusY),
    fillRadialGradientColorStops: [
      0, hexToRgba(color1, opacity),
      0.6, hexToRgba(color2, opacity * 0.5),
      1, "rgba(255, 255, 255, 0)",
    ],
  },
});

const createFloatingShape = (
  x: number,
  y: number,
  size: number,
  color: string,
  shape: 'circle' | 'square' | 'triangle'
) => {
  const baseElement = {
    element_type: "shape" as const,
    shape_id: uuidv4(),
    properties: {
      x,
      y,
      fill: hexToRgba(color, 0.1),
      stroke: hexToRgba(color, 0.2),
      strokeWidth: 1,
      shadowBlur: 10,
      shadowColor: hexToRgba(color, 0.15),
    },
  };

  if (shape === 'circle') {
    return {
      ...baseElement,
      konva_component: "Konva.Circle",
      properties: {
        ...baseElement.properties,
        radius: size / 2,
      },
    };
  } else if (shape === 'square') {
    return {
      ...baseElement,
      konva_component: "Konva.Rect",
      properties: {
        ...baseElement.properties,
        width: size,
        height: size,
        cornerRadius: 8,
        rotation: 45,
      },
    };
  } else {
    return {
      ...baseElement,
      konva_component: "Konva.Line",
      properties: {
        ...baseElement.properties,
        points: [0, size, size/2, 0, size, size],
        closed: true,
      },
    };
  }
};

// ============= MODERN COVER SLIDE =============

const createModernCoverSlide = (
  slide: any,
  colors: any,
  textColor: string,
  SLIDE_WIDTH: number,
  SLIDE_HEIGHT: number
) => {
  const titleText = slide.slide_title?.text || "Presentation Title";
  const subtitle = slide.elements?.find((el: any) => el.element_type === "bullet_point")?.text || "An inspiring journey begins with a single step";
  const allImages = getAllSlideImages(slide);
  const slideNumber = slide.knowledge?.slideNumber || 1;

  return {
    ...slide,
    slide_title: {
      text: titleText,
      konva_component: "Konva.Text",
      properties: {
        x: 80,
        y: 120,
        width: SLIDE_WIDTH - 160,
        height: 120,
        fontSize: 58,
        fontFamily: "Inter, sans-serif",
        fontWeight: "700",
        fill: textColor,
        align: "left",
        lineHeight: 1.1,
        letterSpacing: -0.5,
      },
    },
    elements: [
      // Background gradient
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: SLIDE_HEIGHT },
          fillLinearGradientColorStops: [
            0, colors.background,
            0.4, hexToRgba(colors.primary, 0.05),
            0.7, hexToRgba(colors.secondary, 0.03),
            1, hexToRgba(colors.accent, 0.02),
          ],
        },
      },

      // Abstract background elements
      createGradientBlob(SLIDE_WIDTH - 200, 80, 180, 150, colors.accent, colors.secondary, 0.1),
      createGradientBlob(100, SLIDE_HEIGHT - 150, 120, 100, colors.secondary, colors.primary, 0.08),
      createGradientBlob(SLIDE_WIDTH / 2, 400, 100, 80, colors.accent, colors.light, 0.06),

      // Title underline accent
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 80,
          y: 240,
          width: 100,
          height: 4,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: 80, y: 240 },
          fillLinearGradientEndPoint: { x: 180, y: 240 },
          fillLinearGradientColorStops: [0, colors.accent, 1, colors.secondary],
          cornerRadius: 2,
        },
      },

      // Subtitle
      {
        element_type: "text",
        text: subtitle,
        konva_component: "Konva.Text",
        properties: {
          x: 80,
          y: 260,
          width: 400,
          height: 80,
          fontSize: 20,
          fontFamily: "Inter, sans-serif",
          fontWeight: "400",
          fill: hexToRgba(textColor, 0.8),
          align: "left",
          lineHeight: 1.4,
        },
      },

      // Image Gallery - Using ALL available images
      ...createImageGallery(
        allImages,
        SLIDE_WIDTH - 380,
        120,
        320,
        colors,
        allImages.length > 1 ? 'floating' : 'showcase'
      ),

      // Floating shapes for visual interest
      createFloatingShape(600, 400, 60, colors.accent, 'circle'),
      createFloatingShape(700, 350, 40, colors.secondary, 'square'),
      createFloatingShape(650, 450, 50, colors.primary, 'triangle'),

      // Bottom info bar
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 0,
          y: SLIDE_HEIGHT - 80,
          width: SLIDE_WIDTH,
          height: 80,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: 0, y: SLIDE_HEIGHT - 80 },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: SLIDE_HEIGHT },
          fillLinearGradientColorStops: [
            0, hexToRgba(colors.primary, 0.9),
            1, hexToRgba(colors.secondary, 0.8),
          ],
        },
      },

      // Slide number in modern style
      {
        element_type: "shape",
        konva_component: "Konva.Circle",
        shape_id: uuidv4(),
        properties: {
          x: SLIDE_WIDTH - 50,
          y: SLIDE_HEIGHT - 40,
          radius: 16,
          fill: colors.surface,
          strokeWidth: 2,
          stroke: hexToRgba(colors.surface, 0.3),
        },
      },
      {
        element_type: "text",
        text: `${slideNumber}`,
        konva_component: "Konva.Text",
        properties: {
          x: SLIDE_WIDTH - 58,
          y: SLIDE_HEIGHT - 48,
          width: 16,
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          fontWeight: "600",
          fill: colors.primary,
          align: "center",
        },
      },
    ].flat(),
  };
};

// ============= CONTENT SLIDE WITH MULTIPLE IMAGES =============

const createContentSlideWithImages = (
  slide: any,
  colors: any,
  textColor: string,
  SLIDE_WIDTH: number,
  SLIDE_HEIGHT: number,
  imagePosition: 'right' | 'left' | 'top'
) => {
  const titleText = slide.slide_title?.text || "Content Slide";
  const bullets = (slide.elements || [])
    .filter((el: any) => el.element_type === "bullet_point")
    .map((el: any) => el.text || "");
  const allImages = getAllSlideImages(slide);
  const slideNumber = slide.knowledge?.slideNumber || 2;

  const contentWidth = imagePosition === 'top' ? SLIDE_WIDTH - 80 : 500;
  const imageWidth = imagePosition === 'top' ? SLIDE_WIDTH - 80 : 400;
  const contentX = imagePosition === 'left' ? 460 : 60;
  const imageX = imagePosition === 'left' ? 60 : contentX + contentWidth - 60;
  const imageY = imagePosition === 'top' ? 120 : 140;

  const bulletElements = bullets.map((bullet: string, index: number) => ({
    element_type: "bullet_point",
    text: bullet.replace(/^[•\-]\s*/, ''),
    konva_component: "Konva.Text",
    properties: {
      x: contentX,
      y: 140 + (index * 70),
      width: contentWidth - 40,
      height: 60,
      fontSize: 18,
      fontFamily: "Inter, sans-serif",
      fontWeight: "500",
      fill: textColor,
      lineHeight: 1.4,
      align: "left",
    },
  }));

  return {
    ...slide,
    slide_title: {
      text: titleText,
      konva_component: "Konva.Text",
      properties: {
        x: contentX,
        y: 60,
        width: contentWidth - 40,
        height: 60,
        fontSize: 36,
        fontFamily: "Inter, sans-serif",
        fontWeight: "600",
        fill: textColor,
        align: "left",
        lineHeight: 1.1,
        letterSpacing: -0.3,
      },
    },
    elements: [
      // Background
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          fill: colors.background,
        },
      },

      // Content area background
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: contentX - 20,
          y: 40,
          width: contentWidth,
          height: SLIDE_HEIGHT - 80,
          fill: colors.surface,
          cornerRadius: 20,
          shadowBlur: 15,
          shadowColor: hexToRgba(colors.primary, 0.1),
          shadowOffsetY: 4,
        },
      },

      // Title accent
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: contentX,
          y: 120,
          width: 60,
          height: 3,
          fill: colors.accent,
          cornerRadius: 1.5,
        },
      },

      ...bulletElements,

      // Image Gallery
      ...createImageGallery(
        allImages,
        imageX,
        imageY,
        imageWidth,
        colors,
        allImages.length > 2 ? 'grid' : 'showcase'
      ),

      // Decorative elements
      createGradientBlob(
        imagePosition === 'left' ? 400 : SLIDE_WIDTH - 150,
        100,
        80,
        60,
        colors.secondary,

        colors.accent,
        0.06
      ),

      // Slide number
      {
        element_type: "text",
        text: `${slideNumber}`,
        konva_component: "Konva.Text",
        properties: {
          x: SLIDE_WIDTH - 60,
          y: SLIDE_HEIGHT - 40,
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          fontWeight: "500",
          fill: hexToRgba(textColor, 0.5),
          align: "right",
        },
      },
    ].flat(),
  };
};

// ============= CONCLUSION SLIDE WITH IMAGE GALLERY =============

const createModernConclusionSlide = (
  slide: any,
  colors: any,
  textColor: string,
  SLIDE_WIDTH: number,
  SLIDE_HEIGHT: number
) => {
  const titleText = slide.slide_title?.text || "Key Takeaways";
  const bullets = (slide.elements || [])
    .filter((el: any) => el.element_type === "bullet_point")
    .map((el: any) => el.text || "");
  const allImages = getAllSlideImages(slide);
  const slideNumber = slide.knowledge?.slideNumber || 3;

  const bulletElements = bullets.map((bullet: string, index: number) => ({
    element_type: "bullet_point",
    text: bullet.replace(/^[•\-]\s*/, ''),
    konva_component: "Konva.Text",
    properties: {
      x: 80,
      y: 140 + (index * 80),
      width: SLIDE_WIDTH - 160,
      height: 60,
      fontSize: 20,
      fontFamily: "Inter, sans-serif",
      fontWeight: "500",
      fill: textColor,
      lineHeight: 1.4,
      align: "center",
    },
  }));

  return {
    ...slide,
    slide_title: {
      text: titleText,
      konva_component: "Konva.Text",
      properties: {
        x: 60,
        y: 60,
        width: SLIDE_WIDTH - 120,
        height: 60,
        fontSize: 42,
        fontFamily: "Inter, sans-serif",
        fontWeight: "600",
        fill: textColor,
        align: "center",
        lineHeight: 1.1,
        letterSpacing: -0.3,
      },
    },
    elements: [
      // Background gradient
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: SLIDE_HEIGHT },
          fillLinearGradientColorStops: [
            0, colors.background,
            0.5, hexToRgba(colors.primary, 0.03),
            1, hexToRgba(colors.accent, 0.02),
          ],
        },
      },

      // Title underline
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: SLIDE_WIDTH / 2 - 80,
          y: 120,
          width: 160,
          height: 4,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: SLIDE_WIDTH / 2 - 80, y: 120 },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH / 2 + 80, y: 120 },
          fillLinearGradientColorStops: [0, colors.secondary, 0.5, colors.accent, 1, colors.primary],
          cornerRadius: 2,
        },
      },

      ...bulletElements,

      // Image Gallery at bottom
      ...(allImages.length > 0 ? createImageGallery(
        allImages,
        80,
        SLIDE_HEIGHT - 200,
        SLIDE_WIDTH - 160,
        colors,
        'grid'
      ) : []),

      // Footer
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 0,
          y: SLIDE_HEIGHT - 60,
          width: SLIDE_WIDTH,
          height: 60,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: 0, y: SLIDE_HEIGHT - 60 },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: SLIDE_HEIGHT },
          fillLinearGradientColorStops: [
            0, hexToRgba(colors.primary, 0.1),
            1, hexToRgba(colors.secondary, 0.05),
          ],
        },
      },

      {
        element_type: "text",
        text: "Thank You",
        konva_component: "Konva.Text",
        properties: {
          x: 0,
          y: SLIDE_HEIGHT - 45,
          width: SLIDE_WIDTH,
          height: 30,
          fontSize: 24,
          fontFamily: "Inter, sans-serif",
          fontWeight: "500",
          fill: hexToRgba(textColor, 0.8),
          align: "center",
        },
      },

      // Decorative elements
      createGradientBlob(100, 100, 100, 80, colors.accent, colors.secondary, 0.05),
      createGradientBlob(SLIDE_WIDTH - 120, 100, 80, 60, colors.secondary, colors.primary, 0.05),

      // Slide number
      {
        element_type: "text",
        text: `${slideNumber}`,
        konva_component: "Konva.Text",
        properties: {
          x: SLIDE_WIDTH - 60,
          y: 60,
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          fontWeight: "500",
          fill: hexToRgba(textColor, 0.5),
          align: "right",
        },
      },
    ].flat(),
  };
};

// ============= HELPER FUNCTIONS =============

const getAllSlideImages = (slide: any): string[] => {
  const images: string[] = [];
  
  // Add main image_url if exists
  if (slide.image_url) {
    images.push(slide.image_url);
  }
  
  // Add all image elements from elements array
  const imageElements = (slide.elements || []).filter((el: any) => 
    el.element_type === "image" && el.properties?.imageSrc
  );
  
  imageElements.forEach((el: any) => {
    if (el.properties.imageSrc && !images.includes(el.properties.imageSrc)) {
      images.push(el.properties.imageSrc);
    }
  });
  
  return images;
};

// ============= MAIN TEMPLATE FUNCTION =============

export interface Theme {
  font?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor: string;
  image_url: string | undefined;
  titleColor?: string;
  artPalette?: string[];
}

export const applyTemplate = (
  slide: any,
  layoutType: string,
  imageUrl: string,
  slideIndex: number,
  totalSlides: number,
  SLIDE_WIDTH: number = 960,
  SLIDE_HEIGHT: number = 540,
  theme?: Theme | null
): any => {
  // Add the main image URL to the slide
  if (imageUrl && !slide.image_url) {
    slide.image_url = imageUrl;
  }

  const artPalette = theme?.artPalette || slide.art_palette || ["#2c3e50", "#3498db", "#f39c12", "#ecf0f1"];
  const colors = generateThemeColors(artPalette);
  
  colors.background = theme?.backgroundColor || colors.background;
  
  if (theme?.image_url) {
    colors.background = "transparent";
  }
  
  const textColor = theme ? getContrastingTextColor(theme.backgroundColor || colors.background) : "#000000";

  const layout = layoutType || slide.layout_type || "content-right-image";
  let enhancedSlide;

  // Determine layout based on slide index and total slides
  if (totalSlides === 3) {
    switch (slideIndex) {
      case 0:
        enhancedSlide = createModernCoverSlide(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT);
        break;
      case 1:
        enhancedSlide = createContentSlideWithImages(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT, 'right');
        break;
      case 2:
        enhancedSlide = createModernConclusionSlide(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT);
        break;
      default:
        enhancedSlide = createContentSlideWithImages(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT, 'right');
    }
  } else if (totalSlides === 5) {
    switch (slideIndex) {
      case 0:
        enhancedSlide = createModernCoverSlide(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT);
        break;
      case 1:
        enhancedSlide = createContentSlideWithImages(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT, 'right');
        break;
      case 2:
        enhancedSlide = createContentSlideWithImages(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT, 'left');
        break;
      case 3:
        enhancedSlide = createContentSlideWithImages(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT, 'top');
        break;
      case 4:
        enhancedSlide = createModernConclusionSlide(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT);
        break;
      default:
        enhancedSlide = createContentSlideWithImages(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT, 'right');
    }
  } else {
    // Fallback for any other number of slides
    enhancedSlide = createContentSlideWithImages(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT, 'right');
  }

  return {
    ...enhancedSlide,
    slide_id: slide.slide_id || uuidv4(),
    layout_type: layout,
    visual_suggestion: slide.visual_suggestion,
    art_style: slide.art_style,
    knowledge: slide.knowledge,
    image_url: slide.image_url,
    image_caption: slide.image_caption,
  };
};
