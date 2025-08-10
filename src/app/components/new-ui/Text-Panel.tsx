"use client";

import React, { useState, useEffect } from "react";
import { Box, IconButton, Select, MenuItem, Typography } from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import { useSlides } from "@/app/context/SlidesContext";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import FontPanel from "./Font-Panel";
import ColorPanelMobile from "./Color-Panel";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import { v4 as uuidv4 } from "uuid";
import OpacityPanel from "./Opacity-Panel";
import FontSizePanel from "./Font-Size";
const fontOptions = [
  "Raleway",
  "Roboto",
  "Arial",
  "Oswald",
  "Playfair Display",
  "Roboto Serif",
  "Arial Rounded",
  "Times New Roman",
  "Helvetica",
  "Open Sans",
  "Montserrat",
  "Bebas Neue",
  "Lobster",
  "Courier New",
  "Consolas",
  "Menlo",
];
const weightOptions = [
  { label: "Regular", value: "normal" },
  { label: "Semibold", value: "600" },
  { label: "Bold", value: "bold" },
];

interface TextSettingsPanelProps {
  onClose?: () => void;
  style?: React.CSSProperties;
  resetAll?: () => void;
}

const TextSettingsPanelMobile: React.FC<TextSettingsPanelProps> = ({
  onClose,
  style,
}) => {
  const {
    slides,
    selectedTextId,
    selectedShapeIndex,
    selectedSlideIndex,
    setSlides,
    bringElementForward,
    sendElementBackward,
  } = useSlides();
  const { setPrimaryColor } = useSlideThemeContext();
  const parsed = selectedTextId
    ? selectedTextId.match(/(?:title|el)-(\d+)(?:-(\d+))?/)
    : null;

  const slideIndex = parsed ? parseInt(parsed[1], 10) : selectedSlideIndex;
  const elementIndex = parsed?.[2]
    ? parseInt(parsed[2], 10)
    : selectedShapeIndex !== null
    ? selectedShapeIndex
    : null;

  let textObj: any = null;
  if (slideIndex !== -1 && slides[slideIndex]) {
    if (selectedTextId?.startsWith("title")) {
      textObj = slides[slideIndex].slide_title;
    } else if (elementIndex !== null) {
      textObj = slides[slideIndex].elements[elementIndex];
    }
  }

  if (!textObj) return null;

  const rawProps = textObj.properties || {};

  const fontSize = rawProps.fontSize ?? 24;
  const fontFamily = fontOptions.includes(rawProps.fontFamily)
    ? rawProps.fontFamily
    : "Roboto";
  const fill = rawProps.fill ?? "#000000";
  const fontWeight = weightOptions.some((w) => w.value === rawProps.fontWeight)
    ? rawProps.fontWeight
    : "normal";
  const align = rawProps.align ?? "left";
  const opacity = rawProps.opacity ?? 1;
  const verticalAlign = rawProps.verticalAlign ?? "top";
  const originalX = rawProps.x ?? 0;
  const originalY = rawProps.y ?? 0;

  const updateTextProperty = (prop: string, value: any) => {
    if (!textObj || slideIndex === -1) return;
    const updatedSlides = structuredClone(slides);
    const target: any = selectedTextId?.startsWith("title")
      ? updatedSlides[slideIndex].slide_title.properties
      : elementIndex !== null
      ? updatedSlides[slideIndex].elements[elementIndex].properties
      : null;

    if (target) {
      target[prop] = value;
      if (prop === "align") {
        target.align = value;
        if (!target.width || target.width < 50) {
          target.width = 220;
        }
      }
    }
    setSlides(updatedSlides);
  };
  const setTextFillAndDisableTheme = (color: string) => {
    const updatedSlides = structuredClone(slides);
    const el = selectedTextId?.startsWith("title")
      ? updatedSlides[slideIndex].slide_title
      : elementIndex !== null
      ? updatedSlides[slideIndex].elements[elementIndex]
      : null;

    if (!el) return;
    el.properties.fill = color;
    el.useThemeColor = false;

    setSlides(updatedSlides);
  };

  const toggleBulletPoint = () => {
    if (!textObj || slideIndex === -1) return;
    const bulletPrefix = "• ";
    const updatedSlides = structuredClone(slides);
    let target = selectedTextId?.startsWith("title")
      ? updatedSlides[slideIndex].slide_title
      : elementIndex !== null
      ? updatedSlides[slideIndex].elements[elementIndex]
      : null;

    if (!target) return;

    const lines = (target.text || "").split("\n").map((line) => line.trim());
    let newText = "";

    if (!lines.join("").trim()) {
      newText = "• [Click to edit]";
    } else if (lines.every((line) => line.startsWith(bulletPrefix))) {
      newText = lines
        .map((line) => line.substring(bulletPrefix.length).trim())
        .join("\n");
    } else {
      newText = lines.map((line) => bulletPrefix + line).join("\n");
    }

    target.text = newText;
    if (target.properties) {
      target.properties.x = originalX;
      target.properties.y = originalY;
    }
    setSlides(updatedSlides);
  };

  const unbulletText = () => {
    if (!textObj || slideIndex === -1) return;
    const bulletPrefix = "• ";
    const updatedSlides = structuredClone(slides);
    let target = selectedTextId?.startsWith("title")
      ? updatedSlides[slideIndex].slide_title
      : elementIndex !== null
      ? updatedSlides[slideIndex].elements[elementIndex]
      : null;

    if (!target) return;

    const lines = (target.text || "").split("\n").map((line) => line.trim());
    let newText = lines.join("\n");

    if (lines.some((line) => line.startsWith(bulletPrefix))) {
      newText = lines
        .map((line) =>
          line.startsWith(bulletPrefix)
            ? line.substring(bulletPrefix.length).trim()
            : line
        )
        .join("\n");
    }

    target.text = newText;
    if (target.properties) {
      target.properties.x = originalX;
      target.properties.y = originalY;
    }
    setSlides(updatedSlides);
  };

  const [isBulleted, setIsBulleted] = useState(false);
  const [fontPanelOpen, setFontPanelOpen] = useState(false);
  const [isColorPanelOpen, setIsColorPanelOpen] = useState(false);
  const [isOpacityPanelOpen, setIsOpacityPanelOpen] = useState(false);
  const [isFontSizePanelOpen, setIsFontSizePanelOpen] = useState(false);
  const handleToggle = () => {
    if (isBulleted) {
      unbulletText();
    } else {
      toggleBulletPoint();
    }
    setIsBulleted(!isBulleted);
  };

  const handleFontSelect = (font: string) => {
    updateTextProperty("fontFamily", font);
    setFontPanelOpen(false);
  };
  const [currentAlign, setCurrentAlign] = useState(align);
  const cycleAlignment = () => {
    const alignOrder = ["left", "center", "right"];
    const nextIndex =
      (alignOrder.indexOf(currentAlign) + 1) % alignOrder.length;
    const nextAlign = alignOrder[nextIndex];
    setCurrentAlign(nextAlign);
    updateTextProperty("align", nextAlign);
  };
  const [isBold, setIsBold] = useState(fontWeight === "bold");
  const toggleBold = () => {
    const newWeight = isBold ? "normal" : "bold";
    updateTextProperty("fontWeight", newWeight);
    setIsBold(!isBold);
  };
  const [isItalic, setIsItalic] = useState(rawProps.fontWeight === "italic");
  const toggleItalic = () => {
    const newStyle = isItalic ? "normal" : "italic";
    updateTextProperty("fontWeight", newStyle);
    setIsItalic(!isItalic);
  };
 const handleDuplicateText = () => {
  if (!textObj || slideIndex === -1) {
    return;
  }

  const updatedSlides = structuredClone(slides);
  const currentSlide = updatedSlides[slideIndex];
  if (!currentSlide) {
    return;
  }

  if (selectedTextId?.startsWith("title")) {
    const titleElement = currentSlide.slide_title;
    
    const newTextElement = {
      konva_component: "Konva.Text",
      element_type: "text",
      text: titleElement.text,
      properties: {
        ...structuredClone(titleElement.properties),
        x: (titleElement.properties?.x || 0) + 20,
        y: (titleElement.properties?.y || 0) + 20,
      },
      useThemeColor: titleElement.useThemeColor || false,
    };
    
    currentSlide.elements.push(newTextElement);
    
  } else if (elementIndex !== null) {
    const originalElement = currentSlide.elements[elementIndex];
    
    const newElement = {
      ...structuredClone(originalElement),
      properties: {
        ...structuredClone(originalElement.properties),
        x: (originalElement.properties?.x || 0) + 20,
        y: (originalElement.properties?.y || 0) + 20,
      },
    };
    
    currentSlide.elements.splice(elementIndex + 1, 0, newElement);
  }

  setSlides(updatedSlides);
};

  const handleDeleteText = () => {
    if (slideIndex === -1) return;
    const updatedSlides = structuredClone(slides);

    if (selectedTextId?.startsWith("title")) {
      updatedSlides[slideIndex].slide_title = {
        konva_component: "Konva.Text",
        text: "",
        properties: {
          fontSize: 14,
          fontWeight: "normal",
          fontFamily: "Roboto",
          fill: "#444",
          fontStyle: "normal",
          align: "left",
          x: 0,
          y: 25,
          width: 220,
          height: 0,
          radius: 0,
          numPoints: 0,
          innerRadius: 0,
          outerRadius: 0,
        },
      };
    } else if (elementIndex !== null) {
      updatedSlides[slideIndex].elements.splice(elementIndex, 1);
    }

    setSlides(updatedSlides);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: 60,
        bgcolor: "#fff",
        borderTop: "1px solid #E0E0E0",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        py: 1.2,
        overflow: "auto",
        zIndex: 3,
        boxSizing: "border-box",
        position: "fixed",
        bottom: 83,
        paddingLeft: { xs: 19, sm: 10, md: 10, lg: 10 },
        paddingRight: 3,
        alignContent: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={handleDuplicateText}
          sx={{
            color: "#222",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/duplicate-icon.svg"
            alt="duplicate"
            style={{ width: 15, height: 15 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 0.5,
          }}
        >
          Duplicate
        </Typography>
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={() => setFontPanelOpen(!fontPanelOpen)}
          sx={{
            color: "#222",
            backgroundColor: "#F6F6F6",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/type-face.svg"
            alt="font style"
            style={{ width: 15, height: 15 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 5,
          }}
        >
          TypeFace
        </Typography>
      </Box>
      {fontPanelOpen && (
        <FontPanel
          selectedFont={fontFamily}
          onFontChange={(font) => {
            updateTextProperty("fontFamily", font);
          }}
          onApply={() => setFontPanelOpen(false)}
          onClose={() => setFontPanelOpen(false)}
        />
      )}

      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={() => setIsFontSizePanelOpen(!isFontSizePanelOpen)}
          sx={{
            color: "#222",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/font-size.svg"
            alt="font style"
            style={{ width: 12, height: 12 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 5,
          }}
        >
          Size
        </Typography>
      </Box>
      {isFontSizePanelOpen && (
        <FontSizePanel
          fontSize={fontSize}
          onFontSizeChange={(fontSize) =>
            updateTextProperty("fontSize", Number(fontSize))
          }
          onClose={() => setIsFontSizePanelOpen(false)}
        />
      )}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={toggleBold}
          sx={{
            color: isBold ? "#000" : "#555",
            backgroundColor: isBold ? "#E0E0E0" : "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            fontWeight: "1px",
            mb: 0.2,
          }}
          title={isBold ? "Remove Bold" : "Bold"}
        >
          <FormatBoldIcon sx={{ fontSize: 19 }} />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 5,
          }}
        >
          Bold
        </Typography>
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={toggleItalic}
          sx={{
            color: isItalic ? "#000" : "#555",
            backgroundColor: isItalic ? "#E0E0E0" : "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            fontWeight: "1px",
            mb: 0.2,
          }}
          title={isItalic ? "Remove Italic" : "Italic"}
        >
          <FormatItalicIcon sx={{ fontSize: 19, fontWeight: "10px" }} />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 5,
          }}
        >
          <i>Italic</i>
        </Typography>
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={cycleAlignment}
          sx={{
            color: "#222",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
          title={`Align ${
            currentAlign.charAt(0).toUpperCase() + currentAlign.slice(1)
          }`}
        >
          {currentAlign === "left" && (
            <FormatAlignLeftIcon sx={{ fontSize: 18 }} />
          )}
          {currentAlign === "center" && (
            <FormatAlignCenterIcon sx={{ fontSize: 18 }} />
          )}
          {currentAlign === "right" && (
            <FormatAlignRightIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 5,
          }}
        >
          Align
        </Typography>
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={handleToggle}
          sx={{
            color: "#222",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
          title={isBulleted ? "Remove Bullet Points" : "Add Bullet Points"}
        >
          <FormatListBulletedIcon sx={{ fontSize: 19 }} />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 5,
          }}
        >
          Bullet
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => setIsColorPanelOpen(!isColorPanelOpen)}
          sx={{
            color: "#222",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/color-icon.svg"
            alt="color picker"
            style={{ width: 14, height: 14 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 0.5,
          }}
        >
          Color
        </Typography>
      </Box>
      {isColorPanelOpen && (
        <ColorPanelMobile
          color={fill}
          onColorChange={(newColor) => {
            updateTextProperty("fill", newColor);
            setTextFillAndDisableTheme(newColor);
          }}
          onClose={() => setIsColorPanelOpen(false)}
        />
      )}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={() => setIsOpacityPanelOpen(!isOpacityPanelOpen)}
          sx={{
            color: "#222",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/opacity-icon.svg"
            alt="opacity"
            style={{ width: 15, height: 15 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 5,
          }}
        >
          Opacity
        </Typography>
      </Box>
      {isOpacityPanelOpen && (
        <OpacityPanel
          opacity={opacity}
          onOpacityChange={(newOpacity) =>
            updateTextProperty("opacity", newOpacity)
          }
          onClose={() => setIsOpacityPanelOpen(false)}
        />
      )}
      {/* Duplicate Button */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={handleDuplicateText}
          sx={{
            color: "#222",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/duplicate-icon.svg"
            alt="duplicate"
            style={{ width: 15, height: 15 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 0.5,
          }}
        >
          Duplicate
        </Typography>
      </Box>

      {/* Delete Button */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={handleDeleteText}
          sx={{
            color: "#C00",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/delete-icon.svg"
            alt="delete"
            style={{ width: 15, height: 15 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 0.5,
          }}
        >
          Delete
        </Typography>
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={() =>
            bringElementForward(selectedTextId || selectedShapeIndex)
          }
          sx={{
            color: "#C00",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/forward.svg"
            alt="delete"
            style={{ width: 15, height: 15 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 0.5,
          }}
        >
          Forward
        </Typography>
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={() =>
            sendElementBackward(selectedTextId || selectedShapeIndex)
          }
          sx={{
            color: "#C00",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/backward.svg"
            alt="delete"
            style={{ width: 15, height: 15 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 0.5,
          }}
        >
          Backward
        </Typography>
      </Box>
    </Box>
  );
};

export default TextSettingsPanelMobile;
