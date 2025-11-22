import React from 'react'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'
import PromptToProposal from './components/promptToProposal'

export default function page() {
  return (
    <>
    <Header />
    <PromptToProposal />
    <CommunitySection />
    <Footer />
    </>
  )
}