"use client";

import type React from "react";
import { HTML, Text, Rect, Circle, RegularPolygon, Line } from "react-konva";
import KonvaImageComponent from "./KonvaImageComponent";
import type { Presentation, SlideElement } from "../types/presentation";

const SlideRenderer: React.FC<{ slide: Presentation["slides"][number] }> = ({ slide }) => {
  const stageWidth = 960;
  const stageHeight = 540;

  console.log("Rendering slide:", slide.slide_id || slide.title);
  console.log("Slide elements count:", slide.elements?.length || 0);

  const sortedElements = [...(slide.elements || [])].sort(
    (a, b) => (a.properties?.zIndex ?? 0) - (b.properties?.zIndex ?? 0)
  );

  // Extract background color from htmlTemplate (simple regex for Tailwind classes or inline styles)
  const getBackgroundColor = (html: string) => {
    const match = html.match(/bg-([a-z0-9]+)|background:\s*([^;]+)/i);
    return match ? match[0].includes('#') ? match[2] : `#${match[1]}` : '#ffffff'; // Fallback white
  };
  const bgColor = slide.htmlTemplate ? getBackgroundColor(slide.htmlTemplate) : '#f5f5f5';

  return (
    <>
      {/* Background Rect for consistent, scalable background (under HTML) */}
      <Rect
        x={0}
        y={0}
        width={stageWidth}
        height={stageHeight}
        fill={bgColor} // Use extracted color; for gradients, extend with fillLinearGradientColorStops
        zIndex={-1}
      />

      {slide.image_url && !slide.htmlTemplate && (
        <KonvaImageComponent
          imageSrc={slide.image_url}
          x={0}
          y={0}
          width={stageWidth}
          height={stageHeight}
          zIndex={-1}
        />
      )}

      {sortedElements.map((el) => {
        const elementKey = `${el.element_type}-${el.id || Math.random()}`;
        console.log(`Rendering element:`, el.element_type, "with key:", elementKey);

        switch (el.element_type) {
          case "html":
            return (
              <HTML
                key={elementKey}
                div={el.properties.htmlContent}
                x={el.properties.x || 0}
                y={el.properties.y || 0}
                width={el.properties.width || 960}
                height={el.properties.height || 540}
                // Ensure HTML fills the area and inherits no transparency issues
                style={{ width: '100%', height: '100%', background: 'transparent' }} // Transparent to let Rect show through
              />
            );
          // ... (rest of cases unchanged)
          case "text":
          case "title":
          case "bullet_point": {
            const p = el.properties;
            return (
              <Text
                key={elementKey}
                text={el.text}
                x={p.x || 0}
                y={p.y || 0}
                fontSize={p.fontSize || 16}
                fontFamily={p.fontFamily || "Arial"}
                fill={p.fill || "#000000"}
                fontStyle={p.fontStyle}
                fontWeight={p.fontWeight}
                width={p.width || 400}
                height={p.height || 30}
                align={p.align || "left"}
              />
            );
          }
          case "shape": {
            // ... (unchanged)
          }
          case "image": {
            // ... (unchanged)
          }
          default:
            console.log(`Unknown element type`);
            return null;
        }
      })}
    </>
  );
};

export default SlideRenderer;