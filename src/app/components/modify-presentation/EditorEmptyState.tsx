"use client";

import { Box, Typography, Button } from "@mui/material";
import { AutoAwesome, Add } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { fadeUp, staggerContainer } from "@/lib/motion";

type EditorEmptyStateProps = {
  onCreateSlide?: () => void;
};

export default function EditorEmptyState({ onCreateSlide }: EditorEmptyStateProps) {
  const router = useRouter();

  return (
    <Box
      component={motion.div}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "60vh",
        px: 3,
        py: 6,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(142,45,226,0.18) 0%, transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <motion.div variants={fadeUp}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#8E2DE2",
            boxShadow: "0 8px 20px rgba(142, 45, 226, 0.25)",
            mb: 3,
          }}
        >
          <AutoAwesome sx={{ color: "#fff", fontSize: 32 }} />
        </Box>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Typography
          className="sx-display"
          sx={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: { xs: "1.5rem", md: "1.85rem" },
            color: "#0F0A19",
            mb: 1.5,
            letterSpacing: "-0.02em",
          }}
        >
          Your canvas is waiting
        </Typography>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Typography
          sx={{
            color: "#5B5568",
            fontSize: "1.05rem",
            maxWidth: 400,
            mb: 3.5,
            lineHeight: 1.6,
          }}
        >
          Generate a deck with AI, or start from a blank slide and build it your way.
        </Typography>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            variant="contained"
            startIcon={<AutoAwesome />}
            onClick={() => router.push("/tools/prompt-to-deck")}
          >
            Generate with AI
          </Button>
          {onCreateSlide && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={onCreateSlide}
            >
              Blank slide
            </Button>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}
