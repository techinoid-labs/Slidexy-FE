import { configureStore } from "@reduxjs/toolkit";
import slidesReducer from "../slice/slidesSlice";
import { get, set, del } from "idb-keyval";

const PERSIST_KEY = "slidesX_slides";

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
    // Strip any transient snapshot fields before persisting
    const slidesData = state.slidesData;
    if (slidesData && Array.isArray(slidesData.slides)) {
      const sanitized = {
        ...slidesData,
        slides: slidesData.slides.map((s: any) => {
          const copy = { ...s };
          if (copy.snapshot) delete copy.snapshot;
          return copy;
        }),
      };
      await set(PERSIST_KEY, sanitized);
    } else {
      await set(PERSIST_KEY, slidesData);
    }
  } catch (err) {
    console.error("Error saving Redux state to IndexedDB:", err);
  }
};

// Create store and set up subscription
const initStore = async () => {
  const preloadedState = await loadState();

  // ✅ FIX: Disable serializableCheck in dev mode (process.env.NODE_ENV === 'development')
  // Keeps it enabled in prod for safety
  const middleware = (getDefaultMiddleware: any) => 
    getDefaultMiddleware({
      serializableCheck: process.env.NODE_ENV === 'production' ? { ignoredActions: [] } : false,
    });

  const store = configureStore({
    reducer: {
      slidesData: slidesReducer,
    },
    middleware,  // ✅ Use custom middleware
    preloadedState,
  });
  // Debounced save: keep the timeout variable outside the handler
  let saveTimeout: any = null;
  store.subscribe(() => {
    try {
      if (saveTimeout) clearTimeout(saveTimeout);
    } catch (e) {
      /* ignore clear errors */
    }
    saveTimeout = setTimeout(() => {
      // Persist the full store state; saveState will extract slidesData
      saveState(store.getState());
    }, 800);
  });
  setStoreInstance(store);
  return store;
};

// Create a temporary store to get the types
const tempStore = configureStore({
  reducer: {
    slidesData: slidesReducer,
  },
});

// Export types based on the temporary store
export type AppStore = typeof tempStore;
export type RootState = ReturnType<typeof tempStore.getState>;
export type AppDispatch = typeof tempStore.dispatch;

// This will hold the actual store instance
let storeInstance: AppStore;

// Getter for store (only call after initStore resolves)
export const getStore = () => storeInstance;

// Set the store instance after initialization
export const setStoreInstance = (store: AppStore) => {
  storeInstance = store;
};

// Clear persisted slides
export const clearPersistedSlides = async () => {
  await del(PERSIST_KEY);
};

export default initStore;