"use client";

import { Box, Typography, Container, Grid, Paper } from "@mui/material";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface WorkflowStepsProps {
  title?: string;
  steps: Step[];
}

export default function WorkflowSteps({ title = "How it works", steps }: WorkflowStepsProps) {
  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#F9FAFB" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            mb: 8,
            color: "#111827",
          }}
        >
          {title}
        </Typography>
        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Box sx={{ position: "relative", textAlign: "center" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "#8E2DE2",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    mx: "auto",
                    mb: 4,
                    boxShadow: "0 4px 6px -1px rgba(142, 45, 226, 0.3)",
                  }}
                >
                  {step.number || index + 1}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, color: "#111827" }}
                >
                  {step.title}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.6,
                    fontSize: "0.95rem",
                    maxWidth: 280,
                    mx: "auto",
                  }}
                >
                  {step.description}
                </Typography>
                {/* Connector line for desktop */}
                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: "none", md: "block" },
                      position: "absolute",
                      top: 24,
                      left: "calc(50% + 40px)",
                      width: "calc(100% - 80px)",
                      height: 1,
                      borderTop: "2px dashed #E5E7EB",
                    }}
                  />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
