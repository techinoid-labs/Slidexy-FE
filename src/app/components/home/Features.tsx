"use client";

import { Box, Container, Typography, Chip, useTheme } from "@mui/material";
import ResponsivePageWrapper from "@/lib/responsive-page-wrapper";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

const features = [
  {
    icon: "/images/voice-to-deck.svg",
    title: "AI Slide Generator",
    desc: "Transcribe spoken ideas to auto-build slides with key points and speaker notes.",
  },
  {
    icon: "/images/smart-icon.svg",
    title: "Prompt to Deck",
    desc: "Turn a prompt into structured, styled slides—complete with sections, tone, goals, and keywords.",
  },
  {
    icon: "/images/video-to-deck.svg",
    title: "Video to Slides",
    desc: "Upload a video and generate narrative slides by extracting speech, visuals, and highlights.",
  },
];

export default function FeaturesSection() {
  const theme = useTheme();
  return (
    <ResponsivePageWrapper>
      <Box
        sx={{
          position: "relative",
          background: "#FBFAFF",
          py: { xs: 5, md: 7 },
        }}
        className="flex flex-col items-center w-full"
      >
        {/* Decorative Star */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 30, md: 60 },
            left: { xs: 50, md: 200 },
            display: { xs: "none", md: "block" },
          }}
        >
          <Image
            src="/images/side-star-light-purple.svg"
            alt="Icon"
            width={68}
            height={68}
          />
        </Box>
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1 }}
          className="flex flex-col items-center w-full"
        >
          {/* Badge */}
          <Box
            sx={{ display: "flex", justifyContent: "center", mb: 3 }}
            className="w-full flex justify-center"
          >
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
              label="Our Features"
              sx={{
                px: 2.5,
                py: 1.2,
                fontSize: "1rem",
                height: "auto",
                borderRadius: "600px",
                backgroundColor: "#E8E4FF",
                color: "#4A00E0",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
                border: "none",
                "& .MuiChip-icon": {
                  color: "#4A00E0",
                  marginRight: "8px",
                },
              }}
            />
          </Box>
          {/* Heading */}
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1.67rem", md: "2.2rem" },
              mb: 2,
              color: "#18181B",
            }}
          >
            AI Tools That Drive Results{" "}
          </Typography>
          {/* Subtitle */}
          <Typography
            align="center"
            sx={{
              color: "#757575",
              fontSize: { xs: "0.9rem", md: "1.25rem" },
              mb: { xs: 0, md: 7 },
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Slidexy combines transcription, content generation, and design to
            create slides your audience will remember.
          </Typography>
          {/* Features Flex Layout */}
          <Box
            component={motion.div}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "center",
              alignItems: "stretch",
              gap: { xs: 3, md: 4 },
              mb: 2,
              position: "relative",
              minHeight: { xs: 260, md: 300 },
              maxWidth: { xs: "100%", md: 1100 },
              mx: "auto",
              py: { xs: 2, md: 3 },
            }}
            className="flex flex-col md:flex-row items-stretch justify-center w-full"
          >
            {/* Checkered Background */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                mt: -30,
                opacity: 0.6,
                pointerEvents: "none",
                zIndex: -1,
              }}
            >
              <Image
                src="/images/checkered-lines.svg"
                alt="Checkered Background"
                width={300}
                height={300}
                style={{
                  objectFit: "contain",
                }}
              />
            </Box>

            {features.map((feature, i) => (
              <Box
                key={feature.title}
                component={motion.div}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -8 }}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  maxWidth: 320,
                  textAlign: "center",
                  px: 3,
                  py: 2,
                  position: "relative",
                  zIndex: 1,
                  borderRadius: "18px",
                  border: "1px solid transparent",
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    borderColor: "rgba(142, 45, 226, 0.14)",
                    boxShadow: "0 20px 40px -20px rgba(142,45,226,0.28)",
                  },
                }}
                className="flex flex-col items-center justify-center text-center"
              >
                <Box
                  component={motion.div}
                  whileHover={{ scale: 1.12, rotate: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={40}
                    height={40}
                    style={{ width: "40px", height: "40px" }}
                    className="md:w-[60px] md:h-[60px]"
                  />
                </Box>
                <Typography
                  sx={{
                    mt: 1,
                    mb: 2,
                    fontWeight: 400,
                    color: "#18181B",
                    fontSize: { xs: "1.1rem", md: "1.8rem" },
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    color: "#757575",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    lineHeight: 1.6,
                  }}
                >
                  {feature.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </ResponsivePageWrapper>
  );
}
