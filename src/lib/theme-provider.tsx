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
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#4A00E0",
        light: "#8E2DE2",
        dark: "#3730A3",
        contrastText: "#FFFFFF",
      },
      error: {
        main: "#EF4444",
      },
      success: {
        main: "#10B981",
      },
      warning: {
        main: "#F59E0B",
      },
      background: {
        default: "#FFFFFF",
        paper: "#FFFFFF",
      },
      text: {
        primary: "#0F0A19",
        secondary: "#5B5568",
      },
      divider: "rgba(142, 45, 226, 0.12)",
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
        fontFamily: "var(--font-raleway), Raleway, sans-serif",
        fontWeight: 700,
        fontSize: "3rem",
        lineHeight: 1.1,
        letterSpacing: "-0.03em",
        "@media (max-width:768px)": {
          fontSize: "2.15rem",
        },
      },
      h2: {
        fontFamily: "var(--font-raleway), Raleway, sans-serif",
        fontWeight: 700,
        fontSize: "2.25rem",
        lineHeight: 1.2,
        letterSpacing: "-0.025em",
        "@media (max-width:768px)": {
          fontSize: "1.75rem",
        },
      },
      h3: {
        fontFamily: "var(--font-raleway), Raleway, sans-serif",
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.25,
        letterSpacing: "-0.02em",
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.65,
      },
      h4: {
        fontFamily: "var(--font-raleway), Raleway, sans-serif",
        fontWeight: 600,
        fontSize: "1.25rem",
        lineHeight: 1.35,
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.0625rem",
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: "1rem",
        lineHeight: 1.4,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 14,
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "999px",
            fontSize: "0.95rem",
            letterSpacing: "0.01em",
            transition:
              "transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease, background-color 0.2s ease",
            "&:focus-visible": {
              outline: "2px solid #8E2DE2",
              outlineOffset: "2px",
            },
          },
          sizeSmall: {
            padding: "6px 16px",
            fontSize: "0.85rem",
          },
          sizeMedium: {
            padding: "10px 24px",
          },
          sizeLarge: {
            padding: "14px 32px",
            fontSize: "1.05rem",
          },
          contained: {
            background: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)",
            backgroundSize: "200% 200%",
            boxShadow: "0 4px 18px rgba(142, 45, 226, 0.32)",
            "&:hover": {
              background: "linear-gradient(135deg, #9B3FF0 0%, #5A10F0 100%)",
              boxShadow: "0 10px 28px rgba(142, 45, 226, 0.42)",
              transform: "translateY(-2px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
            "&.Mui-disabled": {
              background: "#E5E1EF",
              color: "#A8A2B8",
              boxShadow: "none",
            },
          },
          containedSecondary: {
            background: "#0F0A19",
            "&:hover": {
              background: "#1a1228",
            },
          },
          outlined: {
            borderWidth: "1.5px",
            borderColor: "rgba(142, 45, 226, 0.4)",
            "&:hover": {
              borderWidth: "1.5px",
              borderColor: "#8E2DE2",
              backgroundColor: "rgba(142, 45, 226, 0.06)",
              transform: "translateY(-2px)",
            },
          },
          text: {
            "&:hover": {
              backgroundColor: "rgba(142, 45, 226, 0.08)",
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "background-color 0.18s ease, transform 0.18s ease",
            "&:hover": {
              backgroundColor: "rgba(142, 45, 226, 0.08)",
            },
            "&:focus-visible": {
              outline: "2px solid #8E2DE2",
              outlineOffset: "2px",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "999px",
            fontWeight: 500,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "14px",
            transition: "box-shadow 0.18s ease, border-color 0.18s ease",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(142, 45, 226, 0.2)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(142, 45, 226, 0.5)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8E2DE2",
              borderWidth: "1.5px",
            },
            "&.Mui-focused": {
              boxShadow: "0 0 0 4px rgba(142, 45, 226, 0.12)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          rounded: {
            borderRadius: "18px",
          },
          elevation1: {
            boxShadow: "0 1px 2px rgba(142, 45, 226, 0.05)",
          },
          elevation3: {
            boxShadow:
              "0 10px 15px -3px rgba(142, 45, 226, 0.1), 0 4px 6px -2px rgba(142, 45, 226, 0.05)",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: "14px",
            boxShadow:
              "0 10px 15px -3px rgba(142, 45, 226, 0.12), 0 4px 6px -2px rgba(142, 45, 226, 0.06)",
            border: "1px solid rgba(142, 45, 226, 0.08)",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            margin: "2px 6px",
            width: "calc(100% - 12px)",
            "&.Mui-selected": {
              backgroundColor: "rgba(142, 45, 226, 0.1)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "18px",
            border: "1px solid rgba(142, 45, 226, 0.1)",
            boxShadow:
              "0 4px 6px -1px rgba(142, 45, 226, 0.1), 0 2px 4px -1px rgba(142, 45, 226, 0.06)",
            transition:
              "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow:
                "0 16px 32px -8px rgba(142, 45, 226, 0.2), 0 4px 12px rgba(15, 10, 25, 0.06)",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });

  // Avoid blank first paint — render with theme immediately after mount check
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ mode, toggleTheme }}>
        <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
