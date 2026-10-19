"use client";

import { useEffect, useState } from "react";
import {
    Stage, Layer, Rect, Circle, Ellipse, Line, Text,
    TextPath, Image as KonvaImage, RegularPolygon, Star,
    Ring, Arc, Wedge, Arrow, Label, Tag, Group, Transformer, Path
} from "react-konva";
import { getSlideDimensions } from "../../utils/slideUtils";
import { KonvaElement, SlideData } from "./types";

export default function SlidePage() {
    const [slide, setSlide] = useState<SlideData | null>(null);

    const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();

    const renderElement = (el: KonvaElement, idx: number) => {
        const baseProps = {
            x: el.x,
            y: el.y,
            fill: el.fill,
            stroke: el.stroke,
            strokeWidth: el.strokeWidth,
            opacity: el.opacity,
            shadowColor: el.shadowColor,
            shadowBlur: el.shadowBlur,
            shadowOpacity: el.shadowOpacity,
            lineCap: el.lineCap,
            lineJoin: el.lineJoin,
            shadowOffset: el.shadowOffset,

            fillLinearGradientStartPoint: el.fillLinearGradientStartPoint,
            fillLinearGradientEndPoint: el.fillLinearGradientEndPoint,
            fillLinearGradientColorStops: el.fillLinearGradientColorStops,

            key: idx,
        };

        switch (el.type) {
            case "Rect":
                return (
                    <Rect
                        {...baseProps}
                        width={el.width}
                        height={el.height}
                        cornerRadius={el.cornerRadius}
                    />
                );

            case "Circle":
                return <Circle {...baseProps} radius={el.radius} />;

            case "Ellipse":
                return (
                    <Ellipse
                        {...baseProps}
                        radiusX={el.radiusX}
                        radiusY={el.radiusY}
                    />
                );

            case "Line":
                return <Line {...baseProps} points={el.points} />;

            case "Arrow":
                return (
                    <Arrow
                        {...baseProps}
                        points={el.points}
                        pointerLength={el.pointerLength}
                        pointerWidth={el.pointerWidth}
                    />
                );

            case "Text":
                return (
                    <Text
                        {...baseProps}
                        text={el.text}
                        fontSize={el.fontSize}
                        fontFamily={el.fontFamily}
                        fontStyle={el.fontStyle}
                        align={el.align}
                        lineHeight={el.lineHeight}
                        letterSpacing={el.letterSpacing}
                        offsetY={el.offsetY}
                    />
                );

            case "TextPath":
                return (
                    <TextPath
                        {...baseProps}
                        text={el.text}
                        fontSize={el.fontSize}
                        fontFamily={el.fontFamily}
                        data={el.data}
                    />
                );

            case "Image":
                return (
                    <KonvaImage
                        {...baseProps}
                        image={el.image}
                        width={el.width}
                        height={el.height}
                    />
                );

            case "RegularPolygon":
                return (
                    <RegularPolygon
                        {...baseProps}
                        sides={el.sides}
                        radius={el.radius}
                    />
                );

            case "Star":
                return (
                    <Star
                        {...baseProps}
                        numPoints={el.numPoints}
                        innerRadius={el.innerRadius}
                        outerRadius={el.outerRadius}
                    />
                );

            case "Ring":
                return (
                    <Ring
                        {...baseProps}
                        innerRadius={el.innerRadius}
                        outerRadius={el.outerRadius}
                    />
                );

            case "Arc":
                return (
                    <Arc
                        {...baseProps}
                        innerRadius={el.innerRadius}
                        outerRadius={el.outerRadius}
                        angle={el.angle}
                        clockwise={el.clockwise}
                    />
                );

            case "Wedge":
                return (
                    <Wedge
                        {...baseProps}
                        angle={el.angle}
                        radius={el.radius}
                        clockwise={el.clockwise}
                    />
                );

            case "Path":
                return <Path {...baseProps} data={el.data} />;

            case "Label":
                return (
                    <Label {...baseProps}>
                        {el.tag && (
                            <Tag
                                fill={el.tag.fill}
                                stroke={el.tag.stroke}
                                cornerRadius={el.tag.cornerRadius}
                            />
                        )}
                        {el.text && (
                            <Text
                                text={el.text.text}
                                fontSize={el.text.fontSize}
                                fontFamily={el.text.fontFamily}
                                fontStyle={el.text.fontStyle}
                                align={el.text.align}
                                fill={el.text.fill}
                            />
                        )}
                    </Label>
                );

            case "Group":
                return (
                    <Group {...baseProps}>
                        {el.children?.map((child, i) => renderElement(child, i))}
                    </Group>
                );

            default:
                const exhaustiveCheck: never = el;
                console.warn("Unknown Konva type:", exhaustiveCheck);
                return null;
        }
    };

useEffect(() => {
  const slideJson: SlideData = {
    "title": "The Proactive Pulse: Orchestrating Your Health Future with Agentic AI",
    "konvaElements": [
      {
        "type": "Rect",
        "x": 0,
        "y": 0,
        "width": 1280,
        "height": 720,
        "fillLinearGradientStartPoint": {
          "x": 0,
          "y": 0
        },
        "fillLinearGradientEndPoint": {
          "x": 0,
          "y": 720
        },
        "fillLinearGradientColorStops": [
          0,
          "#0A192F",
          1,
          "#1A2B42"
        ]
      },
      {
        "type": "Text",
        "x": 100,
        "y": 200,
        "text": "The Proactive Pulse:",
        "fontSize": 68,
        "fontFamily": "Inter, sans-serif",
        "fill": "#E0F2F7",
        "align": "left",
        "width": 1080,
        "fontStyle": "bold"
      },
      {
        "type": "Text",
        "x": 100,
        "y": 275,
        "text": "Orchestrating Your Health Future with Agentic AI",
        "fontSize": 56,
        "fontFamily": "Inter, sans-serif",
        "fill": "#00C2FF",
        "align": "left",
        "width": 1080,
        "fontStyle": "bold"
      },
      {
        "type": "Text",
        "x": 100,
        "y": 390,
        "text": "From reactive diagnosis to predictive wellness. It's time for AI that doesn't just inform, but *acts* for your optimal health.",
        "fontSize": 32,
        "fontFamily": "Inter, sans-serif",
        "fill": "#A7D9F0",
        "align": "left",
        "width": 1080,
        "lineHeight": 1.4
      },
      {
        "type": "Text",
        "x": 980,
        "y": 660,
        "text": "Proactive Health, Personalized AI.",
        "fontSize": 22,
        "fontFamily": "Inter, sans-serif",
        "fill": "#A7D9F0",
        "align": "right",
        "width": 200,
        "opacity": 0.7
      },
      {
        "type": "Circle",
        "x": 1150,
        "y": 150,
        "radius": 40,
        "fill": "#00C2FF",
        "opacity": 0.15
      },
      {
        "type": "Circle",
        "x": 1050,
        "y": 50,
        "radius": 25,
        "fill": "#00C2FF",
        "opacity": 0.2
      },
      {
        "type": "Circle",
        "x": 1200,
        "y": 40,
        "radius": 15,
        "fill": "#00C2FF",
        "opacity": 0.25
      },
      {
        "type": "Line",
        "points": [
          1150,
          150,
          1050,
          50
        ],
        "stroke": "#00C2FF",
        "strokeWidth": 1,
        "opacity": 0.3
      },
      {
        "type": "Line",
        "points": [
          1150,
          150,
          1200,
          40
        ],
        "stroke": "#00C2FF",
        "strokeWidth": 1,
        "opacity": 0.3
      },
      {
        "type": "Circle",
        "x": 130,
        "y": 600,
        "radius": 35,
        "fill": "#00C2FF",
        "opacity": 0.15
      },
      {
        "type": "Circle",
        "x": 50,
        "y": 650,
        "radius": 20,
        "fill": "#00C2FF",
        "opacity": 0.2
      },
      {
        "type": "Circle",
        "x": 200,
        "y": 680,
        "radius": 18,
        "fill": "#00C2FF",
        "opacity": 0.25
      },
      {
        "type": "Line",
        "points": [
          130,
          600,
          50,
          650
        ],
        "stroke": "#00C2FF",
        "strokeWidth": 1,
        "opacity": 0.3
      },
      {
        "type": "Line",
        "points": [
          130,
          600,
          200,
          680
        ],
        "stroke": "#00C2FF",
        "strokeWidth": 1,
        "opacity": 0.3
      }
    ]
  }

  setSlide(slideJson);
}, []);


    if (!slide) return <div>Loading slide...</div>;

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ color: "white", marginBottom: 20 }}>{slide.title}</h1>
            <Stage width={2000} height={700} style={{ border: "1px solid gray" }}>
                <Layer>
                    {slide.konvaElements.map((el, idx) => renderElement(el, idx))}
                </Layer>
            </Stage>
        </div>
    );
}
