"use client";

import React, { createContext, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSlides, updateSlide, removeSlides } from "../slice/slidesSlice";
import type { Slide } from "../slice/slidesSlice";
import type { RootState } from "../store/store";

export type SlidesType = Slide[];

interface Theme {
  font: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  image_url: string;
}

interface SlidesContextType {
  slides: SlidesType;
  setSlides: (slides: SlidesType) => void;
  updateSlides?: (slides: SlidesType) => void;
  selectedSlideIndex: number;
  setSelectedSlideIndex: (index: number) => void;
  selectedImage: any | null;
  setSelectedImage: (image: any | null) => void;
  selectedImageIndex: null | number;
  setSelectedImageIndex: (index: number | null) => void;
  selectedTextId: null | string;
  setSelectedTextId: (id: string | null) => void;
  selectedShapeIndex: number | null;
  removeSlides: () => void;
  setSelectedShapeIndex: (index: number | null) => void;
  tooltip: { visible: boolean; x: number; y: number; node: any | null };
  setTooltip: (tooltip: {
    visible: boolean;
    x: number;
    y: number;
    node: any | null;
  }) => void;
  isAtBoundary: boolean;
  setIsAtBoundary: (value: boolean) => void;
  aiThemes: Theme[];
  setAiThemes: (themes: Theme[]) => void;
  isMobileImageSelected: boolean;
  setIsMobileImageSelected: (value: boolean) => void;
}

const SlidesContext = createContext<SlidesContextType>({
  slides: [],
  setSlides: () => {},
  updateSlides: () => {},
  selectedSlideIndex: 0,
  setSelectedSlideIndex: () => {},
  selectedImage: null,
  setSelectedImage: () => {},
  removeSlides: () => {},
  selectedImageIndex: null,
  setSelectedImageIndex: () => {},
  selectedTextId: null,
  setSelectedTextId: () => {},
  selectedShapeIndex: null,
  setSelectedShapeIndex: () => {},
  tooltip: { visible: false, x: 0, y: 0, node: null },
  setTooltip: () => {},
  isAtBoundary: false,
  setIsAtBoundary: () => {},
  aiThemes: [],
  setAiThemes: () => {},
  isMobileImageSelected: false,
  setIsMobileImageSelected: () => {},
});

export const SlidesProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const slides = useSelector((state: RootState) => state.slidesData.slides);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 50,
    y: 10,
    node: null,
  });
  const [isAtBoundary, setIsAtBoundary] = useState(false);
  const [aiThemes, setAiThemes] = useState<Theme[]>([]);
  const [isMobileImageSelected, setIsMobileImageSelected] = useState(false); // Add state

  const handleSetSlides = (newSlides: SlidesType) => {
    dispatch(setSlides(newSlides));
  };

  const handleDeleteSlides = () => {
    dispatch(setSlides([]));
  };

  const handleUpdateSlides = (slides: SlidesType) => {
    dispatch(updateSlide(slides));
  };

  return (
    <SlidesContext.Provider
      value={{
        slides,
        setSlides: handleSetSlides,
        removeSlides: handleDeleteSlides,
        updateSlides: handleUpdateSlides,
        selectedSlideIndex,
        setSelectedSlideIndex,
        selectedImage,
        setSelectedImage,
        selectedImageIndex,
        setSelectedImageIndex,
        selectedTextId,
        setSelectedTextId,
        selectedShapeIndex,
        setSelectedShapeIndex,
        tooltip,
        setTooltip,
        isAtBoundary,
        setIsAtBoundary,
        aiThemes,
        setAiThemes,
        isMobileImageSelected, // Include in value
        setIsMobileImageSelected, // Include in value
      }}
    >
      {children}
    </SlidesContext.Provider>
  );
};

export const useSlides = () => useContext(SlidesContext);