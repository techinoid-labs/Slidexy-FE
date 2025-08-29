import type { Slide, SlideElement } from "../types/presentation"

export const createModernTemplate = (backendSlide: any, slideIndex: number): Slide => {
  const elements: SlideElement[] = []
  const { slide_id, slide_title, image_url, textBlock, imageBlock } = backendSlide

  // Brand palette (two neutrals)
  const brandColors = ["rgba(196,131,21,1)", "rgba(0,158,126,1)"]
  const accentColor = brandColors[slideIndex % brandColors.length]

  // Background color base (light neutral)
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Rect",
    properties: {
      x: 0,
      y: 0,
      width: 960,
      height: 540,
      fill: "#f9f9f9",
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 960, y: 540 },
      fillLinearGradientColorStops: [0, "#f9f9f9", 0.5, "#e0e7ff", 1, "#f0fdfa"],
      zIndex: 0,
    },
    id: `bg-gradient-${slide_id || slideIndex}`,
  })

  // Secondary gradient overlay (top left to bottom right, blue to transparent)
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Rect",
    properties: {
      x: 0,
      y: 0,
      width: 960,
      height: 540,
      fill: "#3b82f6",
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 960, y: 540 },
      fillLinearGradientColorStops: [0, "#3b82f633", 1, "#ffffff00"],
      opacity: 0.18,
      zIndex: 0,
    },
    id: `bg-gradient2-${slide_id || slideIndex}`,
  })

  // Large blurred accent circle (modern blob)
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Circle",
    properties: {
      x: 820,
      y: 120,
      radius: 180,
      fill: accentColor,
      opacity: 0.13,
      shadowBlur: 80,
      zIndex: 1,
    },
    id: `bg-blob-${slide_id || slideIndex}`,
  })

  // Additional accent circle (bottom left, purple)
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Circle",
    properties: {
      x: 120,
      y: 500,
      radius: 90,
      fill: "#7c3aed",
      opacity: 0.10,
      shadowBlur: 60,
      zIndex: 1,
    },
    id: `bg-blob2-${slide_id || slideIndex}`,
  })

  // Subtle geometric overlay (angled rectangle)
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Rect",
    properties: {
      x: 700,
      y: 320,
      width: 300,
      height: 120,
      fill: "#fff",
      opacity: 0.08,
      rotation: 24,
      zIndex: 2,
    },
    id: `bg-geo-${slide_id || slideIndex}`,
  })

  // Modern triangle accent (top right)
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Line",
    properties: {
      points: [900, 0, 960, 0, 960, 60],
      fill: "#06b6d4",
      opacity: 0.12,
      closed: true,
      zIndex: 2,
    },
    id: `bg-triangle-${slide_id || slideIndex}`,
  })

  // Layouts by index
  const layoutType = slideIndex % 4

  // --- Layout 0: Cover / Title ---
  if (layoutType === 0) {
    if (slide_title?.text) {
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Rect",
        properties: {
          x: 100,
          y: 200,
          width: 760,
          height: 140,
          fill: "#ffffff",
          cornerRadius: 20,
          shadowColor: "#00000022",
          shadowBlur: 20,
          zIndex: 2,
        },
        id: `title-bg-${slide_id}-${slideIndex}`,
      })
      elements.push({
        element_type: "title",
        konva_component: "Konva.Text",
        text: slide_title.text,
        properties: {
          x: 120,
          y: 240,
          fontSize: 44,
          fontFamily: "Poppins, sans-serif",
          fill: "#000000", // black text
          fontStyle: "bold",
          width: 720,
          align: "center",
          zIndex: 3,
        },
        id: slide_title.id || `title-${slide_id}-${slideIndex}`,
      })
    }
  }

  // --- Layout 1: Text left, Image right ---
  else if (layoutType === 1) {
    if (slide_title?.text) {
      elements.push({
        element_type: "title",
        konva_component: "Konva.Text",
        text: slide_title.text,
        properties: {
          x: 60,
          y: 60,
          fontSize: 36,
          fontFamily: "Poppins, sans-serif",
          fill: "#000000",
          fontStyle: "bold",
          width: 400,
          zIndex: 2,
        },
        id: slide_title.id || `title-${slide_id}-${slideIndex}`,
      })
    }

    textBlock?.elements?.forEach((point: any, i: number) => {
      elements.push({
        element_type: "bullet_point",
        konva_component: "Konva.Text",
        text: point.text,
        properties: {
          x: 80,
          y: 120 + i * 40,
          fontSize: 18,
          fontFamily: "Inter, sans-serif",
          fill: "#000000",
          width: 380,
          zIndex: 2,
        },
        id: point.id || `bullet-${slide_id}-${i}`,
      })
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Circle",
        properties: {
          x: 60,
          y: 130 + i * 40,
          radius: 5,
          fill: accentColor,
          zIndex: 2,
        },
        id: `bullet-dot-${slide_id}-${i}`,
      })
    })

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
          height: 280,
          zIndex: 3,
          rounded: 16,
        },
        id: `image-${slide_id}-${slideIndex}`,
      })
    }
  }

  // --- Layout 2: Image top, Text bottom ---
  else if (layoutType === 2) {
    const imageSrc = imageBlock?.elements?.[0]?.properties?.imageSrc || image_url
    if (imageSrc) {
      elements.push({
        element_type: "image",
        konva_component: "Konva.Image",
        properties: {
          imageSrc,
          x: 180,
          y: 40,
          width: 600,
          height: 240,
          zIndex: 3,
          rounded: 16,
        },
        id: `image-${slide_id}-${slideIndex}`,
      })
    }

    if (slide_title?.text) {
      elements.push({
        element_type: "title",
        konva_component: "Konva.Text",
        text: slide_title.text,
        properties: {
          x: 80,
          y: 300,
          fontSize: 32,
          fontFamily: "Poppins, sans-serif",
          fill: "#000000",
          fontStyle: "bold",
          width: 800,
          zIndex: 3,
        },
        id: slide_title.id || `title-${slide_id}-${slideIndex}`,
      })
    }

    textBlock?.elements?.forEach((point: any, i: number) => {
      elements.push({
        element_type: "bullet_point",
        konva_component: "Konva.Text",
        text: point.text,
        properties: {
          x: 100,
          y: 350 + i * 36,
          fontSize: 16,
          fontFamily: "Inter, sans-serif",
          fill: "#000000",
          width: 760,
          zIndex: 3,
        },
        id: point.id || `bullet-${slide_id}-${i}`,
      })
    })
  }

  // --- Layout 3: Big centered quote / statement ---
  else {
    if (slide_title?.text) {
      elements.push({
        element_type: "shape",
        konva_component: "Konva.Rect",
        properties: {
          x: 100,
          y: 200,
          width: 760,
          height: 160,
          fill: "#ffffff",
          cornerRadius: 20,
          shadowColor: "#00000022",
          shadowBlur: 12,
          zIndex: 2,
        },
        id: `quote-bg-${slide_id}-${slideIndex}`,
      })
      elements.push({
        element_type: "title",
        konva_component: "Konva.Text",
        text: `“${slide_title.text}”`,
        properties: {
          x: 120,
          y: 240,
          fontSize: 36,
          fontFamily: "Georgia, serif",
          fill: "#000000",
          fontStyle: "italic",
          width: 720,
          align: "center",
          zIndex: 3,
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
