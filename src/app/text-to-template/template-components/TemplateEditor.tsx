"use client"

// import React from "react";
// import {
//   Stage,
//   Layer,
//   Text,
//   Rect,
//   Circle,
//   RegularPolygon,
//   Line,
//   Image,
// } from "react-konva";
// import useImage from "use-image";
// import { Box, Typography, Stack, Button } from "@mui/material";
// import PptxGenJS from "pptxgenjs";

// import { Presentation, ShapeElement, TextElement, ImageElement } from "./types";
// import { dummyData } from "./dummyData";
// import { useTemplateSlides } from "../context/TemplateSlidesContext";
// // Image helper
// const KonvaImageComponent: React.FC<{
//   draggable: boolean;
//   imageSrc: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   zIndex: number | string;
//   rounded?: number;
// }> = ({ draggable, imageSrc, x, y, width, height, zIndex, rounded }) => {
//   const [image] = useImage(imageSrc);
//   return (
//     <Image
//       image={image}
//       x={x}
//       y={y}
//       width={width}
//       height={height}
//       zIndex={zIndex}
//       draggable={draggable}
//       cornerRadius={rounded}
//     />
//   );
// };

// // Slide Renderer
// const SlideRenderer: React.FC<{ slide: Presentation["slides"][number] }> = ({
//   slide,
// }) => {
//   const stageWidth = 960;
//   const stageHeight = 540;

//   const sortedElements = [...slide.elements].sort(
//     (a, b) => (a.properties.zIndex || 0) - (b.properties.zIndex || 0)
//   );

//   return (
//     <>
//       {/* --- Background image if defined --- */}
//       {slide.image_url && (
//         <KonvaImageComponent
//           draggable={false}
//           imageSrc={slide.image_url}
//           x={0}
//           y={0}
//           width={stageWidth}
//           height={stageHeight}
//           zIndex={-1}
//         />
//       )}

//       {/* --- Elements --- */}
//       {sortedElements.map((el, i) => {
//         switch (el.element_type) {
//           case "text":
//           case "title":
//           case "bullet_point": {
//             const textEl = el as TextElement;
//             const p = textEl.properties;
//             return (
//               <Text
//                 key={i}
//                 draggable
//                 text={textEl.text}
//                 x={p.x}
//                 y={p.y}
//                 fontSize={p.fontSize}
//                 fontFamily={p.fontFamily}
//                 fill={p.fill}
//                 fontStyle={p.fontStyle}
//                 fontWeight={p.fontWeight}
//                 width={p.width}
//                 height={p.height}
//                 align={p.align as any}
//               />
//             );
//           }

//           case "shape": {
//             const shapeEl = el as ShapeElement;
//             const p = shapeEl.properties;
//             const fill = p.fill || "transparent";
//             const stroke = p.stroke || "#000";
//             const strokeWidth = p.strokeWidth ?? 1;

//             switch (shapeEl.konva_component) {
//               case "Konva.Rect":
//                 return (
//                   <Rect
//                     key={i}
//                     draggable
//                     x={p.x || 0}
//                     y={p.y || 0}
//                     width={p.width || 50}
//                     height={p.height || 50}
//                     fill={fill}
//                     stroke={stroke}
//                     opacity={p.opacity || 1}
//                     cornerRadius={p.cornerRadius || 0}
//                     strokeWidth={strokeWidth}
//                   />
//                 );
//               case "Konva.Circle":
//                 return (
//                   <Circle
//                     key={i}
//                     draggable
//                     x={p.x || 0}
//                     y={p.y || 0}
//                     radius={p.radius || 50}
//                     fill={fill}
//                     stroke={stroke}
//                     strokeWidth={strokeWidth}
//                   />
//                 );
//               case "Konva.RegularPolygon":
//                 return (
//                   <RegularPolygon
//                     key={i}
//                     draggable
//                     x={p.x || 0}
//                     y={p.y || 0}
//                     sides={p.sides || 3}
//                     radius={p.radius || 50}
//                     fill={fill}
//                     stroke={stroke}
//                     strokeWidth={strokeWidth}
//                   />
//                 );
//               case "Konva.Line":
//                 return (
//                   <Line
//                     key={i}
//                     draggable
//                     points={p.points || []}
//                     stroke={stroke}
//                     strokeWidth={strokeWidth}
//                     tension={0}
//                   />
//                 );
//               default:
//                 return null;
//             }
//           }

//           case "image": {
//             const imgEl = el as ImageElement;
//             const p = imgEl.properties;
//             return (
//               <KonvaImageComponent
//                 key={i}
//                 draggable={true}
//                 imageSrc={p.imageSrc}
//                 x={p.x}
//                 y={p.y}
//                 width={p.width}
//                 height={p.height}
//                 zIndex={p.zIndex}
//                 rounded={p.rounded}
//               />
//             );
//           }

//           default:
//             return null;
//         }
//       })}
//     </>
//   );
// };

// // Full Presentation Viewer
// const PresentationViewer: React.FC<{ presentation: Presentation }> = ({
//   presentation,
// }) => {
//   const STAGE_W = 960;
//   const STAGE_H = 540;
//   const PPT_W = 10; // inches
//   const PPT_H = 5.625; // inches

//   const pxToIn = (px: number, isW: boolean) =>
//     (px / (isW ? STAGE_W : STAGE_H)) * (isW ? PPT_W : PPT_H);

//   const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
//   const hex = (c?: string, fb = "000000") => (c || fb).replace("#", "");

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
//     console.log({ p });
//     const transparency = p.opacity;
//     const shapeName = (p.cornerRadius ?? 0) > 0 ? "roundRect" : "rect";
//     slide.addShape(shapeName, {
//       x: pxToIn(p.x ?? 0, true),
//       y: pxToIn(p.y ?? 0, false),
//       w: pxToIn(p.width ?? 100, true),
//       h: pxToIn(p.height ?? 100, false),
//       fill: {
//         type: "solid",
//         color: hex(p.fill, "FFFFFF"),
//         transparency: transparency,
//       },
//       line: {
//         color: p.stroke ? hex(p.stroke) : "000000",
//         width: p.strokeWidth ?? 1,
//         transparency: transparency,
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
//       fill: { color: hex(p.fill, "FFFFFF"), transparency },
//       line: {
//         color: hex(p.stroke, "000000"),
//         width: p.strokeWidth ?? 1,
//         transparency,
//       },
//       rotate: p.rotation ?? 0,
//     });
//   };

//   const addRegularPolygon = (slide: any, p: ShapeElement["properties"]) => {
//     // Map common n-gons to native PPT shapes; otherwise fallback to polygon-like rect
//     const n = p.sides ?? 3;
//     const shapeName =
//       n === 3
//         ? "triangle"
//         : n === 5
//         ? "pentagon"
//         : n === 6
//         ? "hexagon"
//         : "rect"; // fallback if unsupported (PptxGenJS has limited polygon variants)

//     const transparency =
//       p.opacity == null ? undefined : (1 - clamp01(p.opacity)) * 100;

//     slide.addShape(shapeName, {
//       x: pxToIn(p.x ?? 0, true),
//       y: pxToIn(p.y ?? 0, false),
//       w: pxToIn(p.width ?? (p.radius ?? 50) * 2, true),
//       h: pxToIn(p.height ?? (p.radius ?? 50) * 2, false),
//       fill: { color: hex(p.fill, "FFFFFF"), transparency },
//       line: { color: hex(p.stroke, "000000"), width: p.strokeWidth ?? 1 },
//       rotate: p.rotation ?? 0,
//     });
//   };

//   const addLine = (slide: any, p: ShapeElement["properties"]) => {
//     // Expect points [x1,y1,x2,y2]
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
//     const isData = p.imageSrc.startsWith("data:");
//     slide.addImage({
//       ...(isData ? { data: p.imageSrc } : { path: p.imageSrc }),
//       x: pxToIn(p.x, true),
//       y: pxToIn(p.y, false),
//       w: pxToIn(p.width, true),
//       h: pxToIn(p.height, false),
//       // PowerPoint doesn't support rounded-corner masks for images via pptxgen
//       // If you need rounded images, you'd need to pre-mask the image or use a shape mask workflow.
//     });
//   };

//   const exportToPptx = () => {
//     const pptx = new PptxGenJS();
//     pptx.defineLayout({ name: "LAYOUT_16x9", width: PPT_W, height: PPT_H });
//     pptx.layout = "LAYOUT_16x9";

//     presentation.slides.forEach((s) => {
//       const slide = pptx.addSlide();

//       // Background
//       if (s.image_url) {
//         const isData = s.image_url.startsWith("data:");
//         slide.addImage({
//           ...(isData ? { data: s.image_url } : { path: s.image_url }),
//           x: 0,
//           y: 0,
//           w: PPT_W,
//           h: PPT_H,
//         });
//       }

//       // Elements in z-order
//       const elements = [...s.elements].sort(
//         (a, b) => (a.properties.zIndex ?? 0) - (b.properties.zIndex ?? 0)
//       );

//       elements.forEach((el) => {
//         switch (el.element_type) {
//           case "text":
//           case "title":
//           case "bullet_point":
//             addText(slide, el as TextElement);
//             break;

//           case "image":
//             addImage(slide, (el as ImageElement).properties);
//             break;

//           case "shape": {
//             const kc = el.konva_component;
//             const p = (el as ShapeElement).properties;
//             if (kc === "Konva.Rect") addRect(slide, p);
//             else if (kc === "Konva.Circle") addCircle(slide, p);
//             else if (kc === "Konva.RegularPolygon") addRegularPolygon(slide, p);
//             else if (kc === "Konva.Line") addLine(slide, p);
//             // Extend here for Star/Arrow/Ellipse/Arc/Wedge if needed
//             break;
//           }
//         }
//       });
//     });

//     pptx.writeFile({ fileName: "presentation.pptx" });
//   };

//   return (
//     <Stack spacing={4} sx={{ p: 2 }}>
//       {presentation.slides.map((slide) => (
//         <Box key={slide.slide_id}>
//           <Box
//             sx={{
//               border: "3px solid #1976d2",
//               width: STAGE_W,
//               height: STAGE_H,
//               backgroundColor: "#f5f5f5",
//               mx: "auto",
//             }}
//           >
//             <Stage width={STAGE_W} height={STAGE_H}>
//               <Layer>
//                 <SlideRenderer slide={slide} />
//               </Layer>
//             </Stage>
//           </Box>
//         </Box>
//       ))}

//       <Box textAlign="center" mt={2}>
//         <Button variant="contained" color="primary" onClick={exportToPptx}>
//           Export to PPTX
//         </Button>
//       </Box>
//     </Stack>
//   );
// };

// export default function TemplateEditor() {
//   const { slideTemplates } = useTemplateSlides();

//   const presentation: Presentation = {
//     slides: slideTemplates || [],
//   };

//   // if (!presentation.slides.length) {
//   //   return (
//   //     <Box sx={{ textAlign: "center", mt: 4 }}>
//   //       <Typography variant="h6" color="text.secondary">
//   //         No template to show
//   //       </Typography>
//   //     </Box>
//   //   );
//   // }

//   return <PresentationViewer presentation={dummyData} />;
// }
// import { useEffect, useState } from "react"
// import { Box, Typography } from "@mui/material"
// import { useTemplateSlides } from "../../context/TemplateSlidesContext"
// import type { Presentation } from "../types/presentation"

// export default function TemplateEditor() {
//   const { slideTemplates } = useTemplateSlides()
//   const [scale, setScale] = useState(1)

//   const SLIDE_W = 990
//   const SLIDE_H = 540

//   const presentation: Presentation = {
//     id : 
//     slides: slideTemplates || [],
//   }

//   useEffect(() => {
//     const updateScale = () => {
//       const availableWidth = window.innerWidth
//       const availableHeight = window.innerHeight

//       const scaleX = availableWidth / SLIDE_W
//       const scaleY = availableHeight / SLIDE_H

//       // pick the smaller scale so it always fits
//       const newScale = Math.min(scaleX, scaleY, 1)
//       setScale(newScale)
//     }

//     updateScale()
//     window.addEventListener("resize", updateScale)
//     return () => window.removeEventListener("resize", updateScale)
//   }, [])

//   if (!presentation.slides.length) {
//     return (
//       <Box sx={{ textAlign: "center", mt: 4 }}>
//         <Typography variant="h6" color="text.secondary">
//           No template to show
//         </Typography>
//       </Box>
//     )
//   }

//   return (
//     <Box
//       sx={{
//         // width: "100vw",
//         // height: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         // overflow: "hidden",
//       }}
//     >
//       <Box
//         sx={{
//           transform: `scale(${scale})`,
//           transformOrigin: "top center",
//           width: SLIDE_W,
//           height: SLIDE_H,
//         }}
//       >
//         {/* <PresentationViewer presentation={dummyData} /> */}
//         <PresentationViewer presentation={presentation} />
//       </Box>
//     </Box>
//   )
// }
