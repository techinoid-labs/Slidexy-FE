"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  IconButton,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { useSlides } from "@/app/context/SlidesContext";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { v4 as uuidv4 } from "uuid";
import { getSlideDimensions } from "@/utils/slideUtilsmobile";

const fontOptions = ["Raleway", "Roboto", "Arial", "Inter", "Playfair Display", "Montserrat", "Outfit"];
const weightOptions = [
  { label: "Regular", value: "normal" },
  { label: "Semibold", value: "600" },
  { label: "Bold", value: "bold" },
];

interface TextSettingsPanelProps {
  onClose: () => void;
  style: React.CSSProperties;
  resetAll?: () => void; // Optional if not always required
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
  } = useSlides();
  const { setPrimaryColor } = useSlideThemeContext();
  const parsed = selectedTextId
    ? selectedTextId.match(/(?:title|subtitle|quote|author|context|el)-(\d+)(?:-(\d+))?/)
    : null;

  const slideIndex = parsed ? parseInt(parsed[1], 10) : selectedSlideIndex;
  const elementIndex = parsed?.[2]
    ? parseInt(parsed[2], 10)
    : selectedShapeIndex !== null
      ? selectedShapeIndex
      : null;

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

    // ✅ FIX: Handle specialized IDs
    if (selectedTextId?.startsWith("title") || selectedTextId?.startsWith("quote")) {
      textObj = currentSlide.slide_title || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
      if (!textObj.text) textObj.text = currentSlide.quote || currentSlide.slide_title?.text || "";
    } else if (selectedTextId?.startsWith("subtitle") || selectedTextId?.startsWith("author")) {
      textObj = currentSlide.subtitle || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
      if (!textObj.text) textObj.text = currentSlide.author || currentSlide.subtitle?.text || "";
    } else if (selectedTextId?.startsWith("context")) {
      const existing = currentSlide.elements?.find((el: any) => el.element_type === 'context');
      textObj = existing || { properties: {}, konva_component: "Konva.Text", element_type: "text", text: currentSlide.context || "" };
    } else if (elementIndex !== null && currentSlide.elements?.[elementIndex]) {
      textObj = currentSlide.elements[elementIndex];
    }
  }

  if (!textObj) return null;

  const rawProps = textObj.properties || {};

  const fontSize = rawProps.fontSize ?? 24;
  const fontFamily = fontOptions.includes(rawProps.fontFamily)
    ? rawProps.fontFamily
    : "Raleway";
  const fill = rawProps.fill ?? "#000000";
  const fontWeight = weightOptions.some((w) => w.value === rawProps.fontWeight)
    ? rawProps.fontWeight
    : "normal";
  const align = rawProps.align ?? "left";
  const opacity = rawProps.opacity ?? 1;
  const verticalAlign = rawProps.verticalAlign ?? "top";
  const originalX = rawProps.x ?? 0; // Preserve original x position
  const originalY = rawProps.y ?? 0; // Preserve original y position

  const updateTextProperty = (prop: string, value: any) => {
    if (!textObj || slideIndex === -1) return;
    // console.log("[TextPanelMobile] updateTextProperty called:", { prop, value, selectedTextId, slideIndex });

    const isTitle = selectedTextId?.startsWith("title") || selectedTextId?.startsWith("quote");
    const isSubtitle = selectedTextId?.startsWith("subtitle") || selectedTextId?.startsWith("author");
    const isContext = selectedTextId?.startsWith("context");

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const target: any = isTitle
      ? originalSlide.slide_title
      : isSubtitle
        ? originalSlide.subtitle
        : isContext
          ? originalSlide.elements?.find((el: any) => el.element_type === 'context')
          : elementIndex !== null
            ? originalSlide.elements?.[elementIndex]
            : null;

    // console.log("[TextPanelMobile] Target found:", { target, isTitle: selectedTextId?.startsWith("title") });

    if (target) {
      target.properties = target.properties || {};
      target.properties[prop] = value;
      // console.log("[TextPanelMobile] Updated target:", target);

      // Alignment fix: adjust x when align changes
      if (prop === "align") {
        // Do not change x — just update the align property
        target.properties.align = value;

        // Ensure width exists to let Konva align correctly
        if (!target.properties.width || target.properties.width < 50) {
          target.properties.width = 220; // or any reasonable default
        }
      }
    } else if (isContext) {
      originalSlide.elements = originalSlide.elements || [];
      originalSlide.elements.push({
        element_type: 'context',
        text: originalSlide.context || "",
        properties: { [prop]: value, userAdded: true },
        konva_component: "Konva.Text"
      });
    }

    // Update current variant (if exists)
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        const variantTarget = isTitle
          ? variant.slide_title
          : isSubtitle
            ? variant.subtitle
            : isContext
              ? variant.elements?.find((el: any) => el.element_type === 'context')
              : elementIndex !== null
                ? variant.elements?.[elementIndex]
                : null;

        if (variantTarget) {
          variantTarget.properties = variantTarget.properties || {};
          variantTarget.properties[prop] = value;
        } else if (isContext) {
          variant.elements = variant.elements || [];
          variant.elements.push({
            element_type: 'context',
            text: variant.context || originalSlide.context || "",
            properties: { [prop]: value, userAdded: true },
            konva_component: "Konva.Text"
          });
        }
      }
    }

    // console.log("[TextPanelMobile] Dispatching updated slides:", updatedSlides[slideIndex]);
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

    // Handle empty text
    if (!lines.join("").trim()) {
      newText = "• [Click to edit]";
    } else if (lines.every((line) => line.startsWith(bulletPrefix))) {
      // Remove bullets from all lines
      newText = lines
        .map((line) => line.substring(bulletPrefix.length).trim())
        .join("\n");
    } else {
      // Add bullets to all lines
      newText = lines.map((line) => bulletPrefix + line).join("\n");
    }

    target.text = newText;
    // Explicitly preserve original position
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
    let newText = lines.join("\n"); // Default to original text

    if (lines.some((line) => line.startsWith(bulletPrefix))) {
      // Remove bullets from all lines
      newText = lines
        .map((line) =>
          line.startsWith(bulletPrefix)
            ? line.substring(bulletPrefix.length).trim()
            : line
        )
        .join("\n");
    }

    target.text = newText;
    // Explicitly preserve original position
    if (target.properties) {
      target.properties.x = originalX;
      target.properties.y = originalY;
    }
    setSlides(updatedSlides);
  };

  const updateTextContent = (value: string) => {
    if (!textObj || slideIndex === -1) return;
    const updatedSlides = structuredClone(slides);
    if (selectedTextId?.startsWith("title")) {
      updatedSlides[slideIndex].slide_title.text = value;
    } else if (elementIndex !== null) {
      updatedSlides[slideIndex].elements[elementIndex].text = value;
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

  const [isBulleted, setIsBulleted] = useState(false);

  const handleToggle = () => {
    if (isBulleted) {
      unbulletText();
    } else {
      toggleBulletPoint();
    }
    setIsBulleted(!isBulleted);
  };
  return (
    <Box
      sx={{
        ...style,
        position: "absolute",
        backgroundColor: "#1a1a1a",
        borderRadius: "5px",
        padding: "4px 4px",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        zIndex: 2,
        minWidth: "200px",
        minHeight: "10px",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "2px",
          width: "300px",
          height: "30px",
          alignItems: "center",
        }}
      >
        <Select
          value={fontFamily}
          onChange={(e) => updateTextProperty("fontFamily", e.target.value)}
          size="small"
          sx={{
            minWidth: 40,
            minHeight: 20,
            fontSize: 10,
            backgroundColor: "#F8F8FA",
          }}
          MenuProps={{
            PaperProps: { sx: { maxHeight: 200, zIndex: 2100 } },
            disableScrollLock: true,
          }}
        >
          {fontOptions.map((opt) => (
            <MenuItem key={opt} value={opt} sx={{ fontSize: 14 }}>
              {opt}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={fontSize}
          onChange={(e) =>
            updateTextProperty("fontSize", Number(e.target.value))
          }
          size="small"
          sx={{
            minWidth: 40,
            minHeight: 2,
            fontSize: 10,
            backgroundColor: "#F8F8FA",
          }}
          MenuProps={{
            PaperProps: { sx: { maxHeight: 200, zIndex: 2100 } },
            disableScrollLock: true,
          }}
        >
          {[16, 18, 20, 24, 28, 32, 36].map((size) => (
            <MenuItem key={size} value={size} sx={{ fontSize: 14 }}>
              {size}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={fontWeight}
          onChange={(e) => updateTextProperty("fontWeight", e.target.value)}
          size="small"
          sx={{
            minWidth: 30,
            fontSize: 10,
            minHeight: 20,
            backgroundColor: "#F8F8FA",
          }}
          MenuProps={{
            PaperProps: { sx: { maxHeight: 200, zIndex: 2100 } },
            disableScrollLock: true,
          }}
        >
          {weightOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 14 }}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        {[
          { Icon: FormatAlignLeftIcon, value: "left" },
          { Icon: FormatAlignCenterIcon, value: "center" },
          { Icon: FormatAlignRightIcon, value: "right" },
        ].map(({ Icon, value }) => (
          <Box
            component="button"
            key={value}
            onClick={() => updateTextProperty("align", value)}
            sx={{
              color: "#222",
              backgroundColor: "#F8F8FA",
              border: "none",
              fontSize: 18,
              padding: "4px 6px",
              cursor: "pointer",
              outline: "none",
              width: 27,
              height: 27,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title={`Align ${value.charAt(0).toUpperCase() + value.slice(1)}`}
          >
            <Icon fontSize="small" />
          </Box>
        ))}
        <Box
          component="button"
          onClick={handleToggle}
          sx={{
            color: "#222",
            backgroundColor: isBulleted ? "#ebe8e8ff" : "#ffffff", // visually pressed
            border: "1px solid transparent",
            fontSize: 18,
            padding: "2px 2px",
            cursor: "pointer",
            outline: "none",
            width: 27,
            height: 27,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 0,
          }}
          title={isBulleted ? "Remove Bullet Points" : "Add Bullet Points"}
        >
          <FormatListBulletedIcon fontSize="small" />
        </Box>
      </Box>
    </Box>
  );
};

export default TextSettingsPanelMobile;
