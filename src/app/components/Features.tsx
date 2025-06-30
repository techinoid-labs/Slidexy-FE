"use client";

import { Box, Container, Typography, Chip, useTheme } from "@mui/material";
import ResponsivePageWrapper from "@/lib/responsive-page-wrapper";
import Image from "next/image";

export default function FeaturesSection() {
  const theme = useTheme();
  return (
    <ResponsivePageWrapper>
      <Box
        sx={{
          position: "relative",
          background: "#FBFAFF",
          py: { xs: 8, md: 12 },
        }}
      >
        {/* Decorative Star */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 24, md: 40 },
            left: { xs: 24, md: 80 },
            zIndex: 0,
          }}
        >
          <Image src="/images/side-star-light-purple.svg" alt="Icon" width={72} height={72} />
        </Box>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Chip
              icon={
                <Image
                  src="/images/side-star-purple.svg"
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
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.8rem" },
              mb: 2,
              color: "#18181B",
            }}
          >
            Discover the Tools that Drive Success
          </Typography>
          {/* Subtitle */}
          <Typography
            align="center"
            sx={{
              color: "#757575",
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              mb: 7,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Turn any thought into a polished, on-brand presentation —<br />powered by AI
          </Typography>
          {/* Features Flex Layout */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "center",
              alignItems: "stretch",
              gap: { xs: 3, md: 4 },
              mb: 2,
              position: "relative",
              minHeight: { xs: 350, md: 400 },
              maxWidth: { xs: '100%', md: 1100 },
              mx: 'auto',
              py: { xs: 3, md: 5 },
            }}
          >
            {/* Checkered Background */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0,
                opacity: 0.13,
                pointerEvents: 'none',
              }}
            >
              <Image
                src="/images/checkered-lines.svg"
                alt="Checkered Background"
                width={400}
                height={400}
                style={{ objectFit: 'contain' }}
              />
            </Box>
            {/* Feature 1 */}
            <Box sx={{ flex: 1, minWidth: 200, maxWidth: 320, textAlign: "center", px: 2, position: 'relative', zIndex: 1 }}>
              <Image src="/images/side-star-purple.svg" alt="Voice-to-Deck" width={40} height={40} />
              <Typography sx={{ mt: 2, mb: 1, fontWeight: 600, color: "#18181B", fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                Voice-to-Deck
              </Typography>
              <Typography sx={{ color: "#757575", fontSize: { xs: '0.98rem', md: '1.05rem' }, lineHeight: 1.6 }}>
                AI transcribes and analyzes spoken ideas to auto-generate slides with key points and speaker notes.
              </Typography>
            </Box>
            {/* Divider 1 */}
            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              mx: 0,
              height: 70,
              alignSelf: 'center',
              zIndex: 1,
            }}>
              <Box sx={{ width: '1px', height: 70, background: '#E9E9FF', borderRadius: 1 }} />
            </Box>
            {/* Feature 2 */}
            <Box sx={{ flex: 1, minWidth: 200, maxWidth: 320, textAlign: "center", px: 2, position: 'relative', zIndex: 1 }}>
              <Image src="/images/side-star-light-purple.svg" alt="Smart Prompt Generator" width={40} height={40} />
              <Typography sx={{ mt: 2, mb: 1, fontWeight: 600, color: "#18181B", fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                Smart Prompt Generator
              </Typography>
              <Typography sx={{ color: "#757575", fontSize: { xs: '0.98rem', md: '1.05rem' }, lineHeight: 1.6 }}>
                AI turns a prompt into a styled presentation with sections, tone, goals, keywords, and a smart title.
              </Typography>
            </Box>
            {/* Divider 2 */}
            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              mx: 0,
              height: 70,
              alignSelf: 'center',
              zIndex: 1,
            }}>
              <Box sx={{ width: '1px', height: 70, background: '#E9E9FF', borderRadius: 1 }} />
            </Box>
            {/* Feature 3 */}
            <Box sx={{ flex: 1, minWidth: 200, maxWidth: 320, textAlign: "center", px: 2, position: 'relative', zIndex: 1 }}>
              <Image src="/images/side-star-purple.svg" alt="Video-to-Deck Summarizer" width={40} height={40} />
              <Typography sx={{ mt: 2, mb: 1, fontWeight: 600, color: "#18181B", fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                Video-to-Deck Summarizer
              </Typography>
              <Typography sx={{ color: "#757575", fontSize: { xs: '0.98rem', md: '1.05rem' }, lineHeight: 1.6 }}>
                Upload a video, and AI generates narrative slides by extracting speech, visuals, and key highlights.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </ResponsivePageWrapper>
  );
}
