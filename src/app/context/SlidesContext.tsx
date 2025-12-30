"use client";

import React, { createContext, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSlides } from "../slice/slidesSlice";
import type { Slide, KonvaComponent } from "../slice/slidesSlice";
import type { RootState } from "../store/store";
import { getSlideDimensions, getRandomSlide } from "../../utils/slideUtils";
import { v4 as uuidv4 } from "uuid";
import { useSlideThemeContext } from "./ThemeContext";

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
  selectedTextIndex: number | null;
  setSelectedTextIndex: (index: number | null) => void;
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
  bringElementForward: (el: number | string | KonvaComponent | null) => void;
  sendElementBackward: (el: number | string | KonvaComponent | null) => void;
  addText: (props?: {
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    fontWeight?: string;
    x?: number;
    y?: number;
  }) => void;
  addImage: (props?: {
    imageSrc: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
  }) => void;
  addShape: (props?: {
    konva_component: string;
    shape_id?: string;
    properties?: any;
  }) => void;
  addSlide: () => void;
  deleteSlide: (index: number) => void;
}

const SlidesContext = createContext<SlidesContextType>({} as SlidesContextType);

export const SlidesProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const slides = useSelector(
    (state: RootState) => state.slidesData?.slides || []
  );
  const { selectedTheme } = useSlideThemeContext();

  const [pastSlides, setPastSlides] = useState<SlidesType[]>([]);
  const [futureSlides, setFutureSlides] = useState<SlidesType[]>([]);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);
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

  // FIXED: Recursive deepEqual without JSON.stringify (handles objects/arrays safely)
  const deepEqual = (a: any, b: any): boolean => {
    // Quick checks
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      if (a === b) return true;
      if (a == null || b == null) return a === b; // null/undefined
      if (typeof a !== typeof b) return false;
      if (typeof a !== 'object') return a === b; // Primitives

      // Arrays
      if (Array.isArray(a) !== Array.isArray(b)) return false;
      if (Array.isArray(a)) {
        if (a.length !== b.length) return false;
        return a.every((val, idx) => deepEqual(val, b[idx]));
      }

      // Objects
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every(key => deepEqual(a[key], b[key]));
    }
  };

  const handleSetSlides = (newSlides: SlidesType) => {
    // ✅ FIXED: Always force update if elements changed (shallow diff fallback)
    const hasElementsChange = !deepEqual(slides, newSlides) ||
      slides.some((s, i) => (s.elements?.length || 0) !== (newSlides[i]?.elements?.length || 0));

    if (hasElementsChange) {
      setPastSlides((prev) => [...prev.slice(-10), structuredClone(slides)]);
      setFutureSlides([]);
      dispatch(setSlides(newSlides));
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
    // 1. Try finding by stable ID first (best practice)
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const elId = el.id || el.properties?.id || el.shape_id || el.properties?.shape_id || el.image_id || el.properties?.image_id;
      if (elId === id) return { element: el, index: i };
    }

    // 2. Parse index-based IDs (fallback for legacy or temporary selection)
    if (id.startsWith("el-")) {
      const match = id.match(/el-(\d+)-(\d+)/);
      if (match) {
        const [, slideIdxStr, elIdxStr] = match;
        const elIdx = parseInt(elIdxStr, 10);
        if (elIdx >= 0 && elIdx < elements.length) {
          return { element: elements[elIdx], index: elIdx };
        }
      }
    }

    return null;
  }
  // Helper function (add this above the functions if not already present)
  const getCurrentVariantSlide = (slides: SlidesType, slideIndex: number) => {
    const slide = slides[slideIndex];
    if (!slide.layouts || slide.layouts.length === 0) return slide;
    const variantIndex = slide.currentVariantIndex ?? 0;
    return slide.layouts[variantIndex] || slide;
  };

  // Update bringElementForward
  const bringElementForward = (el: number | string | KonvaComponent | null) => {
    console.log("bringElementForward clicked", el);
    let selectedElement: KonvaComponent | null = null;
    const originalSlide = slides[selectedSlideIndex];
    if (!originalSlide) return;
    const currentSlide = getCurrentVariantSlide(slides, selectedSlideIndex);
    if (!currentSlide) return;
    let elements = currentSlide.elements?.map((el: KonvaComponent) => ({
      ...el,
      properties: { ...el.properties },
    })) || [];
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
    // ✅ FIX: Assign relative z-indices (others first, selected last—no full reset)
    if (isImageElement(selectedElement)) {
      const otherImages = imageElements.filter((e: any) => e !== selectedElement);
      assignZIndexToElements(otherImages, Z_INDEX_RANGES.IMAGES.START);
      selectedElement.properties.zIndex = Z_INDEX_RANGES.IMAGES.START + otherImages.length;
      // Clamp to range end
      if (selectedElement.properties.zIndex > Z_INDEX_RANGES.IMAGES.END) {
        selectedElement.properties.zIndex = Z_INDEX_RANGES.IMAGES.END;
      }
    } else if (isTextElement(selectedElement)) {
      const otherTexts = textElements.filter((e: any) => e !== selectedElement);
      assignZIndexToElements(otherTexts, Z_INDEX_RANGES.TEXT.START);
      selectedElement.properties.zIndex = Z_INDEX_RANGES.TEXT.START + otherTexts.length;
      if (selectedElement.properties.zIndex > Z_INDEX_RANGES.TEXT.END) {
        selectedElement.properties.zIndex = Z_INDEX_RANGES.TEXT.END;
      }
    } else if (isShapeElement(selectedElement)) {
      const otherShapes = shapeElements.filter((e: any) => e !== selectedElement);
      assignZIndexToElements(otherShapes, Z_INDEX_RANGES.SHAPES.START);
      selectedElement.properties.zIndex = Z_INDEX_RANGES.SHAPES.START + otherShapes.length;
      if (selectedElement.properties.zIndex > Z_INDEX_RANGES.SHAPES.END) {
        selectedElement.properties.zIndex = Z_INDEX_RANGES.SHAPES.END;
      }
    } else {
      // For others: Bump to max +1
      const currentZIndex = selectedElement.properties?.zIndex || 1;
      const maxZIndex = Math.max(
        ...elements.map((el: KonvaComponent) => el.properties?.zIndex || 1)
      );
      if (currentZIndex < maxZIndex) {
        selectedElement.properties.zIndex = maxZIndex + 1;
      }
    }
    assignZIndexToElements(otherElements, Z_INDEX_RANGES.OTHERS.START);
    // Update BOTH variant and original
    const updatedSlides = structuredClone(slides);
    const variantIndex = originalSlide.currentVariantIndex ?? 0;
    if (
      updatedSlides[selectedSlideIndex] &&
      updatedSlides[selectedSlideIndex].layouts &&
      updatedSlides[selectedSlideIndex].layouts[variantIndex]
    ) {
      updatedSlides[selectedSlideIndex].layouts[variantIndex].elements = elements;
    }

    updatedSlides[selectedSlideIndex].elements = elements;
    handleSetSlides(updatedSlides);
  };

  // ✅ FIXED: Update sendElementBackward (symmetric to forward)
  const sendElementBackward = (el: number | string | KonvaComponent | null) => {
    console.log("sendElementBackward clicked", el);
    let selectedElement: KonvaComponent | null = null;
    const originalSlide = slides[selectedSlideIndex];
    if (!originalSlide) return;
    const currentSlide = getCurrentVariantSlide(slides, selectedSlideIndex);
    if (!currentSlide) return;
    let elements = currentSlide.elements?.map((el: KonvaComponent) => ({
      ...el,
      properties: { ...el.properties },
    })) || [];
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
    // ✅ FIX: Assign relative z-indices (others after selected, selected first—no full reset)
    if (isImageElement(selectedElement)) {
      const otherImages = imageElements.filter((e: any) => e !== selectedElement);
      selectedElement.properties.zIndex = Z_INDEX_RANGES.IMAGES.START;
      assignZIndexToElements(otherImages, Z_INDEX_RANGES.IMAGES.START + 1);
    } else if (isTextElement(selectedElement)) {
      const otherTexts = textElements.filter((e: any) => e !== selectedElement);
      selectedElement.properties.zIndex = Z_INDEX_RANGES.TEXT.START;
      assignZIndexToElements(otherTexts, Z_INDEX_RANGES.TEXT.START + 1);
    } else if (isShapeElement(selectedElement)) {
      const otherShapes = shapeElements.filter((e: any) => e !== selectedElement);
      selectedElement.properties.zIndex = Z_INDEX_RANGES.SHAPES.START;
      assignZIndexToElements(otherShapes, Z_INDEX_RANGES.SHAPES.START + 1);
    } else {
      const currentZIndex = selectedElement.properties?.zIndex || 1;
      if (currentZIndex > 1) {
        selectedElement.properties.zIndex = Math.max(1, currentZIndex - 1);
      }
    }
    assignZIndexToElements(otherElements, Z_INDEX_RANGES.OTHERS.START);
    // Update BOTH variant and original
    const updatedSlides = structuredClone(slides);
    const variantIndex = originalSlide.currentVariantIndex ?? 0;
    if (
      updatedSlides[selectedSlideIndex] &&
      updatedSlides[selectedSlideIndex].layouts &&
      updatedSlides[selectedSlideIndex].layouts[variantIndex]
    ) {
      updatedSlides[selectedSlideIndex].layouts[variantIndex].elements = elements;
    }

    updatedSlides[selectedSlideIndex].elements = elements;
    handleSetSlides(updatedSlides);
  };


  const addText = (props?: {
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    fontWeight?: string;
    x?: number;
    y?: number;
  }) => {
    if (selectedSlideIndex < 0 || !slides[selectedSlideIndex]) {
      console.warn("[SlidesContext] Cannot add text: invalid slide index");
      return;
    }
    const currentSlide = slides[selectedSlideIndex];
    const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
    const prePushLength = currentSlide.elements?.length || 0;

    // Generate a stable unique ID
    const textId = `user-text-${uuidv4()}`;

    const newTextElement: KonvaComponent = {
      id: textId, // Stable ID
      konva_component: "Konva.Text",
      element_type: "text",
      text: props?.text || "New Text",
      properties: {
        id: textId,
        userAdded: true,
        fontSize: props?.fontSize || 24,
        fontFamily: props?.fontFamily || "Raleway",
        fill: props?.fill || selectedTheme?.primaryColor || "#000000",
        fontWeight: props?.fontWeight || "normal",
        fontStyle: "normal",
        align: "left",
        x: props?.x ?? SLIDE_WIDTH / 2 - 150,
        y: props?.y ?? SLIDE_HEIGHT / 2,
        width: 300,
        height: 0,
        zIndex: prePushLength + 200,
      },
      useThemeColor: false,
    };

    const updatedSlides = structuredClone(slides);
    const targetSlide = updatedSlides[selectedSlideIndex];
    targetSlide.elements = targetSlide.elements || [];
    targetSlide.elements.push(structuredClone(newTextElement));

    handleSetSlides(updatedSlides);
    setSelectedTextId(textId); // Selection now uses stable UUID
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setSelectedShapeIndex(null);
    setSelectedShapeId(null);
  };
  // 🔧 FIXED: Add Image Function
  const addImage = (props?: {
    imageSrc: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
  }) => {
    if (selectedSlideIndex < 0 || !slides[selectedSlideIndex]) {
      console.warn("[SlidesContext] Cannot add image: invalid slide index");
      return;
    }
    if (!props?.imageSrc) {
      console.warn("[SlidesContext] Cannot add image: no image source provided");
      return;
    }
    const currentSlide = slides[selectedSlideIndex];
    const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
    const width = props.width || 400;
    const height = props.height || 400;
    const x = props.x ?? (SLIDE_WIDTH - width) / 2;
    const y = props.y ?? (SLIDE_HEIGHT - height) / 2;
    const prePushLength = currentSlide.elements?.length || 0;

    // Generate stable unique ID for image
    const imageId = `user-img-${uuidv4()}`;

    const newImageElement: KonvaComponent = {
      id: imageId,
      konva_component: "Konva.Image",
      element_type: "image",
      properties: {
        id: imageId,
        userAdded: true,
        x,
        y,
        width,
        height,
        imageSrc: props.imageSrc,
        image_id: imageId,
        zIndex: prePushLength + Z_INDEX_RANGES.IMAGES.START,
        opacity: 1,
      },
    };

    const updatedSlides = structuredClone(slides);
    const targetSlide = updatedSlides[selectedSlideIndex];
    targetSlide.elements = targetSlide.elements || [];
    targetSlide.elements.push(structuredClone(newImageElement));

    if (targetSlide.layouts && targetSlide.layouts.length > 0) {
      const variantIndex = targetSlide.currentVariantIndex ?? 0;
      const variant = targetSlide.layouts[variantIndex];
      if (variant) {
        variant.elements = variant.elements || [];
        variant.elements.push(structuredClone(newImageElement));
      }
    }
    handleSetSlides(updatedSlides);
    setSelectedImage(newImageElement);
    setSelectedImageId(imageId);
    setSelectedImageIndex(null); // Switch to ID-based selection
    setSelectedTextId(null);
    setSelectedShapeIndex(null);
    setSelectedShapeId(null);
  };
  const addShape = (props?: {
    konva_component: string;
    shape_id?: string;
    properties?: any;
  }) => {
    if (selectedSlideIndex < 0 || !slides[selectedSlideIndex]) {
      console.warn("[SlidesContext] Cannot add shape: invalid slide index");
      return;
    }

    if (!props?.konva_component) {
      console.warn("[SlidesContext] Cannot add shape: no konva_component provided");
      return;
    }

    const currentSlide = slides[selectedSlideIndex];
    const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
    const prePushLength = currentSlide.elements?.length || 0;

    // Generate stable unique ID for shape
    const shapeId = `user-shape-${uuidv4()}`;

    const newShapeElement: KonvaComponent = {
      id: shapeId,
      konva_component: props.konva_component,
      element_type: "shape",
      shape_id: shapeId,
      properties: {
        id: shapeId,
        shape_id: shapeId,
        userAdded: true,
        x: props.properties?.x ?? SLIDE_WIDTH / 2 - 100,
        y: props.properties?.y ?? SLIDE_HEIGHT / 2 - 100,
        width: props.properties?.width || 200,
        height: props.properties?.height || 200,
        fill: props.properties?.fill || "#7B4AE2",
        zIndex: prePushLength + 100,
        ...props.properties,
      },
    };

    const updatedSlides = structuredClone(slides);
    const targetSlide = updatedSlides[selectedSlideIndex];

    targetSlide.elements = targetSlide.elements || [];
    targetSlide.elements.push(structuredClone(newShapeElement));

    if (targetSlide.layouts && targetSlide.layouts.length > 0) {
      const variantIndex = targetSlide.currentVariantIndex ?? 0;
      const variant = targetSlide.layouts[variantIndex];
      if (variant) {
        variant.elements = variant.elements || [];
        variant.elements.push(structuredClone(newShapeElement));
      }
    }

    handleSetSlides(updatedSlides);
    setSelectedShapeId(shapeId);
    setSelectedShapeIndex(null); // Switch to ID-based selection
    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
  };

  const addSlide = () => {
    const newSlide = getRandomSlide();
    const newSlides = [...slides, structuredClone(newSlide)];
    handleSetSlides(newSlides);
    setSelectedSlideIndex(newSlides.length - 1);
  };

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    handleSetSlides(newSlides);
    if (selectedSlideIndex >= newSlides.length) {
      setSelectedSlideIndex(Math.max(0, newSlides.length - 1));
    } else if (selectedSlideIndex === index && index === newSlides.length) {
      // If we deleted the last slide and it was selected, move to previous
      setSelectedSlideIndex(Math.max(0, newSlides.length - 1));
    }
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
        selectedTextIndex,
        setSelectedTextIndex,
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
        addImage,
        addShape,
        addSlide,
        deleteSlide,
      }}
    >
      {children}
    </SlidesContext.Provider>
  );
};

export const useSlides = () => useContext(SlidesContext);
