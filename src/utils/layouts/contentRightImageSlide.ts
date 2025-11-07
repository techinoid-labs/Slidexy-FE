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
    fillLinearGradientColorStops?: (number | string)[];
    fillRadialGradientStartPoint?: { x: number; y: number };
    fillRadialGradientEndPoint?: { x: number; y: number };
    fillRadialGradientStartRadius?: number;
    fillRadialGradientEndRadius?: number;
    fillRadialGradientColorStops?: (number | string)[]; // ✅ FIXED HERE
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

const createGradientBlob = (
  x: number, 
  y: number, 
  radiusX: number, 
  radiusY: number, 
  color1: string, 
  color2: string, 
  opacity: number
): ShapeElement => ({
  element_type: "shape",
  konva_component: "Konva.Ellipse",
  shape_id: `auto-${uuidv4()}`,
  properties: {
    x, y, radiusX, radiusY,
    fillRadialGradientStartPoint: { x: 0, y: 0 },
    fillRadialGradientEndPoint: { x: 0, y: 0 },
    fillRadialGradientStartRadius: 0,
    fillRadialGradientEndRadius: Math.max(radiusX, radiusY),
    fillRadialGradientColorStops: [0, hexToRgba(color1, opacity), 1, hexToRgba(color2, 0)],
    shadowColor: hexToRgba(color1, 0.12),
    shadowBlur: 25,
    shadowOffsetY: 12,
    opacity: 0.9,
    zIndex: 1
  }
});

export const createContentRightImageSlide = {
  // Variant 1: Professional Sidebar
  variant1: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    const newElements: SlideElement[] = [
      // Content card
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 40,
          y: 120,
          width: 440,
          height: SLIDE_HEIGHT - 160,
          fill: hexToRgba(colors.surface || "#ffffff", 0.98),
          cornerRadius: 24,
          shadowColor: "rgba(0,0,0,0.12)",
          shadowBlur: 30,
          shadowOffsetY: 10,
          shadowOffsetX: 4,
          zIndex: 1
        }
      } as ShapeElement,
      
      // Gradient accent line
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 60,
          y: 140,
          width: 4,
          height: 80,
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: 0, y: 80 },
          fillLinearGradientColorStops: [0, colors.accent, 1, hexToRgba(colors.primary, 0.8)],
          cornerRadius: 2,
          zIndex: 2
        }
      } as ShapeElement,
      
      // Image frame
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 520,
          y: 80,
          width: 400,
          height: 380,
          fill: hexToRgba(colors.primary, 0.06),
          cornerRadius: 20,
          stroke: hexToRgba(colors.accent, 0.25),
          strokeWidth: 3,
          shadowColor: hexToRgba(colors.accent, 0.12),
          shadowBlur: 15,
          shadowOffsetY: 8,
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
          x: 530,
          y: 90,
          width: 380,
          height: 360,
          cornerRadius: 16,
          zIndex: 1.5
        }
      } as ImageElement);
    }
    
    // Numbered bullets
    newElements.push(
      ...bullets.slice(0, 4).map((bullet: any, index: number) => ({
        element_type: "bullet_point",
        text: `${index + 1}. ${bullet.text}`,
        konva_component: "Text",
        properties: {
          x: 80,
          y: 150 + (index * 70),
          width: 380,
          height: 60,
          fontSize: 18,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "500",
          fill: textColor,
          lineHeight: 1.4,
          align: "left",
          shadowColor: hexToRgba(textColor, 0.1),
          shadowBlur: 6,
          letterSpacing: 0.5,
          zIndex: 2
        }
      }))
    );

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text ,
        konva_component: "Text",
        properties: {
          x: 60,
          y: 40,
          width: 440,
          height: 60,
          fontSize: 36,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "800",
          fill: textColor,
          align: "left",
          lineHeight: 1.2,
          shadowColor: hexToRgba(textColor, 0.2),
          shadowBlur: 12,
          shadowOffsetY: 6,
          zIndex: 2
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

  // Variant 2: Dynamic Workflow
  variant2: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    const newElements: SlideElement[] = [
      // Vertical accent bar
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 465,
          y: 0,
          width: 15,
          height: SLIDE_HEIGHT,
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: 0, y: SLIDE_HEIGHT },
          fillLinearGradientColorStops: [
            0, hexToRgba(colors.accent, 0.3),
            1, hexToRgba(colors.primary, 0.2)
          ],
          cornerRadius: 8,
          zIndex: 1
        }
      } as ShapeElement,
      
      // Content card
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 40,
          y: 110,
          width: 440,
          height: SLIDE_HEIGHT - 150,
          fill: hexToRgba(colors.surface || "#ffffff", 0.96),
          cornerRadius: 16,
          shadowColor: "rgba(0,0,0,0.08)",
          shadowBlur: 20,
          shadowOffsetY: 8,
          shadowOffsetX: 2,
          zIndex: 1
        }
      } as ShapeElement,
      
      // Image frame
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 500,
          y: 60,
          width: 420,
          height: 420,
          fill: hexToRgba(colors.primary, 0.04),
          cornerRadius: 16,
          stroke: colors.accent,
          strokeWidth: 2,
          shadowColor: hexToRgba(colors.primary, 0.2),
          shadowBlur: 20,
          shadowOffsetY: 10,
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
          x: 510,
          y: 70,
          width: 400,
          height: 400,
          cornerRadius: 12,
          zIndex: 1.5
        }
      } as ImageElement);
    }
    
    // Checkmark bullets
    newElements.push(
      ...bullets.slice(0, 4).map((bullet: any, index: number) => [
        {
          element_type: "shape",
          konva_component: "Konva.Line",
          shape_id: `auto-${uuidv4()}`,
          properties: {
            points: [64, 146 + (index * 65), 70, 152 + (index * 65), 78, 142 + (index * 65)],
            stroke: colors.accent,
            strokeWidth: 3,
            lineCap: "round",
            lineJoin: "round",
            zIndex: 2
          }
        } as ShapeElement,
        {
          element_type: "bullet_point",
          text: bullet.text,
          konva_component: "Text",
          properties: {
            x: 95,
            y: 140 + (index * 65),
            width: 360,
            height: 55,
            fontSize: 17,
            fontFamily: "Raleway, sans-serif",
            fontWeight: "400",
            fill: textColor,
            lineHeight: 1.5,
            align: "left",
            shadowColor: hexToRgba(textColor, 0.08),
            shadowBlur: 5,
            zIndex: 2
          }
        }
      ]).flat()
    );

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Dynamic Workflow",
        konva_component: "Text",
        properties: {
          x: 60,
          y: 30,
          width: 400,
          height: 70,
          fontSize: 38,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "900",
          fill: textColor,
          align: "left",
          lineHeight: 1.1,
          shadowColor: hexToRgba(textColor, 0.25),
          shadowBlur: 15,
          shadowOffsetY: 8,
          zIndex: 2
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

  // Variant 3: Grid Layout
  variant3: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    const newElements: SlideElement[] = [
      // Gradient background
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: SLIDE_HEIGHT },
          fillLinearGradientColorStops: [
            0, hexToRgba(colors.primary, 0.04),
            1, hexToRgba(colors.secondary, 0.04)
          ],
          zIndex: 0
        }
      } as ShapeElement,
      
      // Grid cards
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 40,
          y: 120,
          width: 220,
          height: 200,
          fill: hexToRgba(colors.surface || "#ffffff", 0.97),
          cornerRadius: 16,
          shadowColor: "rgba(0,0,0,0.06)",
          shadowBlur: 18,
          zIndex: 1
        }
      } as ShapeElement,
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 270,
          y: 120,
          width: 220,
          height: 200,
          fill: hexToRgba(colors.surface || "#ffffff", 0.97),
          cornerRadius: 16,
          shadowColor: "rgba(0,0,0,0.06)",
          shadowBlur: 18,
          zIndex: 1
        }
      } as ShapeElement,
      
      // Panoramic image
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 40,
          y: 340,
          width: 880,
          height: 180,
          fill: hexToRgba(colors.primary, 0.02),
          cornerRadius: 20,
          stroke: hexToRgba(colors.accent, 0.15),
          strokeWidth: 2,
          shadowColor: hexToRgba(colors.accent, 0.08),
          shadowBlur: 12,
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
          x: 50,
          y: 350,
          width: 860,
          height: 160,
          cornerRadius: 16,
          zIndex: 1.5
        }
      } as ImageElement);
    }
    
    // Grid bullets
    newElements.push(
      ...bullets.slice(0, 2).map((bullet: any, index: number) => ({
        element_type: "bullet_point",
        text: bullet.text,
        konva_component: "Text",
        properties: {
          x: 60,
          y: 150 + (index * 90),
          width: 180,
          height: 80,
          fontSize: 16,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "400",
          fill: textColor,
          lineHeight: 1.3,
          align: "left",
          zIndex: 2
        }
      })),
      ...bullets.slice(2, 4).map((bullet: any, index: number) => ({
        element_type: "bullet_point",
        text: bullet.text,
        konva_component: "Text",
        properties: {
          x: 290,
          y: 150 + (index * 90),
          width: 180,
          height: 80,
          fontSize: 16,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "400",
          fill: textColor,
          lineHeight: 1.3,
          align: "left",
          zIndex: 2
        }
      }))
    );

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Integrated Grid",
        konva_component: "Text",
        properties: {
          x: 60,
          y: 40,
          width: 440,
          height: 60,
          fontSize: 36,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "800",
          fill: textColor,
          align: "left",
          lineHeight: 1.2,
          shadowColor: hexToRgba(textColor, 0.2),
          shadowBlur: 12,
          zIndex: 2
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

  // Variant 4: Clean Minimal
  variant4: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    const newElements: SlideElement[] = [
      // Brand sidebar
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 0,
          y: 120,
          width: 40,
          height: SLIDE_HEIGHT - 140,
          fill: hexToRgba(colors.primary, 0.9),
          shadowColor: hexToRgba(colors.primary, 0.25),
          shadowBlur: 12,
          shadowOffsetX: 6,
          zIndex: 1
        }
      } as ShapeElement,
      
      // Content card
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 60,
          y: 130,
          width: 420,
          height: SLIDE_HEIGHT - 170,
          fill: colors.surface || "#ffffff",
          cornerRadius: 12,
          shadowColor: "rgba(0,0,0,0.04)",
          shadowBlur: 12,
          shadowOffsetY: 4,
          zIndex: 1
        }
      } as ShapeElement,
      
      // Image frame
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 520,
          y: 100,
          width: 380,
          height: 340,
          fill: hexToRgba(colors.accent, 0.01),
          stroke: hexToRgba(colors.primary, 0.1),
          strokeWidth: 1.5,
          cornerRadius: 12,
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
          x: 530,
          y: 110,
          width: 360,
          height: 320,
          cornerRadius: 8,
          zIndex: 1.5
        }
      } as ImageElement);
    }
    
    // Clean bullets
    newElements.push(
      ...bullets.slice(0, 4).map((bullet: any, index: number) => ({
        element_type: "bullet_point",
        text: bullet.text,
        konva_component: "Text",
        properties: {
          x: 80,
          y: 160 + (index * 60),
          width: 380,
          height: 50,
          fontSize: 16,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "400",
          fill: textColor,
          align: "left",
          lineHeight: 1.4,
          letterSpacing: 0.3,
          zIndex: 2
        }
      }))
    );

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Executive Summary",
        konva_component: "Text",
        properties: {
          x: 60,
          y: 50,
          width: 440,
          height: 60,
          fontSize: 34,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "700",
          fill: textColor,
          align: "left",
          lineHeight: 1.1,
          zIndex: 2
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

  // Variant 5: Gradient Overlay
  variant5: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540): any => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    const newElements: SlideElement[] = [
      // Gradient background
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          fillLinearGradientStartPoint: { x: 0, y: SLIDE_HEIGHT },
          fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: 0 },
          fillLinearGradientColorStops: [
            0, colors.secondary,
            0.5, hexToRgba(colors.accent, 0.8),
            1, colors.primary
          ],
          zIndex: 0
        }
      } as ShapeElement,
      
      // Content overlay
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 40,
          y: 110,
          width: 440,
          height: SLIDE_HEIGHT - 150,
          fill: hexToRgba("#ffffff", 0.96),
          cornerRadius: 20,
          shadowColor: "rgba(0,0,0,0.18)",
          shadowBlur: 25,
          shadowOffsetY: 12,
          zIndex: 1
        }
      } as ShapeElement,
      
      // Image frame with white stroke
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 500,
          y: 80,
          width: 420,
          height: 380,
          fill: "transparent",
          stroke: "#ffffff",
          strokeWidth: 3,
          cornerRadius: 16,
          shadowColor: "rgba(255,255,255,0.4)",
          shadowBlur: 20,
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
          x: 510,
          y: 90,
          width: 400,
          height: 360,
          cornerRadius: 12,
          zIndex: 1.5
        }
      } as ImageElement);
    }
    
    // Enhanced bullets
    newElements.push(
      ...bullets.slice(0, 4).map((bullet: any, index: number) => ({
        element_type: "bullet_point",
        text: bullet.text,
        konva_component: "Text",
        properties: {
          x: 70,
          y: 140 + (index * 65),
          width: 400,
          height: 55,
          fontSize: 17,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "400",
          fill: hexToRgba(textColor, 0.95),
          lineHeight: 1.5,
          align: "left",
          shadowColor: "rgba(0,0,0,0.1)",
          shadowBlur: 4,
          zIndex: 2
        }
      }))
    );

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Overlay Excellence",
        konva_component: "Text",
        properties: {
          x: 60,
          y: 30,
          width: 500,
          height: 70,
          fontSize: 38,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "800",
          fill: "#ffffff",
          align: "left",
          lineHeight: 1.1,
          shadowColor: "rgba(0,0,0,0.3)",
          shadowBlur: 18,
          shadowOffsetY: 10,
          zIndex: 2
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