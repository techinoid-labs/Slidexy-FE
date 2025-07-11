"use client";
import React, { createContext, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSlides } from "../slice/slidesSlice";
import type { Slide } from "../slice/slidesSlice";
import type { RootState } from "../store/store";

export type SlidesType = Slide[];

interface SlidesContextType {
  slides: SlidesType;
  setSlides: (slides: SlidesType) => void;
  selectedSlideIndex: number;
  setSelectedSlideIndex: (index: number) => void;
}

const SlidesContext = createContext<SlidesContextType>({
  slides: [],
  setSlides: () => {},
  selectedSlideIndex: 0,
  setSelectedSlideIndex: () => {},
});

export const SlidesProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const slides = useSelector((state: RootState) => state.slidesData.slides);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  const handleSetSlides = (newSlides: SlidesType) => {
    dispatch(setSlides(newSlides));
  };

  return (
    <SlidesContext.Provider
      value={{
        slides,
        setSlides: handleSetSlides,
        selectedSlideIndex,
        setSelectedSlideIndex,
      }}
    >
      {children}
    </SlidesContext.Provider>
  );
};

export const useSlides = () => useContext(SlidesContext);
