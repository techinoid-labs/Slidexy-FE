import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CTASection from '@/app/components/seo/CTASection'
import CanvaComparison from './canvaComparison'
import React from 'react'

export const metadata = {
  title: "SlideXY vs Canva Pricing & Feature Comparison",
  description: "Detailed feature and pricing comparison between Canva and SlideXY. See why SlideXY is the focused AI presentation generator of choice.",
}

function Canva() {
    return (
        <>
            <Header />
            <CanvaComparison />
            <CTASection
                title="Start building with AI today"
                subtitle="Explore our full suite of professional presentation tools."
                showButton={true}
            />
            <Footer />
        </>
    )
}

export default Canva