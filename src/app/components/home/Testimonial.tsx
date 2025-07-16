"use client";

import { Box, Typography, Button } from "@mui/material";

export default function TestimonialSection() {
  return (
    <Box
      sx={{
        width: '100%',
        background: "#F9F9FB",
        px: { xs: 2, md: "112px" },
        py: { xs: 6, md: "96px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        gap: { xs: 6, md: "152px" },
        mx: "auto",
      }}
    >
      {/* Main Content Row */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 4, md: 'auto' },
        }}
      >
        {/* Left Arrow */}
        <Button
          sx={{
            minWidth: 0,
            width: 50,
            height: 50,
            p: 0,
            borderRadius: '50%',
            background: 'transparent',
            boxShadow: '0 1px 4px 0 rgba(80, 80, 120, 0.07)',
            '&:hover': { background: '#F3F0FF' },
            mx: { xs: "auto", md: 8 },
          }}
        >
          <img
            src="/images/left-arrow.svg"
            alt="Left Arrow"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        </Button>

        {/* Testimonial Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: "center",
            px: { xs: 2, md: 0 },
          }}
        >
          {/* Quote Icon */}
          <Box sx={{ mb: { xs: 2, md: 2 } }}>
            <img
              src="/images/quote-mark.svg"
              alt="Opening Quote"
              width={40}
              height={40}
              style={{ width: 40, height: 40 }}
            />
          </Box>

          {/* Testimonial Text */}
          <Typography
            sx={{
              color: '#444',
              fontWeight: 400,
              fontSize: { xs: '1.2rem', md: '1.2rem' },
              textAlign: 'center',
              mb: { xs: 3, md: 4 },
              maxWidth: 700,
            }}
          >
            I needed a pitch deck for investment but had no business background.
            Your AI created a near-perfect presentation in minutes.
          </Typography>

          {/* Divider */}
          <Box sx={{ width: 40, height: 1, background: '#E0E0E0', mb: { xs: 2, md: 3 } }} />

          {/* Logo Placeholder */}
          <Box sx={{ mb: { xs: 1, md: 3 } }}>
            <img
              src="/images/client-logo.svg"
              alt="Testimonial Card"
              width={200}
              height={120}
              style={{ display: 'block' }}
            />
          </Box>
        </Box>

        {/* Right Arrow */}
        <Button
          sx={{
            minWidth: 0,
            width: 50,
            height: 50,
            p: 0,
            borderRadius: '50%',
            background: 'transparent',
            boxShadow: '0 1px 4px 0 rgba(80, 80, 120, 0.07)',
            '&:hover': { background: '#F3F0FF' },
            mx: { xs: "auto", md: 8 },
          }}
        >
          <img
            src="/images/right-arrow.svg"
            alt="Right Arrow"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        </Button>
      </Box>
    </Box>
  );
}
