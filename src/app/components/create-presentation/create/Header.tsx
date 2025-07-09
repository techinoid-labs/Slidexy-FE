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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#fff",
        minHeight: 80,
        boxShadow: "none",
        color: "text.primary",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "center",
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
              src="/images/icon.png"
              alt="Slides Logo"
              width={44}
              height={44}
            />
          </Box>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
