"use client";

import { Box, Typography, Container, Grid, Card, CardContent } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";

interface Persona {
  title: string;
  description: string;
  icon?: "group" | "business" | "school" | "person";
}

interface WhoItsForProps {
  personas: Persona[];
}

export default function WhoItsFor({ personas }: WhoItsForProps) {
  const getIcon = (type?: string) => {
    switch (type) {
      case "group": return <GroupsIcon sx={{ fontSize: 40, color: "#7C3AED" }} />;
      case "business": return <BusinessIcon sx={{ fontSize: 40, color: "#7C3AED" }} />;
      case "school": return <SchoolIcon sx={{ fontSize: 40, color: "#7C3AED" }} />;
      default: return <PersonIcon sx={{ fontSize: 40, color: "#7C3AED" }} />;
    }
  };

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            mb: 6,
            color: "#111827",
          }}
        >
          Who is this tool for?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {personas.map((persona, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #F3F4F6",
                  borderRadius: "16px",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>{getIcon(persona.icon)}</Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1.5, color: "#111827" }}
                  >
                    {persona.title}
                  </Typography>
                  <Typography
                    sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: "0.95rem" }}
                  >
                    {persona.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
