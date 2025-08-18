export interface Presentation {
  slides: Slide[] | [];
}

export interface Slide {
  slide_id: string;
  slide_title: string;
  elements: Element[];
  image_url: string; // base64 or URL
}

export interface PropertiesBase {
  zIndex: number; // Draw order
}

export type Element = TextElement | ShapeElement | ImageElement;

export interface BaseElement<
  P extends PropertiesBase,
  T extends string,
  K extends string
> {
  element_id: string;
  element_type: T;
  konva_component: K;
  properties: P;
}

export interface TextElement
  extends BaseElement<
    TextProperties,
    "text" | "bullet_point" | "title",
    "Konva.Text"
  > {
  text: string;
}

export interface TextProperties extends PropertiesBase {
  fontSize: number;
  fontFamily: string;
  fill: string; // "#RRGGBB"
  fontStyle?: string;
  fontWeight?: string;
  x: number;
  y: number;
  width: number;
  height?: number;
  align?: "left" | "center" | "right";
}

export interface ShapeElement
  extends BaseElement<
    ShapeProperties,
    "shape",
    | "Konva.Rect"
    | "Konva.Circle"
    | "Konva.RegularPolygon"
    | "Konva.Star"
    | "Konva.Line"
    | "Konva.Arrow"
    | "Konva.Ellipse"
    | "Konva.Arc"
    | "Konva.Wedge"
  > {}

export interface ShapeProperties extends PropertiesBase {
  rotation?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string; // "#RRGGBB"
  stroke?: string; // "#RRGGBB"
  strokeWidth?: number;
  radius?: number;
  radiusX?: number;
  radiusY?: number;
  sides?: number;
  points?: number[];
  numPoints?: number;
  innerRadius?: number;
  outerRadius?: number;
  opacity?: number;
  cornerRadius?: number;
}

export interface ImageElement
  extends BaseElement<ImageProperties, "image", "Konva.Image"> {}

export interface ImageProperties extends PropertiesBase {
  imageSrc: string; // base64 or URL
  x: number;
  y: number;
  width: number;
  height: number;
  rounded?: number;
}
