"use client"

import type React from "react"
import { useState } from "react"
import { Box, Stack, Typography, CircularProgress, Alert, Chip, AppBar, Toolbar } from "@mui/material"
import { Stage, Layer } from "react-konva"
import SlideRenderer from "./SlideRenderer"
import TemplateSelector from "./TemplateSelector"
import { usePresentation } from "../hooks/usePresentation"
import { createModernTemplate } from "../templates/modernTemplate"
import { createCorporateTemplate } from "../templates/corporateTemplate"
import { createCreativeTemplate } from "../templates/creativeTemplate"
import { createBoldTemplate } from "../templates/boldTemplate"
import type { Presentation } from "../types/presentation"

interface ProfessionalPresentationViewerProps {
  presentationId: string
}

const ProfessionalPresentationViewer: React.FC<ProfessionalPresentationViewerProps> = ({ presentationId }) => {
  const { presentation, loading, error } = usePresentation(presentationId)
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "corporate" | "creative">("modern")

  const STAGE_W = 960
  const STAGE_H = 540

  console.log(" Presentation data received:", presentation)
  console.log(" Loading state:", loading)
  console.log(" Error state:", error)

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading presentation...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        <Typography variant="h6">API Connection Failed</Typography>
        <Typography>Using fallback mock data. Error: {error}</Typography>
      </Alert>
    )
  }

  if (!presentation) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        No presentation data available
      </Alert>
    )
  }

  console.log("Converting slides with template:", selectedTemplate)
  console.log("Number of slides to convert:", presentation.slides.length)

  // Convert backend data to slides using selected template
  const convertedPresentation: Presentation = {
      id: presentation.id,  
      meta : {
        audience : presentation.meta.audience,
        tone : presentation.meta.tone,
      },            
    slides: presentation.slides.map((backendSlide, index) => {
      console.log(` Converting slide ${index + 1}:`, backendSlide.slide_title || backendSlide.slide_id)

      switch (selectedTemplate) {
        case "modern":
          return createModernTemplate(backendSlide, index)
        case "corporate":
         return createCorporateTemplate(backendSlide, index)
        case "creative":
          return createCreativeTemplate(backendSlide, index)
        case "bold":
          return createBoldTemplate(backendSlide, index)
        default:
          return createModernTemplate(backendSlide, index)
      }
    }),
  }


  console.log(" Converted presentation:", convertedPresentation)

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* <AppBar
        position="static"
        sx={{
          background: "linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #7c3aed 100%)",
          mb: 3,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Professional Presentation Viewer
          </Typography>
          <Chip
            label={`${presentation.slides.length} slides`}
            color="secondary"
            variant="outlined"
            sx={{ color: "white", borderColor: "white" }}
          />
        </Toolbar>
      </AppBar> */}

      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {presentation.topic || presentation.title || "AI in 2025"}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#666", mb: 2 }}>
            {presentation.meta?.audience && `Audience: ${presentation.meta.audience}`}
            {presentation.meta?.tone && ` • Tone: ${presentation.meta.tone}`}
          </Typography>
        </Box>

        {/* Template Selector */}
        <TemplateSelector selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} />

        {/* Slides */}
        <Stack spacing={4}>
          {convertedPresentation.slides.map((slide, index) => {
            const slideKey = slide.slide_id || `slide-${index}`
            console.log(`Rendering slide ${index + 1} with key:`, slideKey)

            return (
              <Box key={slideKey}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#666" }}>
                  Slide {index + 1}
                  {slide.title && ` - ${slide.title}`}
                </Typography>
                <Box
                  sx={{
                    border: "3px solid #e0e0e0",
                    borderRadius: 2,
                    width: STAGE_W,
                    height: STAGE_H,
                    backgroundColor: "#ffffff",
                    mx: "auto",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                  }}
                >
                  <Stage width={STAGE_W} height={STAGE_H}>
                    <Layer>
                      <SlideRenderer slide={slide} />
                    </Layer>
                  </Stage>
                </Box>
              </Box>
            )
          })}
        </Stack>

        {/* Footer Info */}
        <Box sx={{ mt: 4, textAlign: "center", color: "#666" }}>
          <Typography variant="body2">
            Professional presentation templates • API Integration: {error ? "Fallback Mode" : "Connected"}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ProfessionalPresentationViewer
