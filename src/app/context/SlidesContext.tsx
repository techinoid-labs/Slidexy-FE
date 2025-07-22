"use client";
import React, { createContext, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSlides, updateSlide } from "../slice/slidesSlice";
import type { Slide } from "../slice/slidesSlice";
import type { RootState } from "../store/store";

export type SlidesType = Slide[];

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
  setSelectedShapeIndex: (index: number | null) => void;
  tooltip: { visible: boolean; x: number; y: number; node: any | null };
  setTooltip: (tooltip: {
    visible: boolean;
    x: number;
    y: number;
    node: any | null;
  }) => void;
}

const SlidesContext = createContext<SlidesContextType>({
  slides: [],
  setSlides: () => {},
  updateSlides: () => {},
  selectedSlideIndex: 0,
  setSelectedSlideIndex: () => {},
  selectedImage: null,
  setSelectedImage: () => {},
  selectedImageIndex: null,
  setSelectedImageIndex: () => {},
  selectedTextId: null,
  setSelectedTextId: () => {},
  selectedShapeIndex: null,
  setSelectedShapeIndex: () => {},
  tooltip: { visible: false, x: 0, y: 0, node: null },
  setTooltip: () => {},
});

export const SlidesProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const slides = useSelector((state: RootState) => state.slidesData.slides);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<any | null>(
    null
  );
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(
    null
  );
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 50,
    y: 10,
    node: null,
  });

  const handleSetSlides = (newSlides: SlidesType) => {
    dispatch(setSlides(newSlides));
  };

  const handleUpdateSlides = (slides: any) => {
    dispatch(updateSlide(slides));
  };

  return (
    <SlidesContext.Provider
      value={{
        slides,
        setSlides: handleSetSlides,
        // updateSlides: handleUpdateSlides,
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
      }}
    >
      {children}
    </SlidesContext.Provider>
  );
};

export const useSlides = () => useContext(SlidesContext);
