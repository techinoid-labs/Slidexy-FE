"use client";
import { useEffect, useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { Html } from "react-konva-utils";
import DOMPurify from "dompurify";
import { useTemplateSlides } from "../../context/TemplateSlidesContext";
import StepsHeader from "@/app/components/headers-navbar/StepsHeader";
import StepIndicator from "@/app/components/shared/StepsIndicatorInfographics";
import Box from "@mui/material/Box";
import { Button, Chip, Tooltip } from "@mui/material";
import html2canvas from "html2canvas";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams } from "next/navigation";
import { useMediaQuery, useTheme } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function InfographicPage() {
  const stageRef = useRef<any>(null);
  const infographicRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams();
  const { infographicId, setInfographicId } = useTemplateSlides();
  const [loading, setLoading] = useState(true);
  const [infographicData, setInfographicData] = useState<any>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Base dimensions for infographic
  const BASE_WIDTH = 1200;
  const BASE_HEIGHT_LANDSCAPE = 600;
  const BASE_HEIGHT_PORTRAIT = 600;

  const [scale, setScale] = useState(1);
  const [orientation, setOrientation] = useState<"landscape" | "portrait">(
    "landscape"
  );
  const [stageWidth, setStageWidth] = useState(BASE_WIDTH);
  const [stageHeight, setStageHeight] = useState(BASE_HEIGHT_LANDSCAPE);

  // Detect orientation
  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setOrientation(isLandscape ? "landscape" : "portrait");
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // Update stage dimensions based on orientation
  useEffect(() => {
    if (orientation === "landscape") {
      setStageWidth(BASE_WIDTH);
      setStageHeight(BASE_HEIGHT_LANDSCAPE);
    } else {
      setStageWidth(BASE_WIDTH);
      setStageHeight(BASE_HEIGHT_PORTRAIT);
    }
  }, [orientation]);

  // Handle responsive scaling
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 600;
      if (isMobileView) {
        const mobileWidth = window.innerWidth - 32;
        setScale(mobileWidth / stageWidth);
      } else if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const calculatedScale = Math.min(containerWidth / stageWidth, 1);
        setScale(calculatedScale);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [stageWidth]);

  // Fetch infographic data
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        // console.log("Fetching infographic with ID:", id);
        const res = await fetch(`${API_BASE_URL}/api/infographic/${id}`);
        const data = await res.json();
        setInfographicData(data);
        if (data.success) {
          setInfographicId(data.infographic._id);
        }
      } catch (err) {
        console.error("Error fetching infographic:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const captureStageWithHtml = async (
    stageRef: { current: { toCanvas: () => HTMLCanvasElement } } | null,
    infographicRef: HTMLDivElement | null
  ): Promise<HTMLCanvasElement | null> => {
    if (!stageRef?.current || !infographicRef) return null;

    const stageCanvas = stageRef.current.toCanvas();
    const canvasWidth = stageCanvas.width;
    const canvasHeight = stageCanvas.height;

    const htmlOverlay = infographicRef.querySelector(
      "div[aria-label^='Infographic']"
    );
    if (!htmlOverlay || !(htmlOverlay instanceof HTMLElement)) {
      return stageCanvas;
    }

    const overlayRect = htmlOverlay.getBoundingClientRect();
    const parentRect = infographicRef.getBoundingClientRect();
    const offsetX = overlayRect.left - parentRect.left;
    const offsetY = overlayRect.top - parentRect.top;

    const htmlCanvas = await html2canvas(htmlOverlay, {
      backgroundColor: null,
      scale: window.devicePixelRatio || 2,
      useCORS: true,
      width: canvasWidth,
      height: canvasHeight,
      x: offsetX,
      y: offsetY,
    });

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = canvasWidth;
    finalCanvas.height = canvasHeight;

    const ctx = finalCanvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(stageCanvas, 0, 0);
    ctx.drawImage(htmlCanvas, 0, 0, canvasWidth, canvasHeight);

    return finalCanvas;
  };

  const handleDownload = async (format: "png" | "jpg") => {
    if (!infographicRef.current || !stageRef.current) return;

    try {
      const canvas = await captureStageWithHtml(
        stageRef,
        infographicRef.current
      );
      if (!canvas) return;

      const link = document.createElement("a");
      link.download = `${infographicData.infographic.title}.${format}`;
      link.href =
        format === "png"
          ? canvas.toDataURL("image/png")
          : canvas.toDataURL("image/jpeg", 1);
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <div className="text-gray-600 text-lg">Loading infographic...</div>
        </Box>
      </Box>
    );
  }

  if (!id || !infographicData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div className="text-red-500 text-lg">Failed to load infographic.</div>
      </Box>
    );
  }

  const sanitizedHtml = DOMPurify.sanitize(infographicData.infographic.html);

  // Calculate actual display dimensions
  const displayWidth = stageWidth * scale;
  const displayHeight = stageHeight * scale;

  // Format generated date
  const formattedGeneratedDate = (() => {
    const date = new Date(infographicData.meta?.generatedAt);
    return isNaN(date.getTime())
      ? new Date().toLocaleString()
      : date.toLocaleString();
  })();

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <StepsHeader />

      <Box sx={{ mt: { xs: 10, md: 4 } }}>
        <StepIndicator activeStep={1} />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "white",
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          py: { xs: 4, md: 8 },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{ textAlign: "center", mb: { xs: 4, md: 8 }, maxWidth: "900px" }}
        >
          <h1
            style={{
              fontSize: isMobile ? "2rem" : "3rem",
              fontWeight: 800,
              color: "#111827",
              marginBottom: "0.75rem",
            }}
          >
            {infographicData.infographic.title}
          </h1>
          <p
            style={{
              fontSize: isMobile ? "1rem" : "1.125rem",
              color: "#6B7280",
              fontStyle: "italic",
            }}
          >
            {infographicData.infographic.subtitle}
          </p>
        </Box>

        {/* Infographic Container */}
        <Box
          ref={containerRef}
          sx={{
            width: "100%",
            maxWidth: `${stageWidth}px`,
            mx: "auto",
            mb: 4,
          }}
        >
          <Box
            ref={infographicRef}
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 2,
              backgroundColor: "#ffffff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              overflow: "hidden",
              width: `${displayWidth}px`,
              height: `${displayHeight}px`,
              minWidth: 0,
              transition: "all 0.3s ease",
              mx: "auto",
            }}
          >
            <Stage
              ref={stageRef}
              width={stageWidth}
              height={stageHeight}
              scaleX={scale}
              scaleY={scale}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
              }}
            >
              <Layer>
                <Html
                  divProps={{
                    style: {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: `${stageWidth}px`,
                      height: `${stageHeight}px`,
                      overflow: "hidden",
                      pointerEvents: "none",
                    },
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                    aria-label={`Infographic: ${infographicData.infographic.title}`}
                    style={{
                      width: `${stageWidth}px`,
                      height: `${stageHeight}px`,
                      transformOrigin: "top left",
                      pointerEvents: "auto",
                    }}
                  />
                </Html>
              </Layer>
            </Stage>
          </Box>
        </Box>

        {/* Download Buttons */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload("png")}
            sx={{
              px: { xs: 2, md: 3 },
              py: 1.5,
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          >
            Download PNG
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload("jpg")}
            sx={{
              px: { xs: 2, md: 3 },
              py: 1.5,
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          >
            Download JPG
          </Button>
        </Box>

        {/* Enhanced Metadata Section */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: 1.5, md: 2.5 },
            mt: { xs: 4, md: 6 },
            mb: { xs: 6, md: 10 },
            alignItems: "center",
          }}
        >
          <Tooltip
            title={`Infographic Type: ${infographicData.infographic.type}`}
            arrow
            placement="top"
          >
            <Chip
              icon={<InfoOutlinedIcon fontSize="small" />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                    Type
                  </span>
                  <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    {infographicData.infographic.type}
                  </span>
                </Box>
              }
              sx={{
                backgroundColor: "rgba(142, 45, 226, 0.08)",
                border: "1px solid rgba(142, 45, 226, 0.2)",
                color: "rgba(142, 45, 226, 1)",
                fontWeight: 600,
                height: "auto",
                py: 0.75,
                px: { xs: 1.5, md: 2 },
                "& .MuiChip-icon": {
                  color: "rgba(142, 45, 226, 0.6)",
                },
                "&:hover": {
                  backgroundColor: "rgba(142, 45, 226, 0.12)",
                  boxShadow: "0 2px 8px rgba(142, 45, 226, 0.15)",
                },
              }}
            />
          </Tooltip>

          <Tooltip title="Source: Slidexy Generated" arrow placement="top">
            <Chip
              icon={<InfoOutlinedIcon fontSize="small" />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                    Source
                  </span>
                  <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Slidexy Generated
                  </span>
                </Box>
              }
              sx={{
                backgroundColor: "rgba(142, 45, 226, 0.08)",
                border: "1px solid rgba(142, 45, 226, 0.2)",
                color: "rgba(142, 45, 226, 1)",
                fontWeight: 600,
                height: "auto",
                py: 0.75,
                px: { xs: 1.5, md: 2 },
                "& .MuiChip-icon": {
                  color: "rgba(142, 45, 226, 0.6)",
                },
                "&:hover": {
                  backgroundColor: "rgba(142, 45, 226, 0.12)",
                  boxShadow: "0 2px 8px rgba(142, 45, 226, 0.15)",
                },
              }}
            />
          </Tooltip>

          <Tooltip
            title={`Generated: ${formattedGeneratedDate}`}
            arrow
            placement="top"
          >
            <Chip
              icon={<InfoOutlinedIcon fontSize="small" />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                    Generated
                  </span>
                  <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    {formattedGeneratedDate}
                  </span>
                </Box>
              }
              sx={{
                backgroundColor: "rgba(142, 45, 226, 0.08)",
                border: "1px solid rgba(142, 45, 226, 0.2)",
                color: "rgba(142, 45, 226, 1)",
                fontWeight: 600,
                height: "auto",
                py: 0.75,
                px: { xs: 1.5, md: 2 },
                "& .MuiChip-icon": {
                  color: "rgba(142, 45, 226, 0.6)",
                },
                "&:hover": {
                  backgroundColor: "rgba(142, 45, 226, 0.12)",
                  boxShadow: "0 2px 8px rgba(142, 45, 226, 0.15)",
                },
              }}
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
