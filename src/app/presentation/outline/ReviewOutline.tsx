import { Box, Container, Grid } from "@mui/material";
import OutlineHeader from "./OutlineHeader"; // left header section
import OutlineCards from "./OutlineCards"; // cards + continue
import OutlineSettings from "./OutlineSettings"; // right side settings

const ReviewOutline = () => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        background: `radial-gradient(700px 220px at 50% 54%, #8E2DE210 0%, #FBF9FF 70%, #fff 100%)`,
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Side */}
          <Grid item xs={12} md={8}>
            <OutlineHeader />
            <OutlineCards />
          </Grid>

          {/* Right Side */}
          <Grid item xs={12} md={4}>
            <OutlineSettings />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ReviewOutline;
