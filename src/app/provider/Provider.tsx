"use client";

import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
// import { store } from "@/app/store/store";
import { SlidesProvider } from "@/app/context/SlidesContext";
import { ThemeProvider } from "@/lib/theme-provider";
import CssBaseline from "@mui/material/CssBaseline";
import initStore, { getStore } from "@/app/store/store"; // Adjust path

export default function Providers({ children }: { children: React.ReactNode }) {
  const [storeReady, setStoreReady] = useState(false);

  useEffect(() => {
    initStore().then(() => setStoreReady(true));
  }, []);

  if (!storeReady) return <div>Loading...</div>;

  const store = getStore();
  return (
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <SlidesProvider>{children}</SlidesProvider>
      </ThemeProvider>
    </Provider>
  );
}
