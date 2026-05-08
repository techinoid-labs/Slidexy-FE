import Header from "./components/headers-navbar/Header";
import HeroSection from "./components/home/HeroSection";
import WhatWeOffer from "./components/home/WhatWeOffer";
import PurposeSection from "./components/home/Purpose";
import PresentationStyleSection from "./components/home/PresentationStyle";
import WorkingSection from "./components/home/Working";
import TestimonialSection from "./components/home/Testimonial";
import PricingSection from "./components/home/Pricing";
import CommunitySection from "./components/home/Community";
import ContactSection from "./components/home/ContactSection";
import FAQSection from "./components/home/FAQSection";
import Footer from "./components/home/Footer";

export default function Home() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
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
      ></div>
      <Header />
      <HeroSection />
      <WhatWeOffer />
      <PurposeSection />
      <PresentationStyleSection />
      <WorkingSection />
      <TestimonialSection />
      <FAQSection />
      <PricingSection />
      <CommunitySection />
      <ContactSection />
      <Footer />
    </main>
  );
}

