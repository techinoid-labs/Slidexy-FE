"use client";
import React, { useEffect, useState } from "react";
import { Dialog, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SlideRenderer from "../../editor/KonvaComponents/KonvaSlideRenderer";
import { getRandomSlide, getSlideDimensions } from "../../../utils/slideUtils";

const getDynamicConstants = () => {
    const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING, SLIDE_HEIGHT_MOBILE, SLIDE_WIDTH_MOBILE } = getSlideDimensions();
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
    useEffect(() => {
        const updateScale = () => {
            const slideWidth = getDynamicConstants().SLIDE_WIDTH;
            const slideHeight = getDynamicConstants().SLIDE_HEIGHT;
            const margin = 32;
            const availableWidth = window.innerWidth - margin;
            const newScale = availableWidth / slideWidth;
            setScale(Math.min(1, newScale)); // max 1x scale
        };

        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);
    const [scale, setScale] = useState(1);
    useEffect(() => {
        if (!open) return;
        setCurrentSlide(0); // reset to first slide on open
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
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
                    justifyContent: "center",
                    background : "#000000",
                    alignItems: "center",
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", top: 20, right: 20, color: "#fff" }}
                >
                    <CloseIcon />
                </IconButton>

                <Box
                    sx={{
                        // width: 960,
                        // height: 540,
                        
                        width: `${getDynamicConstants().SLIDE_WIDTH}px`,
                        height: `${getDynamicConstants().SLIDE_HEIGHT + 100}px`,
                        transform: `scale(${scale})`,
    
                    }}
                >
                    <SlideRenderer slide={slides[currentSlide]} theme = {theme} />
                </Box>
            </Box>
        </Dialog>
    );
};

export default SlideShowPlayer;
