import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface KonvaTextProperties {
  [key: string]: any;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  fontStyle?: string;
  fontWeight?: string;
  shape_id?: string;
  x?: number;
  y?: number;
  width?: number;
  align?: string;
  height?: number;
  radius?: number;
  sides?: number;
  numPoints?: number;
  innerRadius?: number;
  outerRadius?: number;
  imageSrc?: string;
  zIndex?: number; // Added zIndex
  opacity?: number; // Added opacity
  shadow?: { offsetX: number; offsetY: number; blur: number; color: string }; // Added shadow
  borderRadius?: number; // Added borderRadius
}

interface KonvaImageProperties {
  [key: string]: any;
  image_id?: string;
  x?: number; // Made optional to match context
  y?: number; // Made optional to match context
  fill?: string;
  width?: number;
  height?: number;
  imageSrc?: string;
  opacity?: number;
  shadow?: { offsetX: number; offsetY: number; blur: number; color: string };
  borderRadius?: number;
  zIndex?: number; // Added zIndex
  isBackground?: boolean; // Added isBackground property
}

// Add a shape properties interface
interface KonvaShapeProperties {
  [key: string]: any;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
  sides?: number;
  numPoints?: number;
  innerRadius?: number;
  outerRadius?: number;
  opacity?: number;
  shadow?: { offsetX: number; offsetY: number; blur: number; color: string };
  borderRadius?: number;
  zIndex?: number;
}

interface Block {
  elements: KonvaComponent[];
  width: number;
  height: number;
}

// Updated KonvaComponent interface
export interface KonvaComponent {
  id?: string; // Added id property
  konva_component: string;
  element_id?: string;
  element_type?: string;
  type?: string; // Added type property
  properties: KonvaTextProperties | KonvaImageProperties | KonvaShapeProperties;
  text?: string;
  useThemeColor?: boolean;
}

export interface Slide {
  titleBlock?: Block;
  textBlock?: Block;
  imageBlock?: Block;
  [x: string]: any;
  slide_id: string;
  slide_title: KonvaComponent;
  elements: KonvaComponent[];
  image_url: string | null;
  image_caption: string;
  _initialState?: Slide;
}

interface SlidesState {
  slides: Slide[];
}

const initialState: SlidesState = {
  slides: [],
};

const slidesSlice = createSlice({
  name: "slidesData", // Changed from "slides" to "slidesData" to match your selector
  initialState,
  reducers: {
    setSlides: (state, action: PayloadAction<Slide[]>) => {
      state.slides = action.payload;
    },
    removeSlides: (state) => {
      state.slides = [];
    },
    updateSlideImages: (state, action: PayloadAction<{ slideIndex: number; updatedImages: string[] }>) => {
      if (state.slides[action.payload.slideIndex]) {
        // Fixed: Added type safety check
        (state.slides[action.payload.slideIndex] as any).images = action.payload.updatedImages;
      }
    },
    addTextElementToSlide: (state, action: PayloadAction<{ slideIndex: number; newElement: KonvaComponent }>) => {
      const { slideIndex, newElement } = action.payload;
      if (!state.slides[slideIndex]) return;
      state.slides[slideIndex].elements.push(newElement);
    },
  },
});

export const { setSlides, updateSlideImages, addTextElementToSlide, removeSlides } = slidesSlice.actions;

// Export the types for use in other files
export type { KonvaTextProperties, KonvaImageProperties, KonvaShapeProperties };

export default slidesSlice.reducer;