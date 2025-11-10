"use client";

import React, { useEffect, useState } from "react";
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

// ✅ Define a proper prop type
interface SlideShowPlayerProps {
    slides: any[];
    open: boolean;
    onClose: () => void;
    theme?: any | null; // <-- add theme (make optional or typed as your Theme)
}

const SlideShowPlayer: React.FC<SlideShowPlayerProps> = ({
    slides,
    open,
    onClose,
    theme,
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (open) setCurrentSlide(0);
    }, [open]);

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

    const current = slides[currentSlide];
    const snapshot = current.snapshot;

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
                    sx={{
                        width: "90vw",
                        maxWidth: "1100px",
                        height: "70vh",
                        maxHeight: "800px",
                        borderRadius: 4,
                        overflow: "hidden",
                        boxShadow: "0 35px 80px rgba(0,0,0,0.8)",
                        bgcolor: "#fff",
                        backgroundImage: snapshot ? `url(${snapshot})` : "none",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
                        "@keyframes popIn": {
                            "0%": { transform: "scale(0.8)", opacity: 0 },
                            "100%": { transform: "scale(1)", opacity: 1 },
                        },
                    }}
                >
                    {!snapshot && (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999" }}>
                            <Typography>Loading slide...</Typography>
                        </Box>
                    )}
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