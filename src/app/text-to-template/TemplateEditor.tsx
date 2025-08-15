import React from "react";
import {
  Stage,
  Layer,
  Text,
  Rect,
  Circle,
  RegularPolygon,
  Line,
  Image,
} from "react-konva";
import useImage from "use-image";
import { Box, Typography, Stack, Button } from "@mui/material";
import PptxGenJS from "pptxgenjs";

import { Presentation, ShapeElement, TextElement, ImageElement } from "./types";
import { dummyData } from "./dummyData";
import { useTemplateSlides } from "../context/TemplateSlidesContext";
// Image helper
const KonvaImageComponent: React.FC<{
  imageSrc: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number | string;
}> = ({ imageSrc, x, y, width, height, zIndex }) => {
  const [image] = useImage(imageSrc);
  return (
    <Image
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
      zIndex={zIndex}
      draggable
    />
  );
};

// Slide Renderer
const SlideRenderer: React.FC<{ slide: Presentation["slides"][number] }> = ({
  slide,
}) => {
  const sortedElements = [...slide.elements].sort(
    (a, b) => a.properties.zIndex - b.properties.zIndex
  );

  return (
    <>
      <Text
        draggable
        text={slide.slide_title.text}
        x={slide.slide_title.properties.x}
        y={slide.slide_title.properties.y}
        fontSize={slide.slide_title.properties.fontSize}
        fontFamily={slide.slide_title.properties.fontFamily}
        fill={slide.slide_title.properties.fill}
        fontStyle={slide.slide_title.properties.fontWeight}
        width={slide.slide_title.properties.width}
        align={slide.slide_title.properties.align as any}
        zIndex={slide.slide_title.properties.zIndex || 120}
        fontWeight={slide.slide_title.properties.fontWeight}
        height={slide.slide_title.properties.height}
      />

      {sortedElements.map((el, i) => {
        switch (el.element_type) {
          case "text":
          case "bullet_point": {
            const textEl = el as TextElement;
            return (
              <Text
                key={i}
                draggable
                text={textEl.text}
                x={textEl.properties.x}
                y={textEl.properties.y}
                fontSize={textEl.properties.fontSize}
                fontFamily={textEl.properties.fontFamily}
                fill={textEl.properties.fill}
                fontStyle={textEl.properties.fontStyle}
                fontWeight={textEl.properties.fontWeight}
                width={textEl.properties.width}
                height={textEl.properties.height}
                align={textEl.properties.align as any}
              />
            );
          }

          case "shape": {
            const shapeEl = el as ShapeElement;
            const p = shapeEl.properties;
            const fill = p.fill || "transparent";
            const stroke = p.stroke || "#000";
            const strokeWidth = p.strokeWidth ?? 1;
            const opacity = p.opacity;
            const cornerRadius = p.cornerRadius;

            switch (shapeEl.konva_component) {
              case "Konva.Rect":
                return (
                  <Rect
                    key={i}
                    draggable
                    x={p.x || 0}
                    y={p.y || 0}
                    width={p.width || 50}
                    height={p.height || 50}
                    fill={fill}
                    stroke={stroke}
                    opacity={opacity || 0}
                    cornerRadius={cornerRadius || 0}
                    strokeWidth={strokeWidth}
                  />
                );
              case "Konva.Circle":
                return (
                  <Circle
                    key={i}
                    draggable
                    x={p.x || 0}
                    y={p.y || 0}
                    radius={p.radius || 50}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                  />
                );
              case "Konva.RegularPolygon":
                return (
                  <RegularPolygon
                    key={i}
                    draggable
                    x={p.x || 0}
                    y={p.y || 0}
                    sides={p.sides || 3}
                    radius={50}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                  />
                );
              case "Konva.Line":
                return (
                  <Line
                    key={i}
                    draggable
                    points={p.points || []}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    tension={0}
                  />
                );
              default:
                return null;
            }
          }

          case "image": {
            const imgEl = el as ImageElement;

            const imgW = imgEl.properties.width;
            const imgH = imgEl.properties.height;
            const imgBGCheck = imgW >= 960 || imgH >= 540;

            return (
              <KonvaImageComponent
                key={i}
                imageSrc={imgEl.properties.imageSrc}
                x={imgEl.properties.x}
                y={imgEl.properties.y}
                zIndex={imgBGCheck ? 0 : imgEl.properties.zIndex || 1}
                width={imgEl.properties.width}
                height={imgEl.properties.height}
              />
            );
          }

          default:
            return null;
        }
      })}
    </>
  );
};

// Full Presentation Viewer
const PresentationViewer: React.FC<{ presentation: Presentation }> = ({
  presentation,
}) => {
  const stageWidth = 960;
  const stageHeight = 540;

  const exportToPptx = () => {
    const pptx = new PptxGenJS();

    // Standard 16:9 slide dimensions in inches
    const pptSlideWidth = 10;
    const pptSlideHeight = 5.625;

    // Conversion function: Stage px → PPTX inches
    const pxToInch = (px: number, isWidth: boolean) =>
      (px / (isWidth ? stageWidth : stageHeight)) *
      (isWidth ? pptSlideWidth : pptSlideHeight);

    presentation.slides.forEach((slide) => {
      const pptSlide = pptx.addSlide();

      // --- Add title ---
      const tp = slide.slide_title.properties;
      pptSlide.addText(slide.slide_title.text, {
        x: pxToInch(tp.x, true),
        y: pxToInch(tp.y, false),
        w: pxToInch(tp.width, true),
        h: pxToInch(tp.height, false),
        fontSize: tp.fontSize,
        color: tp.fill.replace("#", ""),
        bold: tp.fontWeight === "bold",
        align: tp.align,
      });

      // --- Sort elements by zIndex ---
      const sortedElements = [...slide.elements].sort(
        (a, b) => (a.properties.zIndex || 0) - (b.properties.zIndex || 0)
      );

      sortedElements.forEach((el) => {
        switch (el.element_type) {
          case "text":
          case "bullet_point": {
            const t = el as TextElement;
            const p = t.properties;
            pptSlide.addText(t.text, {
              x: pxToInch(p.x, true),
              y: pxToInch(p.y, false),
              w: pxToInch(p.width, true),
              h: p.height ? pxToInch(p.height, false) : undefined,
              fontSize: p.fontSize,
              color: p.fill.replace("#", ""),
              bold: p.fontWeight === "bold",
              italic: p.fontStyle?.includes("italic"),
              align: p.align,
            });
            break;
          }

          case "image": {
            const img = el as ImageElement;
            const p = img.properties;
            pptSlide.addImage({
              data: p.imageSrc,
              x: pxToInch(p.x, true),
              y: pxToInch(p.y, false),
              w: pxToInch(p.width, true),
              h: pxToInch(p.height, false),
            });
            break;
          }

          case "shape": {
            const shape = el as ShapeElement;
            const p = shape.properties;
            const opts: any = {
              x: pxToInch(p.x || 0, true),
              y: pxToInch(p.y || 0, false),
              w: pxToInch(p.width || 100, true),
              h: pxToInch(p.height || 100, false),
              fill: { color: (p.fill || "#FFFFFF").replace("#", "") },
              line: {
                color: (p.stroke || "#000000").replace("#", ""),
                width: p.strokeWidth || 1,
              },
              rectRadius: p.cornerRadius || 0,
              transparency: p.opacity ?? 1,
            };

            switch (shape.konva_component) {
              case "Konva.Rect":
                pptSlide.addShape(pptx.ShapeType.rect, opts);
                break;
              case "Konva.Circle":
                pptSlide.addShape(pptx.ShapeType.ellipse, opts);
                break;
              case "Konva.RegularPolygon":
                pptSlide.addShape(pptx.ShapeType.triangle, opts);
                break;
              case "Konva.Line":
                pptSlide.addShape(pptx.ShapeType.line, {
                  ...opts,
                  w: pxToInch(p.width || 100, true),
                  h: pxToInch(p.height || 1, false),
                });
                break;
              default:
                break;
            }
            break;
          }
        }
      });
    });

    pptx.writeFile({ fileName: "presentation.pptx" });
  };

  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      {presentation.slides.map((slide, index) => (
        <Box key={slide.slide_id}>
          <Box
            sx={{
              border: "3px solid #1976d2",
              width: stageWidth,
              height: stageHeight,
              backgroundColor: "#f5f5f5",
              mx: "auto",
            }}
          >
            <Stage width={stageWidth} height={stageHeight}>
              <Layer>
                <SlideRenderer slide={slide} />
              </Layer>
            </Stage>
          </Box>
        </Box>
      ))}

      <Box textAlign="center" mt={2}>
        <Button variant="contained" color="primary" onClick={exportToPptx}>
          Export to PPTX
        </Button>
      </Box>
    </Stack>
  );
};

export default function App() {
  const { slideTemplates } = useTemplateSlides();

  const presentation: Presentation = {
    slides: slideTemplates || [],
  };

  if (!presentation.slides.length) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No template to show
        </Typography>
      </Box>
    );
  }

  return <PresentationViewer presentation={presentation} />;
}
