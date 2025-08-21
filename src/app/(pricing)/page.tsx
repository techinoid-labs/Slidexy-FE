import Header from "@/app/components/home/Header";
import HeroSection from "@/app/components/home/HeroSection";
import { Box } from "@mui/material";
import Image from "next/image";
import PricingSection from "../components/pricing/Pricing";
import CommunitySection from "../components/home/Community";
import Footer from "../components/home/Footer";
import PurposeSection from "../components/home/Purpose";
import FAQSection from "../components/pricing/FAQ";

export default function Pricing() {
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
      <PricingSection />
      <PurposeSection/>
      <FAQSection/>
      {/* <CommunitySection /> */}
      <Footer />
    </Box>
  );
}
