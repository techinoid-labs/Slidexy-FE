"use client";
import { useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";
import { Html } from "react-konva-utils";
import DOMPurify from "dompurify";
import { useTemplateSlides } from "../../context/TemplateSlidesContext";
import StepsHeader from "@/app/components/headers-navbar/StepsHeader";
import StepIndicator from "@/app/components/shared/StepsIndicatorInfographics";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { toPng, toJpeg } from "html-to-image";
import { useRef } from "react";
import RecordRTC from "recordrtc";
import domtoimage from 'dom-to-image';
import html2canvas from "html2canvas";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams } from "next/navigation";
import { Alert, useMediaQuery, useTheme } from "@mui/material";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
const ffmpeg = new FFmpeg();
export default function InfographicPage() {
  const [converting, setConverting] = useState(false);
  const stageRef = useRef<any>(null);
  const infographicRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const { infographicId, setInfographicId } = useTemplateSlides();
  const [loading, setLoading] = useState(true);
  const [infographicData, setInfographicData] = useState<any>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const canvas = stageRef.current?.content?.querySelector("canvas") as HTMLCanvasElement;
  const stageWidth = infographicRef.current?.offsetWidth || 1200;
  const stageHeight = infographicRef.current?.offsetHeight || 600;
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        console.log("Fetching infographic with ID:", id);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading infographic...
      </div>
    );
  }

  if (!id) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Failed to load infographic.
      </div>
    );
  }
 const captureStageWithHtml = async (
  stageRef: { current: { toCanvas: () => HTMLCanvasElement } } | null,
  infographicRef: HTMLDivElement | null
): Promise<HTMLCanvasElement | null> => {
  if (!stageRef?.current || !infographicRef) return null;

  // Get the canvas from the stage
  const stageCanvas = stageRef.current.toCanvas();
  const stageWidth = stageCanvas.width;
  const stageHeight = stageCanvas.height;

  // Find the HTML overlay element
  const htmlOverlay = infographicRef.querySelector("div[aria-label^='Infographic']");
  if (!htmlOverlay || !(htmlOverlay instanceof HTMLElement)) {
    // If not found or not an HTMLElement, just return the stage canvas
    return stageCanvas;
  }

  // Calculate offsets
  const overlayRect = htmlOverlay.getBoundingClientRect();
  const parentRect = infographicRef.getBoundingClientRect();
  const offsetX = overlayRect.left - parentRect.left;
  const offsetY = overlayRect.top - parentRect.top;

  // Render HTML overlay to canvas
  const htmlCanvas = await html2canvas(htmlOverlay, {
    backgroundColor: null,
    scale: window.devicePixelRatio || 2,
    useCORS: true,
    width: stageWidth,
    height: stageHeight,
    x: offsetX,
    y: offsetY,
  });

  // Create final canvas and draw both layers
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = stageWidth;
  finalCanvas.height = stageHeight;

  const ctx = finalCanvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(stageCanvas, 0, 0);
  ctx.drawImage(htmlCanvas, 0, 0, stageWidth, stageHeight);

  return finalCanvas;
};



  const handleDownload = async (format: "png" | "jpg") => {
    if (!infographicRef.current || !stageRef.current) return;

    try {
      const canvas = await captureStageWithHtml(stageRef, infographicRef.current);
      if (!canvas) return;

      const link = document.createElement("a");
      link.download = `${infographicData.infographic.title}.${format}`;
      link.href = format === "png"
        ? canvas.toDataURL("image/png")
        : canvas.toDataURL("image/jpeg", 1);
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };



  const sanitizedHtml = DOMPurify.sanitize(infographicData.infographic.html);

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <StepsHeader />
      {/* <Alert
        severity="info"
        className="flex items-center w-full justify-center"
        sx={{
          borderRadius: 0,
          textAlign: "center",
          fontSize: { xs: "12px", md: "14px" },
          py: { xs: 0.5, md: 1 },
          backgroundColor: "#F0F4FF",
          color: "#333",
          mt: isMobile ? 8 : 0,
        }}
      >
        This feature is still under development. We’re actively improving it to
        provide more accurate and reliable output.
      </Alert> */}
      <Box sx={{ mt: 4 }}>
        <StepIndicator activeStep={1} />
      </Box>

      <div className="flex flex-col items-center min-h-screen bg-white p-20 ">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            {infographicData.infographic.title}
          </h1>
          <p className="text-lg text-gray-600 mt-3 italic">
            {infographicData.infographic.subtitle}
          </p>
        </div>
        {/* <div className="mb-100 px-6 py-10 bg-white border border-purple-200 rounded-xl shadow-md text-purple-700 font-semibold text-base">
          Infographic Type: <span className="ml-2 text-purple-900">{infographicData.infographic.type}</span>
        </div> */}
        <div className="mt-10 text-center mb-6">
        </div>

        {/* Infographic Renderer */}
        <div
          ref={infographicRef}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-[1200px] w-full border border-gray-100 mt-100 p-6 space-y-60"
        >
          <Stage ref={stageRef} width={stageWidth} height={stageHeight}>
            <Layer>
              <Html
                divProps={{
                  style: {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "1200px",
                    height: "600px",
                    maxWidth: "100%",
                    maxHeight: "600px",
                    boxSizing: "border-box",
                    overflow: "hidden",
                  },
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                  aria-label={`Infographic: ${infographicData.infographic.title}`}
                />
              </Html>
            </Layer>
          </Stage>
        </div>
        <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload("png")}
          >
            Download PNG
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload("jpg")}
          >
            Download JPG
          </Button>
        </Box>

        {/* Add progress indicator */}
        {converting && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              color: '#1976d2',
              fontWeight: 'bold'
            }}>
              🎬 Recording in progress... Please keep the infographic visible!
            </div>
          </Box>
        )}

        {/* Extra Metadata Row */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 3,
            mt: 6,
            mb: 10,
          }}
        >
          {/* Infographic Type */}
          <Box
            component="button"
            onClick={() => alert(`Infographic Type: ${infographicData.infographic.type}`)}
            sx={{
              px: 3,
              py: 2,
              bgcolor: "white",
              border: "2px solid rgba(142, 45, 226, 1)",
              borderRadius: "16px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              fontWeight: 600,
              fontSize: "1rem",
              color: "rgba(142, 45, 226, 1)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(142, 45, 226, 0.05)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box component="span" sx={{ color: "grey.600", fontWeight: 600 }}>
              Type:
            </Box>{" "}
            <Box component="span" sx={{ ml: 1, fontWeight: 700, color: "rgba(142, 45, 226, 1)" }}>
              {infographicData.infographic.type}
            </Box>
          </Box>

          {/* Source */}
          <Box
            component="button"
            onClick={() => alert("Source: Slidexy Generated")}
            sx={{
              px: 3,
              py: 2,
              bgcolor: "white",
              border: "2px solid rgba(142, 45, 226, 1)",
              borderRadius: "16px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              fontWeight: 600,
              fontSize: "1rem",
              color: "rgba(142, 45, 226, 1)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(142, 45, 226, 0.05)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box component="span" sx={{ color: "grey.600", fontWeight: 600 }}>
              Source:
            </Box>{" "}
            <Box component="span" sx={{ ml: 1, fontWeight: 700, color: "rgba(142, 45, 226, 1)" }}>
              Slidexy Generated
            </Box>
          </Box>

          {/* Generated Date */}
          <Box
            component="button"
            onClick={() => alert("Generated date clicked")}
            sx={{
              px: 3,
              py: 2,
              bgcolor: "white",
              border: "2px solid rgba(142, 45, 226, 1)",
              borderRadius: "16px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              fontWeight: 600,
              fontSize: "1rem",
              color: "rgba(142, 45, 226, 1)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(142, 45, 226, 0.05)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box component="span" sx={{ color: "grey.600", fontWeight: 600 }}>
              Generated:
            </Box>{" "}
            <Box component="span" sx={{ ml: 1, fontWeight: 700, color: "rgba(142, 45, 226, 1)" }}>
              {(() => {
                const date = new Date(infographicData.meta?.generatedAt);
                return isNaN(date.getTime())
                  ? new Date().toLocaleString()
                  : date.toLocaleString();
              })()}
            </Box>
          </Box>
        </Box>




      </div>
    </Box>
  );
}
