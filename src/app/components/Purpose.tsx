"use client";

import { Box, Typography, Chip, useTheme } from "@mui/material";
import Image from "next/image";

export default function PurposeSection() {
    const theme = useTheme();
    return (
        <Box sx={{ width: '100%', background: '#fff', py: { xs: 6, md: 10 }, px: { xs: 2, md: 0 } }}>
            {/* Top Row: Badge, Title, Subtitle */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', maxWidth: 1200, mx: 'auto', mb: 4 }}>
                <Box>
                    <Chip
                        icon={
                            <img
                                src="/images/side-star-purple.svg" // <-- update with your actual image path
                                alt="Icon"
                                width={20}
                                height={20}
                                style={{ marginRight: '4px' }}
                            />
                        }
                        label={
                            <span style={{ fontWeight: 500, fontSize: '1rem', color: '#4A00E0' }}>
                                Plateform
                            </span>
                        }
                        sx={{
                            background: '#F3F0FF',
                            color: '#4A00E0',
                            px: 2,
                            py: 0.5,
                            fontWeight: 500,
                            fontSize: '1rem',
                            borderRadius: '999px',
                            mb: 2,
                            '& .MuiChip-icon': {
                                marginRight: '6px',
                            },
                        }}
                    />

                    <Typography variant="h1" sx={{
                        fontWeight: 550, fontSize: { xs: '3rem', md: '4rem' }
                        , color: '#18181B', mb: 0.5
                    }}>
                        Why
                        <br />
                        PromptSlide?
                    </Typography>
                </Box>
                <Typography sx={{ color: '#757575', fontSize: { xs: '1.5rem', md: '1.3rem' }, maxWidth: 600, mt: 2, textAlign: 'right' }}>
                    Turn any thought into a polished, on-brand presentation —<br />powered by AI, styled by designers.
                </Typography>
            </Box>

            {/* Grid of Cards */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
                gridTemplateRows: { xs: 'auto', md: 'repeat(2, 1fr)' },
                gap: { xs: 3, md: 4 },
                maxWidth: 1350,
                mx: 'auto',
                mb: 4,
            }}>
                {/* Large Card: Context-aware content generation */}
                <Box sx={{
                    gridRow: { md: '1 / span 2' },
                    gridColumn: { xs: '1', md: '1' },
                    bgcolor: 'transparent',
                    background: 'linear-gradient(180deg, #EEF1F7 0%, #FFFFFF 100%)',
                    borderRadius: 4,
                    boxShadow: '0 4px 24px 0 rgba(80, 80, 120, 0.07)',
                    p: { xs: 4, md: 5 },
                    minHeight: 380,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                    <Box>
                        <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: '#E9E9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <Typography sx={{ color: '#8E2DE2', fontSize: 24 }}>★</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 600, fontSize: { xs: '1.15rem', md: '1.35rem' }, color: '#18181B', mb: 1 }}>
                            Context-aware content generation
                        </Typography>
                        <Typography sx={{ color: '#757575', fontSize: { xs: '0.98rem', md: '1.05rem' }, mb: 2 }}>
                            AI turns a prompt into a styled presentation with sections, tone, goals, keywords, and a smart title.
                        </Typography>
                    </Box>
                    {/* Image Placeholder */}
                    <Box sx={{ width: '100%', height: 120, background: '#E6E6F7', borderRadius: 3, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ color: '#B0AEEB' }}>[Image Placeholder]</Typography>
                    </Box>
                </Box>

                {/* Top Right Card: AI picks visual hierarchy */}
                <Box sx={{
                    bgcolor: 'transparent',
                    background: 'linear-gradient(111.14deg, #F0EFFF 4.64%, #FFFFFF 100%)',
                    borderRadius: 4,
                    boxShadow: '0 4px 24px 0 rgba(80, 80, 120, 0.07)',
                    p: { xs: 4, md: 5 },
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: '#E9E9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <Typography sx={{ color: '#8E2DE2', fontSize: 24 }}>★</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.18rem' }, color: '#18181B', mb: 1 }}>
                        AI picks visual hierarchy
                    </Typography>
                    <Typography sx={{ color: '#757575', fontSize: { xs: '0.98rem', md: '1.05rem' }, mb: 2 }}>
                        AI transcribes and analyzes spoken ideas to auto-generate slides with key points and speaker notes.
                    </Typography>
                    {/* Image Placeholder */}
                    <Box sx={{ width: '100%', height: 48, background: '#E6E6F7', borderRadius: 2, mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ color: '#B0AEEB' }}>[Image Placeholder]</Typography>
                    </Box>
                </Box>

                {/* Bottom Right Card: Edit with natural language */}
                <Box sx={{
                    bgcolor: 'transparent',
                    background: 'linear-gradient(112.44deg, #DFE9FE -9.69%, #FCFDFF 100%)',
                    borderRadius: 4,
                    boxShadow: '0 4px 24px 0 rgba(80, 80, 120, 0.07)',
                    p: { xs: 4, md: 5 },
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: '#E9E9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <Typography sx={{ color: '#8E2DE2', fontSize: 24 }}>★</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.18rem' }, color: '#18181B', mb: 1 }}>
                        Edit with natural language
                    </Typography>
                    <Typography sx={{ color: '#757575', fontSize: { xs: '0.98rem', md: '1.05rem' } }}>
                        AI transcribes and analyzes spoken ideas to auto-generate slides with key points and speaker notes.
                    </Typography>
                </Box>
            </Box>

            {/* Full-width Card: One-click export */}
            <Box sx={{
                maxWidth: 1350,
                mx: 'auto',
                mt: { xs: 3, md: 4 },
                bgcolor: 'transparent',
                background: 'linear-gradient(94.38deg, #ECE2FF -101.47%, #FAF8FF 100%)',
                borderRadius: 4,
                boxShadow: '0 4px 24px 0 rgba(80, 80, 120, 0.07)',
                p: { xs: 4, md: 5 },
                minHeight: 160,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
            }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: '#E9E9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                    <Typography sx={{ color: '#8E2DE2', fontSize: 24 }}>★</Typography>
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.18rem' }, color: '#18181B', mb: 0.5 }}>
                        One-click export
                    </Typography>
                    <Typography sx={{ color: '#757575', fontSize: { xs: '0.98rem', md: '1.05rem' } }}>
                        Google Slides, PowerPoint, PDF
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
