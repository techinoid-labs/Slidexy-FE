import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans | SlideXY AI Presentation Builder",
  description:
    "Compare SlideXY pricing plans. Get AI-powered presentations with free and premium tiers for individuals, startups, and teams.",
  alternates: {
    canonical: "https://slidexy.ai/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
