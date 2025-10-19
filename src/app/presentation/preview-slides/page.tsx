"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import { useSlides } from "@/app/context/SlidesContext";
import { useDispatch } from "react-redux";
import { setSlides } from "@/app/slice/slidesSlice";
import { useRouter } from "next/navigation";
import StepIndicator from "@/app/components/shared/StepIndicator";
import StepsHeader from "@/app/components/headers-navbar/StepsHeader";
import { getSlideDimensions } from "@/utils/slideUtils";

export interface SlideApiResponse {
  slide_id: string;
  slide_title: {
    text: string;
    konva_component: string;
    properties: Record<string, any>;
  };
  image_url?: string;
  image_caption?: string;
  elements: Array<{
    element_type: string;
    text: string;
    konva_component: string;
    properties: Record<string, any>;
  }>;
}

function mapApiSlidesToCards(apiSlides: SlideApiResponse[]) {
  return apiSlides.map((slide) => ({
    title: slide.slide_title.text,
    bullets: slide.elements
      .filter((el) => el.element_type === "bullet_point")
      .map((el) => el.text),
    images: slide.image_url ? [slide.image_url] : [],
  }));
}

export default function ReviewSlidesPage() {
  const { slides }: any = useSlides();
  const dispatch = useDispatch();
  const router = useRouter();

  const [cards, setCards] = useState(() =>
    slides && slides.length > 0 ? mapApiSlidesToCards(slides) : []
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "#FBFAFF",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <StepsHeader />
      <Box sx={{ mt: { xs: 2, md: 4 } }}>
        <StepIndicator activeStep={2} />
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 1440,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: { xs: 2, sm: 4, md: 8, lg: 0 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 4, md: 10 },
            pb: { xs: 1, md: 2 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              color: "#18181B",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem", lg: "3.5rem" },
              mb: { xs: 1.5, md: 2.5 },
              mt: { xs: 0, md: -6 },
              px: { xs: 1, md: 0 },
            }}
          >
            Preview Your Slides
          </Typography>
          <Typography
            sx={{
              color: "#757575",
              textAlign: "center",
              mb: { xs: 3, md: 6 },
              maxWidth: { xs: 320, sm: 700 },
              fontSize: { xs: "0.95rem", sm: "1rem", md: "1.15rem" },
              px: { xs: 1, md: 0 },
            }}
          >
            Select the slides range as per your requirement
          </Typography>

          {/* Top action row */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: { xs: "center", md: "space-between" },
              gap: { xs: 2, md: 4 },
              maxWidth: 1200,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                color: "#18181B",
                fontSize: "20px",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Personal portfolio outline
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: { xs: "100%", md: "auto" },
              }}
            >
              <Button
                variant="contained"
                sx={{
                  width: { xs: "100%", sm: "60%", md: 320 },
                  borderRadius: "999px",
                  fontSize: { xs: "1rem", md: "1.15rem" },
                  fontWeight: 600,
                  textTransform: "none",
                  margin:{sm:"auto"},
                  background:
                    "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                  boxShadow: "none",
                  "&:hover": { background: "#4A00E0" },
                }}
              >
                Regenerate Outlines
              </Button>
            </Box>
          </Box>

          <Typography
            sx={{
              color: "#757575",
              fontSize: { xs: "0.92rem", md: "0.98rem" },
              mb: { xs: 2, md: 4 },
              maxWidth: 1200,
              width: "100%",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {cards.length} Cards
          </Typography>
        </Box>

        {/* Cards Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            width: "100%",
            px: { xs: 1, sm: 0 },
          }}
        >
          {/* Card 1 */}
          <Box
            sx={{
              width: "100%",
              borderRadius: "24px",
              px: { xs: 2, sm: 4 },
              py: { xs: 3, sm: 4 },
              backgroundColor: "#F9F9FB",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#18181B",
                fontSize: { xs: "1.3rem", md: "2.5rem" },
                mb: 2,
              }}
            >
              Personal Portfolio
            </Typography>
            <Typography component="div" sx={{ mb: 1 }}>
              • Showcasing a proven track record in [Your Core Field/Expertise]
            </Typography>
            <Typography component="div">
              • Delivering quantifiable results for [Type of
              Clients/Organisations]
            </Typography>
          </Box>

          {/* Card 2 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              borderRadius: "24px",
              overflow: "hidden",
              backgroundColor: "#F9F9FB",
            }}
          >
            <Box sx={{ flex: 1, p: { xs: 2, sm: 4 } }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#18181B" }}
              >
                Personal Portfolio
              </Typography>
              <Typography component="div" sx={{ mb: 1 }}>
                • Showcasing a proven track record in [Your Core
                Field/Expertise]
              </Typography>
              <Typography component="div">
                • Delivering quantifiable results for [Type of
                Clients/Organisations]
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: { xs: 200, sm: 300 } }}>
              <Image
                src="/images/slides-preview.svg"
                alt="Portfolio"
                width={600}
                height={400}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          </Box>

          {/* Card 3 */}
          <Box
            sx={{
              borderRadius: "24px",
              overflow: "hidden",
              backgroundColor: "#F9F9FB",
            }}
          >
            <Box sx={{ p: { xs: 2, sm: 4 } }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#18181B" }}
              >
                Personal Portfolio: [Your Name/Professional Title]
              </Typography>
              <Typography component="div" sx={{ mb: 1 }}>
                • Showcasing a proven track record in [Your Core
                Field/Expertise]
              </Typography>
              <Typography component="div" sx={{ mb: 1 }}>
                • Delivering quantifiable results for [Type of
                Clients/Organisations]
              </Typography>
              <Typography component="div">
                • Focused on strategic growth and operational excellence since
                [Year of experience]
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 2, md: 3 },
              }}
            >
              {[1, 2].map((img, idx) => (
                <Box
                  key={idx}
                  sx={{ flex: 1, minHeight: { xs: 200, sm: 300 } }}
                >
                  <Image
                    src="/images/slides-preview.svg"
                    alt={`Portfolio Image ${img}`}
                    width={600}
                    height={400}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Continue button */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mt: { xs: 4, md: 10 },
            position: { xs: "sticky", md: "static" },
            bottom: 0,
            zIndex: 10,
            bgcolor: "#FBFAFF",
            pt: { xs: 2, md: 4 },
            pb: { xs: 3, md: 6 },
          }}
        >
          <Button
            variant="contained"
            sx={{
              width: { xs: "80%", sm: "60%", md: 320 },
              maxWidth: "100%",
              borderRadius: "999px",
              py: { xs: 1.2, md: 2.5 },
              fontSize: { xs: "1rem", md: "1.15rem" },
              fontWeight: 600,
              textTransform: "none",
              background:
                "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
              boxShadow: "none",
              "&:hover": { background: "#4A00E0" },
            }}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
