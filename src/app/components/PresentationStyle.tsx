"use client";

import { Box, Typography, Chip, Button } from "@mui/material";

export default function PresentationStyleSection() {
  return (
    <Box
      sx={{
        width: '100%',
        background: "#FBFAFF",
        px: "162px",
        py: "80px",
        display: "flex",
        flexDirection: "column",
        gap: "48px",
        boxSizing: "border-box",
        mx: "auto",
      }}
    >
      {/* Badge */}
      <Chip
        icon={
          <img
            src="/images/side-star-purple.svg"
            alt="Icon"
            width={20}
            height={20}
            style={{ marginRight: 4 }}
          />
        }
        label={
          <span style={{ fontWeight: 500, fontSize: "1rem", color: "#4A00E0" }}>
            AI Presentation Styles
          </span>
        }
        sx={{
          background: "#F3F0FF",
          color: "#4A00E0",
          px: 2,
          py: 0.5,
          fontWeight: 500,
          fontSize: "1rem",
          borderRadius: "999px",
          mb: 2,
          width: "fit-content",
          '& .MuiChip-icon': {
            marginRight: '6px',
          },
        }}
      />
      {/* Heading and Subtitle */}
      <Box>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            color: "#18181B",
            mb: 2,
          }}
        >
          Style meets Intelligence
        </Typography>
        <Typography
          sx={{
            color: "#757575",
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            mb: 2,
            maxWidth: 600,
          }}
        >
          Turn any thought into a polished, on-brand presentation —<br />powered by AI, styled by designers.
        </Typography>
      </Box>
      {/* Carousel Dots */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1, mt: -6, mb: 2 }}>
        {[0, 1, 2, 3].map((dot) => (
          <Box
            key={dot}
            sx={{
              width: dot === 1 ? 24 : 10,
              height: 10,
              borderRadius: 5,
              background: dot === 1 ? "#4A00E0" : "#E5E5F0",
              mx: 0.5,
              transition: "background 0.2s",
              display: "inline-block",
            }}
          />
        ))}
      </Box>
      {/* Main Card */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          background: "#fff",
          borderRadius: "32px",
          boxShadow: "0 2px 24px 0 rgba(80, 80, 120, 0.07)",
          width: "100%",
          height: 570,
          px: 6,
          py: 4,
          gap: 6,
        }}
      >
        {/* Left Content */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          <Typography sx={{ fontWeight: 500, fontSize: { xs: "2rem", md: "2.3rem" }, color: "#18181B", mb: 2 }}>
            AI Popular themes
          </Typography>
          <Typography sx={{ color: "#757575", fontSize: { xs: "1.1rem", md: "1.18rem" }, mb: 4 }}>
            Turn any thought into a polished, on-brand presentation —<br />powered by AI, styled by designers.
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: "#6C2BD7",
              color: "#fff",
              borderRadius: "999px",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: "1.1rem",
              textTransform: "none",
              width: "fit-content",
              boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.07)",
              '&:hover': {
                background: "#4A00E0",
              },
            }}
            endIcon={<span style={{ fontSize: 22, marginLeft: 4 }}>→</span>}
          >
            Learn More
          </Button>
        </Box>
        {/* Right Image Placeholder */}
        <Box
          sx={{
            width: 546,
            height: 422,
            borderRadius: "30px",
            background: "#F6F6F6",
            ml: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ color: "#B0AEEB" }}>[Image Placeholder]</Typography>
        </Box>
      </Box>
    </Box>
  );
}
