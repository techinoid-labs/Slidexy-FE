import PptxGenJS from "pptxgenjs";
import { get } from "idb-keyval";

export type StructuredSlide = {
  slide_id: string;
  slide_title?: {
    text: string;
    properties?: {
      fontSize?: number;
      fontFamily?: string;
      fill?: string;
      fontStyle?: string;
      fontWeight?: string;
    };
  };
  elements: {
    useThemeColor?: boolean;
    element_type: "title" | "bullet_point" | "image" | "text" | "shape";
    text?: string;
    src?: string;
    // properties?: {
    //   x?: number;
    //   y?: number;
    //   w?: number;
    //   h?: number;
    //   fontSize?: number;
    //   fontFamily?: string;
    //   fill?: string;
    //   fontStyle?: string;
    //   fontWeight?: string;
    //   imageSrc?: string;
    // };
    properties?: {
      x?: number;
      y?: number;
      w?: number;
      h?: number;
      fontSize?: number;
      fontFamily?: string;
      fill?: string;
      fontStyle?: string;
      fontWeight?: string;
      imageSrc?: string;

      // 🔽 Shape-specific props
      stroke?: string;
      strokeWidth?: number;
      radius?: number;
      radiusX?: number;
      radiusY?: number;
      innerRadius?: number;
      outerRadius?: number;
      angle?: number;
      points?: number[];
      sides?: number;
    };
  }[];
  image_url?: string;
};

const LOCAL_STORAGE_THEME_KEY = "slidesTheme";
const INDEXED_DB_THEME_KEY = "slidesThemeIndexed";

export async function exportSlidesAsPPT(structuredSlides: StructuredSlide[]) {
  const pptx = new PptxGenJS();
  const pptFileName = localStorage.getItem("fileName") || "Presentation";

  pptx.defineLayout({ name: "WIDE", width: 10, height: 5.625 });
  pptx.layout = "WIDE";

  // Load theme from localStorage first, then fallback to IndexedDB
  let theme: any = null;
  const localThemeRaw = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);

  if (localThemeRaw) {
    try {
      theme = JSON.parse(localThemeRaw);
    } catch (e) {
      console.warn("Invalid local theme JSON:", e);
    }
  } else {
    try {
      const indexedTheme = await get(INDEXED_DB_THEME_KEY);
      if (indexedTheme) theme = indexedTheme;
    } catch (e) {
      console.warn("Failed to load theme from IndexedDB:", e);
    }
  }

  // Default theme-based fallbacks
  const defaultFont = theme?.font || "Arial";
  const defaultColor = theme?.primaryColor || "000000";
  const defaultFontWeight = theme?.fontWeight || "normal";
  const defaultFontStyle = theme?.fontStyle || "normal";

  structuredSlides.forEach((structuredSlide) => {
    const slide = pptx.addSlide();

    // Slide background image or color
    if (theme?.image_url) {
      slide.addImage({
        path: theme.image_url,
        x: 0,
        y: 0,
        w: 10,
        h: 5.625,
      });
    } else if (theme?.backgroundColor) {
      slide.background = { fill: theme.backgroundColor };
    }

    // Slide title
    const title = structuredSlide.slide_title;
    if (title?.text) {
      const props = title.properties || {};

      console.log(defaultColor || props.fill, {
        defaultColor,
        fill: props.fill,
      });

      slide.addText(title.text, {
        x: 0.5,
        y: 0.4,
        w: 8,
        h: 0.8,
        fontSize: props.fontSize || 24,
        color: defaultColor || props.fill,
        fontFace: props.fontFamily || defaultFont,
        bold:
          props.fontWeight === "bold" ||
          props.fontWeight === "600" ||
          defaultFontWeight === "bold",
        italic: props.fontStyle === "italic" || defaultFontStyle === "italic",
      });
    }

    // Slide elements
    structuredSlide.elements.forEach((el) => {
      const { element_type, text, properties = {}, src } = el;
      const {
        x = 1,
        y = 1,
        w = 4,
        h = 0.6,
        fontSize = 16,
        fill,
        fontFamily,
        fontStyle,
        fontWeight,
        imageSrc,
      } = properties;

      // Determine final font color and face
      const colorToUse =
        el.useThemeColor === false ? fill : defaultColor || fill;
      const fontToUse = fontFamily || defaultFont;
      const isBold =
        fontWeight === "bold" ||
        fontWeight === "600" ||
        defaultFontWeight === "bold";
      const isItalic = fontStyle === "italic" || defaultFontStyle === "italic";

      if (
        (element_type === "bullet_point" || element_type === "text") &&
        text
      ) {
        slide.addText(text, {
          x,
          y,
          w: w + 0.5,
          h: h + 0.2,
          fontSize,
          color: colorToUse,
          fontFace: fontToUse,
          bold: isBold,
          italic: isItalic,
          bullet: element_type === "bullet_point",
        });
      }

      if (element_type === "image" && (imageSrc || src)) {
        slide.addImage({
          path: imageSrc || src!,
          x,
          y,
          w,
          h,
        });
      }

      if (element_type === "shape") {
        const {
          x = 1,
          y = 1,
          w = 2,
          h = 2,
          fill = "cccccc",
          stroke,
          strokeWidth,
          radius,
          radiusX,
          radiusY,
          innerRadius,
          outerRadius,
          angle,
          points,
          sides,
        } = properties;

        const shapeName = text || "shape";

        const fillObj = { color: `#${fill}` };
        const lineObj = stroke ? { color: `#${stroke}` } : undefined;

        switch (shapeName) {
          case "Konva.Rect":
            slide.addShape(pptx.ShapeType.rect, {
              x,
              y,
              w,
              h,
              fill: fillObj,
              line: lineObj,
              lineSize: strokeWidth,
            });
            break;

          case "Konva.Circle":
            slide.addShape(pptx.ShapeType.ellipse, {
              x,
              y,
              w: radius ? (radius * 2) / 100 : w,
              h: radius ? (radius * 2) / 100 : h,
              fill: fillObj,
              line: lineObj,
              lineSize: strokeWidth,
            });
            break;

          case "Konva.Ellipse":
            slide.addShape(pptx.ShapeType.ellipse, {
              x,
              y,
              w: radiusX ? (radiusX * 2) / 100 : w,
              h: radiusY ? (radiusY * 2) / 100 : h,
              fill: fillObj,
              line: lineObj,
              lineSize: strokeWidth,
            });
            break;

          case "Konva.Line":
          case "Konva.Arrow":
            // Infer dimensions from point list
            if (points && points.length >= 4) {
              const xCoords = points.filter((_, i) => i % 2 === 0);
              const yCoords = points.filter((_, i) => i % 2 === 1);
              const minX = Math.min(...xCoords);
              const minY = Math.min(...yCoords);
              const maxX = Math.max(...xCoords);
              const maxY = Math.max(...yCoords);

              slide.addShape(pptx.ShapeType.line, {
                x: minX / 100,
                y: minY / 100,
                w: (maxX - minX) / 100 || 1,
                h: (maxY - minY) / 100 || 0.1,
                line: { color: `#${stroke || fill}` },
                lineSize: strokeWidth || 2,
              });
            } else {
              slide.addShape(pptx.ShapeType.line, {
                x,
                y,
                w,
                h: strokeWidth || 0.2,
                line: { color: `#${stroke || fill}` },
                lineSize: strokeWidth || 2,
              });
            }
            break;

          case "Konva.Star":
            if (outerRadius) {
              const size = (outerRadius * 2) / 100;
              slide.addShape(pptx.ShapeType.star5, {
                x,
                y,
                w: size,
                h: size,
                fill: fillObj,
                line: lineObj,
                lineSize: strokeWidth,
              });
            } else {
              slide.addShape(pptx.ShapeType.star5, {
                x,
                y,
                w,
                h,
                fill: fillObj,
                line: lineObj,
                lineSize: strokeWidth,
              });
            }
            break;

          case "Konva.RegularPolygon":
            if (sides && w && h) {
              const size = Math.max(w, h);
              slide.addShape(pptx.ShapeType.hexagon, {
                x,
                y,
                w: size,
                h: size,
                fill: fillObj,
                line: lineObj,
                lineSize: strokeWidth,
              });
            } else {
              slide.addShape(pptx.ShapeType.hexagon, {
                x,
                y,
                w,
                h,
                fill: fillObj,
                line: lineObj,
                lineSize: strokeWidth,
              });
            }
            break;

          case "Konva.Wedge":
          case "Konva.Arc":
            slide.addShape(pptx.ShapeType.pie, {
              x,
              y,
              w,
              h,
              fill: fillObj,
              line: lineObj,
              lineSize: strokeWidth,
            });
            break;

          default:
            slide.addShape(pptx.ShapeType.rect, {
              x,
              y,
              w,
              h,
              fill: fillObj,
            });
        }
      }
    });
  });

  await pptx.writeFile({ fileName: `${pptFileName}.pptx` });
}
