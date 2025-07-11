// "use client";

// import React, { useEffect, useState } from "react";
// import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
// import useImage from "use-image";
// import { Box, TextField } from "@mui/material";
// import SlideImage from "./KonvaComponents/KonvaSlideImage";
// import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
// import { dummyData } from "./dummy";
// import { useSlideThemeContext } from "@/app/context/ThemeContext";
// import SlidePreviews from "./slidesPreview";
// import { useDispatch } from "react-redux";
// import { setSlides } from "../slice/slidesSlice";

// const SLIDE_WIDTH = 920;
// const SLIDE_HEIGHT = 430;
// const LEFT_PADDING = 40;
// const IMAGE_WIDTH = 500;
// const IMAGE_PADDING = 20;
// const textMaxWidth = SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING;

// interface EditingState {
//   slideIndex: number;
//   text: string;
//   x: number;
//   y: number;
//   fontSize: number;
// }

// const getRandomSlide = () => {
//   const titles = [
//     "5 Ways to Boost Productivity",
//     "Understanding AI in 2025",
//     "Why Design Thinking Works",
//     "Top Marketing Trends This Year",
//     "The Future of Remote Work",
//   ];

//   const bullets = [
//     "Keep tasks short and focused",
//     "Automate where possible",
//     "Use data to drive decisions",
//     "Stay aligned with team goals",
//     "Prioritize clarity over complexity",
//     "Break problems into smaller chunks",
//     "Embrace flexible tooling",
//     "Focus on outcomes, not outputs",
//     "Be user-first in every decision",
//   ];

//   const getRandomBullets = (count: number) =>
//     Array.from({ length: count }, () => {
//       const text = bullets[Math.floor(Math.random() * bullets.length)];
//       return {
//         element_type: "bullet_point",
//         text,
//         konva_component: "Konva.Text",
//         properties: {
//           fontSize: 18,
//           fontFamily: "Inter",
//           fill: "#444",
//           fontStyle: "normal",
//         },
//       };
//     });

//   return {
//     slide_id: `slide-${Date.now()}`,
//     slide_title: {
//       text: titles[Math.floor(Math.random() * titles.length)],
//       properties: {
//         fontSize: 24,
//         fontFamily: "Arial",
//         fill: "#000",
//         fontStyle: "normal",
//       },
//     },
//     elements: getRandomBullets(3),
//     image_url: "/images/create-presentation/new-slide-img.png",
//   };
// };

// const SlideEditor = ({ slides = [], stageRefs }: any) => {
//   const dispatch = useDispatch();
//   const { selectedTheme } = useSlideThemeContext();
//   const [bgImage] = useImage(selectedTheme?.image_url || "");
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [editing, setEditing] = useState<EditingState | null>(null);
//   const [inputValue, setInputValue] = useState("");
//   const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
//     null
//   );

//   const [useDummy] = useState(false);
//   useEffect(() => {
//     if (slides.length === 0 && useDummy) {
//       dispatch(setSlides(dummyData));
//     }
//   }, [dispatch, slides.length]);

//   const handleTextDoubleClick = (
//     slideIndex: number,
//     text: string,
//     x: number,
//     y: number,
//     fontSize: number
//   ) => {
//     setEditing({ slideIndex, text, x, y, fontSize });
//     setInputValue(text);
//   };

//   const handleEditCommit = () => {
//     if (!editing) return;

//     const { slideIndex, text: oldText } = editing;
//     const newText = inputValue;
//     const updated = structuredClone(slides);
//     const slide = updated[slideIndex];
//     if (!slide) return;

//     if (slide.slide_title.text === oldText) {
//       slide.slide_title.text = newText;
//     } else {
//       const matchIndex = slide.elements.findIndex(
//         (el: any) => `• ${el.text}` === oldText || el.text === oldText
//       );
//       if (matchIndex !== -1) {
//         slide.elements[matchIndex].text = newText.replace(/^\u2022\s*/, "");
//       }
//     }

//     dispatch(setSlides(updated));
//     setEditing(null);
//   };

//   const handleAddSlide = () => {
//     const newSlide = getRandomSlide();
//     const newSlides = [...slides, newSlide];
//     dispatch(setSlides(newSlides));
//     setSelectedIndex(newSlides.length - 1);
//   };

//   const handleDeleteSlide = (index: number) => {
//     const newSlides = [...slides];
//     newSlides.splice(index, 1);
//     dispatch(setSlides(newSlides));
//     if (selectedIndex >= newSlides.length) {
//       setSelectedIndex(Math.max(0, newSlides.length - 1));
//     }
//   };

//   const measureTextWidth = (
//     text: string,
//     fontSize: number,
//     fontFamily: string
//   ) => {
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     if (!context) return 200;
//     context.font = `${fontSize}px ${fontFamily}`;
//     return context.measureText(text).width + 16;
//   };

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Delete" && editing) {
//         const { slideIndex, text } = editing;
//         const updated = structuredClone(slides);
//         const slide = updated[slideIndex];

//         // Check if it's a title
//         if (slide.slide_title.text === text) {
//           slide.slide_title.text = "";
//         } else {
//           // Remove from elements
//           const idx = slide.elements.findIndex(
//             (el: any) => `• ${el.text}` === text || el.text === text
//           );
//           if (idx !== -1) {
//             slide.elements.splice(idx, 1);
//           }
//         }

//         dispatch(setSlides(updated));
//         setEditing(null);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [editing, slides, dispatch]);

//   return (
//     <main
//       style={{
//         flexGrow: 1,
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         style={{
//           flexGrow: 1,
//           overflowY: "auto",
//           padding: 16,
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           {slides.map(
//             (
//               slide: {
//                 slide_title: any;
//                 slide_id: React.Key | null | undefined;
//                 elements: any[];
//                 image_url: any;
//               },
//               index: number
//             ) => {
//               const title = slide.slide_title;
//               const titleProps = title.properties;
//               const titleY = 25;
//               const bulletGap = 10;
//               const bulletStartY = titleY + titleProps.fontSize + 20;

//               return (
//                 <Box
//                   key={slide.slide_id}
//                   sx={{
//                     width: `${SLIDE_WIDTH}px`,
//                     height: `${SLIDE_HEIGHT}px`,
//                     border: "1px solid #ccc",
//                     backgroundColor: "#fff",
//                     position: "relative",
//                     mb: 1,
//                     display: index === selectedIndex ? "block" : "none",
//                   }}
//                 >
//                   <Stage
//                     width={SLIDE_WIDTH}
//                     height={SLIDE_HEIGHT}
//                     ref={(ref: any) => {
//                       stageRefs.current[index] =
//                         ref?.getStage()?.content?.querySelector("canvas") ||
//                         null;
//                     }}
//                     onMouseDown={(e) => {
//                       const clickedOnEmpty =
//                         e.target === e.target.getStage() ||
//                         e.target.name() === "background";
//                       if (clickedOnEmpty) {
//                         setSelectedImageIndex(null);
//                       }
//                     }}
//                   >
//                     <Layer>
//                       {selectedTheme?.image_url && bgImage ? (
//                         <KonvaImage
//                           image={bgImage}
//                           x={0}
//                           y={0}
//                           width={SLIDE_WIDTH}
//                           height={SLIDE_HEIGHT}
//                         />
//                       ) : (
//                         <Rect
//                           name="background"
//                           x={0}
//                           y={0}
//                           width={SLIDE_WIDTH}
//                           height={SLIDE_HEIGHT}
//                           fill={selectedTheme?.backgroundColor || "#fff"}
//                         />
//                       )}

//                       <KonvaTextEditor
//                         id={`title-${slide.slide_id}`}
//                         text={title.text}
//                         x={LEFT_PADDING}
//                         y={titleY}
//                         width={textMaxWidth}
//                         wrap="word"
//                         fontSize={titleProps.fontSize}
//                         fontFamily={
//                           selectedTheme?.font || titleProps.fontFamily
//                         }
//                         fill={selectedTheme?.primaryColor || titleProps.fill}
//                         fontStyle={titleProps.fontStyle}
//                         onClick={() =>
//                           handleTextDoubleClick(
//                             index,
//                             title.text,
//                             LEFT_PADDING,
//                             titleY,
//                             titleProps.fontSize
//                           )
//                         }
//                       />

//                       {(() => {
//                         let currentY = bulletStartY + 70;

//                         return slide.elements.map((el: any, i: number) => {
//                           const isBullet = el.element_type === "bullet_point";
//                           const fontSize = el.properties.fontSize;
//                           const fontFamily =
//                             selectedTheme?.font || el.properties.fontFamily;
//                           const lineHeight = 1.2;
//                           const bulletText = isBullet
//                             ? `• ${el.text}`
//                             : el.text;

//                           // Estimate wrapped height
//                           const textWidth = textMaxWidth - (isBullet ? 20 : 0);
//                           const canvas = document.createElement("canvas");
//                           const context = canvas.getContext("2d");
//                           context!.font = `${fontSize}px ${fontFamily}`;
//                           const words = bulletText.split(" ");
//                           let lines = [];
//                           let line = "";

//                           for (let word of words) {
//                             const testLine = line + word + " ";
//                             const metrics = context!.measureText(testLine);
//                             if (metrics.width > textWidth && line !== "") {
//                               lines.push(line.trim());
//                               line = word + " ";
//                             } else {
//                               line = testLine;
//                             }
//                           }
//                           if (line) lines.push(line.trim());

//                           const height = lines.length * fontSize * lineHeight;

//                           const editor = (
//                             <KonvaTextEditor
//                               key={`el-${i}`}
//                               id={`el-${i}`}
//                               text={bulletText}
//                               x={LEFT_PADDING + (isBullet ? 20 : 0)}
//                               y={currentY}
//                               width={textWidth}
//                               wrap="word"
//                               fontSize={fontSize}
//                               fontFamily={fontFamily}
//                               fill={
//                                 selectedTheme?.primaryColor ||
//                                 el.properties.fill
//                               }
//                               fontStyle={el.properties.fontStyle}
//                               onClick={() =>
//                                 handleTextDoubleClick(
//                                   index,
//                                   bulletText,
//                                   LEFT_PADDING + (isBullet ? 20 : 0),
//                                   currentY,
//                                   fontSize
//                                 )
//                               }
//                             />
//                           );

//                           currentY += height + bulletGap;
//                           return editor;
//                         });
//                       })()}

//                       <SlideImage
//                         url={
//                           slide.image_url ||
//                           "https://via.placeholder.com/480x480?text=Slide+Image"
//                         }
//                         x={SLIDE_WIDTH - 520}
//                         y={(SLIDE_HEIGHT - 420) / 2}
//                         width={500}
//                         height={420}
//                         isSelected={selectedImageIndex === index}
//                         onSelect={() => setSelectedImageIndex(index)}
//                       />
//                     </Layer>
//                   </Stage>
//                   {editing && editing.slideIndex === index && (
//                     <textarea
//                       autoFocus
//                       value={inputValue}
//                       onChange={(e) => setInputValue(e.target.value)}
//                       onBlur={handleEditCommit}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" && !e.shiftKey) {
//                           e.preventDefault(); // prevent newline
//                           handleEditCommit();
//                         }
//                       }}
//                       style={{
//                         position: "absolute",
//                         top: `${editing.y}px`,
//                         left: `${editing.x}px`,
//                         fontSize: `${editing.fontSize}px`,
//                         fontFamily: selectedTheme?.font || "Arial",
//                         color: selectedTheme?.primaryColor || "#000",
//                         background: "white",
//                         border: "1px solid #ccc",
//                         borderRadius: "4px",
//                         padding: "4px 8px",
//                         resize: "none",
//                         lineHeight: 1.2,
//                         width:
//                           measureTextWidth(
//                             inputValue,
//                             editing.fontSize,
//                             selectedTheme?.font || "Arial"
//                           ) + "px",
//                         zIndex: 600,
//                         overflow: "hidden",
//                       }}
//                     />
//                   )}
//                 </Box>
//               );
//             }
//           )}

//           <SlidePreviews
//             slides={slides}
//             selectedIndex={selectedIndex}
//             slide_width={SLIDE_WIDTH}
//             onSelect={setSelectedIndex}
//             onAddSlide={handleAddSlide}
//             onDeleteSlide={handleDeleteSlide}
//           />
//         </Box>
//       </div>
//     </main>
//   );
// };

// export default SlideEditor;

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
  const { selectedTheme } = useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const [useDummy] = useState(false);

  useEffect(() => {
    if (slides.length === 0 && useDummy) {
      dispatch(setSlides(dummyData));
    }
  }, [dispatch, slides.length]);

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
                    <KonvaTextEditor
                      id={`title-${index}`}
                      text={title.text}
                      x={LEFT_PADDING}
                      y={titleY}
                      width={textMaxWidth}
                      wrap="word"
                      fontSize={titleProps.fontSize}
                      fontFamily={selectedTheme?.font || titleProps.fontFamily}
                      fill={selectedTheme?.primaryColor || titleProps.fill}
                      fontStyle={titleProps.fontStyle}
                      isSelected={selectedTextId === `title-${index}`}
                      onSelect={() => {
                        setSelectedTextId(`title-${index}`);
                        setSelectedImageIndex(null);
                      }}
                    />

                    {/* Slide Bullets */}
                    {(() => {
                      let currentY = bulletStartY + 70;

                      return slide.elements.map((el: any, i: number) => {
                        const isBullet = el.element_type === "bullet_point";
                        const fontSize = el.properties.fontSize;
                        const fontFamily =
                          selectedTheme?.font || el.properties.fontFamily;
                        const lineHeight = 1.2;
                        const bulletText = isBullet ? `• ${el.text}` : el.text;

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
                              selectedTheme?.primaryColor || el.properties.fill
                            }
                            fontStyle={el.properties.fontStyle}
                            isSelected={selectedTextId === `el-${index}-${i}`}
                            onSelect={() => {
                              setSelectedTextId(`el-${index}-${i}`);
                              setSelectedImageIndex(null);
                            }}
                          />
                        );

                        currentY += height + bulletGap;
                        return editor;
                      });
                    })()}

                    <SlideImage
                      url={
                        slide.image_url ||
                        "https://via.placeholder.com/480x480?text=Slide+Image"
                      }
                      x={SLIDE_WIDTH - 480}
                      y={(SLIDE_HEIGHT - 400) / 2}
                      width={480}
                      height={400}
                      isSelected={selectedImageIndex === index}
                      onSelect={() => setSelectedImageIndex(index)}
                    />
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
