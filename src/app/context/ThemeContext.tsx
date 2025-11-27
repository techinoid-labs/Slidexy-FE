// context/ThemeContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
// ThemeContext.tsx
export interface Theme {
  font?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor: string;
  image_url: string | undefined;
  titleColor?: string;
  artPalette?: string[];
}

type LayoutType = -1 | 0 | 1 | 2 | 3 | 4 | 5|6 |7 |8 |9 |10 |11;

interface ThemeContextType {
  selectedTheme: Theme | null;
  setSelectedTheme: React.Dispatch<React.SetStateAction<Theme | null>>;
  selectedLayout: LayoutType;
  setSelectedLayout: React.Dispatch<React.SetStateAction<LayoutType>>;
  setPrimaryColor: (color: string) => void;
}
const DEFAULT_THEME: Theme = {
  font: "Inter",
  primaryColor: "#000000",
  secondaryColor: "#666666",
  backgroundColor: "#ffffff",
  image_url: "",
  titleColor: "#000000",
  artPalette: ["#000000", "#333333", "#000000", "#ffffff", "#ffffff"],
};
const ThemeContext = createContext<ThemeContextType>({
  selectedTheme: null,
  setSelectedTheme: () => {},
  selectedLayout: 0,
  setSelectedLayout: () => {},
  setPrimaryColor: () => {}, 
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
const [selectedTheme, setSelectedTheme] = useState<Theme | null>(DEFAULT_THEME);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>(0);

  const setPrimaryColor = (color: string) => {
    if (selectedTheme) {
      setSelectedTheme({ ...selectedTheme, primaryColor: color });
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        selectedTheme,
        setSelectedTheme,
        selectedLayout,
        setSelectedLayout,
        setPrimaryColor, // ✅ PROVIDE
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useSlideThemeContext = () => useContext(ThemeContext);