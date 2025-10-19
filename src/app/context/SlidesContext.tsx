"use client";

import React, { createContext, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSlides } from "../slice/slidesSlice";
import type { Slide, KonvaComponent } from "../slice/slidesSlice";
import type { RootState } from "../store/store";

export type SlidesType = Slide[];

export type { KonvaComponent } from "../slice/slidesSlice";

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
  selectedImage: KonvaComponent | null;
  selectedImageId: string | null;
  setSelectedImage: (image: KonvaComponent | null) => void;
  selectedImageIndex: number | null;
  setSelectedImageIndex: (index: number | null) => void;
  selectedTextId: string | null;
  setSelectedTextId: (id: string | null) => void;
  setSelectedImageId: (id: string | null) => void;
  selectedShapeId: string | null;
  setSelectedShapeId: (id: string | null) => void;
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
  bringElementForward: (el: number | string | KonvaComponent) => void;
  sendElementBackward: (el: number | string | KonvaComponent) => void;
  addText: (props?: any) => void;
}

const SlidesContext = createContext<SlidesContextType>({} as SlidesContextType);

export const SlidesProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const slides = useSelector(
    (state: RootState) => state.slidesData?.slides || []
  );

  const [pastSlides, setPastSlides] = useState<SlidesType[]>([]);
  const [futureSlides, setFutureSlides] = useState<SlidesType[]>([]);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<KonvaComponent | null>(
    null
  );
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
    // console.log(
    //   "[SlidesContext] handleSetSlides called with newSlides:",
    //   newSlides
    // );

    if (!deepEqual(slides, newSlides)) {
      console.log(
        "[SlidesContext] State changed, updating pastSlides and dispatching new slides"
      );
      setPastSlides((prev) => {
        const newPast = [...prev, structuredClone(slides)];
        console.log("[SlidesContext] Updated pastSlides:", newPast);
        return newPast;
      });
      setFutureSlides([]);
      dispatch(setSlides(newSlides));
    } else {
      console.log("[SlidesContext] No state change detected");
    }
  };

  const handleDeleteSlides = () => {
    console.log("[SlidesContext] handleDeleteSlides called");
    setPastSlides((prev) => {
      const newPast = [...prev, structuredClone(slides)];
      console.log("[SlidesContext] Updated pastSlides for delete:", newPast);
      return newPast;
    });
    setFutureSlides([]);
    dispatch(setSlides([]));
  };

  const undo = () => {
    if (pastSlides.length === 0) {
      console.log("[SlidesContext] Cannot undo, pastSlides is empty");
      return;
    }
    const previous = pastSlides[pastSlides.length - 1];
    const newPast = pastSlides.slice(0, -1);
    setPastSlides(newPast);
    setFutureSlides((prev) => [structuredClone(slides), ...prev]);
    dispatch(setSlides(previous));

    // Clear all selections on undo
    setSelectedImageId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setSelectedShapeId(null);
    setSelectedShapeIndex(null);
    setSelectedTextId(null);

    console.log("[SlidesContext] Undo performed, restored state:", previous);
    console.log("[SlidesContext] New pastSlides:", newPast);
    console.log("[SlidesContext] New futureSlides:", [
      structuredClone(slides),
      ...futureSlides,
    ]);
  };

  const redo = () => {
    if (futureSlides.length === 0) {
      console.log("[SlidesContext] Cannot redo, futureSlides is empty");
      return;
    }
    const next = futureSlides[0];
    const newFuture = futureSlides.slice(1);
    setFutureSlides(newFuture);
    setPastSlides((prev) => {
      const newPast = [...prev, structuredClone(slides)];
      console.log("[SlidesContext] Updated pastSlides for redo:", newPast);
      return newPast;
    });
    dispatch(setSlides(next));

    // Clear all selections on redo
    setSelectedImageId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setSelectedShapeId(null);
    setSelectedShapeIndex(null);
    setSelectedTextId(null);

    console.log("[SlidesContext] Redo performed, restored state:", next);
    console.log("[SlidesContext] New futureSlides:", newFuture);
  };

  const canUndo = pastSlides.length > 0;
  const canRedo = futureSlides.length > 0;

  const getSelectedElement = (el: number | string) => {
    let selectedElementIndex;
    if (typeof el === "string") {
      selectedElementIndex = el.split("-").at(-1);
    } else {
      selectedElementIndex = el;
    }
    return Number(selectedElementIndex);
  };

  const isImageElement = (element: KonvaComponent): boolean => {
    return (
      element.element_type === "image" ||
      element.konva_component === "Konva.Image" ||
      element.type === "image"
    );
  };

  const isTextElement = (element: KonvaComponent): boolean => {
    return (
      element.element_type === "text" ||
      element.konva_component === "Konva.Text" ||
      element.type === "text"
    );
  };

  const isShapeElement = (element: KonvaComponent): boolean => {
    return (
      element.element_type === "shape" ||
      element.konva_component?.includes("Rect") ||
      element.konva_component?.includes("Circle") ||
      element.konva_component?.includes("Ellipse") ||
      element.konva_component?.includes("Line") ||
      element.konva_component?.includes("Arrow") ||
      element.konva_component?.includes("Star") ||
      element.konva_component?.includes("Ring") ||
      element.konva_component?.includes("Arc") ||
      element.konva_component?.includes("Wedge") ||
      element.konva_component?.includes("Path") ||
      element.type === "shape"
    );
  };

  const Z_INDEX_RANGES = {
    IMAGES: { START: 1, END: 99 },
    SHAPES: { START: 100, END: 199 },
    TEXT: { START: 200, END: 299 },
    OTHERS: { START: 300, END: 399 },
  };

  const assignZIndexToElements = (
    elements: KonvaComponent[],
    baseZIndex: number
  ) => {
    elements.forEach((element, index) => {
      if (!element.properties) {
        element.properties = {} as any;
      }
      element.properties.zIndex = baseZIndex + index;
    });
  };

  function findElementById(
    elements: KonvaComponent[],
    id: string
  ): { element: KonvaComponent; index: number } | null {
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];

      if (el.id && el.id === id) {
        return { element: el, index: i };
      }

      if (el.shape_id && el.shape_id === id) {
        return { element: el, index: i };
      }

      if (el.properties && (el.properties as any).image_id === id) {
        return { element: el, index: i };
      }
    }
    return null;
  }

  const bringElementForward = (el: number | string | KonvaComponent) => {
    console.log("bringElementForward clicked", el);

    let selectedElement: KonvaComponent | null = null;
    const currentSlide = slides[selectedSlideIndex];
    if (!currentSlide) return;

    const elements = currentSlide.elements.map((el: KonvaComponent) => ({
      ...el,
      properties: { ...el.properties },
    }));

    if (typeof el === "number") {
      selectedElement = elements[el];
    } else if (typeof el === "string") {
      const found = findElementById(elements, el);
      selectedElement = found ? found.element : null;
    } else {
      if (selectedTextId) {
        const found = findElementById(elements, selectedTextId);
        selectedElement = found ? found.element : null;
      } else if (selectedImageId) {
        const found = findElementById(elements, selectedImageId);
        selectedElement = found ? found.element : null;
      } else if (selectedShapeId) {
        const found = findElementById(elements, selectedShapeId);
        selectedElement = found ? found.element : null;
      } else {
        console.warn("No element selected for forward operation");
        return;
      }
    }

    if (!selectedElement) {
      console.warn("Selected element not found");
      return;
    }

    const imageElements = elements.filter(isImageElement);
    const textElements = elements.filter(isTextElement);
    const shapeElements = elements.filter(isShapeElement);
    const otherElements = elements.filter(
      (el: KonvaComponent) =>
        !isImageElement(el) && !isTextElement(el) && !isShapeElement(el)
    );

    if (isImageElement(selectedElement)) {
      assignZIndexToElements(imageElements, Z_INDEX_RANGES.IMAGES.START);
      assignZIndexToElements(shapeElements, Z_INDEX_RANGES.SHAPES.START);
      assignZIndexToElements(textElements, Z_INDEX_RANGES.TEXT.START);
    } else if (isTextElement(selectedElement)) {
      assignZIndexToElements(imageElements, Z_INDEX_RANGES.IMAGES.START);
      assignZIndexToElements(shapeElements, Z_INDEX_RANGES.SHAPES.START);
      assignZIndexToElements(textElements, Z_INDEX_RANGES.TEXT.START);
    } else if (isShapeElement(selectedElement)) {
      assignZIndexToElements(imageElements, Z_INDEX_RANGES.IMAGES.START);
      assignZIndexToElements(shapeElements, Z_INDEX_RANGES.SHAPES.START);
      assignZIndexToElements(textElements, Z_INDEX_RANGES.TEXT.START);
    } else {
      const currentZIndex = selectedElement.properties?.zIndex || 1;
      const maxZIndex = Math.max(
        ...elements.map((el: KonvaComponent) => el.properties?.zIndex || 1)
      );
      if (currentZIndex < maxZIndex) {
        selectedElement.properties.zIndex = maxZIndex + 1;
      }
    }

    assignZIndexToElements(otherElements, Z_INDEX_RANGES.OTHERS.START);

    const updatedSlides = structuredClone(slides);
    updatedSlides[selectedSlideIndex] = {
      ...updatedSlides[selectedSlideIndex],
      elements,
    };

    handleSetSlides(updatedSlides);
  };

  const sendElementBackward = (el: number | string | KonvaComponent) => {
    console.log("sendElementBackward clicked", el);

    let selectedElement: KonvaComponent | null = null;
    const currentSlide = slides[selectedSlideIndex];
    if (!currentSlide || !currentSlide.elements) return;

    const elements = currentSlide.elements.map((el: KonvaComponent) => ({
      ...el,
      properties: { ...el.properties },
    }));

    if (typeof el === "number") {
      selectedElement = elements[el];
    } else if (typeof el === "string") {
      const found = findElementById(elements, el);
      selectedElement = found ? found.element : null;
    } else {
      if (selectedImageId) {
        const found = findElementById(elements, selectedImageId);
        selectedElement = found ? found.element : null;
      } else if (selectedShapeId) {
        const found = findElementById(elements, selectedShapeId);
        selectedElement = found ? found.element : null;
      } else if (selectedTextId) {
        const found = findElementById(elements, selectedTextId);
        selectedElement = found ? found.element : null;
      } else {
        console.warn("No element selected for backward operation");
        return;
      }
    }

    if (!selectedElement) {
      console.warn("Selected element not found");
      return;
    }

    const imageElements = elements.filter(isImageElement);
    const textElements = elements.filter(isTextElement);
    const shapeElements = elements.filter(isShapeElement);
    const otherElements = elements.filter(
      (el: KonvaComponent) =>
        !isImageElement(el) && !isTextElement(el) && !isShapeElement(el)
    );

    if (isImageElement(selectedElement)) {
      assignZIndexToElements(textElements, Z_INDEX_RANGES.IMAGES.START);
      assignZIndexToElements(shapeElements, Z_INDEX_RANGES.SHAPES.START);
      assignZIndexToElements(imageElements, Z_INDEX_RANGES.TEXT.START);
    } else if (isTextElement(selectedElement)) {
      assignZIndexToElements(textElements, Z_INDEX_RANGES.IMAGES.START);
      assignZIndexToElements(shapeElements, Z_INDEX_RANGES.SHAPES.START);
      assignZIndexToElements(imageElements, Z_INDEX_RANGES.TEXT.START);
    } else if (isShapeElement(selectedElement)) {
      assignZIndexToElements(shapeElements, Z_INDEX_RANGES.IMAGES.START);
      assignZIndexToElements(imageElements, Z_INDEX_RANGES.SHAPES.START);
      assignZIndexToElements(textElements, Z_INDEX_RANGES.TEXT.START);
    } else {
      const currentZIndex = selectedElement.properties?.zIndex || 1;
      if (currentZIndex > 1) {
        selectedElement.properties.zIndex = Math.max(1, currentZIndex - 1);
      }
    }

    assignZIndexToElements(otherElements, Z_INDEX_RANGES.OTHERS.START);

    const updatedSlides = structuredClone(slides);
    updatedSlides[selectedSlideIndex] = {
      ...updatedSlides[selectedSlideIndex],
      elements,
    };

    handleSetSlides(updatedSlides);
  };

  const addText = (props?: any) => {
    console.log("addText called with props:", props);
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
        setSelectedShapeId,
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
        addText,
      }}
    >
      {children}
    </SlidesContext.Provider>
  );
};

export const useSlides = () => useContext(SlidesContext);
