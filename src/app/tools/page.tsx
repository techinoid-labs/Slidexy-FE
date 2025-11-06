import React from 'react'
import Header from '../components/headers-navbar/Header'
import Footer from '../components/home/Footer'
import CommunitySection from '../components/home/Community'
import OurAiTools from './components/OurAiTools'
import Services from './components/Services'


export default function Tools() {
    return (
        <>
            <Header />
            <OurAiTools />
            <Services />
            <CommunitySection />
            <Footer />
        </>
    )
}
