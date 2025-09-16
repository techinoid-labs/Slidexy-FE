// import PptxGenJS from "pptxgenjs";
// import { Presentation, TextElement, ShapeElement, ImageElement } from "./types/presentation";

// export const exportPresentationToPptx = (presentation: Presentation) => {
//   const pptx = new PptxGenJS();

//   const templateFileName = localStorage.getItem("templateFileName");

//   // Layout constants
//   const STAGE_W = 960;
//   const STAGE_H = 540;
//   const PPT_W = 10; // inches
//   const PPT_H = 5.625; // inches

//   const pxToIn = (px: number, isW: boolean) =>
//     (px / (isW ? STAGE_W : STAGE_H)) * (iAsW ? PPT_W : PPT_H);

//   const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
//   const hex = (c?: string, fb = "000000") => (c || fb).replace("#", "");

//   // --- Helpers ---
//   const addText = (slide: any, t: TextElement) => {
//     const p = t.properties;
//     const adjustedFontSize = Math.max(1, (p.fontSize ?? 14) - 3);

//     slide.addText(t.text, {
//       x: pxToIn(p.x, true),
//       y: pxToIn(t.element_type === "title" ? p.y - 8 : p.y, false),
//       w: pxToIn(p.width, true),
//       h: pxToIn(p.height ?? 40, false),
//       fontFace: p.fontFamily,
//       fontSize: adjustedFontSize,
//       color: hex(p.fill, "000000"),
//       bold: p.fontWeight === "bold",
//       italic: p.fontStyle === "italic",
//       align: p.align || "left",
//       valign: "top",
//       margin: 0,
//       bullet: t.element_type === "bullet_point",
//     });
//   };

//   const addRect = (slide: any, p: ShapeElement["properties"]) => {
//     const transparency = p.opacity;
//     const shapeName = (p.cornerRadius ?? 0) > 0 ? "roundRect" : "rect";

//     slide.addShape(shapeName, {
//       x: pxToIn(p.x ?? 0, true),
//       y: pxToIn(p.y ?? 0, false),
//       w: pxToIn(p.width ?? 100, true),
//       h: pxToIn(p.height ?? 100, false),
//       fill: { type: "solid", color: hex(p.fill, "FFFFFF"), transparency: 30 },
//       line: {
//         color: p.stroke ? hex(p.stroke) : "000000",
//         width: p.strokeWidth ?? 1,
//         transparency: 30,
//       },
//       rotate: p.rotation ?? 0,
//     });
//   };

//   const addCircle = (slide: any, p: ShapeElement["properties"]) => {
//     const transparency = p.opacity == null ? 0 : (1 - clamp01(p.opacity)) * 100;
//     const diameterW = (p.radiusX ?? p.radius ?? 50) * 2;
//     const diameterH = (p.radiusY ?? p.radius ?? 50) * 2;

//     slide.addShape("ellipse", {
//       x: pxToIn(p.x ?? 0, true),
//       y: pxToIn(p.y ?? 0, false),
//       w: pxToIn(diameterW, true),
//       h: pxToIn(diameterH, false),
//       fill: { color: hex(p.fill, "FFFFFF"), transparency: 30 },
//       line: {
//         color: hex(p.stroke, "000000"),
//         width: p.strokeWidth ?? 1,
//         transparency: 30,
//       },
//       rotate: p.rotation ?? 0,
//     });
//   };

//   const addRegularPolygon = (slide: any, p: ShapeElement["properties"]) => {
//     const n = p.sides ?? 3;
//     const shapeName =
//       n === 3
//         ? "triangle"
//         : n === 5
//         ? "pentagon"
//         : n === 6
//         ? "hexagon"
//         : "rect"; // fallback

//     const transparency =
//       p.opacity == null ? undefined : (1 - clamp01(p.opacity)) * 100;

//     slide.addShape(shapeName, {
//       x: pxToIn(p.x ?? 0, true),
//       y: pxToIn(p.y ?? 0, false),
//       w: pxToIn(p.width ?? (p.radius ?? 50) * 2, true),
//       h: pxToIn(p.height ?? (p.radius ?? 50) * 2, false),
//       fill: { color: hex(p.fill, "FFFFFF"), transparency: 30 },
//       line: {
//         color: hex(p.stroke, "000000"),
//         width: p.strokeWidth ?? 1,
//         transparency: 30,
//       },
//       rotate: p.rotation ?? 0,
//     });
//   };

//   const addLine = (slide: any, p: ShapeElement["properties"]) => {
//     const pts = p.points || [];
//     if (pts.length < 4) return;
//     const [x1, y1, x2, y2] = pts;

//     slide.addShape("line", {
//       x: pxToIn(x1, true),
//       y: pxToIn(y1, false),
//       w: pxToIn(x2 - x1, true),
//       h: pxToIn(y2 - y1, false),
//       line: { color: hex(p.stroke, "000000"), width: p.strokeWidth ?? 1 },
//       rotate: p.rotation ?? 0,
//     });
//   };

//   const addImage = (slide: any, p: ImageElement["properties"]) => {
//     if (!p.imageSrc) {
//       console.warn("Skipping image: missing imageSrc", p);
//       return;
//     }

//     const isData = p.imageSrc.startsWith("data:");
//     slide.addImage({
//       ...(isData ? { data: p.imageSrc } : { path: p.imageSrc }),
//       x: pxToIn(p.x ?? 0, true),
//       y: pxToIn(p.y ?? 0, false),
//       w: pxToIn(p.width ?? 100, true),
//       h: pxToIn(p.height ?? 100, false),
//     });
//   };

//   pptx.defineLayout({ name: "LAYOUT_16x9", width: PPT_W, height: PPT_H });
//   pptx.layout = "LAYOUT_16x9";

//   presentation.slides.forEach((s) => {
//     const slide = pptx.addSlide();

//     // Background
//     if (s.image_url) {
//       const isData = s.image_url.startsWith("data:");
//       slide.addImage({
//         ...(isData ? { data: s.image_url } : { path: s.image_url }),
//         x: 0,
//         y: 0,
//         w: PPT_W,
//         h: PPT_H,
//       });
//     }

//     // Elements in z-order
//     const elements = [...s.elements].sort(
//       (a, b) => (a.properties.zIndex ?? 0) - (b.properties.zIndex ?? 0)
//     );

//     elements.forEach((el) => {
//       switch (el.element_type) {
//         case "text":
//         case "title":
//         case "bullet_point":
//           addText(slide, el as TextElement);
//           break;

//         case "image":
//           addImage(slide, (el as ImageElement).properties);
//           break;

//         case "shape": {
//           const kc = el.konva_component;
//           const p = (el as ShapeElement).properties;
//           if (kc === "Konva.Rect") addRect(slide, p);
//           else if (kc === "Konva.Circle") addCircle(slide, p);
//           else if (kc === "Konva.RegularPolygon") addRegularPolygon(slide, p);
//           else if (kc === "Konva.Line") addLine(slide, p);
//           break;
//         }
//       }
//     });
//   });

//   pptx.writeFile({ fileName: `${templateFileName}.pptx` });
// };
