import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | AI Presentation Tips & Updates",
  description:
    "Read the SlideXY blog for AI presentation tips, product updates, and guides on creating better pitch decks and slide designs.",
  alternates: {
    canonical: "https://slidexy.ai/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
