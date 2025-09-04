"use client"

import type React from "react"
import { Box, Typography, Card, CardContent, Grid } from "@mui/material"

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateChange: (template: "modern" | "corporate" | "creative" | "bold") => void
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onTemplateChange }) => {
  const templates = [
    {
      id: "modern" as const,
      name: "Modern",
      description: "Clean, gradient-based design with contemporary styling",
    },
    {
      id: "corporate" as const,
      name: "Corporate",
      description: "Professional business template with structured layout",
    },
    {
      id: "creative" as const,
      name: "Creative",
      description: "Vibrant, artistic design with dynamic elements",
    },
    {
      id: "bold" as const,
      name: "Bold",
      description: "Strong colors and striking layouts for maximum impact",
    },
  ]

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Choose Template Style
      </Typography>
      <Grid container spacing={2}>
        {templates.map((template) => (
          <Card
            key={template.id}
            sx={{
              cursor: "pointer",
              border: selectedTemplate === template.id ? "2px solid rgba(74, 0, 224, 1)" : "2px solid transparent",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
            }}
            onClick={() => onTemplateChange(template.id)}
          >
            <CardContent>
              <Box
                sx={{
                  width: "100%",
                  height: 10,
                  objectFit: "cover",
                  borderRadius: 1,
                  mb: 2,
                  background:"rgba(242, 240, 255, 1)"

                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {template.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {template.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Box>
  )
}

export default TemplateSelector
