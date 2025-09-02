"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import { ArrowBack, ArrowForward, Star } from "@mui/icons-material";

const testimonials = [
  {
    text: "Slidexy has been a lifesaver for our team. We can focus on creating content, not designing slides.",
    name: "John D.",
    role: "Vice President, GoPro",
    avatar: "/images/avatar1.jpg",
    rating: 5,
  },
  {
    text: "I was amazed by how easy it was to use Slidexy. The presentations look professional and engaging",
    name: "Emily K.",
    role: "Product Manager, Figma",
    avatar: "/images/avatar2.jpg",
    rating: 5,
  },
  // {
  //   text: "An amazing tool for presentations. Saves hours of design work.",
  //   name: "Robert Fox",
  //   role: "CEO, TechCorp",
  //   avatar: "/images/avatar3.jpg",
  //   rating: 4,
  // },
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
        background: "#F9F9FB",
        px: { xs: 2, md: "200px" },
        py: { xs: 6, md: "96px" },
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        boxSizing: "border-box",
      }}
    >
      {/* Left Arrow */}
      <IconButton
        onClick={handlePrev}
        sx={{
          border: "1px solid #E0E0E0",
          width: 48,
          height: 48,
        }}
      >
        <ArrowBack />
      </IconButton>

      {/* Testimonial Content */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 700,
          textAlign: "center",
          mx: "auto",
          height: { sx: 400, md: 300 }, // fixed height so it doesn't jump
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Quote Image */}
        <Box sx={{ mb: 2 }}>
          <img
            src="/images/quote-mark.svg"
            alt="Quote Icon"
            width={40}
            height={40}
            style={{ width: 40, height: 40 }}
          />
        </Box>

        {/* Testimonial Text */}
        <Typography
          sx={{
            color: "#333",
            fontWeight: 600,
            maxWidth: 500,
            fontSize: { xs: "1.25rem", md: "1.4rem" },
            mb: 4,
            px: 2,
          }}
        >
          "{text}"
        </Typography>

        {/* Profile */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar src={avatar} alt={name} sx={{ width: 56, height: 56 }} />
          <Typography sx={{ fontWeight: 600 }}>{name}</Typography>
          {/* <Typography sx={{ fontSize: 14, color: "gray" }}>{role}</Typography> */}

          {/* Stars */}
          <Box sx={{ display: "flex", gap: 0.5, mt: 1 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                sx={{
                  fontSize: 22,
                  color: i < rating ? "#6C3DFF" : "#E0E0E0",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right Arrow */}
      <IconButton
        onClick={handleNext}
        sx={{
          border: "1px solid #E0E0E0",
          width: 48,
          height: 48,
        }}
      >
        <ArrowForward />
      </IconButton>
    </Box>
  );
}
