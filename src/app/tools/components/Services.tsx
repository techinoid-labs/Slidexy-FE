"use client";

import { Box, Container, Typography, Chip, IconButton } from "@mui/material";
import { ArrowOutward } from "@mui/icons-material";
import Image from "next/image";

const tools = [
    { label: "Prompt-to-Deck", tag: "Free" },
    { label: "Video-to-Deck", tag: "New" },
    { label: "Web-to-Deck", tag: "New" },
    { label: "Text-to-Infographics", tag: "Pro" },
    { label: "Prompt-to-Template", tag: "Soon" },
    { label: "Prompt-to-Website", tag: "Soon" },
];

export default function Services() {
    return (
        <Box
            sx={{
                width: "100%",
                background: "#fff",
                py: { xs: 6, md: 10 },
                position: "relative",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
            }}
        >
            {/* ✨ Stars Animation */}
            <Box
                sx={{
                    position: "absolute",
                    top: { xs: 10, md: 40 },
                    left: { xs: 20, md: 200 },
                    width: { xs: 24, md: 72 },
                    height: { xs: 24, md: 72 },
                    animation: "sparkle 2s ease-in-out infinite",
                    "@keyframes sparkle": {
                        "0%, 100%": { opacity: 0.7, transform: "scale(1)" },
                        "50%": { opacity: 1, transform: "scale(1.1)" },
                    },
                }}
            >
                <Image
                    src="/images/light-purple-stars.png"
                    alt="Stars"
                    width={72}
                    height={72}
                    style={{ width: "100%", height: "100%" }}
                />
            </Box>

            {/* 🧩 Checkered background */}
            <Box
                sx={{
                    position: "absolute",
                    top: { xs: "-80px", md: "-180px" }, // 👈 pushes upward above the section
                    left: "50%",
                    transform: "translateX(-50%)",
                    opacity: 0.25, // 👈 more subtle blend with white background
                    mixBlendMode: "multiply", // 👈 visually merges with background
                    pointerEvents: "none",
                    width: { xs: 300, md: 600 }, // slightly larger to fill top area
                    height: { xs: 220, md: 500 },
                    zIndex: 0, // stays behind content
                }}
            >
                <Image
                    src="/images/checkered-lines.svg"
                    alt="Checkered"
                    width={600}
                    height={600}
                    style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                    }}
                />
            </Box>

            {/* Cards Grid */}
            <Container
                maxWidth="lg"
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                    gap: { xs: 3, md: 2 },
                    zIndex: 2,
                }}
            >
                {tools.map((tool, i) => (
                    <Box
                        key={i}
                        sx={{
                            position: "relative",
                            borderRadius: "16px",
                            background: "rgba(255, 255, 255, 1)",
                            boxShadow: "5.25px 6px 60.75px 0px rgba(0, 0, 0, 0.05)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255, 255, 255, 0.4)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            p: 3,
                            height: 100,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: "0px 10px 25px rgba(123, 97, 255, 0.2)",
                            },
                        }}
                    >
                        {/* Chip Tag */}
                        <Chip
                            label={tool.tag}
                            size="small"
                            sx={{
                                position: "absolute",
                                top: 12,
                                left: 12,
                                background:
                                    tool.tag === "Pro"
                                        ? "rgba(123, 61, 255, 0.1)"
                                        : tool.tag === "Free"
                                            ? "rgba(74, 0, 224, 0.08)"
                                            : "rgba(155, 81, 224, 0.08)",
                                color: "rgba(74, 0, 224, 1)",
                                fontWeight: 500,
                                fontSize: "0.7rem",
                                borderRadius: "12px",
                            }}
                        />

                        {/* Card Label */}
                        <Typography
                            sx={{
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                color: "#1A1A1A",
                                mt: 3,
                            }}
                        >
                            {tool.label}
                        </Typography>

                        {/* Arrow Icon */}
                        <IconButton
                            sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                color: "#5205e0",
                                backgroundColor: "#ffffff",
                                border: "1.33px solid rgba(242, 240, 255, 1)",
                                borderRadius: "50%",
                                "&:hover": {
                                    backgroundColor: "rgba(123, 97, 255, 0.15)",
                                },
                            }}
                        >
                            <ArrowOutward sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Box>
                ))}
            </Container>
        </Box>
    );
}
