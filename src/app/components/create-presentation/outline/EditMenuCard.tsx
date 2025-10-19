import React from "react";
import { Popover, Box, Typography, Divider, IconButton } from "@mui/material";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ImageIcon from '@mui/icons-material/Image';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandIcon from '@mui/icons-material/UnfoldMore';
import CompressIcon from '@mui/icons-material/UnfoldLess';

const menuItems = [
  {
    key: 'longer',
    icon: '/images/rewrite-icon.svg',
    title: 'Longer',
    subtitle: 'Expand the content with additional details',
  },
  {
    key: 'shorter',
    icon: '/images/shorter.svg',
    title: 'Shorter',
    subtitle: 'Condense the information for quick reference',
  },
  {
    key: 'rewrite',
    icon: '/images/rewrite-icon.svg',
    title: 'Rewrite slide',
    subtitle: 'Regenerate the title and all content outlines of the slide',
  },
  {
    key: 'bullets',
    icon: '/images/bullet-icon.svg',
    title: 'Bullets Format',
    subtitle: 'Convert to bullet points for easy reading',
  },
  {
    key: 'list',
    icon: '/images/list-icon.svg',
    title: 'List Format',
    subtitle: 'Convert the content to list view for easy reading',
  },
  {
    key: 'regenerate-images',
    icon: '/images/regenerate-image.svg',
    title: 'Regenerate Images',
    subtitle: 'Generate fresh ideas and creative images as per prompt',
  },
  {
    key: 'custom',
    icon: '/images/custom-suggestions.svg',
    title: 'New Custom Suggestions',
    subtitle: 'Generate fresh ideas and creative content',
  },
];

interface EditMenuCardProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onAction: (key: string) => void;
}

const EditMenuCard: React.FC<EditMenuCardProps> = ({ open, anchorEl, onClose, onAction }) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
          p: 0,
          minWidth: { xs: 60, sm: 220, md: 340 }, // smaller for mobile
          maxWidth: { xs: 60, sm: 340, md: 380 }, // smaller for mobile
          bgcolor: '#fff',
        },
      }}
    >
      <Box sx={{ p: 0, width: '100%' }}>
        {menuItems.map((item, idx) => (
          <React.Fragment key={item.key}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: { xs: 1, sm: 2, md: 2.5 },
                px: { xs: 0.5, sm: 2.5, md: 3.5 }, // less padding for mobile
                py: { xs: 0.5, sm: 2, md: 2.7 },   // less padding for mobile
                cursor: 'pointer',
                '&:hover': { bgcolor: '#F2F0FF' },
                borderRadius: idx === 0 ? { xs: '3px 3px 0 0', md: '5px 5px 0 0' } : idx === menuItems.length - 1 ? { xs: '0 0 3px 3px', md: '0 0 5px 5px' } : 0,
                transition: 'background 0.2s',
              }}
              onClick={() => onAction(item.key)}
            >
              <img src={item.icon} alt={item.title + ' icon'} width={18} height={18} style={{ flexShrink: 0 }} /> {/* smaller icon for mobile */}
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#18181B', fontSize: { xs: 12, sm: 16, md: 18 }, mb: 0.2 }}>{item.title}</Typography>
                <Typography sx={{ color: '#757575', fontSize: { xs: 10, sm: 14, md: 15 }, fontWeight: 400 }}>{item.subtitle}</Typography>
              </Box>
            </Box>
            {idx < menuItems.length - 1 && <Divider sx={{ mx: { xs: 1.5, sm: 2.5, md: 3.5 } }} />}
          </React.Fragment>
        ))}
      </Box>
    </Popover>
  );
};

export default EditMenuCard; 
