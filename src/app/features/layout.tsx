import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — AI-Powered Presentation Creation",
  description:
    "Discover SlideXY features: AI slide generation, voice-to-deck, video-to-slides, brand templates, and real-time collaboration for professional presentations.",
  alternates: {
    canonical: "https://slidexy.ai/features",
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
