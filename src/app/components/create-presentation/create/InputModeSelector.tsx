"use client";

import {
  Box,
  Button,
  useTheme,
  TextField,
  Card,
  CardMedia,
  Box as MuiBox,
} from "@mui/material";
import { useEffect, useState } from "react";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { useSearchParams } from "next/navigation";

const modes = [
  { label: "Prompt-to-Deck", value: "Text" },
  { label: "Video-to-Deck", value: "Youtube" },
  { label: "Web-to-Deck", value: "Website" },
  { label: "Prompt-to-Template", value: "Template" },
];

export default function InputModeSelector({
  onModeChange,
}: {
  onModeChange: (mode: string) => void;
}) {
  const [activeMode, setActiveMode] = useState<string | null>("Text");
  const theme = useTheme();

  const searchParams = useSearchParams();

  useEffect(() => {
    const active = searchParams.get("name")
      ? searchParams.get("name")
      : activeMode;

    setActiveMode(active);
  }, []);

  const handleModeChange = (mode: string) => {
    setActiveMode(mode);
    onModeChange(mode);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: 4,
        width: "100%",
      }}
    >
      {modes.map((modeObj) => {
        const isActive = activeMode === modeObj.value;
        return (
          <Button
            key={modeObj.value}
            fullWidth
            onClick={() => handleModeChange(modeObj.value)}
            disableElevation
            variant="outlined"
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 0" },
              borderRadius: 1,
              fontWeight: 600,
              fontSize: "0.80rem",
              py: 1.5,
              px: 4,
              backgroundColor: isActive
                ? theme.palette.secondary.light + "10"
                : "transparent",
              border: `0px solid ${
                isActive
                  ? theme.palette.secondary.light
                  : theme.palette.grey[200]
              }`,
              color: isActive
                ? theme.palette.secondary.main
                : theme.palette.grey[600],
              boxShadow: isActive
                ? `inset 0 -1px 0 ${theme.palette.secondary.light}`
                : `none`,
              "&:hover": {
                backgroundColor: isActive
                  ? theme.palette.secondary.light + "22"
                  : theme.palette.grey[100],
              },
              transition: "all 0.2s ease",
            }}
          >
            {modeObj.label}
          </Button>
        );
      })}
    </Box>
  );
}
