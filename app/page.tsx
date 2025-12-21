"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { CartBuilderSection } from "@/components/cart-builder-section"
import { GallerySection } from "@/components/gallery-section"
import { PricingSection } from "@/components/pricing-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { DimensionsSection } from "@/components/dimensions-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { CartBuilderProvider } from "@/components/cart-builder-context"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Home() {
  return (
    <ErrorBoundary>
      <CartBuilderProvider>
        <main className="min-h-screen">
          <Navbar />
          <HeroSection />
          <HowItWorksSection />
          <CartBuilderSection />
          <GallerySection />
          <PricingSection />
          <TestimonialsSection />
          <DimensionsSection />
          <ContactSection />
          <Footer />
        </main>
      </CartBuilderProvider>
    </ErrorBoundary>
  )
}
