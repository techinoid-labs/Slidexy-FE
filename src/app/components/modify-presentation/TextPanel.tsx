"use client";

import React from "react";
import {
  Box,
  Divider,
  MenuItem,
  Select,
  Typography,
  IconButton,
  Slider,
  InputBase,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VerticalAlignCenterIcon from "@mui/icons-material/VerticalAlignCenter";
import { useSlides } from "@/app/context/SlidesContext";

<link
  href="https://fonts.googleapis.com/css2?family=Raleway&display=swap"
  rel="stylesheet"
/>;

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

const TextSettingsPanel: React.FC<TextSettingsPanelProps> = ({
  sidebarHeight = "100vh",
}) => {
  const { slides, selectedTextId, setSlides } = useSlides();

  const parsed = selectedTextId
    ? selectedTextId.match(/(?:title|el)-(\d+)(?:-(\d+))?/)
    : null;
  const slideIndex = parsed ? parseInt(parsed[1], 10) : -1;
  const elementIndex = parsed?.[2] ? parseInt(parsed[2], 10) : null;

  let textObj: any = null;
  if (slideIndex !== -1 && slides[slideIndex]) {
    if (selectedTextId?.startsWith("title")) {
      textObj = slides[slideIndex].slide_title;
    } else if (
      elementIndex !== null &&
      slides[slideIndex].elements[elementIndex]
    ) {
      textObj = slides[slideIndex].elements[elementIndex];
    }
  }

  const updateTextProperty = (prop: string, value: any) => {
    if (slideIndex === -1 || !textObj) return;
    const updatedSlides = structuredClone(slides);
    const updateProps = (props: any) => {
      props[prop] = value;
    };
    if (selectedTextId?.startsWith("title")) {
      updateProps(updatedSlides[slideIndex].slide_title.properties);
    } else if (elementIndex !== null) {
      updateProps(updatedSlides[slideIndex].elements[elementIndex].properties);
    }
    setSlides(updatedSlides);
  };

  const updateTextContent = (value: string) => {
    if (slideIndex === -1 || !textObj) return;
    const updatedSlides = structuredClone(slides);
    if (selectedTextId?.startsWith("title")) {
      updatedSlides[slideIndex].slide_title.text = value;
    } else if (elementIndex !== null) {
      updatedSlides[slideIndex].elements[elementIndex].text = value;
    }
    setSlides(updatedSlides);
  };

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

  return (
    <Box className="w-[410px] min-w-[350px] md:min-w-[410px] bg-white flex flex-col overflow-y-auto border-r border-gray-200">
      {/* Tabs */}
      <Box sx={{ display: "flex", alignItems: "center", px: 2, pt: 2, pb: 1 }}>
        <Box
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
        </Box>
        <Box sx={{ flex: 1 }} />
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
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Text */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
            Text
          </Typography>
          <IconButton size="small">
            <SettingsIcon />
          </IconButton>
        </Box>

        <InputBase
          value={textObj.text ?? ""}
          onChange={(e) => updateTextContent(e.target.value)}
          fullWidth
          sx={{
            mb: 1,
            borderRadius: 2,
            bgcolor: "#F8F8FA",
            fontWeight: 500,
            fontSize: 15,
            height: 44,
            px: 2,
          }}
        />

        <Select
          value={fontFamily}
          onChange={(e) => updateTextProperty("fontFamily", e.target.value)}
          fullWidth
          size="small"
          sx={{
            mb: 1,
            borderRadius: 2,
            bgcolor: "#F8F8FA",
            fontWeight: 500,
            fontSize: 15,
            height: 44,
          }}
        >
          {fontOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>

        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Select
            value={fontSize}
            onChange={(e) =>
              updateTextProperty("fontSize", Number(e.target.value))
            }
            size="small"
            sx={{
              borderRadius: 2,
              bgcolor: "#F8F8FA",
              fontWeight: 500,
              fontSize: 15,
              width: 80,
              height: 44,
            }}
          >
            {[16, 18, 20, 24, 28, 32, 36].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={fontWeight}
            onChange={(e) => updateTextProperty("fontWeight", e.target.value)}
            size="small"
            sx={{
              borderRadius: 2,
              bgcolor: "#F8F8FA",
              fontWeight: 500,
              fontSize: 15,
              width: 120,
              height: 44,
            }}
          >
            {weightOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box className="flex flex-wrap gap-x-2 gap-y-2 mb-2">
          {[
            { icon: <FormatAlignLeftIcon />, value: "left" },
            { icon: <FormatAlignCenterIcon />, value: "center" },
            { icon: <FormatAlignRightIcon />, value: "right" },
            { icon: <FormatAlignJustifyIcon />, value: "justify" },
          ].map(({ icon, value }) => (
            <IconButton
              key={value}
              onClick={() => updateTextProperty("align", value)}
              className={`rounded-md w-11 h-11 ${
                align === value ? "bg-gray-300" : "bg-[#F8F8FA]"
              }`}
            >
              {icon}
            </IconButton>
          ))}
          <Box className="flex gap-1 bg-[#F8F8FA] rounded-md px-1 ml-2">
            {[
              { icon: <VerticalAlignTopIcon />, value: "top" },
              { icon: <VerticalAlignCenterIcon />, value: "middle" },
              { icon: <VerticalAlignBottomIcon />, value: "bottom" },
            ].map(({ icon, value }) => (
              <IconButton
                key={value}
                onClick={() => updateTextProperty("verticalAlign", value)}
                className={`w-9 h-9 rounded-md ${
                  verticalAlign === value ? "bg-gray-300" : "bg-transparent"
                }`}
              >
                {icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Color */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1 }}>
          Color
        </Typography>
        <Box className="w-12 h-12 rounded-full">
          <input
            type="color"
            value={fill}
            className="w-12 h-12 rounded-full"
            onChange={(e) => updateTextProperty("fill", e.target.value)}
          />
          <Typography sx={{ fontSize: 14 }}>{fill.toUpperCase()}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Effects */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
            Effects
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Slider
            value={Math.round(opacity * 100)}
            onChange={(_, v) => updateTextProperty("opacity", Number(v) / 100)}
            sx={{ color: "#7B4AE2", flex: 1 }}
          />
          <InputBase
            value={`${Math.round(opacity * 100)}%`}
            readOnly
            sx={{
              width: 54,
              fontWeight: 600,
              fontSize: 16,
              bgcolor: "#F8F8FA",
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              textAlign: "center",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TextSettingsPanel;
