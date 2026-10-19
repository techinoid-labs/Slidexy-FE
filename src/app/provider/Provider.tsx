"use client";

import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
// import { store } from "@/app/store/store";
import { SlidesProvider } from "@/app/context/SlidesContext";
import { ThemeProvider } from "@/lib/theme-provider";
import CssBaseline from "@mui/material/CssBaseline";
import initStore, { getStore } from "@/app/store/store"; // Adjust path
import { TemplateSlidesProvider } from "../context/TemplateSlidesContext";
import { LinkedInProvider } from "../context/LinkedInContext";
import { EbookProvider } from "../context/EbookContext";
import { VideoJobProvider } from "../context/ExplainerVideoContext";
import { PitchProvider } from "../context/PitchContext";
import StripeProvider from "@/lib/StripeProvider";

import { Box, Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [storeReady, setStoreReady] = useState(false);

  useEffect(() => {
    // Always boot. If store initialisation fails the app should come up
    // without persistence rather than sit on this spinner forever — a
    // rejected promise here used to mean a dead screen with no recovery.
    initStore()
      .catch((err) => {
        console.error("[Providers] Store init failed; continuing without persistence:", err);
      })
      .finally(() => setStoreReady(true));
  }, []);

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
        <LinkedInProvider>
          <TemplateSlidesProvider>
            <SlidesProvider>
              <StripeProvider>
                <EbookProvider>
                  <VideoJobProvider>
                    <PitchProvider>
                      {children}
                    </PitchProvider>
                  </VideoJobProvider>
                </EbookProvider>
              </StripeProvider>
            </SlidesProvider>
          </TemplateSlidesProvider>
        </LinkedInProvider>
      </ThemeProvider>
    </Provider>
  );
}
