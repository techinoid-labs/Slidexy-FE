import React from 'react'
import PromptToVideo from './components/promptToVideo'
import Header from '@/app/components/headers-navbar/Header'
import CommunitySection from '@/app/components/home/Community'
import Footer from '@/app/components/home/Footer'

function page() {
  return (
    <>
      <Header />
      <PromptToVideo />
      <CommunitySection />
      <Footer />
    </>
  )
}

export default page