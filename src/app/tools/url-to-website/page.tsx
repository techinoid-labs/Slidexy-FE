import React from 'react'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'
import UrlToWebsite from './components/urlToWebsite'

export default function page() {
  return (
    <>
    <Header />
    <UrlToWebsite />
    <CommunitySection />
    <Footer />
    </>
  )
}