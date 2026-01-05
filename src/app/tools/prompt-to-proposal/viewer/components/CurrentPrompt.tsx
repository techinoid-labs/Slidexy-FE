"use client";
import { Box, Typography, Paper } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";

interface CurrentPromptProps {
  prompt: string;
  title?: string;
}

export default function CurrentPrompt({ prompt, title }: CurrentPromptProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #e8e4ff",
        bgcolor: "white",
        transition: "all 0.3s ease",
        "&:hover": { boxShadow: "0 4px 20px rgba(108, 43, 217, 0.08)" }
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: "rgba(108, 43, 217, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mr: 2
        }}>
          <AutoAwesome sx={{ color: "#6C2BD9", fontSize: 20 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
          Current Prompt
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{
          p: 2.5,
          bgcolor: "#fafbfc",
          borderRadius: 2,
          border: "1px solid #f0f0f5",
          maxHeight: "200px",
          overflowY: "auto",
          lineHeight: 1.6,
          color: "#4a4a4a",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": { bgcolor: "#e0e0e0", borderRadius: "3px" }
        }}
      >
        {prompt}
      </Typography>

      {title && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "#f8f9ff", borderRadius: 2 }}>
          <Typography variant="caption" sx={{ color: "#6d6d6d", fontWeight: 600 }}>
            Generated Title:
          </Typography>
          <Typography variant="body2" sx={{ color: "#1a1a1a", fontWeight: 500, mt: 0.5 }}>
            {title}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
