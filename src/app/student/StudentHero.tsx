"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import { ArrowForward, ArrowOutward } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const toolList = [
    {
        label: "Prompt-to-Deck",
        icon: "/images/tools/prompt-to-deck.svg",
        route: "/tools/prompt-to-deck",
        description: "Perfect for university assignments. Turn your topic into a full slide deck in seconds."
    },
    {
        label: "Video-to-Deck",
        icon: "/images/tools/video-to-deck.svg",
        route: "/tools/video-to-deck",
        description: "Convert lecture videos or YouTube tutorials into study slides instantly."
    },
    {
        label: "Text-to-Infographics",
        icon: "/images/tools/text-to-infographics.svg",
        route: "/tools/text-to-infographics",
        description: "Make your FYP (Final Year Project) stand out with AI-generated visual data."
    },
];

export default function StudentHero() {
  const router = useRouter();

  return (
    <Box sx={{ bgcolor: "#fff", overflow: "hidden" }}>
      {/* Hero Header */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "radial-gradient(circle at 50% 50%, #F3F0FF 0%, #FFFFFF 100%)",
          textAlign: "center",
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Chip
            label="Special Student Access"
            sx={{
              bgcolor: "#F3F0FF",
              color: "#6C2BD7",
              fontWeight: 600,
              mb: 3,
              px: 1,
              fontFamily: 'Raleway, sans-serif',
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "32px", md: "56px" },
              fontWeight: 800,
              color: "#1A1A1A",
              lineHeight: 1.2,
              mb: 3,
              fontFamily: 'Raleway, sans-serif',
            }}
          >
            Best AI Tools for Students: <br />
            <Box component="span" sx={{ color: "#6C2BD7" }}>
              University Assignments & FYP Made Easy
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "18px", md: "20px" },
              color: "#666",
              maxWidth: "800px",
              mx: "auto",
              mb: 5,
              lineHeight: 1.6,
              fontFamily: 'Raleway, sans-serif',
            }}
          >
            Looking for the best AI tool for students? SlideXY is the 
            ultimate assistant for university assignments, seminar slides, and Final Year Projects (FYP). 
            Spend less time on design and more on your grades.
          </Typography>
          
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/tools"
              sx={{
                bgcolor: "#6C2BD7",
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                fontSize: "16px",
                textTransform: "none",
                fontWeight: "bold",
                fontFamily: 'Raleway, sans-serif',
                "&:hover": { bgcolor: "#4A00E0" },
              }}
            >
              Start Creating for Free
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Tools Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            fontSize: "32px",
            fontWeight: 700,
            mb: 6,
            color: "#222",
            fontFamily: 'Raleway, sans-serif',
          }}
        >
          Built for Academic Excellence
        </Typography>
        <Grid container spacing={4}>
          {toolList.map((tool, index) => (
            <Grid size={{xs:12,md:4}} key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: "20px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-10px)" },
                  border: "1px solid #EAEAEA",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: "#F3F0FF",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    <Image src={tool.icon} alt={tool.label} width={32} height={32} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Raleway, sans-serif' }}>
                    {tool.label}
                  </Typography>
                  <Typography sx={{ color: "#666", mb: 3, fontSize: "15px", lineHeight: 1.6, fontFamily: 'Raleway, sans-serif' }}>
                    {tool.description}
                  </Typography>
                  <Button
                    onClick={() => router.push(tool.route)}
                    endIcon={<ArrowForward />}
                    sx={{ color: "#6C2BD7", fontWeight: 700, p: 0, textTransform: "none", fontFamily: 'Raleway, sans-serif' }}
                  >
                    Try it now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Global Academic Context Section */}
      <Box sx={{ bgcolor: "#F9F9FB", py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{xs:12,md:6}}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, fontSize: "28px", fontFamily: 'Raleway, sans-serif' }}>
                Present like a Pro at any University
              </Typography>
              <Typography sx={{ color: "#555", mb: 2, fontSize: "16px", lineHeight: 1.7, fontFamily: 'Raleway, sans-serif' }}>
                We understand the specific requirements of academic life. Whether you need a 
                <strong> professional FYP presentation</strong> for your committee or <strong>seminar slides</strong> 
                for a class project, SlideXY delivers clean, structured, and relevant results.
              </Typography>
              <Typography sx={{ color: "#555", mb: 4, fontSize: "16px", lineHeight: 1.7, fontFamily: 'Raleway, sans-serif' }}>
                Our AI handles complex academic topics with ease, allowing you to focus on the research 
                while we handle the visual storytelling.
              </Typography>
              <Box sx={{ bgcolor: "#fff", p: 3, borderRadius: "16px", borderLeft: "4px solid #6C2BD7" }}>
                <Typography sx={{ fontWeight: 700, color: "#6C2BD7", mb: 1, fontFamily: 'Raleway, sans-serif' }}>
                  Student Special Offer
                </Typography>
                <Typography sx={{ fontSize: "14px", fontFamily: 'Raleway, sans-serif' }}>
                  Join thousands of students globally using SlideXY to boost their academic performance. 
                  Zero sign-up required for your first deck!
                </Typography>
              </Box>
            </Grid>
            <Grid size={{xs:12,md:6}}>
                {/* Removed Image to keep it clean and consistent as requested */}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
