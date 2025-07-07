import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface KonvaTextProperties {
  fontSize: number;
  fontFamily: string;
  fill: string;
  fontStyle?: string;
}

interface KonvaComponent {
  konva_component: string;
  properties: KonvaTextProperties;
  text: string;
}

export interface Slide {
  [x: string]: any;
  slide_id: string;
  slide_title: KonvaComponent;
  elements: KonvaComponent[];
  image_url: string | null;
  image_caption: string;
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
    updateSlideImages: (
      state,
      action: PayloadAction<{ slideIndex: number; updatedImages: string[] }>
    ) => {
      state.slides[action.payload.slideIndex].images =
        action.payload.updatedImages;
    },
  },
});

// Export actions and reducer
export const { setSlides, updateSlideImages } = slidesSlice.actions;
export default slidesSlice.reducer;
