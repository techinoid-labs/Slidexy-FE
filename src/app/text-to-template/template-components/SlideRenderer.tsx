"use client";

import { Text, Circle, RegularPolygon, Line } from "react-konva";
import { Html } from "react-konva-utils";
import KonvaImageComponent from "./KonvaImageComponent";
import type { Presentation } from "../types/presentation";
import React, { useEffect, useRef } from "react";

const SlideRenderer: React.FC<{ slide: Presentation["slides"][number]; slideIndex?: number }> = ({ slide, slideIndex = 0 }) => {
  const stageWidth = 960;
  const stageHeight = 540;
  const stageRef = useRef<any>(null);

  console.log("Rendering slide:", slide.slide_id || slide.title);
  console.log("Slide elements count:", slide.elements?.length || 0);

  // Store stage reference globally for PDF export access
  useEffect(() => {
    if (stageRef.current) {
      const stageId = slide.slide_id || `slide-${slideIndex}`;
      
      // Store in window for PDF export access
      if (!window.konvaStages) {
        window.konvaStages = {};
      }
      window.konvaStages[slideIndex] = stageRef.current;
      window[`konva_stage_${stageId}`] = stageRef.current;
      
      // Add data attribute to canvas for identification
      const canvas = stageRef.current.getCanvas?._canvas;
      if (canvas) {
        canvas.setAttribute('data-slide-id', stageId);
        canvas.setAttribute('data-slide-index', slideIndex.toString());
      }
      
      console.log(`Stored stage reference for slide ${slideIndex}:`, stageId);
    }
  }, [slide.slide_id, slideIndex]);

  // Keep elements ordered by zIndex
  const sortedElements = [...(slide.elements || [])].sort(
    (a, b) => (a.properties?.zIndex ?? 0) - (b.properties?.zIndex ?? 0)
  );

  return (
    <>
      {sortedElements.map((el) => {
        const elementKey = `${el.element_type}-${el.id || Math.random()}`;
        console.log(`Rendering element:`, el.element_type, "with key:", elementKey);

        switch (el.element_type) {
          case "html":
            return (
              <Html
                key={elementKey}
                groupProps={{
                  x: el.properties.x || 0,
                  y: el.properties.y || 0,
                }}
                divProps={{
                  style: {
                    width: `${el.properties.width || stageWidth}px`,
                    height: `${el.properties.height || stageHeight}px`,
                    visibility: 'visible',
                    opacity: 1,
                  },
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: el.properties.htmlContent || '' }}
                  style={{
                    width: "100%",
                    height: "100%",
                    visibility: 'visible',
                    opacity: 1,
                  }}
                />
              </Html>
            );

          case "text":
          case "title":
          case "bullet_point": {
            const p = el.properties;
            return (
              <Text
                key={elementKey}
                text={el.text || ''}
                x={p.x || 0}
                y={p.y || 0}
                fontSize={p.fontSize || 16}
                fontFamily={p.fontFamily || "Arial"}
                fill={p.fill || "#000000"}
                fontStyle={p.fontStyle || 'normal'}
                fontWeight={p.fontWeight || 'normal'}
                width={p.width || 400}
                height={p.height || 30}
                align={p.align || "left"}
              />
            );
          }

          case "shape": {
            const p = el.properties;
            const fill = p.fill || "transparent";
            const stroke = p.stroke || "#000";
            const strokeWidth = p.strokeWidth ?? 1;

            switch (el.konva_component) {
              case "Konva.Circle":
                return (
                  <Circle
                    key={elementKey}
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
                    key={elementKey}
                    x={p.x || 0}
                    y={p.y || 0}
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
                    key={elementKey}
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
            const p = el.properties;
            return (
              <KonvaImageComponent
                key={elementKey}
                imageSrc={p.imageSrc || ''}
                x={p.x || 0}
                y={p.y || 0}
                width={p.width || 300}
                height={p.height || 200}
                zIndex={p.zIndex || 1}
                rounded={p.rounded || 0}
              />
            );
          }

          default:
            console.log(`Unknown element type: ${el.element_type}`);
            return null;
        }
      })}
    </>
  );
};

export default SlideRenderer;

// Add type declaration for global window properties
declare global {
  interface Window {
    konvaStages: Record<number, any>;
    [key: string]: any;
  }
}