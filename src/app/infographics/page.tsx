"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";

export default function PosterTemplateDisplay() {
  const [imageUrl, setImageUrl] = useState("");
  const [textFields, setTextFields] = useState([
    { id: "topLeft", label: "Top Left", x: "5%", y: "5%", value: "Top Left" },
    {
      id: "topRight",
      label: "Top Right",
      x: "75%",
      y: "5%",
      value: "Top Right",
    },
    {
      id: "bottomLeft",
      label: "Bottom Left",
      x: "5%",
      y: "85%",
      value: "Bottom Left",
    },
    {
      id: "bottomRight",
      label: "Bottom Right",
      x: "75%",
      y: "85%",
      value: "Bottom Right",
    },
    { id: "center", label: "Center", x: "35%", y: "45%", value: "Center" },
  ]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const [dragStartMousePos, setDragStartMousePos] = useState({ x: 0, y: 0 });

  const INPUT_FIELD_WIDTH_PX = 200;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const image = imageRef.current;

    if (canvas && ctx && image && image.complete) {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      textFields.forEach((field, index) => {
        const fontSize = canvas.height * 0.035;
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        const x = (parseFloat(field.x) / 100) * canvas.width;
        const y = (parseFloat(field.y) / 100) * canvas.height;

        ctx.fillText(field.value, x, y);

        if (editingIndex !== index) {
          const textWidth = ctx.measureText(field.value).width;
          const textHeight = fontSize * 1.2;
          ctx.fillStyle = "rgba(0,0,0,0)";
          ctx.fillRect(x, y, textWidth, textHeight);
        }
      });
    }
  }, [textFields, editingIndex]);

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

  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  const getCanvasMouseCoordinates = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;
    return { x: mouseX, y: mouseY };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (editingIndex !== null) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { x: mouseX, y: mouseY } = getCanvasMouseCoordinates(event);

    textFields.forEach((field, index) => {
      const fontSize = canvas.height * 0.035;
      ctx.font = `bold ${fontSize}px Arial`;
      const textX = (parseFloat(field.x) / 100) * canvas.width;
      const textY = (parseFloat(field.y) / 100) * canvas.height;
      const textWidth = ctx.measureText(field.value).width;
      const textHeight = fontSize * 1.2;

      if (
        mouseX >= textX &&
        mouseX <= textX + textWidth &&
        mouseY >= textY &&
        mouseY <= textY + textHeight
      ) {
        setIsDragging(true);
        setDragStartIndex(index);
        setDragStartMousePos({ x: mouseX, y: mouseY });
      }
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || dragStartIndex === null) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { x: currentMouseX, y: currentMouseY } =
      getCanvasMouseCoordinates(event);

    const deltaX = currentMouseX - dragStartMousePos.x;
    const deltaY = currentMouseY - dragStartMousePos.y;

    const updatedTextFields = [...textFields];
    const fieldToMove = updatedTextFields[dragStartIndex];

    let currentPxX = (parseFloat(fieldToMove.x) / 100) * canvas.width;
    let currentPxY = (parseFloat(fieldToMove.y) / 100) * canvas.height;

    let newPxX = currentPxX + deltaX;
    let newPxY = currentPxY + deltaY;

    const textWidth = ctx.measureText(fieldToMove.value).width;
    const textHeight = canvas.height * 0.035 * 1.2;

    newPxX = Math.max(0, Math.min(newPxX, canvas.width - textWidth));
    newPxY = Math.max(0, Math.min(newPxY, canvas.height - textHeight));

    fieldToMove.x = `${(newPxX / canvas.width) * 100}%`;
    fieldToMove.y = `${(newPxY / canvas.height) * 100}%`;

    setTextFields(updatedTextFields);
    setDragStartMousePos({ x: currentMouseX, y: currentMouseY });
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && dragStartIndex !== null) {
      const { x: currentMouseX, y: currentMouseY } =
        getCanvasMouseCoordinates(event);
      const deltaX = currentMouseX - dragStartMousePos.x;
      const deltaY = currentMouseY - dragStartMousePos.y;

      if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) {
        handleCanvasClick(event);
      }
    }
    setIsDragging(false);
    setDragStartIndex(null);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { x: mouseX, y: mouseY } = getCanvasMouseCoordinates(event);

    let clickedFieldIndex: number | null = null;
    textFields.forEach((field, index) => {
      const fontSize = canvas.height * 0.035;
      ctx.font = `bold ${fontSize}px Arial`;
      const x = (parseFloat(field.x) / 100) * canvas.width;
      const y = (parseFloat(field.y) / 100) * canvas.height;
      const textWidth = ctx.measureText(field.value).width;
      const textHeight = fontSize * 1.2;

      if (
        mouseX >= x &&
        mouseX <= x + textWidth &&
        mouseY >= y &&
        mouseY <= y + textHeight
      ) {
        clickedFieldIndex = index;
      }
    });

    setEditingIndex(clickedFieldIndex);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingIndex !== null) {
      const updated = [...textFields];
      updated[editingIndex].value = e.target.value;
      setTextFields(updated);
    }
  };

  const handleInputBlur = () => {
    setEditingIndex(null);
  };

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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            maxWidth: "100%",
            height: "auto",
            border: "1px solid #ddd",
            borderRadius: "10px",
            cursor: isDragging ? "grabbing" : "pointer",
          }}
        />

        {editingIndex !== null && (
          <TextField
            inputRef={inputRef}
            value={textFields[editingIndex].value}
            onChange={handleTextChange}
            onBlur={handleInputBlur}
            sx={{
              position: "absolute",
              top: textFields[editingIndex].y,
              left: textFields[editingIndex].x,
              width: `${INPUT_FIELD_WIDTH_PX}px`,
              minWidth: `${INPUT_FIELD_WIDTH_PX}px`,
              maxWidth: `${INPUT_FIELD_WIDTH_PX}px`,
              background: "rgba(255,255,255,0.9)",
              border: "1px solid #ccc",
              borderRadius: "4px",
              transform: "translate(-50%, -50%)",
              "& .MuiInputBase-input": {
                padding: "6px",
                fontSize: "14px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
            }}
            size="small"
            autoFocus
          />
        )}
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
