"use client";

import { Box, Typography, Chip } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import AnimatedOrb from "@/app/components/shared/AnimatedOrb";

export default function OurAiTools() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: { xs: 7, md: 9 },
        pb: { xs: 6, md: 8 },
        px: { xs: 3, md: 12 },
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 55% 45% at 50% 0%, rgba(142,45,226,0.07) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <AnimatedOrb
        size={280}
        top="-25%"
        right="8%"
        color="rgba(142, 45, 226, 0.12)"
        blur={60}
      />

      <Box
        component={motion.div}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        sx={{ position: "relative", zIndex: 1, maxWidth: 680 }}
      >
        <motion.div variants={fadeUp}>
          <Chip
            icon={<AutoAwesome sx={{ fontSize: 16, color: "#8E2DE2 !important" }} />}
            label="Tool hub"
            sx={{
              px: 1.5,
              py: 0.5,
              mb: 2.5,
              fontWeight: 600,
              bgcolor: "rgba(142, 45, 226, 0.08)",
              color: "#4A00E0",
              border: "1px solid rgba(142, 45, 226, 0.16)",
            }}
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <Typography
            component="h1"
            className="sx-display"
            sx={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: { xs: "1.9rem", md: "2.6rem" },
              letterSpacing: "-0.03em",
              color: "#0F0A19",
              mb: 2,
            }}
          >
            AI presentation tools
          </Typography>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Typography
            sx={{
              color: "#5B5568",
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.65,
            }}
          >
            From a single prompt, a video, or a URL — generate decks, templates,
            infographics, and more. Pick a tool and start building.
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
}
