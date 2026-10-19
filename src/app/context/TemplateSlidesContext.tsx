"use client";

import React, { createContext, useContext, useState } from "react";
/**
 * Minimal shape, inlined when the Classic-template system was removed.
 * This context only ever used `Slide` as a type, never at runtime, so it
 * does not need the old template package back.
 */
type Slide = Record<string, any>;

interface TemplateSlidesContextType {
  slideTemplates: Slide[] | [];
  presentationId: string | null;
  infographicId?: string | null;
  selectedTemplate: string;
  setSlideTemplates: (templates: Slide[]) => void;
  setPresentationId: (id: string) => void;
  setInfographicId: (id: string) => void ;
  setSelectedTemplate: React.Dispatch<
    React.SetStateAction<"bold" | "modern" | "corporate" | "creative" | "minimal" | "Vyntra" | "civora" | "fluxera" | "linear" | "retro">
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
  const [selectedTemplate, setSelectedTemplate] = useState<"bold" | "modern" | "corporate" | "creative" | "minimal" | "Vyntra" | "civora" | "fluxera" | "linear" | "retro">("modern"); 
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