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
    { label: "Tools", link: "/tools" },
    { label: "Templates", link: "/templates" },
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
        background: scrolled ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.92)",
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, mr: 1.5 }}>
              {navigationItems.map((item) => {
                const isActive = pathname === item.link;
                return (
                  <Link key={item.label} href={item.link} passHref>
                    <Button
                      color="inherit"
                      sx={{
                        position: "relative",
                        color: isActive ? "primary.main" : "inherit",
                        opacity: isActive ? 1 : 0.75,
                        fontSize: "0.95rem",
                        fontWeight: isActive ? 600 : 500,
                        px: 2,
                        py: 1,
                        borderRadius: "999px",
                        "&:hover": {
                          opacity: 1,
                          backgroundColor: "rgba(142, 45, 226, 0.06)",
                        },
                        "&::after": isActive
                          ? {
                              content: '""',
                              position: "absolute",
                              bottom: 4,
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: 18,
                              height: 3,
                              borderRadius: 2,
                              background: "linear-gradient(90deg, #8E2DE2, #4A00E0)",
                            }
                          : {},
                      }}
                    >
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Button
                component={Link}
                href="/tools/prompt-to-deck"
                variant="contained"
                size="small"
                sx={{ px: 2.5 }}
              >
                Create deck
              </Button>
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
