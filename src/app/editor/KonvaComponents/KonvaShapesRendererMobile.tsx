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
import { getSlideDimensions, restrictShapeBounds } from "../../../utils/slideUtilsmobile";

interface KonvaShapesRendererMobileProps {
    elements: any[];
    selectedShapeIndex: number | null;
    onSelectShape: (index: number | null) => void;
}

const KonvaShapesRendererMobile: React.FC<KonvaShapesRendererMobileProps> = ({
    elements,
    selectedShapeIndex,
    onSelectShape,
}) => {
    const shapeRefs = useRef<(any | null)[]>([]);
    const trRef = useRef<any>(null);
    const { slides, setSlides, selectedSlideIndex: slideIdx } = useSlides();
    const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();

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
            {elements.map((el, i) => {
                if (el.element_type !== "shape") return null;

                const shapeType = el.konva_component;
                const commonProps = {
                    ref: (node: any) => (shapeRefs.current[i] = node),
                    ...el.properties,
                    draggable: true,
                    onClick: () => onSelectShape(i),
                    onTap: () => onSelectShape(i),
                    onMouseDown: () => onSelectShape(i),
                    onTouchStart: () => onSelectShape(i),
                    dragBoundFunc: (pos: { x: number; y: number }) => {
                        const node = shapeRefs.current[i];
                        if (!node) return pos;

                        const { x, y } = restrictShapeBounds(
                            pos.x,
                            pos.y,
                            shapeType,
                            el.properties,
                            SLIDE_WIDTH,
                            SLIDE_HEIGHT
                        );
                        return { x, y };
                    },
                    onTransformEnd: () => {
                        const node = shapeRefs.current[i];
                        if (!node) return;

                        const shapeType = el.konva_component;
                        const updated = { ...el.properties };

                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        updated.x = node.x();
                        updated.y = node.y();

                        let width = updated.width || 50;
                        let height = updated.height || 50;

                        switch (shapeType) {
                            case "Konva.Rect":
                            case "Konva.Ellipse":
                            case "Konva.Wedge":
                            case "Konva.Arc":
                            case "Konva.RegularPolygon":
                                width = node.width() * scaleX;
                                height = node.height() * scaleY;
                                break;

                            case "Konva.Circle":
                                updated.radius = node.radius() * Math.max(scaleX, scaleY);
                                break;


                            case "Konva.Star":
                                updated.outerRadius = node.outerRadius() * Math.max(scaleX, scaleY);
                                if (updated.innerRadius)
                                    updated.innerRadius = updated.outerRadius / 2;
                                width = updated.outerRadius * 2;
                                height = width;
                                break;

                            case "Konva.Line":
                            case "Konva.Arrow":
                                const scaledPoints = node
                                    .points()
                                    .map((point: number, idx: number) => {
                                        return idx % 2 === 0 ? point * scaleX : point * scaleY;
                                    });
                                updated.points = scaledPoints;
                                width = Math.max(...scaledPoints.filter((_: number, idx: number) => idx % 2 === 0)) -
                                    Math.min(...scaledPoints.filter((_: number, idx: number) => idx % 2 === 0));
                                height = Math.max(...scaledPoints.filter((_: number, idx: number) => idx % 2 !== 0)) -
                                    Math.min(...scaledPoints.filter((_: number, idx: number) => idx % 2 !== 0));
                                break;
                        }

                        const { x, y, width: constrainedWidth, height: constrainedHeight } = restrictShapeBounds(
                            node.x(),
                            node.y(),
                            shapeType,
                            { ...updated, width, height },
                            SLIDE_WIDTH,
                            SLIDE_HEIGHT
                        );

                        updated.x = x;
                        updated.y = y;
                        if (shapeType !== "Konva.Circle" && shapeType !== "Konva.Star") {
                            updated.width = constrainedWidth;
                            updated.height = constrainedHeight;
                        }

                        node.scaleX(1);
                        node.scaleY(1);

                        const updatedSlides = structuredClone(slides);
                        updatedSlides[slideIdx].elements[i].properties = updated;
                        setSlides(updatedSlides);
                    },
                };

                switch (shapeType) {
                    case "Konva.Circle":
                        return <Circle key={`shape-${i}`} {...commonProps} />;
                    case "Konva.Rect":
                        return <Rect key={`shape-${i}`} {...commonProps} />;
                    case "Konva.RegularPolygon":
                        return <RegularPolygon key={`shape-${i}`} {...commonProps} />;
                    case "Konva.Star":
                        return <Star key={`shape-${i}`} {...commonProps} />;
                    case "Konva.Line":
                        return <Line key={`shape-${i}`} {...commonProps} stroke={el.properties.fill} fill={el.properties.fill} />;
                    case "Konva.Arrow":
                        return <Arrow key={`shape-${i}`} {...commonProps} stroke={el.properties.fill} fill={el.properties.fill} />;
                    case "Konva.Ellipse":
                        return <Ellipse key={`shape-${i}`} {...commonProps} />;
                    case "Konva.Arc":
                        return <Arc key={`shape-${i}`} {...commonProps} />;
                    case "Konva.Wedge":
                        return <Wedge key={`shape-${i}`} {...commonProps} />;
                    default:
                        return null;
                }
            })}
            {selectedShapeIndex !== null && (
                <Transformer
                    ref={trRef}
                    enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
                    boundBoxFunc={(oldBox, newBox) => {
                        const shape = shapeRefs.current[selectedShapeIndex];
                        if (!shape) return oldBox;

                        const shapeType = elements[selectedShapeIndex].konva_component;
                        const scaleX = newBox.width / oldBox.width;
                        const scaleY = newBox.height / oldBox.height;

                        let width = newBox.width;
                        let height = newBox.height;

                        switch (shapeType) {
                            case "Konva.Circle":
                                width = height = Math.max(newBox.width, newBox.height);
                                break;
                            case "Konva.Star":
                                width = height = Math.max(newBox.width, newBox.height);
                                break;
                            case "Konva.Line":
                            case "Konva.Arrow":
                                // Allow scaling points, but ensure minimum size
                                width = Math.max(newBox.width, 30);
                                height = Math.max(newBox.height, 30);
                                break;
                        }

                        const { x, y, width: constrainedWidth, height: constrainedHeight } = restrictShapeBounds(
                            newBox.x,
                            newBox.y,
                            shapeType,
                            { width, height },
                            SLIDE_WIDTH,
                            SLIDE_HEIGHT
                        );

                        if (constrainedWidth < 30 || constrainedHeight < 30) return oldBox;

                        return { ...newBox, x, y, width: constrainedWidth, height: constrainedHeight };
                    }}
                />
            )}
        </>
    );
};

export default KonvaShapesRendererMobile;