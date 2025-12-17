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
  const htmlRef = useRef<HTMLDivElement>(null);
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

  // Fixed original sizes — your infographic's true resolution
  const CANVAS_SIZES = {
    landscape: { width: 1280, height: 720 },
    portrait: { width: 800, height: 1200 },
  };

  const viewMode = (infographicData?.infographic?.viewMode as "landscape" | "portrait") || "landscape";
  const isPortrait = viewMode === "portrait";

  const originalWidth = isPortrait ? CANVAS_SIZES.portrait.width : CANVAS_SIZES.landscape.width;
  const originalHeight = isPortrait ? CANVAS_SIZES.portrait.height : CANVAS_SIZES.landscape.height;

  const [dynamicHeight, setDynamicHeight] = useState(originalHeight);
  const stageWidth = isPortrait ? CANVAS_SIZES.portrait.width : CANVAS_SIZES.landscape.width; const stageHeight = isPortrait ? CANVAS_SIZES.portrait.height : CANVAS_SIZES.landscape.height;

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
        if (!res.ok) throw new Error(`Failed to load infographic`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setInfographicData(data);
        if (data.infographic?._id) setInfographicId(data.infographic._id);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load infographic");
      } finally {
        setLoading(false);
      }
    };

    fetchInfographic();
  }, [id, API_BASE_URL, setInfographicId]);

  const cleanAndFixHtml = (html: string): string => {
    return html
      .replace(/\\r\\n|\\r|\\n/g, "")
      .replace(/background:\s*;/g, "background: rgba(255,255,255,0.18);")
      .replace(/linear-gradient\(135deg,\s*25,\s*25\)/g, "linear-gradient(135deg, #ce93d8, #8e24aa)")
      .replace(/,\s*,\s*\)/g, ", transparent)")
      .replace(/25,/g, "#f3e5f5,")
      .replace(/background:\s*rgba\(255,255,255,0\.\d+\)\s*;/g, "background: rgba(255,255,255,0.18);")
      .replace(/<style>[\s\S]*?<\/style>/gi, "")
      .replace(/<head>[\s\S]*?<\/head>/gi, "")
      .replace(/<html.*?>|<\/html>|<body.*?>|<\/body>/gi, "");
  };

  const rawHtml = infographicData?.infographic?.html || "";
  const cleanedHtml = cleanAndFixHtml(rawHtml);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;

      const horizontalPadding = isMobile ? 24 : 64;
      const availableWidth = containerWidth - horizontalPadding;

      const newScale = availableWidth / originalWidth;

      setScale(Math.min(newScale, 1));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [originalWidth, isMobile]);



  useEffect(() => {
    if (!htmlRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const realHeight = entry.target.scrollHeight;

      if (realHeight && realHeight !== dynamicHeight) {
        setDynamicHeight(realHeight);
      }
    });

    observer.observe(htmlRef.current);
    return () => observer.disconnect();
  }, [cleanedHtml]);

  // Download as PNG/JPG
  const handleDownload = async (format: "png" | "jpg") => {
    if (!stageRef.current) return;

    try {
      const stage = stageRef.current.getStage();
      const canvas = await html2canvas(stage.container(), {
        scale: window.devicePixelRatio * 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `${infographicData.infographic.title || "infographic"}.${format}`;
      link.href = canvas.toDataURL(format === "png" ? "image/png" : "image/jpeg", 1.0);
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Try again.");
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

  const title = infographicData.infographic.title || "Untitled Infographic";
  const subtitle = infographicData.infographic.subtitle || "";
  const generatedAt = new Date(
    infographicData.meta?.generatedAt || infographicData.infographic.meta?.generatedAt || Date.now()
  ).toLocaleDateString();

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", overflowX: "hidden" }}>
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
          py: { xs: 2, md: 4 },
          gap: 4,
        }}
      >
        {/* Title */}
        <Box sx={{ textAlign: "center", maxWidth: 1000 }}>
          <h1
            style={{
              fontSize: isSmallMobile ? "2rem" : isMobile ? "2.8rem" : "3.8rem",
              fontWeight: 900,
              color: "#111827",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: "1.3rem", color: "#6B7280", marginTop: "0.8rem", fontStyle: "italic" }}>
              {subtitle}
            </p>
          )}
        </Box>

        {/* Buttons + Chips */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 3,
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
            maxWidth: 900,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              borderRadius: 4,
              p: 2.5,
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload("png")}
              sx={{
                px: 5,
                py: 1.8,
                borderRadius: 3,
                fontSize: "1.1rem",
                fontWeight: 700,
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
                borderRadius: 3,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderColor: "#8e24aa",
                color: "#8e24aa",
              }}
            >
              Download JPG
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
            <Chip icon={<InfoOutlinedIcon />} label={`Type: ${infographicData.infographic.type}`} sx={{ fontWeight: 600 }} />
            <Chip icon={<InfoOutlinedIcon />} label="Source: Slidexy AI" color="success" sx={{ fontWeight: 600 }} />
            <Chip icon={<InfoOutlinedIcon />} label={`Generated: ${generatedAt}`} color="primary" sx={{ fontWeight: 600 }} />
          </Box>
        </Box>

        {/* Responsive Infographic Canvas */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            overflow: "visible",
          }}
        >
          <Box
            sx={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              width: originalWidth,
            }}
          >
            <Stage
              ref={stageRef}
              width={originalWidth}
              height={dynamicHeight}
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
                background: "#fff",
              }}
            >
              <Layer>
                <Html>
                  <div
                    ref={htmlRef}
                    style={{
                      width: originalWidth,
                      minHeight: originalHeight,
                      height: "auto",
                    }}
                    dangerouslySetInnerHTML={{ __html: cleanedHtml }}
                  />
                </Html>
              </Layer>
            </Stage>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}