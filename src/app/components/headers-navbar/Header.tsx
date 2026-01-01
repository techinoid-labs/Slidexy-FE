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
  Divider,
} from "@mui/material";
import { KeyboardArrowDown, Menu as MenuIcon } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ active route
import { Typography } from "@mui/material";
import AuthModal from "../auth/AuthModal";
import NavProfileHandler from "../auth/NavProfileHandler";
import { useUser } from "@/app/context/AuthContext";
export default function Header() {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const pathname = usePathname(); // ✅ get current path
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const isAcountsPage = pathname.includes("account");
  // console.log(isAcountsPage);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = [
    { label: "Home", hasDropdown: false, link: "/" },
    { label: "Tools", hasDropdown: false, link: "/tools" },
    { label: "Templates", hasDropdown: false, link: "/templates" },
    // { label: "Privacy", hasDropdown: false, link: "/privacy-policy" },
    // { label: "FAQ's", hasDropdown: false, link: "/faqs" },
    { label: "Pricing", hasDropdown: false, link: "/pricing" },
    { label: "Blogs", hasDropdown: false, link: "/blog" },
  ];
  return (
    <>
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
          <Box
            sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Image
                  src="/images/Logo.svg"
                  alt="Slides Logo"
                  width={158}
                  height={56}
                />
              </Box>
              {/* Profile button */}
            </Link>
          </Box>
          {/* Desktop Navigation */}
          <Box sx={{ display: "flex", alignSelf: "flex-end" }}>
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 0.5,
                  height: "100%",
                }}
              >
                {navigationItems.map((item) => {
                  const isActive = pathname === item.link;
                  return (
                    <Link key={item.label} href={item.link} passHref>
                      <Button
                        color="inherit"
                        endIcon={
                          item.hasDropdown ? <KeyboardArrowDown /> : null
                        }
                        sx={{
                          color: isActive ? "text.primary" : "text.secondary",
                          fontSize: "16px",
                          fontWeight: isActive ? 500 : 400,
                          letterSpacing: 1,
                          px: 3,
                          mt: 0.5,
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
                  {/* <Link href="/waiting-list" passHref>
                    <Button
                      variant="outlined"
                      sx={{
                        mt: "5px",
                        ml: "10px",
                        px: "20px",
                        py: "12px",
                        color: "#4A00E0",
                        height: "48px",
                        background: "#F2F0FF",
                        borderRadius: "999px",
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Join the Waitlist
                    </Button>
                  </Link> */}

                  <NavProfileHandler />

                  {!isAcountsPage && !user && (
                    <Link href="/tools" passHref>
                      <Button
                        variant="contained"
                        sx={{
                          mt: 0.9,
                          mb: 1.06,
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
                  )}
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
                    <Divider />
                    <MenuItem
                      className="w-full flex justify-center items-center"
                      // component={Link}
                      // href="/presentation/create"
                      // onClick={handleMenuClose}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <NavProfileHandler
                          // size={20}
                          showMail={true} 
                        />
                      </div>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
