"use client";

import { Box, Typography, Link, Stack } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation"; // ✅ for active route

export default function Footer() {
  const pathname = usePathname(); // ✅ current route

  const navLinks = [
    { title: "Home", link: "/" },
    { title: "Templates", link: "/templates" },
    { title: "Pricing", link: "/pricing" },
  ];

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
        {navLinks.map((item) => {
          const isActive = pathname === item.link;
          return (
            <Link
              key={item.title}
              href={item.link}
              underline="none"
              sx={{
                color: isActive ? "#000" : "#555", // ✅ highlight active
                fontSize: { xs: "0.95rem", md: "1rem" },
                fontWeight: isActive ? 600 : 400, // ✅ bold active
              }}
            >
              {item.title}
            </Link>
          );
        })}
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
