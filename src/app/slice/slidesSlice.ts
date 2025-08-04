import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface KonvaTextProperties {
  fontSize?: number;
  fontFamily?: string;
  fill: string;
  fontStyle?: string;
  fontWeight?: string;
  // shape-specific
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
}
interface KonvaImageProperties {
  x: number;
  y: number;
  fill?: string;
  width: number;
  height: number;
  imageSrc: string;
}

interface KonvaComponent {
  konva_component: string;
  element_id?: string;
  element_type?: string;
  properties: KonvaTextProperties | KonvaImageProperties;
  text?: string;
  useThemeColor?: boolean;
}

export interface Slide {
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
  name: "slides",
  initialState,
  reducers: {
    setSlides: (state, action: PayloadAction<Slide[]>) => {
      state.slides = action.payload;
    },
    removeSlides: (state) => {
      state.slides = [];
    },
    updateSlideImages: (
      state,
      action: PayloadAction<{ slideIndex: number; updatedImages: string[] }>
    ) => {
      state.slides[action.payload.slideIndex].images =
        action.payload.updatedImages;
    },
    addTextElementToSlide: (
      state,
      action: PayloadAction<{
        slideIndex: number;
        newElement: KonvaComponent;
      }>
    ) => {
      const { slideIndex, newElement } = action.payload;
      if (!state.slides[slideIndex]) return;
      state.slides[slideIndex].elements.push(newElement);
    },
  },
});

export const {
  setSlides,
  updateSlideImages,
  addTextElementToSlide,
  removeSlides,
} = slidesSlice.actions;

export default slidesSlice.reducer;
