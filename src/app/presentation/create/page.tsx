import PresentationMaker from "../../components/create-presentation/PresentationMaker";
import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";

const CreatePresentationPage = () => {
  const promptCards = [
    {
      title: "Creativity at Work",
      description: "Learn expert negotiation tips to close deals effectively.",
      icon: "/images/create-presentation/prompt-arrow.svg",
    },
    {
      title: "Healthy diet",
      description: "Learn expert negotiation tips to close deals effectively.",
      icon: "/images/create-presentation/prompt-arrow.svg",
    },
    {
      title: "UX UI guidelines",
      description:
        "Discover the best marketing strategies to showcase your properties.",
      icon: "/images/create-presentation/prompt-arrow.svg",
    },
  ];

  return (
    <Box sx={{ py: 10 }}>
      <Box
        sx={{
          width: "100%",
          background: `radial-gradient(700px 220px at 50% 54%, #8E2DE210 0%, #FBF9FF 70%, #fff 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Element */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 10, md: 10 },
            left: { xs: 50, md: 200 },
            animation: "sparkle 2s ease-in-out infinite",
            "@keyframes sparkle": {
              "0%, 100%": { opacity: 0.7, transform: "scale(1)" },
              "50%": { opacity: 1, transform: "scale(1.1)" },
            },
          }}
          className="hidden"
        >
          <Image
            src="/images/create-presentation/generate-presentation-header-star.svg"
            alt="Icon"
            width={72}
            height={72}
          />
        </Box>

        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mt: 1, mb: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem", lg: "4.8rem" },
                fontWeight: 600,
                mb: 3,
                color: "#000000",
              }}
            >
              AI Presentation Maker
            </Typography>
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
