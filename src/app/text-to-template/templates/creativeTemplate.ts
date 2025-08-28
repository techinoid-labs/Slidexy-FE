import type { Slide, SlideElement } from "../types/presentation"

export const createCreativeTemplate = (backendSlide: any , slideIndex: number): Slide => {
  const elements: SlideElement[] = [];

  // Dynamic background
  const bgColors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"];
  const bgColor = bgColors[slideIndex % bgColors.length];

  // Background
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Rect",
    properties: { x: 0, y: 0, width: 960, height: 540, fill: bgColor, zIndex: 0 },
    id: `bg-${backendSlide.slide_id || slideIndex}`,
  });

  // Decorative circles
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Circle",
    properties: { x: 850, y: 100, radius: 80, fill: "#ffffff20", zIndex: 1 },
    id: `circle-1-${slideIndex}`,
  });
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Circle",
    properties: { x: 100, y: 450, radius: 60, fill: "#ffffff15", zIndex: 1 },
    id: `circle-2-${slideIndex}`,
  });

  // Content card
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Rect",
    properties: {
      x: 80,
      y: 80,
      width: 800,
      height: 380,
      fill: "#ffffff",
      cornerRadius: 25,
      opacity: 0.95,
      zIndex: 2,
    },
    id: `content-card-${slideIndex}`,
  });

  // Title (map slide_title.text → creative "title")
  if (backendSlide.slide_title?.text) {
    elements.push({
      element_type: "title",
      text: backendSlide.slide_title.text,
      konva_component: "Konva.Text",
      properties: {
        x: 120,
        y: 120,
        fontSize: 38,
        fontFamily: "Poppins, sans-serif",
        fill: "#2c3e50",
        fontWeight: "bold",
        width: 720,
        height: 50,
        align: "left",
        zIndex: 100,
      },
      id: backendSlide.slide_title.id || `title-${slideIndex}`,
    });
  }

  // Accent bar
  elements.push({
    element_type: "shape",
    konva_component: "Konva.Rect",
    properties: { x: 120, y: 180, width: 100, height: 6, fill: bgColor, cornerRadius: 3, zIndex: 4 },
    id: `accent-bar-${slideIndex}`,
  });

  // Description (first textBlock element if available)
  if (backendSlide.textBlock?.elements?.length) {
    const firstText = backendSlide.textBlock.elements[0].text;
    if (firstText) {
      elements.push({
        element_type: "text",
        text: firstText,
        konva_component: "Konva.Text",
        properties: {
          x: 120,
          y: 210,
          fontSize: 16,
          fontFamily: "Poppins, sans-serif",
          fill: "#34495e",
          width: 400,
          height: 70,
          align: "left",
          zIndex: 4,
        },
        id: `content-${backendSlide.slide_id || slideIndex}`,
      });
    }
  }

  // Bullet points (remaining textBlock elements → creative bullets)
  if (backendSlide.textBlock?.elements?.length > 1) {
    const bulletColors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6"];
    backendSlide.textBlock.elements.slice(1).forEach((point : any , index : any) => {
      const bulletColor = bulletColors[index % bulletColors.length];
      elements.push({
        element_type: "shape",
        konva_component: "Konva.RegularPolygon",
        properties: { x: 130, y: 300 + index * 32, sides: 4, radius: 6, fill: bulletColor, rotation: 45, zIndex: 4 },
        id: `bullet-shape-${index}-${slideIndex}`,
      });
      elements.push({
        element_type: "bullet_point",
        text: point.text,
        konva_component: "Konva.Text",
        properties: {
          x: 150,
          y: 290 + index * 32,
          fontSize: 15,
          fontFamily: "Poppins, sans-serif",
          fill: "#2c3e50",
          fontWeight: "500",
          width: 350,
          height: 22,
          align: "left",
          zIndex: 100,
        },
        id: point.id || `bullet-${index}-${slideIndex}`,
      });
    });
  }

  // Image (from imageBlock or image_url)
  const imageSrc = backendSlide.imageBlock?.elements?.[0]?.properties?.imageSrc || backendSlide.image_url;
  if (imageSrc) {
    elements.push({
      element_type: "shape",
      konva_component: "Konva.Rect",
      properties: {
        x: 540,
        y: 200,
        width: 280,
        height: 200,
        fill: "#ffffff",
        cornerRadius: 20,
        stroke: bgColor,
        strokeWidth: 4,
        zIndex: 3,
      },
      id: `image-frame-${slideIndex}`,
    });
    elements.push({
      element_type: "image",
      konva_component: "Konva.Image",
      properties: { imageSrc, x: 550, y: 210, width: 260, height: 180, zIndex: 4, rounded: 15 },
      id: `image-${slideIndex}`,
    });
  }

  return {
    slide_id: backendSlide.slide_id || `slide-${slideIndex}`,
    title: backendSlide.slide_title?.text || `Slide ${slideIndex + 1}`,
    elements,
  };
};
