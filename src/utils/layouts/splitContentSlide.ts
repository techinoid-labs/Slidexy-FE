import { v4 as uuidv4 } from "uuid";

const hexToRgba = (hex: string, alpha: number): string => {
    const normalized = hex.startsWith('#') ? hex : `#${hex}`;
    const r = parseInt(normalized.slice(1, 3), 16);
    const g = parseInt(normalized.slice(3, 5), 16);
    const b = parseInt(normalized.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const FONT_HEADING = "Poppins, sans-serif";
const FONT_BODY = "Inter, sans-serif";

export const createSplitContentSlide = {
    // === VARIANT 1: GRADIENT WAVE SPLIT WITH IMAGE PORTION (ORIGINAL - WORKING WELL) ===
    variant1: (slide: any, colors: any, textColor: string, SLIDE_WIDTH = 960, SLIDE_HEIGHT = 540) => {
        const padding = 70;
        const contentWidth = SLIDE_WIDTH * 0.5 - padding * 1.5;
        const imageWidth = SLIDE_WIDTH * 0.5 - padding;
        const startY = 180;
        const bulletSpacing = 55;
        const bulletHeight = 45;
        const BULLET_ICONS = ["◆", "▸", "◈", "✓", "→", "★", "◇", "●"];
        const imagePlaceholder = slide.image_placeholder || { x: SLIDE_WIDTH * 0.5 + padding / 2, y: startY, width: imageWidth, height: 300 };
        const allBullets = slide.elements?.filter((el: any) =>
            el.element_type === "bullet_point"
        ) || [];
        const hasBullets = allBullets.length > 0;
        const hasImage = slide.image_url && slide.image_url !== "";
        const elements: any[] = [
            // Base background
            {
                element_type: "shape",
                konva_component: "Konva.Rect",
                shape_id: `auto-${uuidv4()}`,
                properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
            },
            // Animated gradient wave (left - content side)
            {
                element_type: "shape",
                konva_component: "Konva.Path",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    data: `M 0 ${SLIDE_HEIGHT * 0.3} Q ${SLIDE_WIDTH * 0.25} ${SLIDE_HEIGHT * 0.25}, ${SLIDE_WIDTH * 0.5} ${SLIDE_HEIGHT * 0.35} L ${SLIDE_WIDTH * 0.5} ${SLIDE_HEIGHT} L 0 ${SLIDE_HEIGHT} Z`,
                    fillLinearGradientStartPoint: { x: 0, y: 0 },
                    fillLinearGradientEndPoint: { x: SLIDE_WIDTH * 0.5, y: SLIDE_HEIGHT },
                    fillLinearGradientColorStops: [
                        0, hexToRgba(colors.primary, 0.12),
                        1, hexToRgba(colors.primary, 0.02)
                    ]
                }
            },
            // Gradient overlay for image side (right)
            {
                element_type: "shape",
                konva_component: "Konva.Rect",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: SLIDE_WIDTH * 0.5, y: 0, width: SLIDE_WIDTH * 0.5, height: SLIDE_HEIGHT,
                    fillLinearGradientStartPoint: { x: 0, y: 0 },
                    fillLinearGradientEndPoint: { x: SLIDE_WIDTH * 0.5, y: SLIDE_HEIGHT },
                    fillLinearGradientColorStops: [
                        0, hexToRgba(colors.secondary, 0.08),
                        1, hexToRgba(colors.secondary, 0)
                    ]
                }
            },
            // Decorative circles (left top - content side)
            {
                element_type: "shape",
                konva_component: "Konva.Circle",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: padding + 30, y: 140, radius: 50,
                    fill: hexToRgba(colors.primary, 0.08)
                }
            },
            // Decorative circles (right bottom - image side)
            {
                element_type: "shape",
                konva_component: "Konva.Circle",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: SLIDE_WIDTH - padding - 30, y: SLIDE_HEIGHT - 70, radius: 60,
                    fill: hexToRgba(colors.secondary, 0.08)
                }
            },
            // Content Section Label with accent
            {
                element_type: "shape",
                konva_component: "Konva.Rect",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: padding - 8, y: startY - 55, width: 6, height: 40,
                    fill: colors.primary, cornerRadius: 3
                }
            },
            // Image Section Label with accent
            {
                element_type: "shape",
                konva_component: "Konva.Rect",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: SLIDE_WIDTH * 0.5 + padding / 2 - 8, y: startY - 55, width: 6, height: 40,
                    fill: colors.secondary, cornerRadius: 3
                }
            },

            // Left Bullets with enhanced styling
            ...allBullets.map((bullet: any, index: number) => [
                {
                    element_type: "shape",
                    konva_component: "Konva.Circle",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: padding + 16, y: startY + (index * bulletSpacing) + 20,
                        radius: 10,
                        fill: hexToRgba(colors.primary, 0.15)
                    }
                },
                {
                    element_type: "text",
                    text: BULLET_ICONS[index % BULLET_ICONS.length],
                    konva_component: "Text",
                    properties: {
                        x: padding + 8, y: startY + (index * bulletSpacing) + 12,
                        width: 16, height: 16,
                        fontSize: 14, fontFamily: "system-ui",
                        fill: colors.primary, align: "center", fontWeight: "bold"
                    }
                },
                {
                    element_type: "bullet_point",
                    text: bullet.text || '',
                    konva_component: "Text",
                    properties: {
                        x: padding + 45,
                        y: startY + (index * bulletSpacing),
                        width: contentWidth - 45,
                        height: bulletHeight,
                        fontSize: 16,
                        fontFamily: FONT_BODY,
                        fontWeight: 500,
                        fill: textColor,
                        align: "left",
                        lineHeight: 1.5,
                    }
                }
            ]).flat(),
            // Image container shape (decorative frame)
            {
                element_type: "shape",
                konva_component: "Konva.Rect",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: imagePlaceholder.x - 10, y: 200,
                    width: imagePlaceholder.width + 20, height: 300,
                    fill: "transparent",
                    stroke: hexToRgba(colors.secondary, 0.3),
                    strokeWidth: 3,
                    cornerRadius: 20
                }
            },
            // Image portion
            {
                element_type: "image",
                konva_component: "Image",
                image_id: `auto-${uuidv4()}`,
                properties: {
                    x: imagePlaceholder.x,
                    y: 205,
                    width: imagePlaceholder.width,
                    height: 270,
                    imageSrc: slide.image_url || '',
                    cornerRadius: 16
                }
            },
            // Premium vertical divider
            {
                element_type: "shape",
                konva_component: "Konva.Rect",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: SLIDE_WIDTH * 0.5 - 2,
                    y: 140,
                    width: 4,
                    height: SLIDE_HEIGHT - 180,
                    cornerRadius: 2,
                    fillLinearGradientStartPoint: { x: 0, y: 0 },
                    fillLinearGradientEndPoint: { x: 0, y: SLIDE_HEIGHT - 180 },
                    fillLinearGradientColorStops: [
                        0, hexToRgba(colors.primary, 0.3),
                        0.5, colors.accent,
                        1, hexToRgba(colors.secondary, 0.3)
                    ]
                }
            }
        ];
        if (hasBullets) {
            elements.push({
                element_type: "text",
                text: "KEY INSIGHTS",
                konva_component: "Text",
                properties: {
                    x: padding + 8, y: startY - 50, width: contentWidth, height: 32,
                    fontSize: 18,
                    fontFamily: FONT_HEADING, fontWeight: 700,
                    fill: colors.primary, align: "left", letterSpacing: 2.5
                }
            });
        }
        return {
            ...slide,
            slide_title: {
                text: slide.slide_title?.text,
                konva_component: "Text",
                properties: {
                    x: padding,
                    y: 50,
                    width: SLIDE_WIDTH - padding * 2,
                    height: 70,
                    fontSize: 48,
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fill: textColor,
                    align: "center",
                    lineHeight: 1.15,
                    letterSpacing: -1.2,
                }
            },
            elements

        };
    },

    // === VARIANT 2: GLASSMORPHIC CARDS (FIXED) ===
    variant2: (slide: any, colors: any, textColor: string, SLIDE_WIDTH = 960, SLIDE_HEIGHT = 540) => {
        const allBullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
        const cardGap = 40;
        const cardX = 55;
        const cardWidth = (SLIDE_WIDTH * 0.5 - cardX * 2 - cardGap / 2);
        const cardY = 150;
        const cardHeight = 340;
        const imageX = SLIDE_WIDTH * 0.5 + cardGap / 2;
        const bulletSpacing = 50;
        const bulletHeight = 40;
        const bulletStartY = cardY + 80;

        // Calculate max bullets that fit
        const maxBullets = Math.min(allBullets.length, Math.floor((cardHeight - 100) / bulletSpacing));
        const visibleBullets = allBullets.slice(0, maxBullets);

        return {
            ...slide,
            slide_title: {
                text: slide.slide_title?.text,
                konva_component: "Text",
                properties: {
                    x: 70, y: 45, width: SLIDE_WIDTH - 140, height: 70,
                    fontSize: 46, fontFamily: FONT_HEADING, fontWeight: 800,
                    fill: textColor, align: "center", lineHeight: 1.15, letterSpacing: -1
                }
            },
            elements: [
                // Background
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT,
                        fillLinearGradientStartPoint: { x: 0, y: 0 },
                        fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: SLIDE_HEIGHT },
                        fillLinearGradientColorStops: [
                            0, colors.background,
                            1, hexToRgba(colors.background, 0.95)
                        ]
                    }
                },
                // Background orbs (left)
                {
                    element_type: "shape",
                    konva_component: "Konva.Circle",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: 150, y: 250, radius: 120,
                        fillRadialGradientStartPoint: { x: 0, y: 0 },
                        fillRadialGradientEndPoint: { x: 0, y: 0 },
                        fillRadialGradientStartRadius: 0,
                        fillRadialGradientEndRadius: 120,
                        fillRadialGradientColorStops: [
                            0, hexToRgba(colors.primary, 0.12),
                            1, hexToRgba(colors.primary, 0)
                        ]
                    }
                },
                // Background orbs (right)
                {
                    element_type: "shape",
                    konva_component: "Konva.Circle",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: SLIDE_WIDTH - 120, y: SLIDE_HEIGHT - 100, radius: 100,
                        fillRadialGradientStartPoint: { x: 0, y: 0 },
                        fillRadialGradientEndPoint: { x: 0, y: 0 },
                        fillRadialGradientStartRadius: 0,
                        fillRadialGradientEndRadius: 100,
                        fillRadialGradientColorStops: [
                            0, hexToRgba(colors.secondary, 0.12),
                            1, hexToRgba(colors.secondary, 0)
                        ]
                    }
                },
                // Left Glass Card
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: cardX, y: cardY, width: cardWidth, height: cardHeight,
                        fill: hexToRgba(colors.background, 0.7),
                        cornerRadius: 28,
                        stroke: hexToRgba(colors.primary, 0.2),
                        strokeWidth: 2
                    }
                },
                // Left card top accent
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: cardX, y: cardY, width: cardWidth, height: 8,
                        fillLinearGradientStartPoint: { x: 0, y: 0 },
                        fillLinearGradientEndPoint: { x: cardWidth, y: 0 },
                        fillLinearGradientColorStops: [
                            0, colors.primary,
                            1, hexToRgba(colors.primary, 0.6)
                        ],
                        cornerRadius: [28, 28, 0, 0]
                    }
                },
                // Left card icon
                {
                    element_type: "shape",
                    konva_component: "Konva.Circle",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: cardX + 30, y: cardY + 40, radius: 20,
                        fill: hexToRgba(colors.primary, 0.15)
                    }
                },
                {
                    element_type: "text",
                    text: "1",
                    konva_component: "Text",
                    properties: {
                        x: cardX + 18, y: cardY + 28, width: 24, height: 24,
                        fontSize: 20, fontFamily: FONT_HEADING, fontWeight: 800,
                        fill: colors.primary, align: "center"
                    }
                },
                // Right Image Container
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: imageX, y: cardY, width: cardWidth, height: cardHeight,
                        fill: hexToRgba(colors.background, 0.7),
                        cornerRadius: 28,
                        stroke: hexToRgba(colors.secondary, 0.2),
                        strokeWidth: 2
                    }
                },
                // Right card top accent
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: imageX, y: cardY, width: cardWidth, height: 8,
                        fillLinearGradientStartPoint: { x: 0, y: 0 },
                        fillLinearGradientEndPoint: { x: cardWidth, y: 0 },
                        fillLinearGradientColorStops: [
                            0, hexToRgba(colors.secondary, 0.6),
                            1, colors.secondary
                        ],
                        cornerRadius: [28, 28, 0, 0]
                    }
                },
                // Right card icon
                {
                    element_type: "shape",
                    konva_component: "Konva.Circle",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: imageX + 30, y: cardY + 40, radius: 20,
                        fill: hexToRgba(colors.secondary, 0.15)
                    }
                },
                {
                    element_type: "text",
                    text: "2",
                    konva_component: "Text",
                    properties: {
                        x: imageX + 18, y: cardY + 28, width: 24, height: 24,
                        fontSize: 20, fontFamily: FONT_HEADING, fontWeight: 800,
                        fill: colors.secondary, align: "center"
                    }
                },
                // Left Bullets with circle icons
                ...visibleBullets.map((bullet: any, index: number) => [
                    {
                        element_type: "shape",
                        konva_component: "Konva.Circle",
                        shape_id: `auto-${uuidv4()}`,
                        properties: {
                            x: cardX + 24, y: bulletStartY + (index * bulletSpacing) + 16,
                            radius: 6,
                            fill: colors.primary
                        }
                    },
                    {
                        element_type: "bullet_point",
                        text: bullet.text || '',
                        konva_component: "Text",
                        properties: {
                            x: cardX + 40,
                            y: bulletStartY + (index * bulletSpacing),
                            width: cardWidth - 60,
                            height: bulletHeight,
                            fontSize: 15,
                            fontFamily: FONT_BODY,
                            fontWeight: 500,
                            fill: textColor,
                            align: "left",
                            lineHeight: 1.4
                        }
                    }
                ]).flat(),
                // Image portion (properly contained)
                {
                    element_type: "image",
                    konva_component: "Image",
                    image_id: `auto-${uuidv4()}`,
                    properties: {
                        x: imageX + 15,
                        y: cardY + 70,
                        width: cardWidth - 30,
                        height: cardHeight - 85,
                        imageSrc: slide.image_url || '',
                        cornerRadius: 16
                    }
                }
            ]
        };
    },

    // === VARIANT 3: DIAGONAL SPLIT (FIXED) ===
    variant3: (slide: any, colors: any, textColor: string, SLIDE_WIDTH = 960, SLIDE_HEIGHT = 540) => {
        const allBullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
        const padding = 65;
        const startY = 185;
        const bulletSpacing = 50;
        const bulletHeight = 40;
        const contentWidth = SLIDE_WIDTH * 0.45 - padding * 1.5;
        const imageX = SLIDE_WIDTH * 0.55 + 15;
        const imageWidth = SLIDE_WIDTH * 0.45 - padding;
        const imageHeight = 300;

        const maxBullets = Math.min(allBullets.length, Math.floor((SLIDE_HEIGHT - startY - 50) / bulletSpacing));
        const visibleBullets = allBullets.slice(0, maxBullets);

        return {
            ...slide,
            slide_title: {
                text: slide.slide_title?.text || "Split Analysis",
                konva_component: "Text",
                properties: {
                    x: 70, y: 50, width: SLIDE_WIDTH - 140, height: 65,
                    fontSize: 44, fontFamily: FONT_HEADING, fontWeight: 800,
                    fill: textColor, align: "center", lineHeight: 1.2, letterSpacing: -0.8
                }
            },
            elements: [
                // Base
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
                },
                // Diagonal split (left)
                {
                    element_type: "shape",
                    konva_component: "Konva.Path",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        data: `M 0 0 L ${SLIDE_WIDTH * 0.55} 0 L ${SLIDE_WIDTH * 0.45} ${SLIDE_HEIGHT} L 0 ${SLIDE_HEIGHT} Z`,
                        fill: hexToRgba(colors.primary, 0.06)
                    }
                },
                // Diagonal split (right)
                {
                    element_type: "shape",
                    konva_component: "Konva.Path",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        data: `M ${SLIDE_WIDTH} 0 L ${SLIDE_WIDTH * 0.55} 0 L ${SLIDE_WIDTH * 0.45} ${SLIDE_HEIGHT} L ${SLIDE_WIDTH} ${SLIDE_HEIGHT} Z`,
                        fill: hexToRgba(colors.secondary, 0.06)
                    }
                },
                // Decorative shapes (left)
                {
                    element_type: "shape",
                    konva_component: "Konva.Circle",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: padding + 30, y: 140, radius: 40,
                        fill: hexToRgba(colors.primary, 0.12)
                    }
                },
                // Decorative shapes (right)
                {
                    element_type: "shape",
                    konva_component: "Konva.Circle",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: SLIDE_WIDTH - padding - 30, y: SLIDE_HEIGHT - 80, radius: 35,
                        fill: hexToRgba(colors.secondary, 0.12)
                    }
                },
                // Title underline
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: SLIDE_WIDTH * 0.35, y: 125, width: SLIDE_WIDTH * 0.3, height: 5,
                        fillLinearGradientStartPoint: { x: 0, y: 0 },
                        fillLinearGradientEndPoint: { x: SLIDE_WIDTH * 0.3, y: 0 },
                        fillLinearGradientColorStops: [
                            0, colors.primary,
                            0.5, colors.accent,
                            1, colors.secondary
                        ],
                        cornerRadius: 3
                    }
                },
                // Section headers
                {
                    element_type: "text",
                    text: "SECTION A",
                    konva_component: "Text",
                    properties: {
                        x: padding, y: startY - 45, width: contentWidth, height: 30,
                        fontSize: 13, fontFamily: FONT_HEADING, fontWeight: 700,
                        fill: colors.primary, align: "left", letterSpacing: 3
                    }
                },
                {
                    element_type: "text",
                    text: "SECTION B",
                    konva_component: "Text",
                    properties: {
                        x: imageX, y: startY - 45, width: imageWidth, height: 30,
                        fontSize: 13, fontFamily: FONT_HEADING, fontWeight: 700,
                        fill: colors.secondary, align: "left", letterSpacing: 3
                    }
                },
                // Left Bullets with circle icons
                ...visibleBullets.flatMap((bullet: any, index: number) => [
                    {
                        element_type: "shape",
                        konva_component: "Konva.Circle",
                        shape_id: `auto-${uuidv4()}`,
                        properties: {
                            x: padding + 18, y: startY + (index * bulletSpacing) + 16,
                            radius: 6,
                            fill: colors.primary
                        }
                    },
                    {
                        element_type: "bullet_point",
                        text: bullet.text || '',
                        konva_component: "Text",
                        properties: {
                            x: padding + 35,
                            y: startY + (index * bulletSpacing),
                            width: contentWidth - 35,
                            height: bulletHeight,
                            fontSize: 15,
                            fontFamily: FONT_BODY,
                            fontWeight: 500,
                            fill: textColor,
                            align: "left",
                            lineHeight: 1.4
                        }
                    }
                ]),
                // Image container
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: imageX - 5, y: startY - 5,
                        width: imageWidth + 10, height: imageHeight + 10,
                        fill: "transparent",
                        stroke: colors.secondary,
                        strokeWidth: 2,
                        cornerRadius: 20
                    }
                },
                // Image portion
                {
                    element_type: "image",
                    konva_component: "Image",
                    image_id: `auto-${uuidv4()}`,
                    properties: {
                        x: imageX,
                        y: startY,
                        width: imageWidth,
                        height: imageHeight,
                        imageSrc: slide.image_url || '',
                        cornerRadius: 16
                    }
                },
                // Central divider
                {
                    element_type: "shape",
                    konva_component: "Konva.Line",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        points: [
                            SLIDE_WIDTH * 0.52, 145,
                            SLIDE_WIDTH * 0.48, SLIDE_HEIGHT - 60
                        ],
                        stroke: colors.accent,
                        strokeWidth: 4,
                        lineCap: "round"
                    }
                }
            ]
        };
    },

    // === VARIANT 4: LAYERED PANELS (FIXED) ===
    variant4: (slide: any, colors: any, textColor: string, SLIDE_WIDTH = 960, SLIDE_HEIGHT = 540) => {
        const panelX = 60;
        const panelWidth = (SLIDE_WIDTH * 0.5 - panelX * 2 - 25);
        const panelY = 160;
        const panelHeight = 330;
        const imageX = SLIDE_WIDTH * 0.5 + 25;
        const bulletSpacing = 50;
        const bulletHeight = 40;
        const bulletStartY = panelY + 85;
        const allBullets = slide.elements?.filter((el: any) =>
            el.element_type === "bullet_point"
        ) || [];
        const maxBullets = Math.min(allBullets.length, Math.floor((panelHeight - 100) / bulletSpacing));
        const visibleBullets = allBullets.slice(0, maxBullets);
        const hasBullets = allBullets.length > 0;
        const hasImage = slide.image_url && slide.image_url !== "";
          const  elements: any[]= [
                // Background
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT,
                        fillLinearGradientStartPoint: { x: 0, y: 0 },
                        fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: 0 },
                        fillLinearGradientColorStops: [
                            0, colors.background,
                            0.5, hexToRgba(colors.background, 0.98),
                            1, colors.background
                        ]
                    }
                },
                // Decorative elements
                {
                    element_type: "shape",
                    konva_component: "Konva.Circle",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: 100, y: 200, radius: 80,
                        fill: hexToRgba(colors.primary, 0.06)
                    }
                },
                {
                    element_type: "shape",
                    konva_component: "Konva.Circle",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: SLIDE_WIDTH - 100, y: SLIDE_HEIGHT - 100, radius: 90,
                        fill: hexToRgba(colors.secondary, 0.06)
                    }
                },
                // Left Panel - Shadow
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: panelX + 8, y: panelY + 8, width: panelWidth, height: panelHeight,
                        fill: hexToRgba(colors.primary, 0.08),
                        cornerRadius: 24,
                        opacity: 0.6
                    }
                },
                // Left Panel - Main
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: panelX, y: panelY, width: panelWidth, height: panelHeight,
                        fill: hexToRgba(colors.background, 0.95),
                        cornerRadius: 24,
                        stroke: hexToRgba(colors.primary, 0.25),
                        strokeWidth: 3
                    }
                },
                // Left Panel - Header
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: panelX, y: panelY, width: panelWidth, height: 60,
                        fillLinearGradientStartPoint: { x: 0, y: 0 },
                        fillLinearGradientEndPoint: { x: panelWidth, y: 60 },
                        fillLinearGradientColorStops: [
                            0, hexToRgba(colors.primary, 0.2),
                            1, hexToRgba(colors.primary, 0.08)
                        ],
                        cornerRadius: [24, 24, 0, 0]
                    }
                },
                // Left Panel - Icon
                {
                    element_type: "shape",
                    konva_component: "Konva.Circle",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: panelX + 30, y: panelY + 30, radius: 18,
                        fill: colors.primary
                    }
                },
                {
                    element_type: "text",
                    text: "A",
                    konva_component: "Text",
                    properties: {
                        x: panelX + 20, y: panelY + 20, width: 20, height: 20,
                        fontSize: 16, fontFamily: FONT_HEADING, fontWeight: 800,
                        fill: "#FFFFFF", align: "center"
                    }
                },
                // Left Panel - Title
               
                // Right Panel - Shadow
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: imageX + 8, y: panelY + 8, width: panelWidth, height: panelHeight,
                        fill: hexToRgba(colors.secondary, 0.08),
                        cornerRadius: 24,
                        opacity: 0.6
                    }
                },
                // Right Panel - Main
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: imageX, y: panelY, width: panelWidth, height: panelHeight,
                        fill: hexToRgba(colors.background, 0.95),
                        cornerRadius: 24,
                        stroke: hexToRgba(colors.secondary, 0.25),
                        strokeWidth: 3
                    }
                },
                // Right Panel - Header
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: imageX, y: panelY, width: panelWidth, height: 60,
                        fillLinearGradientStartPoint: { x: 0, y: 0 },
                        fillLinearGradientEndPoint: { x: panelWidth, y: 60 },
                        fillLinearGradientColorStops: [
                            0, hexToRgba(colors.secondary, 0.08),
                            1, hexToRgba(colors.secondary, 0.2)
                        ],
                        cornerRadius: [24, 24, 0, 0]
                    }
                },
                // Right Panel - Icon
                {
                    element_type: "shape",
                    konva_component: "Konva.Circle",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: imageX + 30, y: panelY + 30, radius: 18,
                        fill: colors.secondary
                    }
                },
                {
                    element_type: "text",
                    text: "B",
                    konva_component: "Text",
                    properties: {
                        x: imageX + 20, y: panelY + 20, width: 20, height: 20,
                        fontSize: 16, fontFamily: FONT_HEADING, fontWeight: 800,
                        fill: "#FFFFFF", align: "center"
                    }
                },
             // Left Bullets with circle icons
                ...visibleBullets.map((bullet: any, index: number) => [
                    {
                        element_type: "shape",
                        konva_component: "Konva.Circle",
                        shape_id: `auto-${uuidv4()}`,
                        properties: {
                            x: panelX + 24, y: bulletStartY + (index * bulletSpacing) + 16,
                            radius: 6,
                            fill: colors.primary
                        }
                    },
                    {
                        element_type: "bullet_point",
                        text: bullet.text || '',
                        konva_component: "Text",
                        properties: {
                            x: panelX + 40,
                            y: bulletStartY + (index * bulletSpacing),
                            width: panelWidth - 60,
                            height: bulletHeight,
                            fontSize: 15,
                            fontFamily: FONT_BODY,
                            fontWeight: 500,
                            fill: textColor,
                            align: "left",
                            lineHeight: 1.4
                        }
                    }
                ]).flat(),
                // Image portion (properly contained)
                {
                    element_type: "image",
                    konva_component: "Image",
                    image_id: `auto-${uuidv4()}`,
                    properties: {
                        x: imageX + 15,
                        y: panelY + 70,
                        width: panelWidth - 30,
                        height: panelHeight - 85,
                        imageSrc: slide.image_url || '',
                        cornerRadius: 16
                    }
                },
                // Connecting element
                {
                    element_type: "shape",
                    konva_component: "Konva.Circle",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: SLIDE_WIDTH / 2, y: panelY + panelHeight / 2,
                        radius: 20,
                        fillLinearGradientStartPoint: { x: -20, y: -20 },
                        fillLinearGradientEndPoint: { x: 20, y: 20 },
                        fillLinearGradientColorStops: [
                            0, colors.primary,
                            1, colors.secondary
                        ]
                    }
                }
            ];
            if(hasBullets){
                elements.push( {
                    element_type: "text",
                    text: "FRAMEWORK ALPHA",
                    konva_component: "Text",
                    properties: {
                        x: panelX + 55, y: panelY + 22, width: panelWidth - 70, height: 20,
                        fontSize: 12, fontFamily: FONT_HEADING, fontWeight: 700,
                        fill: colors.primary, align: "left", letterSpacing: 1.5
                    }
                });
            }
          if(hasBullets){
                elements.push( {
                    element_type: "text",
                    text: "FRAMEWORK BETA",
                    konva_component: "Text",
                    properties: {
                        x: panelX + 55, y: panelY + 22, width: panelWidth - 70, height: 20,
                        fontSize: 12, fontFamily: FONT_HEADING, fontWeight: 700,
                        fill: colors.primary, align: "left", letterSpacing: 1.5
                    }
                });
            }
        

        return {
            ...slide,
            slide_title: {
                text: slide.slide_title?.text,
                konva_component: "Text",
                properties: {
                    x: 70, y: 48, width: SLIDE_WIDTH - 140, height: 68,
                    fontSize: 45, fontFamily: FONT_HEADING, fontWeight: 800,
                    fill: textColor, align: "center", lineHeight: 1.15, letterSpacing: -0.9
                }
            },

        };
    },

    // === VARIANT 5: FLOWING RIBBONS (FIXED) ===
    variant5: (slide: any, colors: any, textColor: string, SLIDE_WIDTH = 960, SLIDE_HEIGHT = 540) => {
        const contentX = 75;
        const contentWidth = (SLIDE_WIDTH * 0.45 - contentX * 1.5);
        const startY = 175;
        const bulletSpacing = 50;
        const bulletHeight = 40;
        const imageX = SLIDE_WIDTH * 0.55 + 20;
        const imageWidth = SLIDE_WIDTH * 0.45 - contentX;
        const imageHeight = 300;
        const allBullets = slide.elements?.filter((el: any) =>
            el.element_type === "bullet_point"
        ) || [];
        const maxBullets = Math.min(allBullets.length, Math.floor((SLIDE_HEIGHT - startY - 50) / bulletSpacing));
        const visibleBullets = allBullets.slice(0, maxBullets);
        const hasBullets = allBullets.length > 0;
        const hasImage = slide.image_url && slide.image_url !== "";
        const elements: any[] = [
            // Background
            {
                element_type: "shape",
                konva_component: "Konva.Rect",
                shape_id: `auto-${uuidv4()}`,
                properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
            },
            // Flowing ribbon (left)
            {
                element_type: "shape",
                konva_component: "Konva.Path",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    data: `M 0 ${SLIDE_HEIGHT * 0.2} Q ${SLIDE_WIDTH * 0.15} ${SLIDE_HEIGHT * 0.35}, ${SLIDE_WIDTH * 0.4} ${SLIDE_HEIGHT * 0.3} Q ${SLIDE_WIDTH * 0.5} ${SLIDE_HEIGHT * 0.28}, ${SLIDE_WIDTH * 0.5} ${SLIDE_HEIGHT * 0.5} Q ${SLIDE_WIDTH * 0.5} ${SLIDE_HEIGHT * 0.7}, ${SLIDE_WIDTH * 0.3} ${SLIDE_HEIGHT * 0.75} Q ${SLIDE_WIDTH * 0.1} ${SLIDE_HEIGHT * 0.8}, 0 ${SLIDE_HEIGHT * 0.9} Z`,
                    fillLinearGradientStartPoint: { x: 0, y: 0 },
                    fillLinearGradientEndPoint: { x: SLIDE_WIDTH * 0.5, y: SLIDE_HEIGHT },
                    fillLinearGradientColorStops: [
                        0, hexToRgba(colors.primary, 0.08),
                        0.6, hexToRgba(colors.primary, 0.04),
                        1, hexToRgba(colors.primary, 0.02)
                    ]
                }
            },
            // Flowing ribbon (right)
            {
                element_type: "shape",
                konva_component: "Konva.Path",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    data: `M ${SLIDE_WIDTH} ${SLIDE_HEIGHT * 0.2} Q ${SLIDE_WIDTH * 0.85} ${SLIDE_HEIGHT * 0.35}, ${SLIDE_WIDTH * 0.6} ${SLIDE_HEIGHT * 0.3} Q ${SLIDE_WIDTH * 0.5} ${SLIDE_HEIGHT * 0.28}, ${SLIDE_WIDTH * 0.5} ${SLIDE_HEIGHT * 0.5} Q ${SLIDE_WIDTH * 0.5} ${SLIDE_HEIGHT * 0.7}, ${SLIDE_WIDTH * 0.7} ${SLIDE_HEIGHT * 0.75} Q ${SLIDE_WIDTH * 0.9} ${SLIDE_HEIGHT * 0.8}, ${SLIDE_WIDTH} ${SLIDE_HEIGHT * 0.9} Z`,
                    fillLinearGradientStartPoint: { x: SLIDE_WIDTH * 0.5, y: 0 },
                    fillLinearGradientEndPoint: { x: SLIDE_WIDTH, y: SLIDE_HEIGHT },
                    fillLinearGradientColorStops: [
                        0, hexToRgba(colors.secondary, 0.08),
                        0.6, hexToRgba(colors.secondary, 0.04),
                        1, hexToRgba(colors.secondary, 0.02)
                    ]
                }
            },
            // Decorative orbs (left)
            {
                element_type: "shape",
                konva_component: "Konva.Circle",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: contentX + 25, y: 135, radius: 40,
                    fillRadialGradientStartPoint: { x: 0, y: 0 },
                    fillRadialGradientEndPoint: { x: 0, y: 0 },
                    fillRadialGradientStartRadius: 0,
                    fillRadialGradientEndRadius: 40,
                    fillRadialGradientColorStops: [
                        0, hexToRgba(colors.primary, 0.2),
                        1, hexToRgba(colors.primary, 0)
                    ]
                }
            },
            // Decorative orbs (right)
            {
                element_type: "shape",
                konva_component: "Konva.Circle",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: SLIDE_WIDTH - contentX - 25, y: SLIDE_HEIGHT - 85, radius: 45,
                    fillRadialGradientStartPoint: { x: 0, y: 0 },
                    fillRadialGradientEndPoint: { x: 0, y: 0 },
                    fillRadialGradientStartRadius: 0,
                    fillRadialGradientEndRadius: 45,
                    fillRadialGradientColorStops: [
                        0, hexToRgba(colors.secondary, 0.2),
                        1, hexToRgba(colors.secondary, 0)
                    ]
                }
            },
            // Title accent bar
            {
                element_type: "shape",
                konva_component: "Konva.Rect",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: SLIDE_WIDTH * 0.3, y: 120, width: SLIDE_WIDTH * 0.4, height: 4,
                    fillLinearGradientStartPoint: { x: 0, y: 0 },
                    fillLinearGradientEndPoint: { x: SLIDE_WIDTH * 0.4, y: 0 },
                    fillLinearGradientColorStops: [
                        0, hexToRgba(colors.primary, 0.3),
                        0.5, colors.accent,
                        1, hexToRgba(colors.secondary, 0.3)
                    ],
                    cornerRadius: 2
                }
            },
            // Section badges
            {
                element_type: "shape",
                konva_component: "Konva.Rect",
                shape_id: `auto-${uuidv4()}`,

                properties: {
                    x: contentX - 12, y: startY - 50, width: 120, height: 32,
                    fill: hexToRgba(colors.primary, 0.15),
                    cornerRadius: 16
                }
            },

            {
                element_type: "shape",
                konva_component: "Konva.Rect",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: imageX - 12, y: startY - 50, width: 120, height: 32,
                    fill: hexToRgba(colors.secondary, 0.15),
                    cornerRadius: 16
                }
            },
            // Left Bullets with circle icons
            ...visibleBullets.map((bullet: any, index: number) => [
                {
                    element_type: "shape",
                    konva_component: "Konva.Rect",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: contentX - 10, y: startY + (index * bulletSpacing) - 3,
                        width: contentWidth + 20, height: bulletHeight + 6,
                        fill: hexToRgba(colors.background, 0.6),
                        cornerRadius: 12,
                        stroke: hexToRgba(colors.primary, 0.12),
                        strokeWidth: 1
                    }
                },
                {
                    element_type: "shape",
                    konva_component: "Konva.Circle",
                    shape_id: `auto-${uuidv4()}`,
                    properties: {
                        x: contentX + 18, y: startY + (index * bulletSpacing) + 16,
                        radius: 6,
                        fill: colors.primary
                    }
                },
                {
                    element_type: "bullet_point",
                    text: bullet.text || '',
                    konva_component: "Text",
                    properties: {
                        x: contentX + 35,
                        y: startY + (index * bulletSpacing),
                        width: contentWidth - 35,
                        height: bulletHeight,
                        fontSize: 15,
                        fontFamily: FONT_BODY,
                        fontWeight: 500,
                        fill: textColor,
                        align: "left",
                        lineHeight: 1.4
                    }
                }
            ]).flat(),
            // Image container
            {
                element_type: "shape",
                konva_component: "Konva.Rect",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: imageX - 5, y: startY - 5,
                    width: imageWidth + 10, height: imageHeight + 10,
                    fill: "transparent",
                    stroke: colors.secondary,
                    strokeWidth: 2,
                    cornerRadius: 20
                }
            },
            // Image portion
            {
                element_type: "image",
                konva_component: "Image",
                image_id: `auto-${uuidv4()}`,
                properties: {
                    x: imageX,
                    y: startY,
                    width: imageWidth,
                    height: imageHeight,
                    imageSrc: slide.image_url || '',
                    cornerRadius: 16
                }
            },
            // Central divider with decorative elements
            {
                element_type: "shape",
                konva_component: "Konva.Rect",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: SLIDE_WIDTH / 2 - 2, y: 135, width: 4, height: SLIDE_HEIGHT - 175,
                    cornerRadius: 2,
                    fillLinearGradientStartPoint: { x: 0, y: 0 },
                    fillLinearGradientEndPoint: { x: 0, y: SLIDE_HEIGHT - 175 },
                    fillLinearGradientColorStops: [
                        0, hexToRgba(colors.primary, 0.4),
                        0.5, colors.accent,
                        1, hexToRgba(colors.secondary, 0.4)
                    ]
                }
            },
            {
                element_type: "shape",
                konva_component: "Konva.Circle",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: SLIDE_WIDTH / 2, y: 135, radius: 8,
                    fill: colors.accent
                }
            },
            {
                element_type: "shape",
                konva_component: "Konva.Circle",
                shape_id: `auto-${uuidv4()}`,
                properties: {
                    x: SLIDE_WIDTH / 2, y: SLIDE_HEIGHT - 40, radius: 8,
                    fill: colors.accent
                }
            }
        ];
        if (hasBullets) {
            elements.push({
                element_type: "text",
                text: "PERSPECTIVE 1",
                konva_component: "Text",
                properties: {
                    x: contentX - 12, y: startY - 47, width: 120, height: 20,
                    fontSize: 11, fontFamily: FONT_HEADING, fontWeight: 700,
                    fill: colors.primary, align: "center", letterSpacing: 1.2
                }
            });
        }
        if (hasBullets) {
            elements.push({
                element_type: "text",
                text: "PERSPECTIVE 2",
                konva_component: "Text",
                properties: {
                    x: contentX - 12, y: startY - 47, width: 120, height: 20,
                    fontSize: 11, fontFamily: FONT_HEADING, fontWeight: 700,
                    fill: colors.primary, align: "center", letterSpacing: 1.2
                }
            });
        }


        return {
            ...slide,
            slide_title: {
                text: slide.slide_title?.text || "Contrasting Views",
                konva_component: "Text",
                properties: {
                    x: 70, y: 45, width: SLIDE_WIDTH - 140, height: 65,
                    fontSize: 44, fontFamily: FONT_HEADING, fontWeight: 800,
                    fill: textColor, align: "center", lineHeight: 1.2, letterSpacing: -0.8
                }
            },
            elements
        };
    }
};