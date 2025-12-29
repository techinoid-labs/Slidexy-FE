"use client";

import React, { useEffect, useState } from "react";
import snapshotsCache from "@/utils/snapshotsCache";
import {
    Dialog,
    IconButton,
    Box,
    Typography,
    LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { HTMLSlideRenderer } from "../editor/HTMLSlideRenderer";


// ✅ Define a proper prop type
interface SlideShowPlayerProps {
    slides: any[];
    open: boolean;
    onClose: () => void;
    theme?: any | null;
    forceCleanPreview?: boolean;

}

const SlideShowPlayer: React.FC<SlideShowPlayerProps> = ({
    slides,
    open,
    onClose,
    theme,
    forceCleanPreview,
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (open) setCurrentSlide(0);
    }, [open]);
    // No longer using snapshotsCache for current preview, 
    // but keeping for other potential uses if needed.
    useEffect(() => {
        if (!open || !forceCleanPreview) return;
        // ... logic removed as we use HTML renderer directly
    }, [open, currentSlide, forceCleanPreview]);

    const goNext = () => setCurrentSlide((i) => (i + 1) % slides.length);
    const goPrev = () => setCurrentSlide((i) => (i - 1 + slides.length) % slides.length);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!open) return;
            if (e.key === "ArrowRight" || e.key === " ") goNext();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open]);

    if (!slides.length) return null;

    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (!containerRef || !open) return;

        const updateScale = () => {
            const containerWidth = containerRef.clientWidth;
            const containerHeight = containerRef.clientHeight;
            const slideWidth = 960;
            const slideHeight = 540;

            const scaleX = containerWidth / slideWidth;
            const scaleY = containerHeight / slideHeight;
            const newScale = Math.min(scaleX, scaleY) * 0.95; // 95% of container

            setScale(newScale);
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [containerRef, open, currentSlide]);

    const progress = ((currentSlide + 1) / slides.length) * 100;

    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <Box
                sx={{
                    bgcolor: "#000",
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    background: "radial-gradient(circle at center, #16213e 0%, #0f0f1a 100%)",
                    overflow: "hidden",
                }}
            >
                {/* Close & Counter */}
                <IconButton onClick={onClose} sx={{ position: "absolute", top: 24, right: 24, color: "white", bgcolor: "rgba(255,255,255,0.1)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
                    <CloseIcon fontSize="large" />
                </IconButton>

                <Typography sx={{ position: "absolute", top: 32, left: 32, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                    {currentSlide + 1} / {slides.length}
                </Typography>

                {/* Snapshot Image */}
                <Box
                    ref={(el: HTMLDivElement) => setContainerRef(el)}
                    sx={{
                        width: "100%",
                        height: "75vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Box
                        sx={{
                            width: 960,
                            height: 540,
                            bgcolor: "#fff",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 35px 80px rgba(0,0,0,0.8)",
                            transform: `scale(${scale})`,
                            transformOrigin: "center center",
                            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                    >
                        <HTMLSlideRenderer
                            slide={slides[currentSlide]}
                            theme={theme}
                            isEditing={false}
                            slideIndex={currentSlide}
                        />
                    </Box>
                </Box>

                {/* Navigation */}
                {slides.length > 1 && (
                    <>
                        <IconButton onClick={goPrev} sx={{ position: "absolute", left: 40, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,0.15)", color: "white", width: 70, height: 70, "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}>
                            <ArrowBackIosNewIcon sx={{ fontSize: 32 }} />
                        </IconButton>
                        <IconButton onClick={goNext} sx={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,0.15)", color: "white", width: 70, height: 70, "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}>
                            <ArrowForwardIosIcon sx={{ fontSize: 32 }} />
                        </IconButton>
                    </>
                )}

                {/* Progress Bar */}
                <Box sx={{ position: "absolute", bottom: 40, width: "50%", left: "50%", transform: "translateX(-50%)" }}>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: "rgba(255,255,255,0.2)", "& .MuiLinearProgress-bar": { bgcolor: "#00ff99" } }} />
                </Box>

                <Typography sx={{ position: "absolute", bottom: 16, color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
                    ← → or Space • ESC to exit
                </Typography>
            </Box>
        </Dialog>
    );
};

export default SlideShowPlayer;