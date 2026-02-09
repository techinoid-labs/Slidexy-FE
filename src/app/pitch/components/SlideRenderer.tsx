import React from "react";
import {
    Rect, Circle, Ellipse, Line, Text,
    TextPath, Image as KonvaImage, RegularPolygon, Star,
    Ring, Arc, Wedge, Path, Label, Tag, Group, Arrow
} from "react-konva";
import { KonvaElement } from "../types";

interface SlideRendererProps {
    element: KonvaElement;
}

const SlideRenderer: React.FC<SlideRendererProps> = ({ element }) => {
    const baseProps = {
        x: element.x,
        y: element.y,
        fill: element.fill,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        opacity: element.opacity,
        shadowColor: element.shadowColor,
        shadowBlur: element.shadowBlur,
        shadowOpacity: element.shadowOpacity,
        lineCap: element.lineCap,
        lineJoin: element.lineJoin,
        shadowOffset: element.shadowOffset,
        fillLinearGradientStartPoint: element.fillLinearGradientStartPoint,
        fillLinearGradientEndPoint: element.fillLinearGradientEndPoint,
        fillLinearGradientColorStops: element.fillLinearGradientColorStops,
    };

    switch (element.type) {
        case "Rect":
            return <Rect {...baseProps} width={element.width} height={element.height} cornerRadius={element.cornerRadius} />;

        case "Circle":
            return <Circle {...baseProps} radius={element.radius} />;

        case "Ellipse":
            return <Ellipse {...baseProps} radiusX={element.radiusX} radiusY={element.radiusY} />;

        case "Line":
            return <Line {...baseProps} points={element.points} />;

        case "Arrow":
            return <Arrow {...baseProps} points={element.points} pointerLength={element.pointerLength} pointerWidth={element.pointerWidth} />;

        case "Text":
            return (
                <Text
                    {...baseProps}
                    text={element.text}
                    fontSize={element.fontSize}
                    fontFamily={element.fontFamily}
                    fontStyle={element.fontStyle}
                    align={element.align}
                    lineHeight={element.lineHeight}
                    letterSpacing={element.letterSpacing}
                    offsetY={element.offsetY}
                    width={element.width}
                />
            );

        case "TextPath":
            return <TextPath {...baseProps} text={element.text} fontSize={element.fontSize} fontFamily={element.fontFamily} data={element.data} />;

        case "Image":
            return <KonvaImage {...baseProps} image={element.image} width={element.width} height={element.height} />;

        case "RegularPolygon":
            return <RegularPolygon {...baseProps} sides={element.sides} radius={element.radius} />;

        case "Star":
            return <Star {...baseProps} numPoints={element.numPoints} innerRadius={element.innerRadius} outerRadius={element.outerRadius} />;

        case "Ring":
            return <Ring {...baseProps} innerRadius={element.innerRadius} outerRadius={element.outerRadius} />;

        case "Arc":
            return <Arc {...baseProps} innerRadius={element.innerRadius} outerRadius={element.outerRadius} angle={element.angle} clockwise={element.clockwise} />;

        case "Wedge":
            return <Wedge {...baseProps} angle={element.angle} radius={element.radius} clockwise={element.clockwise} />;

        case "Path":
            return <Path {...baseProps} data={element.data} />;

        case "Label":
            return (
                <Label {...baseProps}>
                    {element.tag && <Tag fill={element.tag.fill} stroke={element.tag.stroke} cornerRadius={element.tag.cornerRadius} />}
                    {element.text && (
                        <Text
                            text={element.text.text}
                            fontSize={element.text.fontSize}
                            fontFamily={element.text.fontFamily}
                            fontStyle={element.text.fontStyle}
                            align={element.text.align}
                            fill={element.text.fill}
                        />
                    )}
                </Label>
            );

        case "Group":
            return (
                <Group {...baseProps}>
                    {element.children?.map((child, i) => <SlideRenderer key={i} element={child} />)}
                </Group>
            );

        default:
            console.warn("Unknown Konva type:", element);
            return null;
    }
};

export default SlideRenderer;
