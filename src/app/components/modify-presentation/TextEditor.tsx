"use client";

import React, { forwardRef, useState } from "react";
import { Box, Button, Typography, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import { useSlides } from "@/app/context/SlidesContext";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import {
  PANEL,
  panelContainerSx,
  panelHeaderSx,
  panelTitleSx,
  panelCloseButtonSx,
} from "./panelTheme";

interface TextEditorProps {
  sidebarHeight?: string | number;
  onClose?: () => void;
}

const FONT_OPTIONS = ["Raleway", "Roboto", "Poppins", "Lato", "Montserrat"];
const DEFAULT_COLORS = ["#E5E7EB", "#6C63FF", "#F59E0B", "#34D399"];

const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>(
  ({ sidebarHeight = "100vh", onClose }, ref) => {
    const { addText } = useSlides();
    const { selectedTheme } = useSlideThemeContext();

    const [font, setFont] = useState(FONT_OPTIONS[0]);
    const swatchColors = selectedTheme?.artPalette?.length
      ? Array.from(new Set([selectedTheme.artPalette[0], selectedTheme.artPalette[1], "#E5E7EB", "#111827"]))
      : DEFAULT_COLORS;
    const [color, setColor] = useState(swatchColors[0]);

    const handleAddTextElement = (
      text: string,
      fontSize: number,
      fontWeight: number
    ) => {
      addText({
        text,
        fontSize,
        fontWeight: fontWeight.toString(),
        fill: color,
        fontFamily: font,
        x: 200,
        y: 300,
      });

      if (onClose) onClose();
    };

    return (
      <Box
        ref={ref}
        component={motion.div}
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -24, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        sx={panelContainerSx(300, sidebarHeight)}
      >
        {/* Header */}
        <Box sx={panelHeaderSx}>
          <Typography sx={panelTitleSx}>Text</Typography>
          <IconButton size="small" onClick={onClose} sx={panelCloseButtonSx}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Font family picker */}
        <Box sx={{ px: 3, pt: 2.25 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 12.5, color: PANEL.textMuted, mb: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Font
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {FONT_OPTIONS.map((f) => (
              <Box
                key={f}
                component="button"
                type="button"
                onClick={() => setFont(f)}
                sx={{
                  fontFamily: f,
                  fontSize: 13,
                  fontWeight: 500,
                  color: font === f ? PANEL.accentSoft : PANEL.textMuted,
                  bgcolor: font === f ? PANEL.accentBg : PANEL.surfaceSunken,
                  border: `1px solid ${font === f ? PANEL.accentBorder : PANEL.border}`,
                  borderRadius: "999px",
                  px: 1.5,
                  py: 0.6,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": { borderColor: PANEL.accentBorder, color: PANEL.accentSoft },
                }}
              >
                {f}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Color swatches */}
        <Box sx={{ px: 3, pt: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 12.5, color: PANEL.textMuted, mb: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Color
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {swatchColors.map((c) => (
              <Tooltip key={c} title={c}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => setColor(c)}
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    bgcolor: c,
                    cursor: "pointer",
                    border: color === c ? `2px solid ${PANEL.accent}` : `1px solid ${PANEL.border}`,
                    boxShadow: color === c ? `0 0 0 2px ${PANEL.accentBg}` : "none",
                    transition: "transform 0.15s ease",
                    "&:hover": { transform: "scale(1.12)" },
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Add Text Box Button */}
        <Box sx={{ px: 3, pt: 2.5, mb: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{
              height: 44,
              fontSize: 14,
              color: PANEL.accentSoft,
              borderColor: PANEL.accentBorder,
              "&:hover": { borderColor: PANEL.accent, bgcolor: PANEL.accentBg },
            }}
            onClick={() => handleAddTextElement("New Text Box", 24, 600)}
          >
            Add Text Box
          </Button>
        </Box>

        {/* Text Variants */}
        <Box
          sx={{
            px: 3,
            mb: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
          }}
        >
          {[
            { label: "Add a Title", text: "Title Text", fontSize: 24, fontWeight: 700, height: 48, textFontSize: 32, textWeight: 700 },
            { label: "Add a Headline", text: "Headline Text", fontSize: 20, fontWeight: 600, height: 44, textFontSize: 26, textWeight: 600 },
            { label: "Add a Sub Headline", text: "Sub Headline Text", fontSize: 18, fontWeight: 500, height: 44, textFontSize: 20, textWeight: 500 },
            { label: "Add Body Text", text: "Body Text", fontSize: 16, fontWeight: 400, height: 44, textFontSize: 16, textWeight: 400 },
          ].map((v) => (
            <Button
              key={v.label}
              component={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              fullWidth
              sx={{
                bgcolor: PANEL.surfaceSunken,
                border: `1px solid ${PANEL.border}`,
                borderRadius: 3,
                height: v.height,
                fontFamily: font,
                fontWeight: v.textWeight,
                fontSize: v.fontSize,
                color: PANEL.text,
                textTransform: "none",
                justifyContent: "flex-start",
                px: 2.5,
                transition: "background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  bgcolor: PANEL.accentBg,
                  borderColor: PANEL.accentBorder,
                  boxShadow: `0 4px 14px -4px ${PANEL.accentBg}`,
                },
              }}
              onClick={() => handleAddTextElement(v.text, v.textFontSize, v.textWeight)}
            >
              {v.label}
            </Button>
          ))}
        </Box>
      </Box>
    );
  }
);

export default TextEditor;
