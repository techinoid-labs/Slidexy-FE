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
}

type LayoutType = -1| 0 | 1 | 2 | 3 | 4 | 5 ;

interface ThemeContextType {
  selectedTheme: Theme | null ;
  setSelectedTheme: React.Dispatch<React.SetStateAction<Theme | null>>;
  selectedLayout: LayoutType;
  setSelectedLayout: React.Dispatch<React.SetStateAction<LayoutType>>;
  setPrimaryColor: (color: string) => void;
}


const ThemeContext = createContext<ThemeContextType>({
  selectedTheme: null,
  setSelectedTheme: () => {},
  selectedLayout: 0,
  setSelectedLayout: () => {},
  setPrimaryColor: () => {}, 
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
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
