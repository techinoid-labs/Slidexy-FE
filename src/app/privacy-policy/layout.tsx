import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SlideXY",
  description:
    "Read the SlideXY Terms of Service. Understand your rights, responsibilities, and our policies for using the AI presentation platform.",
  alternates: {
    canonical: "https://slidexy.ai/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
