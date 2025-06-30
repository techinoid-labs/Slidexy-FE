"use client";

import { Box, Typography, Button } from "@mui/material";
import img from "next/image";

export default function TestimonialSection() {
    return (
        <Box
            sx={{
                width: '100%',
                height: 566,
                background: "#F9F9FB",
                px: "112px",
                py: "96px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                gap: "152px",
                mx: "auto",
            }}
        >
            {/* Main Content Row */}
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 'auto' }}>
                {/* Left Arrow */}
                <Button
                    sx={{
                        minWidth: 0,
                        width: 60,
                        height: 60,
                        p: 0,
                        borderRadius: '50%',
                        background: 'transparent',
                        boxShadow: '0 1px 4px 0 rgba(80, 80, 120, 0.07)',
                        mr: 8,
                        '&:hover': { background: '#F3F0FF' },
                    }}
                >
                    <img
                        src="/images/left-arrow.svg"
                        alt="Left Arrow"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%',
                        }}
                    />
                </Button>

                {/* Testimonial Content */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Quote Icon */}
                    <Box sx={{ mb: 2 }}>
                        <img
                            src="/images/quote-mark.svg"
                            alt="Opening Quote"
                            width={56}
                            height={56}
                        />
                    </Box>
                    {/* Testimonial Text */}
                    <Typography sx={{ color: '#444', fontWeight: 400, fontSize: '2rem', textAlign: 'center', mb: 4, maxWidth: 700 }}>
                        I needed a pitch deck for investment but had no business background. Your AI created a near-perfect presentation in minutes.
                    </Typography>
                    {/* Divider */}
                    <Box sx={{ width: 40, height: 1, background: '#E0E0E0', mb: 3 }} />
                    {/* Logo Placeholder */}
                    <Box sx={{ mb: 3 }}>
                        <img
                            src="/images/client-logo.svg" 
                            alt="Testimonial Card"
                            width={250} 
                            height={150} 
                            style={{ display: 'block' }}
                        />
                    </Box>
                </Box>
                {/* Right Arrow */}
                <Button
                    sx={{
                        minWidth: 0,
                        width: 60,
                        height: 60,
                        p: 0,
                        borderRadius: '50%',
                        background: 'transparent',
                        boxShadow: '0 1px 4px 0 rgba(80, 80, 120, 0.07)',
                        mr: 8,
                        '&:hover': { background: '#F3F0FF' },
                    }}
                >
                    <img
                        src="/images/right-arrow.svg"
                        alt="Right Arrow"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%',
                        }}
                    />
                </Button>
            </Box>
        </Box>
    );
}
