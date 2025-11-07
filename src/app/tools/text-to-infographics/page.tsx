import React from 'react'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'
import PromptToDeck from '../prompt-to-deck/components/promptToDeck'

export default function page() {
  return (
    <>
    <Header />
    <PromptToDeck />
    <CommunitySection />
    <Footer />
    </>
  )
}