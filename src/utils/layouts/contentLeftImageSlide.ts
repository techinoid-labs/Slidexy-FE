import { v4 as uuidv4 } from "uuid";

// Type definitions for elements
interface BaseElement {
  element_type: string;
  konva_component: string;
  shape_id?: string;
  image_id?: string;
  properties: any; // Use any for flexibility, or define specific unions below
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

export const createContentLeftImageSlide = {
  
  // Variant 1: Clean Card Layout with Elegant Spacing
  variant1: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    
    const newElements: SlideElement[] = [
      // Image container with subtle shadow and border
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 40,
          y: 100,
          width: 400,
          height: 380,
          fill: hexToRgba(colors.primary, 0.03),
          cornerRadius: 16,
          stroke: hexToRgba(colors.accent, 0.15),
          strokeWidth: 1,
          shadowColor: "rgba(0,0,0,0.06)",
          shadowBlur: 20,
          shadowOffsetY: 8,
          zIndex: 1
        }
      } as ShapeElement,
      // Accent bar on image frame
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 40,
          y: 100,
          width: 4,
          height: 380,
          fill: colors.accent,
          cornerRadius: [16, 0, 0, 16],
          zIndex: 2
        }
      } as ShapeElement
    ];

    // ✅ ADD IMAGE ELEMENT if image_url exists
    if (slide.image_url) {
      newElements.push({
        element_type: "image",
        konva_component: "Image",
        image_id: `auto-${uuidv4()}`,
        properties: {
          imageSrc: slide.image_url,
          x: 50,
          y: 110,
          width: 380,
          height: 360,
          cornerRadius: 12,
          zIndex: 1.5
        }
      } as ImageElement);
    }

    // Content bullets with checkmark icons
    newElements.push(
      ...bullets.slice(0, 4).map((bullet: any, index: number) => [
        // Checkmark circle background
        {
          element_type: "shape",
          konva_component: "Konva.Circle",
          shape_id: `auto-${uuidv4()}`,
          properties: {
            x: 480,
            y: 150 + (index * 80),
            radius: 12,
            fill: hexToRgba(colors.accent, 0.12),
            zIndex: 2
          }
        } as ShapeElement,
        // Checkmark icon (simplified V shape)
        {
          element_type: "shape",
          konva_component: "Konva.Line",
          shape_id: `auto-${uuidv4()}`,
          properties: {
            points: [474, 150 + (index * 80), 478, 154 + (index * 80), 486, 146 + (index * 80)],
            stroke: colors.accent,
            strokeWidth: 2.5,
            lineCap: "round",
            lineJoin: "round",
            zIndex: 3
          }
        } as ShapeElement,
        // Bullet text
        {
          element_type: "bullet_point",
          text: bullet.text,
          konva_component: "Text",
          properties: {
            x: 505,
            y: 138 + (index * 80),
            width: 415,
            height: 60,
            fontSize: 16,
            fontFamily: "Raleway, sans-serif",
            fontWeight: "400",
            fill: textColor,
            align: "left",
            lineHeight: 1.5,
            zIndex: 3
          }
        }
      ]).flat()
    );

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text ,
        konva_component: "Text",
        properties: {
          x: 470,
          y: 50,
          width: 450,
          height: 70,
          fontSize: 36,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "700",
          fill: textColor,
          align: "left",
          lineHeight: 1.2,
          letterSpacing: 0.5,
          zIndex: 3
        }
      },
      elements: [
        // Keep non-bullet elements from original slide
        ...(slide.elements || []).filter((el: any) => el.element_type !== "bullet_point"),
        // Add your new styled elements
        ...newElements
      ],
      background: { type: "solid", color: colors.background }
    };
  },

  // Variant 2: Modern Split with Gradient Accent
  variant2: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    const newElements: SlideElement[] = [
      // Gradient background panel for image
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 0,
          y: 0,
          width: 450,
          height: SLIDE_HEIGHT,
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: 450, y: 0 },
          fillLinearGradientColorStops: [
            0, hexToRgba(colors.primary, 0.04),
            1, "transparent"
          ],
          zIndex: 0
        }
      } as ShapeElement,
      // Image frame with rounded corners
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 50,
          y: 120,
          width: 360,
          height: 340,
          fill: hexToRgba("#ffffff", 0.5),
          cornerRadius: 20,
          stroke: hexToRgba(colors.primary, 0.2),
          strokeWidth: 2,
          shadowColor: "rgba(0,0,0,0.08)",
          shadowBlur: 25,
          shadowOffsetY: 12,
          zIndex: 1
        }
      } as ShapeElement,
      // Decorative corner element
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 50,
          y: 120,
          width: 60,
          height: 60,
          fill: colors.accent,
          cornerRadius: [20, 0, 20, 0],
          opacity: 0.9,
          zIndex: 2
        }
      } as ShapeElement
    ];

    // ✅ ADD IMAGE ELEMENT if image_url exists
    if (slide.image_url) {
      newElements.push({
        element_type: "image",
        konva_component: "Image",
        image_id: `auto-${uuidv4()}`,
        properties: {
          imageSrc: slide.image_url,
          x: 60,
          y: 130,
          width: 340,
          height: 320,
          cornerRadius: 16,
          zIndex: 1.5
        }
      } as ImageElement);
    }

    // Bullets with numbered badges
    newElements.push(
      ...bullets.slice(0, 4).map((bullet: any, index: number) => [
        // Number badge background
        {
          element_type: "shape",
          konva_component: "Konva.Rect",
          shape_id: `auto-${uuidv4()}`,
          properties: {
            x: 480,
            y: 140 + (index * 75),
            width: 32,
            height: 32,
            fill: hexToRgba(colors.accent, 0.15),
            cornerRadius: 8,
            zIndex: 2
          }
        } as ShapeElement,
        // Number text
        {
          element_type: "text",
          text: `${index + 1}`,
          konva_component: "Text",
          properties: {
            x: 480,
            y: 147 + (index * 75),
            width: 32,
            height: 32,
            fontSize: 16,
            fontFamily: "Raleway, sans-serif",
            fontWeight: "700",
            fill: colors.accent,
            align: "center",
            zIndex: 3
          }
        },
        // Bullet text
        {
          element_type: "bullet_point",
          text: bullet.text,
          konva_component: "Text",
          properties: {
            x: 525,
            y: 142 + (index * 75),
            width: 395,
            height: 55,
            fontSize: 15,
            fontFamily: "Raleway, sans-serif",
            fontWeight: "400",
            fill: textColor,
            align: "left",
            lineHeight: 1.5,
            zIndex: 3
          }
        }
      ]).flat()
    );

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Image-Driven Narrative",
        konva_component: "Text",
        properties: {
          x: 470,
          y: 60,
          width: 450,
          height: 60,
          fontSize: 32,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "700",
          fill: textColor,
          align: "left",
          lineHeight: 1.2,
          zIndex: 3
        }
      },
      elements: [
        // Keep non-bullet elements from original slide
        ...(slide.elements || []).filter((el: any) => el.element_type !== "bullet_point"),
        // Add your new styled elements
        ...newElements
      ],
      background: { type: "solid", color: colors.background }
    };
  },

  // Variant 3: Minimalist with Subtle Dividers
  variant3: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    const newElements: SlideElement[] = [
      // Clean image container
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 60,
          y: 110,
          width: 370,
          height: 360,
          fill: hexToRgba(colors.secondary, 0.04),
          cornerRadius: 12,
          stroke: hexToRgba(colors.primary, 0.1),
          strokeWidth: 1,
          zIndex: 1
        }
      } as ShapeElement,
      // Vertical divider line
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 455,
          y: 110,
          width: 2,
          height: 360,
          fill: hexToRgba(colors.accent, 0.2),
          zIndex: 1
        }
      } as ShapeElement
    ];

    // ✅ ADD IMAGE ELEMENT if image_url exists
    if (slide.image_url) {
      newElements.push({
        element_type: "image",
        konva_component: "Image",
        image_id: `auto-${uuidv4()}`,
        properties: {
          imageSrc: slide.image_url,
          x: 70,
          y: 120,
          width: 350,
          height: 340,
          cornerRadius: 8,
          zIndex: 1.5
        }
      } as ImageElement);
    }

    // Bullets with minimal dots
    newElements.push(
      ...bullets.slice(0, 4).map((bullet: any, index: number) => [
        // Dot indicator
        {
          element_type: "shape",
          konva_component: "Konva.Circle",
          shape_id: `auto-${uuidv4()}`,
          properties: {
            x: 490,
            y: 150 + (index * 75),
            radius: 5,
            fill: colors.accent,
            zIndex: 2
          }
        } as ShapeElement,
        // Bullet text
        {
          element_type: "bullet_point",
          text: bullet.text,
          konva_component: "Text",
          properties: {
            x: 510,
            y: 138 + (index * 75),
            width: 410,
            height: 60,
            fontSize: 16,
            fontFamily: "Raleway, sans-serif",
            fontWeight: "400",
            fill: textColor,
            align: "left",
            lineHeight: 1.5,
            zIndex: 3
          }
        },
        // Subtle underline (except last)
        ...(index < 3 ? [{
          element_type: "shape",
          konva_component: "Konva.Rect",
          shape_id: `auto-${uuidv4()}`,
          properties: {
            x: 490,
            y: 188 + (index * 75),
            width: 410,
            height: 1,
            fill: hexToRgba(textColor, 0.08),
            zIndex: 2
          }
        }] : []) as ShapeElement[]
      ]).flat()
    );

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Harmonized Layout",
        konva_component: "Text",
        properties: {
          x: 480,
          y: 50,
          width: 440,
          height: 50,
          fontSize: 30,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "600",
          fill: textColor,
          align: "left",
          lineHeight: 1.2,
          zIndex: 3
        }
      },
      elements: [
        // Keep non-bullet elements from original slide
        ...(slide.elements || []).filter((el: any) => el.element_type !== "bullet_point"),
        // Add your new styled elements
        ...newElements
      ],
      background: { type: "solid", color: colors.background }
    };
  },

  // Variant 4: Card Stack with Depth
  variant4: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    const newElements: SlideElement[] = [
      // Layered shadow effect (back layer)
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 70,
          y: 125,
          width: 360,
          height: 340,
          fill: hexToRgba(colors.primary, 0.06),
          cornerRadius: 16,
          zIndex: 0
        }
      } as ShapeElement,
      // Main image card
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 60,
          y: 115,
          width: 360,
          height: 340,
          fill: hexToRgba("#ffffff", 0.8),
          cornerRadius: 16,
          stroke: hexToRgba(colors.primary, 0.15),
          strokeWidth: 1.5,
          shadowColor: "rgba(0,0,0,0.1)",
          shadowBlur: 20,
          shadowOffsetY: 10,
          zIndex: 1
        }
      } as ShapeElement,
      // Content card background
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 470,
          y: 130,
          width: 450,
          height: 340,
          fill: hexToRgba(colors.surface || "#ffffff", 0.5),
          cornerRadius: 12,
          stroke: hexToRgba(colors.primary, 0.08),
          strokeWidth: 1,
          zIndex: 1
        }
      } as ShapeElement
    ];

    // ✅ ADD IMAGE ELEMENT if image_url exists
    if (slide.image_url) {
      newElements.push({
        element_type: "image",
        konva_component: "Image",
        image_id: `auto-${uuidv4()}`,
        properties: {
          imageSrc: slide.image_url,
          x: 70,
          y: 125,
          width: 340,
          height: 320,
          cornerRadius: 12,
          zIndex: 1.5
        }
      } as ImageElement);
    }

    // Bullets with icon placeholders
    newElements.push(
      ...bullets.slice(0, 4).map((bullet: any, index: number) => [
        // Icon background square
        {
          element_type: "shape",
          konva_component: "Konva.Rect",
          shape_id: `auto-${uuidv4()}`,
          properties: {
            x: 495,
            y: 155 + (index * 70),
            width: 28,
            height: 28,
            fill: hexToRgba(colors.accent, 0.1),
            cornerRadius: 6,
            zIndex: 2
          }
        } as ShapeElement,
        // Icon dot
        {
          element_type: "shape",
          konva_component: "Konva.Circle",
          shape_id: `auto-${uuidv4()}`,
          properties: {
            x: 509,
            y: 169 + (index * 70),
            radius: 4,
            fill: colors.accent,
            zIndex: 3
          }
        } as ShapeElement,
        // Bullet text
        {
          element_type: "bullet_point",
          text: bullet.text,
          konva_component: "Text",
          properties: {
            x: 540,
            y: 156 + (index * 70),
            width: 360,
            height: 55,
            fontSize: 15,
            fontFamily: "Raleway, sans-serif",
            fontWeight: "400",
            fill: textColor,
            align: "left",
            lineHeight: 1.5,
            zIndex: 3
          }
        }
      ]).flat()
    );

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Content Emphasis",
        konva_component: "Text",
        properties: {
          x: 60,
          y: 45,
          width: 860,
          height: 60,
          fontSize: 34,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "700",
          fill: textColor,
          align: "left",
          lineHeight: 1.2,
          zIndex: 3
        }
      },
      elements: [
        // Keep non-bullet elements from original slide
        ...(slide.elements || []).filter((el: any) => el.element_type !== "bullet_point"),
        // Add your new styled elements
        ...newElements
      ],
      background: { type: "solid", color: colors.background }
    };
  },

  // Variant 5: Contemporary with Accent Bar
  variant5: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    const newElements: SlideElement[] = [
      // Accent bar on left edge
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 0,
          y: 0,
          width: 6,
          height: SLIDE_HEIGHT,
          fill: colors.accent,
          zIndex: 2
        }
      } as ShapeElement,
      // Image container with soft edges
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 50,
          y: 120,
          width: 380,
          height: 360,
          fill: hexToRgba(colors.primary, 0.02),
          cornerRadius: 18,
          stroke: hexToRgba(colors.accent, 0.12),
          strokeWidth: 1,
          shadowColor: "rgba(0,0,0,0.05)",
          shadowBlur: 15,
          shadowOffsetY: 6,
          zIndex: 1
        }
      } as ShapeElement,
      // Decorative circle accent
      {
        element_type: "shape",
        konva_component: "Konva.Circle",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 410,
          y: 140,
          radius: 20,
          fill: colors.accent,
          opacity: 0.2,
          zIndex: 2
        }
      } as ShapeElement
    ];

    // ✅ ADD IMAGE ELEMENT if image_url exists
    if (slide.image_url) {
      newElements.push({
        element_type: "image",
        konva_component: "Image",
        image_id: `auto-${uuidv4()}`,
        properties: {
          imageSrc: slide.image_url,
          x: 60,
          y: 130,
          width: 360,
          height: 340,
          cornerRadius: 14,
          zIndex: 1.5
        }
      } as ImageElement);
    }

    // Bullets with progressive fade
    newElements.push(
      ...bullets.slice(0, 4).map((bullet: any, index: number) => [
        // Left accent line
        {
          element_type: "shape",
          konva_component: "Konva.Rect",
          shape_id: `auto-${uuidv4()}`,
          properties: {
            x: 465,
            y: 150 + (index * 75),
            width: 3,
            height: 40,
            fill: hexToRgba(colors.accent, 0.3 - (index * 0.05)),
            cornerRadius: 2,
            zIndex: 2
          }
        } as ShapeElement,
        // Bullet text
        {
          element_type: "bullet_point",
          text: bullet.text,
          konva_component: "Text",
          properties: {
            x: 485,
            y: 145 + (index * 75),
            width: 425,
            height: 60,
            fontSize: 16,
            fontFamily: "Raleway, sans-serif",
            fontWeight: "400",
            fill: textColor,
            align: "left",
            lineHeight: 1.5,
            opacity: 1 - (index * 0.05),
            zIndex: 3
          }
        }
      ]).flat()
    );

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Contemporary Design",
        konva_component: "Text",
        properties: {
          x: 460,
          y: 55,
          width: 450,
          height: 60,
          fontSize: 32,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "700",
          fill: textColor,
          align: "left",
          lineHeight: 1.2,
          letterSpacing: 0.3,
          zIndex: 3
        }
      },
      elements: [
        // Keep non-bullet elements from original slide
        ...(slide.elements || []).filter((el: any) => el.element_type !== "bullet_point"),
        // Add your new styled elements
        ...newElements
      ],
      background: { type: "solid", color: colors.background }
    };
  }
};