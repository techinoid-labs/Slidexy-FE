"use client";
import React, { useRef, useState, forwardRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  ButtonBase,
  InputBase,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { motion } from "framer-motion";
import { useSlides } from "@/app/context/SlidesContext";
import {
  PANEL,
  panelContainerSx,
  panelHeaderSx,
  panelTitleSx,
  panelCloseButtonSx,
  panelSearchBarSx,
} from "./modify-presentation/panelTheme";

interface MediaPanelProps {
  sidebarHeight?: string | number;
  onClose?: () => void;
}

const MAX_IMAGES = 8;
const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/gif",
];
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type MediaTab = "upload" | "ai" | "library";

const tabButtonSx = (active: boolean) => ({
  flex: 1,
  cursor: "pointer",
  border: "none",
  bgcolor: active ? PANEL.accentBg : "transparent",
  color: active ? PANEL.accentSoft : PANEL.textMuted,
  fontWeight: active ? 600 : 500,
  borderRadius: 2,
  textAlign: "center" as const,
  py: 1,
  fontSize: 12.5,
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0.5,
  transition: "background-color 0.15s ease, color 0.15s ease",
});

const Media = forwardRef<HTMLDivElement, MediaPanelProps>(
  ({ sidebarHeight = "100vh", onClose }, ref) => {
    const [tab, setTab] = useState<MediaTab>("upload");

    const [images, setImages] = useState<string[]>(() => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("media_library");
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    });

    const updateImages = (newImages: string[]) => {
      setImages(newImages);
      localStorage.setItem("media_library", JSON.stringify(newImages));
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addImage } = useSlides();

    // AI suggestions state
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [aiResults, setAiResults] = useState<string[]>([]);

    const insertImageIntoRedux = (base64: string, width = 400, height = 400) => {
      addImage({
        imageSrc: base64,
        width,
        height,
      });
      onClose?.();
    };

    const handleFile = (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Unsupported file type.");
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;

        const MAX_DIMENSION = 400;
        const scale = Math.min(
          MAX_DIMENSION / originalWidth,
          MAX_DIMENSION / originalHeight,
          1
        );

        const scaledWidth = originalWidth * scale;
        const scaledHeight = originalHeight * scale;

        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === "string") {
            const base64 = e.target.result;
            const newImages = [base64, ...images].slice(0, MAX_IMAGES);
            updateImages(newImages);
            setError(null);

            insertImageIntoRedux(base64, scaledWidth, scaledHeight);
            onClose?.();
          }
        };
        reader.readAsDataURL(file);
      };

      img.onerror = () => setError("Invalid image file.");
      img.src = URL.createObjectURL(file);
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    };

    const handleGenerateAI = async () => {
      if (!aiPrompt.trim()) {
        setAiError("Describe the image you want.");
        return;
      }
      setAiLoading(true);
      setAiError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/generate-image-suggestions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: aiPrompt, count: 4 }),
        });
        if (!res.ok) throw new Error("Failed to generate images");
        const data = await res.json();
        setAiResults(data.imageUrls || []);
        if (!data.imageUrls?.length) setAiError("No images returned. Try a different prompt.");
      } catch (e: any) {
        setAiError(e.message || "Something went wrong");
        setAiResults([]);
      } finally {
        setAiLoading(false);
      }
    };

    const handleAIKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleGenerateAI();
    };

    return (
      <Box
        ref={ref}
        component={motion.div}
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -24, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        sx={panelContainerSx(300, sidebarHeight)}
      >
        {/* Header */}
        <Box sx={panelHeaderSx}>
          <Typography sx={panelTitleSx}>Images</Typography>
          <IconButton size="small" onClick={onClose} sx={panelCloseButtonSx}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Tab bar */}
        <Box sx={{ display: "flex", px: 2.25, pt: 2, gap: 0.5 }}>
          <Box component="button" type="button" onClick={() => setTab("upload")} sx={tabButtonSx(tab === "upload")}>
            Upload
          </Box>
          <Box component="button" type="button" onClick={() => setTab("ai")} sx={tabButtonSx(tab === "ai")}>
            <AutoAwesomeIcon sx={{ fontSize: 13 }} /> AI
          </Box>
          <Box component="button" type="button" onClick={() => setTab("library")} sx={tabButtonSx(tab === "library")}>
            Library
          </Box>
        </Box>

        {/* UPLOAD TAB */}
        {tab === "upload" && (
          <Box sx={{ px: 3, pt: 2.25 }}>
            <ButtonBase
              component="div"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
              onDrop={handleDrop}
              sx={{
                width: "100%",
                height: 220,
                border: dragActive ? `2px solid ${PANEL.accent}` : `2px dashed ${PANEL.border}`,
                borderRadius: 4,
                bgcolor: dragActive ? PANEL.accentBg : PANEL.surfaceSunken,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                mb: 0.5,
                transition: "border 0.2s ease, background-color 0.2s ease, transform 0.15s ease",
                position: "relative",
                "&:hover": { borderColor: PANEL.accent, transform: "scale(1.01)" },
              }}
            >
              <Box sx={{ bgcolor: PANEL.accentBg, borderRadius: "50%", p: 1.2, mb: 1 }}>
                <CloudUploadIcon sx={{ fontSize: 32, color: PANEL.accentSoft }} />
              </Box>
              <Typography sx={{ color: PANEL.accentSoft, fontWeight: 500, fontSize: 14, mb: 0.5, textDecoration: "underline" }}>
                Click to upload
              </Typography>
              <Typography sx={{ color: PANEL.textFaint, fontSize: 12.5, textAlign: "center" }}>
                or drag and drop
                <br />
                SVG, PNG, JPG or GIF (max. 800x400px)
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/gif"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
            </ButtonBase>
            {error && (
              <Typography sx={{ color: PANEL.danger, fontSize: 12.5, mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </Box>
        )}

        {/* AI TAB */}
        {tab === "ai" && (
          <Box sx={{ px: 3, pt: 2.25, flex: 1, overflowY: "auto" }}>
            <Box sx={panelSearchBarSx}>
              <InputBase
                placeholder="Describe an image to generate..."
                sx={{ flex: 1, fontSize: 14, color: PANEL.text, "& input::placeholder": { color: PANEL.textFaint, opacity: 1 } }}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={handleAIKeyDown}
                disabled={aiLoading}
              />
              <Tooltip title="Generate">
                <IconButton size="small" onClick={handleGenerateAI} disabled={aiLoading}>
                  {aiLoading ? <CircularProgress size={16} sx={{ color: PANEL.accentSoft }} /> : <AutoAwesomeIcon sx={{ color: PANEL.accentSoft, fontSize: 18 }} />}
                </IconButton>
              </Tooltip>
            </Box>
            {aiError && (
              <Typography sx={{ color: PANEL.danger, fontSize: 12.5, mt: 1 }}>{aiError}</Typography>
            )}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mt: 2 }}>
              {aiResults.map((url, idx) => (
                <Box
                  key={idx}
                  component={motion.div}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => insertImageIntoRedux(url, 400, 400)}
                  sx={{
                    width: "100%",
                    aspectRatio: "1.1/1",
                    borderRadius: 2.5,
                    border: `1px solid ${PANEL.border}`,
                    overflow: "hidden",
                    cursor: "pointer",
                    bgcolor: PANEL.surfaceSunken,
                    "&:hover": { borderColor: PANEL.accentBorder },
                  }}
                >
                  <img src={url} alt={`ai-suggestion-${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              ))}
            </Box>
            {!aiLoading && aiResults.length === 0 && !aiError && (
              <Typography sx={{ color: PANEL.textFaint, textAlign: "center", mt: 4, fontSize: 13 }}>
                Describe a slide image and generate a few options to drop in.
              </Typography>
            )}
          </Box>
        )}

        {/* LIBRARY TAB */}
        {tab === "library" && (
          <Box sx={{ px: 3, pt: 2.25, pb: 2, flex: 1, overflowY: "auto" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
              {Array.from({ length: MAX_IMAGES }).map((_, idx) => (
                <Box
                  key={idx}
                  component={images[idx] ? motion.div : "div"}
                  whileHover={images[idx] ? { scale: 1.04, y: -2 } : undefined}
                  whileTap={images[idx] ? { scale: 0.97 } : undefined}
                  sx={{
                    width: "100%",
                    aspectRatio: "1.1/1",
                    bgcolor: PANEL.surfaceSunken,
                    borderRadius: 2.5,
                    border: `1px solid ${PANEL.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    ...(images[idx] && {
                      "&:hover": { borderColor: PANEL.accentBorder },
                    }),
                  }}
                >
                  {images[idx] ? (
                    <img
                      src={images[idx]}
                      alt={`library-img-${idx}`}
                      onClick={() => {
                        insertImageIntoRedux(images[idx], 400, 400);
                        onClose?.();
                      }}
                      style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                    />
                  ) : null}
                </Box>
              ))}
            </Box>
            {images.length === 0 && (
              <Typography sx={{ color: PANEL.textFaint, textAlign: "center", mt: 4, fontSize: 13 }}>
                Images you upload will be saved here for reuse.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  }
);

export default Media;
