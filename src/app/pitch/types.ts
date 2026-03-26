export type BaseKonvaProps = {
    id?: string;
    name?: string;
    x?: number;
    y?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOpacity?: number;
    lineCap?: "butt" | "round" | "square";
    lineJoin?: "miter" | "round" | "bevel";
    shadowOffset?: { x: number; y: number };
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    fillLinearGradientStartPoint?: { x: number; y: number };
    fillLinearGradientEndPoint?: { x: number; y: number };
    fillLinearGradientColorStops?: (number | string)[];
};

export type RectElement = BaseKonvaProps & {
    type: "Rect";
    width?: number;
    height?: number;
    cornerRadius?: number;
};

export type CircleElement = BaseKonvaProps & {
    type: "Circle";
    radius?: number;
};

export type EllipseElement = BaseKonvaProps & {
    type: "Ellipse";
    radiusX?: number;
    radiusY?: number;
};

export type LineElement = BaseKonvaProps & {
    type: "Line";
    points?: number[];
};

export type ArrowElement = BaseKonvaProps & {
    type: "Arrow";
    points: number[];
    pointerLength?: number;
    pointerWidth?: number;
};

export type TextElement = BaseKonvaProps & {
    type: "Text";
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    letterSpacing?: number;
    fontStyle?: string;
    align?: string;
    lineHeight?: number;
    offsetY?: number;
    width?: number;
    height?: number;
    padding?: number;
    wrap?: "word" | "char" | "none";
    ellipsis?: boolean;
    verticalAlign?: "top" | "middle" | "bottom";
    textDecoration?: "underline" | "line-through" | "";
};

export type TextPathElement = BaseKonvaProps & {
    type: "TextPath";
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    data?: string;
};

export type ImageElement = BaseKonvaProps & {
    type: "Image";
    image: CanvasImageSource;
    width?: number;
    height?: number;
};

export type RegularPolygonElement = BaseKonvaProps & {
    type: "RegularPolygon";
    sides: number;
    radius?: number;
};

export type StarElement = BaseKonvaProps & {
    type: "Star";
    numPoints: number;
    innerRadius: number;
    outerRadius: number;
};

export type RingElement = BaseKonvaProps & {
    type: "Ring";
    innerRadius: number;
    outerRadius: number;
};

export type ArcElement = BaseKonvaProps & {
    type: "Arc";
    innerRadius: number;
    outerRadius: number;
    angle: number;
    clockwise?: boolean;
};

export type WedgeElement = BaseKonvaProps & {
    type: "Wedge";
    angle: number;
    radius?: number;
    clockwise?: boolean;
};

export type PathElement = BaseKonvaProps & {
    type: "Path";
    data?: string;
};

export type TagElement = {
    fill?: string;
    stroke?: string;
    cornerRadius?: number;
};

export type LabelElement = BaseKonvaProps & {
    type: "Label";
    tag?: TagElement;
    text?: TextElement;
};

export type GroupElement = BaseKonvaProps & {
    type: "Group";
    children?: KonvaElement[];
};

export type KonvaElement =
    | RectElement
    | CircleElement
    | EllipseElement
    | LineElement
    | ArrowElement
    | TextElement
    | TextPathElement
    | ImageElement
    | RegularPolygonElement
    | StarElement
    | RingElement
    | ArcElement
    | WedgeElement
    | PathElement
    | LabelElement
    | GroupElement;

export type SlideData = {
    slideNumber?: number;
    title: string;
    konvaElements: KonvaElement[];
};
