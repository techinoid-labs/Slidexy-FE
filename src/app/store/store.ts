import { configureStore } from "@reduxjs/toolkit";
import slidesReducer from "../slice/slidesSlice";

const PERSIST_KEY = "slidesX_slides";

// Load persisted state
const loadState = () => {
  try {
    const serializedState = localStorage.getItem(PERSIST_KEY);
    if (serializedState === null) return undefined;
    return { slidesData: JSON.parse(serializedState) };
  } catch (err) {
    console.error("Error loading Redux state:", err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state.slidesData);
    localStorage.setItem(PERSIST_KEY, serializedState);
  } catch (err) {
    console.error("Error saving Redux state:", err);
  }
};

// Create store with preloaded state
export const store = configureStore({
  reducer: {
    slidesData: slidesReducer,
  },
  preloadedState: loadState(),
});

// Subscribe to store changes
store.subscribe(() => {
  saveState(store.getState());
});

// For clearing persisted state
export const clearPersistedSlides = () => {
  localStorage.removeItem(PERSIST_KEY);
};

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
