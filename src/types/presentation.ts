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
  image_url?: string | null;
  image_properties?: {
    opacity?: number;
    borderRadius?: number;
    shadow?: {
      offsetX: number;
      offsetY: number;
      blur: number;
      color: string;
    };
  };
  htmlTemplate?: string; // HTML template string for rendering
  elements?: SlideElement[];
  exportElements?: ExportElement[];
  // properties found in slidesSlice.ts and used in layouts
  slide_title?: {
    text: string;
    properties?: any;
    element_properties?: any;
  };
  subtitle?: {
    text: string;
    properties?: any;
    element_properties?: any;
  };
  currentVariantIndex?: number;
  layouts?: Slide[];
}

export interface SlideElement {
  id: string;
  element_type: "text" | "title" | "bullet_point" | "shape" | "image" | "html";
  konva_component?: "Konva.Text" | "Konva.Rect" | "Konva.Circle" | "Konva.Ellipse" | "Konva.RegularPolygon" | "Konva.Line" | "Konva.Image" | "Konva.HTML";
  text?: string;
  shape_id?: string; // Unique ID for shapes
  properties: {
    text_id?: string; // Unique ID for text elements
    image_id?: string; // Unique ID for image elements
    shape_id?: string; // Unique ID for shape elements
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number; // e.g., "700" or 700 for bold
    fontStyle?: string; // e.g., "italic"
    align?: "left" | "center" | "right" | "justify";
    fill?: string; // Solid fill color
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    cornerRadius?: number; // For rectangles
    radius?: number; // For circles
    sides?: number; // For polygons
    points?: number[]; // For lines
    imageSrc?: string; // For images
    rounded?: number; // Legacy rounded property
    htmlContent?: string; // For Konva.HTML
    zIndex?: number; // Stacking order
    shadow?: {
      offsetX: number;
      offsetY: number;
      blur: number;
      color: string;
    }; // Shadow properties
    fillLinearGradientStartPoint?: { x: number; y: number }; // Gradient start
    fillLinearGradientEndPoint?: { x: number; y: number }; // Gradient end
    fillLinearGradientColorStops?: (string | number)[]; // Gradient color stops
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
    fontWeight?: string | number; // Added for text styling
    fontStyle?: string; // Added for text styling
    color?: string; // Alias for fill
    align?: "left" | "center" | "right" | "justify";
    imageSrc?: string;
    shapeType?: "rect" | "circle" | "ellipse" | "line" | "polygon";
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    cornerRadius?: number; // For shapes
    shadow?: {
      offsetX: number;
      offsetY: number;
      blur: number;
      color: string;
    }; // Shadow properties
    gradient?: {
      startPoint?: { x: number; y: number };
      endPoint?: { x: number; y: number };
      colorStops?: (string | number)[];
    }; // Updated to support Konva gradient structure
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
  slide_title?: { id?: string; text: string; properties?: any };
  textBlock?: { elements: { id?: string; text: string; properties?: any }[] };
  imageBlock?: { elements: { properties: { imageSrc: string; image_id?: string } }[] };
  titleBlock?: { elements: { id?: string; text: string; properties?: any }[] };
}
