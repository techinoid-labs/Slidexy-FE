import { v4 as uuidv4 } from "uuid";

// Type definitions for elements
interface BaseElement {
  element_type: string;
  konva_component: string;
  shape_id?: string;
  image_id?: string;
  properties: any;
}

interface ShapeElement extends BaseElement {
  element_type: "shape";
  shape_id: string;
  konva_component: "Konva.Rect" | "Konva.Circle" | "Konva.Ellipse" | "Konva.Line";
  properties: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    radius?: number;
    radiusX?: number;
    radiusY?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    cornerRadius?: number | number[];
    rotation?: number;
    offsetX?: number;
    offsetY?: number;
    points?: number[];
    tension?: number;
    lineCap?: string;
    lineJoin?: string;
    dash?: number[];
    fillLinearGradientStartPoint?: { x: number; y: number };
    fillLinearGradientEndPoint?: { x: number; y: number };
    fillLinearGradientColorStops?: number[];
    fillRadialGradientStartPoint?: { x: number; y: number };
    fillRadialGradientEndPoint?: { x: number; y: number };
    fillRadialGradientStartRadius?: number;
    fillRadialGradientEndRadius?: number;
    fillRadialGradientColorStops?: number[];
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    opacity?: number;
    zIndex?: number;
    scaleY?: number;
    strokeLinearGradientStartPoint?: { x: number; y: number };
    strokeLinearGradientEndPoint?: { x: number; y: number };
    strokeLinearGradientColorStops?: number[];
  };
}

interface ImageElement extends BaseElement {
  element_type: "image";
  image_id: string;
  konva_component: "Image";
  properties: {
    imageSrc: string;
    x: number;
    y: number;
    width: number;
    height: number;
    cornerRadius?: number;
    opacity?: number;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetY?: number;
    zIndex?: number;
  };
}

type SlideElement = ShapeElement | ImageElement;

const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = hex.startsWith('#') ? hex : `#${hex}`;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const createQuoteSlide = {
  variant1: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const quote = slide.elements?.find((el: any) => el.element_type === "quote");
    const author = slide.elements?.find((el: any) => el.element_type === "author");
    const elements: SlideElement[] = [];

    // ✅ ADD IMAGE as background if image_url exists
    if (slide.image_url) {
      elements.push({
        element_type: "image",
        konva_component: "Image",
        image_id: `auto-${uuidv4()}`,
        properties: {
          imageSrc: slide.image_url,
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          opacity: 0.2,
          zIndex: 0
        }
      } as ImageElement);
    } else {
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background, zIndex: 0 }
      } as ShapeElement);
    }

    // Elegant quote marks
    elements.push(
      {
        element_type: "text",
        text: "",
        konva_component: "Text",
        properties: {
          x: 80,
          y: SLIDE_HEIGHT / 2 - 60,
          width: 80,
          height: 80,
          fontSize: 100,
          fontFamily: "'Georgia', serif",
          fontWeight: "bold",
          fill: hexToRgba(colors.accent, 0.35),
          scaleY: 0.8,
          zIndex: 2
        }
      } as any,
      {
        element_type: "text",
        text: "",
        konva_component: "Text",
        properties: {
          x: SLIDE_WIDTH - 160,
          y: SLIDE_HEIGHT / 2 - 60,
          width: 80,
          height: 80,
          fontSize: 100,
          fontFamily: "'Georgia', serif",
          fontWeight: "bold",
          fill: hexToRgba(colors.accent, 0.35),
          scaleY: 0.8,
          zIndex: 2
        }
      } as any
    );

    // ✅ CRITICAL FIX: Add the actual quote text as an element
    if (quote?.text) {
      elements.push({
        element_type: "text",
        text: quote.text,
        konva_component: "Text",
        properties: {
          x: 100,
          y: SLIDE_HEIGHT / 2 - 80,
          width: SLIDE_WIDTH - 200,
          height: 160,
          fontSize: 32,
          fontFamily: "'Georgia', serif",
          fontWeight: "300",
          fontStyle: "italic",
          fill: textColor,
          align: "center",
          lineHeight: 1.4,
          shadowColor: hexToRgba(textColor, 0.2),
          shadowBlur: 12,
          shadowOffsetY: 6,
          letterSpacing: 0.5,
          zIndex: 3
        }
      } as any);
    }

    // Author
    if (author?.text) {
      elements.push({
        element_type: "text",
        text: author.text,
        konva_component: "Text",
        properties: {
          x: SLIDE_WIDTH - 300,
          y: SLIDE_HEIGHT / 2 + 60,
          width: 250,
          height: 40,
          fontSize: 18,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "600",
          fill: hexToRgba(textColor, 0.75),
          align: "right",
          lineHeight: 1.2,
          zIndex: 3
        }
      } as any);
    }

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Expert Perspective",
        konva_component: "Text",
        properties: {
          x: 80,
          y: 80,
          width: SLIDE_WIDTH - 160,
          height: 60,
          fontSize: 36,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "700",
          fill: textColor,
          align: "center",
          lineHeight: 1.2,
          zIndex: 3
        }
      },
      elements
    };
  },

  variant2: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const quote = slide.elements?.find((el: any) => el.element_type === "quote");
    const elements: SlideElement[] = [];

    if (slide.image_url) {
      elements.push({
        element_type: "image",
        konva_component: "Image",
        image_id: `auto-${uuidv4()}`,
        properties: {
          imageSrc: slide.image_url,
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          opacity: 0.2,
          zIndex: 0
        }
      } as ImageElement);
    } else {
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background, zIndex: 0 }
      } as ShapeElement);
    }

    // Subtle accent bar
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      shape_id: `auto-${uuidv4()}`,
      properties: {
        x: SLIDE_WIDTH / 2 - 150,
        y: SLIDE_HEIGHT / 2 + 40,
        width: 300,
        height: 4,
        fill: colors.accent,
        cornerRadius: 2,
        dash: [10, 5],
        zIndex: 1
      }
    } as ShapeElement);

    // ✅ CRITICAL FIX: Add the actual quote text as an element
    if (quote?.text) {
      elements.push({
        element_type: "text",
        text: quote.text,
        konva_component: "Text",
        properties: {
          x: SLIDE_WIDTH / 2 - 300,
          y: SLIDE_HEIGHT / 2 - 60,
          width: 600,
          height: 120,
          fontSize: 36,
          fontFamily: "'Playfair Display', serif",
          fontWeight: "600",
          fill: textColor,
          align: "center",
          lineHeight: 1.3,
          shadowColor: hexToRgba(textColor, 0.18),
          shadowBlur: 10,
          shadowOffsetY: 5,
          zIndex: 3
        }
      } as any);
    }

    // Contextual note
    elements.push({
      element_type: "text",
      text: "— In the words of a visionary",
      konva_component: "Text",
      properties: {
        x: SLIDE_WIDTH / 2 - 150,
        y: SLIDE_HEIGHT / 2 + 60,
        width: 300,
        height: 30,
        fontSize: 16,
        fontFamily: "Raleway, sans-serif",
        fontWeight: "400",
        fill: hexToRgba(textColor, 0.7),
        align: "center",
        fontStyle: "italic",
        zIndex: 3
      }
    } as any);

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Profound Insight",
        konva_component: "Text",
        properties: {
          x: 80,
          y: 80,
          width: SLIDE_WIDTH - 160,
          height: 60,
          fontSize: 36,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "700",
          fill: textColor,
          align: "center",
          lineHeight: 1.2,
          zIndex: 3
        }
      },
      elements
    };
  },

  variant3: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const quote = slide.elements?.find((el: any) => el.element_type === "quote");
    const author = slide.elements?.find((el: any) => el.element_type === "author");
    const context = slide.elements?.find((el: any) => el.element_type === "context");
    const elements: SlideElement[] = [];

    if (slide.image_url) {
      elements.push({
        element_type: "image",
        konva_component: "Image",
        image_id: `auto-${uuidv4()}`,
        properties: {
          imageSrc: slide.image_url,
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          opacity: 0.2,
          zIndex: 0
        }
      } as ImageElement);
    } else {
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background, zIndex: 0 }
      } as ShapeElement);
    }

    // Subtle frame
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      shape_id: `auto-${uuidv4()}`,
      properties: {
        x: 140,
        y: 170,
        width: SLIDE_WIDTH - 280,
        height: 200,
        fill: "transparent",
        cornerRadius: 12,
        stroke: hexToRgba(colors.accent, 0.25),
        strokeWidth: 2,
        dash: [8, 4],
        zIndex: 1
      }
    } as ShapeElement);

    // ✅ CRITICAL FIX: Add the actual quote text as an element
    if (quote?.text) {
      elements.push({
        element_type: "text",
        text: quote.text,
        konva_component: "Text",
        properties: {
          x: 150,
          y: 180,
          width: SLIDE_WIDTH - 300,
          height: 120,
          fontSize: 28,
          fontFamily: "'Georgia', serif",
          fontWeight: "400",
          fontStyle: "italic",
          fill: textColor,
          align: "center",
          lineHeight: 1.4,
          shadowColor: hexToRgba(textColor, 0.15),
          shadowBlur: 8,
          zIndex: 3
        }
      } as any);
    }

    // Author
    if (author?.text) {
      elements.push({
        element_type: "text",
        text: author.text,
        konva_component: "Text",
        properties: {
          x: SLIDE_WIDTH - 300,
          y: 320,
          width: 200,
          height: 30,
          fontSize: 18,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "600",
          fill: hexToRgba(textColor, 0.75),
          align: "right",
          lineHeight: 1.2,
          zIndex: 3
        }
      } as any);
    }

    // Context
    if (context?.text) {
      elements.push({
        element_type: "text",
        text: context.text,
        konva_component: "Text",
        properties: {
          x: 150,
          y: 360,
          width: SLIDE_WIDTH - 300,
          height: 40,
          fontSize: 16,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "300",
          fill: hexToRgba(textColor, 0.6),
          align: "center",
          lineHeight: 1.3,
          zIndex: 3
        }
      } as any);
    }

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Enduring Perspective",
        konva_component: "Text",
        properties: {
          x: 80,
          y: 80,
          width: SLIDE_WIDTH - 160,
          height: 60,
          fontSize: 36,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "700",
          fill: textColor,
          align: "center",
          lineHeight: 1.2,
          zIndex: 3
        }
      },
      elements
    };
  },

  variant4: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const quote = slide.elements?.find((el: any) => el.element_type === "quote");
    const elements: SlideElement[] = [];

    if (slide.image_url) {
      elements.push({
        element_type: "image",
        konva_component: "Image",
        image_id: `auto-${uuidv4()}`,
        properties: {
          imageSrc: slide.image_url,
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          opacity: 0.2,
          zIndex: 0
        }
      } as ImageElement);
    } else {
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background, zIndex: 0 }
      } as ShapeElement);
    }

    // Central circle backdrop
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Circle",
      shape_id: `auto-${uuidv4()}`,
      properties: {
        x: SLIDE_WIDTH / 2,
        y: SLIDE_HEIGHT / 2,
        radius: 200,
        fill: hexToRgba(colors.primary, 0.12),
        shadowColor: hexToRgba(colors.primary, 0.15),
        shadowBlur: 25,
        zIndex: 1
      }
    } as ShapeElement);

    // ✅ CRITICAL FIX: Add the actual quote text as an element
    if (quote?.text) {
      elements.push({
        element_type: "text",
        text: quote.text,
        konva_component: "Text",
        properties: {
          x: 100,
          y: 200,
          width: SLIDE_WIDTH - 200,
          height: 100,
          fontSize: 34,
          fontFamily: "'Playfair Display', serif",
          fontWeight: "500",
          fill: textColor,
          align: "center",
          lineHeight: 1.3,
          shadowColor: hexToRgba(textColor, 0.2),
          shadowBlur: 12,
          shadowOffsetY: 6,
          zIndex: 3
        }
      } as any);
    }

    // Quote separator
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      shape_id: `auto-${uuidv4()}`,
      properties: {
        x: SLIDE_WIDTH / 2 - 100,
        y: SLIDE_HEIGHT / 2 + 20,
        width: 200,
        height: 2,
        fill: hexToRgba(colors.accent, 0.6),
        cornerRadius: 1,
        zIndex: 2
      }
    } as ShapeElement);

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Reflective Thought",
        konva_component: "Text",
        properties: {
          x: 80,
          y: 80,
          width: SLIDE_WIDTH - 160,
          height: 60,
          fontSize: 36,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "700",
          fill: textColor,
          align: "center",
          lineHeight: 1.2,
          zIndex: 3
        }
      },
      elements
    };
  },

  variant5: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const quote = slide.elements?.find((el: any) => el.element_type === "quote");
    const author = slide.elements?.find((el: any) => el.element_type === "author");
    const elements: SlideElement[] = [];

    if (slide.image_url) {
      elements.push({
        element_type: "image",
        konva_component: "Image",
        image_id: `auto-${uuidv4()}`,
        properties: {
          imageSrc: slide.image_url,
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          opacity: 0.2,
          zIndex: 0
        }
      } as ImageElement);
    } else {
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background, zIndex: 0 }
      } as ShapeElement);
    }

    // Border with enhanced stroke
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      shape_id: `auto-${uuidv4()}`,
      properties: {
        x: 100,
        y: 140,
        width: SLIDE_WIDTH - 200,
        height: 160,
        fill: "transparent",
        cornerRadius: 12,
        strokeLinearGradientStartPoint: { x: 0, y: 0 },
        strokeLinearGradientEndPoint: { x: SLIDE_WIDTH - 200, y: 0 },
        strokeLinearGradientColorStops: [0, hexToRgba(colors.accent, 0.4), 1, hexToRgba(colors.primary, 0.3)],
        strokeWidth: 3,
        zIndex: 1
      }
    } as ShapeElement);

    // ✅ CRITICAL FIX: Add the actual quote text as an element
    if (quote?.text) {
      elements.push({
        element_type: "text",
        text: quote.text,
        konva_component: "Text",
        properties: {
          x: 120,
          y: 150,
          width: SLIDE_WIDTH - 240,
          height: 140,
          fontSize: 30,
          fontFamily: "'Georgia', serif",
          fontWeight: "300",
          fontStyle: "italic",
          fill: textColor,
          align: "center",
          lineHeight: 1.4,
          shadowColor: hexToRgba(textColor, 0.18),
          shadowBlur: 10,
          zIndex: 3
        }
      } as any);
    }

    // Author
    if (author?.text) {
      elements.push({
        element_type: "text",
        text: author.text,
        konva_component: "Text",
        properties: {
          x: SLIDE_WIDTH / 2 - 100,
          y: SLIDE_HEIGHT - 100,
          width: 200,
          height: 40,
          fontSize: 18,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "600",
          fill: hexToRgba(textColor, 0.8),
          align: "center",
          zIndex: 3
        }
      } as any);
    }

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Featured Reflection",
        konva_component: "Text",
        properties: {
          x: 80,
          y: 80,
          width: SLIDE_WIDTH - 160,
          height: 60,
          fontSize: 36,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "700",
          fill: textColor,
          align: "center",
          lineHeight: 1.2,
          zIndex: 3
        }
      },
      elements
    };
  }
};