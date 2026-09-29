"use client";

import { Box, Container, Typography } from "@mui/material";
import { ArrowOutward } from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

const tools = [
  {
    label: "Prompt-to-Deck",
    icon: "/images/tools/prompt-to-deck.svg",
    route: "/tools/prompt-to-deck",
    description:
      "Turn simple prompts into stunning, well-structured slide decks powered by AI in just seconds.",
  },
  {
    label: "Video-to-Deck",
    icon: "/images/tools/video-to-deck.svg",
    route: "/tools/video-to-deck",
    description:
      "Convert videos into clear, engaging presentation slides with AI-driven content extraction.",
  },
  {
    label: "Web-to-Deck",
    icon: "/images/tools/web-to-deck.svg",
    route: "/tools/web-to-deck",
    description:
      "Transform web pages into professional slide decks with AI-curated summaries and visuals.",
  },
  {
    label: "Prompt-to-eBook",
    icon: "/images/tools/prompt-to-ebook.svg",
    route: "/tools/prompt-to-ebook",
    description:
      "Generate well-formatted, high-quality eBooks instantly using AI from simple text prompts.",
  },
  {
    label: "Text-to-Infographics",
    icon: "/images/tools/text-to-infographics.svg",
    route: "/tools/text-to-infographics",
    description:
      "Turn plain text into visually compelling infographics with AI-powered design intelligence.",
  },
  {
    label: "Prompt-to-Template",
    icon: "/images/tools/prompt-to-template.svg",
    route: "/tools/prompt-to-template",
    description:
      "Create ready-to-use, customizable templates instantly using AI from your ideas.",
  },
  {
    label: "Prompt to Web",
    icon: "/images/tools/url-to-website.svg",
    route: "https://prompt-to-web.slidexy.net/",
    description:
      "Build websites, React apps, and mobile apps or clone any site, using nothing but a description or URL.",
  },
  {
    label: "Prompt-to-Proposal",
    icon: "/images/tools/prompt-to-pdf.svg",
    route: "/tools/prompt-to-proposal",
    description:
      "Generate professional business proposals instantly with AI-powered formatting and content.",
  },
  {
    label: "Prompt-to-Video",
    icon: "/images/tools/prompt-to-deck.svg",
    route: "/tools/prompt-to-video",
    description:
      "Create engaging videos from simple prompts using AI-driven storytelling and visuals.",
  },
];

export default function Services() {
  const router = useRouter();

  const go = (route: string) => {
    if (route.startsWith("http")) {
      window.open(route, "_blank");
    } else {
      router.push(route);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        background: "#fff",
        py: { xs: 6, md: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="lg"
        component={motion.div}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        sx={{ position: "relative", zIndex: 2 }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: { xs: 2, md: 3 },
          }}
        >
          {tools.map((tool, i) => (
            <Box
              key={tool.label}
              component={motion.div}
              variants={fadeUp}
              custom={i}
              role="button"
              tabIndex={0}
              aria-label={tool.label}
              onClick={() => go(tool.route)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  go(tool.route);
                }
              }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              sx={{
                position: "relative",
                borderRadius: "20px",
                background: "linear-gradient(160deg, #FBFAFF 0%, #fff 100%)",
                border: "1px solid rgba(142, 45, 226, 0.12)",
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                p: 3,
                minHeight: 240,
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(74, 0, 224, 0.04)",
                transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                overflow: "hidden",
                "&:hover": {
                  boxShadow: "0 16px 40px rgba(142, 45, 226, 0.16)",
                  borderColor: "rgba(142, 45, 226, 0.35)",
                  "& .sx-tool-arrow": {
                    opacity: 1,
                    transform: "translate(0, 0)",
                  },
                  "& .sx-tool-icon": {
                    background: "linear-gradient(135deg, #8E2DE2, #4A00E0)",
                    "& img": { filter: "brightness(0) invert(1)" },
                  },
                },
                "&:focus-visible": {
                  outline: "2px solid #8E2DE2",
                  outlineOffset: "2px",
                },
              }}
            >
              <Box
                className="sx-tool-icon"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(242, 240, 255, 1)",
                  transition: "background 0.25s ease",
                }}
              >
                <Image src={tool.icon} alt="" width={24} height={24} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  className="sx-display"
                  sx={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#0F0A19",
                    mb: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {tool.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: "#5B5568",
                  }}
                >
                  {tool.description}
                </Typography>
              </Box>

              <ArrowOutward
                className="sx-tool-arrow"
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  fontSize: 20,
                  color: "#8E2DE2",
                  opacity: 0,
                  transform: "translate(-4px, 4px)",
                  transition: "opacity 0.25s ease, transform 0.25s ease",
                }}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
