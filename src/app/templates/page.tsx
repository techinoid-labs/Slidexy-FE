import React from "react";
import Header from "../components/headers-navbar/Header";
import Hero from "../components/templates/Hero";
import CommunitySection from "../components/home/Community";
import Footer from "../components/home/Footer";
import TemplatesSection from "../components/templates/TemplatesSection";

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
