"use client";

import React from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import { renderSlideElements } from "../../../utils/renderSlideElements";
import useImage from "use-image";

const SlideRenderer = ({
  slide,
  theme,
}: {
  slide: any;
  theme?: {
    image_url?: string;
    backgroundColor?: string;
    primaryColor?: string;
    font?: string;
  };
}) => {
  const { elements, slide_title } = slide;
  const [bgImage] = useImage(theme?.image_url || "");

  const SLIDE_WIDTH = 960;
  const SLIDE_HEIGHT = 700;

  const titleProps = slide_title?.properties || {};

  return (
    <Stage width={SLIDE_WIDTH} height={SLIDE_HEIGHT}>
      <Layer>
        {/* Background */}
        {theme?.image_url && bgImage ? (
          <KonvaImage
            image={bgImage}
            x={0}
            y={0}
            width={SLIDE_WIDTH}
            height={SLIDE_HEIGHT}
          />
        ) : (
          <Rect
            name="background"
            x={0}
            y={0}
            width={SLIDE_WIDTH}
            height={SLIDE_HEIGHT}
            fill={theme?.backgroundColor || "#fff"}
          />
        )}

        {/* Title */}
        {slide_title?.text &&
          renderSlideElements([
            {
              element_type: "text",
              text: slide_title.text,
              useThemeColor: slide_title.useThemeColor,
              properties: {
                x: titleProps.x ?? 50,
                y: titleProps.y ?? 30,
                width: titleProps.width ?? 800,
                fontSize: titleProps.fontSize ?? 32,
                fontWeight: titleProps.fontWeight ?? "normal",
                fontStyle: titleProps.fontStyle ?? "normal",
                opacity: titleProps.opacity ?? 1,
                align: titleProps.align ?? "left",
                verticalAlign: titleProps.verticalAlign ?? "top",
                fill: slide_title.useThemeColor
                  ? theme?.primaryColor || "#000"
                  : titleProps.fill || "#000",
                fontFamily:
                  theme?.font ||
                  titleProps.fontFamily ||
                  "Arial",
              },
            },
          ])}

        {/* Elements */}
        {renderSlideElements(
          elements.map((el: any) => {
            const props = el.properties || {};
            return {
              ...el,
              properties: {
                ...props,
                fill: el.useThemeColor
                  ? theme?.primaryColor || "#000"
                  : props.fill || "#000",
                fontFamily:
                  theme?.font ||
                  props.fontFamily ||
                  "Arial",
              },
            };
          })
        )}
      </Layer>
    </Stage>
  );
};

export default SlideRenderer;
