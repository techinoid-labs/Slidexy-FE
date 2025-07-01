"use client";

import { Box, Typography, Chip, Button } from "@mui/material";

export default function WorkingSection() {
  return (
    <Box
      sx={{
        width: 1440,
        height: 862,
        background: "#fff",
        px: "162px",
        pt: "80px",
        pb: "80px",
        display: "flex",
        flexDirection: "column",
        gap: "48px",
        boxSizing: "border-box",
        mx: "auto",
      }}
    >
      {/* Badge and Try for Free Button Row */}
      {/* How it Works Badge */}
      <Box sx={{ mb: 2 }}>
        <Chip
          icon={
            <img
              src="/images/side-star-purple.svg"
              alt="Icon"
              width={18}
              height={18}
              style={{ marginRight: 4 }}
            />
          }
          label={
            <span
              style={{ fontWeight: 500, fontSize: "0.95rem", color: "#4A00E0" }}
            >
              How it Works?
            </span>
          }
          sx={{
            background: "#F3F0FF",
            color: "#4A00E0",
            px: 2,
            py: 0.4,
            fontWeight: 500,
            fontSize: "0.95rem",
            borderRadius: "999px",
            width: "fit-content",
            "& .MuiChip-icon": {
              marginRight: "6px",
            },
          }}
        />
      </Box>

      {/* Try for Free Button */}
      <Box>
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
            "&:hover": {
              background: "#8E2DE2",
            },
            ml: 115,
            mb: 3,
          }}
          endIcon={<span style={{ fontSize: 22, marginLeft: 4 }}>→</span>}
        >
          Try for Free
        </Button>
      </Box>

      {/* Heading */}
      <Typography
        variant="h1"
        sx={{
          fontWeight: 600,
          fontSize: { xs: "2.5rem", md: "3.5rem" },
          color: "#18181B",
          mb: 2,
          mt: -20,
        }}
      >
        From Idea to
        <br />
        Stunning Deck
      </Typography>
      {/* Main Content Row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 6,
          mt: 2,
          height: 422,
        }}
      >
        {/* Left Steps */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            justifyContent: "center",
          }}
        >
          {/* Step 1 */}
          <Box
            sx={{
              background: "#F9F9FB",
              borderRadius: "28px",
              p: 3,
              mb: 2,
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.03)",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "1.18rem",
                  color: "#6C2BD7",
                  mb: 1,
                }}
              >
                Drop In Your Idea
              </Typography>
              <Typography sx={{ color: "#757575", fontSize: "1.05rem" }}>
                Type a prompt, record a voice note, upload a sketch, or share a
                video. Our AI reads, hears, sees, and processes your input
                intelligently.
              </Typography>
            </Box>

            <Box
              sx={{
                ml: 2,
                width: 32,
                height: 32,
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "0 1px 4px 0 rgba(80, 80, 120, 0.07)",
                mt: -12,
              }}
            >
              <img
                src="/images/drop-icon.svg"
                alt="Tick"
                width={29}
                height={29}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Box>

          {/* Step 2 */}
          <Box
            sx={{
              background: "#F8F8FF",
              borderRadius: "28px",
              p: 3,
              mb: 2,
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.03)",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{ fontWeight: 500, fontSize: "1.13rem", color: "#18181B" }}
              >
                AI Builds the Story & Design
              </Typography>
            </Box>
            <Box
              sx={{
                ml: 2,
                color: "#B0AEEB",
                fontSize: 28,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  display: "inline-block",
                  background: "#fff",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  // display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 4px 0 rgba(80, 80, 120, 0.07)",
                }}
              >
                →
              </span>
            </Box>
          </Box>
          {/* Step 3 */}
          <Box
            sx={{
              background: "#F8F8FF",
              borderRadius: "28px",
              p: 3,
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.03)",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{ fontWeight: 500, fontSize: "1.13rem", color: "#18181B" }}
              >
                Customize & Share Instantly
              </Typography>
            </Box>
            <Box
              sx={{
                ml: 2,
                color: "#B0AEEB",
                fontSize: 28,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  display: "inline-block",
                  background: "#fff",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  // display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 4px 0 rgba(80, 80, 120, 0.07)",
                }}
              >
                →
              </span>
            </Box>
          </Box>
        </Box>
        {/* Right Image Placeholder */}
        <Box
          sx={{
            width: 650,
            height: 550,
            borderRadius: "20px",
            border: "0.78px solid #E9E9FF",
            background: "#F8F8FF",
            ml: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: -10,
          }}
        >
          <img
            src="/images/working-image.svg"
            alt="Tick"
            width={600}
            height={600}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "20px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
