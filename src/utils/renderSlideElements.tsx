import React from "react";
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
  Transformer, Text, Image
} from "react-konva";
import useImage from "use-image";

const KonvaImage = ({ src, x, y, w, h }: any) => {
  const [image] = useImage(src, "anonymous");
  if (!image) return null;
  return <Image image={image} x={x} y={y} width={w} height={h} />;
};

export function renderSlideElements(elements: any[]) {
  return elements.map((el, index) => {
    const { element_type, text, properties = {}, src } = el;
    const {
      x = 100,
      y = 100,
      w = 300,
      iw = 100,
      ih = 100,
      h = 50,
      sw = 2,
      sh = 2,
      radius,
      radiusX,
      radiusY,
      points,
      width, 
      height,
      fontSize,
      fontWeight,
      fontFamily = "Arial",
      fill = "#000000",
      stroke,
      strokeWidth,
    } = properties;

    const baseProps = {
      x,
      y,
      width: sw,
      height: sh,
      fill,
      stroke,
      strokeWidth,
    };

    switch (element_type) {
      case "text":
      case "bullet_point":
        return (
          <Text
            key={index}
            text={text}
            x={x}
            y={y}
            width={width}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fontWeight= {fontWeight}
            fill={fill}
            lineHeight={1.2}
            listening={false}
          />
        );

      case "image":
        return (
          <KonvaImage key={index} src={properties.imageSrc || src} x={x} y={y} w={width} h={height} />
        );

      case "shape":
        switch (el.konva_component) {
          case "Konva.Rect":
            return <Rect key={index} {...baseProps} />;
          case "Konva.Circle":
            return (
              <Circle
                key={index}
                x={x}
                y={y}
                radius={radius || w / 2}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          case "Konva.Ellipse":
            return (
              <Ellipse
                key={index}
                x={x}
                y={y}
                radiusX={radiusX || w / 2}
                radiusY={radiusY || h / 2}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          case "Konva.Line":
            return (
              <Line
                key={index}
                points={points}
                stroke={stroke || fill}
                strokeWidth={strokeWidth || 2}
                lineCap="round"
                lineJoin="round"
              />
            );
          case "Konva.Arrow":
            return (
              <Line
                key={index}
                points={points}
                stroke={stroke || fill}
                strokeWidth={strokeWidth || 2}
                lineCap="round"
                lineJoin="round"
              />
            );
          case "Konva.Star":
            return (
              <Star
                key={index}
                x={x}
                y={y}
                numPoints={5}
                innerRadius={w / 4}
                outerRadius={w / 2}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          case "Konva.RegularPolygon":
            return (
              <RegularPolygon
                key={index}
                x={x}
                y={y}
                sides={properties.sides || 5}
                radius={radius || w / 2}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          case "Konva.Arc":
            return (
              <Arc
                key={index}
                x={x}
                y={y}
                innerRadius={properties.innerRadius || w / 4}
                outerRadius={properties.outerRadius || w / 2}
                angle={properties.angle || 90}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          case "Konva.Wedge":
            return (
              <Wedge
                key={index}
                x={x}
                y={y}
                radius={radius || w / 2}
                angle={properties.angle || 60}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          default:
            return <Rect key={index} {...baseProps} />;
        }


      default:
        return null;
    }
  });
}
