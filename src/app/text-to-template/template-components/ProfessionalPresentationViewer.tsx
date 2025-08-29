"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Box, Stack, Typography, CircularProgress, Alert } from "@mui/material"
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
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "corporate" | "creative" | "bold">("modern")

  const STAGE_W = 960
  const STAGE_H = 540

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  // handle responsive scaling
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const newScale = containerWidth / STAGE_W
        setScale(newScale)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

  // Convert backend data to slides using selected template
  const convertedPresentation: Presentation = {
    id: presentation.id,
    meta: {
      audience: presentation.meta.audience,
      tone: presentation.meta.tone,
    },
    slides: presentation.slides.map((backendSlide, index) => {
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

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 500, mt: 7 }}>
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

            return (
              <Box key={slideKey}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#666" }}>
                  Slide {index + 1}
                  {slide.title && ` - ${slide.title}`}
                </Typography>

                {/* Responsive container */}
                <Box
                  ref={containerRef}
                  sx={{
                    border: "3px solid #e0e0e0",
                    borderRadius: 2,
                    width: "100%",
                    maxWidth: `${STAGE_W}px`,
                    mx: "auto",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    aspectRatio: `${STAGE_W} / ${STAGE_H}`,
                    //transform: `scale(${scale})`,
                  }}
                >
                  <Stage
                    width={STAGE_W}
                    height={STAGE_H}
                    scaleX={scale}
                    scaleY={scale}
                  
                  >
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
           Presentation templates • Professional and Creative: {error ? "Fallback Mode" : "Connected"}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ProfessionalPresentationViewer
