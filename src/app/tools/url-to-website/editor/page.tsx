"use client";

import React from 'react'
import Header from '@/app/components/headers-navbar/Header'
import RightPanel from './components/editor'
import { Box, Typography } from '@mui/material'

function Editor() {
    return (
        <div className="bg-white">
            <Header />
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: { xs: 5, md: 5 },
                    px: { xs: 2, md: 6 },
                    bgcolor: "rgba(254, 254, 255, 1)",
                }}
            >
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 1, color: "rgba(26, 26, 26, 1) ", fontSize: "60px", }}>
                    Url-to-Website
                </Typography>

                <Typography sx={{
                    color: "rgba(109, 109, 109, 1)", maxWidth: 580, fontSize: { xs: "16px", md: "18px" },
                    textAlign: "center"
                }}>
                    Elevate your presentations with our AI-powered tool—create&nbsp;polished,
                    professional slides in just seconds.
                </Typography>
            </Box>
            <RightPanel />
        </div>
    )
}

export default Editor