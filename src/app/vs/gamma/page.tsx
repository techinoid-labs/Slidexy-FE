import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CTASection from '@/app/components/seo/CTASection'
import GammaComparison from './gammaComparison'
import React from 'react'

export const metadata = {
  title: "SlideXY vs Gamma Pricing & Comparison | Honest Review",
  description: "Detailed feature and pricing comparison between Gamma and SlideXY. See why SlideXY wins on price and accessibility.",
}

function Gamma() {
    return (
        <>
            <Header />
            <GammaComparison />
            <CTASection
                title="Start building with AI today"
                subtitle="Explore our full suite of professional presentation tools."
                showButton={true}
            />
            <Footer />
        </>
    )
}

export default Gamma