"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/app/store/store";
import { SlidesProvider } from "@/app/context/SlidesContext";
import { ThemeProvider } from "@/lib/theme-provider";
import CssBaseline from "@mui/material/CssBaseline";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <SlidesProvider>{children}</SlidesProvider>
      </ThemeProvider>
    </Provider>
  );
}
