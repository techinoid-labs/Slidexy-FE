"use client";

import Header from "@/app/components/headers-navbar/Header";
import HeroSection from "@/app/components/home/HeroSection";
import { Box } from "@mui/material";
import { BONE } from "@/app/components/home/editorial";
import PurposeSection from "@/app/components/home/Purpose";
import PresentationStyleSection from "@/app/components/home/PresentationStyle";
import WorkingSection from "@/app/components/home/Working";
import PricingSection from "@/app/components/pricing/Pricing";
import CommunitySection from "@/app/components/home/Community";
import ContactSection from "@/app/components/home/ContactSection";
import Footer from "@/app/components/home/Footer";
import WhatWeOffer from "./home/WhatWeOffer";
import Reveal from "@/app/components/shared/Reveal";
import ScrollStory from "@/app/components/home/ScrollStory";

export default function HomeClient() {
  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: BONE,
        // overflowX only: "overflow: hidden" here silently breaks
        // position: sticky in every descendant.
        overflowX: "clip",
      }}
    >
      <Header />
      <HeroSection />


      {/* One object transforms through the product in three beats. Plays
          on a timer, and the step markers let someone drive it by hand. */}
      <ScrollStory />

      <Reveal>
        <WhatWeOffer />
      </Reveal>


      <Reveal delay={0.05}>
        <PurposeSection />
      </Reveal>

      <Reveal delay={0.05}>
        <PresentationStyleSection />
      </Reveal>


      {/* Moved up from just above the footer. It was the strongest block
          on the page and almost nobody scrolled far enough to see it. */}
      <Reveal>
        <CommunitySection />
      </Reveal>

      <Reveal>
        <WorkingSection />
      </Reveal>

      <Reveal>
        <PricingSection compact />
      </Reveal>

      <Reveal>
        <ContactSection />
      </Reveal>
      <Footer />
    </Box>
  );
}
