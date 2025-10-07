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
import { useSlides } from "@/app/context/SlidesContext";
import { clearPersistedSlides } from "@/app/store/store";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "../auth/AuthModal";
import NavProfileHandler from "../auth/NavProfileHandler";
export default function StepsHeader() {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const { removeSlides } = useSlides();
  const pathname = usePathname();
  const [isAuthModalOpen, setAuthModalOpen] = React.useState(false);
  const handleGoBack = () => {
    if (pathname === "/editor") {
      router.push("/presentation/outline");
    } else if (pathname === "/presentation/outline") {
      router.push("/presentation/create");
    } else if (pathname === "/presentation/create") {
      router.push("/");
    } else {
      router.back(); // fallback
    }
  };

  return (
    <>
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
              onClick={() => {
                handleGoBack();
              }}
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
              {!isMobile ? "Go back" : ""}
            </Button>
          </Box>

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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => {
                localStorage.removeItem("fileName");
                clearPersistedSlides();
                removeSlides();
                handleGoBack();
              }}
              // startIcon={
              //   <Image src="/arrow-left.svg" alt="Back" width={19} height={19} />
              // }
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
              Cancel
            </Button>
            <NavProfileHandler setAuthModalOpen={setAuthModalOpen} />
          </Box>
        </Toolbar>
      </AppBar>
      <AuthModal
        open={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
