"use client";

import { Box, Typography, Container, Grid, Button } from "@mui/material";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface InternalLink {
  title: string;
  href: string;
  description: string;
}

interface InternalLinksProps {
  title?: string;
  links: InternalLink[];
}

export default function InternalLinks({
  title = "Explore Related Tools",
  links,
}: InternalLinksProps) {
  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#F9FAFB" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 6, color: "#111827", textAlign: "center" }}
        >
          {title}
        </Typography>
        <Grid container spacing={3}>
          {links.map((link, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Link href={link.href} style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "#7C3AED",
                      transform: "translateY(-4px)",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 1, color: "#111827" }}
                    >
                      {link.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                        mb: 2,
                      }}
                    >
                      {link.description}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      color: "#7C3AED",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    Learn more <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </Typography>
                </Box>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
