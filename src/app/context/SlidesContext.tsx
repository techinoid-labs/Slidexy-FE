"use client";

import React, { createContext, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSlides } from "../slice/slidesSlice";
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
  removeSlides: () => void;
  selectedSlideIndex: number;
  setSelectedSlideIndex: (index: number) => void;
  selectedImage: any | null;
  selectedImageId: string | null;
  setSelectedImage: (image: any | null) => void;
  selectedImageIndex: number | null;
  setSelectedImageIndex: (index: number | null) => void;
  selectedTextId: string | null;
  setSelectedTextId: (id: string | null) => void;
  setSelectedImageId: (id: string | null) => void;
  selectedShapeId : string | null;
  setSelectedShapeId : (id : string | null) => void ;
  selectedShapeIndex: number | null;
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
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  bringElementForward: (el: any) => void;
  sendElementBackward: (el: any) => void;
  addText: () => void;
}

const SlidesContext = createContext<SlidesContextType>({} as SlidesContextType);

export const SlidesProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const slides = useSelector((state: any) => state.slidesData.slides);

  const [pastSlides, setPastSlides] = useState<SlidesType[]>([]);
  const [futureSlides, setFutureSlides] = useState<SlidesType[]>([]);

  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(
    null
  );
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 50,
    y: 10,
    node: null,
  });
  const [isAtBoundary, setIsAtBoundary] = useState(false);
  const [aiThemes, setAiThemes] = useState<Theme[]>([]);
  const [isMobileImageSelected, setIsMobileImageSelected] = useState(false);

  const deepEqual = (a: any, b: any): boolean => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const handleSetSlides = (newSlides: SlidesType) => {
    if (!deepEqual(slides, newSlides)) {
      setPastSlides((prev) => [...prev, slides]);
      setFutureSlides([]);
      dispatch(setSlides(newSlides));
    }
  };

  const handleDeleteSlides = () => {
    setPastSlides((prev) => [...prev, slides]);
    setFutureSlides([]);
    dispatch(setSlides([]));
  };

  const undo = () => {
    if (pastSlides.length === 0) return;
    const previous = pastSlides[pastSlides.length - 1];
    const newPast = pastSlides.slice(0, -1);
    setPastSlides(newPast);
    setFutureSlides((prev) => [slides, ...prev]);
    dispatch(setSlides(previous));
  };

  const redo = () => {
    if (futureSlides.length === 0) return;
    const next = futureSlides[0];
    const newFuture = futureSlides.slice(1);
    setFutureSlides(newFuture);
    setPastSlides((prev) => [...prev, slides]);
    dispatch(setSlides(next));
  };

  const canUndo = pastSlides.length > 0;
  const canRedo = futureSlides.length > 0;

  const getSelectedElement = (el: number | string) => {
    let selectedElementIndex;

    if (typeof el == "string") {
      selectedElementIndex = el.split("-").at(-1);
    } else {
      selectedElementIndex = el;
    }
    return selectedElementIndex;
  };

  const bringElementForward = (el: any) => {
    console.log("bringElementForward clicked");
    const selectedElementIndex = Number(getSelectedElement(el));
    const currentSlide = slides[selectedSlideIndex];
    if (!currentSlide) return;

    const elements = currentSlide.elements.map((el: any) => ({
      ...el,
      properties: { ...el.properties },
    }));

    const selected = elements[selectedElementIndex];
    if (!selected) return;

    const currentZIndex =
      selected.properties.zIndex || selectedElementIndex || 1;

    if (currentZIndex >= elements.length) return;

    const newZIndex = currentZIndex + 1;

    const conflictIndex = elements.findIndex(
      (el: any) => (el.properties.zIndex || 1) === newZIndex
    );
    if (conflictIndex !== -1) {
      elements[conflictIndex].properties.zIndex = currentZIndex;
    }

    selected.properties.zIndex = newZIndex;

    const updatedSlides = structuredClone(slides);
    updatedSlides[selectedSlideIndex] = {
      ...updatedSlides[selectedSlideIndex],
      elements,
    };

    handleSetSlides(updatedSlides);
  };

  const sendElementBackward = (el: any) => {
    console.log("sendElementBackward clicked");

    const selectedElementIndex = Number(getSelectedElement(el));
    const currentSlide = slides[selectedSlideIndex];
    if (!currentSlide) return;

    const elements = currentSlide.elements.map((el: any) => ({
      ...el,
      properties: { ...el.properties },
    }));

    const selected = elements[selectedElementIndex];
    if (!selected) return;

    const currentZIndex =
      selected.properties.zIndex || selectedElementIndex || 1;

    if (currentZIndex <= 1) return; // Don't go below 1

    const newZIndex = currentZIndex - 1;

    // Find any element with the newZIndex and shift it up
    const conflictIndex = elements.findIndex(
      (el: any) => (el.properties.zIndex ?? 1) === newZIndex
    );
    if (conflictIndex !== -1) {
      elements[conflictIndex].properties.zIndex = currentZIndex;
    }

    selected.properties.zIndex = newZIndex;

    const updatedSlides = structuredClone(slides);
    updatedSlides[selectedSlideIndex] = {
      ...updatedSlides[selectedSlideIndex],
      elements,
    };

    handleSetSlides(updatedSlides);
  };
const addText = (props: any = {}) => {
  const updatedSlides = structuredClone(slides);

  if (!updatedSlides[selectedSlideIndex]) return;

  const newText = {
    konva_component: "Konva.Text",
    element_type: "text", // This is important!
    text: props.text || "New Text",
    properties: {
      fontSize: props.fontSize || 24,
      fontFamily: props.fontFamily || "Arial",
      fontStyle: props.fontStyle || "normal",
      fill: props.fill || "#000000",
      align: props.align || "left",
      x: props.x || 100,
      y: props.y || 100,
      ...props.properties,
    },
    useThemeColor: props.useThemeColor || false,
  };

  updatedSlides[selectedSlideIndex].elements.push(newText);
  handleSetSlides(updatedSlides);
};

  return (
    <SlidesContext.Provider
      value={{
        slides,
        setSlides: handleSetSlides,
        removeSlides: handleDeleteSlides,
        selectedSlideIndex,
        setSelectedSlideIndex,
        selectedImage,
        setSelectedImage,
        selectedImageIndex,
        setSelectedImageIndex,
        selectedTextId,
        setSelectedTextId,
        setSelectedImageId,
        selectedImageId,
        selectedShapeIndex,
        selectedShapeId,
        setSelectedShapeIndex,
        tooltip,
        setTooltip,
        isAtBoundary,
        setIsAtBoundary,
        aiThemes,
        setAiThemes,
        isMobileImageSelected,
        setIsMobileImageSelected,
        undo,
        redo,
        canUndo,
        canRedo,
        bringElementForward,
        sendElementBackward,
        setSelectedShapeId,
        addText,
        
      }}
    >
      {children}
    </SlidesContext.Provider>
  );
};

export const useSlides = () => useContext(SlidesContext);
