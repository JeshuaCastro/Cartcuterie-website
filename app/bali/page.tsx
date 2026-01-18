"use client"

import { Navbar } from "@/components/navbar"
import { BaliHeroSection } from "@/components/bali/bali-hero-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { BaliCartBuilderSection } from "@/components/bali/bali-cart-builder-section"
import { GallerySection } from "@/components/gallery-section"
import { BaliPricingSection } from "@/components/bali/bali-pricing-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { BaliContactSection } from "@/components/bali/bali-contact-section"
import { Footer } from "@/components/footer"
import { BaliCartBuilderProvider } from "@/components/bali/bali-cart-builder-context"
import { ErrorBoundary } from "@/components/error-boundary"

export default function BaliPage() {
  return (
    <ErrorBoundary>
      <BaliCartBuilderProvider>
        <main className="min-h-screen">
          <Navbar />
          <BaliHeroSection />
          <HowItWorksSection />
          <BaliCartBuilderSection />
          <GallerySection />
          <BaliPricingSection />
          <TestimonialsSection />
          <BaliContactSection />
          <Footer />
        </main>
      </BaliCartBuilderProvider>
    </ErrorBoundary>
  )
}
