import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — SlideXY",
  description:
    "Find answers to common questions about SlideXY: features, pricing, customization, and how our AI presentation tool works.",
  alternates: {
    canonical: "https://slidexy.ai/faqs",
  },
};

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
