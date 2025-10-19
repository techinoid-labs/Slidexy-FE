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

// ============= DECORATIVE SHAPES =============

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

const createAccentCircle = (
  x: number,
  y: number,
  radius: number,
  color: string,
  opacity: number = 0.1
) => ({
  element_type: "shape",
  konva_component: "Konva.Circle",
  shape_id: uuidv4(),
  properties: {
    x,
    y,
    radius,
    fill: hexToRgba(color, opacity),
    strokeWidth: 1,
    stroke: hexToRgba(color, opacity * 1.5),
  },
});

const createGeometricLine = (
  x: number,
  y: number,
  length: number,
  angle: number,
  color: string,
  thickness: number = 2
) => ({
  element_type: "shape",
  konva_component: "Konva.Rect",
  shape_id: uuidv4(),
  properties: {
    x,
    y,
    width: length,
    height: thickness,
    fill: color,
    opacity: 0.5,
    rotation: angle,
    cornerRadius: thickness / 2,
  },
});

// NEW: Corner decoration elements
const createCornerArc = (
  x: number,
  y: number,
  radius: number,
  color: string,
  corner: 'tl' | 'tr' | 'bl' | 'br'
) => {
  const angles = {
    tl: { start: 180, end: 270 },
    tr: { start: 270, end: 360 },
    bl: { start: 90, end: 180 },
    br: { start: 0, end: 90 }
  };
  
  return {
    element_type: "shape",
    konva_component: "Konva.Arc",
    shape_id: uuidv4(),
    properties: {
      x,
      y,
      innerRadius: radius - 3,
      outerRadius: radius,
      angle: 90,
      rotation: angles[corner].start,
      fill: hexToRgba(color, 0.3),
      strokeWidth: 0,
    },
  };
};

const createCornerTriangle = (
  x: number,
  y: number,
  size: number,
  color: string,
  corner: 'tl' | 'tr' | 'bl' | 'br'
) => {
  const points = {
    tl: [0, 0, size, 0, 0, size],
    tr: [0, 0, size, 0, size, size],
    bl: [0, 0, 0, size, size, size],
    br: [0, size, size, 0, size, size]
  };

  return {
    element_type: "shape",
    konva_component: "Konva.Line",
    shape_id: uuidv4(),
    properties: {
      x,
      y,
      points: points[corner],
      closed: true,
      fill: hexToRgba(color, 0.08),
      strokeWidth: 1,
      stroke: hexToRgba(color, 0.15),
    },
  };
};

const createCornerDots = (
  x: number,
  y: number,
  color: string,
  corner: 'tl' | 'tr' | 'bl' | 'br'
) => {
  const offsets = {
    tl: [[10, 10], [25, 10], [40, 10], [10, 25], [25, 25], [10, 40]],
    tr: [[-10, 10], [-25, 10], [-40, 10], [-10, 25], [-25, 25], [-10, 40]],
    bl: [[10, -10], [25, -10], [40, -10], [10, -25], [25, -25], [10, -40]],
    br: [[-10, -10], [-25, -10], [-40, -10], [-10, -25], [-25, -25], [-10, -40]]
  };

  return offsets[corner].map(([dx, dy], i) => ({
    element_type: "shape",
    konva_component: "Konva.Circle",
    shape_id: uuidv4(),
    properties: {
      x: x + dx,
      y: y + dy,
      radius: 2,
      fill: hexToRgba(color, 0.3 - i * 0.03),
    },
  }));
};

const createBulletCard = (
  x: number,
  y: number,
  width: number,
  height: number,
  colors: any,
  index: number,
  text: string,
  isNumbered: boolean = true,
  textColor: string
) => {
  const cardElements: any[] = [];

  // Card background with subtle gradient
  cardElements.push({
    element_type: "shape",
    konva_component: "Konva.Rect",
    shape_id: uuidv4(),
    properties: {
      x,
      y,
      width,
      height,
      fillPriority: "linear-gradient",
      fillLinearGradientStartPoint: { x: x, y: y },
      fillLinearGradientEndPoint: { x: x + width, y: y + height },
      fillLinearGradientColorStops: [
        0, hexToRgba(colors.secondary, 0.06),
        0.5, hexToRgba(colors.background, 0.98),
        1, hexToRgba(colors.accent, 0.04),
      ],
      cornerRadius: 10,
      strokeWidth: 0.5,
      stroke: hexToRgba(colors.secondary, 0.1),
      shadowBlur: 4,
      shadowColor: hexToRgba(colors.primary, 0.08),
      shadowOffsetY: 1,
    },
  });

  if (isNumbered) {
    // Smaller number badge
    cardElements.push({
      element_type: "shape",
      konva_component: "Konva.Circle",
      shape_id: uuidv4(),
      properties: {
        x: x + 8,
        y: y + height / 2,
        radius: 10,
        fillPriority: "linear-gradient",
        fillLinearGradientStartPoint: { x: x, y: y + height / 2 - 10 },
        fillLinearGradientEndPoint: { x: x + 16, y: y + height / 2 + 10 },
        fillLinearGradientColorStops: [
          0, colors.secondary,
          1, colors.accent,
        ],
        shadowBlur: 2,
        shadowColor: hexToRgba(colors.secondary, 0.2),
      },
    });
    cardElements.push({
      element_type: "text",
      text: `${index + 1}`,
      konva_component: "Konva.Text",
      properties: {
        x: x + 3,
        y: y + height / 2 - 5,
        width: 12,
        fontSize: 9,
        fontFamily: "Raleway, sans-serif",
        fontWeight: "500",
        fill: colors.background,
        align: "center",
      },
    });

    // Connecting line
    cardElements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      shape_id: uuidv4(),
      properties: {
        x: x + 22,
        y: y + height / 2 - 0.5,
        width: 6,
        height: 1,
        fill: hexToRgba(colors.secondary, 0.4),
      },
    });
  }

  // Bullet text
  cardElements.push({
    element_type: "bullet_point",
    text: text.replace(/^[•\-]\s*/, ''),
    konva_component: "Konva.Text",
    properties: {
      x: isNumbered ? x + 32 : x + 12,
      y: y + 8,
      width: width - (isNumbered ? 45 : 25),
      height: height - 16,
      fontSize: 15,
      fontFamily: "Raleway, sans-serif",
      fontWeight: "500",
      fill: textColor,
      lineHeight: 1.3,
      align: "left",
      verticalAlign: "middle",
      padding: 4,
    },
  });

  return cardElements;
};

// ============= COVER-HERO SLIDE (STUNNING REDESIGN) =============

const createCoverHeroSlide = (
  slide: any,
  colors: any,
  textColor: string,
  SLIDE_WIDTH: number,
  SLIDE_HEIGHT: number
) => {
  const titleText = slide.slide_title?.text || "Untitled Presentation";
  const bullets = (slide.elements || [])
    .filter((el: any) => el.element_type === "bullet_point")
    .map((el: any) => el.text || "");
  const imageUrl = slide.image_url || (slide.elements.find((el: any) => el.element_type === "image")?.properties?.imageSrc);
  const slideNumber = slide.knowledge?.slideNumber || 1;

  const halfWidth = SLIDE_WIDTH / 2;

  // Subtitle/bullets positioned elegantly
  const bulletCards: any[] = bullets.slice(0, 3).map((bullet: string, index: number) => 
    createBulletCard(70, 320 + (index * 68), halfWidth - 140, 58, colors, index, bullet, false, textColor)
  ).flat();

  return {
    ...slide,
    slide_title: {
      text: titleText,
      konva_component: "Konva.Text",
      properties: {
        x: 70,
        y: 210,
        width: halfWidth - 140,
        height: 300,
        fontSize: 40,
        fontFamily: "Raleway, sans-serif",
        fontWeight: "600",
        fill: textColor,
        align: "left",
        lineHeight: 2.0,
        letterSpacing: 1.0,
        padding: 0,
        verticalAlign: "center",
      },
    },
    elements: [
      // Full animated gradient background
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
            0, colors.primary,
            0.25, colors.secondary,
            0.5, hexToRgba(colors.accent, 0.9),
            0.75, colors.secondary,
            1, colors.light,
          ],
        },
      },

      // Diagonal overlay with opacity
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: -200,
          y: -100,
          width: 800,
          height: SLIDE_HEIGHT + 200,
          fill: hexToRgba(colors.primary, 0.3),
          rotation: 15,
        },
      },

      // Large decorative blobs for depth
      createGradientBlob(150, 100, 200, 160, colors.accent, colors.secondary, 0.2),
      createGradientBlob(SLIDE_WIDTH - 200, 280, 240, 200, colors.secondary, colors.primary, 0.18),
      createGradientBlob(halfWidth, SLIDE_HEIGHT - 80, 180, 140, colors.accent, colors.light, 0.15),

      // Massive corner triangles for drama
      createCornerTriangle(0, 0, 120, colors.secondary, 'tl'),
      createCornerTriangle(SLIDE_WIDTH - 120, 0, 120, colors.accent, 'tr'),
      createCornerTriangle(0, SLIDE_HEIGHT - 120, 120, colors.accent, 'bl'),
      createCornerTriangle(SLIDE_WIDTH - 120, SLIDE_HEIGHT - 120, 120, colors.primary, 'br'),

      // Animated corner arcs
      createCornerArc(100, 100, 80, colors.light, 'tl'),
      createCornerArc(SLIDE_WIDTH - 100, 100, 80, colors.accent, 'tr'),
      createCornerArc(100, SLIDE_HEIGHT - 100, 80, colors.secondary, 'bl'),
      createCornerArc(SLIDE_WIDTH - 100, SLIDE_HEIGHT - 100, 80, colors.light, 'br'),

      // Dot matrix in corners
      ...createCornerDots(70, 70, textColor, 'tl'),
      ...createCornerDots(SLIDE_WIDTH - 70, 70, textColor, 'tr'),
      ...createCornerDots(70, SLIDE_HEIGHT - 70, textColor, 'bl'),
      ...createCornerDots(SLIDE_WIDTH - 70, SLIDE_HEIGHT - 70, textColor, 'br'),

      // Floating geometric lines throughout
      createGeometricLine(120, 80, 140, 25, hexToRgba(colors.light, 0.4), 3),
      createGeometricLine(SLIDE_WIDTH - 200, 120, 120, -20, hexToRgba(colors.accent, 0.5), 3),
      createGeometricLine(180, SLIDE_HEIGHT - 90, 160, 15, hexToRgba(colors.secondary, 0.4), 4),
      createGeometricLine(SLIDE_WIDTH - 240, SLIDE_HEIGHT - 80, 140, -30, hexToRgba(colors.light, 0.5), 3),

      // Multiple accent circles for rhythm
      createAccentCircle(SLIDE_WIDTH - 120, 180, 40, colors.light, 0.25),
      createAccentCircle(140, SLIDE_HEIGHT - 140, 35, colors.accent, 0.3),
      createAccentCircle(SLIDE_WIDTH - 160, SLIDE_HEIGHT - 160, 45, colors.secondary, 0.2),
      createAccentCircle(halfWidth, 80, 25, colors.light, 0.35),

      // Premium glassmorphic card for title area
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 50,
          y: 130,
          width: halfWidth - 90,
          height: 300,
          fill: hexToRgba(colors.background, 0.15),
          cornerRadius: 20,
          strokeWidth: 1.5,
          stroke: hexToRgba(colors.light, 0.35),
          shadowBlur: 20,
          shadowColor: hexToRgba(colors.primary, 0.25),
          shadowOffsetY: 8,
        },
      },

      // Inner glow for title card
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 54,
          y: 134,
          width: halfWidth - 95,
          height: 300,
          fill: "transparent",
          cornerRadius: 18,
          strokeWidth: 1,
          stroke: hexToRgba(colors.light, 0.2),
        },
      },

      // Dynamic title accent - animated feel
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 70,
          y: 142,
          width: 120,
          height: 5,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: 70, y: 142 },
          fillLinearGradientEndPoint: { x: 190, y: 142 },
          fillLinearGradientColorStops: [
            0, colors.accent,
            0.5, colors.light, 
            1, colors.secondary
          ],
          cornerRadius: 2.5,
          shadowBlur: 8,
          shadowColor: hexToRgba(colors.accent, 0.6),
        },
      },

      ...bulletCards,

      // Right side image with dramatic treatment
      ...(imageUrl ? [
        // Multiple shadow layers for depth
        {
          element_type: "shape",
          konva_component: "Konva.Rect",
          shape_id: uuidv4(),
          properties: {
            x: halfWidth + 55,
            y: 95,
            width: halfWidth - 110,
            height: SLIDE_HEIGHT - 150,
            fill: hexToRgba(colors.primary, 0.15),
            cornerRadius: 24,
            shadowBlur: 30,
            shadowColor: hexToRgba(colors.primary, 0.4),
            shadowOffsetY: 15,
          },
        },
        {
          element_type: "shape",
          konva_component: "Konva.Rect",
          shape_id: uuidv4(),
          properties: {
            x: halfWidth + 50,
            y: 90,
            width: halfWidth - 110,
            height: SLIDE_HEIGHT - 150,
            fill: hexToRgba(colors.accent, 0.1),
            cornerRadius: 24,
            shadowBlur: 20,
            shadowColor: hexToRgba(colors.accent, 0.3),
            shadowOffsetY: 10,
          },
        },
        // Main image
        {
          element_type: "image",
          konva_component: "Konva.Image",
          properties: {
            image_id: uuidv4(),
            imageSrc: imageUrl,
            x: halfWidth + 10,
            y: 85,
            width: halfWidth - 50,
            height: SLIDE_HEIGHT - 150,
            cornerRadius: 24,
            strokeWidth: 2,
            stroke: hexToRgba(colors.light, 0.4),
          },
        },
        // Gradient overlay for style
        {
          element_type: "shape",
          konva_component: "Konva.Rect",
          shape_id: uuidv4(),
          properties: {
            x: halfWidth + 45,
            y: 85,
            width: halfWidth - 110,
            height: SLIDE_HEIGHT - 150,
            fillPriority: "linear-gradient",
            fillLinearGradientStartPoint: { x: halfWidth + 45, y: 85 },
            fillLinearGradientEndPoint: { x: halfWidth + 45, y: SLIDE_HEIGHT - 65 },
            fillLinearGradientColorStops: [
              0, hexToRgba(colors.primary, 0.1),
              0.5, "rgba(0, 0, 0, 0)",
              1, hexToRgba(colors.accent, 0.4),
            ],
            cornerRadius: 24,
          },
        },
        // Decorative frame elements
        {
          element_type: "shape",
          konva_component: "Konva.Rect",
          shape_id: uuidv4(),
          properties: {
            x: halfWidth + 35,
            y: 75,
            width: 6,
            height: 80,
            fill: hexToRgba(colors.accent, 0.7),
            cornerRadius: 3,
          },
        },
        {
          element_type: "shape",
          konva_component: "Konva.Rect",
          shape_id: uuidv4(),
          properties: {
            x: halfWidth + 35,
            y: 75,
            width: 80,
            height: 6,
            fill: hexToRgba(colors.accent, 0.7),
            cornerRadius: 3,
          },
        },
      ] : [
        // Decorative pattern if no image
        createGradientBlob(halfWidth + 120, 180, 160, 140, colors.accent, colors.light, 0.15),
        createGradientBlob(SLIDE_WIDTH - 140, 340, 140, 120, colors.secondary, colors.accent, 0.18),
        ...Array.from({length: 8}, (_, i) => 
          createAccentCircle(
            halfWidth + 100 + (i % 3) * 90, 
            150 + Math.floor(i / 3) * 90, 
            25 + (i * 3), 
            [colors.accent, colors.secondary, colors.primary][i % 3], 
            0.1 + (i * 0.02)
          )
        ),
      ]),

      // Slide number with style
      {
        element_type: "shape",
        konva_component: "Konva.Circle",
        shape_id: uuidv4(),
        properties: {
          x: SLIDE_WIDTH - 40,
          y: SLIDE_HEIGHT - 40,
          radius: 18,
          fillPriority: "radial-gradient",
          fillRadialGradientStartPoint: { x: SLIDE_WIDTH - 40, y: SLIDE_HEIGHT - 40 },
          fillRadialGradientEndPoint: { x: SLIDE_WIDTH - 40, y: SLIDE_HEIGHT - 40 },
          fillRadialGradientStartRadius: 0,
          fillRadialGradientEndRadius: 18,
          fillRadialGradientColorStops: [
            0, colors.accent,
            1, colors.secondary,
          ],
          shadowBlur: 6,
          shadowColor: hexToRgba(colors.accent, 0.5),
        },
      },
      {
        element_type: "text",
        text: `${slideNumber}`,
        konva_component: "Konva.Text",
        properties: {
          x: SLIDE_WIDTH - 52,
          y: SLIDE_HEIGHT - 48,
          width: 24,
          fontSize: 14,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "700",
          fill: textColor,
          align: "center",
        },
      },
    ].flat(),
  };
};

// ============= CONTENT-RIGHT-IMAGE SLIDE =============

const createContentRightImageSlide = (
  slide: any,
  colors: any,
  textColor: string,
  SLIDE_WIDTH: number,
  SLIDE_HEIGHT: number
) => {
  const titleText = slide.slide_title?.text || "Content Slide";
  const bullets = (slide.elements || [])
    .filter((el: any) => el.element_type === "bullet_point")
    .map((el: any) => el.text || "");
  const imageUrl = slide.image_url || (slide.elements.find((el: any) => el.element_type === "image")?.properties?.imageSrc);
  const slideNumber = slide.knowledge?.slideNumber || 2;

  const contentWidth = SLIDE_WIDTH / 2 - 60;
  const imageWidth = SLIDE_WIDTH / 2;
  const cardHeight = 70;
  const cardSpacing = 18;
  const startY = 140;

  const bulletCards: any[] = bullets.slice(0, 5).map((bullet: string, index: number) => 
    createBulletCard(60, startY + (index * (cardHeight + cardSpacing)), contentWidth - 40, cardHeight, colors, index, bullet, false, textColor)
  ).flat();

  return {
    ...slide,
    slide_title: {
      text: titleText,
      konva_component: "Konva.Text",
      properties: {
        x: 60,
        y: 30,
        width: contentWidth,
        height: 60,
        fontSize: 32,
        fontFamily: "Raleway, sans-serif",
        fontWeight: "600",
        fill: textColor,
        align: "left",
        letterSpacing: -0.2,
        padding: 6,
        verticalAlign: "top",
      },
    },
    elements: [
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

      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: 100,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: 100 },
          fillLinearGradientColorStops: [
            0, hexToRgba(colors.primary, 0.03),
            0.5, hexToRgba(colors.secondary, 0.01),
            1, "rgba(255, 255, 255, 0)",
          ],
        },
      },

      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 60,
          y: 110,
          width: 100,
          height: 2,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: 60, y: 110 },
          fillLinearGradientEndPoint: { x: 160, y: 110 },
          fillLinearGradientColorStops: [0, colors.secondary, 1, colors.accent],
          cornerRadius: 1,
        },
      },

      ...bulletCards,

      ...(imageUrl ? [
        createGradientBlob(SLIDE_WIDTH - 100, 260, 160, 120, colors.accent, colors.secondary, 0.08),
        {
          element_type: "shape",
          konva_component: "Konva.Rect",
          shape_id: uuidv4(),
          properties: {
            x: SLIDE_WIDTH / 2 + 20,
            y: 120,
            width: imageWidth - 60,
            height: 360,
            fill: hexToRgba(colors.primary, 0.06),
            cornerRadius: 14,
            shadowBlur: 6,
            shadowColor: hexToRgba(textColor, 0.1),
          },
        },
        {
          element_type: "image",
          konva_component: "Konva.Image",
          properties: {
            image_id: uuidv4(),
            imageSrc: imageUrl,
            x: SLIDE_WIDTH / 2 + 15,
            y: 115,
            width: imageWidth - 50,
            height: 360,
            cornerRadius: 14,
            strokeWidth: 0.5,
            stroke: hexToRgba(colors.accent, 0.15),
          },
        },
        createAccentCircle(SLIDE_WIDTH - 40, SLIDE_HEIGHT - 90, 20, colors.secondary, 0.2),
      ] : [
        createAccentCircle(SLIDE_WIDTH - 130, 210, 40, colors.accent, 0.12),
        createGeometricLine(SLIDE_WIDTH - 180, 360, 130, 25, hexToRgba(colors.secondary, 0.4)),
      ]),

      {
        element_type: "text",
        text: `${slideNumber}`,
        konva_component: "Konva.Text",
        properties: {
          x: SLIDE_WIDTH - 50,
          y: SLIDE_HEIGHT - 35,
          fontSize: 12,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "500",
          fill: textColor,
          align: "right",
        },
      },
    ].flat(),
  };
};

// ============= CONTENT-LEFT-IMAGE SLIDE (ENHANCED) =============

const createContentLeftImageSlide = (
  slide: any,
  colors: any,
  textColor: string,
  SLIDE_WIDTH: number,
  SLIDE_HEIGHT: number
) => {
  const titleText = slide.slide_title?.text || "Content Slide";
  const bullets = (slide.elements || [])
    .filter((el: any) => el.element_type === "bullet_point")
    .map((el: any) => el.text || "");
  const imageUrl = slide.image_url || (slide.elements.find((el: any) => el.element_type === "image")?.properties?.imageSrc);
  const slideNumber = slide.knowledge?.slideNumber || 3;

  const contentWidth = SLIDE_WIDTH / 2 - 60;
  const imageWidth = SLIDE_WIDTH / 2;
  const cardHeight = 70;
  const cardSpacing = 18;
  const startY = 140;

  const bulletCards: any[] = bullets.slice(0, 5).map((bullet: string, index: number) => 
    createBulletCard(SLIDE_WIDTH / 2 + 60, startY + (index * (cardHeight + cardSpacing)), contentWidth - 40, cardHeight, colors, index, bullet, false, textColor)
  ).flat();

  return {
    ...slide,
    slide_title: {
      text: titleText,
      konva_component: "Konva.Text",
      properties: {
        x: SLIDE_WIDTH / 2 + 60,
        y: 30,
        width: contentWidth,
        height: 60,
        fontSize: 32,
        fontFamily: "Raleway, sans-serif",
        fontWeight: "600",
        fill: textColor,
        align: "left",
        letterSpacing: -0.2,
        padding: 6,
        verticalAlign: "top",
      },
    },
    elements: [
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

      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: 100,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: 100 },
          fillLinearGradientColorStops: [
            0, hexToRgba(colors.accent, 0.03),
            0.5, hexToRgba(colors.primary, 0.01),
            1, "rgba(255, 255, 255, 0)",
          ],
        },
      },

      // NEW: Top-left corner decorations
      createCornerTriangle(0, 0, 60, colors.secondary, 'tl'),
      createCornerArc(50, 50, 40, colors.accent, 'tl'),
      ...createCornerDots(35, 35, colors.primary, 'tl'),

      // NEW: Top-right corner decorations
      createCornerArc(SLIDE_WIDTH - 50, 50, 35, colors.secondary, 'tr'),
      createAccentCircle(SLIDE_WIDTH - 30, 30, 12, colors.accent, 0.25),
      createAccentCircle(SLIDE_WIDTH - 55, 55, 8, colors.primary, 0.2),

      // NEW: Bottom-left corner decorations
      createCornerTriangle(0, SLIDE_HEIGHT - 60, 60, colors.accent, 'bl'),
      createGeometricLine(15, SLIDE_HEIGHT - 25, 80, 0, hexToRgba(colors.secondary, 0.4), 3),
      createAccentCircle(25, SLIDE_HEIGHT - 25, 10, colors.primary, 0.3),

      // NEW: Bottom-right corner decorations
      createCornerArc(SLIDE_WIDTH - 50, SLIDE_HEIGHT - 50, 38, colors.primary, 'br'),
      ...createCornerDots(SLIDE_WIDTH - 35, SLIDE_HEIGHT - 35, colors.accent, 'br'),
      createGeometricLine(SLIDE_WIDTH - 100, SLIDE_HEIGHT - 20, 70, 0, hexToRgba(colors.accent, 0.35), 2),

      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: SLIDE_WIDTH / 2 + 60,
          y: 110,
          width: 100,
          height: 2,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: SLIDE_WIDTH / 2 + 60, y: 110 },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH / 2 + 160, y: 110 },
          fillLinearGradientColorStops: [0, colors.accent, 1, colors.secondary],
          cornerRadius: 1,
        },
      },

      ...(imageUrl ? [
        createGradientBlob(100, 260, 160, 120, colors.secondary, colors.accent, 0.08),
        {
          element_type: "shape",
          konva_component: "Konva.Rect",
          shape_id: uuidv4(),
          properties: {
            x: 60,
            y: 120,
            width: imageWidth - 60,
            height: 360,
            fill: hexToRgba(colors.primary, 0.06),
            cornerRadius: 14,
            shadowBlur: 6,
            shadowColor: hexToRgba(textColor, 0.1),
          },
        },
        {
          element_type: "image",
          konva_component: "Konva.Image",
          properties: {
            image_id: uuidv4(),
            imageSrc: imageUrl,
            x: 55,
            y: 115,
            width: imageWidth - 60,
            height: 360,
            cornerRadius: 14,
            strokeWidth: 0.5,
            stroke: hexToRgba(colors.accent, 0.15),
          },
        },
        createAccentCircle(140, SLIDE_HEIGHT - 90, 20, colors.accent, 0.2),
      ] : [
        createAccentCircle(130, 210, 40, colors.secondary, 0.12),
        createGeometricLine(180, 360, 130, -25, hexToRgba(colors.accent, 0.4)),
      ]),

      ...bulletCards,

      {
        element_type: "text",
        text: `${slideNumber}`,
        konva_component: "Konva.Text",
        properties: {
          x: SLIDE_WIDTH - 50,
          y: SLIDE_HEIGHT - 35,
          fontSize: 12,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "500",
          fill: textColor,
          align: "right",
        },
      },
    ].flat(),
  };
};

// ============= SPLIT-CONTENT SLIDE =============

const createSplitContentSlide = (
  slide: any,
  colors: any,
  textColor: string,
  SLIDE_WIDTH: number,
  SLIDE_HEIGHT: number
) => {
  const titleText = slide.slide_title?.text || "Split Content Slide";
  const bullets = (slide.elements || [])
    .filter((el: any) => el.element_type === "bullet_point")
    .map((el: any) => el.text || "");
  const imageUrl = slide.image_url || (slide.elements.find((el: any) => el.element_type === "image")?.properties?.imageSrc);
  const slideNumber = slide.knowledge?.slideNumber || 4;

  const colWidth = (SLIDE_WIDTH - 120) / 2;
  const cardHeight = 80;
  const cardSpacing = 25;
  const startY = 140;

  const leftBullets = bullets.slice(0, Math.ceil(bullets.length / 2));
  const rightBullets = bullets.slice(Math.ceil(bullets.length / 2));

  const leftCards: any[] = leftBullets.map((bullet: string, index: number) => 
    createBulletCard(60, startY + (index * (cardHeight + cardSpacing)), colWidth - 40, cardHeight, colors, index, bullet, false, textColor)
  ).flat();

  const rightCards: any[] = rightBullets.map((bullet: string, index: number) => 
    createBulletCard(SLIDE_WIDTH / 2 + 60, startY + (index * (cardHeight + cardSpacing)), colWidth - 40, cardHeight, colors, Math.floor(bullets.length / 2) + index, bullet, false, textColor)
  ).flat();

  return {
    ...slide,
    slide_title: {
      text: titleText,
      konva_component: "Konva.Text",
      properties: {
        x: 60,
        y: 50,
        width: SLIDE_WIDTH - 120,
        height: 60,
        fontSize: 42,
        fontFamily: "Raleway, sans-serif",
        fontWeight: "600",
        fill: textColor,
        align: "center",
        letterSpacing: -0.2,
        padding: 6,
        verticalAlign: "top",
        opacity: 1,
      },
    },
    elements: [
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
          opacity: 1,
        },
      },

      ...(imageUrl ? [
        {
          element_type: "image",
          konva_component: "Konva.Image",
          properties: {
            image_id: uuidv4(),
            imageSrc: imageUrl,
            x: 0,
            y: 0,
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT,
            opacity: 0.05,
            filters: [{ type: 'Blur', radius: 15 }],
          },
        },
      ] : []),

      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: 120,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: 120 },
          fillLinearGradientColorStops: [
            0, hexToRgba(colors.accent, 0.2),
            0.5, hexToRgba(colors.secondary, 0.12),
            1, "rgba(255, 255, 255, 0)",
          ],
          opacity: 1,
        },
      },

      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: SLIDE_WIDTH / 2 - 70,
          y: 110,
          width: 140,
          height: 2,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: SLIDE_WIDTH / 2 - 70, y: 110 },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH / 2 + 70, y: 110 },
          fillLinearGradientColorStops: [0, colors.primary, 0.5, colors.accent, 1, colors.secondary],
          cornerRadius: 1,
          opacity: 1,
        },
      },

      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: SLIDE_WIDTH / 2,
          y: 120,
          width: 1,
          height: SLIDE_HEIGHT - 120,
          fill: hexToRgba(textColor, 0.8),
          opacity: 1,
        },
      },

      ...leftCards,
      ...rightCards,

      createGradientBlob(80, 280, 100, 80, colors.secondary, colors.accent, 0.25),
      createGradientBlob(SLIDE_WIDTH - 130, 300, 80, 70, colors.accent, colors.primary, 0.25),

      // Additional decorative shape: left side circle
      {
        element_type: "shape",
        konva_component: "Konva.Circle",
        shape_id: uuidv4(),
        properties: {
          x: 40,
          y: SLIDE_HEIGHT - 80,
          radius: 30,
          fill: hexToRgba(colors.primary, 0.3),
          opacity: 0.8,
        },
      },

      // Additional decorative shape: right side triangle-ish rect
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: SLIDE_WIDTH - 60,
          y: SLIDE_HEIGHT - 100,
          width: 40,
          height: 40,
          fill: hexToRgba(colors.accent, 0.3),
          rotation: 45,
          opacity: 0.8,
        },
      },

      {
        element_type: "text",
        text: `${slideNumber}`,
        konva_component: "Konva.Text",
        properties: {
          x: SLIDE_WIDTH - 50,
          y: SLIDE_HEIGHT - 35,
          fontSize: 20,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "500",
          fill: textColor,
          align: "right",
          opacity: 1,
        },
      },
    ].flat(),
  };
};
// Helper function to darken a color (add this if not present)
function darkenColor(hex: any , amount: any) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ============= CONCLUSION SLIDE (ENHANCED) =============

const createConclusionSlide = (
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
  const slideNumber = slide.knowledge?.slideNumber || 5;

  const cardWidth = SLIDE_WIDTH - 120;
  const cardHeight = 75;
  const cardSpacing = 28;
  const startY = 170;
  const centerX = (SLIDE_WIDTH - cardWidth) / 2;

  const bulletCards: any[] = bullets.slice(0, 4).map((bullet: string, index: number) => 
    createBulletCard(centerX, startY + (index * (cardHeight + cardSpacing)), cardWidth, cardHeight, colors, index, bullet, false, textColor)
  ).flat();

  return {
    ...slide,
    slide_title: {
      text: titleText,
      konva_component: "Konva.Text",
      properties: {
        x: 60,
        y: 60,
        width: SLIDE_WIDTH - 120,
        height: 70,
        fontSize: 38,
        fontFamily: "Raleway, sans-serif",
        fontWeight: "600",
        fill: textColor,
        align: "center",
        letterSpacing: -0.3,
        padding: 8,
        verticalAlign: "top",
      },
    },
    elements: [
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

      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: 140,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: 140 },
          fillLinearGradientColorStops: [
            0, hexToRgba(colors.primary, 0.04),
            0.5, hexToRgba(colors.accent, 0.02),
            1, "rgba(255, 255, 255, 0)",
          ],
        },
      },

      // NEW: Top-left corner cluster
      createCornerTriangle(0, 0, 70, colors.primary, 'tl'),
      createCornerArc(60, 60, 45, colors.secondary, 'tl'),
      ...createCornerDots(40, 40, colors.accent, 'tl'),
      createGeometricLine(20, 75, 60, 45, hexToRgba(colors.accent, 0.4), 3),

      // NEW: Top-right corner cluster
      createCornerTriangle(SLIDE_WIDTH - 70, 0, 70, colors.accent, 'tr'),
      createCornerArc(SLIDE_WIDTH - 60, 60, 45, colors.primary, 'tr'),
      createAccentCircle(SLIDE_WIDTH - 30, 30, 15, colors.secondary, 0.3),
      createAccentCircle(SLIDE_WIDTH - 60, 60, 10, colors.accent, 0.25),
      createGeometricLine(SLIDE_WIDTH - 90, 75, 60, -45, hexToRgba(colors.secondary, 0.4), 3),

      // NEW: Bottom-left corner cluster
      createCornerTriangle(0, SLIDE_HEIGHT - 85, 85, colors.secondary, 'bl'),
      createCornerArc(70, SLIDE_HEIGHT - 70, 50, colors.accent, 'bl'),
      ...createCornerDots(45, SLIDE_HEIGHT - 45, colors.primary, 'bl'),
      createGeometricLine(20, SLIDE_HEIGHT - 30, 80, 0, hexToRgba(colors.primary, 0.4), 4),
      createAccentCircle(35, SLIDE_HEIGHT - 35, 12, colors.accent, 0.35),

      // NEW: Bottom-right corner cluster (excluding bottom bar area)
      createCornerArc(SLIDE_WIDTH - 70, SLIDE_HEIGHT - 100, 50, colors.secondary, 'br'),
      ...createCornerDots(SLIDE_WIDTH - 45, SLIDE_HEIGHT - 110, colors.accent, 'br'),
      createGeometricLine(SLIDE_WIDTH - 110, SLIDE_HEIGHT - 100, 70, 0, hexToRgba(colors.accent, 0.4), 3),
      createAccentCircle(SLIDE_WIDTH - 40, SLIDE_HEIGHT - 110, 10, colors.primary, 0.3),

      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: uuidv4(),
        properties: {
          x: SLIDE_WIDTH / 2 - 90,
          y: 130,
          width: 180,
          height: 3,
          fillPriority: "linear-gradient",
          fillLinearGradientStartPoint: { x: SLIDE_WIDTH / 2 - 90, y: 130 },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH / 2 + 90, y: 130 },
          fillLinearGradientColorStops: [0, colors.secondary, 0.5, colors.accent, 1, colors.primary],
          cornerRadius: 1.5,
          shadowBlur: 4,
          shadowColor: hexToRgba(colors.accent, 0.3),
        },
      },

      ...bulletCards,

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
            0, colors.primary,
            0.3, colors.secondary,
            0.7, colors.accent,
            1, colors.light,
          ],
          shadowBlur: 8,
          shadowColor: hexToRgba(colors.primary, 0.15),
          shadowOffsetY: -2,
        },
      },

      {
        element_type: "text",
        text: "Thank You",
        konva_component: "Konva.Text",
        properties: {
          x: 0,
          y: SLIDE_HEIGHT - 50,
          width: SLIDE_WIDTH,
          height: 40,
          fontSize: 28,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "500",
          fill: "#fffff",
          align: "center",
          letterSpacing: 0.3,
          padding: 8,
          verticalAlign: "middle",
        },
      },

      createGradientBlob(80, 80, 160, 120, colors.accent, colors.secondary, 0.05),
      createGradientBlob(SLIDE_WIDTH - 180, 70, 140, 100, colors.secondary, colors.primary, 0.05),
      createGradientBlob(SLIDE_WIDTH / 2, SLIDE_HEIGHT - 130, 120, 90, colors.accent, colors.light, 0.04),

      createAccentCircle(80, SLIDE_HEIGHT - 40, 8, textColor, 0.4),
      createAccentCircle(SLIDE_WIDTH - 80, SLIDE_HEIGHT - 40, 8, textColor, 0.4),

      {
        element_type: "text",
        text: `${slideNumber}`,
        konva_component: "Konva.Text",
        properties: {
          x: SLIDE_WIDTH - 50,
          y: 50,
          fontSize: 12,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "500",
          fill: textColor,
          align: "right",
        },
      },
    ].flat(),
  };
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
  if (imageUrl && !slide.image_url) {
    slide.image_url = imageUrl;
  }

  const artPalette = theme?.artPalette || ["#1e293b", "#3b82f6", "#f59e0b", "#f8fafc"];
  const colors = generateThemeColors(artPalette);
  
  colors.background = theme?.backgroundColor || colors.background;
  
  if (theme?.image_url) {
    colors.background = "transparent";
  }
  
  const textColor = theme ? getContrastingTextColor(theme.backgroundColor || colors.background) : "#000000";

  const layout = layoutType || slide.layout_type || "content-right-image";
  let enhancedSlide;

  switch (layout) {
    case "cover-hero":
      enhancedSlide = createCoverHeroSlide(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT);
      break;
    case "content-right-image":
      enhancedSlide = createContentRightImageSlide(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT);
      break;
    case "content-left-image":
      enhancedSlide = createContentLeftImageSlide(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT);
      break;
    case "split-content":
      enhancedSlide = createSplitContentSlide(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT);
      break;
    case "conclusion":
      enhancedSlide = createConclusionSlide(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT);
      break;
    default:
      enhancedSlide = createContentRightImageSlide(slide, colors, textColor, SLIDE_WIDTH, SLIDE_HEIGHT);
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
}
