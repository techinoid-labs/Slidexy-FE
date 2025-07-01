import { Box, Button, Paper, Typography } from "@mui/material";

const OutlineCards = () => {
  // Mock data for cards
  const cards = [
    "Personal Portfolio: [Your Name/Professional Title]",
    "About Me: Driving Impact Through [Key Skill 1] & [Key Skill 2]",
    "Project Spotlight: [Project Title 1] - [Outcome]",
    "Impact & Recognition: Testimonials and Awards",
    "Core Skills & Expertise: Delivering Excellence",
    "Impact & Recognition: Testimonials and Awards",
    "Let’s Connect: Your Future Collaboration Partner",
  ];

  return (
    <Box>
      {cards.map((card, index) => (
        <Paper
          key={index}
          elevation={1}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            backgroundColor: "#F9F9FB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontWeight: 500 }}>
            {String(index + 1).padStart(2, "0")} {card}
          </Typography>
        </Paper>
      ))}

      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(to right, #6B28D1, #B620E0)",
            px: 6,
            py: 1.5,
            fontSize: "1.1rem",
            borderRadius: 3,
            boxShadow: "0px 4px 20px rgba(139, 45, 226, 0.3)",
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default OutlineCards;
