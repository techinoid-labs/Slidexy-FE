"use client";

import React, { useState, useEffect } from "react";
import { Box, Divider, IconButton, Select, MenuItem, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { useSlides } from "@/app/context/SlidesContext";
import { useSlideThemeContext } from "@/app/context/ThemeContext";

const fontOptions = ["Raleway", "Roboto", "Arial"];
const weightOptions = [
  { label: "Regular", value: "normal" },
  { label: "Semibold", value: "600" },
  { label: "Bold", value: "bold" },
];

interface TextSettingsPanelProps {
  sidebarHeight?: string | number;
  resetAll?: () => void;
}

const TextSettingsPanelMobile: React.FC<TextSettingsPanelProps> = ({
  sidebarHeight = "100vh",
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

  const [currentFontSize, setCurrentFontSize] = useState(textObj?.properties?.fontSize ?? 24);
  const [currentFontFamily, setCurrentFontFamily] = useState(textObj?.properties?.fontFamily ?? "Roboto");
  const [currentFontWeight, setCurrentFontWeight] = useState(textObj?.properties?.fontWeight ?? "normal");
  const [currentAlign, setCurrentAlign] = useState(textObj?.properties?.align ?? "left");

  useEffect(() => {
    if (textObj) {
      setCurrentFontSize(textObj.properties?.fontSize ?? 24);
      setCurrentFontFamily(textObj.properties?.fontFamily ?? "Roboto");
      setCurrentFontWeight(textObj.properties?.fontWeight ?? "normal");
      setCurrentAlign(textObj.properties?.align ?? "left");
    }
  }, [textObj, selectedTextId]);

  const updateTextProperty = (prop: string, value: any) => {
    if (!textObj || slideIndex === -1) return;
    const updatedSlides = structuredClone(slides);
    const target = selectedTextId?.startsWith("title")
      ? updatedSlides[slideIndex].slide_title.properties
      : elementIndex !== null
      ? updatedSlides[slideIndex].elements[elementIndex].properties
      : null;
    if (target) {
      target[prop] = value;
      setSlides(updatedSlides);
      if (prop === "fontSize") setCurrentFontSize(value);
      if (prop === "fontFamily") setCurrentFontFamily(value);
      if (prop === "fontWeight") setCurrentFontWeight(value);
      if (prop === "align") setCurrentAlign(value);
    }
  };

  if (!textObj) return null;

  return (
    <Box
      className="w-[410px] min-w-[350px] md:min-w-[410px] bg-white flex flex-col overflow-y-auto border-r border-gray-200"
      sx={{ height: sidebarHeight }}
    >
      {/* Tabs */}
      <Box sx={{ display: "flex", alignItems: "center", px: 2, pt: 2, pb: 1 }}>
        {/* <Box
          sx={{
            bgcolor: "#F5F5F5",
            color: "#222",
            fontWeight: 600,
            borderRadius: 2,
            px: 2.5,
            py: 1,
            fontSize: 15,
            mr: 2,
          }}
        >
          Settings
        </Box>
        <Box
          sx={{
            color: "#888",
            fontWeight: 500,
            fontSize: 15,
            mr: 2,
            py: 1,
            cursor: "pointer",
          }}
        >
          Animate
        </Box> */}
        {/* <Box sx={{ flex: 1 }} />
        <Select
          value={50}
          size="small"
          sx={{
            fontSize: 15,
            bgcolor: "#F5F5F5",
            borderRadius: 2,
            width: 70,
            height: 32,
          }}
          displayEmpty
          inputProps={{ "aria-label": "Percentage" }}
        >
          <MenuItem value={50}>50%</MenuItem>
          <MenuItem value={75}>75%</MenuItem>
          <MenuItem value={100}>100%</MenuItem>
        </Select>
      </Box> *?/}

      {/* <Divider sx={{ my: 2 }} /> */}

      {/* Text Settings */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
            Text
          </Typography>
          <IconButton size="small">
            <SettingsIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          {/* Bold Icon */}
          <IconButton
            size="small"
            onClick={() => updateTextProperty("fontWeight", currentFontWeight === "bold" ? "normal" : "bold")}
            sx={{ p: 0.5 }}
          >
            <FormatAlignLeftIcon /> {/* Placeholder for Bold icon */}
          </IconButton>
          {/* Italic Icon */}
          <IconButton
            size="small"
            onClick={() => updateTextProperty("fontStyle", currentFontStyle === "italic" ? "normal" : "italic")}
            sx={{ p: 0.5 }}
          >
            <FormatAlignCenterIcon /> {/* Placeholder for Italic icon */}
          </IconButton>
          {/* Font Family Dropdown */}
          <Select
            value={currentFontFamily}
            onChange={(e) => updateTextProperty("fontFamily", e.target.value)}
            size="small"
            sx={{ height: 36, width: 120, fontSize: 14 }}
          >
            {fontOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
          {/* Font Size Dropdown */}
          <Select
            value={currentFontSize}
            onChange={(e) => updateTextProperty("fontSize", Number(e.target.value))}
            size="small"
            sx={{ height: 36, width: 80, fontSize: 14 }}
          >
            {[16, 18, 20, 24, 28, 32, 36].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
          {/* Align Left Icon */}
          <IconButton
            size="small"
            onClick={() => updateTextProperty("align", "left")}
            sx={{ p: 0.5 }}
          >
            <FormatAlignLeftIcon />
          </IconButton>
          {/* Align Center Icon */}
          <IconButton
            size="small"
            onClick={() => updateTextProperty("align", "center")}
            sx={{ p: 0.5 }}
          >
            <FormatAlignCenterIcon />
          </IconButton>
          {/* Align Right Icon */}
          <IconButton
            size="small"
            onClick={() => updateTextProperty("align", "right")}
            sx={{ p: 0.5 }}
          >
            <FormatAlignRightIcon />
          </IconButton>
          {/* Align Justify Icon */}
          <IconButton
            size="small"
            onClick={() => updateTextProperty("align", "justify")}
            sx={{ p: 0.5 }}
          >
            <FormatAlignJustifyIcon />
          </IconButton>
        </Box>
      </Box>
</Box>
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default TextSettingsPanelMobile;