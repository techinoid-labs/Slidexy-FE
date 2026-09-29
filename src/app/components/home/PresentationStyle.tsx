"use client";

import { Box, Typography, Chip, Button } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import templateAnimation from "@/json/Gif8-template-section.json";

export default function PresentationStyleSection() {
  return (
    <Box
      sx={{
        width: "100%",
        background: "#FBFAFF",
        px: { xs: 2, md: "100px" },
        py: { xs: 4, md: "48px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 6, md: "16px" },
        boxSizing: "border-box",
        mx: "auto",
      }}
    >
      {/* Badge */}
      <Chip
        icon={
          <img
            src="/images/Stars.svg"
            alt="Icon"
            width={20}
            height={20}
            style={{ marginRight: 4 }}
          />
        }
        label={
          <span style={{ fontWeight: 500, fontSize: "14px", color: "#4A00E0" }}>
            AI Presentation Styles
          </span>
        }
        sx={{
          mt: { xs: 0, md: 9 },
          background: "#F3F0FF",
          color: "#4A00E0",
          px: 2,
          py: 0.5,
          fontWeight: 500,
          fontSize: "1rem",
          borderRadius: "999px",
          width: "fit-content",
          mx: { xs: "auto", md: 0 },
          "& .MuiChip-icon": {
            marginRight: "6px",
          },
        }}
      />

      {/* Heading and Subtitle */}
      <Box sx={{ textAlign: { xs: "center", md: "center" } }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 500,
            fontSize: { xs: "1.5rem", md: "2.1rem" },
            color: "#18181B",
            mb: 2,
          }}
        >
          Intelligent, Beautiful Templates{" "}
        </Typography>
        <Typography
          sx={{
            color: "#757575",
            fontSize: { xs: "0.9rem", md: "1rem" },
            mb: { xs: 0, md: 2 },
            maxWidth: 700,
            mx: { xs: "auto", md: 0 },
          }}
        >
          Access a library of AI-powered presentation templates—perfect for
          startups, students, marketers, and educators. Each template adapts to
          your style, goals, and voice.
        </Typography>
      </Box>

      {/* Main Card */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          background: "#fff",
          borderRadius: "20px",
          border: "1px solid rgba(142, 45, 226, 0.1)",
          boxShadow: "0 2px 24px 0 rgba(80, 80, 120, 0.07)",
          width: "100%",
          height: { xs: "auto", md: "auto" },
          gap: 6,
          overflow: "hidden",
          transition: "box-shadow 0.3s ease",
          "&:hover": { boxShadow: "0 24px 50px -20px rgba(142,45,226,0.28)" },
        }}
      >
        {/* Left Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            height: "100%",
            textAlign: { xs: "center", md: "left" },
            px: { xs: 3, md: 6 },
            py: { xs: 3, md: 3 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1.4rem", md: "1.75rem" },
              color: "#18181B",
              mb: 2,
            }}
          >
            AI Popular Templates
          </Typography>
          <Typography
            sx={{
              color: "#757575",
              fontSize: { xs: "0.9rem", md: "1.18rem" },
              mb: 4,
              maxWidth: 800,
            }}
          >
            Turn any thought into a polished, on-brand presentation
            <br />
            powered by AI, styled by designers.
          </Typography>
          <Link href="/templates">
            <Button
              variant="contained"
              size="large"
              sx={{ width: "100%" }}
              endIcon={<span style={{ fontSize: 22, marginLeft: 4 }}>→</span>}
            >
              Learn More
            </Button>
          </Link>
        </Box>

        {/* Right Lottie Animation (replaces Image) */}
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
    </Box>
  );
}
