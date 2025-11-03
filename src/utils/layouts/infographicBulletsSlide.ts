import { v4 as uuidv4 } from "uuid";
const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = hex.startsWith('#') ? hex : `#${hex}`;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
export const createInfographicBulletsSlide = {
  variant1: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Core Insights",
        konva_component: "Text",
        properties: {
          x: 60, y: 40, width: SLIDE_WIDTH - 120, height: 60,
          fontSize: 36, fontFamily: "Raleway, sans-serif", fontWeight: "700",
          fill: textColor, align: "center", lineHeight: 1.2,
          shadowColor: hexToRgba(textColor, 0.15), shadowBlur: 8
        }
      },
      elements: [
        {
          element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
          properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
        },
        // Icon-integrated bullets with shadows
        ...bullets.slice(0, 4).map((bullet: any, index: number) => [
          {
            element_type: "shape", konva_component: "Circle", shape_id: uuidv4(),
            properties: {
              x: 120, y: 150 + (index * 100), radius: 22,
              fillLinearGradientStartPoint: { x: 0, y: 0 },
              fillLinearGradientEndPoint: { x: 0, y: 44 },
              fillLinearGradientColorStops: [0, [colors.primary, colors.secondary, colors.accent, colors.primary][index], 1, hexToRgba([colors.primary, colors.secondary, colors.accent, colors.primary][index], 0.8)],
              shadowColor: hexToRgba([colors.primary, colors.secondary, colors.accent, colors.primary][index], 0.2), shadowBlur: 10
            }
          },
          {
            element_type: "bullet_point", text: bullet.text,
            konva_component: "Text", properties: {
              x: 160, y: 140 + (index * 100), width: SLIDE_WIDTH - 200, height: 40,
              fontSize: 18, fontFamily: "Raleway, sans-serif", fontWeight: "500",
              fill: textColor, lineHeight: 1.3, letterSpacing: 0.2
            }
          }
        ]).flat()
      ]
    };
  },
  variant2: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Strategic Points",
        konva_component: "Text",
        properties: {
          x: 60, y: 60, width: SLIDE_WIDTH - 120, height: 50,
          fontSize: 32, fontFamily: "Raleway, sans-serif", fontWeight: "700",
          fill: textColor, align: "center", lineHeight: 1.1
        }
      },
      elements: [
        {
          element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
          properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
        },
        // Numbered badges with gradients
        ...bullets.slice(0, 5).map((bullet: any, index: number) => [
          {
            element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
            properties: {
              x: 100, y: 130 + (index * 70), width: 35, height: 35,
              fillLinearGradientStartPoint: { x: 0, y: 0 },
              fillLinearGradientEndPoint: { x: 35, y: 35 },
              fillLinearGradientColorStops: [0, colors.accent, 1, hexToRgba(colors.primary, 0.9)],
              cornerRadius: 18,
              shadowColor: hexToRgba(colors.accent, 0.2), shadowBlur: 8
            }
          },
          {
            element_type: "text", text: `${ index + 1}`,
      konva_component: "Text", properties: {
      x: 112, y: 135 + (index * 70), width: 20, height: 30,
        fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "800",
          fill: "#ffffff", align: "center"
    }
  },
{
  element_type: "bullet_point", text: bullet.text,
    konva_component: "Text", properties: {
    x: 150, y: 130 + (index * 70), width: SLIDE_WIDTH - 170, height: 50,
      fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "400",
        fill: textColor, align: "left", lineHeight: 1.4
  }
}
]).flat()
]
};
},
variant3: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
  const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
  return {
    ...slide,
    slide_title: {
      text: slide.slide_title?.text || "Visual Hierarchy",
      konva_component: "Text",
      properties: {
        x: 80, y: 80, width: SLIDE_WIDTH - 160, height: 40,
        fontSize: 28, fontFamily: "Raleway, sans-serif", fontWeight: "600",
        fill: textColor, align: "center", lineHeight: 1.1
      }
    },
    elements: [
      {
        element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
        properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
      },
      // Checkmark icons with path precision
      ...bullets.slice(0, 4).map((bullet: any, index: number) => [
        {
          element_type: "shape", konva_component: "Path", shape_id: uuidv4(),
          properties: {
            x: 120, y: 150 + (index * 80), data: "M4 10L8 14L16 6", fill: "none", stroke: colors.secondary, strokeWidth: 4, strokeLinecap: "round"
          }
        },
        {
          element_type: "bullet_point", text: bullet.text,
          konva_component: "Text", properties: {
            x: 160, y: 140 + (index * 80), width: SLIDE_WIDTH - 200, height: 60,
            fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "400",
            fill: textColor, align: "left", lineHeight: 1.3
          }
        }
      ]).flat()
    ]
  };
},
  variant4: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Feature Highlights",
        konva_component: "Text",
        properties: {
          x: 60, y: 70, width: SLIDE_WIDTH - 120, height: 60,
          fontSize: 34, fontFamily: "Raleway, sans-serif", fontWeight: "800",
          fill: textColor, align: "center", lineHeight: 1.2
        }
      },
      elements: [
        {
          element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
          properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
        },
        // Card stack with perspective shadows
        ...bullets.slice(0, 3).map((bullet: any, index: number) => ({
          element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
          properties: {
            x: 120 + (index * 260), y: 180 - (index * 5), width: 220, height: 120,
            fill: hexToRgba(colors.primary, 0.12), cornerRadius: 16,
            rotation: index * 2,
            shadowColor: hexToRgba(colors.primary, 0.15), shadowBlur: 15, shadowOffsetY: index * 2 + 5
          }
        })),
        // Bullets on cards
        ...bullets.slice(0, 3).map((bullet: any, index: number) => ({
          element_type: "bullet_point", text: bullet.text,
          konva_component: "Text", properties: {
            x: 140 + (index * 260), y: 200 - (index * 5), width: 180, height: 80,
            fontSize: 15, fontFamily: "Raleway, sans-serif", fontWeight: "400",
            fill: textColor, align: "center", lineHeight: 1.3,
            rotation: index * 2
          }
        }))
      ]
    };
  },
    variant5: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
      const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
      return {
        ...slide,
        slide_title: {
          text: slide.slide_title?.text || "Connected Narrative",
          konva_component: "Text",
          properties: {
            x: 80, y: 90, width: SLIDE_WIDTH - 160, height: 50,
            fontSize: 30, fontFamily: "Raleway, sans-serif", fontWeight: "700",
            fill: textColor, align: "center", lineHeight: 1.1
          }
        },
        elements: [
          {
            element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
            properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
          },
          // Flowing connector line
          {
            element_type: "shape", konva_component: "Line", shape_id: uuidv4(),
            properties: {
              points: [140, 160, 140, 460],
              stroke: hexToRgba(colors.accent, 0.6), strokeWidth: 3, lineCap: "round",
              shadowColor: hexToRgba(colors.accent, 0.3), shadowBlur: 8
            }
          },
          // Dots along connector
          ...bullets.slice(0, 4).map((bullet: any, index: number) => [
            {
              element_type: "shape", konva_component: "Circle", shape_id: uuidv4(),
              properties: {
                x: 140, y: 170 + (index * 80), radius: 8,
                fill: colors.primary, shadowColor: hexToRgba(colors.primary, 0.2), shadowBlur: 6
              }
            },
            {
              element_type: "bullet_point", text: bullet.text,
              konva_component: "Text", properties: {
                x: 60, y: 160 + (index * 80), width: SLIDE_WIDTH - 220, height: 60,
                fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "400",
                fill: textColor, align: "left", lineHeight: 1.3
              }
            }
          ]).flat()
        ]
      };
    }
};