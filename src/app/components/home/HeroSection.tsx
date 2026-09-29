"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  InputBase,
  Chip,
} from "@mui/material";
import { ArrowForward, AutoAwesome, PlayArrow } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { analyticsEvent } from "@/lib/gtag";
import AnimatedOrb from "@/app/components/shared/AnimatedOrb";
import { fadeUp, staggerContainer, easeOutExpo } from "@/lib/motion";
import { InfographicBulletsHTML } from "@/app/components/layouts/InfographicBulletsHTML";

const HERO_PREVIEW_SLIDE = {
  slide_title: { text: "Why teams switch to Slidexy" },
  elements: [
    { element_type: "bullet_point", id: "hp-1", text: "10x - Faster than building decks by hand" },
    { element_type: "bullet_point", id: "hp-2", text: "50+ - Layout variations to choose from" },
    { element_type: "bullet_point", id: "hp-3", text: "100% - On-brand colors, every slide" },
    { element_type: "bullet_point", id: "hp-4", text: "0 - Design skills required" },
  ],
};
const HERO_PREVIEW_THEME = {
  backgroundColor: "#ffffff",
  artPalette: ["#8E2DE2", "#4A00E0", "#C084FC", "#F0ABFC"],
};

const PLACEHOLDERS = [
  "Pitch deck for a climate-tech startup…",
  "Q3 sales review for the leadership team…",
  "Lecture on the history of jazz…",
  "Onboarding walkthrough for new hires…",
];

const FLOATING_TAGS = [
  { label: "Outline generated", top: "-46px", left: "8%", delay: 0.2 },
  { label: "12 slides, ready", bottom: "-46px", right: "8%", delay: 0.6 },
];

export default function HeroSection() {
  const [inputValue, setInputValue] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const cardRef = useRef<HTMLDivElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.4);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 20 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handlePointerLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  const handleRedirect = () => {
    analyticsEvent("get_started_click", {
      category: "engagement",
      label: "home_page_to_tools",
    });
    const prompt = inputValue.trim();
    router.push(prompt ? `/tools?prompt=${encodeURIComponent(prompt)}` : "/tools");
  };

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (inputValue.trim()) {
      current.set("prompt", inputValue.trim());
    } else {
      current.delete("prompt");
    }
    const search = current.toString();
    router.replace(`?${search}`, { scroll: false });
  }, [inputValue]);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = previewWrapRef.current;
    if (!el) return;
    const update = () => setPreviewScale(el.clientWidth / 960);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "#FFFFFF",
        pt: { xs: 6, md: 8 },
        pb: { xs: 8, md: 10 },
      }}
    >
      {/* Soft light-purple wash + floating pastel orbs */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 45% at 82% 12%, rgba(142,45,226,0.08) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 5% 85%, rgba(74,0,224,0.06) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <AnimatedOrb
        size={{ xs: 200, md: 380 }}
        top="-6%"
        right="-6%"
        color="rgba(142, 45, 226, 0.14)"
        blur={70}
        duration={9}
      />
      <AnimatedOrb
        size={{ xs: 160, md: 300 }}
        bottom="-8%"
        left="-6%"
        color="rgba(240, 171, 252, 0.16)"
        blur={70}
        duration={11}
        delay={1.2}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 6, md: 4 },
          }}
        >
          {/* Left column — copy + composer */}
          <Box
            component={motion.div}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
              textAlign: { xs: "center", md: "left" },
              maxWidth: 560,
            }}
          >
            <motion.div variants={fadeUp} custom={0}>
              <Chip
                icon={<AutoAwesome sx={{ fontSize: 16, color: "#8E2DE2 !important" }} />}
                label="AI presentation generator"
                sx={{
                  bgcolor: "rgba(142, 45, 226, 0.08)",
                  color: "#4A00E0",
                  fontWeight: 600,
                  border: "1px solid rgba(142, 45, 226, 0.16)",
                  mb: 3,
                }}
              />
            </motion.div>

            <motion.div variants={fadeUp} custom={1}>
              <Typography
                component="h1"
                className="sx-display"
                sx={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: { xs: "2.1rem", sm: "2.6rem", md: "3.1rem" },
                  lineHeight: 1.12,
                  letterSpacing: "-0.035em",
                  color: "#0F0A19",
                  mb: 2,
                }}
              >
                Skip the blank slide.
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    background: "linear-gradient(90deg, #8E2DE2, #C084FC, #8E2DE2)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "sx-gradient-shift 5s ease infinite",
                  }}
                >
                  Just describe it.
                </Box>
              </Typography>
            </motion.div>

            <motion.div variants={fadeUp} custom={2}>
              <Typography
                sx={{
                  color: "#5B5568",
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.65,
                  maxWidth: 480,
                  mb: 3.5,
                }}
              >
                Hand Slidexy a topic, document, or link. Get a full deck —
                outlined, designed, ready to present — in seconds.
              </Typography>
            </motion.div>

            {/* Prompt composer */}
            <motion.div variants={fadeUp} custom={3} style={{ width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#fff",
                  borderRadius: "999px",
                  border: "1.5px solid rgba(142,45,226,0.18)",
                  boxShadow: "0 12px 32px -12px rgba(142,45,226,0.25)",
                  pl: { xs: 2.5, md: 3 },
                  pr: 0.75,
                  py: 0.75,
                  mb: 2,
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                  "&:focus-within": {
                    borderColor: "#8E2DE2",
                    boxShadow: "0 12px 32px -8px rgba(142,45,226,0.35), 0 0 0 4px rgba(142,45,226,0.1)",
                  },
                }}
              >
                <Box sx={{ position: "relative", flex: 1, minHeight: 28 }}>
                  {!inputValue && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        pointerEvents: "none",
                        overflow: "hidden",
                      }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={placeholderIdx}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.35, ease: easeOutExpo }}
                          style={{
                            fontSize: "0.95rem",
                            color: "#8A8496",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {PLACEHOLDERS[placeholderIdx]}
                        </motion.span>
                      </AnimatePresence>
                    </Box>
                  )}
                  <InputBase
                    fullWidth
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleRedirect();
                      }
                    }}
                    sx={{
                      color: "#0F0A19",
                      fontSize: { xs: "0.95rem", md: "1rem" },
                      "& input::placeholder": { color: "transparent" },
                    }}
                    inputProps={{ "aria-label": "Describe your presentation" }}
                  />
                </Box>
                <Button
                  component={motion.button}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRedirect}
                  variant="contained"
                  sx={{
                    borderRadius: "999px",
                    minWidth: 0,
                    px: 2.75,
                    py: 1.25,
                    flexShrink: 0,
                  }}
                  aria-label="Create presentation"
                >
                  <ArrowForward fontSize="small" />
                </Button>
              </Box>
            </motion.div>

            <motion.div variants={fadeUp} custom={4}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", md: "flex-start" },
                  alignItems: "center",
                  gap: 2.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    color: "#8A8496",
                    fontSize: "0.875rem",
                  }}
                >
                  <AutoAwesome sx={{ fontSize: 15, color: "#8E2DE2" }} />
                  No sign-up needed for your first deck
                </Box>
                <Box
                  component={motion.button}
                  whileHover={{ x: 3 }}
                  onClick={() =>
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#4A00E0",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    p: 0,
                  }}
                >
                  <PlayArrow sx={{ fontSize: 16 }} />
                  See how it works
                </Box>
              </Box>
            </motion.div>
          </Box>

          {/* Right column — interactive floating product preview */}
          <Box
            sx={{
              flex: 1,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              position: "relative",
              perspective: 1000,
            }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: easeOutExpo }}
              sx={{ position: "relative", width: "100%", maxWidth: 460 }}
            >
              <Box
                ref={cardRef}
                component={motion.div}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                style={{ rotateX, rotateY }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                sx={{
                  position: "relative",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid rgba(142,45,226,0.12)",
                  boxShadow:
                    "0 30px 60px -24px rgba(142,45,226,0.35), 0 8px 24px rgba(15,10,25,0.08)",
                  bgcolor: "#fff",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Real rendered slide layout, scaled to fit — not a static mockup */}
                <Box
                  ref={previewWrapRef}
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "960 / 540",
                    overflow: "hidden",
                    pointerEvents: "none",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "960px",
                      height: "540px",
                      transformOrigin: "top left",
                      transform: `scale(${previewScale})`,
                    }}
                  >
                    <InfographicBulletsHTML
                      slide={HERO_PREVIEW_SLIDE}
                      theme={HERO_PREVIEW_THEME}
                      variant={1}
                      isEditing={false}
                      slideIndex={0}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
                    backgroundSize: "200% 100%",
                    animation: "sx-shimmer 4.5s linear infinite",
                    pointerEvents: "none",
                  }}
                />
              </Box>

              {FLOATING_TAGS.map((tag) => (
                <Box
                  key={tag.label}
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                  transition={{
                    opacity: { duration: 0.5, delay: tag.delay + 0.6 },
                    scale: { duration: 0.5, delay: tag.delay + 0.6 },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: tag.delay },
                  }}
                  sx={{
                    position: "absolute",
                    top: tag.top,
                    bottom: tag.bottom,
                    left: tag.left,
                    right: tag.right,
                    display: { xs: "none", sm: "flex" },
                    alignItems: "center",
                    gap: 0.75,
                    bgcolor: "#fff",
                    borderRadius: "999px",
                    border: "1px solid rgba(142,45,226,0.14)",
                    boxShadow: "0 12px 28px -10px rgba(142,45,226,0.3)",
                    px: 1.75,
                    py: 0.9,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#0F0A19",
                    zIndex: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #8E2DE2, #4A00E0)",
                    }}
                  />
                  {tag.label}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
