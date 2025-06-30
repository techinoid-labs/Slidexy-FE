"use client";

import { Box, Typography, Chip, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

export default function PricingSection() {
  const [plan, setPlan] = useState('monthly');
  return (
    <Box
      sx={{
        width: 1440,
        height: 1000,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: '80px',
        pr: '162px',
        pb: '80px',
        pl: '162px',
        gap: '48px',
        boxSizing: 'border-box',
        mx: 'auto',
      }}
    >
      <Box sx={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Badge */}
      <Chip
        icon={
          <img
            src="/images/side-star-purple.svg"
            alt="Icon"
            width={20}
            height={20}
            style={{ marginRight: 4 }}
          />
        }
        label={
          <span style={{ fontWeight: 500, fontSize: "1rem", color: "#4A00E0" }}>
            Pricing Plans
          </span>
        }
        sx={{
          background: "#F3F0FF",
          color: "#4A00E0",
          px: 2,
          py: 0.5,
          fontWeight: 500,
          fontSize: "1rem",
          borderRadius: "999px",
          mb: 4,
          width: "fit-content",
          '& .MuiChip-icon': {
            marginRight: '6px',
          },
        }}
      />
      {/* Heading */}
      <Typography sx={{ fontWeight: 600, fontSize: { xs: '2.2rem', md: '2.8rem' }, color: '#222', mb: 2, textAlign: 'center' }}>
        Enjoy all our feature by subscribing regularly!
      </Typography>
      {/* Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <ToggleButtonGroup
          value={plan}
          exclusive
          onChange={(_, v) => v && setPlan(v)}
          sx={{
            background: '#fff',
            borderRadius: '32px',
            boxShadow: '0 1px 4px 0 rgba(80, 80, 120, 0.07)',
            p: 0.5,
            minWidth: 320,
            height: 56,
          }}
        >
          <ToggleButton value="monthly" sx={{ fontWeight: 600, fontSize: '1.15rem', border: 'none', borderRadius: '32px', px: 4, color: plan === 'monthly' ? '#18181B' : '#757575', background: plan === 'monthly' ? '#F3F0FF' : 'transparent', transition: 'all 0.2s' }}>Monthly</ToggleButton>
          <ToggleButton value="yearly" sx={{ fontWeight: 600, fontSize: '1.15rem', border: 'none', borderRadius: '32px', px: 4, color: plan === 'yearly' ? '#18181B' : '#757575', background: plan === 'yearly' ? '#F3F0FF' : 'transparent', transition: 'all 0.2s' }}>Yearly</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {/* Secure Payment Note */}
      <Typography sx={{ color: '#757575', fontSize: '1rem', mb: 4, textAlign: 'center' }}>
        100% Secure payment plan with money back guarantee.
      </Typography>
      {/* Pricing Cards */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '48px', justifyContent: 'center', alignItems: 'flex-start', width: '100%', mt: 0, mb: 0 }}>
        {/* Card 1: Basic */}
        <Box sx={{ width: 355, height: 590, background: '#fff', borderRadius: '20px', border: '1px solid #E9E9FF', boxShadow: '0 2px 16px 0 rgba(80, 80, 120, 0.07)', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 3, md: 0 } }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#222', mb: 1 }}>Basic</Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '2.8rem', color: '#18181B' }}>$9</Typography>
            <Typography sx={{ color: '#757575', fontSize: '1.1rem', mb: 0.5 }}>/month</Typography>
          </Box>
          <Typography sx={{ color: '#757575', fontSize: '1rem', mb: 3, textAlign: 'center' }}>
            Choose the plan that fits your business needs
          </Typography>
          <Button variant="contained" sx={{ background: '#F3F0FF', color: '#6C2BD7', borderRadius: '999px', px: 4, py: 1.5, fontWeight: 600, fontSize: '1.1rem', textTransform: 'none', width: '100%', mb: 3, boxShadow: 'none', '&:hover': { background: '#E9E9FF' } }} endIcon={<span style={{ fontSize: 22, marginLeft: 4 }}>→</span>}>
            Get Started
          </Button>
          <Box sx={{ width: '100%', borderTop: '1px solid #E9E9FF', my: 2 }} />
          <Box sx={{ width: '100%' }}>
            {['Unlimited decks', 'Style library access', 'Branding customization', 'Team collaboration', 'Priority export formats'].map((feature, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <span style={{ color: '#6C2BD7', fontSize: 20, marginRight: 10 }}>✔</span>
                <Typography sx={{ color: '#222', fontSize: '1rem' }}>{feature}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Card 2: Exclusive */}
        <Box sx={{ width: 355, height: 590, background: '#fff', borderRadius: '20px', border: '2px solid #6C2BD7', boxShadow: '0 2px 16px 0 rgba(80, 80, 120, 0.07)', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 3, md: 0 } }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#222', mb: 1 }}>Exclusive</Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '2.8rem', color: '#18181B' }}>$14</Typography>
            <Typography sx={{ color: '#757575', fontSize: '1.1rem', mb: 0.5 }}>/month</Typography>
          </Box>
          <Typography sx={{ color: '#757575', fontSize: '1rem', mb: 3, textAlign: 'center' }}>
            Choose the plan that fits your business needs
          </Typography>
          <Button variant="contained" sx={{ background: '#6C2BD7', color: '#fff', borderRadius: '999px', px: 4, py: 1.5, fontWeight: 600, fontSize: '1.1rem', textTransform: 'none', width: '100%', mb: 3, boxShadow: 'none', '&:hover': { background: '#4A00E0' } }} endIcon={<span style={{ fontSize: 22, marginLeft: 4 }}>→</span>}>
            Get Started
          </Button>
          <Box sx={{ width: '100%', borderTop: '1px solid #E9E9FF', my: 2 }} />
          <Box sx={{ width: '100%' }}>
            {['Unlimited decks', 'Style library access', 'Branding customization', 'Team collaboration', 'Priority export formats'].map((feature, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <span style={{ color: '#6C2BD7', fontSize: 20, marginRight: 10 }}>✔</span>
                <Typography sx={{ color: '#222', fontSize: '1rem' }}>{feature}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Card 3: Platinum */}
        <Box sx={{ width: 355, height: 590, background: '#fff', borderRadius: '20px', border: '1px solid #E9E9FF', boxShadow: '0 2px 16px 0 rgba(80, 80, 120, 0.07)', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#222', mb: 1 }}>Platinum</Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '2.8rem', color: '#18181B' }}>$20</Typography>
            <Typography sx={{ color: '#757575', fontSize: '1.1rem', mb: 0.5 }}>/month</Typography>
          </Box>
          <Typography sx={{ color: '#757575', fontSize: '1rem', mb: 3, textAlign: 'center' }}>
            Choose the plan that fits your business needs
          </Typography>
          <Button variant="contained" sx={{ background: '#F3F0FF', color: '#6C2BD7', borderRadius: '999px', px: 4, py: 1.5, fontWeight: 600, fontSize: '1.1rem', textTransform: 'none', width: '100%', mb: 3, boxShadow: 'none', '&:hover': { background: '#E9E9FF' } }} endIcon={<span style={{ fontSize: 22, marginLeft: 4 }}>→</span>}>
            Get Started
          </Button>
          <Box sx={{ width: '100%', borderTop: '1px solid #E9E9FF', my: 2 }} />
          <Box sx={{ width: '100%' }}>
            {['Unlimited decks', 'Style library access', 'Branding customization', 'Team collaboration', 'Priority export formats'].map((feature, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <span style={{ color: '#6C2BD7', fontSize: 20, marginRight: 10 }}>✔</span>
                <Typography sx={{ color: '#222', fontSize: '1rem' }}>{feature}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      </Box>
    </Box>
  );
}
