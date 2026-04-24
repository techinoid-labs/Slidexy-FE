import React from 'react'
import Header from '../components/headers-navbar/Header'
import Footer from '../components/home/Footer'
import StudentHero from "./StudentHero";
import FAQSection from "../components/home/FAQSection";

export const metadata = {
  title: "Best AI Presentation Tools for Students | FYP & Assignments",
  description: "Boost your GPA with SlideXY. The best AI tool for students in Pakistan to create university assignments, FYP presentations, and seminar slides in seconds.",
  keywords: ["AI tools for students", "presentation topics for students", "FYP presentation", "university assignments AI", "SlideXY student discount"],
};

function Student() {
  return (
    <>
    <Header />
    <StudentHero />
    <FAQSection />
    <Footer />
    </>
  )
}

export default Student