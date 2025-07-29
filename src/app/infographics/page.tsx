"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";

export default function PosterTemplateDisplay() {
  const [imageUrl, setImageUrl] = useState("");
  const [textFields, setTextFields] = useState([
    { label: "Top Left", x: "5%", y: "5%", value: "Top Left" },
    { label: "Top Right", x: "75%", y: "5%", value: "Top Right" },
    { label: "Bottom Left", x: "5%", y: "85%", value: "Bottom Left" },
    { label: "Bottom Right", x: "75%", y: "85%", value: "Bottom Right" },
    { label: "Center", x: "35%", y: "45%", value: "Center" },
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const image = imageRef.current;

    if (canvas && ctx && image && image.complete) {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      textFields.forEach((field) => {
        const fontSize = canvas.height * 0.035;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        const x = (parseFloat(field.x) / 100) * canvas.width;
        const y = (parseFloat(field.y) / 100) * canvas.height;
        ctx.fillText(field.value, x, y);
      });
    }
  }, [textFields]);

  useEffect(() => {
    const stored = localStorage.getItem("posterTemplateData");
    if (stored) {
      const data = JSON.parse(stored);
      const url = data.imageUrl || "";
      setImageUrl(url);

      if (url) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          imageRef.current = img;
          drawCanvas();
        };
        img.onerror = () => {
          console.error("Failed to load image from URL:", url);
          setImageUrl("");
        };
      }
    }
  }, [drawCanvas]);

  useEffect(() => {
    drawCanvas();
  }, [textFields, drawCanvas]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "modified_poster.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!imageUrl) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>No poster template found.</p>
      </div>
    );
  }

  return (
    <Box sx={{ position: "relative", textAlign: "center", padding: "2rem" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Edit Your Poster Template
      </Typography>

      <Box sx={{ position: "relative", display: "inline-block" }}>
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: "100%",
            height: "auto",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        />

        {/* Overlay text inputs */}
        {textFields.map((field, index) => (
          <textarea
            key={index}
            value={field.value}
            onChange={(e) => {
              const updated = [...textFields];
              updated[index].value = e.target.value;
              setTextFields(updated);
            }}
            style={{
              position: "absolute",
              top: field.y,
              left: field.x,
              width: "150px",
              padding: "6px",
              resize: "none",
              background: "rgba(255,255,255,0.7)",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        ))}
      </Box>

      <Button
        variant="contained"
        sx={{ mt: 3, bgcolor: "#8E2DE2", "&:hover": { bgcolor: "#4A00E0" } }}
        onClick={handleDownload}
      >
        Download Modified Poster
      </Button>
    </Box>
  );
}
