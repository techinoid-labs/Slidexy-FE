import React from "react";
import { Paper, IconButton, Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";

interface OutlineCardProps {
  index: number;
  title: string;
  onDelete: () => void;
  dragHandleProps?: any;
  isDragging?: boolean;
  expanded?: boolean;
  bullets?: string[];
  images?: string[];
  onEdit?: (event: React.MouseEvent<HTMLElement>) => void;
}

const OutlineCard: React.FC<OutlineCardProps> = ({
  index,
  title,
  onDelete,
  dragHandleProps,
  isDragging = false,
  expanded = false,
  bullets = [],
  images = [],
  onEdit,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        borderRadius: '20px',
        bgcolor: '#F2F0FF',
        boxShadow: isDragging ? 4 : 0,
        transition: 'box-shadow 0.2s',
        p: 0,
        m: 0,
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: 56,
          bgcolor: '#F2F0FF',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
        }}
      >
        {/* Drag handle and number */}
        <Box
          {...dragHandleProps}
          sx={{
            color: '#8E2DE2',
            fontWeight: 700,
            fontSize: 20,
            minWidth: 48,
            textAlign: 'center',
            letterSpacing: 1,
            pl: 2,
            pr: 1,
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          {/* Icon on the left of title and count */}
          <Image src="/images/left-grid.svg" alt="Card Icon" width={12} height={12} style={{ marginRight: 1 }} />
          {index < 9 ? `0${index + 1}` : index + 1}
        </Box>
        {/* Title */}
        <Typography
          sx={{
            fontWeight: 500,
            color: '#18181B',
            fontSize: { xs: 14, sm: 16, md: 18 },
            flex: 1,
            textAlign: 'left',
            pl: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
          className="text-sm sm:text-base md:text-lg"
          noWrap
        >
          {title}
        </Typography>
        {/* Vertical divider before edit/delete icons */}
        {/* Delete icon */}
        <IconButton onClick={onDelete} size="small" sx={{ color: '#A095C6', pr: 2 }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      {/* Expanded Content */}
      {expanded && (
        <Box sx={{ bgcolor: '#fff', px: { xs: 2, sm: 3 }, pt: 2, pb: 1.5, borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
          {/* Bullets */}
          {bullets.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#757575', fontSize: 16, lineHeight: 1.7 }}>
                {bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </Box>
          )}
          {/* Horizontal divider after outline points */}
          {/* Images Row */}
          {images.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              {images.map((src, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: '#F2F0FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {/* Placeholder for image, use objectFit contain */}
                  <Image src={src} alt={`img-${i}`} width={44} height={44} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }} />
                </Box>
              ))}
            </Box>
          )}
          {/* Edit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
            <IconButton sx={{ color: '#8E2DE2', bgcolor: '#F2F0FF', borderRadius: 2 }} onClick={onEdit}>
              <EditIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default OutlineCard;
