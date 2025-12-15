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
  Text,
  Image,
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
      x = 0,
      y = 0,
      width = properties.width ?? properties.w ?? 0,
      height = properties.height ?? properties.h ?? 0,
      radius = properties.radius,
      radiusX = properties.radiusX,
      radiusY = properties.radiusY,
      points = properties.points,
      fontSize = properties.fontSize,
      fontWeight = properties.fontWeight,
      fontFamily = properties.fontFamily ?? "Arial",
      fill = properties.fill ?? "#000000",
      stroke = properties.stroke,
      strokeWidth = properties.strokeWidth,
      cornerRadius = properties.cornerRadius || properties.corner_radii || 0,
      shadowColor = properties.shadowColor,
      shadowBlur = properties.shadowBlur,
      shadowOffsetY = properties.shadowOffsetY,
      fillLinearGradientStartPoint = properties.fillLinearGradientStartPoint,
      fillLinearGradientEndPoint = properties.fillLinearGradientEndPoint,
      fillLinearGradientColorStops = properties.fillLinearGradientColorStops,
    } = properties;

    // Normalize konva component string (allow both "Konva.Rect" and "Rect" etc.)
    const comp = (el.konva_component || "").replace(/^Konva\./, "");

    switch (element_type) {
      case "text":
      case "bullet_point":
        return (
          <Text
            key={index}
            text={text}
            x={x}
            y={y}
            width={width || undefined}
            height={height || undefined}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fontStyle={properties.fontStyle}
            fontWeight={fontWeight}
            fill={fill}
            lineHeight={properties.lineHeight || 1.2}
            listening={false}
          />
        );

      case "image":
        return (
          <KonvaImage
            key={index}
            src={properties.imageSrc || src}
            x={x}
            y={y}
            w={width}
            h={height}
          />
        );

      case "shape":
        switch (comp) {
          case "Rect":
            return (
              <Rect
                key={index}
                x={x}
                y={y}
                width={width}
                height={height}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                cornerRadius={cornerRadius}
                shadowColor={shadowColor}
                shadowBlur={shadowBlur}
                shadowOffsetY={shadowOffsetY}
                fillLinearGradientStartPoint={fillLinearGradientStartPoint}
                fillLinearGradientEndPoint={fillLinearGradientEndPoint}
                fillLinearGradientColorStops={fillLinearGradientColorStops}
              />
            );
          case "Circle":
            return (
              <Circle
                key={index}
                x={x}
                y={y}
                radius={radius ?? Math.max(width, height) / 2}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                shadowColor={shadowColor}
                shadowBlur={shadowBlur}
              />
            );
          case "Ellipse":
            return (
              <Ellipse
                key={index}
                x={x}
                y={y}
                radiusX={radiusX ?? width / 2}
                radiusY={radiusY ?? height / 2}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          case "Line":
            return (
              <Line
                key={index}
                points={points || []}
                stroke={stroke || fill}
                strokeWidth={strokeWidth || 2}
                lineCap={properties.lineCap || "round"}
                lineJoin={properties.lineJoin || "round"}
                tension={properties.tension}
              />
            );
          case "Arrow":
            return (
              <Arrow
                key={index}
                points={points || []}
                stroke={stroke || fill}
                fill={fill}
                strokeWidth={strokeWidth || 2}
              />
            );
          case "Star":
            return (
              <Star
                key={index}
                x={x}
                y={y}
                numPoints={properties.numPoints || 5}
                innerRadius={properties.innerRadius ?? width / 4}
                outerRadius={properties.outerRadius ?? width / 2}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          case "RegularPolygon":
            return (
              <RegularPolygon
                key={index}
                x={x}
                y={y}
                sides={properties.sides || 5}
                radius={radius ?? width / 2}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          case "Arc":
            return (
              <Arc
                key={index}
                x={x}
                y={y}
                innerRadius={properties.innerRadius ?? width / 4}
                outerRadius={properties.outerRadius ?? width / 2}
                angle={properties.angle ?? 90}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          case "Wedge":
            return (
              <Wedge
                key={index}
                x={x}
                y={y}
                radius={radius ?? width / 2}
                angle={properties.angle ?? 60}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          default:
            return (
              <Rect
                key={index}
                x={x}
                y={y}
                width={width}
                height={height}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
        }

      default:
        return null;
    }
  });
}
