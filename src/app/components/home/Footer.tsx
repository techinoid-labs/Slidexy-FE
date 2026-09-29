"use client";

import { Box, Typography, Link, Stack } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Footer() {
  const pathname = usePathname();

  const navLinks = [
    { title: "Home", link: "/" },
    { title: "Tools", link: "/tools" },
    { title: "Templates", link: "/templates" },
    { title: "Privacy", link: "/privacy-policy" },
    { title: "FAQ's", link: "/faqs" },
    { title: "Pricing", link: "/pricing" },
    { title: "Blogs", link: "/blog" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background:
          "linear-gradient(180deg, #fff 0%, #F8F5FF 60%, #F3F0FF 100%)",
        textAlign: "center",
        py: { xs: 5, md: 6 },
        px: 2,
        borderTop: "1px solid rgba(142, 45, 226, 0.1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(142,45,226,0.4), transparent)",
        }}
      />

      <Box
        component={motion.div}
        whileHover={{ scale: 1.03 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 3,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Image
            src="/images/Logo.svg"
            alt="Slidexy"
            width={200}
            height={48}
            style={{ objectFit: "contain" }}
          />
        </Link>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.5, sm: 3 }}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 3, flexWrap: "wrap" }}
      >
        {navLinks.map((item) => {
          const isActive = pathname === item.link;
          return (
            <Link
              key={item.title}
              href={item.link}
              underline="none"
              sx={{
                color: isActive ? "#4A00E0" : "#5B5568",
                fontSize: { xs: "0.95rem", md: "0.95rem" },
                fontWeight: isActive ? 600 : 450,
                transition: "color 0.2s ease",
                "&:hover": { color: "#8E2DE2" },
              }}
            >
              {item.title}
            </Link>
          );
        })}
      </Stack>

      <Stack
        direction="row"
        spacing={1.5}
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
          {
            src: "/images/social-ico/instagram-ico.svg",
            alt: "Instagram",
            link: "https://www.instagram.com/slidexy_ai/",
          },
          {
            src: "/images/social-ico/linkedin-ico.svg",
            alt: "LinkedIn",
            link: "https://www.linkedin.com/company/slidexy/",
          },
          {
            src: "/images/social-ico/tiktok-ico.svg",
            alt: "TikTok",
            link: "https://www.tiktok.com/@slidexy_ai",
          },
        ].map((icon) => (
          <Link
            key={icon.alt}
            href={icon.link}
            target="_blank"
            underline="none"
            component={motion.a}
            whileHover={{ y: -3, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(142, 45, 226, 0.12)",
              transition: "background 0.2s ease, border-color 0.2s ease",
              "&:hover": {
                bgcolor: "#E8E4FF",
                borderColor: "rgba(142, 45, 226, 0.3)",
              },
            }}
          >
            <img src={icon.src} alt={icon.alt} width={20} height={20} />
          </Link>
        ))}
      </Stack>

      <Typography
        sx={{
          fontSize: "0.85rem",
          color: "#888",
        }}
      >
        Copyright © {new Date().getFullYear()} Slidexy. All rights reserved.
      </Typography>
    </Box>
  );
}
