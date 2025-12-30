import React from "react";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Typography,
  IconButton,
  Slider,
  InputBase,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VerticalAlignCenterIcon from "@mui/icons-material/VerticalAlignCenter";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const fontOptions = ["Raleway", "Roboto", "Montserrat", "Inter"];
const weightOptions = ["Regular", "Semibold", "Bold"];
const textTypeOptions = ["Title", "Headline", "Body"];

const TextSettingsPanel: React.FC<{ sidebarHeight?: string | number }> = ({ sidebarHeight = '100vh' }) => {
  return (
    <Box
      sx={{
        width: 360,
        bgcolor: '#fff',
        height: sidebarHeight,
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
          sx={{ fontSize: 15, bgcolor: '#F5F5F5', borderRadius: 2, width: 70, height: 32 }}
          displayEmpty
          inputProps={{ 'aria-label': 'Percentage' }}
        >
          <MenuItem value={50}>50%</MenuItem>
          <MenuItem value={75}>75%</MenuItem>
          <MenuItem value={100}>100%</MenuItem>
        </Select>
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* Text Section */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>Text</Typography>
          <IconButton size="small"><SettingsIcon /></IconButton>
        </Box>
        <Select
          value={textTypeOptions[0]}
          size="small"
          fullWidth
          sx={{ mb: 1, borderRadius: 2, bgcolor: '#F8F8FA', fontWeight: 500, fontSize: 15, height: 44 }}
        >
          {textTypeOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
        </Select>
        <Select
          value={fontOptions[0]}
          size="small"
          fullWidth
          sx={{ mb: 1, borderRadius: 2, bgcolor: '#F8F8FA', fontWeight: 500, fontSize: 15, height: 44 }}
        >
          {fontOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
        </Select>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Select
            value={24}
            size="small"
            sx={{ borderRadius: 2, bgcolor: '#F8F8FA', fontWeight: 500, fontSize: 15, width: 80, height: 44 }}
          >
            {[16, 18, 20, 24, 28, 32, 36].map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
          </Select>
          <Select
            value={weightOptions[1]}
            size="small"
            sx={{ borderRadius: 2, bgcolor: '#F8F8FA', fontWeight: 500, fontSize: 15, width: 120, height: 44 }}
          >
            {weightOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </Select>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <IconButton sx={{ bgcolor: '#F8F8FA', borderRadius: 2, width: 38, height: 38 }}><FormatAlignLeftIcon /></IconButton>
          <IconButton sx={{ bgcolor: '#F8F8FA', borderRadius: 2, width: 38, height: 38 }}><FormatAlignCenterIcon /></IconButton>
          <IconButton sx={{ bgcolor: '#F8F8FA', borderRadius: 2, width: 38, height: 38 }}><FormatAlignRightIcon /></IconButton>
          <IconButton sx={{ bgcolor: '#F8F8FA', borderRadius: 2, width: 38, height: 38 }}><FormatAlignJustifyIcon /></IconButton>
          <IconButton sx={{ bgcolor: '#F8F8FA', borderRadius: 2, width: 38, height: 38 }}><VerticalAlignTopIcon /></IconButton>
          <IconButton sx={{ bgcolor: '#F8F8FA', borderRadius: 2, width: 38, height: 38 }}><VerticalAlignBottomIcon /></IconButton>
          <IconButton sx={{ bgcolor: '#F8F8FA', borderRadius: 2, width: 38, height: 38 }}><VerticalAlignCenterIcon /></IconButton>
          <IconButton sx={{ bgcolor: '#F8F8FA', borderRadius: 2, width: 38, height: 38 }}><SettingsIcon /></IconButton>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* Color Section */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1 }}>Color</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: '#6C2CF8',
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
      <Divider sx={{ my: 2 }} />
      {/* Effects Section */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>Effects</Typography>
          <Select
            value={"Opacity"}
            size="small"
            sx={{ fontSize: 15, bgcolor: '#F5F5F5', borderRadius: 2, width: 90, height: 32 }}
            displayEmpty
            inputProps={{ 'aria-label': 'Effect Type' }}
          >
            <MenuItem value={"Opacity"}>Opacity</MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Slider value={66} sx={{ color: '#7B4AE2', flex: 1 }} />
          <InputBase value="66%" sx={{ width: 54, fontWeight: 600, fontSize: 16, bgcolor: '#F8F8FA', borderRadius: 2, px: 1.5, py: 0.5, textAlign: 'center' }} readOnly />
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* Layer Order Section */}
      <Box sx={{ px: 3, mb: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowUpwardIcon />}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 15,
            bgcolor: '#F8F8FA',
            borderColor: '#E0E0E0',
            color: '#222',
            flex: 1,
            textTransform: 'none',
            '&:hover': { bgcolor: '#F3EDFF', borderColor: '#7B4AE2', color: '#7B4AE2' },
          }}
        >
          Bring Forward
        </Button>
        <Button
          variant="outlined"
          startIcon={<ArrowDownwardIcon />}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 15,
            bgcolor: '#F8F8FA',
            borderColor: '#E0E0E0',
            color: '#222',
            flex: 1,
            textTransform: 'none',
            '&:hover': { bgcolor: '#F3EDFF', borderColor: '#7B4AE2', color: '#7B4AE2' },
          }}
        >
          Send Backward
        </Button>
      </Box>
      {/* Reset Button */}
      <Box sx={{ px: 3, pb: 3, pt: 2 }}>
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

export default TextSettingsPanel; 