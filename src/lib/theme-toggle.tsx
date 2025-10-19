"use client"
import { IconButton } from "@mui/material"
import { Brightness4, Brightness7 } from "@mui/icons-material"
import { useTheme } from "@/lib/theme-provider"

export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme()

  return (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      aria-label="toggle theme"
      sx={{
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      {mode === "light" ? <Brightness4 /> : <Brightness7 />}
    </IconButton>
  )
}
