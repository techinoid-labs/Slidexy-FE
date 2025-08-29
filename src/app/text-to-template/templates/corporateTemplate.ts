

import type { Slide, SlideElement } from "../types/presentation"

export const createCorporateTemplate = (backendSlide: any, slideIndex: number): Slide => {
  const elements: SlideElement[] = []
  const { slide_id, slide_title, image_url, textBlock, imageBlock } = backendSlide

  // Professional corporate color palette
  const primaryColors = ["#1e3a8a", "#0f172a", "#374151", "#1f2937"] // Deep blues and grays
  const accentColors = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b"] // Bright accents
  const primaryColor = primaryColors[slideIndex % primaryColors.length]
  const accentColor = accentColors[slideIndex % accentColors.length]

  // Konva-compatible vertical gradient background
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Rect",
    properties: {
      x: 0,
      y: 0,
      width: 960,
      height: 540,
      fill: "#f8fafc", // fallback color
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 960, y: 540 },
      fillLinearGradientColorStops: [0, "#f8fafc", 1, "#e2e8f0"],
      zIndex: 0,
    },
    id: `bg-gradient-${slide_id || slideIndex}`,
  })

  // Header accent bar with horizontal gradient
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Rect",
    properties: {
      x: 0,
      y: 0,
      width: 960,
      height: 8,
      fill: primaryColor, // fallback color
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 960, y: 0 },
      fillLinearGradientColorStops: [0, primaryColor, 1, accentColor],
      zIndex: 1,
    },
    id: `header-bar-${slide_id || slideIndex}`,
  })

  // Subtle geometric pattern overlay
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Rect",
    properties: {
      x: 700,
      y: -50,
      width: 400,
      height: 400,
      fill: primaryColor,
      opacity: 0.03,
      rotation: 45,
      zIndex: 1,
    },
    id: `pattern-${slide_id || slideIndex}`,
  })

  const layoutType = slideIndex % 4

  // Layout 0: Executive Summary / Cover
  if (layoutType === 0) {
    // Main content card with shadow
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      properties: {
        x: 120,
        y: 120,
        width: 720,
        height: 300,
        fill: "#ffffff",
        cornerRadius: 16,
        shadowColor: "rgba(0,0,0,0.1)",
        shadowBlur: 24,
        zIndex: 2,
      },
      id: `main-card-${slide_id}-${slideIndex}`,
    })

    // Accent stripe with horizontal gradient
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      properties: {
        x: 120,
        y: 120,
        width: 720,
        height: 6,
        fill: accentColor, // fallback color
        fillLinearGradientStartPoint: { x: 120, y: 120 },
        fillLinearGradientEndPoint: { x: 840, y: 120 },
        fillLinearGradientColorStops: [0, accentColor, 1, primaryColor],
        cornerRadius: 16,
        zIndex: 3,
      },
      id: `accent-stripe-${slide_id}-${slideIndex}`,
    })

    if (slide_title?.text) {
      elements.push({
        element_type: "title",
        konva_component: "Konva.Text",
        text: slide_title.text,
        properties: {
          x: 160,
          y: 200,
          fontSize: 42,
          fontFamily: "Inter, sans-serif",
          fill: primaryColor,
          fontWeight: "700",
          width: 640,
          align: "center",
          zIndex: 4,
        },
        id: slide_title.id || `title-${slide_id}-${slideIndex}`,
      })
    }

    // Subtitle area
    if (textBlock?.elements?.[0]) {
      elements.push({
        element_type: "text",
        konva_component: "Konva.Text",
        text: textBlock.elements[0].text,
        properties: {
          x: 160,
          y: 280,
          fontSize: 18,
          fontFamily: "Inter, sans-serif",
          fill: "#64748b",
          width: 640,
          align: "center",
          zIndex: 4,
        },
        id: `subtitle-${slide_id}-${slideIndex}`,
      })
    }
  }

  // Layout 1: Data-driven layout
  else if (layoutType === 1) {
    // Left content panel
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      properties: {
        x: 60,
        y: 80,
        width: 420,
        height: 380,
        fill: "#ffffff",
        cornerRadius: 12,
        shadowColor: "rgba(0,0,0,0.08)",
        shadowBlur: 16,
        zIndex: 2,
      },
      id: `left-panel-${slide_id}-${slideIndex}`,
    })

    // Right visual panel with diagonal gradient
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      properties: {
        x: 500,
        y: 80,
        width: 400,
        height: 380,
        fill: primaryColor + '15', // fallback color
        fillLinearGradientStartPoint: { x: 500, y: 80 },
        fillLinearGradientEndPoint: { x: 900, y: 460 },
        fillLinearGradientColorStops: [0, primaryColor + '15', 1, accentColor + '10'],
        cornerRadius: 12,
        zIndex: 2,
      },
      id: `right-panel-${slide_id}-${slideIndex}`,
    })

    if (slide_title?.text) {
      elements.push({
        element_type: "title",
        konva_component: "Konva.Text",
        text: slide_title.text,
        properties: {
          x: 80,
          y: 110,
          fontSize: 32,
          fontFamily: "Inter, sans-serif",
          fill: primaryColor,
          fontWeight: "600",
          width: 380,
          zIndex: 3,
        },
        id: slide_title.id || `title-${slide_id}-${slideIndex}`,
      })
    }

    // Professional bullet points with custom styling
    textBlock?.elements?.forEach((point: any, i: number) => {
      // Bullet background
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Rect",
        properties: {
          x: 80,
          y: 170 + i * 50,
          width: 380,
          height: 40,
          fill: i % 2 === 0 ? "#f8fafc" : "transparent",
          cornerRadius: 6,
          zIndex: 2,
        },
        id: `bullet-bg-${slide_id}-${i}`,
      })

      // Modern bullet icon
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Rect",
        properties: {
          x: 95,
          y: 185 + i * 50,
          width: 8,
          height: 8,
          fill: accentColor,
          cornerRadius: 2,
          zIndex: 3,
        },
        id: `bullet-icon-${slide_id}-${i}`,
      })

      elements.push({
        element_type: "bullet_point",
        konva_component: "Konva.Text",
        text: point.text,
        properties: {
          x: 115,
          y: 180 + i * 50,
          fontSize: 16,
          fontFamily: "Inter, sans-serif",
          fill: "#334155",
          width: 340,
          zIndex: 3,
        },
        id: point.id || `bullet-${slide_id}-${i}`,
      })
    })

    // Image with professional styling
    const imageSrc = imageBlock?.elements?.[0]?.properties?.imageSrc || image_url
    if (imageSrc) {
      elements.push({
        element_type: "image",
        konva_component: "Konva.Image",
        properties: {
          imageSrc,
          x: 520,
          y: 120,
          width: 360,
          height: 240,
          zIndex: 3,
          rounded: 12,
          opacity: 0.95,
        },
        id: `image-${slide_id}-${slideIndex}`,
      })
    }
  }

  // Layout 2: Executive dashboard style
  else if (layoutType === 2) {
    // Top metrics bar with horizontal gradient
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      properties: {
        x: 60,
        y: 60,
        width: 840,
        height: 80,
        fill: primaryColor, // fallback color
        fillLinearGradientStartPoint: { x: 60, y: 60 },
        fillLinearGradientEndPoint: { x: 900, y: 60 },
        fillLinearGradientColorStops: [0, primaryColor, 1, accentColor],
        cornerRadius: 12,
        zIndex: 2,
      },
      id: `metrics-bar-${slide_id}-${slideIndex}`,
    })

    if (slide_title?.text) {
      elements.push({
        element_type: "title",
        konva_component: "Konva.Text",
        text: slide_title.text,
        properties: {
          x: 80,
          y: 85,
          fontSize: 28,
          fontFamily: "Inter, sans-serif",
          fill: "#ffffff",
          fontWeight: "600",
          width: 800,
          align: "center",
          zIndex: 3,
        },
        id: slide_title.id || `title-${slide_id}-${slideIndex}`,
      })
    }

    // Content grid
    const imageSrc = imageBlock?.elements?.[0]?.properties?.imageSrc || image_url
    if (imageSrc) {
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Rect",
        properties: {
          x: 60,
          y: 160,
          width: 400,
          height: 300,
          fill: "#ffffff",
          cornerRadius: 12,
          shadowColor: "rgba(0,0,0,0.06)",
          shadowBlur: 12,
          zIndex: 2,
        },
        id: `image-container-${slide_id}-${slideIndex}`,
      })

      elements.push({
        element_type: "image",
        konva_component: "Konva.Image",
        properties: {
          imageSrc,
          x: 80,
          y: 180,
          width: 360,
          height: 200,
          zIndex: 3,
          rounded: 8,
        },
        id: `image-${slide_id}-${slideIndex}`,
      })
    }

    // Text content panel
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      properties: {
        x: 480,
        y: 160,
        width: 420,
        height: 300,
        fill: "#ffffff",
        cornerRadius: 12,
        shadowColor: "rgba(0,0,0,0.06)",
        shadowBlur: 12,
        zIndex: 2,
      },
      id: `text-panel-${slide_id}-${slideIndex}`,
    })

    textBlock?.elements?.forEach((point: any, i: number) => {
      elements.push({
        element_type: "bullet_point",
        konva_component: "Konva.Text",
        text: point.text,
        properties: {
          x: 500,
          y: 190 + i * 35,
          fontSize: 16,
          fontFamily: "Inter, sans-serif",
          fill: "#1e293b",
          width: 380,
          zIndex: 3,
        },
        id: point.id || `bullet-${slide_id}-${i}`,
      })
    })
  }

  // Layout 3: Statement/Quote with professional styling
  else {
    // Quote background with diagonal gradient
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      properties: {
        x: 100,
        y: 150,
        width: 760,
        height: 240,
        fill: primaryColor + '08', // fallback color
        fillLinearGradientStartPoint: { x: 100, y: 150 },
        fillLinearGradientEndPoint: { x: 860, y: 390 },
        fillLinearGradientColorStops: [0, primaryColor + '08', 1, accentColor + '05'],
        cornerRadius: 20,
        strokeWidth: 2,
        stroke: `${accentColor}30`,
        zIndex: 2,
      },
      id: `quote-bg-${slide_id}-${slideIndex}`,
    })

    // Quote mark decoration
    elements.push({
      element_type: "text",
      konva_component: "Konva.Text",
      text: '"',
      properties: {
        x: 140,
        y: 120,
        fontSize: 80,
        fontFamily: "Georgia, serif",
        fill: accentColor + '4D', // add transparency (4D = ~30% opacity in hex)
        width: 80,
        zIndex: 3,
      },
      id: `quote-mark-${slide_id}-${slideIndex}`,
    })

    if (slide_title?.text) {
      elements.push({
        element_type: "title",
        konva_component: "Konva.Text",
        text: slide_title.text,
        properties: {
          x: 140,
          y: 220,
          fontSize: 32,
          fontFamily: "Inter, sans-serif",
          fill: primaryColor,
          fontWeight: "500",
          width: 680,
          align: "center",
          zIndex: 4,
        },
        id: slide_title.id || `title-${slide_id}-${slideIndex}`,
      })
    }
  }

  return {
    slide_id: slide_id || `slide-${slideIndex}`,
    title: slide_title?.text || `Slide ${slideIndex + 1}`,
    image_url: image_url || undefined,
    elements,
  }
}
