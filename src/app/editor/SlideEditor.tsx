"use client";

import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Box } from "@mui/material";
import SlideImage from "./KonvaComponents/KonvaSlideImage";
import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
import { dummyData } from "./dummy";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import SlidePreviews from "./slidesPreview";
import { useDispatch } from "react-redux";
import { setSlides } from "../slice/slidesSlice";
import KonvaShapeRenderer from "./KonvaComponents/KonvaShapesRenderer";
import { useSlides } from "../context/SlidesContext";

const SLIDE_WIDTH = 920;
const SLIDE_HEIGHT = 430;
const LEFT_PADDING = 40;
const IMAGE_WIDTH = 500;
const IMAGE_PADDING = 20;
const textMaxWidth = SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING;

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

const SlideEditor = ({ slides = [], stageRefs }: any) => {
  const dispatch = useDispatch();
  const {
    selectedImageIndex,
    setSelectedImageIndex,
    selectedImage,
    setSelectedImage,
  } = useSlides();
  const { selectedTheme } = useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(
    null
  );
  const [useDummy] = useState(false);

  // useEffect(() => {
  //   if (slides.length === 0 && useDummy) {
  //     dispatch(setSlides(dummyData));
  //   }
  // }, [dispatch, slides.length]);

  const handleAddSlide = () => {
    const newSlide = getRandomSlide();
    const newSlides = [...slides, newSlide];
    dispatch(setSlides(newSlides));
    setSelectedIndex(newSlides.length - 1);
  };

  const handleDeleteSlide = (index: number) => {
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    dispatch(setSlides(newSlides));
    if (selectedIndex >= newSlides.length) {
      setSelectedIndex(Math.max(0, newSlides.length - 1));
    }
  };

  useEffect(() => {
    if (!slides || slides.length === 0) return; // ⛔️ Skip if no slides

    const normalizedSlides = slides.map((slide: any) => {
      if (
        slide.image_url &&
        !slide.elements?.some(
          (el: any) =>
            el.element_type === "image" &&
            el.konva_component === "Konva.Image" &&
            el.properties.imageSrc === slide.image_url
        )
      ) {
        const defaultImageElement = {
          element_type: "image",
          konva_component: "Konva.Image",
          properties: {
            imageSrc: slide.image_url,
            x: SLIDE_WIDTH - 480,
            y: (SLIDE_HEIGHT - 400) / 2,
            width: 480,
            height: 400,
          },
        };
        return {
          ...slide,
          elements: [...(slide.elements || []), defaultImageElement],
          image_url: null,
        };
      }
      return slide;
    });

    if (JSON.stringify(slides) !== JSON.stringify(normalizedSlides)) {
      dispatch(setSlides(normalizedSlides));
    }
  }, [slides, dispatch]);

  return (
    <main
      style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        id="text-editor-layer"
        style={{ position: "absolute", top: 0, left: 0 }}
      ></div>

      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {slides.map((slide: any, index: number) => {
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
                  onMouseDown={(e) => {
                    const clickedOnEmpty =
                      e.target === e.target.getStage() ||
                      e.target.name() === "background";
                    if (clickedOnEmpty) {
                      setSelectedTextId(null);
                      setSelectedImageIndex(null);
                      setSelectedShapeIndex(null);
                      setSelectedImage(null);
                    }
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
                        name="background"
                        x={0}
                        y={0}
                        width={SLIDE_WIDTH}
                        height={SLIDE_HEIGHT}
                        fill={selectedTheme?.backgroundColor || "#fff"}
                      />
                    )}

                    {/* Slide Title */}
                    {title.text && (
                      <KonvaTextEditor
                        id={`title-${index}`}
                        text={title.text}
                        x={LEFT_PADDING}
                        y={titleY}
                        width={textMaxWidth}
                        wrap="word"
                        fontSize={titleProps.fontSize}
                        fontFamily={
                          selectedTheme?.font || titleProps.fontFamily
                        }
                        fill={selectedTheme?.primaryColor || titleProps.fill}
                        fontStyle={titleProps.fontStyle}
                        isSelected={selectedTextId === `title-${index}`}
                        onSelect={() => {
                          setSelectedTextId(`title-${index}`);
                          setSelectedImageIndex(null);
                          setSelectedShapeIndex(null);
                          setSelectedImage(null);
                        }}
                      />
                    )}
                    {/* Generic Text Elements */}
                    {slide.elements.map((el: any, i: number) => {
                      if (el.element_type !== "text") return null;

                      return (
                        <KonvaTextEditor
                          key={`el-${index}-${i}`}
                          id={`el-${index}-${i}`}
                          text={el.text}
                          x={el.properties.x || LEFT_PADDING}
                          y={el.properties.y || 300}
                          width={el.properties.width || textMaxWidth}
                          wrap="word"
                          fontSize={el.properties.fontSize}
                          fontFamily={
                            selectedTheme?.font || el.properties.fontFamily
                          }
                          fill={
                            selectedTheme?.primaryColor || el.properties.fill
                          }
                          fontStyle={el.properties.fontStyle}
                          // fontWeight={el.properties.fontWeight}
                          isSelected={selectedTextId === `el-${index}-${i}`}
                          onSelect={() => {
                            setSelectedTextId(`el-${index}-${i}`);
                            setSelectedImageIndex(null);
                            setSelectedShapeIndex(null);
                            setSelectedImage(null);
                          }}
                        />
                      );
                    })}

                    {/* Slide Bullets */}
                    {(() => {
                      let currentY = bulletStartY + 70;

                      return slide.elements
                        .filter((el: any) => el.element_type === "bullet_point")
                        .map((el: any, i: number) => {
                          const isBullet = el.element_type === "bullet_point";
                          const fontSize = el.properties.fontSize;
                          const fontFamily =
                            selectedTheme?.font || el.properties.fontFamily;
                          const lineHeight = 1.2;
                          const bulletText = isBullet
                            ? `• ${el.text}`
                            : el.text;

                          const textWidth = textMaxWidth - (isBullet ? 20 : 0);
                          const canvas = document.createElement("canvas");
                          const context = canvas.getContext("2d");
                          context!.font = `${fontSize}px ${fontFamily}`;
                          const words = bulletText.split(" ");
                          let lines = [];
                          let line = "";

                          for (let word of words) {
                            const testLine = line + word + " ";
                            const metrics = context!.measureText(testLine);
                            if (metrics.width > textWidth && line !== "") {
                              lines.push(line.trim());
                              line = word + " ";
                            } else {
                              line = testLine;
                            }
                          }
                          if (line) lines.push(line.trim());

                          const height = lines.length * fontSize * lineHeight;

                          const editor = (
                            <KonvaTextEditor
                              key={`el-${index}-${i}`}
                              id={`el-${index}-${i}`}
                              text={bulletText}
                              x={LEFT_PADDING + (isBullet ? 20 : 0)}
                              y={currentY}
                              width={textWidth}
                              wrap="word"
                              fontSize={fontSize}
                              fontFamily={fontFamily}
                              fill={
                                selectedTheme?.primaryColor ||
                                el.properties.fill
                              }
                              fontStyle={el.properties.fontStyle}
                              isSelected={selectedTextId === `el-${index}-${i}`}
                              onSelect={() => {
                                setSelectedTextId(`el-${index}-${i}`);
                                setSelectedImageIndex(null);
                                setSelectedShapeIndex(null);
                                setSelectedImage(null);
                              }}
                            />
                          );

                          currentY += height + bulletGap;
                          return editor;
                        });
                    })()}

                    {/* Shaped Render */}
                    <KonvaShapeRenderer
                      elements={slide.elements}
                      selectedShapeIndex={selectedShapeIndex}
                      onSelectShape={(i) => {
                        setSelectedShapeIndex(i);
                        setSelectedTextId(null);
                        setSelectedImageIndex(null);
                        setSelectedImage(null);
                      }}
                    />
                    {slide.elements.map((el: any, i: number) => {
                      if (
                        el.element_type === "image" &&
                        el.konva_component === "Konva.Image"
                      ) {
                        return (
                          <SlideImage
                            key={`image-${i}`}
                            imageSrc={el.properties.imageSrc}
                            x={el.properties.x}
                            y={el.properties.y}
                            flipHorizontal={el.properties.flipHorizontal} // ✅ add this
                            width={el.properties.width}
                            height={el.properties.height}
                            isSelected={selectedImageIndex === i}
                            onSelect={() => {
                              setSelectedImage({ ...el });
                              setSelectedImageIndex(i);
                            }}
                          />
                        );
                      }
                    })}
                  </Layer>
                </Stage>
              </Box>
            );
          })}

          <SlidePreviews
            slides={slides}
            selectedIndex={selectedIndex}
            slide_width={SLIDE_WIDTH}
            onSelect={setSelectedIndex}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
          />
        </Box>
      </div>
    </main>
  );
};

export default SlideEditor;
