"use client";

import { Box, Typography, Link, Stack } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation"; // ✅ for active route

export default function Footer() {
  const pathname = usePathname(); // ✅ current route

  const navLinks = [
    { title: "Home", link: "/" },
    { title: "Templates", link: "/templates" },
    { title: "Privacy", link: "/privacy-policy" },
    { title: "FAQ's", link: "/faqs" },
    { title: "Pricing", link: "/pricing" },
    // { title: "Blogs", link: "/blog" },
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
              width={236}
              height={36}
              className="object-cover sm:w-[236px] w-auto"
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

      {/* Social Icons */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        {[
          {
            src: "/images/social-ico/facebook-ico.svg",
            alt: "Facebook",
            link: "https://web.facebook.com/Slidexy",
          },
          // {
          //   src: "/images/x-icon.svg",
          //   alt: "Twitter",
          //   link: "https://web.facebook.com/Slidexy",
          // },
          {
            src: "/images/social-ico/instagram-ico.svg",
            alt: "Instagram",
            link: "https://www.instagram.com/slidexy_ai/",
          },
          {
            src: "/images/social-ico/linkedin-ico.svg",
            alt: "linkedin",
            link: "https://www.linkedin.com/company/slidexy/",
          },
          {
            src: "/images/social-ico/tiktok-ico.svg",
            alt: "tiktok",
            link: "https://www.tiktok.com/@slidexy_ai",
          },
        ].map((icon, idx) => (
          <Link key={idx} href={icon.link} target="_blank" underline="none">
            <img
              src={icon.src}
              alt={icon.alt}
              width={25}
              height={25}
              className="object-cover hover:p-[20px] hover:bg-[#E8E4FF] rounded-full"
              style={{ display: "block", cursor: "pointer" }}
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
