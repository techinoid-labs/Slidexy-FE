"use client";

import React, { useRef, useState } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Box } from "@mui/material";
import SlideImage from "./KonvaComponents/KonvaSlideImage";
import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
import { dummyData } from "./dummy";
import { useSlideThemeContext } from "@/app/context/ThemeContext";

const SLIDE_WIDTH = 1000;
const SLIDE_HEIGHT = 480;
const SLIDE_GAP = 20;
const LEFT_PADDING = 40;
const IMAGE_WIDTH = 500;
const IMAGE_PADDING = 20;
const textMaxWidth = SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING;

interface EditingState {
  slideIndex: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
}

const SlideEditor = ({ slides = [] }: any) => {
  const stageRefs = useRef<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedTheme } = useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "", "anonymous");

  console.log(selectedTheme, bgImage);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [inputValue, setInputValue] = useState("");

  const handleTextDoubleClick = (
    slideIndex: number,
    text: string,
    x: number,
    y: number,
    fontSize: number
  ) => {
    setEditing({ slideIndex, text, x, y, fontSize });
    setInputValue(text);
  };

  const handleEditCommit = () => {
    setEditing(null);
  };

  return (
    <Box>
      <Box
        id="konva-container"
        ref={containerRef}
        sx={{
          width: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: `${SLIDE_GAP}px`,
          padding: 2,
          backgroundColor: "#eee",
          alignItems: "center",
        }}
      >
        {dummyData.map((slide: any, index: number) => {
          const title = slide.slide_title;
          const titleProps = title.properties;
          const titleY = 25;
          const bulletGap = 10;
          const bulletStartY = titleY + titleProps.fontSize + 20;

          return (
            <Box
              key={slide.slide_id}
              sx={{
                width: `${SLIDE_WIDTH}px`,
                height: `${SLIDE_HEIGHT}px`,
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                position: "relative",
              }}
            >
              <Stage
                width={SLIDE_WIDTH}
                height={SLIDE_HEIGHT}
                ref={(ref: any) => (stageRefs.current[index] = ref)}
              >
                <Layer>
                  {/* Theme Background */}
                  {/* {selectedTheme?.image_url && bgImage ? (
                    <KonvaImage
                      image={bgImage}
                      x={0}
                      y={0}
                      width={SLIDE_WIDTH}
                      height={SLIDE_HEIGHT}
                    />
                  ) : (
                    <Rect
                      x={0}
                      y={0}
                      width={SLIDE_WIDTH}
                      height={SLIDE_HEIGHT}
                      fill={selectedTheme?.backgroundColor || "#fff"}
                    />
                  )} */}
                  {selectedTheme?.image_url && bgImage ? (
                    <KonvaImage
                      image={bgImage}
                      x={0}
                      y={0}
                      width={SLIDE_WIDTH}
                      height={SLIDE_HEIGHT}
                    />
                  ) : (
                    <Rect
                      x={0}
                      y={0}
                      width={SLIDE_WIDTH}
                      height={SLIDE_HEIGHT}
                      fill={selectedTheme?.backgroundColor || "#fff"}
                    />
                  )}

                  {/* Title */}
                  <KonvaTextEditor
                    id={`title-${slide.slide_id}`}
                    text={title.text}
                    x={LEFT_PADDING}
                    y={titleY}
                    width={textMaxWidth}
                    wrap="word"
                    fontSize={titleProps.fontSize}
                    fontFamily={selectedTheme?.font || titleProps.fontFamily}
                    fill={selectedTheme?.primaryColor || titleProps.fill}
                    fontStyle={titleProps.fontStyle}
                    onDblClick={() =>
                      handleTextDoubleClick(
                        index,
                        title.text,
                        LEFT_PADDING,
                        titleY,
                        titleProps.fontSize
                      )
                    }
                  />

                  {/* Bullet Points */}
                  {slide.elements.map((el: any, i: number) => {
                    const elY =
                      bulletStartY + i * (el.properties.fontSize + bulletGap);

                    return (
                      <KonvaTextEditor
                        key={`el-${i}`}
                        id={`el-${i}`}
                        text={`• ${el.text}`}
                        x={LEFT_PADDING + 20}
                        y={elY + 70}
                        width={textMaxWidth - 20}
                        wrap="word"
                        fontSize={el.properties.fontSize}
                        fontFamily={
                          selectedTheme?.font || el.properties.fontFamily
                        }
                        fill={selectedTheme?.primaryColor || el.properties.fill}
                        fontStyle={el.properties.fontStyle}
                        onDblClick={() =>
                          handleTextDoubleClick(
                            index,
                            `• ${el.text}`,
                            LEFT_PADDING + 20,
                            elY,
                            el.properties.fontSize
                          )
                        }
                      />
                    );
                  })}

                  {/* Image */}
                  <SlideImage
                    url={
                      slide.image_url ||
                      "https://via.placeholder.com/480x480?text=Slide+Image"
                    }
                    x={SLIDE_WIDTH - 520}
                    y={(SLIDE_HEIGHT - 420) / 2}
                    width={500}
                    height={420}
                  />
                </Layer>
              </Stage>

              {/* HTML Input for editing */}
              {editing && editing.slideIndex === index && (
                <input
                  value={inputValue}
                  autoFocus
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={handleEditCommit}
                  onKeyDown={(e) => e.key === "Enter" && handleEditCommit()}
                  style={{
                    position: "absolute",
                    top: editing.y,
                    left: editing.x,
                    fontSize: editing.fontSize,
                    border: "1px solid #333",
                    padding: "2px 6px",
                    background: "white",
                    zIndex: 100,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SlideEditor;
