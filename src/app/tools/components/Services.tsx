"use client";

import { Box, Container, Typography, Chip, IconButton } from "@mui/material";
import { ArrowOutward } from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";

const tools = [
    {
        label: "Prompt-to-Deck",
        icon: "/images/tools/prompt-to-deck.svg",
        route: "/tools/prompt-to-deck",
        description: "Turn simple prompts into stunning, well-structured slide decks powered by AI in just seconds."
    },
    {
        label: "Video-to-Deck",
        icon: "/images/tools/video-to-deck.svg",
        route: "/tools/video-to-deck",
        description: "Convert videos into clear, engaging presentation slides with AI-driven content extraction."
    },
    {
        label: "Prompt-to-Pitch",
        icon: "/images/tools/web-to-deck.svg",
        route: "/tools/prompt-to-pitchdeck",
        description: "Turn simple prompts into stunning, well-structured slide decks powered by AI in just seconds."
    },
    {
        label: "Prompt-to-eBook",
        icon: "/images/tools/prompt-to-ebook.svg",
        route: "/tools/prompt-to-ebook",
        description: "Generate well-formatted, high-quality eBooks instantly using AI from simple text prompts."
    },
    {
        label: "Text-to-Infographics",
        icon: "/images/tools/text-to-infographics.svg",
        route: "/tools/text-to-infographics",
        description: "Turn plain text into visually compelling infographics with AI-powered design intelligence."
    },
    {
        label: "Prompt-to-Template",
        icon: "/images/tools/prompt-to-template.svg",
        route: "/tools/prompt-to-template",
        description: "Create ready-to-use, customizable templates instantly using AI from your ideas."
    },
    {
        label: "Prompt to Web",
        icon: "/images/tools/url-to-website.svg",
        route: "https://prompt-to-web.slidexy.net/",
        description: "Build websites, React apps, and mobile apps or clone any site, using nothing but a description or URL."
    },
    {
        label: "Prompt-to-Proposal",
        icon: "/images/tools/prompt-to-pdf.svg",
        route: "/tools/prompt-to-proposal",
        description: "Generate professional business proposals instantly with AI-powered formatting and content."
    },
    {
        label: "Prompt-to-Video",
        icon: "/images/tools/prompt-to-deck.svg",
        route: "/tools/prompt-to-video",
        description: "Create engaging videos from simple prompts using AI-driven storytelling and visuals."
    },
];

export default function Services() {
    const router = useRouter();

    return (
        <Box
            sx={{
                width: "100%",
                background: "#fff",
                py: { xs: 6, md: 18 },
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
                    left: { xs: 20, md: 60 },
                    width: { xs: 24, md: 72 },
                    height: { xs: 24, md: 80 },
                    animation: "sparkle 2s ease-in-out infinite",
                    "@keyframes sparkle": {
                        "0%, 100%": { opacity: 0.7, transform: "scale(1)" },
                        "50%": { opacity: 1, transform: "scale(1.1)" },
                    },
                }}
            >
                <Image
                    src="/images/light-purple-stars.webp"
                    alt="Stars"
                    width={36}
                    height={36}
                    style={{ width: "75%", height: "75%" }}
                />
            </Box>

            {/* 🧩 Checkered background */}
            <Box
                sx={{
                    position: "absolute",
                    top: "25%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    opacity: 0.45,
                    mixBlendMode: "multiply",
                    pointerEvents: "none",
                    width: { xs: 300, md: 550 },
                    height: { xs: 220, md: 500 },
                    zIndex: 0,
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
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: { xs: 3, md: 4 },
                    zIndex: 2,
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                            lg: "repeat(3, 1fr)",
                        },
                        gap: { xs: 2, sm: 3, md: 4 },
                        justifyItems: "center",
                        alignItems: "center",
                        justifyContent: {
                            xs: "center",
                            sm: "center",
                            md: "center",
                            lg: "center",
                        },
                    }}
                >
                    {tools.map((tool, i) => (
                        <Box
                            key={i}
                            onClick={() => {
                                if (tool.route.startsWith('http')) {
                                    window.open(tool.route, '_blank');
                                } else {
                                    router.push(tool.route);
                                }
                            }}
                            sx={{
                                position: "relative",
                                borderRadius: "12px",
                                background: "#fff",
                                boxShadow: "5.25px 6px 60.75px rgba(0,0,0,0.05)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(232, 228, 255, 1)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "32px",
                                p: "24px",
                                minHeight: { xs: 260, md: 280 },
                                width: { xs: "100%", sm: 280, md: 356 },
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                bgcolor: "rgba(251, 250, 255, 0.6)",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "0px 10px 25px rgba(123, 97, 255, 0.2)",
                                },

                            }}
                        >
                            <Image
                                src={tool.icon}
                                alt="service-icon"
                                width={25}
                                height={25}
                            // style={{
                            //     objectFit: "contain",
                            //     width: "100%",
                            //     height: "100%",
                            // }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px", // 👈 exact 10px gap
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: "Raleway",
                                        fontSize: "24px",
                                        lineHeight: "32px",
                                        fontWeight: 700,
                                        color: "#1A1A1A",
                                    }}
                                >

                                    {tool.label}
                                </Typography>
                                 <Typography
                                    sx={{
                                        fontFamily: "Raleway",
                                        fontSize: "16px",
                                        lineHeight: "24px",
                                        fontWeight: 400,
                                        color: "rgba(86, 86, 86, 1)",
                                    }}
                                >
                                    {tool.description}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
