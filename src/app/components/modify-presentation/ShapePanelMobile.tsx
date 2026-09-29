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
        selectedShapeId,
        selectedShapeIndex,
        selectedSlideIndex,
        setSlides,
        setSelectedShapeId,
    } = useSlides();

    // Color picker state
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    const slideIndex = selectedSlideIndex;

    // ✅ FIX: Use shape_id to find shape reliably across variant slides
    let shapeObj: any = null;
    if (slideIndex !== -1 && slides[slideIndex] && selectedShapeId) {
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

        if (currentSlide.elements) {
            shapeObj = currentSlide.elements.find(
                (el: any) => el.shape_id === selectedShapeId
            );
        }

        if (!shapeObj && originalSlide.elements) {
            shapeObj = originalSlide.elements.find(
                (el: any) => el.shape_id === selectedShapeId
            );
        }
    }

    if (!shapeObj || shapeObj.element_type !== "shape") return null;

    const rawProps = shapeObj.properties || {};
    const fill = rawProps.fill ?? "#000000";
    const opacity = rawProps.opacity ?? 1;

    // ✅ FIX: Update shape property in both original and variant
    const updateShapeProperty = (prop: string, value: any) => {
        if (!shapeObj || slideIndex === -1 || !selectedShapeId) return;

        const updatedSlides = structuredClone(slides);
        const originalSlide = updatedSlides[slideIndex];

        if (originalSlide.layouts && originalSlide.layouts.length > 0) {
            const variantIndex = originalSlide.currentVariantIndex ?? 0;
            const variant = originalSlide.layouts[variantIndex];
            if (variant && variant.elements) {
                const variantShape = variant.elements.find(
                    (el: any) => el.shape_id === selectedShapeId
                );
                if (variantShape) {
                    if (!variantShape.properties) variantShape.properties = {};
                    variantShape.properties[prop] = value;
                }
            }
        }

        if (originalSlide.elements) {
            const originalShape = originalSlide.elements.find(
                (el: any) => el.shape_id === selectedShapeId
            );
            if (originalShape) {
                if (!originalShape.properties) originalShape.properties = {};
                originalShape.properties[prop] = value;
            }
        }

        setSlides(updatedSlides);
    };

    // ✅ FIX: Update color and disable theme color in both original and variant
    const setShapeFillAndDisableTheme = (color: string) => {
        if (slideIndex === -1 || !selectedShapeId) return;

        const updatedSlides = structuredClone(slides);
        const originalSlide = updatedSlides[slideIndex];

        if (!originalSlide) return;

        if (originalSlide.layouts && originalSlide.layouts.length > 0) {
            const variantIndex = originalSlide.currentVariantIndex ?? 0;
            const variant = originalSlide.layouts[variantIndex];

            if (variant && variant.elements) {
                const variantShape = variant.elements.find(
                    (el: any) => el.shape_id === selectedShapeId
                );
                if (variantShape) {
                    if (!variantShape.properties) {
                        variantShape.properties = {};
                    }
                    variantShape.properties.fill = color;
                    variantShape.properties.stroke = color;
                    variantShape.useThemeColor = false;
                }
            }
        }

        if (originalSlide.elements) {
            const originalShape = originalSlide.elements.find(
                (el: any) => el.shape_id === selectedShapeId
            );
            if (originalShape) {
                if (!originalShape.properties) {
                    originalShape.properties = {};
                }
                originalShape.properties.fill = color;
                originalShape.properties.stroke = color;
                originalShape.useThemeColor = false;
            }
        }

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

    // ✅ NEW: Duplicate shape properly
    const handleDuplicateShape = () => {
        if (!shapeObj || slideIndex === -1 || !selectedShapeId) return;

        const updatedSlides = structuredClone(slides);
        const originalSlide = updatedSlides[slideIndex];

        if (!originalSlide) return;

        // Create new shape element with proper structure and mark as userAdded
        const newShapeElement = {
            ...structuredClone(shapeObj),
            shape_id: `user-${Date.now()}`, // New unique ID
            properties: {
                ...structuredClone(shapeObj.properties || {}),
                userAdded: true,
                x: (shapeObj.properties?.x || 100) + 30,
                y: (shapeObj.properties?.y || 100) + 30,
            },
        };

        // Update original: Add to elements array
        originalSlide.elements = originalSlide.elements || [];
        originalSlide.elements.push(newShapeElement);

        // Update current variant (if exists)
        if (originalSlide.layouts && originalSlide.layouts.length > 0) {
            const variantIndex = originalSlide.currentVariantIndex ?? 0;
            const variant = originalSlide.layouts[variantIndex];
            if (variant) {
                variant.elements = variant.elements || [];
                variant.elements.push(structuredClone(newShapeElement));
            }
        }

        setSlides(updatedSlides);
    };

    // ✅ NEW: Delete shape properly
    const handleDeleteShape = () => {
        if (slideIndex === -1 || !selectedShapeId) return;

        const updatedSlides = structuredClone(slides);
        const originalSlide = updatedSlides[slideIndex];

        if (!originalSlide) return;

        // Find and delete from variant
        if (originalSlide.layouts && originalSlide.layouts.length > 0) {
            const variantIndex = originalSlide.currentVariantIndex ?? 0;
            const variant = originalSlide.layouts[variantIndex];
            if (variant && variant.elements) {
                const variantIndex = variant.elements.findIndex(
                    (el: any) => el.shape_id === selectedShapeId
                );
                if (variantIndex !== -1) {
                    variant.elements.splice(variantIndex, 1);
                }
            }
        }

        // Delete from original
        if (originalSlide.elements) {
            const originalIndex = originalSlide.elements.findIndex(
                (el: any) => el.shape_id === selectedShapeId
            );
            if (originalIndex !== -1) {
                originalSlide.elements.splice(originalIndex, 1);
            }
        }

        setSlides(updatedSlides);
        setSelectedShapeId(null);
        onClose();
    };

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 0,
                left: "8%",
                width: window.innerWidth * 0.84,
                height: window.innerHeight * 0.46,
                bgcolor: "#fff",
                border: "1px solid rgba(142, 45, 226, 0.12)",
                zIndex: 10,
                boxShadow: "0 -8px 32px rgba(15, 10, 25, 0.12)",
                display: "flex",
                flexDirection: "column",
                padding: "24px",
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
                overflowY: "auto",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
                    Shape Settings
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{
                        transition: "background-color 0.18s ease, transform 0.18s ease",
                        "&:hover": { backgroundColor: "rgba(142, 45, 226, 0.08)", transform: "scale(1.06)" },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider sx={{ my: 2, borderColor: "rgba(142, 45, 226, 0.1)" }} />

            {/* Color Section */}
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
                        Color
                    </Typography>
                    <IconButton
                        sx={{
                            color: "#8E2DE2",
                            transition: "background-color 0.18s ease, transform 0.18s ease",
                            "&:hover": { backgroundColor: "rgba(142, 45, 226, 0.08)", transform: "scale(1.08)" },
                        }}
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
                        border: "1px solid rgba(142, 45, 226, 0.16)",
                        borderRadius: "12px",
                        p: 1.5,
                        transition: "border-color 0.18s ease, background-color 0.18s ease",
                        "&:hover": { borderColor: "#8E2DE2", backgroundColor: "rgba(142, 45, 226, 0.04)" },
                    }}
                    onClick={() => setIsColorPickerOpen(true)}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: fill,
                            borderRadius: "10px",
                            border: "2px solid rgba(142, 45, 226, 0.16)",
                            mb: 1
                        }}
                    />
                    <Typography sx={{ fontSize: 12, color: "#5B5568" }}>
                        {fill.toUpperCase()}
                    </Typography>
                </Box>

                {/* Custom Color Picker */}
                {isColorPickerOpen && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: "#8E2DE2", mb: 1, display: "block" }}>
                            Custom Color
                        </Typography>
                        <Box
                            sx={{
                                border: "1px solid rgba(142, 45, 226, 0.14)",
                                borderRadius: "12px",
                                p: 2,
                                backgroundColor: "#faf7ff",
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

            <Divider sx={{ my: 2, mt: 3, borderColor: "rgba(142, 45, 226, 0.1)" }} />

            {/* Effects */}
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
                        Effects
                    </Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: "#5B5568", mb: 1 }}>
                    Opacity
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Slider
                        value={Math.round(opacity * 100)}
                        onChange={(_, v) => updateShapeProperty("opacity", Number(v) / 100)}
                        sx={{ color: "#8E2DE2", flex: 1 }}
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
                            bgcolor: "rgba(142, 45, 226, 0.06)",
                            borderRadius: "10px",
                            px: 1.5,
                            py: 0.5,
                            textAlign: "center",
                        }}
                    />
                </Box>
            </Box>

            <Divider sx={{ my: 2, borderColor: "rgba(142, 45, 226, 0.1)" }} />

            {/* Actions */}
            <Box sx={{ px: 3, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
                        Actions
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleDuplicateShape}
                        sx={{
                            bgcolor: "rgba(142, 45, 226, 0.04)",
                            borderColor: "rgba(142, 45, 226, 0.2)",
                            color: "#4A00E0",
                            flex: 1,
                            "&:hover": {
                                bgcolor: "rgba(142, 45, 226, 0.08)",
                                borderColor: "#8E2DE2",
                            },
                        }}
                    >
                        Duplicate
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={handleDeleteShape}
                        sx={{ flex: 1 }}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ShapeSettingsPanelMobile;