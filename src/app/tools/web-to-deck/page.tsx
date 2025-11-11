import React from 'react'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'
import WebToDeck from './components/webToDeck'

export default function page() {
  return (
    <>
    <Header />
    <WebToDeck />
    <CommunitySection />
    <Footer />
    </>
  )
}