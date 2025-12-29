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
  // ✅ FIX: Parse selectedTextId to handle title, subtitle, and elements
  const parsed = selectedTextId
    ? selectedTextId.match(/(?:title|subtitle|el)-(\d+)(?:-(\d+))?/)
    : null;

  const slideIndex = parsed ? parseInt(parsed[1], 10) : selectedSlideIndex;
  const elementIndex = parsed?.[2] ? parseInt(parsed[2], 10) : null;

  // ✅ FIX: Get text object from current variant slide
  let textObj: any = null;
  if (slideIndex !== -1 && slides[slideIndex]) {
    const originalSlide = slides[slideIndex];

    const getCurrentVariantSlide = (slide: any) => {
      if (!slide.layouts || slide.layouts.length === 0) {
        return slide;
      }
      const variantIndex = slide.currentVariantIndex ?? 0;
      const variant = slide.layouts[variantIndex];
      return variant || slide;
    };

    const currentSlide = getCurrentVariantSlide(originalSlide);

    // ✅ FIX: Handle title, subtitle, and regular elements
    if (selectedTextId?.startsWith("title")) {
      textObj = currentSlide.slide_title;
    } else if (selectedTextId?.startsWith("subtitle")) {
      textObj = currentSlide.subtitle;
    } else if (elementIndex !== null && currentSlide.elements?.[elementIndex]) {
      textObj = currentSlide.elements[elementIndex];
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

  // ✅ FIX: Update text property in both original and variant
  const updateTextProperty = (prop: string, value: any) => {
    if (!textObj || slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title");
    const isSubtitle = selectedTextId?.startsWith("subtitle");

    // Update original slide
    if (isTitle) {
      originalSlide.slide_title = originalSlide.slide_title;
      originalSlide.slide_title.properties = originalSlide.slide_title.properties || {};
      originalSlide.slide_title.properties[prop] = value;
      if (prop === "align") originalSlide.slide_title.properties.width = Math.max(originalSlide.slide_title.properties.width || 0, 220);
    } else if (isSubtitle) {
      originalSlide.subtitle = originalSlide.subtitle || {};
      originalSlide.subtitle.properties = originalSlide.subtitle.properties || {};
      originalSlide.subtitle.properties[prop] = value;
    } else if (elementIndex !== null && elementIndex >= 0 && originalSlide.elements?.[elementIndex]) {
      const el = originalSlide.elements[elementIndex];
      el.properties = el.properties || {};
      el.properties[prop] = value;
      if (prop === "align") el.properties.width = Math.max(el.properties.width || 0, 220);
    }

    // Update current variant (if exists)
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        if (isTitle) {
          variant.slide_title = variant.slide_title;
          variant.slide_title.properties = variant.slide_title.properties || {};
          variant.slide_title.properties[prop] = value;
        } else if (isSubtitle) {
          variant.subtitle = variant.subtitle || {};
          variant.subtitle.properties = variant.subtitle.properties || {};
          variant.subtitle.properties[prop] = value;
        } else if (elementIndex !== null && elementIndex >= 0 && variant.elements?.[elementIndex]) {
          const variantEl = variant.elements[elementIndex];
          variantEl.properties = variantEl.properties || {};
          variantEl.properties[prop] = value;
        }
      }
    }

    setSlides(updatedSlides);
  };

  // ✅ FIX: Update color and disable theme color in both original and variant
  const setTextFillAndDisableTheme = (color: string) => {
    if (slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title");
    const isSubtitle = selectedTextId?.startsWith("subtitle");

    // Update original
    let el = isTitle
      ? originalSlide.slide_title
      : isSubtitle
        ? originalSlide.subtitle
        : (elementIndex !== null && elementIndex >= 0 ? originalSlide.elements?.[elementIndex] : null);

    if (el) {
      el.properties = el.properties || {};
      el.properties.fill = color;
      el.useThemeColor = false;
    }

    // Update current variant (if exists)
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        let variantEl = isTitle
          ? variant.slide_title
          : isSubtitle
            ? variant.subtitle
            : (elementIndex !== null && elementIndex >= 0 ? variant.elements?.[elementIndex] : null);

        if (variantEl) {
          variantEl.properties = variantEl.properties || {};
          variantEl.properties.fill = color;
          variantEl.useThemeColor = false;
        }
      }
    }

    setSlides(updatedSlides);
  };

  // ✅ FIX: Toggle bullet point in both original and variant
  const toggleBulletPoint = () => {
    if (!textObj || slideIndex === -1) return;
    const bulletPrefix = "• ";
    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title");
    const isSubtitle = selectedTextId?.startsWith("subtitle");

    const processText = (target: any) => {
      if (!target) return;
      const lines = (target.text || "").split("\n").map((line: string) => line.trim());
      let newText = "";
      if (!lines.join("").trim()) {
        newText = "• [Click to edit]";
      } else if (lines.every((line: string) => line.startsWith(bulletPrefix))) {
        newText = lines.map((line: string) => line.substring(bulletPrefix.length).trim()).join("\n");
      } else {
        newText = lines.map((line: string) => bulletPrefix + line).join("\n");
      }
      target.text = newText;
      if (target.properties) {
        target.properties.x = originalX;
        target.properties.y = originalY;
      }
    };

    // Update original
    const originalTarget = isTitle
      ? originalSlide.slide_title
      : isSubtitle
        ? originalSlide.subtitle
        : (elementIndex !== null && elementIndex >= 0 ? originalSlide.elements?.[elementIndex] : null);
    processText(originalTarget);

    // Update current variant
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        const variantTarget = isTitle
          ? variant.slide_title
          : isSubtitle
            ? variant.subtitle
            : (elementIndex !== null && elementIndex >= 0 ? variant.elements?.[elementIndex] : null);
        processText(variantTarget);
      }
    }

    setSlides(updatedSlides);
  };

  // ✅ FIX: Unbullet text in both original and variant
  const unbulletText = () => {
    if (!textObj || slideIndex === -1) return;
    const bulletPrefix = "• ";
    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title");
    const isSubtitle = selectedTextId?.startsWith("subtitle");

    const processTextStrip = (target: any) => {
      if (!target) return;
      const lines = (target.text || "").split("\n").map((line: string) => line.trim());
      let newText = lines.join("\n");
      if (lines.some((line: string) => line.startsWith(bulletPrefix))) {
        newText = lines
          .map((line: string) =>
            line.startsWith(bulletPrefix) ? line.substring(bulletPrefix.length).trim() : line
          )
          .join("\n");
      }
      target.text = newText;
      if (target.properties) {
        target.properties.x = originalX;
        target.properties.y = originalY;
      }
    };

    // Update original
    const originalTarget = isTitle
      ? originalSlide.slide_title
      : isSubtitle
        ? originalSlide.subtitle
        : (elementIndex !== null && elementIndex >= 0 ? originalSlide.elements?.[elementIndex] : null);
    processTextStrip(originalTarget);

    // Update current variant
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        const variantTarget = isTitle
          ? variant.slide_title
          : isSubtitle
            ? variant.subtitle
            : (elementIndex !== null && elementIndex >= 0 ? variant.elements?.[elementIndex] : null);
        processTextStrip(variantTarget);
      }
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
  // ✅ FIX: Duplicate text in both original and variant
  const handleDuplicateText = () => {
    if (!textObj || slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title");
    const isSubtitle = selectedTextId?.startsWith("subtitle");

    const originalElement = isTitle
      ? originalSlide.slide_title
      : isSubtitle
        ? originalSlide.subtitle
        : (elementIndex !== null && elementIndex >= 0 ? originalSlide.elements?.[elementIndex] : null);

    if (!originalElement) return;

    const newTextElement = {
      konva_component: "Konva.Text",
      element_type: "text",
      text: originalElement.text || "",
      properties: {
        ...structuredClone(originalElement.properties || {}),
        userAdded: true,
        x: (originalElement.properties?.x || 100) + 30,
        y: (originalElement.properties?.y || 100) + 30,
        width: originalElement.properties?.width || 300,
        fontSize: originalElement.properties?.fontSize || 24,
        fontFamily: originalElement.properties?.fontFamily || "Roboto",
        fill: originalElement.properties?.fill || "#000000",
        fontWeight: originalElement.properties?.fontWeight || "normal",
        align: originalElement.properties?.align || "left",
      },
      useThemeColor: originalElement.useThemeColor !== undefined ? originalElement.useThemeColor : false,
    };

    // Update original: Add to elements array
    originalSlide.elements = originalSlide.elements || [];
    const insertIndex = (isTitle || isSubtitle) ? 0 : (elementIndex! + 1);
    originalSlide.elements.splice(insertIndex, 0, newTextElement);

    // Update current variant (if exists)
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        variant.elements = variant.elements || [];
        variant.elements.splice(insertIndex, 0, structuredClone(newTextElement));
      }
    }

    setSlides(updatedSlides);

    // Select the new duplicated element
    const newId = `el-${slideIndex}-${insertIndex}`;
    // setSelectedTextId(newId); // Note: SlideEditorMobile might need to handle this via context
  };

  // ✅ FIX: Delete text in both original and variant
  const handleDeleteText = () => {
    if (slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title");
    const isSubtitle = selectedTextId?.startsWith("subtitle");

    // Update original
    if (isTitle) {
      originalSlide.slide_title = {
        konva_component: "Konva.Text",
        text: "",
        properties: {
          fontSize: 36,
          fontWeight: "700",
          fontFamily: "Raleway",
          fill: "#000",
          fontStyle: "normal",
          align: "center",
          x: 25,
          y: 40,
          width: 800,
          height: 0,
        },
        useThemeColor: true,
      };
    } else if (isSubtitle) {
      originalSlide.subtitle = undefined;
    } else if (elementIndex !== null && elementIndex >= 0 && originalSlide.elements) {
      originalSlide.elements.splice(elementIndex, 1);
    }

    // Update current variant (if exists)
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        if (isTitle) {
          variant.slide_title = structuredClone(originalSlide.slide_title);
        } else if (isSubtitle) {
          variant.subtitle = undefined;
        } else if (elementIndex !== null && elementIndex >= 0 && variant.elements) {
          variant.elements.splice(elementIndex, 1);
        }
      }
    }

    setSlides(updatedSlides);
    // setSelectedTextId(null); // Let the editor handle selection clear if needed
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
        paddingLeft: { xs: 30, sm: 10, md: 10, lg: 10 },
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
          title={`Align ${currentAlign.charAt(0).toUpperCase() + currentAlign.slice(1)
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
          onClick={() => {
            const elementId = selectedTextId || selectedShapeIndex;
            if (elementId !== null) {
              bringElementForward(elementId);
            }
          }}
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
            alt="forward"
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
          onClick={() => {
            const elementId = selectedTextId || selectedShapeIndex;
            if (elementId !== null) {
              sendElementBackward(elementId);
            }
          }}
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
            alt="backward"
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
