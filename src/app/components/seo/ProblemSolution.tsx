"use client";

import { Box, Typography, Container, Grid } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface ProblemSolutionProps {
  problem: string;
  solution: string;
}

export default function ProblemSolution({ problem, solution }: ProblemSolutionProps) {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        backgroundColor: "#F9FAFB",
        borderTop: "1px solid #E5E7EB",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                backgroundColor: "#FFF5F5",
                borderRadius: "16px",
                border: "1px solid #FEE2E2",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1.5 }}>
                <ErrorOutlineIcon sx={{ color: "#EF4444" }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#991B1B" }}>
                  The Problem
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "#7F1D1D",
                  lineHeight: 1.7,
                  fontSize: { xs: "1rem", md: "1.05rem" },
                }}
              >
                {problem}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                backgroundColor: "#F0FDF4",
                borderRadius: "16px",
                border: "1px solid #DCFCE7",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1.5 }}>
                <CheckCircleOutlineIcon sx={{ color: "#22C55E" }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#166534" }}>
                  The SlideXY Solution
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "#14532D",
                  lineHeight: 1.7,
                  fontSize: { xs: "1rem", md: "1.05rem" },
                }}
              >
                {solution}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
