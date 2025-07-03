import React from "react";
import { Box } from "@mui/material";

const TemplatesPage: React.FC = () => {
  return (
    <Box sx={{ p: 4, bgcolor: '#F8F8FF', minHeight: '100vh' }}>
      <Box sx={{ fontWeight: 600, fontSize: 24, mb: 2 }}>Templates</Box>
      {/* Add your template panel content here */}
      <Box sx={{ color: '#888' }}>Panel content goes here...</Box>
    </Box>
  );
};

export default TemplatesPage;
