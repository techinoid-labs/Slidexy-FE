import type React from "react";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-provider";
import CssBaseline from "@mui/material/CssBaseline";
import { SlidesProvider } from "@/app/context/SlidesContext";

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
        <ThemeProvider>
          <CssBaseline />
          <SlidesProvider>{children}</SlidesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
