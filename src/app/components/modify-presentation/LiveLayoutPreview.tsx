"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { HTMLSlideRenderer } from "../editor/HTMLSlideRenderer";
import { getSlideDimensions } from "../../../utils/slideUtils";
import { PANEL } from "./panelTheme";

interface LiveLayoutPreviewProps {
    variant: any;
    theme: any;
    isSelected?: boolean;
    onClick?: () => void;
    size?: { width: number; height: number };
    index?: number;
}

const LiveLayoutPreview: React.FC<LiveLayoutPreviewProps> = ({
    variant,
    theme,
    isSelected = false,
    onClick,
    size = { width: 240, height: 135 },
    index = 0,
}) => {
    const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();

    // Calculate scale based on the desired preview size vs actual slide size
    const scale = size.width / SLIDE_WIDTH;

    return (
        <Box
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (onClick && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onClick();
                }
            }}
            sx={{
                position: "relative",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
                bgcolor: PANEL.surfaceSunken,
                border: isSelected ? `2px solid ${PANEL.accent}` : `1px solid ${PANEL.border}`,
                boxShadow: isSelected
                    ? `0 4px 12px ${PANEL.accentBg}`
                    : "0 1px 3px rgba(0,0,0,0.05)",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: isSelected
                        ? `0 8px 16px ${PANEL.accentBgHover}`
                        : "0 4px 8px rgba(0,0,0,0.1)",
                    borderColor: isSelected ? PANEL.accent : PANEL.borderHover,
                },
                "&:focus-visible": {
                    outline: `2px solid ${PANEL.accent}`,
                    outlineOffset: "2px",
                },
            }}
        >
            <Box
                sx={{
                    width: size.width,
                    height: size.height,
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: variant.background?.color || theme?.backgroundColor || "#ffffff",
                }}
            >
                <Box
                    sx={{
                        width: SLIDE_WIDTH,
                        height: SLIDE_HEIGHT,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                        pointerEvents: "none", // Prevent interaction inside the preview
                        userSelect: "none",
                    }}
                >
                    <HTMLSlideRenderer
                        slide={variant}
                        theme={theme}
                        isEditing={false}
                    />
                </Box>
            </Box>
            <Box sx={{
                px: 1.5,
                py: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: isSelected ? PANEL.accentBg : "transparent"
            }}>
                <Typography
                    sx={{
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? PANEL.accentSoft : PANEL.textMuted,
                        fontSize: 12,
                    }}
                >
                    {variant.name || `Layout ${index + 1}`}
                </Typography>
                {isSelected && (
                    <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: PANEL.accent
                    }} />
                )}
            </Box>
        </Box>
    );
};

export default LiveLayoutPreview;
