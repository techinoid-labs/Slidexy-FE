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
          borderRadius: 2.5,
          boxShadow: 3,
          p: 0,
          minWidth: 340,
          maxWidth: 380,
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
                gap: 2.5,
                px: 3.5,
                py: 2.7,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#F2F0FF' },
                borderRadius: idx === 0 ? '10px 10px 0 0' : idx === menuItems.length - 1 ? '0 0 10px 10px' : 0,
                transition: 'background 0.2s',
              }}
              onClick={() => onAction(item.key)}
            >
              <img src={item.icon} alt={item.title + ' icon'} width={32} height={32} style={{ flexShrink: 0 }} />
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#18181B', fontSize: 18, mb: 0.2 }}>{item.title}</Typography>
                <Typography sx={{ color: '#757575', fontSize: 15, fontWeight: 400 }}>{item.subtitle}</Typography>
              </Box>
            </Box>
            {idx < menuItems.length - 1 && <Divider sx={{ mx: 3.5 }} />}
          </React.Fragment>
        ))}
      </Box>
    </Popover>
  );
};

export default EditMenuCard; 