"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme as useMuiTheme,
  Divider,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import NavProfileHandler from "../auth/NavProfileHandler";

export default function Header() {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigationItems = [
    { label: "Home", link: "/" },
    { label: "How it works", link: "/how-it-works" },
    { label: "Pricing", link: "/pricing" },
    { label: "Blogs", link: "/blog" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      component={motion.header}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        // Bone, not white, so the bar reads as part of the page rather
        // than a tray sitting on top of it.
        background: scrolled ? "rgba(241,240,238,0.84)" : "rgba(241,240,238,0.94)",
        backdropFilter: "blur(16px) saturate(1.4)",
        WebkitBackdropFilter: "blur(16px) saturate(1.4)",
        borderBottom: scrolled
          ? "1px solid rgba(142, 45, 226, 0.1)"
          : "1px solid rgba(142, 45, 226, 0.08)",
        color: "text.primary",
        transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: scrolled ? "0 4px 24px rgba(74, 0, 224, 0.06)" : "none",
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 5 },
          minHeight: { xs: 64, md: 72 },
          py: 0.5,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Box
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Image
              src="/images/Logo.svg"
              alt="Slidexy"
              width={148}
              height={52}
            />
          </Box>
        </Link>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mr: 4 }}>
              {navigationItems.map((item) => {
                const isActive = pathname === item.link;
                return (
                  <Link key={item.label} href={item.link} passHref style={{ textDecoration: "none", color: "inherit" }}>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        px: 1.75,
                        py: 0.5,
                        fontSize: "0.93rem",
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#0F0A19" : "#6B6478",
                        borderBottom: isActive ? "2px solid #8E2DE2" : "2px solid transparent",
                        transition: "color 0.15s ease",
                        "&:hover": { color: "#0F0A19" },
                      }}
                    >
                      {item.label}
                    </Box>
                  </Link>
                );
              })}
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, pl: 3, borderLeft: "1px solid #E4E1EA" }}>
              <Link href="/templates" style={{ textDecoration: "none", color: "inherit" }}>
                <Box
                  component="span"
                  sx={{
                    fontSize: "0.93rem",
                    fontWeight: 600,
                    color: "#0F0A19",
                    borderBottom: "2px solid #8E2DE2",
                    pb: 0.3,
                    whiteSpace: "nowrap",
                    transition: "color 0.15s ease",
                    "&:hover": { color: "#8E2DE2" },
                  }}
                >
                  Explore templates
                </Box>
              </Link>
              <Box
                component={Link}
                href="/tools/prompt-to-deck"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "#0F0A19",
                  color: "#fff",
                  px: 2.75,
                  py: 1.15,
                  fontSize: "0.93rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "background 0.15s ease",
                  "&:hover": { bgcolor: "#8E2DE2" },
                }}
              >
                Create deck
              </Box>
              <NavProfileHandler />
            </Box>
          )}

          {isMobile && (
            <>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: "16px",
                    border: "1px solid rgba(142, 45, 226, 0.1)",
                    boxShadow: "0 16px 40px rgba(74, 0, 224, 0.12)",
                  },
                }}
              >
                {navigationItems.map((item) => {
                  const isActive = pathname === item.link;
                  return (
                    <MenuItem
                      key={item.label}
                      component={Link}
                      href={item.link}
                      onClick={handleMenuClose}
                      sx={{
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "primary.main" : "inherit",
                        borderRadius: "10px",
                        mx: 1,
                        my: 0.25,
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  );
                })}
                <Divider sx={{ my: 1 }} />
                <MenuItem
                  component={Link}
                  href="/tools/prompt-to-deck"
                  onClick={handleMenuClose}
                  sx={{
                    mx: 1,
                    borderRadius: "10px",
                    fontWeight: 600,
                    color: "primary.main",
                  }}
                >
                  Create deck
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem className="w-full flex justify-center items-center" disableRipple>
                  <div className="flex items-center gap-2 w-full">
                    <NavProfileHandler showMail={true} />
                  </div>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
