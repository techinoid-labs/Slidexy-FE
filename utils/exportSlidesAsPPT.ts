"use client";

import PptxGenJS from "pptxgenjs";

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
    element_type: "title" | "bullet_point" | "image";
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

  console.log("Structured Slides:", structuredSlides);

  structuredSlides.forEach((structuredSlide) => {
    const slide = pptx.addSlide();

    // Add slide title if exists
    if (structuredSlide.slide_title?.text) {
      const titleProps = structuredSlide.slide_title.properties || {};
      slide.addText(structuredSlide.slide_title.text, {
        x: 0.5,
        y: 0.3,
        w: 8,
        h: 1,
        fontSize: titleProps.fontSize || 24,
        bold: true,
        color: titleProps.fill || "000000",
      });
    }

    // Loop through elements
    structuredSlide.elements?.forEach((el, idx) => {
      const { element_type, text, src, properties = {} } = el;

      const {
        x = 0.5,
        y = 1 + idx * 0.7, // stack bullets vertically
        w = 8,
        h = 0.7,
        fontSize = 18,
        fill = "444444",
      } = properties;

      if (element_type === "bullet_point" && typeof text === "string") {
        slide.addText(text, {
          x,
          y,
          w,
          h,
          fontSize,
          color: fill,
          bullet: true,
        });
      }

      if (element_type === "image") {
        const imagePath = properties.imageSrc || src;
        if (imagePath) {
          slide.addImage({
            path: imagePath,
            x: properties.x || 0.5,
            y: properties.y || 1,
            w: properties.w || 5,
            h: properties.h || 3,
          });
        }
      }
    });
  });

  pptx.writeFile({ fileName: "Presentation.pptx" });
}
