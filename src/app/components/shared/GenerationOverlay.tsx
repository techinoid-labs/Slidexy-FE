"use client";

import { Box, Button, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedOrb from "./AnimatedOrb";

interface GenerationOverlayProps {
  open: boolean;
  progress?: number;
  message?: string;
  detail?: string;
  onCancel?: () => void;
}

const STAGES = [
  { threshold: 0, label: "Reading input" },
  { threshold: 18, label: "Structuring" },
  { threshold: 42, label: "Writing copy" },
  { threshold: 66, label: "Visuals" },
  { threshold: 86, label: "Final polish" },
];

/* ---------- Illustration: 3 stacked slide cards ---------- */
function SlideBuildIllustration() {
  const cards = [
    { rotate: -7, yOffset: 10, zIndex: 0, delay: 0.2, bg: "#F0EBFF", border: "rgba(142,45,226,0.12)" },
    { rotate: -2, yOffset: 5, zIndex: 1, delay: 0.35, bg: "#F8F5FF", border: "rgba(142,45,226,0.16)" },
    { rotate: 2, yOffset: 0, zIndex: 2, delay: 0.5, bg: "#ffffff", border: "rgba(142,45,226,0.26)" },
  ];

  return (
    <Box sx={{ position: "relative", width: 240, height: 164, mx: "auto", mb: 5 }}>
      {cards.map((card, i) => (
        <Box
          key={i}
          component={motion.div}
          initial={{ opacity: 0, y: 48, scale: 0.84 }}
          animate={{ opacity: 1, y: card.yOffset, scale: 1 }}
          transition={{ delay: card.delay, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            ml: "-90px",
            mt: "-60px",
            width: 180,
            height: 120,
            borderRadius: "14px",
            bgcolor: card.bg,
            border: `1px solid ${card.border}`,
            boxShadow:
              i === 2
                ? "0 16px 40px rgba(142,45,226,0.18), 0 4px 12px rgba(0,0,0,0.06)"
                : "0 4px 14px rgba(142,45,226,0.08)",
            transform: `rotate(${card.rotate}deg)`,
            zIndex: card.zIndex,
            overflow: "hidden",
            p: 2,
          }}
        >
          {/* Fake title bar */}
          <Box
            sx={{
              width: "54%",
              height: 7,
              borderRadius: 4,
              bgcolor: i === 2 ? "rgba(142,45,226,0.22)" : "rgba(142,45,226,0.1)",
              mb: 1.5,
            }}
          />
          {/* Fake body lines */}
          {[90, 75, 58].map((w, j) => (
            <Box
              key={j}
              sx={{ width: `${w}%`, height: 5, borderRadius: 4, bgcolor: "rgba(0,0,0,0.07)", mb: 0.9 }}
            />
          ))}
          {/* Thumbnail placeholder on front card */}
          {i === 2 && (
            <Box
              sx={{
                position: "absolute",
                right: 12,
                bottom: 12,
                width: 46,
                height: 34,
                borderRadius: "8px",
                bgcolor: "rgba(142,45,226,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: 22, height: 14, borderRadius: "4px", bgcolor: "rgba(142,45,226,0.2)" }} />
            </Box>
          )}
          {/* Animated gradient accent on front card */}
          {i === 2 && (
            <Box
              component={motion.div}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "linear-gradient(90deg, #8E2DE2, #C084FC, #4A00E0)",
                backgroundSize: "200% 100%",
                animation: "sx-gradient-shift 3s ease infinite",
                transformOrigin: "left",
              }}
            />
          )}
        </Box>
      ))}

      {/* Floating sparkle (top-right) */}
      <Box
        component={motion.div}
        animate={{ y: [0, -9, 0], rotate: [0, 12, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: -12,
          right: 10,
          width: 34,
          height: 34,
          borderRadius: "50%",
          bgcolor: "rgba(142,45,226,0.1)",
          border: "1px solid rgba(142,45,226,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 17,
          zIndex: 10,
        }}
      >
        ✨
      </Box>

      {/* Floating paint dot (bottom-left) */}
      <Box
        component={motion.div}
        animate={{ y: [0, 7, 0], x: [0, -5, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        sx={{
          position: "absolute",
          bottom: 2,
          left: 4,
          width: 26,
          height: 26,
          borderRadius: "50%",
          bgcolor: "rgba(74,0,224,0.1)",
          border: "1px solid rgba(74,0,224,0.14)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          zIndex: 10,
        }}
      >
        🎨
      </Box>
    </Box>
  );
}

/* ---------- Main overlay ---------- */
export default function GenerationOverlay({
  open,
  progress = 0,
  message = "Crafting your content",
  detail,
  onCancel,
}: GenerationOverlayProps) {
  const currentStageIdx = STAGES.reduce(
    (acc, step, i) => (progress >= step.threshold ? i : acc),
    0
  );

  return (
    <AnimatePresence>
      {open && (
        <Box
          component={motion.div}
          key="gen-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32 }}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(253, 252, 255, 0.97)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          {/* Background orbs */}
          <AnimatedOrb size={420} top="-16%" right="4%" color="rgba(142,45,226,0.07)" blur={100} duration={11} />
          <AnimatedOrb size={360} bottom="-12%" left="2%" color="rgba(74,0,224,0.06)" blur={90} duration={14} delay={1.5} />
          <AnimatedOrb size={200} top="38%" right="14%" color="rgba(240,171,252,0.09)" blur={65} duration={8} delay={0.8} />

          {/* Card */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: 480,
              width: "90%",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Illustration */}
            <SlideBuildIllustration />

            {/* Stage pills */}
            <Box
              sx={{
                display: "flex",
                gap: 0.75,
                flexWrap: "wrap",
                justifyContent: "center",
                mb: 3.5,
              }}
            >
              {STAGES.map((stage, i) => {
                const done = i < currentStageIdx;
                const active = i === currentStageIdx;
                return (
                  <Box
                    key={i}
                    component={motion.div}
                    animate={
                      active
                        ? { scale: [1, 1.04, 1] }
                        : {}
                    }
                    transition={active ? { duration: 1.6, repeat: Infinity } : {}}
                    sx={{
                      px: 1.5,
                      py: 0.55,
                      borderRadius: "999px",
                      fontSize: "0.73rem",
                      fontWeight: 600,
                      letterSpacing: "0.01em",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.6,
                      bgcolor:
                        done || active ? "rgba(142,45,226,0.09)" : "rgba(0,0,0,0.04)",
                      color: done || active ? "#4A00E0" : "#C0C0C0",
                      border: `1px solid ${done || active ? "rgba(142,45,226,0.18)" : "transparent"}`,
                      transition: "all 0.4s ease",
                    }}
                  >
                    {done && (
                      <Box component="span" sx={{ fontSize: "0.68rem" }}>
                        ✓
                      </Box>
                    )}
                    {active && (
                      <Box
                        component={motion.span}
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1.1, repeat: Infinity }}
                        sx={{
                          display: "inline-block",
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          bgcolor: "#8E2DE2",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    {stage.label}
                  </Box>
                );
              })}
            </Box>

            {/* Progress bar */}
            <Box sx={{ width: "100%", mb: 3 }}>
              <Box
                sx={{
                  width: "100%",
                  height: 5,
                  borderRadius: 3,
                  bgcolor: "rgba(142,45,226,0.1)",
                  overflow: "hidden",
                }}
              >
                <Box
                  component={motion.div}
                  animate={{ width: `${Math.max(progress, 5)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    background: "linear-gradient(90deg, #8E2DE2, #C084FC, #4A00E0)",
                    backgroundSize: "200% 100%",
                    animation: "sx-gradient-shift 3s ease infinite",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: "0.77rem",
                  color: "#C0C0C0",
                  textAlign: "right",
                  fontWeight: 500,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.round(progress)}%
              </Typography>
            </Box>

            {/* Message */}
            <Typography
              sx={{
                fontFamily: "var(--font-display)",
                fontSize: { xs: "1.18rem", md: "1.42rem" },
                fontWeight: 700,
                color: "#0F0A19",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
                mb: detail ? 0.8 : 0,
              }}
            >
              {message}
              <Box component="span" sx={{ color: "#8E2DE2" }}>
                …
              </Box>
            </Typography>

            {detail && (
              <Typography
                sx={{
                  color: "#ABABAB",
                  fontSize: "0.88rem",
                  lineHeight: 1.55,
                }}
              >
                {detail}
              </Typography>
            )}

            {onCancel && (
              <Button
                variant="text"
                size="small"
                onClick={onCancel}
                sx={{
                  mt: 3,
                  color: "#ABABAB",
                  fontSize: "0.81rem",
                  "&:hover": {
                    color: "#8E2DE2",
                    bgcolor: "transparent",
                  },
                }}
              >
                Cancel generation
              </Button>
            )}
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
}
