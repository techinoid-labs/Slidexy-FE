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
  selectedImage: any | null;
  setSelectedImage: (image: any | null) => void;
  selectedImageIndex: null | number;
  setSelectedImageIndex: (index: number | null) => void;
  selectedTextId: null | string;
  setSelectedTextId: (id: string | null) => void;
}

const SlidesContext = createContext<SlidesContextType>({
  slides: [],
  setSlides: () => {},
  selectedSlideIndex: 0,
  setSelectedSlideIndex: () => {},
  selectedImage: null,
  setSelectedImage: () => {},
  selectedImageIndex: null,
  setSelectedImageIndex: () => {},
  selectedTextId: null,
  setSelectedTextId: () => {},
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
        selectedImage,
        setSelectedImage,
        selectedImageIndex,
        setSelectedImageIndex,
        selectedTextId,
        setSelectedTextId,
      }}
    >
      {children}
    </SlidesContext.Provider>
  );
};

export const useSlides = () => useContext(SlidesContext);
