import React from "react";
import { Text, Rect, Circle, RegularPolygon, Line } from "react-konva";
import KonvaImageComponent from "./KonvaImageComponent";
import { Presentation, ShapeElement, TextElement, ImageElement } from "./types";

const SlideRenderer: React.FC<{ slide: Presentation["slides"][number] }> = ({
  slide,
}) => {
  const stageWidth = 960;
  const stageHeight = 540;

  const sortedElements = [...slide.elements].sort(
    (a, b) => (a.properties.zIndex || 0) - (b.properties.zIndex || 0)
  );

  return (
    <>
      {slide.image_url && (
        <KonvaImageComponent
          //   draggable={false}
          imageSrc={slide.image_url}
          x={0}
          y={0}
          width={stageWidth}
          height={stageHeight}
          zIndex={-1}
        />
      )}

      {sortedElements.map((el, i) => {
        switch (el.element_type) {
          case "text":
          case "title":
          case "bullet_point": {
            const p = (el as TextElement).properties;
            return (
              <Text
                key={i}
                // draggable
                text={(el as TextElement).text}
                x={p.x}
                y={p.y}
                fontSize={p.fontSize}
                fontFamily={p.fontFamily}
                fill={p.fill}
                fontStyle={p.fontStyle}
                fontWeight={p.fontWeight}
                width={p.width}
                height={p.height}
                align={p.align as any}
              />
            );
          }
          case "shape": {
            const p = (el as ShapeElement).properties;
            const fill = p.fill || "transparent";
            const stroke = p.stroke || "#000";
            const strokeWidth = p.strokeWidth ?? 1;

            switch (el.konva_component) {
              case "Konva.Rect":
                return (
                  <Rect
                    key={i}
                    // draggable
                    x={p.x}
                    y={p.y}
                    width={p.width || 50}
                    height={p.height || 50}
                    fill={fill}
                    stroke={stroke}
                    opacity={p.opacity || 1}
                    cornerRadius={p.cornerRadius || 0}
                    strokeWidth={strokeWidth}
                  />
                );
              case "Konva.Circle":
                return (
                  <Circle
                    key={i}
                    // draggable
                    x={p.x}
                    y={p.y}
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
                    // draggable
                    x={p.x}
                    y={p.y}
                    sides={p.sides || 3}
                    radius={p.radius || 50}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                  />
                );
              case "Konva.Line":
                return (
                  <Line
                    key={i}
                    // draggable
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
            const p = (el as ImageElement).properties;
            return (
              <KonvaImageComponent
                key={i}
                // draggable
                imageSrc={p.imageSrc}
                x={p.x}
                y={p.y}
                width={p.width}
                height={p.height}
                zIndex={p.zIndex}
                rounded={p.rounded}
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

export default SlideRenderer;
