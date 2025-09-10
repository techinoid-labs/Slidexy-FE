"use client";

import React, { createContext, useContext, useState } from "react";
import type { Slide } from "@/app/text-to-template/types/presentation";

interface TemplateSlidesContextType {
  slideTemplates: Slide[] | [];
  presentationId: string | null;
  infographicId?: string | null;
  selectedTemplate: string;
  setSlideTemplates: (templates: Slide[]) => void;
  setPresentationId: (id: string) => void;
  setInfographicId: (id: string) => void ;
  setSelectedTemplate: React.Dispatch<
    React.SetStateAction<"modern" | "corporate" | "creative" | "bold">
  >;
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
  const [infographicId, setInfographicId] = useState<string | null>(null); // New state for infographicId
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "corporate" | "creative" | "bold">("modern"); 
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
      infographicId,
      setInfographicId,
      selectedTemplate,
      setSlideTemplates,
      setPresentationId,
      setSelectedTemplate,
      removeTemplates,
      }}
    >
      {children}
    </TemplateSlidesContext.Provider>
  );
};

export const useTemplateSlides = () => useContext(TemplateSlidesContext);