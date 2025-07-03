import React from "react";
import { Box, Typography, IconButton, InputBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const shapes = [
  {
    name: "Line",
    svg: (
      <svg width="40" height="40"><line x1="8" y1="20" x2="32" y2="20" stroke="#222" strokeWidth="2" /></svg>
    ),
  },
  {
    name: "Arrow",
    svg: (
      <svg width="40" height="40"><line x1="8" y1="20" x2="32" y2="20" stroke="#222" strokeWidth="2" /><polygon points="32,20 26,16 26,24" fill="#222" /></svg>
    ),
  },
  {
    name: "Square",
    svg: (
      <svg width="40" height="40"><rect x="10" y="10" width="20" height="20" stroke="#222" strokeWidth="2" fill="none" /></svg>
    ),
  },
  {
    name: "Circle",
    svg: (
      <svg width="40" height="40"><circle cx="20" cy="20" r="10" stroke="#222" strokeWidth="2" fill="none" /></svg>
    ),
  },
  {
    name: "Diamond",
    svg: (
      <svg width="40" height="40"><polygon points="20,8 32,20 20,32 8,20" stroke="#222" strokeWidth="2" fill="none" /></svg>
    ),
  },
  {
    name: "Rounded Rectangle",
    svg: (
      <svg width="40" height="40"><rect x="10" y="14" width="20" height="12" rx="6" stroke="#222" strokeWidth="2" fill="none" /></svg>
    ),
  },
  {
    name: "Triangle",
    svg: (
      <svg width="40" height="40"><polygon points="20,10 32,30 8,30" stroke="#222" strokeWidth="2" fill="none" /></svg>
    ),
  },
  {
    name: "Inverted Triangle",
    svg: (
      <svg width="40" height="40"><polygon points="8,14 32,14 20,32" stroke="#222" strokeWidth="2" fill="none" /></svg>
    ),
  },
  {
    name: "Pentagon",
    svg: (
      <svg width="40" height="40"><polygon points="20,8 32,16 27,32 13,32 8,16" stroke="#222" strokeWidth="2" fill="none" /></svg>
    ),
  },
  {
    name: "Hexagon",
    svg: (
      <svg width="40" height="40"><polygon points="12,12 28,12 36,20 28,28 12,28 4,20" stroke="#222" strokeWidth="2" fill="none" /></svg>
    ),
  },
  {
    name: "Star",
    svg: (
      <svg width="40" height="40"><polygon points="20,8 23,16 32,16 25,22 27,32 20,26 13,32 15,22 8,16 17,16" stroke="#222" strokeWidth="2" fill="none" /></svg>
    ),
  },
  {
    name: "Burst Star",
    svg: (
      <svg width="40" height="40"><polygon points="20,6 23,16 34,10 26,20 36,22 26,24 34,34 23,28 20,38 17,28 6,34 14,24 4,22 14,20 6,10 17,16" stroke="#222" strokeWidth="2" fill="none" /></svg>
    ),
  },
];

const Shapes: React.FC<{ sidebarHeight?: string | number; onClose?: () => void }> = ({ sidebarHeight = '100vh', onClose }) => (
  <Box
    sx={{
      width: 320,
      bgcolor: '#fff',
      height: sidebarHeight,
      position: 'absolute',
      left: 80,
      top: 0,
      borderRight: '1px solid #E0E0E0',
      zIndex: 10,
      boxShadow: 2,
      display: 'flex',
      flexDirection: 'column',
      p: 0,
    }}
  >
    {/* Header */}
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 2 }}>
      <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Shapes</Typography>
      <IconButton size="small" onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Box>
    {/* Search Bar */}
    <Box sx={{ px: 3, mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#F8F8FA',
          borderRadius: 8,
          px: 2,
          height: 40,
          border: '2px solid #E5DFFF',
        }}
      >
        <SearchIcon sx={{ color: '#B0AEB8', mr: 1 }} />
        <InputBase placeholder="Search..." sx={{ flex: 1, fontSize: 15 }} />
      </Box>
    </Box>
    {/* Essentials Section */}
    <Box sx={{ px: 3, pb: 2 }}>
      <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1 }}>Essentials</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
        }}
      >
        {shapes.map((shape, idx) => (
          <Box
            key={idx}
            sx={{
              bgcolor: '#F8F8FA',
              borderRadius: 3,
              p: 2,
              minHeight: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'none',
              border: '1px solid #ECECEC',
              cursor: 'pointer',
              '&:hover': { borderColor: '#7B4AE2', boxShadow: '0 2px 8px 0 #7B4AE222' },
            }}
          >
            {shape.svg}
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default Shapes;
