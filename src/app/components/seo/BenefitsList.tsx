"use client";

import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import PaletteIcon from "@mui/icons-material/Palette";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SecurityIcon from "@mui/icons-material/Security";
import CloudDoneIcon from "@mui/icons-material/CloudDone";

interface Benefit {
  title: string;
  description: string;
  icon?: "speed" | "design" | "ai" | "ease" | "secure" | "done";
}

interface BenefitsListProps {
  title?: string;
  subtitle?: string;
  benefits: Benefit[];
}

export default function BenefitsList({
  title = "Key Benefits",
  subtitle = "Why choose SlideXY?",
  benefits,
}: BenefitsListProps) {
  const getIcon = (type?: string) => {
    switch (type) {
      case "speed": return <SpeedIcon sx={{ fontSize: 32, color: "#7C3AED" }} />;
      case "design": return <PaletteIcon sx={{ fontSize: 32, color: "#7C3AED" }} />;
      case "ai": return <AutoFixHighIcon sx={{ fontSize: 32, color: "#7C3AED" }} />;
      case "ease": return <ThumbUpAltIcon sx={{ fontSize: 32, color: "#7C3AED" }} />;
      case "secure": return <SecurityIcon sx={{ fontSize: 32, color: "#7C3AED" }} />;
      default: return <CloudDoneIcon sx={{ fontSize: 32, color: "#7C3AED" }} />;
    }
  };

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 2, color: "#111827" }}
          >
            {title}
          </Typography>
          <Typography
            sx={{ color: "text.secondary", fontSize: "1.1rem" }}
          >
            {subtitle}
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Box
                sx={{
                  p: 4,
                  bgcolor: "#fff",
                  borderRadius: "16px",
                  border: "1px solid #F3F4F6",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "12px",
                    bgcolor: "rgba(124, 58, 237, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  {getIcon(benefit.icon)}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 1.5, color: "#111827" }}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.6,
                    fontSize: "0.95rem",
                  }}
                >
                  {benefit.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
