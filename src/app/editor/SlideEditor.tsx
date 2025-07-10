"use client";

import React, { useState } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Box, TextField } from "@mui/material";
import SlideImage from "./KonvaComponents/KonvaSlideImage";
import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
import { dummyData } from "./dummy";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import SlidePreviews from "./slidesPreview";

const SLIDE_WIDTH = 920;
const SLIDE_HEIGHT = 430;
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

const getRandomSlide = () => {
  const titles = [
    "5 Ways to Boost Productivity",
    "Understanding AI in 2025",
    "Why Design Thinking Works",
    "Top Marketing Trends This Year",
    "The Future of Remote Work",
  ];

  const bullets = [
    "Keep tasks short and focused",
    "Automate where possible",
    "Use data to drive decisions",
    "Stay aligned with team goals",
    "Prioritize clarity over complexity",
    "Break problems into smaller chunks",
    "Embrace flexible tooling",
    "Focus on outcomes, not outputs",
    "Be user-first in every decision",
  ];

  const getRandomBullets = (count: number) =>
    Array.from({ length: count }, () => {
      const text = bullets[Math.floor(Math.random() * bullets.length)];
      return {
        element_type: "bullet_point",
        text,
        konva_component: "Konva.Text",
        properties: {
          fontSize: 18,
          fontFamily: "Inter",
          fill: "#444",
          fontStyle: "normal",
        },
      };
    });

  return {
    slide_id: `slide-${Date.now()}`,
    slide_title: {
      text: titles[Math.floor(Math.random() * titles.length)],
      properties: {
        fontSize: 24,
        fontFamily: "Arial",
        fill: "#000",
        fontStyle: "normal",
      },
    },
    elements: getRandomBullets(3),
    image_url: "/images/create-presentation/new-slide-img.png",
  };
};

const SlideEditor = ({ slides = [], setSlides, stageRefs }: any) => {
  const { selectedTheme } = useSlideThemeContext();
  // const [bgImage] = useImage(selectedTheme?.image_url || "", "anonymous");
  const [bgImage] = useImage(selectedTheme?.image_url || "");
  console.log(
    "selectedTheme.image_url:",
    selectedTheme?.image_url?.slice(0, 100)
  );
  const [useDummy] = useState(true);
  const [currentSlides, updateSlides] = useState<any[]>(
    useDummy ? dummyData : slides
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
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
    if (!editing) return;

    const { slideIndex, text: oldText } = editing;
    const newText = inputValue;

    // ✅ Deep clone to break immutability
    const updated = structuredClone(currentSlides);
    const slide = updated[slideIndex];
    if (!slide) return;

    if (slide.slide_title.text === oldText) {
      slide.slide_title.text = newText;
    } else {
      const matchIndex = slide.elements.findIndex(
        (el: any) => `• ${el.text}` === oldText
      );
      if (matchIndex !== -1) {
        slide.elements[matchIndex].text = newText.replace(/^\u2022\s*/, "");
      }
    }

    updateSlides(updated);
    if (!useDummy && setSlides) setSlides(updated);
    setEditing(null);
  };

  const handleAddSlide = () => {
    // const newSlide = {
    //   slide_id: `slide-${Date.now()}`,
    //   slide_title: {
    //     text: "New Slide Title",
    //     properties: {
    //       fontSize: 24,
    //       fontFamily: "Arial",
    //       fill: "#000",
    //       fontStyle: "normal",
    //     },
    //   },
    //   elements: [
    //     {
    //       element_type: "bullet_point",
    //       text: "Bullet 1",
    //       konva_component: "Konva.Text",
    //       properties: {
    //         fontSize: 18,
    //         fontFamily: "Inter",
    //         fill: "#444",
    //         fontStyle: "normal",
    //       },
    //     },
    //     {
    //       element_type: "bullet_point",
    //       text: "Bullet 2",
    //       konva_component: "Konva.Text",
    //       properties: {
    //         fontSize: 18,
    //         fontFamily: "Inter",
    //         fill: "#444",
    //         fontStyle: "normal",
    //       },
    //     },
    //     {
    //       element_type: "bullet_point",
    //       text: "Bullet 3",
    //       konva_component: "Konva.Text",
    //       properties: {
    //         fontSize: 18,
    //         fontFamily: "Inter",
    //         fill: "#444",
    //         fontStyle: "normal",
    //       },
    //     },
    //   ],
    //   image_url: "/images/create-presentation/new-slide-img.png",
    // };
    const newSlide = getRandomSlide();
    const newSlides = [...currentSlides, newSlide];
    updateSlides(newSlides);
    setSelectedIndex(newSlides.length - 1);
    if (!useDummy && setSlides) setSlides(newSlides);
  };

  const measureTextWidth = (
    text: string,
    fontSize: number,
    fontFamily: string
  ) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return 200;
    context.font = `${fontSize}px ${fontFamily}`;
    return context.measureText(text).width + 16;
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {currentSlides.map((slide, index) => {
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
              mb: 1,
              display: index === selectedIndex ? "block" : "none",
            }}
          >
            <Stage
              width={SLIDE_WIDTH}
              height={SLIDE_HEIGHT}
              ref={(ref: any) => {
                stageRefs.current[index] =
                  ref?.getStage()?.content?.querySelector("canvas") || null;
              }}
            >
              <Layer>
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
                  onClick={() =>
                    handleTextDoubleClick(
                      index,
                      title.text,
                      LEFT_PADDING,
                      titleY,
                      titleProps.fontSize
                    )
                  }
                />

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
                      onClick={() =>
                        handleTextDoubleClick(
                          index,
                          `• ${el.text}`,
                          LEFT_PADDING + 20,
                          elY + 70,
                          el.properties.fontSize
                        )
                      }
                    />
                  );
                })}

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

            {editing && editing.slideIndex === index && (
              <TextField
                multiline
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleEditCommit}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleEditCommit()
                }
                minRows={1}
                variant="outlined"
                sx={{
                  position: "absolute",
                  top: editing.y,
                  left: editing.x,
                  fontSize: editing.fontSize,
                  borderRadius: 1,
                  fontFamily: selectedTheme?.font || "Arial",
                  width: measureTextWidth(
                    inputValue,
                    editing.fontSize,
                    selectedTheme?.font || "Arial"
                  ),
                  zIndex: 600,
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": {
                    padding: "4px 8px",
                  },
                  "& textarea": {
                    lineHeight: 1.2,
                    padding: 0,
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: editing.fontSize,
                    fontFamily: selectedTheme?.font || "Arial",
                  },
                }}
              />
            )}
          </Box>
        );
      })}

      <SlidePreviews
        slides={currentSlides}
        selectedIndex={selectedIndex}
        slide_width={SLIDE_WIDTH}
        onSelect={setSelectedIndex}
        onAddSlide={handleAddSlide}
        onDeleteSlide={(index) => {
          const newSlides = [...currentSlides];
          newSlides.splice(index, 1);
          updateSlides(newSlides);
          if (!useDummy && setSlides) setSlides(newSlides);
          if (selectedIndex >= newSlides.length) {
            setSelectedIndex(Math.max(0, newSlides.length - 1));
          }
        }}
      />
    </Box>
  );
};

export default SlideEditor;
