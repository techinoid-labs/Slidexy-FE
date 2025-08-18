"use client";

import React, { useState, useEffect } from "react";
import { useTheme, useMediaQuery, Box, Divider, Typography, Slider, InputBase, Button } from "@mui/material";
import { useSlides } from "@/app/context/SlidesContext";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import { ChromePicker } from "react-color";

interface ShapeSettingsPanelMobileProps {
    resetAll?: () => void;
    onClose: () => void;
    style?: React.CSSProperties;
}

const ShapeSettingsPanelMobile: React.FC<ShapeSettingsPanelMobileProps> = ({
    resetAll,
    onClose,
    style,
}) => {
    // Hard guard: only render on mobile
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    if (!isMobile) return null;

    const {
        slides,
        selectedShapeIndex,
        selectedSlideIndex,
        setSlides,
    } = useSlides();
    const { setPrimaryColor } = useSlideThemeContext();

    // Color picker state
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    // Extract shape object
    const parsed = selectedShapeIndex !== null ? `el-${selectedSlideIndex}-${selectedShapeIndex}` : null;
    const slideIndex = selectedSlideIndex;
    const elementIndex = selectedShapeIndex;

    let shapeObj: any = null;
    if (slideIndex !== -1 && slides[slideIndex] && elementIndex !== null) {
        shapeObj = slides[slideIndex].elements[elementIndex];
    }

    if (!shapeObj || shapeObj.element_type !== "shape") return null;

    const rawProps = shapeObj.properties || {};
    const fill = rawProps.fill ?? "#000000";
    const opacity = rawProps.opacity ?? 1;

    const updateShapeProperty = (prop: string, value: any) => {
        if (!shapeObj || slideIndex === -1 || elementIndex === null) return;
        const updatedSlides = structuredClone(slides);
        const target = updatedSlides[slideIndex].elements[elementIndex].properties;
        if (target) target[prop] = value;
        setSlides(updatedSlides);
    };

    const setShapeFillAndDisableTheme = (color: string) => {
        // Add proper null checks before using elementIndex as an array index
        if (slideIndex === -1 || elementIndex === null) return;
        
        const updatedSlides = structuredClone(slides);
        
        // Ensure the slide exists
        if (!updatedSlides[slideIndex] || !updatedSlides[slideIndex].elements) return;
        
        // Ensure the element exists at the specified index
        const el = updatedSlides[slideIndex].elements[elementIndex];
        if (!el) return;
        
        // Update properties
        if (!el.properties) {
            el.properties = {};
        }
        
        el.properties.fill = color;
        el.useThemeColor = false;
        setSlides(updatedSlides);
    };

    const handlePresetColorClick = (color: string) => {
        updateShapeProperty("fill", color);
        setShapeFillAndDisableTheme(color);
    };

    const handleCustomColorPick = (color: any) => {
        const newColor = color.hex;
        updateShapeProperty("fill", newColor);
        setShapeFillAndDisableTheme(newColor);
        setIsColorPickerOpen(false);
    };

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 0,
                left: "8%",
                width: window.innerWidth * 0.84,
                height: window.innerHeight * 0.6,
                bgcolor: "#fff",
                border: "1px solid #E0E0E0",
                zIndex: 10,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                padding: "24px",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                overflowY: "auto",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
                    Shape Settings
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Color Section */}
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
                        Color
                    </Typography>
                    <IconButton 
                        sx={{ color: "#000000" }} 
                        onClick={() => setIsColorPickerOpen(true)}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>

                {/* Current Color Display */}
                <Box 
                    sx={{ 
                        mb: 2, 
                        cursor: "pointer",
                        border: "1px solid #E0E0E0",
                        borderRadius: "8px",
                        p: 1.5,
                    }}
                    onClick={() => setIsColorPickerOpen(true)}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: fill,
                            borderRadius: "8px",
                            border: "2px solid #E0E0E0",
                            mb: 1
                        }}
                    />
                    <Typography sx={{ fontSize: 12, color: "#666" }}>
                        {fill.toUpperCase()}
                    </Typography>
                </Box>

                {/* Custom Color Picker */}
                {isColorPickerOpen && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: "#7B4AE2", mb: 1, display: "block" }}>
                            Custom Color
                        </Typography>
                        <Box
                            sx={{
                                border: "1px solid #E0E0E0",
                                borderRadius: "8px",
                                p: 2,
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            {/* Centered ChromePicker */}
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <ChromePicker
                                    color={fill}
                                    onChange={handleCustomColorPick}
                                    disableAlpha={true}
                                />
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>

            <Divider sx={{ my: 2, mt: 3 }} />

            {/* Effects */}
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
                        Effects
                    </Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: "#666", mb: 1 }}>
                    Opacity
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Slider
                        value={Math.round(opacity * 100)}
                        onChange={(_, v) => updateShapeProperty("opacity", Number(v) / 100)}
                        sx={{ color: "#7B4AE2", flex: 1 }}
                        min={0}
                        max={100}
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
        </Box>
    );
};

export default ShapeSettingsPanelMobile;