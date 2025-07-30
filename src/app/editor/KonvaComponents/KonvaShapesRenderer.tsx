"use client";

import React, { useEffect, useRef } from "react";
import {
  Circle,
  Rect,
  RegularPolygon,
  Star,
  Line,
  Arrow,
  Ellipse,
  Arc,
  Wedge,
  Transformer,
} from "react-konva";
import { useSlides } from "@/app/context/SlidesContext";
import { restrictShapeBounds } from "@/utils/slideUtils";

interface KonvaShapeRendererProps {
  elements: any;
  selectedShapeIndex: number | null;
  onSelectShape: (index: number | null) => void;
}

const KonvaShapeRenderer: React.FC<KonvaShapeRendererProps> = ({
  elements,
  selectedShapeIndex,
  onSelectShape,
}) => {
  const shapeRefs = useRef<(any | null)[]>([]);
  const trRef = useRef<any>(null);
  const { slides, setSlides, selectedSlideIndex: slideIdx } = useSlides();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedShapeIndex !== null
      ) {
        e.preventDefault();

        const updatedSlides = structuredClone(slides);
        updatedSlides[slideIdx].elements.splice(selectedShapeIndex, 1);
        setSlides(updatedSlides);
        onSelectShape(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedShapeIndex, slides, setSlides, slideIdx, onSelectShape]);

  useEffect(() => {
    if (
      selectedShapeIndex !== null &&
      shapeRefs.current[selectedShapeIndex] &&
      trRef.current
    ) {
      trRef.current.nodes([shapeRefs.current[selectedShapeIndex]]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedShapeIndex]);

  return (
    <>
      {elements.map((el: any, i: number) => {
        if (el.element_type !== "shape") return null;
        const commonProps = {
          ref: (node: any) => (shapeRefs.current[i] = node),
          ...el.properties,
          draggable: true,
          onClick: () => onSelectShape(i),
          onTap: () => onSelectShape(i),
          onMouseDown: () => onSelectShape(i),
          onTouchStart: () => onSelectShape(i),
          onTransformEnd: () => {
            const node = shapeRefs.current[i];
            if (!node) return;

            const shapeType = el.konva_component;
            const updated = { ...el.properties };

            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // Reset scale first to avoid compounding
            node.scaleX(1);
            node.scaleY(1);

            updated.x = node.x();
            updated.y = node.y();

            switch (shapeType) {
              case "Konva.Rect":
              case "Konva.Ellipse":
              case "Konva.Wedge":
              case "Konva.Arc":
              case "Konva.RegularPolygon":
                updated.width = Math.max(node.width() * scaleX, 50);
                updated.height = Math.max(node.height() * scaleY, 50);
                break;

              case "Konva.Circle":
                console.log("rendering circle");
                updated.radius = Math.max(node.radius() * Math.max(scaleX, scaleY), 25);
                break;

              case "Konva.Star":
                updated.outerRadius = Math.max(node.outerRadius() * Math.max(scaleX, scaleY), 25);
                if (updated.innerRadius) {
                  updated.innerRadius = updated.outerRadius / 2;
                }
                break;

              case "Konva.Line":
              case "Konva.Arrow":
                const scaledPoints = node
                  .points()
                  .map((point: number, idx: number) => {
                    return idx % 2 === 0 ? point * scaleX : point * scaleY;
                  });

                updated.points = scaledPoints;

                // Reset scale to avoid compounding
                node.scaleX(1);
                node.scaleY(1);
                break;
            }

            // Clamp position and apply min-size enforcement centrally
            const bounds = restrictShapeBounds(updated.x, updated.y, shapeType, updated);

            updated.x = bounds.x;
            updated.y = bounds.y;

            // Only apply width/height if applicable
            if ('width' in updated) updated.width = bounds.width;
            if ('height' in updated) updated.height = bounds.height;

            const updatedSlides = structuredClone(slides);
            updatedSlides[slideIdx].elements[i].properties = updated;

            // Also update node position
            node.x(bounds.x);
            node.y(bounds.y);

            setSlides(updatedSlides);
          }
          , onDragEnd: () => {
            const node = shapeRefs.current[i];
            if (!node) return;

            const shapeType = el.konva_component;
            const shapeProps = el.properties;

            const bounds = restrictShapeBounds(node.x(), node.y(), shapeType, shapeProps);

            // Apply constraints to node
            node.x(bounds.x);
            node.y(bounds.y);

            const updatedSlides = structuredClone(slides);
            updatedSlides[slideIdx].elements[i].properties.x = bounds.x;
            updatedSlides[slideIdx].elements[i].properties.y = bounds.y;

            setSlides(updatedSlides);
          },
        };
        switch (el.konva_component) {
          case "Konva.Circle":
            return (
              <Circle
                onClick={onSelectShape}
                onTap={onSelectShape}
                onMouseDown={onSelectShape}
                onTouchStart={onSelectShape}
                key={`shape-${i}`}
                {...commonProps}
              />
            );
          case "Konva.Rect":
            return (
              <Rect
                onClick={onSelectShape}
                onTap={onSelectShape}
                onMouseDown={onSelectShape}
                onTouchStart={onSelectShape}
                key={`shape-${i}`}
                {...commonProps}
              />
            );
          case "Konva.RegularPolygon":
            return (
              <RegularPolygon
                onClick={onSelectShape}
                onTap={onSelectShape}
                onMouseDown={onSelectShape}
                onTouchStart={onSelectShape}
                key={`shape-${i}`}
                {...commonProps}
              />
            );
          case "Konva.Star":
            return (
              <Star
                onClick={onSelectShape}
                onTap={onSelectShape}
                onMouseDown={onSelectShape}
                onTouchStart={onSelectShape}
                key={`shape-${i}`}
                {...commonProps}
              />
            );
          case "Konva.Line":
            return (
              <Line
                onClick={onSelectShape}
                onTap={onSelectShape}
                onMouseDown={onSelectShape}
                onTouchStart={onSelectShape}
                key={`shape-${i}`}
                {...commonProps}
                fill={el.properties.fill}
                stroke={el.properties.fill}
              />
            );
          case "Konva.Arrow":
            return (
              <Arrow
                onClick={onSelectShape}
                onTap={onSelectShape}
                onMouseDown={onSelectShape}
                onTouchStart={onSelectShape}
                key={`shape-${i}`}
                {...commonProps}
                stroke={el.properties.fill}
                fill={el.properties.fill}
              />
            );
          case "Konva.Ellipse":
            return (
              <Ellipse
                onClick={onSelectShape}
                onTap={onSelectShape}
                onMouseDown={onSelectShape}
                onTouchStart={onSelectShape}
                key={`shape-${i}`}
                {...commonProps}
              />
            );
          case "Konva.Arc":
            return (
              <Arc
                onClick={onSelectShape}
                onTap={onSelectShape}
                onMouseDown={onSelectShape}
                onTouchStart={onSelectShape}
                key={`shape-${i}`}
                {...commonProps}
              />
            );
          case "Konva.Wedge":
            return (
              <Wedge
                onClick={onSelectShape}
                onTap={onSelectShape}
                onMouseDown={onSelectShape}
                onTouchStart={onSelectShape}
                key={`shape-${i}`}
                {...commonProps}
              />
            );
          default:
            return null;
        }
      })}

      {selectedShapeIndex !== null && (
        <Transformer
          ref={trRef}
          enabledAnchors={[
            // "middle-left",
            // "middle-right",
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
        />
      )}
    </>
  );
};

export default KonvaShapeRenderer;
