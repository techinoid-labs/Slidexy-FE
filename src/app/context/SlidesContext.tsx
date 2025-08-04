// "use client";

// import React, { createContext, useContext, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setSlides } from "../slice/slidesSlice";
// import type { Slide } from "../slice/slidesSlice";

// export type SlidesType = Slide[];
// interface Theme {
//   font: string;
//   primaryColor: string;
//   secondaryColor: string;
//   backgroundColor: string;
//   image_url: string;
// }

// interface SlidesContextType {
//   slides: SlidesType;
//   setSlides: (slides: SlidesType) => void;
//   selectedSlideIndex: number;
//   setSelectedSlideIndex: (index: number) => void;
//   selectedImage: any | null;
//   setSelectedImage: (image: any | null) => void;
//   selectedImageIndex: null | number;
//   setSelectedImageIndex: (index: number | null) => void;
//   selectedTextId: null | string;
//   setSelectedTextId: (id: string | null) => void;
//   selectedShapeIndex: number | null;
//   removeSlides: () => void;
//   setSelectedShapeIndex: (index: number | null) => void;
//   tooltip: { visible: boolean; x: number; y: number; node: any | null };
//   setTooltip: (tooltip: {
//     visible: boolean;
//     x: number;
//     y: number;
//     node: any | null;
//   }) => void;
//   isAtBoundary: boolean;
//   setIsAtBoundary: (value: boolean) => void;
//   aiThemes: any;
//   setAiThemes: any;
//   undo: () => void;
//   redo: () => void;
//   canUndo: boolean;
//   canRedo: boolean;
// }

// const SlidesContext = createContext<SlidesContextType>({} as SlidesContextType);

// export const SlidesProvider = ({ children }: { children: React.ReactNode }) => {
//   const dispatch = useDispatch();
//   const slides = useSelector((state: any) => state.slidesData.slides);

//   const [pastSlides, setPastSlides] = useState<Record<number, Slide[]>>({});
//   const [futureSlides, setFutureSlides] = useState<Record<number, Slide[]>>({});

//   const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
//   const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
//   const [selectedImage, setSelectedImage] = useState<any | null>(null);
//   const [selectedImageIndex, setSelectedImageIndex] = useState<any | null>(
//     null
//   );
//   const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(
//     null
//   );
//   const [tooltip, setTooltip] = useState({
//     visible: false,
//     x: 50,
//     y: 10,
//     node: null,
//   });
//   const [isAtBoundary, setIsAtBoundary] = useState(false);
//   const [aiThemes, setAiThemes] = useState<Theme[]>([]);

//   const handleSetSlides = (newSlides: SlidesType) => {
//     const currentSlide = slides[selectedSlideIndex];
//     const updatedSlide = newSlides[selectedSlideIndex];

//     // If the slide actually changed, then track it
//     if (JSON.stringify(currentSlide) !== JSON.stringify(updatedSlide)) {
//       setPastSlides((prev) => ({
//         ...prev,
//         [selectedSlideIndex]: [
//           ...(prev[selectedSlideIndex] || []),
//           currentSlide,
//         ],
//       }));

//       setFutureSlides((prev) => ({
//         ...prev,
//         [selectedSlideIndex]: [],
//       }));
//     }

//     dispatch(setSlides(newSlides));
//   };

//   const handleDeleteSlides = () => {
//     dispatch(setSlides([]));
//     setPastSlides({});
//     setFutureSlides({});
//   };

//   const undo = () => {
//     const past = pastSlides[selectedSlideIndex];
//     if (!past || past.length === 0) return;

//     const prev = past[past.length - 1];
//     const newPast = past.slice(0, -1);

//     setFutureSlides((prev) => ({
//       ...prev,
//       [selectedSlideIndex]: [
//         slides[selectedSlideIndex],
//         ...(prev[selectedSlideIndex] || []),
//       ],
//     }));

//     setPastSlides((prev) => ({
//       ...prev,
//       [selectedSlideIndex]: newPast,
//     }));

//     const newSlides = [...slides];
//     newSlides[selectedSlideIndex] = prev;
//     dispatch(setSlides(newSlides));
//   };

//   const redo = () => {
//     const future = futureSlides[selectedSlideIndex];
//     if (!future || future.length === 0) return;

//     const next = future[0];
//     const newFuture = future.slice(1);

//     setPastSlides((prev) => ({
//       ...prev,
//       [selectedSlideIndex]: [
//         ...(prev[selectedSlideIndex] || []),
//         slides[selectedSlideIndex],
//       ],
//     }));

//     setFutureSlides((prev) => ({
//       ...prev,
//       [selectedSlideIndex]: newFuture,
//     }));

//     const newSlides = [...slides];
//     newSlides[selectedSlideIndex] = next;
//     dispatch(setSlides(newSlides));
//   };

//   const canUndo = pastSlides[selectedSlideIndex]?.length > 0;
//   const canRedo = futureSlides[selectedSlideIndex]?.length > 0;
//   console.log({ slides, pastSlides, futureSlides, canUndo, canRedo });
//   return (
//     <SlidesContext.Provider
//       value={{
//         slides,
//         setSlides: handleSetSlides,
//         removeSlides: handleDeleteSlides,
//         selectedSlideIndex,
//         setSelectedSlideIndex,
//         selectedImage,
//         setSelectedImage,
//         selectedImageIndex,
//         setSelectedImageIndex,
//         selectedTextId,
//         setSelectedTextId,
//         selectedShapeIndex,
//         setSelectedShapeIndex,
//         tooltip,
//         setTooltip,
//         isAtBoundary,
//         setIsAtBoundary,
//         aiThemes,
//         setAiThemes,
//         undo,
//         redo,
//         canUndo,
//         canRedo,
//       }}
//     >
//       {children}
//     </SlidesContext.Provider>
//   );
// };

// export const useSlides = () => useContext(SlidesContext);

"use client";

import React, { createContext, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSlides } from "../slice/slidesSlice";
import type { Slide } from "../slice/slidesSlice";

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
  isAtBoundary: boolean;
  setIsAtBoundary: (value: boolean) => void;
  aiThemes: any;
  setAiThemes: any;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const SlidesContext = createContext<SlidesContextType>({} as SlidesContextType);

export const SlidesProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const slides = useSelector((state: any) => state.slidesData.slides);

  const [pastSlides, setPastSlides] = useState<SlidesType[]>([]);
  const [futureSlides, setFutureSlides] = useState<SlidesType[]>([]);

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
  const [isAtBoundary, setIsAtBoundary] = useState(false);
  const [aiThemes, setAiThemes] = useState<Theme[]>([]);

  const deepEqual = (a: any, b: any): boolean => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // const handleSetSlides = (newSlides: SlidesType) => {
  //   if (JSON.stringify(slides) !== JSON.stringify(newSlides)) {
  //     setPastSlides((prev) => [...prev, slides]);
  //     setFutureSlides([]); // clear redo on new action
  //   }

  //   dispatch(setSlides(newSlides));
  // };

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
  console.log({ slides, pastSlides, futureSlides, canRedo, canUndo });
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
        selectedShapeIndex,
        setSelectedShapeIndex,
        tooltip,
        setTooltip,
        isAtBoundary,
        setIsAtBoundary,
        aiThemes,
        setAiThemes,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </SlidesContext.Provider>
  );
};

export const useSlides = () => useContext(SlidesContext);
