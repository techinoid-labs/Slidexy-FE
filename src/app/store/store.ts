import { configureStore } from "@reduxjs/toolkit";
import slidesReducer from "../slice/slidesSlice";
import { get, set, del } from "idb-keyval";

const PERSIST_KEY = "slidesX_slides";

// Define the type of the store explicitly
type StoreType = ReturnType<typeof configureStore>;

// This will hold the actual store instance
let storeInstance: StoreType;
// Load persisted state from IndexedDB (async)
const loadState = async () => {
  try {
    const persisted = await get(PERSIST_KEY);
    if (!persisted) return undefined;
    return { slidesData: persisted };
  } catch (err) {
    console.error("Error loading Redux state from IndexedDB:", err);
    return undefined;
  }
};

// Save state to IndexedDB
const saveState = async (state: any) => {
  try {
    await set(PERSIST_KEY, state.slidesData);
  } catch (err) {
    console.error("Error saving Redux state to IndexedDB:", err);
  }
};

// Create store and set up subscription
const initStore = async () => {
  const preloadedState = await loadState();

  storeInstance = configureStore({
    reducer: {
      slidesData: slidesReducer,
    },
    preloadedState,
  });

  storeInstance.subscribe(() => {
    saveState(storeInstance.getState());
  });

  return storeInstance;
};

// Getter for store (only call after initStore resolves)
export const getStore = () => storeInstance;

// Clear persisted slides
export const clearPersistedSlides = async () => {
  await del(PERSIST_KEY);
};

// Types (must be used after store is initialized)
export type AppStore = typeof storeInstance;
export type RootState = ReturnType<typeof storeInstance.getState>;
export type AppDispatch = typeof storeInstance.dispatch;

export default initStore;
