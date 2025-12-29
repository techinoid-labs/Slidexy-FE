import React from 'react';
import Header from '@/app/components/headers-navbar/Header';
import Footer from '@/app/components/home/Footer';
import CommunitySection from '@/app/components/home/Community';
import PromptToPdf from './components/PromptToPdf';

export default function Page() {
  return (
    <>
      <Header />
      <PromptToPdf />
      <CommunitySection />
      <Footer />
    </>
  );
}