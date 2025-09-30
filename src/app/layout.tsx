import type React from "react";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Providers from "./provider/Provider";
import { ThemeProvider } from "@/lib/theme-provider";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as ThemeContextProvider } from "./context/ThemeContext";
import "./globals.css";
import SessionWrapper from "@/lib/sessionWrapper";
import { UserProvider } from "./context/AuthContext";
import Script from "next/script";
import AnalyticsTracker from "./components/analytics/AnalyticsTracker";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const GA_CONVERSION_ID = process.env.NEXT_PUBLIC_GA_CONVERSION_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Slides - Your Idea, Instantly on Slides",
  description:
    "Turn any thought into a polished, on-brand presentation — powered by AI, styled by designers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={raleway.variable} suppressHydrationWarning>
      <body className={raleway.className} suppressHydrationWarning>
        <ThemeContextProvider>
          <ThemeProvider>
            <CssBaseline />
            <SessionWrapper>
              <UserProvider>
                <Providers>
                  {/* <AnalyticsTracker /> */}
                  {children}
                </Providers>
              </UserProvider>
            </SessionWrapper>
          </ThemeProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
