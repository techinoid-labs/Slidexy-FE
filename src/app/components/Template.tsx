""
import React from "react";
import { Box, IconButton, InputBase, Tabs, Tab, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface TemplatePanelProps {
  sidebarHeight?: string | number;
  onClose?: () => void;
}

const sectionData = [
  { title: "Social Media" },
  { title: "Email Marketing" },
  { title: "Content Creation" },
];

const TemplatePanel: React.FC<TemplatePanelProps> = ({ sidebarHeight = '100vh', onClose }) => (
  <Box
    sx={{
      position: 'absolute',
      left: 80,
      top: 0,
      height: sidebarHeight,
      width: 320,
      bgcolor: '#fff',
      borderRight: '1px solid #E0E0E0',
      borderTop: 'none',
      zIndex: 10,
      boxShadow: 2,
      display: 'flex',
      flexDirection: 'column',
      p: 0,
    }}
  >
    {/* Header */}
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 2 }}>
      <Box sx={{ fontWeight: 600, fontSize: 20 }}>Templates</Box>
      <IconButton size="small" onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Box>
    {/* Search Bar */}
    <Box sx={{ px: 3, pb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#F5F5F5',
          borderRadius: 2,
          px: 2,
          height: 40,
        }}
      >
        <InputBase placeholder="Search..." sx={{ flex: 1, fontSize: 15 }} />
        <SearchIcon sx={{ color: '#888' }} />
      </Box>
    </Box>
    {/* Tabs */}
    <Box sx={{ display: 'flex', px: 3, pb: 2 }}>
      <Box
        sx={{
          flex: 1,
          bgcolor: '#F3EDFF',
          color: '#7B4AE2',
          fontWeight: 600,
          borderRadius: 2,
          textAlign: 'center',
          py: 1,
          cursor: 'pointer',
          fontSize: 15,
        }}
      >
        From Slide AI
      </Box>
      <Box sx={{ width: 8 }} />
      <Box
        sx={{
          flex: 1,
          bgcolor: 'transparent',
          color: '#888',
          fontWeight: 500,
          borderRadius: 2,
          textAlign: 'center',
          py: 1,
          cursor: 'pointer',
          fontSize: 15,
        }}
      >
        Your Templates
      </Box>
    </Box>
    <Divider />
    {/* Sections */}
    <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 2 }}>
      {sectionData.map((section, idx) => (
        <Box key={section.title} sx={{ mb: 3 }}>
          {/* Section Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ fontWeight: 500, fontSize: 16 }}>{section.title}</Box>
            <ArrowForwardIosIcon sx={{ fontSize: 16, color: '#888' }} />
          </Box>
          {/* Placeholder Cards Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1,
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
      ))}
    </Box>
  </Box>
);

export default TemplatePanel;
