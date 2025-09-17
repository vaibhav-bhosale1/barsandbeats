
"use client"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Features from "./components/Features"
import HowItWorks from "./components/HowItWorks"

import CallToAction from "./components/CallToAction"
import Footer from "./components/Footer"

export default function MusicStreamingLanding() {
  return (
         <main className="min-h-screen  overflow-hidden text-black">
      <Header />
      <Hero />
      
      <Features />
      <HowItWorks />
      
      
      <CallToAction />
      <Footer/>
    </main>
  )
}
