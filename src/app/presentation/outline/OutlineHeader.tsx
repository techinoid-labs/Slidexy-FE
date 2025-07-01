import { Box, Typography } from "@mui/material";

const OutlineHeader = () => {
  return (
    <Box sx={{ textAlign: "left", mb: 4 }}>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "2.5rem", md: "3.5rem" },
          fontWeight: 600,
          mb: 2,
          color: "#000000",
        }}
      >
        Review the Outline
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          maxWidth: 600,
          lineHeight: 1.6,
          fontSize: { xs: "1.1rem", md: "1.25rem" },
        }}
      >
        Enhance and tailor your slide content to deliver a powerful, persuasive
        presentation.
      </Typography>
    </Box>
  );
};

export default OutlineHeader;
