"use client";

import { Box, Typography, Container, Button } from "@mui/material";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  href?: string;
  showButton?: boolean;
}

export default function CTASection({
  title = "Ready to create your next presentation?",
  subtitle = "Join thousands of users who save hours every week with SlideXY AI.",
  buttonText = "Get Started for Free",
  href = "/auth?form=signup",
  showButton = true,
}: CTASectionProps) {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: "2rem", md: "2.75rem" },
            maxWidth: 600,
            mx: "auto",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            mb: 5,
            opacity: 0.9,
            maxWidth: 500,
            mx: "auto",
            fontSize: { xs: "1rem", md: "1.25rem" },
          }}
        >
          {subtitle}
        </Typography>
        {showButton && (
          <Link href={href} style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
              disableElevation
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "#fff",
                color: "#4A00E0",
                px: 6,
                fontSize: "1.1rem",
                boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  bgcolor: "#F3F4F6",
                  boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              {buttonText}
            </Button>
          </Link>
        )}
      </Container>
    </Box>
  );
}
