"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import { ArrowBack, ArrowForward, Star } from "@mui/icons-material";

const testimonials = [
  {
    quote: "This AI presentation maker saved me hours of work.",
    text: "I just entered my topic and got a complete slide deck within seconds. Perfect for quick client presentations.",
    name: "Ali R.",
    role: "Marketing Executive",
    avatar: "/images/avatar1.jpg",
    rating: 5,
  },
  {
    quote: "Best free AI PPT generator I’ve tried so far.",
    text: "The interface is simple, and the slides look professional. I love that I can try it without signing up.",
    name: "Sara K.",
    role: "Freelancer",
    avatar: "/images/avatar2.jpg",
    rating: 5,
  },
  {
    quote: "Super helpful for students!",
    text: "I used this tool to create my university presentation, and it worked flawlessly. It made everything so much easier.",
    name: "Hassan M.",
    role: "Student",
    avatar: "/images/avatar3.jpg",
    rating: 5,
  },
  {
    quote: "Fast, clean, and very easy to use.",
    text: "No complicated steps — just enter text and get slides instantly. Great tool for beginners and professionals alike.",
    name: "Ayesha S.",
    role: "Business Owner",
    avatar: "/images/avatar1.jpg",
    rating: 5,
  },
  {
    quote: "Great tool for converting text into slides.",
    text: "I had a long document, and this AI turned it into a structured presentation in seconds. Highly recommended.",
    name: "Usman T.",
    role: "Project Manager",
    avatar: "/images/avatar2.jpg",
    rating: 5,
  },
  {
    quote: "Perfect for quick presentations without design skills.",
    text: "I’m not good at design, but this tool handled everything. The output looked clean and ready to use.",
    name: "Zain A.",
    role: "Consultant",
    avatar: "/images/avatar3.jpg",
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

  const { quote, text, name, role, avatar, rating } = testimonials[index];

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
            fontWeight: 700,
            maxWidth: 600,
            fontSize: { xs: "1.3rem", md: "1.5rem" },
            mb: 1,
            px: 2,
          }}
        >
          “{quote}”
        </Typography>
        <Typography
          sx={{
            color: "#555",
            fontWeight: 400,
            maxWidth: 550,
            fontSize: { xs: "1rem", md: "1.1rem" },
            mb: 4,
            px: 2,
            lineHeight: 1.6,
          }}
        >
          {text}
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
          <Typography sx={{ fontSize: 14, color: "gray" }}>{role}</Typography>

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
