// "use client";

// import PptxGenJS from "pptxgenjs";

// export type StructuredSlide = {
//   slide_id: string;
//   slide_title?: {
//     text: string;
//     properties?: {
//       fontSize?: number;
//       fontFamily?: string;
//       fill?: string;
//       fontStyle?: string;
//     };
//   };
//   elements: {
//     element_type: "title" | "bullet_point" | "image" | "text" | "shape";
//     text?: string;
//     src?: string;
//     properties?: {
//       x?: number;
//       y?: number;
//       w?: number;
//       h?: number;
//       fontSize?: number;
//       fontFamily?: string;
//       fill?: string;
//       fontStyle?: string;
//       fontWeight?: string;
//       imageSrc?: string;
//     };
//   }[];
//   image_url?: string;
// };

// export function exportSlidesAsPPT(structuredSlides: StructuredSlide[]) {
//   const pptx = new PptxGenJS();
//   const pptFileName = localStorage.getItem("fileName");

//   // console.log("Structured Slides:", structuredSlides);

//   structuredSlides.forEach((structuredSlide) => {
//     const slide = pptx.addSlide();

//     // Add slide title
//     const titleProps = structuredSlide.slide_title?.properties || {};
//     if (structuredSlide.slide_title?.text) {
//       slide.addText(structuredSlide.slide_title.text, {
//         x: 0.5,
//         y: 0.4,
//         w: 8,
//         h: 0.8,
//         fontSize: titleProps.fontSize || 24,
//         bold: true,
//         color: titleProps.fill || "000000",
//         fontFace: titleProps.fontFamily || "Arial",
//       });
//     }

//     structuredSlide.elements.forEach((el) => {
//       const { element_type, text, properties = {}, src } = el;
//       const {
//         x = 1,
//         y = 1,
//         w = 4,
//         h = 0.6,
//         fontSize = 16,
//         fill = "444444",
//         imageSrc,
//         fontFamily,
//         fontStyle,
//         fontWeight,
//       } = properties;

//       if (element_type === "bullet_point" && text) {
//         slide.addText(text, {
//           x,
//           y,
//           w,
//           h,
//           fontSize,
//           color: fill,
//           bullet: true,
//           fontFace: fontFamily,
//         });
//       }

//       if (element_type === "text" && text) {
//         slide.addText(text, {
//           x,
//           y,
//           w,
//           h,
//           fontSize,
//           color: fill,
//           fontFace: fontFamily,
//           bold: fontWeight === "bold" || fontWeight === "600",
//           italic: fontStyle === "italic",
//         });
//       }

//       if (element_type === "image" && imageSrc) {
//         slide.addImage({
//           path: imageSrc,
//           x,
//           y,
//           w,
//           h,
//         });
//       }
//     });
//   });

//   pptx.writeFile({ fileName: `${pptFileName}.pptx` || "Presentation.pptx" });
// }
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
  // console.log({
  //   defaultFont,
  //   defaultColor,
  //   defaultFontWeight,
  //   defaultFontStyle,
  // });
  // return;
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
          w,
          h,
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
    });
  });

  await pptx.writeFile({ fileName: `${pptFileName}.pptx` });
}
