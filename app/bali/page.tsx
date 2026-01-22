"use client"

import { Navbar } from "@/components/navbar"
import { BaliHeroSection } from "@/components/bali/bali-hero-section"
import { BaliCartBuilderSection } from "@/components/bali/bali-cart-builder-section"
import { GallerySection } from "@/components/gallery-section"
import { BaliPricingSection } from "@/components/bali/bali-pricing-section"
import { BaliDimensionsSection } from "@/components/bali/bali-dimensions-section"
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
          <BaliCartBuilderSection />
          <GallerySection />
          <BaliPricingSection />
          <BaliDimensionsSection />
          <TestimonialsSection />
          <BaliContactSection />
          <Footer />
        </main>
      </BaliCartBuilderProvider>
    </ErrorBoundary>
  )
}
