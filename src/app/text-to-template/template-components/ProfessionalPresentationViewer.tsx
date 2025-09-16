"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Box, Stack, Typography, CircularProgress, Alert, Divider } from "@mui/material";
import { Stage, Layer } from "react-konva";
import SlideRenderer from "./SlideRenderer";
import TemplateSelector from "./TemplateSelector";
import { usePresentation } from "../hooks/usePresentation";
import type { Presentation } from "../types/presentation";
import { convertPresentation } from "../../../utils/convertPresentation";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";

interface ProfessionalPresentationViewerProps {
  presentationId: string;
}

const ProfessionalPresentationViewer: React.FC<ProfessionalPresentationViewerProps> = ({ presentationId }) => {
  const { presentation, loading, error } = usePresentation(presentationId);
  const { selectedTemplate, setSelectedTemplate } = useTemplateSlides();

  const STAGE_W = 960;
  const STAGE_H = 540;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRefs = useRef<any[]>([]);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 600;
      if (isMobile) {
        const mobileWidth = window.innerWidth - 32;
        setScale(mobileWidth / STAGE_W);
      } else if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(containerWidth / STAGE_W);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Store stage references globally for PDF export
  useEffect(() => {
    if (stageRefs.current.length > 0) {
      if (typeof window !== 'undefined') {
        window.konvaStages = {};
        stageRefs.current.forEach((stage, index) => {
          if (stage) {
            window.konvaStages[index] = stage;
            window[`konva_stage_slide-${index}`] = stage;
            // Add data attributes to canvas
            const canvas = stage.getCanvas?._canvas;
            if (canvas) {
              canvas.setAttribute('data-slide-id', `slide-${index}`);
              canvas.setAttribute('data-slide-index', index.toString());
            }
          }
        });
        console.log('Stored stage references:', Object.keys(window.konvaStages));
      }
    }
  }, [stageRefs.current]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading presentation...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        <Typography variant="h6">API Connection Failed</Typography>
        <Typography>Using fallback mock data. Error: {error}</Typography>
      </Alert>
    );
  }

  if (!presentation) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        No presentation data available
      </Alert>
    );
  }

  const convertedPresentation: Presentation = convertPresentation(presentation as any, selectedTemplate);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Box sx={{ p: 2 }}>
        {/* Presentation Header */}
        <Box
          sx={{
            mb: 4,
            textAlign: "center",
            py: 2,
            px: 2,
            backgroundColor: "rgba(242, 240, 255, 1)",
            borderRadius: 1,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 500, mb: 1 }}>
            {presentation.topic || presentation.title || "AI in 2025"}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#666" }}>
            {presentation.meta?.audience && `Audience: ${presentation.meta.audience}`}
            {presentation.meta?.tone && ` • Tone: ${presentation.meta.tone}`}
          </Typography>
        </Box>

        {/* Template Selector */}
        <TemplateSelector selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} />

        {/* Slides */}
        <Stack spacing={5}>
          {convertedPresentation.slides.map((slide, index) => {
            const slideKey = slide.slide_id || `slide-${index}`;
            return (
              <Box key={slideKey}>
                <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#4A00E0" }}>
                    Slide {index + 1}
                  </Typography>
                  {slide.title && (
                    <Typography variant="subtitle1" sx={{ color: "#333" }}>
                      - {slide.title}
                    </Typography>
                  )}
                </Box>

                <Box
                  ref={index === 0 ? containerRef : undefined}
                  data-slide-id={slideKey}
                  data-slide-index={index}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    width: "100%",
                    maxWidth: `${STAGE_W}px`,
                    mx: "auto",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    aspectRatio: `${STAGE_W} / ${STAGE_H}`,
                    minWidth: 0,
                    transition: "all 0.2s ease",
                    visibility: 'visible',
                    opacity: 1,
                  }}
                  className={`slide-container slide-${index}`}
                >
                  <Stage
                    width={STAGE_W}
                    height={STAGE_H}
                    scaleX={scale}
                    scaleY={scale}
                    style={{ width: "100%", height: "100%", visibility: 'visible', opacity: 1 }}
                    ref={(ref) => {
                      stageRefs.current[index] = ref;
                    }}
                  >
                    <Layer>
                      <SlideRenderer slide={slide} slideIndex={index} />
                    </Layer>
                  </Stage>
                </Box>
              </Box>
            );
          })}
        </Stack>

        <Box sx={{ mt: 6, textAlign: "center", color: "#666" }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2">
            Presentation templates • Professional and Creative: {error ? "Fallback Mode" : "Connected"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfessionalPresentationViewer;