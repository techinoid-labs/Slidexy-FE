"use client";

import { Box, Typography, Chip } from "@mui/material";
import Image from "next/image";
import Lottie from "lottie-react";
import exportAnimationData from "@/json/Final7.json";

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
          alignItems: { xs: "center", sm: "flex-start" },
          flexDirection: { xs: "column", md: "row" },
          maxWidth: 1200,
          mx: "auto",
          mb: 4,
        }}
      >
        <Box>
          <Chip
            icon={
              <img
                src="/images/Stars.svg"
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

              display: "inline-flex",
              alignItems: "center",
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontWeight: 520,
              fontSize: { xs: "1.9rem", md: "2.5rem" },
              color: "#18181B",
              mb: { xs: 1, md: 0.5 },

              textAlign: { xs: "center", md: "left" },
              lineHeight: 1.2,
            }}
          >
            Why <br /> Slidexy?
          </Typography>
        </Box>
        <Typography
          sx={{
            color: "#757575",
            fontSize: { xs: "18px", md: "18px" },
            maxWidth: 546,
            mt: { xs: 2, md: 2 },
            ml: { xs: 5 },
            mr: { xs: 5 },
            textAlign: { xs: "center", md: "left" },
            fontWeight: 400,
          }}
        >
          Turn any thought into a polished, on-brand presentation powered by AI,
          styled by designers.
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
            p: { xs: 1.5, md: 2 },
            minHeight: { xs: 180, md: 180 },
            maxWidth: { xs: 820, md: 800 },
            ml: { xs: 0, md: 5 },
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
              width: { xs: 24, md: 35 },
              height: { xs: 24, md: 35 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 5,
              mb: 2,
              ml: { sx: 0, md: 3 },
            }}
          >
            <img
              src="/images/black-star.svg"
              alt="Star Icon"
              width={40}
              height={40}
              style={{
                objectFit: "contain",
                maxWidth: "45px",
                maxHeight: "45px",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1.5rem", md: "1.6rem" },
              color: "#18181B",
              mb: { xs: 1, md: 1 },
              ml: { xs: 0, md: 3 },
            }}
          >
            Context-aware content generation
          </Typography>
          <Typography
            sx={{
              color: "#757575",
              fontWeight: "400px",
              fontSize: { xs: "16px", md: "16px" },
              ml: { sx: 0, md: 3 },
              mb: { xs: 3, md: 1 },
            }}
          >
            AI turns a prompt into a styled presentation with sections,
            <br />
            tone, goals, keywords, and a smart title.
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
              marginBottom: "40px",
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
            minHeight: 180,
            maxWidth: 570,
            mr: { xs: 0, md: 2 },
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
              width: { xs: 24, md: 60 },
              height: { xs: 24, md: 60 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: { xs: 0, md: -1 },
              mb: { xs: 2, md: 0 },
            }}
          >
            <img
              src="/images/light-purple-star.svg"
              alt="Star Icon"
              width={60}
              height={60}
              style={{
                objectFit: "contain",
                maxWidth: "40px",
                maxHeight: "40px",
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
            AI Infographics
          </Typography>
          <Typography
            sx={{
              maxWidth: "199px",
              color: "#757575",
              fontWeight: "400px",
              fontSize: { xs: "16px", md: "16px" },
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
              height: 240,
              objectFit: "cover",
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
            p: { xs: 4, md: 2.5 },
            minHeight: 180,
            maxWidth: 900, // increased to fit image
            mr: { xs: 0, md: 2 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* Left Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: { xs: "center", md: "left" },
              alignItems: { xs: "center", md: "flex-start" },
              flex: 1,
            }}
          >
            <Box
              sx={{
                width: { xs: 24, md: 70 },
                height: { xs: 24, md: 70 },
                gap: { sm: 10 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <img
                src="/images/natural-lang-star.svg"
                alt="Star Icon"
                width={70}
                height={70}
                style={{
                  objectFit: "contain",
                  maxWidth: "40px",
                  maxHeight: "40px",
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
              One Click Export
            </Typography>
            <Typography
              sx={{
                color: "#757575",
                fontSize: { xs: "0.9rem", md: "0.9rem" },
                maxWidth: { sm: "190px" },
                mb: 2,
              }}
            >
              Google Slides, PNG, JPEG, PowerPoint, PDF
            </Typography>
          </Box>

          {/* Right Side Image */}
          {/* <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: { xs: "100%", md: "300px" },
            }}
          >
            <img
              src="/images/Export.svg"
              alt="Export Preview"
              style={{
                width: "500px",
                height: "100%",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          </Box> */}
          {/* Right Side Animation */}
          <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: { xs: "100%", md: "300px" },
            }}
          >
            <Lottie
              animationData={exportAnimationData}
              loop
              autoplay
              style={{
                width: "500px",
                height: "100%",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Full-width Bottom Card */}
      <Box
        sx={{
          //maxWidth: 1350,
          mx: "auto",
          mt: { xs: 3, md: 4 },
          bgcolor: "transparent",
          background:
            "linear-gradient(94.38deg, #ECE2FF -101.47%, #FAF8FF 100%)",
          borderRadius: 4,
          boxShadow: "0 4px 24px 0 rgba(80, 80, 120, 0.07)",
          px: { xs: 3, md: "36px" },
          py: { xs: 3, md: "40px" },
          maxWidth: 1300,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: { xs: "center", md: "left" },
          gap: 2,
        }}
      >
        {/* Left Side */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
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
              src="/images/blue-star.svg"
              alt="Star Icon"
              width={50}
              height={50}
              style={{
                objectFit: "contain",
                maxWidth: "40px",
                maxHeight: "40px",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1.5rem", md: "1.6rem" },
              color: "#18181B",
              mb: 0.5,
            }}
          >
            AI Voice Assistance
          </Typography>
          <Typography
            sx={{ color: "#757575", fontSize: { xs: "1rem", md: "1.05rem" } }}
          >
            Google Slides, PowerPoint, PDF
          </Typography>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/images/VoiceAssistant.svg"
            alt="Export Icon"
            className="sm:w-[400px] w-[200px]"
          />
        </Box>
      </Box>
    </Box>
  );
}
