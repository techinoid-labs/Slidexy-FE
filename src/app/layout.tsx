import type React from "react";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-provider";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as ThemeContextProvider } from "./context/ThemeContext";


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
      <body className={raleway.className}>
        <ThemeContextProvider>
          <ThemeProvider>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
