"use client";

import React from "react";
import { useTheme, useMediaQuery, Button } from "@mui/material";
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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useSlides } from "@/app/context/SlidesContext";
import { useSlideThemeContext } from "@/app/context/ThemeContext";

const fontOptions = ["Raleway", "Roboto", "Arial"];

const weightOptions = [
  { label: "Regular", value: "normal" },
  { label: "Italic", value: "italic" },
  { label: "Bold", value: "bold" },
];

interface TextSettingsPanelProps {
  sidebarHeight?: string | number;
  resetAll?: () => void;
}

const TextSettingsPanel: React.FC<TextSettingsPanelProps> = ({
  sidebarHeight = "100vh",
}) => {
  // Hard guard: never render on mobile
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  if (isMobile) return null;

  const {
    slides,
    selectedTextId,
    selectedShapeIndex,
    selectedSlideIndex,
    bringElementForward,
    sendElementBackward,
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

  const updateTextProperty = (prop: string, value: any) => {
    if (!textObj || slideIndex === -1) return;
    const updatedSlides = structuredClone(slides);
    const target: any = selectedTextId?.startsWith("title")
      ? updatedSlides[slideIndex].slide_title.properties
      : elementIndex !== null
      ? updatedSlides[slideIndex].elements[elementIndex].properties
      : null;
    if (target) target[prop] = value;
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

  return (
    <Box className="w-[360px] min-w-[320px] md:min-w-[320px] bg-white flex flex-col overflow-y-auto border-r border-gray-200">
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
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Text */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
            Text
          </Typography>
          {/* <IconButton size="small">
            <SettingsIcon />
          </IconButton> */}
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
            FormatAlignLeftIcon,
            FormatAlignCenterIcon,
            FormatAlignRightIcon,
            FormatAlignJustifyIcon,
          ].map((Icon, i) => {
            const value = ["left", "center", "right", "justify"][i];
            return (
              <IconButton
                key={value}
                onClick={() => updateTextProperty("align", value)}
                className={`rounded-md w-11 h-11 ${
                  align === value ? "bg-gray-300" : "bg-[#F8F8FA]"
                }`}
              >
                <Icon />
              </IconButton>
            );
          })}
          {/* <Box className="flex gap-1 bg-[#F8F8FA] rounded-md px-1 ml-2">
            {[
              VerticalAlignTopIcon,
              VerticalAlignCenterIcon,
              VerticalAlignBottomIcon,
            ].map((Icon, i) => {
              const value = ["top", "middle", "bottom"][i];
              return (
                <IconButton
                  key={value}
                  onClick={() => updateTextProperty("verticalAlign", value)}
                  className={`w-9 h-9 rounded-md ${
                    verticalAlign === value ? "bg-gray-300" : "bg-transparent"
                  }`}
                >
                  <Icon />
                </IconButton>
              );
            })}
          </Box> */}
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
            onChange={(e) => {
              updateTextProperty("fill", e.target.value);
              setTextFillAndDisableTheme(e.target.value);
            }}
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
              width: 64,
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
      <Divider sx={{ my: 2 }} />

      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
            Layer Order
          </Typography>
        </Box>
        <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() =>
              bringElementForward(selectedTextId || selectedShapeIndex)
            }
            endIcon={<ArrowUpwardIcon />}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 12,
              bgcolor: "#F8F8FA",
              borderColor: "#E0E0E0",
              color: "#222",
              textTransform: "none",
              whiteSpace: "nowrap",
              minWidth: 140,
              "&:hover": {
                bgcolor: "#F3EDFF",
                borderColor: "#7B4AE2",
                color: "#7B4AE2",
              },
            }}
          >
            Bring Forward
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              sendElementBackward(selectedTextId || selectedShapeIndex)
            }
            endIcon={<ArrowDownwardIcon />}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 12,
              bgcolor: "#F8F8FA",
              borderColor: "#E0E0E0",
              color: "#222",
              textTransform: "none",
              whiteSpace: "nowrap",
              minWidth: 140,
              "&:hover": {
                bgcolor: "#F3EDFF",
                borderColor: "#7B4AE2",
                color: "#7B4AE2",
              },
            }}
          >
            Send Backward
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TextSettingsPanel;
