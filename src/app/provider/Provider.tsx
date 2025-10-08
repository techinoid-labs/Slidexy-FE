"use client";

import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
// import { store } from "@/app/store/store";
import { SlidesProvider } from "@/app/context/SlidesContext";
import { ThemeProvider } from "@/lib/theme-provider";
import CssBaseline from "@mui/material/CssBaseline";
import initStore, { getStore } from "@/app/store/store"; // Adjust path
import { TemplateSlidesProvider } from "../context/TemplateSlidesContext";
import StripeProvider from "@/lib/StripeProvider";

import { Box, Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [storeReady, setStoreReady] = useState(false);

  useEffect(() => {
    initStore().then(() => setStoreReady(true));
  }, []);

  // if (!storeReady) return <div>Loading...</div>;

  if (!storeReady) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 2,
        }}
      >
        <CircularProgress size={42} thickness={4} sx={{ color: "#5b21b6" }} />
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Loading Sildexy..
        </Typography>
      </Box>
    );
  }

  const store = getStore();
  return (
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <TemplateSlidesProvider>
          <SlidesProvider>
            <StripeProvider>{children}</StripeProvider>
          </SlidesProvider>
        </TemplateSlidesProvider>
      </ThemeProvider>
    </Provider>
  );
}
