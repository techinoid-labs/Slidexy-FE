export interface Presentation {
  id: string;
  title?: string;
  topic?: string;
  meta?: {
    audience?: string;
    tone?: string;
  };
  slides: Slide[];
}

export interface Slide {
  slide_id: string;
  title?: string;
  image_url?: string;
  elements?: SlideElement[];
  htmlTemplate?: string;
  exportElements?: ExportElement[];
}

export interface SlideElement {
  id: string;
  element_type: "text" | "title" | "bullet_point" | "shape" | "image" | "html";
  konva_component?: "Konva.Text" | "Konva.Rect" | "Konva.Circle" | "Konva.RegularPolygon" | "Konva.Line" | "Konva.Image" | "Konva.HTML";
  text?: string;
  properties: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    fontStyle?: string;
    fontWeight?: string | number;
    align?: "left" | "center" | "right";
    zIndex?: number;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    cornerRadius?: number;
    radius?: number;
    sides?: number;
    points?: number[];
    imageSrc?: string;
    rounded?: number;
    htmlContent?: string;
  };
}

export interface ExportElement {
  type: "text" | "image" | "shape" | "background";
  content?: string;
  properties: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    align?: "left" | "center" | "right";
    imageSrc?: string;
    shapeType?: "rect" | "circle" | "line";
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    gradient?: { start: string; end: string }; // Added for gradient backgrounds
  };
}

export interface BackendPresentation {
  id: string;
  title?: string;
  topic?: string;
  meta?: {
    audience?: string;
    tone?: string;
  };
  slides: BackendSlide[];
}

export interface BackendSlide {
  slide_id: string;
  title?: string;
  content?: string;
  bullet_points?: string[];
  image_url?: string;
  slide_title?: { id?: string; text: string };
  textBlock?: { elements: { id?: string; text: string }[] };
  imageBlock?: { elements: { properties: { imageSrc: string } }[] };
  titleBlock?: { elements: { id?: string; text: string }[] }; 
}
export interface TextElement extends SlideElement {
  element_type: "text" | "title" | "bullet_point";
  text: string;
  properties: SlideElement["properties"] & {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number;
    fontStyle?: string;
    align?: "left" | "center" | "right";
  };
}

export interface ShapeElement extends SlideElement {
  element_type: "shape";
  konva_component: "Konva.Rect" | "Konva.Circle" | "Konva.RegularPolygon" | "Konva.Line";
  properties: SlideElement["properties"] & {
    cornerRadius?: number;
    radius?: number;
    radiusX?: number;
    radiusY?: number;
    sides?: number;
    points?: number[];
  };
}

export interface ImageElement extends SlideElement {
  element_type: "image";
  properties: SlideElement["properties"] & {
    imageSrc: string;
  };
}

