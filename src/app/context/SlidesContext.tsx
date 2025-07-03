"use client";
import React, { createContext, useContext, useState } from "react";

export type SlidesType = any[];

const SlidesContext = createContext<{
  slides: SlidesType;
  setSlides: (slides: SlidesType) => void;
}>({
  slides: [],
  setSlides: () => {},
});

export const SlidesProvider = ({ children }: { children: React.ReactNode }) => {
  const [slides, setSlidesState] = useState<SlidesType>([]);

  const setSlides = (slides: SlidesType) => {
    console.log("[SlidesContext] Setting slides:", slides);
    setSlidesState(slides);
  };

  React.useEffect(() => {
    console.log("[SlidesContext] Current slides:", slides);
  }, [slides]);

  return (
    <SlidesContext.Provider value={{ slides, setSlides }}>
      {children}
    </SlidesContext.Provider>
  );
};

export const useSlides = () => useContext(SlidesContext);
