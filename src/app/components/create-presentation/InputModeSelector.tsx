"use client";

import { Box, Button } from "@mui/material";
import { useState } from "react";

const modes = ["Text", "Website"];

export default function InputModeSelector({
  onModeChange,
}: {
  onModeChange: (mode: string) => void;
}) {
  const [activeMode, setActiveMode] = useState("Text");

  const handleModeChange = (mode: string) => {
    setActiveMode(mode);
    onModeChange(mode);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        mb: 3,
        flexWrap: "wrap",
      }}
    >
      {modes.map((mode) => (
        <Button
          key={mode}
          onClick={() => handleModeChange(mode)}
          variant={activeMode === mode ? "contained" : "outlined"}
          sx={{
            textTransform: "none",
            borderRadius: "999px",
            px: 3,
            py: 1,
            fontWeight: 600,
            backgroundColor: activeMode === mode ? "#8E2DE2" : "transparent",
            color: activeMode === mode ? "#fff" : "#8E2DE2",
            borderColor: "#8E2DE2",
            "&:hover": {
              backgroundColor:
                activeMode === mode ? "#7a23c2" : "rgba(142,45,226,0.1)",
            },
          }}
        >
          {mode}
        </Button>
      ))}
    </Box>
  );
}
