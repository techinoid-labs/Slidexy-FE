"use client";

import React, { useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import { Box } from "@mui/material";
import SlideImage from "./KonvaComponents/KonvaSlideImage";
import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
import { dummyData } from "./dummy";

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

const SlideEditor = () => {
  const stageRefs = useRef<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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
        {dummyData.map((slide, index) => {
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
                  {/* Title */}
                  <KonvaTextEditor
                    id={`title-${slide.slide_id}`}
                    text={title.text}
                    x={LEFT_PADDING}
                    y={titleY}
                    width={textMaxWidth}
                    wrap="word"
                    fontSize={titleProps.fontSize}
                    fontFamily={titleProps.fontFamily}
                    fill={titleProps.fill}
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
                  {slide.elements.map((el, i) => {
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
                        fontFamily={el.properties.fontFamily}
                        fill={el.properties.fill}
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
