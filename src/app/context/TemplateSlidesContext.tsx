"use client";

import React, { createContext, useContext, useState } from "react";
import type { Slide, Presentation } from "@/app/text-to-template/types";

interface TemplateSlidesContextType {
  slideTemplates: Slide[] | [];
  setSlideTemplates: (templates: Slide[]) => void;
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

  const setSlideTemplates = (templates: Slide[]) => {
    setSlideTemplatesState(templates);
  };

  const removeTemplates = () => {
    setSlideTemplatesState([]);
  };

  return (
    <TemplateSlidesContext.Provider
      value={{
        slideTemplates,
        setSlideTemplates,
        removeTemplates,
      }}
    >
      {children}
    </TemplateSlidesContext.Provider>
  );
};

export const useTemplateSlides = () => useContext(TemplateSlidesContext);
