"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import { ArrowBack, ArrowForward, Star } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { easeOutExpo } from "@/lib/motion";

const testimonials = [
  {
    text: "Slidexy cut my slide prep time in half! The AI presentation generator is a game-changer.",
    name: "John D.",
    role: "Vice President, GoPro",
    avatar: "/images/avatar1.jpg",
    rating: 5,
  },
  {
    text: "From video uploads to full decks—this AI PPT maker saves me hours every week.",
    name: "Emily K.",
    role: "Product Manager, Figma",
    avatar: "/images/avatar2.jpg",
    rating: 5,
  },
];

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const { text, name, role, avatar, rating } = testimonials[index];

  return (
    <Box
      sx={{
        width: "100%",
        background:
          "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(142,45,226,0.06) 0%, #FBFAFF 50%, #fff 100%)",
        px: { xs: 2, md: 10 },
        py: { xs: 6, md: 10 },
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 1, md: 4 },
        boxSizing: "border-box",
      }}
    >
      <IconButton
        onClick={handlePrev}
        aria-label="Previous testimonial"
        sx={{
          border: "1px solid rgba(142, 45, 226, 0.15)",
          width: 48,
          height: 48,
          bgcolor: "#fff",
          "&:hover": {
            bgcolor: "rgba(242, 240, 255, 1)",
            borderColor: "#8E2DE2",
          },
        }}
      >
        <ArrowBack />
      </IconButton>

      <Box
        sx={{
          flex: 1,
          maxWidth: 640,
          textAlign: "center",
          mx: "auto",
          minHeight: { xs: 280, md: 260 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 0.5, mb: 2.5 }}>
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} sx={{ color: "#8E2DE2", fontSize: 22 }} />
              ))}
            </Box>

            <Typography
              className="sx-display"
              sx={{
                fontFamily: "var(--font-display)",
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                fontWeight: 600,
                color: "#0F0A19",
                lineHeight: 1.5,
                mb: 3,
                letterSpacing: "-0.02em",
              }}
            >
              &ldquo;{text}&rdquo;
            </Typography>

            <Avatar
              src={avatar}
              alt={name}
              sx={{
                width: 56,
                height: 56,
                mb: 1.5,
                border: "2px solid rgba(142, 45, 226, 0.3)",
                boxShadow: "0 4px 16px rgba(142, 45, 226, 0.2)",
              }}
            />
            <Typography sx={{ fontWeight: 600, color: "#0F0A19" }}>{name}</Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "#5B5568" }}>{role}</Typography>
          </motion.div>
        </AnimatePresence>
      </Box>

      <IconButton
        onClick={handleNext}
        aria-label="Next testimonial"
        sx={{
          border: "1px solid rgba(142, 45, 226, 0.15)",
          width: 48,
          height: 48,
          bgcolor: "#fff",
          "&:hover": {
            bgcolor: "rgba(242, 240, 255, 1)",
            borderColor: "#8E2DE2",
          },
        }}
      >
        <ArrowForward />
      </IconButton>
    </Box>
  );
}
