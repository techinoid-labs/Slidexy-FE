// "use client";

// import React, { useRef, useState } from "react";
// import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
// import useImage from "use-image";
// import { Box } from "@mui/material";
// import SlideImage from "./KonvaComponents/KonvaSlideImage";
// import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
// import { dummyData } from "./dummy";
// import { useSlideThemeContext } from "@/app/context/ThemeContext";

// const SLIDE_WIDTH = 920;
// const SLIDE_HEIGHT = 440;
// const SLIDE_GAP = 20;
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

// const SlideEditor = ({ slides = [] }: any) => {
//   const stageRefs = useRef<any[]>([]);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const { selectedTheme } = useSlideThemeContext();
//   const [bgImage] = useImage(selectedTheme?.image_url || "", "anonymous");

//   console.log(selectedTheme, bgImage);
//   const [editing, setEditing] = useState<EditingState | null>(null);
//   const [inputValue, setInputValue] = useState("");

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
//     setEditing(null);
//   };

//   return (
//     <Box>
//       <Box
//         id="konva-container"
//         ref={containerRef}
//         sx={{
//           width: "100%",
//           overflowY: "auto",
//           display: "flex",
//           flexDirection: "column",
//           gap: `${SLIDE_GAP}px`,
//           padding: 2,
//           backgroundColor: "#eee",
//           alignItems: "center",
//         }}
//       >
//         {dummyData.map((slide: any, index: number) => {
//           const title = slide.slide_title;
//           const titleProps = title.properties;
//           const titleY = 25;
//           const bulletGap = 10;
//           const bulletStartY = titleY + titleProps.fontSize + 20;

//           return (
//             <Box
//               key={slide.slide_id}
//               sx={{
//                 width: `${SLIDE_WIDTH}px`,
//                 height: `${SLIDE_HEIGHT}px`,
//                 border: "1px solid #ccc",
//                 backgroundColor: "#fff",
//                 position: "relative",
//               }}
//             >
//               <Stage
//                 width={SLIDE_WIDTH}
//                 height={SLIDE_HEIGHT}
//                 ref={(ref: any) => (stageRefs.current[index] = ref)}
//               >
//                 <Layer>
//                   {/* Theme Background */}
//                   {selectedTheme?.image_url && bgImage ? (
//                     <KonvaImage
//                       image={bgImage}
//                       x={0}
//                       y={0}
//                       width={SLIDE_WIDTH}
//                       height={SLIDE_HEIGHT}
//                     />
//                   ) : (
//                     <Rect
//                       x={0}
//                       y={0}
//                       width={SLIDE_WIDTH}
//                       height={SLIDE_HEIGHT}
//                       fill={selectedTheme?.backgroundColor || "#fff"}
//                     />
//                   )}

//                   {/* Title */}
//                   <KonvaTextEditor
//                     id={`title-${slide.slide_id}`}
//                     text={title.text}
//                     x={LEFT_PADDING}
//                     y={titleY}
//                     width={textMaxWidth}
//                     wrap="word"
//                     fontSize={titleProps.fontSize}
//                     fontFamily={selectedTheme?.font || titleProps.fontFamily}
//                     fill={selectedTheme?.primaryColor || titleProps.fill}
//                     fontStyle={titleProps.fontStyle}
//                     onDblClick={() =>
//                       handleTextDoubleClick(
//                         index,
//                         title.text,
//                         LEFT_PADDING,
//                         titleY,
//                         titleProps.fontSize
//                       )
//                     }
//                   />

//                   {/* Bullet Points */}
//                   {slide.elements.map((el: any, i: number) => {
//                     const elY =
//                       bulletStartY + i * (el.properties.fontSize + bulletGap);

//                     return (
//                       <KonvaTextEditor
//                         key={`el-${i}`}
//                         id={`el-${i}`}
//                         text={`• ${el.text}`}
//                         x={LEFT_PADDING + 20}
//                         y={elY + 70}
//                         width={textMaxWidth - 20}
//                         wrap="word"
//                         fontSize={el.properties.fontSize}
//                         fontFamily={
//                           selectedTheme?.font || el.properties.fontFamily
//                         }
//                         fill={selectedTheme?.primaryColor || el.properties.fill}
//                         fontStyle={el.properties.fontStyle}
//                         onDblClick={() =>
//                           handleTextDoubleClick(
//                             index,
//                             `• ${el.text}`,
//                             LEFT_PADDING + 20,
//                             elY,
//                             el.properties.fontSize
//                           )
//                         }
//                       />
//                     );
//                   })}

//                   {/* Image */}
//                   <SlideImage
//                     url={
//                       slide.image_url ||
//                       "https://via.placeholder.com/480x480?text=Slide+Image"
//                     }
//                     x={SLIDE_WIDTH - 520}
//                     y={(SLIDE_HEIGHT - 420) / 2}
//                     width={500}
//                     height={420}
//                   />
//                 </Layer>
//               </Stage>

//               {/* HTML Input for editing */}
//               {editing && editing.slideIndex === index && (
//                 <input
//                   value={inputValue}
//                   autoFocus
//                   onChange={(e) => setInputValue(e.target.value)}
//                   onBlur={handleEditCommit}
//                   onKeyDown={(e) => e.key === "Enter" && handleEditCommit()}
//                   style={{
//                     position: "absolute",
//                     top: editing.y,
//                     left: editing.x,
//                     fontSize: editing.fontSize,
//                     border: "1px solid #333",
//                     padding: "2px 6px",
//                     background: "white",
//                     zIndex: 100,
//                   }}
//                 />
//               )}
//             </Box>
//           );
//         })}
//       </Box>
//     </Box>
//   );
// };

// export default SlideEditor;

//CHECK TOMORROW For Slides preview and create new

"use client";

import React, { useRef, useState } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SlideImage from "./KonvaComponents/KonvaSlideImage";
import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
import { dummyData } from "./dummy";
import { useSlideThemeContext } from "@/app/context/ThemeContext";

const SLIDE_WIDTH = 920;
const SLIDE_HEIGHT = 440;
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

const SlideEditor = ({ slides = [], setSlides }: any) => {
  const stageRefs = useRef<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedTheme } = useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "", "anonymous");

  const [useDummy] = useState(false);
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
    setEditing(null);
  };

  const handleAddSlide = () => {
    const newSlide = {
      slide_id: `slide-${Date.now()}`,
      slide_title: {
        text: "New Slide Title",
        properties: {
          fontSize: 24,
          fontFamily: "Arial",
          fill: "#000",
          fontStyle: "normal",
        },
      },
      elements: [],
      image_url: "",
    };
    const newSlides = [...currentSlides, newSlide];
    updateSlides(newSlides);
    setSelectedIndex(newSlides.length - 1);
    if (!useDummy && setSlides) setSlides(newSlides);
  };

  const slide = currentSlides[selectedIndex];
  if (!slide) return null;

  const title = slide.slide_title;
  const titleProps = title.properties;
  const titleY = 25;
  const bulletGap = 10;
  const bulletStartY = titleY + titleProps.fontSize + 20;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
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
          ref={(ref: any) => (stageRefs.current[selectedIndex] = ref)}
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
              onDblClick={() =>
                handleTextDoubleClick(
                  selectedIndex,
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
                  fontFamily={selectedTheme?.font || el.properties.fontFamily}
                  fill={selectedTheme?.primaryColor || el.properties.fill}
                  fontStyle={el.properties.fontStyle}
                  onDblClick={() =>
                    handleTextDoubleClick(
                      selectedIndex,
                      `• ${el.text}`,
                      LEFT_PADDING + 20,
                      elY,
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

        {editing && editing.slideIndex === selectedIndex && (
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

      {/* Thumbnails */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: 1,
          px: 2,
          overflowX: "auto",
          width: "100%",
          backgroundColor: "#f5f5fa",
          borderRadius: 1,
          paddingY: 2,
        }}
      >
        {currentSlides.map((slide: any, index: number) => (
          <Box
            key={slide.slide_id}
            onClick={() => setSelectedIndex(index)}
            sx={{
              width: 200,
              height: 120,
              border:
                index === selectedIndex
                  ? "2px solid #6941c6"
                  : "1px solid #e5e5ef",
              borderRadius: 1,
              backgroundColor: index === selectedIndex ? "#f5f3ff" : "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              px: 2,
              py: 1.5,
              cursor: "pointer",
              boxShadow: index === selectedIndex ? "0 0 0 2px #e9d7fe" : "none",
              flex: "0 0 auto",
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} color="#6941c6">
              {String(index + 1).padStart(2, "0")}
            </Typography>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {slide.slide_title.text}
            </Typography>
            <Typography variant="caption" color="#667085">
              {slide.elements.length > 0
                ? slide.elements[0].text
                : "Add description"}
            </Typography>
          </Box>
        ))}

        <IconButton
          onClick={handleAddSlide}
          sx={{
            width: 120,
            height: 120,
            borderRadius: 1,
            border: "1px dashed #d0d5dd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            flex: "0 0 auto",
          }}
        >
          <AddIcon sx={{ fontSize: 32, color: "#667085" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SlideEditor;
