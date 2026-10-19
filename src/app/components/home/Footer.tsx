"use client";

import React from "react";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok } from "react-icons/fa6";
import { ACCENT, INK, MONO, MUTED, RULE } from "./editorial";

/**
 * Footer.
 *
 * Was a lavender gradient panel with the links centred in a row and four
 * circular social buttons, which is the last thing on every page and so the
 * last impression the site leaves. It also still pointed at /tools, a route
 * that no longer exists.
 *
 * Now it is set like the colophon of a printed thing: a rule across the
 * top, columns of links, and the small print at the bottom. Flat, quiet,
 * and it does not try to be the loudest block on the page.
 */

const COLUMNS: { heading: string; links: { title: string; link: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { title: "Create a deck", link: "/tools/prompt-to-deck" },
      { title: "Templates", link: "/templates" },
      { title: "Pricing", link: "/pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { title: "Blog", link: "/blog" },
      { title: "FAQs", link: "/faqs" },
      { title: "Contact", link: "/#contact" },
    ],
  },
  {
    heading: "Legal",
    links: [{ title: "Privacy and terms", link: "/privacy-policy" }],
  },
];

const SOCIAL = [
  { icon: <FaLinkedinIn />, link: "https://www.linkedin.com/company/slidexy/", label: "LinkedIn" },
  { icon: <FaInstagram />, link: "https://www.instagram.com/slidexy_ai/", label: "Instagram" },
  { icon: <FaFacebookF />, link: "https://web.facebook.com/Slidexy", label: "Facebook" },
  { icon: <FaTiktok />, link: "https://www.tiktok.com/@slidexy_ai", label: "TikTok" },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: `1px solid ${INK}` }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.4fr repeat(3, 1fr)" },
            gap: { xs: 5, md: 6 },
            pt: { xs: 6, md: 8 },
            pb: { xs: 5, md: 7 },
          }}
        >
          <Box>
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Image src="/images/Logo.svg" alt="Slidexy" width={128} height={44} />
            </Link>
            <Typography
              sx={{ mt: 2, fontSize: "0.92rem", lineHeight: 1.6, color: MUTED, maxWidth: 300 }}
            >
              A presentation maker that hands you a file you can actually
              edit, not a picture of one.
            </Typography>

            <Box sx={{ display: "flex", gap: 2.5, mt: 3 }}>
              {SOCIAL.map((s) => (
                <Box
                  key={s.label}
                  component="a"
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  sx={{
                    color: "#A9A3B4",
                    fontSize: 16,
                    display: "flex",
                    transition: "color 0.15s ease",
                    "&:hover": { color: INK },
                  }}
                >
                  {s.icon}
                </Box>
              ))}
            </Box>
          </Box>

          {COLUMNS.map((col) => (
            <Box key={col.heading}>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.66rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#A9A3B4",
                  mb: 2,
                }}
              >
                {col.heading}
              </Typography>
              {col.links.map((l) => (
                <Box key={l.title} sx={{ mb: 1.25 }}>
                  <Link href={l.link} style={{ textDecoration: "none", color: "inherit" }}>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.93rem",
                        color: MUTED,
                        transition: "color 0.15s ease",
                        "&:hover": { color: ACCENT },
                      }}
                    >
                      {l.title}
                    </Typography>
                  </Link>
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            borderTop: `1px solid ${RULE}`,
            py: 3,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontFamily: MONO, fontSize: "0.72rem", color: "#A9A3B4" }}>
            © {new Date().getFullYear()} Slidexy
          </Typography>
          <Typography sx={{ fontFamily: MONO, fontSize: "0.72rem", color: "#A9A3B4" }}>
            Built for people who have to hand the file over
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
