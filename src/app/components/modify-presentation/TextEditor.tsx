import React from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

interface TextEditorProps {
  sidebarHeight?: string | number;
  onClose?: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  sidebarHeight = "100vh",
  onClose,
}) => (
  <Box
    sx={{
      width: 320,
      bgcolor: "#fff",
      height: sidebarHeight,
      position: "absolute",
      left: 80,
      top: 0,
      borderRight: "1px solid #E0E0E0",
      zIndex: 10,
      boxShadow: 2,
      display: "flex",
      flexDirection: "column",
      p: 0,
    }}
  >
    {/* Header */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 3,
        pb: 2,
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Text</Typography>

      <IconButton size="small" onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Box>
    {/* Add Text Box Button */}
    <Box sx={{ px: 3, mb: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{
          borderRadius: 8,
          height: 44,
          fontWeight: 600,
          fontSize: 17,
          bgcolor: "#F8F8FA",
          borderColor: "#E0E0E0",
          color: "#222",
          mb: 1,
          "&:hover": {
            bgcolor: "#F3EDFF",
            borderColor: "#7B4AE2",
            color: "#7B4AE2",
          },
        }}
      >
        Add Text Box
      </Button>
    </Box>
  </Box>
);

export default TextEditor;
