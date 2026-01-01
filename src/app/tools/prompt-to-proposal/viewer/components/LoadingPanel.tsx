"use client";
import { Box, CircularProgress, Typography, Chip, Paper } from "@mui/material";

interface LoadingPanelProps {
  message: string;
}

export default function LoadingPanel({ message }: LoadingPanelProps) {
  return (
    <Paper elevation={0} sx={{
      p: 4,
      borderRadius: 3,
      border: "2px solid #6C2BD9",
      bgcolor: "white",
      boxShadow: "0 4px 20px rgba(108, 43, 217, 0.15)"
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
        <CircularProgress size={52} sx={{ color: "#6C2BD9" }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#6C2BD9", mb: 0.5 }}>
            {message}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6d6d6d" }}>
            Please wait while we craft your professional proposal
          </Typography>
        </Box>
      </Box>

      <Box sx={{
        p: 2.5,
        bgcolor: "#fafbfc",
        borderRadius: 2,
        border: "1px solid #f0f0f5",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="body2" sx={{ color: "#4a4a4a", fontWeight: 600 }}>
            ⏱️ Estimated completion time
          </Typography>
          <Chip label="20-30 seconds" size="small" sx={{ bgcolor: "rgba(108, 43, 217, 0.1)", color: "#6C2BD9", fontWeight: 600 }} />
        </Box>
        <Typography variant="caption" sx={{ color: "#8b6fbf", display: "block" }}>
          🤖 AI is analyzing your requirements and generating custom content tailored to your needs
        </Typography>
      </Box>
    </Paper>
  );
}
