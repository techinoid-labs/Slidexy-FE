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

      // const bulletPoints = structuredSlide.elements
      //   .filter((el) => el.element_type === "bullet_point" && el.text)
      //   .map((el) => `${el.text}`); // prefixing is optional; pptxgen will handle bullets

      // if (bulletPoints.length > 0) {
      //   slide.addText(bulletPoints.join("\n"), {
      //     x: 0.8,
      //     y: 1.4,
      //     w: 8.4,
      //     h: 3,
      //     fontSize: 16,
      //     color: defaultColor,
      //     fontFace: defaultFont,
      //     bullet: true,
      //   });
      // }

      // // 2. Add non-bullet text and other elements (e.g., shapes, images)
      // structuredSlide.elements.forEach((el) => {
      //   const { element_type, text, properties = {}, src } = el;

      //   if (element_type !== "bullet_point") {
      //     const {
      //       x = 1,
      //       y = 1,
      //       w = 4,
      //       h = 0.6,
      //       fontSize = 16,
      //       fill,
      //       fontFamily,
      //       fontStyle,
      //       fontWeight,
      //       imageSrc,
      //     } = properties;

      //     const colorToUse =
      //       el.useThemeColor === false ? fill : defaultColor || fill;
      //     const fontToUse = fontFamily || defaultFont;
      //     const isBold =
      //       fontWeight === "bold" ||
      //       fontWeight === "600" ||
      //       defaultFontWeight === "bold";
      //     const isItalic =
      //       fontStyle === "italic" || defaultFontStyle === "italic";

      //     if (element_type === "text" && text) {
      //       slide.addText(text, {
      //         x,
      //         y,
      //         w,
      //         h,
      //         fontSize,
      //         color: colorToUse,
      //         fontFace: fontToUse,
      //         bold: isBold,
      //         italic: isItalic,
      //       });
      //     }

      //     if (element_type === "image" && (imageSrc || src)) {
      //       slide.addImage({
      //         path: imageSrc || src!,
      //         x,
      //         y,
      //         w,
      //         h,
      //       });
      //     }
      //   }
      // });
    });
  });

  await pptx.writeFile({ fileName: `${pptFileName}.pptx` });
}
