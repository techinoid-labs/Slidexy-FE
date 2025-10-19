"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#8E2DE2",
        light: "#A855F7",
        dark: "#4A00E0",
      },
      secondary: {
        main: "#4A00E0",
        light: "#8E2DE2",
        dark: "#3730A3",
      },
      background: {
        default: "#FFFFFF",
        paper: "#FFFFFF",
      },
      text: {
        primary: "#000000",
        secondary: "#666666",
      },
      grey: {
        50: "#FAFAFA",
        100: "#F5F5F5",
        200: "#EEEEEE",
        300: "#E0E0E0",
        400: "#BDBDBD",
        500: "#9E9E9E",
        600: "#757575",
        700: "#616161",
        800: "#424242",
        900: "#212121",
      },
    },
    typography: {
      fontFamily: "var(--font-raleway), Raleway, sans-serif",
      h1: {
        fontWeight: 800,
        fontSize: "4rem",
        lineHeight: 1.1,
        "@media (max-width:768px)": {
          fontSize: "2.5rem",
        },
      },
      h2: {
        fontWeight: 700,
        fontSize: "2.5rem",
        lineHeight: 1.2,
        "@media (max-width:768px)": {
          fontSize: "2rem",
        },
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.3,
      },
      body1: {
        fontSize: "1.125rem",
        lineHeight: 1.6,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "50px",
            padding: "12px 32px",
            fontSize: "1rem",
          },
        },
      },
    },
  });

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
