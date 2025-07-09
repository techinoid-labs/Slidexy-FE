"use client";

import { Box, Typography, Chip } from "@mui/material";
import Image from "next/image";

export default function PurposeSection() {
  return (
    <Box
      sx={{
        width: "100%",
        background: "#fff",
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 0 },
      }}
    >
      {/* Top Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexDirection: { xs: "column", md: "row" },
          maxWidth: 1200,
          mx: "auto",
          mb: 4,
        }}
      >
        <Box sx={{ margin: "auto" }}>
          <Chip
            icon={
              <img
                src="/images/side-star-purple.svg"
                alt="Icon"
                width={20}
                height={20}
                style={{ marginRight: "4px" }}
              />
            }
            label={
              <span
                style={{ fontWeight: 500, fontSize: "1rem", color: "#4A00E0" }}
              >
                Platform
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
              "& .MuiChip-icon": {
                marginRight: "6px",
              },
              ml: { xs: 0, md: -9 },
              display: "inline-flex",
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontWeight: 520,
              fontSize: { xs: "2rem", md: "3rem" },
              color: "#18181B",
              mb: 0.5,
              ml: { xs: 0, md: -8 },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Why
            <br />
            PromptSlide?
          </Typography>
        </Box>
        <Typography
          sx={{
            color: "#757575",
            fontSize: { xs: "1.3rem", md: "1.3rem" },
            maxWidth: 600,
            mt: { xs: 2, md: 2 },
            textAlign: { xs: "center", md: "right" },
          }}
        >
          Turn any thought into a polished, on-brand presentation —
          <br />
          powered by AI, styled by designers.
        </Typography>
      </Box>

      {/* Cards Section */}
      <Box
        sx={{
          display: { xs: "flex", md: "grid" },
          flexDirection: { xs: "column", md: "unset" },
          gridTemplateColumns: { md: "1.2fr 1fr" },
          gridTemplateRows: { md: "repeat(2, 1fr)" },
          gap: { xs: 3, md: 4 },
          maxWidth: 1350,
          mx: "auto",
          mb: 4,
        }}
      >
        {/* Card 1 */}
        <Box
          sx={{
            gridRow: { md: "1 / span 2" },
            gridColumn: { xs: "1", md: "1" },
            bgcolor: "transparent",
            background: "linear-gradient(180deg, #EEF1F7 0%, #FFFFFF 100%)",
            borderRadius: 2,
            boxShadow: "0 4px 24px 0 rgba(80, 80, 120, 0.07)",
            p: { xs: 3, md: 4 },
            minHeight: 370,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            textAlign: { xs: "center", md: "left" },
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          <Box
            sx={{
              width: { xs: 24, md: 40 },
              height: { xs: 24, md: 40 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <img
              src="/images/black-star.svg"
              alt="Star Icon"
              width={40}
              height={40}
              style={{
                objectFit: "contain",
                maxWidth: "24px",
                maxHeight: "24px",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1.5rem", md: "2rem" },
              color: "#18181B",
              mb: 1,
            }}
          >
            Context-aware content generation
          </Typography>
          <Typography
            sx={{ color: "#757575", fontSize: { xs: "1rem", md: "1.05rem" } }}
          >
            AI turns a prompt into a styled presentation with sections, tone,
            goals, keywords, and a smart title.
          </Typography>

          {/* Hide on mobile */}
          <Box
            component="img"
            src="/images/context-image.svg"
            alt="Context Image"
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              bottom: -100,
              right: 0,
              width: 530,
              height: 580,
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />
        </Box>

        {/* Card 2 */}
        <Box
          sx={{
            bgcolor: "transparent",
            background:
              "linear-gradient(111.14deg, #F0EFFF 4.64%, #FFFFFF 100%)",
            borderRadius: 4,
            boxShadow: "0 4px 24px 0 rgba(80, 80, 120, 0.07)",
            p: { xs: 4, md: 5 },
            minHeight: 220,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            textAlign: { xs: "center", md: "left" },
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          <Box
            sx={{
              width: { xs: 24, md: 50 },
              height: { xs: 24, md: 50 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <img
              src="/images/light-purple-star.svg"
              alt="Star Icon"
              width={50}
              height={50}
              style={{
                objectFit: "contain",
                maxWidth: "24px",
                maxHeight: "24px",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1.5rem", md: "1.6rem" },
              color: "#18181B",
              mb: 1,
            }}
          >
            AI picks
            <br />
            visual hierarchy
          </Typography>
          <Typography
            sx={{
              color: "#757575",
              fontSize: { xs: "1rem", md: "1.05rem" },
              mb: 2,
            }}
          >
            AI transcribes and analyzes spoken ideas to auto-generate slides
            with key points and speaker notes.
          </Typography>

          {/* Hide on mobile */}
          <Box
            component="img"
            src="/images/ai-card-img.svg"
            alt="Bottom Right Illustration"
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              bottom: -10,
              right: 0,
              width: 300,
              height: 300,
              objectFit: "contain",
              zIndex: 1,
            }}
          />
        </Box>

        {/* Card 3 */}
        <Box
          sx={{
            bgcolor: "transparent",
            background:
              "linear-gradient(112.44deg, #DFE9FE -9.69%, #FCFDFF 100%)",
            borderRadius: 2,
            boxShadow: "0 4px 24px 0 rgba(80, 80, 120, 0.07)",
            p: { xs: 4, md: 5 },
            minHeight: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            textAlign: { xs: "center", md: "left" },
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          <Box
            sx={{
              width: { xs: 24, md: 50 },
              height: { xs: 24, md: 50 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <img
              src="/images/natural-lang-star.svg"
              alt="Star Icon"
              width={50}
              height={50}
              style={{
                objectFit: "contain",
                maxWidth: "24px",
                maxHeight: "24px",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1.5rem", md: "2rem" },
              color: "#18181B",
              mb: 1,
            }}
          >
            Edit with natural language
          </Typography>
          <Typography
            sx={{
              color: "#757575",
              fontSize: { xs: "1rem", md: "1.05rem" },
              mb: 2,
            }}
          >
            AI transcribes and analyzes spoken ideas to auto-generate slides
            with key points and speaker notes.
          </Typography>
        </Box>
      </Box>

      {/* Full-width Bottom Card */}
      <Box
        sx={{
          maxWidth: 1350,
          mx: "auto",
          mt: { xs: 3, md: 4 },
          bgcolor: "transparent",
          background:
            "linear-gradient(94.38deg, #ECE2FF -101.47%, #FAF8FF 100%)",
          borderRadius: 4,
          boxShadow: "0 4px 24px 0 rgba(80, 80, 120, 0.07)",
          p: { xs: 4, md: 5 },
          minHeight: 350,
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", md: "left" },
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: { xs: 24, md: 50 },
            height: { xs: 24, md: 50 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <img
            src="/images/blue-star.svg"
            alt="Star Icon"
            width={50}
            height={50}
            style={{
              objectFit: "contain",
              maxWidth: "24px",
              maxHeight: "24px",
            }}
          />
        </Box>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: { xs: "1.5rem", md: "2rem" },
            color: "#18181B",
            mb: 0.5,
          }}
        >
          One-click export
        </Typography>
        <Typography
          sx={{ color: "#757575", fontSize: { xs: "1rem", md: "1.05rem" } }}
        >
          Google Slides, PowerPoint, PDF
        </Typography>
      </Box>
    </Box>
  );
}
