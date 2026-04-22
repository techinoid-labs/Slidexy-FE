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

export default function GammaComparison() {
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
                    SlideXY vs Gamma: Which is right for you?
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
                    If you are looking for the absolute best, highly polished, premium templates out of the box and have a large budget, <strong>Gamma</strong> is an excellent choice. However, if you need a reliable, highly capable AI presentation generator that wins on <strong>price and accessibility</strong> — especially for users in <strong>Pakistan</strong> and emerging markets — <strong>SlideXY</strong> is the clear winner. SlideXY gives you the essential AI power you need without trapping you in costly $108–$216/year subscriptions just to remove branding.
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
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#444' }}>Gamma</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[
                                { feature: "AI Presentation Generation", slidexy: "✅ Yes", gamma: "✅ Yes" },
                                { feature: "Templates Quality", slidexy: "Great variety", gamma: "Industry leading & polished" },
                                { feature: "Export to PPTX / PDF", slidexy: "✅ Yes", gamma: "✅ Yes" },
                                { feature: "Remove Branding", slidexy: "Available on highly affordable tiers", gamma: "Requires Plus/Pro ($108+ / year)" },
                                { feature: "Regional Accessibility & Payment Methods", slidexy: "Highly optimized for regions like Pakistan", gamma: "Standard global pricing" },
                                { feature: "Custom Branding & Fonts", slidexy: "✅ Yes", gamma: "Pro Plan only ($216 / year)" },
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
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#444', mb: 2 }}>
                                    Gamma Pricing
                                </Typography>
                                <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: 1.8 }}>
                                    <li><strong>Free:</strong> Max 10 cards/prompt, 400 signup credits. Gamma branding included.</li>
                                    <li><strong>Plus ($108/yr):</strong> Max 20 cards, 1,000 monthly credits. Removes branding.</li>
                                    <li><strong>Pro ($216/yr):</strong> Custom branding & fonts, detailed analytics, API access.</li>
                                    <li><strong>Ultra ($1,080/yr):</strong> Access to advanced models, custom domains.</li>
                                </ul>
                                <Typography sx={{ mt: 3, color: '#d32f2f', fontWeight: 500 }}>
                                    * The high barrier to entry can make removing basic branding expensive.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%', borderRadius: 3, border: '2px solid #6C2BD7', boxShadow: '0 8px 24px rgba(108, 43, 215, 0.12)' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#6C2BD7', mb: 2 }}>
                                    SlideXY Pricing
                                </Typography>
                                <ul style={{ paddingLeft: '20px', color: '#333', lineHeight: 1.8 }}>
                                    <li><strong>Free:</strong> Generous access to try the AI generation without heavy constraints.</li>
                                    <li><strong>Premium Tiers:</strong> Fraction of Gamma's cost. Designed to be accessible to everyone, not just large enterprises.</li>
                                    <li><strong>Pakistan Accessibility:</strong> Localized support and realistic price points for creators in Pakistan.</li>
                                    <li><strong>No Hidden Traps:</strong> Easy tier upgrades when you need advanced exports and custom branding.</li>
                                </ul>
                                <Typography sx={{ mt: 3, color: '#388e3c', fontWeight: 500 }}>
                                    * We believe top-tier tools shouldn't cost you $100+ upfront just to be usable.
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
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#444', mb: 2 }}>
                                Use Gamma if:
                            </Typography>
                            <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: 1.8 }}>
                                <li>Price is not an issue and you can easily afford $108 to $216 per year for software.</li>
                                <li>You heavily rely on getting the absolute highest-tier design templates instantly.</li>
                                <li>You want an AI tool to generate websites and documents as well as presentations.</li>
                            </ul>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6C2BD7', mb: 2 }}>
                                Use SlideXY if:
                            </Typography>
                            <ul style={{ paddingLeft: '20px', color: '#333', lineHeight: 1.8 }}>
                                <li>You need to build slides fast, beautifully, and cost-effectively.</li>
                                <li>You are based in Pakistan or regions where software subscriptions can be prohibitively expensive.</li>
                                <li>You want essential features (like watermark removal) without paying exorbitant corporate prices.</li>
                                <li>You value an independent company actively building features tailored for its community.</li>
                            </ul>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

        </Box>
    );
}
