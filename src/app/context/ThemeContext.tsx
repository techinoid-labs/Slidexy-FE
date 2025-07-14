"use client";
import React, { createContext, useContext, useState } from "react";

export interface Theme {
  font: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  image_url: string;
}

type LayoutType = 0 | 1 | 2 | 3 | 4 | 5;

interface ThemeContextType {
  selectedTheme: Theme | null;
  setSelectedTheme: (theme: Theme) => void;
  selectedLayout: LayoutType;
  setSelectedLayout: (layout: LayoutType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  selectedTheme: null,
  setSelectedTheme: () => {},
  selectedLayout: 0,
  setSelectedLayout: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>(0);

  return (
    <ThemeContext.Provider value={{ selectedTheme, setSelectedTheme, selectedLayout, setSelectedLayout }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useSlideThemeContext = () => useContext(ThemeContext);
