import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        textAlign: "center",
        px: 3,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "5rem", md: "8rem" },
          background: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          mb: 2,
        }}
      >
        404
      </Typography>
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: "#111827", mb: 1 }}
      >
        Page Not Found
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", mb: 4, maxWidth: 480 }}
      >
        The page you are looking for does not exist or has been moved. Head back
        to the homepage and keep creating amazing presentations.
      </Typography>
      <Link href="/" passHref>
        <Button
          variant="contained"
          sx={{
            borderRadius: "999px",
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
            background:
              "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(142, 45, 226, 0.6)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Back to Homepage
        </Button>
      </Link>
    </Box>
  );
}
