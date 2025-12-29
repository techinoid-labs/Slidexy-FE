"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { HTMLSlideRenderer } from "../editor/HTMLSlideRenderer";
import { getSlideDimensions } from "../../../utils/slideUtils";

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
            sx={{
                position: "relative",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
                bgcolor: "#fff",
                border: isSelected ? "2px solid #7B4AE2" : "1px solid #e5e7eb",
                boxShadow: isSelected
                    ? "0 4px 12px rgba(123,74,226,0.15)"
                    : "0 1px 3px rgba(0,0,0,0.05)",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: isSelected
                        ? "0 8px 16px rgba(123,74,226,0.2)"
                        : "0 4px 8px rgba(0,0,0,0.1)",
                    borderColor: isSelected ? "#7946e4" : "#d1d5db",
                },
            }}
            onClick={onClick}
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
                bgcolor: isSelected ? "rgba(123,74,226,0.02)" : "transparent"
            }}>
                <Typography
                    sx={{
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? "#7B4AE2" : "#4b5563",
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
                        bgcolor: "#7B4AE2"
                    }} />
                )}
            </Box>
        </Box>
    );
};

export default LiveLayoutPreview;
