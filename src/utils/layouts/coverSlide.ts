import { v4 as uuidv4 } from "uuid";

const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = hex.startsWith('#') ? hex : `#${hex}`;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Helper to get contrasting text color
const getContrastingTextColor = (bgColor: string, primaryColor: string): string => {
  const hexToRgb = (hex: string) => {
    const normalized = hex.startsWith('#') ? hex : `#${hex}`;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const bgLum = getLuminance(bgColor || '#ffffff');
  const textLum = getLuminance(primaryColor || '#000000');
  const contrast = (Math.max(bgLum, textLum) + 0.05) / (Math.min(bgLum, textLum) + 0.05);

  return contrast >= 4.5 ? primaryColor : (bgLum > 0.5 ? '#1a1a1a' : '#ffffff');
};

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

// Helper to render bullets for cover slides
const createCoverBullets = (
  bullets: any[], 
  textColor: string, 
  startY: number, 
  SLIDE_WIDTH: number,
  variant: 'center' | 'left' = 'center'
) => {
  if (!bullets || bullets.length === 0) return [];
  
  const bulletElements: any[] = [];
  const baseX = variant === 'center' ? SLIDE_WIDTH / 2 - 300 : 120;
  const bulletWidth = variant === 'center' ? 600 : 500;
  
  bullets.forEach((bullet: any, index: number) => {
    const yPos = startY + (index * 36);
    
    // Bullet dot
    bulletElements.push({
      element_type: "shape",
      konva_component: "Konva.Circle",
      shape_id: `auto-bullet-dot-${uuidv4()}`,
      properties: {
        x: baseX - 15,
        y: yPos + 10,
        radius: 3,
        fill: hexToRgba(textColor, 0.6),
        zIndex: 4
      }
    });
    
    // Bullet text
    bulletElements.push({
      element_type: "text",
      konva_component: "Text",
      text_id: `auto-bullet-${uuidv4()}`,
      properties: {
        x: baseX,
        y: yPos,
        width: bulletWidth,
        height: 32,
        text: bullet.text,
        fontSize: 16,
        fontFamily: "Raleway, sans-serif",
        fontWeight: "400",
        fill: hexToRgba(textColor, 0.75),
        align: variant === 'center' ? 'center' : 'left',
        lineHeight: 1.4,
        zIndex: 4
      }
    });
  });
  
  return bulletElements;
};

// ==================== COVER SLIDES ====================
export const createCoverSlide = {
  // Variant 1: Premium Glassmorphism with Bullets
  variant1: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === 'bullet_point') || [];
    
    const newElements = [
      // Subtle gradient orbs
      createGradientBlob(140, 80, 280, 240, colors.primary, colors.accent, 0.18),
      createGradientBlob(SLIDE_WIDTH - 200, SLIDE_HEIGHT - 100, 320, 260, colors.secondary, colors.accent, 0.15),
      createGradientBlob(SLIDE_WIDTH - 120, 50, 160, 140, colors.accent, colors.primary, 0.2),
      
      // Connecting curve
      {
        element_type: "shape",
        konva_component: "Konva.Line",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          points: [160, 100, SLIDE_WIDTH - 180, SLIDE_HEIGHT - 80, SLIDE_WIDTH - 100, 70],
          stroke: hexToRgba(colors.accent, 0.08),
          strokeWidth: 1,
          tension: 0.3,
          lineCap: "round",
          zIndex: 0.5
        }
      },
      
      // Modern glass card - adjusted height for bullets
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: SLIDE_WIDTH / 2 - 400,
          y: 90,
          width: 800,
          height: bullets.length > 0 ? 380 : 300,
          fill: hexToRgba("#ffffff", 0.06),
          cornerRadius: 28,
          stroke: hexToRgba("#ffffff", 0.15),
          strokeWidth: 1.5,
          shadowColor: "rgba(0,0,0,0.06)",
          shadowBlur: 35,
          shadowOffsetY: 15,
          zIndex: 2
        }
      },
      
      // Accent indicator
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: SLIDE_WIDTH / 2 - 60,
          y: 80,
          width: 120,
          height: 5,
          fill: colors.accent,
          cornerRadius: 3,
          opacity: 0.8,
          zIndex: 3
        }
      }
    ];

    // Add bullets if present
    if (bullets.length > 0) {
      newElements.push(...createCoverBullets(bullets, textColor, 330, SLIDE_WIDTH, 'center'));
    }

    let newSlide = {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text,
        konva_component: "Text",
        properties: {
          x: 80,
          y: 130,
          width: SLIDE_WIDTH - 160,
          height: 90,
          fontSize: 48,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "800",
          fill: textColor,
          align: "center",
          lineHeight: 1.2,
          shadowColor: hexToRgba(textColor, 0.25),
          shadowBlur: 18,
          shadowOffsetY: 8,
          letterSpacing: 1,
          zIndex: 3
        }
      },
      subtitle: slide.subtitle ? {
        text: slide.subtitle.text,
        konva_component: "Text",
        properties: {
          x: 100,
          y: 240,
          width: SLIDE_WIDTH - 200,
          height: 60,
          fontSize: 20,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "400",
          fill: hexToRgba(textColor, 0.85),
          align: "center",
          lineHeight: 1.5,
          zIndex: 3
        }
      } : undefined,
      elements: [...newElements],
    };

    newSlide.background = {
      type: "linear",
      gradient: {
        stops: [
          0, colors.background,
          0.5, hexToRgba(colors.primary, 0.04),
          1, hexToRgba(colors.secondary, 0.03)
        ]
      }
    };

    return newSlide;
  },

  // Variant 2: Bold Split Design with Bullets
  variant2: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === 'bullet_point') || [];
    
    const newElements = [
      // Diagonal panel
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: -120,
          y: -60,
          width: 680,
          height: SLIDE_HEIGHT + 120,
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: 680, y: SLIDE_HEIGHT },
          fillLinearGradientColorStops: [
            0, hexToRgba(colors.primary, 0.75),
            0.5, colors.secondary,
            1, hexToRgba(colors.accent, 0.65)
          ],
          rotation: 8,
          shadowColor: hexToRgba(colors.primary, 0.3),
          shadowBlur: 45,
          shadowOffsetX: 18,
          zIndex: 1
        }
      },
      
      // Flowing curve
      {
        element_type: "shape",
        konva_component: "Konva.Line",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          points: [540, 0, 560, 110, 550, 220, 570, 320, 555, 440, 580, SLIDE_HEIGHT],
          stroke: hexToRgba("#ffffff", 0.2),
          strokeWidth: 70,
          tension: 0.6,
          lineCap: "round",
          shadowColor: hexToRgba("#ffffff", 0.12),
          shadowBlur: 25,
          zIndex: 1.5
        }
      },
      
      // Decorative elements
      {
        element_type: "shape",
        konva_component: "Konva.Circle",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: SLIDE_WIDTH - 110,
          y: 130,
          radius: 65,
          fill: hexToRgba(colors.accent, 0.8),
          shadowColor: hexToRgba(colors.accent, 0.35),
          shadowBlur: 22,
          shadowOffsetY: 8,
          zIndex: 2
        }
      }
    ];

    // Add bullets if present
    if (bullets.length > 0) {
      newElements.push(...createCoverBullets(bullets, "#ffffff", 380, SLIDE_WIDTH, 'left'));
    }

    let newSlide = {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Modern Vision",
        konva_component: "Text",
        properties: {
          x: 70,
          y: 120,
          width: 480,
          height: 95,
          fontSize: 50,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "800",
          fill: "#ffffff",
          align: "left",
          lineHeight: 1.2,
          shadowColor: "rgba(0,0,0,0.35)",
          shadowBlur: 22,
          shadowOffsetY: 10,
          letterSpacing: 0.5,
          zIndex: 3
        }
      },
      subtitle: slide.subtitle ? {
        text: slide.subtitle.text,
        konva_component: "Text",
        properties: {
          x: 70,
          y: 280,
          width: 450,
          height: 70,
          fontSize: 19,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "400",
          fill: "#ffffff",
          align: "left",
          lineHeight: 1.5,
          zIndex: 3
        }
      } : undefined,
      elements: [...newElements],
    };

    newSlide.background = { type: "solid", color: colors.background };

    return newSlide;
  },

  // Variant 3: Layered Cards with Bullets
  variant3: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === 'bullet_point') || [];
    
    const newElements = [
      // Back layer
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: SLIDE_WIDTH / 2,
          y: SLIDE_HEIGHT / 2,
          width: 600,
          height: 400,
          offsetX: 300,
          offsetY: 200,
          rotation: -10,
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: 600, y: 400 },
          fillLinearGradientColorStops: [
            0, hexToRgba(colors.primary, 0.12),
            0.5, hexToRgba(colors.secondary, 0.08),
            1, hexToRgba(colors.accent, 0.06)
          ],
          cornerRadius: 24,
          shadowColor: hexToRgba(colors.primary, 0.1),
          shadowBlur: 30,
          shadowOffsetY: 12,
          zIndex: 0.5
        }
      },
      
      // Middle layer
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: SLIDE_WIDTH / 2,
          y: SLIDE_HEIGHT / 2,
          width: 500,
          height: 340,
          offsetX: 250,
          offsetY: 170,
          rotation: 5,
          fill: hexToRgba(colors.accent, 0.18),
          cornerRadius: 20,
          shadowColor: hexToRgba(colors.accent, 0.12),
          shadowBlur: 25,
          shadowOffsetY: 10,
          zIndex: 1
        }
      },
      
      // Front card - adjusted height for bullets
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: SLIDE_WIDTH / 2 - 320,
          y: bullets.length > 0 ? SLIDE_HEIGHT / 2 - 180 : SLIDE_HEIGHT / 2 - 150,
          width: 640,
          height: bullets.length > 0 ? 340 : 280,
          fill: hexToRgba(colors.surface || "#ffffff", 0.96),
          cornerRadius: 28,
          stroke: hexToRgba(colors.primary, 0.18),
          strokeWidth: 1.5,
          shadowColor: "rgba(0,0,0,0.12)",
          shadowBlur: 35,
          shadowOffsetY: 18,
          zIndex: 2
        }
      },
      
      // Top accent bar
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: SLIDE_WIDTH / 2 - 90,
          y: bullets.length > 0 ? 125 : 155,
          width: 180,
          height: 7,
          fill: colors.accent,
          cornerRadius: 4,
          shadowColor: hexToRgba(colors.accent, 0.35),
          shadowBlur: 10,
          zIndex: 2.5
        }
      }
    ];

    // Add bullets if present
    if (bullets.length > 0) {
      newElements.push(...createCoverBullets(bullets, textColor, 300, SLIDE_WIDTH, 'center'));
    }

    let newSlide = {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Strategic Excellence",
        konva_component: "Text",
        properties: {
          x: 110,
          y: bullets.length > 0 ? 150 : 180,
          width: SLIDE_WIDTH - 220,
          height: 80,
          fontSize: 44,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "800",
          fill: textColor,
          align: "center",
          lineHeight: 1.2,
          shadowColor: hexToRgba(textColor, 0.2),
          shadowBlur: 15,
          shadowOffsetY: 6,
          letterSpacing: 1,
          zIndex: 4
        }
      },
      subtitle: slide.subtitle ? {
        text: slide.subtitle.text,
        konva_component: "Text",
        properties: {
          x: 130,
          y: bullets.length > 0 ? 245 : 285,
          width: SLIDE_WIDTH - 260,
          height: 50,
          fontSize: 18,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "400",
          fill: hexToRgba(textColor, 0.82),
          align: "center",
          lineHeight: 1.4,
          zIndex: 4
        }
      } : undefined,
      elements: [...newElements],
    };

    newSlide.background = { type: "solid", color: colors.background };

    return newSlide;
  },

  // Variant 4: Radial Elegance with Bullets
  variant4: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === 'bullet_point') || [];
    
    const newElements = [
      // Central gradient
      {
        element_type: "shape",
        konva_component: "Konva.Circle",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: SLIDE_WIDTH / 2,
          y: SLIDE_HEIGHT / 2,
          radius: 230,
          fillRadialGradientStartPoint: { x: 0, y: 0 },
          fillRadialGradientEndPoint: { x: 0, y: 0 },
          fillRadialGradientStartRadius: 0,
          fillRadialGradientEndRadius: 230,
          fillRadialGradientColorStops: [
            0, hexToRgba(colors.accent, 0.22),
            0.5, hexToRgba(colors.secondary, 0.12),
            0.75, hexToRgba(colors.primary, 0.08),
            1, "transparent"
          ],
          shadowColor: hexToRgba(colors.accent, 0.15),
          shadowBlur: 40,
          zIndex: 1
        }
      },
      
      // Rings
      {
        element_type: "shape",
        konva_component: "Konva.Circle",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: SLIDE_WIDTH / 2,
          y: SLIDE_HEIGHT / 2,
          radius: 190,
          stroke: hexToRgba(colors.primary, 0.28),
          strokeWidth: 3.5,
          dash: [14, 9],
          zIndex: 1.5
        }
      },
      {
        element_type: "shape",
        konva_component: "Konva.Circle",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: SLIDE_WIDTH / 2,
          y: SLIDE_HEIGHT / 2,
          radius: 150,
          stroke: hexToRgba(colors.accent, 0.38),
          strokeWidth: 2.5,
          zIndex: 1.5
        }
      }
    ];

    // Add bullets if present
    if (bullets.length > 0) {
      newElements.push(...createCoverBullets(bullets, textColor, 350, SLIDE_WIDTH, 'center'));
    }

    let newSlide = {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Innovation Hub",
        konva_component: "Text",
        properties: {
          x: 90,
          y: bullets.length > 0 ? 160 : 185,
          width: SLIDE_WIDTH - 180,
          height: 85,
          fontSize: 50,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "900",
          fill: textColor,
          align: "center",
          lineHeight: 1.15,
          shadowColor: hexToRgba(textColor, 0.24),
          shadowBlur: 20,
          shadowOffsetY: 8,
          letterSpacing: 1.5,
          zIndex: 3
        }
      },
      subtitle: slide.subtitle ? {
        text: slide.subtitle.text,
        konva_component: "Text",
        properties: {
          x: 110,
          y: bullets.length > 0 ? 260 : 300,
          width: SLIDE_WIDTH - 220,
          height: 50,
          fontSize: 19,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "400",
          fill: hexToRgba(textColor, 0.84),
          align: "center",
          lineHeight: 1.4,
          zIndex: 3
        }
      } : undefined,
      elements: [...newElements],
    };

    newSlide.background = { type: "solid", color: colors.background };

    return newSlide;
  },

  // Variant 5: Vibrant Gradient with Bullets
  variant5: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
    const bullets = slide.elements?.filter((el: any) => el.element_type === 'bullet_point') || [];
    
    const newElements = [
      // Mesh overlay
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          fillRadialGradientStartPoint: { x: SLIDE_WIDTH * 0.3, y: SLIDE_HEIGHT * 0.3 },
          fillRadialGradientEndPoint: { x: SLIDE_WIDTH * 0.3, y: SLIDE_HEIGHT * 0.3 },
          fillRadialGradientStartRadius: 0,
          fillRadialGradientEndRadius: SLIDE_WIDTH * 0.75,
          fillRadialGradientColorStops: [
            0, hexToRgba("#ffffff", 0.12),
            0.4, hexToRgba("#ffffff", 0.06),
            1, "transparent"
          ],
          opacity: 0.85,
          zIndex: 0.5
        }
      },
      
      // Top accent line
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        shape_id: `auto-${uuidv4()}`,
        properties: {
          x: SLIDE_WIDTH / 2 - 110,
          y: bullets.length > 0 ? 122 : 142,
          width: 220,
          height: 7,
          fill: "#ffffff",
          cornerRadius: 4,
          opacity: 0.88,
          shadowColor: "#ffffff",
          shadowBlur: 22,
          zIndex: 2
        }
      }
    ];

    // Add bullets if present (white text for vibrant background)
    if (bullets.length > 0) {
      newElements.push(...createCoverBullets(bullets, "#ffffff", 340, SLIDE_WIDTH, 'center'));
    }

    let newSlide = {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Transform Tomorrow",
        konva_component: "Text",
        properties: {
          x: 80,
          y: bullets.length > 0 ? 148 : 168,
          width: SLIDE_WIDTH - 160,
          height: 100,
          fontSize: 54,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "900",
          fill: "#ffffff",
          align: "center",
          lineHeight: 1.18,
          shadowColor: "rgba(0,0,0,0.45)",
          shadowBlur: 28,
          shadowOffsetY: 12,
          letterSpacing: 2,
          zIndex: 3
        }
      },
      subtitle: slide.subtitle ? {
        text: slide.subtitle.text,
        konva_component: "Text",
        properties: {
          x: 100,
          y: bullets.length > 0 ? 260 : 295,
          width: SLIDE_WIDTH - 200,
          height: 60,
          fontSize: 21,
          fontFamily: "Raleway, sans-serif",
          fontWeight: "300",
          fill: hexToRgba("#ffffff", 0.93),
          align: "center",
          lineHeight: 1.5,
          shadowColor: "rgba(0,0,0,0.25)",
          shadowBlur: 12,
          zIndex: 3
        }
      } : undefined,
      elements: [...newElements],
    };

    newSlide.background = {
      type: "linear",
      gradient: {
        stops: [
          0, colors.primary,
          0.3, hexToRgba(colors.secondary, 0.75),
          0.6, colors.accent,
          0.8, hexToRgba(colors.primary, 0.65),
          1, hexToRgba(colors.secondary, 0.85)
        ]
      }
    };

    return newSlide;
  }
};