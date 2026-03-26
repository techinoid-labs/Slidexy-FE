import React from 'react'
import PromptToPitchdeck from './components/promptToPitchdeck'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'

export default function page() {
  return (
    <>
    <Header />
    <PromptToPitchdeck />
    <CommunitySection />
    <Footer />
    </>
  )
}