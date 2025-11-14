import React from 'react'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'
import PromptToEbook from './components/promptToEbook'

export default function page() {
  return (
    <>
    <Header />
    <PromptToEbook />
    <CommunitySection />
    <Footer />
    </>
  )
}