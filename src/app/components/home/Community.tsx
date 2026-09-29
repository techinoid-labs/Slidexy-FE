"use client";

import { Box, Typography, Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CommunitySection() {
  return (
    <Box
      sx={{
        width: "100%",
        background: "#fff",
        px: { xs: 2.5, md: 10 },
        py: { xs: 6, md: 9 },
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4 }}
        sx={{
          position: "relative",
          overflow: "hidden",
          maxWidth: 960,
          mx: "auto",
          borderRadius: "28px",
          background: "linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 45%, #4a00e0 100%)",
          px: { xs: 3.5, md: 8 },
          py: { xs: 5, md: 7 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2.5,
          textAlign: "center",
          boxShadow: "0 30px 70px -24px rgba(74,0,224,0.45)",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 36px 80px -20px rgba(74,0,224,0.55)",
          },
        }}
      >
        <Box
          component={motion.div}
          animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          sx={{
            position: "absolute",
            top: "-30%",
            left: "15%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(192,132,252,0.35) 0%, transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />

        <Typography
          className="sx-display"
          component="h2"
          sx={{
            position: "relative",
            zIndex: 1,
            fontFamily: "var(--font-display)",
            color: "#fff",
            fontWeight: 700,
            fontSize: { xs: "1.5rem", md: "2.1rem" },
            letterSpacing: "-0.03em",
            maxWidth: 520,
          }}
        >
          Experience the future first
        </Typography>

        <Typography
          sx={{
            position: "relative",
            zIndex: 1,
            color: "rgba(255,255,255,0.72)",
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            maxWidth: 460,
            lineHeight: 1.6,
          }}
        >
          Join creators building decks in seconds — not hours. Start free, no credit card.
        </Typography>

        <Button
          component={Link}
          href="/tools/prompt-to-deck"
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          sx={{
            position: "relative",
            zIndex: 1,
            mt: 1,
            background: "#fff",
            color: "#4A00E0",
            boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
            "&:hover": {
              background: "#fff",
              boxShadow: "0 12px 36px rgba(0,0,0,0.28)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Create your first deck
        </Button>
      </Box>
    </Box>
  );
}
