import type React from "react";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
  import Providers from "./provider/Provider";


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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
