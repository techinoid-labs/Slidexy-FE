"use client";

import React from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import { renderSlideElements } from "../../../utils/renderSlideElements";
import useImage from "use-image";
import { getSlideDimensions } from "../../../utils/slideUtils";

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
  const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
  const { elements, slide_title, background } = slide;
  const titleProps = slide_title?.properties || {};

  const bgUrl = background?.type === "image" ? background.url : theme?.image_url || "";
  const [bgImage] = useImage(bgUrl);

  return (
    <Stage width={SLIDE_WIDTH} height={SLIDE_HEIGHT}>
      <Layer>
        {/* Background */}
        {bgUrl && bgImage ? (
          <KonvaImage image={bgImage} width={SLIDE_WIDTH} height={SLIDE_HEIGHT} />
        ) : background?.type === "linear" && background.gradient ? (
          <Rect
            width={SLIDE_WIDTH}
            height={SLIDE_HEIGHT}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: SLIDE_WIDTH, y: SLIDE_HEIGHT }}
            fillLinearGradientColorStops={
              background.gradient.stops || [0, background.gradient.start, 1, background.gradient.end]
            }
          />
        ) : (
          <Rect
            width={SLIDE_WIDTH}
            height={SLIDE_HEIGHT}
            fill={background?.color || theme?.backgroundColor || "#ffffff"}
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
                fontFamily: theme?.font || titleProps.fontFamily || "Arial",
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
                fill: el.useThemeColor ? theme?.primaryColor || "#000" : props.fill || "#000",
                fontFamily: theme?.font || props.fontFamily || "Arial",
              },
            };
          })
        )}
      </Layer>
    </Stage>
  );
};

export default SlideRenderer;