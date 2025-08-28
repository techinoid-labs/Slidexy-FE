"use client";

import { Box, Typography, Chip, Button } from "@mui/material";
import Link from "next/link";
import Lottie from "lottie-react";
import templateAnimation from "@/json/Gif8-template-section.json";

export default function PresentationStyleSection() {
  const images = [
    "/images/theme01.svg",
    "/images/theme02.svg",
    "/images/theme03.svg",
    "/images/theme04.svg",
    "/images/theme05.svg",
    "/images/theme06.svg",
  ];

  return (
    <Box
      sx={{
        width: "100%",
        background: "#FBFAFF",
        px: { xs: 2, md: "162px" },
        py: { xs: 6, md: "80px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 6, md: "16px" },
        boxSizing: "border-box",
        mx: "auto",
      }}
    >
      {/* Badge */}
      <Chip
        icon={
          <img
            src="/images/Stars.svg"
            alt="Icon"
            width={20}
            height={20}
            style={{ marginRight: 4 }}
          />
        }
        label={
          <span style={{ fontWeight: 500, fontSize: "14px", color: "#4A00E0" }}>
            AI Presentation Styles
          </span>
        }
        sx={{
          mt: { xs: 0, md: 9 },
          background: "#F3F0FF",
          color: "#4A00E0",
          px: 2,
          py: 0.5,
          fontWeight: 500,
          fontSize: "1rem",
          borderRadius: "999px",
          width: "fit-content",
          mx: { xs: "auto", md: 0 },
          "& .MuiChip-icon": {
            marginRight: "6px",
          },
        }}
      />

      {/* Heading and Subtitle */}
      <Box sx={{ textAlign: { xs: "center", md: "center" } }}>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 500,
            fontSize: { xs: "1.6rem", md: "2.9rem" },
            color: "#18181B",
            mb: 2,
          }}
        >
          Style meets Intelligence
        </Typography>
        <Typography
          sx={{
            color: "#757575",
            fontSize: { xs: "0.9rem", md: "1rem" },
            mb: { xs: 0, md: 2 },
            maxWidth: 700,
            mx: { xs: "auto", md: 0 },
          }}
        >
          Turn any thought into a polished, on-brand presentation
          <br />
          powered by AI, styled by designers.
        </Typography>
      </Box>

      {/* Main Card */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          background: "#fff",
          borderRadius: "32px",
          boxShadow: "0 2px 24px 0 rgba(80, 80, 120, 0.07)",
          width: "100%",
          height: { xs: "auto", md: "auto" },
          gap: 6,
        }}
      >
        {/* Left Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            height: "100%",
            textAlign: { xs: "center", md: "left" },
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 4 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1.7rem", md: "2.3rem" },
              color: "#18181B",
              mb: 2,
            }}
          >
            AI Popular Templates
          </Typography>
          <Typography
            sx={{
              color: "#757575",
              fontSize: { xs: "0.9rem", md: "1.18rem" },
              mb: 4,
              maxWidth: 800,
            }}
          >
            Turn any thought into a polished, on-brand presentation
            <br />
            powered by AI, styled by designers.
          </Typography>
          <Link href="/templates">
            <Button
              variant="contained"
              sx={{
                background:
                  "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                color: "#fff",
                borderRadius: "999px",
                px: { xs: 3, md: 4 },
                py: { xs: 1, md: 1.5 },
                fontWeight: 500,
                fontSize: { xs: "16px", md: "16px" },
                textTransform: "none",
                width: "100%",
                height: "46px",
                boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.07)",
              }}
              endIcon={<span style={{ fontSize: 22, marginLeft: 4 }}>→</span>}
            >
              Learn More
            </Button>
          </Link>
        </Box>

        {/* Right Lottie Animation (replaces Image) */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Lottie
            animationData={templateAnimation}
            loop
            autoplay
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
