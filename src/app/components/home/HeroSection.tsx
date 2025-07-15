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
import { KeyboardArrowDown } from "@mui/icons-material";
import ResponsivePageWrapper from "@/lib/responsive-page-wrapper";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function HeroSection() {
  const [inputValue, setInputValue] = useState("");
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRedirect = () => {
    const encodedQuery = encodeURIComponent(inputValue.trim());
    router.push(
      `/presentation/create${encodedQuery ? `?prompt=${encodedQuery}` : ""}`
    );
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
          height: 672,
          background: `radial-gradient(700px 220px at 50% 54%, #8E2DE210 0%, #FBF9FF 70%, #fff 100%)`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
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
            width: { xs: 120, md: 450 },
            height: { xs: 120, md: 450 },
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
          <Box sx={{ display: "flex", justifyContent: "center", mt: 7, mb: 2 }}>
            <Chip
              icon={
                <Image
                  src="/images/side-star-purple.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                  style={{ marginRight: "4px", width: 18, height: 18 }}
                />
              }
              label="No sign-up needed for the first deck."
              sx={{
                px: 1.5,
                py: 0.7,
                fontSize: { xs: "0.8rem", md: "0.95rem" },
                height: "auto",
                borderRadius: "600px",
                backgroundColor: "#E8E4FF",
                color: "#4A00E0",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
                border: "none",
                "& .MuiChip-icon": {
                  color: "#4A00E0",
                  marginRight: "6px",
                },
              }}
            />
          </Box>
          {/* Main Heading */}
          <Box sx={{ textAlign: "center", mt: 1, mb: 6, zIndex: 100 }}>
            <Typography
              variant="h1"
              noWrap
              sx={{
                fontSize: { xs: "2rem", md: "3rem", lg: "3.2rem" },
                fontWeight: 550,
                mb: 4,
                lineHeight: 1.3,
                color: "#000000",
                whiteSpace: { xs: "normal", md: "nowrap" },
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Your Idea,{" "}
              <Typography
                component="span"
                variant="inherit"
                sx={{ color: "#000000" }}
              >
                Instantly on Slides.
              </Typography>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.3,
                fontSize: { xs: "0.9rem", md: "1.1rem" },
                fontWeight : 350
              }}
            >
              Turn any thought into a polished, on-brand presentation —<br />
              powered by AI, styled by designers.
            </Typography>
          </Box>

          {/* Input Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 8,
              mt: { xs: 1, md: -5 },
            }}
          >
            <Box sx={{ position: "relative", maxWidth: 700, width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: -9,
                  mb: 2,
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                {/* Input Field with Voice Icon */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    borderRadius: "999px",
                    paddingLeft: 2,
                    mt: 5,
                    paddingRight: 0.5,
                    border: "2px solid #8E2DE2",
                    boxShadow: "4px 5px 0px 0px #8E2DE2",
                    width: { xs: "90vw", sm: "100%", md: 660 },
                    maxWidth: { xs: 320, md: 660 },
                    height: { xs: 48, md: 72 },
                    
                  }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="e.g Pitch deck for a health tech startup |"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleRedirect();
                      }
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        border: "none",
                        "& fieldset": { border: "none" },
                        fontSize: { xs: "0.4rem", md: "1.125rem" },
                        px: 2,
                        py: 1,

                      },
                    }}
                  />

                  <IconButton
                    color="primary"
                    sx={{
                      p: 1,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                      width: { xs: 34, md: 40 },
                      height: { xs: 34, md: 40 },
                    }}
                  >
                    <Image
                      src="/images/voice-icon.svg"
                      alt="Voice Icon"
                      width={40}
                      height={40}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    // display: { xs: "none", md: "flex" },
                    mb: {xs: -10, md: 0},
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => handleRedirect()}
                    // component={Link}
                    // href="/presentation/create"
                    sx={{
                      p: 0,
                      minWidth: "auto",
                      ml: 2,
                      mt: { xs: 1, md: 6 },
                    }}
                  >
                    <Image
                      src="/images/try-for-free-arrow.svg"
                      alt="Try for free Icon"
                      width={130}
                      height={130}
                    />
                  </Button>
                </Box>
              </Box>
              {/* Try for Free text - hide on mobile */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  mt: -23,
                  mb: 4,
                  ml: { xs: 0, md: 100 },
                  mr: { xs: 2, md: 20 },
                  px: 2,
                  position: "relative",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    fontWeight: 500,
                    color: "#454545",
                    whiteSpace: "nowrap",
                    textAlign: "right",
                  }}
                >
                  Try for Free
                </Typography>
              </Box>
              {/* Try for Free vector - hide on mobile */}
              <Box
                sx={{
                  mt: -3,
                  display: { xs: "none", md: "flex" },
                  justifyContent: "flex-end",
                  width: "100%",
                  ml: 10,
                }}
              >
                <Image
                  src="/images/try-for-free-vector.svg"
                  alt="Arrow under text"
                  width={90}
                  height={90}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: {sx: -20, md: 0},
              mb: {sx: 10, md: 0},
            }}
          >
            <Button
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
