"use client";

import PptxGenJS from "pptxgenjs";
const pptFileName = localStorage.getItem("fileName");

export type StructuredSlide = {
  slide_id: string;
  slide_title?: {
    text: string;
    properties?: {
      fontSize?: number;
      fontFamily?: string;
      fill?: string;
      fontStyle?: string;
    };
  };
  elements: {
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

export function exportSlidesAsPPT(structuredSlides: StructuredSlide[]) {
  const pptx = new PptxGenJS();

  // console.log("Structured Slides:", structuredSlides);

  // structuredSlides.forEach((structuredSlide) => {
  //   const slide = pptx.addSlide();

  //   // Add slide title (left column)
  //   const titleProps = structuredSlide.slide_title?.properties || {};
  //   if (structuredSlide.slide_title?.text) {
  //     slide.addText(structuredSlide.slide_title.text, {
  //       x: 0.5,
  //       y: 0.4,
  //       w: 4.5,
  //       h: 0.8,
  //       fontSize: titleProps.fontSize || 24,
  //       bold: true,
  //       color: titleProps.fill || "000000",
  //     });
  //   }

  //   // Track vertical position of bullet points
  //   let bulletYOffset = 1.3;

  //   structuredSlide.elements?.forEach((el) => {
  //     const { element_type, text, src, properties = {} } = el;

  //     const { fontSize = 14, fill = "444444", imageSrc } = properties;

  //     if (element_type === "bullet_point" && typeof text === "string") {
  //       slide.addText(text, {
  //         x: 0.5, // left column
  //         y: bulletYOffset,
  //         w: 4.5,
  //         h: 0.6,
  //         fontSize,
  //         color: fill,
  //         bullet: true,
  //       });
  //       bulletYOffset += 0.6; // space between bullets
  //     }

  //     if (element_type === "image") {
  //       const imagePath = imageSrc || src;
  //       if (imagePath) {
  //         slide.addImage({
  //           path: imagePath,
  //           x: 5.2, // right column
  //           y: properties.y ?? 1,
  //           w: properties.w ?? 4.3,
  //           h: properties.h ?? 3.5,
  //         });
  //       }
  //     }
  //   });
  // });

  structuredSlides.forEach((structuredSlide) => {
    const slide = pptx.addSlide();

    // Add slide title
    const titleProps = structuredSlide.slide_title?.properties || {};
    if (structuredSlide.slide_title?.text) {
      slide.addText(structuredSlide.slide_title.text, {
        x: 0.5,
        y: 0.4,
        w: 8,
        h: 0.8,
        fontSize: titleProps.fontSize || 24,
        bold: true,
        color: titleProps.fill || "000000",
        fontFace: titleProps.fontFamily || "Arial",
      });
    }

    structuredSlide.elements.forEach((el) => {
      const { element_type, text, properties = {}, src } = el;
      const {
        x = 1,
        y = 1,
        w = 4,
        h = 0.6,
        fontSize = 16,
        fill = "444444",
        imageSrc,
        fontFamily,
        fontStyle,
        fontWeight,
      } = properties;

      if (element_type === "bullet_point" && text) {
        slide.addText(text, {
          x,
          y,
          w,
          h,
          fontSize,
          color: fill,
          bullet: true,
          fontFace: fontFamily,
        });
      }

      if (element_type === "text" && text) {
        slide.addText(text, {
          x,
          y,
          w,
          h,
          fontSize,
          color: fill,
          fontFace: fontFamily,
          bold: fontWeight === "bold" || fontWeight === "600",
          italic: fontStyle === "italic",
        });
      }

      if (element_type === "image" && imageSrc) {
        slide.addImage({
          path: imageSrc,
          x,
          y,
          w,
          h,
        });
      }
    });
  });

  pptx.writeFile({ fileName: `${pptFileName}.pptx` || "Presentation.pptx" });
}
