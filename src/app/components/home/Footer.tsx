"use client";

import { Box, Typography, Link, Stack } from "@mui/material";
import Image from "next/image";

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 4,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex" }}>
            <Image
              src="/images/Logo.svg"
              alt="Slides Logo"
              width={118}
              height={36}
            />
          </Box>
        </Link>
      </Box>

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
