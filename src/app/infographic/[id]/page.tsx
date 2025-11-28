"use client";

import { useEffect, useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { Html } from "react-konva-utils";
import { useTemplateSlides } from "../../context/TemplateSlidesContext";
import StepsHeader from "@/app/components/headers-navbar/StepsHeader";
import StepIndicator from "@/app/components/shared/StepsIndicatorInfographics";
import Box from "@mui/material/Box";
import { Button, Chip, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useParams } from "next/navigation";
import { useMediaQuery, useTheme } from "@mui/material";
import html2canvas from "html2canvas";

export default function InfographicPage() {
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const { setInfographicId } = useTemplateSlides();

  const [infographicData, setInfographicData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fixed canvas dimensions — the gold standard for infographics
  const CANVAS_SIZES = {
    landscape: { width: 1280, height: 720 },
    portrait: { width: 800, height: 1200 },
  };

  // Get orientation from backend
  const viewMode = (infographicData?.infographic?.viewMode as "landscape" | "portrait") || "landscape";
  const isPortrait = viewMode === "portrait";

  const stageWidth = isPortrait ? CANVAS_SIZES.portrait.width : CANVAS_SIZES.landscape.width;
  const stageHeight = isPortrait ? CANVAS_SIZES.portrait.height : CANVAS_SIZES.landscape.height;

  // Clean and fix AI-generated HTML (critical for glassmorphism cards)
  const cleanAndFixHtml = (html: string): string => {
    return html
      .replace(/\\r\\n/g, "")
      .replace(/\\r/g, "")
      .replace(/\\n/g, "")
      .replace(/background:\s*;/g, "background: rgba(255,255,255,0.18);")
      .replace(/linear-gradient\(135deg,\s*25,\s*25\)/g, "linear-gradient(135deg, #ce93d8, #8e24aa)")
      .replace(/,\s*,\s*\)/g, ", transparent)")
      .replace(/25,/g, "#f3e5f5,") // fix empty colors
      .replace(/background:\s*rgba\(255,255,255,0\.\d+\)\s*;/g, "background: rgba(255,255,255,0.18);")
      .replace(/<style>[\s\S]*?<\/style>/gi, "") // remove conflicting styles
      .replace(/<head>[\s\S]*?<\/head>/gi, "") // strip head
      .replace(/<html.*?>|<\/html>|<body.*?>|<\/body>/gi, ""); // strip wrappers
  };

  // Fetch infographic
  useEffect(() => {
    if (!id || typeof id !== "string") {
      setError("Invalid infographic ID");
      setLoading(false);
      return;
    }

    const fetchInfographic = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/infographic/${id}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to load: ${res.status} - ${text}`);
        }
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setInfographicData(data);
        if (data.infographic?._id) {setInfographicId(data.infographic._id);}
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load infographic");
      } finally {
        setLoading(false);
      }
    };

    fetchInfographic();
  }, [id, API_BASE_URL, setInfographicId]);

  // Responsive scaling — perfect fit on all devices
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const padding = isMobile ? 32 : 80;
      const availableWidth = container.clientWidth - padding;
      const availableHeight = window.innerHeight - (isMobile ? 280 : 320); // space for header/footer

      const scaleX = availableWidth / stageWidth;
      const scaleY = availableHeight / stageHeight;

      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(Math.max(newScale, 0.32)); // minimum readable scale
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    window.addEventListener("orientationchange", () => setTimeout(updateScale, 300));

    return () => {
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("orientationchange", () => {});
    };
  }, [stageWidth, stageHeight, isMobile]);

  // Download as PNG/JPG — works perfectly
  const handleDownload = async (format: "png" | "jpg") => {
    if (!stageRef.current) return;

    try {
      const stage = stageRef.current.getStage();
      const canvas = await html2canvas(stage.container(), {
        scale: window.devicePixelRatio * 1.5,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `${infographicData.infographic.title || "infographic"}.${format}`;
      link.href = canvas.toDataURL(format === "png" ? "image/png" : "image/jpeg", 1.0);
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="text-xl text-gray-600">Loading your infographic...</div>
      </Box>
    );
  }

  if (error || !infographicData) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", gap: 3 }}>
        <div className="text-2xl font-bold text-red-600">Error</div>
        <div className="text-lg text-gray-700 text-center max-w-md">{error || "Infographic not found"}</div>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Box>
    );
  }

  const rawHtml = infographicData.infographic.html;
  const cleanedHtml = cleanAndFixHtml(rawHtml);

  const title = infographicData.infographic.title || "Untitled Infographic";
  const subtitle = infographicData.infographic.subtitle || "";
  const generatedAt = new Date(
    infographicData.meta?.generatedAt || infographicData.infographic.meta?.generatedAt || Date.now()
  ).toLocaleString();

  const displayWidth = stageWidth * scale;
  const displayHeight = stageHeight * scale;

  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      <StepsHeader />
      <Box sx={{ mt: { xs: 10, md: 4 } }}>
        <StepIndicator activeStep={1} />
      </Box>

      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 3, md: 5 },
          gap: 4,
        }}
      >
        {/* Title & Subtitle */}
        <Box sx={{ textAlign: "center", maxWidth: 1000 }}>
          <h1
            style={{
              fontSize: isSmallMobile ? "1.8rem" : isMobile ? "2.5rem" : "3.5rem",
              fontWeight: 900,
              color: "#111827",
              lineHeight: 1.2,
              marginBottom: "0.5rem",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: isSmallMobile ? "1rem" : "1.25rem",
                color: "#6B7280",
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </p>
          )}
        </Box>

        {/* Infographic Canvas */}
        <Box
          sx={{
            borderRadius: { xs: 3, md: 4 },
            overflow: "visible",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            background: "#fff",
            border: "1px solid #e5e7eb",
          }}
        >
          <Stage
            ref={stageRef}
            width={stageWidth}
            height={stageHeight}
            scaleX={scale}
            scaleY={scale}
            style={{ borderRadius: "16px", overflow: "hidden" }}
          >
            <Layer>
              <Html>
                <div
                  style={{
                    width: stageWidth + "px",
                    height: stageHeight + "px",
                    transform: "scale(1)",
                    transformOrigin: "top left",
                    overflow: "visible",
                  }}
                  dangerouslySetInnerHTML={{ __html: cleanedHtml }}
                />
              </Html>
            </Layer>
          </Stage>
        </Box>

        {/* Download Buttons */}
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload("png")}
            sx={{
              px: 5,
              py: 1.8,
              borderRadius: 4,
              fontSize: "1.1rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #8e24aa, #6a1b9a)",
              "&:hover": { background: "#6a1b9a" },
            }}
          >
            Download PNG
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload("jpg")}
            sx={{
              px: 5,
              py: 1.8,
              borderRadius: 4,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderColor: "#8e24aa",
              color: "#8e24aa",
            }}
          >
            Download JPG
          </Button>
        </Box>

        {/* Metadata Chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", mt: 2 }}>
          <Tooltip title={`Type: ${infographicData.infographic.type}`} arrow>
            <Chip
              icon={<InfoOutlinedIcon />}
              label={`Type: ${infographicData.infographic.type}`}
              sx={{ bgcolor: "rgba(142, 45, 226, 0.1)", fontWeight: 600 }}
            />
          </Tooltip>

          <Tooltip title="Generated by Slidexy AI" arrow>
            <Chip
              icon={<InfoOutlinedIcon />}
              label="Source: Slidexy AI"
              sx={{ bgcolor: "rgba(34, 197, 94, 0.1)", color: "green.700", fontWeight: 600 }}
            />
          </Tooltip>

          <Tooltip title="Generated on this date" arrow>
            <Chip
              icon={<InfoOutlinedIcon />}
              label={`Generated: ${generatedAt.split(",")[0]}`}
              sx={{ bgcolor: "rgba(59, 130, 246, 0.1)", color: "blue.700", fontWeight: 600 }}
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}