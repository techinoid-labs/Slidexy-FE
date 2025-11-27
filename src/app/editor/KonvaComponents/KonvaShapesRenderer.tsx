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
  selectedShapeId: string | null;
  selectedShapeIndex: number | null;
  onSelectShape: (index: number | null, shapeId: string | null, e?: any) => void;
}

const KonvaShapeRenderer: React.FC<KonvaShapeRendererProps> = ({
  elements,
  selectedShapeId,
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
        selectedShapeId
      ) {
        e.preventDefault();

        const updatedSlides = structuredClone(slides);
        updatedSlides[slideIdx].elements = updatedSlides[slideIdx].elements.filter(
          (el: any) => el.shape_id !== selectedShapeId
        );
        setSlides(updatedSlides);
        setSelectedShapeId(null);
        onSelectShape(null, null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedShapeId,
    slides,
    setSlides,
    slideIdx,
    onSelectShape,
    setSelectedShapeId,
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
        const originalIndex = elements.findIndex(e => e.shape_id === el.shape_id);
        if (el.element_type !== "shape") return null;

        // Ensure shape_id exists - use existing or generate new one
        const safeShapeId = el.shape_id || uuidv4();

        // Log warning if shape_id was missing
        if (!el.shape_id) {
          console.warn(
            `Shape at index ${i} was missing shape_id. Generated ID: ${safeShapeId}`
          );
          // Update the element with the new shape_id immediately
          const updatedSlides = structuredClone(slides);
          updatedSlides[slideIdx].elements[i].shape_id = safeShapeId;
          setSlides(updatedSlides);
        }

        const isSelected = selectedShapeId === safeShapeId;
        const { zIndex, ...safeProps } = el.properties || {};
        const commonProps = {
          ref: (node: any) => (shapeRefs.current[i] = node),          
          id: safeShapeId,
          draggable: true,
          onClick: (e: any) => {
            onSelectShape(i, safeShapeId, e);
            setSelectedShapeId(safeShapeId);
          },
          onTap: (e: any) => {
            onSelectShape(i, safeShapeId, e);
            setSelectedShapeId(safeShapeId);
          },
          onMouseDown: (e: any) => {
            onSelectShape(i, safeShapeId, e);
            setSelectedShapeId(safeShapeId);
          },
          onTouchStart: (e: any) => {
            onSelectShape(i, safeShapeId, e);
            setSelectedShapeId(safeShapeId);
          },

          onTransformEnd: () => {
            const node = shapeRefs.current[i];
            if (!node) return;

            const shapeType = el.konva_component;
            const updated = { ...el.properties };

            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // Position
            updated.x = node.x();
            updated.y = node.y();

            // --- Handle each shape separately ---
            if (shapeType === "Konva.Rect") {
              updated.width = Math.max(50, node.width() * scaleX);
              updated.height = Math.max(50, node.height() * scaleY);
            }

            if (shapeType === "Konva.Ellipse") {
              updated.radiusX = Math.max(25, node.radiusX() * scaleX);
              updated.radiusY = Math.max(25, node.radiusY() * scaleY);
              updated.width = updated.radiusX * 2;
              updated.height = updated.radiusY * 2;
            }

            if (shapeType === "Konva.RegularPolygon") {
              updated.radius = Math.max(25, node.radius() * Math.max(scaleX, scaleY));
              updated.width = updated.radius * 2;
              updated.height = updated.radius * 2;
            }

            if (shapeType === "Konva.Circle") {
              updated.radius = Math.max(25, node.radius() * Math.max(scaleX, scaleY));
              updated.width = updated.radius * 2;
              updated.height = updated.radius * 2;
            }

            if (shapeType === "Konva.Star") {
              updated.outerRadius = Math.max(
                25,
                node.outerRadius() * Math.max(scaleX, scaleY)
              );
              updated.innerRadius = updated.outerRadius / 2;
              updated.width = updated.outerRadius * 2;
              updated.height = updated.outerRadius * 2;
            }

            if (shapeType === "Konva.Line" || shapeType === "Konva.Arrow") {
              updated.points = node.points().map((point: number, idx: number) =>
                idx % 2 === 0 ? point * scaleX : point * scaleY
              );
              const xs = updated.points.filter((_: any, idx: number) => idx % 2 === 0);
              const ys = updated.points.filter((_: any, idx: number) => idx % 2 !== 0);
              updated.width = Math.max(30, Math.max(...xs) - Math.min(...xs));
              updated.height = Math.max(30, Math.max(...ys) - Math.min(...ys));
            }

            if (shapeType === "Konva.Arc" || shapeType === "Konva.Wedge") {
              updated.width = Math.max(50, node.width() * scaleX);
              updated.height = Math.max(50, node.height() * scaleY);
            }

            // Reset Konva's internal scale
            node.scaleX(1);
            node.scaleY(1);

            // Restrict bounds
            const bounds = restrictShapeBounds(updated.x, updated.y, shapeType, updated);
            updated.x = bounds.x;
            updated.y = bounds.y;

            // Save back immutably using shape_id for identification
            const updatedSlides = slides.map((s, idx) =>
              idx === slideIdx
                ? {
                  ...s,
                  elements: s.elements.map((e: any) =>
                    e.shape_id === safeShapeId ? { ...e, properties: updated } : e
                  ),
                }
                : s
            );

            setSlides(updatedSlides);
            setSelectedShapeId(safeShapeId);
            node.getLayer()?.batchDraw();
          },
          onDragEnd: () => {
            const node = shapeRefs.current[i];
            if (!node) return;

            const shapeType = el.konva_component;
            const shapeProps = { ...el.properties };

            // Ensure width/height for some shapes
            if (shapeType === "Konva.Ellipse") {
              shapeProps.width = (shapeProps.radiusX || 25) * 2;
              shapeProps.height = (shapeProps.radiusY || 25) * 2;
            } else if (shapeType === "Konva.RegularPolygon") {
              shapeProps.width = (shapeProps.radius || 25) * 2;
              shapeProps.height = (shapeProps.radius || 25) * 2;
            }

            const bounds = restrictShapeBounds(node.x(), node.y(), shapeType, shapeProps);

            node.x(bounds.x);
            node.y(bounds.y);

            // Save immutably using shape_id for identification
            const updatedSlides = slides.map((s, idx) =>
              idx === slideIdx
                ? {
                  ...s,
                  elements: s.elements.map((e: any) =>
                    e.shape_id === safeShapeId
                      ? {
                        ...e,
                        properties: {
                          ...e.properties,
                          x: bounds.x,
                          y: bounds.y,
                        },
                      }
                      : e
                  ),
                }
                : s
            );

            setSlides(updatedSlides);
            setSelectedShapeId(safeShapeId);
            node.getLayer()?.batchDraw();
          },

          ...safeProps,
        };

        switch (el.konva_component) {
          case "Konva.Circle":
            return <Circle key={`shape-${safeShapeId}-${i}`} {...commonProps} />;
          case "Konva.Rect":
            return <Rect key={`shape-${safeShapeId}-${i}`} {...commonProps} />; // Line ~278 fixed
          case "Konva.RegularPolygon":
            return <RegularPolygon key={`shape-${safeShapeId}-${i}`} {...commonProps} />;
          case "Konva.Star":
            return <Star key={`shape-${safeShapeId}-${i}`} {...commonProps} />;
          case "Konva.Line":
            return (
              <Line
                key={`shape-${safeShapeId}-${i}`}
                points={safeProps.points || []}
                stroke={safeProps.stroke || safeProps.fill} // ✅ FIXED: Fallback to fill if no stroke (variants use stroke)
                strokeWidth={safeProps.strokeWidth}
                tension={safeProps.tension}
                lineCap={safeProps.lineCap}
                dash={safeProps.dash}
                {...commonProps}
              />
            ); // Line ~285 fixed
          case "Konva.Arrow":
            return (
              <Arrow
                key={`shape-${safeShapeId}-${i}`}
                points={safeProps.points || []}
                stroke={safeProps.stroke || safeProps.fill}
                fill={safeProps.fill || safeProps.stroke}
                {...commonProps}
              />
            );
          case "Konva.Ellipse":
            return <Ellipse key={`shape-${safeShapeId}-${i}`} {...commonProps} />; // Line ~303 fixed
          case "Konva.Arc":
            return <Arc key={`shape-${safeShapeId}-${i}`} {...commonProps} />;
          case "Konva.Wedge":
            return <Wedge key={`shape-${safeShapeId}-${i}`} {...commonProps} />;
          default:
            console.warn(`Unknown shape type: ${el.konva_component}`); // ✅ FIXED: Add for debug
            return null;
        }
      })}

      {selectedShapeIndex !== null && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          boundBoxFunc={(oldBox, newBox) => {
            const MIN_SIZE = 50;
            const MAX_SIZE = 300;

            // Get shape properties
            const shape = elements[selectedShapeIndex];
            const shapeType = shape?.konva_component;
            let width = newBox.width;
            let height = newBox.height;

            // Adjust width and height for specific shapes
            if (shapeType === "Konva.Ellipse") {
              width = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newBox.width));
              height = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newBox.height));
            } else if (shapeType === "Konva.RegularPolygon") {
              const radius = Math.max(MIN_SIZE / 2, Math.min(MAX_SIZE / 2, Math.max(newBox.width, newBox.height) / 2));
              width = height = radius * 2;
            } else {
              width = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newBox.width));
              height = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newBox.height));
            }

            // Apply position constraints
            const bounds = restrictShapeBounds(newBox.x, newBox.y, shapeType, { width, height });

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