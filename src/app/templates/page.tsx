import React from "react";
import type { Metadata } from "next";
import Header from "../components/headers-navbar/Header";
import Hero from "../components/templates/Hero";
import CommunitySection from "../components/home/Community";
import Footer from "../components/home/Footer";
import TemplatesSection from "../components/templates/TemplatesSection";

export const metadata: Metadata = {
  title: "Presentation Templates — Ready-to-Use AI Slide Designs",
  description:
    "Browse SlideXY presentation templates for pitches, reports, proposals and more. Customize any template with AI to match your brand in seconds.",
  alternates: {
    canonical: "https://slidexy.ai/templates",
  },
};

export default function Template() {
  return (
    <>
      <Header />
      <Hero />
      <TemplatesSection />
      {/* <CommunitySection/> */}
      <Footer />
    </>
  );
}
