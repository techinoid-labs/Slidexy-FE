"use client";

import React, { createContext, useContext, useState } from "react";
import type { Slide } from "@/app/text-to-template/types/presentation";

interface TemplateSlidesContextType {
  slideTemplates: Slide[] | [];
  presentationId: string | null; 
  setSlideTemplates: (templates: Slide[]) => void;
  setPresentationId: (id: string) => void;
  removeTemplates: () => void;
}

const TemplateSlidesContext = createContext<TemplateSlidesContextType>(
  {} as TemplateSlidesContextType
);

export const TemplateSlidesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [slideTemplates, setSlideTemplatesState] = useState<Slide[]>([]);
  const [presentationId, setPresentationIdState] = useState<string | null>(null); // Initialize presentationId

  const setSlideTemplates = (templates: Slide[]) => {
    setSlideTemplatesState(templates);
  };

  const setPresentationId = (id: string) => {
    setPresentationIdState(id);
  };

  const removeTemplates = () => {
    setSlideTemplatesState([]);
    setPresentationIdState(null); 
  };

  return (
    <TemplateSlidesContext.Provider
      value={{
        slideTemplates,
        presentationId, 
        setSlideTemplates,
        setPresentationId, 
        removeTemplates,
      }}
    >
      {children}
    </TemplateSlidesContext.Provider>
  );
};

export const useTemplateSlides = () => useContext(TemplateSlidesContext);