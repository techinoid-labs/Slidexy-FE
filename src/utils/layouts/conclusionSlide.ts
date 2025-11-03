import { v4 as uuidv4 } from "uuid";

const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = hex.startsWith('#') ? hex : `#${hex}`;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const createConclusionSlide = {
  // Modern Card Layout - Clean and spacious
  variant1: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    const description = slide.elements?.find((el: any) => el.element_type === "description")?.text || "";

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Next Steps",
        konva_component: "Text",
        properties: {
          x: 80, y: 60, width: SLIDE_WIDTH - 160, height: 70,
          fontSize: 56, fontFamily: "Raleway, sans-serif", fontWeight: "800",
          fill: textColor, align: "left", lineHeight: 1.2
        }
      },
      elements: [
        // Background
        {
          element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
          properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
        },
        // Decorative accent bar
        {
          element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
          properties: {
            x: 80, y: 130, width: 60, height: 6,
            fill: colors.primary, cornerRadius: 3
          }
        },
        // Description text
        ...(description ? [{
          element_type: "text", text: description,
          konva_component: "Text", properties: {
            x: 80, y: 160, width: SLIDE_WIDTH - 160, height: 50,
            fontSize: 18, fontFamily: "Raleway, sans-serif", fontWeight: "400",
            fill: hexToRgba(textColor, 0.7), align: "left", lineHeight: 1.5
          }
        }] : []),
        // Action items cards
        ...bullets.map((bullet: any, index: number) => [
          // Card background
          {
            element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
            properties: {
              x: 80, y: 230 + (index * 85), width: SLIDE_WIDTH - 160, height: 70,
              fill: colors.surface, cornerRadius: 12,
              shadowColor: hexToRgba(textColor, 0.08), shadowBlur: 15, shadowOffsetY: 4
            }
          },
          // Number badge
          {
            element_type: "shape", konva_component: "Circle", shape_id: uuidv4(),
            properties: {
              x: 115, y: 265 + (index * 85), radius: 18,
              fill: colors.primary
            }
          },
          // Number text
          {
            element_type: "text", text: `${index + 1}`,
            konva_component: "Text", properties: {
              x: 106, y: 256 + (index * 85), width: 18, height: 18,
              fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "700",
              fill: "#ffffff", align: "center"
            }
          },
          // Bullet text
          {
            element_type: "bullet_point", text: bullet.text,
            konva_component: "Text", properties: {
              x: 150, y: 245 + (index * 85), width: SLIDE_WIDTH - 260, height: 50,
              fontSize: 20, fontFamily: "Raleway, sans-serif", fontWeight: "600",
              fill: textColor, align: "left", lineHeight: 1.4
            }
          }
        ]).flat()
      ]
    };
  },

  // Centered Minimal Layout - Canva-style
  variant2: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    const description = slide.elements?.find((el: any) => el.element_type === "description")?.text || "";

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Next Steps",
        konva_component: "Text",
        properties: {
          x: SLIDE_WIDTH / 2 - 250, y: 80, width: 500, height: 80,
          fontSize: 52, fontFamily: "Raleway, sans-serif", fontWeight: "800",
          fill: textColor, align: "center", lineHeight: 1.2
        }
      },
      elements: [
        // Background
        {
          element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
          properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
        },
        // Decorative circle
        {
          element_type: "shape", konva_component: "Circle", shape_id: uuidv4(),
          properties: {
            x: SLIDE_WIDTH / 2, y: 175, radius: 3,
            fill: colors.primary
          }
        },
        // Description
        ...(description ? [{
          element_type: "text", text: description,
          konva_component: "Text", properties: {
            x: SLIDE_WIDTH / 2 - 300, y: 190, width: 600, height: 50,
            fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "400",
            fill: hexToRgba(textColor, 0.65), align: "center", lineHeight: 1.6
          }
        }] : []),
        // Action items - horizontal cards
        ...bullets.slice(0, 2).map((bullet: any, index: number) => [
          {
            element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
            properties: {
              x: SLIDE_WIDTH / 2 - 370 + (index * 390), y: 270, width: 350, height: 160,
              fill: colors.surface, cornerRadius: 16,
              shadowColor: hexToRgba(textColor, 0.1), shadowBlur: 20, shadowOffsetY: 6
            }
          },
          // Icon circle
          {
            element_type: "shape", konva_component: "Circle", shape_id: uuidv4(),
            properties: {
              x: SLIDE_WIDTH / 2 - 195 + (index * 390), y: 310, radius: 24,
              fill: hexToRgba(colors.primary, 0.15)
            }
          },
          // Number
          {
            element_type: "text", text: `${index + 1}`,
            konva_component: "Text", properties: {
              x: SLIDE_WIDTH / 2 - 205 + (index * 390), y: 300, width: 20, height: 20,
              fontSize: 18, fontFamily: "Raleway, sans-serif", fontWeight: "700",
              fill: colors.primary, align: "center"
            }
          },
          // Bullet text
          {
            element_type: "bullet_point", text: bullet.text,
            konva_component: "Text", properties: {
              x: SLIDE_WIDTH / 2 - 345 + (index * 390), y: 350, width: 310, height: 70,
              fontSize: 20, fontFamily: "Raleway, sans-serif", fontWeight: "600",
              fill: textColor, align: "center", lineHeight: 1.4
            }
          }
        ]).flat()
      ]
    };
  },

  // Professional Timeline Layout
  variant3: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    const description = slide.elements?.find((el: any) => el.element_type === "description")?.text || "";

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Next Steps",
        konva_component: "Text",
        properties: {
          x: 100, y: 70, width: 400, height: 70,
          fontSize: 50, fontFamily: "Raleway, sans-serif", fontWeight: "800",
          fill: textColor, align: "left", lineHeight: 1.2
        }
      },
      elements: [
        // Background
        {
          element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
          properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
        },
        // Gradient overlay
        {
          element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
          properties: {
            x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: SLIDE_HEIGHT },
            fillLinearGradientColorStops: [0, hexToRgba(colors.primary, 0.02), 1, hexToRgba(colors.accent, 0.02)]
          }
        },
        // Description
        ...(description ? [{
          element_type: "text", text: description,
          konva_component: "Text", properties: {
            x: 100, y: 150, width: SLIDE_WIDTH - 200, height: 40,
            fontSize: 17, fontFamily: "Raleway, sans-serif", fontWeight: "400",
            fill: hexToRgba(textColor, 0.7), align: "left", lineHeight: 1.5
          }
        }] : []),
        // Timeline connector
        {
          element_type: "shape", konva_component: "Line", shape_id: uuidv4(),
          properties: {
            points: bullets.slice(0, 3).map((_: any, i: any) => [150 + (i * 250), 250]).flat(),
            stroke: hexToRgba(colors.accent, 0.3), strokeWidth: 2
          }
        },
        // Timeline items
        ...bullets.slice(0, 3).map((bullet: any, index: number) => [
          // Checkpoint circle
          {
            element_type: "shape", konva_component: "Circle", shape_id: uuidv4(),
            properties: {
              x: 150 + (index * 250), y: 250, radius: 28,
              fill: colors.surface,
              stroke: colors.primary, strokeWidth: 3,
              shadowColor: hexToRgba(colors.primary, 0.2), shadowBlur: 10
            }
          },
          // Step number
          {
            element_type: "text", text: `${index + 1}`,
            konva_component: "Text", properties: {
              x: 138 + (index * 250), y: 237, width: 24, height: 24,
              fontSize: 20, fontFamily: "Raleway, sans-serif", fontWeight: "700",
              fill: colors.primary, align: "center"
            }
          },
          // Content card
          {
            element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
            properties: {
              x: 70 + (index * 250), y: 300, width: 160, height: 120,
              fill: colors.surface, cornerRadius: 12,
              shadowColor: hexToRgba(textColor, 0.08), shadowBlur: 12, shadowOffsetY: 4
            }
          },
          // Bullet text
          {
            element_type: "bullet_point", text: bullet.text,
            konva_component: "Text", properties: {
              x: 85 + (index * 250), y: 320, width: 130, height: 80,
              fontSize: 15, fontFamily: "Raleway, sans-serif", fontWeight: "500",
              fill: textColor, align: "center", lineHeight: 1.4
            }
          }
        ]).flat()
      ]
    };
  },

  // Bold CTA Layout - Modern Canva Style
  variant4: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    const description = slide.elements?.find((el: any) => el.element_type === "description")?.text || "";

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Ready to Get Started?",
        konva_component: "Text",
        properties: {
          x: 80, y: 80, width: SLIDE_WIDTH - 160, height: 90,
          fontSize: 54, fontFamily: "Raleway, sans-serif", fontWeight: "900",
          fill: textColor, align: "center", lineHeight: 1.2
        }
      },
      elements: [
        // Background
        {
          element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
          properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
        },
        // Large feature card
        {
          element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
          properties: {
            x: SLIDE_WIDTH / 2 - 350, y: 200, width: 700, height: 280,
            fill: colors.surface, cornerRadius: 20,
            shadowColor: hexToRgba(textColor, 0.12), shadowBlur: 25, shadowOffsetY: 8
          }
        },
        // Description
        ...(description ? [{
          element_type: "text", text: description,
          konva_component: "Text", properties: {
            x: SLIDE_WIDTH / 2 - 300, y: 230, width: 600, height: 60,
            fontSize: 19, fontFamily: "Raleway, sans-serif", fontWeight: "500",
            fill: hexToRgba(textColor, 0.75), align: "center", lineHeight: 1.6
          }
        }] : []),
        // Action buttons/items
        ...bullets.slice(0, 2).map((bullet: any, index: number) => [
          {
            element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
            properties: {
              x: SLIDE_WIDTH / 2 - 280 + (index * 300), y: 330, width: 260, height: 110,
              fill: index === 0 ? colors.primary : hexToRgba(colors.accent, 0.1),
              cornerRadius: 14,
              shadowColor: hexToRgba(colors.primary, 0.15), shadowBlur: 12
            }
          },
          {
            element_type: "bullet_point", text: bullet.text,
            konva_component: "Text", properties: {
              x: SLIDE_WIDTH / 2 - 260 + (index * 300), y: 360, width: 220, height: 50,
              fontSize: 22, fontFamily: "Raleway, sans-serif", fontWeight: "700",
              fill: index === 0 ? "#ffffff" : textColor, align: "center", lineHeight: 1.3
            }
          }
        ]).flat()
      ]
    };
  }
};