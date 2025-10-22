"use client";
import { useEffect, useState, useRef, useCallback } from "react";
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
  const tempDivRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedRef = useRef(false); // Prevent duplicate fetches in Strict Mode
  const { id } = useParams();
  const { infographicId, setInfographicId } = useTemplateSlides();
  const [loading, setLoading] = useState(true);
  const [dimensionsReady, setDimensionsReady] = useState(false);
  const [infographicData, setInfographicData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [stageWidth, setStageWidth] = useState(0);
  const [stageHeight, setStageHeight] = useState(0);
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ObjectId validation regex (24 hex chars)
  const isValidObjectId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

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

  // Set orientation from fetched data
  useEffect(() => {
    if (infographicData?.infographic?.viewMode) {
      setOrientation(infographicData.infographic.viewMode as "landscape" | "portrait");
    }
  }, [infographicData]);

  // Fetch infographic data (with validation)
  const fetchData = useCallback(async () => {
    if (hasFetchedRef.current) return; // Prevent duplicates in Strict Mode
    hasFetchedRef.current = true;

    if (!id) {
      setError("No infographic ID provided.");
      setLoading(false);
      return;
    }

    // Validate ID format before fetch
    if (typeof id !== "string" || !isValidObjectId(id)) {
      console.warn("Invalid infographic ID format:", id, "- Expected 24-character hex ObjectId.");
      setError("Invalid infographic ID format. Please check the URL and try again.");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log("Fetching infographic with ID:", id);
      console.log("API URL:", `${API_BASE_URL}/api/dynamicInfographic/${id}`);
      
      const res = await fetch(`${API_BASE_URL}/api/dynamicInfographic/${id}`);
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        
        // Specific handling for ID format error
        let errorMsg = `HTTP error! status: ${res.status}`;
        try {
          const errJson = JSON.parse(errorText);
          if (errJson.error === "Invalid infographic ID format") {
            errorMsg = "Invalid infographic ID format. The provided ID doesn't match the expected database format. Please check the URL.";
          } else {
            errorMsg += ` - ${errJson.error || errorText}`;
          }
        } catch {
          errorMsg += ` - ${errorText}`;
        }
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      console.log("Response data:", data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      setInfographicData(data);
      if (data.success) {
        setInfographicId(data.infographic._id);
      }
    } catch (err: any) {
      console.error("Error fetching infographic:", err);
      setError(err.message || "Failed to fetch infographic. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id, API_BASE_URL, setInfographicId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Measure natural dimensions
  useEffect(() => {
    if (!infographicData) return;

    setDimensionsReady(false);

    const timer = setTimeout(() => {
      if (tempDivRef.current) {
        const sanitizedHtml = DOMPurify.sanitize(infographicData.infographic.html);
        tempDivRef.current.innerHTML = sanitizedHtml;

        // Force a reflow to ensure dimensions are calculated
        tempDivRef.current.offsetHeight;

        const width = tempDivRef.current.scrollWidth;
        const height = tempDivRef.current.scrollHeight;

        console.log("Measured dimensions:", { width, height });

        setStageWidth(width || 1200);
        setStageHeight(height || 600);
        setDimensionsReady(true);
      } else {
        console.warn("tempDivRef not available for measurement");
        // Fallback
        setStageWidth(1200);
        setStageHeight(600);
        setDimensionsReady(true);
      }
    }, 300); // Increased timeout for complex HTML

    return () => clearTimeout(timer);
  }, [infographicData]);

  // Handle responsive scaling
  useEffect(() => {
    if (stageWidth === 0 || stageHeight === 0 || !dimensionsReady) return;

    const handleResize = () => {
      if (!isMobile) {
        // On web, no scaling - render full size
        setScale(1);
        return;
      }

      if (!containerRef.current) return;

      const isPortraitMobile = orientation === 'portrait';
      const containerPadding = isPortraitMobile ? 8 : isMobile ? 16 : 64;
      const availableWidth = window.innerWidth - containerPadding * 2;

      // Adjust spaces for more room in portrait mobile
      const headerSpace = isPortraitMobile ? 120 : isMobile ? 150 : 250;
      const footerSpace = isPortraitMobile ? 120 : isMobile ? 150 : 150;
      const availableHeight = window.innerHeight ;

      const scaleByWidth = availableWidth / stageWidth;
      const scaleByHeight = availableHeight / stageHeight;
      const calculatedScale = Math.min(scaleByWidth, scaleByHeight, 1);

      setScale(calculatedScale);

      console.log({
        orientation,
        isMobile,
        isPortraitMobile,
        stageWidth,
        stageHeight,
        availableWidth,
        availableHeight,
        scaleByWidth,
        scaleByHeight,
        calculatedScale
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => setTimeout(handleResize, 500));

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [stageWidth, stageHeight, dimensionsReady, isMobile, orientation]);

  const captureStageWithHtml = async (
    stageRef: { current: { toCanvas: () => HTMLCanvasElement } } | null,
    infographicRef: HTMLDivElement | null
  ): Promise<HTMLCanvasElement | null> => {
    if (!stageRef?.current || !infographicRef) return null;

    const stageCanvas = stageRef.current.toCanvas();
    const canvasWidth = stageCanvas.width;
    const canvasHeight = stageCanvas.height;

    // Find the HTML overlay in the document
    const htmlOverlay = document.querySelector("div[aria-label^='Infographic']");
    if (!htmlOverlay || !(htmlOverlay instanceof HTMLElement)) {
      return stageCanvas;
    }

    // Since it's positioned absolutely, offsets might be 0 if aligned
    const offsetX = 0;
    const offsetY = 0;

    const htmlCanvas = await html2canvas(htmlOverlay, {
      backgroundColor: null,
      scale: window.devicePixelRatio || 2,
      useCORS: true,
      width: canvasWidth,
      height: canvasHeight,
      x: offsetX,
      y: offsetY,
      scrollX: 0,
      scrollY: 0,
    });

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = canvasWidth;
    finalCanvas.height = canvasHeight;

    const ctx = finalCanvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(stageCanvas, 0, 0);
    // If HTML is overlay, but since it's the content, perhaps draw HTML first or adjust
    // For now, draw stage then HTML, but if HTML is the main, maybe reverse
    ctx.drawImage(htmlCanvas, 0, 0, canvasWidth, canvasHeight);

    return finalCanvas;
  };

  const handleDownload = async (format: "png" | "jpg") => {
    if (!infographicRef.current || !stageRef.current) return;

    try {
      const canvas = await captureStageWithHtml(stageRef, infographicRef.current);
      if (!canvas) return;

      const link = document.createElement("a");
      link.download = `${infographicData.infographic.title}.${format}`;
      link.href =
        format === "png" ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 1);
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

  if (error) {
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
          <div className="text-red-500 text-lg">{error}</div>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
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
        <Box sx={{ textAlign: "center" }}>
          <div className="text-red-500 text-lg">
            {!infographicData ? "No data received" : "Infographic not found or invalid format"}
          </div>
          <div className="text-gray-500 text-sm mt-2">
            ID: {id}
          </div>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  const sanitizedHtml = DOMPurify.sanitize(infographicData.infographic.html);

  // Format generated date
  const formattedGeneratedDate = (() => {
    const date = new Date(infographicData.meta?.generatedAt || infographicData.infographic.meta?.generatedAt);
    return isNaN(date.getTime())
      ? new Date().toLocaleString()
      : date.toLocaleString();
  })();

  // Calculate actual display dimensions
  const displayWidth = stageWidth * scale;
  const displayHeight = stageHeight * scale;

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <StepsHeader />

      <Box sx={{ mt: { xs: 10, md: 4 } }}>
        <StepIndicator activeStep={1} />
      </Box>

      {/* Hidden temp div for measurement - always rendered after data load */}
      <div
        ref={tempDivRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          visibility: "hidden",
          width: "max-content",
          height: "max-content",
          padding: 0,
          margin: 0,
          overflow: "visible",
          boxSizing: "border-box",
          whiteSpace: "normal",
        }}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          px: { xs: 1, sm: 2, md: 4, lg: 6 },
          py: { xs: 2, sm: 3, md: 4, lg: 5 },
          minHeight: "calc(100vh - 200px)",
          justifyContent: dimensionsReady ? "flex-start" : "center",
          overflowX: !isMobile ? "auto" : "hidden", // Allow horizontal scroll on web if needed
        }}
      >
        {dimensionsReady ? (
          <>
            {/* Header Section */}
            <Box
              sx={{
                textAlign: "center",
                mb: { xs: 2, sm: 3, md: 4 },
                maxWidth: "900px",
                width: "100%",
                px: { xs: 1, sm: 2 },
              }}
            >
              <h1
                style={{
                  fontSize: isSmallMobile ? "1.5rem" : isMobile ? "2rem" : "3rem",
                  fontWeight: 800,
                  color: "#111827",
                  marginBottom: "0.75rem",
                  lineHeight: 1.2,
                }}
              >
                {infographicData.infographic.title}
              </h1>
              <p
                style={{
                  fontSize: isSmallMobile ? "0.875rem" : isMobile ? "1rem" : "1.125rem",
                  color: "#6B7280",
                  fontStyle: "italic",
                  lineHeight: 1.4,
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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: { xs: 2, sm: 3 },
                overflow: "visible",
                position: "relative",
              }}
            >
              <Box
                ref={infographicRef}
                sx={{
                  border: "1px solid #E5E7EB",
                  borderRadius: { xs: 1, md: 2 },
                  backgroundColor: "#ffffff",
                  boxShadow: {
                    xs: "0 4px 12px rgba(0,0,0,0.08)",
                    md: "0 10px 30px rgba(0,0,0,0.1)"
                  },
                  overflow: "visible",
                  width: `${displayWidth}px`,
                  height: `${displayHeight}px`,
                  minWidth: 0,
                  transition: "all 0.3s ease",
                  mx: "auto",
                  "& *": {
                    boxSizing: "border-box",
                  },
                  "& img, & svg, & video, & canvas": {
                    maxWidth: "none", // Allow full size in stage
                    height: "auto",
                    display: "block",
                  },
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
                    display: "block"
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
                          overflow: "visible",
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
                mt: { xs: 2, sm: 3 },
                display: "flex",
                gap: { xs: 1.5, sm: 2 },
                flexWrap: "wrap",
                justifyContent: "center",
                width: "100%",
                px: { xs: 1, sm: 0 },
              }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload("png")}
                sx={{
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  minWidth: { xs: "140px", sm: "160px" },
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
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  minWidth: { xs: "140px", sm: "160px" },
                }}
              >
                Download JPG
              </Button>
            </Box>

            {/* Metadata Section */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: { xs: 1, sm: 1.5, md: 2 },
                mt: { xs: 3, sm: 4, md: 5 },
                mb: { xs: 4, sm: 6, md: 8 },
                alignItems: "center",
                width: "100%",
                px: { xs: 1, sm: 0 },
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
                      <span style={{ fontWeight: 500, fontSize: "0.813rem" }}>
                        Type
                      </span>
                      <span style={{ fontWeight: 700, fontSize: "0.813rem" }}>
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
                    py: { xs: 0.75, sm: 1 },
                    px: { xs: 1.5, sm: 2 },
                    "& .MuiChip-icon": {
                      color: "rgba(142, 45, 226, 0.6)",
                      fontSize: { xs: "1rem", sm: "1.125rem" },
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
                      <span style={{ fontWeight: 500, fontSize: "0.813rem" }}>
                        Source
                      </span>
                      <span style={{ fontWeight: 700, fontSize: "0.813rem" }}>
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
                    py: { xs: 0.75, sm: 1 },
                    px: { xs: 1.5, sm: 2 },
                    "& .MuiChip-icon": {
                      color: "rgba(142, 45, 226, 0.6)",
                      fontSize: { xs: "1rem", sm: "1.125rem" },
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
                      <span style={{ fontWeight: 500, fontSize: "0.813rem" }}>
                        Generated
                      </span>
                      <span style={{ fontWeight: 700, fontSize: "0.813rem" }}>
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
                    py: { xs: 0.75, sm: 1 },
                    px: { xs: 1.5, sm: 2 },
                    "& .MuiChip-icon": {
                      color: "rgba(142, 45, 226, 0.6)",
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(142, 45, 226, 0.12)",
                      boxShadow: "0 2px 8px rgba(142, 45, 226, 0.15)",
                    },
                  }}
                />
              </Tooltip>
            </Box>
          </>
        ) : (
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <div className="text-gray-600 text-lg">Rendering infographic...</div>
          </Box>
        )}
      </Box>
    </Box>
  );
}