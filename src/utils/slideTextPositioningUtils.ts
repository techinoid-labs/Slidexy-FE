// utils/positionUtils.ts
import { getSlideDimensions } from "@/utils/slideUtils";

const getDynamicConstants = () => {
  const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING } = getSlideDimensions();
  const IMAGE_WIDTH = 400;
  const IMAGE_PADDING = 40;
  const textMaxWidth = SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING;
  const textMaxHeight = SLIDE_HEIGHT;
  return {
    SLIDE_WIDTH,
    SLIDE_HEIGHT,
    LEFT_PADDING,
    IMAGE_WIDTH,
    IMAGE_PADDING,
    textMaxWidth,
    textMaxHeight,
  };
};

export const getDefaultPosition = (elementType: string) => {
  const constants = getDynamicConstants();
  switch (elementType) {
    case "title":
    case "slide_title":
      return { x: constants.LEFT_PADDING, y: 25 };
    case "bullet_point":
      return { x: constants.LEFT_PADDING + 20, y: 133 }; // fallback Y
    case "image":
      return { x: constants.LEFT_PADDING, y: 300 };
    default:
      return { x: constants.LEFT_PADDING, y: 300 };
  }
};

export const applyElementPositioning = (
  slides: any[],
  selectedTheme: any
): any[] => {
  const constants = getDynamicConstants();
  const bulletGap = 20;
  const lineHeight = 1.2;

  return slides.map((slide: any) => {
    const updatedSlide = { ...slide };

    if (
      updatedSlide.slide_title &&
      (updatedSlide.slide_title.properties?.x == null ||
        updatedSlide.slide_title.properties?.y == null)
    ) {
      const { x, y } = getDefaultPosition("slide_title");
      updatedSlide.slide_title = {
        ...updatedSlide.slide_title,
        properties: {
          ...updatedSlide.slide_title.properties,
          x: updatedSlide.slide_title.properties.x ?? x,
          y: updatedSlide.slide_title.properties.y ?? y,
        },
      };
    }

    const bulletStartY =
      (updatedSlide.slide_title?.properties?.y ?? 25) +
      (updatedSlide.slide_title?.properties?.fontSize ?? 38) +
      70;

    let currentBulletY = bulletStartY;

    updatedSlide.elements = updatedSlide.elements.map((el: any) => {
      if (el.element_type === "bullet_point") {
        const fontSize = el.properties?.fontSize ?? 20;
        const fontFamily =
          selectedTheme?.font || el.properties?.fontFamily || "Arial";
        const text = el.text || "";

        const textWidth = constants.textMaxWidth - 20;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context!.font = `${fontSize}px ${fontFamily}`;

        const words = text.split(" ");
        let lines: string[] = [];
        let line = "";

        for (let word of words) {
          const testLine = line + word + " ";
          const metrics = context!.measureText(testLine);
          if (metrics.width > textWidth && line !== "") {
            lines.push(line.trim());
            line = word + " ";
          } else {
            line = testLine;
          }
        }
        if (line) lines.push(line.trim());

        const estimatedHeight = lines.length * fontSize * lineHeight;

        const updatedEl = {
          ...el,
          properties: {
            ...el.properties,
            x: el.properties?.x ?? constants.LEFT_PADDING + 20,
            y: currentBulletY,
          },
        };
        currentBulletY += estimatedHeight + bulletGap;
        return updatedEl;
      }

      if (el.properties?.x == null || el.properties?.y == null) {
        const { x, y } = getDefaultPosition(el.element_type);
        return {
          ...el,
          properties: {
            ...el.properties,
            x: el.properties?.x ?? x,
            y: el.properties?.y ?? y,
          },
        };
      }

      return el;
    });

    return updatedSlide;
  });
};
