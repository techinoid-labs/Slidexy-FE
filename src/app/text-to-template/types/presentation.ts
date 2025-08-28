export interface TextElement {
  element_type: "text" | "title" | "bullet_point"
  text: string
  konva_component: string
  id: string
  properties: {
    x: number
    y: number
    fontSize: number
    fontFamily: string
    fill: string
    fontStyle?: string
    fontWeight?: string
    width: number
    height?: number
    align?: string
    zIndex?: number
  }
}

export interface ShapeElement {
  element_type: "shape"
  konva_component: string
  id: string
  properties: {
    x?: number
    y?: number
    width?: number
    height?: number
    radius?: number
    radiusX?: number
    radiusY?: number
    sides?: number
    fill?: string
    stroke?: string
    strokeWidth?: number
    opacity?: number
    cornerRadius?: number
    rotation?: number
    points?: number[]
    zIndex?: number
    shadowColor?: string
    shadowBlur?: number
  // Konva gradient properties
  fillLinearGradientStartPoint?: { x: number; y: number }
  fillLinearGradientEndPoint?: { x: number; y: number }
  fillLinearGradientColorStops?: (number | string)[]
  // Konva.Line property
  closed?: boolean
  }
}

export interface ImageElement {
  element_type: "image"
  konva_component: string
  id: string
  properties: {
    imageSrc: string
    x: number
    y: number
    width: number
    height: number
    zIndex: number
    rounded?: number
    opacity?: number
  }
}

export type SlideElement = TextElement | ShapeElement | ImageElement

export interface Slide {
  title?: string
  slide_id: string
  image_url?: string
  elements: SlideElement[]
}

export interface Presentation {
  id: string
  slides: Slide[]
  meta?: {
    audience: string
    tone: string
  }
}

export interface BackendPresentation {
  id: string
  title: string
  slides: BackendSlide[]
  topic: string
  meta: {
    audience: string
    tone: string
  }
}

export interface BackendSlide {
  slide_id: string
  title: string
  content: string
  bullet_points: string[]
  image_url?: string
  slide_title?: string
}
