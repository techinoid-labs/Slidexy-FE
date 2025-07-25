"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function PosterTemplateDisplay() {
  const [imageUrl, setImageUrl] = useState("");
  const [editableText, setEditableText] = useState("Your text here"); // State for editable text
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null); // To hold the image object

  // Function to draw the image and text on the canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const image = imageRef.current;

    if (canvas && ctx && image && image.complete) {
      // Set canvas dimensions to match image
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Draw the editable text at the center
      ctx.font = `${canvas.height * 0.05}px Arial`; // Adjust font size relative to image height
      ctx.fillStyle = "black"; // Text color
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      ctx.fillText(editableText, x, y);
    }
  }, [editableText]); // Redraw when editableText changes

  // Load image from localStorage and trigger drawing
  useEffect(() => {
    const stored = localStorage.getItem("posterTemplateData");
    if (stored) {
      const data = JSON.parse(stored);
      const url = data.imageUrl || "";
      setImageUrl(url);

      if (url) {
        // Create a new Image object to ensure it's loaded before drawing
        const img = new Image();
        img.src = url;
        img.onload = () => {
          imageRef.current = img; // Store the image object
          drawCanvas(); // Draw once the image is loaded
        };
        img.onerror = () => {
          console.error("Failed to load image from URL:", url);
          setImageUrl(""); // Clear image if loading fails
        };
      }
    }
  }, [drawCanvas]);

  // Redraw when editableText changes
  useEffect(() => {
    drawCanvas();
  }, [editableText, drawCanvas]);

  // Handle download of the modified image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL("image/png"); // Get image as data URL
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "modified_poster.png"; // File name for download
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
    <Box sx={{ textAlign: "center", padding: "2rem" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Edit Your Poster Template
      </Typography>

      {/* Canvas will display the image with overlaid text */}
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: "100%",
          height: "auto",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      />

      {/* Text field for editing */}
      <TextField
        fullWidth
        label="Edit Text on Poster"
        variant="outlined"
        value={editableText}
        onChange={(e) => setEditableText(e.target.value)}
        sx={{ mt: 3, maxWidth: "600px" }}
      />

      {/* Download button */}
      <Button
        variant="contained"
        sx={{ mt: 2, bgcolor: "#8E2DE2", "&:hover": { bgcolor: "#4A00E0" } }}
        onClick={handleDownload}
      >
        Download Modified Poster
      </Button>
    </Box>
  );
}
