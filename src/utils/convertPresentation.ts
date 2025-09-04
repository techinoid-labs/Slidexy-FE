// utils/convertSlides.ts
import { createModernTemplate } from "../app/text-to-template/templates/modernTemplate"
import { createCorporateTemplate } from "../app/text-to-template/templates/corporateTemplate"
import { createCreativeTemplate } from "../app/text-to-template/templates/creativeTemplate"
import { createBoldTemplate } from "../app/text-to-template/templates/boldTemplate"
import type { Presentation } from "../app/text-to-template/types/presentation"

export const convertPresentation = (
  presentation: Presentation,
  selectedTemplate: string
): Presentation => {
  return {
    id: presentation.id,
    meta: presentation.meta,
    slides: presentation.slides.map((backendSlide, index) => {
      switch (selectedTemplate) {
        case "modern":
          return createModernTemplate(backendSlide, index)
        case "corporate":
          return createCorporateTemplate(backendSlide, index)
        case "creative":
          return createCreativeTemplate(backendSlide, index)
        case "bold":
          return createBoldTemplate(backendSlide, index)
        default:
          return createModernTemplate(backendSlide, index)
      }
    }),
  }
}
