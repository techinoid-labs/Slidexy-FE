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
import { v4 as uuidv4 } from "uuid";

interface KonvaShapeRendererProps {
  elements: any[];
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
  const {
    slides,
    setSlides,
    selectedSlideIndex: slideIdx,
    setSelectedShapeId,
  } = useSlides();

  // Handle delete key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedShapeIndex !== null
      ) {
        e.preventDefault();

        const updatedSlides = structuredClone(slides);
        const selectedShape = elements[selectedShapeIndex];
        if (!selectedShape || !selectedShape.shape_id) return;

        updatedSlides[slideIdx].elements = updatedSlides[slideIdx].elements.filter(
          (el: any) => el.shape_id !== selectedShape.shape_id
        );
        setSlides(updatedSlides);
        setSelectedShapeId(null);
        onSelectShape(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedShapeIndex,
    slides,
    setSlides,
    slideIdx,
    onSelectShape,
    setSelectedShapeId,
    elements,
  ]);

  // Attach transformer when shape is selected
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

        // Ensure shape_id exists
        const safeShapeId = el.shape_id || el.element_id || uuidv4();

        if (!el.shape_id) {
          console.warn(
            `Shape at index ${i} was missing shape_id. Using generated ID: ${safeShapeId}`
          );
        }

        const commonProps = {
          ref: (node: any) => (shapeRefs.current[i] = node),
          id: safeShapeId,
          style: { zIndex: el.properties.zIndex },
          ...el.properties,
          draggable: true,
          onClick: () => {
            onSelectShape(i);
            setSelectedShapeId(safeShapeId);
          },
          onTap: () => {
            onSelectShape(i);
            setSelectedShapeId(safeShapeId);
          },
          onMouseDown: () => {
            onSelectShape(i);
            setSelectedShapeId(safeShapeId);
          },
          onTouchStart: () => {
            onSelectShape(i);
            setSelectedShapeId(safeShapeId);
          },
          onTransformEnd: () => {
            const node = shapeRefs.current[i];
            if (!node) return;

            const shapeType = el.konva_component;
            const updated = { ...el.properties };

            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // Update position
            updated.x = node.x();
            updated.y = node.y();

            // Update size based on shape type
            switch (shapeType) {
              case "Konva.Rect":
              case "Konva.Ellipse":
              case "Konva.Wedge":
              case "Konva.Arc":
              case "Konva.RegularPolygon":
                updated.width = Math.max(50, node.width() * scaleX);
                updated.height = Math.max(50, node.height() * scaleY);
                break;
              case "Konva.Circle":
                updated.radius = Math.max(25, node.radius() * Math.max(scaleX, scaleY));
                updated.width = updated.radius * 2; // Ensure width/height for bounds checking
                updated.height = updated.radius * 2;
                break;
              case "Konva.Star":
                updated.outerRadius = Math.max(25, node.outerRadius() * Math.max(scaleX, scaleY));
                updated.innerRadius = updated.outerRadius / 2;
                updated.width = updated.outerRadius * 2; // For bounds checking
                updated.height = updated.outerRadius * 2;
                break;
              case "Konva.Line":
              case "Konva.Arrow":
                updated.points = node.points().map((point: number, idx: number) =>
                  idx % 2 === 0 ? point * scaleX : point * scaleY
                );
                // Calculate bounding box for lines/arrows
                const xs = updated.points.filter((_: any, idx: number) => idx % 2 === 0);
                const ys = updated.points.filter((_: any, idx: number) => idx % 2 !== 0);
                updated.width = Math.max(50, Math.max(...xs) - Math.min(...xs));
                updated.height = Math.max(50, Math.max(...ys) - Math.min(...ys));
                break;
            }

            // Reset scale after applying transformation
            node.scaleX(1);
            node.scaleY(1);

            // Apply bounds restrictions
            const bounds = restrictShapeBounds(
              updated.x,
              updated.y,
              shapeType,
              updated
            );

            // Update node position and size
            node.x(bounds.x);
            node.y(bounds.y);
            if ("width" in updated) updated.width = bounds.width;
            if ("height" in updated) updated.height = bounds.height;
            if (shapeType === "Konva.Circle" || shapeType === "Konva.Star") {
              node.radius?.(updated.radius);
              node.outerRadius?.(updated.outerRadius);
              node.innerRadius?.(updated.innerRadius);
            }
            if (shapeType === "Konva.Line" || shapeType === "Konva.Arrow") {
              node.points(updated.points);
            }

            // Update slides state
            const updatedSlides = structuredClone(slides);
            const shapeElement = updatedSlides[slideIdx].elements.find(
              (e: any) => e.shape_id === safeShapeId
            );

            if (shapeElement) {
              shapeElement.properties = updated;
              setSlides(updatedSlides);
              setSelectedShapeId(safeShapeId);
            }

            node.getLayer()?.batchDraw();
          },
          onDragEnd: () => {
            const node = shapeRefs.current[i];
            if (!node) return;

            const shapeType = el.konva_component;
            const shapeProps = el.properties;

            const bounds = restrictShapeBounds(
              node.x(),
              node.y(),
              shapeType,
              shapeProps
            );

            node.x(bounds.x);
            node.y(bounds.y);

            const updatedSlides = structuredClone(slides);
            const shapeElement = updatedSlides[slideIdx].elements.find(
              (e: any) => e.shape_id === safeShapeId
            );

            if (shapeElement) {
              shapeElement.properties.x = bounds.x;
              shapeElement.properties.y = bounds.y;
              setSlides(updatedSlides);
              setSelectedShapeId(safeShapeId);
            }

            node.getLayer()?.batchDraw();
          },
        };

        switch (el.konva_component) {
          case "Konva.Circle":
            return <Circle key={`shape-${safeShapeId}`} {...commonProps} />;
          case "Konva.Rect":
            return <Rect key={`shape-${safeShapeId}`} {...commonProps} />;
          case "Konva.RegularPolygon":
            return <RegularPolygon key={`shape-${safeShapeId}`} {...commonProps} />;
          case "Konva.Star":
            return <Star key={`shape-${safeShapeId}`} {...commonProps} />;
          case "Konva.Line":
            return (
              <Line
                key={`shape-${safeShapeId}`}
                {...commonProps}
                fill={el.properties.fill}
                stroke={el.properties.fill}
              />
            );
          case "Konva.Arrow":
            return (
              <Arrow
                key={`shape-${safeShapeId}`}
                {...commonProps}
                stroke={el.properties.fill}
                fill={el.properties.fill}
              />
            );
          case "Konva.Ellipse":
            return <Ellipse key={`shape-${safeShapeId}`} {...commonProps} />;
          case "Konva.Arc":
            return <Arc key={`shape-${safeShapeId}`} {...commonProps} />;
          case "Konva.Wedge":
            return <Wedge key={`shape-${safeShapeId}`} {...commonProps} />;
          default:
            return null;
        }
      })}

      {selectedShapeIndex !== null && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            const MIN_SIZE = 50;
            const MAX_SIZE = 300;

            // Ensure minimum and maximum size constraints
            const width = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newBox.width));
            const height = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newBox.height));

            // Apply position constraints
            const bounds = restrictShapeBounds(
              newBox.x,
              newBox.y,
              elements[selectedShapeIndex]?.konva_component,
              { width, height }
            );

            return {
              ...newBox,
              x: bounds.x,
              y: bounds.y,
              width,
              height,
            };
          }}
        />
      )}
    </>
  );
};

export default KonvaShapeRenderer;