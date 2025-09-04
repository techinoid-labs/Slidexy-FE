"use client";
import Header from "@/app/components/headers-navbar/Header";
import HeroSection from "@/app/components/home/HeroSection";
import { Box } from "@mui/material";
import Image from "next/image";
import FeaturesSection from "@/app/components/home/Features";
import PurposeSection from "../components/home/Purpose";
import PresentationStyleSection from "../components/home/PresentationStyle";
import WorkingSection from "../components/home/Working";
import TestimonialSection from "../components/home/Testimonial";
import PricingSection from "../components/home/Pricing";
import CommunitySection from "../components/home/Community";
import Footer from "../components/home/Footer";
export default function Home() {
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
      {/* BACKGROUND LAYER */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      ></Box>

      {/* FOREGROUND CONTENT */}
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PurposeSection />
      <PresentationStyleSection />
      <WorkingSection />
      <TestimonialSection />
      <PricingSection />
      <CommunitySection />
      <Footer />
    </Box>
  );
}
