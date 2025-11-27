import { v4 as uuidv4 } from "uuid";

const hexToRgba = (hex: string, alpha: number): string => {
    const normalized = hex.startsWith('#') ? hex : `#${hex}`;
    const r = parseInt(normalized.slice(1, 3), 16);
    const g = parseInt(normalized.slice(3, 5), 16);
    const b = parseInt(normalized.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Safely extract quote, author, context + original elements
const getQuoteData = (slide: any) => {
  const quoteEl = slide.elements?.find((el: any) => el.element_type === "quote");
  const authorEl = slide.elements?.find((el: any) => el.element_type === "author");
  const contextEl = slide.elements?.find((el: any) => el.element_type === "context");

  return {
    quote: quoteEl?.text || "Inspirational Quote",
    author: authorEl?.text || "Author Name",
    context: contextEl?.text || "",
    quoteEl,
    authorEl,
    contextEl,
  };
};

export const createQuoteSlide = {
  // ==================== VARIANT 1 ====================
  variant1: (slide: any, colors: any, textColor: string, SLIDE_WIDTH = 960, SLIDE_HEIGHT = 540) => {
    const { quote, author, context, quoteEl, authorEl, contextEl } = getQuoteData(slide);

    const elements = [
      // Background
      {
        element_type: "shape",
        konva_component: "Rect",
        shape_id: uuidv4(),
        properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background },
      },
      // Opening quotation mark
      {
        element_type: "text",
        text: "“",
        konva_component: "Text",
        shape_id: uuidv4(),
        properties: {
          x: 80,
          y: 100,
          width: 100,
          height: 100,
          fontSize: 120,
          fontFamily: "Georgia",
          fontWeight: "bold",
          fill: hexToRgba(colors.accent, 0.25),
          align: "left",
        },
      },
      // PRESERVE ORIGINAL QUOTE ELEMENT
      {
        ...(quoteEl || {}),
        element_type: "quote",
        text: quote,
        konva_component: "Text",
        properties: {
          ...(quoteEl?.properties || {}),
          x: 100,
          y: 200,
          width: SLIDE_WIDTH - 200,
          height: 180,
          fontSize: 26,
          fontFamily: "Raleway",
          fontWeight: "400",
          fill: textColor,
          align: "center",
          lineHeight: 1.5,
        },
      },
      // AUTHOR
      {
        ...(authorEl || {}),
        element_type: "author",
        text: `— ${author}`,
        konva_component: "Text",
        properties: {
          ...(authorEl?.properties || {}),
          x: 100,
          y: 380,
          width: SLIDE_WIDTH - 200,
          height: 50,
          fontSize: 20,
          fontFamily: "Raleway",
          fontWeight: "600",
          fill: hexToRgba(textColor, 0.9),
          align: "center",
        },
      },
    ];

    if (context) {
      elements.push({
        ...(contextEl || {}),
        element_type: "context",
        text: context,
        konva_component: "Text",
        properties: {
          ...(contextEl?.properties || {}),
          x: 120,
          y: 440,
          width: SLIDE_WIDTH - 240,
          height: 60,
          fontSize: 14,
          fontFamily: "Raleway",
          fontWeight: "400",
          fill: hexToRgba(textColor, 0.7),
          align: "center",
          lineHeight: 1.4,
        },
      });
    }

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Expert Perspective",
        konva_component: "Text",
        properties: {
          x: 80,
          y: 50,
          width: SLIDE_WIDTH - 160,
          height: 50,
          fontSize: 24,
          fontFamily: "Raleway",
          fontWeight: "600",
          fill: textColor,
          align: "center",
        },
      },
      elements,
    };
  },

  // ==================== VARIANT 2 ====================
  variant2: (slide: any, colors: any, textColor: string, SLIDE_WIDTH = 960, SLIDE_HEIGHT = 540) => {
    const { quote, author, context, quoteEl, authorEl, contextEl } = getQuoteData(slide);

    const elements = [
      { element_type: "shape", konva_component: "Rect", shape_id: uuidv4(), properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background } },
      {
        ...(quoteEl || {}),
        element_type: "quote",
        text: quote,
        konva_component: "Text",
        properties: {
          ...(quoteEl?.properties || {}),
          x: 120,
          y: 140,
          width: SLIDE_WIDTH - 240,
          height: 180,
          fontSize: 28,
          fontFamily: "Raleway",
          fontWeight: "400",
          fill: textColor,
          align: "center",
          lineHeight: 1.5,
        },
      },
      {
        element_type: "shape",
        konva_component: "Rect",
        shape_id: uuidv4(),
        properties: { x: SLIDE_WIDTH / 2 - 120, y: 340, width: 240, height: 4, fill: colors.accent },
      },
      {
        ...(authorEl || {}),
        element_type: "author",
        text: author,
        konva_component: "Text",
        properties: {
          ...(authorEl?.properties || {}),
          x: 120,
          y: 360,
          width: SLIDE_WIDTH - 240,
          height: 40,
          fontSize: 18,
          fontFamily: "Raleway",
          fontWeight: "600",
          fill: hexToRgba(textColor, 0.9),
          align: "center",
        },
      },
    ];

    if (context) {
      elements.push({
        ...(contextEl || {}),
        element_type: "context",
        text: context,
        konva_component: "Text",
        properties: {
          x: 120,
          y: 410,
          width: SLIDE_WIDTH - 240,
          height: 60,
          fontSize: 14,
          fontFamily: "Raleway",
          fill: hexToRgba(textColor, 0.7),
          align: "center",
        },
      });
    }

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Quote",
        konva_component: "Text",
        properties: {
          x: 80,
          y: 50,
          width: SLIDE_WIDTH - 160,
          height: 50,
          fontSize: 22,
          fontFamily: "Raleway",
          fontWeight: "600",
          fill: textColor,
          align: "center",
        },
      },
      elements,
    };
  },

  // ==================== VARIANT 3 ====================
  variant3: (slide: any, colors: any, textColor: string, SLIDE_WIDTH = 960, SLIDE_HEIGHT = 540) => {
    const { quote, author, context, quoteEl, authorEl, contextEl } = getQuoteData(slide);

    const elements = [
      { element_type: "shape", konva_component: "Rect", shape_id: uuidv4(), properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background } },
      {
        element_type: "shape",
        konva_component: "Circle",
        shape_id: uuidv4(),
        properties: {
          x: SLIDE_WIDTH / 2,
          y: SLIDE_HEIGHT / 2,
          radius: 180,
          fill: hexToRgba(colors.primary, 0.1),
        },
      },
      {
        ...(quoteEl || {}),
        element_type: "quote",
        text: `“${quote}”`,
        konva_component: "Text",
        properties: {
          ...(quoteEl?.properties || {}),
          x: 140,
          y: 160,
          width: SLIDE_WIDTH - 280,
          height: 180,
          fontSize: 25,
          fontFamily: "Raleway",
          fontWeight: "400",
          fill: textColor,
          align: "center",
          lineHeight: 1.5,
        },
      },
      {
        ...(authorEl || {}),
        element_type: "author",
        text: `— ${author}`,
        konva_component: "Text",
        properties: {
          ...(authorEl?.properties || {}),
          x: SLIDE_WIDTH - 380,
          y: 350,
          width: 280,
          height: 40,
          fontSize: 18,
          fontFamily: "Raleway",
          fontWeight: "600",
          fill: hexToRgba(textColor, 0.85),
          align: "right",
        },
      },
    ];

    if (context) {
      elements.push({
        ...(contextEl || {}),
        element_type: "context",
        text: context,
        konva_component: "Text",
        properties: {
          x: 140,
          y: 400,
          width: SLIDE_WIDTH - 280,
          height: 60,
          fontSize: 14,
          fontFamily: "Raleway",
          fill: hexToRgba(textColor, 0.7),
          align: "center",
        },
      });
    }

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Quote",
        konva_component: "Text",
        properties: {
          x: 80,
          y: 50,
          width: SLIDE_WIDTH - 160,
          height: 50,
          fontSize: 22,
          fontFamily: "Raleway",
          fontWeight: "600",
          fill: textColor,
          align: "left",
        },
      },
      elements,
    };
  },

  // ==================== VARIANT 4 ====================
  variant4: (slide: any, colors: any, textColor: string, SLIDE_WIDTH = 960, SLIDE_HEIGHT = 540) => {
    const { quote, author, context, quoteEl, authorEl, contextEl } = getQuoteData(slide);

    const elements = [
      { element_type: "shape", konva_component: "Rect", shape_id: uuidv4(), properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background } },
      {
        element_type: "shape",
        konva_component: "Rect",
        shape_id: uuidv4(),
        properties: {
          x: 100,
          y: 140,
          width: SLIDE_WIDTH - 200,
          height: 260,
          fill: "transparent",
          cornerRadius: 12,
          stroke: hexToRgba(colors.accent, 0.5),
          strokeWidth: 3,
        },
      },
      {
        ...(quoteEl || {}),
        element_type: "quote",
        text: quote,
        konva_component: "Text",
        properties: {
          ...(quoteEl?.properties || {}),
          x: 140,
          y: 180,
          width: SLIDE_WIDTH - 280,
          height: 140,
          fontSize: 26,
          fontFamily: "Raleway",
          fontWeight: "400",
          fill: textColor,
          align: "center",
          lineHeight: 1.5,
        },
      },
      {
        ...(authorEl || {}),
        element_type: "author",
        text: author,
        konva_component: "Text",
        properties: {
          ...(authorEl?.properties || {}),
          x: 140,
          y: 340,
          width: SLIDE_WIDTH - 280,
          height: 40,
          fontSize: 18,
          fontFamily: "Raleway",
          fontWeight: "700",
          fill: colors.accent,
          align: "center",
        },
      },
    ];

    if (context) {
      elements.push({
        ...(contextEl || {}),
        element_type: "context",
        text: context,
        konva_component: "Text",
        properties: {
          x: 120,
          y: 410,
          width: SLIDE_WIDTH - 240,
          height: 60,
          fontSize: 14,
          fontFamily: "Raleway",
          fill: hexToRgba(textColor, 0.7),
          align: "center",
        },
      });
    }

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Quote",
        konva_component: "Text",
        properties: {
          x: 80,
          y: 45,
          width: SLIDE_WIDTH - 160,
          height: 50,
          fontSize: 24,
          fontFamily: "Raleway",
          fontWeight: "700",
          fill: textColor,
          align: "center",
        },
      },
      elements,
    };
  },

  // ==================== VARIANT 5 ====================
  variant5: (slide: any, colors: any, textColor: string, SLIDE_WIDTH = 960, SLIDE_HEIGHT = 540) => {
    const { quote, author, context, quoteEl, authorEl, contextEl } = getQuoteData(slide);

    const elements = [
      { element_type: "shape", konva_component: "Rect", shape_id: uuidv4(), properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background } },
      {
        element_type: "text",
        text: "“",
        konva_component: "Text",
        shape_id: uuidv4(),
        properties: {
          x: SLIDE_WIDTH / 2 - 60,
          y: 80,
          width: 120,
          height: 120,
          fontSize: 160,
          fontFamily: "Georgia",
          fill: hexToRgba(colors.accent, 0.2),
          align: "center",
        },
      },
      {
        ...(quoteEl || {}),
        element_type: "quote",
        text: quote,
        konva_component: "Text",
        properties: {
          ...(quoteEl?.properties || {}),
          x: 120,
          y: 200,
          width: SLIDE_WIDTH - 240,
          height: 160,
          fontSize: 27,
          fontFamily: "Raleway",
          fontWeight: "300",
          fill: textColor,
          align: "center",
          lineHeight: 1.6,
        },
      },
      {
        ...(authorEl || {}),
        element_type: "author",
        text: `— ${author}`,
        konva_component: "Text",
        properties: {
          ...(authorEl?.properties || {}),
          x: 120,
          y: 370,
          width: SLIDE_WIDTH - 240,
          height: 50,
          fontSize: 20,
          fontFamily: "Raleway",
          fontWeight: "600",
          fill: hexToRgba(textColor, 0.9),
          align: "center",
        },
      },
    ];

    if (context) {
      elements.push({
        ...(contextEl || {}),
        element_type: "context",
        text: context,
        konva_component: "Text",
        properties: {
          x: 120,
          y: 430,
          width: SLIDE_WIDTH - 240,
          height: 60,
          fontSize: 14,
          fontFamily: "Raleway",
          fill: hexToRgba(textColor, 0.7),
          align: "center",
        },
      });
    }

    return {
      ...slide,
      slide_title: {
        text: slide.slide_title?.text || "Quote",
        konva_component: "Text",
        properties: {
          x: 80,
          y: 50,
          width: SLIDE_WIDTH - 160,
          height: 50,
          fontSize: 22,
          fontFamily: "Raleway",
          fontWeight: "600",
          fill: textColor,
          align: "center",
        },
      },
      elements,
    };
  },
};