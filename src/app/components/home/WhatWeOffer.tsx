"use client";

import {
  Box,
  Button,
  Chip,
  Container,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { ArrowForward } from "@mui/icons-material";
import { useState } from "react";
import Lottie from "lottie-react";
import templateAnimation from "@/json/Gif8-template-section.json";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { easeOutExpo } from "@/lib/motion";
import AnimatedOrb from "@/app/components/shared/AnimatedOrb";

export default function WhatWeOffer() {
  const router = useRouter();
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const tools = [
    {
      title: "Prompt-to-Deck",
      icon: "/images/tools/prompt-to-deck.svg",
      description:
        "Turn any thought into a polished, on-brand presentation — powered by AI, styled by designers.",
      route: "/tools/prompt-to-deck",
    },
    {
      title: "Video-to-Deck",
      icon: "/images/tools/video-to-deck.svg",
      description:
        "Upload a video or lecture and automatically convert it into a structured slide deck.",
      route: "/tools/video-to-deck",
    },
    {
      title: "Web-to-Deck",
      icon: "/images/tools/web-to-deck.svg",
      description:
        "Transform any web page or article into a clean, visually consistent presentation.",
      route: "/tools/web-to-deck",
    },
    {
      title: "Text-to-Infographics",
      icon: "/images/tools/text-to-infographics.svg",
      description:
        "Convert long reports or data-heavy text into dynamic, easy-to-read infographics.",
      route: "/tools/text-to-infographics",
    },
    {
      title: "Prompt-to-Template",
      icon: "/images/tools/prompt-to-template.svg",
      description:
        "Describe your theme and purpose — get a matching slide template, fully editable.",
      route: "/tools/prompt-to-template",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box
      sx={{
        position: "relative",
        background: "linear-gradient(180deg, #fff 0%, #FBFAFF 50%, #fff 100%)",
        py: { xs: 8, md: 12 },
        overflow: "hidden",
      }}
    >
      <AnimatedOrb
        size={280}
        top="10%"
        right="-5%"
        color="rgba(142, 45, 226, 0.12)"
        blur={50}
        duration={10}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
          <Chip
            icon={
              <Image
                src="/images/Stars.svg"
                alt=""
                width={18}
                height={18}
                style={{ marginRight: 4 }}
              />
            }
            label="What we offer"
            sx={{
              px: 2,
              py: 0.8,
              mb: 2.5,
              fontSize: "0.9rem",
              height: "auto",
              color: "#4A00E0",
              backgroundColor: "rgba(242, 240, 255, 1)",
              border: "1px solid rgba(142, 45, 226, 0.12)",
            }}
          />
          <Typography
            variant="h2"
            className="sx-display"
            sx={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              color: "#0F0A19",
              mb: 1.5,
            }}
          >
            Tools that turn ideas into decks
          </Typography>
          <Typography
            sx={{
              color: "#5B5568",
              fontSize: { xs: "1rem", md: "1.15rem" },
              maxWidth: 560,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Pick a starting point — prompt, video, or URL — and Slidexy does the rest.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 5 },
            alignItems: "stretch",
            mb: 6,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              width: { xs: "100%", md: 340 },
              flexShrink: 0,
            }}
          >
            {tools.map((tool, index) => {
              const active = activeIndex === index;
              return (
                <Box
                  key={tool.title}
                  component={motion.div}
                  layout
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.25, ease: easeOutExpo }}
                  sx={{
                    p: 2.5,
                    borderRadius: "16px",
                    cursor: "pointer",
                    background: active
                      ? "linear-gradient(135deg, rgba(142,45,226,0.08), rgba(74,0,224,0.04))"
                      : "#fff",
                    border: active
                      ? "1.5px solid rgba(142, 45, 226, 0.35)"
                      : "1px solid rgba(142, 45, 226, 0.08)",
                    boxShadow: active
                      ? "0 12px 32px rgba(142, 45, 226, 0.12)"
                      : "none",
                    transition: "background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: active
                          ? "linear-gradient(135deg, #8E2DE2, #4A00E0)"
                          : "rgba(242, 240, 255, 1)",
                        transition: "background 0.25s ease",
                      }}
                    >
                      <Image
                        src={tool.icon}
                        alt=""
                        width={22}
                        height={22}
                        style={{
                          filter: active ? "brightness(0) invert(1)" : "none",
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        color: "#0F0A19",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {tool.title}
                    </Typography>
                  </Box>

                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div
                        key="detail"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: easeOutExpo }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.9rem",
                            color: "#5B5568",
                            mt: 1.5,
                            mb: 2,
                            lineHeight: 1.6,
                          }}
                        >
                          {tool.description}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          fullWidth
                          onClick={() => router.push(tool.route)}
                          endIcon={<ArrowForward />}
                        >
                          Get started
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              );
            })}
          </Box>

          <Box
            component={motion.div}
            key={activeIndex}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "24px",
              background:
                "radial-gradient(ellipse at center, rgba(142,45,226,0.08) 0%, transparent 70%)",
              minHeight: { xs: 280, md: 420 },
              overflow: "hidden",
            }}
          >
            <Lottie
              animationData={templateAnimation}
              loop
              autoplay
              style={{ width: "100%", height: "100%", borderRadius: "24px" }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <Button variant="contained" onClick={scrollToContact}>
            Contact us
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/tools")}
            endIcon={<ArrowForward />}
          >
            View all tools
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
