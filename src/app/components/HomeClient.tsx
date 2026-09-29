"use client";

import Header from "@/app/components/headers-navbar/Header";
import HeroSection from "@/app/components/home/HeroSection";
import { Box } from "@mui/material";
import PurposeSection from "@/app/components/home/Purpose";
import PresentationStyleSection from "@/app/components/home/PresentationStyle";
import WorkingSection from "@/app/components/home/Working";
import TestimonialSection from "@/app/components/home/Testimonial";
import PricingSection from "@/app/components/home/Pricing";
import CommunitySection from "@/app/components/home/Community";
import ContactSection from "@/app/components/home/ContactSection";
import Footer from "@/app/components/home/Footer";
import WhatWeOffer from "./home/WhatWeOffer";
import Reveal from "@/app/components/shared/Reveal";

export default function HomeClient() {
  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        overflow: "hidden",
      }}
    >
      <Header />
      <HeroSection />
      <Reveal>
        <WhatWeOffer />
      </Reveal>
      <Reveal delay={0.05}>
        <PurposeSection />
      </Reveal>
      <Reveal delay={0.05}>
        <PresentationStyleSection />
      </Reveal>
      <Reveal>
        <WorkingSection />
      </Reveal>
      <Reveal>
        <TestimonialSection />
      </Reveal>
      <Reveal>
        <PricingSection />
      </Reveal>
      <Reveal>
        <CommunitySection />
      </Reveal>
      <Reveal>
        <ContactSection />
      </Reveal>
      <Footer />
    </Box>
  );
}
