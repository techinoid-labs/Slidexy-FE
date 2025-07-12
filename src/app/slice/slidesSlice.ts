// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface KonvaTextProperties {
//   fontSize: number;
//   fontFamily: string;
//   fill: string;
//   fontStyle?: string;
// }

// interface KonvaComponent {
//   konva_component: string;
//   properties: KonvaTextProperties;
//   text: string;
// }

// export interface Slide {
//   [x: string]: any;
//   slide_id: string;
//   slide_title: KonvaComponent;
//   elements: KonvaComponent[];
//   image_url: string | null;
//   image_caption: string;
// }

// interface SlidesState {
//   slides: Slide[];
// }

// const initialState: SlidesState = {
//   slides: [],
// };

// const slidesSlice = createSlice({
//   name: "slides",
//   initialState,
//   reducers: {
//     setSlides: (state, action: PayloadAction<Slide[]>) => {
//       state.slides = action.payload;
//     },

//     updateSlideImages: (
//       state,
//       action: PayloadAction<{ slideIndex: number; updatedImages: string[] }>
//     ) => {
//       state.slides[action.payload.slideIndex].images =
//         action.payload.updatedImages;
//     },
//     addTextElementToSlide: (
//       state,
//       action: PayloadAction<{
//         slideIndex: number;
//         newElement: KonvaComponent;
//       }>
//     ) => {
//       const { slideIndex, newElement } = action.payload;
//       if (!state.slides[slideIndex]) return;
//       state.slides[slideIndex].elements.push(newElement);
//     },

//     updateSlide: (
//       state,
//       action: PayloadAction<{
//         slideIndex: number;
//         updated: Partial<Slide>;
//       }>
//     ) => {
//       const { slideIndex, updated } = action.payload;
//       state.slides[slideIndex] = {
//         ...state.slides[slideIndex],
//         ...updated,
//       };
//     },
//   },
// });

// // Export actions and reducer
// export const {
//   setSlides,
//   updateSlideImages,
//   addTextElementToSlide,
//   updateSlide,
// } = slidesSlice.actions;
// export default slidesSlice.reducer;

//Shapes relevant changes

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface KonvaTextProperties {
  fontSize?: number;
  fontFamily?: string;
  fill: string;
  fontStyle?: string;
  // shape-specific
  x?: number;
  y?: number;
  width?: number;
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
  width: number;
  height: number;
  imageSrc: string;
}

interface KonvaComponent {
  konva_component: string;
  element_type?: string;
  properties: KonvaTextProperties | KonvaImageProperties;
  text?: string;
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

    updateSlide: (
      state,
      action: PayloadAction<{
        slideIndex: number;
        updated: Partial<Slide>;
      }>
    ) => {
      const { slideIndex, updated } = action.payload;
      state.slides[slideIndex] = {
        ...state.slides[slideIndex],
        ...updated,
      };
    },
  },
});

export const {
  setSlides,
  updateSlideImages,
  addTextElementToSlide,
  updateSlide,
} = slidesSlice.actions;

export default slidesSlice.reducer;
