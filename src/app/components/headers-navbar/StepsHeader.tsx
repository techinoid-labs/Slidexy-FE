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
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import { ACCENT, INK, MONO, MUTED, RULE } from "@/app/components/home/editorial";

/**
 * The bar above the making-a-deck steps.
 *
 * It was the last bit of the old kit still showing: an outlined pill
 * with a borrowed arrow icon, a text button, and a centred logo, all
 * sitting on nothing. The rest of the product is ruled, square and set
 * in mono at this size, and a header that disagrees with the page
 * under it is the thing that makes software look assembled rather than
 * designed.
 */
export default function StepsHeader() {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const { removeSlides } = useSlides();
  const pathname = usePathname();
  const [isAuthModalOpen, setAuthModalOpen] = React.useState(false);
  /**
   * Back a step, not back a page.
   *
   * The outline used to send you to /tools, which has never been a
   * route: the product was cut back to decks only and the index page
   * went with it, leaving this pointing at a 404. The step before an
   * outline is the composer that asked for it.
   */
  const handleGoBack = () => {
    if (pathname === "/editor") {
      router.push("/presentation/outline");
    } else if (pathname === "/presentation/outline") {
      router.push("/tools/prompt-to-deck");
    } else if (pathname === "/presentation/preview-slides") {
      router.push("/presentation/outline");
    } else if (pathname === "/presentation/create") {
      router.push("/");
    } else if (pathname.startsWith("/blog/")) {
      router.push("/blog");
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
          boxShadow: "none",
          borderBottom: `1px solid ${RULE}`,
          color: INK,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, md: 5 },
            minHeight: { xs: 60, md: 72 },
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
            <Box
              component="button"
              onClick={handleGoBack}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.9,
                fontFamily: MONO,
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: MUTED,
                background: "none",
                border: "none",
                p: 0,
                cursor: "pointer",
                transition: "color 0.15s ease",
                "&:hover": { color: ACCENT },
                // The arrow moves, not the label, so the hover reads as
                // a direction rather than a wobble.
                "&:hover .step-back-arrow": { transform: "translateX(-3px)" },
              }}
            >
              <ArrowBackRounded
                className="step-back-arrow"
                sx={{ fontSize: 16, transition: "transform 0.15s ease" }}
              />
              {!isMobile ? "Back" : ""}
            </Box>
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
            <Box
              component="button"
              onClick={() => {
                localStorage.removeItem("fileName");
                clearPersistedSlides();
                removeSlides();
                handleGoBack();
              }}
              sx={{
                fontFamily: MONO,
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: MUTED,
                background: "none",
                border: "none",
                p: 0,
                mr: 3,
                cursor: "pointer",
                transition: "color 0.15s ease",
                "&:hover": { color: ACCENT },
              }}
            >
              Start over
            </Box>
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
