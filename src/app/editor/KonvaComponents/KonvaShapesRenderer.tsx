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

  // --- TRANSFORMER ATTACHMENT ---
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

            updated.x = node.x();
            updated.y = node.y();

            switch (shapeType) {
              case "Konva.Rect":
              case "Konva.Ellipse":
              case "Konva.Wedge":
              case "Konva.Arc":
              case "Konva.RegularPolygon":
                const oldWidth = node.width();
                const newWidth = oldWidth * scaleX;
                const dx = (newWidth - oldWidth) / 2;

                updated.x = node.x();
                updated.y = node.y();

                updated.width = newWidth;
                updated.height = node.height() * scaleY;

                break;

              case "Konva.Circle":
                updated.radius = node.radius() * Math.max(scaleX, scaleY);
                break;

              case "Konva.Star":
                updated.outerRadius =
                  node.outerRadius() * Math.max(scaleX, scaleY);
                if (updated.innerRadius)
                  updated.innerRadius = updated.outerRadius / 2;
                break;

              case "Konva.Line":
              case "Konva.Arrow":
                // Scale each point
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

            // Reset scale
            node.scaleX(1);
            node.scaleY(1);

            const updatedSlides = structuredClone(slides);
            updatedSlides[slideIdx].elements[i].properties = updated;
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
