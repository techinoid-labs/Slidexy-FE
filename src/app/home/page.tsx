import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";
import { Box } from "@mui/material";
import Image from "next/image";
import FeaturesSection from "@/app/components/Features";
import PurposeSection from "../components/Purpose";
import PresentationStyleSection from "../components/PresentationStyle";
import WorkingSection from "../components/Working";
import TestimonialSection from "../components/Testimonial";
import PricingSection from "../components/Pricing";
import CommunitySection from "../components/Community";
import Footer from "../components/Footer";
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
