import { configureStore } from "@reduxjs/toolkit";
import slidesReducer from "../slice/slidesSlice";
import { get, set, del } from "idb-keyval";

const PERSIST_KEY = "slidesX_slides";
// Written by the removed Konva snapshot pipeline; cleared opportunistically.
const LEGACY_SNAPSHOT_KEY = "slidesX_snapshots";
const PERSIST_DEBOUNCE = 5000; // ✅ Increased from 800ms to 5 seconds

// ✅ FIXED: Strip non-serializable data before persisting
const sanitizeSlideData = (slidesData: any) => {
  if (!slidesData || !Array.isArray(slidesData.slides)) {
    return slidesData;
  }

  return {
    ...slidesData,
    slides: slidesData.slides.map((slide: any) => {
      const sanitized = { ...slide };
      
      // Remove snapshot references (should only exist in snapshotsCache)
      if (sanitized.snapshot) delete sanitized.snapshot;
      if (sanitized._snapshot) delete sanitized._snapshot;
      
      // Remove any Blob/File objects that might have snuck in
      if (sanitized.elements) {
        sanitized.elements = sanitized.elements.map((el: any) => {
          const cleanEl = { ...el };
          if (cleanEl.properties?.imageBlob) delete cleanEl.properties.imageBlob;
          if (cleanEl.properties?.file) delete cleanEl.properties.file;
          return cleanEl;
        });
      }
      
      return sanitized;
    }),
  };
};

// Load persisted state from IndexedDB
const loadState = async () => {
  try {
    const persisted = await get(PERSIST_KEY);
    if (!persisted) return undefined;
    
    console.log('[Store] Loaded persisted state from IndexedDB');
    return { slidesData: persisted };
  } catch (err) {
    console.error("Error loading Redux state from IndexedDB:", err);
    return undefined;
  }
};

// Change detection by reference, not by serialising the whole deck.
// Redux hands back a new `slidesData` object whenever anything changes, so an
// identity check is both cheaper and more accurate than a JSON hash.
let lastSavedSlidesData: any = null;

const saveState = async (state: any) => {
  try {
    const slidesData = state.slidesData;

    if (slidesData === lastSavedSlidesData) {
      return;
    }

    const sanitized = sanitizeSlideData(slidesData);

    await set(PERSIST_KEY, sanitized);
    lastSavedSlidesData = slidesData;
    console.log('[Store] State persisted to IndexedDB');
  } catch (err) {
    console.error("Error saving Redux state to IndexedDB:", err);
    
    // ✅ FIXED: If quota exceeded, try clearing old data
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      console.warn('[Store] Quota exceeded, attempting cleanup...');
      try {
        // Free space by dropping the legacy Konva thumbnail cache. Nothing
        // writes it any more, but older sessions may still have it on disk.
        await del(LEGACY_SNAPSHOT_KEY);

        // Retry save
        const sanitized = sanitizeSlideData(state.slidesData);
        await set(PERSIST_KEY, sanitized);
        lastSavedSlidesData = state.slidesData;
        console.log('[Store] State persisted after cleanup');
      } catch (retryErr) {
        console.error('[Store] Failed to save even after cleanup:', retryErr);
      }
    }
  }
};

// Create store and set up subscription
const initStore = async () => {
  const preloadedState = await loadState();

  const store = configureStore({
    reducer: {
      slidesData: slidesReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // ✅ FIXED: Disable serializability checks (data is sanitized manually)
        serializableCheck: false,
      }),
    preloadedState,
  });

  // ✅ FIXED: Optimized debounced save with better performance
  let saveTimeout: NodeJS.Timeout | null = null;
  let saveScheduled = false;
  
  store.subscribe(() => {
    if (saveScheduled) return;
    
    saveScheduled = true;
    
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    saveTimeout = setTimeout(() => {
      saveScheduled = false;
      
      // Use requestIdleCallback if available for better performance
      if (typeof (window as any).requestIdleCallback === 'function') {
        (window as any).requestIdleCallback(
          () => {
            saveState(store.getState());
          },
          { timeout: 10000 } // Max 10s delay
        );
      } else {
        saveState(store.getState());
      }
    }, PERSIST_DEBOUNCE);
  });

  setStoreInstance(store);
  return store;
};

// Create a temporary store to get the types
const tempStore = configureStore({
  reducer: {
    slidesData: slidesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
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
  lastSavedSlidesData = null;
  console.log('[Store] Cleared persisted slides');
};

export default initStore;