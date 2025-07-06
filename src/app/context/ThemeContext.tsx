"use client";
import React, { createContext, useContext, useState } from "react";

export interface Theme {
  font: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  image_url: string;
}

interface ThemeContextType {
  selectedTheme: Theme | null;
  setSelectedTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  selectedTheme: null,
  setSelectedTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  return (
    <ThemeContext.Provider value={{ selectedTheme, setSelectedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useSlideThemeContext = () => useContext(ThemeContext);
