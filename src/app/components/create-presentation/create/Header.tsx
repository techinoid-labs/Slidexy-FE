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
import { useRouter } from "next/navigation";
export default function Header() {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 8 },
          minHeight: 60,
          mt: 1,
          flexDirection: "row", 
        }}
      >
        {/* Go Back Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            onClick={() => router.push("/home")}
            startIcon={
              <Image
                src="/arrow-left.svg"
                alt="Back"
                width={19}
                height={19}
              />
            }
            sx={{
              textTransform: "none",
              fontWeight: 500,
              color: "#1A1A1A",
              fontSize: { xs: "0.8rem", md: "1rem" },
              backgroundColor: "#F6F6F6",
              "&:hover": {
                backgroundColor: "#f3f0ff",
              },
              px: 2,
              py: 1,
            }}
          >
            Go back
          </Button>
        </Box>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/app-icon.svg"
              alt="Slides Logo"
              width={40}
              height={40}
            />
          </Box>
        </Link>
      </Toolbar>


    </AppBar>
  );
}
