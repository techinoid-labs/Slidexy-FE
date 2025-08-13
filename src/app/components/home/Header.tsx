"use client";

import React from "react";
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
} from "@mui/material";
import { KeyboardArrowDown, Menu as MenuIcon } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/lib/theme-toggle";
import { Typography } from "@mui/material";

export default function Header() {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = [
    { label: "Templates", hasDropdown: false, link: "/templates" },
    { label: "Features", hasDropdown: false, link: "/features" },
    // { label: "Reports", hasDropdown: false, link: "/reports" },
    { label: "Product", hasDropdown: false, link: "/product" },
    // { label: "Blog", hasDropdown: false, link: "/blog" },
    { label: "Pricing", hasDropdown: false, link: "/pricing" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#fff",
        minHeight: 80,
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: "text.primary",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 6, md: 8 },
          minHeight: 64,
          mt: 1,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/images/Logo.svg"
              alt="Slides Logo"
              width={118}
              height={36}
            />
          </Box>
        </Link>
        {/* Desktop Navigation */}
        <Box sx={{ display: "flex", alignSelf: "flex-end" }}>
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: 5,
                height: "100%",
              }}
            >
              {navigationItems.map((item) => (
                <Link key={item.label} href={item.link} passHref>
                  <Button
                    color="inherit"
                    endIcon={item.hasDropdown ? <KeyboardArrowDown /> : null}
                    sx={{
                      color: "text.secondary",
                      fontSize: "1.35rem",
                      fontWeight: 500,
                      letterSpacing: 1,
                      px: 3,
                      height: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      "&:hover": {
                        color: "text.primary",
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </Box>
          )}

          {/* Right Side Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isMobile && (
              <>
                {/* <Typography
                sx={{
                  mt: 0.5,
                  color: "#4A00E0",
                  fontWeight: 500,
                  fontSize: "2 rem",
                  cursor: "pointer",
                  display: "inline-block",
                  px: 2,
                  py: 1,
                  lineHeight: 1.1,
                  borderRadius: "999px",
                  transition:
                    "background-color 0.2s ease-in-out, transform 0.2s ease-in-out",
                  "&:hover": {},
                }}
              >
                Login
              </Typography> */}

                {/* Try for Free button */}
                <Link href="/presentation/create" passHref>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 0.5,
                      backgroundColor: "#4A00E0",
                      color: "#fff",
                      borderRadius: "999px",
                      px: 3,
                      textTransform: "none",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      "&:hover": {
                        backgroundColor: "#3a00b8",
                      },
                    }}
                  >
                    Try for Free →
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu */}
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
                      mt: 1,
                      minWidth: 200,
                    },
                  }}
                >
                  {/* {navigationItems.map((item) => (
                  <MenuItem key={item.label} onClick={handleMenuClose}>
                    {item.label}
                  </MenuItem>
                ))} */}
                  {navigationItems.map((item) => (
                    <MenuItem
                      key={item.label}
                      component={Link}
                      href={item.link}
                      onClick={handleMenuClose}
                    >
                      {item.label}
                    </MenuItem>
                  ))}

                  {/* <MenuItem onClick={handleMenuClose}>Login</MenuItem> */}
                  <MenuItem
                    component={Link}
                    href="/presentation/create"
                    onClick={handleMenuClose}
                  >
                    Try for Free
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
