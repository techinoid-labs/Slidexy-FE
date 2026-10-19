import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product | SlideXY AI Presentation Platform",
  description:
    "Learn how SlideXY transforms ideas into polished presentations using AI. From prompt-to-deck to video-to-slides, see what our platform can do.",
  alternates: {
    canonical: "https://slidexy.ai/product",
  },
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
