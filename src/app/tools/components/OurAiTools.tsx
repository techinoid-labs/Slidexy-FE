"use client";

import { Box, Typography, Chip } from "@mui/material";
import Image from "next/image";

export default function OurAiTools() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100vw",
        background: "rgba(251, 250, 255, 1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 12 },
        px: { xs: 3, md: 12 },
        boxSizing: "border-box",
        mx: "auto",
        textAlign: "center",
        gap: { xs: 1, md: 1 },
      }}
    >
      {/* Chip */}
      <Chip
        icon={
          <Image
            src="/images/Stars.svg"
            alt="Icon"
            width={20}
            height={20}
            style={{ marginRight: 6 }}
          />
        }
        label="What We Offer"
        sx={{
          px: 2.5,
          py: 1.2,
          fontSize: "1rem",
          height: "auto",
          borderRadius: "600px",
          color: "#4A00E0",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
          backgroundColor: "rgba(242, 240, 255, 1)",
        }}
      />

      {/* Heading */}
      <Typography
        sx={{
          color: "rgba(26, 26, 26, 1)",
          fontWeight: 600,
          fontSize: { xs: "2rem", md: "2.5rem" },
          mt: 1,
        }}
      >
        Our AI Tools
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          color: "rgba(109, 109, 109, 1)",
          fontWeight: 400,
          fontSize: { xs: "1rem", md: "1.15rem" },
          maxWidth: 524,
          lineHeight: 1.6,
        }}
      >
        Turn any thought into a polished, on-brand presentation <br />
        powered by AI, styled by designers.
      </Typography>
    </Box>
  );
}
