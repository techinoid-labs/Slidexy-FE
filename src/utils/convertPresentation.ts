// utils/convertSlides.ts
import { createModernTemplate } from "../app/text-to-template/templates/modernTemplate"
import { createCorporateTemplate } from "../app/text-to-template/templates/corporateTemplate"
import { createCreativeTemplate } from "../app/text-to-template/templates/creativeTemplate"
import { createBoldTemplate } from "../app/text-to-template/templates/boldTemplate"
import { createMinimalistTemplate } from "../app/text-to-template/templates/minimalTemplate"
import { createVyntraTemplate } from "@/app/text-to-template/templates/vyntraTemplate"
import {createCivoraTemplate} from "@/app/text-to-template/templates/civoraTemplate"
import { createFluxeraTemplate } from "@/app/text-to-template/templates/fluxeraTemplate"
import { createLinearTemplate } from "@/app/text-to-template/templates/linearTemplate"
import { createRetroTemplate } from "@/app/text-to-template/templates/retroTemplate"
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
        case "minimal":
          return createMinimalistTemplate(backendSlide, index)
        case "Vyntra":
          return createVyntraTemplate(backendSlide, index)
        case "civora":
          return createCivoraTemplate(backendSlide, index)
        case "fluxera":
          return createFluxeraTemplate(backendSlide, index) 
          // Temporary: using Civora for Fluxera
        case "linear":
          return createLinearTemplate(backendSlide, index)
         // Temporary: using Modern for Linear
         case "retro":
          return createRetroTemplate(backendSlide, index)
         // Temporary: using Modern for Retro
        default:
          return createModernTemplate(backendSlide, index)
      }
    }),
  }
}
