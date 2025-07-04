"use client";
import React, { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSlides } from "../slice/slidesSlice";
import type { Slide } from "../slice/slidesSlice";
import type { RootState } from "../store/store"; // Assuming you have a typed RootState
// import React, { createContext, useContext, useState, useEffect } from "react";

// Use proper typing
export type SlidesType = Slide[];

const SlidesContext = createContext<{
  slides: SlidesType;
  setSlides: (slides: SlidesType) => void;
}>({
  slides: [],
  setSlides: () => {},
});

export const SlidesProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  // ✅ Directly use Redux state
  const slides = useSelector((state: RootState) => state.slidesData.slides);

  const handleSetSlides = (newSlides: SlidesType) => {
    // console.log("[SlidesContext] Setting slides via Redux:", newSlides);
    dispatch(setSlides(newSlides));
  };

  console.log("Slides Data:", slides);

  // const setSlides = (slides: SlidesType) => {
  //   console.log("[SlidesContext] Setting slides:", slides);
  //   setSlidesState(slides);
  // };

  // useEffect(() => {
  //   console.log("[SlidesContext] Current slides:", slides);
  // }, [slides]);

  return (
    <SlidesContext.Provider value={{ slides, setSlides: handleSetSlides }}>
      {children}
    </SlidesContext.Provider>
  );
};

export const useSlides = () => useContext(SlidesContext);
