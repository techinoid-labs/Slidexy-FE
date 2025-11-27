// slice/slidesSlice.ts
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
  zIndex: number;
  opacity?: number;
  shadow?: { offsetX: number; offsetY: number; blur: number; color: string };
  borderRadius?: number;
  rotation?: number;
}

interface KonvaImageProperties {
  [key: string]: any;
  image_id?: string;
  x?: number;
  y?: number;
  fill?: string;
  width?: number;
  height?: number;
  imageSrc?: string;
  opacity?: number;
  shadow?: { offsetX: number; offsetY: number; blur: number; color: string };
  borderRadius?: number;
  zIndex: number;
  isBackground?: boolean;
  rotation?: number;
  stroke?: string;
  strokeWidth?: number;
}

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
  radiusX?: number;
  radiusY?: number;
  sides?: number;
  numPoints?: number;
  innerRadius?: number;
  outerRadius?: number;
  opacity?: number;
  shadow?: { offsetX: number; offsetY: number; blur: number; color: string };
  borderRadius?: number;
  zIndex: number;
  points?: number[];
  data?: string; // For Path
}

interface GroupProperties extends KonvaShapeProperties {
  elements?: KonvaComponent[]; // New: Sub-elements in group
}

export interface KonvaComponent {
  id?: string;
  konva_component: string;
  element_id?: string;
  element_type?: string;
  type?: string;
  shape_id?: string;
  properties: KonvaTextProperties | KonvaImageProperties | KonvaShapeProperties | GroupProperties | Record<string, any>;
  text?: string;
  useThemeColor?: boolean;
  elements?: KonvaComponent[]; // New: For groups
}

interface Block {
  elements: KonvaComponent[];
  width: number;
  height: number;
}

export interface Slide {
  titleBlock?: Block;
  textBlock?: Block;
  imageBlock?: Block;
  [x: string]: any;
  slide_id: string;
  layout_type?: string;
  visual_suggestion?: string;
  knowledge?: { theme?: string };
  art_style?: string;
  art_palette?: string[];
  slide_title: KonvaComponent;
  elements: KonvaComponent[];
  image_url: string | null;
  image_caption: string;
  _initialState?: Slide;
  layouts?: Slide[]; // or Array<Slide> if you prefer
  currentVariantIndex?: number;

}

interface SlidesState {
  slides: Slide[];
}

const initialState: SlidesState = {
  slides: [],
};

const slidesSlice = createSlice({
  name: "slidesData",
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
        (state.slides[action.payload.slideIndex] as any).images = action.payload.updatedImages;
      }
    },
    addTextElementToSlide: (state, action: PayloadAction<{ slideIndex: number; newElement: KonvaComponent }>) => {
      const { slideIndex, newElement } = action.payload;
      if (!state.slides[slideIndex]) return;
      state.slides[slideIndex].elements.push(newElement);
    },
    updateShapeElement: (state, action: PayloadAction<{
      slideIndex: number;
      shapeId: string;
      updatedProperties: Partial<KonvaShapeProperties | GroupProperties>
    }>) => {
      const { slideIndex, shapeId, updatedProperties } = action.payload;
      if (!state.slides[slideIndex]) return;

      const elementIndex = state.slides[slideIndex].elements.findIndex(
        (el) => el.shape_id === shapeId
      );

      if (elementIndex !== -1) {
        state.slides[slideIndex].elements[elementIndex].properties = {
          ...state.slides[slideIndex].elements[elementIndex].properties,
          ...updatedProperties,
        };
      }
    },
    removeShapeElement: (state, action: PayloadAction<{ slideIndex: number; shapeId: string }>) => {
      const { slideIndex, shapeId } = action.payload;
      if (!state.slides[slideIndex]) return;

      state.slides[slideIndex].elements = state.slides[slideIndex].elements.filter(
        (el) => el.shape_id !== shapeId
      );
    },
  },
});

export const {
  setSlides,
  updateSlideImages,
  addTextElementToSlide,
  removeSlides,
  updateShapeElement,
  removeShapeElement
} = slidesSlice.actions;

export type { KonvaTextProperties, KonvaImageProperties, KonvaShapeProperties };

export default slidesSlice.reducer;