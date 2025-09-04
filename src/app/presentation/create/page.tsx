"use client";
import PresentationMaker from "@/app/components/create-presentation/create/PresentationMaker";
import { Box, Container, Typography, Button } from "@mui/material";
import StepIndicator from "@/app/components/shared/StepIndicator";
import StepsHeader from "@/app/components/headers-navbar/StepsHeader";

const CreatePresentationPage = () => {
  const promptCards = [
    {
      title: "Creativity at Work",
      description: "Learn expert negotiation tips to close deals effectively.",
      icon: "/top-element.svg",
    },
    {
      title: "Healthy diet",
      description: "How to become fit and healthy quickly",
      icon: "/images/create-presentation/prompt-boxes-ico.svg",
    },
    {
      title: "UX UI guidelines",
      description:
        "Discover the best marketing strategies to showcase your properties.",
      icon: "/top-element.svg",
    },
  ];

  return (
    <Box>
      <StepsHeader />
      <Box sx={{ mt: 4 }}>
        <StepIndicator activeStep={0} />
      </Box>

      <Box
        sx={{
          width: "100%",
          background: `radial-gradient(700px 220px at 50% 54%, #8E2DE210 0%, #FBF9FF 70%, #fff 100%)`,
          position: "relative",
          overflow: "hidden",
          pb: 10,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mt: 1, mb: 6, position: "relative" }}>
            <Box sx={{ display: "inline-block", position: "relative" }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3rem", lg: "3.8rem" },
                  fontWeight: 500,
                  mb: 3,
                  color: "#000000",
                }}
              >
                AI Presentation Maker
              </Typography>
              {/* <Image
                  src="/images/create-presentation/generate-presentation-header-star.svg"
                  alt="Star Icon"
                  width={72}
                  height={72}
                  style={{
                    position: "absolute",
                    left: -130,
                    top: "40%",
                    transform: "translateY(-50%)",
                  }}
                /> */}
            </Box>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.6,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
              }}
            >
              Elevate your presentations with our AI-powered tool—create
              polished, professional slides in just seconds.
            </Typography>
          </Box>

          <PresentationMaker promptCards={promptCards} />
        </Container>
      </Box>
    </Box>
  );
};

export default CreatePresentationPage;
