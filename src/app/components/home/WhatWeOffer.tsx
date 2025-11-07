"use client";

import {
    Box,
    Button,
    Chip,
    Container,
    Typography,
    useTheme,
} from "@mui/material";
import Image from "next/image";
import ResponsivePageWrapper from "@/lib/responsive-page-wrapper";
import { ArrowForward } from "@mui/icons-material";
import { useState } from "react";
import Lottie from "lottie-react";
import templateAnimation from "@/json/Gif8-template-section.json";
import { useRouter } from "next/navigation";

export default function WhatWeOffer() {
    const theme = useTheme();
    const router = useRouter();

    // Define all tools with detailed descriptions
    const tools = [
        {
            title: "Prompt-to-Deck",
            description:
                "Turn any thought into a polished, on-brand presentation — powered by AI, styled by designers. Simply describe your idea, and get a complete deck with slides, visuals, and tone matching your brand.",
            route: "/tools/prompt-to-deck",
        },
        {
            title: "Video-to-Deck",
            description:
                "Upload a video or lecture and automatically convert it into a structured slide deck. Our AI extracts speech, visuals, and highlights to create story-driven presentations ready for delivery.",
            route: "/tools/video-to-deck",
        },
        {
            title: "Web-to-Deck",
            description:
                "Transform any web page or article into a clean, visually consistent presentation. Summarize sections, keep key visuals, and align design with your company’s brand.",
            route: "/tools/web-to-deck",
        },
        {
            title: "Text-to-Infographics",
            description:
                "Convert long reports or data-heavy text into dynamic, easy-to-read infographics. AI identifies data patterns and crafts compelling visuals to simplify complex insights.",
            route: "/tools/text-to-infographics",
        },
        {
            title: "Prompt-to-Template",
            description:
                "Need a new presentation design? Describe your theme, tone, and purpose, and our AI generates a matching slide template — fully editable and brand-consistent.",
            route: "/tools/prompt-to-template",
        },
        // {
        //   title: "Prompt-to-Website",
        //   description:
        //     "Turn your presentation or written idea into a live website. AI handles structure, layout, and content, giving you a functional landing page or portfolio instantly.",
        //   route: "/tools/url-to-website",  },
    ];

    // State to track active tool
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <ResponsivePageWrapper>
            <Box
                sx={{
                    background: "#FFFFFF",
                    py: { xs: 8, md: 12 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Decorative Star */}
                <Box
                    sx={{
                        position: "relative",
                        top: { xs: 30, md: 60 },
                        left: { xs: 50, md: -500 },
                        display: { xs: "none", md: "block" },
                    }}
                >
                    <Image
                        src="/images/light-purple-stars.png"
                        alt="Icon"
                        width={68}
                        height={68}
                    />
                </Box>

                <Container maxWidth="lg">
                    {/* Chip */}
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <Chip
                            icon={
                                <Image
                                    src="/images/Stars.svg"
                                    alt="Icon"
                                    width={20}
                                    height={20}
                                    style={{ marginRight: 6 }}
                                />
                            }
                            label="What We Offer"
                            sx={{
                                px: 2.5,
                                py: 1.2,
                                fontSize: "1rem",
                                height: "auto",
                                borderRadius: "600px",
                                color: "#4A00E0",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
                                backgroundColor: "rgba(242, 240, 255, 1)"
                            }}
                        />
                    </Box>

                    {/* Heading */}
                    <Typography
                        variant="h3"
                        align="center"
                        sx={{
                            fontWeight: 500,
                            fontSize: { xs: "1.8rem", md: "2.3rem" },
                            color: "#18181B",
                            mb: 2,
                        }}
                    >
                        Discover the Tools that Drive Success
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                        align="center"
                        sx={{
                            color: "#757575",
                            fontSize: { xs: "0.9rem", md: "1.15rem" },
                            mb: { xs: 5, md: 8 },
                            maxWidth: 650,
                            mx: "auto",
                        }}
                    >
                        Turn any thought into a polished, on-brand presentation — <br />
                        powered by AI
                    </Typography>

                    {/* Main Layout */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            justifyContent: "center",
                            alignItems: "stretch",
                            gap: 4,
                            mb: 8,
                        }}
                    >
                        {/* Left Column - Tool List */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                width: { xs: "100%", md: 320 },
                            }}
                        >
                            {tools.map((tool, index) => {
                                const active = activeIndex === index;
                                return (
                                    <Box
                                        key={index}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            backgroundColor: active ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 1)",
                                            boxShadow: active
                                                ? "0px 4px 20px rgba(0,0,0,0.05)"
                                                : "none",
                                            cursor: "pointer",
                                            border: active
                                                ? "1.5px solid #E8E4FF"
                                                : "1px solid #F0EEFF",
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                backgroundColor: "white",
                                                boxShadow: "0px 4px 15px rgba(0,0,0,0.04)",
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 500,
                                                fontSize: "1.05rem",
                                                color: "#18181B",
                                                mb: 1,
                                            }}
                                        >
                                            {tool.title}
                                        </Typography>
                                        {active && (
                                            <>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.9rem",
                                                        color: "#757575",
                                                        mb: 2,
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    {tool.description}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => router.push(tool.route)}
                                                    sx={{
                                                        background: "rgba(242, 240, 255, 1)",
                                                        color: "rgba(74, 0, 224, 1)",
                                                        textTransform: "none",
                                                        fontWeight: 500,
                                                        borderRadius: "30px",
                                                        width: "100%",
                                                        px: 2.5,
                                                        py: 0.8,
                                                        fontSize: "0.85rem",
                                                        "&:hover": {
                                                            background: "rgba(74, 0, 224, 1)",
                                                            color: "rgba(242, 240, 255, 1)"
                                                        },
                                                    }}
                                                    endIcon={<ArrowForward />}
                                                >
                                                    Get Started Now
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Right Side - Preview Box */}
                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            <Lottie
                                animationData={templateAnimation}
                                loop
                                autoplay
                                style={{ width: "100%", height: "100%", borderRadius: "32px" }}
                            />
                        </Box>
                    </Box>

                    {/* Footer Buttons */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 3,
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                backgroundImage: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                                textTransform: "none",
                                borderRadius: "40px",
                                px: 3,
                                py: 1.2,
                                fontSize: "0.95rem",
                                fontWeight: 500,
                                color: "#fff",
                                "&:hover": {
                                    backgroundImage:
                                        "linear-gradient(80.89deg, #4A00E0 -20%, #8E2DE2 100%)",
                                },
                            }}
                        >
                            Contact Us
                        </Button>

                        <Button
                            sx={{
                                color: "rgba(74, 0, 224, 1)",
                                textTransform: "none",
                                fontWeight: 500,
                                fontSize: "0.95rem",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                            }}
                            endIcon={<ArrowForward />}
                        >
                            View All
                        </Button>
                    </Box>
                </Container>
            </Box>
        </ResponsivePageWrapper>
    );
}
