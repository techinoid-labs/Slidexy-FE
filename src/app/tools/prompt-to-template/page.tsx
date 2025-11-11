import React from 'react'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'
import PromptToTemplate from './components/promptToTemplate'

export default function page() {
  return (
    <>
    <Header />
    <PromptToTemplate />
    <CommunitySection />
    <Footer />
    </>
  )
}