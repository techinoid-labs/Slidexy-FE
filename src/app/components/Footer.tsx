"use client";

import { Box, Typography, Link, Stack } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#fff",
        textAlign: "center",
        py: { xs: 5, md: 6 },
        px: 2,
        borderTop: "1px solid #f2f2f2",
      }}
    >
      {/* Logo */}
      <Typography
        sx={{
          fontSize: { xs: "1.8rem", md: "2rem" },
          fontWeight: 700,
          color: "#5F00D6",
          mb: 3,
        }}
      >
        LOGO
      </Typography>

      {/* Nav Links */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 4 }}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        {["Templates", "Features", "Reports", "Product", "Blog"].map((item) => (
          <Link
            key={item}
            href="#"
            underline="none"
            sx={{
              color: "#555",
              fontSize: { xs: "0.95rem", md: "1rem" },
              fontWeight: 400,
            }}
          >
            {item}
          </Link>
        ))}
      </Stack>

      {/* Social Icons */}
      <Stack
        direction="row"
        spacing={3}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        {[
          { src: "/images/facebook-icon.svg", alt: "Facebook" },
          { src: "/images/x-icon.svg", alt: "Twitter" },
          { src: "/images/instagram.svg", alt: "Instagram" },
        ].map((icon, idx) => (
          <Link key={idx} href="#" underline="none">
            <img
              src={icon.src}
              alt={icon.alt}
              width={24}
              height={24}
              style={{ display: "block" }}
            />
          </Link>
        ))}
      </Stack>

      {/* Copyright */}
      <Typography
        sx={{
          fontSize: { xs: "0.8rem", md: "0.875rem" },
          color: "#888",
        }}
      >
        Copyright © 2025. All Rights Reserved.
      </Typography>
    </Box>
  );
}
