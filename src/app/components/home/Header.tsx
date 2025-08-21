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
import { usePathname } from "next/navigation"; // ✅ active route
import { Typography } from "@mui/material";

export default function Header() {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const pathname = usePathname(); // ✅ get current path

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = [
    { label: "Home", hasDropdown: false, link: "/home" },
    { label: "Templates", hasDropdown: false, link: "/templates" },
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
                gap:0.5,
                height: "100%",
              }}
            >
              {navigationItems.map((item) => {
                const isActive = pathname === item.link;
                return (
                  <Link key={item.label} href={item.link} passHref>
                    <Button
                      color="inherit"
                      endIcon={item.hasDropdown ? <KeyboardArrowDown /> : null}
                      sx={{
                        color: isActive ? "text.primary" : "text.secondary", // ✅ active color
                        fontSize: "16px",
                        fontWeight: isActive ? 500 : 400, // ✅ bold active
                        letterSpacing: 1,
                        px: 3,
                        mt:0.5,                        
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
                );
              })}
            </Box>
          )}

          {/* Right Side Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isMobile && (
              <>
                <Link href="/presentation/create" passHref>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 0.5,
                      backgroundColor: "#4A00E0",
                      color: "#fff",
                      borderRadius: "999px",
                      px: "20px",
                      py: "12px",
                      maxHeight: "48px",
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

                <Link href="/waiting-list" passHref>
                  <Button
                    variant="outlined"
                    endIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M7 2a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5H7zm0 2h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm5 2a1 1 0 0 0-1 1v4.586l-2.707 2.707a1 1 0 1 0 1.414 1.414l3-3A1 1 0 0 0 13 10V7a1 1 0 0 0-1-1z"
                        />
                      </svg>
                    }
                    sx={{
                      mt: "5px",
                      ml: "10px",
                      px: "20px",
                      py: "12px",
                      color: "#4A00E0",
                      borderRadius: "999px",                      
                      textTransform: "none",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Join the Waitlist
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
                          color: isActive
                            ? theme.palette.primary.main
                            : "inherit",
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    );
                  })}

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
