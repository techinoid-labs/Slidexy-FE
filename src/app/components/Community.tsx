"use client";

import { Box, Typography, Button } from "@mui/material";

export default function CommunitySection() {
  return (
    <Box
      sx={{
        width: '160vw',
        maxWidth: '100vw',
        height: 520,
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#723AFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pt: '96px',
        pr: '112px',
        pb: '96px',
        pl: '112px',
        gap: '80px',
        boxSizing: 'border-box',
        mx: 'auto',
      }}
    >
      {/* Discord Icon Placeholder */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: 72, height: 72, borderRadius: '50%', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: '#fff', fontSize: 64 }}>[icon]</Typography>
        </Box>
      </Box>
      {/* Heading */}
      <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '2.2rem', md: '3rem' }, mb: 2, textAlign: 'center', mt: -10 }}>
        Join the community
      </Typography>
      {/* Subtitle */}
      <Typography sx={{ color: '#fff', fontWeight: 400, fontSize: '1.18rem', mb: 0, textAlign: 'center', maxWidth: 700 , mt : -10}}>
        Join our 400,000+ person community and contribute to a more private and decentralized internet. Start for free.
      </Typography>
      {/* Join Discord Button */}
      <Button
        variant="contained"
        sx={{
          background: '#fff',
          color: '#723AFF',
          borderRadius: '999px',
          px: 6,
          py: 2,
          fontWeight: 600,
          fontSize: '1.18rem',
          textTransform: 'none',
          boxShadow: '0 2px 8px 0 rgba(80, 80, 120, 0.07)',
          mt: -8,
          '&:hover': {
            background: '#F3F0FF',
          },
        }}
      >
        Join Discord
      </Button>
    </Box>
  );
}
