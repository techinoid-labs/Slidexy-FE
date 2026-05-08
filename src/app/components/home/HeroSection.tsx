"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Fab,
  useTheme,
  alpha,
} from "@mui/material";
import { ArrowForward, KeyboardArrowDown } from "@mui/icons-material";
import ResponsivePageWrapper from "@/lib/responsive-page-wrapper";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { analyticsEvent } from "@/lib/gtag";
import { useRef } from "react";

export default function HeroSection() {
  const [inputValue, setInputValue] = useState("");
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleRedirect = () => {
    analyticsEvent("get_started_click", {
      category: "engagement",
      label: "home_page_to_tools", // updated label for clarity
    });

    // Navigate to /tools
    router.push("/tools");
  };

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (inputValue.trim()) {
      current.set("prompt", inputValue.trim());
    } else {
      current.delete("prompt");
    }

    const search = current.toString();
    router.replace(`?${search}`, { scroll: false });
  }, [inputValue]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: { sx: 672, md: 672 },
          // height: 672,
          background: `radial-gradient(700px 220px at 50% 54%, #8E2DE210 0%, #FBF9FF 70%, #fff 100%)`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: 1,
            backgroundColor: "#ffffff",
          }}
        >        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            mt: { xs: -6, md: -16 },
            opacity: 0.6,
            pointerEvents: "none",
            width: { xs: 250, md: 450 },
            height: { xs: 200, md: 450 },
          }}
        >
          <Image
            src="/images/checkered-lines.svg"
            alt="Checkered Background"
            width={450}
            height={450}
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
          {/* IMAGE (Primary LCP Element) */}
          <Image
            src="/background-video.webp"
            alt="AI presentation maker background"
            fill
            priority
            fetchPriority="high"
            loading="eager"
            style={{
              objectFit: "cover",
              opacity: 0.1,
              zIndex: 2,
            }}
          />

          {/* VIDEO (Secondary/Progressive Load) */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setVideoReady(true)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: videoReady ? 0.1 : 0,
              transition: "opacity 1.5s ease",
              zIndex: 3,
            }}
          >
            <source src="/services-background.webm" type="video/webm" />
          </video>
        </Box>
        {/* Decorative Elements */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 10, md: 30 },
            left: { xs: 10, md: 200 },
            animation: "sparkle 2s ease-in-out infinite",
            width: { xs: 24, md: 72 },
            height: { xs: 24, md: 72 },
            display: { xs: "none", md: "block" },
            "@keyframes sparkle": {
              "0%, 100%": {
                opacity: 0.7,
                transform: "scale(1)",
              },
              "50%": {
                opacity: 1,
                transform: "scale(1.1)",
              },
            },
          }}
        >
          <Image
            src="/images/side-star-yellow.svg"
            alt="Icon"
            width={72}
            height={72}
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            mt: { xs: -6, md: -16 },
            opacity: 0.6,
            pointerEvents: "none",
            width: { xs: 250, md: 450 },
            height: { xs: 200, md: 450 },
          }}
        >
          <Image
            src="/images/checkered-lines.svg"
            alt="Checkered Background"
            width={450}
            height={450}
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </Box>

        <Container
          maxWidth="lg"
          sx={{
            pt: 0,
            pb: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Badge */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { xs: 2, md: 0 },
              mb: 2,
            }}
          >
            <Chip
              icon={
                <Image
                  src="/images/Stars.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                  style={{ marginRight: "4px", width: 18, height: 18 }}
                />
              }
              label="No sign-up needed for the first deck"
              sx={{
                px: 1.5,
                py: 0.7,
                fontSize: { xs: "0.8rem", md: "0.95rem" },
                height: "auto",
                borderRadius: "600px",
                border: "0.5px solid rgba(232, 228, 255, 1)",
                backgroundColor: "rgba(255, 255, 255, 0.12);",
                color: "#4A00E0",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
                "& .MuiChip-icon": {
                  color: "#4A00E0",
                  marginRight: "6px",
                },
              }}
            />
          </Box>
          {/* Main Heading */}
          <Box sx={{ textAlign: "center", mt: 1, mb: 2, zIndex: 100 }}>
            <Typography
              variant="h1"
              noWrap
              sx={{
                fontSize: { xs: 28, md: 28, lg: 38 },
                fontWeight: 550,
                mb: 4,
                lineHeight: 1.3,
                color: "#000000",
                whiteSpace: { xs: "normal", md: "nowrap" },
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              AI presentation maker
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.3,
                fontSize: { xs: "0.8rem", md: "1.2rem" },
                fontWeight: 350,
                textAlign: "center", // Ensure text is centered
              }}
            >
              <span>
                Free to use • No design skills required <br />
              </span>
              <Box
                component="span"
                sx={{
                  display: { xs: "block", md: "inline" },
                }}
              >
                powered by AI, styled by designers.
              </Box>
            </Typography>
          </Box>

          {/* Input Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 8,
              mt: { xs: 1, md: 0 },
            }}
          >
            <Box sx={{ position: "relative", maxWidth: 700, width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                  mt: 5,
                  ml: { xs: 0, md: 0 },
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                {/* Get Started Button */}
                <Box
                  sx={{
                    mb: { xs: -6, md: 2 },
                    alignItems: "center",
                    display: "flex",
                    zIndex: 2
                  }}
                >
                  <Button
                    onClick={() => handleRedirect()}
                    variant="contained"
                    endIcon={<ArrowForward />}
                    sx={{
                      ml: 2,
                      mt: { xs: 1, md: 1 },
                      px: 3,
                      py: 1.5,
                      width: "200px",
                      height: "48px",
                      fontSize: { xs: "0.875rem", md: "1rem" },
                      background: "#4A00E0",
                      color: "#fff",
                      textTransform: "none",
                      borderRadius: 2,
                      "&:hover": {
                        background: "#4A00E0",
                      },
                    }}
                  >
                    Get Started →
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { sx: 0, md: 0 },
              pb: { sx: 10, md: 0 },
            }}
          >
            <Button
              onClick={() => window.scroll(0, 800)}
              color="primary"
              endIcon={<KeyboardArrowDown />}
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.2rem" },
                color: "#4A00E0",
                whiteSpace: "nowrap",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "primary.dark",
                },
                fontWeight: 450,
                px: 2,
                py: 1,
                zIndex: 2
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
