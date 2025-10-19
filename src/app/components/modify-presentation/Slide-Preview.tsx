"use client";
import React, { useEffect, useState } from "react";
import { Dialog, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SlideRenderer from "../../editor/KonvaComponents/KonvaSlideRenderer";
import { getSlideDimensions } from "../../../utils/slideUtils";

const getDynamicConstants = () => {
    const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING, SLIDE_HEIGHT_MOBILE, SLIDE_WIDTH_MOBILE } =
        getSlideDimensions();
    const IMAGE_WIDTH = 400;
    const IMAGE_PADDING = 40;
    const textMaxWidth = SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING;
    const textMaxHeight = SLIDE_HEIGHT;
    return {
        SLIDE_WIDTH,
        SLIDE_HEIGHT,
        LEFT_PADDING,
        IMAGE_WIDTH,
        IMAGE_PADDING,
        SLIDE_HEIGHT_MOBILE,
        SLIDE_WIDTH_MOBILE,
        textMaxWidth,
        textMaxHeight,
    };
};

const SlideShowPlayer = ({ slides, open, onClose, theme }: any) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            const slideWidth = getDynamicConstants().SLIDE_WIDTH;
            const margin = 32;
            const availableWidth = window.innerWidth - margin;
            const newScale = availableWidth / slideWidth;
            setScale(Math.min(1, newScale)); // max 1x scale
        };

        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    useEffect(() => {
        if (!open) return;
        setCurrentSlide(0); // reset to first slide on open
    }, [open]);

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const handlePrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Keyboard navigation
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                handleNext();
            } else if (e.key === "ArrowLeft") {
                handlePrevious();
            } else if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, slides.length]);

    if (!slides.length) return null;

    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <Box
                sx={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#000000",
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", top: 20, right: 20, color: "#fff" }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Slide Box */}
                <Box
                    sx={{
                        width: `${getDynamicConstants().SLIDE_WIDTH}px`,
                        height: `${getDynamicConstants().SLIDE_HEIGHT}px`,
                        transform: `scale(${scale})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "black",
                    }}
                >
                    <SlideRenderer slide={slides[currentSlide]} theme={theme} />
                </Box>

                {/* Navigation Buttons Below */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 3, // space between slide and buttons
                    }}
                >
                    <IconButton
                        onClick={handlePrevious}
                        sx={{
                            color: "#fff",
                            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                        }}
                        disabled={slides.length <= 1}
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    <IconButton
                        onClick={handleNext}
                        sx={{
                            color: "#fff",
                            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                        }}
                        disabled={slides.length <= 1}
                    >
                        <ArrowForwardIcon />
                    </IconButton>
                </Box>
            </Box>
        </Dialog>
    );
};

export default SlideShowPlayer;
