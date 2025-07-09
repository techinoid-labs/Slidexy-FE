"use client";

import { Box, Typography, Button } from "@mui/material";

export default function CommunitySection() {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw',
        background: '#723AFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pt: { xs: 8, md: '96px' },
        pb: { xs: 8, md: '96px' },
        px: { xs: 3, md: '112px' },
        gap: { xs: 6, md: '80px' },
        boxSizing: 'border-box',
        mx: 'auto',
      }}
    >
      {/* Icon */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/images/community-icon.svg"
            alt="Community Icon"
            width={72}
            height={72}
            style={{ objectFit: 'contain' }}
          />
        </Box>
      </Box>

      {/* Heading */}
      <Typography
        sx={{
          color: '#fff',
          fontWeight: 600,
          fontSize: { xs: '2rem', md: '3rem' },
          textAlign: 'center',
          mt: { xs: 0, md: -10 },
        }}
      >
        Join the community
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          color: '#fff',
          fontWeight: 400,
          fontSize: { xs: '1rem', md: '1.18rem' },
          textAlign: 'center',
          maxWidth: 700,
          mt: { xs: 0, md: -10 },
        }}
      >
        Join our 400,000+ person community and contribute to a more private and decentralized internet. Start for free.
      </Typography>

      {/* Button */}
      <Button
        variant="contained"
        sx={{
          background: '#fff',
          color: '#723AFF',
          borderRadius: '999px',
          px: { xs: 4, md: 6 },
          py: 1.5,
          fontWeight: 600,
          fontSize: { xs: '1rem', md: '1.18rem' },
          textTransform: 'none',
          boxShadow: '0 2px 8px 0 rgba(80, 80, 120, 0.07)',
          mt: { xs: 2, md: -8 },
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
