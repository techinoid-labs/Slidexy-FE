import { configureStore } from '@reduxjs/toolkit';
import slidesReducer from '../slice/slidesSlice';

export const store = configureStore({
  reducer: {
    slidesData: slidesReducer,
  },
});

// Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
