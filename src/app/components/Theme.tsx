import React from "react";
import { Box, Button, Divider, MenuItem, Select, Typography } from "@mui/material";

// PaletteStack: renders a stack of overlapping color circles
interface PaletteStackProps {
  colors: string[];
  size?: number;
  overlap?: number;
}

const PaletteStack: React.FC<PaletteStackProps> = ({ colors, size = 38, overlap = 14 }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', height: size, width: size + (colors.length - 1) * overlap }}>
    {colors.map((color, i) => (
      <Box
        key={i}
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          bgcolor: color,
          border: 'none',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
          position: 'absolute',
          left: i * overlap,
          zIndex: colors.length - i,
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
      />
    ))}
  </Box>
);

// Sample palettes (replace with API data later)
const palettes = [
  ['#E09B4B', '#F5D7A1', '#F9EEDB', '#3C2B1C'],
  ['#B6D44A', '#1B5E20', '#3DE1C1', '#00695C'],
  ['#7B4AE2', '#B39DDB', '#E1BEE7', '#9575CD'],
];

const ThemePanel: React.FC = () => {
  return (
    <Box
      sx={{
        width: 360,
        bgcolor: '#fff',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: 0,
        borderRight: '1px solid #E0E0E0',
      }}
    >
      {/* Tabs */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 2, pb: 1 }}>
        <Box
          sx={{
            bgcolor: '#F5F5F5',
            color: '#222',
            fontWeight: 600,
            borderRadius: 2,
            px: 2.5,
            py: 1,
            fontSize: 15,
            mr: 2,
          }}
        >
          Settings
        </Box>
        <Box sx={{ color: '#888', fontWeight: 500, fontSize: 15, mr: 2, py: 1, cursor: 'pointer' }}>
          Animate
        </Box>
        <Box sx={{ flex: 1 }} />
        <Select
          value={50}
          size="small"
          sx={{ fontSize: 15, bgcolor: '#F5F5F5', borderRadius: 2, width: 95, height: 32 }}
          displayEmpty
          inputProps={{ 'aria-label': 'Percentage' }}
        >
          <MenuItem value={50}>50%</MenuItem>
          <MenuItem value={75}>75%</MenuItem>
          <MenuItem value={100}>100%</MenuItem>
        </Select>
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* Theme Palette */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 17, mb: 1, letterSpacing: 0.2 }}>Theme Palette</Typography>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', alignItems: 'center', mb: 2 }}>
          {palettes.map((colors, idx) => (
            <PaletteStack key={idx} colors={colors} />
          ))}
        </Box>
      </Box>
      <Divider />
      {/* Presentation Style */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 16, mb: 1 }}>Presentation Style</Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            mb: 2,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              sx={{
                bgcolor: '#F5F5F5',
                borderRadius: 2,
                height: 48,
                mb: 1,
                border: '1px solid #ECECEC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.6,
              }}
            >
              {/* Placeholder rectangle */}
              <Box sx={{ width: '70%', height: '60%', bgcolor: '#E0E0E0', borderRadius: 1 }} />
            </Box>
          ))}
        </Box>
      </Box>
      <Divider />
      {/* Color */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 16, mb: 1 }}>Color</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: '#F5F5F5',
              border: '1px solid #E0E0E0',
            }}
          />
          <Select
            value={''}
            displayEmpty
            size="small"
            sx={{ flex: 1, bgcolor: '#F5F5F5', borderRadius: 2, height: 40 }}
            inputProps={{ 'aria-label': 'Choose Style' }}
          >
            <MenuItem value={''} disabled>Choose Style</MenuItem>
            <MenuItem value={'style1'}>Style 1</MenuItem>
            <MenuItem value={'style2'}>Style 2</MenuItem>
          </Select>
        </Box>
      </Box>
      {/* Reset Button */}
      <Box sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          fullWidth
          sx={{
            bgcolor: 'linear-gradient(90deg, #7B4AE2 0%, #5F2EEA 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 18,
            borderRadius: 8,
            py: 1.5,
            textTransform: 'none',
            boxShadow: '0 2px 8px 0 rgba(123,74,226,0.15)',
            background: 'linear-gradient(90deg, #7B4AE2 0%, #5F2EEA 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #5F2EEA 0%, #7B4AE2 100%)',
            },
          }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default ThemePanel;
