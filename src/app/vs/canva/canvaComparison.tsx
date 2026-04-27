"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import Link from "next/link";

export default function CanvaComparison() {
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 6, md: 10 } }}>
      
      {/* 1. Quick Verdict at the top */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 28, md: 28, lg: 38 },
            fontWeight: 550,
            mb: 4,
            lineHeight: 1.3,
            color: "#000000",
          }}
        >
          SlideXY vs Canva: Which is right for you?
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "24px", md: "32px" },
            color: "#6C2BD7",
            mb: 4,
          }}
        >
          The Quick Verdict
        </Typography>
        <Typography
          sx={{
            fontSize: "18px",
            color: "#555",
            maxWidth: 800,
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          If you need an all-in-one graphic design Swiss Army knife ranging from social media posts to print orders and video reels, <strong>Canva</strong> is an industry behemoth with millions of assets. However, if your primary goal is to generate beautiful, structured presentations instantly with AI—without an overwhelming interface—and you want <strong>honest, accessible pricing</strong> (especially optimized for <strong>Pakistan</strong> and emerging markets), <strong>SlideXY</strong> is the clear winner. We focus on one thing and making it highly affordable.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            href="/"
            variant="contained"
            sx={{
              background: "#6C2BD7",
              color: "#fff",
              px: 4,
              py: 1.5,
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": { background: "#4A00E0" },
            }}
          >
            Start Creating with SlideXY for Free
          </Button>
        </Box>
      </Box>

      {/* 2. Feature Comparison Table */}
      <Box sx={{ mb: 10 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: "28px",
            color: "#222",
            mb: 4,
            textAlign: "center",
          }}
        >
          Head-to-Head Feature Comparison
        </Typography>
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table aria-label="comparison table">
            <TableHead sx={{ backgroundColor: "#F3F0FF" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Feature</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#6C2BD7' }}>SlideXY</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#444' }}>Canva</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { feature: "Primary Focus", slidexy: "Dedicated AI Presentation Generator", gamma: "Broad Graphic Design Suite" },
                { feature: "Asset Libraries", slidexy: "Curated, high-impact visuals", gamma: "Massive (141M+ premium items)" },
                { feature: "AI Content Creation", slidexy: "Deep, specialized prompt-to-slide logic", gamma: "Standard AI tool additions (Magic Design)" },
                { feature: "Pricing Accessibility", slidexy: "Deeply localized (Pakistan/emerging markets)", gamma: "Standard global SaaS pricing ($120+ / year)" },
                { feature: "Learning Curve", slidexy: "Near zero (Type & Generate)", gamma: "Moderate (Huge feature set can be overwhelming)" },
                { feature: "Export Quality", slidexy: "Perfect for PPTX & PDF", gamma: "Excellent across many formats" },
              ].map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>{row.feature}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: '#222' }}>{row.slidexy}</TableCell>
                  <TableCell align="center" sx={{ color: '#555' }}>{row.gamma}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 3. Pricing Comparison */}
      <Box sx={{ mb: 10 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: "28px",
            color: "#222",
            mb: 4,
            textAlign: "center",
          }}
        >
          Pricing Breakdown
        </Typography>
        <Grid container spacing={4}>
          <Grid  size={{xs:12,md:6}}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#444', mb: 2 }}>
                  Canva Pricing
                </Typography>
                <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: 1.8 }}>
                  <li><strong>Free:</strong> Drag & drop editor, up to 200 standard AI uses, 3 colors per brand kit.</li>
                  <li><strong>Pro ($120/yr):</strong> Premium tools (resize, background removal), 141M+ assets, 10x more AI data.</li>
                  <li><strong>Business ($210/yr):</strong> Adds team collaboration, admin tools, 100 Brand kits, and Leonardo.ai access.</li>
                  <li><strong>Enterprise:</strong> Custom pricing w/ 1TB storage, SSO, and multi-team management.</li>
                </ul>
                <Typography sx={{ mt: 3, color: '#d32f2f', fontWeight: 500 }}>
                  * Excellent value for general design teams, but a steep commitment if you only need fast AI presentations.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid  size={{xs:12,md:6}}>
            <Card sx={{ height: '100%', borderRadius: 3, border: '2px solid #6C2BD7', boxShadow: '0 8px 24px rgba(108, 43, 215, 0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#6C2BD7', mb: 2 }}>
                  SlideXY Pricing
                </Typography>
                <ul style={{ paddingLeft: '20px', color: '#333', lineHeight: 1.8 }}>
                  <li><strong>Free:</strong> Start generating AI slide decks instantly with zero upfront cost.</li>
                  <li><strong>Premium Upgrades:</strong> Highly affordable compared to standard $120/yr SaaS fees.</li>
                  <li><strong>Pakistan Optimized:</strong> We explicitly build for accessibility in environments where dollar inflation hurts.</li>
                  <li><strong>No Clutter:</strong> You pay for specialized presentation power, not a hundred tools you will never use.</li>
                </ul>
                <Typography sx={{ mt: 3, color: '#388e3c', fontWeight: 500 }}>
                  * Get exactly what you need: powerful AI presentations that respect your wallet.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* 4. Who Should Use Which */}
      <Box sx={{ background: "#F9F9F9", p: { xs: 3, md: 5 }, borderRadius: 3 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: "28px",
            color: "#222",
            mb: 4,
            textAlign: "center",
          }}
        >
          Final Decision: Who Should Use Which?
        </Typography>
        <Grid container spacing={4}>
          <Grid  size={{xs:12,md:6}}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#444', mb: 2 }}>
                Use Canva if:
              </Typography>
              <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: 1.8 }}>
                <li>You need a jack-of-all-trades tool for social media, print, video, and design.</li>
                <li>You have a budget of $120 to $210+ per year for your design software suite.</li>
                <li>You need access to a colossal 141M+ stock photo and asset library on a daily basis.</li>
              </ul>
            </Box>
          </Grid>
          <Grid  size={{xs:12,md:6}}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6C2BD7', mb: 2 }}>
                Use SlideXY if:
              </Typography>
              <ul style={{ paddingLeft: '20px', color: '#333', lineHeight: 1.8 }}>
                <li>Your primary pain point is building slide decks and presentations quickly.</li>
                <li>You want a focused AI workflow that generates highly structured slides from your prompt without UI clutter.</li>
                <li>You value software optimized for users in Pakistan and emerging markets, keeping pricing realistic.</li>
                <li>You want an affordable path to unbranded, professional PPTX & PDF exports.</li>
              </ul>
            </Box>
          </Grid>
        </Grid>
      </Box>

    </Box>
  );
}
